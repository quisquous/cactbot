import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { PluginCombatantState } from '../../../../../types/event';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  storedStars: { [name: string]: PluginCombatantState };
  phase: 1 | 2;
  storedBoss?: PluginCombatantState;
}

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheMinstrelsBalladEndsingersAria,
  timelineFile: 'endsinger.txt',
  initData: () => {
    return {
      storedStars: {},
      phase: 1,
    };
  },
  triggers: [],
  timelineReplace: [],
};

export default triggerSet;
