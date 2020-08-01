'use strict';

[{
  zoneRegex: {
    en: /^Eden's Gate: Sepulture \(Savage\)$/,
    cn: /^伊甸零式希望乐园 \(觉醒之章4\)$/,
    ko: /^희망의 낙원 에덴: 각성편\(영웅\) \(4\)$/,
  },
  zoneId: ZoneId.EdensGateSepultureSavage,
  timelineFile: 'e4s.txt',
  timelineTriggers: [
    {
      id: 'E4S Earthen Anguish',
      regex: /Earthen Anguish/,
      beforeSeconds: 3,
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank';
      },
      alertText: {
        en: 'Tank Busters',
        de: 'Tank buster',
        fr: 'Tank buster',
        ja: 'タンクバスター',
        cn: '坦克死刑',
        ko: '탱버',
      },
    },
  ],
  triggers: [
    {
      id: 'E4S Earthen Gauntlets',
      netRegex: NetRegexes.ability({ id: '40E6', source: 'Titan', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '40E6', source: 'Titan', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '40E6', source: 'Titan', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '40E6', source: 'タイタン', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '40E6', source: '泰坦', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '40E6', source: '타이탄', capture: false }),
      run: function(data) {
        data.phase = 'landslide';
        delete data.printedBury;
      },
    },
    {
      id: 'E4S Earthen Armor',
      netRegex: NetRegexes.ability({ id: ['40E7', '40E9'], source: 'Titan', capture: false }),
      netRegexDe: NetRegexes.ability({ id: ['40E7', '40E9'], source: 'Titan', capture: false }),
      netRegexFr: NetRegexes.ability({ id: ['40E7', '40E9'], source: 'Titan', capture: false }),
      netRegexJa: NetRegexes.ability({ id: ['40E7', '40E9'], source: 'タイタン', capture: false }),
      netRegexCn: NetRegexes.ability({ id: ['40E7', '40E9'], source: '泰坦', capture: false }),
      netRegexKo: NetRegexes.ability({ id: ['40E7', '40E9'], source: '타이탄', capture: false }),
      run: function(data) {
        data.phase = 'armor';
        delete data.printedBury;
      },
    },
    {
      id: 'E4S Stonecrusher',
      netRegex: NetRegexes.startsUsing({ id: '4116', source: 'Titan' }),
      netRegexDe: NetRegexes.startsUsing({ id: '4116', source: 'Titan' }),
      netRegexFr: NetRegexes.startsUsing({ id: '4116', source: 'Titan' }),
      netRegexJa: NetRegexes.startsUsing({ id: '4116', source: 'タイタン' }),
      netRegexCn: NetRegexes.startsUsing({ id: '4116', source: '泰坦' }),
      netRegexKo: NetRegexes.startsUsing({ id: '4116', source: '타이탄' }),
      condition: function(data, matches) {
        return matches.target == data.me || data.role == 'tank' || data.role == 'healer';
      },
      // As this seems to usually seems to be invulned,
      // don't make a big deal out of it.
      response: Responses.tankBuster(),
    },
    {
      id: 'E4S Pulse of the Land',
      netRegex: NetRegexes.headMarker({ id: '00B9' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      response: Responses.spread('alert'),
    },
    {
      id: 'E4S Evil Earth',
      netRegex: NetRegexes.startsUsing({ id: '410C', source: 'Titan', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '410C', source: 'Titan', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '410C', source: 'Titan', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '410C', source: 'タイタン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '410C', source: '泰坦', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '410C', source: '타이탄', capture: false }),
      suppressSeconds: 1,
      infoText: {
        en: 'Look for Evil Earth Marker',
        de: 'Schau nach den Grimm der Erde Marker',
        fr: 'Repérez une marque de Terre maléfique',
        ja: '範囲見て',
        cn: '观察地板',
        ko: '사악한 대지 패턴 확인',
      },
    },
    {
      id: 'E4S Force of the Land',
      netRegex: NetRegexes.headMarker({ id: '00BA' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      response: Responses.stack(),
    },
    {
      id: 'E4S Voice of the Land',
      netRegex: NetRegexes.startsUsing({ id: '4114', source: 'Titan', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '4114', source: 'Titan', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '4114', source: 'Titan', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '4114', source: 'タイタン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '4114', source: '泰坦', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '4114', source: '타이탄', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      response: Responses.aoe(),
    },
    {
      id: 'E4S Geocrush',
      netRegex: NetRegexes.startsUsing({ id: '4113', source: 'Titan', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '4113', source: 'Titan', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '4113', source: 'Titan', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '4113', source: 'タイタン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '4113', source: '泰坦', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '4113', source: '타이탄', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'E4S Massive Landslide - Front',
      netRegex: NetRegexes.ability({ id: '40E6', source: 'Titan', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '40E6', source: 'Titan', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '40E6', source: 'Titan', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '40E6', source: 'タイタン', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '40E6', source: '泰坦', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '40E6', source: '타이탄', capture: false }),
      alertText: {
        en: 'Landslide: In Front',
        de: 'Armberge: Vor ihm',
        fr: 'Glissement : Devant',
        ja: 'ランスラ: 正面へ',
        cn: '面前躲避',
        ko: '완갑: 정면',
      },
    },
    {
      id: 'E4S Massive Landslide - Sides',
      netRegex: NetRegexes.ability({ id: '4117', source: 'Titan', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '4117', source: 'Titan', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '4117', source: 'Titan', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '4117', source: 'タイタン', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '4117', source: '泰坦', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '4117', source: '타이탄', capture: false }),
      response: Responses.goSides('info'),
    },
    {
      id: 'E4S Landslide',
      netRegex: NetRegexes.startsUsing({ id: '411A', source: 'Titan', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '411A', source: 'Titan', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '411A', source: 'Titan', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '411A', source: 'タイタン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '411A', source: '泰坦', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '411A', source: '타이탄', capture: false }),
      alertText: {
        en: 'Back Corners',
        de: 'Hintere Ecken',
        fr: 'Coins arrière',
        ja: 'ランスラくるよ',
        cn: '后方角落',
        ko: '뒤쪽 구석으로',
      },
    },
    {
      id: 'E4S Crumbling Down',
      netRegex: NetRegexes.headMarker({ id: '0017' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Bomb on YOU',
        de: 'Bombe auf DIR',
        fr: 'Bombe sur VOUS',
        ja: 'マーカーついた',
        cn: '炸弹点名',
        ko: '거리감쇠 징 대상자',
      },
    },
    {
      // Bomb positions are all x = (86 west, 100 mid, 114 east), y = (86, 100, 114).
      // Note: as these may hit multiple people, there may be multiple lines for the same bomb.
      id: 'E4S Bury Directions',
      netRegex: NetRegexes.abilityFull({ id: '4142', source: 'Bomb Boulder' }),
      netRegexDe: NetRegexes.abilityFull({ id: '4142', source: 'Bomber-Brocken' }),
      netRegexFr: NetRegexes.abilityFull({ id: '4142', source: 'Bombo Rocher' }),
      netRegexJa: NetRegexes.abilityFull({ id: '4142', source: 'ボムボルダー' }),
      netRegexCn: NetRegexes.abilityFull({ id: '4142', source: '爆破岩石' }),
      netRegexKo: NetRegexes.abilityFull({ id: '4142', source: '바위폭탄' }),
      condition: function(data) {
        return !data.printedBury;
      },
      durationSeconds: 7,
      alertText: function(data, matches) {
        let x = matches.x;
        let y = matches.y;

        if (data.phase == 'armor') {
          // Three line bombs (middle, e/w, w/e), with seismic wave.
          if (x < 95) {
            data.printedBury = true;
            return {
              en: 'Hide Behind East',
              de: 'Im Osten vestecken',
              fr: 'Cachez-vous derrière à l\'est',
              cn: '右边躲避',
              ko: '동쪽으로',
            };
          } else if (x > 105) {
            data.printedBury = true;
            return {
              en: 'Hide Behind West',
              de: 'Im Westen vestecken',
              fr: 'Cachez-vous derrière à l\'ouest',
              cn: '左边躲避',
              ko: '서쪽으로',
            };
          }
        } else if (data.phase == 'landslide') {
          // Landslide cardinals/corners + middle, followed by remaining 4.
          let xMiddle = x < 105 && x > 95;
          let yMiddle = y < 105 && y > 95;
          // Ignore middle point, which may come first.
          if (xMiddle && yMiddle)
            return;

          data.printedBury = true;
          if (!xMiddle && !yMiddle) {
            // Corners dropped first.  Cardinals safe.
            return {
              en: 'Go Cardinals First',
              de: 'Zuerst zu den Seiten gehen',
              fr: 'Allez aux cardinaux en premier',
              ja: '十字',
              cn: '十字',
              ko: '먼저 측면으로 이동',
            };
          }
          // Cardinals dropped first.  Corners safe.
          return {
            en: 'Go Corners First',
            de: 'Zuerst in die Ecken gehen',
            fr: 'Allez dans les coins en premier',
            cn: '先去角落',
            ko: '먼저 구석으로 이동',
          };
        }
      },
    },
    {
      id: 'E4S Fault Line - Sides',
      netRegex: NetRegexes.ability({ id: '40E8', source: 'Titan', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '40E8', source: 'Titan', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '40E8', source: 'Titan', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '40E8', source: 'タイタン', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '40E8', source: '泰坦', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '40E8', source: '타이탄', capture: false }),
      alertText: {
        en: 'Wheels: On Sides',
        de: 'Räder: Zur Seite',
        fr: 'Roues : Sur les côtés',
        ja: '車輪: 横へ',
        cn: '车轮：两侧',
        ko: '바퀴: 옆으로',
      },
    },
    {
      id: 'E4S Fault Line - Front',
      netRegex: NetRegexes.ability({ id: '411F', source: 'Titan', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '411F', source: 'Titan', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '411F', source: 'Titan', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '411F', source: 'タイタン', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '411F', source: '泰坦', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '411F', source: '타이탄', capture: false }),
      infoText: {
        en: 'Tank Charge',
        de: 'Tank wird angefahren',
        fr: 'Charge tank',
        ja: 'タンクに突進',
        cn: '坦克冲锋',
        ko: '탱커를 향해 돌진',
      },
    },
    {
      id: 'E4S Magnitude 5.0',
      netRegex: NetRegexes.startsUsing({ id: '4121', source: 'Titan', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '4121', source: 'Titan', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '4121', source: 'Titan', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '4121', source: 'タイタン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '4121', source: '泰坦', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '4121', source: '타이탄', capture: false }),
      response: Responses.getUnder('alert'),
    },
    {
      id: 'E4S Earthen Fury',
      netRegex: NetRegexes.startsUsing({ id: '4124', source: 'Titan Maximum', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '4124', source: 'Gigantitan', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '4124', source: 'Maxi Titan', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '4124', source: 'マキシタイタン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '4124', source: '极大泰坦', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '4124', source: '거대 타이탄', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      response: Responses.bigAoe(),
    },
    {
      id: 'E4S Earthen Fist - Left/Right',
      netRegex: NetRegexes.startsUsing({ id: '412F', source: 'Titan Maximum', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '412F', source: 'Gigantitan', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '412F', source: 'Maxi Titan', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '412F', source: 'マキシタイタン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '412F', source: '极大泰坦', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '412F', source: '거대 타이탄', capture: false }),
      infoText: {
        en: 'Left, Then Right',
        de: 'Links, dann Rechts',
        fr: 'Gauche, puis droite',
        ja: '左 => 右',
        cn: '左 => 右',
        ko: '왼쪽 => 오른쪽',
      },
    },
    {
      id: 'E4S Earthen Fist - Right/Left',
      netRegex: NetRegexes.startsUsing({ id: '4130', source: 'Titan Maximum', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '4130', source: 'Gigantitan', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '4130', source: 'Maxi Titan', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '4130', source: 'マキシタイタン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '4130', source: '极大泰坦', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '4130', source: '거대 타이탄', capture: false }),
      infoText: {
        en: 'Right, Then Left',
        de: 'Rechts, dann Links',
        fr: 'Droite, puis gauche',
        ja: '右 => 左',
        cn: '右 => 左',
        ko: '오른쪽 => 왼쪽',
      },
    },
    {
      id: 'E4S Earthen Fist - 2x Left',
      netRegex: NetRegexes.startsUsing({ id: '4131', source: 'Titan Maximum', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '4131', source: 'Gigantitan', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '4131', source: 'Maxi Titan', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '4131', source: 'マキシタイタン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '4131', source: '极大泰坦', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '4131', source: '거대 타이탄', capture: false }),
      infoText: {
        en: 'Left, Stay Left',
        de: 'Links, Links bleiben',
        fr: 'Gauche, puis restez',
        ja: 'ずっと左',
        cn: '一直在左',
        ko: '왼쪽 => 왼쪽',
      },
    },
    {
      id: 'E4S Earthen Fist - 2x Right',
      netRegex: NetRegexes.startsUsing({ id: '4132', source: 'Titan Maximum', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '4132', source: 'Gigantitan', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '4132', source: 'Maxi Titan', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '4132', source: 'マキシタイタン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '4132', source: '极大泰坦', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '4132', source: '거대 타이탄', capture: false }),
      infoText: {
        en: 'Right, Stay Right',
        de: 'Rechts, Rechts bleiben',
        fr: 'Droite, puis restez',
        ja: 'ずっと右',
        cn: '一直在右',
        ko: '오른쪽 => 오른쪽',
      },
    },
    {
      id: 'E4S Dual Earthen Fists',
      netRegex: NetRegexes.startsUsing({ id: '4135', source: 'Titan Maximum', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '4135', source: 'Gigantitan', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '4135', source: 'Maxi Titan', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '4135', source: 'マキシタイタン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '4135', source: '极大泰坦', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '4135', source: '거대 타이탄', capture: false }),
      response: Responses.knockback('info'),
    },
    {
      id: 'E4S Weight of the World',
      netRegex: NetRegexes.headMarker({ id: '00BB' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      response: Responses.getOut(),
    },
    {
      id: 'E4S Megalith',
      netRegex: NetRegexes.headMarker({ id: '005D' }),
      alertText: function(data, matches) {
        if (data.role != 'tank') {
          return {
            en: 'Away from Tanks',
            de: 'Weg von den Tanks',
            fr: 'Éloignez-vous des tanks',
            ja: 'タンクから離れ',
            cn: '远离坦克',
            ko: '탱커에서 멀어지기',
          };
        }
        if (matches.target == data.me) {
          return {
            en: 'Stack on YOU',
            de: 'Auf DIR sammeln',
            fr: 'Package sur VOUS',
            ja: '自分にシェア',
            cn: '集合分摊',
            ko: '쉐어징 대상자',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches.target),
          de: 'Auf ' + data.ShortName(matches.target) + ' sammeln',
          fr: 'Packez-vous sur ' + data.ShortName(matches.target),
          ja: data.ShortName(matches.target) + 'にシェア',
          cn: '集合 ->' + data.ShortName(matches.target),
          ko: '"' + data.ShortName(matches.target) + '" 쉐어징',
        };
      },
    },
    {
      id: 'E4S Granite Gaol',
      netRegex: NetRegexes.headMarker({ id: '00BF' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Gaol on YOU',
        de: 'Gefängnis auf DIR',
        fr: 'Geôle sur VOUS',
        ja: '自分にジェイル',
        cn: '石牢点名',
        ko: '화강암 감옥 대상',
      },
    },
    {
      // TODO: these could be better called out
      // On the first set, maybe should tell you where to put the jails,
      // if it's a consistent strategy to ranged lb the jails.  After that
      // it could just tell you to "go right" or "go left".
      // On the second set, could just say "go right" / "go front" and
      // keep track of which it has seen.
      id: 'E4S Plate Fracture - Front Right',
      netRegex: NetRegexes.startsUsing({ id: '4125', source: 'Titan Maximum', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '4125', source: 'Gigantitan', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '4125', source: 'Maxi Titan', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '4125', source: 'マキシタイタン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '4125', source: '极大泰坦', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '4125', source: '거대 타이탄', capture: false }),
      infoText: {
        en: 'GET OFF FRONT RIGHT',
        de: 'VON VORNE RECHTS RUNTER',
        fr: 'PARTEZ DE L\'AVANT DROITE',
        ja: '右前壊れるよ',
        cn: '破坏右前',
        ko: '앞 오른쪽 피하기',
      },
    },
    {
      id: 'E4S Plate Fracture - Back Right',
      netRegex: NetRegexes.startsUsing({ id: '4126', source: 'Titan Maximum', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '4126', source: 'Gigantitan', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '4126', source: 'Maxi Titan', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '4126', source: 'マキシタイタン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '4126', source: '极大泰坦', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '4126', source: '거대 타이탄', capture: false }),
      infoText: {
        en: 'GET OFF BACK RIGHT',
        de: 'VON HINTEN RECHTS RUNTER',
        fr: 'PARTEZ DE L\'ARRIÈRE DROITE',
        ja: '右後ろ壊れるよ',
        cn: '破坏右后',
        ko: '뒤 오른쪽 피하기',
      },
    },
    {
      id: 'E4S Plate Fracture - Back Left',
      netRegex: NetRegexes.startsUsing({ id: '4127', source: 'Titan Maximum', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '4127', source: 'Gigantitan', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '4127', source: 'Maxi Titan', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '4127', source: 'マキシタイタン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '4127', source: '极大泰坦', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '4127', source: '거대 타이탄', capture: false }),
      infoText: {
        en: 'GET OFF BACK LEFT',
        de: 'VON HINTEN LINKS RUNTER',
        fr: 'PARTEZ DE L\'ARRIÈRE GAUCHE',
        ja: '左後ろ壊れるよ',
        cn: '破坏左后',
        ko: '뒤 왼쪽 피하기',
      },
    },
    {
      id: 'E4S Plate Fracture - Front Left',
      netRegex: NetRegexes.startsUsing({ id: '4128', source: 'Titan Maximum', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '4128', source: 'Gigantitan', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '4128', source: 'Maxi Titan', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '4128', source: 'マキシタイタン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '4128', source: '极大泰坦', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '4128', source: '거대 타이탄', capture: false }),
      infoText: {
        en: 'GET OFF FRONT LEFT',
        de: 'VON VORNE LINKS RUNTER',
        fr: 'PARTEZ DE L\'AVANT GAUCHE',
        ja: '左前壊れるよ',
        cn: '破坏左前',
        ko: '앞 왼쪽 피하기',
      },
    },
    {
      id: 'E4S Tumult',
      netRegex: NetRegexes.startsUsing({ id: '412A', source: 'Titan Maximum', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '412A', source: 'Gigantitan', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '412A', source: 'Maxi Titan', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '412A', source: 'マキシタイタン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '412A', source: '极大泰坦', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '412A', source: '거대 타이탄', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      response: Responses.aoe(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Bomb Boulder': 'Bomber-Brocken',
        '(?<!Gigan)Titan': 'Titan',
        'Titan Maximum': 'Gigantitan',
      },
      'replaceText': {
        'Bomb Boulders': 'Tumulus',
        'Crumbling Down': 'Felsfall',
        'Dual Earthen Fists': 'Gaias Hammerfaust',
        'Earthen Anguish': 'Gaias Pein',
        'Earthen Armor': 'Basaltpanzer',
        '(?<! )Earthen Fist': 'Gaias Faust',
        'Earthen Fury': 'Gaias Zorn',
        'Earthen Gauntlets': 'Gaia-Armberge',
        'Earthen Wheels(?!/)': 'Gaia-Räder',
        'Earthen Wheels/Gauntlets': 'Gaia-Räder/Armberge',
        'Evil Earth': 'Grimm der Erde',
        'Force of the Land': 'Gaias Tosen',
        'Geocrush': 'Kraterschlag',
        '(?<! )Landslide': 'Bergsturz',
        'Magnitude 5.0': 'Magnitude 5.0',
        'Megalith': 'Megalithenbrecher',
        'Orogenesis': 'Orogenese',
        'Plate Fracture': 'Felsberster',
        'Pulse of the Land': 'Gaias Beben',
        'Right/Left Landslide': 'Rechter/Linker Bergsturz',
        'Rock Throw': 'Granitgefängnis',
        'Seismic Wave': 'Seismische Welle',
        'Stonecrusher': 'Felsbrecher',
        'Tectonic Uplift': 'Tektonische Hebung',
        'Tumult': 'Katastrophales Beben',
        'Voice of the Land': 'Aufschrei der Erde',
        'Weight of the Land': 'Gaias Gewicht',
        'Weight of the World': 'Schwere der Erde',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Bomb Boulder': 'Bombo Rocher',
        'Titan(?! )': 'Titan',
        'Titan Maximum': 'Maxi Titan',
      },
      'replaceText': {
        '\\?': ' ?',
        'Bomb Boulders': 'Bombo rocher',
        'Crumbling Down': 'Chute de monolithes',
        'Dual Earthen Fists': 'Frappe de la terre',
        'Earthen Anguish': 'Peine de la terre',
        'Earthen Armor': 'Armure tellurique',
        '(?<! )Earthen Fist': 'Poing de la terre',
        'Earthen Fury': 'Fureur tellurique',
        'Earthen Gauntlets': 'Poing tellurique',
        'Earthen Wheels(?!/)': 'Pas tellurique',
        'Earthen Wheels/Gauntlets': 'Pas/Poing tellurique',
        'Evil Earth': 'Terre maléfique',
        'Force of the Land': 'Grondement tellurique',
        'Geocrush': 'Broie-terre',
        '(?<! )Landslide': 'Glissement de terrain',
        'Magnitude 5.0': 'Magnitude 5',
        'Megalith': 'Écrasement mégalithique',
        'Orogenesis': 'Orogenèse',
        'Plate Fracture': 'Fracture rocheuse',
        'Pulse of the Land': 'Vibration tellurique',
        'Right/Left Landslide': 'Glissement dextre/senestre',
        'Rock Throw': 'Jeté de rocs',
        'Seismic Wave': 'Ondes sismiques',
        'Stonecrusher': 'Éruption tellurique',
        'Tectonic Uplift': 'Soulèvement tectonique',
        'Tumult': 'Tumulte',
        'Voice of the Land': 'Hurlement tellurique',
        'Weight of the Land': 'Poids de la terre',
        'Weight of the World': 'Poids du monde',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Bomb Boulder': 'ボムボルダー',
        'Titan(?! )': 'タイタン',
        'Titan Maximum': 'マキシタイタン',
      },
      'replaceText': {
        'Bomb Boulders': 'ボムボルダー',
        'Crumbling Down': '岩盤崩落',
        'Dual Earthen Fists': '大地の両拳',
        'Earthen Anguish': '大地の痛み',
        'Earthen Armor': '大地の鎧',
        '(?<! )Earthen Fist': '大地の拳',
        'Earthen Fury': '大地の怒り',
        'Earthen Gauntlets': '大地の手甲',
        'Earthen Wheels(?!/)': '大地の車輪',
        'Earthen Wheels/Gauntlets': '大地の車輪/手甲',
        'Evil Earth': 'イビルアース',
        'Force of the Land': '大地の轟き',
        'Geocrush': 'ジオクラッシュ',
        '(?<! )Landslide': 'ランドスライド',
        'Magnitude 5.0': 'マグニチュード5.0',
        'Megalith': 'メガリスクラッシュ',
        'Orogenesis': 'オーロジェニー',
        'Plate Fracture': 'ロックフラクチャー',
        'Pulse of the Land': '大地の響き',
        'Rock Throw': 'グラナイト・ジェイル',
        'Seismic Wave': 'サイズミックウェーブ',
        'Stonecrusher': 'ロッククラッシュ',
        'Tectonic Uplift': 'クラスタルアップリフト',
        'Tumult': '激震',
        'Voice of the Land': '大地の叫び',
        'Weight of the Land': '大地の重み',
        'Weight of the World': '大陸の重み',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Bomb Boulder': '爆破岩石',
        'Titan(?! )': '泰坦',
        'Titan Maximum': '极大泰坦',
      },
      'replaceText': {
        'Bomb Boulders': '爆破岩石',
        'Crumbling Down': '岩层崩落',
        'Dual Earthen Fists': '大地之双拳',
        'Earthen Anguish': '大地之痛',
        'Earthen Armor': '大地之铠',
        '(?<! )Earthen Fist': '大地之拳',
        'Earthen Fury': '大地之怒',
        'Earthen Gauntlets': '大地之手甲',
        'Earthen Wheels(?!/)': '大地之车轮',
        'Earthen Wheels/Gauntlets': '大地之车轮/手甲',
        'Evil Earth': '邪土',
        'Force of the Land': '大地之轰',
        'Geocrush': '大地粉碎',
        '(?<! )Landslide': '地裂',
        'Magnitude 5.0': '震级5.0',
        'Megalith': '巨石',
        'Orogenesis': '造山',
        'Plate Fracture': '岩盘粉碎',
        'Pulse of the Land': '大地之响',
        'Right/Left Landslide': '右/左地裂',
        'Rock Throw': '花岗岩牢狱',
        'Seismic Wave': '地震波',
        'Stonecrusher': '崩岩',
        'Tectonic Uplift': '地壳上升',
        'Tumult': '怒震',
        'Voice of the Land': '大地之号',
        'Weight of the Land': '大地之重',
        'Weight of the World': '铁球',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Bomb Boulder': '바위폭탄',
        'Titan(?! )': '타이탄',
        'Titan Maximum': '거대 타이탄',
      },
      'replaceText': {
        'Bomb Boulders': '바위폭탄',
        'Crumbling Down': '암반 낙하',
        'Dual Earthen Fists': '대지의 두 주먹',
        'Earthen Anguish': '대지의 고통',
        'Earthen Armor': '대지의 갑옷',
        '(?<! )Earthen Fist': '대지의 주먹',
        'Earthen Fury': '대지의 분노',
        'Earthen Gauntlets': '대지의 완갑',
        'Earthen Wheels(?!/)': '대지의 바퀴',
        'Earthen Wheels/Gauntlets': '대지의 바퀴/완갑',
        'Evil Earth': '사악한 대지',
        'Force of the Land': '대지의 고동',
        'Geocrush': '대지 붕괴',
        '(?<! )Landslide': '산사태',
        'Magnitude 5.0': '진도 5.0',
        'Megalith': '거석 붕괴',
        'Orogenesis': '조산 운동',
        'Plate Fracture': '지각판 파쇄',
        'Pulse of the Land': '대지의 울림',
        'Right/Left Landslide': '좌/우측 산사태',
        'Rock Throw': '화강암 감옥',
        'Seismic Wave': '지진파',
        'Stonecrusher': '암석 붕괴',
        'Tectonic Uplift': '지각 융기',
        'Tumult': '격진',
        'Voice of the Land': '대지의 외침',
        'Weight of the Land': '대지의 무게',
        'Weight of the World': '대륙의 무게',
      },
    },
  ],
}];
