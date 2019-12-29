'use strict';

let UserConfig = {
  optionTemplates: {},
  savedConfig: null,
  registerOptions: function(overlayName, optionTemplates) {
    this.optionTemplates[overlayName] = optionTemplates;
  },
  getUserConfigLocation: function(overlayName, callback) {
    window.addOverlayListener('onUserFileChanged', () => {
      window.location.reload();
    });
    window.addOverlayListener('onForceReload', () => {
      window.location.reload();
    });

    let readOptions = callOverlayHandler({
      call: 'cactbotLoadData',
      overlay: 'options',
    });

    callOverlayHandler({
      call: 'cactbotLoadUser',
      source: location.href,
    }).then(async (e) => {
      let localFiles = e.detail.localUserFiles;
      let basePath = e.detail.userLocation;
      let jsFile = overlayName + '.js';
      let cssFile = overlayName + '.css';

      // The plugin auto-detects the language, so set this first.
      // If options files want to override it, they can for testing.
      if (e.detail.language)
        Options.Language = e.detail.language;

      // Handle processOptions after default language selection above,
      // but before css below which may load skin files.
      this.savedConfig = (await readOptions).data;
      this.processOptions(
          Options,
          this.savedConfig[overlayName],
          this.optionTemplates[overlayName],
      );

      // In cases where the user files are local but the overlay url
      // is remote, local files needed to be read by the plugin and
      // passed to Javascript for Chrome security reasons.
      if (localFiles) {
        if (jsFile in localFiles) {
          try {
            eval(localFiles[jsFile]);
          } catch (e) {
            // Be very visible for users.
            console.log('*** ERROR IN USER FILE ***');
            console.log(e.stack);
          }
        }

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
    });
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
  processOptions: function(options, savedConfig, template) {
    // If for some reason this overlay has no options saved yet,
    // then there will be nothing in the config.
    if (!savedConfig)
      return;

    // Take options from the template, find them in savedConfig,
    // and apply them to options. This also handles setting
    // defaults for anything in the template, even if it does not
    // exist in savedConfig.
    if (Array.isArray(template)) {
      for (let i = 0; i < template.length; ++i)
        this.processOptions(options, savedConfig, template[i]);
      return;
    }

    // Not all overlays have option templates.
    if (!template)
      return;

    let templateOptions = template.options || [];
    for (let i = 0; i < templateOptions.length; ++i) {
      let opt = templateOptions[i];

      // Grab the saved value or the default to set in options.
      let value = opt.id in savedConfig ? savedConfig[opt.id] : opt.default;

      // Options can provide custom logic to turn a value into options settings.
      // If this doesn't exist, just set the value directly.
      // Option template ids are identical to field names on Options.
      if (opt.setterFunc)
        opt.setterFunc(options, value);
      else
        options[opt.id] = value;
    }

    // For things like raidboss that build extra UI, also give them a chance
    // to handle anything that has been set on that UI.
    if (template.processExtraOptions)
      template.processExtraOptions(options, savedConfig);
  },
};
