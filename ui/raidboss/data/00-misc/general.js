'use strict';

// Triggers for all occasions and zones.
[{
  zoneRegex: /.*/,
  triggers: [
    {
      id: 'General Provoke',
      regex: Regexes.ability({ id: '1D6D' }),
      condition: function(data) {
        return data.role == 'tank';
      },
      infoText: function(data, matches) {
        let name = data.ShortName(matches.source);
        return {
          en: 'Provoke: ' + name,
          de: 'Herausforderung: ' + name,
          fr: 'Provocation: ' + name,
          ja: '挑発: ' + name,
          cn: '挑衅: ' + name,
        };
      },
    },
    {
      id: 'General Shirk',
      regex: Regexes.ability({ id: '1D71' }),
      condition: function(data) {
        return data.role == 'tank';
      },
      infoText: function(data, matches) {
        let name = data.ShortName(matches.source);
        return {
          en: 'Shirk: ' + name,
          de: 'Geteiltes Leid: ' + name,
          fr: 'Dérobade: ' + name,
          ja: 'シャーク: ' + name,
          cn: '退避: ' + name,
        };
      },
    },
    {
      id: 'General Holmgang',
      regex: Regexes.ability({ id: '2B' }),
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      infoText: function(data, matches) {
        let name = data.ShortName(matches.source);
        return {
          en: 'Holmgang: ' + name,
          ja: 'ホルムギャング: ' + name,
          cn: '死斗: ' + name,
        };
      },
    },
    {
      id: 'General Hallowed',
      regex: Regexes.ability({ id: '1E' }),
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      infoText: function(data, matches) {
        let name = data.ShortName(matches.source);
        return {
          en: 'Hallowed: ' + name,
          de: 'Heiliger Boden: ' + name,
          fr: 'Invincible: ' + name,
          ja: 'インビンシブル: ' + name,
          cn: '神圣领域: ' + name,
        };
      },
    },
    {
      id: 'General Superbolide',
      regex: Regexes.ability({ id: '3F18' }),
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      infoText: function(data, matches) {
        let name = data.ShortName(matches.source);
        return {
          en: 'Bolide: ' + name,
          de: 'Meteoritenfall: ' + name,
          fr: 'Bolide: ' + name,
          ja: 'ボーライド: ' + name,
          cn: '超火流星: ' + name,
        };
      },
    },
    {
      id: 'General Living',
      regex: Regexes.ability({ id: 'E36' }),
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      infoText: function(data, matches) {
        let name = data.ShortName(matches.source);
        return {
          en: 'Living: ' + name,
          de: 'Totenerweckung: ' + name,
          fr: 'Mort-vivant: ' + name,
          ja: 'リビングデッド: ' + name,
          cn: '行尸走肉: ' + name,
        };
      },
    },
    {
      id: 'General Walking',
      regex: Regexes.gainsEffect({ effect: 'Walking Dead' }),
      regexDe: Regexes.gainsEffect({ effect: 'Erweckter' }),
      regexFr: Regexes.gainsEffect({ effect: 'Marcheur Des Limbes' }),
      regexJa: Regexes.gainsEffect({ effect: 'ウォーキングデッド' }),
      regexCn: Regexes.gainsEffect({ effect: '死而不僵' }),
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      infoText: function(data, matches) {
        let name = data.ShortName(matches.source);
        return {
          en: 'Walking: ' + name,
          de: 'Erweckter: ' + name,
          fr: 'Marcheur Des Limbes: ' + name,
          ja: 'ウォーキングデッド: ' + name,
          cn: '死而不僵: ' + name,
        };
      },
    },
    {
      id: 'General Ready check',
      regex: Regexes.gameLog({ line: '(?:\y{Name} has initiated|You have commenced) a ready check\.', capture: false }),
      regexDe: Regexes.gameLog({ line: '(?:\y{Name} hat|Du hast) eine Bereitschaftsanfrage gestellt\.', capture: false }),
      regexFr: Regexes.gameLog({ line: 'Un appel de préparation a été lancé par \y{Name}\.', capture: false }),
      regexJa: Regexes.gameLog({ line: '(?:\y{Name}が)?レディチェックを開始しました。', capture: false }),
      regexCn: Regexes.gameLog({ line: '\y{Name}?发起了准备确认', capture: false }),
      sound: '../../resources/sounds/Overwatch/D.Va_-_Game_on.ogg',
      soundVolume: 0.6,
    },
  ],
}];
