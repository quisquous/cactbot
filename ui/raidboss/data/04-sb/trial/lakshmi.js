import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';

// Lakshmi Normal
export default {
  zoneId: ZoneId.Emanation,
  timelineFile: 'lakshmi.txt',
  triggers: [
    {
      id: 'Lakshmi Chanchala Gain',
      netRegex: NetRegexes.gainsEffect({ target: 'Lakshmi', effectId: '582', capture: false }),
      netRegexDe: NetRegexes.gainsEffect({ target: 'Lakshmi', effectId: '582', capture: false }),
      netRegexFr: NetRegexes.gainsEffect({ target: 'Lakshmi', effectId: '582', capture: false }),
      netRegexJa: NetRegexes.gainsEffect({ target: 'ラクシュミ', effectId: '582', capture: false }),
      netRegexCn: NetRegexes.gainsEffect({ target: '吉祥天女', effectId: '582', capture: false }),
      netRegexKo: NetRegexes.gainsEffect({ target: '락슈미', effectId: '582', capture: false }),
      run: function(data) {
        data.chanchala = true;
      },
    },
    {
      id: 'Lakshmi Chanchala Lose',
      netRegex: NetRegexes.losesEffect({ target: 'Lakshmi', effectId: '582', capture: false }),
      netRegexDe: NetRegexes.losesEffect({ target: 'Lakshmi', effectId: '582', capture: false }),
      netRegexFr: NetRegexes.losesEffect({ target: 'Lakshmi', effectId: '582', capture: false }),
      netRegexJa: NetRegexes.losesEffect({ target: 'ラクシュミ', effectId: '582', capture: false }),
      netRegexCn: NetRegexes.losesEffect({ target: '吉祥天女', effectId: '582', capture: false }),
      netRegexKo: NetRegexes.losesEffect({ target: '락슈미', effectId: '582', capture: false }),
      run: function(data) {
        data.chanchala = false;
      },
    },
    {
      // 2492 is normal, 2493 is under Chanchala
      id: 'Lakshmi Pull of Light',
      netRegex: NetRegexes.startsUsing({ id: ['2492', '2493'], source: 'Lakshmi' }),
      netRegexDe: NetRegexes.startsUsing({ id: ['2492', '2493'], source: 'Lakshmi' }),
      netRegexFr: NetRegexes.startsUsing({ id: ['2492', '2493'], source: 'Lakshmi' }),
      netRegexJa: NetRegexes.startsUsing({ id: ['2492', '2493'], source: 'ラクシュミ' }),
      netRegexCn: NetRegexes.startsUsing({ id: ['2492', '2493'], source: '吉祥天女' }),
      netRegexKo: NetRegexes.startsUsing({ id: ['2492', '2493'], source: '락슈미' }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.tankBuster('info'),
    },
    {
      id: 'Lakshmi Stotram',
      netRegex: NetRegexes.startsUsing({ id: '249E', source: 'Lakshmi', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '249E', source: 'Lakshmi', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '249E', source: 'Lakshmi', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '249E', source: 'ラクシュミ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '249E', source: '吉祥天女', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '249E', source: '락슈미', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      // Intermission ability. The user WILL die if they don't use Vril.
      id: 'Lakshmi Jagadishwari',
      netRegex: NetRegexes.ability({ id: '2342', source: 'Lakshmi', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '2342', source: 'Lakshmi', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '2342', source: 'Lakshmi', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '2342', source: 'ラクシュミ', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '2342', source: '吉祥天女', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '2342', source: '락슈미', capture: false }),
      alarmText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'USE VRIL OR DIE',
          fr: 'UTILISEZ VRIL OU MOURREZ',
        },
      },
    },
    {
      id: 'Lakshmi Divine Denial',
      netRegex: NetRegexes.startsUsing({ id: '2485', source: 'Lakshmi', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2485', source: 'Lakshmi', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2485', source: 'Lakshmi', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2485', source: 'ラクシュミ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2485', source: '吉祥天女', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2485', source: '락슈미', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Vril + Knockback',
          de: 'Vril + Rückstoß',
          fr: 'Vril + Poussée',
          ja: 'エーテル + 完全なる拒絶',
          cn: '完全拒绝',
          ko: '락슈미 에테르 + 넉백',
        },
      },
    },
    {
      // Nobody with a different marker should be told to stack.
      id: 'Lakshmi Headmarker Collect',
      netRegex: NetRegexes.headMarker({ }),
      run: (data, matches) => {
        data.avoidStack = data.avoidStack || [];
        if (matches.id !== '003E')
          data.avoidStack.push(matches.target);
      },
    },
    {
      // Activating on any use of Hand of Beauty/Grace or Alluring Arm.
      // Head markers don't appear until the end of the castbar,
      // and every head marker section begins with one of these abilities,
      // so this should be perfectly safe.
      id: 'Lakshmi Headmarker Cleanup',
      netRegex: NetRegexes.startsUsing({ id: ['2486', '2487', '2488'], source: 'Lakshmi', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['2486', '2487', '2488'], source: 'Lakshmi', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['2486', '2487', '2488'], source: 'Lakshmi', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['2486', '2487', '2488'], source: 'ラクシュミ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: ['2486', '2487', '2488'], source: '吉祥天女', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: ['2486', '2487', '2488'], source: '락슈미', capture: false }),
      run: (data) => delete data.avoidStack,
    },
    { // Stack marker
      id: 'Lakshmi Pall of Light',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      delaySeconds: 0.5,
      alertText: function(data, matches, output) {
        if (!data.avoidStack.includes(data.me))
          return;
        return output.dontStack();
      },
      infoText: function(data, matches, output) {
        if (data.avoidStack.includes(data.me))
          return;
        if (data.me === matches.target)
          return output.stackOnYou();
        return output.stackOn({ player: matches.target });
      },
      outputStrings: {
        dontStack: {
          en: 'Don\'t Stack!',
          fr: 'Ne vous packez pas !',
        },
        stackOnYou: {
          en: 'Stack on YOU',
          de: 'Stack auf DIR',
          fr: 'Package sur VOUS',
          ja: '自分に頭割り',
          cn: '分摊点名',
          ko: '쉐어징 대상자',
        },
        stackOn: {
          en: 'Stack on ${player}',
          de: 'Sammeln auf ${player}',
          fr: 'Packez-vous sur ${player}',
          ja: '${player}と頭割り',
          cn: '靠近${player}分摊',
          ko: '"${player}" 쉐어징',
        },
      },
    },
    {
      // Off-tank cleave
      id: 'Lakshmi Path of Light',
      netRegex: NetRegexes.headMarker({ id: '000E' }),
      response: Responses.tankCleave(),
    },
    {
      // Cross aoe
      id: 'Lakshmi Hand of Grace',
      netRegex: NetRegexes.headMarker({ id: '006B' }),
      condition: Conditions.targetIsYou(),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
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
      // Circle
      id: 'Lakshmi Hand of Beauty',
      netRegex: NetRegexes.headMarker({ id: '006D' }),
      condition: Conditions.targetIsYou(),
      infoText: function(data, _, output) {
        if (data.chanchala)
          return output.powerFlower();

        return output.flower();
      },
      outputStrings: {
        powerFlower: {
          en: 'Expanding Flower Marker',
        },
        flower: {
          en: 'Flower Marker',
          de: 'Blumen-Marker',
          fr: 'Marqueur fleur',
          ja: '自分に左手',
          cn: '花点名',
          ko: '원형 장판 징',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Blissful Arrow': 'Blissful Arrow (cross)',
        'Blissful Spear': 'Blissful Spear (circle)',
        'The Pall Of Light': 'Pall Of Light (stack)',
        'The Path Of Light': 'Path Of Light (OT cleave)',
        'The Pull Of Light': 'Pull Of Light (MT buster)',
      },
    },
    {
      'locale': 'de',
      'missingTranslations': true,
      'replaceSync': {
        'Dreaming Kshatriya': 'verträumt(?:e|er|es|en) Kshatriya',
        'Lakshmi': 'Lakshmi',
      },
      'replaceText': {
        'Adds Appear': 'Adds erscheinen',
        'Alluring Arm': 'Anziehender Arm',
        'Blissful Spear': 'Speer der Gnade',
        'Chanchala': 'Chanchala',
        'Divine Denial': 'Göttliche Leugnung',
        'Divine Desire': 'Göttliche Lockung',
        'Divine Doubt': 'Göttliche Bestürzung',
        'Hand Of Beauty': 'Hand der Schönheit',
        'Hand Of Grace': 'Hand der Anmut',
        'Hands Of Grace/Beauty': 'Hand Der Anmut/Schönheit',
        'Inner Demons': 'Dämonen in dir',
        'Stotram': 'Stotram',
        'The Pall Of Light': 'Flut des Lichts',
        'The Path Of Light': 'Pfad des Lichts',
        'The Pull Of Light': 'Strom des Lichts',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Dreaming Kshatriya': 'kshatriya rêveuse',
        'Lakshmi': 'Lakshmi',
        'Vril': 'Vril',
      },
      'replaceText': {
        '--chanchala start--': '--début de chanchala--',
        '--chanchala end--': '--fin de chanchala--',
        '--vril despawn--': '--disparition de vril--',
        '--vril spawn--': '--apparition de vril--',
        'Adds Appear': 'Apparition d\'adds',
        'Aether Drain': 'Absorption d\'éther',
        'Alluring Arm': 'Bras séduisants',
        'Alluring Embrace': 'Étreinte séduisante',
        'Blissful Arrow(?!/Spear)': 'Flèche béatifiante',
        'Blissful Arrow/Spear': 'Flèche/Épieu béatifiant',
        'Blissful Spear': 'Épieu béatifiant',
        '(?<! )Chanchala(?! )': 'Chanchala',
        'Divine Denial': 'Refus divin',
        'Divine Desire': 'Désir divin',
        'Divine Doubt': 'Doute divin',
        'Hand Of Beauty': 'Main de la beauté',
        'Hand Of Grace': 'Main de la grâce',
        'Hands Of Grace/Beauty': 'Main De La Grâce/Beauté',
        'Inner Demons': 'Démons intérieurs',
        'Jagadishwari': 'Jagadishwari',
        'Stotram': 'Stotram',
        'Tail Slap': 'Gifle caudale',
        'The Pall Of Light': 'Voile de lumière (package)',
        'The Path Of Light': 'Voie de lumière (OT cleave)',
        'The Pull Of Light': 'Flot de lumière (MT buster)',
        '(?<! )Vril(?! )': 'Vril',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Dreaming Kshatriya': 'テンパード・クシャトリア',
        'Lakshmi': 'ラクシュミ',
      },
      'replaceText': {
        'Adds Appear': '雑魚',
        'Alluring Arm': '魅惑の腕',
        'Blissful Spear': '聖なる槍',
        'Chanchala': 'チャンチャラー',
        'Divine Denial': '完全なる拒絶',
        'Divine Desire': '完全なる誘引',
        'Divine Doubt': '完全なる惑乱',
        'Hand Of Beauty': '優美なる左手',
        'Hand Of Grace': '優雅なる右手',
        'Hands Of Grace/Beauty': '右手/左手',
        'Inner Demons': 'イナーデーモン',
        'Stotram': 'ストトラム',
        'The Pall Of Light': '光の瀑布',
        'The Path Of Light': '光の波動',
        'The Pull Of Light': '光の奔流',
      },
    },
    {
      'locale': 'cn',
      'missingTranslations': true,
      'replaceSync': {
        'Dreaming Kshatriya': '梦寐的刹帝利',
        'Lakshmi': '吉祥天女',
      },
      'replaceText': {
        'Adds Appear': '小怪出现',
        'Alluring Arm': '魅惑之臂',
        'Blissful Spear': '圣枪',
        'Chanchala': '反复无常',
        'Divine Denial': '完全拒绝',
        'Divine Desire': '完全引诱',
        'Divine Doubt': '完全惑乱',
        'Hand Of Beauty': '优美的左手',
        'Hand Of Grace': '优雅的右手',
        'Hands Of Grace/Beauty': '右手/左手',
        'Inner Demons': '心魔',
        'Stotram': '赞歌',
        'The Pall Of Light': '光之瀑布',
        'The Path Of Light': '光之波动',
        'The Pull Of Light': '光之奔流',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {
        'Dreaming Kshatriya': '신도화된 크샤트리아',
        'Lakshmi': '락슈미',
      },
      'replaceText': {
        'Adds Appear': '쫄',
        'Alluring Arm': '매혹적인 팔',
        'Blissful Spear': '성스러운 창',
        'Chanchala': '찬찰라',
        'Divine Denial': '완전한 거절',
        'Divine Desire': '완전한 유인',
        'Divine Doubt': '완전한 혼란',
        'Hand Of Beauty': '아름다운 왼손',
        'Hand Of Grace': '우아한 오른손',
        'Hands Of Grace/Beauty': '아름다운 왼손/오른손',
        'Inner Demons': '내면의 악마',
        'Stotram': '스토트람',
        'The Pall Of Light': '빛의 폭포',
        'The Path Of Light': '빛의 파동',
        'The Pull Of Light': '빛의 급류',
      },
    },
  ],
};
