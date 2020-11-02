'use strict';

[{
  zoneId: ZoneId.TheSecondCoilOfBahamutTurn3,
  timelineFile: 't8.txt',
  triggers: [
    {
      id: 'T8 Stack',
      netRegex: NetRegexes.headMarker({ id: '0011' }),
      response: Responses.stackMarkerOn('info'),
    },
    {
      id: 'T8 Landmine Start',
      netRegex: NetRegexes.message({ line: 'Landmines have been scattered.*?', capture: false }),
      netRegexDe: NetRegexes.message({ line: 'Die Landminen haben sich verteilt.*?', capture: false }),
      netRegexFr: NetRegexes.message({ line: 'Des mines ont été répandues.*?', capture: false }),
      netRegexJa: NetRegexes.message({ line: '地雷が散布された.*?', capture: false }),
      netRegexCn: NetRegexes.message({ line: '地雷分布在了各处.*?', capture: false }),
      netRegexKo: NetRegexes.message({ line: '지뢰가 뿌려졌습니다.*?', capture: false }),
      alertText: {
        en: 'Explode Landmines',
        de: 'Landminen explodieren',
        fr: 'Explosez les mines',
        ja: '地雷を踏む',
        cn: '引爆地雷',
      },
      run: function(data) {
        data.landmines = {};
      },
    },
    {
      id: 'T8 Landmine Explosion',
      netRegex: NetRegexes.ability({ id: '7D1', source: 'Allagan Mine' }),
      netRegexDe: NetRegexes.ability({ id: '7D1', source: 'Allagisch(?:e|er|es|en) Mine' }),
      netRegexFr: NetRegexes.ability({ id: '7D1', source: 'Mine Allagoise' }),
      netRegexJa: NetRegexes.ability({ id: '7D1', source: 'アラガンマイン' }),
      netRegexCn: NetRegexes.ability({ id: '7D1', source: '亚拉戈机雷' }),
      netRegexKo: NetRegexes.ability({ id: '7D1', source: '알라그 지뢰' }),
      infoText: function(data, matches) {
        if (matches.target in data.landmines)
          return;
        return (Object.keys(data.landmines).length + 1) + ' / 3';
      },
      tts: function(data, matches) {
        if (matches.target in data.landmines)
          return;
        return (Object.keys(data.landmines).length + 1);
      },
      run: function(data, matches) {
        data.landmines[matches.target] = true;
      },
    },
    {
      id: 'T8 Homing Missile Warning',
      netRegex: NetRegexes.tether({ id: '0005', target: 'The Avatar' }),
      netRegexDe: NetRegexes.tether({ id: '0005', target: 'Avatar' }),
      netRegexFr: NetRegexes.tether({ id: '0005', target: 'Bio-Tréant' }),
      netRegexJa: NetRegexes.tether({ id: '0005', target: 'アバター' }),
      netRegexCn: NetRegexes.tether({ id: '0005', target: '降世化身' }),
      netRegexKo: NetRegexes.tether({ id: '0005', target: '아바타' }),
      suppressSeconds: 6,
      infoText: function(data, matches) {
        return {
          en: 'Missile Tether (on ' + data.ShortName(matches.source) + ')',
          de: 'Raketen Tether (auf ' + data.ShortName(matches.source) + ')',
          fr: 'Lien missile sur ' + data.ShortName(matches.source),
          ja: data.ShortName(matches.source) + 'にミサイル',
          cn: '导弹连线(on ' + data.ShortName(matches.source) + ')',
        };
      },
    },
    {
      id: 'T8 Brainjack',
      netRegex: NetRegexes.startsUsing({ id: '7C3', source: 'The Avatar' }),
      netRegexDe: NetRegexes.startsUsing({ id: '7C3', source: 'Avatar' }),
      netRegexFr: NetRegexes.startsUsing({ id: '7C3', source: 'Bio-Tréant' }),
      netRegexJa: NetRegexes.startsUsing({ id: '7C3', source: 'アバター' }),
      netRegexCn: NetRegexes.startsUsing({ id: '7C3', source: '降世化身' }),
      netRegexKo: NetRegexes.startsUsing({ id: '7C3', source: '아바타' }),
      alertText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Brainjack on YOU',
            de: 'Gehirnwäsche auf DIR',
            fr: 'Détournement cérébral sur VOUS',
            ja: '自分に混乱',
            cn: '洗脑点名',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches.target) {
          return {
            en: 'Brainjack on ' + data.ShortName(matches.target),
            de: 'Gehirnwäsche auf ' + data.ShortName(matches.target),
            fr: 'Détournement cérébral sur ' + data.ShortName(matches.target),
            ja: data.ShortName(matches.target) + 'に混乱',
            cn: '洗脑点' + data.ShortName(matches.target),
          };
        }
      },
    },
    {
      id: 'T8 Allagan Field',
      netRegex: NetRegexes.startsUsing({ id: '7C4', source: 'The Avatar' }),
      netRegexDe: NetRegexes.startsUsing({ id: '7C4', source: 'Avatar' }),
      netRegexFr: NetRegexes.startsUsing({ id: '7C4', source: 'Bio-Tréant' }),
      netRegexJa: NetRegexes.startsUsing({ id: '7C4', source: 'アバター' }),
      netRegexCn: NetRegexes.startsUsing({ id: '7C4', source: '降世化身' }),
      netRegexKo: NetRegexes.startsUsing({ id: '7C4', source: '아바타' }),
      alertText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Allagan Field on YOU',
            de: 'Allagisches Feld auf DIR',
            fr: 'Champ allagois sur VOUS',
            ja: '自分にアラガンフィールド',
            cn: '亚拉戈领域点名',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches.target) {
          return {
            en: 'Allagan Field on ' + data.ShortName(matches.target),
            de: 'Allagisches Feld auf ' + data.ShortName(matches.target),
            fr: 'Champ allagois sur ' + data.ShortName(matches.target),
            ja: data.ShortName(matches.target) + 'にアラガンフィールド',
            cn: '亚拉戈领域点' + data.ShortName(matches.target),
          };
        }
      },
    },
    {
      id: 'T8 Dreadnaught',
      netRegex: NetRegexes.addedCombatant({ name: 'Clockwork Dreadnaught', capture: false }),
      netRegexDe: NetRegexes.addedCombatant({ name: 'Brummonaut', capture: false }),
      netRegexFr: NetRegexes.addedCombatant({ name: 'Cuirassé Dreadnaught', capture: false }),
      netRegexJa: NetRegexes.addedCombatant({ name: 'ドレッドノート', capture: false }),
      netRegexCn: NetRegexes.addedCombatant({ name: '恐慌装甲', capture: false }),
      netRegexKo: NetRegexes.addedCombatant({ name: '드레드노트', capture: false }),
      infoText: {
        en: 'Dreadnaught Add',
        de: 'Brummonaut Add',
        fr: 'Add Cuirassé',
        ja: '雑魚：ドレッドノート',
        cn: '恐慌装甲出现',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Allagan Field': 'Allagisches Feld',
        'Allagan Mine': 'allagisch(?:e|er|es|en) Mine',
        'Clockwork Dreadnaught': 'Brummonaut',
        'Landmines have been scattered': 'Die Landminen haben sich verteilt',
        'The Avatar': 'Avatar',
        'The central bow': 'Rumpf-Zentralsektor',
      },
      'replaceText': {
        'Allagan Field': 'Allagisches Feld',
        'Atomic Ray': 'Atomstrahlung',
        'Ballistic Missile': 'Ballistische Rakete',
        'Brainjack': 'Gehirnwäsche',
        'Critical Surge': 'Kritischer Schub',
        'Diffusion Ray': 'Diffusionsstrahl',
        'Gaseous Bomb': 'Explosives Gasgemisch',
        'Homing Missile': 'Lenkgeschoss',
        'Inertia Stream': 'Trägheitsstrom',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Allagan Field': 'Champ Allagois',
        'Allagan Mine': 'Mine Allagoise',
        'Clockwork Dreadnaught': 'Cuirassé Dreadnaught',
        'Landmines have been scattered': 'Des mines ont été répandues',
        'The Avatar': 'Bio-Tréant',
        'The central bow': 'l\'axe central - proue',
      },
      'replaceText': {
        'Allagan Field': 'Champ allagois',
        'Atomic Ray': 'Rayon atomique',
        'Ballistic Missile': 'Missiles balistiques',
        'Brainjack': 'Détournement cérébral',
        'Critical Surge': 'Trouée critique',
        'Diffusion Ray': 'Rayon diffuseur',
        'Gaseous Bomb': 'Bombe gazeuse',
        'Homing Missile': 'Tête chercheuse',
        'Inertia Stream': 'Courant apathique',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Allagan Field': 'アラガンフィールド',
        'Allagan Mine': 'アラガンマイン',
        'Clockwork Dreadnaught': 'ドレッドノート',
        'Landmines have been scattered': '地雷が散布された',
        'The Avatar': 'アバター',
        'The central bow': '中枢艦首区',
      },
      'replaceText': {
        'Allagan Field': 'アラガンフィールド',
        'Atomic Ray': 'アトミックレイ',
        'Ballistic Missile': 'バリスティックミサイル',
        'Brainjack': 'ブレインジャック',
        'Critical Surge': '臨界突破',
        'Diffusion Ray': 'ディフュージョンレイ',
        'Gaseous Bomb': '気化爆弾',
        'Homing Missile': 'ホーミングミサイル',
        'Inertia Stream': 'イナーシャストリーム',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Allagan Field': '亚拉戈领域',
        'Allagan Mine': '亚拉戈机雷',
        'Clockwork Dreadnaught': '恐慌装甲',
        'Landmines have been scattered': '地雷分布在了各处',
        'The Avatar': '降世化身',
        'The central bow': '中枢舰首区',
      },
      'replaceText': {
        'Allagan Field': '亚拉戈领域',
        'Atomic Ray': '原子射线',
        'Ballistic Missile': '弹道导弹',
        'Brainjack': '洗脑',
        'Critical Surge': '临界突破',
        'Diffusion Ray': '扩散射线',
        'Gaseous Bomb': '气化炸弹',
        'Homing Missile': '自控导弹',
        'Inertia Stream': '惰性流',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Allagan Field': '알라그 필드',
        'Allagan Mine': '알라그 지뢰',
        'Clockwork Dreadnaught': '드레드노트',
        'Landmines have been scattered': '지뢰가 뿌려졌습니다',
        'The Avatar': '아바타',
        'The central bow': '중추 함수 구역',
      },
      'replaceText': {
        'Allagan Field': '알라그 필드',
        'Atomic Ray': '원자 파동',
        'Ballistic Missile': '탄도 미사일',
        'Brainjack': '두뇌 장악',
        'Critical Surge': '임계 돌파',
        'Diffusion Ray': '확산 광선',
        'Gaseous Bomb': '기화 폭탄',
        'Homing Missile': '유도 미사일',
        'Inertia Stream': '관성 기류',
      },
    },
  ],
}];
