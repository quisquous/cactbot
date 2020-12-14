import Conditions from '../../../../../resources/conditions.js';
import NetRegexes from '../../../../../resources/netregexes.js';
import { Responses } from '../../../../../resources/responses.js';
import ZoneId from '../../../../../resources/zone_id.js';

// Handle randomized headmarkers:
// TODO: tankbuster markers
// TODO: do the formless markers come out in hate order? if so, be smart about swap vs buster call.
// TODO: electric slide markers
// TODO: titan headmarkers

// TODO: knockback direction from big hand after giant lasers (Palm Of Temperance 58B4/58B6/?/?)
// TODO: for left/right reach during Blade Of Flame, call out Left + #1 alarm for #1.
// TODO: classical sculpture healer stacks are id 0106 headmarkers, but happen earlier too :C
// TODO: knockback from lion

// Each tether ID corresponds to a primal:
// 008C -- Shiva
// 008D -- Titan
// 008E -- Leviathan
// 008F -- Ifrit
// 0090 -- Ramuh
// 0091 -- Garuda
// We can collect + store these for later use on Stock/Release.
const shivaTetherId = '008C';
const titanTetherId = '008D';
const tetherIds = ['008E', '008F', '0090', '0091'];

const getTetherString = (tethers, output) => {
  // All tethers in E12S are double tethers, plus an optional junction (not in the tether list).
  if (!tethers || tethers.length !== 2)
    return;

  const sorted = tethers.sort();

  const comboStr = sorted[0] + sorted[1];
  if (comboStr in primalOutputStrings)
    return output[comboStr]();

  return output.combined({
    safespot1: output[sorted[0]](),
    safespot2: output[sorted[1]](),
  });
};

// TODO: also on the pre-statue cast, call south for any levi mechanics, west for any ifrit.
const primalOutputStrings = {
  // Tethers.
  '008E': {
    en: 'Middle',
  },
  '008F': {
    en: 'Sides',
  },
  '0090': {
    en: 'Out',
  },
  '0091': {
    en: 'Intercards',
  },
  // Tether combos.
  '008E008F': {
    en: 'Under + Sides',
  },
  '008E0090': {
    en: 'North/South + Out',
  },
  '008E0091': {
    en: 'Under + Intercards',
  },
  // Text output.
  'combined': {
    en: '${safespot1} + ${safespot2}',
  },
  'stock': {
    en: 'Stock: ${text}',
  },
  'junctionSuffix': {
    en: '${text} (${junction})',
  },
  // Junctions.
  'spread': {
    // Shiva spread.
    en: 'spread',
  },
  'stacks': {
    // Titan healer stacks.
    en: 'stacks',
  },
  'stack': {
    // Obliterate whole group laser stack.
    // This is deliberately "stack" singular (vs Titan "stacks").
    en: 'group stack',
  },
};

export default {
  zoneId: ZoneId.EdensPromiseEternitySavage,
  timelineFile: 'e12s.txt',
  triggers: [
    {
      id: 'E12S Promise Rapturous Reach Left',
      netRegex: NetRegexes.startsUsing({ source: 'Eden\'s Promise', id: '58AD', capture: false }),
      response: Responses.goLeft('info'),
    },
    {
      id: 'E12S Promise Rapturous Reach Right',
      netRegex: NetRegexes.startsUsing({ source: 'Eden\'s Promise', id: '58AE', capture: false }),
      response: Responses.goRight('info'),
    },
    {
      id: 'E12S Promise Obliteration',
      netRegex: NetRegexes.startsUsing({ source: 'Eden\'s Promise', id: '58A8', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'E12S Promise Junction Shiva',
      netRegex: NetRegexes.tether({ id: shivaTetherId, capture: false }),
      // Call out what the mechanic will be so that folks have time to move.
      preRun: (data) => {
        data.junctionSuffix = 'spread';
        data.junctionCount = data.junctionCount || 0;
        data.junctionCount++;
      },
      durationSeconds: (data) => data.junctionCount === 2 ? 4 : 13,
      alertText: (data, _, output) => {
        // The 2nd and 3rd junctions are different mechanics.
        if (data.junctionCount === 2)
          return output.diamondDust();
        return output.junctionWithCast();
      },
      outputStrings: {
        // Use parentheses to try to connote that this is a tell for the future, e.g. wolex.
        junctionWithCast: {
          en: 'Spread',
        },
        // TODO: maybe this should be a timeline trigger instead, since it needs more mit.
        diamondDust: {
          en: 'Big AOE, Get Middle',
        },
      },
    },
    {
      id: 'E12S Promise Junction Titan',
      netRegex: NetRegexes.tether({ id: titanTetherId, capture: false }),
      preRun: (data) => {
        data.junctionSuffix = 'stacks';
        data.junctionCount = data.junctionCount || 0;
        data.junctionCount++;
      },
      durationSeconds: (data) => data.junctionCount === 3 ? 4 : 13,
      alertText: (data, _, output) => {
        // The 2nd and 3rd junctions are different mechanics.
        if (data.junctionCount === 3)
          return output.earthenFury();
        return output.junctionWithCast();
      },
      outputStrings: {
        junctionWithCast: {
          en: 'Healer Stacks',
        },
        earthenFury: {
          en: 'Big AOE, Bombs Soon',
        },
      },
    },
    {
      id: 'E12S Promise Tether Collect',
      netRegex: NetRegexes.tether({ id: tetherIds }),
      run: (data, matches) => {
        data.tethers = data.tethers || [];
        data.tethers.push(matches.id);
      },
    },
    {
      id: 'E12S Promise Stock',
      netRegex: NetRegexes.startsUsing({ source: 'Eden\'s Promise', id: '5892', capture: false }),
      infoText: (data, _, output) => {
        data.stockedTethers = data.tethers;
        delete data.tethers;

        const text = getTetherString(data.stockedTethers, output);
        if (!text)
          return;
        return output.stock({ text: text });
      },
      outputStrings: primalOutputStrings,
    },
    {
      id: 'E12S Promise Cast Release',
      netRegex: NetRegexes.startsUsing({ source: 'Eden\'s Promise', id: ['4E43', '5893'] }),
      alertText: (data, matches, output) => {
        // At the end of the fight, there is a stock -> cast -> release,
        // which means that we need to grab the original tethers during the first stock.
        const isRelease = matches.id === '5893';

        // On the 2nd cast.
        if (!isRelease) {
          data.castCount = data.castCount || 0;
          data.castCount++;
          if (data.castCount === 2)
            data.junctionSuffix = 'stack';
        }

        const text = getTetherString(isRelease ? data.stockedTethers : data.tethers, output);
        if (!text)
          return;
        if (!data.junctionSuffix)
          return text;
        return output.junctionSuffix({
          text: text,
          junction: output[data.junctionSuffix](),
        });
      },
      run: (data) => {
        delete data.tethers;
        delete data.junctionSuffix;
      },
      outputStrings: primalOutputStrings,
    },
    {
      id: 'E12S Promise Tether Cleanup',
      netRegex: NetRegexes.startsUsing({ id: ['4E43', '5892', '5893'], capture: false }),
      delaySeconds: 10,
      run: (data) => delete data.tethers,
    },
    {
      id: 'E12S Promise Plunging Ice',
      // This has a 9 second cast. :eyes:
      netRegex: NetRegexes.startsUsing({ source: 'Eden\'s Promise', id: '589D', capture: false }),
      delaySeconds: 3.1, // just for safety
      response: Responses.knockback('alert'),
    },
    {
      // We could arguably tell people where their lion is, but this is probably plenty.
      id: 'E12S Promise Small Lion Tether',
      netRegex: NetRegexes.tether({ source: 'Beastly Sculpture', id: '0011' }),
      condition: Conditions.targetIsYou(),
      // Don't collide with reach left/right call.
      delaySeconds: 0.5,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Lion Tether on YOU',
        },
      },
    },
  ],
};
