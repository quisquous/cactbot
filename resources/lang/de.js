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
