import { callOverlayHandler } from '../../../../../resources/overlay_plugin_api';

import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';

export default {
  zoneId: ZoneId.EdensVerseFurorSavage,
  timelineFile: 'e6s.txt',
  triggers: [
    {
      id: 'E6S Strike Spark',
      netRegex: NetRegexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4BD3', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4BD3', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4BD3', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: ['イフリート', 'ラクタパクシャ'], id: '4BD3', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: ['伊弗利特', '赤翼罗羯坨博叉'], id: '4BD3', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: ['이프리트', '락타팍샤'], id: '4BD3', capture: false }),
      delaySeconds: 11,
      promise: async (data, _matches, output) => {
        const ifritLocaleNames = {
          en: 'Ifrit',
          de: 'Ifrit',
          fr: 'Ifrit',
          ja: 'イフリート',
          cn: '伊弗利特',
          ko: '이프리트',
        };

        const raktapaksaLocaleNames = {
          en: 'Raktapaksa',
          de: 'Raktapaksa',
          fr: 'Raktapaksa',
          ja: 'ラクタパクシャ',
          cn: '赤翼罗羯坨博叉',
          ko: '락타팍샤',
        };

        // select the 4 most recent Ifrit or Raktapaksa's depending on phase
        let combatantName = null;
        if (data.phase === 'ifrit')
          combatantName = ifritLocaleNames[data.parserLang];
        else
          combatantName = raktapaksaLocaleNames[data.parserLang];

        let combatantData = null;
        if (combatantName) {
          combatantData = await callOverlayHandler({
            call: 'getCombatants',
            names: [combatantName],
          });
        }

        // if we could not retrieve combatant data, the
        // trigger will not work, so just resume promise here.
        if (!(combatantData !== null &&
          combatantData.combatants &&
          combatantData.combatants.length)) {
          data.safeZone = null;
          return;
        }

        // we need to filter for the Ifrit with the highest ID
        // since that one is always the safe spot.
        const currentHighestCombatant =
          combatantData.combatants.sort((a, b) => a.ID - b.ID).pop();

        // all variation ranges for all the 9 ball positions for the kicking actors
        // north      x: 96-104   y: 85-93
        // northeast  x: 107-115  y: 85-93
        // northwest  x: 85-93    y: 85-93
        // east       x: 107-115  y: 96-104
        // west       x: 85-93    y: 96-104
        // south      x: 96-104   y: 107-115
        // southeast  x: 107-115  y: 107-115
        // southwest  x: 85-93    y: 107-115
        let safeZone1 = null;
        let safeZone2 = null;

        // don't need to go through all the posibilities,
        // only those 4 ifs do reflect the above positions
        if (currentHighestCombatant.PosY > 84 && currentHighestCombatant.PosY < 94)
          safeZone1 = output.north();
        else if (currentHighestCombatant.PosY > 106 && currentHighestCombatant.PosY < 116)
          safeZone1 = output.south();


        if (currentHighestCombatant.PosX > 84 && currentHighestCombatant.PosX < 94)
          safeZone2 = output.west();
        else if (currentHighestCombatant.PosX > 106 && currentHighestCombatant.PosX < 116)
          safeZone2 = output.east();


        if (safeZone1 && safeZone2)
          data.safeZone = output.twoDirs({ dir1: safeZone1, dir2: safeZone2 });
        else if (safeZone1)
          data.safeZone = output.oneDir({ dir: safeZone1 });
        else if (safeZone2)
          data.safeZone = output.oneDir({ dir: safeZone2 });
        else
          data.safeZone = null;
      },
      infoText: (data, _matches, output) => !data.safeZone ? output.unknown() : data.safeZone,
      outputStrings: {
        oneDir: {
          en: '${dir}',
          de: '${dir}',
          fr: '${dir}',
          ja: '${dir}へ',
          cn: '去${dir}',
          ko: '${dir}쪽으로',
        },
        twoDirs: {
          en: '${dir1}${dir2}',
          de: '${dir1}${dir2}',
          fr: '${dir1} ${dir2}',
          ja: '${dir1}${dir2}へ',
          cn: '去${dir2}${dir1}',
          ko: '${dir1}${dir2}쪽으로',
        },
        unknown: Outputs.unknown,
        north: Outputs.north,
        south: Outputs.south,
        west: Outputs.west,
        east: Outputs.east,
      },
    },
    {
      id: 'E6S Superstorm',
      netRegex: NetRegexes.startsUsing({ source: 'Garuda', id: '4BF7', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Garuda', id: '4BF7', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Garuda', id: '4BF7', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ガルーダ', id: '4BF7', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '迦楼罗', id: '4BF7', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '가루다', id: '4BF7', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
      run: (data) => data.phase = 'garuda',
    },
    {
      id: 'E6S Ferostorm',
      netRegex: NetRegexes.startsUsing({ source: ['Garuda', 'Raktapaksa'], id: ['4BF[EF]', '4C0[45]'], capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: ['Garuda', 'Raktapaksa'], id: ['4BF[EF]', '4C0[45]'], capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: ['Garuda', 'Raktapaksa'], id: ['4BF[EF]', '4C0[45]'], capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: ['ガルーダ', 'ラクタパクシャ'], id: ['4BF[EF]', '4C0[45]'], capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: ['迦楼罗', '赤翼罗羯坨博叉'], id: ['4BF[EF]', '4C0[45]'], capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: ['가루다', '락타팍샤'], id: ['4BF[EF]', '4C0[45]'], capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Avoid green nails',
          de: 'Weiche den grünen Nägeln aus',
          fr: 'Évitez les griffes',
          ja: '緑の杭に避け',
          cn: '躲避风刃',
          ko: '초록 발톱 피하기',
        },
      },
    },
    {
      id: 'E6S Air Bump',
      netRegex: NetRegexes.headMarker({ id: '00D3' }),
      suppressSeconds: 1,
      infoText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.enumerationOnYou();

        return output.enumeration();
      },
      outputStrings: {
        enumerationOnYou: {
          en: 'Enumeration on YOU',
          de: 'Enumeration aud DIR',
          fr: 'Énumération sur VOUS',
          ja: '自分にエアーバンプ',
          cn: '蓝圈分摊点名',
          ko: '2인 장판 대상자',
        },
        enumeration: {
          en: 'Enumeration',
          de: 'Enumeration',
          fr: 'Énumération',
          ja: 'エアーバンプ',
          cn: '蓝圈分摊',
          ko: '2인 장판',
        },
      },
    },
    {
      id: 'E6S Touchdown',
      netRegex: NetRegexes.startsUsing({ source: 'Ifrit', id: '4C09', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Ifrit', id: '4C09', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Ifrit', id: '4C09', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'イフリート', id: '4C09', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '伊弗利特', id: '4C09', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '이프리트', id: '4C09', capture: false }),
      run: (data) => data.phase = 'ifrit',
    },
    {
      id: 'E6S Inferno Howl',
      netRegex: NetRegexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4C14', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4C14', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4C14', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: ['イフリート', 'ラクタパクシャ'], id: '4C14', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: ['伊弗利特', '赤翼罗羯坨博叉'], id: '4C14', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: ['이프리트', '락타팍샤'], id: '4C14', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      // Save ability state since the generic tether used has multiple uses in this fight
      id: 'E6S Hands of Flame Start',
      netRegex: NetRegexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4D00', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4D00', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4D00', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: ['イフリート', 'ラクタパクシャ'], id: '4D00', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: ['伊弗利特', '赤翼罗羯坨博叉'], id: '4D00', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: ['이프리트', '락타팍샤'], id: '4D00', capture: false }),
      preRun: (data) => data.handsOfFlame = true,
    },
    {
      // Tank swap if you're not the target
      // Break tether if you're the target during Ifrit+Garuda phase
      id: 'E6S Hands of Flame Tether',
      netRegex: NetRegexes.tether({ id: '0068' }),
      condition: (data) => data.handsOfFlame,
      infoText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.chargeOnYou();

        if (data.role !== 'tank' || data.phase === 'both')
          return;
        return output.tankSwap();
      },
      outputStrings: {
        chargeOnYou: {
          en: 'Charge on YOU',
          de: 'Ansturm auf DIR',
          fr: 'Charge sur VOUS',
          ja: '自分に突進',
          cn: '冲锋点名',
          ko: '나에게 보스 돌진',
        },
        tankSwap: Outputs.tankSwap,
      },
    },
    {
      id: 'E6S Hands of Flame Cast',
      netRegex: NetRegexes.ability({ source: ['Ifrit', 'Raktapaksa'], id: '4D00', capture: false }),
      netRegexDe: NetRegexes.ability({ source: ['Ifrit', 'Raktapaksa'], id: '4D00', capture: false }),
      netRegexFr: NetRegexes.ability({ source: ['Ifrit', 'Raktapaksa'], id: '4D00', capture: false }),
      netRegexJa: NetRegexes.ability({ source: ['イフリート', 'ラクタパクシャ'], id: '4D00', capture: false }),
      netRegexCn: NetRegexes.ability({ source: ['伊弗利特', '赤翼罗羯坨博叉'], id: '4D00', capture: false }),
      netRegexKo: NetRegexes.ability({ source: ['이프리트', '락타팍샤'], id: '4D00', capture: false }),
      preRun: (data) => data.handsOfFlame = false,
      suppressSeconds: 1,
    },
    {
      id: 'E6S Instant Incineration',
      netRegex: NetRegexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4C0E' }),
      netRegexDe: NetRegexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4C0E' }),
      netRegexFr: NetRegexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4C0E' }),
      netRegexJa: NetRegexes.startsUsing({ source: ['イフリート', 'ラクタパクシャ'], id: '4C0E' }),
      netRegexCn: NetRegexes.startsUsing({ source: ['伊弗利特', '赤翼罗羯坨博叉'], id: '4C0E' }),
      netRegexKo: NetRegexes.startsUsing({ source: ['이프리트', '락타팍샤'], id: '4C0E' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'E6S Meteor Strike',
      netRegex: NetRegexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4C0F', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4C0F', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4C0F', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: ['イフリート', 'ラクタパクシャ'], id: '4C0F', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: ['伊弗利特', '赤翼罗羯坨博叉'], id: '4C0F', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: ['이프리트', '락타팍샤'], id: '4C0F', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      id: 'E6S Hands of Hell',
      netRegex: NetRegexes.headMarker({ id: '0016' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Tether Marker on YOU',
          de: 'Verbindung auf DIR',
          fr: 'Marque de lien sur VOUS',
          ja: '自分に線マーカー',
          cn: '连线点名',
          ko: '선 징 대상자',
        },
      },
    },
    {
      id: 'E6S Hated of the Vortex',
      netRegex: NetRegexes.startsUsing({ source: 'Garuda', id: '4F9F', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Garuda', id: '4F9F', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Garuda', id: '4F9F', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ガルーダ', id: '4F9F', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '迦楼罗', id: '4F9F', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '가루다', id: '4F9F', capture: false }),
      run: (data) => data.phase = 'both',
    },
    {
      id: 'E6S Hated of the Vortex Effect',
      netRegex: NetRegexes.gainsEffect({ effectId: '8BB' }),
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Attack Garuda',
          de: 'Greife Garuda an',
          fr: 'Attaquez Garuda',
          ja: 'ガルーダに攻撃',
          cn: '打风神',
          ko: '가루다 공격하기',
        },
      },
    },
    {
      id: 'E6S Hated of the Embers Effect',
      netRegex: NetRegexes.gainsEffect({ effectId: '8BC' }),
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Attack Ifrit',
          de: 'Greife Ifrit an',
          fr: 'Attaquez Ifrit',
          ja: 'イフリートに攻撃',
          cn: '打火神',
          ko: '이프리트 공격하기',
        },
      },
    },
    {
      id: 'E6S Raktapaksa Spawn',
      netRegex: NetRegexes.ability({ source: 'Raktapaksa', id: '4D55', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Raktapaksa', id: '4D55', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Raktapaksa', id: '4D55', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'ラクタパクシャ', id: '4D55', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '赤翼罗羯坨博叉', id: '4D55', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '락타팍샤', id: '4D55', capture: false }),
      run: (data) => data.phase = 'raktapaksa',
    },
    {
      id: 'E6S Downburst Knockback 1',
      netRegex: NetRegexes.startsUsing({ source: 'Garuda', id: '4BFB', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Garuda', id: '4BFB', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Garuda', id: '4BFB', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ガルーダ', id: '4BFB', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '迦楼罗', id: '4BFB', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '가루다', id: '4BFB', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'E6S Downburst Knockback 2',
      netRegex: NetRegexes.startsUsing({ source: 'Raktapaksa', id: '4BFC', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Raktapaksa', id: '4BFC', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Raktapaksa', id: '4BFC', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ラクタパクシャ', id: '4BFC', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '赤翼罗羯坨博叉', id: '4BFC', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '락타팍샤', id: '4BFC', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'E6S Conflag Strike',
      netRegex: NetRegexes.startsUsing({ source: 'Raktapaksa', id: '4C10', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Raktapaksa', id: '4C10', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Raktapaksa', id: '4C10', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ラクタパクシャ', id: '4C10', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '赤翼罗羯坨博叉', id: '4C10', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '락타팍샤', id: '4C10', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'go to spots for chains',
          de: 'Gehe zu den Stellen für die Kette',
          fr: 'Positions pour les chaines',
          ja: '安置へ、鎖が繋がれる',
          cn: '连线站位',
          ko: '대화재 준비',
        },
      },
    },
    {
      id: 'E6S Irons Of Purgatory',
      netRegex: NetRegexes.tether({ id: '006C' }),
      condition: (data, matches) => data.me === matches.target || data.me === matches.source,
      alertText: (data, matches, output) => {
        if (data.me === matches.source)
          return output.tetheredToPlayer({ player: data.ShortName(matches.target) });

        return output.tetheredToPlayer({ player: data.ShortName(matches.source) });
      },
      outputStrings: {
        tetheredToPlayer: {
          en: 'Tethered to ${player}',
          de: 'Verbunden mit ${player}',
          fr: 'Lié à ${player}',
          ja: '${player}と繋がった',
          cn: '和${player}连线',
          ko: '선 연결 짝: ${player}',
        },
      },
    },
    {
      id: 'E6S Conflag Strike Behind',
      netRegex: NetRegexes.startsUsing({ source: 'Raktapaksa', id: '4C10', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Raktapaksa', id: '4C10', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Raktapaksa', id: '4C10', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ラクタパクシャ', id: '4C10', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '赤翼罗羯坨博叉', id: '4C10', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '락타팍샤', id: '4C10', capture: false }),
      delaySeconds: 31,
      response: Responses.getBehind(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Twisting Blaze': 'Feuersturm',
        'Tumultuous Nexus': 'Orkankugel',
        'Raktapaksa': 'Raktapaksa',
        'Ifrit': 'Ifrit',
        'Garuda': 'Garuda',
      },
      'replaceText': {
        'Wind Cutter': 'Schneidender Wind',
        'Vacuum Slice': 'Vakuumschnitt',
        'Touchdown': 'Himmelssturz',
        'Superstorm': 'Sturm der Zerstörung',
        'Strike Spark': 'Feuerfunken',
        'Storm Of Fury': 'Wütender Sturm',
        'Spread Of Fire': 'Ausbreitung des Feuers',
        'Radiant Plume': 'Scheiterhaufen',
        'Occluded Front': 'Okklusion',
        'Meteor Strike': 'Meteorit',
        'Irresistible Pull': 'Saugkraft',
        'Instant Incineration': 'Explosive Flamme',
        'Inferno Howl': 'Glühendes Gebrüll',
        'Hot Foot': 'Fliegendes Feuer',
        'Heat Burst': 'Hitzewelle',
        'Hated Of Embers': 'Fluch der Flammen',
        'Hands Of Hell': 'Faust des Schicksals',
        'Hands Of Flame': 'Flammenfaust',
        'Firestorm': 'Feuersturm',
        'Ferostorm': 'Angststurm',
        'Explosion': 'Explosion',
        'Eruption': 'Eruption',
        'Downburst': 'Fallböe',
        'Conflag Strike': 'Feuersbrunst',
        'Call Of The Inferno': 'Flimmernde Hitze',
        'Blaze': 'Flamme',
        'Air Bump': 'Aufsteigende Böe',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'twisting blaze': 'Vortex enflammé',
        'tumultuous nexus': 'Rafale',
        'Raktapaksa': 'Raktapaksa',
        'Ifrit': 'Ifrit',
        'Garuda': 'Garuda',
      },
      'replaceText': {
        'Wind Cutter': 'Trancheur de vent',
        'Vacuum Slice': 'Lacération du vide',
        'Touchdown': 'Atterrissage',
        'Superstorm': 'Tempête dévastatrice',
        'Strike Spark': 'Ignescences',
        'Storm Of Fury': 'Tempête déchaînée',
        'Spread Of Fire': 'Océan de feu',
        'Radiant Plume': 'Panache radiant',
        'Occluded Front': 'Front occlus',
        'Meteor Strike': 'Frappe de météore',
        'Irresistible Pull': 'Force d\'aspiration',
        'Instant Incineration': 'Uppercut enflammé',
        'Inferno Howl': 'Rugissement ardent',
        'Hot Foot': 'Jet d\'ignescence',
        'Heat Burst': 'Vague de chaleur',
        'Hated Of Embers/Vortex': 'Malédiction des flammes/de rafales',
        'Hands Of Hell': 'Frappe purgatrice',
        'Hands Of Flame': 'Frappe enflammée',
        'Firestorm': 'Tempête de feu',
        'Ferostorm': 'Tempête déchaînée',
        'Explosion': 'Explosion',
        'Eruption': 'Éruption',
        'Downburst': 'Rafale descendante',
        'Conflag Strike': 'Ekpurosis',
        'Call Of The Inferno': 'Mirage de chaleur',
        'Blaze': 'Fournaise',
        'Air Bump': 'Rafale ascendante',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'twisting blaze': '火炎旋風',
        'tumultuous nexus': '暴風球',
        'Raktapaksa': 'ラクタパクシャ',
        'Ifrit': 'イフリート',
        'Garuda': 'ガルーダ',
      },
      'replaceText': {
        'Wind Cutter': 'ウィンドカッター',
        'Vacuum Slice': 'バキュームスラッシュ',
        'Touchdown': 'タッチダウン',
        'Superstorm': 'スーパーストーム',
        'Strike Spark': 'ファイアスパーク',
        'Storm Of Fury': 'フューリアスストーム',
        'Spread Of Fire': 'スプレッド・オブ・ファイア',
        'Radiant Plume': '光輝の炎柱',
        'Occluded Front': 'オクルーデッドフロント',
        'Meteor Strike': 'メテオストライク',
        'Irresistible Pull': '吸引力',
        'Instant Incineration': '爆裂炎',
        'Inferno Howl': '灼熱の咆哮',
        'Hot Foot': '飛び火',
        'Heat Burst': '熱波',
        'Hated Of Embers': '焔神の呪い',
        'Hands Of Hell': '業炎拳',
        'Hands Of Flame': '火炎拳',
        'Firestorm': 'ファイアストーム',
        'Ferostorm': 'フィアスストーム',
        'Explosion': '爆散',
        'Eruption': 'エラプション',
        'Downburst': 'ダウンバースト',
        'Conflag Strike': 'コンフラグレーションストライク',
        'Call Of The Inferno': '陽炎召喚',
        'Blaze': '火炎',
        'Air Bump': 'エアーバンプ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Garuda': '迦楼罗',
        'Tumultuous Nexus': '暴风球',
        'Ifrit': '伊弗利特',
        'Raktapaksa': '赤翼罗羯坨博叉',
        'Twisting Blaze': '火焰旋风',
      },
      'replaceText': {
        'Superstorm': '超级风暴',
        'Occluded Front': '锢囚锋',
        'Wind Cutter': '风刃',
        'Storm Of Fury': '暴怒风暴',
        'Air Bump': '空气弹垫',
        'Ferostorm': '凶猛风暴',
        'Downburst': '下行突风',
        'Vacuum Slice': '真空斩',
        'Irresistible Pull': '吸引力',
        'Explosions?': '爆炸',
        'Touchdown': '空降',
        'Hands Of Flame': '火焰拳',
        'Eruption': '地火喷发',
        'Instant Incineration': '爆裂炎',
        'Meteor Strike': '流星强击',
        'Inferno Howl': '灼热的咆哮',
        'Hands Of Hell': '业火拳',
        'Strike Spark': '火花爆',
        'Call Of The Inferno': '幻影召唤',
        'Hot Foot': '飞火',
        'Hated Of Embers/Vortex': '火/风神的诅咒',
        'Firestorm': '火焰流',
        'Heat Burst': '热波',
        'Radiant Plume': '光辉炎柱',
        'Spread Of Fire': '火势蔓延',
        'Conflag Strike': '瞬燃强袭',
        'Blaze': '炎爆',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Garuda': '가루다',
        'Tumultuous Nexus': '폭풍구',
        'Ifrit': '이프리트',
        'Raktapaksa': '락타팍샤',
        'Twisting Blaze': '화염 선풍',
      },
      'replaceText': {
        'Superstorm': '초폭풍',
        'Occluded Front': '폐색 전선',
        'Wind Cutter': '바람 칼날',
        'Storm Of Fury': '분노의 폭풍',
        'Air Bump': '상향 기류',
        'Ferostorm': '사나운 폭풍',
        'Downburst': '하강 기류',
        'Vacuum Slice': '진공베기',
        'Irresistible Pull': '흡인력',
        'Explosion': '폭산',
        'Touchdown': '착지',
        'Hands Of Flame': '화염권',
        'Eruption': '용암 분출',
        'Instant Incineration': '폭렬염',
        'Meteor Strike': '메테오 스트라이크',
        'Inferno Howl': '작열의 포효',
        'Hands Of Hell': '업염권',
        'Strike Spark': '불놀이',
        'Call Of The Inferno': '아지랑이 소환',
        'Hot Foot': '불똥',
        'Hated Of Embers/Vortex': '화염신/바람신의 저주',
        'Firestorm': '불보라',
        'Heat Burst': '열파',
        'Radiant Plume': '광휘의 불기둥',
        'Spread Of Fire': '불꽃 확산',
        'Conflag Strike': '대화재',
        'Blaze': '화염',
      },
    },
  ],
};
