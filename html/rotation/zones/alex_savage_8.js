(function () {
    var bruteJustice = {
        fightId: "A8S",
        bossName: "Brute Justice",
        minHP: 10000,
        startLog: "Combat protocols restarting",
        phases: [
            {
                title: "Phase 1",
                shortName: "P1",
                phaseIdx: 1,
                loop: false,
                endLog: "Onslaughter is defeated by",
                rotation: [
                    { name: "Hydrothermal", time: 6 },
                    { name: "Seed of the Sky", time: 13 },
                    { name: "Megabeemu~", time: 18 },
                    { name: "Hydrothermal", time: 22 },
                    { name: "(qarn boxes)", time: 27 },
                    { name: "Hydrothermal", time: 31 },
                    { name: "Megabeemu~", time: 41 },
                    { name: "PERPETUAL RAY", time: 44 },
                    { name: "Hydrothermal", time: 55 },
                    { name: "Megabeemu~", time: 62 },
                    { name: "Hydrothermal", time: 66 },
                    { name: "LEGISLATION", time: 75 },
                    { name: "Hydrothermal", time: 80 },
                    { name: "Seed", time: 87 },
                    { name: "Megabeemu~", time: 92 },
                    { name: "Hydrothermal", time: 95 },
                    { name: "PERPETUAL RAY", time: 96 },
                    { name: "Hydrothermal", time: 107 },
                    { name: "Hydrothermal", time: 120 },
                    { name: "Hella Late Seed", time: 125 },
                ],
            },
            {
                title: "Robot Attack",
                shortName: "P2",
                phaseIdx: 2,
                loop: false,
                rotation: [
                ],
            },
        ],
    };

    var AlexanderSavageTurn8 = function () {
        BaseTickable.apply(this, arguments);
        this.zoneFilter = "Alexander - The Burden Of The Son (Savage)";
        this.bosses = [bruteJustice];
    };
    AlexanderSavageTurn8.prototype = new BaseTickable;

    cb.updateRegistrar.register(new AlexanderSavageTurn8());
})();