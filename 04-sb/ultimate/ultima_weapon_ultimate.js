// Note: without extra network data that is not exposed, it seems impossible to know where Titan
// looks briefly before jumping for Geocrush. A getCombatants trigger on NameToggle 00 was
// extremely inaccurate and so that is likely too late to know.
const centerX = 100;
const centerY = 100;
const gaolConfig = (id) => {
  // Since these are all explicit string types, get the number from the string.
  const numStr = id.replace('gaolOrder', '');
  return {
    id: id,
    name: {
      en: `Titan Gaol Order ${numStr}`,
      de: `Titan Gefängnis Reihenfolge ${numStr}`,
      cn: `泰坦石牢顺序 ${numStr}`,
      ko: `돌감옥 순서 ${numStr}`,
    },
    type: 'string',
    default: '',
  };
};
// Ultima Weapon Ultimate
Options.Triggers.push({
  id: 'TheWeaponsRefrainUltimate',
  zoneId: ZoneId.TheWeaponsRefrainUltimate,
  config: [
    // Yes yes, a textarea would be nice here to put everything on separate lines,
    // but OverlayPlugin does not seem to support delivering the enter key and
    // so there's no way to have one box with names on separate lines.  Sorry!
    /* eslint-disable max-len */
    {
      ...gaolConfig('gaolOrder1'),
      comment: {
        en:
          'Each entry can be the three letter job (e.g. "war" or "SGE") or the full name (e.g. "Tini Poutini"), all case insensitive. Smaller numbers will be listed first in the gaol order. Duplicate jobs will sort players alphabetically. Anybody not listed will be added to the end alphabetically. Blank entries are ignored. If players are listed multiple times by name or job, the lower number will be considered.',
        de:
          'Jeder Eintrag kann aus drei Buchstaben des Jobs bestehen (z. B. "war" oder "SGE") oder aus dem vollständigen Namen (z. B. "Tini Poutini"), wobei Groß- und Kleinschreibung nicht berücksichtigt werden. Kleinere Nummern werden in der Reihenfolge der Gefängnisse zuerst aufgeführt. Bei doppelten Aufträgen werden die Spieler alphabetisch sortiert. Jeder nicht aufgeführte Spieler wird am Ende alphabetisch eingeordnet. Leere Einträge werden ignoriert. Wenn Spieler mehrfach nach Namen oder Beruf aufgelistet sind, wird die niedrigere Nummer berücksichtigt.',
        cn:
          '每个条目可以是三个字母的职业缩写 (例如 "war" 或  "SGE") 或玩家全名（例如 "Tini Poutini"），所有字母不区分大小写。编号较小的将在石牢顺序中排列在前。重复的职业将按姓名字母顺序对玩家进行排序。未列出的队员将按字母顺序添加到末尾。空白条目将被忽略。如果玩家按姓名或职业被多次列出，则以较小编号为准。',
        ko:
          '각 항목에는 대소문자를 구분하지 않는 세 글자 직업명(예: "war" 또는 "SGE") 또는 전체 이름(예: "빛의전사")을 입력할 수 있습니다. 먼저 입력된 항목이 감옥 순서에서 먼저 나열됩니다. 직업이 중복된 경우에는  알파벳 순(가나다 순)으로 나타납니다. 목록에 없는 사람은 알파벳 순으로 맨 끝에 추가됩니다. 빈 칸은 무시됩니다. 플레이어가 이름 또는 직업별로 여러 번 나열된 경우, 먼저 입력된 항목이 사용됩니다.',
      },
    },
    gaolConfig('gaolOrder2'),
    gaolConfig('gaolOrder3'),
    gaolConfig('gaolOrder4'),
    gaolConfig('gaolOrder5'),
    gaolConfig('gaolOrder6'),
    gaolConfig('gaolOrder7'),
    gaolConfig('gaolOrder8'),
    gaolConfig('gaolOrder9'),
    gaolConfig('gaolOrder10'),
    gaolConfig('gaolOrder11'),
    gaolConfig('gaolOrder12'),
    gaolConfig('gaolOrder13'),
    gaolConfig('gaolOrder14'),
    gaolConfig('gaolOrder15'),
    gaolConfig('gaolOrder16'),
    gaolConfig('gaolOrder17'),
    gaolConfig('gaolOrder18'),
    gaolConfig('gaolOrder19'),
    gaolConfig('gaolOrder20'),
    /* eslint-enable max-len */
  ],
  timelineFile: 'ultima_weapon_ultimate.txt',
  initData: () => {
    return {
      combatantData: [],
      phase: 'garuda',
      bossId: {},
      garudaAwoken: false,
      ifritAwoken: false,
      thermalLow: {},
      beyondLimits: new Set(),
      slipstreamCount: 0,
      nailAdds: [],
      nailDeaths: {},
      nailDeathOrder: [],
      ifritUntargetableCount: 0,
      titanGaols: [],
      titanBury: [],
      ifritRadiantPlumeLocations: [],
      possibleIfritIDs: [],
    };
  },
  timelineTriggers: [
    {
      id: 'UWU Diffractive Laser',
      regex: /Diffractive Laser/,
      beforeSeconds: 5,
      suppressSeconds: 3,
      response: Responses.tankCleave(),
    },
    {
      id: 'UWU Feather Rain',
      regex: /Feather Rain/,
      beforeSeconds: 3,
      suppressSeconds: 3,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Move!',
          de: 'Bewegen',
          fr: 'Bougez !',
          ja: 'フェザーレイン',
          cn: '躲羽毛',
          ko: '이동',
        },
      },
    },
    {
      id: 'UWU Eruption',
      regex: /Eruption 1/,
      beforeSeconds: 10,
      condition: (data) => data.phase !== 'suppression',
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Eruption Baits',
          de: 'Köder Eruption',
          cn: '诱导地火',
          ko: '용암 분출 유도',
        },
      },
    },
  ],
  triggers: [
    // --------- Phases & Buff Tracking ----------
    {
      id: 'UWU Phase Tracker',
      type: 'Ability',
      // 2B53 = Slipstream
      // 2B5F = Crimson Cyclone
      // 2CFD = Geocrush
      // 2CF5 = Intermission
      // 2B87 = Tank Purge
      // 2D4C = Ultimate Annihilation
      // 2D4D = Ultimate Suppression
      netRegex: { id: ['2B53', '2B5F', '2CFD', '2CF5', '2B87', '2D4C', '2D4D'] },
      run: (data, matches) => {
        if (data.phase === 'garuda' && matches.id === '2B53') {
          data.bossId.garuda = matches.sourceId;
        } else if (data.phase === 'garuda' && matches.id === '2B5F') {
          data.phase = 'ifrit';
          data.bossId.ifrit = matches.sourceId;
        } else if (data.phase === 'ifrit' && matches.id === '2CFD') {
          data.phase = 'titan';
          data.bossId.titan = matches.sourceId;
        } else if (data.phase === 'titan' && matches.id === '2CF5') {
          data.phase = 'intermission';
        } else if (data.phase === 'intermission' && matches.id === '2B87') {
          data.phase = 'predation';
          data.bossId.ultima = matches.sourceId;
        } else if (matches.id === '2D4C') {
          data.phase = 'annihilation';
        } else if (matches.id === '2D4D') {
          data.phase = 'suppression';
        }
      },
    },
    {
      // Wait after suppression for primal triggers at the end.
      id: 'UWU Phase Tracker Finale',
      type: 'Ability',
      netRegex: { source: 'The Ultima Weapon', id: '2D4D', capture: false },
      delaySeconds: 74,
      run: (data) => data.phase = 'finale',
    },
    {
      id: 'UWU Garuda Woken',
      type: 'GainsEffect',
      netRegex: { target: 'Garuda', effectId: '5F9', capture: false },
      sound: 'Long',
      run: (data) => data.garudaAwoken = true,
    },
    {
      id: 'UWU Ifrit Woken',
      type: 'GainsEffect',
      netRegex: { target: 'Ifrit', effectId: '5F9', capture: false },
      sound: 'Long',
      run: (data) => data.ifritAwoken = true,
    },
    {
      id: 'UWU Titan Woken',
      type: 'GainsEffect',
      netRegex: { target: 'Titan', effectId: '5F9', capture: false },
      sound: 'Long',
    },
    {
      id: 'UWU Thermal Low Gain',
      type: 'GainsEffect',
      netRegex: { effectId: '5F5' },
      run: (data, matches) => data.thermalLow[matches.target] = parseInt(matches.count),
    },
    {
      id: 'UWU Thermal Low Lose',
      type: 'LosesEffect',
      netRegex: { effectId: '5F5' },
      run: (data, matches) => data.thermalLow[matches.target] = 0,
    },
    {
      id: 'UWU Beyond Limits Gain',
      type: 'GainsEffect',
      netRegex: { effectId: '5FA' },
      run: (data, matches) => data.beyondLimits.add(matches.target),
    },
    {
      id: 'UWU Beyond Limits Lose',
      type: 'LosesEffect',
      netRegex: { effectId: '5FA' },
      run: (data, matches) => data.beyondLimits.delete(matches.target),
    },
    // --------- Garuda ----------
    {
      id: 'UWU Garuda Slipstream',
      type: 'StartsUsing',
      netRegex: { id: '2B53', source: 'Garuda', capture: false },
      response: Responses.getBehind(),
      run: (data) => data.slipstreamCount++,
    },
    {
      id: 'UWU Garuda Downburst',
      // This always comes after a Slipstream so use that to trigger.
      // There is no castbar and the ability ids are the same.
      type: 'Ability',
      netRegex: { id: '2B53', source: 'Garuda', capture: false },
      delaySeconds: (data) => data.slipstreamCount === 4 ? 10 : 0,
      suppressSeconds: 3,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          // TODO: we could track who Garuda is tanking here and say "on you" or "stack on"
          tankCleave: Outputs.tankCleave,
          partyStack: Outputs.stackMarker,
          tankCleavePartyOut: {
            en: 'Tank Cleave (PARTY OUT)',
            de: 'Tank Cleave (GRUPPE RAUS)',
            cn: '坦克顺劈 (人群出)',
            ko: '광역 탱버 (본대 밖으로)',
          },
        };
        if (data.slipstreamCount === 1 || data.slipstreamCount > 4)
          return;
        // You need to have awoken Garuda by this point to beat the fight, but if you haven't
        // and are just progging it's easy to forget that this is not a party share.
        // This is also mostly skipped these days.
        if (!data.garudaAwoken && data.slipstreamCount === 4)
          return { alarmText: output.tankCleavePartyOut() };
        if (data.garudaAwoken)
          return { alertText: output.partyStack() };
        return { infoText: output.tankCleave() };
      },
    },
    {
      id: 'UWU Garuda Mistral Song Marker',
      type: 'HeadMarker',
      netRegex: { id: '0010' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Mistral on YOU',
          de: 'Mistral-Song',
          fr: 'Mistral sur VOUS',
          ja: 'ミストラルソング',
          cn: '寒风之歌点名',
          ko: '삭풍 징',
        },
      },
    },
    {
      id: 'UWU Garuda Mistral Song Tank',
      type: 'HeadMarker',
      netRegex: { id: '0010', capture: false },
      condition: (data) => data.role === 'tank',
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Block Mistral Song',
          de: 'Mistral-Song',
          fr: 'Chant du mistral',
          ja: 'ミストラルソング',
          cn: '寒风之歌',
          ko: '삭풍 징',
        },
      },
    },
    {
      id: 'UWU Garuda Spiny Plume',
      type: 'AddedCombatant',
      netRegex: { name: 'Spiny Plume', capture: false },
      condition: (data) => data.role === 'tank',
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Spiny Plume Add',
          de: 'Dorniger Federsturm',
          fr: 'Add Plume perforante',
          ja: 'スパイニープルーム',
          cn: '刺羽出现',
          ko: '가시돋힌 깃털 등장',
        },
      },
    },
    {
      id: 'UWU Garuda Wicked Wheel',
      type: 'StartsUsing',
      netRegex: { id: '2B4E', source: 'Garuda', capture: false },
      condition: (data) => data.phase === 'garuda',
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          unawokenOut: Outputs.out,
          awokenOutThenIn: Outputs.outThenIn,
        };
        if (data.garudaAwoken)
          return { alertText: output.awokenOutThenIn() };
        return { infoText: output.unawokenOut() };
      },
    },
    {
      id: 'UWU Garuda Aerial Blast',
      type: 'StartsUsing',
      netRegex: { id: '2B55', source: 'Garuda', capture: false },
      condition: (data) => data.phase === 'garuda',
      response: Responses.aoe(),
    },
    {
      id: 'UWU Garuda Sisters Location',
      comment: {
        en:
          'Where the two sisters are for the tanks to block. dir1 is always the first sister location starting North and going clockwise',
        de:
          'Wo sich die beiden Schwestern befinden, die die Tanks blockieren sollen. dir1 ist immer die erste Schwester, die im Norden beginnt und im Uhrzeigersinn verläuft.',
        cn: '两分身待坦克阻挡的位置。dir1 始终是从上 (北) 开始顺时针方向的第一个分身位置',
        ko: '탱커가 막을 두 분신의 위치. dir1은 북쪽에서 시계방향으로 도는 것을 기준으로 항상 첫 번째 분신의 위치입니다',
      },
      type: 'StartsUsing',
      netRegex: { id: '2B55', source: 'Garuda', capture: false },
      /*
            [21:13:53.626] StartsCasting 14:400188D4:Garuda:2B55:Aerial Blast:400188D4:Garuda:2.700:100.00:100.00:0.00:0.00
            [21:13:56.607] AOEActionEffect 16:400188D4:Garuda:2B55:Aerial Blast:XXXXXXXX:Tiny Poutini:350003:1F560000:1B:2B558000:0:0:0:0:0:0:0:0:0:0:0:0:22867:25795:10000:10000:::100.33:97.62:0.00:0.01:693098:1664845:34464:10000:::100.00:100.00:0.00:0.00:0000D57F:7:8
            [21:14:07.587] 261 105:Change:400188CC:Heading:0.0000:PosX:94.0000:PosY:100.0000:PosZ:0.0000
            [21:14:07.587] 261 105:Change:400188CB:Heading:0.0000:PosX:106.0000:PosY:100.0000:PosZ:0.0000
            [21:14:11.772] StartsCasting 14:400188C6:Garuda:2B4D:Feather Rain:E0000000::0.700:101.06:101.93:0.00:0.00
            [21:14:11.772] StartsCasting 14:400188C7:Garuda:2B4D:Feather Rain:E0000000::0.700:101.30:101.74:0.00:0.00
            [21:14:11.772] StartsCasting 14:400188C8:Garuda:2B4D:Feather Rain:E0000000::0.700:100.79:102.21:0.00:0.00
            [21:14:11.772] StartsCasting 14:400188C9:Garuda:2B4D:Feather Rain:E0000000::0.700:100.50:101.45:0.00:0.00
            [21:14:11.772] StartsCasting 14:400188CA:Garuda:2B4D:Feather Rain:E0000000::0.700:100.80:102.30:0.00:0.00
            [21:14:11.969] 261 105:Change:400188CB:Heading:0.0000:ModelStatus:16384:PosX:100.0000:PosY:80.5000:PosZ:0.0000
            [21:14:11.969] 261 105:Change:400188CC:Heading:3.1416:ModelStatus:16384:PosX:100.0000:PosY:119.5000:PosZ:0.0000
            [21:14:14.448] TargetIcon 1B:XXXXXXXX:Tiny Poutini:0000:0000:0010:0000:0000:0000
            */
      condition: (data) => data.phase === 'garuda',
      delaySeconds: 19,
      promise: async (data) => {
        data.combatantData = [];
        // TODO: it'd be nice if this function allowed filtering by name ids.
        data.combatantData = (await callOverlayHandler({
          call: 'getCombatants',
        })).combatants;
      },
      alertText: (data, _matches, output) => {
        // These two sisters are added before the pull starts,
        // but they are the only two with these names.
        // 1645 = Suparna
        // 1646 = Chirada
        const sisters = data.combatantData.filter((x) =>
          x.BNpcNameID === 1645 || x.BNpcNameID === 1646
        );
        const [dir1, dir2] = sisters.map((c) =>
          Directions.xyTo4DirNum(c.PosX, c.PosY, centerX, centerY)
        ).sort();
        if (dir1 === undefined || dir2 === undefined || sisters.length !== 2)
          return;
        const map = {
          0: output.dirN(),
          1: output.dirE(),
          2: output.dirS(),
          3: output.dirW(),
        };
        return output.text({ dir1: map[dir1], dir2: map[dir2] });
      },
      outputStrings: {
        text: {
          en: 'Sisters: ${dir1} / ${dir2}',
          de: 'Schwestern: ${dir1} / ${dir2}',
          cn: '分身：${dir1} / ${dir2}',
          ko: '분신: ${dir1} / ${dir2}',
        },
        // TODO: the lint fails if you `...Directions.outputStringsCardinalDir` :C
        dirN: Outputs.dirN,
        dirE: Outputs.dirE,
        dirS: Outputs.dirS,
        dirW: Outputs.dirW,
      },
    },
    {
      id: 'UWU Ultima Mesohigh Tether',
      type: 'Tether',
      // This happens in Garuda, as well in Annihilation and Suppression.
      netRegex: { id: '0004', capture: false },
      suppressSeconds: 30,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          // The person with two stacks must get a tether.
          garuda2: {
            en: 'Get Sister Tether!!!',
            de: 'Nimm Verbindung von der Schwester!!!',
            cn: '接分身的线!!!',
            ko: '분신 줄 가져가기!!!',
          },
          // Other people with 1 stack can be informed about it.
          garuda1: {
            en: 'Sister Tethers',
            de: 'Schwester Verbindungen',
            cn: '分身连线',
            ko: '분신 줄',
          },
          // Usually static on a ranged.
          annihilation1: {
            en: 'Tether',
            de: 'Verbindungen',
            cn: '连线',
            ko: '줄',
          },
          // Late in the raid, so make sure anybody with a stack remembers this.
          suppression1: {
            en: 'Tether!!!',
            de: 'Verbindungen!!!',
            cn: '连线!!!',
            ko: '줄!!!',
          },
        };
        const myStacks = data.thermalLow[data.me];
        if (myStacks === undefined || myStacks === 0)
          return;
        if (myStacks === 2) {
          if (data.phase === 'garuda' && !data.garudaAwoken)
            return { alarmText: output.garuda2() };
          return;
        }
        if (data.phase === 'garuda')
          return { alertText: output.garuda1() };
        if (data.phase === 'annihilation')
          return { infoText: output.annihilation1() };
        if (data.phase === 'suppression')
          return { alarmText: output.suppression1() };
      },
    },
    // --------- Ifrit ----------
    {
      id: 'UWU Ifrit Possible ID Locator',
      type: 'StartsUsing',
      netRegex: { id: '2B55', source: 'Garuda', capture: false },
      // Run this after the initial Garuda trigger and just piggyback off its call to `getCombatants`
      // We're just looking to pluck the four possible IDs from the array pre-emptively to avoid doing
      // that filter on every `CombatantMemory` line
      delaySeconds: 25,
      run: (data) => {
        data.possibleIfritIDs = data.combatantData
          .filter((c) => c.BNpcNameID === 0x4A1)
          .map((c) => c.ID?.toString(16).toUpperCase() ?? '');
      },
    },
    {
      id: 'UWU Ifrit Initial Dash Collector',
      type: 'CombatantMemory',
      // Filter to only enemy actors for performance
      netRegex: { id: '4[0-9A-Fa-f]{7}', capture: true },
      condition: (data, matches) => {
        if (!data.possibleIfritIDs.includes(matches.id))
          return false;
        const posXVal = parseFloat(matches.pairPosX ?? '0');
        const posYVal = parseFloat(matches.pairPosY ?? '0');
        if (posXVal === 0 || posYVal === 0)
          return false;
        // If the Ifrit actor has jumped to exactly 19.5 out on a cardinal, that's our dash spot
        if (
          Math.abs(posXVal - 100) - 19.5 < Number.EPSILON ||
          Math.abs(posYVal - 100) - 19.5 < Number.EPSILON
        )
          return true;
        return false;
      },
      suppressSeconds: 9999,
      infoText: (data, matches, output) => {
        const posXVal = parseFloat(matches.pairPosX ?? '0');
        const posYVal = parseFloat(matches.pairPosY ?? '0');
        let ifritDir = 'unknown';
        // Flag both sides that ifrit is dashing through as unsafe, while also tracking where he's actually
        // jumped to so we can use it for the infoText
        if (posXVal < 95) {
          data.ifritRadiantPlumeLocations.push('dirW', 'dirE');
          ifritDir = 'dirW';
        } else if (posXVal > 105) {
          data.ifritRadiantPlumeLocations.push('dirW', 'dirE');
          ifritDir = 'dirE';
        } else if (posYVal < 95) {
          data.ifritRadiantPlumeLocations.push('dirN', 'dirS');
          ifritDir = 'dirN';
        } else if (posYVal > 105) {
          data.ifritRadiantPlumeLocations.push('dirN', 'dirS');
          ifritDir = 'dirS';
        }
        // Remove duplicates
        data.ifritRadiantPlumeLocations = data.ifritRadiantPlumeLocations
          .filter((pos, index) => data.ifritRadiantPlumeLocations.indexOf(pos) === index);
        return output.text({ dir: output[ifritDir]() });
      },
      outputStrings: {
        text: {
          en: 'Ifrit ${dir}',
        },
        unknown: Outputs.unknown,
        ...Directions.outputStringsCardinalDir,
      },
    },
    {
      id: 'UWU Ifrit Initial Radiant Plume Collector',
      type: 'StartsUsingExtra',
      netRegex: { id: '2B61' },
      condition: (data, matches) => {
        const posXVal = parseFloat(matches.x);
        const posYVal = parseFloat(matches.y);
        // Possible plume locations:
        // 100.009, 106.998
        // 100.009, 118.015  = south
        // 100.009, 92.990
        // 100.009, 82.003   = north
        // 106.998, 100.009
        // 110.996, 110.996
        // 110.996, 88.992
        // 118.015, 100.009  = east
        // 82.003,  100.009  = west
        // 88.992,  110.996
        // 88.992,  88.992
        // 92.990,  100.009
        if (Math.abs(posXVal - 100) < 1) {
          if (Math.abs(posYVal - 83) < 1) {
            // North unsafe
            data.ifritRadiantPlumeLocations.push('dirN');
          } else if (Math.abs(posYVal - 118) < 1) {
            // South unsafe
            data.ifritRadiantPlumeLocations.push('dirS');
          }
        } else if (Math.abs(posYVal - 100) < 1) {
          if (Math.abs(posXVal - 83) < 1) {
            // West unsafe
            data.ifritRadiantPlumeLocations.push('dirW');
          } else if (Math.abs(posXVal - 118) < 1) {
            // East unsafe
            data.ifritRadiantPlumeLocations.push('dirE');
          }
        }
        // Remove duplicates
        data.ifritRadiantPlumeLocations = data.ifritRadiantPlumeLocations
          .filter((pos, index) => data.ifritRadiantPlumeLocations.indexOf(pos) === index);
        // 3 danger spots means we only have one safe spot left
        return data.ifritRadiantPlumeLocations.length === 3;
      },
      suppressSeconds: 5,
      infoText: (data, _matches, output) => {
        if (data.ifritRadiantPlumeLocations.length < 3)
          return;
        const safeDir = Directions.outputCardinalDir.filter((dir) =>
          !data.ifritRadiantPlumeLocations.includes(dir)
        )[0];
        return output[safeDir ?? 'unknown']();
      },
      outputStrings: {
        unknown: Outputs.unknown,
        ...Directions.outputStringsCardinalDir,
      },
    },
    {
      id: 'UWU Ifrit Vulcan Burst',
      type: 'StartsUsing',
      netRegex: { id: '25B7', source: 'Ifrit', capture: false },
      response: Responses.knockback(),
    },
    {
      id: 'UWU Ifrit Nail Adds',
      type: 'AddedCombatant',
      netRegex: { npcNameId: '1186', npcBaseId: '8731' },
      condition: (data, matches) => {
        data.nailAdds.push(matches);
        return data.nailAdds.length === 4;
      },
      alertText: (data, _matches, output) => {
        // Nails are always on cardinals and intercardinals.
        // The back two nails are always 135 degrees apart and the front two are 45 degrees apart,
        // and the front and back nails are 90 degrees apart from each other. Thus, you can figure
        // out the orientation based on relative positions from the origin.
        //
        // One possible example of directions:
        // 0 = back right
        // 3 = back left
        // 5 = front left
        // 6 = front right
        const dirs = data.nailAdds.map((m) => {
          return Directions.addedCombatantPosTo8Dir(m, centerX, centerY);
        }).sort();
        for (let i = 0; i < dirs.length; ++i) {
          const this8Dir = dirs[i];
          const next8Dir = dirs[(i + 1) % dirs.length];
          if (this8Dir === undefined || next8Dir === undefined)
            break;
          // The two close nails are 45 degrees apart.
          if (next8Dir - this8Dir === 1 || this8Dir - next8Dir === 7) {
            const between16Dir = this8Dir * 2 + 1;
            const outputKey = Directions.output16Dir[between16Dir] ?? 'unknown';
            return output.text({ dir: output[outputKey]() });
          }
        }
      },
      outputStrings: {
        text: {
          en: 'Near: ${dir}',
          de: 'Nahe: ${dir}',
          cn: '近: ${dir}',
          ko: '가까운 기둥: ${dir}',
        },
        ...Directions.outputStrings16Dir,
      },
    },
    {
      id: 'UWU Ifrit Nail Deaths',
      type: 'Ability',
      netRegex: { id: '2B58' },
      condition: (data, matches) => {
        if (data.nailDeaths[matches.sourceId] === undefined) {
          data.nailDeaths[matches.sourceId] = matches;
          data.nailDeathOrder.push(matches.sourceId);
        }
        return data.nailDeathOrder.length === 4;
      },
      suppressSeconds: 999999,
      run: (data) => {
        // No need to check awoken status here, we'll just look for the status effect later.
        const idToDir = {};
        // lastDir is an 8-value direction but modulo 4.
        let lastDir;
        let lastRotationDir;
        for (const key of data.nailDeathOrder) {
          const m = data.nailDeaths[key];
          if (m === undefined)
            return;
          const x = parseFloat(m.x);
          const y = parseFloat(m.y);
          // Since dashes go through one direction and its opposite, map to N/NE/E/SE zone.
          // Consider a valid kill order to be sequential in either direction.
          // Most people do Z or reverse Z, but there's many valid orders (e.g. bowtie/fish).
          const this8Dir = Directions.xyTo8DirNum(x, y, centerX, centerY);
          idToDir[m.sourceId] = this8Dir;
          const thisDir = this8Dir % 4;
          if (lastDir === undefined) {
            lastDir = thisDir;
            continue;
          }
          const isCW = thisDir - lastDir === 1 || lastDir - thisDir === 3;
          const isCCW = lastDir - thisDir === 1 || thisDir - lastDir === 3;
          const thisRotationDir = isCW ? 'cw' : isCCW ? 'ccw' : undefined;
          lastDir = thisDir;
          // Invalid nail kill order.
          if (thisRotationDir === undefined)
            return;
          if (lastRotationDir === undefined) {
            lastRotationDir = thisRotationDir;
            continue;
          }
          // Invalid nail kill order.
          if (thisRotationDir !== lastRotationDir)
            return;
        }
        const firstNailId = data.nailDeathOrder[0];
        const lastNailId = data.nailDeathOrder[3];
        data.nailDeathRotationDir = lastRotationDir;
        if (firstNailId !== undefined)
          data.nailDeathFirst8Dir = idToDir[firstNailId];
        if (lastNailId !== undefined)
          data.nailDeathLast8Dir = idToDir[lastNailId];
      },
    },
    {
      id: 'UWU Ifrit Fetters',
      type: 'Tether',
      // This is GainsEffect effectId 179 as well applied to each player
      // but reapplied when the count changes due to distance.
      netRegex: { id: '0009' },
      condition: (data, matches) =>
        matches.target === data.me || matches.source === data.me,
      infoText: (data, matches, output) => {
        const otherPlayer = matches.target === data.me ? matches.source : matches.target;
        return output.fetters({ player: data.party.member(otherPlayer) });
      },
      outputStrings: {
        fetters: {
          en: 'Fetters (w/${player})',
          de: 'Fesseln (mit ${player})',
          cn: '锁链 (与 /${player})',
          ko: '사슬 (+${player})',
        },
      },
    },
    {
      id: 'UWU Ifrit Searing Wind',
      type: 'StartsUsing',
      netRegex: { id: '2B5B', source: 'Ifrit' },
      condition: Conditions.targetIsYou(),
      alarmText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Searing Wind on YOU',
          de: 'Versengen auf DIR',
          fr: 'Carbonisation sur VOUS',
          ja: '自分に灼熱',
          cn: '灼热咆哮点名',
          ko: '작열 대상자',
        },
      },
    },
    {
      id: 'UWU Ifrit Hellfire',
      type: 'StartsUsing',
      netRegex: { id: '2B5E', source: 'Ifrit', capture: false },
      condition: (data) => data.phase === 'ifrit',
      response: Responses.aoe(),
    },
    {
      id: 'UWU Ifrit Name Toggle Counter',
      type: 'NameToggle',
      netRegex: { name: 'Ifrit', toggle: '00', capture: false },
      run: (data) => data.ifritUntargetableCount++,
    },
    {
      id: 'UWU Ifrit Dash Safe Spot 1',
      type: 'NameToggle',
      netRegex: { name: 'Ifrit', toggle: '00', capture: false },
      condition: (data) => data.ifritUntargetableCount === 1,
      durationSeconds: 5,
      alertText: (data, _matches, output) => {
        const firstNailDir = data.nailDeathFirst8Dir;
        const rotationType = data.nailDeathRotationDir;
        if (firstNailDir === undefined || rotationType === undefined)
          return;
        const oppositeRotation = rotationType === 'cw' ? 7 : 1;
        const isIntercard = firstNailDir % 2 === 1;
        // For the first jump, we need to end on an intercard.
        // If we're already on an intercard, just stop there. IMO, it's better to have the first
        // Ifrit jump directly on the party where it's obvious which way you need to adjusut.
        // For the second jump, the first Ifrit jumps directly on the first nail location,
        // if that's not an intercard, initial start is good, otherwise party needs to rotate 45
        // in the opposite direction they will be rotating to avoid dashes.
        const dir1 = isIntercard ? firstNailDir : (firstNailDir + oppositeRotation) % 8;
        const dir2 = (dir1 + 4) % 8;
        const dir1Str = output[Directions.outputFrom8DirNum(dir1)]();
        const dir2Str = output[Directions.outputFrom8DirNum(dir2)]();
        return output.intercardSafeSpot({ dir1: dir1Str, dir2: dir2Str });
      },
      outputStrings: {
        intercardSafeSpot: {
          en: '${dir1} / ${dir2}',
          de: '${dir1} / ${dir2}',
          cn: '${dir1} / ${dir2}',
          ko: '${dir1} / ${dir2}',
        },
        ...Directions.outputStrings8Dir,
      },
    },
    {
      id: 'UWU Ifrit Dash Safe Spot 2 Adjust',
      type: 'NameToggle',
      netRegex: { name: 'Ifrit', toggle: '00', capture: false },
      // Unfortunately no way to know for sure if Ifrit dies before dashes.
      condition: (data) => data.ifritUntargetableCount === 2 && data.ifritAwoken,
      infoText: (data, _matches, output) => {
        const firstNailDir = data.nailDeathFirst8Dir;
        const rotationType = data.nailDeathRotationDir;
        if (firstNailDir === undefined || rotationType === undefined)
          return;
        // If we didn't start on an intercard, then we are already safe.
        const isIntercard = firstNailDir % 2 === 1;
        if (!isIntercard)
          return;
        // Adjust the opposite direction of rotation, e.g. we are rotating clockwise
        // and Ifrit hops on the party SE, the party needs to go to E to rotate into
        // the first Ifrit at SE.
        const dirStr = rotationType === 'cw' ? output.counterclockwise() : output.clockwise();
        return output.text({ rotation: dirStr });
      },
      outputStrings: {
        text: {
          en: 'Adjust 45° ${rotation}',
          de: 'Rotiere 45° ${rotation}',
          cn: '${rotation} 旋转 45°',
          ko: '${rotation} 45° 이동',
        },
        clockwise: Outputs.clockwise,
        counterclockwise: Outputs.counterclockwise,
      },
    },
    {
      id: 'UWU Ifrit Dash Safe Spot 2',
      type: 'NameToggle',
      netRegex: { name: 'Ifrit', toggle: '00', capture: false },
      condition: (data) => data.ifritUntargetableCount === 2 && data.ifritAwoken,
      // Here's one log file example for this timing.
      // [20:38:36.510] NameToggle 22:40017C12:Ifrit:40017C12:Ifrit:00
      // [20:38:38.245] 261 105:Change:40017C12:Heading:2.3562:PosX:86.3000:PosY:113.7000:PosZ:0.0000
      // [20:38:40.919] StartsCasting 14:40017C0F:Ifrit:2B5F:Crimson Cyclone:40017C0F:Ifrit:2.700:113.70:113.70:0.00:-2.36
      // [20:38:42.343] StartsCasting 14:40017C11:Ifrit:2B5F:Crimson Cyclone:40017C11:Ifrit:2.700:100.00:80.50:0.00:0.00
      // [20:38:43.725] StartsCasting 14:40017C12:Ifrit:2B5F:Crimson Cyclone:40017C12:Ifrit:2.700:86.30:113.70:0.00:2.36
      // [20:38:45.152] StartsCasting 14:40017C10:Ifrit:2B5F:Crimson Cyclone:40017C10:Ifrit:2.700:80.50:100.00:0.00:1.57
      delaySeconds: 2.5,
      promise: async (data) => {
        data.combatantData = [];
        if (data.bossId.ifrit === undefined)
          return;
        // The real Ifrit is the one that is Awoken so find where he is.
        data.combatantData = (await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(data.bossId.ifrit, 16)],
        })).combatants;
      },
      alertText: (data, _matches, output) => {
        // If killed before dashes occur, and geocrush has started casting, suppress this.
        if (data.phase === 'titan')
          return;
        const [combatant] = data.combatantData;
        if (combatant === undefined || data.combatantData.length !== 1)
          return;
        const firstNailDir = data.nailDeathFirst8Dir;
        const rotationType = data.nailDeathRotationDir;
        if (firstNailDir === undefined || rotationType === undefined)
          return;
        const oppositeRotationDir = rotationType === 'cw' ? -1 : 1;
        const rotationDir = rotationType === 'cw' ? 1 : -1;
        const startDir = (firstNailDir + oppositeRotationDir + 8) % 8;
        const ifritDir = Directions.combatantStatePosTo8Dir(combatant, centerX, centerY);
        for (let i = 1; i < 4; ++i) {
          const dashDir = (startDir + i * rotationDir + 8) % 8;
          if (dashDir % 4 !== ifritDir % 4)
            continue;
          // If Ifrit is the first or third dash, we rotate 45 degrees, otherwise 90.
          const finalRotation = (i === 1 || i === 3) ? rotationDir : rotationDir * 2;
          const finalDir = (startDir + finalRotation + 8) % 8;
          const finalDirStr = output[Directions.outputFrom8DirNum(finalDir)]();
          const rotation = rotationType === 'cw' ? output.clockwise() : output.counterclockwise();
          if (i === 1)
            return output.awokenDash1({ rotation: rotation, dir: finalDirStr });
          if (i === 2)
            return output.awokenDash2({ rotation: rotation, dir: finalDirStr });
          if (i === 3)
            return output.awokenDash3({ rotation: rotation, dir: finalDirStr });
          if (i === 4)
            return output.awokenDash4({ rotation: rotation, dir: finalDirStr });
        }
      },
      outputStrings: {
        awokenDash1: {
          en: '${rotation} 45° to ${dir} (fast)',
          de: '${rotation} 45° nach ${dir} (schnell)',
          cn: '${rotation} 45° 到 ${dir} (快)',
          ko: '${rotation} 45° ${dir}까지 (빠르게)',
        },
        awokenDash2: {
          en: '${rotation} 90° to ${dir} (fast)',
          de: '${rotation} 90° nach ${dir} (schnell)',
          cn: '${rotation} 90° 到 ${dir} (快)',
          ko: '${rotation} 90° ${dir}까지 (빠르게)',
        },
        awokenDash3: {
          en: '${rotation} 45° to ${dir} (slow)',
          de: '${rotation} 45° nach ${dir} (langsam)',
          cn: '${rotation} 45° 到 ${dir} (慢)',
          ko: '${rotation} 45° ${dir}까지 (천천히)',
        },
        awokenDash4: {
          en: '${rotation} 90° to ${dir} (slow)',
          de: '${rotation} 90° nach ${dir} (langsam)',
          cn: '${rotation} 90° 到 ${dir} (慢)',
          ko: '${rotation} 90° ${dir}까지 (천천히)',
        },
        clockwise: Outputs.clockwise,
        counterclockwise: Outputs.counterclockwise,
        ...Directions.outputStrings8Dir,
      },
    },
    {
      id: 'UWU Ifrit Flaming Crush',
      type: 'HeadMarker',
      netRegex: { id: '0075', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Stack',
          de: 'Stack',
          fr: 'Packez-vous',
          ja: '頭割り',
          cn: '集合',
          ko: '집합',
        },
      },
    },
    // --------- Titan ----------
    {
      id: 'UWU Titan Bury Direction',
      type: 'AddedCombatant',
      netRegex: { npcNameId: '1803' },
      condition: (data, matches) => {
        (data.titanBury ??= []).push(matches);
        return data.titanBury.length === 5;
      },
      alertText: (data, _matches, output) => {
        const bombs = (data.titanBury ?? []).map((matches) => {
          return { x: parseFloat(matches.x), y: parseFloat(matches.y) };
        });
        if (bombs.length !== 5) {
          console.error(`Titan Bury: wrong bombs size: ${JSON.stringify(data.titanBury)}`);
          return;
        }
        // 5 bombs drop, and then a 6th later.
        // They all drop on one half of the arena, and then 3 on one half and 2 on the other.
        // e.g. all 5 drop on north half, 3 on west half, 2 on east half.
        const numDir = [0, 0, 0, 0]; // north, east, south, west
        for (const bomb of bombs) {
          if (bomb.y < centerY)
            numDir[0]++;
          else
            numDir[2]++;
          if (bomb.x < centerX)
            numDir[3]++;
          else
            numDir[1]++;
        }
        for (let idx = 0; idx < numDir.length; ++idx) {
          if (numDir[idx] !== 5)
            continue;
          // Example: dir is 1 (east), party is west, facing west.
          // We need to check dir 0 (north, aka "right") and dir 2 (south, aka "left").
          const numLeft = numDir[(idx + 1) % 4] ?? -1;
          const numRight = numDir[(idx - 1 + 4) % 4] ?? -1;
          if (numRight === 2 && numLeft === 3)
            return output.right();
          if (numRight === 3 && numLeft === 2)
            return output.left();
          console.error(
            `Titan Bury: bad counts: ${
              JSON.stringify(data.titanBury)
            }, ${idx}, ${numLeft}, ${numRight}`,
          );
          return;
        }
        console.error(`Titan Bury: failed to find dir: ${JSON.stringify(data.titanBury)}`);
      },
      outputStrings: {
        left: Outputs.left,
        right: Outputs.right,
      },
    },
    {
      id: 'UWU Titan Gaols',
      type: 'Ability',
      netRegex: { id: ['2B6C', '2B6B'], source: ['Garuda', 'Titan'] },
      condition: (data) => !data.seenTitanGaols,
      preRun: (data, matches) => {
        data.titanGaols.push(matches.target);
        if (data.titanGaols.length !== 3)
          return;
        const rawGaolOrder = [
          data.triggerSetConfig.gaolOrder1,
          data.triggerSetConfig.gaolOrder2,
          data.triggerSetConfig.gaolOrder3,
          data.triggerSetConfig.gaolOrder4,
          data.triggerSetConfig.gaolOrder5,
          data.triggerSetConfig.gaolOrder6,
          data.triggerSetConfig.gaolOrder7,
          data.triggerSetConfig.gaolOrder8,
          data.triggerSetConfig.gaolOrder9,
          data.triggerSetConfig.gaolOrder10,
          data.triggerSetConfig.gaolOrder11,
          data.triggerSetConfig.gaolOrder12,
          data.triggerSetConfig.gaolOrder13,
          data.triggerSetConfig.gaolOrder14,
          data.triggerSetConfig.gaolOrder15,
          data.triggerSetConfig.gaolOrder16,
          data.triggerSetConfig.gaolOrder17,
          data.triggerSetConfig.gaolOrder18,
          data.triggerSetConfig.gaolOrder19,
          data.triggerSetConfig.gaolOrder20,
        ].map((x) => x.trim()).filter((x) => x !== '');
        const partyNames = [...data.party.partyNames].sort((a, b) => a.localeCompare(b));
        // Merge jobs and names into a single list of names.
        const gaolOrder = [];
        for (const entry of rawGaolOrder) {
          if (entry.length !== 3) {
            gaolOrder.push(entry.toLocaleLowerCase());
            continue;
          }
          const uppercaseJobEntry = entry.toUpperCase();
          for (const name of partyNames) {
            const jobStr = data.party.jobName(name);
            if (jobStr === uppercaseJobEntry)
              gaolOrder.push(name.toLocaleLowerCase());
          }
        }
        data.titanGaols.sort((a, b) => {
          // Sort by `gaolOrder` and then alphabetical for names not in the list.
          const aIdx = gaolOrder.indexOf(a.toLocaleLowerCase());
          const bIdx = gaolOrder.indexOf(b.toLocaleLowerCase());
          if (aIdx === -1 && bIdx !== -1)
            return 1;
          if (bIdx === -1 && aIdx !== -1)
            return -1;
          if (aIdx < bIdx)
            return -1;
          if (bIdx < aIdx)
            return 1;
          return a.localeCompare(b);
        });
        if (data.options.Debug) {
          console.log(`GAOL CONFIG: ${JSON.stringify(rawGaolOrder)}`);
          console.log(`GAOL CONFIG NAME ORDER: ${JSON.stringify(gaolOrder)}`);
          console.log(`GAOL FINAL ORDER: ${JSON.stringify(data.titanGaols)}`);
        }
      },
      alertText: (data, _matches, output) => {
        if (data.titanGaols.length !== 3)
          return;
        const idx = data.titanGaols.indexOf(data.me);
        if (idx < 0)
          return;
        // Just return your number.
        return output[`num${idx + 1}`]();
      },
      infoText: (data, _matches, output) => {
        if (data.titanGaols.length !== 3)
          return;
        return output.text({
          player1: data.party.member(data.titanGaols[0]),
          player2: data.party.member(data.titanGaols[1]),
          player3: data.party.member(data.titanGaols[2]),
        });
      },
      outputStrings: {
        num1: Outputs.num1,
        num2: Outputs.num2,
        num3: Outputs.num3,
        text: {
          en: '${player1}, ${player2}, ${player3}',
          de: '${player1}, ${player2}, ${player3}',
          fr: '${player1}, ${player2}, ${player3}',
          ja: '${player1}, ${player2}, ${player3}',
          cn: '${player1}, ${player2}, ${player3}',
          ko: '${player1}, ${player2}, ${player3}',
        },
      },
    },
    {
      // If anybody dies to bombs (WHY) and a rock is on them, then glhf.
      id: 'UWU Titan Bomb Failure',
      type: 'Ability',
      netRegex: { id: '2B6A', source: 'Bomb Boulder' },
      condition: (data) => !data.seenTitanGaols,
      alarmText: (data, matches, output) => {
        const idx = data.titanGaols.indexOf(matches.target);
        if (idx === -1)
          return;
        const numStr = output[`num${idx + 1}`]();
        return output.text({ num: numStr, player: data.party.member(matches.target) });
      },
      outputStrings: {
        // In case people want to replace 1/2/3 with front/mid/back or something.
        num1: Outputs.num1,
        num2: Outputs.num2,
        num3: Outputs.num3,
        text: {
          en: 'Everyone to ${num} (${player} died)',
          de: 'Alle zur ${num} (${player} ist gestorben)',
          cn: '所有人到 ${num} (${player}死亡)',
          ko: '전부다 ${num} 쪽으로 (${player} 죽음)',
        },
      },
    },
    {
      id: 'UWU Titan Gaol Granite Impact',
      type: 'StartsUsing',
      netRegex: { id: '2B6D', capture: false },
      // Prevent Titan Bomb Failure from happening later in the phase.
      run: (data) => data.seenTitanGaols = true,
    },
    // --------- Intermission ----------
    {
      id: 'UWU Caster LB',
      type: 'AddedCombatant',
      // 2137 = Magitek Bit
      netRegex: { npcNameId: '2137', capture: false },
      condition: (data) =>
        Util.isCasterDpsJob(data.job) && data.beyondLimits.has(data.me) &&
        data.phase === 'intermission',
      suppressSeconds: 5,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Caster LB NOW!',
          de: 'Magier LB JETZT!',
          cn: '法系LB!',
          ko: '캐스터 리밋!',
        },
      },
    },
    {
      id: 'UWU Healer LB',
      type: 'Ability',
      // 2B73 = Blight
      netRegex: { id: '2B73', source: 'Lahabrea', capture: false },
      condition: (data) => Util.isHealerJob(data.job) && data.beyondLimits.has(data.me),
      suppressSeconds: 5,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Healer LB NOW!',
          de: 'Heiler LB JETZT!',
          cn: '奶妈LB!',
          ko: '힐러 리밋!',
        },
      },
    },
    {
      id: 'UWU Melee LB',
      type: 'StartsUsing',
      // 2B74 = Dark IV
      netRegex: { id: '2B74', source: 'Lahabrea', capture: false },
      condition: (data) => Util.isMeleeDpsJob(data.job) && data.beyondLimits.has(data.me),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Melee LB NOW!',
          de: 'Nahkämpfer LB JETZT!',
          cn: '近战LB!',
          ko: '근딜 리밋!',
        },
      },
    },
    {
      id: 'UWU Ultima',
      type: 'StartsUsing',
      netRegex: { id: '2B8B', capture: false },
      condition: (data) => data.role === 'tank',
      alarmText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Tank LB NOW',
          de: 'JETZT Tank LB',
          fr: 'Transcendance Tank maintenant !',
          ja: '今タンクLB',
          cn: '坦克LB',
          ko: '탱리밋',
        },
      },
    },
    // --------- Predation ----------
    {
      id: 'UWU Predation',
      comment: {
        en: '"early safe" here means that you can move before the first Ifrit dash.',
        de:
          '"früh sicher" bedeutet hier, dass man such auch schon for dem ersten Ifrit Dash bewegen kann.',
        cn: '这里的 "提前安全" 指你可以在伊弗利特第一次冲锋前移动。',
        ko: '여기서 "안전"이란 첫 이프리트 돌진 전에 미리 가 있어도 된다는 의미입니다.',
      },
      type: 'StartsUsing',
      netRegex: { id: '2B76', source: 'The Ultima Weapon', capture: false },
      // [21:55:41.426] StartsCasting 14:4000BB88:The Ultima Weapon:2B76:Ultimate Predation:4000BB88:The Ultima Weapon:2.700:99.99:89.98:0.00:3.14
      // [21:55:44.404] ActionEffect 15:4000BB88:The Ultima Weapon:2B76:Ultimate Predation:4000BB88:The Ultima Weapon:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:3215688:3746181:0:10000:::99.99:89.98:0.00:3.14:3215688:3746181:0:10000:::99.99:89.98:0.00:3.14:0000A459:0:1
      // [21:55:48.850] NameToggle 22:4000BB88:The Ultima Weapon:4000BB88:The Ultima Weapon:00
      // [21:55:50.500] 261 105:Change:4000BB8E:Heading:-2.3563:PosX:103.0000:PosY:103.0000:PosZ:0.0000
      // [21:55:50.500] 261 105:Change:4000BB89:Heading:-1.5709:PosX:117.0000:PosY:97.0000:PosZ:0.0000
      // [21:55:50.500] 261 105:Change:4000BB8D:Heading:-2.3563:PosX:113.7000:PosY:113.7000:PosZ:0.0000
      // [21:55:50.500] 261 105:Change:4000BB88:Heading:2.3562:PosX:88.0000:PosY:112.0000:PosZ:0.0000
      // [21:55:56.229] StartsCasting 14:4000BB8D:Ifrit:2B5F:Crimson Cyclone:4000BB8D:Ifrit:2.700:113.70:113.70:0.00:-2.36
      delaySeconds: 10,
      durationSeconds: 5,
      promise: async (data) => {
        data.combatantData = [];
        const hexIds = Object.values(data.bossId);
        data.combatantData = (await callOverlayHandler({
          call: 'getCombatants',
          ids: hexIds.map((x) => parseInt(x, 16)),
        })).combatants;
      },
      alertText: (data, _matches, output) => {
        const findBoss = (key) => {
          const hexId = data.bossId[key];
          if (hexId === undefined)
            return undefined;
          const decId = parseInt(hexId, 16);
          return data.combatantData.find((x) => x.ID === decId);
        };
        const garuda = findBoss('garuda');
        const ifrit = findBoss('ifrit');
        const titan = findBoss('titan');
        const ultima = findBoss('ultima');
        if (
          garuda === undefined || ifrit === undefined || titan === undefined || ultima === undefined
        )
          return;
        // Garuda always at +/- 3 from center on an intercardinal.
        const garudaDir = Directions.xyTo8DirNum(garuda.PosX, garuda.PosY, centerX, centerY);
        if (garudaDir % 2 === 0)
          return;
        // e.g. Garuda is NW (7), the two safe directions are E (2) and S (4).
        let safeDir = [(garudaDir + 3) % 8, (garudaDir + 5) % 8];
        // Titan appears slightly offset from a cardinal. Never run out towards Titan.
        // TODO: Titan is slightly offset and you could theoretically pick a slightly
        // safer cardinal in some cases (I think?) depending on how landslides aim from there.
        const titanDir = Directions.xyTo8DirNum(titan.PosX, titan.PosY, centerX, centerY);
        safeDir = safeDir.filter((x) => x !== titanDir);
        // Ultima appears on an intercardinal. If Ultima is adjacent to only one of the safe spots,
        // then pick the other safe spot because it will have more safe directions to run 2nd.
        const ultimaDir = Directions.xyTo8DirNum(ultima.PosX, ultima.PosY, centerX, centerY);
        const notAdjacentToUltima = safeDir.filter((x) => {
          const isAdjacentToUltima = x === (ultimaDir + 1) % 8 || ultimaDir === (x + 1) % 8;
          return !isAdjacentToUltima;
        });
        // If there's at least one cardinal not next to Ultima, pick one of those.
        if (notAdjacentToUltima.length !== 0)
          safeDir = safeDir.filter((x) => notAdjacentToUltima.includes(x));
        // Ifrit always is on an intercard and dashes through it.
        const ifritDir = Directions.xyTo8DirNum(ifrit.PosX, ifrit.PosY, centerX, centerY);
        const dirStrMap = {
          0: output.dirN(),
          2: output.dirE(),
          4: output.dirS(),
          6: output.dirW(),
        };
        // (1) Do any of our safe spots have an early safe spot where you could
        // go stand on the wall immediately?
        for (const dir of safeDir) {
          for (const run of [-1, 1]) {
            const final = (dir + run + 8) % 8;
            if (final === ultimaDir)
              continue;
            // Will Ifrit dash through this or the opposite side?
            if (final % 4 === ifritDir % 4)
              continue;
            const rotation = run === -1 ? output.counterclockwise() : output.clockwise();
            return output.early({ dir: dirStrMap[dir], rotation: rotation });
          }
        }
        // (2) Are any safe spots opposite of Garuda (and not by Ultima)?
        const garudaOpposite = (garudaDir + 4) % 8;
        for (const dir of safeDir) {
          for (const run of [-1, 1]) {
            const final = (dir + run + 8) % 8;
            if (final === ultimaDir)
              continue;
            if (final !== garudaOpposite)
              continue;
            const rotation = run === -1 ? output.counterclockwise() : output.clockwise();
            return output.normal({ dir: dirStrMap[dir], rotation: rotation });
          }
        }
        // (3) Otherwise, just pick any safe spot and direction away from Ultima.
        for (const dir of safeDir) {
          for (const run of [-1, 1]) {
            // If both directions were safe from Ultima, we would have found an early spot,
            // since one of them would be safe from Ifrit as well. So, not possible to
            // say "either direction" here, so just pick the first safe direction.
            const final = (dir + run + 8) % 8;
            if (final === ultimaDir)
              continue;
            const rotation = run === -1 ? output.counterclockwise() : output.clockwise();
            return output.normal({ dir: dirStrMap[dir], rotation: rotation });
          }
        }
      },
      outputStrings: {
        early: {
          en: '${dir} => ${rotation} (early safe)',
          de: '${dir} => ${rotation} (früh sicher)',
          cn: '${dir} => ${rotation} (提前安全)',
          ko: '${dir} => ${rotation} (안전)',
        },
        normal: {
          en: '${dir} => ${rotation}',
          de: '${dir} => ${rotation}',
          cn: '${dir} => ${rotation}',
          ko: '${dir} => ${rotation}',
        },
        clockwise: Outputs.clockwise,
        counterclockwise: Outputs.counterclockwise,
        dirN: Outputs.dirN,
        dirE: Outputs.dirE,
        dirS: Outputs.dirS,
        dirW: Outputs.dirW,
      },
    },
    // --------- Suppression ----------
    {
      id: 'UWU Suppression Gaol',
      type: 'Ability',
      netRegex: { id: '2B6B', source: 'Titan' },
      condition: (data, matches) => data.phase === 'suppression' && data.me === matches.target,
      alarmText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Gaol on YOU',
          de: 'Granitgefängnis',
          fr: 'Geôle sur VOUS',
          ja: 'ジェイル',
          cn: '石牢点名',
          ko: '돌감옥 대상자',
        },
      },
    },
    {
      id: 'UWU Aetherochemical Laser Middle',
      type: 'StartsUsing',
      netRegex: { source: 'The Ultima Weapon', id: '2B84', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Middle Laser',
          de: 'Laser (Mitte)',
          fr: 'Laser (Milieu)',
          ja: 'レーザー (中央)',
          cn: '中间激光',
          ko: '가운데 레이저',
        },
      },
    },
    {
      id: 'UWU Aetherochemical Laser Right',
      type: 'StartsUsing',
      netRegex: { source: 'The Ultima Weapon', id: '2B85', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'North Laser',
          de: 'Laser (Norden)',
          fr: 'Laser (Nord)',
          ja: 'レーザー (北)',
          cn: '右侧激光',
          ko: '북쪽 레이저',
        },
      },
    },
    {
      id: 'UWU Aetherochemical Laser Left',
      type: 'StartsUsing',
      netRegex: { source: 'The Ultima Weapon', id: '2B86', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'East Laser',
          de: 'Laser (Osten)',
          fr: 'Laser (Est)',
          ja: 'レーザー (東)',
          cn: '左侧激光',
          ko: '동쪽 레이저',
        },
      },
    },
    // --------- Primal Roulette ----------
    {
      id: 'UWU Garuda Finale',
      type: 'Ability',
      netRegex: { source: 'The Ultima Weapon', id: '2CD3', capture: false },
      condition: (data) => data.phase === 'finale',
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Garuda',
          de: 'Garuda',
          fr: 'Garuda',
          ja: 'ガルーダ',
          cn: '迦楼罗',
          ko: '가루다',
        },
      },
    },
    {
      id: 'UWU Ifrit Finale',
      type: 'Ability',
      netRegex: { source: 'The Ultima Weapon', id: '2CD4', capture: false },
      condition: (data) => data.phase === 'finale',
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Ifrit',
          de: 'Ifrit',
          fr: 'Ifrit',
          ja: 'イフリート',
          cn: '伊弗利特',
          ko: '이프리트',
        },
      },
    },
    {
      id: 'UWU Titan Finale',
      type: 'Ability',
      netRegex: { source: 'The Ultima Weapon', id: '2CD5', capture: false },
      condition: (data) => data.phase === 'finale',
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Titan',
          de: 'Titan',
          fr: 'Titan',
          ja: 'タイタン',
          cn: '泰坦',
          ko: '타이탄',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Bomb Boulder': 'Bomber-Brocken',
        'Chirada': 'Chirada',
        'Garuda': 'Garuda',
        'Ifrit': 'Ifrit',
        'Lahabrea': 'Lahabrea',
        'Magitek Bit': 'Magitek-Drohne',
        'Spiny Plume': 'dornig(?:e|er|es|en) Federsturm',
        'Suparna': 'Suparna',
        'The Ultima Weapon': 'Ultima-Waffe',
        'Titan': 'Titan',
      },
      'replaceText': {
        'Aerial Blast': 'Windschlag',
        'Aetheric Boom': 'Ätherknall',
        'Aetherochemical Laser': 'Ätherochemischer Laser',
        '(?<! )Aetheroplasm': 'Ätheroplasma',
        'Apply Viscous': 'Ätheroplasma wirkt',
        'Blight': 'Pesthauch',
        'Bury': 'Begraben',
        'Ceruleum Vent': 'Erdseim-Entlüfter',
        'Citadel Siege': 'Belagerung der Zitadelle',
        'Crimson Cyclone': 'Zinnober-Zyklon',
        'Dark IV': 'Neka',
        'Diffractive Laser': 'Diffraktiver Laser',
        'Downburst': 'Fallböe',
        'Earthen Fury': 'Gaias Zorn',
        'Eruption': 'Eruption',
        'Eye Of The Storm': 'Auge des Sturms',
        'Feather Rain': 'Federregen',
        'Flaming Crush': 'Flammenstoß',
        'Freefire': 'Schwerer Beschuss',
        'Friction': 'Windklinge',
        'Geocrush': 'Geo-Stoß',
        'Great Whirlwind': 'Windhose',
        'Hellfire': 'Höllenfeuer',
        'Homing Lasers': 'Leitlaser',
        'Incinerate': 'Einäschern',
        'Infernal Fetters': 'Infernofesseln',
        'Inferno Howl': 'Brennende Wut',
        'Landslide': 'Bergsturz',
        'Light Pillar': 'Lichtsäule',
        'Mesohigh': 'Meso-Hoch',
        'Mistral Shriek': 'Mistral-Schrei',
        'Mistral Song': 'Mistral-Song',
        'Mountain Buster': 'Bergsprenger',
        'Nail Adds': 'Fessel Adds',
        'Radiant Plume': 'Scheiterhaufen',
        'Rock Buster': 'Steinsprenger',
        'Rock Throw': 'Granitgefängnis',
        'Searing Wind': 'Versengen',
        'Self-detonate': 'Zerbersten',
        'Slipstream': 'Wirbelströmung',
        'Summon Random Primal': 'Zufällige Primaebeschwörung',
        'Tank Purge': 'Tankreinigung',
        'Tumult': 'Urerschütterung',
        'Ultima(?!\\w)': 'Ultima',
        'Ultimate Annihilation': 'Ultimative Vernichtung',
        'Ultimate Predation': 'Ultimative Prädation',
        'Ultimate Suppression': 'Ultimative Unterdrückung',
        'Upheaval': 'Urtrauma',
        'Viscous Aetheroplasm': 'Viskoses Ätheroplasma',
        'Vulcan Burst': 'Feuerstoß',
        'Weight Of The Land': 'Gaias Gewicht',
        'Wicked Tornado': 'Tornado der Bosheit',
        'Wicked Wheel': 'Rad der Bosheit',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Bomb Boulder': 'bombo rocher',
        'Chirada': 'Chirada',
        'Garuda': 'Garuda',
        'Ifrit': 'Ifrit',
        'Lahabrea': 'Lahabrea',
        'Magitek Bit': 'drone magitek',
        'Spiny Plume': 'plume perforante',
        'Suparna': 'Suparna',
        'The Ultima Weapon': 'Ultima Arma',
        'Titan': 'Titan',
      },
      'replaceText': {
        'Aerial Blast': 'Rafale aérienne',
        'Aetheric Boom': 'Onde d\'éther',
        'Aetherochemical Laser': 'Laser magismologique',
        '(?<! )Aetheroplasm': 'Éthéroplasma',
        'Apply Viscous': 'Debuff Éthéroplasma',
        'Blight': 'Supplice',
        'Bury': 'Impact',
        'Ceruleum Vent': 'Exutoire à Céruleum',
        'Citadel Siege': 'Siège de citadelle',
        'Crimson Cyclone': 'Cyclone écarlate',
        'Dark IV': 'Giga Ténèbres',
        'Diffractive Laser': 'Laser diffractif',
        'Downburst': 'Rafale descendante',
        'Earthen Fury': 'Fureur tellurique',
        'Eruption': 'Éruption',
        'Eye Of The Storm': 'Œil du cyclone',
        'Feather Rain': 'Pluie de plumes',
        'Flaming Crush': 'Fracas de flammes',
        'Freefire': 'Tir d\'artillerie lourde',
        'Friction': 'Lame de vent',
        'Geocrush': 'Broie-terre',
        'Great Whirlwind': 'Grand tourbillon',
        'Hellfire': 'Flammes de l\'enfer',
        'Homing Lasers': 'Lasers autoguidés',
        'Incinerate': 'Incinération',
        'Infernal Fetters': 'Chaînes infernales',
        'Inferno Howl': 'Rugissement infernal',
        'Landslide': 'Glissement de terrain',
        'Light Pillar': 'Colonne lumineuse',
        'Mesohigh': 'Anticyclone de méso-échelle',
        'Mistral Shriek': 'Cri du mistral',
        'Mistral Song': 'Chant du mistral',
        'Mountain Buster': 'Casse-montagnes',
        'Nail Adds': 'Adds Clou',
        'Radiant Plume': 'Panache radiant',
        'Rock Buster': 'Casse-roc',
        'Rock Throw': 'Jeté de rocs',
        'Searing Wind': 'Carbonisation',
        'Self-detonate': 'Auto-atomisation',
        'Slipstream': 'Sillage',
        'Summon Random Primal': 'Invocation de primordial aléatoire',
        'Tank Purge': 'Vidange de réservoir',
        'Tumult': 'Tumulte',
        'Ultima(?!\\w)': 'Ultima',
        'Ultimate Annihilation': 'Fantasmagorie infernale',
        'Ultimate Predation': 'Fantasmagorie prédatrice',
        'Ultimate Suppression': 'Fantasmagorie bestiale',
        'Upheaval': 'Bouleversement',
        'Viscous Aetheroplasm': 'Éthéroplasma poisseux',
        'Vulcan Burst': 'Explosion volcanique',
        'Weight Of The Land': 'Poids de la terre',
        'Wicked Tornado': 'Tornade meurtrière',
        'Wicked Wheel': 'Roue mauvaise',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Bomb Boulder': 'ボムボルダー',
        'Chirada': 'チラーダ',
        'Garuda': 'ガルーダ',
        'Ifrit': 'イフリート',
        'Lahabrea': 'アシエン・ラハブレア',
        'Magitek Bit': '魔導ビット',
        'Spiny Plume': 'スパイニープルーム',
        'Suparna': 'スパルナ',
        'The Ultima Weapon': 'アルテマウェポン',
        'Titan': 'タイタン',
      },
      'replaceText': {
        'Aerial Blast': 'エリアルブラスト',
        'Aetheric Boom': 'エーテル波動',
        'Aetherochemical Laser': '魔科学レーザー',
        '(?<! )Aetheroplasm': 'エーテル爆雷',
        'Apply Viscous': '吸着式エーテル爆雷',
        'Blight': 'クラウダ',
        'Bury': '衝撃',
        'Ceruleum Vent': 'セルレアムベント',
        'Citadel Siege': 'シタデルシージ',
        'Crimson Cyclone': 'クリムゾンサイクロン',
        'Dark IV': 'ダージャ',
        'Diffractive Laser': '拡散レーザー',
        'Downburst': 'ダウンバースト',
        'Earthen Fury': '大地の怒り',
        'Eruption': 'エラプション',
        'Eye Of The Storm': 'アイ・オブ・ストーム',
        'Feather Rain': 'フェザーレイン',
        'Flaming Crush': 'フレイムクラッシュ',
        'Freefire': '誘爆',
        'Friction': 'ウィンドブレード',
        'Geocrush': 'ジオクラッシュ',
        'Great Whirlwind': '大旋風',
        'Hellfire': '地獄の火炎',
        'Homing Lasers': '誘導レーザー',
        'Incinerate': 'インシネレート',
        'Infernal Fetters': '炎獄の鎖',
        'Inferno Howl': '灼熱の咆吼',
        'Landslide': 'ランドスライド',
        'Light Pillar': 'リヒト・ゾイレ',
        'Mesohigh': 'メソハイ',
        'Mistral Shriek': 'ミストラルシュリーク',
        'Mistral Song': 'ミストラルソング',
        'Mountain Buster': 'マウンテンバスター',
        'Nail Adds': '雑魚: 楔',
        'Radiant Plume': '光輝の炎柱',
        'Rock Buster': 'ロックバスター',
        'Rock Throw': 'グラナイト・ジェイル',
        'Searing Wind': '熱風',
        'Self-detonate': '爆発霧散',
        'Slipstream': 'スリップストリーム',
        'Summon Random Primal': 'ランダム蛮神を召喚',
        'Tank Purge': '魔導フレア',
        'Tumult': '激震',
        'Ultima(?!\\w)': 'アルテマ',
        'Ultimate Annihilation': '爆撃の究極幻想',
        'Ultimate Predation': '追撃の究極幻想',
        'Ultimate Suppression': '乱撃の究極幻想',
        'Upheaval': '大激震',
        'Viscous Aetheroplasm': '吸着爆雷起爆',
        'Vulcan Burst': 'バルカンバースト',
        'Weight Of The Land': '大地の重み',
        'Wicked Tornado': 'ウィケッドトルネード',
        'Wicked Wheel': 'ウィケッドホイール',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Bomb Boulder': '爆破岩石',
        'Chirada': '妙翅',
        'Garuda': '迦楼罗',
        'Ifrit': '伊弗利特',
        'Lahabrea': '拉哈布雷亚',
        'Magitek Bit': '浮游炮射出',
        'Spiny Plume': '刺羽',
        'Suparna': '美翼',
        'The Ultima Weapon': '究极神兵',
        'Titan': '泰坦',
      },
      'replaceText': {
        'Aerial Blast': '大气爆发',
        'Aetheric Boom': '以太波动',
        'Aetherochemical Laser': '魔科学激光',
        '(?<! )Aetheroplasm': '以太爆雷',
        'Apply Viscous': '吸附式炸弹',
        'Blight': '毒雾',
        'Bury': '塌方',
        'Ceruleum Vent': '青磷放射',
        'Citadel Siege': '堡垒围攻',
        'Crimson Cyclone': '深红旋风',
        'Dark IV': '冥暗',
        'Diffractive Laser': '扩散射线',
        'Downburst': '下行突风',
        'Earthen Fury': '大地之怒',
        'Eruption': '地火喷发',
        'Eye Of The Storm': '台风眼',
        'Feather Rain': '飞翎雨',
        'Flaming Crush': '烈焰碎击',
        'Freefire': '诱导爆炸',
        'Friction': '烈风刃',
        'Geocrush': '大地粉碎',
        'Great Whirlwind': '大龙卷风',
        'Hellfire': '地狱之火炎',
        'Homing Lasers': '诱导射线',
        'Incinerate': '烈焰焚烧',
        'Infernal Fetters': '火狱之锁',
        'Inferno Howl': '灼热咆哮',
        'Landslide': '地裂',
        'Light Pillar': '光柱',
        'Mesohigh': '中高压',
        'Mistral Shriek': '寒风之啸',
        'Mistral Song': '寒风之歌',
        'Mountain Buster': '山崩',
        'Nail Adds': '火神柱',
        'Radiant Plume': '光辉炎柱',
        'Rock Buster': '碎岩',
        'Rock Throw': '花岗岩牢狱',
        'Searing Wind': '灼热',
        'Self-detonate': '雾散爆发',
        'Slipstream': '螺旋气流',
        'Summon Random Primal': '召唤随机蛮神',
        'Tank Purge': '魔导核爆',
        'Tumult': '怒震',
        'Ultima(?!\\w)': '究极',
        'Ultimate Annihilation': '爆击之究极幻想',
        'Ultimate Predation': '追击之究极幻想',
        'Ultimate Suppression': '乱击之究极幻想',
        'Upheaval': '大怒震',
        'Viscous Aetheroplasm': '引爆吸附式炸弹',
        'Vulcan Burst': '火神爆裂',
        'Weight Of The Land': '大地之重',
        'Wicked Tornado': '邪气龙卷',
        'Wicked Wheel': '邪轮旋风',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Bomb Boulder': '바위폭탄',
        'Chirada': '치라다',
        'Garuda': '가루다',
        'Ifrit': '이프리트',
        'Lahabrea': '아씨엔 라하브레아',
        'Magitek Bit': '마도 비트',
        'Spiny Plume': '가시돋힌 깃털',
        'Suparna': '수파르나',
        'The Ultima Weapon': '알테마 웨폰',
        'Titan': '타이탄',
      },
      'replaceText': {
        'Aerial Blast': '대기 폭발',
        'Aetheric Boom': '에테르 파동',
        'Aetherochemical Laser': '마과학 레이저',
        '(?<! )Aetheroplasm': '에테르 폭뢰',
        'Apply Viscous': '흡착식 에테르 폭뢰',
        'Blight': '독안개',
        'Bury': '충격',
        'Ceruleum Vent': '청린 방출',
        'Citadel Siege': '공성',
        'Crimson Cyclone': '진홍 회오리',
        'Dark IV': '다쟈',
        'Diffractive Laser': '확산 레이저',
        'Downburst': '하강 기류',
        'Earthen Fury': '대지의 분노',
        'Eruption': '용암 분출',
        'Eye Of The Storm': '태풍의 눈',
        'Feather Rain': '깃털비',
        'Flaming Crush': '화염 작열',
        'Freefire': '유폭',
        'Friction': '바람의 칼날',
        'Geocrush': '대지 붕괴',
        'Great Whirlwind': '대선풍',
        'Hellfire': '지옥의 화염',
        'Homing Lasers': '유도 레이저',
        'Incinerate': '소각',
        'Infernal Fetters': '염옥의 사슬',
        'Inferno Howl': '작열의 포효',
        'Landslide': '산사태',
        'Light Pillar': '빛 기둥',
        'Mesohigh': '뇌우고기압',
        'Mistral Shriek': '삭풍의 비명',
        'Mistral Song': '삭풍의 노래',
        'Mountain Buster': '산 쪼개기',
        'Nail Adds': '염옥의 말뚝',
        'Radiant Plume': '광휘의 불기둥',
        'Rock Buster': '바위 쪼개기',
        'Rock Throw': '화강암 감옥',
        'Searing Wind': '열풍',
        'Self-detonate': '자가폭발',
        'Slipstream': '반동 기류',
        'Summon Random Primal': '무작위 야만신 소환',
        'Tank Purge': '마도 플레어',
        'Tumult': '격진',
        'Ultima(?!\\w)': '알테마',
        'Ultimate Annihilation': '궁극의 폭격 환상',
        'Ultimate Predation': '궁극의 추격 환상',
        'Ultimate Suppression': '궁극의 난격 환상',
        'Upheaval': '대격진',
        'Viscous Aetheroplasm': '흡착 폭뢰 기폭',
        'Vulcan Burst': '폭렬 난사',
        'Weight Of The Land': '대지의 무게',
        'Wicked Tornado': '마녀의 회오리',
        'Wicked Wheel': '마녀의 수레바퀴',
      },
    },
  ],
});
