import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';
import { playerDamageFields } from '../../../oopsy_common';

// TODO: Rekindle (32E0) hitting multiple adds, any other players,
// or hitting adds before they've been killed once is a mistake.
// However, there is a point where it should hit one add in the
// beginning. This also happens later in the fight too, where it
// should not hit anybody else, but unfortunately also counts as
// hitting multiple people when it hits Suzaku.  So, there's really
// not any good way to write a mistake trigger for this ability.

// TODO: what is getting hit by an orb during Close-Quarter Crescendo?

export type Data = OopsyData;

// Suzaku Extreme
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.HellsKierExtreme,
  damageWarn: {
    'SuzakuEx Rout': '32F0', // untargetable phase 1 charge across the arena
    'SuzakuEx Fleeting Summer': '32D3', // targeted conal
    'SuzakuEx Scarlet Tail Feather Wing And A Prayer': '32D4', // circle aoe from unkilled plume
    'SuzakuEx Scarlet Plume Wing And A Prayer': '3244', // circle aoe from unkilled plume
    'SuzakuEx Ashes To Ashes': '32D0', // Scarlet Lady add, raidwide explosion if not killed in time
    'SuzakuEx Well Of Flame': '32E1', // targeted wide line aoe
    'SuzakuEx Hotspot': '32E2', // platform fire when the runes are activated
  },
  damageFail: {
    'SuzakuEx Immolate': '32E6', // Tower mechanic failure on Incadescent Interlude (party failure, not personal)
    'SuzakuEx Phantom Flurry': '32DE', // "phantom half" final hit of Phantom Flurry
  },
  soloWarn: {
    'SuzakuEx Scathing Net': '3243', // stack marker
  },
  triggers: [
    {
      id: 'SuzakuEx Ruthless Refrain',
      type: 'AbilityFull',
      netRegex: NetRegexes.abilityFull({ id: '32DB', ...playerDamageFields }),
      deathReason: (_data, matches) => {
        return {
          id: matches.targetId,
          name: matches.target,
          text: {
            en: 'Knocked off',
            de: 'Runtergefallen',
            fr: 'Renversé(e)',
            ja: 'ノックバック',
            cn: '击退坠落',
            ko: '넉백',
          },
        };
      },
    },
    {
      id: 'SuzakuEx Mesmerizing Melody',
      type: 'AbilityFull',
      netRegex: NetRegexes.abilityFull({ id: '32DA', ...playerDamageFields }),
      deathReason: (_data, matches) => {
        return {
          id: matches.targetId,
          name: matches.target,
          text: {
            en: 'Knocked off',
            de: 'Runtergefallen',
            fr: 'Renversé(e)',
            ja: 'ノックバック',
            cn: '击退坠落',
            ko: '넉백',
          },
        };
      },
    },
  ],
};

export default triggerSet;
