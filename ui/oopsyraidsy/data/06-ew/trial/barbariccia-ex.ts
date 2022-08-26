import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

// Note: ignoring Voidstrom 7577, the 3k damage (but avoidable) damage from standing under boss.

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.StormsCrownExtreme,
  damageWarn: {
    'BarbaricciaEx Savage Barbery Donut': '7574', // donut aoe
    'BarbaricciaEx Savage Barbery Line': '757A', // line aoe through hitbox
    'BarbaricciaEx Savage Barbery Out 1': '7575', // sword explosion (after donut)
    'BarbaricciaEx Savage Barbery Out 2': '757B', // sword explosion (after line)
    'BarbaricciaEx Hair Raid Wall': '757D', // ~160 degree cleave from wall at sword
    'BarbaricciaEx Hair Raid Donut': '757F', // donut aoe
    'BarbaricciaEx Tangle': '75AB', // ground circles before fetters
    'BarbaricciaEx Secret Breeze Pinwheel': '7415', // ground conals before protean
    'BarbaricciaEx Brutal Gust': '7585', // line aoe after Brutal Rush tether
    'BarbaricciaEx Warning Gale': '7587', // center red/black circle
    'BarbaricciaEx Winding Gale 1': '7588', // ground line aoes
    'BarbaricciaEx Winding Gale 2': '7486', // ground line aoes
    'BarbaricciaEx Winding Gale 3': '7589', // ground line aoes
    'BarbaricciaEx Winding Gale 4': '758A', // ground line aoes
    'BarbaricciaEx Boulder': '759D', // large baited aoes from headmarkers
    'BarbaricciaEx Blow Away': '7596', // baited ground circles
    'BarbaricciaEx Tornado Chain Out': '758C', // large inner circle
    'BarbaricciaEx Tornado Chain In': '758D', // outer donut
    'BarbaricciaEx Impact 1': '759F', // blue knockback circle
    'BarbaricciaEx Impact 2': '75A0', // blue knockback circle (??? maybe nothing)
    'BarbaricciaEx Dry Blows': '7594', // many small ground circles
    'BarbaricciaEx Stiff Breeze Tousle': '7592', // moving green circles
  },
  gainsEffectFail: {
    'BarbaricciaEx Windburn': '10D', // the 12s dot from death ring, `BFD` while standing in ring
    'BarbaricciaEx Sustained Damage': 'B77', // walking out of Tangled circle
  },
  shareFail: {
    'BarbaricciaEx Hair Spray': '75A6', // spread markers
    'BarbaricciaEx Hair Flay': '7413', // large circle during first fetters
    'BarbaricciaEx Secret Breeze Protean': '7580', // protean
    'BarbaricciaEx Brittle Boulder': '759E', // spread
  },
  soloFail: {
    'BarbaricciaEx Deadly Twist': '75A7', // stack markers
    'BarbaricciaEx Upbraid': '75A8', // partner stack circles
    'BarbaricciaEx Trample': '75A2', // stack marker with flares
  },
};

export default triggerSet;
