// gt.bell.nodes comes from http://www.garlandtools.org/bell/nodes.js
gt = window.gt || {};
gt.bell = window.gt.bell || {};

cb.gathering = {
    nodesByZone: {},
};
cb.gathering.updateCactbotNodes = function() {
    var cacNodes = cb.gathering.nodesByZone;
    for (var i = 0; i < gt.bell.nodes.length; ++i) {
        var node = gt.bell.nodes[i];
        if (!cacNodes[node.zone]) {
            cacNodes[node.zone] = [];
        }
        cacNodes[node.zone].push(node);
    }
}

cb.gathering.nodeViewer = {
    nodes: cb.gathering.nodesByZone,
    currentNodes: [],
    throttleTickMs: 1000,

    initialize: function(element) {
        this.topElement = element;
    },
    leaveZone: function() {
        this.topElement.innerHTML = '';
        this.currentNodes = [];
    },
    filtersZone: function(zone) {
        return this.nodes[zone];
    },
};

cb.gathering.nodeViewer.enterZone = function (zone) {
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
        var coords = '(' + node.coords[0] + ', ' + node.coords[1] + ')';
        location.innerText = coords + ' ' + node.area;
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
                summaryText += ', ';
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

cb.gathering.nodeViewer.tick = function (currentTime) {
    var player = act.getPlayer();
    if (!player) {
        this.topElement.classList.add('hide');
        return;
    }
    var job = cb.util.jobIdToName[player.job];
    if (job != 'btn' && job != 'min') {
        this.topElement.classList.add('hide');
        return;
    }
    this.topElement.classList.remove('hide');

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
            startTime = cb.time.nextTime(eorzeaTime, node.time);
            this.currentNodes[i].startTime = startTime;
            changed = true;
        }
        if (!endTime || endTime.getTime() < eorzeaTime.getTime()) {
            endTime = cb.time.nextTime(eorzeaTime, node.time, node.uptime);
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
            node.element.classList.add('open');
        } else {
            node.element.classList.remove('open');
        }
        if (i == 0) {
            node.element.classList.add('first');
        } else {
            node.element.classList.remove('first');
        }
    }
};

window.addEventListener('load', function () {
    cb.util.loadCSS('gathering/gathering.css');

    cb.gathering.updateCactbotNodes();

    var element = document.createElement('div');
    var nodeContainer = document.createElement('div');
    nodeContainer.classList.add('NodeViewer');
    element.appendChild(nodeContainer);

    var body = document.getElementsByTagName('body')[0];
    body.appendChild(element);

    var defaultGeometry = {
        width: '500px',
        height: '300px',
    };
    cb.windowManager.add('gathering', element, 'gathering', defaultGeometry);
    cb.gathering.nodeViewer.initialize(nodeContainer);
    cb.updateRegistrar.register(cb.gathering.nodeViewer);
});