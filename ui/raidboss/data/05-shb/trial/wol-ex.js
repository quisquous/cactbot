'use strict';

const kImbuedFire = {
  en: 'Stop',
  de: 'Stopp',
  fr: 'Stop',
  ja: '動かない',
  cn: '不要动',
  ko: '멈추기',
};

const kImbuedBlizzard = {
  en: 'Move',
  de: 'Bewegen',
  fr: 'Bougez',
  ja: '動け',
  cn: '动起来',
  ko: '움직이기',
};

const kImbuedHoly = {
  en: 'Stack',
  de: 'Stacken',
  fr: 'Stack',
  ja: 'スタック',
  cn: '集合',
  ko: '쉐어',
};

const kImbuedStone = {
  en: 'Protean',
  de: 'Himmelsrichtungen',
  fr: 'Position',
  ja: '散開',
  cn: '散开',
  ko: '위치 산개',
};

const kImbuedSwordIn = {
  en: 'In',
  de: 'Rein',
  fr: 'Intérieur',
  ja: '中へ',
  cn: '靠近',
  ko: '안으로',
};

const kImbuedSwordOut = {
  en: 'Out',
  de: 'Raus',
  fr: 'Exterieur',
  ja: '外へ',
  cn: '远离',
  ko: '밖으로',
};

const kQuintupleFlash = {
  en: 'Look Away',
  de: 'Wegschauen',
  fr: 'Regardez ailleurs',
  ja: '見ない',
  ko: '뒤돌기',
  cn: '背对',
};

// TODO: replace this with a proxy, here and elsewhere.
const translate = (data, obj) => {
  return data.displayLang in obj ? obj[data.displayLang] : obj['en'];
};

[{
  zoneId: ZoneId.TheSeatOfSacrificeExtreme,
  timelineFile: 'wol-ex.txt',
  timelineTriggers: [
    {
      id: 'WOLEx Limit Break',
      regex: /Limit Break/,
      // 2 extra seconds over the cast.
      beforeSeconds: 8,
      alertText: function(data) {
        const msg = data.limitBreak;
        delete data.limitBreak;
        return msg;
      },
    },
  ],
  triggers: [
    {
      id: 'WOLEx Terror Unleashed',
      netRegex: NetRegexes.ability({ source: 'Warrior Of Light', id: '4F09', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Krieger Des Lichts', id: '4F09', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Guerrier De La Lumière Primordial', id: '4F09', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'ウォーリア・オブ・ライト', id: '4F09', capture: false }),
      condition: function(data) {
        return data.role === 'healer';
      },
      suppressSeconds: 5,
      alertText: {
        en: 'Heal All to Full',
        de: 'Alle vollheilen',
        fr: 'Soignez tout le monde full vie',
        ja: '全員HPを満タンさせ！',
        cn: '奶满全队',
        ko: '전원 체력 풀피로',
      },
    },
    {
      id: 'WOLEx Bait Confiteor',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F43', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4F43', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4F43', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4F43', capture: false }),
      infoText: {
        en: 'Bait Confiteor',
        de: 'Confiteor ködern',
      },
    },
    {
      id: 'WOLEx To The Limit',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F3[456]' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4F3[456]' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4F3[456]' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4F3[456]' }),
      run: function(data, matches) {
        data.limitBreaks = {
          en: {
            0: 'role positions',
            1: 'healer stacks',
            2: 'meteor',
          },
          de: {
            0: 'Rollenposition',
            1: 'Heiler stacks',
            2: 'Meteor',
          },
          ja: {
            0: 'ロール特定位置へ',
            1: 'ヒーラーと集合',
            2: 'メテオ',
          },
          cn: {
            0: '去指定位置',
            1: '与治疗集合',
            2: '陨石',
          },
          ko: {
            0: '1단리밋 산개위치로',
            1: '좌우 산개',
            2: '메테오',
          },
        }[data.displayLang];
        if (matches.id == '4F34')
          data.limitBreak = data.limitBreaks[0];
        if (matches.id == '4F35')
          data.limitBreak = data.limitBreaks[1];
        if (matches.id == '4F36')
          data.limitBreak = data.limitBreaks[2];
      },
    },
    {
      id: 'WOLEx Absolute Stone III',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F2C', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4F2C', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4F2C', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4F2C', capture: false }),
      infoText: kImbuedStone,
    },
    {
      id: 'WOLEx Imbued Absolute Fire III',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4EF3', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4EF3', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4EF3', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4EF3', capture: false }),
      run: function(data) {
        data.imbued = data.imbued || [];
        data.imbued.push(kImbuedFire);
      },
    },
    {
      id: 'WOLEx Imbued Absolute Blizzard III',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4EF4', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4EF4', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4EF4', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4EF4', capture: false }),
      run: function(data) {
        data.imbued = data.imbued || [];
        data.imbued.push(kImbuedBlizzard);
      },
    },
    {
      id: 'WOLEx Imbued Absolute Holy',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4EF5', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4EF5', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4EF5', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4EF5', capture: false }),
      run: function(data) {
        data.imbued = data.imbued || [];
        data.imbued.push(kImbuedHoly);
      },
    },
    {
      id: 'WOLEx Imbued Absolute Stone III',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4EF6', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4EF6', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4EF6', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4EF6', capture: false }),
      run: function(data) {
        data.imbued = data.imbued || [];
        data.imbued.push(kImbuedStone);
      },
    },
    {
      id: 'WOLEx Imbued Coruscance In',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F4A', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4F4A', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4F4A', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4F4A', capture: false }),
      preRun: function(data) {
        data.imbued = data.imbued || [];
        data.imbued.push(kImbuedSwordIn);
      },
      alertText: function(data) {
        const translated = data.imbued.map((x) => translate(data, x));
        const msg = translated.join(' + ');
        delete data.imbued;
        return msg;
      },
    },
    {
      id: 'WOLEx Imbued Coruscance Out',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F49', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4F49', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4F49', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4F49', capture: false }),
      preRun: function(data) {
        data.imbued = data.imbued || [];
        data.imbued.push(kImbuedSwordOut);
      },
      alertText: function(data) {
        const translated = data.imbued.map((x) => translate(data, x));
        const msg = translated.join(' + ');
        delete data.imbued;
        return msg;
      },
    },
    {
      id: 'WOLEx The Bitter End',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F0A' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4F0A' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4F0A' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4F0A' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'WOLEx Summon Wyrm',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F41', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4F41', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4F41', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4F41', capture: false }),
      delaySeconds: 6,
      infoText: {
        en: 'Avoid Wyrm Dash',
        de: 'Wyrm-Ansturm ausweichen',
        ja: '竜を避け',
        cn: '躲避龙的冲锋',
        ko: '용 돌진 피하기',
      },
    },
    {
      id: 'WOLEx Absolute Flash',
      netRegex: NetRegexes.headMarker({ id: '00B3' }),
      suppressSeconds: 5,
      response: Responses.lookAwayFromTarget(),
    },
    {
      id: 'WOLEx Elddragon Dive',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F0B', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4F0B', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4F0B', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4F0B', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'WOLEx Add Phase',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '5151', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '5151', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '5151', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '5151', capture: false }),
      run: function(data) {
        data.isAddPhase = true;
      },
    },
    {
      id: 'WOLEx Fatal Cleave / Blade Of Shadow',
      // Either tank buster, but don't be too noisy
      netRegex: NetRegexes.startsUsing({ source: ['Spectral Warrior', 'Spectral Dark Knight'], id: '515[47]', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: ['Phantom-Berserker', 'Phantom-Dunkelritter'], id: '515[47]', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: ['Berserker Spectral', 'Chevalier Noir Spectral'], id: '515[47]', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: ['幻光の狂戦士', '幻光の暗黒騎士'], id: '515[47]', capture: false }),
      condition: Conditions.caresAboutPhysical(),
      suppressSeconds: 2,
      infoText: {
        en: 'Tank Busters',
        de: 'Tankbuster',
        fr: 'Tank buster',
        ja: 'タンクバスター',
        cn: '坦克死刑',
        ko: '탱버',
      },
    },
    {
      id: 'WOLEx Berserk / Deep Darkside',
      netRegex: NetRegexes.startsUsing({ source: ['Spectral Warrior', 'Spectral Dark Knight'], id: '515[68]', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: ['Phantom-Berserker', 'Phantom-Dunkelritter'], id: '515[68]', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: ['Berserker Spectral', 'Chevalier Noir Spectral'], id: '515[68]', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: ['幻光の狂戦士', '幻光の暗黒騎士'], id: '515[68]', capture: false }),
      condition: (data) => data.CanSilence(),
      suppressSeconds: 2,
      alarmText: {
        en: 'Interrupt',
        de: 'Unterbreche',
        fr: 'Interrompez',
        ja: '沈黙',
        cn: '打断',
        ko: '기술 시전 끊기',
      },
    },
    {
      id: 'WOLEx Adds Deluge of Death Marker',
      netRegex: NetRegexes.headMarker({ id: '0057' }),
      condition: (data, matches) => !data.ultimateSeen && data.me === matches.target,
      alarmText: {
        en: 'Flare on YOU',
        de: 'Flare auf DIR',
        fr: 'Brasier sur VOUS',
        ja: '自分にフレア',
        cn: '核爆点名',
        ko: '플레어 대상자',
      },
    },
    {
      id: 'WOLEx Spectral Egi Flare Breath',
      netRegex: NetRegexes.tether({ source: 'Spectral Egi', id: '0054' }),
      netRegexDe: NetRegexes.tether({ source: 'Phantom-Primae', id: '0054' }),
      netRegexFr: NetRegexes.tether({ source: 'Egi Spectral', id: '0054' }),
      netRegexJa: NetRegexes.tether({ source: '幻光の召喚獣', id: '0054' }),
      condition: Conditions.targetIsYou(),
      suppressSeconds: 4,
      infoText: {
        en: 'Point Tether Out',
        de: 'Verbindung nach draußen richten',
        fr: 'Lien vers l\'extérieur',
        ja: '線を外に引く',
        cn: '连线',
        ko: '선 연결 바깥으로 빼기',
      },
    },
    {
      id: 'WOLEx Ultimate Crossover',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '5152', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '5152', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '5152', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '5152', capture: false }),
      condition: (data) => data.role === 'tank',
      alarmText: {
        en: 'TANK LB!!',
        de: 'TANK LB!!',
        ja: 'タンクLB!!',
        fr: 'LB TANK !!',
        ko: '리미트 브레이크!!',
        cn: '坦克LB!!',
      },
      run: function(data) {
        data.isAddPhase = false;
        data.ultimateSeen = true;
      },
    },
    {
      id: 'WOLEx Spectral Black Mage / White Mage',
      // Twincast tell (after Spectral and Limit, unfortunately).
      netRegex: NetRegexes.startsUsing({ source: 'Spectral Black Mage', id: '4F3D', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Phantom-Schwarzmagier', id: '4F3D', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Mage Noir Spectral', id: '4F3D', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '幻光の黒魔道士', id: '4F3D', capture: false }),
      condition: (data) => data.ultimateSeen && !data.calledSpectral,
      preRun: (data) => data.calledSpectral = true,
      alertText: {
        en: 'Black Mage + White Mage',
        de: 'Schwarzmagier + Weißmagier',
        ja: '黒魔導士 + 白魔導士',
        cn: '黑魔法师 + 白魔法师',
        ko: '흑마도사 + 백마도사',
      },
    },
    {
      id: 'WOLEx Summoner / Warrior',
      // Imbued Fire/Ice tell.
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4EF[34]', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4EF[34]', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4EF[34]', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4EF[34]', capture: false }),
      condition: (data) => data.ultimateSeen && !data.calledSpectral,
      preRun: (data) => data.calledSpectral = true,
      alertText: {
        en: 'Summoner + Warrior',
        de: 'Beschwörer + Krieger',
        ja: '召喚師 + 戦士',
        cn: '召唤师 + 战士',
        ko: '소환사 + 전사',
      },
    },
    {
      id: 'WOLEx Spectral Bard / Dark Knight',
      // Solemn Confiteor tell (after Limit).
      // This action happens in Spectral Ninja, but calledSpectral suppresses calling Ninja there.
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F43', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4F43', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4F43', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4F43', capture: false }),
      condition: (data) => data.ultimateSeen && !data.calledSpectral,
      preRun: (data) => data.calledSpectral = true,
      alertText: {
        en: 'Dark Knight + Bard',
        de: 'Dunkelritter + Barde',
        ja: '暗黒騎士 + 吟遊詩人',
        cn: '暗黑骑士 + 吟游诗人',
        ko: '암흑기사 + 음유시인',
      },
    },
    {
      id: 'WOLEx Spectral Ninja',
      // Imbued Stone/Holy tell.
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4EF[56]', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4EF[56]', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4EF[56]', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4EF[56]', capture: false }),
      condition: (data) => data.ultimateSeen && !data.calledSpectral,
      preRun: (data) => data.calledSpectral = true,
      alertText: {
        en: 'Ninja',
        de: 'Ninja',
        ja: '忍者',
        cn: '忍者',
        ko: '닌자',
      },
      run: function(data) {
        data.ninja = true;
      },
    },
    {
      id: 'WOLEx Spectral Tell Cleanup',
      // This is the "go back to the middle" sync that happens after all tells.
      netRegex: NetRegexes.ability({ source: 'Warrior Of Light', id: '4F45', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Krieger Des Lichts', id: '4F45', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Guerrier De La Lumière Primordial', id: '4F45', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'ウォーリア・オブ・ライト', id: '4F45', capture: false }),
      run: function(data) {
        data.calledSpectral = false;
      },
    },
    {
      // Katon: San and Absolute Holy share markers
      id: 'WOLEx Spectral Ninja Cleanup',
      netRegex: NetRegexes.startsUsing({ source: ['Warrior Of Light', 'Spectral Ninja'], id: '4EFD', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: ['Krieger Des Lichts', 'Phantom-Ninja'], id: '4EFD', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: ['Guerrier De La Lumière Primordial', 'Ninja Spectral'], id: '4EFD', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: ['ウォーリア・オブ・ライト', '幻光の忍者'], id: '4EFD', capture: false }),
      delaySeconds: 30,
      run: function(data) {
        delete data.ninja;
      },
    },
    {
      id: 'WOLEx Suiton: San',
      // It's possible for this cast to originate from the Warrior of Light instead.
      // Allow for either so the callout isn't missed.
      netRegex: NetRegexes.startsUsing({ source: ['Warrior Of Light', 'Spectral Ninja'], id: '4EFD', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: ['Krieger Des Lichts', 'Phantom-Ninja'], id: '4EFD', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: ['Guerrier De La Lumière Primordial', 'Ninja Spectral'], id: '4EFD', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: ['ウォーリア・オブ・ライト', '幻光の忍者'], id: '4EFD', capture: false }),
      delaySeconds: 7,
      response: Responses.knockback(),
    },
    {
      id: 'WOLEx Katon: San',
      netRegex: NetRegexes.headMarker({ id: '00A1', capture: false }),
      condition: (data) => data.ultimateSeen && data.ninja || data.isAddPhase,
      suppressSeconds: 2,
      response: Responses.stack(),
    },
    {
      id: 'WOLEx Perfect Decimation',
      netRegex: NetRegexes.headMarker({ id: '0017' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Warrior Cleave on YOU',
        de: 'Krieger Cleave auf DIR',
        ja: '自分に戦士の範囲攻撃',
        cn: '战士顺劈点名',
        ko: '전사 범위 공격 대상자',
      },
    },
    {
      id: 'WOLEx Brimstone Earth',
      netRegex: NetRegexes.headMarker({ id: '0067' }),
      condition: Conditions.targetIsYou(),
      alertText: {
        en: 'Puddle on YOU',
        de: 'Fläche auf DIR',
        fr: 'Zone au sol sur VOUS',
        ja: '自分に水溜り',
        cn: '水球点名',
        ko: '장판 대상자',
      },
    },
    {
      id: 'WOLEx Deluge of Death Marker',
      netRegex: NetRegexes.headMarker({ id: '0057' }),
      condition: (data, matches) => data.ultimateSeen && data.me === matches.target,
      alarmText: {
        en: 'Flare on YOU',
        de: 'Flare auf DIR',
        fr: 'Brasier sur VOUS',
        ja: '自分にフレア',
        cn: '核爆点名',
        ko: '플레어 대상자',
      },
      run: function(data) {
        data.deluge = true;
      },
    },
    {
      id: 'WOLEx Absolute Holy',
      netRegex: NetRegexes.headMarker({ id: '00A1' }),
      condition: (data) => !data.deluge && !data.ninja && !data.isAddPhase,
      response: Responses.stackOn(),
    },
    {
      id: 'WOLEx Coruscant Saber Out',
      // TODO: This once was out + stack ?
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4EF1', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4EF1', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4EF1', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4EF1', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'WOLEx Coruscant Saber In',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4EF2', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4EF2', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4EF2', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4EF2', capture: false }),
      response: Responses.getIn(),
    },
    {
      id: 'WOLEx Quintuplecast',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4EEF', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4EEF', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4EEF', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4EEF', capture: false }),
      run: function(data) {
        data.quintuplecasting = true;
        data.quintuplecasts = [];
      },
    },
    {
      id: 'WOLEx Quintuplecast List',
      netRegex: NetRegexes.ability({ source: 'Warrior Of Light', id: '4EEF', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Krieger Des Lichts', id: '4EEF', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Guerrier De La Lumière Primordial', id: '4EEF', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'ウォーリア・オブ・ライト', id: '4EEF', capture: false }),
      durationSeconds: 18.5,
      infoText: function(data) {
        const translated = data.quintuplecasts.map((x) => translate(data, x));
        const msg = translated.join(' > ');
        return msg;
      },
      tts: null,
    },
    {
      id: 'WOLEx Quintuplecast Individual',
      netRegex: NetRegexes.ability({ source: 'Warrior Of Light', id: ['4EEF', '4EF0'], capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Krieger Des Lichts', id: ['4EEF', '4EF0'], capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Guerrier De La Lumière Primordial', id: ['4EEF', '4EF0'], capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'ウォーリア・オブ・ライト', id: ['4EEF', '4EF0'], capture: false }),
      durationSeconds: 3,
      alertText: function(data) {
        const next = data.quintuplecasts.shift();
        // The last cast of 4EF0 will not have a next mechanic to call.
        if (!next)
          return;
        return translate(data, next);
      },
    },
    {
      id: 'WOLEx Quintuplecast Blizzard',
      netRegex: NetRegexes.headMarker({ id: '00E2', capture: false }),
      condition: (data) => data.quintuplecasting,
      durationSeconds: 2,
      suppressSeconds: 5,
      infoText: (data) => `(${translate(data, kImbuedBlizzard).toLowerCase()})`,
      run: function(data) {
        data.quintuplecasts.push(kImbuedBlizzard);
      },
    },
    {
      id: 'WOLEx Quintuplecast Holy',
      netRegex: NetRegexes.headMarker({ id: '00DD', capture: false }),
      condition: (data) => data.quintuplecasting,
      durationSeconds: 2,
      suppressSeconds: 5,
      infoText: (data) => `(${translate(data, kImbuedHoly).toLowerCase()})`,
      run: function(data) {
        data.quintuplecasts.push(kImbuedHoly);
      },
    },
    {
      id: 'WOLEx Quintuplecast Stone',
      netRegex: NetRegexes.headMarker({ id: '00DE', capture: false }),
      condition: (data) => data.quintuplecasting,
      durationSeconds: 2,
      suppressSeconds: 5,
      infoText: (data) => `(${translate(data, kImbuedStone).toLowerCase()})`,
      run: function(data) {
        data.quintuplecasts.push(kImbuedStone);
      },
    },
    {
      id: 'WOLEx Quintuplecast Fire',
      netRegex: NetRegexes.headMarker({ id: '00E4', capture: false }),
      condition: (data) => data.quintuplecasting,
      durationSeconds: 2,
      suppressSeconds: 5,
      infoText: (data) => `(${translate(data, kImbuedFire).toLowerCase()})`,
      run: function(data) {
        data.quintuplecasts.push(kImbuedFire);
      },
    },
    {
      id: 'WOLEx Quintuplecast Flash',
      netRegex: NetRegexes.headMarker({ id: '00DF' }),
      condition: (data) => data.quintuplecasting,
      durationSeconds: 2,
      suppressSeconds: 5,
      infoText: (data) => `(${translate(data, kQuintupleFlash).toLowerCase()})`,
      run: function(data, matches) {
        data.quintuplecasts.push(kQuintupleFlash);
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Spectral Ninja': 'Phantom-Ninja',
        'Warrior Of Light': 'Krieger des Lichts',
        'Spectral Dark Knight': 'Phantom-Dunkelritter',
        'Spectral Warrior': 'Phantom-Berserker',
        'Spectral Black Mage': 'Phantom-Schwarzmagier',
        'Spectral Summoner': 'Phantom-Beschwörer',
        'Spectral Egi': 'Phantom-Primae',
        'Wyrm Of Light': 'Wyrm des Lichts',
        'Spectral Bard': 'Phantom-Barde',
        'Spectral White Mage': 'Phantom-Weißmagier',
      },
      'replaceText': {
        'Absolute Flash': 'Absolutes Blitzlicht',
        'Absolute Holy': 'Absolutes Sanctus',
        'Absolute Stone III': 'Absolutes Steinga',
        'Berserk': 'Tollwut',
        'Blade Of Shadow': 'Magische Schattenklinge',
        'Brimstone Earth': 'Schwefelerde',
        '(?<!\\w)Cast': 'Zauber',
        'Cauterize': 'Kauterisieren',
        'Coruscant Saber': 'Gleißender Säbel',
        'Deep Darkside': 'Totale Finsternis',
        'Deluge Of Death': 'Tödlicher Sturzregen',
        'Elddragon Dive': 'Altdrachensturz',
        'Fatal Cleave': 'Fatales Niedermähen',
        'Fire': 'Feuga',
        'Flare Breath': 'Flare-Atem',
        '(?<!Absolute )Holy': 'Sanctus',
        'Ice': 'Eisga',
        'Imbued Coruscance': 'Magieklingentechnik: Gleißender Säbel',
        'Imbued(?! Coruscance)': 'Magieklinge des absoluten',
        'Katon\\: San': 'Katon: San',
        'Limit(?! Break)': 'Limit',
        'Limit Break': 'Limitrausch',
        'Meteor Impact': 'Meteoreinschlag',
        'Perfect Decimation': 'Perfektes Dezimieren',
        'Quintuplecast': 'Fünffachzauber',
        'Radiant Braver': 'Gleißende Gerechtigkeit',
        'Radiant Desperado': 'Gleißender Desperado',
        'Radiant Meteor': 'Gleißender Meteor',
        'Shining Wave': 'Leuchtwelle',
        'Solemn Confiteor': 'Feierlicher Confiteor',
        'Specter Of Light': 'Heldenruf',
        '(?<!Absolute )Stone(?! Earth)': 'Steinga',
        'Suiton\\: San': 'Suiton: San',
        'Summon(?! Wyrm)': 'Beschwörung',
        'Summon Wyrm': 'Drachenbeschwörung',
        'Sword Of Light': 'Schwert des Lichts',
        'Terror Unleashed': 'Entfesselter Terror',
        'The Bitter End': 'Schwertschimmer',
        'To The Limit': 'Bis ans Limit',
        'Twincast': 'Dualzauber',
        'Ultimate Crossover': 'Ultimative Kreuzigung',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Spectral Ninja': 'ninja spectral',
        'Warrior Of Light': 'Guerrier de la Lumière primordial',
        'Spectral Dark Knight': 'chevalier noir spectral',
        'Spectral Warrior': 'berserker spectral',
        'Spectral Black Mage': 'mage noir spectral',
        'Spectral Summoner': 'invocatrice spectrale',
        'Spectral Egi': 'Egi spectral',
        'Wyrm Of Light': 'wyrm de Lumière',
        'Spectral Bard': 'barde spectral',
        'Spectral White Mage': 'mage blanc spectral',
      },
      'replaceText': {
        'Absolute Flash': 'Magilame Flash',
        'Absolute Holy': 'Miracle absolu',
        'Absolute Stone III': 'Méga Terre absolue',
        'Berserk': 'Furie',
        'Blade Of Shadow': 'Tranchant maléfique d\'ombre',
        'Brimstone Earth': 'Terre de soufre',
        'Cauterize': 'Cautérisation',
        'Coruscant Saber': 'Fureur flamboyante',
        'Deep Darkside': 'Ténèbres intérieures absolues',
        'Deluge Of Death': 'Averse mortelle',
        'Elddragon Dive': 'Piqué du dragon ancien',
        'Fatal Cleave': 'Fendoir fatal',
        'Flare Breath': 'Souffle brasier',
        'Imbued Coruscance': 'Magilame Fureur flamboyante',
        'Katon\\: San': 'Katon : San',
        'Limit Break': 'Transcendance',
        'Meteor Impact': 'Impact de météore',
        'Perfect Decimation': 'Décimation parfaite',
        'Quintuplecast': 'Quintuple sort',
        'Radiant Braver': 'Âme brave flamboyante',
        'Radiant Desperado': 'Desperado flamboyant',
        'Radiant Meteor': 'Météore flamboyant',
        'Shining Wave': 'Épée flamboyante',
        'Solemn Confiteor': 'Confiteor solennel',
        'Specter Of Light': 'Sommation des braves',
        'Suiton\\: San': 'Suiton : San',
        'Summon(?! Wyrm)': 'Invocation',
        'Summon Wyrm': 'Invocation de wyrm',
        'Sword Of Light': 'Lame de Lumière',
        'Terror Unleashed': 'Déchaînement de la terreur',
        'The Bitter End': 'Éradication',
        'To The Limit': 'Pas vers la transcendance',
        'Twincast': 'Tandem',
        'Ultimate Crossover': 'Taillade croisée ultime',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Spectral Ninja': '幻光の忍者',
        'Warrior Of Light': 'ウォーリア・オブ・ライト',
        'Spectral Dark Knight': '幻光の暗黒騎士',
        'Spectral Warrior': '幻光の狂戦士',
        'Spectral Black Mage': '幻光の黒魔道士',
        'Spectral Summoner': '幻光の召喚士',
        'Spectral Egi': '幻光の召喚獣',
        'Wyrm Of Light': 'ウィルム・オブ・ライト',
        'Spectral Bard': '幻光の吟遊詩人',
        'Spectral White Mage': '幻光の白魔道士',
      },
      'replaceText': {
        'Absolute Flash': 'アブソリュートフラッシュ',
        'Absolute Holy': 'アブソリュートホーリー',
        'Absolute Stone III': 'アブソリュートストンガ',
        'Berserk': 'ベルセルク',
        'Blade Of Shadow': '漆黒の魔剣',
        'BLM/WHM': '黒魔／白魔',
        'Brimstone Earth': 'ブリムストーンアース',
        '(?<!\\w)Cast(?= )': '五連魔',
        'Cauterize': 'カータライズ',
        'Coruscant Saber': 'ブライトセイバー',
        'Deep Darkside': '真暗黒',
        'Deluge Of Death': 'ヘビーレイン・オブ・デス',
        'DRK/BRD': '暗黒／詩人',
        'Elddragon Dive': 'エンシェントドラゴンダイブ',
        'Fatal Cleave': 'フェイタルクリーヴ',
        'Flare Breath': 'フレアブレス',
        'Imbued Coruscance': '魔法剣技：ブライトセイバー',
        'Imbued Fire/Ice': '魔法剣 (火／氷)',
        'Imbued Holy': '魔法剣 (光)',
        'Imbued Ice/Fire': '魔法剣 (氷／火)',
        'Imbued Stone': '魔法剣 (土)',
        'Katon\\: San': '火遁の術：参',
        '(?<! )Limit(?! Break)': 'リミットチャージ',
        'Limit Break': 'リミットブレイク',
        'Meteor Impact': 'メテオインパクト',
        '(?<= )NIN': '忍者',
        'Perfect Decimation': 'パーフェクトデシメート',
        'Quintuplecast': '五連魔',
        'Radiant Braver': 'ブライトブレイバー',
        'Radiant Desperado': 'ブライトデスペラード',
        'Radiant Meteor': 'ブライトメテオ',
        'Shining Wave': 'シャイニングウェーブ',
        'SMN/WAR': '召喚／戦士',
        'Solemn Confiteor': 'ソーレムコンフィテオル',
        'Specter Of Light': '幻光召喚',
        'Suiton\\: San': '水遁の術：参',
        'Summon(?! Wyrm)': '召喚',
        'Summon Wyrm': 'サモン・ウィルム',
        'Sword Of Light': 'ソード・オブ・ライト',
        'Terror Unleashed': 'アンリーシュ・テラー',
        'The Bitter End': 'エンドオール',
        'To The Limit': 'リミットチャージ',
        'Twincast': 'ふたりがけ',
        'Ultimate Crossover': 'アルティメット・クロスオーバー',
      },
    },
  ],
}];
