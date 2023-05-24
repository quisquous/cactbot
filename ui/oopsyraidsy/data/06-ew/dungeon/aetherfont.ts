import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheAetherfont,
  damageWarn: {
    'Aetherfont Haam Frostbeast Icestorm': '84C7', // frontal cleave
    'Aetherfont Haam Otodus Aquatic Lance': '84C8', // targeted circle

    // Boss 1
    'Aetherfont Lyngbakr Tidal Breath': '8240', // 180 cleave
    'Aetherfont Lyngbakr Resonant Frequency': '823B', // small rock explosions
    'Aetherfont Lyngbakr Explosive Frequency': '823C', // large rock explosions

    'Aetherfont Haam Troll Uppercut': '84CA', // frontal conal
    'Aetherfont Haam Golem Earthen Heart': '84C9', // targeted circle
    'Aetherfont Haam Crystal Hard Head': '84CB', // frontal conal

    // Boss 2
    'Aetherfont Arkas Lightning Leap 1': '824E', // targeted circle jump 1
    'Aetherfont Arkas Lightning Leap 2': '8799', // targeted circle jump 1 electricity explosion
    'Aetherfont Arkas Lightning Leap 3': '824F', // targeted circle jump 2
    'Aetherfont Arkas Lightning Leap 4': '8250', // targeted circle jump 2 electricity explosion
    'Aetherfont Arkas Forked Fissures': '8251', // lines from Lightnign Leap
    'Aetherfont Arkas Spinning Claw': '8252', // centered circle
    'Aetherfont Arkas Spun Lightning': '8253', // centered circle electricity explosion
    'Aetherfont Arkas Lightning Rampage 1': '860E', // targeted circle jump 1
    'Aetherfont Arkas Lightning Rampage 2': '879A', // targeted circle jump 1 electricity explosion
    'Aetherfont Arkas Lightning Rampage 3': '860F', // targeted circle jump 2-4
    'Aetherfont Arkas Lightning Rampage 4': '8611', // targeted circle jump 2-4 electricity explosion
    'Aetherfont Arkas Shock': '8255', // electricity explosions from Electric Eruption

    'Aetherfont Haam Forlorn Aetherial Spark': '84CC', // line aoe

    // Boss 3
    'Aetherfont Octomammoth Clearout': '8244', // tentacle circle aoe
    'Aetherfont Octomammoth Wallop': '8242', // tentacle line aoe
    'Aetherfont Octomammoth Vivid Eyes': '824B', // donut ring
    'Aetherfont Octomammoth Saline Spit': '8249', // all platform circles
    'Aetherfont Octomammoth Telekinesis': '8427', // some platform laser circles
    'Aetherfont Octomammoth Breathstroke': '86F7', // some platform laser circles
  },
  gainsEffectWarn: {
    // C01 is the infinite effect, C02 is 15 seconds when you step out.
    'Aetherfont Arkas Electrocution': 'C01',
  },
  shareWarn: {
    'Aetherfont Lyngbakr Waterspout': '823E', // Floodstide spread markers
    'Aetherfont Octomammoth Water Drop': '8284', // spread markers
  },
  soloWarn: {
    'Aetherfont Lyngbakr Tidalspout': '823F', // stack marker
    'Aetherfont Arkas Lightning Claw': '8256', // stack marker
  },
};

export default triggerSet;
