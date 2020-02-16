'use strict';

// O8S - Sigmascape 4.0 Savage
// localization:
//   de: partial timeline, partial triggers
//   fr: partial timeline, partial triggers
//   ja: partial timeline, partial triggers
[{
  zoneRegex: {
    en: /^Sigmascape V4\.0 \(Savage\)$/,
    ko: /^차원의 틈 오메가: 시그마편\(영웅\) \(4\)$/,
  },
  timelineFile: 'o8s.txt',
  triggers: [
    {
      id: 'O8S Shockwave',
      regex: Regexes.startsUsing({ id: '28DB', source: 'Graven Image', capture: false }),
      regexDe: Regexes.startsUsing({ id: '28DB', source: 'Heilig(?:e|er|es|en) Statue', capture: false }),
      regexFr: Regexes.startsUsing({ id: '28DB', source: 'Statue Divine', capture: false }),
      regexJa: Regexes.startsUsing({ id: '28DB', source: '神々の像', capture: false }),
      regexCn: Regexes.startsUsing({ id: '28DB', source: '众神之像', capture: false }),
      regexKo: Regexes.startsUsing({ id: '28DB', source: '신들의 상', capture: false }),
      delaySeconds: 5,
      alertText: {
        en: 'Look for Knockback',
        fr: 'Préparez-vous à la projection',
        de: 'Auf Rückstoß achten',
        ko: '넉백 대비',
        ja: 'ノックバックくるよ',
      },
      tts: {
        en: 'knockback',
        fr: 'Projection',
        de: 'Rückstoß',
        ko: '넉백',
        ja: 'ノックバック',
      },
    },
    {
      id: 'O8S Indolent Will',
      regex: Regexes.startsUsing({ id: '28E4', source: 'Graven Image', capture: false }),
      regexDe: Regexes.startsUsing({ id: '28E4', source: 'Heilig(?:e|er|es|en) Statue', capture: false }),
      regexFr: Regexes.startsUsing({ id: '28E4', source: 'Statue Divine', capture: false }),
      regexJa: Regexes.startsUsing({ id: '28E4', source: '神々の像', capture: false }),
      regexCn: Regexes.startsUsing({ id: '28E4', source: '众神之像', capture: false }),
      regexKo: Regexes.startsUsing({ id: '28E4', source: '신들의 상', capture: false }),
      alertText: {
        en: 'Look Away From Statue',
        fr: 'Ne regardez pas la statue',
        de: 'Von Statue wegschauen',
        ko: '시선 피하기',
        ja: '塔を見ないで！',
      },
      tts: {
        en: 'look away',
        fr: 'Ne regardez pas la statue',
        de: 'weckschauen',
        ko: '뒤돌기',
        ja: '見るな！',
      },
    },
    {
      id: 'O8S Intemperate Will',
      regex: Regexes.startsUsing({ id: '28DF', source: 'Graven Image', capture: false }),
      regexDe: Regexes.startsUsing({ id: '28DF', source: 'Heilig(?:e|er|es|en) Statue', capture: false }),
      regexFr: Regexes.startsUsing({ id: '28DF', source: 'Statue Divine', capture: false }),
      regexJa: Regexes.startsUsing({ id: '28DF', source: '神々の像', capture: false }),
      regexCn: Regexes.startsUsing({ id: '28DF', source: '众神之像', capture: false }),
      regexKo: Regexes.startsUsing({ id: '28DF', source: '신들의 상', capture: false }),
      alertText: {
        en: '<= Get Left/West',
        fr: '<= Allez à Gauche/Ouest',
        de: '<= Nach Links/Westen',
        ko: '<= 왼쪽이 안전',
        ja: '<= 左/西へ',
      },
      tts: {
        en: 'left',
        fr: 'gauche',
        de: 'links',
        ko: '왼쪽',
        ja: '左',
      },
    },
    {
      id: 'O8S Gravitational Wave',
      regex: Regexes.startsUsing({ id: '28DE', source: 'Graven Image', capture: false }),
      regexDe: Regexes.startsUsing({ id: '28DE', source: 'Heilig(?:e|er|es|en) Statue', capture: false }),
      regexFr: Regexes.startsUsing({ id: '28DE', source: 'Statue Divine', capture: false }),
      regexJa: Regexes.startsUsing({ id: '28DE', source: '神々の像', capture: false }),
      regexCn: Regexes.startsUsing({ id: '28DE', source: '众神之像', capture: false }),
      regexKo: Regexes.startsUsing({ id: '28DE', source: '신들의 상', capture: false }),
      alertText: {
        en: 'Get Right/East =>',
        fr: 'Allez à Droite/Est =>',
        de: 'Nach Rechts/Westen =>',
        ko: '오른쪽이 안전 =>',
        ja: '右/東へ =>',
      },
      tts: {
        en: 'right',
        fr: 'Projection depuis le côté droit',
        de: 'rechts',
        ko: '오른쪽',
        ja: '右',
      },
    },
    {
      id: 'O8S Ave Maria',
      regex: Regexes.startsUsing({ id: '28E3', source: 'Graven Image', capture: false }),
      regexDe: Regexes.startsUsing({ id: '28E3', source: 'Heilig(?:e|er|es|en) Statue', capture: false }),
      regexFr: Regexes.startsUsing({ id: '28E3', source: 'Statue Divine', capture: false }),
      regexJa: Regexes.startsUsing({ id: '28E3', source: '神々の像', capture: false }),
      regexCn: Regexes.startsUsing({ id: '28E3', source: '众神之像', capture: false }),
      regexKo: Regexes.startsUsing({ id: '28E3', source: '신들의 상', capture: false }),
      alertText: {
        en: 'Look At Statue',
        fr: 'Regardez la statue',
        de: 'Statue anschauen',
        ko: '시선 바라보기',
        ja: '像を見て！',
      },
      tts: {
        en: 'look towards',
        fr: 'Regardez la statue',
        de: 'anschauen',
        ko: '쳐다보기',
        ja: '像見て！',
      },
    },
    {
      id: 'O8S Pasts Forgotten',
      regex: Regexes.startsUsing({ id: '28F1', source: 'Kefka', capture: false }),
      regexDe: Regexes.startsUsing({ id: '28F1', source: 'Kefka', capture: false }),
      regexFr: Regexes.startsUsing({ id: '28F1', source: 'Kefka', capture: false }),
      regexJa: Regexes.startsUsing({ id: '28F1', source: 'ケフカ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '28F1', source: '凯夫卡', capture: false }),
      regexKo: Regexes.startsUsing({ id: '28F1', source: '케프카', capture: false }),
      alertText: {
        en: 'Past: Stack and Stay',
        fr: 'Passé : Stack et ne bougez plus',
        de: 'Vergangenheit: Sammeln und Stehenbleiben',
        ko: '과거: 맞고 가만히있기',
        ja: '過去: スタックしてそのまま',
      },
      tts: {
        en: 'stack and stay',
        fr: 'Stack et rester-là',
        de: 'Stek und Stehenbleiben',
        ko: '맞고 가만히',
        ja: 'スタックしてそのまま',
      },
    },
    {
      id: 'O8S Futures Numbered',
      regex: Regexes.startsUsing({ id: '28EF', source: 'Kefka', capture: false }),
      regexDe: Regexes.startsUsing({ id: '28EF', source: 'Kefka', capture: false }),
      regexFr: Regexes.startsUsing({ id: '28EF', source: 'Kefka', capture: false }),
      regexJa: Regexes.startsUsing({ id: '28EF', source: 'ケフカ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '28EF', source: '凯夫卡', capture: false }),
      regexKo: Regexes.startsUsing({ id: '28EF', source: '케프카', capture: false }),
      alertText: {
        en: 'Future: Stack and Through',
        fr: 'Futur : Stack et traversez',
        de: 'Zukunft: Sammeln und Durchlaufen',
        ko: '미래: 맞고 통과해가기',
        ja: '未来: シェア後ボス通り抜ける',
      },
      tts: {
        en: 'stack and through',
        fr: 'Stack et traversez',
        de: 'Stek und durchlaufen',
        ko: '맞고 통과해가기',
        ja: 'シェア後通り抜け',
      },
    },
    {
      // TODO: not sure if this cast is 7 or 8.
      id: 'O8S Past\'s End',
      regex: Regexes.startsUsing({ id: '28F[78]', source: 'Kefka', capture: false }),
      regexDe: Regexes.startsUsing({ id: '28F[78]', source: 'Kefka', capture: false }),
      regexFr: Regexes.startsUsing({ id: '28F[78]', source: 'Kefka', capture: false }),
      regexJa: Regexes.startsUsing({ id: '28F[78]', source: 'ケフカ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '28F[78]', source: '凯夫卡', capture: false }),
      regexKo: Regexes.startsUsing({ id: '28F[78]', source: '케프카', capture: false }),
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      alertText: {
        en: 'Past: Bait, then through',
        fr: 'Passé : appâtez puis traversez',
        de: 'Vergangenheit : Anlocken und Durchlaufen',
        ko: '과거: 맞고, 이동',
        ja: '過去: 飛んできたら反対向ける',
      },
      tts: {
        en: 'run run run',
        fr: 'appâtez puis traversez',
        de: 'Durchlaufen',
        ko: '맞고 이동',
        ja: '反対向ける',
      },
    },
    {
      // TODO: not sure if this cast is 4 or 5.
      id: 'O8S Future\'s End',
      regex: Regexes.startsUsing({ id: '28F[45]', source: 'Kefka', capture: false }),
      regexDe: Regexes.startsUsing({ id: '28F[45]', source: 'Kefka', capture: false }),
      regexFr: Regexes.startsUsing({ id: '28F[45]', source: 'Kefka', capture: false }),
      regexJa: Regexes.startsUsing({ id: '28F[45]', source: 'ケフカ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '28F[45]', source: '凯夫卡', capture: false }),
      regexKo: Regexes.startsUsing({ id: '28F[45]', source: '케프카', capture: false }),
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      alertText: {
        en: 'Future: Bait, then stay',
        fr: 'Futur : appâtez et ne bougez plus',
        de: 'Zukunft: Anlocken und Stehenbleiben',
        ko: '미래: 맞고, 가만히',
        ja: '未来: 飛んできたらそのまま',
      },
      tts: {
        en: 'stay stay stay',
        fr: 'appâtez et stop',
        de: 'Stehenbleiben',
        ko: '맞고 가만히',
        ja: 'そのまま',
      },
    },
    {
      id: 'O8S Pulse Wave You',
      regex: Regexes.startsUsing({ id: '28DD', source: 'Graven Image' }),
      regexDe: Regexes.startsUsing({ id: '28DD', source: 'Heilig(?:e|er|es|en) Statue' }),
      regexFr: Regexes.startsUsing({ id: '28DD', source: 'Statue Divine' }),
      regexJa: Regexes.startsUsing({ id: '28DD', source: '神々の像' }),
      regexCn: Regexes.startsUsing({ id: '28DD', source: '众神之像' }),
      regexKo: Regexes.startsUsing({ id: '28DD', source: '신들의 상' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Knockback on YOU',
        fr: 'Projection sur VOUS',
        de: 'Rückstoß auf DIR',
        ko: '넉백 → 나',
        ja: 'ノックバック on YOU',
      },
      tts: {
        en: 'knockback',
        fr: 'Projection',
        de: 'Rückstoß',
        ko: '넉백',
        ja: 'ノックバック',
      },
    },
    {
      id: 'O8S Wings of Destruction',
      regex: Regexes.startsUsing({ id: '2900', source: 'Kefka', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2900', source: 'Kefka', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2900', source: 'Kefka', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2900', source: 'ケフカ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2900', source: '凯夫卡', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2900', source: '케프카', capture: false }),
      alarmText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Wings: Be Near/Far',
            fr: 'Ailes : être près/loin',
            de: 'Schwingen: Nah/Fern',
            ko: '양날개: 가까이/멀리',
            ja: '翼: めり込む/離れる',
          };
        }
      },
      infoText: function(data) {
        if (data.role != 'tank') {
          return {
            en: 'Max Melee: Avoid Tanks',
            fr: 'Max Mêlée : éloignez-vous des Tanks',
            de: 'Max Nahkampf: Weg von den Tanks',
            ko: '칼끝딜: 탱커 피하기',
            ja: '近接最大レンジ タンクから離れて',
          };
        }
      },
      tts: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'wings',
            fr: 'Ailes, être près ou loin',
            de: 'schwingen',
            ko: '양날개',
            ja: '翼',
          };
        }
        return {
          en: 'max melee',
          fr: 'Max mêlée éloignez vous des tanks',
          de: 'max nahkampf',
          ko: '칼끝딜',
          ja: '最大レンジ',
        };
      },
    },
    {
      id: 'O8S Single Wing of Destruction',
      regex: Regexes.startsUsing({ id: '28F[EF]', source: 'Kefka', capture: false }),
      regexDe: Regexes.startsUsing({ id: '28F[EF]', source: 'Kefka', capture: false }),
      regexFr: Regexes.startsUsing({ id: '28F[EF]', source: 'Kefka', capture: false }),
      regexJa: Regexes.startsUsing({ id: '28F[EF]', source: 'ケフカ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '28F[EF]', source: '凯夫卡', capture: false }),
      regexKo: Regexes.startsUsing({ id: '28F[EF]', source: '케프카', capture: false }),
      infoText: {
        en: 'Single Wing',
        fr: 'Aile unique',
        de: 'Einzelner Flügel',
        ko: '한쪽 날개',
        ja: '片翼',
      },
    },
    {
      id: 'O8S Ultimate Embrace',
      regex: Regexes.startsUsing({ id: '2910', source: 'Kefka' }),
      regexDe: Regexes.startsUsing({ id: '2910', source: 'Kefka' }),
      regexFr: Regexes.startsUsing({ id: '2910', source: 'Kefka' }),
      regexJa: Regexes.startsUsing({ id: '2910', source: 'ケフカ' }),
      regexCn: Regexes.startsUsing({ id: '2910', source: '凯夫卡' }),
      regexKo: Regexes.startsUsing({ id: '2910', source: '케프카' }),
      alertText: function(data, matches) {
        if (matches.target != data.me)
          return;

        return {
          en: 'Embrace on YOU',
          fr: 'Étreinte sur VOUS',
          de: 'Umarmung auf DIR',
          ko: '종말의 포옹 → 나',
          ja: '双腕 on YOU',
        };
      },
      infoText: function(data, matches) {
        if (matches.target == data.me)
          return;

        if (data.role == 'healer' || data.role == 'tank') {
          return {
            en: 'Embrace on ' + data.ShortName(matches.target),
            fr: 'Étreinte sur ' + data.ShortName(matches.target),
            de: 'Umarmung auf ' + data.ShortName(matches.target),
            ko: '종말의 포옹 → ' + data.ShortName(matches.target),
            ja: '双腕 on ' + data.ShortName(matches.target),
          };
        }
      },
      tts: function(data, matches) {
        if (matches.target == data.me || data.role == 'healer' || data.role == 'tank') {
          return {
            en: 'embrace',
            fr: 'Étreinte',
            de: 'umarmung',
            ko: '종말의 포옹',
            ja: '双腕',
          };
        }
      },
    },
    {
      // 28E8: clown hyperdrive, 2912: god hyperdrive
      id: 'O8S Hyperdrive',
      regex: Regexes.startsUsing({ id: ['28E8', '2912'], source: 'Kefka' }),
      regexDe: Regexes.startsUsing({ id: ['28E8', '2912'], source: 'Kefka' }),
      regexFr: Regexes.startsUsing({ id: ['28E8', '2912'], source: 'Kefka' }),
      regexJa: Regexes.startsUsing({ id: ['28E8', '2912'], source: 'ケフカ' }),
      regexCn: Regexes.startsUsing({ id: ['28E8', '2912'], source: '凯夫卡' }),
      regexKo: Regexes.startsUsing({ id: ['28E8', '2912'], source: '케프카' }),
      alertText: function(data, matches) {
        if (matches.target != data.me)
          return;

        return {
          en: 'Hyperdrive on YOU',
          fr: 'Colonne de feu sur VOUS',
          de: 'Hyperantrieb auf DIR',
          ko: '하이퍼드라이브 → 나',
          ja: 'ハイパードライブ on YOU',
        };
      },
      infoText: function(data, matches) {
        if (matches.target == data.me)
          return;

        if (data.role == 'healer' || data.role == 'tank') {
          return {
            en: 'Hyperdrive on ' + data.ShortName(matches.target),
            fr: 'Colonne de feu sur ' + data.ShortName(matches.target),
            de: 'Hyperantrieb auf ' + data.ShortName(matches.target),
            ko: '하이퍼드라이브 → ' + data.ShortName(matches.target),
            ja: 'ハイパードライブ on ' + data.ShortName(matches.target),
          };
        }
      },
      tts: function(data, matches) {
        if (matches.target == data.me || data.role == 'healer' || data.role == 'tank') {
          return {
            en: 'hyperdrive',
            fr: 'Colonne de feu',
            de: 'hyperantrieb',
            ko: '하이퍼드라이브',
            ja: 'ハイパードライブ',
          };
        }
      },
    },
    {
      id: 'O8S Indulgent Will',
      regex: Regexes.startsUsing({ id: '28E5', source: 'Graven Image' }),
      regexDe: Regexes.startsUsing({ id: '28E5', source: 'Heilig(?:e|er|es|en) Statue' }),
      regexFr: Regexes.startsUsing({ id: '28E5', source: 'Statue Divine' }),
      regexJa: Regexes.startsUsing({ id: '28E5', source: '神々の像' }),
      regexCn: Regexes.startsUsing({ id: '28E5', source: '众神之像' }),
      regexKo: Regexes.startsUsing({ id: '28E5', source: '신들의 상' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alarmText: {
        en: 'Confusion: Go Outside',
        fr: 'Confusion : Aller à l\'extérieur',
        de: 'Konfusion: Nach außen',
        ko: '혼란: 바깥으로',
        ja: '混乱: 外へ',
      },
      tts: {
        en: 'confusion',
        fr: 'Confusion, aller à l\'extérieur',
        de: 'konfusion',
        ko: '혼란',
        ja: '混乱',
      },
    },
    {
      id: 'O8S Idyllic Will',
      regex: Regexes.startsUsing({ id: '28E6', source: 'Graven Image' }),
      regexDe: Regexes.startsUsing({ id: '28E6', source: 'Heilig(?:e|er|es|en) Statue' }),
      regexFr: Regexes.startsUsing({ id: '28E6', source: 'Statue Divine' }),
      regexJa: Regexes.startsUsing({ id: '28E6', source: '神々の像' }),
      regexCn: Regexes.startsUsing({ id: '28E6', source: '众神之像' }),
      regexKo: Regexes.startsUsing({ id: '28E6', source: '신들의 상' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alarmText: {
        en: 'Sleep: Go Inside',
        fr: 'Sommeil : allez au centre',
        de: 'Schlaf: Zur Mitte',
        ko: '수면: 안으로',
        ja: '睡眠: 中へ',
      },
      tts: {
        en: 'sleep',
        fr: 'Sommeil',
        de: 'Schlaf',
        ko: '수면',
        ja: '睡眠',
      },
    },
    {
      id: 'O8S Mana Charge',
      regex: Regexes.startsUsing({ id: '28D1', source: 'Kefka', capture: false }),
      regexDe: Regexes.startsUsing({ id: '28D1', source: 'Kefka', capture: false }),
      regexFr: Regexes.startsUsing({ id: '28D1', source: 'Kefka', capture: false }),
      regexJa: Regexes.startsUsing({ id: '28D1', source: 'ケフカ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '28D1', source: '凯夫卡', capture: false }),
      regexKo: Regexes.startsUsing({ id: '28D1', source: '케프카', capture: false }),
      run: function(data) {
        delete data.lastFire;
        delete data.lastThunder;
        delete data.lastIce;
        delete data.lastIceDir;
        delete data.manaReleaseText;
      },
    },
    {
      id: 'O8S Mana Release',
      regex: Regexes.startsUsing({ id: '28D2', source: 'Kefka', capture: false }),
      regexDe: Regexes.startsUsing({ id: '28D2', source: 'Kefka', capture: false }),
      regexFr: Regexes.startsUsing({ id: '28D2', source: 'Kefka', capture: false }),
      regexJa: Regexes.startsUsing({ id: '28D2', source: 'ケフカ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '28D2', source: '凯夫卡', capture: false }),
      regexKo: Regexes.startsUsing({ id: '28D2', source: '케프카', capture: false }),
      preRun: function(data) {
        if (data.lastFire) {
          data.manaReleaseText = data.lastFire;
          return;
        }
        if (!data.lastIceDir)
          return;
        data.manaReleaseText = data.lastThunder + ', ' + data.lastIceDir;
      },
      infoText: function(data) {
        return data.manaReleaseText;
      },
      tts: function(data) {
        return data.manaReleaseText;
      },
    },
    {
      // From ACT log lines, there's not any way to know the fire type as it's used.
      // The ability id is always 14:28CE:Kefka starts using Flagrant Fire on Kefka.
      // However, you can remind forgetful people during mana release and figure out
      // the type based on the damage it does.
      //
      // 28CE: ability id on use
      // 28CF: damage from mana charge
      // 2B32: damage from mana release
      id: 'O8S Fire Spread',
      regex: Regexes.ability({ id: '28CF', source: 'Kefka', capture: false }),
      regexDe: Regexes.ability({ id: '28CF', source: 'Kefka', capture: false }),
      regexFr: Regexes.ability({ id: '28CF', source: 'Kefka', capture: false }),
      regexJa: Regexes.ability({ id: '28CF', source: 'ケフカ', capture: false }),
      regexCn: Regexes.ability({ id: '28CF', source: '凯夫卡', capture: false }),
      regexKo: Regexes.ability({ id: '28CF', source: '케프카', capture: false }),
      suppressSeconds: 40,
      run: function(data) {
        data.lastFire = {
          en: 'Spread',
          fr: 'Eloignez-vous',
          de: 'verteilen',
          ko: '산개',
          ja: '散開',
        }[data.lang];
      },
    },
    {
      // 28CE: ability id on use
      // 28D0: damage from mana charge
      // 2B33: damage from mana release
      id: 'O8S Fire Stack',
      regex: Regexes.ability({ id: '28D0', source: 'Kefka', capture: false }),
      regexDe: Regexes.ability({ id: '28D0', source: 'Kefka', capture: false }),
      regexFr: Regexes.ability({ id: '28D0', source: 'Kefka', capture: false }),
      regexJa: Regexes.ability({ id: '28D0', source: 'ケフカ', capture: false }),
      regexCn: Regexes.ability({ id: '28D0', source: '凯夫卡', capture: false }),
      regexKo: Regexes.ability({ id: '28D0', source: '케프카', capture: false }),
      suppressSeconds: 40,
      run: function(data) {
        data.lastFire = {
          en: 'Stack',
          fr: 'Stack',
          de: 'Stacken',
          ko: '집합',
          ja: 'スタック',
        }[data.lang];
      },
    },
    {
      // 28CA: mana charge (both types)
      // 28CD: mana charge
      // 2B31: mana release
      id: 'O8S Thrumming Thunder Real',
      regex: Regexes.startsUsing({ id: ['28CD', '2B31'], source: 'Kefka', capture: false }),
      regexDe: Regexes.startsUsing({ id: ['28CD', '2B31'], source: 'Kefka', capture: false }),
      regexFr: Regexes.startsUsing({ id: ['28CD', '2B31'], source: 'Kefka', capture: false }),
      regexJa: Regexes.startsUsing({ id: ['28CD', '2B31'], source: 'ケフカ', capture: false }),
      regexCn: Regexes.startsUsing({ id: ['28CD', '2B31'], source: '凯夫卡', capture: false }),
      regexKo: Regexes.startsUsing({ id: ['28CD', '2B31'], source: '케프카', capture: false }),
      suppressSeconds: 40,
      preRun: function(data) {
        data.lastThunder = {
          en: 'True Thunder',
          fr: 'Vraie foudre',
          de: 'Wahrer Blitz',
          ko: '진실 선더가',
          ja: '真サンダガ',
        }[data.lang];
      },
      infoText: function(data) {
        return data.lastThunder;
      },
      tts: function(data) {
        return data.lastThunder;
      },
    },
    {
      // 28CA: mana charge (both types)
      // 28CB, 28CC: mana charge
      // 2B2F, 2B30: mana release
      id: 'O8S Thrumming Thunder Fake',
      regex: Regexes.startsUsing({ id: ['28CC', '2B30'], source: 'Kefka', capture: false }),
      regexDe: Regexes.startsUsing({ id: ['28CC', '2B30'], source: 'Kefka', capture: false }),
      regexFr: Regexes.startsUsing({ id: ['28CC', '2B30'], source: 'Kefka', capture: false }),
      regexJa: Regexes.startsUsing({ id: ['28CC', '2B30'], source: 'ケフカ', capture: false }),
      regexCn: Regexes.startsUsing({ id: ['28CC', '2B30'], source: '凯夫卡', capture: false }),
      regexKo: Regexes.startsUsing({ id: ['28CC', '2B30'], source: '케프카', capture: false }),
      suppressSeconds: 40,
      preRun: function(data) {
        data.lastThunder = {
          en: 'Fake Thunder',
          fr: 'Fausse foudre',
          de: 'Falscher Blitz',
          ko: '거짓 선더가',
          ja: 'にせサンダガ',
        }[data.lang];
      },
      infoText: function(data) {
        return data.lastThunder;
      },
      tts: function(data) {
        return data.lastThunder;
      },
    },
    {
      // 28C7: mana charge (all ice types)
      // 28C5, 28C6: mana charge
      // 2B2B, 2B2E: mana release
      id: 'O8S Blizzard Fake Donut',
      regex: Regexes.startsUsing({ id: ['28C5', '2B2B'], source: 'Kefka', capture: false }),
      regexDe: Regexes.startsUsing({ id: ['28C5', '2B2B'], source: 'Kefka', capture: false }),
      regexFr: Regexes.startsUsing({ id: ['28C5', '2B2B'], source: 'Kefka', capture: false }),
      regexJa: Regexes.startsUsing({ id: ['28C5', '2B2B'], source: 'ケフカ', capture: false }),
      regexCn: Regexes.startsUsing({ id: ['28C5', '2B2B'], source: '凯夫卡', capture: false }),
      regexKo: Regexes.startsUsing({ id: ['28C5', '2B2B'], source: '케프카', capture: false }),
      suppressSeconds: 40,
      preRun: function(data) {
        data.lastIce = {
          en: 'Fake Ice',
          fr: 'Fausse glace',
          de: 'Falsches Eis',
          ko: '거짓 블리자가',
          ja: 'にせブリザガ',
        }[data.lang];
        data.lastIceDir = {
          en: 'Get Out',
          fr: 'sortir',
          de: 'raus da',
          ko: '밖으로',
          ja: '外へ',
        }[data.lang];
      },
      infoText: function(data) {
        return data.lastIce + ': ' + data.lastIceDir;
      },
      tts: function(data) {
        return data.lastIce;
      },
    },
    {
      // 28C7: mana charge (all ice types)
      // 28C9: mana charge
      // 2B2E: mana release
      id: 'O8S Blizzard True Donut',
      regex: Regexes.startsUsing({ id: ['28C9', '2B2E'], source: 'Kefka', capture: false }),
      regexDe: Regexes.startsUsing({ id: ['28C9', '2B2E'], source: 'Kefka', capture: false }),
      regexFr: Regexes.startsUsing({ id: ['28C9', '2B2E'], source: 'Kefka', capture: false }),
      regexJa: Regexes.startsUsing({ id: ['28C9', '2B2E'], source: 'ケフカ', capture: false }),
      regexCn: Regexes.startsUsing({ id: ['28C9', '2B2E'], source: '凯夫卡', capture: false }),
      regexKo: Regexes.startsUsing({ id: ['28C9', '2B2E'], source: '케프카', capture: false }),
      suppressSeconds: 40,
      preRun: function(data) {
        data.lastIce = {
          en: 'True Ice',
          fr: 'Vraie glace',
          de: 'Wahres Eis',
          ko: '진실 블리자가',
          ja: '真ブリザガ',
        }[data.lang];
        data.lastIceDir = {
          en: 'Get In',
          fr: 'rentrer dedans',
          de: 'reingehen',
          ko: '안으로',
          ja: '中へ',
        }[data.lang];
      },
      infoText: function(data) {
        return data.lastIce + ': ' + data.lastIceDir;
      },
      tts: function(data) {
        return data.lastIce;
      },
    },
    {
      // 28C7: mana charge (all ice types)
      // 28C3, 28C4: mana charge
      // 2B29, 2B2A: mana release
      id: 'O8S Blizzard Fake Near',
      regex: Regexes.startsUsing({ id: ['28C4', '2B2A'], source: 'Kefka', capture: false }),
      regexDe: Regexes.startsUsing({ id: ['28C4', '2B2A'], source: 'Kefka', capture: false }),
      regexFr: Regexes.startsUsing({ id: ['28C4', '2B2A'], source: 'Kefka', capture: false }),
      regexJa: Regexes.startsUsing({ id: ['28C4', '2B2A'], source: 'ケフカ', capture: false }),
      regexCn: Regexes.startsUsing({ id: ['28C4', '2B2A'], source: '凯夫卡', capture: false }),
      regexKo: Regexes.startsUsing({ id: ['28C4', '2B2A'], source: '케프카', capture: false }),
      suppressSeconds: 40,
      preRun: function(data) {
        data.lastIce = {
          en: 'Fake Ice',
          fr: 'Fausse glace',
          de: 'Falsches Eis',
          ko: '거짓 블리자가',
          ja: 'にせブリザガ',
        }[data.lang];
        data.lastIceDir = {
          en: 'Get In',
          fr: 'rentrer dedans',
          de: 'reingehen',
          ko: '안으로',
          ja: '中へ',
        }[data.lang];
      },
      infoText: function(data) {
        return data.lastIce + ': ' + data.lastIceDir;
      },
      tts: function(data) {
        return data.lastIce;
      },
    },
    {
      // 28C7: mana charge (all ice types)
      // 28C8: mana charge
      // 2B2D: mana release
      id: 'O8S Blizzard True Near',
      regex: Regexes.startsUsing({ id: ['28C8', '2B2D'], source: 'Kefka', capture: false }),
      regexDe: Regexes.startsUsing({ id: ['28C8', '2B2D'], source: 'Kefka', capture: false }),
      regexFr: Regexes.startsUsing({ id: ['28C8', '2B2D'], source: 'Kefka', capture: false }),
      regexJa: Regexes.startsUsing({ id: ['28C8', '2B2D'], source: 'ケフカ', capture: false }),
      regexCn: Regexes.startsUsing({ id: ['28C8', '2B2D'], source: '凯夫卡', capture: false }),
      regexKo: Regexes.startsUsing({ id: ['28C8', '2B2D'], source: '케프카', capture: false }),
      suppressSeconds: 40,
      preRun: function(data) {
        data.lastIce = {
          en: 'True Ice',
          fr: 'Vraie glace',
          de: 'Wahres Eis',
          ko: '진실 블리자가',
          ja: '真ブリザガ',
        }[data.lang];
        data.lastIceDir = {
          en: 'Get Out',
          fr: 'sortir',
          de: 'rausgehen',
          ko: '밖으로',
          ja: '外へ',
        }[data.lang];
      },
      infoText: function(data) {
        return data.lastIce + ': ' + data.lastIceDir;
      },
      tts: function(data) {
        return data.lastIce;
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Graven Image': 'heilig(?:e|er|es|en) Statue',
        'Kefka': 'Kefka',
        'Light Of Consecration': 'Licht der Weihe',
        'The Mad Head': 'verrückt(?:e|er|es|en) Kopf',
        'The limit gauge resets!': 'Der Limitrausch-Balken wurde geleert.',
      },
      'replaceText': {
        '--targetable--': '--anvisierbar--',
        '--untargetable--': '--nich anvisierbar--',
        'Aero Assault': 'Wallendes Windga',
        'All Things Ending': 'Ende aller Dinge',
        'Blizzard Blitz': 'Erstarrendes Eisga',
        'Blizzard III': 'Eisga',
        'Blizzard\\+Thunder': 'Eis+Blitz',
        'Celestriad': 'Dreigestirn',
        'Enrage': 'Finalangriff',
        'Explosion': 'Explosion',
        'Fire III': 'Feuga',
        'Flagrant Fire': 'Flammendes Feuga',
        'Forsaken': 'Verloren',
        'Future\'s End': 'Ende der Zukunft',
        'Futures Numbered': 'Vernichtung der Zukunft',
        'Graven Image': 'Göttliche Statue',
        'Gravitas': 'Gravitas',
        'Gravitational Wave': 'Gravitationswelle',
        'Half Arena': 'Halbe Arena',
        'Heartless Angel': 'Herzloser Engel',
        'Heartless Archangel': 'Herzloser Erzengel',
        'Holy Ascent': 'Heiliger Aufstieg',
        'Hyperdrive': 'Hyperantrieb',
        'Idyllic Will': 'Idyllischer Wille',
        'Indolent Will': 'Träger Wille',
        'Indomitable Will': 'Unzähmbarer Wille',
        'Indulgent Will': 'Nachsichtiger Wille',
        'Inexorable Will': 'Unerbittlicher Wille',
        'Intemperate Will': 'Unmäßiger Wille',
        'Knockback Tethers': 'Rückstoß Verbindungen',
        'Light Of Judgment': 'Licht des Urteils',
        'Mana Charge': 'Mana-Aufladung',
        'Mana Release': 'Mana-Entladung',
        'Meteor': 'Meteor',
        'Past/Future(?! )': 'Vergangenheit/Zukunft',
        'Past/Future End': 'Vergangenheit/Zukunft Ende',
        'Pasts Forgotten': 'Vernichtung der Vergangenheit',
        'Pulse Wave': 'Pulswelle',
        'Revolting Ruin': 'Revoltierendes Ruinga',
        'Shockwave': 'Schockwelle',
        'Sleep/Confuse Tethers': 'Schlaf/Konfusion Verbindungen',
        'Soak': 'Aufsaugen',
        'Starstrafe': 'Sternentanz',
        'Statue Gaze': 'Statuenblick',
        'Statue Half Cleave': 'Statue Halber Cleave',
        'The Path Of Light': 'Pfad des Lichts',
        'Thrumming Thunder': 'Brachiales Blitzga',
        'Thunder III': 'Blitzga',
        'Timely Teleport': 'Turbulenter Teleport',
        'Trine': 'Trine',
        'Ultima Upsurge': 'Ultima-Wallung',
        'Ultimate Embrace': 'Ultima-Umarmung',
        'Ultima(?![ |\\w])': 'Ultima',
        'Vitrophyre': 'Vitrophyr',
        'Wave Cannon': 'Wellenkanone',
        'Wings Of Destruction': 'Vernichtungsschwinge',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Graven Image': 'Statue divine',
        'Kefka': 'Kefka',
        'Light Of Consecration': 'lumière de la consécration',
        'The Mad Head': 'visage de la folie',
        'The limit gauge resets!': 'La jauge de Transcendance a été réinitialisée.',
      },
      'replaceText': {
        '--targetable--': '--Ciblable--',
        '--untargetable--': '--Impossible à cibler--',
        'Aero Assault': 'Méga Vent véhément',
        'All Things Ending': 'Fin de toutes choses',
        'Blizzard Blitz': 'Méga Glace glissante',
        'Blizzard III': 'Méga Glace',
        'Blizzard\\+Thunder': 'Méga Glace + Méga Foudre',
        'Celestriad': 'Tristella',
        'Enrage': 'Enrage',
        'Explosion': 'Explosion',
        'Fire III': 'Méga Feu',
        'Flagrant Fire': 'Méga Feu faufilant',
        'Forsaken': 'Cataclysme',
        'Future\'s End': 'Fin du futur',
        'Futures Numbered': 'Ruine du futur',
        'Graven Image': 'Statue divine',
        'Gravitas': 'Tir gravitationnel',
        'Gravitational Wave': 'Onde gravitationnelle',
        'Half Arena': 'Moitié d\'arène',
        'Heartless Angel': 'Ange sans cœur',
        'Heartless Archangel': 'Archange sans cœur',
        'Holy Ascent': 'Ascension sacrée',
        'Hyperdrive': 'Colonne de feu',
        'Idyllic Will': 'Volonté idyllique',
        'Indolent Will': 'Volonté indolente',
        'Indomitable Will': 'Volonté indomptable',
        'Indulgent Will': 'Volonté indulgente',
        'Inexorable Will': 'Volonté inexorable',
        'Intemperate Will': 'Volonté intempérante',
        'Knockback Tethers': 'Liens de projection',
        'Light Of Judgment': 'Triade guerrière',
        'Mana Charge': 'Concentration de mana',
        'Mana Release': 'Décharge de mana',
        'Meteor': 'Météore',
        'Past/Future(?! )': 'Passé/Futur',
        'Past/Future End': 'Passé/Fin du futur',
        'Pasts Forgotten': 'Ruine du passé',
        'Pulse Wave': 'Pulsation spirituelle',
        'Revolting Ruin': 'Méga Ruine ravageuse',
        'Shockwave': 'Onde de choc',
        'Sleep/Confuse Tethers': 'Liens de Sommeil/Confusion',
        'Soak': 'Absorber',
        'Starstrafe': 'Fou dansant',
        'Statue Gaze': 'Regard statue',
        'Statue Half Cleave': 'Demi clivage de la statue',
        'The Path Of Light': 'Voie de lumière',
        'Thrumming Thunder': 'Méga Foudre fourmillante',
        'Thunder III': 'Méga Foudre',
        'Timely Teleport': 'Téléportation turbulente',
        'Trine': 'Trine',
        'Ultima Upsurge': 'Ultima ulcérante',
        'Ultimate Embrace': 'Étreinte fatidique',
        'Ultima(?![ |\\w])': 'Ultima',
        'Vitrophyre': 'Vitrophyre',
        'Wave Cannon': 'Canon plasma',
        'Wings Of Destruction': 'Aile de la destruction',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Graven Image': '神々の像',
        'Kefka': 'ケフカ',
        'Light Of Consecration': '聖別の光',
        'The Mad Head': 'マッドヘッド',
        'The limit gauge resets!': 'リミットゲージがリセットされた……',
      },
      'replaceText': {
        '--targetable--': '--targetable--',
        '--untargetable--': '--untargetable--',
        'Aero Assault': 'ずんずんエアロガ',
        'All Things Ending': '消滅の脚',
        'Blizzard Blitz': 'ぐるぐるブリザガ',
        'Blizzard III': 'ブリザガ',
        'Blizzard\\+Thunder': 'Blizzard+Thunder', // FIXME
        'Celestriad': 'スリースターズ',
        'Enrage': 'Enrage',
        'Explosion': '爆発',
        'Fire III': 'ファイガ',
        'Flagrant Fire': 'めらめらファイガ',
        'Forsaken': 'ミッシング',
        'Future\'s End': '未来の終焉',
        'Futures Numbered': '未来の破滅',
        'Graven Image': '神々の像',
        'Gravitas': '重力弾',
        'Gravitational Wave': '重力波',
        'Half Arena': 'Half Arena', // FIXME
        'Heartless Angel': '心ない天使',
        'Heartless Archangel': '心ない大天使',
        'Holy Ascent': '昇天',
        'Hyperdrive': 'ハイパードライブ',
        'Idyllic Will': '睡魔の神気',
        'Indolent Will': '惰眠の神気',
        'Indomitable Will': '豪腕の神気',
        'Indulgent Will': '聖母の神気',
        'Inexorable Will': '無情の神気',
        'Intemperate Will': '撲殺の神気',
        'Knockback Tethers': 'Knockback Tethers', // FIXME
        'Light Of Judgment': '裁きの光',
        'Mana Charge': 'マジックチャージ',
        'Mana Release': 'マジックアウト',
        'Meteor': 'メテオ',
        'Past/Future(?! )': 'Past/Future', // FIXME
        'Past/Future End': 'Past/Future End', // FIXME
        'Pasts Forgotten': '過去の破滅',
        'Pulse Wave': '波動弾',
        'Revolting Ruin': 'ばりばりルインガ',
        'Shockwave': '衝撃波',
        'Sleep/Confuse Tethers': 'Sleep/Confuse Tethers', // FIXME
        'Soak': 'Soak', // FIXME
        'Starstrafe': '妖星乱舞',
        'Statue Gaze': 'Statue Gaze', // FIXME
        'Statue Half Cleave': 'Statue Half Cleave', // FIXME
        'The Path Of Light': '光の波動',
        'Thrumming Thunder': 'もりもりサンダガ',
        'Thunder III': 'サンダガ',
        'Timely Teleport': 'ぶっとびテレポ',
        'Trine': 'トライン',
        'Ultima Upsurge': 'どきどきアルテマ',
        'Ultimate Embrace': '終末の双腕',
        'Ultima(?![ |\\w])': 'アルテマ',
        'Vitrophyre': '岩石弾',
        'Wave Cannon': '波動砲',
        'Wings Of Destruction': '破壊の翼',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Graven Image': '众神之像',
        'Kefka': '凯夫卡',
        'Light Of Consecration': '祝圣之光',
        'The Mad Head': '妖首',
        'The limit gauge resets!': '极限槽被清零了……',
      },
      'replaceText': {
        '--targetable--': '--targetable--', // FIXME
        '--untargetable--': '--untargetable--', // FIXME
        'Aero Assault': '疼飕飕暴风',
        'All Things Ending': '消灭之脚',
        'Blizzard Blitz': '滴溜溜冰封',
        'Blizzard III': '冰封',
        'Blizzard\\+Thunder': 'Blizzard+Thunder', // FIXME
        'Celestriad': '三星',
        'Enrage': 'Enrage', // FIXME
        'Explosion': '爆炸',
        'Fire III': '爆炎',
        'Flagrant Fire': '呼啦啦爆炎',
        'Forsaken': '遗弃末世',
        'Future\'s End': '未来终结',
        'Futures Numbered': '未来破灭',
        'Graven Image': '众神之像',
        'Gravitas': '重力弹',
        'Gravitational Wave': '重力波',
        'Half Arena': 'Half Arena', // FIXME
        'Heartless Angel': '无心天使',
        'Heartless Archangel': '无心大天使',
        'Holy Ascent': '升天',
        'Hyperdrive': '超驱动',
        'Idyllic Will': '睡魔的神气',
        'Indolent Will': '懒惰的神气',
        'Indomitable Will': '强腕的神气',
        'Indulgent Will': '圣母的神气',
        'Inexorable Will': '无情的神气',
        'Intemperate Will': '扑杀的神气',
        'Knockback Tethers': 'Knockback Tethers', // FIXME
        'Light Of Judgment': '制裁之光',
        'Mana Charge': '魔法储存',
        'Mana Release': '魔法放出',
        'Meteor': '陨石',
        'Past/Future(?! )': 'Past/Future', // FIXME
        'Past/Future End': 'Past/Future End', // FIXME
        'Pasts Forgotten': '过去破灭',
        'Pulse Wave': '波动弹',
        'Revolting Ruin': '恶狠狠毁荡',
        'Shockwave': '冲击波',
        'Sleep/Confuse Tethers': 'Sleep/Confuse Tethers', // FIXME
        'Soak': 'Soak', // FIXME
        'Starstrafe': '妖星乱舞',
        'Statue Gaze': 'Statue Gaze', // FIXME
        'Statue Half Cleave': 'Statue Half Cleave', // FIXME
        'The Path Of Light': '光之波动',
        'Thrumming Thunder': '劈啪啪暴雷',
        'Thunder III': '暴雷',
        'Timely Teleport': '跳蹦蹦传送',
        'Trine': '异三角',
        'Ultima Upsurge': '扑腾腾究极',
        'Ultimate Embrace': '终末双腕',
        'Ultima(?![ |\\w])': '究极',
        'Vitrophyre': '岩石弹',
        'Wave Cannon': '波动炮',
        'Wings Of Destruction': '破坏之翼',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Graven Image': '신들의 상',
        'Kefka': '케프카',
        'Light Of Consecration': '성결의 빛',
        'The Mad Head': '광인의 머리',
        'The limit gauge resets!': '리미트 게이지가 초기화되었습니다…….',
      },
      'replaceText': {
        '--targetable--': '--targetable--', // FIXME
        '--untargetable--': '--untargetable--', // FIXME
        'Aero Assault': '갈기갈기 에어로가',
        'All Things Ending': '소멸의 발차기',
        'Blizzard Blitz': '빙글빙글 블리자가',
        'Blizzard III': '블리자가',
        'Blizzard\\+Thunder': 'Blizzard+Thunder', // FIXME
        'Celestriad': '세 개의 별',
        'Enrage': 'Enrage', // FIXME
        'Explosion': '폭발',
        'Fire III': '파이가',
        'Flagrant Fire': '이글이글 파이가',
        'Forsaken': '행방불명',
        'Future\'s End': '미래의 종언',
        'Futures Numbered': '미래의 파멸',
        'Graven Image': '신들의 상',
        'Gravitas': '중력탄',
        'Gravitational Wave': '중력파',
        'Half Arena': 'Half Arena', // FIXME
        'Heartless Angel': '비정한 천사',
        'Heartless Archangel': '비정한 대천사',
        'Holy Ascent': '승천',
        'Hyperdrive': '하이퍼드라이브',
        'Idyllic Will': '수마의 신기',
        'Indolent Will': '태만의 신기',
        'Indomitable Will': '호완의 신기',
        'Indulgent Will': '성모의 신기',
        'Inexorable Will': '무정의 신기',
        'Intemperate Will': '박살의 신기',
        'Knockback Tethers': 'Knockback Tethers', // FIXME
        'Light Of Judgment': '심판의 빛',
        'Mana Charge': '마력 충전',
        'Mana Release': '마력 방출',
        'Meteor': '메테오',
        'Past/Future(?! )': 'Past/Future', // FIXME
        'Past/Future End': 'Past/Future End', // FIXME
        'Pasts Forgotten': '과거의 파멸',
        'Pulse Wave': '파동탄',
        'Revolting Ruin': '파삭파삭 루인가',
        'Shockwave': '충격파',
        'Sleep/Confuse Tethers': 'Sleep/Confuse Tethers', // FIXME
        'Soak': 'Soak', // FIXME
        'Starstrafe': '요성난무',
        'Statue Gaze': 'Statue Gaze', // FIXME
        'Statue Half Cleave': 'Statue Half Cleave', // FIXME
        'The Path Of Light': '빛의 파동',
        'Thrumming Thunder': '찌릿찌릿 선더가',
        'Thunder III': '선더가',
        'Timely Teleport': '껑충껑충 텔레포',
        'Trine': '트라인',
        'Ultima Upsurge': '두근두근 알테마',
        'Ultimate Embrace': '종말의 포옹',
        'Ultima(?![ |\\w])': '알테마',
        'Vitrophyre': '암석탄',
        'Wave Cannon': '파동포',
        'Wings Of Destruction': '파괴의 날개',
      },
    },
  ],
}];
