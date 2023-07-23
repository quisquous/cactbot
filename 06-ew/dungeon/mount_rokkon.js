// TODO: find network lines for Yozakura Seal of Riotous Bloom arrows (nothing in network logs)
// TODO: Yozakura Seasons of the Fleeting
//       you would need to track 8384 (pinwheel) and 8383 (line) *abilities* (not incorrect casts)
//       and use their positions and rotations to know whether to say front/back/card/intercard
//       she repositions beforehand, so front/back of her is a known safe position.
// TODO: Moko safe spots for Iron Rain?
// TODO: are Moko Auspice water/fire tied to a path or random?
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
      yozakuraSeal: [],
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
      netRegex: { id: '86F0', source: 'Yozakura the Fleeting', capture: false },
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
        },
        outAndCards: {
          en: 'Out + Cardinals',
        },
        inAndIntercards: {
          en: 'In + Intercards',
        },
        outAndIntercards: {
          en: 'Out + Intercards',
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
        },
        stay: {
          en: 'Stay',
        },
        rotateLeft: {
          en: 'Rotate Left',
        },
        rotateRight: {
          en: 'Rotate Right',
        },
        combo: {
          en: '${dir1} => ${dir2}',
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
        },
        back: Outputs.back,
        front: Outputs.front,
        left: Outputs.left,
        right: Outputs.right,
        combo: {
          en: '${dir1} => ${dir2}',
        },
      },
    },
  ],
});
