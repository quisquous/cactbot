import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  phase: number;
  grabbed: string[];
  stickyloom?: string;
}

// TODO: stun call for True Heart sprint ability?

// TODO: can we figure out jails from the location of the tethering gobbie?
// TODO: you can figure out who it is from who the bomb is on, but 8 blu <_<
// Red jail can stay up forever.  The same color can be in different spots.
// Is it possible that for each jail phase, each color is in the same spot?
// One data point:
//   Jail 1: purple(NE), red (NW), green (SE), white (NE)
//   Jail 2: red(NW), green (SW), white (SW), purple (NW)
//   Jail 3: green (NE), purple (SE), red (SW), white (SE)
//   * in this example jail 1 red persisted through jail 1 green/white, but jail 2 red did not.
// Alarums and Lumbertype Magitek get added too late to be useful.

// Timeline:
// Jail 1:
//   Option 1: (bomb on healer)
//     green tether / white prey
//     purple tether / red prey
//   Option 2: (bomb on melee)
//     purple tether / red prey
//     green tether / white prey
// Cat Phase 1
// Jail 2:
//   Option 1: (bomb on healer)
//     red tether / green prey
//     white tether / purple prey
//   Option 2: (bomb on ranged/caster)
//     white tether / purple prey
//     red tether / green prey
// Hammertime
// Cat Phase 2
// Jail 3:
//   Option 1: (2x bombs)
//     green tether / purple prey
//     red tether / white prey
//   Option 2: (sizzlebeam on OT)
//     red tether / white prey
//     green tether / purple prey

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.AlexanderTheArmOfTheSonSavage,
  timelineNeedsFixing: true,
  timelineFile: 'a7s.txt',
  initData: () => {
    return {
      phase: 0,
      grabbed: [],
    };
  },
  triggers: [
    {
      id: 'A7S Phase Counter',
      type: 'AddedCombatant',
      netRegex: NetRegexes.addedCombatant({ name: 'Shanoa', capture: false }),
      netRegexDe: NetRegexes.addedCombatant({ name: 'Schwarz(?:e|er|es|en) Katze', capture: false }),
      netRegexFr: NetRegexes.addedCombatant({ name: 'Chat-Noir', capture: false }),
      netRegexJa: NetRegexes.addedCombatant({ name: 'シャノア', capture: false }),
      netRegexCn: NetRegexes.addedCombatant({ name: '夏诺雅', capture: false }),
      netRegexKo: NetRegexes.addedCombatant({ name: '샤노아', capture: false }),
      run: (data) => data.phase++,
    },
    {
      id: 'A7S Sizzlebeam',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0018' }),
      alertText: (data, matches, output) => {
        if (matches.target === data.me)
          return output.sizzlebeamOnYou!();
      },
      infoText: (data, matches, output) => {
        if (matches.target !== data.me)
          return output.sizzlebeamOn!({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        sizzlebeamOn: {
          en: 'Sizzlebeam on ${player}',
          de: 'Gobpartikelstrahl auf ${player}',
          fr: 'Gobrayon sur ${player}',
          ja: '${player}にゴブ式波動砲',
          cn: '波动炮点${player}',
          ko: '"${player}" 고블린식 파동포',
        },
        sizzlebeamOnYou: {
          en: 'Sizzlebeam on YOU',
          de: 'Gobpartikelstrahl auf DIR',
          fr: 'Gobrayon sur VOUS',
          ja: '自分にゴブ式波動砲',
          cn: '波动炮点名',
          ko: '고블린식 파동포 대상자',
        },
      },
    },
    {
      id: 'A7S Sizzlespark',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Quickthinx Allthoughts', id: '16F8', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Denkfix', id: '16F8', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Quickthinx Le Cerveau', id: '16F8', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '万能のクイックシンクス', id: '16F8', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '万事通 奎克辛克斯', id: '16F8', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '만능의 퀵싱크스', id: '16F8', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'A7S Bomb Tether',
      type: 'Tether',
      netRegex: NetRegexes.tether({ source: 'Bomb', id: '001F' }),
      netRegexDe: NetRegexes.tether({ source: 'Bombe', id: '001F' }),
      netRegexFr: NetRegexes.tether({ source: 'Bombe', id: '001F' }),
      netRegexJa: NetRegexes.tether({ source: '爆弾', id: '001F' }),
      netRegexCn: NetRegexes.tether({ source: '炸弹', id: '001F' }),
      netRegexKo: NetRegexes.tether({ source: '폭탄', id: '001F' }),
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Bomb Spread',
          de: 'Bomben verteilen',
          fr: 'Bombe, dispersez-vous',
          ja: '爆弾、散開',
          cn: '炸弹，散开',
          ko: '폭탄 뿌리기',
        },
      },
    },
    {
      id: 'A7S Jail Prey',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0029' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Jail Prey',
          de: 'Gefängnis Markierung',
          fr: 'Marquage prison',
          ja: '隔離部屋',
          cn: '监狱点名',
          ko: '감옥 징 대상자',
        },
      },
    },
    {
      id: 'A7S Jail Tether',
      type: 'Tether',
      // This does not include the initial tether, unfortunately.
      // This is another case of "added combatant with initial tether".
      netRegex: NetRegexes.tether({ source: 'Boomtype Magitek Gobwalker G-VII', id: '0011' }),
      netRegexDe: NetRegexes.tether({ source: 'Gob-Stampfer VII-L', id: '0011' }),
      netRegexFr: NetRegexes.tether({ source: 'gobblindé magitek G-VII Lamineur', id: '0011' }),
      netRegexJa: NetRegexes.tether({ source: 'VII号ゴブリウォーカーL型', id: '0011' }),
      netRegexCn: NetRegexes.tether({ source: '7号哥布林战车L型', id: '0011' }),
      netRegexKo: NetRegexes.tether({ source: 'VII호 고블린워커 L형', id: '0011' }),
      condition: Conditions.targetIsYou(),
      suppressSeconds: 10,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Jail Tether',
          de: 'Gefängnis Verbindung',
          fr: 'Lien prison',
          ja: '隔離部屋線',
          cn: '监狱连线',
          ko: '감옥 줄 대상자',
        },
      },
    },
    {
      id: 'A7S Kugelblitz',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Sturm Doll', id: '16FE' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Sturmpuppe', id: '16FE' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Poupée Sturm', id: '16FE' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シュツルムドール', id: '16FE' }),
      netRegexCn: NetRegexes.startsUsing({ source: '风暴人偶', id: '16FE' }),
      netRegexKo: NetRegexes.startsUsing({ source: '인형 폭기병', id: '16FE' }),
      condition: (data) => data.CanStun(),
      response: Responses.stun(),
    },
    {
      id: 'A7S Zoomdoom Clear',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Quickthinx Allthoughts', id: '16F4', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Denkfix', id: '16F4', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Quickthinx Le Cerveau', id: '16F4', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '万能のクイックシンクス', id: '16F4', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '万事通 奎克辛克斯', id: '16F4', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '만능의 퀵싱크스', id: '16F4', capture: false }),
      run: (data) => {
        data.grabbed = [];
        delete data.stickyloom;
      },
    },
    {
      id: 'A7S Gobbie Grab',
      type: 'Ability',
      netRegex: NetRegexes.ability({ source: 'Quickthinx Allthoughts', id: '15C0' }),
      netRegexDe: NetRegexes.ability({ source: 'Denkfix', id: '15C0' }),
      netRegexFr: NetRegexes.ability({ source: 'Quickthinx Le Cerveau', id: '15C0' }),
      netRegexJa: NetRegexes.ability({ source: '万能のクイックシンクス', id: '15C0' }),
      netRegexCn: NetRegexes.ability({ source: '万事通 奎克辛克斯', id: '15C0' }),
      netRegexKo: NetRegexes.ability({ source: '만능의 퀵싱크스', id: '15C0' }),
      run: (data, matches) => data.grabbed.push(matches.target),
    },
    {
      id: 'A7S Stickyloom',
      type: 'Ability',
      netRegex: NetRegexes.ability({ source: 'Boomtype Magitek Gobwalker G-VII', id: '16F2' }),
      netRegexDe: NetRegexes.ability({ source: 'Gob-Stampfer VII-L', id: '16F2' }),
      netRegexFr: NetRegexes.ability({ source: 'gobblindé magitek G-VII Lamineur', id: '16F2' }),
      netRegexJa: NetRegexes.ability({ source: 'VII号ゴブリウォーカーL型', id: '16F2' }),
      netRegexCn: NetRegexes.ability({ source: '7号哥布林战车L型', id: '16F2' }),
      netRegexKo: NetRegexes.ability({ source: 'VII호 고블린워커 L형', id: '16F2' }),
      run: (data, matches) => data.stickyloom = matches.target,
    },
    {
      id: 'A7S Padlock',
      type: 'AddedCombatant',
      netRegex: NetRegexes.addedCombatant({ name: 'Padlock', capture: false }),
      netRegexDe: NetRegexes.addedCombatant({ name: 'Vorhängeschloss', capture: false }),
      netRegexFr: NetRegexes.addedCombatant({ name: 'Cadenas', capture: false }),
      netRegexJa: NetRegexes.addedCombatant({ name: '錠前', capture: false }),
      netRegexCn: NetRegexes.addedCombatant({ name: '牢门的锁', capture: false }),
      netRegexKo: NetRegexes.addedCombatant({ name: '자물쇠', capture: false }),
      condition: (data) => {
        if (!data.grabbed)
          return false;
        // If you're not in a jail, kill the padlock.
        return !data.grabbed.includes(data.me) && data.stickyloom !== data.me;
      },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Break Padlock',
          de: 'Schloss zerstören',
          fr: 'Cassez le cadenas',
          ja: '錠前を破れ',
          cn: '打破锁',
          ko: '자물쇠 부수기',
        },
      },
    },
    {
      id: 'A7S True Heart',
      type: 'Ability',
      netRegex: NetRegexes.ability({ source: 'Shanoa', id: '15EC', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Schwarz(?:e|er|es|en) Katze', id: '15EC', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Chat-Noir', id: '15EC', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'シャノア', id: '15EC', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '夏诺雅', id: '15EC', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '샤노아', id: '15EC', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Kill Heart',
          de: 'Herz besiegen',
          fr: 'Tuez le cœur',
          ja: '真心を倒す',
          cn: '击杀真心',
          ko: '진심 없애기',
        },
      },
    },
    {
      id: 'A7S Searing Wind',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '178' }),
      condition: Conditions.targetIsYou(),
      alarmText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Searing Wind on YOU',
          de: 'Versengen auf DIR',
          fr: 'Fournaise sur VOUS',
          ja: '自分に灼熱',
          cn: '热风点名',
          ko: '뜨거운 바람 대상자',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'missingTranslations': true,
      'replaceSync': {
        'Bomb': 'Bombe',
        'Boomtype Magitek Gobwalker G-VII': 'Gob-Stampfer VII-L',
        'Padlock': 'Vorhängeschloss',
        'Quickthinx Allthoughts': 'Denkfix',
        'Shanoa': 'Schwarz(?:e|er|es|en) Katze',
        'Sturm Doll': 'Sturmpuppe',
      },
      'replaceText': {
        'Big Doll': 'Große Puppe',
        'Bomb(?!(s|en))': 'Bombe',
        'Bombs': 'Bomben',
        '(?<! )Doll': 'Puppe',
        'Flamethrower': 'Flammenwerfer',
        'Hammertime': 'Hammertime',
        'Jails': 'Gefängnisse',
        'Get Prey': 'Markierung hohlen',
        'Get Tether': 'Verbindung hohlen',
        'Kill Heart': 'Herz besiegen',
        'Resync': 'Resync',
        'Sizzlebeam': 'Gobpartikelstrahl',
        'Sizzlespark': 'Brutzelblitz',
        'Small Doll(?!s)': 'kleine Puppe',
        'Small Dolls': 'kleine Puppen',
        'Stun Heart': 'Herz unterbrechen',
        'Uplander Doom': 'Knallregen',
        'Zoomdoom': 'Gobrakete',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Bomb': 'bombe',
        'Boomtype Magitek Gobwalker G-VII': 'gobblindé magitek G-VII Lamineur',
        'electrocution gallery': 'square d\'exécution publique',
        'Padlock': 'cadenas',
        'Quickthinx Allthoughts': 'Quickthinx le Cerveau',
        'Shanoa': 'Chat-noir',
        'Sturm Doll': 'poupée sturm',
      },
      'replaceText': {
        'Bomb': 'Bombe',
        'Flamethrower': 'Lance-flammes',
        'Sizzlebeam': 'Gobrayon',
        'Sizzlespark': 'Gobétincelle',
        'Uplander Doom': 'Fusillade',
        'Zoomdoom': 'Gobroquette',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Bomb': '爆弾',
        'Boomtype Magitek Gobwalker G-VII': 'VII号ゴブリウォーカーL型',
        'Electrocution gallery': '公開処刑広場',
        'Frostbite': '凍傷',
        'Padlock': '錠前',
        'Pyretic': 'ヒート',
        'Quickthinx Allthoughts': '万能のクイックシンクス',
        'Shanoa': 'シャノア',
        'Sturm Doll': 'シュツルムドール',
      },
      'replaceText': {
        'Big Doll': '大きいドール',
        'Bomb(?!s)': '爆弾',
        'Bombs': '爆弾',
        '(?<! )Doll': 'ドール',
        'Flamethrower': 'フレイムスロアー',
        'Hammertime': 'オシオキ',
        'Jails': '隔離部屋',
        'Get Prey': 'マーキングを取る',
        'Get Tether': '線を取る',
        'Kill Heart': '真心を倒す',
        'Resync': 'シンク',
        'Sizzlebeam': 'ゴブ式波動砲',
        'Sizzlespark': 'ゴブリスパーク',
        'Small Doll(?!s)': '小さいドール',
        'Small Dolls': '小さいドール',
        'Stun Heart': 'スタン: 真心',
        'Uplander Doom': '一斉射撃',
        'Zoomdoom': 'ゴブロケット',
      },
    },
    {
      'locale': 'cn',
      'missingTranslations': true,
      'replaceSync': {
        'Bomb': '炸弹',
        'Boomtype Magitek Gobwalker G-VII': 'VII호 고블린워커 L형',
        'Padlock': '牢门的锁',
        'Quickthinx Allthoughts': '万事通 奎克辛克斯',
        'Shanoa': '夏诺雅',
        'Sturm Doll': '风暴人偶',
      },
      'replaceText': {
        'Big Doll': '大人偶',
        'Bomb(?!(s|en))': '炸弹',
        'Bombs': '炸弹',
        '(?<! )Doll': '人偶',
        'Flamethrower': '火焰喷射器',
        'Hammertime': '惩戒',
        'Jails': '监狱',
        'Get Prey': '监狱点名',
        'Get Tether': '监狱连线',
        'Kill Heart': '击杀真心',
        'Resync': '重新同步',
        'Sizzlebeam': '哥布式波动炮',
        'Sizzlespark': '哥布林火花',
        'Small Doll(?!s)': '小人偶',
        'Small Dolls': '小人偶',
        'Stun Heart': '击晕真心',
        'Uplander Doom': '齐射',
        'Zoomdoom': '哥布火箭',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {
        'Bomb': '폭탄',
        'Boomtype Magitek Gobwalker G-VII': '7号哥布林战车L型',
        'Padlock': '자물쇠',
        'Quickthinx Allthoughts': '만능의 퀵싱크스',
        'Shanoa': '샤노아',
        'Sturm Doll': '인형 폭기병',
        'Electrocution Gallery': '공개처형 광장',
        'Pyretic': '열병',
      },
      'replaceText': {
        'Big Doll': '큰 인형',
        'Bomb(?!s)': '폭탄',
        'Bombs': '폭탄',
        '(?<! )Doll': '인형',
        'Flamethrower': '화염 방사',
        'Get Prey': '인형뽑기',
        'Get Tether': '밧줄',
        'Hammertime': '장판',
        'Jails': '감옥',
        'Kill Heart': '진심 없애기',
        'Small Doll(?!s)': '작은 인형',
        'Small Dolls': '작은 인형',
        'Sizzlebeam': '고블린식 파동포',
        'Sizzlespark': '고블린 불꽃',
        'Stun Heart': '진심 기절시키기',
        'Uplander Doom': '일제 사격',
        'Zoomdoom': '고블린 로켓',
      },
    },
  ],
};

export default triggerSet;
