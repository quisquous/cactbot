cb.rotation = {};

var BossStateMachine = function () {
    this.end();
};

BossStateMachine.prototype.storageKey = function (name) {
    console.assert(name);
    return "cb.dps." + name;
};

BossStateMachine.prototype.startBoss = function (boss) {
    if (this.currentBoss === boss) {
        return;
    }
    var currentTime = new Date();
    this.currentBoss = boss;
    this.currentBossStartTime = currentTime;

    var key = this.storageKey(boss.bossName);
    var infoStr = window.localStorage.getItem(key);
    var info = infoStr ? JSON.parse(infoStr) : {
        attemptId: 0,
    };
    info.lastAttempt = currentTime.getTime();
    info.attemptId++;
    window.localStorage.setItem(key, JSON.stringify(info));
    cb.debug('Boss fight: ' + boss.bossName + '(' + info.attemptId + ')');

    this.currentAttemptId = info.attemptId;

    document.dispatchEvent(new CustomEvent('cactbot.rotation.startfight', {
        detail: {
            fightId: this.currentBoss.fightId,
            attempt: this.currentAttemptId,
            time: currentTime,
        },
    }));

    this.startPhase(0, currentTime);
};

BossStateMachine.prototype.end = function () {
    if (!this.currentBoss) {
        return;
    }

    var currentTime = new Date();
    if (this.currentPhase != null) {
        var phase = this.currentBoss.phases[this.currentPhase];
        this.postEndPhaseMessage(currentTime, phase);
    }

    document.dispatchEvent(new CustomEvent('cactbot.rotation.endfight', {
        detail: {
            fightId: this.currentBoss.fightId,
            attempt: this.currentAttemptId,
            time: currentTime,
            startTime: this.currentBossStartTime,
        },
    }));

    cb.debug('End boss fight');
    this.currentBoss = null;
    this.currentPhase = null;
    this.currentBossStartTime = null;
    this.currentPhaseStartTime = null;
    this.currentRotation = [];
};

BossStateMachine.prototype.postStartPhaseMessage = function(currentTime, phase) {
    document.dispatchEvent(new CustomEvent('cactbot.rotation.startphase', {
        detail: {
            fightId: this.currentBoss.fightId,
            attempt: this.currentAttemptId,
            time: currentTime,
            startTime: this.currentBossStartTime,
            title: phase.title,
            name: phase.shortName,
            phaseIdx: phase.phaseIdx,
        },
    }));
};

BossStateMachine.prototype.postEndPhaseMessage = function(currentTime, phase) {
    document.dispatchEvent(new CustomEvent('cactbot.rotation.endphase', {
        detail: {
            fightId: this.currentBoss.fightId,
            attempt: this.currentAttemptId,
            time: currentTime,
            startTime: this.currentBossStartTime,
            title: phase.title,
            name: phase.shortName,
            phaseIdx: phase.phaseIdx,
        },
    }));
};

BossStateMachine.prototype.startPhase = function (phaseNumber, currentTime) {
    if (this.currentPhase === phaseNumber)
        return;
    var currentTime = new Date();
    if (this.currentPhase != null) {
        var phase = this.currentBoss.phases[this.currentPhase];
        this.postEndPhaseMessage(currentTime, phase);
    }

    this.currentPhase = phaseNumber;
    this.currentPhaseStartTime = currentTime;
    this.lastRotationItemIdx = 0;

    // Some loops have a "one time" part of the loop that happens in negative
    // time, so move time=0 into the future.
    var phase = this.currentBoss.phases[this.currentPhase];
    if (typeof phase.loopOffset === 'number') {
        this.currentPhaseStartTime = addTime(currentTime, -phase.loopOffset);
    }

    this.postStartPhaseMessage(currentTime, phase);
};

BossStateMachine.prototype.processLog = function (logLine) {
    if (!this.currentBoss) {
        return;
    }
    var endFightLog = this.currentBoss.endLog;
    if (endFightLog) {
        if (logLine.indexOf(endFightLog) != -1) {
            this.end();
            return;
        }
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

    if (phase.justText) {
        this.currentRotation = phase.rotation;
        return;
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
        if (phase.rotation[i].skipFirst) {
            continue;
        }
        adjustedItem = {
            name: phase.rotation[i].name,
            time: addTime(adjustedStartTime, phase.rotation[i].time),
        };
        rotation.push(adjustedItem);
    }

    if (phase.loop) {
        var nextLoop = addTime(adjustedStartTime, phase.loopSeconds);
        for (var i = 0; i < startIdx; ++i) {
            if (phase.rotation[i].justOnce || phase.rotation[i].time < 0) {
                continue;
            }
            adjustedItem = {
                name: phase.rotation[i].name,
                time: addTime(nextLoop, phase.rotation[i].time),
            };
            rotation.push(adjustedItem);
        }
    }

    // Process completed events since last tick.
    // FIXME: this won't work if tick times are so long that an entire loop
    // goes by since the last tick.
    var didFinishItem = (function(item) {
        // FIXME: mini phases don't work with loops.
        if (item.startMiniPhase) {
            var phase = {
                title: item.startMiniPhase,
                shortName: item.startMiniPhase,
            };
            this.postStartPhaseMessage(currentTime, phase);
        }
        if (item.endMiniPhase) {
            var phase = {
                title: item.endMiniPhase,
                shortName: item.endMiniPhase,
            };
            this.postEndPhaseMessage(currentTime, phase);
        }
    }).bind(this);
    if (this.lastRotationItemIdx > startIdx) {
        for (var i = this.lastRotationItemIdx; i < phase.rotation.length; ++i) {
            didFinishItem(phase.rotation[i]);
        }
        this.lastRotationItemIdx = 0;
    }
    for (var i = this.lastRotationItemIdx; i < startIdx; ++i) {
        didFinishItem(phase.rotation[i]);
    }
    this.lastRotationItemIdx = startIdx;

    this.currentRotation = rotation;
};

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
    var setterName = 'set' + id[0].toUpperCase() + id.substring(1);
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

    rotationDiv.innerHTML = '';

    // Don't display anything farther ahead in the future than 1 minute.
    var maxDiffSeconds = 60;

    for (var i = 0; i < rotation.length; ++i) {
        var rotItem = document.createElement('div');
        rotItem.className = 'rotitem';

        var moveItem = document.createElement('div');
        moveItem.className = 'move';
        moveItem.innerText = rotation[i].name;
        rotItem.appendChild(moveItem);

        var countdownItem = document.createElement('div');
        countdownItem.className = 'countdown';
        if (rotation[i].time) {
            var diffSeconds = (rotation[i].time.getTime() - currentTime.getTime()) / 1000;
            if (diffSeconds > maxDiffSeconds) {
                continue;
            }
            var displayTenths = diffSeconds < 10 || i == 0;
            countdownItem.innerText = formatTimeDiff(rotation[i].time, currentTime, displayTenths);
        }
        rotItem.appendChild(countdownItem);

        rotationDiv.appendChild(rotItem);
    }
};

function addTime(date, seconds) {
    return new Date(date.getTime() + seconds * 1000);
}

function formatTimeDiff(futureTime, currentTime, displayTenths) {
    var total = (futureTime.getTime() - currentTime.getTime()) / 1000;
    return formatTime(total, displayTenths);
}

function formatTime(totalSeconds, displayTenths) {
    var str = '';
    var total = Math.max(0, totalSeconds);
    var minutes = Math.floor(total / 60);
    var seconds = Math.floor(total % 60);
    var tenthseconds = Math.floor((10 * (total % 60)) % 10);
    str = '';
    if (minutes > 0)
        str += minutes + 'm';
    str += seconds;
    if (displayTenths)
        str += '.' + tenthseconds;
    str += 's';

    return str;
}

var bindings;

function hpPercentByName(name, minHP) {
    var combatant = window.act.getMobByName(name, minHP);
    if (!combatant)
        return 0;
    return 100 * combatant.currentHP / combatant.maxHP;
}

function updateFunc(bossStateMachine) {
    var boss = bossStateMachine.currentBoss;
    if (!boss) {
        bindings.clear();
        return;
    }

    var percent = hpPercentByName(boss.bossName, boss.minHP);
    percent = Math.floor(percent); // TODO: add one decimal point
    bindings.setTitle(boss.bossName + ': ' + percent + '%');

    var currentTime = new Date();

    var enrageSeconds = boss.enrageSeconds;
    if (enrageSeconds) {
        var enrage = addTime(bossStateMachine.currentBossStartTime, enrageSeconds);
        bindings.setEnrage('Enrage: ' + formatTimeDiff(enrage, currentTime));
    } else {
        bindings.setEnrage('');
    }

    var currentPhase = boss.phases[bossStateMachine.currentPhase];
    var nextPhase = boss.phases[bossStateMachine.currentPhase + 1];

    // TODO: Add one rotation from next phase as well when it gets
    // close in time or percentage? Or always?
    var nextPhaseTitle = '';
    var nextPhaseTime = '';
    if (nextPhase) {
        nextPhaseTitle = nextPhase.title;
        if (currentPhase.endSeconds) {
            var phaseEndTime = addTime(bossStateMachine.currentPhaseStartTime, currentPhase.endSeconds);
            nextPhaseTime = formatTimeDiff(phaseEndTime, currentTime);
        } else if (currentPhase.endHpPercent) {
            nextPhaseTime = currentPhase.endHpPercent + '%';
        }
    }
    bindings.setNextTitle(nextPhaseTitle);
    bindings.setNextCondition(nextPhaseTime);

    bindings.setRotation(bossStateMachine.currentRotation);
}

var BaseTickable = function () {
    this.boss = new BossStateMachine();
    document.addEventListener('cactbot.wipe', (function () {
        this.boss.end();
    }).bind(this));
};

BaseTickable.prototype.enterZone = function (zone) {
    for (var i = 0; i < this.bosses.length; ++i) {
        cb.debug('Added boss: ' + this.bosses[i].bossName);
    }
};

BaseTickable.prototype.leaveZone = function (zone) {
    this.boss.end();
    bindings.clear();
};

BaseTickable.prototype.filtersZone = function (zone) {
    if (!this.zoneFilter)
        return true;
    return this.zoneFilter === zone;
};
BaseTickable.prototype.throttleTickMs = 100;
BaseTickable.prototype.tick = function (currentTime) {
    this.boss.tick(currentTime);

    // FIXME: This isn't a great place to glue a state machine to bindings.
    updateFunc(this.boss);
};
BaseTickable.prototype.processLogs = function (logs) {
    for (var l = 0; l < logs.length; ++l) {
        var log = logs[l];
        if (log.indexOf('will be sealed off') != -1) {
            for (var i = 0; i < this.bosses.length; ++i) {
                if (log.indexOf(this.bosses[i].areaSeal) == -1) {
                    continue;
                }
                // FIXME: Use log entry time to start?
                this.boss.startBoss(this.bosses[i]);
                break;
            }
        } else if (log.indexOf('is no longer sealed') != -1) {
            for (var i = 0; i < this.bosses.length; ++i) {
                if (log.indexOf(this.bosses[i].areaSeal) == -1)
                    continue;
                this.boss.end();
                break;
            }
        }

        for (var i = 0; i < this.bosses.length; ++i) {
            if (!this.bosses[i].startLog) {
                continue;
            }
            if (log.indexOf(this.bosses[i].startLog) == -1) {
                continue;
            }
            this.boss.startBoss(this.bosses[i]);
            break;
        }

        if (this.boss) {
            this.boss.processLog(log);
        }
    }
};

// WipeChecker works by detecting when a player goes from 0 HP to >0 HP
// without weakness.  It sends a cactbot.wipe event.
cb.rotation.wipeChecker = {
    playerDead: false,
    lastRevivedTime: null,

    wipe: function() {
        cb.debug('Wipe detected.');
        document.dispatchEvent(new CustomEvent('cactbot.wipe'));
        this.reset();
    },
    reset: function() {
        this.playerDead = false;
        // If this is !null, then it's a potential wipe that's being determined.
        this.lastRevivedTime = null;
    },
    enterZone: function(zone) {
        this.reset();
    },
    leaveZone: function(zone) {
        this.reset();
    },
    filtersZone: function() { return true; },
};

cb.rotation.wipeChecker.tick = function (currentTime) {
    var player = window.act.getPlayer();
    if (!player) {
        return;
    }
    // Note: can't use "You were revived" from log, as it doesn't happen for
    // fights that auto-restart when everybody is defeated.
    if (!this.playerDead && player.currentHP == 0) {
        this.playerDead = true;
    } else if (this.playerDead && player.currentHP > 0) {
        this.playerDead = false;
        this.lastRevivedTime = currentTime;
    }

    // Heuristic: if a player is revived and a second passes without
    // a weakness message, then it was a wipe.
    if (this.lastRevivedTime) {
        if (currentTime.getTime() - this.lastRevivedTime.getTime() > 1000) {
            this.wipe();
        }
    }
};
cb.rotation.wipeChecker.processLogs = function (logs) {
    for (var i = 0; i < logs.length; ++i) {
        // FIXME: Filter by log category.
        if (logs[i].indexOf('You suffer the effect of Weakness') != -1) {
            // Players come back to life before weakness is applied.
            if (!this.playerDead && this.lastRevivedTime) {
                // This is a raise of some sort, and not a wipe.
                this.lastRevivedTime = null;
            }
        } else if (logs[i].indexOf('cactbot wipe') != -1) {
            // FIXME: only allow echos to do this vs jerks saying this in chat.
            this.wipe();
        }
    }
};

window.addEventListener('load', function () {
    cb.util.loadCSS('rotation/rotation.css');
    
    // FIXME: This can't get loaded from a file via Javascript, because of
    // cross-origin issues.  This isn't an issue at runtime (cef can cheat
    // the sandbox with some flags), but it will make developing a pain if
    // it's required to run a proxy or pass sandbox-clobbering flags to
    // the browser.  Punt on adding more developer hurdles for now.  <_<
    var element = document.createElement('div');
    element.innerHTML =
        '<div id="bosstimers">' +
        '  <div id="titlebar">' +
        '    <div id="bosstitle">Angry Bees: 0%</div>' +
        '    <div id="enrage">Enrage: 12m10s</div>' +
        '  </div>' +
        '  <div id="rotation">' +
        '    <div class="rotitem"><div class="move">next thing</div><div class="countdown">1m24s</div></div>' +
        '    <div class="rotitem"><div class="move">one thing</div><div class="countdown">1m24s</div></div>' +
        '    <div class="rotitem"><div class="move">that thing</div><div class="countdown">2m24s</div></div>' +
        '    <div class="rotitem"><div class="move">whoa whoa whoa</div><div class="countdown">3m24s</div></div>' +
        '  </div>' +
        '  <div id="nextphase">' +
        '    <div id="nextphasetitle">Phase 2 (dem adds)</div>' +
        '    <div id="nextphasecondition">HP: 61%, 1m25s</div>' +
        '  </div>' +
        '</div>';

    var body = document.getElementsByTagName('body')[0];
    body.appendChild(element);

    var defaultGeometry = {
        width: '400px',
        height: '400px',
    };

    cb.windowManager.add('rotation', element, 'rotation', defaultGeometry);
    cb.updateRegistrar.register(cb.rotation.wipeChecker);

    // FIXME: This is such a clumsy binding.
    window.bindings = new RaidTimersBinding();
});
