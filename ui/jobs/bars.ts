import EffectId from '../../resources/effect_id';
import foodImage from '../../resources/ffxiv/status/food.png';
import { UnreachableCode } from '../../resources/not_reached';
import PartyTracker from '../../resources/party';
import ResourceBar from '../../resources/resourcebar';
import TimerBar from '../../resources/timerbar';
import TimerBox from '../../resources/timerbox';
import Util from '../../resources/util';
import WidgetList, { Toward } from '../../resources/widget_list';
import { Job } from '../../types/job';

import { BuffTracker } from './buff_tracker';
import { getReset, getSetup } from './components/index';
import {
  kMPCombatRate,
  kMPNormalRate,
  kMPTickInterval,
  kMPUI1Rate,
  kMPUI2Rate,
  kMPUI3Rate,
  kWellFedContentTypes,
} from './constants';
import { JobsEventEmitter } from './event_emitter';
import './jobs_config';
import { JobsOptions } from './jobs_options';
import { Player } from './player';
import {
  computeBackgroundColorFrom,
  doesJobNeedMPBar,
  isPvPZone,
  makeAuraTimerIcon,
  RegexesHolder,
} from './utils';

import '../../resources/defaults.css';
import './jobs.css';

// text on the pull countdown.
const kPullText = {
  en: 'Pull',
  de: 'Start',
  fr: 'Attaque',
  ja: 'タゲ取る',
  cn: '开怪',
  ko: '풀링',
};

type JobDomObjects = {
  pullCountdown?: TimerBar;
  leftBuffsList?: WidgetList;
  rightBuffsList?: WidgetList;
  cpBar?: ResourceBar;
  gpBar?: ResourceBar;
  healthBar?: ResourceBar;
  manaBar?: ResourceBar;
  mpTicker?: TimerBar;
};

export interface ResourceBox extends HTMLDivElement {
  parentNode: HTMLElement;
}

export class Bars {
  private o: JobDomObjects = {};
  private foodBuffExpiresTimeMs = 0;
  private gpAlarmReady = false;
  private gpPotion = false;

  private inCombat = false;
  private regexes?: RegexesHolder;
  private partyTracker: PartyTracker;
  private buffTracker?: BuffTracker;
  public ee: JobsEventEmitter;
  public readonly player: Player;

  private contentType?: number;
  private foodBuffTimer = 0;

  public umbralStacks = 0;

  constructor(private options: JobsOptions, o: {
    emitter: JobsEventEmitter;
    player: Player;
    partyTracker: PartyTracker;
  }) {
    // Don't add any notifications if only the buff tracker is being shown.
    if (this.options.JustBuffTracker) {
      this.options.NotifyExpiredProcsInCombatSound = 'disabled';
      this.options.NotifyExpiredProcsInCombat = 0;
    }

    this.ee = o.emitter;
    this.player = o.player;
    this.partyTracker = o.partyTracker;

    // bind party changed event
    this.ee.on('party', (party) => this.partyTracker.onPartyChanged({ party }));

    this.player.on('level', (level, prevLevel) => {
      if (level - prevLevel) {
        this._updateFoodBuff({
          inCombat: this.inCombat,
          foodBuffExpiresTimeMs: this.foodBuffExpiresTimeMs,
          foodBuffTimer: this.foodBuffTimer,
          contentType: this.contentType,
        });
      }
    });

    this.player.on('job', (job) => {
      // FIXME: remove this
      // Update MP ticker as umbral stacks has changed.
      this.umbralStacks = 0;
      if (!Util.isGatheringJob(this.player.job))
        this.gpAlarmReady = false;

      this._setupJobContainers(job);

      const setup = getSetup(job);
      if (setup)
        setup.bind(null, this, this.player)();

      // add food buff trigger
      this.player.onYouGainEffect((id, matches) => {
        if (id === EffectId.WellFed) {
          const seconds = parseFloat(matches.duration ?? '0');
          const now = Date.now(); // This is in ms.
          this.foodBuffExpiresTimeMs = now + (seconds * 1000);
          this._updateFoodBuff({
            inCombat: this.inCombat,
            foodBuffExpiresTimeMs: this.foodBuffExpiresTimeMs,
            foodBuffTimer: this.foodBuffTimer,
            contentType: this.contentType,
          });
        }
      });
      // As you cannot change jobs in combat, we can assume that
      // it is always false here.
      this._updateProcBoxNotifyState(false);

      // TODO: this is always created by _updateJob, so maybe this.o needs be optional?
      if (this.o.leftBuffsList && this.o.rightBuffsList) {
        // Set up the buff tracker after the job bars are created.
        this.buffTracker = new BuffTracker(
          this.options,
          this.player.name,
          this.o.leftBuffsList,
          this.o.rightBuffsList,
          this.partyTracker,
        );
      }
    });

    // update RegexesHolder when the player name changes
    this.player.on('player', ({ name }) => {
      this.regexes = new RegexesHolder(this.options.ParserLanguage, name);
    });

    this.ee.on('battle/in-combat', ({ game }) => {
      this._updateProcBoxNotifyState(game);
      if (this.inCombat !== game) {
        this.inCombat = game;
        this._updateFoodBuff({
          inCombat: this.inCombat,
          foodBuffExpiresTimeMs: this.foodBuffExpiresTimeMs,
          foodBuffTimer: this.foodBuffTimer,
          contentType: this.contentType,
        });
      }

      // make bars transparent when out of combat if requested
      this._updateOpacity(!game || this.options.LowerOpacityOutOfCombat);
    });

    this.ee.on('battle/wipe', () => {
      this._onPartyWipe();
    });

    this.player.on('action/you', (id, matches) => {
      if (this.regexes?.cordialRegex.test(id)) {
        this.gpPotion = true;
        window.setTimeout(() => {
          this.gpPotion = false;
        }, 2000);
      }
      this.buffTracker?.onUseAbility(id, matches);
    });
    this.player.on('action/other', (id, matches) => this.buffTracker?.onUseAbility(id, matches));
    this.player.on(
      'effect/gain/you',
      (id, matches) => this.buffTracker?.onYouGainEffect(id, matches),
    );
    this.player.on('effect/gain', (id, matches) => {
      // mob id starts with '4'
      if (matches.targetId?.startsWith('4'))
        this.buffTracker?.onMobGainsEffect(id, matches);
    });
    this.player.on(
      'effect/lose/you',
      (id, matches) => this.buffTracker?.onYouLoseEffect(id, matches),
    );
    this.player.on('effect/lose', (id, matches) => {
      // mob id starts with '4'
      if (matches.targetId?.startsWith('4'))
        this.buffTracker?.onMobLosesEffect(id, matches);
    });

    this.ee.on('zone/change', (id) => {
      this._updateFoodBuff({
        inCombat: this.inCombat,
        foodBuffExpiresTimeMs: this.foodBuffExpiresTimeMs,
        foodBuffTimer: this.foodBuffTimer,
        contentType: this.contentType,
      });
      if (this.buffTracker)
        this.buffTracker.clear();

      // Hide UI except HP and MP bar if change to pvp area.
      this._updateUIVisibility(isPvPZone(id));
    });

    this.ee.on('log/game', (_log, _line, rawLine) => {
      const m = this.regexes?.countdownStartRegex.exec(rawLine);
      if (m && m.groups?.time) {
        const seconds = parseFloat(m.groups.time);
        this._setPullCountdown(seconds);
      }
      if (this.regexes?.countdownCancelRegex.test(rawLine))
        this._setPullCountdown(0);
      if (Util.isCraftingJob(this.player.job))
        this._onCraftingLog(rawLine);
    });

    this.updateProcBoxNotifyRepeat();
  }

  updateProcBoxNotifyRepeat(): void {
    if (this.options.NotifyExpiredProcsInCombat >= 0) {
      const repeats = this.options.NotifyExpiredProcsInCombat === 0
        ? 'infinite'
        : this.options.NotifyExpiredProcsInCombat.toString();

      document.documentElement.style.setProperty('--proc-box-notify-repeat', repeats);
    }
  }

  _updateUIVisibility(hide?: boolean): void {
    const bars = document.getElementById('bars');
    if (bars)
      bars.classList.toggle('pvp', hide ?? false);
  }

  _setupJobContainers(job: Job): void {
    // if player is in pvp zone, inherit the class
    const inPvPZone = document.getElementById('bars')?.classList.contains('pvp') ?? false;

    let container = document.getElementById('jobs-container');
    if (!container) {
      const root = document.getElementById('container');
      if (!root)
        throw new UnreachableCode();
      container = document.createElement('div');
      container.id = 'jobs-container';
      root.appendChild(container);
    }
    while (container.firstChild)
      container.removeChild(container.firstChild);

    this.o = {};
    container.classList.remove('hide');

    const barsLayoutContainer = document.createElement('div');
    barsLayoutContainer.id = 'jobs';
    container.appendChild(barsLayoutContainer);

    // add job name and role name in classList, e.g. 'warrior' and 'tank'
    barsLayoutContainer.classList.add(job.toLowerCase());
    const role = Util.jobToRole(job);
    if (role !== 'none')
      barsLayoutContainer.classList.add(role.toLowerCase());

    // add pull bar first, which would not affected by the opacity settings
    this.o.pullCountdown = this.addPullCountdownBar();

    const opacityContainer = document.createElement('div');
    opacityContainer.id = 'opacity-container';
    barsLayoutContainer.appendChild(opacityContainer);
    // set opacity to transparent if LowerOpacityOutOfCombat is enabled
    this._updateOpacity(this.options.LowerOpacityOutOfCombat);

    // Holds health/mana.
    const barsContainer = document.createElement('div');
    barsContainer.id = 'bars';
    if (inPvPZone)
      barsContainer.classList.add('pvp');
    opacityContainer.appendChild(barsContainer);

    if (this.options.JustBuffTracker) {
      // Just alias these two together so the rest of the code doesn't have
      // to care that they're the same thing.
      this.o.leftBuffsList = this.o.rightBuffsList = this.addBuffsList({
        id: 'right-side-icons',
        rowcolsize: 20,
        maxnumber: 20,
        toward: 'right down',
      });
      // Hoist the buffs up to hide everything else.
      const buffsContainer = this.o.rightBuffsList.parentElement;
      if (!buffsContainer)
        throw new UnreachableCode();
      barsLayoutContainer.appendChild(buffsContainer);
      barsLayoutContainer.classList.add('justbuffs');
    } else {
      this.o.rightBuffsList = this.addBuffsList({
        id: 'right-side-icons',
        rowcolsize: 7,
        maxnumber: 7,
        toward: 'right down',
      });
      this.o.leftBuffsList = this.addBuffsList({
        id: 'left-side-icons',
        rowcolsize: 7,
        maxnumber: 7,
        toward: 'left down',
      });
    }

    if (Util.isCraftingJob(job)) {
      this.o.cpBar = this.addCPBar();
      // hide bars by default when you are a crafter
      // it would show when you start crafting
      container.classList.add('hide');
      return;
    } else if (Util.isGatheringJob(job)) {
      this.o.gpBar = this.addGPBar();
      return;
    }

    this.o.healthBar = this.addHPBar(this.options.ShowHPNumber.includes(job));

    if (doesJobNeedMPBar(job))
      this.o.manaBar = this.addMPBar(this.options.ShowMPNumber.includes(job));

    if (this.options.ShowMPTicker.includes(job))
      this.o.mpTicker = this.addMPTicker();
  }

  addJobBarContainer(): HTMLElement {
    const id = this.player.job.toLowerCase() + '-bar';
    let container = document.getElementById(id);
    if (!container) {
      container = document.createElement('div');
      container.id = id;
      document.getElementById('bars')?.appendChild(container);
      container.classList.add('bar-container');
    }
    return container;
  }

  addJobBoxContainer(): HTMLElement {
    const id = this.player.job.toLowerCase() + '-boxes';
    let boxes = document.getElementById(id);
    if (!boxes) {
      boxes = document.createElement('div');
      boxes.id = id;
      document.getElementById('bars')?.appendChild(boxes);
      boxes.classList.add('box-container');
    }
    return boxes;
  }

  addResourceBox({ classList }: { classList?: string[] }): ResourceBox {
    const boxes = this.addJobBoxContainer();
    const boxDiv = document.createElement('div');
    if (classList) {
      classList.forEach((className) => {
        boxDiv.classList.add(className, 'resourcebox');
      });
    }
    boxes.appendChild(boxDiv);

    const textDiv = document.createElement('div');
    boxDiv.appendChild(textDiv);
    textDiv.classList.add('text');

    // This asserts that textDiv has a parentNode that is an HTMLElement,
    // which we create above.
    return textDiv as ResourceBox;
  }

  addProcBox({
    id,
    fgColor,
    threshold,
    scale,
    notifyWhenExpired,
  }: {
    id?: string;
    fgColor?: string;
    threshold?: number;
    scale?: number;
    notifyWhenExpired?: boolean;
  }): TimerBox {
    const elementId = this.player.job.toLowerCase() + '-procs';

    let container = id ? document.getElementById(id) : undefined;
    if (!container) {
      container = document.createElement('div');
      container.id = elementId;
      document.getElementById('bars')?.appendChild(container);
      container.classList.add('proc-box');
    }

    const timerBox = TimerBox.create({
      stylefill: 'empty',
      bg: 'black',
      toward: 'bottom',
      threshold: threshold ? threshold : 0,
      hideafter: null,
      roundupthreshold: false,
      valuescale: scale ? scale : 1,
    });
    container.appendChild(timerBox);
    if (fgColor)
      timerBox.fg = computeBackgroundColorFrom(timerBox, fgColor);
    if (id) {
      timerBox.id = id;
      timerBox.classList.add('timer-box');
    }
    if (notifyWhenExpired) {
      timerBox.classList.add('notify-when-expired');
      if (this.options.NotifyExpiredProcsInCombatSound === 'threshold')
        timerBox.onThresholdReached(() => this.playNotification());
      else if (this.options.NotifyExpiredProcsInCombatSound === 'expired')
        timerBox.onExpired(() => this.playNotification());
    }
    return timerBox;
  }

  addTimerBar({
    id,
    fgColor,
  }: {
    id: string;
    fgColor: string;
  }): TimerBar {
    const container = this.addJobBarContainer();

    const timerDiv = document.createElement('div');
    timerDiv.id = id;
    const timer = TimerBar.create();
    container.appendChild(timerDiv);
    timerDiv.appendChild(timer);
    timer.classList.add('timer-bar');

    timer.width = window.getComputedStyle(timerDiv).width;
    timer.height = window.getComputedStyle(timerDiv).height;
    timer.toward = 'left';
    timer.bg = computeBackgroundColorFrom(timer, 'bar-border-color');
    if (fgColor)
      timer.fg = computeBackgroundColorFrom(timer, fgColor);

    return timer;
  }

  addResourceBar({
    id,
    fgColor,
    maxvalue,
  }: {
    id: string;
    fgColor: string;
    maxvalue: number;
  }): ResourceBar {
    const container = this.addJobBarContainer();

    const barDiv = document.createElement('div');
    barDiv.id = id;
    const bar = ResourceBar.create({
      bg: 'rgba(0, 0, 0, 0)',
      maxvalue: maxvalue.toString(),
    });
    container.appendChild(barDiv);
    barDiv.appendChild(bar);
    bar.classList.add('resourcebar');

    bar.fg = computeBackgroundColorFrom(bar, fgColor);
    bar.width = window.getComputedStyle(barDiv).width;
    bar.height = window.getComputedStyle(barDiv).height;

    return bar;
  }

  addPullCountdownBar(): TimerBar {
    const barsLayoutContainer = document.getElementById('jobs');
    if (!barsLayoutContainer)
      throw new UnreachableCode();

    const pullCountdownContainer = document.createElement('div');
    pullCountdownContainer.id = 'pull-bar';
    // Pull counter not affected by opacity option.
    barsLayoutContainer.appendChild(pullCountdownContainer);
    const pullCountdown = TimerBar.create({
      righttext: 'remain',
      // FIXME: create function check parameters with `if (param)` so when
      // we using 0 here, it will just ignore it.
      // should be fixed in the future.
      // hideafter: 0,
      fg: 'rgb(255, 120, 120)',
      lefttext: kPullText[this.options.DisplayLanguage] || kPullText['en'],
    });
    pullCountdown.hideafter = 0;
    pullCountdownContainer.appendChild(pullCountdown);
    pullCountdown.width = window.getComputedStyle(pullCountdownContainer).width;
    pullCountdown.height = window.getComputedStyle(pullCountdownContainer).height;
    pullCountdown.classList.add('lang-' + this.options.DisplayLanguage);

    // reset pull bar when in combat (game)
    this.ee.on('battle/in-combat', (ev) => {
      if (ev.game)
        this._setPullCountdown(0);
    });

    return pullCountdown;
  }

  addCPBar(): ResourceBar {
    const barsContainer = document.getElementById('bars');
    if (!barsContainer)
      throw new UnreachableCode();

    const cpContainer = document.createElement('div');
    cpContainer.id = 'cp-bar';
    barsContainer.appendChild(cpContainer);
    const cpBar = ResourceBar.create({
      centertext: 'maxvalue',
    });
    cpContainer.appendChild(cpBar);
    cpBar.width = window.getComputedStyle(cpContainer).width;
    cpBar.height = window.getComputedStyle(cpContainer).height;
    cpBar.bg = computeBackgroundColorFrom(cpBar, 'bar-border-color');
    cpBar.fg = computeBackgroundColorFrom(cpBar, 'cp-color');
    // update cp
    this.player.on('cp', (data) => {
      this._updateCp(data);
    });

    return cpBar;
  }

  addGPBar(): ResourceBar {
    const barsContainer = document.getElementById('bars');
    if (!barsContainer)
      throw new UnreachableCode();

    const gpContainer = document.createElement('div');
    gpContainer.id = 'gp-bar';
    barsContainer.appendChild(gpContainer);
    const gpBar = ResourceBar.create({
      centertext: 'maxvalue',
    });
    gpContainer.appendChild(gpBar);
    gpBar.width = window.getComputedStyle(gpContainer).width;
    gpBar.height = window.getComputedStyle(gpContainer).height;
    gpBar.bg = computeBackgroundColorFrom(gpBar, 'bar-border-color');
    gpBar.fg = computeBackgroundColorFrom(gpBar, 'gp-color');
    // update gp
    this.player.on('gp', (data) => {
      this._updateGp(data);
    });

    return gpBar;
  }

  addHPBar(showHPNumber?: boolean): ResourceBar {
    const barsContainer = document.getElementById('bars');
    if (!barsContainer)
      throw new UnreachableCode();

    const healthText = showHPNumber ? 'value' : '';

    const healthContainer = document.createElement('div');
    healthContainer.id = 'hp-bar';
    if (showHPNumber)
      healthContainer.classList.add('show-number');
    barsContainer.appendChild(healthContainer);

    const healthBar = ResourceBar.create({
      lefttext: healthText,
    });
    healthContainer.appendChild(healthBar);
    // TODO: Let the component do this dynamically.
    healthBar.width = window.getComputedStyle(healthContainer).width;
    healthBar.height = window.getComputedStyle(healthContainer).height;
    healthBar.bg = computeBackgroundColorFrom(healthBar, 'bar-border-color');
    // update hp
    this.player.on('hp', (data) => {
      this._updateHealth(this.o.healthBar, data);
    });

    return healthBar;
  }

  addMPBar(showMPNumber?: boolean): ResourceBar {
    const barsContainer = document.getElementById('bars');
    if (!barsContainer)
      throw new UnreachableCode();

    const manaText = showMPNumber ? 'value' : '';
    const manaContainer = document.createElement('div');
    manaContainer.id = 'mp-bar';
    barsContainer.appendChild(manaContainer);
    if (showMPNumber)
      manaContainer.classList.add('show-number');

    const manaBar = ResourceBar.create({
      lefttext: manaText,
    });
    manaContainer.appendChild(manaBar);
    // TODO: Let the component do this dynamically.
    manaBar.width = window.getComputedStyle(manaContainer).width;
    manaBar.height = window.getComputedStyle(manaContainer).height;
    manaBar.bg = computeBackgroundColorFrom(manaBar, 'bar-border-color');
    // update mp
    this.player.on('mp', (data) => {
      this._updateMana(data);
    });
    // change color when target is far away
    this.ee.on('battle/target', (target) => {
      if (!this.o.manaBar)
        return;
      if (target && Util.isCasterDpsJob(this.player.job)) {
        if (
          this.options.FarThresholdOffence >= 0 &&
          target.effectiveDistance > this.options.FarThresholdOffence
        ) {
          this.o.manaBar.fg = computeBackgroundColorFrom(this.o.manaBar, 'mp-color.far');
          return;
        }
      }
      this.o.manaBar.fg = computeBackgroundColorFrom(this.o.manaBar, 'mp-color');
    });

    return manaBar;
  }

  addMPTicker(): TimerBar {
    const barsContainer = document.getElementById('bars');
    if (!barsContainer)
      throw new UnreachableCode();

    const mpTickContainer = document.createElement('div');
    mpTickContainer.id = 'mp-tick';
    barsContainer.appendChild(mpTickContainer);

    const mpTicker = TimerBar.create();
    mpTickContainer.appendChild(mpTicker);
    mpTicker.width = window.getComputedStyle(mpTickContainer).width;
    mpTicker.height = window.getComputedStyle(mpTickContainer).height;
    mpTicker.bg = computeBackgroundColorFrom(mpTicker, 'bar-border-color');
    mpTicker.stylefill = 'fill';
    mpTicker.toward = 'right';
    mpTicker.loop = true;
    // update mp ticker
    this.player.on('mp', (data) => {
      this._updateMPTicker(data);
    });
    this.ee.on('battle/in-combat', (ev) => {
      // Hide out of combat if requested
      if (this.o.mpTicker && !this.options.ShowMPTickerOutOfCombat && !ev.game) {
        this.o.mpTicker.duration = 0;
        this.o.mpTicker.stylefill = 'empty';
      }
    });

    return mpTicker;
  }

  addBuffsList(o: {
    id: string;
    rowcolsize: number;
    maxnumber: number;
    toward: Toward;
  }): WidgetList {
    const barsContainer = document.getElementById('bars');
    if (!barsContainer)
      throw new UnreachableCode();

    const rightBuffsContainer = document.createElement('div');
    rightBuffsContainer.id = o.id;
    barsContainer.appendChild(rightBuffsContainer);

    const buffsList = WidgetList.create({
      rowcolsize: o.rowcolsize,
      maxnumber: o.maxnumber,
      toward: o.toward,
      elementwidth: (this.options.BigBuffIconWidth + 2).toString(),
    });
    rightBuffsContainer.appendChild(buffsList);

    return buffsList;
  }

  playNotification(): void {
    const audio = new Audio('../../resources/sounds/freesound/alarm.webm');
    audio.volume = 0.3;
    void audio.play();
  }

  _updateHealth(
    healthBar: ResourceBar | undefined,
    data: {
      hp: number;
      maxHp: number;
      shield: number;
    },
  ): void {
    if (!healthBar)
      return;
    healthBar.value = data.hp.toString();
    healthBar.maxvalue = data.maxHp.toString();
    healthBar.extravalue = data.shield.toString();

    const percent = (data.hp + data.shield) / data.maxHp;

    if (data.maxHp > 0 && percent < this.options.LowHealthThresholdPercent)
      healthBar.fg = computeBackgroundColorFrom(healthBar, 'hp-color.low');
    else if (data.maxHp > 0 && percent < this.options.MidHealthThresholdPercent)
      healthBar.fg = computeBackgroundColorFrom(healthBar, 'hp-color.mid');
    else
      healthBar.fg = computeBackgroundColorFrom(healthBar, 'hp-color');
  }

  _updateProcBoxNotifyState(inCombat: boolean): void {
    if (this.options.NotifyExpiredProcsInCombat >= 0) {
      const boxes = document.getElementsByClassName('proc-box');
      for (const box of boxes) {
        if (inCombat) {
          box.classList.add('in-combat');
          for (const child of box.children)
            child.classList.remove('expired');
        } else {
          box.classList.remove('in-combat');
        }
      }
    }
  }

  _updateMPTicker(data: {
    mp: number;
    maxMp: number;
    prevMp: number;
  }): void {
    if (!this.o.mpTicker)
      return;
    const delta = data.mp - data.prevMp;

    this.o.mpTicker.stylefill = 'fill';

    const baseTick = this.inCombat ? kMPCombatRate : kMPNormalRate;
    let umbralTick = 0;
    if (this.umbralStacks === -1)
      umbralTick = kMPUI1Rate;
    if (this.umbralStacks === -2)
      umbralTick = kMPUI2Rate;
    if (this.umbralStacks === -3)
      umbralTick = kMPUI3Rate;

    const mpTick = Math.floor(data.maxMp * baseTick) + Math.floor(data.maxMp * umbralTick);
    if (delta === mpTick && this.umbralStacks <= 0) // MP ticks disabled in AF
      this.o.mpTicker.duration = kMPTickInterval;

    // Update color based on the astral fire/ice state
    let colorTag = 'mp-tick-color';
    if (this.umbralStacks < 0)
      colorTag = 'mp-tick-color.ice';
    if (this.umbralStacks > 0)
      colorTag = 'mp-tick-color.fire';
    this.o.mpTicker.fg = computeBackgroundColorFrom(this.o.mpTicker, colorTag);
  }

  _updateMana(data: {
    mp: number;
    maxMp: number;
    prevMp: number;
  }): void {
    this._updateMPTicker(data);

    if (!this.o.manaBar)
      return;
    this.o.manaBar.value = data.mp.toString();
    this.o.manaBar.maxvalue = data.maxMp.toString();
    let lowMP = -1;
    let mediumMP = -1;

    if (this.player.job === 'DRK') {
      lowMP = this.options.DrkLowMPThreshold;
      mediumMP = this.options.DrkMediumMPThreshold;
    } else if (this.player.job === 'PLD') {
      lowMP = this.options.PldLowMPThreshold;
      mediumMP = this.options.PldMediumMPThreshold;
    } else if (this.player.job === 'BLM') {
      lowMP = this.options.BlmLowMPThreshold;
      mediumMP = this.options.BlmMediumMPThreshold;
    }

    if (lowMP >= 0 && data.mp <= lowMP)
      this.o.manaBar.fg = computeBackgroundColorFrom(this.o.manaBar, 'mp-color.low');
    else if (mediumMP >= 0 && data.mp <= mediumMP)
      this.o.manaBar.fg = computeBackgroundColorFrom(this.o.manaBar, 'mp-color.medium');
    else
      this.o.manaBar.fg = computeBackgroundColorFrom(this.o.manaBar, 'mp-color');
  }

  _updateCp(data: {
    cp: number;
    maxCp: number;
  }): void {
    if (!this.o.cpBar)
      return;
    this.o.cpBar.value = data.cp.toString();
    this.o.cpBar.maxvalue = data.maxCp.toString();
  }

  _updateGp(data: {
    gp: number;
    maxGp: number;
  }): void {
    if (!this.o.gpBar)
      return;
    this.o.gpBar.value = data.gp.toString();
    this.o.gpBar.maxvalue = data.maxGp.toString();

    // GP Alarm
    if (data.gp < this.options.GpAlarmPoint) {
      this.gpAlarmReady = true;
    } else if (this.gpAlarmReady && !this.gpPotion && data.gp >= this.options.GpAlarmPoint) {
      this.gpAlarmReady = false;
      const audio = new Audio('../../resources/sounds/freesound/power_up.webm');
      audio.volume = this.options.GpAlarmSoundVolume;
      void audio.play();
    }
  }

  _updateOpacity(transparent: boolean): void {
    const opacityContainer = document.getElementById('opacity-container');
    if (!opacityContainer)
      return;
    opacityContainer.style.opacity = transparent
      ? this.options.OpacityOutOfCombat.toString()
      : '1.0';
  }

  _updateFoodBuff(o: {
    inCombat: boolean;
    contentType?: number;
    foodBuffExpiresTimeMs: number;
    foodBuffTimer: number;
  }): number | undefined {
    // Non-combat jobs don't set up the left buffs list.
    if (!this.o.leftBuffsList)
      return;

    const CanShowWellFedWarning = () => {
      if (!this.options.HideWellFedAboveSeconds)
        return false;
      if (o.inCombat)
        return false;
      if (o.contentType === undefined)
        return false;
      return kWellFedContentTypes.includes(o.contentType);
    };

    // Returns the number of ms until it should be shown. If <= 0, show it.
    const TimeToShowWellFedWarning = () => {
      const nowMs = Date.now();
      const showAtMs = o.foodBuffExpiresTimeMs - (this.options.HideWellFedAboveSeconds * 1000);
      return showAtMs - nowMs;
    };

    window.clearTimeout(o.foodBuffTimer);
    o.foodBuffTimer = 0;

    const canShow = CanShowWellFedWarning();
    const showAfterMs = TimeToShowWellFedWarning();

    if (!canShow || showAfterMs > 0) {
      this.o.leftBuffsList.removeElement('foodbuff');
      if (canShow)
        return window.setTimeout(this._updateFoodBuff.bind(this), showAfterMs);
    } else {
      const div = makeAuraTimerIcon(
        'foodbuff',
        -1,
        1,
        this.options.BigBuffIconWidth,
        this.options.BigBuffIconHeight,
        '',
        this.options.BigBuffBarHeight,
        this.options.BigBuffTextHeight,
        'white',
        this.options.BigBuffBorderSize,
        'yellow',
        'yellow',
        foodImage,
      );
      this.o.leftBuffsList.addElement('foodbuff', div, -1);
    }
  }

  _onPartyWipe(): void {
    this.buffTracker?.clear();
    // Reset job-specific ui
    const reset = getReset(this.player.job);
    if (reset)
      reset.bind(null, this, this.player)();
  }

  _setPullCountdown(seconds: number): void {
    if (!this.o.pullCountdown)
      return;

    const inCountdown = seconds > 0;
    const showingCountdown = this.o.pullCountdown.duration ?? 0 > 0;
    if (inCountdown !== showingCountdown) {
      this.o.pullCountdown.duration = seconds;
      if (inCountdown && this.options.PlayCountdownSound) {
        const audio = new Audio('../../resources/sounds/freesound/sonar.webm');
        audio.volume = 0.3;
        void audio.play();
      }
    }
  }

  _onCraftingLog(message: string): void {
    if (!this.regexes)
      return;

    const container = document.getElementById('jobs-container');
    if (!container)
      throw new UnreachableCode();

    // Hide CP Bar when not crafting
    const anyRegexMatched = (line: string, array: RegExp[]) =>
      array.some((regex) => regex.test(line));

    let crafting = false;

    if (anyRegexMatched(message, this.regexes.craftingStartRegexes))
      crafting = true;
    if (anyRegexMatched(message, this.regexes.craftingStopRegexes)) {
      crafting = false;
    } else {
      crafting = !this.regexes.craftingFinishRegexes.some((regex) => {
        const m = regex.exec(message)?.groups;
        return m && (!m.player || m.player === this.player.name);
      });
    }

    // if crafting, hide it; otherwise, show it
    container.classList.toggle('hide', crafting);
  }
}
