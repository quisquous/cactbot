'use strict';

[{
  zoneRegex: /(Eureka Hydatos|Unknown Zone \(33B\))/,
  timelineFile: 'eureka_hydatos.txt',
  resetWhenOutOfCombat: false,
  timelineTriggers: [
    {
      id: 'BA Art Geas',
      regex: /Legendary Geas/,
      beforeSeconds: 0,
      infoText: {
        en: 'Stop Moving',
      },
    },
    {
      id: 'BA Raiden Levinwhorl',
      regex: /Levinwhorl/,
      beforeSeconds: 10,
      alertText: {
        en: 'Shields and Mitigation',
      },
    },
    {
      id: 'BA AV Eurekan Potion',
      regex: /Explosive Impulse/,
      beforeSeconds: 10,
      suppressSeconds: 60,
      infoText: {
        en: 'Pop Eurekan Potions',
      },
    },
    {
      id: 'BA Ozma Black Hole Warning',
      regex: /Black Hole/,
      beforeSeconds: 12,
      infoText: {
        en: 'Black Hole Soon',
      },
    },
  ],
  triggers: [
    {
      id: 'Eureka Hydatos Falling Asleep',
      regex: /00:0039:5 minutes have elapsed since your last activity./,
      regexDe: /00:0039:Seit deiner letzten Aktivität sind 5 Minuten vergangen./,
      regexFr: /00:0039:Votre personnage est inactif depuis 5 minutes/,
      alarmText: {
        en: 'WAKE UP',
        de: 'AUFWACHEN',
        fr: 'REVEILLES TOI',
      },
    },
    {
      id: 'Eureka Saved By Rememberance',
      regex: /00:0a39:The memories of heroes past live on again/,
      sound: 'Long',
    },
    {
      id: 'BA Seal',
      regex: /00:0839:.*will be sealed off/,
      run: function(data) {
        data.sealed = true;
      },
    },
    {
      id: 'BA Clear Data',
      regex: /00:0839:.*is no longer sealed/,
      run: function(data) {
        delete data.side;
        delete data.mythcall;
        delete data.clones;
        delete data.bracelets;
        delete data.sealed;
        delete data.blackHoleCount;
        delete data.seenHostile;
      },
    },
    {
      id: 'BA West Side',
      regex: / 15:\y{ObjectId}:Art:3956:[^:]*:\y{ObjectId}:[^:]/,
      suppressSeconds: 1000,
      run: function(data) {
        data.side = 'west';
      },
    },
    {
      id: 'BA East Side',
      regex: / 15:\y{ObjectId}:Owain:3957:[^:]*:\y{ObjectId}:[^:]/,
      suppressSeconds: 1000,
      run: function(data) {
        data.side = 'east';
      },
    },
    {
      id: 'BA Art Mythcall',
      regex: / 14:3927:Art starts using (?:Mythcall|Unknown_3927)/,
      condition: function(data) {
        return data.side == 'west';
      },
      run: function(data) {
        data.mythcall = true;
      },
    },
    {
      id: 'BA Art Tankbuster',
      regex: / 14:3934:Art starts using (?:Thricecull|Unknown_3934) on (\y{Name})/,
      condition: function(data) {
        return data.side == 'west';
      },
      alarmText: function(data, matches) {
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
      tts: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'buster',
            de: 'basta',
            fr: 'tankbuster',
          };
        }
      },
    },
    {
      id: 'BA Art Orb Marker',
      regex: / 1B:........:(\y{Name}):....:....:005C:/,
      condition: function(data) {
        return data.side == 'west';
      },
      alarmText: function(data, matches) {
        if (data.me != matches[1])
          return;
        return {
          en: 'Orb on YOU',
        };
      },
      alertText: function(data, matches) {
        if (data.me == matches[1])
          return;
        return {
          en: 'Away From Orb Marker',
        };
      },
    },
    {
      id: 'BA Art Piercing Dark Marker',
      regex: / 1B:........:(\y{Name}):....:....:008B:/,
      condition: function(data, matches) {
        return data.side == 'west' && data.me == matches[1];
      },
      alertText: {
        en: 'Spread Marker',
      },
    },
    {
      id: 'BA Art Legendcarver',
      regex: / 14:3928:Art starts using (?:Legendcarver|Unknown_3928)/,
      condition: function(data) {
        return data.side == 'west';
      },
      infoText: {
        en: 'Out',
      },
    },
    {
      id: 'BA Art Legendspinner',
      regex: / 14:3929:Art starts using (?:Legendspinner|Unknown_3929)/,
      condition: function(data) {
        return data.side == 'west';
      },
      infoText: {
        en: 'In',
      },
    },
    {
      id: 'BA Art Mythcall Legendcarver',
      regex: / 14:3928:Art starts using (?:Legendcarver|Unknown_3928)/,
      condition: function(data) {
        return data.side == 'west' && data.mythcall;
      },
      delaySeconds: 3.5,
      infoText: {
        en: 'Under Boss',
      },
    },
    {
      id: 'BA Art Mythcall Legendspinner',
      regex: / 14:3929:Art starts using (?:Legendspinner|Unknown_3929)/,
      condition: function(data) {
        return data.side == 'west' && data.mythcall;
      },
      delaySeconds: 3.5,
      infoText: {
        en: 'Under Spears',
      },
    },
    {
      id: 'BA Owain Tankbuster',
      regex: / 14:3945:Owain starts using (?:Thricecull|Unknown_3945) on (\y{Name})/,
      condition: function(data) {
        return data.side == 'west';
      },
      alarmText: function(data, matches) {
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
      tts: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'buster',
            de: 'basta',
            fr: 'tankbuster',
          };
        }
      },
    },
    {
      id: 'BA Owain Piercing Light Marker',
      regex: / 1B:........:(\y{Name}):....:....:008B:/,
      condition: function(data, matches) {
        return data.side == 'east' && data.me == matches[1];
      },
      infoText: {
        en: 'Spread Marker',
      },
    },
    {
      id: 'BA Owain Dorito Stack',
      regex: / 1B:........:(\y{Name}):....:....:008B:/,
      condition: function(data, matches) {
        return data.side == 'east' && data.me == matches[1];
      },
      alarmText: {
        en: 'Dorito Stack',
      },
    },
    {
      id: 'BA Owain Fire Element',
      regex: / 00:0044:Munderg, turn flesh to ash/,
      condition: function(data, matches) {
        return data.side == 'east';
      },
      alertText: {
        en: 'Get to Ice',
      },
      infoText: {
        en: 'Switch Magia',
      },
    },
    {
      id: 'BA Owain Ice Element',
      regex: / 00:0044:Munderg, turn blood to ice/,
      condition: function(data, matches) {
        return data.side == 'east';
      },
      alertText: {
        en: 'Get to Fire',
      },
      infoText: {
        en: 'Switch Magia',
      },
    },
    {
      id: 'BA Owain Ivory Palm',
      regex: / 16:\y{ObjectId}:Ivory Palm:3941:[^:]*:y{ObjectId}:(\y{Name}):/,
      condition: function(data, matches) {
        return data.side == 'east' && data.me == matches[1];
      },
      alarmText: {
        en: 'Dorito Stack',
      },
    },
    {
      id: 'BA Owain Pitfall',
      regex: / 14:394D:Owain starts using (?:Pitfall|Unknown_394D)/,
      condition: function(data) {
        return data.side == 'east';
      },
      alertText: {
        en: 'Get Out To Edges',
      },
    },
    {
      id: 'BA Silence Centaur',
      regex: / 14:3BFE:Arsenal Centaur starts using (?:Berserk|Unknown_3Bfe)/,
      condition: function(data) {
        return data.job == 'WHM' || data.job == 'BLM';
      },
      alertText: {
        en: 'Sleep Centaur',
      },
    },
    {
      id: 'BA Raiden Tankbuster',
      regex: / 14:387B:Raiden starts using (?:Shingan|Unknown_387B) on (\y{Name})/,
      condition: function(data) {
        return data.sealed;
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
      tts: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'buster',
            de: 'basta',
            fr: 'tankbuster',
          };
        }
      },
    },
    {
      id: 'BA Raiden Lancing Bolt',
      regex: / 1B:........:(\y{Name}):....:....:008A:/,
      condition: function(data, matches) {
        return data.sealed && data.me == matches[1];
      },
      alarmText: {
        en: 'Spread',
      },
    },
    {
      id: 'BA Raiden Ame',
      regex: / 14:3868:Raiden starts using/,
      condition: function(data) {
        return data.sealed;
      },
      alertText: {
        en: 'Get Far Away',
      },
    },
    {
      id: 'BA Raiden Whirling',
      regex: / 14:386A:Raiden starts using (?:Whirling Zantetsuken|Unknown_386A)/,
      condition: function(data) {
        return data.sealed;
      },
      alertText: {
        en: 'Under',
      },
    },
    {
      id: 'BA Raiden For Honor',
      regex: / 14:387C:Raiden starts using (?:For Honor|Unknown_387C)/,
      condition: function(data) {
        return data.sealed;
      },
      alertText: {
        en: 'Get Out',
      },
    },
    {
      id: 'BA Raiden Lateral 1',
      regex: / 14:386C:Raiden starts using (?:Lateral Zantetsuken|Unknown_386C) on (\y{Name})/,
      condition: function(data) {
        return data.sealed;
      },
      alertText: {
        en: 'LEFT',
      },
    },
    {
      id: 'BA Raiden Lateral 2',
      regex: / 14:386B:Raiden starts using (?:Lateral Zantetsuken|Unknown_386B) on (\y{Name})/,
      condition: function(data) {
        return data.sealed;
      },
      alertText: {
        en: 'RIGHT',
      },
    },
    {
      id: 'BA AV Tankbuster',
      regex: / 14:379A:Absolute Virtue starts using (?:Auroral Wind|Unknown_379A) on (\y{Name})/,
      condition: function(data) {
        return data.sealed;
      },
      alertText: function(data, matches) {
        if (matches[1] != data.me)
          return;
        return {
          en: 'Tank Buster on YOU',
          de: 'Tankbuster auf DIR',
          fr: 'Tankbuster sur VOUS',
        };
      },
      infoText: function(data, matches) {
        if (matches[1] == data.me)
          return;
        return {
          en: 'Away from ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'BA AV Eidos Dark Bracelets',
      regex: /14:3787:Absolute Virtue starts using (?:Eidos|Unknown_3787)/,
      condition: function(data) {
        return data.sealed;
      },
      infoText: {
        en: 'Dark Bracelets',
      },
      run: function(data) {
        data.bracelets = 'dark';
      },
    },
    {
      id: 'BA AV Eidos Light Bracelets',
      regex: /14:3786:Absolute Virtue starts using (?:Eidos|Unknown_3786)/,
      condition: function(data) {
        return data.sealed;
      },
      infoText: {
        en: 'Light Bracelets',
      },
      run: function(data) {
        data.bracelets = 'light';
      },
    },
    {
      id: 'BA AV Eidos Hostile Aspect',
      regex: /14:378B:Absolute Virtue starts using (?:Hostile Aspect|Unknown_378B)/,
      condition: function(data) {
        return data.sealed;
      },
      alertText: function(data) {
        if (!data.seenHostile) {
          if (data.bracelets == 'light') {
            return {
              en: 'Away From Light Circles',
            };
          }
          if (data.bracelets == 'dark') {
            return {
              en: 'Away From Dark Circles',
            };
          }
          return;
        }
        if (data.bracelets == 'light') {
          return {
            en: 'Stand By Dark Circles',
          };
        }
        if (data.bracelets == 'dark') {
          return {
            en: 'Stand By Light Circles',
          };
        }
      },
      run: function(data) {
        data.seenHostile = true;
      },
    },
    {
      id: 'BA AV Eidos Impact Stream',
      regex: /14:3788:Absolute Virtue starts using (?:Impact Stream|Unknown_3788)/,
      condition: function(data) {
        return data.sealed;
      },
      alertText: function(data) {
        if (data.bracelets == 'light') {
          return {
            en: 'Dark',
          };
        }
        if (data.bracelets == 'dark') {
          return {
            en: 'Light',
          };
        }
      },
    },
    {
      id: 'BA AV Eidos Relative Virtue Colors',
      regex: /00:332e:Relative Virtue gains the effect of (Astral|Umbral) Essence/,
      condition: function(data) {
        return data.sealed;
      },
      run: function(data, matches) {
        // RV clones get buffs in the reverse order that they do their attacks in.
        data.clones = data.clones || [];
        data.clones.push(matches[1]);
      },
    },
    {
      id: 'BA AV Triple Impact Stream',
      regex: /14:3797:Absolute Virtue starts using/,
      condition: function(data) {
        return data.sealed;
      },
      alertText: function(data, matches) {
        if (!data.clones)
          return;
        let wrists = data.clones.pop();
        if (wrists == 'Astral') {
          return {
            en: 'Dark',
          };
        }
        if (wrists == 'Umbral') {
          return {
            en: 'Light',
          };
        }
      },
    },
    {
      id: 'BA AV Eidos Turbulent Aether',
      regex: /15:\y{ObjectId}:Absolute Virtue:3790:/,
      condition: function(data) {
        return data.sealed;
      },
      infoText: {
        en: 'Orbs to Opposite Colors',
      },
    },
    {
      id: 'BA AV Call Wyvern',
      regex: /15:\y{ObjectId}:Absolute Virtue:3798:/,
      condition: function(data) {
        return data.sealed;
      },
      infoText: {
        en: 'Kill Wyverns, Switch Magia',
      },
    },
    {
      id: 'BA Ozma Sphere Form',
      regex: /:Proto Ozma:(?:37B3|37A5|379F):/,
      condition: function(data) {
        return data.sealed;
      },
      preRun: function(data) {
        data.blackHoleCount = data.blackHoleCount || 0;
        data.blackHoleCount++;
      },
      alarmText: function(data) {
        return {
          en: 'Black Hole ' + data.blackHoleCount + ' / 6',
        };
      },
      tts: function(data) {
        return {
          en: 'Black Hole ' + data.blackHoleCount,
        };
      },
    },
    // FIXME: on all these forms, most of the time they come with double mechanics,
    // so probably need some "Then," text so folks don't leave the first mechanic early.
    // FIXME: random shade mechanic mid ozma form comes with holy/acceleration bomb/knockback
    // so call out something like "get off + holy" or "get knocked in".
    // FIXME: need callouts for knockback, and maybe "holy soon"?
    {
      id: 'BA Ozma Pyramid Form',
      regex: /:Proto Ozma:37A4:/,
      condition: function(data) {
        return data.sealed;
      },
      alertText: {
        en: 'Off the Platform',
      },
    },
    {
      id: 'BA Ozma Pyramid Form 2',
      regex: /:Proto Ozma:37A4:/,
      delaySeconds: 9,
      condition: function(data) {
        return data.sealed;
      },
      infoText: {
        en: 'Spread for Bleed',
      },
    },
    {
      id: 'BA Ozma Star Form',
      regex: /:Proto Ozma:37B2:/,
      condition: function(data) {
        return data.sealed;
      },
      alertText: {
        en: 'Go Far',
      },
    },
    {
      id: 'BA Ozma Star Form 2',
      regex: /:Proto Ozma:37B2:/,
      delaySeconds: 9,
      condition: function(data) {
        return data.sealed;
      },
      infoText: function(data) {
        // FIXME: taking multiple autos probably means tanking,
        // so probably could figure this out automatically.
        if (data.role == 'tank') {
          return {
            en: 'Stack (if not tanking)',
          };
        }
        return {
          en: 'Stack Up',
        };
      },
    },
    {
      id: 'BA Ozma Cube Form',
      regex: /:Proto Ozma:379E:/,
      condition: function(data) {
        return data.sealed;
      },
      alertText: {
        en: 'Get Close',
      },
    },
    {
      id: 'BA Ozma Cube Form 2',
      regex: /:Proto Ozma:379E:/,
      delaySeconds: 9,
      condition: function(data) {
        return data.sealed;
      },
      alertText: function(data) {
        // FIXME: taking multiple autos probably means tanking,
        // so probably could figure this out automatically.
        if (data.role == 'tank') {
          return {
            en: 'Offtanks Get Orbs',
          };
        }
      },
      infoText: function(data) {
        if (data.role != 'tank') {
          return {
            en: 'Stack Away From Tank',
          };
        }
      },
    },
    {
      id: 'BA Ozma Pyramid Shade',
      regex: /:Ozmashade:37A4:/,
      condition: function(data) {
        return data.sealed;
      },
      suppressSeconds: 1,
      alertText: {
        en: 'Get Off',
      },
    },
    {
      id: 'BA Ozma Star Shade',
      regex: /:Ozmashade:37B2:/,
      condition: function(data) {
        return data.sealed;
      },
      suppressSeconds: 1,
      alertText: {
        en: 'Get Close',
      },
    },
    {
      id: 'BA Ozma Cube Shade',
      regex: /:Ozmashade:379E:/,
      condition: function(data) {
        return data.sealed;
      },
      suppressSeconds: 1,
      alertText: {
        en: 'Go Far',
      },
    },
    {
      id: 'BA Ozma Adds',
      regex: /:Cloudlarker:37B0:/,
      delaySeconds: 2,
      condition: function(data) {
        return data.sealed;
      },
      suppressSeconds: 1,
      infoText: {
        en: 'Kill Adds',
      },
    },
    {
      id: 'BA Ozma Acceleration Bomb',
      regex: / 16:\y{ObjectId}:Proto Ozma:37AA:[^:]*:\y{ObjectId}:(\y{Name}):/,
      condition: function(data, matches) {
        return data.sealed && data.me == matches[1];
      },
      alarmText: {
        en: 'Stop Soon',
      },
    },
    {
      id: 'BA Ozma Meteor',
      regex: / 1B:........:(\y{Name}):....:....:0039:/,
      condition: function(data, matches) {
        return data.sealed && data.me == matches[1];
      },
      alarmText: {
        en: 'Meteor on YOU',
      },
    },
  ],
}];
