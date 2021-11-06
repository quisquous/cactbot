import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  sullenDebuff?: boolean;
  irefulDebuff?: boolean;
}

// TODO:
//  Angra Mainyu
//    Add Level 100 Flare
//    Add Level 150 Doom
//    Add Roulette?
//    Add info text for add spawns?
//  Five-Headed Dragon
//  Howling Atomos
//  Cerberus
//  Cloud of Darkness

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheWorldOfDarkness,
  triggers: [
    {
      id: 'Angra Mainyu Gain Sullen',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '27c' }),
      condition: Conditions.targetIsYou(),
      run: (data) => data.sullenDebuff = true,
    },
    {
      id: 'Angra Mainyu Lose Sullen',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: '27c' }),
      condition: Conditions.targetIsYou(),
      run: (data) => data.sullenDebuff = false,
    },
    {
      id: 'Angra Mainyu Gain Ireful',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '27d' }),
      condition: Conditions.targetIsYou(),
      run: (data) => data.irefulDebuff = true,
    },
    {
      id: 'Angra Mainyu Lose Ireful',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: '27d' }),
      condition: Conditions.targetIsYou(),
      run: (data) => data.irefulDebuff = false,
    },
    {
      id: 'Angra Mainyu Double Vision',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: 'CC8', source: 'Angra Mainyu', capture: false }),
      alertText: (data, _matches, output) => {
        if (data.sullenDebuff) {
          // Stand behind boss in the red half to switch to Ireful
          return output.red!();
        } else if (data.irefulDebuff) {
          // Stand in front of boss in the white half to switch to Sullen
          return output.white!();
        }
      },
      outputStrings: {
        red: {
          en: 'Get Behind (Red)',
        },
        white: {
          en: 'Get in Front (White)',
        },
      },
    },
    {
      id: 'Angra Mainyu Mortal Gaze',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['CD1', 'DAB'], source: 'Angra Mainyu', capture: false }),
      suppressSeconds: 0.1,
      response: Responses.lookAway('alert'),
    },
    {
      id: 'Angra Mainyu Gain Doom',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: 'd2' }),
      condition: Conditions.targetIsYou(),
      alarmText: (_data, _matches, output) => output.cleanse!(),
      outputStrings: {
        cleanse: {
          en: 'Run to Cleanse Circle',
        },
      },
    },
  ],
};

export default triggerSet;
