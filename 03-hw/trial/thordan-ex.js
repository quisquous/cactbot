const unsafeMap = {
  dirN: 'dirS',
  dirNE: 'dirSW',
  dirE: 'dirW',
  dirSE: 'dirNW',
  dirS: 'dirN',
  dirSW: 'dirNE',
  dirW: 'dirE',
  dirNW: 'dirSE',
};
const fullDirNameMap = {
  dirN: Outputs.north,
  dirNE: Outputs.northeast,
  dirE: Outputs.east,
  dirSE: Outputs.southeast,
  dirS: Outputs.south,
  dirSW: Outputs.southwest,
  dirW: Outputs.west,
  dirNW: Outputs.northwest,
  unknown: Outputs.unknown,
};
Options.Triggers.push({
  id: 'TheMinstrelsBalladThordansReign',
  zoneId: ZoneId.TheMinstrelsBalladThordansReign,
  timelineFile: 'thordan-ex.txt',
  initData: () => {
    return {
      phase: 1,
      thrustPositions: [],
      seenThrust: false,
      defCounter: 1,
    };
  },
  timelineTriggers: [
    // All timeline triggers include a base suppression of 5 seconds
    // to avoid potential noise from timeline jitter.
    {
      id: 'ThordanEX Ascalons Might',
      regex: /Ascalon's Might/,
      beforeSeconds: 4,
      suppressSeconds: 5,
      response: Responses.tankCleave(),
    },
    {
      // Puddle positions snapshot well before the actual Heavensflame explosion.
      // BeforeSeconds: 10 is correct, as it ends up being only 5-6 seconds
      // in practice.
      id: 'ThordanEX Heavensflame',
      regex: /Heavensflame 1/,
      beforeSeconds: 10,
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.baitPuddles(),
      outputStrings: {
        baitPuddles: {
          en: 'Bait puddles',
          cn: '诱导圈圈',
        },
      },
    },
    {
      id: 'ThordanEX Heavenly Slash',
      regex: /Heavenly Slash/,
      beforeSeconds: 4,
      suppressSeconds: 5,
      response: Responses.tankCleave(),
    },
    {
      id: 'ThordanEX Faith Unmoving',
      regex: /Faith Unmoving/,
      beforeSeconds: 6,
      condition: (data) => data.phase === 2,
      suppressSeconds: 5,
      response: Responses.knockback(),
    },
    {
      id: 'ThordanEX Dimensional Collapse',
      regex: /Dimensional Collapse/,
      beforeSeconds: 10,
      suppressSeconds: 5,
      alertText: (_data, _matches, output) => output.baitPuddles(),
      outputStrings: {
        baitPuddles: {
          en: 'Bait gravity puddles',
          cn: '诱导黑圈',
        },
      },
    },
    {
      id: 'ThordanEX Light Of Ascalon',
      regex: /The Light of Ascalon 1/,
      beforeSeconds: 5,
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.knockbackAoe(),
      outputStrings: {
        knockbackAoe: {
          en: 'AOE + knockback x7',
          cn: 'AOE + 击退 x7',
        },
      },
    },
    {
      id: 'ThordanEX Ultimate End',
      regex: /Ultimate End/,
      beforeSeconds: 6,
      suppressSeconds: 5,
      response: Responses.bigAoe(),
    },
  ],
  triggers: [
    // Phase tracking
    {
      // Cue off Thordan's movement ability alongside him going untargetable
      id: 'ThordanEX Intermission Phase',
      type: 'Ability',
      netRegex: { id: '105A', source: 'King Thordan', capture: false },
      run: (data) => data.phase = 2,
    },
    {
      // Cue off Knights of the Round
      id: 'ThordanEX Post-Intermission Phase Tracker',
      type: 'Ability',
      netRegex: { id: '148C', source: 'King Thordan', capture: false },
      run: (data) => data.phase += 1,
    },
    {
      id: 'ThordanEX Main Tank Tracker',
      type: 'Ability',
      netRegex: { id: '147D', source: 'King Thordan' },
      condition: (data, matches) => data.mainTank !== matches.target,
      run: (data, matches) => data.mainTank = matches.target,
    },
    {
      id: 'ThordanEX Lightning Storm',
      type: 'HeadMarker',
      netRegex: { id: '0018' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'ThordanEX Dragons Rage',
      type: 'HeadMarker',
      netRegex: { id: '003E' },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'ThordanEX Ancient Quaga',
      type: 'StartsUsing',
      netRegex: { id: '1485', source: 'King Thordan', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'ThordanEX Heavenly Heel',
      type: 'StartsUsing',
      netRegex: { id: '1487', source: 'King Thordan' },
      response: Responses.tankBuster(),
    },
    {
      id: 'ThordanEX Holy Chains',
      type: 'Tether',
      netRegex: { id: '0009' },
      condition: (data, matches) => data.me === matches.source || data.me === matches.target,
      alertText: (data, matches, output) => {
        const partner = data.me === matches.source ? matches.target : matches.source;
        return output.breakChains({ partner: data.ShortName(partner) });
      },
      outputStrings: {
        breakChains: {
          en: 'Break chains with ${partner}',
          cn: '与 ${partner} 拉断连锁',
        },
      },
    },
    {
      id: 'ThordanEX Conviction',
      type: 'StartsUsing',
      netRegex: { id: '149D', source: 'Ser Hermenost', capture: false },
      suppressSeconds: 5,
      response: Responses.getTowers(),
    },
    {
      id: 'ThordanEX Dragons Gaze',
      type: 'StartsUsing',
      netRegex: { id: '1489', source: 'King Thordan', capture: false },
      alertText: (data, _matches, output) => {
        if (data.phase === 1)
          return output.singleGaze();
        return output.doubleGaze();
      },
      outputStrings: {
        singleGaze: {
          en: 'Look away from Thordan',
          cn: '背对托尔丹',
        },
        doubleGaze: {
          en: 'Look away from Thordan and Eye',
          cn: '背对托尔丹和眼睛',
        },
      },
    },
    {
      id: 'ThordanEX Triple Spiral Thrust Collect',
      type: 'Ability',
      netRegex: { id: '1018', source: ['Ser Ignasse', 'Ser Paulecrain', 'Ser Vellguine'] },
      condition: (data) => data.phase === 2 && !data.seenThrust,
      run: (data, matches) => data.thrustPositions.push(matches),
    },
    {
      id: 'ThordanEX Triple Spiral Thrust Call',
      type: 'Ability',
      netRegex: {
        id: '1018',
        source: ['Ser Ignasse', 'Ser Paulecrain', 'Ser Vellguine'],
        capture: false,
      },
      condition: (data) => data.phase === 2 && !data.seenThrust,
      delaySeconds: 0.5,
      infoText: (data, _matches, output) => {
        if (data.thrustPositions.length !== 3)
          return;
        let safeDirs = Object.keys(unsafeMap);
        data.thrustPositions.forEach((knight) => {
          const knightNum = Directions.hdgTo8DirNum(parseFloat(knight.heading));
          const knightDir = Directions.outputFrom8DirNum(knightNum);
          const pairedDir = unsafeMap[knightDir];
          safeDirs = safeDirs.filter((dir) => dir !== knightDir && dir !== pairedDir);
        });
        if (safeDirs.length !== 2)
          return;
        const [dir1, dir2] = safeDirs.sort();
        if (dir1 === undefined || dir2 === undefined)
          return;
        return output.combined({ dir1: output[dir1](), dir2: output[dir2]() });
      },
      run: (data) => {
        data.thrustPositions = [];
        data.seenThrust = true;
      },
      outputStrings: {
        combined: {
          en: '${dir1} / ${dir2} Safe',
          de: '${dir1} / ${dir2} Sicher',
          cn: '${dir1} / ${dir2} 安全',
          ko: '${dir1} / ${dir2} 안전',
        },
        ...Directions.outputStrings8Dir,
      },
    },
    {
      id: 'ThordanEX Sword Of The Heavens',
      type: 'GainsEffect',
      netRegex: { effectId: '3B0' },
      infoText: (_data, matches, output) => output.attackSword({ swordKnight: matches.target }),
      run: (data, matches) => data.swordKnight = matches.target,
      outputStrings: {
        attackSword: {
          en: 'Attack ${swordKnight}',
          cn: '攻击 ${swordKnight}',
        },
      },
    },
    {
      id: 'ThordanEX Shield Of The Heavens',
      type: 'GainsEffect',
      netRegex: { effectId: '3B1' },
      run: (data, matches) => data.shieldKnight = matches.target,
    },
    {
      id: 'ThordanEX Holiest Of Holy',
      type: 'StartsUsing',
      netRegex: { id: '1495', source: ['Ser Adelphel', 'Ser Janlenoux'], capture: false },
      suppressSeconds: 5,
      response: Responses.aoe(),
    },
    {
      id: 'ThordanEX Holy Bladedance Collect',
      type: 'StartsUsing',
      netRegex: { id: '1496', source: ['Ser Adelphel', 'Ser Janlenoux'] },
      run: (data, matches) => {
        if (data.swordKnight === matches.source)
          data.swordTarget = matches.target;
        if (data.shieldKnight === matches.source)
          data.shieldTarget = matches.target;
      },
    },
    {
      id: 'ThordanEX Holy Bladedance Call',
      type: 'StartsUsing',
      netRegex: { id: '1496', source: ['Ser Adelphel', 'Ser Janlenoux'], capture: false },
      delaySeconds: 0.5,
      suppressSeconds: 5,
      alertText: (data, _matches, output) => {
        if (data.swordTarget === undefined || data.shieldTarget === undefined)
          return output.unknownDance();
        const swordTarget = data.ShortName(data.swordTarget);
        const shieldTarget = data.ShortName(data.shieldTarget);
        if (data.swordTarget === data.shieldTarget)
          return output.singleDance({ target: swordTarget });
        return output.doubleDance({ sword: swordTarget, shield: shieldTarget });
      },
      run: (data) => {
        delete data.shieldKnight;
        delete data.swordKnight;
        delete data.shieldTarget;
        delete data.swordTarget;
      },
      outputStrings: {
        unknownDance: {
          en: 'Heavy busters',
          cn: '高伤死刑',
        },
        singleDance: {
          en: '2x buster on ${target}',
          cn: '双死刑点 ${target}',
        },
        doubleDance: {
          en: 'Sword buster on ${sword} (shield on ${shield})',
          cn: '剑死刑点 ${sword} (盾死刑点 ${shield})',
        },
      },
    },
    {
      id: 'ThordanEX Skyward Leap',
      type: 'HeadMarker',
      netRegex: { id: '000E' },
      condition: Conditions.targetIsYou(),
      alarmText: (data, _matches, output) => {
        if (data.phase !== 2)
          return output.defamationNoNumber();
        return output.defamationCounted({ number: data.defCounter });
      },
      run: (data) => data.defCounter += 1,
      outputStrings: {
        defamationNoNumber: {
          en: 'Defamation on YOU',
          cn: '穿天点名',
        },
        defamationCounted: {
          en: 'Defamation #${number} on YOU',
          cn: '穿天 #${number} 点名',
        },
      },
    },
    {
      id: 'ThordanEX Spiral Pierce',
      type: 'Tether',
      netRegex: { id: '0005' },
      condition: Conditions.targetIsYou(),
      suppressSeconds: 5,
      alertText: (_data, _matches, output) => output.pierceYou(),
      outputStrings: {
        pierceYou: {
          en: 'Line AoE on YOU',
          cn: '直线AOE点名',
        },
      },
    },
    {
      id: 'ThordanEX Hiemal Storm',
      type: 'HeadMarker',
      netRegex: { id: '001D' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.icePuddleYou(),
      outputStrings: {
        icePuddleYou: {
          en: 'Ice puddle on YOU',
          cn: '冰圈点名',
        },
      },
    },
    {
      id: 'ThordanEX Comet Puddles',
      type: 'HeadMarker',
      netRegex: { id: '000B' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.meteorYou(),
      outputStrings: {
        meteorYou: {
          en: '4x meteor puddles on YOU',
          cn: '4连陨石点名',
        },
      },
    },
    {
      id: 'ThordanEX Fury Spear',
      type: 'HeadMarker',
      netRegex: { id: '0010' },
      alarmText: (data, matches, output) => {
        // Whoever is actively tanking Thordan must not stack,
        // because they will be taking Heavenly Heel shortly after.
        // If they stack, they will receive the physical vulnerability up and auto-die.
        if (data.me !== data.mainTank)
          return;
        if (data.me === matches.target)
          return output.spearYou();
        return output.spearMainTank();
      },
      alertText: (data, matches, output) => {
        if (data.me === data.mainTank)
          return;
        if (data.me === matches.target)
          return output.spearYou();
        return output.spearOther({ spearTarget: matches.target });
      },
      outputStrings: {
        spearYou: {
          en: 'Wild Charge on YOU',
          cn: '奶枪点名',
        },
        spearMainTank: {
          en: 'Wild Charge: STAY OUT',
          cn: '奶枪: 保持远离',
        },
        spearOther: {
          en: 'Wild Charge: Intercept ${spearTarget}',
          cn: '奶枪: 挡住 ${spearTarget}',
        },
      },
    },
    {
      id: 'ThordanEX Pure Of Soul',
      type: 'StartsUsing',
      netRegex: { id: '14B1', source: 'Ser Charibert', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'ThordanEX Single Spiral Thrust',
      type: 'Ability',
      netRegex: { id: '1018', source: 'Ser Vellguine' },
      condition: (data) => data.phase === 5,
      infoText: (_data, matches, output) => {
        const knightNum = Directions.hdgTo8DirNum(parseFloat(matches.heading));
        const knightDir = Directions.outputFrom8DirNum(knightNum);
        const [dir1, dir2] = [knightDir, unsafeMap[knightDir]].sort();
        if (dir1 === undefined || dir2 === undefined)
          return;
        return output.combined({ dir1: output[dir1](), dir2: output[dir2]() });
      },
      outputStrings: {
        combined: {
          en: '${dir1} / ${dir2} Unsafe',
          cn: '${dir1} / ${dir2} 危险',
        },
        ...Directions.outputStrings8Dir,
      },
    },
    {
      id: 'ThordanEX Faith Unmoving Off Center',
      type: 'Ability',
      netRegex: { id: '1018', source: 'Ser Grinnaux' },
      condition: (data) => data.phase === 4,
      delaySeconds: 7,
      alertText: (_data, matches, output) => {
        const knightX = parseFloat(matches.x);
        const knightY = parseFloat(matches.y);
        const knightDir = Directions.xyTo8DirOutput(knightX, knightY, 0, 0);
        return output.knockbackWarn({ knightDir: output[knightDir]() });
      },
      outputStrings: {
        knockbackWarn: {
          en: 'Knockback from ${knightDir}',
          cn: '${knightDir} 击退',
        },
        ...fullDirNameMap,
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'The Dragon\'s Gaze/The Dragon\'s Glory': 'The Dragon\'s Gaze/Glory',
      },
    },
  ],
});
