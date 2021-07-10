import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  thunderCount?: number;
  flareTargets?: string[];
  phase?: string;
  alphaCount?: number;
  dieOnLaser?: number;
  beyondDeath?: boolean;
  omegaLaserCount?: number;
  omegaProbablyDiedOnLaser?: boolean;
  waterHealer?: string;
  finalphase?: boolean;
  whiteWound?: boolean;
  blackWound?: boolean;
  allaganField?: boolean;
  almagestCount?: number;
}

const shouldDieOnLaser = (data: Data) => {
  if (!data.beyondDeath)
    return false;
  // Beyond death doesn't update for laser #2 if you died on
  // laser #1, so don't tell anybody to die on laser #2.
  // If you still have beyond death, it'll remind you for #3.
  if (data.omegaLaserCount === 2 && data.omegaProbablyDiedOnLaser)
    return false;
  if (data.phase !== 'omega')
    return true;
  if (data.dieOnLaser === undefined || data.omegaLaserCount === undefined)
    return false;
  return data.omegaLaserCount >= data.dieOnLaser;
};

// O4S - Deltascape 4.0 Savage
const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.DeltascapeV40Savage,
  timelineFile: 'o4s.txt',
  timelineTriggers: [
    {
      id: 'O4S Neo Vacuum Wave',
      regex: /Vacuum Wave/,
      beforeSeconds: 8,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Vacuum Wave soon',
          de: 'Vakuumwelle bald',
          fr: 'Vague de vide bientôt',
          ja: 'まもなく真空波',
          cn: '马上真空波',
          ko: '곧 진공파',
        },
      },
    },
  ],
  triggers: [
    // Part 1
    {
      // Phase Tracker: Thunder III not after Dualcast.
      id: 'O4S Exdeath Thunder III Counter',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '23F9', source: 'Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '23F9', source: 'Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '23F9', source: 'Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '23F9', source: 'エクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '23F9', source: '艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '23F9', source: '엑스데스', capture: false }),
      run: (data) => {
        data.thunderCount = (data.thunderCount ?? 0) + 1;
      },
    },
    {
      // Fire III + Dualcast.
      id: 'O4S Exdeath Fire III Counter',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '23F5', source: 'Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '23F5', source: 'Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '23F5', source: 'Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '23F5', source: 'エクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '23F5', source: '艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '23F5', source: '엑스데스', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Fire III',
          de: 'Feuga',
          fr: 'Méga Feu',
          ja: 'ファイガ',
          cn: '静止',
          ko: '파이가',
        },
      },
    },
    {
      // Blizzard III + Dualcast.
      id: 'O4S Exdeath Blizzard III',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '23F7', source: 'Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '23F7', source: 'Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '23F7', source: 'Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '23F7', source: 'エクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '23F7', source: '艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '23F7', source: '엑스데스', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Blizzard III',
          de: 'Eisga',
          fr: 'Méga Glace',
          ja: 'ブリザガ',
          cn: '蛇皮走位',
          ko: '블리자가',
        },
      },
    },
    {
      // Thunder III + Dualcast.
      id: 'O4S Exdeath Thunder III',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '23F9', source: 'Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '23F9', source: 'Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '23F9', source: 'Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '23F9', source: 'エクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '23F9', source: '艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '23F9', source: '엑스데스', capture: false }),
      alertText: (data, _matches, output) => {
        // Tanks/healers always get an alert.
        if (data.role === 'tank' || data.role === 'healer')
          return output.thunderBuster!();
      },
      infoText: (data, _matches, output) => {
        // Tanks/healers always get an alert.
        if (data.role === 'tank' || data.role === 'healer')
          return false;
        return output.thunder!();
      },
      tts: (data, _matches, output) => {
        if (data.role === 'tank' || data.role === 'healer')
          return output.thunderTTS!();
      },
      outputStrings: {
        thunderBuster: {
          en: 'Thunder III: Tank buster',
          de: 'Blitzga: Tank buster',
          fr: 'Méga Foudre : Tank buster',
          ja: 'サンダガ: タンクバスター',
          cn: '雷三：坦克死刑',
          ko: '선더가: 탱버',
        },
        thunder: {
          en: 'Thunder III',
          de: 'Blitzga',
          fr: 'Méga Foudre',
          ja: 'サンダガ',
          cn: '雷三',
          ko: '선더가',
        },
        thunderTTS: {
          en: 'thunder',
          de: 'blitzga',
          fr: 'foudre',
          ja: '離れる',
          cn: '远离',
          ko: '선더가',
        },
      },
    },
    {
      // Fire III after Dualcast.
      id: 'O4S Exdeath Ultimate Fire III',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '23FB', source: 'Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '23FB', source: 'Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '23FB', source: 'Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '23FB', source: 'エクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '23FB', source: '艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '23FB', source: '엑스데스', capture: false }),
      response: Responses.stopMoving(),
    },
    {
      // Blizzard III after Dualcast.
      id: 'O4S Exdeath Ultimate Blizzard III',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '23FC', source: 'Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '23FC', source: 'Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '23FC', source: 'Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '23FC', source: 'エクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '23FC', source: '艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '23FC', source: '엑스데스', capture: false }),
      response: Responses.moveAround(),
    },
    {
      // Thunder III after Dualcast.
      id: 'O4S Exdeath Ultimate Thunder III',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '23FD', source: 'Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '23FD', source: 'Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '23FD', source: 'Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '23FD', source: 'エクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '23FD', source: '艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '23FD', source: '엑스데스', capture: false }),
      response: Responses.getOut(),
    },
    {
      // Flare
      id: 'O4S Exdeath Flare',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '2401', source: 'Exdeath' }),
      netRegexDe: NetRegexes.startsUsing({ id: '2401', source: 'Exdeath' }),
      netRegexFr: NetRegexes.startsUsing({ id: '2401', source: 'Exdeath' }),
      netRegexJa: NetRegexes.startsUsing({ id: '2401', source: 'エクスデス' }),
      netRegexCn: NetRegexes.startsUsing({ id: '2401', source: '艾克斯迪司' }),
      netRegexKo: NetRegexes.startsUsing({ id: '2401', source: '엑스데스' }),
      condition: (data, matches) => {
        data.flareTargets ??= [];
        data.flareTargets.push(matches.target);
        return data.flareTargets.length === 3;
      },
      alarmText: (data, _matches, output) => {
        if (data.flareTargets?.includes(data.me))
          return output.text!();
      },
      run: (data) => delete data.flareTargets,
      outputStrings: {
        text: {
          en: 'Flare on you',
          de: 'Flare auf dir',
          fr: 'Brasier sur vous',
          ja: '自分にフレア',
          cn: '核爆点名',
          ko: '플레어 대상자',
        },
      },
    },

    // Part 2
    {
      id: 'O4S Neo Grand Cross Alpha Tracker',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '242B', source: 'Neo Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '242B', source: 'Neo Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '242B', source: 'Néo-Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '242B', source: 'ネオエクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '242B', source: '新生艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '242B', source: '네오 엑스데스', capture: false }),
      run: (data) => {
        data.phase = 'alpha';
        data.alphaCount = (data.alphaCount ?? 0) + 1;

        // TODO: should have options for this.
        data.dieOnLaser = 1;
      },
    },
    {
      id: 'O4S Neo Grand Cross Delta Tracker',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '242C', source: 'Neo Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '242C', source: 'Neo Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '242C', source: 'Néo-Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '242C', source: 'ネオエクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '242C', source: '新生艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '242C', source: '네오 엑스데스', capture: false }),
      run: (data) => {
        data.phase = 'delta';
        delete data.waterHealer;
      },
    },
    {
      id: 'O4S Neo Grand Cross Omega Tracker',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '242D', source: 'Neo Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '242D', source: 'Neo Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '242D', source: 'Néo-Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '242D', source: 'ネオエクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '242D', source: '新生艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '242D', source: '네오 엑스데스', capture: false }),
      run: (data) => {
        data.phase = 'omega';
        delete data.waterHealer;
        data.omegaLaserCount = 1;
      },
    },
    {
      id: 'O4S Neo Neverwhere Tracker',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '2426', source: 'Neo Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2426', source: 'Neo Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2426', source: 'Néo-Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2426', source: 'ネオエクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2426', source: '新生艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2426', source: '네오 엑스데스', capture: false }),
      run: (data) => data.finalphase = true,
    },
    {
      id: 'O4S Neo White Wound Gain',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '564' }),
      condition: Conditions.targetIsYou(),
      run: (data) => data.whiteWound = true,
    },
    {
      id: 'O4S Neo White Wound Lost',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: '564' }),
      condition: Conditions.targetIsYou(),
      run: (data) => data.whiteWound = false,
    },
    {
      id: 'O4S Neo Black Wound Gain',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '565' }),
      condition: Conditions.targetIsYou(),
      run: (data) => data.blackWound = true,
    },
    {
      id: 'O4S Neo Black Wound Lost',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: '565' }),
      condition: Conditions.targetIsYou(),
      run: (data) => data.blackWound = false,
    },
    {
      id: 'O4S Neo Beyond Death Gain',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '566' }),
      condition: Conditions.targetIsYou(),
      run: (data) => data.beyondDeath = true,
    },
    {
      id: 'O4S Neo Beyond Death Lost',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: '566' }),
      condition: Conditions.targetIsYou(),
      run: (data) => data.beyondDeath = false,
    },
    {
      id: 'O4S Neo Allagan Field Gain',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '1C6' }),
      condition: Conditions.targetIsYou(),
      run: (data) => data.allaganField = true,
    },
    {
      id: 'O4S Neo Allagan Field Lost',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: '1C6' }),
      condition: Conditions.targetIsYou(),
      run: (data) => data.allaganField = false,
    },
    {
      id: 'O4S Neo Flood of Naught: Inside',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '240E', source: 'Neo Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '240E', source: 'Neo Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '240E', source: 'Néo-Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '240E', source: 'ネオエクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '240E', source: '新生艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '240E', source: '네오 엑스데스', capture: false }),
      durationSeconds: 6,
      alarmText: (data, _matches, output) => {
        if (shouldDieOnLaser(data))
          return output.dieOnInside!();
      },
      alertText: (data, _matches, output) => {
        if (!shouldDieOnLaser(data))
          return output.goOutside!();
      },
      tts: (data, _matches, output) => {
        if (shouldDieOnLaser(data))
          return output.dieInInIn!();

        return output.outOutOut!();
      },
      outputStrings: {
        goOutside: {
          en: 'Go Outside',
          de: 'Nach Außen',
          fr: 'Allez à l\'extérieur',
          ja: '外に出る',
          cn: '去外面',
          ko: '바깥으로',
        },
        dieOnInside: {
          en: 'Die on Inside',
          de: 'Innen sterben',
          fr: 'Mourrez à l\'intérieur',
          ja: '中で死ぬ',
          cn: '在里面死亡',
          ko: '안쪽 레이저 맞기',
        },
        dieInInIn: {
          en: 'die in in in',
          de: 'sterben rein rein rein',
          fr: 'Mourrez Intérieur Intérieur Intérieur',
          ja: '死になさい！',
          cn: '死亡',
          ko: '안쪽 레이저 맞기',
        },
        outOutOut: {
          en: 'out out out',
          de: 'raus raus raus',
          fr: 'Extérieur Extérieur Extérieur',
          ja: '出て出て！',
          cn: '出去出去',
          ko: '바깥으로',
        },
      },
    },
    {
      id: 'O4S Neo Flood of Naught: Outside',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '240F', source: 'Neo Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '240F', source: 'Neo Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '240F', source: 'Néo-Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '240F', source: 'ネオエクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '240F', source: '新生艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '240F', source: '네오 엑스데스', capture: false }),
      durationSeconds: 6,
      alarmText: (data, _matches, output) => {
        if (shouldDieOnLaser(data))
          return output.dieOnOutside!();
      },
      alertText: (data, _matches, output) => {
        if (!shouldDieOnLaser(data))
          return output.goInside!();
      },
      tts: (data, _matches, output) => {
        if (shouldDieOnLaser(data))
          return output.dieOutOutOut!();

        return output.inInIn!();
      },
      outputStrings: {
        goInside: {
          en: 'Go Inside',
          de: 'Rein gehen',
          fr: 'Allez à l\'intérieur',
          ja: '中に入る',
          cn: '去里面',
          ko: '안으로',
        },
        dieOnOutside: {
          en: 'Die on Outside',
          de: 'Außen sterben',
          fr: 'Mourrez à l\'extérieur',
          ja: '外で死ぬ',
          cn: '在外面死亡',
          ko: '바깥 레이저 맞기',
        },
        dieOutOutOut: {
          en: 'die out out out',
          de: 'sterben raus raus raus',
          fr: 'Mourrez Extérieur Extérieur Extérieur',
          ja: '死になさい！',
          cn: '在外面死亡',
          ko: '바깥 레이저 맞기',
        },
        inInIn: {
          en: 'in in in',
          de: 'rein rein rein',
          fr: 'Intérieur Intérieur Intérieur',
          ja: '入れ入れ',
          cn: '进去进去',
          ko: '안으로',
        },
      },
    },
    {
      id: 'O4S Neo Flood of Naught: Colors Purple Blue',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '2411', source: 'Neo Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2411', source: 'Neo Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2411', source: 'Néo-Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2411', source: 'ネオエクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2411', source: '新生艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2411', source: '네오 엑스데스', capture: false }),
      durationSeconds: 6,
      alarmText: (data, _matches, output) => {
        if (!shouldDieOnLaser(data))
          return;

        if (data.blackWound)
          return output.dieOnRightBlue!();
        else if (data.whiteWound)
          return output.dieOnLeftPurple!();

        return output.dieOnColorSides!();
      },
      alertText: (data, _matches, output) => {
        if (shouldDieOnLaser(data))
          return;

        if (data.blackWound)
          return output.leftOnPurple!();
        else if (data.whiteWound)
          return output.rightOnBlue!();

        return output.colorSides!();
      },
      tts: (_data, _matches, output) => output.colors!(),
      outputStrings: {
        leftOnPurple: {
          en: 'Left On Purple',
          de: 'Links auf Pink',
          fr: 'À gauche sur le violet',
          ja: '左の紫色に',
          cn: '左边紫色',
          ko: '왼쪽 보라',
        },
        rightOnBlue: {
          en: 'Right On Blue',
          de: 'Rechts auf Blau',
          fr: 'À droite sur le bleu',
          ja: '右の青色に',
          cn: '右边蓝色',
          ko: '오른쪽 파랑',
        },
        colorSides: {
          en: 'Color sides',
          de: 'Farbige Seiten',
          fr: 'Côtés de couleur',
          ja: '同じ色に',
          cn: '颜色一侧',
          ko: '색깔 맞기',
        },
        dieOnRightBlue: {
          en: 'Die On Right Blue',
          de: 'In Blauem rechts sterben',
          fr: 'Mourrez à droite sur le bleu',
          ja: '右の青色で死ぬ',
          cn: '在右边蓝色死亡',
          ko: '오른쪽 파랑 맞기',
        },
        dieOnLeftPurple: {
          en: 'Die On Left Purple',
          de: 'In Pinkem links sterben',
          fr: 'Mourrez à gauche sur le violet',
          ja: '左の紫色で死ぬ',
          cn: '在左边紫色死亡',
          ko: '왼쪽 보라 맞기',
        },
        dieOnColorSides: {
          en: 'Die on color sides',
          de: 'Auf Farben sterben',
          fr: 'Mourrez sur les côtés de couleur',
          ja: '同じ色で死ぬ',
          cn: '在同色一边死亡',
          ko: '색깔 맞기',
        },
        colors: {
          en: 'colors',
          de: 'Farben',
          fr: 'Couleurs',
          ja: '色',
          cn: '看颜色',
          ko: '색깔',
        },
      },
    },
    {
      id: 'O4S Neo Flood of Naught: Colors Blue Purple',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '2412', source: 'Neo Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2412', source: 'Neo Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2412', source: 'Néo-Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2412', source: 'ネオエクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2412', source: '新生艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2412', source: '네오 엑스데스', capture: false }),
      durationSeconds: 6,
      alarmText: (data, _matches, output) => {
        if (!shouldDieOnLaser(data))
          return;

        if (data.blackWound)
          return output.dieOnLeftBlue!();
        else if (data.whiteWound)
          return output.dieOnRightPurple!();

        return output.dieOnColorSides!();
      },
      alertText: (data, _matches, output) => {
        if (shouldDieOnLaser(data))
          return;

        if (data.blackWound)
          return output.beRightOnPurple!();
        else if (data.whiteWound)
          return output.beLeftOnBlue!();

        return output.colorSides!();
      },
      tts: (_data, _matches, output) => output.colors!(),
      outputStrings: {
        beRightOnPurple: {
          en: 'Be Right On Purple',
          de: 'Rechts auf Pink',
          fr: 'Soyez à droite sur le violet',
          ja: '右の紫色に',
          cn: '去右边紫色',
          ko: '오른쪽 보라 맞기',
        },
        beLeftOnBlue: {
          en: 'Be Left On Blue',
          de: 'Links auf Blau',
          fr: 'Soyez à gauche sur le bleu',
          ja: '左の青色に',
          cn: '去左边蓝色',
          ko: '왼쪽 파랑 맞기',
        },
        colorSides: {
          en: 'Color sides',
          de: 'Farbige Seiten',
          fr: 'Côtés de couleur',
          ja: '同じ色に',
          cn: '颜色一侧',
          ko: '색깔 방향',
        },
        dieOnLeftBlue: {
          en: 'Die On Left Blue',
          de: 'Auf Blauem links sterben',
          fr: 'Mourrez à gauche sur le bleu',
          ja: '左の青色で死ぬ',
          cn: '在左边蓝色死亡',
          ko: '왼쪽 파랑 맞기',
        },
        dieOnRightPurple: {
          en: 'Die On Right Purple',
          de: 'Auf Pinkem rechts sterben',
          fr: 'Mourrez à droite sur le violet',
          ja: '右の紫色で死ぬ',
          cn: '在右边紫色死亡',
          ko: '오른쪽 보라 맞기',
        },
        dieOnColorSides: {
          en: 'Die on color sides',
          de: 'Auf Farben sterben',
          fr: 'Mourrez sur les côtés de couleur',
          ja: '同じ色で死ぬ',
          cn: '在同色一边死亡',
          ko: '색깔 맞기',
        },
        colors: {
          en: 'colors',
          de: 'farben',
          fr: 'Couleurs',
          ja: '色',
          cn: '颜色',
          ko: '색깔',
        },
      },
    },
    {
      id: 'O4S Neo Laser Counter',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['240E', '240F', '2411', '2412'], source: 'Neo Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['240E', '240F', '2411', '2412'], source: 'Neo Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['240E', '240F', '2411', '2412'], source: 'Néo-Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['240E', '240F', '2411', '2412'], source: 'ネオエクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: ['240E', '240F', '2411', '2412'], source: '新生艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: ['240E', '240F', '2411', '2412'], source: '네오 엑스데스', capture: false }),
      run: (data) => {
        if (data.phase !== 'omega')
          return;

        // See comments in shouldDieOnLaser.  Beyond Death
        // doesn't get removed until after the 2nd laser
        // appears.  However, colors (THANKFULLY) apply
        // before the next laser appears.
        if (shouldDieOnLaser(data))
          data.omegaProbablyDiedOnLaser = true;

        data.omegaLaserCount = (data.omegaLaserCount ?? 1) + 1;
      },
    },
    {
      id: 'O4S Neo Flood of Naught: Charge',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '2416', source: 'Neo Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2416', source: 'Neo Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2416', source: 'Néo-Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2416', source: 'ネオエクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2416', source: '新生艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2416', source: '네오 엑스데스', capture: false }),
      infoText: (data, _matches, output) => {
        if (data.allaganField) {
          if (data.role === 'tank')
            return output.chargeBeBehindOtherTank!();

          return output.chargeBeInTheVeryBack!();
        }
        if (data.role === 'tank')
          return output.chargeBeInFront!();

        return output.chargeBeBehindTanks!();
      },
      tts: (_data, _matches, output) => output.charge!(),
      outputStrings: {
        chargeBeBehindOtherTank: {
          en: 'Charge: be behind other tank',
          de: 'Aufladung: hinter anderen Tank',
          fr: 'Charge : Soyez derrière l\'autre tank',
          ja: '突進: 他のタンクの後ろに',
          cn: '站在另一个坦克后面',
          ko: '탱커 뒤에 있기',
        },
        chargeBeInTheVeryBack: {
          en: 'Charge: be in the very back',
          de: 'Aufladung: Ganz nach hinten',
          fr: 'Charge : Soyez tout au fond',
          ja: '突進: 後ろの遠くへ',
          cn: '去后面',
          ko: '가장 뒤에 있기',
        },
        chargeBeInFront: {
          en: 'Charge: be in front!',
          de: 'Aufladung: Ganz nach vorn',
          fr: 'Charge : Soyez devant !',
          ja: '突進: 前方に',
          cn: '去前面',
          ko: '앞쪽으로',
        },
        chargeBeBehindTanks: {
          en: 'Charge: be behind tanks',
          de: 'Aufladung: Hinter die Tanks',
          fr: 'Charge : Soyez derrière les tanks',
          ja: '突進: タンクの後ろに',
          cn: '站在坦克后面',
          ko: '탱커 뒤로',
        },
        charge: {
          en: 'charge',
          de: 'aufladung',
          fr: 'Charge',
          ja: '無の氾濫',
          cn: '充能',
          ko: '무의 범람',
        },
      },
    },
    {
      id: 'O4S Neo Double Attack',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '241C', source: 'Neo Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '241C', source: 'Neo Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '241C', source: 'Néo-Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '241C', source: 'ネオエクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '241C', source: '新生艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '241C', source: '네오 엑스데스', capture: false }),
      alertText: (data, _matches, output) => {
        if (data.role === 'tank')
          return output.doubleAttack!();

        return output.doubleAttackGetOut!();
      },
      tts: (_data, _matches, output) => output.doubleAttack!(),
      outputStrings: {
        doubleAttack: {
          en: 'Double Attack',
          de: 'Doppelangriff',
          fr: 'Double attaque',
          ja: 'ダブルアタック',
          cn: '双重攻击',
          ko: '이중 공격',
        },
        doubleAttackGetOut: {
          en: 'Double Attack: Get out',
          de: 'Doppelangriff: Raus da',
          fr: 'Double attaque : À l\'extérieur',
          ja: 'ダブルアタック: 外へ',
          cn: '双重攻击：去外面',
          ko: '이중 공격: 밖으로',
        },
      },
    },
    { // Grand Cross Alpha.
      id: 'O4S Neo Grand Cross Alpha',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '242B', source: 'Neo Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '242B', source: 'Neo Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '242B', source: 'Néo-Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '242B', source: 'ネオエクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '242B', source: '新生艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '242B', source: '네오 엑스데스', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      tts: (_data, _matches, output) => output.tts!(),
      outputStrings: {
        text: {
          en: 'Grand Cross Alpha: Go to middle',
          de: 'Supernova Alpha: In die Mitte',
          fr: 'Croix suprême alpha : Allez au milieu',
          ja: 'グランドクロス・アルファ: 中央に',
          cn: '前往中间集合',
          ko: '그랜드크로스: 알파, 중앙으로',
        },
        tts: {
          en: 'go to middle',
          de: 'In die Mitte',
          fr: 'allez au milieu',
          ja: '中央に',
          cn: '前往中间',
          ko: '중앙으로',
        },
      },
    },
    {
      id: 'O4S Neo Grand Cross Delta',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '242C', source: 'Neo Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '242C', source: 'Neo Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '242C', source: 'Néo-Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '242C', source: 'ネオエクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '242C', source: '新生艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '242C', source: '네오 엑스데스', capture: false }),
      infoText: (data, _matches, output) => {
        if (data.role === 'tank')
          return output.beInFront!();

        if (data.role === 'healer')
          return output.beOnSides!();

        return output.beInsideBoss!();
      },
      tts: (data, _matches, output) => {
        if (data.role === 'tank')
          return output.beInFrontTTS!();

        if (data.role === 'healer')
          return output.beOnSidesTTS!();

        return output.beInsideBossTTS!();
      },
      outputStrings: {
        beInFront: {
          en: 'Grand Cross Delta: Be in front of boss',
          de: 'Supernova Delta: Vor den Boss',
          fr: 'Croix suprême delta : Soyez devant le boss',
          ja: 'グランドクロス・デルタ: ボスの前に',
          cn: '站在boss前面',
          ko: '그랜드크로스: 델타, 보스 범위 끝으로',
        },
        beOnSides: {
          en: 'Grand Cross Delta: Be on sides of boss',
          de: 'Supernova Delta: An die Seiten vom Boss',
          fr: 'Croix suprême delta : Soyez sur les côtés du boss',
          ja: 'グランドクロス・デルタ: ボスの横に',
          cn: '站在boss后面',
          ko: '그랜드크로스: 델타, 보스 옆쪽으로',
        },
        beInsideBoss: {
          en: 'Grand Cross Delta: Inside boss',
          de: 'Supernvoa Delta: In den Boss',
          fr: 'Croix suprême delta : À l\'intérieur du boss',
          ja: 'グランドクロス・デルタ: ボスの真ん中に',
          cn: '站在boss中间',
          ko: '그랜드크로스: 델타, 보스 안쪽으로',
        },
        beInFrontTTS: {
          en: 'delta: be in front',
          de: 'delta: vor den boss',
          fr: 'delta : soyez devant',
          ja: 'ボスの前に',
          cn: '去前面',
          ko: '델타, 보스 범위 끝으로',
        },
        beOnSidesTTS: {
          en: 'delta: be on sides',
          de: 'delta: an die seiten',
          fr: 'delta : soyez sur les côtés',
          ja: 'ボスの横に',
          cn: '去两侧',
          ko: '델타, 보스 옆쪽으로',
        },
        beInsideBossTTS: {
          en: 'delta: be inside boss',
          de: 'delta: in den boss',
          fr: 'delta : À l\'intérieur du boss',
          ja: 'ボスの真ん中に',
          cn: '去boss中间',
          ko: '델타, 보스 안쪽으로',
        },
      },
    },
    {
      id: 'O4S Neo Grand Cross Omega',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '242D', source: 'Neo Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '242D', source: 'Neo Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '242D', source: 'Néo-Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '242D', source: 'ネオエクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '242D', source: '新生艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '242D', source: '네오 엑스데스', capture: false }),
      response: Responses.goMiddle(),
    },
    {
      id: 'O4S Neo Forked Lightning',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '24B' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: 1,
      response: Responses.spread(),
    },
    {
      id: 'O4S Neo Acceleration Bomb',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '568' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 4, // 4 second warning.
      alarmText: (data, _matches, output) => {
        if (data.phase === 'omega')
          return output.lookAwayAndStop!();

        return output.stop!();
      },
      outputStrings: {
        lookAwayAndStop: {
          en: 'look away and stop',
          de: 'wegschauen und stehenbleiben',
          fr: 'regardez ailleurs et arrêtez',
          ja: '見ない、動かない',
          cn: '看外面并静止',
          ko: '바라보지 말고 멈추기',
        },
        stop: {
          en: 'stop',
          de: 'Stopp',
          fr: 'Arrêtez',
          ja: '動かない',
          cn: '静止',
          ko: '멈추기',
        },
      },
    },
    {
      id: 'O4S Neo Acceleration Bomb Delta',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '568' }),
      condition: (data, matches) => matches.target === data.me && data.phase === 'delta',
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Acceleration Bomb',
          de: 'Beschleunigungsbombe',
          fr: 'Bombe à accélération',
          ja: '加速度爆弾',
          cn: '加速度炸弹',
          ko: '가속도 폭탄',
        },
      },
    },
    {
      id: 'O4S Neo Omega Shriek',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '1C4' }),
      condition: (data, matches) => matches.target === data.me && data.phase === 'omega',
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 5,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'shriek: get mid, look away',
          de: 'Schrei: Zur mitte und wegschauen',
          fr: 'Cri : allez au milieu, regardez ailleurs',
          ja: '呪詛の叫声: 中へ、外を向け',
          cn: '石化点名',
          ko: '중앙으로, 바깥보기',
        },
      },
    },
    {
      id: 'O4S Neo Water Tracker',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '3FF' }),
      run: (data, matches) => data.waterHealer = matches.target,
    },
    {
      // Water Me (Delta/Omega)
      id: 'O4S Neo Water Me',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '3FF' }),
      condition: Conditions.targetIsYou(),
      alarmText: (data, _matches, output) => {
        // Not clear where to tell the healer where to go on delta
        // due to picking a side for uptime strat, or other strats.
        if (data.phase === 'delta')
          return output.waterOnYou!();
        else if (data.phase === 'omega')
          return output.waterStackUnderNeo!();
      },
      outputStrings: {
        waterOnYou: {
          en: 'water on you',
          de: 'wasser auf dir',
          fr: 'Eau sur vous',
          ja: '自分に水属性圧縮',
          cn: '水点名',
          ko: '물 대상자',
        },
        waterStackUnderNeo: {
          en: 'water: stack under neo',
          de: 'Wasser: Unter Neo stacken',
          fr: 'Eau : packez-vous sous Néo',
          ja: '水属性圧縮: ボスの下で頭割り',
          cn: '去下面',
          ko: '물: 보스 아래 모이기',
        },
      },
    },
    {
      // Beyond Death Tank (Delta)
      id: 'O4S Neo Beyond Death Delta Tank',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '566' }),
      condition: (data, matches) => data.phase === 'delta' && matches.target === data.me && data.role === 'tank',
      delaySeconds: 0.5,
      infoText: (data, _matches, output) => {
        // Something went awry, or maybe healers dead.  Just say stack on water anyway,
        // instead of trying to be smart when the healers die.
        if (data.waterHealer)
          return output.stackOnWaterhealer!({ player: data.waterHealer });

        return output.stackOnWater!();
      },
      outputStrings: {
        stackOnWaterhealer: Outputs.stackOnPlayer,
        stackOnWater: {
          en: 'Stack on water',
          de: 'Bei Wasser stacken',
          fr: 'Packez-vous sur l\'eau',
          ja: '水持ちと頭割り',
          cn: '和水点名分摊',
          ko: '물 쉐어',
        },
      },
    },
    {
      // Beyond Death (Delta)
      id: 'O4S Neo Beyond Death Delta Initial',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '566' }),
      condition: (data, matches) => data.phase === 'delta' && matches.target === data.me && data.role !== 'tank',
      infoText: (_data, _matches, output) => output.beyondDeath!(),
      outputStrings: {
        beyondDeath: {
          en: 'Beyond Death',
          de: 'Jenseis Des Jenseits',
          fr: 'Outre-mort',
          ja: '死の超越',
          cn: '超越死亡',
          ko: '죽음 초월',
        },
      },
    },
    {
      // Off Balance (Omega)
      id: 'O4S Neo Off Balance Omega',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '569' }),
      condition: (data, matches) => data.phase === 'omega' && matches.target === data.me,
      delaySeconds: 0.5,
      infoText: (data, _matches, output) => {
        // Good for both dps and tanks.
        if (data.waterHealer)
          return output.stackUnderBossOnWaterhealer!({ waterHealer: data.waterHealer });

        return output.stackOnWater!();
      },
      outputStrings: {
        stackUnderBossOnWaterhealer: {
          en: 'Stack under boss on ${waterHealer}',
          de: 'Unter Boss auf ${waterHealer} stacken',
          fr: 'Packez-vous sous le boss sur ${waterHealer}',
          ja: 'ボスの下で${waterHealer}と頭割り',
          cn: '分摊于${waterHealer}',
          ko: '보스 아래에서 "${waterHealer}"에게 모이기',
        },
        stackOnWater: {
          en: 'Stack on water',
          de: 'Auf Wasser stacken',
          fr: 'Packez-vous sur l\'eau',
          ja: '水と頭割り',
          cn: '和水点名分摊',
          ko: '물 쉐어',
        },
      },
    },
    {
      id: 'O4S Neo Earthshaker on Tank',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0028' }),
      condition: (data, matches) => matches.target === data.me && data.role === 'tank',
      response: Responses.earthshaker('info'),
    },
    {
      id: 'O4S Neo Earthshaker on not Tank',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0028' }),
      condition: (data, matches) => matches.target === data.me && data.role !== 'tank',
      response: Responses.earthshaker('alarm'),
    },
    {
      id: 'O4S Neo Delta Attack',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '241E', source: 'Neo Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '241E', source: 'Neo Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '241E', source: 'Néo-Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '241E', source: 'ネオエクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '241E', source: '新生艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '241E', source: '네오 엑스데스', capture: false }),
      response: Responses.getTogether(),
    },
    {
      id: 'O4S Neo Almagest',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '2417', source: 'Neo Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2417', source: 'Neo Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2417', source: 'Néo-Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2417', source: 'ネオエクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2417', source: '新生艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2417', source: '네오 엑스데스', capture: false }),
      alertText: (_data, _matches, output) => output.almagest!(),
      run: (data) => {
        data.almagestCount = (data.almagestCount ?? 0) + 1;
      },
      outputStrings: {
        almagest: {
          en: 'Almagest',
          de: 'Almagest',
          fr: 'Almageste',
          ja: 'アルマゲスト',
          cn: '大AOE',
          ko: '알마게스트',
        },
      },
    },
    {
      id: 'O4S Neo Flare',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '2401', source: 'Neo Exdeath' }),
      netRegexDe: NetRegexes.startsUsing({ id: '2401', source: 'Neo Exdeath' }),
      netRegexFr: NetRegexes.startsUsing({ id: '2401', source: 'Néo-Exdeath' }),
      netRegexJa: NetRegexes.startsUsing({ id: '2401', source: 'ネオエクスデス' }),
      netRegexCn: NetRegexes.startsUsing({ id: '2401', source: '新生艾克斯迪司' }),
      netRegexKo: NetRegexes.startsUsing({ id: '2401', source: '네오 엑스데스' }),
      condition: (data, matches) => {
        data.flareTargets ??= [];
        data.flareTargets.push(matches.target);
        return data.flareTargets.length === 3;
      },
      alarmText: (data, _matches, output) => {
        if (data.flareTargets?.includes(data.me))
          return output.flareOnYou!();
      },
      infoText: (data, _matches, output) => {
        if (!data.flareTargets?.includes(data.me))
          return output.stack!();
      },
      tts: (data, _matches, output) => {
        if (data.flareTargets?.includes(data.me))
          return output.flareOnYou!();

        return output.stackTTS!();
      },
      run: (data) => delete data.flareTargets,
      outputStrings: {
        stack: {
          en: 'Light and Darkness: Stack',
          de: 'Licht und Dunkel: Stack',
          fr: 'Clair-obscur : Packez-vous',
          ja: 'ライト・アンド・ダークネス: 頭割り',
          cn: '分摊点名',
          ko: '빛과 어둠: 모이기',
        },
        flareOnYou: {
          en: 'Flare on you',
          de: 'Flare auf dir',
          fr: 'Brasier sur vous',
          ja: '自分にフレア',
          cn: '核爆点名',
          ko: '플레어 대상자',
        },
        stackTTS: {
          en: 'stack',
          de: 'stek',
          fr: 'packez-vous',
          ja: '頭割り',
          cn: '分摊',
          ko: '모이기',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Blizzard III/Fire III/Thunder III': 'Blizzard/Fire/Thunder III',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'Exdeath': 'Exdeath',
      },
      'replaceText': {
        '\\(charge\\)': '(Aufladung)',
        '\\(colors': '(Farben',
        'lasers\\)': 'Laser)',
        'Aero III': 'Windga',
        'Almagest': 'Almagest',
        'Black Hole': 'Schwarzes Loch',
        'Blizzard III': 'Eisga',
        'Charybdis': 'Charybdis',
        'Collision': 'Aufprall',
        'Delta Attack': 'Delta-Attacke',
        'Double Attack': 'Doppelangriff',
        'Dualcast': 'Doppelzauber',
        'Earth Shaker': 'Erdstoß',
        'Emptiness': 'Tobende Leere',
        'Final Battle': 'Finaler Kampf',
        'Fire III': 'Feuga',
        'Flare': 'Flare',
        'Flood of Naught': 'Flut der Leere',
        'Flying Frenzy': 'Rasender Sturz',
        'Frenzied Fist': 'Rasende Faust',
        'Frenzied Sphere': 'Rasender Orbis',
        'Grand Cross Alpha': 'Supernova Alpha',
        'Grand Cross Delta': 'Supernova Delta',
        'Grand Cross Omega': 'Supernova Omega',
        'Holy': 'Sanctus',
        'Light and Darkness': 'Licht und Dunkelheit',
        'Meteor': 'Meteor',
        'Neverwhere': 'Nirgendwann',
        'The Decisive Battle': 'Entscheidungsschlacht',
        'Thunder III': 'Blitzga',
        'Vacuum Wave': 'Vakuumwelle',
        'White Hole': 'Weißes Loch',
        'Zombie Breath': 'Zombie-Atem',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Exdeath': 'Exdeath',
      },
      'replaceText': {
        '\\(colors\\)': '(couleurs)',
        '\\(colors/lasers\\)': '(couleurs/lasers)',
        'Aero III': 'Méga Vent',
        'Almagest': 'Almageste',
        'Black Hole': 'Trou noir',
        'Blizzard III(?!/)': 'Méga Glace',
        'Blizzard III/Fire III/Thunder III': 'Méga Glace/Feu/Foudre',
        'Charybdis': 'Charybde',
        'Collision': 'Impact',
        'Delta Attack': 'Attaque Delta',
        'Double Attack': 'Double attaque',
        'Dualcast': 'Chaîne de sorts',
        'Earth Shaker': 'Secousse',
        'Emptiness': 'Désolation du néant',
        '(?<!/)Fire III(?!/)': 'Méga Feu',
        'Flare': 'Brasier',
        'Flood of Naught': 'Crue du néant',
        'Flying Frenzy': 'Démence',
        'Frenzied Fist': 'Poing de la démence',
        'Frenzied Sphere': 'Démence terminale',
        'Grand Cross Alpha': 'Croix suprême alpha',
        'Grand Cross Delta': 'Croix suprême delta',
        'Grand Cross Omega': 'Croix suprême oméga',
        'Holy': 'Miracle',
        'Light and Darkness': 'Clair-obscur',
        'Meteor': 'Météore',
        'Neverwhere': 'Anarchie',
        'The Decisive Battle': 'Combat décisif',
        'The Final Battle': 'Lutte finale',
        '(?<!/)Thunder III': 'Méga Foudre',
        'Vacuum Wave': 'Vague de vide',
        'White Hole': 'Trou blanc',
        'Zombie Breath': 'Haleine zombie',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        '(?<! )Exdeath': 'エクスデス',
        'Neo Exdeath': 'ネオエクスデス',
      },
      'replaceText': {
        'Aero III': 'エアロガ',
        'Almagest': 'アルマゲスト',
        'Black Hole': 'ブラックホール',
        'Blizzard III': 'ブリザガ',
        'Charybdis': 'ミールストーム',
        'Collision': '衝撃',
        'Delta Attack': 'デルタアタック',
        'Double Attack': 'ダブルアタック',
        'Dualcast': '連続魔',
        'Earth Shaker': 'アースシェイカー',
        'Emptiness': '無の暴走',
        'Final Battle': '最後の闘い',
        'Fire III': 'ファイガ',
        'Flare': 'フレア',
        'Flying Frenzy': '狂乱',
        'Flood of Naught': '無の氾濫',
        'Frenzied Fist': '狂乱の拳',
        'Frenzied Sphere': '狂乱の極地',
        'Grand Cross Alpha': 'グランドクロス・アルファ',
        'Grand Cross Delta': 'グランドクロス・デルタ',
        'Grand Cross Omega': 'グランドクロス・オメガ',
        'Holy': 'ホーリー',
        'Light and Darkness': 'ライト・アンド・ダークネス',
        'Meteor': 'メテオ',
        'Neverwhere': '法則崩壊',
        'The Decisive Battle': '決戦',
        'Thunder III': 'サンダガ',
        'Vacuum Wave': '真空波',
        'White Hole': 'ホワイトホール',
        'Zombie Breath': 'ゾンビブレス',
      },
    },
    {
      'locale': 'cn',
      'missingTranslations': true,
      'replaceSync': {
        '(?<! )Exdeath': '艾克斯迪司',
        'Neo Exdeath': '新生艾克斯迪司',
      },
      'replaceText': {
        'Aero III': '暴风',
        'Almagest': '至高无上',
        'Black Hole': '黑洞',
        'Blizzard III': '冰封',
        'Charybdis': '大漩涡',
        'Collision': '冲击',
        'Delta Attack': '三角攻击',
        'Double Attack': '双重攻击',
        'Tethers': '连线',
        'Dualcast': '连续咏唱',
        'Earth Shaker': '大地摇动',
        'Emptiness': '无之失控',
        'Final Battle': '最终之战',
        'Fire III': '爆炎',
        'Flare': '核爆',
        'Flying Frenzy': '狂乱',
        'Flood of Naught': '无之泛滥',
        'Frenzied Fist': '狂乱之拳',
        'Frenzied Sphere': '狂乱领域',
        'Grand Cross Alpha': '大十字·阿尔法',
        'Grand Cross Delta': '大十字·德尔塔',
        'Grand Cross Omega': '大十字·欧米茄',
        'Holy': '神圣',
        'Light and Darkness': '光与暗',
        'Meteor': '陨石',
        'Neverwhere': '规律崩坏',
        'The Decisive Battle': '决战',
        'Thunder III': '暴雷',
        'T/H': 'T/奶',
        'Vacuum Wave': '真空波',
        'White Hole': '白洞',
        'Zombie Breath': '死亡吐息',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {
        '(?<! )Exdeath': '엑스데스',
        'Neo Exdeath': '네오 엑스데스',
      },
      'replaceText': {
        'Aero III': '에어로가',
        'Almagest': '알마게스트',
        'Black Hole': '블랙홀',
        'Blizzard III': '블리자가',
        'Charybdis': '대소용돌이',
        'Collision': '충격',
        'Delta Attack': '델타 공격',
        'Double Attack': '이중 공격',
        'Dualcast': '연속 마법',
        'Earth Shaker': '요동치는 대지',
        'Emptiness': '무의 폭주',
        'Fire III': '파이가',
        'Flare': '플레어',
        'Flood of Naught': '무의 범람',
        'Final Battle': '마지막 싸움',
        'Flying Frenzy': '광란',
        'Frenzied Fist': '광란의 주먹',
        'Frenzied Sphere': '광란의 극지',
        'Grand Cross Alpha': '그랜드크로스: 알파',
        'Grand Cross Delta': '그랜드크로스: 델타',
        'Grand Cross Omega': '그랜드크로스: 오메가',
        'Holy': '홀리',
        'Light and Darkness': '빛과 어둠',
        'Tethers': '선',
        'Meteor': '메테오',
        'Neverwhere': '법칙 붕괴',
        'The Decisive Battle': '결전',
        'Thunder III': '선더가',
        'T/H': '탱/힐',
        'Vacuum Wave': '진공파',
        'White Hole': '화이트홀',
        'Zombie Breath': '좀비 숨결',
      },
    },
  ],
};

export default triggerSet;
