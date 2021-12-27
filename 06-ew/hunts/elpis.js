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
                },
            },
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
                    },
                    waterMarker: {
                        en: 'Away from water marker',
                    },
                };
                if (data.me === matches.target)
                    return { alarmText: output.waterOnYou() };
                return { alertText: output.waterMarker() };
            },
        },
    ],
});
