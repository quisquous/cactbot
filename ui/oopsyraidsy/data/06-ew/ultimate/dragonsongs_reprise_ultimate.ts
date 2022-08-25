import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';
import { kFlagInstantDeath, playerDamageFields } from '../../../oopsy_common';

// TODO: 63DD Skyward Leap during Strength of the Heavens should ignore invulning tanks
// TODO: track vulns from Wrath tethers/blue marker in case they take a (deadly) liquid fire tick
// TODO: Akh Morn puddle damage is effectId=0 0x18 lines from Bleeding B87, but everybody gets this effect temporarily?
//       it is the only non-zero player dot damage between wroth flames and hot wing and hot-tail, though?
// TODO: Getting hit by the wrong cauterize at the end of adds phase
// TODO: trinity autos on wrong people, based on debuffs

export interface Data extends OopsyData {
  towerAbility?: string;
  convictionTower?: { [name: string]: boolean };
  hasDoom?: { [name: string]: boolean };
  seenWrothFlames?: boolean;
}

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.DragonsongsRepriseUltimate,
  damageWarn: {
    'DSR Ser Grinnaux Empty Dimension': '62DA', // donut (phase1 and Wrath)
    'DSR Ser Grinnaux Full Dimension': '62DB', // circle (phase 1)
    'DSR Ser Adelphel Holy Shield Bash': '63EB', // line charge at tethered player
    'DSR Ser Adelphel Shining Blade': '62CE', // dash attack
    'DSR Brightsphere Bright Flare': '62CF', // spheres generated by 62CE Shining Blade
    'DSR Ser Charibert Skyblind': '631A', // puddles after Brightwing cleaves
    'DSR Spiral Thrust': '63D4', // dashes from Ser Vellguine, Ser Ignasse, Ser Paulecrain
    'DSR Ser Gerrique Heavy Impact 1': '63D6', // expanding earth ring
    'DSR Ser Gerrique Heavy Impact 2': '63D7', // expanding earth ring
    'DSR Ser Gerrique Heavy Impact 3': '63D8', // expanding earth ring
    'DSR Ser Gerrique Heavy Impact 4': '63D9', // expanding earth ring
    'DSR Ser Gerrique Heavy Impact 5': '63DA', // expanding earth ring
    'DSR Ser Grinnaux Dimensional Collapse': '63DC', // red/black puddles
    'DSR Ser Charibert Heaven\'s Stake 1': '6FAF', // initial Sanctity of the Ward 4x fire puddles
    'DSR Ser Charibert Heaven\'s Stake 2': '6FB0', // Sanctity of the Ward donut ring before fire/ice
    'DSR King Thordan Broad Swing': '63C2', // 3x directional cleaves
    'DSR Nidhogg Gnashing Wheel': '6715', // "get out" part of Gnash and Lash
    'DSR Nidhogg Lashing Wheel': '6716', // "get in" part of Gnash and Lash
    'DSR Nidhogg Geirskogul': '670A', // baited line aoes from tower clones
    'DSR Nidhogg Drachenlance': '670C', // front conal
    'DSR Vedrfolnir Twisting Dive': '6B8B', // initial dragon dive + twister during Wrath/Death
    'DSR Ser Charibert Altar Flare': '63E4', // 4x big explosions during Wrath of the Heavens
    'DSR Vidofnir Cauterize': '6B8E', // dive during Wrath/Death
    'DSR Darkscale Cauterize': '6B8D', // dive during Wrath/Death
    'DSR Darkscale Chain Lightning': '6B90', // 2x lightning spread during Wrath (doesn't hit player it's on)
    'DSR Ser Zephirin Spear of the Fury': '6B93', // spear line aoe during Death of the Heavens
    'DSR Vidofnir Wings of Salvation': '6B96', // white puddle that creates doom cleanser in Death of the Heavens
    'DSR Hrasevelgr Swirling Blizzard': '6D38', // wind donut during adds phase first tethers
    'DSR Nidhogg Dark Breath': '6D3B', // conal attack during single tank buster during adds phase tethers
    'DSR Hraesvelgr Holy Breath': '6D3C', // conal attack during single tank buster during adds phase tethers
    'DSR Hraesvelgr Hallowed Wings Left Wing': '6D25', // left glowing wing
    'DSR Hraesvelgr Hallowed Wings Right Wing': '6D28', // right glowing wing
    'DSR The Scarlet Price Flame Blast': '6729', // bomberman orbs during Wroth Flames
    'DSR Nidhogg Hot Tail': '6D2E', // center line aoe
    'DSR Nidhogg Hot Wing': '6D2C', // sides line aoes
  },
  damageFail: {
    'DSR Dimensional Torsion': '62D8', // player tethering a cloud
    'DSR Dimensional Purgation': '62D9', // Ser Adelphel tethering a cloud during charges
    'DSR Ser Charibert Holy Chain': '62E0', // failing to break chains, often kills people
    'DSR Ser Grinnaux Planar Prison': '63EC', // leaving the purple circle
    'DSR Holy Comet Holy Impact': '63EA', // meteor explosion from being too close
    'DSR King Thordan Ascalon\'s Mercy Concealed': '63C9', // protean 2nd hit
    'DSR Nidhogg Darkdragon Dive Miss': '671B', // tower failure
    'DSR Dragon-King Thordan Flames of Ascalon': '6D91', // final phase "get out"
    'DSR Dragon-King Thordan Ice of Ascalon': '6D92', // final phase "get in"
    'DSR Dragon-King Thordan Exaflare\'s Edge': '6D9D', // final phase exaflares
  },
  gainsEffectFail: {
    'DSR Burns': 'B81', // fire puddles during Sanctity of the Ward
    'DSR Frostbite': 'B82', // ice puddles during Sanctity of the Ward
    'DSR Suppuration': 'C3D', // sharing a Mortal Vow pass (or initial application)
  },
  shareWarn: {
    'DSR Ser Adelphel Execution': '62D5', // dive on main tank after 62CE Shining Blade
    'DSR Ser Charibert Heavensflame': '62DF', // spread with 62E0 Holy Chain (also in Death)
    'DSR Ser Charibert Brightwing': '6319', // cleaves during Pure of Heart
    'DSR King Thordan Attack': '63BB', // King Thordan cleave autos
    'DSR King Thordan Lightning Storm': '63CD', // spread during Strength of the Ward
    'DSR Nidhogg Attack': '6730', // Nidhogg cleave autos
    'DSR Nidhogg Dark High Jump': '670E', // sharing a circle marker tower drop
    'DSR Nidhogg Dark Spineshatter Dive': '670F', // sharing an up/forwards arrow marker tower drop
    'DSR Nidhogg Dark Elusive Jump': '6710', // sharing a down/back arrow marker tower drop
    'DSR Nidhogg Darkdragon Dive Share': '6711', // sharing a single tower
    'DSR Spiral Pierce': '6B8A', // Ser Ignasse and Ser Vellguine tether charges during Wrath
    'DSR King Thordan Ascalon\'s Mercy Revealed': '63CB', // protean during Wrath
  },
  shareFail: {
    'DSR King Thordan Ascalon\'s Might': '63C5', // tank cleaves
    'DSR Holy Shield Bash': '62D1', // Ser Adelphel/Janlenoux tank tether stun charges
    'DSR Nidhogg Soul Tether': '671C', // tank tether cleaves
    'DSR Nidhogg Mirage Dive': '68C4', // dives during eye phase, probably a wipe if shared
    'DSR Skyward Leap 1x': '72A2', // Ser Paulecraine single blue marker during Wrath
    'DSR Staggering Breath': '6D3D', // solo tank buster from Nidhogg/Hrae during adds phase tethers
    'DSR Hallowed Plume': '6D29', // Hallowed Wings tankbusters
    'DSR Nidhogg Spreading Flames': '742B', // Wroth Flames spread
    'DSR King Thordan Trinity Highest Enmity': '6D9F', // Trinity auto
    'DSR King Thordan Trinity Second Enmity': '6DA0', // Trinity auto
    'DSR King Thordan Trinity Nearest': '6DA1', // Trinity auto
  },
  soloWarn: {
    'DSR Ser Haumeric Hiemal Storm': '63E7', // Sanctity of the Ward ice pair stacks
  },
  soloFail: {
    'DSR Nidhogg Dark Orb': '6D39', // shared tank buster during adds phase tethers
    'DSR Hraesvelgr Holy Orb': '6D3A', // shared tank buster during adds phase tethers
    'DSR Nidhogg Entangled Flames': '742C', // Wroth Flames stack
  },
  triggers: [
    {
      // Interrupt.
      id: 'DSR Ser Adelphel Holiest Hallowing',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '62D0' }),
      mistake: (_data, matches) => {
        return { type: 'fail', blame: matches.target, text: matches.ability };
      },
    },
    {
      id: 'DSR Ser Hermenost Conviction Cast Cleanup',
      type: 'StartsUsing',
      // 63DE/63DF = Strength of the Ward towers
      // 737B/737C = Sanctity of the Ward first towers
      // 6FEA/6FEB = Sanctity of the Ward second towers
      netRegex: NetRegexes.startsUsing({ id: ['63DE', '737B', '6FEA'] }),
      run: (data, matches) => {
        data.towerAbility = matches.id;
        data.convictionTower = {};
      },
    },
    {
      id: 'DSR Ser Hermenost Conviction Tower Collect',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: ['63DF', '737C', '6FEB'], ...playerDamageFields }),
      run: (data, matches) => (data.convictionTower ??= {})[matches.target] = true,
    },
    {
      id: 'DSR Ser Hermenost Eternal Conviction Failure',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '63E0' }),
      suppressSeconds: 1,
      mistake: (data) => {
        const missing = data.party.partyNames.filter((name) => {
          if (data.convictionTower?.[name])
            return false;
          // Skip tanks on Conviction during Strength of the Ward.
          if (data.towerAbility === '63DE' && data.party.isTank(name))
            return false;
          return true;
        }).sort();
        return missing.map((name) => {
          return {
            type: 'fail',
            blame: name,
            text: {
              en: 'Missed Tower',
              de: 'Tower verfehlt',
              fr: 'Tour manquée',
              cn: '错过塔',
              ko: '기둥 놓침',
            },
          };
        });
      },
    },
    {
      id: 'DSR King Thordan Gaze',
      // Same abilities during both Thordan1 and Thordan2
      // 63D1 = The Dragon's Gaze (Thordan lookaway)
      // 63D2 = The Dragon's Glory (eye lookaway)
      // Technically there is also a Hysteria status (127) but sometimes this doesn't apply (if somebody dies too soon??).
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: ['63D1', '63D2'], ...playerDamageFields }),
      condition: (data, matches) => data.DamageFromMatches(matches) > 0,
      mistake: (_data, matches) => {
        return { type: 'fail', blame: matches.target, reportId: matches.targetId, text: matches.ability };
      },
    },
    {
      id: 'DSR King Thordan Twister',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6B8C', ...playerDamageFields }),
      mistake: (_data, matches) => {
        // Instant death has a special flag value, differentiating
        // from the explosion damage you take when somebody else
        // pops one.
        if (matches.flags === kFlagInstantDeath) {
          return {
            type: 'fail',
            blame: matches.target,
            reportId: matches.targetId,
            text: {
              en: 'Twister Pop',
              de: 'Wirbelsturm berührt',
              fr: 'Apparition des tornades',
              ja: 'ツイスター',
              cn: '旋风',
              ko: '회오리 밟음',
            },
          };
        }
        // If not the one popping, just print "Twister".
        return {
          type: 'fail',
          blame: matches.target,
          reportId: matches.targetId,
          text: matches.ability,
        };
      },
    },
    {
      id: 'DSR Doom Gain',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'BA0' }),
      run: (data, matches) => (data.hasDoom ??= {})[matches.target] = true,
    },
    {
      id: 'DSR Doom Lose',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: 'BA0' }),
      run: (data, matches) => (data.hasDoom ??= {})[matches.target] = false,
    },
    {
      // There is no trigger line for when doom runs out, so check slightly
      // before to see if doom was cleared or if we should consider any
      // non-damage death after this a doom.
      id: 'DSR Doom Death',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'BA0' }),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 0.5,
      deathReason: (data, matches) => {
        if (!data.hasDoom || !data.hasDoom[matches.target])
          return;
        return {
          id: matches.targetId,
          name: matches.target,
          text: matches.effect,
        };
      },
    },
    {
      id: 'DSR Wroth Flames',
      // Wroth Flames cast happens, then cauterize that nobody should be hit by,
      // then at the end is the first Hot Wing / Hot Tail, marking the end of Wroth Flames.
      // Cauterize after this is intentionally hit.
      // 6D2B = Hot Wing (self-casted)
      // 6D2D = Hot Tail (self-casted)
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['6D2B', '6D2D'], capture: false }),
      run: (data) => data.seenWrothFlames = true,
    },
    {
      id: 'DSR Hraesvelgr Nidhogg Cauterize',
      // During the first hallowed and wroth flames, there are cauterize casts.
      // 6D3E = Nidhogg (during Wroth Flames and before Touchdown)
      // 6D3F = Hraesvelgr (during the first Hallowed Wings and before Touchdown)
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: ['6D3E', '6D3F'], ...playerDamageFields }),
      condition: (data) => !data.seenWrothFlames,
      mistake: (_data, matches) => {
        return { type: 'fail', blame: matches.target, reportId: matches.targetId, text: matches.ability };
      },
    },
    {
      id: 'DSR Pyretic',
      type: 'NetworkDoT',
      // Amazingly, the dot/hot line has the effect id for pyretic here.  Most dots don't.
      netRegex: NetRegexes.networkDoT({ effectId: '3C0' }),
      mistake: (_data, matches) => {
        return {
          type: 'fail',
          blame: matches.name,
          reportId: matches.id,
          text: {
            en: 'Pyretic',
            de: 'Pyretisch',
            fr: 'Pyretique',
            cn: '热病',
            ko: '열병',
          },
        };
      },
    },
  ],
};

export default triggerSet;
