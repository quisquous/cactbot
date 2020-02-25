'use strict';

[{
  zoneRegex: {
    en: /^Eden's Verse: Furor \(Savage\)$/,
    ko: /^희망의 낙원 에덴: 공명편\(영웅\) \(2\)$/,
  },
  timelineFile: 'e6s.txt',
  triggers: [
    {
      id: 'E6S Superstorm',
      regex: Regexes.startsUsing({ source: 'Garuda', id: '4BF7', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'E6S Inferno Howl',
      regex: Regexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4C14', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      // Save ability state since the generic tether used has multiple uses in this fight
      id: 'E6S Hands of Flame Start',
      regex: Regexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4D00', capture: false }),
      preRun: function(data) {
        data.handsOfFlame = true;
      },
    },
    {
      // Tank swap if you're not the target
      // Break tether if you're the target during Ifrit+Garuda phase
      id: 'E6S Hands of Flame Tether',
      regex: Regexes.tether({ id: '0068' }),
      condition: function(data) {
        return data.handsOfFlame = true;
      },
      infoText: function(data, matches) {
        if (data.me != matches.target || data.role != 'tank')
          return;
        if (data.me == matches.target) {
          if (data.onIfrit == true) {
            return {
              en: 'Break Tether',
            };
          }
          return {
            en: 'Charge on YOU',
          };
        }
        return {
          en: 'Tank Swap',
        };
      },
    },
    {
      id: 'E6S Hands of Flame Cast',
      regex: Regexes.ability({ source: ['Ifrit', 'Raktapaksa'], id: '4D00', capture: false }),
      preRun: function(data) {
        data.handsOfFlame = false;
      },
    },
    {
      id: 'E6S Instant Incineration',
      regex: Regexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4C0E' }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'E6S Meteor Strike',
      regex: Regexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4C0F', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      id: 'E6S Hands of Hell',
      regex: Regexes.headMarker({ id: '0016' }),
      condition: Conditions.targetIsYou(),
      alertText: {
        en: 'Tether Marker on YOU',
      },
    },
    {
      id: 'E6S Hated of the Vortex',
      regex: Regexes.gainsEffect({ effect: 'Hated of the Vortex' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Attack Garuda',
      },
    },
    {
      id: 'E6S Hated of the Embers',
      regex: Regexes.gainsEffect({ effect: 'Hated of the Embers' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Attack Ifrit',
      },
      run: function(data, matches) {
        if (data.me == matches.target)
          data.onIfrit = true;
      },
    },
    {
      id: 'E6S Conflag Strike',
      regex: Regexes.startsUsing({ source: 'Raktapaksa', id: '4C10', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'E6S Irons Of Purgatory',
      regex: Regexes.tether({ id: '006C' }),
      condition: function(data, matches) {
        return data.me == matches.target || data.me == matches.source;
      },
      alertText: function(data, matches) {
        if (data.me == matches.source) {
          return {
            en: 'Tethered to ' + matches.target,
          };
        }
        return {
          en: 'Tethered to ' + matches.source,
        };
      },
    },
  ],
  timelineReplace: [
  ],
}];
