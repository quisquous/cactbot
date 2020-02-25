'use strict';

[{
  zoneRegex: {
    en: /^Eden's Verse: Refulgence \(Savage\)$/,
    ko: /^희망의 낙원 에덴: 공명편\(영웅\) \(4\)$/,
  },
  timelineFile: 'e8s.txt',
  timelineTriggers: [
    {
      id: 'E8S Shining Armor',
      regex: /Shining Armor/,
      beforeSeconds: 2,
      response: Responses.lookAway(),
    },
  ],
  triggers: [
    {
      id: 'E8S Absolute Zero',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4DCC', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'E8S Biting Frost',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D66', capture: false }),
      response: Responses.getBehind(),
    },
    {
      id: 'E8S Driving Frost',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D67', capture: false }),
      alertText: {
        en: 'Away From Back',
      },
    },
    {
      id: 'E8S Diamond Frost',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D6C', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'E8S Diamond Frost Cleanse',
      regex: Regexes.ability({ source: 'Shiva', id: '4D6C', capture: false }),
      suppressSeconds: 1,
      condition: function(data) {
        return data.CanCleanse();
      },
      infoText: {
        en: 'Cleanse',
      },
    },
    {
      id: 'E8S Double Slap',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D65' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'E8S Axe Kick',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D6D', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'E8S Scythe Kick',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D6E', capture: false }),
      response: Responses.getUnder(),
    },
    {
      id: 'E8S Light Rampant',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D73', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'E8S Banish III',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D80', capture: false }),
      response: Responses.stack(),
    },
    {
      id: 'E8S Banish III Fake',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D81', capture: false }),
      response: Responses.spread(),
    },
    {
      id: 'E8S Wyrm\'s Lament',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D7C', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
      run: function(data) {
        data.wyrmsLament = data.wyrmsLament || 0;
        data.wyrmsLament++;
      },
    },
    {
      id: 'E8S Wyrm\'s Lament Counter',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D7C', capture: false }),
      run: function(data) {
        data.wyrmsLament = data.wyrmsLament || 0;
        data.wyrmsLament++;
      },
    },
    {
      id: 'E8S Wyrmclaw',
      regex: Regexes.gainsEffect({ effect: 'Wyrmclaw' }),
      condition: Conditions.targetIsYou(),
      preRun: function(data, matches) {
        if (data.wyrmsLament == 1) {
          data.wyrmclawNumber = {
            '14': 1,
            '22': 2,
            '30': 3,
            '38': 4,
          }[Math.ceil(matches.duration)];
        } else {
          data.wyrmclawNumber = {
            '22': 1,
            '38': 2,
          }[Math.ceil(matches.duration)];
        }
      },
      durationSeconds: function(data, matches) {
        return matches.duration;
      },
      alertText: function(data) {
        return {
          en: 'Red #' + data.wyrmclawNumber,
        };
      },
    },
    {
      id: 'E8S Wyrmfang',
      regex: Regexes.gainsEffect({ effect: 'Wyrmfang' }),
      condition: Conditions.targetIsYou(),
      preRun: function(data, matches) {
        if (data.wyrmsLament == 1) {
          data.wyrmfangNumber = {
            '20': 1,
            '28': 2,
            '36': 3,
            '44': 4,
          }[Math.ceil(matches.duration)];
        } else {
          data.wyrmfangNumber = {
            '28': 1,
            '44': 2,
          }[Math.ceil(matches.duration)];
        }
      },
      durationSeconds: function(data, matches) {
        return matches.duration;
      },
      alertText: function(data) {
        return {
          en: 'Blue #' + data.wyrmfangNumber,
        };
      },
    },
    {
      id: 'E8S Twin Stillness',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D68', capture: false }),
      alertText: {
        en: 'Get Back Then Front',
      },
    },
    {
      id: 'E8S Twin Silence',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D69', capture: false }),
      alertText: {
        en: 'Get Front Then Back',
      },
    },
    {
      id: 'E8S Spiteful Dance',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D6F', capture: false }),
      response: Responses.getOutThenIn(),
    },
    {
      id: 'E8S Embittered Dance',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D70', capture: false }),
      response: Responses.getInThenOut(),
    },
    {
      id: 'E8S Icelit Dragonsong Cleanse',
      regex: Regexes.ability({ source: 'Shiva', id: '4D70', capture: false }),
      suppressSeconds: 1,
      condition: function(data) {
        return data.CanCleanse();
      },
      infoText: {
        en: 'Cleanse DPS Only',
      },
    },
  ],
  timelineReplace: [
  ],
}];
