import Conditions from '../../../../../resources/conditions.js';
import NetRegexes from '../../../../../resources/netregexes.js';
import { Responses } from '../../../../../resources/responses.js';
import ZoneId from '../../../../../resources/zone_id.js';

// EDEN'S PROMISE: ETERNITY
// E12 NORMAL

// TODO: Handle the EarthShaker bait --> beam intercept mechanic during the intermission.
// TODO: Math the spawn position of the Titanic Bomb Boulders to call the safe direction like E4s.

// Each tether ID corresponds to a primal:
// 008E -- Leviathan
// 008F -- Ifrit
// 0090 -- Ramuh
// 0091 -- Garuda
// We can collect + store these for later use on Stock/Release.

const tetherIds = ['008E', '008F', '0090', '0091'];

// Keys here indicate SAFE directions!
const bombOutputStrings = {
  'north': {
    en: 'Between north bombs',
  },
  'south': {
    en: 'Between south bombs',
  },
  'east': {
    en: 'Between east bombs',
  },
  'west': {
    en: 'Between west bombs',
  },
};

const primalOutputStrings = {
  'combined': {
    en: '${safespot1}, ${safespot2}',
  },
  '0091': {
    en: 'Intercardinals',
  },
  '008F': {
    en: 'Sides',
  },
  '008E': {
    en: 'In',
  },
  '0090': {
    en: 'Out',
  },
};


export default {
  zoneId: ZoneId.EdensPromiseEternity,
  timelineFile: 'e12n.txt',
  triggers: [
    {
      id: 'E12N Intermission Completion',
      netRegex: NetRegexes.ability({ id: '4B48', source: 'Eden\'s Promise', capture: false }),
      run: (data) => data.seenIntermission = true,
    },
    {
      id: 'E12N Maleficium',
      netRegex: NetRegexes.startsUsing({ id: '5872', source: 'Eden\'s Promise', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'E12N Formless Judgment',
      netRegex: NetRegexes.startsUsing({ id: '5873', source: 'Eden\'s Promise' }),
      response: Responses.tankCleave(),
    },
    {
      // Titanic Bombs spawn at two of four points:
      // NW X: -11.31371 Y: -63.68629
      // SW X: -11.31371 Y: -86.3137
      // NE X: 11.31371 Y: -63.68629
      // SE X: 11.31371 Y: -86.3137
      id: 'E12N Bomb Collect',
      netRegex: NetRegexes.addedCombatantFull({ npcNameId: '9816' }),
      run: function(data, matches) {
        const bomb = {};
        bomb.north = parseFloat(matches.y) + 70 > 0;
        bomb.east = parseFloat(matches.x) > 0;
        data.bombs = data.bombs || [];
        data.bombs.push(bomb);
      },
    },
    {
      id: 'E12N Boulders Impact',
      netRegex: NetRegexes.ability({ id: '586E', source: 'Titanic Bomb Boulder', capture: false }),
      suppressSeconds: 5,
      infoText: (data, _, output) => {
        // Whichever direction has two  Titanic Bombs, the safe spot is opposite.
        let safe;
        if (data.bombs[0].north === data.bombs[1].north)
          safe = data.bombs[0].north ? 'south' : 'north';
        else
          safe = data.bombs[0].east ? 'west' : 'east';
        return output[safe]();
      },
      outputStrings: bombOutputStrings,
      run: (data) => delete data.bombs,
    },
    {
      id: 'E12N Boulders Explosion',
      netRegex: NetRegexes.ability({ id: '586F', source: 'Titanic Bomb Boulder', capture: false }),
      suppressSeconds: 5,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Move to last explosions',
        },
      },
    },
    {
      id: 'E12N Rapturous Reach Double',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      condition: (data) => !data.seenIntermission,
      preRun: function(data, matches) {
        data.stacks = data.stacks || [];
        data.stacks.push(matches.target);
      },
      alertText: function(data, matches, output) {
        if (data.me === matches.target)
          return output.stackOnYou();
      },
      infoText: function(data, _, output) {
        if (data.stacks.length === 1)
          return;
        const names = data.stacks.map((x) => data.ShortName(x)).sort();
        return output.stacks({ players: names.join(', ') });
      },
      outputStrings: {
        stacks: {
          en: 'Stack (${players})',
        },
        stackOnYou: {
          en: 'Stack on YOU',
          de: 'Sammeln auf DIR',
          ja: '自分にシェア',
          fr: 'Package sur VOUS',
          ko: '나에게 모이기',
          cn: '集合点名',
        },
      },
    },
    {
      id: 'E12N Rapturous Reach Cleanup',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      delaySeconds: 10,
      run: (data) => delete data.stacks,
    },
    {
      id: 'E12N Rapturous Reach Single',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      condition: (data) => data.seenIntermission,
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'E12N Diamond Dust Spread',
      netRegex: NetRegexes.startsUsing({ id: '5864', source: 'Eden\'s Promise', capture: false }),
      response: Responses.spread(),
    },
    {
      id: 'E12N Diamond Dust Stop',
      netRegex: NetRegexes.startsUsing({ id: '5864', source: 'Eden\'s Promise', capture: false }),
      delaySeconds: 1, // Avoiding collision with the spread call
      response: Responses.stopMoving('alert'),
    },
    {
      id: 'E12N Frigid Stone',
      netRegex: NetRegexes.headMarker({ id: '0060' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'E12N Tether Collect',
      netRegex: NetRegexes.tether({ id: tetherIds }),
      run: function(data, matches) {
        data.tethers = data.tethers || [];
        data.tethers.push(matches.id);
      },
    },
    {
      id: 'E12N Cast Release',
      netRegex: NetRegexes.startsUsing({ id: ['4E2C', '585B', '5861'] }),
      delaySeconds: 1, // Tethers should be first in the log, but let's be SURE
      preRun: (data) => {
        data.tethers = data.tethers.sort();
      },
      infoText: function(data, _, output) {
        if (data.tethers.length === 2)
          return;
        return output[data.tethers[0]]();
      },
      alertText: function(data, _, output) {
        if (data.tethers.length !== 2)
          return;
        return output.combined({
          safespot1: output[data.tethers[0]](),
          safespot2: output[data.tethers[1]](),
        });
      },
      outputStrings: primalOutputStrings,
    },
    {
      id: 'E12N Tether Cleanup',
      netRegex: NetRegexes.startsUsing({ id: ['4E2C', '585B', '5861'] }),
      delaySeconds: 5,
      run: (data) => delete data.tethers,
    },
  ],
};
