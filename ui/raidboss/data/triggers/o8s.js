'use strict';

// O8S - Sigmascape 4.0 Savage
// localization:
//   de: partial timeline, partial triggers
//   fr: partial timeline, partial triggers
//   ja: partial timeline, partial triggers
[{
  zoneRegex: /Sigmascape V4\.0 \(Savage\)/,
  timelineFile: 'o8s.txt',
  triggers: [
    {
      id: 'O8S Shockwave',
      regex: / 14:28DB:Graven Image starts using Shockwave/,
      regexDe: / 14:28DB:Helige Statue starts using Schockwelle/,
      regexFr: / 14:28DB:Statue Divine starts using Onde De Choc/,
      regexJa: / 14:28DB:神々の像 starts using 衝撃波/,
      regexKo: / 14:28DB:신들의 상 starts using 충격파/,
      delaySeconds: 5,
      alertText: {
        en: 'Look for Knockback',
        fr: 'Préparez-vous à la projection',
        de: 'Auf Rückstoß achten',
        ko: '넉백 대비',
      },
      tts: {
        en: 'knockback',
        fr: 'Projection',
        de: 'Rückstoß',
        ko: '넉백',
      },
    },
    {
      id: 'O8S Indolent Will',
      regex: /Graven Image starts using Indolent Will/,
      regexDe: /Helige Statue starts using Träger Wille/,
      regexFr: /Statue Divine starts using Volonté Indolente/,
      regexJa: /神々の像 starts using 惰眠の神気/,
      regexKo: /신들의 상 starts using 태만의 신기/,
      alertText: {
        en: 'Look Away From Statue',
        fr: 'Ne regardez pas la statue',
        de: 'Von Statue wegschauen',
        ko: '시선 피하기',
      },
      tts: {
        en: 'look away',
        fr: 'Ne regardez pas la statue',
        de: 'weckschauen',
        ko: '뒤돌기',
      },
    },
    {
      id: 'O8S Intemperate Will',
      regex: /14:28DF:Graven Image starts using Intemperate Will/,
      regexDe: /14:28DF:Helige Statue starts using Unmäßiger Wille/,
      regexFr: /14:28DF:Statue Divine starts using Volonté Intempérante/,
      regexJa: /14:28DF:神々の像 starts using 撲殺の神気/,
      regexKo: /14:28DF:신들의 상 starts using 박살의 신기/,
      alertText: {
        en: '<= Get Left/West',
        fr: '<= Allez à Gauche/Ouest',
        de: '<= Nach Links/Westen',
        ko: '<= 왼쪽이 안전',
      },
      tts: {
        en: 'left',
        fr: 'gauche',
        de: 'links',
        ko: '왼쪽',
      },
    },
    {
      id: 'O8S Gravitational Wave',
      regex: /14:28DE:Graven Image starts using Gravitational Wave/,
      regexDe: /14:28DE:Helige Statue starts using Gravitationswelle/,
      regexFr: /14:28DE:Statue Divine starts using Onde Gravitationnelle/,
      regexJa: /14:28DE:神々の像 starts using 重力波/,
      regexKo: /14:28DE:신들의 상 starts using 중력파/,
      alertText: {
        en: 'Get Right/East =>',
        fr: 'Allez à Droite/Est =>',
        de: 'Nach Rechts/Westen =>',
        ko: '오른쪽이 안전 =>',
      },
      tts: {
        en: 'right',
        fr: 'Projection depuis le côté droit',
        de: 'rechts',
        ko: '오른쪽',
      },
    },
    {
      id: 'O8S Ave Maria',
      regex: / 14:28E3:Graven Image starts using Ave Maria/,
      regexDe: / 14:28E3:Helige Statue starts using Ave Maria/,
      regexFr: / 14:28E3:Statue Divine starts using Ave Maria/,
      regexJa: / 14:28E3:神々の像 starts using Ave Maria/,
      regexKo: / 14:28E3:신들의 상 starts using 아베 마리아/,
      alertText: {
        en: 'Look At Statue',
        fr: 'Regardez la statue',
        de: 'Statue anschauen',
        ko: '시선 바라보기',
      },
      tts: {
        en: 'look towards',
        fr: 'Regardez la statue',
        de: 'anschauen',
        ko: '쳐다보기',
      },
    },
    {
      id: 'O8S Pasts Forgotten',
      regex: /Kefka starts using Pasts Forgotten/,
      regexDe: /Kefka starts using Vernichtung Der Vergangenheit/,
      regexFr: /Kefka starts using Ruine Du Passé/,
      regexJa: /ケフカ starts using 過去の破滅/,
      regexKo: /케프카 starts using 과거의 파멸/,
      alertText: {
        en: 'Past: Stack and Stay',
        fr: 'Passé : Stack et ne bougez plus',
        de: 'Vergangenheit: Sammeln und Stehenbleiben',
        ko: '과거: 맞고 가만히있기',
      },
      tts: {
        en: 'stack and stay',
        fr: 'Stack et rester-là',
        de: 'Stek und Stehenbleiben',
        ko: '맞고 가만히',
      },
    },
    {
      id: 'O8S Futures Numbered',
      regex: /Kefka starts using Futures Numbered/,
      regexDe: /Kefka starts using Vernichtung Der Zukunft/,
      regexFr: /Kefka starts using Ruine Du Futur/,
      regexJa: /ケフカ starts using 未来の破滅/,
      regexKo: /케프카 starts using 미래의 파멸/,
      alertText: {
        en: 'Future: Stack and Through',
        fr: 'Futur : Stack et traversez',
        de: 'Zukunft: Sammeln und Durchlaufen',
        ko: '미래: 맞고 통과해가기',
      },
      tts: {
        en: 'stack and through',
        fr: 'Stack et traversez',
        de: 'Stek und durchlaufen',
        ko: '맞고 통과해가기',
      },
    },
    {
      id: 'O8S Past\'s End',
      regex: /Kefka starts using Past's End/,
      regexDe: /Kefka starts using Ende Der Vergangenheit/,
      regexFr: /Kefka starts using Fin Du Passé/,
      regexJa: /ケフカ starts using 過去の終焉/,
      regexKo: /케프카 starts using 과거의 종언/,
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      alertText: {
        en: 'Past: Bait, then through',
        fr: 'Passé : appâtez puis traversez',
        de: 'Vergangenheit : Anlocken und Durchlaufen',
        ko: '과거: 맞고, 이동',
      },
      tts: {
        en: 'run run run',
        fr: 'appâtez puis traversez',
        de: 'Durchlaufen',
        ko: '맞고 이동',
      },
    },
    {
      id: 'O8S Future\'s End',
      regex: /Kefka starts using Future's End/,
      regexDe: /Kefka starts using Ende Der Zukunft/,
      regexFr: /Kefka starts using Fin Du Futur/,
      regexJa: /ケフカ starts using 未来の終焉/,
      regexKo: /케프카 starts using 미래의 종언/,
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      alertText: {
        en: 'Future: Bait, then stay',
        fr: 'Futur : appâtez et ne bougez plus',
        de: 'Zukunft: Anlocken und Stehenbleiben',
        ko: '미래: 맞고, 가만히',
      },
      tts: {
        en: 'stay stay stay',
        fr: 'appâtez et stop',
        de: 'Stehenbleiben',
        ko: '맞고 가만히',
      },
    },
    {
      id: 'O8S Pulse Wave You',
      regex: /Graven Image starts using Pulse Wave on (\y{Name})/,
      regexDe: /Helige Statue starts using Pulswelle on (\y{Name})/,
      regexFr: /Statue Divine starts using Pulsation Spirituelle on (\y{Name})/,
      regexJa: /神々の像 starts using 波動弾 on (\y{Name})/,
      regexJa: /신들의 상 starts using 파동탄 on (\y{Name})/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Knockback on YOU',
        fr: 'Projection sur VOUS',
        de: 'Rückstoß auf DIR',
        ko: '넉백 → 나',
      },
      tts: {
        en: 'knockback',
        fr: 'Projection',
        de: 'Rückstoß',
        ko: '넉백',
      },
    },
    {
      id: 'O8S Wings of Destruction',
      regex: / 14:2900:Kefka starts using Wings Of Destruction/,
      regexDe: / 14:2900:Kefka starts using Vernichtungsschwinge/,
      regexFr: / 14:2900:Kefka starts using Aile De La Destruction/,
      regexJa: / 14:2900:ケフカ starts using 破壊の翼/,
      regexJa: / 14:2900:케프카 starts using 파괴의 날개/,
      alarmText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Wings: Be Near/Far',
            fr: 'Ailes : être près/loin',
            de: 'Schwingen: Nah/Fern',
            ko: '양날개: 가까이/멀리',
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
          };
        }
        return {
          en: 'max melee',
          fr: 'Max mêlée éloignez vous des tanks',
          de: 'max nahkampf',
          ko: '칼끝딜',
        };
      },
    },
    {
      id: 'O8S Single Wing of Destruction',
      regex: / 14:28F[EF]:Kefka starts using Wings Of Destruction/,
      regexDe: / 14:28F[EF]:Kefka starts using Vernichtungsschwinge/,
      regexFr: / 14:28F[EF]:Kefka starts using Aile De La Destruction/,
      regexJa: / 14:28F[EF]:ケフカ starts using 破壊の翼/,
      regexJa: / 14:28F[EF]:케프카 starts using 파괴의 날개/,
      infoText: {
        en: 'Single Wing',
        fr: 'Aile unique',
        de: 'Einzelner Flügel',
        ko: '한쪽 날개',
      },
    },
    {
      id: 'O8S Ultimate Embrace',
      regex: / 14:2910:Kefka starts using Ultimate Embrace on (\y{Name})/,
      regexDe: / 14:2910:Kefka starts using Ultima-Umarmung on (\y{Name})/,
      regexFr: / 14:2910:Kefka starts using Étreinte Fatidique on (\y{Name})/,
      regexJa: / 14:2910:ケフカ starts using アルテマte Embrace on (\y{Name})/,
      regexJa: / 14:2910:케프카 starts using 종말의 포옹 on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] != data.me)
          return;

        return {
          en: 'Embrace on YOU',
          fr: 'Étreinte sur VOUS',
          de: 'Umarmung auf DIR',
          ko: '종말의 포옹 → 나',
        };
      },
      infoText: function(data, matches) {
        if (matches[1] == data.me)
          return;

        if (data.role == 'healer' || data.role == 'tank') {
          return {
            en: 'Embrace on ' + data.ShortName(matches[1]),
            fr: 'Étreinte sur ' + data.ShortName(matches[1]),
            de: 'Umarmung auf ' + data.ShortName(matches[1]),
            ko: '종말의 포옹 → ' + data.ShortName(matches[1]),
          };
        }
      },
      tts: function(data, matches) {
        if (matches[1] == data.me || data.role == 'healer' || data.role == 'tank') {
          return {
            en: 'embrace',
            fr: 'Étreinte',
            de: 'umarmung',
            ko: '종말의 포옹',
          };
        }
      },
    },
    {
      // 28E8: clown hyperdrive, 2912: god hyperdrive
      id: 'O8S Hyperdrive',
      regex: / 14:(?:28E8|2912):Kefka starts using Hyperdrive on (\y{Name})/,
      regexDe: / 14:(?:28E8|2912):Kefka starts using Hyperantrieb on (\y{Name})/,
      regexFr: / 14:(?:28E8|2912):Kefka starts using Colonne De Feu on (\y{Name})/,
      regexJa: / 14:(?:28E8|2912):ケフカ starts using ハイパードライブ on (\y{Name})/,
      regexKo: / 14:(?:28E8|2912):케프카 starts using 하이퍼드라이브 on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] != data.me)
          return;

        return {
          en: 'Hyperdrive on YOU',
          fr: 'Colonne de feu sur VOUS',
          de: 'Hyperantrieb auf DIR',
          ko: '하이퍼드라이브 → 나',
        };
      },
      infoText: function(data, matches) {
        if (matches[1] == data.me)
          return;

        if (data.role == 'healer' || data.role == 'tank') {
          return {
            en: 'Hyperdrive on ' + data.ShortName(matches[1]),
            fr: 'Colonne de feu sur ' + data.ShortName(matches[1]),
            de: 'Hyperantrieb auf ' + data.ShortName(matches[1]),
            ko: '하이퍼드라이브 → ' + data.ShortName(matches[1]),
          };
        }
      },
      tts: function(data, matches) {
        if (matches[1] == data.me || data.role == 'healer' || data.role == 'tank') {
          return {
            en: 'hyperdrive',
            fr: 'Colonne de feu',
            de: 'hyperantrieb',
            ko: '하이퍼드라이브',
          };
        }
      },
    },
    {
      id: 'O8S Indulgent Will',
      regex: / 14:28E5:Graven Image starts using Indulgent Will on (\y{Name})/,
      regexDe: / 14:28E5:Helige Statue starts using Nachsichtiger Wille on (\y{Name})/,
      regexFr: / 14:28E5:Statue Divine starts using Volonté Indulgente on (\y{Name})/,
      regexJa: / 14:28E5:神々の像 starts using 聖母の神気 on (\y{Name})/,
      regexKo: / 14:28E5:신들의 상 starts using 성모의 신기 on (\y{Name})/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alarmText: {
        en: 'Confusion: Go Outside',
        fr: 'Confusion : Aller à l\'extérieur',
        de: 'Konfusion: Nach außen',
        ko: '혼란: 바깥으로',
      },
      tts: {
        en: 'confusion',
        fr: 'Confusion, aller à l\'extérieur',
        de: 'konfusion',
        ko: '혼란',
      },
    },
    {
      id: 'O8S Idyllic Will',
      regex: / 14:28E6:Graven Image starts using Idyllic Will on (\y{Name})/,
      regexDe: / 14:28E6:Helige Statue starts using Idyllischer Wille on (\y{Name})/,
      regexFr: / 14:28E6:Statue Divine starts using Volonté Idyllique on (\y{Name})/,
      regexJa: / 14:28E6:神々の像 starts using 睡魔の神気 on (\y{Name})/,
      regexKo: / 14:28E6:신들의 상 starts using 수마의 신기 on (\y{Name})/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alarmText: {
        en: 'Sleep: Go Inside',
        fr: 'Sommeil : allez au centre',
        de: 'Schlaf: Zur Mitte',
        ko: '수면: 안으로',
      },
      tts: {
        en: 'sleep',
        fr: 'Sommeil',
        de: 'Schlaf',
        ko: '수면',
      },
    },
    {
      id: 'O8S Mana Charge',
      regex: / 14:28D1:Kefka starts using Mana Charge/,
      regexDe: / 14:28D1:Kefka starts using Mana-Aufladung/,
      regexFr: / 14:28D1:Kefka starts using Concentration De Mana/,
      regexJa: / 14:28D1:ケフカ starts using マジックチャージ/,
      regexJa: / 14:28D1:케프카 starts using 마력 충전/,
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
      regex: / 14:28D2:Kefka starts using Mana Release/,
      regexDe: / 14:28D2:Kefka starts using Mana-Entladung/,
      regexFr: / 14:28D2:Kefka starts using Décharge De Mana/,
      regexJa: / 14:28D2:ケフカ starts using マジックアウト/,
      regexJa: / 14:28D2:케프카 starts using 마력 방출/,
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
      regex: /1[56]:\y{ObjectId}:Kefka:28CF:Flagrant Fire:/,
      regexDe: /1[56]:\y{ObjectId}:Kefka:28CF:Flammendes Feuga:/,
      regexFr: /1[56]:\y{ObjectId}:Kefka:28CF:Méga Feu Faufilant:/,
      regexJa: /1[56]:\y{ObjectId}:ケフカ:28CF:めらめらファイガ:/,
      regexKo: /1[56]:\y{ObjectId}:케프카:28CF:이글이글 파이가:/,
      suppressSeconds: 40,
      run: function(data) {
        data.lastFire = {
          en: 'Spread',
          fr: 'Eloignez-vous',
          de: 'verteilen',
          ko: '산개',
        }[data.lang];
      },
    },
    {
      // 28CE: ability id on use
      // 28D0: damage from mana charge
      // 2B33: damage from mana release
      id: 'O8S Fire Stack',
      regex: /1[56]:\y{ObjectId}:Kefka:28D0:Flagrant Fire:/,
      regexDe: /1[56]:\y{ObjectId}:Kefka:28D0:Flammendes Feuga:/,
      regexFr: /1[56]:\y{ObjectId}:Kefka:28D0:Méga Feu Faufilant:/,
      regexJa: /1[56]:\y{ObjectId}:ケフカ:28D0:めらめらファイガ:/,
      regexKo: /1[56]:\y{ObjectId}:케프카:28D0:이글이글 파이가:/,
      suppressSeconds: 40,
      run: function(data) {
        data.lastFire = {
          en: 'Stack',
          fr: 'Stack',
          de: 'Stacken',
          ko: '집합',
        }[data.lang];
      },
    },
    {
      // 28CA: mana charge (both types)
      // 28CD: mana charge
      // 2B31: mana release
      id: 'O8S Thrumming Thunder Real',
      regex: /14:(?:28CD|2B31):Kefka starts using Thrumming Thunder/,
      regexDe: /14:(?:28CD|2B31):Kefka starts using Brachiales Blitzga/,
      regexFr: /14:(?:28CD|2B31):Kefka starts using Méga Foudre Fourmillante/,
      regexJa: /14:(?:28CD|2B31):ケフカ starts using もりもりサンダガ/,
      regexKo: /14:(?:28CD|2B31):케프카 starts using 찌릿찌릿 선더가/,
      suppressSeconds: 40,
      preRun: function(data) {
        data.lastThunder = {
          en: 'True Thunder',
          fr: 'Vraie foudre',
          de: 'Wahrer Blitz',
          ko: '진실 선더가',
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
      regex: /14:(?:28CC|2B30):Kefka starts using Thrumming Thunder/,
      regexDe: /14:(?:28CC|2B30):Kefka starts using Brachiales Blitzga/,
      regexFr: /14:(?:28CC|2B30):Kefka starts using Méga Foudre Fourmillante/,
      regexJa: /14:(?:28CC|2B30):ケフカ starts using もりもりサンダガ/,
      regexKo: /14:(?:28CC|2B30):케프카 starts using 찌릿찌릿 선더가/,
      suppressSeconds: 40,
      preRun: function(data) {
        data.lastThunder = {
          en: 'Fake Thunder',
          fr: 'Fausse foudre',
          de: 'Falscher Blitz',
          ko: '거짓 선더가',
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
      regex: /14:(?:28C5|2B2B):Kefka starts using Blizzard Blitz/,
      regexDe: /14:(?:28C5|2B2B):Kefka starts using Erstarrendes Eisga/,
      regexFr: /14:(?:28C5|2B2B):Kefka starts using Méga Glace Glissante/,
      regexJa: /14:(?:28C5|2B2B):ケフカ starts using ぐるぐるブリザガ/,
      regexKo: /14:(?:28C5|2B2B):케프카 starts using 빙글빙글 블리자가/,
      suppressSeconds: 40,
      preRun: function(data) {
        data.lastIce = {
          en: 'Fake Ice',
          fr: 'Fausse glace',
          de: 'Falsches Eis',
          ko: '거짓 블리자가',
        }[data.lang];
        data.lastIceDir = {
          en: 'Get Out',
          fr: 'sortir',
          de: 'raus da',
          ko: '밖으로',
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
      regex: /14:(?:28C9|2B2E):Kefka starts using Blizzard Blitz/,
      regexDe: /14:(?:28C9|2B2E):Kefka starts using Erstarrendes Eisga/,
      regexFr: /14:(?:28C9|2B2E):Kefka starts using Méga Glace Glissante/,
      regexJa: /14:(?:28C9|2B2E):ケフカ starts using ぐるぐるブリザガ/,
      regexKo: /14:(?:28C9|2B2E):케프카 starts using 빙글빙글 블리자가/,
      suppressSeconds: 40,
      preRun: function(data) {
        data.lastIce = {
          en: 'True Ice',
          fr: 'Vraie glace',
          de: 'Wahres Eis',
          ko: '진실 블리자가',
        }[data.lang];
        data.lastIceDir = {
          en: 'Get In',
          fr: 'rentrer dedans',
          de: 'reingehen',
          ko: '안으로',
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
      regex: /14:(?:28C4|2B2A):Kefka starts using Blizzard Blitz/,
      regexDe: /14:(?:28C4|2B2A):Kefka starts using Erstarrendes Eisga/,
      regexFr: /14:(?:28C4|2B2A):Kefka starts using Méga Glace Glissante/,
      regexJa: /14:(?:28C4|2B2A):ケフカ starts using ぐるぐるブリザガ/,
      regexKo: /14:(?:28C4|2B2A):ケフカ starts using 빙글빙글 블리자가/,
      suppressSeconds: 40,
      preRun: function(data) {
        data.lastIce = {
          en: 'Fake Ice',
          fr: 'Fausse glace',
          de: 'Falsches Eis',
          ko: '거짓 블리자가',
        }[data.lang];
        data.lastIceDir = {
          en: 'Get In',
          fr: 'rentrer dedans',
          de: 'reingehen',
          ko: '안으로',
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
      regex: /14:(?:28C8|2B2D):Kefka starts using Blizzard Blitz/,
      regexDe: /14:(?:28C8|2B2D):Kefka starts using Erstarrendes Eisga/,
      regexFr: /14:(?:28C8|2B2D):Kefka starts using Méga Glace Glissante/,
      regexJa: /14:(?:28C8|2B2D):ケフカ starts using ぐるぐるブリザガ/,
      regexKo: /14:(?:28C8|2B2D):케프카 starts using 빙글빙글 블리자가/,
      suppressSeconds: 40,
      preRun: function(data) {
        data.lastIce = {
          en: 'True Ice',
          fr: 'Vraie glace',
          de: 'Wahres Eis',
          ko: '진실 블리자가',
        }[data.lang];
        data.lastIceDir = {
          en: 'Get Out',
          fr: 'sortir',
          de: 'rausgehen',
          ko: '밖으로',
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
      locale: 'de',
      replaceSync: {
        'Graven Image': 'Heilige Statue',
        'Kefka': 'Kefka',
        'Light Of Consecration': 'Licht Der Weihe',
        'The Mad Head': 'Verrückter Kopf',
        'The limit gauge resets!': 'Der Limitrausch-Balken wurde geleert.',
      },
      replaceText: {
        '--targetable--': '--anvisierbar--',
        '--untargetable--': '--nich anvisierbar--',
        'Engage!': 'Start!',
        'Enrage': 'Finalangriff',

        'Aero Assault': 'Wallendes Windga',
        'Blizzard Blitz': 'Erstarrendes Eisga',
        'Flagrant Fire': 'Flammendes Feuga',
        'Graven Image': 'Göttliche Statue',
        'Gravitas': 'Gravitas',
        'Holy Ascent': 'Heiliger Aufstieg',
        'Hyperdrive': 'Hyperantrieb',
        'Idyllic Will': 'Idyllischer Wille',
        'Indolent Will': 'Träger Wille',
        'Indomitable Will': 'Unzähmbarer Wille',
        'Indulgent Will': 'Nachsichtiger Wille',
        'Inexorable Will': 'Unerbittlicher Wille',
        'Intemperate Will': 'Unmäßiger Wille',
        'Light Of Judgment': 'Licht Des Urteils',
        'Mana Charge': 'Mana-Aufladung',
        'Mana Release': 'Mana-Entladung',
        'Pulse Wave': 'Pulswelle',
        'Revolting Ruin': 'Revoltierendes Ruinga',
        'Shockwave': 'Schockwelle',
        'Thrumming Thunder': 'Brachiales Blitzga',
        'Timely Teleport': 'Turbulenter Teleport',
        'Ultima Upsurge': 'Ultima-Wallung',
        'Vitrophyre': 'Vitrophyr',
        'Wave Cannon': 'Wellenkanone',

        'All Things Ending': 'Ende Aller Dinge',
        'Blizzard III': 'Eisga',
        'Celestriad': 'Dreigestirn',
        'Explosion': 'Explosion',
        'Fire III': 'Feuga',
        'Forsaken': 'Verloren',
        'Future\'s End': 'Ende Der Zukunft',
        'Futures Numbered': 'Vernichtung Der Zukunft',
        'Gravitational Wave': 'Gravitationswelle',
        'Heartless Angel': 'Herzloser Engel',
        'Heartless Archangel': 'Herzloser Erzengel',
        'Hyperdrive': 'Hyperantrieb',
        'Idyllic Will': 'Idyllischer Wille',
        'Indulgent Will': 'Nachsichtiger Wille',
        'Light Of Judgment': 'Licht Des Urteils',
        'Meteor': 'Meteo',
        'Pasts Forgotten': 'Vernichtung Der Vergangenheit',
        'Pulse Wave': 'Pulswelle',
        'Starstrafe': 'Sternentanz',
        'The Path Of Light': 'Pfad Des Lichts',
        'Thunder III': 'Blitzga',
        'Trine': 'Trine',
        'Ultima': 'Ultima',
        'Ultimate Embrace': 'Ultima-Umarmung',
        'Wings Of Destruction': 'Vernichtungsschwinge',
        'Blizzard+Thunder': 'Eis+Blitz',
        'Half Arena': 'Halbe Arena',
        'Statue Gaze': 'Statuenblick',
        'Soak': 'Aufsaugen',
        'Past/Future': 'Vergangenheit/Zukunft',
        'Past/Future End': 'Vergangenheit/Zukunft Ende',
        'Knockback Tethers': 'Rückstoß Verbindungen',
        'Sleep/Confuse Tethers': 'Schlaf/Konfusion Verbindungen',
        'Statue Half Cleave': 'Statue Halber Cleave',
      },
    },
    {
      locale: 'fr',
      replaceSync: {
        'Graven Image': 'Statue Divine',
        'Kefka': 'Kefka',
        'Light Of Consecration': 'Lumière De La Consécration',
        'The Mad Head': 'Visage De La Folie',
        'The limit gauge resets!': 'La jauge de Transcendance a été réinitialisée.',
      },
      replaceText: {
        'Engage!': 'À l\'attaque',
        '--Reset--': '--Réinitialisation--',
        '--sync--': '--Synchronisation--',
        '--targetable--': '--Ciblable--',
        '--untargetable--': '--Impossible à cibler--',
        'Enrage': 'Enrage',

        'Aero Assault': 'Méga Vent Véhément',
        'Blizzard Blitz': 'Méga Glace Glissante',
        'Flagrant Fire': 'Méga Feu Faufilant',
        'Graven Image': 'Statue Divine',
        'Gravitas': 'Tir Gravitationnel',
        'Holy Ascent': 'Ascension Sacrée',
        'Hyperdrive': 'Colonne De Feu',
        'Idyllic Will': 'Volonté Idyllique',
        'Indolent Will': 'Volonté Indolente',
        'Indomitable Will': 'Volonté Indomptable',
        'Indulgent Will': 'Volonté Indulgente',
        'Inexorable Will': 'Volonté Inexorable',
        'Intemperate Will': 'Volonté Intempérante',
        'Light Of Judgment': 'Triade Guerrière',
        'Mana Charge': 'Concentration De Mana',
        'Mana Release': 'Décharge De Mana',
        'Pulse Wave': 'Pulsation Spirituelle',
        'Revolting Ruin': 'Méga Ruine Ravageuse',
        'Shockwave': 'Onde De Choc',
        'Thrumming Thunder': 'Méga Foudre Fourmillante',
        'Timely Teleport': 'Téléportation Turbulente',
        'Ultima Upsurge': 'Ultima Ulcérante',
        'Vitrophyre': 'Vitrophyre',
        'Wave Cannon': 'Canon Plasma',

        'Blizzard+Thunder': 'Méga Glace + Méga Foudre',
        'Half Arena': 'Moitié d\'arène',
        'Statue Gaze': 'Regard statue',

        'All Things Ending': 'Fin De Toutes Choses',
        'Blizzard III': 'Méga Glace',
        'Celestriad': 'Tristella',
        'Explosion': 'Explosion',
        'Fire III': 'Méga Feu',
        'Forsaken': 'Cataclysme',
        'Future\'s End': 'Fin Du Futur',
        'Futures Numbered': 'Ruine Du Futur',
        'Gravitational Wave': 'Onde Gravitationnelle',
        'Heartless Angel': 'Ange Sans Cœur',
        'Heartless Archangel': 'Archange Sans Cœur',
        'Hyperdrive': 'Colonne De Feu',
        'Idyllic Will': 'Volonté Idyllique',
        'Indulgent Will': 'Volonté Indulgente',
        'Light Of Judgment': 'Triade Guerrière',
        'Meteor': 'Météore',
        'Pasts Forgotten': 'Ruine Du Passé',
        'Pulse Wave': 'Pulsation Spirituelle',
        'Starstrafe': 'Fou Dansant',
        'The Path Of Light': 'Voie De Lumière',
        'Thunder III': 'Méga Foudre',
        'Trine': 'Trine',
        'Trine (big)': 'Trine (grand)',
        'Trine (small)': 'Trine (petit)',
        'Ultima': 'Ultima',
        'Ultimate Embrace': 'Étreinte Fatidique',
        'Wings Of Destruction': 'Aile De La Destruction',

        'Soak': 'Absorber',
        'Past/Future': 'Passé/Futur',
        'Past/Future End': 'Passé/Fin du futur',
        'Knockback Tethers': 'Liens de projection',
        'Sleep/Confuse Tethers': 'Liens de Sommeil/Confusion',
        'Statue Half Cleave': 'Demi clivage de la statue',
      },
    },
    {
      locale: 'ja',
      replaceSync: {
        'Graven Image': '神々の像',
        'Kefka': 'ケフカ',
        'Light Of Consecration': '聖別の光',
        'The Mad Head': 'マッドヘッド',
      },
      replaceText: {
        'Engage!': '戦闘開始！',

        'Aero Assault': 'ずんずんエアロガ',
        'Blizzard Blitz': 'ぐるぐるブリザガ',
        'Flagrant Fire': 'めらめらファイガ',
        'Graven Image': '神々の像',
        'Gravitas': '重力弾',
        'Holy Ascent': '昇天',
        'Hyperdrive': 'ハイパードライブ',
        'Idyllic Will': '睡魔の神気',
        'Indolent Will': '惰眠の神気',
        'Indomitable Will': '豪腕の神気',
        'Indulgent Will': '聖母の神気',
        'Inexorable Will': '無情の神気',
        'Intemperate Will': '撲殺の神気',
        'Light Of Judgment': '裁きの光',
        'Mana Charge': 'マジックチャージ',
        'Mana Release': 'マジックアウト',
        'Pulse Wave': '波動弾',
        'Revolting Ruin': 'ばりばりルインガ',
        'Shockwave': '衝撃波',
        'Thrumming Thunder': 'もりもりサンダガ',
        'Timely Teleport': 'ぶっとびテレポ',
        'Ultima Upsurge': 'どきどきアルテマ',
        'Vitrophyre': '岩石弾',
        'Wave Cannon': '波動砲',

        'All Things Ending': '消滅の脚',
        'Blizzard III': 'ブリザガ',
        'Celestriad': 'スリースターズ',
        'Explosion': '爆発',
        'Fire III': 'ファイガ',
        'Forsaken': 'ミッシング',
        'Future\'s End': '未来の終焉',
        'Futures Numbered': '未来の破滅',
        'Gravitational Wave': '重力波',
        'Heartless Angel': '心ない天使',
        'Heartless Archangel': '心ない大天使',
        'Hyperdrive': 'ハイパードライブ',
        'Idyllic Will': '睡魔の神気',
        'Indulgent Will': '聖母の神気',
        'Light Of Judgment': '裁きの光',
        'Meteor': 'メテオ',
        'Pasts Forgotten': '過去の破滅',
        'Pulse Wave': '波動弾',
        'Starstrafe': '妖星乱舞',
        'The Path Of Light': '光の波動',
        'Thunder III': 'サンダガ',
        'Trine': 'トライン',
        'Ultima': 'アルテマ',
        'Ultimate Embrace': '終末の双腕',
        'Wings Of Destruction': '破壊の翼',
      },
    },
    {
      locale: 'ko',
      replaceSync: {
        'Graven Image': '신들의 상',
        'Kefka': '케프카',
        'Light Of Consecration': '성결의 빛',
        'The Mad Head': '광인의 머리',
      },
      replaceText: {
        '--targetable--': '--대상 지정 가능--',
        '--untargetable--': '--대상 지정 불가--',
        'Enrage': '전멸기',
        'Engage!': '전투 시작!',

        'Aero Assault': '갈기갈기 에어로가',
        'Blizzard Blitz': '빙글빙글 블리자가',
        'Flagrant Fire': '이글이글 파이가',
        'Graven Image': '신들의 상',
        'Gravitas': '중력탄',
        'Holy Ascent': '승천',
        'Hyperdrive': '하이퍼드라이브',
        'Idyllic Will': '수마의 신기',
        'Indolent Will': '태만의 신기',
        'Indomitable Will': '호완의 신기',
        'Indulgent Will': '성모의 신기',
        'Inexorable Will': '무정의 신기',
        'Intemperate Will': '박살의 신기',
        'Light Of Judgment': '심판의 빛',
        'Mana Charge': '마력 충전',
        'Mana Release': '마력 방출',
        'Pulse Wave': '파동탄',
        'Revolting Ruin': '파삭파삭 루인가',
        'Shockwave': '충격파',
        'Thrumming Thunder': '찌릿찌릿 선더가',
        'Timely Teleport': '껑충껑충 텔레포',
        'Ultima Upsurge': '두근두근 알테마',
        'Vitrophyre': '암석탄',
        'Wave Cannon': '파동포',

        'All Things Ending': '소멸의 발차기',
        'Blizzard III': '블리자가',
        'Celestriad': '세 개의 별',
        'Explosion': '폭발',
        'Fire III': '파이가',
        'Forsaken': '행방불명',
        'Future\'s End': '미래의 종언',
        'Futures Numbered': '미래의 파멸',
        'Gravitational Wave': '중력파',
        'Heartless Angel': '비정한 천사',
        'Heartless Archangel': '비정한 대천사',
        'Hyperdrive': '하이퍼드라이브',
        'Idyllic Will': '수마의 신기',
        'Indulgent Will': '성모의 신기',
        'Light Of Judgment': '심판의 빛',
        'Meteor': '메테오',
        'Pasts Forgotten': '과거의 파멸',
        'Pulse Wave': '파동탄',
        'Starstrafe': '요성난무',
        'The Path Of Light': '빛의 파동',
        'Thunder III': '선더가',
        'Trine': '트라인',
        'Ultima': '알테마',
        'Ultimate Embrace': '종말의 포옹',
        'Wings Of Destruction': '파괴의 날개',
      },
    },
  ],
}];
