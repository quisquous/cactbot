import Conditions from '../../../../../resources/conditions.js';
import NetRegexes from '../../../../../resources/netregexes.js';
import { Responses } from '../../../../../resources/responses.js';
import ZoneId from '../../../../../resources/zone_id.js';

export default {
  zoneId: ZoneId.MatoyasRelict,
  timelineFile: 'matoyas_relict.txt',
  triggers: [
    {
      id: 'Matoyas Mudman Hard Rock',
      netRegex: NetRegexes.startsUsing({ id: '547F', source: 'Mudman' }),
      netRegexDe: NetRegexes.startsUsing({ id: '547F', source: 'Matschmann' }),
      netRegexFr: NetRegexes.startsUsing({ id: '547F', source: 'tadboue' }),
      netRegexJa: NetRegexes.startsUsing({ id: '547F', source: 'マッドマン' }),
      condition: function(data, matches) {
        return data.me === matches.target || data.role === 'healer';
      },
      response: Responses.tankBuster(),
    },
    {
      id: 'Matoyas Mudman Petrified Peat',
      netRegex: NetRegexes.startsUsing({ id: '5480', source: 'Mudman', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5480', source: 'Matschmann', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5480', source: 'tadboue', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5480', source: 'マッドマン', capture: false }),
      response: Responses.moveAway('info'),
    },
    {
      id: 'Matoyas Mudman Peat Pelt',
      netRegex: NetRegexes.ability({ id: '5482', source: 'Mudman', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '5482', source: 'Matschmann', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '5482', source: 'tadboue', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '5482', source: 'マッドマン', capture: false }),
      alertText: (data, _, output) => output.pullOrb(),
      outputStrings: {
        pullOrb: {
          en: 'Pull orb to an empty hole',
          ja: '泥団子を四隅の穴に誘導',
          cn: '诱导泥球到无敌人的风圈',
        },
      },
    },
    {
      id: 'Matoyas Mudman Stone Age',
      netRegex: NetRegexes.startsUsing({ id: '5491', source: 'Mudman', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5491', source: 'Matschmann', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5491', source: 'tadboue', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5491', source: 'マッドマン', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Matoyas Nixie Crash-smash',
      netRegex: NetRegexes.startsUsing({ id: '598F', source: 'Nixie', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '598F', source: 'Nixchen', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '598F', source: 'nixe', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '598F', source: 'ノッケン', capture: false }),
      alertText: (data, _, output) => output.awayFrom(),
      outputStrings: {
        awayFrom: {
          en: 'Away from Tank and his Tether',
          ja: 'タンクや線に離れ',
          cn: '远离坦克及其连线',
        },
      },
    },
    {
      id: 'Matoyas Nixie Shower Power',
      netRegex: NetRegexes.startsUsing({ id: '5991', source: 'Nixie', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5991', source: 'Nixchen', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5991', source: 'nixe', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5991', source: 'ノッケン', capture: false }),
      alertText: (data, _, output) => output.moveTo(),
      outputStrings: {
        moveTo: {
          en: 'Move to ...',
          ja: '光ってない横列に移動',
          cn: '站在墙壁未发光的一列',
        },
      },
    },
    {
      id: 'Matoyas Nixie Pitter-patter',
      netRegex: NetRegexes.ability({ id: '5991', source: 'Nixie', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '5991', source: 'Nixchen', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '5991', source: 'nixe', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '5991', source: 'ノッケン', capture: false }),
      delaySeconds: 3,
      infoText: (data, _, output) => output.stepIn(),
      outputStrings: {
        stepIn: {
          en: 'Step in Puddle near the Cloud',
          ja: '雲に近い水を踏む',
          cn: '站在靠近云朵的水流里等待浮空',
        },
      },
    },
    {
      id: 'Matoyas Porxie Tender Loin',
      netRegex: NetRegexes.startsUsing({ id: '5913', source: 'Mother Porxie', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5913', source: 'Muttersau', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5913', source: 'mère porxie', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5913', source: 'マザーポークシー', capture: false }),
      condition: Conditions.caresAboutAOE(),
      delaySeconds: 3,
      response: Responses.aoe(),
    },
    {
      id: 'Matoyas Porxie Huff and Puff',
      netRegex: NetRegexes.startsUsing({ id: '5919', source: 'Mother Porxie', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5919', source: 'Muttersau', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5919', source: 'mère porxie', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5919', source: 'マザーポークシー', capture: false }),
      alarmText: (data, _, output) => output.standFront(),
      outputStrings: {
        standFront: {
          en: 'Stand in front of Boss (anti-knockback not usable)',
          ja: 'ボスの正面に (堅実魔効かない)',
          cn: '站在Boss正面 (防击退无效)',
        },
      },
    },
    {
      id: 'Matoyas Porxie Meat Mallet',
      netRegex: NetRegexes.startsUsing({ id: '5916', source: 'Mother Porxie', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5916', source: 'Muttersau', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5916', source: 'mère porxie', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5916', source: 'マザーポークシー', capture: false }),
      alarmText: (data, _, output) => output.awayFromAoe(),
      outputStrings: {
        awayFromAoe: {
          en: 'Away From AoE',
          ja: '反対側へ',
          cn: '对面躲避坠落',
        },
      },
    },
    {
      id: 'Matoyas Porxie Barbeque',
      netRegex: NetRegexes.ability({ id: '5916', source: 'Mother Porxie', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '5916', source: 'Muttersau', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '5916', source: 'mère porxie', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '5916', source: 'マザーポークシー', capture: false }),
      delaySeconds: 5,
      alarmText: (data, _, output) => output.awayFrom(),
      outputStrings: {
        awayFrom: {
          en: 'Away From Boss',
          ja: 'ボスに離れ',
          cn: '远离Boss所在的行',
        },
      },
    },
    {
      id: 'Matoyas Porxie Sucked In',
      netRegex: NetRegexes.gainsEffect({ effectId: '5916', capture: false }),
      alarmText: (data, _, output) => output.runAway(),
      outputStrings: {
        runAway: {
          en: 'RUN AWAY',
          ja: 'ボスに離れ',
          cn: '远离即死区',
        },
      },
    },
    {
      id: 'Matoyas Porxie Minced Meat',
      netRegex: NetRegexes.startsUsing({ id: '5911', source: 'Mother Porxie' }),
      netRegexDe: NetRegexes.startsUsing({ id: '5911', source: 'Muttersau' }),
      netRegexFr: NetRegexes.startsUsing({ id: '5911', source: 'mère porxie' }),
      netRegexJa: NetRegexes.startsUsing({ id: '5911', source: 'マザーポークシー' }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'Matoyas Porxie Sprite Explosion',
      netRegex: NetRegexes.ability({ id: '4E34', source: 'aeolian cave sprite', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '4E34', source: 'Windhöhlen-Exergon', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '4E34', source: 'élémentaire des cavernes venteuses', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '4E34', source: 'ウィンドケイブ・スプライト', capture: false }),
      delaySeconds: 2,
      alarmText: (data, _, output) => output.move(),
      outputStrings: {
        move: {
          en: 'Remember where Boss is and move there quickly',
          ja: 'ボスの居場所に移動',
          cn: '升空时记住Boss的位置然后迅速靠近',
        },
      },
    },
    {
      id: 'Matoyas Porxie Open Flame',
      netRegex: NetRegexes.startsUsing({ id: '5922', source: 'Mother Porxie', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5922', source: 'Muttersau', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5922', source: 'mère porxie', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5922', source: 'マザーポークシー', capture: false }),
      response: Responses.spread(),
    },
  ],
};
