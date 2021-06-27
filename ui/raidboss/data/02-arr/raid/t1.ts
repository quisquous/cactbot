import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  started: boolean;
}

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheBindingCoilOfBahamutTurn1,
  initData: () => {
    return {
      started: false,
    };
  },
  triggers: [
    {
      id: 'T1 High Voltage',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Ads', id: '5A7' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Abwehrsystem', id: '5A7' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Sphère De Contrôle', id: '5A7' }),
      netRegexJa: NetRegexes.startsUsing({ source: '制御システム', id: '5A7' }),
      netRegexCn: NetRegexes.startsUsing({ source: '自卫系统', id: '5A7' }),
      netRegexKo: NetRegexes.startsUsing({ source: '제어 시스템', id: '5A7' }),
      condition: (data) => data.CanSilence(),
      response: Responses.interrupt(),
    },
    {
      // Indiscriminate Hood Swing
      id: 'T1 Initiated',
      type: 'Ability',
      netRegex: NetRegexes.ability({ source: 'Caduceus', id: '4B8.*?', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Caduceus', id: '4B8.*?', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Caducée', id: '4B8.*?', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'カドゥケウス', id: '4B8.*?', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '神杖巨蛇', id: '4B8.*?', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '카두케우스', id: '4B8.*?', capture: false }),
      run: (data) => data.started = true,
    },
    {
      id: 'T1 Regorge',
      type: 'Ability',
      netRegex: NetRegexes.ability({ source: 'Caduceus', id: '4BA' }),
      netRegexDe: NetRegexes.ability({ source: 'Caduceus', id: '4BA' }),
      netRegexFr: NetRegexes.ability({ source: 'Caducée', id: '4BA' }),
      netRegexJa: NetRegexes.ability({ source: 'カドゥケウス', id: '4BA' }),
      netRegexCn: NetRegexes.ability({ source: '神杖巨蛇', id: '4BA' }),
      netRegexKo: NetRegexes.ability({ source: '카두케우스', id: '4BA' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Spit on YOU',
          de: 'Spucke auf DIR',
          fr: 'Crachat sur VOUS',
          ja: '自分にリゴージ',
          cn: '吐痰点名',
        },
      },
    },
    {
      id: 'T1 Split',
      type: 'AddedCombatant',
      netRegex: NetRegexes.addedCombatant({ name: 'Caduceus.*?', capture: false }),
      netRegexDe: NetRegexes.addedCombatant({ name: 'Caduceus.*?', capture: false }),
      netRegexFr: NetRegexes.addedCombatant({ name: 'Caducée.*?', capture: false }),
      netRegexJa: NetRegexes.addedCombatant({ name: 'カドゥケウス.*?', capture: false }),
      netRegexCn: NetRegexes.addedCombatant({ name: '神杖巨蛇.*?', capture: false }),
      netRegexKo: NetRegexes.addedCombatant({ name: '카두케우스.*?', capture: false }),
      condition: (data) => data.started,
      suppressSeconds: 5,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Split',
          de: 'Teilen',
          fr: 'Division',
          ja: '分裂',
          cn: '分裂',
        },
      },
    },
    {
      id: 'T1 Hood Swing',
      type: 'Ability',
      netRegex: NetRegexes.ability({ source: 'Caduceus', id: '4B8' }),
      netRegexDe: NetRegexes.ability({ source: 'Caduceus', id: '4B8' }),
      netRegexFr: NetRegexes.ability({ source: 'Caducée', id: '4B8' }),
      netRegexJa: NetRegexes.ability({ source: 'カドゥケウス', id: '4B8' }),
      netRegexCn: NetRegexes.ability({ source: '神杖巨蛇', id: '4B8' }),
      netRegexKo: NetRegexes.ability({ source: '카두케우스', id: '4B8' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: 8,
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Hood Swing in 10',
          de: 'Kapuzenschwung in 10',
          fr: 'Coup de capot dans 10s',
          ja: '十秒以内タンクバスター',
          cn: '10秒内死刑',
        },
      },
    },
    {
      id: 'T1 Slime Timer First',
      type: 'GameLog',
      netRegex: NetRegexes.message({ line: 'The Allagan megastructure will be sealed off.*?', capture: false }),
      netRegexDe: NetRegexes.message({ line: 'Allagische Superstruktur will be sealed off.*?', capture: false }),
      netRegexFr: NetRegexes.message({ line: 'Mégastructure allagoise will be sealed off.*?', capture: false }),
      netRegexJa: NetRegexes.message({ line: 'アラグの遺構 will be sealed off.*?', capture: false }),
      netRegexCn: NetRegexes.message({ line: '亚拉戈遗构 will be sealed off.*?', capture: false }),
      netRegexKo: NetRegexes.message({ line: '알라그 유적 will be sealed off.*?', capture: false }),
      delaySeconds: 35,
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Slime Soon',
          de: 'Schleim bald',
          fr: 'Gluant bientôt',
          ja: 'まもなくスライム',
          cn: '软泥即将出现',
        },
      },
    },
    {
      id: 'T1 Slime Timer',
      type: 'AddedCombatant',
      netRegex: NetRegexes.addedCombatant({ name: 'Dark Matter Slime.*?', capture: false }),
      netRegexDe: NetRegexes.addedCombatant({ name: 'Dunkelmaterien-Schleim.*?', capture: false }),
      netRegexFr: NetRegexes.addedCombatant({ name: 'Gluant De Matière Sombre.*?', capture: false }),
      netRegexJa: NetRegexes.addedCombatant({ name: 'ダークマター・スライム.*?', capture: false }),
      netRegexCn: NetRegexes.addedCombatant({ name: '暗物质粘液怪.*?', capture: false }),
      netRegexKo: NetRegexes.addedCombatant({ name: '암흑물질 슬라임.*?', capture: false }),
      delaySeconds: 35,
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Slime Soon',
          de: 'Schleim bald',
          fr: 'Gluant bientôt',
          ja: 'まもなくスライム',
          cn: '软泥即将出现',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Ads': 'Abwehrsystem',
        'Caduceus': 'Caduceus',
        'Dark Matter Slime': 'Dunkelmaterien-Schleim',
        'The Allagan megastructure': 'Allagische Superstruktur',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Ads': 'Sphère De Contrôle',
        'Caduceus': 'Caducée',
        'Dark Matter Slime': 'Gluant De Matière Sombre',
        'The Allagan megastructure': 'Mégastructure allagoise',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Ads': '制御システム',
        'Caduceus': '蛇杖撃',
        'Dark Matter Slime': 'ダークマター・スライム',
        'The Allagan megastructure': 'アラグの遺構',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Ads': '自卫系统',
        'Caduceus': '蛇杖击',
        'Dark Matter Slime': '暗物质粘液怪',
        'The Allagan megastructure': '亚拉戈遗构',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Ads': '제어 시스템',
        'Caduceus': '뱀 지팡이',
        'Dark Matter Slime': '암흑물질 슬라임',
        'The Allagan megastructure': '알라그 유적',
      },
    },
  ],
};

export default triggerSet;
