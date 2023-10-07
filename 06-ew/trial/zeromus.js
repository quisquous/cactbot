Options.Triggers.push({
  id: 'TheAbyssalFracture',
  zoneId: ZoneId.TheAbyssalFracture,
  timelineFile: 'zeromus.txt',
  triggers: [
    {
      id: 'Zeromus Abyssal Nox',
      type: 'Ability',
      netRegex: { id: '8AF7', source: 'Zeromus', capture: false },
      suppressSeconds: 5,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Heal to full',
        },
      },
    },
    {
      id: 'Zeromus Abyssal Echoes',
      type: 'Ability',
      netRegex: { id: '8AF9', source: 'Zeromus', capture: false },
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Away from glowing circles',
        },
      },
    },
    {
      id: 'Zeromus Sable Thread',
      type: 'Ability',
      netRegex: { id: '8AEF', source: 'Zeromus' },
      alertText: (data, matches, output) => {
        return output.lineStackOn({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        lineStackOn: {
          en: '5x line stack on ${player}',
        },
      },
    },
    {
      id: 'Zeromus Visceral Whirl NE Safe',
      type: 'StartsUsing',
      netRegex: { id: '8AFB', capture: false },
      infoText: (_data, _matches, output) => {
        return output.text({ dir1: output.ne(), dir2: output.sw() });
      },
      outputStrings: {
        text: {
          en: '${dir1} / ${dir2}',
          de: '${dir1} / ${dir2}',
        },
        ne: Outputs.northeast,
        sw: Outputs.southwest,
      },
    },
    {
      id: 'Zeromus Visceral Whirl NW Safe',
      type: 'StartsUsing',
      netRegex: { id: '8AFE', source: 'Zeromus', capture: false },
      infoText: (_data, _matches, output) => {
        return output.text({ dir1: output.nw(), dir2: output.se() });
      },
      outputStrings: {
        text: {
          en: '${dir1} / ${dir2}',
          de: '${dir1} / ${dir2}',
        },
        nw: Outputs.northwest,
        se: Outputs.southeast,
      },
    },
    {
      id: 'Zeromus Dark Matter',
      type: 'HeadMarker',
      netRegex: { id: '016C' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Zeromus Nox',
      type: 'HeadMarker',
      netRegex: { id: '00C5' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Zeromus Fractured Eventide NE Safe',
      type: 'StartsUsing',
      netRegex: { id: '8AF3', source: 'Zeromus', capture: false },
      alertText: (_data, _matches, output) => output.ne(),
      outputStrings: {
        ne: Outputs.northeast,
      },
    },
    {
      id: 'Zeromus Fractured Eventide NW Safe',
      type: 'StartsUsing',
      netRegex: { id: '8AF4', source: 'Zeromus', capture: false },
      alertText: (_data, _matches, output) => output.nw(),
      outputStrings: {
        nw: Outputs.northwest,
      },
    },
    {
      id: 'Zeromus Flare',
      type: 'StartsUsing',
      netRegex: { id: '8B12', source: 'Zeromus', capture: false },
      alertText: (_data, _matches, output) => output.tower(),
      outputStrings: {
        tower: {
          en: 'Stand in Tower',
        },
      },
    },
    {
      id: 'Zeromus Flare Hit',
      type: 'Ability',
      netRegex: { id: '8B12', source: 'Zeromus', capture: false },
      suppressSeconds: 5,
      response: Responses.getOut('info'),
    },
    {
      id: 'Zeromus Big Bang',
      type: 'StartsUsing',
      netRegex: { id: '8B03', source: 'Zeromus', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Zeromus Acceleration Bomb',
      type: 'GainsEffect',
      netRegex: { effectId: 'A61' },
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 3,
      response: Responses.stopEverything(),
    },
    {
      id: 'Zeromus The Dark Divides',
      type: 'HeadMarker',
      netRegex: { id: '0178' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Zeromus The Dark Beckons',
      type: 'HeadMarker',
      netRegex: { id: '0064' },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Zeromus Big Crunch',
      type: 'StartsUsing',
      netRegex: { id: '8B04', source: 'Zeromus', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Zeromus Nostalgia',
      type: 'StartsUsing',
      netRegex: { id: '8B1A', source: 'Zeromus', capture: false },
      response: Responses.bigAoe(),
    },
    {
      id: 'Zeromus Akh Rhai',
      type: 'HeadMarker',
      netRegex: { id: '0017' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Spread + Stay Out',
        },
      },
    },
  ],
});
