import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';
import { playerDamageFields } from '../../../oopsy_common';

// Note: Mustadio Last Testament (3737) does damage whether you succeed or fail,
// but is lethal if you fail, so it should be obvious when failed.
// Note: Similarly skipping Agrias Duskblade (3761), which also ~wipes when towers are missed.
// Note: skipping Agrias Frostbite (11D), which many people get a tick of when add is nearly dead.
// Note: Ultima's Aspersory Pervailing Current (38CC) hits a lot for low damage, so skipping.

// TODO: Dark Crusader Dark Rite (377F) going off if towers aren't stepped in.
// TODO: Bleeding from Agrias Shadowblade orbs merging and exploding?
// TODO: Ultima Dark Cannonade dorito stack does damage on success and failure.

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheOrbonneMonastery,
  damageWarn: {
    'Orbonne Harpy Blasphemous Howl': '3779', // large targeted circle
    'Orbonne Monastic Ghost Dark Eruption': '3A15', // targeted circle
    'Orbonne Monastic Ghost Lingering Resenentment': '377C', // large targeted circle
    'Orbonne Mustadio Right Handgonne': '373E', // left/right haircut
    'Orbonne Mustadio Left Handgonne': '373F', // left/right haircut
    'Orbonne Mustadio Iron Giant Compress': '3740', // line aoe from tethered Iron Giant on outside
    'Orbonne Mustadio Ballistic Impact': '3743', // spread marker
    'Orbonne Mustadio Searchlight': '3744', // chasing red circle that locks in
    'Orbonne Mustadio Leg Shot': '3742', // mines
    'Orbonne Mustadio Early Turret Satellite Beam': '3741', // quadrant explosion from tethered Early Turret
    'Orbonne Agrias Northswain\'s Strike': '3853', // line aoes from outside adds during sword+crystals phase
    'Orbonne Agrias Hallowed Bolt Circle': '385B', // very large circle
    'Orbonne Agrias Hallowed Bolt Donut': '385C', // very large donut
    'Orbonne Dark Crusader Infernal Wave': '3781', // line aoe
    'Orbonne Cid Hallowed Bolt': '374B', // lightning platform hit from sword after T.G. Holy Sword (3749)
    'Orbonne Cid Northswain\'s Strike': '3AD3', // "get out" after T.G. Holy Sword (374F)
    'Orbonne Cid Judgment Blade': '3AD4', // "get in" after T.G. Holy Sword (374A)
    'Orbonne Cid Agrias Shadowblade Orbs': '375F', // followup hits from growing red/black orbs
    'Orbonne Cid Crush Weapon 1': '4756', // chasing circle initial hit
    'Orbonne Cid Crush Weapon 2': '4757', // chasing circle
    'Orbonne Cid Ephemeral Knight Hallowed Bolt Donut': '3767', // initial donut from Ephemeral Knight headmarker
    'Orbonne Cid Ephemeral Knight Hallowed Bolt Circle': '3766', // followup circle from Ephemeral Knight
    'Orbonne Cid Crush Accessory': '375B', // platform aoe with safe spot on Icewolf add
    'Orbonne Ultima Holy IV': '389A', // targeted circle
    'Orbonne Ultima Auralight Line': '3897', // 3x lines during Auralight (38EA) cast that turn into ice
    'Orbonne Ultima Auralight Circle': '3898', // centered circle during Auralight (38EA) cast
    'Orbonne Ultima Auracite Shard Plummet': '38AD', // 3x shards falling before Grand Cross (38AC)
    'Orbonne Ultima Auracite Shard Grand Cross': '38AE', // cross explosion from Auracite Shards
    'Orbonne Ultima Demi-Belias Time Eruption 1': '38D0', // fast/slow clocks
    'Orbonne Ultima Demi-Belias Time Eruption 2': '38D1', // fast/slow clocks
    'Orbonne Ultima Demi-Hashmal Towerfall': '38D7', // control tower falling over
    'Orbonna Ultima Demi-Hashmal Extreme Edge 1': '38DA', // left/right cleave dash
    'Orbonna Ultima Demi-Hashmal Extreme Edge 2': '38DB', // left/right cleave dash
    'Orbonne Ultima Demi-Belias Eruption': '37C8', // headmarker with chasing telegraphed circle aoes
    'Orbonne Ultima Dominion Ray Of Light': '38B7', // lingering line aoe with Eastward/Westward March
    'Orbonne Ultima Embrace Initial': '38B9', // hidden blue traps being placed
    'Orbonne Ultima Embrace Triggered': '38BA', // hidden blue traps being triggered
    'Orbonne Ultima Explosion': '38E9', // failing to stop for Acceleration Bomb
    'Orbonne Ultima Dominion Bombardment': '38BE', // circle during midphase ice maze
    'Orbonne Ultima Holy': '38AB', // circle during midphase ice maze
  },
  damageFail: {
    'Orbonne Cid Icewolf Burst': '375C', // not killing Icewolf add in time
  },
  gainsEffectFail: {
    'Orbonne Harpy Devitalize Doom': '38E', // Harpy lookaway mechanic
  },
  shareWarn: {
    'Orbonne Agrias Cleansing Flame': '3865', // spread marker
    'Orbonne Agrias Shadowblade Initial': '375E', // initial hit from giant red/black circle headmarker
  },
  shareFail: {
    'Orbonne Agrias Thunder Slash': '3866', // conal tank cleave with marker
  },
  soloFail: {
    'Orbonne Cid Ephemeral Knight Hallowed Bolt Stack': '3768', // stack marker from Ephemeral Knight
  },
  triggers: [
    {
      // castbar that you need to have Heavenly Shield up for, or you get a vuln and knockback.
      id: 'Orbonne Agrias Judgment Blade',
      type: 'Ability',
      netRegex: NetRegexes.abilityFull({ id: '3857', ...playerDamageFields }),
      condition: (data, matches) => data.DamageFromMatches(matches) > 0,
      mistake: (_data, matches) => {
        return { type: 'warn', blame: matches.target, text: matches.ability };
      },
    },
    {
      // same as Judgment Blade, but from Sword Knight
      id: 'Orbonne Agrias Mortal Blow',
      type: 'Ability',
      netRegex: NetRegexes.abilityFull({ id: '385E', ...playerDamageFields }),
      condition: (data, matches) => data.DamageFromMatches(matches) > 0,
      mistake: (_data, matches) => {
        return { type: 'warn', blame: matches.target, text: matches.ability };
      },
    },
  ],
};

export default triggerSet;
