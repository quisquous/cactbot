import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Regexes from '../../../../../resources/regexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';

export default {
  zoneId: ZoneId.TheFinalCoilOfBahamutTurn2,
  timelineFile: 't11.txt',
  triggers: [
    {
      id: 'T11 Secondary Head',
      netRegex: NetRegexes.ability({ source: 'Kaliya', id: 'B73' }),
      netRegexDe: NetRegexes.ability({ source: 'Kaliya', id: 'B73' }),
      netRegexFr: NetRegexes.ability({ source: 'Kaliya', id: 'B73' }),
      netRegexJa: NetRegexes.ability({ source: 'カーリア', id: 'B73' }),
      netRegexCn: NetRegexes.ability({ source: '卡利亚', id: 'B73' }),
      netRegexKo: NetRegexes.ability({ source: '칼리야', id: 'B73' }),
      alertText: (data, matches, output) => output.text({ player: data.ShortName(matches.target) }),
      outputStrings: {
        text: {
          en: 'Stun on ${player}',
          de: 'Stun auf ${player}',
          fr: 'Stun sur ${player}',
          ja: '${player}にスタン',
          cn: '击昏${player}',
          ko: '"${player}" 기절',
        },
      },
    },
    {
      id: 'T11 Seed River First',
      netRegex: NetRegexes.ability({ source: 'Kaliya', id: 'B74', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Kaliya', id: 'B74', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Kaliya', id: 'B74', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'カーリア', id: 'B74', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '卡利亚', id: 'B74', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '칼리야', id: 'B74', capture: false }),
      condition: (data) => !data.firstSeed,
      response: Responses.spreadThenStack(),
      run: (data) => {
        if (!data.firstSeed)
          data.firstSeed = 'river';
      },
    },
    {
      id: 'T11 Seed Sea First',
      netRegex: NetRegexes.ability({ id: 'B75', source: 'Kaliya', capture: false }),
      netRegexDe: NetRegexes.ability({ id: 'B75', source: 'Kaliya', capture: false }),
      netRegexFr: NetRegexes.ability({ id: 'B75', source: 'Kaliya', capture: false }),
      netRegexJa: NetRegexes.ability({ id: 'B75', source: 'カーリア', capture: false }),
      netRegexCn: NetRegexes.ability({ id: 'B75', source: '卡利亚', capture: false }),
      netRegexKo: NetRegexes.ability({ id: 'B75', source: '칼리야', capture: false }),
      condition: (data) => !data.firstSeed,
      response: Responses.stackThenSpread(),
      run: (data) => {
        if (!data.firstSeed)
          data.firstSeed = 'sea';
      },
    },
    {
      id: 'T11 Seed River Second',
      netRegex: NetRegexes.ability({ id: 'B76', source: 'Kaliya', capture: false }),
      netRegexDe: NetRegexes.ability({ id: 'B76', source: 'Kaliya', capture: false }),
      netRegexFr: NetRegexes.ability({ id: 'B76', source: 'Kaliya', capture: false }),
      netRegexJa: NetRegexes.ability({ id: 'B76', source: 'カーリア', capture: false }),
      netRegexCn: NetRegexes.ability({ id: 'B76', source: '卡利亚', capture: false }),
      netRegexKo: NetRegexes.ability({ id: 'B76', source: '칼리야', capture: false }),
      condition: (data) => !data.firstSeed,
      response: Responses.stackMarker(),
      run: (data) => delete data.firstSeed,
    },
    {
      id: 'T11 Seed Sea Second',
      netRegex: NetRegexes.ability({ id: 'B77', source: 'Kaliya', capture: false }),
      netRegexDe: NetRegexes.ability({ id: 'B77', source: 'Kaliya', capture: false }),
      netRegexFr: NetRegexes.ability({ id: 'B77', source: 'Kaliya', capture: false }),
      netRegexJa: NetRegexes.ability({ id: 'B77', source: 'カーリア', capture: false }),
      netRegexCn: NetRegexes.ability({ id: 'B77', source: '卡利亚', capture: false }),
      netRegexKo: NetRegexes.ability({ id: 'B77', source: '칼리야', capture: false }),
      condition: (data) => !data.firstSeed,
      response: Responses.spread(),
      run: (data) => delete data.firstSeed,
    },
    {
      id: 'T11 Phase 2',
      regex: Regexes.hasHP({ name: 'Kaliya', hp: '60', capture: false }),
      regexDe: Regexes.hasHP({ name: 'Kaliya', hp: '60', capture: false }),
      regexFr: Regexes.hasHP({ name: 'Kaliya', hp: '60', capture: false }),
      regexJa: Regexes.hasHP({ name: 'カーリア', hp: '60', capture: false }),
      regexCn: Regexes.hasHP({ name: '卡利亚', hp: '60', capture: false }),
      regexKo: Regexes.hasHP({ name: '칼리야', hp: '60', capture: false }),
      sound: 'Long',
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Out of Middle',
          de: 'Raus aus der Mitte',
          fr: 'Sortez du milieu',
          ja: '中央から離れる',
          cn: '离开中间',
          ko: '중앙에서 벗어나기',
        },
      },
    },
    {
      id: 'T11 Forked Lightning',
      netRegex: NetRegexes.ability({ id: 'B85', source: 'Electric Node' }),
      netRegexDe: NetRegexes.ability({ id: 'B85', source: 'Elektrisch(?:e|er|es|en) Modul' }),
      netRegexFr: NetRegexes.ability({ id: 'B85', source: 'Module D\'Électrochoc' }),
      netRegexJa: NetRegexes.ability({ id: 'B85', source: '雷撃システム' }),
      netRegexCn: NetRegexes.ability({ id: 'B85', source: '雷击系统' }),
      netRegexKo: NetRegexes.ability({ id: 'B85', source: '뇌격 시스템' }),
      condition: Conditions.targetIsYou(),
      alarmText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Lightning on YOU',
          de: 'Blitz auf DIR',
          fr: 'Éclair sur VOUS',
          ja: '自分にフォークライトニング',
          cn: '雷点名',
          ko: '갈래 번개 대상자',
        },
      },
    },
    {
      id: 'T11 Phase 3',
      netRegex: NetRegexes.ability({ id: 'B78', source: 'Kaliya', capture: false }),
      netRegexDe: NetRegexes.ability({ id: 'B78', source: 'Kaliya', capture: false }),
      netRegexFr: NetRegexes.ability({ id: 'B78', source: 'Kaliya', capture: false }),
      netRegexJa: NetRegexes.ability({ id: 'B78', source: 'カーリア', capture: false }),
      netRegexCn: NetRegexes.ability({ id: 'B78', source: '卡利亚', capture: false }),
      netRegexKo: NetRegexes.ability({ id: 'B78', source: '칼리야', capture: false }),
      sound: 'Long',
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Final Phase',
          de: 'Finale Phase',
          fr: 'Phase finale',
          ja: 'フェイス３',
          cn: 'P3',
          ko: '마지막 페이즈',
        },
      },
    },
    {
      id: 'T11 Tether Accumulate A',
      netRegex: NetRegexes.tether({ id: '001C', target: 'Kaliya' }),
      netRegexDe: NetRegexes.tether({ id: '001C', target: 'Kaliya' }),
      netRegexFr: NetRegexes.tether({ id: '001C', target: 'Kaliya' }),
      netRegexJa: NetRegexes.tether({ id: '001C', target: 'カーリア' }),
      netRegexCn: NetRegexes.tether({ id: '001C', target: '卡利亚' }),
      netRegexKo: NetRegexes.tether({ id: '001C', target: '칼리야' }),
      run: (data, matches) => {
        data.tetherA = data.tetherA || [];
        data.tetherA.push(matches.source);
      },
    },
    {
      id: 'T11 Tether Accumulate B',
      netRegex: NetRegexes.tether({ id: '001D', target: 'Kaliya' }),
      netRegexDe: NetRegexes.tether({ id: '001D', target: 'Kaliya' }),
      netRegexFr: NetRegexes.tether({ id: '001D', target: 'Kaliya' }),
      netRegexJa: NetRegexes.tether({ id: '001D', target: 'カーリア' }),
      netRegexCn: NetRegexes.tether({ id: '001D', target: '卡利亚' }),
      netRegexKo: NetRegexes.tether({ id: '001D', target: '칼리야' }),
      run: (data, matches) => {
        data.tetherB = data.tetherB || [];
        data.tetherB.push(matches.source);
      },
    },
    {
      id: 'T11 Tether A',
      netRegex: NetRegexes.tether({ id: '001C', target: 'Kaliya', capture: false }),
      netRegexDe: NetRegexes.tether({ id: '001C', target: 'Kaliya', capture: false }),
      netRegexFr: NetRegexes.tether({ id: '001C', target: 'Kaliya', capture: false }),
      netRegexJa: NetRegexes.tether({ id: '001C', target: 'カーリア', capture: false }),
      netRegexCn: NetRegexes.tether({ id: '001C', target: '卡利亚', capture: false }),
      netRegexKo: NetRegexes.tether({ id: '001C', target: '칼리야', capture: false }),
      condition: (data) => data.tetherA.length === 2,
      alarmText: (data, _matches, output) => {
        let partner = undefined;
        if (data.tetherA[0] === data.me)
          partner = data.tetherA[1];
        if (data.tetherA[1] === data.me)
          partner = data.tetherA[0];
        if (!partner)
          return;
        return output.text({ player: data.ShortName(partner) });
      },
      outputStrings: {
        text: {
          en: 'Red Tethers With ${player}',
          de: 'Rote Verbindung mit ${player}',
          fr: 'Liens rouges avec ${player}',
          ja: '${player}に赤い線',
          cn: '红线连${player}',
          ko: '"${player}"와 빨간 선',
        },
      },
    },
    {
      id: 'T11 Tether B',
      netRegex: NetRegexes.tether({ id: '001D', target: 'Kaliya', capture: false }),
      netRegexDe: NetRegexes.tether({ id: '001D', target: 'Kaliya', capture: false }),
      netRegexFr: NetRegexes.tether({ id: '001D', target: 'Kaliya', capture: false }),
      netRegexJa: NetRegexes.tether({ id: '001D', target: 'カーリア', capture: false }),
      netRegexCn: NetRegexes.tether({ id: '001D', target: '卡利亚', capture: false }),
      netRegexKo: NetRegexes.tether({ id: '001D', target: '칼리야', capture: false }),
      condition: (data) => data.tetherB.length === 2,
      alarmText: (data, _matches, output) => {
        let partner = undefined;
        if (data.tetherB[0] === data.me)
          partner = data.tetherB[1];
        if (data.tetherB[1] === data.me)
          partner = data.tetherB[0];
        if (!partner)
          return;
        return output.text({ player: data.ShortName(partner) });
      },
      outputStrings: {
        text: {
          en: 'Blue Tethers With ${player}',
          de: 'Blaue Verbindung mit ${player}',
          fr: 'Liens bleus avec ${player}',
          ja: '${player}に青い線',
          cn: '蓝线连${player}',
          ko: '"${player}"와 파랑 선',
        },
      },
    },
    {
      id: 'T11 Tether Cleanup',
      netRegex: NetRegexes.ability({ id: 'B7B', source: 'Kaliya', capture: false }),
      netRegexDe: NetRegexes.ability({ id: 'B7B', source: 'Kaliya', capture: false }),
      netRegexFr: NetRegexes.ability({ id: 'B7B', source: 'Kaliya', capture: false }),
      netRegexJa: NetRegexes.ability({ id: 'B7B', source: 'カーリア', capture: false }),
      netRegexCn: NetRegexes.ability({ id: 'B7B', source: '卡利亚', capture: false }),
      netRegexKo: NetRegexes.ability({ id: 'B7B', source: '칼리야', capture: false }),
      run: (data) => {
        delete data.tetherA;
        delete data.tetherB;
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Electric Node': 'elektrisch(?:e|er|es|en) Modul',
        'Kaliya': 'Kaliya',
        'The Core Override': 'Kern-Steuereinheit',
      },
      'replaceText': {
        'Barofield': 'Baro-Feld',
        'Emergency Mode': 'Notprogramm',
        'Main Head': 'Hauptkopf',
        'Nanospore Jet': 'Nanosporen-Strahl',
        'Nerve Cloud': 'Nervenwolke',
        'Nerve Gas': 'Nervengas',
        'Resonance': 'Resonanz',
        'Secondary Head': 'Nebenkopf',
        'Seed Of The Rivers/Sea': 'Samen der Flüsse/See',
        'Seed Of The Sea/Rivers': 'Samen der See/Flüsse',
        'Stun': 'Betäubung',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Electric Node': 'Module d\'électrochoc',
        'Kaliya': 'Kaliya',
        'The Core Override': 'l\'unité de contrôle du Cœur',
      },
      'replaceText': {
        'Barofield': 'Barotraumatisme',
        'Emergency Mode': 'Mode d\'urgence',
        'Main Head': 'Tête principale',
        'Nanospore Jet': 'Jet de magismoparticules',
        'Nerve Cloud': 'Nuage neurotoxique',
        'Nerve Gas': 'Gaz neurotoxique',
        'Resonance': 'Résonance',
        'Secondary Head': 'Tête secondaire',
        'Seed Of The Rivers/Sea': 'Germe de la rivière/mer',
        'Seed Of The Sea/Rivers': 'Germe de la mer/rivière',
        'Stun': 'Étourdissement',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Electric Node': '雷撃システム',
        'Kaliya': 'カーリア',
        'The Core Override': 'コア制御区画',
      },
      'replaceText': {
        'Barofield': 'バロフィールド',
        'Emergency Mode': 'イマージャンシーモード',
        'Main Head': 'メインヘッド',
        'Nanospore Jet': '魔科学粒子散布',
        'Nerve Cloud': 'ナーブクラウド',
        'Nerve Gas': 'ナーブガス',
        'Resonance': 'レゾナンス',
        'Secondary Head': 'サブヘッド',
        'Seed Of The Rivers/Sea': 'シード・オブ・リバー / シード・オブ・シー',
        'Seed Of The Sea/Rivers': 'シード・オブ・シー / シード・オブ・リバー',
        'Stun': 'スタン',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Electric Node': '雷击系统',
        'Kaliya': '卡利亚',
        'The Core Override': '核心控制区间',
      },
      'replaceText': {
        'Barofield': '气压领域',
        'Emergency Mode': '紧急模式',
        'Main Head': '主首',
        'Nanospore Jet': '魔科学粒子散布',
        'Nerve Cloud': '神经云',
        'Nerve Gas': '神经毒气',
        'Resonance': '共鸣',
        'Secondary Head': '侧首',
        'Seed Of The Rivers/Sea': '江河/海洋之种',
        'Seed Of The Sea/Rivers': '海洋/江河之种',
        'Stun': '眩晕',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Electric Node': '뇌격 시스템',
        'Kaliya': '칼리야',
        'The Core Override': '핵심 제어 구역',
      },
      'replaceText': {
        'Barofield': '압력 필드',
        'Emergency Mode': '비상 모드',
        'Main Head': '가운뎃머리',
        'Nanospore Jet': '마과학 입자 살포',
        'Nerve Cloud': '신경 구름',
        'Nerve Gas': '신경 가스',
        'Resonance': '공명',
        'Secondary Head': '옆 머리',
        'Seed Of The Rivers/Sea': '강/바다의 원천',
        'Seed Of The Sea/Rivers': '바다/강의 원천',
        'Stun': '기절',
      },
    },
  ],
};
