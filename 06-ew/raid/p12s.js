// TODO: north / south laser add call for first Paradeigma
// TODO: laser add call (inner west / inner east?) for second Paradeigma
// TODO: glaukopis tank swap call
// TODO: glaukopis tank swap after 2nd hit (if different person took both)
// TODO: add phase dash calls?? (maybe this is overkill)
// TODO: Superchain 2B
// TODO: final Sample safe spot
const centerX = 100;
const centerY = 100;
const distSqr = (a, b) => {
  const dX = parseFloat(a.x) - parseFloat(b.x);
  const dY = parseFloat(a.y) - parseFloat(b.y);
  return dX * dX + dY * dY;
};
const wings = {
  // vfx/lockon/eff/m0829_cst19_9s_c0v.avfx
  topLeftFirst: '01A5',
  // vfx/lockon/eff/m0829_cst20_9s_c0v.avfx
  topRightFirst: '01A6',
  // vfx/lockon/eff/m0829_cst21_6s_c0v.avfx
  middleLeftSecond: '01A7',
  // vfx/lockon/eff/m0829_cst22_6s_c0v.avfx
  middleRightSecond: '01A8',
  // vfx/lockon/eff/m0829_cst23_9s_c0v.avfx
  bottomLeftFirst: '01A9',
  // vfx/lockon/eff/m0829_cst24_9s_c0v.avfx
  bottomRightFirst: '01AA',
  // vfx/lockon/eff/m0829_cst19_3s_c0v.avfx
  topLeftThird: '01AF',
  // vfx/lockon/eff/m0829_cst20_3s_c0v.avfx
  topRightThird: '01B0',
  // vfx/lockon/eff/m0829_cst22_6s_c0v.avfx
  bottomLeftThird: '01B1',
  // vfx/lockon/eff/m0829_cst23_3s_c0v.avfx
  bottomRightThird: '01B2', // 82E5 damage
};
const superchainNpcNameId = '12377';
const superchainNpcBaseIdMap = {
  destination: '16176',
  out: '16177',
  in: '16178',
  protean: '16179',
  partners: '16180',
};
const engravementLabelMapAsConst = {
  DF8: 'lightTilt',
  DF9: 'darkTilt',
  DFB: 'lightTower',
  DFC: 'darkTower',
  DFD: 'lightBeam',
  DFE: 'darkBeam',
  DFF: 'crossMarked',
  E00: 'xMarked',
};
const engravementLabelMap = engravementLabelMapAsConst;
const engravementIdMap = Object.fromEntries(
  Object.entries(engravementLabelMap).map(([k, v]) => [v, k]),
);
const engravementBeamIds = [
  engravementIdMap.lightBeam,
  engravementIdMap.darkBeam,
];
const engravementTowerIds = [
  engravementIdMap.lightTower,
  engravementIdMap.darkTower,
];
const engravementTiltIds = [
  engravementIdMap.lightTilt,
  engravementIdMap.darkTilt,
];
const engravement3TheosSoulIds = [
  engravementIdMap.crossMarked,
  engravementIdMap.xMarked,
];
const anthroposTetherMap = {
  '00E9': 'light',
  '00EA': 'dark',
  '00FA': 'light',
  '00FB': 'dark', // adequately stretched
};
const tetherAbilityToTowerMap = {
  '82F1': 'lightTower',
  '82F2': 'darkTower',
};
const headmarkers = {
  ...wings,
  // vfx/lockon/eff/tank_laser_5sec_lockon_c0a1.avfx
  glaukopis: '01D7',
  // vfx/lockon/eff/sph_lockon2_num01_s8p.avfx (through sph_lockon2_num04_s8p)
  limitCut1: '0150',
  limitCut2: '0151',
  limitCut3: '0152',
  limitCut4: '0153',
  // vfx/lockon/eff/sph_lockon2_num05_s8t.avfx (through sph_lockon2_num08_s8t)
  limitCut5: '01B5',
  limitCut6: '01B6',
  limitCut7: '01B7',
  limitCut8: '01B8',
  // vfx/lockon/eff/tank_lockonae_0m_5s_01t.avfx
  palladianGrasp: '01D4',
  // vfx/lockon/eff/m0376trg_fire3_a0p.avfx
  chains: '0061',
};
const limitCutMap = {
  [headmarkers.limitCut1]: 1,
  [headmarkers.limitCut2]: 2,
  [headmarkers.limitCut3]: 3,
  [headmarkers.limitCut4]: 4,
  [headmarkers.limitCut5]: 5,
  [headmarkers.limitCut6]: 6,
  [headmarkers.limitCut7]: 7,
  [headmarkers.limitCut8]: 8,
};
const limitCutIds = Object.keys(limitCutMap);
const wingIds = Object.values(wings);
const superchainNpcBaseIds = Object.values(superchainNpcBaseIdMap);
const pangenesisEffects = {
  stableSystem: 'E22',
  unstableFactor: 'E09',
  lightTilt: 'DF8',
  darkTilt: 'DF9',
};
const pangenesisEffectIds = Object.values(pangenesisEffects);
const getHeadmarkerId = (data, matches) => {
  if (data.decOffset === undefined) {
    if (data.expectedFirstHeadmarker === undefined) {
      console.error('missing expected first headmarker');
      return 'OOPS';
    }
    data.decOffset = parseInt(matches.id, 16) - parseInt(data.expectedFirstHeadmarker, 16);
  }
  return (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase().padStart(4, '0');
};
Options.Triggers.push({
  id: 'AnabaseiosTheTwelfthCircleSavage',
  zoneId: ZoneId.AnabaseiosTheTwelfthCircleSavage,
  timelineFile: 'p12s.txt',
  initData: () => {
    return {
      isDoorBoss: true,
      engravementCounter: 0,
      engravement1Towers: [],
      engravement3TowerPlayers: [],
      engravement3TetherPlayers: {},
      wingCollect: [],
      wingCalls: [],
      superchainCollect: [],
      whiteFlameCounter: 0,
      pangenesisRole: {},
      pangenesisTowerCount: 0,
    };
  },
  triggers: [
    {
      id: 'P12S Phase Tracker 1',
      type: 'StartsUsing',
      netRegex: { id: ['82DA', '82F5', '86FA', '86FB'], source: 'Athena' },
      run: (data, matches) => {
        data.whiteFlameCounter = 0;
        data.superchainCollect = [];
        const phaseMap = {
          '82DA': 'superchain1',
          '82F5': 'palladion',
          '86FA': 'superchain2a',
          '86FB': 'superchain2b',
        };
        data.phase = phaseMap[matches.id];
      },
    },
    {
      id: 'P12S Phase Tracker 2',
      type: 'StartsUsing',
      // 8682 = Ultima cast
      netRegex: { id: '8682', source: 'Pallas Athena', capture: false },
      run: (data) => {
        data.isDoorBoss = false;
        data.expectedFirstHeadmarker = headmarkers.palladianGrasp;
      },
    },
    {
      id: 'P12S Door Boss Headmarker Tracker',
      type: 'StartsUsing',
      netRegex: { id: ['82E7', '82E8'], source: 'Athena' },
      suppressSeconds: 99999,
      run: (data, matches) => {
        // The first headmarker in the door boss is EITHER the bottom left or bottom right wing.
        const isBottomLeft = matches.id === '82E8';
        const first = isBottomLeft ? headmarkers.bottomLeftFirst : headmarkers.bottomRightFirst;
        data.expectedFirstHeadmarker = first;
      },
    },
    // --------------------- Phase 1 ------------------------
    {
      id: 'P12S On the Soul',
      type: 'StartsUsing',
      netRegex: { id: '8304', source: 'Athena', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'P12S First Wing',
      type: 'StartsUsing',
      netRegex: { id: ['82E7', '82E8', '82E1', '82E2'], source: 'Athena' },
      durationSeconds: 7,
      alertText: (data, matches, output) => {
        data.wingCollect = [];
        data.wingCalls = [];
        const isLeftAttack = matches.id === '82E8' || matches.id === '82E2';
        // Normal wings.
        const firstDir = data.superchain2aFirstDir;
        const secondDir = data.superchain2aSecondDir;
        if (data.phase !== 'superchain2a' || firstDir === undefined || secondDir === undefined)
          return isLeftAttack ? output.right() : output.left();
        if (isLeftAttack) {
          if (firstDir === 'north') {
            if (secondDir === 'north')
              return output.superchain2aRightNorthNorth();
            return output.superchain2aRightNorthSouth();
          }
          if (secondDir === 'north')
            return output.superchain2aRightSouthNorth();
          return output.superchain2aRightSouthSouth();
        }
        if (firstDir === 'north') {
          if (secondDir === 'north')
            return output.superchain2aLeftNorthNorth();
          return output.superchain2aLeftNorthSouth();
        }
        if (secondDir === 'north')
          return output.superchain2aLeftSouthNorth();
        return output.superchain2aLeftSouthSouth();
      },
      outputStrings: {
        left: Outputs.left,
        right: Outputs.right,
        // This could *also* say partners, but it's always partners and that feels like
        // too much information.  The "after" call could be in an info text or something,
        // but the wings are also calling out info text too.  This is a compromise.
        // Sorry also for spelling this out so explicitly, but I suspect some people
        // might want different left/right calls based on North/South boss facing
        // and it's nice to have a "go through" or "go back" description too.
        superchain2aLeftNorthNorth: {
          en: 'North + Her Left (then back North)',
          de: 'Norden + Links von Ihr (dannach Norden)',
          cn: '北 + Boss左侧 (稍后 回到北)',
          ko: '북쪽 + 보스 왼쪽 (그리고 다시 북쪽)',
        },
        superchain2aLeftNorthSouth: {
          en: 'North + Her Left (then go South)',
          de: 'Norden + Links von Ihr (dannach Süden)',
          cn: '北 + Boss左侧 (稍后 去南)',
          ko: '북쪽 + 보스 왼쪽 (그리고 남쪽으로)',
        },
        superchain2aLeftSouthNorth: {
          en: 'South + Left (then go North)',
          de: 'Süden + Links (dannach Norden)',
          cn: '南 + 左 (稍后 去北)',
          ko: '남쪽 + 왼쪽 (그리고 북쪽으로)',
        },
        superchain2aLeftSouthSouth: {
          en: 'South + Left (then back South)',
          de: 'Süden + Links (dannach Süden)',
          cn: '南 + 左 (稍后 回到南)',
          ko: '남쪽 + 왼쪽 (그리고 다시 남쪽)',
        },
        superchain2aRightNorthNorth: {
          en: 'North + Her Right (then back North)',
          de: 'Norden + Rechts von Ihr (dannach Norden)',
          cn: '北 + Boss右侧 (稍后 回到北)',
          ko: '북쪽 + 보스 오른쪽 (그리고 다시 북쪽)',
        },
        superchain2aRightNorthSouth: {
          en: 'North + Her Right (then go South)',
          de: 'Norden + Rechts von Ihr (dannach Süden)',
          cn: '北 + Boss右侧 (稍后 去南)',
          ko: '북쪽 + 보스 오른쪽 (그리고 남쪽으로)',
        },
        superchain2aRightSouthNorth: {
          en: 'South + Right (then go North)',
          de: 'Süden + Rechts (dannach Norden)',
          cn: '南 + 右 (稍后 去北)',
          ko: '남쪽 + 오른쪽 (그리고 북쪽으로)',
        },
        superchain2aRightSouthSouth: {
          en: 'South + Right (then back South)',
          de: 'Süden + Rechts (dannach Süden)',
          cn: '南 + 右 (稍后 回到南)',
          ko: '남쪽 + 오른쪽 (그리고 다시 남쪽)',
        },
      },
    },
    {
      id: 'P12S Wing Collect',
      type: 'HeadMarker',
      netRegex: {},
      condition: (data, matches) => {
        const id = getHeadmarkerId(data, matches);
        if (!wingIds.includes(id))
          return false;
        data.wingCollect.push(id);
        return true;
      },
      delaySeconds: (data) => data.decOffset === undefined ? 1 : 0,
      durationSeconds: (data) => data.wingCollect.length === 3 ? 7 : 2,
      infoText: (data, _matches, output) => {
        if (data.wingCollect.length !== 3 && data.wingCollect.length !== 2)
          return;
        const [first, second, third] = data.wingCollect;
        if (first === undefined || second === undefined)
          return;
        const isFirstLeft = first === wings.topLeftFirst || first === wings.bottomLeftFirst;
        const isSecondLeft = second === wings.middleLeftSecond;
        const isThirdLeft = third === wings.topLeftThird || third === wings.bottomLeftThird;
        const firstStr = isFirstLeft ? output.right() : output.left();
        const isFirstTop = first === wings.topLeftFirst || first === wings.topRightFirst;
        let secondCall;
        let thirdCall;
        if (isFirstTop) {
          secondCall = isFirstLeft === isSecondLeft ? 'stay' : 'swap';
          thirdCall = isSecondLeft === isThirdLeft ? 'stay' : 'swap';
        } else {
          secondCall = isFirstLeft === isSecondLeft ? 'swap' : 'stay';
          thirdCall = isSecondLeft === isThirdLeft ? 'swap' : 'stay';
        }
        data.wingCalls = [secondCall, thirdCall];
        // This is the second call only.
        if (third === undefined) {
          if (secondCall === 'stay')
            return output.secondWingCallStay();
          return output.secondWingCallSwap();
        }
        return output.allThreeWings({
          first: firstStr,
          second: output[secondCall](),
          third: output[thirdCall](),
        });
      },
      outputStrings: {
        left: Outputs.left,
        right: Outputs.right,
        swap: {
          en: 'Swap',
          de: 'Wechseln',
          fr: 'Swap',
          cn: '穿',
          ko: '이동',
        },
        stay: {
          en: 'Stay',
          de: 'bleib Stehen',
          fr: 'Restez',
          cn: '停',
          ko: '가만히',
        },
        secondWingCallStay: {
          en: '(stay)',
          de: '(bleib Stehen)',
          fr: '(restez)',
          cn: '(停)',
          ko: '(가만히)',
        },
        secondWingCallSwap: {
          en: '(swap)',
          de: '(Wechseln)',
          fr: '(swap)',
          cn: '(穿)',
          ko: '(이동)',
        },
        allThreeWings: {
          en: '${first} => ${second} => ${third}',
          de: '${first} => ${second} => ${third}',
          fr: '${first} => ${second} => ${third}',
          cn: '${first} => ${second} => ${third}',
          ko: '${first} => ${second} => ${third}',
        },
      },
    },
    {
      id: 'P12S Wing Followup',
      type: 'Ability',
      netRegex: {
        id: ['82E1', '82E2', '82E3', '82E4', '82E7', '82E8', '82E9', '82EA'],
        source: 'Athena',
        capture: false,
      },
      // These are exactly 3 apart, so give them some room to disappear and not stack up.
      durationSeconds: 2.5,
      suppressSeconds: 1,
      alertText: (data, _matches, output) => {
        const call = data.wingCalls.shift();
        if (call === undefined)
          return;
        // Check if a normal wing call, not during Superchain IIA.
        const firstDir = data.superchain2aFirstDir;
        const secondDir = data.superchain2aSecondDir;
        const secondMech = data.superchain2aSecondMech;
        if (
          data.phase !== 'superchain2a' || firstDir === undefined || secondDir === undefined ||
          secondMech === undefined
        ) {
          if (call === 'swap')
            return output.swap();
          return output.stay();
        }
        // Second wing call (when middle) during Superchain IIA.
        const isSecondWing = data.wingCalls.length === 1;
        const finalDir = secondDir === 'north' ? output.north() : output.south();
        if (isSecondWing) {
          const isReturnBack = firstDir === secondDir;
          if (call === 'swap') {
            if (isReturnBack)
              return output.superchain2aSwapMidBack({ dir: finalDir });
            return output.superchain2aSwapMidGo({ dir: finalDir });
          }
          if (isReturnBack)
            return output.superchain2aStayMidBack({ dir: finalDir });
          return output.superchain2aStayMidGo({ dir: finalDir });
        }
        // Third wing call (when at final destination).
        const isProtean = secondMech === 'protean';
        if (call === 'swap') {
          if (isProtean)
            return output.superchain2aSwapProtean({ dir: finalDir });
          return output.superchain2aSwapPartners({ dir: finalDir });
        }
        if (isProtean)
          return output.superchain2aStayProtean({ dir: finalDir });
        return output.superchain2aStayPartners({ dir: finalDir });
      },
      outputStrings: {
        swap: {
          en: 'Swap',
          de: 'Wechseln',
          fr: 'Swap',
          cn: '穿',
          ko: '이동',
        },
        stay: {
          en: 'Stay',
          de: 'bleib Stehen',
          fr: 'Restez',
          cn: '停',
          ko: '가만히',
        },
        superchain2aSwapMidBack: {
          en: 'Swap + Mid => Back ${dir}',
          de: 'Wechseln + Mitte => Zurück nach ${dir}',
          cn: '穿 + 去中间 => 回到 ${dir}',
          ko: '이동 + 가운데 => 다시 ${dir}',
        },
        superchain2aSwapMidGo: {
          en: 'Swap + Mid => Go ${dir}',
          de: 'Wechseln + Mitte => Geh nach ${dir}',
          cn: '穿 + 去中间 => 去 ${dir}',
          ko: '이동 + 가운데 => ${dir}으로',
        },
        superchain2aStayMidBack: {
          en: 'Stay + Mid => Back ${dir}',
          de: 'Bleib stehen + Mitte => Zurück nach ${dir}',
          cn: '停 + 去中间 => 回到 ${dir}',
          ko: '가만히 + 가운데 => 다시 ${dir}',
        },
        superchain2aStayMidGo: {
          en: 'Stay + Mid => Go ${dir}',
          de: 'Bleib stehen + Mitte => Geh nach ${dir}',
          cn: '停 + 去中间 => 去 ${dir}',
          ko: '가만히 + 가운데 => ${dir}으로',
        },
        superchain2aSwapProtean: {
          en: 'Swap => Protean + ${dir}',
          de: 'Wechseln => Himmelsrichtungen + ${dir}',
          cn: '穿 => 八方分散 + ${dir}',
          ko: '이동 => 8방향 산개 + ${dir}',
        },
        superchain2aStayProtean: {
          en: 'Stay => Protean + ${dir}',
          de: 'Bleib stehen => Himmelsrichtungen + ${dir}',
          cn: '停 => 八方分散 + ${dir}',
          ko: '가만히 => 8방향 산개 + ${dir}',
        },
        superchain2aSwapPartners: {
          en: 'Swap => Partners + ${dir}',
          de: 'Wechseln => Partner + ${dir}',
          cn: '穿 => 双人分摊 + ${dir}',
          ko: '이동 => 파트너 + ${dir}',
        },
        superchain2aStayPartners: {
          en: 'Stay => Partners + ${dir}',
          de: 'Bleib stehen => Partner + ${dir}',
          cn: '停 => 双人分摊 + ${dir}',
          ko: '가만히 => 파트너 + ${dir}',
        },
        north: Outputs.north,
        south: Outputs.south,
      },
    },
    {
      id: 'P12S Wing Followup Third Wing Superchain IIA',
      type: 'Ability',
      netRegex: { id: ['82E5', '82E6', '82EB', '82EC'], source: 'Athena', capture: false },
      condition: (data) => data.phase === 'superchain2a',
      suppressSeconds: 1,
      alertText: (data, _matches, output) => {
        const secondMech = data.superchain2aSecondMech;
        if (secondMech === undefined)
          return;
        // No direction needed here, because if you're not already here you're not going to make it.
        if (secondMech === 'protean')
          return output.protean();
        return output.partners();
      },
      outputStrings: {
        protean: {
          en: 'Protean',
          de: 'Himmelsrichtungen',
          cn: '八方分散',
          ko: '8방향 산개',
        },
        partners: {
          en: 'Partners',
          de: 'Partner',
          cn: '双人分摊',
          ko: '파트너',
        },
      },
    },
    {
      id: 'P12S Engravement of Souls Tracker',
      type: 'Ability',
      netRegex: { id: '8305', source: 'Athena', capture: false },
      run: (data) => ++data.engravementCounter,
    },
    // In Engravement 1 (Paradeigma 2), 2 players receive lightTower and 2 players receive darkTower.
    // When debuffs expire and towers drop, their debuff changes to lightTilt or darkTilt (same as tower color).
    // At the same time the towers drop, the 4 tethered players receive lightTilt or darkTilt depending on their tether color.
    {
      id: 'P12S Engravement 1 Tower Drop',
      type: 'GainsEffect',
      netRegex: { effectId: engravementTowerIds },
      condition: (data) => data.engravementCounter === 1,
      durationSeconds: (_data, matches) => parseFloat(matches.duration),
      alertText: (data, matches, output) => {
        data.engravement1Towers.push(matches.target);
        if (data.me === matches.target) {
          if (matches.effectId === engravementIdMap.lightTower)
            return output.lightTower();
          return output.darkTower();
        }
      },
      outputStrings: {
        lightTower: {
          en: 'Drop light tower',
        },
        darkTower: {
          en: 'Drop dark tower',
        },
      },
    },
    {
      id: 'P12S Engravement 1 Tower Soak',
      type: 'GainsEffect',
      netRegex: { effectId: engravementTiltIds },
      condition: (data, matches) => data.engravementCounter === 1 && data.me === matches.target,
      suppressSeconds: 5,
      alertText: (data, matches, output) => {
        if (!data.engravement1Towers.includes(data.me)) {
          // Did not drop a tower, so needs to soak one.
          if (matches.effectId === engravementIdMap.lightTilt)
            return output.lightTilt();
          return output.darkTilt();
        }
      },
      outputStrings: {
        lightTilt: {
          en: 'Soak dark tower',
          cn: '踩暗塔',
        },
        darkTilt: {
          en: 'Soak light tower',
          cn: '踩光塔',
        },
      },
    },
    // In Engravement 2 (Superchain 1), all supports or DPS will receive lightTilt and darkTilt (2 each).
    // All 4 also receive Heavensflame Soul.
    // The other role group will receive lightTower, darkTower, lightBeam, and darkBeam.
    // To resolve the Beams during the 2nd orb, lightBeam needs to stack with darkTower and both darkTilts, and vice versa.
    // After the 3rd orb, lightTower and darkTower will drop their towers, and  darkBeam and lightBeam (respectively) will soak them.
    // The four Heavensflame players all simultaneously need to spread to drop their AoEs.
    // Debuffs do change based on mechanic resolution, which can complicate things:
    // - When a lightTilt player soaks a dark beam, their debuff will change to darkTilt, and vice versa.
    // - Once the beams detonate, the lightBeam debuff disappears and is replaced with lightTilt (same with dark).
    // So only use the initial debuff to resolve the mechanic, and use a long suppress to avoid incorrect later alerts.
    {
      id: 'P12S Engravement 2 Debuff',
      type: 'GainsEffect',
      netRegex: {
        effectId: [...engravementBeamIds, ...engravementTowerIds, ...engravementTiltIds],
      },
      condition: (data, matches) => data.engravementCounter === 2 && data.me === matches.target,
      suppressSeconds: 30,
      run: (data, matches) => data.engravement2MyLabel = engravementLabelMap[matches.effectId],
    },
    {
      id: 'P12S Engravement 2 Heavensflame Soul Early',
      type: 'GainsEffect',
      netRegex: { effectId: 'DFA' },
      condition: (data, matches) => data.engravementCounter === 2 && data.me === matches.target,
      delaySeconds: 6.5,
      infoText: (_data, _matches, output) => output.spreadLater(),
      outputStrings: {
        spreadLater: {
          en: '(spread later)',
          cn: '（稍后分散）',
        },
      },
    },
    // darkTower/lightTower are 20s, but lightBeam/darkBeam are shorter and swap to lightTilt/darkTilt before the mechanic resolves.
    // So use a fixed delay rather than one based on effect duration.
    // TODO: Add additional logic/different outputs if oopsies happen?  (E.g. soak player hit by tower drop -> debuff change, backup soak by spread player, etc.)
    // TODO: Combine this with the second part (in/out) of Superchain I Third Mechanic?
    {
      id: 'P12S Engravement 2 Tower Drop/Soak Reminder',
      type: 'GainsEffect',
      netRegex: { effectId: [...engravementTowerIds, ...engravementBeamIds] },
      condition: (data, matches) => data.engravementCounter === 2 && data.me === matches.target,
      delaySeconds: 16,
      alertText: (_data, matches, output) => {
        const engraveLabel = engravementLabelMap[matches.effectId];
        if (engraveLabel === undefined)
          return;
        return output[engraveLabel]();
      },
      outputStrings: {
        lightBeam: {
          en: 'Soak Dark Tower',
          cn: '踩暗塔',
        },
        darkBeam: {
          en: 'Soak Light Tower',
          cn: '踩光塔',
        },
        lightTower: {
          en: 'Drop Light Tower',
          cn: '放光塔',
        },
        darkTower: {
          en: 'Drop Dark Tower',
          cn: '放暗塔',
        },
      },
    },
    {
      id: 'P12S Engravement 2 Heavensflame Soul',
      type: 'GainsEffect',
      netRegex: { effectId: 'DFA' },
      condition: (data, matches) => data.engravementCounter === 2 && data.me === matches.target,
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 4,
      response: Responses.spread('alert'),
    },
    // In Engravement 3 (Paradeigma 3), 2 support players will both receive either lightTower or darkTower.
    // The other 2 support players receive a '+'/Cross (DFF) or 'x'/Saltire (E00) debuff.
    // Because of platform separation during the mechanic, the '+' and 'x' players must soak the far north/south towers,
    // while the lightTower or darkTower players must soak the middle towers (so they can then drop their towers for DPS to soak).
    // All DPS receive tethers (2 light, 2 dark), and they receive corresponding lightTilt/darkTilt when tethers resolve.
    // If the support players receive lightTower, the darkTilt DPS must soak those towers, or vice versa.
    // While the light & dark towers are being soaked, the '+' and 'x' supports and  other 2 DPS must bait the adds' line cleaves.
    {
      id: 'P12S Engravement 3 Theos Initial',
      type: 'GainsEffect',
      netRegex: { effectId: engravement3TheosSoulIds },
      condition: (data, matches) => data.engravementCounter === 3 && data.me === matches.target,
      alertText: (_data, matches, output) => {
        const engraveLabel = engravementLabelMap[matches.effectId];
        if (engraveLabel === undefined)
          return;
        return output[engraveLabel]();
      },
      outputStrings: {
        crossMarked: {
          en: '\'+\' AoE on You',
          cn: '十 点名',
        },
        xMarked: {
          en: '\'x\' AoE on You',
          cn: '\'x\' 点名',
        },
      },
    },
    {
      id: 'P12S Engravement 3 Theos Drop AoE',
      type: 'GainsEffect',
      netRegex: { effectId: engravement3TheosSoulIds },
      condition: (data, matches) => data.engravementCounter === 3 && data.me === matches.target,
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 4,
      alertText: (_data, matches, output) => {
        const engraveLabel = engravementLabelMap[matches.effectId];
        if (engraveLabel === undefined)
          return;
        return output[engraveLabel]();
      },
      outputStrings: {
        crossMarked: {
          en: 'Drop \'+\' AoE',
          cn: '放置 十 点名',
        },
        xMarked: {
          en: 'Drop \'x\' AoE',
          cn: '放置 \'x\' 点名',
        },
      },
    },
    {
      id: 'P12S Engravement 3 Theos Bait Adds',
      type: 'GainsEffect',
      netRegex: { effectId: engravement3TheosSoulIds },
      condition: (data, matches) => data.engravementCounter === 3 && data.me === matches.target,
      delaySeconds: (_data, matches) => parseFloat(matches.duration),
      alertText: (_data, _matches, output) => output.baitCleave(),
      outputStrings: {
        baitCleave: {
          en: 'Bait line cleave',
        },
      },
    },
    {
      id: 'P12S Engravement 3 Towers Collect',
      type: 'GainsEffect',
      netRegex: { effectId: engravementTowerIds },
      condition: (data) => data.engravementCounter === 3,
      run: (data, matches) => {
        data.engravement3TowerPlayers.push(matches.target);
        data.engravement3TowerType = matches.effectId === engravementIdMap.lightTower
          ? 'lightTower'
          : 'darkTower';
      },
    },
    {
      id: 'P12S Engravement 3 Paradeigma Adds Collect',
      type: 'StartsUsing',
      netRegex: { id: ['82F1', '82F2'], source: 'Anthropos' },
      condition: (data) => data.engravementCounter === 3,
      run: (data, matches) => {
        // 82F1 = Searing Radiance (used on light tethers)
        // 82F2 = Shadowsear (used on dark tethers)
        // If the Anthroposes (Anthropi?) casting 82F1 are east, e.g., the tethered players will be west when the mechanic resolves.
        // lightTower/darkTower is applied ~1.1s before these abilities.
        const tetherPlayerSide = parseFloat(matches.x) > 100 ? 'west' : 'east';
        if (tetherAbilityToTowerMap[matches.id] === data.engravement3TowerType)
          data.engravement3TethersSide = tetherPlayerSide;
      },
    },
    {
      id: 'P12S Engravement 3 Towers Initial',
      type: 'GainsEffect',
      netRegex: { effectId: engravementTowerIds },
      condition: (data, matches) => data.engravementCounter === 3 && data.me === matches.target,
      delaySeconds: 0.3,
      alertText: (data, _matches, output) => {
        let towerColor = output.unknown();
        if (data.engravement3TowerType !== undefined)
          towerColor = data.engravement3TowerType === 'lightTower'
            ? output.light()
            : output.dark();
        const partner = data.ShortName(data.engravement3TowerPlayers.find((name) =>
          name !== data.me
        )) ??
          output.unknown();
        return output.towerOnYou({ color: towerColor, partner: partner });
      },
      outputStrings: {
        towerOnYou: {
          en: '${color} Tower on You (w/ ${partner})',
          cn: '${color} 塔点名 (+ ${partner})',
        },
        light: {
          en: 'Light',
          cn: '光',
        },
        dark: {
          en: 'Dark',
          cn: '暗',
        },
        unknown: Outputs.unknown,
      },
    },
    {
      id: 'P12S Engravement 3 Paradeigma Tethers Collect',
      type: 'Tether',
      // Because tethers can spawn unstretched or already satisfied, we need to catch all 4 states
      netRegex: { id: Object.keys(anthroposTetherMap), source: 'Anthropos' },
      condition: (data) => data.engravementCounter === 3,
      run: (data, matches) => {
        const tetherType = anthroposTetherMap[matches.id];
        if (tetherType === undefined)
          return;
        data.engravement3TetherPlayers[matches.target] = tetherType;
      },
    },
    {
      id: 'P12S Engravement 3 Paradeigma Early Tower Color',
      type: 'Tether',
      // Because tethers can spawn unstretched or already satisfied, we need to trigger on all 4 states
      netRegex: { id: Object.keys(anthroposTetherMap), source: 'Anthropos' },
      condition: (data, matches) => data.engravementCounter === 3 && data.me === matches.target,
      suppressSeconds: 10,
      infoText: (data, _matches, output) => {
        let towerColor = output.unknown();
        if (data.engravement3TowerType !== undefined)
          towerColor = data.engravement3TowerType === 'lightTower'
            ? output.light()
            : output.dark();
        return output.towersLater({ color: towerColor });
      },
      outputStrings: {
        towersLater: {
          en: '${color} towers (later)',
          cn: '稍后 ${color} 塔',
        },
        light: {
          en: 'Light',
          cn: '光',
        },
        dark: {
          en: 'Dark',
          cn: '暗',
        },
        unknown: Outputs.unknown,
      },
    },
    // If player starts with darkTower/lightTower, they will start east or west to soak the inside towers.
    // Use their relative position at the time 8312 (Shock) is used (the initial tower soak) to determine where they should drop their tower.
    {
      id: 'P12S Engravement 3 Towers Drop Location',
      type: 'Ability',
      netRegex: { id: '8312', source: 'Athena' },
      condition: (data, matches) =>
        data.engravementCounter === 3 && data.me === matches.target &&
        data.engravement3TowerPlayers.includes(data.me),
      alertText: (data, matches, output) => {
        let towerColor = output.unknown();
        if (data.engravement3TowerType !== undefined)
          towerColor = data.engravement3TowerType === 'lightTower'
            ? output.light()
            : output.dark();
        if (data.engravement3TethersSide === undefined)
          return output.dropTower({ color: towerColor, spot: output.unknown() });
        const mySide = parseFloat(matches.x) > 100 ? 'east' : 'west';
        const towerSpot = mySide === data.engravement3TethersSide
          ? output.corner()
          : output.platform();
        return output.dropTower({ color: towerColor, spot: towerSpot });
      },
      outputStrings: {
        dropTower: {
          en: 'Drop ${color} Tower (${spot})',
          cn: '在 ${spot} 放 ${color} 塔',
        },
        light: {
          en: 'Light',
          cn: '光',
        },
        dark: {
          en: 'Dark',
          cn: '暗',
        },
        platform: {
          en: 'Platform',
          cn: '平台内',
        },
        corner: {
          en: 'Inside Corner',
          cn: '平台交叉处',
        },
        unknown: Outputs.unknown,
      },
    },
    {
      id: 'P12S Engravement 3 Soak Tower/Bait Adds',
      type: 'GainsEffect',
      netRegex: { effectId: engravementTiltIds },
      condition: (data, matches) => data.engravementCounter === 3 && data.me === matches.target,
      suppressSeconds: 15,
      alertText: (data, matches, output) => {
        // lightTower/darkTower support players receive lightTilt/darkTilt once dropping their tower
        // so exclude them from receiving this alert
        if (data.engravement3TowerPlayers.includes(data.me))
          return;
        const soakMap = {
          lightTower: 'darkTilt',
          darkTower: 'lightTilt',
        };
        const myEffect = engravementLabelMap[matches.effectId];
        if (myEffect === undefined || data.engravement3TowerType === undefined)
          return;
        const soakTiltType = soakMap[data.engravement3TowerType];
        const towerColor = data.engravement3TowerType === 'lightTower'
          ? output.light()
          : output.dark();
        if (myEffect === soakTiltType)
          return output.soakTower({ color: towerColor });
        return output.baitCleaves();
      },
      outputStrings: {
        soakTower: {
          en: 'Soak ${color} Tower',
          cn: '踩 ${color} 塔',
        },
        baitCleaves: {
          en: 'Bait line cleave',
          cn: '引导射线',
        },
        light: {
          en: 'Light',
          cn: '光',
        },
        dark: {
          en: 'Dark',
          cn: '暗',
        },
      },
    },
    {
      id: 'P12S Peridialogos',
      type: 'StartsUsing',
      netRegex: { id: '82FF', source: 'Athena', capture: false },
      alertText: (data, _matches, output) =>
        data.role === 'tank' ? output.tanksInPartyOut() : output.partyOutTanksIn(),
      outputStrings: {
        partyOutTanksIn: {
          en: 'Party Out (Tanks In)',
          de: 'Gruppe Raus (Tanks Rein)',
          fr: 'Équipe à l\'extérieur (Tanks à l\'intérieur)',
          cn: '小队出 (T进)',
          ko: '본대 밖 (탱커 안)',
        },
        tanksInPartyOut: {
          en: 'Tanks In (Party Out)',
          de: 'Gruppe Rein (Tanks Raus)',
          fr: 'Tanks à l\'intérieur (Équipe à l\'extérieur',
          cn: 'T进 (小队出)',
          ko: '탱커 안 (본대 밖)',
        },
      },
    },
    {
      id: 'P12S Apodialogos',
      type: 'StartsUsing',
      netRegex: { id: '82FE', source: 'Athena', capture: false },
      alertText: (data, _matches, output) =>
        data.role === 'tank' ? output.tanksInPartyOut() : output.partyInTanksOut(),
      outputStrings: {
        partyInTanksOut: {
          en: 'Party In (Tanks Out)',
          de: 'Gruppe Rein (Tanks Raus)',
          fr: 'Équipe à l\'intérieur (Tanks à l\'extérieur)',
          cn: '小队进 (T出)',
          ko: '본대 안 (탱커 밖)',
        },
        tanksInPartyOut: {
          en: 'Tanks Out (Party In)',
          de: 'Tanks Raus (Gruppe Rein)',
          fr: 'Tanks à l\'extérieur (Équipe à l\'intérieur',
          cn: 'T出 (小队进)',
          ko: '탱커 밖 (본대 안)',
        },
      },
    },
    {
      id: 'P12S Limit Cut',
      type: 'HeadMarker',
      netRegex: {},
      condition: Conditions.targetIsYou(),
      durationSeconds: 20,
      alertText: (data, matches, output) => {
        const id = getHeadmarkerId(data, matches);
        if (!limitCutIds.includes(id))
          return;
        const num = limitCutMap[id];
        if (num === undefined)
          return;
        data.limitCutNumber = num;
        return output.text({ num: num });
      },
      outputStrings: {
        text: {
          en: '${num}',
          de: '${num}',
          fr: '${num}',
          ja: '${num}',
          cn: '${num}',
          ko: '${num}',
        },
      },
    },
    {
      id: 'P12S Palladion White Flame Initial',
      type: 'StartsUsing',
      // 82F5 = Palladion cast
      netRegex: { id: '82F5', source: 'Athena', capture: false },
      // Don't collide with number callout.
      delaySeconds: 2,
      durationSeconds: 4,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          baitLaser: {
            en: 'Bait Laser',
            de: 'Laser Ködern',
            fr: 'Bait le laser',
            cn: '引导激光',
            ko: '레이저 유도',
          },
          firstWhiteFlame: {
            en: '(5 and 7 bait)',
            de: '(5 und 7 ködern)',
            fr: '(5 et 7 bait)',
            cn: '(5 和 7 引导)',
            ko: '(5, 7 레이저)',
          },
        };
        const infoText = output.firstWhiteFlame();
        if (data.limitCutNumber === 5 || data.limitCutNumber === 7)
          return { alertText: output.baitLaser(), infoText: infoText };
        return { infoText: infoText };
      },
    },
    {
      id: 'P12S Palladion White Flame Followup',
      type: 'Ability',
      netRegex: { id: '82EF', source: 'Anthropos', capture: false },
      condition: (data) => data.phase === 'palladion',
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          baitLaser: {
            en: 'Bait Laser',
            de: 'Laser Ködern',
            fr: 'Bait le laser',
            cn: '引导激光',
            ko: '레이저 유도',
          },
          secondWhiteFlame: {
            en: '(6 and 8 bait)',
            de: '(6 und 8 ködern)',
            fr: '(6 et 8 bait)',
            cn: '(6 和 8 引导)',
            ko: '(6, 8 레이저)',
          },
          thirdWhiteFlame: {
            en: '(1 and 3 bait)',
            de: '(1 und 3 ködern)',
            fr: '(1 et 3 bait)',
            cn: '(1 和 3 引导)',
            ko: '(1, 3 레이저)',
          },
          fourthWhiteFlame: {
            en: '(2 and 4 bait)',
            de: '(2 und 6 ködern)',
            fr: '(2 et 4 bait)',
            cn: '(2 和 4 引导)',
            ko: '(2, 4 레이저)',
          },
        };
        data.whiteFlameCounter++;
        const baitLaser = output.baitLaser();
        if (data.whiteFlameCounter === 1) {
          const infoText = output.secondWhiteFlame();
          if (data.limitCutNumber === 6 || data.limitCutNumber === 8)
            return { alertText: baitLaser, infoText: infoText };
          return { infoText: infoText };
        }
        if (data.whiteFlameCounter === 2) {
          const infoText = output.thirdWhiteFlame();
          if (data.limitCutNumber === 1 || data.limitCutNumber === 3)
            return { alertText: baitLaser, infoText: infoText };
          return { infoText: infoText };
        }
        if (data.whiteFlameCounter === 3) {
          const infoText = output.fourthWhiteFlame();
          if (data.limitCutNumber === 2 || data.limitCutNumber === 4)
            return { alertText: baitLaser, infoText: infoText };
          return { infoText: infoText };
        }
      },
    },
    {
      id: 'P12S Superchain Theory Collect',
      type: 'AddedCombatant',
      netRegex: { npcNameId: superchainNpcNameId, npcBaseId: superchainNpcBaseIds },
      // Note: do not modify or clear this in any trigger but phase reset.
      run: (data, matches) => data.superchainCollect.push(matches),
    },
    {
      id: 'P12S Superchain Theory I First Mechanic',
      type: 'AddedCombatant',
      netRegex: { npcNameId: superchainNpcNameId, npcBaseId: superchainNpcBaseIds, capture: false },
      condition: (data) => data.phase === 'superchain1' && data.superchainCollect.length === 3,
      alertText: (data, _matches, output) => {
        const ids = data.superchainCollect.slice(0, 3).map((x) => x.npcBaseId).sort();
        const [destMatches] = data.superchainCollect.filter((x) =>
          x.npcBaseId === superchainNpcBaseIdMap.destination
        );
        // Based on id sorting (see: superchainNpcBaseIdMap), they will always be in this order.
        const [, inOut, proteanPartner] = ids;
        if (destMatches === undefined || inOut === undefined || proteanPartner === undefined)
          return;
        // TODO: technically this is just intercardinals and we don't need all outputs here.
        // Do we need another helper for this?
        const dirStr = Directions.addedCombatantPosTo8DirOutput(destMatches, centerX, centerY);
        const dir = output[dirStr]();
        data.superchain1FirstDest = destMatches;
        if (inOut === superchainNpcBaseIdMap.in) {
          if (proteanPartner === superchainNpcBaseIdMap.protean)
            return output.inAndProtean({ dir: dir });
          return output.inAndPartners({ dir: dir });
        }
        if (proteanPartner === superchainNpcBaseIdMap.protean)
          return output.outAndProtean({ dir: dir });
        return output.outAndPartners({ dir: dir });
      },
      outputStrings: {
        inAndProtean: {
          en: 'In + Protean (${dir})',
          de: 'Rein + Himmelsrichtungen (${dir})',
          fr: 'Intérieur + Position (${dir})',
          cn: '靠近 + 八方分散 (${dir})',
          ko: '안 + 8방향 산개 (${dir})',
        },
        inAndPartners: {
          en: 'In + Partners (${dir})',
          de: 'Rein + Partner (${dir})',
          fr: 'Intérieur + Partenaire (${dir})',
          cn: '靠近 + 双人分摊 (${dir})',
          ko: '안 + 파트너 (${dir})',
        },
        outAndProtean: {
          en: 'Out + Protean (${dir})',
          de: 'Raus + Himmelsrichtungen (${dir})',
          fr: 'Extérieur + Position (${dir})',
          cn: '远离 + 八方分散 (${dir})',
          ko: '밖 + 8방향 산개 (${dir})',
        },
        outAndPartners: {
          en: 'Out + Partners (${dir})',
          de: 'Raus + Partner (${dir})',
          fr: 'Extérieur + Partenaire (${dir})',
          cn: '远离 + 双人分摊 (${dir})',
          ko: '밖 + 8방향 산개 (${dir})',
        },
        ...Directions.outputStrings8Dir,
      },
    },
    {
      id: 'P12S Superchain Theory I Second Mechanic',
      type: 'AddedCombatant',
      netRegex: { npcNameId: superchainNpcNameId, npcBaseId: superchainNpcBaseIds, capture: false },
      condition: (data) => data.phase === 'superchain1' && data.superchainCollect.length === 7,
      // TODO: should we base this off of the first coil/burst instead?
      // 7.2 seconds is the time until the second mechanic finishes, so call early.
      delaySeconds: 4.5,
      durationSeconds: 8,
      alertText: (data, _matches, output) => {
        // Sort ascending.
        const collect = data.superchainCollect.slice(3, 7).sort((a, b) =>
          parseInt(a.npcBaseId) - parseInt(b.npcBaseId)
        );
        const firstMechDest = data.superchain1FirstDest;
        if (firstMechDest === undefined)
          return;
        const [dest1, dest2, donut, sphere] = collect;
        if (
          dest1 === undefined || dest2 === undefined || donut === undefined || sphere === undefined
        )
          return;
        // TODO: it'd sure be nice if we had more info about what is tethered to what
        // as part of AddedCombatant, but for now we can heuristic our way out of this.
        const expectedDistanceSqr = 561.3101;
        const dest1Donut = Math.abs(distSqr(dest1, donut) - expectedDistanceSqr);
        const dest2Donut = Math.abs(distSqr(dest2, donut) - expectedDistanceSqr);
        const dest1Sphere = Math.abs(distSqr(dest1, sphere) - expectedDistanceSqr);
        const dest2Sphere = Math.abs(distSqr(dest2, sphere) - expectedDistanceSqr);
        let donutDest;
        // Extra checks just in case??
        if (dest1Donut < dest1Sphere && dest2Donut > dest2Sphere)
          donutDest = dest1;
        else if (dest1Donut > dest1Sphere && dest2Donut < dest2Sphere)
          donutDest = dest2;
        if (donutDest === undefined)
          return;
        const prevDir = Directions.addedCombatantPosTo8Dir(firstMechDest, centerX, centerY);
        const thisDir = Directions.addedCombatantPosTo8Dir(donutDest, centerX, centerY);
        const engrave = output[data.engravement2MyLabel ?? 'unknown']();
        const rotation = (thisDir - prevDir + 8) % 8;
        if (rotation === 2)
          return output.leftClockwise({ engrave: engrave });
        if (rotation === 6)
          return output.rightCounterclockwise({ engrave: engrave });
      },
      outputStrings: {
        // This is left and right facing the boss.
        leftClockwise: {
          en: 'Left (CW) => ${engrave}',
          de: 'Links (im Uhrzeigersinn) => ${engrave}',
          fr: 'Gauche (horaire) => ${engrave}',
          cn: '左左左 (顺时针) => ${engrave}',
          ko: '왼쪽 (시계방향) => ${engrave}',
        },
        rightCounterclockwise: {
          en: 'Right (CCW) => ${engrave}',
          de: 'Rechts (gegen Uhrzeigersinn) => ${engrave}',
          fr: 'Droite (Anti-horaire) => ${engrave}',
          cn: '右右右 (逆时针) => ${engrave}',
          ko: '오른쪽 (반시계방향) => ${engrave}',
        },
        lightBeam: {
          en: 'Light Beam (Stack w/Dark)',
          cn: '光激光（与暗分摊）',
        },
        darkBeam: {
          en: 'Dark Beam (Stack w/Light)',
          cn: '暗激光（与光分摊）',
        },
        lightTower: {
          en: 'Light Tower',
          cn: '光塔点名',
        },
        darkTower: {
          en: 'Dark Tower',
          cn: '暗塔点名',
        },
        lightTilt: {
          en: 'Light Group',
          cn: '光分摊组',
        },
        darkTilt: {
          en: 'Dark Group',
          cn: '暗分摊组',
        },
        unknown: Outputs.unknown,
      },
    },
    {
      id: 'P12S Superchain Theory I Third Mechanic',
      type: 'AddedCombatant',
      netRegex: { npcNameId: superchainNpcNameId, npcBaseId: superchainNpcBaseIds, capture: false },
      condition: (data) => data.phase === 'superchain1' && data.superchainCollect.length === 10,
      // TODO: should we base this off of the first coil/burst instead?
      // 10.6 seconds is the time until the second mechanic finishes, so call early.
      delaySeconds: 9.1,
      durationSeconds: 5.5,
      alertText: (data, _matches, output) => {
        // Sort ascending.
        const collect = data.superchainCollect.slice(7, 10).sort((a, b) =>
          parseInt(a.npcBaseId) - parseInt(b.npcBaseId)
        );
        // Based on id sorting (see: superchainNpcBaseIdMap), they will always be in this order.
        const [dest, donut, sphere] = collect;
        if (dest === undefined || donut === undefined || sphere === undefined)
          return;
        const donutDistSqr = distSqr(donut, dest);
        const sphereDistSqr = distSqr(sphere, dest);
        const moveOrder = donutDistSqr > sphereDistSqr ? output.inThenOut() : output.outThenIn();
        const engrave = output[data.engravement2MyLabel ?? 'unknown']();
        return output.combined({ move: moveOrder, engrave: engrave });
      },
      outputStrings: {
        combined: {
          en: '${move} => ${engrave}',
        },
        inThenOut: Outputs.inThenOut,
        outThenIn: Outputs.outThenIn,
        lightBeam: {
          en: 'Soak Dark Tower',
          cn: '踩暗塔',
        },
        darkBeam: {
          en: 'Soak Light Tower',
          cn: '踩光塔',
        },
        lightTower: {
          en: 'Drop Light Tower',
          cn: '放光塔',
        },
        darkTower: {
          en: 'Drop Dark Tower',
          cn: '放暗塔',
        },
        lightTilt: Outputs.spread,
        darkTilt: Outputs.spread,
        unknown: Outputs.unknown,
      },
    },
    {
      id: 'P12S Superchain Theory IIa ',
      type: 'AddedCombatant',
      netRegex: { npcNameId: superchainNpcNameId, npcBaseId: superchainNpcBaseIds, capture: false },
      condition: (data) => data.phase === 'superchain2a' && data.superchainCollect.length === 10,
      run: (data) => {
        // Sort ascending.
        const collect = data.superchainCollect.sort((a, b) =>
          parseInt(a.npcBaseId) - parseInt(b.npcBaseId)
        );
        // Based on id sorting (see: superchainNpcBaseIdMap), they will always be in this order.
        const [
          dest1,
          dest2,
          dest3,
          /* out1 */,
          /* out2 */,
          /* out3 */,
          /* out4 */,
          /* in1 */,
          mech1,
          mech2,
        ] = collect;
        if (
          dest1 === undefined || dest2 === undefined || dest3 === undefined ||
          mech1 === undefined || mech2 === undefined
        )
          return;
        // These are all at x = 100, y = 100 +/- 10
        const [destNorth, /* destMid */, destSouth] = [dest1, dest2, dest3].sort((a, b) =>
          parseFloat(a.y) - parseFloat(b.y)
        );
        if (destNorth === undefined || destSouth === undefined)
          return;
        const mech1NorthDist = distSqr(mech1, destNorth);
        const mech2NorthDist = distSqr(mech2, destNorth);
        const mech1SouthDist = distSqr(mech1, destSouth);
        const mech2SouthDist = distSqr(mech2, destSouth);
        // Distance between mechanic and destination determines which goes off when.
        // ~81 distance for first mechanic, ~1190 for second mechanic
        // ~440, ~480 for comparing with wrong destination.
        const firstDistance = 100;
        const secondDistance = 1000;
        let secondMech;
        let firstDir;
        let secondDir;
        if (mech1NorthDist < firstDistance || mech2NorthDist < firstDistance)
          firstDir = 'north';
        else if (mech1SouthDist < firstDistance || mech2SouthDist < firstDistance)
          firstDir = 'south';
        if (mech1NorthDist > secondDistance) {
          secondDir = 'north';
          secondMech = mech1;
        } else if (mech1SouthDist > secondDistance) {
          secondDir = 'south';
          secondMech = mech1;
        } else if (mech2NorthDist > secondDistance) {
          secondDir = 'north';
          secondMech = mech2;
        } else if (mech2SouthDist > secondDistance) {
          secondDir = 'south';
          secondMech = mech2;
        }
        if (secondMech === undefined || firstDir === undefined || secondDir === undefined) {
          const distances = [mech1NorthDist, mech1SouthDist, mech2NorthDist, mech2SouthDist];
          console.error(`Superchain2a: bad distances: ${JSON.stringify(distances)}`);
          return;
        }
        // To avoid trigger overload, we'll combine these calls with the wings calls.
        const isSecondMechProtean = secondMech.npcBaseId === superchainNpcBaseIdMap.protean;
        data.superchain2aFirstDir = firstDir;
        data.superchain2aSecondDir = secondDir;
        data.superchain2aSecondMech = isSecondMechProtean ? 'protean' : 'partners';
      },
    },
    // --------------------- Phase 2 ------------------------
    {
      id: 'P12S Geocentrism Vertical',
      type: 'StartsUsing',
      netRegex: { id: '8329', source: 'Pallas Athena', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Vertical',
          de: 'Vertikal',
          fr: 'Vertical',
          cn: '垂直',
          ko: '세로',
        },
      },
    },
    {
      id: 'P12S Geocentrism Circle',
      type: 'StartsUsing',
      netRegex: { id: '832A', source: 'Pallas Athena', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Inny Spinny',
          de: 'Innerer Kreis',
          fr: 'Cercle intérieur',
          cn: '月环',
          ko: '가운데 원',
        },
      },
    },
    {
      id: 'P12S Geocentrism Horizontal',
      type: 'StartsUsing',
      netRegex: { id: '832B', source: 'Pallas Athena', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Horizontal',
          de: 'Horizontal',
          fr: 'Horizontal',
          cn: '水平',
          ko: '가로',
        },
      },
    },
    {
      id: 'P12S Pangenesis Collect',
      type: 'GainsEffect',
      netRegex: { effectId: pangenesisEffectIds },
      condition: (data) => !data.pangenesisDebuffsCalled && !data.isDoorBoss,
      run: (data, matches) => {
        const id = matches.effectId;
        if (id === pangenesisEffects.darkTilt) {
          const duration = parseFloat(matches.duration);
          // 16 = short, 20 = long
          data.pangenesisRole[matches.target] = duration > 18 ? 'longDark' : 'shortDark';
        } else if (id === pangenesisEffects.lightTilt) {
          const duration = parseFloat(matches.duration);
          // 16 = short, 20 = long
          data.pangenesisRole[matches.target] = duration > 18 ? 'longLight' : 'shortLight';
        } else if (id === pangenesisEffects.unstableFactor) {
          if (matches.count === '01')
            data.pangenesisRole[matches.target] = 'one';
        } else if (id === pangenesisEffects.stableSystem) {
          // Ordered: Unstable Factor / Stable System / Umbral Tilt (light) / Astral Tilt (dark)
          // ...and applied per person in that order.  Don't overwrite roles here.
          data.pangenesisRole[matches.target] ??= 'not';
        }
      },
    },
    {
      id: 'P12S Pangenesis Initial',
      type: 'GainsEffect',
      netRegex: { effectId: 'E22', capture: false },
      delaySeconds: 0.5,
      durationSeconds: (data) => {
        // There's ~13 seconds until the first tower and ~18 until the second tower.
        const myRole = data.pangenesisRole[data.me];
        return myRole === 'not' || myRole === 'longDark' || myRole === 'longLight' ? 17 : 12;
      },
      suppressSeconds: 999999,
      alertText: (data, _matches, output) => {
        const myRole = data.pangenesisRole[data.me];
        if (myRole === undefined)
          return;
        if (myRole === 'shortLight')
          return output.shortLight();
        if (myRole === 'longLight')
          return output.longLight();
        if (myRole === 'shortDark')
          return output.shortDark();
        if (myRole === 'longDark')
          return output.longDark();
        const myBuddy = Object.keys(data.pangenesisRole).find((x) => {
          return data.pangenesisRole[x] === myRole && x !== data.me;
        });
        const player = myBuddy === undefined ? output.unknown() : data.ShortName(myBuddy);
        if (myRole === 'not')
          return output.nothing({ player: player });
        return output.one({ player: player });
      },
      run: (data) => data.pangenesisDebuffsCalled = true,
      outputStrings: {
        nothing: {
          en: 'Nothing (w/${player})',
        },
        one: {
          en: 'One (w/${player})',
        },
        shortLight: {
          en: 'Short Light (get first dark)',
        },
        longLight: {
          en: 'Long Light (get second dark)',
        },
        shortDark: {
          en: 'Short Dark (get first light)',
        },
        longDark: {
          en: 'Long Dark (get second light)',
        },
        unknown: Outputs.unknown,
      },
    },
    {
      id: 'P12S Pangenesis Tilt Gain',
      type: 'GainsEffect',
      netRegex: { effectId: [pangenesisEffects.lightTilt, pangenesisEffects.darkTilt] },
      condition: (data, matches) => matches.target === data.me && !data.isDoorBoss,
      run: (data, matches) => {
        const color = matches.effectId === pangenesisEffects.lightTilt ? 'light' : 'dark';
        data.pangenesisCurrentColor = color;
      },
    },
    {
      id: 'P12S Pangenesis Tilt Lose',
      type: 'LosesEffect',
      netRegex: { effectId: [pangenesisEffects.lightTilt, pangenesisEffects.darkTilt] },
      condition: (data, matches) => matches.target === data.me && !data.isDoorBoss,
      run: (data) => data.pangenesisCurrentColor = undefined,
    },
    {
      id: 'P12S Pangenesis Tower',
      type: 'Ability',
      // 8343 = Umbral Advent (light tower), 8344 = Astral Advent (dark tower)
      netRegex: { id: ['8343', '8344'] },
      condition: (data, matches) => matches.target === data.me && !data.isDoorBoss,
      run: (data, matches) => {
        const color = matches.id === '8343' ? 'light' : 'dark';
        data.lastPangenesisTowerColor = color;
      },
    },
    {
      id: 'P12S Pangenesis Slime Reminder',
      type: 'Ability',
      // 8343 = Umbral Advent (light tower), 8344 = Astral Advent (dark tower)
      // There's always 1-2 of each, so just watch one.
      netRegex: { id: '8343', capture: false },
      condition: (data) => !data.isDoorBoss,
      preRun: (data) => data.pangenesisTowerCount++,
      suppressSeconds: 3,
      alarmText: (data, _matches, output) => {
        if (data.pangenesisTowerCount !== 3)
          return;
        if (data.pangenesisRole[data.me] !== 'not')
          return;
        return output.slimeTethers();
      },
      outputStrings: {
        slimeTethers: {
          en: 'Get Slime Tethers',
        },
      },
    },
    {
      id: 'P12S Pangenesis Tower Call',
      type: 'GainsEffect',
      netRegex: { effectId: pangenesisEffects.lightTilt, capture: false },
      condition: (data) => {
        if (data.isDoorBoss)
          return false;
        return data.lastPangenesisTowerColor !== undefined && data.pangenesisTowerCount !== 3;
      },
      delaySeconds: 0.5,
      suppressSeconds: 3,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          // TODO: with more tracking we could even tell you who you're supposed
          // to be with so that you could yell something on comms to fix mistakes.
          lightTower: {
            en: 'Light Tower',
          },
          darkTower: {
            en: 'Dark Tower',
          },
        };
        let tower;
        if (data.pangenesisCurrentColor === 'light')
          tower = 'dark';
        else if (data.pangenesisCurrentColor === 'dark')
          tower = 'light';
        else
          tower = data.lastPangenesisTowerColor;
        if (tower === undefined)
          return;
        // TODO: should we also say "Dark Tower (again)" or "Dark Tower (switch)" for emphasis?
        const severity = tower === data.lastPangenesisTowerColor ? 'infoText' : 'alertText';
        const text = tower === 'light' ? output.lightTower() : output.darkTower();
        return { [severity]: text };
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceSync': {
        'Apodialogos/Peridialogos': 'Apodia/Peridia',
        'Astral Advance/Umbral Advance': 'Astral/Umbral Advance',
        'Astral Advent/Umbral Advent': 'Astral/Umbral Advent',
        'Astral Glow/Umbral Glow': 'Astral/Umbral Glow',
        'Astral Impact/Umbral Impact': 'Astral/Umbral Impact',
        'Superchain Coil/Superchain Burst': 'Superchain Coil/Burst',
        'Theos\'s Saltire/Theos\'s Cross': 'Saltire/Cross',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'Anthropos': 'Anthropos',
        '(?<! )Athena': 'Athena',
        'Concept of Water': 'Substanz des Wassers',
        'Forbidden Factor': 'Tabu',
        'Hemitheos': 'Hemitheos',
        'Pallas Athena': 'Pallas Athena',
      },
      'replaceText': {
        '\\(Floor Drop\\)': '(Boden bricht weg)',
        '\\(cast\\)': '(Wirken)',
        '\\(enrage\\)': '(Finalangriff)',
        '\\(proximity\\)': '(Entfernung)',
        '\\(spread\\)': '(Verteilen)',
        'Apodialogos': 'Apodialogos',
        'Astral Advance': 'Lichtvordringen',
        'Astral Advent': 'Vorzeit des Lichts',
        'Astral Glow': 'Lichtglühen',
        'Astral Impact': 'Lichtschlag',
        'Caloric Theory': 'Kalorische Theorie',
        'Crush Helm': 'Zenitspaltung',
        'Demi Parhelion': 'Demi-Parhelion',
        '(?<!(Apo|Peri))Dialogos': 'Dialogos',
        'Divine Excoriation': 'Gottes Wort',
        'Dynamic Atmosphere': 'Dynamische Atmosphäre',
        'Ekpyrosis': 'Ekpyrosis',
        'Engravement of Souls': 'Seelensiegel',
        'Entropic Excess': 'Entropischer Exzess',
        'Factor In': 'Interner Faktor',
        'Gaiaochos': 'Gaiaochos',
        'Geocentrism': 'Geozentrismus',
        'Glaukopis': 'Glaukopis',
        'Ignorabimus': 'Ignorabimus',
        'Implode': 'Desintegration',
        'Missing Link': 'Schmerzende Kette',
        'On the Soul': 'Auf der Seele',
        'Palladian Grasp': 'Pallas-Griff',
        'Palladian Ray': 'Pallas-Strahl',
        'Palladion': 'Palladion',
        'Pangenesis': 'Pangenesis',
        'Panta Rhei': 'Panta Rhei',
        'Paradeigma': 'Paradigma',
        'Parthenos': 'Parthenos',
        'Peridialogos': 'Peridialogos',
        'Polarized Ray': 'Polarisierter Strahl',
        'Pyre Pulse': 'Pyrischer Puls',
        'Ray of Light': 'Lichtstrahl',
        'Sample': 'Vielfraß',
        'Searing Radiance': 'Radianz',
        'Shadowsear': 'Seelenbrenner',
        'Shock': 'Entladung',
        'Summon Darkness': 'Beschwörung der Dunkelheit',
        'Superchain Burst': 'Superkette - Ausbruch',
        'Superchain Coil': 'Superkette - Kreis',
        'Superchain Theory I(?!I)': 'Superkette - Theorie 1',
        'Superchain Theory IIA': 'Superkette - Theorie 2a',
        'Superchain Theory IIB': 'Superkette - Theorie 2b',
        'The Classical Concepts': 'Elementarschöpfung',
        'Theos\'s Cross': 'Theisches Kreuz',
        'Theos\'s Holy': 'Theisches Sanctus',
        'Theos\'s Saltire': 'Theisches Schrägkreuz',
        'Theos\'s Ultima': 'Theos Ultima',
        'Trinity of Souls': 'Dreifaltigkeit der Seelen',
        '(?<! )Ultima(?! (B|R))': 'Ultima',
        'Ultima Blade': 'Ultima-Klinge',
        'Ultima Blow': 'Ultima-Schlag',
        'Ultima Ray': 'Ultima-Strahl',
        'Umbral Advance': 'Schattenvordringen',
        'Umbral Advent': 'Vorzeit der Schatten',
        'Umbral Glow': 'Dunkelglühen',
        'Umbral Impact': 'Dunkelschlag',
        'Unnatural Enchainment': 'Seelenfessel',
        'White Flame': 'Weißes Feuer',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Anthropos': 'anthropos',
        '(?<! )Athena': 'Athéna',
        'Concept of Water': 'concept de l\'eau',
        'Forbidden Factor': 'facteur tabou',
        'Hemitheos': 'hémithéos',
        'Pallas Athena': 'Pallas Athéna',
      },
      'replaceText': {
        'Apodialogos': 'Apo dialogos',
        'Astral Advance': 'Avancée astrale',
        'Astral Advent': 'Avènement astral',
        'Astral Glow': 'Lueur astrale',
        'Astral Impact': 'Attaque astrale',
        'Caloric Theory': 'Théorie du calorique',
        'Crush Helm': 'Bombardement céleste',
        'Demi Parhelion': 'Demi-parhélie',
        '(?<!(Apo| |Peri))Dialogos': 'Dialogos',
        'Divine Excoriation': 'Châtiment céleste',
        'Dynamic Atmosphere': 'Vent perçant',
        'Ekpyrosis': 'Ekpyrosis',
        'Engravement of Souls': 'Marquage d\'âme',
        'Entropic Excess': 'Vague de chaleur ardente',
        'Factor In': 'Restauration des facteurs',
        'Gaiaochos': 'Gaiaochos',
        'Geocentrism': 'Géocentrisme',
        'Glaukopis': 'Glaukopis',
        'Ignorabimus': 'Ignorabimus',
        'Implode': 'Auto-effondrement',
        'Missing Link': 'Chaînes suppliciantes',
        'On the Soul': 'Sur les âmes',
        'Palladian Grasp': 'Main de Pallas',
        'Palladian Ray': 'Rayon de Pallas',
        'Palladion': 'Palladion',
        'Pangenesis': 'Pangenèse',
        'Panta Rhei': 'Panta rhei',
        'Paradeigma': 'Paradeigma',
        'Parthenos': 'Parthénon',
        'Peridialogos': 'Péri dialogos',
        'Polarized Ray': 'Rayon de polarité',
        'Pyre Pulse': 'Vague de chaleur intense',
        'Ray of Light': 'Onde de lumière',
        'Sample': 'Voracité',
        'Searing Radiance': 'Radiance',
        'Shadowsear': 'Brûlure d\'ombre',
        'Shock': 'Décharge électrostatique',
        'Summon Darkness': 'Invocation des ténèbres',
        'Superchain Burst': 'Salve des superchaînes',
        'Superchain Coil': 'Cercle des superchaînes',
        'Superchain Theory I(?!I)': 'Théorie des superchaînes I',
        'Superchain Theory IIA': 'Théorie des superchaînes IIA',
        'Superchain Theory IIB': 'Théorie des superchaînes IIB',
        'The Classical Concepts': 'Concepts élémentaires',
        'Theos\'s Cross': 'Croix de théos',
        'Theos\'s Holy': 'Miracle de théos',
        'Theos\'s Saltire': 'Croix décussée de théos',
        'Theos\'s Ultima': 'Ultima de théos',
        'Trinity of Souls': 'Âmes trinité',
        '(?<! )Ultima(?! (B|R))': 'Ultima',
        'Ultima Blade': 'Lames Ultima',
        'Ultima Blow': 'Souffle Ultima',
        'Ultima Ray': 'Rayon Ultima',
        'Umbral Advance': 'Avancée ombrale',
        'Umbral Advent': 'Avènement ombral',
        'Umbral Glow': 'Lueur ombrale',
        'Umbral Impact': 'Attaque ombrale',
        'Unnatural Enchainment': 'Enchaînement d\'âmes',
        'White Flame': 'Feu blanc',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Anthropos': 'アンスロポス',
        '(?<! )Athena': 'アテナ',
        'Concept of Water': '水の概念',
        'Forbidden Factor': '禁忌因子',
        'Hemitheos': 'ヘーミテオス',
        'Pallas Athena': 'パラスアテナ',
      },
      'replaceText': {
        'Apodialogos': 'アポ・ディアロゴス',
        'Astral Advance': 'アストラルアドバンス',
        'Astral Advent': 'アストラルアドベント',
        'Astral Glow': 'アストラルグロウ',
        'Astral Impact': '星撃',
        'Caloric Theory': 'カロリックセオリー',
        'Crush Helm': '星天爆撃打',
        'Demi Parhelion': 'デミパルヘリオン',
        '(?<!(Apo|Peri))Dialogos': 'ディアロゴス',
        'Divine Excoriation': '神罰',
        'Dynamic Atmosphere': '衝風',
        'Ekpyrosis': 'エクピロシス',
        'Engravement of Souls': '魂の刻印',
        'Entropic Excess': '焦熱波',
        'Factor In': '因子還元',
        'Gaiaochos': 'ガイアオコス',
        'Geocentrism': 'ジオセントリズム',
        'Glaukopis': 'グラウコピス',
        'Ignorabimus': 'イグノラビムス',
        'Implode': '自壊',
        'Missing Link': '苦痛の鎖',
        'On the Soul': 'オン・ザ・ソウル',
        'Palladian Grasp': 'パラスの手',
        'Palladian Ray': 'パラスレイ',
        'Palladion': 'パラディオン',
        'Pangenesis': 'パンゲネシス',
        'Panta Rhei': 'パンタレイ',
        'Paradeigma': 'パラデイグマ',
        'Parthenos': 'パルテノン',
        'Peridialogos': 'ペリ・ディアロゴス',
        'Polarized Ray': 'ポラリティレイ',
        'Pyre Pulse': '重熱波',
        'Ray of Light': '光波',
        'Sample': '貪食',
        'Searing Radiance': 'レイディアンス',
        'Shadowsear': 'シャドーシアー',
        'Shock': '放電',
        'Summon Darkness': 'サモンダークネス',
        'Superchain Burst': 'スーパーチェイン・バースト',
        'Superchain Coil': 'スーパーチェイン・サークル',
        'Superchain Theory I(?!I)': 'スーパーチェイン・セオリーI',
        'Superchain Theory IIA': 'スーパーチェイン・セオリーIIA',
        'Superchain Theory IIB': 'スーパーチェイン・セオリーIIB',
        'The Classical Concepts': 'イデア・エレメンタル',
        'Theos\'s Cross': 'テオス・クロス',
        'Theos\'s Holy': 'テオス・ホーリー',
        'Theos\'s Saltire': 'テオス・サルタイアー',
        'Theos\'s Ultima': 'テオス・アルテマ',
        'Trinity of Souls': 'トリニティ・ソウル',
        '(?<! )Ultima(?! (B|R))': 'アルテマ',
        'Ultima Blade': 'アルテマブレイド',
        'Ultima Blow': 'アルテマブロウ',
        'Ultima Ray': 'アルテマレイ',
        'Umbral Advance': 'アンブラルアドバンス',
        'Umbral Advent': 'アンブラルアドベント',
        'Umbral Glow': 'アンブラルグロウ',
        'Umbral Impact': '霊撃',
        'Unnatural Enchainment': '魂の鎖',
        'White Flame': '白火',
      },
    },
  ],
});
