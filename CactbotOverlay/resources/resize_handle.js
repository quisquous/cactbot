document.addEventListener("onOverlayStateUpdate", function (e) {
	console.log(e.detail.isLocked);
	if (!e.detail.isLocked) {
		document.documentElement.classList.add("resizeHandle");
	} else {
		document.documentElement.classList.remove("resizeHandle");
	}
});
