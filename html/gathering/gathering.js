cactbot.nodes = {};
cactbot.nodes.nodesByZone = {};

// gt.bell.nodes comes from http://www.garlandtools.org/bell/nodes.js
// gt.time comes from http://www.garlandtools.org/bell/gt.bell.js
// Author kindly said "use this however you'd like"
gt = {};
gt.bell = {};
gt.time = {
	epochTimeFactor: 20.571428571428573, // 60 * 24 Eorzean minutes (one day) per 70 real-world minutes.
	millisecondsPerEorzeaMinute: (2 + 11/12) * 1000,
	millisecondsPerDay: 24 * 60 * 60 * 1000,
	hours: {hour: '2-digit'},
	hoursMinutes: {hour: '2-digit', minute: '2-digit'},
	hoursMinutesUTC: {hour: '2-digit', minute: '2-digit', timeZone: 'UTC'},
	hoursMinutesSeconds: {hour: '2-digit', minute: '2-digit', second: '2-digit'},
	monthDay: {month: 'numeric', day: 'numeric'},

	localToEorzea: function(date) {
		return new Date(date.getTime() * gt.time.epochTimeFactor);
	},

	eorzeaToLocal: function(date) {
		return new Date(date.getTime() / gt.time.epochTimeFactor);
	},

	formatCountdown: function(end) {
		var remainingSeconds = (end.getTime() - (new Date()).getTime()) / 1000;
		if (remainingSeconds <= 0)
			return '0:00';

		return gt.time.formatHoursMinutesSeconds(remainingSeconds);
	},

	formatHoursMinutesSeconds: function(totalSeconds) {
		var hours = Math.floor(totalSeconds / 3600);
		var minutes = Math.floor((totalSeconds % 3600) / 60);
		var seconds = Math.floor((totalSeconds % 3600) % 60);

		if (hours)
			return hours + ':' + gt.util.zeroPad(minutes, 2) + ':' + gt.util.zeroPad(seconds, 2);
		else
			return minutes + ':' + gt.util.zeroPad(seconds, 2);
	}
};
gt.util = {
    zeroPad: function(val) {
        if (val < 10)
            return "0" + val;
        return val;
    }
};

function updateCactbotNodes() {
    var cacNodes = cactbot.nodes.nodesByZone;
    for (var i = 0; i < gt.bell.nodes.length; ++i) {
        var node = gt.bell.nodes[i];
        if (!cacNodes[node.zone]) {
            cacNodes[node.zone] = [];
        }
        cacNodes[node.zone].push(node);
    }
}

NodeViewer = function(element) {
    this.topElement = element;
    this.nodes = cactbot.nodes.nodesByZone;
    this.currentNodes = [];
    this.lastTick = null;
};
NodeViewer.prototype.enterZone = function (zone) {
    if (!this.nodes[zone]) {
        return;
    }
    this.currentNodes = this.nodes[zone].map((function(node) {
        var element = document.createElement('div');
        element.classList.add('node');
        this.topElement.appendChild(element);

        var details = document.createElement('div');
        details.classList.add('details');
        element.appendChild(details);

        var location = document.createElement('div');
        location.classList.add('location');
        var coords = "(" + node.coords[0] + ", " + node.coords[1] + ")";
        location.innerText = coords + " " + node.area;
        details.appendChild(location);

        for (var i = 0; i < node.items.length; ++i) {
            var item = document.createElement('div');
            item.classList.add('item');
            var slot = node.items[i].slot;
            item.innerText = '';
            if (slot && slot != '?') {
                item.innerText = '[' + node.items[i].slot + '] ';
            }
            item.innerText += node.items[i].item;
            details.appendChild(item);
        }

        var summary = document.createElement('div');
        summary.classList.add('summary');
        element.appendChild(summary);
        var summaryText = '';
        for (var i = 0; i < node.items.length; ++i) {
            summaryText += node.items[i].item;
            if (i != node.items.length - 1) {
                summaryText += ", ";
            }
        }
        summary.innerText = summaryText;

        var countdown = document.createElement('div');
        countdown.classList.add('countdown');
        element.appendChild(countdown);

        return {
            node: node,
            element: element,
            countdown: countdown,
        };
    }).bind(this));
};
NodeViewer.prototype.leaveZone = function (zone) {
    this.topElement.innerHTML = "";
    this.currentNodes = [];
};
NodeViewer.prototype.filtersZone = function (zone) {
    return this.nodes[zone];
};
NodeViewer.prototype.throttleTickMs = 1000;
NodeViewer.prototype.tick = function (currentTime) {
    var player = act.getPlayer();
    if (!player) {
        return;
    }
    var job = cb.util.jobIdToName[player.job];
    if (job != 'btn' && job != 'min') {
        this.topElement.classList.add('hide');
        return;
    }
    this.topElement.classList.remove('hide');

    var twentyFourHours = 1000 * 60 * 60 * 24;
    var nextTime = function(hours, eorzeaTime) {
        var least = null;
        for (var i = 0; i < hours.length; ++i) {
            var date = new Date(eorzeaTime);
            date.setUTCHours(hours[i]);
            date.setUTCMinutes(0);
            date.setTime(date.getTime() - twentyFourHours);
            while (date.getTime() < eorzeaTime.getTime()) {
                date.setTime(date.getTime() + twentyFourHours);
            }
            console.assert(date.getTime() >= eorzeaTime.getTime());
            if (!least || least.getTime() > date.getTime()) {
                least = date;
            }
        }
        console.assert(least.getTime() >= eorzeaTime.getTime());
        return least;
    }

    if (!this.currentNodes.length) {
        return;
    }

    var eorzeaTime = gt.time.localToEorzea(currentTime);

    var changed = false;
    for (var i = 0; i < this.currentNodes.length; ++i) {
        var node = this.currentNodes[i].node;
        var countdown = this.currentNodes[i].countdown;
        var startTime = this.currentNodes[i].startTime;
        var endTime = this.currentNodes[i].endTime;

        if (!startTime || startTime.getTime() < eorzeaTime.getTime()) {
            startTime = nextTime(node.time, eorzeaTime);
            this.currentNodes[i].startTime = startTime;
            changed = true;
        }
        if (!endTime || endTime.getTime() < eorzeaTime.getTime()) {
            var uptimeMs = node.uptime * 1000 * 60;
            endTime = new Date(startTime);
            endTime.setTime(endTime.getTime() + uptimeMs);

            // Node may already be open.
            var alreadyOpenTime = new Date(endTime);
            alreadyOpenTime.setTime(alreadyOpenTime.getTime() - twentyFourHours);
            if (alreadyOpenTime.getTime() > eorzeaTime.getTime()) {
                endTime = alreadyOpenTime;
            }

            this.currentNodes[i].endTime = endTime;
            changed = true;
        }
        var time = gt.time.eorzeaToLocal(startTime.getTime() > endTime.getTime() ? endTime : startTime)
        var formatted = gt.time.formatCountdown(time);
        if (countdown.innerText != formatted) {
            countdown.innerText = formatted;
        }
    }

    if (!changed) {
        return;
    }

    this.currentNodes.sort(function (a, b) {
        // Open nodes (by end time), then closed nodes (by start time).
        var aIsOpen = a.endTime.getTime() < a.startTime.getTime();
        var bIsOpen = b.endTime.getTime() < b.startTime.getTime();
        if (aIsOpen && !bIsOpen) {
            return -1;
        }
        if (bIsOpen && !aIsOpen) {
            return 1;
        }
        if (aIsOpen && bIsOpen) {
            return a.endTime.getTime() - b.endTime.getTime();
        }
        return a.startTime.getTime() - b.startTime.getTime();
    });
    for (var i = 0; i < this.currentNodes.length; ++i) {
        var node = this.currentNodes[i];
        node.element.style.order = i;
        if (node.endTime.getTime() < node.startTime.getTime()) {
            node.element.classList.add("open");
        } else {
            node.element.classList.remove("open");
        }
        if (i == 0) {
            node.element.classList.add("first");
        } else {
            node.element.classList.remove("first");
        }
    }
};
NodeViewer.prototype.processLog = function (log) {};

window.addEventListener("load", function () {
    loadCSS("gathering/gathering.css");

    updateCactbotNodes();

    var element = document.createElement("div");
    var nodeContainer = document.createElement("div");
    nodeContainer.classList.add("NodeViewer");
    element.appendChild(nodeContainer);

    var body = document.getElementsByTagName("body")[0];
    body.appendChild(element);

    var defaultGeometry = {
        width: "500px",
        height: "300px",
    };
    window.windowManager.add("gathering", element, "gathering", defaultGeometry);
    window.updateRegistrar.register(new NodeViewer(nodeContainer));
});