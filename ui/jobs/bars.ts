import EffectId from '../../resources/effect_id';
import foodImage from '../../resources/ffxiv/status/food.png';
import logDefinitions from '../../resources/netlog_defs';
import { UnreachableCode } from '../../resources/not_reached';
import PartyTracker from '../../resources/party';
import ResourceBar from '../../resources/resourcebar';
import TimerBar from '../../resources/timerbar';
import TimerBox from '../../resources/timerbox';
import Util from '../../resources/util';
import WidgetList from '../../resources/widget_list';
import { EventResponses, JobDetail } from '../../types/event';
import { Job } from '../../types/job';
import { NetFields } from '../../types/net_fields';
import { ToMatches } from '../../types/net_matches';

import { BuffTracker } from './buff_tracker';
import ComboTracker, { ComboCallback } from './combo_tracker';
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
  calcGCDFromStat,
  computeBackgroundColorFrom,
  doesJobNeedMPBar,
  isPvPZone,
  makeAuraTimerIcon,
  normalizeLogLine,
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
  leftBuffsContainer?: HTMLElement;
  leftBuffsList?: WidgetList;
  rightBuffsContainer?: HTMLElement;
  rightBuffsList?: WidgetList;
  cpContainer?: HTMLElement;
  cpBar?: ResourceBar;
  gpContainer?: HTMLElement;
  gpBar?: ResourceBar;
  healthContainer?: HTMLElement;
  healthBar?: ResourceBar;
  manaContainer?: HTMLElement;
  manaBar?: ResourceBar;
  mpTickContainer?: HTMLElement;
  mpTicker?: TimerBar;
};

type GainCallback = (id: string, matches: Partial<ToMatches<NetFields['GainsEffect']>>) => void;
type LoseCallback = (id: string, matches: Partial<ToMatches<NetFields['LosesEffect']>>) => void;
type AbilityCallback = (id: string, matches: Partial<ToMatches<NetFields['Ability']>>) => void;

// Map of job to (e: JobDetail[job]) => void.  This prevents having to spell out every job,
// for setters and calling.  jobDetail is also `unknown` inside of _onPlayerChanged so
// even if everything else was explicit, there'd be no way to handle this.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JobFuncMap = { [job in Job]?: (e: any) => void };

export interface ResourceBox extends HTMLDivElement {
  parentNode: HTMLElement;
}

export class Bars {
  private init = false;
  private o: JobDomObjects = {};
  private me?: string;
  // private hp = 0;
  // private maxHP = 0;
  // private currentShield = 0;
  // private mp = 0;
  // private prevMP = 0;
  // private maxMP = 0;
  // private cp = 0;
  // private maxCP = 0;
  // private gp = 0;
  // private maxGP = 0;
  // private distance = -1;
  private foodBuffExpiresTimeMs = 0;
  private gpAlarmReady = false;
  private gpPotion = false;

  private inCombat = false;
  private regexes?: RegexesHolder;
  private partyTracker: PartyTracker = new PartyTracker();
  private buffTracker?: BuffTracker;
  private ee: JobsEventEmitter = new JobsEventEmitter();
  private readonly player: Player;

  private contentType?: number;
  private isPVPZone = false;
  private crafting = false;
  private foodBuffTimer = 0;

  private dotTarget: string[] = [];
  private trackedDoTs: string[] = [];
  private lastAttackedDotTarget?: string;
  private comboFuncs: ComboCallback[] = [];
  private jobFuncs: JobFuncMap = {};

  private gainEffectFuncMap: { [effectId: string]: GainCallback } = {};
  private loseEffectFuncMap: { [effectId: string]: LoseCallback } = {};
  private mobGainEffectFromYouFuncMap: { [effectId: string]: GainCallback } = {};
  private mobLoseEffectFromYouFuncMap: { [effectId: string]: LoseCallback } = {};
  private abilityFuncMap: { [abilityId: string]: AbilityCallback } = {};
  private statChangeFuncMap: { [job: string]: (() => void) } = {};

  public level = 0;
  public job: Job = 'NONE';
  public skillSpeed = 0;
  public spellSpeed = 0;
  public speedBuffs = {
    presenceOfMind: false,
    shifu: false,
    huton: false,
    paeonStacks: 0,
    museStacks: 0,
    circleOfPower: false,
  };
  public umbralStacks = 0;

  public combo: ComboTracker;
  public changeZoneFuncs: ((e: EventResponses['ChangeZone']) => void)[] = [];
  public updateDotTimerFuncs: (() => void)[] = [];

  constructor(private options: JobsOptions) {
    // Don't add any notifications if only the buff tracker is being shown.
    if (this.options.JustBuffTracker) {
      this.options.NotifyExpiredProcsInCombatSound = 'disabled';
      this.options.NotifyExpiredProcsInCombat = 0;
    }

    this.combo = ComboTracker.setup(this._onComboChange.bind(this));
    this.player = this.ee.player;

    this.ee.on('player/level', (level) => {
      if (level)
        this._updateFoodBuff();
    });

    this.ee.on('player/hp', ({ hp }) => {
      if (hp === 0)
        this.combo.AbortCombo();
    });

    this.ee.on('player/job', (job) => {
      // Combos are job specific.
      this.combo.AbortCombo();
      // FIXME: remove this
      // Update MP ticker as umbral stacks has changed.
      this.umbralStacks = 0;
      if (!Util.isGatheringJob(this.job))
        this.gpAlarmReady = false;

      this._updateJob(job);
      this._updateProcBoxNotifyState();

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

    this.ee.on('player/job-detail', (job, jobDetail) => {
      this.jobFuncs[job]?.(jobDetail);
    });

    // update RegexesHolder when the player name changes
    this.ee.on('player', ({ name }) => {
      this.regexes = new RegexesHolder(this.options.ParserLanguage, name);
      // FIXME: remove this after migrate to this.player.name
      this.me = name;
      // mark it initialized
      this.init = true;
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

  get gcdSkill(): number {
    return calcGCDFromStat(this, this.skillSpeed);
  }

  get gcdSpell(): number {
    return calcGCDFromStat(this, this.spellSpeed);
  }

  _updateUIVisibility(): void {
    const bars = document.getElementById('bars');
    if (bars) {
      const barList = bars.children;
      for (const bar of barList) {
        if (!(bar instanceof HTMLElement))
          continue;
        if (bar.id === 'hp-bar' || bar.id === 'mp-bar')
          continue;
        if (this.isPVPZone)
          bar.style.display = 'none';
        else
          bar.style.display = '';
      }
    }
  }

  _updateJob(job: Job): void {
    this.comboFuncs = [];
    this.jobFuncs = {};
    this.changeZoneFuncs = [];
    this.gainEffectFuncMap = {};
    this.mobGainEffectFromYouFuncMap = {};
    this.mobLoseEffectFromYouFuncMap = {};
    this.loseEffectFuncMap = {};
    this.statChangeFuncMap = {};
    this.abilityFuncMap = {};
    this.lastAttackedDotTarget = undefined;
    this.dotTarget = [];

    this.gainEffectFuncMap[EffectId.WellFed] = (_id, matches) => {
      const seconds = parseFloat(matches.duration ?? '0');
      const now = Date.now(); // This is in ms.
      this.foodBuffExpiresTimeMs = now + (seconds * 1000);
      this._updateFoodBuff();
    };

    let container = document.getElementById('jobs-container');
    if (!container) {
      const root = document.getElementById('container');
      if (!root)
        throw new UnreachableCode();
      container = document.createElement('div');
      container.id = 'jobs-container';
      root.appendChild(container);
    }
    while (container.childNodes[0])
      container.removeChild(container.childNodes[0]);

    this.o = {};
    container.classList.remove('hide');

    const barsLayoutContainer = document.createElement('div');
    barsLayoutContainer.id = 'jobs';
    container.appendChild(barsLayoutContainer);

    barsLayoutContainer.classList.add(job.toLowerCase());
    if (Util.isTankJob(job))
      barsLayoutContainer.classList.add('tank');
    else if (Util.isHealerJob(job))
      barsLayoutContainer.classList.add('healer');
    else if (Util.isDpsJob(job))
      barsLayoutContainer.classList.add('dps');
    else if (Util.isCraftingJob(job))
      barsLayoutContainer.classList.add('crafting');
    else if (Util.isGatheringJob(job))
      barsLayoutContainer.classList.add('gathering');

    const pullCountdownContainer = document.createElement('div');
    pullCountdownContainer.id = 'pull-bar';
    // Pull counter not affected by opacity option.
    barsLayoutContainer.appendChild(pullCountdownContainer);
    this.o.pullCountdown = TimerBar.create();
    pullCountdownContainer.appendChild(this.o.pullCountdown);

    const opacityContainer = document.createElement('div');
    opacityContainer.id = 'opacity-container';
    barsLayoutContainer.appendChild(opacityContainer);
    // set opacity to transparent if LowerOpacityOutOfCombat is enabled
    this._updateOpacity(this.options.LowerOpacityOutOfCombat);
    // update opacity when in combat
    this.ee.on('battle/in-combat', (ev) => {
      this._updateOpacity(!ev.game || this.options.LowerOpacityOutOfCombat);
    });

    // Holds health/mana.
    const barsContainer = document.createElement('div');
    barsContainer.id = 'bars';
    opacityContainer.appendChild(barsContainer);

    this.o.pullCountdown.width = window.getComputedStyle(pullCountdownContainer).width;
    this.o.pullCountdown.height = window.getComputedStyle(pullCountdownContainer).height;
    this.o.pullCountdown.lefttext = kPullText[this.options.DisplayLanguage] || kPullText['en'];
    this.o.pullCountdown.righttext = 'remain';
    this.o.pullCountdown.hideafter = 0;
    this.o.pullCountdown.fg = 'rgb(255, 120, 120)';
    this.o.pullCountdown.classList.add('lang-' + this.options.DisplayLanguage);
    // reset pull bar when in combat (game)
    this.ee.on('battle/in-combat', (ev) => {
      if (ev.game)
        this._setPullCountdown(0);
    });

    this.o.rightBuffsContainer = document.createElement('div');
    this.o.rightBuffsContainer.id = 'right-side-icons';
    barsContainer.appendChild(this.o.rightBuffsContainer);

    this.o.rightBuffsList = WidgetList.create({
      rowcolsize: 7,
      maxnumber: 7,
      toward: 'right down',
      elementwidth: (this.options.BigBuffIconWidth + 2).toString(),
    });
    this.o.rightBuffsContainer.appendChild(this.o.rightBuffsList);

    if (this.options.JustBuffTracker) {
      // Just alias these two together so the rest of the code doesn't have
      // to care that they're the same thing.
      this.o.leftBuffsList = this.o.rightBuffsList;
      this.o.rightBuffsList.rowcolsize = 20;
      this.o.rightBuffsList.maxnumber = 20;
      // Hoist the buffs up to hide everything else.
      barsLayoutContainer.appendChild(this.o.rightBuffsContainer);
      barsLayoutContainer.classList.add('justbuffs');
    } else {
      this.o.leftBuffsContainer = document.createElement('div');
      this.o.leftBuffsContainer.id = 'left-side-icons';
      barsContainer.appendChild(this.o.leftBuffsContainer);

      this.o.leftBuffsList = WidgetList.create({
        rowcolsize: 7,
        maxnumber: 7,
        toward: 'left down',
        elementwidth: (this.options.BigBuffIconWidth + 2).toString(),
      });
      this.o.leftBuffsContainer.appendChild(this.o.leftBuffsList);
    }

    if (Util.isCraftingJob(job)) {
      // set opacityContainer to be non-transparent when player is a crafter
      this._updateOpacity(true);

      this.o.cpContainer = document.createElement('div');
      this.o.cpContainer.id = 'cp-bar';
      barsContainer.appendChild(this.o.cpContainer);
      this.o.cpBar = ResourceBar.create({
        centertext: 'maxvalue',
      });
      this.o.cpContainer.appendChild(this.o.cpBar);
      this.o.cpBar.width = window.getComputedStyle(this.o.cpContainer).width;
      this.o.cpBar.height = window.getComputedStyle(this.o.cpContainer).height;
      this.o.cpBar.bg = computeBackgroundColorFrom(this.o.cpBar, 'bar-border-color');
      this.o.cpBar.fg = computeBackgroundColorFrom(this.o.cpBar, 'cp-color');
      // update cp
      this.ee.on('player/cp', (data) => {
        this._updateCp(data);
      });
      container.classList.add('hide');
      return;
    } else if (Util.isGatheringJob(job)) {
      // set opacityContainer to be non-transparent when player is a gatherer
      this._updateOpacity(true);

      this.o.gpContainer = document.createElement('div');
      this.o.gpContainer.id = 'gp-bar';
      barsContainer.appendChild(this.o.gpContainer);
      this.o.gpBar = ResourceBar.create({
        centertext: 'maxvalue',
      });
      this.o.gpContainer.appendChild(this.o.gpBar);
      this.o.gpBar.width = window.getComputedStyle(this.o.gpContainer).width;
      this.o.gpBar.height = window.getComputedStyle(this.o.gpContainer).height;
      this.o.gpBar.bg = computeBackgroundColorFrom(this.o.gpBar, 'bar-border-color');
      this.o.gpBar.fg = computeBackgroundColorFrom(this.o.gpBar, 'gp-color');
      // update gp
      this.ee.on('player/gp', (data) => {
        this._updateGp(data);
      });
      return;
    }

    const showHPNumber = this.options.ShowHPNumber.includes(job);
    const showMPNumber = this.options.ShowMPNumber.includes(job);
    const showMPTicker = this.options.ShowMPTicker.includes(job);

    const healthText = showHPNumber ? 'value' : '';
    const manaText = showMPNumber ? 'value' : '';

    this.o.healthContainer = document.createElement('div');
    this.o.healthContainer.id = 'hp-bar';
    if (showHPNumber)
      this.o.healthContainer.classList.add('show-number');
    barsContainer.appendChild(this.o.healthContainer);

    this.o.healthBar = ResourceBar.create({
      lefttext: healthText,
    });
    this.o.healthContainer.appendChild(this.o.healthBar);
    // TODO: Let the component do this dynamically.
    this.o.healthBar.width = window.getComputedStyle(this.o.healthContainer).width;
    this.o.healthBar.height = window.getComputedStyle(this.o.healthContainer).height;
    this.o.healthBar.bg = computeBackgroundColorFrom(this.o.healthBar, 'bar-border-color');
    // update hp
    this.ee.on('player/hp', (data) => {
      this._updateHealth(data);
    });

    if (doesJobNeedMPBar(job)) {
      this.o.manaContainer = document.createElement('div');
      this.o.manaContainer.id = 'mp-bar';
      barsContainer.appendChild(this.o.manaContainer);
      if (showMPNumber)
        this.o.manaContainer.classList.add('show-number');

      this.o.manaBar = ResourceBar.create({
        lefttext: manaText,
      });
      this.o.manaContainer.appendChild(this.o.manaBar);
      // TODO: Let the component do this dynamically.
      this.o.manaBar.width = window.getComputedStyle(this.o.manaContainer).width;
      this.o.manaBar.height = window.getComputedStyle(this.o.manaContainer).height;
      this.o.manaBar.bg = computeBackgroundColorFrom(this.o.manaBar, 'bar-border-color');
      // update mp
      this.ee.on('player/mp', (data) => {
        this._updateMana(data);
      });
      // change color when target is far away
      this.ee.on('battle/target', (target) => {
        if (!this.o.manaBar)
          return;
        if (target && Util.isCasterDpsJob(job)) {
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
    }

    if (showMPTicker) {
      this.o.mpTickContainer = document.createElement('div');
      this.o.mpTickContainer.id = 'mp-tick';
      barsContainer.appendChild(this.o.mpTickContainer);

      this.o.mpTicker = TimerBar.create();
      this.o.mpTickContainer.appendChild(this.o.mpTicker);
      this.o.mpTicker.width = window.getComputedStyle(this.o.mpTickContainer).width;
      this.o.mpTicker.height = window.getComputedStyle(this.o.mpTickContainer).height;
      this.o.mpTicker.bg = computeBackgroundColorFrom(this.o.mpTicker, 'bar-border-color');
      this.o.mpTicker.stylefill = 'fill';
      this.o.mpTicker.toward = 'right';
      this.o.mpTicker.loop = true;
      // update mp ticker
      this.ee.on('player/mp', (data) => {
        this._updateMPTicker(data);
      });
      this.ee.on('battle/in-combat', (ev) => {
        // Hide out of combat if requested
        if (this.o.mpTicker && !this.options.ShowMPTickerOutOfCombat && !ev.game) {
          this.o.mpTicker.duration = 0;
          this.o.mpTicker.stylefill = 'empty';
        }
      });
    }

    const setup = getSetup(job);
    if (setup)
      setup.bind(null, this)();

    this._validateKeys();

    // Many jobs use the gcd to calculate thresholds and value scaling.
    // Run this initially to set those values.
    this._updateJobBarGCDs();

    // Hide UI except HP and MP bar if in pvp area.
    this._updateUIVisibility();

    // set up DoT effect ids for tracking target
    this.trackedDoTs = Object.keys(this.mobGainEffectFromYouFuncMap);
  }

  _validateKeys(): void {
    // Keys in JavaScript are converted to strings, so test string equality
    // here to verify that effects and abilities have been spelled correctly.
    for (const key in this.abilityFuncMap) {
      if (key === 'undefined')
        console.error('undefined key in abilityFuncMap');
    }
    for (const key in this.gainEffectFuncMap) {
      if (key === 'undefined')
        console.error('undefined key in gainEffectFuncMap');
    }
    for (const key in this.loseEffectFuncMap) {
      if (key === 'undefined')
        console.error('undefined key in loseEffectFuncMap');
    }
  }

  addJobBarContainer(): HTMLElement {
    const id = this.job.toLowerCase() + '-bar';
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
    const id = this.job.toLowerCase() + '-boxes';
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
    const elementId = this.job.toLowerCase() + '-procs';

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

  playNotification(): void {
    const audio = new Audio('../../resources/sounds/freesound/alarm.webm');
    audio.volume = 0.3;
    void audio.play();
  }

  onCombo(callback: ComboCallback): void {
    this.comboFuncs.push(callback);
  }

  onMobGainsEffectFromYou(effectIds: string | string[], callback: GainCallback): void {
    if (Array.isArray(effectIds))
      effectIds.forEach((id) => this.mobGainEffectFromYouFuncMap[id] = callback);
    else
      this.mobGainEffectFromYouFuncMap[effectIds] = callback;
  }

  onMobLosesEffectFromYou(effectIds: string | string[], callback: LoseCallback): void {
    if (Array.isArray(effectIds))
      effectIds.forEach((id) => this.mobLoseEffectFromYouFuncMap[id] = callback);
    else
      this.mobLoseEffectFromYouFuncMap[effectIds] = callback;
  }

  onYouGainEffect(effectIds: string | string[], callback: GainCallback): void {
    if (Array.isArray(effectIds))
      effectIds.forEach((id) => this.gainEffectFuncMap[id] = callback);
    else
      this.gainEffectFuncMap[effectIds] = callback;
  }

  onYouLoseEffect(effectIds: string | string[], callback: LoseCallback): void {
    if (Array.isArray(effectIds))
      effectIds.forEach((id) => this.loseEffectFuncMap[id] = callback);
    else
      this.loseEffectFuncMap[effectIds] = callback;
  }

  onJobDetailUpdate<JobKey extends keyof JobDetail>(
    job: JobKey,
    callback: (e: JobDetail[JobKey]) => void,
  ): void {
    // This prevents having separate onXXXJobDetailUpdate function which take explicit callbacks
    // so that the lookup into jobFuncs can be statically typed.  Honestly, JobDetail is already
    // obnoxious enough to use in TypeScript that we probably need to rethink how it is delivered.

    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-explicit-any
    this.jobFuncs[job] = callback as any;
  }

  onStatChange(job: string, callback: () => void): void {
    this.statChangeFuncMap[job] = callback;
  }

  onUseAbility(abilityIds: string | string[], callback: AbilityCallback): void {
    if (Array.isArray(abilityIds))
      abilityIds.forEach((id) => this.abilityFuncMap[id] = callback);
    else
      this.abilityFuncMap[abilityIds] = callback;
  }

  _onComboChange(skill?: string): void {
    this.comboFuncs.forEach((func) => func(skill));
  }

  _updateJobBarGCDs(): void {
    const f = this.statChangeFuncMap[this.job];
    if (f)
      f();
  }

  _updateHealth(data: {
    hp: number;
    maxHp: number;
    shield: number;
  }): void {
    if (!this.o.healthBar)
      return;
    this.o.healthBar.value = data.hp.toString();
    this.o.healthBar.maxvalue = data.maxHp.toString();
    this.o.healthBar.extravalue = data.shield.toString();

    const percent = (data.hp + data.shield) / data.maxHp;

    if (data.maxHp > 0 && percent < this.options.LowHealthThresholdPercent)
      this.o.healthBar.fg = computeBackgroundColorFrom(this.o.healthBar, 'hp-color.low');
    else if (data.maxHp > 0 && percent < this.options.MidHealthThresholdPercent)
      this.o.healthBar.fg = computeBackgroundColorFrom(this.o.healthBar, 'hp-color.mid');
    else
      this.o.healthBar.fg = computeBackgroundColorFrom(this.o.healthBar, 'hp-color');
  }

  _updateProcBoxNotifyState(): void {
    if (this.options.NotifyExpiredProcsInCombat >= 0) {
      const boxes = document.getElementsByClassName('proc-box');
      for (const box of boxes) {
        if (this.inCombat) {
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

    // Hide out of combat if requested
    if (!this.options.ShowMPTickerOutOfCombat && !this.inCombat) {
      this.o.mpTicker.duration = 0;
      this.o.mpTicker.stylefill = 'empty';
      return;
    }
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

    if (this.job === 'DRK') {
      lowMP = this.options.DrkLowMPThreshold;
      mediumMP = this.options.DrkMediumMPThreshold;
    } else if (this.job === 'PLD') {
      lowMP = this.options.PldLowMPThreshold;
      mediumMP = this.options.PldMediumMPThreshold;
    } else if (this.job === 'BLM') {
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

  _updateFoodBuff(): void {
    // Non-combat jobs don't set up the left buffs list.
    if (!this.init || !this.o.leftBuffsList)
      return;

    const CanShowWellFedWarning = () => {
      if (!this.options.HideWellFedAboveSeconds)
        return false;
      if (this.inCombat)
        return false;
      if (this.contentType === undefined)
        return false;
      return kWellFedContentTypes.includes(this.contentType);
    };

    // Returns the number of ms until it should be shown. If <= 0, show it.
    const TimeToShowWellFedWarning = () => {
      const nowMs = Date.now();
      const showAtMs = this.foodBuffExpiresTimeMs - (this.options.HideWellFedAboveSeconds * 1000);
      return showAtMs - nowMs;
    };

    window.clearTimeout(this.foodBuffTimer);
    this.foodBuffTimer = 0;

    const canShow = CanShowWellFedWarning.bind(this)();
    const showAfterMs = TimeToShowWellFedWarning.bind(this)();

    if (!canShow || showAfterMs > 0) {
      this.o.leftBuffsList.removeElement('foodbuff');
      if (canShow)
        this.foodBuffTimer = window.setTimeout(this._updateFoodBuff.bind(this), showAfterMs);
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
    const reset = getReset(this.job);
    if (reset)
      reset.bind(null, this)();
  }

  _onInCombatChanged(e: EventResponses['onInCombatChangedEvent']): void {
    if (this.inCombat === e.detail.inGameCombat)
      return;

    this.inCombat = e.detail.inGameCombat;

    this._updateFoodBuff();
    this._updateProcBoxNotifyState();
  }

  _onChangeZone(e: EventResponses['ChangeZone']): void {
    this.dotTarget = [];

    this._updateFoodBuff();
    if (this.buffTracker)
      this.buffTracker.clear();

    for (const func of this.changeZoneFuncs)
      func(e);

    this.isPVPZone = isPvPZone(e.zoneID);

    // Hide UI except HP and MP bar if change to pvp area.
    this._updateUIVisibility();
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

    if (!this.crafting) {
      if (anyRegexMatched(message, this.regexes.craftingStartRegexes))
        this.crafting = true;
    } else {
      if (anyRegexMatched(message, this.regexes.craftingStopRegexes)) {
        this.crafting = false;
      } else {
        this.crafting = !this.regexes.craftingFinishRegexes.some((regex) => {
          const m = regex.exec(message)?.groups;
          return m && (!m.player || m.player === this.me);
        });
      }
    }

    if (this.crafting)
      container.classList.remove('hide');
    else
      container.classList.add('hide');
  }

  _onPartyChanged(e: EventResponses['PartyChanged']): void {
    this.partyTracker.onPartyChanged(e);
  }

  _onNetLog(e: EventResponses['LogLine']): void {
    if (!this.init || !this.regexes)
      return;
    const line = e.line;
    const log = e.rawLine;

    const type = line[logDefinitions.None.fields.type];

    switch (type) {
      case logDefinitions.GameLog.type: {
        const m = this.regexes.countdownStartRegex.exec(log);
        if (m && m.groups?.time) {
          const seconds = parseFloat(m.groups.time);
          this._setPullCountdown(seconds);
        }
        if (this.regexes.countdownCancelRegex.test(log))
          this._setPullCountdown(0);
        if (Util.isCraftingJob(this.job))
          this._onCraftingLog(log);
        break;
      }

      case logDefinitions.PlayerStats.type: {
        const fields = logDefinitions.PlayerStats.fields;
        this.skillSpeed = parseInt(line[fields.skillSpeed] ?? '0');
        this.spellSpeed = parseInt(line[fields.spellSpeed] ?? '0');
        this._updateJobBarGCDs();
        break;
      }

      case logDefinitions.GainsEffect.type: {
        const fields = logDefinitions.GainsEffect.fields;
        const matches = normalizeLogLine(line, fields);
        const effectId = matches.effectId?.toUpperCase();
        if (!effectId)
          break;

        if (matches.target === this.me) {
          const f = this.gainEffectFuncMap[effectId];
          if (f)
            f(effectId, matches);
          this.buffTracker?.onYouGainEffect(effectId, matches);
        }
        // Mobs id starts with "4"
        if (matches.targetId?.startsWith('4')) {
          this.buffTracker?.onMobGainsEffect(effectId, matches);

          // if the effect is from me.
          if (matches.source === this.me) {
            if (this.trackedDoTs.includes(effectId))
              this.dotTarget.push(matches.targetId);
            const f = this.mobGainEffectFromYouFuncMap[effectId];
            if (f)
              f(effectId, matches);
          }
        }
        break;
      }

      case logDefinitions.LosesEffect.type: {
        const fields = logDefinitions.LosesEffect.fields;
        const log = normalizeLogLine(line, fields);
        const effectId = log.effectId?.toUpperCase();
        if (!effectId)
          break;

        if (log.target === this.me) {
          const f = this.loseEffectFuncMap[effectId];
          if (f)
            f(effectId, log);
          this.buffTracker?.onYouLoseEffect(effectId, log);
        }
        // Mobs id starts with "4"
        if (log.targetId?.startsWith('4')) {
          this.buffTracker?.onMobLosesEffect(effectId, log);

          // if the effect is from me.
          if (log.source === this.me) {
            if (this.trackedDoTs.includes(effectId)) {
              const index = this.dotTarget.indexOf(log.targetId);
              if (index > -1)
                this.dotTarget.splice(index, 1);
            }
            const f = this.mobLoseEffectFromYouFuncMap[effectId];
            if (f)
              f(effectId, log);
          }
        }
        break;
      }

      case logDefinitions.Ability.type:
      case logDefinitions.NetworkAOEAbility.type: {
        const fields = logDefinitions.Ability.fields;
        const matches = normalizeLogLine(line, fields);
        const id = matches.id;
        if (!id)
          break;

        if (matches.source === this.me) {
          this.combo?.HandleAbility(id);
          const f = this.abilityFuncMap[id];
          if (f)
            f(id, matches);
          this.buffTracker?.onUseAbility(id, matches);

          if (matches.targetId && this.dotTarget.includes(matches.targetId))
            this.lastAttackedDotTarget = matches.targetId;

          if (this.regexes.cordialRegex.test(id)) {
            this.gpPotion = true;
            window.setTimeout(() => {
              this.gpPotion = false;
            }, 2000);
          }
        } else {
          this.buffTracker?.onUseAbility(id, matches);
        }
        break;
      }

      case logDefinitions.NetworkDoT.type: {
        // line[fields.id] is dotted target id.
        // lastAttackedTarget, lastDotTarget may not be maintarget,
        // but lastAttackedDotTarget must be your main target.
        const fields = logDefinitions.NetworkDoT.fields;
        if (
          line[fields.id] === this.lastAttackedDotTarget &&
          line[fields.which] === 'DoT' &&
          line[fields.effectId] === '0'
        ) {
          // 0 if not field setting DoT
          this.updateDotTimerFuncs.forEach((f) => f());
        }
        break;
      }
    }
  }
}
