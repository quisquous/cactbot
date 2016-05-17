(function () {
    var robotQuartet = {
        fightId: "A6S",
        bossName: "Blaster",
        minHP: 10000,
        startLog: "Machinery Bay 67 will be sealed off",
        endLog: "Machinery Bay 70 is no longer sealed",
        phases: [
            {
                title: "Phase 1 (Blaster)",
                shortName: "P1",
                phaseIdx: 1,
                loop: false,
                endSeconds: 6000,
                endLog: "Machinery Bay 67 is no longer sealed",
                rotation: [
                ],
            },
            {
                title: "Phase 2 (Brawler)",
                shortName: "P2",
                phaseIdx: 2,
                loop: false,
                endSeconds: 6000,
                endLog: "Machinery Bay 68 is no longer sealed",
                rotation: [
                ],
            },
            {
                title: "Phase 3 (Swindler)",
                shortName: "P3",
                phaseIdx: 3,
                loop: false,
                endSeconds: 6000,
                endLog: "Machinery Bay 69 is no longer sealed",
                rotation: [
                ],
            },
            {
                title: "Phase 4 (Vortexer)",
                shortName: "P4",
                phaseIdx: 4,
                loop: false,
                endSeconds: 6000,
                rotation: [
                ],
            },
        ],
    };

    var AlexanderSavageTurn6 = function () {
        BaseTickable.apply(this, arguments);
        this.zoneFilter = "Alexander - The Cuff Of The Son (Savage)";
        this.bosses = [robotQuartet];
    };
    AlexanderSavageTurn6.prototype = new BaseTickable;

    cb.updateRegistrar.register(new AlexanderSavageTurn6());
})();