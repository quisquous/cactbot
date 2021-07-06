import ZoneId from '../../../../../resources/zone_id';
import { SimpleOopsyTriggerSet } from '../../../../../types/oopsy';

export { OopsyData as Data } from '../../../../../types/data';

// Ifrit Story Mode
const triggerSet: SimpleOopsyTriggerSet = {
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
