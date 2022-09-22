import { defineTriggerSet } from '../../../../../resources/api_define_trigger_set';
import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { callOverlayHandler } from '../../../../../resources/overlay_plugin_api';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { PluginCombatantState } from '../../../../../types/event';

export default defineTriggerSet<{
  bodyActor?: PluginCombatantState;
  flareTarget?: string;
}>({
  zoneId: ZoneId.AsphodelosTheSecondCircle,
  timelineFile: 'p2n.txt',
  triggers: [
    {
      id: 'P2N Murky Depths',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '680F', source: 'Hippokampos', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'P2N Doubled Impact',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '680E', source: 'Hippokampos' }),
      response: Responses.sharedTankBuster(),
    },
    {
      id: 'P2N Spoken Cataract',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['67F8', '67F7', '67F9'], source: 'Hippokampos' }),
      delaySeconds: 1,
      promise: async (data) => {
        const callData = await callOverlayHandler({
          call: 'getCombatants',
        });
        if (!callData.combatants.length) {
          console.error('SpokenCataract: failed to get combatants: ${JSON.stringify(callData)}');
          return;
        }
        // This is the real hippo, according to hp.
        const hippos = callData.combatants.filter((c) => c.BNpcID === 13721);
        if (hippos.length !== 1) {
          console.error('SpokenCataract: There is not exactly one Hippo?!?: ${JSON.stringify(hippos)}');
          data.bodyActor = undefined;
          return;
        }
        data.bodyActor = hippos[0];
      },
      alertText: (data, matches, output) => {
        if (!data.bodyActor) {
          console.error('SpokenCataract: No boss actor found. Did the promise fail?');
          return;
        }
        // Convert radians into 4 quarters N = 0, E = 1, S = 2, W = 3
        const heading = Math.round(2 - 2 * data.bodyActor.Heading / Math.PI) % 4;

        if (matches.id === '67F8') {
          switch (heading) {
            case 0:
              return output.nc!();
            case 1:
              return output.ec!();
            case 2:
              return output.sc!();
            case 3:
              return output.wc!();
          }
        }
        if (matches.id === '67F7') {
          switch (heading) {
            case 0:
              return output.w!();
            case 1:
              return output.n!();
            case 2:
              return output.e!();
            case 3:
              return output.s!();
          }
        }
        if (matches.id === '67F9') {
          switch (heading) {
            case 0:
              return output.e!();
            case 1:
              return output.s!();
            case 2:
              return output.w!();
            case 3:
              return output.n!();
          }
        }
      },
      outputStrings: {
        n: Outputs.north,
        e: Outputs.east,
        w: Outputs.west,
        s: Outputs.south,
        nc: {
          en: 'North Corners',
          de: 'nördliche Ecken',
          fr: 'Au coin nord',
          ja: '北の角へ',
          cn: '去上 (北) 边角落',
          ko: '북쪽 모서리',
        },
        ec: {
          en: 'East Corners',
          de: 'östliche Ecken',
          fr: 'Au coin est',
          ja: '東の角へ',
          cn: '去右 (东) 边角落',
          ko: '동쪽 모서리',
        },
        sc: {
          en: 'South Corners',
          de: 'südliche Ecken',
          fr: 'Au coin sud',
          ja: '南の角へ',
          cn: '去下 (南) 边角落',
          ko: '남쪽 모서리',
        },
        wc: {
          en: 'West Corners',
          de: 'westliche Ecken',
          fr: 'Au coin ouest',
          ja: '西の角へ',
          cn: '去左 (西) 边角落',
          ko: '서쪽 모서리',
        },
      },
    },
    {
      id: 'P2N Sewage Deluge',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '67F6', source: 'Hippokampos', capture: false }),
      response: Responses.aoe(),
    },
    {
      // Spread aoe marker on some players, not all
      id: 'P2N Tainted Flood',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6809', source: 'Hippokampos' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'P2N Predatory Sight',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '680A', source: 'Hippokampos', capture: false }),
      delaySeconds: 3,
      response: Responses.doritoStack(),
    },
    {
      id: 'P2N Coherence Flare',
      type: 'HeadMarker',
      // This always comes before 6D14 below for the line stack marker.
      netRegex: NetRegexes.headMarker({ id: '0057' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      run: (data, matches) => data.flareTarget = matches.target,
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
      id: 'P2N Coherence Stack',
      // Coherence (6801) cast has an unknown (6D14) ability with the target before it.
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6D14' }),
      condition: (data) => data.flareTarget !== data.me,
      alertText: (data, matches, output) => output.lineStackOn!({ player: data.ShortName(matches.target) }),
      outputStrings: {
        lineStackOn: {
          en: 'Line stack on ${player}',
          de: 'In einer Linie auf ${player} sammeln',
          fr: 'Packez-vous en ligne sur ${player}',
          ja: '${player}に直線頭割り',
          cn: '${player} 直线分摊',
          ko: '${player} 직선 쉐어',
        },
      },
    },
    {
      // Raidwide knockback -> dont get knocked into slurry
      id: 'P2N Shockwave',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6807', source: 'Hippokampos', capture: false }),
      response: Responses.knockback(),
    },
    {
      // Aoe from head outside the arena
      id: 'P2N Dissociation',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6806', source: 'Hippokampos' }),
      alertText: (_data, matches, output) => {
        const xCoord = parseFloat(matches.x);
        if (xCoord > 100)
          return output.w!();
        if (xCoord < 100)
          return output.e!();
      },
      outputStrings: {
        e: Outputs.east,
        w: Outputs.west,
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Hippokampos': 'Hippokampos',
      },
      'replaceText': {
        '\\(knockback\\)': '(Rückstoß)',
        'Coherence Flare': 'Kohärenz Flare',
        'Coherence Line': 'Kohärenz Linie',
        'Dissociation(?! Dive)': 'Dissoziation',
        'Dissociation Dive': 'Dissoziation Sturzflug',
        'Doubled Impact': 'Doppeleinschlag',
        'Murky Depths': 'Trübe Tiefen',
        'Predatory Sight': 'Mal der Beute',
        'Sewage Deluge': 'Abwasserflut',
        'Sewage Eruption': 'Abwassereruption',
        'Shockwave': 'Schockwelle',
        'Spoken Cataract': 'Gehauchter Katarakt',
        'Tainted Flood': 'Verseuchte Flut',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Hippokampos': 'hippokampos',
      },
      'replaceText': {
        '\\(knockback\\)': '(poussée)',
        'Coherence Flare': 'Cohérence Brasier',
        'Coherence Line': 'Cohérence en ligne',
        'Dissociation(?! Dive)': 'Dissociation',
        'Dissociation Dive': 'Dissociation et plongeon',
        'Doubled Impact': 'Double impact',
        'Murky Depths': 'Tréfonds troubles',
        'Predatory Sight': 'Marque de la proie',
        'Sewage Deluge': 'Déluge d\'eaux usées',
        'Sewage Eruption': 'Éruption d\'eaux usées',
        'Shockwave': 'Onde de choc',
        'Spoken Cataract': 'Souffle et cataracte',
        'Tainted Flood': 'Inondation infâme',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Hippokampos': 'ヒッポカムポス',
      },
      'replaceText': {
        'Dissociation': 'ディソシエーション',
        'Doubled Impact': 'ダブルインパクト',
        'Murky Depths': 'マーキーディープ',
        'Predatory Sight': '生餌の刻印',
        'Sewage Deluge': 'スウェッジデリージュ',
        'Sewage Eruption': 'スウェッジエラプション',
        'Shockwave': 'ショックウェーブ',
        'Spoken Cataract': 'ブレス＆カタラクティス',
        'Tainted Flood': 'テインテッドフラッド',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Hippokampos': '鱼尾海马怪',
      },
      'replaceText': {
        '\\(knockback\\)': '(击退)',
        'Coherence Flare': '连贯攻击 (核爆)',
        'Coherence Line': '连贯攻击 (分摊)',
        'Dissociation(?! Dive)': '分离',
        'Dissociation Dive': '分离 (冲锋)',
        'Doubled Impact': '双重冲击',
        'Murky Depths': '深度污浊',
        'Predatory Sight': '活饵的刻印',
        'Sewage Deluge': '污水泛滥',
        'Sewage Eruption': '污水喷发',
        'Shockwave': '震荡波',
        'Spoken Cataract': '吐息飞瀑',
        'Tainted Flood': '污染洪水',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Hippokampos': '히포캄포스',
      },
      'replaceText': {
        '\\(knockback\\)': '(넉백)',
        'Coherence Flare': '간섭 공격 (플레어)',
        'Coherence Line': '간섭 공격 (쉐어)',
        'Dissociation(?! Dive)': '머리 분리',
        'Dissociation Dive': '머리 분리 (돌진)',
        'Doubled Impact': '이중 충격',
        'Murky Depths': '짙은 탁류',
        'Predatory Sight': '먹잇감 각인',
        'Sewage Deluge': '하수 범람',
        'Sewage Eruption': '하수 분출',
        'Shockwave': '충격 파동',
        'Spoken Cataract': '숨결 홍수',
        'Tainted Flood': '오염 침수',
      },
    },
  ],
});
