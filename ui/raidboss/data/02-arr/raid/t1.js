'use strict';

[{
  zoneRegex: {
    en: /^The Binding Coil Of Bahamut - Turn \(1\)$/,
    cn: /^巴哈姆特大迷宫 邂逅之章1$/,
  },
  triggers: [
    {
      id: 'T1 High Voltage',
      regex: Regexes.startsUsing({ source: 'Ads', id: '5A7' }),
      regexDe: Regexes.startsUsing({ source: 'Abwehrsystem', id: '5A7' }),
      regexFr: Regexes.startsUsing({ source: 'Sphère De Contrôle', id: '5A7' }),
      regexJa: Regexes.startsUsing({ source: '制御システム', id: '5A7' }),
      regexCn: Regexes.startsUsing({ source: '自卫系统', id: '5A7' }),
      regexKo: Regexes.startsUsing({ source: '제어 시스템', id: '5A7' }),
      condition: function(data) {
        return data.CanSilence();
      },
      response: Responses.interrupt(),
    },
    {
      // Indiscriminate Hood Swing
      id: 'T1 Initiated',
      regex: Regexes.ability({ source: 'Caduceus', id: '4B8', capture: false }),
      regexDe: Regexes.ability({ source: 'Caduceus', id: '4B8', capture: false }),
      regexFr: Regexes.ability({ source: 'Caducée', id: '4B8', capture: false }),
      regexJa: Regexes.ability({ source: 'カドゥケウス', id: '4B8', capture: false }),
      regexCn: Regexes.ability({ source: '神杖巨蛇', id: '4B8', capture: false }),
      regexKo: Regexes.ability({ source: '카두케우스', id: '4B8', capture: false }),
      run: function(data) {
        data.started = true;
      },
    },
    {
      id: 'T1 Regorge',
      regex: Regexes.ability({ source: 'Caduceus', id: '4BA' }),
      regexDe: Regexes.ability({ source: 'Caduceus', id: '4BA' }),
      regexFr: Regexes.ability({ source: 'Caducée', id: '4BA' }),
      regexJa: Regexes.ability({ source: 'カドゥケウス', id: '4BA' }),
      regexCn: Regexes.ability({ source: '神杖巨蛇', id: '4BA' }),
      regexKo: Regexes.ability({ source: '카두케우스', id: '4BA' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Spit on YOU',
        de: 'Spucke auf DIR',
        fr: 'Crachat sur VOUS',
      },
    },
    {
      id: 'T1 Split',
      regex: Regexes.addedCombatant({ name: 'Caduceus', capture: false }),
      regexDe: Regexes.addedCombatant({ name: 'Caduceus', capture: false }),
      regexFr: Regexes.addedCombatant({ name: 'Caducée', capture: false }),
      regexJa: Regexes.addedCombatant({ name: 'カドゥケウス', capture: false }),
      regexCn: Regexes.addedCombatant({ name: '神杖巨蛇', capture: false }),
      regexKo: Regexes.addedCombatant({ name: '카두케우스', capture: false }),
      condition: function(data) {
        return data.started;
      },
      suppressSeconds: 5,
      alertText: {
        en: 'Split',
        de: 'Zerteilung',
        fr: 'Séparation',
      },
    },
    {
      id: 'T1 Hood Swing',
      regex: Regexes.ability({ source: 'Caduceus', id: '4B8' }),
      regexDe: Regexes.ability({ source: 'Caduceus', id: '4B8' }),
      regexFr: Regexes.ability({ source: 'Caducée', id: '4B8' }),
      regexJa: Regexes.ability({ source: 'カドゥケウス', id: '4B8' }),
      regexCn: Regexes.ability({ source: '神杖巨蛇', id: '4B8' }),
      regexKo: Regexes.ability({ source: '카두케우스', id: '4B8' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      delaySeconds: 8,
      suppressSeconds: 5,
      infoText: {
        en: 'Hood Swing in 10',
        de: 'Kapuzenschwung in 10',
      },
    },
    {
      id: 'T1 Slime Timer First',
      regex: Regexes.message({ line: 'The Allagan megastructure will be sealed off', capture: false }),
      delaySeconds: 35,
      suppressSeconds: 5,
      infoText: {
        en: 'Slime Soon',
        de: 'Schleim bald',
        fr: 'Slime bientôt',
      },
    },
    {
      id: 'T1 Slime Timer',
      regex: Regexes.addedCombatant({ name: 'Dark Matter Slime', capture: false }),
      regexDe: Regexes.addedCombatant({ name: 'Dunkelmaterien-Schleim', capture: false }),
      regexFr: Regexes.addedCombatant({ name: 'Gluant De Matière Sombre', capture: false }),
      regexJa: Regexes.addedCombatant({ name: 'ダークマター・スライム', capture: false }),
      regexCn: Regexes.addedCombatant({ name: '暗物质粘液怪', capture: false }),
      regexKo: Regexes.addedCombatant({ name: '암흑물질 슬라임', capture: false }),
      delaySeconds: 35,
      suppressSeconds: 5,
      infoText: {
        en: 'Slime Soon',
        de: 'Schleim bald',
        fr: 'Slime bientôt',
      },
    },
  ],
}];
