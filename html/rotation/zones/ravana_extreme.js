(function () {
    var ravana = {
        bossName: "Ravana",
        enrageSeconds: 600,
        startLog: "Dance to the song of ringing steel",
        phases: [
            {
                title: "Phase 1 (warmup)",
                loop: true,
                // FIXME: guessing on loop
                loopSeconds: 45,
                endHpPercent: 87,
                endLog: "Ravana uses Scorpion Avatar",
                rotation: [
                    //[23:48:09.000] 00:0044:Dance to the song of ringing steel!
                    //[23:48:16.000] 00:282b:Ravana uses Blinding Blade.
                    { name: "Blinding Blade", time: 7 },
                    //[23:48:22.000] 00:282b:Ravana uses The Seeing Left.
                    { name: "Seeing Whatever", time: 13 },
                    //[23:48:25.000] 00:282b:Ravana uses Atma-Linga.
                    { name: "Atma-Linga", time: 16 },
                    //[23:48:31.000] 00:282b:Ravana uses Tapasya.
                    { name: "Tapasya", time: 22 },
                    //[23:48:38.000] 00:282b:Ravana uses Atma-Linga.
                    { name: "Atma-Linga", time: 29 },
                    //[23:48:42.000] 00:282b:Ravana uses Blinding Blade.
                    { name: "Blinding Blade", time: 33 },
                    { name: "Atma-Linga???", time: 39 },
                ],
            },
            {
                title: "Phase 2 (ifrit charges)",
                endLog: "Ravana uses Dragonfly Avatar",
                rotation: [
                    //[23:49:00.000] 00:282b:Ravana uses Scorpion Avatar.
                    //[23:49:05.000] 00:282b:Ravana uses Blades of Carnage and Liberation.
                    //[23:49:06.000] 00:2aab:Ravana readies Prelude to Liberation.
                    //[23:49:24.000] 00:282b:Ravana uses Prelude to Liberation.
                    { name: "Prelude to Liberation (away)", time: 24 },
                    //[23:49:31.000] 00:302b:Ravana uses Prelude to Liberation.
                    //[23:49:38.000] 00:302b:Ravana uses Prelude to Liberation.
                    { name: "(drop fire in middle; then out)", time: 45 },
                    //[23:49:45.000] 00:282b:Ravana uses Blades of Carnage and Liberation.
                    //[23:49:46.000] 00:2aab:Ravana readies Liberation.
                    //[23:50:04.000] 00:282b:Ravana uses Liberation.
                    { name: "Liberation (behind)", time: 64 },
                    //[23:50:07.000] 00:282b:Ravana uses Liberation.
                    { name: "(look for charge 1)", time: 67 },
                    //[23:50:09.000] 00:302b:Ravana uses Liberation.
                    { name: "(look for charge 2)", time: 69 },
                    //[23:50:10.000] 00:302b:Ravana uses Liberation.
                    //[23:50:10.000] 00:302b:Ravana uses Liberation.
                    //[23:50:14.000] 00:282b:Ravana uses Liberation.
                    //[23:50:15.000] 00:302b:Ravana uses Liberation.
                    //[23:50:17.000] 00:302b:Ravana uses Liberation.
                    //[23:50:18.000] 00:302b:Ravana uses Liberation.
                ],
            },
            {
                title: "Phase 3 (ganas)",
                endLog: "Ravana uses Beetle Avatar",
                rotation: [
                    //[23:50:27.000] 00:282b:Ravana uses Dragonfly Avatar.
                    //[23:50:28.000] 00:2aab:Ravana readies Warlord Shell.
                    //[23:50:31.000] 00:282b:Ravana uses Warlord Shell.
                    { name: "Warlord Shell", time: 4 },
                    //[23:50:33.000] 00:2aab:Ravana readies The Seeing Left.
                    //[23:50:37.000] 00:282b:Ravana uses The Seeing Left.
                    { name: "Seeing Whatever", time: 10 },
                    //[23:50:41.000] 00:2aab:Ravana readies The Seeing Right.
                    //[23:50:45.000] 00:282b:Ravana uses The Seeing Right.
                    { name: "Seeing Whatever", time: 18 },
                    //[23:50:57.000] 00:282b:Ravana uses Tapasya.
                    { name: "Tapasya", time: 30 },
                    //[23:51:04.000] 00:282b:Ravana uses Atma-Linga.
                    { name: "Atma-Linga", time: 37 },
                    //[23:51:07.000] 00:282b:Ravana uses Blinding Blade.
                    { name: "Blinding Blade", time: 40 },
                    //[23:51:09.000] 00:2aab:Ravana readies The Seeing Left.
                    //[23:51:12.000] 00:282b:Ravana uses The Seeing Left.
                    { name: "Seeing Whatever", time: 45 },
                    //[23:51:15.000] 00:282b:Ravana uses Atma-Linga.
                    { name: "Atma-Linga", time: 48 },
                    //[23:51:21.000] 00:282b:Ravana uses Tapasya.
                    { name: "Tapasya", time: 54 },
                    //[23:51:28.000] 00:282b:Ravana uses Atma-Linga.
                    { name: "Atma-Linga", time: 61 },
                    //[23:51:31.000] 00:282b:Ravana uses Blinding Blade.
                    { name: "Blinding Blade", time: 64 },
                    //[23:51:34.000] 00:282b:Ravana uses Atma-Linga.
                    { name: "Atma-Linga", time: 67 },
                    //[23:51:37.000] 00:282b:Ravana uses Tapasya.
                    { name: "Tapasya", time: 70 },
                    //[23:51:46.000] 00:282b:Ravana uses Blinding Blade.
                    { name: "Blinding Blade", time: 79 },
                    //[23:51:48.000] 00:2aab:Ravana readies The Seeing Right.
                    //[23:51:51.000] 00:282b:Ravana uses The Seeing Right.
                    { name: "Seeing Whatever", time: 84 },
                    //[23:51:56.000] 00:282b:Ravana uses Atma-Linga.
                    { name: "Atma-Linga", time: 89 },
                    //[23:51:58.000] 00:282b:Ravana uses Atma-Linga.
                    { name: "Atma-Linga", time: 91 },
                    //[23:52:03.000] 00:2aab:Ravana readies Bloody Fuller.
                    //[23:52:09.000] 00:282b:Ravana uses Bloody Fuller.
                    { name: "Bloody Fuller", time: 102 },
                    //[23:52:11.000] 00:302b:Ravana uses Chandrahas.
                    { name: "Chandrahas", time: 104 },
                ],
            },
            {
                title: "Phase 4 (orbs)",
                endLog: "Ravana uses Scorpion Avatar",
                rotation: [
                    //[23:52:29.000] 00:282b:Ravana uses Beetle Avatar.
                    //[23:52:30.000] 00:2aab:Ravana readies Pillars of Heaven.
                    //[23:52:33.000] 00:282b:Ravana uses Pillars of Heaven.
                    { name: "Pillars of Heaven (wall)", time: 4 },
                    //[23:52:42.000] 00:282b:Ravana uses Laughing Rose.
                    { name: "Laughing Rose (share)", time: 13 },
                    //[23:52:48.881] 1A:1a4:Prey:180.00:400080C9:Ravana:1002B76D:Flapjack Waffles:00:12666:
                    { name: "Prey (pass to tank)", time: 19 },
                    //[23:52:57.000] 00:282b:Ravana uses Surpanakha.
                    { name: "Surpanakha", time: 28 },
                    //[23:52:59.000] 00:282b:Ravana uses Surpanakha.
                    { name: "Surpanakha", time: 30 },
                    //[23:53:01.000] 00:282b:Ravana uses Surpanakha.
                    { name: "Surpanakha", time: 32 },
                    //[23:53:03.000] 00:282b:Ravana uses Surpanakha.
                    { name: "Surpanakha", time: 34 },
                    //[23:53:06.000] 00:282b:Ravana uses The Rose of Conviction.
                    { name: "Rose of Conviction", time: 37 },
                    //[23:53:08.000] 00:2aab:Ravana readies The Rose of Hate.
                    //[23:53:13.000] 00:282b:Ravana uses The Rose of Hate.
                    { name: "Rose of Hate", time: 44 },
                    // FIXME: These are clearly not at integer times.
                    //[23:53:17.000] 00:282b:Ravana uses Surpanakha.
                    { name: "Surpanakha", time: 48 },
                    //[23:53:19.000] 00:282b:Ravana uses Surpanakha.
                    { name: "Surpanakha", time: 50 },
                    //[23:53:21.000] 00:282b:Ravana uses Surpanakha.
                    { name: "Surpanakha", time: 52 },
                    //[23:53:24.000] 00:282b:Ravana uses Surpanakha.
                    { name: "Surpanakha", time: 55 },
                    //[23:53:26.000] 00:282b:Ravana uses Surpanakha.
                    { name: "Surpanakha", time: 57 },
                    //[23:53:28.000] 00:282b:Ravana uses Surpanakha.
                    { name: "Surpanakha", time: 59 },
                    //[23:53:30.000] 00:282b:Ravana uses Surpanakha.
                    { name: "Surpanakha", time: 61 },
                    //[23:53:32.000] 00:282b:Ravana uses Surpanakha.
                    { name: "Surpanakha", time: 63 },
                ],
            },
            {
                title: "Phase 5 (double prey swords)",
                justText: true,
                endLog: "Ravana uses Dragonfly Avatar",
                rotation: [
                    { name: "Swift Liberation" },
                    { name: "Swords (to letters)" },
                    { name: "Final Liberation" },
                    { name: "Double Prey" },
                    { name: "Exploding Purple" },
                    { name: "Stack in middle" },
                    { name: "Run to the outside" },
                    //[23:53:37.000] 00:282b:Ravana uses Scorpion Avatar.
                    //[23:53:42.000] 00:282b:Ravana uses Blades of Carnage and Liberation.
                    //[23:53:42.000] 00:2aab:Ravana readies Swift Liberation.
                    //[23:54:01.000] 00:282b:Ravana uses Swift Liberation.
                    //[23:54:04.000] 00:302b:Ravana uses Swift Liberation.
                    //[23:54:07.000] 00:302b:Ravana uses Swift Liberation.
                    //[23:54:10.000] 00:302b:Ravana uses Swift Liberation.
                    //[23:54:13.000] 00:282b:Ravana uses Swift Liberation.
                    //[23:54:13.000] 00:302b:Ravana uses Swift Liberation.
                    //[23:54:13.000] 00:302b:Ravana uses Swift Liberation.
                    //[23:54:17.000] 00:302b:Ravana uses Swift Liberation.
                    //[23:54:17.000] 00:302b:Ravana uses Swift Liberation.
                    //[23:54:17.000] 00:302b:Ravana uses Swift Liberation.
                    //[23:54:17.000] 00:302b:Ravana uses Swift Liberation.
                    //[23:54:25.000] 00:302b:Ravana uses Blades of Carnage and Liberation.
                    //[23:54:25.000] 00:332b:Ravana readies Final Liberation.
                ],
            },
            {
                title: "Phase 6 (shell redux)",
                endLog: "Ravana uses Scorpion Avatar",
                justText: true,
                rotation: [
                    { name: "Warlord Shell" },
                    { name: "Seeing Whatever" },
                    { name: "Atma-Linga" },
                    { name: "Seeing Whatever" },
                    { name: "Blinding Blade" },
                    { name: "Atma-Linga" },
                    { name: "Tapasya" },
                    { name: "Atma-Linga" },
                    { name: "Blinding Blade" },
                    { name: "Atma-Linga" },
                    { name: "Atma-Linga" },
                    { name: "Tapasya" },
                    { name: "Blinding Blade" },
                    { name: "Atma-Linga" },
                    { name: "Blinding Blade" },
                    { name: "Atma-Linga" },
                    { name: "Tapasya" },
                ],
            },
            {
                title: "Phase 7 (random liberaton)",
                loop: false,
                rotation: [
                    { name : "Random liberations", time: 600 }
                ],
            }
        ],
    };

    var ThokAstThokExtreme = function () {
        BaseTickable.apply(this, arguments);
        this.zoneFilter = "Thok Ast Thok (extreme)";
        this.bosses = [ravana];
    };
    ThokAstThokExtreme.prototype = new BaseTickable;

    updateRegistrar.register(new ThokAstThokExtreme());
})();