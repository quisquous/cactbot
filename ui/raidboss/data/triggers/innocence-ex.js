'use strict';

// Innocence Extreme
[{
  zoneRegex: /The Crown Of The Immaculate \(Extreme\)/,
  timelineFile: 'innocence-ex.txt',
  triggers: [
    {
      id: 'InnoEx Starbirth Start',
      regex: /14:3EEF:Innocence starts using Starbirth/,
      run: function(data) {
        data.starbirthCount = data.starbirthCount || 0;
        data.starbirthCount++;
        data.starbirthActive = true;
      },
    },
    {
      id: 'InnoEx Righteous Bolt',
      regex: /14:3ECD:Innocence starts using Righteous Bolt on (\y{Name})/,
      alarmText: function(data, matches) {
        if (matches[1] == data.me || data.role != 'tank')
          return;

        return {
          en: 'Tank Swap!',
          de: 'Tankwechsel!',
          fr: 'Tank swap !',
        };
      },
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'InnoEx Holy Sword Healer',
      regex: /14:3EC9:Forgiven Venery starts using Holy Sword/,
      condition: function(data) {
        return data.role == 'healer';
      },
      suppressSeconds: 5,
      infoText: {
        en: 'Tank Busters',
      },
    },
    {
      id: 'InnoEx Holy Sword Me',
      regex: /14:3EC9:Forgiven Venery starts using Holy Sword on (\y{Name})/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      alertText: {
        en: 'Tank Buster on YOU',
        de: 'Tankbuster auf DIR',
        fr: 'Tankbuster sur VOUS',
      },
    },
    {
      id: 'InnoEx Charge',
      regex: /14:3EEE:Innocence starts using Beatific Vision/,
      alertText: function(data) {
        if (data.starbirthActive) {
          return {
            en: 'Avoid Charge and Orbs',
          };
        }
        return {
          en: 'Avoid Charge',
        };
      },
    },
    {
      id: 'InnoEx Starbirth Avoid',
      regex: /14:3EEF:Innocence starts using Starbirth/,
      delaySeconds: 6,
      condition: function(data) {
        return data.starbirthCount == 1;
      },
      alertText: {
        en: 'Get to Safe Corner',
      },
    },
    {
      id: 'InnoEx Adds',
      regex: /15:\y{ObjectId}:Innocence:42B0:/,
      condition: function(data) {
        return data.role == 'tank';
      },
      infoText: {
        en: 'Grab East/West Venery Adds',
      },
    },
    {
      id: 'InnoEx Light Pillar',
      regex: /15:\y{ObjectId}:Innocence:38FC:[^:]*:\y{ObjectId}:(\y{Name}):/,
      preRun: function(data) {
        data.lightPillar = data.lightPillar || 0;
        data.lightPillar++;
      },
      alarmText: function(data, matches) {
        if (matches[1] != data.me)
          return;

        if (data.lightPillar == 3) {
          return {
            en: 'Aim Line At Back Orb',
          };
        }
        return {
          en: 'Avoid Orbs With Line',
        };
      },
      infoText: function(data, matches) {
        if (matches[1] == data.me)
          return;
        return {
          en: 'Line Stack',
        };
      },
    },
    {
      id: 'InnoEx Starbirth Explode',
      regex: /14:3F3E:Innocence starts using Light Pillar/,
      condition: function(data) {
        return data.lightPillar == 3;
      },
      delaySeconds: 6.5,
      alertText: {
        en: 'Get to Safe Corner',
      },
    },
    {
      id: 'InnoEx Winged Reprobation Tether',
      regex: /1B:\y{ObjectId}:(\y{Name}):....:....:00AC:/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      alertText: {
        en: 'Tether on YOU',
      },
    },
    {
      id: 'InnoEx Winged Drop Of Light',
      regex: /1B:\y{ObjectId}:(\y{Name}):....:....:008A:/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      alertText: function(data, matches) {
        if (data.starbirthActive) {
          return {
            en: 'Circle, Avoid Orbs',
          };
        }
        return {
          en: 'Circle on YOU',
        };
      },
    },
    {
      id: 'InnoEx God Ray',
      regex: /14:3EE[456]:Innocence starts using God Ray/,
      suppressSeconds: 15,
      infoText: {
        en: 'Avoid Swords then Ray',
      },
    },
    {
      id: 'InnoEx Starbirth End 1',
      regex: /14:3EEA:Innocence starts using Shadowreaver/,
      run: function(data) {
        delete data.starbirthActive;
      },
    },
    {
      id: 'InnoEx Starbirth End 2',
      regex: /14:3EEE:Innocence starts using Beatific Vision/,
      run: function(data) {
        delete data.starbirthActive;
      },
    },
  ],
}];
