// TODO: find network lines for Yozakura Seal of Riotous Bloom arrows (nothing in network logs)
// TODO: find network lines for Enenra Out of the Smoke (nothing in network logs)
// TODO: Yozakura Seasons of the Fleeting
//       you would need to track 8384 (pinwheel) and 8383 (line) *abilities* (not incorrect casts)
//       and use their positions and rotations to know whether to say front/back/card/intercard
//       she repositions beforehand, so front/back of her is a known safe position.
// TODO: Moko safe spots for Iron Rain
// TODO: Gorai path 06 Humble Hammer safe spots for which Ball of Levin hit by Humble Hammer
// TODO: Shishio Rokujo calls ("go SW, clockwise") kinda thing
const sealMap = {
  '837A': 'fire',
  '837B': 'wind',
  '837C': 'thunder',
  '837D': 'rain',
};
const sealDamageMap = {
  '8375': 'fire',
  '8376': 'wind',
  '8377': 'rain',
  '8378': 'thunder',
};
const sealIds = Object.keys(sealMap);
const sealDamageIds = Object.keys(sealDamageMap);
const mokoVfxMap = {
  '248': 'back',
  '249': 'left',
  '24A': 'front',
  '24B': 'right',
};
Options.Triggers.push({
  id: 'MountRokkon',
  zoneId: ZoneId.MountRokkon,
  timelineFile: 'mount_rokkon.txt',
  initData: () => {
    return {
      combatantData: [],
      yozakuraSeal: [],
      yozakuraTatami: [],
      enenraPipeCleanerCollect: [],
      devilishThrallCollect: [],
    };
  },
  triggers: [
    // --------- Yozakura the Fleeting ----------
    {
      id: 'Rokkon Yozakura Glory Neverlasting',
      type: 'StartsUsing',
      netRegex: { id: '83A9', source: 'Yozakura the Fleeting' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Rokkon Yozakura Art of the Windblossom',
      type: 'StartsUsing',
      netRegex: { id: '8369', source: 'Yozakura the Fleeting', capture: false },
      response: Responses.getIn('info'),
    },
    {
      id: 'Rokkon Yozakura Art of the Fireblossom',
      type: 'StartsUsing',
      netRegex: { id: '8368', source: 'Yozakura the Fleeting', capture: false },
      response: Responses.getOut('info'),
    },
    {
      id: 'Rokkon Yozakura Shadowflight',
      type: 'StartsUsing',
      netRegex: { id: '8380', source: 'Mirrored Yozakura', capture: false },
      response: Responses.moveAway(),
    },
    {
      id: 'Rokkon Yozakura Kuge Rantsui',
      type: 'StartsUsing',
      netRegex: { id: '83AA', source: 'Yozakura the Fleeting', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Rokkon Yozakura Drifting Petals',
      type: 'StartsUsing',
      netRegex: { id: '8393', source: 'Yozakura the Fleeting', capture: false },
      alertText: (_data, _matches, output) => output.knockback(),
      outputStrings: {
        knockback: {
          en: 'Unavoidable Knockback',
          de: 'Unvermeidbarer Rückstoß',
          fr: 'Poussée inévitable',
          ja: '避けないノックバック',
          cn: '击退 (防击退无效)',
          ko: '넉백 방지 불가',
        },
      },
    },
    {
      id: 'Rokkon Yozakura Seal Collect',
      type: 'Ability',
      netRegex: { id: sealIds, source: 'Yozakura the Fleeting' },
      run: (data, matches) => {
        // Collect flowers as they appear.
        // TODO: there are no network lines for which ones are active.
        // So we do the best we can, which is:
        // * show an alert for the first set (with only two)
        // * show nothing on the first pair of further sets (this is probably confusing to players)
        // * by process of elimination show the second pair on further sets
        const looseSealMap = sealMap;
        const seal = looseSealMap[matches.id];
        if (seal !== undefined)
          data.yozakuraSeal.push(seal);
      },
    },
    {
      id: 'Rokkon Yozakura Seal of Riotous Bloom',
      type: 'StartsUsing',
      netRegex: { id: '8374', source: 'Yozakura the Fleeting', capture: false },
      alertText: (data, _matches, output) => {
        // If we know what this is, show something. Otherwise, sorry.
        if (data.yozakuraSeal.length !== 2)
          return;
        const isIn = data.yozakuraSeal.includes('wind');
        const isCardinals = data.yozakuraSeal.includes('rain');
        if (isIn && isCardinals)
          return output.inAndCards();
        if (isIn && !isCardinals)
          return output.inAndIntercards();
        if (!isIn && isCardinals)
          return output.outAndCards();
        if (!isIn && !isCardinals)
          return output.outAndIntercards();
      },
      outputStrings: {
        inAndCards: {
          en: 'In + Cardinals',
          de: 'Rein + Kardinal',
          fr: 'Intérieur + Cardinal',
          cn: '内 + 十字',
          ko: '안 + 십자방향',
        },
        outAndCards: {
          en: 'Out + Cardinals',
          de: 'Raus + Kardinal',
          fr: 'Extérieur + Cardinal',
          cn: '外 + 十字',
          ko: '밖 + 십자방향',
        },
        inAndIntercards: {
          en: 'In + Intercards',
          de: 'Rein + Interkardinal',
          fr: 'Intérieur + Intercardinal',
          cn: '内 + 对角',
          ko: '안 + 대각선',
        },
        outAndIntercards: {
          en: 'Out + Intercards',
          de: 'Raus + Interkardinal',
          fr: 'Extérieur + Intercardinal',
          cn: '外 + 对角',
          ko: '밖 + 대각선',
        },
      },
    },
    {
      id: 'Rokkon Yozakura Seal Damage Collect',
      type: 'StartsUsing',
      netRegex: { id: sealDamageIds, source: 'Yozakura the Fleeting' },
      run: (data, matches) => {
        // Remove abilities that have happened so we can know the second pair.
        const seal = sealDamageMap[matches.id];
        data.yozakuraSeal = data.yozakuraSeal.filter((x) => x !== seal);
      },
    },
    {
      id: 'Rokkon Yozakura Art of the Fluff',
      type: 'StartsUsing',
      netRegex: { id: '839E', source: 'Shiromaru' },
      alertText: (_data, matches, output) => {
        const xPos = parseFloat(matches.x);
        // center = 737
        // east = 765
        // west = 709
        if (xPos > 737)
          return output.lookWest();
        return output.lookEast();
      },
      outputStrings: {
        lookWest: {
          en: 'Look West',
          de: 'Schau nach Westen',
          fr: 'Regardez à l\'Ouest',
          cn: '看西侧',
          ko: '서쪽 보기',
        },
        lookEast: {
          en: 'Look East',
          de: 'Schau nach Osten',
          fr: 'Regardez à l\'Est',
          cn: '看东侧',
          ko: '동쪽 보기',
        },
      },
    },
    {
      id: 'Rokkon Yozakura Tatami Collect',
      type: 'MapEffect',
      // 00020001 = shake
      // 00080004 = go back to normal
      // 80038CA2 = flip
      netRegex: { flags: '00020001' },
      run: (data, matches) => data.yozakuraTatami.push(matches.location),
    },
    {
      id: 'Rokkon Yozakura Tatami-gaeshi',
      type: 'StartsUsing',
      netRegex: { id: '8395', source: 'Yozakura the Fleeting', capture: false },
      alertText: (data, _matches, output) => {
        const map = {
          '37': 'outsideNorth',
          '38': 'insideNorth',
          '39': 'insideSouth',
          '3A': 'outsideSouth',
        };
        for (const location of data.yozakuraTatami)
          delete map[location];
        // Call inside before outside.
        const callOrder = ['38', '39', '37', '3A'];
        for (const key of callOrder) {
          const outputKey = map[key];
          if (outputKey !== undefined)
            return output[outputKey]();
        }
      },
      run: (data) => data.yozakuraTatami = [],
      outputStrings: {
        outsideNorth: {
          en: 'Outside North',
          de: 'Nördlich außen',
          fr: 'Extérieur Nord',
          cn: '外北',
          ko: '북쪽 바깥',
        },
        insideNorth: {
          en: 'Inside North',
          de: 'Nördlich innen',
          fr: 'Intérieur Nord',
          cn: '内北',
          ko: '북쪽 안',
        },
        insideSouth: {
          en: 'Inside South',
          de: 'Südlich innen',
          fr: 'Intérieur Sud',
          cn: '内南',
          ko: '남쪽 안',
        },
        outsideSouth: {
          en: 'Outside South',
          de: 'Südlich außen',
          fr: 'Extérieur Sud',
          cn: '外南',
          ko: '남쪽 바깥',
        },
      },
    },
    {
      id: 'Rokkon Yozakura Root Arrangement',
      type: 'HeadMarker',
      netRegex: { id: '00C5' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: '4x Chasing AOE on YOU',
          de: '4x verfolgende AoE auf DIR',
          fr: '4x AoE sur VOUS',
          cn: '四连 AOE 点名',
          ko: '따라오는 장판 4번',
        },
      },
    },
    // --------- Moko the Restless ----------
    {
      id: 'Rokkon Moko Kenki Release',
      type: 'StartsUsing',
      netRegex: { id: '85AD', source: 'Moko the Restless', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Rokkon Moko Scarlet Auspice',
      type: 'StartsUsing',
      netRegex: { id: '8598', source: 'Moko the Restless', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'Rokkon Moko Azure Auspice',
      type: 'StartsUsing',
      netRegex: { id: '859C', source: 'Moko the Restless', capture: false },
      response: Responses.getIn(),
    },
    {
      id: 'Rokkon Moko Double Kasumi-Giri Checker',
      type: 'StartsUsing',
      // This cast comes out prior to the BA9 vfx.
      netRegex: { id: '858[BCDE]', source: 'Moko the Restless', capture: false },
      run: (data) => data.isDoubleKasumiGiri = true,
    },
    {
      id: 'Rokkon Moko Iai-kasumi-giri',
      type: 'GainsEffect',
      netRegex: { effectId: 'B9A', count: Object.keys(mokoVfxMap) },
      condition: (data) => !data.isDoubleKasumiGiri,
      alertText: (_data, matches, output) => {
        const map = mokoVfxMap;
        const thisAbility = map[matches.count];
        if (thisAbility === undefined)
          return;
        return output[thisAbility]();
      },
      outputStrings: {
        back: Outputs.back,
        front: Outputs.front,
        left: Outputs.left,
        right: Outputs.right,
      },
    },
    {
      id: 'Rokkon Moko Double Kasumi-giri Second',
      type: 'GainsEffect',
      netRegex: { effectId: 'B9A', count: Object.keys(mokoVfxMap) },
      condition: (data) => data.isDoubleKasumiGiri && data.firstKasumiGiri !== undefined,
      durationSeconds: 6,
      alertText: (data, matches, output) => {
        const map = mokoVfxMap;
        const thisAbility = map[matches.count];
        if (thisAbility === undefined)
          return;
        const firstDir = data.firstKasumiGiri;
        if (firstDir === undefined)
          return;
        const dir1 = output[firstDir]();
        const secondMap = {
          front: output.through(),
          back: output.stay(),
          left: output.rotateLeft(),
          right: output.rotateRight(),
        };
        const dir2 = secondMap[thisAbility];
        return output.combo({ dir1: dir1, dir2: dir2 });
      },
      run: (data) => {
        delete data.firstKasumiGiri;
        delete data.isDoubleKasumiGiri;
      },
      outputStrings: {
        back: Outputs.back,
        front: Outputs.front,
        left: Outputs.left,
        right: Outputs.right,
        through: {
          en: 'Run Through',
          de: 'Renn durch',
          fr: 'Traversez',
          cn: '穿',
          ko: '가로지르기',
        },
        stay: {
          en: 'Stay',
          de: 'Stehen bleiben',
          fr: 'Restez',
          cn: '停',
          ko: '그대로',
        },
        rotateLeft: {
          en: 'Rotate Left',
          de: 'Links rotieren',
          fr: 'Tournez vers la gauche',
          cn: '逆时针旋转',
          ko: '왼쪽으로',
        },
        rotateRight: {
          en: 'Rotate Right',
          de: 'Rechts rotieren',
          fr: 'Tourner vers la droite',
          cn: '顺时针旋转',
          ko: '오른쪽으로',
        },
        combo: {
          en: '${dir1} => ${dir2}',
          de: '${dir1} => ${dir2}',
          cn: '${dir1} => ${dir2}',
          ko: '${dir1} => ${dir2}',
        },
      },
    },
    {
      id: 'Rokkon Moko Double Kasumi-giri First',
      type: 'GainsEffect',
      netRegex: { effectId: 'B9A', count: Object.keys(mokoVfxMap) },
      condition: (data) => data.isDoubleKasumiGiri && data.firstKasumiGiri === undefined,
      infoText: (data, matches, output) => {
        const map = mokoVfxMap;
        const thisAbility = map[matches.count];
        if (thisAbility === undefined)
          return;
        data.firstKasumiGiri = thisAbility;
        return output.text({ dir: output[thisAbility]() });
      },
      outputStrings: {
        text: {
          en: '(${dir} First)',
          de: '(${dir} Zuerst)',
          fr: '(${dir} en 1er)',
          cn: '(首先${dir})',
          ko: '(${dir} 먼저)',
        },
        back: Outputs.back,
        front: Outputs.front,
        left: Outputs.left,
        right: Outputs.right,
        combo: {
          en: '${dir1} => ${dir2}',
          de: '${dir1} => ${dir2}',
          cn: '${dir1} => ${dir2}',
          ko: '${dir1} => ${dir2}',
        },
      },
    },
    // --------- Gorai the Uncaged ----------
    {
      id: 'Rokkon Gorai Unenlightemnment',
      type: 'StartsUsing',
      netRegex: { id: '8500', source: 'Gorai the Uncaged', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Rokkon Gorai Fighting Spirits',
      type: 'StartsUsing',
      netRegex: { id: '84F8', source: 'Gorai the Uncaged', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Rokkon Gorai Biwa Breaker',
      type: 'StartsUsing',
      netRegex: { id: '84FD', source: 'Gorai the Uncaged', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Rokkon Gorai Torching Torment',
      type: 'StartsUsing',
      netRegex: { id: '84FE', source: 'Gorai the Uncaged' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Rokkon Gorai Summon Collect',
      type: 'StartsUsing',
      // 84D5 = Flickering Flame
      // 84D6 = Sulphuric Stone
      // 84D7 = Flame and Sulphur
      netRegex: { id: ['84D5', '84D6', '84D7'], source: 'Gorai the Uncaged' },
      run: (data, matches) => data.goraiSummon = matches,
    },
    {
      id: 'Rokkon Gorai Plectrum of Power',
      type: 'StartsUsing',
      netRegex: { id: '84D8', source: 'Gorai the Uncaged', capture: false },
      alertText: (data, _matches, output) => {
        const id = data.goraiSummon?.id;
        if (id === '84D5')
          return output.lines();
        if (id === '84D6')
          return output.rocks();
        if (id === '84D7')
          return output.both();
      },
      run: (data) => delete data.goraiSummon,
      outputStrings: {
        lines: {
          en: 'Avoid Expanding Lines',
          de: 'Weiche den expandierenden Linien aus',
          fr: 'Évitez les lignes qui s\'étendent',
          cn: '远离扩张的线',
          ko: '커지는 직선 장판 피하기',
        },
        rocks: {
          en: 'Avoid Expanding Rocks',
          de: 'Weiche den expandierenden Steinen aus',
          fr: 'Évitez les rochers qui s\'étendent',
          cn: '远离变大的石头',
          ko: '커지는 바위 장판 피하기',
        },
        both: {
          en: 'Avoid Expanding Rocks/Lines',
          de: 'Weiche den expandierenden Steinen/Linien aus',
          fr: 'Évitez les rochers/lignes qui s\'étendent',
          cn: '远离扩张的线 + 石头',
          ko: '커지는 직선/바위 장판 피하기',
        },
      },
    },
    {
      id: 'Rokkon Gorai Morphic Melody',
      type: 'StartsUsing',
      netRegex: { id: '84D9', source: 'Gorai the Uncaged', capture: false },
      alertText: (data, _matches, output) => {
        const id = data.goraiSummon?.id;
        if (id === '84D5')
          return output.lines();
        if (id === '84D6')
          return output.rocks();
        if (id === '84D7')
          return output.both();
      },
      run: (data) => delete data.goraiSummon,
      outputStrings: {
        lines: Outputs.goIntoMiddle,
        rocks: {
          en: 'Stand on Rock',
          de: 'Steh auf einem Stein',
          fr: 'Restez sur le rocher',
          cn: '站在石头上',
          ko: '바위 위에 있기',
        },
        both: {
          en: 'Stand on Rock + Line',
          de: 'Steh auf einem Stein + Linie',
          fr: 'Restez sur le rocher + la ligne',
          cn: '站在石头+线上',
          ko: '바위 + 직선장판 위에 있기',
        },
      },
    },
    {
      id: 'Rokkon Gorai Malformed Prayer',
      type: 'StartsUsing',
      netRegex: { id: '84E1', source: 'Gorai the Uncaged', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Stand in All Towers',
          de: 'Steh in allen Türmen',
          fr: 'Restez dans les tours',
          cn: '站在塔里',
          ko: '모든 기둥 밟기',
        },
      },
    },
    // --------- Shishio ----------
    {
      id: 'Rokkon Shishio Enkyo',
      type: 'StartsUsing',
      netRegex: { id: '83F5', source: 'Shishio', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Rokkon Shishio Splitting Cry',
      type: 'StartsUsing',
      netRegex: { id: '83F6', source: 'Shishio' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Rokkon Shishio Noble Pursuit',
      type: 'StartsUsing',
      netRegex: { id: '83E6', source: 'Shishio', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Between Rings + Outside Line',
          de: 'Zwischen Ringen + äußere Linie',
          fr: 'Entre les anneaux + Extérieur des lignes',
          cn: '内环 + 外线',
          ko: '고리들 사이 + 바깥',
        },
      },
    },
    {
      id: 'Rokkon Shishio Thunder Vortex',
      type: 'StartsUsing',
      netRegex: { id: '83F4', source: 'Shishio', capture: false },
      response: Responses.getUnder(),
    },
    {
      id: 'Rokkon Shishio Devilish Thrall Collect',
      type: 'StartsUsing',
      // 83F0 = Right Swipe
      // 83F1 = Left Swipe
      netRegex: { id: ['83F0', '83F1'], source: 'Devilish Thrall' },
      run: (data, matches) => data.devilishThrallCollect.push(matches),
    },
    {
      id: 'Rokkon Shishio Devilish Thrall Safe Spot',
      type: 'StartsUsing',
      netRegex: { id: ['83F0', '83F1'], source: 'Devilish Thrall', capture: false },
      delaySeconds: 0.5,
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
        const centerX = -40;
        const centerY = -300;
        // Cardinal thralls:
        //   x = -40 +/- 12
        //   y = -300 +/- 12
        //   heading = cardinals (pi/2 * n)
        // Variant Dungeon seems (at least in two pulls) to only have thralls
        // on cardinals, however handle a potential intercard thralls just in case.
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
        // The one case where the difference is 6 instead of 2.
        const averagePos = (pos1 === 0 && pos2 === 6) ? 7 : Math.floor((pos2 + pos1) / 2);
        return {
          0: output.north(),
          1: output.northeast(),
          2: output.east(),
          3: output.southeast(),
          4: output.south(),
          5: output.southwest(),
          6: output.west(),
          7: output.northwest(),
        }[averagePos];
      },
      run: (data) => data.devilishThrallCollect = [],
      outputStrings: {
        north: Outputs.north,
        east: Outputs.east,
        south: Outputs.south,
        west: Outputs.west,
        northeast: Outputs.northeast,
        southeast: Outputs.southeast,
        southwest: Outputs.southwest,
        northwest: Outputs.northwest,
      },
    },
    // --------- Enenra ----------
    {
      id: 'Rokkon Enenra Flagrant Combustion',
      type: 'StartsUsing',
      netRegex: { id: '8042', source: 'Enenra', capture: false },
      // Can be used during Smoke and Mirrors clone phase
      suppressSeconds: 5,
      response: Responses.aoe(),
    },
    {
      id: 'Rokkon Enenra Smoke Rings',
      type: 'StartsUsing',
      netRegex: { id: '8053', source: 'Enenra', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'Rokkon Enenra Clearing Smoke',
      type: 'StartsUsing',
      netRegex: { id: '8052', source: 'Enenra', capture: false },
      response: Responses.knockback(),
    },
    {
      id: 'Rokkon Enenra Pipe Cleaner Collect',
      type: 'Tether',
      netRegex: { id: '0011' },
      run: (data, matches) => data.enenraPipeCleanerCollect.push(matches.source),
    },
    {
      id: 'Rokkon Enenra Pipe Cleaner',
      type: 'StartsUsing',
      netRegex: { id: '8054', source: 'Enenra', capture: false },
      condition: (data) => data.enenraPipeCleanerCollect.includes(data.me),
      alertText: (_data, _matches, output) => output.text(),
      run: (data) => data.enenraPipeCleanerCollect = [],
      outputStrings: {
        text: Outputs.earthshakerOnYou,
      },
    },
    {
      id: 'Rokkon Enenra Snuff',
      type: 'StartsUsing',
      netRegex: { id: '8056', source: 'Enenra' },
      response: Responses.tankCleave(),
    },
    {
      id: 'Rokkon Enenra Uplift',
      type: 'Ability',
      // If hit by Snuff, move away from uplift.
      netRegex: { id: '8056', source: 'Enenra' },
      condition: Conditions.targetIsYou(),
      response: Responses.moveAway(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Clearing Smoke/Smoke Rings': 'Clearing Smoke/Rings',
        'Morphic Melody/Plectrum of Power': 'Morphic/Plectrum',
        'Plectrum of Power/Morphic Melody': 'Plectrum/Morphic',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'Ancient Katana': 'antik(?:e|er|es|en) Katana',
        'Ashigaru Kyuhei': 'Ashigaru Kyuhei',
        'Autumn Rivers\' End': 'Ufer des Herbstflusses',
        'Ball of Levin': 'Elektrosphäre',
        'Devilish Thrall': 'hörig(?:e|er|es|en) Shiki',
        'Enenra': 'Enenra',
        'Feral Thrall': 'hörig(?:e|er|es|en) Moko',
        'Gorai the Uncaged': 'Gorai (?:der|die|das) Entfesselt(?:e|er|es|en)',
        'Haunting Thrall': 'hörig(?:e|er|es|en) Shiryo',
        'Ill-come Tengu': 'ungebeten(?:e|er|es|en) Tengu',
        'Last Glimpse': 'Letzter Blick',
        'Mirrored Yozakura': 'gedoppelt(?:e|er|es|en) Yozakura',
        'Moko the Restless': 'Moko (?:der|die|das) Rastlos(?:e|er|es|en)',
        'Oni\'s Claw': 'Oni-Klaue',
        'Rairin': 'Rairin',
        'Shiromaru': 'Shiromaru',
        'Shishio': 'Shishio',
        'Shishu White Baboon': 'weiß(?:e|er|es|en) Shishu-Pavian',
        'Stone\'s Silence': 'Steines Schweigen',
        'The Hall Of Becoming': 'Halle des Werdens',
        'The Hall Of Temptation': 'Halle der Versuchungen',
        'The Hall Of The Unseen': 'Halle der Verhüllung',
        'The Pond Of Spring Rain': 'Teich des Frühlingsregens',
        'Venomous Thrall': 'hörig(?:e|er|es|en) Daija',
        'Yozakura the Fleeting': 'Yozakura (?:der|die|das) Vergänglich(?:e|er|es|en)',
      },
      'replaceText': {
        '\\(cast\\)': '(wirken)',
        'Art of the Fireblossom': 'Kunst der Feuerblüte',
        'Art of the Fluff': 'Kunst der Flauschigkeit',
        'Art of the Windblossom': 'Kunst der Windblüte',
        'Azure Auspice': 'Azurblauer Kenki-Fokus',
        'Biwa Breaker': 'Biwa-Brecher',
        'Boundless Azure': 'Grenzenloses Azurblau',
        'Boundless Scarlet': 'Grenzenloses Scharlachrot',
        'Bunshin': 'Doppeltes Ich',
        '(?<!Levin)Burst': 'Explosion',
        'Clearing Smoke': 'Rauchauflösung',
        'Clearout': 'Ausräumung',
        'Donden-gaeshi': 'Donden-gaeshi',
        'Double Kasumi-giri': 'Doppeltes Kasumi-giri',
        'Drifting Petals': 'Blütenblätterregen',
        'Enkyo': 'Enkyo',
        'Explosion': 'Explosion',
        'Falling Rock': 'Steinschlag',
        'Fighting Spirits': 'Kräftigender Schluck',
        'Fire Spread': 'Brandstiftung',
        'Fireblossom Flare': 'Auflodern der Feuerblüte',
        'Flagrant Combustion': 'Abscheuliches Anfackeln',
        'Flame and Sulphur': 'Flamme und Schwefel',
        'Flickering Flame': 'Flackernde Flamme',
        'Focused Tremor': 'Kontrolliertes Beben',
        'Ghastly Grasp': 'Gruselgriff',
        'Glory Neverlasting': 'Trichterwinde',
        'Haunting Cry': 'Klagender Schrei',
        'Humble Hammer': 'Entehrender Hammer',
        'Iai-kasumi-giri': 'Iai-kasumi-giri',
        'Icebloom': 'Eisblüte',
        'Impure Purgation': 'Flammenwind',
        'Into the Fire': 'Blutgrätsche',
        'Iron Rain': 'Eisenregen',
        'Kenki Release': 'Kenki-Entfesselung',
        'Kiseru Clamor': 'Blutschwaden-Klatsche',
        'Kuge Rantsui': 'Kuge Rantsui',
        'Left Swipe': 'Linker Feger',
        'Levinblossom Lance': 'Blitz der Gewitterblüte',
        'Levinblossom Strike': 'Grollen der Gewitterblüte',
        'Levinburst': 'Blitzgang',
        'Malformed Prayer': 'Unheil des Perlenkranzes',
        'Moonless Night': 'Mondlose Nacht',
        'Morphic Melody': 'Morphende Melodie',
        'Mud Pie': 'Schlammklumpen',
        'Mudrain': 'Schlammblüte',
        'Noble Pursuit': 'Reißzahn des Löwen',
        'Nubuki': 'Nubuki',
        'Oka Ranman': 'Oka Ranman',
        'Once on Rokujo': 'Sechs Alleen: Einfach',
        'Out of the Smoke': 'Rauchwolke',
        'Pipe Cleaner': 'Klärende Aktion',
        'Plectrum of Power': 'Plektron der Macht',
        'Pure Shock': 'Elektrische Entladung',
        'Reisho': 'Reisho',
        'Right Swipe': 'Rechter Feger',
        'Root Arrangement': 'Wurzelwachstum',
        'Rousing Reincarnation': 'Fluch der Verwandlung',
        'Rush': 'Stürmen',
        'Scarlet Auspice': 'Scharlachroter Kenki-Fokus',
        'Seal Marker': 'Siegel Marker',
        'Seal of Riotous Bloom': 'Siegel des Wildblühens',
        'Seal of the Blossom': 'Siegel der Blüte',
        'Seal of the Fleeting': 'Kunst des Blütensiegels',
        'Season Indicator': 'Shikunshi Indikator',
        'Season of Element': 'Shikunshi des Elements',
        'Seasons of the Fleeting': 'Shikunshi',
        'Self-destruct': 'Selbstzerstörung',
        'Shadowflight': 'Schattenschlag',
        '(?<! )Shock': 'Entladung',
        'Silent Whistle': 'Hasenmedium',
        'Smoke Rings': 'Rauchringe',
        'Smoke Stack': 'Rauchschwade',
        'Smoke and Mirrors': 'Viel Rauch um nichts',
        'Smokeater': 'Dunstfresser',
        'Smoldering(?! Damnation)': 'Schwelendes Feuer',
        'Smoldering Damnation': 'Schwelende Verdammnis',
        'Snuff': 'Klatsche',
        'Soldiers of Death': 'Soldaten des Todes',
        'Spearman\'s Orders': 'Lanze vor!',
        'Spike of Flame': 'Flammenstachel',
        'Spiritflame': 'Geisterflamme',
        'Spiritspark': 'Geisterfunke',
        'Splitting Cry': 'Schrecklicher Schrei',
        'Stormcloud Summons': 'Elektrizitätsgenerierung',
        'String Snap': 'Bebende Erde',
        'Sulphuric Stone': 'Schwefliger Stein',
        'Tatami Trap': 'Fallenstellen',
        'Tatami-gaeshi': 'Tatami-gaeshi',
        'Tengu-yobi': 'Tengu-yobi',
        'Thunder Onefold': 'Blitzschlag: Einfach',
        'Thunder Threefold': 'Blitzschlag: Dreifach',
        'Thunder Twofold': 'Blitzschlag: Zweifach',
        'Thunder Vortex': 'Sturmwirbel',
        'Thundercall': 'Donnerruf',
        'Torching Torment': 'Höllische Hitze',
        'Unenlightenment': 'Glühende Geißel',
        'Unsheathing': 'Ziehen des Schwertes',
        'Untempered Sword': 'Zügelloses Schwert',
        'Uplift': 'Erhöhung',
        'Upwell': 'Strömung',
        'Vasoconstrictor': 'Vasokonstriktor',
        'Veil Sever': 'Schleierdurchtrennung',
        'Wily Wall': 'Missliche Mauerung',
        'Windblossom Whirl': 'Wirbel der Windblüte',
        'Witherwind': 'Blütenwirbel',
        'Worldly Pursuit': 'Springender Schmerzschlag',
        'Yama-kagura': 'Yama-kagura',
        'Yoki(?!-uzu)': 'Yoki',
        'Yoki-uzu': 'Yoki-uzu',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Ancient Katana': 'katana ancien',
        'Ashigaru Kyuhei': 'ashigaru kyûhei',
        'Autumn Rivers\' End': 'Clairière de l\'Équinoxe',
        'Ball of Levin': 'orbe de foudre',
        'Devilish Thrall': 'ilote malicieux',
        'Enenra': 'Enenra',
        'Feral Thrall': 'ilote féroce',
        'Gorai the Uncaged': 'Gôrai le fureteur',
        'Haunting Thrall': 'ilote envoûtant',
        'Ill-come Tengu': 'tengu du Rokkon',
        'Last Glimpse': 'Clairière du Discernement',
        'Mirrored Yozakura': 'double de Yozakura',
        'Moko the Restless': 'Môko le tourmenté',
        'Oni\'s Claw': 'griffe d\'oni',
        'Rairin': 'cercle de foudre',
        'Shiromaru': 'Shiromaru',
        'Shishio': 'Shishiô',
        'Shishu White Baboon': 'babouin de Shishû',
        'Stone\'s Silence': 'Jardin des pierres silencieuses',
        'The Hall Of Becoming': 'Salle des trésors du Shôjôin',
        'The Hall Of Temptation': 'Vestibule doré',
        'The Pond Of Spring Rain': 'Bassin de la Pureté absolue',
        'Venomous Thrall': 'ilote venimeux',
        'Yozakura the Fleeting': 'Yozakura l\'élusive',
      },
      'replaceText': {
        'Art of the Fireblossom': 'Art floral de feu',
        'Art of the Fluff': 'Art molletonné',
        'Art of the Windblossom': 'Art floral de vent',
        'Azure Auspice': 'Auspice azuré',
        'Biwa Breaker': 'Biwa désaccordé',
        'Boundless Azure': 'Lueur azurée',
        'Boundless Scarlet': 'Lueur écarlate',
        'Bunshin': 'Bunshin',
        '(?<!Levin)Burst': 'Explosion',
        'Clearing Smoke': 'Fumée dissipante',
        'Clearout': 'Fauchage',
        'Donden-gaeshi': 'Donden-gaeshi',
        'Double Kasumi-giri': 'Kasumi-giri double',
        'Drifting Petals': 'Pétales faillissants',
        'Enkyo': 'Enkyô',
        'Explosion': 'Explosion',
        'Falling Rock': 'Chute de pierre',
        'Fighting Spirits': 'Esprits spiritueux',
        'Fire Spread': 'Nappe de feu',
        'Fireblossom Flare': 'Éruption en fleur',
        'Flagrant Combustion': 'Combustion incandescente',
        'Flame and Sulphur': 'Soufre enflammé',
        'Flickering Flame': 'Flamme vacillante',
        'Focused Tremor': 'Séisme localisé',
        'Ghastly Grasp': 'Étreinte funeste',
        'Glory Neverlasting': 'Gloire éphémère',
        'Haunting Cry': 'Cri de tourmente',
        'Humble Hammer': 'Marteau d\'humilité',
        'Iai-kasumi-giri': 'Iai-kasumi-giri',
        'Icebloom': 'Floraison de givre',
        'Impure Purgation': 'Purgation impure',
        'Into the Fire': 'Onde sanglante',
        'Iron Rain': 'Pluie de fer',
        'Kenki Release': 'Décharge Kenki',
        'Kiseru Clamor': 'Pipe sanglante',
        'Kuge Rantsui': 'Kuge Rantsui',
        'Left Swipe': 'Tranchage gauche',
        'Levinblossom Lance': 'Lumière en fleur',
        'Levinblossom Strike': 'Tonnerre en fleur',
        'Levinburst': 'Éclat de foudre',
        'Malformed Prayer': 'Prière difforme',
        'Moonless Night': 'Nuit noire',
        'Morphic Melody': 'Mélodie mutante',
        'Mud Pie': 'Boule de boue',
        'Mudrain': 'Lotus de boue',
        'Noble Pursuit': 'Noble ambition',
        'Nubuki': 'Nubuki',
        'Oka Ranman': 'Oka Ranman',
        'Once on Rokujo': 'Rokujô simple',
        'Out of the Smoke': 'Nuée de fumée',
        'Pipe Cleaner': 'Onde fumeuse',
        'Plectrum of Power': 'Plectre du pouvoir',
        'Pure Shock': 'Choc électrisant',
        'Reisho': 'Reishô',
        'Right Swipe': 'Tranchage droit',
        'Root Arrangement': 'Bouquet de racines',
        'Rousing Reincarnation': 'Réincarnation vibrante',
        'Rush': 'Ruée',
        'Scarlet Auspice': 'Auspice écarlate',
        'Seal of Riotous Bloom': 'Sceau de floraison vivace',
        'Seal of the Fleeting': 'Sceau de floraison',
        'Seasons of the Fleeting': 'Quatre saisons',
        'Self-destruct': 'Auto-destruction',
        'Shadowflight': 'Vol ombrageux',
        '(?<! )Shock': 'Décharge électrostatique',
        'Silent Whistle': 'Kuchiyose',
        'Smoke Rings': 'Ronds de fumée',
        'Smoke Stack': 'Signaux de fumée',
        'Smoke and Mirrors': 'Fumée sans feu',
        'Smokeater': 'Dévoreur de brouillard',
        'Smoldering(?! Damnation)': 'Combustion consumante',
        'Smoldering Damnation': 'Damnation consumante',
        'Snuff': 'Pipe écrasante',
        'Soldiers of Death': 'Guerriers de la mort',
        'Spearman\'s Orders': 'Ordre d\'attaque',
        'Spike of Flame': 'Explosion de feu',
        'Spiritflame': 'Flamme spirituelle',
        'Spiritspark': 'Étincelle spirituelle',
        'Splitting Cry': 'Cri d\'horreur',
        'Stormcloud Summons': 'Nuage d\'orage',
        'String Snap': 'Corde cassée',
        'Sulphuric Stone': 'Soufre rocheux',
        'Tatami Trap': 'Piège de paille',
        'Tatami-gaeshi': 'Tatami-gaeshi',
        'Tengu-yobi': 'Tengu-yobi',
        'Thunder Onefold': 'Éclair simple',
        'Thunder Threefold': 'Éclair triple',
        'Thunder Twofold': 'Éclair double',
        'Thunder Vortex': 'Spirale de foudre',
        'Thundercall': 'Drain fulminant',
        'Torching Torment': 'Brasier de tourments',
        'Unenlightenment': 'Sommeil spirituel',
        'Unsheathing': 'Défouraillage',
        'Untempered Sword': 'Lame impulsive',
        'Uplift': 'Exhaussement',
        'Upwell': 'Torrent violent',
        'Vasoconstrictor': 'Vasoconstricteur',
        'Veil Sever': 'Voile déchiré',
        'Wily Wall': 'Mur retors',
        'Windblossom Whirl': 'Pétales tournoyants',
        'Witherwind': 'Vent fanant',
        'Worldly Pursuit': 'Matérialisme',
        'Yama-kagura': 'Yama-kagura',
        'Yoki(?!-uzu)': 'Yôki',
        'Yoki-uzu': 'Yôki-uzu',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Ancient Katana': '古刀',
        'Ashigaru Kyuhei': '足軽弓兵',
        'Autumn Rivers\' End': '落葉川河畔',
        'Ball of Levin': '雷球',
        'Devilish Thrall': '惑わされた屍鬼',
        'Enenra': '煙々羅',
        'Feral Thrall': '惑わされた猛虎',
        'Gorai the Uncaged': '鉄鼠ゴウライ',
        'Haunting Thrall': '惑わされた屍霊',
        'Ill-come Tengu': '六根天狗',
        'Last Glimpse': '眼根の木間',
        'Mirrored Yozakura': 'ヨザクラの分身',
        'Moko the Restless': '怨霊モウコ',
        'Oni\'s Claw': '鬼腕',
        'Rairin': '雷輪',
        'Shiromaru': '忍犬シロマル',
        'Shishio': '獅子王',
        'Shishu White Baboon': 'シシュウ・ヒヒ',
        'Stone\'s Silence': '怪鳴石の磐座',
        'The Hall Of Becoming': '宝蔵の間',
        'The Hall Of Temptation': '金堂',
        'The Pond Of Spring Rain': '浄桜湖',
        'Venomous Thrall': '惑わされた大蛇',
        'Yozakura the Fleeting': '花遁のヨザクラ',
      },
      'replaceText': {
        'Art of the Fireblossom': '火花の術',
        'Art of the Fluff': 'もふもふの術',
        'Art of the Windblossom': '風花の術',
        'Azure Auspice': '青帝剣気',
        'Biwa Breaker': '琵琶誅撃',
        'Boundless Azure': '青帝空閃刃',
        'Boundless Scarlet': '赤帝空閃刃',
        'Bunshin': '分身の術',
        '(?<!Levin)Burst': '爆発',
        'Clearing Smoke': '衝撃煙管打ち',
        'Clearout': 'なぎ払い',
        'Donden-gaeshi': 'どんでん返しの術',
        'Double Kasumi-giri': '霞二段',
        'Drifting Petals': '落花流水の術',
        'Enkyo': '猿叫',
        'Explosion': '爆発',
        'Falling Rock': '落石',
        'Fighting Spirits': '般若湯',
        'Fire Spread': '放火',
        'Fireblossom Flare': '火花上騰の術',
        'Flagrant Combustion': '赤熱爆煙',
        'Flame and Sulphur': '岩火招来',
        'Flickering Flame': '怪火招来',
        'Focused Tremor': '局所地震',
        'Ghastly Grasp': '妖気刃',
        'Glory Neverlasting': '槿花一朝',
        'Haunting Cry': '不気味な鳴声',
        'Humble Hammer': '打ち出の小槌',
        'Iai-kasumi-giri': '居合霞斬り',
        'Icebloom': '氷花満開の術',
        'Impure Purgation': '炎流',
        'Into the Fire': '血煙重波撃',
        'Iron Rain': '矢の雨',
        'Kenki Release': '剣気解放',
        'Kiseru Clamor': '血煙重打撃',
        'Kuge Rantsui': '空花乱墜',
        'Left Swipe': '左爪薙ぎ払い',
        'Levinblossom Lance': '雷花閃光の術',
        'Levinblossom Strike': '雷花鳴響の術',
        'Levinburst': '発雷',
        'Malformed Prayer': '呪珠印',
        'Moonless Night': '闇夜斬り',
        'Morphic Melody': '変剋の旋律',
        'Mud Pie': '泥団子',
        'Mudrain': '泥中蓮花の術',
        'Noble Pursuit': '獅子王牙',
        'Nubuki': '芽吹きの術',
        'Oka Ranman': '桜花爛漫',
        'Once on Rokujo': '六条放雷：壱式',
        'Out of the Smoke': '雲煙飛動',
        'Pipe Cleaner': '重波撃',
        'Plectrum of Power': '強勢の旋律',
        'Pure Shock': '放雷衝',
        'Reisho': '霊障',
        'Right Swipe': '右爪薙ぎ払い',
        'Root Arrangement': '枯樹生花の術',
        'Rousing Reincarnation': '変現の呪い',
        'Rush': '突進',
        'Scarlet Auspice': '赤帝剣気',
        'Seal of Riotous Bloom': '花押印・乱咲',
        'Seal of the Fleeting': '花押印の術',
        'Seasons of the Fleeting': '四君子の術',
        'Self-destruct': '自爆',
        'Shadowflight': '影討ち',
        '(?<! )Shock': '放電',
        'Silent Whistle': '口寄せの術',
        'Smoke Rings': '円撃煙管打ち',
        'Smoke Stack': '集煙法',
        'Smoke and Mirrors': '分煙法',
        'Smokeater': '霞喰い',
        'Smoldering(?! Damnation)': '噴煙燃焼',
        'Smoldering Damnation': '噴煙地獄',
        'Snuff': '重打撃',
        'Soldiers of Death': '屍兵呼び',
        'Spearman\'s Orders': '突撃命令',
        'Spike of Flame': '爆炎',
        'Spiritflame': '怪火',
        'Spiritspark': '怪火呼び',
        'Splitting Cry': '霊鳴砲',
        'Stormcloud Summons': '雷雲生成',
        'String Snap': '鳴弦震動波',
        'Sulphuric Stone': '霊岩招来',
        'Tatami Trap': '罠仕込み',
        'Tatami-gaeshi': '畳返しの術',
        'Tengu-yobi': '天狗呼び',
        'Thunder Onefold': '落雷：壱式',
        'Thunder Threefold': '落雷：参式',
        'Thunder Twofold': '落雷：弐式',
        'Thunder Vortex': '輪転渦雷',
        'Thundercall': '招雷',
        'Torching Torment': '煩熱',
        'Unenlightenment': '煩悩熾盛',
        'Unsheathing': '妖刀具現',
        'Untempered Sword': '有構無構',
        'Uplift': '隆起',
        'Upwell': '水流',
        'Vasoconstrictor': '毒液噴射',
        'Veil Sever': '血地裂き',
        'Wily Wall': '法力障壁',
        'Windblossom Whirl': '風花旋回の術',
        'Witherwind': '風花落葉の術',
        'Worldly Pursuit': '跳鼠痛撃',
        'Yama-kagura': '山神楽',
        'Yoki(?!-uzu)': '妖気',
        'Yoki-uzu': '妖気渦',
      },
    },
  ],
});
