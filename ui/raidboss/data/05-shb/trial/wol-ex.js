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
  ko: '집합',
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

[{
  zoneId: ZoneId.TheSeatOfSacrificeExtreme,
  timelineFile: 'wol-ex.txt',
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
        ja: 'HP戻して',
        cn: '奶满全队',
        ko: '전원 체력 풀피로',
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
            1: 'stacks',
            2: 'meteor',
          },
          de: {
            0: 'Rollenposition',
            1: 'Gruppen stacks',
            2: 'Meteor',
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
      // TODO: Replace with Timeline Trigger for earlier alerting
      id: 'WOLEx Limit Break',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: ['4EFB', '515C', '53CB'], capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: ['4EFB', '515C', '53CB'], capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: ['4EFB', '515C', '53CB'], capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: ['4EFB', '515C', '53CB'], capture: false }),
      alertText: function(data) {
        let msg = data.limitBreak;
        delete data.limitBreak;
        return msg;
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
        const translated = data.imbued.map((x) => data.displayLang in x ? x[data.displayLang] : x['en']);
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
        const translated = data.imbued.map((x) => data.displayLang in x ? x[data.displayLang] : x['en']);
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
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '515[23]', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '515[23]', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '515[23]', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '515[23]', capture: false }),
      run: function(data) {
        data.ultimateSeen = true;
      },
    },
    {
      // TODO: We can call these out earlier based on the move WoL does before Specter of Light
      id: 'WOLEx Spectral Black Mage / White Mage',
      netRegex: NetRegexes.startsUsing({ source: 'Spectral Black Mage', id: '4F3D', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Phantom-Schwarzmagier', id: '4F3D', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Mage Noir Spectral', id: '4F3D', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '幻光の黒魔道士', id: '4F3D', capture: false }),
      condition: (data) => data.ultimateSeen,
      infoText: {
        en: 'Black Mage + White Mage',
        de: 'Schwarzmagier + Weißmagier',
      },
    },
    {
      id: 'WOLEx Summoner / Warrior',
      netRegex: NetRegexes.startsUsing({ source: 'Spectral Summoner', id: '4F3F', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Phantom-Beschwörer', id: '4F3F', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Invocatrice Spectrale', id: '4F3F', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '幻光の召喚士', id: '4F3F', capture: false }),
      condition: (data) => data.ultimateSeen,
      infoText: {
        en: 'Summoner + Warrior',
        de: 'Beschwörer + Krieger',
      },
    },
    {
      id: 'WOLEx Spectral Bard / Dark Knight',
      netRegex: NetRegexes.startsUsing({ source: 'Spectral Dark Knight', id: '4F3A', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Phantom-Dunkelritter', id: '4F3A', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Chevalier Noir Spectral', id: '4F3A', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '幻光の暗黒騎士', id: '4F3A', capture: false }),
      condition: (data) => data.ultimateSeen,
      infoText: {
        en: 'Dark Knight + Bard',
        de: 'Dunkelritter + Barde',
      },
    },
    {
      id: 'WOLEx Spectral Ninja',
      netRegex: NetRegexes.startsUsing({ source: 'Spectral Ninja', id: '4EFD', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Phantom-Ninja', id: '4EFD', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Ninja Spectral', id: '4EFD', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '幻光の忍者', id: '4EFD', capture: false }),
      infoText: {
        en: 'Ninja',
        de: 'Ninja',
      },
      run: function(data) {
        data.ninja = true;
      },
    },
    {
      // Katon: San and Absolute Holy share markers
      id: 'WOLEx Spectral Ninja Cleanup',
      netRegex: NetRegexes.startsUsing({ source: 'Spectral Ninja', id: '4EFD', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Phantom-Ninja', id: '4EFD', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Ninja Spectral', id: '4EFD', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '幻光の忍者', id: '4EFD', capture: false }),
      delaySeconds: 30,
      run: function(data) {
        delete data.ninja;
      },
    },
    {
      id: 'WOLEx Suiton: San',
      netRegex: NetRegexes.startsUsing({ source: 'Spectral Ninja', id: '4EFD', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Phantom-Ninja', id: '4EFD', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Ninja Spectral', id: '4EFD', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '幻光の忍者', id: '4EFD', capture: false }),
      delaySeconds: 7,
      response: Responses.knockback(),
    },
    {
      id: 'WOLEx Katon: San',
      netRegex: NetRegexes.headMarker({ id: '00A1', capture: false }),
      condition: (data) => data.ultimateSeen && data.ninja,
      delaySeconds: 0.5,
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
        ko: '징 대상자',
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
      condition: (data) => !data.deluge && !data.ninja,
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
      alertText: function(data) {
        const translated = data.quintuplecasts.map((x) => data.displayLang in x ? x[data.displayLang] : x['en']);
        const msg = translated.join(' > ');
        delete data.quintuplecasts;
        return msg;
      },
    },
    {
      id: 'WOLEx Quintuplecast Blizzard',
      netRegex: NetRegexes.headMarker({ id: '00E2', capture: false }),
      condition: (data) => data.quintuplecasting,
      suppressSeconds: 5,
      run: function(data) {
        data.quintuplecasts.push(kImbuedBlizzard);
      },
    },
    {
      id: 'WOLEx Quintuplecast Holy',
      netRegex: NetRegexes.headMarker({ id: '00DD', capture: false }),
      condition: (data) => data.quintuplecasting,
      suppressSeconds: 5,
      run: function(data) {
        data.quintuplecasts.push(kImbuedHoly);
      },
    },
    {
      id: 'WOLEx Quintuplecast Stone',
      netRegex: NetRegexes.headMarker({ id: '00DE', capture: false }),
      condition: (data) => data.quintuplecasting,
      suppressSeconds: 5,
      run: function(data) {
        data.quintuplecasts.push(kImbuedStone);
      },
    },
    {
      id: 'WOLEx Quintuplecast Fire',
      netRegex: NetRegexes.headMarker({ id: '00E4', capture: false }),
      condition: (data) => data.quintuplecasting,
      suppressSeconds: 5,
      run: function(data) {
        data.quintuplecasts.push(kImbuedFire);
      },
    },
    {
      id: 'WOLEx Quintuplecast Flash',
      netRegex: NetRegexes.headMarker({ id: '00DF' }),
      condition: (data) => data.quintuplecasting,
      suppressSeconds: 5,
      run: function(data, matches) {
        data.quintuplecasts.push(kQuintupleFlash);
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'missingTranslations': true,
      'replaceSync': {
        'Spectral Ninja': 'Phantom-Ninja',
        'Warrior Of Light': 'Krieger des Lichts',
        'Spectral Dark Knight': 'Phantom-Dunkelritter',
        'Spectral Warrior': 'Phantom-Berserker',
        'Spectral Black Mage': 'Phantom-Schwarzmagier',
        'Spectral Summoner': 'Phantom-Beschwörer',
        'Spectral Egi': 'Phantom-Primae',
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
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Spectral Ninja': '幻光の忍者',
        'Warrior Of Light': 'ウォーリア・オブ・ライト',
        'Spectral Dark Knight': '幻光の暗黒騎士',
        'Spectral Warrior': '幻光の狂戦士',
        'Spectral Black Mage': '幻光の黒魔道士',
        'Spectral Summoner': '幻光の召喚士',
        'Spectral Egi': '幻光の召喚獣',
      },
    },
  ],
}];
