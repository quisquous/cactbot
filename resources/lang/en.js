"use strict";

class CactbotLanguageEn extends CactbotLanguage {
  constructor(playerName) {
    super('en', playerName);
  }

  InitStrings(playerName) {
    this.kAbility = Object.freeze({
      DragonKick: 'Dragon Kick',
      TwinSnakes: 'Twin Snakes',
      Demolish: 'Demolish',
      Verstone: 'Verstone',
      Verfire: 'Verfire',
      Veraero: 'Veraero',
      Verthunder: 'Verthunder',
      Verholy: 'Verholy',
      Verflare: 'Verflare',
      Jolt2: 'Jolt II',
      Jolt: 'Jolt',
      Impact: 'Impact',
      Scatter: 'Scatter',
      Vercure: 'Vercure',
      Verraise: 'Verraise',
      Riposte: 'Riposte',
      Zwerchhau: 'Zwerchhau',
      Redoublement: 'Redoublement',
      Moulinet: 'Moulinet',
      EnchantedRiposte: 'Enchanted Riposte',
      EnchantedZwerchhau: 'Enchanted Zwerchhau',
      EnchantedRedoublement: 'Enchanted Redoublement',
      EnchantedMoulinet: 'Enchanted Moulinet',
      Tomahawk: 'Tomahawk',
      Overpower: 'Overpower',
      HeavySwing: 'Heavy Swing',
      SkullSunder: 'Skull Sunder',
      ButchersBlock: "Butcher's Block",
      Maim: 'Maim',
      StormsEye: "Storm's Eye",
      StormsPath: "Storm's Path",
      TrickAttack: 'Trick Attack',
      Embolden: 'Embolden',
      Aetherflow: 'Aetherflow',
      ChainStrategem: 'Chain Strategem',
      Hypercharge: 'Hypercharge',
    });

    this.kZone = Object.freeze({
      O1S: /Deltascape V1\.0 \(Savage\)/,
      O2S: /Deltascape V2\.0 \(Savage\)/,
      O3S: /Deltascape V3\.0 \(Savage\)/,
      O4S: /Deltascape V4\.0 \(Savage\)/,
      UCU: /The Unending Coil Of Bahamut \(Ultimate\)/,
    });

    this.kEffect = Object.freeze({
      BluntResistDown: 'Blunt Resistance Down',
      VerstoneReady: 'Verstone Ready',
      VerfireReady: 'Verfire Ready',
      Impactful: 'Impactful',
      FurtherRuin: 'Further Ruin',
      Aetherflow: 'Aetherflow',
      WellFed: 'Well Fed',
      OpoOpoForm: 'Opo-Opo Form',
      RaptorForm: 'Raptor Form',
      CoeurlForm: 'Coeurl Form',
      PerfectBalance: 'Perfect Balance',
      Medicated: 'Medicated',
      BattleLitany: 'Battle Litany',
      Embolden: 'Embolden',
      Balance: 'The Balance',
      Hypercharge: 'Hypercharge',
      LeftEye: 'Left Eye',
      RightEye: 'Right Eye',
      Brotherhood: 'Brotherhood',
      Devotion: 'Devotion',
      FoeRequiem: 'Foe Requiem',
    });

    this.kUIStrings = Object.freeze({
      // jobs: text on the pull countdown.
      Pull: 'Pull',
    });

    // Due to this bug: https://github.com/ravahn/FFXIV_ACT_Plugin/issues/100
    // We can not look for log messages from FFXIV "You use X" here. Instead we
    // look for the actual ability usage provided by the XIV plugin.
    // Also, the networked parse info is given much quicker than the lines from the game.
    this.youUseAbilityRegex = function() {
      var ids = this.AbilitiesToIds.apply(this, arguments);
      return Regexes.Parse(' 1[56]:\\y{ObjectId}:' + this.playerName + ':' + Regexes.AnyOf(ids) + ':');
    };
    this.youStartUsingRegex = function() {
      var ids = this.AbilitiesToIds.apply(this, arguments);
      return Regexes.Parse(' 14:' + Regexes.AnyOf(ids) + ':' + this.playerName + ' starts using ');
    };
    this.youGainEffectRegex = function() {
      var effects = [];
      for (var i = 0; i < arguments.length; ++i) {
        var effect = arguments[i];
        this.ValidateEffect(effect);
        effects.push(effect);
      }
      return Regexes.Parse(' 1A:' + this.playerName + ' gains the effect of ' + Regexes.AnyOf(effects) + ' from .* for (\\y{Float}) Seconds\.');
    };
    this.youLoseEffectRegex = function() {
      var effects = [];
      for (var i = 0; i < arguments.length; ++i) {
        var effect = arguments[i];
        this.ValidateEffect(effect);
        effects.push(effect);
      }
      return Regexes.Parse(' 1E:' + this.playerName + ' loses the effect of ' + Regexes.AnyOf(effects) + ' from .*\.');
    };

    this.abilityRegex = function(abilityName, attacker, target, flags) {
      this.ValidateAbility(abilityName);
      if (!attacker)
        attacker = '[^:]*';
      // type:attackerId:attackerName:abilityId:abilityName:targetId:targetName:flags:
      var r = ' 1[56]:\\y{ObjectId}:' + attacker + ':' + this.kAbilNameToId[abilityName] + ':';
      if (target || flags) {
        if (!target)
          target = '[^:]*';
        if (!flags)
          flags = '[^:]*';
        r += '[^:]*:\\y{ObjectId}:' + target + ':' + flags + ':';
      }
      return Regexes.Parse(r);
    };

    this.gainsEffectRegex = function(effect, target, attacker) {
      this.ValidateEffect(effect);
      if (!target)
        target = '[^:]*';
      if (!attacker)
        attacker = '[^:]*';
      return Regexes.Parse(' 1A:' + target + ' gains the effect of ' + effect + ' from ' + attacker + ' for (\\y{Float}) Seconds\.');
    };
    this.losesEffectRegex = function(effect, target, attacker) {
      this.ValidateEffect(effect);
      if (!target)
        target = '[^:]*';
      if (!attacker)
        attacker = '[^:]*';
      return Regexes.Parse(' 1E:' + target + ' loses the effect of ' + effect + ' from ' + attacker + '.*\.');
    };

    this.countdownStartRegex = function() {
      return Regexes.Parse(/Battle commencing in (\y{Float}) seconds!/);
    };
    this.countdownCancelRegex = function() {
      return Regexes.Parse(/Countdown canceled by /);
    };
  }
}

document.addEventListener("onPlayerChangedEvent", function (e) {
  if (Options && Options.Language == 'en') {
    if (!gLang)
      gLang = new CactbotLanguageEn();
    if (gLang.playerName != e.detail.name)
      gLang.OnPlayerNameChange(e.detail.name);
  }
});