Options.Triggers.push({
    zoneId: ZoneId.TheMinstrelsBalladZodiarksFall,
    timelineFile: 'zodiark-ex.txt',
    triggers: [
        {
            id: 'ZodiarkEx Ania',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '67EF', source: 'Zodiark' }),
            netRegexDe: NetRegexes.startsUsing({ id: '67EF', source: 'Zodiark' }),
            netRegexFr: NetRegexes.startsUsing({ id: '67EF', source: 'Zordiarche' }),
            netRegexJa: NetRegexes.startsUsing({ id: '67EF', source: 'ゾディアーク' }),
            response: Responses.tankBuster(),
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
