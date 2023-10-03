import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// Schola Scorpion Homing Missile (3A65) is hard not to hit Pipin/Lyse so just ignore.

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheGhimlytDark,
  damageWarn: {
    'Ghimlyt64 Airborne Explosion': '3881', // semi-targeted red circle
    'Ghimlyt64 Schola Gunship Garlean Fire': '3A6C', // targeted circle
    'Ghimlyt64 Mark III-B Magitek Colossus Magitek Slash 1': '3774', // spinning pie slices
    'Ghimlyt64 Mark III-B Magitek Colossus Magitek Slash 2': '3775', // spinning pie slices
    'Ghimlyt64 Mark III-B Magitek Colossus Magitek Slash 3': '394E', // spinning pie slices
    'Ghimlyt64 Mark III-B Magitek Colossus Magitek Slash 4': '394F', // spinning pie slices
    'Ghimlyt64 Mark III-B Magitek Colossus Exhaust': '3770', // line
    'Ghimlyt64 Schola Armored Weapon Diffractive Laser': '3A74', // targeted circle
    'Ghimlyt64 Prometheus Needle Gun': '345A', // front 90 degree conal
    'Ghimlyt64 Prometheus Oil Shower': '3456', // back 270 degree
    'Ghimlyt64 Prometheus Heat': '3458', // wall laser
    'Ghimlyt64 Schola Colossus Grand Strike': '3A75', // thin line
    'Ghimlyt64 Schola Hexadrone Swoop': '3882', // line aoe entering arena
    'Ghimlyt64 Schola Hexadrone 2-Tonze Magitek Missile': '3A71', // targeted circle
    'Ghimlyt64 Schola Hexadrone Circle of Death': '3A70', // centered circle
    'Ghimlyt64 Schola Mark II Colossus Exhaust': '3A76', // line
    'Ghimlyt64 Schola Mark II Colossus Grand Sword': '3A77', // wide conal
    'Ghimlyt64 Soranus Duo Angry Salamander': '372C', // targeted line
    'Ghimlyt64 Soranus Duo Crossbones': '3C80', // targeted line with knockback
    'Ghimlyt64 Soranus Duo Bombardment': '3C71', // large circles during Order to Bombard
    'Ghimlyt64 Soranus Duo Stunning Sweep': '3C72', // centered circle
    'Ghimlyt64 Soranus Duo Crosshatch': '3722', // repeated X charges during intermissions
    'Ghimlyt64 Soranus Duo Ceruleum Tank Burst': '371A', // ceruleum tank circle explosions
    'Ghimlyt64 Soranus Duo Quaternity': '3733', // series of X line charges
  },
  gainsEffectWarn: {
    'Ghimlyt64 Mark III-B Magitek Colossus Burns': '1F7', // standing in Magitek Slash fire pie slice
    'Ghimlyt64 Prometheus Burns': '11C', // standing in outside fire circle
  },
  shareWarn: {
    'Ghimlyt64 Mark III-B Magitek Colossus Jarring Blow': '376E', // tank buster conal cleave
    'Ghimlyt64 Mark III-B Magitek Colossus Wild Fire Beam': '3772', // spread marker
    'Ghimlyt64 Schola Colossus Homing Laser': '3884', // spread marker
  },
  soloWarn: {
    'Ghimlyt64 Mark III-B Magitek Colossus Magitek Ray': '376F', // stack marker
  },
};

export default triggerSet;
