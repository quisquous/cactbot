import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { NetMatches } from '../../../../../types/net_matches';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: 006[B-F] are probably fledgling headmarkers

export interface Data extends RaidbossData {
  decOffset?: number;
}

// Due to changes introduced in patch 5.2, overhead markers now have a random offset
// added to their ID. This offset currently appears to be set per instance, so
// we can determine what it is from the first overhead marker we see.
// The first 1B marker in the encounter is the #1 Bright Fire marker (004F).
const firstHeadmarker = parseInt('004F', 16);
const getHeadmarkerId = (data: Data, matches: NetMatches['HeadMarker']) => {
  // If we naively just check !data.decOffset and leave it, it breaks if the first marker is 00DA.
  // (This makes the offset 0, and !0 is true.)
  if (typeof data.decOffset === 'undefined')
    data.decOffset = parseInt(matches.id, 16) - firstHeadmarker;
  // The leading zeroes are stripped when converting back to string, so we re-add them here.
  // Fortunately, we don't have to worry about whether or not this is robust,
  // since we know all the IDs that will be present in the encounter.
  return (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase().padStart(4, '0');
};

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.AsphodelosTheThirdCircleSavage,
  timelineFile: 'p3s.txt',
  triggers: [
    {
      id: 'P3S Headmarker Tracker',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({}),
      condition: (data) => data.decOffset === undefined,
      // Unconditionally set the first headmarker here so that future triggers are conditional.
      run: (data, matches) => getHeadmarkerId(data, matches),
    },
    {
      id: 'P3S Scorched Exaltation',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6706', source: 'Phoinix', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'P3S Darkened Fire',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '66B9', source: 'Phoinix', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Fire Positions',
          fr: 'Positions feu',
        },
      },
    },
    {
      id: 'P3S Heat of Condemnation',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6700', source: 'Phoinix', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Tank Tethers',
          fr: 'Liens Tank',
        },
      },
    },
    {
      id: 'P3S Experimental Fireplume Rotating Cast',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '66C0', source: 'Phoinix', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get Middle (then rotate)',
          fr: 'Soyez au centre (puis tourner)',
        },
      },
    },
    {
      id: 'P3S Experimental Fireplume Out Cast',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '66BE', source: 'Phoinix', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get Middle (then out)',
          fr: 'Soyez au centre (puis sortez)',
        },
      },
    },
    {
      id: 'P3S Experimental Fireplume Out Marker',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '66BE', source: 'Phoinix', capture: false }),
      // goldfish brain needs an extra "get out" call
      response: Responses.getOut(),
    },
    {
      id: 'P3S Right Cinderwing',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6702', source: 'Phoinix', capture: false }),
      response: Responses.goLeft(),
    },
    {
      id: 'P3S Left Cinderwing',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6703', source: 'Phoinix', capture: false }),
      response: Responses.goRight(),
    },
    {
      id: 'P3S Flare of Condemnation',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '66FB', source: 'Phoinix', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Sides + Spread',
          fr: 'Côtés + Dispersez-vous',
        },
      },
    },
    {
      id: 'P3S Spark of Condemnation',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '66FC', source: 'Phoinix', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Middle Pairs',
          fr: 'Paires au centre',
        },
      },
    },
    {
      id: 'P3S Bright Fire Marker',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({}),
      condition: Conditions.targetIsYou(),
      alertText: (data, matches, output) => {
        const id = getHeadmarkerId(data, matches);
        return {
          '004F': output.num1!(),
          '0050': output.num2!(),
          '0051': output.num3!(),
          '0052': output.num4!(),
          '0053': output.num5!(),
          '0054': output.num6!(),
          '0055': output.num7!(),
          '0056': output.num8!(),
        }[id];
      },
      outputStrings: {
        num1: Outputs.num1,
        num2: Outputs.num2,
        num3: Outputs.num3,
        num4: Outputs.num4,
        num5: Outputs.num5,
        num6: Outputs.num6,
        num7: Outputs.num7,
        num8: Outputs.num8,
      },
    },
    {
      id: 'P3S Dead Rebirth',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '66E4', source: 'Phoinix', capture: false }),
      response: Responses.bigAoe(),
    },
    {
      id: 'P3S Experimental Gloryplume Rotate Cast',
      type: 'StartsUsing',
      // 66CA (self) -> 66CB (rotating) -> etc
      netRegex: NetRegexes.startsUsing({ id: '66CA', source: 'Phoinix', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get Middle (then rotate)',
          fr: 'Soyez au centre (puis tourner)',
        },
      },
    },
    {
      id: 'P3S Experimental Gloryplume Out Cast',
      type: 'StartsUsing',
      // 66C6 (self) -> 66C7 (middle) -> etc
      netRegex: NetRegexes.startsUsing({ id: '66C6', source: 'Phoinix', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get Middle (then out)',
          fr: 'Soyez au centre (puis sortez)',
        },
      },
    },
    {
      id: 'P3S Experimental Gloryplume Out',
      type: 'Ability',
      // 66C6 (self) -> 66C7 (middle) -> etc
      netRegex: NetRegexes.ability({ id: '66C6', source: 'Phoinix', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'P3S Experimental Gloryplume Stack',
      type: 'Ability',
      // 66CA (self) -> 66CB (rotating) -> 66CC (instant) -> 66CD (stacks)
      // 66C6 (self) -> 66C7 (middle) -> 66CC (instant) -> 66CD (stacks)
      netRegex: NetRegexes.ability({ id: '66CC', source: 'Phoinix', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Stacks After',
          fr: 'Packez-vous après',
        },
      },
    },
    {
      id: 'P3S Experimental Gloryplume Spread',
      type: 'Ability',
      // 66CA (self) -> 66CB (rotating) -> 66C8 (instant) -> 66C9 (spread)
      // 66C6 (self) -> 66C7 (middle) -> 66C8 (instant) -> 66C9 (spread)
      netRegex: NetRegexes.ability({ id: '66C8', source: 'Phoinix', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Spread After',
          fr: 'Dispersez-vous après',
        },
      },
    },
    {
      id: 'P3S Sun\'s Pinion',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({}),
      condition: (data, matches) => data.me === matches.target && getHeadmarkerId(data, matches) === '007A',
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Spread => Bird Tether',
          fr: 'Dispersez-vous => Liens oiseaux',
        },
      },
    },
    {
      id: 'P3S Firestorms of Asphodelos',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '66F0', source: 'Phoinix', capture: false }),
      response: Responses.bigAoe(),
    },
    {
      id: 'P3S Experimental Ashplume Stacks',
      type: 'Ability',
      // 66C2 cast -> 66C3 stacks damage
      netRegex: NetRegexes.ability({ id: '66C2', source: 'Phoinix', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Stacks',
          fr: 'Packez-vous',
        },
      },
    },
    {
      id: 'P3S Experimental Ashplume Spread',
      type: 'Ability',
      // 66C4 cast -> 66C5 spread damage
      netRegex: NetRegexes.ability({ id: '66C4', source: 'Phoinix', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Spread',
          fr: 'Dispersez-vous',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Left Cinderwing/Right Cinderwing': 'Left/Right Cinderwing',
        'Flare of Condemnation/Sparks of Condemnation': 'Flare/Sparks of Condemnation',
      },
    },
  ],
};

export default triggerSet;
