import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';

export default {
  zoneId: ZoneId.Paglthan,
  timelineFile: 'paglthan.txt',
  timelineTriggers: [
    {
      // This is a rear cone attack that always follows Wide Blaster.
      // It has a cast time of under a GCD, so we pre-warn during Wide Blaster.
      // Only the sides are safe to call at this moment.
      id: 'Paglthan Spike Flail',
      regex: /Spike Flail/,
      beforeSeconds: 4,
      response: Responses.goSides(),
    },
  ],
  triggers: [
    {
      id: 'Paglthan Critical Rip',
      netRegex: NetRegexes.startsUsing({ id: '5C4E', source: 'Amhuluk' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'Paglthan Electric Burst',
      netRegex: NetRegexes.startsUsing({ id: '5C4D', source: 'Amhuluk', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Paglthan Lightning Rod Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: 'A0E' }),
      condition: Conditions.targetIsYou(),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Go to a lightning rod',
          fr: 'Allez sur un paratonnerre',
        },
      },
    },
    {
      id: 'Paglthan Lightning Rod Lose',
      netRegex: NetRegexes.losesEffect({ effectId: 'A0E' }),
      condition: Conditions.targetIsYou(),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Away from lightning circles',
          fr: 'Éloignez-vous des cercles de foudre',
        },
      },
    },
    {
      id: 'Paglthan Ballistic',
      netRegex: NetRegexes.startsUsing({ id: '5C97', source: 'Magitek Fortress', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'Paglthan Defensive Reaction',
      netRegex: NetRegexes.startsUsing({ id: '5C9E', source: 'Magitek Core', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Paglthan Twisted Scream',
      netRegex: NetRegexes.startsUsing({ id: '5B47', source: 'Lunar Bahamut', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Paglthan Akh Morn',
      netRegex: NetRegexes.headMarker({ id: '005D' }),
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Paglthan Mega Flare',
      netRegex: NetRegexes.headMarker({ id: '0017' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Paglthan Kan Rhai',
      netRegex: NetRegexes.headMarker({ id: '0104' }),
      condition: Conditions.targetIsYou(),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Kan Rhai on YOU',
          fr: 'Kan Rhai sur VOUS',
        },
      },
    },
    {
      id: 'Paglthan Flatten',
      netRegex: NetRegexes.startsUsing({ id: '5B58', source: 'Lunar Bahamut' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'Paglthan Giga Flare',
      netRegex: NetRegexes.startsUsing({ id: '5B57', source: 'Lunar Bahamut', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
  ],
};
