(function () {
    var livingLiquid = {
        bossName: "Living Liquid",
        minHP: 10000,
        areaSeal: "Condensate Demineralizer #9",
        phases: [
            {
                title: "Phase 1 (humanoid)",
                loop: false,
                endSeconds: 60,
                rotation: [
                    { name: "Fluid Swing", time: 7.5 },
                    { name: "Protean Wave", time: 12.5 },
                    // { name: "Protean Wave #2", time: 17.5 },
                    { name: "Fluid Swing", time: 22.5 },
                    { name: "Splash x 3", time: 25 },
                    { name: "Fluid Swing", time: 32.5 },
                    { name: "Sluice", time: 37.5 },
                    { name: "Splash x 3", time: 50 },
                    { name: "(transition)", time: 55.5 },
                ],
            },
            {
                title: "Phase 2 (hand)",
                loop: false,
                endSeconds: 130,
                rotation: [
                    { name: "(vulnerable)", time: 3 },
                    { name: "Fluid Strike", time: 10 },
                    { name: "Wash Away", time: 17.5 },
                    { name: "Digititis", time: 20 },
                    // { name: Digititis (end)", time: 25 },
                    { name: "Fluid Strike", time: 30 },
                    { name: "Fluid Strike", time: 40 },
                    { name: "Wash Away", time: 47.5 },
                    { name: "(split)", time: 49},
                    { name: "Fluid Swing", time: 57.5 },
                    { name: "(hand glow)", time: 62.5 },
                    { name: "Hand of Prayer/Parting", time: 67.5 },
                    { name: "Digititis", time: 72.5 },
                    // { name: Digititis (end)", time: 77.5 },
                    { name: "(HP transfer)", time: 77.5 },
                    { name: "Hand of Pain", time: 102.5, cast: 2.5},
                    { name: "(hand glow)", time: 110 },
                    { name: "Hand of Prayer/Parting", time: 115 },
                    { name: "Fluid Swing", time: 120 },
                    { name: "(transition)", time: 122 },
                ],
            },
            {
                title: "Phase 3 (tornado)",
                loop: false,
                // FIXME: this is not what http://imgur.com/EJXEalr says,
                // but phase 4 timings are a little iffy and this makes
                // them better.  The above suggests 90 seconds.
                endSeconds: 91,
                rotation: [
                    { name: "Piston x 2", time: 5 },
                    { name: "Gear x 3 / Drainage x 2", time: 15 },
                    { name: "(drainage explodes)", time: 22.5 },
                    { name: "Piston x 1 / Gear x 2", time: 27.5 },
                    { name: "Ferrofluid x 2", time: 35 },
                    { name: "Gear x 4 / Drainage x 2", time: 42.5 },
                    { name: "(drainage explodes)", time: 50 },
                    { name: "Gear x 3", time: 57.5 },
                    { name: "Ferrofluid x 2", time: 60 },
                    { name: "Piston x 4", time: 70 },
                ],
            },
            {
                title: "Phase 4 (humanoid)",
                loop: true,
                loopOffset: -15,
                loopSeconds: 222.5,
                rotation: [
                    { name: "(vulnerable)", time: -6.5 },
                    { name: "Cascade", time: 2.5, cast: 2.5 },
                    { name: "Ferrofluid x 4", time: 7.5 },
                    { name: "Splash x 3", time: 20 },
                    { name: "Fluid Swing", time: 25 },
                    { name: "Sluice", time: 27.5 },
                    { name: "Protean Wave", time: 35 },
                    //{ name: "Protean Wave #2", time: 40 },
                    { name: "Fluid Swing", time: 42.5 },
                    { name: "Splash x 3", time: 50 },
                    { name: "Fluid Swing", time: 55 },
                    { name: "Sluice x 8", time: 57.5 },
                    { name: "Digititis", time: 65 },
                    // { name: Digititis (end)", time: 70 },
                    { name: "Fluid Swing", time: 72.5 },
                    { name: "Cascade", time: 77.5, cast: 2.5 },
                    { name: "Liquid Gaol (mark)", time: 82.5 },
                    { name: "Liquid Gaol (trap)", time: 90 },
                    { name: "Splash x 3", time: 95 },
                    { name: "Fluid Swing", time: 100 },
                    { name: "Fluid Swing", time: 107.5 },
                    { name: "Splash x 3", time: 112.5 },
                    { name: "Digititis", time: 120 },
                    // { name: Digititis (end)", time: 125 },
                    { name: "Fluid Swing", time: 130 },
                    { name: "Splash x 6", time: 135 },
                    { name: "Fluid Swing", time: 145 },
                    { name: "Cascade", time: 150, cast: 2.5 },
                    { name: "Fluid Swing", time: 160 },
                    { name: "Protean/Drainage/Throttle", time: 162.5 },
                    { name: "Throttle", time: 165 },
                    { name: "Ferrofluid x 4", time: 167.5 },
                    { name: "Fluid Swing", time: 180 },
                    { name: "Throttle", time: 187.5 },
                    { name: "Throttle/Embolus", time: 190 },
                    { name: "Fluid Swing", time: 197.5 },
                    { name: "Protean/Drainage/Sluice", time: 202.5 },
                    { name: "Embolus", time: 207.5 },
                    { name: "Protean Wave", time: 210 },
                    { name: "Fluid Swing", time: 217.5 },
                ],
            },
        ],
    };

    var AlexanderSavageTurn3 = function () {
        BaseTickable.apply(this, arguments);
        this.zoneFilter = "Alexander - The Arm of the Father (Savage)";
        this.bosses = [livingLiquid];
    };
    AlexanderSavageTurn3.prototype = new BaseTickable;

    updateRegistrar.register(new AlexanderSavageTurn3());

    var alex3_unknown = new AlexanderSavageTurn3();
    alex3_unknown.zoneFilter = "Unknown Zone (1C3)";
    updateRegistrar.register(alex3_unknown);
})();