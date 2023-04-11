import Conditions from '../../../../../resources/conditions';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// Eureka Orthos Floors 71-80

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
      netRegex: { id: '81AF', source: 'Orthos Flamebeast', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'EO 71-80 Bird of Orthos Eye of the Fierce',
      // gaze, inflicts Confused (0B) if hit; follows up with lethal AoE on Confused target
      type: 'StartsUsing',
      netRegex: { id: '7F9B', source: 'Bird of Orthos', capture: false },
      response: Responses.lookAway('alert'),
    },
    {
      id: 'EO 71-80 Bird of Orthos Revelation',
      // lethal AoE, cast on any targets Confused by Eye of the Fierce
      type: 'StartsUsing',
      netRegex: { id: '7F9A', source: 'Bird of Orthos' },
      response: Responses.awayFrom(),
    },
    {
      id: 'EO 71-80 Orthos Kargas Winds of Winter',
      // lethal large AoE; can stun or break line-of-sight to avoid
      type: 'StartsUsing',
      netRegex: { id: '81AA', source: 'Orthos Kargas' },
      alertText: (data, matches, output) => {
        if (data.CanStun())
          return output.stunOrBreakLOS!({ name: matches.source });
        return output.breakLOS!({ name: matches.source });
      },
      outputStrings: {
        stunOrBreakLOS: {
          en: 'Stun or Break line-of-sight to ${name}',
        },
        breakLOS: {
          en: 'Break line-of-sight to ${name}',
          de: 'Unterbreche Sichtlinie zu ${name}',
          ko: '${name}의 시야 밖으로 숨기',
        },
      },
    },
    // ---------------- Floor 80 Boss: Proto-Kaliya ----------------
    {
      id: 'EO 71-80 Proto-Kaliya Resonance',
      type: 'StartsUsing',
      netRegex: { id: '7ABE', source: 'Proto-Kaliya' },
      response: Responses.tankCleave(),
    },
    {
      id: 'EO 71-80 Proto-Kaliya Centralized Nerve Gas',
      type: 'StartsUsing',
      netRegex: { id: '7ABF', source: 'Proto-Kaliya', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'EO 71-80 Proto-Kaliya Leftward Nerve Gas',
      // 180° cleave from front-left to back-right
      type: 'StartsUsing',
      netRegex: { id: '7AC0', source: 'Proto-Kaliya', capture: false },
      response: Responses.goRight(),
    },
    {
      id: 'EO 71-80 Proto-Kaliya Rightward Nerve Gas',
      // 180° cleave from front-right to back-left
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
      id: 'EO 71-80 Proto-Kaliya Nanospore Jet Player Charge Collect',
      // D5A = Positive Charge
      // D5B = Negative Charge
      type: 'GainsEffect',
      netRegex: { effectId: 'D5[AB]' },
      condition: Conditions.targetIsYou(),
      run: (data, matches) => {
        data.charge = matches.effectId.toUpperCase() === 'D5A';
      },
    },
    {
      id: 'EO 71-80 Proto-Kaliya Nanospore Jet Drone Charge Collect',
      // D58 = Positive Charge
      // D59 = Negative Charge
      type: 'GainsEffect',
      netRegex: { effectId: 'D5[89]', target: 'Weapons Drone' },
      run: (data, matches) => {
        data.droneCharges ??= {};
        data.droneCharges[parseInt(matches.targetId, 16)] =
          matches.effectId.toUpperCase() === 'D58';
      },
    },
    {
      id: 'EO 71-80 Proto-Kaliya Nanospore Jet Tether Collect',
      type: 'Tether',
      netRegex: { id: '0026', source: 'Weapons Drone' },
      condition: Conditions.targetIsYou(),
      run: (data, matches) => {
        if (data.charge === undefined) {
          console.error(`Proto-Kaliya Nanospore Jet: missing player charge`);
          return;
        }

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
        if (data.pushPull === undefined) {
          console.error(`Proto-Kaliya Nerve Gas Ring: missing pushPull`);
          return;
        }

        if (data.pushPull)
          return output.push!();
        return output.pull!();
      },
      outputStrings: {
        push: {
          en: 'Get pushed into safe spot',
          de: 'Rückstoß in den sicheren Bereich',
          ko: '안전지대로 밀려나기',
        },
        pull: {
          en: 'Get pulled into safe spot',
          de: 'Werde in den sicheren Bereich gezogen',
          ko: '안전지대로 당겨지기',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'missingTranslations': true,
      'replaceSync': {
        'Bird of Orthos': 'Orthos-Vogel',
        'Orthos Coeurl': 'Orthos-Coeurl',
        'Orthos Flamebeast': 'Orthos-Flammenbestie',
        'Orthos Gulo Gulo': 'Orthos-Gulo Gulo',
        'Orthos Primelephas': 'Orthos-Primelephas',
        'Orthos Skatene': 'Orthos-Skatene',
        'Orthos Thunderbeast': 'Orthos-Donnerbestie',
        'Orthos Toco Toco': 'Orthos-Tokotoko',
        'Proto-Kaliya': 'Proto-Kaliya',
        'Weapons Drone': 'Artilleriedrohne',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Bird of Orthos': 'oiseau d\'Eurêka Orthos',
        'Orthos Coeurl': 'coeurl Orthos',
        'Orthos Flamebeast': 'bête de feu Orthos',
        'Orthos Gulo Gulo': 'gulo gulo Orthos',
        'Orthos Primelephas': 'primelephas Orthos',
        'Orthos Skatene': 'skate\'ne Orthos',
        'Orthos Thunderbeast': 'bête de foudre Orthos',
        'Orthos Toco Toco': 'toco toco Orthos',
        'Proto-Kaliya': 'proto-Kaliya',
        'Weapons Drone': 'drone armé',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Bird of Orthos': 'バード・オブ・オルト',
        'Orthos Coeurl': 'オルト・クァール',
        'Orthos Flamebeast': 'オルト・フレイムビースト',
        'Orthos Gulo Gulo': 'オルト・グログロ',
        'Orthos Primelephas': 'オルト・プリメレファス',
        'Orthos Skatene': 'オルト・スカネテ',
        'Orthos Thunderbeast': 'オルト・サンダービースト',
        'Orthos Toco Toco': 'オルト・トコトコ',
        'Proto-Kaliya': 'プロトカーリア',
        'Weapons Drone': '砲撃ドローン',
      },
    },
  ],
};

export default triggerSet;
