(function () {
    if (!window.fakeact) {
        return;
    }

    var fakeBoss = {
        bossName: "Angry Bees",
        zone: "Xanadu",
        enrageSeconds: 720,
        areaSeal: "The hive",
        phases: [
            {
                title: "Phase 1 (stinging)",
                loop: false,
                endSeconds: 15,
                rotation: [
                    { name: "Poke", time: 3 },
                    { name: "Prod", time: 5 },
                    { name: "Slam", time: 8 },
                    { name: "Poke", time: 10 },
                    { name: "Prod", time: 12 },
                ],
            },
            {
                title: "Phase 2 (angry buzzing)",
                loop: true,
                loopSeconds: 10,
                endHpPercent: 61,
                rotation: [
                    { name: "Buzz", time: 2.5 },
                    { name: "Fizz", time: 4 },
                    { name: "Buzzzzzzzz", time: 5 },
                    { name: "Blink About", time: 8 },
                ],
            },
            {
                title: "Phase 3 (enrage)",
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
        this.zoneFilter = "Xanadu";
        this.bosses = [fakeBoss];
    };
    TestArea.prototype = new BaseTickable;

    cb.updateRegistrar.register(new TestArea());
})();