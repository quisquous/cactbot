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
          };
        }
        return {
          en: 'Avoid Mines',
          de: 'Mienen vermeiden',
          fr: 'Evitez les mines',
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
        fr: 'Eloignez-vous du boss',
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
        fr: 'Double foreuse : Soyez Loin/Près',
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
        fr: 'Cachez vous derrière la tornade',
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
        fr: 'Eclair sur VOUS',
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
        fr: 'Déposez l\'éclair bientôt',
        ja: '雷来るよ',
      },
    },
  ],
}];
