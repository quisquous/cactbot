// TODO:
// The convention of "import X as _X; const X = _X;" is currently
// being used as a method to workaround for downstream code
// that is running via eval(). Because importing statements do not
// create a variable of the same name, the eval()'d code does not know
// about the import, and thus throws ReferenceErrors.
// Used by downstream eval
import _Conditions from './conditions.js';
const Conditions = _Conditions;
import _NetRegexes from './netregexes.js';
const NetRegexes = _NetRegexes;
import _Regexes from './regexes.js';
const Regexes = _Regexes;
import { Responses as _Responses } from './responses.js';
const Responses = _Responses;
import _ZoneId from './zone_id.js';
const ZoneId = _ZoneId;


class UserConfig {
  constructor() {
    this.optionTemplates = {};
    this.savedConfig = null;
    this.userFileCallbacks = {};
  }
  registerOptions(overlayName, optionTemplates, userFileCallback) {
    this.optionTemplates[overlayName] = optionTemplates;
    if (userFileCallback)
      this.userFileCallbacks[overlayName] = userFileCallback;
  }

  sortUserFiles(keys) {
    // Helper data structure for subdirectories.
    const splitKeyMap = {};
    for (const key of keys)
      splitKeyMap[key] = key.toUpperCase().split(/[/\\]/);

    // Sort paths as a depth-first case-insensitive alphabetical subdirectory walk, followed by
    // all files sorted case-insensitive alphabetically once a subdir has been processed, e.g.
    //  * a/some.js
    //  * b/subdir1/z/z/z/nested_file.js
    //  * b/subdir1/file.js
    //  * b/subdir2/first.js
    //  * b/subdir2/second.js
    //  * b/some_file.js
    //  * root_file1.js
    //  * root_file2.js
    return keys.sort((a, b) => {
      const maxLen = Math.max(splitKeyMap[a].length, splitKeyMap[b].length);

      for (let idx = 0; idx < maxLen; ++idx) {
        // If both subdirectories or both files, then compare names.
        const isLastA = splitKeyMap[a].length - 1 === idx;
        const isLastB = splitKeyMap[b].length - 1 === idx;
        if (isLastA && isLastB || !isLastA && !isLastB) {
          const nameDiff = splitKeyMap[a][idx].localeCompare(splitKeyMap[b][idx]);
          if (nameDiff || isLastA && isLastB)
            return nameDiff;
        }

        // At this point, if idx is the final for each, we would have returned above.
        // So, check if either a or b is at the final entry in splitKeyMap.
        // If so, then there's a mismatch, and we know one the one with a filename
        // should be sorted last.

        if (splitKeyMap[a].length - 1 <= idx) {
          // a has fewer subdirectories, so should be sorted last.
          return 1;
        }
        if (splitKeyMap[b].length - 1 <= idx) {
          // a has more subdirectories, so should be sorted first.
          return -1;
        }
      }
      return 0;
    });
  }

  // Given a set of paths, an overlayName, and an extension, return all paths with
  // that extension that have `overlayName` either as their entire filename (no subdir)
  // or are inside a root-level subdirectory named `overlayName`/  The extension should
  // include the period separator, e.g. ".js".  All comparisons are case insensitive.
  filterUserFiles(paths, origOverlayName, origExtension) {
    const extension = origExtension.toLowerCase();
    const overlayName = origOverlayName.toLowerCase();
    return paths.filter((origPath) => {
      const path = origPath.toLowerCase();
      if (!path.endsWith(extension))
        return false;
      if (path === `${overlayName}${extension}`)
        return true;
      if (path.startsWith(`${overlayName}/`) || path.startsWith(`${overlayName}\\`))
        return true;
      return false;
    });
  }

  getUserConfigLocation(overlayName, options, callback) {
    let currentlyReloading = false;
    const reloadOnce = () => {
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

    const readOptions = callOverlayHandler({
      call: 'cactbotLoadData',
      overlay: 'options',
    });

    const loadUser = async (e) => {
      // The basePath isn't using for anything other than cosmetic printing of full paths,
      // so replace any slashes here for uniformity.  In case anybody is using cactbot on
      // Linux (?!?), support any style of slashes elsewhere.
      const basePath = e.detail.userLocation.replace(/[/\\]*$/, '') + '\\';
      const localFiles = e.detail.localUserFiles;

      const sortedFiles = this.sortUserFiles(Object.keys(localFiles));
      const jsFiles = this.filterUserFiles(sortedFiles, overlayName, '.js');
      const cssFiles = this.filterUserFiles(sortedFiles, overlayName, '.css');

      // The plugin auto-detects the language, so set this first.
      // If options files want to override it, they can for testing.

      // Backward compatibility (language is now separated to three types.)
      if (e.detail.language) {
        options.ParserLanguage = e.detail.language;
        options.ShortLocale = e.detail.language;
        options.DisplayLanguage = e.detail.language;
      }
      // Parser Language
      if (e.detail.parserLanguage) {
        options.ParserLanguage = e.detail.parserLanguage;
        // Backward compatibility, everything "Language" should be changed to "ParserLanguage"
        options.Language = e.detail.parserLanguage;
      }
      const supportedLanguage = ['en', 'de', 'fr', 'ja', 'cn', 'ko'];
      // System Language
      if (e.detail.systemLocale) {
        options.SystemLocale = e.detail.systemLocale;
        options.ShortLocale = e.detail.systemLocale.substring(0, 2);
        if (options.ShortLocale === 'zh')
          options.ShortLocale = 'cn';
        if (!supportedLanguage.includes(options.ShortLocale))
          options.ShortLocale = options.ParserLanguage;
      }
      // User's setting Language
      options.DisplayLanguage = e.detail.displayLanguage;
      if (!supportedLanguage.includes(options.DisplayLanguage))
        options.DisplayLanguage = options.ParserLanguage || 'en';

      document.body.classList.add(`lang-${options.DisplayLanguage}`);
      this.addUnlockText(options.DisplayLanguage);

      // Handle processOptions after default language selection above,
      // but before css below which may load skin files.
      // processOptions needs to be called whether or not there are
      // any userOptions saved, as it sets up the defaults.
      const userOptions = await readOptions || {};
      this.savedConfig = userOptions.data || {};
      this.processOptions(
          options,
          this.savedConfig[overlayName] || {},
          this.optionTemplates[overlayName],
      );

      // If the overlay has a "Debug" setting, set to true via the config tool,
      // then also print out user files that have been loaded.
      const printUserFile = options.Debug ? (x) => console.log(x) : (x) => {};

      // In cases where the user files are local but the overlay url
      // is remote, local files needed to be read by the plugin and
      // passed to Javascript for Chrome security reasons.
      if (localFiles) {
        for (const jsFile of jsFiles) {
          try {
            printUserFile(`local user file: ${basePath}${jsFile}`);
            const Options = options;

            // This is the one eval cactbot should ever need, which is for handling user files.
            // Because user files can be located anywhere on disk and there's backwards compat
            // issues, it's unlikely that these will be able to be anything but eval forever.
            //
            /* eslint-disable no-eval */
            eval(localFiles[jsFile]);
            /* eslint-enable no-eval */

            if (this.userFileCallbacks[overlayName])
              this.userFileCallbacks[overlayName](jsFile, localFiles, options, basePath);
          } catch (e) {
            // Be very visible for users.
            console.log('*** ERROR IN USER FILE ***');
            console.log(e.stack);
          }
        }

        // This is a bit awkward to handle skin settings here, but
        // doing it after user config files and before user css files
        // allows user css to override skin-specific css as well.
        this.handleSkin(options.Skin);

        for (const cssFile of cssFiles) {
          printUserFile(`local user file: ${basePath}${cssFile}`);
          const userCssText = document.createElement('style');
          userCssText.innerText = localFiles[cssFile];
          document.getElementsByTagName('head')[0].appendChild(userCssText);
        }
      }

      // Post this callback so that the js and css can be executed first.
      if (callback)
        callback();

      callOverlayHandler({ call: 'cactbotRequestState' });
    };

    callOverlayHandler({
      call: 'cactbotLoadUser',
      source: location.href,
      overlayName: overlayName,
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
  }

  handleSkin(skinName) {
    if (!skinName || skinName === 'default')
      return;

    let basePath = document.location.toString();
    const slashIdx = basePath.lastIndexOf('/');
    if (slashIdx !== -1)
      basePath = basePath.substr(0, slashIdx);
    if (basePath.slice(-1) !== '/')
      basePath += '/';
    const skinHref = basePath + 'skins/' + skinName + '/' + skinName + '.css';
    this.appendCSSLink(skinHref);
  }
  appendJSLink(src) {
    const userJS = document.createElement('script');
    userJS.setAttribute('type', 'text/javascript');
    userJS.setAttribute('src', src);
    userJS.setAttribute('async', false);
    document.getElementsByTagName('head')[0].appendChild(userJS);
  }
  appendCSSLink(href) {
    const userCSS = document.createElement('link');
    userCSS.setAttribute('rel', 'stylesheet');
    userCSS.setAttribute('type', 'text/css');
    userCSS.setAttribute('href', href);
    document.getElementsByTagName('head')[0].appendChild(userCSS);
  }
  processOptions(options, savedConfig, template) {
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

    const templateOptions = template.options || [];
    for (let i = 0; i < templateOptions.length; ++i) {
      const opt = templateOptions[i];

      // Grab the saved value or the default to set in options.
      const value = opt.id in savedConfig ? savedConfig[opt.id] : opt.default;

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
  }
  addUnlockText(lang) {
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
  }
}

export default new UserConfig();


if (typeof document !== 'undefined') {
  // This event comes early and is not cached, so set up event listener immediately.
  document.addEventListener('onOverlayStateUpdate', (e) => {
    const docClassList = document.documentElement.classList;
    if (e.detail.isLocked)
      docClassList.remove('resizeHandle', 'unlocked');
    else
      docClassList.add('resizeHandle', 'unlocked');
  });
}
