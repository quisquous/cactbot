import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export interface Data extends OopsyData {
  force?: { [name: string]: string };
}

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.ContainmentBayS1T7Extreme,
  damageWarn: {
    'SephirotEX Yesod': '157E', // Snapshot floor spikes
    'SephirotEX Ain': '1569', // Half-arena baited frontal
    'SephirotEX Ein Sof': '156F', // Expanding green puddles
    'SephirotEX Fiendish Wail': '1577', // Raidwide if tower is missed
  },
  damageFail: {
    'SephirotEX Pillar Of Mercy': '1581', // Standing in the blue puddles
    'SephirotEX Storm Of Words Revelation': '1583', // Missing the enrage on Storm of Words
  },
  shareWarn: {
    'SephirotEX Triple Trial': '1566', // Instant tank cleave
    'SephirotEX Ratzon Green': '156B', // Small green spread circle
    'SephirotEX Ratzon Purple': '156C', // Large purple spread circle
    'SephirotEX Earth Shaker': '157D',
    'SephirotEX Spread Da\'at': '1573',
  },
  soloWarn: {
    'SephirotEX Fiendish Rage': '156D', // Stack markers, phase 1
  },
  triggers: [
    {
      // Pillar of Mercy,  Malkuth, and Pillar of Severity
      id: 'SephirotEX Knockbacks',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: ['1580', '1582', '1586'], source: 'Sephirot' }),
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
      netRegex: NetRegexes.ability({ id: '157B', source: 'Sephirot' }),
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
      netRegex: NetRegexes.ability({ id: '157A', source: 'Sephirot' }),
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
      netRegex: NetRegexes.ability({ id: '1576', source: 'Sephirot' }),
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
      // Only tanks or Blue Mages should take towers without a Force debuff.
      id: 'SephirotEX Fiendish Wail Non-Tank',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '1576', source: 'Sephirot' }),
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
      netRegex: NetRegexes.ability({ id: '1574', source: 'Sephirot' }),
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
