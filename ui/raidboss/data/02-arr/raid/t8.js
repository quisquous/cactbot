import NetRegexes from '../../../../../resources/netregexes.js';
import { Responses } from '../../../../../resources/responses.js';
import ZoneId from '../../../../../resources/zone_id.js';

export default {
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
      alertText: (data, _, output) => output.text(),
      run: (data) => data.landmines = {},
      outputStrings: {
        text: {
          en: 'Explode Landmines',
          de: 'Landminen explodieren',
          fr: 'Explosez les mines',
          ja: '地雷を踏む',
          cn: '引爆地雷',
          ko: '지뢰 폭발시키기',
        },
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
      infoText: (data, matches, output) => {
        if (matches.target in data.landmines)
          return;
        const num = Object.keys(data.landmines).length + 1;
        return output.landmine({ num: num });
      },
      tts: (data, matches, output) => {
        if (matches.target in data.landmines)
          return;
        const num = Object.keys(data.landmines).length + 1;
        return output.landmineTTS({ num: num });
      },
      run: (data, matches) => data.landmines[matches.target] = true,
      outputStrings: {
        landmine: {
          en: '${num} / 3',
          de: '${num} / 3',
          fr: '${num} / 3',
          ja: '${num} / 3',
          cn: '${num} / 3',
          ko: '${num} / 3',
        },
        landmineTTS: {
          en: '${num}',
          de: '${num}',
          fr: '${num}',
          ja: '${num}',
          cn: '${num}',
          ko: '${num}',
        },
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
      infoText: (data, matches, output) => output.text({ player: data.ShortName(matches.source) }),
      outputStrings: {
        text: {
          en: 'Missile Tether (on ${player})',
          de: 'Raketen Tether (auf ${player})',
          fr: 'Lien missile sur ${player}',
          ja: '${player}にミサイル',
          cn: '导弹连线(on ${player})',
          ko: '"${player}" 유도 미사일 대상',
        },
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
      alertText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.brainjackOnYou();
      },
      infoText: (data, matches, output) => {
        if (data.me !== matches.target)
          return output.brainjackOn({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        brainjackOn: {
          en: 'Brainjack on ${player}',
          de: 'Gehirnwäsche auf ${player}',
          fr: 'Détournement cérébral sur ${player}',
          ja: '${player}に混乱',
          cn: '洗脑点${player}',
          ko: '"${player}" 두뇌 장악 대상',
        },
        brainjackOnYou: {
          en: 'Brainjack on YOU',
          de: 'Gehirnwäsche auf DIR',
          fr: 'Détournement cérébral sur VOUS',
          ja: '自分に混乱',
          cn: '洗脑点名',
          ko: '두뇌 장악 대상자',
        },
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
      alertText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.allaganFieldOnYou();
      },
      infoText: (data, matches, output) => {
        if (data.me !== matches.target)
          return output.allaganFieldOn({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        allaganFieldOn: {
          en: 'Allagan Field on ${player}',
          de: 'Allagisches Feld auf ${player}',
          fr: 'Champ allagois sur ${player}',
          ja: '${player}にアラガンフィールド',
          cn: '亚拉戈领域点${player}',
          ko: '"${player}" 알라그 필드 대상',
        },
        allaganFieldOnYou: {
          en: 'Allagan Field on YOU',
          de: 'Allagisches Feld auf DIR',
          fr: 'Champ allagois sur VOUS',
          ja: '自分にアラガンフィールド',
          cn: '亚拉戈领域点名',
          ko: '알라그 필드 대상자',
        },
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
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Dreadnaught Add',
          de: 'Brummonaut Add',
          fr: 'Add Cuirassé',
          ja: '雑魚：ドレッドノート',
          cn: '恐慌装甲出现',
          ko: '드레드노트 쫄',
        },
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
};
