import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// TODO: is there a way to tie Chelomorph/Glossomorth cursed voice cleaves
// that come from a Parasitos combatant (that is previously unused) to players?

// TODO: being on wrong side for Ptera Ixou
// TODO: taking wrong predation damage

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AbyssosTheSixthCircleSavage,
  damageWarn: {
    'P6S Polyominous Dark IV': '7867', // floor explosion
    'P6S Exocleaver 1': '786A', // pinwheel initial
    'P6S Exocleaver 2': '786B', // pinwheel second
    'P6S Choros Ixou 1': '7885', // 90 degree cleaves
    'P6S Choros Ixou 2': '7886', // 90 degree cleaves
    'P6S Choros Ixou 3': '79EB', // 90 degree cleaves
    'P6S Choros Ixou 4': '79EC', // 90 degree cleaves

    'P6S Dark Perimeter 1': '7873', // Aetherial Exchange donut
    'P6S Dark Perimeter 2': '7875', // Aetherial Exchange donut
    'P6S Dark Dome': '788C', // baited aoes
  },
  damageFail: {
    'P6S Reek Havoc': '79EE', // Transmission Glossomorph snake front attack
    'P6S Chelic Claw': '79EF', // Transmission Chelomorph wings back attack
  },
  shareWarn: {
    'P6S Darkburst': '7872', // Aetherial Exchange spread
    'P6S Dark Ashes': '788E', // spread paired with Choros Ixou'
    'P6S Dark Sphere 1': '7890', // large 8x spread during "checkerboard" pattern
    'P6S Dark Sphere 2': '7880', // large 2x spread during Cachexia 2
  },
  shareFail: {
    'P6S Pathogenic Cells': '7865', // limit cut cleaves
    'P6S Synergy 1': '7888', // split tankbuster
    'P6S Synergy 2': '7889', // split tankbuster
    'P6S Aetheronecrosis': '7877', // Cachexia 8, 12, 16, 20 timed explosions
    'P6S Glossal Predation': '787A', // Cachexia 1 snake side proximity attack
    'P6S Chelic Predation': '787B', // Cachexia 1 wing side proximity attack
  },
  soloFail: {
    'P6S Unholy Darkness 1': '7892', // initial healer group stacks
    'P6S Unholy Darkness 2': '786D', // Aetherial Exchange 1 stack
    'P6S Unholy Darkness 3': '786E', // Aetherial Exchange 1 stack
    'P6S Unholy Darkness 4': '7A0F', // Aetherial Exchange 2 stack
    'P6S Unholy Darkness 5': '787F', // Cachexia 2 stack
  },
};

export default triggerSet;
