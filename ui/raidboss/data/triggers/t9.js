'use strict';

// TODO: what is that skill that needs to be silenced? earthshock?
// TODO: having a timeline would be super nice here, esp last phase
// TODO: could probably add dragon triggers for final phase too

[{
  zoneRegex: /The Second Coil Of Bahamut - Turn \(4\)/,
  triggers: [
    {
      id: 'T9 Raven Blight You',
      regex: / 1A:(\y{Name}) gains the effect of Raven Blight from Nael Deus Darnus for (\y{Float}) Seconds/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      delaySeconds: function(data, matches) {
        return matches[2] - 5;
      },
      durationSeconds: 5,
      alertText: {
        en: 'Blight on YOU',
      },
    },
    {
      id: 'T9 Raven Blight You',
      regex: / 1A:(\y{Name}) gains the effect of Raven Blight from Nael Deus Darnus for (\y{Float}) Seconds/,
      condition: function(data, matches) {
        return data.me != matches[1];
      },
      delaySeconds: function(data, matches) {
        return matches[2] - 5;
      },
      durationSeconds: 5,
      infoText: function(data, matches) {
        return {
          en: 'Blight on ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'T9 Meteor Stream',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:000[7A9]:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Meteor on YOU',
      },
    },
    {
      id: 'T9 Meteor Stream',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0008:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Meteor Stream',
      },
    },
    {
      id: 'T9 Stack',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:000F:/,
      alertText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Thermo on YOU',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'T9 Earthshock',
      regex: / 14:7F5:Dalamud Spawn starts using Earthshock/,
      alertText: {
        en: 'Silence Blue Golem',
      },
    },
    {
      id: 'T9 Megaflare',
      regex: / 1[56]:\y{ObjectId}:Nael deus Darnus:7E7:Megaflare:/,
      suppressSeconds: 1,
      delaySeconds: 2,
      infoText: {
        en: 'Away From Main Tank',
      },
    },
    {
      id: 'T9 Heavensfall',
      regex: / 14:83B:Nael Deus Darnus starts using Heavensfall/,
      alertText: {
        en: 'Heavensfall',
      },
    },
    {
      id: 'T9 Garotte Twist Gain',
      regex: / 1A:(\y{Name}) gains the effect of Garrote Twist/,
      condition: function(data, matches) {
        return data.me == matches[1] && !data.garotte;
      },
      infoText: {
        en: 'Garotte on YOU',
      },
      run: function(data) {
        data.garotte = true;
      },
    },
    {
      id: 'T9 Ghost Death',
      regex: / 1[56]:\y{ObjectId}:The Ghost of Meracydia:7FA:Neurolink Burst:/,
      condition: function(data) {
        return data.garotte;
      },
      alarmText: {
        en: 'Cleanse Garotte',
      },
    },
    {
      id: 'T9 Garotte Twist Lose',
      regex: / 1E:(\y{Name}) loses the effect of Garrote Twist/,
      run: function(data) {
        delete data.garotte;
      },
    },
    {
      id: 'T9 Final Phase',
      regex: / 14:7E6:Nael Deus Darnus starts using Bahamut's Favor/,
      sound: 'Long',
    },
    {
      id: 'T9 Thunder',
      regex: / 15:\y{ObjectId}:Thunderwing:7FD:Chain Lightning:\y{ObjectId}:(\y{Name}):/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      durationSeconds: 5,
      alarmText: {
        en: 'Thunder Out',
      },
    },
  ],
}];
