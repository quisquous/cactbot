import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: [
    ZoneId.AmhAraeng,
    ZoneId.IlMheg,
    ZoneId.Kholusia,
    ZoneId.Lakeland,
    ZoneId.TheRaktikaGreatwood,
    ZoneId.TheTempest,
  ],
  zoneLabel: {
    en: 'SS Rank Hunts',
    de: 'SS Jagdziele',
  },
  triggers: [
    {
      id: 'Hunt Rebellion Royal Decree',
      type: 'StartsUsing',
      netRegex: { id: '44BD', source: 'Forgiven Rebellion', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.aoe(),
    },
    {
      id: 'Hunt Rebellion Raging Fire',
      type: 'StartsUsing',
      netRegex: { id: '44C1', source: 'Forgiven Rebellion', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getUnder(),
    },
    {
      id: 'Hunt Rebellion Interference',
      type: 'StartsUsing',
      netRegex: { id: '44C2', source: 'Forgiven Rebellion', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getBehind(),
    },
    {
      id: 'Hunt Rebellion Sanctified Blizzard Chain',
      type: 'StartsUsing',
      netRegex: { id: '44DC', source: 'Forgiven Rebellion', capture: false },
      condition: (data) => data.inCombat,
      // TODO: which way is this rotating
    },
    {
      id: 'Hunt Rebellion Heavenly Cyclone',
      type: 'StartsUsing',
      netRegex: { id: '46CE', source: 'Forgiven Rebellion', capture: false },
      condition: (data) => data.inCombat,
      // TODO: which way is this rotating
    },
  ],
};

export default triggerSet;
