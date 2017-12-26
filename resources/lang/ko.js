"use strict";

class CactbotLanguageKo extends CactbotLanguage {
  constructor(playerName) {
    super('ko', playerName);
  }

  InitStrings(playerName) {
    this.kAbility = Object.freeze({
      DragonKick: 'Dragon Kick',
      TwinSnakes: 'Twin Snakes',
      Demolish: 'Demolish',
      Verstone: '버스톤',
      Verfire: '버파이어',
      Veraero: '버에어로',
      Verthunder: '버선더',
      Verholy: '버홀리',
      Verflare: '버플레어',
      Jolt2: '졸트라',
      Jolt: '졸트',
      Impact: 'Impact',
      Scatter: 'Scatter',
      Vercure: '버케알',
      Verraise: '버라이즈',
      Riposte: '리포스트',
      Zwerchhau: '츠베르크하우',
      Redoublement: '르두블망',
      Moulinet: '물리네',
      EnchantedRiposte: '인리포스트',
      EnchantedZwerchhau: '인츠베르크하우',
      EnchantedRedoublement: '인르두블망',
      EnchantedMoulinet: '인물리네',
      Tomahawk: 'Tomahawk',
      Overpower: 'Overpower',
      HeavySwing: 'Heavy Swing',
      SkullSunder: 'Skull Sunder',
      ButchersBlock: "Butcher's Block",
      Maim: 'Maim',
      StormsEye: "Storm's Eye",
      StormsPath: "Storm's Path",
      TrickAttack: '속임수 공격',
      Embolden: 'Embolden',
      Aetherflow: '에테르 순환',
      ChainStrategem: 'Chain Strategem',
      Hypercharge: '과충전',
    });

    this.kZone = Object.freeze({
      O1S: /Deltascape V1\.0 \(Savage\)/, // NOT RELEASED YET
      O2S: /Deltascape V2\.0 \(Savage\)/,
      O3S: /Deltascape V3\.0 \(Savage\)/,
      O4S: /Deltascape V4\.0 \(Savage\)/,
      UCU: /The Unending Coil Of Bahamut \(Ultimate\)/,
    });

    this.kEffect = Object.freeze({
      BluntResistDown: 'Blunt Resistance Down',
      VerstoneReady: '버스톤 시전 가능',
      VerfireReady: '버파이어 시전 가능',
      Impactful: 'Impactful',
      FurtherRuin: 'Further Ruin',
      Aetherflow: 'Aetherflow',
      WellFed: 'Well Fed',
      OpoOpoForm: '원숭이 품새',
      RaptorForm: '용 품새', // to be checked
      CoeurlForm: '호랑이 품새',
      PerfectBalance: 'Perfect Balance',
      Medicated: 'Medicated',
      BattleLitany: 'Battle Litany',
      Embolden: 'Embolden',
      Balance: '아제마의 균형',
      Hypercharge: '과충전',
      LeftEye: '용의 왼쪽 눈',
      RightEye: '용의 오른쪽 눈',
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
  if (Options && Options.Language == 'ko') {
    if (!gLang)
      gLang = new CactbotLanguageEn();
    if (gLang.playerName != e.detail.name)
      gLang.OnPlayerNameChange(e.detail.name);
  }
});
