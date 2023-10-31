import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { NetMatches } from '../../../../../types/net_matches';
import {
  OopsyFunc,
  OopsyMistake,
  OopsyMistakeType,
  OopsyTriggerSet,
} from '../../../../../types/oopsy';
import { LocaleText } from '../../../../../types/trigger';
import { GetShareMistakeText, GetSoloMistakeText, playerDamageFields } from '../../../oopsy_common';

export interface Data extends OopsyData {
  hasRiteOfPassage: { [player: string]: boolean };
}

// TODO: we probably could use an oopsy utility library (and Data should be `any` here).
const stackMistake = (
  type: OopsyMistakeType,
  expected: number,
  abilityText?: LocaleText,
): OopsyFunc<Data, NetMatches['Ability'], OopsyMistake | undefined> => {
  return (_data, matches) => {
    const actual = parseFloat(matches.targetCount);
    if (actual === expected || actual === 0)
      return;
    const ability = abilityText ?? matches.ability;
    const text = actual === 1 ? GetSoloMistakeText(ability) : GetShareMistakeText(ability, actual);
    return { type: type, blame: matches.target, text: text };
  };
};

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AnotherSildihnSubterrane,
  initData: () => {
    return {
      hasRiteOfPassage: {},
    };
  },
  damageWarn: {
    'ASS Aqueduct Kaluk Right Sweep': '7963', // right 200 degree cleave
    'ASS Aqueduct Kaluk Left Sweep': '7964', // left 200 degree cleave
    'ASS Aqueduct Kaluk Creeping Ivy': '7965', // frontal conal
    'ASS Aqueduct Belladonna Atropine Spore': '7960', // large donut
    'ASS Aqueduct Sapria Bloody Caress': '795F', // wide frontal conal
    'ASS Aqueduct Udumbara Honeyed Right': '795C', // right cleave
    'ASS Aqueduct Udumbara Honeyed Left': '795B', // left cleave
    'ASS Aqueduct Dryad Acorn Bomb': '7958', // targeted circle
    'ASS Aqueduct Dryad Arboreal Storm': '7957', // centered circle
    'ASS Aqueduct Oqdan Uproot': '795A', // targeted circle
    'ASS Aqueduct Oqdan Gelid Gale': '7959', // targeted circle

    'ASS Silkie Chilling Duster': '7763', // cardinal cross ice
    'ASS Silkie Bracing Duster': '7764', // donut wind
    'ASS Silkie Fizzling Duster 1': '7765', // intercardinal cross lightning
    'ASS Silkie Fizzling Duster 2': '775D', // intercardinal cross lightning
    'ASS Silkie Soapsud Static': '77ED', // Fizzling Duster forked lightning spread
    'ASS Silkie Squeaky Clean 1': '7753', // 225 degree mouse swing, left or right
    'ASS Silkie Squeaky Clean 2': '7754', // 225 degree mouse swing, left or right
    'ASS Silkie Squeaky Clean 3': '7755', // 225 degree mouse swing, left or right
    'ASS Silkie Squeaky Clean 4': '7756', // 225 degree mouse swing, left or right
    'ASS Silkie Silken Puff Chilling Duster': '7768', // cardinal cross from puff
    'ASS Silkie Silken Puff Bracing Duster': '7769', // donut from puff
    'ASS Silkie Silken Puff Fizzling Duster': '776A', // intercardinal cross from puuff
    'ASS Silkie Silken Puff Puff and Tumble 1': '7770', // initial puff
    'ASS Silkie Silken Puff Puff and Tumble 2': '7771', // puff destination
    'ASS Silkie Eastern Ewer Brim Over': '776E', // initial Ewer circle
    'ASS Silkie Eastern Ewer Rinse': '776F', // moving Ewers

    'ASS Sil\'dihn Dullahan Blighted Gloom': '7966', // very large centered circle
    'ASS Aqueduct Armor Dominion Slash': '796A', // frontal conal on a random player

    'ASS Gladiator Rush of Might Front': '765B', // initial 180 cleave in front
    'ASS Gladiator Rush of Might Back': '765C', // followup 180 cleave behind
    'ASS Gladiator Ring of Might Out 1': '765D', // ring 1 out
    'ASS Gladiator Ring of Might Out 2': '765E', // ring 2 out
    'ASS Gladiator Ring of Might Out 3': '765F', // ring 3 out
    'ASS Gladiator Ring of Might In 1': '7660', // ring 1 in
    'ASS Gladiator Ring of Might In 2': '7661', // ring 2 in
    'ASS Gladiator Ring of Might In 3': '7662', // ring 3 in
    'ASS Gladiator Lingering Echo': '7677', // Curse of the Fallen akh rhai
    'ASS Gladiator Regret Rack and Ruin': '7664', // checkerboard line aoes
    'ASS Gladiator Sundered Remains': '7668', // shiva circles

    'ASS Shadowcaster Ball of Fire Burn': '7490', // circular explosion from fireballs
    'ASS Shadowcaster Arcane Font Blazing Benifice': '74A6', // line aoe from portal
    'ASS Shadowcaster Cast Shadow 1': '749C', // first hit of Cast Shadow
    'ASS Shadowcaster Cast Shadow 2': '749E', // second hit of Cast Shadow
    'ASS Shadowcaster Pure Fire': '74A1', // baited puddles
  },
  damageFail: {
    'ASS Silkie Silken Puff Buffeted Puffs': '77EA', // puffs too close together
    'ASS Gladiator Massive Explosion': '766B', // not taking a tower
    'ASS Gladiator Chains of Resentment': '7667', // not breaking chains fast enough
    'ASS Shadowcaster Trespasser\'s Pyre': '7499', // hitting Infirm Ward lasers
    'ASS Shadowcaster Big Burst': '74B9', // failing Cryptic Flames
  },
  gainsEffectWarn: {
    'ASS Silkie Deep Freeze': '4E6', // not moving after Soap's Up
  },
  gainsEffectFail: {
    'ASS Silkie Bleeding': 'C05', // standing outside Silkie Arena
    'ASS Shadowcaster Burns': 'BF9', // standing outside Shadowcaster arena
  },
  shareWarn: {
    'ASS Gladiator Echo of the Fallen': '7675', // Curse of the Fallen spread
    'ASS Gladiator Nothing beside Remains': '768C', // spread during Hateful Visage
  },
  shareFail: {
    'ASS Aqueduct Belladonna Deracinator': '7962', // tank buster cleave(?)
    'ASS Gladiator Mighty Smite': '7672', // tank buster cleave(?)
    'ASS Gladiator Scream of the Fallen': '7678', // defamations during towers
    'ASS Gladiator Explosion': '766A', // towers
    'ASS Shadowcaster Firesteel Strike': '74B1', // jumps before Blessed Beacon cleaves
    'ASS Shadowcaster Firesteel Fracture': '74AD', // tank buster cleave
    'ASS Shadowcaster Infirn Brand Infirm Wave': '74BB', // 90 degree large cleaves on closest people
  },
  soloFail: {
    'ASS Silkie Slippery Soap': '7760', // line stack damage
    'ASS Gladiator Scultor\'s Passion': '79F3', // line stack damage
    'ASS Gladiator Thunderous Echo': '7676', // Curse of the Fallen share
  },
  triggers: [
    {
      // Gaze attack
      id: 'ASS Aqueduct Belladonna Frond Affront',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '7961', ...playerDamageFields }),
      // Always hits target, but if correctly resolved will deal 0 damage
      condition: (data, matches) => data.DamageFromMatches(matches) > 0,
      mistake: (_data, matches) => {
        return {
          type: 'warn',
          blame: matches.target,
          reportId: matches.targetId,
          text: matches.ability,
        };
      },
    },
    {
      // Golden and Silver flames do damage if not cleansing a debuff
      // The same abilities are used for both versions.
      id: 'ASS Gladiator Hateful Visage Flame',
      type: 'Ability',
      // 766F = Golden Flame
      // 7670 = Silver Flame
      netRegex: NetRegexes.ability({ id: ['766F', '7670'], ...playerDamageFields }),
      condition: (data, matches) => data.DamageFromMatches(matches) > 0,
      mistake: (_data, matches) => {
        return {
          type: 'warn',
          blame: matches.target,
          reportId: matches.targetId,
          text: matches.ability,
        };
      },
    },
    {
      id: 'ASS Shadowcaster Blessed Beacon',
      type: 'Ability',
      // TODO: this could be invuln'd
      netRegex: NetRegexes.ability({ id: ['74B4', '74B5'] }),
      mistake: stackMistake('fail', 2),
    },
    {
      // This will kill the players if they don't take a portal.
      id: 'ASS Shadowcaster Call of the Portal',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'CCC' }),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 0.5,
      deathReason: (_data, matches) => {
        return {
          id: matches.targetId,
          name: matches.target,
          reportId: matches.targetId,
          text: matches.effect,
        };
      },
    },
    {
      id: 'ASS Shadowcaster Rite of Passage Gain',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'CCD' }),
      run: (data, matches) => data.hasRiteOfPassage[matches.target] = true,
    },
    {
      id: 'ASS Shadowcaster Rite of Passage Lose',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: 'CCD' }),
      run: (data, matches) => data.hasRiteOfPassage[matches.target] = false,
    },
    {
      id: 'ASS Shadowcaster Stun',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'A60' }),
      // Stuns are a good way to indicate who broke a line incorrectly.
      // However, everybody gets a stun during the teleport section.
      condition: (data, matches) => !data.hasRiteOfPassage[matches.target],
      mistake: (_data, matches) => {
        return {
          type: 'warn',
          blame: matches.target,
          reportId: matches.targetId,
          text: matches.effect,
        };
      },
    },
  ],
};

export default triggerSet;
