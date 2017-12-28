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
