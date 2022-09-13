const centerX = 100;
const centerY = 100;
const positionMatchesTo8Dir = (combatant) => {
  const x = parseFloat(combatant.x) - centerX;
  const y = parseFloat(combatant.y) - centerY;
  // Dirs: N = 0, NE = 1, ..., NW = 7
  return Math.round(4 - 4 * Math.atan2(x, y) / Math.PI) % 8;
};
const positionTo8Dir = (combatant) => {
  const x = combatant.PosX - centerX;
  const y = combatant.PosY - centerY;
  // Dirs: N = 0, NE = 1, ..., NW = 7
  return Math.round(4 - 4 * Math.atan2(x, y) / Math.PI) % 8;
};
Options.Triggers.push({
  zoneId: ZoneId.AbyssosTheEighthCircleSavage,
  timelineFile: 'p8s.txt',
  initData: () => {
    return {
      combatantData: [],
      torches: [],
      flareTargets: [],
      upliftCounter: 0,
      ventIds: [],
      gorgons: [],
      gorgonCount: 0,
      firstSnakeOrder: {},
      firstSnakeDebuff: {},
      secondSnakeGazeFirst: {},
      secondSnakeDebuff: {},
      concept: {},
      splicer: {},
      alignmentTargets: [],
      inverseMagics: {},
      deformationTargets: [],
    };
  },
  timelineTriggers: [
    {
      id: 'P8S Tank Cleave Autos',
      regex: /--auto--/,
      beforeSeconds: 8,
      suppressSeconds: 20,
      alertText: (data, _matches, output) => {
        // TODO: because of how the timeline starts in a doorboss fight, this call occurs
        // somewhere after the first few autos and so feels really weird.  Ideally, figure
        // out some way to call this out immediately when combat starts?? Maybe off engage?
        if (data.seenFirstTankAutos)
          return output.text();
      },
      run: (data) => data.seenFirstTankAutos = true,
      outputStrings: {
        text: {
          en: 'Tank Autos',
          ja: 'タンクへのオートアタック',
          ko: '탱커 평타',
        },
      },
    },
  ],
  triggers: [
    // ---------------- Part 1 ----------------
    {
      id: 'P8S Genesis of Flame',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7944', source: 'Hephaistos', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'P8S Scorching Fang',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7912', source: 'Hephaistos', capture: false }),
      alertText: (data, _matches, output) => {
        if (data.conceptual === 'octa')
          return output.outAndSpread();
        if (data.conceptual === 'tetra')
          return output.outAndStacks();
        return output.out();
      },
      run: (data) => delete data.conceptual,
      outputStrings: {
        out: Outputs.out,
        outAndSpread: {
          en: 'Out + Spread',
          de: 'Raus + Verteilen',
          ja: '黒線の外側 + 散会',
          ko: '밖으로 + 산개',
        },
        outAndStacks: {
          en: 'Out + Stacks',
          de: 'Raus + Sammeln',
          ja: '黒線の外側 + 2人頭割り',
          ko: '밖으로 + 쉐어',
        },
      },
    },
    {
      id: 'P8S Sun\'s Pinion',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7913', source: 'Hephaistos', capture: false }),
      // There are two casts, one for each side.
      suppressSeconds: 1,
      alertText: (data, _matches, output) => {
        if (data.conceptual === 'octa')
          return output.inAndSpread();
        if (data.conceptual === 'tetra')
          return output.inAndStacks();
        return output.in();
      },
      run: (data) => delete data.conceptual,
      outputStrings: {
        in: Outputs.in,
        inAndSpread: {
          en: 'In + Spread',
          de: 'Rein + Verteilen',
          ja: '黒線の内側 + 散会',
          ko: '안으로 + 산개',
        },
        inAndStacks: {
          en: 'In + Stacks',
          de: 'Rein + Sammeln',
          ja: '黒線の内側 + 2人頭割り',
          ko: '안으로 + 쉐어',
        },
      },
    },
    {
      id: 'P8S Flameviper',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7945', source: 'Hephaistos' }),
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'P8S Conceptual Diflare Quadruped',
      type: 'StartsUsing',
      // 7915 normally
      // 7916 during Blazing Footfalls
      netRegex: NetRegexes.startsUsing({ id: '7917', source: 'Hephaistos', capture: false }),
      durationSeconds: 20,
      infoText: (_data, _matches, output) => output.healerGroups(),
      outputStrings: {
        healerGroups: Outputs.healerGroups,
      },
    },
    {
      id: 'P8S Conceptual Tetraflare Quadruped',
      type: 'StartsUsing',
      // 7915 normally
      // 7916 during Blazing Footfalls
      netRegex: NetRegexes.startsUsing({ id: '7916', source: 'Hephaistos', capture: false }),
      durationSeconds: 20,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Partner Stacks',
          de: 'Mit Partner sammeln',
          ja: '2人頭割り',
          ko: '2인 쉐어',
        },
      },
    },
    {
      id: 'P8S Conceptual Tetraflare',
      type: 'StartsUsing',
      // 7915 normally
      // 7916 during Blazing Footfalls
      netRegex: NetRegexes.startsUsing({ id: '7915', source: 'Hephaistos', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      run: (data) => data.conceptual = 'tetra',
      outputStrings: {
        text: {
          en: '(partner stack, for later)',
          de: '(Partner-Stacks, für später)',
          ja: '(後で2人頭割り)',
          ko: '(곧 2인 쉐어)',
        },
      },
    },
    {
      id: 'P8S Conceptual Octaflare',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7914', source: 'Hephaistos', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      run: (data) => data.conceptual = 'octa',
      outputStrings: {
        text: {
          en: '(spread, for later)',
          de: '(Verteilen, für später)',
          ja: '(後で散会)',
          ko: '(곧 산개)',
        },
      },
    },
    {
      id: 'P8S Octaflare',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '791D', source: 'Hephaistos', capture: false }),
      response: Responses.spread('alarm'),
    },
    {
      id: 'P8S Tetraflare',
      type: 'StartsUsing',
      // During vents and also during clones.
      netRegex: NetRegexes.startsUsing({ id: '791E', source: 'Hephaistos', capture: false }),
      alertText: (data, _matches, output) => {
        if (data.illusory === 'bird')
          return output.inAndStacks();
        if (data.illusory === 'snake')
          return output.outAndStacks();
        return output.stacks();
      },
      run: (data) => delete data.illusory,
      outputStrings: {
        inAndStacks: {
          en: 'In + Stacks',
          de: 'Rein + Sammeln',
          ja: '黒線の内側 + 2人頭割り',
          ko: '안으로 + 쉐어',
        },
        outAndStacks: {
          en: 'Out + Stacks',
          de: 'Raus + Sammeln',
          ja: '黒線の外側 + 2人頭割り',
          ko: '밖으로 + 쉐어',
        },
        stacks: {
          en: 'Partner Stacks',
          de: 'Mit Partner sammeln',
          ja: '2人頭割り',
          ko: '2인 쉐어',
        },
      },
    },
    {
      id: 'P8S Nest of Flamevipers',
      type: 'StartsUsing',
      // During clones.
      netRegex: NetRegexes.startsUsing({ id: '791F', source: 'Hephaistos', capture: false }),
      alertText: (data, _matches, output) => {
        if (data.illusory === 'bird')
          return output.inAndProtean();
        if (data.illusory === 'snake')
          return output.outAndProtean();
        // This shouldn't happen, but just in case.
        return output.protean();
      },
      run: (data) => delete data.illusory,
      outputStrings: {
        inAndProtean: {
          en: 'In + Protean',
          de: 'Rein + Himmelsrichtung',
          ja: '黒線の内側 + 基本散会',
          ko: '안으로 + 산개',
        },
        outAndProtean: {
          en: 'Out + Protean',
          de: 'Raus + Himmelsrichtung',
          ja: '黒線の外側 + 散会',
          ko: '밖으로 + 산개',
        },
        protean: {
          en: 'Protean',
          de: 'Himmelsrichtung',
          ja: '散会',
          ko: '산개',
        },
      },
    },
    {
      id: 'P8S Torch Flame Collect',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7927', source: 'Hephaistos' }),
      run: (data, matches) => data.torches.push(matches),
    },
    {
      id: 'P8S Torch Flame',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7927', source: 'Hephaistos', capture: false }),
      delaySeconds: 0.5,
      suppressSeconds: 1,
      promise: async (data) => {
        data.combatantData = [];
        const ids = data.torches.map((torch) => parseInt(torch.sourceId, 16));
        data.combatantData = (await callOverlayHandler({
          call: 'getCombatants',
          ids: ids,
        })).combatants;
        data.torches = [];
      },
      alertText: (data, _matches, output) => {
        if (data.combatantData.length === 0)
          return;
        const safe = {
          cornerNW: true,
          cornerNE: true,
          cornerSE: true,
          cornerSW: true,
          // Unlike normal mode, these "outside" are two tiles and not 4,
          // e.g. "outsideNorth" = NNW/NNE tiles.
          // The ordering here matters.
          outsideNorth: true,
          insideNorth: true,
          outsideWest: true,
          insideWest: true,
          outsideEast: true,
          insideEast: true,
          outsideSouth: true,
          insideSouth: true,
        };
        // idx = x + y * 4
        // This map is the tile index mapped to the keys that any
        // torch exploding on that square would make unsafe.
        const unsafeMap = {
          0: ['cornerNW'],
          1: ['outsideNorth'],
          2: ['outsideNorth'],
          3: ['cornerNE'],
          4: ['outsideWest'],
          5: ['insideWest', 'insideNorth'],
          6: ['insideEast', 'insideNorth'],
          7: ['outsideEast'],
          8: ['outsideWest'],
          9: ['insideWest', 'insideSouth'],
          10: ['insideEast', 'insideSouth'],
          11: ['outsideEast'],
          12: ['cornerSW'],
          13: ['outsideSouth'],
          14: ['outsideSouth'],
          15: ['cornerSE'],
        };
        // Loop through all torches, remove any rows/columns it intersects with
        // to find safe lanes.
        for (const torch of data.combatantData) {
          // x, y = 85, 95, 105, 115
          // map to ([0, 3], [0, 3])
          const x = Math.floor((torch.PosX - 85) / 10);
          const y = Math.floor((torch.PosY - 85) / 10);
          const idx = x + y * 4;
          const unsafeArr = unsafeMap[idx];
          for (const entry of unsafeArr ?? [])
            delete safe[entry];
        }
        const safeKeys = Object.keys(safe);
        const [safe0, safe1, safe2, safe3] = safeKeys;
        // Unexpectedly zero safe zones.
        if (safe0 === undefined)
          return;
        // Special case inner four squares.
        if (
          safeKeys.length === 4 &&
          // Ordered same as keys above.
          safe0 === 'insideNorth' &&
          safe1 === 'insideWest' &&
          safe2 === 'insideEast' &&
          safe3 === 'insideSouth'
        )
          return output.insideSquare();
        // Not set up to handle more than two safe zones.
        if (safe2 !== undefined)
          return;
        if (safe1 === undefined)
          return output[safe0]();
        const dir1 = output[safe0]();
        const dir2 = output[safe1]();
        return output.combo({ dir1: dir1, dir2: dir2 });
      },
      outputStrings: {
        combo: {
          en: '${dir1} / ${dir2}',
          de: '${dir1} / ${dir2}',
          ja: '${dir1} / ${dir2}',
          ko: '${dir1} / ${dir2}',
        },
        insideSquare: {
          en: 'Inside Square',
          de: 'Inneres Viereck',
          ja: '内側の四角の中',
          ko: '중앙',
        },
        cornerNW: {
          en: 'NW Corner',
          de: 'NW Ecke',
          ja: '北西の隅',
          ko: '북서쪽 구석',
        },
        cornerNE: {
          en: 'NE Corner',
          de: 'NO Ecke',
          ja: '北東の隅',
          ko: '북동쪽 구석',
        },
        cornerSE: {
          en: 'SE Corner',
          de: 'SO Ecke',
          ja: '南東の隅',
          ko: '남동쪽 구석',
        },
        cornerSW: {
          en: 'SW Corner',
          de: 'SW Ecke',
          ja: '南西の隅',
          ko: '남서쪽 구석',
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
      id: 'P8S Ektothermos',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '79EA', source: 'Hephaistos', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'P8S Footprint',
      type: 'Ability',
      // There is 6.4 seconds between this Reforged Reflection ability and the Footprint (7109) ability.
      netRegex: NetRegexes.ability({ id: '794B', source: 'Hephaistos', capture: false }),
      delaySeconds: 1.5,
      response: Responses.knockback(),
    },
    {
      id: 'P8S Snaking Kick',
      type: 'StartsUsing',
      // This is the Reforged Reflection cast.
      netRegex: NetRegexes.startsUsing({ id: '794C', source: 'Hephaistos', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'P8S Gorgon Collect',
      type: 'AddedCombatant',
      netRegex: NetRegexes.addedCombatantFull({ npcNameId: '11517', npcBaseId: '15052' }),
      // We could technically call WAY ahead of time here.
      run: (data, matches) => data.gorgons.push(matches),
    },
    {
      id: 'P8S Gorgon Location',
      type: 'StartsUsing',
      // We could call the very first one out immediately on the Added Combatant line,
      // but then we'd have to duplicate this.
      netRegex: NetRegexes.startsUsing({ id: '792B', capture: false }),
      suppressSeconds: 1,
      infoText: (data, _matches, output) => {
        data.gorgonCount++;
        // Gorgons fire in order of actor id (highest first), but are added in any order.
        // Sort from lowest id to highest, so we can pull off the end.
        data.gorgons.sort((a, b) => a.id.localeCompare(b.id));
        const gorgons = [];
        if (data.gorgonCount === 1 || data.gorgonCount === 2) {
          // For Snake 1, all positions are known ahead of time, so do 2 at a time.
          const g0 = data.gorgons.pop();
          const g1 = data.gorgons.pop();
          if (g0 === undefined || g1 === undefined)
            return;
          gorgons.push(g0);
          gorgons.push(g1);
        } else {
          // For Snake 2, just call all at once.
          gorgons.push(...data.gorgons);
          data.gorgons = [];
        }
        if (gorgons.length !== 2 && gorgons.length !== 4)
          return;
        const dirs = gorgons.map(positionMatchesTo8Dir).sort();
        const [d0, d1] = dirs;
        if (d0 === undefined || d1 === undefined)
          return;
        if (dirs.length === 4)
          return d0 === 0 ? output.intercards() : output.cardinals();
        const outputMap = {
          0: output.dirN(),
          1: output.dirNE(),
          2: output.dirE(),
          3: output.dirSE(),
          4: output.dirS(),
          5: output.dirSW(),
          6: output.dirW(),
          7: output.dirNW(),
        };
        const dir1 = outputMap[d0] ?? output.unknown();
        const dir2 = outputMap[d1] ?? output.unknown();
        return output.gorgons({ dir1: dir1, dir2: dir2 });
      },
      outputStrings: {
        cardinals: {
          en: 'Look Cardinals',
          ja: '視線を斜めに',
        },
        intercards: {
          en: 'Look Intercards',
          ja: '視線を十字に',
        },
        gorgons: {
          en: '${dir1}/${dir2} Gorgons',
          ja: 'ゴルゴン：${dir1}/${dir2}',
        },
        dirN: Outputs.dirN,
        dirNE: Outputs.dirNE,
        dirE: Outputs.dirE,
        dirSE: Outputs.dirSE,
        dirS: Outputs.dirS,
        dirSW: Outputs.dirSW,
        dirW: Outputs.dirW,
        dirNW: Outputs.dirNW,
        unknown: Outputs.unknown,
      },
    },
    {
      id: 'P8S First Snake Debuff Collect',
      // BBC = First in Line
      // BBD = Second in Line,
      // D17 = Eye of the Gorgon
      // D18 = Crown of the Gorgon
      // CFE = Blood of the Gorgon
      // CFF = Breath of the Gorgon
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['BB[CD]', 'D17', 'CFE'] }),
      condition: (data) => !data.firstSnakeCalled,
      run: (data, matches) => {
        const id = matches.effectId;
        if (id === 'BBC')
          data.firstSnakeOrder[matches.target] = 1;
        else if (id === 'BBD')
          data.firstSnakeOrder[matches.target] = 2;
        else if (id === 'D17')
          data.firstSnakeDebuff[matches.target] = 'gaze';
        else if (id === 'CFE')
          data.firstSnakeDebuff[matches.target] = 'poison';
      },
    },
    {
      id: 'P8S First Snake Debuff Initial Call',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['BB[CD]', 'D17', 'CFE'], capture: false }),
      condition: (data) => !data.firstSnakeCalled,
      delaySeconds: 0.3,
      suppressSeconds: 1,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          firstGaze: {
            en: 'First Gaze (w/ ${player})',
            ja: '先の石化 (+${player})',
            ko: '첫번째 석화 (+ ${player})',
          },
          secondGaze: {
            en: 'Second Gaze (w/ ${player})',
            ja: '後の石化 (+${player})',
            ko: '두번째 석화 (+ ${player})',
          },
          firstPoison: {
            en: 'First Poison (w/ ${player})',
            ja: '先の毒 (+${player})',
            ko: '첫번째 독장판 (+ ${player})',
          },
          secondPoison: {
            en: 'Second Poison (w/ ${player})',
            ja: '後の毒 (+${player})',
            ko: '두번째 독장판 (+ ${player})',
          },
          unknown: Outputs.unknown,
        };
        const myNumber = data.firstSnakeOrder[data.me];
        if (myNumber === undefined)
          return;
        const myDebuff = data.firstSnakeDebuff[data.me];
        if (myDebuff === undefined)
          return;
        let partner = output.unknown();
        for (const [name, theirDebuff] of Object.entries(data.firstSnakeDebuff)) {
          if (myDebuff !== theirDebuff || name === data.me)
            continue;
          const theirNumber = data.firstSnakeOrder[name];
          if (myNumber === theirNumber) {
            partner = data.ShortName(name);
            break;
          }
        }
        if (myNumber === 1) {
          if (myDebuff === 'gaze')
            return { alertText: output.firstGaze({ player: partner }) };
          return { alertText: output.firstPoison({ player: partner }) };
        }
        if (myDebuff === 'gaze')
          return { infoText: output.secondGaze({ player: partner }) };
        return { infoText: output.secondPoison({ player: partner }) };
      },
      run: (data) => data.firstSnakeCalled = true,
    },
    {
      id: 'P8S Second Snake Debuff Collect',
      // D17 = Eye of the Gorgon (gaze)
      // D18 = Crown of the Gorgon (shriek)
      // CFE = Blood of the Gorgon (small poison)
      // CFF = Breath of the Gorgon (stack poison)
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['D1[78]', 'CFF'] }),
      condition: (data) => data.firstSnakeCalled,
      run: (data, matches) => {
        let _a;
        let _b;
        const id = matches.effectId;
        if (id === 'D17') {
          // 23s short, 29s long
          const duration = parseFloat(matches.duration);
          data.secondSnakeGazeFirst[matches.target] = duration < 24;
          (_a = data.secondSnakeDebuff)[_b = matches.target] ?? (_a[_b] = 'nothing');
        } else if (id === 'D18') {
          data.secondSnakeDebuff[matches.target] = 'shriek';
        } else if (id === 'CFF') {
          data.secondSnakeDebuff[matches.target] = 'stack';
        }
      },
    },
    {
      id: 'P8S Second Snake Debuff Initial Call',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['D1[78]', 'CFF'], capture: false }),
      condition: (data) => data.firstSnakeCalled,
      delaySeconds: 0.3,
      durationSeconds: 6,
      suppressSeconds: 1,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          firstGaze: {
            en: 'First Gaze',
            ja: '先の石化',
            ko: '첫번째 석화',
          },
          secondGaze: {
            en: 'Second Gaze',
            ja: '後の石化',
            ko: '두번째 석화',
          },
          shriek: {
            en: 'Shriek later (with ${player})',
            ja: '自分に全体石化 (+${player})',
            ko: '나중에 마안 (+ ${player})',
          },
          stack: {
            en: 'Stack later (with ${player})',
            ja: '自分に頭割り (+${player})',
            ko: '나중에 쉐어 (+ ${player})',
          },
          noDebuff: {
            en: 'No debuff (w/ ${player1}, ${player2}, ${player3})',
            ja: '無職 (${player1}, ${player2}, ${player3})',
            ko: '디버프 없음 (+ ${player1}, ${player2}, ${player3})',
          },
        };
        const isGazeFirst = data.secondSnakeGazeFirst[data.me];
        const myDebuff = data.secondSnakeDebuff[data.me];
        if (isGazeFirst === undefined || myDebuff === undefined)
          return;
        const friends = [];
        for (const [name, theirDebuff] of Object.entries(data.secondSnakeDebuff)) {
          if (myDebuff === theirDebuff && name !== data.me)
            friends.push(data.ShortName(name));
        }
        const gazeAlert = isGazeFirst ? output.firstGaze() : output.secondGaze();
        if (myDebuff === 'nothing') {
          return {
            alertText: gazeAlert,
            infoText: output.noDebuff({ player1: friends[0], player2: friends[1], player3: friends[2] }),
          };
        }
        if (myDebuff === 'shriek') {
          return {
            alertText: gazeAlert,
            infoText: output.shriek({ player: friends[0] }),
          };
        }
        if (myDebuff === 'stack') {
          return {
            alertText: gazeAlert,
            infoText: output.stack({ player: friends[0] }),
          };
        }
      },
    },
    {
      id: 'P8S Uplift Counter',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '7935', source: 'Hephaistos', capture: false }),
      // Count in a separate trigger so that we can suppress it, but still call out for
      // both people hit.
      preRun: (data, _matches) => data.upliftCounter++,
      durationSeconds: 1.7,
      suppressSeconds: 1,
      sound: '',
      infoText: (data, _matches, output) => output.text({ num: data.upliftCounter }),
      tts: null,
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
      id: 'P8S Uplift Number',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '7935', source: 'Hephaistos' }),
      condition: Conditions.targetIsYou(),
      // ~12.8 seconds between #1 Uplift (7935) to #1 Stomp Dead (7937)
      // ~13.8 seconds between #4 Uplift (7935) to #4 Stomp Dead (7937).
      // Split the difference with 13.3 seconds.
      durationSeconds: 13.3,
      alertText: (data, _matches, output) => output.text({ num: data.upliftCounter }),
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
      id: 'P8S Quadrupedal Impact',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7A04', source: 'Hephaistos', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Follow Jump',
          de: 'Sprung folgen',
          ja: '近づく',
          ko: '보스 따라가기',
        },
      },
    },
    {
      id: 'P8S Quadrupedal Crush',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7A05', source: 'Hephaistos', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Away From Jump',
          de: 'Weg vom Sprung',
          ja: '離れる',
          ko: '멀리 떨어지기',
        },
      },
    },
    {
      id: 'P8S Illusory Hephaistos Scorched Pinion First',
      type: 'StartsUsing',
      // This is "Illusory Hephaistos" but sometimes it says "Gorgon", so drop the name.
      // This trigger calls out the Scorched Pinion location (7953), but is looking
      // for the Scorching Fang (7952) ability.  The reason for this is that there are
      // two casts of 7953 and only one 7952, and there's some suspicion that position
      // data may be incorrect on one of the 7953 mobs.
      netRegex: NetRegexes.startsUsing({ id: '7952' }),
      condition: (data) => data.flareTargets.length === 0,
      // For some reason the position data does not appear to be correct for either
      // 7952 or 7953.  Add a delay to hope that it gets up to date.
      // 7952/7953 is the real damage.  We could also try looking for 7950/7951, which is
      // a different mob with the Sunforge cast bar.  This might be in the correct place.
      delaySeconds: 0.3,
      promise: async (data, matches) => {
        data.combatantData = [];
        const id = parseInt(matches.sourceId, 16);
        data.combatantData = (await callOverlayHandler({
          call: 'getCombatants',
          ids: [id],
        })).combatants;
      },
      alertText: (data, _matches, output) => {
        const combatant = data.combatantData[0];
        if (combatant === undefined || data.combatantData.length !== 1)
          return;
        // This trigger finds the snake, so call the opposite.
        const dir = positionTo8Dir(combatant);
        if (dir === 0 || dir === 4)
          return output.eastWest();
        if (dir === 2 || dir === 6)
          return output.northSouth();
      },
      outputStrings: {
        northSouth: {
          en: 'North/South Bird',
          de: 'Norden/Süden Vogel',
          ja: '南北フェニックス',
          ko: '새 남/북쪽',
        },
        eastWest: {
          en: 'East/West Bird',
          de: 'Osten/Westen Vogel',
          ja: '東西フェニックス',
          ko: '새 동/서쪽',
        },
      },
    },
    {
      id: 'P8S Illusory Hephaistos Scorched Pinion Second',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7953', source: 'Illusory Hephaistos', capture: false }),
      condition: (data) => data.flareTargets.length > 0,
      suppressSeconds: 1,
      run: (data) => data.illusory = 'bird',
    },
    {
      id: 'P8S Illusory Hephaistos Scorching Fang Second',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7952', source: 'Illusory Hephaistos', capture: false }),
      condition: (data) => data.flareTargets.length > 0,
      suppressSeconds: 1,
      run: (data) => data.illusory = 'snake',
    },
    {
      id: 'P8S Hemitheos\'s Flare Hit',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '72CE', source: 'Hephaistos' }),
      preRun: (data, matches) => data.flareTargets.push(matches.target),
      alertText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.text();
      },
      outputStrings: {
        text: {
          en: '(avoid proteans)',
          de: '(weiche Himmelsrichtungen aus)',
          ja: '(回避、離れる)',
          ko: '(피하기)',
        },
      },
    },
    {
      id: 'P8S Hemitheos\'s Flare Not Hit',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '72CE', source: 'Hephaistos', capture: false }),
      delaySeconds: 0.5,
      suppressSeconds: 1,
      infoText: (data, _matches, output) => {
        if (!data.flareTargets.includes(data.me))
          return output.text();
      },
      outputStrings: {
        text: {
          en: 'In for Protean',
          de: 'rein für Himmelsrichtungen',
          ja: '近づく、内側で誘導',
          ko: '안에서 장판 유도',
        },
      },
    },
    {
      id: 'P8S Suneater Cthonic Vent Add',
      type: 'AddedCombatant',
      netRegex: NetRegexes.addedCombatantFull({ npcNameId: '11404' }),
      run: (data, matches) => data.ventIds.push(matches.id),
    },
    {
      id: 'P8S Suneater Cthonic Vent Initial',
      type: 'StartsUsing',
      // TODO: vents #2 and #3 are hard, but the first vent cast has a ~5s cast time.
      netRegex: NetRegexes.startsUsing({ id: '7925', capture: false }),
      suppressSeconds: 1,
      promise: async (data) => {
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
          return output.south();
        // adjacent unsafe spots, cardinal is safe
        if (unsafe1 - unsafe0 === 2) {
          // this average is safe to do because wraparound was taken care of above.
          const unsafeCard = Math.floor((unsafe0 + unsafe1) / 2);
          const safeDirMap = {
            0: output.south(),
            2: output.west(),
            4: output.north(),
            6: output.east(),
          };
          return safeDirMap[unsafeCard] ?? output.unknown();
        }
        // two intercards are safe, they are opposite each other,
        // so we can pick the intercard counterclock of each unsafe spot.
        // e.g. 1/5 are unsafe (NE and SW), so SE and NW are safe.
        const safeIntercardMap = {
          1: output.dirNW(),
          3: output.dirNE(),
          5: output.dirSE(),
          7: output.dirSW(),
        };
        const safeStr0 = safeIntercardMap[unsafe0] ?? output.unknown();
        const safeStr1 = safeIntercardMap[unsafe1] ?? output.unknown();
        return output.comboDir({ dir1: safeStr0, dir2: safeStr1 });
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
      id: 'P8S Snake 2 Illusory Creation',
      type: 'StartsUsing',
      // Illusory Creation happens elsewhere, but this id only in Snake 2.
      // This is used to differentiate the 4x 7932 Gorgospit from the 1x 7932 Gorgospit that
      // (ideally) kills two Gorgons.
      netRegex: NetRegexes.startsUsing({ id: '7931', source: 'Hephaistos', capture: false }),
      run: (data) => data.seenSnakeIllusoryCreation = true,
    },
    {
      id: 'P8S Gorgospit Location',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7932' }),
      condition: (data) => data.seenSnakeIllusoryCreation,
      promise: async (data, matches) => {
        data.combatantData = [];
        const id = parseInt(matches.sourceId, 16);
        data.combatantData = (await callOverlayHandler({
          call: 'getCombatants',
          ids: [id],
        })).combatants;
      },
      alertText: (data, _matches, output) => {
        const combatant = data.combatantData[0];
        if (combatant === undefined || data.combatantData.length !== 1)
          return;
        // If Gorgons on cardinals, clone is (100, 100+/-20) or (100+/-20, 100).
        // If Gorgons on intercards, clone is (100+/-10, 100+/ 20) or (100+/-20, 100+/-10).
        // Also sometimes it's +/-11 and not +/-10 (???)
        const x = combatant.PosX;
        const y = combatant.PosY;
        // Add a little slop to find positions, just in case.  See note above about 11 vs 10.
        const epsilon = 3;
        // Handle 4x potential locations for line hitting cardinal Gorgons.
        if (Math.abs(x - 100) < epsilon)
          return output.eastWest();
        if (Math.abs(y - 100) < epsilon)
          return output.northSouth();
        // Handle 8x potential locations for line hitting intercard Gorgons.
        if (Math.abs(x - 90) < epsilon)
          return output.east();
        if (Math.abs(x - 110) < epsilon)
          return output.west();
        if (Math.abs(y - 90) < epsilon)
          return output.south();
        if (Math.abs(y - 110) < epsilon)
          return output.north();
      },
      outputStrings: {
        northSouth: {
          en: 'North / South',
          ja: '南・北',
          ko: '남/북쪽',
        },
        eastWest: {
          en: 'East / West',
          ja: '東・西',
          ko: '동/서쪽',
        },
        north: Outputs.north,
        east: Outputs.east,
        west: Outputs.west,
        south: Outputs.south,
      },
    },
    // ---------------- Part 2 ----------------
    {
      id: 'P8S Aioniopyr',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '79DF', source: 'Hephaistos', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'aoe + bleed',
          de: 'AoE + Blutung',
          ja: 'AOE + 出血',
          ko: '전체 공격 + 도트',
        },
      },
    },
    {
      id: 'P8S Tyrant\'s Unholy Darkness',
      type: 'StartsUsing',
      // Untargeted, with 79DE damage after.
      netRegex: NetRegexes.startsUsing({ id: '79DD', source: 'Hephaistos', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Split Tankbusters',
          de: 'Geteilter Tankbuster',
          ja: '2人同時タンク強攻撃',
          ko: '따로맞는 탱버',
        },
      },
    },
    {
      id: 'P8S Ashing Blaze Right',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '79D7', source: 'Hephaistos', capture: false }),
      alertText: (data, _matches, output) => {
        if (data.firstAlignmentSecondAbility === 'stack')
          return output.rightAndStack();
        if (data.firstAlignmentSecondAbility === 'spread')
          return output.rightAndSpread();
        return output.right();
      },
      run: (data) => delete data.firstAlignmentSecondAbility,
      outputStrings: {
        right: Outputs.right,
        rightAndSpread: {
          en: 'Right + Spread',
          ja: '右 + 散会',
          ko: '오른쪽 + 산개',
        },
        rightAndStack: {
          en: 'Right + Stack',
          ja: '右 + 頭割り',
          ko: '오른쪽 + 쉐어',
        },
      },
    },
    {
      id: 'P8S Ashing Blaze Left',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '79D8', source: 'Hephaistos', capture: false }),
      alertText: (data, _matches, output) => {
        if (data.firstAlignmentSecondAbility === 'stack')
          return output.leftAndStack();
        if (data.firstAlignmentSecondAbility === 'spread')
          return output.leftAndSpread();
        return output.left();
      },
      run: (data) => delete data.firstAlignmentSecondAbility,
      outputStrings: {
        left: Outputs.left,
        leftAndSpread: {
          en: 'Left + Spread',
          ja: '左 + 散会',
          ko: '왼쪽 + 산개',
        },
        leftAndStack: {
          en: 'Left + Stack',
          ja: '左 + 頭割り',
          ko: '왼쪽 + 쉐어',
        },
      },
    },
    {
      id: 'P8S High Concept',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '79AC', source: 'Hephaistos', capture: false }),
      response: Responses.bigAoe(),
      run: (data) => {
        data.concept = {};
        data.splicer = {};
      },
    },
    {
      id: 'P8S Inverse Magics',
      type: 'GainsEffect',
      // This gets recast a lot on the same people, but shouldn't cause an issue.
      // This also only happens once on the second time through, so no need to reset.
      netRegex: NetRegexes.gainsEffect({ effectId: 'D15' }),
      infoText: (data, matches, output) => {
        if (!data.inverseMagics[matches.target])
          return output.reversed({ player: data.ShortName(matches.target) });
      },
      run: (data, matches) => data.inverseMagics[matches.target] = true,
      outputStrings: {
        reversed: {
          en: '${player} reversed',
          ja: 'マジックインヴァージョン：${player}',
          ko: '${player} 반전',
        },
      },
    },
    {
      id: 'P8S Natural Alignment Purple on You',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '9F8', count: '209' }),
      preRun: (data, matches) => data.alignmentTargets.push(matches.target),
      alertText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.text();
      },
      outputStrings: {
        text: {
          en: 'Alignment on YOU',
          ja: '自分に術式',
          ko: '원판 대상자',
        },
      },
    },
    {
      id: 'P8S Natural Alignment Purple Targets',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '9F8', count: '209', capture: false }),
      delaySeconds: 0.3,
      suppressSeconds: 5,
      sound: '',
      infoText: (data, _matches, output) => {
        const [name1, name2] = data.alignmentTargets.sort();
        return output.text({ player1: data.ShortName(name1), player2: data.ShortName(name2) });
      },
      tts: null,
      run: (data) => data.alignmentTargets = [],
      outputStrings: {
        text: {
          en: 'Alignment on ${player1}, ${player2}',
          ja: '術式：${player1}, ${player2}',
          ko: '${player1}, ${player2} 원판',
        },
      },
    },
    {
      id: 'P8S Natural Alignment First',
      type: 'GainsEffect',
      // This is a magic effectId with a statusloopvfx count, like 808 elsewhere.
      netRegex: NetRegexes.gainsEffect({ effectId: '9F8' }),
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          ice: {
            en: 'Ice Groups First',
            ja: '氷の頭割りから',
            ko: '얼음 쉐어 먼저',
          },
          fire: {
            en: 'Fire Partners First',
            ja: '火の2人頭割りから',
            ko: '불 2인쉐어 먼저',
          },
          stack: {
            en: 'Stack First',
            ja: '頭割りから',
            ko: '쉐어 먼저',
          },
          spread: {
            en: 'Spread First',
            ja: '散会から',
            ko: '산개 먼저',
          },
          baitAndStack: {
            en: 'Bait => Stack',
            ja: '誘導 => 頭割り',
            ko: '장판 유도 => 쉐어',
          },
          baitAndSpread: {
            en: 'Bait => Spread',
            ja: '誘導 => 散会',
            ko: '장판 유도 => 산개',
          },
        };
        const isReversed = data.inverseMagics[matches.target] === true;
        const id = matches.count;
        // Huge credit to Aya for this.  Also note `209` is the purple swirl.
        const ids = {
          fireThenIce: '1DC',
          iceThenFire: '1DE',
          stackThenSpread: '1E0',
          spreadThenStack: '1E2',
        };
        // The first time through, use the "bait" version to avoid people running off
        // as soon as they hear the beepy boops.
        if (!data.seenFirstAlignmentStackSpread) {
          // The first one can't be reversed.
          // Store the follow-up ability so it can be used with the left/right Ashing Blaze.
          if (id === ids.stackThenSpread) {
            data.firstAlignmentSecondAbility = 'spread';
            return { alertText: output.baitAndStack() };
          }
          if (id === ids.spreadThenStack) {
            data.firstAlignmentSecondAbility = 'stack';
            return { alertText: output.baitAndSpread() };
          }
        }
        const key = isReversed ? 'alarmText' : 'alertText';
        if (!isReversed && id === ids.fireThenIce || isReversed && id === ids.iceThenFire)
          return { [key]: output.fire() };
        if (!isReversed && id === ids.iceThenFire || isReversed && id === ids.fireThenIce)
          return { [key]: output.ice() };
        if (!isReversed && id === ids.spreadThenStack || isReversed && id === ids.stackThenSpread)
          return { [key]: output.spread() };
        if (!isReversed && id === ids.stackThenSpread || isReversed && id === ids.spreadThenStack)
          return { [key]: output.stack() };
      },
    },
    {
      id: 'P8S Natural Alignment Second',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: ['79C0', '79BF', '79BD', '79BE'], source: 'Hephaistos' }),
      suppressSeconds: 8,
      alertText: (data, matches, output) => {
        // Due to the way suppress works, put this check here and not in the condition field.
        // This callout will get merged with the left/right which happens at the same time.
        if (!data.seenFirstAlignmentStackSpread)
          return;
        const id = matches.id;
        const ids = {
          spread: '79C0',
          stack: '79BF',
          fire: '79BD',
          ice: '79BE',
        };
        // TODO: Should the left/right call (or some future "front row"/"2nd row") call be combined
        // with the followup here?
        if (id === ids.spread)
          return output.stack();
        if (id === ids.stack)
          return output.spread();
        if (id === ids.ice)
          return output.fire();
        if (id === ids.fire)
          return output.ice();
      },
      run: (data) => data.seenFirstAlignmentStackSpread = true,
      outputStrings: {
        stack: Outputs.stackMarker,
        spread: Outputs.spread,
        ice: {
          en: 'Ice Groups',
          ja: '氷の頭割り',
          ko: '얼음 그룹 쉐어',
        },
        fire: {
          en: 'Fire Partners',
          ja: '火の2人頭割り',
          ko: '불 2인 쉐어',
        },
      },
    },
    {
      id: 'P8S Illusory Hephaistos End of Days',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7A8B' }),
      infoText: (_data, matches, output) => {
        // Illusory Hephaistos are at x=(80 or 120), y=(85 or 95 or 105 or 115).
        // Either the first or second row is always free.
        const y = parseFloat(matches.y);
        const epsilon = 2;
        const row1y = 85;
        const row2y = 95;
        // TODO: combine this with the ice/fire/stack/spread calls too?
        if (Math.abs(y - row1y) < epsilon)
          return output.row2();
        if (Math.abs(y - row2y) < epsilon)
          return output.row1();
      },
      outputStrings: {
        row1: {
          en: 'Front Row',
        },
        row2: {
          en: 'Second Row',
        },
      },
    },
    {
      id: 'P8S High Concept Collect',
      // D02 = Imperfection: Alpha
      // D03 = Imperfection: Beta
      // D04 = Imperfection: Gamma
      // D05 = Perfection: Alpha
      // D06 = Perfection: Beta
      // D07 = Perfection: Gamma
      // D11 = Solosplice
      // D12 = Multisplice
      // D13 = Supersplice
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['D0[2-4]', 'D1[1-3]'] }),
      run: (data, matches) => {
        const id = matches.effectId;
        // 8 and 26s second debuffs.
        const isLong = parseFloat(matches.duration) > 10;
        if (id === 'D02')
          data.concept[matches.target] = isLong ? 'longalpha' : 'shortalpha';
        else if (id === 'D03')
          data.concept[matches.target] = isLong ? 'longbeta' : 'shortbeta';
        else if (id === 'D04')
          data.concept[matches.target] = isLong ? 'longgamma' : 'shortgamma';
        else if (id === 'D11')
          data.splicer[matches.target] = 'solosplice';
        else if (id === 'D12')
          data.splicer[matches.target] = 'multisplice';
        else if (id === 'D13')
          data.splicer[matches.target] = 'supersplice';
      },
    },
    {
      id: 'P8S High Concept Debuffs',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['D0[2-4]', 'D1[1-3]'], capture: false }),
      delaySeconds: 0.5,
      suppressSeconds: 1,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          noDebuff: {
            en: 'No Debuff',
            ja: '無職',
            ko: '디버프 없음',
          },
          shortAlpha: {
            en: 'Short Alpha',
            ja: '短いアルファ',
            ko: '짧은 알파',
          },
          longAlpha: {
            en: 'Long Alpha',
            ja: '長いアルファ',
            ko: '긴 알파',
          },
          longAlphaSplicer: {
            en: 'Long Alpha + ${splicer}',
            ja: '長いアルファ + ${splicer}',
            ko: '긴 알파 + ${splicer}',
          },
          shortBeta: {
            en: 'Short Beta',
            ja: '短いベータ',
            ko: '짧은 베타',
          },
          longBeta: {
            en: 'Long Beta',
            ja: '長いベータ',
            ko: '긴 베타',
          },
          longBetaSplicer: {
            en: 'Long Beta + ${splicer}',
            ja: '長いベータ + ${splicer}',
            ko: '긴 베타 + ${splicer}',
          },
          shortGamma: {
            en: 'Short Gamma',
            ja: '短いガンマ',
            ko: '짧은 감마',
          },
          longGamma: {
            en: 'Long Gamma',
            ja: '長いガンマ',
            ko: '긴 감마',
          },
          longGammaSplicer: {
            en: 'Long Gamma + ${splicer}',
            ja: '長いガンマ + ${splicer}',
            ko: '긴 감마 + ${splicer}',
          },
          soloSplice: {
            en: 'Solo Stack',
            ja: '1人受け',
            ko: '1인징',
          },
          multiSplice: {
            en: 'Two Stack',
            ja: '2人頭割り',
            ko: '2인징',
          },
          superSplice: {
            en: 'Three Stack',
            ja: '3人頭割り',
            ko: '3인징',
          },
        };
        // General thought here: alarm => EXPLOSION GO, alert/info => go to safe corner
        const concept = data.concept[data.me];
        const splicer = data.splicer[data.me];
        const singleConceptMap = {
          shortalpha: output.shortAlpha(),
          longalpha: output.longAlpha(),
          shortbeta: output.shortBeta(),
          longbeta: output.longBeta(),
          shortgamma: output.shortGamma(),
          longgamma: output.longGamma(),
        };
        if (splicer === undefined) {
          if (concept === undefined)
            return { alarmText: output.noDebuff() };
          const isShort = concept === 'shortalpha' || concept === 'shortbeta' || concept === 'shortgamma';
          const conceptStr = singleConceptMap[concept];
          if (isShort)
            return { alarmText: conceptStr };
          return { alertText: conceptStr };
        }
        const splicerMap = {
          solosplice: output.soloSplice(),
          multisplice: output.multiSplice(),
          supersplice: output.superSplice(),
        };
        const splicerStr = splicerMap[splicer];
        if (concept === undefined)
          return { infoText: splicerStr };
        else if (concept === 'longalpha')
          return { alertText: output.longAlphaSplicer({ splicer: splicerStr }) };
        else if (concept === 'longbeta')
          return { alertText: output.longBetaSplicer({ splicer: splicerStr }) };
        else if (concept === 'longgamma')
          return { alertText: output.longGammaSplicer({ splicer: splicerStr }) };
        // If we get here then we have a short concept with a splicer which shouldn't be possible,
        // but at least return *something* just in case.
        return { alarmText: singleConceptMap[concept] };
      },
    },
    {
      id: 'P8S Perfected Alpha',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'D05' }),
      condition: Conditions.targetIsYou(),
      // TODO: it'd be nice to know the tower here so this could just say
      // "take tower" or "avoid tower" with different severity or even
      // who to merge with (!), but without that this is the best we got.
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Green/Blue Tower',
          ja: '緑・青の塔',
        },
      },
    },
    {
      id: 'P8S Perfected Beta',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'D06' }),
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Green/Purple Tower',
          ja: '緑・紫の塔',
        },
      },
    },
    {
      id: 'P8S Perfected Gamma',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'D07' }),
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Purple/Blue Tower',
          ja: '紫・青の塔',
        },
      },
    },
    {
      id: 'P8S Limitless Desolation',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '75ED', source: 'Hephaistos', capture: false }),
      response: Responses.spread('alert'),
    },
    {
      id: 'P8S Dominion',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '79D9', source: 'Hephaistos', capture: false }),
      response: Responses.spread('alert'),
      run: (data) => data.deformationTargets = [],
    },
    {
      id: 'P8S Orogenic Deformation Hit',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '79DB', source: 'Hephaistos' }),
      preRun: (data, matches) => data.deformationTargets.push(matches.target),
      infoText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.text();
      },
      outputStrings: {
        text: {
          en: 'Second Towers',
          ja: '2回目の塔',
        },
      },
    },
    {
      id: 'P8S Orogenic Deformation Not Hit',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '79DB', source: 'Hephaistos', capture: false }),
      delaySeconds: 0.5,
      suppressSeconds: 1,
      alertText: (data, _matches, output) => {
        if (!data.deformationTargets.includes(data.me))
          return output.text();
      },
      outputStrings: {
        text: {
          en: 'First Towers',
          ja: '1回目の塔',
        },
      },
    },
    {
      id: 'P8S Aionagonia',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7A22', source: 'Hephaistos', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'big aoe + bleed',
          ja: '全体攻撃 + 出血',
          ko: '아픈 전체공격 + 도트',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Conceptual Octaflare/Conceptual Tetraflare': 'Conceptual Octa/Tetraflare',
        'Emergent Octaflare/Emergent Tetraflare': 'Emergent Octa/Tetraflare',
        'Tetraflare/Octaflare': 'Tetra/Octaflare',
        'Scorching Fang/Scorched Pinion': 'Fang/Pinion',
        'Scorching Fang/Sun\'s Pinion': 'Fang/Pinion',
        'Tetraflare/Nest of Flamevipers': 'Tetraflare/Flamevipers',
        'Quadrupedal Impact/Quadrupedal Crush': 'Quadrupedal Impact/Crush',
        'Quadrupedal Crush/Quadrupedal Impact': 'Quadrupedal Crush/Impact',
        'Emergent Diflare/Emergent Tetraflare': 'Emergent Di/Tetraflare',
        'Forcible Trifire/Forcible Difreeze': 'Forcible Trifire/Difreeze',
        'Forcible Difreeze/Forcible Trifire': 'Forcible Difreeze/Trifire',
        'Forcible Fire III/Forcible Fire II': 'Forcible Fire III/II',
        'Forcible Fire II/Forcible Fire III': 'Forcible Fire II/III',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        '(?<!Illusory )Hephaistos': 'Hephaistos',
        'Gorgon': 'Gorgone',
        'Illusory Hephaistos': 'Hephaistos-Phantom',
        'Suneater': 'Schlund des Phoinix',
      },
      'replaceText': {
        '--auto--': '--auto--',
        'Abyssal Fires': 'Feuersturm',
        'Aionagonia': 'Eiserne Agonie',
        'Aioniopyr': 'Aioniopyr',
        'Arcane Channel': 'Zirkelimpuls',
        'Arcane Control': 'Beleben des Kreises',
        'Ashing Blaze': 'Aschelodern',
        'Blazing Footfalls': 'Fackelnde Füße',
        'Blood of the Gorgon': 'Gorgons Schlangengift',
        'Breath of the Gorgon': 'Gorgons Übelgift',
        'Burst': 'Explosion',
        'Conceptual Diflare': 'Konzeptionelle Diflare',
        'Conceptual Octaflare': 'Konzeptionelle Oktaflare',
        'Conceptual Shift': 'Konzeptänderung',
        'Conceptual Tetraflare': 'Konzeptionelle Tetraflare',
        'Creation on Command': 'Schöpfungsauftrag',
        'Crown of the Gorgon': 'Gorgons Steinlicht',
        'Cthonic Vent': 'Lodernde Schlange',
        'Deconceptualize': 'Konzepttilgung',
        'Dominion': 'Schlag des Herrschers',
        'Ego Death': 'Egotod',
        'Ektothermos': 'Ektothermos',
        'Emergent Diflare': 'Steigende Diflare',
        'Emergent Octaflare': 'Steigende Oktaflare',
        'Emergent Tetraflare': 'Steigende Tetraflare',
        'End of Days': 'Ende aller Tage',
        'Everburn': 'Phoinix-Erschaffung',
        'Eye of the Gorgon': 'Gorgons Steinauge',
        '(?<!Nest of )Flameviper': 'Flammenviper',
        'Footprint': 'Fußschock',
        'Forcible Difreeze': 'Erzwungenes Di-Einfrieren',
        'Forcible Fire II(?!I)': 'Erzwungenes Feura',
        'Forcible Fire III': 'Erzwungenes Feuga',
        'Forcible Trifire': 'Erzwungenes Trifeuer',
        'Fourfold Fires': 'Vierfacher Feuersturm',
        'Genesis of Flame': 'Flammende Genesis',
        'Gorgomanteia': 'Gorgons Fluch',
        'Gorgospit': 'Gorgons Speichel',
        'Hemitheos\'s Flare': 'Hemitheos-Flare',
        'High Concept': 'Konzeptkontrolle',
        'Illusory Creation': 'Illusionsschatten',
        'Into the Shadows': 'In die Schatten',
        'Inverse Magicks': 'Magische Umkehr',
        'Limitless Desolation': 'Kosmische Verkohlung',
        'Manifold Flames': 'Mannigfaltige Flammen',
        'Natural Alignment': 'Rituelle Anpassung',
        'Nest of Flamevipers': 'Ausbreitende Viper',
        '(?<! )Octaflare': 'Oktaflare',
        'Orogenic Deformation': 'Gewaltige Bodenhebung',
        'Orogenic Shift': 'Bodenhebung',
        'Petrifaction': 'Versteinerung',
        'Quadrupedal Crush': 'Fußmalmer',
        'Quadrupedal Impact': 'Fußstampfer',
        'Reforged Reflection': 'Mutierte Schöpfung',
        'Scorched Pinion': 'Versengte Schwinge',
        'Scorching Fang': 'Flammender Zahn',
        'Snaking Kick': 'Natterntritt',
        'Splicer': 'Konzeptreflektion',
        'Stomp Dead': 'Fataler Stampfer',
        'Sun\'s Pinion': 'Schwelende Schwinge',
        'Sunforge': 'Flammenreigen der Schöpfung',
        '(?<! )Tetraflare': 'Tetraflare',
        'Torch Flame': 'Glutfeuer',
        'Trailblaze': 'Flammender Pfad',
        'Twist Nature': 'Zwangsbeschwörung',
        'Tyrant\'s Fire III': 'Feuga des Tyrannen',
        'Tyrant\'s Flare(?! II)': 'Flare des Tyrannen',
        'Tyrant\'s Flare II': 'Flare des Tyrannen II',
        'Tyrant\'s Unholy Darkness': 'Unheiliges Dunkel des Tyrannen',
        'Uplift': 'Erhöhung',
        'Volcanic Torches': 'Vulkanfackel',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        '(?<!Illusory )Hephaistos': 'Héphaïstos',
        'Gorgon': 'gorgone',
        'Illusory Hephaistos': 'spectre d\'Héphaïstos',
        'Suneater': 'serpent en flammes',
      },
      'replaceText': {
        'Abyssal Fires': 'Tempête enflammée',
        'Aionagonia': 'Aion agonia',
        'Aioniopyr': 'Aion pur',
        'Arcane Channel': 'Vague arcanique',
        'Arcane Control': 'Activation arcanique',
        'Ashing Blaze': 'Enfer cendreux',
        'Blazing Footfalls': 'Pas ardents',
        'Blood of the Gorgon': 'Venin reptilien de gorgone',
        'Breath of the Gorgon': 'Poison insidieux de gorgone',
        'Burst': 'Explosion',
        'Conceptual Diflare': 'Dibrasier conceptuel',
        'Conceptual Octaflare': 'Octobrasier conceptuel',
        'Conceptual Shift': 'Bascule conceptuelle',
        'Conceptual Tetraflare': 'Tetrabrasier conceptuel',
        'Creation on Command': 'Ordre de création',
        'Crown of the Gorgon': 'Lueur pétrifiante de gorgone',
        'Cthonic Vent': 'Serpents de flammes ascendants',
        'Deconceptualize': 'Effacement conceptuel',
        'Dominion': 'Poing du maître',
        'Ego Death': 'Destruction de l\'ego',
        'Ektothermos': 'Vague d\'énergie explosive',
        'Emergent Diflare': 'Dibrasier émergent',
        'Emergent Octaflare': 'Octobrasier émergent',
        'Emergent Tetraflare': 'Tetrabrasier émergent',
        'End of Days': 'Flamme de Megiddo',
        'Everburn': 'Oiseau immortel',
        'Eye of the Gorgon': 'Œil pétrifiant de gorgone',
        '(?<!Nest of )Flameviper': 'Serpent-canon',
        'Footprint': 'Choc quadrupède',
        'Forcible Difreeze': 'Di Gel forcé',
        'Forcible Fire II(?!I)': 'Extra Feu forcé',
        'Forcible Fire III': 'Méga Feu forcé',
        'Forcible Trifire': 'Tri Feu forcé',
        'Fourfold Fires': 'Quadruple tempête enflammée',
        'Genesis of Flame': 'Flammes de la création',
        'Gorgomanteia': 'Malédiction de gorgone',
        'Gorgospit': 'Crachat de gorgone',
        'Hemitheos\'s Flare': 'Brasier d\'hémithéos',
        'High Concept': 'Manipulation conceptuelle',
        'Illusory Creation': 'Création d\'ombres',
        'Into the Shadows': 'Dans l\'ombre',
        'Inverse Magicks': 'Inversion magique',
        'Limitless Desolation': 'Cendrage universel',
        'Manifold Flames': 'Flammes orientées multiples',
        'Natural Alignment': 'Description rituelle',
        'Nest of Flamevipers': 'Vipère élancée',
        '(?<! )Octaflare': 'Octobrasier',
        'Orogenic Deformation': 'Grande surrection',
        'Orogenic Shift': 'Surrection',
        'Petrifaction': 'Pétrification',
        'Quadrupedal Crush': 'Écrasement quadrupède',
        'Quadrupedal Impact': 'Impact quadrupède',
        'Reforged Reflection': 'Mutation corporelle',
        'Scorched Pinion': 'Aile embrasante',
        'Scorching Fang': 'Crocs embrasants',
        'Snaking Kick': 'Coup de pied du serpent',
        'Splicer': 'Réaction conceptuelle',
        'Stomp Dead': 'Piétinement mortel',
        'Sun\'s Pinion': 'Ailes étincelantes',
        'Sunforge': 'Bête enflammée',
        '(?<! )Tetraflare': 'Tetrabrasier',
        'Torch Flame': 'Explosion de braises',
        'Trailblaze': 'Traînée ardente',
        'Twist Nature': 'Incantation forcée',
        'Tyrant\'s Fire III': 'Méga Feu de tyran',
        'Tyrant\'s Flare(?! II)': 'Brasier de tyran',
        'Tyrant\'s Flare II': 'Brasier de tyran II',
        'Tyrant\'s Unholy Darkness': 'Miracle ténébreux de tyran',
        'Uplift': 'Exhaussement',
        'Volcanic Torches': 'Boutefeux magiques',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        '(?<!Illusory )Hephaistos': 'ヘファイストス',
        'Gorgon': 'ゴルゴン',
        'Illusory Hephaistos': 'ヘファイストスの幻影',
        'Suneater': '炎霊蛇',
      },
      'replaceText': {
        'Abyssal Fires': '炎嵐',
        'Aionagonia': 'アイオンアゴニア',
        'Aioniopyr': 'アイオンピュール',
        'Arcane Channel': '魔陣波動',
        'Arcane Control': '魔法陣起動',
        'Ashing Blaze': 'アッシュブレイズ',
        'Blazing Footfalls': 'ブレイジングフィート',
        'Blood of the Gorgon': 'ゴルゴンの蛇毒',
        'Breath of the Gorgon': 'ゴルゴンの邪毒',
        'Burst': '爆発',
        'Conceptual Diflare': 'ディフレア・コンシーヴ',
        'Conceptual Octaflare': 'オクタフレア・コンシーヴ',
        'Conceptual Shift': '概念変異',
        'Conceptual Tetraflare': 'テトラフレア・コンシーヴ',
        'Creation on Command': '創造命令',
        'Crown of the Gorgon': 'ゴルゴンの石光',
        'Cthonic Vent': '噴炎昇蛇',
        'Deconceptualize': '概念消去',
        'Dominion': '支配者の一撃',
        'Ego Death': '自己概念崩壊',
        'Ektothermos': '爆炎波動',
        'Emergent Diflare': 'エマージ・ディフレア',
        'Emergent Octaflare': 'エマージ・オクタフレア',
        'Emergent Tetraflare': 'エマージ・テトラフレア',
        'End of Days': 'メギドフレイム',
        'Everburn': '不死鳥創造',
        'Eye of the Gorgon': 'ゴルゴンの石眼',
        '(?<!Nest of )Flameviper': '炎蛇砲',
        'Footprint': 'フィートショック',
        'Forcible Difreeze': 'フォースド・ディフリーズ',
        'Forcible Fire II(?!I)': 'フォースド・ファイラ',
        'Forcible Fire III': 'フォースド・ファイガ',
        'Forcible Trifire': 'フォースド・トリファイア',
        'Fourfold Fires': '四重炎嵐',
        'Genesis of Flame': '創世の真炎',
        'Gorgomanteia': 'ゴルゴンの呪詛',
        'Gorgospit': 'ゴルゴンスピット',
        'Hemitheos\'s Flare': 'ヘーミテオス・フレア',
        'High Concept': '概念支配',
        'Illusory Creation': '幻影創造',
        'Into the Shadows': 'イントゥシャドウ',
        'Inverse Magicks': 'マジックインヴァージョン',
        'Limitless Desolation': '万象灰燼',
        'Manifold Flames': '多重操炎',
        'Natural Alignment': '術式記述',
        'Nest of Flamevipers': 'スプレッドヴァイパー',
        '(?<! )Octaflare': 'オクタフレア',
        'Orogenic Deformation': '地盤大隆起',
        'Orogenic Shift': '地盤隆起',
        'Petrifaction': 'ペトリファクション',
        'Quadrupedal Crush': 'フィートクラッシュ',
        'Quadrupedal Impact': 'フィートインパクト',
        'Reforged Reflection': '変異創身',
        'Scorched Pinion': '炎の翼',
        'Scorching Fang': '炎の牙',
        'Snaking Kick': 'スネークキック',
        'Splicer': '概念反発',
        'Stomp Dead': 'フェイタルストンプ',
        'Sun\'s Pinion': '陽炎の翼',
        'Sunforge': '創獣炎舞',
        '(?<! )Tetraflare': 'テトラフレア',
        'Torch Flame': '熾炎',
        'Trailblaze': 'トレイルブレイズ',
        'Twist Nature': '強制詠唱',
        'Tyrant\'s Fire III': 'タイラント・ファイガ',
        'Tyrant\'s Flare(?! II)': 'タイラント・フレア',
        'Tyrant\'s Flare II': 'タイラント・フレアII',
        'Tyrant\'s Unholy Darkness': 'タイラント・ダークホーリー',
        'Uplift': '隆起',
        'Volcanic Torches': '熾炎創火',
      },
    },
  ],
});
