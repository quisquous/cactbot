import Conditions from '../../../../../resources/conditions';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// Eureka Orthos Floors 71-80
// TODO: Orthos Kargas Winds of Winter untelegraphed AoE, stun or LoS

export interface Data extends RaidbossData {
  charge?: boolean;
  droneCharges?: { [id: number]: boolean };
  pushPull?: boolean;
}

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.EurekaOrthosFloors71_80,

  triggers: [
    // ---------------- Floor 71-79 Mobs ----------------
    {
      id: 'EO 71-80 Orthos Toco Toco Slowcall',
      type: 'StartsUsing',
      netRegex: { id: '7F7B', source: 'Orthos Toco Toco', capture: false },
      response: Responses.awayFromFront(),
    },
    {
      id: 'EO 71-80 Orthos Primelephas Rear',
      type: 'StartsUsing',
      netRegex: { id: '81A8', source: 'Orthos Primelephas', capture: false },
      response: Responses.outOfMelee('alert'),
    },
    {
      id: 'EO 71-80 Orthos Coeurl Wide Blaster',
      type: 'StartsUsing',
      netRegex: { id: '81A6', source: 'Orthos Coeurl', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'EO 71-80 Orthos Coeurl Tail Swing',
      type: 'StartsUsing',
      netRegex: { id: '7F87', source: 'Orthos Coeurl', capture: false },
      response: Responses.goFrontOrSides(),
    },
    {
      id: 'EO 71-80 Orthos Thunderbeast Scythe Tail',
      type: 'StartsUsing',
      netRegex: { id: '7F90', source: 'Orthos Thunderbeast', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'EO 71-80 Orthos Thunderbeast Spark',
      type: 'StartsUsing',
      netRegex: { id: '7F94', source: 'Orthos Thunderbeast', capture: false },
      response: Responses.getIn(),
    },
    {
      id: 'EO 71-80 Orthos Gulo Gulo the Killing Paw',
      type: 'StartsUsing',
      netRegex: { id: '81A9', source: 'Orthos Gulo Gulo', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'EO 71-80 Orthos Sasquatch Ripe Banana',
      // after eating a banana, Sasquatch will do a fast, lethal, multi-roomwide AoE
      type: 'StartsUsing',
      netRegex: { id: '81AB', source: 'Orthos Sasquatch' },
      alertText: (_data, matches, output) => output.text!({ name: matches.source }),
      outputStrings: {
        text: {
          en: 'Beware of ${name}',
        },
      },
    },
    {
      id: 'EO 71-80 Orthos Sasquatch Chest Thump',
      // fast, lethal, multi-roomwide AoE; can break line-of-sight to avoid
      type: 'StartsUsing',
      netRegex: { id: '7FA8', source: 'Orthos Sasquatch' },
      alertText: (_data, matches, output) => output.text!({ name: matches.source }),
      outputStrings: {
        text: {
          en: 'Break line-of-sight to ${name}',
        },
      },
    },
    {
      id: 'EO 71-80 Orthos Skatene Chirp',
      // untelegraphed PBAoE sleep; follow-up lethal PBAoE
      type: 'StartsUsing',
      netRegex: { id: '7F7D', source: 'Orthos Skatene', capture: false },
      response: Responses.outOfMelee('alert'),
    },
    {
      id: 'EO 71-80 Orthos Flamebeast Blistering Roar',
      // lethal, large, wide line AoE that goes through walls
      type: 'StartsUsing',
      netRegex: { id: '7F7D', source: 'Orthos Flamebeast', capture: false },
      response: Responses.getBehind(),
    },
    // ---------------- Floor 80 Boss: Proto-Kaliya ----------------
    {
      id: 'EO 71-80 Proto-Kaliya Resonance',
      type: 'StartsUsing',
      netRegex: { id: '7ABE', source: 'Proto-Kaliya' },
      response: Responses.tankCleave('alert'),
    },
    {
      id: 'EO 71-80 Proto-Kaliya Centralized Nerve Gas',
      type: 'StartsUsing',
      netRegex: { id: '7ABF', source: 'Proto-Kaliya', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'EO 71-80 Proto-Kaliya Leftward Nerve Gas',
      type: 'StartsUsing',
      netRegex: { id: '7AC0', source: 'Proto-Kaliya', capture: false },
      response: Responses.goRight(),
    },
    {
      id: 'EO 71-80 Proto-Kaliya Rightward Nerve Gas',
      type: 'StartsUsing',
      netRegex: { id: '7AC1', source: 'Proto-Kaliya', capture: false },
      response: Responses.goLeft(),
    },
    {
      id: 'EO 71-80 Proto-Kaliya Nerve Gas Ring Cleanup',
      type: 'StartsUsing',
      netRegex: { id: '7AC5', source: 'Proto-Kaliya', capture: false },
      run: (data) => {
        delete data.charge;
        delete data.droneCharges;
        delete data.pushPull;
      },
    },
    {
      id: 'EO 71-80 Proto-Kaliya Nanospore Jet Player Charge',
      // D5A = Positive Charge
      // D5B - Negative Charge
      type: 'GainsEffect',
      netRegex: { effectId: 'D5[AB]' },
      condition: Conditions.targetIsYou(),
      run: (data, matches) => {
        data.charge = matches.effectId.toUpperCase() === 'D5A';
      },
    },
    {
      id: 'EO 71-80 Proto-Kaliya Nanospore Jet Drone Charges',
      // D58 = Positive Charge
      // D59 - Negative Charge
      type: 'GainsEffect',
      netRegex: { effectId: 'D5[89]' },
      run: (data, matches) => {
        data.droneCharges ??= {};
        data.droneCharges[parseInt(matches.targetId, 16)] =
          matches.effectId.toUpperCase() === 'D58';
      },
    },
    {
      id: 'EO 71-80 Proto-Kaliya Nanospore Jet Tether',
      type: 'Tether',
      netRegex: { id: '0026', source: 'Weapons Drone' },
      condition: Conditions.targetIsYou(),
      run: (data, matches) => {
        if (!data.droneCharges) {
          console.error(`Proto-Kaliya Nanospore Jet: missing drone charges`);
          return;
        }

        data.pushPull = data.charge === data.droneCharges[parseInt(matches.sourceId, 16)];
      },
    },
    {
      id: 'EO 71-80 Proto-Kaliya Nerve Gas Ring',
      type: 'StartsUsing',
      netRegex: { id: '7AC2', source: 'Proto-Kaliya', capture: false },
      alertText: (data, _matches, output) => {
        if (data.pushPull)
          return output.push!();
        return output.pull!();
      },
      outputStrings: {
        push: {
          en: 'Get pushed into safe spot',
        },
        pull: {
          en: 'Get pulled into safe spot',
        },
      },
    },
  ],
};

export default triggerSet;
