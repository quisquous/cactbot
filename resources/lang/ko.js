'use strict';

class CactbotLanguageKo extends CactbotLanguage {
  constructor(playerName) {
    super('ko', playerName);
  }

  InitStrings(playerName) {
    this.kEffect = Object.freeze({
      BluntResistDown: '타격 저항 감소', // 0x23d, 0x335, 0x3a3
      VerstoneReady: '버스톤 시전 가능', // 0x4d3
      VerfireReady: '버파이어 시전 가능', // 0x4d2
      Impactful: '임팩트 시전 가능', // 0x557
      FurtherRuin: '루인 강화', // 0x4bc
      Aetherflow: '에테르 순환', // 0x130
      WellFed: '식사', // 0x30
      OpoOpoForm: '원숭이 품새', // 0x6b
      RaptorForm: '용 품새', // 0x6c
      CoeurlForm: '호랑이 품새', // 0x6d
      PerfectBalance: '진각', // 0x6e
      Medicated: '강화약', // tbc
      BattleLitany: '전투 기도', // 0x312
      Embolden: '성원', // 0x4d7
      Balance: '아제마의 균형', // 0x53a
      Hypercharge: '과충전', // 0x2b0
      LeftEye: '용의 왼쪽 눈', // 0x4a0
      RightEye: '용의 오른쪽 눈', // 0x49f
      Brotherhood: '도원결의', // 0x49e
      Devotion: '에기의 가호', // 0x4bd
      FoeRequiem: '마인의 진혼곡', // up 0x8b, down 0x8c

      // TODO: translate, add ids
      Petrification: 'Petrification',
      BeyondDeath: 'Beyond Death',
      Burns: 'Burns',
      Sludge: 'Sludge',
      Doom: 'Doom',
    });

    this.kUIStrings = Object.freeze({
      // jobs: text on the pull countdown.
      Pull: 'Pull',
    });

    // TODO: Countdowns
    this.countdownStartRegex = function() {
      return Regexes.Parse(/Battle commencing in (\y{Float}) seconds!/);
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

UserConfig.registerLanguage('ko', function() {
  gLang = new CactbotLanguageKo();
});
