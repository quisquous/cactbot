import Conditions from '../../../../../resources/conditions.js';
import NetRegexes from '../../../../../resources/netregexes.js';
import { Responses } from '../../../../../resources/responses.js';
import ZoneId from '../../../../../resources/zone_id.js';

export default {
  zoneId: ZoneId.SaintMociannesArboretumHard,
  timelineFile: 'st_mocianne_hard.txt',
  timelineTriggers: [
    {
      id: 'St Mocianne Hard Quickmire',
      regex: /Quickmire/,
      beforeSeconds: 7, // This is approximately when the sewage surge begins.
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Be On A Platform',
        },
      },
    },
  ],
  triggers: [
    {
      // Trash mob gaze attack
      id: 'St Mocianne Hard Frond Fatale',
      netRegex: NetRegexes.startsUsing({ id: '31A4', source: 'Withered Belladonna' }),
      condition: (data) => data.CanSilence(),
      response: Responses.interrupt(),
    },
    {
      id: 'St Mocianne Hard Vine Whip',
      netRegex: NetRegexes.startsUsing({ id: '2E48', source: 'Nullchu' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'St Mocianne Hard Sludge Bomb',
      netRegex: NetRegexes.headMarker({ id: '0001' }),
      condition: Conditions.targetIsYou(),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Sludge puddle on YOU',
        },
      },
    },
    {
      id: 'St Mocianne Hard Fault Warren',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      suppressSeconds: 5,
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'St Mocianne Hard Taproot',
      netRegex: NetRegexes.headMarker({ id: '008D' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'St Mocianne Hard Devour',
      netRegex: NetRegexes.startsUsing({ id: '2E4F', source: 'Nullchu', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get behind flower',
        },
      },
    },
    {
      id: 'St Mocianne Hard Stone II',
      netRegex: NetRegexes.startsUsing({ id: '312A', source: 'Lakhamu' }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'St Mocianne Hard Tectonics',
      netRegex: NetRegexes.startsUsing({ id: '312C', source: 'Lakhamu', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'St Mocianne Hard Landslip',
      netRegex: NetRegexes.startsUsing({ id: '3132', source: 'Silt Golem' }),
      delaySeconds: (data, matches) => parseFloat(matches.duration) - 6,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Conveyors: Avoid Golem Lines',
        },
      },
    },
    {
      id: 'St Mocianne Hard Eath Shaker',
      netRegex: NetRegexes.headMarker({ id: '0028' }),
      condition: Conditions.targetIsYou(),
      response: Responses.earthshaker(),
    },
    {
      id: 'St Mocianne Empty Gaze',
      netRegex: NetRegexes.startsUsing({ id: '312B', source: 'Lakhamu' }),
      response: Responses.lookAwayFromSource(),
    },
    {
      id: 'St Mocianne Mudsling',
      netRegex: NetRegexes.startsUsing({ id: '3135', source: 'Tokkapchi' }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'St Mocianne Hard Quagmire',
      netRegex: NetRegexes.headMarker({ id: '008B' }),
      condition: Conditions.targetIsYou(),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Spread + Stay Off Platforms',
        },
      },
    },
    {
      id: 'St Mocianne Hard Mud Pie',
      netRegex: NetRegexes.startsUsing({ id: '3137', source: 'Tokkapchi', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Push Mud Pie On Platform',
        },
      },
    },
    {
      id: 'St Mocianne Hard Feculent Flood',
      netRegex: NetRegexes.startsUsing({ id: '313C', source: 'Tokkapchi', capture: false }),
      alarmText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Push Mud Pie Out Of Cone',
        },
      },
    },
  ],
};
