"use strict";

var kRdmGcdAbilties = 'Verstone|Verfire|Verareo|Verthunder|Verholy|Verflare' +
  '|Jolt II|Jolt|Impact|Scatter|Vercure|Verraise' +
  '|((Enchanted )?(Riposte|Zwerchhau|Redoublement|Moulinet))' +
  '|Limit Break';

var g_me = null;

class Bars {
  constructor() {
    this.kHealthColor = "rgb(59, 133, 4)";
    this.kManaColor = "rgb(188, 55, 147)"; //"rgb(57, 120, 167)";
    this.kTPColor = "rgb(180, 180, 0)";
    this.kBackgroundColor = "rgb(30, 30, 30)";
    
    this.kLowManaThresholdRdm = -1; // 3600;  // The cost of VerRaise.
    this.kLowManaThresholdBlm = -1; // 2634;  // The cost of Fire1 in flame stance.
    this.kFarThresholdRdm = 24;  // The distance that VerAreo, etc is castable.
    this.kFarThresholdBlm = 24;  // The distance that Fire, etc is castable.

    this.kLowManaColor = "rgb(218, 69, 177)";
    this.kFarManaColor = "rgb(215, 120, 0)";
    
    this.kLowHealthThresholdPercent = 0.2;
    this.kLowHealthColor = "rgb(190, 43, 30)"
    this.kMidHealthThresholdPercent = 0.8;
    this.kMidHealthColor = "rgb(127, 185, 29)"
    
    this.kWhiteManaBarColor = "rgb(220, 220, 240)";
    this.kWhiteManaBarDimColor = "rgb(90, 90, 100)";
    this.kBlackManaBarColor = "rgb(47, 176, 208)";
    this.kBlackManaBarDimColor = "rgb(13, 76, 80)";
    this.kWhiteBlackIndicator40 = "rgba(0, 0, 0, 0.7)";
    this.kWhiteBlackIndicator80 = "rgba(0, 0, 0, 0.7)";
    this.kWhiteBlackIndicator = "rgba(100, 100, 100, 0.7)";

    this.o = {}
  }
  
  OnJobChange(job) {
    var container = document.getElementById("container");
    while (container.childNodes.length)
      container.removeChild(container.childNodes[0]);
    
    this.o = {};
    
    var hpX = 50;
    var hpY = 20;
    var mpX = 50;
    var mpY = hpY + 8;
    var hpW = 202;  // 2px per percent + 1px border on each side.
    
    var pullCountdownContainer = document.createElement("div");
    container.appendChild(pullCountdownContainer);
    this.o.pullCountdown = document.createElement("timer-bar");
    pullCountdownContainer.appendChild(this.o.pullCountdown);

    pullCountdownContainer.style.position = "absolute";
    pullCountdownContainer.style.top = hpY - 20;
    pullCountdownContainer.style.left = hpX;
    this.o.pullCountdown.width = hpW;
    this.o.pullCountdown.height = 18;
    this.o.pullCountdown.lefttext = "Pull";
    this.o.pullCountdown.righttext = "remain";
    this.o.pullCountdown.style = "empty";
    this.o.pullCountdown.hideafter = 0;
    this.o.pullCountdown.fg = "rgb(255, 160, 160)";
    
    if (job == "RDM" || job == "BLM" || job == "WHM" ||
        job == "SCH" || job == "SMN" || job == "ACN" ||
        job == "AST" || job == "CNJ" || job == "THM") {
      this.o.healthContainer = document.createElement("div");
      this.o.healthBar = document.createElement("resource-bar");
      this.o.healthContainer.appendChild(this.o.healthBar);
      container.appendChild(this.o.healthContainer);

      this.o.healthContainer.style.position = "absolute";
      this.o.healthContainer.style.top = hpY;
      this.o.healthContainer.style.left = hpX;
      this.o.healthBar.width = hpW;
      this.o.healthBar.height = 7;

      this.o.manaContainer = document.createElement("div");
      this.o.manaBar = document.createElement("resource-bar");
      this.o.manaContainer.appendChild(this.o.manaBar);
      container.appendChild(this.o.manaContainer);

      this.o.manaContainer.style.position = "absolute";
      this.o.manaContainer.style.top = mpY;
      this.o.manaContainer.style.left = mpX;
      this.o.manaBar.width = hpW;
      this.o.manaBar.height = 7;  // Rogue energy was 12.
    } else {
      this.o.healthContainer = document.createElement("div");
      this.o.healthBar = document.createElement("resource-bar");
      this.o.healthContainer.appendChild(this.o.healthBar);
      container.appendChild(this.o.healthContainer);

      this.o.healthContainer.style.position = "relative";
      this.o.healthContainer.style.top = hpY;
      this.o.healthContainer.style.left = hpX;
      this.o.healthBar.width = hpW;
      this.o.healthBar.height = 7;

      this.o.tpContainer = document.createElement("div");
      this.o.tpBar = document.createElement("resource-bar");
      this.o.tpContainer.appendChild(this.o.tpBar);
      container.appendChild(this.o.tpContainer);

      this.o.tpContainer.style.position = "relative";
      this.o.tpContainer.style.top = mpY;
      this.o.tpContainer.style.left = mpX;
      this.o.tpBar.width = hpW;
      this.o.tpBar.height = 9;  // Rogue energy was 12.
    }
    
    if (job == "RDM") {
      var barX = hpX;
      var barY = hpY + 17;// + 228;
      var barHeight = 8;  // Rogue energy was 12.
      
      var fontSize = 16;
      var fontWidth = fontSize * 1.8;
      var whiteX = hpW + 3;
      var whiteY = -17;
      var blackX = hpW + 3 + fontWidth + 5;
      var blackY = -17;
      var innerTextY = 6;
      
      var rdmContainer = document.createElement("div");
      container.appendChild(rdmContainer);
      rdmContainer.style.position = "absolute";
      rdmContainer.style.top = barY;
      rdmContainer.style.left = barX;

      this.o.whiteManaBarContainer = document.createElement("div");
      this.o.whiteManaBar = document.createElement("resource-bar");
      rdmContainer.appendChild(this.o.whiteManaBarContainer);
      this.o.whiteManaBarContainer.appendChild(this.o.whiteManaBar);

      this.o.whiteManaBarContainer.style.position = "absolute";
      this.o.whiteManaBarContainer.style.top = 0;
      this.o.whiteManaBarContainer.style.left = 0;

      this.o.whiteManaBar.bg = "rgba(0, 0, 0, 0)";
      this.o.whiteManaBar.fg = this.kWhiteManaBarColor;
      this.o.whiteManaBar.width = hpW;
      this.o.whiteManaBar.height = barHeight;
      this.o.whiteManaBar.maxvalue = 100;

      this.o.blackManaBarContainer = document.createElement("div");
      this.o.blackManaBar = document.createElement("resource-bar");
      rdmContainer.appendChild(this.o.blackManaBarContainer);
      this.o.blackManaBarContainer.appendChild(this.o.blackManaBar);

      this.o.blackManaBarContainer.style.position = "absolute";
      this.o.blackManaBarContainer.style.top = barHeight - 2;
      this.o.blackManaBarContainer.style.left = 0;
      this.o.blackManaBar.bg = "rgba(0, 0, 0, 0)";
      this.o.blackManaBar.fg = this.kBlackManaBarColor;
      this.o.blackManaBar.width = hpW;
      this.o.blackManaBar.height = barHeight;
      this.o.blackManaBar.maxvalue = 100;

      this.o.rdmBackground = document.createElement("div");
      rdmContainer.appendChild(this.o.rdmBackground);
      this.o.rdmBackground.style.zIndex = -1;
      this.o.rdmBackground.style.position = "absolute";
      this.o.rdmBackground.style.left = 0;
      this.o.rdmBackground.style.top = 0;
      this.o.rdmBackground.style.width = hpW - 2;
      this.o.rdmBackground.style.height = barHeight * 2 - 4;
      this.o.rdmBackground.style.border = "1px solid black";
      this.o.rdmBackground.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
      
      this.o.rdmCombo1 = document.createElement("div");
      this.o.rdmCombo2 = document.createElement("div");
      this.o.rdmCombo3 = document.createElement("div");
      
      this.o.rdmCombo1.style.position = "absolute";
      this.o.rdmCombo1.style.left = hpX;
      this.o.rdmCombo1.style.top = hpY - 9;
      this.o.rdmCombo1.style.width = 50;
      this.o.rdmCombo1.style.height = 6;
      this.o.rdmCombo1.style.backgroundColor = "#800";
      this.o.rdmCombo1.style.border = "1px solid black";
      this.o.rdmCombo1.style.display = "none";

      this.o.rdmCombo2.style.position = "absolute";
      this.o.rdmCombo2.style.left = hpX + hpW / 2 - 52 / 2;
      this.o.rdmCombo2.style.top = hpY - 9;
      this.o.rdmCombo2.style.width = 50;
      this.o.rdmCombo2.style.height = 6;
      this.o.rdmCombo2.style.backgroundColor = "#990";
      this.o.rdmCombo2.style.border = "1px solid black";
      this.o.rdmCombo2.style.display = "none";

      this.o.rdmCombo3.style.position = "absolute";
      this.o.rdmCombo3.style.left = hpX + hpW - 52;
      this.o.rdmCombo3.style.top = hpY - 9;
      this.o.rdmCombo3.style.width = 50;
      this.o.rdmCombo3.style.height = 6;
      this.o.rdmCombo3.style.backgroundColor = "#070";
      this.o.rdmCombo3.style.border = "1px solid black";
      this.o.rdmCombo3.style.display = "none";
      
      container.appendChild(this.o.rdmCombo1);
      container.appendChild(this.o.rdmCombo2);
      container.appendChild(this.o.rdmCombo3);
      
      var incs = 20;
      for (var i = 2 * incs; i <= 100; i = i + 2 * incs) {
        var marker = document.createElement("div");
        rdmContainer.appendChild(marker);
        marker.style.zIndex = -1;
        marker.style.position = "absolute";
        marker.style.left = 1 + 2 * (i - incs);
        marker.style.top = 1;
        marker.style.width = 2 * incs;
        marker.style.height = barHeight * 2 - 4;
        if (i == 40)
          marker.style.backgroundColor = this.kWhiteBlackIndicator40;
        else if (i == 80)
          marker.style.backgroundColor = this.kWhiteBlackIndicator80;
        else
          marker.style.backgroundColor = this.kWhiteBlackIndicator;
        
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
    }
    
    if (this.o.healthBar) {
      this.o.healthBar.fg = this.kHealthColor;
      this.o.healthBar.bg = this.kBackgroundColor;
    }
    if (this.o.manaBar) {
      this.o.manaBar.fg = this.kManaColor;
      this.o.manaBar.bg = this.kBackgroundColor;
    }
    if (this.o.tpBar) {
      this.o.tpBar.fg = this.kTPColor;
      this.o.tpBar.bg = this.kBackgroundColor;
    }
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
      this.o.whiteManaTextBox.style.backgroundColor = this.kWhiteManaBarColor; //"rgba(200,200,200,0.7)";
    if (black < 80)
      this.o.blackManaTextBox.style.backgroundColor = this.kBlackManaBarDimColor; //"rgba(0,0,0,0.7)";
    else
      this.o.blackManaTextBox.style.backgroundColor = this.kBlackManaBarColor; //"rgba(50,50,50,0.7)";
  }
  
  OnComboChange(job, stage) {
    if (job == "RDM") {
      if (this.o.rdmCombo1 == null || this.o.rdmCombo2 == null || this.o.rdmCombo3 == null)
        return;
      this.o.rdmCombo1.style.display = stage == 1 ? "block" : "none";
      this.o.rdmCombo2.style.display = stage == 2 ? "block" : "none";
      this.o.rdmCombo3.style.display = stage == 3 ? "block" : "none";
    }
  }
  
  OnHealthChange(job, distance, current, max) {
    if (!this.o.healthBar) return;
    this.o.healthBar.value = current;
    this.o.healthBar.maxvalue = max;
    if (max > 0 && (current / max) < this.kLowHealthThresholdPercent)
      this.o.healthBar.fg = this.kLowHealthColor;
    else if (max > 0 && (current / max) < this.kMidHealthThresholdPercent)
      this.o.healthBar.fg = this.kMidHealthColor;
    else
      this.o.healthBar.fg = this.kHealthColor;
  }

  OnManaChange(job, distance, current, max) {
    if (!this.o.manaBar) return;
    this.o.manaBar.value = current;
    this.o.manaBar.maxvalue = max;
    
    var far = -1;
    var low = -1;
    if (job == "RDM") {
      far = this.kFarThresholdRdm;
      low = this.kLowManaThresholdRdm;
    } else if (job == "BLM") {
      far = this.kFarThresholdBlm;
      low = this.kLowManaThresholdBlm;
    }

    if (far >= 0 && distance > far)
      this.o.manaBar.fg = this.kFarManaColor;
    else if (low >= 0 && current < low)
      this.o.manaBar.fg = this.kLowManaColor;
    else
      this.o.manaBar.fg = this.kManaColor;
  }

  OnTPChange(job, distance, current, max) {
    if (!this.o.tpBar) return;
    this.o.tpBar.value = current;
    this.o.tpBar.maxvalue = max;
  }
  
  OnInCombatChanged(inCombat) {
    if (inCombat)
      this.OnPullCountdown(0);

    var container = document.getElementById("container");
    if (inCombat)
      container.style.opacity = 1.0;
    else
      container.style.opacity = 0.5;
  }
  
  OnPullCountdown(seconds) {
    if (this.o.pullCountdown == null) return;

    var in_countdown = seconds > 0;
    var showing_countdown = this.o.pullCountdown.duration > 0;
    if (in_countdown != showing_countdown) {
      this.o.pullCountdown.duration = seconds;
      if (in_countdown) {
        var audio = new Audio('../../sounds/PowerAuras/sonar.ogg');
        audio.volume = 0.3;
        audio.play();
      }
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
    this.inCombat = false;
    this.combo = 0;
    this.comboTimer = null;
  }
}

var g_data = new TrackingData();
var g_bars = new Bars();

document.addEventListener("onPlayerChangedEvent", function (e) {
  if (g_me == null)
    g_me = e.detail.name;
  
  var update_job = false;
  var update_hp = false;
  var update_mp = false;
  var update_tp = false;
  var update_combo = false;
  if (e.detail.job != g_data.job) {
    g_data.job = e.detail.job;
    AbortCombo();  // Combos are job specific.
    update_job = update_hp = update_mp = update_tp = update_combo = true;
  }
  if (e.detail.currentHP != g_data.hp || e.detail.maxHP != g_data.maxHP) {
    g_data.hp = e.detail.currentHP;
    g_data.maxHP = e.detail.maxHP;
    update_hp = true;
    
    if (g_data.hp == 0) {
      AbortCombo();  // Death resets combos.
      update_combo = true;
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
  if (update_combo)
    g_bars.OnComboChange(g_data.job, g_data.combo);
  
  if (g_data.job == "RDM") {
    if (update_job ||
        e.detail.jobDetail.whiteMana != g_data.whiteMana ||
        e.detail.jobDetail.blackMana != g_data.blackMana) {
      g_data.whiteMana = e.detail.jobDetail.whiteMana;
      g_data.blackMana = e.detail.jobDetail.blackMana;
      g_bars.OnRedMageUpdate(g_data.whiteMana, g_data.blackMana);
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

document.addEventListener("onLogEvent", function(e) {
  if (g_me == null)
    return;
  
  for (var i = 0; i < e.detail.logs.length; i++) {
    var log = e.detail.logs[i];
    
    var r = log.match(/:Battle commencing in ([0-9]+) seconds!/);
    if (r != null)
      g_bars.OnPullCountdown(parseInt(r[1]));
    if (log.search(/Countdown canceled by /) >= 0)
      g_bars.OnPullCountdown(0);
    
    if (g_data.job == "RDM") {
      // Due to this bug: https://github.com/ravahn/FFXIV_ACT_Plugin/issues/100
      // We can not look for log messages from FFXIV "You use X" here. Instead we
      // look for the actual ability usage provided by the XIV plugin.
      // Also, the plugin lines are given much quicker than the lines from the game.
      // var kReCombo1 = 'You use Enchanted Riposte\.';
      // var kReCombo2 = 'You use Enchanted Zwerchhau\.';
      // var kReCombo3 = 'You use Enchanted Redoublement\.';
      // var kReEndCombo1 = 'You use (Enchanted )?(Riposte|Zwerchhau|Redoublement|Moulinet)\.';
      // var kReEndCombo2 = 'You (cast|begin casting) ';
      var kReCombo1 = ':' + g_me + ':....:Enchanted Riposte:';
      var kReCombo2 = ':' + g_me + ':....:Enchanted Zwerchhau:';
      var kReCombo3 = ':' + g_me + ':....:Enchanted Redoublement:';
      // Spending any GCD ends the combo, be they spells or abilities.
      var kReEndCombo = ':' + g_me + '( starts using |:....:)(' + kRdmGcdAbilties + ')( |:)';
            
      if (log.search(kReCombo1) >= 0 && g_data.combo == 0) {
        SetComboWithTimeout(1, 12000);
        g_bars.OnComboChange(g_data.job, g_data.combo);
      } else if (log.search(kReCombo2) >= 0 && g_data.combo == 1) {
        SetComboWithTimeout(2, 12000);
        g_bars.OnComboChange(g_data.job, g_data.combo);
      } else if (log.search(kReCombo3) >= 0 && g_data.combo == 2) {
        SetComboWithTimeout(3, 12000);
        g_bars.OnComboChange(g_data.job, g_data.combo);
      } else if (log.search(kReEndCombo) >= 0) {
        if (g_data.combo > 0) {
          AbortCombo();
          g_bars.OnComboChange(g_data.job, g_data.combo);
        }
      }
    }
  }
});

function SetComboWithTimeout(stage, delay) {
  g_data.combo = stage;
  window.clearTimeout(g_data.comboTimer);
  g_data.comboTimer = window.setTimeout(OnComboTimeOut, delay);
}

function AbortCombo() {
  g_data.combo = 0;
  window.clearTimeout(g_data.comboTimer);
  g_data.comboTimer = null;
}

function OnComboTimeOut() {
  AbortCombo();
  g_bars.OnComboChange(g_data.job, g_data.combo);
}
