import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: how to call out Astral Flow rotations? Behemoths can be adjacent/catty corner
// TODO: Esoteric Ray has only one id for starting mid / starting sides (maybe startsUsing pos?)
// TODO: Exoterikos has differentiating ids, but need to know where (maybe startsUsing pos?)
// TODO: Astral Eclipse star patterns? Are they fixed?
// TODO: in the last phase, is the Exoterikos always Sect during Triple Esoteric Ray?
// TODO: heal to full for Kokytos

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheDarkInside,
  timelineFile: 'zodiark.txt',
  triggers: [
    {
      id: 'Zodiark Ania',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6B62', source: 'Zodiark' }),
      netRegexDe: NetRegexes.startsUsing({ id: '6B62', source: 'Zodiark' }),
      netRegexFr: NetRegexes.startsUsing({ id: '6B62', source: 'Zordiarche' }),
      netRegexJa: NetRegexes.startsUsing({ id: '6B62', source: 'ゾディアーク' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'Zodiark Algedon NE',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '67D1', source: 'Zodiark', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '67D1', source: 'Zodiark', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '67D1', source: 'Zordiarche', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '67D1', source: 'ゾディアーク', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      // Warn about knockback just as a precaution in case players don't make it.
      // Also, technically NE/SW is safe, but having all players run together is better.
      outputStrings: {
        text: {
          en: 'Go NE (knockback)',
          de: 'Geh nach NO (Rückstoß)',
          fr: 'Allez au NE (poussée)',
          cn: '去右上(东北)',
          ko: '북동쪽으로 (넉백)',
        },
      },
    },
    {
      id: 'Zodiark Algedon NW',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '67D2', source: 'Zodiark', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '67D2', source: 'Zodiark', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '67D2', source: 'Zordiarche', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '67D2', source: 'ゾディアーク', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Go NW (knockback)',
          de: 'Geh nach NW (Rückstoß)',
          fr: 'Allez au NO (poussée)',
          cn: '去左上(西北)',
          ko: '북서쪽으로 (넉백)',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Esoteric Dyad/Esoteric Sect': 'Esoteric Dyad/Sect',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'Arcane Sigil': 'Geheimzeichen',
        'Behemoth': 'Behemoth',
        'Python': 'Python',
        'Zodiark': 'Zodiark',
      },
      'replaceText': {
        'Adikia': 'Adikia',
        'Algedon': 'Algedon',
        'Ania': 'Ania',
        'Astral Eclipse': 'Astraleklipse',
        'Astral Flow': 'Lichtstrom',
        'Complete Control': 'Totale Verbindung',
        'Esoteric Dyad': 'Esoterische Dyade',
        '(?<!Triple )Esoteric Ray': 'Esoterischer Strahl',
        'Esoteric Sect': 'Esoterische Sekte',
        '(?<!Trimorphos )Exoterikos': 'Exoterikos',
        'Explosion': 'Explosion',
        'Kokytos': 'Kokytos',
        'Meteoros Eidolon': 'Meteoros',
        'Opheos Eidolon': 'Opheos',
        'Paradeigma': 'Paradeigma',
        'Phlegethon': 'Phlegethon',
        'Styx': 'Styx',
        'Trimorphos Exoterikos': 'Trimorphos Exoterikos',
        'Triple Esoteric Ray': 'Esoterischer Dreierstrahl',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Arcane Sigil': 'emblème secret',
        'Behemoth': 'béhémoth',
        'Python': 'Python',
        'Zodiark': 'Zordiarche',
      },
      'replaceText': {
        'Adikia': 'Adikia',
        'Algedon': 'Algedon',
        'Ania': 'Ania',
        'Astral Eclipse': 'Éclipse astrale',
        'Astral Flow': 'Flux astral',
        'Complete Control': 'Contrôle total',
        'Esoteric Dyad(?!/)': 'Dyade ésotérique',
        'Esoteric Dyad/Esoteric Sect': 'Dyade/Cabale ésotérique',
        '(?<!Triple )Esoteric Ray': 'Rayon ésotérique',
        '(?<!/)Esoteric Sect': 'Cabale ésotérique',
        '(?<!Trimorphos )Exoterikos': 'Exoterikos',
        'Explosion': 'Explosion',
        'Kokytos': 'Kokytos',
        'Meteoros Eidolon': 'Meteoros',
        'Opheos Eidolon': 'Opheos',
        'Paradeigma': 'Paradeigma',
        'Phlegethon': 'Phlégéthon',
        'Styx': 'Styx',
        'Trimorphos Exoterikos': 'Trimorphos Exoterikos',
        'Triple Esoteric Ray': 'Rayon ésotérique triple',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Arcane Sigil': '秘紋',
        'Behemoth': 'ベヒーモス',
        'Python': 'ピュトン',
        'Zodiark': 'ゾディアーク',
      },
      'replaceText': {
        'Adikia': 'アディキア',
        'Algedon': 'アルゲドン',
        'Ania': 'アニア',
        'Astral Eclipse': 'アストラルエクリプス',
        'Astral Flow': 'アストラルフロウ',
        'Complete Control': '完全接続',
        'Esoteric Dyad': 'エソテリックダイアド',
        '(?<!Triple )Esoteric Ray': 'エソテリックレイ',
        'Esoteric Sect': 'エソテリックセクト',
        '(?<!Trimorphos )Exoterikos': 'エクソーテリコス',
        'Explosion': '爆発',
        'Kokytos': 'コキュートス',
        'Meteoros Eidolon': 'メテオロス・エイドロン',
        'Opheos Eidolon': 'オフェオス・エイドロン',
        'Paradeigma': 'パラデイグマ',
        'Phlegethon': 'プレゲトン',
        'Styx': 'ステュクス',
        'Trimorphos Exoterikos': 'トライ・エクソーテリコス',
        'Triple Esoteric Ray': 'トライ・エソテリックレイ',
      },
    },
  ],
};

export default triggerSet;
