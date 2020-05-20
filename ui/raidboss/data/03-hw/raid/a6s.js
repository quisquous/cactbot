'use strict';

[{
  zoneRegex: {
    en: /^Alexander - The Cuff Of The Son \(Savage\)$/,
    cn: /^亚历山大零式机神城 \(律动之章2\)$/,
  },
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
      regex: Regexes.startsUsing({ source: 'Blaster', id: '15F3' }),
      regexDe: Regexes.startsUsing({ source: 'Blaster', id: '15F3' }),
      regexFr: Regexes.startsUsing({ source: 'Fracasseur', id: '15F3' }),
      regexJa: Regexes.startsUsing({ source: 'ブラスター', id: '15F3' }),
      regexCn: Regexes.startsUsing({ source: '爆破者', id: '15F3' }),
      regexKo: Regexes.startsUsing({ source: '폭파자', id: '15F3' }),
      condition: function(data) {
        return data.CanSilence();
      },
      response: Responses.interrupt(),
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
            de: 'Mienen nehmen',
            fr: 'Prenez les mines',
            cn: '踩雷',
          };
        }
        return {
          en: 'Avoid Mines',
          de: 'Mienen vermeiden',
          fr: 'Évitez les mines',
          cn: '躲开地雷',
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
        de: 'Superladung ausweichen',
        fr: 'Esquivez la charge de la réplique',
        cn: '躲开冲锋',
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
        de: 'Von Replikant wegschauen',
        fr: 'Ne regardez pas la réplique',
        cn: '背对幻象',
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
        de: 'Von Replikant hinschauen',
        fr: 'Regardez la réplique',
        cn: '面向幻象',
      },
    },
    {
      id: 'A6S Single Buster',
      regex: Regexes.startsUsing({ source: 'Brawler', id: '1602' }),
      regexDe: Regexes.startsUsing({ source: 'Blechbrecher', id: '1602' }),
      regexFr: Regexes.startsUsing({ source: 'Bagarreur', id: '1602' }),
      regexJa: Regexes.startsUsing({ source: 'ブロウラー', id: '1602' }),
      regexCn: Regexes.startsUsing({ source: '争斗者', id: '1602' }),
      regexKo: Regexes.startsUsing({ source: '폭격자', id: '1602' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      response: Responses.tankBuster(),
    },
    {
      id: 'A6S Double Buster',
      regex: Regexes.startsUsing({ source: 'Brawler', id: '1603', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Blechbrecher', id: '1603', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Bagarreur', id: '1603', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ブロウラー', id: '1603', capture: false }),
      regexCn: Regexes.startsUsing({ source: '争斗者', id: '1603', capture: false }),
      regexKo: Regexes.startsUsing({ source: '폭격자', id: '1603', capture: false }),
      infoText: {
        en: 'Double Buster: Group Soak',
        de: 'Doppel Buster: Gruppe sammeln',
        fr: 'Double buster: Packez-vous',
        cn: '面向幻象',
      },
    },
    {
      id: 'A6S Rocket Drill',
      regex: Regexes.startsUsing({ source: 'Brawler', id: '1604' }),
      regexDe: Regexes.startsUsing({ source: 'Blechbrecher', id: '1604' }),
      regexFr: Regexes.startsUsing({ source: 'Bagarreur', id: '1604' }),
      regexJa: Regexes.startsUsing({ source: 'ブロウラー', id: '1604' }),
      regexCn: Regexes.startsUsing({ source: '争斗者', id: '1604' }),
      regexKo: Regexes.startsUsing({ source: '폭격자', id: '1604' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Get Away from Boss',
        de: 'Gehe weit weg vom Boss',
        fr: 'Éloignez-vous du boss',
        cn: '背后分摊',
      },
    },
    {
      id: 'A6S Double Drill Crush',
      regex: Regexes.startsUsing({ source: 'Brawler', id: '1605', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Blechbrecher', id: '1605', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Bagarreur', id: '1605', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ブロウラー', id: '1605', capture: false }),
      regexCn: Regexes.startsUsing({ source: '争斗者', id: '1605', capture: false }),
      regexKo: Regexes.startsUsing({ source: '폭격자', id: '1605', capture: false }),
      condition: function(data) {
        return data.role == 'tank';
      },
      alarmText: {
        en: 'Double Drill: Be Near/Far',
        de: 'Doppel Bohrer: Sei weit weg/nah dran',
        fr: 'Double foreuse : Soyez loin/près',
        cn: '靠近或远离',
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
        de: 'Geh Hoch',
        fr: 'Allez en haut',
        cn: '上高台',
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
        de: 'Geh Runter',
        fr: 'Allez en bas',
        cn: '下低台',
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
        de: 'Hinter Tornado verstecken',
        fr: 'Cachez-vous derrière la tornade',
        cn: '躲在冰块后',
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
        de: 'Eis Rakete auf DIR',
        fr: 'Missile de glace sur VOUS',
        cn: '冰导弹点名',
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
        fr: 'Eau sur VOUS',
        ja: '自分に水',
        cn: '水点名',
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
        fr: 'Posez l\'eau bientôt',
        ja: '水来るよ',
        cn: '马上水分摊',
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
        fr: 'Éclair sur VOUS',
        ja: '自分に雷',
        cn: '雷点名',
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
        fr: 'Déposez l\'éclair bientôt',
        ja: '雷来るよ',
        cn: '马上雷分摊',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Ballistic Missile': 'Ballistische Rakete',
        'Blaster(?! Mirage)': 'Blaster',
        'Blaster Mirage': 'Blaster-Replikant',
        'Brawler': 'Blechbrecher',
        'Elemental Jammer': 'Elementarstörer',
        'Machinery Bay 67': 'Kampfmaschinen-Baracke 67',
        'Machinery Bay 68': 'Kampfmaschinen-Baracke 68',
        'Machinery Bay 69': 'Kampfmaschinen-Baracke 69',
        'Machinery Bay 70': 'Kampfmaschinen-Baracke 70',
        'Midan Gunner': 'Midas-Schütze',
        'Midan Hardhelm': 'Midas-Harthelm',
        'Power Plasma Alpha': 'Kraftplasma Alpha',
        'Power Plasma Beta': 'Kraftplasma Beta',
        'Power Plasma Gamma': 'Kraftplasma Gamma',
        'Swindler': 'Schwindler',
        'Vortexer': 'Wirbler',
      },
      'replaceText': {
        'Adds Spawn': 'Adds erscheinen',
        'AoE': 'AoE',
        'Attachment': 'Anlegen',
        'Behind Pillar': 'Hinter den Beinen',
        'Brute Force': 'Brutaler Schlag',
        'Burn Adds': 'Adds besiegen',
        'Charge Mirages': 'Replikant-Ansturm',
        'Elemental Jammer': 'Elementarstörer',
        'Fire Stack': 'Feuer Flächen',
        'Gunners Spawn': 'Schützen erscheinen',
        'Height': 'Nivellierung',
        'Ice Marks': 'Eis-Markierungen',
        'Magic Vuln': 'Magie-Verwundbarkeit',
        'Mind Blast': 'Geiststoß',
        'Mines': 'Minen',
        'Spread': 'Verteilen',
        'Stacks': 'Gruppen sammeln',
        'Tether Mirages': 'Replikant-Verbindungen',
      },
      '~effectNames': {
        'Compressed Lightning': 'Blitzkompression',
        'Compressed Water': 'Wasserkompression',
        'High Arithmeticks': 'Biomathematik-Ebene 2',
        'Low Arithmeticks': 'Biomathematik-Ebene 1',
        'Magic Vulnerability Up': 'Erhöhte Magie-Verwundbarkeit',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Ballistic Missile': 'Missile balistique',
        'Blaster(?! Mirage)': 'Fracasseur',
        'Blaster Mirage': 'Réplique du Fracasseur',
        'Brawler': 'Bagarreur',
        'Elemental Jammer': 'Grippage élémentaire',
        'Machinery Bay 67': 'hangar d\'armement HA-67',
        'Machinery Bay 68': 'hangar d\'armement HA-68',
        'Machinery Bay 69': 'hangar d\'armement HA-69',
        'Machinery Bay 70': 'hangar d\'armement HA-70',
        'Midan Gunner': 'Canonnier midin',
        'Midan Hardhelm': 'Casque-dur midin',
        'Power Plasma Alpha': 'Plasma puissant α',
        'Power Plasma Beta': 'Plasma puissant β',
        'Power Plasma Gamma': 'Plasma puissant γ',
        'Swindler': 'Arnaqueur',
        'Vortexer': 'Tourbillonneur',
      },
      'replaceText': {
        'Adds Spawn': 'Apparition d\'Adds',
        'AoE': 'AoE',
        'Attachment': 'Extension',
        'Behind Pillar': 'Derrière l\'iceberg',
        'Brute Force': 'Force brute',
        'Burn Adds': 'Burn Adds',
        'Charge Mirages': 'Charge Répliques',
        'Elemental Jammer': 'Grippage élémentaire',
        'Element Stacks': 'Package Debuff eau',
        'Fire Stack': 'Package Zones au sol',
        'Gunners Spawn': 'Apparition des Canonniers',
        '(?<! )Height': 'Dénivellation',
        'Ice Marks': 'Marques de glace',
        'Knockback \\& Stacks': 'Poussée & Package',
        'Magic Vuln': 'Vulnérabilité magique',
        'Mind Blast': 'Explosion mentale',
        'Mines': 'Mines',
        'Spread': 'Dispersion',
        '(?<! )Stacks': 'Package',
        'Stacks \\+(?! Height)': 'Package + Dénivellation',
        'Tether Mirages': 'Lien Répliques',
      },
      '~effectNames': {
        'Compressed Lightning': 'Compression électrique',
        'Compressed Water': 'Compression aqueuse',
        'High Arithmeticks': 'Calcul de dénivelé 2',
        'Low Arithmeticks': 'Calcul de dénivelé 1',
        'Magic Vulnerability Up': 'Vulnérabilité magique augmentée',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Ballistic Missile': 'バリスティックミサイル',
        'Blaster(?! Mirage)': 'ブラスター',
        'Blaster Mirage': 'ブラスター・ミラージュ',
        'Brawler': 'ブロウラー',
        'Elemental Jammer': 'エレメンタルジャミング',
        'Machinery Bay 67': '第67機工兵格納庫',
        'Machinery Bay 68': '第68機工兵格納庫',
        'Machinery Bay 69': '第69機工兵格納庫',
        'Machinery Bay 70': '第70機工兵格納庫',
        'Midan Gunner': 'ミダース・ガンナー',
        'Midan Hardhelm': 'ミダース・ハードヘルム',
        'Power Plasma Alpha': 'パワープラズマα',
        'Power Plasma Beta': 'パワープラズマβ',
        'Power Plasma Gamma': 'パワープラズマγ',
        'Swindler': 'スウィンドラー',
        'Vortexer': 'ボルテッカー',
      },
      'replaceText': {
        'Attachment': 'アタッチメント',
        'Brute Force': 'ブルートパンチ',
        'Elemental Jammer': 'エレメンタルジャミング',
        'Height': 'ハイト',
        'Mind Blast': 'マインドブラスト',
      },
      '~effectNames': {
        'Compressed Lightning': '雷属性圧縮',
        'Compressed Water': '水属性圧縮',
        'High Arithmeticks': '算術：ハイト2',
        'Low Arithmeticks': '算術：ハイト1',
        'Magic Vulnerability Up': '被魔法ダメージ増加',
      },
    },
    {
      'locale': 'cn',
      'missingTranslations': true,
      'replaceSync': {
        'Ballistic Missile': '弹道导弹',
        'Blaster(?! Mirage)': '冲击波',
        'Blaster Mirage': '爆破者幻象',
        'Brawler': '争斗者',
        'Elemental Jammer': '元素干扰',
        'Machinery Bay 67': '第67机工兵仓库',
        'Machinery Bay 68': '第68机工兵仓库',
        'Machinery Bay 69': '第69机工兵仓库',
        'Machinery Bay 70': '第70机工兵仓库',
        'Midan Gunner': '弥达斯炮手',
        'Midan Hardhelm': '弥达斯硬盔兵',
        'Power Plasma Alpha': '强离子体α',
        'Power Plasma Beta': '强离子体β',
        'Power Plasma Gamma': '强离子体γ',
        'Swindler': '欺诈者',
        'Vortexer': '环旋者',
      },
      'replaceText': {
        'Attachment': '配件更换',
        'Brute Force': '残暴铁拳',
        'Elemental Jammer': '元素干扰',
        'Height': '高度算术',
        'Mind Blast': '精神冲击',
      },
      '~effectNames': {
        'Compressed Lightning': '雷属性压缩',
        'Compressed Water': '水属性压缩',
        'High Arithmeticks': '算术：高度2',
        'Low Arithmeticks': '算术：高度1',
        'Magic Vulnerability Up': '魔法受伤加重',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {
        'Ballistic Missile': '탄도 미사일',
        'Blaster(?! Mirage)': '블래스터',
        'Blaster Mirage': '폭파자의 환영',
        'Brawler': '폭격자',
        'Elemental Jammer': '원소 간섭',
        'Machinery Bay 67': '제67기공병 격납고',
        'Machinery Bay 68': '제68기공병 격납고',
        'Machinery Bay 69': '제69기공병 격납고',
        'Machinery Bay 70': '제70기공병 격납고',
        'Midan Gunner': '미다스 총잡이',
        'Midan Hardhelm': '미다스 강화투구',
        'Power Plasma Alpha': '파워 플라스마 α',
        'Power Plasma Beta': '파워 플라스마 β',
        'Power Plasma Gamma': '파워 플라스마 γ',
        'Swindler': '조작자',
        'Vortexer': '교반자',
      },
      'replaceText': {
        'Attachment': '무기 장착',
        'Brute Force': '폭력적인 주먹',
        'Elemental Jammer': '원소 간섭',
        'Height': '고도',
        'Mind Blast': '정신파괴',
      },
      '~effectNames': {
        'Compressed Lightning': '번개속성 압축',
        'Compressed Water': '물속성 압축',
        'High Arithmeticks': '산술: 고도 2',
        'Low Arithmeticks': '산술: 고도 1',
        'Magic Vulnerability Up': '받는 마법 피해량 증가',
      },
    },
  ],
}];
