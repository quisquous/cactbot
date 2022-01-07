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
      // Alarm text mostly because this one kills so many people.
      alarmText: (_data, _matches, output) => output.outAndBehind!(),
      outputStrings: {
        outAndBehind: {
          en: 'Get Behind and Out',
          de: 'Geh hinter ihn und dann raus',
          fr: 'Passez derrière et à l\'extérieur',
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
      alertText: (_data, _matches, output) => output.getFront!(),
      outputStrings: {
        getFront: {
          en: 'Get Front',
          de: 'Geh nach Vorne',
          fr: 'Allez devant',
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
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          missleOnYou: {
            en: 'GTFO with marker',
            de: 'Geh raus mit dem Marker',
            fr: 'Partez avec le marquage',
          },
          missleMarker: {
            en: 'Away from marker',
            de: 'Weg vom Marker',
            fr: 'Éloignez-vous du marquage',
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
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          missleOnYou: {
            en: 'Place donut marker under',
            de: 'Platziere Donut-Marker unter ihm',
            fr: 'En dessous le marquage du donut',
          },
          missleMarker: {
            en: 'Stack on marker',
            de: 'Auf dem Marker sammeln',
            fr: 'Packez-vous sur les marquages',
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
