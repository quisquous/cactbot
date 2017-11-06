// Susano Extreme
[{
  zoneRegex: /^The Pool Of Tribute \(Extreme\)$/,
  triggers: [
    { // Thundercloud tracker
      regex: /:Added new combatant Thunderhead\./,
      run: function(data) { data.cloud = true; },
    },
    { // Thundercloud tracker
      // Stop tracking the cloud after it casts lightning instead of
      // when it disappears.  This is because there are several
      // levinbolts with the same cloud, but only one levinbolt has
      // lightning attached to it.
      regex: /:Thunderhead starts using The Parting Clouds on Thunderhead\./,
      run: function(data) { data.cloud = false; },
    },
    { // Churning tracker
      regex: /:\y{Name} gains the effect of Churning from Susano/,
      condition: function(data) { return !data.churning; },
      run: function(data) { data.churning = true; },
    },
    { // Churning tracker
      // We could track the number of people with churning here, but
      // that seems a bit fragile.  This might not work if somebody dies
      // while having churning, but is probably ok in most cases.
      regex: /:\y{Name} loses the effect of Churning from Susano\./,
      condition: function(data) { return data.churning; },
      run: function(data) { data.churning = false; },
    },
    {
      id: 'SusEx Tankbuster',
      regex: /:Susano readies Stormsplitter\./,
      alertText: function(data) {
        if (data.role == 'tank')
          return 'Tank Swap';
        return false;
      },
      infoText: function(data) {
        if (data.role == 'healer')
          return 'Tank Buster';
        return false;
      },
      tts: function(data) {
        if (data.role == 'tank' || data.role == 'healer')
          return 'tank buster';
      },
    },
    { // Red knockback marker indicator
      id: 'SusEx Knockback',
      regex: /1B:........:(\y{Name}):....:....:0017:0000:0000:0000:/,
      condition: function(data, matches) { return (matches[1] == data.me); },
      alertText: function(data) {
        if (data.cloud)
          return 'Knockback on you (cloud)';
        else if (data.churning)
          return 'Knockback + dice (STOP)';
        else
          return 'Knockback on you';
      },
      tts: function(data) {
        if (data.cloud)
          return 'knockback with cloud'
        else if (data.churning)
          return 'Knockback with dice';
        else
          return 'Knockback';
      },
    },
    { // Levinbolt indicator
      id: 'SusEx Levinbolt',
      regex: /1B:........:(\y{Name}):....:....:006E:0000:0000:0000:/,
      condition: function(data, matches) { return (matches[1] == data.me); },
      alertText: function(data) {
        if (data.cloud)
          return 'Levinbolt on you (cloud)';
        else
          return 'Levinbolt on you';
      },
      tts: function(data) {
        if (data.cloud)
          return 'bolt with cloud';
        else
          return 'bolt';
      },
    },
    { // Levinbolt indicator debug
      id: 'SusEx Levinbolt Debug',
      regex: /1B:........:(\y{Name}):....:....:006E:0000:0000:0000:/,
      condition: function(data, matches) {
      data.levinbolt = matches[1];
        return (matches[1] != data.me);
      },
    },
    { // Stunning levinbolt indicator
      id: 'SusEx Levinbolt Stun',
      regex: /1B:........:(\y{Name}):....:....:006F:0000:0000:0000:/,
      infoText: function(data, matches) {
        // It's sometimes hard for tanks to see the line, so just give a
        // sound indicator for jumping rope back and forth.
        if (data.role == 'tank')
          return 'Stun: ' + matches[1];
      },
    },
    { // Churning (dice)
      id: 'SusEx Churning',
      regex: /:(\y{Name}) gains the effect of Churning from .*? for ([0-9.]+) Seconds/,
      delaySeconds: function(data, matches) { return parseFloat(matches[2]) - 3; },
      alertText: 'Stop',
      condition: function(data, matches) { return matches[1] == data.me; },
      tts: 'stop',
    },
  ]
}]
