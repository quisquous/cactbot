import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { UnreachableCode } from '../../../../../resources/not_reached';
import Outputs from '../../../../../resources/outputs';
import { callOverlayHandler } from '../../../../../resources/overlay_plugin_api';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { PluginCombatantState } from '../../../../../types/event';
import { NetMatches } from '../../../../../types/net_matches';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: Cthonic Vent is tricky; the initial cast is ~5s, but the next two explosions are ~2s.
//       There's no map events.  There's two Suneater adds that are added immediately before
//       the first 78F5 cast, and these same two combatants are used for the next two circles.
//       It seems like these adds that are doing damage are moved only at the last second.
//       It's possible there's some other hidden combatants moving around, or this is
//       just a case of missing some animation data in network logs that would tell us.
// TODO: how to detect/what to say for Blazing Footfalls knockbacks?

export interface Data extends RaidbossData {
  combatantData: PluginCombatantState[];
  ventIds: string[];
  torches: NetMatches['StartsUsing'][];
}

// TODO: how to detect/what to say for Blazing Footfalls knockbacks?

const centerX = 100;
const centerY = 100;

const positionTo8Dir = (combatant: PluginCombatantState) => {
  const x = combatant.PosX - centerX;
  const y = combatant.PosY - centerY;

  // Dirs: N = 0, NE = 1, ..., NW = 7
  return Math.round(4 - 4 * Math.atan2(x, y) / Math.PI) % 8;
};

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.AbyssosTheEighthCircle,
  timelineFile: 'p8n.txt',
  initData: () => {
    return {
      combatantData: [],
      ventIds: [],
      torches: [],
    };
  },
  triggers: [
    {
      id: 'P8N Genesis of Flame',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7905', source: 'Hephaistos', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'P8N Scorching Fang',
      type: 'StartsUsing',
      // has 78EC Sunforge castbar
      netRegex: NetRegexes.startsUsing({ id: '78EE', source: 'Hephaistos', capture: false }),
      response: Responses.goSides(),
    },
    {
      id: 'P8N Sun\'s Pinion',
      type: 'StartsUsing',
      // also has 78EC Sunforge castbar
      netRegex: NetRegexes.startsUsing({ id: '78EF', source: 'Hephaistos', capture: false }),
      // There are two casts, one for each side.
      suppressSeconds: 1,
      response: Responses.goMiddle(),
    },
    {
      id: 'P8N Flameviper',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7908', source: 'Hephaistos' }),
      // This is a "line" tank cleave that leaves a bleed.
      response: Responses.tankCleave(),
    },
    {
      id: 'P8N Petrifaction',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '78FC', source: 'Gorgon', capture: false }),
      // There are two casts, one for each Gorgon.
      suppressSeconds: 1,
      response: Responses.lookAway(),
    },
    {
      id: 'P8N Gorgon Add',
      type: 'Ability',
      // We could use addedCombatant({ npcNameId: '11517' }), but this also fires on the
      // spawn of the lookaway eyeballs.
      netRegex: NetRegexes.ability({ id: '78FC', source: 'Gorgon', capture: false }),
      suppressSeconds: 1,
      response: Responses.killAdds(),
    },
    {
      id: 'P8N Ektothermos',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '78FE', source: 'Hephaistos', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'P8N Abyssal Fires',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '78F1', source: 'Hephaistos', capture: false }),
      // There are four of these, one for each fire.
      suppressSeconds: 1,
      response: Responses.goMiddle(),
    },
    {
      id: 'P8N Rearing Rampage',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '79AB', source: 'Hephaistos', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'P8N Suneater Cthonic Vent Add',
      type: 'AddedCombatant',
      netRegex: NetRegexes.addedCombatantFull({ npcNameId: '11404' }),
      run: (data, matches) => data.ventIds.push(matches.id),
    },
    {
      id: 'P8N Suneater Cthonic Vent Initial',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '78F5', source: 'Suneater', capture: false }),
      suppressSeconds: 1,
      promise: async (data: Data) => {
        data.combatantData = [];
        if (data.ventIds.length !== 2)
          return;

        const ids = data.ventIds.map((id) => parseInt(id, 16));
        data.combatantData = (await callOverlayHandler({
          call: 'getCombatants',
          ids: ids,
        })).combatants;
      },
      alertText: (data, _matches, output) => {
        if (data.combatantData.length === 0)
          return;

        const unsafeSpots = data.combatantData.map((c) => positionTo8Dir(c)).sort();

        const [unsafe0, unsafe1] = unsafeSpots;
        if (unsafe0 === undefined || unsafe1 === undefined)
          throw new UnreachableCode();

        // edge case wraparound
        if (unsafe0 === 1 && unsafe1 === 7)
          return output.south!();

        // adjacent unsafe spots, cardinal is safe
        if (unsafe1 - unsafe0 === 2) {
          // this average is safe to do because wraparound was taken care of above.
          const unsafeCard = Math.floor((unsafe0 + unsafe1) / 2);

          const safeDirMap: { [dir: number]: string } = {
            0: output.south!(), // this won't happen, but here for completeness
            2: output.west!(),
            4: output.north!(),
            6: output.east!(),
          } as const;
          return safeDirMap[unsafeCard] ?? output.unknown!();
        }

        // two intercards are safe, they are opposite each other,
        // so we can pick the intercard counterclock of each unsafe spot.
        // e.g. 1/5 are unsafe (NE and SW), so SE and NW are safe.
        const safeIntercardMap: { [dir: number]: string } = {
          1: output.dirNW!(),
          3: output.dirNE!(),
          5: output.dirSE!(),
          7: output.dirSW!(),
        } as const;

        const safeStr0 = safeIntercardMap[unsafe0] ?? output.unknown!();
        const safeStr1 = safeIntercardMap[unsafe1] ?? output.unknown!();
        return output.comboDir!({ dir1: safeStr0, dir2: safeStr1 });
      },
      outputStrings: {
        comboDir: {
          en: '${dir1} / ${dir2}',
          de: '${dir1} / ${dir2}',
          ja: '${dir1} / ${dir2}',
          ko: '${dir1} / ${dir2}',
        },
        north: Outputs.north,
        east: Outputs.east,
        south: Outputs.south,
        west: Outputs.west,
        dirNE: Outputs.dirNE,
        dirSE: Outputs.dirSE,
        dirSW: Outputs.dirSW,
        dirNW: Outputs.dirNW,
        unknown: Outputs.unknown,
      },
    },
    {
      id: 'P8N Volcanic Torches Cleanup',
      type: 'StartsUsing',
      // This always precedes 78F8 Torch Flame casts.
      netRegex: NetRegexes.startsUsing({
        id: ['78F7', '71DE'],
        source: 'Hephaistos',
        capture: false,
      }),
      run: (data) => data.torches = [],
    },
    {
      id: 'P8N Torch Flame Collect',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '78F8', source: 'Hephaistos' }),
      run: (data, matches) => data.torches.push(matches),
    },
    {
      id: 'P8N Torch Flame',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '78F8', source: 'Hephaistos', capture: false }),
      delaySeconds: 0.5,
      suppressSeconds: 1,
      promise: async (data: Data) => {
        data.combatantData = [];

        const ids = data.torches.map((torch) => parseInt(torch.sourceId, 16));
        data.combatantData = (await callOverlayHandler({
          call: 'getCombatants',
          ids: ids,
        })).combatants;
      },
      alertText: (data, _matches, output) => {
        if (data.combatantData.length === 0)
          return;

        const safe = {
          outsideNorth: true,
          insideNorth: true,
          outsideEast: true,
          insideEast: true,
          outsideSouth: true,
          insideSouth: true,
          outsideWest: true,
          insideWest: true,
        };

        // Loop through all torches, remove any rows/columns it intersects with
        // to find safe lanes.
        for (const torch of data.combatantData) {
          // x, y = 85, 95, 105, 115
          // map to ([0, 3], [0, 3])
          const x = Math.floor((torch.PosX - 85) / 10);
          const y = Math.floor((torch.PosY - 85) / 10);

          const xMap: { [tile: number]: keyof typeof safe } = {
            0: 'outsideWest',
            1: 'insideWest',
            2: 'insideEast',
            3: 'outsideEast',
          } as const;
          const xKey = xMap[x];
          if (xKey === undefined)
            return;
          delete safe[xKey];

          const yMap: { [tile: number]: keyof typeof safe } = {
            0: 'outsideNorth',
            1: 'insideNorth',
            2: 'insideSouth',
            3: 'outsideSouth',
          } as const;
          const yKey = yMap[y];
          if (yKey === undefined)
            return;
          delete safe[yKey];
        }

        const [safe0, safe1, safe2] = Object.keys(safe);

        // Unexpectedly zero safe zones.
        if (safe0 === undefined)
          return;
        // Not set up to handle more than two safe zones.
        if (safe2 !== undefined)
          return;
        if (safe1 === undefined)
          return output[safe0]!();

        const dir1 = output[safe0]!();
        const dir2 = output[safe1]!();
        return output.combo!({ dir1: dir1, dir2: dir2 });
      },
      outputStrings: {
        combo: {
          en: '${dir1} / ${dir2}',
          de: '${dir1} / ${dir2}',
          ja: '${dir1} / ${dir2}',
          ko: '${dir1} / ${dir2}',
        },
        outsideNorth: {
          en: 'Outside North',
          de: 'Im Norden raus',
          fr: 'Nord Extérieur',
          ja: '北の外側',
          ko: '북쪽 바깥',
        },
        insideNorth: {
          en: 'Inside North',
          de: 'Im Norden rein',
          fr: 'Nord Intérieur',
          ja: '北の内側',
          ko: '북쪽 안',
        },
        outsideEast: {
          en: 'Outside East',
          de: 'Im Osten raus',
          fr: 'Est Extérieur',
          ja: '東の外側',
          ko: '동쪽 바깥',
        },
        insideEast: {
          en: 'Inside East',
          de: 'Im Osten rein',
          fr: 'Est Intérieur',
          ja: '東の内側',
          ko: '동쪽 안',
        },
        outsideSouth: {
          en: 'Outside South',
          de: 'Im Süden raus',
          fr: 'Sud Extérieur',
          ja: '南の外側',
          ko: '남쪽 바깥',
        },
        insideSouth: {
          en: 'Inside South',
          de: 'Im Süden rein',
          fr: 'Sud Intérieur',
          ja: '南の内側',
          ko: '남쪽 안',
        },
        outsideWest: {
          en: 'Outside West',
          de: 'Im Westen raus',
          fr: 'Ouest Extérieur',
          ja: '西の外側',
          ko: '서쪽 바깥',
        },
        insideWest: {
          en: 'Inside West',
          de: 'Im Westen rein',
          fr: 'Ouest Intérieur',
          ja: '西の内側',
          ko: '서쪽 안',
        },
      },
    },
    {
      id: 'P8N Hemitheos\'s Flare',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7907', source: 'Hephaistos' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'missingTranslations': true,
      'replaceSync': {
        'Gorgon': 'Gorgone',
        '(?<!Illusory )Hephaistos': 'Hephaistos',
        'Illusory Hephaistos': 'Hephaistos-Phantom',
        'Suneater': 'Schlund des Phoinix',
      },
      'replaceText': {
        'Abyssal Fires': 'Feuersturm',
        'Blazing Footfalls': 'Fackelnde Füße',
        'Cthonic Vent': 'Lodernde Schlange',
        'Ektothermos': 'Ektothermos',
        'Flameviper': 'Flammenviper',
        'Fourfold Fires': 'Vierfacher Feuersturm',
        'Genesis of Flame': 'Flammende Genesis',
        'Gorgospit': 'Gorgons Speichel',
        'Hemitheos\'s Flare': 'Hemitheos-Flare',
        'Into the Shadows': 'In die Schatten',
        'Petrifaction': 'Versteinerung',
        'Quadrupedal Crush': 'Fußmalmer',
        'Quadrupedal Impact': 'Fußstampfer',
        'Rearing Rampage': 'Gleißender Amok',
        'Reforged Reflection': 'Mutierte Schöpfung',
        'Scorching Fang': 'Flammender Zahn',
        'Sun\'s Pinion': 'Versengte Schwinge',
        'Sunforge': 'Flammenreigen der Schöpfung',
        'Torch Flame': 'Glutfeuer',
        'Trailblaze': 'Flammender Pfad',
        'Volcanic Torches': 'Vulkanfackel',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Gorgon': 'gorgone',
        '(?<!Illusory )Hephaistos': 'Héphaïstos',
        'Illusory Hephaistos': 'spectre d\'Héphaïstos',
        'Suneater': 'serpent en flammes',
      },
      'replaceText': {
        'Abyssal Fires': 'Tempête enflammée',
        'Blazing Footfalls': 'Pas ardents',
        'Cthonic Vent': 'Serpents de flammes ascendants',
        'Ektothermos': 'Vague d\'énergie explosive',
        'Flameviper': 'Serpent-canon',
        'Fourfold Fires': 'Quadruple tempête enflammée',
        'Genesis of Flame': 'Flammes de la création',
        'Gorgospit': 'Crachat de gorgone',
        'Hemitheos\'s Flare': 'Brasier d\'hémithéos',
        'Into the Shadows': 'Dans l\'ombre',
        'Petrifaction': 'Pétrification',
        'Quadrupedal Crush': 'Écrasement quadrupède',
        'Quadrupedal Impact': 'Impact quadrupède',
        'Rearing Rampage': 'Cabrage ravageur',
        'Reforged Reflection': 'Mutation corporelle',
        'Scorching Fang': 'Crocs embrasants',
        'Sun\'s Pinion': 'Aile embrasante',
        'Sunforge': 'Bête enflammée',
        'Torch Flame': 'Explosion de braises',
        'Trailblaze': 'Traînée ardente',
        'Volcanic Torches': 'Boutefeux magiques',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Gorgon': 'ゴルゴン',
        '(?<!Illusory )Hephaistos': 'ヘファイストス',
        'Illusory Hephaistos': 'ヘファイストスの幻影',
        'Suneater': '炎霊蛇',
      },
      'replaceText': {
        'Abyssal Fires': '炎嵐',
        'Blazing Footfalls': 'ブレイジングフィート',
        'Cthonic Vent': '噴炎昇蛇',
        'Ektothermos': '爆炎波動',
        'Flameviper': '炎蛇砲',
        'Fourfold Fires': '四重炎嵐',
        'Genesis of Flame': '創世の真炎',
        'Gorgospit': 'ゴルゴンスピット',
        'Hemitheos\'s Flare': 'ヘーミテオス・フレア',
        'Into the Shadows': 'イントゥシャドウ',
        'Petrifaction': 'ペトリファクション',
        'Quadrupedal Crush': 'フィートクラッシュ',
        'Quadrupedal Impact': 'フィートインパクト',
        'Rearing Rampage': 'リアリングランページ',
        'Reforged Reflection': '変異創身',
        'Scorching Fang': '炎の牙',
        'Sun\'s Pinion': '炎の翼',
        'Sunforge': '創獣炎舞',
        'Torch Flame': '熾炎',
        'Trailblaze': 'トレイルブレイズ',
        'Volcanic Torches': '熾炎創火',
      },
    },
  ],
};

export default triggerSet;
