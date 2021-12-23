import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.AsphodelosTheFourthCircle,
  triggers: [
    {
      id: 'P4N Elegant Evisceration',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A50', source: 'Hesperos' }),
      response: Responses.tankCleave('alert'),
    },
    // Strong proximity Aoe
    {
      id: 'P4N Levinstrike Pinax',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A3F', source: 'Hesperos', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Go to Corner',
        },
      },
    },
    {
      id: 'P4N Well Pinax',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A3E', source: 'Hesperos', capture: false }),
      delaySeconds: 4,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Middle Knockback',
        },
      },
    },
    {
      id: 'P4N Acid Pinax',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A3C', source: 'Hesperos', capture: false }),
      response: Responses.spread(),
    },
    {
      id: 'P4N Lava Pinax',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A3D', source: 'Hesperos', capture: false }),
      response: Responses.stackMarker(),
    },
    {
      id: 'P4N Decollation',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A51', source: 'Hesperos', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'P4N Bloodrake',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A40', source: 'Hesperos', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'P4N Hell Skewer',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A4F', source: 'Hesperos', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      id: 'P4N Belone Coils',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '69DD', source: 'Hesperos', capture: false }),
      delaySeconds: 2,
      alarmText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get Other Role Tower',
        },
      },
    },
    {
      id: 'P4N Northerly Shift Slash',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A4A', source: 'Hesperos', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Go North Edge',
        },
      },
    },
    {
      id: 'P4N Easterly Shift Slash',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A4C', source: 'Hesperos', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Go East Edge',
        },
      },
    },
    {
      id: 'P4N Southerly Shift Slash',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A4B', source: 'Hesperos', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Go South Edge',
        },
      },
    },
    {
      id: 'P4N Westerly Shift Slash',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A4D', source: 'Hesperos', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Go West Edge',
        },
      },
    },
    {
      id: 'P4N Northerly Shift Knockback',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6DAE', source: 'Hesperos', capture: false }),
      delaySeconds: 4,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'North Knockback',
        },
      },
    },
    {
      id: 'P4N Easterly Shift Knockback',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6DB0', source: 'Hesperos', capture: false }),
      delaySeconds: 4,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'East Knockback',
        },
      },
    },
    {
      id: 'P4N Southerly Shift Knockback',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6DAF', source: 'Hesperos', capture: false }),
      delaySeconds: 4,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'South Knockback',
        },
      },
    },
    {
      id: 'P4N Westerly Shift Knockback',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6DB1', source: 'Hesperos', capture: false }),
      delaySeconds: 4,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'West Knockback',
        },
      },
    },
    {
      id: 'P4N Belone Bursts',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '69D9', source: 'Hesperos', capture: false }),
      alarmText: (data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Pop other role orbs',
        },
      },
    },
  ],
};

export default triggerSet;
