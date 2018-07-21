'use strict';

let UserConfig = {
  getUserConfigLocation: function(overlayName, callback) {
    document.addEventListener('onInitializeOverlay', (function(e) {
      let localFiles = e.detail.localUserFiles;
      let basePath = e.detail.userLocation;
      let jsFile = overlayName + '.js';
      let cssFile = overlayName + '.css';

      // The plugin auto-detects the language, so set this first.
      // If options files want to override it, they can for testing.
      if (e.detail.language)
        Options.Language = e.detail.language;

      // In cases where the user files are local but the overlay url
      // is remote, local files needed to be read by the plugin and
      // passed to Javascript for Chrome security reasons.
      if (localFiles) {
        if (jsFile in localFiles)
          eval(localFiles[jsFile]);

        if (cssFile in localFiles) {
          let userCssText = document.createElement('style');
          userCssText.innerText = localFiles[cssFile];
          document.getElementsByTagName('head')[0].appendChild(userCssText);
        }
      } else if (basePath) {
        if (basePath.slice(-1) != '/')
          basePath += '/';
        let userJS = document.createElement('script');
        userJS.setAttribute('type', 'text/javascript');
        userJS.setAttribute('src', basePath + jsFile);
        document.getElementsByTagName('head')[0].appendChild(userJS);

        let userCSS = document.createElement('link');
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
