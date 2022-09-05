import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { UnreachableCode } from '../../../../../resources/not_reached';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { NetMatches } from '../../../../../types/net_matches';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: Tether plant locations via OverlayPlugin X, Y and bird headings?

export interface Data extends RaidbossData {
  decOffset?: number;
  purgationDebuffs: { [role: string]: { [name: string]: number } };
  purgationDebuffCount: number;
  tetherCollect: string[];
  stopTethers?: boolean;
  tetherCollectPhase?: string;
}

// Due to changes introduced in patch 5.2, overhead markers now have a random offset
// added to their ID. This offset currently appears to be set per instance, so
// we can determine what it is from the first overhead marker we see.
// The first 1B marker in the encounter is an Hemitheos's Holy III stack marker (013E).
const firstHeadmarker = parseInt('013E', 16);
const getHeadmarkerId = (data: Data, matches: NetMatches['HeadMarker']) => {
  // If we naively just check !data.decOffset and leave it, it breaks if the first marker is 013E.
  // (This makes the offset 0, and !0 is true.)
  if (typeof data.decOffset === 'undefined')
    data.decOffset = parseInt(matches.id, 16) - firstHeadmarker;
  // The leading zeroes are stripped when converting back to string, so we re-add them here.
  // Fortunately, we don't have to worry about whether or not this is robust,
  // since we know all the IDs that will be present in the encounter.
  return (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase().padStart(4, '0');
};

// effect ids for inviolate purgation
const effectIdToOutputStringKey: { [effectId: string]: string } = {
  'CEE': 'spread',
  'D3F': 'spread',
  'D40': 'spread',
  'D41': 'spread',
  'CEF': 'stack',
  'D42': 'stack',
  'D43': 'stack',
  'D44': 'stack',
};

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.AbyssosTheSeventhCircleSavage,
  timelineFile: 'p7s.txt',
  initData: () => ({
    purgationDebuffs: { 'dps': {}, 'support': {} },
    purgationDebuffCount: 0,
    tetherCollect: [],
  }),
  triggers: [
    {
      id: 'P7S Headmarker Tracker',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({}),
      condition: (data) => data.decOffset === undefined,
      // Unconditionally set the first headmarker here so that future triggers are conditional.
      run: (data, matches) => {
        getHeadmarkerId(data, matches);
      },
    },
    {
      id: 'P7S Hemitheos\'s Holy III Healer Groups',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({}),
      suppressSeconds: 1,
      infoText: (data, matches, output) => {
        const correctedMatch = getHeadmarkerId(data, matches);
        if (correctedMatch === '013E')
          return output.healerGroups!();
      },
      outputStrings: {
        healerGroups: Outputs.healerGroups,
      },
    },
    {
      id: 'P7S Condensed Aero II',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7836', source: 'Agdistis' }),
      response: Responses.sharedTankBuster(),
    },
    {
      id: 'P7S Dispersed Aero II',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7835', source: 'Agdistis', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: 'Split Tankbusters',
      },
    },
    {
      id: 'P7S Bough of Attis Left Arrows',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7824', source: 'Agdistis', capture: false }),
      response: Responses.goLeft(),
    },
    {
      id: 'P7S Bough of Attis Right Arrows',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7823', source: 'Agdistis', capture: false }),
      response: Responses.goRight(),
    },
    {
      id: 'P7S Hemitheos\'s Aero IV',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7A0B', source: 'Agdistis', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'P7S Immature Stymphalide Tether',
      type: 'Tether',
      netRegex: NetRegexes.tether({ id: '0011', source: 'Immature Stymphalide', capture: false }),
      // ~9s between tether and Bronze Bellows (no cast) in all cases.
      delaySeconds: 4,
      // Just give this to everyone.  People in towers or elsewhere can be safe.
      suppressSeconds: 1,
      response: Responses.knockback(),
    },
    {
      id: 'P7S Spark of Life',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7839', source: 'Agdistis', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: 'aoe + bleed',
      },
    },
    {
      id: 'P7S Inviolate Bonds',
      type: 'GainsEffect',
      // CEC/D45 = Inviolate Winds
      // CED/D56 = Holy Bonds
      netRegex: NetRegexes.gainsEffect({ effectId: ['CEC', 'D45'] }),
      condition: Conditions.targetIsYou(),
      durationSeconds: 20,
      response: (_data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          stackThenSpread: Outputs.stackThenSpread,
          spreadThenStack: Outputs.spreadThenStack,
        };

        const longTimer = parseFloat(matches.duration) > 9;
        if (longTimer)
          return { infoText: output.stackThenSpread!() };
        return { infoText: output.spreadThenStack!() };
      },
    },
    {
      id: 'P7S Forbidden Fruit 4 and Harvest Tethers',
      // 0006 Immature Io (Bull) Tether
      // 0039 Immature Minotaur Tether
      // 0011 Immature Stymphalide (Bird) Tether
      // Forbidden Fruit 4: 4 Bull Tethers, 2 Minotaur Tethers, 1 Non-tethered Minotaur
      // Famine: 4 Minotaur Tethers, 2 Non-tethered Minotaurs, 2 Static Birds
      // Death: 2 Bulls with Tethers, 1 Bull casting Puddle AoE, 2 Static Birds
      // War: 4 Bull Tethers, 2 Minotaur Tethers, 2 Bird Tethers
      // TODO: Get locations with OverlayPlugin via X, Y and bird headings?
      type: 'Tether',
      netRegex: NetRegexes.tether({ id: ['0006', '0039', '0011'] }),
      condition: (data) => !data.stopTethers,
      preRun: (data, matches) => data.tetherCollect.push(matches.target),
      delaySeconds: 0.1,
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          bullTether: {
            en: 'Bull Tether (Line AoE)',
          },
          deathBullTether: {
            en: 'Bull Tether (Line AoE)',
          },
          warBullTether: {
            en: 'Bull Tether (Line AoE)',
          },
          minotaurTether: {
            en: 'Minotaur Tether (Big Cleave)',
          },
          famineMinotaurTether: {
            en: 'Cross Minotaur Tethers (Big Cleave)',
          },
          warMinotaurTether: {
            en: 'Minotaur Tether (Big Cleave)',
          },
          warBirdTether: {
            en: 'Bird Tether',
          },
          noTether: {
            en: 'No Tether, Bait Minotaur Cleave (Middle)',
          },
          famineNoTether: {
            en: 'No Tether, Bait Minotaur Cleave',
          },
        };

        if (data.me === matches.target) {
          // Bull Tethers
          if (matches.id === '0006') {
            if (data.tetherCollectPhase === 'death')
              return { infoText: output.deathBullTether!() };
            if (data.tetherCollectPhase === 'war')
              return { infoText: output.warBullTether!() };
            return { infoText: output.bullTether!() };
          }

          // Minotaur Tethers
          if (matches.id === '0039') {
            if (data.tetherCollectPhase === 'famine')
              return { infoText: output.famineMinotaurTether!() };
            if (data.tetherCollectPhase === 'war')
              return { infoText: output.warMinotaurTether!() };
            return { infoText: output.minotaurTether!() };
          }

          // Bird Tethers
          if (matches.id === '0011')
            return { infoText: output.warBirdTether!() };
        }

        // No Tethers
        if (!data.tetherCollect.includes(data.me)) {
          // Prevent duplicate callout
          data.tetherCollect.push(data.me);
          if (!data.tetherCollectPhase)
            return { infoText: output.noTether!() };
          if (data.tetherCollectPhase === 'famine')
            return { alertText: output.famineNoTether!() };
        }
      },
    },
    {
      id: 'P7S Forbidden Fruit 4 and Harvest Stop Collection',
      // 0001 Tether also goes off on players that get 0039 Tethers which leads
      // to 0039 possibly reapplying. This trigger is used to only collect tethers
      // during a defined window.
      type: 'Tether',
      netRegex: NetRegexes.tether({ id: ['0006', '0039'], capture: false }),
      delaySeconds: 0.2,
      suppressSeconds: 6,
      run: (data) => data.stopTethers = true,
    },
    {
      id: 'P7S Harvest Phase Tracker',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['7A4F', '7A50', '7A51'] }),
      run: (data, matches) => {
        data.stopTethers = false;
        data.tetherCollect = [];
        switch (matches.id) {
          case '7A4F':
            data.tetherCollectPhase = 'famine';
            break;
          case '7A50':
            data.tetherCollectPhase = 'death';
            break;
          case '7A51':
            data.tetherCollectPhase = 'war';
            break;
        }
      },
    },
    {
      id: 'P7S Inviolate Purgation',
      type: 'GainsEffect',
      // CEE = Purgatory Winds I
      // D3F = Purgatory Winds II
      // D40 = Purgatory Winds III
      // D41 = Purgatory Winds IV
      // CEF = Holy Purgation I
      // D42 = Holy Purgation II
      // D43 = Holy Purgation III
      // D44 = Holy Purgation IV
      netRegex: NetRegexes.gainsEffect({ effectId: ['CE[EF]', 'D3F', 'D4[01234]'] }),
      preRun: (data, matches) => {
        data.purgationDebuffCount += 1;

        const role = data.party.isDPS(matches.target) ? 'dps' : 'support';
        const debuff = data.purgationDebuffs[role];
        if (!debuff)
          return;
        debuff[matches.effectId.toUpperCase()] = parseFloat(matches.duration);
      },
      durationSeconds: 55,
      infoText: (data, _matches, output) => {
        if (data.purgationDebuffCount !== 20)
          return;

        // Sort effects ascending by duration
        const role = data.role === 'dps' ? 'dps' : 'support';
        const unsortedDebuffs = Object.keys(data.purgationDebuffs[role] ?? {});
        const sortedDebuffs = unsortedDebuffs.sort((a, b) => (data.purgationDebuffs[role]?.[a] ?? 0) - (data.purgationDebuffs[role]?.[b] ?? 0));

        // get stack or spread from effectId
        const effects = sortedDebuffs.map((effectId) => effectIdToOutputStringKey[effectId]);

        const [effect1, effect2, effect3, effect4] = effects;
        if (!effect1 || !effect2 || !effect3 || !effect4)
          throw new UnreachableCode();

        return output.comboText!({
          effect1: output[effect1]!(),
          effect2: output[effect2]!(),
          effect3: output[effect3]!(),
          effect4: output[effect4]!(),
        });
      },
      outputStrings: {
        comboText: {
          en: '${effect1} => ${effect2} => ${effect3} => ${effect4}',
          de: '${effect1} => ${effect2} => ${effect3} => ${effect4}',
        },
        spread: Outputs.spread,
        stack: Outputs.stackMarker,
      },
    },
    {
      id: 'P7S Light of Life',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '78E2', source: 'Agdistis', capture: false }),
      // ~5s castTime, but boss cancels it and ability goes off 26s after start
      delaySeconds: 21,
      alertText: (_data, _matches, output) => output.bigAoEMiddle!(),
      outputStrings: {
        bigAoEMiddle: {
          en: 'Big AOE, Get Middle',
          de: 'Große AoE, geh in die Mitte',
          fr: 'Grosse AoE, allez au milieu',
          ja: '大ダメージ、中へ',
          cn: '超大伤害，去中间',
          ko: '아픈 광뎀, 중앙으로',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Condensed Aero II/Dispersed Aero II': 'Condensed/Dispersed Aero II',
      },
    },
    {
      'locale': 'de',
      'missingTranslations': true,
      'replaceSync': {
        'Agdistis': 'Agdistis',
        'Immature Io': 'unreif(?:e|er|es|en) Io',
        'Immature Minotaur': 'unreif(?:e|er|es|en) Minotaurus',
        'Immature Stymphalide': 'unreif(?:e|er|es|en) Stymphalides',
      },
      'replaceText': {
        '--chasing aoe--': '--verfolgende AoEs--',
        '--eggs--': '--Eier--',
        'arrow': 'Pfeil',
        'close': 'Nahe',
        'far': 'Entfernt',
        'Blades of Attis': 'Schwertblatt des Attis',
        'Bough of Attis': 'Ast des Attis',
        'Bronze Bellows': 'Böenschlag',
        'Bullish Slash': 'Bullenansturm',
        'Bullish Swipe': 'Bullenfeger',
        'Condensed Aero II': 'Gehäuftes Windra',
        'Dispersed Aero II': 'Flächiges Windra',
        'Forbidden Fruit': 'Frucht des Lebens',
        'Hemitheos\'s Aero III': 'Hemitheisches Windga',
        'Hemitheos\'s Aero IV': 'Hemitheisches Windka',
        'Hemitheos\'s Glare(?! III)': 'Hemitheische Blendung',
        'Hemitheos\'s Glare III': 'Hemitheisches Blendga',
        'Hemitheos\'s Holy(?! III)': 'Hemitheisches Sanctus',
        'Hemitheos\'s Holy III': 'Hemitheisches Sanctga',
        'Hemitheos\'s Tornado': 'Hemitheischer Tornado',
        'Immortal\'s Obol': 'Zweig des Lebens und des Todes',
        'Inviolate Bonds': 'Siegelschaffung',
        'Light of Life': 'Aurora des Lebens',
        'Multicast': 'Multizauber',
        'Roots of Attis': 'Wurzel des Attis',
        'Shadow of Attis': 'Lichttropfen des Attis',
        'Spark of Life': 'Schein des Lebens',
        'Static Path': 'Statischer Pfad',
        'Stymphalian Strike': 'Vogelschlag',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Agdistis': 'Agdistis',
        'Immature Io': 'io immature',
        'Immature Minotaur': 'minotaure immature',
        'Immature Stymphalide': 'stymphalide immature',
      },
      'replaceText': {
        'Blades of Attis': 'Lames d\'Attis',
        'Bough of Attis': 'Grandes branches d\'Attis',
        'Bronze Bellows': 'Frappe rafale',
        'Bullish Slash': 'Taillade catabatique',
        'Bullish Swipe': 'Balayage catabatique',
        'Condensed Aero II': 'Extra Vent concentré',
        'Dispersed Aero II': 'Extra vent étendu',
        'Forbidden Fruit': 'Fruits de la vie',
        'Hemitheos\'s Aero III': 'Méga Vent d\'hémithéos',
        'Hemitheos\'s Aero IV': 'Giga Vent d\'hémithéos',
        'Hemitheos\'s Glare(?! III)': 'Chatoiement d\'hémithéos',
        'Hemitheos\'s Glare III': 'Méga Chatoiement d\'hémithéos',
        'Hemitheos\'s Holy(?! III)': 'Miracle d\'hémithéos',
        'Hemitheos\'s Holy III': 'Méga Miracle d\'hémithéos',
        'Hemitheos\'s Tornado': 'Tornade d\'hémithéos',
        'Immortal\'s Obol': 'Branche de vie et de mort',
        'Light of Life': 'Éclair de vie',
        'Roots of Attis': 'Racines d\'Attis',
        'Shadow of Attis': 'Rai d\'Attis',
        'Spark of Life': 'Étincelle de vie',
        'Static Path': 'Chemin statique',
        'Stymphalian Strike': 'Assaut stymphalide',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Agdistis': 'アグディスティス',
        'Immature Io': 'イマチュア・イーオー',
        'Immature Minotaur': 'イマチュア・タウロス',
        'Immature Stymphalide': 'イマチュア・ステュムパリデス',
      },
      'replaceText': {
        'Blades of Attis': 'アッティスの刃葉',
        'Bough of Attis': 'アッティスの巨枝',
        'Bronze Bellows': 'ガストストライク',
        'Bullish Slash': 'ブルスラッシュ',
        'Bullish Swipe': 'ブルスワイプ',
        'Condensed Aero II': 'アグリゲート・エアロラ',
        'Dispersed Aero II': 'スプレッド・エアロラ',
        'Forbidden Fruit': '生命の果実',
        'Hemitheos\'s Aero III': 'ヘーミテオス・エアロガ',
        'Hemitheos\'s Aero IV': 'ヘーミテオス・エアロジャ',
        'Hemitheos\'s Glare(?! III)': 'ヘーミテオス・グレア',
        'Hemitheos\'s Glare III': 'ヘーミテオス・グレアガ',
        'Hemitheos\'s Holy(?! III)': 'ヘーミテオス・ホーリー',
        'Hemitheos\'s Holy III': 'ヘーミテオス・ホーリガ',
        'Hemitheos\'s Tornado': 'ヘーミテオス・トルネド',
        'Immortal\'s Obol': '生滅の導枝',
        'Light of Life': '生命の極光',
        'Roots of Attis': 'アッティスの根',
        'Shadow of Attis': 'アッティスの光雫',
        'Spark of Life': '生命の光芒',
        'Static Path': 'スタティックパース',
        'Stymphalian Strike': 'バードストライク',
      },
    },
  ],
};

export default triggerSet;
