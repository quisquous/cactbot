'use strict';

class CactbotLanguageDe extends CactbotLanguage {
  constructor(playerName) {
    super('de', playerName);
  }

  InitStrings(playerName) {
    this.kEffect = Object.freeze({
      BluntResistDown: 'Schlagresistenz -', // 0x23d, 0x335, 0x3a3
      VerstoneReady: 'Erzstein-bereit', // 0x4d3
      VerfireReady: 'Erzfeuer-bereit', // 0x4d2
      Impactful: 'Impakt-bereit', // 0x557
      FurtherRuin: 'Verbessertes Ruinra', // 0x4bc
      Aetherflow: 'Ätherfluss', // 0x130
      WellFed: 'Gut Gesättigt', // 0x30
      OpoOpoForm: 'Opo-Opo-Form', // 0x6b
      RaptorForm: 'Raptor-Form', // 0x6c
      CoeurlForm: 'Coeurl-Form', // 0x6d
      PerfectBalance: 'Improvisation', // 0x6e
      Medicated: 'Stärkung', // tbc
      BattleLitany: 'Litanei Der Schlacht', // 0x312
      Embolden: 'Ermutigen', // 0x4d7
      Arrow: 'Kraft Des Pfeils', // 0x75c
      Balance: 'Kraft Der Waage', // 0x75a
      Bole: 'Kraft Der Eiche', // 0x75b
      Ewer: 'Kraft Des Krugs', // 0x75e
      Spear: 'Kraft Des Speers', // 0x75d
      Spire: 'Kraft Des Turms', // 0x75f
      LadyOfCrowns: 'Königin Der Kronen', // 0x755
      LordOfCrowns: 'König Der Kronen', // 0x754
      Hypercharge: 'Hyperladung', // 0x2b0
      LeftEye: 'Linkes Drachenauge', // 0x4a0
      RightEye: 'Rechtes Drachenauge', // 0x49f
      Brotherhood: 'Bruderschaft', // 0x49e
      Devotion: 'Hingabe', // 0x4bd
      FoeRequiem: 'Requiem Der Feinde', // up 0x8b, down 0x8c
      LeadenFist: 'Verbesserter Schlag auf Schlag',
      Devilment: 'Todestango',
      TechnicalFinish: 'Komplexes Finale',
      StandardFinish: 'Einfaches Finale',
      Thundercloud: 'Blitz +',
      Firestarter: 'Feuga +',
      BattleVoice: 'Ode an die Seele',

      Petrification: 'Stein',
      BeyondDeath: 'Jenseits Des Jenseits',
      Burns: 'Brandwunde',
      Sludge: 'Schlamm',
      Doom: 'Verhängnis',
      StoneCurse: 'Steinfluch',
      Imp: 'Flusskobold',
      Toad: 'Frosch',
      FoolsTumble: 'Trügerischer Sturz', // 0x183
    });

    this.kUIStrings = Object.freeze({
      // jobs: text on the pull countdown.
      Pull: 'Pull',
    });

    this.countdownStartRegex = function() {
      return Regexes.parse(/Noch (\y{Float}) Sekunden bis Kampfbeginn!/);
    };
    this.countdownEngageRegex = function() {
      return /:Start!/;
    };
    this.countdownCancelRegex = function() {
      return /:(\y{Name}) hat den Countdown abgebrochen/;
    };
    this.areaSealRegex = function() {
      return /:Noch (\y{float}) Sekunden bis sich der Zugang zu (.*) schließt/;
    };
    this.areaUnsealRegex = function() {
      return /:Der Zugang zu (.*) öffnet sich erneut/;
    };
  }
}

UserConfig.registerLanguage('de', function() {
  gLang = new CactbotLanguageDe();
});
