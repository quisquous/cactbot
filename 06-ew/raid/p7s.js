// Due to changes introduced in patch 5.2, overhead markers now have a random offset
// added to their ID. This offset currently appears to be set per instance, so
// we can determine what it is from the first overhead marker we see.
// The first 1B marker in the encounter is an Hemitheos's Holy III stack marker (013E).
const firstHeadmarker = parseInt('013E', 16);
const getHeadmarkerId = (data, matches) => {
  // If we naively just check !data.decOffset and leave it, it breaks if the first marker is 013E.
  // (This makes the offset 0, and !0 is true.)
  if (typeof data.decOffset === 'undefined')
    data.decOffset = parseInt(matches.id, 16) - firstHeadmarker;
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
  // Majority of mechanics center around three circles:
  // NW at 0, NE at 2, South at 5
  // Map NW = 0, N = 1, ..., W = 7
  return (Math.round(5 - 4 * Math.atan2(x, y) / Math.PI) % 8);
};
// effect ids for inviolate purgation
const effectIdToOutputStringKey = {
  'CEE': 'spread',
  'D3F': 'spread',
  'D40': 'spread',
  'D41': 'spread',
  'CEF': 'stack',
  'D42': 'stack',
  'D43': 'stack',
  'D44': 'stack',
};
Options.Triggers.push({
  zoneId: ZoneId.AbyssosTheSeventhCircleSavage,
  timelineFile: 'p7s.txt',
  initData: () => ({
    fruitCount: 0,
    rootsCount: 0,
    tetherCollect: [],
    purgationDebuffs: { 'dps': {}, 'support': {} },
    purgationDebuffCount: 0,
    purgationEffectIndex: 0,
  }),
  triggers: [
    {
      id: 'P7S Headmarker Tracker',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({}),
      condition: (data) => data.decOffset === undefined,
      // Unconditionally set the first headmarker here so that future triggers are conditional.
      run: (data, matches) => {
        getHeadmarkerId(data, matches);
      },
    },
    {
      id: 'P7S Egg Tracker',
      // Collects combatantData of the eggs
      // combatant.BNpcNameID Mapping:
      //   11375 => Immature Io
      //   11376 => Immature Stymphalide
      //   11377 => Immature Minotaur
      // unhatchedEggs Mapping:
      //   0-5 are Minotaurs
      //   6-9 are Birds
      //   10-12 are Ios
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '7811', source: 'Agdistis', capture: false }),
      preRun: (data) => data.fruitCount = data.fruitCount + 1,
      delaySeconds: 0.5,
      promise: async (data) => {
        const fruitLocaleNames = {
          en: 'Forbidden Fruit',
          de: 'Frucht des Lebens',
          fr: 'Fruits de la vie',
        };
        // Select the Forbidden Fruits
        const combatantNameFruits = [fruitLocaleNames[data.parserLang] ?? fruitLocaleNames['en']];
        const combatantData = await callOverlayHandler({
          call: 'getCombatants',
          names: combatantNameFruits,
        });
        // if we could not retrieve combatant data, the
        // trigger will not work, so just resume promise here
        if (combatantData === null) {
          console.error(`Forbidden Fruit: null data`);
          return;
        }
        const combatantDataLength = combatantData.combatants.length;
        if (combatantDataLength < 13) {
          console.error(`Forbidden Fruit: expected at least 13 combatants got ${combatantDataLength}`);
          return;
        }
        // Sort the combatants for parsing its role in the encounter
        const sortCombatants = (a, b) => (a.ID ?? 0) - (b.ID ?? 0);
        const sortedCombatantData = combatantData.combatants.sort(sortCombatants);
        data.unhatchedEggs = sortedCombatantData;
      },
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          left: Outputs.left,
          right: Outputs.right,
          south: Outputs.south,
          twoPlatforms: {
            en: '${platform1} / ${platform2}',
            de: '${platform1} / ${platform2}',
            fr: '${platform1} / ${platform2}',
            ko: '${platform1} / ${platform2}',
          },
          orientation: {
            en: 'Line Bull: ${location}',
            de: 'Bullen-Linie: ${location}',
            fr: 'Taureau Ligne : ${location}',
            ko: '줄 달린 소: ${location}',
          },
          famineOrientation: {
            en: 'Minotaurs without Bird: ${location}',
            de: 'Minotauren ohne Vögel: ${location}',
            fr: 'Minotaure sans oiseau : ${location}',
            ko: '새 없는 곳: ${location}',
          },
          deathOrientation: {
            en: 'Lightning Bull: ${location}',
            de: 'Blitz-Bulle: ${location}',
            fr: 'Taureau éclair : ${location}',
            ko: '줄 안달린 소: ${location}',
          },
          warOrientation: {
            en: 'Bird with Minotaurs: ${location}',
            de: 'Vögel mit Minotauren : ${location}',
            fr: 'Oiseau sans Minotaure : ${location}',
            ko: '새 + 미노타우로스: ${location}',
          },
        };
        // Map of dirs to Platform locations
        // Note: Eggs may spawn in additional cardinals/intercardinals
        const dirToPlatform = {
          0: 'left',
          2: 'right',
          3: 'right',
          5: 'south',
          7: 'left',
        };
        // Platforms array used to filter for new platforms
        const platforms = ['right', 'left', 'south'];
        if (data.fruitCount === 1) {
          // Find location of the north-most bird
          // Forbidden Fruit 1 uses last two birds
          if (data.unhatchedEggs === undefined || data.unhatchedEggs[8] === undefined || data.unhatchedEggs[9] === undefined) {
            console.error(`Forbidden Fruit ${data.fruitCount}: Missing egg data.`);
            return;
          }
          const bird1 = data.unhatchedEggs[8];
          const bird2 = data.unhatchedEggs[9];
          // Lower PosY = more north
          const northBird = (bird1.PosY < bird2.PosY ? bird1 : bird2);
          // Check north bird's side
          if (northBird.PosX < 100)
            return { alertText: output.left() };
          return { alertText: output.right() };
        }
        if (data.fruitCount === 4 || data.fruitCount === 6) {
          // Check where bull is
          // Forbidden Fruit 4 and 6 use last bull
          if (data.unhatchedEggs === undefined || data.unhatchedEggs[12] === undefined) {
            console.error(`Forbidden Fruit ${data.fruitCount}: Missing egg data.`);
            return;
          }
          const bullDir = matchedPositionTo8Dir(data.unhatchedEggs[12]);
          const platform = dirToPlatform[bullDir];
          if (data.fruitCount === 4) {
            // Call out orientation based on bull's platform
            if (platform !== undefined)
              return { infoText: output.orientation({ location: output[platform]() }) };
          }
          if (data.fruitCount === 6) {
            // Callout where bull is not
            // Remove platform from platforms
            const newPlatforms = platforms.filter((val) => val !== platform);
            if (newPlatforms.length === 2) {
              const safePlatform1 = newPlatforms[0];
              const safePlatform2 = newPlatforms[1];
              if (safePlatform1 !== undefined && safePlatform2 !== undefined)
                return { infoText: output.twoPlatforms({ platform1: output[safePlatform1](), platform2: output[safePlatform2]() }) };
            }
          }
          console.error(`Forbidden Fruit ${data.fruitCount}: Invalid positions.`);
        }
        if (data.fruitCount === 10) {
          // Check where minotaurs are to determine middle bird
          // Forbidden Fruit 10 uses last two minotaurs
          if (data.unhatchedEggs === undefined || data.unhatchedEggs[4] === undefined || data.unhatchedEggs[5] === undefined) {
            console.error(`Forbidden Fruit ${data.fruitCount}: Missing egg data.`);
            return;
          }
          const minotaurDir1 = matchedPositionTo8Dir(data.unhatchedEggs[4]);
          const minotaurDir2 = matchedPositionTo8Dir(data.unhatchedEggs[5]);
          // Return if received bad data
          const validDirs = [1, 4, 6];
          if (!validDirs.includes(minotaurDir1) || !validDirs.includes(minotaurDir2)) {
            console.error(`Forbidden Fruit ${data.fruitCount}: Expected minotaurs at 1, 4, or 6. Got ${minotaurDir1} and ${minotaurDir2}.`);
            return;
          }
          // Add the two positions to calculate platform between
          // Minotaurs spawn at dirs 1 (N), 4 (SE), or 6 (SW)
          const bridgeDirsToPlatform = {
            5: 'right',
            7: 'left',
            10: 'south', // SE + SW
          };
          const platform = bridgeDirsToPlatform[minotaurDir1 + minotaurDir2];
          if (platform !== undefined)
            return { infoText: output.warOrientation({ location: output[platform]() }) };
        }
        if (data.fruitCount > 6 && data.fruitCount < 10) {
          // Check each location for bird, call out where there is no bird
          // Forbidden Fruit 7 - 10 use last two birds
          if (data.unhatchedEggs === undefined || data.unhatchedEggs[8] === undefined || data.unhatchedEggs[9] === undefined) {
            console.error(`Forbidden Fruit ${data.fruitCount}: Missing egg data.`);
            return;
          }
          const birdDir1 = matchedPositionTo8Dir(data.unhatchedEggs[8]);
          const birdDir2 = matchedPositionTo8Dir(data.unhatchedEggs[9]);
          const birdPlatform1 = dirToPlatform[birdDir1];
          const birdPlatform2 = dirToPlatform[birdDir2];
          // Remove platform from platforms
          const newPlatforms = platforms.filter((val) => val !== birdPlatform1 && val !== birdPlatform2);
          if (newPlatforms.length === 1) {
            const platform = newPlatforms[0];
            if (platform !== undefined) {
              switch (data.fruitCount) {
                case 7:
                  return { infoText: output[platform]() };
                case 8:
                  return { infoText: output.famineOrientation({ location: output[platform]() }) };
                case 9:
                  return { infoText: output.deathOrientation({ location: output[platform]() }) };
              }
            }
            console.error(`Forbidden Fruit ${data.fruitCount}: Invalid positions.`);
          }
        }
      },
    },
    {
      id: 'P7S Hemitheos\'s Holy III Healer Groups',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({}),
      suppressSeconds: 1,
      infoText: (data, matches, output) => {
        const correctedMatch = getHeadmarkerId(data, matches);
        if (correctedMatch === '013E')
          return output.healerGroups();
      },
      outputStrings: {
        healerGroups: Outputs.healerGroups,
      },
    },
    {
      id: 'P7S Condensed Aero II',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7836', source: 'Agdistis' }),
      response: Responses.sharedTankBuster(),
    },
    {
      id: 'P7S Dispersed Aero II',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7835', source: 'Agdistis', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Split Tankbusters',
          de: 'getrennte Tankbuster',
          fr: 'Séparez des Tankbusters',
          ja: '2人同時タンク強攻撃',
          ko: '따로맞는 탱버',
        },
      },
    },
    {
      id: 'P7S Bough of Attis Left Arrows',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7824', source: 'Agdistis', capture: false }),
      response: Responses.goLeft(),
    },
    {
      id: 'P7S Bough of Attis Right Arrows',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7823', source: 'Agdistis', capture: false }),
      response: Responses.goRight(),
    },
    {
      id: 'P7S Roots of Attis 3',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '780E', source: 'Agdistis', capture: false }),
      condition: (data) => data.rootsCount === 2,
      infoText: (_data, _matches, output) => output.baitSoon(),
      outputStrings: {
        baitSoon: {
          en: 'Bait on Empty Platform Soon',
          de: 'Bald auf freier Plattform ködern',
          fr: 'Déposez sur une plateforme vide bientôt',
          ja: '果実がない空きの円盤へ移動',
          ko: '빈 플랫폼에서 장판 유도 준비',
        },
      },
    },
    {
      id: 'P7S Roots of Attis 2',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '780E', source: 'Agdistis', capture: false }),
      condition: (data) => data.rootsCount === 1,
      infoText: (_data, _matches, output) => output.separateHealerGroups(),
      run: (data) => data.rootsCount = data.rootsCount + 1,
      outputStrings: {
        separateHealerGroups: {
          en: 'Healer Group Platforms',
          de: 'Heiler-Gruppen Plattformen',
          fr: 'Groupes heals Plateforme',
          ja: '円盤の内でヒーラーと頭割り',
          ko: '힐러 그룹별로 플랫폼',
        },
      },
    },
    {
      // First breaks north bridge for upcoming South Knockback Spreads
      // Second breaks remaining bridges, Separate Healer Groups
      // Third breaks all bridges, Bait on Empty Platform
      id: 'P7S Roots of Attis 1',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '780E', source: 'Agdistis', capture: false }),
      condition: (data) => data.rootsCount === 0,
      run: (data) => data.rootsCount = data.rootsCount + 1,
    },
    {
      id: 'P7S Hemitheos\'s Aero IV',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7A0B', source: 'Agdistis', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'P7S Immature Stymphalide Tether',
      type: 'Tether',
      netRegex: NetRegexes.tether({ id: '0011', source: 'Immature Stymphalide', capture: false }),
      // ~9s between tether and Bronze Bellows (no cast) in all cases.
      delaySeconds: 4,
      // Just give this to everyone.  People in towers or elsewhere can be safe.
      suppressSeconds: 1,
      response: Responses.knockback(),
    },
    {
      id: 'P7S Spark of Life',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7839', source: 'Agdistis', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'aoe + bleed',
          de: 'AoE + Blutung',
          fr: 'AoE + Saignement',
          ja: 'AOE + 出血',
          ko: '전체 공격 + 도트',
        },
      },
    },
    {
      id: 'P7S Inviolate Bonds',
      type: 'GainsEffect',
      // CEC/D45 = Inviolate Winds
      // CED/D56 = Holy Bonds
      netRegex: NetRegexes.gainsEffect({ effectId: ['CEC', 'D45'] }),
      condition: Conditions.targetIsYou(),
      durationSeconds: 20,
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          stackThenSpread: Outputs.stackThenSpread,
          spreadThenStack: Outputs.spreadThenStack,
        };
        // Store debuff for reminders
        data.bondsDebuff = (matches.effectId === 'CEC' ? 'spread' : 'stackMarker');
        const longTimer = parseFloat(matches.duration) > 9;
        if (longTimer)
          return { infoText: output.stackThenSpread() };
        return { infoText: output.spreadThenStack() };
      },
    },
    {
      id: 'P7S Forbidden Fruit 4 and Harvest Tethers',
      // 0001 Immature Minotaur Spike Tether
      // 0006 Immature Io (Bull) Tether
      // 0039 Immature Minotaur Tether
      // 0011 Immature Stymphalide (Bird) Tether
      // Forbidden Fruit 4: 4 Bull Tethers, 2 Minotaur Tethers, 1 Non-tethered Minotaur
      // Famine: 4 Minotaur Tethers, 2 Non-tethered Minotaurs, 2 Static Birds
      // Death: 2 Bulls with Tethers, 1 Bull casting Puddle AoE, 2 Static Birds
      // War: 4 Bull Tethers, 2 Minotaur Tethers, 2 Bird Tethers
      // TODO: Get locations with OverlayPlugin via X, Y and bird headings?
      type: 'Tether',
      netRegex: NetRegexes.tether({ id: ['0001', '0006', '0039', '0011'] }),
      condition: (data) => !data.stopTethers,
      preRun: (data, matches) => data.tetherCollect.push(matches.target),
      delaySeconds: 0.1,
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          bullTether: {
            en: 'Bull Tether (Line AoE)',
            de: 'Stier-Verbindung (Linien AoE)',
            fr: 'Lien Taureau (AoE en ligne)',
            ja: '牛から直線',
            ko: '소 (직선 장판)',
          },
          deathBullTether: {
            en: 'Bull Tether (Line AoE)',
            de: 'Stier-Verbindung (Linien AoE)',
            fr: 'Lien Taureau (AoE en ligne)',
            ja: '牛から直線',
            ko: '소 (직선 장판)',
          },
          warBullTether: {
            en: 'Bull Tether (Line AoE)',
            de: 'Stier-Verbindung (Linien AoE)',
            fr: 'Lien Taureau (AoE en ligne)',
            ja: '牛から直線',
            ko: '소 (직선 장판)',
          },
          minotaurTether: {
            en: 'Minotaur Tether (Big Cleave)',
            de: 'Minotaurus-Verbindung (Große Kegel-AoE)',
            fr: 'Lien Minotaure (Gros Cleave)',
            ja: 'ミノから扇',
            ko: '미노타우로스 (부채꼴 장판)',
          },
          famineMinotaurTether: {
            en: 'Cross Minotaur Tethers (Big Cleave)',
            de: 'Überkreuze Minotaurus-Verbindung (Große Kegel-AoE)',
            fr: 'Lien Minotaure en croix (Gros Cleave)',
            ja: 'ミノからの扇を交える',
            ko: '미노타우로스 선 교차하기 (부채꼴 장판)',
          },
          warMinotaurTether: {
            en: 'Minotaur Tether (Big Cleave)',
            de: 'Minotaurus-Verbindung (Große Kegel-AoE)',
            fr: 'Lien Minotaure (Gros Cleave)',
            ja: 'ミノから扇',
            ko: '미노타우로스 (부채꼴 장판)',
          },
          warBirdTether: {
            en: 'Bird Tether',
            de: 'Vogel-Verbindung',
            fr: 'Lien Oiseau',
            ja: '鳥から線',
            ko: '새',
          },
          noTether: {
            en: 'No Tether, Bait Minotaur Cleave (Middle)',
            de: 'Keine Verbindung, Minotaurus-Verbindung ködern (Mitte)',
            fr: 'Aucun lien, encaissez le cleave du Minotaure (Milieu)',
            ja: '線なし、中央で扇を誘導',
            ko: '선 없음, 미노타우로스 유도 (중앙)',
          },
          famineNoTether: {
            en: 'No Tether, Bait Minotaur Cleave',
            de: 'Keine Verbindung, Minotaurus-Verbindung ködern',
            fr: 'Aucun lien, encaissez le cleave du Minotaure',
            ja: '線なし、ミノからの扇を誘導',
            ko: '선 없음, 미노타우로스 유도',
          },
        };
        if (data.me === matches.target) {
          // Bull Tethers
          if (matches.id === '0006') {
            if (data.tetherCollectPhase === 'death')
              return { infoText: output.deathBullTether() };
            if (data.tetherCollectPhase === 'war')
              return { infoText: output.warBullTether() };
            return { infoText: output.bullTether() };
          }
          // Minotaur Tethers
          if (matches.id === '0001' || matches.id === '0039') {
            if (data.tetherCollectPhase === 'famine')
              return { infoText: output.famineMinotaurTether() };
            if (data.tetherCollectPhase === 'war')
              return { infoText: output.warMinotaurTether() };
            return { infoText: output.minotaurTether() };
          }
          // Bird Tethers
          if (matches.id === '0011')
            return { infoText: output.warBirdTether() };
        }
        // No Tethers
        if (!data.tetherCollect.includes(data.me)) {
          // Prevent duplicate callout
          data.tetherCollect.push(data.me);
          if (!data.tetherCollectPhase)
            return { infoText: output.noTether() };
          if (data.tetherCollectPhase === 'famine')
            return { alertText: output.famineNoTether() };
        }
      },
    },
    {
      id: 'P7S Forbidden Fruit 4 and Harvest Stop Collection',
      // 0001 Tether also goes off on players that get 0039 Tethers which leads
      // to 0039 possibly reapplying. This trigger is used to only collect tethers
      // during a defined window.
      type: 'Tether',
      netRegex: NetRegexes.tether({ id: ['0006', '0039'], capture: false }),
      delaySeconds: 0.2,
      suppressSeconds: 6,
      run: (data) => data.stopTethers = true,
    },
    {
      id: 'P7S Harvest Phase Tracker',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['7A4F', '7A50', '7A51'] }),
      run: (data, matches) => {
        data.stopTethers = false;
        data.tetherCollect = [];
        switch (matches.id) {
          case '7A4F':
            data.tetherCollectPhase = 'famine';
            break;
          case '7A50':
            data.tetherCollectPhase = 'death';
            break;
          case '7A51':
            data.tetherCollectPhase = 'war';
            break;
        }
      },
    },
    {
      id: 'P7S Inviolate Bonds Reminders',
      // First trigger is ~4s after debuffs callout
      // These happen 6s before cast
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({}),
      suppressSeconds: 1,
      infoText: (data, matches, output) => {
        const correctedMatch = getHeadmarkerId(data, matches);
        if (correctedMatch === '00A6' && data.purgationDebuffCount === 0 && data.bondsDebuff)
          return output[data.bondsDebuff]();
      },
      run: (data) => data.bondsDebuff = (data.bondsDebuff === 'spread' ? 'stackMarker' : 'spread'),
      outputStrings: {
        spread: Outputs.spread,
        stackMarker: Outputs.stackMarker,
      },
    },
    {
      id: 'P7S Inviolate Purgation',
      type: 'GainsEffect',
      // CEE = Purgatory Winds I
      // D3F = Purgatory Winds II
      // D40 = Purgatory Winds III
      // D41 = Purgatory Winds IV
      // CEF = Holy Purgation I
      // D42 = Holy Purgation II
      // D43 = Holy Purgation III
      // D44 = Holy Purgation IV
      netRegex: NetRegexes.gainsEffect({ effectId: ['CE[EF]', 'D3F', 'D4[01234]'] }),
      preRun: (data, matches) => {
        data.purgationDebuffCount += 1;
        const role = data.party.isDPS(matches.target) ? 'dps' : 'support';
        const debuff = data.purgationDebuffs[role];
        if (!debuff)
          return;
        debuff[matches.effectId.toUpperCase()] = parseFloat(matches.duration);
      },
      durationSeconds: 55,
      infoText: (data, _matches, output) => {
        if (data.purgationDebuffCount !== 20)
          return;
        // Sort effects ascending by duration
        const role = data.role === 'dps' ? 'dps' : 'support';
        const unsortedDebuffs = Object.keys(data.purgationDebuffs[role] ?? {});
        const sortedDebuffs = unsortedDebuffs.sort((a, b) => (data.purgationDebuffs[role]?.[a] ?? 0) - (data.purgationDebuffs[role]?.[b] ?? 0));
        // get stack or spread from effectId
        const effects = sortedDebuffs.map((effectId) => effectIdToOutputStringKey[effectId]);
        const [effect1, effect2, effect3, effect4] = effects;
        if (!effect1 || !effect2 || !effect3 || !effect4)
          throw new UnreachableCode();
        // Store effects for reminders later
        data.purgationEffects = [effect1, effect2, effect3, effect4];
        return output.comboText({
          effect1: output[effect1](),
          effect2: output[effect2](),
          effect3: output[effect3](),
          effect4: output[effect4](),
        });
      },
      outputStrings: {
        comboText: {
          en: '${effect1} => ${effect2} => ${effect3} => ${effect4}',
          de: '${effect1} => ${effect2} => ${effect3} => ${effect4}',
          fr: '${effect1} => ${effect2} => ${effect3} => ${effect4}',
          ja: '${effect1} => ${effect2} => ${effect3} => ${effect4}',
          ko: '${effect1} => ${effect2} => ${effect3} => ${effect4}',
        },
        spread: Outputs.spread,
        stack: Outputs.stackMarker,
      },
    },
    {
      id: 'P7S Inviolate Purgation Reminders',
      // First trigger is ~4s after debuffs callout
      // These happen 6s before cast
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({}),
      suppressSeconds: 1,
      infoText: (data, matches, output) => {
        // Return if we are missing effects
        if (data.purgationEffects === undefined)
          return;
        const correctedMatch = getHeadmarkerId(data, matches);
        if (correctedMatch === '00A6' && data.purgationDebuffCount !== 0) {
          const text = data.purgationEffects[data.purgationEffectIndex];
          data.purgationEffectIndex = data.purgationEffectIndex + 1;
          if (text === undefined)
            return;
          return output[text]();
        }
      },
      outputStrings: {
        spread: Outputs.spread,
        stack: Outputs.stackMarker,
      },
    },
    {
      id: 'P7S Light of Life',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '78E2', source: 'Agdistis', capture: false }),
      // ~5s castTime, but boss cancels it and ability goes off 26s after start
      delaySeconds: 21,
      alertText: (_data, _matches, output) => output.bigAoEMiddle(),
      outputStrings: {
        bigAoEMiddle: {
          en: 'Big AOE, Get Middle',
          de: 'Große AoE, geh in die Mitte',
          fr: 'Grosse AoE, allez au milieu',
          ja: '強力なAOE、真ん中へ',
          cn: '超大伤害，去中间',
          ko: '아픈 광뎀, 중앙으로',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Condensed Aero II/Dispersed Aero II': 'Condensed/Dispersed Aero II',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'Agdistis': 'Agdistis',
        'Immature Io': 'unreif(?:e|er|es|en) Io',
        'Immature Minotaur': 'unreif(?:e|er|es|en) Minotaurus',
        'Immature Stymphalide': 'unreif(?:e|er|es|en) Stymphalides',
      },
      'replaceText': {
        '--chasing aoe--': '--verfolgende AoEs--',
        '--eggs--': '--Eier--',
        'arrow': 'Pfeil',
        'close': 'Nahe',
        'far': 'Entfernt',
        'Blades of Attis': 'Schwertblatt des Attis',
        'Bough of Attis': 'Ast des Attis',
        'Bronze Bellows': 'Böenschlag',
        'Bullish Slash': 'Bullenansturm',
        'Bullish Swipe': 'Bullenfeger',
        'Condensed Aero II': 'Gehäuftes Windra',
        'Death\'s Harvest': 'Unheilvolle Wucherung des Lebens',
        'Dispersed Aero II': 'Flächiges Windra',
        'Famine\'s Harvest': 'Wilde Wucherung des Lebens',
        'Forbidden Fruit': 'Frucht des Lebens',
        'Hemitheos\'s Aero III': 'Hemitheisches Windga',
        'Hemitheos\'s Aero IV': 'Hemitheisches Windka',
        'Hemitheos\'s Glare(?! III)': 'Hemitheische Blendung',
        'Hemitheos\'s Glare III': 'Hemitheisches Blendga',
        'Hemitheos\'s Holy(?! III)': 'Hemitheisches Sanctus',
        'Hemitheos\'s Holy III': 'Hemitheisches Sanctga',
        'Hemitheos\'s Tornado': 'Hemitheischer Tornado',
        'Immortal\'s Obol': 'Zweig des Lebens und des Todes',
        'Inviolate Bonds': 'Siegelschaffung',
        'Inviolate Purgation': 'Siegelschaffung der Hölle',
        'Light of Life': 'Aurora des Lebens',
        'Multicast': 'Multizauber',
        'Roots of Attis': 'Wurzel des Attis',
        'Shadow of Attis': 'Lichttropfen des Attis',
        'Spark of Life': 'Schein des Lebens',
        'Static Path': 'Statischer Pfad',
        'Stymphalian Strike': 'Vogelschlag',
        'War\'s Harvest': 'Chaotische Wucherung des Lebens',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Agdistis': 'Agdistis',
        'Immature Io': 'Io immature',
        'Immature Minotaur': 'Minotaure immature',
        'Immature Stymphalide': 'Stymphalide immature',
      },
      'replaceText': {
        'Blades of Attis': 'Lames d\'Attis',
        'Bough of Attis': 'Grandes branches d\'Attis',
        'Bronze Bellows': 'Frappe rafale',
        'Bullish Slash': 'Taillade catabatique',
        'Bullish Swipe': 'Balayage catabatique',
        'Condensed Aero II': 'Extra Vent concentré',
        'Death\'s Harvest': 'Bourgeonnement de vie morbide',
        'Dispersed Aero II': 'Extra vent étendu',
        'Famine\'s Harvest': 'Bourgeonnement de vie féroce',
        'Forbidden Fruit': 'Fruits de la vie',
        'Hemitheos\'s Aero III': 'Méga Vent d\'hémithéos',
        'Hemitheos\'s Aero IV': 'Giga Vent d\'hémithéos',
        'Hemitheos\'s Glare(?! III)': 'Chatoiement d\'hémithéos',
        'Hemitheos\'s Glare III': 'Méga Chatoiement d\'hémithéos',
        'Hemitheos\'s Holy(?! III)': 'Miracle d\'hémithéos',
        'Hemitheos\'s Holy III': 'Méga Miracle d\'hémithéos',
        'Hemitheos\'s Tornado': 'Tornade d\'hémithéos',
        'Immortal\'s Obol': 'Branche de vie et de mort',
        'Inviolate Bonds': 'Tracé de sigil',
        'Inviolate Purgation': 'Tracé de sigils multiples',
        'Light of Life': 'Éclair de vie',
        'Multicast': 'Multisort',
        'Roots of Attis': 'Racines d\'Attis',
        'Shadow of Attis': 'Rai d\'Attis',
        'Spark of Life': 'Étincelle de vie',
        'Static Path': 'Chemin statique',
        'Stymphalian Strike': 'Assaut stymphalide',
        'War\'s Harvest': 'Bourgeonnement de vie chaotique',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Agdistis': 'アグディスティス',
        'Immature Io': 'イマチュア・イーオー',
        'Immature Minotaur': 'イマチュア・タウロス',
        'Immature Stymphalide': 'イマチュア・ステュムパリデス',
      },
      'replaceText': {
        'Blades of Attis': 'アッティスの刃葉',
        'Bough of Attis': 'アッティスの巨枝',
        'Bronze Bellows': 'ガストストライク',
        'Bullish Slash': 'ブルスラッシュ',
        'Bullish Swipe': 'ブルスワイプ',
        'Condensed Aero II': 'アグリゲート・エアロラ',
        'Death\'s Harvest': '生命の繁茂【凶】',
        'Dispersed Aero II': 'スプレッド・エアロラ',
        'Famine\'s Harvest': '生命の繁茂【猛】',
        'Forbidden Fruit': '生命の果実',
        'Hemitheos\'s Aero III': 'ヘーミテオス・エアロガ',
        'Hemitheos\'s Aero IV': 'ヘーミテオス・エアロジャ',
        'Hemitheos\'s Glare(?! III)': 'ヘーミテオス・グレア',
        'Hemitheos\'s Glare III': 'ヘーミテオス・グレアガ',
        'Hemitheos\'s Holy(?! III)': 'ヘーミテオス・ホーリー',
        'Hemitheos\'s Holy III': 'ヘーミテオス・ホーリガ',
        'Hemitheos\'s Tornado': 'ヘーミテオス・トルネド',
        'Immortal\'s Obol': '生滅の導枝',
        'Inviolate Bonds': '魔印創成',
        'Inviolate Purgation': '魔印創成・獄',
        'Light of Life': '生命の極光',
        'Multicast': 'マルチキャスト',
        'Roots of Attis': 'アッティスの根',
        'Shadow of Attis': 'アッティスの光雫',
        'Spark of Life': '生命の光芒',
        'Static Path': 'スタティックパース',
        'Stymphalian Strike': 'バードストライク',
        'War\'s Harvest': '生命の繁茂【乱】',
      },
    },
  ],
});
