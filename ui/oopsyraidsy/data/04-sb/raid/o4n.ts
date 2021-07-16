import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';
import { playerDamageFields } from '../../../oopsy_common';

export type Data = OopsyData;

// O4N - Deltascape 4.0 Normal
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.DeltascapeV40,
  damageWarn: {
    'O4N Blizzard III': '24BC', // Targeted circle AoEs, Exdeath
    'O4N Empowered Thunder III': '24C1', // Untelegraphed large circle AoE, Exdeath
    'O4N Zombie Breath': '24CB', // Conal, tree head after Decisive Battle
    'O4N Clearout': '24CC', // Overlapping cone AoEs, Deathly Vine (tentacles alongside tree head)
    'O4N Black Spark': '24C9', // Exploding Black Hole
  },
  shareWarn: {
    // Empowered Fire III inflicts the Pyretic debuff, which deals damage if the player
    // moves or acts before the debuff falls. Unfortunately it doesn't look like there's
    // currently a log line for this, so the only way to check for this is to collect
    // the debuffs and then warn if a player takes an action during that time. Not worth it
    // for Normal.
    'O4N Standard Fire': '24BA',
    'O4N Buster Thunder': '24BE', // A cleaving tank buster
  },
  triggers: [
    {
      // Kills target if not cleansed
      id: 'O4N Doom',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '38E' }),
      deathReason: (_data, matches) => {
        return {
          type: 'fail',
          name: matches.target,
          text: {
            en: 'Cleansers missed Doom!',
            de: 'Doom-Reinigung vergessen!',
            fr: 'N\'a pas été dissipé(e) du Glas !',
            ja: '死の宣告',
            cn: '没解死宣',
          },
        };
      },
    },
    {
      // Short knockback from Exdeath
      id: 'O4N Vacuum Wave',
      type: 'Ability',
      netRegex: NetRegexes.abilityFull({ id: '24B8', ...playerDamageFields }),
      deathReason: (_data, matches) => {
        return {
          type: 'fail',
          name: matches.target,
          text: {
            en: 'Pushed off!',
            de: 'Runter geschubst!',
            fr: 'A été poussé(e) !',
            ja: '落ちた',
            cn: '击退坠落',
          },
        };
      },
    },
    {
      // Room-wide AoE, freezes non-moving targets
      id: 'O4N Empowered Blizzard',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '4E6' }),
      mistake: (_data, matches) => {
        return { type: 'warn', blame: matches.target, text: matches.effect };
      },
    },
  ],
};

export default triggerSet;
