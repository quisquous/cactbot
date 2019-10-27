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
      Arrow: 'The Arrow', // 0x75c
      Balance: 'The Balance', // 0x75a
      Bole: 'The Bole', // 0x75b
      Ewer: 'The Ewer', // 0x75e
      Spear: 'The Spear', // 0x75d
      Spire: 'The Spire', // 0x75f
      LadyOfCrowns: 'Lady Of Crowns', // 0x755
      LordOfCrowns: 'Lord Of Crowns', // 0x754
      Hypercharge: 'Hypercharge', // 0x2b0
      LeftEye: 'Left Eye', // 0x4a0
      RightEye: 'Right Eye', // 0x49f
      Brotherhood: 'Brotherhood', // 0x49e
      Devotion: 'Devotion', // 0x4bd
      FoeRequiem: 'Foe Requiem', // up 0x8b, down 0x8c
      LeadenFist: 'Leaden Fist',
      StormsEye: 'Storm\'s Eye',
      Devilment: 'Devilment',
      StandardFinish: 'Standard Finish',
      TechnicalFinish: 'Technical Finish',
      Thundercloud: 'Thundercloud',
      Firestarter: 'Firestarter',
      BattleVoice: 'Battle Voice',

      Petrification: 'Petrification',
      BeyondDeath: 'Beyond Death',
      Burns: 'Burns',
      Sludge: 'Sludge',
      Doom: 'Doom',
      StoneCurse: 'Stone Curse',
      Imp: 'Imp',
      Toad: 'Toad',
      FoolsTumble: 'Fool\'s Tumble', // 0x183

      // UWU
      Windburn: 'Windburn',
    });

    this.kUIStrings = Object.freeze({
      // jobs: text on the pull countdown.
      Pull: 'Pull',
    });

    this.countdownStartRegex = function() {
      return Regexes.parse(/Battle commencing in (\y{Float}) seconds!/);
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
