"use strict";

var kOptions = {
  // If true, the bars are all made translucent when out of combat.
  kLowerOpacityOutOfCombat: true,
  // The number of seconds before food expires to start showing the food buff warning.
  kHideWellFedAboveSeconds: 15 * 60,
  // Zones to show food buff warning (when at max level).
  kWellFedZoneRegex: /^(Unknown Zone \([0-9A-Fa-f]+\)|Deltascape.*Savage.*)$/,
  // Option to show the stone/fire/impact procs.
  kShowRdmProcs: true,

  // The food buff warning is shown when you're below this level. Update this when new expansion happens. 
  kMaxLevel: 70,
  // The distance that offensive spells such as VerAreo, etc are castable.
  kFarThresholdOffence: 24,
  // Show procs ending this amount early so as to not waste GCDs on no-longer-useful procs.
  // Jolt cast time + 0.5 for my reaction time.
  kRdmCastTime: 1.94 + 0.5,
  // GCD on warrior.
  kWarGcd: 2.38,

  // Big buff icons.
  kBigBuffIconWidth: 44,
  kBigBuffIconHeight: 32,
  kBigBuffBarHeight: 5,
  kBigBuffTextHeight: 12,
  kBigBuffBorderSize: 1,

  // Colours.
  kTPInvigorateThreshold: 600,
  kLowHealthThresholdPercent: 0.2,
  kMidHealthThresholdPercent: 0.8,
}

var kReName = '[A-Za-z0-9 \']+';
var kReAbilityCode = '[0-9A-Fa-f]{1,4}';

// Regexes to be filled out once we know the player's name.
var kReRdmWhiteManaProc = null;
var kReRdmBlackManaProc = null;
var kReRdmImpactProc = null;
var kReRdmWhiteManaProcEnd = null;
var kReRdmBlackManaProcEnd = null;
var kReRdmImpactProcEnd = null;
var kReRdmEndCombo = null;
var kReFoodBuff = null;

// Full skill names (regex ok) of abilities that break combos.
// TODO: it's sad to have to duplicate combo abilities here to catch out-of-order usage.
var kComboBreakers = Object.freeze([
  // rdm
  'Verstone',
  'Verfire',
  'Verareo',
  'Verthunder',
  'Verholy',
  'Verflare',
  'Jolt II',
  'Jolt',
  'Impact',
  'Scatter',
  'Vercure',
  'Verraise',
  '(Enchanted )?(Riposte|Zwerchhau|Redoublement|Moulinet)',
  // war
  'Tomahawk',
  'Overpower',
  'Skull Sunder',
  "Butcher's Block",
  'Maim',
  "Storm's Eye",
  "Storm's Path",
  // general (TODO: is this true?)
  'Limit Break',
]);

class ComboTracker {
  constructor(me, comboBreakers, callback) {
    this.me = me;
    this.comboTimer = null;
    this.kReEndCombo = new RegExp(':' + me + '( starts using |:' + kReAbilityCode + ':)(' + comboBreakers.join('|') + ')( |:)');
    this.comboNodes = {}; // { key => { re: string, next: [node keys], last: bool } }
    this.startList = [];
    this.callback = callback;
    this.current = null;
    this.considerNext = this.startList;
  }

  AddCombo(skillList) {
    // Due to this bug: https://github.com/ravahn/FFXIV_ACT_Plugin/issues/100
    // We can not look for log messages from FFXIV "You use X" here. Instead we
    // look for the actual ability usage provided by the XIV plugin.
    // Also, the networked parse info is given much quicker than the lines from the game.
    if (this.startList.indexOf(skillList[0]) == -1) {
      this.startList.push(skillList[0]);
    }
    for (var i = 0; i < skillList.length; ++i) {
      var node = this.comboNodes[skillList[i]];
      if (node == undefined) {
        node = {
          re: new RegExp(':' + this.me + ':' + kReAbilityCode + ':' + skillList[i] + ':'),
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

function setupComboTracker(me, callback) {
  var comboTracker = new ComboTracker(me, kComboBreakers, callback);
  comboTracker.AddCombo(['Enchanted Riposte', 'Enchanted Zwerchhau', 'Enchanted Redoublement', 'Verflare\Verholy']);
  comboTracker.AddCombo(['Heavy Swing', 'Skull Sunder', "Butcher's Block"]);
  comboTracker.AddCombo(['Heavy Swing', 'Maim', "Storm's Eye"]);
  comboTracker.AddCombo(['Heavy Swing', 'Maim', "Storm's Path"]);

  return comboTracker;
}

function setupRegexes(me) {
  kReRdmWhiteManaProc = new RegExp(':' + me + ' gains the effect of Verstone Ready from ' + me + ' for ([0-9.]+) Seconds\.');
  kReRdmWhiteManaProcEnd = new RegExp('(:' + me + ' loses the effect of Verstone Ready from ' + me + '.)|(:' + me + ':' + kReAbilityCode + ':Verstone:)')
  kReRdmBlackManaProc = new RegExp(':' + me + ' gains the effect of Verfire Ready from ' + me + ' for ([0-9.]+) Seconds\.');
  kReRdmBlackManaProcEnd = new RegExp('(:' + me + ' loses the effect of Verfire Ready from ' + me + '.)|(:' + me + ':' + kReAbilityCode + ':Verfire:)');
  kReRdmImpactProc = new RegExp(':' + me + ' gains the effect of Impactful from ' + me + ' for ([0-9.]+) Seconds\.');
  kReRdmImpactProcEnd = new RegExp('(:' + me + ' loses the effect of Impactful from ' + me + '.)|(:' + me + ':' + kReAbilityCode + ':Impact:)');
  kReFoodBuff = new RegExp(':' + me + ' gains the effect of Well Fed from ' + me + ' for ([0-9.]+) Seconds\.')
}

var kCasterJobs = ["RDM", "BLM", "WHM", "SCH", "SMN", "ACN", "AST", "CNJ", "THM"];
var kTankJobs = ["GLD", "PLD", "MRD", "WAR", "DRK"];
var kHealerJobs = ["CNJ", "WHM", "SCH", "AST"];
var kNonCombatJobs = ["CRP", "BSM", "ARM", "GSM", "LTW", "WVR", "ALC", "CUL", "MIN", "BTN", "FSH"];
var kMeleeWithMpJobs = ["BRD", "DRK"];

function isCasterJob(job) {
  return kCasterJobs.indexOf(job) >= 0;
}

function isTankJob(job) {
  return kTankJobs.indexOf(job) >= 0;
}

function isHealerJob(job) {
  return kHealerJobs.indexOf(job) >= 0;
}

function isCombatJob(job) {
  return kNonCombatJobs.indexOf(job) == -1;
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

function setupBuffTracker(me) {
  kBigBuffTracker = {
    potion: {
      regex: new RegExp(':' + me + ' gains the effect of Medicated from ' + me + ' for ([0-9.]+) Seconds\.'),
      durationPosition: 1,
      icon: kIconBuffPotion,
      borderColor: '#AA41B2',
      sortKey: 0,
    },
    embolden: {
      regex: new RegExp(':' + me + ' gains the effect of Embolden from (.*) for ([0-9.]+) Seconds\.'),
      durationPosition: 2,
      icon: kIconBuffEmbolden,
      borderColor: '#57FC4A',
      sortKey: 1,
    },
    litany: {
      regex: new RegExp(':' + kReName + ' gains the effect of Battle Litany from (.*) for ([0-9.]+) Seconds\.'),
      durationPosition: 1,
      icon: kIconBuffLitany,
      borderColor: '#099',
      sortKey: 2,
    },
    balance: {
      regex: new RegExp(':' + kReName + ' gains the effect of The Balance from (.*) for ([0-9.]+) Seconds\.'),
      durationPosition: 2,
      icon: kIconBuffBalance,
      borderColor: '#C5C943',
      sortKey: 3,
    },
    chain: {
      regex: new RegExp(':' + kReName + ':' + kReAbilityCode + ':Chain Strategem:'),
      durationSeconds: 15,
      icon: kIconBuffChainStrategem,
      borderColor: '#4674E5',
      sortKey: 5,
    },
    trick: {
      regex: new RegExp(':' + kReName + ':' + kReAbilityCode + ':Trick Attack:'),
      durationSeconds: 10,
      icon: kIconBuffTrickAttack,
      borderColor: '#FC4AE6',
      sortKey: 6,
      sound: '../../sounds/WeakAuras/RoaringLion.ogg',
      soundVolume: 1,
    },
    hyper: {
      regex: new RegExp(':' + kReName + ':' + kReAbilityCode + ':Hypercharge:'),
      durationSeconds: 20,
      icon: kIconBuffHypercharge,
      borderColor: '#099',
      sortKey: 7,
    },
    sight: {
      regex: new RegExp(':' + kReName + ':' + kReAbilityCode + ':Dragon Sight:'),
      durationSeconds: 20,
      icon: kIconBuffDragonSight,
      borderColor: '#FA8737',
      sortKey: 4,
      sound: '../../sounds/WeakAuras/RoaringLion.ogg',
      soundVolume: 1,
    },
  }
}

class Bars {
  constructor() {
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

    if (!isCombatJob(this.job)) {
      return;
    }
    
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
    else
      barsLayoutContainer.classList.add('noncombat');

    var opacityContainer = document.createElement("div");
    opacityContainer.id = "opacity-container";
    barsLayoutContainer.appendChild(opacityContainer);

    var pullCountdownContainer = document.createElement("div");
    pullCountdownContainer.id = 'pull-bar';
    barsLayoutContainer.appendChild(pullCountdownContainer);
    this.o.pullCountdown = document.createElement("timer-bar");
    pullCountdownContainer.appendChild(this.o.pullCountdown);

    this.o.pullCountdown.width = window.getComputedStyle(pullCountdownContainer).width;
    this.o.pullCountdown.height = window.getComputedStyle(pullCountdownContainer).height;
    this.o.pullCountdown.lefttext = "Pull";
    this.o.pullCountdown.righttext = "remain";
    this.o.pullCountdown.style = "empty";
    this.o.pullCountdown.hideafter = 0;
    this.o.pullCountdown.fg = "rgb(255, 120, 120)";

    this.o.rightBuffsContainer = document.createElement("div");
    this.o.rightBuffsContainer.id = 'right-side-icons';
    opacityContainer.appendChild(this.o.rightBuffsContainer);
    
    this.o.rightBuffsList = document.createElement('widget-list');
    this.o.rightBuffsContainer.appendChild(this.o.rightBuffsList);

    this.o.rightBuffsList.rowcolsize = 7;
    this.o.rightBuffsList.maxnumber = 7;
    this.o.rightBuffsList.toward = "right down";
    this.o.rightBuffsList.elementwidth = kOptions.kBigBuffIconWidth + 2;

    this.o.leftBuffsContainer = document.createElement("div");
    this.o.leftBuffsContainer.id = 'left-side-icons';
    opacityContainer.appendChild(this.o.leftBuffsContainer);

    this.o.leftBuffsList = document.createElement('widget-list');
    this.o.leftBuffsContainer.appendChild(this.o.leftBuffsList);

    this.o.leftBuffsList.rowcolsize = 7;
    this.o.leftBuffsList.maxnumber = 7;
    this.o.leftBuffsList.toward = "left down";
    this.o.leftBuffsList.elementwidth = kOptions.kBigBuffIconWidth + 2;

    // Holds health/mana/tp.
    var barsContainer = document.createElement('div');
    barsContainer.id = 'bars';
    opacityContainer.appendChild(barsContainer);

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

    if (this.job == "RDM") {
      var fontSize = 16;
      var innerTextY = 6;

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

      // XXX: barsContainer?
      opacityContainer.appendChild(this.o.rdmCombo1);
      opacityContainer.appendChild(this.o.rdmCombo2);
      opacityContainer.appendChild(this.o.rdmCombo3);

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

      if (kOptions.kShowRdmProcs) {
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

        opacityContainer.appendChild(procsContainer);
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
      var fontSize = 16;
      var fontWidth = fontSize * 1.8;

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
    }
  }

  MakeAuraTimerIcon(name, seconds, iconWidth, iconHeight, barHeight, textHeight, borderSize, borderColor, barColor, auraIcon) {
    var div = document.createElement("div");

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
      text.style.top = iconHeight + barHeight;
      text.style.fontFamily = "arial";
      text.style.fontWeight = "bold";
      text.style.color = "white";
      text.style.textShadow = "-1px 0 3px black, 0 1px 3px black, 1px 0 3px black, 0 -1px 3px black";
      text.style.paddingBottom = textHeight / 4;

      text.innerText = name;
      div.appendChild(text);
    }

    icon.bordercolor = borderColor;
    bar.fg = barColor;
    icon.icon = auraIcon;
    icon.duration = seconds;
    bar.duration = seconds;

    return div;
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

  OnRedMageProcBlack(seconds) {
    if (this.o.rdmProcBlack != null)
      this.o.rdmProcBlack.duration = Math.max(0, seconds - kOptions.kRdmCastTime);
  }

  OnRedMageProcWhite(seconds) {
    if (this.o.rdmProcWhite != null)
      this.o.rdmProcWhite.duration = Math.max(0, seconds - kOptions.kRdmCastTime);
  }

  OnRedMageProcImpact(seconds) {
    if (this.o.rdmProcImpact != null)
      this.o.rdmProcImpact.duration = Math.max(0, seconds - kOptions.kRdmCastTime);
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
        // Storm's eye applies after a small animation delay.
        // 0.5s appears to lineup the countdown roughly with the in game buff.
        this.o.eyeBox.duration = 0;
        this.o.eyeBox.duration = 30.5;
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
      // have time to do a Storm's Eye".
      var oldThreshold = this.o.eyeBox.threshold;
      var newThreshold = (minSkillsUntilEye + 3) * kOptions.kWarGcd;

      // Because thresholds are nonmonotonic (when finishing a combo)
      // be careful about setting them in ways that are visually poor.
      if (this.o.eyeBox.value >= newThreshold) {
        // Haven't past the current threshold, so small.
        this.o.eyeBox.threshold = newThreshold;
      } else if (this.o.eyeBox.value >= oldThreshold) {
        // Past the current one, but not the last one, so this is
        // the first real threshold crossed.
        this.o.eyeBox.threshold = newThreshold;
      } else {
        // Past both the current one and the old one, so preserve
        // the old one to avoid wiggling the denominator.
        this.o.eyeBox.threshold = oldThreshold;
      }
    }
  }

  UpdateHealth() {
    if (!this.o.healthBar) return;
    this.o.healthBar.value = this.hp;
    this.o.healthBar.maxvalue = this.maxHP;
    
    if (this.maxHP > 0 && (this.hp / this.maxHP) < kOptions.kLowHealthThresholdPercent)
      this.o.healthBar.fg = computeBackgroundColorFrom(this.o.healthBar, 'hp-color.low');
    else if (this.maxHP > 0 && (this.hp / this.maxHP) < kOptions.kMidHealthThresholdPercent)
      this.o.healthBar.fg = computeBackgroundColorFrom(this.o.healthBar, 'hp-color.mid');
    else
      this.o.healthBar.fg = computeBackgroundColorFrom(this.o.healthBar, 'hp-color');
  }

  UpdateMana() {
    if (!this.o.manaBar) return;
    this.o.manaBar.value = this.mp;
    this.o.manaBar.maxvalue = this.maxMP;

    var far = -1;
    if (this.job == "RDM")
      far = kOptions.kFarThresholdOffence;
    else if (this.job == "BLM")
      far = kOptions.kFarThresholdOffence;

    if (far >= 0 && this.distance > far)
      this.o.manaBar.fg = computeBackgroundColorFrom(this.o.manaBar, 'mp-color.far');
    else
      this.o.manaBar.fg = computeBackgroundColorFrom(this.o.manaBar, 'mp-color')
  }

  UpdateTP() {
    if (!this.o.tpBar) return;

    if (this.tp <= kOptions.kTPInvigorateThreshold)
      this.o.tpBar.fg = computeBackgroundColorFrom(this.o.tpBar, 'tp-color.low');
    else
      this.o.tpBar.fg = computeBackgroundColorFrom(this.o.tpBar, 'tp-color');

    this.o.tpBar.value = this.tp;
    this.o.tpBar.maxvalue = this.maxTP;
  }
  
  UpdateFoodBuff() {
    // Non-combat jobs don't set up the left buffs list.
    if (!this.init || !this.o.leftBuffsList)
      return;

    var CanShowWellFedWarning = function() {
      if (this.inCombat)
        return false;
      if (this.level < kOptions.kMaxLevel)
        return true;
      return this.zone.search(kReFoodBuff) >= 0;
    }
    
    // Returns the number of ms until it should be shown. If <= 0, show it.
    var TimeToShowWellFedWarning = function() {
      var now_ms = Date.now();
      var show_at_ms = this.foodBuffExpiresTimeMs - (kOptions.kHideWellFedAboveSeconds * 1000);
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
      var outer = document.createElement('div');
      outer.style.border = '1px solid black';
      outer.style.width = kOptions.kBigBuffIconWidth - kOptions.kBigBuffBorderSize * 2;
      outer.style.height = kOptions.kBigBuffIconHeight - kOptions.kBigBuffBorderSize * 2;
      outer.style.backgroundColor = 'yellow';
      var inner = document.createElement('div');
      outer.appendChild(inner);
      inner.style.borderWidth = kOptions.kBigBuffBorderSize;
      inner.style.left = kOptions.kBigBuffBorderSize;
      inner.style.top = kOptions.kBigBuffBorderSize;
      inner.style.position = 'relative';
      inner.style.borderStyle = 'solid';
      inner.style.borderColor = '#000';
      inner.style.width = kOptions.kBigBuffIconWidth - kOptions.kBigBuffBorderSize * 6;
      inner.style.height = kOptions.kBigBuffIconHeight - kOptions.kBigBuffBorderSize * 6;
      inner.style.backgroundImage = 'url(data:image/jpeg;base64,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)';
      inner.style.backgroundColor = '#888';
      inner.style.backgroundRepeat = 'no-repeat';
      inner.style.backgroundSize = Math.max(kOptions.kBigBuffIconWidth, kOptions.kBigBuffIconHeight) - kOptions.kBigBuffBorderSize * 2 + 'px';
      inner.style.backgroundPosition = 'center';
      this.o.leftBuffsList.addElement('foodbuff', outer, -1);
    }
    
  }

  OnInCombatChanged(e) {
    this.inCombat = e.detail.inCombat;
    if (this.inCombat)
      this.SetPullCountdown(0);

    var opacityContainer = document.getElementById("opacity-container");
    if (opacityContainer != null) {
      if (this.inCombat || !kOptions.kLowerOpacityOutOfCombat)
        opacityContainer.style.opacity = 1.0;
      else
        opacityContainer.style.opacity = 0.5;
    }

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
        var audio = new Audio('../../sounds/PowerAuras/sonar.ogg');
        audio.volume = 0.3;
        audio.play();
      }
    }
  }

  OnBigBuff(name, seconds, settings) {
    var aura = this.MakeAuraTimerIcon(
        name, seconds,
        kOptions.kBigBuffIconWidth, kOptions.kBigBuffIconHeight,
        kOptions.kBigBuffBarHeight, kOptions.kBigBuffTextHeight,
        kOptions.kBigBuffBorderSize,
        settings.borderColor, settings.borderColor,
        settings.icon);
    this.o.rightBuffsList.addElement(name, aura, settings.sortKey);
    var that = this;
    window.clearTimeout(settings.timeout);
    settings.timeout = window.setTimeout(function() {
      that.o.rightBuffsList.removeElement(name);
    }, seconds * 1000);
    if ('sound' in settings) {
      var audio = new Audio(settings.sound);
      if ('soundVolume' in settings)
        audio.volume = settings.soundVolume;
      audio.play();
    }
  }
  
  OnPlayerChanged(e) {
    if (!this.init) {
      this.me = e.detail.name;
      setupRegexes(this.me);
      setupBuffTracker(this.me);
      this.combo = setupComboTracker(this.me, this.OnComboChange.bind(this));
      this.init = true;
    }

    var update_job = false;
    var update_hp = false;
    var update_mp = false;
    var update_tp = false;
    var update_level = false;
    if (e.detail.job != this.job) {
      this.job = e.detail.job;
      this.combo.AbortCombo();  // Combos are job specific.
      update_job = update_hp = update_mp = update_tp = true;
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
    if (update_job) {
      this.UpdateJob();
      // When reloading, we don't hear about combat state if out
      // of combat. So use this to set things up.
      this.OnInCombatChanged({ detail: false });
    }
    if (update_hp)
      this.UpdateHealth();
    if (update_mp)
      this.UpdateMana();
    if (update_tp)
      this.UpdateTP();
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
      
      var r = log.match(/:Battle commencing in ([0-9]+) seconds!/);
      if (r != null) {
        var seconds = parseInt(r[1]);
        this.SetPullCountdown(seconds);
        continue;
      }
      if (log.search(/Countdown canceled by /) >= 0) {
        this.SetPullCountdown(0);
        continue;
      }

      for (var name in kBigBuffTracker) {
        var settings = kBigBuffTracker[name];
        var r = log.match(settings.regex);
        if (r != null) {
          var seconds = 0;
          if ('durationSeconds' in settings) {
            seconds = settings.durationSeconds;
          } else {
            console.assert('durationPosition' in settings, "Either durationSeconds or durationPosition must be present for " + name);
            seconds = r[settings.durationPosition];
          }
          this.OnBigBuff(name, seconds, settings);
        }
      }

      if (this.combo.ParseLog(log))
        continue;

      if (this.job == "RDM") {
        var r = log.match(kReRdmBlackManaProc);
        if (r != null) {
          var seconds = parseFloat(r[1]);
          this.OnRedMageProcBlack(seconds);
          continue;
        }
        r = log.match(kReRdmWhiteManaProc);
        if (r != null) {
          var seconds = parseFloat(r[1]);
          this.OnRedMageProcWhite(seconds);
          continue;
        }
        r = log.match(kReRdmImpactProc);
        if (r != null) {
          var seconds = parseFloat(r[1]);
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

      // For learning boss ability codes.
      //if (log.search(/Exdeath (starts using Unknown_|readies |begins casting )/) >= 0)
      //  console.log(log);

      if (log.search(/:test:jobs:/) >= 0)
        this.Test();
    }
  }

  Test() {
    var logs = [];
    logs.push(':' + this.me + ' gains the effect of Medicated from ' + this.me + ' for 30 Seconds\.');
    logs.push(':' + this.me + ' gains the effect of Embolden from  for 20 Seconds\.');
    logs.push(':' + this.me + ' gains the effect of Battle Litany from  for 25 Seconds\.');
    logs.push(':' + this.me + ' gains the effect of The Balance from  for 12 Seconds\.');
    logs.push(':' + this.me + ':00:Dragon Sight:');
    logs.push(':' + this.me + ':00:Chain Strategem:');
    logs.push(':' + this.me + ':00:Trick Attack:');
    logs.push(':' + this.me + ':00:Hypercharge:');
    var e = { detail: { logs: logs } };
    this.OnLogEvent(e);
  }
}

var g_bars = new Bars();

document.addEventListener("onPlayerChangedEvent", function (e) {
  g_bars.OnPlayerChanged(e);
});
document.addEventListener("onTargetChangedEvent", function (e) {
  g_bars.OnTargetChanged(e);
});
document.addEventListener("onInCombatChangedEvent", function (e) {
  g_bars.OnInCombatChanged(e);
});
document.addEventListener("onZoneChangedEvent", function (e) {
  g_bars.OnZoneChanged(e);
});
document.addEventListener("onLogEvent", function (e) {
  g_bars.OnLogEvent(e);
});
