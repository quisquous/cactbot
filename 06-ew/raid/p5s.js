Options.Triggers.push({
  zoneId: ZoneId.AbyssosTheFifthCircleSavage,
  timelineFile: 'p5s.txt',
  triggers: [
    {
      // The tank busters are not cast on a target,
      // keep track of who the boss is auto attacking.
      id: 'P5S Attack',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '7A0E', source: 'Proto-Carbuncle' }),
      run: (data, matches) => data.target = matches.target,
    },
    {
      // Update target whenever Provoke is used.
      id: 'P5S Provoke',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '1D6D' }),
      run: (data, matches) => data.target = matches.source,
    },
    {
      id: 'P5S Sonic Howl',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7720', source: 'Proto-Carbuncle', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'P5S Venomous Mass',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '771D', source: 'Proto-Carbuncle', capture: false }),
      alarmText: (data, _matches, output) => {
        if (data.role === 'tank' && data.target !== data.me)
          return output.tankSwap();
      },
      alertText: (data, _matches, output) => {
        if (data.role === 'tank' && data.target !== data.me)
          return;
        if (data.target === data.me)
          return output.busterOnYou();
        return output.busterOnTarget({ player: data.ShortName(data.target) });
      },
      outputStrings: {
        busterOnYou: Outputs.tankBusterOnYou,
        busterOnTarget: Outputs.tankBusterOnPlayer,
        tankSwap: Outputs.tankSwap,
      },
    },
    {
      id: 'P5S Toxic Crunch',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '784A', source: 'Proto-Carbuncle', capture: false }),
      infoText: (data, _matches, output) => {
        if (data.role === 'tank' && data.target !== data.me)
          return;
        if (data.target === data.me)
          return output.busterOnYou();
        return output.tankBuster();
      },
      outputStrings: {
        busterOnYou: Outputs.tankBusterOnYou,
        tankBuster: Outputs.tankBuster,
      },
    },
    {
      id: 'P5S Double Rush',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '771B', source: 'Proto-Carbuncle', capture: false }),
      delaySeconds: 3,
      response: Responses.knockback(),
    },
    {
      id: 'P5S Venom Squall/Surge',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '771[67]', source: 'Proto-Carbuncle' }),
      durationSeconds: 5,
      alertText: (_data, matches, output) => {
        const spread = output.spread();
        const healerGroups = output.healerGroups();
        // Venom Squall
        if (matches.id === '7716')
          return output.text({ dir1: spread, dir2: healerGroups });
        return output.text({ dir1: healerGroups, dir2: spread });
      },
      outputStrings: {
        healerGroups: Outputs.healerGroups,
        spread: Outputs.spread,
        text: {
          en: '${dir1} -> Bait -> ${dir2}',
          fr: '${dir1} -> Attendez -> ${dir2}',
        },
      },
    },
    {
      id: 'P5S Tail to Claw',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7712', source: 'Proto-Carbuncle', capture: false }),
      durationSeconds: 5,
      response: Responses.getFrontThenBack(),
    },
    {
      id: 'P5S Claw to Tail',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '770E', source: 'Proto-Carbuncle', capture: false }),
      durationSeconds: 5,
      response: Responses.getBackThenFront(),
    },
  ],
});
