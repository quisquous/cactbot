'use strict';

// General mistakes; these apply everywhere.
[{
  zoneId: ZoneId.MatchAll,
  triggers: [
    {
      // Trigger id for internally generated early pull warning.
      id: 'General Early Pull',
    },
    {
      id: 'General Food Buff',
      // Well Fed
      netRegex: NetRegexes.losesEffect({ effectId: '48' }),
      condition: function(e, data, matches) {
        // Prevent "Eos loses the effect of Well Fed from Critlo Mcgee"
        return matches.target === matches.source;
      },
      mistake: function(e, data, matches) {
        data.lostFood = data.lostFood || {};
        // Well Fed buff happens repeatedly when it falls off (WHY),
        // so suppress multiple occurrences.
        if (!data.inCombat || data.lostFood[matches.target])
          return;
        data.lostFood[matches.target] = true;
        return {
          type: 'warn',
          blame: matches.target,
          text: {
            en: 'lost food buff',
            de: 'Nahrungsbuff verloren',
            fr: 'Buff nourriture terminée',
            ja: '飯効果が失った',
            cn: '失去食物BUFF',
            ko: '음식 버프 해제',
          },
        };
      },
    },
    {
      id: 'General Well Fed',
      netRegex: NetRegexes.gainsEffect({ effectId: '48' }),
      run: function(e, data, matches) {
        if (!data.lostFood)
          return;
        delete data.lostFood[matches.target];
      },
    },
    {
      id: 'General Rabbit Medium',
      abilityRegex: '8E0',
      condition: function(e, data) {
        return data.IsPlayerId(e.attackerId);
      },
      mistake: function(e, data) {
        return {
          type: 'warn',
          blame: e.attackerName,
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
  ],
}];
