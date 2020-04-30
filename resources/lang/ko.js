'use strict';

class CactbotLanguageKo extends CactbotLanguage {
  constructor() {
    super('ko');
  }

  InitStrings() {
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
      Arrow: '오쉬온의 화살', // 0x75c
      Balance: '아제마의 균형', // 0x75a
      Bole: '세계수의 줄기', // 0x75b
      Ewer: '살리아크의 물병', // 0x75e
      Spear: '할로네의 창', // 0x75d
      Spire: '비레고의 탑', // 0x75f
      LadyOfCrowns: '여왕의 날개', // 0x755
      LordOfCrowns: '왕의 검', // 0x754
      Hypercharge: '과충전', // 0x2b0
      LeftEye: '용의 왼눈', // 0x4a0
      RightEye: '용의 오른눈', // 0x49f
      Brotherhood: '도원결의: 투기', // 0x49e
      Devotion: '에기의 가호', // 0x4bd
      FoeRequiem: '마인의 진혼곡', // up 0x8b, down 0x8c
      LeadenFist: '연격 효과 향상',
      StormsEye: '폭풍의 눈',
      Devilment: '공세의 탱고',
      TechnicalFinish: '기교 마무리',
      StandardFinish: '정석 마무리',
      Thundercloud: '선더 계열 효과 향상',
      Firestarter: '파이가 효과 향상',
      BattleVoice: '전장의 노래',
      Divination: '점복',
      ArmysMuse: '군신의 가호',
      ArmysEthos: '군신의 계약',
      PresenceOfMind: '쾌속의 마법',
      Shifu: '사풍',
      CircleOfPower: '흑마법 문양: 효과',
      AstralAttenuation: 'Astral Attenuation', // FIXME
      UmbralAttenuation: 'Umbral Attenuation', // FIXME
      PhysicalAttenuation: 'Physical Attenuation', // FIXME

      SurgeProtection: '피뢰침',

      Paralysis: '마비',
      Petrification: '석화',
      BeyondDeath: '죽음의 초월',
      Burns: '화상',
      Sludge: '진흙탕',
      Doom: '죽음의 선고',
      StoneCurse: '석화의 저주',
      Imp: '물요정',
      Toad: '두꺼비',
      FoolsTumble: '추락 환각', // 0x183
      Dropsy: '물독',
      Throttle: '질식',
      StaticCondensation: '축전',
      DamageDown: '주는 피해량 감소',
      AstralEffect: 'Astral Effect',
      UmbralEffect: 'Umbral Effect',
      Stun: '기절',
      ThinIce: '얼음 바닥',
      DeepFreeze: '빙결',

      // UWU
      Windburn: '열상',
    });

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
