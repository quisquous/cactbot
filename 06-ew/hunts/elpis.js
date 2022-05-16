Options.Triggers.push({
  zoneId: ZoneId.Elpis,
  triggers: [
    {
      id: 'Hunt Gurangatch Left Hammer Slammer',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6B65', source: 'Gurangatch', capture: false }),
      alarmText: (_data, _matches, output) => output.rightThenLeft(),
      outputStrings: {
        rightThenLeft: {
          en: 'Right => Left',
          de: 'Rechts => Links',
          fr: 'À droite => À gauche',
          cn: '右 => 左',
          ko: '오른쪽 => 왼쪽',
        },
      },
    },
    {
      id: 'Hunt Gurangatch Right Hammer Slammer',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6B66', source: 'Gurangatch', capture: false }),
      alarmText: (_data, _matches, output) => output.leftThenRight(),
      outputStrings: {
        leftThenRight: {
          en: 'Left => Right',
          de: 'Links => Rechts',
          fr: 'À gauche => À droite',
          cn: '左 => 右',
          ko: '왼쪽 => 오른쪽',
        },
      },
    },
    {
      id: 'Hunt Gurangatch Bone Shaker',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6B78', source: 'Gurangatch', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Hunt Petalodus Marine Mayhem',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '69B7', source: 'Petalodus' }),
      condition: (data) => data.CanSilence(),
      response: Responses.interrupt(),
    },
    {
      id: 'Hunt Petalodus Tidal Guillotine',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '69BC', source: 'Petalodus', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'Hunt Petalodus Ancient Blizzard',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '69BD', source: 'Petalodus', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      id: 'Hunt Petalodus Waterga IV',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '69BB', source: 'Petalodus' }),
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          waterOnYou: {
            en: 'GTFO with water',
            de: 'Geh mit Wasser raus',
            fr: 'Partez avec l\'eau',
            cn: '快躲开水',
            ko: '나에게 물징 멀리 빠지기',
          },
          waterMarker: {
            en: 'Away from water marker',
            de: 'Weg vom Wasser Marker',
            fr: 'Éloignez-vous du marquage eau',
            cn: '躲开水标记',
            ko: '물징에서 멀리 떨어지기',
          },
        };
        if (data.me === matches.target)
          return { alarmText: output.waterOnYou() };
        return { alertText: output.waterMarker() };
      },
    },
  ],
});
