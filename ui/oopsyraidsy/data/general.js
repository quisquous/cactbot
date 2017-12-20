// General mistakes; these apply everywhere.
[{
  zoneRegex: /.*/,
  triggers: [
    {
      id: 'General Food Buff',
      buffRegex: 'Well Fed',
      warnText: function(e, data) {
        // Well Fed buff happens repeatedly when it falls off (WHY),
        // so suppress multiple occurrences.
        if (!data.inCombat || e.gains || data.lostFood[e.targetName])
          return;
        data.lostFood[e.targetName] = true;
        return data.ShortName(e.targetName) + ': lost food buff';
      },
    },
    {
      id: 'General Food Buff',
      buffRegex: 'Well Fed',
      run: function(e, data) {
        if (!e.gains)
          return;
        delete data.lostFood[e.targetName];
      },
    },
    {
      id: 'General Rabbit Medium',
      abilityRegex: 'Rabbit Medium',
      warnText: function(e, data) {
        return data.ShortName(e.attackerName) + ': bunny';
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
      warnText: function(e, data) {
        return data.ShortName(e.attackerName) + ': missed trick';
      },
    },
  ],
}]
