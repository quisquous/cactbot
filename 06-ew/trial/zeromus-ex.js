const headmarkerMap = {
  tankBuster: '016C',
  blackHole: '014A',
  tether: '0146',
  // Most spread markers (Big Bang, Big Crunch, Dark Divides)
  spread: '0178',
  accelerationBomb: '010B',
  nox: '00C5',
  akhRhaiSpread: '0017',
  enums: '00D3',
  // The Dark Beckons, but also Umbral Rays
  stack: '003E',
};
const centerX = 100;
const centerY = 100;
Options.Triggers.push({
  id: 'TheAbyssalFractureExtreme',
  zoneId: ZoneId.TheAbyssalFractureExtreme,
  timelineFile: 'zeromus-ex.txt',
  initData: () => {
    return {
      phase: 'one',
      miasmicBlasts: [],
      busterPlayers: [],
      forkedPlayers: [],
      noxPlayers: [],
    };
  },
  timelineTriggers: [
    {
      id: 'ZeromusEx Flare',
      // Extra time for spreading out.
      // This could also be StartsUsing 85BD.
      regex: /^Flare$/,
      beforeSeconds: 13,
      suppressSeconds: 20,
      response: Responses.getTowers(),
    },
    {
      id: 'ZeromusEx Big Bang Spread',
      // Extra time for spreading out.
      // This could alternatively be StartsUsing 8B4C or HeadMarker 0178.
      regex: /^Big Bang$/,
      beforeSeconds: 13,
      suppressSeconds: 20,
      response: Responses.spread('alert'),
    },
    {
      id: 'ZeromusEx Big Crunch Spread',
      // Extra time for spreading out.
      // This could alternatively be StartsUsing 8B4D or HeadMarker 0178.
      regex: /^Big Crunch$/,
      beforeSeconds: 13,
      suppressSeconds: 20,
      response: Responses.spread('alert'),
    },
  ],
  triggers: [
    {
      id: 'ZeromusEx Abyssal Nox',
      type: 'GainsEffect',
      netRegex: { effectId: '6E9', capture: false },
      suppressSeconds: 5,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Heal to full',
          de: 'Voll heilen',
          cn: '奶满全队',
          ko: '체력 풀피로',
        },
      },
    },
    {
      id: 'ZeromusEx Sable Thread',
      type: 'Ability',
      netRegex: { id: '8AEF', source: 'Zeromus' },
      alertText: (data, matches, output) => {
        const num = data.seenSableThread ? 7 : 6;
        data.seenSableThread = true;
        if (matches.target === data.me)
          return output.lineStackOnYou({ num: num });
        return output.lineStackOn({ num: num, player: data.party.member(matches.target) });
      },
      outputStrings: {
        lineStackOn: {
          en: '${num}x line stack on ${player}',
          de: '${num}x in einer Linie sammeln mit ${player}',
          cn: '${num}x 直线分摊 (${player})',
          ko: '${num}x 직선 쉐어 (${player})',
        },
        lineStackOnYou: {
          en: '${num}x line stack on YOU',
          de: '${num}x in einer Linie sammeln mit DIR',
          cn: '${num}x 直线分摊点名',
          ko: '${num}x 직선 쉐어 대상자',
        },
      },
    },
    {
      id: 'ZeromusEx Dark Matter You',
      type: 'HeadMarker',
      netRegex: { id: headmarkerMap.tankBuster },
      alertText: (data, matches, output) => {
        data.busterPlayers.push(matches.target);
        if (data.me === matches.target)
          return output.tankBusterOnYou();
      },
      outputStrings: {
        tankBusterOnYou: Outputs.tankBusterOnYou,
      },
    },
    {
      id: 'ZeromusEx Dark Matter Others',
      type: 'HeadMarker',
      netRegex: { id: headmarkerMap.tankBuster, capture: false },
      delaySeconds: 0.5,
      suppressSeconds: 2,
      infoText: (data, _matches, output) => {
        if (!data.busterPlayers.includes(data.me))
          return output.tankBusters();
      },
      outputStrings: {
        tankBusters: Outputs.tankBusters,
      },
    },
    {
      id: 'ZeromusEx Dark Matter Cleanup',
      type: 'Ability',
      netRegex: { id: '8B84', source: 'Zeromus', capture: false },
      suppressSeconds: 5,
      run: (data) => data.busterPlayers = [],
    },
    {
      id: 'ZeromusEx Visceral Whirl NE Safe',
      type: 'StartsUsing',
      netRegex: { id: '8B43', source: 'Zeromus', capture: false },
      infoText: (_data, _matches, output) => {
        return output.text({ dir1: output.ne(), dir2: output.sw() });
      },
      outputStrings: {
        text: {
          en: '${dir1} / ${dir2}',
          de: '${dir1} / ${dir2}',
          cn: '${dir1} / ${dir2}',
          ko: '${dir1} / ${dir2}',
        },
        ne: Outputs.northeast,
        sw: Outputs.southwest,
      },
    },
    {
      id: 'ZeromusEx Visceral Whirl NW Safe',
      type: 'StartsUsing',
      netRegex: { id: '8B46', source: 'Zeromus', capture: false },
      infoText: (_data, _matches, output) => {
        return output.text({ dir1: output.nw(), dir2: output.se() });
      },
      outputStrings: {
        text: {
          en: '${dir1} / ${dir2}',
          de: '${dir1} / ${dir2}',
          cn: '${dir1} / ${dir2}',
          ko: '${dir1} / ${dir2}',
        },
        nw: Outputs.northwest,
        se: Outputs.southeast,
      },
    },
    {
      id: 'ZeromusEx Miasmic Blasts Reset',
      type: 'StartsUsing',
      // reset Blasts combatant data when the preceding Visceral Whirl is used
      netRegex: { id: '8B4[36]', source: 'Zeromus', capture: false },
      run: (data) => data.miasmicBlasts = [],
    },
    {
      id: 'ZeromusEx Miasmic Blast Safe Spots',
      type: 'StartsUsing',
      netRegex: { id: '8B49', source: 'Zeromus', capture: true },
      delaySeconds: 0.5,
      promise: async (data, matches) => {
        const combatants = (await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.sourceId, 16)],
        })).combatants;
        if (combatants.length !== 1)
          return;
        const combatant = combatants[0];
        if (combatant === undefined)
          return;
        data.miasmicBlasts.push(combatant);
      },
      alertText: (data, _matches, output) => {
        if (data.miasmicBlasts.length !== 3) {
          return;
        }
        // Blasts can spawn center, on cardinals (+/-14 from center), or on intercards (+/-7 from center).
        // Unsafe spots vary for each of the 9 possible spawn points, but are always the same *relative* to that type.
        // So apply a fixed set of modifiers based on type, regardless of spawn point, to eliminate unsafe spots.
        const cardinal16Dirs = [0, 4, 8, 12];
        const intercard16Dirs = [2, 6, 10, 14];
        const unsafe16DirModifiers = {
          cardinal: [-1, 0, 1, 4, 5, 11, 12],
          intercard: [-2, 0, 2, 3, 8, 13],
        };
        // Filter to north half.
        const validSafeSpots = [
          'dirNNE',
          'dirNE',
          'dirENE',
          'dirWNW',
          'dirNW',
          'dirNNW',
        ];
        let possibleSafeSpots = [...validSafeSpots];
        for (const blast of data.miasmicBlasts) {
          // special case for center - don't need to find relative dirs, just remove all intercards
          if (Math.round(blast.PosX) === 100 && Math.round(blast.PosY) === 100)
            intercard16Dirs.forEach((intercard) =>
              possibleSafeSpots = possibleSafeSpots.filter((dir) =>
                dir !== Directions.output16Dir[intercard]
              )
            );
          else {
            const blastPos16Dir = Directions.xyTo16DirNum(blast.PosX, blast.PosY, centerX, centerY);
            const relativeUnsafeDirs = cardinal16Dirs.includes(blastPos16Dir)
              ? unsafe16DirModifiers.cardinal
              : unsafe16DirModifiers.intercard;
            for (const relativeUnsafeDir of relativeUnsafeDirs) {
              const actualUnsafeDir = (16 + blastPos16Dir + relativeUnsafeDir) % 16;
              possibleSafeSpots = possibleSafeSpots.filter((dir) =>
                dir !== Directions.output16Dir[actualUnsafeDir]
              );
            }
          }
        }
        if (possibleSafeSpots.length !== 1)
          return output.avoidUnknown();
        const [safeDir] = possibleSafeSpots;
        if (safeDir === undefined)
          return output.avoidUnknown();
        return output[safeDir]();
      },
      outputStrings: {
        avoidUnknown: {
          en: 'Avoid Line Cleaves',
          de: 'Weiche den Linien Cleaves aus',
          cn: '远离十字AOE',
          ko: '직선 장판 피하기',
        },
        dirNNE: {
          en: 'North Wall (NNE/WSW)',
          de: 'Nördliche Wand (NNO/WSW)',
          cn: '右上前方/左下侧边',
          ko: '1시/8시',
        },
        dirNNW: {
          en: 'North Wall (NNW/ESE)',
          de: 'Nördliche Wand (NNW/OSO)',
          cn: '左上前方/右下侧边',
          ko: '11시/4시',
        },
        dirNE: {
          en: 'Corners (NE/SW)',
          de: 'Ecken (NO/SW)',
          cn: '右上/左下角落',
          ko: '구석 (북동/남서)',
        },
        dirNW: {
          en: 'Corners (NW/SE)',
          de: 'Ecken (NW/SO)',
          cn: '左上/右下角落',
          ko: '구석 (북서/남동)',
        },
        dirENE: {
          en: 'East Wall (ENE/SSW)',
          de: 'Östliche Wand (ONO/SSW)',
          cn: '右上侧边/左下后方',
          ko: '2시/7시',
        },
        dirWNW: {
          en: 'West Wall (WNW/SSE)',
          de: 'Westliche Wand (WNW/SSO)',
          cn: '左上侧边/右下后方',
          ko: '10시/5시',
        },
      },
    },
    {
      id: 'ZeromusEx Big Bang',
      type: 'StartsUsing',
      netRegex: { id: '8B4C', source: 'Zeromus', capture: false },
      response: Responses.bleedAoe(),
    },
    {
      id: 'ZeromusEx Forked Lightning',
      type: 'GainsEffect',
      netRegex: { effectId: 'ED7' },
      condition: (data, matches) => {
        data.forkedPlayers.push(matches.target);
        return matches.target === data.me;
      },
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 6,
      durationSeconds: 5,
      alarmText: (_data, _matches, output) => output.forkedLightning(),
      outputStrings: {
        forkedLightning: {
          en: 'Spread (forked lightning)',
          de: 'Verteilen (Gabelblitz)',
          cn: '分散（闪电点名）',
          ko: '산개',
        },
      },
    },
    {
      id: 'ZeromusEx The Dark Beckons Stack Collect',
      type: 'HeadMarker',
      netRegex: { id: headmarkerMap.stack },
      condition: (data) => data.phase === 'one',
      run: (data, matches) => data.bigBangStackPlayer = matches.target,
    },
    {
      id: 'ZeromusEx The Dark Beckons Stack',
      type: 'HeadMarker',
      netRegex: { id: [headmarkerMap.stack, headmarkerMap.tankBuster] },
      condition: (data) => {
        if (data.phase !== 'one')
          return false;
        return data.bigBangStackPlayer !== undefined;
      },
      // If we have both busters, run immediately otherwise wait a reasonable amount of time
      // for them to show up.
      delaySeconds: (data) => data.busterPlayers.length === 2 ? 0 : 1,
      suppressSeconds: 10,
      alertText: (data, matches, output) => {
        if (data.busterPlayers.includes(data.me))
          return;
        if (data.forkedPlayers.includes(data.me))
          return;
        if (data.me === matches.target)
          return output.stackOnYou();
        return output.stackOnTarget({ player: data.party.member(matches.target) });
      },
      outputStrings: {
        stackOnYou: Outputs.stackOnYou,
        stackOnTarget: Outputs.stackOnPlayer,
      },
    },
    {
      id: 'ZeromusEx Acceleration Bomb',
      type: 'GainsEffect',
      netRegex: { effectId: 'A61' },
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 3,
      response: Responses.stopEverything(),
    },
    {
      id: 'ZeromusEx Tether Bait',
      type: 'HeadMarker',
      netRegex: { id: headmarkerMap.tether, capture: false },
      suppressSeconds: 5,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Group middle for tethers',
          de: 'Gruppe in die Mitte für Verbindungen',
          cn: '集合等待连线',
          ko: '중앙에 모여서 사슬 연결 기다리기',
        },
      },
    },
    {
      id: 'ZeromusEx Tether',
      type: 'Tether',
      netRegex: { id: ['00A3', '010B'] },
      condition: (data, matches) => data.me === matches.target || data.me === matches.source,
      suppressSeconds: 10,
      alertText: (data, matches, output) => {
        const partner = matches.source === data.me ? matches.target : matches.source;
        return output.breakTether({ partner: data.party.member(partner) });
      },
      outputStrings: {
        breakTether: {
          en: 'Break tether (w/ ${partner})',
          de: 'Verbindung brechen (mit ${partner})',
          ja: '線切る (${partner})',
          cn: '拉断连线 (和 ${partner})',
          ko: '선 끊기 (+ ${partner})',
        },
      },
    },
    {
      id: 'ZeromusEx Black Hole Tracker',
      type: 'HeadMarker',
      netRegex: { id: headmarkerMap.blackHole },
      run: (data, matches) => data.blackHolePlayer = matches.target,
    },
    {
      id: 'ZeromusEx Fractured Eventide NE Safe',
      type: 'StartsUsing',
      netRegex: { id: '8B3C', source: 'Zeromus', capture: false },
      alarmText: (data, _matches, output) => {
        if (data.me === data.blackHolePlayer)
          return output.blackHole();
      },
      alertText: (_data, _matches, output) => output.northeast(),
      run: (data) => delete data.blackHolePlayer,
      outputStrings: {
        northeast: Outputs.northeast,
        blackHole: {
          en: 'East Black Hole on Wall',
          de: 'Schwarzes Loch an die östliche Wand',
          cn: '右上放置黑洞',
          ko: '오른쪽 구석에 블랙홀 놓기',
        },
      },
    },
    {
      id: 'ZeromusEx Fractured Eventide NW Safe',
      type: 'StartsUsing',
      netRegex: { id: '8B3D', source: 'Zeromus', capture: false },
      alarmText: (data, _matches, output) => {
        if (data.me === data.blackHolePlayer)
          return output.blackHole();
      },
      alertText: (_data, _matches, output) => output.northwest(),
      run: (data) => delete data.blackHolePlayer,
      outputStrings: {
        northwest: Outputs.northwest,
        blackHole: {
          en: 'West Black Hole on Wall',
          de: 'Schwarzes Loch an die westliche Wand',
          cn: '左上放置黑洞',
          ko: '왼쪽 구석에 블랙홀 놓기',
        },
      },
    },
    {
      id: 'ZeromusEx Big Crunch',
      type: 'StartsUsing',
      netRegex: { id: '8B4D', source: 'Zeromus', capture: false },
      response: Responses.bleedAoe(),
    },
    {
      id: 'ZeromusEx Sparking Flare Tower',
      type: 'StartsUsing',
      netRegex: { id: '8B5E', source: 'Zeromus', capture: false },
      durationSeconds: 6,
      alertText: (_data, _matches, output) => output.text(),
      run: (data) => data.flareMechanic = 'spread',
      outputStrings: {
        text: {
          en: 'Get Towers => Spread',
          de: 'Türme nehmen => Verteilen',
          cn: '踩塔 => 分散',
          ko: '기둥 밟기 => 산개',
        },
      },
    },
    {
      id: 'ZeromusEx Branding Flare Tower',
      type: 'StartsUsing',
      netRegex: { id: '8B5F', source: 'Zeromus', capture: false },
      durationSeconds: 6,
      alertText: (_data, _matches, output) => output.text(),
      run: (data) => data.flareMechanic = 'stack',
      outputStrings: {
        text: {
          en: 'Get Towers => Partner Stacks',
          de: 'Türme nehmen => mit Partner sammeln',
          cn: '踩塔 => 分摊',
          ko: '기둥 밟기 => 2인 쉐어',
        },
      },
    },
    {
      id: 'ZeromusEx Flare Mechanic With Nox',
      type: 'HeadMarker',
      netRegex: { id: headmarkerMap.nox },
      condition: (data, matches) => {
        data.noxPlayers.push(matches.target);
        return data.me === matches.target;
      },
      alarmText: (data, _matches, output) => {
        if (data.flareMechanic === 'stack')
          return output.stackWithNox();
        if (data.flareMechanic === 'spread')
          return output.spreadWithNox();
      },
      outputStrings: {
        stackWithNox: {
          en: 'Partner Stack + Chasing Nox',
          de: 'Mit Partner Sammeln + verfolgendes Nox',
          cn: '分摊 + 步进点名',
          ko: '2인 쉐어 + 따라오는 장판',
        },
        spreadWithNox: {
          en: 'Spread + Chasing Nox',
          de: 'Verteilen + verfolgendes Nox',
          cn: '分散 + 步进点名',
          ko: '산개 + 따라오는 장판',
        },
      },
    },
    {
      id: 'ZeromusEx Flare Mechanic No Nox',
      type: 'HeadMarker',
      netRegex: { id: headmarkerMap.nox, capture: false },
      delaySeconds: (data) => data.noxPlayers.length === 2 ? 0 : 0.5,
      suppressSeconds: 5,
      alertText: (data, _matches, output) => {
        if (data.noxPlayers.includes(data.me))
          return;
        if (data.flareMechanic === 'stack')
          return output.stack();
        if (data.flareMechanic === 'spread')
          return output.spread();
      },
      outputStrings: {
        stack: {
          en: 'Partner Stack',
          de: 'mit Partner sammeln',
          cn: '分摊',
          ko: '2인 쉐어',
        },
        spread: {
          en: 'Spread',
          de: 'Verteilen',
          cn: '分散',
          ko: '산개',
        },
      },
    },
    {
      id: 'ZeromusEx Rend the Rift',
      type: 'StartsUsing',
      netRegex: { id: '8C0D', source: 'Zeromus', capture: false },
      response: Responses.aoe(),
      run: (data) => data.phase = 'two',
    },
    {
      id: 'ZeromusEx Nostalgia',
      type: 'Ability',
      // Call this on the ability not the cast so 10 second mits last.
      netRegex: { id: '8B6B', source: 'Zeromus', capture: false },
      suppressSeconds: 5,
      response: Responses.bigAoe(),
    },
    {
      id: 'ZeromusEx Flow of the Abyss',
      type: 'MapEffect',
      netRegex: { flags: '00020001', location: ['02', '03', '04'] },
      infoText: (data, matches, output) => {
        const flowMap = {
          '02': 'north',
          '03': 'middle',
          '04': 'south',
        };
        data.flowLocation = flowMap[matches.location];
        if (data.flowLocation === 'north')
          return output.north();
        if (data.flowLocation === 'middle')
          return output.middle();
        if (data.flowLocation === 'south')
          return output.south();
      },
      outputStrings: {
        north: {
          en: 'Out of North',
          de: 'Weg vom Norden',
          cn: '远离北边',
          ko: '북쪽 피하기',
        },
        middle: {
          en: 'Out of Middle',
          de: 'Weg von der Mitte',
          cn: '远离中间',
          ko: '중앙 피하기',
        },
        south: {
          en: 'Out of South',
          de: 'Weg vom Süden',
          cn: '远离南边',
          ko: '남쪽 피하기',
        },
      },
    },
    {
      id: 'ZeromusEx Akh Rhai',
      type: 'HeadMarker',
      netRegex: { id: headmarkerMap.akhRhaiSpread },
      condition: Conditions.targetIsYou(),
      alertText: (data, _matches, output) => {
        if (data.flowLocation === undefined)
          return output.spread();
        return output[`${data.flowLocation}Spread`]();
      },
      run: (data) => delete data.flowLocation,
      outputStrings: {
        spread: Outputs.spread,
        northSpread: {
          en: 'Spread Middle/South',
          de: 'Verteilen Mitte/Süden',
          cn: '中间/南边 分散',
          ko: '중앙/남쪽으로 산개',
        },
        middleSpread: {
          en: 'Spread North/South',
          de: 'Verteilen Norden/Süden',
          cn: '北边/南边 分散',
          ko: '북쪽/남쪽으로 산개',
        },
        southSpread: {
          en: 'Spread North/Middle',
          de: 'Verteilen Norden/Mitte',
          cn: '北边/中间 分散',
          ko: '북쪽/중앙으로 산개',
        },
      },
    },
    {
      id: 'ZeromusEx Akh Rhai Followup',
      type: 'Ability',
      netRegex: { id: '8B74', source: 'Zeromus', capture: false },
      suppressSeconds: 5,
      response: Responses.moveAway(),
    },
    {
      id: 'ZeromusEx Umbral Prism Enumeration',
      type: 'HeadMarker',
      netRegex: { id: headmarkerMap.enums, capture: false },
      suppressSeconds: 2,
      alertText: (data, _matches, output) => {
        if (data.flowLocation === undefined)
          return output.enumeration();
        return output[`${data.flowLocation}Enumeration`]();
      },
      run: (data) => delete data.flowLocation,
      outputStrings: {
        enumeration: {
          en: 'Enumeration',
          de: 'Enumeration',
          fr: 'Énumération',
          ja: 'エアーバンプ',
          cn: '蓝圈分摊',
          ko: '2인 장판',
        },
        northEnumeration: {
          en: 'Enumeration Middle/South',
          de: 'Enumeration Mitte/Süden',
          cn: '中间/南边 蓝圈分摊',
          ko: '2인 장판 중앙/남쪽',
        },
        middleEnumeration: {
          en: 'Enumeration North/South',
          de: 'Enumeration Norden/Süden',
          cn: '北边/南边 蓝圈分摊',
          ko: '2인 장판 북쪽/남쪽',
        },
        southEnumeration: {
          en: 'Enumeration North/Middle',
          de: 'Enumeration Norden/Mitte',
          cn: '北边/中间 蓝圈分摊',
          ko: '2인 장판 북쪽/중앙',
        },
      },
    },
    {
      id: 'ZeromusEx Umbral Rays Stack',
      type: 'HeadMarker',
      netRegex: { id: headmarkerMap.stack, capture: false },
      condition: (data) => data.phase === 'two',
      alertText: (data, _matches, output) => {
        if (data.flowLocation === undefined)
          return output.stack();
        return output[`${data.flowLocation}Stack`]();
      },
      run: (data) => delete data.flowLocation,
      outputStrings: {
        stack: Outputs.stackMarker,
        northStack: {
          en: 'Stack Middle',
          de: 'Mittig sammeln',
          cn: '中间分摊',
          ko: '중앙에서 쉐어',
        },
        middleStack: {
          en: 'Stack North',
          de: 'Nördlich sammeln',
          cn: '北边分摊',
          ko: '북쪽에서 쉐어',
        },
        southStack: {
          en: 'Stack North/Middle',
          de: 'Nördlich/Mittig sammeln',
          cn: '北边/中间 分摊',
          ko: '북쪽/중앙에서 쉐어',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Branding Flare/Sparking Flare': 'Branding/Sparking Flare',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'Comet': 'Komet',
        'Toxic Bubble': 'Giftblase',
        'Zeromus': 'Zeromus',
      },
      'replaceText': {
        '--spread--': '--verteilen--',
        '--towers--': '--Türme--',
        'Abyssal Echoes': 'Abyssal-Echos',
        'Abyssal Nox': 'Abyssal-Nox',
        'Akh Rhai': 'Akh Rhai',
        'Big Bang': 'Großer Knall',
        'Big Crunch': 'Großer Quetscher',
        'Black Hole': 'Schwarzes Loch',
        'Branding Flare': 'Flare-Brand',
        'Burst': 'Kosmos-Splitter',
        'Bury': 'Impakt',
        'Chasmic Nails': 'Abyssal-Nagel',
        'Dark Matter': 'Dunkelmaterie',
        'Dimensional Surge': 'Dimensionsschwall',
        'Explosion': 'Explosion',
        '(?<! )Flare': 'Flare',
        'Flow of the Abyss': 'Abyssaler Strom',
        'Forked Lightning': 'Gabelblitz',
        'Fractured Eventide': 'Abendglut',
        'Meteor Impact': 'Meteoreinschlag',
        'Miasmic Blast': 'Miasma-Detonation',
        'Nostalgia': 'Heimweh',
        'Primal Roar': 'Lautes Gebrüll',
        'Prominence Spine': 'Ossale Protuberanz',
        'Rend the Rift': 'Dimensionsstörung',
        '(?<! )Roar': 'Brüllen',
        'Sable Thread': 'Pechschwarzer Pfad',
        'Sparking Flare': 'Flare-Funken',
        'The Dark Beckons': 'Fressende Finsternis: Last',
        'The Dark Divides': 'Fressende Finsternis: Zerschmetterung',
        'Umbral Prism': 'Umbrales Prisma',
        'Umbral Rays': 'Pfad der Dunkelheit',
        'Visceral Whirl': 'Viszerale Schürfwunden',
        'Void Bio': 'Nichts-Bio',
        'Void Meteor': 'Nichts-Meteo',
        'the Dark Beckons': 'Fressende Finsternis: Last',
        'the Dark Binds': 'Fressende Finsternis: Kette',
        'the Dark Divides': 'Fressende Finsternis: Zerschmetterung',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Comet': 'comète',
        'Toxic Bubble': 'bulle empoisonnée',
        'Zeromus': 'Zeromus',
      },
      'replaceText': {
        'Abyssal Echoes': 'Écho abyssal',
        'Abyssal Nox': 'Nox abyssal',
        'Akh Rhai': 'Akh Rhai',
        'Big Bang': 'Big bang',
        'Big Crunch': 'Big crunch',
        'Black Hole': 'Trou noir',
        'Branding Flare': 'Marque de brasier',
        'Burst': 'Éclatement',
        'Bury': 'Impact',
        'Chasmic Nails': 'Clous abyssaux',
        'Dark Matter': 'Matière sombre',
        'Dimensional Surge': 'Déferlante dimensionnelle',
        'Explosion': 'Explosion',
        '(?<! )Flare': 'Brasier',
        'Flow of the Abyss': 'Flot abyssal',
        'Forked Lightning': 'Éclair ramifié',
        'Fractured Eventide': 'Éclat crépusculaire',
        'Meteor Impact': 'Impact de météore',
        'Miasmic Blast': 'Explosion miasmatique',
        'Nostalgia': 'Nostalgie',
        'Primal Roar': 'Rugissement furieux',
        'Prominence Spine': 'Évidence ossuaire',
        'Rend the Rift': 'Déchirure dimensionnelle',
        '(?<! )Roar': 'Rugissement',
        'Sable Thread': 'Rayon sombre',
        'Sparking Flare': 'Étincelle de brasier',
        'The Dark Beckons': 'Ténèbres rongeuses : Gravité',
        'The Dark Divides': 'Ténèbres rongeuses : Pulvérisation',
        'Umbral Prism': 'Déluge de Ténèbres',
        'Umbral Rays': 'Voie de ténèbres',
        'Visceral Whirl': 'Écorchure viscérale',
        'Void Bio': 'Bactéries du néant',
        'Void Meteor': 'Météores du néant',
        'the Dark Beckons': 'Ténèbres rongeuses : Gravité',
        'the Dark Binds': 'Ténèbres rongeuses : Chaînes',
        'the Dark Divides': 'Ténèbres rongeuses : Pulvérisation',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Comet': 'コメット',
        'Toxic Bubble': 'ポイズナスバブル',
        'Zeromus': 'ゼロムス',
      },
      'replaceText': {
        'Abyssal Echoes': 'アビサルエコー',
        'Abyssal Nox': 'アビサルノックス',
        'Akh Rhai': 'アク・ラーイ',
        'Big Bang': 'ビッグバーン',
        'Big Crunch': 'ビッグクランチ',
        'Black Hole': 'ブラックホール',
        'Branding Flare': 'フレアブランド',
        'Burst': '飛散',
        'Bury': '衝撃',
        'Chasmic Nails': 'アビサルネイル',
        'Dark Matter': 'ダークマター',
        'Dimensional Surge': 'ディメンションサージ',
        'Explosion': '爆発',
        '(?<! )Flare': 'フレア',
        'Flow of the Abyss': 'アビサルフロウ',
        'Forked Lightning': 'フォークライトニング',
        'Fractured Eventide': '黒竜閃',
        'Meteor Impact': 'メテオインパクト',
        'Miasmic Blast': '瘴気爆発',
        'Nostalgia': '望郷',
        'Primal Roar': '大咆哮',
        'Prominence Spine': 'プロミネンススパイン',
        'Rend the Rift': '次元干渉',
        '(?<! )Roar': '咆哮',
        'Sable Thread': '漆黒の熱線',
        'Sparking Flare': 'フレアスパーク',
        'The Dark Beckons': '闇の侵食：重',
        'The Dark Divides': '闇の侵食：砕',
        'Umbral Prism': '闇の重波動',
        'Umbral Rays': '闇の波動',
        'Visceral Whirl': 'ヴィセラルワール',
        'Void Bio': 'ヴォイド・バイオ',
        'Void Meteor': 'ヴォイド・メテオ',
        'the Dark Beckons': '闇の侵食：重',
        'the Dark Binds': '闇の侵食：鎖',
        'the Dark Divides': '闇の侵食：砕',
      },
    },
  ],
});
