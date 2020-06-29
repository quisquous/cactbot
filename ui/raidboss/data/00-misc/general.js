'use strict';

// Triggers for all occasions and zones.
[{
  zoneRegex: /.*/,
  zoneId: ZoneId.MatchAll,
  triggers: [
    {
      id: 'General Provoke',
      regex: Regexes.ability({ id: '1D6D' }),
      condition: function(data, matches) {
        if (matches.source !== data.me && !data.party.inAlliance(matches.source))
          return false;
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
          ko: '도발: ' + name,
        };
      },
    },
    {
      id: 'General Frog Legs',
      regex: Regexes.ability({ id: '4783' }),
      condition: function(data, matches) {
        if (matches.source !== data.me && !data.party.inAlliance(matches.source))
          return false;
        return data.role == 'tank' || data.job == 'BLU';
      },
      suppressSeconds: 0.5,
      infoText: function(data, matches) {
        let name = data.ShortName(matches.source);
        return {
          en: 'Provoke: ' + name,
          de: 'Herausforderung: ' + name,
          fr: 'Provocation: ' + name,
          ja: '挑発: ' + name,
          cn: '挑衅: ' + name,
          ko: '도발: ' + name,
        };
      },
    },
    {
      id: 'General Shirk',
      regex: Regexes.ability({ id: '1D71' }),
      condition: function(data, matches) {
        if (matches.source !== data.me && !data.party.inAlliance(matches.source))
          return false;
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
          ko: '기피: ' + name,
        };
      },
    },
    {
      id: 'General Holmgang',
      regex: Regexes.ability({ id: '2B' }),
      condition: function(data, matches) {
        if (matches.source !== data.me && !data.party.inAlliance(matches.source))
          return false;
        return data.role == 'tank' || data.role == 'healer';
      },
      infoText: function(data, matches) {
        let name = data.ShortName(matches.source);
        return {
          en: 'Holmgang: ' + name,
          de: 'Holmgang: ' + name,
          fr: 'Holmgang: ' + name,
          ja: 'ホルムギャング: ' + name,
          cn: '死斗: ' + name,
          ko: '일대일 결투: ' + name,
        };
      },
    },
    {
      id: 'General Hallowed',
      regex: Regexes.ability({ id: '1E' }),
      condition: function(data, matches) {
        if (matches.source !== data.me && !data.party.inAlliance(matches.source))
          return false;
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
          ko: '천하무적: ' + name,
        };
      },
    },
    {
      id: 'General Superbolide',
      regex: Regexes.ability({ id: '3F18' }),
      condition: function(data, matches) {
        if (matches.source !== data.me && !data.party.inAlliance(matches.source))
          return false;
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
          ko: '폭발 유성: ' + name,
        };
      },
    },
    {
      id: 'General Living',
      regex: Regexes.ability({ id: 'E36' }),
      condition: function(data, matches) {
        if (matches.source !== data.me && !data.party.inAlliance(matches.source))
          return false;
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
          ko: '산송장: ' + name,
        };
      },
    },
    {
      id: 'General Walking',
      regex: Regexes.gainsEffect({ effect: 'Walking Dead' }),
      regexDe: Regexes.gainsEffect({ effect: 'Erweckter' }),
      regexFr: Regexes.gainsEffect({ effect: 'Marcheur des limbes' }),
      regexJa: Regexes.gainsEffect({ effect: 'ウォーキングデッド' }),
      regexCn: Regexes.gainsEffect({ effect: '死而不僵' }),
      regexKo: Regexes.gainsEffect({ effect: '움직이는 시체' }),
      condition: function(data, matches) {
        if (matches.source !== data.me && !data.party.inAlliance(matches.source))
          return false;
        return data.role == 'tank' || data.role == 'healer';
      },
      infoText: function(data, matches) {
        let name = data.ShortName(matches.source);
        return {
          en: 'Walking: ' + name,
          de: 'Erweckter: ' + name,
          fr: 'Marcheur des limbes: ' + name,
          ja: 'ウォーキングデッド: ' + name,
          cn: '死而不僵: ' + name,
          ko: '움직이는 시체: ' + name,
        };
      },
    },
    {
      id: 'General Ready Check',
      regex: Regexes.gameLog({ line: '(?:\\y{Name} has initiated|You have commenced) a ready check\..*?', capture: false }),
      regexDe: Regexes.gameLog({ line: '(?:\\y{Name} hat|Du hast) eine Bereitschaftsanfrage gestellt\..*?', capture: false }),
      regexFr: Regexes.gameLog({ line: 'Un appel de préparation a été lancé par \y{Name}\..*?', capture: false }),
      regexJa: Regexes.gameLog({ line: '(?:\\y{Name}が)?レディチェックを開始しました。.*?', capture: false }),
      regexCn: Regexes.gameLog({ line: '\\y{Name}?发起了准备确认.*?', capture: false }),
      regexKo: Regexes.gameLog({ line: '\\y{Name} 님이 준비 확인을 시작했습니다\.|준비 확인을 시작합니다\..*?', capture: false }),
      sound: '../../resources/sounds/Overwatch/D.Va_-_Game_on.ogg',
      soundVolume: 0.6,
    },
  ],
}];
