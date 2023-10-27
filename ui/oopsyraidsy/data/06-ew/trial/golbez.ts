import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheVoidcastDais,
  damageWarn: {
    'Golbez Terrastorm': '8465', // purple summoned meteors that leave big circles
    'Golbez Crescent Blade': '846B', // frontal 180 cleave
    'Golbez Arctic Assault': '8460', // ice-spike walls
    'Golbez Lingering Spark': '8469', // player-baited small AoE puddles
    'Golbez Shadow Crescent': '8487', // frontal 180 cleave (followed by Rising Beacon)
    'Golbez Rising Beacon': '848F', // large AOE centered on boss (immediately follows Shadow Crescent)
    'Golbez Cauterize': '84A1', // tether-baited line cleave from Shadow Dragon (following towers)
    'Golbez Gale Sphere': '845[4-7]', // line cleaves from Gale Sphere orbs
    'Golbez Void Stardust Initial': '84A5', // initial (corner) meteor drop
    'Golbez Void Stardust Continuing': '84A9', // subsequent meteor drops
  },
  damageFail: {
    'Golbez Massive Explosion': '849F', // tower exploding with too few (or no) players
  },
  shareWarn: {
    'Golbez Void Comet': '84AE', // smaller initial hits of multi-hit Void Meteor splash buster
    'Golbez Burning Shade': '8493', // player-targeted spread AoEs (immediately follows Shadow Crescent)
  },
  shareFail: {
    'Golbez Void Meteor': '84AF', // final (larger) hit of multi-hit Void Meteor splash buster
  },
  soloFail: {
    'Golbez Eventide Fall': '8482', // stack markers on healers
    'Golbez Immolating Shade': '8495', // stack maker on solo party member
  },
};

export default triggerSet;
