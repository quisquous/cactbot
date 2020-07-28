'use strict';

class CactbotLanguageEn extends CactbotLanguage {
  constructor() {
    super('en');
  }

  InitStrings() {
    this.countdownStartRegex = function() {
      return Regexes.gameLog({
        capture: true,
        line: 'Battle commencing in (?<time>\\y{Float}) seconds!.*?',
      });
    };
    this.countdownEngageRegex = function() {
      return Regexes.gameLog({
        capture: true,
        line: 'Engage!',
      });
    };
    this.countdownCancelRegex = function() {
      return Regexes.gameLog({
        capture: true,
        line: 'Countdown canceled by (?<name>\\y{Name}).*?',
      });
    };
    this.areaSealRegex = function() {
      return Regexes.gameLog({
        capture: true,
        line: '(?<name>\\y{Name}) will be sealed off in (?<time>\\y{Float}) seconds!',
      });
    };
    this.areaUnsealRegex = function() {
      return Regexes.gameLog({
        capture: true,
        line: '(?<name>\\y{Name}) is no longer sealed.*?',
      });
    };
  }
}

UserConfig.registerLanguage('en', function() {
  gLang = new CactbotLanguageEn();
});
