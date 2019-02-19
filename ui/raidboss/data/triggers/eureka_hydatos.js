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
      id: 'BA Clear Data',
      regex: /00:0839:.*is no longer sealed/,
      run: function(data) {
        delete data.side;
        delete data.mythcall;
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
        return data.me == matches[1];
      },
      alarmText: {
        en: 'Spread',
      },
    },
    {
      id: 'BA Raiden Lateral 1',
      regex: / 14:386C:Raiden starts using (?:Lateral Zantetsuken|Unknown_386C) on (\y{Name})/,
      alertText: {
        en: 'LEFT',
      },
    },
    {
      id: 'BA Raiden Lateral 2',
      regex: / 14:386B:Raiden starts using (?:Lateral Zantetsuken|Unknown_386B) on (\y{Name})/,
      alertText: {
        en: 'RIGHT',
      },
    },
    {
      id: 'BA AV Tankbuster',
      regex: / 14:379A:Absolute Virtue starts using (?:Auroral Wind|Unknown_379A) on (\y{Name})/,
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
      alertText: function(data) {
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
    },
    {
      id: 'BA AV Eidos Impact Stream',
      regex: /14:3788:Absolute Virtue starts using (?:Impact Stream|Unknown_3788)/,
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
      run: function(data) {
        // FIXME: It hypothetically is possible that the RV clones get buffs
        // in the same order that they do their attacks in.
        data.clones = data.clones || [];
        data.clones.push(matches[1]);
      },
    },
    {
      id: 'BA AV Eidos Impact Stream',
      regex: /14:3797:Absolute Virtue starts using/,
      alertText: function(data) {
        if (!data.clones)
          return;
        let wrists = data.clones.shift();
        if (data.bracelets == 'Astral') {
          return {
            en: 'Dark??',
          };
        }
        if (data.bracelets == 'Umbral') {
          return {
            en: 'Light??',
          };
        }
      },
    },
    {
      id: 'BA AV Eidos Turbulent Aether',
      regex: /15:\y{ObjectId}:Absolute Virtue:3790:/,
      infoText: {
        en: 'Orbs to Opposite Colors',
      },
    },
    {
      id: 'BA AV Call Wyvern',
      regex: /15:\y{ObjectId}:Absolute Virtue:3798:/,
      infoText: {
        en: 'Kill Wyverns, Switch Magia',
      },
    },

    // FIXME: art spiritcall
  ],
}];
