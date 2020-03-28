'use strict';

[{
  zoneRegex: {
    en: /^Alexander - The Eyes Of The Creator \(Savage\)$/,
    cn: /^亚历山大零式机神城 \(天动之章1\)$/,
  },
  timelineFile: 'a9s.txt',
  timelineTriggers: [
    {
      id: 'A9S Panzerschreck',
      regex: 'Panzerschreck',
      beforeSeconds: 5,
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'A9S Power Generator',
      regex: /Power Generator/,
      infoText: function(data) {
        let nw1_se1 = {
          en: 'Place Generators NW/SE',
        };
        let nw2 = {
          en: 'Place Generators NW',
        };
        let nw1 = {
          en: 'Place Generator NW',
        };
        let se2 = {
          en: 'Place Generators SE',
        };

        return {
          1: nw1_se1,
          2: nw2,
          // 3: faust,
          4: nw1,
          5: se2,
          6: nw1,
          7: se2,
          8: nw1,
        }[data.stockpileCount];
      },
    },
    {
      id: 'A9S Alarum',
      regex: /Alarum/,
      delaySeconds: 1,
      infoText: function(data) {
        // .. or anywhere not NW
        let se = {
          en: 'Kill Alarum SE',
        };
        // ... or anywhere not NW/SE
        let sw = {
          en: 'Kill Alarum SW',
        };

        return {
          5: se,
          6: sw,
          7: se,
          8: sw,
        }[data.stockpileCount];
      },
    },
    {
      id: 'A9S Bomb Explosion',
      regex: /Explosion/,
      beforeSeconds: 7,
      infoText: {
        en: 'Bombs Soon',
      },
    },
  ],
  triggers: [
    {
      id: 'A9S Stockpile Count',
      regex: Regexes.startsUsing({ source: 'Refurbisher 0', id: '1A38', capture: false }),
      run: function(data) {
        data.stockpileCount = data.stockpileCount || 0;
        data.stockpileCount++;
      },
    },
    {
      id: 'A9S Scrapline',
      regex: Regexes.startsUsing({ source: 'Refurbisher 0', id: '1A3C', capture: false }),
      alertText: function(data) {
        if (data.mainTank == data.me)
          return;
        return {
          en: 'Get Behind',
          de: 'Hinter ihn',
          fr: 'Derrière le boss',
          ja: '背面へ',
          ko: '보스 뒤로',
          cn: '去背后',
        };
      },
      infoText: function(data) {
        if (data.mainTank != data.me)
          return;
        return {
          en: 'Scrapline on YOU',
        };
        // ...probably, we hope...
      },
    },
    {
      id: 'A9S Double Scrapline',
      regex: Regexes.startsUsing({ source: 'Refurbisher 0', id: '1A3D', capture: false }),
      alertText: {
        en: 'Stand in Alarum Puddle',
      },
    },
    {
      id: 'A9S Scrap Rock',
      regex: Regexes.headMarker({ id: '0017' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Rock on YOU',
      },
    },
    {
      id: 'A9S Scrap Burst',
      regex: Regexes.headMarker({ id: '0017', capture: false }),
      delaySeconds: 5,
      suppressSeconds: 1,
      alertText: {
        en: 'Hide Fully Behind Rock',
      },
    },
    {
      id: 'A9S Scrap Bomb Stack',
      regex: Regexes.headMarker({ id: '003E' }),
      // TODO: dubious to tell the person tanking to do it here.
      // But maybe fine to inform.
      response: Responses.stackOn(),
    },
    {
      id: 'A9S Spread',
      regex: Regexes.headMarker({ id: '000E' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'A9S Auto',
      regex: Regexes.ability({ source: 'Refurbisher 0', id: '1AFE' }),
      run: function(data, matches) {
        data.mainTank = matches.target;
      },
    },
    {
      id: 'A9S Power Generator Add Tether',
      regex: Regexes.tether({ id: '0011', capture: false }),
      suppressSeconds: 30,
      infoText: function(data) {
        // Some of the last phases have multiple options.
        // This is an old fight, so just pick one for people.
        let ne = {
          en: 'Adds to NE Lava',
        };
        let se = {
          en: 'Adds to SE Lava',
        };
        let sw = {
          en: 'Adds to SW Lava',
        };
        let nw = {
          en: 'Adds to NW Lava',
        };

        return {
          1: ne,
          2: se,
          // 3: faust,
          4: sw,
          5: nw,
          6: sw,
          7: nw,
          8: sw,
        }[data.stockpileCount];
      },
    },
  ],
}];
