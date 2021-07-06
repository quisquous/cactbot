import ZoneId from '../../../../../resources/zone_id';
import { SimpleOopsyTriggerSet } from '../../../../../types/oopsy';

export { OopsyData as Data } from '../../../../../types/data';

const triggerSet: SimpleOopsyTriggerSet = {
  zoneId: ZoneId.EdensPromiseLitany,
  damageWarn: {
    'E10N Forward Implosion': '56B4', // howl boss implosion
    'E10N Forward Shadow Implosion': '56B5', // howl shadow implosion
    'E10N Backward Implosion': '56B7', // tail boss implosion
    'E10N Backward Shadow Implosion': '56B8', // tail shadow implosion
    'E10N Barbs Of Agony 1': '56D9', // Shadow Warrior 3 dog room cleave
    'E10N Barbs Of Agony 2': '5B26', // Shadow Warrior 3 dog room cleave
    'E10N Cloak Of Shadows': '5B11', // non-squiggly line explosions
    'E10N Throne Of Shadow': '56C7', // standing up get out
    'E10N Right Giga Slash': '56AE', // boss right giga slash
    'E10N Right Shadow Slash': '56AF', // giga slash from shadow
    'E10N Left Giga Slash': '56B1', // boss left giga slash
    'E10N Left Shadow Slash': '56BD', // giga slash from shadow
    'E10N Shadowy Eruption': '56E1', // baited ground aoe markers paired with barbs
  },
  shareWarn: {
    'E10N Shadow\'s Edge': '56DB', // Tankbuster single target followup
  },
};

export default triggerSet;
