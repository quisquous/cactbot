"use strict";

var gLang = null;

class CactbotLanguage {
  constructor(lang) {
    this.lang = lang;
    this.playerName = null;
    this.kAbility = Object.freeze({
      DragonKick: '4A',
      TwinSnakes: '3D',
      Demolish: '42',
      Verstone: '1D57',
      Verfire: '1D56',
      Veraero: '1D53',
      Verthunder: '1D51',
      Verholy: '1D66',
      Verflare: '1D65',
      Jolt2: '1D64',
      Jolt: '1D4F',
      Impact: '1D62',
      Scatter: '1D55',
      Vercure: '1D5A',
      Verraise: '1D63',
      Riposte: '1D50',
      Zwerchhau: '1D58',
      Redoublement: '1D5C',
      Moulinet: '1D59',
      EnchantedRiposte: '1D67',
      EnchantedZwerchhau: '1D68',
      EnchantedRedoublement: '1D69',
      EnchantedMoulinet: '1D6A',
      Tomahawk: '2E',
      Overpower: '29',
      HeavySwing: '1F',
      SkullSunder: '23',
      ButchersBlock: '2F',
      Maim: '25',
      StormsEye: '2D',
      StormsPath: '2A',
      TrickAttack: '8D2',
      Embolden: '1D60',
      Aetherflow: 'A6',
      ChainStrategem: '1D0C',
      Hypercharge: 'B45',
    });
  }

  InitStrings(playerName) {
    console.error('Derived language class must implement InitStrings');
  }

  OnPlayerNameChange(playerName) {
    this.playerName = playerName;
    this.InitStrings(playerName);
  }

  ValidateEffect(effectName) {
    var validEffects = Object.keys(this.kEffect).map((function(k){return this.kEffect[k]}).bind(this));
    if (!effectName || validEffects.indexOf(effectName) < 0)
      console.error('Invalid effect: ' + effectName);
  }

  ValidateAbility(abilityId) {
    var validAbilities = Object.keys(this.kAbility).map((function(k){return this.kAbility[k]}).bind(this));
    if (!abilityId || validAbilities.indexOf(abilityId) < 0)
      console.error('Invalid ability: ' + abilityId);
  }

  // Due to this bug: https://github.com/ravahn/FFXIV_ACT_Plugin/issues/100
  // We can not look for log messages from FFXIV "You use X" here. Instead we
  // look for the actual ability usage provided by the XIV plugin.
  // Also, the networked parse info is given much quicker than the lines from the game.
  youUseAbilityRegex(ids) {
    return Regexes.Parse(' 1[56]:\\y{ObjectId}:' + this.playerName + ':' + Regexes.AnyOf(ids) + ':');
  };

  youStartUsingRegex(ids) {
    return Regexes.Parse(' 14:' + Regexes.AnyOf(ids) + ':' + this.playerName + ' starts using ');
  };

  youGainEffectRegex() {
    var effects = [];
    for (var i = 0; i < arguments.length; ++i) {
      var effect = arguments[i];
      this.ValidateEffect(effect);
      effects.push(effect);
    }
    return Regexes.Parse(' 1A:' + this.playerName + ' gains the effect of ' + Regexes.AnyOf(effects) + ' from .* for (\\y{Float}) Seconds\.');
  };

  youLoseEffectRegex() {
    var effects = [];
    for (var i = 0; i < arguments.length; ++i) {
      var effect = arguments[i];
      this.ValidateEffect(effect);
      effects.push(effect);
    }
    return Regexes.Parse(' 1E:' + this.playerName + ' loses the effect of ' + Regexes.AnyOf(effects) + ' from .*\.');
  };

  abilityRegex(abilityId, attacker, target, flags) {
    this.ValidateAbility(abilityId);
    if (!attacker)
      attacker = '[^:]*';
    // type:attackerId:attackerName:abilityId:abilityName:targetId:targetName:flags:
    var r = ' 1[56]:\\y{ObjectId}:' + attacker + ':' + abilityId + ':';
    if (target || flags) {
      if (!target)
        target = '[^:]*';
      if (!flags)
        flags = '[^:]*';
      r += '[^:]*:\\y{ObjectId}:' + target + ':' + flags + ':';
    }
    return Regexes.Parse(r);
  };

  gainsEffectRegex(effect, target, attacker) {
    this.ValidateEffect(effect);
    if (!target)
      target = '[^:]*';
    if (!attacker)
      attacker = '[^:]*';
    return Regexes.Parse(' 1A:' + target + ' gains the effect of ' + effect + ' from ' + attacker + ' for (\\y{Float}) Seconds\.');
  };

  losesEffectRegex(effect, target, attacker) {
    this.ValidateEffect(effect);
    if (!target)
      target = '[^:]*';
    if (!attacker)
      attacker = '[^:]*';
    return Regexes.Parse(' 1E:' + target + ' loses the effect of ' + effect + ' from ' + attacker + '.*\.');
  };
};
