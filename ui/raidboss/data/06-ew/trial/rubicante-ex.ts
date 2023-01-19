import Conditions from '../../../../../resources/conditions';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { NetMatches } from '../../../../../types/net_matches';
import { TriggerSet } from '../../../../../types/trigger';

/**
Slots:
00 = Arena fiery or not
01 = Inner circle
02 = Middle ring
03 = Outer ring
04 = Flamespire brand indicator?

00 flags:
00020001 = Fiery
00080004 = Not fiery

01/02/03 flags:
00020001 = Arrows rotating CW
00080004 = Clear CW arrows
00200010 = Arrows rotating CCW
00400004 = Clear CCW arrows

04 flags:
00010001 = cardinals safe?
00200020 = intercards safe?
00080004 = clear indicator
 */

// 7D09 Ghastly Torch during add phase *is* an aoe but is constant and small, so skipped.

export interface Data extends RaidbossData {
  decOffset?: number;
  flamespireBrandStack?: string;
  flamespireBrandHasFlare?: boolean;
  dualfireTargets: string[];
  flamespireClawNumber?: number;
  flamespireClawDelay?: number;
  flamespireClawCounter: number;
}

const bloomingWeltFlare = 'D9B';
const furiousWeltStack = 'D9C';
const stingingWeltSpread = 'D9D';

// First headmarker is tankbuster on MT
const firstHeadmarker = parseInt('0156', 16);
const getHeadmarkerId = (data: Data, matches: NetMatches['HeadMarker']) => {
  if (typeof data.decOffset === 'undefined')
    data.decOffset = parseInt(matches.id, 16) - firstHeadmarker;
  return (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase().padStart(4, '0');
};

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.MountOrdealsExtreme,
  timelineFile: 'rubicante-ex.txt',
  initData: () => {
    return {
      dualfireTargets: [],
      flamespireClawCounter: 0,
    };
  },
  triggers: [
    {
      id: 'RubicanteEx Headmarker Tracker',
      type: 'HeadMarker',
      netRegex: {},
      condition: (data) => data.decOffset === undefined,
      run: (data, matches) => {
        getHeadmarkerId(data, matches);
      },
    },
    {
      id: 'RubicanteEx Inferno Raidwide',
      type: 'StartsUsing',
      netRegex: { id: '7D2C', source: 'Rubicante', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'RubicanteEx Inferno Spread',
      type: 'StartsUsing',
      netRegex: { id: '7D0F', source: 'Rubicante', capture: false },
      response: Responses.spread(),
    },
    {
      id: 'RubicanteEx Shattering Heat',
      type: 'StartsUsing',
      netRegex: { id: '7D2D', source: 'Rubicante' },
      response: Responses.tankBuster(),
    },
    {
      id: 'RubicanteEx Spike of Flame',
      type: 'StartsUsing',
      netRegex: { id: '7D02', source: 'Rubicante' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'RubicanteEx Fourfold Flame',
      type: 'StartsUsing',
      netRegex: { id: '7D03', source: 'Rubicante', capture: false },
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.group!(),
      outputStrings: {
        group: Outputs.healerGroups,
      },
    },
    {
      id: 'RubicanteEx Twinfold Flame',
      type: 'StartsUsing',
      netRegex: { id: '7D04', source: 'Rubicante', capture: false },
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.stack!(),
      outputStrings: {
        stack: {
          en: 'Partner Stacks',
          de: 'Mit Partner sammeln',
          fr: 'Package avec votre partenaire',
          ja: '2人頭割り',
          cn: '2人分摊',
          ko: '2인 쉐어',
        },
      },
    },
    {
      id: 'RubicanteEx Radial Flagration',
      type: 'StartsUsing',
      netRegex: { id: '7CFE', source: 'Rubicante', capture: false },
      alertText: (_data, _matches, output) => output.spread!(),
      outputStrings: {
        spread: {
          en: 'Protean',
          de: 'Himmelsrichtung',
          fr: 'Positions',
          ja: '基本散会',
          cn: '分散引导',
          ko: '기본 산개',
        },
      },
    },
    {
      id: 'RubicanteEx Flamesent Ghastly Wind Tether',
      type: 'Tether',
      netRegex: { id: '00C0' },
      condition: (data, matches) => matches.target === data.me,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Face tether out',
          de: 'Verbindung nach draußen richten',
          fr: 'Lien vers l\'extérieur',
          ja: '線を外へ向ける',
          cn: '离开人群背对连线',
          ko: '본진 바깥으로 유도하기',
        },
      },
    },
    {
      id: 'RubicanteEx Flamesent Shattering Heat Tether',
      type: 'Tether',
      netRegex: { id: '0054', capture: false },
      suppressSeconds: 15,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Tank Tethers',
          de: 'Tank Verbindungen',
          ja: 'タンク線取り',
        },
      },
    },
    {
      id: 'RubicanteEx Blazing Rapture',
      type: 'StartsUsing',
      netRegex: { id: '7D07', source: 'Rubicante', capture: false },
      // This is a 14 second cast.
      delaySeconds: 4,
      response: Responses.bigAoe(),
    },
    {
      id: 'RubicanteEx Flamespire Brand Debuff Collect',
      type: 'GainsEffect',
      netRegex: { effectId: [bloomingWeltFlare, furiousWeltStack] },
      run: (data, matches) => {
        if (matches.effectId === furiousWeltStack)
          data.flamespireBrandStack = matches.target;
        if (matches.effectId === bloomingWeltFlare && data.me === matches.target)
          data.flamespireBrandHasFlare = true;
      },
    },
    {
      id: 'RubicanteEx Flamespire Brand Debuff Call',
      type: 'GainsEffect',
      netRegex: { effectId: [bloomingWeltFlare, furiousWeltStack], capture: false },
      delaySeconds: 0.3,
      suppressSeconds: 2,
      infoText: (data, _matches, output) => {
        // TODO: this could call "support out / dps in" kinda thing.
        if (data.flamespireBrandHasFlare)
          return output.outFlareThenSpread!();
        return output.inStackThenSpread!();
      },
      outputStrings: {
        outFlareThenSpread: {
          en: 'Out+Flare => Spread',
          de: 'Raus+Flare => Verteilen',
          ja: '外側＋フレア => 散会',
        },
        inStackThenSpread: {
          en: 'In+Stack => Spread',
          de: 'Rein+Sammeln => Verteilen',
          ja: '内側＋頭割り => 散会',
        },
      },
    },
    {
      id: 'RubicanteEx Flamespire Brand Blooming Welt',
      type: 'GainsEffect',
      netRegex: { effectId: bloomingWeltFlare },
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 3,
      alertText: (_data, _matches, output) => output.out!(),
      outputStrings: {
        out: Outputs.out,
      },
    },
    {
      id: 'RubicanteEx Flamespire Brand Furious Welt',
      type: 'GainsEffect',
      netRegex: { effectId: furiousWeltStack },
      condition: (data) => !data.flamespireBrandHasFlare,
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 3,
      alertText: (data, _matches, output) => {
        if (data.flamespireBrandStack === data.me)
          return output.stackOnYou!();
        return output.stackOnPlayer!({ player: data.ShortName(data.flamespireBrandStack) });
      },
      outputStrings: {
        stackOnPlayer: Outputs.stackOnPlayer,
        stackOnYou: Outputs.stackOnYou,
      },
    },
    {
      id: 'RubicanteEx Flamespire Brand Stinging Welt',
      type: 'GainsEffect',
      netRegex: { effectId: stingingWeltSpread },
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 3,
      response: Responses.spread(),
    },
    {
      id: 'RubicanteEx Scalding Signal',
      type: 'StartsUsing',
      netRegex: { id: '7D24', source: 'Rubicante', capture: false },
      alertText: (_data, _matches, output) => output.outAndProtean!(),
      outputStrings: {
        outAndProtean: {
          en: 'Out + Protean',
          de: 'Raus + Himmelsrichtung',
          fr: 'Extérieur + Positions',
          ja: '外側 + 基本散会',
          cn: '外侧 + 分散引导',
          ko: '밖으로 + 기본 산개',
        },
      },
    },
    {
      id: 'RubicanteEx Scalding Ring',
      type: 'StartsUsing',
      netRegex: { id: '7D25', source: 'Rubicante', capture: false },
      alertText: (_data, _matches, output) => output.inAndProtean!(),
      outputStrings: {
        inAndProtean: {
          en: 'In + Protean',
          de: 'Rein + Himmelsrichtung',
          fr: 'Intérieur + Positions',
          ja: '内側 + 基本散会',
          cn: '内侧 + 分散引导',
          ko: '안으로 + 기본 산개',
        },
      },
    },
    {
      id: 'RubicanteEx Sweeping Immolation Spread',
      type: 'StartsUsing',
      netRegex: { id: '7D20', source: 'Rubicante', capture: false },
      alertText: (_data, _matches, output) => output.spreadBehind!(),
      outputStrings: {
        spreadBehind: {
          en: 'Spread behind Boss',
          de: 'Hinter dem Boss verteilen',
          ja: 'ボスの後ろで散会',
        },
      },
    },
    {
      id: 'RubicanteEx Sweeping Immolation Stack',
      type: 'StartsUsing',
      netRegex: { id: '7D21', source: 'Rubicante', capture: false },
      infoText: (_data, _matches, output) => output.stackBehind!(),
      outputStrings: {
        stackBehind: {
          en: 'Stack behind Boss',
          de: 'Hinter dem Boss sammeln',
          ja: 'ボスの後ろで頭割り',
        },
      },
    },
    {
      id: 'RubicanteEx Dualfire Target',
      // These headmarkers come out just before the 72DE self-targeted cast.
      type: 'HeadMarker',
      netRegex: {},
      alertText: (data, matches, output) => {
        const id = getHeadmarkerId(data, matches);
        if (id !== '00E6')
          return;
        data.dualfireTargets.push(matches.target);
        if (data.me === matches.target)
          return output.tankCleaveOnYou!();
      },
      outputStrings: {
        tankCleaveOnYou: Outputs.tankCleaveOnYou,
      },
    },
    {
      id: 'RubicanteEx Dualfire Not You',
      type: 'StartsUsing',
      netRegex: { id: '7D2E', source: 'Rubicante', capture: false },
      infoText: (data, _matches, output) => {
        if (data.dualfireTargets.includes(data.me))
          return;
        if (data.role === 'healer')
          return output.tankBusterCleaves!();
        return output.avoidTankCleaves!();
      },
      run: (data) => data.dualfireTargets = [],
      outputStrings: {
        tankBusterCleaves: {
          en: 'Tank Buster Cleaves',
          de: 'Tankbuster Cleaves',
          ja: 'MT・ST同時範囲攻撃',
        },
        avoidTankCleaves: {
          en: 'Avoid Tank Cleaves',
          de: 'Tankbuster Cleaves ausweichen',
          ja: '範囲攻撃を避けて',
        },
      },
    },
    {
      id: 'RubicanteEx Flamespire Claw Numbers',
      type: 'HeadMarker',
      netRegex: {},
      condition: (data, matches) => {
        return data.me === matches.target &&
          (/00(?:4F|5[0-6])/).test(getHeadmarkerId(data, matches));
      },
      preRun: (data, matches) => {
        const correctedMatch = getHeadmarkerId(data, matches);
        const clawNumberMap: { [id: string]: number } = {
          '004F': 1,
          '0050': 2,
          '0051': 3,
          '0052': 4,
          '0053': 5,
          '0054': 6,
          '0055': 7,
          '0056': 8,
        };
        data.flamespireClawNumber = clawNumberMap[correctedMatch];

        const clawDelayMap: { [id: string]: number } = {
          '004F': 8.3,
          '0050': 10.3,
          '0051': 12.3,
          '0052': 14.3,
          '0053': 16.3,
          '0054': 18.3,
          '0055': 20.3,
          '0056': 22.3,
        };
        data.flamespireClawDelay = clawDelayMap[correctedMatch];
        data.flamespireClawCounter = 0;
      },
      durationSeconds: (data) => {
        return data.flamespireClawDelay;
      },
      alertText: (data, _matches, output) => {
        // A common strategy is to have 7 and 8 grab the first tether
        // and everybody pick up a tether after being hit.
        if (data.flamespireClawNumber !== undefined && data.flamespireClawNumber <= 6)
          return output.num!({ num: data.flamespireClawNumber });
        return output.numGetTether!({ num: data.flamespireClawNumber });
      },
      outputStrings: {
        num: {
          en: '#${num}',
          de: '#${num}',
          fr: '#${num}',
          ja: '${num}番',
          cn: '#${num}',
          ko: '${num}번째',
        },
        numGetTether: {
          en: '#${num} (Get Tether)',
          de: '#${num} (Verbindung nehmen)',
          ja: '${num}番 (線取りに行く)',
        },
      },
    },
    {
      id: 'RubicanteEx Flamespire Claw Counter',
      type: 'Ability',
      netRegex: { id: '7D29', source: 'Rubicante', targetIndex: '0', capture: false },
      preRun: (data, _matches) => data.flamespireClawCounter++,
      durationSeconds: 1,
      sound: '',
      infoText: (data, _matches, output) => output.text!({ num: data.flamespireClawCounter }),
      tts: null,
      outputStrings: {
        text: {
          en: '${num}',
          de: '${num}',
          fr: '${num}',
          ja: '${num}番',
          cn: '${num}',
          ko: '${num}',
        },
      },
    },
    {
      id: 'RubicanteEx Flamespire Claw Hit You',
      type: 'Ability',
      netRegex: { id: '7E73', source: 'Rubicante' },
      condition: (data, matches) => {
        if (data.me !== matches.target)
          return false;
        if (data.flamespireClawCounter >= 7)
          return false;
        return data.flamespireClawCounter === data.flamespireClawNumber;
      },
      infoText: (_data, _matches, output) => output.getTether!(),
      outputStrings: {
        getTether: {
          en: 'Get Tether',
          de: 'Verbindung nehmen',
          ja: '線取りに行く',
        },
      },
    },
    {
      id: 'RubicanteEx Flamespire Brand Cardinals',
      type: 'MapEffect',
      netRegex: { location: '04', capture: true },
      suppressSeconds: 15,
      infoText: (_data, matches, output) => {
        const intercardFlags = [
          '02000200',
          '00200020',
          '00020002',
          '00800080',
        ];
        if (intercardFlags.includes(matches.flags))
          return output.intercards!();
        return output.cardinals!();
      },
      outputStrings: {
        cardinals: {
          en: 'Cardinals',
          de: 'Kardinal',
          ja: '十字回避',
        },
        intercards: {
          en: 'Intercards',
          de: 'Interkardinal',
          ja: '斜めへ',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Partial Immolation/Total Immolation': 'Partial/Total Immolation',
        'Scalding Ring/Scalding Signal': 'Scalding Ring/Signal',
        'Spike of Flame/Fourfold Flame/Twinfold Flame': 'Spike/Twin/Four',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'Circle of Purgatory': 'Kreis der Läuterung',
        '(?<!Greater )Flamesent': 'Flammengesandt(?:e|er|es|en)',
        'Greater Flamesent': 'Infernogesandt(?:e|er|es|en)',
        'Rubicante': 'Rubicante',
        'Rubicante Mirage': 'Phantom-Rubicante',
      },
      'replaceText': {
        '\\(aoe\\)': '(AoE)',
        '\\(spread\\)': '(verteilen)',
        'Arcane Revelation': 'Arkane Enthüllung',
        'Arch Inferno': 'Erzinferno',
        'Blazing Rapture': 'Lodernde Entrückung',
        'Blooming Welt': 'Loderndes Mal',
        'Conflagration': 'Feuersnot',
        'Dualfire': 'Zwieflamme',
        'Explosive Pyre': 'Brausender Scheiterhaufen',
        'Fiery Expiation': 'Feurige Sühne',
        'Flamerake': 'Brennender Nagel',
        'Flamespire Brand': 'Mal des Flammendorns',
        'Flamespire Claw': 'Nagel des Flammendorns',
        'Fourfold Flame': 'Vierfache Flamme',
        'Furious Welt': 'Zehrendes Mal',
        'Ghastly Flame': 'Finstere Flamme',
        'Ghastly Torch': 'Finstere Fackel',
        'Ghastly Wind': 'Finstere Winde',
        'Hope Abandon Ye': 'Lasset alle Hoffnung fahren',
        'Infernal Slaughter': 'Infernales Schlachten',
        '(?<!(Arch |Erz))Inferno(?! Devil)': 'Höllenfahrt',
        'Inferno Devil': 'Höllenteufel',
        'Ordeal of Purgation': 'Probe der Läuterung',
        'Partial Immolation': 'Teilverbrennung',
        'Radial Flagration': 'Schwelender Reigen',
        'Scalding Fleet': 'Äschernder Schwarm',
        'Scalding Ring': 'Äschernder Kreis',
        'Scalding Signal': 'Äscherndes Fanal',
        'Shattering Heat': 'Klirrende Hitze',
        'Spike of Flame': 'Flammenstachel',
        'Stinging Welt': 'Flammenmal',
        'Sweeping Immolation': 'Breite Verbrennung',
        'Total Immolation': 'Totalverbrennung',
        'Twinfold Flame': 'Zweifache Flamme',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Circle of Purgatory': 'cercle arcanique du Purgatoire',
        '(?<!Greater )Flamesent': 'flamme démoniaque',
        'Greater Flamesent': 'flamme démoniaque inexorable',
        'Rubicante': 'Rubicante',
        'Rubicante Mirage': 'spectre de Rubicante',
      },
      'replaceText': {
        'Arcane Revelation': 'Déploiement arcanique',
        'Arch Inferno': 'Enfer tourbillonnant',
        'Blazing Rapture': 'Flammes folles',
        'Blooming Welt': 'Grosse malédiction explosive',
        'Conflagration': 'Jets enflammés',
        'Dualfire': 'Jets enflammés jumeaux',
        'Explosive Pyre': 'Attaque de feu explosive',
        'Fiery Expiation': 'Flamme expiatoire',
        'Flamerake': 'Griffes écarlates',
        'Flamespire Brand': 'Marque de flamme maudite',
        'Flamespire Claw': 'Griffes enflammées maudites',
        'Fourfold Flame': 'Quadruple explosion de feu',
        'Furious Welt': 'Malédiction explosive massive',
        'Ghastly Flame': 'Feu spectral',
        'Ghastly Torch': 'Flamme spectrale',
        'Ghastly Wind': 'Vent enflammé spectral',
        'Hope Abandon Ye': 'Ouverture du Purgatoire',
        'Infernal Slaughter': 'Déchaînement infernal',
        '(?<!Arch )Inferno(?! Devil)': 'Flambée',
        'Inferno Devil': 'Enfer tournoyant',
        'Ordeal of Purgation': 'Purgatoire vermillon',
        'Partial Immolation': 'Vague écarlate dispersée',
        'Radial Flagration': 'Jets enflammés radiaux',
        'Scalding Fleet': 'Calcination terrestre brutale',
        'Scalding Ring': 'Calcination terrestre circulaire',
        'Scalding Signal': 'Calcination terrestre ascendante',
        'Shattering Heat': 'Attaque de feu',
        'Spike of Flame': 'Explosion de feu',
        'Stinging Welt': 'Malédiction explosive',
        'Sweeping Immolation': 'Vague écarlate',
        'Total Immolation': 'Vague écarlate concentrée',
        'Twinfold Flame': 'Double explosion de feu',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Circle of Purgatory': '煉獄魔陣',
        '(?<!Greater )Flamesent': '炎妖',
        'Greater Flamesent': '業炎妖',
        'Rubicante(?! )': 'ルビカンテ',
        'Rubicante Mirage': 'ルビカンテの幻影',
      },
      'replaceText': {
        'Arcane Revelation': '魔法陣展開',
        'Arch Inferno': '烈風火燕流',
        'Blazing Rapture': '狂える炎',
        'Blooming Welt': '大爆呪',
        'Conflagration': '劫火流',
        'Dualfire': '双炎流',
        'Explosive Pyre': '爆炎撃',
        'Fiery Expiation': '獄炎',
        'Flamerake': '烈火赤滅爪',
        'Flamespire Brand': '炎禍の呪い',
        'Flamespire Claw': '炎禍の武爪',
        'Fourfold Flame': '四重爆炎',
        'Furious Welt': '重爆呪',
        'Ghastly Flame': '妖火',
        'Ghastly Torch': '妖火炎',
        'Ghastly Wind': '妖火風',
        'Hope Abandon Ye': '煉獄招来',
        'Infernal Slaughter': '火燕乱撃',
        '(?<!Arch )Inferno(?! Devil)': '火燕流',
        'Inferno Devil': '火燕旋風',
        'Ordeal of Purgation': '煉獄の朱炎',
        'Partial Immolation': '赤滅熱波：散炎',
        'Radial Flagration': '放散火流',
        'Scalding Fleet': '滅土焼尽：迅火',
        'Scalding Ring': '滅土焼尽：輪火',
        'Scalding Signal': '滅土焼尽：烽火',
        'Shattering Heat': '炎撃',
        'Spike of Flame': '爆炎',
        'Stinging Welt': '爆呪',
        'Sweeping Immolation': '赤滅熱波',
        'Total Immolation': '赤滅熱波：重炎',
        'Twinfold Flame': '二重爆炎',
      },
    },
  ],
};

export default triggerSet;
