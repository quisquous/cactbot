// O11N - Alphascape 3.0
Options.Triggers.push({
    zoneId: ZoneId.AlphascapeV30,
    timelineFile: 'o11n.txt',
    timelineTriggers: [
        {
            id: 'O11N Blaster',
            regex: /Blaster/,
            beforeSeconds: 3,
            condition: (data) => data.role === 'tank',
            infoText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'Tank Tether',
                    de: 'Tank Verbindung',
                    fr: 'Lien tank',
                    ja: 'タンク 線を取る',
                    cn: '坦克接线远离人群',
                    ko: '탱 블래스터 징',
                },
            },
        },
    ],
    triggers: [
        {
            id: 'O11N Atomic Ray',
            type: 'StartsUsing',
            netRegex: { id: '3286', source: 'Omega', capture: false },
            response: Responses.aoe(),
        },
        {
            id: 'O11N Mustard Bomb',
            type: 'StartsUsing',
            netRegex: { id: '3287', source: 'Omega' },
            response: Responses.tankBuster('alarm'),
        },
        {
            // Ability IDs:
            // Starboard 1: 3281
            // Starboard 2: 3282
            // Larboard 1: 3283
            // Larboard 2: 3284
            // For the cannons, match #1 and #2 for the first one.  This is so
            // that if a log entry for the first is dropped for some reason, it
            // will at least say left/right for the second.
            id: 'O11N Cannon Cleanup',
            type: 'StartsUsing',
            netRegex: { id: '328[13]', source: 'Omega', capture: false },
            delaySeconds: 15,
            run: (data) => delete data.lastWasStarboard,
        },
        {
            id: 'O11N Starboard Cannon 1',
            type: 'StartsUsing',
            netRegex: { id: '328[12]', source: 'Omega', capture: false },
            condition: (data) => data.lastWasStarboard === undefined,
            response: Responses.goLeft(),
            run: (data) => data.lastWasStarboard = true,
        },
        {
            id: 'O11N Larboard Cannon 1',
            type: 'StartsUsing',
            netRegex: { id: '328[34]', source: 'Omega', capture: false },
            condition: (data) => data.lastWasStarboard === undefined,
            response: Responses.goRight(),
            run: (data) => data.lastWasStarboard = false,
        },
        {
            id: 'O11N Starboard Cannon 2',
            type: 'StartsUsing',
            netRegex: { id: '3282', source: 'Omega', capture: false },
            condition: (data) => data.lastWasStarboard !== undefined,
            alertText: (data, _matches, output) => {
                if (data.lastWasStarboard)
                    return output.moveLeft();
                return output.stayLeft();
            },
            outputStrings: {
                moveLeft: {
                    en: 'Move (Left)',
                    de: 'Bewegen (Links)',
                    fr: 'Bougez (À gauche)',
                    ja: '動け (左へ)',
                    cn: '去左边',
                    ko: '이동 (왼쪽)',
                },
                stayLeft: {
                    en: 'Stay (Left)',
                    de: 'Stehenbleiben (Links)',
                    fr: 'Restez (À gauche)',
                    ja: 'そのまま (左に)',
                    cn: '呆在左边',
                    ko: '멈추기 (왼쪽)',
                },
            },
        },
        {
            id: 'O11N Larboard Cannon 2',
            type: 'StartsUsing',
            netRegex: { id: '3284', source: 'Omega', capture: false },
            condition: (data) => data.lastWasStarboard !== undefined,
            alertText: (data, _matches, output) => {
                if (data.lastWasStarboard)
                    return output.stayRight();
                return output.moveRight();
            },
            outputStrings: {
                stayRight: {
                    en: 'Stay (Right)',
                    de: 'Stehenbleiben (Rechts)',
                    fr: 'Restez (À droite)',
                    ja: 'そのまま (右に)',
                    cn: '呆在右边',
                    ko: '멈추기 (오른쪽)',
                },
                moveRight: {
                    en: 'Move (Right)',
                    de: 'Bewegen (Rechts)',
                    fr: 'Bougez (À droite)',
                    ja: '動け (右へ)',
                    cn: '去右边',
                    ko: '이동 (오른쪽)',
                },
            },
        },
        {
            id: 'O11N Ballistic Missile',
            type: 'HeadMarker',
            netRegex: { id: '0065' },
            condition: Conditions.targetIsYou(),
            alertText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'Drop Fire Outside',
                    de: 'Feuer draußen ablegen',
                    fr: 'Déposez le feu à l\'extérieur',
                    cn: '把火放在外面',
                    ko: '불 장판 바깥으로 유도',
                },
            },
        },
        {
            id: 'O11N Electric Slide',
            type: 'HeadMarker',
            netRegex: { id: '003E' },
            response: Responses.stackMarkerOn(),
        },
        {
            id: 'O11N Delta Attack',
            type: 'StartsUsing',
            netRegex: { id: '327B', source: 'Omega', capture: false },
            delaySeconds: 3,
            infoText: (_data, _matches, output) => output.text(),
            outputStrings: {
                text: {
                    en: 'Use duty action on Conductive Focus',
                    de: 'Benutze Spezialkommando auf "Ziel des Blitzstrahls"',
                    fr: 'Utilisez l\'action spéciale sur le Point de convergence électrique',
                    cn: '在雷力投射点上使用任务指令',
                    ko: '뇌력 투사 지점에 교란기 사용',
                },
            },
        },
    ],
    timelineReplace: [
        {
            'locale': 'de',
            'replaceSync': {
                'Engaging Delta Attack protocol': 'Reinitialisiere Deltaprotokoll',
                'Level Checker': 'Monitor',
                'Omega': 'Omega',
                'Rocket Punch': 'Raketenschlag',
            },
            'replaceText': {
                'Atomic Ray': 'Atomstrahlung',
                'Ballistic Impact': 'Ballistischer Einschlag',
                'Ballistic Missile': 'Ballistische Rakete',
                'Blaster': 'Blaster',
                'Delta Attack': 'Delta-Attacke',
                'Electric Slide': 'Elektrosturz',
                'Executable': 'Programmstart',
                'Flamethrower': 'Flammenwerfer',
                'Force Quit': 'Erzwungenes Herunterfahren',
                'Mustard Bomb': 'Senfbombe',
                'Peripheral Synthesis': 'Ausdrucken',
                'Program Loop': 'Programmschleife',
                'Reformat': 'Optimierung',
                'Reset': 'Zurücksetzen',
                'Rush': 'Stürmen',
                'Starboard/Larboard Cannon': 'Steuerbord/Backbord Kanone',
            },
        },
        {
            'locale': 'fr',
            'replaceSync': {
                'Engaging Delta Attack protocol': 'Nécessité d\'utiliser l\'attaque Delta',
                'Level Checker': 'vérifiniveau',
                'Omega': 'Oméga',
                'Rocket Punch': 'Astéropoing',
            },
            'replaceText': {
                '\\?': ' ?',
                'Atomic Ray': 'Rayon atomique',
                'Ballistic Impact': 'Impact de missile',
                'Ballistic Missile': 'Tir de missile',
                'Blaster': 'Électrochoc',
                'Delta Attack': 'Attaque Delta',
                'Electric Slide': 'Glissement Oméga',
                'Executable': 'Exécution de programme',
                'Flamethrower': 'Lance-flammes',
                'Force Quit': 'Interruption forcée',
                'Mustard Bomb': 'Obus d\'ypérite',
                'Peripheral Synthesis': 'Impression',
                'Program Loop': 'Boucle de programme',
                'Reformat': 'Optimisation',
                'Reset': 'Réinitialisation',
                'Rush': 'Ruée',
                'Starboard/Larboard Cannon': 'Tribord/Bâbord',
            },
        },
        {
            'locale': 'ja',
            'replaceSync': {
                'Engaging Delta Attack protocol': 'デルタアタックの必要性を認定します',
                'Level Checker': 'レベルチェッカー',
                'Omega': 'オメガ',
                'Rocket Punch': 'ロケットパンチ',
            },
            'replaceText': {
                'Atomic Ray': 'アトミックレイ',
                'Ballistic Impact': 'ミサイル着弾',
                'Ballistic Missile': 'ミサイル発射',
                'Blaster': 'ブラスター',
                'Delta Attack': 'デルタアタック',
                'Electric Slide': 'オメガスライド',
                'Executable': 'プログラム実行',
                'Flamethrower': '火炎放射',
                'Force Quit': '強制終了',
                'Mustard Bomb': 'マスタードボム',
                'Peripheral Synthesis': 'プリントアウト',
                'Program Loop': 'サークルプログラム',
                'Reformat': '最適化',
                'Reset': '初期化',
                'Rush': '突進',
                'Starboard/Larboard Cannon': '右舷/左舷・波動砲',
            },
        },
        {
            'locale': 'cn',
            'replaceSync': {
                'Engaging Delta Attack protocol': '认定有必要使用三角攻击。',
                'Level Checker': '等级检测仪',
                'Omega': '欧米茄',
                'Rocket Punch': '火箭飞拳',
            },
            'replaceText': {
                'Atomic Ray': '原子射线',
                'Ballistic Impact': '导弹命中',
                'Ballistic Missile': '导弹发射',
                'Blaster': '冲击波',
                'Delta Attack': '三角攻击',
                'Electric Slide': '欧米茄滑跃',
                'Executable': '运行程序',
                'Flamethrower': '火焰喷射器',
                'Force Quit': '强制结束',
                'Mustard Bomb': '芥末爆弹',
                'Peripheral Synthesis': '生成外设',
                'Program Loop': '循环程序',
                'Reformat': '最优化',
                'Reset': '初始化',
                'Rush': '突进',
                'Starboard/Larboard Cannon': '右/左舷齐射·波动炮',
            },
        },
        {
            'locale': 'ko',
            'replaceSync': {
                'Engaging Delta Attack protocol': '델타 공격의 필요성을 인정합니다',
                'Level Checker': '레벨 측정기',
                'Omega': '오메가',
                'Rocket Punch': '로켓 주먹',
            },
            'replaceText': {
                'Atomic Ray': '원자 파동',
                'Ballistic Impact': '미사일 착탄',
                'Ballistic Missile': '미사일 발사',
                'Blaster': '블래스터',
                'Delta Attack': '델타 공격',
                'Electric Slide': '오메가 슬라이드',
                'Executable': '프로그램 실행',
                'Flamethrower': '화염 방사',
                'Force Quit': '강제 종료',
                'Mustard Bomb': '겨자 폭탄',
                'Peripheral Synthesis': '출력',
                'Program Loop': '순환 프로그램',
                'Reformat': '최적화',
                'Reset': '초기화',
                'Rush': '돌진',
                'Starboard/Larboard Cannon': '좌/우현 사격 파동포',
            },
        },
    ],
});
