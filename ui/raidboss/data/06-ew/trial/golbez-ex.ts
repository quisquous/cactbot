import { UnreachableCode } from '../../../../../resources/not_reached';
import Outputs from '../../../../../resources/outputs';
import { callOverlayHandler } from '../../../../../resources/overlay_plugin_api';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { PluginCombatantState } from '../../../../../types/event';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  terrastormCount: number;
  terrastormCombatantDirs: number[];
}

// Calculate combatant position in an all 8 cards/intercards
const matchedPositionTo8Dir = (combatant: PluginCombatantState) => {
  // Positions are moved up 100 and right 100
  const y = combatant.PosY - 100;
  const x = combatant.PosX - 100;

  // Majority of mechanics center around three circles:
  // NW at 0, NE at 2, South at 5
  // Map NW = 0, N = 1, ..., W = 7

  return Math.round(5 - 4 * Math.atan2(x, y) / Math.PI) % 8;
};

const triggerSet: TriggerSet<Data> = {
  id: 'TheVoidcastDaisExtreme',
  zoneId: ZoneId.TheVoidcastDaisExtreme,
  timelineFile: 'golbez-ex.txt',
  initData: () => {
    return {
      terrastormCount: 0,
      terrastormCombatantDirs: [],
    };
  },
  triggers: [
    {
      id: 'GolbezEx Terrastorm',
      type: 'StartsUsing',
      netRegex: { id: '8466', source: 'Golbez', capture: true },
      delaySeconds: 0.5,
      promise: async (data, matches) => {
        const meteorData = await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.sourceId, 16)],
        });

        if (meteorData === null) {
          console.error(`Terrastorm: null data`);
          return;
        }
        if (meteorData.combatants.length !== 1) {
          console.error(`Terrastorm: expected 1, got ${meteorData.combatants.length}`);
          return;
        }

        const meteor = meteorData.combatants[0];
        if (!meteor)
          throw new UnreachableCode();
        data.terrastormCombatantDirs.push(matchedPositionTo8Dir(meteor));
      },
      alertText: (data, _matches, output) => {
        const wanted = data.terrastormCount === 0 ? 2 : 3;
        if (data.terrastormCombatantDirs.length < wanted)
          return;

        const meteors = data.terrastormCombatantDirs;

        data.terrastormCombatantDirs = [];
        ++data.terrastormCount;

        const dirs: { [dir: number]: string } = {
          0: 'nw',
          2: 'ne',
          4: 'se',
          6: 'sw',
        };

        for (const meteor of meteors) {
          delete dirs[meteor];
        }

        const dirOutputs: string[] = [];

        for (const dir of Object.values(dirs)) {
          dirOutputs.push(output[dir]!());
        }

        return dirOutputs.join('/');
      },
      outputStrings: {
        nw: Outputs.dirNW,
        ne: Outputs.dirNE,
        sw: Outputs.dirSW,
        se: Outputs.dirSE,
      },
    },
    {
      id: 'GolbezEx Lingering Spark Bait',
      type: 'StartsUsing',
      netRegex: { id: '8468', source: 'Golbez', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Bait Circles',
          de: 'Kreise ködern',
          fr: 'Déposez les cercles',
          ja: 'ゆか誘導',
          cn: '集合放圈',
          ko: '장판 유도',
        },
      },
    },
    {
      id: 'GolbezEx Lingering Spark Move',
      type: 'StartsUsing',
      netRegex: { id: '846A', source: 'Golbez', capture: false },
      suppressSeconds: 3,
      response: Responses.moveAway(),
    },
    {
      id: 'GolbezEx Phases of the Blade',
      type: 'StartsUsing',
      netRegex: { id: '86DB', source: 'Golbez', capture: false },
      response: Responses.getBackThenFront(),
    },
    {
      id: 'GolbezEx Binding Cold',
      type: 'StartsUsing',
      netRegex: { id: '84B3', source: 'Golbez', capture: false },
      response: Responses.bleedAoe(),
    },
    {
      id: 'GolbezEx Void Meteor',
      type: 'StartsUsing',
      netRegex: { id: '84AD', source: 'Golbez', capture: true },
      response: Responses.tankBuster(),
    },
    {
      id: 'GolbezEx Black Fang',
      type: 'StartsUsing',
      netRegex: { id: '8471', source: 'Golbez', capture: false },
      response: Responses.bigAoe(),
    },
    {
      id: 'GolbezEx Abyssal Quasar',
      type: 'StartsUsing',
      netRegex: { id: '84AB', source: 'Golbez', capture: false },
      alertText: (_data, _matches, output) => output.partnerStack!(),
      outputStrings: {
        partnerStack: {
          en: 'Partner Stack',
          de: 'Mit Partner sammeln',
          fr: 'Package partenaire',
          ja: 'ペア',
          cn: '2 人分摊',
          ko: '2인 쉐어',
        },
      },
    },
    {
      id: 'GolbezEx Eventide Triad',
      type: 'StartsUsing',
      netRegex: { id: '8480', source: 'Golbez', capture: false },
      alertText: (_data, _matches, output) => output.rolePositions!(),
      outputStrings: {
        rolePositions: {
          en: 'Role positions',
          de: 'Rollenposition',
          fr: 'Positions par rôle',
          ja: 'ロール特定位置へ',
          cn: '去指定位置',
          ko: '직업군별 위치로',
        },
      },
    },
    {
      id: 'GolbezEx Eventide Fall',
      type: 'StartsUsing',
      netRegex: { id: '8485', source: 'Golbez', capture: false },
      alertText: (_data, _matches, output) => output.healerGroups!(),
      outputStrings: {
        healerGroups: Outputs.healerGroups,
      },
    },
    {
      id: 'GolbezEx Void Tornado',
      type: 'StartsUsing',
      netRegex: { id: '845D', source: 'Golbez', capture: false },
      alertText: (_data, _matches, output) => output.healerGroups!(),
      outputStrings: {
        healerGroups: Outputs.healerGroups,
      },
    },
    {
      id: 'GolbezEx Void Aero III',
      type: 'StartsUsing',
      netRegex: { id: '845C', source: 'Golbez', capture: false },
      alertText: (_data, _matches, output) => output.partnerStack!(),
      outputStrings: {
        partnerStack: {
          en: 'Partner Stack',
          de: 'Mit Partner sammeln',
          fr: 'Package partenaire',
          ja: 'ペア',
          cn: '2 人分摊',
          ko: '2인 쉐어',
        },
      },
    },
    {
      id: 'GolbezEx Void Blizzard III',
      type: 'StartsUsing',
      netRegex: { id: '8462', source: 'Golbez', capture: false },
      alertText: (_data, _matches, output) => output.healerGroups!(),
      outputStrings: {
        healerGroups: Outputs.healerGroups,
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Eventide Fall/Eventide Triad': 'Eventide Fall/Triad',
        'Void Aero III/Void Tornado': 'Void Aero III/Tornado',
        'Void Tornado/Void Aero III': 'Void Tornado/Aero III',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'Gale Sphere': 'Windsphäre',
        'Golbez': 'Golbez',
        'Shadow Dragon': 'Schattendrache',
      },
      'replaceText': {
        '\\(Enrage\\)': '(Finalangriff)',
        '\\(big\\)': '(Groß)',
        '\\(small\\)': '(Klein)',
        '\\(light parties\\)': '(Leichter Trupp)',
        '\\(spread\\)': '(Verteilen)',
        '\\(explode\\)': '(Explodieren)',
        '\\(snapshot\\)': '(Speichern)',
        '\\(back\\)': '(Hinten)',
        '\\(cast\\)': '(Aktivierung)',
        '\\(front\\)': '(Vorne)',
        '\\(out\\)': '(Raus)',
        '\\(record\\)': '(Merken)',
        '\\(under\\)': '(Unter)',
        '\\(hit\\)': '(Treffer)',
        '\\(preview\\)': '(Vorschau)',
        'Abyssal Quasar': 'Abyssus-Nova',
        'Arctic Assault': 'Frostschuss',
        'Azdaja\'s Shadow': 'Azdajas Schatten',
        'Binding Cold': 'Eisfessel',
        'Black Fang': 'Schwarze Fänge',
        'Cauterize': 'Kauterisieren',
        'Double Meteor': 'Doppel-Meteo',
        'Dragon\'s Descent': 'Fallender Drache',
        'Eventide Fall': 'Gebündelte Abendglut',
        'Eventide Triad': 'Dreifache Abendglut',
        'Explosion': 'Explosion',
        'Flames of Eventide': 'Flammen des Abendrots',
        'Gale Sphere': 'Windsphäre',
        'Immolating Shade': 'Äschernder Schatten',
        'Lingering Spark': 'Lauernder Funke',
        'Phases of the Blade': 'Sichelsturm',
        'Phases of the Shadow': 'Schwarzer Sichelsturm',
        'Rising Beacon': 'Hohes Fanal',
        'Rising Ring': 'Hoher Zirkel',
        'Terrastorm': 'Irdene Breitseite',
        'Void Aero III': 'Nichts-Windga',
        'Void Blizzard III': 'Nichts-Eisga',
        'Void Comet': 'Nichts-Komet',
        'Void Meteor': 'Nichts-Meteo',
        'Void Stardust': 'Nichts-Sternenstaub',
        'Void Tornado': 'Nichtstornado',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Gale Sphere': 'Sphères de vent ténébreux',
        'Golbez': 'Golbez',
        'Shadow Dragon': 'dragonne obscure',
      },
      'replaceText': {
        'Abyssal Quasar': 'Quasar abyssal',
        'Arctic Assault': 'Assaut arctique',
        'Azdaja\'s Shadow': 'Ombre d\'Azdaja',
        'Binding Cold': 'Geôle glaciale',
        'Black Fang': 'Croc obscur',
        'Cauterize': 'Cautérisation',
        'Double Meteor': 'Météore double',
        'Dragon\'s Descent': 'Descente draconique',
        'Eventide Fall': 'Éclat crépusculaire concentré',
        'Eventide Triad': 'Triple éclat crépusculaire',
        'Explosion': 'Explosion',
        'Flames of Eventide': 'Flammes du crépuscule',
        'Gale Sphere': 'Sphères de vent ténébreux',
        'Immolating Shade': 'Ombre incandescente',
        'Lingering Spark': 'Étincelle persistante',
        'Phases of the Blade': 'Taillade demi-lune',
        'Phases of the Shadow': 'Taillade demi-lune obscure',
        'Rising Beacon': 'Flambeau ascendant',
        'Rising Ring': 'Anneau ascendant',
        'Terrastorm': 'Aérolithe flottant',
        'Void Aero III': 'Méga Vent du néant',
        'Void Blizzard III': 'Méga Glace du néant',
        'Void Comet': 'Comète du néant',
        'Void Meteor': 'Météore du néant',
        'Void Stardust': 'Pluie de comètes du néant',
        'Void Tornado': 'Tornade du néant',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Gale Sphere': 'ウィンドスフィア',
        'Golbez': 'ゴルベーザ',
        'Shadow Dragon': '黒竜',
      },
      'replaceText': {
        'Abyssal Quasar': 'アビスクエーサー',
        'Arctic Assault': 'コールドブラスト',
        'Azdaja\'s Shadow': '黒竜剣アジュダヤ',
        'Binding Cold': '呪縛の冷気',
        'Black Fang': '黒い牙',
        'Cauterize': 'カータライズ',
        'Double Meteor': 'ダブルメテオ',
        'Dragon\'s Descent': '降竜爆火',
        'Eventide Fall': '集束黒竜閃',
        'Eventide Triad': '三連黒竜閃',
        'Explosion': '爆発',
        'Flames of Eventide': '黒竜炎',
        'Gale Sphere': 'ウィンドスフィア',
        'Immolating Shade': '重黒炎',
        'Lingering Spark': 'ディレイスパーク',
        'Phases of the Blade': '弦月連剣',
        'Phases of the Shadow': '弦月黒竜連剣',
        'Rising Beacon': '昇竜烽火',
        'Rising Ring': '昇竜輪火',
        'Terrastorm': 'ディレイアース',
        'Void Aero III': 'ヴォイド・エアロガ',
        'Void Blizzard III': 'ヴォイド・ブリザガ',
        'Void Comet': 'ヴォイド・コメット',
        'Void Meteor': 'ヴォイド・メテオ',
        'Void Stardust': 'ヴォイド・コメットレイン',
        'Void Tornado': 'ヴォイド・トルネド',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Gale Sphere': '风球',
        'Golbez': '高贝扎',
        'Shadow Dragon': '黑龙',
      },
      'replaceText': {
        '\\(Enrage\\)': '(狂暴)',
        '\\(big\\)': '(大)',
        '\\(small\\)': '(小)',
        '\\(light parties\\)': '(四四分组)',
        '\\(spread\\)': '(分散)',
        '\\(explode\\)': '(爆炸)',
        '\\(snapshot\\)': '(快照)',
        '\\(back\\)': '(后)',
        '\\(cast\\)': '(咏唱)',
        '\\(front\\)': '(前)',
        '\\(out\\)': '(外)',
        '\\(record\\)': '(记录)',
        '\\(under\\)': '(下方)',
        '\\(hit\\)': '(打击)',
        '\\(preview\\)': '(预览)',
        'Abyssal Quasar': '深渊类星体',
        'Arctic Assault': '极寒突袭',
        'Azdaja\'s Shadow': '黑龙剑阿珠达雅',
        'Binding Cold': '咒缚寒气',
        'Black Fang': '黑牙',
        'Cauterize': '黑炎俯冲',
        'Double Meteor': '双重陨石',
        'Dragon\'s Descent': '降龙爆火',
        'Eventide Fall': '集束黑龙闪',
        'Eventide Triad': '三连黑龙闪',
        'Explosion': '爆炸',
        'Flames of Eventide': '黑龙炎',
        'Gale Sphere': '风晶球',
        'Immolating Shade': '重黑炎',
        'Lingering Spark': '迟缓电火花',
        'Phases of the Blade': '弦月连剑',
        'Phases of the Shadow': '弦月黑龙连剑',
        'Rising Beacon': '升龙烽火',
        'Rising Ring': '升龙环火',
        'Terrastorm': '迟缓地暴',
        'Void Aero III': '虚空暴风',
        'Void Blizzard III': '虚空冰封',
        'Void Comet': '虚空彗星',
        'Void Meteor': '虚空陨石',
        'Void Stardust': '虚空彗星雨',
        'Void Tornado': '虚空龙卷',
      },
    },
  ],
};

export default triggerSet;
