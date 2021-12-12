Options.Triggers.push({
    zoneId: ZoneId.Smileton,
    timelineFile: 'smileton.txt',
    initData: () => {
        return {
            smileyFace: false,
            frownyFace: false,
        };
    },
    triggers: [
        {
            id: 'Smileton Face Off My Lawn',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: ['6C5E', '673E'], source: 'Face', capture: false }),
            infoText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'Knockback (one row)',
                },
            },
        },
        {
            id: 'Smileton Face Temper\'s Flare',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6743', source: 'Face', capture: false }),
            response: Responses.aoe(),
        },
        {
            id: 'Smileton Face Heart on Fire IV',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6742', source: 'Face' }),
            response: Responses.tankBuster(),
        },
        {
            id: 'Smileton Face Smiley Face Gain',
            type: 'GainsEffect',
            netRegex: NetRegexes.gainsEffect({ effectId: 'ACB', source: 'Face' }),
            condition: Conditions.targetIsYou(),
            run: (data) => data.smileyFace = true,
        },
        {
            id: 'Smileton Face Smiley Face Lose',
            type: 'LosesEffect',
            netRegex: NetRegexes.losesEffect({ effectId: 'ACB', source: 'Face' }),
            condition: Conditions.targetIsYou(),
            run: (data) => data.smileyFace = false,
        },
        {
            id: 'Smileton Face Frowny Face Gain',
            type: 'GainsEffect',
            netRegex: NetRegexes.gainsEffect({ effectId: 'ACC', source: 'Face' }),
            condition: Conditions.targetIsYou(),
            run: (data) => data.frownyFace = true,
        },
        {
            id: 'Smileton Face Frowny Face Lose',
            type: 'LosesEffect',
            netRegex: NetRegexes.losesEffect({ effectId: 'ACC', source: 'Face' }),
            condition: Conditions.targetIsYou(),
            run: (data) => data.frownyFace = false,
        },
        {
            id: 'Smileton Face MixedFeelings',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6738', source: 'Face', capture: false }),
            suppressSeconds: 1,
            infoText: (data, _matches, output) => {
                if (data.smileyFace)
                    return output.frowny();
                if (data.frownyFace)
                    return output.smiley();
                return output.either();
            },
            outputStrings: {
                smiley: {
                    en: 'Get hit by blue smiley',
                },
                frowny: {
                    en: 'Get hit by red frowny',
                },
                either: {
                    en: 'Get hit by either color',
                },
            },
        },
        {
            id: 'Smileton Frameworker Circular Saw',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6745', source: 'Frameworker', capture: false }),
            response: Responses.aoe(),
        },
        {
            id: 'Smileton Frameworker Steel Beam',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6744', source: 'Frameworker' }),
            response: Responses.tankBuster(),
        },
        {
            id: 'Smileton The Big Cheese Violent Discharge',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6752', source: 'The Big Cheese', capture: false }),
            response: Responses.goRight(),
        },
        {
            id: 'Smileton The Big Cheese Right Disassembler',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '674F', source: 'The Big Cheese', capture: false }),
            response: Responses.goRight(),
        },
        {
            id: 'Smileton The Big Cheese Left Disassembler',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6750', source: 'The Big Cheese', capture: false }),
            response: Responses.goLeft(),
        },
        {
            id: 'Smileton The Big Cheese Piercing Missile',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6751', source: 'The Big Cheese' }),
            response: Responses.tankBuster(),
        },
        {
            id: 'Smileton The Big Cheese Leveling Missile',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6755', source: 'The Big Cheese' }),
            condition: Conditions.targetIsYou(),
            response: Responses.spread(),
        },
        {
            id: 'Smileton The Big Cheese Electric Arc',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6753', source: 'The Big Cheese' }),
            response: Responses.stackMarkerOn(),
        },
    ],
    timelineReplace: [
        {
            'locale': 'en',
            'replaceText': {
                'Left Disassembler/Right Disassembler': 'Left/Right Disassembler',
            },
        },
    ],
});
