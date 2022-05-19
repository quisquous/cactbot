Options.Triggers.push({
  zoneId: ZoneId.TheWanderersPalaceHard,
  triggers: [
    {
      id: 'Wanderer\'s Palace Hard Firespit',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: 'C91', source: 'Slithy Zolool Ja' }),
      response: Responses.tankBuster(),
    },
    {
      // Not 100% sure if there's a better way to handle the callout
      id: 'Wanderer\'s Palace Hard Doom',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'D2' }),
      alertText: (data, matches, output) => output.text({ player: data.ShortName(matches.target) }),
      outputStrings: {
        text: {
          en: 'Heal ${player} to full',
          fr: 'Soin complet sur ${player}',
        },
      },
    },
    {
      id: 'Wanderer\'s Palace Hard Soul Douse',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: 'C9E', source: 'Slithy Zolool Ja', capture: false }),
      response: Responses.lookAway(),
    },
  ],
});
