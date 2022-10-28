Options.Triggers.push({
    zoneId: ZoneId.MareLamentorum,
    resetWhenOutOfCombat: false,
    initData: () => {
        return {
            chitinous: [],
        };
    },
    triggers: [
        {
            id: 'Hunt Lunatender Queen Away With You',
            type: 'StartsUsing',
            netRegex: { id: '6AE5', source: 'Lunatender Queen', capture: false },
            condition: (data) => data.inCombat,
            response: Responses.getOut(),
        },
        {
            id: 'Hunt Lunatender Queen Away With You Whim',
            type: 'StartsUsing',
            netRegex: { id: '6AEB', source: 'Lunatender Queen', capture: false },
            condition: (data) => data.inCombat,
            response: Responses.getUnder(),
        },
        {
            id: 'Hunt Lunatender Queen You May Approach',
            type: 'StartsUsing',
            netRegex: { id: '6AE4', source: 'Lunatender Queen', capture: false },
            condition: (data) => data.inCombat,
            response: Responses.getUnder(),
        },
        {
            id: 'Hunt Lunatender Queen You May Approach Whim',
            type: 'StartsUsing',
            netRegex: { id: '6AEA', source: 'Lunatender Queen', capture: false },
            condition: (data) => data.inCombat,
            response: Responses.getOut(),
        },
        {
            id: 'Hunt Lunatender Queen Avert Your Eyes',
            type: 'StartsUsing',
            netRegex: { id: '6AE3', source: 'Lunatender Queen', capture: false },
            condition: (data) => data.inCombat,
            response: Responses.lookAway(),
        },
        {
            id: 'Hunt Lunatender Queen Avert Your Eyes Whim',
            type: 'StartsUsing',
            netRegex: { id: '6AE9', source: 'Lunatender Queen', capture: false },
            condition: (data) => data.inCombat,
            response: Responses.lookTowards(),
        },
        {
            id: 'Hunt Lunatender Queen 999,000 Needles',
            type: 'StartsUsing',
            netRegex: { id: '6AE6', source: 'Lunatender Queen', capture: false },
            condition: (data) => data.inCombat,
            response: Responses.outOfMelee(),
        },
        {
            id: 'Hunt Mousse Princess Rightward Whimsy',
            type: 'GainsEffect',
            netRegex: { effectId: 'B18', source: 'Mousse Princess', capture: false },
            condition: (data) => data.inCombat,
            durationSeconds: 6,
            infoText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'Away from Right Flank',
                    de: 'Weg von der rechten Flanke',
                    fr: 'Éloignez-vous du flanc droit',
                    ja: '右が危険',
                    cn: '远离右侧',
                    ko: '보스 오른쪽 피하기',
                },
            },
        },
        {
            id: 'Hunt Mousse Princess Backward Whimsy',
            type: 'GainsEffect',
            netRegex: { effectId: 'B1A', source: 'Mousse Princess', capture: false },
            condition: (data) => data.inCombat,
            durationSeconds: 6,
            infoText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'Away from Back',
                    de: 'Weg von hinter ihr',
                    fr: 'Éloignez-vous de l\'arrière',
                    ja: '後ろが危険',
                    cn: '远离后方',
                    ko: '보스 뒤 피하기',
                },
            },
        },
        {
            id: 'Hunt Mousse Princess Leftward Whimsy',
            type: 'GainsEffect',
            netRegex: { effectId: 'B19', source: 'Mousse Princess', capture: false },
            condition: (data) => data.inCombat,
            durationSeconds: 6,
            infoText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'Away from Left Flank',
                    de: 'Weg von der linker Flanke',
                    fr: 'Éloignez-vous du flanc gauche',
                    ja: '左が危険',
                    cn: '远离左侧',
                    ko: '보스 왼쪽 피하기',
                },
            },
        },
        {
            id: 'Hunt Mousse Princess Forward Whimsy',
            type: 'GainsEffect',
            netRegex: { effectId: 'B8E', source: 'Mousse Princess', capture: false },
            condition: (data) => data.inCombat,
            durationSeconds: 6,
            infoText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'Away from Front',
                    de: 'Weg von Vorne',
                    fr: 'Éloignez-vous du devant',
                    ja: '前方が危険',
                    cn: '远离前方',
                    ko: '보스 앞 피하기',
                },
            },
        },
        {
            id: 'Hunt Mousse Princess Banish',
            type: 'StartsUsing',
            netRegex: { id: '6ABB', source: 'Mousse Princess' },
            condition: (data) => data.inCombat,
            // Doesn't cleave (I think?).
            response: Responses.tankBuster('info'),
        },
        {
            id: 'Hunt Mousse Princess Amorphic Flail',
            type: 'StartsUsing',
            netRegex: { id: '6AB9', source: 'Mousse Princess', capture: false },
            condition: (data) => data.inCombat,
            response: Responses.outOfMelee(),
        },
        {
            // Note: "out" here means "get out", and "in" means "get in"
            // There's a Trace cast, followed by a number of indicators,
            // then an Advance/Reversal cast (which is the first set of damage)
            // followed by several instant damage casts, e.g.
            //
            //   68FA/68FC/68FD/68FC/68FC => 6923/6637/6638/6637
            //   ... means the following:
            //   68FA (trace, first out), 68FC (out), 68FD (in), 68FC (out), 68FC (in)
            //   6923 (reversal cast/in) -> 6637 (out) -> 6638 (in) -> 6637 (out)
            //
            // Casts:
            // 68FA = chitinous trace, first indicator is out (68FC)
            // 68FB = chitinous trace, first indicator is in (68FD)
            // 68FC = "get out" indicator
            // 68FD = "get in" indicator
            //
            // Casts that do damage:
            // 68FE = chitinous advance out first
            // 68FF = chitinous advance in first
            // 6923 = chitinous reversal out first
            // 6924 = chitinous reversal in first
            //
            // Instant Abilities:
            // 6637 = out (reversal)
            // 6638 = in (reversal)
            // 6900 = out (advance)
            // 6901 = in (advance)
            id: 'Hunt Ruminator Chitinous Trace',
            type: 'StartsUsing',
            netRegex: { id: ['68FA', '68FB'], source: 'Ruminator', capture: false },
            run: (data) => data.chitinous = [],
        },
        {
            id: 'Hunt Ruminator Chitinous Trace Out',
            type: 'StartsUsing',
            netRegex: { id: '68FC', source: 'Ruminator', capture: false },
            run: (data) => data.chitinous.push('out'),
        },
        {
            id: 'Hunt Ruminator Chitinous Trace In',
            type: 'StartsUsing',
            netRegex: { id: '68FD', source: 'Ruminator', capture: false },
            run: (data) => data.chitinous.push('in'),
        },
        {
            id: 'Hunt Ruminator Chitinous Reversal',
            type: 'StartsUsing',
            netRegex: { id: ['6923', '6924'], source: 'Ruminator', capture: false },
            run: (data) => data.chitinous.reverse(),
        },
        {
            id: 'Hunt Ruminator Chitinous All Dirs',
            type: 'StartsUsing',
            netRegex: { id: ['68FE', '68FF', '6923', '6924'], source: 'Ruminator', capture: false },
            // TODO: maybe figure out the duration from the length?
            durationSeconds: 5,
            sound: '',
            infoText: (data, _matches, output) => {
                if (data.chitinous.length === 0)
                    return;
                if (!data.inCombat)
                    return;
                return data.chitinous.map((x) => output[x]()).join(output.joiner());
            },
            tts: null,
            outputStrings: {
                out: Outputs.out,
                in: Outputs.in,
                joiner: {
                    en: ' => ',
                    de: ' => ',
                    ko: ' => ',
                },
                unknown: Outputs.unknown,
            },
        },
        {
            id: 'Hunt Ruminator Chitinous Initial',
            type: 'StartsUsing',
            netRegex: { id: ['68FE', '68FF', '6923', '6924'], source: 'Ruminator', capture: false },
            alertText: (data, _matches, output) => {
                // TODO: should we verify that 68FE/6923 are out and 68FF/6924 are in?
                const key = data.chitinous.shift() ?? 'unknown';
                if (!data.inCombat)
                    return;
                return output[key]();
            },
            outputStrings: {
                out: Outputs.out,
                in: Outputs.in,
                unknown: Outputs.unknown,
            },
        },
        {
            id: 'Hunt Ruminator Chitinous Step',
            type: 'Ability',
            netRegex: { id: ['68FE', '68FF', '6923', '6924', '6637', '6638', '6900', '6901'], source: 'Ruminator', capture: false },
            suppressSeconds: 1,
            infoText: (data, _matches, output) => {
                // Skip the last one.
                const key = data.chitinous.shift();
                if (!key)
                    return;
                if (!data.inCombat)
                    return;
                return output[key]();
            },
            outputStrings: {
                out: Outputs.out,
                in: Outputs.in,
            },
        },
        {
            id: 'Hunt Ruminator Stygian Vapor',
            type: 'StartsUsing',
            netRegex: { id: '6902', source: 'Ruminator', capture: false },
            condition: (data) => data.inCombat,
            response: Responses.aoe(),
        },
    ],
    timelineReplace: [
        {
            'locale': 'de',
            'replaceSync': {
                'Lunatender Queen': 'Lunatender-Königin',
                'Mousse Princess': 'Mousse-Prinzessin',
                'Ruminator': 'Grübler',
            },
        },
        {
            'locale': 'fr',
            'replaceSync': {
                'Lunatender Queen': 'pampa sélénienne reine',
                'Mousse Princess': 'princesse mousse',
                'Ruminator': 'ruminateur',
            },
        },
        {
            'locale': 'ja',
            'replaceSync': {
                'Lunatender Queen': 'ルナテンダー・クイーン',
                'Mousse Princess': 'ムースプリンセス',
                'Ruminator': 'ルミネイター',
            },
        },
        {
            'locale': 'cn',
            'replaceSync': {
                'Lunatender Queen': '月面仙人刺女王',
                'Mousse Princess': '慕斯公主',
                'Ruminator': '沉思之物',
            },
        },
        {
            'locale': 'ko',
            'replaceSync': {
                'Lunatender Queen': '루나텐더 여왕',
                'Mousse Princess': '무스 공주',
                'Ruminator': '되새기는 자',
            },
        },
    ],
});
