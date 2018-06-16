'use strict';

// Susano Extreme
[{
  zoneRegex: /^The Pool Of Tribute \(Extreme\)$/,
  timelineFile: 'susano-ex.txt',
  timelineTriggers: [
    {
      id: 'SusEx Cloud',
      regex: /Knockback \(cloud\)/,
      beforeSeconds: 1.5,
      infoText: {
        en: 'look for cloud',
      },
    },
  ],
  triggers: [
    { // Thundercloud tracker
      regex: /:Added new combatant Thunderhead\./,
      regexDe: /:Added new combatant Gewitterwolke\./,
      run: function(data) {
        data.cloud = true;
      },
    },
    { // Thundercloud tracker
      // Stop tracking the cloud after it casts lightning instead of
      // when it disappears.  This is because there are several
      // levinbolts with the same cloud, but only one levinbolt has
      // lightning attached to it.
      regex: /:Thunderhead starts using The Parting Clouds on Thunderhead\./,
      regexDe: /:Gewitterkopf starts using Wolkenriss on Gewitterkopf\./,
      run: function(data) {
        data.cloud = false;
      },
    },
    { // Churning tracker
      regex: /:\y{Name} gains the effect of Churning from Susano/,
      regex: /:\y{Name} gains the effect of Schäumend from Susano/,
      condition: function(data) {
        return !data.churning;
      },
      run: function(data) {
        data.churning = true;
      },
    },
    { // Churning tracker
      // We could track the number of people with churning here, but
      // that seems a bit fragile.  This might not work if somebody dies
      // while having churning, but is probably ok in most cases.
      regex: /:\y{Name} loses the effect of Churning from Susano\./,
      regexDe: /:\y{Name} loses the effect of Schäumend from Susano\./,
      condition: function(data) {
        return data.churning;
      },
      run: function(data) {
        data.churning = false;
      },
    },
    {
      id: 'SusEx Tankbuster',
      regex: /:Susano readies Stormsplitter\./,
      regexDe: /:Susano readies Sturmspalter\./,
      alertText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Tank Swap',
            de: 'Tank Wechsel',
          };
        }
        return false;
      },
      infoText: function(data) {
        if (data.role == 'healer') {
          return {
            en: 'Tank Buster',
            de: 'Tank Buster',
          };
        }
        return false;
      },
      tts: function(data) {
        if (data.role == 'tank' || data.role == 'healer') {
          return {
            en: 'tank buster',
            de: 'tenkbasta',
          };
        }
      },
    },
    { // Red knockback marker indicator
      id: 'SusEx Knockback',
      regex: /1B:........:(\y{Name}):....:....:0017:0000:0000:0000:/,
      condition: function(data, matches) {
        return (matches[1] == data.me);
      },
      alertText: function(data) {
        if (data.cloud) {
          return {
            en: 'Knockback on you (cloud)',
            de: 'Rückstoss auf Dir (Wolke)',
          };
        } else if (data.churning) {
          return {
            en: 'Knockback + dice (STOP)',
            de: 'Rückstoss + Würfel (STOPP)',
          };
        }
        return {
          en: 'Knockback on YOU',
          de: 'Rückstoß auf DIR',
        };
      },
      tts: function(data) {
        if (data.cloud) {
          return {
            en: 'knockback with cloud',
            de: 'Rückstoß mit wolke',
          };
        } else if (data.churning) {
          return {
            en: 'Knockback with dice',
            de: 'Rückstoß mit Würfel',
          };
        }
        return {
          en: 'Knockback',
          de: 'Rückstoß',
        };
      },
    },
    { // Levinbolt indicator
      id: 'SusEx Levinbolt',
      regex: /1B:........:(\y{Name}):....:....:006E:0000:0000:0000:/,
      condition: function(data, matches) {
        return (matches[1] == data.me);
      },
      alertText: function(data) {
        if (data.cloud) {
          return {
            en: 'Levinbolt on you (cloud)',
            de: 'Blitz auf Dir (Wolke)',
          };
        }
        return {
          en: 'Levinbolt on you',
          de: 'Blitz auf dir',
        };
      },
      tts: function(data) {
        if (data.cloud) {
          return {
            en: 'bolt with cloud',
            de: 'blitz mit wolke',
          };
        }
        return {
          en: 'bolt',
          de: 'blitz',
        };
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
        if (data.role == 'tank') {
          return {
            en: 'Stun: ' + matches[1],
            de: 'Paralyse ' + matches[1],
          };
        }
      },
    },
    { // Churning (dice)
      id: 'SusEx Churning',
      regex: /:(\y{Name}) gains the effect of Churning from .*? for (\y{Float}) Seconds/,
      delaySeconds: function(data, matches) {
        return parseFloat(matches[2]) - 3;
      },
      alertText: {
        en: 'Stop',
        de: 'Stopp',
      },
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
    },
  ],
}];
