'use strict';

class CactbotLanguageCn extends CactbotLanguage {
  constructor() {
    super('cn');
  }

  InitStrings() {
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
      Arrow: '放浪神之箭', // 0x75c
      Balance: '太阳神之衡', // 0x53a
      Bole: '世界树之干', // 0x75b
      Ewer: '河流神之瓶', // 0x75e
      Spear: '战争神之枪', // 0x75d
      Spire: '建筑神之塔', // 0x75f
      LadyOfCrowns: '王冠之贵妇', // 0x755
      LordOfCrowns: '王冠之领主', // 0x754
      Hypercharge: '超荷', // 0x2b0
      LeftEye: '巨龙左眼', // 0x4a0
      RightEye: '巨龙右眼', // 0x49f
      Brotherhood: '义结金兰：斗气', // 0x49e
      Devotion: '灵护', // 0x4bd
      FoeRequiem: '魔人的安魂曲', // up 0x8b, down 0x8c
      LeadenFist: '连击效果提高',
      StormsEye: '暴风碎',
      Devilment: '进攻之探戈',
      StandardFinish: '标准舞步结束',
      TechnicalFinish: '技巧舞步结束',
      Thundercloud: '雷云',
      Firestarter: '火苗',
      BattleVoice: '战斗之声',
      Divination: '占卜',
      ArmysMuse: '军神的加护',
      ArmysEthos: '军神的契约',
      PresenceOfMind: '神速咏唱',
      Shifu: '士风',
      CircleOfPower: '魔纹环',
      AstralAttenuation: '星极性耐性降低',
      UmbralAttenuation: '灵极性耐性降低',
      PhysicalAttenuation: '物理受伤加重',

      SurgeProtection: '避雷',

      Paralysis: '麻痹',
      Petrification: '石化',
      BeyondDeath: '超越死亡',
      Burns: '火伤',
      Sludge: '污泥',
      Doom: '死亡宣告',
      StoneCurse: '石化的诅咒',
      Imp: '河童',
      Toad: '蛙变',
      FoolsTumble: '坠落幻觉', // 0x183
      Dropsy: '水毒',
      Throttle: '窒息',
      StaticCondensation: '蓄电',
      DamageDown: '伤害降低',
      AstralEffect: 'Astral Effect',
      UmbralEffect: 'Umbral Effect',
      Stun: '眩晕',
      ThinIce: '冰面',
      DeepFreeze: '冻结',

      // UWU
      Windburn: '裂伤',
    });

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
