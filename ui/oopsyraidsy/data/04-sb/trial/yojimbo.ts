import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// TODO: Gekko (3883) is the orb "spread" marker that turns into donut Kasha (3834)
// however, it can make some sense to stack 2-3 up to create space.

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.KuganeOhashi,
  damageWarn: {
    'Yojimbo Fragility': '382A', // circle aoes from butterflies after Inoshikacho
    'Yojimbo Yukikaze': '3832', // icy-looking waffle lines
    'Yojimbo Kasha': '3834', // donut that follows Gekko orb markers
    'Yojimbo Tiny Song': '3835', // dorito stack
    'Yojimbo Electrogenetic Force': '3840', // purple orb explosions
    'Yojimbo Masamune': '3843', // very long targeted line
    'Yojimbo Epic Stormsplitter': '3845', // single line down the middle
    'Yojimbo Seasplitter 1': '3846', // follow-up "get middle" to Epic Stormsplitter
    'Yojimbo Seasplitter 2': '3847', // follow-up "get middle" to Epic Stormsplitter
    'Yojimbo Seasplitter 3': '3848', // follow-up "get middle" to Epic Stormsplitter
    'Yojimbo Seasplitter 4': '3849', // follow-up "get middle" to Epic Stormsplitter
    'Yojimbo Dragon\'s Head Mighty Blow': '3839', // running into Dragon's Head untargetable add
  },
  damageFail: {
    'Yojimbo Hell\'s Gate': '3842', // failing to break Iron Chains
  },
  shareWarn: {
    'Yojimbo The Bitter End': '31DE', // frontal tank cleave, no cast bar
  },
};

export default triggerSet;
