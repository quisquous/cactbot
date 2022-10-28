Options.Triggers.push({
    zoneId: ZoneId.TheBindingCoilOfBahamutTurn1,
    initData: () => {
        return {
            started: false,
        };
    },
    triggers: [
        {
            id: 'T1 High Voltage',
            type: 'StartsUsing',
            netRegex: { source: 'Ads', id: '5A7' },
            condition: (data) => data.CanSilence(),
            response: Responses.interrupt(),
        },
        {
            // Indiscriminate Hood Swing
            id: 'T1 Initiated',
            type: 'Ability',
            netRegex: { source: 'Caduceus', id: '4B8.*?', capture: false },
            run: (data) => data.started = true,
        },
        {
            id: 'T1 Regorge',
            type: 'Ability',
            netRegex: { source: 'Caduceus', id: '4BA' },
            condition: Conditions.targetIsYou(),
            alertText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'Spit on YOU',
                    de: 'Spucke auf DIR',
                    fr: 'Crachat sur VOUS',
                    ja: '自分にリゴージ',
                    cn: '吐痰点名',
                },
            },
        },
        {
            id: 'T1 Split',
            type: 'AddedCombatant',
            netRegex: { name: 'Caduceus', capture: false },
            condition: (data) => data.started,
            suppressSeconds: 5,
            alertText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'Split',
                    de: 'Teilen',
                    fr: 'Division',
                    ja: '分裂',
                    cn: '分裂',
                },
            },
        },
        {
            id: 'T1 Hood Swing',
            type: 'Ability',
            netRegex: { source: 'Caduceus', id: '4B8' },
            condition: Conditions.targetIsYou(),
            delaySeconds: 8,
            suppressSeconds: 5,
            infoText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'Hood Swing in 10',
                    de: 'Kapuzenschwung in 10',
                    fr: 'Coup de capot dans 10s',
                    ja: '十秒以内タンクバスター',
                    cn: '10秒内死刑',
                },
            },
        },
        {
            id: 'T1 Slime Timer First',
            type: 'GameLog',
            netRegex: NetRegexes.message({ line: 'The Allagan megastructure will be sealed off.*?', capture: false }),
            delaySeconds: 35,
            suppressSeconds: 5,
            infoText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'Slime Soon',
                    de: 'Schleim bald',
                    fr: 'Gluant bientôt',
                    ja: 'まもなくスライム',
                    cn: '软泥即将出现',
                },
            },
        },
        {
            id: 'T1 Slime Timer',
            type: 'AddedCombatant',
            netRegex: { name: 'Dark Matter Slime', capture: false },
            delaySeconds: 35,
            suppressSeconds: 5,
            infoText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'Slime Soon',
                    de: 'Schleim bald',
                    fr: 'Gluant bientôt',
                    ja: 'まもなくスライム',
                    cn: '软泥即将出现',
                },
            },
        },
    ],
    timelineReplace: [
        {
            'locale': 'de',
            'replaceSync': {
                'Ads': 'Abwehrsystem',
                'Caduceus': 'Caduceus',
                'Dark Matter Slime': 'Dunkelmaterien-Schleim',
                'The Allagan megastructure': 'Allagische Superstruktur',
            },
        },
        {
            'locale': 'fr',
            'replaceSync': {
                'Ads': 'Sphère De Contrôle',
                'Caduceus': 'Caducée',
                'Dark Matter Slime': 'Gluant De Matière Sombre',
                'The Allagan megastructure': 'Mégastructure allagoise',
            },
        },
        {
            'locale': 'ja',
            'replaceSync': {
                'Ads': '制御システム',
                'Caduceus': 'カドゥケウス',
                'Dark Matter Slime': 'ダークマター・スライム',
                'The Allagan megastructure': 'アラグの遺構',
            },
        },
        {
            'locale': 'cn',
            'replaceSync': {
                'Ads': '自卫系统',
                'Caduceus': '神杖巨蛇',
                'Dark Matter Slime': '暗物质粘液怪',
                'The Allagan megastructure': '亚拉戈遗构',
            },
        },
        {
            'locale': 'ko',
            'replaceSync': {
                'Ads': '제어 시스템',
                'Caduceus': '카두케우스',
                'Dark Matter Slime': '암흑물질 슬라임',
                'The Allagan megastructure': '알라그 유적',
            },
        },
    ],
});
