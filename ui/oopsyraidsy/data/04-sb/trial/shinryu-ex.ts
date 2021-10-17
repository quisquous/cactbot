import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';
import { playerDamageFields } from '../../../oopsy_common';

// TODO: Hellfire (25DB) without Fire Resistance Up (208).
// TODO: Levinbolt (25EB) while having Lightning Resistance Down II (4EC).
// TODO: Hypernova (25E9) while not having Deep Freeze (4E6) or Fire Resistance Up (208).
// TODO: Doom (D2) expiring.

export type Data = OopsyData;

// Shinryu Extreme
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheMinstrelsBalladShinryusDomain,
  damageWarn: {
    'ShinryuEx Burning Chains': '2602', // not breaking chains fast enough
    'ShinryuEx Icicle Icicle Impact': '25EF', // icicles landing
    'ShinryuEx Icicle Spikesicle': '25F0', // icicle dash
    'ShinryuEx Tail Slap': '25E2', // tail add appearing
    'ShinryuEx Dragonfist': '2611', // giant punchy circle in the center.
    'ShinryuEx Gyre Charge': '2603', // phase 1 large dive attack
    'ShinryuEx Ginryu Fireball': '260B', // targeted circle during add phase
    'ShinryuEx Hakkinryu Blazing Trail': '2609', // wide line during add phase
    'ShinryuEx Tail Spit': '1DD1', // blue puck during knockback
    'ShinryuEx Aetherial Ray': '2618', // lasers while running along the tail
    'ShinryuEx Levinbolt': '2725', // baited lightning during final phase
    'ShinryuEx Wormwail': '2648', // donut attack
    'ShinryuEx Benighting Breath': '264A', // 90 degree conal attack
  },
  shareWarn: {
    'ShinryuEx Levinbolt': '25EA', // untelegraphed lightning spread
    'ShinryuEx Earth Breath': '25ED', // earthshaker-esque conal attacks
  },
  soloWarn: {
    'ShinryuEx Hypernova': '25E9', // stack in puddle damage
    'ShinryuEx Atomic Ray': '264D', // pair stack markers in final phase
  },
  triggers: [
    {
      // Icy floor attack.
      id: 'ShinryuEx Diamond Dust',
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
      id: 'ShinryuEx Tidal Wave',
      type: 'Ability',
      netRegex: NetRegexes.abilityFull({ id: '25DA', ...playerDamageFields }),
      deathReason: (_data, matches) => {
        return {
          id: matches.targetId,
          name: matches.target,
          text: {
            en: 'Pushed off!',
            de: 'Runter geschubst!',
            fr: 'A été poussé(e) !',
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
      type: 'Ability',
      netRegex: NetRegexes.abilityFull({ id: '25DF', ...playerDamageFields }),
      deathReason: (_data, matches) => {
        return {
          id: matches.targetId,
          name: matches.target,
          text: {
            en: 'Pushed off!',
            de: 'Runter geschubst!',
            fr: 'A été poussé(e) !',
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
