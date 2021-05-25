import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';

const strings = {
  typeAndDir: {
    en: '${type}: ${dir}',
    de: '${type}: ${dir}',
    fr: '${type}: ${dir}',
    ja: '${type}: ${dir}',
    cn: '${type}: ${dir}',
    ko: '${type}: ${dir}',
  },
  spread: Outputs.spread,
  stack: {
    en: 'Stack',
    de: 'Stacken',
    fr: 'Stack',
    ja: 'スタック',
    cn: '集合',
    ko: '집합',
  },
  getOut: {
    en: 'Get Out',
    de: 'raus da',
    fr: 'sortir',
    ja: '外へ',
    cn: '远离',
    ko: '밖으로',
  },
  getIn: {
    en: 'Get In',
    de: 'reingehen',
    fr: 'rentrer dedans',
    ja: '中へ',
    cn: '靠近',
    ko: '안으로',
  },
  trueThunder: {
    en: 'True Thunder',
    de: 'Wahrer Blitz',
    fr: 'Vraie foudre',
    ja: '真サンダガ',
    cn: '真雷',
    ko: '진실 선더가',
  },
  fakeThunder: {
    en: 'Fake Thunder',
    de: 'Falscher Blitz',
    fr: 'Fausse foudre',
    ja: 'にせサンダガ',
    cn: '假雷',
    ko: '거짓 선더가',
  },
  trueIce: {
    en: 'True Ice',
    de: 'Wahres Eis',
    fr: 'Vraie glace',
    ja: '真ブリザガ',
    cn: '真冰',
    ko: '진실 블리자가',
  },
  fakeIce: {
    en: 'Fake Ice',
    de: 'Falsches Eis',
    fr: 'Fausse glace',
    ja: 'にせブリザガ',
    cn: '假冰',
    ko: '거짓 블리자가',
  },
};

// O8S - Sigmascape 4.0 Savage
export default {
  zoneId: ZoneId.SigmascapeV40Savage,
  timelineFile: 'o8s.txt',
  triggers: [
    {
      id: 'O8S Shockwave',
      netRegex: NetRegexes.startsUsing({ id: '28DB', source: 'Graven Image', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '28DB', source: 'Heilig(?:e|er|es|en) Statue', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '28DB', source: 'Statue Divine', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '28DB', source: '神々の像', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '28DB', source: '众神之像', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '28DB', source: '신들의 상', capture: false }),
      delaySeconds: 5,
      response: Responses.knockback(),
    },
    {
      id: 'O8S Indolent Will',
      netRegex: NetRegexes.startsUsing({ id: '28E4', source: 'Graven Image', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '28E4', source: 'Heilig(?:e|er|es|en) Statue', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '28E4', source: 'Statue Divine', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '28E4', source: '神々の像', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '28E4', source: '众神之像', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '28E4', source: '신들의 상', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Look Away From Statue',
          de: 'Von Statue wegschauen',
          fr: 'Ne regardez pas la statue',
          ja: '塔を見ない！',
          cn: '背对神像',
          ko: '시선 피하기',
        },
      },
    },
    {
      id: 'O8S Intemperate Will',
      netRegex: NetRegexes.startsUsing({ id: '28DF', source: 'Graven Image', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '28DF', source: 'Heilig(?:e|er|es|en) Statue', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '28DF', source: 'Statue Divine', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '28DF', source: '神々の像', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '28DF', source: '众神之像', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '28DF', source: '신들의 상', capture: false }),
      response: Responses.goWest(),
    },
    {
      id: 'O8S Gravitational Wave',
      netRegex: NetRegexes.startsUsing({ id: '28DE', source: 'Graven Image', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '28DE', source: 'Heilig(?:e|er|es|en) Statue', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '28DE', source: 'Statue Divine', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '28DE', source: '神々の像', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '28DE', source: '众神之像', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '28DE', source: '신들의 상', capture: false }),
      response: Responses.goEast(),
    },
    {
      id: 'O8S Ave Maria',
      netRegex: NetRegexes.startsUsing({ id: '28E3', source: 'Graven Image', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '28E3', source: 'Heilig(?:e|er|es|en) Statue', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '28E3', source: 'Statue Divine', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '28E3', source: '神々の像', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '28E3', source: '众神之像', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '28E3', source: '신들의 상', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Look At Statue',
          de: 'Statue anschauen',
          fr: 'Regardez la statue',
          ja: '像を見る！',
          cn: '面对神像',
          ko: '시선 바라보기',
        },
      },
    },
    {
      id: 'O8S Pasts Forgotten',
      netRegex: NetRegexes.startsUsing({ id: '28F1', source: 'Kefka', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '28F1', source: 'Kefka', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '28F1', source: 'Kefka', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '28F1', source: 'ケフカ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '28F1', source: '凯夫卡', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '28F1', source: '케프카', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Past: Stack and Stay',
          de: 'Vergangenheit: Sammeln und Stehenbleiben',
          fr: 'Passé : Stack et ne bougez plus',
          ja: '過去: スタックしてそのまま',
          cn: '分摊不动',
          ko: '과거: 맞고 가만히있기',
        },
      },
    },
    {
      id: 'O8S Futures Numbered',
      netRegex: NetRegexes.startsUsing({ id: '28EE', source: 'Kefka', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '28EE', source: 'Kefka', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '28EE', source: 'Kefka', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '28EE', source: 'ケフカ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '28EE', source: '凯夫卡', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '28EE', source: '케프카', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Future: Stack and Through',
          de: 'Zukunft: Sammeln und Durchlaufen',
          fr: 'Futur : Stack et traversez',
          ja: '未来: 頭割り後ボスを通り抜ける',
          cn: '分摊穿boss',
          ko: '미래: 맞고 통과해가기',
        },
      },
    },
    {
      // TODO: not sure if this cast is 7 or 8.
      id: 'O8S Past\'s End',
      netRegex: NetRegexes.startsUsing({ id: '28F[78]', source: 'Kefka', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '28F[78]', source: 'Kefka', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '28F[78]', source: 'Kefka', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '28F[78]', source: 'ケフカ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '28F[78]', source: '凯夫卡', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '28F[78]', source: '케프카', capture: false }),
      condition: (data) => data.role === 'tank' || data.role === 'healer',
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Past: Bait, then through',
          de: 'Vergangenheit : Anlocken und Durchlaufen',
          fr: 'Passé : Attirez, puis traversez',
          ja: '過去: 飛んできたら反対に向ける',
          cn: '诱导然后穿boss',
          ko: '과거: 맞고, 이동',
        },
      },
    },
    {
      // TODO: not sure if this cast is 4 or 5.
      id: 'O8S Future\'s End',
      netRegex: NetRegexes.startsUsing({ id: '28F[45]', source: 'Kefka', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '28F[45]', source: 'Kefka', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '28F[45]', source: 'Kefka', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '28F[45]', source: 'ケフカ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '28F[45]', source: '凯夫卡', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '28F[45]', source: '케프카', capture: false }),
      condition: (data) => data.role === 'tank' || data.role === 'healer',
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Future: Bait, then stay',
          de: 'Zukunft: Anlocken und Stehenbleiben',
          fr: 'Futur : Attirez, puis restez',
          ja: '未来: 飛んできたらそのまま',
          cn: '诱导然后不动',
          ko: '미래: 맞고, 가만히',
        },
      },
    },
    {
      id: 'O8S Pulse Wave You',
      netRegex: NetRegexes.startsUsing({ id: '28DD', source: 'Graven Image' }),
      netRegexDe: NetRegexes.startsUsing({ id: '28DD', source: 'Heilig(?:e|er|es|en) Statue' }),
      netRegexFr: NetRegexes.startsUsing({ id: '28DD', source: 'Statue Divine' }),
      netRegexJa: NetRegexes.startsUsing({ id: '28DD', source: '神々の像' }),
      netRegexCn: NetRegexes.startsUsing({ id: '28DD', source: '众神之像' }),
      netRegexKo: NetRegexes.startsUsing({ id: '28DD', source: '신들의 상' }),
      condition: Conditions.targetIsYou(),
      response: Responses.knockbackOn(),
    },
    {
      id: 'O8S Wings of Destruction',
      netRegex: NetRegexes.startsUsing({ id: '2900', source: 'Kefka', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2900', source: 'Kefka', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2900', source: 'Kefka', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2900', source: 'ケフカ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2900', source: '凯夫卡', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2900', source: '케프카', capture: false }),
      alarmText: (data, _matches, output) => {
        if (data.role === 'tank')
          return output.wingsBeNearFar();
      },
      infoText: (data, _matches, output) => {
        if (data.role !== 'tank')
          return output.maxMeleeAvoidTanks();
      },
      outputStrings: {
        maxMeleeAvoidTanks: {
          en: 'Max Melee: Avoid Tanks',
          de: 'Max Nahkampf: Weg von den Tanks',
          fr: 'Max Mêlée : éloignez-vous des Tanks',
          ja: '近接最大レンジ タンクから離れる',
          cn: '最远距离',
          ko: '칼끝딜: 탱커 피하기',
        },
        wingsBeNearFar: {
          en: 'Wings: Be Near/Far',
          de: 'Schwingen: Nah/Fern',
          fr: 'Ailes : être près/loin',
          ja: '翼: めり込む/離れる',
          cn: '双翅膀：近或远',
          ko: '양날개: 가까이/멀리',
        },
      },
    },
    {
      id: 'O8S Single Wing of Destruction',
      netRegex: NetRegexes.startsUsing({ id: '28F[EF]', source: 'Kefka', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '28F[EF]', source: 'Kefka', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '28F[EF]', source: 'Kefka', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '28F[EF]', source: 'ケフカ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '28F[EF]', source: '凯夫卡', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '28F[EF]', source: '케프카', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Single Wing',
          de: 'Einzelner Flügel',
          fr: 'Aile unique',
          ja: '片翼',
          cn: '单翅膀',
          ko: '한쪽 날개',
        },
      },
    },
    {
      id: 'O8S Ultimate Embrace',
      netRegex: NetRegexes.startsUsing({ id: '2910', source: 'Kefka' }),
      netRegexDe: NetRegexes.startsUsing({ id: '2910', source: 'Kefka' }),
      netRegexFr: NetRegexes.startsUsing({ id: '2910', source: 'Kefka' }),
      netRegexJa: NetRegexes.startsUsing({ id: '2910', source: 'ケフカ' }),
      netRegexCn: NetRegexes.startsUsing({ id: '2910', source: '凯夫卡' }),
      netRegexKo: NetRegexes.startsUsing({ id: '2910', source: '케프카' }),
      alertText: (data, matches, output) => {
        if (matches.target !== data.me)
          return;

        return output.embraceOnYou();
      },
      infoText: (data, matches, output) => {
        if (matches.target === data.me)
          return;

        if (data.role === 'healer' || data.role === 'tank')
          return output.embraceOn({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        embraceOn: {
          en: 'Embrace on ${player}',
          de: 'Umarmung auf ${player}',
          fr: 'Étreinte sur ${player}',
          ja: '${player}に双腕',
          cn: '分摊死刑${player}',
          ko: '"${player}" 종말의 포옹',
        },
        embraceOnYou: {
          en: 'Embrace on YOU',
          de: 'Umarmung auf DIR',
          fr: 'Étreinte sur VOUS',
          ja: '自分に双腕',
          cn: '分摊死刑点名',
          ko: '종말의 포옹 대상자',
        },
      },
    },
    {
      // 28E8: clown hyperdrive, 2912: god hyperdrive
      id: 'O8S Hyperdrive',
      netRegex: NetRegexes.startsUsing({ id: ['28E8', '2912'], source: 'Kefka' }),
      netRegexDe: NetRegexes.startsUsing({ id: ['28E8', '2912'], source: 'Kefka' }),
      netRegexFr: NetRegexes.startsUsing({ id: ['28E8', '2912'], source: 'Kefka' }),
      netRegexJa: NetRegexes.startsUsing({ id: ['28E8', '2912'], source: 'ケフカ' }),
      netRegexCn: NetRegexes.startsUsing({ id: ['28E8', '2912'], source: '凯夫卡' }),
      netRegexKo: NetRegexes.startsUsing({ id: ['28E8', '2912'], source: '케프카' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'O8S Indulgent Will',
      netRegex: NetRegexes.startsUsing({ id: '28E5', source: 'Graven Image' }),
      netRegexDe: NetRegexes.startsUsing({ id: '28E5', source: 'Heilig(?:e|er|es|en) Statue' }),
      netRegexFr: NetRegexes.startsUsing({ id: '28E5', source: 'Statue Divine' }),
      netRegexJa: NetRegexes.startsUsing({ id: '28E5', source: '神々の像' }),
      netRegexCn: NetRegexes.startsUsing({ id: '28E5', source: '众神之像' }),
      netRegexKo: NetRegexes.startsUsing({ id: '28E5', source: '신들의 상' }),
      condition: Conditions.targetIsYou(),
      alarmText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Confusion: Go Outside',
          de: 'Konfusion: Nach außen',
          fr: 'Confusion : Aller à l\'extérieur',
          ja: '混乱: 外へ',
          cn: '去外面',
          ko: '혼란: 바깥으로',
        },
      },
    },
    {
      id: 'O8S Idyllic Will',
      netRegex: NetRegexes.startsUsing({ id: '28E6', source: 'Graven Image' }),
      netRegexDe: NetRegexes.startsUsing({ id: '28E6', source: 'Heilig(?:e|er|es|en) Statue' }),
      netRegexFr: NetRegexes.startsUsing({ id: '28E6', source: 'Statue Divine' }),
      netRegexJa: NetRegexes.startsUsing({ id: '28E6', source: '神々の像' }),
      netRegexCn: NetRegexes.startsUsing({ id: '28E6', source: '众神之像' }),
      netRegexKo: NetRegexes.startsUsing({ id: '28E6', source: '신들의 상' }),
      condition: Conditions.targetIsYou(),
      alarmText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Sleep: Go Inside',
          de: 'Schlaf: Zur Mitte',
          fr: 'Sommeil : allez au centre',
          ja: '睡眠: 中へ',
          cn: '去中间',
          ko: '수면: 안으로',
        },
      },
    },
    {
      // Precedes fake abilities
      id: 'O8S Jester\'s Antics',
      netRegex: NetRegexes.gainsEffect({ effectId: '5CE', capture: false }),
      suppressSeconds: 1, // Every Kefka entity gains this at once.
      run: (data) => data.antics = true,
    },
    {
      // Precedes real abilities
      id: 'O8S Jester\'s Truths',
      netRegex: NetRegexes.gainsEffect({ effectId: '5CF', capture: false }),
      suppressSeconds: 1, // Every Kefka entity gains this at once.
      run: (data) => data.truths = true,
    },
    {
      id: 'O8S Jester Cleanup',
      netRegex: NetRegexes.losesEffect({ effectId: ['5CE', '5CF'], capture: false }),
      suppressSeconds: 1,
      run: (data) => {
        delete data.antics;
        delete data.truths;
      },
    },
    {
      id: 'O8S Mana Charge',
      netRegex: NetRegexes.startsUsing({ id: '28D1', source: 'Kefka', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '28D1', source: 'Kefka', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '28D1', source: 'Kefka', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '28D1', source: 'ケフカ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '28D1', source: '凯夫卡', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '28D1', source: '케프카', capture: false }),
      run: (data) => {
        delete data.lastFire;
        delete data.lastThunder;
        delete data.lastIceDir;
        delete data.manaReleaseText;
      },
    },
    {
      id: 'O8S Mana Release',
      netRegex: NetRegexes.startsUsing({ id: '28D2', source: 'Kefka', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '28D2', source: 'Kefka', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '28D2', source: 'Kefka', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '28D2', source: 'ケフカ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '28D2', source: '凯夫卡', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '28D2', source: '케프카', capture: false }),
      infoText: (data, _matches, output) => {
        if (data.lastFire)
          return output[data.lastFire]();

        if (!data.lastIceDir)
          return;

        return output.thunderIce({
          thunder: output[data.lastThunder](),
          dir: output[data.lastIceDir](),
        });
      },
      outputStrings: {
        thunderIce: {
          en: '${thunder}, ${dir}',
          de: '${thunder}, ${dir}',
          fr: '${thunder}, ${dir}',
          ja: '${thunder}, ${dir}',
          cn: '${thunder}, ${dir}',
          ko: '${thunder}, ${dir}',
        },
        fakeThunder: strings.fakeThunder,
        trueThunder: strings.trueThunder,
        getIn: strings.getIn,
        getOut: strings.getOut,
        spread: strings.spread,
        stack: strings.stack,
      },
    },
    {
      // This may be real or fake. We're just storing this briefly
      // so we can use it to call the first fire correctly.
      // 007F is the spread marker, 0080 is the stack marker
      id: 'O8S Fire Head Marker',
      netRegex: NetRegexes.headMarker({ id: ['007F', '0080'] }),
      suppressSeconds: 2,
      run: (data, matches) => data.fireMarker = matches.id === '007F' ? 'spread' : 'stack',
    },
    {
      // Kefka doesn't directly use the Fire abilities. Rather, he casts 28CE on himself,
      // then instantly casts either the real or fake Fire on resolution.
      //
      // 28CE: ability id on use
      // 28CF: damage from mana charge
      // 2B32: damage from mana release
      id: 'O8S Fire Spread',
      netRegex: NetRegexes.startsUsing({ id: '28CE', source: 'Kefka', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '28CE', source: 'Kefka', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '28CE', source: 'Kefka', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '28CE', source: 'ケフカ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '28CE', source: '凯夫卡', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '28CE', source: '케프카', capture: false }),
      condition: (data) => {
        const isTrueSpread = data.truths && data.fireMarker === 'spread';
        const isFakeStack = data.antics && data.fireMarker === 'stack';
        return isTrueSpread || isFakeStack;
      },
      response: Responses.spread(),
      run: (data) => {
        data.lastFire = 'spread';
        delete data.fireMarker;
      },
    },
    {
      // 28CE: ability id on use
      // 28D0: damage from mana charge
      // 2B33: damage from mana release
      id: 'O8S Fire Stack',
      netRegex: NetRegexes.startsUsing({ id: '28CE', source: 'Kefka', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '28CE', source: 'Kefka', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '28CE', source: 'Kefka', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '28CE', source: 'ケフカ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '28CE', source: '凯夫卡', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '28CE', source: '케프카', capture: false }),
      condition: (data) => {
        const isFakeSpread = data.antics && data.fireMarker === 'spread';
        const isTrueStack = data.truths && data.fireMarker === 'stack';
        return isFakeSpread || isTrueStack;
      },
      response: Responses.getTogether(),
      run: (data) => {
        data.lastFire = 'stack';
        delete data.fireMarker;
      },
    },
    {
      // 28CA: mana charge (both types)
      // 28CD: mana charge
      // 2B31: mana release
      id: 'O8S Thrumming Thunder Real',
      netRegex: NetRegexes.startsUsing({ id: ['28CD', '2B31'], source: 'Kefka', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['28CD', '2B31'], source: 'Kefka', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['28CD', '2B31'], source: 'Kefka', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['28CD', '2B31'], source: 'ケフカ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: ['28CD', '2B31'], source: '凯夫卡', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: ['28CD', '2B31'], source: '케프카', capture: false }),
      preRun: (data) => {
        data.lastThunder = 'trueThunder';
      },
      suppressSeconds: 40,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: strings.trueThunder,
      },
    },
    {
      // 28CA: mana charge (both types)
      // 28CB, 28CC: mana charge
      // 2B2F, 2B30: mana release
      id: 'O8S Thrumming Thunder Fake',
      netRegex: NetRegexes.startsUsing({ id: ['28CC', '2B30'], source: 'Kefka', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['28CC', '2B30'], source: 'Kefka', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['28CC', '2B30'], source: 'Kefka', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['28CC', '2B30'], source: 'ケフカ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: ['28CC', '2B30'], source: '凯夫卡', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: ['28CC', '2B30'], source: '케프카', capture: false }),
      preRun: (data) => {
        data.lastThunder = 'fakeThunder';
      },
      suppressSeconds: 40,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: strings.fakeThunder,
      },
    },
    {
      // 28C7: mana charge (all ice types)
      // 28C5, 28C6: mana charge
      // 2B2B, 2B2E: mana release
      id: 'O8S Blizzard Fake Donut',
      netRegex: NetRegexes.startsUsing({ id: ['28C5', '2B2B'], source: 'Kefka', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['28C5', '2B2B'], source: 'Kefka', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['28C5', '2B2B'], source: 'Kefka', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['28C5', '2B2B'], source: 'ケフカ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: ['28C5', '2B2B'], source: '凯夫卡', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: ['28C5', '2B2B'], source: '케프카', capture: false }),
      preRun: (data) => {
        data.lastIceDir = 'getOut';
      },
      suppressSeconds: 40,
      infoText: (_data, _matches, output) => {
        return output.text({ type: output.type(), dir: output.dir() });
      },
      tts: (_data, _matches, output) => output.dir(),
      outputStrings: {
        text: strings.typeAndDir,
        type: strings.fakeIce,
        dir: strings.getOut,
      },
    },
    {
      // 28C7: mana charge (all ice types)
      // 28C9: mana charge
      // 2B2E: mana release
      id: 'O8S Blizzard True Donut',
      netRegex: NetRegexes.startsUsing({ id: ['28C9', '2B2E'], source: 'Kefka', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['28C9', '2B2E'], source: 'Kefka', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['28C9', '2B2E'], source: 'Kefka', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['28C9', '2B2E'], source: 'ケフカ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: ['28C9', '2B2E'], source: '凯夫卡', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: ['28C9', '2B2E'], source: '케프카', capture: false }),
      preRun: (data) => {
        data.lastIceDir = 'getIn';
      },
      suppressSeconds: 40,
      infoText: (_data, _matches, output) => {
        return output.text({ type: output.type(), dir: output.dir() });
      },
      tts: (_data, _matches, output) => output.dir(),
      outputStrings: {
        text: strings.typeAndDir,
        type: strings.trueIce,
        dir: strings.getIn,
      },
    },
    {
      // 28C7: mana charge (all ice types)
      // 28C3, 28C4: mana charge
      // 2B29, 2B2A: mana release
      id: 'O8S Blizzard Fake Near',
      netRegex: NetRegexes.startsUsing({ id: ['28C4', '2B2A'], source: 'Kefka', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['28C4', '2B2A'], source: 'Kefka', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['28C4', '2B2A'], source: 'Kefka', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['28C4', '2B2A'], source: 'ケフカ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: ['28C4', '2B2A'], source: '凯夫卡', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: ['28C4', '2B2A'], source: '케프카', capture: false }),
      preRun: (data) => {
        data.lastIceDir = 'getIn';
      },
      suppressSeconds: 40,
      infoText: (_data, _matches, output) => {
        return output.text({ type: output.type(), dir: output.dir() });
      },
      tts: (_data, _matches, output) => output.dir(),
      outputStrings: {
        text: strings.typeAndDir,
        type: strings.fakeIce,
        dir: strings.getIn,
      },
    },
    {
      // 28C7: mana charge (all ice types)
      // 28C8: mana charge
      // 2B2D: mana release
      id: 'O8S Blizzard True Near',
      netRegex: NetRegexes.startsUsing({ id: ['28C8', '2B2D'], source: 'Kefka', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['28C8', '2B2D'], source: 'Kefka', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['28C8', '2B2D'], source: 'Kefka', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['28C8', '2B2D'], source: 'ケフカ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: ['28C8', '2B2D'], source: '凯夫卡', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: ['28C8', '2B2D'], source: '케프카', capture: false }),
      preRun: (data) => {
        data.lastIceDir = 'getOut';
      },
      suppressSeconds: 40,
      infoText: (_data, _matches, output) => {
        return output.text({ type: output.type(), dir: output.dir() });
      },
      tts: (_data, _matches, output) => output.dir(),
      outputStrings: {
        text: strings.typeAndDir,
        type: strings.trueIce,
        dir: strings.getOut,
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Graven Image': 'heilig(?:e|er|es|en) Statue',
        'Kefka': 'Kefka',
        'Light Of Consecration': 'Licht der Weihe',
        'The limit gauge resets!': 'Der Limitrausch-Balken wurde geleert.',
      },
      'replaceText': {
        'Aero Assault': 'Wallendes Windga',
        'All Things Ending': 'Ende aller Dinge',
        'Blizzard Blitz': 'Erstarrendes Eisga',
        'Blizzard\\+Thunder': 'Eis+Blitz',
        'Celestriad': 'Dreigestirn',
        'Fire III': 'Feuga',
        'Flagrant Fire': 'Flammendes Feuga',
        'Forsaken': 'Verloren',
        'Graven Image': 'Göttliche Statue',
        'Gravitas': 'Gravitas',
        'Half Arena': 'Halbe Arena',
        'Heartless Angel': 'Herzloser Engel',
        'Heartless Archangel': 'Herzloser Erzengel',
        'Hyperdrive': 'Hyperantrieb',
        'Indomitable Will': 'Unzähmbarer Wille',
        'Inexorable Will': 'Unerbittlicher Wille',
        'Knockback Tethers': 'Rückstoß Verbindungen',
        'Light Of Judgment': 'Licht des Urteils',
        'Mana Charge': 'Mana-Aufladung',
        'Mana Release': 'Mana-Entladung',
        'Meteor': 'Meteor',
        'Past/Future(?! )': 'Vergangenheit/Zukunft',
        'Past/Future End': 'Vergangenheit/Zukunft Ende',
        'Pulse Wave': 'Pulswelle',
        'Revolting Ruin': 'Revoltierendes Ruinga',
        'Shockwave': 'Schockwelle',
        'Sleep/Confuse Tethers': 'Schlaf/Konfusion Verbindungen',
        'Soak': 'Aufsaugen',
        'Starstrafe': 'Sternentanz',
        'Statue Gaze': 'Statuenblick',
        'Statue Half Cleave': 'Statue Halber Cleave',
        'Thrumming Thunder': 'Brachiales Blitzga',
        'Thunder III': 'Blitzga',
        'Timely Teleport': 'Turbulenter Teleport',
        'Trine': 'Trine',
        'Ultima Upsurge': 'Ultima-Wallung',
        'Ultimate Embrace': 'Ultima-Umarmung',
        'Ultima(?![ |\\w])': 'Ultima',
        'Vitrophyre': 'Vitrophyr',
        'Wave Cannon': 'Wellenkanone',
        'Wings Of Destruction': 'Vernichtungsschwinge',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Graven Image': 'Statue divine',
        'Kefka': 'Kefka',
        'Light Of Consecration': 'lumière de la consécration',
        'The limit gauge resets!': 'La jauge de Transcendance a été réinitialisée.',
      },
      'replaceText': {
        'Aero Assault': 'Méga Vent véhément',
        'All Things Ending': 'Fin de toutes choses',
        'Blizzard Blitz': 'Méga Glace glissante',
        'Blizzard\\+Thunder': 'Méga Glace + Méga Foudre',
        'Celestriad': 'Tristella',
        'Fire III': 'Méga Feu',
        'Flagrant Fire': 'Méga Feu faufilant',
        'Forsaken': 'Cataclysme',
        'Graven Image': 'Statue divine',
        'Gravitas': 'Tir gravitationnel',
        'Half Arena': 'Moitié d\'arène',
        'Heartless Angel': 'Ange sans cœur',
        'Heartless Archangel': 'Archange sans cœur',
        'Hyperdrive': 'Colonne de feu',
        'Indomitable Will': 'Volonté indomptable',
        'Inexorable Will': 'Volonté inexorable',
        'Knockback Tethers': 'Liens de projection',
        'Light Of Judgment': 'Triade guerrière',
        'Mana Charge': 'Concentration de mana',
        'Mana Release': 'Décharge de mana',
        'Meteor': 'Météore',
        'Past/Future(?! )': 'Passé/Futur',
        'Past/Future End': 'Passé/Fin du futur',
        'Pulse Wave': 'Pulsation spirituelle',
        'Revolting Ruin': 'Méga Ruine ravageuse',
        'Shockwave': 'Onde de choc',
        'Sleep/Confuse Tethers': 'Liens de Sommeil/Confusion',
        'Soak': 'Absorber',
        'Starstrafe': 'Fou dansant',
        'Statue Gaze': 'Regard statue',
        'Statue Half Cleave': 'Demi clivage de la statue',
        'Thrumming Thunder': 'Méga Foudre fourmillante',
        'Thunder III': 'Méga Foudre',
        'Timely Teleport': 'Téléportation turbulente',
        'Trine': 'Trine',
        'Ultima Upsurge': 'Ultima ulcérante',
        'Ultimate Embrace': 'Étreinte fatidique',
        'Ultima(?![ |\\w])': 'Ultima',
        'Vitrophyre': 'Vitrophyre',
        'Wave Cannon': 'Canon plasma',
        'Wings Of Destruction': 'Aile de la destruction',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Graven Image': '神々の像',
        'Kefka': 'ケフカ',
        'Light Of Consecration': '聖別の光',
        'The limit gauge resets!': 'リミットゲージがリセットされた……',
      },
      'replaceText': {
        'Aero Assault': 'ずんずんエアロガ',
        'All Things Ending': '消滅の脚',
        'Blizzard Blitz': 'ぐるぐるブリザガ',
        'Blizzard\\+Thunder': 'ブリザガ + サンダガ',
        'Celestriad': 'スリースターズ',
        'Fire III': 'ファイガ',
        'Flagrant Fire': 'めらめらファイガ',
        'Forsaken': 'ミッシング',
        'Graven Image': '神々の像',
        'Gravitas': '重力弾',
        'Half Arena': 'フィールド半分即死',
        'Heartless Angel': '心ない天使',
        'Heartless Archangel': '心ない大天使',
        'Hyperdrive': 'ハイパードライブ',
        'Indomitable Will': '豪腕の神気',
        'Inexorable Will': '無情の神気',
        'Knockback Tethers': '吹き飛ばし 線',
        'Light Of Judgment': '裁きの光',
        'Mana Charge': 'マジックチャージ',
        'Mana Release': 'マジックアウト',
        'Meteor': 'メテオ',
        'Past/Future(?! )': '過去/未来',
        'Past/Future End': '過去/未来 終了',
        'Pulse Wave': '波動弾',
        'Revolting Ruin': 'ばりばりルインガ',
        'Shockwave': '衝撃波',
        'Sleep/Confuse Tethers': '混乱/睡眠 線',
        'Soak': '光の波動',
        'Starstrafe': '妖星乱舞',
        'Statue Gaze': '像ギミック',
        'Statue Half Cleave': '像 フィールド半分即死',
        'Thrumming Thunder': 'もりもりサンダガ',
        'Thunder III': 'サンダガ',
        'Timely Teleport': 'ぶっとびテレポ',
        'Trine': 'トライン',
        'Ultima Upsurge': 'どきどきアルテマ',
        'Ultimate Embrace': '終末の双腕',
        'Ultima(?![ |\\w])': 'アルテマ',
        'Vitrophyre': '岩石弾',
        'Wave Cannon': '波動砲',
        'Wings Of Destruction': '破壊の翼',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Graven Image': '众神之像',
        'Kefka': '凯夫卡',
        'Light Of Consecration': '祝圣之光',
        'The limit gauge resets!': '极限槽被清零了……',
      },
      'replaceText': {
        'Aero Assault': '疼飕飕暴风',
        'All Things Ending': '消灭之脚',
        'Blizzard Blitz': '滴溜溜冰封',
        'Blizzard\\+Thunder': '冰封+暴雷',
        'Celestriad': '三星',
        'Fire III': '爆炎',
        'Flagrant Fire': '呼啦啦爆炎',
        'Forsaken': '遗弃末世',
        'Graven Image': '众神之像',
        'Gravitas': '重力弹',
        'Half Arena': '半场',
        'Heartless Angel': '无心天使',
        'Heartless Archangel': '无心大天使',
        'Hyperdrive': '超驱动',
        'Indomitable Will': '强腕的神气',
        'Inexorable Will': '无情的神气',
        'Knockback Tethers': '击退连线',
        'Light Of Judgment': '制裁之光',
        'Mana Charge': '魔法储存',
        'Mana Release': '魔法放出',
        'Meteor': '陨石',
        'Past/Future(?! )': '过去/未来',
        'Past/Future End': '过去/未来 结束',
        'Pulse Wave': '波动弹',
        'Revolting Ruin': '恶狠狠毁荡',
        'Shockwave': '冲击波',
        'Sleep/Confuse Tethers': '睡眠/混乱 连线',
        'Soak': '踩',
        'Starstrafe': '妖星乱舞',
        'Statue Gaze': '神像视线',
        'Statue Half Cleave': '神像半场AOE',
        'Thrumming Thunder': '劈啪啪暴雷',
        'Thunder III': '暴雷',
        'Timely Teleport': '跳蹦蹦传送',
        'Trine': '异三角',
        'Ultima Upsurge': '扑腾腾究极',
        'Ultimate Embrace': '终末双腕',
        'Ultima(?![ |\\w])': '究极',
        'Vitrophyre': '岩石弹',
        'Wave Cannon': '波动炮',
        'Wings Of Destruction': '破坏之翼',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Graven Image': '신들의 상',
        'Kefka': '케프카',
        'Light Of Consecration': '성결의 빛',
        'The limit gauge resets!': '리미트 게이지가 초기화되었습니다…….',
      },
      'replaceText': {
        'Aero Assault': '갈기갈기 에어로가',
        'All Things Ending': '소멸의 발차기',
        'big': '大',
        'small': '小',
        'Blizzard Blitz': '빙글빙글 블리자가',
        'Blizzard\\+Thunder': '블리자드+선더',
        'Celestriad': '세 개의 별',
        'DPS': '딜러',
        'End(?!ing)': '종료',
        'Fire III': '파이가',
        'Flagrant Fire': '이글이글 파이가',
        'Forsaken': '행방불명',
        'Graven Image': '신들의 상',
        'Gravitas': '중력탄',
        'Half Arena': '절반 장판',
        'Heartless Angel': '비정한 천사',
        'Heartless Archangel': '비정한 대천사',
        'Hyperdrive': '하이퍼드라이브',
        'Indomitable Will': '호완의 신기',
        'Inexorable Will': '무정의 신기',
        'Knockback Tethers': '넉백 선',
        'Light Of Judgment': '심판의 빛',
        'Mana Charge': '마력 충전',
        'Mana Release': '마력 방출',
        'Meteor': '메테오',
        'Past/Future': '과거/미래',
        'Pulse Wave': '파동탄',
        'Revolting Ruin': '파삭파삭 루인가',
        'Statue Half Cleave': '전장 절반 강한 공격',
        'Shockwave': '충격파',
        'Sleep/Confuse Tethers': '수면/혼란 선',
        'Soak': '흡수',
        'Starstrafe': '요성난무',
        'Statue Gaze': '동상 작동',
        'Thrumming Thunder': '찌릿찌릿 선더가',
        'Thunder III': '선더가',
        'Timely Teleport': '껑충껑충 텔레포',
        'Trine': '트라인',
        'Ultima Upsurge': '두근두근 알테마',
        'Ultimate Embrace': '종말의 포옹',
        'Ultima(?![ |\\w])': '알테마',
        'Vitrophyre': '암석탄',
        'Wave Cannon': '파동포',
        'Wings Of Destruction': '파괴의 날개',
      },
    },
  ],
};
