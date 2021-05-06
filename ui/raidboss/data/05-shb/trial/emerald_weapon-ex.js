import ZoneId from '../../../../../resources/zone_id';
import NetRegexes from '../../../../../resources/netregexes';
import Conditions from '../../../../../resources/conditions';
import { Responses } from '../../../../../resources/responses';

const sharedOutputStrings = {
  sharedTankStack: {
    en: 'Tank stack',
    de: 'Tanks sammeln',
    fr: 'Package Tanks',
    ja: 'タンク頭割り',
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
      response: Responses.getUnder(),
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
      netRegexCn: NetRegexes.startsUsing({ source: '绿宝石神兵', id: '55B0' }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'EmeraldEx Optimized Ultima',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: ['55B1', '5B10'], capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Smaragd-Waffe', id: ['55B1', '5B10'], capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Émeraude', id: ['55B1', '5B10'], capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'エメラルドウェポン', id: ['55B1', '5B10'], capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '绿宝石神兵', id: ['55B1', '5B10'], capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'EmeraldEx Aetheroplasm Production',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '55AA', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Smaragd-Waffe', id: '55AA', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Émeraude', id: '55AA', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'エメラルドウェポン', id: '55AA', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '绿宝石神兵', id: '55AA', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get orbs',
          de: 'Orbs nehmen',
          fr: 'Prenez les orbes',
          ja: '玉を処理',
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
      netRegexCn: NetRegexes.startsUsing({ source: '绿宝石神兵', id: '5594', capture: false }),
      condition: (data) => data.seenMines || data.role !== 'tank',
      delaySeconds: 9,
      durationSeconds: 6,
      alertText: (data, _, output) => output.text(),
      run: (data) => data.seenMines = true,
      outputStrings: {
        text: {
          en: 'Get Near Same Polarity Mines',
          de: 'Nahe den Bomben mit gleicher Polarisierung',
          fr: 'Allez vers les mines de même polarité',
          ja: '同じ極性の爆雷に近づく',
          cn: '靠近同级地雷',
          ko: '같은 극성 폭탄쪽으로',
        },
      },
    },
    {
      id: 'EmeraldEx Divide Et Impera P1',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '5537', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Smaragd-Waffe', id: '5537', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Émeraude', id: '5537', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'エメラルドウェポン', id: '5537', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '绿宝石神兵', id: '5537', capture: false }),
      alertText: (data, _, output) => {
        if (data.role === 'tank')
          return output.sharedTankStack();
        return output.spread();
      },
      outputStrings: {
        spread: {
          en: 'Spread',
          de: 'Verteilen',
          fr: 'Dispersez-vous',
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
          ja: '線を安置に被らないように捨てる',
          cn: '诱导直线，不要覆盖安全点',
          ko: '안전지대 밖으로 장판 유도',
        },
      },
    },
    {
      id: 'EmeraldEx Expire',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '55[D9]1', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Smaragd-Waffe', id: '55[D9]1', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Émeraude', id: '55[D9]1', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'エメラルドウェポン', id: '55[D9]1', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '绿宝石神兵', id: '55[D9]1', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'EmeraldEx Divide Et Impera P2',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '555B', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Smaragd-Waffe', id: '555B', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Émeraude', id: '555B', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'エメラルドウェポン', id: '555B', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '绿宝石神兵', id: '555B', capture: false }),
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
          ja: '8方向散開',
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
      netRegexCn: NetRegexes.startsUsing({ source: '绿宝石神兵', id: '55C3', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Go sides, aim across',
          de: 'Geh zu den Seiten, ziehle nach gegenüber',
          fr: 'Allez sur les côtés, ne chevauchez pas les lignes',
          ja: '四隅を避けて矢印を配置',
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
      netRegexCn: NetRegexes.startsUsing({ source: '绿宝石神兵', id: '55CC', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Swords',
          de: 'Schwerter',
          fr: 'Épées',
          ja: '剣',
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
      netRegexCn: NetRegexes.startsUsing({ source: '绿宝石神兵', id: '55D5', capture: false }),
      response: Responses.goLeft(),
    },
    {
      id: 'EmeraldEx Sidescathe Right',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '55D4', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Smaragd-Waffe', id: '55D4', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Émeraude', id: '55D4', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'エメラルドウェポン', id: '55D4', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '绿宝石神兵', id: '55D4', capture: false }),
      response: Responses.goRight(),
    },
    {
      id: 'EmeraldEx Emerald Crusher',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '5585', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Smaragd-Waffe', id: '5585', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Émeraude', id: '5585', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'エメラルドウェポン', id: '5585', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '绿宝石神兵', id: '5585', capture: false }),
      response: Responses.knockback(),
    },
    {
      // TODO: use headmarkers for this
      id: 'EmeraldEx Secundus Terminus est',
      netRegex: NetRegexes.startsUsing({ source: 'The Emerald Weapon', id: '55C8', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Smaragd-Waffe', id: '55C8', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Émeraude', id: '55C8', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'エメラルドウェポン', id: '55C8', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '绿宝石神兵', id: '55C8', capture: false }),
      alarmText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'X to cards, + to intercards',
          de: 'X in die Cardinalen, + in die Intercardinale Himmelsrichtungen',
          fr: 'X sur les cardinaux, + en intercadinal',
          ja: 'クロスは東西南北に、十字は四隅に',
          cn: '靠边放剑(十字四角)',
          ko: 'X는 동서남북, +는 대각위치로',
        },
      },
    },
    {
      id: 'EmeraldEx Mechanized Maneuver',
      netRegex: NetRegexes.startsUsing({ source: 'Black Wolf\'s Image', id: '55BA', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Gaius-Projektion', id: '55BA', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Spectre De Gaius', id: '55BA', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ガイウスの幻影', id: '55BA', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '盖乌斯的幻影', id: '55BA', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Numbered Divebombs',
          de: 'Nummerierte Sturzflüge',
          fr: 'Mines numérotées',
          ja: '番号を覚える',
          cn: '观察飞机数字',
          ko: '엑사플레어 준비',
        },
      },
    },
    {
      id: 'EmeraldEx Full Rank',
      netRegex: NetRegexes.startsUsing({ source: 'Black Wolf\'s Image', id: '55C0', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Gaius-Projektion', id: '55C0', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Spectre De Gaius', id: '55C0', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ガイウスの幻影', id: '55C0', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '盖乌斯的幻影', id: '55C0', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'watch rank-and-file soldiers',
          de: 'Achte auf die Lücken zwischen den Soldaten',
          fr: 'Regardez les soldats en rangs',
          ja: '飛行部隊と射撃部隊を見覚える',
          cn: '观察士兵队列',
          ko: '엑사플레어 순서, 빈 공간 확인',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Black Wolf\'s Image': 'Gaius-Projektion',
        'Imperial Image': 'garleisch(?:e|er|es|en) Soldat',
        'Reaper Image': 'Schnitter-Projektion',
        'The Emerald Weapon': 'Smaragd-Waffe',
      },
      'replaceText': {
        '--cutscene--': '--Zwischensequence--',
        'Aetheroplasm Production': 'Blitzgenerator',
        'Aire Tam Storm': 'Smaragdfeuersturm',
        'Bit Storm': 'Satellitenarme: Zirkelangriff',
        'Divide Et Impera': 'Divide et Impera',
        'Emerald Beam': 'Smaragdstrahl',
        'Emerald Shot': 'Smaragdschuss',
        'Expire': 'Exspirieren',
        'Heirsbane': 'Erbenbann',
        'Legio Phantasmatis': 'Legio Phantasmatis',
        'Magitek Cannon': 'Magitek-Kanone',
        'Magitek Magnetism': 'Magimagnetismus',
        'Optimized Ultima': 'Ultima-System',
        'Photon Ring': 'Photonenkreis',
        'Primus Terminus Est': 'Terminus Est: Unus',
        'Secundus Terminus Est': 'Terminus Est: Duo',
        'Shots Fired': 'Synchron-Salve',
        'Sidescathe': 'Flankenbeschuss',
        'Split': 'Segregation',
        'Tertius Terminus Est': 'Terminus Est: Tres',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Black Wolf\'s Image': 'spectre de Gaius',
        'Imperial Image': 'spectre de soldat impérial',
        'Reaper Image': 'spectre de faucheuse',
        'The Emerald Weapon': 'Arme Émeraude',
      },
      'replaceText': {
        '--cutscene--': '--cinématique--',
        'Aetheroplasm Production': 'Condensation d\'éthéroplasma',
        'Aire Tam Storm': 'Aire Tam Storm',
        'Bit Storm': 'Salve circulaire',
        'Divide Et Impera': 'Divide Et Impera',
        'Emerald Beam': 'Rayon émeraude',
        'Emerald Shot': 'Tir émeraude',
        'Expire': 'Jet de plasma',
        'Heirsbane': 'Fléau de l\'héritier',
        'Legio Phantasmatis': 'Legio Phantasmatis',
        'Magitek Cannon': 'Canon magitek',
        'Magitek Magnetism': 'Électroaimant magitek',
        'Optimized Ultima': 'Ultima magitek',
        'Photon Ring': 'Cercle photonique',
        'Primus Terminus Est': 'Terminus Est : Unus',
        'Secundus Terminus Est': 'Terminus Est : Duo',
        'Shots Fired': 'Fusillade',
        'Sidescathe': 'Salve latérale',
        'Split': 'Séparation',
        'Tertius Terminus Est': 'Terminus Est : Tres',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Black Wolf\'s Image': 'ガイウスの幻影',
        'Imperial Image': '帝国兵の幻影',
        'Reaper Image': 'リーパーの幻影',
        'The Emerald Weapon': 'エメラルドウェポン',
      },
      'replaceText': {
        '--cutscene--': '--カットシーン--',
        'Aetheroplasm Production': '爆雷生成',
        'Aire Tam Storm': 'エメラルドビッグバン',
        'Bit Storm': 'アームビット：円形射撃',
        'Divide Et Impera': 'ディヴィデ・エト・インペラ',
        'Emerald Beam': 'エメラルドビーム',
        'Emerald Shot': 'エメラルドショット',
        'Expire': '噴射',
        'Heirsbane': 'No.IX',
        'Legio Phantasmatis': 'レギオ・ファンタズマティス',
        'Magitek Cannon': '魔導カノン',
        'Magitek Magnetism': '魔導マグネット',
        'Optimized Ultima': '魔導アルテマ',
        'Photon Ring': 'フォトンサークル',
        'Primus Terminus Est': 'ターミナス・エスト：ウーヌス',
        'Secundus Terminus Est': 'ターミナス・エスト：ドゥオ',
        'Shots Fired': '一斉掃射',
        'Sidescathe': '側面掃射',
        'Split': '分離',
        'Tertius Terminus Est': 'ターミナス・エスト：トレース',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Black Wolf\'s Image': '盖乌斯的幻影',
        'Imperial Image': '帝国兵的幻影',
        'Reaper Image': '魔导死神的幻影',
        'The Emerald Weapon': '绿宝石神兵',
      },
      'replaceText': {
        '--cutscene--': '--过场动画--',
        'Aetheroplasm Production': '生成炸弹',
        'Aire Tam Storm': '绿宝石大爆炸',
        'Bit Storm': '浮游炮：圆形射击',
        'Divide Et Impera': '分而治之',
        'Emerald Beam': '绿宝石光束',
        'Emerald Shot': '绿宝石射击',
        'Expire': '喷射',
        'Heirsbane': '遗祸',
        'Legio Phantasmatis': '幻影军团',
        'Magitek Cannon': '魔导加农炮',
        'Magitek Magnetism': '魔导磁石',
        'Optimized Ultima': '魔导究极',
        'Photon Ring': '光子环',
        'Primus Terminus Est': '恩惠终结：壹',
        'Secundus Terminus Est': '恩惠终结：贰',
        'Shots Fired': '一齐扫射',
        'Sidescathe': '侧面扫射',
        'Split': '分离',
        'Tertius Terminus Est': '恩惠终结：叁',
      },
    },
  ],
};
