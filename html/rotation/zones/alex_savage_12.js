(function () {
    var alex_prime = {
        fightId: "A12S",
        bossName: "a12",
        minHP: 10000,
        startLog: "Alexander Prime uses Divine Spear",
        phases: [
            {
                title: "Phase 1",
                shortName: "P1",
                phaseIdx: 1,
                loop: false,
                endSeconds: 100000,
                endLog: "Added new combatant Arrhidaeus's Lanner",
                rotation: [
                ],
            },
            {
                title: "Phase 2",
                shortName: "P2",
                phaseIdx: 2,
                loop: false,
                endSeconds: 571,
                rotation: [
                ],
            },
            {
                title: "Phase 3",
                shortName: "P3",
                phaseIdx: 3,
                loop: false,
                endSeconds: 100000,
		endLog: "readies Chronofoil",
                rotation: [
                ],
            },
            {
                title: "Phase 4",
                shortName: "P4",
                phaseIdx: 4,
                loop: false,
                endSeconds: 100000,
		endLog: "Alexander Prime uses Inception",
                rotation: [
                ],
            },
            {
                title: "Phase 5",
                shortName: "P5",
                phaseIdx: 5,
                loop: false,
                endSeconds: 100000,
		endLog: "casts Summon Alexander",
                rotation: [
                ],
            },
            {
                title: "Phase 6",
                shortName: "P6",
                phaseIdx: 6,
                loop: false,
                endSeconds: 100000,
                rotation: [
                ],
            },
        ],
    };

    var AlexanderSavageTurn12 = function () {
        BaseTickable.apply(this, arguments);
        this.zoneFilter = "Alexander - The Soul Of The Creator (Savage)";
        this.bosses = [alex_prime];
    };
    AlexanderSavageTurn12.prototype = new BaseTickable;

    cb.updateRegistrar.register(new AlexanderSavageTurn12());

    var alex12_unknown = new AlexanderSavageTurn12();
    alex12_unknown.zoneFilter = "Unknown Zone (24B)";
    cb.updateRegistrar.register(alex12_unknown);
})();
