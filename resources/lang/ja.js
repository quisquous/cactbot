'use strict';

class CactbotLanguageJa extends CactbotLanguage {
  constructor() {
    super('ja');
  }

  InitStrings() {
    this.countdownStartRegex = function() {
      return Regexes.gameLog({
        capture: true,
        line: '戦闘開始まで(?<time>\\y{Float})秒！',
      });
    };
    this.countdownEngageRegex = function() {
      return Regexes.gameLog({
        capture: true,
        line: '戦闘開始！',
      });
    };
    this.countdownCancelRegex = function() {
      return Regexes.gameLog({
        capture: true,
        line: '(?<name>\\y{Name})により、戦闘開始カウントがキャンセルされました。',
      });
    };
    this.areaSealRegex = function() {
      return Regexes.gameLog({
        capture: true,
        line: '(?<name>\\y{Name})の封鎖まであと(?<time>\\y{Float})秒.*?',
      });
    };
    this.areaUnsealRegex = function() {
      return Regexes.gameLog({
        capture: true,
        line: '(?<name>\\y{Name})の封鎖が解かれた……',
      });
    };
  }
}

UserConfig.registerLanguage('ja', function() {
  gLang = new CactbotLanguageJa();
});
