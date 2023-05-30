const dualspells = {
  fireIce: '8154',
  thunderIce: '8155',
};
// TODO: determine first headmarker id
const firstHeadmarker = parseInt('0000', 16);
const getHeadmarkerId = (data, matches) => {
  // If we naively just check !data.decOffset and leave it, it breaks if the first marker is 00DA.
  // (This makes the offset 0, and !0 is true.)
  if (typeof data.decOffset === 'undefined')
    data.decOffset = parseInt(matches.id, 16) - firstHeadmarker;
  // The leading zeroes are stripped when converting back to string, so we re-add them here.
  // Fortunately, we don't have to worry about whether or not this is robust,
  // since we know all the IDs that will be present in the encounter.
  return (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase().padStart(4, '0');
};
Options.Triggers.push({
  id: 'AnabaseiosTheNinthCircleSavage',
  zoneId: ZoneId.AnabaseiosTheNinthCircleSavage,
  timelineFile: 'p9s.txt',
  triggers: [
    {
      id: 'P9S Headmarker Tracker',
      type: 'HeadMarker',
      netRegex: {},
      condition: (data) => data.decOffset === undefined,
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
      id: 'P9S Duality of Death',
      type: 'StartsUsing',
      netRegex: { id: '814C', source: 'Kokytos', capture: false },
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          tankSwap: Outputs.tankSwap,
          tankBusters: Outputs.tankBusters,
        };
        // TODO: track headmarkers?
        if (data.role === 'tank')
          return { alertText: output.tankSwap() };
        return { infoText: output.tankBusters() };
      },
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
        },
      },
    },
    {
      id: 'P9S Fire Symbol',
      type: 'Ability',
      netRegex: { id: '8122', source: 'Kokytos', capture: false },
      alertText: (data, _matches, output) => {
        if (data.lastDualspellId === dualspells.fireIce)
          return output.fireIceOut();
        return output.out();
      },
      run: (data) => delete data.lastDualspellId,
      outputStrings: {
        fireIceOut: {
          en: 'Out + Partners',
        },
        out: Outputs.out,
      },
    },
    {
      id: 'P9S Ice Symbol',
      type: 'Ability',
      netRegex: { id: '8123', source: 'Kokytos', capture: false },
      alertText: (data, _matches, output) => {
        if (data.lastDualspellId === dualspells.fireIce)
          return output.fireIceIn();
        if (data.lastDualspellId === dualspells.thunderIce)
          return output.thunderIceIn();
        return output.in();
      },
      run: (data) => delete data.lastDualspellId,
      outputStrings: {
        fireIceIn: {
          en: 'In + Partners',
        },
        thunderIceIn: {
          en: 'In + Protean',
        },
        in: Outputs.in,
      },
    },
    {
      id: 'P9S Thunder Symbol',
      type: 'Ability',
      netRegex: { id: '815C', source: 'Kokytos', capture: false },
      alertText: (data, _matches, output) => {
        if (data.lastDualspellId === dualspells.thunderIce)
          return output.thunderIceOut();
        return output.out();
      },
      run: (data) => delete data.lastDualspellId,
      outputStrings: {
        thunderIceOut: {
          en: 'Out + Protean',
        },
        out: Outputs.out,
      },
    },
    {
      id: 'P9S Ascendant Fist',
      type: 'StartsUsing',
      netRegex: { id: '815F', source: 'Kokytos' },
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
        },
      },
    },
    {
      id: 'P9S Archaic Demolish',
      type: 'StartsUsing',
      netRegex: { id: '815F', source: 'Kokytos', capture: false },
      alertText: (_data, _matches, output) => output.healerGroups(),
      outputStrings: {
        healerGroups: Outputs.healerGroups,
      },
    },
  ],
  timelineReplace: [
    {
      locale: 'en',
      replaceText: {
        'Aero IV/Fire IV': 'Aero/Fire IV',
        'Front Combination/Rear Combination': 'Front/Rear Combination',
        'Inside Roundhouse/Outside Roundhouse': 'Inside/Outside Roundhouse',
      },
    },
  ],
});
