import Conditions from '../../../../../resources/conditions';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  busterTargets?: string[];
}

const triggerSet: TriggerSet<Data> = {
  id: 'AnabaseiosTheEleventhCircle',
  zoneId: ZoneId.AnabaseiosTheEleventhCircle,
  timelineFile: 'p11n.txt',
  triggers: [
    {
      id: 'P11N Eunomia',
      type: 'StartsUsing',
      netRegex: { id: '81E2', source: 'Themis', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'P11N Divisive Ruling In',
      type: 'StartsUsing',
      netRegex: { id: '81B4', source: 'Themis', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Line Cleave -> In',
        },
      },
    },
    {
      id: 'P11N Divisive Ruling Out',
      type: 'StartsUsing',
      netRegex: { id: '81B3', source: 'Themis', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Line Cleave -> Out',
          de: 'Linien AoE -> Raus',
          fr: 'AoE en ligne -> Extérieur',
          ja: '直線AoE -> 離れる',
          cn: '直线AoE -> 远离',
          ko: '직선 장판 -> 바깥으로',
        },
      },
    },
    {
      id: 'P11N Dark Discord',
      type: 'GainsEffect',
      netRegex: { effectId: 'DE4' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get in light puddle',
        },
      },
    },
    {
      id: 'P11N Light Discord',
      type: 'GainsEffect',
      netRegex: { effectId: 'DE3' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get in dark puddle',
        },
      },
    },
    {
      id: 'P11N Dineis',
      type: 'StartsUsing',
      netRegex: { id: '8725', source: 'Themis', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Bait puddles x2',
        },
      },
    },
    {
      id: 'P11N Dismissal Ruling Dynamo',
      type: 'StartsUsing',
      netRegex: { id: '81FB', source: 'Themis', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Knockback -> get in',
        },
      },
    },
    {
      id: 'P11N Dismissal Ruling Chariot',
      type: 'StartsUsing',
      netRegex: { id: '81FA', source: 'Themis', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Knockback -> stay out',
        },
      },
    },
    {
      id: 'P11N Dike Collect',
      type: 'HeadMarker',
      netRegex: { id: '00DA' },
      run: (data, matches) => {
        data.busterTargets ??= [];
        data.busterTargets.push(matches.target);
      },
    },
    {
      id: 'P11N Dike Call',
      type: 'HeadMarker',
      netRegex: { id: '00DA', capture: false },
      delaySeconds: 0.5,
      suppressSeconds: 10,
      infoText: (data, _matches, output) => {
        const target1 = data.busterTargets?.[0] || '???';
        const target2 = data.busterTargets?.[1] || '???';
        return output.text!({ target1: target1, target2: target2 });
      },
      outputStrings: {
        text: {
          en: 'Tank buster: ${target1}, ${target2}',
        },
      },
    },
    {
      id: 'P11N Dike Cleanup',
      type: 'HeadMarker',
      netRegex: { id: '00DA', capture: false },
      delaySeconds: 10,
      run: (data) => delete data.busterTargets,
    },
    {
      id: 'P11N Upheld Ruling Dynamo',
      type: 'HeadMarker',
      netRegex: { id: '01CF' },
      infoText: (data, matches, output) => {
        if (data.me !== matches.target)
          return output.avoidCleave!({ target: data.ShortName(matches.target) });
        return output.cleaveOnYou!();
      },
      outputStrings: {
        avoidCleave: {
          en: 'Cleaving ${target} -> get in',
        },
        cleaveOnYou: {
          en: 'Cleave on YOU -> stay in',
        },
      },
    },
    {
      id: 'P11N Upheld Ruling Chariot',
      type: 'HeadMarker',
      netRegex: { id: '013E' },
      infoText: (data, matches, output) => output.text!({ target: data.ShortName(matches.target) }),
      outputStrings: {
        text: {
          en: 'Stack on ${target} -> get out',
        },
      },
    },
    {
      id: 'P11N Styx',
      type: 'HeadMarker',
      netRegex: { id: '0131' },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'P11N Blinding Light',
      type: 'HeadMarker',
      netRegex: { id: '01D2' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'P11N Divisive Ruling Double',
      type: 'StartsUsing',
      netRegex: { id: '81D7', source: 'Illusory Themis', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Line Cleave -> In on dark adds',
        },
      },
    },
  ],
};

export default triggerSet;
