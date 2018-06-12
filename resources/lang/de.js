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
      Balance: 'Waage', // 0x53a
      Hypercharge: 'Hyperladung', // 0x2b0
      LeftEye: 'Linkes Drachenauge', // 0x4a0
      RightEye: 'Rechtes Drachenauge', // 0x49f
      Brotherhood: 'Bruderschaft', // 0x49e
      Devotion: 'Hingabe', // 0x4bd
      FoeRequiem: 'Requiem Der Feinde', // up 0x8b, down 0x8c

      // TODO: add ids
      Petrification: 'Stein',
      BeyondDeath: 'Jenseits Des Jenseits',
      Burns: 'Brandwunde',
      Sludge: 'Schlamm',
      Doom: 'Verhängnis',
    });

    this.kUIStrings = Object.freeze({
      // jobs: text on the pull countdown.
      Pull: 'Pull',
    });

    this.countdownStartRegex = function() {
      return Regexes.Parse(/Noch (\y{Float}) Sekunden bis Kampfbeginn!/);
    };
    this.countdownEngageRegex = function() {
      return /:Start!/;
    };
    this.countdownCancelRegex = function() {
      return /:(\y{Name}) hat den Countdown abgebrochen/;
    };
    this.areaSealRegex = function() {
      return /:Noch (\y{float}) Sekunden bis sich der Zugang zu(.*) schließt/;
    };
    this.areaUnsealRegex = function() {
      return /:Der Zugang zu(.*) öffnet sich erneut/;
    };
  }
}

UserConfig.registerLanguage('de', function() {
  gLang = new CactbotLanguageDe();
});
