'use strict';

// TODO: figure out *anything* with mirrors and mirror colors
// TODO: yell at you to take the last tower for Light Rampant if needed
// TODO: yell at you to take the last tower for Icelit Dragonsong if needed
// TODO: House of light clock position callout
// TODO: "move" calls for all the akh raihs
// TODO: Light Rampant early callouts (who has prox marker, who gets aoes)
// TODO: reflected scythe kick callout (stand by mirror)
// TODO: reflected axe kick callout (get under)
// TODO: callouts for initial Hallowed Wings mirrors?
// TODO: callouts for the stack group mirrors?
// TODO: callouts for the Shining Armor mirrors?
// TODO: icelit dragonsong callouts?

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
    {
      id: 'E8S Rush',
      regex: /Rush \d/,
      beforeSeconds: 5,
      infoText: function(data) {
        data.rushCount = data.rushCount || 0;
        data.rushCount++;
        return {
          en: 'Tether ' + data.rushCount,
          ko: '선: ' + data.rushCount,
        };
      },
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
      run: function(data) {
        data.firstFrost = data.firstFrost || 'biting';
      },
    },
    {
      id: 'E8S Driving Frost',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D67', capture: false }),
      alertText: {
        en: 'Go Front / Sides',
        ko: '앞 / 양옆으로',
      },
      run: function(data) {
        data.firstFrost = data.firstFrost || 'driving';
      },
    },
    {
      id: 'E8S Forgetful Tank Second Frost',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D6[67]', capture: false }),
      condition: (data) => data.role == 'tank',
      delaySeconds: 43,
      infoText: function(data) {
        if (data.firstFrost == 'biting') {
          return {
            en: 'Biting Frost Next',
            ko: '다음: Biting/スラッシュ',
          };
        }
        return {
          en: 'Driving Frost Next',
          ko: '다음: Driving/スラスト',
        };
      },
      tts: function(data) {
        if (data.firstFrost == 'biting') {
          return {
            ko: '다음: 바이팅 스라슈',
          };
        }
        return {
          ko: '다음: 드라이빙 스라스토',
        };
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
        ko: '에스나',
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
      id: 'E8S Refulgent Chain',
      regex: Regexes.gainsEffect({ effect: 'Refulgent Chain' }),
      condition: Conditions.targetIsYou(),
      suppressSeconds: 1,
      infoText: {
        en: 'Chain on YOU',
        ko: '사슬 대상자',
      },
    },
    {
      id: 'E8S Holy Light',
      regex: Regexes.tether({ id: '0002' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Orb on YOU',
        ko: '구슬 대상자',
      },
    },
    {
      id: 'E8S Banish III',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D80', capture: false }),
      infoText: {
        en: 'Stacks',
        ko: '쉐어징',
      },
    },
    {
      id: 'E8S Banish III Divided',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D81', capture: false }),
      response: Responses.spread('alert'),
    },
    {
      id: 'E8S Morn Afah',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D7B' }),
      alertText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Morn Afah on YOU',
            ko: '몬아파 대상자',
          };
        }
        if (data.role == 'tank' || data.role == 'healer' || data.CanAddle()) {
          return {
            en: 'Morn Afah on ' + matches.target,
            ko: '"' + matches.target + '" 몬 아파',
          };
        }
      },
    },
    {
      id: 'E8S Hallowed Wings Left',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D75', capture: false }),
      response: Responses.goRight(),
    },
    {
      id: 'E8S Hallowed Wings Right',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D76', capture: false }),
      response: Responses.goLeft(),
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
          ko: '빨강 ' + data.wyrmclawNumber + '번',
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
          ko: '파랑 ' + data.wyrmclawNumber + '번',
        };
      },
    },
    {
      id: 'E8S Holy',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D82', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'E8S Holy Divided',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D83', capture: false }),
      condition: (data) => data.role == 'tank',
      response: Responses.getIn('alert'),
    },
    {
      id: 'E8S Twin Stillness',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D68', capture: false }),
      alertText: {
        en: 'Back Then Front',
        ko: '뒤로 => 앞으로',
      },
    },
    {
      id: 'E8S Twin Silence',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D69', capture: false }),
      alertText: {
        en: 'Front Then Back',
        ko: '앞으로 => 뒤로',
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
        ko: '딜러만 에스나',
      },
    },
    {
      id: 'E8S Banish',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D7E', capture: false }),
      condition: (data) => data.role == 'tank',
      response: Responses.stack('alert'),
    },
    {
      id: 'E8S Banish Divided',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4D7F', capture: false }),
      condition: (data) => data.role == 'tank',
      response: Responses.spread('alarm'),
    },
  ],
  timelineReplace: [
  ],
}];
