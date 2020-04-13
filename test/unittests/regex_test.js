'use strict';

let Regexes = require('../../resources/regexes.js');
let assert = require('chai').assert;

// Quite bogus.
let bogusLine = 'using act is cheating';

// An automated way to test standard regex functions that take a dictionary of fields.
let regexCaptureTest = (func, lines) => {
  // regex should not match the bogus line.
  assert.isNull(bogusLine.match(func({})));

  for (let i = 0; i < lines.length; ++i) {
    let line = lines[i];

    // Undefined params (default capture).
    let undefinedParamsMatch = line.match(func());
    assert.isNotNull(undefinedParamsMatch, '' + func() + ' did not match ' + line);
    assert.notPropertyVal(undefinedParamsMatch, 'groups', undefined);

    // Empty params (default capture).
    let emptyParamsMatch = line.match(func({}));
    assert.isNotNull(emptyParamsMatch, '' + func({}) + ' did not match ' + line);
    assert.notPropertyVal(emptyParamsMatch, 'groups', undefined);

    // No capture match.
    let noCaptureMatch = line.match(func({ capture: false }));
    assert.isNotNull(noCaptureMatch);
    assert.propertyVal(noCaptureMatch, 'groups', undefined);

    // Capture match.
    let captureMatch = line.match(func({ capture: true }));
    assert.isNotNull(captureMatch);
    assert.notPropertyVal(captureMatch, 'groups', undefined);
    assert.isObject(captureMatch.groups);

    // Capture always needs at least one thing.
    let keys = Object.keys(captureMatch.groups);
    assert.isAbove(keys.length, 0);

    let explicitFields = {};
    explicitFields.capture = true;
    for (let j = 0; j < keys.length; ++j) {
      let key = keys[j];

      // Because matched values may have special regex
      // characters in it, escape these when specifying.
      let value = captureMatch.groups[key];
      let escaped = value;
      if (typeof value !== 'undefined')
        escaped = escaped.replace(/[.*+?^${}()]/g, '\\$&');
      explicitFields[key] = escaped;
    }

    // Specifying all the fields explicitly and capturing should
    // both match, and return the same thing.
    // This verifies that input parameters to the regex fields and
    // named matching groups are equivalent.
    let explicitCaptureMatch = line.match(func(explicitFields));
    assert.isNotNull(explicitCaptureMatch);
    assert.notPropertyVal(explicitCaptureMatch, 'groups', undefined);
    assert.isObject(explicitCaptureMatch.groups);
    assert.deepEqual(explicitCaptureMatch.groups, captureMatch.groups);

    // Not capturing with explicit fields should also work.
    explicitFields.capture = false;
    let explicitNoCaptureMatch = line.match(func(explicitFields));
    assert.isNotNull(explicitNoCaptureMatch);
    assert.propertyVal(explicitNoCaptureMatch, 'groups', undefined);
  }
};

let tests = {
  startsUsing: () => {
    let lines = [
      '[14:13:23.660] 14:5B2:Twintania starts using Death Sentence on Potato Chippy.',
      '[12:25:03.586] 14:6CE:Phlegethon starts using Megiddo Flame on Unknown.',
      '[12:50:05.414] 14:04:T\'ini Poutini starts using Mount on T\'ini Poutini.',
    ];
    regexCaptureTest(Regexes.startsUsing, lines);
  },
  ability: () => {
    let lines = [
      '[11:48:11.476] 16:10683258:Okonomi Yaki:3F40:Double Standard Finish:10683258:Okonomi Yaki:50F:71D0000:0:0:0:0:0:0:0:0:0:0:0:0:0:0:783:783:10000:10000:0:1000:-265.2183:-77.28939:4.323432:1.70142:783:783:10000:10000:0:1000:-265.2183:-77.28939:4.323432:1.70142:0000AC32',
      '[12:05:12.479] 15:4007CA96:Graffias:366:Attack:106E8400:Tako Yaki:710003:3F0000:0:0:0:0:0:0:0:0:0:0:0:0:0:0:967:1107:10000:10000:0:1000:223.4988:-147.7532:-39.29175:-3.109571:1604:10948:0:0:0:1000:225.452:-145.6169:-39.29175:-3.013695:0000B2D4',
      '[12:48:31.881] 16:4004D36E:Necropsyche:46A8:Neuro Squama:4004D3F1:Lefse:750003:74E0000:1C:46A88000:0:0:0:0:0:0:0:0:0:0:0:0:46373:48662:7000:7000:0:1000:-528.4657:387.2892:45.88464:0.6611078:2074788:4874688:10000:10000:0:1000:-525.4445:391.1954:46.67033:-1.60059:005286B5',
    ];

    let testBadMatch = '[20:29:39.392] 15:107B9AC8:Tako Yaki:07:Attack:40017D58:Daxio:710003:DC0000:1E:50000:1C:1B60000:550003:2CA000:0:0:0:0:0:0:0:0:8207:24837:7230:7230:0:1000:527.5806:-362.7833:-19.61513:2.898741:8998:8998:10000:10000:0:1000:528.6487:-365.8656:-22.08109:-0.3377206:000AD7BF';
    // Bad match is an ability line too.
    lines.push(testBadMatch);

    regexCaptureTest(Regexes.ability, lines);
    regexCaptureTest(Regexes.abilityFull, lines);

    // Tests a bug where a :1E: later in the line would be caught by overzealous
    // matchers on source names.
    let abilityHallowed = Regexes.ability({ id: '1E' });
    assert.isNull(testBadMatch.match(abilityHallowed));
  },
  headMarker: () => {
    let lines = [
      '[21:51:06.027] 1B:107C73B8:Aloo Gobi:0000:5DC3:00C0:0000:0000:0000:',
      '[20:23:38.707] 1B:10595B8B:Baked Potato:0000:0000:0017:0000:0000:0000:',
      '[12:14:44.048] 1B:102D9908:Au Gratin:0000:0000:0005:0000:0000:0000:',
    ];
    regexCaptureTest(Regexes.headMarker, lines);
  },
  addedCombatant: () => {
    let lines = [
      '[12:11:18.753] 03:4000226B:Added new combatant Valar.  Job: N/A Level: 50 Max HP: 10195 Max MP: 2800 Pos: (-461.2344,269.7031,41.6) (82100000002399).',
      '[12:19:45.493] 03:103410A1:Added new combatant Pot Pie(Goblin).  Job: Brd Level: 50 Max HP: 6701 Max MP: 10000 Pos: (-109.8864,-43.24811,38.21077).',
      '[19:20:54.327] 03:4000637B:Added new combatant Automaton Queen.  Job: N/A Level: 80 Max HP: 98170 Max MP: 10000 Pos: (94.95013,106.0116,-2.384186E-07) (82300000010490).',
    ];
    regexCaptureTest(Regexes.addedCombatant, lines);
    regexCaptureTest(Regexes.addedCombatantFull, lines);
  },
  removingCombatant: () => {
    let lines = [
      '[19:21:04.737] 04:40006379:Removing combatant Demi-Phoenix.  Max HP: 561184. Pos: (86.62549,117.9675,0).',
      '[19:22:02.069] 04:40006274:Removing combatant Eden.  Max HP: 21495808. Pos: (100,100,0).',
      '[21:58:30.439] 04:40007FDF:Removing combatant Haurchefant Greystone.  Max HP: 68. Pos: (102.85,102.85,7.152558E-07).',
    ];
    regexCaptureTest(Regexes.removingCombatant, lines);
  },
  gainsEffect: () => {
    let lines = [
      '[21:46:43.348] 1A:10595A8C:Papas Fritas gains the effect of Battle Litany from Potato Casserole for 20.00 Seconds.',
      '[21:51:06.027] 1A:10686259:Patatas Bravas gains the effect of Doom from  for 10.00 Seconds.',
      '[21:58:02.948] 1A:106CBE53:Potato Latke gains the effect of Aetherflow from Potato Latke for 9999.00 Seconds. (2)',
    ];
    regexCaptureTest(Regexes.gainsEffect, lines);
  },
  statusEffectExplicit: () => {
    let lines = [
      '[23:24:13.184] 26:4000D3EB::00505015:148000:148000:0:0:0:0:117.5402:107.2556:2.384186E-07:-1.963573:03E8:0:0:840893:40800000:E0000000:',
      '[23:24:15.679] 26:4000D3E6::0050501C:0:148000:0:0:0:0:84.83353:101.1907:-1.105378E-08:2.79271:0:A5:0:',
      '[23:24:17.192] 26:4000D3E9::0050501B:148000:148000:0:0:0:0:110.3157:104.1553:2.384186E-07:1.182765:03E8:A5:0:',
      '[23:10:07.264] 26:1067348B:Tini Poutini:50505014:103516:103516:10000:10000:8:0:97.62768:98.15999:-0.0007705679:0.7312062:03E8:88:0:0A0168:41F00000:E0000000:0F016B:41F00000:E0000000:28C20030:4512F71C:1067DE8B:67:0:1067DE8B:6E:411E978E:1067DE8B:0:0:0:0129:41BA4792:106EBC57:04E2:40910E52:1067DE8B:',
      '[23:10:48.791] 26:4000D27B::00505000:89020:89020:10000:10000:0:0:::::03E8:20:0:08A9:40706245:106D56CD:28C30030:456F9FC0:10683CEE:',
      '[23:24:15.679] 26:4000D3E6::0050501C:0:148000:0:0:0:0:84.83353:101.1907:-1.105378E-08:2.79271:0:A5:0:',
    ];
    regexCaptureTest(Regexes.statusEffectExplicit, lines);
  },
  losesEffect: () => {
    let lines = [
      '[21:58:30.880] 1E:10686259:Hash Brown loses the effect of Light In The Dark from .',
      '[21:48:06.010] 1E:1076C23F:Tater Tot loses the effect of Enhanced Wheeling Thrust from Tater Tot.',
      '[21:48:12.191] 1E:40007FD4:Hades loses the effect of Biolysis from Potato Croquette.',
    ];
    regexCaptureTest(Regexes.losesEffect, lines);
  },
  tether: () => {
    let lines = [
      '[21:49:14.345] 23:4000804B:Shadow of the Ancients:106CAF53:Dum Aloo:3CDF:0000:0011:106CAF53:000F:7F10:',
      '[19:39:36.673] 23:40005B1A:Voidwalker:40005C4E:The Hand of Erebos:D1A8:0000:005C:40005C4E:000F:7F1E:',
      '[12:17:54.515] 23:1032A977:French Fry:4000229C:Magic Pot:03AC:0000:0003:4000229C:000F:7FF1:',
    ];
    regexCaptureTest(Regexes.tether, lines);
  },
  wasDefeated: () => {
    let lines = [
      '[19:39:36.673] 19:Tini Poutini was defeated by Ovni.',
      '[19:39:36.673] 19:The Scourge Of Meracydia was defeated by Unknown.',
      '[19:39:36.673] 19:Potato Chippy was defeated by Tater Tot.',
    ];
    regexCaptureTest(Regexes.wasDefeated, lines);
  },
  hasHP: () => {
    let lines = [
      '[21:14:50.793] 0D:Tini Poutini HP at 96%.',
      '[21:16:25.491] 0D:Potato Chippy HP at 64%.',
      '[00:17:27.689] 0D:French Fry HP at 100%.',
    ];
    regexCaptureTest(Regexes.hasHP, lines);
  },
  gameLog: () => {
    let echoLines = [
      '[12:18:38.000] 00:0038:cactbot wipe',
      '[03:12:18.000] 00:0038:end',
      '[03:12:18.000] 00:0038:hello world',
    ];
    regexCaptureTest(Regexes.echo, echoLines);

    let dialogLines = [
      '[18:44:08.000] 00:0044:Rhitahtyn sas Arvina:My shields are impregnable! Join the countless challengers who have dashed themselves against them!',
      '[21:47:25.000] 00:0044:Hades:You are no match for my mastery of the arcane!',
      '[13:52:19.000] 00:0044:Byakko:There is no turning back!',
    ];
    regexCaptureTest(Regexes.dialog, dialogLines);

    let namedLines = [
      '[17:56:54.000] 00:001d:Potato Chippy:You clap for the striking dummy.',
    ];
    regexCaptureTest(Regexes.gameNameLog, namedLines);
    regexCaptureTest(Regexes.gameNameLog, dialogLines);

    let messageLines = [
      '[23:12:47.000] 00:0839:An avatar of Absolute Virtue has manifested somewhere in Hydatos!',
      '[19:39:13.000] 00:0839:The Hand of Erebos manifests!',
      '[12:10:44.000] 00:0839:The Pools of Folly will be sealed off in 15 seconds!',
    ];
    regexCaptureTest(Regexes.message, messageLines);

    let allLines = [];
    allLines.push(...echoLines);
    allLines.push(...dialogLines);
    allLines.push(...messageLines);
    allLines.push(...namedLines);
    regexCaptureTest(Regexes.gameLog, allLines);
  },
  statchange: () => {
    let lines = [
      '[20:29:29.752] 0C:Player Stats: 23:311:4093:4245:295:280:340:4093:2496:2675:295:280:2334:578:380:0:380',
      '[12:50:15.438] 0C:Player Stats: 17:311:348:1010:347:315:340:311:380:380:347:315:340:380:380:0:380',
      '[01:11:57.108] 0C:Player Stats: 23:305:844:793:290:275:340:844:780:755:290:275:340:380:380:0:380',
    ];
    regexCaptureTest(Regexes.statChange, lines);
  },
};

let keys = Object.keys(tests);
let exitCode = 0;
for (let i = 0; i < keys.length; ++i) {
  try {
    tests[keys[i]]();
  } catch (e) {
    console.log(e);
    exitCode = 1;
  }
}
process.exit(exitCode);
