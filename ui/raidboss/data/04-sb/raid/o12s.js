'use strict';

// O12S - Alphascape 4.0 Savage

[{
  zoneRegex: {
    en: /^Alphascape V4.0 \(Savage\)$/,
    cn: /^欧米茄零式时空狭缝 \(阿尔法幻境4\)$/,
    ko: /^차원의 틈 오메가: 알파편\(영웅\) \(4\)$/,
  },
  timelineFile: 'o12s.txt',
  triggers: [
    {
      id: 'O12S Phase Init',
      regex: Regexes.startsUsing({ id: '3357', source: 'Omega', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3357', source: 'Omega', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3357', source: 'Oméga', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3357', source: 'オメガ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3357', source: '欧米茄', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3357', source: '오메가', capture: false }),
      run: function(data) {
        data.isFinalOmega = true;

        data.dpsShortStack = true;
        data.helloDebuffs = {};
        data.archiveMarkers = {};
        data.armValue = 0;
        data.numArms = 0;
      },
    },
    {
      id: 'O12S Beyond Defense',
      regex: Regexes.ability({ id: '332C', source: 'Omega-M' }),
      regexDe: Regexes.ability({ id: '332C', source: 'Omega-M' }),
      regexFr: Regexes.ability({ id: '332C', source: 'Oméga-M' }),
      regexJa: Regexes.ability({ id: '332C', source: 'オメガM' }),
      regexCn: Regexes.ability({ id: '332C', source: '欧米茄M' }),
      regexKo: Regexes.ability({ id: '332C', source: '오메가 M' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alarmText: {
        en: 'Don\'t Stack!',
        de: 'Nicht stacken!',
        fr: 'Ne vous packez pas !',
        ja: 'スタックするな！',
        cn: '分散站位！',
        ko: '쉐어 맞지 말것',
      },
    },
    {
      id: 'O12S Local Resonance',
      regex: Regexes.gainsEffect({ target: 'Omega', effect: 'Local Resonance', capture: false }),
      regexDe: Regexes.gainsEffect({ target: 'Omega', effect: 'Resonanzprogramm: Nah', capture: false }),
      regexFr: Regexes.gainsEffect({ target: 'Oméga', effect: 'Programme De Résonance: Proximité', capture: false }),
      regexJa: Regexes.gainsEffect({ target: 'オメガ', effect: 'レゾナンスプログラム：ニアー', capture: false }),
      regexCn: Regexes.gainsEffect({ target: '欧米茄', effect: '共鸣程序：近', capture: false }),
      regexKo: Regexes.gainsEffect({ target: '오메가', effect: '공명 프로그램: 근거리', capture: false }),
      infoText: {
        en: 'Keep Bosses Apart',
        de: 'Bosse auseinander ziehen',
        fr: 'Séparez les boss',
        ja: 'ボス離して',
        cn: '拉开Boss',
        ko: '보스 떨어뜨리기',
      },
    },
    {
      id: 'O12S Remote Resonance',
      regex: Regexes.gainsEffect({ target: 'Omega', effect: 'Remote Resonance', capture: false }),
      regexDe: Regexes.gainsEffect({ target: 'Omega', effect: 'Resonanzprogramm: Fern', capture: false }),
      regexFr: Regexes.gainsEffect({ target: 'Oméga', effect: 'Programme De Résonance: Distance', capture: false }),
      regexJa: Regexes.gainsEffect({ target: 'オメガ', effect: 'レゾナンスプログラム：ファー', capture: false }),
      regexCn: Regexes.gainsEffect({ target: '欧米茄', effect: '共鸣程序：远', capture: false }),
      regexKo: Regexes.gainsEffect({ target: '오메가', effect: '공명 프로그램: 원거리', capture: false }),
      alertText: {
        en: 'Move Bosses Together',
        de: 'Bosse zusammenziehen',
        fr: 'Packez les boss',
        ja: 'ボス重ねて',
        cn: '拉近Boss',
        ko: '보스 붙이기',
      },
    },
    {
      id: 'O12S Solar Ray',
      regex: Regexes.startsUsing({ id: ['3350', '3351'], source: ['Omega', 'Omega-M'] }),
      regexDe: Regexes.startsUsing({ id: ['3350', '3351'], source: ['Omega', 'Omega-M'] }),
      regexFr: Regexes.startsUsing({ id: ['3350', '3351'], source: ['Oméga', 'Oméga-M'] }),
      regexJa: Regexes.startsUsing({ id: ['3350', '3351'], source: ['オメガ', 'オメガM'] }),
      regexCn: Regexes.startsUsing({ id: ['3350', '3351'], source: ['欧米茄', '欧米茄M'] }),
      regexKo: Regexes.startsUsing({ id: ['3350', '3351'], source: ['오메가', '오메가 M'] }),
      condition: function(data, matches) {
        return data.me == matches.target || data.role == 'healer';
      },
      suppressSeconds: 1,
      response: Responses.tankBuster(),
    },
    {
      id: 'O12S Optimized Blade Dance',
      regex: Regexes.startsUsing({ id: ['334B', '334C'], source: ['Omega', 'Omega-M'] }),
      regexDe: Regexes.startsUsing({ id: ['334B', '334C'], source: ['Omega', 'Omega-M'] }),
      regexFr: Regexes.startsUsing({ id: ['334B', '334C'], source: ['Oméga', 'Oméga-M'] }),
      regexJa: Regexes.startsUsing({ id: ['334B', '334C'], source: ['オメガ', 'オメガM'] }),
      regexCn: Regexes.startsUsing({ id: ['334B', '334C'], source: ['欧米茄', '欧米茄M'] }),
      regexKo: Regexes.startsUsing({ id: ['334B', '334C'], source: ['오메가', '오메가 M'] }),
      condition: function(data, matches) {
        return data.me == matches.target || data.role == 'healer';
      },
      suppressSeconds: 1,
      response: Responses.tankBuster(),
    },
    {
      id: 'O12S Electric Slide Marker',
      regex: Regexes.headMarker({ id: '009[12345678]' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: function(data, matches) {
        let num = parseInt(matches.id);
        let isTriangle = num >= 95;
        num -= 90;
        if (isTriangle)
          num -= 4;

        let squareName = {
          en: 'Square',
          de: 'Viereck',
          fr: 'Carré',
          ja: '四角',
          cn: '四角',
          ko: '짝수',
        }[data.lang];
        let triangleName = {
          en: 'Triangle',
          de: 'Dreieck',
          fr: 'Triangle',
          ja: '三角',
          cn: '三角',
          ko: '홀수',
        }[data.lang];
        return '#' + num + ' ' + (isTriangle ? triangleName : squareName);
      },
    },
    {
      id: 'O12S MF Stack Marker',
      regex: Regexes.headMarker({ id: '003E', capture: false }),
      condition: function(data) {
        return !data.isFinalOmega;
      },
      suppressSeconds: 1,
      response: Responses.stack('info'),
    },
    {
      id: 'O12S Optimized Meteor',
      regex: Regexes.headMarker({ id: '0057' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      response: Responses.meteorOnYou('info'),
    },
    {
      id: 'O12S Packet Filter F',
      regex: Regexes.gainsEffect({ effect: 'Packet Filter F' }),
      regexDe: Regexes.gainsEffect({ effect: 'Sicherungssystem W' }),
      regexFr: Regexes.gainsEffect({ effect: 'Programme Protecteur F' }),
      regexJa: Regexes.gainsEffect({ effect: 'ガードプログラムF' }),
      regexCn: Regexes.gainsEffect({ effect: '防护程序F' }),
      regexKo: Regexes.gainsEffect({ effect: '방어 프로그램 F' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Attack Omega-M',
        de: 'Omega-M angreifen',
        fr: 'Attaquez Oméga-M',
        ja: 'Mを攻撃',
        cn: '攻击欧米茄-M',
        ko: '오메가 M 공격',
      },
    },
    {
      id: 'O12S Packet Filter M',
      regex: Regexes.gainsEffect({ effect: 'Packet Filter M' }),
      regexDe: Regexes.gainsEffect({ effect: 'Sicherungssystem M' }),
      regexFr: Regexes.gainsEffect({ effect: 'Programme Protecteur M' }),
      regexJa: Regexes.gainsEffect({ effect: 'ガードプログラムM' }),
      regexCn: Regexes.gainsEffect({ effect: '防护程序M' }),
      regexKo: Regexes.gainsEffect({ effect: '방어 프로그램 M' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Attack Omega-F',
        de: 'Omega-W angreifen',
        fr: 'Attaquez Oméga-F',
        ja: 'Fを攻撃',
        cn: '攻击欧米茄-F',
        ko: '오메가 F 공격',
      },
    },
    {
      id: 'O12S Diffuse Wave Cannon Sides',
      regex: Regexes.startsUsing({ id: '3367', source: 'Omega', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3367', source: 'Omega', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3367', source: 'Oméga', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3367', source: 'オメガ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3367', source: '欧米茄', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3367', source: '오메가', capture: false }),
      response: Responses.goSides('info'),
    },
    {
      id: 'O12S Diffuse Wave Cannon Front/Back',
      regex: Regexes.startsUsing({ id: '3368', source: 'Omega', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3368', source: 'Omega', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3368', source: 'Oméga', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3368', source: 'オメガ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3368', source: '欧米茄', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3368', source: '오메가', capture: false }),
      response: Responses.goFrontBack('info'),
    },
    {
      id: 'O12S Oversampled Wave Cannon Right',
      regex: Regexes.startsUsing({ id: '3364', source: 'Omega', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3364', source: 'Omega', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3364', source: 'Oméga', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3364', source: 'オメガ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3364', source: '欧米茄', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3364', source: '오메가', capture: false }),
      infoText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Monitors Left',
            de: 'Monitore Links',
            fr: 'Moniteur Gauche',
            cn: '探测左边',
            ko: '모니터 왼쪽',
          };
        }
        return {
          en: 'Dodge Left',
          de: 'Links ausweichen',
          fr: 'Evitez à gauche',
          cn: '左侧躲闪',
          ko: '오른쪽으로',
        };
      },
    },
    {
      id: 'O12S Oversampled Wave Cannon Left',
      regex: Regexes.startsUsing({ id: '3365', source: 'Omega', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3365', source: 'Omega', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3365', source: 'Oméga', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3365', source: 'オメガ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3365', source: '欧米茄', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3365', source: '오메가', capture: false }),
      infoText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Monitors Right',
            de: 'Monitore Rechts',
            fr: 'Moniteur Droite',
            cn: '探测右边',
            ko: '모니터 오른쪽',
          };
        }
        return {
          en: 'Dodge Right',
          de: 'Rechts ausweichen',
          fr: 'Evitez à droite',
          cn: '右侧躲闪',
          ko: '왼쪽으로',
        };
      },
    },
    {
      id: 'O12S Target Analysis Target',
      regex: Regexes.headMarker({ id: '000E' }),
      alarmText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Vuln on YOU',
            de: 'Verwundbarkeit auf DIR',
            fr: 'Vulnérabilité sur VOUS',
            ja: '標的 on YOU',
            cn: '目标识别',
            ko: '표적식별 대상자',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me == matches.target || data.role != 'tank')
          return;
        return {
          en: 'Vuln on ' + data.ShortName(matches.target),
          de: 'Verwundbarkeit auf ' + data.ShortName(matches.target),
          fr: 'Vulnérabilité sur ' + data.ShortName(matches.target),
          ja: '標的 on ' + data.ShortName(matches.target),
          cn: '目标识别->' + data.ShortName(matches.target),
          ko: '"' + data.ShortName(matches.target) + '" 표적식별',
        };
      },
    },
    {
      id: 'O12S Local Tethers',
      regex: Regexes.gainsEffect({ effect: 'Local Regression' }),
      regexDe: Regexes.gainsEffect({ effect: 'Regression: Nah' }),
      regexFr: Regexes.gainsEffect({ effect: 'Bogue Intentionnel: Proximité' }),
      regexJa: Regexes.gainsEffect({ effect: 'エンバグ：ニアー' }),
      regexCn: Regexes.gainsEffect({ effect: '回归方程：近' }),
      regexKo: Regexes.gainsEffect({ effect: '연쇄 오류: 근거리' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Close Tethers',
        de: 'Nahe Verbindungen',
        fr: 'Liens proches',
        ja: 'ニアー',
        cn: '靠近连线',
        ko: '가까이 붙는 줄',
      },
    },
    {
      id: 'O12S Far Tethers',
      regex: Regexes.gainsEffect({ effect: 'Remote Regression' }),
      regexDe: Regexes.gainsEffect({ effect: 'Regression: Fern' }),
      regexFr: Regexes.gainsEffect({ effect: 'Bogue Intentionnel: Distance' }),
      regexJa: Regexes.gainsEffect({ effect: 'エンバグ：ファー' }),
      regexCn: Regexes.gainsEffect({ effect: '回归方程：远' }),
      regexKo: Regexes.gainsEffect({ effect: '연쇄 오류: 원거리' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Far Tethers',
        de: 'Entfernte Verbindungen',
        fr: 'Liens éloignés',
        ja: 'ファー',
        cn: '远离连线',
        ko: '멀리 떨어지는 줄',
      },
    },
    {
      id: 'O12S Defamation',
      regex: Regexes.gainsEffect({ effect: 'Critical Overflow Bug' }),
      regexDe: Regexes.gainsEffect({ effect: 'Kritischer Bug: Überlauf' }),
      regexFr: Regexes.gainsEffect({ effect: 'Bogue Critique: Boucle' }),
      regexJa: Regexes.gainsEffect({ effect: 'クリティカルバグ：サークル' }),
      regexCn: Regexes.gainsEffect({ effect: '严重错误：上溢' }),
      regexKo: Regexes.gainsEffect({ effect: '치명적 오류: 광역' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alarmText: {
        en: 'Defamation on YOU',
        de: 'Urteil auf DIR',
        fr: '#Médisance sur VOUS',
        ja: 'サークルついた',
        cn: '严重错误：上溢',
        ko: '치명적오류:광역 8초',
      },
    },
    {
      id: 'O12S Latent Defect',
      regex: Regexes.gainsEffect({ effect: 'Latent Defect' }),
      regexDe: Regexes.gainsEffect({ effect: 'Latenter Bug' }),
      regexFr: Regexes.gainsEffect({ effect: 'Bogue Latent' }),
      regexJa: Regexes.gainsEffect({ effect: 'レイテントバグ' }),
      regexCn: Regexes.gainsEffect({ effect: '潜在错误' }),
      regexKo: Regexes.gainsEffect({ effect: '잠재적 오류' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Blue Marker',
        de: 'Blauer Marker',
        fr: 'Marqueur bleu',
        ja: 'レイテントついた',
        cn: '蓝点名',
        ko: '잠재적오류 10초',
      },
    },
    {
      id: 'O12S Rot',
      regex: Regexes.gainsEffect({ effect: 'Critical Underflow Bug' }),
      regexDe: Regexes.gainsEffect({ effect: 'Kritischer Bug: Unterlauf' }),
      regexFr: Regexes.gainsEffect({ effect: 'Bogue Critique: Dégradation' }),
      regexJa: Regexes.gainsEffect({ effect: 'クリティカルバグ：デグレード' }),
      regexCn: Regexes.gainsEffect({ effect: '严重错误：下溢' }),
      regexKo: Regexes.gainsEffect({ effect: '치명적 오류: 전이' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Rot',
        de: 'Fäulnis',
        fr: 'Pourriture',
        ja: 'デグレードついた',
        cn: '红点名',
        ko: '치명적오류:전이 14초',
      },
    },
    {
      id: 'O12S Hello World Stack',
      regex: Regexes.gainsEffect({ effect: 'Critical Synchronization Bug' }),
      regexDe: Regexes.gainsEffect({ effect: 'Kritischer Bug: Synchronisierung' }),
      regexFr: Regexes.gainsEffect({ effect: 'Bogue Critique: Partage' }),
      regexJa: Regexes.gainsEffect({ effect: 'クリティカルバグ：シェア' }),
      regexCn: Regexes.gainsEffect({ effect: '严重错误：同步' }),
      regexKo: Regexes.gainsEffect({ effect: '치명적 오류: 분배' }),
      delaySeconds: function(data, matches) {
        return matches.target == data.me ? 0 : 1;
      },
      alertText: function(data, matches) {
        let t = parseFloat(matches.duration);
        if (data.me != matches.target)
          return;
        if (!(t > 0))
          return;
        if (t <= 8) {
          return {
            en: 'Short Stack on YOU',
            de: 'Kurzer Stack auf YOU',
            fr: 'Marque courte sur VOUS',
            ja: '早シェア on YOU',
            cn: '短D',
            ko: '8초 치명적오류:분배(쉐어)',
          };
        }
        return {
          en: 'Long Stack on YOU',
          de: 'Langer Stack auf YOU',
          fr: 'Marque longue sur VOUS',
          ja: '遅シェア on YOU',
          cn: '长D',
          ko: '13초 치명적오류:분배(쉐어)',
        };
      },
      infoText: function(data, matches) {
        let t = parseFloat(matches.duration);
        if (data.me == matches.target)
          return;
        if (!data.dpsShortStack)
          return;
        if (!(t > 0))
          return;
        if (t <= 8) {
          data.dpsShortStack = false;
          return {
            en: 'Short Stack on ' + data.ShortName(matches.target),
            de: 'Kurzer Stack auf ' + data.ShortName(matches.target),
            fr: 'Marque courte sur ' + data.ShortName(matches.target),
            ja: '早シェア on ' + data.ShortName(matches.target),
            cn: '短D->' + data.ShortName(matches.target),
            ko: '"' + data.ShortName(matches.target) + '" 쉐어',
          };
        }
        return;
      },
    },
    {
      id: 'O12S Hello World No Marker',
      regex: Regexes.gainsEffect({ effect: '(?:Critical Overflow Bug|Latent Defect|Critical Synchronization Bug)' }),
      regexDe: Regexes.gainsEffect({ effect: '(?:Kritischer Bug: Überlauf|Latenter Bug|Kritischer Bug: Synchronisierung)' }),
      regexFr: Regexes.gainsEffect({ effect: '(?:Bogue Critique: Boucle|Bogue Latent|Bogue Critique: Partage)' }),
      regexJa: Regexes.gainsEffect({ effect: '(?:クリティカルバグ：サークル|レイテントバグ|クリティカルバグ：シェア)' }),
      regexCn: Regexes.gainsEffect({ effect: '(?:严重错误：上溢|潜在错误|严重错误：同步)' }),
      regexKo: Regexes.gainsEffect({ effect: '(?:치명적 오류: 광역|잠재적 오류|치명적 오류: 분배)' }),
      preRun: function(data, matches) {
        data.helloDebuffs[matches.target] = true;
      },
      alertText: function(data) {
        // 1 Defamation (T), 3 Blue Markers (T/H/D), 2 Stack Markers (D/D) = 6
        // Ignore rot here to be consistent.
        if (Object.keys(data.helloDebuffs).length != 6)
          return;
        if (data.me in data.helloDebuffs)
          return;
        data.helloDebuffs[data.me] = true;
        return {
          en: 'No Marker',
          de: 'Kein Marker',
          fr: 'Aucun marqueur',
          ja: '無職',
          cn: '闲D',
          ko: '무징 대상자',
        };
      },
    },
    {
      id: 'O12S Hello World Tower Complete',
      regex: Regexes.gainsEffect({ effect: 'Cascading Latent Defect' }),
      regexDe: Regexes.gainsEffect({ effect: 'Latenter Bug: Unterlauf' }),
      regexFr: Regexes.gainsEffect({ effect: 'Bogue Latent: Dégradation' }),
      regexJa: Regexes.gainsEffect({ effect: 'レイテントバグ：デグレード' }),
      regexCn: Regexes.gainsEffect({ effect: '潜在错误：下溢' }),
      regexKo: Regexes.gainsEffect({ effect: '잠재적 오류: 전이' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Move out for Defamation',
        de: 'Rausgehen für Urteil',
        fr: 'Ecartez-vous pour #médisance',
        ja: 'サークル捨てる',
        cn: '离开人群传毒',
        ko: '잠재적 오류: 전이',
      },
    },
    {
      id: 'O12S Archive All Marker Tracking',
      regex: Regexes.headMarker({ id: ['003E', '0060'] }),
      condition: function(data) {
        return data.isFinalOmega;
      },
      run: function(data, matches) {
        data.archiveMarkers[matches.target] = matches.id;
      },
    },
    {
      id: 'O12S Archive All No Marker',
      regex: Regexes.headMarker({ id: ['003E', '0060'], capture: false }),
      condition: function(data) {
        // 4 fire markers, 1 stack marker.
        return data.isFinalOmega && Object.keys(data.archiveMarkers).length == 5;
      },
      infoText: function(data) {
        if (data.me in data.archiveMarkers)
          return;
        for (let player in data.archiveMarkers) {
          if (data.archiveMarkers[player] != '003E')
            continue;
          return {
            en: 'Stack on ' + data.ShortName(player),
            de: 'Stacken auf ' + data.ShortName(player),
            fr: 'Packez-vous sur ' + data.ShortName(player),
            ja: data.ShortName(player) + 'とスタック',
            cn: '与' + data.ShortName(player) + '集合',
            ko: '"' + data.ShortName(player) + '" 쉐어',
          };
        }
      },
    },
    {
      id: 'O12S Archive All Stack Marker',
      regex: Regexes.headMarker({ id: '003E' }),
      condition: function(data, matches) {
        return data.isFinalOmega && matches.target == data.me;
      },
      response: Responses.stackOn('info'),
    },
    {
      id: 'O12S Archive All Spread Marker',
      regex: Regexes.headMarker({ id: '0060' }),
      condition: function(data, matches) {
        return data.isFinalOmega && matches.target == data.me;
      },
      response: Responses.spread(),
    },
    {
      id: 'O12S Archive All Blue Arrow',
      regex: Regexes.headMarker({ target: 'Rear Power Unit', id: '009D', capture: false }),
      regexDe: Regexes.headMarker({ target: 'hinter(?:e|er|es|en) Antriebseinheit', id: '009D', capture: false }),
      regexFr: Regexes.headMarker({ target: 'unité arrière', id: '009D', capture: false }),
      regexJa: Regexes.headMarker({ target: 'リアユニット', id: '009D', capture: false }),
      regexCn: Regexes.headMarker({ target: '尾部组', id: '009D', capture: false }),
      regexKo: Regexes.headMarker({ target: '후면 유닛', id: '009D', capture: false }),
      alertText: {
        en: 'Back Left',
        de: 'Hinten Links',
        fr: 'Arrière gauche',
        ja: '左後ろ',
        cn: '左后',
        ko: '좌측 후방',
      },
    },
    {
      id: 'O12S Archive All Red Arrow',
      regex: Regexes.headMarker({ target: 'Rear Power Unit', id: '009C', capture: false }),
      regexDe: Regexes.headMarker({ target: 'hinter(?:e|er|es|en) Antriebseinheit', id: '009C', capture: false }),
      regexFr: Regexes.headMarker({ target: 'unité arrière', id: '009C', capture: false }),
      regexJa: Regexes.headMarker({ target: 'リアユニット', id: '009C', capture: false }),
      regexCn: Regexes.headMarker({ target: '尾部组', id: '009C', capture: false }),
      regexKo: Regexes.headMarker({ target: '후면 유닛', id: '009C', capture: false }),
      alertText: {
        en: 'Back Right',
        de: 'Hinten Rechts',
        fr: 'Arrière droite',
        ja: '右後ろ',
        cn: '右后',
        ko: '우측 후방',
      },
    },
    {
      id: 'O12S Archive  Peripheral Tracking',
      regex: Regexes.headMarker({ target: 'Right Arm Unit', id: ['009C', '009D'] }),
      regexDe: Regexes.headMarker({ target: 'Rechter Arm', id: ['009C', '009D'] }),
      regexFr: Regexes.headMarker({ target: 'Unité Bras Droit', id: ['009C', '009D'] }),
      regexJa: Regexes.headMarker({ target: 'ライトアームユニット', id: ['009C', '009D'] }),
      regexCn: Regexes.headMarker({ target: '右臂组', id: ['009C', '009D'] }),
      regexKo: Regexes.headMarker({ target: '오른팔 유닛', id: ['009C', '009D'] }),
      run: function(data, matches) {
        // Create a 3 digit binary value, R = 0, B = 1.
        // e.g. BBR = 110 = 6
        data.armValue *= 2;
        if (matches.id == '009D')
          data.armValue += 1;
        data.numArms++;
      },
    },
    {
      id: 'O12S Archive Peripheral',
      regex: Regexes.headMarker({ target: 'Right Arm Unit', id: ['009C', '009D'], capture: false }),
      regexDe: Regexes.headMarker({ target: 'Rechter Arm', id: ['009C', '009D'], capture: false }),
      regexFr: Regexes.headMarker({ target: 'Unité Bras Droit', id: ['009C', '009D'], capture: false }),
      regexJa: Regexes.headMarker({ target: 'ライトアームユニット', id: ['009C', '009D'], capture: false }),
      regexCn: Regexes.headMarker({ target: '右臂组', id: ['009C', '009D'], capture: false }),
      regexKo: Regexes.headMarker({ target: '오른팔 유닛', id: ['009C', '009D'], capture: false }),
      condition: function(data) {
        return data.numArms == 3;
      },
      alertText: function(data) {
        let v = parseInt(data.armValue);
        if (!(v >= 0) || v > 7)
          return;
        return {
          en: {
            0b000: 'East',
            0b001: 'Northeast',
            0b010: undefined,
            0b011: 'Northwest',
            0b100: 'Southeast',
            0b101: undefined,
            0b110: 'Southwest',
            0b111: 'West',
          },
          de: {
            0b000: 'Osten',
            0b001: 'Nordosten',
            0b010: undefined,
            0b011: 'Nordwesten',
            0b100: 'Südosten',
            0b101: undefined,
            0b110: 'Südwesten',
            0b111: 'Westen',
          },
          ja: {
            0b000: '東',
            0b001: '北東',
            0b010: undefined,
            0b011: '北西',
            0b100: '南東',
            0b101: undefined,
            0b110: '南西',
            0b111: '西',
          },
          cn: {
            0b000: '东',
            0b001: '东北',
            0b010: undefined,
            0b011: '西北',
            0b100: '东南',
            0b101: undefined,
            0b110: '西南',
            0b111: '西',
          },
          ko: {
            0b000: '동쪽(3시)',
            0b001: '북동쪽(1시)',
            0b010: undefined,
            0b011: '북서쪽(11시)',
            0b100: '남동쪽(5시)',
            0b101: undefined,
            0b110: '남서쪽(7시)',
            0b111: '서쪽(9시)',
          },
        }[data.lang][v];
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        '(?<! )Latent Defect': 'Latenter Bug',
        'Cascading Latent Defect': 'Latenter Bug: Unterlauf',
        'Left Arm Unit': 'link(?:e|er|es|en) Arm',
        'Omega(?!-)': 'Omega',
        'Omega-F': 'Omega-W',
        'Omega-M': 'Omega-M',
        'Optical Unit': 'Optikmodul',
        'Rear Power Unit': 'hinter(?:e|er|es|en) Antriebseinheit',
        'Right Arm Unit': 'rechter Arm',
      },
      'replaceText': {
        '(?<! )Archive All': 'Alles archivieren',
        '(?<! )Archive Peripheral': 'Archiv-Peripherie',
        '(?<! )Optical Laser': 'Optischer Laser F',
        '(?<! )Suppression': 'Hilfsprogramm F',
        '(?<! )Wave Cannon': 'Wellenkanone',
        'Advanced Optical Laser': 'Optischer Laser S',
        'Advanced Suppression': 'Hilfsprogramm S',
        'Beyond Defense': 'Schildkombo S',
        'Beyond Strength': 'Schildkombo G',
        'Cascading Latent Defect': 'Latenter Defekt: Zersetzung',
        'Colossal Blow': 'Kolossaler Hieb',
        'Cosmo Memory': 'Kosmospeicher',
        'Critical Error': 'Schwerer Ausnahmefehler',
        'Critical Overflow Bug': 'Kritischer Bug: Überlauf',
        'Critical Synchronization Bug': 'Kritischer Bug: Synchronisierung',
        'Critical Underflow Bug': 'Kritischer Bug: Unterlauf',
        'Delta Attack': 'Delta-Attacke',
        'Diffuse Wave Cannon': 'Streuende Wellenkanone',
        'Discharger': 'Entlader',
        'Efficient Bladework': 'Effiziente Klingenführung',
        'Electric Slide': 'Elektrosturz',
        'Firewall': 'Sicherungssystem',
        'Floodlight': 'Flutlicht',
        'Fundamental Synergy': 'Synergieprogramm C',
        'Hello, World': 'Hallo, Welt!',
        'Hyper Pulse': 'Hyper-Impuls',
        'Index and Archive Peripheral': 'Archiv-Peripherie X',
        'Ion Efflux': 'Ionenstrom',
        'Laser Shower': 'Laserschauer',
        'Operational Synergy': 'Synergieprogramm W',
        'Optimized Blade Dance': 'Omega-Schwertertanz',
        'Optimized Blizzard III': 'Omega-Eisga',
        'Optimized Fire III': 'Omega-Feuga',
        'Optimized Meteor': 'Omega-Meteor',
        'Optimized Sagittarius Arrow': 'Omega-Choral der Pfeile',
        'Oversampled Wave Cannon': 'Fokussierte Wellenkanone',
        'Patch': 'Regression',
        'Pile Pitch': 'Neigungsstoß',
        'Program Omega': 'Programm Omega',
        'Rear Lasers': 'Hintere Laser',
        'Resonance': 'Resonanz',
        'Savage Wave Cannon': 'Grausame Wellenkanone',
        'Solar Ray': 'Sonnenstrahl',
        'Spotlight': 'Scheinwerfer',
        'Subject Simulation F': 'Transformation W',
        'Subject Simulation M': 'Transformation M',
        'Superliminal Motion': 'Klingenkombo F',
        'Superliminal Steel': 'Klingenkombo B',
        'Synthetic Blades': 'Synthetische Klinge',
        'Synthetic Shield': 'Synthetischer Schild',
        'Target Analysis': 'Wellenkanone',
      },
      '~effectNames': {
        'Cascading Latent Defect': 'Latenter Defekt: Zersetzung',
        'Critical Overflow Bug': 'Kritischer Bug: Überlauf',
        'Critical Synchronization Bug': 'Kritischer Bug: Synchronisierung',
        'Critical Underflow Bug': 'Kritischer Bug: Unterlauf',
        'Infinite Limit': 'Grenzüberschreitung',
        'Latent Defect': 'Latenter Defekt',
        'Local Regression': 'Regression: Nah',
        'Local Resonance': 'Resonanzprogramm: Nah',
        'Magic Vulnerability Up': 'Erhöhte Magie-Verwundbarkeit',
        'Overflow Debugger': 'Bug-Korrektur: Überlauf',
        'Packet Filter F': 'Sicherungssystem W',
        'Packet Filter M': 'Sicherungssystem M',
        'Physical Vulnerability Up': 'Erhöhte physische Verwundbarkeit',
        'Prey': 'Beute',
        'Remote Regression': 'Regression: Fern',
        'Remote Resonance': 'Resonanzprogramm: Fern',
        'Synchronization Debugger': 'Bug-Korrektur: Synchronisierung',
        'Underflow Debugger': 'Bug-Korrektur: Unterlauf',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Left Arm Unit': 'unité bras gauche',
        'Omega(?!-)': 'Oméga',
        'Omega-F': 'Oméga-F',
        'Omega-M': 'Oméga-M',
        'Optical Unit': 'unité optique',
        'Rear Power Unit': 'unité arrière',
        'Right Arm Unit': 'unité bras droit',
      },
      'replaceText': {
        '(?<! )Archive All': 'Archivage intégral',
        '(?<! )Archive Peripheral': 'Périphérique d\'archivage',
        '(?<! )Optical Laser': 'Laser optique F',
        '(?<! )Suppression': 'Programme d\'assistance F',
        '(?<! )Wave Cannon': 'Canon plasma',
        'Advanced Optical Laser': 'Laser optique S',
        'Advanced Suppression': 'Programme d\'assistance S',
        'Beyond Defense': 'Combo bouclier S',
        'Beyond Strength': 'Combo bouclier G',
        'Cascading Latent Defect': 'Bogue latent : dégradation',
        'Colossal Blow': 'Coup colossal',
        'Cosmo Memory': 'Cosmomémoire',
        'Critical Error': 'Erreur critique',
        'Critical Overflow Bug': 'Bogue critique : boucle',
        'Critical Synchronization Bug': 'Bogue critique : partage',
        'Critical Underflow Bug': 'Bogue critique : dégradation',
        'Delta Attack': 'Attaque Delta',
        'Diffuse Wave Cannon': 'Canon plasma diffuseur',
        'Discharger': 'Déchargeur',
        'Efficient Bladework': 'Lame active',
        'Electric Slide': 'Glissement Oméga',
        'Firewall': 'Programme protecteur',
        'Floodlight': 'Projecteur',
        'Fundamental Synergy': 'Programme synergique C',
        'Hello, World': 'Bonjour, le monde',
        'Hyper Pulse': 'Hyperpulsion',
        'Index and Archive Peripheral': 'Périphérique d\'archivage X',
        'Ion Efflux': 'Fuite d\'ions',
        'Laser Shower': 'Pluie de lasers',
        'Operational Synergy': 'Programme synergique W',
        'Optimized Blade Dance': 'Danse de la lame Oméga',
        'Optimized Blizzard III': 'Méga Glace Oméga',
        'Optimized Fire III': 'Méga Feu Oméga',
        'Optimized Meteor': 'Météore Oméga',
        'Optimized Sagittarius Arrow': 'Flèche du sagittaire Oméga',
        'Oversampled Wave Cannon': 'Canon plasma chercheur',
        'Patch': 'Bogue intentionnel',
        'Pile Pitch': 'Lancement de pieu',
        'Program Omega': 'Programme Oméga',
        'Rear Lasers': 'Lasers arrière',
        'Resonance': 'Résonance',
        'Savage Wave Cannon': 'Canon plasma absolu',
        'Solar Ray': 'Rayon solaire',
        'Spotlight': 'Phare',
        'Subject Simulation F': 'Transformation F',
        'Subject Simulation M': 'Simulation de sujet M',
        'Superliminal Motion': 'Combo lame F',
        'Superliminal Steel': 'Combo lame B',
        'Synthetic Blades': 'Lame optionnelle',
        'Synthetic Shield': 'Bouclier optionnel',
        'Target Analysis': 'Analyse de cible',
      },
      '~effectNames': {
        'Cascading Latent Defect': 'Bogue latent : dégradation',
        'Critical Overflow Bug': 'Bogue critique : boucle',
        'Critical Synchronization Bug': 'Bogue critique : partage',
        'Critical Underflow Bug': 'Bogue critique : dégradation',
        'Infinite Limit': 'Dépassement de limites',
        'Latent Defect': 'Bogue latent',
        'Local Regression': 'Bogue intentionnel: proximité',
        'Local Resonance': 'Programme de résonance: proximité',
        'Magic Vulnerability Up': 'Vulnérabilité magique augmentée',
        'Overflow Debugger': 'Déboguage: boucle',
        'Packet Filter F': 'Programme protecteur F',
        'Packet Filter M': 'Programme protecteur M',
        'Physical Vulnerability Up': 'Vulnérabilité physique augmentée',
        'Prey': 'Proie',
        'Remote Regression': 'Bogue intentionnel: distance',
        'Remote Resonance': 'Programme de résonance: distance',
        'Synchronization Debugger': 'Déboguage: partage',
        'Underflow Debugger': 'Déboguage: dégradation',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Left Arm Unit': 'レフトアームユニット',
        'Omega(?!-)': 'オメガ',
        'Omega-F': 'オメガF',
        'Omega-M': 'オメガM',
        'Optical Unit': 'オプチカルユニット',
        'Rear Power Unit': 'リアユニット',
        'Right Arm Unit': 'ライトアームユニット',
      },
      'replaceText': {
        '(?<! )Archive All': 'アーカイブオール',
        '(?<! )Archive Peripheral': 'アーカイブアーム',
        '(?<! )Optical Laser': 'オプチカルレーザーF',
        '(?<! )Suppression': '援護プログラムF',
        '(?<! )Wave Cannon': '波動砲',
        'Advanced Optical Laser': 'オプチカルレーザーS',
        'Advanced Suppression': '援護プログラムS',
        'Beyond Defense': 'シールドコンボS',
        'Beyond Strength': 'シールドコンボG',
        'Cascading Latent Defect': 'レイテンドバグ：デグレード',
        'Colossal Blow': 'コロッサスブロー',
        'Cosmo Memory': 'コスモメモリー',
        'Critical Error': 'クリティカルエラー',
        'Critical Overflow Bug': 'クリティカルバグ：サークル',
        'Critical Synchronization Bug': 'クリティカルバグ：シェア',
        'Critical Underflow Bug': 'クリティカルバグ：デグレード',
        'Delta Attack': 'デルタアタック',
        'Diffuse Wave Cannon': '拡散波動砲',
        'Discharger': 'ディスチャージャー',
        'Efficient Bladework': 'ソードアクション',
        'Electric Slide': 'オメガスライド',
        'Firewall': 'ガードプログラム',
        'Floodlight': 'フラッドライト',
        'Fundamental Synergy': '連携プログラムC',
        'Hello, World': 'ハロー・ワールド',
        'Hyper Pulse': 'ハイパーパルス',
        'Index and Archive Peripheral': 'アーカイブアームX',
        'Ion Efflux': 'イオンエフラクス',
        'Laser Shower': 'レーザーシャワー',
        'Operational Synergy': '連携プログラムW',
        'Optimized Blade Dance': 'ブレードダンス・オメガ',
        'Optimized Blizzard III': 'ブリザガ・オメガ',
        'Optimized Fire III': 'ファイラ・オメガ',
        'Optimized Meteor': 'メテオ・オメガ',
        'Optimized Sagittarius Arrow': 'サジタリウスアロー・オメガ',
        'Oversampled Wave Cannon': '検知式波動砲',
        'Patch': 'エンバグ',
        'Pile Pitch': 'パイルピッチ',
        'Program Omega': 'プログラム・オメガ',
        'Rear Lasers': 'リアレーザー',
        'Resonance': 'レゾナンス',
        'Savage Wave Cannon': '零式波動砲',
        'Solar Ray': 'ソーラレイ',
        'Spotlight': 'スポットライト',
        'Subject Simulation F': 'トランスフォームF',
        'Subject Simulation M': 'トランスフォームM',
        'Superliminal Motion': 'ブレードコンボF',
        'Superliminal Steel': 'ブレードコンボB',
        'Synthetic Blades': 'ブレードオプション',
        'Synthetic Shield': 'シールドオプション',
        'Target Analysis': '標的識別',
      },
      '~effectNames': {
        'Cascading Latent Defect': 'レイテンドバグ：デグレード',
        'Critical Overflow Bug': 'クリティカルバグ：サークル',
        'Critical Synchronization Bug': 'クリティカルバグ：シェア',
        'Critical Underflow Bug': 'クリティカルバグ：デグレード',
        'Infinite Limit': '限界超越',
        'Latent Defect': 'レイテンドバグ',
        'Local Regression': 'エンバグ：ニアー',
        'Local Resonance': 'レゾナンスプログラム：ニアー',
        'Magic Vulnerability Up': '被魔法ダメージ増加',
        'Overflow Debugger': 'バグフィックス：サークル',
        'Packet Filter F': 'ガードプログラムF',
        'Packet Filter M': 'ガードプログラムM',
        'Physical Vulnerability Up': '被物理ダメージ増加',
        'Prey': 'プレイ',
        'Remote Regression': 'エンバグ：ファー',
        'Remote Resonance': 'レゾナンスプログラム：ファー',
        'Synchronization Debugger': 'バグフィックス：シェア',
        'Underflow Debugger': 'バグフィックス：デグレード',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Left Arm Unit': '左臂组',
        'Omega(?!-)': '欧米茄',
        'Omega-F': '欧米茄F',
        'Omega-M': '欧米茄M',
        'Optical Unit': '视觉组',
        'Rear Power Unit': '尾部组',
        'Right Arm Unit': '右臂组',
      },
      'replaceText': {
        '(?<! )Archive All': '全归档',
        '(?<! )Archive Peripheral': '手臂归档',
        '(?<! )Optical Laser': '光学射线F',
        '(?<! )Suppression': '援护程序F',
        '(?<! )Wave Cannon': '波动炮',
        'Advanced Optical Laser': '光学射线S',
        'Advanced Suppression': '援护程序S',
        'Beyond Defense': '盾连击S',
        'Beyond Strength': '盾连击G',
        'Cascading Latent Defect': '潜在错误：下溢',
        'Colossal Blow': '巨能爆散',
        'Cosmo Memory': '宇宙记忆',
        'Critical Error': '严重错误',
        'Critical Overflow Bug': '严重错误：上溢',
        'Critical Synchronization Bug': '严重错误：同步',
        'Critical Underflow Bug': '严重错误：下溢',
        'Delta Attack': '三角攻击',
        'Diffuse Wave Cannon': '扩散波动炮',
        'Discharger': '能量放出',
        'Efficient Bladework': '剑击',
        'Electric Slide': '欧米茄滑跃',
        'Firewall': '防御程序',
        'Floodlight': '泛光灯',
        'Fundamental Synergy': '协作程序C',
        'Hello, World': '你好，世界',
        'Hyper Pulse': '超能脉冲',
        'Index and Archive Peripheral': '手臂归档X',
        'Ion Efflux': '离子流出',
        'Laser Shower': '激光骤雨',
        'Operational Synergy': '协作程序W',
        'Optimized Blade Dance': '欧米茄刀光剑舞',
        'Optimized Blizzard III': '欧米茄冰封',
        'Optimized Fire III': '欧米茄烈炎',
        'Optimized Meteor': '欧米茄陨石流星',
        'Optimized Sagittarius Arrow': '欧米茄射手天箭',
        'Oversampled Wave Cannon': '探测式波动炮',
        'Patch': '补丁',
        'Pile Pitch': '能量投射',
        'Program Omega': '程序·欧米茄',
        'Rear Lasers': '背环激光',
        'Resonance': '共鸣',
        'Savage Wave Cannon': '零式波动炮',
        'Solar Ray': '太阳射线',
        'Spotlight': '聚光灯',
        'Subject Simulation F': '变形F',
        'Subject Simulation M': '变形M',
        'Superliminal Motion': '剑连击F',
        'Superliminal Steel': '剑连击B',
        'Synthetic Blades': '合成剑',
        'Synthetic Shield': '合成盾',
        'Target Analysis': '目标识别',
      },
      '~effectNames': {
        'Cascading Latent Defect': '潜在错误：下溢',
        'Critical Overflow Bug': '严重错误：上溢',
        'Critical Synchronization Bug': '严重错误：同步',
        'Critical Underflow Bug': '严重错误：下溢',
        'Infinite Limit': '超越界限',
        'Latent Defect': '潜在错误',
        'Local Regression': '回归方程：近',
        'Local Resonance': '共鸣程序：近',
        'Magic Vulnerability Up': '魔法受伤加重',
        'Overflow Debugger': '修复错误：上溢',
        'Packet Filter F': '防护程序F',
        'Packet Filter M': '防护程序M',
        'Physical Vulnerability Up': '物理受伤加重',
        'Prey': '猎物',
        'Remote Regression': '回归方程：远',
        'Remote Resonance': '共鸣程序：远',
        'Synchronization Debugger': '修复错误：同步',
        'Underflow Debugger': '修复错误：下溢',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Left Arm Unit': '왼팔 유닛',
        'Omega(?!-)': '오메가',
        'Omega-F': '오메가 F',
        'Omega-M': '오메가 M',
        'Optical Unit': '광학 유닛',
        'Rear Power Unit': '후면 유닛',
        'Right Arm Unit': '오른팔 유닛',
      },
      'replaceText': {
        '(?<! )Archive All': '전체 기록 보존',
        '(?<! )Archive Peripheral': '기록 보존 장치',
        '(?<! )Optical Laser': '광학 레이저 F',
        '(?<! )Suppression': '지원 프로그램 F',
        '(?<! )Wave Cannon': '파동포',
        'Advanced Optical Laser': '광학 레이저 S',
        'Advanced Suppression': '지원 프로그램 S',
        'Beyond Defense': '방패 연격 S',
        'Beyond Strength': '방패 연격 G',
        'Cascading Latent Defect': '잠재적 오류: 전이',
        'Colossal Blow': '광역 폭파',
        'Cosmo Memory': '세계의 기억',
        'Critical Error': '치명적인 오류',
        'Critical Overflow Bug': '치명적 오류: 광역',
        'Critical Synchronization Bug': '치명적 오류: 분배',
        'Critical Underflow Bug': '치명적 오류: 전이',
        'Delta Attack': '델타 공격',
        'Diffuse Wave Cannon': '확산 파동포',
        'Discharger': '방출',
        'Efficient Bladework': '검격',
        'Electric Slide': '오메가 슬라이드',
        'Firewall': '방어 프로그램',
        'Floodlight': '투광 조명',
        'Fundamental Synergy': '연계 프로그램 C',
        'Hello, World': '헬로 월드',
        'Hyper Pulse': '초파동 광선',
        'Index and Archive Peripheral': '기록 보존 장치 X',
        'Ion Efflux': '이온 유출',
        'Laser Shower': '레이저 세례',
        'Operational Synergy': '연계 프로그램 W',
        'Optimized Blade Dance': '쾌검난무: 오메가',
        'Optimized Blizzard III': '블리자가: 오메가',
        'Optimized Fire III': '파이라: 오메가',
        'Optimized Meteor': '메테오 : 오메가',
        'Optimized Sagittarius Arrow': '궁수자리 화살: 오메가',
        'Oversampled Wave Cannon': '감지식 파동포',
        'Patch': '연쇄 오류',
        'Pile Pitch': '에너지 투사',
        'Program Omega': '프로그램: 오메가',
        'Rear Lasers': '후면 레이저',
        'Resonance': '공명',
        'Savage Wave Cannon': '프로그램: 오메가',
        'Solar Ray': '태양 광선',
        'Spotlight': '집중 조명',
        'Subject Simulation F': '형태 변경 F',
        'Subject Simulation M': '형태 변경 M',
        'Superliminal Motion': '칼날 연격 F',
        'Superliminal Steel': '칼날 연격 B',
        'Synthetic Blades': '칼날 장착',
        'Synthetic Shield': '방패 장착',
        'Target Analysis': '표적 식별',
      },
      '~effectNames': {
        'Cascading Latent Defect': '잠재적 오류: 전이',
        'Critical Overflow Bug': '치명적 오류: 광역',
        'Critical Synchronization Bug': '치명적 오류: 분배',
        'Critical Underflow Bug': '치명적 오류: 전이',
        'Infinite Limit': '한계 초월',
        'Latent Defect': '잠재적 오류',
        'Local Regression': '연쇄 오류: 근거리',
        'Local Resonance': '공명 프로그램: 근거리',
        'Magic Vulnerability Up': '받는 마법 피해량 증가',
        'Overflow Debugger': '오류 수정: 광역',
        'Packet Filter F': '방어 프로그램 F',
        'Packet Filter M': '방어 프로그램 M',
        'Physical Vulnerability Up': '받는 물리 피해량 증가',
        'Prey': '표식',
        'Remote Regression': '연쇄 오류: 원거리',
        'Remote Resonance': '공명 프로그램: 원거리',
        'Synchronization Debugger': '오류 수정: 분배',
        'Underflow Debugger': '오류 수정: 전이',
      },
    },
  ],
}];
