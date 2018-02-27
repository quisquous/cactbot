var UserConfig = {
  getUserConfigLocation: function(overlayName, callback) {
    document.addEventListener("onInitializeOverlay", function(e) {
      var basePath = e.detail.userLocation;
      if (basePath) {
        if (basePath.slice(-1) != '/')
          basePath += '/';
        var userJS = document.createElement('script');
        userJS.setAttribute('type', 'text/javascript');
        userJS.setAttribute('src', basePath + overlayName + '.js');
        document.getElementsByTagName('head')[0].appendChild(userJS);

        var userCSS = document.createElement('link');
        userCSS.setAttribute('rel', 'stylesheet');
        userCSS.setAttribute('type', 'text/css');
        userCSS.setAttribute('href', basePath + overlayName + '.css');
        document.getElementsByTagName('head')[0].appendChild(userCSS);
      }

      // Post this callback so that the js and css can be executed first.
      if (callback) {
        window.setTimeout(callback, 0);
      }
    });
  },
};