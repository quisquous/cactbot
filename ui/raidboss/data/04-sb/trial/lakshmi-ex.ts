import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  chanchala?: boolean;
}

// Lakshmi Extreme
const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.EmanationExtreme,
  timelineFile: 'lakshmi-ex.txt',
  timelineTriggers: [
    {
      id: 'LakshmiEx Path of Light',
      regex: /Path of Light/,
      beforeSeconds: 5,
      response: Responses.tankCleave(),
    },
  ],
  triggers: [
    {
      id: 'LakshmiEx Chanchala Gain',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '2148', source: 'Lakshmi', capture: false }),
      run: (data) => data.chanchala = true,
    },
    {
      id: 'LakshmiEx Chanchala Lose',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ target: 'Lakshmi', effectId: '582', capture: false }),
      run: (data) => data.chanchala = false,
    },
    {
      id: 'LakshmiEx Pull of Light Tank',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '215E', source: 'Lakshmi' }),
      response: Responses.tankBuster('info'),
    },
    {
      id: 'LakshmiEx Pull of Light Unexpected',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '215E', source: 'Lakshmi' }),
      condition: (data) => data.role !== 'tank' && data.role !== 'healer',
      response: Responses.tankBuster('alarm'),
    },
    {
      id: 'LakshmiEx Divine Denial',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '2149', source: 'Lakshmi', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Vrill + Knockback',
          de: 'Vril + Rückstoß',
          fr: 'Vril + Poussée',
          ja: 'エーテル + 完全なる拒絶',
          cn: '完全拒绝',
          ko: '락슈미 에테르 + 넉백',
        },
      },
    },
    {
      id: 'LakshmiEx Divine Desire',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '214B', source: 'Lakshmi', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Vrill + Be Outside',
          de: 'Vril + Außen',
          fr: 'Vril + Extérieur',
          ja: 'エーテル + 完全なる誘引',
          cn: '完全吸引',
          ko: '락슈미 에테르 + 바깥으로',
        },
      },
    },
    {
      id: 'LakshmiEx Divine Doubt',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '214A', source: 'Lakshmi', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Vrill + Pair Up',
          de: 'Vril + Pärchen bilden',
          fr: 'Vril + Paire',
          ja: 'エーテル + 完全なる惑乱',
          cn: '完全惑乱',
          ko: '락슈미 에테르 + 파트너끼리',
        },
      },
    },
    { // Stack marker
      id: 'LakshmiEx Pall of Light',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      alertText: (data, matches, output) => {
        if (!data.chanchala)
          return;

        if (data.me === matches.target)
          return output.vrillStackOnYou!();

        return output.vrillStack!();
      },
      infoText: (data, matches, output) => {
        if (data.chanchala)
          return;

        if (data.me === matches.target)
          return output.stackOnYou!();

        return output.stack!();
      },
      outputStrings: {
        stackOnYou: Outputs.stackOnYou,
        stack: {
          en: 'Stack',
          de: 'Stack',
          fr: 'Packez-vous',
          ja: '頭割り',
          cn: '集合',
          ko: '쉐어',
        },
        vrillStackOnYou: {
          en: 'Vrill + Stack on YOU',
          de: 'Vril + Stack auf DIR',
          fr: 'Vril + Package sur VOUS',
          ja: '自分に頭割り (エーテル)',
          cn: '元气攻击点名',
          ko: '락슈미 에테르 + 쉐어징 대상자',
        },
        vrillStack: {
          en: 'Vrill + Stack',
          de: 'Vril + Stack',
          fr: 'Vril + Packez-vous',
          ja: 'エーテル と 頭割り',
          cn: '元气攻击',
          ko: '락슈미 에테르 쉐어징',
        },
      },
    },
    {
      id: 'LakshmiEx Stotram',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '2147', source: 'Lakshmi', capture: false }),
      condition: (data) => data.chanchala,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Vrill for AOE',
          de: 'Vril fuer Flaechenangriff',
          fr: 'Vril pour AoE',
          ja: 'ストトラム (エーテル)',
          cn: '元气AOE',
          ko: '락슈미 에테르 (광딜)',
        },
      },
    },
    {
      // Offtank cleave
      id: 'LakshmiEx Path of Light Marker',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '000E' }),
      condition: Conditions.targetIsYou(),
      alarmText: (data, _matches, output) => {
        if (data.chanchala)
          return output.vrillCleaveOnYou!();

        return output.cleaveOnYou!();
      },
      outputStrings: {
        vrillCleaveOnYou: {
          en: 'Vrill + Cleave on YOU',
          de: 'Vril + Cleave auf DIR',
          fr: 'Vril + Cleave sur VOUS',
          ja: '自分に波動 (エーテル)',
          cn: '元气 死刑点名',
          ko: '락슈미 에테르 + 광역 탱버 대상자',
        },
        cleaveOnYou: {
          en: 'Cleave on YOU',
          de: 'Cleave auf DIR',
          fr: 'Cleave sur VOUS',
          ja: '自分に波動',
          cn: '死刑点名',
          ko: '광역 탱버 대상자',
        },
      },
    },
    {
      // Cross aoe
      id: 'LakshmiEx Hand of Grace',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '006B' }),
      condition: Conditions.targetIsYou(),
      infoText: (data, _matches, output) => {
        if (data.chanchala)
          return output.vrillCrossMarker!();

        return output.crossMarker!();
      },
      outputStrings: {
        vrillCrossMarker: {
          en: 'Vrill + Cross Marker',
          de: 'Vril + Kreuz-Marker',
          fr: 'Vril + Marqueur croix',
          ja: '自分に右手 (エーテル)',
          cn: '元气 十字点名',
          ko: '락슈미 에테르 + 십자 장판 징',
        },
        crossMarker: {
          en: 'Cross Marker',
          de: 'Kreuz-Marker',
          fr: 'Marqueur croix',
          ja: '自分に右手',
          cn: '十字点名',
          ko: '십자 장판 징',
        },
      },
    },
    {
      // Flower marker (healers)
      id: 'LakshmiEx Hand of Beauty',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '006D' }),
      condition: Conditions.targetIsYou(),
      infoText: (data, _matches, output) => {
        if (data.chanchala)
          return output.vrillFlowerMarker!();

        return output.flowerMarker!();
      },
      outputStrings: {
        vrillFlowerMarker: {
          en: 'Vrill + Flower Marker',
          de: 'Vril + Blumen-Marker',
          fr: 'Vril + Marqueur fleur',
          ja: '自分に左手 (エーテル)',
          cn: '元气 花点名',
          ko: '락슈미 에테르 + 원형 장판 징',
        },
        flowerMarker: {
          en: 'Flower Marker',
          de: 'Blumen-Marker',
          fr: 'Marqueur fleur',
          ja: '自分に左手',
          cn: '花点名',
          ko: '원형 장판 징',
        },
      },
    },
    {
      // Red marker during add phase
      id: 'LakshmiEx Water III',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0017' }),
      condition: Conditions.targetIsYou(),
      // Soloing can get you two of these.
      suppressSeconds: 1,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Move Away',
          de: 'Weg da',
          fr: 'Éloignez-vous',
          ja: '離れる',
          cn: '远离大锤落点',
          ko: '피하기',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Blissful Arrow': 'Blissful Arrow (cross)',
        'Blissful Hammer': 'Blissful Hammer (circle)',
        'The Pall Of Light': 'Pall Of Light (stack)',
        'The Path Of Light': 'Path Of Light (OT cleave)',
        'The Pull Of Light': 'Pull Of Light (MT buster)',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'Dreaming Kshatriya': 'verträumt(?:e|er|es|en) Kshatriya',
        'Lakshmi': 'Lakshmi',
      },
      'replaceText': {
        '--chanchala end--': '--Chanchala endet--',
        '\\(mid\\)': '(Mitte)',
        '/dance': '/tanz',
        'Alluring Arm': 'Anziehender Arm',
        'Blissful Spear': 'Speer der Gnade',
        'Chanchala': 'Chanchala',
        'Divine Denial': 'Göttliche Leugnung',
        'Divine Desire': 'Göttliche Lockung',
        'Divine Doubt': 'Göttliche Bestürzung',
        'Hand Of Beauty': 'Hand der Schönheit',
        'Hand Of Grace': 'Hand der Anmut',
        'Inner Demons': 'Dämonen in dir',
        'Stotram': 'Stotram',
        'The Pall Of Light': 'Flut des Lichts',
        'The Path Of Light': 'Pfad des Lichts',
        'The Pull Of Light': 'Strom des Lichts',
        'Vril': 'Vril',
        'Tail Slap': 'Schwanzklapser',
        'Blissful Arrow': 'Heiliger Pfeil',
        'Blissful Hammer': 'Hammer der Gnade',
        'Jagadishwari': 'Jagadishwari',
        'Alluring Embrace': 'Lockende Umarmung',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Dreaming Kshatriya': 'kshatriya rêveuse',
        'Lakshmi': 'Lakshmi',
      },
      'replaceText': {
        '--chanchala end--': '--fin de chanchala--',
        '/dance': '/danse',
        '\\(mid\\)': '(milieu)',
        'Alluring Arm': 'Bras séduisants',
        'Blissful Spear': 'Épieu béatifiant',
        '(?<! )Chanchala': 'Chanchala',
        'Divine Denial': 'Refus divin',
        'Divine Desire': 'Désir divin',
        'Divine Doubt': 'Doute divin',
        'Hand Of Beauty': 'Main de la beauté',
        'Hand Of Grace': 'Main de la grâce',
        'Inner Demons': 'Démons intérieurs',
        'Stotram': 'Stotram',
        'The Pall Of Light': 'Voile de lumière (package)',
        'The Path Of Light': 'Voie de lumière (OT cleave)',
        'The Pull Of Light': 'Flot de lumière (MT buster)',
        'Vril': 'Vril',
        'Tail Slap': 'Gifle caudale',
        'Blissful Arrow': 'Flèche béatifiante (croix)',
        'Blissful Hammer': 'Marteau béatifiant (cercle)',
        'Jagadishwari': 'Jagadishwari',
        'Alluring Embrace': 'Étreinte séduisante',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Dreaming Kshatriya': 'テンパード・クシャトリア',
        'Lakshmi': 'ラクシュミ',
      },
      'replaceText': {
        '/dance': '/dance',
        '\\(mid\\)': '(中央)',
        'Alluring Arm': '魅惑の腕',
        'Blissful Spear': '聖なる槍',
        'Chanchala': 'チャンチャラー',
        'Divine Denial': '完全なる拒絶',
        'Divine Desire': '完全なる誘引',
        'Divine Doubt': '完全なる惑乱',
        'Hand Of Beauty': '優美なる左手',
        'Hand Of Grace': '優雅なる右手',
        'Inner Demons': 'イナーデーモン',
        'Stotram': 'ストトラム',
        'The Pall Of Light': '光の瀑布',
        'The Path Of Light': '光の波動',
        'The Pull Of Light': '光の奔流',
        'Vril': 'ラクシュミエーテル',
        'Tail Slap': 'テールスラップ',
        'Blissful Arrow': '聖なる矢',
        'Blissful Hammer': '聖なる槌',
        'Jagadishwari': 'ジャガディッシュワリ',
        'Alluring Embrace': '魅惑の抱擁',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Dreaming Kshatriya': '梦寐的刹帝利',
        'Lakshmi': '吉祥天女',
      },
      'replaceText': {
        '--chanchala end--': '--反复无常结束--',
        '\\(mid\\)': '(中)',
        '\\(out\\)': '(外)',
        '/dance': '/跳舞',
        'Alluring Arm': '魅惑之臂',
        'Blissful Spear': '圣枪',
        '(?<!-)Chanchala': '反复无常',
        'Divine Denial': '完全拒绝',
        'Divine Desire': '完全引诱',
        'Divine Doubt': '完全惑乱',
        'Hand Of Beauty': '优美的左手',
        'Hand Of Grace': '优雅的右手',
        'Inner Demons': '心魔',
        'Stotram': '赞歌',
        'The Pall Of Light': '光之瀑布',
        'The Path Of Light': '光之波动',
        'The Pull Of Light': '光之奔流',
        'Vril': '元气',
        'Tail Slap': '尾部猛击',
        'Blissful Arrow': '圣箭',
        'Blissful Hammer': '圣锤',
        'Jagadishwari': '至上天母',
        'Alluring Embrace': '魅惑拥抱',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Dreaming Kshatriya': '신도화된 크샤트리아',
        'Lakshmi': '락슈미',
      },
      'replaceText': {
        '/dance': '/춤',
        'Alluring Arm': '매혹적인 팔',
        'Blissful Spear': '성스러운 창',
        'Chanchala': '찬찰라',
        'Divine Denial': '완전한 거절',
        'Divine Desire': '완전한 유인',
        'Divine Doubt': '완전한 혼란',
        'Hand Of Beauty': '아름다운 왼손',
        'Hand Of Grace': '우아한 오른손',
        'Inner Demons': '내면의 악마',
        'Stotram': '스토트람',
        'The Pall Of Light': '빛의 폭포',
        'The Path Of Light': '빛의 파동',
        'The Pull Of Light': '빛의 급류',
        'Vril': '락슈미 에테르',
        'Tail Slap': '꼬리치기',
        'Blissful Arrow': '성스러운 화살',
        'Blissful Hammer': '성스러운 망치',
        'Jagadishwari': '자가디슈와리',
        'Alluring Embrace': '매혹적인 포옹',
      },
    },
  ],
};

export default triggerSet;
