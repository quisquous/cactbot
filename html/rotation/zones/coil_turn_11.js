(function () {
    var kaliya = {
        bossName: "Kaliya",
        minHP: 10000,
        enrageSeconds: 720,
        areaSeal: "The Core Override",
        phases: [
            {
                title: "Phase 1 (warmup)",
                endHpPercent: 90,
                endLog: "Kaliya readies Barofield",
                rotation: [
                    // 38 start?
                    //[20:18:53.000] 00:0839:The Core Override is sealed off!
                    //[20:18:46.000] 00:282b:Kaliya uses Resonance.
                    { name: "Resonance", time: 8 },
                    //[20:18:52.000] 00:2aab:Kaliya readies Nerve Gas.
                    //[20:18:56.000] 00:282b:Kaliya uses Nerve Gas.
                    { name: "Nerve Gas 1", time: 18, cast: 4 },
                    //[20:18:58.000] 00:2aab:Kaliya readies Nerve Gas.
                    //[20:19:02.000] 00:282b:Kaliya uses Nerve Gas.
                    { name: "Nerve Gas 2", time: 24, cast: 4 },
                    //[20:19:02.000] 00:2aab:Kaliya readies Nerve Gas.
                    //[20:19:06.000] 00:282b:Kaliya uses Nerve Gas.
                    { name: "Nerve Gas 3", time: 28, cast: 4 },
                    //[20:19:09.000] 00:282b:Kaliya uses Resonance.
                    { name: "Resonance", time: 31 },
                    //[20:19:14.000] 00:282b:Kaliya uses Resonance.
                    { name: "Resonance", time: 35 },
                    // FIXME: unclear what happens if you don't push this
                ],
            },
            {
                title: "Phase 1.5 (barofield)",
                loop: true,
                loopSeconds: 49,
                endHpPercent: 60,
                endLog: "Kaliya emergency systems now online",
                rotation: [
                 //[20:19:16.000] 00:2aab:Kaliya readies Barofield.
                 //[20:19:20.000] 00:282b:Kaliya uses Barofield.
                 { name: "Barofield", time: 4, cast: 4, justOnce: true },
                 //[20:19:27.726] 16:40002263:Kaliya:B76:Seed Of The Rivers:10078D72:Flapjack Waffles:0:0:0:0:0:0:0:0:37:0:70503:220322:0:0:0:0:7686:7686:1008:1008:640:1000:6.736292:-13.94165:-4.969825:2778:2778:2800:2800:1000:1000:0.2301941:-0.868454:-4.963
                 { name: "Missiles 1", time: 11 },
                 //[20:19:33.513] 16:40002261:Kaliya:B77:Seed Of The Sea:10022A28:Flapjack Waffles:0:0:0:0:0:0:0:0:70503:59E:0:0:0:0:0:0:7010:7696:1107:1107:840:1000:-1.66333:-7.278625:-4.963:2778:2778:2800:2800:1000:1000:0.2288208:-0.869812:-4.963
                 { name: "Missiles 2", time: 17 },
                 //[20:19:37.000] 00:282b:Kaliya uses Resonance.
                 { name: "Resonance", time: 21 },
                 //[20:19:40.000] 00:282b:Kaliya uses Secondary Head.
                 //[20:19:41.000] 00:292b:Kaliya readies Secondary Head.
                 //[20:19:45.000] 00:282b:Kaliya uses Secondary Head.
                 //[20:19:46.000] 00:282b:Kaliya uses Main Head.
                 { name: "Secondary Head", time: 30, cast: 6 },
                 //[20:19:50.000] 00:282b:Kaliya uses Resonance.
                 { name: "Resonance", time: 34 },
                 //[20:19:53.000] 00:2aab:Kaliya readies Nerve Gas.
                 //[20:19:57.000] 00:282b:Kaliya uses Nerve Gas.
                 { name: "Nerve Gas 1", time: 41, cast: 4 },
                 //[20:19:58.000] 00:2aab:Kaliya readies Nerve Gas.
                 //[20:20:02.000] 00:282b:Kaliya uses Nerve Gas.
                 { name: "Nerve Gas 2", time: 46, cast: 4 },
                 //[20:20:03.000] 00:2aab:Kaliya readies Nerve Gas.
                 //[20:20:07.000] 00:282b:Kaliya uses Nerve Gas.
                 { name: "Nerve Gas 3", time: 51, cast: 4 },
                 //[20:20:10.000] 00:282b:Kaliya uses Resonance.
                 { name: "Resonance", time: 54 },
                 // Next missiles: 60
                 // Next resonsance: 70
                ],
            },
            {
                title: "Phase 2 (geometry)",
                endSeconds: 150,
                endLog: "Kaliya readies Emergency Mode",
                // FIXME: handle adds
                rotation: [],
            },
            {
                title: "Phase 3 (tethers)",
                loop: true,
                loopSeconds: 5,
                // TODO: for hp-based transitions, probably need a calibrating log
                rotation: [
                    { name: "BEES", time: 0 },
                    { name: "BEES!!!", time: 4 }
                ],
            },
        ],
    };

    var FinalCoilOfBahamutTurn2 = function () {
        BaseTickable.apply(this, arguments);
        this.zoneFilter = "The Final Coil Of Bahamut - Turn (2)";
        this.bosses = [kaliya];
    };
    FinalCoilOfBahamutTurn2.prototype = new BaseTickable;

    updateRegistrar.register(new FinalCoilOfBahamutTurn2());
})();