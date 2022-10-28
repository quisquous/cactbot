import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';
import { playerDamageFields } from '../../../oopsy_common';

// TODO: do tankbusters cleave?
// TODO: what's the effect for running into the outer edge on Terminus Wrecker?
// TODO: what's the effect for running into the outer ring on Svarbhanu?

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.Vanaspati,
  damageWarn: {
    'Vanaspati Terminus Trampler Tremblor': '6C22', // large centered circle
    'Vanaspati Terminus Idolizer Deadly Tentacles': '6CDD', // conal
    'Vanaspati Terminus Snatcher Vitriol': '6232', // Mouth Off mouth circles
    'Vanaspati Terminus Snatcher What Is Right': '6233', // right cleave
    'Vanaspati Terminus Snatcher What Is Left': '6234', // left cleave
    'Vanaspati Terminus Sprinter Hollow Spike': '6C1F', // long line aoe
    'Vanaspati Terminus Horror Bellows': '6C1E', // 90 degree conal
    'Vanaspati Terminus Bellwether Winds Of Despair': '6CDC', // line aoe
    'Vanaspati Svarbhanu Chaotic Undercurrent Purple': '624A', // purple square explosions
    'Vanaspati Svarbhanu Chaotic Undercurrent Blue': '624B', // blue square explosions
    'Vanaspati Svarbhanu Cosmic Kiss Circle': '624F', // midphase circles on ground
    'Vanaspati Svarbhanu Midphase Charge': '631E', // unnamed middphase line attacks
  },
  shareWarn: {
    'Vanaspati Terminus Snatcher Wallow': '6236', // spread marker
    'Vanaspati Svarbhanu Cosmic Kiss Spread': '6250', // spread marker
  },
  soloWarn: {
    'Vanaspati Terminus Wrecker Poison Heart': '6CDC', // stack marker
  },
  triggers: [
    {
      // Lookaway mechanic, does no damage on success.
      id: 'Vanaspati Terminus Twitcher Double Hex Eye',
      type: 'Ability',
      netRegex: NetRegexes.abilityFull({ id: '6C21', ...playerDamageFields }),
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
  ],
};

export default triggerSet;
