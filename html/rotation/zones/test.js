(function () {
    var fakeBoss = {
        fightId: "cactbot.test1",
        bossName: "Angry Bees",
        zone: "Middle La Noscea",
        enrageSeconds: 720,
        //areaSeal: "The hive",
        startLog: "You use Dragon Kick",
        phases: [
            {
                title: "Phase 1 (stinging)",
                shortName: "P1",
                phaseIdx: 1,
                loop: false,
                endSeconds: 10,
                rotation: [
                    { name: "Poke", time: 1 },
                    { name: "Prod", time: 2 },
                    { name: "Slam", time: 3 },
                ],
            },
            {
                title: "Phase 2 (stinging)",
                shortName: "P2",
                phaseIdx: 2,
                loop: false,
                endSeconds: 10,
                rotation: [
                    { name: "Poke", time: 8 },
                ],
            },
            {
                title: "Phase 3 (angry buzzing)",
                shortName: "P3",
                phaseIdx: 3,
                loop: true,
                loopSeconds: 60,
                endHpPercent: 61,
                rotation: [
                    { name: "Buzz", time: 2.5 },
                    { name: "Fizz", time: 4 },
                    { name: "Buzzzzzzzz", time: 5 },
                    { name: "Blink About", time: 8 },
                    { name: "Burn start", time: 10, startMiniPhase: "B" },
                    { name: "Burn end", time: 25, endMiniPhase: "B" },
                ],
            },
            {
                title: "Phase 4 (enrage)",
                shortName: "P4",
                phaseIdx: 4,
                loop: true,
                loopSeconds: 5,
                // TODO: for hp-based transitions, probably need a calibrating log
                rotation: [
                    { name: "BEES", time: 0 },
                    { name: "BEES!!!", time: 4 }
                ],
            },
        ],
    };

    var TestArea = function () {
        BaseTickable.apply(this, arguments);
        this.zoneFilter = "Middle La Noscea";
        this.bosses = [fakeBoss];
    };
    TestArea.prototype = new BaseTickable;

    cb.updateRegistrar.register(new TestArea());
})();
