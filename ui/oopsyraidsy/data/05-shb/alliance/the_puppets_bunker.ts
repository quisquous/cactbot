import ZoneId from '../../../../../resources/zone_id';
import { SimpleOopsyTriggerSet } from '../../../../../types/oopsy';

export { OopsyData as Data } from '../../../../../types/data';

// TODO: 5093 taking High-Powered Laser with a vuln (because of taking two)
// TODO: 4FB5 taking High-Powered Laser with a vuln (because of taking two)
// TODO: 50D3 Aerial Support: Bombardment going off from add
// TODO: 5211 Maneuver: Volt Array not getting interrupted
// TODO: 4FF4/4FF5 One of these is failing chemical conflagration
// TODO: standing in wrong teleporter?? maybe 5363?

const triggerSet: SimpleOopsyTriggerSet = {
  zoneId: ZoneId.ThePuppetsBunker,
  damageWarn: {
    'Puppet Aegis Beam Cannons 1': '5074', // rotating separating white ground aoe
    'Puppet Aegis Beam Cannons 2': '5075', // rotating separating white ground aoe
    'Puppet Aegis Beam Cannons 3': '5076', // rotating separating white ground aoe
    'Puppet Aegis Collider Cannons': '507E', // rotating red ground aoe pinwheel
    'Puppet Aegis Surface Laser 1': '5091', // chasing laser initial
    'Puppet Aegis Surface Laser 2': '5092', // chasing laser chasing
    'Puppet Aegis Flight Path': '508C', // blue line aoe from flying untargetable adds
    'Puppet Aegis Refraction Cannons 1': '5081', // refraction cannons between wings
    'Puppet Aegis Life\'s Last Song': '53B3', // ring aoe with gap
    'Puppet Light Long-Barreled Laser': '5212', // line aoe from add
    'Puppet Light Surface Missile Impact': '520F', // untargeted ground aoe from No Restrictions
    'Puppet Superior Incendiary Bombing': '4FB9', // fire puddle initial
    'Puppet Superior Sharp Turn': '506D', // sharp turn dash
    'Puppet Superior Standard Surface Missile 1': '4FB1', // Lethal Revolution circles
    'Puppet Superior Standard Surface Missile 2': '4FB2', // Lethal Revolution circles
    'Puppet Superior Standard Surface Missile 3': '4FB3', // Lethal Revolution circles
    'Puppet Superior Sliding Swipe 1': '506F', // right-handed sliding swipe
    'Puppet Superior Sliding Swipe 2': '5070', // left-handed sliding swipe
    'Puppet Superior Guided Missile': '4FB8', // ground aoe during Area Bombardment
    'Puppet Superior High-Order Explosive Blast 1': '4FC0', // star aoe
    'Puppet Superior High-Order Explosive Blast 2': '4FC1', // star aoe
    'Puppet Heavy Energy Bombardment': '4FFC', // colored magic hammer-y ground aoe
    'Puppet Heavy Revolving Laser': '5000', // get under laser
    'Puppet Heavy Energy Bomb': '4FFA', // getting hit by ball during Active Suppressive Unit
    'Puppet Heavy R010 Laser': '4FF0', // laser pod
    'Puppet Heavy R030 Hammer': '4FF1', // circle aoe pod
    'Puppet Hallway High-Powered Laser': '50B1', // long aoe in the hallway section
    'Puppet Hallway Energy Bomb': '50B2', // running into a floating orb
    'Puppet Compound Mechanical Dissection': '51B3', // spinning vertical laser
    'Puppet Compound Mechanical Decapitation': '51B4', // get under laser
    'Puppet Compound Mechnical Contusion Untargeted': '51B7', // untargeted ground aoe
    'Puppet Compound 2P Relentless Spiral 1': '51AA', // triple untargeted ground aoes
    'Puppet Compound 2P Relentless Spiral 2': '51CB', // triple untargeted ground aoes
    'Puppet Compound 2P Prime Blade Out 1': '541F', // 2P prime blade get out
    'Puppet Compound 2P Prime Blade Out 2': '5198', // 2P/puppet teleporting/reproduce prime blade get out
    'Puppet Compound 2P Prime Blade Behind 1': '5420', // 2P prime blade get behind
    'Puppet Compound 2P Prime Blade Behind 2': '5199', // 2P teleporting prime blade get behind
    'Puppet Compound 2P Prime Blade In 1': '5421', // 2P prime blade get in
    'Puppet Compound 2P Prime Blade In 2': '519A', // 2P/puppet teleporting/reproduce prime blade get in
    'Puppet Compound 2P R012 Laser Ground': '51AE', // untargeted ground circle
    // This is... too noisy.
    // 'Puppet Compound 2P Four Parts Resolve 1': '51A0', // four parts resolve jump
    // 'Puppet Compound 2P Four Parts Resolve 2': '519F', // four parts resolve cleave
  },
  damageFail: {
    'Puppet Heavy Upper Laser 1': '5087', // upper laser initial
    'Puppet Heavy Upper Laser 2': '4FF7', // upper laser continuous
    'Puppet Heavy Lower Laser 1': '5086', // lower laser first section initial
    'Puppet Heavy Lower Laser 2': '4FF6', // lower laser first section continuous
    'Puppet Heavy Lower Laser 3': '5088', // lower laser second section initial
    'Puppet Heavy Lower Laser 4': '4FF8', // lower laser second section continuous
    'Puppet Heavy Lower Laser 5': '5089', // lower laser third section initial
    'Puppet Heavy Lower Laser 6': '4FF9', // lower laser third section continuous
    'Puppet Compound Incongruous Spin': '51B2', // find the safe spot double dash
  },
  gainsEffectWarn: {
    'Puppet Burns': '10B', // standing in many various fire aoes
  },
  shareWarn: {
    // This is pretty large and getting hit by initial without burns seems fine.
    // 'Puppet Light Homing Missile Impact': '5210', // targeted fire aoe from No Restrictions
    'Puppet Heavy Unconventional Voltage': '5004',
    // Pretty noisy.
    'Puppet Maneuver High-Powered Laser': '5002', // tank laser
    'Puppet Compound Mechnical Contusion Targeted': '51B6', // targeted spread marker
    'Puppet Compound 2P R012 Laser Tank': '51AE', // targeted spread pod laser on non-tank
  },
  shareFail: {
    'Puppet Aegis Anti-Personnel Laser': '5090', // tank buster marker
    'Puppet Superior Precision-Guided Missile': '4FC5',
    'Puppet Compound 2P R012 Laser Tank': '51AD', // targeted pod laser on tank
  },
};

export default triggerSet;
