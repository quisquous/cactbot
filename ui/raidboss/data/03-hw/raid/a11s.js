'use strict';

[{
  zoneRegex: {
    en: /^Alexander - The Heart Of The Creator \(Savage\)$/,
    cn: /^亚历山大零式机神城 \(天动之章3\)$/,
  },
  timelineFile: 'a11s.txt',
  timelineTriggers: [
    {
      id: 'A11S Blastoff',
      regex: /Blastoff/,
      beforeSeconds: 5,
      response: Responses.knockback(),
    },
  ],
  triggers: [
    {
      id: 'A11S Left Laser Sword',
      regex: Regexes.startsUsing({ source: 'Cruise Chaser', id: '1A7A', capture: false }),
      // Sorry tanks.
      // We could figure out who is tanking and then do the opposite,
      // but probably that could get confusing too?
      // It seems better to just be consistent here and have tanks be smarter.
      response: Responses.goRight(),
    },
    {
      id: 'A11S Right Laser Sword',
      regex: Regexes.startsUsing({ source: 'Cruise Chaser', id: '1A79', capture: false }),
      response: Responses.goLeft(),
    },
    {
      id: 'A11S Optical Sight Clock',
      regex: Regexes.startsUsing({ source: 'Cruise Chaser', id: '1A6C', capture: false }),
      infoText: {
        en: 'Clock',
      },
    },
    {
      id: 'A11S Optical Sight Out',
      regex: Regexes.startsUsing({ source: 'Cruise Chaser', id: '1A6D', capture: false }),
      response: Responses.getOut('info'),
    },
    {
      id: 'A11S Optical Sight Bait',
      regex: Regexes.startsUsing({ source: 'Cruise Chaser', id: '1A6E', capture: false }),
      infoText: {
        en: 'Bait Optical Sight',
      },
    },
    {
      id: 'A11S Super Hawk Blaster',
      regex: Regexes.headMarker({ id: '005A' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'A11S Whirlwind',
      regex: Regexes.startsUsing({ source: 'Cruise Chaser', id: '1A84', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'A11S Spin Crusher',
      regex: Regexes.startsUsing({ source: 'Cruise Chaser', id: '1A85', capture: false }),
      response: Responses.awayFromFront('info'),
    },
    {
      id: 'A11S EDD Add',
      regex: Regexes.addedCombatant({ name: 'E\\.D\\.D\\.', capture: false }),
      infoText: {
        en: 'Kill Add',
      },
    },
    {
      id: 'A11S Armored Pauldron Add',
      regex: Regexes.addedCombatant({ name: 'Armored Pauldron', capture: false }),
      infoText: {
        en: 'Break Pauldron',
      },
    },
    {
      id: 'A11S GA-100',
      // Note: 0057 headmarker, but starts using occurs 3 seconds earlier.
      regex: Regexes.startsUsing({ source: 'Cruise Chaser', id: '1A77' }),
      // TODO: maybe we need a Responses.abilityOn()
      alarmText: function(data, matches) {
        if (data.me != matches.target)
          return;
        return {
          en: 'GA-100 on YOU',
        };
      },
      infoText: function(data, matches) {
        if (data.me == matches.target)
          return;
        return {
          en: 'GA-100 on ' + data.ShortName(matches.target),
        };
      },
    },
    {
      id: 'A11S Limit Cut Collect',
      regex: Regexes.headMarker({ id: '00(?:4F|5[0-6])' }),
      run: function(data, matches) {
        let limitCutNumber = {
          '004F': 1,
          '0050': 2,
          '0051': 3,
          '0052': 4,
          '0053': 5,
          '0054': 6,
          '0055': 7,
          '0056': 8,
        }[matches.id];
        data.limitCutMap = data.limitCutMap || {};
        data.limitCutMap[limitCutNumber] = matches.target;

        if (matches.target == data.me) {
          data.limitCutNumber = limitCutNumber;

          // Time between headmarker and mechanic.
          data.limitCutDelay = {
            '004F': 8.8,
            '0050': 9.3,
            '0051': 11.0,
            '0052': 11.5,
            '0053': 13.2,
            '0054': 13.7,
            '0055': 15.5,
            '0056': 16.0,
          }[matches.id];
        }
      },
    },
    {
      id: 'A11S Limit Cut Number',
      regex: Regexes.headMarker({ id: '00(?:4F|5[0-6])' }),
      condition: Conditions.targetIsYou(),
      durationSeconds: function(data) {
        return data.limitCutDelay;
      },
      infoText: function(data) {
        return data.limitCutNumber;
      },
    },
    {
      id: 'A11S Limit Cut Mechanic',
      regex: Regexes.headMarker({ id: '00(?:4F|5[0-6])' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: function(data) {
        return data.limitCutDelay - 5;
      },
      alertText: function(data) {
        if (data.limitCutNumber % 2 == 1) {
          // Odds
          return {
            en: 'Knockback Cleave; Face Outside',
            de: 'Rückstoß Cleave; nach Außen schauen',
            ja: 'ノックバック ソード; 外向く',
            fr: 'Poussée Cleave; Regarde à l\'extérieur',
            ko: '넉백 소드; 바깥쪽 바라보기',
            cn: '击退顺劈; 面向外侧',
          };
        }

        // Evens
        let partner = data.limitCutMap[data.limitCutNumber - 1];
        if (!partner) {
          // In case something goes awry?
          return {
            en: 'Knockback Charge',
            de: 'Rückstoß Charge',
            ja: 'ノックバック チャージ',
            fr: 'Poussée Charge',
            ko: '넉백 차지',
            cn: '击退冲锋',
          };
        }

        return {
          en: 'Face ' + data.ShortName(partner),
        };
      },
    },
    {
      id: 'A11S Limit Cut Cleanup',
      regex: Regexes.ability({ source: 'Cruise Chaser', id: '1A80', capture: false }),
      delaySeconds: 30,
      run: function(data) {
        delete data.limitCutDelay;
        delete data.limitCutNumber;
        delete data.limitCutMap;
      },
    },
    {
      id: 'A11S Laser X Sword',
      regex: Regexes.startsUsing({ source: 'Cruise Chaser', id: '1A7F' }),
      alertText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Shared Tankbuster on YOU',
          };
        }

        if (data.role == 'tank' || data.role == 'healer' || data.job == 'blu') {
          return {
            en: 'Shared Tankbuster on' + data.ShortName(matches.target),
          };
        }
      },
    },
    {
      id: 'A11S Propeller Wind',
      regex: Regexes.startsUsing({ source: 'Cruise Chaser', id: '1A7F', capture: false }),
      alertText: {
        en: 'Hide Behind Tower',
      },
    },
    {
      id: 'A11S Plasma Shield',
      regex: Regexes.addedCombatant({ name: 'Plasma Shield', capture: false }),
      alertText: {
        en: 'Break Shield From Front',
      },
    },
    {
      id: 'A11S Plasma Shield Shattered',
      regex: Regexes.gameLog({ line: 'The plasma shield is shattered', capture: false }),
      response: Responses.spread('info'),
    },
    {
      id: 'A11S Blassty Charge',
      // The single post-shield charge.  Not "super" blassty charge during limit cut.
      regex: Regexes.startsUsing({ source: 'Cruise Chaser', id: '1A83' }),
      alarmText: function(data, matches) {
        if (data.me != matches.target)
          return;
        return {
          en: 'Charge on YOU',
        };
      },
      alertText: function(data, matches) {
        if (data.me == matches.target)
          return;
        return {
          en: 'Charge on ' + data.ShortName(matches.target),
        };
      },
    },
  ],
}];
