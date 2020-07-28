'use strict';

class CactbotLanguageKo extends CactbotLanguage {
  constructor() {
    super('ko');
  }

  InitStrings() {
    this.kUIStrings = Object.freeze({
      // jobs: text on the pull countdown.
      Pull: '풀링',
    });

    this.countdownStartRegex = function() {
      return Regexes.gameLog({
        capture: true,
        line: '전투 시작 (?<time>\\y{Float})초 전!',
      });
    };
    this.countdownEngageRegex = function() {
      return Regexes.gameLog({
        capture: true,
        line: '전투 시작!',
      });
    };
    this.countdownCancelRegex = function() {
      return Regexes.gameLog({
        capture: true,
        line: '(?<name>\\y{Name}) 님이 초읽기를 취소했습니다\\.',
      });
    };
    this.areaSealRegex = function() {
      return Regexes.gameLog({
        capture: true,
        line: '(?<time>\\y{Float})초 후에 (?<name>\\y{Name})(이|가) 봉쇄됩니다\\.',
      });
    };
    this.areaUnsealRegex = function() {
      return Regexes.gameLog({
        capture: true,
        line: '(?<name>\\y{Name})의 봉쇄가 해제되었습니다\\.',
      });
    };
  }
}

UserConfig.registerLanguage('ko', function() {
  gLang = new CactbotLanguageKo();
});
