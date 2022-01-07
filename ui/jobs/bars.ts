import foodImage from '../../resources/ffxiv/status/food.png';
import { UnreachableCode } from '../../resources/not_reached';
import ResourceBar from '../../resources/resourcebar';
import TimerBar from '../../resources/timerbar';
import TimerBox from '../../resources/timerbox';
import Util from '../../resources/util';
import WidgetList, { Toward } from '../../resources/widget_list';
import { Job } from '../../types/job';

import { ShouldShow } from './components/base';
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
import { computeBackgroundColorFrom, makeAuraTimerIcon } from './utils';

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
  private jobsContainer: HTMLElement;
  public o: JobDomObjects = {};

  public ee: JobsEventEmitter;
  public readonly player: Player;

  constructor(private options: JobsOptions, o: {
    emitter: JobsEventEmitter;
    player: Player;
  }) {
    // Don't add any notifications if only the buff tracker is being shown.
    if (this.options.JustBuffTracker) {
      this.options.NotifyExpiredProcsInCombatSound = 'disabled';
      this.options.NotifyExpiredProcsInCombat = 0;
    }

    this.ee = o.emitter;
    this.player = o.player;

    const container = document.getElementById('jobs-container');
    if (!container)
      throw new UnreachableCode();

    this.jobsContainer = container;

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

  _updateUIVisibility(inPvP?: boolean): void {
    this.jobsContainer.dataset.inpvp = inPvP ? 'true' : 'false';
  }

  _setupJobContainers(job: Job, show: ShouldShow): void {
    const shouldShow = {
      buffList: true,
      pullBar: true,
      hpBar: true,
      mpBar: true,
      cpBar: false,
      gpBar: false,
      mpTicker: false,
      ...show,
    };
    // if player is in pvp zone, inherit the class
    const inPvPZone = document.getElementById('bars')?.classList.contains('pvp') ?? false;

    while (this.jobsContainer.firstChild)
      this.jobsContainer.removeChild(this.jobsContainer.firstChild);

    this.o = {};
    this.jobsContainer.classList.remove('hide');

    const barsLayoutContainer = document.createElement('div');
    barsLayoutContainer.id = 'jobs';
    this.jobsContainer.appendChild(barsLayoutContainer);

    // add job name and role name in classList, e.g. 'warrior' and 'tank'
    barsLayoutContainer.classList.add(job.toLowerCase());
    const role = Util.jobToRole(job);
    if (role !== 'none')
      barsLayoutContainer.classList.add(role.toLowerCase());

    if (shouldShow.pullBar) {
      // add pull bar first, which would not affected by the opacity settings
      this.o.pullCountdown = this.addPullCountdownBar();
    }

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

    const procsContainer = document.createElement('div');
    procsContainer.id = 'procs-container';
    procsContainer.classList.toggle('compact', this.options.CompactView);
    opacityContainer.appendChild(procsContainer);

    if (shouldShow.buffList) {
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
    }

    if (shouldShow.cpBar) {
      this.o.cpBar = this.addCPBar();
      // hide bars by default when you are a crafter
      // it would show when you start crafting
      this.jobsContainer.classList.add('hide');
    } else if (shouldShow.gpBar) {
      this.o.gpBar = this.addGPBar();
    }

    if (shouldShow.hpBar)
      this.o.healthBar = this.addHPBar(this.options.ShowHPNumber.includes(job));

    if (shouldShow.mpBar)
      this.o.manaBar = this.addMPBar(this.options.ShowMPNumber.includes(job));

    if (shouldShow.mpTicker)
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
    }

    document.getElementById('procs-container')?.appendChild(container);

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
    this.ee.on('battle/in-combat', (ev) => {
      // Hide out of combat if requested
      if (mpTicker && !this.options.ShowMPTickerOutOfCombat && !ev.game) {
        mpTicker.duration = 0;
        mpTicker.stylefill = 'empty';
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
    prevMp?: number;
    umbralStacks?: number;
    inCombat: boolean;
  }): void {
    if (!this.o.mpTicker)
      return;

    const prevMp = data.prevMp ?? parseInt(this.o.manaBar?.value ?? '0');
    const delta = data.mp - prevMp;

    this.o.mpTicker.stylefill = 'fill';

    const baseTick = data.inCombat ? kMPCombatRate : kMPNormalRate;
    let umbralTick = 0;
    data.umbralStacks ??= 0;
    if (data.umbralStacks === -1)
      umbralTick = kMPUI1Rate;
    if (data.umbralStacks === -2)
      umbralTick = kMPUI2Rate;
    if (data.umbralStacks === -3)
      umbralTick = kMPUI3Rate;

    const mpTick = Math.floor(data.maxMp * baseTick) + Math.floor(data.maxMp * umbralTick);
    if (delta === mpTick && data.umbralStacks <= 0) // MP ticks disabled in AF
      this.o.mpTicker.duration = kMPTickInterval;

    // Update color based on the astral fire/ice state
    let colorTag = 'mp-tick-color';
    if (data.umbralStacks < 0)
      colorTag = 'mp-tick-color.ice';
    if (data.umbralStacks > 0)
      colorTag = 'mp-tick-color.fire';
    this.o.mpTicker.fg = computeBackgroundColorFrom(this.o.mpTicker, colorTag);
  }

  _updateMana(data: {
    mp: number;
    maxMp: number;
    prevMp: number;
  }): void {
    if (!this.o.manaBar)
      return;
    this.o.manaBar.value = data.mp.toString();
    this.o.manaBar.maxvalue = data.maxMp.toString();
  }

  updateMpBarColor(data: {
    mp: number;
    far?: boolean;
  }): void {
    if (!this.o.manaBar)
      return;

    if (data.far) {
      this.o.manaBar.fg = computeBackgroundColorFrom(this.o.manaBar, 'mp-color.far');
      return;
    }

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
  }

  _playGpAlarm(): void {
    const audio = new Audio('../../resources/sounds/freesound/power_up.webm');
    audio.volume = this.options.GpAlarmSoundVolume;
    void audio.play();
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

  setJobsContainerVisibility(show?: boolean): void {
    this.jobsContainer.classList.toggle('hide', !show);
  }
}
