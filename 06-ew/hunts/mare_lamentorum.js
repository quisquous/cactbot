const underThenOut = {
    en: 'Under => Out',
};
const outStayOut = {
    en: 'Out => Stay Out',
};
Options.Triggers.push({
    zoneId: ZoneId.MareLamentorum,
    triggers: [
        {
            id: 'Hunt Lunatender Queen Away With You',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6AE5', source: 'Lunatender Queen', capture: false }),
            alertText: (data, _matches, output) => data.wickedWhim ? output.under() : output.out(),
            run: (data) => delete data.wickedWhim,
            outputStrings: {
                under: underThenOut,
                out: outStayOut,
            },
        },
        {
            id: 'Hunt Lunatender Queen You May Approach',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6AE4', source: 'Lunatender Queen', capture: false }),
            alertText: (data, _matches, output) => data.wickedWhim ? output.out() : output.under(),
            run: (data) => delete data.wickedWhim,
            outputStrings: {
                under: underThenOut,
                out: outStayOut,
            },
        },
        {
            id: 'Hunt Lunatender Queen Avert Your Eyes',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6AE9', source: 'Lunatender Queen', capture: false }),
            alertText: (data, _matches, output) => data.wickedWhim ? output.lookTowards() : output.lookAway(),
            run: (data) => delete data.wickedWhim,
            outputStrings: {
                lookTowards: Outputs.lookTowardsBoss,
                lookAway: Outputs.lookAway,
            },
        },
        {
            id: 'Hunt Lunatender Queen Wicked Whim',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6AE7', source: 'Lunatender Queen', capture: false }),
            run: (data) => data.wickedWhim = true,
        },
        {
            id: 'Hunt Lunatender Queen 999,000 Needles',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '6AE6', source: 'Lunatender Queen', capture: false }),
            response: Responses.outOfMelee(),
        },
        {
            id: 'Hunt Mousse Princess Rightward Whimsy',
            type: 'GainsEffect',
            netRegex: NetRegexes.gainsEffect({ effectId: 'B18', source: 'Mousse Princess', capture: false }),
            durationSeconds: 6,
            infoText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'Away from Right Flank',
                },
            },
        },
        {
            id: 'Hunt Mousse Princess Backward Whimsy',
            type: 'GainsEffect',
            netRegex: NetRegexes.gainsEffect({ effectId: 'B1A', source: 'Mousse Princess', capture: false }),
            durationSeconds: 6,
            infoText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'Away from Back',
                },
            },
        },
        {
            id: 'Hunt Mousse Princess Leftward Whimsy',
            type: 'GainsEffect',
            netRegex: NetRegexes.gainsEffect({ effectId: 'B19', source: 'Mousse Princess', capture: false }),
            durationSeconds: 6,
            infoText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'Away from Left Flank',
                },
            },
        },
        {
            id: 'Hunt Mousse Princess Forward Whimsy',
            type: 'GainsEffect',
            netRegex: NetRegexes.gainsEffect({ effectId: 'B8E', source: 'Mousse Princess', capture: false }),
            durationSeconds: 6,
            infoText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'Away from Front',
                },
            },
        },
    ],
});
