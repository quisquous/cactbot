(function () {
    var cruiser = {
        fightId: "A11S",
        bossName: "a11",
        minHP: 10000,
        areaSeal: "The Main Generators",
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

    var AlexanderSavageTurn11 = function () {
        BaseTickable.apply(this, arguments);
        this.zoneFilter = "Alexander - The Heart Of The Creator (Savage)";
        this.bosses = [cruiser];
    };
    AlexanderSavageTurn11.prototype = new BaseTickable;

    cb.updateRegistrar.register(new AlexanderSavageTurn11());

    var alex11_unknown = new AlexanderSavageTurn11();
    alex11_unknown.zoneFilter = "Unknown Zone (24A)";
    cb.updateRegistrar.register(alex11_unknown);
})();
