(function () {
    var oppressor = {
        fightId: "A1S",
        // FIXME: need both boss HPs
        bossName: "Oppressor",
        minHP: 10000,
        areaSeal: "Hangar 8",
        phases: [
            {
                title: "Phase 1 (burn)",
                shortName: "P1",
                phaseIdx: 1,
                loop: false,
                endSeconds: 83,
                rotation: [
                    { name: "Royal Fount", time: 6.75 },
                    { name: "Prey", time: 12 },
                    { name: "Gunnery Pod", time: 18 },
                    { name: "Photon Spaser", time: 22.5 },
                    { name: "Royal Fount", time: 27.5 },
                    { name: "Resin Bomb", time: 35.5 },
                    { name: "Photon Spaser", time: 42.5 },
                    { name: "Gunnery Pod", time: 45.3 },
                    { name: "Royal Fount", time: 47.5 },
                    { name: "Emergency Deployment", time: 52.7 },
                    { name: "Prey", time: 55.6 },
                    { name: "Gunnery Pod", time: 62.3 },
                    { name: "Royal Fount", time: 65 },
                    { name: "Photon Spaser", time: 72 },
                    { name: "Gunnery Pod", time: 75.7 },
                    { name: "Royal Fount", time: 81.3 },
                    { name: "Distress Signal", time: 83 },
                ],
            },
            {
                title: "Phase 2 (split)",
                shortName: "P2",
                phaseIdx: 2,
                loop: true,
                loopOffset: -7.5,
                loopSeconds: 121,
                rotation: [
                    { name: "Gunnery Pod", time: 19.6 },
                    { name: "Emergency Deployment", time: 24.6 },
                    { name: "Resin Bomb", time: 32 },
                    { name: "Royal Fount", time: 35.2 },
                    { name: "Photon Spaser", time: 39.3 },
                    { name: "Double Prey", time: 45.8 },
                    { name: "Royal Fount", time: 55 },
                    { name: "Hypercompressed Plasma", time: 62 },
                    { name: "(bomb touchdown)", time: 65.5 },
                    { name: "Photon Spaser", time: 72.5 },
                    { name: "Gunnery Pod", time: 80.5 },
                    { name: "Royal Fount", time: 90.5 },
                    { name: "(takeoff)", time: 94.5 },
                    { name: "(1st schmutz)", time: 107 },
                    { name: "(8th schmutz)", time: 114 },
                    { name: "Quick Landing", time: 117 }
                ],
            },
        ],
    };

    var AlexanderSavageTurn1 = function () {
        BaseTickable.apply(this, arguments);
        this.zoneFilter = "The Fist Of The Father (Savage)";
        this.bosses = [oppressor];
    };
    AlexanderSavageTurn1.prototype = new BaseTickable;

    cb.updateRegistrar.register(new AlexanderSavageTurn1());

    var alex1_unknown = new AlexanderSavageTurn1();
    alex1_unknown.zoneFilter = "Unknown Zone (1C1)";
    cb.updateRegistrar.register(alex1_unknown);
})();