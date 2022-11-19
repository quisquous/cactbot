import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

// TODO: Sugaar rotating Numbing Noise (46B4) Tail Snap (46B5) + draw-in

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.AmhAraeng,
  triggers: [
    {
      id: 'Hunt Mailktender Sabotendance',
      type: 'StartsUsing',
      netRegex: { id: '4663', source: 'Maliktender', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getOut(),
    },
    {
      id: 'Hunt Mailktender 20,000 Needles',
      type: 'StartsUsing',
      netRegex: { id: '4666', source: 'Maliktender', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getBehind('info'),
    },
    {
      id: 'Hunt Mailktender 990,000 Needles',
      type: 'StartsUsing',
      netRegex: { id: '4668', source: 'Maliktender', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getBehind(),
    },
    {
      id: 'Hunt Sugaar Numbing Noise',
      type: 'StartsUsing',
      netRegex: { id: '465F', source: 'Sugaar', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getBehind(),
    },
    {
      id: 'Hunt Sugaar Tail Snap',
      type: 'StartsUsing',
      netRegex: { id: '4660', source: 'Sugaar', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.goFront(),
    },
    {
      id: 'Hunt Sugaar Body Slam',
      type: 'StartsUsing',
      netRegex: { id: '4662', source: 'Sugaar', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.outOfMelee(),
    },
    {
      id: 'Hunt Tarchia Wild Horn',
      type: 'StartsUsing',
      netRegex: { id: '466A', source: 'Tarchia' },
      condition: (data) => data.inCombat,
      response: Responses.tankCleave(),
    },
    {
      id: 'Hunt Tarchia Metamorphic Blast',
      type: 'StartsUsing',
      netRegex: { id: '466F', source: 'Tarchia', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.aoe(),
    },
    {
      id: 'Hunt Tarchia Trounce',
      type: 'StartsUsing',
      netRegex: { id: '466B', source: 'Tarchia', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getBehind('info'),
    },
    {
      id: 'Hunt Tarchia Forest Fire',
      type: 'StartsUsing',
      netRegex: { id: '466E', source: 'Tarchia', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getOut(),
    },
    {
      id: 'Hunt Tarchia Groundstorm',
      type: 'StartsUsing',
      netRegex: { id: '4667', source: 'Tarchia', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getUnder('alert'),
    },
    {
      id: 'Hunt Tarchia Mighty Spin',
      type: 'Ability',
      // Groundstorm is followed up by an untelegraphed/uncasted Mighty Spin.
      netRegex: { id: '4667', source: 'Tarchia', capture: false },
      condition: (data) => data.inCombat,
      suppressSeconds: 1,
      response: Responses.getOut(),
    },
  ],
};

export default triggerSet;
