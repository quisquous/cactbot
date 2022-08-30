Options.Triggers.push({
  zoneId: ZoneId.AbyssosTheSixthCircle,
  timelineFile: 'p6n.txt',
  initData: () => {
    return {
      busterTargets: [],
    };
  },
  triggers: [
    {
      id: 'P6N Hemitheos Dark IV',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '784E', source: 'Hegemone', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'P6N Choros Ixou Sides',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7858', source: 'Hegemone', capture: false }),
      response: Responses.goFrontBack(),
    },
    {
      id: 'P6N Choros Ixou Front Back',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7857', source: 'Hegemone', capture: false }),
      response: Responses.goSides(),
    },
    {
      id: 'P6N Synergy Collect',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0157' }),
      run: (data, matches) => data.busterTargets.push(matches.target),
    },
    {
      id: 'P6N Synergy Call',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0157', capture: false }),
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
      id: 'P6N Synergy Cleanup',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0157', capture: false }),
      delaySeconds: 5,
      run: (data) => data.busterTargets = [],
    },
    {
      id: 'P6N Glossomorph Initial',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'CF2' }),
      condition: Conditions.targetIsYou(),
      infoText: (_data, matches, output) => {
        if (parseFloat(matches.duration) > 15)
          return output.second();
        return output.first();
      },
      outputStrings: {
        first: {
          en: 'Short parasite on YOU',
          ko: '짧은 기생 디버프 대상자',
        },
        second: {
          en: 'Long parasite on YOU',
          ko: '긴 기생 디버프 대상자',
        },
      },
    },
    {
      id: 'P6N Glossomorph Call',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'CF2' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 6,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Face outside: Parasite',
          ko: '바깥 보기: 기생',
        },
      },
    },
    {
      // 00A7 is the orange clockwise indicator. 00A8 is the blue counterclockwise one.
      id: 'P6N Strophe Ixou',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: ['00A7', '00A8'] }),
      infoText: (_data, matches, output) => matches.id === '00A7' ? output.left() : output.right(),
      outputStrings: {
        left: {
          en: 'Rotate left',
          de: 'Nach links rotieren',
          fr: 'Tournez vers la gauche',
          ja: '左回転',
          cn: '向左转',
          ko: '왼쪽으로 회전',
        },
        right: {
          en: 'Rotate right',
          de: 'Nach rechts rotieren',
          fr: 'Tournez vers la droite',
          ja: '右回転',
          cn: '向右转',
          ko: '오른쪽으로 회전',
        },
      },
    },
    {
      id: 'P6N Dark Ashes',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0065' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'P6N Aetherial Exchange',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '784D', source: 'Hegemone', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Be opposite tethered safespot',
          ko: '선 연결된 기둥의 안전지대로',
        },
      },
    },
  ],
});
