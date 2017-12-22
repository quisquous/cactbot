"use strict";

// Each option here can be changed in user/jobs.js with a line such as
// Options.ShowRdmProcs = false
// or
// Options.TPInvigorateThreshold = 400
// See user/jobs-example.js for documentation.
var Options = {
  Language: 'en',

  LowerOpacityOutOfCombat: true,

  HideWellFedAboveSeconds: 15 * 60,
  WellFedZones: ['O1S', 'O2S', 'O3S', 'O4S', 'UCU'],

  MaxLevel: 70,

  ShowRdmProcs: true,

  RdmCastTime: 1.94 + 0.5,
  WarGcd: 2.38,
  SmnAetherflowRecast: 60,

  BigBuffIconWidth: 44,
  BigBuffIconHeight: 32,
  BigBuffBarHeight: 5,
  BigBuffTextHeight: 0,
  BigBuffBorderSize: 1,

  FarThresholdOffence: 24,

  TPInvigorateThreshold: 600,
  LowHealthThresholdPercent: 0.2,
  MidHealthThresholdPercent: 0.8,
}

// Regexes to be filled out once we know the player's name.
var kReRdmWhiteManaProc = null;
var kReRdmBlackManaProc = null;
var kReRdmImpactProc = null;
var kReRdmWhiteManaProcEnd = null;
var kReRdmBlackManaProcEnd = null;
var kReRdmImpactProcEnd = null;
var kReRdmEndCombo = null;
var kReSmnRuinProc = null;
var kReSmnRuinProcEnd = null;
var kReSmnAetherflow = null;
var kReFoodBuff = null;
var kFormChange = null;
var kPeanutButter = null;
var kDragonKick = null;
var kTwinSnakes = null;
var kDemolish = null;
var kBluntDebuff = null;
var kComboBreakers = null;
var kWellFedZoneRegex = null;

class ComboTracker {
  constructor(comboBreakers, callback) {
    this.comboTimer = null;
    this.kReEndCombo = Regexes.AnyOf(gLang.youUseAbilityRegex(comboBreakers), 
                                     gLang.youStartUsingRegex(comboBreakers));
    this.comboNodes = {}; // { key => { re: string, next: [node keys], last: bool } }
    this.startList = [];
    this.callback = callback;
    this.current = null;
    this.considerNext = this.startList;
  }

  AddCombo(skillList) {
    if (this.startList.indexOf(skillList[0]) == -1) {
      this.startList.push(skillList[0]);
    }
    for (var i = 0; i < skillList.length; ++i) {
      var node = this.comboNodes[skillList[i]];
      if (node == undefined) {
        node = {
          re: gLang.youUseAbilityRegex(skillList[i]),
          next: []
        };
        this.comboNodes[skillList[i]] = node;
      }
      if (i != skillList.length - 1) {
        node.next.push(skillList[i + 1]);
      } else {
        node.last = true;
      }
    }
  }

  ParseLog(log) {
    for (var i = 0; i < this.considerNext.length; ++i) {
      var next = this.considerNext[i];
      if (log.search(this.comboNodes[next].re) >= 0) {
        this.StateTransition(next);
        return true;
      }
    }
    if (log.search(this.kReEndCombo) >= 0) {
      this.AbortCombo();
      return true;
    }
    return false;
  }

  StateTransition(nextState) {
    if (this.current == null && nextState == null)
      return;

    window.clearTimeout(this.comboTimer);
    this.comboTimer = null;
    this.current = nextState;

    if (nextState == null) {
      this.considerNext = this.startList;
    } else {
      this.considerNext = [];
      Array.prototype.push.apply(this.considerNext, this.comboNodes[nextState].next);
      Array.prototype.push.apply(this.considerNext, this.startList);

      if (!this.comboNodes[nextState].last) {
        var kComboDelayMs = 12000;
        this.comboTimer = window.setTimeout(this.AbortCombo.bind(this), kComboDelayMs);
      }
    }
    this.callback(nextState);
  }

  AbortCombo() {
    this.StateTransition(null);
  }
}

function setupComboTracker(callback) {
  var comboTracker = new ComboTracker(kComboBreakers, callback);
  comboTracker.AddCombo([
    gLang.kAbility.EnchantedRiposte,
    gLang.kAbility.EnchantedZwerchhau,
    gLang.kAbility.EnchantedRedoublement,
    gLang.kAbility.Verflare,
  ]);
  comboTracker.AddCombo([
    gLang.kAbility.EnchantedRiposte,
    gLang.kAbility.EnchantedZwerchhau,
    gLang.kAbility.EnchantedRedoublement,
    gLang.kAbility.Verholy,
  ]);
  comboTracker.AddCombo([
    gLang.kAbility.HeavySwing,
    gLang.kAbility.SkullSunder,
    gLang.kAbility.ButchersBlock,
  ]);
  comboTracker.AddCombo([
    gLang.kAbility.HeavySwing,
    gLang.kAbility.Maim,
    gLang.kAbility.StormsEye,
  ]);
  comboTracker.AddCombo([
    gLang.kAbility.HeavySwing,
    gLang.kAbility.Maim,
    gLang.kAbility.StormsPath,
  ]);
  return comboTracker;
}

function setupRegexes() {
  kReRdmWhiteManaProc = gLang.youGainEffectRegex(gLang.kEffect.VerstoneReady);
  kReRdmWhiteManaProcEnd = gLang.youLoseEffectRegex(gLang.kEffect.VerstoneReady);
  kReRdmBlackManaProc = gLang.youGainEffectRegex(gLang.kEffect.VerfireReady);
  kReRdmBlackManaProcEnd = gLang.youLoseEffectRegex(gLang.kEffect.VerfireReady);
  kReRdmImpactProc = gLang.youGainEffectRegex(gLang.kEffect.Impactful)
  kReRdmImpactProcEnd = gLang.youLoseEffectRegex(gLang.kEffect.Impactful);
  kReSmnRuinProc = gLang.youGainEffectRegex(gLang.kEffect.FurtherRuin)
  kReSmnRuinProcEnd = gLang.youLoseEffectRegex(gLang.kEffect.Impactful);
  kReSmnAetherflow = gLang.youUseAbilityRegex(gLang.kAbility.Aetherflow);
  kReFoodBuff = gLang.youGainEffectRegex(gLang.kEffect.WellFed);
  kFormChange = gLang.youGainEffectRegex(gLang.kEffect.OpoOpoForm, gLang.kEffect.RaptorForm, gLang.kEffect.CoeurlForm);
  kPeanutButter = gLang.youGainEffectRegex(gLang.kEffect.PerfectBalance);
  kDragonKick = gLang.youUseAbilityRegex(gLang.kAbility.DragonKick);
  kTwinSnakes = gLang.youUseAbilityRegex(gLang.kAbility.TwinSnakes);
  kDemolish = gLang.youUseAbilityRegex(gLang.kAbility.Demolish);
  kBluntDebuff = gLang.gainsEffectRegex(gLang.kEffect.BluntResistDown);
  kWellFedZoneRegex = Regexes.AnyOf(Options.WellFedZones.map(function(x) { return gLang.kZone[x]; }));

// Full skill names of abilities that break combos.
// TODO: it's sad to have to duplicate combo abilities here to catch out-of-order usage.
  kComboBreakers = Object.freeze([
    // rdm
    gLang.kAbility.Verstone,
    gLang.kAbility.Verfire,
    gLang.kAbility.Veraero,
    gLang.kAbility.Verthunder,
    gLang.kAbility.Verholy,
    gLang.kAbility.Verflare,
    gLang.kAbility.Jolt2,
    gLang.kAbility.Jolt,
    gLang.kAbility.Impact,
    gLang.kAbility.Scatter,
    gLang.kAbility.Vercure,
    gLang.kAbility.Verraise,
    gLang.kAbility.Riposte,
    gLang.kAbility.Zwerchhau,
    gLang.kAbility.Redoublement,
    gLang.kAbility.Moulinet,
    gLang.kAbility.EnchantedRiposte,
    gLang.kAbility.EnchantedZwerchhau,
    gLang.kAbility.EnchantedRedoublement,
    gLang.kAbility.EnchantedMoulinet,
    // war
    gLang.kAbility.Tomahawk,
    gLang.kAbility.Overpower,
    gLang.kAbility.SkullSunder,
    gLang.kAbility.ButchersBlock,
    gLang.kAbility.Maim,
    gLang.kAbility.StormsEye,
    gLang.kAbility.StormsPath,
  ]);
}

var kCasterJobs = ["RDM", "BLM", "WHM", "SCH", "SMN", "ACN", "AST", "CNJ", "THM"];
var kTankJobs = ["GLD", "PLD", "MRD", "WAR", "DRK"];
var kHealerJobs = ["CNJ", "WHM", "SCH", "AST"];
var kCraftingJobs = ["CRP", "BSM", "ARM", "GSM", "LTW", "WVR", "ALC", "CUL"];
var kGatheringJobs = ["MIN", "BTN", "FSH"];
var kMeleeWithMpJobs = ["BRD", "DRK", "PLD"];

function isCasterJob(job) {
  return kCasterJobs.indexOf(job) >= 0;
}

function isTankJob(job) {
  return kTankJobs.indexOf(job) >= 0;
}

function isHealerJob(job) {
  return kHealerJobs.indexOf(job) >= 0;
}

function isCraftingJob(job) {
  return kCraftingJobs.indexOf(job) >= 0;
}

function isGatheringJob(job) {
  return kGatheringJobs.indexOf(job) >= 0;
}

function isCombatJob(job) {
  return !isCraftingJob(job) && !isGatheringJob(job);
}

function doesJobNeedMPBar(job) {
  return isCasterJob(job) || kMeleeWithMpJobs.indexOf(job) >= 0;
}

function computeBackgroundColorFrom(element, classList) {
  var div = document.createElement('div');
  var classes = classList.split('.');
  for (var i = 0; i < classes.length; ++i)
    div.classList.add(classes[i]);
  element.appendChild(div);
  var color = window.getComputedStyle(div).backgroundColor;
  element.removeChild(div);
  return color;
}

var kBigBuffTracker = null;

function setupBuffTracker() {
  kBigBuffTracker = {
    potion: {
      gainRegex: gLang.youGainEffectRegex(gLang.kEffect.Medicated),
      loseRegex: gLang.youLoseEffectRegex(gLang.kEffect.Medicated),
      durationPosition: 1,
      icon: kIconBuffPotion,
      borderColor: '#AA41B2',
      sortKey: 0,
    },
    trick: {
      // The flags encode positional data, but the exact specifics are unclear.
      // Trick attack missed appears to be "710?03" but correct is "28710?03".
      gainRegex: gLang.abilityRegex(gLang.kAbility.TrickAttack, null, null, '28......'),
      durationSeconds: 10,
      icon: kIconBuffTrickAttack,
      // Magenta.
      borderColor: '#FC4AE6',
      sortKey: 1,
    },
    litany: {
      gainRegex: gLang.youGainEffectRegex(gLang.kEffect.BattleLitany),
      loseRegex: gLang.youLoseEffectRegex(gLang.kEffect.BattleLitany),
      durationPosition: 1,
      icon: kIconBuffLitany,
      // Cyan.
      borderColor: '#099',
      sortKey: 2,
    },
    embolden: {
      // Embolden is special and has some extra text at the end, depending on embolden stage:
      //   1A:Potato Chippy gains the effect of Embolden from Tater Tot for 20.00 Seconds. (5)
      // Instead, use somebody using the effect on you:
      //   16:106C22EF:Tater Tot:1D60:Embolden:106C22EF:Potato Chippy:500020F:4D7: etc etc
      gainRegex: gLang.abilityRegex(gLang.kAbility.Embolden, null, gLang.playerName),
      loseRegex: gLang.youLoseEffectRegex(gLang.kEffect.Embolden),
      durationPosition: 1,
      icon: kIconBuffEmbolden,
      // Lime.
      borderColor: '#57FC4A',
      sortKey: 3,
    },
    balance: {
      gainRegex: gLang.youGainEffectRegex(gLang.kEffect.Balance),
      loseRegex: gLang.youLoseEffectRegex(gLang.kEffect.Balance),
      durationPosition: 1,
      icon: kIconBuffBalance,
      // Orange.
      borderColor: '#ff9900',
      sortKey: 4,
    },
    chain: {
      gainRegex: gLang.abilityRegex(gLang.kAbility.ChainStrategem),
      durationSeconds: 15,
      icon: kIconBuffChainStratagem,
      // Blue.
      borderColor: '#4674E5',
      sortKey: 5,
    },
    hyper: {
      gainRegex: gLang.abilityRegex(gLang.kAbility.Hypercharge),
      durationSeconds: 20,
      icon: kIconBuffHypercharge,
      // Aqua.
      borderColor: '#006b99',
      sortKey: 6,
    },
    sight: {
      gainRegex: gLang.youGainEffectRegex(gLang.kEffect.LeftEye, gLang.kEffect.RightEye),
      loseRegex: gLang.youLoseEffectRegex(gLang.kEffect.LeftEye, gLang.kEffect.RightEye),
      durationPosition: 1,
      icon: kIconBuffDragonSight,
      // Orange.
      borderColor: '#FA8737',
      sortKey: 7,
    },
    brotherhood: {
      gainRegex: gLang.youGainEffectRegex(gLang.kEffect.Brotherhood),
      loseRegex: gLang.youLoseEffectRegex(gLang.kEffect.Brotherhood),
      durationPosition: 1,
      icon: kIconBuffBrotherhood,
      // Dark Orange.
      borderColor: '#994200',
      sortKey: 8,
    },
    devotion: {
      gainRegex: gLang.youGainEffectRegex(gLang.kEffect.Devotion),
      loseRegex: gLang.youLoseEffectRegex(gLang.kEffect.Devotion),
      durationPosition: 1,
      icon: kIconBuffDevotion,
      // Yellow.
      borderColor: '#ffbf00',
      sortKey: 9,
    },
    requiem: {
      // TODO: Can't use \y{Name} because https://github.com/quisquous/cactbot/issues/22.
      gainRegex: gLang.gainsEffectRegex(gLang.kEffect.FoeRequiem, '(.*?)', '\\1'),
      loseRegex: gLang.losesEffectRegex(gLang.kEffect.FoeRequiem, '(.*?)', '\\1'),
      durationPosition: 2,
      icon: kIconBuffFoes,
      // Light Purple.
      borderColor: '#F272F2',
      sortKey: 0.5,
      side: 'left',
      text: 'elapsed',
    },
  }
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
    this.mp = 0;
    this.maxMP = 0;
    this.tp = 0;
    this.maxTP = 0;
    this.level = 0;
    this.distance = -1;
    this.whiteMana = -1;
    this.blackMana = -1;
    this.beast = -1;
    this.inCombat = false;
    this.combo = 0;
    this.comboTimer = null;
    this.smnChanneling = false;
  }

  UpdateJob() {
    var container = document.getElementById("jobs-container");
    if (container == null) {
      var root = document.getElementById("container");
      container = document.createElement("div");
      container.id = "jobs-container";
      root.appendChild(container);
    }
    while (container.childNodes.length)
      container.removeChild(container.childNodes[0]);

    this.o = {};

    var barsLayoutContainer = document.createElement("div");
    barsLayoutContainer.id = 'jobs';
    container.appendChild(barsLayoutContainer);

    barsLayoutContainer.classList.add(this.job.toLowerCase());
    if (isTankJob(this.job))
      barsLayoutContainer.classList.add('tank');
    else if (isHealerJob(this.job))
      barsLayoutContainer.classList.add('healer');
    else if (isCombatJob(this.job))
      barsLayoutContainer.classList.add('dps');
    else if (isCraftingJob(this.job))
      barsLayoutContainer.classList.add('crafting');
    else if (isGatheringJob(this.job))
      barsLayoutContainer.classList.add('gathering');

    var pullCountdownContainer = document.createElement("div");
    pullCountdownContainer.id = 'pull-bar';
    // Pull counter not affected by opacity option.
    barsLayoutContainer.appendChild(pullCountdownContainer);
    this.o.pullCountdown = document.createElement("timer-bar");
    pullCountdownContainer.appendChild(this.o.pullCountdown);

    var opacityContainer = document.createElement("div");
    opacityContainer.id = "opacity-container";
    barsLayoutContainer.appendChild(opacityContainer);

    // Holds health/mana/tp.
    var barsContainer = document.createElement('div');
    barsContainer.id = 'bars';
    opacityContainer.appendChild(barsContainer);

    this.o.pullCountdown.width = window.getComputedStyle(pullCountdownContainer).width;
    this.o.pullCountdown.height = window.getComputedStyle(pullCountdownContainer).height;
    this.o.pullCountdown.lefttext = gLang.kUIStrings.Pull;
    this.o.pullCountdown.righttext = "remain";
    this.o.pullCountdown.hideafter = 0;
    this.o.pullCountdown.fg = "rgb(255, 120, 120)";

    this.o.rightBuffsContainer = document.createElement("div");
    this.o.rightBuffsContainer.id = 'right-side-icons';
    barsContainer.appendChild(this.o.rightBuffsContainer);

    this.o.rightBuffsList = document.createElement('widget-list');
    this.o.rightBuffsContainer.appendChild(this.o.rightBuffsList);

    this.o.rightBuffsList.rowcolsize = 7;
    this.o.rightBuffsList.maxnumber = 7;
    this.o.rightBuffsList.toward = "right down";
    this.o.rightBuffsList.elementwidth = this.options.BigBuffIconWidth + 2;

    this.o.leftBuffsContainer = document.createElement("div");
    this.o.leftBuffsContainer.id = 'left-side-icons';
    barsContainer.appendChild(this.o.leftBuffsContainer);

    this.o.leftBuffsList = document.createElement('widget-list');
    this.o.leftBuffsContainer.appendChild(this.o.leftBuffsList);

    this.o.leftBuffsList.rowcolsize = 7;
    this.o.leftBuffsList.maxnumber = 7;
    this.o.leftBuffsList.toward = "left down";
    this.o.leftBuffsList.elementwidth = this.options.BigBuffIconWidth + 2;

    if (isCraftingJob(this.job)) {
      this.o.cpContainer = document.createElement("div");
      this.o.cpContainer.id = 'cp-bar';
      barsContainer.appendChild(this.o.cpContainer);
      this.o.cpBar = document.createElement("resource-bar");
      this.o.cpContainer.appendChild(this.o.cpBar);
      this.o.cpBar.width = window.getComputedStyle(this.o.cpContainer).width;
      this.o.cpBar.height = window.getComputedStyle(this.o.cpContainer).height;
      this.o.cpBar.centertext = "maxvalue";
      this.o.cpBar.bg = computeBackgroundColorFrom(this.o.cpBar, 'bar-border-color');
      this.o.cpBar.fg = computeBackgroundColorFrom(this.o.cpBar, 'cp-color');
      return;
    } else if (isGatheringJob(this.job)) {
      this.o.gpContainer = document.createElement("div");
      this.o.gpContainer.id = 'gp-bar';
      barsContainer.appendChild(this.o.gpContainer);
      this.o.gpBar = document.createElement("resource-bar");
      this.o.gpContainer.appendChild(this.o.gpBar);
      this.o.gpBar.width = window.getComputedStyle(this.o.gpContainer).width;
      this.o.gpBar.height = window.getComputedStyle(this.o.gpContainer).height;
      this.o.gpBar.centertext = "maxvalue";
      this.o.gpBar.bg = computeBackgroundColorFrom(this.o.gpBar, 'bar-border-color');
      this.o.gpBar.fg = computeBackgroundColorFrom(this.o.gpBar, 'gp-color');
      return;
    }

    var healthText = isTankJob(this.job) ? 'value' : '';

    this.o.healthContainer = document.createElement("div");
    this.o.healthContainer.id = 'hp-bar';
    barsContainer.appendChild(this.o.healthContainer);

    this.o.healthBar = document.createElement("resource-bar");
    this.o.healthContainer.appendChild(this.o.healthBar);
      // TODO: Let the component do this dynamically.
    this.o.healthBar.width = window.getComputedStyle(this.o.healthContainer).width;
    this.o.healthBar.height = window.getComputedStyle(this.o.healthContainer).height;
    this.o.healthBar.lefttext = healthText;
    this.o.healthBar.bg = computeBackgroundColorFrom(this.o.healthBar, 'bar-border-color');

    if (doesJobNeedMPBar(this.job)) {
      this.o.manaContainer = document.createElement("div");
      this.o.manaContainer.id = 'mp-bar';
      barsContainer.appendChild(this.o.manaContainer);

      this.o.manaBar = document.createElement("resource-bar");
      this.o.manaContainer.appendChild(this.o.manaBar);
      // TODO: Let the component do this dynamically.
      this.o.manaBar.width = window.getComputedStyle(this.o.manaContainer).width;
      this.o.manaBar.height = window.getComputedStyle(this.o.manaContainer).height;
      this.o.manaBar.bg = computeBackgroundColorFrom(this.o.manaBar, 'bar-border-color');;
    }

    if (!isCasterJob(this.job)) {
      this.o.tpContainer = document.createElement("div");
      this.o.tpContainer.id = 'tp-bar';
      barsContainer.appendChild(this.o.tpContainer);

      this.o.tpBar = document.createElement("resource-bar");
      this.o.tpContainer.appendChild(this.o.tpBar);
      // TODO: Let the component do this dynamically.
      this.o.tpBar.width = window.getComputedStyle(this.o.tpContainer).width;
      this.o.tpBar.height = window.getComputedStyle(this.o.tpContainer).height;
      this.o.tpBar.bg = computeBackgroundColorFrom(this.o.tpBar, 'bar-border-color');;
    }

    if (this.job == 'SMN') {
      var stacksContainer = document.createElement('div');
      stacksContainer.id = 'smn-stacks';
      barsContainer.appendChild(stacksContainer);
      var bahaStacks = document.createElement('div');
      bahaStacks.id = 'smn-stacks-bahamut';
      stacksContainer.appendChild(bahaStacks);
      var dreadStacks = document.createElement('div');
      dreadStacks.id = 'smn-stacks-aetherflow';
      stacksContainer.appendChild(dreadStacks);

      this.o.smnBahamutStacks = [];
      for (var i = 0; i < 2; ++i) {
        var d = document.createElement('div');
        d.classList.add('bahamut');
        d.classList.add('stack' + (i+1));
        bahaStacks.appendChild(d);
        this.o.smnBahamutStacks.push(d);
      }
      this.o.smnAetherflowStacks = [];
      for (var i = 0; i < 3; ++i) {
        var d = document.createElement('div');
        d.classList.add('aetherflow');
        d.classList.add('stack' + (i+1));
        dreadStacks.appendChild(d);
        this.o.smnAetherflowStacks.push(d);
      }

      this.o.smnBahamutTimerContainer = document.createElement('div');
      this.o.smnBahamutTimerContainer.id = 'smn-timer-bahamut';
      bahaStacks.appendChild(this.o.smnBahamutTimerContainer);
      this.o.smnBahamutTimer = document.createElement('timer-bar');
      this.o.smnBahamutTimerContainer.appendChild(this.o.smnBahamutTimer);
      this.o.smnBahamutTimer.width = window.getComputedStyle(this.o.smnBahamutTimerContainer).width;
      this.o.smnBahamutTimer.height = window.getComputedStyle(this.o.smnBahamutTimerContainer).height;
      //this.o.smnBahamutTimer.centertext = "remain";
      this.o.smnBahamutTimer.fg = window.getComputedStyle(this.o.smnBahamutTimerContainer).color;

      this.o.smnDreadwyrmTimerContainer = document.createElement('div');
      this.o.smnDreadwyrmTimerContainer.id = 'smn-timer-aetherflow';
      dreadStacks.appendChild(this.o.smnDreadwyrmTimerContainer);
      this.o.smnDreadwyrmTimer = document.createElement('timer-bar');
      this.o.smnDreadwyrmTimerContainer.appendChild(this.o.smnDreadwyrmTimer);
      this.o.smnDreadwyrmTimer.width = window.getComputedStyle(this.o.smnDreadwyrmTimerContainer).width;
      this.o.smnDreadwyrmTimer.height = window.getComputedStyle(this.o.smnDreadwyrmTimerContainer).height;
      //this.o.smnDreadwyrmTimer.centertext = "remain";
      this.o.smnDreadwyrmTimer.fg = window.getComputedStyle(this.o.smnDreadwyrmTimerContainer).color;

      var timersContainer = document.createElement("div");
      timersContainer.id = 'smn-timers';
      barsContainer.appendChild(timersContainer);

      var ruinTimerContainer = document.createElement("div");
      ruinTimerContainer.id = 'smn-timers-ruin';
      timersContainer.appendChild(ruinTimerContainer);

      var noRuinTimer = document.createElement("div");
      noRuinTimer.classList.add('inactive');
      noRuinTimer.classList.add('smn-color-ruin');
      ruinTimerContainer.appendChild(noRuinTimer);

      this.o.smnRuinTimer = document.createElement("timer-box");
      ruinTimerContainer.appendChild(this.o.smnRuinTimer);

      this.o.smnRuinTimer.style = "empty";
      this.o.smnRuinTimer.toward = "bottom";
      this.o.smnRuinTimer.threshold = 1000;
      this.o.smnRuinTimer.hideafter = 0;
      this.o.smnRuinTimer.fg = window.getComputedStyle(noRuinTimer).backgroundColor;
      this.o.smnRuinTimer.bg = 'black';

      if (1) {
      var aetherflowTimerContainer = document.createElement("div");
      aetherflowTimerContainer.id = 'smn-timers-aetherflow';
      timersContainer.appendChild(aetherflowTimerContainer);

      var aetherflowColor = document.createElement("div");
      aetherflowColor.classList.add('smn-color-aetherflow');
      ruinTimerContainer.appendChild(aetherflowColor);

      this.o.smnAetherflowTimer = document.createElement("timer-box");
      aetherflowTimerContainer.appendChild(this.o.smnAetherflowTimer);

      this.o.smnAetherflowTimer.style = "fill";
      this.o.smnAetherflowTimer.toward = "top";
      this.o.smnAetherflowTimer.threshold = 21;
      this.o.smnAetherflowTimer.fg = window.getComputedStyle(aetherflowColor).backgroundColor;
      this.o.smnAetherflowTimer.bg = 'black';
      }
    }

    if (this.job == 'RDM') {
      var rdmBars = document.createElement("div");
      rdmBars.id = 'rdm-bar';
      barsContainer.appendChild(rdmBars);

      var incs = 20;
      for (var i = 0; i < 100; i += incs) {
        var marker = document.createElement("div");
        marker.classList.add('marker');
        marker.classList.add((i % 40 == 0) ? 'odd' : 'even');
        rdmBars.appendChild(marker);
        marker.style.left = i + '%';
        marker.style.width = incs + '%';
      }

      this.o.whiteManaBarContainer = document.createElement("div");
      this.o.whiteManaBarContainer.id = 'rdm-white-bar';
      this.o.whiteManaBar = document.createElement("resource-bar");
      rdmBars.appendChild(this.o.whiteManaBarContainer);
      this.o.whiteManaBarContainer.appendChild(this.o.whiteManaBar);

      this.o.whiteManaBar.bg = "rgba(0, 0, 0, 0)";
      this.o.whiteManaBar.fg = computeBackgroundColorFrom(this.o.whiteManaBar, 'rdm-color-white-mana');
      this.o.whiteManaBar.width = window.getComputedStyle(this.o.whiteManaBarContainer).width;
      this.o.whiteManaBar.height = window.getComputedStyle(this.o.whiteManaBarContainer).height;
      this.o.whiteManaBar.maxvalue = 100;

      this.o.blackManaBarContainer = document.createElement("div");
      this.o.blackManaBarContainer.id = 'rdm-black-bar';
      this.o.blackManaBar = document.createElement("resource-bar");
      rdmBars.appendChild(this.o.blackManaBarContainer);
      this.o.blackManaBarContainer.appendChild(this.o.blackManaBar);

      this.o.blackManaBar.bg = "rgba(0, 0, 0, 0)";
      this.o.blackManaBar.fg = computeBackgroundColorFrom(this.o.blackManaBar, 'rdm-color-black-mana');
      this.o.blackManaBar.width = window.getComputedStyle(this.o.blackManaBarContainer).width;
      this.o.blackManaBar.height = window.getComputedStyle(this.o.blackManaBarContainer).height;
      this.o.blackManaBar.maxvalue = 100;

      this.o.rdmCombo1 = document.createElement("div");
      this.o.rdmCombo1.id = 'rdm-combo-1';
      this.o.rdmCombo1.classList.add('rdm-combo');
      this.o.rdmCombo2 = document.createElement("div");
      this.o.rdmCombo2.id = 'rdm-combo-2';
      this.o.rdmCombo2.classList.add('rdm-combo');
      this.o.rdmCombo3 = document.createElement("div");
      this.o.rdmCombo3.id = 'rdm-combo-3';
      this.o.rdmCombo3.classList.add('rdm-combo');

      barsContainer.appendChild(this.o.rdmCombo1);
      barsContainer.appendChild(this.o.rdmCombo2);
      barsContainer.appendChild(this.o.rdmCombo3);

      var rdmBoxesContainer = document.createElement("div");
      rdmBoxesContainer.id = 'rdm-boxes';
      barsContainer.appendChild(rdmBoxesContainer);

      this.o.whiteManaTextBox = document.createElement("div");
      this.o.whiteManaTextBox.classList.add('rdm-color-white-mana');
      rdmBoxesContainer.appendChild(this.o.whiteManaTextBox);

      this.o.blackManaTextBox = document.createElement("div");
      this.o.blackManaTextBox.classList.add('rdm-color-black-mana');
      rdmBoxesContainer.appendChild(this.o.blackManaTextBox);

      this.o.whiteManaText = document.createElement("div");
      this.o.whiteManaTextBox.appendChild(this.o.whiteManaText);
      this.o.whiteManaText.classList.add("text");

      this.o.blackManaText = document.createElement("div");
      this.o.blackManaTextBox.appendChild(this.o.blackManaText);
      this.o.blackManaText.classList.add("text");

      if (this.options.ShowRdmProcs) {
        var procsContainer = document.createElement("div");
        procsContainer.id = 'rdm-procs';

        var whiteProcContainer = document.createElement("div");
        whiteProcContainer.id = 'rdm-procs-white';
        var blackProcContainer = document.createElement("div");
        blackProcContainer.id = 'rdm-procs-black';
        var impactProcContainer = document.createElement("div");
        impactProcContainer.id = 'rdm-procs-impact';
        var rdmNoProcWhite = document.createElement("div");
        rdmNoProcWhite.classList.add('inactive');
        rdmNoProcWhite.classList.add('rdm-color-white-mana');
        var rdmNoProcBlack = document.createElement("div");
        rdmNoProcBlack.classList.add('inactive');
        rdmNoProcBlack.classList.add('rdm-color-black-mana');
        var rdmNoProcImpact = document.createElement("div");
        rdmNoProcImpact.classList.add('inactive');
        rdmNoProcImpact.classList.add('rdm-color-impact');
        this.o.rdmProcWhite = document.createElement("timer-box");
        this.o.rdmProcBlack = document.createElement("timer-box");
        this.o.rdmProcImpact = document.createElement("timer-box");

        barsContainer.appendChild(procsContainer);
        procsContainer.appendChild(whiteProcContainer);
        procsContainer.appendChild(blackProcContainer);
        procsContainer.appendChild(impactProcContainer);
        whiteProcContainer.appendChild(rdmNoProcWhite);
        blackProcContainer.appendChild(rdmNoProcBlack);
        impactProcContainer.appendChild(rdmNoProcImpact);
        whiteProcContainer.appendChild(this.o.rdmProcWhite);
        blackProcContainer.appendChild(this.o.rdmProcBlack);
        impactProcContainer.appendChild(this.o.rdmProcImpact);

        this.o.rdmProcWhite.style = "empty";
        this.o.rdmProcWhite.toward = "bottom";
        this.o.rdmProcWhite.threshold = 1000;
        this.o.rdmProcWhite.hideafter = 0;
        this.o.rdmProcWhite.fg = window.getComputedStyle(rdmNoProcWhite).backgroundColor;
        this.o.rdmProcWhite.bg = 'black';
        this.o.rdmProcBlack.style = "empty";
        this.o.rdmProcBlack.toward = "bottom";
        this.o.rdmProcBlack.threshold = 1000;
        this.o.rdmProcBlack.hideafter = 0;
        this.o.rdmProcBlack.fg = window.getComputedStyle(rdmNoProcBlack).backgroundColor;
        this.o.rdmProcBlack.bg = 'black';
        this.o.rdmProcImpact.style = "empty";
        this.o.rdmProcImpact.toward = "bottom";
        this.o.rdmProcImpact.threshold = 1000;
        this.o.rdmProcImpact.hideafter = 0;
        this.o.rdmProcImpact.fg = window.getComputedStyle(rdmNoProcImpact).backgroundColor;
        this.o.rdmProcImpact.bg = 'black';
      }
    } else if (this.job == "WAR") {
      var beastBoxesContainer = document.createElement("div");
      beastBoxesContainer.id = 'war-boxes';
      barsContainer.appendChild(beastBoxesContainer);

      this.o.beastTextBox = document.createElement("div");
      this.o.beastTextBox.classList.add('war-color-beast');
      beastBoxesContainer.appendChild(this.o.beastTextBox);

      this.o.beastText = document.createElement("div");
      this.o.beastTextBox.appendChild(this.o.beastText);
      this.o.beastText.classList.add("text");

      var eyeContainer = document.createElement("div");
      eyeContainer.id = 'war-procs';
      barsContainer.appendChild(eyeContainer);

      this.o.eyeBox = document.createElement("timer-box");
      eyeContainer.appendChild(this.o.eyeBox);
      this.o.eyeBox.style = "empty";
      this.o.eyeBox.fg = computeBackgroundColorFrom(this.o.eyeBox, 'war-color-eye');
      this.o.eyeBox.bg = 'black';
      this.o.eyeBox.toward = "bottom";
      this.o.eyeBox.threshold = 0;
      this.o.eyeBox.hideafter = "";
      this.o.eyeBox.roundupthreshold = false;
      this.o.eyeBox.valuescale = this.options.WarGcd;
    } else if (this.job == "MNK") {
      var mnkBars = document.createElement("div");
      mnkBars.id = 'mnk-bar';
      barsContainer.appendChild(mnkBars);

      this.o.lightningContainer = document.createElement("div");
      this.o.lightningContainer.id = 'mnk-timers-lightning';
      this.o.lightningTimer = document.createElement("timer-bar");
      mnkBars.appendChild(this.o.lightningContainer);
      this.o.lightningContainer.appendChild(this.o.lightningTimer);

      this.o.lightningTimer.width = window.getComputedStyle(this.o.lightningContainer).width;
      this.o.lightningTimer.height = window.getComputedStyle(this.o.lightningContainer).height;
      this.o.lightningTimer.toward = "left";
      this.o.lightningTimer.bg = computeBackgroundColorFrom(this.o.lightningTimer, 'bar-border-color');

      this.o.formContainer = document.createElement("div");
      this.o.formContainer.id = 'mnk-timers-combo';
      this.o.formTimer = document.createElement("timer-bar");
      mnkBars.appendChild(this.o.formContainer);
      this.o.formContainer.appendChild(this.o.formTimer);

      this.o.formTimer.width = window.getComputedStyle(this.o.formContainer).width;
      this.o.formTimer.height = window.getComputedStyle(this.o.formContainer).height;
      this.o.formTimer.style = "empty";
      this.o.formTimer.toward = "left";
      this.o.formTimer.bg = computeBackgroundColorFrom(this.o.formTimer, 'bar-border-color');
      this.o.formTimer.fg = computeBackgroundColorFrom(this.o.formTimer, 'mnk-color-form');

      var mnkBoxesContainer = document.createElement("div");
      mnkBoxesContainer.id = 'mnk-boxes';
      barsContainer.appendChild(mnkBoxesContainer);

      this.o.chakraTextBox = document.createElement("div");
      this.o.chakraTextBox.classList.add('mnk-color-chakra');
      mnkBoxesContainer.appendChild(this.o.chakraTextBox);

      this.o.chakraText = document.createElement("div");
      this.o.chakraTextBox.appendChild(this.o.chakraText);
      this.o.chakraText.classList.add("text");

      var mnkProcs = document.createElement("div");
      mnkProcs.id = 'mnk-procs';
      barsContainer.appendChild(mnkProcs);

      this.o.dragonKickTimer = document.createElement("timer-box");
      this.o.dragonKickTimer.id = "mnk-procs-dragonkick";
      mnkProcs.appendChild(this.o.dragonKickTimer);
      this.o.dragonKickTimer.style = "empty";
      this.o.dragonKickTimer.fg = computeBackgroundColorFrom(this.o.dragonKickTimer, 'mnk-color-dragonkick');
      this.o.dragonKickTimer.bg = 'black';
      this.o.dragonKickTimer.toward = "bottom";
      this.o.dragonKickTimer.threshold = 0;
      this.o.dragonKickTimer.hideafter = "";
      this.o.dragonKickTimer.roundupthreshold = false;
      this.o.dragonKickTimer.threshold = 6;

      this.o.twinSnakesTimer = document.createElement("timer-box");
      this.o.twinSnakesTimer.id = "mnk-procs-twinsnakes";
      mnkProcs.appendChild(this.o.twinSnakesTimer);
      this.o.twinSnakesTimer.style = this.o.dragonKickTimer.style;
      this.o.twinSnakesTimer.fg = computeBackgroundColorFrom(this.o.twinSnakesTimer, 'mnk-color-twinsnakes');
      this.o.twinSnakesTimer.bg = this.o.dragonKickTimer.bg;
      this.o.twinSnakesTimer.toward = this.o.dragonKickTimer.toward;
      this.o.twinSnakesTimer.threshold = this.o.dragonKickTimer.threshold;
      this.o.twinSnakesTimer.hideafter = this.o.dragonKickTimer.hideafter;
      this.o.twinSnakesTimer.roundupthreshold = this.o.dragonKickTimer.roundupthreshold;
      this.o.twinSnakesTimer.threshold = 6;

      this.o.demolishTimer = document.createElement("timer-box");
      this.o.demolishTimer.id = "mnk-procs-demolish";
      mnkProcs.appendChild(this.o.demolishTimer);
      this.o.demolishTimer.style = this.o.dragonKickTimer.style;
      this.o.demolishTimer.fg = computeBackgroundColorFrom(this.o.demolishTimer, 'mnk-color-demolish');
      this.o.demolishTimer.bg = this.o.dragonKickTimer.bg;
      this.o.demolishTimer.toward = this.o.dragonKickTimer.toward;
      this.o.demolishTimer.threshold = this.o.dragonKickTimer.threshold;
      this.o.demolishTimer.hideafter = this.o.dragonKickTimer.hideafter;
      this.o.demolishTimer.roundupthreshold = this.o.dragonKickTimer.roundupthreshold;
      // Slightly shorter time, to make the box not pop right as
      // you hit snap punch at t=6 (which is probably fine).
      this.o.demolishTimer.threshold = 5;

      this.o.lightningFgColors = [];
      for (var i = 0; i <= 3; ++i)
        this.o.lightningFgColors.push(computeBackgroundColorFrom(this.o.lightningTimer, 'mnk-color-lightning-' + i));
    }
  }

  MakeAuraTimerIcon(name, seconds, iconWidth, iconHeight, iconText, barHeight, textHeight, borderSize, borderColor, barColor, auraIcon) {
    var div = document.createElement("div");

    if (seconds < 0) {
      div.style.borderWidth = 1;
      div.style.borderStyle = 'solid';
      div.style.borderColor = '#000';
      div.style.width = iconWidth - borderSize * 2;
      div.style.height = iconHeight - borderSize * 2;
      div.style.backgroundColor = borderColor;
      var inner = document.createElement('div');
      div.appendChild(inner);
      inner.style.position = 'relative';
      inner.style.left = borderSize;
      inner.style.top = borderSize;
      inner.style.borderWidth = borderSize;
      inner.style.borderStyle = 'solid';
      inner.style.borderColor = '#000';
      inner.style.width = iconWidth - borderSize * 6;
      inner.style.height = iconHeight - borderSize * 6;
      inner.style.backgroundImage = 'url(' + auraIcon + ')';
      inner.style.backgroundColor = '#888';
      inner.style.backgroundRepeat = 'no-repeat';
      inner.style.backgroundSize = Math.max(iconWidth, iconHeight) - borderSize * 2 + 'px';
      inner.style.backgroundPosition = 'center';
      return div;
    }


    var icon = document.createElement("timer-icon");
    icon.width = iconWidth;
    icon.height = iconHeight;
    icon.bordersize = borderSize;
    div.appendChild(icon);

    var barDiv = document.createElement("div");
    barDiv.style.position = "relative";
    barDiv.style.top = iconHeight;
    div.appendChild(barDiv);

    var bar = document.createElement("timer-bar");
    bar.width = iconWidth;
    bar.height = barHeight;
    barDiv.appendChild(bar);

    if (textHeight > 0) {
      var text = document.createElement("div");
      text.classList.add('text');
      text.style.width = iconWidth;
      text.style.height = textHeight;
      text.style.overflow = "hidden";
      text.style.fontSize = textHeight - 1;
      text.style.whiteSpace = "pre";
      text.style.position = "relative";
      text.style.top = iconHeight;
      text.style.fontFamily = "arial";
      text.style.fontWeight = "bold";
      text.style.color = "white";
      text.style.textShadow = "-1px 0 3px black, 0 1px 3px black, 1px 0 3px black, 0 -1px 3px black";
      text.style.paddingBottom = textHeight / 4;

      text.innerText = name;
      div.appendChild(text);
    }

    if (iconText)
      icon.text = iconText;
    icon.bordercolor = borderColor;
    bar.fg = barColor;
    icon.icon = auraIcon;
    icon.duration = seconds;
    bar.duration = seconds;

    return div;
  }

  OnSummonerUpdate(aetherflowStacks, dreadwyrmStacks, bahamutStacks, dreadwyrmMilliseconds, bahamutMilliseconds) {
    if (this.o.smnBahamutStacks == null || this.o.smnAetherflowStacks == null)
      return;

    for (var i = 0; i < this.o.smnBahamutStacks.length; ++i) {
      if (bahamutStacks > i)
        this.o.smnBahamutStacks[i].classList.add('active');
      else
        this.o.smnBahamutStacks[i].classList.remove('active');

      if (bahamutMilliseconds > 0)
        this.o.smnBahamutStacks[i].classList.add('channeling');
      else
        this.o.smnBahamutStacks[i].classList.remove('channeling');
    }
    for (var i = 0, n = this.o.smnAetherflowStacks.length; i < n; ++i) {
      if (aetherflowStacks > i)
        this.o.smnAetherflowStacks[i].classList.add('active');
      else
        this.o.smnAetherflowStacks[i].classList.remove('active');
      if (dreadwyrmStacks > i)
        this.o.smnAetherflowStacks[n - 1 - i].classList.add('dreadwyrm');
      else
        this.o.smnAetherflowStacks[n - 1 - i].classList.remove('dreadwyrm');

      if (dreadwyrmMilliseconds > 0)
        this.o.smnAetherflowStacks[i].classList.add('channeling');
      else
        this.o.smnAetherflowStacks[i].classList.remove('channeling');
    }

    if (dreadwyrmMilliseconds > 0) {
      this.o.smnDreadwyrmTimerContainer.classList.add('channeling');
      if (this.smnChanneling != 1) {
        this.smnChanneling = 1;
        this.o.smnDreadwyrmTimer.duration = dreadwyrmMilliseconds / 1000;
      }
    } else {
      this.o.smnDreadwyrmTimerContainer.classList.remove('channeling');
    }
    if (bahamutMilliseconds > 0) {
      this.o.smnBahamutTimerContainer.classList.add('channeling');
      if (this.smnChanneling != 2) {
        this.smnChanneling = 2;
        this.o.smnBahamutTimer.duration = bahamutMilliseconds / 1000;
      }
    }
    else {
      this.o.smnBahamutTimerContainer.classList.remove('channeling');
    }
    if (dreadwyrmMilliseconds == 0 && bahamutMilliseconds == 0)
      this.smnChanneling = 0;
  }

  OnRedMageUpdate(white, black) {
    if (this.o.whiteManaBar == null || this.o.blackManaBar == null)
      return;

    this.o.whiteManaBar.value = white;
    this.o.blackManaBar.value = black;
    this.o.whiteManaText.innerText = white;
    this.o.blackManaText.innerText = black;

    if (white < 80)
      this.o.whiteManaTextBox.classList.add('dim');
    else
      this.o.whiteManaTextBox.classList.remove('dim');
    if (black < 80)
      this.o.blackManaTextBox.classList.add('dim');
    else
      this.o.blackManaTextBox.classList.remove('dim');
  }

  OnWarUpdate(beast) {
    if (this.o.beastTextBox == null) {
      return;
    }
    this.o.beastText.innerText = beast;

    if (beast < 50) {
      this.o.beastTextBox.classList.add('low');
      this.o.beastTextBox.classList.remove('mid');
    } else if (beast < 100) {
      this.o.beastTextBox.classList.remove('low');
      this.o.beastTextBox.classList.add('mid');
    } else {
      this.o.beastTextBox.classList.remove('low');
      this.o.beastTextBox.classList.remove('mid');
    }
  }

  OnMonkUpdate(lightningStacks, chakraStacks, lightningMilliseconds) {
    if (this.o.chakraTextBox == null)
      return;

    this.o.chakraText.innerText = chakraStacks;
    if (chakraStacks < 5)
      this.o.chakraTextBox.classList.add('dim');
    else
      this.o.chakraTextBox.classList.remove('dim');

    // Show sad red bar when you've lost all your pancakes.
    var lightningSeconds = lightningMilliseconds / 1000.0;
    if (lightningStacks == 0) {
      this.o.lightningTimer.style = "fill";
      lightningSeconds = 0;
    } else {
      this.o.lightningTimer.style = "empty";
    }

    // Setting the duration resets the timer bar to 0, so set
    // duration first before adjusting the value.
    this.o.lightningTimer.duration = 16;
    this.o.lightningTimer.value = lightningSeconds;

    this.o.lightningTimer.fg = this.o.lightningFgColors[lightningStacks];
  }

  OnMonkFormChange(seconds) {
    this.o.formTimer.duration = 0;
    this.o.formTimer.duration = seconds;
    this.o.formTimer.fg = computeBackgroundColorFrom(this.o.formTimer, 'mnk-color-form');
  }

  OnMonkPerfectBalance(seconds) {
    this.o.formTimer.duration = 0;
    this.o.formTimer.duration = seconds;
    this.o.formTimer.fg = computeBackgroundColorFrom(this.o.formTimer, 'mnk-color-pb');
  }

  OnMonkDragonKick(seconds) {
    var kAnimationDelay = 1.2;

    this.o.dragonKickTimer.duration = 0;
    this.o.dragonKickTimer.duration = seconds - kAnimationDelay;
  }

  OnMonkTwinSnakes() {
    this.o.twinSnakesTimer.duration = 0;
    this.o.twinSnakesTimer.duration = 15;
  }

  OnMonkDemolish() {
    this.o.demolishTimer.duration = 0;
    this.o.demolishTimer.duration = 18;
  }

  OnSummonerAetherflow(seconds) {
    if (this.o.smnAetherflowTimer != null) {
      // Reset to 0 first to make sure the timer starts over.
      this.o.smnAetherflowTimer.duration = 0;
      this.o.smnAetherflowTimer.duration = seconds;
    }
  }

  OnSummonerRuinProc(seconds) {
    if (this.o.smnRuinTimer != null) {
      // Reset to 0 first to make sure the timer starts over.
      this.o.smnRuinTimer.duration = 0;
      this.o.smnRuinTimer.duration = Math.max(0, seconds);
    }
  }

  OnRedMageProcBlack(seconds) {
    if (this.o.rdmProcBlack != null)
      this.o.rdmProcBlack.duration = Math.max(0, seconds - this.options.RdmCastTime);
  }

  OnRedMageProcWhite(seconds) {
    if (this.o.rdmProcWhite != null)
      this.o.rdmProcWhite.duration = Math.max(0, seconds - this.options.RdmCastTime);
  }

  OnRedMageProcImpact(seconds) {
    if (this.o.rdmProcImpact != null)
      this.o.rdmProcImpact.duration = Math.max(0, seconds - this.options.RdmCastTime);
  }

  OnComboChange(skill) {
    if (this.job == "RDM") {
      if (this.o.rdmCombo1 == null || this.o.rdmCombo2 == null || this.o.rdmCombo3 == null)
        return;

      if (!skill)
        skill = "";
      if (skill.indexOf('Riposte') >= 0)
        this.o.rdmCombo1.classList.add('active');
      else
        this.o.rdmCombo1.classList.remove('active');
      if (skill.indexOf('Zwerchhau') >= 0)
        this.o.rdmCombo2.classList.add('active');
      else
        this.o.rdmCombo2.classList.remove('active');
      if (skill.indexOf('Redoublement') >= 0)
        this.o.rdmCombo3.classList.add('active');
      else
        this.o.rdmCombo3.classList.remove('active');
    } else if (this.job == "WAR") {
      if (skill == "Storm's Eye") {
        this.o.eyeBox.duration = 0;
        this.o.eyeBox.duration = 30;
      }

      // Min number of skills until eye without breaking combo.
      var minSkillsUntilEye;
      if (skill == "Heavy Swing") {
        minSkillsUntilEye = 2;
      } else if (skill == "Skull Sunder") {
        minSkillsUntilEye = 4;
      } else if (skill == "Maim") {
        minSkillsUntilEye = 1;
      } else {
        // End of combo, or broken combo.
        minSkillsUntilEye = 3;
      }

      // The new threshold is "can I finish the current combo and still
      // have time to do a Storm's Eye".  The 0.3 is for reaction
      // time slop.
      var oldThreshold = parseFloat(this.o.eyeBox.threshold);
      var newThreshold = (minSkillsUntilEye + 2) * this.options.WarGcd + 0.3;

      // Because thresholds are nonmonotonic (when finishing a combo)
      // be careful about setting them in ways that are visually poor.
      if (this.o.eyeBox.value >= oldThreshold &&
          this.o.eyeBox.value >= newThreshold) {
        this.o.eyeBox.threshold = newThreshold;
      } else {
        this.o.eyeBox.threshold = oldThreshold;
      }
    }
  }

  UpdateHealth() {
    if (!this.o.healthBar) return;
    this.o.healthBar.value = this.hp;
    this.o.healthBar.maxvalue = this.maxHP;

    if (this.maxHP > 0 && (this.hp / this.maxHP) < this.options.LowHealthThresholdPercent)
      this.o.healthBar.fg = computeBackgroundColorFrom(this.o.healthBar, 'hp-color.low');
    else if (this.maxHP > 0 && (this.hp / this.maxHP) < this.options.MidHealthThresholdPercent)
      this.o.healthBar.fg = computeBackgroundColorFrom(this.o.healthBar, 'hp-color.mid');
    else
      this.o.healthBar.fg = computeBackgroundColorFrom(this.o.healthBar, 'hp-color');
  }

  UpdateMana() {
    if (!this.o.manaBar) return;
    this.o.manaBar.value = this.mp;
    this.o.manaBar.maxvalue = this.maxMP;

    var far = -1;
    if (this.job == 'RDM' || this.job == 'BLM' || this.job == 'SMN' || this.job == 'ACN')
      far = this.options.FarThresholdOffence;

    if (far >= 0 && this.distance > far)
      this.o.manaBar.fg = computeBackgroundColorFrom(this.o.manaBar, 'mp-color.far');
    else
      this.o.manaBar.fg = computeBackgroundColorFrom(this.o.manaBar, 'mp-color')
  }

  UpdateTP() {
    if (!this.o.tpBar) return;

    if (this.tp <= this.options.TPInvigorateThreshold)
      this.o.tpBar.fg = computeBackgroundColorFrom(this.o.tpBar, 'tp-color.low');
    else
      this.o.tpBar.fg = computeBackgroundColorFrom(this.o.tpBar, 'tp-color');

    this.o.tpBar.value = this.tp;
    this.o.tpBar.maxvalue = this.maxTP;
  }

  UpdateCP() {
    if (!this.o.cpBar) return;
    this.o.cpBar.value = this.cp;
    this.o.cpBar.maxvalue = this.maxCP;
  }

  UpdateGP() {
    if (!this.o.gpBar) return;
    this.o.gpBar.value = this.gp;
    this.o.gpBar.maxvalue = this.maxGP;
  }

  UpdateOpacity() {
    var opacityContainer = document.getElementById("opacity-container");
    if (!opacityContainer) return;
    if (this.inCombat || !this.options.LowerOpacityOutOfCombat)
      opacityContainer.style.opacity = 1.0;
    else
      opacityContainer.style.opacity = 0.5;
  }

  UpdateFoodBuff() {
    // Non-combat jobs don't set up the left buffs list.
    if (!this.init || !this.o.leftBuffsList)
      return;

    var CanShowWellFedWarning = function() {
      if (this.inCombat)
        return false;
      if (this.level < this.options.MaxLevel)
        return true;
      return this.zone.search(kWellFedZoneRegex) >= 0;
    }

    // Returns the number of ms until it should be shown. If <= 0, show it.
    var TimeToShowWellFedWarning = function() {
      var now_ms = Date.now();
      var show_at_ms = this.foodBuffExpiresTimeMs - (this.options.HideWellFedAboveSeconds * 1000);
      return show_at_ms - now_ms;
    }

    window.clearTimeout(this.foodBuffTimer);
    this.foodBuffTimer = null;

    var canShow = CanShowWellFedWarning.bind(this)();
    var showAfterMs = TimeToShowWellFedWarning.bind(this)();

    if (!canShow || showAfterMs > 0) {
      this.o.leftBuffsList.removeElement('foodbuff');
      if (canShow)
        this.foodBuffTimer = window.setTimeout(this.UpdateFoodBuff.bind(this), showAfterMs);
    } else {
      var div = this.MakeAuraTimerIcon(
          'foodbuff', -1,
          this.options.BigBuffIconWidth, this.options.BigBuffIconHeight,
          '',
          this.options.BigBuffBarHeight, this.options.BigBuffTextHeight,
          this.options.BigBuffBorderSize,
          'yellow', 'yellow',
          kIconBuffFood);
      this.o.leftBuffsList.addElement('foodbuff', div, -1);
    }
  }

  OnPartyWipe(e) {
    this.OnSummonerAetherflow(0);
  }

  OnInCombatChanged(e) {
    this.inCombat = e.detail.inCombat;
    if (this.inCombat)
      this.SetPullCountdown(0);

    this.UpdateOpacity();
    this.UpdateFoodBuff();
  }

  OnZoneChanged(e) {
    this.zone = e.detail.zoneName;
    this.UpdateFoodBuff();
  }

  SetPullCountdown(seconds) {
    if (this.o.pullCountdown == null) return;

    var in_countdown = seconds > 0;
    var showing_countdown = parseFloat(this.o.pullCountdown.duration) > 0;
    if (in_countdown != showing_countdown) {
      this.o.pullCountdown.duration = seconds;
      if (in_countdown) {
        var audio = new Audio('../../resources/sounds/PowerAuras/sonar.ogg');
        audio.volume = 0.3;
        audio.play();
      }
    }
  }

  OnBigBuff(name, seconds, settings) {
    var aura = this.MakeAuraTimerIcon(
        name, seconds,
        this.options.BigBuffIconWidth, this.options.BigBuffIconHeight,
        settings.text,
        this.options.BigBuffBarHeight, this.options.BigBuffTextHeight,
        this.options.BigBuffBorderSize,
        settings.borderColor, settings.borderColor,
        settings.icon);
    var list = this.o.rightBuffsList;
    if (settings.side && settings.side == 'left' && this.o.leftBuffsList)
      list = this.o.leftBuffsList;
    list.addElement(name, aura, settings.sortKey);
    var that = this;
    window.clearTimeout(settings.timeout);
    if (seconds >= 0) {
      settings.timeout = window.setTimeout(function() {
        that.o.rightBuffsList.removeElement(name);
      }, seconds * 1000);
    }
  }

  OnLoseBigBuff(name, settings) {
    window.clearTimeout(settings.timeout);
    var list = this.o.rightBuffsList;
    if (settings.side && settings.side == 'left' && this.o.leftBuffsList)
      list = this.o.leftBuffsList;
    list.removeElement(name);
  }

  OnPlayerChanged(e) {
    if (!this.init) {
      this.me = e.detail.name;
      setupRegexes();
      setupBuffTracker();
      this.combo = setupComboTracker(this.OnComboChange.bind(this));
      this.init = true;
    }

    var update_job = false;
    var update_hp = false;
    var update_mp = false;
    var update_tp = false;
    var update_cp = false;
    var update_gp = false;
    var update_level = false;
    if (e.detail.job != this.job) {
      this.job = e.detail.job;
      this.combo.AbortCombo();  // Combos are job specific.
      update_job = update_hp = update_mp = update_tp = update_cp = update_gp = true;
    }
    if (e.detail.level != this.level) {
      this.level = e.detail.level;
      update_level = true;
    }
    if (e.detail.currentHP != this.hp || e.detail.maxHP != this.maxHP) {
      this.hp = e.detail.currentHP;
      this.maxHP = e.detail.maxHP;
      update_hp = true;

      if (this.hp == 0) {
        this.combo.AbortCombo();  // Death resets combos.
      }
    }
    if (e.detail.currentMP != this.mp || e.detail.maxMP != this.maxMP) {
      this.mp = e.detail.currentMP;
      this.maxMP = e.detail.maxMP;
      update_mp = true;
    }
    if (e.detail.currentTP != this.tp || e.detail.maxTP != this.maxTP) {
      this.tp = e.detail.currentTP;
      this.maxTP = e.detail.maxTP;
      update_tp = true;
    }
    if (e.detail.currentCP != this.cp || e.detail.maxCP != this.maxCP) {
      this.cp = e.detail.currentCP;
      this.maxCP = e.detail.maxCP;
      update_cp = true;
    }
    if (e.detail.currentGP != this.gp || e.detail.maxGP != this.maxGP) {
      this.gp = e.detail.currentGP;
      this.maxGP = e.detail.maxGP;
      update_gp = true;
    }
    if (update_job) {
      this.UpdateJob();
      // On reload, we need to set the opacity after setting up the job bars.
      this.UpdateOpacity();
    }
    if (update_hp)
      this.UpdateHealth();
    if (update_mp)
      this.UpdateMana();
    if (update_tp)
      this.UpdateTP();
    if (update_cp)
      this.UpdateCP();
    if (update_gp)
      this.UpdateGP();
    if (update_level)
      this.UpdateFoodBuff();

    if (this.job == "RDM") {
        if (update_job ||
            e.detail.jobDetail.whiteMana != this.whiteMana ||
            e.detail.jobDetail.blackMana != this.blackMana) {
          this.whiteMana = e.detail.jobDetail.whiteMana;
          this.blackMana = e.detail.jobDetail.blackMana;
          this.OnRedMageUpdate(this.whiteMana, this.blackMana);
        }
    } else if (this.job == "WAR") {
      if (update_job || e.detail.jobDetail.beast != this.beast) {
        this.beast = e.detail.jobDetail.beast;
        this.OnWarUpdate(this.beast);
      }
    } else if (this.job == 'SMN' || this.job == 'SCH' || this.job == 'ACN') {
      if (update_job ||
          e.detail.jobDetail.aetherflowStacks != this.aetherflowStacks ||
          e.detail.jobDetail.dreadwyrmStacks != this.dreadwyrmStacks ||
          e.detail.jobDetail.bahamutStacks != this.bahamutStacks ||
          e.detail.jobDetail.dreadwyrmMilliseconds != this.dreadwyrmMilliseconds ||
          e.detail.jobDetail.bahamutMilliseconds != this.bahamutMilliseconds) {
        this.aetherflowStacks = e.detail.jobDetail.aetherflowStacks;
        this.dreadwyrmStacks = e.detail.jobDetail.dreadwyrmStacks;
        this.bahamutStacks = e.detail.jobDetail.bahamutStacks;
        this.dreadwyrmMilliseconds = e.detail.jobDetail.dreadwyrmMilliseconds;
        this.bahamutMilliseconds = e.detail.jobDetail.bahamutMilliseconds;
        this.OnSummonerUpdate(this.aetherflowStacks, this.dreadwyrmStacks, this.bahamutStacks, this.dreadwyrmMilliseconds, this.bahamutMilliseconds);
      }
    } else if (this.job == 'MNK') {
      if (update_job ||
          e.detail.jobDetail.lightningStacks != this.lightningStacks ||
          e.detail.jobDetail.chakraStacks != this.chakraStacks ||
          e.detail.jobDetail.lightningMilliseconds > this.lightningMilliseconds) {
        this.lightningStacks = e.detail.jobDetail.lightningStacks;
        this.chakraStacks = e.detail.jobDetail.chakraStacks;
        this.lightningMilliseconds = e.detail.jobDetail.lightningMilliseconds;
        this.OnMonkUpdate(this.lightningStacks, this.chakraStacks, this.lightningMilliseconds);
      } else {
        this.lightningMilliseconds = e.detail.jobDetail.lightningMilliseconds;
      }
    }
  }

  OnTargetChanged(e) {
    var update = false;
    if (e.detail.name == null) {
      if (this.distance != -1) {
        this.distance = -1;
        update = true;
      }
    } else if (e.detail.distance != this.distance, this.job) {
      this.distance = e.detail.distance;
      update = true;
    }
    if (update) {
      this.UpdateHealth();
      this.UpdateMana();
      this.UpdateTP();
    }
  }

  OnLogEvent(e) {
    if (!this.init)
      return;

    for (var i = 0; i < e.detail.logs.length; i++) {
      var log = e.detail.logs[i];

      var r = log.match(gLang.countdownStartRegex());
      if (r != null) {
        var seconds = Regexes.ParseLocaleFloat(r[1]);
        this.SetPullCountdown(seconds);
        continue;
      }
      if (log.search(gLang.countdownCancelRegex()) >= 0) {
        this.SetPullCountdown(0);
        continue;
      }

      r = log.match(kReFoodBuff);
      if (r != null) {
        var seconds = Regexes.ParseLocaleFloat(r[1]);
        var now = Date.now();  // This is in ms.
        this.foodBuffExpiresTimeMs = now + (seconds * 1000);
        this.UpdateFoodBuff();
      }

      for (var name in kBigBuffTracker) {
        var settings = kBigBuffTracker[name];
        var r = log.match(settings.gainRegex);
        if (r != null) {
          var seconds = -1;
          if ('durationSeconds' in settings) {
            seconds = settings.durationSeconds;
          } else if ('durationPosition' in settings) {
            seconds = Regexes.ParseLocaleFloat(r[settings.durationPosition]);
          }
          this.OnBigBuff(name, seconds, settings);
        }
        if (settings.loseRegex) {
          r = log.match(settings.loseRegex);
          if (r != null)
            this.OnLoseBigBuff(name, settings);
        }
      }

      if (this.combo.ParseLog(log))
        continue;

      if (this.job == 'SMN') {
        var r = log.match(kReSmnRuinProc);
        if (r != null) {
          var seconds = Regexes.ParseLocaleFloat(r[1]);
          this.OnSummonerRuinProc(seconds);
          continue;
        }
        if (log.search(kReSmnRuinProcEnd) >= 0) {
          this.OnSummonerRuinProc(0);
          continue;
        }
        if (log.search(kReSmnAetherflow) >= 0) {
          this.OnSummonerAetherflow(this.options.SmnAetherflowRecast);
          continue;
        }
      }

      if (this.job == 'RDM') {
        var r = log.match(kReRdmBlackManaProc);
        if (r != null) {
          var seconds = Regexes.ParseLocaleFloat(r[1]);
          this.OnRedMageProcBlack(seconds);
          continue;
        }
        r = log.match(kReRdmWhiteManaProc);
        if (r != null) {
          var seconds = Regexes.ParseLocaleFloat(r[1]);
          this.OnRedMageProcWhite(seconds);
          continue;
        }
        r = log.match(kReRdmImpactProc);
        if (r != null) {
          var seconds = Regexes.ParseLocaleFloat(r[1]);
          this.OnRedMageProcImpact(seconds);
          continue;
        }
        if (log.search(kReRdmBlackManaProcEnd) >= 0) {
          this.OnRedMageProcBlack(0);
          continue;
        }
        if (log.search(kReRdmWhiteManaProcEnd) >= 0) {
          this.OnRedMageProcWhite(0);
          continue;
        }
        if (log.search(kReRdmImpactProcEnd) >= 0) {
          this.OnRedMageProcImpact(0);
          continue;
        }
      }
      if (this.job == 'MNK') {
        if (log.search(kTwinSnakes) >= 0) {
          this.OnMonkTwinSnakes();
          continue;
        }
        if (log.search(kDemolish) >= 0) {
          this.OnMonkDemolish();
          continue;
        }
        var r = log.match(kFormChange);
        if (r != null) {
          var seconds = Regexes.ParseLocaleFloat(r[1]);
          this.OnMonkFormChange(seconds);
          continue;
        }
        r = log.match(kPeanutButter);
        if (r != null) {
          var seconds = Regexes.ParseLocaleFloat(r[1]);
          this.OnMonkPerfectBalance(seconds);
          continue;
        }
        r = log.match(kBluntDebuff);
        if (r != null) {
          var seconds = Regexes.ParseLocaleFloat(r[1]);
          this.OnMonkDragonKick(seconds);
          continue;
        }
      }

      // For learning boss ability codes.
      //if (log.search(/Exdeath (starts using Unknown_|readies |begins casting )/) >= 0)
      //  console.log(log);

      if (log.search(/:test:jobs:/) >= 0)
        this.Test();
    }
  }

  Test() {
    var logs = [];
    logs.push(' 1A:' + this.me + ' gains the effect of Medicated from ' + this.me + ' for 30,2 Seconds.');
    logs.push(' 1A:' + this.me + ' gains the effect of Embolden from  for 20 Seconds. (5)');
    logs.push(' 1A:' + this.me + ' gains the effect of Battle Litany from  for 25 Seconds.');
    logs.push(' 1A:' + this.me + ' gains the effect of The Balance from  for 12 Seconds.');
    logs.push(' 1A:Okonomi Yaki gains the effect of Foe Requiem from Okonomi Yaki for 9999.00 Seconds.');
    logs.push(' 15:1048638C:Okonomi Yaki:8D2:Trick Attack:40000C96:Striking Dummy:28710103:154B:');
    logs.push(' 1A:' + this.me + ' gains the effect of Left Eye from That Guy for 15.0 Seconds.');
    logs.push(' 1A:' + this.me + ' gains the effect of Right Eye from That Guy for 15.0 Seconds.');
    logs.push(' 15:1048638C:Tako Yaki:1D0C:Chain Stratagem:40000C96:Striking Dummy:28710103:154B:');
    logs.push(' 15:1048638C:Tako Yaki:B45:Hypercharge:40000C96:Striking Dummy:28710103:154B:');
    logs.push(' 1A:' + this.me + ' gains the effect of Devotion from That Guy for 15.0 Seconds.');
    logs.push(' 1A:' + this.me + ' gains the effect of Brotherhood from That Guy for 15.0 Seconds.');
    var e = { detail: { logs: logs } };
    this.OnLogEvent(e);
  }
}

var gBars;

document.addEventListener("onGameExistsEvent", function (e) {
  if (!gBars) gBars = new Bars(Options);
});
document.addEventListener("onPlayerChangedEvent", function (e) {
  gBars.OnPlayerChanged(e);
});
document.addEventListener("onTargetChangedEvent", function (e) {
  gBars.OnTargetChanged(e);
});
document.addEventListener("onPartyWipe", function (e) {
  gBars.OnPartyWipe(e);
});
document.addEventListener("onInCombatChangedEvent", function (e) {
  gBars.OnInCombatChanged(e);
});
document.addEventListener("onZoneChangedEvent", function (e) {
  gBars.OnZoneChanged(e);
});
document.addEventListener("onLogEvent", function (e) {
  gBars.OnLogEvent(e);
});
