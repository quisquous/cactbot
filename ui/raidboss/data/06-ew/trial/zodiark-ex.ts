import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheMinstrelsBalladZodiarksFall,
  timelineFile: 'zodiark-ex.txt',
  triggers: [
    {
      id: 'Zodiark Ania',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '67EF', source: 'Zodiark' }),
      netRegexDe: NetRegexes.startsUsing({ id: '67EF', source: 'Zodiark' }),
      netRegexFr: NetRegexes.startsUsing({ id: '67EF', source: 'Zordiarche' }),
      netRegexJa: NetRegexes.startsUsing({ id: '67EF', source: 'ゾディアーク' }),
      response: Responses.tankBuster(),
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
        'Esoteric Dyad': 'Dyade ésotérique',
        '(?<!Triple )Esoteric Ray': 'Rayon ésotérique',
        'Esoteric Sect': 'Cabale ésotérique',
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
