// Byakko Extreme
[{
  zoneRegex: /^The Jade Stoa \(Extreme\)$/,
  timelineFile: 'byakko-ex.txt',
  triggers: [
    {
      id: 'ByaEx Heavenly Strike',
      regex: / 14:27DA:Byakko starts using Heavenly Strike on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me)
          return 'Tank Buster on YOU';
        if (data.role == 'healer')
          return 'Buster on ' + data.ShortName(matches[1]);
      },
      tts: function(data, matches) {
        if (matches[1] == data.me)
          return 'buster';
      },
    },
    {
      id: 'ByaEx Flying Donut',
      regex: / 14:27F4:Byakko starts using Sweep The Leg/,
      alertText: function(data, matches) {
        return 'Get Inside';
      },
      tts: 'inside',
    },
    {
      id: 'ByaEx Sweep The Leg',
      regex: / 14:27DB:Byakko starts using Sweep The Leg/,
      alertText: function(data, matches) {
        return 'Get Behind';
      },
      tts: 'behind',
    },
    {
      id: 'ByaEx Storm Pulse',
      regex: / 14:27DC:Byakko starts using Storm Pulse/,
      infoText: function(data, matches) {
        if (data.role == 'healer')
          return 'AOE';
      },
      tts: 'aoe',
    },
    {
      id: 'ByaEx Distant Clap',
      regex: / 14:27DD:Byakko starts using Distant Clap on Byakko/,
      alertText: function(data, matches) {
        return 'Distant Clap';
      },
      tts: 'clap',
    },
    {
      id: 'ByaEx State Of Shock Tank 1',
      regex: / 14:27E0:Byakko starts using State Of Shock on (\y{Name})/,
      condition: function(data, matches) { return data.role == 'tank' && matches[1] != data.me; },
      alertText: 'Provoke Boss',
      tts: 'Provoke',
    },
    {
      id: 'ByaEx State Of Shock Tank 2',
      regex: / 14:27E0:Byakko starts using State Of Shock on (\y{Name})/,
      delaySeconds: 12,
      condition: function(data, matches) { return data.role == 'tank' && matches[1] == data.me; },
      alertText: 'Provoke Boss',
      tts: 'Provoke',
    },
    {
      regex: / 14:27F9:Hakutei starts using The Roar Of Thunder/,
      run: function(data) {
        data.roarCount = data.roarCount || 0;
        data.roarCount += 1;
      },
    },
    {
      id: 'ByaEx Roar of Thunder',
      regex: / 14:27F9:Hakutei starts using The Roar Of Thunder/,
      delaySeconds: 14,
      alarmText: function(data) {
        if (data.roarCount != 2)
          return;
        if (data.role == 'tank')
          return 'Tank LB Now';
      },
      tts: function(data) {
        if (data.roarCount != 2)
          return;
        if (data.role == 'tank')
          return 'tank lb now';
      },
    },
    {
      id: 'ByaEx Bubble',
      regex: /1B:........:(\y{Name}):....:....:0065:0000:0000:0000:/,
      condition: function(data, matches) { return matches[1] == data.me; },
      infoText: function(data) {
        return 'Drop Bubble Outside';
      },
      tts: 'drop outside',
    },
    {
      id: 'ByaEx Ominous Wind',
      regex: /1A:(\y{Name}) gains the effect of Ominous Wind/,
      condition: function(data, matches) { return matches[1] == data.me; },
      infoText: function(data) {
        return 'Pink Bubble';
      },
      tts: 'bubble',
    },
    {
      id: 'ByaEx Puddle Marker',
      regex: /1B:........:(\y{Name}):....:....:0004:0000:0000:0000:/,
      condition: function(data, matches) { return matches[1] == data.me; },
      alarmText: function(data) {
        return 'Puddles on YOU';
      },
      tts: 'puddles',
    },
    {
      id: 'ByaEx G100',
      regex: /1B:........:(\y{Name}):....:....:0057:0000:0000:0000:/,
      condition: function(data, matches) { return matches[1] == data.me; },
      infoText: function(data) {
        return 'Get Away';
      },
      tts: 'get away',
    },
    {
      id: 'ByaEx Tiger Add',
      regex: / 00:0044:Twofold is my wrath, twice-cursed my foes!/,
      infoText: function(data) {
        if (data.role == 'tank')
          return 'Tiger Add';
      },
      tts: 'tiger add',
    },
    {
      regex: / 14:27E2:Byakko starts using Highest Stakes/,
      run: function(data) {
        data.stakeCount = data.stakeCount || 0;
        data.stakeCount += 1;
      },
    },
    {
      regex: / 14:27E2:Byakko starts using Highest Stakes/,
      delaySeconds: 20,
      run: function(data) {
        delete data.stakeCount;
      },
    },
    {
      id: 'ByaEx Highest Stakes',
      regex: / 14:27E2:Byakko starts using Highest Stakes/,
      infoText: function(data) {
        return 'Stack #' + data.stakeCount;
      },
      tts: function(data) {
        return 'stack ' + data.stakeCount;
      },
    },
  ]
}]
