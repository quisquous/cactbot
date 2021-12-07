Options.Triggers.push({
    zoneId: ZoneId.Vanaspati,
    timelineFile: 'vanaspati.txt',
    triggers: [
        {
            id: 'Vanaspati Terminus Snatcher Note of Despair',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6238', source: 'Terminus Snatcher', capture: false }),
            response: Responses.aoe(),
        },
        {
            id: 'Vanaspati Terminus Snatcher Mouth Off',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6231', source: 'Terminus Snatcher', capture: false }),
            infoText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'Go To Silent Mouth',
                },
            },
        },
        {
            id: 'Vanaspati Terminus Snatcher Last Gasp',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6235', source: 'Terminus Snatcher', capture: false }),
            response: Responses.aoe(),
        },
        {
            id: 'Vanaspati Terminus Snatcher What Is Right',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6233', source: 'Terminus Snatcher', capture: false }),
            response: Responses.goLeft(),
        },
        {
            id: 'Vanaspati Terminus Snatcher What Is Left',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6234', source: 'Terminus Snatcher', capture: false }),
            response: Responses.goRight(),
        },
        {
            id: 'Vanaspati Terminus Snatcher Wallow',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6236', source: 'Terminus Snatcher' }),
            condition: Conditions.targetIsYou(),
            response: Responses.spread(),
        },
        {
            id: 'Vanaspati Terminus Wrecker Meaningless Destruction',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6241', source: 'Terminus Wrecker', capture: false }),
            response: Responses.aoe(),
        },
        {
            id: 'Vanaspati Terminus Wrecker Total Wreck',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6242', source: 'Terminus Wrecker' }),
            response: Responses.tankBuster(),
        },
        {
            id: 'Vanaspati Terminus Wrecker Aether Spray Knockback',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '623C', source: 'Terminus Wrecker' }),
            delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 5,
            response: Responses.knockback(),
        },
        {
            id: 'Vanaspati Terminus Wrecker Aether Spray Bubble',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '623B', source: 'Terminus Wrecker', capture: false }),
            infoText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'Get In Bubble',
                },
            },
        },
        {
            id: 'Vanaspati Terminus Twitcher Double Hex Eye',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6C21', source: 'Terminus Twitcher', capture: false }),
            response: Responses.lookAway(),
        },
        {
            id: 'Vanaspati Svarbhanu Cosmic Kiss Spread',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6250', source: 'Svarbhanu' }),
            condition: Conditions.targetIsYou(),
            response: Responses.spread(),
        },
        {
            id: 'Vanaspati Svarbhanu Gnashing Of Teeth',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6253', source: 'Svarbhanu' }),
            response: Responses.tankBuster(),
        },
        {
            id: 'Vanaspati Svarbhanu Aetherial Disruption',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6248', source: 'Svarbhanu', capture: false }),
            infoText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'Go To Opposite Color',
                },
            },
        },
    ],
    timelineReplace: [
        {
            'locale': 'en',
            'replaceText': {
                'What Is Left/What Is Right': 'What Is Left/Right',
            },
        },
    ],
});
