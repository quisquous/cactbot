"use strict";

class CactbotLanguageEn extends CactbotLanguage {
  constructor(playerName) {
    super('en', playerName);
  }

  InitStrings(playerName) {
    this.kAbility = Object.freeze({
      DragonKick: 'Dragon Kick', // 0x4a
      TwinSnakes: 'Twin Snakes', // 0x65
      Demolish: 'Demolish', // 0x42
      Verstone: 'Verstone', // 0x1d57
      Verfire: 'Verfire', // 0x1d56
      Veraero: 'Veraero', // 0x1d53
      Verthunder: 'Verthunder', // 0x1d51
      Verholy: 'Verholy', // 0x1d66
      Verflare: 'Verflare', // 0x1d65
      Jolt2: 'Jolt II', // 0x1d64
      Jolt: 'Jolt', // 0x1d4f
      Impact: 'Impact', // 0x1d62
      Scatter: 'Scatter', // 0x1d55
      Vercure: 'Vercure', // 0x1d5a
      Verraise: 'Verraise', // 0x1d63
      Riposte: 'Riposte', // 0x1d50
      Zwerchhau: 'Zwerchhau', // 0x1d58
      Redoublement: 'Redoublement', // 0x1d5c
      Moulinet: 'Moulinet', // 0x1d59
      EnchantedRiposte: 'Enchanted Riposte', // 0x1d67
      EnchantedZwerchhau: 'Enchanted Zwerchhau', // 0x1d68
      EnchantedRedoublement: 'Enchanted Redoublement', // 0x1d69
      EnchantedMoulinet: 'Enchanted Moulinet', // 0x1d6a
      Tomahawk: 'Tomahawk', // 0x2e
      Overpower: 'Overpower', // 0x29
      HeavySwing: 'Heavy Swing', // 0x1f
      SkullSunder: 'Skull Sunder', // 0x23
      ButchersBlock: "Butcher's Block", // 0x2f
      Maim: 'Maim', // 0x25
      StormsEye: "Storm's Eye", // 0x2d
      StormsPath: "Storm's Path", // 0x2a
      TrickAttack: 'Trick Attack', // 0x8d2
      Embolden: 'Embolden', // 0x1d60
      Aetherflow: 'Aetherflow', // 0xa6
      ChainStrategem: 'Chain Strategem', // 0x1d0c
      Hypercharge: 'Hypercharge', // 0xb45
    });

    this.kZone = Object.freeze({
      O1S: /Deltascape V1\.0 \(Savage\)/,
      O2S: /Deltascape V2\.0 \(Savage\)/,
      O3S: /Deltascape V3\.0 \(Savage\)/,
      O4S: /Deltascape V4\.0 \(Savage\)/,
      UCU: /The Unending Coil Of Bahamut \(Ultimate\)/,
    });

    this.kEffect = Object.freeze({
      BluntResistDown: 'Blunt Resistance Down', // 0x23d, 0x335, 0x3a3
      VerstoneReady: 'Verstone Ready', // 0x4d3
      VerfireReady: 'Verfire Ready', // 0x4d2
      Impactful: 'Impactful', // 0x557
      FurtherRuin: 'Further Ruin', // 0x4bc
      Aetherflow: 'Aetherflow', // 0x130
      WellFed: 'Well Fed', // 0x30
      OpoOpoForm: 'Opo-Opo Form', // 0x6b
      RaptorForm: 'Raptor Form', // 0x6c
      CoeurlForm: 'Coeurl Form', // 0x6d
      PerfectBalance: 'Perfect Balance', // 0x6e
      Medicated: 'Medicated', // tbc
      BattleLitany: 'Battle Litany', // 0x312
      Embolden: 'Embolden', // 0x4d7
      Balance: 'The Balance', // 0x53a
      Hypercharge: 'Hypercharge', // 0x2b0
      LeftEye: 'Left Eye', // 0x4a0
      RightEye: 'Right Eye', // 0x49f
      Brotherhood: 'Brotherhood', // 0x49e
      Devotion: 'Devotion', // 0x4bd
      FoeRequiem: 'Foe Requiem', // up 0x8b, down 0x8c
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