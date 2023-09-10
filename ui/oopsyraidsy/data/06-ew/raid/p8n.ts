import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AbyssosTheEighthCircle,
  damageWarn: {
    'P8N Scorching Fang': '78EE', // line aoe down the middle
    'P8N Sun\'s Pinion': '78EF', // line aoes down the sides
    'P8N Gorgospit': '78FF', // large line aoe
    'P8N Suneater Cthonic Vent 1': '78F5', // circular explosion from intercard volcanos
    'P8N Suneater Cthonic Vent 2': '78F6', // circular explosion from intercard volcanos
    'P8N Suneater Cthonic Vent 3': '794D', // circular explosion from intercard volcanos
    'P8N Quadrupedal Crush': '7904', // jump to the wall before knockback (??)
    'P8N Torch Flame': '78F8', // being hit by blue outlined squares from Volcanic Torches
    'P8N Illusory Hephaistos Gorgospit': '6FD7', // square outline line aoes after Into the Shadows
  },
  damageFail: {
    'P8N Gorgon Gorgoneion': '78FD', // failing to kill Gorgon adds in time
  },
  gainsEffectWarn: {
    'P8N Petrification': 'BBF', // failing 6273 Petrifaction lookaway
    'P8N Burns': 'BFA', // being knocked back into the fire wall, BF9 = 9999 duration status
  },
  shareWarn: {
    'P8N Hemitheos\'s Flare': '7907', // spread markers
  },
};

export default triggerSet;
