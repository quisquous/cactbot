const dualspells = {
  fireIce: ['8154', '8184'],
  thunderIce: ['8155', '8185'],
};
const headmarkers = {
  // vfx/lockon/eff/tank_lockonae_0m_5s_01t.avfx
  dualityOfDeath: '01D4',
  // vfx/lockon/eff/m0361trg_a1t.avfx (through m0361trg_a8t)
  limitCut1: '004F',
  limitCut2: '0050',
  limitCut3: '0051',
  limitCut4: '0052',
  limitCut5: '0053',
  limitCut6: '0054',
  limitCut7: '0055',
  limitCut8: '0056',
  // vfx/lockon/eff/r1fz_skywl_s9x.avfx
  defamation: '014A',
  // vfx/lockon/eff/n5r9_lockon_bht_c0g.avfx
  cometMarker: '01B3',
};
const limitCutMarkers = [
  headmarkers.limitCut1,
  headmarkers.limitCut2,
  headmarkers.limitCut3,
  headmarkers.limitCut4,
  headmarkers.limitCut5,
  headmarkers.limitCut6,
  headmarkers.limitCut7,
  headmarkers.limitCut8,
];
const limitCutNumberMap = {
  '004F': 1,
  '0050': 2,
  '0051': 3,
  '0052': 4,
  '0053': 5,
  '0054': 6,
  '0055': 7,
  '0056': 8,
};
const limitCutPlayerActive = [
  // These ordered nested arrays contain the limit cut headmarkers for [ dash order, tower soak order ]
  [2, 6],
  [4, 8],
  [6, 2],
  [8, 4],
];
// Time between headmarker and defamation for Chimeric Succession.
const chimericLimitCutTime = {
  1: 10,
  2: 13,
  3: 16,
  4: 19,
};
const firstHeadmarker = parseInt(headmarkers.dualityOfDeath, 16);
const getHeadmarkerId = (data, matches) => {
  // If we naively just check !data.decOffset and leave it, it breaks if the first marker is 00DA.
  // (This makes the offset 0, and !0 is true.)
  if (data.decOffset === undefined)
    data.decOffset = parseInt(matches.id, 16) - firstHeadmarker;
  // The leading zeroes are stripped when converting back to string, so we re-add them here.
  // Fortunately, we don't have to worry about whether or not this is robust,
  // since we know all the IDs that will be present in the encounter.
  return (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase().padStart(4, '0');
};
const centerX = 100;
const centerY = 100;
Options.Triggers.push({
  id: 'AnabaseiosTheNinthCircleSavage',
  zoneId: ZoneId.AnabaseiosTheNinthCircleSavage,
  timelineFile: 'p9s.txt',
  initData: () => {
    return {
      dualityBuster: [],
      levinOrbs: {},
      limitCutDash: 0,
    };
  },
  triggers: [
    {
      id: 'P9S Headmarker Tracker',
      type: 'HeadMarker',
      netRegex: {},
      condition: (data) => data.decOffset === undefined,
      suppressSeconds: 99999,
      // Unconditionally set the first headmarker here so that future triggers are conditional.
      run: (data, matches) => getHeadmarkerId(data, matches),
    },
    {
      id: 'P9S Gluttony\'s Augur',
      type: 'StartsUsing',
      netRegex: { id: '814C', source: 'Kokytos', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'P9S Soul Surge',
      type: 'Ability',
      // Soul Surge happens ~6s after any Ravening with no cast bar.
      netRegex: { id: ['8118', '8119', '817B', '811A'], source: 'Kokytos', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'P9S Duality of Death Collect',
      type: 'HeadMarker',
      netRegex: {},
      condition: (data, matches) => getHeadmarkerId(data, matches) === headmarkers.dualityOfDeath,
      run: (data, matches) => data.dualityBuster.push(matches.target),
    },
    {
      id: 'P9S Duality of Death',
      type: 'StartsUsing',
      netRegex: { id: '8151', source: 'Kokytos', capture: false },
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          tankBusterOnYou: Outputs.tankBusterOnYou,
          tankSwap: Outputs.tankSwap,
          tankBusters: Outputs.tankBusters,
        };
        if (data.dualityBuster.includes(data.me)) {
          if (data.role !== 'tank' && data.job !== 'BLU')
            return { alarmText: output.tankBusterOnYou() };
          return { alertText: output.tankSwap() };
        }
        return { infoText: output.tankBusters() };
      },
      run: (data) => data.dualityBuster = [],
    },
    {
      id: 'P9S Dualspell Fire/Ice',
      type: 'StartsUsing',
      netRegex: { id: dualspells.fireIce, source: 'Kokytos' },
      durationSeconds: 5,
      infoText: (_data, _matches, output) => output.text(),
      run: (data, matches) => data.lastDualspellId = matches.id,
      outputStrings: {
        text: {
          en: 'Partners + Donut',
          de: 'Partner + Donut',
          fr: 'Partenaires + Donut',
          cn: '双人分摊 + 月环',
          ko: '파트너 + 도넛',
        },
      },
    },
    {
      id: 'P9S Dualspell Thunder/Ice',
      type: 'StartsUsing',
      netRegex: { id: dualspells.thunderIce, source: 'Kokytos' },
      durationSeconds: 5,
      infoText: (_data, _matches, output) => output.text(),
      run: (data, matches) => data.lastDualspellId = matches.id,
      outputStrings: {
        text: {
          en: 'Protean + Donut',
          de: 'Himmelsrichtungen + Donut',
          fr: 'Positions + Donut',
          cn: '八方分散 + 月环',
          ko: '8방향 산개 + 도넛',
        },
      },
    },
    {
      id: 'P9S Fire Symbol',
      type: 'Ability',
      netRegex: { id: '8122', source: 'Kokytos', capture: false },
      alertText: (data, _matches, output) => {
        if (data.lastDualspellId === undefined)
          return output.out();
        if (dualspells.fireIce.includes(data.lastDualspellId))
          return output.fireIceOut();
        return output.out();
      },
      run: (data) => delete data.lastDualspellId,
      outputStrings: {
        fireIceOut: {
          en: 'Out + Partners',
          de: 'Raus + Partner',
          fr: 'Extérieur + Partenaires',
          cn: '远离 + 双人分摊',
          ko: '밖으로 + 파트너',
        },
        out: Outputs.out,
      },
    },
    {
      id: 'P9S Ice Symbol',
      type: 'Ability',
      netRegex: { id: '8123', source: 'Kokytos', capture: false },
      alertText: (data, _matches, output) => {
        if (data.lastDualspellId === undefined)
          return output.in();
        if (dualspells.fireIce.includes(data.lastDualspellId))
          return output.fireIceIn();
        if (dualspells.thunderIce.includes(data.lastDualspellId))
          return output.thunderIceIn();
        return output.in();
      },
      run: (data) => delete data.lastDualspellId,
      outputStrings: {
        fireIceIn: {
          en: 'In + Partners',
          de: 'Rein + Partner',
          fr: 'Intérieur + Partenaires',
          cn: '靠近 + 双人分摊',
          ko: '안으로 + 파트너',
        },
        thunderIceIn: {
          en: 'In + Protean',
          de: 'Rein + Himmelsrichtungen',
          fr: 'Intérieur + Positions',
          cn: '靠近 + 八方分散',
          ko: '안으로 + 8방향 산개',
        },
        in: Outputs.in,
      },
    },
    {
      id: 'P9S Thunder Symbol',
      type: 'Ability',
      netRegex: { id: '815C', source: 'Kokytos', capture: false },
      alertText: (data, _matches, output) => {
        if (data.lastDualspellId === undefined)
          return output.out();
        if (dualspells.thunderIce.includes(data.lastDualspellId))
          return output.thunderIceOut();
        return output.out();
      },
      run: (data) => delete data.lastDualspellId,
      outputStrings: {
        thunderIceOut: {
          en: 'Out + Protean',
          de: 'Raus + Himmelsrichtungen',
          fr: 'Extérieur + Positions',
          cn: '远离 + 八方分散',
          ko: '밖으로 + 8방향 산개',
        },
        out: Outputs.out,
      },
    },
    {
      id: 'P9S Ascendant Fist',
      type: 'StartsUsing',
      netRegex: { id: '816F', source: 'Kokytos' },
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'P9S Archaic Rockbreaker',
      type: 'StartsUsing',
      netRegex: { id: '815F', source: 'Kokytos', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Knockback into Wall',
          de: 'Rückstoß in die Wand',
          fr: 'Poussée sur un mur',
          cn: '向墙边击退',
          ko: '벽으로 넉백',
        },
      },
    },
    {
      id: 'P9S Archaic Demolish',
      type: 'StartsUsing',
      netRegex: { id: '816D', source: 'Kokytos', capture: false },
      alertText: (_data, _matches, output) => output.healerGroups(),
      outputStrings: {
        healerGroups: Outputs.healerGroups,
      },
    },
    {
      // Ball of Levin combatants are added ~0.3 seconds after Kokytos finishes using Levinstrike Summoning
      // and ~1.7 before Kokytos begins using Scrambled Succession (which is when limit cut markers appear)
      // These combatants are added in their actual positions, so no need to check OP for combatant data.
      id: 'P9S Limit Cut Levin Orb Collect',
      type: 'AddedCombatant',
      // There are multiple invsible combatants that share this name, but the ones that receive HeadMarkers
      // in limit cut (the ones we care about) are distinguishable because their level attribute is set to 90.
      netRegex: { name: 'Ball of Levin', level: '5A' },
      run: (data, matches) => {
        // (0 = N, 1 = NE ... 7 = NW)
        const orb8Dir = Directions.addedCombatantPosTo8Dir(matches, centerX, centerY);
        data.levinOrbs[matches.id] = { dir: orb8Dir };
      },
    },
    {
      id: 'P9S Limit Cut Levin Orb Order Collect',
      type: 'HeadMarker',
      netRegex: {},
      condition: (data, matches) => {
        return limitCutMarkers.includes(getHeadmarkerId(data, matches)) &&
          Object.keys(data.levinOrbs).includes(matches.targetId);
      },
      run: (data, matches) => {
        const correctedMatch = getHeadmarkerId(data, matches);
        const orbLimitCutNumber = limitCutNumberMap[correctedMatch];
        // Levin orbs should always receive a odd-numbered limit cut headmarker
        const expectedOrbLimitCutNumbers = [1, 3, 5, 7];
        if (
          orbLimitCutNumber === undefined || !expectedOrbLimitCutNumbers.includes(orbLimitCutNumber)
        ) {
          console.error('Invalid limit cut headmarker on orb');
          return;
        }
        const orbData = data.levinOrbs[matches.targetId] ?? {};
        if (typeof orbData.dir === 'undefined') {
          console.error('Limit cut headmarker on unknown orb');
          return;
        }
        orbData.order = orbLimitCutNumber;
        data.levinOrbs[matches.targetId] = orbData;
      },
    },
    {
      id: 'P9S Limit Cut Levin Orb Start and Rotation',
      type: 'StartsUsing',
      netRegex: { id: '817D', source: 'Kokytos', capture: false },
      delaySeconds: 1.5,
      infoText: (data, _matches, output) => {
        let firstOrb8Dir;
        let secondOrb8Dir;
        // Orb order is limit cut headmarkers 1 > 3 > 5 > 7
        // 1 is always adjacent to 3, 3 is always adjacent to 5, and so on.
        for (const combatant in data.levinOrbs) {
          switch (data.levinOrbs[combatant]?.order) {
            case 1:
              firstOrb8Dir = data.levinOrbs[combatant]?.dir;
              break;
            case 3:
              secondOrb8Dir = data.levinOrbs[combatant]?.dir;
              break;
          }
        }
        if (firstOrb8Dir === undefined || secondOrb8Dir === undefined)
          return;
        const firstOrb8DirStr = Directions.outputFrom8DirNum(firstOrb8Dir);
        if (firstOrb8DirStr === undefined)
          return;
        const firstOrbDir = output[firstOrb8DirStr]();
        const rotationDir = (secondOrb8Dir - firstOrb8Dir + 8) % 8 === 2
          ? output.clockwise()
          : output.counterclock();
        if (firstOrbDir !== undefined && rotationDir !== undefined)
          return output.text({ dir: firstOrbDir, rotation: rotationDir });
        return;
      },
      outputStrings: {
        text: {
          en: 'First Orb ${dir} => ${rotation}',
          de: 'Erster Orb ${dir} => ${rotation}',
          fr: 'Premier orbe ${dir} => ${rotation}',
          ko: '첫번째 구슬 ${dir} => ${rotation}',
        },
        clockwise: Outputs.clockwise,
        counterclock: Outputs.counterclockwise,
        ...Directions.outputStrings8Dir,
      },
    },
    {
      id: 'P9S Limit Cut Player Number',
      type: 'HeadMarker',
      netRegex: {},
      condition: (data, matches) => {
        return data.me === matches.target &&
          limitCutMarkers.includes(getHeadmarkerId(data, matches));
      },
      preRun: (data, matches) => {
        const correctedMatch = getHeadmarkerId(data, matches);
        data.limitCutNumber = limitCutNumberMap[correctedMatch];
      },
      durationSeconds: (data) => data.seenChimericSuccession ? 20 : 30,
      infoText: (data, _matches, output) => {
        return output.text({ num: data.limitCutNumber ?? output.unknown() });
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
        unknown: Outputs.unknown,
      },
    },
    {
      id: 'P9S Chimeric Limit Cut Defamation',
      type: 'HeadMarker',
      netRegex: {},
      condition: (data, matches) => {
        return data.seenChimericSuccession && data.me === matches.target &&
          data.limitCutNumber !== undefined &&
          limitCutMarkers.includes(getHeadmarkerId(data, matches));
      },
      delaySeconds: (data) => {
        if (data.limitCutNumber === undefined)
          return 0;
        const time = chimericLimitCutTime[data.limitCutNumber];
        if (time === undefined)
          return 0;
        // 6 seconds ahead of time
        return time - 6;
      },
      alertText: (_data, _matches, output) => output.defamation(),
      outputStrings: {
        defamation: {
          en: 'Defamation on YOU',
          de: 'Ehrenstrafe aud DIR',
          fr: 'Diffamation sur VOUS',
          ja: '名誉罰',
          cn: '大圈点名',
          ko: '광역징 대상자',
        },
      },
    },
    {
      // When Kokytos uses 'Scrambled Succession' (817D), there is ~4.0s. until the first tower appears (8181)
      // and about ~5.0s until he dashes and uses Firemeld (8180) on the #2 limit cut player.  Because these abilities
      // have very short (or no) cast times, we can base the first combo trigger on the use of Scrambled Succession, and
      // base subsequent combo triggers on the prior use of Firemeld (which is ~4.6s before the next tower spawns)
      id: 'P9S Limit Cut First Dash/Tower Combo',
      type: 'Ability',
      netRegex: { id: '817D', source: 'Kokytos', capture: false },
      condition: (data) => data.limitCutDash === 0,
      alertText: (data, _matches, output) => {
        const activePlayers = limitCutPlayerActive[data.limitCutDash];
        if (activePlayers === undefined)
          return;
        const [dashPlayer, soakPlayer] = activePlayers;
        if (dashPlayer === undefined || soakPlayer === undefined)
          return;
        if (data.limitCutNumber === dashPlayer)
          return output.dash();
        else if (data.limitCutNumber === soakPlayer)
          return output.soak();
        return;
      },
      outputStrings: {
        dash: {
          en: 'Bait dash',
          de: 'Sprung ködern',
          fr: 'Encaissez le saut',
          ko: '돌진 유도',
        },
        soak: {
          en: 'Soak tower',
          de: 'Im Turm stehen',
          fr: 'Prenez votre tour',
          ko: '기둥 들어가기',
        },
      },
    },
    {
      id: 'P9S Limit Cut Combo Tracker',
      type: 'Ability',
      netRegex: { id: '8180', source: 'Kokytos', capture: false },
      run: (data) => data.limitCutDash++,
    },
    {
      id: 'P9S Limit Cut Later Dash/Tower Combo',
      type: 'Ability',
      netRegex: { id: '8180', source: 'Kokytos', capture: false },
      condition: (data) => data.limitCutDash > 0 && data.limitCutDash < 4,
      delaySeconds: (data) => {
        // delay 'soak tower' call by 1 second to prevent confusion due to ability timing
        return limitCutPlayerActive[data.limitCutDash]?.[1] === data.limitCutNumber ? 1 : 0;
      },
      alertText: (data, _matches, output) => {
        const [dashPlayer, soakPlayer] = limitCutPlayerActive[data.limitCutDash] ?? [];
        if (dashPlayer === undefined || soakPlayer === undefined)
          return;
        if (data.limitCutNumber === dashPlayer)
          return output.dash();
        else if (data.limitCutNumber === soakPlayer)
          return output.soak();
        return;
      },
      outputStrings: {
        dash: {
          en: 'Bait dash',
          de: 'Sprung ködern',
          fr: 'Encaissez le saut',
          ko: '돌진 유도',
        },
        soak: {
          en: 'Soak tower',
          de: 'Im Turm stehen',
          fr: 'Prenez votre tour',
          ko: '기둥 들어가기',
        },
      },
    },
    {
      id: 'P9S Defamation',
      type: 'HeadMarker',
      netRegex: {},
      condition: (data, matches) => {
        return data.me === matches.target &&
          getHeadmarkerId(data, matches) === headmarkers.defamation;
      },
      alarmText: (_data, _matches, output) => output.defamation(),
      outputStrings: {
        defamation: {
          en: 'Defamation on YOU',
          de: 'Ehrenstrafe aud DIR',
          fr: 'Diffamation sur VOUS',
          ja: '名誉罰',
          cn: '大圈点名',
          ko: '광역징 대상자',
        },
      },
    },
    {
      id: 'P9S Charybdis',
      type: 'StartsUsing',
      netRegex: { id: '8170', source: 'Kokytos', capture: false },
      response: Responses.goMiddle(),
    },
    {
      id: 'P9S Front Inside Combination',
      type: 'StartsUsing',
      netRegex: { id: '8167', source: 'Kokytos', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      run: (data) => data.combination = 'front',
      outputStrings: {
        text: {
          en: 'Out => Back',
          de: 'Raus => Hinten',
          fr: 'Extérieur => Derrière',
          cn: '远离 => 去背后',
          ko: '밖으로 => 뒤로',
        },
      },
    },
    {
      id: 'P9S Front Outside Combination',
      type: 'StartsUsing',
      netRegex: { id: '8168', source: 'Kokytos', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      run: (data) => data.combination = 'front',
      outputStrings: {
        text: {
          en: 'In => Back',
          de: 'Rein => Hinten',
          fr: 'Intérieur => Derrière',
          cn: '靠近 => 去背后',
          ko: '안으로 => 뒤로',
        },
      },
    },
    {
      id: 'P9S Rear Inside Roundhouse',
      type: 'StartsUsing',
      netRegex: { id: '8169', source: 'Kokytos', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      run: (data) => data.combination = 'rear',
      outputStrings: {
        text: {
          en: 'Out => Front',
          de: 'Raus => Vorne',
          fr: 'Extérieur => Devant',
          cn: '远离 => 去面前',
          ko: '밖으로 => 앞으로',
        },
      },
    },
    {
      id: 'P9S Rear Outside Roundhouse',
      type: 'StartsUsing',
      netRegex: { id: '816A', source: 'Kokytos', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      run: (data) => data.combination = 'rear',
      outputStrings: {
        text: {
          en: 'In => Front',
          de: 'Rein => Vorne',
          fr: 'Intérieur => Devant',
          cn: '靠近 => 去面前',
          ko: '안으로 => 앞으로',
        },
      },
    },
    {
      id: 'P9S Roundhouse Followup',
      type: 'Ability',
      netRegex: { id: ['8238', '8239'], source: 'Kokytos' },
      suppressSeconds: 15,
      alertText: (data, matches, output) => {
        const isInsideRoundhouse = matches.id === '8238';
        const isOutsideRoundhouse = matches.id === '8239';
        if (data.combination === 'front') {
          if (isOutsideRoundhouse)
            return output.outAndBack();
          if (isInsideRoundhouse)
            return output.inAndBack();
        }
        if (data.combination === 'rear') {
          if (isOutsideRoundhouse)
            return output.outAndFront();
          if (isInsideRoundhouse)
            return output.inAndFront();
        }
        if (isOutsideRoundhouse)
          return output.out();
        if (isInsideRoundhouse)
          return output.in();
      },
      outputStrings: {
        out: Outputs.out,
        in: Outputs.in,
        outAndFront: {
          en: 'Out + Front',
          de: 'Raus + Vorne',
          fr: 'Extérieur + Devant',
          cn: '远离 => 去面前',
          ko: '밖으로 + 앞으로',
        },
        outAndBack: {
          en: 'Out + Back',
          de: 'Raus + Hinten',
          fr: 'Extérieur + Derrière',
          cn: '远离 => 去背后',
          ko: '밖으로 + 뒤로',
        },
        inAndFront: {
          en: 'In + Front',
          de: 'Rein + Vorne',
          fr: 'Intérieur + Devant',
          cn: '靠近 => 去面前',
          ko: '안으로 + 앞으로',
        },
        inAndBack: {
          en: 'In + Back',
          de: 'Rein + Hinten',
          fr: 'Intérieur + Derrière',
          cn: '靠近 => 去背后',
          ko: '안으로 + 뒤로',
        },
      },
    },
    {
      id: 'P9S Chimeric Succession',
      type: 'StartsUsing',
      netRegex: { id: '81BB', source: 'Kokytos', capture: false },
      run: (data) => data.seenChimericSuccession = true,
    },
    {
      id: 'P9S Front Firestrikes',
      type: 'StartsUsing',
      netRegex: { id: '878E', source: 'Kokytos', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Charge => Stay',
          de: 'Sprung => Stehen bleiben',
          fr: 'Saut => Restez',
          ko: '돌진 => 가만히',
        },
      },
    },
    {
      id: 'P9S Rear Firestrikes',
      type: 'StartsUsing',
      netRegex: { id: '878F', source: 'Kokytos', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Charge => Run Through',
          de: 'Sprung => Geh durch den Boss',
          fr: 'Saut => Traversez le boss',
          ko: '돌진 => 가로지르기',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Aero IV/Fire IV': 'Aero/Fire IV',
        'Front Combination/Rear Combination': 'Front/Rear Combination',
        'Front Firestrikes/Rear Firestrikes': 'Front/Rear Firestrikes',
        'Inside Roundhouse/Outside Roundhouse': 'Inside/Outside Roundhouse',
        'Outside Roundhouse/Inside Roundhouse': 'Outside/Inside Roundhouse',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'Ball of Levin': 'Elektrosphäre',
        'Comet': 'Komet',
        'Kokytos(?!\')': 'Kokytos',
        'Kokytos\'s Echo': 'Phantom-Kokytos',
      },
      'replaceText': {
        '\\(Beast': '(Bestie',
        '\\(Chimera': '(Chimäre',
        '\\(Fighter': '(Kämpfer',
        '\\(Final\\)': '(Finale)',
        '\\(Mage': '(Magier',
        '\\(cast\\)': '(Wirken)',
        '\\(resolve\\)': '(Auflösen)',
        'Aero IV': 'Windka',
        'Archaic Demolish': 'Altes Demolieren',
        'Archaic Rockbreaker': 'Alte Erdspaltung',
        'Ascendant Fist': 'Steigende Faust',
        'Beastly Bile': 'Bestiengalle',
        'Beastly Fury': 'Animalischer Zorn',
        'Blizzard III': 'Eisga',
        'Burst': 'Zerschmetterung',
        'Charybdis': 'Charybdis',
        'Chimeric Succession': 'Chimärische Kombo',
        'Comet': 'Komet',
        'Disgorge': 'Seelenwende',
        'Disintegration': 'Auflösung',
        'Duality of Death': 'Dualer Tod',
        'Dualspell': 'Doppelspruch',
        'Ecliptic Meteor': 'Ekliptik-Meteor',
        'Fire IV': 'Feuka',
        'Fire(?!( |m|s))': 'Feuer',
        'Firemeld': 'Feuerbinder',
        'Front Combination': 'Trittfolge vor',
        'Front Firestrikes': 'Flammensalve vorne',
        'Gluttony\'s Augur': 'Omen der Fresssucht',
        'Ice(?!meld)': 'Eis',
        'Icemeld': 'Eisbinder',
        'Inside Roundhouse': 'Rundumtritt innen',
        'Levinstrike Summoning': 'Blitzrufung',
        'Outside Roundhouse': 'Rundumtritt außen',
        'Pile Pyre': 'Flammenhaufen',
        'Pyremeld': 'Pyrischer Puls',
        'Ravening': 'Seelenfresser',
        'Rear Combination': 'Trittfolge zurück',
        'Rear Firestrikes': 'Flammensalve hinten',
        'Scrambled Succession': 'Gemischte Kombo',
        'Shock(?!wave)': 'Entladung',
        'Shockwave': 'Schockwelle',
        'Soul Surge': 'Seelenschub',
        'Swinging Kick': 'Schwungattacke',
        'Thunder III': 'Blitzga',
        'Thunder(?!( |bolt))': 'Blitz',
        'Thunderbolt': 'Donnerkeil',
        'Two Minds': 'Zwei Seelen',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Ball of Levin': 'orbe de foudre',
        'Comet': 'Comète',
        'Kokytos(?!\')': 'Cocyte',
        'Kokytos\'s Echo': 'spectre de Cocyte',
      },
      'replaceText': {
        'Aero IV': 'Giga Vent',
        'Archaic Demolish': 'Démolition archaïque',
        'Archaic Rockbreaker': 'Briseur de rocs archaïque',
        'Ascendant Fist': 'Uppercut pénétrant',
        'Beastly Bile': 'Bile de bête',
        'Beastly Fury': 'Furie de bête',
        'Blizzard III': 'Méga Glace',
        'Burst': 'Éclatement',
        'Charybdis': 'Charybde',
        'Chimeric Succession': 'Combo chimérique',
        'Comet': 'Comète',
        'Disgorge': 'Renvoi d\'âme',
        'Disintegration': 'Désintégration',
        'Duality of Death': 'Mort double',
        'Dualspell': 'Double sort',
        'Ecliptic Meteor': 'Météore écliptique',
        'Fire IV': 'Giga Feu',
        'Fire(?!( |m|s))': 'Feu',
        'Firemeld': 'Impact de feu démoniaque',
        'Front Combination': 'Coups de pied pivotants avant en série',
        'Front Firestrikes': 'Coups enflammés avant en série',
        'Gluttony\'s Augur': 'Augure de gloutonnerie',
        'Icemeld': 'Impact de glace démoniaque',
        'Inside Roundhouse': 'Coup de pied pivotant intérieur',
        'Levinstrike Summoning': 'Invocation d\'éclairs',
        'Outside Roundhouse': 'Coup de pied pivotant extérieur',
        'Pile Pyre': 'Flammes empilées',
        'Pyremeld': 'Grand coup enflammé',
        'Ravening': 'Dévoration d\'âme',
        'Rear Combination': 'Coups de pied pivotants arrière en série',
        'Rear Firestrikes': 'Coups enflammés arrière en série',
        'Scrambled Succession': 'Combo mixte',
        'Shock(?!wave)': 'Décharge électrostatique',
        'Shockwave': 'Onde de choc',
        'Soul Surge': 'Déferlante d\'âme',
        'Swinging Kick': 'Demi-pivot',
        'Thunder III': 'Méga Foudre',
        'Thunder(?!( |bolt))': 'Foudre',
        'Thunderbolt': 'Éclair',
        'Two Minds': 'Double esprit démoniaque',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Ball of Levin': '雷球',
        'Comet': 'コメット',
        'Kokytos(?!\')': 'コキュートス',
        'Kokytos\'s Echo': 'コキュートスの幻影',
      },
      'replaceText': {
        'Aero IV': 'エアロジャ',
        'Archaic Demolish': '古式破砕拳',
        'Archaic Rockbreaker': '古式地烈斬',
        'Ascendant Fist': '穿昇拳',
        'Beastly Bile': 'ビーストバイル',
        'Beastly Fury': 'ビーストフューリー',
        'Blizzard III': 'ブリザガ',
        'Burst': '飛散',
        'Charybdis': 'ミールストーム',
        'Chimeric Succession': 'キメリックコンボ',
        'Comet': 'コメット',
        'Disgorge': 'ソウルリバース',
        'Disintegration': 'ディスインテグレーション',
        'Duality of Death': 'デストゥワイス',
        'Dualspell': 'ダブルスペル',
        'Ecliptic Meteor': 'エクリプスメテオ',
        'Fire IV': 'ファイジャ',
        'Fire(?!( |m|s))': 'ファイア',
        'Firemeld': '炎魔衝',
        'Front Combination': '前方連転脚',
        'Front Firestrikes': '前方炎連撃',
        'Gluttony\'s Augur': 'グラトニーズアーガー',
        'Icemeld': '氷魔衝',
        'Inside Roundhouse': '内転脚',
        'Levinstrike Summoning': 'サモンライトニング',
        'Outside Roundhouse': '外転脚',
        'Pile Pyre': 'パイリングフレイム',
        'Pyremeld': '重炎撃',
        'Ravening': '魂喰らい',
        'Rear Combination': '後方連転脚',
        'Rear Firestrikes': '後方炎連撃',
        'Scrambled Succession': 'ジャンブルコンボ',
        'Shock(?!wave)': '放電',
        'Shockwave': '衝撃波',
        'Soul Surge': 'ソウルサージ',
        'Swinging Kick': '旋身撃',
        'Thunder III': 'サンダガ',
        'Thunder(?!( |bolt))': 'サンダー',
        'Thunderbolt': 'サンダーボルト',
        'Two Minds': '憑魔双撃',
      },
    },
  ],
});
