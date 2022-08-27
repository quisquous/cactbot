import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheFellCourtOfTroia,
  timelineFile: 'the_fell_court_of_troia.txt',
  triggers: [
    {
      id: 'Troia Evil Dreamer Dark Vision',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Evil Dreamer', id: ['73BB', '73B8'], capture: false }),
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Avoid Eye Lasers',
          de: 'Weiche dem Augenlaser aus',
          fr: 'Évitez les yeux',
        },
      },
    },
    {
      id: 'Troia Beatrice Void Gravity',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Evil Dreamer', id: '73BA' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Troia Evil Dreamer Unite Mare',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Evil Dreamer', id: '73BC', capture: false }),
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Kill One Eye',
          de: 'Besiege ein Auge',
          fr: 'Tuez un Œil',
        },
      },
    },
    {
      id: 'Troia Beatrice Death Forseen Self',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Beatrice', id: '747D' }),
      response: Responses.lookAwayFromSource(),
    },
    {
      id: 'Troia Beatrice Death Forseen Other',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Beatrice', id: '7484', capture: false }),
      // TODO: calling out twice seems noisy, but not sure what else to say
      suppressSeconds: 10,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Look Away from Rings',
          de: 'Schau von den Ringen weg',
          fr: 'Ne regardez pas l\'anneau',
        },
      },
    },
    {
      id: 'Troia Beatrice Beatific Scorn',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Beatrice', id: '7475', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Away From Exploding Lines',
          de: 'Weg von den explodierenden Linien',
          fr: 'Éloignez-vous des lignes explosives',
        },
      },
    },
    {
      id: 'Troia Beatrice Hush',
      type: 'StartsUsing',
      // Does not cleave.
      netRegex: NetRegexes.startsUsing({ source: 'Beatrice', id: '7480' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'Troia Beatrice Void Nail',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Beatrice', id: '747F' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Troia Beatrice Eye of Troia',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Beatrice', id: '747A', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Troia Beatrice Antipressure',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Beatrice', id: '79E8' }),
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Troia Scarmiglione Cursed Echo',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Scarmiglione', id: '7631', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'aoe + bleed',
          de: 'AoE + Blutung',
          fr: 'AoE + Saignement',
          ja: 'AoE + DoT',
          cn: 'AOE + 流血',
          ko: '전체 공격 + 출혈',
        },
      },
    },
    {
      id: 'Troia Scarmiglione Rotten Rampage',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Scarmiglione', id: '7619' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Troia Scarmiglione Vacuum Wave',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Scarmiglione', id: '761C', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Knockback Into Wall',
          de: 'Rückstoß in eine Wand',
          fr: 'Faites-vous pousser sur un mur',
        },
      },
    },
    {
      id: 'Troia Scarmiglione Blighted Bladework',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Scarmiglione', id: '7633', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get Behind and Out',
          de: 'Geh nach Hinten und Raus',
          fr: 'Passez derrière et extérieur',
        },
      },
    },
    {
      id: 'Troia Scarmiglione Blighted Sweep',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Scarmiglione', id: '7635', capture: false }),
      response: Responses.getBehind(),
    },
    {
      id: 'Troia Scarmiglione Void Vortex',
      type: 'StartsUsing',
      // 7623 during add phase, 762E after
      netRegex: NetRegexes.startsUsing({ source: 'Scarmiglione', id: ['7623', '762E'] }),
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Troia Scarmiglione Void Gravity',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Scarmiglione', id: '7622' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Beatrice': 'Beatrice',
        'Evil Dreamer': 'bös(?:e|er|es|en) Träumer',
        'Penitence': 'Sühneshalle',
        'Scarmiglione': 'Scarmiglione',
        'The Seat Of The Foremost': 'Sitz der Hohepriesterin',
        'The Garden Of Epopts': 'Garten der Schwestern',
      },
      'replaceText': {
        'Antipressure': 'Nichtsdruck',
        'Beatific Scorn': 'Seliger Zorn',
        'Blighted Bedevilment': 'Verderbte Verhexung',
        'Blighted Bladework': 'Verderbtes Fechten',
        'Blighted Sweep': 'Verderbter Schwung',
        'Corruptor\'s Pitch': 'Morast des Verderbers',
        'Creeping Decay': 'Schleichendes Siechtum',
        'Cursed Echo': 'Fluches Hall',
        'Dark Vision': 'Dunkle Vision',
        'Death Foreseen': 'Tödliche Vorsehung',
        'Endless Nightmare': 'Ewiger Albtraum',
        'Eye of Troia': 'Auge von Troia',
        'Firedamp': 'Grubengas',
        'Hush': 'Totenstill',
        'Nox': 'Nox',
        'Rotten Rampage': 'Fauliger Amok',
        'Toric Void': 'Nichts-Torus',
        'Unite Mare': 'Alltraum',
        'Vacuum Wave': 'Vakuumwelle',
        'Void Gravity': 'Nichts-Gravitas',
        'Void Nail': 'Nichtsnagel',
        'Void Vortex': 'Nichtssog',
        'Voidshaker': 'Nichtsstoß',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Beatrice': 'Béatrice',
        'Evil Dreamer': 'rêveur maudit',
        'Penitence': 'Salle des admonestations',
        'Scarmiglione': 'Scarmiglione',
        'The Seat Of The Foremost': 'Salle des primiciers',
        'The Garden Of Epopts': 'Enclos des sœurs',
      },
      'replaceText': {
        'Antipressure': 'Pression du néant',
        'Beatific Scorn': 'Lueur mystique',
        'Blighted Bedevilment': 'Pirouette nécrophage',
        'Blighted Bladework': 'Lacération nécrophage',
        'Blighted Sweep': 'Balayage nécrophage',
        'Corruptor\'s Pitch': 'Bourbier corrupteur',
        'Creeping Decay': 'Déclin rampant',
        'Cursed Echo': 'Écho maudit',
        'Dark Vision': 'Vision cauchemardesque',
        'Death Foreseen': 'Œil de la faucheuse',
        'Endless Nightmare': 'Cauchemar sans fin',
        'Eye of Troia': 'Œil de Troïa',
        'Firedamp': 'Vapeur de feu',
        'Hush': 'Mise sous silence',
        'Nox': 'Nox',
        'Rotten Rampage': 'Ravage putride',
        'Toric Void': 'Tore du néant',
        'Unite Mare': 'Cauchemar traumatique',
        'Vacuum Wave': 'Vague de vide',
        'Void Gravity': 'Gravité du néant',
        'Void Nail': 'Clou du néant',
        'Void Vortex': 'Vortex du néant',
        'Voidshaker': 'Secousse du néant',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Beatrice': 'ベアトリーチェ',
        'Evil Dreamer': 'ドリームエビル',
        'Penitence': '責罪広場',
        'Scarmiglione': 'スカルミリョーネ',
        'The Seat Of The Foremost': '筆頭神官の間',
        'The Garden Of Epopts': '姉妹たちの園',
      },
      'replaceText': {
        'Antipressure': 'ヴォイドプレッシャー',
        'Beatific Scorn': '魔光閃',
        'Blighted Bedevilment': '死喰剣・旋転',
        'Blighted Bladework': '死喰剣・断裁',
        'Blighted Sweep': '死喰剣・払除',
        'Corruptor\'s Pitch': 'コラプターズ・ピッチ',
        'Creeping Decay': '腐屍招来',
        'Cursed Echo': 'カースドエコー',
        'Dark Vision': '夢魔の視線',
        'Death Foreseen': '死の魔眼',
        'Endless Nightmare': '死重爆',
        'Eye of Troia': 'トロイアの魔眼',
        'Firedamp': 'ファイアダンプ',
        'Hush': 'ハッシュスイング',
        'Nox': 'ノックス',
        'Rotten Rampage': 'ロトンランページ',
        'Toric Void': 'ヴォイドトーラス',
        'Unite Mare': '重魂爆',
        'Vacuum Wave': '真空波',
        'Void Gravity': 'ヴォイド・グラビデ',
        'Void Nail': 'ヴォイドネイル',
        'Void Vortex': 'ヴォイドヴォーテックス',
        'Voidshaker': 'ヴォイドシェイカー',
      },
    },
  ],
};

export default triggerSet;
