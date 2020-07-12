'use strict';

[{
  zoneRegex: {
    en: /^Sohm Al \(Hard\)$/,
  },
  zoneId: ZoneId.SohmAlHard,
  timelineFile: 'sohm_al_hard.txt',
  timelineTriggers: [
    {
      id: 'Sohm Al Hard Wild Horn',
      regex: /Wild Horn/,
      beforeSeconds: 4,
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      response: Responses.tankBuster(),
    },
  ],
  triggers: [
    {
      // The actual damage is 1C31, but the windup for the damage
      // occurs between 1C30 and 1C31.
      id: 'Sohm Al Hard Inflammable Fumes',
      netRegex: NetRegexes.ability({ id: '1C30', source: 'The Leightonward', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '1C30', source: '莱顿瓦德', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '1C30', source: 'Hortigolem', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '1C30', source: 'Chortocyon', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '1C30', source: 'レイトンワード', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      // Both the small and large Spore Sacs use Glorious Blaze.
      // However, it's not the same ability.
      id: 'Sohm Al Hard Glorious Blaze',
      netRegex: NetRegexes.startsUsing({ id: '1C32', source: 'Spore Sac', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1C32', source: '孢囊', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1C32', source: 'Sporensack', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1C32', source: 'Sac de spores', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1C32', source: 'スポアサック', capture: false }),
      suppressSeconds: 5,
      infoText: {
        en: 'Away from large pod',
        de: 'Weg vom großen Pod',
      },
    },
    {
      // The actual effect being checked here is Heavy.
      id: 'Sohm Al Hard Excretion',
      netRegex: NetRegexes.gainsEffect({ effectId: '0E' }),
      condition: function(data) {
        return data.CanCleanse();
      },
      infoText: function(data, matches) {
        return {
          en: 'Cleanse ' + data.shortName(matches.target),
          de: 'Reinige ' + data.shortName(matches.target),
        };
      },
    },
    {
      // Inflicts Incoming Healing Down.
      // If used while Gowrow is empowered,
      // leaves a tornado at the target location on completion.
      id: 'Sohm Al Hard Ripper Claw',
      netRegex: NetRegexes.startsUsing({ id: '1C37', source: 'Gowrow', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1C37', source: 'Gowrow', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1C37', source: 'Gowrow', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1C37', source: 'ガウロウ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1C37', source: '高牢怪龙', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      // Inflicts Incoming Healing Down.
      // This ability is used only if there is a party member in range behind Gowrow
      // AND if Gowrow is not empowered.
      id: 'Sohm Al Hard Tail Smash',
      netRegex: NetRegexes.startsUsing({ id: '1C35', source: 'Gowrow', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1C35', source: 'Gowrow', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1C35', source: 'Gowrow', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1C35', source: 'ガウロウ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1C35', source: '高牢怪龙', capture: false }),
      response: Responses.goFrontOrSides(),
    },
    {
      // Inflicts Incoming Healing Down.
      // Used only if Gowrow is empowered.
      id: 'Sohm Al Hard Tail Swing',
      netRegex: NetRegexes.startsUsing({ id: '1C36', source: 'Gowrow', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1C36', source: 'Gowrow', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1C36', source: 'Gowrow', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1C36', source: 'ガウロウ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1C36', source: '高牢怪龙', capture: false }),
      response: Responses.getOut(),
    },
    {
      // Used only if Gowrow is not empowered.
      id: 'Sohm Al Hard Wild Charge',
      netRegex: NetRegexes.startsUsing({ id: '1C39', source: 'Gowrow', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1C39', source: 'Gowrow', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1C39', source: 'Gowrow', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1C39', source: 'ガウロウ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1C39', source: '高牢怪龙', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      // Used only if Gowrow is empowered.
      id: 'Sohm Al Hard Hot Charge',
      netRegex: NetRegexes.startsUsing({ id: '1C3A', source: 'Gowrow', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1C3A', source: 'Gowrow', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1C3A', source: 'Gowrow', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1C3A', source: 'ガウロウ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1C3A', source: '高牢怪龙', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      // Used only if Gowrow is not empowered.
      id: 'Sohm Al Hard Fireball',
      netRegex: NetRegexes.startsUsing({ id: '1C3B', source: 'Gowrow', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1C3B', source: 'Gowrow', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1C3B', source: 'Gowrow', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1C3B', source: 'ガウロウ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1C3B', source: '高牢怪龙', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      // Used only if Gowrow is empowered.
      id: 'Sohm Al Hard Lava Flow',
      netRegex: NetRegexes.startsUsing({ id: '1C3C', source: 'Gowrow', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1C3C', source: 'Gowrow', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1C3C', source: 'Gowrow', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1C3C', source: 'ガウロウ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1C3C', source: '高牢怪龙', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      // This cast is accompanied by a 0017 head marker on the target.
      // We use the cast line for this trigger because the timing is the same.
      id: 'Sohm Al Hard Flying Press',
      netRegex: NetRegexes.startsUsing({ id: '1C3E', source: 'Lava Scorpion' }),
      netRegexDe: NetRegexes.startsUsing({ id: '1C3E', source: 'Lavaskorpion' }),
      netRegexFr: NetRegexes.startsUsing({ id: '1C3E', source: 'scorpion de lave' }),
      netRegexJa: NetRegexes.startsUsing({ id: '1C3E', source: 'ラーヴァ・スコーピオン' }),
      netRegexCn: NetRegexes.startsUsing({ id: '1C3E', source: '熔岩蝎' }),
      condition: Conditions.targetIsYou(),
      alertText: {
        en: 'Drop puddle outside',
        de: 'Fläche draußen ablegen',
      },
    },
    {
      id: 'Sohm Al Hard Deadly Thrust',
      netRegex: NetRegexes.startsUsing({ id: ['1C40', '1C48'], source: ['Lava Scorpion', 'The Scorpion\'s Tail'] }),
      netRegexDe: NetRegexes.startsUsing({ id: ['1C40', '1C48'], source: ['Lavaskorpion', 'Schwanzskorpion'] }),
      netRegexFr: NetRegexes.startsUsing({ id: ['1C40', '1C48'], source: ['scorpion de lave', 'queue du scorpion'] }),
      netRegexJa: NetRegexes.startsUsing({ id: ['1C40', '1C48'], source: ['ラーヴァ・スコーピオン', 'Tテイル・スコーピオン'] }),
      netRegexCn: NetRegexes.startsUsing({ id: ['1C40', '1C48'], source: ['熔岩蝎', '尖尾蝎'] }),
      condition: function(data, matches) {
        return data.me == matches.target || data.role == 'tank' || data.role == 'healer';
      },
      response: Responses.tankBuster(),
    },
    {
      id: 'Sohm Al Hard Hiss',
      netRegex: NetRegexes.startsUsing({ id: '1C45', source: 'Lava Scorpion', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1C45', source: 'Lavaskorpion', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1C45', source: 'scorpion de lave', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1C45', source: 'ラーヴァ・スコーピオン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1C45', source: '熔岩蝎', capture: false }),
      response: Responses.killAdds(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'The Wound': 'Wunde',
        'The Fever': 'Das Fieber',
        'The Lava Tube': 'Lavagrotte',
        'The Scorpion\'s Tail': 'Schwanzskorpion',
        'The Leightonward': 'Hortigolem',
        '(?<! )Spore Sac': 'Sporensack',
        'Small Spore Sac': 'klein[a] Sporensack',
        'Lava Scorpion': 'Lavaskorpion',
        'Gowrow': 'Gowrow',
      },
      'replaceText': {
        'Wind Slash': 'Sichelschnitt',
        'Wild Horn': 'Wildes Horn',
        'Wild Charge': 'Wilde Rage',
        'Volcanic Howl': 'Vulkanischer Schrei',
        'Tail Swing': 'Schweifschwung',
        'Spore Sac': 'Sporensack',
        'Ripper Claw': 'Fetzklaue',
        'Realm Shaker': 'Erderschütterer',
        'Molten Silk': 'Geschmolzene Seide',
        'Lava Flow': 'Lavafluss',
        'Inflammable Fumes': 'Entzündliches Gas',
        'Hot Charge': 'Heiße Rage',
        'Hiss': 'Zischen',
        'Glorious Blaze': 'Zündung',
        'Flying Press': 'Flugdruck',
        'Fireball': 'Feuerball',
        'Excretion': 'Schleim',
        'Deadly Thrust': 'Tödliche Durchbohrung',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'The Wound': 'La Plaie',
        'The Fever': 'La Fièvre',
        'The Lava Tube': 'Tunnel de lave',
        'The Scorpion\'s Tail': 'queue du scorpion',
        'The Leightonward': 'Chortocyon',
        '(?<! )Spore Sac': 'sac de spores',
        'Small Spore Sac': 'petit sac de spores',
        'Lava Scorpion': 'scorpion de lave',
        'Gowrow': 'Gowrow',
      },
      'replaceText': {
        'Wind Slash': 'Rafale cinglante',
        'Wild Horn': 'Corne sauvage',
        'Wild Charge': 'Charge sauvage',
        'Volcanic Howl': 'Hurlement volcanique',
        'Tail Swing': 'Queue balayante',
        'Spore Sac': 'Sac de spores',
        'Ripper Claw': 'Griffe éventreuse',
        'Realm Shaker': 'Secousse tellurique',
        'Molten Silk': 'Soie en fusion',
        'Lava Flow': 'Flot de lave',
        'Inflammable Fumes': 'Gaz inflammable',
        'Hot Charge': 'Charge brûlante',
        'Hiss': 'Sifflet',
        'Glorious Blaze': 'Embrasement',
        'Flying Press': 'Aplatissement',
        'Fireball': 'Boule de feu',
        'Excretion': 'Mucus',
        'Deadly Thrust': 'Transpercement mortel',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'The Wound': '霊峰の傷',
        'The Fever': '炎獣の縄張り',
        'The Lava Tube': '大溶岩窟',
        'The Scorpion\'s Tail': 'テイル・スコーピオン',
        'The Leightonward': 'レイトンワード',
        '(?<! )Spore Sac': 'スポアサック',
        'Small Spore Sac': 'スモール・スポアサック',
        'Lava Scorpion': 'ラーヴァ・スコーピオン',
        'Gowrow': 'ガウロウ',
      },
      'replaceText': {
        'Wind Slash': 'かまいたち',
        'Wild Horn': 'ワイルドホーン',
        'Wild Charge': 'ワイルドチャージ',
        'Volcanic Howl': 'ヴォルカニックハウル',
        'Tail Swing': 'テールスイング',
        'Spore Sac': 'スポアサック',
        'Ripper Claw': 'リッパークロウ',
        'Realm Shaker': 'レルムシェーカー',
        'Molten Silk': 'モルテンシルク',
        'Lava Flow': 'ラーヴァフロウ',
        'Inflammable Fumes': '可燃性ガス',
        'Hot Charge': 'ホットチャージ',
        'Hiss': '呼び寄せ',
        'Glorious Blaze': '引火',
        'Flying Press': 'フライングプレス',
        'Fireball': 'ファイアボール',
        'Excretion': '粘液',
        'Deadly Thrust': 'デッドリースラスト',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'The Wound': '灵伤',
        'The Fever': '炎兽的领地',
        'The Lava Tube': '大熔岩窟',
        'The Scorpion\'s Tail': '尖尾蝎',
        'The Leightonward': '莱顿瓦德',
        '(?<! )Spore Sac': '孢囊',
        'Small Spore Sac': '小型孢囊',
        'Lava Scorpion': '熔岩蝎',
        'Gowrow': '高牢怪龙',
      },
      'replaceText': {
        'Wind Slash': '镰鼬之风',
        'Wild Horn': '野性利角',
        'Wild Charge': '狂野冲锋',
        'Volcanic Howl': '暴烈龙吼',
        'Tail Swing': '回旋尾',
        'Spore Sac': '孢囊',
        'Ripper Claw': '撕裂利爪',
        'Realm Shaker': '震撼领域',
        'Molten Silk': '炎丝喷射',
        'Lava Flow': '熔岩流',
        'Inflammable Fumes': '可燃性气体',
        'Hot Charge': '炽热冲锋',
        'Hiss': '呼唤',
        'Glorious Blaze': '引火',
        'Flying Press': '飞跃重压',
        'Fireball': '火球',
        'Excretion': '粘液',
        'Deadly Thrust': '致命尾刺',
      },
    },
  ],
}];

