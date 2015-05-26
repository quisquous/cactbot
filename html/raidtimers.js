var fakeBoss = {
    bossName: "Angry Bees",
    zone: "Xanadu",
    enrageSeconds: 720,
    triggerPhrase: "The hive will be closed off",
    phases: [
        {
            title: "Phase 1 (stinging)",
            loop: false,
            endSeconds: 15,
            rotation: [
                { name: "Poke", time: 3},
                { name: "Prod", time: 5},
                { name: "Slam", time: 8},
                { name: "Poke", time: 10},
                { name: "Prod", time: 12},
            ],
        },
        {
            title: "Phase 2 (angry buzzing)",
            loop: true,
            loopSeconds: 10,
            endHpPercent: 61,
            rotation: [
                { name: "Buzz", time: 2.5},
                { name: "Fizz", time: 4},
                { name: "Buzzzzzzzz", time: 5},
                { name: "Blink About", time: 8},
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

var RotationManager = function(updateCallback) {
    this.bosses = [];
    this.updateCallback = updateCallback;

    this.currentBoss = null;
    this.currentBossStartTime = null
    this.currentPhase = null;
    this.currentPhaseStartTime = null;
};

RotationManager.prototype.register = function(boss) {
    this.bosses.push(boss);
};

RotationManager.prototype.startBoss = function(boss) {
    var currentTime = new Date();
    this.currentBoss = boss;
    this.currentBossStartTime = currentTime;
    this.startPhase(0, currentTime);
}

RotationManager.prototype.endBoss = function() {
    // TODO: record final time, etc
    this.currentBoss = null;
    this.currentBossStartTime = null
    this.currentPhase = null;
    this.currentPhaseStartTime = null;
};

RotationManager.prototype.startPhase = function(phaseNumber, currentTime) {
    if (this.currentPhase === phaseNumber)
        return;
    this.currentPhase = phaseNumber;
    this.currentPhaseStartTime = currentTime;
}

RotationManager.prototype.tick = function(currentTime) {
    if (!this.currentBoss) {
        // TODO: show likely boss given current zone
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

    var bossPercent = act.hpPercentByName(this.currentBoss);
    if (bossPercent <= 0) {
        this.endBoss();
        return;
    }

    if (phase.endHpPercent) {
        if (bossPercent < phase.endHpPercent) {
            this.startPhase(this.currentPhase + 1, currentTime);
        }
    }

    var rotation = [];
    var seconds = (currentTime.getTime() - this.currentPhaseStartTime.getTime()) / 1000;
    var adjustedStartTime = this.currentPhaseStartTime;
    if (phase.loop) {
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

    // TODO: Maybe just access this off rotation manager.
    // Passing it seemed like a cleaner way to test, but this is out of hand.
    var updateInfo = {
        boss: this.currentBoss,
        bossStartTime: this.currentBossStartTime,
        phase: this.currentBoss.phases[this.currentPhase],
        nextPhase: this.currentBoss.phases[this.currentPhase + 1],
        rotation: rotation,
        phaseStartTime: this.currentPhaseStartTime,
    };
    this.updateCallback(updateInfo);
}

RotationManager.prototype.processLogLine = function(logLine) {
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
};

RaidTimersBinding.prototype.clear = function() {
    // TODO
};

RaidTimersBinding.prototype.register = function(id, elementName, func, initial) {
    var setterName = "set" + id[0].toUpperCase() + id.substring(1);
    this[setterName] = function(value) {
        return this.setterInner(id, value);
    };
    this.boundElementNames[id] = elementName;
    this.boundFuncs[id] = func;
    this.initialValues[id] = initial;

    // TODO: let caller call initial clear?
    this.setterInner(id, initial);
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

var bindings = new RaidTimersBinding();

function updateFunc(updateInfo) {
    // Has the fight started?

    var percent = act.hpPercentByName(updateInfo.boss.bossName);
    percent = Math.floor(percent); // TODO: add one decimal point
    bindings.setTitle(updateInfo.boss.bossName + ": " + percent + "%");

    var currentTime = new Date();

    var enrageSeconds = updateInfo.boss.enrageSeconds;
    if (enrageSeconds) {
        var enrage = addTime(updateInfo.bossStartTime, enrageSeconds);
        bindings.setEnrage("Enrage: " + formatTimeDiff(enrage, currentTime));
    } else {
        bindings.setEnrage('');
    }

    // TODO: Add one rotation from next phase as well when it gets
    // close in time or percentage? Or always?
    var nextPhaseTitle = "";
    var nextPhaseTime = "";
    if (updateInfo.nextPhase) {
        nextPhaseTitle = updateInfo.nextPhase.title;
        if (updateInfo.phase.endSeconds) {
            var phaseEndTime = addTime(updateInfo.phaseStartTime, updateInfo.phase.endSeconds);
            nextPhaseTime = formatTimeDiff(phaseEndTime, currentTime);
        } else if (updateInfo.phase.endHpPercent) {
            nextPhaseTime = updateInfo.phase.endHpPercent + "%";
        }
    }
    bindings.setNextTitle(nextPhaseTitle);
    bindings.setNextCondition(nextPhaseTime);

    bindings.setRotation(updateInfo.rotation);
}

var rotationManager = new RotationManager(updateFunc);
function testingInit() {
    rotationManager.register(fakeBoss);
    rotationManager.startBoss(fakeBoss);
}
testingInit();

var i = 0;
function rafLoop() {
    if (!window.act) {
        window.requestAnimationFrame(rafLoop);
        return;
    }

    var currentTime = new Date();

    rotationManager.tick(currentTime);

    if (i++ < 200)
    window.requestAnimationFrame(rafLoop);

}

window.requestAnimationFrame(rafLoop);
