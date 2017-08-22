"use strict";

// Options.
var kLowerOpacityOutOfCombat = true;
var kRdmCastTime = 1.94 + 0.5;  // Jolt cast time + 0.5 for my reaction time. Show procs ending this amount early so as to not waste GCDs on no-longer-useful procs.
var kShowRdmProcs = true;
var kFarThresholdOffence = 24;  // The distance that offensive spells such as VerAreo, etc are castable.

// Layout.
var kHealthBarPosX = 0;
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
var kReRdmCombo1 = null;
var kReRdmCombo2 = null;
var kReRdmCombo3 = null;
var kReRdmWhiteManaProc = null;
var kReRdmBlackManaProc = null;
var kReRdmImpactProc = null;
var kReRdmWhiteManaProcEnd = null;
var kReRdmBlackManaProcEnd = null;
var kReRdmImpactProcEnd = null;
var kReRdmEndCombo = null;

// Set to true when all setup is complete, including setupRegexes and setupBuffTracker.
var g_init = false;

var kMe = null;

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

      // Always set the combo timer even on the final one so that it will eventually hide.
      var kComboDelayMs = 12000;
      this.comboTimer = window.setTimeout(this.AbortCombo.bind(this), kComboDelayMs);
    }
    this.callback(nextState);
  }

  AbortCombo() {
    this.StateTransition(null);
  }
}

function setupComboTracker(me, callback) {
  var comboTracker = new ComboTracker(me, kComboBreakers, callback);
  comboTracker.AddCombo(['(Enchanted )?Riposte', '(Enchanted )?Zwerchhau', '(Enchanted )?Redoublement']);
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
}

var kCasterJobs = ["RDM", "BLM", "WHM", "SCH", "SMN", "ACN", "AST", "CNJ", "THM"];
var kTankJobs = ["GLD", "PLD", "MRD", "WAR", "DRK"];

function isCasterJob(job) {
  return kCasterJobs.indexOf(job) >= 0;
}

function isTankJob(job) {
  return kTankJobs.indexOf(job) >= 0;
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
    this.o = {};
    this.bugBuffs = {};
    this.casting = {};
  }

  OnJobChange(job) {
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

    this.o.bigBuffsContainer = document.createElement("div");
    this.o.bigBuffsList = document.createElement('widget-list');
    this.o.bigBuffsContainer.appendChild(this.o.bigBuffsList);
    opacityContainer.appendChild(this.o.bigBuffsContainer);

    this.o.bigBuffsContainer.style.position = "absolute";
    this.o.bigBuffsContainer.style.top = kHealthBarPosY;
    this.o.bigBuffsContainer.style.left = kHealthBarPosX + kHealthBarSizeW + 3;
    this.o.bigBuffsList.rowcolsize = 7;
    this.o.bigBuffsList.maxnumber = 7;
    this.o.bigBuffsList.toward = "right down";
    this.o.bigBuffsList.elementwidth = kBigBuffIconWidth + 2;

    this.o.healthContainer = document.createElement("div");
    this.o.healthBar = document.createElement("resource-bar");
    this.o.healthContainer.appendChild(this.o.healthBar);
    opacityContainer.appendChild(this.o.healthContainer);

    this.o.healthContainer.style.position = "absolute";
    this.o.healthContainer.style.top = kHealthBarPosY;
    this.o.healthContainer.style.left = kHealthBarPosX;
    this.o.healthBar.width = kHealthBarSizeW;
    this.o.healthBar.height = kHealthBarSizeH;

    if (isTankJob(job)) {
      this.o.healthBar.height = kTankHealthBarSizeH;
      this.o.healthBar.lefttext = "value";
    }

    var secondBarTop = kHealthBarPosY + parseInt(this.o.healthBar.height) + kManaBarMarginY;
    if (isCasterJob(job)) {
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

    if (job == "RDM") {
      var fontSize = 16;
      var fontWidth = fontSize * 1.8;
      var whiteX = kHealthBarSizeW + 3;
      var whiteY = -17;
      var blackX = kHealthBarSizeW + 3 + fontWidth + 5;
      var blackY = -17;
      var innerTextY = 6;

      // Move over the big buffs.
      this.o.bigBuffsContainer.style.left = kRedMageManaBarPosX + blackX + fontWidth + 5;

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
    } else if (job == "WAR") {
      var fontSize = 16;
      var fontWidth = fontSize * 1.8;
      var beastX = kHealthBarPosX + kHealthBarSizeW + 3;
      var beastY = kHealthBarPosY;

      // Move over the big buffs.
      // TODO: these should probably just float?
      this.o.bigBuffsContainer.style.left = beastX + fontWidth + 7;

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
    if (g_data.job == "RDM") {
      if (this.o.rdmCombo1 == null || this.o.rdmCombo2 == null || this.o.rdmCombo3 == null)
        return;

      if (!skill)
        skill = "";
      this.o.rdmCombo1.style.display = skill.indexOf('Riposte') >= 0 ? "block" : "none";
      this.o.rdmCombo2.style.display = skill.indexOf('Zwerchhau') >= 0 ? "block" : "none";
      this.o.rdmCombo3.style.display = skill.indexOf('Redoublement') >= 0 ? "block" : "none";
    }
  }

  OnHealthChange(job, distance, current, max) {
    if (!this.o.healthBar) return;
    this.o.healthBar.value = current;
    this.o.healthBar.maxvalue = max;
    if (max > 0 && (current / max) < kLowHealthThresholdPercent)
      this.o.healthBar.fg = kLowHealthColor;
    else if (max > 0 && (current / max) < kMidHealthThresholdPercent)
      this.o.healthBar.fg = kMidHealthColor;
    else
      this.o.healthBar.fg = kHealthColor;
  }

  OnManaChange(job, distance, current, max) {
    if (!this.o.manaBar) return;
    this.o.manaBar.value = current;
    this.o.manaBar.maxvalue = max;

    var far = -1;
    if (job == "RDM")
      far = kFarThresholdOffence;
    else if (job == "BLM")
      far = kFarThresholdOffence;

    if (far >= 0 && distance > far)
      this.o.manaBar.fg = kFarManaColor;
    else
      this.o.manaBar.fg = kManaColor;
  }

  OnTPChange(job, distance, current, max) {
    if (!this.o.tpBar) return;
    this.o.tpBar.value = current;
    this.o.tpBar.maxvalue = max;
  }

  OnInCombatChanged(inCombat) {
    if (inCombat)
      this.OnPullCountdown(0);

    var opacityContainer = document.getElementById("opacity-container");
    if (opacityContainer != null) {
      if (inCombat || !kLowerOpacityOutOfCombat)
        opacityContainer.style.opacity = 1.0;
      else
        opacityContainer.style.opacity = 0.5;
    }
  }

  OnPullCountdown(seconds) {
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
    this.o.bigBuffsList.addElement(name, aura, settings.sortKey);
    var that = this;
    window.clearTimeout(settings.timeout);
    settings.timeout = window.setTimeout(function() {
      that.o.bigBuffsList.removeElement(name);
    }, seconds * 1000);
    if ('sound' in settings) {
      var audio = new Audio(settings.sound);
      if ('soundVolume' in settings)
        audio.volume = settings.soundVolume;
      audio.play();
    }
  }
}

class TrackingData {
  constructor() {
    this.job = "";
    this.hp = 0;
    this.maxHP = 0;
    this.mp = 0;
    this.maxMP = 0;
    this.tp = 0;
    this.maxTP = 0;
    this.distance = -1;
    this.whiteMana = -1;
    this.blackMana = -1;
    this.beast = -1;
    this.inCombat = false;
    this.combo = 0;
    this.comboTimer = null;
  }
}

var g_data = new TrackingData();
var g_bars = new Bars();
var g_combo = null;

document.addEventListener("onPlayerChangedEvent", function (e) {
  if (!g_init) {
    kMe = e.detail.name;
    setupRegexes(kMe);
    setupBuffTracker(kMe);
    g_combo = setupComboTracker(kMe, g_bars.OnComboChange.bind(g_bars));
    g_init = true;
  }

  var update_job = false;
  var update_hp = false;
  var update_mp = false;
  var update_tp = false;
  if (e.detail.job != g_data.job) {
    g_data.job = e.detail.job;
    g_combo.AbortCombo();  // Combos are job specific.
    update_job = update_hp = update_mp = update_tp = true;
  }
  if (e.detail.currentHP != g_data.hp || e.detail.maxHP != g_data.maxHP) {
    g_data.hp = e.detail.currentHP;
    g_data.maxHP = e.detail.maxHP;
    update_hp = true;

    if (g_data.hp == 0) {
      g_combo.AbortCombo();  // Death resets combos.
    }
  }
  if (e.detail.currentMP != g_data.mp || e.detail.maxMP != g_data.maxMP) {
    g_data.mp = e.detail.currentMP;
    g_data.maxMP = e.detail.maxMP;
    update_mp = true;
  }
  if (e.detail.currentTP != g_data.tp || e.detail.maxTP != g_data.maxTP) {
    g_data.tp = e.detail.currentTP;
    g_data.maxTP = e.detail.maxTP;
    update_tp = true;
  }
  if (update_job) {
    g_bars.OnJobChange(g_data.job);
    // When reloading, we don't hear about combat state if out
    // of combat. So use this to set things up.
    g_bars.OnInCombatChanged(g_data.inCombat);
  }
  if (update_hp)
    g_bars.OnHealthChange(g_data.job, g_data.distance, g_data.hp, g_data.maxHP);
  if (update_mp)
    g_bars.OnManaChange(g_data.job, g_data.distance, g_data.mp, g_data.maxMP);
  if (update_tp)
    g_bars.OnTPChange(g_data.job, g_data.distance, g_data.tp, g_data.maxTP);

  if (g_data.job == "RDM") {
      if (update_job ||
          e.detail.jobDetail.whiteMana != g_data.whiteMana ||
          e.detail.jobDetail.blackMana != g_data.blackMana) {
          g_data.whiteMana = e.detail.jobDetail.whiteMana;
          g_data.blackMana = e.detail.jobDetail.blackMana;
          g_bars.OnRedMageUpdate(g_data.whiteMana, g_data.blackMana);
      }
  } else if (g_data.job == "WAR") {
    if (update_job || e.detail.jobDetail.beast != g_data.beast) {
        g_data.beast = e.detail.jobDetail.beast;
        g_bars.OnWarUpdate(g_data.beast);
    }
  }
});

document.addEventListener("onTargetChangedEvent", function (e) {
  var update = false;
  if (e.detail.name == null) {
    if (g_data.distance != -1) {
      g_data.distance = -1;
      update = true;
    }
  } else if (e.detail.distance != g_data.distance, g_data.job) {
    g_data.distance = e.detail.distance;
    update = true;
  }
  if (update) {
    g_bars.OnHealthChange(g_data.job, g_data.distance, g_data.hp, g_data.maxHP);
    g_bars.OnManaChange(g_data.job, g_data.distance, g_data.mp, g_data.maxMP);
    g_bars.OnTPChange(g_data.job, g_data.distance, g_data.tp, g_data.maxTP);
  }
});

document.addEventListener("onInCombatChangedEvent", function (e) {
  g_data.inCombat = e.detail.inCombat;
  g_bars.OnInCombatChanged(g_data.inCombat);
});

document.addEventListener("onLogEvent", OnLogEvent);

function OnLogEvent(e) {
  if (!g_init)
    return;

  for (var i = 0; i < e.detail.logs.length; i++) {
    var log = e.detail.logs[i];
    
    var r = log.match(/:Battle commencing in ([0-9]+) seconds!/);
    if (r != null) {
      var seconds = parseInt(r[1]);
      g_bars.OnPullCountdown(seconds);
      continue;
    }
    if (log.search(/Countdown canceled by /) >= 0) {
      g_bars.OnPullCountdown(0);
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
        g_bars.OnBigBuff(name, seconds, settings);
      }
    }

    if (g_combo.ParseLog(log))
      continue;

    if (g_data.job == "RDM") {
      var r = log.match(kReRdmBlackManaProc);
      if (r != null) {
        var seconds = parseFloat(r[1]);
        g_bars.OnRedMageProcBlack(seconds);
        continue;
      }
      r = log.match(kReRdmWhiteManaProc);
      if (r != null) {
        var seconds = parseFloat(r[1]);
        g_bars.OnRedMageProcWhite(seconds);
        continue;
      }
      r = log.match(kReRdmImpactProc);
      if (r != null) {
        var seconds = parseFloat(r[1]);
        g_bars.OnRedMageProcImpact(seconds);
        continue;
      }
      if (log.search(kReRdmBlackManaProcEnd) >= 0) {
        g_bars.OnRedMageProcBlack(0);
        continue;
      }
      if (log.search(kReRdmWhiteManaProcEnd) >= 0) {
        g_bars.OnRedMageProcWhite(0);
        continue;
      }
      if (log.search(kReRdmImpactProcEnd) >= 0) {
        g_bars.OnRedMageProcImpact(0);
        continue;
      }
    }

    // For learning boss ability codes.
    //if (log.search(/Exdeath (starts using Unknown_|readies |begins casting )/) >= 0)
    //  console.log(log);

    if (log.search(/::test::/) >= 0)
      Test();
  }
}

function Test() {
  var logs = [];
  logs.push(':' + kMe + ' gains the effect of Medicated from ' + kMe + ' for 30 Seconds\.');
  logs.push(':' + kMe + ' gains the effect of Embolden from  for 20 Seconds\.');
  logs.push(':' + kMe + ' gains the effect of Battle Litany from  for 25 Seconds\.');
  logs.push(':' + kMe + ' gains the effect of The Balance from  for 12 Seconds\.');
  logs.push(':' + kMe + ':00:Dragon Sight:');
  logs.push(':' + kMe + ':00:Chain Strategem:');
  logs.push(':' + kMe + ':00:Trick Attack:');
  logs.push(':' + kMe + ':00:Hypercharge:');
  var e = { detail: { logs: logs } };
  OnLogEvent(e);
}