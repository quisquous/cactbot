"use strict";

// Options.
var kLowerOpacityOutOfCombat = true;
var kHideWellFedAboveSeconds = 15 * 60;  // N mins warning.
var kWellFedZoneRegex = /^(Unknown Zone \([0-9A-Fa-f]+\)|Deltascape.*Savage.*)$/;
var kShowRdmProcs = true;

// Constants.
var kMaxLevel = 70;  // Update this when new expansion happens.
var kFarThresholdOffence = 24;  // The distance that offensive spells such as VerAreo, etc are castable.
var kRdmCastTime = 1.94 + 0.5;  // Jolt cast time + 0.5 for my reaction time. Show procs ending this amount early so as to not waste GCDs on no-longer-useful procs.

// Layout.
var kHealthBarPosX = 100;
var kHealthBarPosY = 20;
var kManaBarPosX = kHealthBarPosX;
var kManaBarMarginY = 1;
var kHealthBarSizeW = 202;  // 2px per percent + 1px border on each side.
var kHealthBarSizeH = 7;  // Rogue energy was 12.
var kTankHealthBarSizeH = 18;
var kManaBarSizeH = 7;
var kPullTimerPosX = kHealthBarPosX;
var kPullTimerPosY = kHealthBarPosY - 20;
var kPullCounterBarSizeH = 18;
var kBigBuffIconWidth = 44;
var kBigBuffIconHeight = 32;
var kBigBuffBarHeight = 5;
var kBigBuffTextHeight = 12;
var kBigBuffBorderSize = 1;
// RDM layout.
var kRedMageManaBarPosX = kHealthBarPosX;
var kRedMageManaBarPosY = kHealthBarPosY + 17;// + 228;
var kRedMageManaBarSizeH = 8;  // Rogue energy was 12.
var kRedMageProcsPosX = kHealthBarPosX;
var kRedMageProcsPosY = kHealthBarPosY + 146;

// Colours.
var kHealthColor = "rgb(59, 133, 4)";
var kManaColor = "rgb(188, 55, 147)"; //"rgb(57, 120, 167)";
var kTPColor = "rgb(180, 180, 0)";
var kBackgroundColor = "rgb(30, 30, 30)";
var kLowManaColor = "rgb(218, 69, 177)";
var kFarManaColor = "rgb(215, 120, 0)";
var kLowHealthThresholdPercent = 0.2;
var kLowHealthColor = "rgb(190, 43, 30)";
var kMidHealthThresholdPercent = 0.8;
var kMidHealthColor = "rgb(127, 185, 29)";
var kLowBeastColor = "rgb(255, 235, 153)";
var kMidBeastColor = "rgb(255, 153, 0)";
var kFullBeastColor = "rgb(230, 20, 20)";
// RDM colours.
var kWhiteManaBarColor = "rgb(220, 220, 240)";
var kWhiteManaBarDimColor = "rgb(90, 90, 100)";
var kBlackManaBarColor = "rgb(47, 176, 208)";
var kImpactProcColor = "rgb(242, 114, 147)";
var kBlackManaBarDimColor = "rgb(13, 76, 80)";
var kWhiteBlackIndicator40 = "rgba(0, 0, 0, 0.7)";
var kWhiteBlackIndicator80 = "rgba(0, 0, 0, 0.7)";
var kWhiteBlackIndicator = "rgba(100, 100, 100, 0.7)";

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
var kNonCombatJobs = ["CRP", "BSM", "ARM", "GSM", "LTW", "WVR", "ALC", "CUL", "MIN", "BTN", "FSH"];

function isCasterJob(job) {
  return kCasterJobs.indexOf(job) >= 0;
}

function isTankJob(job) {
  return kTankJobs.indexOf(job) >= 0;
}

function isCombatJob(job) {
  return kNonCombatJobs.indexOf(job) == -1;
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
    var container = document.getElementById("bars-container");
    if (container == null) {
      var root = document.getElementById("container");
      container = document.createElement("div");
      container.id = "bars-container";
      root.appendChild(container);
    }
    while (container.childNodes.length)
      container.removeChild(container.childNodes[0]);

    this.o = {};

    if (!isCombatJob(this.job)) {
      return;
    }

    var opacityContainer = document.createElement("div");
    opacityContainer.id = "opacity-container";
    container.appendChild(opacityContainer);

    var pullCountdownContainer = document.createElement("div");
    container.appendChild(pullCountdownContainer);
    this.o.pullCountdown = document.createElement("timer-bar");
    pullCountdownContainer.appendChild(this.o.pullCountdown);

    pullCountdownContainer.style.position = "absolute";
    pullCountdownContainer.style.top = kPullTimerPosY;
    pullCountdownContainer.style.left = kPullTimerPosX;
    pullCountdownContainer.style.width = kHealthBarSizeW;
    pullCountdownContainer.style.height = kPullCounterBarSizeH;
    pullCountdownContainer.style.fontSize = kPullCounterBarSizeH - 4;
    this.o.pullCountdown.width = kHealthBarSizeW;
    this.o.pullCountdown.height = kPullCounterBarSizeH;
    this.o.pullCountdown.lefttext = "Pull";
    this.o.pullCountdown.righttext = "remain";
    this.o.pullCountdown.style = "empty";
    this.o.pullCountdown.hideafter = 0;
    this.o.pullCountdown.fg = "rgb(255, 120, 120)";

    this.o.rightBuffsContainer = document.createElement("div");
    this.o.rightBuffsList = document.createElement('widget-list');
    this.o.rightBuffsContainer.appendChild(this.o.rightBuffsList);
    opacityContainer.appendChild(this.o.rightBuffsContainer);

    this.o.rightBuffsContainer.style.position = "absolute";
    this.o.rightBuffsContainer.style.top = kHealthBarPosY;
    this.o.rightBuffsContainer.style.left = kHealthBarPosX + kHealthBarSizeW + 3;
    this.o.rightBuffsList.rowcolsize = 7;
    this.o.rightBuffsList.maxnumber = 7;
    this.o.rightBuffsList.toward = "right down";
    this.o.rightBuffsList.elementwidth = kBigBuffIconWidth + 2;

    this.o.leftBuffsContainer = document.createElement("div");
    this.o.leftBuffsList = document.createElement('widget-list');
    this.o.leftBuffsContainer.appendChild(this.o.leftBuffsList);
    opacityContainer.appendChild(this.o.leftBuffsContainer);

    this.o.leftBuffsContainer.style.position = "absolute";
    this.o.leftBuffsContainer.style.top = kHealthBarPosY;
    this.o.leftBuffsContainer.style.left = kHealthBarPosX - 3;
    this.o.leftBuffsList.rowcolsize = 7;
    this.o.leftBuffsList.maxnumber = 7;
    this.o.leftBuffsList.toward = "left down";
    this.o.leftBuffsList.elementwidth = kBigBuffIconWidth + 2;

    this.o.healthContainer = document.createElement("div");
    this.o.healthBar = document.createElement("resource-bar");
    this.o.healthContainer.appendChild(this.o.healthBar);
    opacityContainer.appendChild(this.o.healthContainer);

    this.o.healthContainer.style.position = "absolute";
    this.o.healthContainer.style.top = kHealthBarPosY;
    this.o.healthContainer.style.left = kHealthBarPosX;
    this.o.healthBar.width = kHealthBarSizeW;
    this.o.healthBar.height = kHealthBarSizeH;

    if (isTankJob(this.job)) {
      this.o.healthBar.height = kTankHealthBarSizeH;
      this.o.healthBar.lefttext = "value";
    }

    var secondBarTop = kHealthBarPosY + parseInt(this.o.healthBar.height) + kManaBarMarginY;
    if (isCasterJob(this.job)) {
      this.o.manaContainer = document.createElement("div");
      this.o.manaBar = document.createElement("resource-bar");
      this.o.manaContainer.appendChild(this.o.manaBar);
      opacityContainer.appendChild(this.o.manaContainer);

      this.o.manaContainer.style.position = "absolute";
      this.o.manaContainer.style.top = secondBarTop;
      this.o.manaContainer.style.left = kManaBarPosX;
      this.o.manaBar.width = kHealthBarSizeW;
      this.o.manaBar.height = kManaBarSizeH;
    } else {
      this.o.tpContainer = document.createElement("div");
      this.o.tpBar = document.createElement("resource-bar");
      this.o.tpContainer.appendChild(this.o.tpBar);
      opacityContainer.appendChild(this.o.tpContainer);

      this.o.tpContainer.style.position = "absolute";
      this.o.tpContainer.style.top = secondBarTop;
      this.o.tpContainer.style.left = kManaBarPosX;
      this.o.tpBar.width = kHealthBarSizeW;
      this.o.tpBar.height = kHealthBarSizeH;
    }

    if (this.job == "RDM") {
      var fontSize = 16;
      var fontWidth = fontSize * 1.8;
      var whiteX = kHealthBarSizeW + 3;
      var whiteY = -17;
      var blackX = kHealthBarSizeW + 3 + fontWidth + 5;
      var blackY = -17;
      var innerTextY = 6;

      // Move over the right buffs.
      this.o.rightBuffsContainer.style.left = kRedMageManaBarPosX + blackX + fontWidth + 5;

      var rdmContainer = document.createElement("div");
      opacityContainer.appendChild(rdmContainer);
      rdmContainer.style.position = "absolute";
      rdmContainer.style.top = kRedMageManaBarPosY;
      rdmContainer.style.left = kRedMageManaBarPosX;

      this.o.whiteManaBarContainer = document.createElement("div");
      this.o.whiteManaBar = document.createElement("resource-bar");
      rdmContainer.appendChild(this.o.whiteManaBarContainer);
      this.o.whiteManaBarContainer.appendChild(this.o.whiteManaBar);

      this.o.whiteManaBarContainer.style.position = "absolute";
      this.o.whiteManaBarContainer.style.top = 0;
      this.o.whiteManaBarContainer.style.left = 0;

      this.o.whiteManaBar.bg = "rgba(0, 0, 0, 0)";
      this.o.whiteManaBar.fg = kWhiteManaBarColor;
      this.o.whiteManaBar.width = kHealthBarSizeW;
      this.o.whiteManaBar.height = kRedMageManaBarSizeH;
      this.o.whiteManaBar.maxvalue = 100;

      this.o.blackManaBarContainer = document.createElement("div");
      this.o.blackManaBar = document.createElement("resource-bar");
      rdmContainer.appendChild(this.o.blackManaBarContainer);
      this.o.blackManaBarContainer.appendChild(this.o.blackManaBar);

      this.o.blackManaBarContainer.style.position = "absolute";
      this.o.blackManaBarContainer.style.top = kRedMageManaBarSizeH - 2;
      this.o.blackManaBarContainer.style.left = 0;
      this.o.blackManaBar.bg = "rgba(0, 0, 0, 0)";
      this.o.blackManaBar.fg = kBlackManaBarColor;
      this.o.blackManaBar.width = kHealthBarSizeW;
      this.o.blackManaBar.height = kRedMageManaBarSizeH;
      this.o.blackManaBar.maxvalue = 100;

      this.o.rdmBackground = document.createElement("div");
      rdmContainer.appendChild(this.o.rdmBackground);
      this.o.rdmBackground.style.zIndex = -1;
      this.o.rdmBackground.style.position = "absolute";
      this.o.rdmBackground.style.left = 0;
      this.o.rdmBackground.style.top = 0;
      this.o.rdmBackground.style.width = kHealthBarSizeW - 2;
      this.o.rdmBackground.style.height = kRedMageManaBarSizeH * 2 - 4;
      this.o.rdmBackground.style.border = "1px solid black";
      this.o.rdmBackground.style.backgroundColor = "rgba(0, 0, 0, 0.7)";

      this.o.rdmCombo1 = document.createElement("div");
      this.o.rdmCombo2 = document.createElement("div");
      this.o.rdmCombo3 = document.createElement("div");

      this.o.rdmCombo1.style.position = "absolute";
      this.o.rdmCombo1.style.left = kHealthBarPosX;
      this.o.rdmCombo1.style.top = kHealthBarPosY - 9;
      this.o.rdmCombo1.style.width = 50;
      this.o.rdmCombo1.style.height = 6;
      this.o.rdmCombo1.style.backgroundColor = "#990";
      this.o.rdmCombo1.style.border = "1px solid black";
      this.o.rdmCombo1.style.display = "none";

      this.o.rdmCombo2.style.position = "absolute";
      this.o.rdmCombo2.style.left = kHealthBarPosX + kHealthBarSizeW / 2 - 52 / 2;
      this.o.rdmCombo2.style.top = kHealthBarPosY - 9;
      this.o.rdmCombo2.style.width = 50;
      this.o.rdmCombo2.style.height = 6;
      this.o.rdmCombo2.style.backgroundColor = "#990";
      this.o.rdmCombo2.style.border = "1px solid black";
      this.o.rdmCombo2.style.display = "none";

      this.o.rdmCombo3.style.position = "absolute";
      this.o.rdmCombo3.style.left = kHealthBarPosX + kHealthBarSizeW - 52;
      this.o.rdmCombo3.style.top = kHealthBarPosY - 9;
      this.o.rdmCombo3.style.width = 50;
      this.o.rdmCombo3.style.height = 6;
      this.o.rdmCombo3.style.backgroundColor = "#A00";
      this.o.rdmCombo3.style.border = "1px solid black";
      this.o.rdmCombo3.style.display = "none";

      opacityContainer.appendChild(this.o.rdmCombo1);
      opacityContainer.appendChild(this.o.rdmCombo2);
      opacityContainer.appendChild(this.o.rdmCombo3);

      var incs = 20;
      for (var i = 2 * incs; i <= 100; i = i + 2 * incs) {
        var marker = document.createElement("div");
        rdmContainer.appendChild(marker);
        marker.style.zIndex = -1;
        marker.style.position = "absolute";
        marker.style.left = 1 + 2 * (i - incs);
        marker.style.top = 1;
        marker.style.width = 2 * incs;
        marker.style.height = kRedMageManaBarSizeH * 2 - 4;
        if (i == 40)
          marker.style.backgroundColor = kWhiteBlackIndicator40;
        else if (i == 80)
          marker.style.backgroundColor = kWhiteBlackIndicator80;
        else
          marker.style.backgroundColor = kWhiteBlackIndicator;
      }

      this.o.whiteManaTextBox = document.createElement("div");
      rdmContainer.appendChild(this.o.whiteManaTextBox);
      this.o.whiteManaTextBox.classList.add("text");
      this.o.whiteManaTextBox.style.position = "absolute";
      this.o.whiteManaTextBox.style.left = whiteX;
      this.o.whiteManaTextBox.style.top = whiteY;
      this.o.whiteManaTextBox.style.fontSize = fontSize;
      this.o.whiteManaTextBox.style.textAlign = "center";
      this.o.whiteManaTextBox.style.width = fontWidth;
      this.o.whiteManaTextBox.style.height = fontWidth;
      this.o.whiteManaTextBox.style.border = "1px solid rgba(0,0,0,0.7)";

      this.o.blackManaTextBox = document.createElement("div");
      rdmContainer.appendChild(this.o.blackManaTextBox);
      this.o.blackManaTextBox.classList.add("text");
      this.o.blackManaTextBox.style.position = "absolute";
      this.o.blackManaTextBox.style.left = blackX;
      this.o.blackManaTextBox.style.top = blackY;
      this.o.blackManaTextBox.style.fontSize = fontSize;
      this.o.blackManaTextBox.style.textAlign = "center";
      this.o.blackManaTextBox.style.width = fontWidth;
      this.o.blackManaTextBox.style.height = fontWidth;
      this.o.blackManaTextBox.style.border = "1px solid rgba(0,0,0,0.7)";

      this.o.whiteManaText = document.createElement("div");
      this.o.whiteManaTextBox.appendChild(this.o.whiteManaText);
      this.o.whiteManaText.style.position = "relative";
      this.o.whiteManaText.style.top = innerTextY;

      this.o.blackManaText = document.createElement("div");
      this.o.blackManaTextBox.appendChild(this.o.blackManaText);
      this.o.blackManaText.style.position = "relative";
      this.o.blackManaText.style.top = innerTextY;

      if (kShowRdmProcs) {
        /*
        var procMargin = (kHealthBarSizeW - (procW * 3)) / 2;
        var procW = 64;
        var procH = 64;
        */

        var procsContainer = document.createElement("div");
        var whiteProcContainer = document.createElement("div");
        var blackProcContainer = document.createElement("div");
        var impactProcContainer = document.createElement("div");
        var rdmNoProcWhite = document.createElement("div");
        var rdmNoProcBlack = document.createElement("div");
        var rdmNoProcImpact = document.createElement("div");
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

        procsContainer.style.position = "absolute";
        procsContainer.style.top = kRedMageProcsPosY;
        procsContainer.style.left = kRedMageProcsPosX;

        whiteProcContainer.style.position = "absolute";
        blackProcContainer.style.position = "absolute";
        impactProcContainer.style.position = "absolute";

        whiteProcContainer.style.left = 10;
        blackProcContainer.style.left = 152 / 2;
        impactProcContainer.style.left = 142;

        rdmNoProcWhite.style.backgroundColor = kWhiteManaBarColor;
        rdmNoProcWhite.style.opacity = 0.6;
        rdmNoProcWhite.style.border = "1px solid black";
        rdmNoProcWhite.style.width = 20;
        rdmNoProcWhite.style.height = 20;
        rdmNoProcWhite.style.position = "absolute";
        rdmNoProcWhite.style.left = 14;
        rdmNoProcWhite.style.top = 14;

        rdmNoProcBlack.style.backgroundColor = kBlackManaBarColor;
        rdmNoProcBlack.style.opacity = 0.6;
        rdmNoProcBlack.style.border = "1px solid black";
        rdmNoProcBlack.style.width = 20;
        rdmNoProcBlack.style.height = 20;
        rdmNoProcBlack.style.position = "absolute";
        rdmNoProcBlack.style.left = 14;
        rdmNoProcBlack.style.top = 14;

        rdmNoProcImpact.style.backgroundColor = kImpactProcColor;
        rdmNoProcImpact.style.opacity = 0.6;
        rdmNoProcImpact.style.border = "1px solid black";
        rdmNoProcImpact.style.width = 20;
        rdmNoProcImpact.style.height = 20;
        rdmNoProcImpact.style.position = "absolute";
        rdmNoProcImpact.style.left = 14;
        rdmNoProcImpact.style.top = 14;

        this.o.rdmProcWhite.style = "empty";
        this.o.rdmProcWhite.toward = "bottom";
        this.o.rdmProcWhite.threshold = 1000;
        this.o.rdmProcWhite.hideafter = 0;
        this.o.rdmProcWhite.fg = kWhiteManaBarColor;
        this.o.rdmProcWhite.bg = 'black';
        this.o.rdmProcBlack.style = "empty";
        this.o.rdmProcBlack.toward = "bottom";
        this.o.rdmProcBlack.threshold = 1000;
        this.o.rdmProcBlack.hideafter = 0;
        this.o.rdmProcBlack.fg = kBlackManaBarColor;
        this.o.rdmProcBlack.bg = 'black';
        this.o.rdmProcImpact.style = "empty";
        this.o.rdmProcImpact.toward = "bottom";
        this.o.rdmProcImpact.threshold = 1000;
        this.o.rdmProcImpact.hideafter = 0;
        this.o.rdmProcImpact.fg = kImpactProcColor;
        this.o.rdmProcImpact.bg = 'black';
      }
    } else if (this.job == "WAR") {
      var fontSize = 16;
      var fontWidth = fontSize * 1.8;
      var beastX = kHealthBarPosX + kHealthBarSizeW + 3;
      var beastY = kHealthBarPosY;

      // Move over the right buffs.
      // TODO: these should probably just float?
      this.o.rightBuffsContainer.style.left = beastX + fontWidth + 7;

      this.o.beastTextBox = document.createElement("div");
      opacityContainer.appendChild(this.o.beastTextBox);
      this.o.beastTextBox.classList.add("text");
      this.o.beastTextBox.style.position = "absolute";
      this.o.beastTextBox.style.left = beastX;
      this.o.beastTextBox.style.top = beastY;
      this.o.beastTextBox.style.fontSize = fontSize;
      this.o.beastTextBox.style.textAlign = "center";
      this.o.beastTextBox.style.width = fontWidth;
      this.o.beastTextBox.style.height = fontWidth;
      this.o.beastTextBox.style.border = "1px solid rgba(0,0,0,0.7)";

      this.o.beastText = document.createElement("div");
      this.o.beastTextBox.appendChild(this.o.beastText);
      this.o.beastText.style.position = "relative";
      this.o.beastText.style.top = "6";
    }

    if (this.o.healthBar) {
      this.o.healthBar.fg = kHealthColor;
      this.o.healthBar.bg = kBackgroundColor;
    }
    if (this.o.manaBar) {
      this.o.manaBar.fg = kManaColor;
      this.o.manaBar.bg = kBackgroundColor;
    }
    if (this.o.tpBar) {
      this.o.tpBar.fg = kTPColor;
      this.o.tpBar.bg = kBackgroundColor;
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
      this.o.whiteManaTextBox.style.backgroundColor = "rgba(100,100,100,0.7)";
    else
      this.o.whiteManaTextBox.style.backgroundColor = kWhiteManaBarColor; //"rgba(200,200,200,0.7)";
    if (black < 80)
      this.o.blackManaTextBox.style.backgroundColor = kBlackManaBarDimColor; //"rgba(0,0,0,0.7)";
    else
      this.o.blackManaTextBox.style.backgroundColor = kBlackManaBarColor; //"rgba(50,50,50,0.7)";
  }

  OnWarUpdate(beast) {
    if (this.o.beastTextBox == null) {
        return;
    }
    this.o.beastText.innerText = beast;

    if (beast < 50) {
        this.o.beastTextBox.style.backgroundColor = kLowBeastColor;
    } else if (beast < 100) {
        this.o.beastTextBox.style.backgroundColor = kMidBeastColor;
    } else {
        this.o.beastTextBox.style.backgroundColor = kFullBeastColor;
    }
  }

  OnRedMageProcBlack(seconds) {
    if (this.o.rdmProcBlack != null)
      this.o.rdmProcBlack.duration = Math.max(0, seconds - kRdmCastTime);
  }

  OnRedMageProcWhite(seconds) {
    if (this.o.rdmProcWhite != null)
      this.o.rdmProcWhite.duration = Math.max(0, seconds - kRdmCastTime);
  }

  OnRedMageProcImpact(seconds) {
    if (this.o.rdmProcImpact != null)
      this.o.rdmProcImpact.duration = Math.max(0, seconds - kRdmCastTime);
  }

  OnComboChange(skill) {
    if (this.job == "RDM") {
      if (this.o.rdmCombo1 == null || this.o.rdmCombo2 == null || this.o.rdmCombo3 == null)
        return;

      if (!skill)
        skill = "";
      this.o.rdmCombo1.style.display = skill.indexOf('Riposte') >= 0 ? "block" : "none";
      this.o.rdmCombo2.style.display = skill.indexOf('Zwerchhau') >= 0 ? "block" : "none";
      this.o.rdmCombo3.style.display = skill.indexOf('Redoublement') >= 0 ? "block" : "none";
    }
  }

  UpdateHealth() {
    if (!this.o.healthBar) return;
    this.o.healthBar.value = this.hp;
    this.o.healthBar.maxvalue = this.maxHP;
    if (this.maxHP > 0 && (this.hp / this.maxHP) < kLowHealthThresholdPercent)
      this.o.healthBar.fg = kLowHealthColor;
    else if (this.maxHP > 0 && (this.hp / this.maxHP) < kMidHealthThresholdPercent)
      this.o.healthBar.fg = kMidHealthColor;
    else
      this.o.healthBar.fg = kHealthColor;
  }

  UpdateMana() {
    if (!this.o.manaBar) return;
    this.o.manaBar.value = this.mp;
    this.o.manaBar.maxvalue = this.maxMP;

    var far = -1;
    if (this.job == "RDM")
      far = kFarThresholdOffence;
    else if (this.job == "BLM")
      far = kFarThresholdOffence;

    if (far >= 0 && this.distance > far)
      this.o.manaBar.fg = kFarManaColor;
    else
      this.o.manaBar.fg = kManaColor;
  }

  UpdateTP() {
    if (!this.o.tpBar) return;
    this.o.tpBar.value = this.tp;
    this.o.tpBar.maxvalue = this.maxTP;
  }
  
  UpdateFoodBuff() {
    if (!this.init)
      return;

    var CanShowWellFedWarning = function() {
      if (this.inCombat)
        return false;
      if (this.level < kMaxLevel)
        return true;
      return this.zone.search(kReFoodBuff) >= 0;
    }
    
    // Returns the number of ms until it should be shown. If <= 0, show it.
    var TimeToShowWellFedWarning = function() {
      var now_ms = Date.now();
      var show_at_ms = this.foodBuffExpiresTimeMs - (kHideWellFedAboveSeconds * 1000);
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
      outer.style.borderStyle = 'solid';
      outer.style.borderColor = '#000';
      outer.style.borderWidth = kBigBuffBorderSize;
      outer.style.width = kBigBuffIconWidth - kBigBuffBorderSize * 2;
      outer.style.height = kBigBuffIconHeight - kBigBuffBorderSize * 2;
      outer.style.backgroundColor = 'yellow';
      var inner = document.createElement('div');
      outer.appendChild(inner);
      inner.style.borderWidth = kBigBuffBorderSize;
      inner.style.left = kBigBuffBorderSize;
      inner.style.top = kBigBuffBorderSize;
      inner.style.position = 'relative';
      inner.style.borderStyle = 'solid';
      inner.style.borderColor = '#000';
      inner.style.width = kBigBuffIconWidth - kBigBuffBorderSize * 6;
      inner.style.height = kBigBuffIconHeight - kBigBuffBorderSize * 6;
      inner.style.backgroundImage = 'url(data:image/jpeg;base64,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)';
      inner.style.backgroundColor = '#888';
      inner.style.backgroundRepeat = 'no-repeat';
      inner.style.backgroundSize = Math.max(kBigBuffIconWidth, kBigBuffIconHeight) - kBigBuffBorderSize * 2 + 'px';
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
      if (this.inCombat || !kLowerOpacityOutOfCombat)
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
        kBigBuffIconWidth, kBigBuffIconHeight,
        kBigBuffBarHeight, kBigBuffTextHeight,
        kBigBuffBorderSize,
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
        g_combo.AbortCombo();  // Death resets combos.
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

      if (log.search(/:test:bars:/) >= 0)
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
