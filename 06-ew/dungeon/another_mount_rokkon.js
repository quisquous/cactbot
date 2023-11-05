const headmarkers = {
  // vfx/lockon/eff/sph_lockon2_num01_s8p.avfx (through sph_lockon2_num04_s8p)
  limitCut1: '0150',
  limitCut2: '0151',
  limitCut3: '0152',
  limitCut4: '0153',
};
const mokoVfxMap = {
  '24C': 'backRed',
  '24D': 'leftRed',
  '24E': 'frontRed',
  '24F': 'rightRed',
  '250': 'backBlue',
  '251': 'leftBlue',
  '252': 'frontBlue',
  '253': 'rightBlue',
};
const looseMokoVfxMap = mokoVfxMap;
const shadowVfxMap = {
  '248': 'back',
  '249': 'left',
  '24A': 'front',
  '24B': 'right',
};
const looseShadowVfxMap = shadowVfxMap;
const limitCutIds = Object.values(headmarkers);
const mokoCenterX = -200;
const mokoCenterY = 0;
const tripleKasumiFirstOutputStrings = {
  backRedFirst: {
    en: 'Back + Out',
    de: 'Hinten + Raus',
  },
  leftRedFirst: {
    en: 'Left + Out',
    de: 'Links + Raus',
  },
  frontRedFirst: {
    en: 'Front + Out',
    de: 'Vorne + Raus',
  },
  rightRedFirst: {
    en: 'Right + Out',
    de: 'Rechts + Raus',
  },
  backBlueFirst: {
    en: 'Back + In',
    de: 'Hinten + Rein',
  },
  leftBlueFirst: {
    en: 'Left + In',
    de: 'Links + Rein',
  },
  frontBlueFirst: {
    en: 'Front + In',
    de: 'Vorne + Rein',
  },
  rightBlueFirst: {
    en: 'Right + In',
    de: 'Rechts + Rein',
  },
};
// It might be more accurate to say "rotate right" here than "right" (implying right flank)
// but that's very long. This is one of those "you need to know the mechanic" situations.
const tripleKasumiFollowupOutputStrings = {
  backRed: {
    en: 'Stay + Out',
    de: 'bleib Stehen + Raus',
  },
  leftRed: {
    en: 'Left + Out',
    de: 'Links + Raus',
  },
  frontRed: {
    en: 'Through + Out',
    de: 'Durch + Raus',
  },
  rightRed: {
    en: 'Right + Out',
    de: 'Rechts + Raus',
  },
  backBlue: {
    en: 'Stay + In',
    de: 'bleib Stehen + Rein',
  },
  leftBlue: {
    en: 'Left + In',
    de: 'Links + Rein',
  },
  frontBlue: {
    en: 'Through + In',
    de: 'Durch + Rein',
  },
  rightBlue: {
    en: 'Right + In',
    de: 'Rechts + Rein',
  },
};
const basicStackSpreadOutputStrings = {
  spread: Outputs.spread,
  melee: {
    en: 'Melees Stack',
    de: 'Nahkämpfer sammeln',
  },
  role: {
    en: 'Role Stacks',
    de: 'Rollengruppe sammeln',
  },
  partner: {
    en: 'Partner Stacks',
    de: 'Partner sammeln',
  },
  unknown: {
    en: 'Stacks',
    de: 'Sammeln',
  },
};
const tripleKasumiAbilityIds = [
  '85B0',
  '85B1',
  '85B2',
  '85B3',
  '85B4',
  '85B5',
  '85B6',
  '85B7',
  '85BA',
  '85BB',
  '85BC',
  '85BD',
  '85BE',
  '85BF',
  '85C0',
  '85C1', // right blue followup
];
const countJob = (job1, job2, func) => {
  return (func(job1) ? 1 : 0) + (func(job2) ? 1 : 0);
};
// For a given criteria func, if there's exactly one person who matches in the stack group
// and exactly one person who matches in the unmarked group, then they can stack together.
// This also filters out weird party comps naturally.
const couldStackLooseFunc = (stackJob1, stackJob2, unmarkedJob1, unmarkedJob2, func) => {
  const stackCount = countJob(stackJob1, stackJob2, func);
  const unmarkedCount = countJob(unmarkedJob1, unmarkedJob2, func);
  return stackCount === 1 && unmarkedCount === 1;
};
const isMeleeOrTank = (x) => Util.isMeleeDpsJob(x) || Util.isTankJob(x);
const isSupport = (x) => Util.isHealerJob(x) || Util.isTankJob(x);
const findStackPartners = (data, stack1, stack2) => {
  const party = data.party;
  if (stack1 === undefined || stack2 === undefined)
    return 'unknown';
  const stacks = [stack1, stack2];
  const unmarked = party.partyNames.filter((x) => !stacks.includes(x));
  if (unmarked.length !== 2 || party.partyNames.length !== 4)
    return 'unknown';
  const [stackJob1, stackJob2] = stacks.map((x) => party.jobName(x));
  if (stackJob1 === undefined || stackJob2 === undefined)
    return 'unknown';
  const [unmarkedJob1, unmarkedJob2] = unmarked.map((x) => party.jobName(x));
  if (unmarkedJob1 === undefined || unmarkedJob2 === undefined)
    return 'unknown';
  const couldStack = (func) => {
    return couldStackLooseFunc(stackJob1, stackJob2, unmarkedJob1, unmarkedJob2, func);
  };
  if (data.triggerSetConfig.stackOrder === 'meleeRolesPartners' && couldStack(isMeleeOrTank))
    return 'melee';
  if (couldStack(isSupport))
    return 'role';
  // if we get here, then you have a not normal light party comp, e.g. two ranged
  // or you have set the config option to be "rolesPartners" to not prefer melee.
  // For a tank/healer/ranged/ranged comp, this condition below will always be true
  // but make it anyway in case the party comp is something else entirely.
  const stackCount = countJob(stackJob1, stackJob2, isSupport);
  const unmarkedCount = countJob(unmarkedJob1, unmarkedJob2, isSupport);
  if (stackCount === 2 && unmarkedCount === 0 || stackCount === 0 && unmarkedCount === 2)
    return 'partner';
  // if something has gone incredibly awry, then just return the default
  return 'unknown';
};
const stackSpreadResponse = (data, output, collect, stackId, spreadId, hideStackList) => {
  // cactbot-builtin-response
  output.responseOutputStrings = {
    // In a 4 person party with two randomly assigned stacks,
    // there are a couple of different "kinds of pairs" that make sense to call.
    //
    // You can have two melees together and two ranged together,
    // or you can have two supports together and two dps together (role stacks)
    // or you have no melee in your comp, and you could have mixed support and range.
    // Arguably things like "tank+ranged, melee+healer" are possible but are harder to call.
    //
    // Prefer "melee/ranged" stacks here and elsewhere because it keeps
    // the tank and melee together for uptime.
    spreadThenMeleeStack: {
      en: 'Spread => Melees Stack',
      de: 'Verteilen => Nahkämpfer sammeln',
    },
    spreadThenRoleStack: {
      en: 'Spread => Role Stacks',
      de: 'Verteilen => Rollengruppe sammeln',
    },
    spreadThenPartnerStack: {
      en: 'Spread => Partner Stacks',
      de: 'Verteilen => Partner sammeln',
    },
    meleeStackThenSpread: {
      en: 'Melees Stack => Spread',
      de: 'Nahkämpfer sammeln => Verteilen',
    },
    roleStackThenSpread: {
      en: 'Role Stacks => Spread',
      de: 'Rollengruppe sammeln => Verteilen',
    },
    partnerStackThenSpread: {
      en: 'Partner Stacks => Spread',
      de: 'Partner sammeln => Verteilen',
    },
    spreadThenStack: Outputs.spreadThenStack,
    stackThenSpread: Outputs.stackThenSpread,
    stacks: {
      en: 'Stacks: ${player1}, ${player2}',
      de: 'Sammeln: ${player1}, ${player2}',
    },
  };
  const [stack1, stack2] = collect.filter((x) => x.effectId === stackId);
  const spread = collect.find((x) => x.effectId === spreadId);
  if (stack1 === undefined || stack2 === undefined || spread === undefined)
    return;
  const stackTime = parseFloat(stack1.duration);
  const spreadTime = parseFloat(spread.duration);
  const isStackFirst = stackTime < spreadTime;
  const stackType = findStackPartners(data, stack1.target, stack2.target);
  const stacks = [stack1, stack2].map((x) => x.target).sort();
  const [player1, player2] = stacks.map((x) => data.party.member(x));
  const stackInfo = hideStackList
    ? {}
    : { infoText: output.stacks({ player1: player1, player2: player2 }) };
  data.stackSpreadFirstMechanic = isStackFirst ? stackType : 'spread';
  data.stackSpreadSecondMechanic = isStackFirst ? 'spread' : stackType;
  if (stackType === 'melee') {
    if (isStackFirst)
      return { alertText: output.meleeStackThenSpread(), ...stackInfo };
    return { alertText: output.spreadThenMeleeStack(), ...stackInfo };
  } else if (stackType === 'role') {
    if (isStackFirst)
      return { alertText: output.roleStackThenSpread(), ...stackInfo };
    return { alertText: output.spreadThenRoleStack(), ...stackInfo };
  } else if (stackType === 'partner') {
    if (isStackFirst)
      return { alertText: output.partnerStackThenSpread(), ...stackInfo };
    return { alertText: output.spreadThenPartnerStack(), ...stackInfo };
  }
  // 'unknown' catch-all
  if (isStackFirst)
    return { alertText: output.stackThenSpread(), ...stackInfo };
  return { alertText: output.spreadThenStack(), ...stackInfo };
};
const towerResponse = (data, output) => {
  // cactbot-builtin-response
  output.responseOutputStrings = {
    tetherThenBlueTower: {
      en: 'Tether ${num1} => Blue Tower ${num2}',
      de: 'Verbindung ${num1} => Blauer Turm ${num2}',
    },
    tetherThenOrangeTower: {
      en: 'Tether ${num1} => Orange Tower ${num2}',
      de: 'Verbindung ${num1} => Orangener Turm ${num2}',
    },
    tether: {
      en: 'Tether ${num}',
      de: 'Verbindung ${num}',
    },
    blueTower: {
      en: 'Blue Tower ${num}',
      de: 'Blauer Turm ${num}',
    },
    orangeTower: {
      en: 'Orange Tower ${num}',
      de: 'Orangener Turm ${num}',
    },
    num1: Outputs.num1,
    num2: Outputs.num2,
    num3: Outputs.num3,
    num4: Outputs.num4,
  };
  // data.rousingTowerCount is 0-indexed
  // towerNum for display is 1-indexed
  const theseTowers = data.rousingCollect[data.rousingTowerCount];
  const towerNum = data.rousingTowerCount + 1;
  data.rousingTowerCount++;
  if (theseTowers === undefined)
    return;
  const numMap = {
    1: output.num1(),
    2: output.num2(),
    3: output.num3(),
    4: output.num4(),
  };
  const numStr = numMap[towerNum];
  if (numStr === undefined)
    return;
  if (data.me === theseTowers.blue)
    return { alertText: output.blueTower({ num: numStr }) };
  if (data.me === theseTowers.orange)
    return { alertText: output.orangeTower({ num: numStr }) };
  const nextTowers = data.rousingCollect[towerNum + 1];
  const nextNumStr = numMap[towerNum + 1];
  if (towerNum === 4 || nextTowers === undefined || nextNumStr === undefined)
    return { infoText: output.tether({ num: numStr }) };
  if (data.me === nextTowers.blue)
    return { infoText: output.tetherThenBlueTower({ num1: numStr, num2: nextNumStr }) };
  if (data.me === nextTowers.orange)
    return { infoText: output.tetherThenOrangeTower({ num1: numStr, num2: nextNumStr }) };
  // Just in case...
  return { infoText: output.tether({ num: numStr }) };
};
Options.Triggers.push({
  id: 'AnotherMountRokkon',
  zoneId: ZoneId.AnotherMountRokkon,
  config: [
    {
      id: 'stackOrder',
      comment: {
        en:
          `For any two person stacks, this specifies the priority order for picking people to stack together.
           If you want your melee and tank to stick together if possible, pick the option with melees in it.
           Melees stack means melee+tank and healer+ranged. Role stacks means tank+healer and dps+dps.
           Partner stacks mean support+dps and support+dps (any combination works).
           If you have two ranged dps or two melee dps, it will never call "melees" regardless of this config option.
           There is no support for party comps that are not two support and two dps.`,
        de:
          `Für jeden Zwei-Personen-Stack gibt dies die Prioritätsreihenfolge für die Auswahl der Personen an, die sich sammeln.
           Wenn ihr wollt, dass Nahkämpfer und Tank nach Möglichkeit zusammenbleiben, wählt die Option mit den Nahkämpfern aus.
           Nahkampf-Stack bedeutet Nahkampf+Tank und Heiler+Ranger. Rollen-Stack bedeutet Tank+Heiler und Dps+Dps.
           Partner-Stack bedeuten Supporter+Dps und Supporter+Dps (jede Kombination ist möglich).
           Wenn du zwei Fernkampf-DPS oder zwei Nahkampf-DPS hast, wird es nie "Nahkämpfer" nennen, unabhängig von dieser Konfigurationsoption.
           Es gibt keine Unterstützung für Gruppenkombinationen, die nicht aus zwei Supportern und zwei DPS bestehen.`,
      },
      name: {
        en: 'Stack Selection Order',
        de: 'Sammel-Reihenfolge',
      },
      type: 'select',
      options: {
        en: {
          'Melees > Roles > Partners': 'meleeRolesPartners',
          'Roles > Partners': 'rolesPartners',
        },
        de: {
          'Nahkämpfer > Rollen > Partner': 'meleeRolesPartners',
          'Rollen > Partner': 'rolesPartners',
        },
      },
      default: 'meleeRolesPartners',
    },
  ],
  timelineFile: 'another_mount_rokkon.txt',
  initData: () => {
    return {
      combatantData: [],
      smokeaterCount: 0,
      rairinCollect: [],
      wailingCollect: [],
      wailCount: 0,
      devilishThrallCollect: [],
      reishoCount: 0,
      ghostHeadmarkers: [],
      sparksCollect: [],
      sparksCount: 0,
      rousingCollect: [{}, {}, {}, {}],
      rousingTowerCount: 0,
      malformedCollect: [],
      myMalformedEffects: [],
      malformedTowerCount: 0,
      tripleKasumiCollect: [],
      explosionLineCollect: [],
      shadowKasumiCollect: {},
      shadowKasumiTether: {},
      invocationCollect: [],
      iaigiriTether: [],
      iaigiriPurple: [],
      iaigiriCasts: [],
      oniClawCollect: [],
    };
  },
  triggers: [
    // ---------------- first trash ----------------
    {
      id: 'AMR Shishu Raiko Disciples of Levin',
      type: 'StartsUsing',
      netRegex: { id: '8656', source: 'Shishu Raiko', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'AMR Shishu Raiko Barreling Smash',
      type: 'StartsUsing',
      netRegex: { id: '8653', source: 'Shishu Raiko' },
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          chargeOnYou: {
            en: 'Charge on YOU',
            de: 'Ansturm auf DIR',
          },
          chargeOn: {
            en: 'Charge on ${player}',
            de: 'Ansturm auf ${player}',
          },
        };
        if (matches.target === data.me)
          return { alarmText: output.chargeOnYou() };
        return { alertText: output.chargeOn({ player: data.party.member(matches.target) }) };
      },
    },
    {
      id: 'AMR Shishu Raiko Howl',
      type: 'StartsUsing',
      netRegex: { id: '8654', source: 'Shishu Raiko', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'AMR Shishu Raiko Master of Levin',
      type: 'StartsUsing',
      netRegex: { id: '8655', source: 'Shishu Raiko', capture: false },
      response: Responses.getUnder(),
    },
    {
      id: 'AMR Shishu Fuko Scythe Tail',
      type: 'StartsUsing',
      netRegex: { id: '865A', source: 'Shishu Fuko', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'AMR Shishu Fuko Twister',
      type: 'StartsUsing',
      netRegex: { id: '8658', source: 'Shishu Fuko' },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'AMR Shishu Fuko Crosswind',
      type: 'StartsUsing',
      netRegex: { id: '8659', source: 'Shishu Fuko', capture: false },
      response: Responses.knockback(),
    },
    {
      id: 'AMR Shishu Yuki Auto Tracker',
      type: 'Ability',
      netRegex: { id: '7A58', source: 'Shishu Yuki', capture: false },
      // Before being pulled (aka seeing an auto), Shishu Yuki faces south when doing
      // right/left cleaves. Make these absolute directions for clarity.
      // Shishu Yuki does have a buff that prevents pulling it, but there's no line
      // for this buff loss.
      run: (data) => data.seenShishuYukiAuto = true,
    },
    {
      id: 'AMR Shishu Yuki Right Swipe',
      type: 'StartsUsing',
      netRegex: { id: '8685', source: 'Shishu Yuki', capture: false },
      alertText: (data, _matches, output) => {
        return data.seenShishuYukiAuto ? output.left() : output.east();
      },
      outputStrings: {
        east: Outputs.east,
        left: Outputs.left,
      },
    },
    {
      id: 'AMR Shishu Yuki Left Swipe',
      type: 'StartsUsing',
      netRegex: { id: '8686', source: 'Shishu Yuki', capture: false },
      alertText: (data, _matches, output) => {
        return data.seenShishuYukiAuto ? output.right() : output.west();
      },
      outputStrings: {
        west: Outputs.west,
        right: Outputs.right,
      },
    },
    // ---------------- Shishio ----------------
    {
      id: 'AMR Shishio Enkyo',
      type: 'StartsUsing',
      netRegex: { id: '841A', source: 'Shishio', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'AMR Shishio Smokeater Count',
      type: 'Ability',
      // 83F9 is the initial Smokeater, and 83FA is the followup optional two.
      netRegex: { id: ['83F9', '83FA'], source: 'Shishio' },
      sound: '',
      infoText: (data, matches, output) => {
        if (matches.id === '83F9') {
          data.smokeaterCount = 1;
          return output.num1();
        }
        data.smokeaterCount++;
        if (data.smokeaterCount === 2)
          return output.num2();
        return output.num3();
      },
      outputStrings: {
        num1: Outputs.num1,
        num2: Outputs.num2,
        num3: Outputs.num3,
      },
    },
    {
      id: 'AMR Shishio Splitting Cry',
      type: 'StartsUsing',
      netRegex: { id: '841B', source: 'Shishio' },
      response: Responses.tankBuster(),
    },
    {
      id: 'AMR Shishio Splitter',
      type: 'Ability',
      // This comes out ~4s after Splitting Cry.
      netRegex: { id: '841B', source: 'Shishio', capture: false },
      suppressSeconds: 5,
      response: Responses.goFrontOrSides('info'),
    },
    {
      id: 'AMR Rairin Collect',
      type: 'AddedCombatant',
      netRegex: { npcNameId: '12430' },
      run: (data, matches) => data.rairinCollect.push(matches),
    },
    {
      id: 'AMR Noble Pursuit',
      type: 'AddedCombatant',
      netRegex: { npcNameId: '12430', capture: false },
      condition: (data) => data.rairinCollect.length === 4,
      alertText: (data, _matches, output) => {
        const [one, two, three, four] = data.rairinCollect;
        if (one === undefined || two === undefined || three === undefined || four === undefined)
          return;
        // one is always north (0, -115)
        // two is always south (0, -85)
        // three is left or right (+/-15, -80)
        // four is either diagonal (7.5, -92.5) / (-6, -94) or back north (+/-20, -95)
        // We always end up on the opposite side as the third charge.
        const isThreeEast = parseFloat(three.x) > 0;
        // If four is diagonal, you go south otherwise north.
        const isFourDiagonal = Math.abs(parseFloat(four.x)) < 18;
        if (isFourDiagonal)
          return isThreeEast ? output.southwest() : output.southeast();
        return isThreeEast ? output.northwest() : output.northeast();
      },
      outputStrings: {
        northeast: Outputs.northeast,
        southeast: Outputs.southeast,
        southwest: Outputs.southwest,
        northwest: Outputs.northwest,
      },
    },
    {
      id: 'AMR Shishio Unnatural Wail Count',
      type: 'StartsUsing',
      netRegex: { id: '8417', source: 'Shishio', capture: false },
      run: (data) => {
        data.wailCount++;
        data.wailingCollect = [];
      },
    },
    {
      id: 'AMR Shishio Wailing Collect',
      type: 'GainsEffect',
      // DEB = Scattered Wailing (spread)
      // DEC = Intensified Wailing (stack)
      netRegex: { effectId: ['DEB', 'DEC'], source: 'Shishio' },
      run: (data, matches) => data.wailingCollect.push(matches),
    },
    {
      id: 'AMR Shishio Unnatural Wailing 1',
      type: 'GainsEffect',
      netRegex: { effectId: ['DEB', 'DEC'], source: 'Shishio', capture: false },
      condition: (data) => data.wailCount === 1,
      delaySeconds: 0.5,
      suppressSeconds: 999999,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        return stackSpreadResponse(data, output, data.wailingCollect, 'DEC', 'DEB');
      },
    },
    {
      id: 'AMR Shishio Vortex of the Thunder Eye',
      type: 'StartsUsing',
      // 8413 = Eye of the Thunder Vortex (out)
      // 8415 = Vortex of the Thnder Eye (in)
      netRegex: { id: ['8413', '8415'], source: 'Shishio' },
      durationSeconds: 7,
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          out: Outputs.out,
          in: Outputs.in,
          spreadThenMeleeStack: {
            en: '${inOut} + Spread => ${outIn} + Melees Stack',
            de: '${inOut} + Verteilen => ${outIn} + Nahkämpfer sammeln',
          },
          spreadThenRoleStack: {
            en: '${inOut} + Spread => ${outIn} + Role Stacks',
            de: '${inOut} + Verteilen => ${outIn} + Rollengruppe sammeln',
          },
          spreadThenPartnerStack: {
            en: '${inOut} + Spread => ${outIn} + Partner Stacks',
            de: '${inOut} + Verteilen => ${outIn} + Partner sammeln',
          },
          meleeStackThenSpread: {
            en: '${inOut} + Melees Stack => ${outIn} + Spread',
            de: '${inOut} + Nahkämpfer sammeln => ${outIn} + Verteilen',
          },
          roleStackThenSpread: {
            en: '${inOut} + Role Stacks => ${outIn} + Spread',
            de: '${inOut} + Rollengruppe sammeln => ${outIn} + Verteilen',
          },
          partnerStackThenSpread: {
            en: '${inOut} + Partner Stacks => ${outIn} + Spread',
            de: '${inOut} + Partner sammeln => ${outIn} + Verteilen',
          },
          spreadThenStack: {
            en: '${inOut} + Spread => ${outIn} + Stack',
            de: '${inOut} + Verteilen => ${outIn} + Sammeln',
          },
          stackThenSpread: {
            en: '${inOut} + Stack => ${outIn} + Spread',
            de: '${inOut} + Sammeln => ${outIn} + Verteilen',
          },
          stacks: {
            en: 'Stacks: ${player1}, ${player2}',
            de: 'Sammeln: ${player1}, ${player2}',
          },
        };
        const [stack1, stack2] = data.wailingCollect.filter((x) => x.effectId === 'DEC');
        const spread = data.wailingCollect.find((x) => x.effectId === 'DEB');
        if (stack1 === undefined || stack2 === undefined || spread === undefined)
          return;
        const stackTime = parseFloat(stack1.duration);
        const spreadTime = parseFloat(spread.duration);
        const isStackFirst = stackTime < spreadTime;
        const stackType = findStackPartners(data, stack1.target, stack2.target);
        const isInFirst = matches.id === '8415';
        const inOut = isInFirst ? output.in() : output.out();
        const outIn = isInFirst ? output.out() : output.in();
        const args = { inOut: inOut, outIn: outIn };
        const stacks = [stack1, stack2].map((x) => x.target).sort();
        const [player1, player2] = stacks.map((x) => data.party.member(x));
        const stackInfo = { infoText: output.stacks({ player1: player1, player2: player2 }) };
        data.vortexSecondMechanic = isInFirst ? 'out' : 'in';
        data.stackSpreadFirstMechanic = isStackFirst ? stackType : 'spread';
        data.stackSpreadSecondMechanic = isStackFirst ? 'spread' : stackType;
        if (stackType === 'melee') {
          if (isStackFirst)
            return { alertText: output.meleeStackThenSpread(args), ...stackInfo };
          return { alertText: output.spreadThenMeleeStack(args), ...stackInfo };
        } else if (stackType === 'role') {
          if (isStackFirst)
            return { alertText: output.roleStackThenSpread(args), ...stackInfo };
          return { alertText: output.spreadThenRoleStack(args), ...stackInfo };
        } else if (stackType === 'partner') {
          if (isStackFirst)
            return { alertText: output.partnerStackThenSpread(args), ...stackInfo };
          return { alertText: output.spreadThenPartnerStack(args), ...stackInfo };
        }
        // 'unknown' catch-all
        if (isStackFirst)
          return { alertText: output.stackThenSpread(args), ...stackInfo };
        return { alertText: output.spreadThenStack(args), ...stackInfo };
      },
    },
    {
      id: 'AMR Shishio Vortex of the Thunder Eye Followup',
      type: 'Ability',
      // 8418 = Unnatural Ailment
      // 8419 = Unnatural Force
      netRegex: { id: ['8418', '8419'], capture: false },
      condition: (data) => data.wailCount !== 1,
      suppressSeconds: 1,
      infoText: (data, _matches, output) => {
        const mech = data.stackSpreadSecondMechanic;
        if (mech === undefined)
          return;
        delete data.stackSpreadFirstMechanic;
        delete data.stackSpreadSecondMechanic;
        const mechanicStr = output[mech]();
        const inOut = data.vortexSecondMechanic;
        if (inOut === undefined)
          return;
        delete data.vortexSecondMechanic;
        const inOutStr = output[inOut]();
        return output.text({ inOut: inOutStr, mechanic: mechanicStr });
      },
      outputStrings: {
        text: {
          en: '${inOut} + ${mechanic}',
          de: '${inOut} + ${mechanic}',
        },
        out: Outputs.out,
        in: Outputs.in,
        ...basicStackSpreadOutputStrings,
      },
    },
    {
      id: 'AMR Shishio Thunder Vortex',
      type: 'StartsUsing',
      netRegex: { id: '8412', source: 'Shishio', capture: false },
      response: Responses.getUnder('alert'),
    },
    {
      id: 'AMR Shishio Devilish Thrall Collect',
      type: 'StartsUsing',
      // 840B = Right Swipe
      // 840C = Left Swipe
      netRegex: { id: ['840B', '840C'], source: 'Devilish Thrall' },
      run: (data, matches) => data.devilishThrallCollect.push(matches),
    },
    {
      id: 'AMR Shishio Devilish Thrall Safe Spot',
      type: 'StartsUsing',
      // Note: the second call of this comes out before the first one happens,
      // but it's important to know where you're going.
      netRegex: { id: ['840B', '840C'], source: 'Devilish Thrall', capture: false },
      delaySeconds: 0.5,
      durationSeconds: 6,
      suppressSeconds: 1,
      promise: async (data) => {
        data.combatantData = [];
        const ids = data.devilishThrallCollect.map((x) => parseInt(x.sourceId, 16));
        data.combatantData = (await callOverlayHandler({
          call: 'getCombatants',
          ids: ids,
        })).combatants;
      },
      alertText: (data, _matches, output) => {
        if (data.combatantData.length !== 4)
          return;
        const centerX = 0;
        const centerY = -100;
        // Intercard thralls:
        //   x = 0 +/- 10
        //   y = -100 +/- 10
        //   heading = intercards (pi/4 + pi/2 * n)
        // Cardinal thralls:
        //   x = 0 +/- 12
        //   y = -100 +/- 12
        //   heading = cardinals (pi/2 * n)
        // One is a set of four on cardinals, the others a set of 4 on intercards.
        // There seems to be only one pattern of thralls, rotated.
        // Two are pointed inward (direct opposite to their position)
        // and two are pointed outward (perpendicular to their position).
        // Because of this, no need to check left/right cleave as position and directions tell all.
        const states = data.combatantData.map((combatant) => {
          return {
            dir: Directions.combatantStatePosTo8Dir(combatant, centerX, centerY),
            heading: Directions.combatantStateHdgTo8Dir(combatant),
          };
        });
        const outwardStates = states.filter((state) => state.dir !== (state.heading + 4) % 8);
        const [pos1, pos2] = outwardStates.map((x) => x.dir).sort();
        if (pos1 === undefined || pos2 === undefined || outwardStates.length !== 2)
          return;
        const mech = data.stackSpreadFirstMechanic ?? data.stackSpreadSecondMechanic;
        const mechanicStr = mech !== undefined ? output[mech]() : output.unknownMech();
        if (data.stackSpreadFirstMechanic)
          delete data.stackSpreadFirstMechanic;
        else if (data.stackSpreadSecondMechanic)
          delete data.stackSpreadSecondMechanic;
        // 0/6 (average 7) and 1/7 (average 0) are the two cases where the difference is 6 and not 2.
        const averagePos = Math.floor((pos2 + pos1 + (pos2 - pos1 === 6 ? 8 : 0)) / 2) % 8;
        const params = { mechanic: mechanicStr };
        return {
          0: output.north(params),
          1: output.northeast(params),
          2: output.east(params),
          3: output.southeast(params),
          4: output.south(params),
          5: output.southwest(params),
          6: output.west(params),
          7: output.northwest(params),
        }[averagePos];
      },
      run: (data) => data.devilishThrallCollect = [],
      outputStrings: {
        north: {
          en: 'North Diamond + ${mechanic}',
          de: 'nördlicher Diamant + ${mechanic}',
        },
        east: {
          en: 'East Diamond + ${mechanic}',
          de: 'östlicher Diamant + ${mechanic}',
        },
        south: {
          en: 'South Diamond + ${mechanic}',
          de: 'südlicher Diamant + ${mechanic}',
        },
        west: {
          en: 'West Diamond + ${mechanic}',
          de: 'westlicher Diamant + ${mechanic}',
        },
        northeast: {
          en: 'Northeast Square + ${mechanic}',
          de: 'nordöstliches Viereck + ${mechanic}',
        },
        southeast: {
          en: 'Southeast Square + ${mechanic}',
          de: 'südöstliches Viereck + ${mechanic}',
        },
        southwest: {
          en: 'Southwest Square + ${mechanic}',
          de: 'südwestliches Viereck + ${mechanic}',
        },
        northwest: {
          en: 'Northwest Square + ${mechanic}',
          de: 'nordwestliches Viereck + ${mechanic}',
        },
        ...basicStackSpreadOutputStrings,
        unknownMech: Outputs.unknown,
      },
    },
    {
      id: 'AMR Shishio Haunting Thrall Reisho Count',
      type: 'Ability',
      // Sometimes these adds have not changed their name from Shishio to Haunting Thrall.
      netRegex: { id: '840D', capture: false },
      preRun: (data) => data.reishoCount++,
      durationSeconds: 1.5,
      // There are 8 pulses, 2 seconds apart.
      suppressSeconds: 0.5,
      // Play an alarm on the 8th one, but don't play noises for each count.
      sound: (data) => data.ghostMechanic === 'tower' && data.reishoCount === 8 ? undefined : '',
      alarmText: (data, _matches, output) => {
        if (data.ghostMechanic === 'tower' && data.reishoCount === 8)
          return output.tower();
      },
      infoText: (data, _matches, output) => output[`num${data.reishoCount}`](),
      outputStrings: {
        tower: {
          en: 'Tower',
          de: 'Türme',
        },
        num1: Outputs.num1,
        num2: Outputs.num2,
        num3: Outputs.num3,
        num4: Outputs.num4,
        num5: Outputs.num5,
        num6: Outputs.num6,
        num7: Outputs.num7,
        num8: Outputs.num8,
      },
    },
    {
      id: 'AMR Shishio Haunting Thrall Headmarker',
      type: 'HeadMarker',
      netRegex: { id: '01D8' },
      condition: (data, matches) => {
        data.ghostHeadmarkers.push(matches);
        return data.ghostHeadmarkers.length === 2;
      },
      alertText: (data, _matches, output) => {
        const spread = data.ghostHeadmarkers.map((x) => x.target);
        const towers = data.party.partyNames.filter((x) => !spread.includes(x));
        if (spread.includes(data.me)) {
          data.ghostMechanic = 'spread';
          const otherPlayer = spread.find((x) => x !== data.me) ?? output.unknown();
          return output.spread({ player: data.party.member(otherPlayer) });
        }
        data.ghostMechanic = 'tower';
        const otherPlayer = towers.find((x) => x !== data.me) ?? output.unknown();
        return output.tower({ player: data.party.member(otherPlayer) });
      },
      outputStrings: {
        tower: {
          en: 'Get Tower (w/${player})',
          de: 'Nimm Turm mit (w/${player})',
        },
        spread: {
          en: 'Spread (w/${player})',
          de: 'Verteilen (w/${player})',
        },
        unknown: Outputs.unknown,
      },
    },
    // ---------------- second trash ----------------
    {
      id: 'AMR Shishu Kotengu Backward Blows',
      type: 'StartsUsing',
      netRegex: { id: '865C', source: 'Shishu Kotengu', capture: false },
      durationSeconds: 5.7,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Sides (Stay Sides)',
          de: 'Seiten (Seitlich bleiben)',
        },
      },
    },
    {
      id: 'AMR Shishu Kotengu Leftward Blows',
      type: 'StartsUsing',
      netRegex: { id: '865D', source: 'Shishu Kotengu', capture: false },
      durationSeconds: 5.7,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Right + Behind',
          de: 'Rechts + Hinten',
        },
      },
    },
    {
      id: 'AMR Shishu Kotengu Rightward Blows',
      type: 'StartsUsing',
      netRegex: { id: '865E', source: 'Shishu Kotengu', capture: false },
      durationSeconds: 5.7,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Left + Behind',
          de: 'Links + Hinten',
        },
      },
    },
    {
      id: 'AMR Shishu Kotengu Wrath of the Tengu',
      type: 'StartsUsing',
      netRegex: { id: '8660', source: 'Shishu Kotengu', capture: false },
      response: Responses.bleedAoe(),
    },
    {
      id: 'AMR Shishu Kotengu Gaze of the Tengu',
      type: 'StartsUsing',
      netRegex: { id: '8661', source: 'Shishu Kotengu', capture: false },
      response: Responses.lookAway('alert'),
    },
    {
      id: 'AMR Shishu Onmitsugashira Juji Shuriken',
      type: 'StartsUsing',
      netRegex: { id: '8664', source: 'Shishu Onmitsugashira', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'AMR Shishu Onmitsugashira Issen',
      type: 'StartsUsing',
      netRegex: { id: '8662', source: 'Shishu Onmitsugashira' },
      response: Responses.tankBuster(),
    },
    {
      id: 'AMR Shishu Onmitsugashira Huton',
      type: 'StartsUsing',
      netRegex: { id: '8663', source: 'Shishu Onmitsugashira', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Dodge 4x Shuriken',
          de: 'Weiche 4x Shuriken aus',
        },
      },
    },
    // ---------------- Gorai the Uncaged ----------------
    {
      id: 'AMR Gorai Unenlightenment',
      type: 'StartsUsing',
      netRegex: { id: '8534', source: 'Gorai the Uncaged', capture: false },
      response: Responses.bleedAoe('info'),
    },
    {
      id: 'AMR Gorai Brazen Ballad Purple',
      type: 'StartsUsing',
      netRegex: { id: '8509', source: 'Gorai the Uncaged', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Avoid Expanding Lines',
          de: 'Weiche den größer werdenden Linien aus',
        },
      },
    },
    {
      id: 'AMR Gorai Brazen Ballad Blue',
      type: 'StartsUsing',
      netRegex: { id: '850A', source: 'Gorai the Uncaged', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Under Rock + Lines',
          de: 'Unter dem Stein + Linien',
        },
      },
    },
    {
      id: 'AMR Gorai Sparks Count',
      type: 'StartsUsing',
      netRegex: { id: '8503', source: 'Gorai the Uncaged', capture: false },
      run: (data) => {
        data.sparksCount++;
        data.sparksCollect = [];
      },
    },
    {
      id: 'AMR Gorai Sparks Collect',
      type: 'GainsEffect',
      // E17 = Live Brazier (stack)
      // E18 = Live Candle (spread)
      netRegex: { effectId: ['E17', 'E18'] },
      run: (data, matches) => data.sparksCollect.push(matches),
    },
    {
      id: 'AMR Gorai Seal of Scurrying Sparks Flame and Sulphur',
      type: 'GainsEffect',
      netRegex: { effectId: ['E17', 'E18'], capture: false },
      condition: (data) => data.sparksCount !== 2,
      delaySeconds: 0.5,
      suppressSeconds: 10,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          meleeStack: basicStackSpreadOutputStrings.melee,
          roleStack: basicStackSpreadOutputStrings.role,
          partnerStack: basicStackSpreadOutputStrings.partner,
          stacks: {
            en: 'Stacks: ${player1}, ${player2}',
            de: 'Sammeln: ${player1}, ${player2}',
          },
        };
        const [stack1, stack2] = data.sparksCollect.filter((x) => x.effectId === 'E17');
        if (stack1 === undefined || stack2 === undefined)
          return;
        const stackType = findStackPartners(data, stack1.target, stack2.target);
        const stacks = [stack1, stack2].map((x) => x.target).sort();
        const [player1, player2] = stacks.map((x) => data.party.member(x));
        const stackInfo = { infoText: output.stacks({ player1: player1, player2: player2 }) };
        if (stackType === 'melee') {
          return { alertText: output.meleeStack(), ...stackInfo };
        } else if (stackType === 'role') {
          return { alertText: output.roleStack(), ...stackInfo };
        } else if (stackType === 'partner') {
          return { alertText: output.partnerStack(), ...stackInfo };
        }
        // 'unknown' catch-all
        return stackInfo;
      },
    },
    {
      id: 'AMR Gorai Seal of Scurrying Sparks Cloud to Ground',
      type: 'GainsEffect',
      netRegex: { effectId: ['E17', 'E18'], capture: false },
      condition: (data) => data.sparksCount === 2,
      delaySeconds: 0.5,
      suppressSeconds: 10,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        return stackSpreadResponse(data, output, data.sparksCollect, 'E17', 'E18');
      },
    },
    {
      id: 'AMR Gorai Seal of Scurrying Sparks Cloud to Ground Followup',
      type: 'Ability',
      // 8505 = Greater Ball of Fire
      // 8605 = Great Ball of Fire
      netRegex: { id: ['8505', '8506'], capture: false },
      suppressSeconds: 1,
      infoText: (data, _matches, output) => {
        const mech = data.stackSpreadSecondMechanic;
        if (mech === undefined)
          return;
        delete data.stackSpreadFirstMechanic;
        delete data.stackSpreadSecondMechanic;
        return output[mech]();
      },
      outputStrings: basicStackSpreadOutputStrings,
    },
    {
      id: 'AMR Gorai Torching Torment',
      type: 'StartsUsing',
      netRegex: { id: '8532', source: 'Gorai the Uncaged' },
      response: Responses.tankBuster(),
    },
    {
      id: 'AMR Gorai Impure Purgation First Hit',
      type: 'StartsUsing',
      netRegex: { id: '852F', source: 'Gorai the Uncaged', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Protean',
          de: 'Um den Boss verteilen',
          fr: 'Changement',
          ja: 'ボスを基準として散開',
          cn: '和队友分散路径',
          ko: '산개',
        },
      },
    },
    {
      id: 'AMR Gorai Impure Purgation Second Hit',
      type: 'StartsUsing',
      netRegex: { id: '8531', source: 'Gorai the Uncaged', capture: false },
      suppressSeconds: 5,
      response: Responses.moveAway(),
    },
    {
      id: 'AMR Gorai Humble Hammer',
      type: 'StartsUsing',
      netRegex: { id: '8525', source: 'Gorai the Uncaged' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Shrink Lone Orb',
          de: 'Einzel-Orb verkleinern',
        },
      },
    },
    {
      id: 'AMR Gorai Flintlock',
      type: 'StartsUsing',
      // Trigger this on the Humble Hammer damage; however this should hit
      // both one player (although possibly more) and one Ball of Levin (although possibly none)
      // so use `StartsUsing` with a delay to get the proper cast target here.
      netRegex: { id: '8525', source: 'Gorai the Uncaged' },
      delaySeconds: (_data, matches) => parseFloat(matches.castTime),
      alertText: (data, matches, output) => {
        if (matches.target === data.me)
          return output.beBehindTank();
        if (data.role === 'tank')
          return output.blockLaser({ player: data.party.member(matches.target) });
        return output.avoidLaser();
      },
      outputStrings: {
        beBehindTank: {
          en: 'Stay Behind Tank',
          de: 'Hinter dem Tank stehen',
        },
        blockLaser: {
          en: 'Block Laser on ${player}',
          de: 'Blockiere Laser auf ${player}',
        },
        avoidLaser: {
          en: 'Avoid Laser',
          de: 'Laser vermeiden',
        },
      },
    },
    {
      id: 'AMR Gorai Rousing Reincarnation Collect',
      type: 'GainsEffect',
      netRegex: { effectId: ['E0D', 'E0E', 'E0F', 'E10', 'E11', 'E12', 'E13', 'E14'] },
      condition: (data) => data.rousingTowerCount === 0,
      run: (data, matches) => {
        // Odder Incarnation = blue towers
        // Rodential Rebirth = orange towers
        // durations: I = 20s, II = 26s, III = 32s, IV = 38s
        const id = matches.effectId;
        if (id === 'E11')
          data.rousingCollect[0].blue = matches.target;
        else if (id === 'E0D')
          data.rousingCollect[0].orange = matches.target;
        else if (id === 'E12')
          data.rousingCollect[1].blue = matches.target;
        else if (id === 'E0E')
          data.rousingCollect[1].orange = matches.target;
        else if (id === 'E13')
          data.rousingCollect[2].blue = matches.target;
        else if (id === 'E0F')
          data.rousingCollect[2].orange = matches.target;
        else if (id === 'E14')
          data.rousingCollect[3].blue = matches.target;
        else if (id === 'E10')
          data.rousingCollect[3].orange = matches.target;
      },
    },
    {
      id: 'AMR Gorai Rousing Reincarnation First Tower',
      type: 'StartsUsing',
      // Malformed Prayer cast
      netRegex: { id: '8518', source: 'Gorai the Uncaged', capture: false },
      durationSeconds: 15,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        return towerResponse(data, output);
      },
    },
    {
      id: 'AMR Gorai Rousing Reincarnation Other Towers',
      type: 'Ability',
      // Technically 851F Pointed Purgation protean happens ~0.2s beforehand,
      // but wait on the tower burst to call things out.
      // 851B = Burst (blue tower)
      // 8519 = Burst (orange tower)
      // 851C = Dramatic Burst (missed tower)
      netRegex: { id: '851B', source: 'Gorai the Uncaged', capture: false },
      durationSeconds: 4,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        return towerResponse(data, output);
      },
    },
    {
      id: 'AMR Gorai Fighting Spirits',
      type: 'StartsUsing',
      netRegex: { id: '852B', source: 'Gorai the Uncaged', capture: false },
      // this is also a light aoe but knockback is more important
      response: Responses.knockback('info'),
    },
    {
      id: 'AMR Gorai Fighting Spirits Limit Cut',
      type: 'HeadMarker',
      netRegex: { id: limitCutIds },
      condition: Conditions.targetIsYou(),
      durationSeconds: 6,
      alertText: (_data, matches, output) => {
        if (matches.id === headmarkers.limitCut1)
          return output.num1();
        if (matches.id === headmarkers.limitCut2)
          return output.num2();
        if (matches.id === headmarkers.limitCut3)
          return output.num3();
        if (matches.id === headmarkers.limitCut4)
          return output.num4();
      },
      outputStrings: {
        num1: Outputs.num1,
        num2: Outputs.num2,
        num3: Outputs.num3,
        num4: Outputs.num4,
      },
    },
    {
      id: 'AMR Gorai Malformed Reincarnation Collect',
      type: 'GainsEffect',
      // E0D = Rodential Rebirth 1 (first orange tower)
      // E0E = Rodential Rebirth 2 (second orange tower)
      // E0F = Rodential Rebirth 3 (third orange tower)
      // E10 = Rodential Rebirth 4 (fourth orange tower)
      // E11 = Odder Incarnation 1 (first blue tower)
      // E12 = Odder Incarnation 2 (second blue tower)
      // E13 = Odder Incarnation 3 (third blue tower)
      // E14 = Odder Incarnation 4 (fourth blue tower)
      // E15 = Squirrelly Prayer (place orange tower)
      // E16 = Odder Prayer (place blue tower)
      netRegex: { effectId: ['E0D', 'E0E', 'E0F', 'E11', 'E12', 'E13'] },
      condition: (data) => data.rousingTowerCount !== 0,
      run: (data, matches) => {
        data.malformedCollect.push(matches);
        if (matches.target === data.me)
          data.myMalformedEffects.push(matches.effectId);
      },
    },
    {
      id: 'AMR Gorai Malformed Reincarnation',
      // TODO: we could add more config options for this if needed, as there are many strats.
      // However, this given trigger should give enough info for most strats.
      // (1) player flex, always go mixed sides, people with all one color go to specific spots.
      //     See: https://www.youtube.com/watch?v=TzoNEWbMpQ0#t=7m53s
      // (2) no player flexing, go to opposite side, run THROUGH, possible swap sides for tower
      //     See: https://ff14.toolboxgaming.space/?id=938195953989861&preview=1
      // (3) different strats for half mixed / full mixed, flex only on full mixed
      //     See: https://raidplan.io/plan/9tVR4vj9kPjgF3PM
      comment: {
        en: `Full mixed means everybody has both colors (two of one, one of the other).
             Half mixed means two people have both colors and two people have all the same color.`,
        de:
          `Voll gemischt bedeutet, dass jeder beide Farben hat (zwei von der einen, eine von der anderen).
             Halb gemischt bedeutet, dass zwei Personen beide Farben haben und zwei Personen nur eine Farbe haben`,
      },
      type: 'GainsEffect',
      netRegex: { effectId: ['E0D', 'E0E', 'E0F', 'E11', 'E12', 'E13'], capture: false },
      condition: (data) => data.rousingTowerCount !== 0,
      delaySeconds: 0.5,
      durationSeconds: 10,
      suppressSeconds: 1,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          alertText: {
            en: '${color1} -> ${color2} -> ${color3} (${mixedType})',
            de: '${color1} -> ${color2} -> ${color3} (${mixedType})',
          },
          infoText: {
            en: '(first ${color} w/${player})',
            de: '(zuerst ${color} mit ${player})',
          },
          orange: {
            en: 'Orange',
            de: 'Orange',
          },
          blue: {
            en: 'Blue',
            de: 'Blau',
          },
          mixedTypeFull: {
            en: 'full mixed',
            de: 'Voll gemischt',
          },
          mixedTypeHalf: {
            en: 'half mixed',
            de: 'Halb gemischt',
          },
          unknown: Outputs.unknown,
        };
        let playerCount = 0;
        let mixedCount = 0;
        const firstColor = {};
        const myColors = [];
        for (const line of data.malformedCollect) {
          const isOrange = line.effectId === 'E0D' || line.effectId === 'E0E' ||
            line.effectId === 'E0F';
          const color = isOrange ? 'orange' : 'blue';
          if (line.target === data.me)
            myColors.push(color);
          const lastColor = firstColor[line.target];
          if (lastColor === undefined) {
            playerCount++;
            firstColor[line.target] = color;
            continue;
          }
          if (lastColor === color)
            continue;
          mixedCount++;
        }
        const [color1, color2, color3] = myColors;
        if (color1 === undefined || color2 === undefined || color3 === undefined)
          return;
        // Try to handle dead players who don't have debuffs here.
        const isAllMixed = playerCount === mixedCount;
        const mixedType = isAllMixed ? output.mixedTypeFull() : output.mixedTypeHalf();
        let partner = output.unknown();
        for (const [name, color] of Object.entries(firstColor)) {
          if (name !== data.me && color === color1) {
            partner = data.party.member(name);
            break;
          }
        }
        const alertText = output.alertText({
          color1: color1,
          color2: color2,
          color3: color3,
          mixedType: mixedType,
        });
        const infoText = output.infoText({ color: color1, player: partner });
        return { alertText, infoText };
      },
    },
    {
      id: 'AMR Gorai Malformed First Tower',
      type: 'LosesEffect',
      // E15 = Squirrelly Prayer (place orange tower)
      // E16 = Odder Prayer (place blue tower)
      netRegex: { effectId: ['E15', 'E16'] },
      condition: (data, matches) => data.me === matches.target,
      durationSeconds: 4,
      alertText: (data, _matches, output) => {
        const effectId = data.myMalformedEffects.shift();
        if (effectId === 'E0D')
          return output.orangeTower1();
        if (effectId === 'E11')
          return output.blueTower1();
      },
      outputStrings: {
        blueTower1: {
          en: 'Inside Blue Tower 1',
          de: 'Innerhalb blauer Turm 1',
        },
        orangeTower1: {
          en: 'Inside Orange Tower 1',
          de: 'Innerhalb orangener Turm 1',
        },
      },
    },
    {
      id: 'AMR Gorai Malformed Other Towers',
      type: 'Ability',
      netRegex: { id: '851B', source: 'Gorai the Uncaged', capture: false },
      condition: (data) => data.myMalformedEffects.length > 0,
      durationSeconds: 2,
      suppressSeconds: 1,
      alertText: (data, _matches, output) => {
        const effectId = data.myMalformedEffects.shift();
        if (effectId === 'E0E')
          return output.orangeTower2();
        if (effectId === 'E0F')
          return output.orangeTower3();
        if (effectId === 'E12')
          return output.blueTower2();
        if (effectId === 'E13')
          return output.blueTower3();
      },
      outputStrings: {
        blueTower1: {
          en: 'Inside Blue Tower 1',
          de: 'Mittig blauer Turm 1',
        },
        orangeTower1: {
          en: 'Inside Orange Tower 1',
          de: 'Mittig orangener Turm 1',
        },
        blueTower2: {
          en: 'Corner Blue Tower 2',
          de: 'Ecke blauer Turm 2',
        },
        orangeTower2: {
          en: 'Corner Orange Tower 2',
          de: 'Ecke orangener Turm 2',
        },
        blueTower3: {
          en: 'Placed Blue Tower 3',
          de: 'Platzierter blauer Turm 3',
        },
        orangeTower3: {
          en: 'Placed Orange Tower 3',
          de: 'Platzierter orangener Turm 3',
        },
      },
    },
    {
      id: 'AMR Gorai Fire Spread',
      type: 'Ability',
      netRegex: { id: '8511', source: 'Gorai the Uncaged', capture: false },
      suppressSeconds: 30,
      response: Responses.moveAway(),
    },
    // ---------------- Moko the Restless ----------------
    {
      id: 'AMR Moko Kenki Release',
      type: 'StartsUsing',
      netRegex: { id: '85E0', source: 'Moko the Restless', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'AMR Moko Triple Kasumi-giri Collect',
      type: 'GainsEffect',
      netRegex: { effectId: 'B9A', count: Object.keys(mokoVfxMap) },
      run: (data, matches) => {
        const thisAbility = looseMokoVfxMap[matches.count];
        if (thisAbility === undefined)
          return;
        data.tripleKasumiCollect.push(thisAbility);
      },
    },
    {
      id: 'AMR Moko Triple Kasumi-giri 1',
      type: 'GainsEffect',
      netRegex: { effectId: 'B9A', count: Object.keys(mokoVfxMap), capture: false },
      condition: (data) => data.tripleKasumiCollect.length === 1,
      durationSeconds: 10,
      alertText: (data, _matches, output) => {
        const [ability] = data.tripleKasumiCollect;
        if (ability === undefined)
          return;
        return output[`${ability}First`]();
      },
      outputStrings: tripleKasumiFirstOutputStrings,
    },
    {
      id: 'AMR Moko Triple Kasumi-giri 2',
      type: 'GainsEffect',
      netRegex: { effectId: 'B9A', count: Object.keys(mokoVfxMap), capture: false },
      condition: (data) => data.tripleKasumiCollect.length === 2,
      infoText: (data, _matches, output) => {
        const ability = data.tripleKasumiCollect[1];
        if (ability === undefined)
          return;
        const text = output[ability]();
        return output.text({ text: text });
      },
      outputStrings: {
        text: {
          en: '(${text})',
          de: '(${text})',
        },
        ...tripleKasumiFollowupOutputStrings,
      },
    },
    {
      id: 'AMR Moko Triple Kasumi-giri 3',
      type: 'GainsEffect',
      netRegex: { effectId: 'B9A', count: Object.keys(mokoVfxMap), capture: false },
      condition: (data) => data.tripleKasumiCollect.length === 3,
      durationSeconds: 10,
      infoText: (data, _matches, output) => {
        const [ability1, ability2, ability3] = data.tripleKasumiCollect;
        if (ability1 === undefined || ability2 === undefined || ability3 === undefined)
          return;
        const text1 = output[`${ability1}First`]();
        const text2 = output[ability2]();
        const text3 = output[ability3]();
        return output.text({ text1: text1, text2: text2, text3: text3 });
      },
      outputStrings: {
        text: {
          en: '${text1} => ${text2} => ${text3}',
          de: '${text1} => ${text2} => ${text3}',
        },
        ...tripleKasumiFirstOutputStrings,
        ...tripleKasumiFollowupOutputStrings,
      },
    },
    {
      id: 'AMR Moko Triple Kasumi-giri Followup',
      type: 'Ability',
      netRegex: { id: tripleKasumiAbilityIds, source: 'Moko the Restless', capture: false },
      suppressSeconds: 1,
      alertText: (data, _matches, output) => {
        // First one has already been called, so ignore it.
        if (data.tripleKasumiCollect.length === 3)
          data.tripleKasumiCollect.shift();
        const ability = data.tripleKasumiCollect.shift();
        if (ability === undefined)
          return;
        return output[ability]();
      },
      outputStrings: tripleKasumiFollowupOutputStrings,
    },
    {
      id: 'AMR Moko Lateral Slice',
      type: 'StartsUsing',
      netRegex: { id: '85E3', source: 'Moko the Restless' },
      response: Responses.tankBuster(),
    },
    {
      id: 'AMR Moko Scarlet Auspice',
      type: 'StartsUsing',
      netRegex: { id: '85D1', source: 'Moko the Restless', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Sides + Out => Stay Out',
          de: 'Seiten + Raus => Bleib drausen',
        },
      },
    },
    {
      id: 'AMR Moko Azure Auspice',
      type: 'StartsUsing',
      netRegex: { id: '85D4', source: 'Moko the Restless', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Under => Sides + Out',
          de: 'Unter ihn => Seiten + Geh Raus',
        },
      },
    },
    {
      id: 'AMR Moko Azure Auspice Followup',
      type: 'Ability',
      netRegex: { id: '85D4', source: 'Moko the Restless', capture: false },
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Sides + Out',
          de: 'Seiten + Raus',
        },
      },
    },
    {
      id: 'AMR Moko Fire Line Collect',
      type: 'MapEffect',
      // flags:
      //   00010001 = make lines appear (both blue and red)
      //   00100020 = make lines glow (both blue and red)
      // locations:
      //   2C = N (fire)
      //   2D = NW<->SE (fire)
      //   2E = NE<->SW (fire)
      //   2F = S (fire)
      //   30-33 = blue lines, some order
      netRegex: { flags: '00100020', location: '2[CDEF]' },
      condition: (data, matches) => {
        data.explosionLineCollect.push(matches);
        return data.explosionLineCollect.length === 2;
      },
      durationSeconds: 5,
      alertText: (data, _matches, output) => {
        const isNorth = data.explosionLineCollect.find((x) => x.location === '2F') !== undefined;
        const isSWOrNE = data.explosionLineCollect.find((x) => x.location === '2D') !== undefined;
        if (isNorth)
          return isSWOrNE ? output.dirNE() : output.dirNW();
        return isSWOrNE ? output.dirSW() : output.dirSE();
      },
      outputStrings: {
        dirNE: Outputs.dirNE,
        dirSE: Outputs.dirSE,
        dirSW: Outputs.dirSW,
        dirNW: Outputs.dirNW,
        unknown: Outputs.unknown,
      },
    },
    {
      id: 'AMR Moko Invocation Collect',
      type: 'GainsEffect',
      // E1A = Vengeful Flame (spread)
      // E1B = Vengeful Pyre (stack)
      netRegex: { effectId: ['E1A', 'E1B'] },
      run: (data, matches) => data.invocationCollect.push(matches),
    },
    {
      id: 'AMR Moko Invocation of Vengeance',
      type: 'GainsEffect',
      netRegex: { effectId: ['E1A', 'E1B'], capture: false },
      delaySeconds: 0.5,
      durationSeconds: 5,
      suppressSeconds: 999999,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        // TODO: the timing of this is a little bit tough to condense:
        //   t=0.0 these effects
        //   t=2.3 tether appears
        //   t=2.7 explosion lines start glowing
        // Right now we just call everything separately to call it as soon as possible.
        // A more complicated alternative to be to call this here, and then slightly later
        // figure out who should stack with the tether where, since you know if it's a melee stack
        // and the melee has a tether you could tell people "Stack with Tether SE" kind of thing.
        //
        // However, because there's so many calls, we'll drop the "stacks on" part of this.
        return stackSpreadResponse(data, output, data.invocationCollect, 'E1B', 'E1A', true);
      },
    },
    {
      id: 'AMR Moko Invocation of Vengeance Followup',
      type: 'Ability',
      // 85DC = Vengeful Flame
      // 85DD = Vengeful Pyre
      netRegex: { id: ['85DC', '85DD'], capture: false },
      suppressSeconds: 1,
      infoText: (data, _matches, output) => {
        const mech = data.stackSpreadSecondMechanic;
        if (mech === undefined)
          return;
        delete data.stackSpreadFirstMechanic;
        delete data.stackSpreadSecondMechanic;
        return output[mech]();
      },
      outputStrings: basicStackSpreadOutputStrings,
    },
    {
      id: 'AMR Moko Iai-giri Cleanup',
      type: 'StartsUsing',
      // 85C2 = Fleeting Iai-giri (from Moko the Restless)
      // 85C8 = Double Iai-giri (from Moko's Shadow)
      netRegex: { id: ['85C2', '85C8'], capture: false },
      // Clean up once so we can collect casts.
      suppressSeconds: 5,
      run: (data) => {
        data.iaigiriTether = [];
        data.iaigiriPurple = [];
        data.iaigiriCasts = [];
        delete data.myAccursedEdge;
        delete data.myIaigiriTether;
        delete data.oniClaw;
      },
    },
    {
      id: 'AMR Moko Iai-giri Tether Collect',
      type: 'Tether',
      netRegex: { id: '0011' },
      run: (data, matches) => {
        data.iaigiriTether.push(matches);
        if (matches.target === data.me)
          data.myIaigiriTether = matches;
      },
    },
    {
      id: 'AMR Moko Iai-giri Purple Marker Collect',
      type: 'GainsEffect',
      netRegex: { effectId: 'B9A', count: Object.keys(shadowVfxMap) },
      run: (data, matches) => data.iaigiriPurple.push(matches),
    },
    {
      id: 'AMR Moko Iai-giri Double Iai-giri Collect',
      type: 'StartsUsing',
      netRegex: { id: '85C8', source: 'Moko\'s Shadow' },
      run: (data, matches) => data.iaigiriCasts.push(matches),
    },
    {
      id: 'AMR Moko Iai-giri Accursed Edge Collect',
      type: 'Ability',
      netRegex: { id: '85DA' },
      condition: Conditions.targetIsYou(),
      // You could (but shouldn't) be hit by multiple of these, so just take the last.
      run: (data, matches) => data.myAccursedEdge = matches,
    },
    {
      id: 'AMR Moko Fleeting Iai-giri',
      type: 'Tether',
      netRegex: { id: '0011', capture: false },
      delaySeconds: 0.5,
      durationSeconds: 7,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          backOnYou: {
            en: 'Back Tether on YOU',
            de: 'Zurück-Verbindung auf DIR',
          },
          leftOnYou: {
            en: 'Left Tether on YOU',
            de: 'Links-Verbindung auf DIR',
          },
          frontOnYou: {
            en: 'Front Tether on YOU',
            de: 'Vorne-Verbindung auf DIR',
          },
          rightOnYou: {
            en: 'Right Tether on YOU',
            de: 'Rechts-Verbindung auf DIR',
          },
          backOnPlayer: {
            en: 'Back Tether on ${player}',
            de: 'Zurück-Verbindung auf ${player}',
          },
          leftOnPlayer: {
            en: 'Left Tether on ${player}',
            de: 'Links-Verbindung auf ${player}',
          },
          frontOnPlayer: {
            en: 'Front Tether on ${player}',
            de: 'Vorne-Verbindung auf ${player}',
          },
          rightOnPlayer: {
            en: 'Right Tether on ${player}',
            de: 'Rechts-Verbindung auf ${player}',
          },
        };
        if (data.iaigiriTether.length !== 1 || data.iaigiriPurple.length !== 1)
          return;
        const [tether] = data.iaigiriTether;
        const [marker] = data.iaigiriPurple;
        if (tether === undefined || marker === undefined)
          return;
        const thisAbility = looseShadowVfxMap[marker.count];
        if (thisAbility === undefined)
          return;
        const player = tether.target;
        if (player === data.me) {
          const outputKey = `${thisAbility}OnYou`;
          return { alarmText: output[outputKey]() };
        }
        const outputKey = `${thisAbility}OnPlayer`;
        return { infoText: output[outputKey]({ player: data.party.member(player) }) };
      },
    },
    {
      id: 'AMR Moko Double Shadow Kasumi-giri Initial',
      type: 'Tether',
      netRegex: { id: '0011', capture: false },
      condition: (data) => !data.seenSoldiersOfDeath,
      delaySeconds: 0.5,
      durationSeconds: 4,
      suppressSeconds: 1,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          backOnYou: {
            en: 'Back Tether (w/${player})',
            de: 'Zurück-Verbindung (w/${player})',
          },
          // These are probably impossible.
          leftOnYou: {
            en: 'Left Tether (w/${player})',
            de: 'Links-Verbindung (w/${player})',
          },
          frontOnYou: {
            en: 'Front Tether (w/${player})',
            de: 'Vorne-Verbindung (w/${player})',
          },
          rightOnYou: {
            en: 'Right Tether (w/${player})',
            de: 'Rechts-Verbindung (w/${player})',
          },
          unmarkedWithPlayer: {
            en: 'Unmarked (w/${player})',
            de: 'Unmarkiert (w/${player})',
          },
          unknown: Outputs.unknown,
        };
        if (data.iaigiriTether.length !== 2 || data.iaigiriPurple.length !== 2)
          return;
        const [tether1, tether2] = data.iaigiriTether;
        const [marker1, marker2] = data.iaigiriPurple;
        if (
          tether1 === undefined || tether2 === undefined || marker1 === undefined ||
          marker2 === undefined
        )
          return;
        const player1 = tether1.target;
        const player2 = tether2.target;
        // Technically if folks are dead you could have both, and this will say "with you" but the pull
        // will not last much longer, so don't worry about this too much.
        if (data.myIaigiriTether === undefined) {
          const remainingPlayer = data.party.partyNames.find((x) => {
            return x !== data.me && x !== player1 && x !== player2;
          }) ?? output.unknown();
          return {
            alertText: output.unmarkedWithPlayer({ player: data.party.member(remainingPlayer) }),
          };
        }
        const otherPlayer = data.me === player1 ? player2 : player1;
        const myMarker = marker1.sourceId === data.myIaigiriTether.sourceId ? marker1 : marker2;
        const thisAbility = looseShadowVfxMap[myMarker.count];
        if (thisAbility === undefined)
          return;
        const outputKey = `${thisAbility}OnYou`;
        return { alarmText: output[outputKey]({ player: data.party.member(otherPlayer) }) };
      },
    },
    {
      id: 'AMR Moko Oni Claw',
      type: 'GainsEffect',
      // This happens ~2.3 seconds prior to the Clearout/Far Edge/Near Edge cast starting,
      // and is the first time these adds appear in the log other than 261 change lines
      // which reposition these adds immediately prior to them gaining this effect.
      netRegex: { effectId: '808', count: '257' },
      suppressSeconds: 1,
      promise: async (data, matches) => {
        data.combatantData = [];
        data.combatantData = (await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.targetId, 16)],
        })).combatants;
      },
      // This is infoText to not conflict with the Unmarked/Tether calls.
      // We could combine this with the Near Far Edge call, but it seemed better to say it sooner.
      infoText: (data, _matches, output) => {
        const [combatant] = data.combatantData;
        if (combatant === undefined || data.combatantData.length !== 1)
          return;
        const dir = Directions.xyTo4DirNum(
          combatant.PosX,
          combatant.PosY,
          mokoCenterX,
          mokoCenterY,
        );
        data.oniClaw = (dir === 1 || dir === 3) ? 'northSouth' : 'eastWest';
        if (data.oniClaw === 'northSouth')
          return output.northSouth();
        return output.eastWest();
      },
      outputStrings: {
        northSouth: {
          en: 'North/South',
          de: 'Norden/Süden',
        },
        eastWest: {
          en: 'East/West',
          de: 'Osten/Westen',
        },
      },
    },
    {
      id: 'AMR Moko Near Far Edge',
      type: 'StartsUsing',
      // 85D8 = Far Edge
      // 85D9 = Near Edge
      netRegex: { id: ['85D8', '85D9'], source: 'Moko the Restless' },
      alertText: (data, matches, output) => {
        const isFarEdge = matches.id === '85D8';
        if (data.myIaigiriTether === undefined)
          return isFarEdge ? output.baitFar() : output.baitNear();
        return isFarEdge ? output.tetherNear() : output.tetherFar();
      },
      outputStrings: {
        baitNear: {
          en: 'Bait Near (Tether Far)',
          de: 'Nah ködern (Verbindung Fern)',
        },
        baitFar: {
          en: 'Bait Far (Tether Near)',
          de: 'Fern ködern (Verbindung Nah)',
        },
        tetherNear: {
          en: 'Tether Near (Bait Far)',
          de: 'Verbindung Nahe (Fern ködern)',
        },
        tetherFar: {
          en: 'Tether Far (Bait Near)',
          de: 'Verbindung Fern (Nahe ködern)',
        },
      },
    },
    {
      id: 'AMR Moko Double Shadow Kasumi-giri Second Mark',
      type: 'GainsEffect',
      netRegex: { effectId: 'B9A', count: Object.keys(shadowVfxMap) },
      condition: (data, matches) => {
        if (data.seenSoldiersOfDeath)
          return false;
        // Ignore the first set of marks, which get called with the tether.
        if (data.iaigiriPurple.length <= 2)
          return false;
        // For the first two Double-Iaigiris before Soldiers of Death,
        // if this is the 4th mark (i.e. the 2nd in the 2nd set) and they are both the same,
        // then we can call that mark for everyone because it doesn't matter where they are.
        const third = data.iaigiriPurple[2]?.count;
        const fourth = data.iaigiriPurple[3]?.count;
        if (third === fourth && third !== undefined && !data.seenSoldiersOfDeath)
          return true;
        // See if the current player is attached to a tether that
        // is attached to the mob gaining this effect.
        // Since we aren't sure where the baiters are we can't really tell them anything.
        return data.myIaigiriTether?.sourceId === matches.targetId;
      },
      // Don't collide with Near Far Edge, which is more important.
      delaySeconds: 3,
      durationSeconds: 5.5,
      suppressSeconds: 5,
      infoText: (data, matches, output) => {
        const third = data.iaigiriPurple[2]?.count;
        const fourth = data.iaigiriPurple[3]?.count;
        if (third === fourth && third !== undefined && !data.seenSoldiersOfDeath) {
          const thisAbility = looseShadowVfxMap[third];
          if (thisAbility === undefined)
            return;
          return output[thisAbility]();
        }
        const thisAbility = looseShadowVfxMap[matches.count];
        if (thisAbility === undefined)
          return;
        return output[thisAbility]();
      },
      outputStrings: {
        // This is probably not possible.
        back: {
          en: '(then stay)',
          de: '(bleib stehen)',
        },
        left: {
          en: '(then left)',
          de: '(dann links)',
        },
        front: {
          en: '(then through)',
          de: '(dann durchgehen)',
        },
        right: {
          en: '(then right)',
          de: '(dann rechts)',
        },
      },
    },
    {
      id: 'AMR Moko Shadow Kasumi-giri Back Tether',
      type: 'Ability',
      netRegex: { id: '85C9', source: 'Moko\'s Shadow' },
      condition: (data, matches) => data.myIaigiriTether?.sourceId === matches.sourceId,
      durationSeconds: 2,
      // Maybe you have two tethers, although it probably won't go well.
      suppressSeconds: 1,
      alertText: (_data, _matches, output) => output.back(),
      outputStrings: {
        // This is a reminder to make sure to move after the clone jumps to you.
        // TODO: should see this say Back => Right or something?
        back: Outputs.back,
      },
    },
    {
      id: 'AMR Moko Shadow Kasumi-giri Followup',
      type: 'Ability',
      netRegex: { id: '85CA', source: 'Moko\'s Shadow' },
      condition: (data, matches) => {
        // Reject anybody not tethered by this add or not on the same side.
        if (data.myIaigiriTether === undefined) {
          if (data.oniClaw === 'northSouth') {
            const myYStr = data.myAccursedEdge?.targetY;
            if (myYStr === undefined)
              return false;
            const thisY = parseFloat(matches.y);
            const myY = parseFloat(myYStr);
            if (
              myY < mokoCenterY && thisY > mokoCenterY || myY > mokoCenterY && thisY < mokoCenterY
            )
              return false;
          } else if (data.oniClaw === 'eastWest') {
            const myXStr = data.myAccursedEdge?.targetX;
            if (myXStr === undefined)
              return false;
            const thisX = parseFloat(matches.x);
            const myX = parseFloat(myXStr);
            if (
              myX < mokoCenterX && thisX > mokoCenterX || myX > mokoCenterX && thisX < mokoCenterX
            )
              return false;
          } else if (data.oniClaw === undefined) {
            // missing data.oniClaw somehow??
            return false;
          }
        } else if (matches.sourceId !== data.myIaigiriTether.sourceId) {
          return false;
        }
        return true;
      },
      suppressSeconds: 1,
      alertText: (data, matches, output) => {
        // Find the second marker for this add.
        const marker = [...data.iaigiriPurple].reverse().find((x) => {
          return x.targetId === matches.sourceId;
        });
        if (marker === undefined)
          return;
        const thisAbility = looseShadowVfxMap[marker.count];
        if (thisAbility === undefined)
          return;
        return output[thisAbility]();
      },
      outputStrings: {
        // This probably can't happen.
        back: {
          en: 'Stay',
          de: 'Bleib stehen',
        },
        left: Outputs.left,
        front: {
          en: 'Through',
          de: 'Lauf durch',
        },
        right: Outputs.right,
      },
    },
    {
      id: 'AMR Moko Soldiers of Death',
      type: 'StartsUsing',
      netRegex: { id: '8593', source: 'Moko the Restless', capture: false },
      run: (data, _matches) => data.seenSoldiersOfDeath = true,
    },
    {
      id: 'AMR Moko Soldiers of Death Blue Add',
      type: 'GainsEffect',
      // The red soldiers get 1E8 effects, and the blue add gets 5E.
      // TODO: unfortunately there's no information about where casts are being targeted
      // and so there's no way to know the final safe spot, only which half.
      netRegex: { effectId: '808', count: '5E' },
      promise: async (data, matches) => {
        data.combatantData = [];
        data.combatantData = (await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.targetId, 16)],
        })).combatants;
      },
      alertText: (data, _matches, output) => {
        const [combatant] = data.combatantData;
        if (combatant === undefined || data.combatantData.length !== 1)
          return;
        const x = combatant.PosX - mokoCenterX;
        const y = combatant.PosY - mokoCenterY;
        // This add is off the edge (far) and then along that edge (less far).
        // We need to look at the "less far" direction and go opposite.
        if (Math.abs(x) > Math.abs(y))
          return y < 0 ? output.south() : output.north();
        return x < 0 ? output.east() : output.west();
      },
      outputStrings: {
        north: Outputs.north,
        east: Outputs.east,
        south: Outputs.south,
        west: Outputs.west,
      },
    },
    {
      id: 'AMR Moko Soldiers of Death Shadow Kasumi-giri Tether',
      type: 'GainsEffect',
      netRegex: { effectId: 'B9A', count: Object.keys(shadowVfxMap), capture: false },
      // Ignore the first set of marks, which get called with the tether.
      condition: (data) => data.iaigiriPurple.length > 4,
      // Wait to collect or call immediately if we have everything.
      delaySeconds: (data) => data.iaigiriPurple.length === 8 ? 0 : 0.5,
      durationSeconds: 5,
      suppressSeconds: 5,
      alertText: (data, _matches, output) => {
        const myTether = data.myIaigiriTether;
        if (myTether === undefined)
          return;
        // Find the second marker for this add.
        const marker = [...data.iaigiriPurple].reverse().find((x) => {
          return x.targetId === myTether.sourceId;
        });
        if (marker === undefined)
          return;
        const thisAbility = looseShadowVfxMap[marker.count];
        if (thisAbility !== 'left' && thisAbility !== 'right')
          return;
        // Find the matching marker for your marker.
        const matchingMarkers = data.iaigiriPurple.filter((x) => {
          return x.count === marker.count && x.targetId !== marker.targetId;
        });
        // Make sure there's only one matching symbol, just in case.
        const [partnerMarker] = matchingMarkers;
        if (partnerMarker === undefined || matchingMarkers.length !== 1)
          return;
        // Find the matching tether for this matching marker.
        const partnerTether = data.iaigiriTether.find((x) => {
          return x.sourceId === partnerMarker.targetId;
        });
        if (partnerTether === undefined)
          return;
        const flexPartner = partnerTether.target;
        const stackType = findStackPartners(data, data.me, flexPartner);
        const stackStr = output[stackType]();
        if (thisAbility === 'left')
          return output.left({ partners: stackStr });
        return output.right({ partners: stackStr });
      },
      outputStrings: {
        left: {
          en: 'Left Tether (${partners})',
          de: 'Linke Verbindung (${partners})',
        },
        right: {
          en: 'Right Tether (${partners})',
          de: 'Rechte Verbindung (${partners})',
        },
        melee: {
          en: 'melees together',
          de: 'Nahkämpfer zusammen',
        },
        role: {
          en: 'roles together',
          de: 'Rollen zusammen',
        },
        partner: {
          en: 'partners together',
          de: 'Partner zusammen',
        },
        unknown: Outputs.unknown,
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Eye of the Thunder Vortex/Vortex of the Thunder Eye': 'Thunder Eye/Vortex',
        'Far Edge/Near Edge': 'Far/Near Edge',
        'Great Ball of Fire/Greater Ball of Fire': 'Greater/Great Ball of Fire',
        'Greater Ball of Fire/Great Ball of Fire': 'Great/Greater Ball of Fire',
        'Near Edge/Far Edge': 'Near/Far Edge',
        'Unnatural Ailment/Unnatural Force': 'Unnatural Ailment/Force',
        'Unnatural Force/Unnatural Ailment': 'Unnatural Force/Ailment',
        'Vengeful Flame/Vengeful Pyre': 'Vengeful Flame/Pyre',
        'Vortex of the Thunder Eye/Eye of the Thunder Vortex': 'Thunder Vortex/Eye',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'Ashigaru Kyuhei': 'Ashigaru Kyuhei',
        'Ball of Levin': 'Elektrosphäre',
        'Devilish Thrall': 'hörig(?:e|er|es|en) Shiki',
        'Gorai the Uncaged': 'Gorai (?:der|die|das) Entfesselt(?:e|er|es|en)',
        'Moko the Restless': 'Moko (?:der|die|das) Rastlos(?:e|er|es|en)',
        'Moko\'s Shadow': 'Phantom-Moko',
        'Oni\'s Claw': 'Oni-Klaue',
        'Shishio': 'Shishio',
        'Shishu Fuko': 'Shishu-Fuko',
        'Shishu Furutsubaki': 'Shishu-Furutsubaki',
        'Shishu Kotengu': 'Shishu-Kotengu',
        'Shishu Onmitsugashira': 'Shishu-Onmitsugarashi',
        'Shishu Raiko': 'Shishu-Raiko',
        'Shishu Yuki': 'Shishu-Yuki',
        'The Trial Of Benevolence': 'Probe der Güte',
        'The Trial Of Responsibility': 'Probe der Pflicht',
        'The Trial Of Wisdom': 'Probe der Weisheit',
      },
      'replaceText': {
        '\\(circles\\)': '(Kreise)',
        '\\(lines\\)': '(Linien)',
        'Azure Auspice': 'Azurblauer Kenki-Fokus',
        'Boundless Azure': 'Grenzenloses Azurblau',
        'Boundless Scarlet': 'Grenzenloses Scharlachrot',
        'Brazen Ballad': 'Biwa-Weise',
        '(?<!Levin)Burst': 'Explosion',
        'Clearout': 'Ausräumung',
        'Cloud to Ground': 'Sturmkonzentration',
        'Double Iai-giri': 'Doppeltes Iai-giri',
        'Enkyo': 'Enkyo',
        'Explosion': 'Explosion',
        'Eye of the Thunder Vortex': 'Auge des Sturmwirbels',
        'Falling Rock': 'Steinschlag',
        'Far Edge': 'Fernschneidung',
        'Fighting Spirits': 'Kräftigender Schluck',
        'Fire Spread': 'Brandstiftung',
        'Flame and Sulphur': 'Flamme und Schwefel',
        'Fleeting Iai-giri': 'Leichtfüßiges Iai-giri',
        'Flickering Flame': 'Flackernde Flamme',
        'Flintlock': 'Steinschloss',
        'Great Ball of Fire': 'Großer Feuerball',
        'Greater Ball of Fire': 'Größerer Feuerball',
        'Haunting Cry': 'Klagender Schrei',
        'Humble Hammer': 'Entehrender Hammer',
        'Impure Purgation': 'Flammenwind',
        'Invocation of Vengeance': 'Ruf nach Vergeltung',
        'Iron Rain': 'Eisenregen',
        'Iron Storm': 'Eisensturm',
        'Kenki Release': 'Kenki-Entfesselung',
        'Lateral Slice': 'Lateralschlitzer',
        'Left Swipe': 'Linker Feger',
        'Levinburst': 'Blitzgang',
        'Malformed Prayer': 'Unheil des Perlenkranzes',
        'Malformed Reincarnation': 'Unheilvolle Verwandlung',
        'Moonless Night': 'Mondlose Nacht',
        'Near Edge': 'Nahschneidung',
        'Noble Pursuit': 'Reißzahn des Löwen',
        'Pointed Purgation': 'Gerichteter Flammenwind',
        'Right Swipe': 'Rechter Feger',
        'Rousing Reincarnation': 'Fluch der Verwandlung',
        'Scarlet Auspice': 'Scharlachroter Kenki-Fokus',
        'Seal of Scurrying Sparks': 'Siegel des Funkenflugs',
        'Shadow Kasumi-giri': 'Obskures Kasumi-giri',
        'Shadow-twin': 'Schattenzwilling',
        'Shock': 'Entladung',
        'Slither': 'Schlängeln',
        'Smokeater': 'Dunstfresser',
        'Soldiers of Death': 'Soldaten des Todes',
        'Splitting Cry': 'Schrecklicher Schrei',
        'Stormcloud Summons': 'Elektrizitätsgenerierung',
        'Stygian Aura': 'Schwarze Aura',
        '(?<!Eye of the )Thunder Vortex': 'Sturmwirbel',
        'Thundercall': 'Donnerruf',
        'Torching Torment': 'Höllische Hitze',
        'Triple Kasumi-giri': 'Dreifaches Kasumi-giri',
        'Unenlightenment': 'Glühende Geißel',
        'Unnatural Ailment': 'Unnatürliches Leiden',
        'Unnatural Force': 'Unnatürliche Macht',
        'Unnatural Wail': 'Unnatürliches Heulen',
        'Upwell': 'Strömung',
        'Vengeful Flame': 'Vergeltende Flamme',
        'Vengeful Pyre': 'Vergeltendes Feuer',
        'Vengeful Souls': 'Rachsüchtige Seelen',
        'Vermilion Aura': 'Rote Aura',
        'Vortex of the Thunder Eye': 'Wirbel des Sturmauges',
        'Worldly Pursuit': 'Schmerzschlag der Springmaus',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Ashigaru Kyuhei': 'ashigaru kyûhei',
        'Ball of Levin': 'orbe de foudre',
        'Devilish Thrall': 'ilote malicieux',
        'Gorai the Uncaged': 'Gôrai le fureteur',
        'Moko the Restless': 'Môko le tourmenté',
        'Moko\'s Shadow': 'spectre de Môko',
        'Oni\'s Claw': 'griffe d\'oni',
        'Shishio': 'Shishiô',
        'Shishu Fuko': 'fûkô de Shishû',
        'Shishu Furutsubaki': 'furutsubaki de Shishû',
        'Shishu Kotengu': 'kotengu de Shishû',
        'Shishu Onmitsugashira': 'onmitsugashira de Shishû',
        'Shishu Raiko': 'raikô de Shishû',
        'Shishu Yuki': 'yûki de Shishû',
        'The Trial Of Benevolence': 'Épreuve de la Prospérité',
        'The Trial Of Responsibility': 'Épreuve de la Longévité',
        'The Trial Of Wisdom': 'Épreuve de la Connaissance',
      },
      'replaceText': {
        'Azure Auspice': 'Auspice azuré',
        'Boundless Azure': 'Lueur azurée',
        'Boundless Scarlet': 'Lueur écarlate',
        'Brazen Ballad': 'Ballade cuivrée',
        '(?<!Levin)Burst': 'Explosion',
        'Clearout': 'Fauchage',
        'Cloud to Ground': 'Attaque fulminante',
        'Double Iai-giri': 'Iai-giri double',
        'Enkyo': 'Enkyô',
        'Explosion': 'Explosion',
        'Eye of the Thunder Vortex': 'Œil du vortex de foudre',
        'Falling Rock': 'Chute de pierre',
        'Far Edge': 'Visée lointaine',
        'Fighting Spirits': 'Esprits spiritueux',
        'Fire Spread': 'Nappe de feu',
        'Flame and Sulphur': 'Soufre enflammé',
        'Fleeting Iai-giri': 'Iai-giri fugace',
        'Flickering Flame': 'Flamme vacillante',
        'Flintlock': 'Tir d\'artillerie',
        'Great Ball of Fire': 'Grande boule de feu',
        'Greater Ball of Fire': 'Grande sphère de feu',
        'Haunting Cry': 'Cri de tourmente',
        'Humble Hammer': 'Marteau d\'humilité',
        'Impure Purgation': 'Purgation impure',
        'Invocation of Vengeance': 'Invocation vengeresse',
        'Iron Rain': 'Pluie de fer',
        'Iron Storm': 'Orage de fer',
        'Kenki Release': 'Décharge Kenki',
        'Lateral Slice': 'Taillade latérale',
        'Left Swipe': 'Tranchage gauche',
        'Levinburst': 'Éclat de foudre',
        'Malformed Prayer': 'Prière difforme',
        'Malformed Reincarnation': 'Sceau de réincarnation difforme',
        'Moonless Night': 'Nuit noire',
        'Near Edge': 'Visée proche',
        'Noble Pursuit': 'Noble ambition',
        'Pointed Purgation': 'Purgation pointée',
        'Right Swipe': 'Tranchage droit',
        'Rousing Reincarnation': 'Réincarnation vibrante',
        'Scarlet Auspice': 'Auspice écarlate',
        'Seal of Scurrying Sparks': 'Sceau des feux follets',
        'Shadow Kasumi-giri': 'Kasumi-giri spectral',
        'Shadow-twin': 'Ombre jumelle',
        'Shock': 'Décharge électrostatique',
        'Slither': 'Serpentin',
        'Smokeater': 'Dévoreur de brouillard',
        'Soldiers of Death': 'Guerriers de la mort',
        'Splitting Cry': 'Cri d\'horreur',
        'Stormcloud Summons': 'Nuage d\'orage',
        'Stygian Aura': 'Aura stygienne',
        '(?<!Eye of the )Thunder Vortex': 'Spirale de foudre',
        'Thundercall': 'Drain fulminant',
        'Torching Torment': 'Brasier de tourments',
        'Triple Kasumi-giri': 'Kasumi-giri triple',
        'Unenlightenment': 'Sommeil spirituel',
        'Unnatural Ailment': 'Affection contre nature',
        'Unnatural Force': 'Force contre nature',
        'Unnatural Wail': 'Hurlement contre nature',
        'Upwell': 'Torrent violent',
        'Vengeful Flame': 'Flamme vengeresse',
        'Vengeful Pyre': 'Bûcher vengeur',
        'Vengeful Souls': 'Âmes vengeresses',
        'Vermilion Aura': 'Aura vermillon',
        'Vortex of the Thunder Eye': 'Vortex de l\'œil de foudre',
        'Worldly Pursuit': 'Matérialisme',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Ashigaru Kyuhei': '足軽弓兵',
        'Ball of Levin': '雷球',
        'Devilish Thrall': '惑わされた屍鬼',
        'Gorai the Uncaged': '鉄鼠ゴウライ',
        'Moko the Restless': '怨霊モウコ',
        'Moko\'s Shadow': 'モウコの幻影',
        'Oni\'s Claw': '鬼腕',
        'Shishio': '獅子王',
        'Shishu Fuko': 'シシュウ・フウコウ',
        'Shishu Furutsubaki': 'シシュウ・フルツバキ',
        'Shishu Kotengu': 'シシュウ・コテング',
        'Shishu Onmitsugashira': 'シシュウ・オンミツガシラ',
        'Shishu Raiko': 'シシュウ・ライコウ',
        'Shishu Yuki': 'シシュウ・ユウキ',
        'The Trial Of Benevolence': '福徳の試練',
        'The Trial Of Responsibility': '寿徳の試練',
        'The Trial Of Wisdom': '智徳の試練',
      },
      'replaceText': {
        'Azure Auspice': '青帝剣気',
        'Boundless Azure': '青帝空閃刃',
        'Boundless Scarlet': '赤帝空閃刃',
        'Brazen Ballad': '琵琶の旋律',
        '(?<!Levin)Burst': '爆発',
        'Clearout': 'なぎ払い',
        'Cloud to Ground': '襲雷',
        'Double Iai-giri': '俊足居合二段',
        'Enkyo': '猿叫',
        'Explosion': '爆発',
        'Eye of the Thunder Vortex': '渦雷の連舞：円輪',
        'Falling Rock': '落石',
        'Far Edge': '遠間当て',
        'Fighting Spirits': '般若湯',
        'Fire Spread': '放火',
        'Flame and Sulphur': '岩火招来',
        'Fleeting Iai-giri': '俊足居合斬り',
        'Flickering Flame': '怪火招来',
        'Flintlock': '火砲',
        'Great Ball of Fire': '火球',
        'Greater Ball of Fire': '重火球',
        'Haunting Cry': '不気味な鳴声',
        'Humble Hammer': '打ち出の小槌',
        'Impure Purgation': '炎流',
        'Invocation of Vengeance': '怨呪の祈請',
        'Iron Rain': '矢の雨',
        'Iron Storm': '矢の嵐',
        'Kenki Release': '剣気解放',
        'Lateral Slice': '胴薙ぎ',
        'Left Swipe': '左爪薙ぎ払い',
        'Levinburst': '発雷',
        'Malformed Prayer': '呪珠印',
        'Malformed Reincarnation': '変現呪珠の印',
        'Moonless Night': '闇夜斬り',
        'Near Edge': '近間当て',
        'Noble Pursuit': '獅子王牙',
        'Pointed Purgation': '指向炎流',
        'Right Swipe': '右爪薙ぎ払い',
        'Rousing Reincarnation': '変現の呪い',
        'Scarlet Auspice': '赤帝剣気',
        'Seal of Scurrying Sparks': '乱火の印',
        'Shadow Kasumi-giri': '幻影霞斬り',
        'Shadow-twin': '幻影呼び',
        'Shock': '放電',
        'Slither': '蛇尾薙ぎ',
        'Smokeater': '霞喰い',
        'Soldiers of Death': '屍兵呼び',
        'Splitting Cry': '霊鳴砲',
        'Stormcloud Summons': '雷雲生成',
        'Stygian Aura': '黒妖弾',
        '(?<!Eye of the )Thunder Vortex': '輪転渦雷',
        'Thundercall': '招雷',
        'Torching Torment': '煩熱',
        'Triple Kasumi-giri': '霞三段',
        'Unenlightenment': '煩悩熾盛',
        'Unnatural Ailment': '妖撃',
        'Unnatural Force': '重妖撃',
        'Unnatural Wail': '不気味な呪声',
        'Upwell': '水流',
        'Vengeful Flame': '怨呪の火',
        'Vengeful Pyre': '怨呪の重火',
        'Vengeful Souls': '黒赤招魂',
        'Vermilion Aura': '赤妖弾',
        'Vortex of the Thunder Eye': '渦雷の連舞：輪円',
        'Worldly Pursuit': '跳鼠痛撃',
      },
    },
  ],
});
