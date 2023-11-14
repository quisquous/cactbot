import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyMistakeType, OopsyTrigger, OopsyTriggerSet } from '../../../../../types/oopsy';
import { playerDamageFields } from '../../../oopsy_common';

// TODO: people who missed their 8AC2 Burst tower
// TODO: failing 8894 Radiance orb damage during Analysis
// TODO: failing 8CDF Targeted Light during Analysis
// TODO: people who failed Subtractive Suppressor Alpha + Beta
// TODO: walking over 889B Arcane Combustion when you don't have Suppressor
// TODO: taking extra 8893 Inferno Divide squares during Spatial Tactics
// TODO: 01F7(success) and 01F8(fail) check and x markers?
// TODO: players not in Trapshooting stack 895A

export type Data = OopsyData;

// TODO: we could probably move these helpers to some oopsy util.
const pushedIntoWall = (
  triggerId: string,
  abilityId: string | string[],
): OopsyTrigger<OopsyData> => {
  return {
    id: triggerId,
    type: 'Ability',
    netRegex: NetRegexes.ability({ id: abilityId, ...playerDamageFields }),
    condition: (data, matches) => data.DamageFromMatches(matches) > 0,
    deathReason: (_data, matches) => {
      return {
        id: matches.targetId,
        name: matches.target,
        text: {
          en: 'Pushed into wall',
          de: 'Rückstoß in die Wand',
          fr: 'Poussé(e) dans le mur',
          ja: '壁へノックバック',
          cn: '击退至墙',
          ko: '넉백',
        },
      };
    },
  };
};

const nonzeroDamageMistake = (
  triggerId: string,
  abilityId: string | string[],
  type: OopsyMistakeType,
): OopsyTrigger<OopsyData> => {
  return {
    id: triggerId,
    type: 'Ability',
    netRegex: NetRegexes.ability({ id: abilityId, ...playerDamageFields }),
    condition: (data, matches) => data.DamageFromMatches(matches) > 0,
    mistake: (_data, matches) => {
      return {
        type: type,
        blame: matches.target,
        reportId: matches.targetId,
        text: matches.ability,
      };
    },
  };
};

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AnotherAloaloIsland,
  damageWarn: {
    // Trash 1
    'AAI Twister': '8BC0', // Twister tornados
    'AAI Kiwakin Tail Screw': '8BB8', // baited circle
    'AAI Snipper Bubble Shower': '8BB9', // front conal
    'AAI Snipper Crab Dribble': '8BBA', // fast back conal after Bubble Shower
    'AAI Ray Hydrocannon': '8BBD', // line aoe
    'AAI Ray Expulsion': '8BBF', // "get out"
    'AAI Ray Electric Whorl': '8BBE', // "get in"

    // Ketuduke
    'AAI Spring Crystal Saturate 1': '8AAB', // orb circle
    'AAI Spring Crystal Saturate 2': '8AAC', // rupee line laser
    'AAI Sphere Shatter': '8ABC', // moving arches
    'AAI Receding Twintides': '8ACC', // initial out during out->in
    'AAI Near Tide': '8ACD', // second out during in->out with 8ACE Encroaching Twintides
    'AAI Encroaching Twintides': '8ACE', // initial in during in->out
    'AAI Far Tide': '8ACF', // second in during out->in with 8ACC Receding Twintides
    'AAI Hydrobomb': '8AD1', // 3x puddles duruing 8ABD Blowing Bubbles

    // Trash 2
    'AAI Wood Golem Ovation': '8BC1', // front line aoe
    'AAI Islekeeper Isle Drop': '8C6F', // front circle

    // Lala
    'AAI Arcane Blight': '888F', // 270 degree rotating cleave
    'AAI Bright Pulse 1': '8891', // initial blue square
    'AAI Bright Pulse 2': '8892', // moving blue square
    'AAI Arcane Mine': '889A', // initial Arcane Mine squares
    'AAI Golem Aero II': '88A4', // line damage from Aloalo Golem during Symmetric Surge
    'AAI Telluric Theorem': '88A9', // puddles from Explosive Theorem spreads

    // Statice
    'AAI Trigger Happy': '894C', // limit cut dart board
    'AAI Bomb Burst': '895D', // bomb explosion
    'AAI Uncommon Ground': '8CC2', // people who are on the same dartboard color with Bull's-eye
  },
  damageFail: {
    'AAI Big Burst': '8AC3', // tower failure damage
    'AAI Massive Explosion 1': '889C', // failing to resolve Subractive Suppressor Alpha
    'AAI Massive Explosion 2': '889D', // failing to resolve Subractive Suppressor Beta
  },
  gainsEffectFail: {
    // C03 = 9999 duration, ??? = 15s duration
    'AAI Dropsy': 'C03', // standing outside Ketuduke
    // C05 = 9999 duration, C06 = 15s duration
    'AAI Bleeding': 'C05', // standing in blue square during Lala
    // BF9 = 9999 duration, BFA??? = 15s duration
    'AAI Burns': 'BF9', // standing outside Lala
  },
  shareWarn: {
    'AAI Hydrobullet': '8ABA', // spread debuffs
    'AAI Wood Golem Tornado': '8C4D', // headmarker -> bind and heavy aoe
    'AAI Powerful Light': '88A6', // spread marker during Symmetric Surge that turns squares blue
    'AAI Explosive Theorem': '88A8', // large spreads with Telluric Theorem puddles
    'AAI Trapshooting Spread': '895B', // spread damage from Trick Reload
  },
  soloWarn: {
    'AAI Snipper Water III': '8C64', // Snipper stack marker
    'AAI Islekeeper Gravity Force': '8BC5', // stack
    'AAI Trapshooting Stack': '895A', // stack damage from Trick Reload
  },
  soloFail: {
    'AAI Hydrofall': '8AB7', // partner stack debuffs
    'AAI Symmetric Surge': '889E', // two person stack that gives magic vuln up
  },
  triggers: [
    pushedIntoWall('AAI Angry Seas', '8AC1'),
    pushedIntoWall('AAI Pop', '894E'),
    nonzeroDamageMistake('AAI Hundred Lashings', ['8AC9', '8ACB'], 'warn'),
  ],
};

export default triggerSet;
