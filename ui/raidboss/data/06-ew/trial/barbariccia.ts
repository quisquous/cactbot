import Conditions from '../../../../../resources/conditions';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  boldBoulderTarget?: string;
}

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.StormsCrown,
  timelineFile: 'barbariccia.txt',
  timelineTriggers: [
    {
      id: 'Barbariccia Knuckle Drum',
      regex: /Knuckle Drum/,
      beforeSeconds: 5,
      response: Responses.bigAoe(),
    },
    {
      id: 'Barbariccia Blow Away',
      regex: /Blow Away/,
      beforeSeconds: 5,
      response: Responses.getTogether('info'),
    },
  ],
  triggers: [
    {
      id: 'Barbariccia Void Aero IV',
      type: 'StartsUsing',
      netRegex: { id: '75B6', source: 'Barbariccia', capture: false },
      response: Responses.aoe(),
    },
    {
      // Savage Barbery has 3 casts that all start at the same time.
      // 6.7 duration: 7468, 748C, 748E (all actual cast bar, unknown how to differentiate)
      // 7.7 duration: 75BA (donut), 75C0 (line)
      // 9.8 duration: 75BB (out, paired with donut), 75C1 (out, paired with line)
      id: 'Barbariccia Savage Barbery Donut',
      type: 'StartsUsing',
      netRegex: { id: '75BA', source: 'Barbariccia', capture: false },
      response: Responses.getIn(),
    },
    {
      id: 'Barbariccia Savage Barbery Line',
      type: 'StartsUsing',
      netRegex: { id: '75C0', source: 'Barbariccia', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Out and Away',
          de: 'Raus und Weg',
          ja: '外へ',
          ko: '밖으로',
        },
      },
    },
    {
      id: 'Barbariccia Hair Raid Wall',
      type: 'StartsUsing',
      netRegex: { id: '75C2', source: 'Barbariccia', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Wall',
          de: 'Wand',
          ja: '壁へ',
          ko: '벽으로',
        },
      },
    },
    {
      id: 'Barbariccia Void Aero III',
      type: 'StartsUsing',
      netRegex: { id: '75B7', source: 'Barbariccia' },
      response: Responses.sharedTankBuster(),
    },
    {
      id: 'Barbariccia Deadly Twist',
      type: 'HeadMarker',
      netRegex: { id: '003E' },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Barbariccia Hair Spray',
      type: 'HeadMarker',
      netRegex: { id: '0175' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Barbariccia Brutal Rush Move',
      type: 'Ability',
      // When the Brutal Rush hits you, the follow-up Brutal Gust has locked in.
      netRegex: { id: '75C6', source: 'Barbariccia' },
      condition: Conditions.targetIsYou(),
      response: Responses.moveAway(),
    },
    {
      id: 'Barbariccia Boulder',
      type: 'HeadMarker',
      netRegex: { id: '0160' },
      condition: Conditions.targetIsYou(),
      response: Responses.awayFrom(),
    },
    {
      id: 'Barbariccia Boulder Break Tankbuster',
      type: 'StartsUsing',
      netRegex: { id: '73CF', source: 'Voidwalker', capture: false },
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: Outputs.tankBusters,
      },
    },
    {
      id: 'Barbariccia Bold Boulder',
      type: 'StartsUsing',
      netRegex: { id: '75D6', source: 'Barbariccia' },
      infoText: (data, matches, output) => {
        data.boldBoulderTarget = matches.target;
        if (data.me === matches.target)
          return output.flareOnYou!();
      },
      run: (data) => delete data.boldBoulderTarget,
      outputStrings: {
        flareOnYou: {
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
      id: 'Barbariccia Trample',
      type: 'HeadMarker',
      netRegex: { id: '0064' },
      condition: (data) => data.boldBoulderTarget !== data.me,
      delaySeconds: 0.5,
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Barbariccia Touchdown',
      type: 'StartsUsing',
      netRegex: { id: '746D', source: 'Barbariccia' },
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 5,
      response: Responses.knockback(),
    },
    {
      id: 'Barbariccia Impact',
      type: 'StartsUsing',
      netRegex: { id: '75D8', source: 'Barbariccia' },
      // Could also have used 75D9, full cast time is 5.9s
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 5,
      response: Responses.knockback('info'), // probably used on Touchdown
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Barbariccia': 'Barbarizia',
        'Voidwalker': 'Nichtswandler',
      },
      'replaceText': {
        'Blow Away': 'Hauerwelle',
        'Bold Boulder': 'Feister Fels',
        'Boulder Break': 'Felsbruch',
        'Brush with Death': 'Haaresbreite',
        'Brutal Rush': 'Grausame Hatz',
        'Catabasis': 'Katabasis',
        'Curling Iron': 'In Schale',
        'Deadly Twist': 'Flechtfolter',
        'Dry Blows': 'Haue',
        'Fetters': 'Fesselung',
        'Hair Raid': 'Haarstreich',
        'Hair Spray': 'Wildwuchs',
        'Impact': 'Impakt',
        'Knuckle Drum': 'Kahlhieb',
        'Savage Barbery': 'Brutale Barbierei',
        'Secret Breeze': 'Heimlicher Hauch',
        'Teasing Tangles': 'Sinistre Strähnen',
        'Tornado Chain': 'Kettenorkan',
        'Touchdown': 'Himmelssturz',
        'Trample': 'Trampeln',
        'Void Aero(?! )': 'Nichtswind',
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
        'Voidwalker': 'marcheuse du néant',
      },
      'replaceText': {
        'Blow Away': 'Coups convulsifs',
        'Bold Boulder': 'Grand conglomérat',
        'Boulder Break': 'Conglomérat pesant',
        'Brush with Death': 'Brossage mortel',
        'Brutal Rush': 'Ruée brutale',
        'Catabasis': 'Catabase',
        'Curling Iron': 'Boucle de fer',
        'Deadly Twist': 'Nœud fatal',
        'Dry Blows': 'Coups secs',
        'Fetters': 'Attache',
        'Hair Raid': 'Raid capillaire',
        'Hair Spray': 'Tresse laquée',
        'Impact': 'Impact',
        'Knuckle Drum': 'Batterie de poings',
        'Savage Barbery': 'Barbarie sauvage',
        'Secret Breeze': 'Brise secrète',
        'Teasing Tangles': 'Emmêlement railleur',
        'Tornado Chain': 'Chaîne de tornades',
        'Touchdown': 'Atterrissage',
        'Trample': 'Martèlement',
        'Void Aero(?! )': 'Vent du néant',
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
        'Voidwalker': 'ヴォイドウォーカー',
      },
      'replaceText': {
        'Blow Away': '拳震動地',
        'Bold Boulder': '大岩礫',
        'Boulder Break': '重岩礫',
        'Brush with Death': '呪髪操作',
        'Brutal Rush': 'ブルータルラッシュ',
        'Catabasis': 'カタバシス',
        'Curling Iron': '呪髪装衣',
        'Deadly Twist': '呪髪穿',
        'Dry Blows': '拳震',
        'Fetters': '拘束',
        'Hair Raid': 'ヘアレイド',
        'Hair Spray': '呪髪針',
        'Impact': '衝撃',
        'Knuckle Drum': 'ナックルビート',
        'Savage Barbery': 'サベッジバルバリー',
        'Secret Breeze': 'シークレットブリーズ',
        'Teasing Tangles': '呪髪拘束',
        'Tornado Chain': 'チェイントルネード',
        'Touchdown': 'タッチダウン',
        'Trample': '踏みつけ',
        'Void Aero(?! )': 'ヴォイド・エアロ',
        'Void Aero III': 'ヴォイド・エアロガ',
        'Void Aero IV': 'ヴォイド・エアロジャ',
        'Voidstrom': 'ヴォイドストーム',
        'Winding Gale': 'ウィンディングゲイル',
      },
    },
  ],
};

export default triggerSet;
