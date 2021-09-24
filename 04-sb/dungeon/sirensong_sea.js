Options.Triggers.push({
    zoneId: ZoneId.TheSirensongSea,
    timelineFile: 'sirensong_sea.txt',
    timelineTriggers: [
        {
            id: 'Sirensong Lorelei Head Butt',
            regex: /Head Butt/,
            beforeSeconds: 6,
            response: Responses.tankBuster(),
        },
    ],
    triggers: [
        {
            id: 'Sirensong Lugat Hydroball',
            type: 'HeadMarker',
            netRegex: NetRegexes.headMarker({ id: '003E' }),
            response: Responses.stackMarkerOn(),
        },
        {
            id: 'Sirensong Lugat Sea Swallows All',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ source: 'Lugat', id: '1F58', capture: false }),
            response: Responses.drawIn(),
        },
        {
            id: 'Sirensong Lugat Overtow',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ source: 'Lugat', id: '1F59', capture: false }),
            response: Responses.knockback('info'),
        },
        {
            id: 'Sirensong Governor Shadowflow',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ source: 'The Governor', id: '1F5E', capture: false }),
            infoText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'Avoid Shadows',
                },
            },
        },
        {
            id: 'Sirensong Governor Bloodburst',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ source: 'The Governor', id: '1F5C', capture: false }),
            response: Responses.aoe(),
        },
        {
            id: 'Sirensong Governor Enter Night',
            type: 'HeadMarker',
            netRegex: NetRegexes.headMarker({ id: '0016' }),
            condition: Conditions.targetIsYou(),
            response: Responses.getOut(),
        },
        {
            id: 'Sirensong Fleshless Captive Seductive Scream',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ source: 'Fleshless Captive', id: '2352' }),
            response: Responses.stunOrInterruptIfPossible(),
        },
        {
            id: 'Sirensong Lorelei Morbid Advance',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ source: 'Lorelei', id: '1F65', capture: false }),
            alertText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'Forward March',
                },
            },
        },
        {
            id: 'Sirensong Lorelei Morbid Retreat',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ source: 'Lorelei', id: '1F66', capture: false }),
            alertText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'Backwards March',
                },
            },
        },
        {
            id: 'Sirensong Lorelei Somber Melody',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ source: 'Lorelei', id: '1F67', capture: false }),
            response: Responses.aoe(),
        },
    ],
    timelineReplace: [
        {
            'locale': 'en',
            'replaceText': {
                'Morbid Advance/Morbid Retreat': 'Morbid Advance/Retreat',
            },
        },
    ],
});
