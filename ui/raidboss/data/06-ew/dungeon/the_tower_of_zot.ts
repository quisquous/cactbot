import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  orbCount: number;
}

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheTowerOfZot,
  timelineFile: 'the_tower_of_zot.txt',
  initData: () => {
    return {
      orbCount: 0,
    };
  },
  triggers: [
    {
      id: 'Zot Minduruva Bio',
      type: 'StartsUsing',
      // 62CA in the final phase.
      netRegex: NetRegexes.startsUsing({ id: ['62A9', '62CA'], source: 'Minduruva' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'Zot Minduruva Transmute Counter',
      type: 'StartsUsing',
      // 629A = Transmute Fire III
      // 631B = Transmute Blizzard III
      // 631C = Transmute Thunder III
      // 631D = Transmute Bio III
      netRegex: NetRegexes.startsUsing({ id: ['629A', '631[BCD]'], source: 'Minduruva', capture: false }),
      // FIXME: if this is `run` then data.orbCount has an off-by-one (one less) count in the emulator.
      // `run` must happen synchronously before other triggers if the trigger is not asynchronous.
      // It's possible this is a general raidboss bug as well, but it is untested.
      preRun: (data) => data.orbCount++,
    },
    {
      id: 'Zot Minduruva Transmute Fire III',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '629A', source: 'Minduruva', capture: false }),
      durationSeconds: 13,
      // These are info so that any Under/Behind from Fire III / Bio III above take precedence.
      // But, sometimes the run from Bio III -> Transmute Fire III is tight so warn ahead of
      // time which orb the player needs to run to.
      infoText: (data, _matches, output) => output.text!({ num: data.orbCount }),
      outputStrings: {
        text: {
          en: 'Under Orb ${num}',
        },
      },
    },
    {
      id: 'Zot Minduruva Transmute Bio III',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '631D', source: 'Minduruva', capture: false }),
      durationSeconds: 13,
      infoText: (data, _matches, output) => output.text!({ num: data.orbCount }),
      outputStrings: {
        text: {
          en: 'Behind Orb ${num}',
        },
      },
    },
    {
      id: 'Zot Minduruva Dhrupad Reset',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '629C', source: 'Minduruva', capture: false }),
      // There's a Dhrupad cast after every transmute sequence.
      run: (data) => data.orbCount = 0,
    },
    {
      id: 'Zot Sanduruva Isitva Siddhi',
      type: 'StartsUsing',
      // 62A9 is 2nd boss, 62C0 is 3rd boss.
      netRegex: NetRegexes.startsUsing({ id: ['62A9', '62C0'], source: 'Sanduruva' }),
      netRegexDe: NetRegexes.startsUsing({ id: ['62A9', '62C0'], source: 'Dug' }),
      netRegexFr: NetRegexes.startsUsing({ id: ['62A9', '62C0'], source: 'Samanta' }),
      netRegexJa: NetRegexes.startsUsing({ id: ['62A9', '62C0'], source: 'ドグ' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'Zot Sanduruva Manusya Berserk',
      type: 'Ability',
      // 62A1 is 2nd boss, 62BC in the 3rd boss.
      netRegex: NetRegexes.ability({ id: ['62A1', '62BC'], source: 'Sanduruva', capture: false }),
      netRegexDe: NetRegexes.ability({ id: ['62A1', '62BC'], source: 'Dug', capture: false }),
      netRegexFr: NetRegexes.ability({ id: ['62A1', '62BC'], source: 'Samanta', capture: false }),
      netRegexJa: NetRegexes.ability({ id: ['62A1', '62BC'], source: 'ドグ', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Go behind empty spot',
        },
      },
    },
    {
      id: 'Zot Sanduruva Manusya Confuse',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62A5', source: 'Sanduruva', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '62A5', source: 'Dug', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '62A5', source: 'Samanta', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '62A5', source: 'ドグ', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Go behind still clone',
        },
      },
    },
    {
      id: 'Zot Cinduruva Samsara',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62B9', source: 'Cinduruva', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '62B9', source: 'Mug', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '62B9', source: 'Maria', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '62B9', source: 'マグ', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Zot Cinduruva Isitva Siddhi',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62A9', source: 'Cinduruva' }),
      netRegexDe: NetRegexes.startsUsing({ id: '62A9', source: 'Mug' }),
      netRegexFr: NetRegexes.startsUsing({ id: '62A9', source: 'Maria' }),
      netRegexJa: NetRegexes.startsUsing({ id: '62A9', source: 'マグ' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'Zot Cinduruva Delta Thunder III Stack',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62B8', source: 'Cinduruva' }),
      netRegexDe: NetRegexes.startsUsing({ id: '62B8', source: 'Mug' }),
      netRegexFr: NetRegexes.startsUsing({ id: '62B8', source: 'Maria' }),
      netRegexJa: NetRegexes.startsUsing({ id: '62B8', source: 'マグ' }),
      response: Responses.stackMarkerOn(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Berserker Sphere': 'Tollwutssphäre',
        'Cinduruva': 'Mug',
        'Ingenuity\'s Ingress': 'Gelass der Finesse',
        'Minduruva': 'Rug',
        'Prosperity\'S Promise': 'Gelass des Reichtums',
        'Sanduruva': 'Dug',
        'Wisdom\'S Ward': 'Gelass der Weisheit',
      },
      'replaceText': {
        'Cinduruva': 'Mug',
        'Sanduruva': 'Dug',
        'Delayed Element III': 'Verzögertes Element-ga',
        'Delayed Thunder III': 'Verzögertes Blitzga',
        'Delta Attack': 'Delta-Attacke',
        'Delta Blizzard/Fire/Thunder III': 'DeltaEisga/Feuga/Blitzga',
        'Dhrupad': 'Dhrupad',
        'Explosive Force': 'Zündung',
        'Isitva Siddhi': 'Isitva Siddhi',
        'Manusya Berserk': 'Manusya-Tollwut',
        'Manusya Bio(?! )': 'Manusya-Bio',
        'Manusya Bio III': 'Manusya-Bioga',
        'Manusya Blizzard(?! )': 'Manusya-Eis',
        'Manusya Blizzard III': 'Manusya-Eisga',
        'Manusya Confuse': 'Manusya-Konfus',
        'Manusya Element III': 'Manusya Element-ga',
        'Manusya Faith': 'Manusya-Ener',
        'Manusya Fire(?! )': 'Manusya-Feuer',
        'Manusya Fire III': 'Manusya-Feuga',
        'Manusya Reflect': 'Manusya-Reflektion',
        'Manusya Stop': 'Manusya-Stopp',
        'Manusya Thunder(?! )': 'Manusya-Blitz',
        'Manusya Thunder III': 'Manusya-Blitzga',
        'Prakamya Siddhi': 'Prakamya Siddhi',
        'Prapti Siddhi': 'Prapti Siddhi',
        'Samsara': 'Samsara',
        'Sphere Shatter': 'Sphärensplitterung',
        'Transmute Thunder III': 'Manipuliertes Blitzga',
        'Transmute Element III': 'Manipuliertes Element-ga',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Berserker Sphere': 'sphère berserk',
        'Cinduruva': 'Maria',
        'Ingenuity\'s Ingress': 'Chambre de l\'habileté',
        'Minduruva': 'Anabella',
        'Prosperity\'S Promise': 'Chambre de la fortune',
        'Sanduruva': 'Samanta',
        'Wisdom\'S Ward': 'Chambre de la sagesse',
      },
      'replaceText': {
        'Cinduruva': 'Maria',
        'Delayed Element III': 'Méga Élément retardé',
        'Delayed Thunder III': 'Méga Foudre retardé',
        'Delta Attack': 'Attaque Delta',
        'Delta Blizzard/Fire/Thunder III': 'Méga Glace/Feu/Foudre delta',
        'Dhrupad': 'Dhrupad',
        'Explosive Force': 'Détonation',
        'Isitva Siddhi': 'Isitva Siddhi',
        'Manusya Berserk': 'Berserk manusya',
        'Manusya Bio(?! )': 'Bactérie manusya',
        'Manusya Bio III': 'Méga Bactérie manusya',
        'Manusya Blizzard(?! )': 'Glace manusya',
        'Manusya Blizzard III': 'Méga Glace manusya',
        'Manusya Confuse': 'Confusion manusya',
        'Manusya Element III': 'Méga Élément manusya',
        'Manusya Faith': 'Foi manusya',
        'Manusya Fire(?! )': 'Feu manusya',
        'Manusya Fire III': 'Méga Feu manusya',
        'Manusya Reflect': 'Reflet manusya',
        'Manusya Stop': 'Stop manusya',
        'Manusya Thunder(?! )': 'Foudre manusya',
        'Manusya Thunder III': 'Méga Foudre manusya',
        'Prakamya Siddhi': 'Prakamya Siddhi',
        'Prapti Siddhi': 'Prapti Siddhi',
        'Samsara': 'Samsara',
        'Sanduruva': 'Samanta',
        'Sphere Shatter': 'Rupture',
        'Transmute Element III': 'Manipulation magique : Méga Élément',
        'Transmute Thunder III': 'Manipulation magique : Méga Foudre',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Berserker Sphere': 'バーサクスフィア',
        'Cinduruva': 'マグ',
        'Ingenuity\'s Ingress': '技巧の間',
        'Minduruva': 'ラグ',
        'Prosperity\'S Promise': '富の間',
        'Sanduruva': 'ドグ',
        'Wisdom\'S Ward': '知恵の間',
      },
      'replaceText': {
        'Delta Attack': 'デルタアタック',
        'Dhrupad': 'ドゥルパド',
        'Explosive Force': '起爆',
        'Isitva Siddhi': 'イシトヴァシッディ',
        'Manusya Berserk': 'マヌシャ・バーサク',
        'Manusya Bio(?! )': 'マヌシャ・バイオ',
        'Manusya Bio III': 'マヌシャ・バイオガ',
        'Manusya Blizzard(?! )': 'マヌシャ・ブリザド',
        'Manusya Blizzard III': 'マヌシャ・ブリザガ',
        'Manusya Confuse': 'マヌシャ・コンフュ',
        'Manusya Faith': 'マヌシャ・フェイス',
        'Manusya Fire(?! )': 'マヌシャ・ファイア',
        'Manusya Fire III': 'マヌシャ・ファイガ',
        'Manusya Reflect': 'マヌシャ・リフレク',
        'Manusya Stop': 'マヌシャ・ストップ',
        'Manusya Thunder(?! )': 'マヌシャ・サンダー',
        'Manusya Thunder III': 'マヌシャ・サンダガ',
        'Prakamya Siddhi': 'プラカーミャシッディ',
        'Prapti Siddhi': 'プラプティシッディ',
        'Samsara': 'サンサーラ',
        'Sphere Shatter': '破裂',
        'Transmute Thunder III': '魔力操作：サンダガ',
      },
    },
  ],
};

export default triggerSet;
