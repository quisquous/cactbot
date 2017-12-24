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
      buffRegex: 'Well Fed',
      mistake: function(e, data) {
        data.lostFood = data.lostFood || {};
        // Well Fed buff happens repeatedly when it falls off (WHY),
        // so suppress multiple occurrences.
        if (!data.inCombat || e.gains || data.lostFood[e.targetName])
          return;
        data.lostFood[e.targetName] = true;
        return { type: 'warn', blame: e.targetName, text: 'lost food buff' };
      },
    },
    {
      buffRegex: 'Well Fed',
      run: function(e, data) {
        if (!e.gains || !data.lostFood)
          return;
        delete data.lostFood[e.targetName];
      },
    },
    {
      id: 'General Rabbit Medium',
      abilityRegex: 'Rabbit Medium',
      mistake: function(e, data) {
        return { type: 'warn', blame: e.attackerName, text: 'bunny' };
      },
    },
    {
      id: 'General Missed Trick',
      damageRegex: 'Trick Attack',
      condition: function(e) {
        // 28710?03 == success
        //   710?03 == failure
        return e.flags.substr(-8, 2) != '28';
      },
      mistake: function(e, data) {
        return { type: 'warn', blame: e.attackerName, text: 'missed trick' };
      },
    },
  ],
}]
