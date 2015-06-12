var BossStateMachine = function () {
    this.end();
};

BossStateMachine.prototype.startBoss = function (boss) {
    var currentTime = new Date();
    this.currentBoss = boss;
    this.currentBossStartTime = currentTime;
    this.startPhase(0, currentTime);
};

BossStateMachine.prototype.end = function () {
    this.currentBoss = null;
    this.currentPhase = null;
    this.currentBossStartTime = null;
    this.currentPhaseStartTime = null;
    this.currentRotation = [];
};

BossStateMachine.prototype.startPhase = function (phaseNumber, currentTime) {
    if (this.currentPhase === phaseNumber)
        return;
    this.currentPhase = phaseNumber;
    this.currentPhaseStartTime = currentTime;
};

BossStateMachine.prototype.processLog = function (logLine) {
    if (!this.currentBoss) {
        return;
    }
    var phase = this.currentBoss.phases[this.currentPhase];
    if (!phase.endLog) {
        return;
    }
    if (logLine.indexOf(phase.endLog) != -1) {
        var currentTime = new Date();
        this.startPhase(this.currentPhase + 1, currentTime);
    }
};

BossStateMachine.prototype.tick = function (currentTime) {
    if (!this.currentBoss)
        return;

    if (this.currentBoss.enrageSeconds) {
        var enrage = addTime(currentTime, this.currentBoss.enrageSeconds);
        if (enrage < currentTime) {
            // TODO: enrage
            return;
        }
    }

    var phase = this.currentBoss.phases[this.currentPhase];
    if (phase.endSeconds) {
        var endPhase = addTime(this.currentPhaseStartTime, phase.endSeconds);
        if (endPhase < currentTime) {
            this.startPhase(this.currentPhase + 1, currentTime);
        }
    }

    // Note: boss percent never changes phase, it's just currently there for status.

    var rotation = [];
    var seconds = (currentTime.getTime() - this.currentPhaseStartTime.getTime()) / 1000;
    var adjustedStartTime = this.currentPhaseStartTime;
    if (phase.loop) {
        // FIXME: assert if no loopSeconds.
        seconds = seconds % phase.loopSeconds;
        adjustedStartTime = addTime(currentTime, -seconds);
    }
    for (var startIdx = 0; startIdx < phase.rotation.length; ++startIdx) {
        var item = phase.rotation[startIdx];
        if (item.time > seconds)
            break;
    }
    // assert startIdx is valid here
    var adjustedItem;
    for (var i = startIdx; i < phase.rotation.length; ++i) {
        adjustedItem = {
            name: phase.rotation[i].name,
            time: addTime(adjustedStartTime, phase.rotation[i].time),
        };
        rotation.push(adjustedItem);
    }

    if (phase.loop) {
        var nextLoop = addTime(adjustedStartTime, phase.loopSeconds);
        for (var i = 0; i < startIdx; ++i) {
            if (phase.rotation[i].justOnce) {
                continue;
            }
            adjustedItem = {
                name: phase.rotation[i].name,
                time: addTime(nextLoop, phase.rotation[i].time),
            };
            rotation.push(adjustedItem);
        }
    }

    this.currentRotation = rotation;
};

var UpdateRegistrar = function () {
    this.filters = [];
    this.currentZone = window.act.currentZone();
};

UpdateRegistrar.prototype.register = function(filter) {
    this.filters.push(filter);
    var currentZone = window.act.currentZone();
    if (filter.filtersZone(currentZone)) {
        filter.enterZone(currentZone);
    }
};

UpdateRegistrar.prototype.tick = function (currentTime) {
    var currentZone = window.act.currentZone();
    if (this.currentZone != currentZone) {
        for (var i = 0; i < this.filters.length; ++i) {
            if (this.filters[i].filtersZone(this.currentZone)) {
                this.filters[i].leaveZone(this.currentZone);
            }
        }

        this.currentZone = currentZone;

        for (var i = 0; i < this.filters.length; ++i) {
            if (this.filters[i].filtersZone(this.currentZone)) {
                this.filters[i].enterZone(this.currentZone);
            }
        }
    }

    // Log entries before ticking.
    var activeFilters = [];

    for (var i = 0; i < this.filters.length; ++i) {
        if (this.filters[i].filtersZone(currentZone)) {
            activeFilters.push(this.filters[i]);
        }
    }

    while (window.act.hasLogLines()) {
        var line = window.act.nextLogLine();
        for (var i = 0; i < activeFilters.length; ++i) {
            activeFilters[i].processLog(line);
        }
    }

    for (var i = 0; i < activeFilters.length; ++i) {
        activeFilters[i].tick(currentTime);
    }
}

var RaidTimersBinding = function() {
    this.boundData = {};
    this.boundElementNames = {};
    this.boundFuncs = {};
    this.initialValues = {};

    this.register('title', 'bosstitle', this.updateInnerText, '');
    this.register('enrage', 'enrage', this.updateInnerText, '');
    this.register('nextTitle', 'nextphasetitle', this.updateInnerText, '');
    this.register('nextCondition', 'nextphasecondition', this.updateInnerText, '');
    this.register('rotation', 'rotation', this.updateRotation, []);

    this.clear();
};

RaidTimersBinding.prototype.clear = function() {
    for (var id in this.initialValues) {
        this.setterInner(id, this.initialValues[id]);
    }
};

RaidTimersBinding.prototype.register = function(id, elementName, func, initial) {
    var setterName = "set" + id[0].toUpperCase() + id.substring(1);
    this[setterName] = function(value) {
        return this.setterInner(id, value);
    };
    this.boundElementNames[id] = elementName;
    this.boundFuncs[id] = func;
    this.initialValues[id] = initial;
};

RaidTimersBinding.prototype.setterInner = function(id, value) {
    if (this.boundData[id] === value)
        return;
    this.boundData[id] = value;

    var element = document.getElementById(this.boundElementNames[id]);
    if (!element) {
        // TODO: warning
        return;
    }
    this.boundFuncs[id](element, value);
};

RaidTimersBinding.prototype.updateInnerText = function(element, value) {
    element.innerText = value;
};

RaidTimersBinding.prototype.updateRotation = function(rotationDiv, rotation) {
    var currentTime = new Date();

    rotationDiv.innerHTML = "";

    // Limit by height? Or by count?
    for (var i = 0; i < rotation.length; ++i) {
        var rotItem = document.createElement("div");
        rotItem.className = "rotitem";

        var moveItem = document.createElement("div");
        moveItem.className = "move";
        moveItem.innerText = rotation[i].name;
        rotItem.appendChild(moveItem);

        var countdownItem = document.createElement("div");
        countdownItem.className = "countdown";
        countdownItem.innerText = formatTimeDiff(rotation[i].time, currentTime);
        rotItem.appendChild(countdownItem);

        rotationDiv.appendChild(rotItem);
    }
};

function addTime(date, seconds) {
    return new Date(date.getTime() + seconds * 1000);
}

function formatTimeDiff(futureTime, currentTime) {
    var total = (futureTime.getTime() - currentTime.getTime()) / 1000;
    return formatTime(total);
}

function formatTime(totalSeconds) {
    var str = "";
    var total = Math.max(0, totalSeconds);
    var minutes = Math.floor(total / 60);
    var seconds = Math.floor(total % 60);
    var tenthseconds = Math.floor((10 * (total % 60)) % 10);
    str = "";
    if (minutes > 0)
        str += minutes + "m";
    str += seconds;
    if (!minutes)
        str += "." + tenthseconds;
    str += "s";

    return str;
}

var bindings;

function hpPercentByName(name) {
    var combatant = window.combatantByName[name];
    if (!combatant)
        return 0;
    return 100 * combatant.currentHP / combatant.maxHP;
}

function updateFunc(bossStateMachine) {
    var boss = bossStateMachine.currentBoss;
    if (!boss)
        return;

    var percent = hpPercentByName(boss.bossName);
    percent = Math.floor(percent); // TODO: add one decimal point
    bindings.setTitle(boss.bossName + ": " + percent + "%");

    var currentTime = new Date();

    var enrageSeconds = boss.enrageSeconds;
    if (enrageSeconds) {
        var enrage = addTime(bossStateMachine.currentBossStartTime, enrageSeconds);
        bindings.setEnrage("Enrage: " + formatTimeDiff(enrage, currentTime));
    } else {
        bindings.setEnrage('');
    }

    var currentPhase = boss.phases[bossStateMachine.currentPhase];
    var nextPhase = boss.phases[bossStateMachine.currentPhase + 1];

    // TODO: Add one rotation from next phase as well when it gets
    // close in time or percentage? Or always?
    var nextPhaseTitle = "";
    var nextPhaseTime = "";
    if (nextPhase) {
        nextPhaseTitle = nextPhase.title;
        if (currentPhase.endSeconds) {
            var phaseEndTime = addTime(bossStateMachine.currentPhaseStartTime, currentPhase.endSeconds);
            nextPhaseTime = formatTimeDiff(phaseEndTime, currentTime);
        } else if (currentPhase.endHpPercent) {
            nextPhaseTime = currentPhase.endHpPercent + "%";
        }
    }
    bindings.setNextTitle(nextPhaseTitle);
    bindings.setNextCondition(nextPhaseTime);

    bindings.setRotation(bossStateMachine.currentRotation);
}

var BaseTickable = function () {
    this.boss = new BossStateMachine();
};

BaseTickable.prototype.enterZone = function (zone) {
};

BaseTickable.prototype.leaveZone = function (zone) {
};

BaseTickable.prototype.filtersZone = function (zone) {
    if (!this.zoneFilter)
        return true;
    return this.zoneFilter === zone;
};
BaseTickable.prototype.tick = function (currentTime) {
    this.boss.tick(currentTime);
    // FIXME: This isn't a great place to glue a state machine to bindings.
    updateFunc(this.boss);
};

BaseTickable.prototype.processLog = function (log) {
    if (log.indexOf("will be sealed off") != -1) {
        for (var i = 0; i < this.bosses.length; ++i) {
            if (log.indexOf(this.bosses[i].areaSeal) == -1)
                continue;
            // FIXME: Use log entry time to start?
            this.boss.startBoss(this.bosses[i]);
            break;
        }
    } else if (log.indexOf("is no longer sealed") != -1) {
        for (var i = 0; i < this.bosses.length; ++i) {
            if (log.indexOf(this.bosses[i].areaSeal) == -1)
                continue;
            this.boss.stop();
            break;
        }
    }

    if (this.boss) {
        this.boss.processLog(log);
    }
};

var einhander = {
    bossName: "Einhander",
    areaSeal: "The agrius",
    phases: [
        {
            title: "Phase 1, maybe",
            loop: true,
            loopSeconds: 70,
            rotation: [
                { name: "Flamethrower", time: 7 },
                { name: "Flamethrower", time: 18 },
                // I think there's a jump, percentage, phase shift before heavy swing?
                { name: "Heavy Swing", time: 31 },
                { name: "Flamethrower", time: 35 },
                { name: "Heavy Swing", time: 46 },
                { name: "Flamethrower", time: 50 },
                { name: "Heavy Swing", time: 63 },
            ],
            postrotation: [
                // FIXME: do something with this.
                { text: "Some more adds" },
            ],
        },
    ],
};

var gunship = {
    bossName: "The magitek gunship",
    areaSeal: "The ceruleum spill",
    phases: [
        {
            title: "Phase 1",
            loop: true,
            loopSeconds: 70,
            rotation: [
            ],
            postrotation: [
                { text: "Even more adds" },
            ],
        },
    ],
};

var midgardsormr = {
    bossName: "Midgardsormr",
    areaSeal: "The Forsworn Promise",
    phases: [
        {
            title: "Phase 1",
            loop: true,
            loopSeconds: 70,
            rotation: [
            ],
        },
    ],
};

var KeeperOfTheLake = function () {
    BaseTickable.apply(this, arguments);
    this.zoneFilter = "The Keeper Of The Lake";
    this.bosses = [einhander, gunship, midgardsormr];
};
KeeperOfTheLake.prototype = new BaseTickable;

var imdugud = {
    bossName: "Imdugud",
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
                { name: "Electric Burst", time: 4, cast: 4, justOnce: true},
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
                { name: "Heat Lightning", time: 39, cast: 5},
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
                { name: "Electric Burst", time: 4, cast: 4, justOnce: true},
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

var kaliya = {
    bossName: "Kaliya",
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
                { name: "Barofield", time: 4, cast: 4, justOnce: true},
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

var fakeBoss = {
    bossName: "Angry Bees",
    zone: "Xanadu",
    enrageSeconds: 720,
    areaSeal: "The hive",
    phases: [
        {
            title: "Phase 1 (stinging)",
            loop: false,
            endSeconds: 15,
            rotation: [
                { name: "Poke", time: 3 },
                { name: "Prod", time: 5 },
                { name: "Slam", time: 8 },
                { name: "Poke", time: 10 },
                { name: "Prod", time: 12 },
            ],
        },
        {
            title: "Phase 2 (angry buzzing)",
            loop: true,
            loopSeconds: 10,
            endHpPercent: 61,
            rotation: [
                { name: "Buzz", time: 2.5 },
                { name: "Fizz", time: 4 },
                { name: "Buzzzzzzzz", time: 5 },
                { name: "Blink About", time: 8 },
            ],
        },
        {
            title: "Phase 3 (enrage)",
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

var TestArea = function () {
    BaseTickable.apply(this, arguments);
    this.zoneFilter = "Xanadu";
    this.bosses = [fakeBoss];
};
TestArea.prototype = new BaseTickable;

var updateRegistrar = new UpdateRegistrar();
function testingInit() {
    if (window.fakeact) {
        var testArea = new TestArea();
        updateRegistrar.register(testArea);
    }
    updateRegistrar.register(new KeeperOfTheLake());
    updateRegistrar.register(new FinalCoilOfBahamutTurn1());
    updateRegistrar.register(new FinalCoilOfBahamutTurn2());
}
testingInit();

// FIXME: Move these out to an act helper.
function makeCombatantByIdMap() {
    var map = {};

    var count = window.act.numCombatants();
    for (var i = 0; i < count; ++i) {
        var combatant = window.act.getCombatant(i);
        // FIXME: "iD" camelcase is very odd.
        map[combatant.iD] = combatant;
    }

    return map;
}

function makeCombatantByNameMap() {
    var map = {};
    var collisions = [];

    var count = window.act.numCombatants();
    for (var i = 0; i < count; ++i) {
        var combatant = window.act.getCombatant(i);
        if (map[combatant.name]) {
            collisions.push(combatant.name);
            continue;
        }
        map[combatant.name] = combatant;
    }

    for (var i = 0; i < collisions.length; ++i) {
        delete map[collisions[i]];
    }

    return map;
}

var i = 0;
function rafLoop() {
    if (!window.bindings) {
        window.bindings = new RaidTimersBinding();
    }

    if (!window.act) {
        window.requestAnimationFrame(rafLoop);
        return;
    }

    window.combatantById = makeCombatantByIdMap();
    window.combatantByName = makeCombatantByNameMap();

    var currentTime = new Date();

    updateRegistrar.tick(currentTime);

    window.requestAnimationFrame(rafLoop);

}

window.requestAnimationFrame(rafLoop);
