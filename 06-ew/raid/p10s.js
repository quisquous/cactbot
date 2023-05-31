const bossNameUnicode = 'Pand\u00e6monium';
const headmarkers = {
  // vfx/lockon/eff/com_share6_5s0c.avfx
  soulGrasp: '01D3',
  // vfx/lockon/eff/m0834trg_b0c.avfx
  webShare: '01AC',
  // vfx/lockon/eff/m0834trg_d0c.avfx
  webEntangling: '01AE',
  // vfx/lockon/eff/m0834trg_a0c.avfx
  webSpread: '01AB',
  // vfx/lockon/eff/lockon5_t0h.avfx
  spread: '0017',
};
const firstHeadmarker = parseInt(headmarkers.soulGrasp, 16);
const getHeadmarkerId = (data, matches) => {
  if (data.decOffset === undefined)
    data.decOffset = parseInt(matches.id, 16) - firstHeadmarker;
  return (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase().padStart(4, '0');
};
Options.Triggers.push({
  id: 'AnabaseiosTheTenthCircleSavage',
  zoneId: ZoneId.AnabaseiosTheTenthCircleSavage,
  timelineFile: 'p10s.txt',
  initData: () => {
    return {
      dividingWingsTethers: [],
      dividingWingsStacks: [],
      dividingWingsEntangling: [],
      meltdownSpreads: [],
    };
  },
  triggers: [
    {
      id: 'P10S Headmarker Tracker',
      type: 'HeadMarker',
      netRegex: {},
      condition: (data) => data.decOffset === undefined,
      // Unconditionally set the first headmarker here so that future triggers are conditional.
      run: (data, matches) => getHeadmarkerId(data, matches),
    },
    {
      id: 'P10S Ultima',
      type: 'StartsUsing',
      netRegex: { id: '82A5', source: bossNameUnicode, capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'P10S Soul Grasp',
      type: 'HeadMarker',
      netRegex: {},
      condition: (data, matches) => getHeadmarkerId(data, matches) === headmarkers.soulGrasp,
      response: Responses.sharedTankBuster(),
    },
    {
      id: 'P10S Pandaemon\'s Holy',
      type: 'StartsUsing',
      netRegex: { id: '82A6', source: bossNameUnicode, capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'P10S Circles of Pandaemonium',
      type: 'StartsUsing',
      netRegex: { id: '82A7', source: bossNameUnicode, capture: false },
      response: Responses.getIn(),
    },
    {
      id: 'P10S Wicked Step',
      type: 'StartsUsing',
      netRegex: { id: '8299', source: bossNameUnicode, capture: false },
      alertText: (data, _matches, output) => {
        if (data.party.isTank(data.me))
          return output.soak();
      },
      infoText: (data, _matches, output) => {
        if (!data.party.isTank(data.me))
          return output.avoid();
      },
      outputStrings: {
        soak: {
          en: 'Soak tower',
          de: 'Türme nehmen',
          fr: 'Prenez une tour',
        },
        avoid: {
          en: 'Avoid towers',
          de: 'Türme vermeiden',
          fr: 'Évitez les tours',
        },
      },
    },
    {
      id: 'P10S Dividing Wings Cleanup',
      type: 'StartsUsing',
      netRegex: { id: '8297', source: bossNameUnicode, capture: false },
      run: (data) => {
        data.dividingWingsTethers = [];
        data.dividingWingsStacks = [];
        data.dividingWingsEntangling = [];
      },
    },
    {
      id: 'P10S Dividing Wings Tether',
      type: 'Tether',
      netRegex: { id: '00F2', source: bossNameUnicode },
      alarmText: (data, matches, output) => {
        data.dividingWingsTethers.push(matches.target);
        if (data.me === matches.target)
          return output.text();
      },
      outputStrings: {
        text: {
          en: 'Point Tether Away',
        },
      },
    },
    {
      id: 'P10S Dividing Wings Tether Break',
      type: 'Ability',
      netRegex: { id: '827F', source: bossNameUnicode, capture: false },
      condition: (data) => data.dividingWingsTethers.includes(data.me),
      suppressSeconds: 5,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Break Tethers',
        },
      },
    },
    {
      id: 'P10S Dividing Wings Stack You',
      type: 'HeadMarker',
      netRegex: {},
      condition: (data, matches) => getHeadmarkerId(data, matches) === headmarkers.webShare,
      alertText: (data, matches, output) => {
        data.dividingWingsStacks.push(matches.target);
        if (data.me === matches.target)
          return output.stackOnYou();
      },
      outputStrings: {
        stackOnYou: Outputs.stackOnYou,
      },
    },
    {
      id: 'P10S Dividing Wings Stacks',
      type: 'HeadMarker',
      netRegex: {},
      condition: (data, matches) => getHeadmarkerId(data, matches) === headmarkers.webShare,
      delaySeconds: 0.5,
      suppressSeconds: 5,
      infoText: (data, _matches, output) => {
        // Need to check these conditions after the delay as they are ordered:
        // tethers, stack(s), (optional) entangling.
        if (data.dividingWingsTethers.includes(data.me))
          return;
        if (data.dividingWingsStacks.includes(data.me))
          return;
        if (data.dividingWingsEntangling.includes(data.me))
          return;
        return output.text();
      },
      outputStrings: {
        text: {
          en: 'Stack',
        },
      },
    },
    {
      id: 'P10S Entangling Web',
      type: 'HeadMarker',
      netRegex: {},
      condition: (data, matches) => {
        if (data.me !== matches.target)
          return false;
        return getHeadmarkerId(data, matches) === headmarkers.webEntangling;
      },
      alertText: (_data, _matches, output) => output.text(),
      // This will happen for non-dividing entangling web headmarkers,
      // but will get cleaned up in time for the next dividing wings.
      run: (data, matches) => data.dividingWingsEntangling.push(matches.target),
      outputStrings: {
        text: {
          // TODO: should we say "on posts" or "on back wall" based on count?
          en: 'Overlap Webs',
        },
      },
    },
    {
      id: 'P10S Pandaemoniac Pillars',
      type: 'StartsUsing',
      netRegex: { id: '8280', source: bossNameUnicode, capture: false },
      response: Responses.getTowers('info'),
    },
    {
      id: 'P10S Silkspit',
      type: 'StartsUsing',
      netRegex: { id: '827C', source: bossNameUnicode, capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Spread for Webs',
        },
      },
    },
    {
      id: 'P10S Pandaemoniac Meltdown Spread',
      // These come out before the meltdown cast below.
      type: 'HeadMarker',
      netRegex: {},
      condition: (data, matches) => getHeadmarkerId(data, matches) === headmarkers.spread,
      alertText: (data, matches, output) => {
        data.meltdownSpreads.push(matches.target);
        if (data.me === matches.target)
          return output.spread();
      },
      outputStrings: {
        spread: Outputs.spread,
      },
    },
    {
      id: 'P10S Pandaemoniac Meltdown Stack',
      type: 'StartsUsing',
      netRegex: { id: '829D', source: bossNameUnicode, capture: false },
      infoText: (data, _matches, output) => {
        if (!data.meltdownSpreads.includes(data.me))
          return output.text();
      },
      run: (data) => data.meltdownSpreads = [],
      outputStrings: {
        text: {
          en: 'Line stack',
          de: 'Linien-Stack',
          fr: 'Packez-vous en ligne',
          ja: 'スタック',
          cn: '直线分摊',
          ko: '직선 쉐어',
        },
      },
    },
  ],
});
