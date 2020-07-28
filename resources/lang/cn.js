'use strict';

class CactbotLanguageCn extends CactbotLanguage {
  constructor() {
    super('cn');
  }

  InitStrings() {
    this.kUIStrings = Object.freeze({
      // jobs: text on the pull countdown.
      Pull: '开怪',
    });

    this.kPetNames = Object.freeze([
      // Pulled from http://cafemaker.wakingsands.com/Pet?pretty=true
      '绿宝石兽',
      '黄宝石兽',
      '伊弗利特之灵',
      '泰坦之灵',
      '迦楼罗之灵',
      '朝日小仙女',
      '夕月小仙女',
      '车式浮空炮塔',
      '象式浮空炮塔',
      '亚灵神巴哈姆特',
      '亚灵神不死鸟',
      '炽天使',
      '月长宝石兽',
      '英雄的掠影',
      '后式自走人偶',
      '分身',
    ]);

    this.countdownStartRegex = function() {
      return Regexes.gameLog({
        capture: true,
        line: '距离战斗开始还有(?<time>\\y{Float})秒！',
      });
    };
    this.countdownEngageRegex = function() {
      return Regexes.gameLog({
        capture: true,
        line: '战斗开始！',
      });
    };
    this.countdownCancelRegex = function() {
      return Regexes.gameLog({
        capture: true,
        line: '(?<name>\\y{Name})取消了战斗开始倒计时。',
      });
    };
    this.areaSealRegex = function() {
      return Regexes.gameLog({
        capture: true,
        line: '距(?<name>\\y{Name})被封锁还有(?<time>\\y{Float})秒.*?',
      });
    };
    this.areaUnsealRegex = function() {
      return Regexes.gameLog({
        capture: true,
        line: '(?<name>\\y{Name})的封锁解除了.*?',
      });
    };
  }
}

UserConfig.registerLanguage('cn', function() {
  gLang = new CactbotLanguageCn();
});
