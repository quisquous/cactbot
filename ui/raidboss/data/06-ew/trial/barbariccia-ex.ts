import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

// TODO: Add In=>Spread or Wall (+cardinal?)=>Spread callout to Hair Spray (note this is cast at other phases)
// TODO: Add In=>Healer Groups, or Wall (+cardinal?)=>Healer Groups to Deadly Twist
// TODO: Verify Playstation Marker Ids match: 016F (circle), 0170 (triangle), 0171 (square), 0172 (cross)
// TODO: Stack callout for the healer that gets stackmarker in phase 2?
// TODO: Call out a move for the player with Brutal Rush tether to avoid the Gust?

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.StormsCrownExtreme,
  timelineFile: 'barbariccia-ex.txt',
  timelineTriggers: [
    {
      id: 'BarbaricciaEx Knuckle Drum',
      regex: /Knuckle Drum/,
      beforeSeconds: 5,
      response: Responses.aoe(),
    },
    {
      id: 'BarbaricciaEx Impact',
      regex: /Impact/,
      beforeSeconds: 5,
      response: Responses.knockback(),
    },
  ],
  triggers: [
    {
      id: 'BarbaricciaEx Void Aero IV',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7570', source: 'Barbariccia', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'BarbaricciaEx Hair Spray',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '75A6', source: 'Barbariccia' }),
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'In/Wall => Spread',
          de: 'Rein/Rand => Verteilen',
          fr: 'Intérieur/Extérieur -> Écartez-vous',
          cn: '靠近BOSS分散',
        },
      },
    },
    {
      id: 'BarbaricciaEx Deadly Twist',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '75A7', source: 'Barbariccia', capture: false }),
      suppressSeconds: 2,
      alertText: (_data, _matches, output) => output.groups!(),
      outputStrings: {
        groups: {
          en: 'Healer Groups',
          de: 'Heiler-Gruppen',
          fr: 'Groupes sur les heals',
          ja: 'ヒラに頭割り',
          cn: '与治疗分摊',
          ko: '힐러 그룹 쉐어',
        },
      },
    },
    {
      id: 'BarbaricciaEx Void Aero III',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7571', source: 'Barbariccia' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'BarbaricciaEx Secret Breeze',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7580', source: 'Barbariccia', capture: false }),
      infoText: (_data, _matches, output) => output.protean!(),
      outputStrings: {
        protean: {
          en: 'Protean',
          de: 'Himmelsrichtungen',
          fr: 'Positions',
          ja: '8方向散開',
          cn: '八方位站位',
          ko: '정해진 위치로 산개',
        },
      },
    },
    {
      id: 'BarbaricciaEx Boulder Break',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7383', source: 'Barbariccia' }),
      response: Responses.sharedTankBuster(),
    },
    {
      id: 'BarbaricciaEx Brittle Boulder',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '759E', source: 'Barbariccia' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Bait Middle => Out (Spread)',
          de: 'In der Mitte Ködern => Raus (verteilen)',
          fr: 'Posez au centre -> Écartez-vous à l\'extérieur',
          cn: '中间集合然后八方分散',
        },
      },
    },
    {
      // Is it possible to get the order the player's gust goes off to call out a move?
      // These also favor a certain order of Tank/Healer for first set then DPS second set
      id: 'BarbaricciaEx Brutal Rush',
      type: 'Tether',
      netRegex: NetRegexes.tether({ id: '0011' }),
      condition: (data, matches) => matches.source === data.me,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Brutal Rush tether on You',
          de: 'Grausame Hatz Verbindung auf DIR',
          fr: 'Lien de Ruée brutale sur VOUS',
          cn: '拳击点名',
        },
      },
    },
    {
      id: 'BarbaricciaEx Bold Boulder',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '015A' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Flare on YOU',
          de: 'Flare auf DIR',
          fr: 'Brasier sur VOUS',
          ja: '自分にフレア',
          cn: '核爆点名',
          ko: '플레어 대상자',
        },
      },
    },
    {
      id: 'BarbaricciaEx Playstation Hair Chains',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker(),
      condition: Conditions.targetIsYou(),
      alertText: (_data, matches, output) => {
        switch (matches.id) {
          case '016F':
            return output.circle!();
          case '0170':
            return output.triangle!();
          case '0171':
            return output.square!();
          case '0172':
            return output.cross!();
        }
      },
      outputStrings: {
        circle: {
          en: 'Red Circle',
          de: 'Roter Kreis',
          fr: 'Cercle rouge',
          ja: '赤まる',
          cn: '红圈',
          ko: '빨강 동그라미',
        },
        triangle: {
          en: 'Green Triangle',
          de: 'Grünes Dreieck',
          fr: 'Triangle vert',
          ja: '緑さんかく',
          cn: '绿三角',
          ko: '초록 삼각',
        },
        square: {
          en: 'Purple Square',
          de: 'Lilanes Viereck',
          fr: 'Carré violet',
          ja: '紫しかく',
          cn: '紫方块',
          ko: '보라 사각',
        },
        cross: {
          en: 'Blue X',
          de: 'Blaues X',
          fr: 'Croix bleue',
          ja: '青バツ',
          cn: '蓝叉',
          ko: '파랑 X',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Barbariccia': 'Barbarizia',
        'Stiff Breeze': 'Föhn',
      },
      'replaceText': {
        'Blow Away': 'Hauerwelle',
        'Blustery Ruler': 'Tosende Herrin',
        'Bold Boulder': 'Feister Fels',
        '(?<!(Brittle|Bold) )Boulder(?! Break)': 'Fels',
        'Boulder Break': 'Felsbruch',
        'Brittle Boulder': 'Feiner Fels',
        'Brush with Death': 'Haaresbreite',
        'Brutal Gust': 'Grausame Bö',
        'Brutal Rush': 'Grausame Hatz',
        'Catabasis': 'Katabasis',
        'Curling Iron': 'In Schale',
        'Deadly Twist': 'Flechtfolter',
        'Dry Blows': 'Haue',
        'Entanglement': 'Fesselnde Strähnen',
        'Fetters': 'Fesselung',
        'Hair Raid': 'Haarstreich',
        'Hair Spray': 'Wildwuchs',
        'Impact': 'Impakt',
        'Iron Out': 'Coiffure',
        'Knuckle Drum': 'Kahlhieb',
        'Maelstrom': 'Charybdis',
        'Raging Storm': 'Tobender Sturm',
        'Savage Barbery': 'Brutale Barbierei',
        'Secret Breeze': 'Heimlicher Hauch',
        '(?<!(Teasing |En))Tangle': 'Strähne',
        'Teasing Tangles': 'Sinistre Strähnen',
        'Tornado Chain': 'Kettenorkan',
        'Tousle': 'Föhn',
        'Trample': 'Trampeln',
        'Upbraid': 'Sturmfrisur',
        'Void Aero III': 'Nichts-Windga',
        'Void Aero IV': 'Nichts-Windka',
        'Voidstrom': 'Nichtssturm',
        'Winding Gale': 'Windende Winde',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Barbariccia': 'Barbariccia',
        'Stiff Breeze': 'rafale de vent',
      },
      'replaceText': {
        'Blow Away': 'Coups convulsifs',
        'Blustery Ruler': 'Despote venteux',
        'Bold Boulder': 'Grand conglomérat',
        '(?<!(Brittle|Bold) )Boulder(?! Break)': 'Conglomérat',
        'Boulder Break': 'Conglomérat pesant',
        'Brittle Boulder': 'Petit conglomérat',
        'Brush with Death': 'Brossage mortel',
        'Brutal Gust': 'Rafale brutale',
        'Brutal Rush': 'Ruée brutale',
        'Catabasis': 'Catabase',
        'Curling Iron': 'Boucle de fer',
        'Deadly Twist': 'Nœud fatal',
        'Dry Blows': 'Coups secs',
        'Entanglement': 'Enchevêtrement',
        'Fetters': 'Attache',
        'Hair Raid': 'Raid capillaire',
        'Hair Spray': 'Tresse laquée',
        'Impact': 'Impact',
        'Iron Out': 'Repassage capillaire',
        'Knuckle Drum': 'Batterie de poings',
        'Maelstrom': 'Charybde',
        'Raging Storm': 'Tempête enragée',
        'Savage Barbery': 'Barbarie sauvage',
        'Secret Breeze': 'Brise secrète',
        '(?<!(Teasing |En))Tangle': 'Emmêlement',
        'Teasing Tangles': 'Emmêlement railleur',
        'Tornado Chain': 'Chaîne de tornades',
        'Tousle': 'Ébourrifage',
        'Trample': 'Martèlement',
        'Upbraid': 'Natte sermonneuse',
        'Void Aero III': 'Méga Vent du néant',
        'Void Aero IV': 'Giga Vent du néant',
        'Voidstrom': 'Tempête du néant',
        'Winding Gale': 'Vent sinueux',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Barbariccia': 'バルバリシア',
        'Stiff Breeze': '荒風',
      },
      'replaceText': {
        'Blow Away': '拳震動地',
        'Blustery Ruler': 'ブロウルーラー',
        'Bold Boulder': '大岩礫',
        '(?<!(Brittle|Bold) )Boulder(?! Break)': '岩礫',
        'Boulder Break': '重岩礫',
        'Brittle Boulder': '小岩礫',
        'Brush with Death': '呪髪操作',
        'Brutal Gust': 'ブルータルガスト',
        'Brutal Rush': 'ブルータルラッシュ',
        'Catabasis': 'カタバシス',
        'Curling Iron': '呪髪装衣',
        'Deadly Twist': '呪髪穿',
        'Dry Blows': '拳震',
        'Entanglement': '呪髪呪縛',
        'Fetters': '拘束',
        'Hair Raid': 'ヘアレイド',
        'Hair Spray': '呪髪針',
        'Impact': '衝撃',
        'Iron Out': '髪衣還元',
        'Knuckle Drum': 'ナックルビート',
        'Maelstrom': 'ミールストーム',
        'Raging Storm': 'レイジングストーム',
        'Savage Barbery': 'サベッジバルバリー',
        'Secret Breeze': 'シークレットブリーズ',
        '(?<!(Teasing |En))Tangle': '呪髪',
        'Teasing Tangles': '呪髪拘束',
        'Tornado Chain': 'チェイントルネード',
        'Tousle': '荒風',
        'Trample': '踏みつけ',
        'Upbraid': '呪髪嵐',
        'Void Aero III': 'ヴォイド・エアロガ',
        'Void Aero IV': 'ヴォイド・エアロジャ',
        'Voidstrom': 'ヴォイドストーム',
        'Winding Gale': 'ウィンディングゲイル',
      },
    },
  ],
};

export default triggerSet;
