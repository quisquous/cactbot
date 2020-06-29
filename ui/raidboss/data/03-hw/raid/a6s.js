'use strict';

[{
  zoneRegex: {
    en: /^Alexander - The Cuff Of The Son \(Savage\)$/,
    cn: /^亚历山大零式机神城 \(律动之章2\)$/,
  },
  zoneId: ZoneId.AlexanderTheCuffOfTheSonSavage,
  timelineFile: 'a6s.txt',
  triggers: [
    {
      id: 'A6S Magic Vulnerability Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: '292' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      run: function(data) {
        data.magicVulnerability = true;
      },
    },
    {
      id: 'A6S Magic Vulnerability Loss',
      netRegex: NetRegexes.losesEffect({ effectId: '292' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      run: function(data) {
        data.magicVulnerability = false;
      },
    },
    {
      id: 'A6S Mind Blast',
      netRegex: NetRegexes.startsUsing({ source: 'Blaster', id: '15F3' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Blaster', id: '15F3' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Fracasseur', id: '15F3' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ブラスター', id: '15F3' }),
      netRegexCn: NetRegexes.startsUsing({ source: '爆破者', id: '15F3' }),
      netRegexKo: NetRegexes.startsUsing({ source: '폭파자', id: '15F3' }),
      condition: function(data) {
        return data.CanSilence();
      },
      response: Responses.interrupt(),
    },
    {
      id: 'A6S Hidden Minefield',
      netRegex: NetRegexes.startsUsing({ source: 'Blaster', id: '15F7', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Blaster', id: '15F7', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Fracasseur', id: '15F7', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ブラスター', id: '15F7', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '爆破者', id: '15F7', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '폭파자', id: '15F7', capture: false }),
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
          fr: 'Evitez les mines',
          cn: '躲开地雷',
        };
      },
    },
    {
      id: 'A6S Supercharge',
      netRegex: NetRegexes.startsUsing({ source: 'Blaster Mirage', id: '15FB', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Blaster-Replikant', id: '15FB', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Réplique Du Fracasseur', id: '15FB', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ブラスター・ミラージュ', id: '15FB', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '爆破者幻象', id: '15FB', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '폭파자의 환영', id: '15FB', capture: false }),
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
      netRegex: NetRegexes.startsUsing({ source: 'Blaster Mirage', id: '15FC' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Blaster-Replikant', id: '15FC' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Réplique Du Fracasseur', id: '15FC' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ブラスター・ミラージュ', id: '15FC' }),
      netRegexCn: NetRegexes.startsUsing({ source: '爆破者幻象', id: '15FC' }),
      netRegexKo: NetRegexes.startsUsing({ source: '폭파자의 환영', id: '15FC' }),
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
      netRegex: NetRegexes.startsUsing({ source: 'Blaster Mirage', id: '15FD' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Blaster-Replikant', id: '15FD' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Réplique Du Fracasseur', id: '15FD' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ブラスター・ミラージュ', id: '15FD' }),
      netRegexCn: NetRegexes.startsUsing({ source: '爆破者幻象', id: '15FD' }),
      netRegexKo: NetRegexes.startsUsing({ source: '폭파자의 환영', id: '15FD' }),
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
      id: 'A6S Low Arithmeticks',
      netRegex: NetRegexes.gainsEffect({ effectId: '3FD' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      suppressSeconds: 10,
      alertText: {
        en: 'Go High',
        de: 'Geh Hoch',
        fr: 'Allez en haut',
        cn: '上高台',
      },
    },
    {
      id: 'A6S High Arithmeticks',
      netRegex: NetRegexes.gainsEffect({ effectId: '3FE' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      suppressSeconds: 10,
      alertText: {
        en: 'Go Low',
        de: 'Geh Runter',
        fr: 'Allez en bas',
        cn: '下低台',
      },
    },
    {
      id: 'A6S Bio-arithmeticks',
      netRegex: NetRegexes.startsUsing({ source: 'Swindler', id: '1610', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schwindler', id: '1610', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arnaqueur', id: '1610', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'スウィンドラー', id: '1610', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '欺诈者', id: '1610', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '조작자', id: '1610', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'A6S Midan Hardhelm',
      netRegex: NetRegexes.startsUsing({ source: 'Midan Hardhelm', id: '1612' }),
      condition: function(data) {
        return data.CanStun();
      },
      response: Responses.stun(),
    },
    {
      id: 'A6S Midan Hardmind',
      netRegex: NetRegexes.startsUsing({ source: 'Midan Hardhelm', id: '1613' }),
      condition: function(data) {
        return data.CanStun();
      },
      response: Responses.stun(),
    },
    {
      id: 'A6S Enumeration',
      regex: Regexes.headMarker({ id: ['0040', '0041', '0042'] }),
      infoText: function(data, matches) {
        // 0040 = 2, 0041 = 3, 0042 = 4
        let count = 2 + parseInt(matches.id, 16) - parseInt('0040', 16);
        return {
          en: data.ShortName(matches.target) + ': ' + count,
          de: data.ShortName(matches.target) + ': ' + count,
          cn: data.ShortName(matches.target) + '生命计算法: ' + count,
        };
      },
    },
    {
      id: 'A6S Super Cyclone',
      netRegex: NetRegexes.startsUsing({ source: 'Vortexer', id: '1627', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Wirbler', id: '1627', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Tourbillonneur', id: '1627', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ボルテッカー', id: '1627', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '环旋者', id: '1627', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '교반자', id: '1627', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'A6S Ultra Flash',
      netRegex: NetRegexes.startsUsing({ source: 'Vortexer', id: '161A', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Wirbler', id: '161A', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Tourbillonneur', id: '161A', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ボルテッカー', id: '161A', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '环旋者', id: '161A', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '교반자', id: '161A', capture: false }),
      alertText: {
        en: 'Hide Behind Ice',
      },
    },
    {
      id: 'A6S Ice Marker',
      netRegex: NetRegexes.headMarker({ id: '0043' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alarmText: {
        en: 'Ice: Freeze Tornado',
      },
    },
    {
      id: 'A6S Fire Beam',
      netRegex: NetRegexes.headMarker({ id: '0019' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      // TODO: maybe this should say "hit tornado / avoid ice" but that's wordy.
      infoText: {
        en: 'Fire Beam on YOU',
      },
    },
    {
      id: 'A6S Compressed Water Initial',
      netRegex: NetRegexes.gainsEffect({ effectId: '3FF' }),
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
      run: function(data) {
        data.haveWater = true;
      },
    },
    {
      id: 'A6S Compressed Water Lose',
      netRegex: NetRegexes.losesEffect({ effectId: '3FF' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      run: function(data) {
        data.haveWater = false;
      },
    },
    {
      id: 'A6S Compressed Water Explode',
      netRegex: NetRegexes.gainsEffect({ effectId: '3FF' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      delaySeconds: function(data, matches) {
        // 5 second warning.
        return parseFloat(matches.duration) - 5;
      },
      alertText: function(data) {
        if (!data.haveWater)
          return;
        return {
          en: 'Drop Water Soon',
          de: 'Gleich Wasser ablegen',
          fr: 'Posez l\'eau bientôt',
          ja: '水来るよ',
          cn: '马上水分摊',
        };
      },
    },
    {
      id: 'A6S Compressed Lightning Initial',
      netRegex: NetRegexes.gainsEffect({ effectId: '400' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Lightning on YOU',
        de: 'Blitz auf DIR',
        fr: 'Eclair sur VOUS',
        ja: '自分に雷',
        cn: '雷点名',
      },
      run: function(data) {
        data.haveLightning = true;
      },
    },
    {
      id: 'A6S Compressed Lightning Lose',
      netRegex: NetRegexes.losesEffect({ effectId: '400' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      run: function(data) {
        data.haveLightning = false;
      },
    },
    {
      id: 'A6S Compressed Lightning Explode',
      netRegex: NetRegexes.gainsEffect({ effectId: '400' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      delaySeconds: function(data, matches) {
        // 5 second warning.
        return parseFloat(matches.duration) - 5;
      },
      alertText: function(data) {
        if (!data.haveLightning)
          return;
        return {
          en: 'Drop Lightning Soon',
          de: 'Gleich Blitz ablegen',
          fr: 'Déposez l\'éclair bientôt',
          ja: '雷来るよ',
          cn: '马上雷分摊',
        };
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'missingTranslations': true,
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
      'missingTranslations': true,
      'replaceSync': {
        'Ballistic Missile': 'Missile balistique',
        'Blaster(?! Mirage)': 'Électrochoc',
        'Blaster Mirage': 'réplique du Fracasseur',
        'Brawler': 'Bagarreur',
        'Elemental Jammer': 'Grippage élémentaire',
        'Machinery Bay 67': 'Hangar d\'armement HA-67',
        'Machinery Bay 68': 'Hangar d\'armement HA-68',
        'Machinery Bay 69': 'Hangar d\'armement HA-69',
        'Machinery Bay 70': 'Hangar d\'armement HA-70',
        'Midan Gunner': 'canonnier midin',
        'Midan Hardhelm': 'casque-dur midin',
        'Power Plasma Alpha': 'plasma puissant α',
        'Power Plasma Beta': 'plasma puissant β',
        'Power Plasma Gamma': 'plasma puissant γ',
        'Swindler': 'Arnaqueur',
        'Vortexer': 'Tourbillonneur',
      },
      'replaceText': {
        'Attachment': 'Extension',
        'Brute Force': 'Force brute',
        'Elemental Jammer': 'Grippage élémentaire',
        'Height': 'Dénivellation',
        'Mind Blast': 'Explosion mentale',
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
