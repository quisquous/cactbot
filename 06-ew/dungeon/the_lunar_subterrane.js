Options.Triggers.push({
  id: 'TheLunarSubteranne',
  zoneId: ZoneId.TheLunarSubterrane,
  timelineFile: 'the_lunar_subterrane.txt',
  triggers: [
    {
      id: 'Lunar Subterrane Dark Elf Abyssal Outburst',
      type: 'StartsUsing',
      netRegex: { id: '87DE', source: 'Dark Elf', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Lunar Subterrane Dark Elf Void Dark II',
      type: 'StartsUsing',
      netRegex: { id: '87E4', source: 'Dark Elf' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Lunar Subterrane Dark Elf Staff Smite',
      type: 'StartsUsing',
      netRegex: { id: '8984', source: 'Dark Elf' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Lunar Subterrane Dark Elf Shadow Sigil Pink Triangle',
      type: 'StartsUsing',
      netRegex: { id: '87DB', source: 'Dark Elf', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Blue Square Safe',
        },
      },
    },
    {
      id: 'Lunar Subterrane Dark Elf Shadow Sigil Blue Square',
      type: 'StartsUsing',
      netRegex: { id: '87DC', source: 'Dark Elf', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Pink Triangle Safe',
        },
      },
    },
    {
      id: 'Lunar Subterrane Dark Elf Doom',
      type: 'GainsEffect',
      // Doom comes from being hit by Ruinous Hex (the staves).
      // Dark Whispers stacks from being hit by staves decrease the time on this debuff
      // from 15 -> 7 -> 3. The Dark Whispers stacks top out at 2.
      netRegex: { effectId: 'D24' },
      condition: (data) => Util.canCleanse(data.job),
      alertText: (data, matches, output) => {
        return output.cleanse({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        cleanse: {
          en: 'Cleanse ${player}\'s Doom',
        },
      },
    },
    {
      id: 'Lunar Subterrane Antlion Sandblast',
      type: 'StartsUsing',
      netRegex: { id: '87FD', source: 'Damcyan Antlion', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Lunar Subterrane Antlion Earthen Geyser',
      type: 'StartsUsing',
      netRegex: { id: '8806', source: 'Damcyan Antlion' },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Lunar Subterrane Antlion Pound Sand',
      type: 'Ability',
      // This is on the Earthen Geyser hit.
      netRegex: { id: '8806', source: 'Damcyan Antlion' },
      condition: Conditions.targetIsYou(),
      response: Responses.getOut(),
    },
    {
      id: 'Lunar Subterrane Durante Old Magic',
      type: 'StartsUsing',
      netRegex: { id: '88C3', source: 'Durante', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Lunar Subterrane Durante Fallen Grace',
      type: 'StartsUsing',
      netRegex: { id: '8C2A', source: 'Durante' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Lunar Subterrane Durante Antipodal Assault',
      type: 'Ability',
      netRegex: { id: '38FC', source: 'Durante' },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Lunar Subterrane Durante Hard Slash',
      type: 'Ability',
      netRegex: { id: '88C0', source: 'Durante', capture: false },
      suppressSeconds: 5,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Go Sides on Wall',
        },
      },
    },
    {
      id: 'Lunar Subterrane Durante Twilight Phase',
      type: 'StartsUsing',
      netRegex: { id: '8CD8', source: 'Durante', capture: false },
      response: Responses.goSides(),
    },
    {
      id: 'Lunar Subterrane Durante Dark Impact',
      type: 'StartsUsing',
      netRegex: { id: '88BA', source: 'Durante', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get Behind and Out',
          de: 'Geh nach Hinten und Raus',
          fr: 'Passez derrière et extérieur',
          ja: '後ろの外側へ',
          cn: '去背后远离',
          ko: '보스 뒤 바깥쪽으로',
        },
      },
    },
    {
      id: 'Lunar Subterrane Durante Arcane Edge',
      type: 'StartsUsing',
      netRegex: { id: '88C2', source: 'Durante' },
      response: Responses.tankBuster(),
    },
  ],
});
