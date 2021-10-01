import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// TODO: Infirm Soul (37D4) hitting Cursekeeper (37D2) target?
// TODO: taking Forbidden Arts #2 (37C8) with vuln stack from #1?

export type Data = OopsyData;

// Seiryu Extreme
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheWreathOfSnakesExtreme,
  damageWarn: {
    'SeiryuEx Onmyo Sigil 1': '3A01', // centered "get out" circle (phase 1)
    'SeiryuEx Onmyo Sigil 2': '3A03', // centered "get out" circle (phase 2 first)
    'SeiryuEx Onmyo Sigil 3': '3A06', // centered "get out" circle (phase 2 second)
    'SeiryuEx Serpent-Eye Sigil 1': '3A05', // donut (phase 2 first)
    'SeiryuEx Serpent-Eye Sigil 2': '3A04', // donut (phase 2 second)
    'SeiryuEx Fortune-Blade Sigil': '37E2', // Kuji-Kiri (37E1) lines
    'SeiryuEx Calamity-Blade Sigil': '37E3', // Kuji-Kiri (37E1) follow-up lines
    'SeiryuEx Iwa-No-Shiki 100-Tonze Swing': '37ED', // centered circles
    'SeiryuEx Ten-No-Shiki Yama-Kagura': '3C21', // blue lines during midphase / final phase adds
    'SeiryuEx Numa-No-Shiki Stoneskin': '37F4', // failing to silence add
    'SeiryuEx Great Typhoon 1': '37F8', // outside ring of water during Coursing River
    'SeiryuEx Great Typhoon 2': '37F9', // outside ring of water during Coursing River
    'SeiryuEx Great Typhoon 3': '37FA', // outside ring of water during Coursing River
    'SeiryuEx Great Typhoon 4': '37FB', // outside ring of water during Coursing River
    'SeiryuEx Yama-No-Shiki Handprint 1': '3707', // half arena cleave
    'SeiryuEx Yama-No-Shiki Handprint 2': '3708', // half arena cleave
    'SeiryuEx Force Of Nature': '37EA', // standing in the middle circle during knockback (380A)
    'SeiryuEx Serpent Descending Circle': '37DE', // baited circles with towers
    'SeiryuEx Serpent\'s Jaws': '37E0', // failing towers
  },
  shareWarn: {
    'SeiryuEx Serpent Descending Spread': '37DD', // spread markers
    'SeiryuEx Aka-No-Shiki Red Rush': '37F1', // tether charge
    'SeiryuEx Iwa-No-Shiki Kanabo': '37EE', // tether which targets a large conal cleave
  },
  shareFail: {
    'SeiryuEx Infirm Soul': '37D4', // tank buster circular cleave
  },
  soloWarn: {
    'SeiryuEx Ao-No-Shiki Blue Bolt': '37F0', // tether share
    'SeiryuEx Forbidden Arts 1': '37C7', // line stack share hit 1
    'SeiryuEx Forbidden Arts 2': '37C8', // line stack share hit 2
  },
};

export default triggerSet;
