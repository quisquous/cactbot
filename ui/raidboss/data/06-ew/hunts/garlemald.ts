import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: Minerva Hammer Knuckles tankbuster
// TODO: Minerva Sonic Amplifier aoe

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.Garlemald,
  triggers: [
    {
      id: 'Hunt Aegeiros Leafstorm',
      type: 'StartsUsing',
      // This always precedes Rimestorm (6C3D).
      netRegex: NetRegexes.startsUsing({ id: '6C3C', source: 'Aegeiros', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6C3C', source: 'Aegeiros', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6C3C', source: 'Ægeiros', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6C3C', source: 'アイゲイロス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '6C3C', source: '黑杨树精', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '6C3C', source: '아이게이로스', capture: false }),
      // Alarm text mostly because this one kills so many people.
      alarmText: (_data, _matches, output) => output.outAndBehind!(),
      outputStrings: {
        outAndBehind: {
          en: 'Get Behind and Out',
          de: 'Geh hinter ihn und dann raus',
          fr: 'Passez derrière et à l\'extérieur',
          cn: '去背后',
          ko: '뒤로 그리고 밖으로',
        },
      },
    },
    {
      id: 'Hunt Aegeiros Backhand Blow',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6C40', source: 'Aegeiros', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6C40', source: 'Aegeiros', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6C40', source: 'Ægeiros', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6C40', source: 'アイゲイロス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '6C40', source: '黑杨树精', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '6C40', source: '아이게이로스', capture: false }),
      alertText: (_data, _matches, output) => output.getFront!(),
      outputStrings: {
        getFront: {
          en: 'Get Front',
          de: 'Geh nach Vorne',
          fr: 'Allez devant',
          cn: '去正面',
          ko: '앞으로',
        },
      },
    },
    {
      id: 'Hunt Minerva Anti-personnel Build Ballistic Missile',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6B7D', source: 'Minerva' }),
      netRegexDe: NetRegexes.startsUsing({ id: '6B7D', source: 'Minerva' }),
      netRegexFr: NetRegexes.startsUsing({ id: '6B7D', source: 'Minerva' }),
      netRegexJa: NetRegexes.startsUsing({ id: '6B7D', source: 'ミネルウァ' }),
      netRegexCn: NetRegexes.startsUsing({ id: '6B7D', source: '密涅瓦' }),
      netRegexKo: NetRegexes.startsUsing({ id: '6B7D', source: '미네르바' }),
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          missleOnYou: {
            en: 'GTFO with marker',
            de: 'Geh raus mit dem Marker',
            fr: 'Partez avec le marquage',
            cn: '快躲开标记',
            ko: '나에게 징 멀리 빠지기',
          },
          missleMarker: {
            en: 'Away from marker',
            de: 'Weg vom Marker',
            fr: 'Éloignez-vous du marquage',
            cn: '躲开标记',
            ko: '징에서 멀리 떨어지기',
          },
        };

        if (data.me === matches.target)
          return { alarmText: output.missleOnYou!() };
        return { alertText: output.missleMarker!() };
      },
    },
    {
      id: 'Hunt Minerva Ring Build Ballistic Missile',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6B7E', source: 'Minerva' }),
      netRegexDe: NetRegexes.startsUsing({ id: '6B7E', source: 'Minerva' }),
      netRegexFr: NetRegexes.startsUsing({ id: '6B7E', source: 'Minerva' }),
      netRegexJa: NetRegexes.startsUsing({ id: '6B7E', source: 'ミネルウァ' }),
      netRegexCn: NetRegexes.startsUsing({ id: '6B7E', source: '密涅瓦' }),
      netRegexKo: NetRegexes.startsUsing({ id: '6B7E', source: '미네르바' }),
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          missleOnYou: {
            en: 'Place donut marker under',
            de: 'Platziere Donut-Marker unter ihm',
            fr: 'En dessous le marquage du donut',
            cn: '放置环形标记',
            ko: '나에게 도넛 장판',
          },
          missleMarker: {
            en: 'Stack on marker',
            de: 'Auf dem Marker sammeln',
            fr: 'Packez-vous sur les marquages',
            cn: '标记处集合',
            ko: '도넛징 대상자에게 붙기',
          },
        };

        if (data.me === matches.target)
          return { alarmText: output.missleOnYou!() };
        return { alertText: output.missleMarker!() };
      },
    },
  ],
};

export default triggerSet;
