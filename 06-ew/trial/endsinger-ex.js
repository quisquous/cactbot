const echoesOutputStrings = {
  stack: Outputs.stackOnYou,
  donut: {
    en: 'Stack Donut',
    de: 'Sammeln Donut',
    fr: 'Packez-vous, donut',
    ja: '頭割り',
    cn: '集合放月环',
    ko: '도넛 장판, 쉐어',
  },
  spread: Outputs.spread,
  flare: {
    en: 'Flare',
    de: 'Flare',
    fr: 'Brasier',
    ja: 'フレア',
    cn: '核爆',
    ko: '플레어',
  },
};
const headDir = {
  ne: 1,
  se: 3,
  sw: 5,
  nw: 7,
  none: 0,
};
const orbOutputStrings = {
  ne: Outputs.dirNE,
  nw: Outputs.dirNW,
  se: Outputs.dirSE,
  sw: Outputs.dirSW,
  n: Outputs.dirN,
  e: Outputs.dirE,
  s: Outputs.dirS,
  w: Outputs.dirW,
  knockback: {
    en: '${dir} Knockback',
    de: '${dir} Rückstoß',
    cn: '${dir} 击退',
    ko: '${dir} 넉백',
  },
  knockbackWithHead: {
    en: '${dir1} Knockback -> ${dir2}',
    de: '${dir1} Rückstoß -> ${dir2}',
    cn: '${dir1} 击退 -> ${dir2}',
    ko: '${dir1} 넉백 -> ${dir2}',
  },
  aoeWithHead: {
    en: 'Go ${dir1} (lean ${dir2})',
    de: 'Geh ${dir1} (nach ${dir2} bewegen)',
    cn: '去${dir1} (偏${dir2})',
    ko: '${dir1}쪽으로 (살짝 ${dir2}쪽으로)',
  },
};
const get5HeadSafeDir = (posX, posY, output) => {
  // NOTE: in both this function and the other safe dir, it's probably not possible to have the head facing
  // exactly where the knockback destination / aoe safe zone is.  For completionism, we'll add some
  // instruction but this probably can't happen.
  if (posX < 100) {
    if (posY < 100)
      return output.nw();
    return output.sw();
  }
  if (posY < 100)
    return output.ne();
  return output.se();
};
const getKBOrbSafeDir = (posX, posY, output, head8Dir) => {
  if (head8Dir === undefined || head8Dir % 2 === 0)
    head8Dir = headDir.none;
  // NOTE: in both this function and the other safe dir, it's probably not possible to have the head facing
  // exactly where the knockback destination / aoe safe zone is.  For completionism, we'll add some
  // instruction but this probably can't happen.  Additionally, since "SW", "S", and "SE" are not really
  // melee uptime friendly, try to call "W", "N", and "E" as the head safe spots.
  if (posX < 100) {
    if (posY < 100) {
      const mainDir = output.nw();
      return {
        [headDir.none]: output.knockback({ dir: mainDir }),
        [headDir.ne]: output.knockbackWithHead({ dir1: mainDir, dir2: output.s() }),
        [headDir.se]: output.knockbackWithHead({ dir1: mainDir, dir2: output.w() }),
        [headDir.sw]: output.knockbackWithHead({ dir1: mainDir, dir2: output.e() }),
        [headDir.nw]: output.knockback({ dir: mainDir }),
      }[head8Dir];
    }
    const mainDir = output.sw();
    return {
      [headDir.none]: output.knockback({ dir: mainDir }),
      [headDir.ne]: output.knockbackWithHead({ dir1: mainDir, dir2: output.w() }),
      [headDir.se]: output.knockbackWithHead({ dir1: mainDir, dir2: output.n() }),
      [headDir.sw]: output.knockback({ dir: mainDir }),
      [headDir.nw]: output.knockbackWithHead({ dir1: mainDir, dir2: output.e() }),
    }[head8Dir];
  }
  if (posY < 100) {
    const mainDir = output.ne();
    return {
      [headDir.none]: output.knockback({ dir: mainDir }),
      [headDir.ne]: output.knockback({ dir: mainDir }),
      [headDir.se]: output.knockbackWithHead({ dir1: mainDir, dir2: output.w() }),
      [headDir.sw]: output.knockbackWithHead({ dir1: mainDir, dir2: output.e() }),
      [headDir.nw]: output.knockbackWithHead({ dir1: mainDir, dir2: output.s() }),
    }[head8Dir];
  }
  const mainDir = output.se();
  return {
    [headDir.none]: output.knockback({ dir: mainDir }),
    [headDir.ne]: output.knockbackWithHead({ dir1: mainDir, dir2: output.w() }),
    [headDir.se]: output.knockback({ dir: mainDir }),
    [headDir.sw]: output.knockbackWithHead({ dir1: mainDir, dir2: output.n() }),
    [headDir.nw]: output.knockbackWithHead({ dir1: mainDir, dir2: output.e() }),
  }[head8Dir];
};
const getAoEOrbSafeDir = (posX, posY, output, head8Dir) => {
  if (head8Dir === undefined || head8Dir % 2 === 0)
    head8Dir = headDir.none;
  if (posX < 100) {
    if (posY < 100) {
      const mainDir = output.se();
      return {
        [headDir.none]: mainDir,
        [headDir.ne]: output.aoeWithHead({ dir1: mainDir, dir2: output.s() }),
        [headDir.se]: output.aoeWithHead({ dir1: mainDir, dir2: output.w() }),
        [headDir.sw]: output.aoeWithHead({ dir1: mainDir, dir2: output.e() }),
        [headDir.nw]: mainDir,
      }[head8Dir];
    }
    const mainDir = output.ne();
    return {
      [headDir.none]: mainDir,
      [headDir.ne]: output.aoeWithHead({ dir1: mainDir, dir2: output.w() }),
      [headDir.se]: output.aoeWithHead({ dir1: mainDir, dir2: output.n() }),
      [headDir.sw]: mainDir,
      [headDir.nw]: output.aoeWithHead({ dir1: mainDir, dir2: output.e() }),
    }[head8Dir];
  }
  if (posY < 100) {
    const mainDir = output.sw();
    return {
      [headDir.none]: mainDir,
      [headDir.ne]: mainDir,
      [headDir.se]: output.aoeWithHead({ dir1: mainDir, dir2: output.w() }),
      [headDir.sw]: output.aoeWithHead({ dir1: mainDir, dir2: output.e() }),
      [headDir.nw]: output.aoeWithHead({ dir1: mainDir, dir2: output.s() }),
    }[head8Dir];
  }
  const mainDir = output.nw();
  return {
    [headDir.none]: mainDir,
    [headDir.ne]: output.aoeWithHead({ dir1: mainDir, dir2: output.w() }),
    [headDir.se]: mainDir,
    [headDir.sw]: output.aoeWithHead({ dir1: mainDir, dir2: output.n() }),
    [headDir.nw]: output.aoeWithHead({ dir1: mainDir, dir2: output.e() }),
  }[head8Dir];
};
const getStarPositionFromHeading = (heading) => {
  const dir = Directions.hdgTo8DirNum(parseFloat(heading));
  return {
    1: [114, 86],
    3: [114, 114],
    5: [86, 114],
    7: [86, 86], //  NW
  }[dir] ?? [];
};
const getStarText = (head8Dir, matches, output) => {
  let posX;
  let posY;
  // Some 6FFA/6FFB (single) stars are at the correct position with no heading, others are center with a heading.
  // Of the 122 single star lines, I have:
  // 31 lines that are middle with a heading
  // 91 lines that are correct position, heading = 0
  // All other stars are center with a heading. This holds true for all 294 log lines I have for this event.
  if (Math.round(parseFloat(matches.heading)) !== 0) {
    [posX, posY] = getStarPositionFromHeading(matches.heading);
  } else {
    posX = parseFloat(matches.x);
    posY = parseFloat(matches.y);
  }
  if (posX === undefined || posY === undefined) {
    console.error(
      `EndsingerEx getStarText: Could not resolve star position from heading ${
        JSON.stringify(matches)
      }`,
    );
    return;
  }
  if (['6FF9', '6FFB', '7000', '7001'].includes(matches.id))
    return getKBOrbSafeDir(posX, posY, output, head8Dir);
  if (['6FF8', '6FFA', '6FFE', '6FFF'].includes(matches.id))
    return getAoEOrbSafeDir(posX, posY, output, head8Dir);
  console.error(`EndsingerEx getStarText: Could not match ability ID ${matches.id} to color`);
  return;
};
const elenchosComboMap = {
  1: 'towers',
  2: 'solo',
  3: 'stacks',
  4: 'solo',
  5: 'solo',
  6: 'towers',
  7: 'stacks',
  8: 'solo',
};
Options.Triggers.push({
  id: 'TheMinstrelsBalladEndsingersAria',
  zoneId: ZoneId.TheMinstrelsBalladEndsingersAria,
  timelineFile: 'endsinger-ex.txt',
  initData: () => {
    return {
      combatantData: [],
      starMechanicCounter: 0,
      storedStars: {},
      storedHeads: {},
      rewindHeads: {},
      storedMechs: {
        counter: 1,
      },
      elenchosCount: 0,
    };
  },
  triggers: [
    // Fire this trigger on ability since actual damage is 5s after cast bar finishes
    {
      id: 'EndsingerEx Elegeia',
      type: 'Ability',
      netRegex: { id: '6FF6', source: 'The Endsinger', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'EndsingerEx Telos',
      type: 'StartsUsing',
      netRegex: { id: '702E', source: 'The Endsinger', capture: false },
      response: Responses.bigAoe(),
    },
    {
      id: 'EndsingerEx Telomania',
      // This is a long series of small aoes and one big aoe with bleed.
      // The big aoe is ~10s after the ability goes off so delay call here.
      type: 'Ability',
      netRegex: { id: '72C3', source: 'The Endsinger', capture: false },
      response: Responses.bleedAoe(),
    },
    {
      id: 'EndsingerEx Elenchos Middle',
      type: 'StartsUsing',
      netRegex: { id: '7022', source: 'The Endsinger', capture: false },
      preRun: (data) => data.elenchosCount++,
      durationSeconds: 5,
      alertText: (data, _matches, output) => {
        const combo = elenchosComboMap[data.elenchosCount];
        if (combo === undefined || combo === 'solo')
          return output.sides();
        if (combo === 'towers')
          return output.sidesWithTower();
        return output.sidesWithStacks();
      },
      outputStrings: {
        sides: {
          en: 'Out (Sides)',
          de: 'Raus (Seiten)',
          cn: '去外面 (两边)',
          ko: '밖으로 (양 옆)',
        },
        sidesWithTower: {
          en: 'Tower + Outside',
          de: 'Turm + Außerhalb',
          cn: '踩塔 + 去外面',
          ko: '기둥 + 양 옆',
        },
        sidesWithStacks: {
          en: 'Outside + Healer Groups',
          de: 'Außerhalb + Heiler-Gruppen',
          cn: '去外面 + 治疗分组分摊',
          ko: '양 옆 + 힐러 그룹',
        },
      },
    },
    {
      id: 'EndsingerEx Elenchos Outsides',
      type: 'StartsUsing',
      netRegex: { id: '7020', source: 'The Endsinger', capture: false },
      preRun: (data) => data.elenchosCount++,
      durationSeconds: 5,
      alertText: (data, _matches, output) => {
        const combo = elenchosComboMap[data.elenchosCount];
        if (combo === undefined || combo === 'solo')
          return output.middle();
        if (combo === 'towers')
          return output.middleWithTower();
        return output.middleWithStacks();
      },
      outputStrings: {
        middle: {
          en: 'Inside (Middle)',
          de: 'Innen (Mitte)',
          cn: '去里面 (中间)',
          ko: '안으로 (가운데)',
        },
        middleWithTower: {
          en: 'Tower + Inside',
          de: 'Turm + Innen',
          cn: '踩塔 + 去里面',
          ko: '기둥 + 안으로',
        },
        middleWithStacks: {
          en: 'Inside + Healer Groups',
          de: 'Innen + Heiler-Gruppen',
          cn: '去里面 + 治疗分组分摊',
          ko: '안으로 + 힐러 그룹',
        },
      },
    },
    {
      id: 'EndsingerEx Hubris',
      type: 'StartsUsing',
      netRegex: { id: '702C', source: 'The Endsinger', capture: true },
      response: Responses.tankCleave('alert'),
    },
    {
      id: 'EndsingerEx Diairesis Head Spawn',
      type: 'GainsEffect',
      // This appears to happen ~6s before cast starts.
      // It is also the same id the whole fight, so don't bother resetting.
      netRegex: { effectId: '891', count: '187', capture: true },
      run: (data, matches) => data.diairesisId = matches.targetId,
    },
    {
      id: 'EndsingerEx Single Star',
      type: 'StartsUsing',
      // Each single star is also paired with a head in the middle doing a 180 cleave in some direction.
      // The head is already in place by the time this cast starts.
      netRegex: { id: ['6FFA', '6FFB'] },
      durationSeconds: 6,
      promise: async (data) => {
        data.combatantData = [];
        if (data.diairesisId === undefined)
          return;
        const decimalIds = [data.diairesisId].map((x) => parseInt(x, 16));
        data.combatantData = (await callOverlayHandler({
          call: 'getCombatants',
          ids: decimalIds,
        })).combatants;
      },
      alertText: (data, matches, output) => {
        const simpleOutput = getStarText(undefined, matches, output);
        const [head] = data.combatantData;
        if (data.combatantData.length !== 1 || head === undefined)
          return simpleOutput;
        // Head should be facing intercardinalish.
        const rawHead8Dir = Directions.hdgTo8DirNum(head.Heading);
        const head8Dir = rawHead8Dir % 2 === 0 ? undefined : rawHead8Dir;
        return getStarText(head8Dir, matches, output);
      },
      outputStrings: orbOutputStrings,
    },
    {
      id: 'EndsingerEx Grip of Despair Cast',
      type: 'StartsUsing',
      netRegex: { id: '701D', source: 'The Endsinger', capture: false },
      response: Responses.stackMiddle(),
    },
    {
      id: 'EndsingerEx Grip of Despair Chains',
      type: 'GainsEffect',
      netRegex: { effectId: 'BB1' },
      condition: Conditions.targetIsYou(),
      response: Responses.breakChains('alert'),
    },
    {
      id: 'EndsingerEx Eironeia',
      type: 'StartsUsing',
      netRegex: { id: ['702F', '7030'], source: 'The Endsinger', capture: false },
      suppressSeconds: 4,
      infoText: (data, _matches, output) => {
        // This is combined with the Elenchos call so suppress here.
        const combo = elenchosComboMap[data.elenchosCount];
        if (combo === 'stacks')
          return;
        return output.groups();
      },
      outputStrings: {
        groups: {
          en: 'Healer Groups',
          de: 'Heiler-Gruppen',
          fr: 'Groupes sur les heals',
          ja: 'ヒラに頭割り',
          cn: '治疗分组分摊',
          ko: '힐러 그룹 쉐어',
        },
      },
    },
    {
      id: 'EndsingerEx Star Order Resolver',
      type: 'Ability',
      netRegex: { id: ['6FFE', '6FFF', '7000', '7001'] },
      delaySeconds: (data, matches) => {
        ++data.starMechanicCounter;
        switch (matches.id) {
          case '6FFE':
          case '7000':
            return 0;
          case '6FFF':
          case '7001':
            return 6.5;
        }
        return 0;
      },
      alertText: (_data, matches, output) => getStarText(undefined, matches, output),
      outputStrings: orbOutputStrings,
    },
    {
      id: 'EndsingerEx Star Cleanup',
      type: 'Ability',
      netRegex: { id: ['6FFE', '6FFF', '7000', '7001'], capture: false },
      delaySeconds: 30,
      run: (data) => {
        data.starMechanicCounter = 0;
      },
    },
    {
      id: 'EndsingerEx Head Phase Detector',
      type: 'Ability',
      netRegex: { id: ['7007', '72B1'] },
      run: (data, matches) => {
        switch (matches.id) {
          case '7007':
            data.headPhase = 5;
            break;
          case '72B1':
            data.headPhase = 6;
            break;
        }
      },
    },
    {
      id: 'EndsingerEx Head Phase Cleanup',
      type: 'Ability',
      netRegex: { id: ['7007', '72B1'], capture: false },
      delaySeconds: 50,
      run: (data) => {
        data.headPhase = undefined;
      },
    },
    {
      id: 'EndsingerEx 5Head Initial Direction',
      type: 'GainsEffect',
      netRegex: { effectId: '891', capture: true },
      condition: (data) => data.headPhase === 5,
      delaySeconds: 0.5,
      promise: async (data, matches) => {
        const headData = await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.targetId, 16)],
        });
        if (headData.combatants.length !== 1) {
          console.error(`5Head Initial Direction: null data`);
          return;
        }
        for (const head of headData.combatants) {
          const headId = head.ID?.toString(16).toUpperCase();
          if (headId === undefined) {
            console.error(`5Head Initial Direction: invalid head ID`);
            continue;
          }
          data.storedHeads[headId] = { state: head, mechanics: [] };
        }
      },
      infoText: (data, matches, output) => {
        const headCombatant = data.storedHeads[matches.targetId];
        if (!headCombatant) {
          console.error(`5Head Collector: null data`);
          return;
        }
        // Snap heading to closest card and add 2 for opposite direction
        // N = 0, E = 1, S = 2, W = 3
        const cardinal = (Directions.hdgTo4DirNum(headCombatant.state.Heading) + 2) % 4;
        const dirs = {
          0: output.north(),
          1: output.east(),
          2: output.south(),
          3: output.west(),
        };
        return dirs[cardinal];
      },
      outputStrings: {
        unknown: Outputs.unknown,
        north: Outputs.north,
        east: Outputs.east,
        south: Outputs.south,
        west: Outputs.west,
      },
    },
    {
      id: 'EndsingerEx 5Head Mechanics Collector',
      type: 'StartsUsing',
      netRegex: { id: ['6FFC', '7006', '7009', '700A'], source: 'The Endsinger', capture: true },
      condition: (data) => data.headPhase === 5,
      // Do not need delaySeconds here, heads have been spawned for 5+ seconds
      promise: async (data, matches) => {
        // Early out if we already have this head
        if (data.storedHeads[matches.targetId])
          return;
        const headData = await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.targetId, 16)],
        });
        if (headData.combatants.length !== 1) {
          console.error(`5Head Mechanics Collector: null data`);
          return;
        }
        for (const head of headData.combatants) {
          const headId = head.ID?.toString(16).toUpperCase();
          if (headId === undefined) {
            console.error(`5Head Mechanics Collector: invalid head ID`);
            continue;
          }
          data.storedHeads[headId] = { state: head, mechanics: [] };
        }
      },
      infoText: (data, matches, output) => {
        const head = data.storedHeads[matches.sourceId];
        if (!head) {
          console.error(`5Head Mechanics Collector: null data/missing head`);
          return;
        }
        if (matches.id === '7009') {
          head.mechanics.push('aoe');
        } else if (matches.id === '700A') {
          head.mechanics.push('donut');
        } else {
          // Snap heading to closest card and add 2 for opposite direction
          const cardinal = (Directions.hdgTo4DirNum(parseFloat(matches.heading)) + 2) % 4;
          const safeDir = {
            0: 'safeN',
            1: 'safeE',
            2: 'safeS',
            3: 'safeW',
          };
          head.mechanics.push(safeDir[cardinal] ?? 'unknown');
        }
        // If we have the same count of mechanics stored for all 5 heads, resolve safe spot
        const heads = Object.values(data.storedHeads);
        if (
          heads.length ===
            heads.filter((h) => h.mechanics.length === head.mechanics.length).length &&
          heads.length === 5
        ) {
          const lastMechanic = head.mechanics.length - 1;
          const safeDirHead = heads.find((h) => h.mechanics[0]?.includes('safe'));
          const [donutHead1, donutHead2] = heads.filter((h) =>
            h.mechanics[lastMechanic] === 'donut'
          );
          if (!safeDirHead || !donutHead1 || !donutHead2) {
            console.error(`5Head Mechanics Collector: Missing safe/donut head`);
            return;
          }
          switch (safeDirHead.mechanics[lastMechanic]) {
            case 'safeN':
              if (donutHead1.state.PosY < 100)
                return get5HeadSafeDir(donutHead1.state.PosX, donutHead1.state.PosY, output);
              return get5HeadSafeDir(donutHead2.state.PosX, donutHead2.state.PosY, output);
            case 'safeE':
              if (donutHead1.state.PosX > 100)
                return get5HeadSafeDir(donutHead1.state.PosX, donutHead1.state.PosY, output);
              return get5HeadSafeDir(donutHead2.state.PosX, donutHead2.state.PosY, output);
            case 'safeS':
              if (donutHead1.state.PosY > 100)
                return get5HeadSafeDir(donutHead1.state.PosX, donutHead1.state.PosY, output);
              return get5HeadSafeDir(donutHead2.state.PosX, donutHead2.state.PosY, output);
            case 'safeW':
              if (donutHead1.state.PosX < 100)
                return get5HeadSafeDir(donutHead1.state.PosX, donutHead1.state.PosY, output);
              return get5HeadSafeDir(donutHead2.state.PosX, donutHead2.state.PosY, output);
          }
        }
      },
      outputStrings: orbOutputStrings,
    },
    {
      id: 'EndsingerEx 5Head Mechanics Rewind Collector',
      type: 'GainsEffect',
      netRegex: { effectId: '808', target: 'The Endsinger', capture: true },
      condition: (data) => data.headPhase === 5,
      durationSeconds: 5,
      alertText: (data, matches, output) => {
        const head = data.storedHeads[matches.targetId];
        if (!head) {
          console.error(`5Head Mechanics Rewind Collector: null data`);
          return;
        }
        const mechanicIndex = {
          '178': 2,
          '179': 1,
          '17A': 0,
        }[matches.count];
        const mechanic = head.mechanics[mechanicIndex ?? 0];
        if (mechanicIndex === undefined || !mechanic) {
          console.error(`5Head Mechanics Rewind Collector: no mapping for buff count`);
          return;
        }
        data.rewindHeads[matches.targetId] = {
          state: head.state,
          mechanic: mechanic,
        };
        // If we have all 5 heads accounted for, resolve safe spot
        const heads = Object.values(data.rewindHeads);
        if (heads.length === 5) {
          const safeDirHead = heads.find((h) => h.mechanic.includes('safe'));
          const donutHeads = heads.filter((h) => h.mechanic === 'donut');
          // Clean up here for next iteration
          data.storedHeads = {};
          data.rewindHeads = {};
          if (!safeDirHead || donutHeads.length < 1) {
            console.error(`5Head Mechanics Rewind Collector: missing required head`);
            return;
          }
          let safeDonut;
          switch (safeDirHead.mechanic) {
            case 'safeN':
              safeDonut = donutHeads.find((head) => head.state.PosY < 100);
              break;
            case 'safeE':
              safeDonut = donutHeads.find((head) => head.state.PosX > 100);
              break;
            case 'safeS':
              safeDonut = donutHeads.find((head) => head.state.PosY > 100);
              break;
            case 'safeW':
              safeDonut = donutHeads.find((head) => head.state.PosX < 100);
              break;
          }
          if (!safeDonut) {
            console.error(`5Head Mechanics Rewind Collector: no safe donut found`);
            return;
          }
          return get5HeadSafeDir(safeDonut.state.PosX, safeDonut.state.PosY, output);
        }
      },
      outputStrings: orbOutputStrings,
    },
    {
      id: 'EndsingerEx 6 Head Collector',
      type: 'Tether',
      netRegex: { id: ['00BD', '00B5'], target: 'The Endsinger', capture: true },
      condition: (data) => data.headPhase === 6,
      delaySeconds: 0.5,
      promise: async (data, matches) => {
        const headData = await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.sourceId, 16)],
        });
        const headCombatant = headData.combatants[0];
        if (!headCombatant) {
          console.error(`6 Head Collector: null data`);
          return;
        }
        data.storedHeads[matches.sourceId] = { state: headCombatant, mechanics: [] };
      },
      infoText: (data, _matches, output) => {
        const heads = Object.values(data.storedHeads);
        if (heads.length === 4) {
          data.storedHeads = {};
          let headPositions = ['e', 'ne', 'nw', 'w', 'se', 'sw'];
          for (const head of heads) {
            let dir = '';
            if (head.state.PosY < 100)
              dir = 'n';
            else if (head.state.PosY > 100)
              dir = 's';
            if (head.state.PosX < 100)
              dir += 'w';
            else
              dir += 'e';
            headPositions = headPositions.filter((pos) => pos !== dir);
          }
          const dir1 = headPositions[0];
          const dir2 = headPositions[1];
          if (dir1 === undefined || dir2 === undefined) {
            console.error(`6 Head Collector: expected 2 safe heads`);
            return;
          }
          return output.text({
            dir1: output[dir1](),
            dir2: output[dir2](),
          });
        }
      },
      outputStrings: {
        e: Outputs.dirE,
        w: Outputs.dirW,
        nw: Outputs.dirNW,
        ne: Outputs.dirNE,
        sw: Outputs.dirSW,
        se: Outputs.dirSE,
        text: {
          en: '${dir1} / ${dir2}',
          de: '${dir1} / ${dir2}',
          fr: '${dir1} / ${dir2}',
          ja: '${dir1} / ${dir2}',
          cn: '${dir1} / ${dir2}',
          ko: '${dir1} / ${dir2}',
        },
      },
    },
    {
      id: 'EndsingerEx Echoes of Benevolence',
      type: 'GainsEffect',
      netRegex: { effectId: 'BB0' },
      condition: Conditions.targetIsYou(),
      suppressSeconds: 60,
      infoText: (data, _matches, output) => {
        data.storedMechs[data.storedMechs.counter] = 'stack';
        data.storedMechs.counter++;
        return output.stack();
      },
      outputStrings: {
        stack: echoesOutputStrings.stack,
      },
    },
    {
      id: 'EndsingerEx Echoes of Nausea',
      type: 'GainsEffect',
      netRegex: { effectId: 'BAD' },
      condition: Conditions.targetIsYou(),
      suppressSeconds: 60,
      infoText: (data, _matches, output) => {
        data.storedMechs[data.storedMechs.counter] = 'donut';
        data.storedMechs.counter++;
        return output.donut();
      },
      outputStrings: {
        donut: echoesOutputStrings.donut,
      },
    },
    {
      id: 'EndsingerEx Echoes of the Future',
      type: 'GainsEffect',
      netRegex: { effectId: 'BAF' },
      condition: Conditions.targetIsYou(),
      suppressSeconds: 60,
      infoText: (data, _matches, output) => {
        data.storedMechs[data.storedMechs.counter] = 'flare';
        data.storedMechs.counter++;
        return output.flare();
      },
      outputStrings: {
        flare: echoesOutputStrings.flare,
      },
    },
    {
      id: 'EndsingerEx Echoes of Befoulment',
      type: 'GainsEffect',
      netRegex: { effectId: 'BAE' },
      condition: Conditions.targetIsYou(),
      suppressSeconds: 60,
      infoText: (data, _matches, output) => {
        data.storedMechs[data.storedMechs.counter] = 'spread';
        data.storedMechs.counter++;
        return output.spread();
      },
      outputStrings: {
        spread: echoesOutputStrings.spread,
      },
    },
    {
      id: 'EndsingerEx Echoes Rewind',
      type: 'GainsEffect',
      netRegex: { effectId: '95D' },
      condition: Conditions.targetIsYou(),
      infoText: (data, matches, output) => {
        const mechanicIndex = {
          '17C': 3,
          '17D': 2,
          '17E': 1,
        }[matches.count];
        const mechanic = data.storedMechs[mechanicIndex ?? 1];
        if (mechanicIndex === undefined || !mechanic) {
          console.error(`5Head Mechanics Rewind Collector: no mapping for buff count`);
          return;
        }
        return output[mechanic]();
      },
      outputStrings: echoesOutputStrings,
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
        'Ultimate Fate': 'Ultimatives Schicksal',
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
    {
      'locale': 'cn',
      'replaceSync': {
        'Azure Star': '蓝色天体',
        'Fiery Star': '红色天体',
        'The Endsinger': '讴歌终结之物',
      },
      'replaceText': {
        'Befoulment': '脓液弹',
        'Benevolence': '博爱',
        'Despair Unforgotten': '绝望侵蚀：记录事件',
        'Diairesis': '分离',
        'Eironeia': '反讽',
        'Elegeia Unforgotten': '哀歌：记录事件',
        'Elenchos': '反诘',
        'Endsong\'s Aporrhoia': '流溢：绝望轮唱',
        'Endsong(?!\')': '绝望轮唱',
        '(?<! )Fatalism': '宿命',
        'Grip of Despair': '绝望的锁链',
        'Hubris': '傲慢',
        'Star Collision': '天体撞击',
        'Telomania': '终末狂热',
        'Telos': '终末',
        'Tower Explosion': '塔爆炸',
        'Theological Fatalism': '神学宿命',
        'Twinsong\'s Aporrhoia': '流溢：绝望合唱',
        'Ultimate Fate': '终极命运',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Azure Star': '청색천체',
        'Fiery Star': '적색천체',
        'The Endsinger': '종언을 노래하는 자',
      },
      'replaceText': {
        '\\(big\\)': '(강)',
        '\\(cast\\)': '(시전)',
        '\\(small\\)': '(약)',
        'Befoulment': '고름탄',
        'Benevolence': '박애',
        'Despair Unforgotten': '절망 침식: 현상 기록',
        'Diairesis': '디아이레시스',
        'Eironeia': '에이로네이아',
        'Elegeia Unforgotten': '엘레게이아: 현상 기록',
        'Elenchos': '엘렝코스',
        'Endsong\'s Aporrhoia': '발출: 절망 돌림노래',
        'Endsong(?!\')': '절망 돌림노래',
        '(?<! )Fatalism': '운명론',
        'Grip of Despair': '절망의 사슬',
        'Hubris': '휴브리스',
        'Star Collision': '천체 충돌',
        'Telomania': '텔로스마니아',
        'Telos': '텔로스',
        'Tower Explosion': '기둥 폭발',
        'Theological Fatalism': '신학적 운명론',
        'Twinsong\'s Aporrhoia': '발출: 절망 합창',
        'Ultimate Fate': '종언의 운명',
      },
    },
  ],
});
