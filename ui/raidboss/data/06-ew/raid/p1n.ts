import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: Intemperance calls out a 4th time; should only call out three
// TODO: Right/Left + Fire/Light happen at the same time later; collect these together

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.AsphodelosTheFirstCircle,
  timelineFile: 'p1n.txt',
  triggers: [
    {
      // Also happens during Aetherflail Right (65DF)
      id: 'P1N Gaoler\'s Flail Right',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6DA2', source: 'Erichthonios', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6DA2', source: 'Erichthonios', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6DA2', source: 'Érichthonios', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6DA2', source: 'エリクトニオス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '6DA2', source: '埃里克特翁尼亚斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '6DA2', source: '에리크토니오스', capture: false }),
      response: Responses.goLeft(),
    },
    {
      // Also happens during Aetherflail Left (65E0)
      id: 'P1N Gaoler\'s Flail Left',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6DA3', source: 'Erichthonios', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6DA3', source: 'Erichthonios', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6DA3', source: 'Érichthonios', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6DA3', source: 'エリクトニオス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '6DA3', source: '埃里克特翁尼亚斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '6DA3', source: '에리크토니오스', capture: false }),
      response: Responses.goRight(),
    },
    {
      id: 'P1N Warder\'s Wrath',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '65F4', source: 'Erichthonios', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '65F4', source: 'Erichthonios', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '65F4', source: 'Érichthonios', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '65F4', source: 'エリクトニオス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '65F4', source: '埃里克特翁尼亚斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '65F4', source: '에리크토니오스', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'P1N Shining Cells',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '65E9', source: 'Erichthonios', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '65E9', source: 'Erichthonios', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '65E9', source: 'Érichthonios', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '65E9', source: 'エリクトニオス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '65E9', source: '埃里克特翁尼亚斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '65E9', source: '에리크토니오스', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'P1N Slam Shut',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '65EA', source: 'Erichthonios', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '65EA', source: 'Erichthonios', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '65EA', source: 'Érichthonios', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '65EA', source: 'エリクトニオス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '65EA', source: '埃里克特翁尼亚斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '65EA', source: '에리크토니오스', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'P1N Pitiless Flail KB',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0001' }),
      condition: Conditions.targetIsYou(),
      response: Responses.knockback(),
    },
    {
      id: 'P1N Pitiless Flail Stack',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '003E', capture: false }),
      response: Responses.stackMarker(),
    },
    {
      id: 'P1N Intemperance',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['AB3', 'AB4'], capture: true }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => {
        return _matches.effectId === 'AB3' ? output.red!() : output.blue!();
      },
      outputStrings: {
        red: {
          en: 'Get hit by red',
          de: 'Von Rot treffen lassen',
          fr: 'Faites-vous toucher par le rouge',
          ja: '炎に当たる',
          cn: '去吃火',
          ko: '빨간색 맞기',
        },
        blue: {
          en: 'Get hit by blue',
          de: 'Von Blau treffen lassen',
          fr: 'Faites-vous toucher par le bleu',
          ja: '氷に当たる',
          cn: '去吃冰',
          ko: '파란색 맞기',
        },
      },
    },
    {
      id: 'P1N Heavy Hand',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '65F3', source: 'Erichthonios' }),
      netRegexDe: NetRegexes.startsUsing({ id: '65F3', source: 'Erichthonios' }),
      netRegexFr: NetRegexes.startsUsing({ id: '65F3', source: 'Érichthonios' }),
      netRegexJa: NetRegexes.startsUsing({ id: '65F3', source: 'エリクトニオス' }),
      netRegexCn: NetRegexes.startsUsing({ id: '65F3', source: '埃里克特翁尼亚斯' }),
      netRegexKo: NetRegexes.startsUsing({ id: '65F3', source: '에리크토니오스' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'P1N Powerful Light',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '893', capture: true }),
      alertText: (_data, matches, output) => {
        if (matches.count === '14C')
          return output.light!();
        return output.fire!();
      },
      outputStrings: {
        fire: {
          en: 'Stand on fire',
          de: 'Auf der Feuerfläche stehen',
          fr: 'Placez-vous sur le feu',
          ja: '炎の床へ',
          cn: '站在火',
          ko: '빨간색 바닥 위에 서기',
        },
        light: {
          en: 'Stand on light',
          de: 'Auf der Lichtfläche stehen',
          fr: 'Placez-vous sur la lumière',
          ja: '光の床へ',
          cn: '站在光',
          ko: '흰색 바닥 위에 서기',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Gaoler\'s Flail Left/Gaoler\'s Flail Right': 'Gaoler\'s Flail Left/Right',
        'Gaoler\'s Flail Right/Gaoler\'s Flail Left': 'Gaoler\'s Flail Right/Left',
        'Hot Spell/Cold Spell': 'Hot/Cold Spell',
        'Powerful Fire/Powerful Light': 'Powerful Fire/Light',
        'Aetherflail Left/Aetherflail Right': 'Aetherflail Left/Right',
        'Aetherflail Right/Aetherflail Left': 'Aetherflail Right/Left',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'Erichthonios': 'Erichthonios',
      },
      'replaceText': {
        '--knockback stack--': '--Rückstoß sammeln--',
        'Aetherchain': 'Berstende Ketten',
        'Aetherflail Left': 'Apodiktische Zucht Links',
        'Aetherflail Right': 'Apodiktische Zucht Rechts',
        'Cold Spell': 'Entfesselter Frost',
        'Gaoler\'s Flail Left': 'Eiserne Zucht Links',
        'Gaoler\'s Flail Right': 'Eiserne Zucht Rechts',
        'Heavy Hand': 'Marter',
        'Hot Spell': 'Entfesseltes Feuer',
        'Intemperance': 'Zehrende Elemente',
        'Intemperate Torment': 'Zehrende Vollstreckung',
        'Pitiless Flail': 'Zucht und Ordnung',
        'Powerful Fire': 'Entladenes Feuer',
        'Powerful Light': 'Entladenes Licht',
        'Shining Cells': 'Ätherzwinger',
        'Slam Shut': 'Freigang',
        'True Holy': 'Vollkommenes Sanctus',
        'Warder\'s Wrath': 'Kettenmagie',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Erichthonios': 'Érichthonios',
      },
      'replaceText': {
        '--knockback stack--': '--package poussée--',
        'Aetherchain': 'Chaînes explosives',
        'Aetherflail Left/Aetherflail Right': 'Chaîne de rétribution gauche/droite',
        'Aetherflail Right/Aetherflail Left': 'Chaîne de rétribution droite/gauche',
        'Gaoler\'s Flail Left/Gaoler\'s Flail Right': 'Chaîne punitive gauche/droite',
        'Gaoler\'s Flail Right/Gaoler\'s Flail Left': 'Chaîne punitive droite/gauche',
        'Heavy Hand': 'Chaîne de supplice',
        'Hot Spell/Cold Spell': 'Déchaînement de feu/glace',
        'Intemperance': 'Corrosion élémentaire',
        'Intemperate Torment': 'Exécution corrosive',
        'Pitiless Flail': 'Chaîne transperçante',
        'Powerful Fire/Powerful Light': 'Explosion infernale/sacrée',
        'Shining Cells': 'Geôle limbique',
        'Slam Shut': 'Occlusion terminale',
        'True Holy': 'Miracle véritable',
        'Warder\'s Wrath': 'Chaînes torrentielles',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Erichthonios': 'エリクトニオス',
      },
      'replaceText': {
        'Aetherchain': '爆鎖',
        'Aetherflail': '懲罰爆鎖',
        'Cold Spell': '魔力解放・氷',
        'Gaoler\'s Flail': '懲罰撃',
        'Heavy Hand': '痛撃',
        'Hot Spell': '魔力解放・火',
        'Intemperance': '氷火の侵食',
        'Intemperate Torment': '侵食執行',
        'Pitiless Flail': '懲罰連撃',
        'Powerful Fire': '炎爆',
        'Powerful Light': '光爆',
        'Shining Cells': '光炎監獄',
        'Slam Shut': '監獄閉塞',
        'True Holy': 'トゥルー・ホーリー',
        'Warder\'s Wrath': '魔鎖乱流',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Erichthonios': '埃里克特翁尼亚斯',
      },
      'replaceText': {
        '--knockback stack--': '--集合击退--',
        'Aetherchain': '爆锁',
        'Aetherflail Left': '左惩罚爆锁',
        'Aetherflail Right': '右惩罚爆锁',
        'Cold Spell': '魔力解放·冰',
        'Gaoler\'s Flail Left': '左惩罚抽击',
        'Gaoler\'s Flail Right': '右惩罚抽击',
        'Heavy Hand': '掌掴',
        'Hot Spell': '魔力解放·火',
        'Intemperance': '冰火侵蚀',
        'Intemperate Torment': '侵蚀发动',
        'Pitiless Flail': '惩罚连击',
        'Powerful Fire': '炎爆',
        'Powerful Light': '光爆',
        'Shining Cells': '光炎监狱',
        'Slam Shut': '监狱封闭',
        'True Holy': '纯正神圣',
        'Warder\'s Wrath': '魔锁乱流',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {
        'Erichthonios': '에리크토니오스',
      },
    },
  ],
};

export default triggerSet;
