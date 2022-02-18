import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';
import { playerDamageFields } from '../../../oopsy_common';

export type Data = OopsyData;

// Shinryu Normal
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheRoyalMenagerie,
  damageWarn: {
    'Shinryu Akh Rhai': '1FA6', // Sky lasers alongside Akh Morn.
    'Shinryu Blazing Trail': '221A', // Rectangle AoEs, intermission adds.
    'Shinryu Collapse': '2218', // Circle AoEs, intermission adds
    'Shinryu Dragonfist': '24F0', // Giant punchy circle in the center.
    'Shinryu Earth Breath': '1F9D', // Conal attacks that aren't actually Earth Shakers.
    'Shinryu Gyre Charge': '1FA8', // Green dive bomb attack.
    'Shinryu Spikesicle': '1FA`', // Blue-green line attacks from behind.
    'Shinryu Tail Slap': '1F93', // Red squares indicating the tail's landing spots.
  },
  shareWarn: {
    'Shinryu Levinbolt': '1F9C',
  },
  triggers: [
    {
      // Icy floor attack.
      id: 'Shinryu Diamond Dust',
      type: 'GainsEffect',
      // Thin Ice
      netRegex: NetRegexes.gainsEffect({ effectId: '38F' }),
      deathReason: (_data, matches) => {
        return {
          id: matches.targetId,
          name: matches.target,
          text: {
            en: 'Slid off!',
            de: 'Runter gerutscht!',
            fr: 'A glissé(e) !',
            ja: '滑った',
            cn: '滑落',
            ko: '미끄러짐',
          },
        };
      },
    },
    {
      id: 'Shinryu Tidal Wave',
      type: 'AbilityFull',
      netRegex: NetRegexes.abilityFull({ id: '1F8B', ...playerDamageFields }),
      deathReason: (_data, matches) => {
        return {
          id: matches.targetId,
          name: matches.target,
          text: {
            en: 'Pushed off!',
            de: 'Runter geschubst!',
            fr: 'Repoussé(e) !',
            ja: '落ちた',
            cn: '击退坠落',
            ko: '넉백됨',
          },
        };
      },
    },
    {
      // Knockback from center.
      id: 'Shinryu Aerial Blast',
      type: 'AbilityFull',
      netRegex: NetRegexes.abilityFull({ id: '1F90', ...playerDamageFields }),
      deathReason: (_data, matches) => {
        return {
          id: matches.targetId,
          name: matches.target,
          text: {
            en: 'Pushed off!',
            de: 'Runter geschubst!',
            fr: 'Repoussé(e) !',
            ja: '落ちた',
            cn: '击退坠落',
            ko: '넉백됨',
          },
        };
      },
    },
  ],
};

export default triggerSet;
