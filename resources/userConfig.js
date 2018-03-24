var UserConfig = {
  getUserConfigLocation: function(overlayName, callback) {
    document.addEventListener("onInitializeOverlay", (function(e) {
      var localFiles = e.detail.localUserFiles;
      var basePath = e.detail.userLocation;
      var jsFile = overlayName + '.js';
      var cssFile = overlayName + '.css';

      // In cases where the user files are local but the overlay url
      // is remote, local files needed to be read by the plugin and
      // passed to Javascript for Chrome security reasons.
      if (localFiles) {
        if (jsFile in localFiles) {
          eval(localFiles[jsFile]);
        }
        if (cssFile in localFiles) {
          var userCssText = document.createElement('style');
          userCssText.innerText = localFiles[cssFile];
          document.getElementsByTagName('head')[0].appendChild(userCssText);
        }
      } else if (basePath) {
        if (basePath.slice(-1) != '/')
          basePath += '/';
        var userJS = document.createElement('script');
        userJS.setAttribute('type', 'text/javascript');
        userJS.setAttribute('src', basePath + jsFile);
        document.getElementsByTagName('head')[0].appendChild(userJS);

        var userCSS = document.createElement('link');
        userCSS.setAttribute('rel', 'stylesheet');
        userCSS.setAttribute('type', 'text/css');
        userCSS.setAttribute('href', basePath + cssFile);
        document.getElementsByTagName('head')[0].appendChild(userCSS);
      }

      // Post this callback so that the js and css can be executed first.
      window.setTimeout((function() {
        if (Options.Language && Options.Language in this.languageFuncs)
          this.languageFuncs[Options.Language]();
        if (callback)
          callback();
      }).bind(this), 0);
    }).bind(this));
  },
  registerLanguage: function(lang, func) {
    this.languageFuncs[lang] = func;
  },
  languageFuncs: {},
};