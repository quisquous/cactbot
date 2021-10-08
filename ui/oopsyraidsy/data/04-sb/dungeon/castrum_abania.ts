import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// TODO: we could correctly blame missing Num24 towers from 1F1D/1F1E/1F1F when they are taken.
// TODO: 12th Legion Packer Quick Charge (2127) going off is a mistake (probably).

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.CastrumAbania,
  damageWarn: {
    'CastrumAbania 12th Legion Laquearius Overpower': '2D0', // conal
    'CastrumAbania 12th Legion Avenger Shoulder Cannon': '231C', // targeted circle
    'CastrumAbania 12th Legion Vanguard Cermet Drill': '20E', // line aoe
    'CastrumAbania 12th Legion Signifier Dark Fire III': '519', // targeted circle
    'CastrumAbania 12th Legion Canis Pugnax Recklass Charge': '14F', // line aoe
    'CastrumAbania Magna Roader Magitek Fire 2': '1F15', // targeted circle
    'CastrumAbania Magna Roader Wild Speed': '1FF8', // 4x line charges
    'CastrumAbania Magna Roader Magitek Pulse 1': '2090', // Mark XLIII Mini Cannon aoes
    'CastrumAbania Magna Roader Magitek Pulse 2': '1F19', // Mark XLIII Mini Cannon aoes
    'CastrumAbania Hypertuned Blast Wave': '42C', // line aoe
    'CastrumAbania 12th Legion Roader Rush': '208A', // long line aoe when Roaders enter
    'CastrumAbania Number XXIV Gale Cut': '2083', // targeted circle
    'CastrumAbania Number XXIV Overflow': '1F20', // failing to get a tower
    'CastrumAbania 12th Legion Rearguard Cermet Pile': '23AB', // line aoe
    'CastrumAbania 12th Legion Armored Weapon Diffractive Laser': '209C', // centered circle
    'CastrumAbania 12th Legion Colossus Grand Sword': '24A6', // large conal
    'CastrumAbania 12th Legion Colossus Exhaust': '24A8', // large line aoe
    'CastrumAbania Inferno Rahu Blaster 1': '1F29', // line aoe (at Rahu 0)
    'CastrumAbania Inferno Rahu Blaster 2': '208E', // line aoe (at Rahu 1)
    'CastrumAbania Inferno Rahu Blaster 3': '208F', // line aoe (at Rahu 2)
    'CastrumAbania Inferno Ketu Wave': '1F28', // large circle during Ketu & Rahu
    'CastrumAbania Inferno Ketu Cutter': '1F27', // 180/360 pinwheel during Ketu & Rahu
  },
  damageFail: {
    'CastrumAbania Number XXIV Counter': '1F24', // having the wrong element
  },
  gainsEffectWarn: {
    'CastrumAbania Inferno 12th Legion Death Claw Seized': '507', // getting grabbed by tethered Death Claw
  },
  shareWarn: {
    'CastrumAbania Inferno Rahu Ray': '1F2A', // red spread circle
  },
};

export default triggerSet;
