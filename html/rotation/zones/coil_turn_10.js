(function () {
    var imdugud = {
        bossName: "Imdugud",
        minHP: 10000,
        areaSeal: "The Alpha Concourse",
        phases: [
            {
                title: "Phase 1 (warmup)",
                loop: true,
                // FIXME: wild guess
                loopSeconds: 65,
                endHpPercent: 83,
                endLog: "Imdugud readies Electrocharge",
                rotation: [
                    //[19:09:19.000] 00:0839:The Alpha Concourse will be sealed off in 15 seconds!
                    //[19:09:27.000] 00:282b:Imdugud uses Crackle Hiss.
                    { name: "Crackle Hiss", time: 8 },
                    //[19:09:29.000] 00:2aab:Imdugud readies Spike Flail.
                    //[19:09:33.000] 00:282b:Imdugud uses Spike Flail.
                    //{ name: "Spike Flail", time: 14, cast: 4 },
                    //[19:09:36.000] 00:292b:Imdugud readies Critical Rip.
                    //[19:09:40.000] 00:282b:Imdugud uses Critical Rip.
                    { name: "Critical Rip", time: 21, cast: 4 },
                    //[19:09:44.000] 00:282b:Imdugud uses Crackle Hiss.
                    { name: "Crackle Hiss", time: 25 },
                    //[19:09:53.000] 00:282b:Imdugud uses Electrification.
                    { name: "Electrification", time: 34 },
                    //[19:09:53.000] 00:292b:Imdugud readies Wild Charge.
                    //[19:09:57.000] 00:282b:Imdugud uses Wild Charge.
                    { name: "Wild Charge", time: 38, cast: 4 },
                    //[19:10:01.000] 00:282b:Imdugud uses Crackle Hiss.
                    { name: "Crackle Hiss", time: 42 },
                    //[19:10:04.000] 00:112f:Flapjack Waffles suffers the effect of Prey.
                    { name: "Prey", time: 45 },
                    // spike flail
                    // crackle hiss
                    // critical rip
                    // loop?
                ],
            },
            {
                title: "Phase 2 (adds)",
                endLog: "Imdugud readies Electric Burst",
                rotation: [
                    // [19:10:17.000] 00:282b:Imdugud uses Electrocharge.
                    { name: "Electrocharge", time: 5, cast: 5 },
                    // FIXME: handle multiple adds
                ],
            },
            {
                title: "Phase 3 (heat lightning)",
                loop: true,
                loopSeconds: 65,
                endLog: "Imdugud readies Electrocharge",
                endHpPercent: 54,
                rotation: [
                    //[19:11:46.000] 00:2aab:Imdugud readies Electric Burst.
                    //[19:11:50.000] 00:282b:Imdugud uses Electric Burst.
                    { name: "Electric Burst", time: 4, cast: 4, justOnce: true },
                    //[19:11:54.000] 00:2aab:Imdugud readies Heat Lightning.
                    //[19:11:59.000] 00:30af:? Flapjack Waffles suffers the effect of Vulnerability Up.
                    { name: "Heat Lightning", time: 9, cast: 5 },
                    //[19:12:01.000] 00:2aab:Imdugud readies Spike Flail.
                    //[19:12:04.000] 00:282b:Imdugud uses Spike Flail.
                    //[19:12:08.000] 00:112f:Flapjack Waffles suffers the effect of Prey.
                    { name: "Prey", time: 22 },
                    //[19:12:18.000] 00:282b:Imdugud uses Crackle Hiss.
                    { name: "Crackle Hiss", time: 32 },
                    //[19:12:20.000] 00:2aab:Imdugud readies Heat Lightning.
                    //[19:12:25.000] 00:312f:? Flapjack Waffles suffers the effect of Vulnerability Up.
                    { name: "Heat Lightning", time: 39, cast: 5 },
                    //[19:12:28.000] 00:292b:Imdugud readies Wild Charge.
                    //[19:12:32.000] 00:282b:Imdugud uses Wild Charge.
                    { name: "Wild Charge", time: 46, cast: 4 },
                    //[19:12:35.000] 00:282b:Imdugud uses Crackle Hiss.
                    { name: "Crackle Hiss", time: 49 },
                    //[19:12:36.000] 00:2aab:Imdugud readies Spike Flail.
                    //[19:12:39.000] 00:282b:Imdugud uses Spike Flail.
                    //[19:12:44.000] 00:292b:Imdugud readies Critical Rip.
                    //[19:12:48.000] 00:282b:Imdugud uses Critical Rip.
                    { name: "Critical Rip", time: 62, cast: 4 },
                    //[19:12:51.000] 00:282b:Imdugud uses Crackle Hiss.
                    { name: "Crackle Hiss", time: 65 },
                    // Reset at exact 65 seconds, heat lightning again at += 9.
                    //[19:12:55.000] 00:2aab:Imdugud readies Heat Lightning.
                    //[19:13:00.000] 00:312f:? Flapjack Waffles suffers the effect of Vulnerability Up.
                ],
            },
            {
                title: "Phase 4 (more adds)",
                endLog: "Imdugud readies Electric Burst",
                rotation: [
                    //[19:13:01.000] 00:2aab:Imdugud readies Electrocharge.
                    //[19:13:06.000] 00:282b:Imdugud uses Electrocharge.
                    { name: "Electrocharge", time: 5, cast: 5 },
                    // FIXME: handle multiple adds
                ],
            },
            {
                title: "Phase 5 (chaos)",
                loop: true,
                loopSeconds: 65,
                rotation: [
                    //[19:15:03.000] 00:2aab:Imdugud readies Electric Burst.
                    //[19:15:07.000] 00:282b:Imdugud uses Electric Burst.
                    { name: "Electric Burst", time: 4, cast: 4, justOnce: true },
                    //[19:15:12.000] 00:2aab:Imdugud readies Heat Lightning.
                    //[19:15:16.000] 00:312f:? Flapjack Waffles suffers the effect of Vulnerability Up.
                    { name: "Heat Lightning", time: 9, cast: 5 },
                    //[19:15:20.000] 00:3129:? Flapjack Waffles takes 6760 damage.
                    //[19:15:20.000] 00:312f:? Flapjack Waffles suffers the effect of Vulnerability Up.
                    { name: "Tether", time: 17 },
                    //[19:15:20.575] 15:40001283:Imdugud:B61:Cyclonic Chaos:40001283:Imdugud:0:0:0:0:0:0:0:0:34:0:0:0:0:0:0:0:372545:894627:2800:2800:1000:1000:0.01519775:-305.0126:-1.192093E-06:372545:894627:2800:2800:1000:1000:0.01519775:-305.0126:-1.192093E-06
                    //[19:15:22.000] 00:2aab:Imdugud readies Spike Flail.
                    //[19:15:25.000] 00:282b:Imdugud uses Spike Flail.
                    //[19:15:30.000] 00:282b:Imdugud uses Crackle Hiss.
                    { name: "Crackle Hiss", time: 27 },
                    //[19:15:34.000] 00:292b:Imdugud readies Critical Rip.
                    //[19:15:37.000] 00:282b:Imdugud uses Critical Rip.
                    { name: "Critical Rip", time: 34, cast: 3 },
                    //[19:15:44.000] 00:282b:Imdugud uses Crackle Hiss.
                    { name: "Crackle Hiss", time: 41 },
                    //[19:15:48.000] 00:2aab:Imdugud readies Heat Lightning.
                    //[19:15:53.000] 00:312f:? Flapjack Waffles suffers the effect of Vulnerability Up.
                    { name: "Heat/Tether/Charge", time: 50, cast: 5 },
                    //[19:15:56.000] 00:282b:Imdugud uses Electrification.
                    //[19:15:56.000] 00:292b:Imdugud readies Wild Charge.
                    //[19:16:00.000] 00:282b:Imdugud uses Wild Charge.
                    //[19:16:03.000] 00:282b:Imdugud uses Crackle Hiss.
                    //[19:16:04.000] 00:2aab:Imdugud readies Spike Flail.
                    //[19:16:07.000] 00:282b:Imdugud uses Spike Flail.
                    //[19:16:22.000] 00:2aab:Imdugud readies Heat Lightning.
                    //[19:16:36.000] 00:282b:Imdugud uses Crackle Hiss.
                    //[19:16:39.000] 00:2aab:Imdugud readies Spike Flail.
                    //[19:16:42.000] 00:282b:Imdugud uses Spike Flail.
                    //[19:16:44.000] 00:292b:Imdugud readies Critical Rip.
                    //[19:16:47.000] 00:282b:Imdugud uses Critical Rip.
                    //[19:16:54.000] 00:282b:Imdugud uses Crackle Hiss.
                    //[19:16:58.000] 00:2aab:Imdugud readies Heat Lightning.
                    //[19:17:06.000] 00:282b:Imdugud uses Electrification.
                    //[19:17:06.000] 00:292b:Imdugud readies Wild Charge.
                    //[19:17:10.000] 00:282b:Imdugud uses Wild Charge.
                ],
            },
        ],
    };

    var FinalCoilOfBahamutTurn1 = function () {
        BaseTickable.apply(this, arguments);
        this.zoneFilter = "The Final Coil Of Bahamut - Turn (1)";
        this.bosses = [imdugud];
    };
    FinalCoilOfBahamutTurn1.prototype = new BaseTickable;

    cb.updateRegistrar.register(new FinalCoilOfBahamutTurn1());
})();