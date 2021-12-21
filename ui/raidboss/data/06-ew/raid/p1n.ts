import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.AsphodelosTheFirstCircle,
  timelineFile: 'p1n.txt',
  triggers: [
    {
      id: 'P1N Gaoler\'s Flail Right',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6DA2', source: 'Erichthonios', capture: false }),
      response: Responses.goLeft(),
    },
    {
      id: 'P1N Gaoler\'s Flail Left',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6DA3', source: 'Erichthonios', capture: false }),
      response: Responses.goRight(),
    },
    /* Aetherflail sends startsUsing Gaoler's Flail as well so don't double tell
    {
      id: 'P1N Aetherflail Right',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '65DF', source: 'Erichthonios', capture: false }),
      response: Responses.goLeft(),
    },
    {
      id: 'P1N Aetherflail Left',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '65E0', source: 'Erichthonios', capture: false }),
      response: Responses.goRight(),
    },
    */
    {
      id: 'P1N Warder\'s Wrath',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '65F4', source: 'Erichthonios', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'P1N Shining Cells',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '65E9', source: 'Erichthonios', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'P1N Slam Shut',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '65EA', source: 'Erichthonios', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'P1N Pitiless Flail KB',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0001' }),
      condition: Conditions.targetIsYou(),
      response: Responses.knockback(),
    },
    {
      id: 'P1N Pitiless Flail Stack',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '003E', capture: false }),
      response: Responses.stackMarker(),
    },
    {
      id: 'P1N Intemperance',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['AB3', 'AB4'], capture: true }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, _output) => {
        return _matches.effectId === 'AB3' ? _output.red!() : _output.blue!();
      },
      outputStrings: {
        red: {
          en: 'Get hit by red',
        },
        blue: {
          en: 'Get hit by blue',
        },
      },
    },
    {
      id: 'P1N Heavy Hand',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '65F3', source: 'Erichthonios' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'P1N Powerful Light',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '893', capture: true }),
      alertText: (_data, matches, _output) => {
        if (matches.count === '14C')
          return _output.light!();
        return _output.fire!();
      },
      outputStrings: {
        fire: {
          en: 'Stand on fire',
        },
        light: {
          en: 'Stand on light',
        },
      },
    },
  ],
};

export default triggerSet;
