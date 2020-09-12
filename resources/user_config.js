'use strict';

let UserConfig = {
  optionTemplates: {},
  savedConfig: null,
  registerOptions: function(overlayName, optionTemplates) {
    this.optionTemplates[overlayName] = optionTemplates;
  },

  getUserConfigLocation: function(overlayName, callback) {
    let currentlyReloading = false;
    let reloadOnce = () => {
      if (currentlyReloading)
        return;
      currentlyReloading = true;
      window.location.reload();
    };

    window.addOverlayListener('onUserFileChanged', () => {
      reloadOnce();
    });
    window.addOverlayListener('onForceReload', () => {
      reloadOnce();
    });

    let readOptions = callOverlayHandler({
      call: 'cactbotLoadData',
      overlay: 'options',
    });

    const loadUser = async (e) => {
      let localFiles = e.detail.localUserFiles;
      let basePath = e.detail.userLocation;
      let jsFile = overlayName + '.js';
      let cssFile = overlayName + '.css';

      // The plugin auto-detects the language, so set this first.
      // If options files want to override it, they can for testing.

      // Backward compatibility (language is now separated to three types.)
      if (e.detail.language) {
        Options.ParserLanguage = e.detail.language;
        Options.ShortLocale = e.detail.language;
        Options.DisplayLanguage = e.detail.language;
      }
      // Parser Language
      if (e.detail.parserLanguage) {
        Options.ParserLanguage = e.detail.parserLanguage;
        // Backward compatibility, everything "Language" should be changed to "ParserLanguage"
        Options.Language = e.detail.parserLanguage;
      }
      const supportedLanguage = ['en', 'de', 'fr', 'ja', 'cn', 'ko'];
      // System Language
      if (e.detail.systemLocale) {
        Options.SystemLocale = e.detail.systemLocale;
        Options.ShortLocale = e.detail.systemLocale.substring(0, 2);
        if (Options.ShortLocale == 'zh')
          Options.ShortLocale = 'cn';
        if (!supportedLanguage.includes(Options.ShortLocale))
          Options.ShortLocale = Options.ParserLanguage;
      }
      // User's setting Language
      Options.DisplayLanguage = e.detail.displayLanguage;
      if (!supportedLanguage.includes(Options.DisplayLanguage))
        Options.DisplayLanguage = Options.ParserLanguage || 'en';

      this.addUnlockText(Options.DisplayLanguage);

      // Handle processOptions after default language selection above,
      // but before css below which may load skin files.
      // processOptions needs to be called whether or not there are
      // any userOptions saved, as it sets up the defaults.
      let userOptions = await readOptions || {};
      this.savedConfig = userOptions.data || {};
      this.processOptions(
          Options,
          this.savedConfig[overlayName] || {},
          this.optionTemplates[overlayName],
      );

      // If the overlay has a "Debug" setting, set to true via the config tool,
      // then also print out user files that have been loaded.
      let printUserFile = Options.Debug ? (x) => console.log(x) : (x) => {};

      // In cases where the user files are local but the overlay url
      // is remote, local files needed to be read by the plugin and
      // passed to Javascript for Chrome security reasons.
      if (localFiles) {
        if (jsFile in localFiles) {
          try {
            printUserFile('local user file: ' + basePath + '\\' + jsFile);
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
          printUserFile('local user file: ' + basePath + '\\' + cssFile);
          let userCssText = document.createElement('style');
          userCssText.innerText = localFiles[cssFile];
          document.getElementsByTagName('head')[0].appendChild(userCssText);
        }
      } else if (basePath) {
        if (basePath.slice(-1) != '/')
          basePath += '/';
        let jsUrl = basePath + jsFile;
        printUserFile('remote user file: ' + jsUrl);
        this.appendJSLink(jsUrl);

        // See note above in localFiles case about skin load ordering.
        this.handleSkin(Options.Skin);

        let cssUrl = basePath + cssFile;
        printUserFile('remote user file: ' + cssUrl);
        this.appendCSSLink(cssUrl);
      }

      // Post this callback so that the js and css can be executed first.
      if (callback)
        callback();

      callOverlayHandler({ call: 'cactbotRequestState' });
    };

    callOverlayHandler({
      call: 'cactbotLoadUser',
      source: location.href,
    }).then((e) => {
      // Wait for DOMContentLoaded if needed.
      if (document.readyState !== 'loading') {
        loadUser(e);
        return;
      }
      document.addEventListener('DOMContentLoaded', () => {
        loadUser(e);
      });
    });
  },
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
      else if (opt.type === 'integer')
        options[opt.id] = parseInt(value);
      else if (opt.type === 'float')
        options[opt.id] = parseFloat(value);
      else
        options[opt.id] = value;
    }

    // For things like raidboss that build extra UI, also give them a chance
    // to handle anything that has been set on that UI.
    if (template.processExtraOptions)
      template.processExtraOptions(options, savedConfig);
  },
  addUnlockText: (lang) => {
    const unlockText = {
      en: '🔓 Unlocked (lock overlay before using)',
      de: '🔓 Entsperrt (Sperre das Overlay vor der Nutzung)',
      fr: '🔓 Débloqué (Bloquez l\'overlay avant utilisation)',
      ja: '🔓 ロック解除 (オーバーレイを使用する前にロックしてください)',
      cn: '🔓 已解除锁定 (你需要将此悬浮窗锁定后方可使用)',
      ko: '🔓 위치 잠금 해제됨 (사용하기 전에 위치 잠금을 설정하세요)',
    };

    const id = 'cactbot-unlocked-text';
    let textElem = document.getElementById(id);
    if (!textElem) {
      textElem = document.createElement('div');
      textElem.id = id;
      textElem.classList.add('text');
      // Set element display to none in case the page has not included defaults.css.
      textElem.style.display = 'none';
      document.body.append(textElem);
    }
    textElem.innerHTML = unlockText[lang] || unlockText['en'];
  },
};

// This event comes early and is not cached, so set up event listener immediately.
document.addEventListener('onOverlayStateUpdate', (e) => {
  let docClassList = document.documentElement.classList;
  if (e.detail.isLocked)
    docClassList.remove('resizeHandle', 'unlocked');
  else
    docClassList.add('resizeHandle', 'unlocked');
});
