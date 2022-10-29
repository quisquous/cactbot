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
    'SephirotUn Yesod': '76AB', // Snapshot floor spikes
    'SephirotUn Ain': '7696', // Half-arena baited frontal
    'SephirotUn Ein Sof': '769C', // Expanding green puddles
    'SephirotUn Fiendish Wail': '76A4', // Raidwide if tower is missed
  },
  damageFail: {
    'SephirotUn Pillar Of Mercy': '76AE', // Standing in the blue puddles
    'SephirotUn Storm Of Words Revelation': '7680', // Missing the enrage on Storm of Words
  },
  shareWarn: {
    'SephirotUn Triple Trial': '7693', // Instant tank cleave
    'SephirotUn Ratzon Green': '7698', // Small green spread circle
    'SephirotUn Ratzon Purple': '7699', // Large purple spread circle
    'SephirotUn Earth Shaker': '7688',
    'SephirotUn Spread Da\'at': '76A0',
  },
  soloWarn: {
    'SephirotUn Fiendish Rage': '769A', // Stack markers, phase 1
  },
  triggers: [
    {
      // Pillar of Mercy,  Malkuth, and Pillar of Severity
      id: 'SephirotUn Knockbacks',
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
      id: 'SephirotUn Force Against Gain',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['3ED', '3EE'] }),
      run: (data, matches) => {
        data.force ??= {};
        data.force[matches.target] = matches.effectId;
      },
    },
    {
      id: 'SephirotUn Force Against Lose',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: ['3ED', '3EE'] }),
      run: (data, matches) => {
        data.force ??= {};
        delete data.force[matches.target];
      },
    },
    {
      id: 'SephirotUn Spirit',
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
      id: 'SephirotUn Life Force',
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
      id: 'SephirotUn Fiendish Wail Green',
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
      id: 'SephirotUn Fiendish Wail Non-Tank',
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
      id: 'SephirotUn Tether Da\'at',
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
