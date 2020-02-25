'use strict';

[{
  zoneRegex: {
    en: /^Eden's Gate: Sepulture \(Savage\)$/,
    cn: /^伊甸零式希望乐园 \(觉醒之章4\)$/,
    ko: /^희망의 낙원 에덴: 각성편\(영웅\) \(4\)$/,
  },
  timelineFile: 'e4s.txt',
  timelineTriggers: [
    {
      id: 'E4S Earthen Anguish',
      regex: /Earthen Anguish/,
      beforeSeconds: 3,
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank';
      },
      response: Responses.tankBuster(),
    },
  ],
  triggers: [
    {
      id: 'E4S Earthen Gauntlets',
      regex: Regexes.ability({ id: '40E6', source: 'Titan', capture: false }),
      regexDe: Regexes.ability({ id: '40E6', source: 'Titan', capture: false }),
      regexFr: Regexes.ability({ id: '40E6', source: 'Titan', capture: false }),
      regexJa: Regexes.ability({ id: '40E6', source: 'タイタン', capture: false }),
      regexCn: Regexes.ability({ id: '40E6', source: '泰坦', capture: false }),
      regexKo: Regexes.ability({ id: '40E6', source: '타이탄', capture: false }),
      run: function(data) {
        data.phase = 'landslide';
        delete data.printedBury;
      },
    },
    {
      id: 'E4S Earthen Armor',
      regex: Regexes.ability({ id: ['40E7', '40E9'], source: 'Titan', capture: false }),
      regexDe: Regexes.ability({ id: ['40E7', '40E9'], source: 'Titan', capture: false }),
      regexFr: Regexes.ability({ id: ['40E7', '40E9'], source: 'Titan', capture: false }),
      regexJa: Regexes.ability({ id: ['40E7', '40E9'], source: 'タイタン', capture: false }),
      regexCn: Regexes.ability({ id: ['40E7', '40E9'], source: '泰坦', capture: false }),
      regexKo: Regexes.ability({ id: ['40E7', '40E9'], source: '타이탄', capture: false }),
      run: function(data) {
        data.phase = 'armor';
        delete data.printedBury;
      },
    },
    {
      id: 'E4S Stonecrusher',
      regex: Regexes.startsUsing({ id: '4116', source: 'Titan' }),
      regexDe: Regexes.startsUsing({ id: '4116', source: 'Titan' }),
      regexFr: Regexes.startsUsing({ id: '4116', source: 'Titan' }),
      regexJa: Regexes.startsUsing({ id: '4116', source: 'タイタン' }),
      regexCn: Regexes.startsUsing({ id: '4116', source: '泰坦' }),
      regexKo: Regexes.startsUsing({ id: '4116', source: '타이탄' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'E4S Pulse of the Land',
      regex: Regexes.headMarker({ id: '00B9' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      response: Responses.spread(),
    },
    {
      id: 'E4S Evil Earth',
      regex: Regexes.startsUsing({ id: '410C', source: 'Titan', capture: false }),
      regexDe: Regexes.startsUsing({ id: '410C', source: 'Titan', capture: false }),
      regexFr: Regexes.startsUsing({ id: '410C', source: 'Titan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '410C', source: 'タイタン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '410C', source: '泰坦', capture: false }),
      regexKo: Regexes.startsUsing({ id: '410C', source: '타이탄', capture: false }),
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
      regex: Regexes.headMarker({ id: '00BA' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      response: Responses.stack(),
    },
    {
      id: 'E4S Voice of the Land',
      regex: Regexes.startsUsing({ id: '4114', source: 'Titan', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4114', source: 'Titan', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4114', source: 'Titan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4114', source: 'タイタン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '4114', source: '泰坦', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4114', source: '타이탄', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      response: Responses.aoe(),
    },
    {
      id: 'E4S Geocrush',
      regex: Regexes.startsUsing({ id: '4113', source: 'Titan', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4113', source: 'Titan', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4113', source: 'Titan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4113', source: 'タイタン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '4113', source: '泰坦', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4113', source: '타이탄', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'E4S Massive Landslide - Front',
      regex: Regexes.ability({ id: '40E6', source: 'Titan', capture: false }),
      regexDe: Regexes.ability({ id: '40E6', source: 'Titan', capture: false }),
      regexFr: Regexes.ability({ id: '40E6', source: 'Titan', capture: false }),
      regexJa: Regexes.ability({ id: '40E6', source: 'タイタン', capture: false }),
      regexCn: Regexes.ability({ id: '40E6', source: '泰坦', capture: false }),
      regexKo: Regexes.ability({ id: '40E6', source: '타이탄', capture: false }),
      alertText: {
        en: 'Landslide: In Front',
        de: 'Armberge: Vor ihm',
        fr: 'Devant',
        ja: 'ランスラ: 正面へ',
        cn: '面前躲避',
        ko: '완갑: 정면',
      },
    },
    {
      id: 'E4S Massive Landslide - Sides',
      regex: Regexes.ability({ id: '4117', source: 'Titan', capture: false }),
      regexDe: Regexes.ability({ id: '4117', source: 'Titan', capture: false }),
      regexFr: Regexes.ability({ id: '4117', source: 'Titan', capture: false }),
      regexJa: Regexes.ability({ id: '4117', source: 'タイタン', capture: false }),
      regexCn: Regexes.ability({ id: '4117', source: '泰坦', capture: false }),
      regexKo: Regexes.ability({ id: '4117', source: '타이탄', capture: false }),
      response: Responses.goSides(),
    },
    {
      id: 'E4S Landslide',
      regex: Regexes.startsUsing({ id: '411A', source: 'Titan', capture: false }),
      regexDe: Regexes.startsUsing({ id: '411A', source: 'Titan', capture: false }),
      regexFr: Regexes.startsUsing({ id: '411A', source: 'Titan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '411A', source: 'タイタン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '411A', source: '泰坦', capture: false }),
      regexKo: Regexes.startsUsing({ id: '411A', source: '타이탄', capture: false }),
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
      regex: Regexes.headMarker({ id: '0017' }),
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
      regex: Regexes.abilityFull({ id: '4142', source: 'Bomb Boulder' }),
      regexDe: Regexes.abilityFull({ id: '4142', source: 'Bomber-Brocken' }),
      regexFr: Regexes.abilityFull({ id: '4142', source: 'Bombo Rocher' }),
      regexJa: Regexes.abilityFull({ id: '4142', source: 'ボムボルダー' }),
      regexCn: Regexes.abilityFull({ id: '4142', source: '爆破岩石' }),
      regexKo: Regexes.abilityFull({ id: '4142', source: '바위폭탄' }),
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
      regex: Regexes.ability({ id: '40E8', source: 'Titan', capture: false }),
      regexDe: Regexes.ability({ id: '40E8', source: 'Titan', capture: false }),
      regexFr: Regexes.ability({ id: '40E8', source: 'Titan', capture: false }),
      regexJa: Regexes.ability({ id: '40E8', source: 'タイタン', capture: false }),
      regexCn: Regexes.ability({ id: '40E8', source: '泰坦', capture: false }),
      regexKo: Regexes.ability({ id: '40E8', source: '타이탄', capture: false }),
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
      regex: Regexes.ability({ id: '411F', source: 'Titan', capture: false }),
      regexDe: Regexes.ability({ id: '411F', source: 'Titan', capture: false }),
      regexFr: Regexes.ability({ id: '411F', source: 'Titan', capture: false }),
      regexJa: Regexes.ability({ id: '411F', source: 'タイタン', capture: false }),
      regexCn: Regexes.ability({ id: '411F', source: '泰坦', capture: false }),
      regexKo: Regexes.ability({ id: '411F', source: '타이탄', capture: false }),
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
      regex: Regexes.startsUsing({ id: '4121', source: 'Titan', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4121', source: 'Titan', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4121', source: 'Titan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4121', source: 'タイタン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '4121', source: '泰坦', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4121', source: '타이탄', capture: false }),
      response: Responses.getUnder(),
    },
    {
      id: 'E4S Earthen Fury',
      regex: Regexes.startsUsing({ id: '4124', source: 'Titan Maximum', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4124', source: 'Gigantitan', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4124', source: 'Maxi Titan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4124', source: 'マキシタイタン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '4124', source: '极大泰坦', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4124', source: '거대 타이탄', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      response: Responses.bigAoe(),
    },
    {
      id: 'E4S Earthen Fist - Left/Right',
      regex: Regexes.startsUsing({ id: '412F', source: 'Titan Maximum', capture: false }),
      regexDe: Regexes.startsUsing({ id: '412F', source: 'Gigantitan', capture: false }),
      regexFr: Regexes.startsUsing({ id: '412F', source: 'Maxi Titan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '412F', source: 'マキシタイタン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '412F', source: '极大泰坦', capture: false }),
      regexKo: Regexes.startsUsing({ id: '412F', source: '거대 타이탄', capture: false }),
      infoText: {
        en: 'Left, Then Right',
        de: 'Links, dann Rechts',
        fr: 'Gauche puis droite',
        ja: '左 => 右',
        cn: '左 => 右',
        ko: '왼쪽 => 오른쪽',
      },
    },
    {
      id: 'E4S Earthen Fist - Right/Left',
      regex: Regexes.startsUsing({ id: '4130', source: 'Titan Maximum', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4130', source: 'Gigantitan', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4130', source: 'Maxi Titan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4130', source: 'マキシタイタン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '4130', source: '极大泰坦', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4130', source: '거대 타이탄', capture: false }),
      infoText: {
        en: 'Right, Then Left',
        de: 'Rechts, dann Links',
        fr: 'Droite puis gauche',
        ja: '右 => 左',
        cn: '右 => 左',
        ko: '오른쪽 => 왼쪽',
      },
    },
    {
      id: 'E4S Earthen Fist - 2x Left',
      regex: Regexes.startsUsing({ id: '4131', source: 'Titan Maximum', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4131', source: 'Gigantitan', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4131', source: 'Maxi Titan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4131', source: 'マキシタイタン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '4131', source: '极大泰坦', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4131', source: '거대 타이탄', capture: false }),
      infoText: {
        en: 'Left, Stay Left',
        de: 'Links, Links bleiben',
        fr: 'Gauche puis restez',
        ja: 'ずっと左',
        cn: '一直在左',
        ko: '왼쪽 => 왼쪽',
      },
    },
    {
      id: 'E4S Earthen Fist - 2x Right',
      regex: Regexes.startsUsing({ id: '4132', source: 'Titan Maximum', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4132', source: 'Gigantitan', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4132', source: 'Maxi Titan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4132', source: 'マキシタイタン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '4132', source: '极大泰坦', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4132', source: '거대 타이탄', capture: false }),
      infoText: {
        en: 'Right, Stay Right',
        de: 'Rechts, Rechts bleiben',
        fr: 'Droite puis restez',
        ja: 'ずっと右',
        cn: '一直在右',
        ko: '오른쪽 => 오른쪽',
      },
    },
    {
      id: 'E4S Dual Earthen Fists',
      regex: Regexes.startsUsing({ id: '4135', source: 'Titan Maximum', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4135', source: 'Gigantitan', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4135', source: 'Maxi Titan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4135', source: 'マキシタイタン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '4135', source: '极大泰坦', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4135', source: '거대 타이탄', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'E4S Weight of the World',
      regex: Regexes.headMarker({ id: '00BB' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      response: Responses.getOut(),
    },
    {
      id: 'E4S Megalith',
      regex: Regexes.headMarker({ id: '005D' }),
      response: Responses.stackOn(),
    },
    {
      id: 'E4S Granite Gaol',
      regex: Regexes.headMarker({ id: '00BF' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Gaol on YOU',
        ja: '自分にジェイル',
        de: 'Gefängnis auf DIR',
        fr: 'Geôle sur VOUS',
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
      regex: Regexes.startsUsing({ id: '4125', source: 'Titan Maximum', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4125', source: 'Gigantitan', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4125', source: 'Maxi Titan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4125', source: 'マキシタイタン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '4125', source: '极大泰坦', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4125', source: '거대 타이탄', capture: false }),
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
      regex: Regexes.startsUsing({ id: '4126', source: 'Titan Maximum', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4126', source: 'Gigantitan', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4126', source: 'Maxi Titan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4126', source: 'マキシタイタン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '4126', source: '极大泰坦', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4126', source: '거대 타이탄', capture: false }),
      infoText: {
        en: 'GET OFF BACK RIGHT',
        de: 'VON HINTEN RECHTS RUNTER',
        fr: 'PARTEZ DE L\'ARRIERE DROITE',
        ja: '右後ろ壊れるよ',
        cn: '破坏右后',
        ko: '뒤 오른쪽 피하기',
      },
    },
    {
      id: 'E4S Plate Fracture - Back Left',
      regex: Regexes.startsUsing({ id: '4127', source: 'Titan Maximum', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4127', source: 'Gigantitan', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4127', source: 'Maxi Titan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4127', source: 'マキシタイタン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '4127', source: '极大泰坦', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4127', source: '거대 타이탄', capture: false }),
      infoText: {
        en: 'GET OFF BACK LEFT',
        de: 'VON HINTEN LINKS RUNTER',
        fr: 'PARTEZ DE L\'ARRIERE GAUCHE',
        ja: '左後ろ壊れるよ',
        cn: '破坏左后',
        ko: '뒤 왼쪽 피하기',
      },
    },
    {
      id: 'E4S Plate Fracture - Front Left',
      regex: Regexes.startsUsing({ id: '4128', source: 'Titan Maximum', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4128', source: 'Gigantitan', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4128', source: 'Maxi Titan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4128', source: 'マキシタイタン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '4128', source: '极大泰坦', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4128', source: '거대 타이탄', capture: false }),
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
      regex: Regexes.startsUsing({ id: '412A', source: 'Titan Maximum', capture: false }),
      regexDe: Regexes.startsUsing({ id: '412A', source: 'Gigantitan', capture: false }),
      regexFr: Regexes.startsUsing({ id: '412A', source: 'Maxi Titan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '412A', source: 'マキシタイタン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '412A', source: '极大泰坦', capture: false }),
      regexKo: Regexes.startsUsing({ id: '412A', source: '거대 타이탄', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      response: Responses.aoe(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'missingTranslations': true,
      'replaceSync': {
        'Titan': 'Titan',
        'Granite Gaol': 'Granitgefängnis',
        'Bomb Boulder': 'Bomber-Brocken',
      },
      'replaceText': {
        'Dual Earthen Fists': 'Gaias Hammerfaust',
        'Weight of the World': 'Schwere der Erde',
        'Weight of the Land': 'Gaias Gewicht',
        'Voice of the Land': 'Aufschrei der Erde',
        'Unknown Ability': 'Unknown Ability',
        'Tumult': 'Katastrophales Beben',
        'Tectonic Uplift': 'Tektonische Hebung',
        'Stonecrusher': 'Felsbrecher',
        'Seismic Wave': 'Seismische Welle',
        'Rock Throw': 'Granitgefängnis',
        'Rightward Landslide': 'Rechter Bergsturz',
        'Pulse of the Land': 'Gaias Beben',
        'Plate Fracture': 'Felsberster',
        'Orogenesis': 'Orogenese',
        'Megalith': 'Megalithenbrecher',
        'Massive Landslide': 'Gigantischer Bergsturz',
        'Magnitude 5.0': 'Magnitude 5.0',
        '(?<! )Landslide': 'Bergsturz',
        'Geocrush': 'Kraterschlag',
        'Force of the Land': 'Gaias Tosen',
        'Fault Line': 'Bruchlinie',
        'Explosion': 'Explosion',
        'Evil Earth': 'Grimm der Erde',
        'Earthen Wheels/Gauntlets': 'Gaia-Räder/Armberge',
        'Earthen Wheels(?!/)': 'Gaia-Räder',
        'Earthen Gauntlets': 'Gaia-Armberge',
        'Earthen Fury': 'Gaias Zorn',
        '(?<! )Earthen Fist': 'Gaias Faust',
        'Earthen Armor': 'Basaltpanzer',
        'Earthen Anguish': 'Gaias Pein',
        'Crumbling Down': 'Felsfall',
        'Bury': 'Begraben',
        'Bomb Boulders': 'Tumulus',
        'Aftershock': 'Nachbeben',
      },
      '~effectNames': {
        'Summon Order III': 'Egi-Attacke III',
        'Summon Order': 'Egi-Attacke I',
        'Physical Vulnerability Up': 'Erhöhte Physische Verwundbarkeit',
        'Magic Vulnerability Up': 'Erhöhte Magie-Verwundbarkeit',
        'Healing Magic Down': 'Heilmagie -',
        'Filthy': 'Dreck',
        'Fetters': 'Gefesselt',
        'Devotion': 'Hingabe',
        'Damage Down': 'Schaden -',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Titan(?! )': 'Titan',
        'Granite Gaol': 'Geôle De Granite',
        'Bomb Boulder': 'Bombo Rocher',
      },
      'replaceText': {
        'Weight of the World': 'Poids du monde',
        'Weight of the Land': 'Poids de la terre',
        'Voice of the Land': 'Hurlement tellurique',
        'Unknown Ability': 'Unknown Ability',
        'Tumult': 'Tumulte',
        'Tectonic Uplift': 'Soulèvement tectonique',
        'Stonecrusher': 'Éruption tellurique',
        'Seismic Wave': 'Ondes sismiques',
        'Rock Throw': 'Jeté de rocs',
        'Rightward Landslide': 'Glissement dextre',
        'Pulse of the Land': 'Vibration tellurique',
        'Plate Fracture': 'Fracture rocheuse',
        'Orogenesis': 'Orogenèse',
        'Megalith': 'Écrasement mégalithique',
        'Massive Landslide': 'Glissement apocalyptique',
        'Magnitude 5.0': 'Magnitude 5',
        '(?<! )Landslide': 'Glissement de terrain',
        'Geocrush': 'Broie-terre',
        'Force of the Land': 'Grondement tellurique',
        'Fault Line': 'Faille tectonique',
        'Explosion': 'Explosion',
        'Evil Earth': 'Terre maléfique',
        'Earthen Wheels/Gauntlets': 'Pas/Poing tellurique',
        'Earthen Wheels(?!/)': 'Pas tellurique',
        'Earthen Gauntlets': 'Poing tellurique',
        'Earthen Fury': 'Fureur tellurique',
        '(?<! )Earthen Fist': 'Poing de la terre',
        'Earthen Armor': 'Armure tellurique',
        'Earthen Anguish': 'Peine de la terre',
        'Dual Earthen Fists': 'Frappe de la terre',
        'Crumbling Down': 'Chute de monolithes',
        'Bury': 'Ensevelissement',
        'Bomb Boulders': 'Bombo rocher',
        'Aftershock': 'Répercussion',
        '--sync--': '--Synchronisation--',
        '--Reset--': '--Réinitialisation--',
      },
      '~effectNames': {
        'Summon Order III': 'Actions en attente: 3',
        'Summon Order': 'Action en attente: 1',
        'Physical Vulnerability Up': 'Vulnérabilité Physique Augmentée',
        'Magic Vulnerability Up': 'Vulnérabilité Magique Augmentée',
        'Healing Magic Down': 'Malus De Soin',
        'Filthy': 'Embourbement',
        'Fetters': 'Attache',
        'Devotion': 'Dévouement',
        'Damage Down': 'Malus De Dégâts',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'ジャイアントボルダー': 'ジャイアントボルダー',
        'Titan(?! )': 'タイタン',
        'Granite Gaol': 'グラナイト・ジェイル',
        'Bomb Boulder': 'ボムボルダー',
        'Titan Maximum': 'マキシタイタン',
      },
      'replaceText': {
        'Weight of the World': '大陸の重み',
        'Weight of the Land': '大地の重み',
        'Voice of the Land': '大地の叫び',
        'Unknown Ability': 'Unknown Ability',
        'Tumult': '激震',
        'Tectonic Uplift': 'クラスタルアップリフト',
        'Stonecrusher': 'ロッククラッシュ',
        'Seismic Wave': 'サイズミックウェーブ',
        'Rock Throw': 'グラナイト・ジェイル',
        'Rightward Landslide': 'ライト・ランドスライド',
        'Pulse of the Land': '大地の響き',
        'Plate Fracture': 'ロックフラクチャー',
        'Orogenesis': 'オーロジェニー',
        'Megalith': 'メガリスクラッシュ',
        'Massive Landslide': 'メガ・ランドスライド',
        'Magnitude 5.0': 'マグニチュード5.0',
        '(?<! )Landslide': 'ランドスライド',
        'Geocrush': 'ジオクラッシュ',
        'Force of the Land': '大地の轟き',
        'Fault Line': 'フォールトゾーン',
        'Explosion': '爆散',
        'Evil Earth': 'イビルアース',
        'Earthen Wheels/Gauntlets': '大地の車輪/手甲',
        'Earthen Wheels(?!/)': '大地の車輪',
        'Earthen Gauntlets': '大地の手甲',
        'Earthen Fury': '大地の怒り',
        '(?<! )Earthen Fist': '大地の拳',
        'Earthen Armor': '大地の鎧',
        'Earthen Anguish': '大地の痛み',
        'Dual Earthen Fists': '大地の両拳',
        'Crumbling Down': '岩盤崩落',
        'Bury': '衝撃',
        'Bomb Boulders': 'ボムボルダー',
        'Aftershock': '余波',
      },
      '~effectNames': {
        'Summon Order III': 'アクション実行待機III',
        'Summon Order': 'アクション実行待機I',
        'Physical Vulnerability Up': '被物理ダメージ増加',
        'Magic Vulnerability Up': '被魔法ダメージ増加',
        'Healing Magic Down': '回復魔法効果低下',
        'Filthy': '汚泥',
        'Fetters': '拘束',
        'Devotion': 'エギの加護',
        'Damage Down': 'ダメージ低下',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Titan Maximum': '极大泰坦',
        'Titan(?! )': '泰坦',
        'Granite Gaol': '花岗石牢',
        'Bomb Boulder': '爆破岩石',
      },
      'replaceText': {
        'Weight of the World': '铁球',
        'Weight [Oo]f [Tt]he Land': '大地之重',
        'Weight of the Land': '大地之重',
        'Voice [Oo]f [Tt]he Land': '大地之号',
        'Voice of the Land': '大地之号',
        'Tumult': '怒震',
        'Tectonic Uplift': '地壳上升',
        'Stonecrusher': '崩岩',
        'Seismic Wave': '地震波',
        'Rock Throw': '花岗岩牢狱',
        'Rightward Landslide': '右侧地裂',
        'Pulse of the Land': '大地之响',
        'Plate Fracture': '岩盘粉碎',
        'Orogenesis': '造山',
        'Megalith': '巨石',
        'Massive Landslide': '百万地裂',
        'Magnitude 5.0': '震级5.0',
        'Right/Left Landslide': '右/左地裂',
        '(?<! )Landslide': '地裂',
        'Geocrush': '大地粉碎',
        'Force of the Land': '大地之轰',
        'Fault Line': '断裂带',
        'Explosion': '爆炸',
        'Evil Earth': '邪土',
        'Earthen Wheels/Gauntlets': '大地之车轮/手甲',
        'Earthen Wheels(?!/)': '大地之车轮',
        'Earthen Gauntlets': '大地之手甲',
        'Earthen Fury': '大地之怒',
        'Dual Earthen Fists': '大地之双拳',
        '(?<! )Earthen Fist': '大地之拳',
        'Earthen Armor': '大地之铠',
        'Earthen Anguish': '大地之痛',
        'Crumbling Down': '岩层崩落',
        'Bury': '塌方',
        'Bomb Boulders': '爆破岩石',
        'Aftershock': '余波',
      },
      '~effectNames': {
        'Summon Order III': '发动技能待命III',
        'Summon Order': '发动技能待命I',
        'Physical Vulnerability Up': '物理受伤加重',
        'Magic Vulnerability Up': '魔法受伤加重',
        'Healing Magic Down': '治疗魔法效果降低',
        'Filthy': '污泥',
        'Fetters': '拘束',
        'Devotion': '灵护',
        'Damage Down': '伤害降低',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Titan(?! )': '타이탄',
        'Titan Maximum': '거대 타이탄',
        'Granite Gaol': '화강암 감옥',
        'Bomb Boulder': '바위폭탄',
      },
      'replaceText': {
        'Dual Earthen Fists': '대지의 두 주먹',
        'Weight of the World': '대륙의 무게',
        'Weight of the Land': '대지의 무게',
        'Voice of the Land': '대지의 외침',
        'Tumult': '격진',
        'Tectonic Uplift': '지각 융기',
        'Stonecrusher': '암석 붕괴',
        'Seismic Wave': '지진파',
        'Rock Throw': '화강암 감옥',
        'Rightward Landslide': '우측 산사태',
        'Pulse of the Land': '대지의 울림',
        'Plate Fracture': '지각판 파쇄',
        'Orogenesis': '조산 운동',
        'Megalith': '거석 붕괴',
        'Massive Landslide': '대규모 산사태',
        'Right/Left Landslide': '좌/우측 산사태',
        'Magnitude 5.0': '진도 5.0',
        '(?<! )Landslide': '산사태',
        'Geocrush': '대지 붕괴',
        'Force of the Land': '대지의 고동',
        'Fault Line': '단층선',
        'Explosion': '폭산',
        'Evil Earth': '사악한 대지',
        'Earthen Wheels/Gauntlets': '대지의 바퀴/완갑',
        'Earthen Wheels(?!/)': '대지의 바퀴',
        'Earthen Gauntlets': '대지의 완갑',
        'Earthen Fury': '대지의 분노',
        '(?<! )Earthen Fist': '대지의 주먹',
        'Earthen Armor': '대지의 갑옷',
        'Earthen Anguish': '대지의 고통',
        'Crumbling Down': '암반 낙하',
        'Bury': '충격',
        'Bomb Boulders': '바위폭탄',
        'Aftershock': '여파',
      },
      '~effectNames': {
        'Summon Order III': '기술 실행 대기 3',
        'Summon Order': '기술 실행 대기 1',
        'Physical Vulnerability Up': '받는 물리 피해량 증가',
        'Magic Vulnerability Up': '받는 마법 피해량 증가',
        'Healing Magic Down': '회복마법 효과 감소',
        'Filthy': '진흙탕',
        'Fetters': '구속',
        'Devotion': '에기의 가호',
        'Damage Down': '주는 피해량 감소',
      },
    },
  ],
}];
