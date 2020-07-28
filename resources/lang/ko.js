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

    this.kPetNames = Object.freeze([
      // Pulled from https://github.com/Ra-Workspace/ffxiv-datamining-ko/blob/master/csv/Pet.csv
      '카벙클 에메랄드',
      '카벙클 토파즈',
      '이프리트 에기',
      '타이탄 에기',
      '가루다 에기',
      '요정 에오스',
      '요정 셀레네',
      '자동포탑 룩',
      '자동포탑 비숍',
      '데미바하무트',
      '데미피닉스',
      '세라핌',
      '카벙클 문스톤',
      '영웅의 환영',
      '자동인형 퀸',
      '분신',
    ]);

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
