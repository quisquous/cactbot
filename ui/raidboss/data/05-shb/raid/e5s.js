'use strict';

[{
  zoneRegex: {
    en: /^Eden's Verse: Fulmination \(Savage\)$/,
    ko: /^희망의 낙원 에덴: 공명편\(영웅\) \(1\)$/,
  },
  timelineFile: 'e5s.txt',
  triggers: [
    {
      id: 'E5S Fury\'s Bolt Gain',
      regex: Regexes.gainsEffect({ target: 'Ramuh', effect: 'Fury\'s Bolt', capture: false }),
      regexDe: Regexes.gainsEffect({ target: 'Ramuh', effect: 'Fury\'s Bolt', capture: false }),
      regexFr: Regexes.gainsEffect({ target: 'Ramuh', effect: 'Fury\'s Bolt', capture: false }),
      regexJa: Regexes.gainsEffect({ target: 'ラムウ', effect: 'チャージボルト', capture: false }),
      run: function(data) {
        data.fury = true;
      },
    },
    {
      id: 'E5S Fury\'s Bolt Lose',
      regex: Regexes.losesEffect({ target: 'Ramuh', effect: 'Fury\'s Bolt', capture: false }),
      regexDe: Regexes.losesEffect({ target: 'Ramuh', effect: 'Fury\'s Bolt', capture: false }),
      regexFr: Regexes.losesEffect({ target: 'Ramuh', effect: 'Fury\'s Bolt', capture: false }),
      regexJa: Regexes.losesEffect({ target: 'ラムウ', effect: 'チャージボルト', capture: false }),
      run: function(data) {
        data.fury = false;
      },
    },
    {
      id: 'E5S Stratospear Summons',
      regex: Regexes.ability({ id: '4BA5', source: 'Ramuh', capture: false }),
      regexDe: Regexes.ability({ id: '4BA5', source: 'Ramuh', capture: false }),
      regexFr: Regexes.ability({ id: '4BA5', source: 'Ramuh', capture: false }),
      regexJa: Regexes.ability({ id: '4BA5', source: 'ラムウ', capture: false }),
      regexKo: Regexes.ability({ id: '4BA5', source: '라무', capture: false }),
      delaySeconds: 5,
      condition: function(data) {
        return !data.seenFirstSpear;
      },
      run: function(data) {
        data.seenFirstSpear = true;
      },
      infoText: {
        en: 'Look for small spear',
        ko: '작은 지팡이 확인',
      },
    },
    {
      id: 'E5S Tribunal Summons',
      regex: Regexes.startsUsing({ id: '4BAC', source: 'Ramuh', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4BAC', source: 'Ramuh', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4BAC', source: 'Ramuh', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4BAC', source: 'ラムウ', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4BAC', source: '라무', capture: false }),
      condition: function(data) {
        return !data.firstAdd;
      },
      infoText: {
        en: 'Look for adds',
        ko: '쫄 위치 확인',
      },
      run: function(data) {
        data.firstAdd = false;
      },
    },
    {
      id: 'E5S Fury\'s Bolt',
      regex: Regexes.startsUsing({ id: '4BAA', source: 'Ramuh', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4BAA', source: 'Ramuh', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4BAA', source: 'Ramuh', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4BAA', source: 'ラムウ', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4BAA', source: '라무', capture: false }),
      infoText: {
        en: 'Fury\'s Bolt',
        ko: '라무 강화',
      },
    },
    {
      id: 'E5S Fury\'s Fourteen',
      regex: Regexes.startsUsing({ id: '4BAB', source: 'Ramuh', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4BAB', source: 'Ramuh', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4BAB', source: 'Ramuh', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4BAB', source: 'ラムウ', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4BAB', source: '라무', capture: false }),
      infoText: {
        en: 'Grab an orb',
        ko: '구슬 줍기',
      },
    },
    {
      id: 'E5S Judgment Volts',
      regex: Regexes.startsUsing({ id: '4BB5', source: 'Ramuh', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4BB5', source: 'Ramuh', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4BB5', source: 'Ramuh', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4BB5', source: 'ラムウ', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4BB5', source: '라무', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'E5S Stepped Leader',
      regex: Regexes.startsUsing({ id: '4BC6', source: 'Ramuh', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4BC6', source: 'Ramuh', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4BC6', source: 'Ramuh', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4BC6', source: 'ラムウ', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4BC6', source: '라무', capture: false }),
      alertText: function(data) {
        if (!data.fury) {
          return {
            en: 'Ready Spread',
            ko: '산개 준비',
          };
        } else if (data.fury) {
          return {
            en: 'donut AoE',
            ko: '도넛 장판',
          };
        }
      },
    },
    {
      id: 'E5S Stepped Leader Spread',
      regex: Regexes.ability({ id: '4BC6', source: 'Ramuh', capture: false }),
      regexDe: Regexes.ability({ id: '4BC6', source: 'Ramuh', capture: false }),
      regexFr: Regexes.ability({ id: '4BC6', source: 'Ramuh', capture: false }),
      regexJa: Regexes.ability({ id: '4BC6', source: 'ラムウ', capture: false }),
      regexKo: Regexes.ability({ id: '4BC6', source: '라무', capture: false }),
      condition: function(data) {
        return !data.fury;
      },
      alarmText: {
        en: 'Spread',
        de: 'Verteilen',
        fr: 'Ecartez-vous',
        ja: '散開',
        cn: '分散',
        ko: '산개',
      },
    },
    {
      id: 'E5S Crippling Blow',
      regex: Regexes.ability({ id: '4BCA', source: 'Ramuh', capture: false  }),
      regexDe: Regexes.ability({ id: '4BCA', source: 'Ramuh', capture: false  }),
      regexFr: Regexes.ability({ id: '4BCA', source: 'Ramuh', capture: false  }),
      regexJa: Regexes.ability({ id: '4BCA', source: 'ラムウ', capture: false  }),
      regexKo: Regexes.ability({ id: '4BCA', source: '라무', capture: false  }),
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      response: Responses.tankBuster(),
    },
    {
      id: 'E5S Stormcloud Summons',
      regex: Regexes.startsUsing({ id: '4BB8', source: 'Ramuh', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4BB8', source: 'Ramuh', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4BB8', source: 'Ramuh', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4BB8', source: 'ラムウ', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4BB8', source: '라무', capture: false }),
      infoText: {
        en: 'Position for Stormcloud',
        ko: '번개 구름 위치 잡기',
      },
    },
    {
      id: 'E5S Centaur\'s Charge',
      regex: Regexes.startsUsing({ id: '4BAD', source: 'Ramuh', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4BAD', source: 'Ramuh', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4BAD', source: 'Ramuh', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4BAD', source: 'ラムウ', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4BAD', source: '라무', capture: false }),
      infoText: {
        en: 'Be in your position',
        ko: '자기 위치에 있기',
      },
    },
    {
      id: 'E5S Chain Lightning',
      regex: Regexes.startsUsing({ id: '4BC4', source: 'Ramuh', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4BC4', source: 'Ramuh', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4BC4', source: 'Ramuh', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4BC4', source: 'ラムウ', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4BC4', source: '라무', capture: false }),
      alertText: {
        en: 'Ready for Chain',
        ko: '번개 돌려막기 준비',
      },
    },
    {
      id: 'E5S Levinforce',
      regex: Regexes.startsUsing({ id: '4BCC', source: 'Ramuh', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4BCC', source: 'Ramuh', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4BCC', source: 'Ramuh', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4BCC', source: 'ラムウ', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4BCC', source: '라무', capture: false }),
      response: Responses.knockback(),
    },
  ],
  timelineReplace: [
  ],
}];
