// Susano Normal
Options.Triggers.push({
    zoneId: ZoneId.ThePoolOfTribute,
    timelineFile: 'susano.txt',
    timelineTriggers: [
        {
            id: 'Susano Assail',
            regex: /Assail/,
            beforeSeconds: 6,
            response: Responses.miniBuster(),
        },
    ],
    triggers: [
        {
            id: 'Susano Brightstorm',
            type: 'HeadMarker',
            netRegex: NetRegexes.headMarker({ id: '003E' }),
            response: Responses.stackMarkerOn(),
        },
        {
            id: 'Susano Seasplitter',
            type: 'HeadMarker',
            netRegex: NetRegexes.headMarker({ id: '0017' }),
            condition: Conditions.targetIsYou(),
            alertText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'Knockback on YOU',
                },
            },
        },
        {
            id: 'Susano Ukehi',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ source: 'Susano', id: '2026', capture: false }),
            response: Responses.aoe(),
        },
        {
            id: 'Susano Stormsplitter',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ source: 'Susano', id: '2023' }),
            response: Responses.tankCleave('alert'),
        },
    ],
});
