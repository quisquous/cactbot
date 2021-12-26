import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { callOverlayHandler } from '../../../../../resources/overlay_plugin_api';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { PluginCombatantState } from '../../../../../types/event';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  activeSigils: { x: number; y: number; typeId: string; npcId: string }[];
  activeFrontSigils: { x: number; y: number; typeId: string; npcId: string }[];
  activeExplosions: { x: number; y: number }[];
  activePythons: PluginCombatantState[];
  // For Quetz, mechanics which only use two of them always use the two with the highest ID
  activeQuetzs: PluginCombatantState[];
  lastExplosionSafe: number;
  explosionPatternCounter: number;
  paradeigmaCounter: number;
}

const dumpState = (data: Data) => {
  console.log('sigils ', data.activeSigils);
  console.log('frontSigils ', data.activeFrontSigils);
  console.log('explosions ', data.activeExplosions);
  console.log('pythons ', data.activePythons);
  console.log('quetzs ', data.activeQuetzs);
  console.log('lastExplosionSafe ', data.lastExplosionSafe);
  console.log('explosionPatternCounter ', data.explosionPatternCounter);
  console.log('paradeigmaCounter ', data.paradeigmaCounter);
};

const directionOutputStrings = {
  northeast: Outputs.northeast,
  north: Outputs.north,
  northwest: Outputs.northwest,
  west: Outputs.west,
  southeast: Outputs.southeast,
  south: Outputs.south,
  southwest: Outputs.southwest,
  east: Outputs.east,
  combo: {
    en: '${dir1} / ${dir2}',
  },
};

const fetchCombatantsByBNpcID = async (BNpcIDs: number[]) => {
  const callData = await callOverlayHandler({
    call: 'getCombatants',
  });
  const combatants = callData.combatants.filter((c) => !!c.BNpcID && BNpcIDs.includes(c.BNpcID));
  return combatants;
};

const fetchCombatantsByTargetID = async (targetId: string[]) => {
  const decIds = [];
  for (const id of targetId)
    decIds.push(parseInt(id, 16));
  const callData = await callOverlayHandler({
    call: 'getCombatants',
    ids: decIds,
  });
  return callData.combatants;
};

const isSafeFromSigil = (activeSigils: { x: number; y: number; typeId: string; npcId: string }[], quadrant: number) => {
  if (activeSigils.length === 0)
    return true;
  if (quadrant === 0) {
    for (const sigil of activeSigils) {
      // If this is a blue sigil
      if (sigil.typeId === '67E6') {
        if (sigil.x < 100 || sigil.y > 100)
          return false;
        // If this is a red sigil
      } else if (sigil.typeId === '67E5') {
        if (sigil.x > 100 || sigil.y < 100)
          return false;
      }
      return true;
    }
  }
  if (quadrant === 1) {
    for (const sigil of activeSigils) {
      // If this is a blue sigil
      if (sigil.typeId === '67E6') {
        if (sigil.x > 100 || sigil.y > 100)
          return false;
        // If this is a red sigil
      } else if (sigil.typeId === '67E5') {
        if (sigil.x < 100 || sigil.y < 100)
          return false;
      }
      return true;
    }
  }
  if (quadrant === 2) {
    for (const sigil of activeSigils) {
      // If this is a blue sigil
      if (sigil.typeId === '67E6') {
        if (sigil.x > 100 || sigil.y < 100)
          return false;
        // If this is a red sigil
      } else if (sigil.typeId === '67E5') {
        if (sigil.x < 100 || sigil.y > 100)
          return false;
      }
      return true;
    }
  }
  if (quadrant === 3) {
    for (const sigil of activeSigils) {
      // If this is a blue sigil
      if (sigil.typeId === '67E6') {
        if (sigil.x < 100 || sigil.y < 100)
          return false;
        // If this is a red sigil
      } else if (sigil.typeId === '67E5') {
        if (sigil.x > 100 || sigil.y > 100)
          return false;
      }
      return true;
    }
  }
};

const isSafeFromQuetz = (activeQuetzs: PluginCombatantState[], quadrant: number) => {
  if (activeQuetzs.length === 0)
    return true;
  for (const quetz of activeQuetzs) {
    switch (quadrant) {
      case 0:
        if (quetz.PosX > 100 && quetz.PosY < 100)
          return true;
        break;
      case 1:
        if (quetz.PosX < 100 && quetz.PosY < 100)
          return true;
        break;
      case 2:
        if (quetz.PosX < 100 && quetz.PosY > 100)
          return true;
        break;
      case 3:
        if (quetz.PosX > 100 && quetz.PosY > 100)
          return true;
        break;
    }
  }
  return false;
};

// -1 -> Error 0 -> Lines, North, 1 -> Lines, South, 2 -> Columns West, 3 -> Columns East

const getPythonConfiguration = (activePythons: PluginCombatantState[]) => {
  if (activePythons.length < 2)
    return -1;
  const py = activePythons[0];
  // Isn't this impossible?
  if (!py)
    return -1;
  // Are pythons north or south?
  if (py.PosY < 83 || py.PosY > 118) {
    if (py.PosX > 79 && py.PosX < 89 || py.PosX > 100 && py.PosX < 110)
      return 2;
    return 3;
  }
  if (py.PosY > 79 && py.PosY < 89 || py.PosY > 100 && py.PosY < 110)
    return 0;
  return 1;
};

// Quadrants:
//  1  |  0
// ---------
//  2  |  3
const isSafe = (activeSigils: { x: number; y: number; typeId: string; npcId: string }[], activeQuetzs: PluginCombatantState[], quadrant: number) => {
  if (isSafeFromQuetz(activeQuetzs, quadrant) && isSafeFromSigil(activeSigils, quadrant))
    return true;
  return false;
};

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheMinstrelsBalladZodiarksFall,
  timelineFile: 'zodiark-ex.txt',
  initData: () => ({
    activeSigils: [],
    activeFrontSigils: [],
    activeExplosions: [],
    activeQuetzs: [],
    activePythons: [],
    lastExplosionSafe: 0,
    explosionPatternCounter: 0,
    paradeigmaCounter: 0,
  }),
  triggers: [
    {
      id: 'ZodiarkEx Ania',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '67EF', source: 'Zodiark' }),
      netRegexDe: NetRegexes.startsUsing({ id: '67EF', source: 'Zodiark' }),
      netRegexFr: NetRegexes.startsUsing({ id: '67EF', source: 'Zordiarche' }),
      netRegexJa: NetRegexes.startsUsing({ id: '67EF', source: 'ゾディアーク' }),
      netRegexCn: NetRegexes.startsUsing({ id: '67EF', source: '佐迪亚克' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'ZodiarkEx Kokytos',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6C60', source: 'Zodiark', capture: false }),
      response: Responses.bigAoe(),
    },
    {
      id: 'ZodiarkEx Paradeigma',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '67BF', source: 'Zodiark', capture: false }),
      delaySeconds: 1,
      promise: async (data, _matches) => {
        console.log('p cnt ', data.paradeigmaCounter);
        // TODO: Since fetch already supports arrays don't bother overlay twice
        if (data.paradeigmaCounter === 2 || data.paradeigmaCounter === 3 || data.paradeigmaCounter === 5 || data.paradeigmaCounter === 6) {
          const python = await fetchCombatantsByBNpcID([14387]);
          /*
          console.log('------------');
          for (const p of python)
            console.log('paradeigma python: ', p);
          console.log('------------');
          */
          data.activePythons = python;
        }
        if (data.paradeigmaCounter === 0 || data.paradeigmaCounter === 1 || data.paradeigmaCounter === 4 || data.paradeigmaCounter === 5 || data.paradeigmaCounter === 7) {
          const quetz = await fetchCombatantsByBNpcID([14388]);
          /*
          console.log('------------');
          for (const q of quetz)
            console.log('paradeigma quetz: ', q);
          console.log('------------');
          */
          data.activeQuetzs = quetz;
        }
        console.log('Paradeigma dump');
        dumpState(data);
      },
      alertText: (data, _matches, output) => {
        ++data.paradeigmaCounter;
        if (data.paradeigmaCounter === 1)
          return output.underQuetz!();
      },
      outputStrings: {
        underQuetz: {
          en: 'Under NW Quetzalcoatl',
        },
      },
    },
    {
      id: 'ZodiarkEx Styx',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '67F3', source: 'Zodiark', capture: false }),
      response: Responses.aoe(),
    },
    {
      // 67E4 Green Beam, 67E5 Rectangle, 67E6 Wedge
      id: 'ZodiarkEx Arcane Sigil End',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: ['67E4', '67E5', '67E6'], source: 'Arcane Sigil', capture: true }),
      run: (data, matches, _output) => {
        for (let i = 0; i < data.activeSigils.length; ++i) {
          const sig = data.activeSigils[i];
          if (sig?.npcId === matches.sourceId)
            data.activeSigils.splice(i, 1);
        }
      },
    },
    {
      id: 'ZodiarkEx Quetz End',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6651', source: 'Quetzalcoatl', capture: true }),
      run: (data, matches, _output) => {
        for (let i = 0; i < data.activeQuetzs.length; ++i) {
          const quetz = data.activeQuetzs[i];
          if (quetz && (quetz.ID === parseInt(matches.sourceId, 16)))
            data.activeQuetzs.splice(i, 1);
        }
      },
    },
    {
      id: 'ZodiarkEx Python End',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6650', source: 'Python', capture: true }),
      run: (data, matches, _output) => {
        for (let i = 0; i < data.activePythons.length; ++i) {
          const python = data.activePythons[i];
          if (python && (python.ID === parseInt(matches.sourceId, 16)))
            data.activePythons.splice(i, 1);
        }
      },
    },
    {
      id: 'ZodiarkEx Blue Tether',
      type: 'Tether',
      netRegex: NetRegexes.tether({ id: '00A4', source: 'Zodiark' }),
      promise: async (data, matches) => {
        const portalActors = await fetchCombatantsByTargetID([matches.targetId]);
        for (const actor of portalActors) {
          if (actor.ID) {
            // console.log('blue ', { x: actor.PosX, y: actor.PosY, typeId: '67E6', npcId: actor.ID.toString(16).toUpperCase() });
            data.activeSigils.push({ x: actor.PosX, y: actor.PosY, typeId: '67E6', npcId: actor.ID.toString(16).toUpperCase() });
          }
        }
      },
      alertText: (data, matches, output) => {
        const target = data.activeSigils[data.activeSigils.length - 1];
        if (!target) {
          console.error(`Blue Tether: Missing target, ${JSON.stringify(matches)}`);
          return;
        }

        if (target.x < 100)
          return output.west!();

        if (target.x > 100)
          return output.east!();

        if (target.y < 100)
          return output.north!();
        return output.south!();
      },
      outputStrings: directionOutputStrings,
    },
    {
      id: 'ZodiarkEx Red Tether',
      type: 'Tether',
      netRegex: NetRegexes.tether({ id: '00AB', source: 'Zodiark' }),
      promise: async (data, matches) => {
        const portalActors = await fetchCombatantsByTargetID([matches.targetId]);
        for (const actor of portalActors) {
          if (actor.ID) {
            // console.log('red ', { x: actor.PosX, y: actor.PosY, typeId: '67E5', npcId: actor.ID.toString(16).toUpperCase() });
            data.activeSigils.push({ x: actor.PosX, y: actor.PosY, typeId: '67E5', npcId: actor.ID.toString(16).toUpperCase() });
          }
        }
      },
      alertText: (data, matches, output) => {
        const target = data.activeSigils[data.activeSigils.length - 1];
        if (!target) {
          console.error(`Red Tether: Missing target, ${JSON.stringify(matches)}`);
          return;
        }

        if (target.x < 100)
          return output.east!();

        if (target.x > 100)
          return output.west!();

        if (target.y < 100)
          return output.south!();
        return output.north!();
      },
      outputStrings: directionOutputStrings,
    },
    {
      id: 'ZodiarkEx Roiling Darkness Spawn',
      type: 'AddedCombatant',
      netRegex: NetRegexes.addedCombatant({ name: 'Roiling Darkness', capture: false }),
      suppressSeconds: 1,
      response: Responses.killAdds(),
    },
    {
      // 67E4 Green Beam, 67E5 Rectangle, 67E6 Wedge
      id: 'ZodiarkEx Arcane Sigil Start',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['67E4', '67E5', '67E6'], source: 'Arcane Sigil' }),
      run: (data, matches, _output) => {
        if (parseFloat(matches.y) < 100)
          data.activeFrontSigils.push({ x: parseFloat(matches.x), y: parseFloat(matches.y), typeId: matches.id, npcId: matches.sourceId });
      },
    },
    {
      id: 'ZodiarkEx Arcane Sigil Start Cleanup',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['67E4', '67E5', '67E6'], source: 'Arcane Sigil', capture: false }),
      delaySeconds: 0.2,
      suppressSeconds: 0.2,
      alertText: (data, _matches, output) => {
        const activeFrontSigils = data.activeFrontSigils;
        data.activeFrontSigils = [];
        if (activeFrontSigils.length === 1 && activeFrontSigils[0]?.typeId === '67E4')
          return output.sides!();
        if (activeFrontSigils.length === 2 && activeFrontSigils[0]?.typeId === '67E4' && activeFrontSigils[1]?.typeId === '67E4')
          return output.middle!();
        if (activeFrontSigils.length === 3) {
          for (const sig of activeFrontSigils) {
            // Find the middle sigil
            if (sig.x > 90 && sig.x < 110) {
              if (sig.typeId === '67E4')
                return output.frontsides!();
              if (sig.typeId === '67E5')
                return output.backmiddle!();
              if (sig.typeId === '67E6')
                return output.frontmiddle!();
            }
          }
        }
      },
      outputStrings: {
        frontsides: {
          en: 'front sides',
        },
        backmiddle: {
          en: 'back middle',
        },
        frontmiddle: {
          en: 'front middle',
        },
        sides: Outputs.sides,
        middle: Outputs.middle,
      },
    },
    {
      id: 'ZodiarkEx Explosion',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '67E7', source: 'Zodiark' }),
      alertText: (data, matches, output) => {
        if (data.activeExplosions.length < 7)
          data.activeExplosions.push({ x: parseFloat(matches.x), y: parseFloat(matches.y) });
        if (data.activeExplosions.length === 7) {
          const activeExplosions = data.activeExplosions;
          data.activeExplosions = [];
          // Explosions fall in a 9x9 grid
          // Find out which spots are safe
          const grid: boolean[] = [true, true, true, true, true, true, true, true, true];
          for (const ex of activeExplosions) {
            // Which y row is this explosion in?
            let offset = -1;
            if (ex.y < 90)
              offset = 0;
            if (ex.y > 90 && ex.y < 110)
              offset = 3;
            if (ex.y > 110)
              offset = 6;
            // Which x column is this explosion in?
            if (ex.x < 90)
              grid[offset + 0] = false;
            if (ex.x > 90 && ex.x < 110)
              grid[offset + 1] = false;
            if (ex.x > 110)
              grid[offset + 2] = false;
          }
          // FIXME: Commented parts prefer straight movement, loop prefers closest to northwest
          // ++data.explosionPatternCounter;
          // First explosion, prefer left and prefer front (melee) spot
          // if (data.explosionPatternCounter === 1) {
          for (let i = 0; i < grid.length; ++i) {
            if (grid[i]) {
              // data.lastExplosionSafe = i;
              return output[i]!();
            }
          }
          // }
          /*
          // 2nd or 3rd pattern. Where do we go from lastExplosionSafe?
          const lastSafe = data.lastExplosionSafe;
          let newSafe = -1;
          // Can we go up?
          if (lastSafe - 3 >= 0 && grid[lastSafe - 3])
            newSafe = lastSafe - 3;
          // Left?
          else if (lastSafe - 1 >= 0 && grid[lastSafe - 1])
            newSafe = lastSafe - 1;
          // Right?
          else if (lastSafe + 1 !== 4 && lastSafe + 1 !== 7 && grid[lastSafe + 1])
            newSafe = lastSafe + 1;
          // Down?
          else if (lastSafe + 3 <= 8 && grid[lastSafe + 3])
            newSafe = lastSafe + 3;
          // Up Left?
          else if (lastSafe - 4 >= 0 && grid[lastSafe - 4])
            newSafe = lastSafe - 4;
          // Up Right?
          else if (lastSafe - 2 >= 0 && grid[lastSafe - 2])
            newSafe = lastSafe - 2;
          // Down Left?
          else if (lastSafe + 2 >= 8 && grid[lastSafe + 2])
            newSafe = lastSafe + 2;
          // Down Right?
          else if (lastSafe + 4 >= 8 && grid[lastSafe + 4])
            newSafe = lastSafe + 4;
          data.lastExplosionSafe = newSafe;
          return output[newSafe]!();
          */
        }
      },
      outputStrings: {
        0: Outputs.northwest,
        1: Outputs.north,
        2: Outputs.northeast,
        3: Outputs.west,
        4: Outputs.middle,
        5: Outputs.east,
        6: Outputs.southwest,
        7: Outputs.south,
        8: Outputs.southeast,
      },
    },
    {
      // 67EC is leaning left, 67ED is leaning right
      id: 'ZodiarkEx Algedon',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['67EC', '67ED'], source: 'Zodiark' }),
      alertText: (data, matches, output) => {
        console.log('Algedon dump');
        dumpState(data);
        if (matches.id === '67EC') {
          // NE/SW
          if (isSafe(data.activeSigils, data.activeQuetzs, 0))
            return output.northeast!();
          return output.southwest!();
        }
        if (matches.id === '67ED') {
          // NW/SE
          if (isSafe(data.activeSigils, data.activeQuetzs, 1))
            return output.northwest!();
          return output.southeast!();
        }
      },
      outputStrings: directionOutputStrings,
    },
    {
      id: 'ZodiarkEx Adikia',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63A9', source: 'Zodiark', capture: false }),
      alertText: (data, _matches, output) => {
        console.log('Adikia dump');
        dumpState(data);
        const ps = getPythonConfiguration(data.activePythons);
        switch (ps) {
          case -1:
            return output.text!();
          case 0:
            return output.northofmiddle!();
          case 1:
            return output.north!();
          default:
            console.log('Adikia: ERROR Unknown python configuration: ', ps);
        }
      },
      outputStrings: {
        text: {
          en: 'double fists',
        },
        north: {
          en: 'double fists, north',
        },
        northofmiddle: {
          en: 'double fists, north of middle',
        },
      },
    },
    {
      id: 'ZodiarkEx Phobos',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '67F0', source: 'Zodiark', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Heavy DoT',
        },
      },
    },
    {
      id: 'ZodiarkEx Astral Flow',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['6662', '6663'], source: 'Zodiark', capture: false }),
      alertText: (data, _matches, _output) => {
        console.log('Astral Flow dump');
        dumpState(data);
        let checkQuetzs = data.activeQuetzs;
        if (data.paradeigmaCounter === 6) {
          console.log('AF special no quetz check');
          checkQuetzs = [];
        }
        let str = '';
        switch (getPythonConfiguration(data.activePythons)) {
          // No pythons so no modifier
          case -1:
            break;
          case 0:
            str += 'python front';
            break;
          case 1:
            str += 'python back';
            break;
          case 2:
            str += 'python left';
            break;
          case 3:
            str += 'python right';
            break;
          default:
            str += 'python bugged good luck';
            break;
        }
        // 6662 CW, 6663 CCW
        if (isSafe(data.activeSigils, checkQuetzs, 1))
          return 'Northwest ' + str;
        if (isSafe(data.activeSigils, checkQuetzs, 0))
          return 'Northeast ' + str;
        if (isSafe(data.activeSigils, checkQuetzs, 3))
          return 'Southwest ' + str;
        return 'Southeast ' + str;
      },
      outputStrings: directionOutputStrings,
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Esoteric Dyad/Esoteric Sect': 'Esoteric Dyad/Sect',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'Arcane Sigil': 'Geheimzeichen',
        'Behemoth': 'Behemoth',
        'Quetzalcoatl': 'Quetzalcoatl',
        'Roiling Darkness': 'Strom der Dunkelheit',
        'Zodiark': 'Zodiark',
        'python': 'Python',
      },
      'replaceText': {
        'Adikia': 'Adikia',
        'Algedon': 'Algedon',
        'Ania': 'Ania',
        'Apomnemoneumata': 'Apomnemoneumata',
        'Astral Eclipse': 'Astraleklipse',
        'Astral Flow': 'Lichtstrom',
        'Esoteric Dyad': 'Esoterische Dyade',
        'Esoteric Pattern': 'Esoteric Muster',
        '(?<!Triple )Esoteric Ray': 'Esoterischer Strahl',
        'Esoteric Sect': 'Esoterische Sekte',
        'Esoterikos': 'Esoterikos',
        '(?<!Trimorphos )Exoterikos': 'Exoterikos',
        'Explosion': 'Explosion',
        'Infernal Stream': 'Infernostrom',
        'Infernal Torrent': 'Infernaler Strom',
        'Keraunos Eidolon': 'Keraunos',
        'Kokytos': 'Kokytos',
        'Meteoros Eidolon': 'Meteoros',
        'Opheos Eidolon': 'Opheos',
        'Paradeigma': 'Paradeigma',
        'Phlegethon': 'Phlegethon',
        'Phobos': 'Phobos',
        'Styx': 'Styx',
        'Trimorphos Exoterikos': 'Trimorphos Exoterikos',
        'Triple Esoteric Ray': 'Esoterischer Dreierstrahl',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Arcane Sigil': 'emblème secret',
        'Behemoth': 'béhémoth',
        'Quetzalcoatl': 'Quetzalcóatl',
        'Roiling Darkness': 'orbe des Ténèbres',
        'Zodiark': 'Zordiarche',
        'python': 'Python',
      },
      'replaceText': {
        'Adikia': 'Adikia',
        'Algedon': 'Algedon',
        'Ania': 'Ania',
        'Apomnemoneumata': 'Apomnemoneumata',
        'Astral Eclipse': 'Éclipse astrale',
        'Astral Flow': 'Flux astral',
        'Esoteric Dyad(?!/)': 'Dyade ésotérique',
        'Esoteric Dyad/Esoteric Sect': 'Dyade/Cabale ésotérique',
        '(?<!Triple )Esoteric Ray': 'Rayon ésotérique',
        '(?<!/)Esoteric Sect': 'Cabale ésotérique',
        'Esoteric Pattern': 'Schéma ésotérique',
        'Esoterikos': 'Esoterikos',
        '(?<!Trimorphos )Exoterikos': 'Exoterikos',
        'Explosion': 'Explosion',
        'Infernal Stream': 'Courant infernal',
        'Infernal Torrent': 'Torrent infernal',
        'Keraunos Eidolon': 'Keraunos',
        'Kokytos': 'Kokytos',
        'Meteoros Eidolon': 'Meteoros',
        'Opheos Eidolon': 'Opheos',
        'Paradeigma': 'Paradeigma',
        'Phlegethon': 'Phlégéthon',
        'Phobos': 'Phobos',
        'Styx': 'Styx',
        'Trimorphos Exoterikos': 'Trimorphos Exoterikos',
        'Triple Esoteric Ray': 'Rayon ésotérique triple',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Arcane Sigil': '秘紋',
        'Behemoth': 'ベヒーモス',
        'Quetzalcoatl': 'ケツァクウァトル',
        'Roiling Darkness': '闇の奔流',
        'Zodiark': 'ゾディアーク',
        'python': 'ピュトン',
      },
      'replaceText': {
        'Adikia': 'アディキア',
        'Algedon': 'アルゲドン',
        'Ania': 'アニア',
        'Apomnemoneumata': 'アポムネーモネウマタ',
        'Astral Eclipse': 'アストラルエクリプス',
        'Astral Flow': 'アストラルフロウ',
        'Esoteric Dyad': 'エソテリックダイアド',
        'Esoteric Pattern': '秘紋図形',
        '(?<!Triple )Esoteric Ray': 'エソテリックレイ',
        'Esoteric Sect': 'エソテリックセクト',
        'Esoterikos': 'エソーテリコス',
        '(?<!Trimorphos )Exoterikos': 'エクソーテリコス',
        'Explosion': '爆発',
        'Infernal Stream': 'インフェルノストリーム',
        'Infernal Torrent': 'インフェルノトレント',
        'Keraunos Eidolon': 'ケラノウス・エイドロン',
        'Kokytos': 'コキュートス',
        'Meteoros Eidolon': 'メテオロス・エイドロン',
        'Opheos Eidolon': 'オフェオス・エイドロン',
        'Paradeigma': 'パラデイグマ',
        'Phlegethon': 'プレゲトン',
        'Phobos': 'フォボス',
        'Styx': 'ステュクス',
        'Trimorphos Exoterikos': 'トライ・エクソーテリコス',
        'Triple Esoteric Ray': 'トライ・エソテリックレイ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Arcane Sigil': '秘纹',
        'Behemoth': '贝希摩斯',
        'Quetzalcoatl': '克察尔科亚特尔',
        'Roiling Darkness': '黑暗奔流',
        'Zodiark': '佐迪亚克',
        'python': '大蟒',
      },
      'replaceText': {
        'Adikia': '不义',
        'Algedon': '痛苦',
        'Ania': '悲伤',
        'Apomnemoneumata': '悼念',
        'Astral Eclipse': '星蚀',
        'Astral Flow': '星极超流',
        'Esoteric Dyad': '神秘二分',
        'Esoteric Pattern': '秘纹图案',
        '(?<!Triple )Esoteric Ray': '神秘光线',
        'Esoteric Sect': '神秘切割',
        'Esoterikos': '内纹',
        '(?<!Trimorphos )Exoterikos': '外纹',
        'Explosion': '爆炸',
        'Infernal Stream': '狱火奔流',
        'Infernal Torrent': '狱火洪流',
        'Keraunos Eidolon': '雷霆幻影',
        'Kokytos': '悲痛',
        'Meteoros Eidolon': '陨石幻影',
        'Opheos Eidolon': '巨蛇幻影',
        'Paradeigma': '范式',
        'Phlegethon': '冥火',
        'Phobos': '恐惧',
        'Styx': '仇恨',
        'Trimorphos Exoterikos': '三重外纹',
        'Triple Esoteric Ray': '三重神秘光线',
      },
    },
  ],
};

export default triggerSet;
