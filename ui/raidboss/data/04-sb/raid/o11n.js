'use strict';

// O11N - Alphascape 3.0
[{
  zoneRegex: {
    en: /^Alphascape \(V3\.0\)$/,
    cn: /^欧米茄时空狭缝 \(阿尔法幻境3\)$/,
    ko: /^차원의 틈 오메가: 알파편 \(3\)$/,
  },
  zoneId: ZoneId.AlphascapeV30,
  timelineFile: 'o11n.txt',
  timelineTriggers: [
    {
      id: 'O11N Blaster',
      regex: /Blaster/,
      beforeSeconds: 3,
      condition: function(data) {
        return data.role == 'tank';
      },
      infoText: {
        en: 'Tank Tether',
        de: 'Tank Verbindung',
        cn: '坦克接线远离人群',
        ko: '탱 블래스터 징',
      },
    },
  ],
  triggers: [
    {
      id: 'O11N Mustard Bomb',
      netRegex: NetRegexes.startsUsing({ id: '3287', source: 'Omega' }),
      netRegexDe: NetRegexes.startsUsing({ id: '3287', source: 'Omega' }),
      netRegexFr: NetRegexes.startsUsing({ id: '3287', source: 'Oméga' }),
      netRegexJa: NetRegexes.startsUsing({ id: '3287', source: 'オメガ' }),
      netRegexCn: NetRegexes.startsUsing({ id: '3287', source: '欧米茄' }),
      netRegexKo: NetRegexes.startsUsing({ id: '3287', source: '오메가' }),
      response: Responses.tankBuster('alarm'),
    },
    {
      // Ability IDs:
      // Starboard 1: 3281
      // Starboard 2: 3282
      // Larboard 1: 3283
      // Larboard 2: 3284
      // For the cannons, match #1 and #2 for the first one.  This is so
      // that if a log entry for the first is dropped for some reason, it
      // will at least say left/right for the second.
      id: 'O11N Cannon Cleanup',
      netRegex: NetRegexes.startsUsing({ id: '328[13]', source: 'Omega', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '328[13]', source: 'Omega', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '328[13]', source: 'Oméga', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '328[13]', source: 'オメガ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '328[13]', source: '欧米茄', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '328[13]', source: '오메가', capture: false }),
      delaySeconds: 15,
      run: function(data) {
        delete data.lastWasStarboard;
      },
    },
    {
      id: 'O11N Starboard Cannon 1',
      netRegex: NetRegexes.startsUsing({ id: '328[12]', source: 'Omega', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '328[12]', source: 'Omega', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '328[12]', source: 'Oméga', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '328[12]', source: 'オメガ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '328[12]', source: '欧米茄', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '328[12]', source: '오메가', capture: false }),
      condition: function(data) {
        return data.lastWasStarboard === undefined;
      },
      response: Responses.goLeft(),
      run: function(data) {
        data.lastWasStarboard = true;
      },
    },
    {
      id: 'O11N Larboard Cannon 1',
      netRegex: NetRegexes.startsUsing({ id: '328[34]', source: 'Omega', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '328[34]', source: 'Omega', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '328[34]', source: 'Oméga', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '328[34]', source: 'オメガ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '328[34]', source: '欧米茄', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '328[34]', source: '오메가', capture: false }),
      condition: function(data) {
        return data.lastWasStarboard === undefined;
      },
      response: Responses.goRight(),
      run: function(data) {
        data.lastWasStarboard = false;
      },
    },
    {
      id: 'O11N Starboard Cannon 2',
      netRegex: NetRegexes.startsUsing({ id: '3282', source: 'Omega', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3282', source: 'Omega', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3282', source: 'Oméga', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3282', source: 'オメガ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3282', source: '欧米茄', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3282', source: '오메가', capture: false }),
      condition: function(data) {
        return data.lastWasStarboard !== undefined;
      },
      alertText: function(data) {
        if (data.lastWasStarboard) {
          return {
            en: 'Move (Left)',
            de: 'Bewegen (Links)',
            fr: 'Bougez (Gauche)',
            cn: '去左边',
            ko: '이동 (왼쪽)',
          };
        }
        return {
          en: 'Stay (Left)',
          de: 'Stehenbleiben (Links)',
          fr: 'Restez ici (Gauche)',
          cn: '呆在左边',
          ko: '멈추기 (왼쪽)',
        };
      },
    },
    {
      id: 'O11N Larboard Cannon 2',
      netRegex: NetRegexes.startsUsing({ id: '3284', source: 'Omega', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3284', source: 'Omega', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3284', source: 'Oméga', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3284', source: 'オメガ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3284', source: '欧米茄', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3284', source: '오메가', capture: false }),
      condition: function(data) {
        return data.lastWasStarboard !== undefined;
      },
      alertText: function(data) {
        if (data.lastWasStarboard) {
          return {
            en: 'Stay (Right)',
            de: 'Stehenbleiben (Rechts)',
            fr: 'Restez ici (Droite)',
            cn: '呆在右边',
            ko: '멈추기 (오른쪽)',
          };
        }
        return {
          en: 'Move (Right)',
          de: 'Bewegen (Rechts)',
          fr: 'Bougez (droite)',
          cn: '去右边',
          ko: '이동 (오른쪽)',
        };
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Engaging Delta Attack protocol': 'Reinitialisiere Deltaprotokoll',
        'Level Checker': 'Monitor',
        'Omega': 'Omega',
        'Rocket Punch': 'Raketenschlag',
      },
      'replaceText': {
        'Atomic Ray': 'Atomstrahlung',
        'Ballistic Impact': 'Ballistischer Einschlag',
        'Ballistic Missile': 'Ballistische Rakete',
        'Blaster': 'Blaster',
        'Delta Attack': 'Delta-Attacke',
        'Electric Slide': 'Elektrosturz',
        'Executable': 'Programmstart',
        'Flamethrower': 'Flammenwerfer',
        'Mustard Bomb': 'Senfbombe',
        'Peripheral Synthesis': 'Ausdrucken',
        'Program Loop': 'Programmschleife',
        'Reformat': 'Optimierung',
        'Reset': 'Zurücksetzen',
        'Rush': 'Stürmen',
        'Starboard/Larboard Cannon': 'Steuerbord/Backbord Kanone',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Engaging Delta Attack protocol': 'Nécessité d\'utiliser l\'attaque Delta',
        'Level Checker': 'vérifiniveau',
        'Omega': 'Oméga',
        'Rocket Punch': 'Astéropoing',
      },
      'replaceText': {
        'Atomic Ray': 'Rayon atomique',
        'Ballistic Impact': 'Impact de missile',
        'Ballistic Missile': 'Tir de missile',
        'Blaster': 'Électrochoc',
        'Delta Attack': 'Attaque Delta',
        'Electric Slide': 'Glissement Oméga',
        'Executable': 'Exécution de programme',
        'Flamethrower': 'Lance-flammes',
        'Mustard Bomb': 'Obus d\'ypérite',
        'Peripheral Synthesis': 'Impression',
        'Program Loop': 'Boucle de programme',
        'Reformat': 'Optimisation',
        'Reset': 'Réinitialisation',
        'Rush': 'Ruée',
        'Starboard/Larboard Cannon': 'Tribord/Bâbord',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Engaging Delta Attack protocol': 'デルタアタックの必要性を認定します',
        'Level Checker': 'レベルチェッカー',
        'Omega': 'オメガ',
        'Rocket Punch': 'ロケットパンチ',
      },
      'replaceText': {
        'Atomic Ray': 'アトミックレイ',
        'Ballistic Impact': 'ミサイル着弾',
        'Ballistic Missile': 'ミサイル発射',
        'Blaster': 'ブラスター',
        'Delta Attack': 'デルタアタック',
        'Electric Slide': 'オメガスライド',
        'Executable': 'プログラム実行',
        'Flamethrower': '火炎放射',
        'Mustard Bomb': 'マスタードボム',
        'Peripheral Synthesis': 'プリントアウト',
        'Program Loop': 'サークルプログラム',
        'Reformat': '最適化',
        'Reset': '初期化',
        'Rush': '突進',
        'Starboard/Larboard Cannon': '右舷/左舷・波動砲',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Engaging Delta Attack protocol': '认定有必要使用三角攻击。',
        'Level Checker': '等级检测仪',
        'Omega': '欧米茄',
        'Rocket Punch': '火箭飞拳',
      },
      'replaceText': {
        'Atomic Ray': '原子射线',
        'Ballistic Impact': '导弹命中',
        'Ballistic Missile': '导弹发射',
        'Blaster': '冲击波',
        'Delta Attack': '三角攻击',
        'Electric Slide': '欧米茄滑跃',
        'Executable': '运行程序',
        'Flamethrower': '火焰喷射器',
        'Mustard Bomb': '芥末爆弹',
        'Peripheral Synthesis': '生成外设',
        'Program Loop': '循环程序',
        'Reformat': '最优化',
        'Reset': '初始化',
        'Rush': '突进',
        'Starboard/Larboard Cannon': '右/左舷齐射·波动炮',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Engaging Delta Attack protocol': '델타 공격의 필요성을 인정합니다',
        'Level Checker': '레벨 측정기',
        'Omega': '오메가',
        'Rocket Punch': '로켓 주먹',
      },
      'replaceText': {
        'Atomic Ray': '원자 파동',
        'Ballistic Impact': '미사일 착탄',
        'Ballistic Missile': '미사일 발사',
        'Blaster': '블래스터',
        'Delta Attack': '델타 공격',
        'Electric Slide': '오메가 슬라이드',
        'Executable': '프로그램 실행',
        'Flamethrower': '화염 방사',
        'Mustard Bomb': '겨자 폭탄',
        'Peripheral Synthesis': '출력',
        'Program Loop': '순환 프로그램',
        'Reformat': '최적화',
        'Reset': '초기화',
        'Rush': '돌진',
        'Starboard/Larboard Cannon': '좌/우현 사격 파동포',
      },
    },
  ],
}];
