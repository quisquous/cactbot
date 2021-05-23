import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';

export default {
  zoneId: ZoneId.EdensVerseFuror,
  timelineFile: 'e6n.txt',
  timelineTriggers: [
    {
      // We warn the user here because the startsUsing warning gives only 3.5s or so.
      id: 'E6N Downburst',
      regex: /Downburst/,
      beforeSeconds: 5,
      response: Responses.knockback('info'),
    },

  ],
  triggers: [
    {
      id: 'E6N Superstorm',
      netRegex: NetRegexes.startsUsing({ source: 'Garuda', id: '4BD7', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Garuda', id: '4BD7', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Garuda', id: '4BD7', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ガルーダ', id: '4BD7', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '迦楼罗', id: '4BD7', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '가루다', id: '4BD7', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'E6N Ferostorm',
      netRegex: NetRegexes.startsUsing({ source: ['Garuda', 'Raktapaksa'], id: ['4BD[DEF]', '4BE[345]'], capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: ['Garuda', 'Raktapaksa'], id: ['4BD[DEF]', '4BE[345]'], capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: ['Garuda', 'Raktapaksa'], id: ['4BD[DEF]', '4BE[345]'], capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: ['ガルーダ', 'ラクタパクシャ'], id: ['4BD[DEF]', '4BE[345]'], capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: ['迦楼罗', '赤翼罗羯坨博叉'], id: ['4BD[DEF]', '4BE[345]'], capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: ['가루다', '락타팍샤'], id: ['4BD[DEF]', '4BE[345]'], capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Avoid green nails',
          de: 'Weiche den grünen Nägeln aus',
          fr: 'Évitez les griffes',
          ja: '緑の杭に避け',
          cn: '躲避风牙',
          ko: '초록 발톱 피하기',
        },
      },
    },
    {
      id: 'E6N Air Bump',
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
      id: 'E6N Inferno Howl',
      netRegex: NetRegexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4BF1', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4BF1', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4BF1', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: ['イフリート', 'ラクタパクシャ'], id: '4BF1', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: ['伊弗利特', '赤翼罗羯坨博叉'], id: '4BF1', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: ['이프리트', '락타팍샤'], id: '4BF1', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      // Save ability state since the generic tether used has multiple uses in this fight
      id: 'E6N Hands of Flame Start',
      netRegex: NetRegexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4CFE', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4CFE', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4CFE', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: ['イフリート', 'ラクタパクシャ'], id: '4CFE', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: ['伊弗利特', '赤翼罗羯坨博叉'], id: '4CFE', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: ['이프리트', '락타팍샤'], id: '4CFE', capture: false }),
      preRun: (data) => {
        data.handsOfFlame = true;
      },
    },
    {
      // Tank swap if you're not the target
      // Break tether if you're the target during Ifrit+Garuda phase
      id: 'E6N Hands of Flame Tether',
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
          ko: '돌진 대상자',
        },
        tankSwap: Outputs.tankSwap,
      },
    },
    {
      id: 'E6N Hands of Flame Cast',
      netRegex: NetRegexes.ability({ source: ['Ifrit', 'Raktapaksa'], id: '4BE9', capture: false }),
      netRegexDe: NetRegexes.ability({ source: ['Ifrit', 'Raktapaksa'], id: '4BE9', capture: false }),
      netRegexFr: NetRegexes.ability({ source: ['Ifrit', 'Raktapaksa'], id: '4BE9', capture: false }),
      netRegexJa: NetRegexes.ability({ source: ['イフリート', 'ラクタパクシャ'], id: '4BE9', capture: false }),
      netRegexCn: NetRegexes.ability({ source: ['伊弗利特', '赤翼罗羯坨博叉'], id: '4BE9', capture: false }),
      netRegexKo: NetRegexes.ability({ source: ['이프리트', '락타팍샤'], id: '4BE9', capture: false }),
      preRun: (data) => {
        data.handsOfFlame = false;
      },
      suppressSeconds: 1,
    },
    {
      id: 'E6N Instant Incineration',
      netRegex: NetRegexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4BED' }),
      netRegexDe: NetRegexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4BED' }),
      netRegexFr: NetRegexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4BED' }),
      netRegexJa: NetRegexes.startsUsing({ source: ['イフリート', 'ラクタパクシャ'], id: '4BED' }),
      netRegexCn: NetRegexes.startsUsing({ source: ['伊弗利特', '赤翼罗羯坨博叉'], id: '4BED' }),
      netRegexKo: NetRegexes.startsUsing({ source: ['이프리트', '락타팍샤'], id: '4BED' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'E6N Hands of Hell',
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
          ko: '징 대상자',
        },
      },
    },
    {
      id: 'E6N Strike Spark',
      netRegex: NetRegexes.ability({ source: 'Ifrit', id: '4F98', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Ifrit', id: '4F98', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Ifrit', id: '4F98', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'イフリート', id: '4F98', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '伊弗利特', id: '4F98', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '이프리트', id: '4F98', capture: false }),
      // Run only once, because Ifrit's other jumps are not important.
      condition: (data) => !data.seenSpark,
      alertText: (_data, _matches, output) => output.text(),
      run: (data) => {
        data.seenSpark = true;
      },
      outputStrings: {
        text: {
          en: 'Move to Ifrit',
          de: 'Zu Ifrit bewegen',
          fr: 'Allez sur Ifrit',
          ja: 'イフリートところへ',
          cn: '踢球 集合待机',
          ko: '이프리트로 이동',
        },
      },
    },
    {
      id: 'E6N Storm Of Fury',
      // Garuda uses this ability without eruptions alongside, so she needs no warnings.
      netRegex: NetRegexes.startsUsing({ source: 'Raktapaksa', id: '4BE6', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Raktapaksa', id: '4BE6', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Raktapaksa', id: '4BE6', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ラクタパクシャ', id: '4BE6', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '赤翼罗羯坨博叉', id: '4BE6', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '락타팍샤', id: '4BE6', capture: false }),
      response: Responses.stackThenSpread(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Raktapaksa': 'Raktapaksa',
        'Ifrit': 'Ifrit',
        'Garuda': 'Garuda',
      },
      'replaceText': {
        'Vacuum Slice': 'Vakuumschnitt',
        'Touchdown': 'Himmelssturz',
        'Thorns': 'Dornen',
        'Superstorm': 'Sturm der Zerstörung',
        'Strike Spark': 'Feuerfunken',
        'Storm Of Fury': 'Wütender Sturm',
        'Radiant Plume': 'Scheiterhaufen',
        'Occluded Front': 'Okklusion',
        'Irresistible Pull': 'Saugkraft',
        'Instant Incineration': 'Explosive Flamme',
        'Inferno Howl': 'Glühendes Gebrüll',
        'Hot Foot': 'Fliegendes Feuer',
        'Heat Burst': 'Hitzewelle',
        'Hands Of Hell': 'Faust des Schicksals',
        'Hands Of Flame': 'Flammenfaust',
        'Firestorm': 'Feuersturm',
        'Ferostorm': 'Angststurm',
        'Eruption': 'Eruption',
        'Downburst': 'Fallböe',
        'Conflag Strike': 'Feuersbrunst',
        'Air Bump': 'Aufsteigende Böe',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Raktapaksa': 'Raktapaksa',
        'Ifrit': 'Ifrit',
        'Garuda': 'Garuda',
      },
      'replaceText': {
        'Vacuum Slice': 'Lacération du vide',
        'Touchdown': 'Atterrissage',
        'Thorns': 'Lardoir',
        'Superstorm': 'Tempête dévastatrice',
        'Strike Spark': 'Ignescences',
        'Storm Of Fury': 'Tempête déchaînée',
        'Radiant Plume': 'Panache radiant',
        'Occluded Front': 'Front occlus',
        'Irresistible Pull': 'Force d\'aspiration',
        'Instant Incineration': 'Uppercut enflammé',
        'Inferno Howl': 'Rugissement ardent',
        'Hot Foot': 'Jet d\'ignescence',
        'Heat Burst': 'Vague de chaleur',
        'Hands Of Hell': 'Frappe purgatrice',
        'Hands Of Flame': 'Frappe enflammée',
        'Firestorm': 'Tempête de feu',
        'Ferostorm': 'Tempête déchaînée',
        'Eruption': 'Éruption',
        'Downburst': 'Rafale descendante',
        'Conflag Strike': 'Ekpurosis',
        'Air Bump': 'Rafale ascendante',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Raktapaksa': 'ラクタパクシャ',
        'Ifrit': 'イフリート',
        'Garuda': 'ガルーダ',
      },
      'replaceText': {
        'Vacuum Slice': 'バキュームスラッシュ',
        'Touchdown': 'タッチダウン',
        'Thorns': '早贄',
        'Superstorm': 'スーパーストーム',
        'Strike Spark': 'ファイアスパーク',
        'Storm Of Fury': 'フューリアスストーム',
        'Radiant Plume': '光輝の炎柱',
        'Occluded Front': 'オクルーデッドフロント',
        'Irresistible Pull': '吸引力',
        'Instant Incineration': '爆裂炎',
        'Inferno Howl': '灼熱の咆哮',
        'Hot Foot': '飛び火',
        'Heat Burst': '熱波',
        'Hands Of Hell': '業炎拳',
        'Hands Of Flame': '火炎拳',
        'Firestorm': 'ファイアストーム',
        'Ferostorm': 'フィアスストーム',
        'Eruption': 'エラプション',
        'Downburst': 'ダウンバースト',
        'Conflag Strike': 'コンフラグレーションストライク',
        'Air Bump': 'エアーバンプ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Garuda': '迦楼罗',
        'Ifrit': '伊弗利特',
        'Raktapaksa': '赤翼罗羯坨博叉',
      },
      'replaceText': {
        'Ferostorm': '凶猛风暴',
        'Superstorm': '超级风暴',
        'Air Bump': '空气弹垫',
        'Thorns': '血祭',
        'Downburst': '下行突风',
        'Storm Of Fury': '暴怒风暴',
        'Vacuum Slice': '真空斩',
        'Occluded Front': '锢囚锋',
        'Irresistible Pull': '吸引力',
        'Touchdown': '空降',
        'Hands Of Flame': '火焰拳',
        'Hands Of Hell': '业火拳',
        'Instant Incineration': '爆裂炎',
        'Eruption': '地火喷发',
        'Strike Spark': '火花爆',
        'Hot Foot': '飞火',
        'Inferno Howl': '灼热的咆哮',
        'Firestorm': '火焰流',
        'Radiant Plume': '光辉炎柱',
        'Heat Burst': '热波',
        'Conflag Strike': '瞬燃强袭',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Garuda': '가루다',
        'Ifrit': '이프리트',
        'Raktapaksa': '락타팍샤',
      },
      'replaceText': {
        'Ferostorm': '사나운 폭풍',
        'Superstorm': '초폭풍',
        'Air Bump': '상향 기류',
        'Thorns': '생꼬치',
        'Downburst': '하강 기류',
        'Storm Of Fury': '분노의 폭풍',
        'Vacuum Slice': '진공베기',
        'Occluded Front': '폐색 전선',
        'Irresistible Pull': '흡인력',
        'Touchdown': '착지',
        'Hands Of Flame': '화염권',
        'Hands Of Hell': '업염권',
        'Instant Incineration': '폭렬염',
        'Eruption': '용암 분출',
        'Strike Spark': '불놀이',
        'Hot Foot': '불똥',
        'Inferno Howl': '작열의 포효',
        'Firestorm': '불보라',
        'Radiant Plume': '광휘의 불기둥',
        'Heat Burst': '열파',
        'Conflag Strike': '대화재',
      },
    },
  ],
};
