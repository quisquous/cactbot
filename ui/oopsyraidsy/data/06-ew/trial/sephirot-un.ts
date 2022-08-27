import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export interface Data extends OopsyData {
  force?: { [name: string]: string };
}

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.ContainmentBayS1T7Unreal,
  damageWarn: {
    'SephirotEX Yesod': '76AB', // Snapshot floor spikes
    'SephirotEX Ain': '7696', // Half-arena baited frontal
    'SephirotEX Ein Sof': '769C', // Expanding green puddles
    'SephirotEX Fiendish Wail': '76A4', // Raidwide if tower is missed
  },
  damageFail: {
    'SephirotEX Pillar Of Mercy': '76AE', // Standing in the blue puddles
    'SephirotEX Storm Of Words Revelation': '7680', // Missing the enrage on Storm of Words
  },
  shareWarn: {
    'SephirotEX Triple Trial': '7693', // Instant tank cleave
    'SephirotEX Ratzon Green': '7698', // Small green spread circle
    'SephirotEX Ratzon Purple': '7699', // Large purple spread circle
    'SephirotEX Earth Shaker': '7688',
    'SephirotEX Spread Da\'at': '76A0',
  },
  soloWarn: {
    'SephirotEX Fiendish Rage': '769A', // Stack markers, phase 1
  },
  triggers: [
    {
      // Pillar of Mercy,  Malkuth, and Pillar of Severity
      id: 'SephirotEX Knockbacks',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: ['76AD', '76AF', '76B2'], source: 'Sephirot' }),
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
      // 3ED is Force Against Might orange, 3EE is Force Against Magic, green.
      id: 'SephirotEX Force Against Gain',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['3ED', '3EE'] }),
      run: (data, matches) => {
        data.force ??= {};
        data.force[matches.target] = matches.effectId;
      },
    },
    {
      id: 'SephirotEX Force Against Lose',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: ['3ED', '3EE'] }),
      run: (data, matches) => {
        data.force ??= {};
        delete data.force[matches.target];
      },
    },
    {
      id: 'SephirotEX Spirit',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '76A8', source: 'Sephirot' }),
      condition: (data, matches) => data?.force?.[matches.target] === '3ED',
      mistake: (_data, matches) => {
        return {
          type: 'warn',
          blame: matches.target,
          text: matches.ability,
        };
      },
    },
    {
      id: 'SephirotEX Life Force',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '76A7', source: 'Sephirot' }),
      condition: (data, matches) => data?.force?.[matches.target] === '3EE',
      mistake: (_data, matches) => {
        return {
          type: 'warn',
          blame: matches.target,
          text: matches.ability,
        };
      },
    },
    {
      id: 'SephirotEX Fiendish Wail Green',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '76A3', source: 'Sephirot' }),
      condition: (data, matches) => data?.force?.[matches.target] === '3EE',
      mistake: (_data, matches) => {
        return {
          type: 'fail',
          blame: matches.target,
          text: matches.ability,
        };
      },
    },
    {
      // Only tanks or Blue Mages should take towers without a Force debuff.
      id: 'SephirotEX Fiendish Wail Non-Tank',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '76A3', source: 'Sephirot' }),
      condition: (data, matches) => {
        if (data.party.isTank(matches.target) || data.job === 'BLU')
          return false;
        return data?.force?.[matches.target] === undefined;
      },
      mistake: (_data, matches) => {
        return {
          type: 'fail',
          blame: matches.target,
          text: matches.ability,
        };
      },
    },
    {
      // Taking a tether while under Force Against Might (orange) kills the target
      id: 'SephirotEX Tether Da\'at',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '76A1', source: 'Sephirot' }),
      condition: (data, matches) => data?.force?.[matches.target] === '3ED',
      mistake: (_data, matches) => {
        return {
          type: 'fail',
          blame: matches.target,
          text: matches.ability,
        };
      },
    },
  ],
};

export default triggerSet;
