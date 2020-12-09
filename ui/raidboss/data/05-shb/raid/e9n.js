import Conditions from '../../../../../resources/conditions.js';
import NetRegexes from '../../../../../resources/netregexes.js';
import { Responses } from '../../../../../resources/responses.js';
import ZoneId from '../../../../../resources/zone_id.js';

export default {
  zoneId: ZoneId.EdensPromiseUmbra,
  timelineFile: 'e9n.txt',
  triggers: [
    {
      id: 'E9N Ground-Razing Particle Beam',
      netRegex: NetRegexes.startsUsing({ id: '55ED', source: 'Cloud Of Darkness', capture: false }),
      condition: Conditions.caresAboutAOE(),
      durationSeconds: 5,
      response: Responses.aoe(),
    },
    {
      id: 'E9N The Art Of Darkness Right',
      netRegex: NetRegexes.startsUsing({ id: '5223', source: 'Cloud Of Darkness', capture: false }),
      durationSeconds: 4,
      response: Responses.goLeft(),
    },
    {
      id: 'E9N The Art Of Darkness Left',
      netRegex: NetRegexes.startsUsing({ id: '5224', source: 'Cloud Of Darkness', capture: false }),
      durationSeconds: 4,
      response: Responses.goRight(),
    },
    {
      id: 'E9N Wide-Angle Particle Beam',
      netRegex: NetRegexes.startsUsing({ id: '5AFF', source: 'Cloud Of Darkness', capture: false }),
      response: Responses.awayFromFront('info'),
    },
    {
      id: 'E9N Zero-Form Particle Beam',
      netRegex: NetRegexes.startsUsing({ id: '55EB', source: 'Cloud Of Darkness' }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'E9N Empty Plane',
      netRegex: NetRegexes.startsUsing({ id: '4FC6', source: 'Cloud Of Darkness', capture: false }),
      condition: Conditions.caresAboutAOE(),
      durationSeconds: 5,
      response: Responses.aoe(),
    },
    {
      id: 'E9N Obscure Woods',
      netRegex: NetRegexes.startsUsing({ id: '4FA2', source: 'Cloud Of Darkness', capture: false }),
      condition: Conditions.caresAboutAOE(),
      durationSeconds: 5,
      response: Responses.aoe(),
    },
    {
      id: 'E9N Waste Away',
      netRegex: NetRegexes.startsUsing({ id: '55DE', source: 'Cloud Of Darkness', capture: false }),
      response: Responses.knockback('info'),
    },
    {
      id: 'E9N Stygian Tether',
      netRegex: NetRegexes.headMarker({ id: '000C' }),
      condition: Conditions.targetIsYou(),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Wait Near Bramble',
        },
      },
    },
    {
      id: 'E9N Stygian Break Tether',
      netRegex: NetRegexes.headMarker({ id: '000C' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: 3,
      response: Responses.breakChains(),
    },
    {
      id: 'E9N Wide-Angle Phaser',
      netRegex: NetRegexes.startsUsing({ id: ['55DF', '55E[01]'], source: 'Cloud Of Darkness', capture: false }),
      durationSeconds: 5,
      suppressSeconds: 1,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Go Sides At Tethered Wall',
        },
      },
    },
    {
      id: 'E9N Rejuvenating Balm',
      netRegex: NetRegexes.startsUsing({ id: '55E2', source: 'Cloud Of Darkness', capture: false }),
      durationSeconds: 5,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Away From Tethered Walls',
        },
      },
    },
    {
      id: 'E9N Deluge Of Darkness',
      netRegex: NetRegexes.startsUsing({ id: '5155', source: 'Cloud Of Darkness', capture: false }),
      condition: Conditions.caresAboutAOE(),
      durationSeconds: 5,
      response: Responses.aoe(),
    },
    {
      id: 'E9N Particle Concentration',
      netRegex: NetRegexes.startsUsing({ id: '55E8', source: 'Cloud Of Darkness', capture: false }),
      delaySeconds: 4,
      durationSeconds: 4,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get Towers',
          de: 'Türme nehmen',
          fr: 'Allez dans les tours',
          ja: '塔を踏む',
          cn: '踩塔',
          ko: '장판 들어가기',
        },
      },
    },
    {
      id: 'E9N Hypercharged Condensation',
      netRegex: NetRegexes.startsUsing({ id: '532E', source: 'Cloud Of Darkness', capture: false }),
      delaySeconds: 2,
      durationSeconds: 5,
      response: Responses.killAdds(),
    },
    {
      id: 'E9N Anti-Air Particle Beam',
      netRegex: NetRegexes.startsUsing({ id: '55DC', source: 'Cloud Of Darkness', capture: false }),
      response: Responses.getOut('info'),
    },
  ],
  timelineReplace: [],
};
