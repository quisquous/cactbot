DPSOverlayBridge = function(iframe) {
    this.iframe = iframe;
};
DPSOverlayBridge.prototype.enterZone = function (zone) {};
DPSOverlayBridge.prototype.leaveZone = function (zone) {
    this.iframe.classList.add("hide");
};
DPSOverlayBridge.prototype.filtersZone = function (zone) {
    return true;
};
DPSOverlayBridge.prototype.throttleTickMs = 1000;
DPSOverlayBridge.prototype.tick = function (currentTime) {
    if (!act.inCombat()) {
        return;
    }

    var encounterStr = act.encounterDPSInfo();
    if (!encounterStr) {
        return;
    }
    var combatantStr = act.combatantDPSInfo();
    if (!combatantStr) {
        return;
    }
    try {
        var encounter = JSON.parse(encounterStr);
        var combatantList = JSON.parse(combatantStr);
    } catch (e) {
        console.error(["Failed to parse dps json", e, encounterStr, combatantStr]);
        return;
    }

    // Javascript maintains that its objects are unsorted, but overlays
    // assume that the plugin has pre-sorted them, whatever that means.
    // So, insert keys into combatants in the order of ENCDPS descending,
    // and hope this keeps working in the future.  :C
    combatantList.sort(function(a, b) {
        return b.ENCDPS - a.ENCDPS;
    });
    var combatants = {};
    for (var i = 0; i < combatantList.length; ++i) {
        var c = combatantList[i];
        combatants[c.name] = c;
    }

    var actUpdate = {
        type: 'onOverlayDataUpdate',
        detail: {
            Encounter: encounter,
            Combatant: combatants,
        },
    };
    this.iframe.contentWindow.postMessage(actUpdate, "*");

    this.iframe.classList.remove("hide");
};

window.addEventListener("load", function () {
    loadCSS("dps/dps.css");

    var element = document.createElement("div");
    element.classList.add("dpsoverlay");

    // FIXME: figure out how to make this more easily configurable.
    var iframe = document.createElement("iframe");
    iframe.classList.add("hide");
    iframe.src = "third_party/OverlayPlugin-themes/xephero.html";
    element.appendChild(iframe);

    var body = document.getElementsByTagName("body")[0];
    body.appendChild(element);

    var defaultGeometry = {
        width: "300px",
        height: "400px",
    };
    window.windowManager.add("dps", element, "dps", defaultGeometry);
    window.updateRegistrar.register(new DPSOverlayBridge(iframe));
});