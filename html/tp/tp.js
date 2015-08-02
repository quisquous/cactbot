TPViewer = function(element) {
    this.topElement = element;
    // { container, bar, value, name }
    this.players = [];
};
TPViewer.prototype.enterZone = function (zone) {
};
TPViewer.prototype.leaveZone = function (zone) {
};
TPViewer.prototype.filtersZone = function (zone) {
    return true;
};
TPViewer.prototype.tick = function (currentTime) {
    var players = window.act.getCurrentPartyList();
    if (!players) {
        return;
    }
    if (players.length != this.players.length) {
        this.updatePlayerCount(players.length);
    }

    for (var i = 0; i < this.players.length; ++i) {
        this.update(this.players[i]);
    }
};
TPViewer.prototype.processLog = function (log) {
    // Don't bother processing logs without a party.
    if (this.players.length < 1) {
        return;
    }

    // FIXME: filter by log message type.
    var index = log.indexOf("cactbot:tp:");
    if (index == -1) {
        return;
    }

    // Example: cactbot:tp:player number:player name
    var fields = log.substring(index).split(":");
    if (fields.length < 4) {
        cactbot.debug("TP: invalid config: " + log);
        return;
    }
    var playerId = parseInt(fields[2]);
    if (isNaN(playerId) || fields[2] != playerId) {
        cactbot.debug("TP: invalid player id: " + playerId);
        return;
    }
    var name = fields[3];
    if (name == "") {
        return;
    }

    this.players[playerId - 1].name = name;
};
TPViewer.prototype.updatePlayerCount = function(numPlayers) {
    cactbot.debug("Update num players: " + numPlayers);
    while (numPlayers < this.players.length) {
        var last = this.players.pop();
        last.container.parentNode.removeChild(last.container);
    }
    while (numPlayers > this.players.length) {
        var obj = {};

        obj.bar = document.createElement("div");
        obj.bar.classList.add("tpbar");
        obj.bar.classList.add("normal");

        obj.value = document.createElement("div");
        obj.value.classList.add("tpvalue")

        obj.container = document.createElement("div");
        obj.container.classList.add("tpcontainer");
        obj.container.appendChild(obj.bar);
        obj.container.appendChild(obj.value);
        this.topElement.appendChild(obj.container);

        this.players.push(obj);
    }

    // If number of players has changed, then suddenly the party list order is
    // unknown.  Clear all ids.
    for (var i = 0; i < this.players.length; ++i) {
        this.players[i].id = null;
        this.clearPlayer(this.players[i]);
    }
};
TPViewer.prototype.clearPlayer = function(player) {
    player.bar.style.width = "0%";
    player.value.innerText = "???";
};
TPViewer.prototype.update = function (player) {
    if (!player.name) {
        // Should be already cleared.
        return;
    }
    var c = window.act.getPlayerByName(player.name);
    if (!c) {
        // Player doesn't exist or is not in zone, so act confused.
        this.clearPlayer(player);
        return;
    }

    var percent = c.currentTP / c.maxTP;
    player.bar.style.width = (100 * percent) + "%";
    player.value.innerText = c.currentTP;

    if (c.currentTP < 300) {
        player.bar.classList.remove("normal", "warning");
        player.bar.classList.add("critical");
    } else if (c.currentTP < 500) {
        player.bar.classList.remove("normal", "critical");
        player.bar.classList.add("warning");
    } else {
        player.bar.classList.remove("warning", "critical");
        player.bar.classList.add("normal");
    }
};

window.addEventListener("load", function () {
    loadCSS("tp/tp.css");

    var element = document.createElement("div");
    var playerContainer = document.createElement("div");
    playerContainer.classList.add("tpviewer");
    element.appendChild(playerContainer);

    var body = document.getElementsByTagName("body")[0];
    body.appendChild(element);

    var defaultGeometry = {
        width: "340px",
        height: "420px",
    };
    window.windowManager.add("tp", element, "tp", defaultGeometry);
    window.updateRegistrar.register(new TPViewer(playerContainer));
});