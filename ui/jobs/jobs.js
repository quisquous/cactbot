import EffectId from '../../resources/effect_id.js';
import ContentType from '../../resources/content_type.js';
import Regexes from '../../resources/regexes.js';
import UserConfig from '../../resources/user_config.js';
import { Util } from '../../resources/common.js';
import ZoneInfo from '../../resources/zone_info.js';
import ZoneId from '../../resources/zone_id.js';
import { kWellFedContentTypes, kLevelMod, kMPCombatRate, kMPNormalRate, kMPUI1Rate, kMPUI2Rate, kMPUI3Rate, kMPTickInterval } from './constants.js';
import { BuffTracker } from './BuffTracker.js';
import { RegexesHolder, computeBackgroundColorFrom, doesJobNeedMPBar, setupComboTracker } from './utils.js';

import {
  setupPld,
  setupWar,
  setupDrk,
  setupGnb,
  setupWhm,
  setupSch,
  setupAst,
  setupMnk,
  setupDrg,
  setupNin,
  setupSam,
  setupBrd,
  setupMch,
  setupDnc,
  setupBlm,
  setupSmn,
  setupRdm,
  setupBlu,
} from './components/index.js';

import './jobs_config.js';
import '../../resources/resourcebar.js';
import '../../resources/timerbar.js';
import '../../resources/timerbox.js';
import '../../resources/timericon.js';
import '../../resources/widgetlist.js';

// See user/jobs-example.js for documentation.
const Options = {
  ShowHPNumber: ['PLD', 'WAR', 'DRK', 'GNB', 'WHM', 'SCH', 'AST', 'BLU'],
  ShowMPNumber: ['PLD', 'DRK', 'WHM', 'SCH', 'AST', 'BLM', 'BLU'],

  ShowMPTicker: ['BLM'],

  MaxLevel: 80,

  PerBuffOptions: {
    // This is noisy since it's more or less permanently on you.
    // Players are unlikely to make different decisions based on this.
    standardFinish: {
      hide: true,
    },
  },

  FarThresholdOffence: 24,
  PldMediumMPThreshold: 9400,
  PldLowMPThreshold: 3600,
  DrkMediumMPThreshold: 5999,
  DrkLowMPThreshold: 2999,
  // One more fire IV and then despair.
  BlmMediumMPThreshold: 3999,
  // Should cast despair.
  BlmLowMPThreshold: 2399,
};

// text on the pull countdown.
const kPullText = {
  en: 'Pull',
  de: 'Start',
  ja: 'タゲ取る',
  cn: '开怪',
  ko: '풀링',
};

export function makeAuraTimerIcon(name, seconds, opacity, iconWidth, iconHeight, iconText,
    barHeight, textHeight, textColor, borderSize, borderColor, barColor, auraIcon) {
  const div = document.createElement('div');
  div.style.opacity = opacity;

  const icon = document.createElement('timer-icon');
  icon.width = iconWidth;
  icon.height = iconHeight;
  icon.bordersize = borderSize;
  icon.textcolor = textColor;
  div.appendChild(icon);

  const barDiv = document.createElement('div');
  barDiv.style.position = 'relative';
  barDiv.style.top = iconHeight;
  div.appendChild(barDiv);

  if (seconds >= 0) {
    const bar = document.createElement('timer-bar');
    bar.width = iconWidth;
    bar.height = barHeight;
    bar.fg = barColor;
    bar.duration = seconds;
    barDiv.appendChild(bar);
  }

  if (textHeight > 0) {
    const text = document.createElement('div');
    text.classList.add('text');
    text.style.width = iconWidth;
    text.style.height = textHeight;
    text.style.overflow = 'hidden';
    text.style.fontSize = textHeight - 1;
    text.style.whiteSpace = 'pre';
    text.style.position = 'relative';
    text.style.top = iconHeight;
    text.style.fontFamily = 'arial';
    text.style.fontWeight = 'bold';
    text.style.color = textColor;
    text.style.textShadow = '-1px 0 3px black, 0 1px 3px black, 1px 0 3px black, 0 -1px 3px black';
    text.style.paddingBottom = textHeight / 4;

    text.innerText = name;
    div.appendChild(text);
  }

  if (iconText)
    icon.text = iconText;
  icon.bordercolor = borderColor;
  icon.icon = auraIcon;
  icon.duration = seconds;

  return div;
}

class Bars {
  constructor(options) {
    this.options = options;
    this.init = false;
    this.me = null;
    this.o = {};
    this.casting = {};
    this.job = '';
    this.hp = 0;
    this.maxHP = 0;
    this.currentShield = 0;
    this.mp = 0;
    this.prevMP = 0;
    this.maxMP = 0;
    this.level = 0;
    this.distance = -1;
    this.whiteMana = -1;
    this.blackMana = -1;
    this.oath = -1;
    this.umbralStacks = 0;
    this.inCombat = false;
    this.combo = null;
    this.comboTimer = null;
    this.regexes = new RegexesHolder(this.options.ParserLanguage);

    this.skillSpeed = 0;
    this.spellSpeed = 0;
    this.gcdSkill = () => this.CalcGCDFromStat(this.skillSpeed);
    this.gcdSpell = () => this.CalcGCDFromStat(this.spellSpeed);

    this.presenceOfMind = 0;
    this.shifu = 0;
    this.huton = 0;
    this.lightningStacks = 0;
    this.paeonStacks = 0;
    this.museStacks = 0;
    this.circleOfPower = 0;
    this.mudraTriggerCd = true;

    this.dotTarget = [];
    this.trackedDoTs = [];
    this.comboFuncs = [];
    this.jobFuncs = [];
    this.changeZoneFuncs = [];
    this.updateDotTimerFuncs = [];
    this.gainEffectFuncMap = {};
    this.mobGainEffectFromYouFuncMap = {};
    this.loseEffectFuncMap = {};
    this.statChangeFuncMap = {};
    this.abilityFuncMap = {};

    this.contentType = 0;
    this.isPVPZone = false;
    this.crafting = false;
  }

  UpdateUIVisibility() {
    const bars = document.getElementById('bars');
    if (bars) {
      const barList = bars.children;
      for (const bar of barList) {
        if (bar.id === 'hp-bar' || bar.id === 'mp-bar') continue;
        if (this.isPVPZone)
          bar.style.display = 'none';
        else
          bar.style.display = '';
      }
    }
  }

  UpdateJob() {
    this.comboFuncs = [];
    this.jobFuncs = [];
    this.changeZoneFuncs = [];
    this.gainEffectFuncMap = {};
    this.mobGainEffectFromYouFuncMap = {};
    this.loseEffectFuncMap = {};
    this.statChangeFuncMap = {};
    this.abilityFuncMap = {};
    this.lastAttackedDotTarget = null;
    this.dotTarget = [];

    this.gainEffectFuncMap[EffectId.WellFed] = (name, matches) => {
      const seconds = parseFloat(matches.duration);
      const now = Date.now(); // This is in ms.
      this.foodBuffExpiresTimeMs = now + (seconds * 1000);
      this.UpdateFoodBuff();
    };

    let container = document.getElementById('jobs-container');
    if (!container) {
      const root = document.getElementById('container');
      container = document.createElement('div');
      container.id = 'jobs-container';
      root.appendChild(container);
    }
    while (container.childNodes.length)
      container.removeChild(container.childNodes[0]);

    this.o = {};
    container.classList.remove('hide');

    const barsLayoutContainer = document.createElement('div');
    barsLayoutContainer.id = 'jobs';
    container.appendChild(barsLayoutContainer);

    barsLayoutContainer.classList.add(this.job.toLowerCase());
    if (Util.isTankJob(this.job))
      barsLayoutContainer.classList.add('tank');
    else if (Util.isHealerJob(this.job))
      barsLayoutContainer.classList.add('healer');
    else if (Util.isDpsJob(this.job))
      barsLayoutContainer.classList.add('dps');
    else if (Util.isCraftingJob(this.job))
      barsLayoutContainer.classList.add('crafting');
    else if (Util.isGatheringJob(this.job))
      barsLayoutContainer.classList.add('gathering');

    const pullCountdownContainer = document.createElement('div');
    pullCountdownContainer.id = 'pull-bar';
    // Pull counter not affected by opacity option.
    barsLayoutContainer.appendChild(pullCountdownContainer);
    this.o.pullCountdown = document.createElement('timer-bar');
    pullCountdownContainer.appendChild(this.o.pullCountdown);

    const opacityContainer = document.createElement('div');
    opacityContainer.id = 'opacity-container';
    barsLayoutContainer.appendChild(opacityContainer);

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

    this.o.rightBuffsContainer = document.createElement('div');
    this.o.rightBuffsContainer.id = 'right-side-icons';
    barsContainer.appendChild(this.o.rightBuffsContainer);

    this.o.rightBuffsList = document.createElement('widget-list');
    this.o.rightBuffsContainer.appendChild(this.o.rightBuffsList);

    this.o.rightBuffsList.rowcolsize = 7;
    this.o.rightBuffsList.maxnumber = 7;
    this.o.rightBuffsList.toward = 'right down';
    this.o.rightBuffsList.elementwidth = this.options.BigBuffIconWidth + 2;

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

      this.o.leftBuffsList = document.createElement('widget-list');
      this.o.leftBuffsContainer.appendChild(this.o.leftBuffsList);

      this.o.leftBuffsList.rowcolsize = 7;
      this.o.leftBuffsList.maxnumber = 7;
      this.o.leftBuffsList.toward = 'left down';
      this.o.leftBuffsList.elementwidth = this.options.BigBuffIconWidth + 2;
    }

    if (Util.isCraftingJob(this.job)) {
      this.o.cpContainer = document.createElement('div');
      this.o.cpContainer.id = 'cp-bar';
      barsContainer.appendChild(this.o.cpContainer);
      this.o.cpBar = document.createElement('resource-bar');
      this.o.cpContainer.appendChild(this.o.cpBar);
      this.o.cpBar.width = window.getComputedStyle(this.o.cpContainer).width;
      this.o.cpBar.height = window.getComputedStyle(this.o.cpContainer).height;
      this.o.cpBar.centertext = 'maxvalue';
      this.o.cpBar.bg = computeBackgroundColorFrom(this.o.cpBar, 'bar-border-color');
      this.o.cpBar.fg = computeBackgroundColorFrom(this.o.cpBar, 'cp-color');
      container.classList.add('hide');
      return;
    } else if (Util.isGatheringJob(this.job)) {
      this.o.gpContainer = document.createElement('div');
      this.o.gpContainer.id = 'gp-bar';
      barsContainer.appendChild(this.o.gpContainer);
      this.o.gpBar = document.createElement('resource-bar');
      this.o.gpContainer.appendChild(this.o.gpBar);
      this.o.gpBar.width = window.getComputedStyle(this.o.gpContainer).width;
      this.o.gpBar.height = window.getComputedStyle(this.o.gpContainer).height;
      this.o.gpBar.centertext = 'maxvalue';
      this.o.gpBar.bg = computeBackgroundColorFrom(this.o.gpBar, 'bar-border-color');
      this.o.gpBar.fg = computeBackgroundColorFrom(this.o.gpBar, 'gp-color');
      return;
    }

    const showHPNumber = this.options.ShowHPNumber.includes(this.job);
    const showMPNumber = this.options.ShowMPNumber.includes(this.job);
    const showMPTicker = this.options.ShowMPTicker.includes(this.job);

    const healthText = showHPNumber ? 'value' : '';
    const manaText = showMPNumber ? 'value' : '';

    this.o.healthContainer = document.createElement('div');
    this.o.healthContainer.id = 'hp-bar';
    if (showHPNumber)
      this.o.healthContainer.classList.add('show-number');
    barsContainer.appendChild(this.o.healthContainer);

    this.o.healthBar = document.createElement('resource-bar');
    this.o.healthContainer.appendChild(this.o.healthBar);
    // TODO: Let the component do this dynamically.
    this.o.healthBar.width = window.getComputedStyle(this.o.healthContainer).width;
    this.o.healthBar.height = window.getComputedStyle(this.o.healthContainer).height;
    this.o.healthBar.lefttext = healthText;
    this.o.healthBar.bg = computeBackgroundColorFrom(this.o.healthBar, 'bar-border-color');

    if (doesJobNeedMPBar(this.job)) {
      this.o.manaContainer = document.createElement('div');
      this.o.manaContainer.id = 'mp-bar';
      barsContainer.appendChild(this.o.manaContainer);
      if (showMPNumber)
        this.o.manaContainer.classList.add('show-number');

      this.o.manaBar = document.createElement('resource-bar');
      this.o.manaContainer.appendChild(this.o.manaBar);
      // TODO: Let the component do this dynamically.
      this.o.manaBar.width = window.getComputedStyle(this.o.manaContainer).width;
      this.o.manaBar.height = window.getComputedStyle(this.o.manaContainer).height;
      this.o.manaBar.lefttext = manaText;
      this.o.manaBar.bg = computeBackgroundColorFrom(this.o.manaBar, 'bar-border-color');
    }

    if (showMPTicker) {
      this.o.mpTickContainer = document.createElement('div');
      this.o.mpTickContainer.id = 'mp-tick';
      barsContainer.appendChild(this.o.mpTickContainer);

      this.o.mpTicker = document.createElement('timer-bar');
      this.o.mpTickContainer.appendChild(this.o.mpTicker);
      this.o.mpTicker.width = window.getComputedStyle(this.o.mpTickContainer).width;
      this.o.mpTicker.height = window.getComputedStyle(this.o.mpTickContainer).height;
      this.o.mpTicker.bg = computeBackgroundColorFrom(this.o.mpTicker, 'bar-border-color');
      this.o.mpTicker.style = 'fill';
      this.o.mpTicker.loop = true;
    }

    const setup = {
      'PLD': setupPld,
      'WAR': setupWar,
      'DRK': setupDrk,
      'GNB': setupGnb,
      'WHM': setupWhm,
      'SCH': setupSch,
      'AST': setupAst,
      'MNK': setupMnk,
      'DRG': setupDrg,
      'NIN': setupNin,
      'SAM': setupSam,
      'BRD': setupBrd,
      'MCH': setupMch,
      'DNC': setupDnc,
      'BLM': setupBlm,
      'SMN': setupSmn,
      'RDM': setupRdm,
      'BLU': setupBlu,
    };
    if (setup[this.job])
      setup[this.job].bind(null, this)();

    this.validateKeys();

    // Many jobs use the gcd to calculate thresholds and value scaling.
    // Run this initially to set those values.
    this.UpdateJobBarGCDs();

    // Hide UI except HP and MP bar if in pvp area.
    this.UpdateUIVisibility();

    // set up DoT effect ids for tracking target
    this.trackedDoTs = Object.keys(this.mobGainEffectFromYouFuncMap);
  }

  validateKeys() {
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

  addJobBarContainer() {
    const id = this.job.toLowerCase() + '-bar';
    let container = document.getElementById(id);
    if (!container) {
      container = document.createElement('div');
      container.id = id;
      document.getElementById('bars').appendChild(container);
      container.classList.add('bar-container');
    }
    return container;
  }

  addJobBoxContainer() {
    const id = this.job.toLowerCase() + '-boxes';
    let boxes = document.getElementById(id);
    if (!boxes) {
      boxes = document.createElement('div');
      boxes.id = id;
      document.getElementById('bars').appendChild(boxes);
      boxes.classList.add('box-container');
    }
    return boxes;
  }

  addResourceBox(options) {
    const boxes = this.addJobBoxContainer();
    const boxDiv = document.createElement('div');
    if (options.classList) {
      for (let i = 0; i < options.classList.length; ++i)
        boxDiv.classList.add(options.classList[i], 'resourcebox');
    }
    boxes.appendChild(boxDiv);

    const textDiv = document.createElement('div');
    boxDiv.appendChild(textDiv);
    textDiv.classList.add('text');

    return textDiv;
  }

  addProcBox(options) {
    const id = this.job.toLowerCase() + '-procs';

    let container = document.getElementById(id);
    if (!container) {
      container = document.createElement('div');
      container.id = id;
      document.getElementById('bars').appendChild(container);
      container.classList.add('proc-box');
    }

    const timerBox = document.createElement('timer-box');
    container.appendChild(timerBox);
    timerBox.style = 'empty';
    if (options.fgColor)
      timerBox.fg = computeBackgroundColorFrom(timerBox, options.fgColor);
    timerBox.bg = 'black';
    timerBox.toward = 'bottom';
    timerBox.threshold = options.threshold ? options.threshold : 0;
    timerBox.hideafter = '';
    timerBox.roundupthreshold = false;
    timerBox.valuescale = options.scale ? options.scale : 1;
    if (options.id) {
      timerBox.id = options.id;
      timerBox.classList.add('timer-box');
    }
    return timerBox;
  }

  addTimerBar(options) {
    const container = this.addJobBarContainer();

    const timerDiv = document.createElement('div');
    timerDiv.id = options.id;
    const timer = document.createElement('timer-bar');
    container.appendChild(timerDiv);
    timerDiv.appendChild(timer);
    timer.classList.add('timer-bar');

    timer.width = window.getComputedStyle(timerDiv).width;
    timer.height = window.getComputedStyle(timerDiv).height;
    timer.toward = 'left';
    timer.bg = computeBackgroundColorFrom(timer, 'bar-border-color');
    if (options.fgColor)
      timer.fg = computeBackgroundColorFrom(timer, options.fgColor);

    return timer;
  }

  addResourceBar(options) {
    const container = this.addJobBarContainer();

    const barDiv = document.createElement('div');
    barDiv.id = options.id;
    const bar = document.createElement('resource-bar');
    container.appendChild(barDiv);
    barDiv.appendChild(bar);
    bar.classList.add('resourcebar');

    bar.bg = 'rgba(0, 0, 0, 0)';
    bar.fg = computeBackgroundColorFrom(bar, options.fgColor);
    bar.width = window.getComputedStyle(barDiv).width;
    bar.height = window.getComputedStyle(barDiv).height;
    bar.maxvalue = options.maxvalue;

    return bar;
  }

  OnComboChange(skill) {
    for (let i = 0; i < this.comboFuncs.length; ++i)
      this.comboFuncs[i](skill);
  }

  // Source: http://theoryjerks.akhmorning.com/guide/speed/
  CalcGCDFromStat(stat, actionDelay) {
    // default calculates for a 2.50s recast
    actionDelay = actionDelay || 2500;

    // If stats haven't been updated, use a reasonable default value.
    if (stat === 0)
      return actionDelay / 1000;


    let type1Buffs = 0;
    let type2Buffs = 0;
    if (this.job === 'BLM') {
      type1Buffs += this.circleOfPower ? 15 : 0;
    } else if (this.job === 'WHM') {
      type1Buffs += this.presenceOfMind ? 20 : 0;
    } else if (this.job === 'SAM') {
      if (this.shifu) {
        if (this.level > 77)
          type1Buffs += 13;
        else type1Buffs += 10;
      }
    }

    if (this.job === 'NIN') {
      type2Buffs += this.huton ? 15 : 0;
    } else if (this.job === 'MNK') {
      type2Buffs += 5 * this.lightningStacks;
    } else if (this.job === 'BRD') {
      type2Buffs += 4 * this.paeonStacks;
      switch (this.museStacks) {
      case 1:
        type2Buffs += 1;
        break;
      case 2:
        type2Buffs += 2;
        break;
      case 3:
        type2Buffs += 4;
        break;
      case 4:
        type2Buffs += 12;
        break;
      }
    }
    // TODO: this probably isn't useful to track
    const astralUmbralMod = 100;

    const gcdMs = Math.floor(1000 - Math.floor(130 * (stat - kLevelMod[this.level][0]) /
      kLevelMod[this.level][1])) * actionDelay / 1000;
    const a = (100 - type1Buffs) / 100;
    const b = (100 - type2Buffs) / 100;
    const gcdC = Math.floor(Math.floor((a * b) * gcdMs / 10) * astralUmbralMod / 100);
    return gcdC / 100;
  }

  UpdateJobBarGCDs() {
    const f = this.statChangeFuncMap[this.job];
    if (f)
      f();
  }

  UpdateHealth() {
    if (!this.o.healthBar) return;
    this.o.healthBar.value = this.hp;
    this.o.healthBar.maxvalue = this.maxHP;
    this.o.healthBar.extraValue = this.currentShield;

    const percent = (this.hp + this.currentShield) / this.maxHP;

    if (this.maxHP > 0 && percent < this.options.LowHealthThresholdPercent)
      this.o.healthBar.fg = computeBackgroundColorFrom(this.o.healthBar, 'hp-color.low');
    else if (this.maxHP > 0 && percent < this.options.MidHealthThresholdPercent)
      this.o.healthBar.fg = computeBackgroundColorFrom(this.o.healthBar, 'hp-color.mid');
    else
      this.o.healthBar.fg = computeBackgroundColorFrom(this.o.healthBar, 'hp-color');
  }

  UpdateMPTicker() {
    if (!this.o.mpTicker) return;
    const delta = this.mp - this.prevMP;
    this.prevMP = this.mp;

    // Hide out of combat if requested
    if (!this.options.ShowMPTickerOutOfCombat && !this.inCombat) {
      this.o.mpTicker.duration = 0;
      this.o.mpTicker.style = 'empty';
      return;
    }
    this.o.mpTicker.style = 'fill';

    const baseTick = this.inCombat ? kMPCombatRate : kMPNormalRate;
    let umbralTick = 0;
    if (this.umbralStacks === -1) umbralTick = kMPUI1Rate;
    if (this.umbralStacks === -2) umbralTick = kMPUI2Rate;
    if (this.umbralStacks === -3) umbralTick = kMPUI3Rate;

    const mpTick = Math.floor(this.maxMP * baseTick) + Math.floor(this.maxMP * umbralTick);
    if (delta === mpTick && this.umbralStacks <= 0) // MP ticks disabled in AF
      this.o.mpTicker.duration = kMPTickInterval;

    // Update color based on the astral fire/ice state
    let colorTag = 'mp-tick-color';
    if (this.umbralStacks < 0) colorTag = 'mp-tick-color.ice';
    if (this.umbralStacks > 0) colorTag = 'mp-tick-color.fire';
    this.o.mpTicker.fg = computeBackgroundColorFrom(this.o.mpTicker, colorTag);
  }

  UpdateMana() {
    this.UpdateMPTicker();

    if (!this.o.manaBar) return;
    this.o.manaBar.value = this.mp;
    this.o.manaBar.maxvalue = this.maxMP;
    let lowMP = -1;
    let mediumMP = -1;
    let far = -1;

    if (this.job === 'RDM' || this.job === 'BLM' || this.job === 'SMN' || this.job === 'ACN')
      far = this.options.FarThresholdOffence;

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

    if (far >= 0 && this.distance > far)
      this.o.manaBar.fg = computeBackgroundColorFrom(this.o.manaBar, 'mp-color.far');
    else if (lowMP >= 0 && this.mp <= lowMP)
      this.o.manaBar.fg = computeBackgroundColorFrom(this.o.manaBar, 'mp-color.low');
    else if (mediumMP >= 0 && this.mp <= mediumMP)
      this.o.manaBar.fg = computeBackgroundColorFrom(this.o.manaBar, 'mp-color.medium');
    else
      this.o.manaBar.fg = computeBackgroundColorFrom(this.o.manaBar, 'mp-color');
  }

  updateCp() {
    if (!this.o.cpBar) return;
    this.o.cpBar.value = this.cp;
    this.o.cpBar.maxvalue = this.maxCP;
  }

  UpdateGp() {
    if (!this.o.gpBar) return;
    this.o.gpBar.value = this.gp;
    this.o.gpBar.maxvalue = this.maxGP;

    // GP Alarm
    if (this.gp < this.options.GpAlarmPoint) {
      this.gpAlarmReady = true;
    } else if (this.gpAlarmReady && !this.gpPotion && this.gp >= this.options.GpAlarmPoint) {
      this.gpAlarmReady = false;
      const audio = new Audio('../../resources/sounds/freesound/power_up.ogg');
      audio.volume = this.options.GpAlarmSoundVolume;
      audio.play();
    }
  }

  UpdateOpacity() {
    const opacityContainer = document.getElementById('opacity-container');
    if (!opacityContainer)
      return;
    if (this.inCombat || !this.options.LowerOpacityOutOfCombat ||
        Util.isCraftingJob(this.job) || Util.isGatheringJob(this.job))
      opacityContainer.style.opacity = 1.0;
    else
      opacityContainer.style.opacity = this.options.OpacityOutOfCombat;
  }

  UpdateFoodBuff() {
    // Non-combat jobs don't set up the left buffs list.
    if (!this.init || !this.o.leftBuffsList)
      return;

    const CanShowWellFedWarning = function() {
      if (!this.options.HideWellFedAboveSeconds)
        return false;
      if (this.inCombat)
        return false;
      return kWellFedContentTypes.includes(this.contentType);
    };

    // Returns the number of ms until it should be shown. If <= 0, show it.
    const TimeToShowWellFedWarning = function() {
      const nowMs = Date.now();
      const showAtMs = this.foodBuffExpiresTimeMs - (this.options.HideWellFedAboveSeconds * 1000);
      return showAtMs - nowMs;
    };

    window.clearTimeout(this.foodBuffTimer);
    this.foodBuffTimer = undefined;

    const canShow = CanShowWellFedWarning.bind(this)();
    const showAfterMs = TimeToShowWellFedWarning.bind(this)();

    if (!canShow || showAfterMs > 0) {
      this.o.leftBuffsList.removeElement('foodbuff');
      if (canShow)
        this.foodBuffTimer = window.setTimeout(this.UpdateFoodBuff.bind(this), showAfterMs);
    } else {
      const div = makeAuraTimerIcon(
          'foodbuff', -1, 1,
          this.options.BigBuffIconWidth, this.options.BigBuffIconHeight,
          '',
          this.options.BigBuffBarHeight, this.options.BigBuffTextHeight,
          'white',
          this.options.BigBuffBorderSize,
          'yellow', 'yellow',
          '../../resources/ffxiv/status/food.png');
      this.o.leftBuffsList.addElement('foodbuff', div, -1);
    }
  }

  OnPartyWipe(e) {
    // TODO: add reset for job-specific ui
    if (this.buffTracker)
      this.buffTracker.clear();
  }

  OnInCombatChanged(e) {
    if (this.inCombat === e.detail.inGameCombat)
      return;

    this.inCombat = e.detail.inGameCombat;
    if (this.inCombat)
      this.SetPullCountdown(0);

    this.UpdateOpacity();
    this.UpdateFoodBuff();
    this.UpdateMPTicker();
  }

  OnChangeZone(e) {
    const zoneInfo = ZoneInfo[e.zoneID];
    this.contentType = zoneInfo ? zoneInfo.contentType : 0;
    this.dotTarget = [];

    this.UpdateFoodBuff();
    if (this.buffTracker)
      this.buffTracker.clear();

    for (const func of this.changeZoneFuncs)
      func(e);

    this.isPVPZone = false;
    if (zoneInfo) {
      if (zoneInfo.contentType === ContentType.Pvp || e.zoneID === ZoneId.WolvesDenPier)
        this.isPVPZone = true;
    }

    // Hide UI except HP and MP bar if change to pvp area.
    this.UpdateUIVisibility();
  }

  SetPullCountdown(seconds) {
    if (!this.o.pullCountdown) return;

    const inCountdown = seconds > 0;
    const showingCountdown = parseFloat(this.o.pullCountdown.duration) > 0;
    if (inCountdown !== showingCountdown) {
      this.o.pullCountdown.duration = seconds;
      if (inCountdown && this.options.PlayCountdownSound) {
        const audio = new Audio('../../resources/sounds/freesound/sonar.ogg');
        audio.volume = 0.3;
        audio.play();
      }
    }
  }

  OnCraftingLog(log) {
    // Hide CP Bar when not crafting
    const container = document.getElementById('jobs-container');

    const anyRegexMatched = (line, array) =>
      array.some((regex) => regex.test(line));

    if (!this.crafting) {
      if (anyRegexMatched(log, this.regexes.craftingStartRegexes))
        this.crafting = true;
    } else {
      if (anyRegexMatched(log, this.regexes.craftingStopRegexes)) {
        this.crafting = false;
      } else {
        this.crafting = !this.regexes.craftingFinishRegexes.some((regex) => {
          const m = regex.exec(log);
          return m && (!m.groups.player || m.groups.player === this.me);
        });
      }
    }

    if (this.crafting)
      container.classList.remove('hide');
    else
      container.classList.add('hide');
  }

  OnPlayerChanged(e) {
    if (this.me !== e.detail.name) {
      this.me = e.detail.name;
      // setup regexes prior to the combo tracker
      this.regexes.setup(this.me);
    }

    if (!this.init) {
      this.combo = setupComboTracker(this.OnComboChange.bind(this));
      this.init = true;
    }

    let updateJob = false;
    let updateHp = false;
    let updateMp = false;
    let updateCp = false;
    let updateGp = false;
    let updateLevel = false;
    if (e.detail.job !== this.job) {
      this.job = e.detail.job;
      // Combos are job specific.
      this.combo.AbortCombo();
      // Update MP ticker as umbral stacks has changed.
      this.umbralStacks = 0;
      this.UpdateMPTicker();
      updateJob = updateHp = updateMp = updateCp = updateGp = true;
      if (!Util.isGatheringJob(this.job))
        this.gpAlarmReady = false;
    }
    if (e.detail.level !== this.level) {
      this.level = e.detail.level;
      updateLevel = true;
    }
    if (e.detail.currentHP !== this.hp || e.detail.maxHP !== this.maxHP ||
      e.detail.currentShield !== this.currentShield) {
      this.hp = e.detail.currentHP;
      this.maxHP = e.detail.maxHP;
      this.currentShield = e.detail.currentShield;
      updateHp = true;

      if (this.hp === 0)
        this.combo.AbortCombo(); // Death resets combos.
    }
    if (e.detail.currentMP !== this.mp || e.detail.maxMP !== this.maxMP) {
      this.mp = e.detail.currentMP;
      this.maxMP = e.detail.maxMP;
      updateMp = true;
    }
    if (e.detail.currentCP !== this.cp || e.detail.maxCP !== this.maxCP) {
      this.cp = e.detail.currentCP;
      this.maxCP = e.detail.maxCP;
      updateCp = true;
    }
    if (e.detail.currentGP !== this.gp || e.detail.maxGP !== this.maxGP) {
      this.gp = e.detail.currentGP;
      this.maxGP = e.detail.maxGP;
      updateGp = true;
    }
    if (updateJob) {
      this.UpdateJob();
      // On reload, we need to set the opacity after setting up the job bars.
      this.UpdateOpacity();
      // Set up the buff tracker after the job bars are created.
      this.buffTracker = new BuffTracker(
          this.options, this.me, this.o.leftBuffsList, this.o.rightBuffsList);
    }
    if (updateHp)
      this.UpdateHealth();
    if (updateMp)
      this.UpdateMana();
    if (updateCp)
      this.updateCp();
    if (updateGp)
      this.UpdateGp();
    if (updateLevel)
      this.UpdateFoodBuff();

    if (e.detail.jobDetail) {
      for (let i = 0; i < this.jobFuncs.length; ++i)
        this.jobFuncs[i](e.detail.jobDetail);
    }
  }

  UpdateEnmityTargetData(e) {
    const target = e.Target;

    let update = false;
    if (!target || !target.Name) {
      if (this.distance !== -1) {
        this.distance = -1;
        update = true;
      }
    } else if (target.EffectiveDistance !== this.distance) {
      this.distance = target.EffectiveDistance;
      update = true;
    }
    if (update) {
      this.UpdateHealth();
      this.UpdateMana();
    }
  }

  OnNetLog(e) {
    if (!this.init)
      return;
    const line = e.line;
    const log = e.rawLine;

    const type = line[0];

    if (type === '26') {
      let m = log.match(this.regexes.YouGainEffectRegex);
      if (m) {
        const effectId = m.groups.effectId.toUpperCase();
        const f = this.gainEffectFuncMap[effectId];
        if (f)
          f(effectId, m.groups);
        this.buffTracker.onYouGainEffect(effectId, m.groups);
      }
      m = log.match(this.regexes.MobGainsEffectRegex);
      if (m) {
        const effectId = m.groups.effectId.toUpperCase();
        this.buffTracker.onMobGainsEffect(effectId, m.groups);
      }
      m = log.match(this.regexes.MobGainsEffectFromYouRegex);
      if (m) {
        const effectId = m.groups.effectId.toUpperCase();
        if (this.trackedDoTs.includes(effectId))
          this.dotTarget.push(m.groups.targetId);
        const f = this.mobGainEffectFromYouFuncMap[effectId];
        if (f)
          f(effectId, m.groups);
      }
    } else if (type === '30') {
      let m = log.match(this.regexes.YouLoseEffectRegex);
      if (m) {
        const effectId = m.groups.effectId.toUpperCase();
        const f = this.loseEffectFuncMap[effectId];
        if (f)
          f(effectId, m.groups);
        this.buffTracker.onYouLoseEffect(effectId, m.groups);
      }
      m = log.match(this.regexes.MobLosesEffectRegex);
      if (m) {
        const effectId = m.groups.effectId.toUpperCase();
        this.buffTracker.onMobLosesEffect(effectId, m.groups);
      }
      m = log.match(this.regexes.MobLosesEffectFromYouRegex);
      if (m) {
        const effectId = m.groups.effectId.toUpperCase();
        if (this.trackedDoTs.includes(effectId)) {
          const index = this.dotTarget.indexOf(m.groups.targetId);
          if (index > -1)
            this.dotTarget.splice(index, 1);
        }
      }
    } else if (type === '21' || type === '22') {
      let m = log.match(this.regexes.YouUseAbilityRegex);
      if (m) {
        const id = m.groups.id;
        this.combo.HandleAbility(id);
        const f = this.abilityFuncMap[id];
        if (f)
          f(id, m.groups);
        this.buffTracker.onUseAbility(id, m.groups);
      } else {
        const m = log.match(this.regexes.AnybodyAbilityRegex);
        if (m)
          this.buffTracker.onUseAbility(m.groups.id, m.groups);
      }
      m = log.match(this.regexes.YouUseAbilityRegex);
      if (m) {
        if (this.dotTarget.includes(m.groups.targetId))
          this.lastAttackedDotTarget = m.groups.targetId;
      }
    } else if (type === '24') {
      // line[2] is dotted target id.
      // lastAttackedTarget, lastDotTarget may not be maintarget,
      // but lastAttackedDotTarget must be your main target.
      if (line[2] === this.lastAttackedDotTarget &&
        line[4] === 'DoT' &&
        line[5] === '0') {
        // 0 if not field setting DoT
        this.updateDotTimerFuncs.forEach((f) => {
          if (f)
            f();
        });
      }
    }
  }

  OnLogEvent(e) {
    if (!this.init)
      return;

    for (let i = 0; i < e.detail.logs.length; i++) {
      const log = e.detail.logs[i];

      // TODO: only consider this when not in battle.
      if (log[15] === '0') {
        const r = log.match(this.regexes.countdownStartRegex);
        if (r) {
          const seconds = parseFloat(r.groups.time);
          this.SetPullCountdown(seconds);
          continue;
        }
        if (log.search(this.regexes.countdownCancelRegex) >= 0) {
          this.SetPullCountdown(0);
          continue;
        }
        if (log.search(/:test:jobs:/) >= 0) {
          this.Test();
          continue;
        }
        if (log[16] === 'C') {
          const stats = log.match(this.regexes.StatsRegex).groups;
          this.skillSpeed = stats.skillSpeed;
          this.spellSpeed = stats.spellSpeed;
          this.UpdateJobBarGCDs();
          continue;
        }
        if (Util.isCraftingJob(this.job))
          this.OnCraftingLog(log);
      } else if (log[15] === '1') {
        // TODO: consider flags for missing.
        // flags:damage is 1:0 in most misses.
        if (log[16] === '5' || log[16] === '6') {
          // use of GP Potion
          const cordialRegex = Regexes.ability({ source: this.me, id: '20(017FD|F5A3D|F844F|0420F|0317D)' });
          if (cordialRegex.test(log)) {
            this.gpPotion = true;
            setTimeout(() => {
              this.gpPotion = false;
            }, 2000);
          }
        }
      }
    }
  }

  Test() {
    const logs = [];
    const t = '[10:10:10.000] ';
    logs.push(t + '1A:10000000:' + this.me + ' gains the effect of Medicated from ' + this.me + ' for 30.2 Seconds.');
    logs.push(t + '15:10000000:Tako Yaki:1D60:Embolden:10000000:' + this.me + ':500020F:4D70000:0:0:0:0:0:0:0:0:0:0:0:0:0:0:42194:42194:10000:10000:0:1000:-655.3301:-838.5481:29.80905:0.523459:42194:42194:10000:10000:0:1000:-655.3301:-838.5481:29.80905:0.523459:00001DE7');
    logs.push(t + '1A:10000000:' + this.me + ' gains the effect of Battle Litany from  for 25 Seconds.');
    logs.push(t + '1A:10000000:' + this.me + ' gains the effect of The Balance from  for 12 Seconds.');
    logs.push(t + '1A:10000000:Okonomi Yaki gains the effect of Foe Requiem from Okonomi Yaki for 9999.00 Seconds.');
    logs.push(t + '15:1048638C:Okonomi Yaki:8D2:Trick Attack:40000C96:Striking Dummy:20710103:154B:');
    logs.push(t + '1A:10000000:' + this.me + ' gains the effect of Left Eye from That Guy for 15.0 Seconds.');
    logs.push(t + '1A:10000000:' + this.me + ' gains the effect of Right Eye from That Guy for 15.0 Seconds.');
    logs.push(t + '15:1048638C:Tako Yaki:1D0C:Chain Stratagem:40000C96:Striking Dummy:28710103:154B:');
    logs.push(t + '15:1048638C:Tako Yaki:B45:Hypercharge:40000C96:Striking Dummy:28710103:154B:');
    logs.push(t + '1A:10000000:' + this.me + ' gains the effect of Devotion from That Guy for 15.0 Seconds.');
    logs.push(t + '1A:10000000:' + this.me + ' gains the effect of Brotherhood from That Guy for 15.0 Seconds.');
    logs.push(t + '1A:10000000:' + this.me + ' gains the effect of Brotherhood from Other Guy for 15.0 Seconds.');
    const e = { detail: { logs: logs } };
    this.OnLogEvent(e);
  }
}

let gBars;

UserConfig.getUserConfigLocation('jobs', Options, () => {
  addOverlayListener('onPlayerChangedEvent', (e) => {
    gBars.OnPlayerChanged(e);
  });
  addOverlayListener('EnmityTargetData', (e) => {
    gBars.UpdateEnmityTargetData(e);
  });
  addOverlayListener('onPartyWipe', (e) => {
    gBars.OnPartyWipe(e);
  });
  addOverlayListener('onInCombatChangedEvent', (e) => {
    gBars.OnInCombatChanged(e);
  });
  addOverlayListener('ChangeZone', (e) => {
    gBars.OnChangeZone(e);
  });
  addOverlayListener('onLogEvent', (e) => {
    gBars.OnLogEvent(e);
  });
  addOverlayListener('LogLine', (e) => {
    gBars.OnNetLog(e);
  });

  gBars = new Bars(Options);
});
