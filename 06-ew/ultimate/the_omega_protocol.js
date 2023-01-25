const playstationMarkers = ['circle', 'cross', 'triangle', 'square'];
// Due to changes introduced in patch 5.2, overhead markers now have a random offset
// added to their ID. This offset currently appears to be set per instance, so
// we can determine what it is from the first overhead marker we see.
const headmarkers = {
  // vfx/lockon/eff/lockon5_t0h.avfx
  'spread': '0017',
  // vfx/lockon/eff/tank_lockonae_5m_5s_01k1.avfx
  'buster': '0157',
  // vfx/lockon/eff/z3oz_firechain_01c.avfx through 04c
  'firechainCircle': '01A0',
  'firechainTriangle': '01AB',
  'firechainSquare': '01AC',
  'firechainX': '01AD',
};
const playstationHeadmarkerIds = [
  headmarkers.firechainCircle,
  headmarkers.firechainTriangle,
  headmarkers.firechainSquare,
  headmarkers.firechainX,
];
const playstationMarkerMap = {
  [headmarkers.firechainCircle]: 'circle',
  [headmarkers.firechainTriangle]: 'triangle',
  [headmarkers.firechainSquare]: 'square',
  [headmarkers.firechainX]: 'cross',
};
const firstMarker = parseInt('0017', 16);
const getHeadmarkerId = (data, matches) => {
  if (data.decOffset === undefined)
    data.decOffset = parseInt(matches.id, 16) - firstMarker;
  // The leading zeroes are stripped when converting back to string, so we re-add them here.
  // Fortunately, we don't have to worry about whether or not this is robust,
  // since we know all the IDs that will be present in the encounter.
  return (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase().padStart(4, '0');
};
Options.Triggers.push({
  zoneId: ZoneId.TheOmegaProtocolUltimate,
  timelineFile: 'the_omega_protocol.txt',
  initData: () => {
    return {
      combatantData: [],
      inLine: {},
      loopBlasterCount: 0,
      pantoMissileCount: 0,
    };
  },
  triggers: [
    {
      id: 'TOP Headmarker Tracker',
      type: 'HeadMarker',
      netRegex: {},
      condition: (data) => data.decOffset === undefined,
      // Unconditionally set the first headmarker here so that future triggers are conditional.
      run: (data, matches) => getHeadmarkerId(data, matches),
    },
    {
      id: 'TOP In Line Debuff Collector',
      type: 'GainsEffect',
      netRegex: { effectId: ['BBC', 'BBD', 'BBE', 'D7B'] },
      run: (data, matches) => {
        const effectToNum = {
          BBC: 1,
          BBD: 2,
          BBE: 3,
          D7B: 4,
        };
        const num = effectToNum[matches.effectId];
        if (num === undefined)
          return;
        data.inLine[matches.target] = num;
      },
    },
    {
      id: 'TOP In Line Debuff Cleanup',
      type: 'StartsUsing',
      // 7B03 = Program Loop
      // 7B0B = Pantokrator
      netRegex: { id: ['7B03', '7B0B'], source: 'Omega', capture: false },
      // Don't clean up when the buff is lost, as that happens after taking a tower.
      run: (data) => data.inLine = {},
    },
    {
      id: 'TOP In Line Debuff',
      type: 'GainsEffect',
      netRegex: { effectId: ['BBC', 'BBD', 'BBE', 'D7B'], capture: false },
      delaySeconds: 0.5,
      durationSeconds: 5,
      suppressSeconds: 1,
      infoText: (data, _matches, output) => {
        const myNum = data.inLine[data.me];
        if (myNum === undefined)
          return;
        let partner = output.unknown();
        for (const [name, num] of Object.entries(data.inLine)) {
          if (num === myNum && name !== data.me) {
            partner = name;
            break;
          }
        }
        return output.text({ num: myNum, player: data.ShortName(partner) });
      },
      outputStrings: {
        text: {
          en: '${num} (with ${player})',
          de: '${num} (mit ${player})',
        },
        unknown: Outputs.unknown,
      },
    },
    {
      id: 'TOP Program Loop First Debuffs',
      type: 'StartsUsing',
      // 7B07 = Blaster cast (only one cast, but 4 abilities)
      netRegex: { id: '7B07', source: 'Omega', capture: false },
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          tower: {
            en: 'Tower 1',
            de: 'Turm 1',
          },
          tether: {
            en: 'Tether 1',
            de: 'Verbindung 1',
          },
          numNoMechanic: {
            en: '1',
            de: '1',
          },
        };
        const myNum = data.inLine[data.me];
        if (myNum === undefined)
          return;
        if (myNum === 1)
          return { alertText: output.tower() };
        if (myNum === 3)
          return { alertText: output.tether() };
        return { infoText: output.numNoMechanic() };
      },
    },
    {
      id: 'TOP Program Loop Other Debuffs',
      type: 'Ability',
      netRegex: { id: '7B08', source: 'Omega', capture: false },
      preRun: (data) => data.loopBlasterCount++,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          tower: {
            en: 'Tower ${num}',
            de: 'Turm ${num}',
          },
          tether: {
            en: 'Tether ${num}',
            de: 'Verbindung ${num}',
          },
          numNoMechanic: {
            en: '${num}',
            de: '${num}',
          },
        };
        const mechanicNum = data.loopBlasterCount + 1;
        if (mechanicNum >= 5)
          return;
        const myNum = data.inLine[data.me];
        if (myNum === undefined)
          return { infoText: output.numNoMechanic({ num: mechanicNum }) };
        if (myNum === mechanicNum)
          return { alertText: output.tower({ num: mechanicNum }) };
        if (mechanicNum === myNum + 2 || mechanicNum === myNum - 2)
          return { alertText: output.tether({ num: mechanicNum }) };
        return { infoText: output.numNoMechanic({ num: mechanicNum }) };
      },
    },
    {
      id: 'TOP Pantokrator First Debuffs',
      type: 'StartsUsing',
      // 7B0D = initial Flame Thrower cast, 7E70 = later ones
      netRegex: { id: '7B0D', source: 'Omega', capture: false },
      suppressSeconds: 1,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          lineStack: {
            en: '1',
            de: '1',
          },
          spread: {
            en: '1 Out (on YOU)',
            de: '1 Raus (auf Dir)',
          },
        };
        const myNum = data.inLine[data.me];
        if (myNum === 1)
          return { alertText: output.spread() };
        return { infoText: output.lineStack() };
      },
    },
    {
      id: 'TOP Pantokrator Other Debuffs',
      type: 'Ability',
      // 7B0E = Guided Missile Kyrios spread damage
      netRegex: { id: '7B0E', source: 'Omega', capture: false },
      preRun: (data) => data.pantoMissileCount++,
      suppressSeconds: 1,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          lineStack: {
            en: '${num}',
            de: '${num}',
          },
          spread: {
            en: '${num} Out (on YOU)',
            de: '${num} Raus (auf Dir)',
          },
        };
        const mechanicNum = data.pantoMissileCount + 1;
        if (mechanicNum >= 5)
          return;
        const myNum = data.inLine[data.me];
        if (myNum === mechanicNum)
          return { alertText: output.spread({ num: mechanicNum }) };
        return { infoText: output.lineStack({ num: mechanicNum }) };
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Omega': 'Omega',
      },
      'replaceText': {
        'Atomic Ray': 'Atomstrahlung',
        'Blaster': 'Blaster',
        'Condensed Wave Cannon Kyrios': 'Hochleistungswellenkanone P',
        'Diffuse Wave Cannon Kyrios': 'Streuende Wellenkanone P',
        'Flame Thrower': 'Flammensturm',
        'Guided Missile Kyrios': 'Lenkrakete P',
        'Pantokrator': 'Pantokrator',
        'Program Loop': 'Programmschleife',
        'Storage Violation': 'Speicherverletzung S',
        '(?<! )Wave Cannon Kyrios': 'Wellenkanone P',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Omega': 'Oméga',
      },
      'replaceText': {
        'Atomic Ray': 'Rayon atomique',
        'Blaster': 'Électrochoc',
        'Condensed Wave Cannon Kyrios': 'Canon plasma surchargé P',
        'Diffuse Wave Cannon Kyrios': 'Canon plasma diffuseur P',
        'Flame Thrower': 'Crache-flammes',
        'Guided Missile Kyrios': 'Missile guidé P',
        'Pantokrator': 'Pantokrator',
        'Program Loop': 'Boucle de programme',
        'Storage Violation': 'Corruption de données S',
        '(?<! )Wave Cannon Kyrios': 'Canon plasma P',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Omega': 'オメガ',
      },
      'replaceText': {
        'Atomic Ray': 'アトミックレイ',
        'Blaster': 'ブラスター',
        'Condensed Wave Cannon Kyrios': '高出力波動砲P',
        'Diffuse Wave Cannon Kyrios': '拡散波動砲P',
        'Flame Thrower': '火炎放射',
        'Guided Missile Kyrios': '誘導ミサイルP',
        'Pantokrator': 'パントクラトル',
        'Program Loop': 'サークルプログラム',
        'Storage Violation': '記憶汚染除去S',
        '(?<! )Wave Cannon Kyrios': '波動砲P',
      },
    },
  ],
});
