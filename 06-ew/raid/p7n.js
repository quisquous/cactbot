Options.Triggers.push({
  zoneId: ZoneId.AbyssosTheSeventhCircle,
  timelineFile: 'p7n.txt',
  initData: () => {
    return {
      busterTargets: [],
    };
  },
  timelineTriggers: [
    {
      id: 'P7N Burst',
      regex: /Burst/,
      beforeSeconds: 4,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get towers',
        },
      },
    },
  ],
  triggers: [
    {
      id: 'P7N Bough Of Attis Out',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '77F9', source: 'Agdistis', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'P7N Bough Of Attis In',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '77FE', source: 'Agdistis', capture: false }),
      response: Responses.getIn(),
    },
    {
      id: 'P7N Bough Of Attis Left',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '77FC', source: 'Agdistis', capture: false }),
      response: Responses.goLeft(),
    },
    {
      id: 'P7N Bough Of Attis Right',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '77FB', source: 'Agdistis', capture: false }),
      response: Responses.goRight(),
    },
    {
      id: 'P7N Hemitheos Holy Spread',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0137' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'P7N Hemitheos Glare',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '79FA', source: 'Agdistis', capture: false }),
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Move center when safe',
        },
      },
    },
    {
      id: 'P7N Immortals Obol',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '77F5', source: 'Agdistis', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get to edge (in circle)',
        },
      },
    },
    {
      id: 'P7N Hemitheos Aero II Collect',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '016C' }),
      run: (data, matches) => data.busterTargets.push(matches.target),
    },
    {
      id: 'P7N Hemitheos Aero II Call',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '016C', capture: false }),
      delaySeconds: 0.3,
      suppressSeconds: 5,
      alertText: (data, _matches, output) => {
        if (data.busterTargets.includes(data.me))
          return output.markerYou();
        return output.avoid();
      },
      outputStrings: {
        markerYou: Outputs.tankCleave,
        avoid: Outputs.avoidTankCleave,
      },
    },
    {
      id: 'P7N Hemitheos Aero II Cleanup',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '016C', capture: false }),
      delaySeconds: 5,
      run: (data) => data.busterTargets = [],
    },
    {
      id: 'P7N Spark Of Life',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '780B', source: 'Agdistis', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'P7N Static Moon',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7802', source: 'Immature Io', capture: false }),
      suppressSeconds: 5,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Avoid Behemoths',
        },
      },
    },
    {
      id: 'P7N Stymphalian Strike',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7803', source: 'Immature Stymphalide', capture: false }),
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Avoid line dashes',
        },
      },
    },
    {
      id: 'P7N Blades Of Attis',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7805', source: 'Agdistis', capture: false }),
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Avoid Exaflares',
        },
      },
    },
    {
      id: 'P7N Hemitheos Aero IV',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7840', source: 'Agdistis' }),
      // The cast time is slightly longer than Arm's Length/Surecast's duration.
      // Don't risk someone being too fast.
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 6,
      response: Responses.knockback('info'), // avoid collisions with Forbidden Fruit triggers.
    },
  ],
});
