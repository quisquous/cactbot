'use strict';

// TODO: grand cross "plummet" attacks have locations,
// so it should be possible to tell people where to go.
// This is not true for Mustadio's Maintenance.

[{
  zoneRegex: /^The Orbonne Monastery$/,
  timelineFile: 'orbonne_monastery.txt',
  timelineTriggers: [
    {
      // I know, I know, there's two warnings for this.
      // But like seriously you've got like at least thirty years,
      // and if you do it wrong it wipes the raid.  So... /shrug??
      id: 'Orbonne Agrias Duskblade',
      regex: /Duskblade/,
      beforeSeconds: 15,
      infoText: {
        en: 'Get to your pads',
      },
    },
    {
      id: 'Orbonne Ultima Dominion Tether',
      regex: /Demi-Virgo.*Tether/,
      condition: function(data) {
        return data.role == 'tank';
      },
      alertText: {
        en: 'Pick up tether',
      },
    },
  ],
  triggers: [
    {
      id: 'Orbonne Harpy Devitalize',
      regex: / 14:3778:Harpy starts using Devitalize/,
      suppressSeconds: 10,
      alertText: {
        en: 'Look Away',
      },
    },
    {
      id: 'Orbonne Mustadio Right Handgonne',
      regex: / 14:373E:Mustadio starts using Right Handgonne/,
      infoText: {
        en: 'Left',
      },
    },
    {
      id: 'Orbonne Mustadio Left Handgonne',
      regex: / 14:373F:Mustadio starts using Left Handgonne/,
      infoText: {
        en: 'Right',
      },
    },
    {
      id: 'Orbonne Mustadio Arm Shot',
      regex: / 14:3739:Mustadio starts using Arm Shot on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] != data.me && data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'Orbonne Mustadio Searchlight',
      regex: / 1B:........:(\y{Name}):....:....:00A4:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Searchlight on YOU',
      },
    },
    {
      id: 'Orbonne Spread Marker',
      regex: / 1B:........:(\y{Name}):....:....:008B:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Spread Marker',
      },
    },
    {
      id: 'Orbonne Agrias Thunder Slash',
      regex: / 14:3866:Agrias starts using Thunder Slash on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Cleave on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] != data.me) {
          return {
            en: 'Tank Cleave',
          };
        }
      },
    },
    {
      id: 'Orbonne Agrias Cleansing Strike',
      regex: / 14:3854:Agrias starts using Cleansing Strike/,
      preRun: function(data) {
        data.halidom = [];
      },
      delaySeconds: 50,
      run: function(data) {
        delete data.agriasGhostCleanse;
      },
    },
    {
      id: 'Orbonne Agrias Vacuum',
      regex: / 1B:........:(\y{Name}):....:....:00A5:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      run: function(data) {
        data.agriasGhostCleanse = true;
      },
    },
    {
      id: 'Orbonne Agrias Consecration',
      regex: / 14:3850:Agrias starts using Consecration/,
      condition: function(data) {
        return !data.agriasGhostCleanse;
      },
      infoText: {
        en: 'Pick up swords',
      },
    },
    {
      id: 'Orbonne Agrias Halidom Inside',
      regex: / 15:\y{ObjectId}:Halidom:3851:[^:]*:\y{ObjectId}:(\y{Name})/,
      run: function(data, matches) {
        data.halidom.push(matches[1]);
      },
    },
    {
      id: 'Orbonne Agrias Halidom Outside',
      regex: / 15:\y{ObjectId}:Halidom:3851:/,
      delaySeconds: 0.5,
      suppressSeconds: 10,
      alertText: function(data) {
        if (data.agriasGhostCleanse || data.halidom.indexOf(data.me) >= 0)
          return;
        return {
          en: 'Use Swords On Jails',
        };
      },
    },
    {
      id: 'Orbonne Agrias Hallowed Bolt',
      regex: / 1B:........:(\y{Name}):....:....:00A6:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alarmText: {
        en: 'Go To Center',
      },
    },
    {
      id: 'Orbonne Agrias Adds Phase',
      regex: / 15:\y{ObjectId}:Agrias:385D:/,
      alertText: {
        en: 'Get Shield',
      },
    },
    {
      id: 'Orbonne Agrias Mortal Blow',
      regex: / 14:385E:Sword Knight starts using Mortal Blow/,
      suppressSeconds: 5,
      alertText: {
        en: 'Use Shield, Face Knights',
      },
    },
    {
      id: 'Orbonne Agrias Extra Adds',
      regex: / 03:Added new combatant Emblazoned Shield/,
      suppressSeconds: 10,
      infoText: {
        en: 'Kill shields with sword',
      },
    },
    {
      id: 'Orbonne Agrias Judgment Blade',
      regex: / 14:3857:Agrias starts using Judgment Blade/,
      infoText: {
        en: 'Use shield, face boss',
      },
    },
    {
      id: 'Orbonne Agrias Divine Ruination',
      regex: / 14:3858:Agrias starts using Divine Ruination/,
      infoText: {
        en: 'Use shield if tethered',
      },
    },
    {
      id: 'Orbonne Cid Crush Helm Healer',
      regex: / 14:3752:The Thunder God starts using Crush Helm/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'Tank Buster',
        de: 'Tankbuster',
        fr: 'Tankbuster',
      },
    },
    {
      id: 'Orbonne Cid Crush Helm Feint',
      regex: / 14:3752:The Thunder God starts using Crush Helm/,
      condition: function(data) {
        return data.role == 'dps-melee';
      },
      infoText: {
        en: 'Feint Tank Buster',
      },
    },
    {
      id: 'Orbonne Cid Crush Helm Tank',
      regex: / 15:\y{ObjectId}:The Thunder God:3753:Crush Helm:\y{ObjectId}:(\y{Name}):/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Tank Buster on YOU',
        de: 'Tankbuster auf DIR',
        fr: 'Tankbuster sur VOUS',
      },
    },
    {
      id: 'Orbonne Cid Crush Armor Tank',
      regex: / 14:3758:The Thunder God starts using Crush Armor/,
      condition: function(data, matches) {
        return data.role == 'tank';
      },
      alarmText: {
        en: 'Give Tether Away',
      },
    },
    {
      id: 'Orbonne Cid Crush Armor',
      regex: / 15:\y{ObjectId}:The Thunder God:3759:Crush Armor:\y{ObjectId}:(\y{Name}):/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Give Tether Away',
      },
    },
    {
      id: 'Orbonne Cid Crush Accessory',
      regex: / 14:375A:The Thunder God starts using Crush Accessory/,
      alertText: {
        en: 'Kill Icewolf Adds',
      },
    },
    {
      id: 'Orbonne Cid Cleansing Strike',
      regex: / 16:\y{ObjectId}:The Thunder God:3751:Cleansing Strike:/,
      suppressSeconds: 10,
      condition: function(data) {
        return data.role == 'healer';
      },
      alertText: {
        en: 'Heal To Full',
      },
    },
    {
      id: 'Orbonne Cid Shadowblade Bubble',
      regex: / 14:3761:The Thunder God starts using Duskblade/,
      alertText: {
        en: 'Stand on Pads',
      },
    },
    {
      id: 'Orbonne Cid Shadowblade Bubble',
      regex: / 1B:........:(\y{Name}):....:....:00AA:/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      alertText: {
        en: 'Drop Bubble In Back',
      },
    },
    {
      id: 'Orbonne Cid Hallowed Bolt',
      regex: / 1B:........:(\y{Name}):....:....:0017:/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      alertText: {
        en: 'Bolt on YOU',
      },
    },
    {
      id: 'Orbonne Cid Crush Weapon',
      regex: / 1B:........:(\y{Name}):....:....:005C:/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      alarmText: {
        en: 'GTFO',
      },
    },
    {
      id: 'Orbonne Cid Hallowed Bolt Stack',
      regex: / 1B:........:\y{Name}:....:....:003E:/,
      suppressSeconds: 10,
      infoText: {
        en: 'Stack',
      },
    },
    {
      id: 'Orbonne Cid Divine Ruination',
      regex: / 1B:........:(\y{Name}):....:....:006E:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alarmText: {
        en: 'Point Line Outside',
      },
    },
    {
      id: 'Orbonne Cid Holy Sword In',
      regex: / 14:3750:The Thunder God starts using/,
      alertText: {
        en: 'Get In',
      },
    },
    {
      id: 'Orbonne Cid Holy Sword Out',
      regex: / 14:374F:The Thunder God starts using/,
      alertText: {
        en: 'Get Out',
      },
    },
    {
      id: 'Orbonne Cid Holy Sword Thunder Left',
      regex: / 14:3749:The Thunder God starts using/,
      alertText: {
        en: 'Left',
      },
    },
    {
      id: 'Orbonne Cid Holy Sword Thunder Right',
      regex: / 14:374A:The Thunder God starts using/,
      alertText: {
        en: 'Right',
      },
    },
    {
      id: 'Orbonne Cid Holy Sword Three',
      regex: / 14:374C:The Thunder God starts using/,
      alertText: {
        // e.g. E / NE / NW platforms
        en: 'Avoid Swords Counterclockwise',
      },
    },
    {
      id: 'Orbonne Cid Holy Sword Three',
      regex: / 14:374D:The Thunder God starts using/,
      alertText: {
        // NW / NE / E platforms
        en: 'Avoid Swords Clockwise',
      },
    },
    {
      id: 'Orbonne Ultima Redemption',
      regex: / 14:38AA:Ultima, The High Seraph starts using Redemption on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] != data.me && data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'Orbonne Ultima Dark Cannonade',
      regex: / 1B:........:(\y{Name}):....:....:0037:/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      alertText: {
        en: 'Dorito Stack',
        de: 'Stacken',
        fr: 'Stack',
      },
    },
    {
      id: 'Orbonne Ultima Eruption',
      regex: / 1B:........:(\y{Name}):....:....:0066:/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      alertText: {
        en: 'Eruption on YOU',
      },
    },
    {
      id: 'Orbonne Ultima Flare IV',
      regex: / 1B:........:(\y{Name}):....:....:0057:/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      alarmText: {
        en: 'GTFO',
      },
    },
    {
      id: 'Orbonne Ultima Time Eruption',
      regex: / 14:38CF:Demi-Belias starts using Time Eruption/,
      infoText: {
        en: 'Stand on Slow Clock',
        de: 'In der langsamen Uhr stehen',
        fr: 'Placez-vous sur une horloge lente',
      },
    },
    {
      id: 'Orbonne Ultima Extreme Edge',
      regex: / 14:38DB:Demi-Hashmal starts using Extreme Edge/,
      alertText: {
        en: 'Look for Hashmal dash',
      },
    },
    {
      id: 'Orbonne Ultima Ultimate Illusion Healer',
      regex: /14:3895:Ultima, The High Seraph starts using Ultimate Illusion/,
      condition: function(data) {
        return data.role == 'healer';
      },
      alertText: {
        en: 'Heal Like Whoa',
      },
    },
    {
      id: 'Orbonne Ultima Ultimate Illusion',
      regex: / 15:\y{ObjectId}:Ultima, the High Seraph:3895:Ultimate Illusion:/,
      condition: function(data) {
        return data.role != 'healer';
      },
      // zzz
      delaySeconds: 23.5,
      alertText: {
        en: 'Kill Ruination!',
      },
    },
    {
      id: 'Orbonne Ultima Acceleration Bomb',
      regex: /:(\y{Name}) gains the effect of Acceleration Bomb from .*? for (\y{Float}) Seconds/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      delaySeconds: function(data, matches) {
        return parseFloat(matches[2]) - 1;
      },
      alertText: {
        en: 'stop',
        de: 'Stopp',
      },
    },
  ],
}];
