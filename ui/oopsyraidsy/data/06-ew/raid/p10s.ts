import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

// TODO: non-tanks in Soul Grasp 82A0
// TODO: take two TetraDaemoniac Bonds stacks 87AE
// TODO: not 4 people in TetraDaemoniac Bonds stacks 87AE
// TODO: not 2 people in Duodæmoniac Bonds 82A3
// TODO: not 3 people in Steel Web 827F
// TODO: towers exploding (person missing the tower 8288 damage from it)
// TODO: take two meltdown laser 87B1 (or laser + stack 829E)
// TODO: poison from stepping in green stuff
// TODO: too many stacks from webs
// TODO: webs too close and forming unbreakable bond
// TODO: are there abilities for the lasers in the back during cannonspawn/imprisonment??
// TODO: taking two turret lasers in front
// TODO: taking two turret lasers at the same time

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AnabaseiosTheTenthCircleSavage,
  damageWarn: {
    'P10S Entangling Web': '827E', // puddle under entangling web
    'P10S Pandaemon\'s Holy': '82A6', // "get out"
    'P10S Circles of Pandaemonium': '82A7', // "get in"
    'P10S Cannonspawn': '8285', // tower circle/donut
    'P10S Imprisonment': '8287', // tower circle/donut
    'P10S Peal of Damnation': '87B0', // back line laser during Cannonspawn/Imprisonment
    'P10S Touchdown': '828E', // large expanding circle
    'P10S Pandaemoniac Ray': '828A', // side laser
    'P10S Arcane Sphere Jade Passage': '828C', // bit lasers
  },
  shareWarn: {
    'P10S Dividing Wings': '8298', // tether cleave from staffs
    'P10S Silkspit': '827D', // spread webs
    'P10S Pandaemonic Meltdown Laser': '87B1', // spread laser
  },
  shareFail: {
    'P10S Daemoniac Bonds': '82A2', // spread debuff
    'P10S Wicked Step 1': '829A', // first wicked step tower
    'P10S Wicked Step 2': '829B', // first wicked step tower
  },
  soloFail: {
    'P10S Duodæmoniac Bonds': '82A3', // partners
  },
};

export default triggerSet;
