import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// TODO: Replace Unmitigated Explosion by detecting/blaming whomever did not soak a pillar.

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AnabaseiosTheTenthCircle,
  damageWarn: {
    'P10N Parted Plumes Blade': '8271', // rotating blade AoE
    'P10N Pandaemoniac Ray': '8266', // half-room AoE
  },
  damageFail: {
    'P10N Unmitigated Explosion': '8260', // unsoaked pillar
    'P10N Imprisonment': '8262', // circle AoE from jails
    'P10N Cannonspawn': '8264', // donut AoE from jails
  },
  gainsEffectWarn: {
    'P10N Parted Plumes Puddle': 'C05', // bleed from standing in center puddle
    'P10N Concentrated Poison': 'E6C', // stacking bleed from standing in poison pools
  },
  soloWarn: {
    'P10N Pandaemoniac Meltdown': '8277', // line stack
  },
  triggers: [
    {
      // Stacking debuff from being tethered when Silkspit resolves
      // Auto-increments, and is fatal upon reaching 5 stacks
      // But it appears under some circumstances, the debuff is removed/can be removed earlier
      id: 'P10N Binding Soul Share Initial',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'DDB', count: '01' }),
      mistake: (_data, matches) => {
        return {
          type: 'warn',
          blame: matches.target,
          reportId: matches.targetId,
          text: matches.effect,
        };
      },
    },
    {
      id: 'P10N Binding Soul Share Fatal',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'DDB', count: '05' }),
      mistake: (_data, matches) => {
        return {
          type: 'fail',
          blame: matches.target,
          reportId: matches.targetId,
          text: matches.effect,
        };
      },
    },
    {
      id: 'P10N Soul Grasp',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '8279' }),
      condition: (data, matches) => !data.party.isTank(matches.target),
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
      id: 'P10N Wicked Step',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '827[34]' }),
      condition: (data, matches) => !data.party.isTank(matches.target),
      mistake: (_data, matches) => {
        return {
          type: 'fail',
          blame: matches.target,
          reportId: matches.targetId,
          text: matches.ability,
        };
      },
    },
  ],
};

export default triggerSet;
