import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

// Ifrit Story Mode
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheBowlOfEmbers,
  damageWarn: {
    'IfritNm Radiant Plume': '2DE',
  },
  shareWarn: {
    'IfritNm Incinerate': '1C5',
    'IfritNm Eruption': '2DD',
  },
};

export default triggerSet;
