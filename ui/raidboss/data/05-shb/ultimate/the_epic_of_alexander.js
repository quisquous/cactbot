'use strict';

[{
  zoneRegex: /^The Epic [Oo]f Alexander \(Ultimate\)$/,
  timelineFile: 'the_epic_of_alexander.txt',
  timelineTriggers: [
    {
      id: 'TEA Fluid Swing',
      regex: /Fluid Swing/,
      beforeSeconds: 5,
      preRun: function(data) {
        data.swingCount = (data.swingCount || 0) + 1;
      },
      alertText: function(data) {
        let multipleSwings = data.swingCount == 2 || data.swingCount == 3;
        if (data.role == 'healer') {
          if (multipleSwings) {
            return {
              en: 'Tank Busters',
              de: 'Tank buster',
              fr: 'Tank busters',
            };
          }
          if (data.mainTank) {
            return {
              en: 'Tank Buster on' + data.ShortName(data.mainTank),
              de: 'Tank buster',
              fr: 'Tank buster',
            };
          }
          return {
            en: 'Tank Buster',
            de: 'Tank buster',
            fr: 'Tank buster',
          };
        }

        if (data.role == 'tank') {
          if (data.me == data.offTank && multipleSwings || data.me == data.mainTank) {
            return {
              en: 'Tank Buster on YOU',
            };
          }
        }
      },
      infoText: function(data) {
        let multipleSwings = data.swingCount == 2 || data.swingCount == 3;
        if (data.role == 'healer')
          return;
        if (data.me == data.offTank && multipleSwings || data.me == data.mainTank)
          return;
        return {
          en: 'Tank Cleave',
        };
      },
    },
  ],
  triggers: [
    {
      id: 'TEA Main Tank',
      regex: Regexes.abilityFull({ source: 'Living Liquid', id: '4978' }),
      run: function(data, matches) {
        data.mainTank = matches.target;
      },
    },
    {
      id: 'TEA Off Tank',
      regex: Regexes.abilityFull({ source: 'Living Liquid', id: '4979' }),
      run: function(data, matches) {
        data.offTank = matches.target;
      },
    },
    {
      id: 'TEA Cascade',
      regex: Regexes.startsUsing({ source: 'Living Liquid', id: '4826', capture: false }),
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'TEA Protean Wave',
      regex: Regexes.startsUsing({ source: 'Living Liquid', id: '4822', capture: false }),
      infoText: {
        en: 'Protean Wave',
      },
    },
    {
      id: 'TEA Drainage Tether',
      regex: Regexes.tether({ source: 'Liquid Rage', id: '0003' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      // Even if folks have the right tethers, this happens repeatedly.
      suppressSeconds: 5,
      alertText: {
        en: 'Drainage tether on YOU',
      },
    },
    {
      id: 'TEA Hand of Pain 5',
      regex: Regexes.startsUsing({ source: 'Living Liquid', id: '482D', capture: false }),
      preRun: function(data) {
        data.handOfPainCount = (data.handOfPainCount || 0) + 1;
      },
      infoText: function(data) {
        if (data.handOfPainCount < 5)
          return;
        return {
          en: 'Focus Living Liquid',
        };
      },
    },
    {
      id: 'TEA Throttle',
      regex: Regexes.gainsEffect({ effect: 'Throttle', capture: false }),
      condition: function(data) {
        return data.CanCleanse();
      },
      suppressSeconds: 1,
      infoText: {
        en: 'Cleanse Throttle',
      },
    },
    {
      id: 'TEA Limit Cut',
      regex: Regexes.headMarker({ id: '00(?:4F|5[0-6])' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: function(data, matches) {
        let number = {
          '004F': 1,
          '0050': 2,
          '0051': 3,
          '0052': 4,
          '0053': 5,
          '0054': 6,
          '0055': 7,
          '0056': 8,
        }[matches.id];
        return '' + number;
      },
    },
    {
      id: 'TEA Compressed Water',
      regex: Regexes.gainsEffect({ target: '(\y{Name})', effect: 'Compressed Water', capture: true }),
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      delaySeconds: 24,
      alertText: {
        en: 'Drop Water',
      },
    },
    {
      id: 'TEA Judgment Nisi A',
      regex: Regexes.gainsEffect({ target: '(\y{Name})', effect: 'Final Judgment: Decree Nisi A', capture: true }),
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      delaySeconds: 32,
      alarmText: {
        en: 'Get Blue Nisi',
      },
    },
    {
      id: 'TEA Judgment Nisi B',
      regex: Regexes.gainsEffect({ target: '(\y{Name})', effect: 'Final Judgment: Decree Nisi B', capture: true }),
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      delaySeconds: 32,
      alarmText: {
        en: 'Get Orange Nisi',
      },
    },
    {
      id: 'TEA Judgment Nisi Γ',
      regex: Regexes.gainsEffect({ target: '(\y{Name})', effect: 'Final Judgment: Decree Nisi Γ', capture: true }),
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      delaySeconds: 32,
      alarmText: {
        en: 'Get Purple Nisi',
      },
    },
    {
      id: 'TEA Judgment Nisi Δ',
      regex: Regexes.gainsEffect({ target: '(\y{Name})', effect: 'Final Judgment: Decree Nisi Δ', capture: true }),
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      delaySeconds: 32,
      alarmText: {
        en: 'Get Green Nisi',
      },
    },
    {
      id: 'TEA Restraining Order',
      regex: Regexes.gainsEffect({ target: '(\y{Name})', effect: 'Restraining Order', capture: true }),
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Far Tethers',
        de: 'Entfernte Verbindungen',
        fr: 'Liens éloignés',
        ja: 'ファー',
        cn: '远离连线',
      },
    },
    {
      id: 'TEA House Arrest',
      regex: Regexes.gainsEffect({ target: '(\y{Name})', effect: 'House Arrest', capture: true }),
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Close Tethers',
        de: 'Nahe Verbindungen',
        fr: 'Liens proches',
        ja: 'ニアー',
        cn: '靠近连线',
      },
    },
    {
      id: 'TEA Chastening Heat',
      regex: Regexes.startsUsing({ source: 'Alexander Prime', id: '4A80', target: '(\y{Name})', capture: true }),
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
  ],
}];
