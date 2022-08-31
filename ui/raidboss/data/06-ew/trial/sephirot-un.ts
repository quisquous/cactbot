import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  mainTank?: string;
  phase: number;
  force?: string;
  shakerTargets?: string[];
  pillarActive: boolean;
}

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.ContainmentBayS1T7Unreal,
  timelineFile: 'sephirot-un.txt',
  initData: () => {
    return {
      phase: 1,
      pillarActive: false,
    };
  },
  timelineTriggers: [
    {
      id: 'SephirotUn Tiferet',
      regex: /Tiferet/,
      beforeSeconds: 4,
      suppressSeconds: 2, // Timeline syncs can otherwise make this extra-noisy
      response: Responses.aoe(),
    },
    {
      id: 'SephirotUn Triple Trial',
      regex: /Triple Trial/,
      beforeSeconds: 4,
      response: Responses.tankCleave(),
    },
    {
      id: 'SephirotUn Ein Sof Rage',
      regex: /Ein Sof \(4 puddles\)/,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Move to safe quadrant',
          de: 'Beweg dich in den sicheren Quadranten',
          fr: 'Allez sur un quart safe',
          ja: '安置へ移動',
          cn: '移动到安全区域',
          ko: '안전한 지역으로 이동',
        },
      },
    },
    {
      id: 'SephirotUn Ein Sof Ratzon',
      regex: /Ein Sof \(1 puddle\)/,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Bait toward puddle',
          de: 'In Richtung Fläche ködern',
          fr: 'Attendez devant la zone au sol',
          ja: '緑ドームの方へ誘導',
          cn: '靠近圈圈集合诱导AOE',
          ko: '장판 쪽으로 아인 유도',
        },
      },
    },
    {
      id: 'SephirotUn Yesod Bait',
      regex: /Yesod/,
      beforeSeconds: 6,
      alertText: (data, _matches, output) => {
        if (data.pillarActive)
          return output.withPillar!();
        return output.noPillar!();
      },
      outputStrings: {
        noPillar: {
          en: 'Bait Yesod',
          de: 'Yesod ködern',
          fr: 'Attirez Yesod',
          ja: 'イェソドクラッシュ誘導',
          cn: '集合诱导基盘碎击',
          ko: '예소드 붕괴 유도',
        },
        withPillar: {
          en: 'Bait Yesod inside puddle',
          de: 'Yesod in die Fläche ködern',
          fr: 'Attirez Yesod dans une zone au sol',
          ja: '青いサークルの中でイェソドクラッシュ誘導',
          cn: '圈圈内集合诱导基盘碎击',
          ko: '장판 안에 예소드 유도하기',
        },
      },
    },
    {
      id: 'SephirotUn Pillar Activate',
      regex: /Pillar of Mercy 1/,
      beforeSeconds: 10,
      run: (data) => data.pillarActive = true,
    },
    {
      id: 'SephirotUn Pillar Deactivate',
      regex: /Pillar of Mercy 3/,
      run: (data) => data.pillarActive = false,
    },
  ],
  triggers: [
    {
      id: 'SephirotUn Main Tank',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '368', source: 'Sephirot' }),
      // We make this conditional to avoid constant noise in the raid emulator.
      condition: (data, matches) => data.mainTank !== matches.target,
      run: (data, matches) => data.mainTank = matches.target,
    },
    {
      id: 'SephirotUn Chesed Buster',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7694', source: 'Sephirot' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'SephirotUn Ein',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7696', source: 'Sephirot', capture: false }),

      response: Responses.getBehind(),
    },
    {
      id: 'SephirotUn Ratzon Spread',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: ['0046', '0047'] }),
      condition: Conditions.targetIsYou(),
      infoText: (_data, matches, output) => {
        if (matches.id === '0046')
          return output.green!();
        return output.purple!();
      },
      outputStrings: {
        purple: {
          en: 'Purple spread',
          de: 'Lila verteilen',
          fr: 'Violet écartez-vous',
          ja: '紫散会',
          cn: '紫圈分散',
          ko: '보라색 징 산개',
        },
        green: {
          en: 'Green spread',
          de: 'Grün verteilen',
          fr: 'Vert écartez-vous',
          ja: '緑散会',
          cn: '绿圈分散',
          ko: '초록색 징 산개',
        },
      },
    },
    {
      id: 'SephirotUn Fiendish Rage',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0048', capture: false }),
      condition: (data) => data.phase === 1,
      suppressSeconds: 10,
      alertText: (data, _matches, output) => {
        if (data.me === data.mainTank)
          return output.noStack!();
        return output.stack!();
      },
      outputStrings: {
        noStack: {
          en: 'Don\'t Stack!',
          de: 'Nicht sammeln!',
          fr: 'Ne vous packez pas !',
          ja: '頭割りに参加しないで',
          cn: '不要重合！',
          ko: '겹치면 안됨!',
        },
        stack: {
          en: 'Group Stacks',
          de: 'In der Gruppe sammeln',
          fr: 'Package en groupe',
          ja: 'グループ頭割り',
          cn: '分组集合',
          ko: '그룹 쉐어',
        },
      },
    },
    {
      id: 'SephirotUn Da\'at Spread',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '769F', source: 'Sephirot', capture: false }),
      response: Responses.spread(),
    },
    {
      id: 'SephirotUn Malkuth',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '76AF', source: 'Sephirot', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'SephirotUn Yesod Move',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '76AB', source: 'Sephirot', capture: false }),
      suppressSeconds: 2,
      response: Responses.moveAway('alarm'), // This *will* kill if a non-tank takes 2+.
    },
    {
      // 3ED is Force Against Might orange, 3EE is Force Against Magic, green.
      id: 'SephirotUn Force Against Gain',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['3ED', '3EE'] }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, matches, output) => output.text!({ force: matches.effect }),
      run: (data, matches) => data.force = matches.effectId,
      outputStrings: {
        text: {
          en: '${force} on you',
          de: '${force} auf dir',
          fr: '${force} sur vous',
          ja: '自分に${force}',
          cn: '${force}点名',
          ko: '나에게 ${force}',
        },
      },
    },
    {
      // Orange left, Green right. Match color to Force debuff.
      id: 'SephirotUn Gevurah Chesed',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '76A5', capture: false }),
      alertText: (data, _matches, output) => {
        // Here and for Chesed Gevurah, if the player doesn't have a color debuff,
        // they just take moderate AoE damage.
        // Unlike Flood of Naught (colors) in O4s,
        // standing center is safe if the user has no debuff.
        if (data.force)
          return data.force === '3ED' ? output.left!() : output.right!();
        return output.aoe!();
      },
      outputStrings: {
        left: Outputs.left,
        right: Outputs.right,
        aoe: Outputs.aoe,
      },
    },
    {
      // Green left, Orange right. Match color to Force debuff.
      id: 'SephirotUn Chesed Gevurah',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '76A6', capture: false }),
      alertText: (data, _matches, output) => {
        if (data.force)
          return data.force === '3EE' ? output.left!() : output.right!();
        return output.aoe!();
      },
      outputStrings: {
        left: Outputs.left,
        right: Outputs.right,
        aoe: Outputs.aoe,
      },
    },
    {
      id: 'SephirotUn Fiendish Wail',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '76A2', source: 'Sephirot', capture: false }),
      alertText: (data, _matches, output) => {
        if (data.force === '3ED' || (!data.force && data.role === 'tank'))
          return output.getTower!();
        return output.avoidTower!();
      },
      outputStrings: {
        getTower: {
          en: 'Get a tower',
          de: 'Nimm einen Turm',
          fr: 'Prenez une tour',
          ja: '塔を踏む',
          cn: '踩塔',
          ko: '기둥 밟기',
        },
        avoidTower: {
          en: 'Avoid towers',
          de: 'Turm meiden',
          fr: 'Évitez les tours',
          ja: '塔から離れる',
          cn: '躲塔',
          ko: '기둥 피하기',
        },
      },
    },
    {
      id: 'SephirotUn Da\'at Tethers',
      type: 'Tether',
      netRegex: NetRegexes.tether({ id: '0030', capture: false }),
      suppressSeconds: 30, // The tethers jump around a lot
      alertText: (data, _matches, output) => {
        if (data.force === '3EE')
          return output.magic!();
        return output.might!();
      },
      outputStrings: {
        might: {
          en: 'Get Away, Avoid Puddles + Tethers',
          de: 'Geh weg, weiche Flächen und Verbindungen aus',
          fr: 'Éloignez-vous, Évitez les zones au sol et les liens',
          ja: '離れる、AOEと線回避',
          cn: '远离, 躲避圈圈 + 连线',
          ko: '멀리 떨어지고, 장판 + 선 피하기',
        },
        magic: {
          en: 'Go Front; Get Tether',
          de: 'Geh nach Vorne; Nimm eine Verbindung',
          fr: 'Allez devant puis prenez les liens',
          ja: '前へ、線取り',
          cn: '去前面; 接线',
          ko: '앞으로 가서 선 가로채기',
        },
      },
    },
    {
      id: 'SephirotUn Force Against Lose',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: ['3ED', '3EE'], capture: false }),
      run: (data) => delete data.force,
    },
    {
      id: 'SephirotUn Earth Shaker Collect',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0028' }),
      run: (data, matches) => {
        data.shakerTargets = data.shakerTargets ??= [];
        data.shakerTargets.push(matches.target);
      },
    },
    {
      id: 'SephirotUn Earth Shaker Call',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0028', capture: false }),
      delaySeconds: 0.5,
      alertText: (data, _matches, output) => {
        if (data.shakerTargets?.includes(data.me))
          return output.shakerTarget!();
        return output.shakerAvoid!();
      },
      outputStrings: {
        shakerTarget: {
          en: 'Earth Shaker (Max Melee)',
          de: 'Erdstoß (Max Nahkampf)',
          fr: 'Secousse (Max Melée)',
          ja: 'アスシェイカー',
          cn: '大地摇动 (最远近战距离)',
          ko: '어스징 (칼끝딜 거리)',
        },
        shakerAvoid: {
          en: 'Avoid Earth Shakers',
          de: 'Weiche Erdstoß aus',
          fr: 'Évitez les secousses',
          ja: 'アスシェイカー回避',
          cn: '躲避大地摇动',
          ko: '어스징 피하기',
        },
      },
    },
    {
      id: 'SephirotUn Earth Shaker Cleanup',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0028', capture: false }),
      delaySeconds: 5,
      run: (data) => delete data.shakerTargets,
    },
    {
      id: 'SephirotUn Storm of Words Revelation',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7680', source: 'Storm of Words', capture: false }),
      alarmText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Kill Storm of Words or die',
          de: 'Wörtersturm besiegen',
          fr: 'Tuez Tempête de mots ou mourrez',
          ja: 'ストーム・オブ・ワードから攻撃',
          cn: '击杀言语风暴!',
          ko: '신언의 폭풍 제거',
        },
      },
    },
    {
      id: 'SephirotUn Ascension',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '003E', capture: false }),
      response: Responses.stackMarker(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Coronal Wind': 'Koronalwind',
        'Sephirot': 'Sephirot',
        'Storm Of Words': 'Wörtersturm',
      },
      'replaceText': {
        'Tethers': 'Verbindungen',
        'spread': 'verteilen',
        'puddles': 'Flächen',
        'puddle(?!s)': 'Fläche',
        'Adds Spawn': 'Adds erscheinen',
        'Ascension': 'Himmelfahrt',
        'Chesed': 'Chesed',
        'Da\'at': 'Da\'at',
        'Earth Shaker': 'Erdstoß',
        'Ein Sof': 'En Sof',
        'Fiendish Rage': 'Dämonischer Zorn',
        'Fiendish Wail': 'Dämonische Klage',
        'Force Field': 'Kraftfeld',
        'Impact of Hod': 'Macht von Hod',
        'Life Force': 'Lebenskraft',
        'Malkuth': 'Malkuth',
        'Pillar of Mercy': 'Pfeiler der Gnade',
        'Pillar of Severity': 'Pfeiler der Strenge',
        'Ratzon': 'Ratzon',
        'Spirit': 'Geist',
        'Tiferet': 'Tiferet',
        'Triple Trial': 'Tripel-Triade',
        'Yesod': 'Yesod',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Coronal Wind': 'vent coronaire',
        'Sephirot': 'Sephirot',
        'Storm Of Words': 'tempête de mots',
      },
      'replaceText': {
        'Adds Spawn': 'Apparition d\'adds',
        'Ascension': 'Ascension',
        'Chesed': 'Chesed',
        'Chesed Gevurah': 'Chesed Gevurah',
        'Da\'at Tethers': 'Liens Da\'at',
        'Da\'at spread': 'Dispersion Da\'at',
        'Earth Shaker': 'Secousse',
        'Ein Sof': 'Ein Sof',
        'Fiendish Rage': 'Colère de Sephirot',
        'Fiendish Wail': 'Plainte de Sephirot',
        'Force Field': 'Champ de force',
        'Impact of Hod': 'Impact Hod',
        'Life Force': 'Force vitale',
        'Malkuth': 'Malkuth',
        'Pillar of Mercy': 'Pilier de la miséricorde',
        'Pillar of Severity': 'Pilier de la rigueur',
        'Ratzon': 'Ratzon',
        'Spirit': 'Esprit',
        'Tiferet': 'Tiferet',
        'Triple Trial': 'Triple coup',
        'Yesod': 'Yesod',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Coronal Wind': 'コロナルウィンド',
        'Sephirot': 'セフィロト',
        'Storm Of Words': 'ストーム・オブ・ワード',
      },
      'replaceText': {
        'Adds Spawn': '雑魚',
        'Ascension': 'アセンション',
        '(?! )Chesed(?! )': 'ケセド',
        'Chesed Gevurah': 'ケセド・ゲブラー',
        'Da\'at': 'ダアト',
        'Earth Shaker': 'アースシェイカー',
        'Ein Sof(?! )': 'アイン・ソフ',
        'Ein Sof Ohr': 'アイン・ソフ・オウル',
        'Fiendish Rage': '魔神の怒り',
        'Fiendish Wail': '魔神の嘆き',
        'Force Field': 'フォースフィールド',
        'Impact of Hod': 'ホドインパクト',
        'Life Force': 'ライフフォース',
        'Malkuth': 'マルクト',
        'Pillar of Mercy': 'ピラー・オブ・メルシー',
        'Pillar of Severity': 'ピラー・オブ・セベリティ',
        'Ratzon': 'ラツォン',
        '(?<= )spread': '散開',
        'Spirit': 'スピリット',
        '(?<= )Tethers': '線',
        'Tiferet': 'ティファレト',
        'Triple Trial': 'トリプルブロー',
        'Yesod': 'イェソドクラッシュ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Coronal Wind': '冠状气流',
        'Sephirot': '萨菲洛特',
        'Storm Of Words': '言语风暴',
      },
      'replaceText': {
        'puddle(?:s)?': '圈圈',
        'spread': '散开',
        'Tethers': '连线',
        'Adds Spawn': '小怪出现',
        'Ascension': '上升气流',
        'Chesed(?! Gevurah)': '仁慈',
        'Chesed Gevurah': '仁慈之严酷',
        'Da\'at': '知识',
        'Earth Shaker': '大地摇动',
        'Ein Sof': '无限',
        'Fiendish Rage': '魔神之怒',
        'Fiendish Wail': '魔神之叹',
        'Force Field': '力场',
        'Impact of Hod': '荣光撞击',
        'Life Force': '生命领域',
        'Malkuth': '王国',
        'Pillar of Mercy': '慈悲之柱',
        'Pillar of Severity': '严厉之柱',
        'Ratzon': '意志',
        'Spirit': '圣灵领域',
        'Tiferet': '美丽',
        'Triple Trial': '三重强击',
        'Yesod': '基盘碎击',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Coronal Wind': '관상기류',
        'Sephirot': '세피로트',
        'Storm Of Words': '신언의 폭풍',
      },
      'replaceText': {
        'puddle(?:s)?': '장판',
        'Adds Spawn': '쫄 등장',
        'Ascension': '승천',
        'Chesed': '헤세드',
        'Da\'at': '다아트',
        'Earth Shaker': '요동치는 대지',
        'Ein Sof': '아인 소프',
        'Fiendish Rage': '마신의 분노',
        'Fiendish Wail': '마신의 탄식',
        'Force Field': '역장',
        'Impact of Hod': '호드 대충격',
        'Life Force': '생명의 권능',
        'Malkuth': '말쿠트',
        'Pillar of Mercy': '자비의 기둥',
        'Pillar of Severity': '준엄의 기둥',
        'Ratzon': '라촌',
        'Spirit': '성령의 은사',
        'Tiferet': '티페레트',
        'Triple Trial': '삼중 강타',
        'Yesod': '예소드 붕괴',
      },
    },
  ],
};

export default triggerSet;
