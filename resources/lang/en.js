'use strict';

class CactbotLanguageEn extends CactbotLanguage {
  constructor(playerName) {
    super('en', playerName);
  }

  InitStrings(playerName) {
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

      // TODO: add ids
      Petrification: 'Petrification',
      BeyondDeath: 'Beyond Death',
      Burns: 'Burns',
      Sludge: 'Sludge',
      Doom: 'Doom',

      // UWU
      Windburn: 'Windburn',
    });

    this.kUIStrings = Object.freeze({
      // jobs: text on the pull countdown.
      Pull: 'Pull',
    });

    this.countdownStartRegex = function() {
      return Regexes.Parse(/Battle commencing in (\y{Float}) seconds!/);
    };
    this.countdownEngageRegex = function() {
      return /:Engage!/;
    };
    this.countdownCancelRegex = function() {
      return /Countdown canceled by /;
    };
    this.areaSealRegex = function() {
      return /:(.*) will be sealed off in /;
    };
    this.areaUnsealRegex = function() {
      return /:(.*) is no longer sealed/;
    };
  }
}

UserConfig.registerLanguage('en', function() {
  gLang = new CactbotLanguageEn();
});
