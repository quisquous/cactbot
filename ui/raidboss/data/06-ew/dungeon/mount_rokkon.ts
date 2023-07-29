import Conditions from '../../../../../resources/conditions';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { NetMatches } from '../../../../../types/net_matches';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: find network lines for Yozakura Seal of Riotous Bloom arrows (nothing in network logs)
// TODO: find network lines for Enenra Out of the Smoke (nothing in network logs)
// TODO: Yozakura Seasons of the Fleeting
//       you would need to track 8384 (pinwheel) and 8383 (line) *abilities* (not incorrect casts)
//       and use their positions and rotations to know whether to say front/back/card/intercard
//       she repositions beforehand, so front/back of her is a known safe position.
// TODO: Moko safe spots for Iron Rain
// TODO: Gorai path 06 Humble Hammer safe spots for which Ball of Levin hit by Humble Hammer

const sealMap = {
  '837A': 'fire',
  '837B': 'wind',
  '837C': 'thunder',
  '837D': 'rain',
} as const;

type Seal = typeof sealMap[keyof typeof sealMap];

const sealDamageMap: { [id: string]: Seal } = {
  '8375': 'fire',
  '8376': 'wind',
  '8377': 'rain',
  '8378': 'thunder',
} as const;

const sealIds = Object.keys(sealMap);
const sealDamageIds = Object.keys(sealDamageMap);

const mokoVfxMap = {
  '248': 'back',
  '249': 'left',
  '24A': 'front',
  '24B': 'right',
} as const;

type KasumiGiri = typeof mokoVfxMap[keyof typeof mokoVfxMap];

export interface Data extends RaidbossData {
  yozakuraSeal: Seal[];
  yozakuraTatami: string[];
  isDoubleKasumiGiri?: boolean;
  firstKasumiGiri?: KasumiGiri;
  goraiSummon?: NetMatches['StartsUsing'];
  enenraPipeCleanerCollect: string[];
}

const triggerSet: TriggerSet<Data> = {
  id: 'MountRokkon',
  zoneId: ZoneId.MountRokkon,
  timelineFile: 'mount_rokkon.txt',
  initData: () => {
    return {
      yozakuraSeal: [],
      yozakuraTatami: [],
      enenraPipeCleanerCollect: [],
    };
  },
  triggers: [
    // --------- Yozakura the Fleeting ----------
    {
      id: 'Rokkon Yozakura Glory Neverlasting',
      type: 'StartsUsing',
      netRegex: { id: '83A9', source: 'Yozakura the Fleeting' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Rokkon Yozakura Art of the Windblossom',
      type: 'StartsUsing',
      netRegex: { id: '8369', source: 'Yozakura the Fleeting', capture: false },
      response: Responses.getIn('info'),
    },
    {
      id: 'Rokkon Yozakura Art of the Fireblossom',
      type: 'StartsUsing',
      netRegex: { id: '8368', source: 'Yozakura the Fleeting', capture: false },
      response: Responses.getOut('info'),
    },
    {
      id: 'Rokkon Yozakura Shadowflight',
      type: 'StartsUsing',
      netRegex: { id: '8380', source: 'Mirrored Yozakura', capture: false },
      response: Responses.moveAway(),
    },
    {
      id: 'Rokkon Yozakura Kuge Rantsui',
      type: 'StartsUsing',
      netRegex: { id: '83AA', source: 'Yozakura the Fleeting', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Rokkon Yozakura Drifting Petals',
      type: 'StartsUsing',
      netRegex: { id: '86F0', source: 'Yozakura the Fleeting', capture: false },
      alertText: (_data, _matches, output) => output.knockback!(),
      outputStrings: {
        knockback: {
          en: 'Unavoidable Knockback',
          de: 'Unvermeidbarer Rückstoß',
          fr: 'Poussée inévitable',
          ja: '避けないノックバック',
          cn: '击退 (防击退无效)',
          ko: '넉백 방지 불가',
        },
      },
    },
    {
      id: 'Rokkon Yozakura Seal Collect',
      type: 'Ability',
      netRegex: { id: sealIds, source: 'Yozakura the Fleeting' },
      run: (data, matches) => {
        // Collect flowers as they appear.
        // TODO: there are no network lines for which ones are active.
        // So we do the best we can, which is:
        // * show an alert for the first set (with only two)
        // * show nothing on the first pair of further sets (this is probably confusing to players)
        // * by process of elimination show the second pair on further sets
        const looseSealMap: { [id: string]: Seal } = sealMap;
        const seal = looseSealMap[matches.id];
        if (seal !== undefined)
          data.yozakuraSeal.push(seal);
      },
    },
    {
      id: 'Rokkon Yozakura Seal of Riotous Bloom',
      type: 'StartsUsing',
      netRegex: { id: '8374', source: 'Yozakura the Fleeting', capture: false },
      alertText: (data, _matches, output) => {
        // If we know what this is, show something. Otherwise, sorry.
        if (data.yozakuraSeal.length !== 2)
          return;
        const isIn = data.yozakuraSeal.includes('wind');
        const isCardinals = data.yozakuraSeal.includes('rain');
        if (isIn && isCardinals)
          return output.inAndCards!();
        if (isIn && !isCardinals)
          return output.inAndIntercards!();
        if (!isIn && isCardinals)
          return output.outAndCards!();
        if (!isIn && !isCardinals)
          return output.outAndIntercards!();
      },
      outputStrings: {
        inAndCards: {
          en: 'In + Cardinals',
          de: 'Rein + Kardinal',
          ko: '안 + 십자방향',
        },
        outAndCards: {
          en: 'Out + Cardinals',
          de: 'Raus + Kardinal',
          ko: '밖 + 십자방향',
        },
        inAndIntercards: {
          en: 'In + Intercards',
          de: 'Rein + Interkardinal',
          ko: '안 + 대각선',
        },
        outAndIntercards: {
          en: 'Out + Intercards',
          de: 'Raus + Interkardinal',
          ko: '밖 + 대각선',
        },
      },
    },
    {
      id: 'Rokkon Yozakura Seal Damage Collect',
      type: 'StartsUsing',
      netRegex: { id: sealDamageIds, source: 'Yozakura the Fleeting' },
      run: (data, matches) => {
        // Remove abilities that have happened so we can know the second pair.
        const seal = sealDamageMap[matches.id];
        data.yozakuraSeal = data.yozakuraSeal.filter((x) => x !== seal);
      },
    },
    {
      id: 'Rokkon Yozakura Art of the Fluff',
      type: 'StartsUsing',
      netRegex: { id: '839E', source: 'Shiromaru' },
      alertText: (_data, matches, output) => {
        const xPos = parseFloat(matches.x);
        // center = 737
        // east = 765
        // west = 709
        if (xPos > 737)
          return output.lookWest!();
        return output.lookEast!();
      },
      outputStrings: {
        lookWest: {
          en: 'Look West',
        },
        lookEast: {
          en: 'Look East',
        },
      },
    },
    {
      id: 'Rokkon Yozakura Tatami Collect',
      type: 'MapEffect',
      // 00020001 = shake
      // 00080004 = go back to normal
      // 80038CA2 = flip
      netRegex: { flags: '00020001' },
      run: (data, matches) => data.yozakuraTatami.push(matches.location),
    },
    {
      id: 'Rokkon Yozakura Tatami-gaeshi',
      type: 'StartsUsing',
      netRegex: { id: '8395', source: 'Yozakura the Fleeting', capture: false },
      alertText: (data, _matches, output) => {
        const map: { [location: string]: string } = {
          '37': 'outsideNorth',
          '38': 'insideNorth',
          '39': 'insideSouth',
          '3A': 'outsideSouth',
        };

        for (const location of data.yozakuraTatami)
          delete map[location];

        // Call inside before outside.
        const callOrder = ['38', '39', '37', '3A'];

        for (const key of callOrder) {
          const outputKey = map[key];
          if (outputKey !== undefined)
            return output[outputKey]!();
        }
      },
      run: (data) => data.yozakuraTatami = [],
      outputStrings: {
        outsideNorth: {
          en: 'Outside North',
        },
        insideNorth: {
          en: 'Inside North',
        },
        insideSouth: {
          en: 'Inside South',
        },
        outsideSouth: {
          en: 'Outside South',
        },
      },
    },
    // --------- Moko the Restless ----------
    {
      id: 'Rokkon Moko Kenki Release',
      type: 'StartsUsing',
      netRegex: { id: '85AD', source: 'Moko the Restless', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Rokkon Moko Scarlet Auspice',
      type: 'StartsUsing',
      netRegex: { id: '8598', source: 'Moko the Restless', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'Rokkon Moko Azure Auspice',
      type: 'StartsUsing',
      netRegex: { id: '859C', source: 'Moko the Restless', capture: false },
      response: Responses.getIn(),
    },
    {
      id: 'Rokkon Moko Double Kasumi-Giri Checker',
      type: 'StartsUsing',
      // This cast comes out prior to the BA9 vfx.
      netRegex: { id: '858[BCDE]', source: 'Moko the Restless', capture: false },
      run: (data) => data.isDoubleKasumiGiri = true,
    },
    {
      id: 'Rokkon Moko Iai-kasumi-giri',
      type: 'GainsEffect',
      netRegex: { effectId: 'B9A', count: Object.keys(mokoVfxMap) },
      condition: (data) => !data.isDoubleKasumiGiri,
      alertText: (_data, matches, output) => {
        const map: { [name: string]: KasumiGiri } = mokoVfxMap;
        const thisAbility = map[matches.count];
        if (thisAbility === undefined)
          return;
        return output[thisAbility]!();
      },
      outputStrings: {
        back: Outputs.back,
        front: Outputs.front,
        left: Outputs.left,
        right: Outputs.right,
      },
    },
    {
      id: 'Rokkon Moko Double Kasumi-giri Second',
      type: 'GainsEffect',
      netRegex: { effectId: 'B9A', count: Object.keys(mokoVfxMap) },
      condition: (data) => data.isDoubleKasumiGiri && data.firstKasumiGiri !== undefined,
      durationSeconds: 6,
      alertText: (data, matches, output) => {
        const map: { [name: string]: KasumiGiri } = mokoVfxMap;
        const thisAbility = map[matches.count];
        if (thisAbility === undefined)
          return;

        const firstDir = data.firstKasumiGiri;
        if (firstDir === undefined)
          return;

        const dir1 = output[firstDir]!();

        const secondMap: Record<KasumiGiri, string> = {
          front: output.through!(),
          back: output.stay!(),
          left: output.rotateLeft!(),
          right: output.rotateRight!(),
        } as const;
        const dir2 = secondMap[thisAbility];
        return output.combo!({ dir1: dir1, dir2: dir2 });
      },
      run: (data) => {
        delete data.firstKasumiGiri;
        delete data.isDoubleKasumiGiri;
      },
      outputStrings: {
        back: Outputs.back,
        front: Outputs.front,
        left: Outputs.left,
        right: Outputs.right,
        through: {
          en: 'Run Through',
          de: 'Renn durch',
          ko: '가로지르기',
        },
        stay: {
          en: 'Stay',
          de: 'Stehen bleiben',
          ko: '그대로',
        },
        rotateLeft: {
          en: 'Rotate Left',
          de: 'Links rotieren',
          ko: '왼쪽으로',
        },
        rotateRight: {
          en: 'Rotate Right',
          de: 'Rechts rotieren',
          ko: '오른쪽으로',
        },
        combo: {
          en: '${dir1} => ${dir2}',
          de: '${dir1} => ${dir2}',
          ko: '${dir1} => ${dir2}',
        },
      },
    },
    {
      id: 'Rokkon Moko Double Kasumi-giri First',
      type: 'GainsEffect',
      netRegex: { effectId: 'B9A', count: Object.keys(mokoVfxMap) },
      condition: (data) => data.isDoubleKasumiGiri && data.firstKasumiGiri === undefined,
      infoText: (data, matches, output) => {
        const map: { [name: string]: KasumiGiri } = mokoVfxMap;
        const thisAbility = map[matches.count];
        if (thisAbility === undefined)
          return;
        data.firstKasumiGiri = thisAbility;
        return output.text!({ dir: output[thisAbility]!() });
      },
      outputStrings: {
        text: {
          en: '(${dir} First)',
          de: '(${dir} Zuerst)',
          ko: '(${dir} 먼저)',
        },
        back: Outputs.back,
        front: Outputs.front,
        left: Outputs.left,
        right: Outputs.right,
        combo: {
          en: '${dir1} => ${dir2}',
          de: '${dir1} => ${dir2}',
          ko: '${dir1} => ${dir2}',
        },
      },
    },
    // --------- Gorai the Uncaged ----------
    {
      id: 'Rokkon Gorai Unenlightemnment',
      type: 'StartsUsing',
      netRegex: { id: '8500', source: 'Gorai the Uncaged', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Rokkon Gorai Fighting Spirits',
      type: 'StartsUsing',
      netRegex: { id: '84F8', source: 'Gorai the Uncaged', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Rokkon Gorai Biwa Breaker',
      type: 'StartsUsing',
      netRegex: { id: '84FD', source: 'Gorai the Uncaged', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Rokkon Gorai Torching Torment',
      type: 'StartsUsing',
      netRegex: { id: '84FE', source: 'Gorai the Uncaged' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Rokkon Gorai Summon Collect',
      type: 'StartsUsing',
      // 84D5 = Flickering Flame
      // 84D6 = Sulphuric Stone
      // 84D7 = Flame and Sulphur
      netRegex: { id: ['84D5', '84D6', '84D7'], source: 'Gorai the Uncaged' },
      run: (data, matches) => data.goraiSummon = matches,
    },
    {
      id: 'Rokkon Gorai Plectrum of Power',
      type: 'StartsUsing',
      netRegex: { id: '84D8', source: 'Gorai the Uncaged', capture: false },
      alertText: (data, _matches, output) => {
        const id = data.goraiSummon?.id;
        if (id === '84D5')
          return output.lines!();
        if (id === '84D6')
          return output.rocks!();
        if (id === '84D7')
          return output.both!();
      },
      run: (data) => delete data.goraiSummon,
      outputStrings: {
        lines: {
          en: 'Avoid Expanding Lines',
        },
        rocks: {
          en: 'Avoid Expanding Rocks',
        },
        both: {
          en: 'Avoid Expanding Rocks/Lines',
        },
      },
    },
    {
      id: 'Rokkon Gorai Morphic Melody',
      type: 'StartsUsing',
      netRegex: { id: '84D9', source: 'Gorai the Uncaged', capture: false },
      alertText: (data, _matches, output) => {
        const id = data.goraiSummon?.id;
        if (id === '84D5')
          return output.lines!();
        if (id === '84D6')
          return output.rocks!();
        if (id === '84D7')
          return output.both!();
      },
      run: (data) => delete data.goraiSummon,
      outputStrings: {
        lines: Outputs.goIntoMiddle,
        rocks: {
          en: 'Stand on Rock',
        },
        both: {
          en: 'Stand on Rock + Line',
        },
      },
    },
    {
      id: 'Rokkon Gorai Malformed Prayer',
      type: 'StartsUsing',
      netRegex: { id: '84E1', source: 'Gorai the Uncaged', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Stand in All Towers',
        },
      },
    },
    // --------- Enenra ----------
    {
      id: 'Rokkon Enenra Flagrant Combustion',
      type: 'StartsUsing',
      netRegex: { id: '8042', source: 'Enenra', capture: false },
      // Can be used during Smoke and Mirrors clone phase
      suppressSeconds: 5,
      response: Responses.aoe(),
    },
    {
      id: 'Rokkon Enenra Smoke Rings',
      type: 'StartsUsing',
      netRegex: { id: '8053', source: 'Enenra', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'Rokkon Enenra Clearing Smoke',
      type: 'StartsUsing',
      netRegex: { id: '8052', source: 'Enenra', capture: false },
      response: Responses.knockback(),
    },
    {
      id: 'Rokkon Enenra Pipe Cleaner Collect',
      type: 'Tether',
      netRegex: { id: '0011' },
      run: (data, matches) => data.enenraPipeCleanerCollect.push(matches.source),
    },
    {
      id: 'Rokkon Enenra Pipe Cleaner',
      type: 'StartsUsing',
      netRegex: { id: '8054', source: 'Enenra', capture: false },
      condition: (data) => data.enenraPipeCleanerCollect.includes(data.me),
      alertText: (_data, _matches, output) => output.text!(),
      run: (data) => data.enenraPipeCleanerCollect = [],
      outputStrings: {
        text: Outputs.earthshakerOnYou,
      },
    },
    {
      id: 'Rokkon Enenra Snuff',
      type: 'StartsUsing',
      netRegex: { id: '8056', source: 'Enenra' },
      response: Responses.tankCleave(),
    },
    {
      id: 'Rokkon Enenra Uplift',
      type: 'Ability',
      // If hit by snuff, move away from uplift.
      netRegex: { id: '8056', source: 'Enenra' },
      condition: Conditions.targetIsYou(),
      response: Responses.moveAway(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Plectrum of Power/Morphic Melody': 'Plectrum/Morphic',
        'Morphic Melody/Plectrum of Power': 'Morphic/Plectrum',
        'Clearing Smoke/Smoke Rings': 'Clearing Smoke/Rings',
      },
    },
    {
      'locale': 'de',
      'missingTranslations': true,
      'replaceSync': {
        'Ancient Katana': 'antik(?:e|er|es|en) Katana',
        'Ashigaru Kyuhei': 'Ashigaru Kyuhei',
        'Ill-come Tengu': 'ungebeten(?:e|er|es|en) Tengu',
        'Last Glimpse': 'Letzter Blick',
        'Mirrored Yozakura': 'gedoppelt(?:e|er|es|en) Yozakura',
        'Moko the Restless': 'Moko (?:der|die|das) Rastlos(?:e|er|es|en)',
        'Oni\'s Claw': 'Oni-Klaue',
        'The Hall Of The Unseen': 'Halle der Verhüllung',
        'Yozakura the Fleeting': 'Yozakura (?:der|die|das) Vergänglich(?:e|er|es|en)',
      },
      'replaceText': {
        'Art of the Fireblossom': 'Kunst der Feuerblüte',
        'Art of the Windblossom': 'Kunst der Windblüte',
        'Azure Auspice': 'Azurblauer Kenki-Fokus',
        'Boundless Azure': 'Grenzenloses Azurblau',
        'Boundless Scarlet': 'Grenzenloses Scharlachrot',
        'Bunshin': 'Doppeltes Ich',
        'Clearout': 'Ausräumung',
        'Double Kasumi-giri': 'Doppeltes Kasumi-giri',
        'Drifting Petals': 'Blütenblätterregen',
        'Explosion': 'Explosion',
        'Ghastly Grasp': 'Gruselgriff',
        'Glory Neverlasting': 'Trichterwinde',
        'Iai-kasumi-giri': 'Iai-kasumi-giri',
        'Icebloom': 'Eisblüte',
        'Iron Rain': 'Eisenregen',
        'Kenki Release': 'Kenki-Entfesselung',
        'Kuge Rantsui': 'Kuge Rantsui',
        'Levinblossom Strike': 'Grollen der Gewitterblüte',
        'Moonless Night': 'Mondlose Nacht',
        'Mud Pie': 'Schlammklumpen',
        'Mudrain': 'Schlammblüte',
        'Oka Ranman': 'Oka Ranman',
        'Scarlet Auspice': 'Scharlachroter Kenki-Fokus',
        'Seal Marker': 'Siegel Marker',
        'Seal of Riotous Bloom': 'Siegel des Wildblühens',
        'Seal of the Blossom': 'Siegel der Blüte',
        'Seal of the Fleeting': 'Kunst des Blütensiegels',
        'Season Indicator': 'Shikunshi Indikator',
        'Season of Element': 'Shikunshi des Elements',
        'Seasons of the Fleeting': 'Shikunshi',
        'Shadowflight': 'Schattenschlag',
        'Soldiers of Death': 'Soldaten des Todes',
        'Spearman\'s Orders': 'Lanze vor!',
        'Spiritflame': 'Geisterflamme',
        'Spiritspark': 'Geisterfunke',
        'Tengu-yobi': 'Tengu-yobi',
        'Unsheathing': 'Ziehen des Schwertes',
        'Untempered Sword': 'Zügelloses Schwert',
        'Upwell': 'Strömung',
        'Veil Sever': 'Schleierdurchtrennung',
        'Windblossom Whirl': 'Wirbel der Windblüte',
        'Yama-kagura': 'Yama-kagura',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Ancient Katana': 'katana ancien',
        'Ashigaru Kyuhei': 'ashigaru kyûhei',
        'Ill-come Tengu': 'tengu du Rokkon',
        'Last Glimpse': 'Clairière du Discernement',
        'Mirrored Yozakura': 'double de Yozakura',
        'Moko the Restless': 'Môko le tourmenté',
        'Oni\'s Claw': 'griffe d\'oni',
        'Yozakura the Fleeting': 'Yozakura l\'élusive',
      },
      'replaceText': {
        'Art of the Fireblossom': 'Art floral de feu',
        'Art of the Windblossom': 'Art floral de vent',
        'Azure Auspice': 'Auspice azuré',
        'Boundless Azure': 'Lueur azurée',
        'Boundless Scarlet': 'Lueur écarlate',
        'Bunshin': 'Bunshin',
        'Clearout': 'Fauchage',
        'Double Kasumi-giri': 'Kasumi-giri double',
        'Drifting Petals': 'Pétales faillissants',
        'Explosion': 'Explosion',
        'Ghastly Grasp': 'Étreinte funeste',
        'Glory Neverlasting': 'Gloire éphémère',
        'Iai-kasumi-giri': 'Iai-kasumi-giri',
        'Icebloom': 'Floraison de givre',
        'Iron Rain': 'Pluie de fer',
        'Kenki Release': 'Décharge Kenki',
        'Kuge Rantsui': 'Kuge Rantsui',
        'Levinblossom Strike': 'Tonnerre en fleur',
        'Moonless Night': 'Nuit noire',
        'Mud Pie': 'Boule de boue',
        'Mudrain': 'Lotus de boue',
        'Oka Ranman': 'Oka Ranman',
        'Scarlet Auspice': 'Auspice écarlate',
        'Seal of Riotous Bloom': 'Sceau de floraison vivace',
        'Seal of the Fleeting': 'Sceau de floraison',
        'Seasons of the Fleeting': 'Quatre saisons',
        'Shadowflight': 'Vol ombrageux',
        'Soldiers of Death': 'Guerriers de la mort',
        'Spearman\'s Orders': 'Ordre d\'attaque',
        'Spiritflame': 'Flamme spirituelle',
        'Spiritspark': 'Étincelle spirituelle',
        'Tengu-yobi': 'Tengu-yobi',
        'Unsheathing': 'Défouraillage',
        'Untempered Sword': 'Lame impulsive',
        'Upwell': 'Torrent violent',
        'Veil Sever': 'Voile déchiré',
        'Windblossom Whirl': 'Pétales tournoyants',
        'Yama-kagura': 'Yama-kagura',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Ancient Katana': '古刀',
        'Ashigaru Kyuhei': '足軽弓兵',
        'Ill-come Tengu': '六根天狗',
        'Last Glimpse': '眼根の木間',
        'Mirrored Yozakura': 'ヨザクラの分身',
        'Moko the Restless': '怨霊モウコ',
        'Oni\'s Claw': '鬼腕',
        'Yozakura the Fleeting': '花遁のヨザクラ',
      },
      'replaceText': {
        'Art of the Fireblossom': '火花の術',
        'Art of the Windblossom': '風花の術',
        'Azure Auspice': '青帝剣気',
        'Boundless Azure': '青帝空閃刃',
        'Boundless Scarlet': '赤帝空閃刃',
        'Bunshin': '分身の術',
        'Clearout': 'なぎ払い',
        'Double Kasumi-giri': '霞二段',
        'Drifting Petals': '落花流水の術',
        'Explosion': '爆発',
        'Ghastly Grasp': '妖気刃',
        'Glory Neverlasting': '槿花一朝',
        'Iai-kasumi-giri': '居合霞斬り',
        'Icebloom': '氷花満開の術',
        'Iron Rain': '矢の雨',
        'Kenki Release': '剣気解放',
        'Kuge Rantsui': '空花乱墜',
        'Levinblossom Strike': '雷花鳴響の術',
        'Moonless Night': '闇夜斬り',
        'Mud Pie': '泥団子',
        'Mudrain': '泥中蓮花の術',
        'Oka Ranman': '桜花爛漫',
        'Scarlet Auspice': '赤帝剣気',
        'Seal of Riotous Bloom': '花押印・乱咲',
        'Seal of the Fleeting': '花押印の術',
        'Seasons of the Fleeting': '四君子の術',
        'Shadowflight': '影討ち',
        'Soldiers of Death': '屍兵呼び',
        'Spearman\'s Orders': '突撃命令',
        'Spiritflame': '怪火',
        'Spiritspark': '怪火呼び',
        'Tengu-yobi': '天狗呼び',
        'Unsheathing': '妖刀具現',
        'Untempered Sword': '有構無構',
        'Upwell': '水流',
        'Veil Sever': '血地裂き',
        'Windblossom Whirl': '風花旋回の術',
        'Yama-kagura': '山神楽',
      },
    },
  ],
};

export default triggerSet;
