import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  orbCount: number;
  orbs: Map<'Fire' | 'Bio', number>;
}

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheTowerOfZot,
  timelineFile: 'the_tower_of_zot.txt',
  initData: () => {
    return {
      orbCount: 0,
      orbs: new Map<'Fire' | 'Bio', number>(),
    };
  },
  triggers: [
    {
      id: 'Zot Minduruva Bio',
      type: 'StartsUsing',
      // 62CA in the final phase.
      netRegex: NetRegexes.startsUsing({ id: ['62A9', '62CA'], source: 'Minduruva' }),
      netRegexDe: NetRegexes.startsUsing({ id: ['62A9', '62CA'], source: 'Rug' }),
      netRegexFr: NetRegexes.startsUsing({ id: ['62A9', '62CA'], source: 'Anabella' }),
      netRegexJa: NetRegexes.startsUsing({ id: ['62A9', '62CA'], source: 'ラグ' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'Zot Minduruva Transmute Counter',
      type: 'StartsUsing',
      // 629A = Transmute Fire III
      // 631B = Transmute Blizzard III
      // 631C = Transmute Thunder III
      // 631D = Transmute Bio III
      netRegex: NetRegexes.startsUsing({ id: ['629A', '631[BCD]'], source: 'Minduruva' }),
      netRegexDe: NetRegexes.startsUsing({ id: ['629A', '631[BCD]'], source: 'Rug' }),
      netRegexFr: NetRegexes.startsUsing({ id: ['629A', '631[BCD]'], source: 'Anabella' }),
      netRegexJa: NetRegexes.startsUsing({ id: ['629A', '631[BCD]'], source: 'ラグ' }),
      run: (data, matches) => {
        const transmuteFire = '629A';
        const transmuteBio = '631D';

        data.orbCount++;

        // We only expect one of these at once
        if (matches.id === transmuteFire)
          data.orbs.set('Fire', data.orbCount);
        else if (matches.id === transmuteBio)
          data.orbs.set('Bio', data.orbCount);
      },
    },
    {
      id: 'Zot Minduruva Manusya III',
      type: 'StartsUsing',
      // 6291 = Manusya Fire III
      // 6292 = Manusya Blizzard III
      // 6293 = Manusya Thunder III
      // 6294 = Manusya Bio III
      netRegex: NetRegexes.startsUsing({ id: ['629[1-4]'], source: 'Minduruva' }),
      netRegexDe: NetRegexes.startsUsing({ id: ['629[1-4]'], source: 'Rug' }),
      netRegexFr: NetRegexes.startsUsing({ id: ['629[1-4]'], source: 'Anabella' }),
      netRegexJa: NetRegexes.startsUsing({ id: ['629[1-4]'], source: 'ラグ' }),
      durationSeconds: (data) => {
        // Based on network log data analysis, the first orb will finish
        // 8 seconds after this cast started, while the second orb will
        // finish 12 seconds after this cast started.
        //
        // For simplicity, if we have an overlapping mechanic, use a
        // duration of 12 to keep this alert up long enough to cover all
        // cases.
        if (data.orbs.size > 0)
          return 12;
      },
      alertText: (data, matches, output) => {
        const fire = '6291';
        const blizzard = '6292';
        const thunder = '6293';
        const bio = '6294';

        if (matches.id === blizzard || matches.id === thunder) {
          if (data.orbs.has('Fire'))
            return output.fireOrb!({ num: data.orbs.get('Fire') });
          else if (data.orbs.has('Bio'))
            return output.bioOrb!({ num: data.orbs.get('Bio') });
        } else if (matches.id === fire) {
          if (data.orbs.has('Bio'))
            return output.fireThenBio!({ num: data.orbs.get('Bio') });

          return output.getUnder!();
        } else if (matches.id === bio) {
          if (data.orbs.has('Fire'))
            return output.bioThenFire!({ num: data.orbs.get('Fire') });

          return output.getBehind!();
        }
      },
      outputStrings: {
        fireOrb: {
          en: 'Under Orb ${num}',
          de: 'Unter den ${num}. Orb',
          fr: 'En dessous l\'orbe ${num}',
          ja: '${num}番目の玉へ',
          cn: '靠近第${num}个球',
          ko: '${num}번 구슬 밑으로',
        },
        bioOrb: {
          en: 'Behind Orb ${num}',
          de: 'Hinter den ${num}. Orb',
          fr: 'Allez derrière l\'orbe ${num}',
          ja: '${num}番目の玉の後ろへ',
          cn: '去第${num}个球的终点方向贴边',
          ko: '${num}번 구슬 뒤로',
        },
        fireThenBio: {
          en: 'Get Under => Behind Orb ${num}',
          de: 'Unter ihn => Hinter den ${num}. Orb',
          fr: 'En dessous => Allez derrière l\'orbe ${num}',
          ja: 'ボスに貼り付く=> ${num}番目の玉の後ろへ',
          cn: '去脚下 => 去第${num}个球的终点方向贴边',
          ko: '보스 아래로 => ${num}번 구슬 뒤로',
        },
        bioThenFire: {
          en: 'Get Behind => Under Orb ${num}',
          de: 'Hinter ihn => Unter den ${num}. Orb',
          fr: 'Passez derrière => En dessous l\'orbe ${num}',
          ja: '背面へ => ${num}番目の玉へ',
          cn: '去背后 => 靠近第${num}个球',
          ko: '보스 뒤로 => ${num}번 구슬 밑으로',
        },
        getUnder: Outputs.getUnder,
        getBehind: Outputs.getBehind,
      },
    },
    {
      id: 'Zot Minduruva Dhrupad Reset',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '629C', source: 'Minduruva', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '629C', source: 'Rug', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '629C', source: 'Anabella', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '629C', source: 'ラグ', capture: false }),
      // There's a Dhrupad cast after every transmute sequence.
      run: (data) => {
        data.orbCount = 0;
        data.orbs = new Map<'Fire' | 'Bio', number>();
      },
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
          de: 'Hinter den leeren Spot gehen',
          fr: 'Allez derrière un espace vide',
          ja: '玉のない箇所へ',
          cn: '去没球球的角落贴边',
          ko: '빈 공간 끝으로',
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
          de: 'Geh hinter den ruhigen Klon',
          fr: 'Allez derrière le vrai clone',
          ja: '動いていないドグの後ろへ',
          cn: '找不动的boss',
          ko: '가만히 있는 분신 뒤로',
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
        'Delayed Element III': '玉：？？？ガ',
        'Delta Attack': 'デルタアタック',
        'Delta Blizzard/Fire/Thunder III': 'デルタ・ブリザガ/ファイガ/サンダガ',
        'Dhrupad': 'ドゥルパド',
        'Explosive Force': '起爆',
        'Isitva Siddhi': 'イシトヴァシッディ',
        'Manusya Berserk': 'マヌシャ・バーサク',
        'Manusya Bio(?! )': 'マヌシャ・バイオ',
        'Manusya Bio III': 'マヌシャ・バイオガ',
        'Manusya Blizzard(?! )': 'マヌシャ・ブリザド',
        'Manusya Blizzard III': 'マヌシャ・ブリザガ',
        'Manusya Confuse': 'マヌシャ・コンフュ',
        'Manusya Element III': 'マヌシャ・？？？ガ',
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
        'Transmute Element III': '魔力操作：？？？ガ',
        'Transmute Thunder III': '魔力操作：サンダガ',
      },
    },
  ],
};

export default triggerSet;
