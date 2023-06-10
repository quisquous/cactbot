Options.Triggers.push({
  id: 'TheVoidcastDais',
  zoneId: ZoneId.TheVoidcastDais,
  timelineFile: 'golbez.txt',
  initData: () => {
    return {
      galeSphereShadows: [],
    };
  },
  triggers: [
    {
      id: 'Golbez Terrastorm',
      type: 'Ability',
      netRegex: { id: '8463', source: 'Golbez', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Avoid meteor',
        },
      },
    },
    {
      id: 'Golbez Crescent Blade',
      type: 'StartsUsing',
      netRegex: { id: '846B', source: 'Golbez', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'Golbez Void Meteor',
      type: 'StartsUsing',
      netRegex: { id: '84AC', source: 'Golbez', capture: true },
      response: Responses.tankBuster(),
    },
    {
      id: 'Golbez Binding Cold',
      type: 'StartsUsing',
      netRegex: { id: '84B2', source: 'Golbez', capture: false },
      response: Responses.bleedAoe(),
    },
    {
      id: 'Golbez Black Fang',
      type: 'StartsUsing',
      netRegex: { id: '8471', source: 'Golbez', capture: false },
      response: Responses.bigAoe(),
    },
    {
      id: 'Golbez Shadow Crescent',
      type: 'StartsUsing',
      netRegex: { id: '8487', source: 'Golbez', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get behind, then out',
        },
      },
    },
    {
      id: 'Golbez Gale Sphere Directions',
      type: 'Ability',
      netRegex: { id: '84(?:4F|50|51|52)', source: 'Golbez\'s Shadow', capture: true },
      infoText: (data, matches, output) => {
        switch (matches.id) {
          case '844F':
            data.galeSphereShadows.push('dirN');
            break;
          case '8450':
            data.galeSphereShadows.push('dirE');
            break;
          case '8451':
            data.galeSphereShadows.push('dirW');
            break;
          case '8452':
            data.galeSphereShadows.push('dirS');
            break;
        }
        if (data.galeSphereShadows.length < 4)
          return;
        const [dir1, dir2, dir3, dir4] = data.galeSphereShadows;
        if (dir1 === undefined || dir2 === undefined || dir3 === undefined || dir4 === undefined)
          return;
        data.galeSphereShadows = [];
        return output.clones({
          dir1: output[dir1]() ?? output.unknown(),
          dir2: output[dir2]() ?? output.unknown(),
          dir3: output[dir3]() ?? output.unknown(),
          dir4: output[dir4]() ?? output.unknown(),
        });
      },
      outputStrings: {
        clones: {
          en: 'Clones: ${dir1}->${dir2}->${dir3}->${dir4}',
        },
        unknown: Outputs.unknown,
        ...Directions.outputStringsCardinalDir,
      },
    },
    {
      id: 'Golbez Eventide Fall',
      type: 'StartsUsing',
      netRegex: { id: '8482', source: 'Golbez', capture: false },
      response: Responses.stackMarker(),
    },
    {
      id: 'Golbez Immolating Shade',
      type: 'StartsUsing',
      netRegex: { id: '8495', source: 'Golbez' },
      alertText: (data, matches, output) => {
        const target = data.ShortName(matches.target) ?? '??';
        return output.text({ player: target });
      },
      outputStrings: {
        text: {
          en: 'Out first => stack w/ ${player}',
        },
      },
    },
  ],
});
