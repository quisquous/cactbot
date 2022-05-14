import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { callOverlayHandler } from '../../../../../resources/overlay_plugin_api';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { PluginCombatantState } from '../../../../../types/event';
import { Output, OutputStrings, TriggerSet } from '../../../../../types/trigger';

// @TODO:
// Interstellar - Test the timing more. Seems OK but the delaySeconds timing might be too tight depending on latency?
// Add phase triggers
// Final phase triggers

export interface Data extends RaidbossData {
  storedStars: { [name: string]: PluginCombatantState };
  phase: 1 | 2;
  storedBoss?: PluginCombatantState;
}

const orbOutputStrings: OutputStrings = {
  ne: Outputs.northeast,
  nw: Outputs.northwest,
  se: Outputs.southeast,
  sw: Outputs.southwest,
};

const getOrbSafeDir = (data: Data, id: string, output: Output): string | undefined => {
  const starCombatant = data.storedStars[id];
  if (!starCombatant) {
    console.error(`Doomed Stars AoE: null data`);
    return;
  }

  if (starCombatant.PosX < 100) {
    if (starCombatant.PosY < 100)
      return output.se!();

    return output.ne!();
  }
  if (starCombatant.PosY < 100)
    return output.sw!();

  return output.nw!();
};

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheFinalDay,
  timelineFile: 'endsinger.txt',
  initData: () => {
    return {
      storedStars: {},
      phase: 1,
    };
  },
  triggers: [
    {
      id: 'Endsinger Doomed Stars AoE',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['662E', '6634'], source: 'Doomed Stars', capture: true }),
      netRegexDe: NetRegexes.startsUsing({ id: ['662E', '6634'], source: 'Endzeitplanet', capture: true }),
      netRegexFr: NetRegexes.startsUsing({ id: ['662E', '6634'], source: 'Planète À L\'Agonie', capture: true }),
      netRegexJa: NetRegexes.startsUsing({ id: ['662E', '6634'], source: '終の星', capture: true }),
      netRegexCn: NetRegexes.startsUsing({ id: ['662E', '6634'], source: '迈向终结的星球', capture: true }),
      netRegexKo: NetRegexes.startsUsing({ id: ['662E', '6634'], source: '멸망한 별', capture: true }),
      delaySeconds: 0.5,
      promise: async (data, matches) => {
        const starData = await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.sourceId, 16)],
        });
        const starCombatant = starData.combatants[0];
        if (!starCombatant) {
          console.error(`Doomed Stars AoE: null data`);
          return;
        }

        data.storedStars[matches.sourceId] = starCombatant;
      },
      alertText: (data, matches, output) => {
        return getOrbSafeDir(data, matches.sourceId, output);
      },
      outputStrings: orbOutputStrings,
    },
    {
      id: 'Endsinger Elegeia',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['662C', '6682'], source: 'The Endsinger', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['662C', '6682'], source: 'Endsängerin', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['662C', '6682'], source: 'Chantre De L\'Anéantissement', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['662C', '6682'], source: '終焉を謳うもの', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: ['662C', '6682'], source: '讴歌终结之物', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: ['662C', '6682'], source: '종언을 노래하는 자', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Endsinger Doomed Stars Fatalism Tether',
      type: 'Tether',
      netRegex: NetRegexes.tether({ source: 'The Endsinger', id: '00A6' }),
      netRegexDe: NetRegexes.tether({ source: 'Endsängerin', id: '00A6' }),
      netRegexFr: NetRegexes.tether({ source: 'Chantre De L\'Anéantissement', id: '00A6' }),
      netRegexJa: NetRegexes.tether({ source: '終焉を謳うもの', id: '00A6' }),
      netRegexCn: NetRegexes.tether({ source: '讴歌终结之物', id: '00A6' }),
      netRegexKo: NetRegexes.tether({ source: '종언을 노래하는 자', id: '00A6' }),
      delaySeconds: 10,
      alertText: (data, matches, output) => {
        return getOrbSafeDir(data, matches.targetId, output);
      },
      outputStrings: orbOutputStrings,
    },
    {
      id: 'Endsinger Galaxias',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6C69', source: 'The Endsinger', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6C69', source: 'Endsängerin', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6C69', source: 'Chantre De L\'Anéantissement', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6C69', source: '終焉を謳うもの', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '6C69', source: '讴歌终结之物', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '6C69', source: '종언을 노래하는 자', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'Endsinger Elenchos Middle',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6644', source: 'The Endsinger', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6644', source: 'Endsängerin', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6644', source: 'Chantre De L\'Anéantissement', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6644', source: '終焉を謳うもの', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '6644', source: '讴歌终结之物', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '6644', source: '종언을 노래하는 자', capture: false }),
      response: Responses.goSides(),
    },
    {
      id: 'Endsinger Elenchos Outsides',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6642', source: 'The Endsinger', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6642', source: 'Endsängerin', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6642', source: 'Chantre De L\'Anéantissement', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6642', source: '終焉を謳うもの', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '6642', source: '讴歌终结之物', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '6642', source: '종언을 노래하는 자', capture: false }),
      response: Responses.goMiddle(),
    },
    {
      id: 'Endsinger Death\'s Embrace',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6649', source: 'The Endsinger', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6649', source: 'Endsängerin', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6649', source: 'Chantre De L\'Anéantissement', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6649', source: '終焉を謳うもの', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '6649', source: '讴歌终结之物', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '6649', source: '종언을 노래하는 자', capture: false }),
      response: Responses.spread(),
    },
    {
      id: 'Endsinger Death\'s Embrace Feathers',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6649', source: 'The Endsinger', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '6649', source: 'Endsängerin', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '6649', source: 'Chantre De L\'Anéantissement', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '6649', source: '終焉を謳うもの', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '6649', source: '讴歌终结之物', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '6649', source: '종언을 노래하는 자', capture: false }),
      response: Responses.moveAway(),
    },
    {
      id: 'Endsinger Death\'s Aporrhoia',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '663D', source: 'The Endsinger', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '663D', source: 'Endsängerin', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '663D', source: 'Chantre De L\'Anéantissement', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '663D', source: '終焉を謳うもの', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '663D', source: '讴歌终结之物', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '663D', source: '종언을 노래하는 자', capture: false }),
      infoText: (_data, _matches, output) => {
        return output.avoidLasers!();
      },
      outputStrings: {
        avoidLasers: {
          en: 'Avoid Head Lasers',
          de: 'Weiche den Kopflaser aus',
          fr: 'Évitez les lasers des têtes',
          ja: '顔の直線AoEを避ける',
          cn: '躲避头部激光',
          ko: '머리가 쏘는 레이저 피하기',
        },
      },
    },
    {
      id: 'Endsinger Hubris',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6652', source: 'The Endsinger', capture: true }),
      netRegexDe: NetRegexes.startsUsing({ id: '6652', source: 'Endsängerin', capture: true }),
      netRegexFr: NetRegexes.startsUsing({ id: '6652', source: 'Chantre De L\'Anéantissement', capture: true }),
      netRegexJa: NetRegexes.startsUsing({ id: '6652', source: '終焉を謳うもの', capture: true }),
      netRegexCn: NetRegexes.startsUsing({ id: '6652', source: '讴歌终结之物', capture: true }),
      netRegexKo: NetRegexes.startsUsing({ id: '6652', source: '종언을 노래하는 자', capture: true }),
      response: Responses.tankCleave(),
    },
    {
      id: 'Endsinger Epigonoi',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6646', source: 'The Endsinger', capture: true }),
      netRegexDe: NetRegexes.startsUsing({ id: '6646', source: 'Endsängerin', capture: true }),
      netRegexFr: NetRegexes.startsUsing({ id: '6646', source: 'Chantre De L\'Anéantissement', capture: true }),
      netRegexJa: NetRegexes.startsUsing({ id: '6646', source: '終焉を謳うもの', capture: true }),
      netRegexCn: NetRegexes.startsUsing({ id: '6646', source: '讴歌终结之物', capture: true }),
      netRegexKo: NetRegexes.startsUsing({ id: '6646', source: '종언을 노래하는 자', capture: true }),
      condition: (_data, matches) => {
        // Find one head that's not dead center
        return parseFloat(matches.x) !== 100 || parseFloat(matches.y) !== 100;
      },
      suppressSeconds: 3,
      infoText: (_data, matches, output) => {
        // If it's cardinal, then intercardinal is safe
        if (parseFloat(matches.x) === 100 || parseFloat(matches.y) === 100)
          return output.intercardinal!();

        return output.cardinal!();
      },
      outputStrings: {
        cardinal: {
          en: 'Cardinal edge',
          de: 'Kardinaler Rand',
          fr: 'Au bord cardinal',
          ja: '東西南北の端へ',
          cn: '去四边',
          ko: '동서남북 끝으로',
        },
        intercardinal: {
          en: 'Intercardinal edge',
          de: 'Interkardinaler Rand',
          fr: 'Au bord intercardinal',
          ja: '斜めの端へ',
          cn: '去四角',
          ko: '대각선 끝으로',
        },
      },
    },
    {
      id: 'Endsinger Interstellar Toggle',
      type: 'NameToggle',
      netRegex: NetRegexes.nameToggle({ toggle: '00', name: 'The Endsinger', capture: true }),
      netRegexDe: NetRegexes.nameToggle({ toggle: '00', name: 'Endsängerin', capture: true }),
      netRegexFr: NetRegexes.nameToggle({ toggle: '00', name: 'Chantre De L\'Anéantissement', capture: true }),
      netRegexJa: NetRegexes.nameToggle({ toggle: '00', name: '終焉を謳うもの', capture: true }),
      netRegexCn: NetRegexes.nameToggle({ toggle: '00', name: '讴歌终结之物', capture: true }),
      netRegexKo: NetRegexes.nameToggle({ toggle: '00', name: '종언을 노래하는 자', capture: true }),
      condition: (data) => data.phase === 1,
      delaySeconds: 4,
      promise: async (data, matches) => {
        const bossData = await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.id, 16)],
        });
        const bossCombatant = bossData.combatants[0];
        if (!bossCombatant) {
          console.error(`Interstellar: null data`);
          return;
        }

        data.storedBoss = bossCombatant;
      },
      alertText: (data, _matches, output) => {
        const boss = data.storedBoss;

        if (!boss)
          return undefined;

        const x = boss.PosX;
        const y = boss.PosY;

        // Handle cardinals the easy way
        if (x === 100) {
          return output.direction!({
            dir1: output.east!(),
            dir2: output.west!(),
          });
        }
        if (y === 100) {
          return output.direction!({
            dir1: output.north!(),
            dir2: output.south!(),
          });
        }

        if (x < 100) {
          if (y < 100) {
            return output.direction!({
              dir1: output.northeast!(),
              dir2: output.southwest!(),
            });
          }
          return output.direction!({
            dir1: output.northwest!(),
            dir2: output.southeast!(),
          });
        }
        if (y < 100) {
          return output.direction!({
            dir1: output.northwest!(),
            dir2: output.southeast!(),
          });
        }
        return output.direction!({
          dir1: output.northeast!(),
          dir2: output.southwest!(),
        });
      },
      outputStrings: {
        north: Outputs.north,
        northeast: Outputs.northeast,
        east: Outputs.east,
        southeast: Outputs.southeast,
        south: Outputs.south,
        southwest: Outputs.southwest,
        west: Outputs.west,
        northwest: Outputs.northwest,
        direction: {
          en: '${dir1} / ${dir2}',
          de: '${dir1} / ${dir2}',
          fr: '${dir1} / ${dir2}',
          ja: '${dir1} / ${dir2}',
          cn: '${dir1} / ${dir2}',
          ko: '${dir1} / ${dir2}',
        },
      },
    },
    {
      id: 'Endsinger Planetes',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6B58', source: 'The Endsinger', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6B58', source: 'Endsängerin', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6B58', source: 'Chantre De L\'Anéantissement', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6B58', source: '終焉を謳うもの', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '6B58', source: '讴歌终结之物', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '6B58', source: '종언을 노래하는 자', capture: false }),
      run: (data) => data.phase = 2,
    },
    {
      id: 'Endsinger Nemesis',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '664E', source: 'The Endsinger', capture: true }),
      netRegexDe: NetRegexes.startsUsing({ id: '664E', source: 'Endsängerin', capture: true }),
      netRegexFr: NetRegexes.startsUsing({ id: '664E', source: 'Chantre De L\'Anéantissement', capture: true }),
      netRegexJa: NetRegexes.startsUsing({ id: '664E', source: '終焉を謳うもの', capture: true }),
      netRegexCn: NetRegexes.startsUsing({ id: '664E', source: '讴歌终结之物', capture: true }),
      netRegexKo: NetRegexes.startsUsing({ id: '664E', source: '종언을 노래하는 자', capture: true }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Endsinger Ultimate Fate',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6B59', source: 'The Endsinger', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6B59', source: 'Endsängerin', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6B59', source: 'Chantre De L\'Anéantissement', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6B59', source: '終焉を謳うもの', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '6B59', source: '讴歌终结之物', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '6B59', source: '종언을 노래하는 자', capture: false }),
      alarmText: (data, _matches, output) => {
        if (data.role === 'tank')
          return output.text!();
      },
      outputStrings: {
        text: {
          en: 'Tank LB NOW',
          de: 'JETZT Tank LB',
          fr: 'Transcendance Tank maintenant !',
          ja: '今タンクLB',
          cn: '坦克LB！',
          ko: '탱리밋',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Doomed Stars': 'Endzeitplanet',
        'Kakodaimon': 'Kakodæmon',
        'The Endsinger': 'Endsängerin',
        'oblivion': 'Chaosdimension',
      },
      'replaceText': {
        '\\(big\\)': '(groß)',
        '\\(cast\\)': '(Wirkung)',
        '\\(small\\)': '(klein)',
        'Aporrhoia': 'Aporia',
        'Crash': 'Impakt',
        'Dead Star': 'Planetenkollaps',
        'Death\'s Embrace': 'Umarmung des Todes',
        'Ekstasis': 'Ekstasis',
        'Elegeia(?! )': 'Elegeia',
        'Elegeia Unforgotten': 'Elegeia der Chronistin',
        'Elenchos': 'Elenchos',
        'Epigonoi': 'Epigonoi',
        'Fatalism': 'Fatalismus',
        'Galaxias': 'Galaxias',
        'Hubris': 'Hybris',
        'Interstellar': 'Sternes Gram',
        'Katastrophe': 'Katastrophe',
        'Meteor Outburst': 'Meteoreruption',
        'Meteor Radiant': 'Meteoritenschein',
        'Nemesis': 'Nemesis',
        'Planetes': 'Planetes',
        'Telomania': 'Telomanie',
        'Telos': 'Telos',
        'Ultimate Fate': 'Ultimatives Schicksal',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Doomed Stars': 'Planète À L\'Agonie',
        'Kakodaimon': 'cacodæmon',
        'The Endsinger': 'chantre de l\'anéantissement',
        'oblivion': 'Ruée chaotique',
      },
      'replaceText': {
        '\\(big\\)': '(gros)',
        '\\(cast\\)': '(lancement)',
        '\\(small\\)': '(petit)',
        'Aporrhoia': 'Aporie',
        'Crash': 'Collision',
        'Dead Star': 'Effondrement planétaire',
        'Death\'s Embrace': 'Étreinte de la mort',
        'Ekstasis': 'Extase',
        'Elegeia(?! )': 'Élégie',
        'Elegeia Unforgotten': 'Chronique élégiaque',
        'Elenchos': 'Élenchos',
        'Epigonoi': 'Épigonoï',
        'Fatalism': 'Fatalisme',
        'Galaxias': 'Galaxias',
        'Hubris': 'Hubris',
        'Interstellar': 'Danse des astres',
        'Katastrophe': 'Catastrophisme',
        'Meteor Outburst': 'Explosion météorique',
        'Meteor Radiant': 'Radiance météorique',
        'Nemesis': 'Némésis',
        'Planetes': 'Planétaire',
        'Telomania': 'Télomanie',
        'Telos': 'Télos',
        'Ultimate Fate': 'Ultime destin',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Doomed Stars': '終の星',
        'Kakodaimon': 'カコダイモーン',
        'The Endsinger': '終焉を謳うもの',
        'oblivion': 'カオティック・ディメンション',
      },
      'replaceText': {
        '\\(cast\\)': '(キャスト)',
        '\\(small\\)': '(小さい)',
        '\\(big\\)': '(大きい)',
        'Aporrhoia': 'アポロイア',
        'Crash': '衝突',
        'Dead Star': '惑星崩壊',
        'Death\'s Embrace': 'デスエンブレース',
        'Ekstasis': 'エクスタシス',
        'Elegeia(?! )': 'エレゲイア',
        'Elegeia Unforgotten': 'エレゲイア：事象記録',
        'Elenchos': 'エレンコス',
        'Epigonoi': 'エピノゴイ',
        'Fatalism': 'フェイタリズム',
        'Galaxias': 'ガラクシアス',
        'Hubris': 'ヒュブリス',
        'Interstellar': '星渡り',
        'Katastrophe': 'カタストロフ',
        'Meteor Outburst': 'メテオアウトバースト',
        'Meteor Radiant': 'メテオレディアント',
        'Nemesis': 'ネメシス',
        'Planetes': 'プラネテス',
        'Telomania': 'テロスマニア',
        'Telos': 'テロス',
        'Ultimate Fate': 'ウルティマフェイト',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Doomed Stars': '迈向终结的星球',
        'Kakodaimon': '恶灵魔',
        'The Endsinger': '讴歌终结之物',
        'oblivion': '混沌次元',
      },
      'replaceText': {
        '\\(big\\)': '(大)',
        '\\(cast\\)': '(投掷)',
        '\\(small\\)': '(小)',
        'Aporrhoia': '流溢',
        'Crash': '冲撞',
        'Dead Star': '坍缩星',
        'Death\'s Embrace': '死亡拥抱',
        'Ekstasis': '恍惚',
        'Elegeia(?! )': '哀歌',
        'Elegeia Unforgotten': '哀歌：记录事件',
        'Elenchos': '反诘',
        'Epigonoi': '后裔',
        'Fatalism': '宿命',
        'Galaxias': '银河',
        'Hubris': '傲慢',
        'Interstellar': '星际穿越',
        'Katastrophe': '灾祟',
        'Meteor Outburst': '陨石爆发',
        'Meteor Radiant': '陨石辐射点',
        'Nemesis': '复仇',
        'Planetes': '行迈之星',
        'Telomania': '终末狂热',
        'Telos': '终末',
        'Ultimate Fate': '终极命运',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Doomed Stars': '멸망한 별',
        'Kakodaimon': '카코다이몬',
        'The Endsinger': '종언을 노래하는 자',
        'oblivion': '혼돈의 차원',
      },
      'replaceText': {
        '\\(big\\)': '(강)',
        '\\(cast\\)': '(시전)',
        '\\(small\\)': '(약)',
        'Aporrhoia': '발출',
        'Crash': '충돌',
        'Dead Star': '행성 붕괴',
        'Death\'s Embrace': '죽음의 포옹',
        'Ekstasis': '엑스타시스',
        'Elegeia(?! )': '엘레게이아',
        'Elegeia Unforgotten': '엘레게이아: 현상 기록',
        'Elenchos': '엘렝코스',
        'Epigonoi': '에피고노이',
        'Fatalism': '운명론',
        'Galaxias': '은하',
        'Hubris': '휴브리스',
        'Interstellar': '성간이동',
        'Katastrophe': '참사',
        'Meteor Outburst': '유성 폭발',
        'Meteor Radiant': '유성우 방사',
        'Nemesis': '네메시스',
        'Planetes': '떠돌이별',
        'Telomania': '텔로스마니아',
        'Telos': '텔로스',
        'Ultimate Fate': '종언의 운명',
      },
    },
  ],
};

export default triggerSet;
