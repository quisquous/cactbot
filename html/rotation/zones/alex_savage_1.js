(function () {
    var oppressor = {
        // FIXME: need both boss HPs
        bossName: "Oppressor",
        areaSeal: "Hangar 8",
        phases: [
            {
                title: "Phase 1 (burn)",
                loop: false,
                endSeconds: 90,
                rotation: [
                    { name: "Royal Fount", time: 7 },
                    { name: "Hydrothermal Missile", time: 15 },
                    { name: "Photon Spaser", time: 22 },
                    { name: "Royal Fount", time: 27 },
                    { name: "Resin Bomb", time: 35 },
                    { name: "Photon Spaser", time: 42 },
                    { name: "Royal Fount", time: 49 },
                    { name: "Emergency Deployment", time: 52 },
                    { name: "Hydrothermal Missile", time: 60 },
                    { name: "Royal Fount", time: 67 },
                    { name: "Photon Spaser", time: 74 },
                    { name: "Royal Fount", time: 84 },
                    { name: "Distress Signal", time: 87 },
                ],
            },
            {
                title: "Phase 2 (split)",
                loop: true,
                loopSeconds: 120,
                rotation: [
                    { name: "Quick Landing", time: 2 , skipFirst: true},
                    { name: "3000-tonze Missile", time: 15 },
                    { name: "Emergency Deployment", time: 27 },
                    { name: "Resin Bomb", time: 35 },
                    { name: "Royal Fount", time: 40 },
                    { name: "Photon Spaser", time: 42 },
                    { name: "Double Prey", time: 49 },
                    { name: "Hydrothermal Missile", time: 52 },
                    { name: "Royal Fount", time: 60 },
                    { name: "Hypercompressed Plasma", time: 66 },
                    { name: "(bomb touchdown)", time: 70 },
                    { name: "Photon Spaser", time: 75 },
                    { name: "Royal Fount", time: 94 },
                    { name: "(takeoff)", time: 100 },
                    { name: "(stack for schmutz)", time: 105 },
                    { name: "(1st schmutz)", time: 112 },
                    { name: "(8th schmutz)", time: 120 },
                ],
            },
        ],
    };

    var AlexanderSavageTurn1 = function () {
        BaseTickable.apply(this, arguments);
        this.zoneFilter = "Alexander - The Fist of the Father (Savage)";
        this.bosses = [oppressor];
    };
    AlexanderSavageTurn1.prototype = new BaseTickable;

    updateRegistrar.register(new AlexanderSavageTurn1());
})();