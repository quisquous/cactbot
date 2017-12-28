"use strict";

class CactbotLanguageKo extends CactbotLanguage {
  constructor(playerName) {
    super('ko', playerName);
  }

  InitStrings(playerName) {
    this.kAbility = Object.freeze({
      DragonKick: '쌍룡각', // 0x4a
      TwinSnakes: '쌍장타', // 0x65
      Demolish: '파쇄권', // 0x42
      Verstone: '버스톤', // 0x1d57
      Verfire: '버파이어', // 0x1d56
      Veraero: '버에어로', // 0x1d53
      Verthunder: '버선더', // 0x1d51
      Verholy: '버홀리', // 0x1d66
      Verflare: '버플레어', // 0x1d65
      Jolt2: '졸트라', // 0x1d64
      Jolt: '졸트', // 0x1d4f
      Impact: '임팩트', // 0x1d62
      Scatter: '흩뿌리기', // 0x1d55
      Vercure: '버케알', // 0x1d5a
      Verraise: '버레이즈', // 0x1d63
      Riposte: '리포스트', // 0x1d50
      Zwerchhau: '츠베르크하우', // 0x1d58
      Redoublement: '르두블망', // 0x1d5c
      Moulinet: '물리네', // 0x1d59
      EnchantedRiposte: '인리포스트', // 0x1d67
      EnchantedZwerchhau: '인츠베르크하우', // 0x1d68
      EnchantedRedoublement: '인르두블망', // 0x1d69
      EnchantedMoulinet: '인물리네', // 0x1d6a
      Tomahawk: '도끼 던지기', // 0x2e
      Overpower: '압도', // 0x29
      HeavySwing: '육중한 일격', // 0x1f
      SkullSunder: '두개골 절단', // 0x23
      ButchersBlock: '휘도는 도끼', // 0x2f
      Maim: '관절 파괴', // 0x25
      StormsEye: '폭풍의 눈', // 0x2d
      StormsPath: '폭풍 쐐기', // 0x2a
      TrickAttack: '속임수 공격', // 0x8d2
      Embolden: '성원', // 0x1d60
      Aetherflow: '에테르 순환', // 0xa6
      ChainStrategem: '연환계', // 0x1d0c
      Hypercharge: '과충전', // 0xb45
    });

    this.kZone = Object.freeze({
      O1S: /Deltascape V1\.0 \(Savage\)/, // NOT UPDATED YET
      O2S: /Deltascape V2\.0 \(Savage\)/,
      O3S: /Deltascape V3\.0 \(Savage\)/,
      O4S: /Deltascape V4\.0 \(Savage\)/,
      UCU: /The Unending Coil Of Bahamut \(Ultimate\)/,
    });

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
    });

    this.kUIStrings = Object.freeze({
      // jobs: text on the pull countdown.
      Pull: 'Pull',
    });

    // TODO: Countdowns
    this.countdownStartRegex = function() {
      return Regexes.Parse(/Battle commencing in (\y{Float}) seconds!/);
    };
    this.countdownCancelRegex = function() {
      return Regexes.Parse(/Countdown canceled by /);
    };
  }
}

document.addEventListener("onPlayerChangedEvent", function (e) {
  if (Options && Options.Language == 'ko') {
    if (!gLang)
      gLang = new CactbotLanguageKo();
    if (gLang.playerName != e.detail.name)
      gLang.OnPlayerNameChange(e.detail.name);
  }
});
