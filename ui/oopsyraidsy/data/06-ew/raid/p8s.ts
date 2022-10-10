import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { NetMatches } from '../../../../../types/net_matches';
import { OopsyDeathReason, OopsyFunc, OopsyMistake, OopsyMistakeType, OopsyTriggerSet } from '../../../../../types/oopsy';
import { LocaleText } from '../../../../../types/trigger';
import { GetShareMistakeText, GetSoloMistakeText } from '../../../oopsy_common';

// TODO: figure out player blame for "Eye of the Gorgon" cursed voice
// TODO: Blood of the Gorgon 792F should hit 2 things in snake1 and 1 thing in snake2
// TODO: Breath of the Gorgon 7930 party stack (also hits Gorgon) should we care about stack count?
// TODO: Blood/Breath of the Gorgon missing the Gorgon should be a mistake
// TODO: p8s2 autos 72C2 should consider hitting non-tanks or non-invulning tanks?
// TODO: running into towers and getting debuffs you shouldn't
// TODO: missing High Concept towers
// TODO: missing Limitless Desolation towers
// TODO: missing Dominion towers

export interface Data extends OopsyData {
  hasPurple?: { [name: string]: boolean };
}

// TODO: we probably could use an oopsy utility library (and Data should be `any` here).
const stackMistake = (type: OopsyMistakeType, expected: number, abilityText?: LocaleText): OopsyFunc<Data, NetMatches['Ability'], OopsyMistake | undefined> => {
  return (_data, matches) => {
    const actual = parseFloat(matches.targetCount);
    if (actual === expected)
      return;
    const ability = abilityText ?? matches.ability;
    const text = actual === 1 ? GetSoloMistakeText(ability) : GetShareMistakeText(ability, actual);
    return { type: type, blame: matches.target, text: text };
  };
};

const purpleMistake = (): OopsyFunc<Data, NetMatches['Ability'], OopsyMistake> => {
  return (_data, matches: NetMatches['Ability']) => {
    return {
      type: 'fail',
      blame: matches.target,
      text: {
        en: `${matches.ability} (purple)`,
        de: `${matches.ability} (lila)`,
        ko: `${matches.ability} (보라)`,
      },
    };
  };
};

const wallDeathReason = (): OopsyFunc<Data, NetMatches['Ability'], OopsyDeathReason> => {
  return (_data, matches) => {
    return {
      id: matches.targetId,
      name: matches.target,
      text: {
        en: 'Pushed into wall',
        de: 'Rückstoß in die Wand',
        fr: 'Poussé(e) dans le mur',
        ja: '壁へノックバック',
        cn: '击退至墙',
        ko: '벽으로 넉백',
      },
    };
  };
};

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AbyssosTheEighthCircleSavage,
  damageWarn: {
    'P8S Torch Flame': '7927', // blue Volcanic Torch explosions
    'P8S Scorching Fang': '7912', // line aoe down the middle
    'P8S Sun\'s Pinion': '7913', // side aoes
    'P8S Snaking Kick': '7929',
    'P8S Eye of the Gorgon': '792D', // cursed voice petrification
    'P8S Illusory Hephaistos Scorched Pinion': '7953', // bird from clone
    'P8S Illusory Hephaistos Scorching Fang': '7952', // snake from clone
    'P8S Cthonic Vent 1': '7925', // Vent circle explosions
    'P8S Cthonic Vent 2': '7926', // Vent circle explosions
    'P8S Cthonic Vent 3': '794E', // Vent circle explosions
    'P8S Illusory Hephaistos Gorgospit': '7932', // line aoes from clones during snake2
    'P8S Quadrupedal Crush 1': '7105', // initial jump for beast2
    'P8S Quadrupedal Crush 2': '7107', // untargetable jump for beast2

    'P8S Tyrant\'s Flare': '7A8A', // baited puddles
    'P8S Ashing Blaze Left': '79D7', // left cleave
    'P8S Ashing Blaze Right': '79D8', // right cleave
    'P8S Illusory Hephaistoss End of Days': '7A8B', // line aoes
    'P8S Tyrant\'s Flare II': '7A88', // baited puddles during Limitless Desolation
  },
  damageFail: {
    'P8S Crown of the Gorgon': '792E', // snake2 cursed shriek
    'P8S Trailblaze': '793E', // line aoe down the middle during beast2 trailblaze knockback
  },
  gainsEffectFail: {
    // Needs to not happen for Gorgons
    'P8S Petrification': 'BBF',
  },
  shareWarn: {
    'P8S Nest of Flamevipers': '7920', // protean line aoes
    'P8S Emergent Octaflare': '7918', // stored spread
  },
  shareFail: {
    'P8S Flameviper 1': '7945', // first tankbuster line aoe
    'P8S Flameviper 2': '7946', // second tankbuster line aoe
    'P8S Uplift': '7935', // rock spread aoes during beast1
    'P8S Hemitheos\'s Flare': '72CE', // spread during clones
    'P8S Tyrant\'s Unholy Darkness': '79DE', // split tankbusters
    'P8S Tyrant\'s Fire III': '75F0', // Limitless Desolation spread
    'P8S Orogenic Deformation': '79DB', // Dominion spread
  },
  triggers: [
    {
      // Stored partner stacks.
      id: 'P8S Emergent Tetraflare',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '7919' }),
      mistake: stackMistake('fail', 2),
    },
    {
      // Stored beast2 light party stacks.
      id: 'P8S Emergent Diflare',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '791B' }),
      mistake: stackMistake('warn', 4),
    },
    {
      // 4x beast1 jumps with partners
      id: 'P8S Stomp Dead',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '7937' }),
      mistake: stackMistake('fail', 2),
    },
    {
      // Initial knockback from beast transformation.
      id: 'P8S Footprint',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '7109' }),
      deathReason: wallDeathReason(),
    },
    {
      // Black line knockback during beast2
      id: 'P8S Trailblaze Knockback',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '793E' }),
      deathReason: wallDeathReason(),
    },
    {
      // Radial knockback during beast2
      id: 'P8S Quadrupedal Impact',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: ['7104', '7106'] }),
      deathReason: wallDeathReason(),
    },
    {
      id: 'P8S Natural Alignment Gain',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'D54' }),
      run: (data, matches) => (data.hasPurple ??= {})[matches.target] = true,
    },
    {
      id: 'P8S Natural Alignment Lose',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: 'D54' }),
      run: (data, matches) => (data.hasPurple ??= {})[matches.target] = false,
    },
    {
      // Natural Alignment stack
      id: 'P8S Forcible Fire III',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '79BF' }),
      mistake: (data, matches) => {
        if (data.hasPurple?.[matches.target])
          return purpleMistake()(data, matches);
        return stackMistake('warn', 6)(data, matches);
      },
    },
    {
      // Natural Alignment spread
      id: 'P8S Forcible Fire II',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '79C0' }),
      mistake: (data, matches) => {
        if (data.hasPurple?.[matches.target])
          return purpleMistake()(data, matches);
        return stackMistake('warn', 1)(data, matches);
      },
    },
    {
      // Natural Alignment ice
      id: 'P8S Forcible Difreeze',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '79BE' }),
      mistake: (data, matches) => {
        if (data.hasPurple?.[matches.target])
          return purpleMistake()(data, matches);
        return stackMistake('fail', 3)(data, matches);
      },
    },
    {
      // Natural Alignment fire
      id: 'P8S Forcible Trifire',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '79BD' }),
      mistake: (data, matches) => {
        if (data.hasPurple?.[matches.target])
          return purpleMistake()(data, matches);
        return stackMistake('fail', 2)(data, matches);
      },
    },
    {
      id: 'P8S Solosplice',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '79B2' }),
      mistake: stackMistake('fail', 1, {
        // This is all just "Splicer", so rename it here.
        // Also sure this could just be in shareFail, but it fits with the other splicers.
        en: 'Single Splicer',
        de: 'Einzelne Konzeptreflektion',
        fr: 'Réaction conceptuelle simple',
        ko: '1인징',
      }),
    },
    {
      id: 'P8S Multisplice',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '79B3' }),
      mistake: stackMistake('fail', 1, {
        en: 'Double Splicer',
        de: 'Doppelte Konzeptreflektion',
        fr: 'Réaction conceptuelle double',
        ko: '2인징',
      }),
    },
    {
      id: 'P8S Supersplice',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '79B4' }),
      mistake: stackMistake('fail', 1, {
        en: 'Triple Splicer',
        de: 'Dreifache Konzeptreflektion',
        fr: 'Réaction conceptuelle triple',
        ko: '3인징',
      }),
    },
  ],
};

export default triggerSet;
