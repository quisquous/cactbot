(function () {
    var refurbisher = {
        fightId: "A9S",
        bossName: "Refurbisher",
        minHP: 10000,
        areaSeal: "Life Support",
        phases: [
            {
                title: "Phase 1 (burn)",
                shortName: "P1",
                phaseIdx: 1,
                loop: false,
                endSeconds: 100000,
                rotation: [
                ],
            },
        ],
    };

    var AlexanderSavageTurn9 = function () {
        BaseTickable.apply(this, arguments);
        this.zoneFilter = "Alexander - The Eyes Of The Creator (Savage)";
        this.bosses = [refurbisher];
    };
    AlexanderSavageTurn9.prototype = new BaseTickable;

    cb.updateRegistrar.register(new AlexanderSavageTurn9());

    var alex9_unknown = new AlexanderSavageTurn9();
    alex9_unknown.zoneFilter = "Unknown Zone (248)";
    cb.updateRegistrar.register(alex9_unknown);
})();
