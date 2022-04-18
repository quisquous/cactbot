import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.AlzadaalsLegacy,
  timelineFile: 'alzadaals_legacy.txt',
  triggers: [
    {
      id: 'Alzadaal Big Wave',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6F60', source: 'Ambujam', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6F60', source: 'Ambujam', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6F60', source: 'Ambujam', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6F60', source: 'アムブジャ', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Alzadaal Tentacle Dig',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['6F55', '6559'], source: 'Ambujam', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['6F55', '6559'], source: 'Ambujam', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['6F55', '6559'], source: 'Ambujam', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['6F55', '6559'], source: 'アムブジャ', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Avoid tentacle explosions',
          de: 'Weiche Tentakel-Explosion aus',
        },
      },
    },
    {
      id: 'Alzadaal Fountain',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '731A', source: 'Ambujam', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '731A', source: 'Ambujam', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '731A', source: 'Ambujam', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '731A', source: 'アムブジャ', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Dodge 3 to 1',
          de: 'Weiche von 3 auf 1 aus',
        },
      },
    },
    {
      id: 'Alzadaal Diffusion Ray',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6F1E', source: 'Armored Chariot', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6F1E', source: 'Gepanzert(?:e|er|es|en) Chariot', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6F1E', source: 'Char Cuirassé', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6F1E', source: 'アーマード・チャリオット', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Alzadaal Rail Cannon',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6F1F', source: 'Armored Chariot' }),
      netRegexDe: NetRegexes.startsUsing({ id: '6F1F', source: 'Gepanzert(?:e|er|es|en) Chariot' }),
      netRegexFr: NetRegexes.startsUsing({ id: '6F1F', source: 'Char Cuirassé' }),
      netRegexJa: NetRegexes.startsUsing({ id: '6F1F', source: 'アーマード・チャリオット' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'Alzadaal Articulated Bits',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6F19', source: 'Armored Chariot', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6F19', source: 'Gepanzert(?:e|er|es|en) Chariot', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6F19', source: 'Char Cuirassé', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6F19', source: 'アーマード・チャリオット', capture: false }),
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Avoid bit lasers',
          de: 'Weiche Drohnen-Laser aus',
        },
      },
    },
    {
      id: 'Alzadaal Graviton Cannon',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7373', source: 'Armored Chariot' }),
      netRegexDe: NetRegexes.startsUsing({ id: '7373', source: 'Gepanzert(?:e|er|es|en) Chariot' }),
      netRegexFr: NetRegexes.startsUsing({ id: '7373', source: 'Char Cuirassé' }),
      netRegexJa: NetRegexes.startsUsing({ id: '7373', source: 'アーマード・チャリオット' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 4,
      response: Responses.spread(),
    },
    {
      id: 'Alzadaal Billowing Bolts',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6F70', source: 'Kapikulu', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6F70', source: 'Kapikulu', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6F70', source: 'Kapikulu', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6F70', source: 'カプクル', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Alzadaal Spin Out',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6F63', source: 'Kapikulu', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6F63', source: 'Kapikulu', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6F63', source: 'Kapikulu', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6F63', source: 'カプクル', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Steer away from spikes',
          de: 'Weg von den Stacheln lenken',
        },
      },
    },
    {
      id: 'Alzadaal Power Serge',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6F6A', source: 'Kapikulu', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6F6A', source: 'Kapikulu', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6F6A', source: 'Kapikulu', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6F6A', source: 'カプクル', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Avoid tethered color',
          de: 'Weiche der verbundenen Farbe aus',
        },
      },
    },
    {
      id: 'Alzadaal Magnitude Opus',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '00A1' }),
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Alzadaal Rotary Gale',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0060' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Alzadaal Crewel Slice',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6F72', source: 'Kapikulu' }),
      netRegexDe: NetRegexes.startsUsing({ id: '6F72', source: 'Kapikulu' }),
      netRegexFr: NetRegexes.startsUsing({ id: '6F72', source: 'Kapikulu' }),
      netRegexJa: NetRegexes.startsUsing({ id: '6F72', source: 'カプクル' }),
      response: Responses.tankBuster(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceSync': {
        'Corrosive Venom/Toxic Shower': 'Venom/Shower',
        'Corrosive Fountain/Toxic Fountain': 'Fountain',
        'Magnitude Opus/Rotary Gale': 'Opus/Gale',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'Ambujam': 'Ambujam',
        'Armored Chariot': 'gepanzert(?:e|er|es|en) Chariot',
        'Armored Drudge': 'gepanzert(?:e|er|es|en) Sklave',
        'Kapikulu': 'Kapikulu',
        'Scarlet Tentacle': 'Scharlachtentakel',
        'The Threshold Of Bounty': 'Schwelle zum Reichtum',
        'The Undersea Entrance': 'Versunkene Pforte',
        'Weaver\'S Warding': 'Webers Wehr',
      },
      'replaceText': {
        'Articulated Bits': 'Satellitenarme',
        'Assail': 'Anstürmen',
        'Assault Cannon': 'Sturmkanone',
        'Basting Blade': 'Kaschmirklinge',
        'Big Wave': 'Gigantische Welle',
        'Billowing Bolts': 'Bauschende Ballen',
        'Corrosive Fountain': 'Ätzender Geysir',
        'Corrosive Venom': 'Ätzendes Gift',
        'Crewel Slice': 'Seidenschnitt',
        'Diffusion Ray': 'Diffusionsstrahl',
        'Graviton Cannon': 'Gravitonkanone',
        'Magnitude Opus': 'Magnitude Opus',
        'Mana Explosion': 'Mana-Explosion',
        'Power Serge': 'Vervliesung',
        'Rail Cannon': 'Magnetschienenkanone',
        'Rotary Gale': 'Spinnsturm',
        'Spin Out': 'Spinner',
        'Tentacle Dig': 'Tentakelgraber',
        'Toxin Shower': 'Giftsprüher',
        'Wild Weave': 'Wildes Weben',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Ambujam': 'Ambujam',
        'Armored Chariot': 'char cuirassé',
        'Armored Drudge': 'esclave cuirassé',
        'Kapikulu': 'Kapikulu',
        'Scarlet Tentacle': 'tentacule pourpre',
        'The Threshold Of Bounty': 'Chambre de l\'Abondance',
        'The Undersea Entrance': 'Hall dévasté',
        'Weaver\'S Warding': 'Chambre scellée du tisserand',
      },
      'replaceText': {
        'Articulated Bits': 'Main autonome',
        'Assail': 'Ordre de couverture',
        'Assault Cannon': 'Canon d\'assaut',
        'Basting Blade': 'Lame rayonnante',
        'Big Wave': 'Lame de fond',
        'Billowing Bolts': 'Diffraction textile',
        'Corrosive Fountain': 'Jet d\'acide',
        'Corrosive Venom': 'Acidochorie',
        'Crewel Slice': 'Lame dansante',
        'Diffusion Ray': 'Rayon diffuseur',
        'Graviton Cannon': 'Canon gravitationnel',
        'Magnitude Opus': 'Craquement terrestre',
        'Mana Explosion': 'Explosion de mana',
        'Power Serge': 'Étoffes chargées',
        'Rail Cannon': 'Canon électrique',
        'Rotary Gale': 'Bourrasque tranchante',
        'Spin Out': 'Toupie mortelle',
        'Tentacle Dig': 'Tentacule enfoui',
        'Toxin Shower': 'Vénénochorie',
        'Wild Weave': 'Étoffes virevoltantes',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Ambujam': 'アムブジャ',
        'Armored Chariot': 'アーマード・チャリオット',
        'Armored Drudge': 'アーマード・スレイヴ',
        'Kapikulu': 'カプクル',
        'Scarlet Tentacle': '紅の触手',
        'The Threshold Of Bounty': '豊穣の間',
        'The Undersea Entrance': '崩れかけた広間',
        'Weaver\'S Warding': '封宝の間',
      },
      'replaceText': {
        'Articulated Bits': 'ハンドビット',
        'Assail': '攻撃指示',
        'Assault Cannon': 'アサルトカノン',
        'Basting Blade': '人形剣閃',
        'Big Wave': 'ビッグウェーブ',
        'Billowing Bolts': '魔布法陣',
        'Corrosive Fountain': '酸液噴出',
        'Corrosive Venom': '酸液散布',
        'Crewel Slice': '人形剣技',
        'Diffusion Ray': 'ディフュージョンレイ',
        'Graviton Cannon': 'グラビトンキャノン',
        'Magnitude Opus': '崩土',
        'Mana Explosion': '魔力爆発',
        'Power Serge': '魔布入精',
        'Rail Cannon': 'レールキャノン',
        'Rotary Gale': '刻風',
        'Spin Out': '四方八方帯回し',
        'Tentacle Dig': '触手潜行',
        'Toxin Shower': '毒液散布',
        'Wild Weave': '魔布散開',
      },
    },
  ],
};

export default triggerSet;
