var UpdateRegistrar = function() {
    this.filters = [];

    this.currentZone = null;
    this.currentBoss = null;
    this.currentBossStartTime = null
    this.currentPhase = null;
    this.currentPhaseStartTime = null;
    this.currentRotation = [];
};

UpdateRegistrar.prototype.register = function(filter) {
    this.filters.push(filter);
};

UpdateRegistrar.prototype.startBoss = function(boss) {
    var currentTime = new Date();
    this.currentBoss = boss;
    this.currentBossStartTime = currentTime;
    this.startPhase(0, currentTime);
}

UpdateRegistrar.prototype.endBoss = function() {
    // TODO: record final time, etc
    this.currentZone = null;
    this.currentBoss = null;
    this.currentBossStartTime = null
    this.currentPhase = null;
    this.currentPhaseStartTime = null;
    this.currentRotation = [];
};

UpdateRegistrar.prototype.startPhase = function(phaseNumber, currentTime) {
    if (this.currentPhase === phaseNumber)
        return;
    this.currentPhase = phaseNumber;
    this.currentPhaseStartTime = currentTime;
}

UpdateRegistrar.prototype.tick = function (currentTime) {
    var currentZone = window.act.currentZone();
    if (!this.currentZone) {
        this.currentZone = currentZone;
    }
    if (this.currentZone != currentZone) {
        this.currentZone = currentZone;
        this.endBoss();
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

    // FIXME: Separate out bosses from UpdateRegistrar.
    // Make each area do it itself.
    if (!this.currentBoss) {
        // TODO: show likely boss given current zone
        return;
    }

    if (!window.act.inCombat()) {
        this.endBoss();
        return;
    }

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

    // FIXME: check if the boss exists, as this currently returns 0 if not.
    var bossPercent = hpPercentByName(this.currentBoss.bossName);
    if (phase.endHpPercent && bossPercent) {
        if (bossPercent < phase.endHpPercent) {
            this.startPhase(this.currentPhase + 1, currentTime);
        }
    }

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
            adjustedItem = {
                name: phase.rotation[i].name,
                time: addTime(nextLoop, phase.rotation[i].time),
            };
            rotation.push(adjustedItem);
        }
    }

    this.currentRotation = rotation;
}

UpdateRegistrar.prototype.processLogLine = function(logLine) {
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

function updateFunc() {
    var boss = updateRegistrar.currentBoss;
    if (!boss)
        return;

    var percent = hpPercentByName(boss.bossName);
    percent = Math.floor(percent); // TODO: add one decimal point
    bindings.setTitle(boss.bossName + ": " + percent + "%");

    var currentTime = new Date();

    var enrageSeconds = boss.enrageSeconds;
    if (enrageSeconds) {
        var enrage = addTime(updateRegistrar.currentBossStartTime, enrageSeconds);
        bindings.setEnrage("Enrage: " + formatTimeDiff(enrage, currentTime));
    } else {
        bindings.setEnrage('');
    }

    var currentPhase = boss.phases[updateRegistrar.currentPhase];
    var nextPhase = boss.phases[updateRegistrar.currentPhase + 1];

    // TODO: Add one rotation from next phase as well when it gets
    // close in time or percentage? Or always?
    var nextPhaseTitle = "";
    var nextPhaseTime = "";
    if (nextPhase) {
        nextPhaseTitle = nextPhase.title;
        if (currentPhase.endSeconds) {
            var phaseEndTime = addTime(updateRegistrar.currentPhaseStartTime, currentPhase.endSeconds);
            nextPhaseTime = formatTimeDiff(phaseEndTime, currentTime);
        } else if (currentPhase.endHpPercent) {
            nextPhaseTime = currentPhase.endHpPercent + "%";
        }
    }
    bindings.setNextTitle(nextPhaseTitle);
    bindings.setNextCondition(nextPhaseTime);

    bindings.setRotation(updateRegistrar.currentRotation);
}

var BaseTickable = function (updateRegistrar) {
    this.updateRegistrar = updateRegistrar;
};
BaseTickable.prototype.filtersZone = function (zone) {
    if (!this.zoneFilter)
        return true;
    return this.zoneFilter === zone;
};
BaseTickable.prototype.tick = function (currentTime) { };

BaseTickable.prototype.processLog = function (log) {
    if (log.indexOf("will be sealed off") != -1) {
        for (var i = 0; i < this.bosses.length; ++i) {
            if (log.indexOf(this.bosses[i].areaSeal) == -1)
                continue;
            // FIXME: Use log entry time to start?
            this.updateRegistrar.startBoss(this.bosses[i]);
            break;
        }
    } else if (log.indexOf("is no longer sealed") != -1) {
        for (var i = 0; i < this.bosses.length; ++i) {
            if (log.indexOf(this.bosses[i].areaSeal) == -1)
                continue;
            this.updateRegistrar.endBoss();
            break;
        }
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
        var testArea = new TestArea(updateRegistrar);
        updateRegistrar.register(testArea);
        updateRegistrar.startBoss(testArea.bosses[0]);
    }
    updateRegistrar.register(new KeeperOfTheLake(updateRegistrar));
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
    // FIXME: These bindings are weird.
    updateFunc();

    window.requestAnimationFrame(rafLoop);

}

window.requestAnimationFrame(rafLoop);
