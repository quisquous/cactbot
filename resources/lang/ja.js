'use strict';

class CactbotLanguageJa extends CactbotLanguage {
  constructor(playerName) {
    super('ja', playerName);
  }

  InitStrings(playerName) {
    this.kEffect = Object.freeze({
      BluntResistDown: '打属性耐性低下', // 0x23d, 0x335, 0x3a3
      VerstoneReady: 'ヴァルストーン効果アップ', // 0x4d3
      VerfireReady: 'ヴァルファイア効果アップ', // 0x4d2
      Impactful: 'インパクト詠唱可', // 0x557
      FurtherRuin: 'ルインラ強化', // 0x4bc
      Aetherflow: 'エーテルフロー', // 0x130
      WellFed: '食事', // 0x30
      OpoOpoForm: '壱の型：魔猿', // 0x6b
      RaptorForm: '弐の型：走竜', // 0x6c
      CoeurlForm: '参の型：猛虎', // 0x6d
      PerfectBalance: '踏鳴', // 0x6e
      Medicated: '強化薬', // tbc
      BattleLitany: 'バトルリタニー', // 0x312
      Embolden: 'エンボルデン', // 0x4d7
      Balance: 'アーゼマの均衡', // 0x53a
      Hypercharge: 'ハイパーチャージ', // 0x2b0
      LeftEye: '竜の左眼', // 0x4a0
      RightEye: '竜の右眼', // 0x49f
      Brotherhood: '桃園結義：攻撃', // 0x49e
      Devotion: 'エギの加護', // 0x4bd
      FoeRequiem: '魔人のレクイエム', // up 0x8b, down 0x8c

      // TODO: add ids
      Petrification: '石化',
      BeyondDeath: '死の超越',
      Burns: '火傷',
      Sludge: '汚泥',
      Doom: '死の宣告',

      // UWU
      Windburn: '裂傷',
    });

    this.kUIStrings = Object.freeze({
      // jobs: text on the pull countdown.
      Pull: 'Pull',
    });

    this.countdownStartRegex = function() {
      return Regexes.Parse(/戦闘開始まで(\y{Float})秒！/);
    };
    this.countdownEngageRegex = function() {
      return /:戦闘開始！/;
    };
    this.countdownCancelRegex = function() {
      return /:(\y{Name})により、戦闘開始カウントがキャンセルされました。/;
    };
    this.areaSealRegex = function() {
      return /:(.*)の封鎖まであと(\y{float})秒/;
    };
    this.areaUnsealRegex = function() {
      return /:(.*)の封鎖が解かれた……/;
    };
  }
}

UserConfig.registerLanguage('ja', function() {
  gLang = new CactbotLanguageJa();
});
