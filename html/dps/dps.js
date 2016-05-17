cb.dps = {
    initialize: function(iframe) {
        this.iframe = iframe;

        var bindListener = function(eventName, func) {
            document.addEventListener(eventName, (function (e) {
                func.bind(cb.dps)(e);
            }));
        };
        bindListener('cactbot.rotation.startfight', this.onFightStart);
        bindListener('cactbot.rotation.endfight', this.onFightEnd);
        bindListener('cactbot.rotation.startphase', this.onPhaseStart);
        bindListener('cactbot.rotation.endphase', this.onPhaseEnd);
    },
    leaveZone: function(zone) {
        this.postMessage({
            type: 'onClearPhaseInfo',
            reason: 'zone change',
        });
        this.iframe.classList.add('hide');
    },
    filtersZone: function() { return true; },
    throttleTickMs: 1000,

    postMessage: function(message) {
        this.iframe.contentWindow.postMessage(message, '*');
        this.iframe.classList.remove('hide');
    },

    tick: function() {
        var detail = this.getUpdateInfo();
        if (!detail) {
            return;
        }

        // Deliberately don't do an update when the duration hasn't changed.
        // This is the way that phases and encounter titles don't disappear
        var currentTime = parseInt(detail.Encounter.DURATION);
        if (this.lastFightTime && this.lastFightTime == currentTime) {
            return;
        }
        if (currentTime == "NaN" || currentTime == 0) {
            return;
        }
        if (currentTime < this.lastFightTime) {
            // Since clearing phases on fight ends means that you can't review that
            // info after a wipe, instead clear phases if the duration ever
            // goes backwards in time.
            this.postMessage({
                type: 'onClearPhaseInfo',
                reason: 'backwards time',
            });
        }
        this.lastFightTime = currentTime;

        // For any open phases, send dps update.
        for (var i in this.trackedPhases) {
            var phase = this.trackedPhases[i];
            if (phase.end) {
                continue;
            }
            if (phase.start.Encounter.DURATION === detail.Encounter.DURATION) {
                // If it just started, ignore it.
                continue;
            }
            var tempPhase = {
                detail: phase.detail,
                start: phase.start,
                end: detail,
            }

            var diff = this.diffUpdateInfo(tempPhase);
            if (!diff) {
                console.error(['Failed to create diff', phase]);
                return;
            }
            diff.complete = false;

            this.postMessage({
                type: 'onOverlayPhaseUpdate',
                detail: diff,
            });
        }

        this.postMessage({
            type: 'onOverlayDataUpdate',
            detail: detail,
        });
    },

    currentFightAttempt: null,
    currentFightId: null,
    lastFightTime: null,
    trackedPhases: {},

    onFightStart: function(e) {
        console.log(['onFightStart', e]);
        this.trackedPhases = {};
        this.currentFightId = e.detail.fightId;
        this.currentFightAttempt = e.detail.attempt;
        this.lastStartTime = new Date();
        // FIXME: include count of fights here
        this.postMessage({
            type: 'onFightStart',
            detail: e.detail,
        });
    },
    onFightEnd: function(e) {
        console.log(['onFightEnd', e]);
        var info = this.getUpdateInfo();
        if (info) {
            document.dispatchEvent(new CustomEvent('cactbot.dps', {
                detail: {
                    fight: e.detail,
                    dps: info,
                },
            }));
        }

        this.currentFightId = null;

        this.postMessage({
            type: 'onFightEnd',
            detail: e.detail,
        });
    },
    onPhaseStart: function(e) {
        console.log(['onPhaseStart', e]);
        var name = e.detail.name;
        // A phase can be re-started (e.g. a burn phase in a loop).
        // This ends up clobbering the tracked phases.
        // info *may* be null on phase 1 because ACT hasn't started the encounter yet.
        // The diffing function is smart to this.
        var info = this.getUpdateInfo();
        if (!info && e.detail.phaseIdx != 1) {
            console.error(['Missing info for phase start', e.detail]);
            return;
        }
        // FIXME: Does phase 1 need to set encounter duration to zero to not
        // pick up a previous fight?
        this.trackedPhases[name] = {
            detail: e.detail,
            start: info,
        };
        console.log(['trackedPhases', this.trackedPhases]);
    },
    onPhaseEnd: function(e) {
        console.log(['onPhaseEnd', e]);
        var name = e.detail.name;
        console.assert(this.trackedPhases[name]);
        var phase = this.trackedPhases[name];
        phase.end = this.getUpdateInfo();
        if (!phase.end) {
            console.error(['Missing info for phase end', e.detail]);
            return;
        }

        var diff = this.diffUpdateInfo(phase);
        if (!diff) {
            console.error(['Failed to create diff', phase]);
            return;
        }
        diff.complete = true;

        document.dispatchEvent(new CustomEvent('cactbot.dps', {
            detail: {
                fight: e.detail,
                dps: diff,
                phase: e.detail.name,
            },
        }));

        this.postMessage({
            type: 'onOverlayPhaseUpdate',
            detail: diff,
        });
    },
};

cb.dps.getUpdateInfo = function() {
    if (!act.inCombat()) {
        return null;
    }

    var encounterStr = act.encounterDPSInfo();
    if (!encounterStr) {
        return null;
    }
    var combatantStr = act.combatantDPSInfo();
    if (!combatantStr) {
        return null;
    }
    try {
        var encounter = JSON.parse(encounterStr);
        var combatantList = JSON.parse(combatantStr);
    } catch (e) {
        console.error(['Failed to parse dps json', e, encounterStr, combatantStr]);
        return null;
    }

    // FIXME: Probably need to verify that particular keys are here.

    // Javascript maintains that its objects are unsorted, but overlays
    // assume that the plugin has pre-sorted them, whatever that means.
    // So, insert keys into combatants in the order of encdps descending,
    // and hope this keeps working in the future.  :C
    combatantList.sort(function(a, b) {
        return b.encdps - a.encdps;
    });
    var combatants = {};
    for (var i = 0; i < combatantList.length; ++i) {
        var c = combatantList[i];
        combatants[c.name] = c;
    }

    if (this.currentFightId) {
        encounter.title = this.currentFightId;
        if (this.currentFightAttempt) {
            encounter.title += " (" + this.currentFightAttempt + ")";
        }
    }

    return {
        Encounter: encounter,
        Combatant: combatants,
    };
};

cb.dps.diffUpdateInfo = function(phase) {
    if (!phase.end) {
        console.log(['diffError: no phase end', phase]);
        return;
    }

    // Sometimes a phase will get entered during a slow wipe when nobody
    // attacks, causing a total duration of zero.  Just ignore these.
    if (phase.start) {
        if (phase.start.Encounter.DURATION == phase.end.Encounter.DURATION) {
            console.log(['diffError: zero duration', phase]);
            return;
        }
    }

    var diffProps = function(start, end, props, out) {
        for (var i = 0; i < props.length; ++i) {
            var prop = props[i];
            out[prop] = end[prop] - start[prop];
        }
    };
    var copyProps = function(start, props, out) {
        for (var i = 0; i < props.length; ++i) {
            out[props[i]] = start[props[i]];
        }
    };
    var setDPS = function(duration, encDuration, out) {
        out.dps = Math.floor(100 * out.damage / duration + 50) / 100;
        out.encdps = Math.floor(100 * out.damage / encDuration + 50) / 100;

        out.DPS = Math.floor(out.dps + 0.5);
        out.ENCDPS = Math.floor(out.encdps + 0.5);
    };

    var encounterCopyProps = [
        'title',
    ];
    var encounterDiffProps = [
        'DURATION',
        'damage',
        'hits',
        'misses',
        'crithits',
        'swings',
        'healed',
        'critheals',
        'cures',
        'damagetaken',
        'healstaken',
        'deaths',
    ];
    var combatantCopyProps = [
        'name',
        'Job',
    ];
    var combatantDiffProps = [
        'DURATION',
        'damage',
        'hits',
        'crithits',
        'misses',
        'swings',
        'healed',
        'critheals',
        'heals',
        'cures',
        'damagetaken',
        'healstaken',
        'kills',
        'deaths',
    ];

    var encounter = {};
    if (phase.start) {
        copyProps(phase.start.Encounter, encounterCopyProps, encounter);
        diffProps(phase.start.Encounter, phase.end.Encounter, encounterDiffProps, encounter);
        setDPS(encounter.DURATION, encounter.DURATION, encounter);
    } else {
        copyProps(phase.end.Encounter, encounterCopyProps, encounter);
        copyProps(phase.end.Encounter, encounterDiffProps, encounter);
        setDPS(encounter.DURATION, encounter.DURATION, encounter);
    }

    // Deliberately use end, as combatants aren't initally listed before
    // they've done any damage right when the fight starts.
    var combatant = {};
    for (var name in phase.end.Combatant) {
        var start = phase.start ? phase.start.Combatant[name] : null;
        var end = phase.end.Combatant[name];
        if (!end) {
            continue;
        }
        var c = {};
        copyProps(end, combatantCopyProps, c);
        if (start) {
            diffProps(start, end, combatantDiffProps, c);
        } else {
            // If combatant doesn't exist, assume they start at zero.
            copyProps(end, combatantDiffProps, c);
        }
        setDPS(c.DURATION, encounter.DURATION, c);
        combatant[name] = c;
    }

    return {
        Phase: phase.detail,
        Encounter: encounter,
        Combatant: combatant,
    };
};

window.addEventListener('load', function () {
    cb.util.loadCSS('dps/dps.css');

    var element = document.createElement('div');
    element.classList.add('dpsoverlay');

    // FIXME: figure out how to make this more easily configurable.
    var iframe = document.createElement('iframe');
    iframe.classList.add('hide');
    iframe.src = 'dps/xephero-cactbot.html';
    element.appendChild(iframe);

    var body = document.getElementsByTagName('body')[0];
    body.appendChild(element);

    var defaultGeometry = {
        width: '300px',
        height: '400px',
    };
    cb.dps.initialize(iframe);
    cb.windowManager.add('dps', element, 'dps', defaultGeometry);
    cb.updateRegistrar.register(cb.dps);
});
