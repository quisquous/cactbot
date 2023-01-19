import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.LapisManalis,
  damageWarn: {
    'Caladrius Transonic Blast': '7F17', // // front cone AoE, before boss 1
    'Albus Griffin Golden Freefall': '8012', // circle AoE, before boss 1
    'Albus Griffin Golden Talons': '8013', // front cone AoE, before boss 1
    'Visitant Bloodguard Void Slash': '7F19', // front cone AoE, before boss 1

    'Albion Right Slam': '802D', // right cleave, boss 1
    'Albion Left Slam': '802E', // left cleave, boss 1
    'Albion Knock on Ice': '7A7F', // circle AoE, boss 1
    'Albion Icebreaker': '7A81', // jumping circle AoE, boss 1

    'Visitant Vodoriga Terror Eye': '7F1C', // front cone AoE, before boss 2
    'Galatea Parva Gravity Harp': '7F1A', // circle AoE, before boss 2
    'Visitant Taurus Uncanny Whisper': '7F18', // circle AoE, before boss 2

    'Galatea Magna Waxing Cycle Out': '7A91', // PBAoE, boss 2
    'Galatea Magna Waxing Cycle In': '7A93', // donut AoE, boss 2
    'Galatea Magna Waning Cycle In': '7F6E', // donut AoE, boss 2
    'Galatea Magna Waning Cycle Out': '7F70', // PBAoE, boss 2
    'Galatea Magna Soul Scythe': '7A9A', // jumping circle AoE, boss 2

    'Visitant Satana Dark': '7F1D', // circle AoE, before boss 3

    'Cagnazzo Antediluvian': '798F', // large circle AoE, boss 3
    'Cagnazzo Hydraulic Ram': '7FB6', // line charge, boss 3
    'Cagnazzo Hydrobomb': '7FB8', // circle AoE, boss 3
    'Cagnazzo Hydrovent': '79A0', // circle Aoe, boss 3
    'Cagnazzo Void Miasma': '7FB3', // baited cone AoE, boss 3
    'Cagnazzo Lifescleaver': '7989', // 8x cone AoE, boss 3
  },
  damageFail: {
    'Albion Wildlife Crossing': '7A7D', // animal stampede, boss 1
    'Albion Roar of Albion': '7A84', // hide to avoid roomwide AoE, boss 1

    'Galatea Magna Scarecrow Chase': '7FBF', // cross AoE, boss 2
    'Galatea Magna Big Burst': '7A98', // failed tower soak, boss 2

    'Cagnazzo Body Slam': '7993', // stood inside large knockback circle, boss 3
  },
  gainsEffectWarn: {
    'Cagnazzo Dropsy (wall)': 'C04', // touched arena wall, boss 3
  },
  gainsEffectFail: {
    'Galatea Magna Stony Gaze': 'BBF', // 4x gaze, boss 2
  },
  shareWarn: {
    'Albion Icy Throes': '7A83', // spread circles, boss 2

    'Cagnazzo Neap Tide': '799E', // Spread circles, boss 3
  },
  soloWarn: {
    'Cagnazzo Spring Tide': '799F', // Standard stack marker, boss 3
  },
};

export default triggerSet;
