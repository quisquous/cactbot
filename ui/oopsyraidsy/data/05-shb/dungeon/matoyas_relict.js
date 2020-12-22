import ZoneId from '../../../../../resources/zone_id.js';

// TODO: could include 5484 Mudman Rocky Roll as a shareWarn, but it's low damage and common.

export default {
  zoneId: ZoneId.MatoyasRelict,
  damageWarn: {
    'Matoya Relict Werewood Ovation': '5518', // line aoe
    'Matoya Cave Tarantula Hawk Apitoxin': '5519', // big circle aoe
    'Matoya Spriggan Stonebearer Romp': '551A', // conal aoe
    'Matoya Sonny Of Ziggy Jittering Glare': '551C', // long narrow conal aoe
    'Matoya Mudman Quagmire': '5481', // Mudman aoe puddles
    'Matoya Mudman Brittle Breccia 1': '548E', // expanding circle aoe
    'Matoya Mudman Brittle Breccia 2': '548F', // expanding circle aoe
    'Matoya Mudman Brittle Breccia 3': '5490', // expanding circle aoe
    'Matoya Mudman Mud Bubble': '5487', // standing in mud puddle?
    'Matoya Cave Pugil Screwdriver': '551E', // conal aoe
    'Matoya Nixie Gurgle': '5992', // Nixie wall flush
    'Matoya Relict Molten Phoebad Pyroclastic Shot': '57EB', // the line aoes as you run to trash
    'Matoya Relict Flan Flood': '5523', // big circle aoe
    'Matoya Pyroduct Eldthurs Mash': '5527', // line aoe
    'Matyoa Pyroduct Eldthurs Spin': '5528', // very large circle aoe
    'Matoya Relict Bavarois Thunder III': '5525', // circle aoe
    'Matoya Relict Marshmallow Ancient Aero': '5524', // very large line groaoe
    'Matoya Relict Pudding Fire II': '5522', // circle aoe
    'Matoya Relict Molten Phoebad Hot Lava': '57E9', // conal aoe
    'Matoya Relict Molten Phoebad Volcanic Drop': '57E8', // circle aoe
    'Matoya Mother Porxie Medium Rear': '591D', // knockback into safe circle aoe
    'Matoya Mother Porxie Barbeque Line': '5917', // line aoe during bbq
    'Matoya Mother Porxie Barbeque Circle': '5918', // circle aoe during bbq
    'Matoya Mother Porxie To A Crisp': '5925', // getting to close to boss during bbq
    'Matoya Mother Proxie Buffet': '5926', // Aeolian Cave Sprite line aoe (is this a pun?)
  },
  damageFail: {
    'Matoya Nixie Sea Shanty': '598C', // Not taking the puddle up to the top? Failing add enrage?
  },
  shareWarn: {
    'Matoya Nixie Crack': '5990', // Nixie Crash-Smash tank tethers
    'Matoya Nixie Sputter': '5993', // Nixie spread marker
  },
};
