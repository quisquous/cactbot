// Tsukuyomi Normal
Options.Triggers.push({
    zoneId: ZoneId.CastrumFluminis,
    timelineFile: 'tsukuyomi.txt',
    triggers: [
        {
            id: 'Tsukuyomi Torment Unto Death',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '2BE3', source: 'Tsukuyomi' }),
            response: Responses.tankCleave(),
        },
        {
            id: 'Tsukuyomi Reprimand',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '2BE2', source: 'Tsukuyomi', capture: false }),
            response: Responses.aoe(),
        },
        {
            id: 'Tsukuyomi Midnight Haze',
            type: 'AddedCombatant',
            netRegex: NetRegexes.addedCombatantFull({ npcNameId: '7230', capture: false }),
            response: Responses.killAdds(),
        },
        {
            id: 'Tsukuyomi Lead Of The Underworld',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '2BE6', source: 'Tsukuyomi' }),
            alertText: (data, matches, output) => {
                if (data.me === matches.target)
                    return output.lineStackOnYou();
                return output.lineStackOn({ player: data.ShortName(matches.target) });
            },
            outputStrings: {
                lineStackOnYou: {
                    en: 'Line Stack on YOU',
                },
                lineStackOn: {
                    en: 'Line Stack on ${player}',
                },
            },
        },
        {
            id: 'Tsukuyomi Nightbloom',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '2CB0', source: 'Tsukuyomi', capture: false }),
            response: Responses.aoe(),
        },
        {
            id: 'Tsukuyomi Lunacy',
            type: 'HeadMarker',
            netRegex: NetRegexes.headMarker({ id: '003E' }),
            response: Responses.stackMarkerOn(),
        },
        {
            id: 'Tsukuyomi Moonlit Debuff',
            type: 'GainsEffect',
            netRegex: NetRegexes.gainsEffect({ effectId: '602' }),
            condition: (data, matches) => {
                if (matches.target !== data.me)
                    return false;
                return parseInt(matches.count) >= 4;
            },
            alertText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'Move to Black!',
                    de: 'In\'s schwarze laufen!',
                    fr: 'Bougez en zone noire !',
                    ja: '新月に！',
                    cn: '踩黑色！',
                    ko: '검정색으로 이동!',
                },
            },
        },
        {
            id: 'Tsukuyomi Moonshadowed Debuff',
            type: 'GainsEffect',
            netRegex: NetRegexes.gainsEffect({ effectId: '603' }),
            condition: (data, matches) => {
                if (matches.target !== data.me)
                    return false;
                return parseInt(matches.count) >= 4;
            },
            alertText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'Move to White!',
                    de: 'In\'s weiße laufen!',
                    fr: 'Bougez en zone blanche !',
                    ja: '満月に！',
                    cn: '踩白色！',
                    ko: '흰색으로 이동!',
                },
            },
        },
        {
            id: 'Tsukuyomi Dance Of The Dead',
            // 2BFD is an unnamed ability that happens ~5 seconds before Dance Of The Dead.
            // Dance Of The Dead has no castbar.
            type: 'Ability',
            netRegex: NetRegexes.ability({ id: '2BFD', source: 'Tsukuyomi', capture: false }),
            response: Responses.aoe(),
        },
    ],
    timelineReplace: [
        {
            'locale': 'en',
            'replaceText': {
                'Bright Blade/Dark Blade': 'Bright/Dark Blade',
            },
        },
    ],
});
