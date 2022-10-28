Options.Triggers.push({
    zoneId: ZoneId.HullbreakerIsle,
    triggers: [
        {
            id: 'Hullbreaker Isle Stool Pelt',
            type: 'StartsUsing',
            netRegex: { id: '89E', source: 'Sasquatch', capture: false },
            response: Responses.aoe(),
        },
        {
            id: 'Hullbreaker Isle Chest Thump',
            type: 'Ability',
            netRegex: { id: '89F', source: 'Sasquatch', capture: false },
            alertText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'Shake Banana tree',
                    de: 'Bananenbaum schütteln',
                    fr: 'Secouez le bananier',
                    cn: '摇晃香蕉树',
                    ko: '바나나 나무 사용하기',
                },
            },
        },
    ],
    timelineReplace: [
        {
            'locale': 'de',
            'replaceSync': {
                'Sasquatch': 'Sasquatch',
            },
        },
        {
            'locale': 'fr',
            'replaceSync': {
                'Sasquatch': 'Sasquatch',
            },
        },
        {
            'locale': 'ja',
            'replaceSync': {
                'Sasquatch': 'サスカッチ',
            },
        },
        {
            'locale': 'cn',
            'replaceSync': {
                'Sasquatch': '大脚巨猿',
            },
        },
        {
            'locale': 'ko',
            'replaceSync': {
                'Sasquatch': '사스콰치',
            },
        },
    ],
});
