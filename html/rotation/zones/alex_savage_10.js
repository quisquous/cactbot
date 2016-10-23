(function () {
    var refurbisher = {
        fightId: "A10S",
        bossName: "a10",
        minHP: 10000,
        areaSeal: "The Excruciationator",
        phases: [
            {
                title: "Phase 1",
                shortName: "P1",
                phaseIdx: 1,
                loop: false,
                endSeconds: 100000,
                rotation: [
                ],
            },
        ],
    };

    var AlexanderSavageTurn10 = function () {
        BaseTickable.apply(this, arguments);
        this.zoneFilter = "Alexander - The Breath Of The Creator (Savage)";
        this.bosses = [refurbisher];
    };
    AlexanderSavageTurn10.prototype = new BaseTickable;

    cb.updateRegistrar.register(new AlexanderSavageTurn10());

    var alex10_unknown = new AlexanderSavageTurn10();
    alex10_unknown.zoneFilter = "Unknown Zone (249)";
    cb.updateRegistrar.register(alex10_unknown);
})();
