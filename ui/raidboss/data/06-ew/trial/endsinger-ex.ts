import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { callOverlayHandler } from '../../../../../resources/overlay_plugin_api';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { PluginCombatantState } from '../../../../../types/event';
import { LocaleText, Output, OutputStrings, TriggerSet } from '../../../../../types/trigger';

// TODO: 5Head mechanics
// TODO: 6Head mechanics
// TODO: Stack/Flare/Donut/Spread mechanics

const redStarLocale: LocaleText = {
  en: 'Fiery Star',
  de: 'Roter Himmelskörper',
  fr: 'Astre Incarnat',
  ja: '赤色天体',
};

const redStarNames = Object.values(redStarLocale);

const blueStarLocale: LocaleText = {
  en: 'Azure Star',
  de: 'Blauer Himmelskörper',
  fr: 'Astre Azuré',
  ja: '青色天体',
};

const blueStarNames = Object.values(blueStarLocale);

export interface Data extends RaidbossData {
  starMechanicCounter: number;
  storedStars: {
    [id: string]: PluginCombatantState;
  };
  storedHeads: {
    [id: string]: {
      state: PluginCombatantState;
      mechanics: ('cleave' | 'donut' | 'aoe')[];
    };
  };
  storedMechs: {
    1?: 'donut' | 'spread' | 'stack' | 'flare';
    2?: 'donut' | 'spread' | 'stack' | 'flare';
    3?: 'donut' | 'spread' | 'stack' | 'flare';
    counter: 1 | 2 | 3;
  };
}

const orbOutputStrings: OutputStrings = {
  ne: Outputs.northeast,
  nw: Outputs.northwest,
  se: Outputs.southeast,
  sw: Outputs.southwest,
};

const getKBOrbSafeDir = (posX: number, posY: number, output: Output): string | undefined => {
  if (posX < 100) {
    if (posY < 100)
      return output.nw!();

    return output.sw!();
  }
  if (posY < 100)
    return output.ne!();

  return output.se!();
};

const getAoEOrbSafeDir = (posX: number, posY: number, output: Output): string | undefined => {
  if (posX < 100) {
    if (posY < 100)
      return output.se!();

    return output.ne!();
  }
  if (posY < 100)
    return output.sw!();

  return output.nw!();
};

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheMinstrelsBalladEndsingersAria,
  timelineFile: 'endsinger-ex.txt',
  initData: () => {
    return {
      starMechanicCounter: 0,
      storedStars: {},
      storedHeads: {},
      storedMechs: {
        counter: 1,
      },
    };
  },
  timelineTriggers: [
    {
      id: 'EndsingerEx Towers',
      regex: /Tower/,
      beforeSeconds: 4,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Towers',
          de: 'Türme',
          fr: 'Tours',
          ja: '塔を踏む',
          cn: '踩塔',
          ko: '장판 들어가기',
        },
      },
    },
  ],
  triggers: [
    // Fire this trigger on ability since actual damage is 5s after cast bar finishes
    {
      id: 'EndsingerEx Elegeia',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6FF6', source: 'The Endsinger', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '6FF6', source: 'Endsängerin', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '6FF6', source: 'Chantre De L\'Anéantissement', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '6FF6', source: '終焉を謳うもの', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '6FF6', source: '讴歌终结之物', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'EndsingerEx Telos',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '702E', source: 'The Endsinger', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '702E', source: 'Endsängerin', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '702E', source: 'Chantre De L\'Anéantissement', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '702E', source: '終焉を謳うもの', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '702E', source: '讴歌终结之物', capture: false }),
      response: Responses.bigAoe(),
    },
    {
      id: 'EndsingerEx Elenchos Middle',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7022', source: 'The Endsinger', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '7022', source: 'Endsängerin', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '7022', source: 'Chantre De L\'Anéantissement', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '7022', source: '終焉を謳うもの', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '7022', source: '讴歌终结之物', capture: false }),
      response: Responses.goSides(),
    },
    {
      id: 'EndsingerEx Elenchos Outsides',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7020', source: 'The Endsinger', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '7020', source: 'Endsängerin', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '7020', source: 'Chantre De L\'Anéantissement', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '7020', source: '終焉を謳うもの', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '7020', source: '讴歌终结之物', capture: false }),
      response: Responses.goMiddle(),
    },
    {
      id: 'EndsingerEx Hubris',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '702C', source: 'The Endsinger', capture: true }),
      netRegexDe: NetRegexes.startsUsing({ id: '702C', source: 'Endsängerin', capture: true }),
      netRegexFr: NetRegexes.startsUsing({ id: '702C', source: 'Chantre De L\'Anéantissement', capture: true }),
      netRegexJa: NetRegexes.startsUsing({ id: '702C', source: '終焉を謳うもの', capture: true }),
      netRegexCn: NetRegexes.startsUsing({ id: '702C', source: '讴歌终结之物', capture: true }),
      response: Responses.tankCleave(),
    },
    {
      id: 'EndsingerEx Single KB Star',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6FFB', source: blueStarNames, capture: true }),
      delaySeconds: 0.5,
      promise: async (data, matches) => {
        const starData = await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.sourceId, 16)],
        });
        const starCombatant = starData.combatants[0];
        if (!starCombatant) {
          console.error(`Single KB Star: null data`);
          return;
        }

        data.storedStars[matches.sourceId] = starCombatant;
      },
      alertText: (data, matches, output) => {
        const starCombatant = data.storedStars[matches.sourceId];
        if (!starCombatant) {
          console.error(`AoE Star: null data`);
          return;
        }

        return getKBOrbSafeDir(starCombatant.PosX, starCombatant.PosY, output);
      },
      outputStrings: orbOutputStrings,
    },
    {
      id: 'EndsingerEx Single AoE Star',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6FFA', source: redStarNames, capture: true }),
      delaySeconds: 0.5,
      promise: async (data, matches) => {
        const starData = await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.sourceId, 16)],
        });
        const starCombatant = starData.combatants[0];
        if (!starCombatant) {
          console.error(`Single AoE Star: null data`);
          return;
        }

        data.storedStars[matches.sourceId] = starCombatant;
      },
      alertText: (data, matches, output) => {
        const starCombatant = data.storedStars[matches.sourceId];
        if (!starCombatant) {
          console.error(`AoE Star: null data`);
          return;
        }

        return getAoEOrbSafeDir(starCombatant.PosX, starCombatant.PosY, output);
      },
      outputStrings: orbOutputStrings,
    },
    {
      id: 'EndsingerEx Eironeia',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['702F', '7030'], source: 'The Endsinger', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['702F', '7030'], source: 'Endsängerin', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['702F', '7030'], source: 'Chantre De L\'Anéantissement', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['702F', '7030'], source: '終焉を謳うもの', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: ['702F', '7030'], source: '讴歌终结之物', capture: false }),
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.groups!(),
      outputStrings: {
        groups: {
          en: 'Healer Groups',
          de: 'Heiler-Gruppen',
          fr: 'Groupes sur les heals',
          ja: 'ヒラに頭割り',
          cn: '与治疗分摊',
          ko: '힐러 그룹 쉐어',
        },
      },
    },
    {
      id: 'EndsingerEx Star Order Resolver',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: ['6FFE', '6FFF', '7000', '7001'] }),
      delaySeconds: (data, matches) => {
        ++data.starMechanicCounter;
        const offset = data.starMechanicCounter > 1 ? 2 : 0;
        switch (matches.id) {
          case '6FFE':
          case '7000':
            return 0 + offset;
          case '6FFF':
          case '7001':
            return 6.5 + offset;
        }

        return 0;
      },
      alertText: (_data, matches, output) => {
        let posX: number | undefined = undefined;
        let posY: number | undefined = undefined;

        switch (parseFloat(matches.heading)) {
          case 0.79: // SE
            posX = 114;
            posY = 114;
            break;
          case -2.36: // NW
            posX = 86;
            posY = 86;
            break;
          case -0.79: // SW
            posX = 86;
            posY = 114;
            break;
          case 2.36: // NE
            posX = 114;
            posY = 86;
            break;
        }

        if (posX === undefined || posY === undefined) {
          console.error(`Star Order Resolver: Could not resolve star position from heading ${parseFloat(matches.heading)}`);
          return;
        }

        if (blueStarNames.includes(matches.source))
          return getKBOrbSafeDir(posX, posY, output);

        if (redStarNames.includes(matches.source))
          return getAoEOrbSafeDir(posX, posY, output);

        console.error(`Star Order Resolver: Could not match combatant name ${matches.source} to color`);
        return;
      },
      outputStrings: orbOutputStrings,
    },
    {
      id: 'EndsingerEx Star Cleanup',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: ['6FFE', '6FFF', '7000', '7001'], capture: false }),
      delaySeconds: 30,
      run: (data) => {
        data.starMechanicCounter = 0;
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Azure Star': 'blau(?:e|er|es|en) Himmelskörper',
        'Fiery Star': 'rot(?:e|er|es|en) Himmelskörper',
        'The Endsinger': 'Endsängerin',
      },
      'replaceText': {
        'Befoulment': 'Brackwasserbombe',
        'Benevolence': 'Philanthropie',
        'Despair Unforgotten': 'Verzweiflung der Chronistin',
        'Diairesis': 'Diairesis',
        'Eironeia': 'Eironeia',
        'Elegeia Unforgotten': 'Elegeia der Chronistin',
        'Elenchos': 'Elenchos',
        'Endsong\'s Aporrhoia': 'Aporia des Liedes vom Ende',
        'Endsong(?!\')': 'Lied vom Ende',
        '(?<! )Fatalism': 'Fatalismus',
        'Grip of Despair': 'Griff der Verzweiflung',
        'Hubris': 'Hybris',
        'Star Collision': 'Planeten Kollision',
        'Telomania': 'Telomanie',
        'Telos': 'Telos',
        'Tower Explosion': 'Turm Explosion',
        'Theological Fatalism': 'Theologischer Fatalismus',
        'Twinsong\'s Aporrhoia': 'Aporia der Verzweiflung',
        'Ultimate Fate': '',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Azure Star': 'astre azuré',
        'Fiery Star': 'astre incarnat',
        'The Endsinger': 'chantre de l\'anéantissement',
      },
      'replaceText': {
        'Befoulment': 'Bombe de pus',
        'Benevolence': 'Philanthropie',
        'Despair Unforgotten': 'Chronique tourmentante',
        'Diairesis': 'Diérèse',
        'Eironeia': 'Ironie',
        'Elegeia Unforgotten': 'Chronique élégiaque',
        'Elenchos': 'Élenchos',
        'Endsong\'s Aporrhoia': 'Antienne aporétique',
        'Endsong(?!\')': 'Ultime antienne',
        '(?<! )Fatalism(?!e)': 'Fatalisme',
        'Grip of Despair': 'Chaînes du désespoir',
        'Hubris': 'Hubris',
        'Telomania': 'Télomanie',
        'Telos': 'Télos',
        'Theological Fatalism': 'Fatalisme théologique',
        'Twinsong\'s Aporrhoia': 'Chœur aporétique',
        'Ultimate Fate': 'Ultime destin',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Azure Star': '青色天体',
        'Fiery Star': '赤色天体',
        'The Endsinger': '終焉を謳うもの',
      },
      'replaceText': {
        'Befoulment': '膿汁弾',
        'Benevolence': '博愛',
        'Despair Unforgotten': '絶望浸食：事象記録',
        'Diairesis': 'ディアイレシス',
        'Eironeia': 'エイロネイア',
        'Elegeia Unforgotten': 'エレゲイア：事象記録',
        'Elenchos': 'エレンコス',
        'Endsong\'s Aporrhoia': 'アポロイア：絶望輪唱',
        'Endsong(?!\')': '絶望輪唱',
        '(?<! )Fatalism': 'フェイタリズム',
        'Grip of Despair': '絶望の鎖',
        'Hubris': 'ヒュブリス',
        'Telomania': 'テロスマニア',
        'Telos': 'テロス',
        'Theological Fatalism': 'セオロジカル・フェイタリズム',
        'Twinsong\'s Aporrhoia': 'アポロイア：絶望合唱',
        'Ultimate Fate': 'ウルティマフェイト',
      },
    },
  ],
};

export default triggerSet;
