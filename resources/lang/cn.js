'use strict';

class CactbotLanguageCn extends CactbotLanguage {
  constructor(playerName) {
    super('cn', playerName);
  }

  InitStrings(playerName) {
    this.kEffect = Object.freeze({
      BluntResistDown: '打击耐性降低', // 0x23d, 0x335, 0x3a3
      VerstoneReady: '赤飞石预备', // 0x4d3
      VerfireReady: '赤火炎预备', // 0x4d2
      Impactful: '冲击预备', // 0x557
      FurtherRuin: '毁坏强化', // 0x4bc
      Aetherflow: '以太超流', // 0x130
      WellFed: '进食', // 0x30
      OpoOpoForm: '魔猿形', // 0x6b
      RaptorForm: '盗龙形', // 0x6c
      CoeurlForm: '猛豹形', // 0x6d
      PerfectBalance: '震脚', // 0x6e
      Medicated: '强化药', // tbc
      BattleLitany: '战斗连祷', // 0x312
      Embolden: '鼓励', // 0x4d7
      Arrow: 'The Arrow', // 0x75c
      Balance: '太阳神之衡', // 0x53a
      Bole: 'The Bole', // 0x75b
      Ewer: 'The Ewer', // 0x75e
      Spear: 'The Spear', // 0x75d
      Spire: 'The Spire', // 0x75f
      LadyOfCrowns: 'Lady Of Crowns', // 0x755
      LordOfCrowns: 'Lord Of Crowns', // 0x754
      Hypercharge: '超荷', // 0x2b0
      LeftEye: '巨龙左眼', // 0x4a0
      RightEye: '巨龙右眼', // 0x49f
      Brotherhood: '义结金兰：斗气', // 0x49e
      Devotion: '灵护', // 0x4bd
      FoeRequiem: '魔人的安魂曲', // up 0x8b, down 0x8c
      LeadenFist: 'Leaden Fist',
      StormsEye: 'Storm\'s Eye',
      Devilment: 'Devilment',
      StandardFinish: 'Standard Finish',
      TechnicalFinish: 'Technical Finish',
      Thundercloud: 'Thundercloud',
      Firestarter: 'Firestarter',
      BattleVoice: 'Battle Voice',

      Petrification: '石化',
      BeyondDeath: '超越死亡',
      Burns: '火伤',
      Sludge: '污泥',
      Doom: '死亡宣告',
      StoneCurse: 'Stone Curse',
      Imp: 'Imp',
      Toad: 'Toad',
      FoolsTumble: 'Fool\'s Tumble', // 0x183

      // UWU
      Windburn: '裂伤',
    });

    this.kUIStrings = Object.freeze({
      // jobs: text on the pull countdown.
      Pull: '开怪',
    });

    this.countdownStartRegex = function() {
      return Regexes.Parse(/距离战斗开始还有(\y{Float})秒！/);
    };
    this.countdownEngageRegex = function() {
      return /:战斗开始！/;
    };
    this.countdownCancelRegex = function() {
      return /:(\y{Name})取消了战斗开始倒计时。/;
    };
    this.areaSealRegex = function() {
      return /:距(.*)被封锁还有\y{Float}秒/;
    };
    this.areaUnsealRegex = function() {
      return /:(.*)的封锁解除了/;
    };
  }
}

UserConfig.registerLanguage('cn', function() {
  gLang = new CactbotLanguageCn();
});
