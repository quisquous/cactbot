'use strict';

// General mistakes; these apply everywhere.
[{
  zoneRegex: /.*/,
  triggers: [
    {
      // Trigger id for internally generated early pull warning.
      id: 'General Early Pull',
    },
    {
      id: 'General Food Buff',
      losesEffectRegex: gLang.kEffect.WellFed,
      condition: function(e, data) {
        // Prevent "Eos loses the effect of Well Fed from Critlo Mcgee"
        return e.targetName == e.attackerName;
      },
      mistake: function(e, data) {
        data.lostFood = data.lostFood || {};
        // Well Fed buff happens repeatedly when it falls off (WHY),
        // so suppress multiple occurrences.
        if (!data.inCombat || data.lostFood[e.targetName])
          return;
        data.lostFood[e.targetName] = true;
        return {
          type: 'warn',
          blame: e.targetName,
          text: {
            en: 'lost food buff',
            fr: 'Buff nourriture terminée',
            de: 'Nahrungsbuff verloren',
            ko: '음식 버프 해제',
            cn: '失去食物BUFF',
          },
        };
      },
    },
    {
      gainsEffectRegex: gLang.kEffect.WellFed,
      run: function(e, data) {
        if (!data.lostFood)
          return;
        delete data.lostFood[e.targetName];
      },
    },
    {
      id: 'General Rabbit Medium',
      abilityRegex: gLang.kAbility.RabbitMedium,
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
            fr: e.abilityName,
            ja: e.abilityName,
            ko: '토끼',
            cn: '兔子',
          },
        };
      },
    },
  ],
}];
