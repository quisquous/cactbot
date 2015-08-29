cb.hunts = window.cb.hunts || {};
cb.hunts = {
    currentHunts: [],
    throttleTickMs: 1000,
    initialize: function(windowElement) {
        this.huntListElement = windowElement.getElementsByClassName("huntlist")[0];
        this.leaveZone();
    },
    leaveZone: function(zone) {
        // FIXME: maybe remember these in case of death?
        this.currentHunts = [];
        this.huntListElement.innerHTML = '';
    },
    filtersZone: function(zone) {
        return cb.huntList[zone];
    },
};

cb.hunts.enterZone = function (zone) {
    this.currentHunts = [];
    this.huntListElement.innerHTML = '';
    var mobs = cb.huntList[zone];
    for (var i = 0; i < mobs.length; ++i) {
        var mob = mobs[i];
        var element = document.createElement("div");
        this.huntListElement.appendChild(element);
        var hunt = {
            name: mob.name,
            rank: mob.rank,
            lastSeen: null,
            lastPos: null,
            distance: null,
            element: element,
        };
        this.currentHunts.push(hunt);
    }
};

cb.hunts.tick = function (currentTime) {
    var minYalms = 20;
    var minSecondsToDisplay = 10;
    var maxSeconds = 300;
    var minZYalms = 30;

    var player = window.act.getPlayer();
    var changedAnything = false;

    if (!player) {
        return;
    }

    for (var i = 0; i < this.currentHunts.length; ++i) {
        var hunt = this.currentHunts[i];
        var combatant = window.act.getMobByName(hunt.name, 0);
        if (!combatant && !hunt.lastSeen) {
            continue;
        }

        var hpPercent = 100;
        var seconds = 0;
        if (combatant) {
            hunt.lastSeen = currentTime;
            hunt.lastPos = [combatant.posX, combatant.posY, combatant.posZ];
            hpPercent = Math.ceil(100 * combatant.currentHP / combatant.maxHP);
            if (hpPercent == 0) {
                hunt.lastPos = null;
                hunt.lastSeen = null;
                hunt.distance = null;
                hunt.element.innerHTML = '';
                changedAnything = true;
                continue;
            }
        } else {
            seconds = (currentTime.getTime() - hunt.lastSeen.getTime()) / 1000;
            if (seconds > maxSeconds) {
                hunt.lastPos = null;
                hunt.lastSeen = null;
                hunt.distance = null;
                hunt.element.innerHTML = '';
                changedAnything = true;
                continue;
            }
        }

        // Example output:
        // A Hunt [A] 50 yalms S
        // Some Hunt [B] 220 yalms NW (3m old)
        // That Hunt [S] 40 yalms NNW, 22 up (55%)

        var diffX = player.posX - hunt.lastPos[0];
        var diffY = player.posY - hunt.lastPos[1];
        var diffZ = player.posZ - hunt.lastPos[2];
        hunt.distance = Math.sqrt(diffX * diffX + diffY * diffY);

        var mobText = hunt.name + ' [' + hunt.rank + ']';
        var absDiffZ = Math.abs(diffZ);
        if (hunt.distance > minYalms || absDiffZ > minZYalms) {
            var dirArr = ['S', 'SSE', 'SE', 'ESE', 'E', 'ENE', 'NE', 'NNE', 'N', 'NNW', 'NW', 'WNW', 'W', 'WSW', 'SW', 'SSW', 'S'];
            var dir = dirArr[Math.round(Math.atan2(diffX, diffY) / 0.392699082) + 8];
            mobText += ' ' + Math.floor(hunt.distance) + ' yalms ' + dir;
            if (absDiffZ > minZYalms) {
                mobText += (diffZ < 0 ? ' &uArr;' : ' &dArr;');
            } else {
                mobText += ' &hArr;';
            }
        }
        if (seconds > minSecondsToDisplay) {
            var minutes = Math.floor(seconds / 60);
            if (minutes === 0) {
                mobText += ' (<1m stale)';
            } else {
                mobText += ' (' + minutes + 'm stale)';
            }
        } else if (seconds === 0) {
            mobText += ' (' + hpPercent + '%)';
        }

        // Use innerHTML instead of text because of HTML entities above.
        if (hunt.element.innerHTML !== mobText) {
            hunt.element.innerHTML = mobText;
            changedAnything = true;
        }
    }

    if (!changedAnything) {
        return;
    }

    this.currentHunts.sort(function (a, b) {
        if (a.distance === b.distance) {
            return 0;
        }
        if (a.distance === null) {
            return 1;
        }
        if (b.distance === null) {
            return -1;
        }
        return a.distance - b.distance;
    });

    for (var i = 0; i < this.currentHunts.length; ++i) {
        this.currentHunts[i].element.style.order = i;
    }
};

window.addEventListener("load", function () {
    // FIXME: this should happen automatically via cactbot.
    cb.util.loadCSS("hunts/hunts.css");

    var element = document.createElement("div");
    element.innerHTML = '<div id="huntwindow"><div class="huntlist"></div></div>';

    var body = document.getElementsByTagName("body")[0];
    body.appendChild(element);

    var defaultGeometry = {
        width: "400px",
        height: "100px",
    };

    cb.hunts.initialize(element);
    cb.windowManager.add("hunts", element, "hunts", defaultGeometry);
    cb.updateRegistrar.register(cb.hunts);
});