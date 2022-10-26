// TODO: maybe this should be structured identically to a timelineReplace section.

import { Lang, NonEnLang } from '../../resources/languages';

// The seal key is kind of a hack because we use it in a lot of different
// contexts and need to correctly grab the name of the zone that is sealed.
// These are some various lookbehinds for those different contexts:

// Regexes for a parsed ACT log line
const parsedLB = '00:0839::';
// Regexes for a network log line
const networkLB = '00\\|[^|]*\\|0839\\|\\|';
// Regex for a regex for a network log line.  <_<
const netRegexLB = '\\\\\\|0839\\\\\\|\\[\\^\\|\\]\\*\\\\\\|';
// A bare parameter (e.g. `X will be sealed off` via `netRegex: { line: 'X will be sealed off' },`)
const paramLB = '^';

// It's awkward to refer to these string keys, so name them as replaceSync[keys.sealKey].
export const syncKeys = {
  // Seal is trying to match these types of lines, and is more complicated because it's
  // trying to also capture the area name:
  //   parsed log lines: 00:0839::Something will be sealed off
  //   network log lines: 00|timestamp|0839||Something will be sealed off
  //   NetRegexes: ^^00\|[^|]*\|0839\|[^|]*\|Something will be sealed off.*?\|
  seal:
    `(?<=${parsedLB}|${networkLB}|${netRegexLB}|${paramLB})([^|]*) will be sealed off(?: in (?:[0-9]+ seconds)?)?`,
  unseal: 'is no longer sealed',
  engage: 'Engage!',
};

const textKeys = {
  // Match directions in replaceText
  // eg: `(N)`, `(SW)`, `(NE/NW)`, etc.
  E: '(?<= \\(|\\/)E(?=\\)|\\/)',
  N: '(?<= \\(|\\/)N(?=\\)|\\/)',
  S: '(?<= \\(|\\/)S(?=\\)|\\/)',
  W: '(?<= \\(|\\/)W(?=\\)|\\/)',
  NE: '(?<= \\(|\\/)NE(?=\\)|\\/)',
  NW: '(?<= \\(|\\/)NW(?=\\)|\\/)',
  SE: '(?<= \\(|\\/)SE(?=\\)|\\/)',
  SW: '(?<= \\(|\\/)SW(?=\\)|\\/)',
  // Match Roles in replaceText
  // eg: `(Tank)`, `(Healer)`, `(DPS)`, etc
  Tank: '(?<= \\(|\\/)Tanks?(?=\\)|\\/)',
  Healer: '(?<= \\(|\\/)Healers?(?=\\)|\\/)',
  DPS: '(?<= \\(|\\/)DPS(?=\\)|\\/)',
  // Match `--1--` style text.
  Number: '--(\\s*\\d+\\s*)--',
};

export type CommonReplacement = {
  replaceSync: {
    [replaceKey: string]: { [key in Lang]?: string };
  };
  replaceText: {
    [replaceKey: string]:
      & {
        [key in NonEnLang]?: string;
      }
      & {
        // don't set this key, but allow us to ask if it exists
        en?: never;
      };
  };
};

export const commonReplacement: CommonReplacement = {
  replaceSync: {
    [syncKeys.seal]: {
      en: '$1 will be sealed off',
      de:
        'Noch 15 Sekunden, bis sich (?:(?:der|die|das) )?(?:Zugang zu(?:[rm]| den)? )?$1 schließt',
      fr: 'Fermeture d(?:e|u|es) (?:l\'|la |les? )?$1 dans',
      ja: '$1の封鎖まであと',
      cn: '距$1被封锁还有',
      ko: '15초 후에 $1[이가] 봉쇄됩니다',
    },
    [syncKeys.unseal]: {
      en: 'is no longer sealed',
      de: 'öffnet sich (?:wieder|erneut)',
      fr: 'Ouverture ',
      ja: 'の封鎖が解かれた',
      cn: '的封锁解除了',
      ko: '의 봉쇄가 해제되었습니다',
    },
    [syncKeys.engage]: {
      en: 'Engage!',
      de: 'Start!',
      fr: 'À l\'attaque',
      ja: '戦闘開始！',
      cn: '战斗开始！',
      ko: '전투 시작!',
    },
  },
  replaceText: {
    '--adds spawn--': {
      de: '--Adds erscheinen--',
      fr: '--Apparition d\'adds--',
      ja: '--雑魚出現--',
      cn: '--小怪出现--',
      ko: '--쫄 소환--',
    },
    '--adds targetable--': {
      de: '--Adds anvisierbar--',
      fr: '--Adds ciblables--',
      ja: '--雑魚ターゲット可能--',
      cn: '--小怪可选中--',
      ko: '--쫄 타겟 가능--',
    },
    '--center--': {
      de: '--Mitte--',
      fr: '--Centre--',
      ja: '--センター--',
      cn: '--中央--',
      ko: '--중앙--',
    },
    '\\(center\\)': {
      de: '(Mitte)',
      fr: '(Centre)',
      ja: '(センター)',
      cn: '(中央)',
      ko: '(중앙)',
    },
    '--clones appear--': {
      de: '--Klone erscheinen--',
      fr: '--Apparition des clones--',
      ja: '--幻影出現--',
      cn: '--幻影出现--',
      ko: '--분신 소환--',
    },
    '--corner--': {
      de: '--Ecke--',
      fr: '--Coin--',
      ja: '--コーナー--',
      cn: '--角落--',
      ko: '--구석--',
    },
    '--dps burn--': {
      de: '--DPS burn--',
      fr: '--Burn dps--',
      ja: '--火力出せ--',
      cn: '--转火--',
      ko: '--딜 체크--',
    },
    '--east--': {
      de: '--Osten--',
      fr: '--Est--',
      ja: '--東--',
      cn: '--东--',
      ko: '--동쪽--',
    },
    '\\(east\\)': {
      de: '(Osten)',
      fr: '(Est)',
      ja: '(東)',
      cn: '(东)',
      ko: '(동쪽)',
    },
    'Enrage': {
      de: 'Finalangriff',
      fr: 'Enrage',
      ja: '時間切れ',
      cn: '狂暴',
      ko: '전멸기',
    },
    '--frozen--': {
      de: '--eingefroren--',
      fr: '--Gelé--',
      ja: '--凍結--',
      cn: '--冻结--',
      ko: '--빙결--',
    },
    '--in--': {
      de: '--Rein--',
      fr: '--Intérieur--',
      ja: '--中--',
      cn: '--内--',
      ko: '--안--',
    },
    '\\(In\\)': {
      de: '(Rein)',
      fr: '(Intérieur)',
      ja: '(中)',
      cn: '(内)',
      ko: '(안)',
    },
    '\\(inner\\)': {
      de: '(innen)',
      fr: '(intérieur)',
      ja: '(中)',
      cn: '(内)',
      ko: '(안)',
    },
    '--jump--': {
      de: '--Sprung--',
      fr: '--Saut--',
      ja: '--ジャンプ--',
      cn: '--跳--',
      ko: '--점프--',
    },
    '--knockback--': {
      de: '--Rückstoß--',
      fr: '--Poussée--',
      ja: '--ノックバック--',
      cn: '--击退--',
      ko: '--넉백--',
    },
    '--middle--': {
      de: '--Mitte--',
      fr: '--Milieu--',
      ja: '--中央--',
      cn: '--中间--',
      ko: '--중앙--',
    },
    '\\(middle\\)': {
      de: '(Mitte)',
      fr: '(Milieu)',
      ja: '(中央)',
      cn: '(中间)',
      ko: '(중앙)',
    },
    '--north--': {
      de: '--Norden--',
      fr: '--Nord--',
      ja: '--北--',
      cn: '--北--',
      ko: '--북쪽--',
    },
    '\\(north\\)': {
      de: '(Norden)',
      fr: '(Nord)',
      ja: '(北)',
      cn: '(北)',
      ko: '(북쪽)',
    },
    '--northeast--': {
      de: '--Nordosten--',
      fr: '--Nord-Est--',
      ja: '--北東--',
      cn: '--东北--',
      ko: '--북동--',
    },
    '--northwest--': {
      de: '--Nordwesten--',
      fr: '--Nord-Ouest--',
      ja: '--北西--',
      cn: '--西北--',
      ko: '--북서--',
    },
    '--out--': {
      de: '--Raus--',
      fr: '--Extérieur--',
      ja: '--外--',
      cn: '--外--',
      ko: '--밖--',
    },
    '\\(Out\\)': {
      de: '(Raus)',
      fr: '(Extérieur)',
      ja: '(外)',
      cn: '(外)',
      ko: '(밖)',
    },
    '\\(outer\\)': {
      de: '(außen)',
      fr: '(extérieur)',
      ja: '(外)',
      cn: '(外)',
      ko: '(밖)',
    },
    '\\(outside\\)': {
      de: '(Draußen)',
      fr: '(À l\'extérieur)',
      ja: '(外)',
      cn: '(外面)',
      ko: '(바깥)',
    },
    '--rotate--': {
      de: '--rotieren--',
      fr: '--rotation--',
      ja: '--回転--',
      cn: '--旋转--',
      ko: '--회전--',
    },
    '--south--': {
      de: '--Süden--',
      fr: '--Sud--',
      ja: '--南--',
      cn: '--南--',
      ko: '--남쪽--',
    },
    '\\(south\\)': {
      de: '(Süden)',
      fr: '(Sud)',
      ja: '(南)',
      cn: '(南)',
      ko: '(남쪽)',
    },
    '--southeast--': {
      de: '--Südosten--',
      fr: '--Sud-Est--',
      ja: '--南東--',
      cn: '--东南--',
      ko: '--남동--',
    },
    '--southwest--': {
      de: '--Südwesten--',
      fr: '--Sud-Ouest--',
      ja: '--南西--',
      cn: '--西南--',
      ko: '--남서--',
    },
    '--split--': {
      de: '--teilen--',
      fr: '--division--',
      ja: '--分裂--',
      cn: '--分裂--',
      ko: '--분열--',
    },
    '--stun--': {
      de: '--Betäubung--',
      fr: '--Étourdissement--',
      ja: '--スタン--',
      cn: '--击晕--',
      ko: '--기절--',
    },
    '--sync--': {
      de: '--synchronisation--',
      fr: '--synchronisation--',
      ja: '--シンク--',
      cn: '--同步化--',
      ko: '--동기화--',
    },
    '--([0-9]+x )?targetable--': {
      de: '--$1anvisierbar--',
      fr: '--$1ciblable--',
      ja: '--$1ターゲット可能--',
      cn: '--$1可选中--',
      ko: '--$1타겟 가능--',
    },
    '--teleport--': {
      de: '--teleportation--',
      fr: '--téléportation--',
      ja: '--テレポート--',
      cn: '--传送--',
      ko: '--순간 이동--',
    },
    '--untargetable--': {
      de: '--nich anvisierbar--',
      fr: '--non ciblable--',
      ja: '--ターゲット不可--',
      cn: '--无法选中--',
      ko: '--타겟 불가능--',
    },
    '--west--': {
      de: '--Westen--',
      fr: '--Ouest--',
      ja: '--西--',
      cn: '--西--',
      ko: '--서쪽--',
    },
    [textKeys.E]: {
      de: 'O',
      fr: 'E',
      ja: '東',
      cn: '东',
      ko: '동',
    },
    [textKeys.N]: {
      de: 'N',
      fr: 'N',
      ja: '北',
      cn: '北',
      ko: '북',
    },
    [textKeys.S]: {
      de: 'S',
      fr: 'S',
      ja: '南',
      cn: '南',
      ko: '남',
    },
    [textKeys.W]: {
      de: 'W',
      fr: 'O',
      ja: '西',
      cn: '西',
      ko: '서',
    },
    [textKeys.NE]: {
      de: 'NO',
      fr: 'NE',
      ja: '北東',
      cn: '东北',
      ko: '북동',
    },
    [textKeys.NW]: {
      de: 'NW',
      fr: 'NO',
      ja: '北西',
      cn: '西北',
      ko: '북서',
    },
    [textKeys.SE]: {
      de: 'SO',
      fr: 'SE',
      ja: '南東',
      cn: '东南',
      ko: '남동',
    },
    [textKeys.SW]: {
      de: 'SW',
      fr: 'SO',
      ja: '南西',
      cn: '西南',
      ko: '남서',
    },
    [textKeys.Tank]: {
      de: 'Tank',
      fr: 'Tank',
      ja: 'タンク',
      cn: '坦克',
      ko: '탱커',
    },
    [textKeys.Healer]: {
      de: 'Heiler',
      fr: 'Healer',
      ja: 'ヒーラー',
      cn: '治疗',
      ko: '힐러',
    },
    [textKeys.DPS]: {
      de: 'DPS',
      fr: 'DPS',
      ja: 'DPS',
      cn: 'DPS',
      ko: '딜러',
    },
    [textKeys.Number]: {
      de: '--$1--',
      fr: '--$1--',
      ja: '--$1--',
      cn: '--$1--',
      ko: '--$1--',
    },
  },
} as const;

// Keys into commonReplacement objects that represent "partial" translations,
// in the sense that even if it applies, there still needs to be another
// translation for it to be complete.  These keys should be exactly the same
// as the keys from the commonReplacement block above.  These are used for
// timeline regexes only.
export const partialCommonTimelineReplacementKeys = [
  // Because the zone name needs to be translated here, this is partial.
  syncKeys.seal,
  // Directions
  textKeys.E,
  textKeys.N,
  textKeys.S,
  textKeys.W,
  textKeys.NE,
  textKeys.NW,
  textKeys.SE,
  textKeys.SW,
  // Roles
  textKeys.Tank,
  textKeys.Healer,
  textKeys.DPS,
];

// Same as the timeline version above, but only for trigger regexes.
export const partialCommonTriggerReplacementKeys = [
  // Because the zone name needs to be translated here, this is partial.
  syncKeys.seal,
];

export const backCompatParsedSyncReplace: { [replaceKey: string]: string } = {
  // TODO(6.2): remove this (and all other 40000010 refs) after everybody is on 6.2.
  // Because 4000000F was only used in triple triad, it should be safe to
  // do this replacement for everybody.
  '21:\.\.\.\.\.\.\.\.:4000000F:': '21:\.\.\.\.\.\.\.\.:(4000000F|40000010):',
};
