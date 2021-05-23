import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';

// Shared between imbued and quintuplecast.
const sharedOutputStrings = {
  fire: {
    en: 'Stop',
    de: 'Stopp',
    fr: 'Stop',
    ja: '動かない',
    cn: '停停停',
    ko: '멈추기',
  },
  blizzard: {
    en: 'Move',
    de: 'Bewegen',
    fr: 'Bougez',
    ja: '動け',
    cn: '动动动',
    ko: '움직이기',
  },
  holy: {
    en: 'Stack',
    de: 'Stacken',
    fr: 'Packez-vous',
    ja: 'スタック',
    cn: '集合',
    ko: '쉐어',
  },
  stone: {
    en: 'Protean',
    de: 'Himmelsrichtungen',
    fr: 'Position',
    ja: '散開',
    cn: '散开',
    ko: '위치 산개',
  },
};

// Only for imbued.
const imbuedOutputStrings = {
  ...sharedOutputStrings,
  swordIn: {
    en: 'In',
    de: 'Rein',
    fr: 'Intérieur',
    ja: '中へ',
    cn: '月环',
    ko: '안으로',
  },
  swordOut: {
    en: 'Out',
    de: 'Raus',
    fr: 'Exterieur',
    ja: '外へ',
    cn: '钢铁',
    ko: '밖으로',
  },
};

// Only for quintuplecast.
const quintupleOutputStrings = {
  ...sharedOutputStrings,
  flash: {
    en: 'Look Away',
    de: 'Wegschauen',
    fr: 'Regardez ailleurs',
    ja: '見ない',
    cn: '背对',
    ko: '뒤돌기',
  },
};

export default {
  zoneId: ZoneId.TheSeatOfSacrificeExtreme,
  timelineFile: 'wol-ex.txt',
  timelineTriggers: [
    {
      id: 'WOLEx Limit Break',
      regex: /Limit Break/,
      // 2 extra seconds over the cast.
      beforeSeconds: 8,
      alertText: (data, _matches, output) => {
        const num = data.limitBreak;
        delete data.limitBreak;

        switch (num) {
        case 1:
          return output.limitBreak1();
        case 2:
          return output.limitBreak2();
        case 3:
          return output.limitBreak3();
        }
      },
      outputStrings: {
        limitBreak1: {
          en: 'role positions',
          de: 'Rollenposition',
          fr: 'Positions par rôle',
          ja: 'ロール特定位置へ',
          cn: '去指定位置',
          ko: '1단리밋 산개위치로',
        },
        limitBreak2: {
          en: 'healer stacks',
          de: 'Heiler stacks',
          fr: 'Package healers',
          ja: 'ヒーラーと集合',
          cn: '与治疗集合',
          ko: '좌우 산개',
        },
        limitBreak3: {
          en: 'meteor',
          de: 'Meteor',
          fr: 'Météore',
          ja: 'メテオ',
          cn: '陨石',
          ko: '메테오',
        },
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
      netRegexCn: NetRegexes.ability({ source: '光之战士', id: '4F09', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '빛의 전사', id: '4F09', capture: false }),
      condition: (data) => data.role === 'healer',
      suppressSeconds: 5,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Heal All to Full',
          de: 'Alle vollheilen',
          fr: 'Soignez tout le monde complètement',
          ja: '全員のHPを満タンに！',
          cn: '奶满全队',
          ko: '전원 체력 풀피로',
        },
      },
    },
    {
      id: 'WOLEx Bait Confiteor',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F43', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4F43', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4F43', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4F43', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '光之战士', id: '4F43', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '빛의 전사', id: '4F43', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Bait Confiteor',
          de: 'Confiteor ködern',
          fr: 'Attirez les zones au sol',
          ja: 'ソーレムコンフィテオル',
          cn: '诱导庄严悔罪',
          ko: '장판 유도하기',
        },
      },
    },
    {
      id: 'WOLEx To The Limit',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F3[456]' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4F3[456]' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4F3[456]' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4F3[456]' }),
      netRegexCn: NetRegexes.startsUsing({ source: '光之战士', id: '4F3[456]' }),
      netRegexKo: NetRegexes.startsUsing({ source: '빛의 전사', id: '4F3[456]' }),
      run: (data, matches) => {
        if (matches.id === '4F34')
          data.limitBreak = 1;
        if (matches.id === '4F35')
          data.limitBreak = 2;
        if (matches.id === '4F36')
          data.limitBreak = 3;
      },
    },
    {
      id: 'WOLEx Absolute Stone III',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F2C', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4F2C', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4F2C', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4F2C', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '光之战士', id: '4F2C', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '빛의 전사', id: '4F2C', capture: false }),
      infoText: (_data, _matches, output) => output.stone(),
      outputStrings: {
        stone: imbuedOutputStrings.stone,
      },
    },
    {
      id: 'WOLEx Imbued Absolute Fire III',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4EF3', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4EF3', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4EF3', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4EF3', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '光之战士', id: '4EF3', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '빛의 전사', id: '4EF3', capture: false }),
      run: (data) => {
        data.imbued = data.imbued || [];
        data.imbued.push('fire');
      },
    },
    {
      id: 'WOLEx Imbued Absolute Blizzard III',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4EF4', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4EF4', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4EF4', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4EF4', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '光之战士', id: '4EF4', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '빛의 전사', id: '4EF4', capture: false }),
      run: (data) => {
        data.imbued = data.imbued || [];
        data.imbued.push('blizzard');
      },
    },
    {
      id: 'WOLEx Imbued Absolute Holy',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4EF5', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4EF5', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4EF5', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4EF5', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '光之战士', id: '4EF5', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '빛의 전사', id: '4EF5', capture: false }),
      run: (data) => {
        data.imbued = data.imbued || [];
        data.imbued.push('holy');
      },
    },
    {
      id: 'WOLEx Imbued Absolute Stone III',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4EF6', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4EF6', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4EF6', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4EF6', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '光之战士', id: '4EF6', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '빛의 전사', id: '4EF6', capture: false }),
      run: (data) => {
        data.imbued = data.imbued || [];
        data.imbued.push('stone');
      },
    },
    {
      id: 'WOLEx Imbued Coruscance In',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F4A', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4F4A', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4F4A', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4F4A', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '光之战士', id: '4F4A', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '빛의 전사', id: '4F4A', capture: false }),
      preRun: (data) => {
        data.imbued = data.imbued || [];
        data.imbued.push('swordIn');
      },
      alertText: (data, _matches, output) => {
        const strings = data.imbued.map((key) => output[key]());
        const msg = strings.join(' + ');
        delete data.imbued;
        return msg;
      },
      outputStrings: imbuedOutputStrings,
    },
    {
      id: 'WOLEx Imbued Coruscance Out',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F49', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4F49', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4F49', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4F49', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '光之战士', id: '4F49', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '빛의 전사', id: '4F49', capture: false }),
      preRun: (data) => {
        data.imbued = data.imbued || [];
        data.imbued.push('swordOut');
      },
      alertText: (data, _matches, output) => {
        const strings = data.imbued.map((key) => output[key]());
        const msg = strings.join(' + ');
        delete data.imbued;
        return msg;
      },
      outputStrings: imbuedOutputStrings,
    },
    {
      id: 'WOLEx The Bitter End',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F0A' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4F0A' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4F0A' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4F0A' }),
      netRegexCn: NetRegexes.startsUsing({ source: '光之战士', id: '4F0A' }),
      netRegexKo: NetRegexes.startsUsing({ source: '빛의 전사', id: '4F0A' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'WOLEx Summon Wyrm',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4F41', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4F41', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4F41', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4F41', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '光之战士', id: '4F41', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '빛의 전사', id: '4F41', capture: false }),
      delaySeconds: 6,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Avoid Wyrm Dash',
          de: 'Wyrm-Ansturm ausweichen',
          fr: 'Évitez la charge du Wyrm',
          ja: '竜を避ける',
          cn: '躲避巴哈冲锋',
          ko: '용 돌진 피하기',
        },
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
      netRegexCn: NetRegexes.startsUsing({ source: '光之战士', id: '4F0B', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '빛의 전사', id: '4F0B', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'WOLEx Add Phase',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '5151', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '5151', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '5151', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '5151', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '光之战士', id: '5151', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '빛의 전사', id: '5151', capture: false }),
      run: (data) => {
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
      netRegexCn: NetRegexes.startsUsing({ source: ['幻光狂战士', '幻光暗黑骑士'], id: '515[47]', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: ['환상빛의 전사', '환상빛의 암흑기사'], id: '515[47]', capture: false }),
      condition: Conditions.caresAboutPhysical(),
      suppressSeconds: 2,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: Outputs.tankBusters,
      },
    },
    {
      id: 'WOLEx Berserk / Deep Darkside',
      netRegex: NetRegexes.startsUsing({ source: ['Spectral Warrior', 'Spectral Dark Knight'], id: '515[68]', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: ['Phantom-Berserker', 'Phantom-Dunkelritter'], id: '515[68]', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: ['Berserker Spectral', 'Chevalier Noir Spectral'], id: '515[68]', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: ['幻光の狂戦士', '幻光の暗黒騎士'], id: '515[68]', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: ['幻光狂战士', '幻光暗黑骑士'], id: '515[68]', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: ['환상빛의 전사', '환상빛의 암흑기사'], id: '515[68]', capture: false }),
      condition: (data) => data.CanSilence(),
      suppressSeconds: 2,
      alarmText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Interrupt',
          de: 'Unterbreche',
          fr: 'Interrompez',
          ja: '沈黙',
          cn: '插言',
          ko: '기술 시전 끊기',
        },
      },
    },
    {
      id: 'WOLEx Adds Deluge of Death Marker',
      netRegex: NetRegexes.headMarker({ id: '0057' }),
      condition: (data, matches) => !data.ultimateSeen && data.me === matches.target,
      alarmText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Flare on YOU',
          de: 'Flare auf DIR',
          fr: 'Brasier sur VOUS',
          ja: '自分にフレア',
          cn: '核爆点名',
          ko: '플레어 대상자',
        },
      },
    },
    {
      id: 'WOLEx Spectral Egi Flare Breath',
      netRegex: NetRegexes.tether({ source: 'Spectral Egi', id: '0054' }),
      netRegexDe: NetRegexes.tether({ source: 'Phantom-Primae', id: '0054' }),
      netRegexFr: NetRegexes.tether({ source: 'Egi Spectral', id: '0054' }),
      netRegexJa: NetRegexes.tether({ source: '幻光の召喚獣', id: '0054' }),
      netRegexCn: NetRegexes.tether({ source: '幻光召唤兽', id: '0054' }),
      netRegexKo: NetRegexes.tether({ source: '환상빛의 소환수', id: '0054' }),
      condition: Conditions.targetIsYou(),
      suppressSeconds: 4,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Point Tether Out',
          de: 'Verbindung nach draußen richten',
          fr: 'Pointez le lien vers l\'extérieur',
          ja: '線を外に引く',
          cn: '连线拉向场外',
          ko: '선 연결 바깥으로 빼기',
        },
      },
    },
    {
      id: 'WOLEx Ultimate Crossover',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '5152', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '5152', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '5152', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '5152', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '光之战士', id: '5152', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '빛의 전사', id: '5152', capture: false }),
      // This is still 1 second before this cast goes off, giving ~7 seconds before LB is needed.
      delaySeconds: 4,
      alarmText: (data, _matches, output) => {
        if (data.role === 'tank')
          return output.text();
      },
      run: (data) => {
        data.isAddPhase = false;
        data.ultimateSeen = true;
      },
      outputStrings: {
        text: {
          en: 'TANK LB!!',
          de: 'TANK LB!!',
          fr: 'LB TANK !!',
          ja: 'タンクLB!!',
          cn: '坦克LB！！',
          ko: '리미트 브레이크!!',
        },
      },
    },
    {
      id: 'WOLEx Spectral Black Mage / White Mage',
      // Twincast tell (after Spectral and Limit, unfortunately).
      netRegex: NetRegexes.startsUsing({ source: 'Spectral Black Mage', id: '4F3D', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Phantom-Schwarzmagier', id: '4F3D', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Mage Noir Spectral', id: '4F3D', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '幻光の黒魔道士', id: '4F3D', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '幻光黑魔法师', id: '4F3D', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '환상빛의 흑마도사', id: '4F3D', capture: false }),
      condition: (data) => data.ultimateSeen && !data.calledSpectral,
      preRun: (data) => data.calledSpectral = true,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Black Mage + White Mage',
          de: 'Schwarzmagier + Weißmagier',
          fr: 'Mage noir + Mage blanc',
          ja: '黒魔導士 + 白魔導士',
          cn: '黑魔法师 + 白魔法师',
          ko: '흑마도사 + 백마도사',
        },
      },
    },
    {
      id: 'WOLEx Summoner / Warrior',
      // Imbued Fire/Ice tell.
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4EF[34]', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4EF[34]', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4EF[34]', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4EF[34]', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '光之战士', id: '4EF[34]', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '빛의 전사', id: '4EF[34]', capture: false }),
      condition: (data) => data.ultimateSeen && !data.calledSpectral,
      preRun: (data) => data.calledSpectral = true,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Summoner + Warrior',
          de: 'Beschwörer + Krieger',
          fr: 'Invocateur + Guerrier',
          ja: '召喚師 + 戦士',
          cn: '召唤师 + 战士',
          ko: '소환사 + 전사',
        },
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
      netRegexCn: NetRegexes.startsUsing({ source: '光之战士', id: '4F43', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '빛의 전사', id: '4F43', capture: false }),
      condition: (data) => data.ultimateSeen && !data.calledSpectral,
      preRun: (data) => data.calledSpectral = true,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Dark Knight + Bard',
          de: 'Dunkelritter + Barde',
          fr: 'Chevalier noir + Barde',
          ja: '暗黒騎士 + 吟遊詩人',
          cn: '暗黑骑士 + 吟游诗人',
          ko: '암흑기사 + 음유시인',
        },
      },
    },
    {
      id: 'WOLEx Spectral Ninja',
      // Imbued Stone/Holy tell.
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4EF[56]', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4EF[56]', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4EF[56]', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4EF[56]', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '光之战士', id: '4EF[56]', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '빛의 전사', id: '4EF[56]', capture: false }),
      condition: (data) => data.ultimateSeen && !data.calledSpectral,
      preRun: (data) => data.calledSpectral = true,
      alertText: (_data, _matches, output) => output.text(),
      run: (data) => {
        data.ninja = true;
      },
      outputStrings: {
        text: {
          en: 'Ninja',
          de: 'Ninja',
          fr: 'Ninja',
          ja: '忍者',
          cn: '忍者',
          ko: '닌자',
        },
      },
    },
    {
      id: 'WOLEx Spectral Tell Cleanup',
      // This is the "go back to the middle" sync that happens after all tells.
      netRegex: NetRegexes.ability({ source: 'Warrior Of Light', id: '4F45', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Krieger Des Lichts', id: '4F45', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Guerrier De La Lumière Primordial', id: '4F45', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'ウォーリア・オブ・ライト', id: '4F45', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '光之战士', id: '4F45', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '빛의 전사', id: '4F45', capture: false }),
      run: (data) => {
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
      netRegexCn: NetRegexes.startsUsing({ source: ['光之战士', '幻光忍者'], id: '4EFD', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: ['빛의 전사', '환상빛의 닌자'], id: '4EFD', capture: false }),
      delaySeconds: 30,
      run: (data) => {
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
      netRegexCn: NetRegexes.startsUsing({ source: ['光之战士', '幻光忍者'], id: '4EFD', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: ['빛의 전사', '환상빛의 닌자'], id: '4EFD', capture: false }),
      delaySeconds: 7,
      response: Responses.knockback(),
    },
    {
      id: 'WOLEx Katon: San',
      netRegex: NetRegexes.headMarker({ id: '00A1', capture: false }),
      condition: (data) => data.ultimateSeen && data.ninja || data.isAddPhase,
      suppressSeconds: 2,
      response: Responses.stackMarker(),
    },
    {
      id: 'WOLEx Perfect Decimation',
      netRegex: NetRegexes.headMarker({ id: '0017' }),
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Warrior Cleave on YOU',
          de: 'Krieger Cleave auf DIR',
          fr: 'Cleave du Guerrier sur VOUS',
          ja: '自分に戦士の範囲攻撃',
          cn: '战士顺劈点名',
          ko: '전사 범위 공격 대상자',
        },
      },
    },
    {
      id: 'WOLEx Brimstone Earth',
      netRegex: NetRegexes.headMarker({ id: '0067' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Puddle on YOU',
          de: 'Fläche auf DIR',
          fr: 'Zone au sol sur VOUS',
          ja: '自分に水溜り',
          cn: '扩散AOE点名',
          ko: '장판 대상자',
        },
      },
    },
    {
      id: 'WOLEx Deluge of Death Marker',
      netRegex: NetRegexes.headMarker({ id: '0057' }),
      condition: (data, matches) => data.ultimateSeen && data.me === matches.target,
      alarmText: (_data, _matches, output) => output.text(),
      run: (data) => {
        data.deluge = true;
      },
      outputStrings: {
        text: {
          en: 'Flare on YOU',
          de: 'Flare auf DIR',
          fr: 'Brasier sur VOUS',
          ja: '自分にフレア',
          cn: '核爆点名',
          ko: '플레어 대상자',
        },
      },
    },
    {
      id: 'WOLEx Absolute Holy',
      netRegex: NetRegexes.headMarker({ id: '00A1' }),
      condition: (data) => !data.deluge && !data.ninja && !data.isAddPhase,
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'WOLEx Coruscant Saber Out',
      // TODO: This once was out + stack ?
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4EF1', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4EF1', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4EF1', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4EF1', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '光之战士', id: '4EF1', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '빛의 전사', id: '4EF1', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'WOLEx Coruscant Saber In',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4EF2', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4EF2', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4EF2', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4EF2', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '光之战士', id: '4EF2', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '빛의 전사', id: '4EF2', capture: false }),
      response: Responses.getIn(),
    },
    {
      id: 'WOLEx Quintuplecast',
      netRegex: NetRegexes.startsUsing({ source: 'Warrior Of Light', id: '4EEF', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Krieger Des Lichts', id: '4EEF', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrier De La Lumière Primordial', id: '4EEF', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ウォーリア・オブ・ライト', id: '4EEF', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '光之战士', id: '4EEF', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '빛의 전사', id: '4EEF', capture: false }),
      run: (data) => {
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
      netRegexCn: NetRegexes.ability({ source: '光之战士', id: '4EEF', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '빛의 전사', id: '4EEF', capture: false }),
      durationSeconds: 18.5,
      infoText: (data, _matches, output) => {
        const strings = data.quintuplecasts.map((key) => output[key]());
        const msg = strings.join(' > ');
        return msg;
      },
      tts: null,
      outputStrings: quintupleOutputStrings,
    },
    {
      id: 'WOLEx Quintuplecast Individual',
      netRegex: NetRegexes.ability({ source: 'Warrior Of Light', id: ['4EEF', '4EF0'], capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Krieger Des Lichts', id: ['4EEF', '4EF0'], capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Guerrier De La Lumière Primordial', id: ['4EEF', '4EF0'], capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'ウォーリア・オブ・ライト', id: ['4EEF', '4EF0'], capture: false }),
      netRegexCn: NetRegexes.ability({ source: '光之战士', id: ['4EEF', '4EF0'], capture: false }),
      netRegexKo: NetRegexes.ability({ source: '빛의 전사', id: ['4EEF', '4EF0'], capture: false }),
      durationSeconds: 3,
      alertText: (data, _matches, output) => {
        const next = data.quintuplecasts.shift();
        // The last cast of 4EF0 will not have a next mechanic to call.
        if (next)
          return output[next]();
      },
      outputStrings: quintupleOutputStrings,
    },
    {
      id: 'WOLEx Quintuplecast Blizzard',
      netRegex: NetRegexes.headMarker({ id: '00E2', capture: false }),
      condition: (data) => data.quintuplecasting,
      durationSeconds: 2,
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => `(${output.blizzard().toLowerCase()})`,
      run: (data) => {
        data.quintuplecasts.push('blizzard');
      },
      outputStrings: {
        blizzard: quintupleOutputStrings.blizzard,
      },
    },
    {
      id: 'WOLEx Quintuplecast Holy',
      netRegex: NetRegexes.headMarker({ id: '00DD', capture: false }),
      condition: (data) => data.quintuplecasting,
      durationSeconds: 2,
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => `(${output.holy().toLowerCase()})`,
      run: (data) => {
        data.quintuplecasts.push('holy');
      },
      outputStrings: {
        holy: quintupleOutputStrings.holy,
      },
    },
    {
      id: 'WOLEx Quintuplecast Stone',
      netRegex: NetRegexes.headMarker({ id: '00DE', capture: false }),
      condition: (data) => data.quintuplecasting,
      durationSeconds: 2,
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => `(${output.stone().toLowerCase()})`,
      run: (data) => {
        data.quintuplecasts.push('stone');
      },
      outputStrings: {
        stone: quintupleOutputStrings.stone,
      },
    },
    {
      id: 'WOLEx Quintuplecast Fire',
      netRegex: NetRegexes.headMarker({ id: '00E4', capture: false }),
      condition: (data) => data.quintuplecasting,
      durationSeconds: 2,
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => `(${output.fire().toLowerCase()})`,
      run: (data) => {
        data.quintuplecasts.push('fire');
      },
      outputStrings: {
        fire: quintupleOutputStrings.fire,
      },
    },
    {
      id: 'WOLEx Quintuplecast Flash',
      netRegex: NetRegexes.headMarker({ id: '00DF', capture: false }),
      condition: (data) => data.quintuplecasting,
      durationSeconds: 2,
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => `(${output.flash().toLowerCase()})`,
      run: (data) => {
        data.quintuplecasts.push('flash');
      },
      outputStrings: {
        flash: quintupleOutputStrings.flash,
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
        '(?<!\\w)Cast': 'Incantation',
        'Cauterize': 'Cautérisation',
        'Coruscant Saber': 'Fureur flamboyante',
        'Deep Darkside': 'Ténèbres intérieures absolues',
        'Deluge Of Death': 'Averse mortelle',
        'Elddragon Dive': 'Piqué du dragon ancien',
        'Fatal Cleave': 'Fendoir fatal',
        'Flare Breath': 'Souffle brasier',
        'Fire/Ice -> SMN/WAR': 'Feu/Glace -> INV/GUE',
        '(?<!\\w )Holy': 'Mirace absolu',
        'Imbued Coruscance': 'Magilame Fureur flamboyante',
        'Imbued Holy': 'Magilame Miracle',
        'Imbued Stone': 'Magilame Méga Terre',
        'Imbued Fire/Blizzard': 'Magilame Méga Feu/Glace',
        'Imbued Fire/Ice': 'Magilame Méga Feu/Glace',
        'Imbued Ice/Fire': 'Magilame Méga Glace/Feu',
        'Katon\\: San': 'Katon : San',
        'Limit Break': 'Transcendance',
        'Limit -> BLM/WHM': 'Transcendance -> MNO/MBL',
        'Limit -> DRK/BRD': 'Transcendance -> CHN/BRD',
        'Meteor Impact': 'Impact de météore',
        'Perfect Decimation': 'Décimation parfaite',
        'Quintuplecast': 'Quintuple sort',
        'Radiant Braver': 'Âme brave flamboyante',
        'Radiant Desperado': 'Desperado flamboyant',
        'Radiant Meteor': 'Météore flamboyant',
        'Shining Wave': 'Épée flamboyante',
        'Solemn Confiteor': 'Confiteor solennel',
        'Specter Of Light': 'Sommation des braves',
        '(?<!\\w )Stone(?! Earth)': 'Méga Terre',
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
        '(?<!Imbued )Fire/Ice': '魔法剣 (火／氷)',
        'Flare Breath': 'フレアブレス',
        'Imbued Coruscance': '魔法剣技：ブライトセイバー',
        'Imbued Fire/Ice': '魔法剣 (火／氷)',
        'Imbued Holy': '魔法剣 (光)',
        'Imbued Ice/Fire': '魔法剣 (氷／火)',
        'Imbued Stone(?!/)': '魔法剣 (土)',
        'Imbued Stone/Holy': '魔法剣 (土/光)',
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
        '(?<!Imbued )Stone/Holy': '魔法剣 (土/光)',
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
    {
      'locale': 'cn',
      'replaceSync': {
        'Spectral Ninja': '幻光忍者',
        'Warrior Of Light': '光之战士',
        'Spectral Dark Knight': '幻光暗黑骑士',
        'Spectral Warrior': '幻光狂战士',
        'Spectral Black Mage': '幻光黑魔法师',
        'Spectral Summoner': '幻光召唤师',
        'Spectral Egi': '幻光召唤兽',
        'Wyrm Of Light': '光之真龙',
        'Spectral Bard': '幻光吟游诗人',
        'Spectral White Mage': '幻光白魔法师',
      },
      'replaceText': {
        'Absolute Flash': '绝对闪光',
        'Absolute Holy': '绝对神圣',
        'Absolute Stone III': '绝对垒石',
        'Berserk': '狂暴',
        'Blade Of Shadow': '漆黑魔剑',
        'BLM/WHM': '黒魔／白魔',
        'Brimstone Earth': '狱火大地',
        '(?<!\\w)Cast(?= )': '五连',
        'Cauterize': '灼热俯冲',
        'Coruscant Saber': '光明利剑',
        'Deep Darkside': '深度暗黑',
        'Deluge Of Death': '死亡暴雨',
        'DRK/BRD': '黑骑／诗人',
        'Elddragon Dive': '远古龙炎冲',
        'Fatal Cleave': '夺命飞环',
        '(?<! )Fire/Ice': '火/冰',
        'Flare Breath': '核爆吐息',
        '(?<! )Holy': '神圣',
        'Imbued Coruscance': '魔法剑技·光明利剑',
        'Imbued Fire/Ice': '魔法剑(火／冰)',
        'Imbued Holy': '魔法剣 (光)',
        'Imbued Ice/Fire': '魔法剣 (冰／火)',
        'Imbued Stone': '魔法剣  (土)',
        'Katon\\: San': '叁式火遁之术',
        '(?<! )Limit(?! Break)': '极限技',
        'Limit Break': '极限技',
        'Meteor Impact': '陨石冲击',
        '(?<= )NIN': '忍者',
        'Perfect Decimation': '完美地毁人亡',
        'Quintuplecast': '五连咏唱',
        'Radiant Braver': '光之勇猛烈斩',
        'Radiant Desperado': '光之亡命暴徒',
        'Radiant Meteor': '光之陨石流星',
        'Shining Wave': '光芒波动',
        'SMN/WAR': '召唤／战士',
        'Solemn Confiteor': '庄严悔罪',
        'Specter Of Light': '幻光召唤',
        '(?<! )Stone(?! Earth)': '飞石',
        'Suiton\\: San': '叁式水遁之术',
        'Summon(?! Wyrm)': '召唤',
        'Summon Wyrm': '真龙召唤',
        'Sword Of Light': '光之剑',
        'Terror Unleashed': '恐惧释放',
        'The Bitter End': '尽灭',
        'To The Limit': '突破极限',
        'Twincast': '合力咏唱',
        'Ultimate Crossover': '究极·交汇',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Warrior Of Light': '빛의 전사',
        'Spectral Bard': '환상빛의 음유시인',
        'Spectral Black Mage': '환상빛의 흑마도사',
        'Spectral Dark Knight': '환상빛의 암흑기사',
        'Spectral Egi': '환상빛의 소환수',
        'Spectral Ninja': '환상빛의 닌자',
        'Spectral Summoner': '환상빛의 소환사',
        'Spectral Warrior': '환상빛의 전사',
        'Spectral White Mage': '환상빛의 백마도사',
        'Wyrm Of Light': '빛의 비룡',
      },
      'replaceText': {
        'Absolute Flash': '앱솔루트 플래시',
        'Absolute Holy': '앱솔루트 홀리',
        'Absolute Stone III': '앱솔루트 스톤가',
        'Berserk': '광폭화',
        'Blade Of Shadow': '칠흑의 마검',
        'BLM/WHM': '흑마／백마',
        'Brimstone Earth': '유황 지대',
        '(?<!\\w)Cast(?= )': '시전',
        'Cauterize': '인두질',
        'Coruscant Saber': '빛나는 도검',
        'Deep Darkside': '진 암흑',
        'Deluge Of Death': '죽음의 화살 폭우',
        'DRK/BRD': '암기／음유',
        'Elddragon Dive': '고룡 강타',
        'Fatal Cleave': '치명적인 참수',
        '(?<! )Fire/Ice': '파이가/블리자가',
        'Flare Breath': '타오르는 숨결',
        '(?<! )Holy': '홀리',
        'Imbued Coruscance': '마법검: 빛나는 도검',
        'Imbued Fire/Ice': '마법검 파이가/블리자가',
        'Imbued Holy': '마법검 홀리',
        'Imbued Ice/Fire': '마법검 블리자가/파이가',
        'Imbued Stone': '마법검 스톤',
        'Katon\\: San': '화둔술 3',
        '(?<! )Limit(?! Break)': '리미트',
        'Limit Break': '리미트 브레이크',
        'Meteor Impact': '운석 낙하',
        '(?<= )NIN': '닌자',
        'Perfect Decimation': '완전 섬멸',
        'Quintuplecast': '오연속 마법',
        'Radiant Braver': '빛나는 브레이버',
        'Radiant Desperado': '빛나는 무법자',
        'Radiant Meteor': '빛나는 메테오',
        'Shining Wave': '찬란한 파동',
        'SMN/WAR': '소환사／전사',
        'Solemn Confiteor': '엄숙한 기도',
        'Specter Of Light': '환상빛 소환',
        '(?<! )Stone(?! Earth)': '스톤',
        'Suiton\\: San': '수둔술 3',
        'Summon(?! Wyrm)': '소환',
        'Summon Wyrm': '비룡 소환',
        'Sword Of Light': '빛의 검',
        'Terror Unleashed': '공포 촉발',
        'The Bitter End': '파국',
        'To The Limit': '리미트 축적',
        'Twincast': '합동 시전',
        'Ultimate Crossover': '궁극의 협력기',
      },
    },
  ],
};
