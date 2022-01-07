import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: Does Mustard Bomb cleave? Should it be tankCleave() instead?

export interface Data extends RaidbossData {
  lastBoss: boolean;
}

const limitCutNumberMap: { [id: string]: number } = {
  '004F': 1,
  '0050': 2,
  '0051': 3,
  '0052': 4,
};

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheStigmaDreamscape,
  timelineFile: 'stigma_dreamscape.txt',
  initData: () => {
    return {
      lastBoss: false,
    };
  },
  triggers: [
    {
      id: 'Dreamscape Side Cannons Left',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6320', source: 'Proto-Omega', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6320', source: 'Proto-Omega', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6320', source: 'Proto-Oméga', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6320', source: 'プロトオメガ', capture: false }),
      response: Responses.goLeft(),
    },
    {
      id: 'Dreamscape Side Cannons Right',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6321', source: 'Proto-Omega', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6321', source: 'Proto-Omega', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6321', source: 'Proto-Oméga', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6321', source: 'プロトオメガ', capture: false }),
      response: Responses.goRight(),
    },
    {
      id: 'Dreamscape Forward Interceptors',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6322', source: 'Proto-Omega', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6322', source: 'Proto-Omega', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6322', source: 'Proto-Oméga', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6322', source: 'プロトオメガ', capture: false }),
      response: Responses.getBehind(),
    },
    {
      id: 'Dreamscape Rear Interceptors',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6324', source: 'Proto-Omega', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6324', source: 'Proto-Omega', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6324', source: 'Proto-Oméga', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6324', source: 'プロトオメガ', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Go front of boss',
          de: 'Geh vor den Boss',
          fr: 'Allez devant le boss',
          cn: '去boss前面',
          ko: '보스 앞으로',
        },
      },
    },
    {
      id: 'Dreamscape Chemical Missile',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '008B' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Dreamscape Electric Slide',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0121' }),
      infoText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.target!();
        return output.allies!({ target: matches.target });
      },
      outputStrings: {
        target: {
          en: 'Stack + Knockback on YOU!',
          de: 'Sammeln + Rückstoß auf DIR!',
          fr: 'Package + Poussée sur VOUS !',
          cn: '分摊 + 击退点名',
          ko: '나에게 쉐어 + 넉백!',
        },
        allies: {
          en: 'Stack + knockback on ${target}',
          de: 'Sammeln + Rückstoß auf ${target}',
          fr: 'Package + Poussée sur ${target}',
          cn: '分摊 + 击退点名 ${target}',
          ko: '${target} 쉐어 + 넉백',
        },
      },
    },
    {
      id: 'Dreamscape Guided Missile',
      type: 'Tether',
      netRegex: NetRegexes.tether({ id: '0011' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Guided Missile on YOU',
          de: 'Geführte Rakete auf DIR',
          fr: 'Missile guidé sur VOUS',
          cn: '导弹点名',
          ko: '나에게 유도 미사일',
        },
      },
    },
    {
      id: 'Dreamscape Mustard Bomb',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '632B', source: 'Proto-Omega' }),
      netRegexDe: NetRegexes.startsUsing({ id: '632B', source: 'Proto-Omega' }),
      netRegexFr: NetRegexes.startsUsing({ id: '632B', source: 'Proto-Oméga' }),
      netRegexJa: NetRegexes.startsUsing({ id: '632B', source: 'プロトオメガ' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'Dreamscape Assault Cannon',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63AB', source: 'Arch-Lambda', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '63AB', source: 'Erz-Lambda', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '63AB', source: 'Arch-Lambda', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '63AB', source: 'アーチラムダ', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get to wall at last dash',
          de: 'Geh zur Wand des letzten Ansturms',
          fr: 'Allez vers le mur après la dernière ruée',
          cn: '靠近最后一次冲锋终点的墙壁',
          ko: '마지막 돌진지점 쪽 벽 끝으로',
        },
      },
    },
    {
      id: 'Dreamscape Sniper Cannon',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: ['004F', '0050', '0051', '0052'] }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, matches, output) => {
        const limitCutNumber = limitCutNumberMap[matches.id];
        return output.text!({ num: limitCutNumber });
      },
      outputStrings: {
        text: {
          en: '#${num} laser on YOU!',
          de: '#${num} Laser auf DIR!',
          fr: '#${num} Laser sur VOUS !',
          cn: '激光点名 #${num}',
          ko: '나에게 ${num}번 레이저!',
        },
      },
    },
    {
      id: 'Dreamscape Wheel',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63B5', source: 'Arch-Lambda' }),
      netRegexDe: NetRegexes.startsUsing({ id: '63B5', source: 'Erz-Lambda' }),
      netRegexFr: NetRegexes.startsUsing({ id: '63B5', source: 'Arch-Lambda' }),
      netRegexJa: NetRegexes.startsUsing({ id: '63B5', source: 'アーチラムダ' }),
      response: Responses.tankBuster(),
    },
    {
      // Dragons spawn outside the last boss, but those ones don't matter.
      // Ensure that we don't say anything until the player has engaged the last boss.
      // 6435 is Plasmafodder, Stigma-4's auto-attack.
      id: 'Dreamscape Last Boss',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6435', source: 'Stigma-4', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '6435', source: 'Stigma-4', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '6435', source: 'Stigma-4', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '6435', source: 'スティグマ・フォー', capture: false }),
      run: (data) => data.lastBoss = true,
    },
    {
      id: 'Dreamscape Atomic Flame',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63B4', source: 'Arch-Lambda', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '63B4', source: 'Erz-Lambda', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '63B4', source: 'Arch-Lambda', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '63B4', source: 'アーチラムダ', capture: false }),
      response: Responses.aoe(),
    },
    {
      // The Hybrid Dragon add uses Touchdown after spawning,
      // then immediately begins casting Fire Breath in a cone across the arena.
      // If the player is not already in motion by the time Fire Breath begins,
      // they are likely to be hit.
      id: 'Dreamscape Touchdown',
      type: 'AddedCombatant',
      netRegex: NetRegexes.addedCombatantFull({ name: 'Hybrid Dragon' }),
      netRegexDe: NetRegexes.addedCombatantFull({ name: 'Hybrid-Drache' }),
      netRegexFr: NetRegexes.addedCombatantFull({ name: 'Dragon Hybride' }),
      netRegexJa: NetRegexes.addedCombatantFull({ name: 'ハイブリッドドラゴン' }),
      condition: (data) => data.lastBoss,
      infoText: (_data, matches, output) => {
        // The arena is a 50x50 square, with (0,0) in the exact center.
        const isEast = parseFloat(matches.x) > 0;
        if (isEast)
          return output.east!();
        return output.west!();
      },
      outputStrings: {
        east: Outputs.east,
        west: Outputs.west,
      },
    },
    {
      id: 'Dreamscape Rush',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '642D', source: 'Proto-rocket Punch', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '642D', source: 'Proto-Raketenschlag', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '642D', source: 'Proto-Astéropoing', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '642D', source: 'プロトロケットパンチ', capture: false }),
      suppressSeconds: 5, // All five Punches use it at the same time
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Avoid side dashes',
          de: 'Weiche den Anstürmen von der Seite aus',
          fr: 'Évitez les ruées sur les côtés',
          cn: '躲避两侧冲锋',
          ko: '옆쪽의 주먹 피하기',
        },
      },
    },
    {
      id: 'Dreamscape Electromagnetic Release Circle',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6434', source: 'Stigma-4' }),
      netRegexDe: NetRegexes.startsUsing({ id: '6434', source: 'Stigma-4' }),
      netRegexFr: NetRegexes.startsUsing({ id: '6434', source: 'Stigma-4' }),
      netRegexJa: NetRegexes.startsUsing({ id: '6434', source: 'スティグマ・フォー' }),
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 4, // Full cast is 9.7s.
      response: Responses.getOut(),
    },
    {
      id: 'Dreamscape Electromagnetic Release Donut',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6432', source: 'Stigma-4' }),
      netRegexDe: NetRegexes.startsUsing({ id: '6432', source: 'Stigma-4' }),
      netRegexFr: NetRegexes.startsUsing({ id: '6432', source: 'Stigma-4' }),
      netRegexJa: NetRegexes.startsUsing({ id: '6432', source: 'スティグマ・フォー' }),
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 4, // Full cast is 9.7s.
      response: Responses.getIn(),
    },
    {
      id: 'Dreamscape Proto-wave Cannons Left',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '642A', source: 'Omega Frame', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '642A', source: 'Omega-Chassis', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '642A', source: 'Châssis Expérimental Oméga', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '642A', source: 'オメガフレーム', capture: false }),
      response: Responses.goLeft(),
    },
    {
      id: 'Dreamscape Proto-wave Cannons Right',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '642B', source: 'Omega Frame', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '642B', source: 'Omega-Chassis', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '642B', source: 'Châssis Expérimental Oméga', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '642B', source: 'オメガフレーム', capture: false }),
      response: Responses.goRight(),
    },
    {
      id: 'Dreamscape Forward March',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '7A6' }),
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Mindhack: Forward',
          de: 'Geistlenkung: Vorwärts',
          fr: 'Piratage mental : Avant',
          cn: '强制移动 : 前',
          ko: '강제이동: 앞',
        },
      },
    },
    {
      id: 'Dreamscape About Face',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '7A7' }),
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Mindhack: Back',
          de: 'Geistlenkung: Rückwärts',
          fr: 'Piratage mental : Arrière',
          cn: '强制移动 : 后',
          ko: '강제이동: 뒤',
        },
      },
    },
    {
      id: 'Dreamscape Left Face',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '7A8' }),
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Mindhack: Left',
          de: 'Geistlenkung: Links',
          fr: 'Piratage mental : Gauche',
          cn: '强制移动 : 左',
          ko: '강제이동: 왼쪽',
        },
      },
    },
    {
      id: 'Dreamscape Right Face',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '7A9' }),
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Mindhack: Right',
          de: 'Geistlenkung: Rechts',
          fr: 'Piratage mental : Droite',
          cn: '强制移动 : 右',
          ko: '강제이동: 오른쪽',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'A-4 Command': 'Kommando A4',
        'A-4 Conquest': 'Operation A4',
        'A-4 Headquarters': 'Hauptquartier A4',
        'Arch-Lambda': 'Erz-Lambda',
        'Hybrid Dragon': 'Hybrid-Drache',
        'Mark II Guided Missile': 'Lenkrakete II',
        'Omega Frame': 'Omega-Chassis',
        'Proto-Omega': 'Proto-Omega',
        'Proto-rocket Punch': 'Proto-Raketenschlag',
        'Stigma-4': 'Stigma-4',
      },
      'replaceText': {
        '(?<!Multi-)AI Takeover': 'Plan B',
        'Atomic Flame': 'Atomare Flamme',
        'Atomic Ray': 'Atomstrahlung',
        'Auto-mobile Assault Cannon': 'Wellengeschütz „Sturm”',
        'Auto-mobile Sniper Cannon': 'Wellengeschütz „Pfeil”',
        'Burn': 'Verbrennung',
        'Chemical Missile': 'Napalmrakete',
        'Electric Slide': 'Elektrosturz',
        'Electromagnetic Release': 'Elektromagnetische Entladung',
        'Entrench': 'Manöver „Sturm”',
        'Fire Breath': 'Feueratem',
        'Forward Interceptors': 'Frontale Abfangrakete',
        'Guided Missile': 'Lenkraketen',
        'Iron Kiss': 'Eiserner Kuss',
        'Mindhack': 'Hirnsonde',
        'Multi-AI Takeover': 'Gebündelte Kräfte',
        'Mustard Bomb': 'Senfbombe',
        'Proto-wave Cannon': 'Experimentelles Wellengeschütz',
        'Rear Interceptors': 'Rückwärtige Abfangrakete',
        'Rush': 'Stürmen',
        'Self-Destruct': 'Selbstzerstörung',
        'Side Cannons': 'Seitliche Maschinenkanone',
        'Touchdown': 'Aufsetzer',
        'Tread': 'Angriffsmanöver Alpha',
        '(?<!Proto-)Wave Cannon': 'Wellengeschütz',
        'Wheel': 'Rad',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'A-4 Command': 'Poste de commandement A-4',
        'A-4 Conquest': 'Conquête A-4',
        'A-4 Headquarters': 'Quartier général A-4',
        'Arch-Lambda': 'Arch-Lambda',
        'Hybrid Dragon': 'dragon hybride',
        'Mark II Guided Missile': 'missile autoguidé v2',
        'Omega Frame': 'châssis expérimental Oméga',
        'Proto-Omega': 'Proto-Oméga',
        'Proto-rocket Punch': 'proto-astéropoing',
        'Stigma-4': 'Stigma-4',
      },
      'replaceText': {
        '\\?': ' ?',
        '(?<!Multi-)AI Takeover': 'Appel de renforts',
        'Atomic Flame': 'Flammes atomiques',
        'Atomic Ray': 'Rayon atomique',
        'Auto-mobile Assault Cannon': 'Assaut plasmique',
        'Auto-mobile Sniper Cannon': 'Canon plasma longue portée',
        'Burn': 'Combustion',
        'Chemical Missile': 'Missile au napalm',
        'Electric Slide': 'Glissement Oméga',
        'Electromagnetic Release': 'Décharge électromagnétique',
        'Entrench': 'Manœuvre d\'assaut violent',
        'Fire Breath': 'Souffle enflammé',
        'Forward Interceptors': 'Contre-salve avant',
        'Guided Missile': 'Missile à tête chercheuse',
        'Iron Kiss': 'Impact de missile',
        'Mindhack': 'Piratage mental',
        'Multi-AI Takeover': 'Appel de renforts polyvalents',
        'Mustard Bomb': 'Obus d\'ypérite',
        'Proto-wave Cannon': 'Canon plasma expérimental',
        'Rear Interceptors': 'Contre-salve arrière',
        'Rush': 'Ruée',
        'Self-Destruct': 'Auto-destruction',
        'Side Cannons': 'Salve d\'obus latérale',
        'Touchdown': 'Atterrissage',
        'Tread': 'Manœuvre d\'assaut',
        '(?<!Proto-)Wave Cannon': 'Canon plasma',
        'Wheel': 'Roue',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'A-4 Command': 'コマンドA4',
        'A-4 Conquest': 'コンクエストA4',
        'A-4 Headquarters': 'ヘッドクォーターA4',
        'Arch-Lambda': 'アーチラムダ',
        'Hybrid Dragon': 'ハイブリッドドラゴン',
        'Mark II Guided Missile': 'ガイデッドミサイルII',
        'Omega Frame': 'オメガフレーム',
        'Proto-Omega': 'プロトオメガ',
        'Proto-rocket Punch': 'プロトロケットパンチ',
        'Stigma-4': 'スティグマ・フォー',
      },
      'replaceText': {
        '(?<!Multi-)AI Takeover': '支援要請',
        'Atomic Flame': 'アトミックフレイム',
        'Atomic Ray': 'アトミックレイ',
        'Auto-mobile Assault Cannon': '強襲式波動砲',
        'Auto-mobile Sniper Cannon': '狙撃式波動砲',
        'Burn': '燃焼',
        'Chemical Missile': 'ナパームミサイル',
        'Electric Slide': 'オメガスライド',
        'Electromagnetic Release': '電磁放射',
        'Entrench': '強襲機動',
        'Fire Breath': 'ファイアブレス',
        'Forward Interceptors': '前方迎撃ロケット',
        'Guided Missile': '誘導ミサイル',
        'Iron Kiss': '着弾',
        'Mindhack': 'ブレインハック',
        'Multi-AI Takeover': '複合支援要請',
        'Mustard Bomb': 'マスタードボム',
        'Proto-wave Cannon': '試作型波動砲',
        'Rear Interceptors': '後方迎撃ロケット',
        'Rush': '突進',
        'Self-Destruct': '自爆',
        'Side Cannons': '側面機関砲',
        'Touchdown': 'タッチダウン',
        'Tread': '突撃機動',
        '(?<!Proto-)Wave Cannon': '波動砲',
        'Wheel': 'ホイール',
      },
    },
  ],
};

export default triggerSet;
