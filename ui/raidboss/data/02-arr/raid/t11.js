'use strict';

[{
  zoneRegex: {
    en: /^The Final Coil Of Bahamut - Turn \(2\)$/,
    cn: /^巴哈姆特大迷宫 \(真源之章2\)$/,
  },
  timelineFile: 't11.txt',
  triggers: [
    {
      id: 'T11 Secondary Head',
      regex: Regexes.ability({ source: 'Kaliya', id: 'B73' }),
      regexDe: Regexes.ability({ source: 'Kaliya', id: 'B73' }),
      regexFr: Regexes.ability({ source: 'Kaliya', id: 'B73' }),
      regexJa: Regexes.ability({ source: 'カーリア', id: 'B73' }),
      regexCn: Regexes.ability({ source: '卡利亚', id: 'B73' }),
      regexKo: Regexes.ability({ source: '칼리야', id: 'B73' }),
      alertText: function(data, matches) {
        return {
          en: 'Stun on ' + data.ShortName(matches.target),
          de: 'Stun auf ' + data.ShortName(matches.target),
          fr: 'Stun sur ' + data.ShortName(matches.target),
          cn: '击昏' + data.ShortName(matches.target),
        };
      },
    },
    {
      id: 'T11 Seed River First',
      regex: Regexes.ability({ source: 'Kaliya', id: 'B74', capture: false }),
      regexDe: Regexes.ability({ source: 'Kaliya', id: 'B74', capture: false }),
      regexFr: Regexes.ability({ source: 'Kaliya', id: 'B74', capture: false }),
      regexJa: Regexes.ability({ source: 'カーリア', id: 'B74', capture: false }),
      regexCn: Regexes.ability({ source: '卡利亚', id: 'B74', capture: false }),
      regexKo: Regexes.ability({ source: '칼리야', id: 'B74', capture: false }),
      condition: function(data) {
        return !data.firstSeed;
      },
      response: Responses.spreadThenStack(),
      run: function(data) {
        if (!data.firstSeed)
          data.firstSeed = 'river';
      },
    },
    {
      id: 'T11 Seed Sea First',
      regex: Regexes.ability({ id: 'B75', source: 'Kaliya', capture: false }),
      regexDe: Regexes.ability({ id: 'B75', source: 'Kaliya', capture: false }),
      regexFr: Regexes.ability({ id: 'B75', source: 'Kaliya', capture: false }),
      regexJa: Regexes.ability({ id: 'B75', source: 'カーリア', capture: false }),
      regexCn: Regexes.ability({ id: 'B75', source: '卡利亚', capture: false }),
      regexKo: Regexes.ability({ id: 'B75', source: '칼리야', capture: false }),
      condition: function(data) {
        return !data.firstSeed;
      },
      response: Responses.stackThenSpread(),
      run: function(data) {
        if (!data.firstSeed)
          data.firstSeed = 'sea';
      },
    },
    {
      id: 'T11 Seed River Second',
      regex: Regexes.ability({ id: 'B76', source: 'Kaliya', capture: false }),
      regexDe: Regexes.ability({ id: 'B76', source: 'Kaliya', capture: false }),
      regexFr: Regexes.ability({ id: 'B76', source: 'Kaliya', capture: false }),
      regexJa: Regexes.ability({ id: 'B76', source: 'カーリア', capture: false }),
      regexCn: Regexes.ability({ id: 'B76', source: '卡利亚', capture: false }),
      regexKo: Regexes.ability({ id: 'B76', source: '칼리야', capture: false }),
      condition: function(data) {
        return !data.firstSeed;
      },
      response: Responses.stack(),
      run: function(data) {
        delete data.firstSeed;
      },
    },
    {
      id: 'T11 Seed Sea Second',
      regex: Regexes.ability({ id: 'B77', source: 'Kaliya', capture: false }),
      regexDe: Regexes.ability({ id: 'B77', source: 'Kaliya', capture: false }),
      regexFr: Regexes.ability({ id: 'B77', source: 'Kaliya', capture: false }),
      regexJa: Regexes.ability({ id: 'B77', source: 'カーリア', capture: false }),
      regexCn: Regexes.ability({ id: 'B77', source: '卡利亚', capture: false }),
      regexKo: Regexes.ability({ id: 'B77', source: '칼리야', capture: false }),
      condition: function(data) {
        return !data.firstSeed;
      },
      response: Responses.spread(),
      run: function(data) {
        delete data.firstSeed;
      },
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
      infoText: {
        en: 'Out of Middle',
        de: 'Raus aus der Mitte',
        fr: 'Hors du milieu',
        cn: '离开中间',
      },
    },
    {
      id: 'T11 Forked Lightning',
      regex: Regexes.ability({ id: 'B85', source: 'Electric Node' }),
      regexDe: Regexes.ability({ id: 'B85', source: 'Elektrisch(?:e|er|es|en) Modul' }),
      regexFr: Regexes.ability({ id: 'B85', source: 'Module D\'Électrochoc' }),
      regexJa: Regexes.ability({ id: 'B85', source: '雷撃システム' }),
      regexCn: Regexes.ability({ id: 'B85', source: '雷击系统' }),
      regexKo: Regexes.ability({ id: 'B85', source: '뇌격 시스템' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      alarmText: {
        en: 'Lightning on YOU',
        de: 'Blitz auf DIR',
        fr: 'Éclair sur VOUS',
        cn: '雷点名',
      },
    },
    {
      id: 'T11 Phase 3',
      regex: Regexes.ability({ id: 'B78', source: 'Kaliya', capture: false }),
      regexDe: Regexes.ability({ id: 'B78', source: 'Kaliya', capture: false }),
      regexFr: Regexes.ability({ id: 'B78', source: 'Kaliya', capture: false }),
      regexJa: Regexes.ability({ id: 'B78', source: 'カーリア', capture: false }),
      regexCn: Regexes.ability({ id: 'B78', source: '卡利亚', capture: false }),
      regexKo: Regexes.ability({ id: 'B78', source: '칼리야', capture: false }),
      sound: 'Long',
      infoText: {
        en: 'Final Phase',
        de: 'Finale Phase',
        fr: 'Phase finale',
        cn: 'P3',
      },
    },
    {
      id: 'T11 Tether Accumulate A',
      regex: Regexes.tether({ id: '001C', target: 'Kaliya' }),
      regexDe: Regexes.tether({ id: '001C', target: 'Kaliya' }),
      regexFr: Regexes.tether({ id: '001C', target: 'Kaliya' }),
      regexJa: Regexes.tether({ id: '001C', target: 'カーリア' }),
      regexCn: Regexes.tether({ id: '001C', target: '卡利亚' }),
      regexKo: Regexes.tether({ id: '001C', target: '칼리야' }),
      run: function(data, matches) {
        data.tetherA = data.tetherA || [];
        data.tetherA.push(matches.source);
      },
    },
    {
      id: 'T11 Tether Accumulate B',
      regex: Regexes.tether({ id: '001D', target: 'Kaliya' }),
      regexDe: Regexes.tether({ id: '001D', target: 'Kaliya' }),
      regexFr: Regexes.tether({ id: '001D', target: 'Kaliya' }),
      regexJa: Regexes.tether({ id: '001D', target: 'カーリア' }),
      regexCn: Regexes.tether({ id: '001D', target: '卡利亚' }),
      regexKo: Regexes.tether({ id: '001D', target: '칼리야' }),
      run: function(data, matches) {
        data.tetherB = data.tetherB || [];
        data.tetherB.push(matches.source);
      },
    },
    {
      id: 'T11 Tether A',
      regex: Regexes.tether({ id: '001C', target: 'Kaliya', capture: false }),
      regexDe: Regexes.tether({ id: '001C', target: 'Kaliya', capture: false }),
      regexFr: Regexes.tether({ id: '001C', target: 'Kaliya', capture: false }),
      regexJa: Regexes.tether({ id: '001C', target: 'カーリア', capture: false }),
      regexCn: Regexes.tether({ id: '001C', target: '卡利亚', capture: false }),
      regexKo: Regexes.tether({ id: '001C', target: '칼리야', capture: false }),
      condition: function(data) {
        return data.tetherA.length == 2;
      },
      alarmText: function(data) {
        let partner = undefined;
        if (data.tetherA[0] == data.me)
          partner = data.tetherA[1];
        if (data.tetherA[1] == data.me)
          partner = data.tetherA[0];
        if (!partner)
          return;
        return {
          en: 'Red Tethers With ' + data.ShortName(partner),
          de: 'Rote Verbindung mit ' + data.ShortName(partner),
          fr: 'Liens rouges avec ' + data.ShortName(partner),
          cn: '红线连' + data.ShortName(partner),
        };
      },
    },
    {
      id: 'T11 Tether B',
      regex: Regexes.tether({ id: '001D', target: 'Kaliya', capture: false }),
      regexDe: Regexes.tether({ id: '001D', target: 'Kaliya', capture: false }),
      regexFr: Regexes.tether({ id: '001D', target: 'Kaliya', capture: false }),
      regexJa: Regexes.tether({ id: '001D', target: 'カーリア', capture: false }),
      regexCn: Regexes.tether({ id: '001D', target: '卡利亚', capture: false }),
      regexKo: Regexes.tether({ id: '001D', target: '칼리야', capture: false }),
      condition: function(data) {
        return data.tetherB.length == 2;
      },
      alarmText: function(data) {
        let partner = undefined;
        if (data.tetherB[0] == data.me)
          partner = data.tetherB[1];
        if (data.tetherB[1] == data.me)
          partner = data.tetherB[0];
        if (!partner)
          return;
        return {
          en: 'Blue Tethers With ' + data.ShortName(partner),
          de: 'Blaue Verbindung mit ' + data.ShortName(partner),
          fr: 'Liens bleus avec ' + data.ShortName(partner),
          cn: '蓝线连' + data.ShortName(partner),
        };
      },
    },
    {
      id: 'T11 Tether Cleanup',
      regex: Regexes.ability({ id: 'B7B', source: 'Kaliya', capture: false }),
      regexDe: Regexes.ability({ id: 'B7B', source: 'Kaliya', capture: false }),
      regexFr: Regexes.ability({ id: 'B7B', source: 'Kaliya', capture: false }),
      regexJa: Regexes.ability({ id: 'B7B', source: 'カーリア', capture: false }),
      regexCn: Regexes.ability({ id: 'B7B', source: '卡利亚', capture: false }),
      regexKo: Regexes.ability({ id: 'B7B', source: '칼리야', capture: false }),
      run: function(data) {
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
      'missingTranslations': true,
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
        'Stun': 'スタン',
      },
    },
    {
      'locale': 'cn',
      'missingTranslations': true,
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
        'Stun': '眩晕',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
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
        'Stun': '기절',
      },
    },
  ],
}];
