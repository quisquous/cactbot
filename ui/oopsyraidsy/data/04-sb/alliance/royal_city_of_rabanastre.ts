import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';
import { playerDamageFields } from '../../../oopsy_common';

// TODO: is Mateus's Azure Guard Fin Rays (2642) a tankbuster without a castbar? a cleave?

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheRoyalCityOfRabanastre,
  damageWarn: {
    'Rabanastre Mateus Ice Azer Hypothermal Combustion': '2639', // large centered circle when Ice Azer dies
    'Rabanastre Mateus Blizzard Sphere Chill': '2646', // baited long skinny conal from tethered Blizzard Spheres
    'Rabanastre Sniffing Seeq Bandit Lunge': '2670', // line aoe
    'Rabanastre Rabanastran Mimic Deathtrap': '75E', // centered circle
    'Rabanastre Hashmal Jagged Edge': '25CD', // red purple ground circles
    'Rabanastre Hashmal Towerfall': '25CA', // control towers falling over
    'Rabanastre Hashmal Extreme Edge 1': '25D0', // left/right cleave
    'Rabanastre Hashmal Extreme Edge 2': '25CE', // left/right cleave
    'Rabanastre Hashmal Earth Shaker': '25C8', // 3x 1/6 pie slices that usually happen twice in a row
    'Rabanastre Archaedemon Unholy Darkness': '2673', // very large conal (also during Rofocale)
    'Rabanastre Archaedemon Karma': '2672', // targeted circle (also during Rofocale)
    'Rabanastre Archaeolion The Dragon\'s Breath': '273C', // conal
    'Rabanastre Archaeolion The Ram\'s Breath': '273B', // conal
    'Rabanastre Archaeolion The Dragon\'s Voice': 'D10', // interruptable centered circle
    'Rabanastre Archaeolion The Ram\'s Voice': 'D0F', // interruptable centered circle
    'Rabanastre Rofocale Crush Weapon': '2684', // targeted circles
    'Rabanastre Rofocale Maverick': '2689', // multiple telegraphed line charges when untargetable, and later targetable
    'Rabanastre Rofocale Trample 1': '2677',
    'Rabanastre Rofocale Trample 2': '2678',
    'Rabanastre Rofocale Trample 3': '2679',
    'Rabanastre Rofocale Trample 4': '267A',
    'Rabanastre Rofocale Trample 5': '267B',
    'Rabanastre Rofocale Trample 6': '267C',
    'Rabanastre Rofocale Trample 7': '267D',
    'Rabanastre Rofocale Trample 8': '267E',
    'Rabanastre Rofocale Trample 9': '267F',
    'Rabanastre Rofocale Cry of Victory': '2675', // 180 cleave
    'Rabanastre Rofocale Embrace Initial': '2686', // Embrace initial circles
    'Rabanastre Rofocale Embrace Triggered': '2687', // running into Embrace hidden traps
    'Rabanastre Argath Crush Weapon': '2713', // same as Rofocale Crush Weapon
    'Rabanastre Argath Unrelenting': '262C', // five fan aoes in a cone
    'Rabanastre Argath Heartless Heartless': '2632', // cross aoe from judgment blade markers
    'Rabanastre Argath Soulfix': '262A', // centered circle, often paired with misdirect
    'Rabanastre Argath Coldblood Putt Putt': '2626', // hole in one misdirect donut
    'Rabanastre Argath Rail Of The Rooster': '2623', // unnerved stack from messing up Rail Of The Rat towers
    'Rabanastre Argath Self-Destruct': '262F', // explosion from somebody who has hit the wall and turned into a zombie
    'Rabanastre Argath The Word': '24A0', // Failing Mask Of Truth / Mask Of Lies
  },
  damageFail: {
    'Rabanastre Hashmal To Dust': '25C9', // Failing to kill Sand Sphere adds
  },
  gainsEffectWarn: {
    'Rabanastre Argath Bleeding': '282', // standing in Judgement Blade squares (140 is infinite effect when in, 282 when out)
  },
  gainsEffectFail: {
    'Rabanastre Mateus Deep Freeze': '4E6', // Frozen by ice skating adds
    'Rabanastre Transfiguration': '5B3', // Mateus Blizzard III The White Whisper (272E) / Argath running into the wall and turning into a zombie
    'Rabanastre Argath Craven': '58D', // turning into a chicken from 3 Unnerved stacks
  },
  shareWarn: {
    'Rabanastre Mateus Flash Freeze': '2647', // untelegraphed tank conal cleave
    'Rabanastre Mateus Icicle Snowpierce': '2640', // targeted telegraphed skinny line aoe
    'Rabanastre Hashmal Rock Cutter': '25D7', // untelegraphed tank cleave
    'Rabanastre Hashmal Falling Rock': '25D3', // Sand Sphere spread
    'Rabanastre Rofocale Chariot': '2674', // targeted line aoe with marker before Cry of Victory
  },
  soloFail: {
    'Rabanastre Hashmal Falling Boulder': '25D2', // Sand Sphere stack
  },
  triggers: [
    {
      id: 'Rabanastre Mateus Breathless',
      type: 'GainsEffect',
      // Ten stacks of Breathless is death.
      netRegex: NetRegexes.gainsEffect({ effectId: '595', count: '10' }),
      mistake: (_data, matches) => {
        return {
          type: 'fail',
          name: matches.target,
          reportId: matches.targetId,
          text: matches.effect,
        };
      },
    },
    {
      // unnamed damage from being hit by Rofocale driving in circles during add phase
      id: 'Rabanastre Rofocale Chariot Ring',
      type: 'AbilityFull',
      netRegex: NetRegexes.abilityFull({ id: '268C', ...playerDamageFields }),
      mistake: (_data, matches) => {
        return {
          type: 'fail',
          name: matches.target,
          reportId: matches.targetId,
          text: {
            en: 'Chariot',
            de: 'Streitwagen',
            fr: 'Chariot',
            ja: '戦車',
            cn: `战车`,
            ko: '근접광역기',
          },
        };
      },
    },
  ],
};

export default triggerSet;
