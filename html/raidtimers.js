function loadCSS(filename) {
    var link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("type", "text/css");
    link.setAttribute("href", filename);

    var head = document.getElementsByTagName("head")[0];
    head.appendChild(link)
}

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
var updateRegistrar = new UpdateRegistrar();

var WindowManager = function () {
    this.windows = [];
};
WindowManager.prototype.add = function (name, element, title, geometry) {
    this.windows[name] = {
        name: name,
        element: element,
    };
    this.loadLayout(name, element, geometry);

    element.classList.add("cactbotwindow");

    // Add title for layout mode.
    var titleDiv = document.createElement("div");
    titleDiv.classList.add("cactbotwindowname");
    var titleText = document.createElement("div");
    titleText.innerHTML = title;
    titleDiv.appendChild(titleText);
    element.appendChild(titleDiv);

    $(element).draggable({ disabled: true });
    $(element).resizable({ handles: 'all', disabled: true});
};
WindowManager.prototype.remove = function (name) {
    delete this.windows[name];
};
WindowManager.prototype.enableLayoutMode = function () {
    for (var name in this.windows) {
        var element = this.windows[name].element;
        element.classList.add("layoutmode");
    }
    $(".cactbotwindow").draggable("enable");
    $(".cactbotwindow").resizable("enable");
};
WindowManager.prototype.disableLayoutMode = function () {
    for (var name in this.windows) {
        this.windows[name].element.classList.remove("layoutmode");
        this.saveLayout(name, this.windows[name].element);
    }
    $(".cactbotwindow").draggable("disable");
    $(".cactbotwindow").resizable("disable");
};
WindowManager.prototype.storageKey = function (name) {
    return "geom." + name;
};

WindowManager.prototype.saveLayout = function (name, element) {
    var info = {
        top: element.style.top,
        left: element.style.left,
        width: element.style.width,
        height: element.style.height,
    };
    window.localStorage.setItem(this.storageKey(name), JSON.stringify(info));
};
WindowManager.prototype.loadLayout = function (name, element, geometry) {
    var infoStr = window.localStorage.getItem(this.storageKey(name));
    if (!infoStr) {
        for (var key in geometry) {
            console.assert(geometry.hasOwnProperty(key));
            element.style[key] = geometry[key];
        }
        return;
    }
    var info = JSON.parse(infoStr);
    element.style.top = info.top;
    element.style.left = info.left;
    element.style.width = info.width;
    element.style.height = info.height;
};

var windowManager = new WindowManager();
window.enableLayoutMode = function () {
    windowManager.enableLayoutMode();
}
window.disableLayoutMode = function () {
    windowManager.disableLayoutMode();
}

function rafLoop() {
    if (!window.act) {
        window.requestAnimationFrame(rafLoop);
        return;
    }
    window.act.updateCombatants();

    var currentTime = new Date();

    updateRegistrar.tick(currentTime);

    window.requestAnimationFrame(rafLoop);

}

window.requestAnimationFrame(rafLoop);
