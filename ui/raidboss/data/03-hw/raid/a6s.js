'use strict';

[{
  zoneRegex: /^Alexander - The Cuff Of The Son \(Savage\)$/,
  timelineFile: 'a6s.txt',
  triggers: [
    {
      id: 'A6S Magic Vulnerability Gain',
      regex: Regexes.gainsEffect({ effect: 'Magic Vulnerability Up' }),
      regexDe: Regexes.gainsEffect({ effect: 'Erhöhte Magie-Verwundbarkeit' }),
      regexFr: Regexes.gainsEffect({ effect: 'Vulnérabilité Magique Augmentée' }),
      regexJa: Regexes.gainsEffect({ effect: '被魔法ダメージ増加' }),
      regexCn: Regexes.gainsEffect({ effect: '魔法受伤加重' }),
      regexKo: Regexes.gainsEffect({ effect: '받는 마법 피해량 증가' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      run: function(data) {
        data.magicVulnerability = true;
      },
    },
    {
      id: 'A6S Magic Vulnerability Loss',
      regex: Regexes.losesEffect({ effect: 'Magic Vulnerability Up' }),
      regexDe: Regexes.losesEffect({ effect: 'Erhöhte Magie-Verwundbarkeit' }),
      regexFr: Regexes.losesEffect({ effect: 'Vulnérabilité Magique Augmentée' }),
      regexJa: Regexes.losesEffect({ effect: '被魔法ダメージ増加' }),
      regexCn: Regexes.losesEffect({ effect: '魔法受伤加重' }),
      regexKo: Regexes.losesEffect({ effect: '받는 마법 피해량 증가' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      run: function(data) {
        data.magicVulnerability = false;
      },
    },
    {
      id: 'A6S Mind Blast',
      regex: Regexes.startsUsing({ source: 'Blaster', id: '15F3', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Blaster', id: '15F3', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Fracasseur', id: '15F3', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ブラスター', id: '15F3', capture: false }),
      regexCn: Regexes.startsUsing({ source: '爆破者', id: '15F3', capture: false }),
      regexKo: Regexes.startsUsing({ source: '폭파자', id: '15F3', capture: false }),
      condition: function(data) {
        return data.CanSilence();
      },
      response: Responses.silence(),
    },
    {
      id: 'A6S Hidden Minefield',
      regex: Regexes.startsUsing({ source: 'Blaster', id: '15F7', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Blaster', id: '15F7', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Fracasseur', id: '15F7', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ブラスター', id: '15F7', capture: false }),
      regexCn: Regexes.startsUsing({ source: '爆破者', id: '15F7', capture: false }),
      regexKo: Regexes.startsUsing({ source: '폭파자', id: '15F7', capture: false }),
      infoText: function(data) {
        if (data.role == 'tank' && !data.magicVulnerability) {
          return {
            en: 'Get Mines',
          };
        }
        return {
          en: 'Avoid Mines',
        };
      },
    },
    {
      id: 'A6S Supercharge',
      regex: Regexes.startsUsing({ source: 'Blaster Mirage', id: '15FB', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Blaster-Replikant', id: '15FB', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Réplique Du Fracasseur', id: '15FB', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ブラスター・ミラージュ', id: '15FB', capture: false }),
      regexCn: Regexes.startsUsing({ source: '爆破者幻象', id: '15FB', capture: false }),
      regexKo: Regexes.startsUsing({ source: '폭파자의 환영', id: '15FB', capture: false }),
      suppressSeconds: 1,
      infoText: {
        en: 'Dodge Mirage Charge',
      },
    },
    {
      id: 'A6S Blinder',
      regex: Regexes.startsUsing({ source: 'Blaster Mirage', id: '15FC' }),
      regexDe: Regexes.startsUsing({ source: 'Blaster-Replikant', id: '15FC' }),
      regexFr: Regexes.startsUsing({ source: 'Réplique Du Fracasseur', id: '15FC' }),
      regexJa: Regexes.startsUsing({ source: 'ブラスター・ミラージュ', id: '15FC' }),
      regexCn: Regexes.startsUsing({ source: '爆破者幻象', id: '15FC' }),
      regexKo: Regexes.startsUsing({ source: '폭파자의 환영', id: '15FC' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Look Away from Mirage',
      },
    },
    {
      id: 'A6S Power Tackle',
      regex: Regexes.startsUsing({ source: 'Blaster Mirage', id: '15FD' }),
      regexDe: Regexes.startsUsing({ source: 'Blaster-Replikant', id: '15FD' }),
      regexFr: Regexes.startsUsing({ source: 'Réplique Du Fracasseur', id: '15FD' }),
      regexJa: Regexes.startsUsing({ source: 'ブラスター・ミラージュ', id: '15FD' }),
      regexCn: Regexes.startsUsing({ source: '爆破者幻象', id: '15FD' }),
      regexKo: Regexes.startsUsing({ source: '폭파자의 환영', id: '15FD' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Look Towards Mirage',
      },
    },
    {
      id: 'A6S Single Buster',
      regex: Regexes.ability({ source: 'Brawler', id: '1602' }),
      regexDe: Regexes.ability({ source: 'Blechbrecher', id: '1602' }),
      regexFr: Regexes.ability({ source: 'Bagarreur', id: '1602' }),
      regexJa: Regexes.ability({ source: 'ブロウラー', id: '1602' }),
      regexCn: Regexes.ability({ source: '争斗者', id: '1602' }),
      regexKo: Regexes.ability({ source: '폭격자', id: '1602' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      response: Responses.tankBuster(),
    },
    {
      id: 'A6S Double Buster',
      regex: Regexes.ability({ source: 'Brawler', id: '1603', capture: false }),
      regexDe: Regexes.ability({ source: 'Blechbrecher', id: '1603', capture: false }),
      regexFr: Regexes.ability({ source: 'Bagarreur', id: '1603', capture: false }),
      regexJa: Regexes.ability({ source: 'ブロウラー', id: '1603', capture: false }),
      regexCn: Regexes.ability({ source: '争斗者', id: '1603', capture: false }),
      regexKo: Regexes.ability({ source: '폭격자', id: '1603', capture: false }),
      infoText: {
        en: 'Double Buster: Group Soak',
      },
    },
    {
      id: 'A6S Rocket Drill',
      regex: Regexes.ability({ source: 'Brawler', id: '1604' }),
      regexDe: Regexes.ability({ source: 'Blechbrecher', id: '1604' }),
      regexFr: Regexes.ability({ source: 'Bagarreur', id: '1604' }),
      regexJa: Regexes.ability({ source: 'ブロウラー', id: '1604' }),
      regexCn: Regexes.ability({ source: '争斗者', id: '1604' }),
      regexKo: Regexes.ability({ source: '폭격자', id: '1604' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Get Away from Boss',
      },
    },
    {
      id: 'A6S Double Drill Crush',
      regex: Regexes.ability({ source: 'Brawler', id: '1605', capture: false }),
      regexDe: Regexes.ability({ source: 'Blechbrecher', id: '1605', capture: false }),
      regexFr: Regexes.ability({ source: 'Bagarreur', id: '1605', capture: false }),
      regexJa: Regexes.ability({ source: 'ブロウラー', id: '1605', capture: false }),
      regexCn: Regexes.ability({ source: '争斗者', id: '1605', capture: false }),
      regexKo: Regexes.ability({ source: '폭격자', id: '1605', capture: false }),
      condition: function(data) {
        return data.role == 'tank';
      },
      alarmText: {
        en: 'Double Drill: Be Near/Far',
      },
    },
    {
      id: 'A6S Low Arithmeticks',
      regex: Regexes.gainsEffect({ effect: 'Low Arithmeticks' }),
      regexDe: Regexes.gainsEffect({ effect: 'Biomathematik-Ebene 1' }),
      regexFr: Regexes.gainsEffect({ effect: 'Calcul de dénivelé 1' }),
      regexJa: Regexes.gainsEffect({ effect: '算術：ハイト1' }),
      regexCn: Regexes.gainsEffect({ effect: '算术：高度1' }),
      regexKo: Regexes.gainsEffect({ effect: '산술: 고도 1' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Go High',
      },
    },
    {
      id: 'A6S High Arithmeticks',
      regex: Regexes.gainsEffect({ effect: 'High Arithmeticks' }),
      regexDe: Regexes.gainsEffect({ effect: 'Biomathematik-Ebene 2' }),
      regexFr: Regexes.gainsEffect({ effect: 'Calcul de dénivelé 2' }),
      regexJa: Regexes.gainsEffect({ effect: '算術：ハイト2' }),
      regexCn: Regexes.gainsEffect({ effect: '算术：高度2' }),
      regexKo: Regexes.gainsEffect({ effect: '산술: 고도 2' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Go Low',
      },
    },
    {
      id: 'A6S Bio-arithmeticks',
      regex: Regexes.startsUsing({ source: 'Swindler', id: '1610', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Schwindler', id: '1610', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Arnaqueur', id: '1610', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'スウィンドラー', id: '1610', capture: false }),
      regexCn: Regexes.startsUsing({ source: '欺诈者', id: '1610', capture: false }),
      regexKo: Regexes.startsUsing({ source: '조작자', id: '1610', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'A6S Super Cyclone',
      regex: Regexes.startsUsing({ source: 'Vortexer', id: '1627', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Wirbler', id: '1627', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Tourbillonneur', id: '1627', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ボルテッカー', id: '1627', capture: false }),
      regexCn: Regexes.startsUsing({ source: '环旋者', id: '1627', capture: false }),
      regexKo: Regexes.startsUsing({ source: '교반자', id: '1627', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'A6S Ultra Flash',
      regex: Regexes.startsUsing({ source: 'Vortexer', id: '161A', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Wirbler', id: '161A', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Tourbillonneur', id: '161A', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ボルテッカー', id: '161A', capture: false }),
      regexCn: Regexes.startsUsing({ source: '环旋者', id: '161A', capture: false }),
      regexKo: Regexes.startsUsing({ source: '교반자', id: '161A', capture: false }),
      alertText: {
        en: 'Hide Behind Tornado',
      },
    },
    {
      id: 'A6S Ice Marker',
      regex: Regexes.headMarker({ id: '0043' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alarmText: {
        en: 'Ice Missile on YOU',
      },
    },
    {
      id: 'A6S Compressed Water Initial',
      regex: Regexes.gainsEffect({ effect: 'Compressed Water' }),
      regexDe: Regexes.gainsEffect({ effect: 'Wasserkompression' }),
      regexFr: Regexes.gainsEffect({ effect: 'Compression aqueuse' }),
      regexJa: Regexes.gainsEffect({ effect: '水属性圧縮' }),
      regexCn: Regexes.gainsEffect({ effect: '水属性压缩' }),
      regexKo: Regexes.gainsEffect({ effect: '물속성 압축' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Water on YOU',
        de: 'Wasser auf DIR',
        ja: '自分に水',
      },
    },
    {
      id: 'A6S Compressed Water Explode',
      regex: Regexes.gainsEffect({ effect: 'Compressed Water' }),
      regexDe: Regexes.gainsEffect({ effect: 'Wasserkompression' }),
      regexFr: Regexes.gainsEffect({ effect: 'Compression aqueuse' }),
      regexJa: Regexes.gainsEffect({ effect: '水属性圧縮' }),
      regexCn: Regexes.gainsEffect({ effect: '水属性压缩' }),
      regexKo: Regexes.gainsEffect({ effect: '물속성 압축' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      delaySeconds: function(data, matches) {
        // 5 second warning.
        return parseFloat(matches.duration) - 5;
      },
      alertText: {
        en: 'Drop Water Soon',
        de: 'Gleich Wasser ablegen',
        ja: '水来るよ',
      },
    },
    {
      id: 'A6S Compressed Lightning Initial',
      regex: Regexes.gainsEffect({ effect: 'Compressed Lightning' }),
      regexDe: Regexes.gainsEffect({ effect: 'Blitzkompression' }),
      regexFr: Regexes.gainsEffect({ effect: 'Compression électrique' }),
      regexJa: Regexes.gainsEffect({ effect: '雷属性圧縮' }),
      regexCn: Regexes.gainsEffect({ effect: '雷属性压缩' }),
      regexKo: Regexes.gainsEffect({ effect: '번개속성 압축' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Lightning on YOU',
        de: 'Blitz auf DIR',
        ja: '自分に雷',
      },
    },
    {
      id: 'A6S Compressed Lightning Explode',
      regex: Regexes.gainsEffect({ effect: 'Compressed Lightning' }),
      regexDe: Regexes.gainsEffect({ effect: 'Blitzkompression' }),
      regexFr: Regexes.gainsEffect({ effect: 'Compression électrique' }),
      regexJa: Regexes.gainsEffect({ effect: '雷属性圧縮' }),
      regexCn: Regexes.gainsEffect({ effect: '雷属性压缩' }),
      regexKo: Regexes.gainsEffect({ effect: '번개속성 압축' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      delaySeconds: function(data, matches) {
        // 5 second warning.
        return parseFloat(matches.duration) - 5;
      },
      alertText: {
        en: 'Drop Lightning Soon',
        de: 'Gleich Blitz ablegen',
        ja: '雷来るよ',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Added combatant Midan Gunner': 'Added combatant Midan Gunner', // FIXME
        'Added combatant Midan Hardhelm': 'Added combatant Midan Hardhelm', // FIXME
        'Added new combatant Blaster Mirage': 'Added new combatant Blaster Mirage', // FIXME
        'Added new combatant Power Plasma Alpha': 'Added new combatant Power Plasma Alpha', // FIXME
        'Added new combatant Power Plasma Beta': 'Added new combatant Power Plasma Beta', // FIXME
        'Added new combatant Power Plasma Gamma': 'Added new combatant Power Plasma Gamma', // FIXME
        'Blaster uses Ballistic Missile': 'Blaster uses Ballistic Missile', // FIXME
        'Machinery Bay 67 is no longer sealed': 'Machinery Bay 67 is no longer sealed', // FIXME
        'Machinery Bay 67 will be sealed off in 15 seconds': 'bis sich der Zugang zu[rm]? Kampfmaschinen-Baracke 67 schließt',
        'Machinery Bay 68 is no longer sealed': 'Machinery Bay 68 is no longer sealed', // FIXME
        'Machinery Bay 68 will be sealed off in 15 seconds': 'bis sich der Zugang zu[rm]? Kampfmaschinen-Baracke 68 schließt',
        'Machinery Bay 69 is no longer sealed': 'Machinery Bay 69 is no longer sealed', // FIXME
        'Machinery Bay 69 will be sealed off in 15 seconds': 'bis sich der Zugang zu[rm]? Kampfmaschinen-Baracke 69 schließt',
        'Machinery Bay 70 is no longer sealed': 'Machinery Bay 70 is no longer sealed', // FIXME
        'Machinery Bay 70 will be sealed off in 15 seconds': 'bis sich der Zugang zu[rm]? Kampfmaschinen-Baracke 70 schließt',
        'uses Elemental Jammer': 'uses Elemental Jammer', // FIXME
      },
      'replaceText': {
        '--Reset--': '--Reset--',
        '--Start--': '--Start--', // FIXME
        'Adds Spawn': 'Adds Spawn', // FIXME
        'AoE': 'AoE', // FIXME
        'Attachment': 'Anlegen',
        'Behind Pillar': 'Behind Pillar', // FIXME
        'Brute Force': 'Brutaler Schlag',
        'Burn Adds': 'Burn Adds', // FIXME
        'Charge Mirages': 'Charge Mirages', // FIXME
        'Element Stacks': 'Element Stacks', // FIXME
        'Elemental Jammer': 'Elementarstörer',
        'Fire Stack': 'Fire Stack', // FIXME
        'Gunners Spawn': 'Gunners Spawn', // FIXME
        'Height': 'Nivellierung',
        'Ice Marks': 'Ice Marks', // FIXME
        'Knockback': 'Knockback', // FIXME
        'Magic Vuln': 'Magic Vuln', // FIXME
        'Mind Blast': 'Geiststoß',
        'Mines': 'Mines', // FIXME
        'Spread': 'Ablegen',
        'Stacks': 'Die Stämme',
        'Tether Mirages': 'Tether Mirages', // FIXME
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Added combatant Midan Gunner': 'Added combatant Midan Gunner', // FIXME
        'Added combatant Midan Hardhelm': 'Added combatant Midan Hardhelm', // FIXME
        'Added new combatant Blaster Mirage': 'Added new combatant Blaster Mirage', // FIXME
        'Added new combatant Power Plasma Alpha': 'Added new combatant Power Plasma Alpha', // FIXME
        'Added new combatant Power Plasma Beta': 'Added new combatant Power Plasma Beta', // FIXME
        'Added new combatant Power Plasma Gamma': 'Added new combatant Power Plasma Gamma', // FIXME
        'Blaster uses Ballistic Missile': 'Blaster uses Ballistic Missile', // FIXME
        'Machinery Bay 67 is no longer sealed': 'Machinery Bay 67 is no longer sealed', // FIXME
        'Machinery Bay 67 will be sealed off in 15 seconds': 'Machinery Bay 67 will be sealed off in 15 seconds', // FIXME
        'Machinery Bay 68 is no longer sealed': 'Machinery Bay 68 is no longer sealed', // FIXME
        'Machinery Bay 68 will be sealed off in 15 seconds': 'Machinery Bay 68 will be sealed off in 15 seconds', // FIXME
        'Machinery Bay 69 is no longer sealed': 'Machinery Bay 69 is no longer sealed', // FIXME
        'Machinery Bay 69 will be sealed off in 15 seconds': 'Machinery Bay 69 will be sealed off in 15 seconds', // FIXME
        'Machinery Bay 70 is no longer sealed': 'Machinery Bay 70 is no longer sealed', // FIXME
        'Machinery Bay 70 will be sealed off in 15 seconds': 'Machinery Bay 70 will be sealed off in 15 seconds', // FIXME
        'uses Elemental Jammer': 'uses Elemental Jammer', // FIXME
      },
      'replaceText': {
        '--Reset--': '--Réinitialisation--',
        '--Start--': '--Start--', // FIXME
        'Adds Spawn': 'Adds Spawn', // FIXME
        'AoE': 'AoE', // FIXME
        'Attachment': 'Extension',
        'Behind Pillar': 'Behind Pillar', // FIXME
        'Brute Force': 'Force brute',
        'Burn Adds': 'Burn Adds', // FIXME
        'Charge Mirages': 'Charge Mirages', // FIXME
        'Element Stacks': 'Element Stacks', // FIXME
        'Elemental Jammer': 'Grippage élémentaire',
        'Fire Stack': 'Fire Stack', // FIXME
        'Gunners Spawn': 'Gunners Spawn', // FIXME
        'Height': 'Dénivellation',
        'Ice Marks': 'Ice Marks', // FIXME
        'Knockback': 'Knockback', // FIXME
        'Magic Vuln': 'Magic Vuln', // FIXME
        'Mind Blast': 'Explosion mentale',
        'Mines': 'Mines', // FIXME
        'Spread': 'Ajout',
        'Stacks': 'Les Rondins',
        'Tether Mirages': 'Tether Mirages', // FIXME
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Added combatant Midan Gunner': 'Added combatant Midan Gunner', // FIXME
        'Added combatant Midan Hardhelm': 'Added combatant Midan Hardhelm', // FIXME
        'Added new combatant Blaster Mirage': 'Added new combatant Blaster Mirage', // FIXME
        'Added new combatant Power Plasma Alpha': 'Added new combatant Power Plasma Alpha', // FIXME
        'Added new combatant Power Plasma Beta': 'Added new combatant Power Plasma Beta', // FIXME
        'Added new combatant Power Plasma Gamma': 'Added new combatant Power Plasma Gamma', // FIXME
        'Blaster uses Ballistic Missile': 'Blaster uses Ballistic Missile', // FIXME
        'Machinery Bay 67 is no longer sealed': 'Machinery Bay 67 is no longer sealed', // FIXME
        'Machinery Bay 67 will be sealed off in 15 seconds': 'Machinery Bay 67 will be sealed off in 15 seconds', // FIXME
        'Machinery Bay 68 is no longer sealed': 'Machinery Bay 68 is no longer sealed', // FIXME
        'Machinery Bay 68 will be sealed off in 15 seconds': 'Machinery Bay 68 will be sealed off in 15 seconds', // FIXME
        'Machinery Bay 69 is no longer sealed': 'Machinery Bay 69 is no longer sealed', // FIXME
        'Machinery Bay 69 will be sealed off in 15 seconds': 'Machinery Bay 69 will be sealed off in 15 seconds', // FIXME
        'Machinery Bay 70 is no longer sealed': 'Machinery Bay 70 is no longer sealed', // FIXME
        'Machinery Bay 70 will be sealed off in 15 seconds': 'Machinery Bay 70 will be sealed off in 15 seconds', // FIXME
        'uses Elemental Jammer': 'uses Elemental Jammer', // FIXME
      },
      'replaceText': {
        '--Reset--': '--Reset--',
        '--Start--': '--Start--', // FIXME
        'Adds Spawn': 'Adds Spawn', // FIXME
        'AoE': 'AoE', // FIXME
        'Attachment': 'アタッチメント',
        'Behind Pillar': 'Behind Pillar', // FIXME
        'Brute Force': 'ブルートパンチ',
        'Burn Adds': 'Burn Adds', // FIXME
        'Charge Mirages': 'Charge Mirages', // FIXME
        'Element Stacks': 'Element Stacks', // FIXME
        'Elemental Jammer': 'エレメンタルジャミング',
        'Fire Stack': 'Fire Stack', // FIXME
        'Gunners Spawn': 'Gunners Spawn', // FIXME
        'Height': 'ハイト',
        'Ice Marks': 'Ice Marks', // FIXME
        'Knockback': 'Knockback', // FIXME
        'Magic Vuln': 'Magic Vuln', // FIXME
        'Mind Blast': 'マインドブラスト',
        'Mines': 'Mines', // FIXME
        'Spread': 'キープ',
        'Stacks': 'スタックス跡',
        'Tether Mirages': 'Tether Mirages', // FIXME
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Added combatant Midan Gunner': 'Added combatant Midan Gunner', // FIXME
        'Added combatant Midan Hardhelm': 'Added combatant Midan Hardhelm', // FIXME
        'Added new combatant Blaster Mirage': 'Added new combatant Blaster Mirage', // FIXME
        'Added new combatant Power Plasma Alpha': 'Added new combatant Power Plasma Alpha', // FIXME
        'Added new combatant Power Plasma Beta': 'Added new combatant Power Plasma Beta', // FIXME
        'Added new combatant Power Plasma Gamma': 'Added new combatant Power Plasma Gamma', // FIXME
        'Blaster uses Ballistic Missile': 'Blaster uses Ballistic Missile', // FIXME
        'Machinery Bay 67 is no longer sealed': 'Machinery Bay 67 is no longer sealed', // FIXME
        'Machinery Bay 67 will be sealed off in 15 seconds': 'Machinery Bay 67 will be sealed off in 15 seconds', // FIXME
        'Machinery Bay 68 is no longer sealed': 'Machinery Bay 68 is no longer sealed', // FIXME
        'Machinery Bay 68 will be sealed off in 15 seconds': 'Machinery Bay 68 will be sealed off in 15 seconds', // FIXME
        'Machinery Bay 69 is no longer sealed': 'Machinery Bay 69 is no longer sealed', // FIXME
        'Machinery Bay 69 will be sealed off in 15 seconds': 'Machinery Bay 69 will be sealed off in 15 seconds', // FIXME
        'Machinery Bay 70 is no longer sealed': 'Machinery Bay 70 is no longer sealed', // FIXME
        'Machinery Bay 70 will be sealed off in 15 seconds': 'Machinery Bay 70 will be sealed off in 15 seconds', // FIXME
        'uses Elemental Jammer': 'uses Elemental Jammer', // FIXME
      },
      'replaceText': {
        '--Reset--': '--Reset--', // FIXME
        '--Start--': '--Start--', // FIXME
        'Adds Spawn': 'Adds Spawn', // FIXME
        'AoE': 'AoE', // FIXME
        'Attachment': '配件更换',
        'Behind Pillar': 'Behind Pillar', // FIXME
        'Brute Force': '残暴铁拳',
        'Burn Adds': 'Burn Adds', // FIXME
        'Charge Mirages': 'Charge Mirages', // FIXME
        'Element Stacks': 'Element Stacks', // FIXME
        'Elemental Jammer': '元素干扰',
        'Fire Stack': 'Fire Stack', // FIXME
        'Gunners Spawn': 'Gunners Spawn', // FIXME
        'Height': '高度算术',
        'Ice Marks': 'Ice Marks', // FIXME
        'Knockback': 'Knockback', // FIXME
        'Magic Vuln': 'Magic Vuln', // FIXME
        'Mind Blast': '精神冲击',
        'Mines': 'Mines', // FIXME
        'Spread': '暂留',
        'Stacks': '柴堆村',
        'Tether Mirages': 'Tether Mirages', // FIXME
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Added combatant Midan Gunner': 'Added combatant Midan Gunner', // FIXME
        'Added combatant Midan Hardhelm': 'Added combatant Midan Hardhelm', // FIXME
        'Added new combatant Blaster Mirage': 'Added new combatant Blaster Mirage', // FIXME
        'Added new combatant Power Plasma Alpha': 'Added new combatant Power Plasma Alpha', // FIXME
        'Added new combatant Power Plasma Beta': 'Added new combatant Power Plasma Beta', // FIXME
        'Added new combatant Power Plasma Gamma': 'Added new combatant Power Plasma Gamma', // FIXME
        'Blaster uses Ballistic Missile': 'Blaster uses Ballistic Missile', // FIXME
        'Machinery Bay 67 is no longer sealed': 'Machinery Bay 67 is no longer sealed', // FIXME
        'Machinery Bay 67 will be sealed off in 15 seconds': 'Machinery Bay 67 will be sealed off in 15 seconds', // FIXME
        'Machinery Bay 68 is no longer sealed': 'Machinery Bay 68 is no longer sealed', // FIXME
        'Machinery Bay 68 will be sealed off in 15 seconds': 'Machinery Bay 68 will be sealed off in 15 seconds', // FIXME
        'Machinery Bay 69 is no longer sealed': 'Machinery Bay 69 is no longer sealed', // FIXME
        'Machinery Bay 69 will be sealed off in 15 seconds': 'Machinery Bay 69 will be sealed off in 15 seconds', // FIXME
        'Machinery Bay 70 is no longer sealed': 'Machinery Bay 70 is no longer sealed', // FIXME
        'Machinery Bay 70 will be sealed off in 15 seconds': 'Machinery Bay 70 will be sealed off in 15 seconds', // FIXME
        'uses Elemental Jammer': 'uses Elemental Jammer', // FIXME
      },
      'replaceText': {
        '--Reset--': '--Reset--', // FIXME
        '--Start--': '--Start--', // FIXME
        'Adds Spawn': 'Adds Spawn', // FIXME
        'AoE': 'AoE', // FIXME
        'Attachment': '무기 장착',
        'Behind Pillar': 'Behind Pillar', // FIXME
        'Brute Force': '폭력적인 주먹',
        'Burn Adds': 'Burn Adds', // FIXME
        'Charge Mirages': 'Charge Mirages', // FIXME
        'Element Stacks': 'Element Stacks', // FIXME
        'Elemental Jammer': '원소 간섭',
        'Fire Stack': 'Fire Stack', // FIXME
        'Gunners Spawn': 'Gunners Spawn', // FIXME
        'Height': '고도',
        'Ice Marks': 'Ice Marks', // FIXME
        'Knockback': 'Knockback', // FIXME
        'Magic Vuln': 'Magic Vuln', // FIXME
        'Mind Blast': '정신파괴',
        'Mines': 'Mines', // FIXME
        'Spread': '보류',
        'Stacks': '장작마을 옛터',
        'Tether Mirages': 'Tether Mirages', // FIXME
      },
    },
  ],
}];
