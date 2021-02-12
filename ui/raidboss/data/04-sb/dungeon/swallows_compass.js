import Conditions from '../../../../../resources/conditions.js';
import NetRegexes from '../../../../../resources/netregexes.js';
import { Responses } from '../../../../../resources/responses.js';
import ZoneId from '../../../../../resources/zone_id.js';

export default {
  zoneId: ZoneId.TheSwallowsCompass,
  timelineFile: 'swallows_compass.txt',
  triggers: [
    {
      id: 'Swallows Compass Tengu Clout',
      netRegex: NetRegexes.startsUsing({ id: '2B95', source: 'Otengu', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2B95', source: 'Otengu', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2B95', source: 'Ô-Tengu', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2B95', source: 'オオテング', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2B95', source: '大天狗', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2B95', source: '대텐구', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Swallows Compass Tengu Might',
      netRegex: NetRegexes.startsUsing({ id: '2B94', source: 'Otengu' }),
      netRegexDe: NetRegexes.startsUsing({ id: '2B94', source: 'Otengu' }),
      netRegexFr: NetRegexes.startsUsing({ id: '2B94', source: 'Ô-Tengu' }),
      netRegexJa: NetRegexes.startsUsing({ id: '2B94', source: 'オオテング' }),
      netRegexCn: NetRegexes.startsUsing({ id: '2B94', source: '大天狗' }),
      netRegexKo: NetRegexes.startsUsing({ id: '2B94', source: '대텐구' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'Swallows Compass Tengu Wile',
      netRegex: NetRegexes.startsUsing({ id: '2B97', source: 'Otengu', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2B97', source: 'Otengu', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2B97', source: 'Ô-Tengu', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2B97', source: 'オオテング', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2B97', source: '大天狗', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2B97', source: '대텐구', capture: false }),
      response: Responses.lookAway(),
    },
    {
      // 7201 is Tengu Ember.
      id: 'Swallows Compass Ember Spawn',
      netRegex: NetRegexes.addedCombatantFull({ npcNameId: '7201', capture: false }),
      suppressSeconds: 5,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Avoid Fire Orbs',
          de: 'Weiche den Feuerorbs aus',
        },
      },
    },
    {
      id: 'Swallows Compass Flames Of Hate',
      netRegex: NetRegexes.startsUsing({ id: '2898', source: 'Tengu Ember', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2898', source: 'Tengu-Glut', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2898', source: 'Tengu-Bi', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2898', source: '天狗火', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2898', source: '天狗火', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2898', source: '텐구불', capture: false }),
      suppressSeconds: 5,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Away From Fireballs',
          de: 'Weg von den Feuerkugeln',
        },
      },
    },
    {
      id: 'Swallows Compass Right Palm',
      netRegex: NetRegexes.startsUsing({ id: '2B9D', source: 'Daidarabotchi', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2B9D', source: 'Daidarabotchi', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2B9D', source: 'Daidarabotchi', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2B9D', source: 'ダイダラボッチ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2B9D', source: '大太法师', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2B9D', source: '다이다라봇치', capture: false }),
      response: Responses.goLeft(),
    },
    {
      id: 'Swallows Compass Left Palm',
      netRegex: NetRegexes.startsUsing({ id: '2B9E', source: 'Daidarabotchi', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2B9E', source: 'Daidarabotchi', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2B9E', source: 'Daidarabotchi', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2B9E', source: 'ダイダラボッチ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2B9E', source: '大太法师', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2B9E', source: '다이다라봇치', capture: false }),
      response: Responses.goRight(),
    },
    {
      id: 'Swallows Compass Mountain Falls',
      netRegex: NetRegexes.headMarker({ id: '0087' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Swallows Compass Mirage',
      netRegex: NetRegexes.headMarker({ id: '0001' }),
      condition: Conditions.targetIsYou(),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: '5x Puddles on YOU',
          de: '5x Flächen auf DIR',
        },
      },
    },
    {
      id: 'Swallows Compass Mythmaker',
      netRegex: NetRegexes.ability({ id: '2BA3', source: 'Daidarabotchi', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '2BA3', source: 'Daidarabotchi', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '2BA3', source: 'Daidarabotchi', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '2BA3', source: 'ダイダラボッチ', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '2BA3', source: '大太法师', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '2BA3', source: '다이다라봇치', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Swallows Compass Six Fulms Under',
      netRegex: NetRegexes.gainsEffect({ effectId: '237' }),
      condition: Conditions.targetIsYou(),
      suppressSeconds: 2, // If the user stays in, they will get more reminders.
      alarmText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'OUT OF THE LAKE',
          de: 'RAUS AUS DEM SEE',
        },
      },
    },
    {
      id: 'Swallows Compass Short End',
      netRegex: NetRegexes.startsUsing({ id: ['2BA6', '2D07'], source: ['Qitian Dasheng', 'Shadow Of The Sage'] }),
      netRegexDe: NetRegexes.startsUsing({ id: ['2BA6', '2D07'], source: ['Qitian Dasheng', 'Schatten Des Weisen'] }),
      netRegexFr: NetRegexes.startsUsing({ id: ['2BA6', '2D07'], source: ['Qitian Dasheng', 'Ombre De Qitian Dasheng'] }),
      netRegexJa: NetRegexes.startsUsing({ id: ['2BA6', '2D07'], source: ['セイテンタイセイ', 'セイテンタイセイの影'] }),
      netRegexCn: NetRegexes.startsUsing({ id: ['2BA6', '2D07'], source: ['齐天大圣', '齐天大圣的幻影'] }),
      netRegexKo: NetRegexes.startsUsing({ id: ['2BA6', '2D07'], source: ['제천대성', '제천대성의 분신'] }),
      condition: Conditions.caresAboutPhysical(),
      suppressSeconds: 5,
      response: Responses.tankBuster(),
    },
    {
      id: 'Swallows Compass Mount Huaguo',
      netRegex: NetRegexes.startsUsing({ id: ['2BAA', '2D08'], source: ['Qitian Dasheng', 'Shadow Of The Sage'], capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['2BAA', '2D08'], source: ['Qitian Dasheng', 'Schatten Des Weisen'], capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['2BAA', '2D08'], source: ['Qitian Dasheng', 'Ombre De Qitian Dasheng'], capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['2BAA', '2D08'], source: ['セイテンタイセイ', 'セイテンタイセイの影'], capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: ['2BAA', '2D08'], source: ['齐天大圣', '齐天大圣的幻影'], capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: ['2BAA', '2D08'], source: ['제천대성', '제천대성의 분신'], capture: false }),
      condition: Conditions.caresAboutAOE(),
      suppressSeconds: 5,
      response: Responses.aoe(),
    },
    {
      // Both Ends has a number of different possibilities for how it's used.
      // It can be alone, or it can be accompanied by the other form,
      // or it can be alongside Five-Fingered Punishment.
      // If there's a blue one on the field, we want to be in, no matter what.
      // If there's no blue, we want to be away from red.
      // In order to avoid collisions and confusion, we collect first.
      id: 'Swallows Compass Both Ends Collect',
      netRegex: NetRegexes.startsUsing({ id: ['2BA9', '2BAF'], source: ['Qitian Dasheng', 'Shadow Of The Sage'], capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['2BA9', '2BAF'], source: ['Qitian Dasheng', 'Schatten Des Weisen'], capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['2BA9', '2BAF'], source: ['Qitian Dasheng', 'Ombre De Qitian Dasheng'], capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['2BA9', '2BAF'], source: ['セイテンタイセイ', 'セイテンタイセイの影'], capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: ['2BA9', '2BAF'], source: ['齐天大圣', '齐天大圣的幻影'], capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: ['2BA9', '2BAF'], source: ['제천대성', '제천대성의 분신'], capture: false }),
      run: (data) => data.dynamo = true,
    },
    {
      // 2BA8,2BAE is red, chariot, 2BA9,2BAF is blue, dynamo.
      id: 'Swallows Compass Both Ends Call',
      netRegex: NetRegexes.startsUsing({ id: ['2BA8', '2BA9', '2BAE', '2BAF'], source: ['Qitian Dasheng', 'Shadow Of The Sage'], capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['2BA8', '2BA9', '2BAE', '2BAF'], source: ['Qitian Dasheng', 'Schatten Des Weisen'], capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['2BA8', '2BA9', '2BAE', '2BAF'], source: ['Qitian Dasheng', 'Ombre De Qitian Dasheng'], capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['2BA8', '2BA9', '2BAE', '2BAF'], source: ['セイテンタイセイ', 'セイテンタイセイの影'], capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: ['2BA8', '2BA9', '2BAE', '2BAF'], source: ['齐天大圣', '齐天大圣的幻影'], capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: ['2BA8', '2BA9', '2BAE', '2BAF'], source: ['제천대성', '제천대성의 분신'], capture: false }),
      delaySeconds: 0.5,
      suppressSeconds: 5,
      alertText: (data, _, output) => {
        if (data.dynamo)
          return output.dynamo();
        return output.chariot();
      },
      outputStrings: {
        dynamo: {
          en: 'Close to blue staff',
          de: 'Nahe am blauen Stab',
        },
        chariot: {
          en: 'Away from red staff',
          de: 'Weg vom roten Stab',
        },
      },
      run: (data) => delete data.dynamo,
    },
    {
      id: 'Swallows Compass Five Fingered Punishment',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      response: Responses.stackMarkerOn('info'), // Info rather than alert to avoid collision with Both Ends.
    },
    {
      // The Long end is a knockback in phase 1, but not in phase 2.
      // Using the source name for tethers runs into localizing issues,
      // so we just track the phase instead.
      // The ability use here is unnamed, the teleport to the center to begin the intermission.
      id: 'Swallows Compass Intermission Tracking',
      netRegex: NetRegexes.ability({ id: '2CC7', source: 'Qitian Dasheng', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '2CC7', source: 'Qitian Dasheng', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '2CC7', source: 'Qitian Dasheng', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '2CC7', source: 'セイテンタイセイ', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '2CC7', source: '齐天大圣', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '2CC7', source: '제천대성', capture: false }),
      run: (data) => data.seenIntermission = true,
    },
    {
      // Either one or two tethers can be present for Long End.
      // We have to handle both possibilities, so we collect targets first for later analysis.
      id: 'Swallows Compass Long End Collect',
      netRegex: NetRegexes.tether({ id: '0029' }),
      run: (data, matches) => {
        data.tethers = data.tethers || [];
        data.tethers.push(matches.target);
      },
    },
    {
      id: 'Swallows Compass Long End Call',
      netRegex: NetRegexes.tether({ id: '0029', capture: false }),
      delaySeconds: 0.5,
      alertText: (data, _, output) => {
        if (data.tethers.includes(data.me)) {
          if (data.seenIntermission)
            return output.target();
          return output.knockback();
        }
        return output.avoid();
      },
      outputStrings: {
        target: {
          en: 'Laser on YOU',
          de: 'Laser auf DIR',
        },
        knockback: {
          en: 'Knockback laser on YOU',
          de: 'Rückstoßlaser auf DIR',
        },
        avoid: {
          en: 'Avoid tethers',
          de: 'Vermeide die Verbindungen',
        },
      },
      run: (data) => delete data.tethers,
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Daidarabotchi': 'Daidarabotchi',
        'Otengu': 'Otengu',
        'Qitian Dasheng': 'Qitian Dasheng',
        'Serenity': 'Die Stille',
        'Shadow Of The Sage': 'Schatten des Weisen',
        'Tengu Ember': 'Tengu-Glut',
        'The Dragon\'s Mouth': 'Maul des Drachen',
        'The Heart Of The Dragon': 'Herz des Drachen',
      },
      'replaceText': {
        'Both Ends': 'Beide Enden',
        'Clout Of The Tengu': 'Atem des Tengu',
        'Equal Of Heaven': 'Dem Himmel gleich',
        'Five-Fingered Punishment': 'Strafende Finger',
        'Flames Of Hate': 'Flammen des Hasses',
        'Greater Palm': 'Große Handfläche',
        'Might Of The Tengu': 'Fäuste des Tengu',
        'Mirage': 'Mirage',
        'Mount Huaguo': 'Huaguo',
        'Mountain Falls': 'Bergrutsch',
        'Mythmaker': 'Erdrütteln',
        'Second Heaven': 'Dreiunddreißig Himmel',
        'Splitting Hairs': 'Haarspalterei',
        'The Long End': 'Langes Ende',
        'The Short End': 'Kurzes Ende',
        'Tributary': 'Großer Fall',
        'Wile Of The Tengu': 'Tricks des Tengu',
        'Yama-Kagura': 'Yamakagura',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Daidarabotchi': 'Daidarabotchi',
        'Otengu': 'ô-tengu',
        'Qitian Dasheng': 'Qitian Dasheng',
        'Serenity': 'Sanctuaire de Jade',
        'Shadow Of The Sage': 'ombre de Qitian Dasheng',
        'Tengu Ember': 'tengu-bi',
        'The Dragon\'s Mouth': 'Porte de Dairyu',
        'The Heart Of The Dragon': 'Salle des Alignements',
      },
      'replaceText': {
        'Both Ends': 'Coup de bâton tournicotant',
        'Clout Of The Tengu': 'Tengu-kaze',
        'Equal Of Heaven': 'Égal des Cieux',
        'Five-Fingered Punishment': 'Mont Wuxing',
        'Flames Of Hate': 'Rancune furieuse',
        'Greater Palm': 'Paume colossale',
        'Might Of The Tengu': 'Tengu-tsubute',
        'Mirage': 'Mirage',
        'Mount Huaguo': 'Mont Haguo',
        'Mountain Falls': 'Raz-de-montagne',
        'Mythmaker': 'Grand bouleversement',
        'Second Heaven': 'Trayastrimsha',
        'Splitting Hairs': 'Dédoublement',
        'The Long End': 'Coup de bâton long',
        'The Short End': 'Coup de bâton court',
        'Tributary': 'Cascade colossale',
        'Wile Of The Tengu': 'Malice de tengu',
        'Yama-Kagura': 'Yama-kagura',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Daidarabotchi': 'ダイダラボッチ',
        'Otengu': 'オオテング',
        'Qitian Dasheng': 'セイテンタイセイ',
        'Serenity': '玉聖祠',
        'Shadow Of The Sage': 'セイテンタイセイの影',
        'Tengu Ember': '天狗火',
        'The Dragon\'s Mouth': '大龍関門',
        'The Heart Of The Dragon': '龍脈之間',
      },
      'replaceText': {
        'Both Ends': '如意大旋風',
        'Clout Of The Tengu': '天狗風',
        'Equal Of Heaven': '斉天撃',
        'Five-Fingered Punishment': '五行山',
        'Flames Of Hate': '怨念の炎',
        'Greater Palm': '大掌底',
        'Might Of The Tengu': '天狗礫',
        'Mirage': 'Mirage',
        'Mount Huaguo': '花果山',
        'Mountain Falls': '山津波',
        'Mythmaker': '驚天動地',
        'Second Heaven': '三十三天',
        'Splitting Hairs': '地サツ数',
        'The Long End': '如意剛力突',
        'The Short End': '如意烈風突',
        'Tributary': '大瀑布',
        'Wile Of The Tengu': '天狗の仕業',
        'Yama-Kagura': '山神楽',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Daidarabotchi': '大太法师',
        'Otengu': '大天狗',
        'Qitian Dasheng': '齐天大圣',
        'Serenity': '玉圣祠',
        'Shadow Of The Sage': '齐天大圣的幻影',
        'Tengu Ember': '天狗火',
        'The Dragon\'s Mouth': '大龙关门',
        'The Heart Of The Dragon': '龙脉之间',
      },
      'replaceText': {
        'Both Ends': '如意大旋风',
        'Clout Of The Tengu': '天狗风',
        'Equal Of Heaven': '齐天击',
        'Five-Fingered Punishment': '五行山',
        'Flames Of Hate': '怨念之火',
        'Greater Palm': '掌击',
        'Might Of The Tengu': '天狗碾',
        'Mirage': 'Mirage',
        'Mount Huaguo': '花果山',
        'Mountain Falls': '泥石流',
        'Mythmaker': '惊天动地',
        'Second Heaven': '三十三天',
        'Splitting Hairs': '地煞数',
        'The Long End': '如意刚力突',
        'The Short End': '如意烈风突',
        'Tributary': '大瀑布',
        'Wile Of The Tengu': '天狗妙计',
        'Yama-Kagura': '山神乐',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Daidarabotchi': '다이다라봇치',
        'Otengu': '대텐구',
        'Qitian Dasheng': '제천대성',
        'Serenity': '옥성 사당',
        'Shadow Of The Sage': '제천대성의 분신',
        'Tengu Ember': '텐구불',
        'The Dragon\'s Mouth': '대룡 관문',
        'The Heart Of The Dragon': '용맥의 방',
      },
      'replaceText': {
        'Both Ends': '여의 대선풍',
        'Clout Of The Tengu': '회오리바람',
        'Equal Of Heaven': '제천격',
        'Five-Fingered Punishment': '오행산',
        'Flames Of Hate': '원념의 불꽃',
        'Greater Palm': '큰 손바닥',
        'Might Of The Tengu': '돌팔매',
        'Mirage': 'Mirage',
        'Mount Huaguo': '화과산',
        'Mountain Falls': '산해일',
        'Mythmaker': '경천동지',
        'Second Heaven': '삼십삼천',
        'Splitting Hairs': '분신술',
        'The Long End': '여의 강력 찌르기',
        'The Short End': '여의 열풍 찌르기',
        'Tributary': '대폭포',
        'Wile Of The Tengu': '텐구의 소행',
        'Yama-Kagura': '산타령',
      },
    },
  ],
};
