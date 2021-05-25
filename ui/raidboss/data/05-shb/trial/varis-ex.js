import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';

export default {
  zoneId: ZoneId.MemoriaMiseraExtreme,
  timelineFile: 'varis-ex.txt',
  timelineTriggers: [
    {
      id: 'VarisEx Ignis Est',
      // 4CB5: Varis starts using
      // 4CB6, 4CC5: Ignis Est starts using
      regex: /^Ignis Est$/,
      // Many alerts are 5 seconds ahead (stack, knockback), so differentiate.
      beforeSeconds: 7,
      durationSeconds: 7,
      // In and Out both use severity info here so that it doesn't conflict with the
      // spread/knockback/stack alert callouts.  These are always static, so it isn't
      // as important to differentiate with noise.
      //
      // Also, these are timeline triggers because there is a varying time between when
      // the initial cast (by Varis) happens and when other things happen.
      // Making them timeline triggers interleaves callouts a little bit more nicely
      // without having to hardcode a lot of delays.
      //
      // Also, 7 seconds interleaves properly where the order of callouts is the order
      // of things happening, i.e. "out => knockback", in first phase.
      response: Responses.getOut('info'),
    },
    {
      id: 'VarisEx Ventus Est',
      // 4CC6: Varis starts using
      // 4CC7, 4CC8: Ventus Est starts using
      regex: /^Ventus Est$/,
      beforeSeconds: 7,
      durationSeconds: 7,
      response: Responses.getIn('info'),
    },
    {
      id: 'VarisEx Festina Lente',
      // This is headMarker({id: '00A1'}), but is a timeline trigger both
      // for more warning, and to precede the "dodge clones" call.
      regex: /^Festina Lente$/,
      beforeSeconds: 6,
      durationSeconds: 6,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          dodgeClonesAndStack: {
            en: 'Dodge Clones + Stack',
            de: 'Klonen ausweichen und Sammeln',
            fr: 'Évitez les Clones + packez-vous',
            ja: 'ターミナス・エストを避ける／頭割り集合',
            cn: '躲避剑气 + 集合分摊',
            ko: '분신 피하기 + 집합',
          },
          stackMarker: Outputs.stackMarker,
        };

        // In any case where you need to position stacks in the right lane,
        // use this special call, no matter how far ahead in time it is.
        if (data.clonesActive) {
          // Sometimes in the fight, dodge clones + stack happen right next to each other.
          // In these cases, don't also call out "dodge clones", by setting this variable.
          // For cases where they are far apart, this gets cleared in the cleanup trigger.
          data.suppressDodgeCloneCall = true;
          return { alertText: output.dodgeClonesAndStack() };
        }
        return { alertText: output.stackMarker() };
      },
    },
    {
      id: 'VarisEx Magitek Burst',
      regex: /^Magitek Burst$/,
      beforeSeconds: 15,
      durationSeconds: 5,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Spread Soon',
          de: 'Bald verteilen',
          fr: 'Dispersez-vous bientôt',
          ja: 'まもなく散開',
          cn: '即将散开',
          ko: '잠시후 산개',
        },
      },
    },
  ],
  triggers: [
    {
      id: 'VarisEx Phase 2',
      // 4CCC: Vivere Militare Est
      netRegex: NetRegexes.ability({ source: 'Varis Yae Galvus', id: '4CCC', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Varis yae Galvus', id: '4CCC', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Varis yae Galvus', id: '4CCC', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'ヴァリス・イェー・ガルヴァス', id: '4CCC', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '瓦厉斯·耶·加尔乌斯', id: '4CCC', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '바리스 예 갈부스', id: '4CCC', capture: false }),
      run: (data) => {
        data.phase = 2;
      },
    },
    {
      id: 'VarisEx Phase 5',
      netRegex: NetRegexes.ability({ source: 'Varis Yae Galvus', id: '4CE2', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Varis yae Galvus', id: '4CE2', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Varis yae Galvus', id: '4CE2', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'ヴァリス・イェー・ガルヴァス', id: '4CE2', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '瓦厉斯·耶·加尔乌斯', id: '4CE2', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '바리스 예 갈부스', id: '4CE2', capture: false }),
      run: (data) => {
        data.phase = 5;
      },
    },
    {
      id: 'VarisEx Clones',
      netRegex: NetRegexes.ability({ source: 'Phantom Varis', id: '4CB3', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Varis-Doppelgänger', id: '4CB3', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'double de Varis', id: '4CB3', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'ヴァリスの幻影', id: '4CB3', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '瓦厉斯的幻影', id: '4CB3', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '바리스의 환영', id: '4CB3', capture: false }),
      run: (data) => {
        data.clonesActive = true;
      },
    },
    {
      id: 'VarisEx Altius',
      netRegex: NetRegexes.startsUsing({ source: 'Varis Yae Galvus', id: '4CCA', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Varis yae Galvus', id: '4CCA', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Varis yae Galvus', id: '4CCA', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ヴァリス・イェー・ガルヴァス', id: '4CCA', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '瓦厉斯·耶·加尔乌斯', id: '4CCA', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '바리스 예 갈부스', id: '4CCA', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Bait Slashes',
          de: 'Schnitte ködern',
          fr: 'Attirez les taillades',
          ja: '縦へ、アルティウスを誘導',
          cn: 'Boss身后诱导剑气方向',
          ko: '슬래시 유도',
        },
      },
    },
    {
      id: 'VarisEx Citius',
      netRegex: NetRegexes.startsUsing({ source: 'Varis Yae Galvus', id: '4CF0' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Varis yae Galvus', id: '4CF0' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Varis yae Galvus', id: '4CF0' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ヴァリス・イェー・ガルヴァス', id: '4CF0' }),
      netRegexCn: NetRegexes.startsUsing({ source: '瓦厉斯·耶·加尔乌斯', id: '4CF0' }),
      netRegexKo: NetRegexes.startsUsing({ source: '바리스 예 갈부스', id: '4CF0' }),
      alertText: (data, matches, output) => {
        const target = matches.target;
        if (data.me === target)
          return output.tankBusterOnYou();

        if (data.role === 'dps')
          return output.avoidTankCleave();

        return output.tankBusterOn({ player: data.ShortName(target) });
      },
      outputStrings: {
        tankBusterOnYou: Outputs.tankBusterOnYou,
        avoidTankCleave: Outputs.avoidTankCleave,
        tankBusterOn: Outputs.tankBusterOnPlayer,
      },
    },
    {
      id: 'VarisEx Alea Iacta Est',
      netRegex: NetRegexes.startsUsing({ source: 'Varis Yae Galvus', id: '4CD2', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Varis yae Galvus', id: '4CD2', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Varis yae Galvus', id: '4CD2', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ヴァリス・イェー・ガルヴァス', id: '4CD2', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '瓦厉斯·耶·加尔乌斯', id: '4CD2', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '바리스 예 갈부스', id: '4CD2', capture: false }),
      response: Responses.getBehind(),
    },
    {
      // This trigger match the fourth Alea Iacta Est that Varis used.
      // The player should go front to avoid the fifth one, which hits back.
      id: 'VarisEx Alea Iacta Est Front',
      netRegex: NetRegexes.ability({ source: 'Varis Yae Galvus', id: '4CD5', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Varis yae Galvus', id: '4CD5', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Varis yae Galvus', id: '4CD5', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'ヴァリス・イェー・ガルヴァス', id: '4CD5', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '瓦厉斯·耶·加尔乌斯', id: '4CD5', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '바리스 예 갈부스', id: '4CD5', capture: false }),
      // Multiple people getting hit by this can cause double triggers.
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Go Front',
          de: 'Nach Vorne gehen',
          fr: 'Allez devant',
          ja: '前へ',
          cn: '到正面',
          ko: '앞으로',
        },
      },
    },
    {
      id: 'VarisEx Electrified Gunshield',
      netRegex: NetRegexes.ability({ source: 'Varis Yae Galvus', id: '4CD7', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Varis yae Galvus', id: '4CD7', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Varis yae Galvus', id: '4CD7', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'ヴァリス・イェー・ガルヴァス', id: '4CD7', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '瓦厉斯·耶·加尔乌斯', id: '4CD7', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '바리스 예 갈부스', id: '4CD7', capture: false }),
      delaySeconds: 21.5,
      response: Responses.knockback(),
    },
    {
      id: 'VarisEx Reinforced Gunshield',
      netRegex: NetRegexes.ability({ source: 'Varis Yae Galvus', id: '4CD9', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Varis Yae Galvus', id: '4CD9', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Varis Yae Galvus', id: '4CD9', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'ヴァリス・イェー・ガルヴァス', id: '4CD9', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '瓦厉斯·耶·加尔乌斯', id: '4CD9', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '바리스 예 갈부스', id: '4CD9', capture: false }),
      delaySeconds: (data) => data.phase === 2 ? 20 : 10,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Stop attacking',
          de: 'Angriffe stoppen',
          fr: 'Arrêtez d\'attaquer',
          ja: 'ブロックしない側に攻撃',
          cn: '攻击未格挡的方向',
          ko: '공격 중지',
        },
      },
    },
    {
      id: 'VarisEx Reinforced Gunshield Sides',
      netRegex: NetRegexes.ability({ source: 'Varis Yae Galvus', id: '4CDC', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Varis Yae Galvus', id: '4CDC', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Varis Yae Galvus', id: '4CDC', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'ヴァリス・イェー・ガルヴァス', id: '4CDC', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '瓦厉斯·耶·加尔乌斯', id: '4CDC', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '바리스 예 갈부스', id: '4CDC', capture: false }),
      response: Responses.goFrontBack('info'),
    },
    {
      id: 'VarisEx Reinforced Gunshield Front',
      netRegex: NetRegexes.ability({ source: 'Varis Yae Galvus', id: '4CDB', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Varis Yae Galvus', id: '4CDB', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Varis Yae Galvus', id: '4CDB', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'ヴァリス・イェー・ガルヴァス', id: '4CDB', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '瓦厉斯·耶·加尔乌斯', id: '4CDB', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '바리스 예 갈부스', id: '4CDB', capture: false }),
      response: Responses.goSides('info'),
    },
    {
      id: 'VarisEx Loaded Gunshield Final Warning',
      // This ability id occurs ~3 seconds before the Magitek Burst spread damage.
      netRegex: NetRegexes.ability({ source: 'Varis Yae Galvus', id: '4CDE', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Varis yae Galvus', id: '4CDE', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Varis yae Galvus', id: '4CDE', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'ヴァリス・イェー・ガルヴァス', id: '4CDE', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '瓦厉斯·耶·加尔乌斯', id: '4CDE', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '바리스 예 갈부스', id: '4CDE', capture: false }),
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          text: Outputs.spread,
        };
        // This is easily forgetable after dodging and seems to get people killed.
        // This also differentiates spread from the spread => stack in the last phase.
        return { [data.phase === 5 ? 'alarmText' : 'alertText']: output.text() };
      },
    },
    {
      id: 'VarisEx Reinforcements',
      netRegex: NetRegexes.ability({ source: 'Varis Yae Galvus', id: '4CEA', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Varis yae Galvus', id: '4CEA', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Varis yae Galvus', id: '4CEA', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'ヴァリス・イェー・ガルヴァス', id: '4CEA', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '瓦厉斯·耶·加尔乌斯', id: '4CEA', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '바리스 예 갈부스', id: '4CEA', capture: false }),
      infoText: (data, _matches, output) => {
        if (data.role === 'tank')
          return output.grabTethers();

        return output.killAdds();
      },
      outputStrings: {
        grabTethers: {
          en: 'Grab Tethers',
          de: 'Verbindung nehmen',
          fr: 'Prenez les liens',
          ja: '線を取る',
          cn: '接线',
          ko: '선 가로채기',
        },
        killAdds: {
          en: 'Kill adds',
          de: 'Adds besiegen',
          fr: 'Tuez les adds',
          ja: '雑魚を処理',
          cn: '击杀小怪',
          ko: '쫄 잡기',
        },
      },
    },
    {
      // The warning is taken care of above with a timeline trigger.  See notes.
      id: 'VarisEx Festina Lente Cleanup',
      netRegex: NetRegexes.ability({ source: 'Varis Yae Galvus', id: '4CC9', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Varis yae Galvus', id: '4CC9', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Varis yae Galvus', id: '4CC9', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'ヴァリス・イェー・ガルヴァス', id: '4CC9', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '瓦厉斯·耶·加尔乌斯', id: '4CC9', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '바리스 예 갈부스', id: '4CC9', capture: false }),
      delaySeconds: 10,
      run: (data) => {
        delete data.suppressDodgeCloneCall;
      },
    },
    {
      id: 'VarisEx Terminus Est Clones',
      netRegex: NetRegexes.startsUsing({ source: 'Terminus Est', id: '4CB4', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Terminus Est', id: '4CB4', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Terminus Est', id: '4CB4', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ターミナス・エスト', id: '4CB4', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '恩惠终结', id: '4CB4', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '파멸의 종착역', id: '4CB4', capture: false }),
      condition: (data) => data.clonesActive,
      infoText: (data, _matches, output) => {
        // Sometimes this is called out with the stack mechanic.
        if (data.suppressDodgeCloneCall)
          return;
        return output.text();
      },
      run: (data) => {
        delete data.suppressDodgeCloneCall;
        delete data.clonesActive;
      },
      outputStrings: {
        text: {
          en: 'Dodge Clones',
          de: 'Klonen ausweichen',
          fr: 'Esquivez les Clones',
          ja: 'ターミナス・エストを避ける',
          cn: '躲避剑气',
          ko: '클론 피하기',
        },
      },
    },
    {
      id: 'VarisEx Magitek Torch',
      netRegex: NetRegexes.startsUsing({ source: 'Gunshield', id: '4E4F', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Gewehrschild', id: '4E4F', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'bouclier-canon', id: '4E4F', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ガンシールド', id: '4E4F', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '枪盾', id: '4E4F', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '건실드', id: '4E4F', capture: false }),
      response: Responses.stackMarker('info'),
    },
    {
      id: 'VarisEx Magitek Spark',
      netRegex: NetRegexes.startsUsing({ source: 'Gunshield', id: '4E50', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Gewehrschild', id: '4E50', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'bouclier-canon', id: '4E50', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ガンシールド', id: '4E50', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '枪盾', id: '4E50', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '건실드', id: '4E50', capture: false }),
      // TODO: This is technicallly a spread, but it's more like "protean" spread?
      // Not sure how to make this more clear.
      response: Responses.spread('alert'),
    },
    {
      id: 'VarisEx Fortius',
      netRegex: NetRegexes.startsUsing({ source: 'Varis Yae Galvus', id: '4CE[56]', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Varis Yae Galvus', id: '4CE[56]', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Varis Yae Galvus', id: '4CE[56]', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ヴァリス・イェー・ガルヴァス', id: '4CE[56]', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '瓦厉斯·耶·加尔乌斯', id: '4CE[56]', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '바리스 예 갈부스', id: '4CE[56]', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Bait Puddles Out',
          de: 'Flächen nach draußen ködern',
          fr: 'Attirez les zones au sol à l\'extérieur',
          ja: '外周に安置',
          cn: '外圈放黑泥',
          ko: '장판 바깥쪽으로 유도',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Bladesblood': 'Bastardramme',
        'Gunshield': 'Gewehrschild',
        'Ignis Est': 'Ignis Est',
        'Magitek Turret II': 'Magitek-Geschütz II',
        'Phantom Varis': 'Varis-Doppelgänger',
        'Terminus Est': 'Terminus Est',
        'Varis Yae Galvus': 'Varis yae Galvus',
        'Ventus Est': 'Ventus Est',
      },
      'replaceText': {
        '--clones appear\\?--': '--klone erscheinen?--',
        'Aetherochemical Grenado': 'Magitek-Granate',
        'Alea Iacta Est': 'Alea Iacta Est',
        'Altius': 'Altius',
        'Blade\'s Pulse': 'Klingenpuls',
        'Citius': 'Citius',
        'Electrified Gunshield': 'Gewehrschild: Magitek-Schock',
        'Festina Lente': 'Festina Lente',
        'Fortius': 'Fortius',
        '(?<! )Gunshield': 'Gewehrschild',
        'Ignis Est': 'Ignis Est',
        'Loaded Gunshield': 'Gewehrschild: Magitek-Knall',
        'Magitek Burst': 'Magitek-Knall',
        'Magitek Shielding': 'Magitek-Konter',
        'Magitek Shock': 'Magitek-Schock',
        'Magitek Spark/Torch': 'Magitek-Funke/Flamme ',
        'Magitek Torch/Spark': 'Magitek Flamme/Funke',
        'Reinforced Gunshield': 'Gewehrschild: Magitek-Konter',
        'Reinforcements': 'Unterstützungsbefehl',
        'Shockwave': 'Schockwelle',
        'Terminus Est': 'Terminus Est',
        'Ventus Est': 'Ventus Est',
        'Vivere Militare Est': 'Vivere Militare Est',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Bladesblood': 'Onde De Choc',
        'Gunshield': 'Bouclier-Canon',
        'Ignis Est': 'Ignis Est',
        'Magitek Turret II': 'Tourelle Magitek TM-II',
        'Phantom Varis': 'Double De Varis',
        'Terminus Est': 'Terminus Est',
        'Varis Yae Galvus': 'Varis yae Galvus',
        'Ventus Est': 'Ventus Est',
      },
      'replaceText': {
        '(?<! )\\?(?!--)': ' ?',
        '--clones appear\\?--': 'apparition des clones ?',
        'Aetherochemical Grenado': 'Grenade Magitek',
        'Alea Iacta Est': 'Alea Jacta Est',
        'Altius': 'Altius',
        'Blade\'s Pulse': 'Duel d\'armes',
        'Citius': 'Citius',
        'Electrified Gunshield': 'Bouclier-canon : Choc magitek',
        'Ignis Est': 'Ignis Est',
        'Festina Lente': 'Festina Lente',
        'Fortius': 'Fortius',
        '(?<! )Gunshield': 'bouclier-canon',
        'Loaded Gunshield': 'Bouclier-canon : Explosion magitek',
        'Magitek Burst': 'Explosion magitek',
        'Magitek Shielding': 'Contre magitek',
        'Magitek Shock': 'Choc magitek',
        'Magitek Spark/Torch': 'Étincelle/Flammes magitek',
        'Magitek Torch/Spark': 'Flammes/Étincelle magitek',
        'Reinforcements': 'Demande de renforts',
        'Reinforced Gunshield': 'Bouclier-canon : Contre magitek',
        'Shockwave': 'Onde de choc',
        'Terminus Est': 'Terminus Est',
        'Ventus Est': 'Ventus Est',
        'Vivere Militare Est': 'Vivere Militare Est',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Bladesblood': '剣気',
        'Gunshield': 'ガンシールド',
        'Ignis Est': 'イグニス・エスト',
        'Magitek Turret II': '魔導タレットII',
        'Phantom Varis': 'ヴァリスの幻影',
        'Terminus Est': 'ターミナス・エスト',
        'Varis Yae Galvus': 'ヴァリス・イェー・ガルヴァス',
        'Ventus Est': 'ウェントゥス・エスト',
      },
      'replaceText': {
        '--clones appear\\?--': '--幻影出現?--',
        'Aetherochemical Grenado': '魔導榴弾',
        'Alea Iacta Est': 'アーレア・ヤクタ・エスト',
        'Altius': 'アルティウス',
        'Blade\'s Pulse': '攻撃を受け止める',
        'Citius': 'キティウス',
        'Electrified Gunshield': 'ガンシールド：魔導ショック',
        'Festina Lente': 'フェスティナ・レンテ',
        'Fortius': 'フォルティウス',
        '(?<! )Gunshield': 'ガンシールド',
        'Ignis Est': 'イグニス・エスト',
        'Loaded Gunshield': 'ガンシールド：魔導バースト',
        'Magitek Burst': '魔導バースト',
        'Magitek Shielding': '魔導カウンター',
        'Magitek Shock': '魔導ショック',
        'Magitek Spark/Torch': '魔導スパーク／魔導フレーム',
        'Magitek Torch/Spark': '魔導フレーム／魔導スパーク',
        'Reinforced Gunshield': 'ガンシールド：魔導カウンター',
        'Reinforcements': '支援命令',
        'Shockwave': '衝撃波',
        'Terminus Est': 'ターミナス・エスト',
        'Ventus Est': 'ウェントゥス・エスト',
        'Vivere Militare Est': 'ウィーウェレ・ミーリターレ・エスト',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Bladesblood': '剑气',
        'Gunshield': '枪盾',
        'Ignis Est': '是为烈火',
        'Magitek Turret II': '魔导炮塔II',
        'Phantom Varis': '瓦厉斯的幻影',
        'Terminus Est': '恩惠终结',
        'Varis Yae Galvus': '瓦厉斯·耶·加尔乌斯',
        'Ventus Est': '是为疾风',
      },
      'replaceText': {
        '--clones appear\\?--': '--幻影出现?--',
        'Aetherochemical Grenado': '魔导榴弹',
        'Alea Iacta Est': '大局已定',
        'Altius': '更高',
        'Blade\'s Pulse': '双T接刀',
        'Citius': '更快',
        'Electrified Gunshield': '枪盾：魔导冲击',
        'Festina Lente': '从容不迫',
        'Fortius': '更强',
        '(?<! )Gunshield': '枪盾',
        'Ignis Est': '是为烈火',
        'Loaded Gunshield': '枪盾：魔导爆发',
        'Magitek Burst': '魔导爆发',
        'Magitek Shielding': '魔导反击',
        'Magitek Shock': '魔导冲击',
        'Magitek Spark/Torch': '魔导光刃／魔导火焰',
        'Magitek Torch/Spark': '魔导火焰／魔导光刃',
        'Reinforced Gunshield': '枪盾：魔导反击',
        'Reinforcements': '支援命令',
        'Shockwave': '冲击波',
        'Terminus Est': '恩惠终结',
        'Ventus Est': '是为疾风',
        'Vivere Militare Est': '生者战也',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Bladesblood': '검기',
        'Gunshield': '건실드',
        'Ignis Est': '파멸의 화염',
        'Magitek Turret II': '마도 포탑 II',
        'Phantom Varis': '바리스의 환영',
        'Terminus Est': '파멸의 종착역',
        'Varis Yae Galvus': '바리스 예 갈부스',
        'Ventus Est': '파멸의 바람',
      },
      'replaceText': {
        '--clones appear\\?--': '--분신 생성?--',
        'Aetherochemical Grenado': '마도 유탄',
        'Alea Iacta Est': '알레아 이악타 에스트',
        'Altius': '알티우스',
        'Blade\'s Pulse': '공격 막아내기',
        'Citius': '키티우스',
        'Electrified Gunshield': '건실드: 마도 쇼크',
        'Festina Lente': '페스티나 렌테',
        'Fortius': '포르티우스',
        '(?<! )Gunshield': '건실드',
        'Ignis Est': '파멸의 화염',
        'Loaded Gunshield': '건실드: 마도 버스트',
        'Magitek Burst': '마도 버스트',
        'Magitek Shielding': '마도 카운터',
        'Magitek Shock': '마도 쇼크',
        'Magitek Spark/Torch': '마도 스파크/플레임',
        'Magitek Torch/Spark': '마도 플레임/스파크',
        'Reinforced Gunshield': '건실드: 마도 카운터',
        'Reinforcements': '지원 명령',
        'Shockwave': '충격 파동',
        'Terminus Est': '파멸의 종착역',
        'Ventus Est': '파멸의 바람',
        'Vivere Militare Est': '위웨레 밀리타레 에스트',
      },
    },
  ],
};
