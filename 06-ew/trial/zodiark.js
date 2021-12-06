Options.Triggers.push({
    zoneId: ZoneId.TheDarkInside,
    timelineFile: 'zodiark.txt',
    triggers: [
        {
            id: 'Zodiark Ania',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6B62', source: 'Zodiark' }),
            response: Responses.tankBuster(),
        },
        {
            id: 'Zodiark Algedon NE',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '67D1', source: 'Zodiark', capture: false }),
            alertText: (_data, _matches, output) => output.text(),
            // Warn about knockback just as a precaution in case players don't make it.
            // Also, technically NE/SW is safe, but having all players run together is better.
            outputStrings: {
                text: {
                    en: 'Go NE (knockback)',
                },
            },
        },
        {
            id: 'Zodiark Algedon NW',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '67D2', source: 'Zodiark', capture: false }),
            alertText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'Go NW (knockback)',
                },
            },
        },
    ],
    timelineReplace: [
        {
            'locale': 'en',
            'replaceText': {
                'Esoteric Dyad/Esoteric Sect': 'Esoteric Dyad/Sect',
            },
        },
    ],
});
