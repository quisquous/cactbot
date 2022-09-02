Options.Triggers.push({
  zoneId: ZoneId.AbyssosTheEighthCircleSavage,
  timelineFile: 'p8s.txt',
  initData: () => {
    return {
      combatantData: [],
      torches: [],
      flareTargets: [],
      upliftCounter: 0,
    };
  },
  triggers: [
    {
      id: 'P8S Genesis of Flame',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7944', source: 'Hephaistos', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'P8S Flameviper',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7945', source: 'Hephaistos' }),
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'P8S Conceptual Tetraflare',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7915', source: 'Hephaistos', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      run: (data) => data.conceptual = 'tetra',
      outputStrings: {
        text: {
          en: '(partner stack, for later)',
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
        },
        cornerNW: {
          en: 'NW Corner',
        },
        cornerNE: {
          en: 'NE Corner',
        },
        cornerSE: {
          en: 'SE Corner',
        },
        cornerSW: {
          en: 'SW Corner',
        },
        outsideNorth: {
          en: 'Outside North',
          de: 'Im Norden raus',
          fr: 'Nord Extérieur',
          ja: '北、外側',
          ko: '북쪽, 바깥',
        },
        insideNorth: {
          en: 'Inside North',
          de: 'Im Norden rein',
          fr: 'Nord Intérieur',
          ja: '北、内側',
          ko: '북쪽, 안',
        },
        outsideEast: {
          en: 'Outside East',
          de: 'Im Osten raus',
          fr: 'Est Extérieur',
          ja: '東、外側',
          ko: '동쪽, 바깥',
        },
        insideEast: {
          en: 'Inside East',
          de: 'Im Osten rein',
          fr: 'Est Intérieur',
          ja: '東、内側',
          ko: '동쪽, 안',
        },
        outsideSouth: {
          en: 'Outside South',
          de: 'Im Süden raus',
          fr: 'Sud Extérieur',
          ja: '南、外側',
          ko: '남쪽, 바깥',
        },
        insideSouth: {
          en: 'Inside South',
          de: 'Im Süden rein',
          fr: 'Sud Intérieur',
          ja: '南、内側',
          ko: '남쪽, 안',
        },
        outsideWest: {
          en: 'Outside West',
          de: 'Im Westen raus',
          fr: 'Ouest Extérieur',
          ja: '西、外側',
          ko: '서쪽, 바깥',
        },
        insideWest: {
          en: 'Inside West',
          de: 'Im Westen rein',
          fr: 'Ouest Intérieur',
          ja: '西、内側',
          ko: '서쪽, 안',
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
      id: 'P8S Uplift Counter',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '7935', source: 'Hephaistos', capture: false }),
      // Count in a separate trigger so that we can suppress it, but still call out for
      // both people hit.
      preRun: (data, _matches) => data.upliftCounter++,
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
      },
    },
  ],
});
