(function () {
    window.loadCSS("debug/debug.css");

    var console = document.createElement("div");
    window.addEventListener("load", function () {
        var body = document.getElementsByTagName("body")[0];
        body.appendChild(console);

        var defaultGeometry = {
            width: "500px",
            height: "100px",
        };
        window.windowManager.add("debug", console, "console", defaultGeometry);
    });

    // FIXME: maybe make this relative to how big the window is?
    var maxLogEntries = 50;
    window.cactbot.debug = function (text) {
        window.console.log(text);

        var logLine = document.createElement("div");
        logLine.classList.add("cactbotlog");

        var dateDiv = document.createElement("div");
        logLine.appendChild(dateDiv);
        dateDiv.classList.add("cactbotlogdate");
        var currentTime = new Date();
        var hours = "" + currentTime.getHours();
        if (hours.length === 1) {
            hours = "0" + hours;
        }
        var minutes = "" + currentTime.getMinutes();
        if (minutes.length === 1) {
            minutes = "0" + minutes;
        }
        dateDiv.innerText = hours + ":" + minutes;

        var textDiv = document.createElement("div");
        logLine.appendChild(textDiv);
        textDiv.classList.add("cactbotlogtext");
        textDiv.innerHTML = text;

        console.insertBefore(logLine, console.firstChild);

        for (var i = 0; i < console.childNodes.length; ++i) {
            if (i < maxLogEntries) {
                continue;
            }
            console.removeChild(console.childNodes[i]);
        }
    }
})();