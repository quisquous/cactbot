import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheFinalCoilOfBahamutTurn1,
  timelineFile: 't10.txt',
  triggers: [
    {
      id: 'T10 Phase Change',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: 'B5D', source: 'Imdugud', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: 'B5D', source: 'Imdugud', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: 'B5D', source: 'Imdugud', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: 'B5D', source: 'イムドゥグド', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: 'B5D', source: '伊姆都古德', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: 'B5D', source: '임두구드', capture: false }),
      sound: 'Long',
    },
    {
      id: 'T10 Heat Lightning',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: 'B5F', source: 'Imdugud', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: 'B5F', source: 'Imdugud', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: 'B5F', source: 'Imdugud', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: 'B5F', source: 'イムドゥグド', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: 'B5F', source: '伊姆都古德', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: 'B5F', source: '임두구드', capture: false }),
      response: Responses.spread(),
    },
    {
      id: 'T10 Wild Charge',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '001F' }),
      alarmText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.chargeOnYou!();
      },
      infoText: (data, matches, output) => {
        if (data.me !== matches.target)
          return output.chargeOn!({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        chargeOn: {
          en: 'Charge on ${player}',
          de: 'Ansturm auf ${player}',
          fr: 'Charge sur ${player}',
          ja: '${player}にワイルドチャージ',
          cn: '蓝球点${player}',
          ko: '"${player}" 야성의 돌진 대상',
        },
        chargeOnYou: {
          en: 'Charge on YOU',
          de: 'Ansturm auf DIR',
          fr: 'Charge sur VOUS',
          ja: '自分にワイルドチャージ',
          cn: '蓝球点名',
          ko: '야성의 돌진 대상자',
        },
      },
    },
    {
      id: 'T10 Prey',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '001E' }),
      response: Responses.preyOn(),
    },
    {
      id: 'T10 Cyclonic Tether',
      type: 'Tether',
      netRegex: NetRegexes.tether({ id: '0015', source: 'Imdugud' }),
      netRegexDe: NetRegexes.tether({ id: '0015', source: 'Imdugud' }),
      netRegexFr: NetRegexes.tether({ id: '0015', source: 'Imdugud' }),
      netRegexJa: NetRegexes.tether({ id: '0015', source: 'イムドゥグド' }),
      netRegexCn: NetRegexes.tether({ id: '0015', source: '伊姆都古德' }),
      netRegexKo: NetRegexes.tether({ id: '0015', source: '임두구드' }),
      alarmText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.cyclonicOnYou!();
      },
      infoText: (data, matches, output) => {
        if (data.me !== matches.target)
          return output.cyclonicOn!({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        cyclonicOn: {
          en: 'Cyclonic on ${player}',
          de: 'Zyklon-Chaos auf ${player}',
          fr: 'Chaos cyclonique sur ${player}',
          ja: '${player}にサイクロニックカオス',
          cn: '连线点${player}',
        },
        cyclonicOnYou: {
          en: 'Cyclonic on YOU',
          de: 'Zyklon-Chaos auf DIR',
          fr: 'Chaos cyclonique sur VOUS',
          ja: '自分にサイクロニックカオス',
          cn: '连线点名',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Imdugud': 'Imdugud',
        'The Alpha Concourse': 'Alpha-Emergenzzone',
      },
      'replaceText': {
        'Crackle Hiss': 'Knisterndes Fauchen',
        'Critical Rip': 'Kritischer Riss',
        'Cyclonic Chaos': 'Zyklon-Chaos',
        'Daughter': 'Tochter',
        'Electric Burst': 'Stromstoß',
        'Electrocharge': 'Elektro-Ladung',
        'Heat Lightning': 'Hitzeblitz',
        'Random \\+ Charge': 'Zufall + Wilde Rage',
        'Son': 'Sohn',
        'Spike Flail': 'Dornendresche',
        'Wild Charge': 'Wilde Rage',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Imdugud': 'Imdugud',
        'The Alpha Concourse': 'secteur des croyants',
      },
      'replaceText': {
        'Crackle Hiss': 'Crachat crépitant',
        'Critical Rip': 'Griffure critique',
        'Cyclonic Chaos': 'Chaos cyclonique',
        'Electric Burst': 'Salve électrique',
        'Electrocharge': 'Charge électrique',
        'Heat Lightning': 'Éclair de chaleur',
        'Random \\+ Charge': 'Aléatoire + Charge',
        '1x Son / 1x Daughter Adds': 'Adds 1x Fils / 1x Fille',
        '2x Son / 2x Daughter Adds': 'Adds 2x Fils / 2x Fille',
        'Spike Flail': 'Fléau à pointes',
        'Wild Charge': 'Charge sauvage',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Imdugud': 'イムドゥグド',
        'The Alpha Concourse': '第I信徒区画',
      },
      'replaceText': {
        'Crackle Hiss': 'クラックルヒス',
        'Critical Rip': 'クリティカルリップ',
        'Cyclonic Chaos': 'サイクロニックカオス',
        'Electric Burst': 'エレクトリックバースト',
        'Electrocharge': 'エレクトロチャージ',
        'Heat Lightning': 'ヒートライトニング',
        'Random \\+ Charge': 'ランダム + チャージ',
        '1x Son / 1x Daughter Adds': '雑魚: 1サン/1ドーター',
        '2x Son / 2x Daughter Adds': '雑魚: 2サン/2ドーター',
        'Spike Flail': 'スパイクフレイル',
        'Wild Charge': 'ワイルドチャージ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Imdugud': '伊姆都古德',
        'The Alpha Concourse': '第1信徒区间',
      },
      'replaceText': {
        'Crackle Hiss': '雷光电闪',
        'Critical Rip': '暴击撕裂',
        'Cyclonic Chaos': '龙卷雷暴',
        'Daughter': '伊姆都古德之女',
        'Electric Burst': '电光爆发',
        'Electrocharge': '蓄电',
        'Heat Lightning': '惊电',
        'Random \\+ Charge': '随机+冲锋',
        'Son': '伊姆都古德之子',
        'Spike Flail': '刃尾横扫',
        'Wild Charge': '狂野冲锋',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Imdugud': '임두구드',
        'The Alpha Concourse': '제I신도 구역',
      },
      'replaceText': {
        'Crackle Hiss': '파직파직 번개',
        'Critical Rip': '찢어가르기',
        'Cyclonic Chaos': '휘몰아치는 혼돈',
        'Electric Burst': '전하 폭발',
        'Electrocharge': '전하 충전',
        'Heat Lightning': '뜨거운 번개',
        'Spike Flail': '가시 매타작',
        'Wild Charge': '야성의 돌진',
        'Daughter': '딸',
        'Son': '아들',
        'Adds': '쫄',
        'Random \\+ Charge': '번개/혼돈 + 전하 충전',
      },
    },
  ],
};

export default triggerSet;
