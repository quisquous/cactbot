window.addEventListener("load", function () {
    var element = document.createElement("div");
    var body = document.getElementsByTagName("body")[0];
    body.appendChild(element);

    var defaultGeometry = {
        width: "500px",
        height: "100px",
    };
    
    window.windowManager.add("debug", element, "console", defaultGeometry);
});