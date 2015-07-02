window.addEventListener("load", function () {
    var element = document.createElement("div");
    var body = document.getElementsByTagName("body")[0];
    body.appendChild(element);
    
    window.windowManager.add("debug", element, "console");
});