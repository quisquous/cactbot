Options.Triggers.push({
    zoneId: ZoneId.TheBindingCoilOfBahamutTurn5,
    timelineFile: 't5.txt',
    initData: () => {
        return {
            monitoringHP: false,
            hpThresholds: [0.85, 0.55, 0.29],
            currentPhase: 0,
        };
    },
    triggers: [
        {
            id: 'T5 Twintania Phase Change Watcher',
            type: 'Ability',
            netRegex: { source: 'Twintania' },
            condition: (data) => !data.monitoringHP && data.hpThresholds[data.currentPhase] !== undefined,
            preRun: (data) => data.monitoringHP = true,
            promise: (data, matches) => Util.watchCombatant({
                ids: [parseInt(matches.sourceId, 16)],
            }, (ret) => {
                const twintaniaBelowGivenHP = ret.combatants.some((c) => {
                    const currentHPCheck = data.hpThresholds[data.currentPhase] ?? -1;
                    return c.CurrentHP / c.MaxHP <= currentHPCheck;
                });
                return twintaniaBelowGivenHP;
            }),
            sound: 'Long',
            run: (data) => {
                data.currentPhase++;
                data.monitoringHP = false;
            },
        },
        {
            id: 'T5 Death Sentence',
            type: 'StartsUsing',
            netRegex: { source: 'Twintania', id: '5B2' },
            response: Responses.tankBuster(),
        },
        {
            id: 'T5 Death Sentence Warning',
            type: 'StartsUsing',
            netRegex: { source: 'Twintania', id: '5B2', capture: false },
            delaySeconds: 30,
            suppressSeconds: 5,
            infoText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'Death Sentence Soon',
                    de: 'Todesurteil bald',
                    fr: 'Peine de mort bientôt',
                    ja: 'まもなくデスセンテンス',
                    cn: '死刑',
                    ko: '사형선고',
                },
            },
        },
        {
            id: 'T5 Liquid Hell',
            type: 'StartsUsing',
            netRegex: { source: 'The Scourge Of Meracydia', id: '4DB', capture: false },
            infoText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'Liquid Hell',
                    de: 'Höllenschmelze',
                    fr: 'Enfer liquide',
                    ja: 'ヘルリキッド',
                    cn: '液体地狱',
                    ko: '지옥의 늪',
                },
            },
        },
        {
            id: 'T5 Fireball',
            type: 'Ability',
            netRegex: { source: 'Twintania', id: '5AC' },
            alertText: (data, matches, output) => {
                if (data.me === matches.target)
                    return output.fireballOnYou();
            },
            infoText: (data, matches, output) => {
                if (data.me !== matches.target)
                    return output.fireballOn({ player: data.ShortName(matches.target) });
            },
            outputStrings: {
                fireballOn: {
                    en: 'Fireball on ${player}',
                    de: 'Feuerball auf ${player}',
                    fr: 'Boule de feu sur ${player}',
                    ja: '${player}にファイアボール',
                    cn: '火球点${player}',
                    ko: '"${player}" 쉐어징',
                },
                fireballOnYou: {
                    en: 'Fireball on YOU',
                    de: 'Feuerball auf DIR',
                    fr: 'Boule de feu sur VOUS',
                    ja: '自分にファイアボール',
                    cn: '火球点名',
                    ko: '나에게 화염구',
                },
            },
        },
        {
            id: 'T5 Conflagration',
            type: 'Ability',
            netRegex: { source: 'Twintania', id: '5AB' },
            alarmText: (data, matches, output) => {
                if (data.me === matches.target)
                    return output.conflagOnYou();
            },
            infoText: (data, matches, output) => {
                if (data.me !== matches.target)
                    return output.conflagOn({ player: data.ShortName(matches.target) });
            },
            outputStrings: {
                conflagOn: {
                    en: 'Conflag on ${player}',
                    de: 'Feuersturm auf ${player}',
                    fr: 'Tempête de feu sur ${player}',
                    ja: '${player}にファイアストーム',
                    cn: '火焰流点${player}',
                    ko: '불보라${player}',
                },
                conflagOnYou: {
                    en: 'Conflag on YOU',
                    de: 'Feuersturm auf DIR',
                    fr: 'Tempête de feu sur VOUS',
                    ja: '自分にファイアストーム',
                    cn: '火焰流点名',
                    ko: '불보라 보스밑으로',
                },
            },
        },
        {
            id: 'T5 Divebomb',
            type: 'Ability',
            netRegex: { source: 'Twintania', id: '5B0', capture: false },
            alertText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'DIVEBOMB',
                    de: 'STURZBOMBE',
                    fr: 'BOMBE PLONGEANTE',
                    ja: 'ダイブボム',
                    cn: '俯冲',
                    ko: '급강하',
                },
            },
        },
        {
            id: 'T5 Divebomb Set Two',
            type: 'Ability',
            netRegex: { source: 'Twintania', id: '5B0', capture: false },
            delaySeconds: 60,
            suppressSeconds: 5000,
            infoText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'Divebombs Soon',
                    de: 'Sturzbombe bald',
                    fr: 'Bombe plongeante bientôt',
                    ja: 'まもなくダイブボム',
                    cn: '即将俯冲',
                    ko: '급강하 준비',
                },
            },
        },
        {
            // Unwoven Will
            id: 'T5 Dreadknight',
            type: 'Ability',
            netRegex: { source: 'Twintania', id: '4E3' },
            infoText: (data, matches, output) => {
                if (data.me === matches.target)
                    return output.knightOnYou();
                return output.knightOn({ player: data.ShortName(matches.target) });
            },
            outputStrings: {
                knightOnYou: {
                    en: 'Knight on YOU',
                    de: 'Furchtritter auf DIR',
                    fr: 'Chevalier sur VOUS',
                    ja: '自分にナイト',
                    cn: '骑士点名',
                    ko: '드레드 대상자',
                },
                knightOn: {
                    en: 'Knight on ${player}',
                    de: 'Furchtritter auf ${player}',
                    fr: 'Chevalier sur ${player}',
                    ja: '${player}にナイト',
                    cn: '骑士点${player}',
                    ko: '"${player}" 드래드 대상',
                },
            },
        },
        {
            id: 'T5 Twister',
            type: 'StartsUsing',
            netRegex: { source: 'Twintania', id: '4E1', capture: false },
            alertText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'Twister!',
                    de: 'Wirbelsturm!',
                    fr: 'Tornade !',
                    ja: 'ツイスター!',
                    cn: '风风风！',
                    ko: '회오리',
                },
            },
        },
        {
            id: 'T5 Hatch',
            type: 'Ability',
            netRegex: { source: 'Twintania', id: '5AD' },
            alertText: (data, matches, output) => {
                if (data.me === matches.target)
                    return output.hatchOnYou();
            },
            infoText: (data, matches, output) => {
                if (data.me !== matches.target)
                    return output.hatchOn({ player: data.ShortName(matches.target) });
            },
            outputStrings: {
                hatchOn: {
                    en: 'Hatch on ${player}',
                    de: 'Austritt auf ${player}',
                    fr: 'Éclosion sur ${player}',
                    ja: '${player}に魔力爆散',
                    cn: '黑球点${player}',
                    ko: '"${player}" 마력방출',
                },
                hatchOnYou: {
                    en: 'Hatch on YOU',
                    de: 'Austritt auf DIR',
                    fr: 'Éclosion sur VOUS',
                    ja: '自分に魔力爆散',
                    cn: '黑球点名',
                    ko: '나에게 마력방출',
                },
            },
        },
    ],
    timelineReplace: [
        {
            'locale': 'de',
            'replaceSync': {
                'The Right Hand of Bahamut': 'Rechten Hand von Bahamut',
                'The Scourge Of Meracydia': 'Fackel von Meracydia',
                'Twintania': 'Twintania',
            },
            'replaceText': {
                'Aetheric Profusion': 'Ätherische Profusion',
                'Asclepius': 'Asclepius',
                'Death Sentence': 'Todesurteil',
                'Divebomb': 'Sturzbombe',
                'Fireball': 'Feuerball',
                'Firestorm': 'Feuersturm',
                'Hatch': 'Austritt',
                'Hygieia': 'Hygieia',
                'Liquid Hell': 'Höllenschmelze',
                'Plummet': 'Ausloten',
                'Twister': 'Wirbelsturm',
                'Unwoven Will': 'Entwobener Wille',
            },
        },
        {
            'locale': 'fr',
            'replaceSync': {
                'The Right Hand of Bahamut': 'la Serre droite de Bahamut',
                'The Scourge Of Meracydia': 'Fléau De Méracydia',
                'Twintania': 'Gémellia',
            },
            'replaceText': {
                '1x Asclepius Add': 'Add 1x Asclépios',
                '2x Hygieia Adds': 'Adds 2x Hygie',
                'Aetheric Profusion': 'Excès d\'éther',
                'Death Sentence': 'Peine de mort',
                'Divebomb': 'Bombe plongeante',
                'Fireball': 'Boule de feu',
                'Firestorm': 'Tempête de feu',
                'Hatch': 'Éclosion',
                'Liquid Hell': 'Enfer liquide',
                'Plummet': 'Piqué',
                'Twister': 'Tornade',
                'Unwoven Will': 'Volonté dispersée',
            },
        },
        {
            'locale': 'ja',
            'replaceSync': {
                'The Right Hand of Bahamut': 'バハムートの右手',
                'The Scourge Of Meracydia': 'メラシディアン・ワイバーン',
                'Twintania': 'ツインタニア',
            },
            'replaceText': {
                'Aetheric Profusion': 'エーテリックプロフュージョン',
                'Asclepius': 'アスクレピオス',
                'Death Sentence': 'デスセンテンス',
                'Divebomb': 'ダイブボム',
                'Fireball': 'ファイアボール',
                'Firestorm': 'ファイアストーム',
                'Hatch': '魔力爆散',
                'Hygieia': 'ヒュギエイア',
                'Liquid Hell': 'ヘルリキッド',
                'Plummet': 'プラメット',
                'Twister': 'ツイスター',
                'Unwoven Will': 'アンウォーヴェンウィル',
            },
        },
        {
            'locale': 'cn',
            'replaceSync': {
                'The Right Hand of Bahamut': '巴哈姆特的右手',
                'The Scourge Of Meracydia': '美拉西迪亚祸龙',
                'Twintania': '双塔尼亚',
            },
            'replaceText': {
                'Aetheric Profusion': '以太失控',
                'Asclepius': '阿斯克勒庇俄斯',
                'Death Sentence': '死刑',
                'Divebomb': '爆破俯冲',
                'Fireball': '火球',
                'Firestorm': '火焰风暴',
                'Hatch': '魔力爆散',
                'Hygieia': '许癸厄亚',
                'Liquid Hell': '液体地狱',
                'Plummet': '垂直下落',
                'Twister': '旋风',
                'Unwoven Will': '破愿',
            },
        },
        {
            'locale': 'ko',
            'replaceSync': {
                'The Right Hand of Bahamut': '바하무트의 오른손',
                'The Scourge Of Meracydia': '메라시디아 와이번',
                'Twintania': '트윈타니아',
            },
            'replaceText': {
                'Aetheric Profusion': '에테르 홍수',
                'Asclepius': '아스클레피오스',
                'Death Sentence': '사형 선고',
                'Divebomb': '급강하 폭격',
                'Fireball': '화염구',
                'Firestorm': '불보라',
                'Hatch': '마력 방출',
                'Hygieia': '히기에이아',
                'Liquid Hell': '지옥의 늪',
                'Plummet': '곤두박질',
                'Twister': '회오리',
                'Unwoven Will': '짓밟힌 의지',
            },
        },
    ],
});
