import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  earthResistDown: { [name: string]: boolean };
  windResistDown: { [name: string]: boolean };
}

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheLostCityOfAmdaporHard,
  timelineFile: 'the_lost_city_of_amdapor_hard.txt',
  // Temporarily out of combat during Kuribu phases.  @_@;;
  resetWhenOutOfCombat: false,
  initData: () => {
    return {
      earthResistDown: {},
      windResistDown: {},
    };
  },
  triggers: [
    {
      id: 'LostCityHard Gremlin Bad-Mouth',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '775', source: 'Ranting Ranks Gremlin' }),
      condition: Conditions.targetIsNotYou(),
      infoText: (data, matches, output) => output.comfort!({ name: data.ShortName(matches.target) }),
      outputStrings: {
        comfort: {
          en: '/comfort ${name}',
        },
      },
    },
    {
      id: 'LostCityHard Achamoth Neuro Squama',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '15C5', source: 'Achamoth', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Go to edge; look outside',
        },
      },
    },
    {
      id: 'LostCityHard Achamoth Toxic Squama',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0001' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Away from orb',
        },
      },
    },
    {
      id: 'LostCityHard Void Monk Water III',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '16C7', source: 'Void Monk' }),
      response: Responses.stunOrInterruptIfPossible(),
    },
    {
      id: 'LostCityHard Void Monk Sucker',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '16C5', source: 'Void Monk', capture: false }),
      response: Responses.drawIn(),
    },
    {
      id: 'LostCityHard Void Monk Flood',
      type: 'Ability',
      // This is an instant cast followup to Sucker.
      netRegex: NetRegexes.ability({ id: '16C5', source: 'Void Monk', capture: false }),
      response: Responses.getOut('info'),
    },
    {
      id: 'LostCityHard Winged Lion Wind Resist Down II Gain',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '41C' }),
      infoText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.text!();
      },
      run: (data, matches) => data.windResistDown[matches.target] = true,
      outputStrings: {
        text: {
          en: 'Avoid Aero',
        },
      },
    },
    {
      id: 'LostCityHard Winged Lion Wind Resist Down II Lose',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: '41C' }),
      run: (data, matches) => data.windResistDown[matches.target] = false,
    },
    {
      id: 'LostCityHard Winged Lion Earth Resist Down II Gain',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '41D' }),
      infoText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.text!();
      },
      run: (data, matches) => data.earthResistDown[matches.target] = true,
      outputStrings: {
        text: {
          en: 'Avoid Stone',
        },
      },
    },
    {
      id: 'LostCityHard Winged Lion Earth Resist Down II Lose',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: '41D' }),
      run: (data, matches) => data.earthResistDown[matches.target] = false,
    },
    {
      id: 'LostCityHard Winged Lion Ancient Stone',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '15D2', source: 'Winged Lion', capture: false }),
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          pop: {
            en: 'Pop stone orb',
          },
          avoid: {
            en: 'Avoid stone orb',
          },
        };

        if (data.earthResistDown[data.me])
          return { infoText: output.avoid!() };
        return { alertText: output.pop!() };
      },
    },
    {
      id: 'LostCityHard Winged Lion Ancient Aero',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '15CE', source: 'Winged Lion', capture: false }),
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          pop: {
            en: 'Pop aero orb',
          },
          avoid: {
            en: 'Avoid aero orb',
          },
        };

        if (data.windResistDown[data.me])
          return { infoText: output.avoid!() };
        return { alertText: output.pop!() };
      },
    },
    {
      id: 'LostCityHard Winged Lion Ancient Holy',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '15CA', source: 'Winged Lion', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Pop holy orb',
        },
      },
    },
    {
      id: 'LostCityHard Light Sprite Banish 3',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '680', source: 'Light Sprite' }),
      response: Responses.stunOrInterruptIfPossible(),
    },
    {
      id: 'LostCityHard Kuribu Regen',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '15DC', source: 'Kuribu', capture: false }),
      condition: (data) => data.role === 'tank',
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Move boss out of puddle',
        },
      },
    },
    {
      id: 'LostCityHard Kuribu Cure IV',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '15DF', source: 'Kuribu', capture: false }),
      condition: (data) => data.role === 'tank',
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Stand in Circle',
        },
      },
    },
    {
      id: 'LostCityHard Kuribu Cure III',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '004A' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
  ],
};

export default triggerSet;
