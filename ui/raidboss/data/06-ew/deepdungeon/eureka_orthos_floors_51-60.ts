import Conditions from '../../../../../resources/conditions';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// Eureka Orthos Floors 51-60

export interface Data extends RaidbossData {
  octupleSwipes?: number[];
  calledOctupleSwipes?: boolean;
}

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.EurekaOrthosFloors51_60,

  triggers: [
    // ---------------- Floor 51-59 Mobs ----------------
    {
      id: 'EO 51-60 Orthos Ice Sprite Hypothermal Combustion',
      type: 'StartsUsing',
      netRegex: { id: '7EF0', source: 'Orthos Ice Sprite', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'EO 51-60 Orthos Ymir Gelid Charge',
      // gains Ice Spikes (C6), lethal counterattack when hit
      type: 'StartsUsing',
      netRegex: { id: '819C', source: 'Orthos Ymir' },
      response: Responses.stunIfPossible(),
    },
    {
      id: 'EO 51-60 Orthos Ymir Ice Spikes Gain',
      // C6 = Ice Spikes, lethal counterattack damage when hit
      type: 'GainsEffect',
      netRegex: { effectId: 'C6', target: 'Orthos Ymir' },
      alertText: (_data, matches, output) => output.text!({ target: matches.target }),
      outputStrings: {
        text: {
          en: 'Stop attacking ${target}',
          de: 'Stoppe Angriffe auf ${target}',
          cn: '停止攻击 ${target}',
          ko: '${target} 공격 중지',
        },
      },
    },
    {
      id: 'EO 51-60 Orthos Rockfin Aqua Spear',
      type: 'StartsUsing',
      netRegex: { id: '7EF4', source: 'Orthos Rockfin' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Break Line-of-Sight',
        },
      },
    },
    {
      id: 'EO 51-60 Orthos Big Claw Crab Dribble',
      type: 'StartsUsing',
      netRegex: { id: '7EE5', source: 'Orthos Big Claw', capture: false },
      response: Responses.goFront(),
    },
    {
      id: 'EO 51-60 Orthos Zaratan Sewer Water',
      type: 'StartsUsing',
      netRegex: { id: '7EEB', source: 'Orthos Zaratan', capture: false },
      response: Responses.getBackThenFront(),
    },
    {
      id: 'EO 51-60 Orthos Stingray Expulsion',
      type: 'StartsUsing',
      netRegex: { id: '81A1', source: 'Orthos Stingray', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'EO 51-60 Orthos Stingray Electric Whorl',
      type: 'StartsUsing',
      netRegex: { id: '81A2', source: 'Orthos Stingray', capture: false },
      response: Responses.getUnder(),
    },
    // ---------------- Floor 60 Boss: Servomechanical Minotaur 16 ----------------
    {
      id: 'EO 51-60 Servomechanical Minotaur 16 Bullish Swipe',
      type: 'StartsUsing',
      netRegex: { id: '801B', source: 'Servomechanical Minotaur 16', capture: false },
      response: Responses.awayFromFront(),
    },
    {
      id: 'EO 51-60 Servomechanical Minotaur 16 Bullish Swing',
      type: 'StartsUsing',
      netRegex: { id: '7C83', source: 'Servomechanical Minotaur 16', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'EO 51-60 Servomechanical Minotaur 16 Disorienting Groan',
      type: 'StartsUsing',
      netRegex: { id: '7C84', source: 'Servomechanical Minotaur 16', capture: false },
      response: Responses.getUnder(),
    },
    {
      id: 'EO 51-60 Servomechanical Minotaur 16 Octuple Swipe Cleanup',
      type: 'StartsUsing',
      netRegex: { id: '7C80', source: 'Servomechanical Minotaur 16', capture: false },
      run: (data) => {
        delete data.octupleSwipes;
        delete data.calledOctupleSwipes;
      },
    },
    {
      id: 'EO 51-60 Servomechanical Minotaur 16 Octuple Swipe',
      type: 'StartsUsing',
      netRegex: { id: '7C7B', source: 'Servomechanical Minotaur 16' },
      condition: (data) => !data.calledOctupleSwipes,
      durationSeconds: 10,
      alertText: (data, matches, output) => {
        // convert the heading into 0=N, 1=E, 2=S, 3=W
        const heading = Math.round(2 - 2 * parseFloat(matches.heading) / Math.PI) % 4;

        data.octupleSwipes ??= [];
        data.octupleSwipes.push(heading);

        if (data.octupleSwipes.length <= 4)
          return;

        // TODO: remove debug output
        console.log(`Octuple Swipe headings: ${JSON.stringify(data.octupleSwipes)}`);

        data.calledOctupleSwipes = true;
        if (data.octupleSwipes[0] === 0 && data.octupleSwipes[4] === 0)
          return output.text!({
            dir1: output.west!(),
            dir2: output.north!(),
            dir3: output.west!(),
            dir4: output.north!(),
          });
        if (data.octupleSwipes[3] === 3 && data.octupleSwipes[4] === 3)
          return output.text!({
            dir1: output.west!(),
            dir2: output.north!(),
            dir3: output.north!(),
            dir4: output.west!(),
          });

        // something went wrong
        data.calledOctupleSwipes = false;
        return;
      },
      outputStrings: {
        north: Outputs.north,
        south: Outputs.south,
        east: Outputs.east,
        west: Outputs.west,

        text: {
          en: '${dir1} > ${dir2} > ${dir3} > ${dir4}',
          de: '${dir1} > ${dir2} > ${dir3} > ${dir4}',
          fr: '${dir1} > ${dir2} > ${dir3} > ${dir4}',
          ja: '${dir1} > ${dir2} > ${dir3} > ${dir4}',
          cn: '${dir1} > ${dir2} > ${dir3} > ${dir4}',
          ko: '${dir1} > ${dir2} > ${dir3} > ${dir4}',
        },
      },
    },
  ],
};

export default triggerSet;
