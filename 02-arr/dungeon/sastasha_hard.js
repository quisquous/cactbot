Options.Triggers.push({
    zoneId: ZoneId.SastashaHard,
    triggers: [
        {
            id: 'Sastasha Hard Slime',
            type: 'GainsEffect',
            netRegex: { effectId: '239' },
            condition: (data) => data.CanCleanse(),
            infoText: (data, matches, output) => output.text({ player: data.ShortName(matches.target) }),
            outputStrings: {
                text: {
                    en: 'Esuna ${player}',
                    de: 'Medica ${player}',
                    fr: 'Guérison sur ${player}',
                    ja: '${player} にエスナ',
                    cn: '驱散: ${player}',
                    ko: '"${player}" 에스나',
                },
            },
        },
        {
            id: 'Sastasha Hard Tail Screw',
            type: 'StartsUsing',
            netRegex: { id: 'BF4', source: 'Karlabos' },
            alertText: (data, matches, output) => {
                if (data.CanStun())
                    return output.stun({ name: matches.source });
            },
            infoText: (data, matches, output) => {
                return output.tailScrewOn({ player: data.ShortName(matches.target) });
            },
            outputStrings: {
                stun: Outputs.stunTarget,
                tailScrewOn: {
                    en: 'Tail Screw on ${player}',
                    de: 'Schweifschraube auf ${player}',
                    cn: '螺旋尾点${player}',
                    ko: '${player} 꼬리 후려치기',
                },
            },
        },
    ],
    timelineReplace: [
        {
            'locale': 'de',
            'replaceSync': {
                'Karlabos': 'Karlabos',
            },
        },
        {
            'locale': 'fr',
            'replaceSync': {
                'Karlabos': 'Karlabos',
            },
        },
        {
            'locale': 'ja',
            'replaceSync': {
                'Karlabos': 'カーラボス',
            },
        },
        {
            'locale': 'cn',
            'replaceSync': {
                'Karlabos': '真红龙虾',
            },
        },
        {
            'locale': 'ko',
            'replaceSync': {
                'Karlabos': '칼라보스',
            },
        },
    ],
});
