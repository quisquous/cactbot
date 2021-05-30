import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';

export default {
  zoneId: ZoneId.AlexanderTheFistOfTheFatherSavage,
  timelineFile: 'a1s.txt',
  timelineTriggers: [
    {
      id: 'A1S Emergency Liftoff',
      regex: /Emergency Liftoff/,
      beforeSeconds: 5,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Liftoff Soon',
          de: 'Bald abheben',
          fr: 'Décollage bientôt',
          ja: '緊急上昇',
          cn: '上升',
          ko: '긴급 상승',
        },
      },
    },
    {
      id: 'A1S Gunnery Pod',
      regex: /Gunnery Pod/,
      beforeSeconds: 4,
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
  ],
  triggers: [
    {
      id: 'A1S Hydrothermal Collect',
      netRegex: NetRegexes.headMarker({ id: '001E' }),
      run: (data, matches) => {
        data.hydro = data.hydro || [];
        data.hydro.push(matches.target);
      },
    },
    {
      id: 'A1S Hydrothermal You',
      netRegex: NetRegexes.headMarker({ id: '001E' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Hydrothermal on You',
          de: 'Hydrothermales auf DIR',
          fr: 'Missile hydrothermique sur Vous',
          ja: '自分に蒸気ミサイル',
          cn: '导弹点名',
          ko: '증기 미사일 대상자',
        },
      },
    },
    {
      id: 'A1S Hydrothermal Healer',
      netRegex: NetRegexes.headMarker({ id: '001E', capture: false }),
      condition: Conditions.caresAboutMagical(),
      suppressSeconds: 2,
      infoText: (data, _matches, output) => {
        data.hydro = data.hydro || [];
        if (data.hydro.length === 0)
          return;
        return output.text({ players: data.hydro.map((x) => data.ShortName(x)).join(', ') });
      },
      outputStrings: {
        text: {
          en: 'Hydrothermal on ${players}',
          de: 'Hydrothermales auf ${players}',
          fr: 'Missile hydrothermique sur ${players}',
          ja: '${players}に蒸気ミサイル',
          cn: '导弹点${players}',
          ko: '"${players}" 증기 미사일',
        },
      },
    },
    {
      id: 'A1S Hydrothermal Cleanup',
      netRegex: NetRegexes.headMarker({ id: '001E', capture: false }),
      delaySeconds: 10,
      run: (data) => delete data.hydro,
    },
    {
      id: 'A1S Resin Bomb',
      netRegex: NetRegexes.startsUsing({ id: 'E46', source: 'Oppressor', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: 'E46', source: 'Unterdrücker', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: 'E46', source: 'Oppresseur', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: 'E46', source: 'オプレッサー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: 'E46', source: '压迫者', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: 'E46', source: '억압자', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Bait Resin Bomb',
          de: 'Köder Pechbombe',
          fr: 'Attirez Bombe de résine',
          ja: '粘着弾',
          cn: '粘着弹',
          ko: '점착탄',
        },
      },
    },
    {
      id: 'A1S Hypercompressed Collect',
      netRegex: NetRegexes.startsUsing({ id: 'E4A', source: ['Oppressor', 'Oppressor 0\\.5'] }),
      netRegexDe: NetRegexes.startsUsing({ id: 'E4A', source: ['Unterdrücker', 'Unterdrücker 0,5'] }),
      netRegexFr: NetRegexes.startsUsing({ id: 'E4A', source: ['Oppresseur', 'Oppresseur 0\\.5'] }),
      netRegexJa: NetRegexes.startsUsing({ id: 'E4A', source: ['オプレッサー', 'オプレッサー・ゼロ'] }),
      netRegexCn: NetRegexes.startsUsing({ id: 'E4A', source: ['压迫者', '压迫者零号'] }),
      netRegexKo: NetRegexes.startsUsing({ id: 'E4A', source: ['억압자', '미완성 억압자'] }),
      run: (data, matches) => {
        data.hyper = data.hyper || [];
        data.hyper.push(matches.target);
      },
    },
    {
      id: 'A1S Hypercompressed You',
      netRegex: NetRegexes.startsUsing({ id: 'E4A', source: ['Oppressor', 'Oppressor 0\\.5'] }),
      netRegexDe: NetRegexes.startsUsing({ id: 'E4A', source: ['Unterdrücker', 'Unterdrücker 0,5'] }),
      netRegexFr: NetRegexes.startsUsing({ id: 'E4A', source: ['Oppresseur', 'Oppresseur 0\\.5'] }),
      netRegexJa: NetRegexes.startsUsing({ id: 'E4A', source: ['オプレッサー', 'オプレッサー・ゼロ'] }),
      netRegexCn: NetRegexes.startsUsing({ id: 'E4A', source: ['压迫者', '压迫者零号'] }),
      netRegexKo: NetRegexes.startsUsing({ id: 'E4A', source: ['억압자', '미완성 억압자'] }),
      condition: Conditions.targetIsYou(),
      suppressSeconds: 2,
      response: Responses.tankBuster('alarm'),
    },
    {
      id: 'A1S Hypercompressed Other',
      netRegex: NetRegexes.startsUsing({ id: 'E4A', source: ['Oppressor', 'Oppressor 0\\.5'], capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: 'E4A', source: ['Unterdrücker', 'Unterdrücker 0,5'], capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: 'E4A', source: ['Oppresseur', 'Oppresseur 0\\.5'], capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: 'E4A', source: ['オプレッサー', 'オプレッサー・ゼロ'], capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: 'E4A', source: ['压迫者', '压迫者零号'], capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: 'E4A', source: ['억압자', '미완성 억압자'], capture: false }),
      delaySeconds: 0.3,
      suppressSeconds: 2,
      alertText: (data, _matches, output) => {
        data.hyper = data.hyper || [];
        if (data.hyper.includes(data.me))
          return;
        // TODO: maybe need some way to make calling Conditions look less
        // awkward inside of functions.
        if (!Conditions.caresAboutMagical()(data))
          return;
        return output.text();
      },
      outputStrings: {
        text: Outputs.tankBusters,
      },
    },
    {
      id: 'A1S Hypercompressed Delete',
      netRegex: NetRegexes.startsUsing({ id: 'E4A', source: ['Oppressor', 'Oppressor 0\\.5'], capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: 'E4A', source: ['Unterdrücker', 'Unterdrücker 0,5'], capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: 'E4A', source: ['Oppresseur', 'Oppresseur 0\\.5'], capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: 'E4A', source: ['オプレッサー', 'オプレッサー・ゼロ'], capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: 'E4A', source: ['压迫者', '压迫者零号'], capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: 'E4A', source: ['억압자', '미완성 억압자'], capture: false }),
      delaySeconds: 10,
      run: (data) => delete data.hyper,
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        '3000-Tonze Missile': '3000-Tonzen-Geschoss',
        'Faust': 'Faust',
        'Hangar 8': 'Lagerhalle 8',
        'Machinery Bay 44': 'Kampfmaschinen-Baracke 44',
        'Oppressor(?! 0)': 'Unterdrücker',
        'Oppressor 0\\\\.5': 'Unterdrücker 0,5',
      },
      'replaceText': {
        '3000-Tonze Missile': '3000-Tonzen-Geschoss',
        'Distress Beacon': 'Notsignal',
        'Emergency Deployment': 'Noteinsatz',
        'Emergency Liftoff': 'Notstart',
        'Gunnery Pod': 'Waffenbehälter',
        'Hydrothermal Missile': 'Hydrothermales Geschoss',
        'Hypercompressed Plasma': 'Hyperkomprimiertes Plasma',
        'Kaltstrahl': 'Kaltstrahl',
        'Missile Impact': 'Raketenangriff',
        'Photon Spaser': 'Plasmonen-Spaser',
        'Pressure Increase': 'Druckanstieg',
        'Quick Landing': 'Schnelle Landung',
        'Resin Bomb': 'Pechbombe',
        'Royal Fount': 'Königsquelle',
        'Self-Destruct': 'Selbstzerstörung',
        'Sturm Doll': 'Sturmpuppe',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        '3000-Tonze Missile': 'Missile de 3000 tonz',
        'Faust': 'Faust',
        'Hangar 8': 'grand hangar GH-8',
        'Machinery Bay 44': 'hangar d\'armement HA-44',
        'Oppressor(?! 0)': 'Oppresseur',
        'Oppressor 0\\\\.5': 'Oppresseur 0\\.5',
      },
      'replaceText': {
        '3000-Tonze Missile': 'Missile de 3000 tonz',
        'Distress Beacon': 'Fanal de détresse',
        'Emergency Deployment': 'Déploiement d\'urgence',
        'Emergency Liftoff': 'Décollage d\'urgence',
        'Gunnery Pod': 'Feu d\'artillerie',
        'Hydrothermal Missile': 'Missile hydrothermique',
        'Hypercompressed Plasma': 'Plasma hypercomprimé',
        'Kaltstrahl': 'Kaltstrahl',
        'Missile Impact': 'Frappe de missile',
        'Photon Spaser': 'Spaser à photons',
        'Pressure Increase': 'Hausse de pression',
        'Quick Landing': 'Atterrissage rapide',
        'Resin Bomb': 'Bombe de résine',
        'Royal Fount': 'Source royale',
        'Self-Destruct': 'Auto-destruction',
        'Sturm Doll Add': 'Add Poupée sturm',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        '3000-Tonze Missile': '超大型ミサイル',
        'Faust': 'ファウスト',
        'Hangar 8': '第8大型格納庫',
        'Machinery Bay 44': '第44機工兵格納庫',
        'Oppressor(?! 0)': 'オプレッサー',
        'Oppressor 0\\\\.5': 'オプレッサー・ゼロ',
      },
      'replaceText': {
        '3000-Tonze Missile': '超大型ミサイル',
        'Distress Beacon': '救援要請',
        'Emergency Deployment': '緊急出撃',
        'Emergency Liftoff': '緊急上昇',
        'Gunnery Pod': 'ガンポッドファイア',
        'Hydrothermal Missile': '蒸気ミサイル',
        'Hypercompressed Plasma': 'ハイパープラズマ',
        'Kaltstrahl': 'カルトシュトラール',
        'Missile Impact': 'ミサイル攻撃',
        'Photon Spaser': 'フォトンスペーサー',
        'Pressure Increase': '蒸気圧上昇',
        'Quick Landing': '落着',
        'Resin Bomb': '粘着弾',
        'Royal Fount': 'ロイヤルファウント',
        'Self-Destruct': '自爆',
        'Sturm Doll Add': '雑魚: シュツルムドール',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        '3000-Tonze Missile': '超大型导弹',
        'Faust': '浮士德',
        'Hangar 8': '第8大型机库',
        'Machinery Bay 44': '第44机工兵仓库',
        'Oppressor(?! 0)': '压迫者',
        'Oppressor 0\\\\.5': '压迫者零号',
      },
      'replaceText': {
        '3000-Tonze Missile': '超大型导弹',
        'Distress Beacon': '请求救援',
        'Emergency Deployment': '紧急出击',
        'Emergency Liftoff': '紧急上升',
        'Gunnery Pod': '炮台散射',
        'Hydrothermal Missile': '蒸汽导弹',
        'Hypercompressed Plasma': '超压缩等离子',
        'Kaltstrahl': '寒光',
        'Missile Impact': '导弹攻击',
        'Photon Spaser': '光子照射',
        'Pressure Increase': '蒸汽压上升',
        'Quick Landing': '落地',
        'Resin Bomb': '粘着弹',
        'Royal Fount': '皇泉射线',
        'Self-Destruct': '自爆',
        'Sturm Doll': '风暴人偶',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        '3000-Tonze Missile': '초대형 미사일',
        'Faust': '파우스트',
        'Hangar 8': '제8 대형 격납고',
        'Machinery Bay 44': '제44 기공병 격납고',
        'Oppressor(?! 0)': '억압자',
        'Oppressor 0\\\\.5': '미완성 억압자',
      },
      'replaceText': {
        '3000-Tonze Missile': '초대형 미사일',
        'Distress Beacon': '구원 요청',
        'Emergency Deployment': '긴급 출격',
        'Emergency Liftoff': '긴급 상승',
        'Gunnery Pod': '기관총 발사',
        'Hydrothermal Missile': '증기 미사일',
        'Hypercompressed Plasma': '초플라스마',
        'Kaltstrahl': '냉병기 공격',
        'Missile Impact': '미사일 공격',
        'Photon Spaser': '광자포',
        'Pressure Increase': '증기압 상승',
        'Quick Landing': '경착륙',
        'Resin Bomb': '점착탄',
        'Royal Fount': '과열 분사',
        'Self-Destruct': '자폭',
        'Sturm Doll': '인형 폭기병',
      },
    },
  ],
};
