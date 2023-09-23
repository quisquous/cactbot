import NetRegexes from '../../../../resources/netregexes';
import ZoneId from '../../../../resources/zone_id';
import { OopsyData } from '../../../../types/data';
import { OopsyTriggerSet } from '../../../../types/oopsy';

export interface Data extends OopsyData {
  lostFood?: { [name: string]: boolean };
  raiseTracker?: { [targetId: string]: string };
}

// General mistakes; these apply everywhere.
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.MatchAll,
  triggers: [
    {
      // Trigger id for internally generated early pull warning.
      id: 'General Early Pull',
      comment: { cn: '抢开' },
    },
    {
      id: 'General Food Buff',
      comment: { cn: '食物消失' },
      type: 'LosesEffect',
      // Well Fed
      netRegex: NetRegexes.losesEffect({ effectId: '30' }),
      condition: (_data, matches) => {
        // Prevent "Eos loses the effect of Well Fed from Critlo Mcgee"
        return matches.target === matches.source;
      },
      mistake: (data, matches) => {
        data.lostFood ??= {};
        // Well Fed buff happens repeatedly when it falls off (WHY),
        // so suppress multiple occurrences.
        if (!data.inCombat || data.lostFood[matches.target])
          return;
        data.lostFood[matches.target] = true;
        return {
          type: 'warn',
          blame: matches.target,
          reportId: matches.targetId,
          text: {
            en: 'lost food buff',
            de: 'Nahrungsbuff verloren',
            fr: 'Buff nourriture perdue',
            ja: '飯効果が失った',
            cn: '失去食物BUFF',
            ko: '음식 버프 해제',
          },
        };
      },
    },
    {
      id: 'General Well Fed',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '30' }),
      run: (data, matches) => {
        if (!data.lostFood)
          return;
        delete data.lostFood[matches.target];
      },
    },
    {
      id: 'General Rabbit Medium',
      comment: { cn: '兔印' },
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '8E0' }),
      condition: (data, matches) => data.IsPlayerId(matches.sourceId),
      mistake: (_data, matches) => {
        return {
          type: 'warn',
          blame: matches.source,
          reportId: matches.sourceId,
          text: {
            en: 'bunny',
            de: 'Hase',
            fr: 'lapin',
            ja: 'うさぎ',
            cn: '兔子',
            ko: '토끼',
          },
        };
      },
    },
    {
      id: 'General Double Raise',
      type: 'Ability',
      netRegex: NetRegexes.ability({
        id: ['7D', 'AD', 'E13', '1D63', '5EDF', '478D', '7423', '7426'],
      }),
      // 7D = Raise; AD = Resurrection; E13 = Ascend; 1D63 = Verraise; 5EDF = Egeiro; 478D = BLU; 7423, 7426 = Variant
      mistake: (data, matches) => {
        data.raiseTracker ??= {};
        if (data.raiseTracker[matches.targetId]) {
          return {
            type: 'warn',
            blame: matches.source,
            reportId: matches.sourceId,
            text: {
              en: 'double raise',
            },
          };
        }
        data.raiseTracker[matches.targetId] ??= matches.sourceId;
      },
    },
    {
      id: 'General Raise Cleanup',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: '94' }),
      run: (data, matches) => {
        if (data.raiseTracker)
          delete data.raiseTracker[matches.targetId];
      },
    },
  ],
};

export default triggerSet;
