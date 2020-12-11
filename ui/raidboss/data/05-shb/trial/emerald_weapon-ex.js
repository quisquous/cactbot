import ZoneId from '../../../../../resources/zone_id.js';
import NetRegexes from '../../../../../resources/netregexes.js';
import Conditions from '../../../../../resources/conditions.js';
import { Responses } from '../../../../../resources/responses.js';

const sharedOutputStrings = {
  sharedTankStack: {
    en: 'Tank stack',
    de: 'Tanks sammeln',
    cn: '坦克分摊',
    ko: '탱끼리 모이기',
  },
};

export default {
  zoneId: ZoneId.CastrumMarinumExtreme,
  timelineFile: 'emerald_weapon-ex.txt',
  timelineTriggers: [
    {
      id: 'EmeraldEx Bit Storm',
      regex: /Bit Storm/,
      beforeSeconds: 4,
      response: Responses.getIn(),
    },
    {
      id: 'EmeraldEx Photon Ring',
      regex: /Photon Ring/,
      beforeSeconds: 4,
      response: Responses.getOut(),
    },
  ],
  triggers: [
    {
      id: 'EmeraldEx Emerald Shot',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '55B0' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Smaragd-Waffe', id: '55B0' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Émeraude', id: '55B0' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'エメラルドウェポン', id: '55B0' }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'EmeraldEx Optimized Ultima',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: ['55B1', '5B10'], capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Smaragd-Waffe', id: ['55B1', '5B10'], capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Émeraude', id: ['55B1', '5B10'], capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'エメラルドウェポン', id: ['55B1', '5B10'], capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'EmeraldEx Aetheroplasm Production',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '55AA', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Smaragd-Waffe', id: '55AA', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Émeraude', id: '55AA', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'エメラルドウェポン', id: '55AA', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get orbs',
          de: 'Orbs nehmen',
          fr: 'Prenez les orbes',
          cn: '撞球',
          ko: '구슬 부딪히기',
        },
      },
    },
    {
      id: 'EmeraldEx Magitek Magnetism',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '5594', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Smaragd-Waffe', id: '5594', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Émeraude', id: '5594', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'エメラルドウェポン', id: '5594', capture: false }),
      condition: (data) => data.seenMines || data.role !== 'tank',
      delaySeconds: 9,
      durationSeconds: 6,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get Near Same Polarity Mines',
          de: 'Nahe den Bomben mit gleicher Polarisierung',
          fr: 'Allez vers les mines de même polarité',
          ko: '같은 극성 폭탄쪽으로',
        },
      },
      run: (data) => data.seenMines = true,
    },
    {
      id: 'EmeraldEx Divide Et Impera P1',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '5537', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Smaragd-Waffe', id: '5537', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Émeraude', id: '5537', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'エメラルドウェポン', id: '5537', capture: false }),
      alertText: (data, _, output) => {
        if (data.role === 'tank')
          return output.sharedTankStack();
        return output.spread();
      },
      outputStrings: {
        spread: {
          en: 'Spread',
          de: 'Verteilen',
          fr: 'Ecartez-vous',
          ja: '散開',
          cn: '分散',
          ko: '산개',
        },
        ...sharedOutputStrings,
      },
    },
    {
      id: 'EmeraldEx Magitek Magnetism Flare',
      netRegex: NetRegexes.headMarker({ id: '0057' }),
      condition: Conditions.targetIsYou(),
      alertText: (data, _, output) => output.text(),
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
      id: 'EmeraldEx Magitek Magnetism Bait',
      netRegex: NetRegexes.headMarker({ id: '0017' }),
      condition: Conditions.targetIsYou(),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Bait Lines Away From Safe Spot',
          de: 'Linien weg vom Safespot ködern',
          fr: 'Orientez les lignes hors de la zone sûre',
          ko: '안전지대 밖으로 장판 유도',
        },
      },
    },
    {
      id: 'EmeraldEx Expire P1',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '55[D9]1', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Smaragd-Waffe', id: '55[D9]1', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Émeraude', id: '55[D9]1', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'エメラルドウェポン', id: '55[D9]1', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'EmeraldEx Divide Et Impera P2',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '555B', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Smaragd-Waffe', id: '555B', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Émeraude', id: '555B', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'エメラルドウェポン', id: '555B', capture: false }),
      alertText: (data, _, output) => {
        if (data.role === 'tank')
          return output.sharedTankStack();
        return output.protean();
      },
      outputStrings: {
        protean: {
          en: 'Protean',
          de: 'Himmelsrichtungen',
          fr: 'Position',
          ja: '散開',
          cn: '分散站位',
          ko: '정해진 위치로 산개',
        },
        ...sharedOutputStrings,
      },
    },
    {
      id: 'EmeraldEx Primus Terminus Est',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '55C3', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Smaragd-Waffe', id: '55C3', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Émeraude', id: '55C3', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'エメラルドウェポン', id: '55C3', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Go sides, aim across',
          de: 'Geh zu den Seiten, ziehle nach gegenüber',
          fr: 'Allez sur les côtés, ne chevauchez pas les lignes',
          cn: '靠边，注意箭头朝向',
          ko: '구석으로, 서로 겹치지 않게',
        },
      },
    },
    {
      id: 'EmeraldEx Tertius Terminus est',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '55CC', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Smaragd-Waffe', id: '55CC', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Émeraude', id: '55CC', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'エメラルドウェポン', id: '55CC', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Swords',
          de: 'Schwerter',
          fr: 'Épées',
          cn: '剑',
          ko: '검',
        },
      },
    },
    {
      id: 'EmeraldEx Sidescathe Left',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '55D5', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Smaragd-Waffe', id: '55D5', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Émeraude', id: '55D5', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'エメラルドウェポン', id: '55D5', capture: false }),
      response: Responses.goLeft(),
    },
    {
      id: 'EmeraldEx Sidescathe Right',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '55D4', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Smaragd-Waffe', id: '55D4', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Émeraude', id: '55D4', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'エメラルドウェポン', id: '55D4', capture: false }),
      response: Responses.goRight(),
    },
    {
      id: 'EmeraldEx Emerald Crusher',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '5585', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Smaragd-Waffe', id: '5585', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Émeraude', id: '5585', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'エメラルドウェポン', id: '5585', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'EmeraldEx Secundus Terminus est Corner',
      netRegex: NetRegexes.ability({ source: 'Bitblade', id: '55C9', capture: false }),
      alarmText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Go to intercards',
          de: 'in die Intercardinale Himmelsrichtungen',
          fr: 'en intercadinal',
          cn: '去场边四角',
          ko: '대각위치로',
        },
      },
    },
    {
      id: 'EmeraldEx Secundus Terminus est',
      netRegex: NetRegexes.ability({ source: 'Bitblade', id: '55CA', capture: false }),
      alarmText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Go to cards',
          de: 'in die Cardinalen',
          fr: 'sur les cardinaux',
          cn: '去场边中间',
          ko: '동서남북',
        },
      },
    },
    {
      id: 'EmeraldEx Expire P2',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '55D1', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Smaragd-Waffe', id: '55D1', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Émeraude', id: '55D1', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'エメラルドウェポン', id: '55D1', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'EmeraldEx Mechanized Maneuver',
      netRegex: NetRegexes.startsUsing({ source: `Black Wolf's Image`, id: '55BA', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Numbered Divebombs',
          de: 'Nummerierte Sturzflüge',
          fr: 'Mines numérotées',
          cn: '观察飞机数字',
          ko: '엑사플레어 준비',
        },
      },
    },
    {
      id: 'EmeraldEx Full Rank',
      netRegex: NetRegexes.startsUsing({ source: `Black Wolf's Image`, id: '55C0', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'watch rank-and-file soldiers',
          cn: '观察士兵队列',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'missingTranslations': true,
      'replaceSync': {
        'The Emerald Weapon': 'Smaragd-Waffe',
        'Claw Bit': 'Satellitenarm',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'The Emerald Weapon': 'Arme Émeraude',
        'Claw Bit': 'main volante',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'The Emerald Weapon': 'エメラルドウェポン',
        'Claw Bit': 'ハンドビット',
      },
    },
  ],
};
