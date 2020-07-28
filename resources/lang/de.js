'use strict';

class CactbotLanguageDe extends CactbotLanguage {
  constructor() {
    super('de');
  }

  InitStrings() {
    this.kUIStrings = Object.freeze({
      // jobs: text on the pull countdown.
      Pull: 'Pull',
    });

    this.kPetNames = Object.freeze([
      // Pulled from https://xivapi.com/Pet?pretty=true&language=de
      'Smaragd-Karfunkel',
      'Topas-Karfunkel',
      'Ifrit-Egi',
      'Titan-Egi',
      'Garuda-Egi',
      'Eos',
      'Selene',
      'Selbstschuss-Gyrocopter TURM',
      'Selbstschuss-Gyrocopter LÄUFER',
      'Demi-Bahamut',
      'Demi-Phönix',
      'Seraph',
      'Mondstein-Karfunkel',
      'Schattenschemen',
      'Automaton DAME',
      'Gedoppeltes Ich',
    ]);

    this.countdownStartRegex = function() {
      return Regexes.gameLog({
        capture: true,
        line: 'Noch (?<time>\\y{Float}) Sekunden bis Kampfbeginn!',
      });
    };
    this.countdownEngageRegex = function() {
      return Regexes.gameLog({
        capture: true,
        line: 'Start!',
      });
    };
    this.countdownCancelRegex = function() {
      return Regexes.gameLog({
        capture: true,
        line: '(?<name>\\y{Name}) hat den Countdown abgebrochen.*?',
      });
    };
    this.areaSealRegex = function() {
      return Regexes.gameLog({
        capture: true,
        line: 'Noch (?<time>\\y{Float}) Sekunden, bis sich (?<name>\\y{Name}) schließt.*?',
      });
    };
    this.areaUnsealRegex = function() {
      return Regexes.gameLog({
        capture: true,
        line: '(?<name>\\y{Name}) öffnet sich erneut.*?',
      });
    };
  }
}

UserConfig.registerLanguage('de', function() {
  gLang = new CactbotLanguageDe();
});
