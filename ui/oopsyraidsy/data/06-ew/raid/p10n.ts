import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export interface Data extends OopsyData {
  bindingSoulPlayers?: string[];
  concentratedPoisonPlayers?: string[];
}

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AnabaseiosTheTenthCircle,

  damageWarn: {
    'P10N Parted Plumes Blade': '8271', // rotating blade AoE
  },
  damageFail: {
    'P10N Unmitigated Explosion': '8260', // unsoaked pillar
    'P10N Imprisonment': '8262', // circle AoE from jails
    'P10N Cannonspawn': '8264', // donut AoE from jails
  },
  gainsEffectWarn: {
    'P10N Parted Plumes Puddle': 'C05', // Bleeding debuff from standing in center puddle
  },
  soloWarn: {
    'P10N Pandaemoniac Meltdown': '8277', // line stack
  },
  triggers: [
    {
      // Stacking debuff that auto-increments and upon reaching 5 stacks is fatal.
      id: 'P10N Binding Soul Share Gain',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'DDB' }),
      mistake: (data, matches) => {
        data.bindingSoulPlayers ??= [];
        if (!data.bindingSoulPlayers.includes(matches.target)) {
          data.bindingSoulPlayers.push(matches.target);
          return {
            type: 'fail',
            blame: matches.target,
            reportId: matches.targetId,
            text: matches.effect,
          };
        }
      },
    },
    {
      id: 'P10N Binding Soul Share Loss',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: 'DDB' }),
      run: (data, matches) => {
        data.bindingSoulPlayers = (data.bindingSoulPlayers ??= []).filter((p) =>
          p !== matches.target
        );
      },
    },
    {
      // Stacking debuff that auto-increments as you remain in the poison.
      id: 'P10N Concentrated Poison Gain',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'E6C' }),
      mistake: (data, matches) => {
        data.concentratedPoisonPlayers ??= [];
        if (!data.concentratedPoisonPlayers.includes(matches.target)) {
          data.concentratedPoisonPlayers.push(matches.target);
          return {
            type: 'fail',
            blame: matches.target,
            reportId: matches.targetId,
            text: matches.effect,
          };
        }
      },
    },
    {
      id: 'P10N Concentrated Poison Loss',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: 'E6C' }),
      run: (data, matches) => {
        data.concentratedPoisonPlayers = (data.concentratedPoisonPlayers ??= []).filter((p) =>
          p !== matches.target
        );
      },
    },
    {
      id: 'P10N Soul Grasp Non-Tank',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '8279' }),
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
    {
      id: 'P10N Wicked Step Non-Tank',
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
