import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// Schola Scorpion Homing Missile (3A65) is hard not to hit Pipin/Lyse so just ignore.

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheGhimlytDark,
  damageWarn: {
    'Ghimlyt Airborne Explosion': '3881', // semi-targeted red circle
    'Ghimlyt Schola Gunship Garlean Fire': '3A6C', // targeted circle
    'Ghimlyt Mark III-B Magitek Colossus Magitek Slash 1': '3774', // spinning pie slices
    'Ghimlyt Mark III-B Magitek Colossus Magitek Slash 2': '3775', // spinning pie slices
    'Ghimlyt Mark III-B Magitek Colossus Magitek Slash 3': '394E', // spinning pie slices
    'Ghimlyt Mark III-B Magitek Colossus Magitek Slash 4': '394F', // spinning pie slices
    'Ghimlyt Mark III-B Magitek Colossus Exhaust': '3770', // line
    'Ghimlyt Schola Armored Weapon Diffractive Laser': '3A74', // targeted circle
    'Ghimlyt Prometheus Needle Gun': '345A', // front 90 degree conal
    'Ghimlyt Prometheus Oil Shower': '3456', // back 270 degree
    'Ghimlyt Prometheus Heat': '3458', // wall laser
    'Ghimlyt Schola Colossus Grand Strike': '3A75', // thin line
    'Ghimlyt Schola Hexadrone Swoop': '3882', // line aoe entering arena
    'Ghimlyt Schola Hexadrone 2-Tonze Magitek Missile': '3A71', // targeted circle
    'Ghimlyt Schola Hexadrone Circle of Death': '3A70', // centered circle
    'Ghimlyt Schola Mark II Colossus Exhaust': '3A76', // line
    'Ghimlyt Schola Mark II Colossus Grand Sword': '3A77', // wide conal
    'Ghimlyt Soranus Duo Angry Salamander': '372C', // targeted line
    'Ghimlyt Soranus Duo Crossbones': '3C80', // targeted line with knockback
    'Ghimlyt Soranus Duo Bombardment': '3C71', // large circles during Order to Bombard
    'Ghimlyt Soranus Duo Stunning Sweep': '3C72', // centered circle
    'Ghimlyt Soranus Duo Crosshatch': '3722', // repeated X charges during intermissions
    'Ghimlyt Soranus Duo Ceruleum Tank Burst': '371A', // ceruleum tank circle explosions
    'Ghimlyt Soranus Duo Quaternity': '3733', // series of X line charges
  },
  gainsEffectWarn: {
    'Ghimlyt Mark III-B Magitek Colossus Burns': '1F7', // standing in Magitek Slash fire pie slice
    'Ghimlyt Prometheus Burns': '11C', // standing in outside fire circle
  },
  shareWarn: {
    'Ghimlyt Mark III-B Magitek Colossus Jarring Blow': '376E', // tank buster conal cleave
    'Ghimlyt Mark III-B Magitek Colossus Wild Fire Beam': '3772', // spread marker
    'Ghimlyt Schola Colossus Homing Laser': '3884', // spread marker
  },
  soloWarn: {
    'Ghimlyt Mark III-B Magitek Colossus Magitek Ray': '376F', // stack marker
  },
};

export default triggerSet;
