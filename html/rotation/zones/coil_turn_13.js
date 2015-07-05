(function () {
    var bahamutPrime = {
        bossName: "Bahamut Prime",
        enrageSeconds: 840,
        // This happens about 7 seconds in, but no area seal to start this fight off.
        // FIXME: test if incombat:true is enough to determine this.
        startLog: "Bahamut Prime uses Flare Breath",
        phases: [
            {
                title: "Phase 1 (warmup)",
                endHpPercent: 76,
                loop: true,
                loopSeconds: 49,
                endLog: "Bahamut Prime readies Gigaflare",
                rotation: [
                    //[20:46:50.000] 00:282b:Bahamut Prime uses Flare Breath.
                    { name: "Flare Breath", time: 0 },
                    //[20:46:54.000] 00:2aab:Bahamut Prime readies Megaflare.
                    //[20:46:58.000] 00:282b:Bahamut Prime uses Megaflare.
                    { name: "Megaflare", time: 8, cast: 4 },
                    //[20:47:08.000] 00:282b:Bahamut Prime uses Flare Breath.
                    { name: "Flare Breath", time: 18 },
                    //[20:47:11.000] 00:292b:Bahamut Prime readies Flatten.
                    //[20:47:16.000] 00:282b:Bahamut Prime uses Flatten.
                    { name: "Flatten", time: 26, cast: 5 },
                    //[20:47:18.000] 00:282b:Bahamut Prime uses Flare Breath.
                    { name: "Flare Breath (1)", time: 28 },
                    //[20:47:20.000] 00:282b:Bahamut Prime uses Flare Breath.
                    { name: "Flare Breath (2)", time: 30 },
                    //[20:47:22.000] 00:282b:Bahamut Prime uses Flare Breath.
                    { name: "Flare Breath (3)", time: 32 },
                    //[20:47:33.206] 15:4000228D:Bahamut Prime:BB5:Earth Shaker:4000228D:Bahamut Prime:0:0:0:0:0:0:0:0:34:0:0:0:0:0:0:0:1214437:1367609:2800:2800:1000:1000:449.729:-10.02527:1.192093E-07:1214437:1367609:2800:2800:1000:1000:449.729:-10.02527:1.192093E-07
                    { name: "Earthshakers", time: 43 },
                    //[20:47:39.000] 00:282b:Bahamut Prime uses Flare Breath.
                ],
            },
            {
                title: "Phase 2 (flare stars, shadows)",
                loop: true,
                loopSeconds: 65,
                loopOffset: -10,
                endHpPercent: 52,
                endLog: "Bahamut Prime readies Gigaflare",
                rotation: [
                    //[20:48:33.000] 00:2aab:Bahamut Prime readies Gigaflare.
                    //[20:48:41.000] 00:282b:Bahamut Prime uses Gigaflare.
                    { name: "Gigaflare", time: -10, cast: 8, justOnce: true },
                    //[20:48:43.911] 03:Added new combatant The Shadow Of Meracydia.  Job: 0 Level: 50 Max HP: 23418 Max MP: 2800.
                    { name: "Add: Shadow Of Meracydia", time: 0 },
                    //[20:48:47.000] 00:2aab:Bahamut Prime readies Flare Star.
                    //[20:48:51.000] 00:282b:Bahamut Prime uses Flare Star.
                    { name: "Flare Star (orbs)", time: 4, cast: 8 },
                    //[20:48:59.000] 00:282b:Bahamut Prime uses Flare Breath.
                    { name: "Flare Breath", time: 16 },
                    { name: "Flare Star (orbs)", time: 22 },
                    //[20:49:08.000] 00:292b:Bahamut Prime readies Flatten.
                    //[20:49:13.000] 00:282b:Bahamut Prime uses Flatten.
                    { name: "Flatten", time: 30, cast: 5 },
                    //[20:49:16.000] 00:282b:Bahamut Prime uses Flare Breath.
                    { name: "Flare Breath", time: 33 },
                    { name: "Flare Star (orbs)", time: 34 },
                    //[20:49:27.000] 00:2aab:Bahamut Prime readies Megaflare.
                    //[20:49:31.000] 00:282b:Bahamut Prime uses Megaflare.
                    { name: "Megaflare", time: 54, cast: 4 },
                    //[20:49:41.000] 00:282b:Bahamut Prime uses Flare Breath.
                    { name: "Flare Breath", time: 58 },
                    //[20:49:42.000] 00:2aab:Bahamut Prime readies Rage of Bahamut.
                    //[20:49:47.000] 00:282b:Bahamut Prime uses Rage of Bahamut.
                    { name: "Rage of Bahamut", time: 65, cast: 5 },

                ],
            },
            {
                title: "Phase 3 (divebombs)",
                endSeconds: 240,
                endLog: "Bahamut Prime starts using Teraflare on Bahamut Prime",
                rotation: [
                    //[20:51:14.000] 00:2aab:Bahamut Prime readies Gigaflare.
                    //[20:51:23.000] 00:282b:Bahamut Prime uses Gigaflare.
                    { name: "Gigaflare", time: 9, cast: 9 },
                    //[20:51:29.000] 00:2aab:Bahamut Prime readies Megaflare Dive.
                    //[20:51:30.263] 03:Added new combatant The Storm Of Meracydia.  Job: 0 Level: 50 Max HP: 27780 Max MP: 2800.
                    //[20:51:35.000] 00:282b:Bahamut Prime uses Megaflare Dive.
                    { name: "Megaflare Dive", time: 21, cast: 6 },
                    //[20:51:45.042] 03:Added new combatant The Pain Of Meracydia.  Job: 0 Level: 50 Max HP: 46809 Max MP: 2800.
                    //[20:51:45.042] 03:Added new combatant The Blood Of Meracydia.  Job: 0 Level: 50 Max HP: 10417 Max MP: 2800.
                    { name: "Adds: Pain and Blood", time: 31 },
                    //[20:52:05.344] 03:Added new combatant The Gust Of Meracydia.  Job: 0 Level: 50 Max HP: 14584 Max MP: 2800.
                    { name: "Adds: Gusts", time: 51 },
                    //[20:52:31.037] 03:Added new combatant The Sin Of Meracydia.  Job: 0 Level: 50 Max HP: 30446 Max MP: 2800.
                    { name: "Adds: Sins", time: 76 },
                    //[20:52:51.970] 16:400024D9:The Sin of Meracydia:BD2:Evil Eye:10047856:Flapjack Waffles:0:0:0:0:0:0:0:0:37:0:70503:20046D:0:0:0:0:7847:7847:1097:1097:850:1000:450.614:5.386414:0:5737:30446:2800:2800:1000:1000:451.6517:8.865417:0
                    { name: "Sin: Evil Eye", time: 96 },
                    //[20:53:00.000] 00:2aab:Bahamut Prime readies Megaflare Dive.
                    //[20:53:06.000] 00:282b:Bahamut Prime uses Megaflare Dive.
                    { name: "Megaflare Dive", time: 106, cast: 6 },
                    //[20:53:19.257] 03:Added new combatant The Storm Of Meracydia.  Job: 0 Level: 50 Max HP: 93618 Max MP: 2800.
                    { name: "Add: Storm", time: 125 },
                    //[20:53:31.508] 03:Added new combatant The Blood Of Meracydia.  Job: 0 Level: 50 Max HP: 10417 Max MP: 2800.
                    { name: "Add: Blood", time: 137 },
                    //[20:53:41.129] 03:Added new combatant The Gust Of Meracydia.  Job: 0 Level: 50 Max HP: 14584 Max MP: 2800.
                    { name: "Add: Gusts", time: 147 },
                    //[20:53:51.334] 03:Added new combatant The Sin Of Meracydia.  Job: 0 Level: 50 Max HP: 30446 Max MP: 2800.
                    { name: "Add: Sin", time: 157 },
                    { name: "Sin: Evil Eye", time: 177 },
                    //[20:54:12.556] 03:Added new combatant The Pain Of Meracydia.  Job: 0 Level: 50 Max HP: 46809 Max MP: 2800.
                    { name: "Add: Pain", time: 177 },
                    //[20:54:33.000] 00:2aab:Bahamut Prime readies Megaflare Dive.
                    //[20:54:39.000] 00:282b:Bahamut Prime uses Megaflare Dive.
                    { name: "Megaflare Dive", time: 205, cast: 6 },
                ],
            },
            {
                title: "Phase 4 (akh morns)",
                loopOffset: -35,
                loopSeconds: 60,
                rotation: [
                    //[20:54:44.749] 14:BC1:Bahamut Prime starts using Teraflare on Bahamut Prime.
                    //[20:55:04.741] 16:40002588:Bahamut Prime:BC1:Teraflare:10051592:Apologia Pisteos:0:0:0:0:0:0:0:0:37:0:70503:200472:0:0:0:0:6955:6955:3711:1265:1000:1000:450.543:9.701821:0:27780:27780:2800:2800:1000:1000:450:-53:-5
                    { name: "Teraflare", time: -15, cast: 20 },
                    //[20:55:19.000] 00:292b:Bahamut Prime readies Akh Morn.
                    { name: "Akh Morn #1", time: 0 },
                    { name: "Megaflare", time: 15 },
                    { name: "Tempest Wing", time: 18 },
                    { name: "Tempest Wing", time: 24 },
                    { name: "Earth Shakers", time: 40 },
                    { name: "Tempest Wing", time: 45 },
                    { name: "Tempest Wing", time: 53 },
                    { name: "Flare Breath", time: 54 },

                    { name: "Akh Morn #2 (holmgang)", time: 60 + 0 },
                    { name: "Megaflare", time: 60 + 15 },
                    { name: "Tempest Wing", time: 60 + 18 },
                    { name: "Tempest Wing", time: 60 + 24 },
                    { name: "Earth Shakers", time: 60 + 40 },
                    { name: "Tempest Wing", time: 60 + 45 },
                    { name: "Tempest Wing", time: 60 + 53 },
                    { name: "Flare Breath", time: 60 + 54 },

                    { name: "Gigaflare", time: 60 + 60 },

                    { name: "Akh Morn #3", time: 130 + 0 },
                    { name: "Megaflare", time: 130 + 15 },
                    { name: "Tempest Wing", time: 130 + 18 },
                    { name: "Tempest Wing", time: 130 + 24 },
                    { name: "Earth Shakers", time: 130 + 40 },
                    { name: "Tempest Wing", time: 130 + 45 },
                    { name: "Tempest Wing", time: 130 + 53 },
                    { name: "Flare Breath", time: 130 + 54 },

                    { name: "Akh Morn #4 (hallow)", time: 190 + 0 },
                    { name: "Megaflare", time: 190 + 15 },
                    { name: "Tempest Wing", time: 190 + 18 },
                    { name: "Tempest Wing", time: 190 + 24 },
                    { name: "Earth Shakers", time: 190 + 40 },
                    { name: "Tempest Wing", time: 190 + 45 },
                    { name: "Tempest Wing", time: 190 + 53 },
                    { name: "Flare Breath", time: 190 + 54 },

                    { name: "Gigaflare", time: 190 + 60 },

                    { name: "Akh Morn #5", time: 260 + 0 },
                    { name: "Megaflare", time: 260 + 15 },
                    { name: "Tempest Wing", time: 260 + 18 },
                    { name: "Tempest Wing", time: 260 + 24 },
                    { name: "Earth Shakers", time: 260 + 40 },
                    { name: "Tempest Wing", time: 260 + 45 },
                    { name: "Tempest Wing", time: 260 + 53 },
                    { name: "Flare Breath", time: 260 + 54 },

                    { name: "HARD ENRAGE", time: 330 },
                ],
            },
        ],
    };

    var FinalCoilOfBahamutTurn4 = function () {
        BaseTickable.apply(this, arguments);
        this.zoneFilter = "The Final Coil Of Bahamut - Turn (4)";
        this.bosses = [bahamutPrime];
    };
    FinalCoilOfBahamutTurn4.prototype = new BaseTickable;

    updateRegistrar.register(new FinalCoilOfBahamutTurn4());
})();