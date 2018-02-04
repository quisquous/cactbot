// O8S - Sigmascape 4.0 Savage
[{
  zoneRegex: /Sigmascape V4\.0 \(Savage\)/,
  timelineFile: 'o8s.txt',
  triggers: [
    {
      id: 'O8S Indolent Will',
      regex: /Graven Image starts using Indolent Will/,
      alertText: 'Look Away From Statue',
      tts: 'look away',
    },
    {
      id: 'O8S Ave Maria',
      regex: /Graven Image starts using Ave Maria/,
      alertText: 'Look At Statue',
      tts: 'look towards',
    },
    {
      id: 'O8S Pasts Forgotten',
      regex: /Kefka starts using Pasts Forgotten/,
      alertText: 'Past: Stack and Stay',
      tts: 'stack and stay',
    },
    {
      id: 'O8S Futures Numbered',
      regex: /Kefka starts using Futures Numbered/,
      alertText: 'Future: Stack and Through',
      tts: 'stack and through',
    },
    {
      id: "O8S Past's End",
      regex: /Kefka starts using Past's End/,
      alertText: 'Past: Run to edge, then through',
      tts: 'run run run',
    },
    {
      id: "O8S Future's End",
      regex: /Kefka starts using Futures Numbered/,
      alertText: 'Future: Face boss out',
      tts: 'stay stay stay',
    },
    {
      id: 'O8S Pulse Wave You',
      regex: /Graven Image starts using Pulse Wave on (\y{Name})/,
      condition: function(data, matches) { return data.me == matches[1]; },
      alertText: 'Knockback on YOU',
      tts: 'knockback',
    },
    {
      id: 'O8S Wings of Destruction',
      regex: /14:2900:Kefka starts using Wings of Destruction/,
      alarmText: function(data) {
        if (data.role == 'tank')
          return 'Wings: Be Near/Far';
      },
      infoText: function(data) {
        if (data.role != 'tank')
          return 'Max Melee: Avoid Tanks';
      },
      tts: function(data) {
        if (data.role == 'tank')
          return 'wings';
        else
          return 'max melee';
      },
    },
    {
      regex: /Graven Image starts using Indulgent Will on (\y{Name})/,
      run: function(data, matches) {
        data.confusedList = data.confusedList || [];
        data.confusedList.push(matches[1]);
      },
    },
    {
      regex: /Graven Image starts using Indulgent Will/,
      delaySeconds: 3,
      run: function(data) {
        delete data.confusedList;
      },
    },
    {
      id: 'O8S Indulgent Will You Confused',
      regex: /Graven Image starts using Indulgent Will on (\y{Name})/,
      condition: function(data, matches) { return data.me == matches[1]; },
      alarmText: 'Confusion on You; Go Outside',
      tts: 'confusion',
    },
    {
      id: 'O8S Indulgent Will Callout',
      regex: /Graven Image starts using Indulgent Will on (\y{Name})/,
      delaySeconds: 0.5,
      infoText: function(data) {
        if (!data.confusedList)
          return;
        var tankHealerOutside;
        if (data.confusedList.indexOf(data.me) >= 0) {
          tankHealerOutside = data.role == 'tank' || data.role == 'healer';
        } else {
          tankHealerOutside = data.role != 'tank' && data.role != 'healer';
        }
        delete data.confusedList;
        return tankHealerOutside ? 'dps inside' : 'dps outside';
      },
    },
  ]
}]
