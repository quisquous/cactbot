// TODO: 5Head mechanics
// TODO: 6Head mechanics
// TODO: Stack/Flare/Donut/Spread mechanics
const redStarLocale = {
  en: 'Fiery Star',
};
const redStarNames = Object.values(redStarLocale);
const blueStarLocale = {
  en: 'Azure Star',
};
const blueStarNames = Object.values(blueStarLocale);
const orbOutputStrings = {
  ne: Outputs.northeast,
  nw: Outputs.northwest,
  se: Outputs.southeast,
  sw: Outputs.southwest,
};
const getKBOrbSafeDir = (posX, posY, output) => {
  if (posX < 100) {
    if (posY < 100)
      return output.nw();
    return output.sw();
  }
  if (posY < 100)
    return output.ne();
  return output.se();
};
const getAoEOrbSafeDir = (posX, posY, output) => {
  if (posX < 100) {
    if (posY < 100)
      return output.se();
    return output.ne();
  }
  if (posY < 100)
    return output.sw();
  return output.nw();
};
Options.Triggers.push({
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
      infoText: (_data, _matches, output) => output.text(),
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
      infoText: (_data, _matches, output) => output.groups(),
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
        let posX = undefined;
        let posY = undefined;
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
  timelineReplace: [],
});
