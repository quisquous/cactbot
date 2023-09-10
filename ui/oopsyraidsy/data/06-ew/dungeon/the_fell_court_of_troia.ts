import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// TODO: if Rotten Rampage spread is shared with a wall, it is shown as a mistake

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheFellCourtOfTroia,
  damageWarn: {
    'Troia Troian Sentry Evil Pleghm': '7606', // targeted circle
    'Troia Troian Scavenger Dark Arrivisme': '7605', // targeted circle
    'Troia Troian Pawn Condemnation': '7604', // frontal conal

    'Troia Evil Dreamer Dark Vision 1': '73B8', // untelegraphed line aoes
    'Troia Evil Dreamer Dark Vision 2': '73BB', // untelegraphed line aoes
    'Troia Evil Dreamer Unite Mare Adds': '73BC', // large circles where you need to kill one add
    'Troia Evil Dreamer Unite Mare Small': '73B5', // final phase enrage small circles
    'Troia Evil Dreamer Unite Mare Big': '73B6', // final phase enrage large circle

    'Troia Troian Guard Void Trap': '760A', // large targeted circle
    'Troia Troian Footman Grim Halo': '7410', // large centered circle
    'Troia Troian Rider Geirrothr': '7607', // random player targeted front conal
    'Troia Troian Bishop Jester\'s Reap': '7609', // frontal conal
    'Troia Troian Knight Hall of Sorrow': '7608', // targeted circle

    'Troia Beatrice Beatific Scorn': '7479', // explosions
    'Troia Beatrice Voidshaker': '747E', // front conal
    'Troia Beatrice Toric Void': '79E7', // outside ring donut

    'Troia Troian Trapper Arachne Web': '760F', // targeted circle
    'Troia Troian Equerry Swoop': '760D', // circular entrance aoe
    'Troia Troian Butler Dark': '760E', // frontal contal
    'Troia Troian Steward Unholy Darkness': '760C', // centered circle

    'Troia Scarmiglione Rotten Rampage Circle': '7618', // untargeted ground circles
    'Troia Scarmiglione Blighted Bedevilment': '761B', // purple knockback circle
    'Troia Scarmiglione Blighted Bladework': '7633', // giant circle (with a line to it)
    'Troia Scarmiglione Blighted Sweep': '7635', // 180 "get behind" attack
    'Troia Scarmiglione Nox': '7621', // untargeted ground circles during add phase
  },
  gainsEffectFail: {
    'Troia Beatrice Doom': 'D24', // failing Death Forseen 747D lookaway
    'Troia Scarmiglione Zombification': '901', // taking three stacks of Brain Rot during Rotten Rampage
    // C09 is the 9999 duration while you are standing in the wall, and C0A is the 15s lingering debuff
    'Troia Scarmiglione Toxicosis': 'C0A', // getting knocked by Vacuum Wave not into a wall
  },
  shareWarn: {
    'Troia Beatrice Void Nail': '747F', // spread
    'Troia Scarmligione Rotten Rampage Spread': '7619', // spread markers
    'Troia Scarmiglione Void Gravity': '7622', // spread during add phase
  },
  shareFail: {
    'Troia Scarmiglione Firedamp': '7637', // cleaving tankbuster
  },
  soloWarn: {
    'Troia Beatrice Antipressure': '79E8', // stack
    'Troia Scarmiglione Void Vortex': '7623', // stack during add phase
  },
};

export default triggerSet;
