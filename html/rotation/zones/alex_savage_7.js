(function () {
    var quickthinx = {
        fightId: "A7S",
        bossName: "Quickthinx",
        minHP: 10000,
        areaSeal: "The electrocution gallery",
        phases: [
            {
                title: "Phase 1 (jails)",
                shortName: "P1",
                phaseIdx: 1,
                loop: false,
                endSeconds: 187,
                // Need an end log here?
                rotation: [
                    { name: "Corporal Punishment", time: 7 },
                    { name: "Corporal Punishment", time: 9 },
                    { name: "Sizzlebeam", time: 16 },
                    { name: "Sizzlespark", time: 26 },
                    { name: "All bombs", time: 35 },
                    { name: "(boom)", time: 42 },
                    { name: "Jail: melee(blm/pap) healer(pap/h)", time: 64 },
                    { name: "Jail mechanic", time: 74 },
                    { name: "Sizzlespark", time: 96 },
                    { name: "Uplander Doom (pld keeps)", time: 112 },
                    { name: "Jail: melee(blm/pap) healer(pap/h)", time: 134 },
                    { name: "Jail mechanic", time: 144 },
                    { name: "Sizzlespark", time: 181 },
                    { name: "Uplander Doom (war swap)", time: 187 },
                    // { name: "Sizzlespark", time: 18 },
                ],
            },
            {
                title: "Phase 2 (kitty)",
                shortName: "P2",
                phaseIdx: 2,
                loop: false,
                endSeconds: 65,
                rotation: [
                    { name: "Undying Affection", time: 10 },
                    { name: "MEOW MEOW", time: 14 },
                    { name: "Sizzlespark", time: 21 },
                    { name: "(ZOOM ZOOM)", time: 24 },
                    { name: "Flamethrower", time: 30 },
                    { name: "Undying Affection", time: 40 },
                    { name: "MEOW MEOW", time: 44 },
                    { name: "Sizzlebeam on OT", time: 50 },
                    { name: "(ZOOM ZOOM)", time: 54 },
                    { name: "(searing wind over)", time: 55 },
                    { name: "Sizzlespark", time: 59 },
                ],
            },
            {
                title: "Phase 3 (jails)",
                shortName: "P3",
                phaseIdx: 3,
                loop: false,
                endSeconds: 208,
                rotation: [
                    { name: "Jail: caster(min/pap) healer(h/blm)", time: 7 },
                    { name: "Jail mechanic", time: 17 },
                    { name: "Sizzlebeam", time: 44 },
                    { name: "Sizzlespark", time: 50 },
                    { name: "Sizzlespark", time: 58 },
                    { name: "Jail: caster(min/pap) healer(h/blm)", time: 75 },
                    { name: "Jail mechanic", time: 86 },
                    { name: "Uplander Doom (pld keep)", time: 103 },
                    { name: "Sizzlespark", time: 115 },
                    { name: "Sizzlespark", time: 124 },
                    { name: "Sizzlebeam", time: 138 },
                    { name: "All bombs", time: 148 },
                    { name: "(boom)", time: 154 },
                    { name: "Sizzlespark", time: 115 },
                    { name: "Sizzlespark", time: 171 },
                    { name: "Sizzlebeam OH NO", time: 179 },
                    { name: "Uplander Doom (swap)", time: 187 },
                    { name: "Flamethrower", time: 200 },
                ],
            },
            {
                title: "Phase 4 (merry-go-round)",
                shortName: "P4",
                phaseIdx: 4,
                loop: false,
                endSeconds: 69,
                rotation: [
                    { name: "Sizzlespark", time: 11 },
                    { name: "Sizzlespark", time: 20 },
                    { name: "Sizzlespark", time: 26 },
                    { name: "Sizzlespark", time: 32 },
                    { name: "Sizzlebeam OH NO", time: 48 },
                    { name: "Sizzlespark", time: 56 },
                    { name: "Sizzlespark", time: 62 },
                ],
            },
            {
                title: "Phase 5 (kitty)",
                shortName: "P5",
                phaseIdx: 5,
                loop: false,
                endSeconds: 70,
                rotation: [
                    { name: "Flamethrower", time: 1 },
                    { name: "Undying Affection", time: 10 },
                    { name: "Uplander Doom", time: 14 },
                    { name: "MEOW MEOW", time: 14 },
                    { name: "(ZOOM ZOOM)", time: 24 },
                    { name: "Sizzlebeam (DPS)", time: 25 },
                    { name: "Flamethrower", time: 33 },
                    { name: "Undying Affection", time: 40 },
                    { name: "MEOW MEOW", time: 44 },
                    { name: "Sizzlebeam on OT", time: 50 },
                    { name: "(ZOOM ZOOM)", time: 54 },
                    { name: "(searing wind over)", time: 55 },
                    { name: "Sizzlespark", time: 59 },
                ],
            },
            {
                title: "Phase 6 (jails)",
                shortName: "P6",
                phaseIdx: 6,
                loop: false,
                endSeconds: 10000,
                rotation: [
                    //{ name: "Minotaur at A, pigs at B", time: 8 },
                ],
            },
        ],
    };

    var AlexanderSavageTurn7 = function () {
        BaseTickable.apply(this, arguments);
        this.zoneFilter = "Alexander - The Arm Of The Son (Savage)";
        this.bosses = [quickthinx];
    };
    AlexanderSavageTurn7.prototype = new BaseTickable;

    cb.updateRegistrar.register(new AlexanderSavageTurn7());
})();