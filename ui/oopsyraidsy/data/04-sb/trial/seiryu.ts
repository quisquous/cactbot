import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

// Seiryu Normal
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheWreathOfSnakes,
  damageWarn: {
    'Seiryu Onmyo Sigil': '3A07', // centered "get out" circle
    'Seiryu Serpent-Eye Sigil': '3A08', // donut
    'Seiryu Fortune-Blade Sigil': '3806', // Kuji-Kiri (37E1) lines
    'Seiryu Iwa-No-Shiki 100-Tonze Swing': '3C1E', // centered circles (tank tethers in extreme)
    'Seiryu Ten-No-Shiki Yama-Kagura': '3813', // blue lines during midphase / final phase adds
    'Seiryu Iwa-No-Shiki Kanabo': '3C20', // unpassable tether which targets a large conal cleave
    'Seiryu Great Typhoon 1': '3810', // outside ring of water during Coursing River
    'Seiryu Great Typhoon 2': '3811', // outside ring of water during Coursing River
    'Seiryu Great Typhoon 3': '3812', // outside ring of water during Coursing River
    'Seiryu Yama-No-Shiki Handprint 1': '3707', // half arena cleave
    'Seiryu Yama-No-Shiki Handprint 2': '3708', // half arena cleave
    'Seiryu Force Of Nature': '3809', // standing in the middle circle during knockback (380A)
    'Seiryu Serpent\'s Jaws': '3A8D', // failing towers
  },
  shareWarn: {
    'Seiryu Serpent Descending': '3804', // spread markers
    'Seiryu Aka-No-Shiki Red Rush': '3C1D', // tether charge
  },
  shareFail: {
    'Seiryu Infirm Soul': '37FD', // tank buster circular cleave
  },
  soloWarn: {
    'Seiryu Ao-No-Shiki Blue Bolt': '3C1C', // tether share
    'Seiryu Forbidden Arts 1': '3C82', // line stack share hit 1
    'Seiryu Forbidden Arts 2': '3C72', // line stack share hit 2
  },
};

export default triggerSet;
