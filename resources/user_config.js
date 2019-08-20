'use strict';

let UserConfig = {
  getUserConfigLocation: function(overlayName, callback) {
    let configLoader = (e) => {
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

        // This is a bit awkward to handle skin settings here, but
        // doing it after user config files and before user css files
        // allows user css to override skin-specific css as well.
        this.handleSkin(Options.Skin);

        if (cssFile in localFiles) {
          let userCssText = document.createElement('style');
          userCssText.innerText = localFiles[cssFile];
          document.getElementsByTagName('head')[0].appendChild(userCssText);
        }
      } else if (basePath) {
        if (basePath.slice(-1) != '/')
          basePath += '/';
        this.appendJSLink(basePath + jsFile);

        // See note above in localFiles case about skin load ordering.
        this.handleSkin(Options.Skin);

        this.appendCSSLink(basePath + cssFile);
      }

      // Post this callback so that the js and css can be executed first.
      if (Options.Language && Options.Language in this.languageFuncs)
        this.languageFuncs[Options.Language]();
      if (callback)
        callback();

      callOverlayHandler({ call: 'cactbotRequestState' });
    };

    callOverlayHandler({
      call: 'cactbotLoadUser',
      source: location.href,
    }).then(configLoader);
  },
  registerLanguage: function(lang, func) {
    this.languageFuncs[lang] = func;
  },
  languageFuncs: {},
  handleSkin: function(skinName) {
    if (!skinName || skinName == 'default')
      return;

    let basePath = document.location.toString();
    let slashIdx = basePath.lastIndexOf('/');
    if (slashIdx != -1)
      basePath = basePath.substr(0, slashIdx);
    if (basePath.slice(-1) != '/')
      basePath += '/';
    let skinHref = basePath + 'skins/' + skinName + '/' + skinName + '.css';
    this.appendCSSLink(skinHref);
  },
  appendJSLink: function(src) {
    let userJS = document.createElement('script');
    userJS.setAttribute('type', 'text/javascript');
    userJS.setAttribute('src', src);
    userJS.setAttribute('async', false);
    document.getElementsByTagName('head')[0].appendChild(userJS);
  },
  appendCSSLink: function(href) {
    let userCSS = document.createElement('link');
    userCSS.setAttribute('rel', 'stylesheet');
    userCSS.setAttribute('type', 'text/css');
    userCSS.setAttribute('href', href);
    document.getElementsByTagName('head')[0].appendChild(userCSS);
  },
};
