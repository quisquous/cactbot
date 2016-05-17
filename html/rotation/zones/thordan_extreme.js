(function () {
    var thordan = {
        fightId: "ThordanEx",
        bossName: "King Thordan",
        minHP: 10000,
        startLog: "Your feeble light shall fade before my brilliance",
        phases: [
            {
                title: "Phase 1 (Thordan)",
                shortName: "P1",
                phaseIdx: 1,
                loop: false,
                endSeconds: 85,
                rotation: [
                    { name: "Ascalon's Might", time: 6 },
                    { name: "Meteorain", time: 13 },
                    { name: "Ascalon's Mercy", time: 18.5 },
                    { name: "Ascalon's Might", time: 24 },
                    { name: "Dragon's Eye", time: 29 },
                    { name: "Dragon's Gaze (turn)", time: 39 },
                    { name: "Ascalon's Might", time: 43 },
                    { name: "Lightning Storm (spread)", time: 50 },
                    { name: "Dragon's Rage (stack)", time: 62 },
                    { name: "Ancient Quaga", time: 66.5 },
                    { name: "Ascalon's Might", time: 68 },
                    { name: "Heavenly Heel", time: 78.5 },
                    { name: "Ascalon's Might", time: 81.5 },
                    { name: "(transition)", time: 83 }
                ],
            },
            {
                title: "Phase 2 (Char, Herm, Zeph)",
                shortName: "P2",
                phaseIdx: 2,
                loop: false,
                endSeconds: 52,
                rotation: [
                    { name: "Holy Chain", time: 15 },
                    { name: "Heavensflame", time: 16 },
                    { name: "Conviction", time: 22 },
                    { name: "Sacred Cross", time: 45 },
                    { name: "Spiral Thrust", time: 52 },
                ],
            },
            {
                title: "Phase 3 (Adel, Janl)",
                shortName: "P3",
                phaseIdx: 3,
                loop: false,
                endLog: "Added new combatant Ser Grinnaux",
                rotation: [
                    { name: "Divine Right", time: 16 },
                    { name: "Holy Bladedance", time: 25 },
                    { name: "Skyward Leaps", time: 37 },
                    { name: "Divine Right", time: 43 },
                    { name: "Holiest of Holy", time: 58 },
                    { name: "Holy Bladedance", time: 64 },
                    { name: "Divine Right", time: 71 },
                    { name: "Holiest of Holy", time: 78 },
                    { name: "Divine Right", time: 98 },
                ],
            },
            {
                title: "Phase 4 (meteors)",
                shortName: "P4",
                phaseIdx: 4,
                loop: false,
                rotation: [
                    { name: "tethers/shiva/etc", time: 4 },
                    { name: "Hiemal Storm", time: 8 },
                    { name: "Spiral Pierce", time: 11 },
                    { name: "Faith Unmoving", time: 14 },
                    { name: "Meteors", time: 15 },
                    { name: "Heavy Impact", time: 24 },
                    { name: "Heavy Impact", time: 29 },
                    { name: "Comet Impact", time: 47 },
                    // Light of the Ascalon
                    // Ultimate
                ],
            },
        ],
    };

    var ThordanExtreme = function () {
        BaseTickable.apply(this, arguments);
        this.zoneFilter = "The Minstrel's Ballad: Thordan's Reign";
        this.bosses = [thordan];
    };
    ThordanExtreme.prototype = new BaseTickable;

    cb.updateRegistrar.register(new ThordanExtreme());

    var thordan_unknown = new ThordanExtreme();
    thordan_unknown.zoneFilter = "Unknown Zone (1C0)";
    cb.updateRegistrar.register(thordan_unknown);
})();
