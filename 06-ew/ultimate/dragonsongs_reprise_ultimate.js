// Due to changes introduced in patch 5.2, overhead markers now have a random offset
// added to their ID. This offset currently appears to be set per instance, so
// we can determine what it is from the first overhead marker we see.
const headmarkers = {
  // vfx/lockon/eff/lockon6_t0t.avfx
  'hyperdimensionalSlash': '00EA',
  // vfx/lockon/eff/r1fz_firechain_01x.avfx through 04x
  'firechainCircle': '0119',
  'firechainTriangle': '011A',
  'firechainSquare': '011B',
  'firechainX': '011C',
  // vfx/lockon/eff/r1fz_skywl_s9x.avfx
  'skywardLeap': '014A',
  // vfx/lockon/eff/m0244trg_a1t.avfx and a2t
  'sword1': '0032',
  'sword2': '0033',
  // vfx/lockon/eff/r1fz_holymeteo_s12x.avfx
  'meteor': '011D',
  // vfx/lockon/eff/r1fz_lockon_num01_s5x.avfx through num03
  'dot1': '013F',
  'dot2': '0140',
  'dot3': '0141',
};
const firstMarker = (phase) => {
  return phase === 'doorboss' ? headmarkers.hyperdimensionalSlash : headmarkers.skywardLeap;
};
const getHeadmarkerId = (data, matches, firstDecimalMarker) => {
  // If we naively just check !data.decOffset and leave it, it breaks if the first marker is 00DA.
  // (This makes the offset 0, and !0 is true.)
  if (data.decOffset === undefined) {
    // This must be set the first time this function is called in DSR Headmarker Tracker.
    if (firstDecimalMarker === undefined)
      throw new UnreachableCode();
    data.decOffset = parseInt(matches.id, 16) - firstDecimalMarker;
  }
  // The leading zeroes are stripped when converting back to string, so we re-add them here.
  // Fortunately, we don't have to worry about whether or not this is robust,
  // since we know all the IDs that will be present in the encounter.
  return (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase().padStart(4, '0');
};
// Calculate combatant position in an all 8 cards/intercards
const matchedPositionTo8Dir = (combatant) => {
  // Positions are moved up 100 and right 100
  const y = combatant.PosY - 100;
  const x = combatant.PosX - 100;
  // During Thordan, knight dives start at the 8 cardinals + numerical
  // slop on a radius=23 circle.
  // N = (100, 77), E = (123, 100), S = (100, 123), W = (77, 100)
  // NE = (116.26, 83.74), SE = (116.26, 116.26), SW = (83.74, 116.26), NW = (83.74, 83.74)
  //
  // Map NW = 0, N = 1, ..., W = 7
  return (Math.round(5 - 4 * Math.atan2(x, y) / Math.PI) % 8);
};
// Calculate combatant position in 4 cardinals
const matchedPositionTo4Dir = (combatant) => {
  // Positions are moved up 100 and right 100
  const y = combatant.PosY - 100;
  const x = combatant.PosX - 100;
  // During the vault knights, Adelphel will jump to one of the 4 cardinals
  // N = (100, 78), E = (122, 100), S = (100, 122), W = (78, 100)
  //
  // N = 0, E = 1, S = 2, W = 3
  return (Math.round(2 - 2 * Math.atan2(x, y) / Math.PI) % 4);
};
Options.Triggers.push({
  zoneId: ZoneId.DragonsongsRepriseUltimate,
  timelineFile: 'dragonsongs_reprise_ultimate.txt',
  initData: () => {
    return {
      phase: 'doorboss',
      firstAdelphelJump: true,
      diveFromGraceNum: {},
      diveFromGraceHasArrow: { 1: false, 2: false, 3: false },
    };
  },
  triggers: [
    {
      id: 'DSR Phase Tracker',
      type: 'StartsUsing',
      // 62D4 = Holiest of Holy
      // 63C8 = Ascalon's Mercy Concealed
      // 6708 = Final Chorus
      // 62E2 = Spear of the Fury
      // 6B86 = Incarnation
      // 6667 = unknown_6667
      // 71E4 = Shockwave
      netRegex: NetRegexes.startsUsing({ id: ['62D4', '63C8', '6708', '62E2', '6B86', '6667', '7438'], capture: true }),
      run: (data, matches) => {
        switch (matches.id) {
          case '62D4':
            data.phase = 'doorboss';
            break;
          case '63C8':
            data.phase = 'thordan';
            break;
          case '6708':
            data.phase = 'nidhogg';
            break;
          case '62E2':
            data.phase = 'haurchefant';
            break;
          case '6B86':
            data.phase = 'thordan2';
            break;
          case '6667':
            data.phase = 'nidhogg2';
            break;
          case '71E4':
            data.phase = 'dragon-king';
            break;
        }
      },
    },
    {
      id: 'DSR Headmarker Tracker',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({}),
      condition: (data) => data.decOffset === undefined,
      // Unconditionally set the first headmarker here so that future triggers are conditional.
      run: (data, matches) => {
        const firstHeadmarker = parseInt(firstMarker(data.phase), 16);
        getHeadmarkerId(data, matches, firstHeadmarker);
      },
    },
    {
      id: 'DSR Holiest of Holy',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62D4', source: 'Ser Adelphel', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '62D4', source: 'Adelphel', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '62D4', source: 'Sire Adelphel', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '62D4', source: '聖騎士アデルフェル', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '62D4', source: '圣骑士阿代尔斐尔', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '62D4', source: '성기사 아델펠', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'DSR Holiest Hallowing',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62D0', source: 'Ser Adelphel' }),
      netRegexDe: NetRegexes.startsUsing({ id: '62D0', source: 'Adelphel' }),
      netRegexFr: NetRegexes.startsUsing({ id: '62D0', source: 'Sire Adelphel' }),
      netRegexJa: NetRegexes.startsUsing({ id: '62D0', source: '聖騎士アデルフェル' }),
      netRegexCn: NetRegexes.startsUsing({ id: '62D0', source: '圣骑士阿代尔斐尔' }),
      netRegexKo: NetRegexes.startsUsing({ id: '62D0', source: '성기사 아델펠' }),
      response: Responses.interrupt(),
    },
    {
      id: 'DSR Empty Dimension',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62DA', source: 'Ser Grinnaux', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '62DA', source: 'Grinnaux', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '62DA', source: 'Sire Grinnaux', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '62DA', source: '聖騎士グリノー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '62DA', source: '圣骑士格里诺', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '62DA', source: '성기사 그리노', capture: false }),
      alertText: (data, _matches, output) => {
        return data.seenEmptyDimension ? output.in() : output.inAndTether();
      },
      run: (data) => data.seenEmptyDimension = true,
      outputStrings: {
        inAndTether: {
          en: 'In + Tank Tether',
          de: 'Rein + Tank-Verbindung',
          fr: 'Intérieur + Liens tanks',
          ko: '안으로 + 탱커 선 가로채기',
        },
        in: Outputs.in,
      },
    },
    {
      id: 'DSR Full Dimension',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62DB', source: 'Ser Grinnaux', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '62DB', source: 'Grinnaux', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '62DB', source: 'Sire Grinnaux', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '62DB', source: '聖騎士グリノー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '62DB', source: '圣骑士格里诺', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '62DB', source: '성기사 그리노', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'DSR Faith Unmoving',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62DC', source: 'Ser Grinnaux', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '62DC', source: 'Grinnaux', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '62DC', source: 'Sire Grinnaux', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '62DC', source: '聖騎士グリノー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '62DC', source: '圣骑士格里诺', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '62DC', source: '성기사 그리노', capture: false }),
      condition: (data) => data.phase !== 'doorboss' || data.adelphelDir === undefined,
      response: Responses.knockback(),
    },
    {
      id: 'DSR Hyperdimensional Slash Headmarker',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker(),
      condition: (data, matches) => data.phase === 'doorboss' && data.me === matches.target,
      alertText: (data, matches, output) => {
        const id = getHeadmarkerId(data, matches);
        if (id === headmarkers.hyperdimensionalSlash)
          return output.slashOnYou();
      },
      outputStrings: {
        slashOnYou: {
          en: 'Slash on YOU',
          de: 'Schlag auf DIR',
          fr: 'Slash sur VOUS',
          ko: '고차원 대상자',
        },
      },
    },
    {
      id: 'DSR Adelphel ID Tracker',
      // 62D2 Is Ser Adelphel's Holy Bladedance, casted once during the encounter
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '62D2', source: 'Ser Adelphel' }),
      netRegexDe: NetRegexes.ability({ id: '62D2', source: 'Adelphel' }),
      netRegexFr: NetRegexes.ability({ id: '62D2', source: 'Sire Adelphel' }),
      netRegexJa: NetRegexes.ability({ id: '62D2', source: '聖騎士アデルフェル' }),
      netRegexCn: NetRegexes.ability({ id: '62D2', source: '圣骑士阿代尔斐尔' }),
      netRegexKo: NetRegexes.ability({ id: '62D2', source: '성기사 아델펠' }),
      run: (data, matches) => data.adelphelId = matches.sourceId,
    },
    {
      id: 'DSR Adelphel KB Direction',
      type: 'NameToggle',
      netRegex: NetRegexes.nameToggle({ toggle: '01' }),
      condition: (data, matches) => data.phase === 'doorboss' && matches.id === data.adelphelId && data.firstAdelphelJump,
      // Delay 0.1s here to prevent any race condition issues with getCombatants
      delaySeconds: 0.1,
      promise: async (data, matches) => {
        data.firstAdelphelJump = false;
        // Select Ser Adelphel
        let adelphelData = null;
        adelphelData = await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.id, 16)],
        });
        // if we could not retrieve combatant data, the
        // trigger will not work, so just resume promise here
        if (adelphelData === null) {
          console.error(`Ser Adelphel: null data`);
          return;
        }
        if (!adelphelData.combatants) {
          console.error(`Ser Adelphel: null combatants`);
          return;
        }
        const adelphelDataLength = adelphelData.combatants.length;
        if (adelphelDataLength !== 1) {
          console.error(`Ser Adelphel: expected 1 combatants got ${adelphelDataLength}`);
          return;
        }
        // Add the combatant's position
        const adelphel = adelphelData.combatants.pop();
        if (!adelphel)
          throw new UnreachableCode();
        data.adelphelDir = matchedPositionTo4Dir(adelphel);
      },
      infoText: (data, _matches, output) => {
        // Map of directions, reversed to call out KB direction
        const dirs = {
          0: output.south(),
          1: output.west(),
          2: output.north(),
          3: output.east(),
          4: output.unknown(),
        };
        return output.adelphelLocation({
          dir: dirs[data.adelphelDir ?? 4],
        });
      },
      run: (data) => delete data.adelphelDir,
      outputStrings: {
        north: Outputs.north,
        east: Outputs.east,
        south: Outputs.south,
        west: Outputs.west,
        unknown: Outputs.unknown,
        adelphelLocation: {
          en: 'Go ${dir} (knockback)',
          de: 'Geh ${dir} (Rückstoß)',
          cn: '去 ${dir} (击退)',
          ko: '${dir} (넉백)',
        },
      },
    },
    {
      id: 'DSR Playstation Fire Chains',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker(),
      condition: (data, matches) => data.phase === 'doorboss' && data.me === matches.target,
      alertText: (data, matches, output) => {
        const id = getHeadmarkerId(data, matches);
        if (id === headmarkers.firechainCircle)
          return output.circle();
        if (id === headmarkers.firechainTriangle)
          return output.triangle();
        if (id === headmarkers.firechainSquare)
          return output.square();
        if (id === headmarkers.firechainX)
          return output.x();
      },
      outputStrings: {
        circle: {
          en: 'Red Circle',
          de: 'Roter Kreis',
          fr: 'Cercle rouge',
          ko: '빨강 원형징',
        },
        triangle: {
          en: 'Green Triangle',
          de: 'Grünes Dreieck',
          fr: 'Triangle vert',
          ko: '초록 세모징',
        },
        square: {
          en: 'Purple Square',
          de: 'Lilanes Viereck',
          fr: 'Carré violet',
          ko: '보라 네모징',
        },
        x: {
          en: 'Blue X',
          de: 'Blaues X',
          fr: 'Croix bleue',
          ko: '파랑 X징',
        },
      },
    },
    {
      id: 'DSR Skyblind',
      // 631A Skyblind (2.2s cast) is a targetted ground aoe where A65 Skyblind
      // effect expired on the player.
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'A65' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration),
      response: Responses.moveAway(),
    },
    {
      id: 'DSR Ascalon\'s Mercy Concealed',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '63C8', source: 'King Thordan', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '63C8', source: 'Thordan', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '63C8', source: 'Roi Thordan', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '63C8', source: '騎神トールダン', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '63C8', source: '骑神托尔丹', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '63C8', source: '기사신 토르당', capture: false }),
      suppressSeconds: 5,
      response: Responses.moveAway(),
    },
    {
      id: 'DSR Spiral Thrust Safe Spots',
      // 63D3 Strength of the Ward
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '63D3', source: 'King Thordan', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '63D3', source: 'Thordan', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '63D3', source: 'Roi Thordan', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '63D3', source: '騎神トールダン', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '63D3', source: '骑神托尔丹', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '63D3', source: '기사신 토르당', capture: false }),
      condition: (data) => data.phase === 'thordan',
      // It appears that these adds can be in place at ~4.5s, but with latency this may fail for some.
      delaySeconds: 5,
      promise: async (data) => {
        // Collect Ser Vellguine (3636), Ser Paulecrain (3637), Ser Ignasse (3638) entities
        const vellguineLocaleNames = {
          en: 'Ser Vellguine',
          de: 'Vellguine',
          fr: 'sire Vellguine',
          ja: '聖騎士ヴェルギーン',
          cn: '圣骑士韦尔吉纳',
          ko: '성기사 벨긴',
        };
        const paulecrainLocaleNames = {
          en: 'Ser Paulecrain',
          de: 'Paulecrain',
          fr: 'sire Paulecrain',
          ja: '聖騎士ポールクラン',
          cn: '圣骑士波勒克兰',
          ko: '성기사 폴르크랭',
        };
        const ignasseLocaleNames = {
          en: 'Ser Ignasse',
          de: 'Ignasse',
          fr: 'sire Ignassel',
          ja: '聖騎士イニアセル',
          cn: '圣骑士伊尼亚斯',
          ko: '성기사 이냐스',
        };
        // Select the knights
        const combatantNameKnights = [];
        combatantNameKnights.push(vellguineLocaleNames[data.parserLang]);
        combatantNameKnights.push(paulecrainLocaleNames[data.parserLang]);
        combatantNameKnights.push(ignasseLocaleNames[data.parserLang]);
        const spiralThrusts = [];
        for (const combatantName of combatantNameKnights) {
          let combatantData = null;
          if (combatantName) {
            combatantData = await callOverlayHandler({
              call: 'getCombatants',
              names: [combatantName],
            });
          }
          // if we could not retrieve combatant data, the
          // trigger will not work, so just resume promise here
          if (combatantData === null) {
            console.error(`Spiral Thrust: null data`);
            return;
          }
          if (!combatantData.combatants) {
            console.error(`Spiral Thrust: null combatants`);
            return;
          }
          const combatantDataLength = combatantData.combatants.length;
          if (combatantDataLength !== 1) {
            console.error(`Spiral Thrust: expected 1 combatants got ${combatantDataLength}`);
            return;
          }
          // Add the combatant's position
          const combatant = combatantData.combatants.pop();
          if (!combatant)
            throw new UnreachableCode();
          spiralThrusts.push(matchedPositionTo8Dir(combatant));
        }
        const [thrust0, thrust1, thrust2] = spiralThrusts;
        if (thrust0 === undefined || thrust1 === undefined || thrust2 === undefined)
          return;
        // Array of dirNums
        const dirNums = [0, 1, 2, 3, 4, 5, 6, 7];
        // Remove where the knights are at and where they will go to
        delete dirNums[(thrust0 + 4) % 8];
        delete dirNums[thrust0];
        delete dirNums[(thrust1 + 4) % 8];
        delete dirNums[thrust1];
        delete dirNums[(thrust2 + 4) % 8];
        delete dirNums[thrust2];
        // Remove null elements from the array to get remaining two dirNums
        dirNums.forEach((dirNum) => {
          if (dirNum !== null)
            (data.spiralThrustSafeZones ?? (data.spiralThrustSafeZones = [])).push(dirNum);
        });
      },
      infoText: (data, _matches, output) => {
        data.spiralThrustSafeZones ?? (data.spiralThrustSafeZones = []);
        if (data.spiralThrustSafeZones.length !== 2) {
          console.error(`Spiral Thrusts: expected 2 safe zones got ${data.spiralThrustSafeZones.length}`);
          return;
        }
        // Map of directions
        const dirs = {
          0: output.northwest(),
          1: output.north(),
          2: output.northeast(),
          3: output.east(),
          4: output.southeast(),
          5: output.south(),
          6: output.southwest(),
          7: output.west(),
          8: output.unknown(),
        };
        return output.safeSpots({
          dir1: dirs[data.spiralThrustSafeZones[0] ?? 8],
          dir2: dirs[data.spiralThrustSafeZones[1] ?? 8],
        });
      },
      run: (data) => delete data.spiralThrustSafeZones,
      outputStrings: {
        north: Outputs.north,
        northeast: Outputs.northeast,
        east: Outputs.east,
        southeast: Outputs.southeast,
        south: Outputs.south,
        southwest: Outputs.southwest,
        west: Outputs.west,
        northwest: Outputs.northwest,
        unknown: Outputs.unknown,
        safeSpots: {
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
      id: 'DSR Dragon\'s Rage',
      // 63C4 Is Thordan's --middle-- action, thordan jumps again and becomes untargetable, shortly after the 2nd 6C34 action
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '63C4', source: 'King Thordan' }),
      netRegexDe: NetRegexes.ability({ id: '63C4', source: 'Thordan' }),
      netRegexFr: NetRegexes.ability({ id: '63C4', source: 'Roi Thordan' }),
      netRegexJa: NetRegexes.ability({ id: '63C4', source: '騎神トールダン' }),
      netRegexCn: NetRegexes.ability({ id: '63C4', source: '骑神托尔丹' }),
      netRegexKo: NetRegexes.ability({ id: '63C4', source: '기사신 토르당' }),
      condition: (data) => (data.phase === 'thordan' && (data.thordanJumpCounter = (data.thordanJumpCounter ?? 0) + 1) === 2),
      delaySeconds: 0.5,
      promise: async (data, matches) => {
        // Select King Thordan
        let thordanData = null;
        thordanData = await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.sourceId, 16)],
        });
        // if we could not retrieve combatant data, the
        // trigger will not work, so just resume promise here
        if (thordanData === null) {
          console.error(`King Thordan: null data`);
          return;
        }
        if (!thordanData.combatants) {
          console.error(`King Thordan: null combatants`);
          return;
        }
        const thordanDataLength = thordanData.combatants.length;
        if (thordanDataLength !== 1) {
          console.error(`King Thordan: expected 1 combatants got ${thordanDataLength}`);
          return;
        }
        // Add the combatant's position
        const thordan = thordanData.combatants.pop();
        if (!thordan)
          throw new UnreachableCode();
        data.thordanDir = matchedPositionTo8Dir(thordan);
      },
      infoText: (data, _matches, output) => {
        // Map of directions
        const dirs = {
          0: output.northwest(),
          1: output.north(),
          2: output.northeast(),
          3: output.east(),
          4: output.southeast(),
          5: output.south(),
          6: output.southwest(),
          7: output.west(),
          8: output.unknown(),
        };
        return output.thordanLocation({
          dir: dirs[data.thordanDir ?? 8],
        });
      },
      run: (data) => delete data.thordanDir,
      outputStrings: {
        north: Outputs.north,
        northeast: Outputs.northeast,
        east: Outputs.east,
        southeast: Outputs.southeast,
        south: Outputs.south,
        southwest: Outputs.southwest,
        west: Outputs.west,
        northwest: Outputs.northwest,
        unknown: Outputs.unknown,
        thordanLocation: {
          en: '${dir} Thordan',
          de: '${dir} Thordan',
          ja: 'トールダンが${dir}で',
          ko: '토르당 ${dir}',
        },
      },
    },
    {
      id: 'DSR Skyward Leap',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker(),
      condition: (data, matches) => data.phase === 'thordan' && data.me === matches.target,
      alertText: (data, matches, output) => {
        const id = getHeadmarkerId(data, matches);
        if (id === headmarkers.skywardLeap)
          return output.leapOnYou();
      },
      outputStrings: {
        leapOnYou: {
          en: 'Leap on YOU',
          de: 'Sprung auf DIR',
          fr: 'Saut sur VOUS',
          ko: '광역 대상자',
        },
      },
    },
    {
      id: 'DSR Ancient Quaga',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63C6', source: 'King Thordan', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '63C6', source: 'Thordan', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '63C6', source: 'Roi Thordan', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '63C6', source: '騎神トールダン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '63C6', source: '骑神托尔丹', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '63C6', source: '기사신 토르당', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'DSR Sanctity of the Ward Direction',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '63E1', source: 'King Thordan', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '63E1', source: 'Thordan', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '63E1', source: 'Roi Thordan', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '63E1', source: '騎神トールダン', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '63E1', source: '骑神托尔丹', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '63E1', source: '기사신 토르당', capture: false }),
      condition: (data) => data.phase === 'thordan',
      delaySeconds: 4.7,
      promise: async (data, _matches, output) => {
        // The two gladiators spawn in one of two positions: West (95, 100) or East (105, 100).
        // This triggers uses east/west location of the white knight, Ser Janlennoux (3635) to
        // determine where both knights will dash as they each only look in two directions.
        // Ser Janlenoux only looks towards the north (northeast or northwest).
        // Ser Adelphel only looks towards the south (southwest or southeast).
        // Thus we can just use one knight and get whether it is east or west for location.
        // Callout assumes starting from DRK position, but for east/west (two-movement strategy)
        // you can reverse the cw/ccw callout.
        const janlenouxLocaleNames = {
          en: 'Ser Janlenoux',
          de: 'Janlenoux',
          fr: 'sire Janlenoux',
          ja: '聖騎士ジャンルヌ',
          cn: '圣骑士让勒努',
          ko: '성기사 장르누',
        };
        // Select Ser Janlenoux
        let combatantNameJanlenoux = null;
        combatantNameJanlenoux = janlenouxLocaleNames[data.parserLang];
        let combatantDataJanlenoux = null;
        if (combatantNameJanlenoux) {
          combatantDataJanlenoux = await callOverlayHandler({
            call: 'getCombatants',
            names: [combatantNameJanlenoux],
          });
        }
        // if we could not retrieve combatant data, the
        // trigger will not work, so just resume promise here
        if (combatantDataJanlenoux === null) {
          console.error(`Ser Janlenoux: null data`);
          return;
        }
        if (!combatantDataJanlenoux.combatants) {
          console.error(`Ser Janlenoux: null combatants`);
          return;
        }
        const combatantDataJanlenouxLength = combatantDataJanlenoux.combatants.length;
        if (combatantDataJanlenouxLength <= 1) {
          console.error(`Ser Janlenoux: expected at least 1 combatants got ${combatantDataJanlenouxLength}`);
          return;
        }
        // Sort to retreive last combatant in list
        const sortCombatants = (a, b) => (a.ID ?? 0) - (b.ID ?? 0);
        const combatantJanlenoux = combatantDataJanlenoux.combatants.sort(sortCombatants).shift();
        if (!combatantJanlenoux)
          throw new UnreachableCode();
        // West (95, 100) or East (105, 100).
        if (combatantJanlenoux.PosX < 100)
          data.sanctityWardDir = output.clockwise();
        if (combatantJanlenoux.PosX > 100)
          data.sanctityWardDir = output.counterclock();
      },
      infoText: (data, _matches, output) => {
        return data.sanctityWardDir ?? output.unknown();
      },
      run: (data) => delete data.sanctityWardDir,
      outputStrings: {
        clockwise: {
          en: 'Clockwise',
          de: 'Im Uhrzeigersinn',
          ja: '時計回り',
          ko: '시계방향',
        },
        counterclock: {
          en: 'Counterclockwise',
          de: 'Gegen den Uhrzeigersinn',
          ja: '反時計回り',
          ko: '반시계방향',
        },
        unknown: Outputs.unknown,
      },
    },
    {
      id: 'DSR Sanctity of the Ward Swords',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker(),
      condition: (data, matches) => data.phase === 'thordan' && data.me === matches.target,
      alarmText: (data, matches, output) => {
        const id = getHeadmarkerId(data, matches);
        if (id === headmarkers.sword1)
          return output.sword1();
        if (id === headmarkers.sword2)
          return output.sword2();
      },
      outputStrings: {
        sword1: {
          en: '1',
          de: '1',
          ja: '1',
          ko: '1',
        },
        sword2: {
          en: '2',
          de: '2',
          ja: '2',
          ko: '2',
        },
      },
    },
    {
      id: 'DSR Dragon\'s Gaze',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63D0', source: 'King Thordan', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '63D0', source: 'Thordan', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '63D0', source: 'Roi Thordan', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '63D0', source: '騎神トールダン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '63D0', source: '骑神托尔丹', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '63D0', source: '기사신 토르당', capture: false }),
      durationSeconds: 5,
      response: Responses.lookAway('alert'),
    },
    {
      id: 'DSR Sanctity of the Ward Meteor Role',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker(),
      condition: (data) => data.phase === 'thordan',
      suppressSeconds: 1,
      infoText: (data, matches, output) => {
        const id = getHeadmarkerId(data, matches);
        if (id !== headmarkers.meteor)
          return;
        if (data.party.isDPS(matches.target))
          return output.dpsMeteors();
        return output.tankHealerMeteors();
      },
      outputStrings: {
        tankHealerMeteors: {
          en: 'Tank/Healer Meteors',
          de: 'Tank/Heiler Meteore',
          fr: 'Météores Tank/Healer',
          ja: 'タンヒラ 隕石',
          ko: '탱/힐 메테오',
        },
        dpsMeteors: {
          en: 'DPS Meteors',
          de: 'DDs Meteore',
          fr: 'Météores DPS',
          ja: 'DPS 隕石',
          ko: '딜러 메테오',
        },
      },
    },
    {
      id: 'DSR Sanctity of the Ward Meteor You',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker(),
      condition: (data, matches) => data.phase === 'thordan' && data.me === matches.target,
      alertText: (data, matches, output) => {
        const id = getHeadmarkerId(data, matches);
        if (id === headmarkers.meteor)
          return output.meteorOnYou();
      },
      outputStrings: {
        meteorOnYou: Outputs.meteorOnYou,
      },
    },
    {
      id: 'DSR Broad Swing Right',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63C0', source: 'King Thordan', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '63C0', source: 'Thordan', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '63C0', source: 'Roi Thordan', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '63C0', source: '騎神トールダン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '63C0', source: '骑神托尔丹', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '63C0', source: '기사신 토르당', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Behind => Right',
          de: 'Hinter ihn => Rechts',
          ja: '後ろ => 右',
          ko: '뒤 => 오른쪽',
        },
      },
    },
    {
      id: 'DSR Broad Swing Left',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63C1', source: 'King Thordan', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '63C1', source: 'Thordan', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '63C1', source: 'Roi Thordan', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '63C1', source: '騎神トールダン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '63C1', source: '骑神托尔丹', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '63C1', source: '기사신 토르당', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Behind => Left',
          de: 'Hinter ihn => Links',
          ja: '後ろ => 左',
          ko: '뒤 => 왼쪽',
        },
      },
    },
    {
      id: 'DSR Gnash and Lash',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6712', source: 'Nidhogg', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6712', source: 'Nidhogg', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6712', source: 'Nidhogg', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6712', source: 'ニーズヘッグ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '6712', source: '尼德霍格', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '6712', source: '니드호그', capture: false }),
      durationSeconds: 8,
      response: Responses.getOutThenIn(),
    },
    {
      id: 'DSR Lash and Gnash',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6713', source: 'Nidhogg', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6713', source: 'Nidhogg', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6713', source: 'Nidhogg', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6713', source: 'ニーズヘッグ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '6713', source: '尼德霍格', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '6713', source: '니드호그', capture: false }),
      durationSeconds: 8,
      response: Responses.getInThenOut(),
    },
    {
      id: 'DSR Lash Gnash Followup',
      type: 'Ability',
      // 6715 = Gnashing Wheel
      // 6716 = Lashing Wheel
      netRegex: NetRegexes.ability({ id: ['6715', '6716'], source: 'Nidhogg' }),
      netRegexDe: NetRegexes.ability({ id: ['6715', '6716'], source: 'Nidhogg' }),
      netRegexFr: NetRegexes.ability({ id: ['6715', '6716'], source: 'Nidhogg' }),
      netRegexJa: NetRegexes.ability({ id: ['6715', '6716'], source: 'ニーズヘッグ' }),
      netRegexCn: NetRegexes.ability({ id: ['6715', '6716'], source: '尼德霍格' }),
      netRegexKo: NetRegexes.ability({ id: ['6715', '6716'], source: '니드호그' }),
      // These are ~3s apart.  Only call after the first (and ignore multiple people getting hit).
      suppressSeconds: 6,
      infoText: (_data, matches, output) => matches.id === '6715' ? output.in() : output.out(),
      outputStrings: {
        out: Outputs.out,
        in: Outputs.in,
      },
    },
    {
      id: 'DSR Darkdragon Dive Single Tower',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6711', source: 'Nidhogg' }),
      netRegexDe: NetRegexes.ability({ id: '6711', source: 'Nidhogg' }),
      netRegexFr: NetRegexes.ability({ id: '6711', source: 'Nidhogg' }),
      netRegexJa: NetRegexes.ability({ id: '6711', source: 'ニーズヘッグ' }),
      netRegexCn: NetRegexes.ability({ id: '6711', source: '尼德霍格' }),
      netRegexKo: NetRegexes.ability({ id: '6711', source: '니드호그' }),
      condition: Conditions.targetIsYou(),
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Bait',
          de: 'Ködern',
          ja: '誘導',
          ko: '공격 유도',
        },
      },
    },
    {
      id: 'DSR Dive From Grace Number',
      // This comes out ~5s before symbols.
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker(),
      infoText: (data, matches, output) => {
        const id = getHeadmarkerId(data, matches);
        if (id === headmarkers.dot1) {
          data.diveFromGraceNum[matches.target] = 1;
          if (matches.target === data.me)
            return output.num1();
        } else if (id === headmarkers.dot2) {
          data.diveFromGraceNum[matches.target] = 2;
          if (matches.target === data.me)
            return output.num2();
        } else if (id === headmarkers.dot3) {
          data.diveFromGraceNum[matches.target] = 3;
          if (matches.target === data.me)
            return output.num3();
        }
      },
      outputStrings: {
        num1: Outputs.num1,
        num2: Outputs.num2,
        num3: Outputs.num3,
      },
    },
    {
      id: 'DSR Dive From Grace Dir Collect',
      type: 'GainsEffect',
      // AC3 = High Jump Target
      // AC4 = Spineshatter Dive Target
      // AC5 = Elusive Jump Target
      // This only matches on non-circles.
      netRegex: NetRegexes.gainsEffect({ effectId: ['AC4', 'AC5'] }),
      run: (data, matches) => {
        const duration = parseFloat(matches.duration);
        // These come out in 9, 19, 30 seconds.
        if (duration < 15)
          data.diveFromGraceHasArrow[1] = true;
        else if (duration < 25)
          data.diveFromGraceHasArrow[2] = true;
        else
          data.diveFromGraceHasArrow[3] = true;
      },
    },
    {
      id: 'DSR Dive From Grace Dir You',
      type: 'GainsEffect',
      // AC3 = High Jump Target
      // AC4 = Spineshatter Dive Target
      // AC5 = Elusive Jump Target
      netRegex: NetRegexes.gainsEffect({ effectId: ['AC3', 'AC4', 'AC5'] }),
      condition: Conditions.targetIsYou(),
      delaySeconds: 0.5,
      alertText: (data, matches, output) => {
        const num = data.diveFromGraceNum[data.me];
        if (!num) {
          console.error(`DFGYou: missing number: ${JSON.stringify(data.diveFromGraceNum)}`);
          return;
        }
        if (matches.effectId === 'AC4')
          return output.upArrow({ num: num });
        else if (matches.effectId === 'AC5')
          return output.downArrow({ num: num });
        if (data.diveFromGraceHasArrow[num])
          return output.circleWithArrows({ num: num });
        return output.circleAllCircles({ num: num });
      },
      outputStrings: {
        circleAllCircles: {
          en: '#${num} All Circles',
          ko: '#${num} 전부 하이점프',
        },
        circleWithArrows: {
          en: '#${num} Circle (with arrows)',
          ko: '#${num} 하이점프 (다른사람 화살표)',
        },
        upArrow: {
          en: '#${num} Up Arrow',
          ko: '#${num} 위 화살표 (척추 강타)',
        },
        downArrow: {
          en: '#${num} Down Arrow',
          ko: '#${num} 아래 화살표 (교묘한 점프)',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Empty Dimension/Full Dimension': 'Empty/Full Dimension',
        'Lash and Gnash/Gnash and Lash': 'Lash and Gnash',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'King Thordan': 'Thordan',
        'Nidhogg': 'Nidhogg',
        'Right Eye': 'Rechtes Drachenauge',
        'Ser Adelphel': 'Adelphel',
        'Ser Charibert': 'Charibert',
        'Ser Grinnaux': 'Grinnaux',
        'Ser Guerrique': 'Guerrique',
        'Ser Haumeric': 'Haumeric',
        'Ser Hermenost': 'Hermenost',
        'Ser Ignasse': 'Ignasse',
        'Ser Janlenoux': 'Janlenoux',
        'Ser Noudenet': 'Noudenet',
        'Ser Zephirin': 'Zephirin',
      },
      'replaceText': {
        'Aetheric Burst': 'Ätherschub',
        'Ancient Quaga': 'Seisga Antiqua',
        'Ascalon\'s Mercy Concealed': 'Askalons geheime Gnade',
        'Ascalon\'s Might': 'Macht von Askalon',
        'Brightblade\'s Steel': 'Schimmernder Stahl',
        'Brightwing(?!ed)': 'Lichtschwinge',
        'Brightwinged Flight': 'Flug der Lichtschwingen',
        'Broad Swing': 'Ausladender Schwung',
        'Conviction': 'Konviktion',
        'Darkdragon Dive': 'Dunkeldrachensturz',
        'Dimensional Collapse': 'Dimensionskollaps',
        'Dive from Grace': 'Gefallener Drache ',
        'Drachenlance': 'Drachenlanze',
        'Empty Dimension': 'Dimension der Leere',
        'Execution': 'Exekution',
        'Eye of the Tyrant': 'Auge des Tyrannen',
        'Faith Unmoving': 'Fester Glaube',
        'Final Chorus': 'Endchoral',
        'Flare Nova': 'Flare Nova',
        'Flare Star': 'Flare-Stern',
        'Full Dimension': 'Dimension der Weite',
        'Geirskogul': 'Geirskogul',
        'Gnash and Lash': 'Reißen und Beißen',
        'Hatebound': 'Nidhoggs Hass',
        'Heavenly Heel': 'Himmelsschritt',
        'Heavens\' Stake': 'Himmelslanze',
        'Heavensblaze': 'Himmlisches Lodern',
        'Heavensflame': 'Himmlische Flamme',
        'Heavy Impact': 'Heftiger Einschlag',
        'Hiemal Storm': 'Hiemaler Sturm',
        'Holiest of Holy': 'Quell der Heiligkeit',
        'Holy Bladedance': 'Geweihter Schwerttanz',
        'Holy Comet': 'Heiliger Komet',
        'Holy Shield Bash': 'Heiliger Schildschlag',
        'Hyperdimensional Slash': 'Hyperdimensionsschlag',
        'Incarnation': 'Inkarnation',
        'Knights of the Round': 'Ritter der Runde',
        'Lash and Gnash': 'Beißen und Reißen',
        'Lightning Storm': 'Blitzsturm',
        'Mirage Dive': 'Illusionssprung',
        'Planar Prison': 'Dimensionsfalle',
        'Pure of Heart': 'Reines Herz',
        'Resentment': 'Bitterer Groll',
        'Revenge of the Horde': 'Rache der Horde',
        'Sacred Sever': 'Sakralschnitt',
        'Sanctity of the Ward': 'Erhabenheit der Königsschar',
        'Skyblind': 'Lichtblind',
        'Skyward Leap': 'Luftsprung',
        'Soul Tether': 'Seelenstrick',
        'Spear of the Fury': 'Speer der Furie',
        'Spiral Thrust': 'Spiralstoß',
        'Steep in Rage': 'Welle des Zorns',
        'Strength of the Ward': 'Übermacht der Königsschar',
        'The Bull\'s Steel': 'Unbändiger Stahl',
        'The Dragon\'s Gaze': 'Blick des Drachen',
        'The Dragon\'s Glory': 'Ruhm des Drachen',
        'The Dragon\'s Rage': 'Zorn des Drachen',
        'Tower': 'Turm',
        'Ultimate End': 'Ultimatives Ende',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'King Thordan': 'roi Thordan',
        'Nidhogg': 'Nidhogg',
        'Right Eye': 'Œil droit',
        'Ser Adelphel': 'sire Adelphel',
        'Ser Charibert': 'sire Charibert',
        'Ser Grinnaux': 'sire Grinnaux',
        'Ser Guerrique': 'sire Guerrique',
        'Ser Haumeric': 'sire Haumeric',
        'Ser Hermenost': 'sire Hermenoist',
        'Ser Ignasse': 'sire Ignassel',
        'Ser Janlenoux': 'sire Janlenoux',
        'Ser Noudenet': 'sire Noudenet',
        'Ser Zephirin': 'sire Zéphirin',
      },
      'replaceText': {
        'Aetheric Burst': 'Explosion éthérée',
        'Ancient Quaga': 'Méga Séisme ancien',
        'Ascalon\'s Mercy Concealed': 'Grâce d\'Ascalon dissimulée',
        'Ascalon\'s Might': 'Puissance d\'Ascalon',
        'Brightblade\'s Steel': 'Résolution radiante',
        'Brightwing(?!ed)': 'Aile lumineuse',
        'Brightwinged Flight': 'Vol céleste',
        'Broad Swing': 'Grand balayage',
        'Conviction': 'Conviction',
        'Darkdragon Dive': 'Piqué du dragon sombre',
        'Dimensional Collapse': 'Effondrement dimensionnel',
        'Dive from Grace': 'Dragon déchu',
        'Drachenlance': 'Drachenlance',
        'Empty Dimension': 'Vide dimensionnel',
        'Execution': 'Exécution',
        'Eye of the Tyrant': 'Œil du tyran',
        'Faith Unmoving': 'Foi immuable',
        'Final Chorus': 'Chant ultime',
        'Flare Nova': 'Désastre flamboyant',
        'Flare Star': 'Astre flamboyant',
        'Full Dimension': 'Plénitude dimensionnelle',
        'Geirskogul': 'Geirskögul',
        'Gnash and Lash': 'Grincement tordu',
        'Hatebound': 'Lacération de Nidhogg',
        'Heavenly Heel': 'Estoc céleste',
        'Heavens\' Stake': 'Pal d\'azur',
        'Heavensblaze': 'Embrasement céleste',
        'Heavensflame': 'Flamme céleste',
        'Heavy Impact': 'Impact violent',
        'Hiemal Storm': 'Tempête hiémale',
        'Holiest of Holy': 'Saint des saints',
        'Holy Bladedance': 'Danse de la lame céleste',
        'Holy Comet': 'Comète miraculeuse',
        'Holy Shield Bash': 'Coup de bouclier saint',
        'Hyperdimensional Slash': 'Lacération hyperdimensionnelle',
        'Incarnation': 'Incarnation sacrée',
        'Knights of the Round': 'Chevaliers de la Table ronde',
        'Lash and Gnash': 'Torsion grinçante',
        'Lightning Storm': 'Pluie d\'éclairs',
        'Mirage Dive': 'Piqué mirage',
        'Planar Prison': 'Prison dimensionnelle',
        'Pure of Heart': 'Pureté du cœur',
        'Resentment': 'Râle d\'agonie',
        'Revenge of the Horde': 'Chant pour l\'avenir',
        'Sacred Sever': 'Scission sacrée',
        'Sanctity of the Ward': 'Béatitude du Saint-Siège',
        'Skyblind': 'Sceau céleste',
        'Skyward Leap': 'Bond céleste',
        'Soul Tether': 'Bride de l\'âme',
        'Spear of the Fury': 'Lance de la Conquérante',
        'Spiral Thrust': 'Transpercement tournoyant',
        'Steep in Rage': 'Onde de fureur',
        'Strength of the Ward': 'Force du Saint-Siège',
        'The Bull\'s Steel': 'Résolution rueuse',
        'The Dragon\'s Gaze': 'Regard du dragon',
        'The Dragon\'s Glory': 'Gloire du dragon',
        'The Dragon\'s Rage': 'Colère du dragon',
        'Ultimate End': 'Fin ultime',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'King Thordan': '騎神トールダン',
        'Nidhogg': 'ニーズヘッグ',
        'Right Eye': '竜の右眼',
        'Ser Adelphel': '聖騎士アデルフェル',
        'Ser Charibert': '聖騎士シャリベル',
        'Ser Grinnaux': '聖騎士グリノー',
        'Ser Guerrique': '聖騎士ゲリック',
        'Ser Haumeric': '聖騎士オムリク',
        'Ser Hermenost': '聖騎士エルムノスト',
        'Ser Ignasse': '聖騎士イニアセル',
        'Ser Janlenoux': '聖騎士ジャンルヌ',
        'Ser Noudenet': '聖騎士ヌドゥネー',
        'Ser Zephirin': '聖騎士ゼフィラン',
      },
      'replaceText': {
        'Aetheric Burst': 'エーテルバースト',
        'Ancient Quaga': 'エンシェントクエイガ',
        'Ascalon\'s Mercy Concealed': 'インビジブル・アスカロンメルシー',
        'Ascalon\'s Might': 'アスカロンマイト',
        'Brightblade\'s Steel': '美剣の覚悟',
        'Brightwing(?!ed)': '光翼閃',
        'Brightwinged Flight': '蒼天の光翼',
        'Broad Swing': '大振り',
        'Conviction': 'コンヴィクション',
        'Darkdragon Dive': 'ダークドラゴンダイブ',
        'Dimensional Collapse': 'ディメンションクラッシュ',
        'Dive from Grace': '堕天のドラゴンダイブ',
        'Drachenlance': 'ドラッケンランス',
        'Empty Dimension': 'エンプティディメンション',
        'Execution': 'エクスキューション',
        'Eye of the Tyrant': 'アイ・オブ・タイラント',
        'Faith Unmoving': 'フェイスアンムーブ',
        'Final Chorus': '終焉の竜詩',
        'Flare Nova': 'フレアディザスター',
        'Flare Star': 'フレアスター',
        'Full Dimension': 'フルディメンション',
        'Geirskogul': 'ゲイルスコグル',
        'Gnash and Lash': '牙尾の連旋',
        'Hatebound': '邪竜爪牙',
        'Heavenly Heel': 'ヘヴンリーヒール',
        'Heavens\' Stake': 'ヘヴンステイク',
        'Heavensblaze': 'ヘヴンブレイズ',
        'Heavensflame': 'ヘヴンフレイム',
        'Heavy Impact': 'ヘヴィインパクト',
        'Hiemal Storm': 'ハイマルストーム',
        'Holiest of Holy': 'ホリエストホーリー',
        'Holy Bladedance': 'ホーリーブレードダンス',
        'Holy Comet': 'ホーリーコメット',
        'Holy Shield Bash': 'ホーリーシールドバッシュ',
        'Hyperdimensional Slash': 'ハイパーディメンション',
        'Incarnation': '聖徒化',
        'Knights of the Round': 'ナイツ・オブ・ラウンド',
        'Lash and Gnash': '尾牙の連旋',
        'Lightning Storm': '百雷',
        'Mirage Dive': 'ミラージュダイブ',
        'Planar Prison': 'ディメンションジェイル',
        'Pure of Heart': 'ピュア・オブ・ハート',
        'Resentment': '苦悶の咆哮',
        'Revenge of the Horde': '最期の咆哮',
        'Sacred Sever': 'セイクリッドカット',
        'Sanctity of the Ward': '蒼天の陣：聖杖',
        'Skyblind': '蒼天の刻印',
        'Skyward Leap': 'スカイワードリープ',
        'Soul Tether': 'ソウルテザー',
        'Spear of the Fury': 'スピア・オブ・ハルオーネ',
        'Spiral Thrust': 'スパイラルスラスト',
        'Steep in Rage': '憤怒の波動',
        'Strength of the Ward': '蒼天の陣：雷槍',
        'The Bull\'s Steel': '戦狂の覚悟',
        'The Dragon\'s Gaze': '竜の邪眼',
        'The Dragon\'s Glory': '邪竜の眼光',
        'The Dragon\'s Rage': '邪竜の魔炎',
        'Ultimate End': 'アルティメットエンド',
      },
    },
    {
      'locale': 'cn',
      'missingTranslations': true,
      'replaceSync': {
        'King Thordan': '骑神托尔丹',
        'Nidhogg': '尼德霍格',
        'Right Eye': '巨龙右眼',
        'Ser Adelphel': '圣骑士阿代尔斐尔',
        'Ser Charibert': '圣骑士沙里贝尔',
        'Ser Grinnaux': '圣骑士格里诺',
        'Ser Guerrique': '圣骑士盖里克',
        'Ser Haumeric': '圣骑士奥默里克',
        'Ser Hermenost': '圣骑士埃尔姆诺斯特',
        'Ser Ignasse': '圣骑士伊尼亚斯',
        'Ser Janlenoux': '圣骑士让勒努',
        'Ser Noudenet': '圣骑士努德内',
        'Ser Zephirin': '圣骑士泽菲兰',
      },
      'replaceText': {
        'Aetheric Burst': '以太爆发',
        'The Dragon\'s Gaze': '龙眼之邪',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {
        'King Thordan': '기사신 토르당',
        'Nidhogg': '니드호그',
        'Right Eye': '용의 오른눈',
        'Ser Adelphel': '성기사 아델펠',
        'Ser Charibert': '성기사 샤리베르',
        'Ser Grinnaux': '성기사 그리노',
        'Ser Guerrique': '성기사 게리크',
        'Ser Haumeric': '성기사 오메리크',
        'Ser Hermenost': '성기사 에르메노',
        'Ser Ignasse': '성기사 이냐스',
        'Ser Janlenoux': '성기사 장르누',
        'Ser Noudenet': '성기사 누데네',
        'Ser Zephirin': '성기사 제피랭',
      },
      'replaceText': {
        'Aetheric Burst': '에테르 분출',
        'The Dragon\'s Gaze': '용의 마안',
      },
    },
  ],
});
