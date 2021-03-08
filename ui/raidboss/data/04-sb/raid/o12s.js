import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';

// O12S - Alphascape 4.0 Savage

export default {
  zoneId: ZoneId.AlphascapeV40Savage,
  timelineFile: 'o12s.txt',
  triggers: [
    {
      id: 'O12S Phase Init',
      netRegex: NetRegexes.startsUsing({ id: '3357', source: 'Omega', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3357', source: 'Omega', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3357', source: 'Oméga', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3357', source: 'オメガ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3357', source: '欧米茄', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3357', source: '오메가', capture: false }),
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
      netRegex: NetRegexes.ability({ id: '332C', source: 'Omega-M' }),
      netRegexDe: NetRegexes.ability({ id: '332C', source: 'Omega-M' }),
      netRegexFr: NetRegexes.ability({ id: '332C', source: 'Oméga-M' }),
      netRegexJa: NetRegexes.ability({ id: '332C', source: 'オメガM' }),
      netRegexCn: NetRegexes.ability({ id: '332C', source: '欧米茄M' }),
      netRegexKo: NetRegexes.ability({ id: '332C', source: '오메가 M' }),
      condition: Conditions.targetIsYou(),
      alarmText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Don\'t Stack!',
          de: 'Nicht stacken!',
          fr: 'Ne vous packez pas !',
          ja: 'スタックするな！',
          cn: '分散站位！',
          ko: '쉐어 맞지 말것',
        },
      },
    },
    {
      id: 'O12S Local Resonance',
      netRegex: NetRegexes.gainsEffect({ target: 'Omega', effectId: '67E', capture: false }),
      netRegexDe: NetRegexes.gainsEffect({ target: 'Omega', effectId: '67E', capture: false }),
      netRegexFr: NetRegexes.gainsEffect({ target: 'Oméga', effectId: '67E', capture: false }),
      netRegexJa: NetRegexes.gainsEffect({ target: 'オメガ', effectId: '67E', capture: false }),
      netRegexCn: NetRegexes.gainsEffect({ target: '欧米茄', effectId: '67E', capture: false }),
      netRegexKo: NetRegexes.gainsEffect({ target: '오메가', effectId: '67E', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Keep Bosses Apart',
          de: 'Bosse auseinander ziehen',
          fr: 'Séparez les boss',
          ja: 'ボスを離して',
          cn: '拉开Boss',
          ko: '보스 떨어뜨리기',
        },
      },
    },
    {
      id: 'O12S Remote Resonance',
      netRegex: NetRegexes.gainsEffect({ target: 'Omega', effectId: '67F', capture: false }),
      netRegexDe: NetRegexes.gainsEffect({ target: 'Omega', effectId: '67F', capture: false }),
      netRegexFr: NetRegexes.gainsEffect({ target: 'Oméga', effectId: '67F', capture: false }),
      netRegexJa: NetRegexes.gainsEffect({ target: 'オメガ', effectId: '67F', capture: false }),
      netRegexCn: NetRegexes.gainsEffect({ target: '欧米茄', effectId: '67F', capture: false }),
      netRegexKo: NetRegexes.gainsEffect({ target: '오메가', effectId: '67F', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Move Bosses Together',
          de: 'Bosse zusammenziehen',
          fr: 'Packez les boss',
          ja: 'ボスを重ねて',
          cn: '拉近Boss',
          ko: '보스 붙이기',
        },
      },
    },
    {
      id: 'O12S Solar Ray',
      netRegex: NetRegexes.startsUsing({ id: ['3350', '3351'], source: ['Omega', 'Omega-M'] }),
      netRegexDe: NetRegexes.startsUsing({ id: ['3350', '3351'], source: ['Omega', 'Omega-M'] }),
      netRegexFr: NetRegexes.startsUsing({ id: ['3350', '3351'], source: ['Oméga', 'Oméga-M'] }),
      netRegexJa: NetRegexes.startsUsing({ id: ['3350', '3351'], source: ['オメガ', 'オメガM'] }),
      netRegexCn: NetRegexes.startsUsing({ id: ['3350', '3351'], source: ['欧米茄', '欧米茄M'] }),
      netRegexKo: NetRegexes.startsUsing({ id: ['3350', '3351'], source: ['오메가', '오메가 M'] }),
      condition: function(data, matches) {
        return data.me === matches.target || data.role === 'healer';
      },
      suppressSeconds: 1,
      response: Responses.tankBuster(),
    },
    {
      id: 'O12S Optimized Blade Dance',
      netRegex: NetRegexes.startsUsing({ id: ['334B', '334C'], source: ['Omega', 'Omega-M'] }),
      netRegexDe: NetRegexes.startsUsing({ id: ['334B', '334C'], source: ['Omega', 'Omega-M'] }),
      netRegexFr: NetRegexes.startsUsing({ id: ['334B', '334C'], source: ['Oméga', 'Oméga-M'] }),
      netRegexJa: NetRegexes.startsUsing({ id: ['334B', '334C'], source: ['オメガ', 'オメガM'] }),
      netRegexCn: NetRegexes.startsUsing({ id: ['334B', '334C'], source: ['欧米茄', '欧米茄M'] }),
      netRegexKo: NetRegexes.startsUsing({ id: ['334B', '334C'], source: ['오메가', '오메가 M'] }),
      condition: function(data, matches) {
        return data.me === matches.target || data.role === 'healer';
      },
      suppressSeconds: 1,
      response: Responses.tankBuster(),
    },
    {
      id: 'O12S Electric Slide Marker',
      netRegex: NetRegexes.headMarker({ id: '009[12345678]' }),
      condition: Conditions.targetIsYou(),
      alertText: function(data, matches, output) {
        let num = parseInt(matches.id);
        const isTriangle = num >= 95;
        num -= 90;
        if (isTriangle)
          num -= 4;

        return isTriangle ? output.triangle({ num: num }) : output.square({ num: num });
      },
      outputStrings: {
        square: {
          en: '#${num} Square',
          de: '#${num} Viereck',
          fr: '#${num} Carré',
          ja: '#${num} 四角',
          cn: '#${num} 四角',
          ko: '#${num} 짝수',
        },
        triangle: {
          en: '#${num} Triangle',
          de: '#${num} Dreieck',
          fr: '#${num} Triangle',
          ja: '#${num} 三角',
          cn: '#${num} 三角',
          ko: '#${num} 홀수',
        },
      },
    },
    {
      id: 'O12S MF Stack Marker',
      netRegex: NetRegexes.headMarker({ id: '003E', capture: false }),
      condition: function(data) {
        return !data.isFinalOmega;
      },
      suppressSeconds: 1,
      response: Responses.stackMarker('info'),
    },
    {
      id: 'O12S Optimized Meteor',
      netRegex: NetRegexes.headMarker({ id: '0057' }),
      condition: Conditions.targetIsYou(),
      response: Responses.meteorOnYou('info'),
    },
    {
      id: 'O12S Packet Filter F',
      netRegex: NetRegexes.gainsEffect({ effectId: '67D' }),
      condition: Conditions.targetIsYou(),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Attack Omega-M',
          de: 'Omega-M angreifen',
          fr: 'Attaquez Oméga-M',
          ja: 'Mを攻撃',
          cn: '攻击欧米茄-M',
          ko: '오메가 M 공격',
        },
      },
    },
    {
      id: 'O12S Packet Filter M',
      netRegex: NetRegexes.gainsEffect({ effectId: '67C' }),
      condition: Conditions.targetIsYou(),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Attack Omega-F',
          de: 'Omega-W angreifen',
          fr: 'Attaquez Oméga-F',
          ja: 'Fを攻撃',
          cn: '攻击欧米茄-F',
          ko: '오메가 F 공격',
        },
      },
    },
    {
      id: 'O12S Diffuse Wave Cannon Sides',
      netRegex: NetRegexes.startsUsing({ id: '3367', source: 'Omega', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3367', source: 'Omega', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3367', source: 'Oméga', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3367', source: 'オメガ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3367', source: '欧米茄', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3367', source: '오메가', capture: false }),
      response: Responses.goSides('info'),
    },
    {
      id: 'O12S Diffuse Wave Cannon Front/Back',
      netRegex: NetRegexes.startsUsing({ id: '3368', source: 'Omega', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3368', source: 'Omega', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3368', source: 'Oméga', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3368', source: 'オメガ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3368', source: '欧米茄', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3368', source: '오메가', capture: false }),
      response: Responses.goFrontBack('info'),
    },
    {
      id: 'O12S Oversampled Wave Cannon Right',
      netRegex: NetRegexes.startsUsing({ id: '3364', source: 'Omega', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3364', source: 'Omega', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3364', source: 'Oméga', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3364', source: 'オメガ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3364', source: '欧米茄', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3364', source: '오메가', capture: false }),
      infoText: function(data, _, output) {
        if (data.role === 'tank')
          return output.monitorsLeft();

        return output.dodgeLeft();
      },
      outputStrings: {
        monitorsLeft: {
          en: 'Monitors Left',
          de: 'Monitore Links',
          fr: 'Moniteur Gauche',
          ja: '波動砲 (左)',
          cn: '探测左边',
          ko: '모니터 왼쪽',
        },
        dodgeLeft: {
          en: 'Dodge Left',
          de: 'Links ausweichen',
          fr: 'Evitez à gauche',
          ja: '左側に離れる',
          cn: '左侧躲闪',
          ko: '오른쪽으로',
        },
      },
    },
    {
      id: 'O12S Oversampled Wave Cannon Left',
      netRegex: NetRegexes.startsUsing({ id: '3365', source: 'Omega', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3365', source: 'Omega', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3365', source: 'Oméga', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3365', source: 'オメガ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3365', source: '欧米茄', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3365', source: '오메가', capture: false }),
      infoText: function(data, _, output) {
        if (data.role === 'tank')
          return output.monitorsRight();

        return output.dodgeRight();
      },
      outputStrings: {
        monitorsRight: {
          en: 'Monitors Right',
          de: 'Monitore Rechts',
          fr: 'Moniteur Droite',
          ja: '波動砲 (右)',
          cn: '探测右边',
          ko: '모니터 오른쪽',
        },
        dodgeRight: {
          en: 'Dodge Right',
          de: 'Rechts ausweichen',
          fr: 'Evitez à droite',
          ja: '右側に離れる',
          cn: '右侧躲闪',
          ko: '왼쪽으로',
        },
      },
    },
    {
      id: 'O12S Target Analysis Target',
      netRegex: NetRegexes.headMarker({ id: '000E' }),
      alarmText: function(data, matches, output) {
        if (data.me === matches.target)
          return output.vulnOnYou();
      },
      infoText: function(data, matches, output) {
        if (data.me === matches.target || data.role !== 'tank')
          return;
        return output.vulnOn({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        vulnOn: {
          en: 'Vuln on ${player}',
          de: 'Verwundbarkeit auf ${player}',
          fr: 'Vulnérabilité sur ${player}',
          ja: '${player}に標的',
          cn: '目标识别 点${player}',
          ko: '"${player}" 표적식별',
        },
        vulnOnYou: {
          en: 'Vuln on YOU',
          de: 'Verwundbarkeit auf DIR',
          fr: 'Vulnérabilité sur VOUS',
          ja: '自分に標的',
          cn: '目标识别',
          ko: '표적식별 대상자',
        },
      },
    },
    {
      // Local Regression
      id: 'O12S Local Tethers',
      netRegex: NetRegexes.gainsEffect({ effectId: '688' }),
      condition: Conditions.targetIsYou(),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Close Tethers',
          de: 'Nahe Verbindungen',
          fr: 'Liens proches',
          ja: 'ニアー',
          cn: '靠近连线',
          ko: '가까이 붙는 줄',
        },
      },
    },
    {
      // Remote Regression
      id: 'O12S Far Tethers',
      netRegex: NetRegexes.gainsEffect({ effectId: '689' }),
      condition: Conditions.targetIsYou(),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Far Tethers',
          de: 'Entfernte Verbindungen',
          fr: 'Liens éloignés',
          ja: 'ファー',
          cn: '远离连线',
          ko: '멀리 떨어지는 줄',
        },
      },
    },
    {
      // Critical Overflow Bug
      id: 'O12S Defamation',
      netRegex: NetRegexes.gainsEffect({ effectId: '681' }),
      condition: Conditions.targetIsYou(),
      alarmText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Defamation on YOU',
          de: 'Urteil auf DIR',
          fr: '#Médisance sur VOUS',
          ja: 'サークルついた',
          cn: '严重错误：上溢',
          ko: '치명적오류:광역 8초',
        },
      },
    },
    {
      id: 'O12S Latent Defect',
      netRegex: NetRegexes.gainsEffect({ effectId: '686' }),
      condition: Conditions.targetIsYou(),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Blue Marker',
          de: 'Blauer Marker',
          fr: 'Marqueur bleu',
          ja: 'レイテントついた',
          cn: '蓝点名',
          ko: '잠재적오류 10초',
        },
      },
    },
    {
      // Critical Underflow Bug
      id: 'O12S Rot',
      netRegex: NetRegexes.gainsEffect({ effectId: '682' }),
      condition: Conditions.targetIsYou(),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Rot',
          de: 'Fäulnis',
          fr: 'Pourriture',
          ja: 'デグレードついた',
          cn: '红点名',
          ko: '치명적오류:전이 14초',
        },
      },
    },
    {
      // Critical Synchronization Bug
      id: 'O12S Hello World Stack',
      netRegex: NetRegexes.gainsEffect({ effectId: '680' }),
      delaySeconds: function(data, matches) {
        return matches.target === data.me ? 0 : 1;
      },
      alertText: function(data, matches, output) {
        const t = parseFloat(matches.duration);
        if (data.me !== matches.target)
          return;
        if (!(t > 0))
          return;
        if (t <= 8)
          return output.shortStackOnYou();

        return output.longStackOnYou();
      },
      infoText: function(data, matches, output) {
        const t = parseFloat(matches.duration);
        if (data.me === matches.target)
          return;
        if (!data.dpsShortStack)
          return;
        if (!(t > 0))
          return;
        if (t <= 8) {
          data.dpsShortStack = false;
          return output.shortStackOn({ player: data.ShortName(matches.target) });
        }
        return;
      },
      outputStrings: {
        shortStackOn: {
          en: 'Short Stack on ${player}',
          de: 'Kurzer Stack auf ${player}',
          fr: 'Marque courte sur ${player}',
          ja: '${player}に早シェア',
          cn: '短D 点${player}',
          ko: '"${player}" 쉐어',
        },
        shortStackOnYou: {
          en: 'Short Stack on YOU',
          de: 'Kurzer Stack auf YOU',
          fr: 'Marque courte sur VOUS',
          ja: '自分に早シェア',
          cn: '短D',
          ko: '8초 치명적오류:분배(쉐어)',
        },
        longStackOnYou: {
          en: 'Long Stack on YOU',
          de: 'Langer Stack auf YOU',
          fr: 'Marque longue sur VOUS',
          ja: '自分に遅シェア',
          cn: '长D',
          ko: '13초 치명적오류:분배(쉐어)',
        },
      },
    },
    {
      id: 'O12S Hello World No Marker',
      // Track Critical Synchronization Bug / Critical Overflow Bug / Latent Defect
      netRegex: NetRegexes.gainsEffect({ effectId: ['680', '681', '686'] }),
      preRun: function(data, matches) {
        data.helloDebuffs[matches.target] = true;
      },
      alertText: function(data, _, output) {
        // 1 Defamation (T), 3 Blue Markers (T/H/D), 2 Stack Markers (D/D) = 6
        // Ignore rot here to be consistent.
        if (Object.keys(data.helloDebuffs).length !== 6)
          return;
        if (data.me in data.helloDebuffs)
          return;
        data.helloDebuffs[data.me] = true;
        return output.text();
      },
      outputStrings: {
        text: {
          en: 'No Marker',
          de: 'Kein Marker',
          fr: 'Aucun marqueur',
          ja: '無職',
          cn: '无BUFF',
          ko: '무징 대상자',
        },
      },
    },
    {
      // Cascading Latent Defect
      id: 'O12S Hello World Tower Complete',
      netRegex: NetRegexes.gainsEffect({ effectId: '687' }),
      condition: Conditions.targetIsYou(),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Move out for Defamation',
          de: 'Rausgehen für Urteil',
          fr: 'Ecartez-vous pour #médisance',
          ja: 'サークルを捨てる',
          cn: '离开人群传毒',
          ko: '잠재적 오류: 전이',
        },
      },
    },
    {
      id: 'O12S Archive All Marker Tracking',
      netRegex: NetRegexes.headMarker({ id: ['003E', '0060'] }),
      condition: function(data) {
        return data.isFinalOmega;
      },
      run: function(data, matches) {
        data.archiveMarkers[matches.target] = matches.id;
      },
    },
    {
      id: 'O12S Archive All No Marker',
      netRegex: NetRegexes.headMarker({ id: ['003E', '0060'], capture: false }),
      condition: function(data) {
        // 4 fire markers, 1 stack marker.
        return data.isFinalOmega && Object.keys(data.archiveMarkers).length === 5;
      },
      infoText: function(data, _, output) {
        if (data.me in data.archiveMarkers)
          return;
        for (const player in data.archiveMarkers) {
          if (data.archiveMarkers[player] !== '003E')
            continue;
          return output.text({ player: data.ShortName(player) });
        }
      },
      outputStrings: {
        text: {
          en: 'Stack on ${player}',
          de: 'Stacken auf ${player}',
          fr: 'Packez-vous sur ${player}',
          ja: '${player}とスタック',
          cn: '与${player}集合',
          ko: '"${player}" 쉐어',
        },
      },
    },
    {
      id: 'O12S Archive All Stack Marker',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      condition: function(data, matches) {
        return data.isFinalOmega && matches.target === data.me;
      },
      response: Responses.stackMarkerOn('info'),
    },
    {
      id: 'O12S Archive All Spread Marker',
      netRegex: NetRegexes.headMarker({ id: '0060' }),
      condition: function(data, matches) {
        return data.isFinalOmega && matches.target === data.me;
      },
      response: Responses.spread(),
    },
    {
      id: 'O12S Archive All Blue Arrow',
      netRegex: NetRegexes.headMarker({ target: 'Rear Power Unit', id: '009D', capture: false }),
      netRegexDe: NetRegexes.headMarker({ target: 'hinter(?:e|er|es|en) Antriebseinheit', id: '009D', capture: false }),
      netRegexFr: NetRegexes.headMarker({ target: 'unité arrière', id: '009D', capture: false }),
      netRegexJa: NetRegexes.headMarker({ target: 'リアユニット', id: '009D', capture: false }),
      netRegexCn: NetRegexes.headMarker({ target: '尾部组', id: '009D', capture: false }),
      netRegexKo: NetRegexes.headMarker({ target: '후면 유닛', id: '009D', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Back Left',
          de: 'Hinten Links',
          fr: 'Arrière gauche',
          ja: '左後ろ',
          cn: '左后',
          ko: '좌측 후방',
        },
      },
    },
    {
      id: 'O12S Archive All Red Arrow',
      netRegex: NetRegexes.headMarker({ target: 'Rear Power Unit', id: '009C', capture: false }),
      netRegexDe: NetRegexes.headMarker({ target: 'hinter(?:e|er|es|en) Antriebseinheit', id: '009C', capture: false }),
      netRegexFr: NetRegexes.headMarker({ target: 'unité arrière', id: '009C', capture: false }),
      netRegexJa: NetRegexes.headMarker({ target: 'リアユニット', id: '009C', capture: false }),
      netRegexCn: NetRegexes.headMarker({ target: '尾部组', id: '009C', capture: false }),
      netRegexKo: NetRegexes.headMarker({ target: '후면 유닛', id: '009C', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Back Right',
          de: 'Hinten Rechts',
          fr: 'Arrière droite',
          ja: '右後ろ',
          cn: '右后',
          ko: '우측 후방',
        },
      },
    },
    {
      id: 'O12S Archive  Peripheral Tracking',
      netRegex: NetRegexes.headMarker({ target: 'Right Arm Unit', id: ['009C', '009D'] }),
      netRegexDe: NetRegexes.headMarker({ target: 'Rechter Arm', id: ['009C', '009D'] }),
      netRegexFr: NetRegexes.headMarker({ target: 'Unité Bras Droit', id: ['009C', '009D'] }),
      netRegexJa: NetRegexes.headMarker({ target: 'ライトアームユニット', id: ['009C', '009D'] }),
      netRegexCn: NetRegexes.headMarker({ target: '右臂组', id: ['009C', '009D'] }),
      netRegexKo: NetRegexes.headMarker({ target: '오른팔 유닛', id: ['009C', '009D'] }),
      run: function(data, matches) {
        // Create a 3 digit binary value, R = 0, B = 1.
        // e.g. BBR = 110 = 6
        data.armValue *= 2;
        if (matches.id === '009D')
          data.armValue += 1;
        data.numArms++;
      },
    },
    {
      id: 'O12S Archive Peripheral',
      netRegex: NetRegexes.headMarker({ target: 'Right Arm Unit', id: ['009C', '009D'], capture: false }),
      netRegexDe: NetRegexes.headMarker({ target: 'Rechter Arm', id: ['009C', '009D'], capture: false }),
      netRegexFr: NetRegexes.headMarker({ target: 'Unité Bras Droit', id: ['009C', '009D'], capture: false }),
      netRegexJa: NetRegexes.headMarker({ target: 'ライトアームユニット', id: ['009C', '009D'], capture: false }),
      netRegexCn: NetRegexes.headMarker({ target: '右臂组', id: ['009C', '009D'], capture: false }),
      netRegexKo: NetRegexes.headMarker({ target: '오른팔 유닛', id: ['009C', '009D'], capture: false }),
      condition: function(data) {
        return data.numArms === 3;
      },
      alertText: function(data, _, output) {
        const v = parseInt(data.armValue);
        if (!(v >= 0) || v > 7)
          return;
        return {
          0b000: output.east(),
          0b001: output.northeast(),
          0b010: undefined,
          0b011: output.northwest(),
          0b100: output.southeast(),
          0b101: undefined,
          0b110: output.southwest(),
          0b111: output.west(),
        }[v];
      },
      outputStrings: {
        east: Outputs.east,
        northeast: Outputs.northeast,
        northwest: Outputs.northwest,
        southeast: Outputs.southeast,
        southwest: Outputs.southwest,
        west: Outputs.west,
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Left Arm Unit': 'link(?:e|er|es|en) Arm',
        'Omega(?!-)': 'Omega',
        'Omega-F': 'Omega-W',
        'Omega-M': 'Omega-M',
        'Optical Unit': 'Optikmodul',
        'Rear Power Unit': 'hinter(?:e|er|es|en) Antriebseinheit',
        'Right Arm Unit': 'rechter Arm',
      },
      'replaceText': {
        'Advanced Optical Laser': 'Optischer Laser S',
        'Advanced Suppression': 'Hilfsprogramm S',
        '(?<! )Archive All': 'Alles archivieren',
        '(?<! )Archive Peripheral': 'Archiv-Peripherie',
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
        '(?<! )Optical Laser': 'Optischer Laser F',
        'Optimized Blade Dance': 'Omega-Schwertertanz',
        'Optimized Blizzard III': 'Omega-Eisga',
        'Optimized Fire III': 'Omega-Feuga',
        'Optimized Meteor': 'Omega-Meteor',
        'Optimized Sagittarius Arrow': 'Omega-Choral der Pfeile',
        'Oversampled Wave Cannon': 'Fokussierte Wellenkanone',
        'Patch': 'Regression',
        'Pile Pitch': 'Neigungsstoß',
        'Program Omega': 'Programm Omega',
        'Resonance': 'Resonanz',
        'Savage Wave Cannon': 'Grausame Wellenkanone',
        'Solar Ray': 'Sonnenstrahl',
        'Spotlight': 'Scheinwerfer',
        'Subject Simulation F': 'Transformation W',
        'Subject Simulation M': 'Transformation M',
        'Superliminal Motion': 'Klingenkombo F',
        'Superliminal Steel': 'Klingenkombo B',
        '(?<! )Suppression': 'Hilfsprogramm F',
        'Synthetic Blades': 'Synthetische Klinge',
        'Synthetic Shield': 'Synthetischer Schild',
        'Target Analysis': 'Wellenkanone',
        '(?<! )Wave Cannon': 'Wellenkanone',
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
        'Advanced Optical Laser': 'Laser optique S',
        'Advanced Suppression': 'Programme d\'assistance S',
        '(?<! )Archive All': 'Archivage intégral',
        '(?<! )Archive Peripheral': 'Périphérique d\'archivage',
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
        '(?<! )Optical Laser': 'Laser optique F',
        'Optimized Blade Dance': 'Danse de la lame Oméga',
        'Optimized Blizzard III': 'Méga Glace Oméga',
        'Optimized Fire III': 'Méga Feu Oméga',
        'Optimized Meteor': 'Météore Oméga',
        'Optimized Sagittarius Arrow': 'Flèche du sagittaire Oméga',
        'Oversampled Wave Cannon': 'Canon plasma chercheur',
        'Patch': 'Bogue intentionnel',
        'Pile Pitch': 'Lancement de pieu',
        'Program Omega': 'Programme Oméga',
        'Resonance': 'Résonance',
        'Savage Wave Cannon': 'Canon plasma absolu',
        'Solar Ray': 'Rayon solaire',
        'Spotlight': 'Phare',
        'Subject Simulation F': 'Transformation F',
        'Subject Simulation M': 'Simulation de sujet M',
        'Superliminal Motion': 'Combo lame F',
        'Superliminal Steel': 'Combo lame B',
        '(?<! )Suppression': 'Programme d\'assistance F',
        'Synthetic Blades': 'Lame optionnelle',
        'Synthetic Shield': 'Bouclier optionnel',
        'Target Analysis': 'Analyse de cible',
        '(?<! )Wave Cannon': 'Canon plasma',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Left Arm Unit': 'レフトアームユニット',
        '(?<! )Omega(?!-)': 'オメガ',
        'Omega-F': 'オメガF',
        'Omega-M': 'オメガM',
        'Optical Unit': 'オプチカルユニット',
        'Rear Power Unit': 'リアユニット',
        'Right Arm Unit': 'ライトアームユニット',
        'I am the Omega': 'ワタシはオメガであり',
      },
      'replaceText': {
        'Advanced Optical Laser': 'オプチカルレーザーS',
        'Advanced Suppression': '援護プログラムS',
        '(?<! )Archive All': 'アーカイブオール',
        '(?<! )Archive Peripheral': 'アーカイブアーム',
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
        '(?<! )Optical Laser': 'オプチカルレーザーF',
        'Optimized Blade Dance': 'ブレードダンス・オメガ',
        'Optimized Blizzard III': 'ブリザガ・オメガ',
        'Optimized Fire III': 'ファイラ・オメガ',
        'Optimized Meteor': 'メテオ・オメガ',
        'Optimized Sagittarius Arrow': 'サジタリウスアロー・オメガ',
        'Oversampled Wave Cannon': '検知式波動砲',
        'Patch': 'エンバグ',
        'Pile Pitch': 'パイルピッチ',
        'Program Omega': 'プログラム・オメガ',
        'Resonance': 'レゾナンス',
        'Savage Wave Cannon': '零式波動砲',
        'Solar Ray': 'ソーラレイ',
        'Spotlight': 'スポットライト',
        'Subject Simulation F': 'トランスフォームF',
        'Subject Simulation M': 'トランスフォームM',
        'Superliminal Motion': 'ブレードコンボF',
        'Superliminal Steel': 'ブレードコンボB',
        '(?<! )Suppression': '援護プログラムF',
        'Synthetic Blades': 'ブレードオプション',
        'Synthetic Shield': 'シールドオプション',
        'Target Analysis': '標的識別',
        '(?<! )Wave Cannon': '波動砲',
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
        'Advanced Optical Laser': '光学射线S',
        'Advanced Suppression': '援护程序S',
        '(?<! )Archive All': '全归档',
        '(?<! )Archive Peripheral': '手臂归档',
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
        '(?<! )Optical Laser': '光学射线F',
        'Optimized Blade Dance': '欧米茄刀光剑舞',
        'Optimized Blizzard III': '欧米茄冰封',
        'Optimized Fire III': '欧米茄烈炎',
        'Optimized Meteor': '欧米茄陨石流星',
        'Optimized Sagittarius Arrow': '欧米茄射手天箭',
        'Oversampled Wave Cannon': '探测式波动炮',
        'Patch': '补丁',
        'Pile Pitch': '能量投射',
        'Program Omega': '程序·欧米茄',
        'Resonance': '共鸣',
        'Savage Wave Cannon': '零式波动炮',
        'Solar Ray': '太阳射线',
        'Spotlight': '聚光灯',
        'Subject Simulation F': '变形F',
        'Subject Simulation M': '变形M',
        'Superliminal Motion': '剑连击F',
        'Superliminal Steel': '剑连击B',
        '(?<! )Suppression': '援护程序F',
        'Synthetic Blades': '合成剑',
        'Synthetic Shield': '合成盾',
        'Target Analysis': '目标识别',
        '(?<! )Wave Cannon': '波动炮',
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
        'Advanced Optical Laser': '광학 레이저 S',
        'Advanced Suppression': '지원 프로그램 S',
        '(?<! )Archive All': '전체 기록 보존',
        '(?<! )Archive Peripheral': '기록 보존 장치',
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
        '(?<! )Optical Laser': '광학 레이저 F',
        'Optimized Blade Dance': '쾌검난무: 오메가',
        'Optimized Blizzard III': '블리자가: 오메가',
        'Optimized Fire III': '파이라: 오메가',
        'Optimized Meteor': '메테오 : 오메가',
        'Optimized Sagittarius Arrow': '궁수자리 화살: 오메가',
        'Oversampled Wave Cannon': '감지식 파동포',
        'Patch': '연쇄 오류',
        'Pile Pitch': '에너지 투사',
        'Program Omega': '프로그램: 오메가',
        'Resonance': '공명',
        'Savage Wave Cannon': '프로그램: 오메가',
        'Solar Ray': '태양 광선',
        'Spotlight': '집중 조명',
        'Subject Simulation F': '형태 변경 F',
        'Subject Simulation M': '형태 변경 M',
        'Superliminal Motion': '칼날 연격 F',
        'Superliminal Steel': '칼날 연격 B',
        '(?<! )Suppression': '지원 프로그램 F',
        'Synthetic Blades': '칼날 장착',
        'Synthetic Shield': '방패 장착',
        'Target Analysis': '표적 식별',
        '(?<! )Wave Cannon': '파동포',
      },
    },
  ],
};
