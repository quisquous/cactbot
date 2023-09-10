import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

// Note: ignoring Voidstrom 75BD, the 3k damage (but avoidable) damage from standing under boss.

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.StormsCrown,
  damageWarn: {
    'Barbariccia Savage Barbery Donut': '75BA', // donut aoe
    'Barbariccia Savage Barbery Line': '75C0', // line aoe through hitbox
    'Barbariccia Savage Barbery Out 1': '75BB', // sword explosion (after donut)
    'Barbariccia Savage Barbery Out 2': '75C1', // sword explosion (after line)
    'Barbariccia Hair Raid Wall': '75C2', // ~160 degree cleave from wall at sword
    'Barbariccia Tangle': '75E0', // ground circles before fetters
    'Barbariccia Secret Breeze 1': '75C4', // ground conal
    'Barbariccia Secret Breeze 2': '75C5', // ground conal
    'Barbariccia Brutal Gust': '75C8', // line aoe after Brutal Rush tether
    'Barbariccia Warning Gale 1': '7586', // center red/black circle
    'Barbariccia Warning Gale 2': '75C9', // center red/black circle
    'Barbariccia Winding Gale 1': '7487', // ground line aoes
    'Barbariccia Winding Gale 2': '75CA', // ground line aoes
    'Barbariccia Winding Gale 3': '75CB', // ground line aoes
    'Barbariccia Winding Gale 4': '75CC', // ground line aoes
    'Barbariccia Winding Gale 5': '75CD', // ground line aoes
    'Barbariccia Boulder 1': '759C', // large baited aoes from headmarkers
    'Barbariccia Boulder 2': '75D7', // large baited aoes from headmarkers
    'Barbariccia Blow Away 1': '7595', // baited ground circles
    'Barbariccia Blow Away 2': '75D3', // baited ground circles
    'Barbariccia Tornado Chain Out': '758E', // large inner circle
    'Barbariccia Tornado Chain In': '758F', // outer donut
    'Barbariccia Impact': '75D9', // blue knockback circle
    'Barbariccia Dry Blows': '7593', // many small ground circles
    'Barbariccia Stiff Breeze Tousle': '75D1', // moving green circles
  },
  gainsEffectFail: {
    'Barbariccia Windburn': 'BFD', // standing in outside ring
    'Barbariccia Sustained Damage': 'B77', // walking out of Tangled circle
  },
  shareFail: {
    'Barbariccia Hair Spray': '75DB', // spread markers
  },
  soloFail: {
    'Barbariccia Trample': '75DA', // stack marker with flares
  },
};

export default triggerSet;
