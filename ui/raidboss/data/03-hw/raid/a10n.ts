import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.AlexanderTheBreathOfTheCreator,
  timelineFile: 'a10n.txt',
  timelineTriggers: [
    {
      id: 'A10N Goblin Rush',
      regex: /Goblin Rush/,
      beforeSeconds: 5,
      suppressSeconds: 5, // Ensure syncs don't multi-call
      response: Responses.miniBuster(),
    },
    {
      id: 'A10N Gobsway Rumblerocks',
      regex: /Gobsway Rumblerocks/,
      beforeSeconds: 4,
      suppressSeconds: 4,
      response: Responses.aoe(),
    },
    {
      id: 'A10N Laceration',
      regex: /Laceration/,
      beforeSeconds: 5,
      suppressSeconds: 10,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Avoid side saws',
        },
      },
    },
  ],
  triggers: [
    // There doesn't seem to be any indication in the logs if a player activates a trap.
    {
      id: 'A10N Frost Laser Trap',
      type: 'Ability',
      netRegex: NetRegexes.ability({ source: 'Lamebrix Strikebocks', id: '1AB1', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Frost Lasers',
          de: 'Eislaser',
          fr: 'Lasers de glace',
          ja: '罠: 氷',
          cn: '冰晶陷阱',
          ko: '얼음화살 함정',
        },
      },
    },
    {
      id: 'A10N Ceiling Weight Trap',
      type: 'Ability',
      netRegex: NetRegexes.ability({ source: 'Lamebrix Strikebocks', id: '1AB0', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Ceiling Weight',
          de: 'Gewichte von der Decke',
          fr: 'Poids du plafond',
          ja: '罠: 鉄球',
          cn: '铁球陷阱',
          ko: '철퇴 함정',
        },
      },
    },
    {
      id: 'A10N Single Charge In',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '1AB8', source: 'Lamebrix Strikebocks', capture: false }),
      response: Responses.getIn(),
    },
    {
      id: 'A10N Single Charge Out',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '1AB9', source: 'Lamebrix Strikebocks', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'A10N Gobrush Rushgob',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Lamebrix Strikebocks', id: '1ACF' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'A10N Critical Wrath',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0019' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'A10N Bomb Toss',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'A10N Gobslash Slicetops',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0017' }),
      alertText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.target!();
        return output.avoid!();
      },
      outputStrings: {
        target: {
          en: 'Get away--Laser on YOU',
        },
        avoid: {
          en: 'Avoid Prey Laser',
        },
      },
    },
  ],
};

export default triggerSet;
