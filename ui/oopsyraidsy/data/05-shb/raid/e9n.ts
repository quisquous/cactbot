import ZoneId from '../../../../../resources/zone_id';
import { SimpleOopsyTriggerSet } from '../../../../../types/oopsy';

const triggerSet: SimpleOopsyTriggerSet = {
  zoneId: ZoneId.EdensPromiseUmbra,
  damageWarn: {
    'E9N The Art Of Darkness 1': '5223', // left-right cleave
    'E9N The Art Of Darkness 2': '5224', // left-right cleave
    'E9N Wide-Angle Particle Beam': '5AFF', // frontal cleave tutorial mechanic
    'E9N Wide-Angle Phaser': '55E1', // wide-angle "sides"
    'E9N Bad Vibrations': '55E6', // tethered outside giant tree ground aoes
    'E9N Earth-Shattering Particle Beam': '5225', // missing towers?
    'E9N Anti-Air Particle Beam': '55DC', // "get out" during panels
    'E9N Zero-Form Particle Beam 2': '55DB', // Clone line aoes w/ Anti-Air Particle Beam
  },
  damageFail: {
    'E9N Withdraw': '5534', // Slow to break seed chain, get sucked back in yikes
    'E9N Aetherosynthesis': '5535', // Standing on seeds during explosion (possibly via Withdraw)
  },
  shareWarn: {
    'E9N Zero-Form Particle Beam 1': '55EB', // tank laser with marker
  },
};

export default triggerSet;
