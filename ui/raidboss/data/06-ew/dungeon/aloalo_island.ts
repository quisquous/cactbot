import Conditions from '../../../../../resources/conditions';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type ArcaneBlightMarch = 'front' | 'back' | 'left' | 'right';

const ArcaneBlightMap: { [count: string]: ArcaneBlightMarch } = {
  '886F': 'right',
  '8870': 'left',
  '8871': 'back',
  '8872': 'front',
} as const;

export interface Data extends RaidbossData {
  quaArmamentsCount: number;
  isKetuFight?: boolean;
  lalaArcaneBlight?: ArcaneBlightMarch;
  lalaRotate?: 'cw' | 'ccw' | 'unknown';
  reloadCount: number;
  reloadFailed: number[];
}

const triggerSet: TriggerSet<Data> = {
  id: 'AloaloIsland',
  zoneId: ZoneId.AloaloIsland,
  timelineFile: 'aloalo_island.txt',
  initData: () => {
    return {
      quaArmamentsCount: 0,
      reloadCount: 0,
      reloadFailed: [],
    };
  },
  triggers: [
    // ----------------------------------------- Trash
    {
      id: 'Aloalo Ahool Soundwave',
      type: 'StartsUsing',
      netRegex: { id: '8869', source: 'Aloalo Ahool', capture: false },
      response: Responses.aoe(),
    },
    // ----------------------------------------- Quaqua
    {
      id: 'Aloalo Quaqua Made Magic',
      type: 'StartsUsing',
      netRegex: { id: '8B94', source: 'Quaqua', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Aloalo Quaqua Arcane Armaments',
      type: 'StartsUsing',
      netRegex: { id: '8B88', source: 'Quaqua', capture: false },
      infoText: (data, _matches, output) => {
        data.quaArmamentsCount++;
        if (data.quaArmamentsCount === 1)
          return output.first!();
        if (data.quaArmamentsCount === 2)
          return output.second!();
        return output.third!();
      },
      outputStrings: {
        first: {
          en: 'Away from Orbs',
          de: 'Außen zwichen den Orbs',
          ja: 'ハンマー、玉の間の外側へ',
        },
        second: {
          en: 'Under Orbs',
          de: 'Unter einen Orbs',
          ja: 'ドーナツ、玉の下へ',
        },
        third: {
          en: 'Under Donut Far From Axe',
          de: 'Unter Donut und weit weg von der Axt',
          ja: '玉に気を付けて',
        },
      },
    },
    {
      id: 'Aloalo Quaqua Arcane Armaments Knockback',
      type: 'StartsUsing',
      netRegex: { id: '8B8C', source: 'Quaqua', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: '3x Knockback',
          de: '3x Rückstoß',
          ja: '3x ノックバック',
        },
      },
    },
    {
      id: 'Aloalo Quaqua Arcane Armaments Rout',
      type: 'StartsUsing',
      netRegex: { id: '8B90', source: 'Quaqua', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: '4x Charge',
          de: '4x Ansturm',
          ja: '4x 突進',
        },
      },
    },
    {
      id: 'Aloalo Quaqua Arcane Armaments Water Spear',
      type: 'StartsUsing',
      netRegex: { id: '8B9F', source: 'Quaqua', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Away from spears',
          de: 'Außen zwichen den Dreizack',
          ja: '槍の間の外側へ',
        },
      },
    },
    {
      id: 'Aloalo Quaqua Arcane Armaments Poison Spear',
      type: 'StartsUsing',
      netRegex: { id: '8BA3', source: 'Quaqua', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Avoid spreading spear puddles',
          de: 'Weiche den größer werdenen Speerflächen aus',
        },
      },
    },
    {
      id: 'Aloalo Quaqua Violet Storm',
      type: 'StartsUsing',
      netRegex: { id: '8B95', source: 'Quaqua', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'Aloalo Quaqua Arcane Intervention',
      type: 'StartsUsing',
      netRegex: { id: '8BAE', source: 'Quaqua', capture: false },
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Look Away from Rings',
          de: 'Schau von den Ringen weg',
          fr: 'Ne regardez pas l\'anneau',
          ja: '輪から視線回避',
          cn: '视线避开圆环',
          ko: '고리 모양 눈 시선 피하기',
        },
      },
    },
    // ----------------------------------------- Ketuduke
    {
      id: 'Aloalo Ketuduke Tidal Roar',
      type: 'StartsUsing',
      netRegex: { id: '8AA5', source: 'Ketuduke', capture: false },
      response: Responses.aoe(),
      run: (data) => data.isKetuFight = true,
    },
    {
      id: 'Aloalo Ketuduke Encroaching Twintides',
      type: 'StartsUsing',
      netRegex: { id: '8A9F', source: 'Ketuduke', capture: false },
      response: Responses.getInThenOut(),
    },
    {
      id: 'Aloalo Ketuduke Receding Twintides',
      type: 'StartsUsing',
      netRegex: { id: '8A9D', source: 'Ketuduke', capture: false },
      response: Responses.getOutThenIn(),
    },
    {
      id: 'Aloalo Ketuduke Fluke Typhoon',
      type: 'StartsUsing',
      netRegex: { id: '8A84', source: 'Ketuduke', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Bubbles Move 2 Tiles',
          de: 'Blasen 2 Flächen Rückstoß',
          ja: '泡のみ2マスのノックバック',
        },
      },
    },
    {
      // Path 01
      id: 'Aloalo Ketuduke Water III',
      type: 'Tether',
      netRegex: { id: '0001', source: 'Summoned Apa' },
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Stretch Tether',
          de: 'Verbindung langziehen',
        },
      },
    },
    {
      // Path 02
      id: 'Aloalo Ketuduke Tidal Wave',
      type: 'StartsUsing',
      netRegex: { id: '8D12', source: 'Ketuduke', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Knockback => Get in Bubble',
          de: 'Rückstoß => Geh in eine Blase',
        },
      },
    },
    {
      // Path 03
      id: 'Aloalo Ketuduke Zaratan Add',
      type: 'AddedCombatant',
      netRegex: { npcNameId: '12539', npcBaseId: '16538', capture: false },
      condition: (data) => data.isKetuFight,
      delaySeconds: 16,
      suppressSeconds: 5,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get behind non-bubbled Zaratan',
          de: 'Geh hinter einen Zaratan ohne Blase',
        },
      },
    },
    {
      // Path 04
      id: 'Aloalo Ketuduke Ogrebon Add',
      type: 'AddedCombatant',
      netRegex: { npcNameId: '12540', capture: false },
      condition: (data) => data.isKetuFight,
      delaySeconds: 18,
      suppressSeconds: 5,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get in Bubble',
          de: 'Geh in eine Blase',
        },
      },
    },
    {
      id: 'Aloalo Ketuduke Hydroblast',
      type: 'StartsUsing',
      netRegex: { id: '8AA3', source: 'Ketuduke' },
      response: Responses.tankBuster(),
    },
    // ----------------------------------------- Lala
    {
      id: 'Aloalo Lala Lala Rotation',
      type: 'HeadMarker',
      netRegex: { id: ['01E4', '01E5'], target: 'Lala' },
      run: (data, matches) => data.lalaRotate = matches.id === '01E4' ? 'cw' : 'ccw',
    },
    {
      id: 'Aloalo Lala Player Rotation',
      type: 'HeadMarker',
      netRegex: { id: ['01ED', '01EE'] },
      condition: Conditions.targetIsYou(),
      run: (data, matches) => data.lalaRotate = matches.id === '01ED' ? 'cw' : 'ccw',
    },
    {
      id: 'Aloalo Lala Inferno Theorem',
      type: 'StartsUsing',
      netRegex: { id: '887F', source: 'Lala', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Aloalo LaLa Arcane Blight Open',
      type: 'StartsUsing',
      netRegex: { id: Object.keys(ArcaneBlightMap), source: 'Lala' },
      run: (data, matches) => data.lalaArcaneBlight = ArcaneBlightMap[matches.id.toUpperCase()],
    },
    {
      id: 'Aloalo Lala Arcane Blight',
      type: 'StartsUsing',
      netRegex: { id: '8873', source: 'Lala', capture: false },
      delaySeconds: 1,
      alertText: (data, _matches, output) => {
        if (data.lalaArcaneBlight === undefined)
          return output.text!();
        if (data.lalaRotate === undefined)
          return output[data.lalaArcaneBlight]!();
        if (data.lalaRotate === 'cw') {
          return {
            'front': output.right!(),
            'back': output.left!(),
            'left': output.front!(),
            'right': output.back!(),
          }[data.lalaArcaneBlight];
        }
        return {
          'front': output.left!(),
          'back': output.right!(),
          'left': output.back!(),
          'right': output.front!(),
        }[data.lalaArcaneBlight];
      },
      run: (data) => {
        delete data.lalaArcaneBlight;
        delete data.lalaRotate;
      },
      outputStrings: {
        text: {
          en: 'Go to safe zone',
          de: 'Geh in den sicheren Bereich',
          ja: '安置へ移動',
        },
        front: Outputs.front,
        back: Outputs.back,
        left: Outputs.left,
        right: Outputs.right,
      },
    },
    {
      id: 'Aloalo Lala Analysis Direction',
      type: 'GainsEffect',
      // E8E Front Unseen
      // E8F Back Unseen
      // E90 Right Unseen
      // E91 Left Unseen
      netRegex: { effectId: ['E8E', 'E8F', 'E90', 'E91'], source: 'Lala' },
      condition: Conditions.targetIsYou(),
      delaySeconds: 0.5,
      durationSeconds: 8,
      suppressSeconds: 12, // Once again if failed. Suppress them
      alertText: (data, matches, output) => {
        const map = {
          'E8E': 'front',
          'E8F': 'back',
          'E90': 'right',
          'E91': 'left',
        }[matches.effectId];
        if (map === undefined)
          return;
        if (data.lalaRotate === undefined)
          return output[map]!();
        if (data.lalaRotate === 'ccw')
          return {
            'front': output.left!(),
            'back': output.right!(),
            'left': output.back!(),
            'right': output.front!(),
          }[map];
        return {
          'front': output.right!(),
          'back': output.left!(),
          'left': output.front!(),
          'right': output.back!(),
        }[map];
      },
      run: (data) => delete data.lalaRotate,
      outputStrings: {
        front: {
          en: 'Face Towards Lala',
          de: 'Schau Lala an',
        },
        back: {
          en: 'Look Away from Lala',
          de: 'Schau von Lala weg',
        },
        left: {
          en: 'Left Flank towards Lala',
          de: 'Linke Seite zu Lala drehen',
        },
        right: {
          en: 'Right Flank towards Lala',
          de: 'Rechte Seite zu Lala drehen',
        },
      },
    },
    {
      id: 'Aloalo Lala Floral Figure',
      type: 'StartsUsing',
      netRegex: { id: '8880', source: 'Lala', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Seed adds => Donut AOEs',
          de: 'Samen Adds => Donut AoEs',
          ja: '種 => ドーナツAOE',
        },
      },
    },
    {
      id: 'Aloalo Lala Faunal Figure',
      type: 'StartsUsing',
      netRegex: { id: '8882', source: 'Lala', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Armadillo adds => Big AOEs',
          de: 'Fledermaus Adds => Große AoEs',
          ja: 'コウモリ => ゆかAOE',
        },
      },
    },
    {
      id: 'Aloalo Lala Constructive Figure',
      type: 'StartsUsing',
      netRegex: { id: '8884', source: 'Lala', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Tree adds => Line AOEs',
          de: 'Baum Adds => Linien AoEs',
          ja: '木 => 直線AOE',
        },
      },
    },
    {
      id: 'Aloalo Lala Strategic Strike',
      type: 'StartsUsing',
      netRegex: { id: '887E', source: 'Lala' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Aloalo Lala Calculated Trajectory',
      type: 'GainsEffect',
      netRegex: { effectId: ['E83', 'E84', 'E85', 'E86'] },
      condition: Conditions.targetIsYou(),
      delaySeconds: 3,
      durationSeconds: 7,
      alertText: (data, matches, output) => {
        const map = {
          'E83': 'front',
          'E84': 'back',
          'E85': 'left',
          'E86': 'right',
        }[matches.effectId];
        if (map === undefined)
          return;
        if (data.lalaRotate === undefined)
          return output[map]!();
        if (data.lalaRotate === 'cw') {
          return {
            'front': output.right!(),
            'back': output.left!(),
            'left': output.front!(),
            'right': output.back!(),
          }[map];
        }
        return {
          'front': output.left!(),
          'back': output.right!(),
          'left': output.back!(),
          'right': output.front!(),
        }[map];
      },
      run: (data) => delete data.lalaRotate,
      outputStrings: {
        front: {
          en: 'Forward March (1 square)',
          de: 'Geistlenkung: Vorwärts',
          fr: 'Piratage mental : Vers l\'avant', // FIXME
          ja: '強制移動 : 前', // FIXME
          cn: '强制移动 : 前', // FIXME
          ko: '강제이동: 앞', // FIXME
        },
        back: {
          en: 'Backwards March (1 square)',
          de: 'Geistlenkung: Rückwärts',
          fr: 'Piratage mental : Vers l\'arrière', // FIXME
          ja: '強制移動 : 後ろ', // FIXME
          cn: '强制移动 : 后', // FIXME
          ko: '강제이동: 뒤', // FIXME
        },
        left: {
          en: 'Left March (1 square)',
          de: 'Geistlenkung: Links',
          fr: 'Piratage mental : Vers la gauche', // FIXME
          ja: '強制移動 : 左', // FIXME
          cn: '强制移动 : 左', // FIXME
          ko: '강제이동: 왼쪽', // FIXME
        },
        right: {
          en: 'Right March (1 square)',
          de: 'Geistlenkung: Rechts',
          fr: 'Piratage mental : Vers la droite', // FIXME
          ja: '強制移動 : 右', // FIXME
          cn: '强制移动 : 右', // FIXME
          ko: '강제이동: 오른쪽', // FIXME
        },
      },
    },
    // ----------------------------------------- Statice
    {
      id: 'Aloalo Statice Pop',
      type: 'StartsUsing',
      netRegex: { id: '892F', source: 'Statice', capture: false },
      response: Responses.knockback(),
    },
    {
      id: 'Aloalo Statice Trick Reload',
      type: 'StartsUsing',
      netRegex: { id: '892A', source: 'Statice', capture: false },
      run: (data) => {
        data.reloadCount = 0;
        data.reloadFailed = [];
      },
    },
    {
      id: 'Aloalo Statice Locked and Loaded',
      type: 'Ability',
      netRegex: { id: '8925', source: 'Statice', capture: false },
      run: (data) => data.reloadCount++,
    },
    {
      id: 'Aloalo Statice Misload',
      type: 'Ability',
      netRegex: { id: '8926', source: 'Statice', capture: false },
      run: (data) => {
        data.reloadCount++;
        data.reloadFailed.push(data.reloadCount);
      },
    },
    {
      id: 'Aloalo Statice Trigger Happy',
      type: 'StartsUsing',
      netRegex: { id: '892B', source: 'Statice', capture: false },
      infoText: (data, _matches, output) => {
        return output.text!({ safe: data.reloadFailed });
      },
      outputStrings: {
        text: {
          en: 'Safe: ${safe}',
          de: 'Sicher: ${safe}',
          ja: '安置: ${safe}',
        },
      },
    },
    {
      id: 'Aloalo Statice Aero IV',
      type: 'StartsUsing',
      netRegex: { id: '8929', source: 'Statice', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Aloalo Statice Shocking Abandon',
      type: 'StartsUsing',
      netRegex: { id: '8928', source: 'Statice' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Aloalo Statice Fair Flight',
      type: 'StartsUsing',
      netRegex: { id: '8946', source: 'Statice', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Stand on cushion',
          de: 'Auf einem Kissen stehen',
        },
      },
    },
    // ----------------------------------------- Loquloqui
    {
      id: 'Aloalo Loquloqui Long-lost Light',
      type: 'StartsUsing',
      netRegex: { id: '87BC', source: 'Loquloqui', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Aloalo Loquloqui O Life, Flourish',
      type: 'StartsUsing',
      netRegex: { id: '87C4', source: 'Loquloqui', capture: false },
      durationSeconds: 10,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Glowing adds get larger',
          de: 'Weiche leuchtenden Adds aus',
          ja: '光ってる物に注意',
        },
      },
    },
    {
      id: 'Aloalo Loquloqui Protective Will',
      type: 'StartsUsing',
      netRegex: { id: '87BE', source: 'Loquloqui' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Aloalo Loquloqui O Petals, Unfurl',
      type: 'StartsUsing',
      netRegex: { id: '87C5', source: 'Loquloqui', capture: false },
      durationSeconds: 10,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Away from tether ends',
          de: 'Weiche Verbindungen aus',
          ja: '縮む線を回避',
        },
      },
    },
    {
      id: 'Aloalo Loquloqui Land Wave',
      type: 'StartsUsing',
      netRegex: { id: '87BD', source: 'Loquloqui', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'Aloalo Loquloqui O Isle, Bloom',
      type: 'StartsUsing',
      netRegex: { id: '87C7', source: 'Loquloqui', capture: false },
      durationSeconds: 10,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Last bloom => Walk into Safe',
          de: 'Letzte Blüte => Geh zum sicheren Bereich',
          ja: '最後の花畑 => 安置へ移動',
        },
      },
    },
    {
      id: 'Aloalo Loquloqui Sanctuary',
      type: 'StartsUsing',
      netRegex: { id: '87CA', source: 'Loquloqui', capture: false },
      durationSeconds: 4.5,
      response: Responses.getOut(),
    },
    {
      id: 'Aloalo Loquloqui Stirring of Spirits',
      type: 'StartsUsing',
      netRegex: { id: '87CB', source: 'Loquloqui', capture: false },
      durationSeconds: 10,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: '5x Knockback',
          de: '5x Rückstoß',
          ja: '5x ノックバック',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Far Tide/Near Tide': 'Far/Near Tide',
        'Meteor/Sledgemagic/Hunks of Junk/Happy Surprise': '--dartboard result--',
        'Receding Twintides/Encroaching Twintides': 'Receding/Encroaching Twintides',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'Aetheric Charge': 'magisch(?:e|er|es|en) Sphäre',
        'Aloalo Ahool': 'Aloalo-Ahool',
        'Aloalo Golem': 'Aloalo-Holzgolem',
        'Aloalo Ogrebon': 'Aloalo-Ogerbon',
        'Aloalo Zaratan': 'Aloalo-Zaratan',
        'Anala Familiar': 'Anala-Familiar',
        'Drake Familiar': 'Drakon-Familiar',
        'Kairimai Loquloqai': 'Kairimai Loquloqai',
        'Kapokapo': 'Kapokapo',
        'Ketuduke': 'Ketuduke',
        'Ketulu Cove': 'Ketulu-Bucht',
        'Lala': 'Lala',
        'Loquloqui': 'Loquloqui',
        'Needle': 'Nadel',
        'Quaqua': 'Quaqua',
        'Repuruba Loqua': 'Repuruba Loqua',
        'Rodiaki': 'Rodiaki',
        'Seasong\'s Rest': 'Ruh der Seesänger',
        'Spring Crystal': 'Wasserquell-Kristall',
        'Statice': 'Statice',
        'Summoned Anila': 'Anila-Beschwörung',
        'Summoned Apa': 'Apa-Beschwörung',
        'Surprising Staff': 'Überraschungsstab',
        'The Elder Stump': 'Altenstumpf',
        'The Origin Spring': 'Urquell',
        'The Slumbering Canopy': 'Schlafende Krone',
        'The ancient forum': 'Altes Forum',
        'Treasure Box': 'Schatzkiste',
        'Uolosapa Loqua': 'Uolosapa Loqua',
        'Zeal-blind Zozone': 'Zozone vom Feuereifer',
      },
      'replaceText': {
        '--cleanse--': '--reinigen--',
        '4-tonze Weight': ' 4 Tonzen',
        'Aero II': 'Windra',
        'Aero IV': 'Windka',
        'Analysis': 'Analyse',
        'Arcane Armaments': 'Arkane Armierung',
        'Arcane Blight': 'Arkane Fäule',
        'Arcane Intervention': 'Strenger Blick',
        'Arcane Plot': 'Arkane Flur',
        'Arcane Pursuit': 'Arkane Verfolgung',
        'Blowing Bubbles': 'Pusteblasen',
        'Brilliant Blossoms': 'Erblühter Grund',
        'Bubble Net': 'Blasennetz',
        'Burst': 'Explosion',
        'Calculated Trajectory': 'Marschbefehl',
        'Cloud to Ground': 'Sturmkonzentration',
        'Constructive Figure': 'Ruf der Schöpfer',
        'Dartboard': 'Dartspielchen',
        'Elemental Impact': 'Einschlag',
        'Encroaching Twintides': 'Ring der Zwiegezeiten',
        'Faerie Ring': 'Feenring',
        'Faerie Road': 'Feenpfad',
        'Fair Flight': 'Feenflug',
        'Far Tide': 'Ring der Gezeiten',
        'Faunal Figure': 'Ruf der Fauna',
        'Fire Spread': 'Brandstiftung',
        'Flail Smash': 'Dresche',
        'Floral Figure': 'Ruf der Flora',
        'Flowing Lance': 'Fließende Lanze',
        'Fluke Typhoon': 'Flossentaifun',
        'Hammer Landing': 'Hammersprung',
        'Happy Surprise': 'Fröhliche Überraschung',
        'Hidden Mine': 'Minenfalle',
        'Howl': 'Geheul',
        'Hundred Lashings': 'Auspeitschung',
        'Hunks of Junk': 'Metallschrott',
        'Hydroblast': 'Hydro-Schlag',
        'Hydrobomb': 'Hydro-Bombe',
        'Hydrosurge': 'Hydro-Wallung',
        'Inferno Theorem': 'Infernales Theorem',
        'Islebloom Light': 'Lebende Erde',
        'Jack-in-the-box': 'Springteufel',
        'Land Wave': 'Landwelle',
        'Long-lost Light': 'Verlorenes Licht',
        'Made Magic': 'Magiefeuer',
        'Meteor': 'Meteor',
        'Near Tide': 'Kreis der Gezeiten',
        'O Isle, Bloom': 'O Insel, erblühe!',
        'O Life, Flourish': 'O Leben, gedeihe!',
        'O Petals, Unfurl': 'O Blüten, erwachet!',
        'O Sky, Be Mine': 'O Himmel, werde mein!',
        'Pinwheel': 'Feuerrad',
        'Pliant Petals': 'Erwachte Blüte',
        'Pop': 'Platzen',
        'Present Box': 'Geschenkschachtel',
        'Protective Will': 'Schützender Wille',
        'Ravaging Axe': 'Verheerende Axt',
        'Receding Twintides': 'Kreis der Zwiegezeiten',
        'Ringing Quoits': 'Klingende Ringe',
        '(?<! )Roar': 'Brüllen',
        'Rolling Spout': 'Ringguss',
        'Rout': 'Kolossgalopp',
        'Rush': 'Stürmen',
        'Sanctuary': 'Zuflucht',
        'Saturate': 'Wasserfontäne',
        'Scalding Waves': 'Siedende Wogen',
        'Shock(?!\\w)': 'Entladung',
        'Shocking Abandon': 'Schockende Hingabe',
        'Shockwave': 'Schockwelle',
        'Sledgemagic': 'Vorschlagmagie',
        'Sphere Shatter': 'Sphärensplitterung',
        'Spring Crystals': 'Quellkristalle',
        'Stirring of Spirits': 'Erwachen der Geister',
        'Strategic Strike': 'Schwere Attacke',
        'Strewn Bubbles': 'Streublasen',
        'Summon(?!\\w)': 'Familiar',
        'Summoning Rite': 'Beschwörung',
        'Surprise Balloon': 'Überraschungsballon',
        'Surprise Needle': 'Überraschungsnadel',
        'Targeted Light': 'Gezieltes Licht',
        'Thunderstorm': 'Gewitter',
        'Tidal Roar': 'Schrei der Gezeiten',
        'Tidal Wave': 'Flutwelle',
        'Trick Reload': 'Trickladung',
        'Trigger Happy': 'Schießwut',
        'Turnabout': 'Umdrehung',
        'Updraft': 'Aufwind',
        'Violet Storm': 'Fliederblitz',
        'Volcanic Coordinates': 'Infernaler Durchstoß',
        'Water III': 'Aquaga',
        'Wavefoam': 'Blasenwelle',
        'Whoopee Cushion': 'Pupskissen',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Aetheric Charge': 'globe magique',
        'Aloalo Ahool': 'ahool d\'Aloalo',
        'Aloalo Golem': 'golem sylvestre d\'Aloalo',
        'Aloalo Ogrebon': 'ogrebon d\'Aloalo',
        'Aloalo Zaratan': 'zaratan d\'Aloalo',
        'Anala Familiar': 'anala apprivoisé',
        'Drake Familiar': 'draconide apprivoisé',
        'Kairimai Loquloqai': 'Kairimai Loquloqai',
        'Kapokapo': 'Kapokapo',
        'Ketuduke': 'Ketuduke',
        'Ketulu Cove': 'Baie de Ketulu',
        'Lala': 'Lala',
        'Loquloqui': 'Loquloqui',
        'Needle': 'aiguille',
        'Quaqua': 'Quaqua',
        'Repuruba Loqua': 'repuruba loqua',
        'Rodiaki': 'Rodiaki',
        'Seasong\'s Rest': 'Repos du Chant marin',
        'Spring Crystal': 'cristal de source',
        'Statice': 'Statice',
        'Summoned Anila': 'anila d\'Aloalo',
        'Summoned Apa': 'apa d\'Aloalo',
        'Surprising Staff': 'sceptre surprise',
        'The Elder Stump': 'Souche du Doyen',
        'The Origin Spring': 'Fontaine de l\'Origine',
        'The Slumbering Canopy': 'Voûte apaisée',
        'The ancient forum': 'Ancienne grand-place',
        'Treasure Box': 'coffre au trésor mécanique',
        'Uolosapa Loqua': 'uolosapa loqua',
        'Zeal-blind Zozone': 'Zozone le téméraire',
      },
      'replaceText': {
        '4-tonze Weight': 'Poids de 4 tonz',
        'Aero II': 'Extra Vent',
        'Aero IV': 'Giga Vent',
        'Analysis': 'Analyse',
        'Arcane Armaments': 'Armes arcaniques',
        'Arcane Blight': 'Canon arcanique',
        'Arcane Intervention': 'Œil sévère',
        'Arcane Plot': 'Modulateur arcanique',
        'Arcane Pursuit': 'Chaîne arcanique',
        'Blowing Bubbles': 'Bulles soufflées',
        'Brilliant Blossoms': 'Tempête de pétales',
        'Bubble Net': 'Filet de bulles',
        'Burst': 'Explosion',
        'Calculated Trajectory': 'Déplacement forcé',
        'Cloud to Ground': 'Attaque fulminante',
        'Constructive Figure': 'Icône articulée',
        'Dartboard': 'Jeu de fléchettes',
        'Elemental Impact': 'Impact de canon',
        'Encroaching Twintides': 'Double marée débordante',
        'Faerie Ring': 'Cercle féérique',
        'Faerie Road': 'Route féérique',
        'Fair Flight': 'Projection féérique',
        'Far Tide': 'Marée lointaine',
        'Faunal Figure': 'Icône bestiale',
        'Fire Spread': 'Nappe de feu',
        'Flail Smash': 'Fléau fracassant',
        'Floral Figure': 'Icône florale',
        'Flowing Lance': 'Lance hydrique',
        'Fluke Typhoon': 'Typhon hasardeux',
        'Hammer Landing': 'Bondissement martelé',
        'Happy Surprise': 'Heureuse surprise',
        'Hidden Mine': 'Explosion de mine',
        'Howl': 'Hurlement',
        'Hundred Lashings': 'Cent coups de fouet',
        'Hunks of Junk': 'Débris de métal',
        'Hydroblast': 'Souffle hydrique',
        'Hydrobomb': 'Hydrobombe',
        'Hydrosurge': 'Déferlante hydrique',
        'Inferno Theorem': 'Théorème infernal',
        'Islebloom Light': 'Lueur ascendante',
        'Jack-in-the-box': 'Coffres au trésor',
        'Land Wave': 'Vague tellurique',
        'Long-lost Light': 'Lumière perdue',
        'Made Magic': 'Déferlante magique',
        'Meteor': 'Météore',
        'Near Tide': 'Marée proche',
        'O Isle, Bloom': 'Prière de fertilité',
        'O Life, Flourish': 'Prière de renaissance',
        'O Petals, Unfurl': 'Prière d\'éclosion',
        'O Sky, Be Mine': 'Prière d\'expansion',
        'Pinwheel': 'Moulinette',
        'Pliant Petals': 'Cercle de floraison',
        'Pop': 'Rupture',
        'Present Box': 'Boîtes cadeaux',
        'Protective Will': 'Esprit protecteur',
        'Ravaging Axe': 'Hache dévastatrice',
        'Receding Twintides': 'Double marée fuyante',
        'Ringing Quoits': 'Anneaux tintants',
        '(?<! )Roar': 'Rugissement',
        'Rolling Spout': 'Jaillissement annulaire',
        'Rout(?!\\w)': 'Charge pachydermique',
        'Rush': 'Ruée',
        'Sanctuary': 'Éclat de l\'apaisement divin',
        'Saturate': 'Jet d\'eau',
        'Scalding Waves': 'Ondes enflammées',
        'Shock(?!\\w)': 'Décharge électrostatique',
        'Shocking Abandon': 'Choc renonciateur',
        'Shockwave': 'Onde de choc',
        'Sledgemagic': 'Masse magique',
        'Sphere Shatter': 'Rupture',
        'Spring Crystals': 'Cristaux de source',
        'Stirring of Spirits': 'Écrasement de l\'apaisement divin',
        'Strategic Strike': 'Coup violent',
        'Strewn Bubbles': 'Bulles éparpillées',
        'Summon(?!\\w)': 'Invocation',
        'Summoning Rite': 'Invocation rituelle',
        'Surprise Balloon': 'Ballon surprise',
        'Surprise Needle': 'Aiguille surprise',
        'Targeted Light': 'Rayon ciblé',
        'Thunderstorm': 'Tempête de foudre',
        'Tidal Roar': 'Vague rugissante',
        'Tidal Wave': 'Raz-de-marée',
        'Trick Reload': 'Rechargement habile',
        'Trigger Happy': 'Gâchette impulsive',
        'Turnabout': 'Rotation',
        'Updraft': 'Courants ascendants',
        'Violet Storm': 'Tempête pourpre',
        'Volcanic Coordinates': 'Théorème combustible',
        'Water III': 'Méga Eau',
        'Wavefoam': 'Vague de bulles',
        'Whoopee Cushion': 'Coussins péteurs',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Aetheric Charge': '魔力球',
        'Aloalo Ahool': 'アロアロ・アフール',
        'Aloalo Golem': 'アロアロ・ウッドゴーレム',
        'Aloalo Ogrebon': 'アロアロ・オーガボン',
        'Aloalo Zaratan': 'アロアロ・ザラタン',
        'Anala Familiar': 'アナラ・ファミリア',
        'Drake Familiar': 'ドレイク・ファミリア',
        'Kairimai Loquloqai': '神子の祭壇',
        'Kapokapo': 'カポカポ',
        'Ketuduke': 'ケトゥドゥケ',
        'Ketulu Cove': 'ケトゥルの江湾',
        'Lala': 'ララ',
        'Loquloqui': 'ロクロクイ',
        'Needle': 'ニードル',
        'Quaqua': 'クアクア',
        'Repuruba Loqua': 'レプルバ・ロクア',
        'Rodiaki': 'ロディアキ',
        'Seasong\'s Rest': '鯨の還る地',
        'Spring Crystal': '湧水のクリスタル',
        'Statice': 'スターチス',
        'Summoned Anila': 'サモン・アニラ',
        'Summoned Apa': 'サモン・アーパス',
        'Surprising Staff': 'サプライズ・ロッド',
        'The Elder Stump': '老樹の切り株',
        'The Origin Spring': '大樹の命泉',
        'The Slumbering Canopy': '昏き微睡の間',
        'The ancient forum': '古き広場',
        'Treasure Box': 'トレジャーボックス',
        'Uolosapa Loqua': 'オーロサパ・ロクア',
        'Zeal-blind Zozone': '粗忽のゾゾネ',
      },
      'replaceText': {
        '4-tonze Weight': '4トンズ',
        'Aero II': 'エアロラ',
        'Aero IV': 'エアロジャ',
        'Analysis': 'アナライズ',
        'Arcane Armaments': '魔力成形',
        'Arcane Blight': '魔紋砲',
        'Arcane Intervention': '魔眼',
        'Arcane Plot': '変光魔紋',
        'Arcane Pursuit': '魔力の呪鎖',
        'Blowing Bubbles': 'バブルブロワー',
        'Brilliant Blossoms': '地に満つる風花',
        'Bubble Net': 'バブルネットフィーディング',
        'Burst': '爆発',
        'Calculated Trajectory': '強制移動',
        'Cloud to Ground': '襲雷',
        'Constructive Figure': '人形召喚',
        'Dartboard': 'ダーツチャレンジ',
        'Elemental Impact': '着弾',
        'Encroaching Twintides': 'リング・ダブルタイド',
        'Faerie Ring': 'フェアリーリング',
        'Faerie Road': 'フェアリーロード',
        'Fair Flight': 'フェアリーノックアップ',
        'Far Tide': 'リングタイド',
        'Faunal Figure': '動物召喚',
        'Fire Spread': '放火',
        'Flail Smash': 'フレイルスマッシュ',
        'Floral Figure': '植物召喚',
        'Flowing Lance': '水槍',
        'Fluke Typhoon': 'フリッパータイフーン',
        'Hammer Landing': '衝槌撃',
        'Happy Surprise': 'サプライズハッピー',
        'Hidden Mine': '地雷爆発',
        'Howl': '遠吠え',
        'Hundred Lashings': 'めった打ち',
        'Hunks of Junk': 'メタルジャンク',
        'Hydroblast': 'ハイドロブラスト',
        'Hydrobomb': 'ハイドロボム',
        'Hydrosurge': 'ハイドロサージ',
        'Inferno Theorem': '散火法',
        'Islebloom Light': '地より昇る光',
        'Jack-in-the-box': 'ジャック・イン・ザ・ボックス',
        'Land Wave': '地霊波',
        'Long-lost Light': '忘れられた光',
        'Made Magic': '魔力放出',
        'Meteor': 'メテオ',
        'Near Tide': 'ラウンドタイド',
        'O Isle, Bloom': '祈願：地に満ちよ',
        'O Life, Flourish': '祈願：生い育て',
        'O Petals, Unfurl': '祈願：咲き誇れ',
        'O Sky, Be Mine': '祈願：伸び育て',
        'Pinwheel': 'ピンウィール',
        'Pliant Petals': '咲き誇る大輪',
        'Pop': '破裂',
        'Present Box': 'プレゼントボックス',
        'Protective Will': '霊衝',
        'Ravaging Axe': '戦斧の一撃',
        'Receding Twintides': 'ラウンド・ダブルタイド',
        'Ringing Quoits': '戦輪の旋撃',
        '(?<! )Roar': '咆哮',
        'Rolling Spout': 'リングスパウト',
        'Rout': '猛進',
        'Rush': '突進',
        'Sanctuary': '地鎮の輝き',
        'Saturate': '放水',
        'Scalding Waves': '炎波',
        'Shock(?!\\w)': '放電',
        'Shocking Abandon': 'アバンドンショック',
        'Shockwave': '衝撃波',
        'Sledgemagic': 'マジック・スレッジハンマー',
        'Sphere Shatter': '破裂',
        'Spring Crystals': '湧水のクリスタル',
        'Stirring of Spirits': '地鎮の足踏み',
        'Strategic Strike': '強撃',
        'Strewn Bubbles': 'バブルストゥルー',
        'Summon(?!\\w)': 'サモン',
        'Summoning Rite': '招来',
        'Surprise Balloon': 'サプライズバルーン',
        'Surprise Needle': 'サプライズニードル',
        'Targeted Light': '高精度光弾',
        'Thunderstorm': 'サンダーストーム',
        'Tidal Roar': 'タイダルロア',
        'Tidal Wave': 'タイダルウェイブ',
        'Trick Reload': 'トリックリロード',
        'Trigger Happy': 'トリガーハッピー',
        'Turnabout': '旋回',
        'Updraft': '上昇気流',
        'Violet Storm': '紫雷波',
        'Volcanic Coordinates': '点火法',
        'Water III': 'ウォタガ',
        'Wavefoam': 'バブルウェイブ',
        'Whoopee Cushion': 'ウーピークッション',
      },
    },
  ],
};

export default triggerSet;
