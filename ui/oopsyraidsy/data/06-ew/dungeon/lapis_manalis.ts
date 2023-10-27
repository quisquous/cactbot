import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.LapisManalis,
  damageWarn: {
    'Lapis Caladrius Transonic Blast': '7F17', // // front cone AoE, before boss 1
    'Lapis Albus Griffin Freefall': '8012', // circle AoE, before boss 1
    'Lapis Albus Griffin Golden Talons': '8013', // front cone AoE, before boss 1
    'Lapis Visitant Bloodguard Void Slash': '7F19', // front cone AoE, before boss 1

    'Lapis Albion Wildlife Crossing': '7A7D', // damage from charging Wild Beasts, boss 1
    'Lapis Albion Right Slam': '802D', // right cleave, boss 1
    'Lapis Albion Left Slam': '802E', // left cleave, boss 1
    'Lapis Albion Knock on Ice': '7A7F', // circle AoE, boss 1
    'Lapis Albion Icebreaker': '7A81', // jumping circle AoE, boss 1
    'Lapis Albion Icy Throes Ground': '7FB9', // ground AOEs, boss 1
    'Lapis Albion Roar of Albion': '7A84', // line-of-sight damage if not hidden behind boulder, boss 1

    'Lapis Visitant Vodoriga Terror Eye': '7F1C', // front cone AoE, before boss 2
    'Lapis Galatea Parva Gravity Harp': '7F1A', // circle AoE, before boss 2
    'Lapis Visitant Taurus Uncanny Whisper': '7F18', // circle AoE, before boss 2

    'Lapis Galatea Magna Waxing Cycle Out': '7A91', // PBAoE, boss 2
    'Lapis Galatea Magna Waxing Cycle In': '7A93', // donut AoE, boss 2
    'Lapis Galatea Magna Waning Cycle In': '7F6E', // donut AoE, boss 2
    'Lapis Galatea Magna Waning Cycle Out': '7F70', // PBAoE, boss 2
    'Lapis Galatea Magna Soul Scythe': '7A9A', // jumping circle AoE, boss 2

    'Lapis Albus Serpent Regorge': '7F1B', // circle AoE before boss 3
    'Lapis Visitant Satana Dark': '7F1D', // circle AoE, before boss 3

    'Lapis Cagnazzo Antediluvian': '798F', // large circle AoE, boss 3
    'Lapis Cagnazzo Hydraulic Ram': '7FB6', // line charge, boss 3
    'Lapis Cagnazzo Hydrobomb': '7FB8', // circle AoE, boss 3
    'Lapis Cagnazzo Hydrovent': '79A0', // circle AoE, boss 3
    'Lapis Cagnazzo Void Miasma': '7FB3', // baited cone AoE, boss 3
    'Lapis Cagnazzo Lifescleaver': '7989', // 8x cone AoE, boss 3
  },
  damageFail: {
    'Lapis Galatea Magna Scarecrow Chase': '7FBF', // cross AoE, boss 2
    'Lapis Galatea Magna Big Burst': '7A98', // failed tower soak, boss 2

    'Lapis Cagnazzo Body Slam': '7993', // stood inside large knockback circle, boss 3
  },
  gainsEffectWarn: {
    'Lapis Albion Concussion': 'DC1', // stunned by charging Wild Beasts, boss 1
    'Lapis Cagnazzo Dropsy (wall)': 'C04', // touched arena wall, boss 3
  },
  gainsEffectFail: {
    'Lapis Galatea Magna Stony Gaze': 'BBF', // 4x gaze, boss 2
  },
  shareWarn: {
    'Lapis Albion Icy Throes Spread': '7A83', // spread circles, boss 1

    'Lapis Cagnazzo Neap Tide': '799E', // spread circles, boss 3
    'Lapis Cagnazzo Void Torrent': '798E', // tankbuster cleave, boss 3
  },
  soloWarn: {
    'Lapis Cagnazzo Hydrofall': '7A90', // standard stack marker, boss 3
    'Lapis Cagnazzo Spring Tide': '799F', // standard stack marker, boss 3
  },
};

export default triggerSet;
