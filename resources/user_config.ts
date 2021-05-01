import { Lang } from '../types/global';
import { BaseOptions } from '../types/data';
import { CactbotLoadUserRet, SavedConfig, SavedConfigEntry } from '../types/event';
import { LocaleText } from '../types/trigger';
import { addOverlayListener, callOverlayHandler } from './overlay_plugin_api';
import { UnreachableCode } from './not_reached';

// TODO:
// The convention of "import X as _X; const X = _X;" is currently
// being used as a method to workaround for downstream code
// that is running via eval(). Because importing statements do not
// create a variable of the same name, the eval()'d code does not know
// about the import, and thus throws ReferenceErrors.
// Used by downstream eval
import _Conditions from './conditions';
const Conditions = _Conditions;
import _ContentType from './content_type';
const ContentType = _ContentType;
import _NetRegexes from './netregexes';
const NetRegexes = _NetRegexes;
import _Regexes from './regexes';
const Regexes = _Regexes;
import { Responses as _Responses } from './responses';
const Responses = _Responses;
import _Outputs from './outputs';
const Outputs = _Outputs;
import _Util from './util';
const Util = _Util;
import _ZoneId from './zone_id';
const ZoneId = _ZoneId;
import _ZoneInfo from './zone_info';
const ZoneInfo = _ZoneInfo;

// Convince TypeScript and eslint that these are used.  TypeScript doesn't have a great way
// to disable individual rules, so this is safer than disabling all rules.
console.assert(Conditions && ContentType && NetRegexes && Regexes &&
    Responses && Outputs && Util && ZoneId && ZoneInfo);

// TODO: this type is in config.js.
type CactbotConfigurator = unknown;

// TODO: move all of these to config.js?
type UserFileCallback = (jsFile: string, localFiles: { [filename: string]: string },
  options: BaseOptions, basePath: string) => void;
type ConfigValue = string | number | boolean;
type ConfigEntry = {
  id: string;
  name: LocaleText;
  type: 'checkbox' | 'select' | 'float' | 'integer' | 'directory';
  default: ConfigValue;
  debug?: boolean;
  debugOnly?: boolean;
  // For select.
  options?: {
    [lang in Lang]?: {
      [selectText: string]: string;
    }
  };
  setterFunc?: (options: BaseOptions, value: SavedConfigEntry) => void;
};

type OptionsTemplate = {
  buildExtraUI?: (base: CactbotConfigurator, container: HTMLElement) => void;
  processExtraOptions?: (options: BaseOptions, savedConfig: SavedConfigEntry) => void;
  options: ConfigEntry[];
};

class UserConfig {
  private optionTemplates: { [overlayName: string]: OptionsTemplate } = {};
  private savedConfig: SavedConfig = {};
  private userFileCallbacks: { [overlayName: string]: UserFileCallback } = {};

  getDefaultBaseOptions(): BaseOptions {
    return {
      ParserLanguage: 'en',
      ShortLocale: 'en',
      DisplayLanguage: 'en',
    };
  }

  registerOptions(overlayName: string, optionTemplate: OptionsTemplate,
      userFileCallback?: UserFileCallback) {
    this.optionTemplates[overlayName] = optionTemplate;
    if (userFileCallback)
      this.userFileCallbacks[overlayName] = userFileCallback;
  }

  sortUserFiles(keys: string[]) {
    // Helper data structure for subdirectories.
    const splitKeyMap: { [k: string]: string[] } = {};
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
    return keys.sort((keyA, keyB) => {
      const listA = splitKeyMap[keyA];
      const listB = splitKeyMap[keyB];
      if (listA === undefined || listB === undefined)
        throw new UnreachableCode();

      const maxLen = Math.max(listA.length, listB.length);
      for (let idx = 0; idx < maxLen; ++idx) {
        const entryA = listA[idx];
        const entryB = listB[idx];
        // In practice, there's always at least one entry.
        if (entryA === undefined || entryB === undefined)
          throw new UnreachableCode();

        // If both subdirectories or both files, then compare names.
        const isLastA = listA.length - 1 === idx;
        const isLastB = listB.length - 1 === idx;

        if (isLastA && isLastB) {
          // If both last, then this is a filename comparison.

          // First, compare filename without extension.
          const fileA = entryA.replace(/\.[^\.]*$/, '');
          const fileB = entryB.replace(/\.[^\.]*$/, '');
          const filenameOnlyDiff = fileA.localeCompare(fileB);
          if (filenameOnlyDiff)
            return filenameOnlyDiff;

          // Second, compare including the extension.
          // Always return something here, see note below.
          return entryA.localeCompare(entryB);
        } else if (!isLastA && !isLastB) {
          // If both not last, this is a subdirectory comparison.
          const diff = entryA.localeCompare(entryB);
          if (diff)
            return diff;
        }

        // At this point, if idx is the final for each, we would have returned above.
        // So, check if either a or b is at the final entry in splitKeyMap.
        // If so, then there's a mismatch in number of directories, and we know one
        // the one with a filename should be sorted last.

        if (listA.length - 1 <= idx) {
          // a has fewer subdirectories, so should be sorted last.
          return 1;
        }
        if (listB.length - 1 <= idx) {
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
  filterUserFiles(paths: string[], origOverlayName: string, origExtension: string) {
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

  getUserConfigLocation(overlayName: string, options: BaseOptions, callback: () => void) {
    let currentlyReloading = false;
    const reloadOnce = () => {
      if (currentlyReloading)
        return;
      currentlyReloading = true;
      window.location.reload();
    };

    addOverlayListener('onUserFileChanged', () => {
      reloadOnce();
    });
    addOverlayListener('onForceReload', () => {
      reloadOnce();
    });

    this.loadUserFiles(overlayName, options, callback);
  }

  loadUserFiles(overlayName: string, options: BaseOptions, callback: () => void) {
    const readOptions = callOverlayHandler({
      call: 'cactbotLoadData',
      overlay: 'options',
    });

    const loadUser = async (e: { detail: CactbotLoadUserRet }) => {
      // The basePath isn't using for anything other than cosmetic printing of full paths,
      // so replace any slashes here for uniformity.  In case anybody is using cactbot on
      // Linux (?!?), support any style of slashes elsewhere.
      const basePath = e.detail.userLocation.replace(/[/\\]*$/, '') + '\\';
      const localFiles = e.detail.localUserFiles;

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
      this.savedConfig = (await readOptions)?.data ?? {};
      this.processOptions(
          options,
          this.savedConfig[overlayName] ?? {},
          this.optionTemplates[overlayName],
      );

      // If the overlay has a "Debug" setting, set to true via the config tool,
      // then also print out user files that have been loaded.
      const printUserFile = options.Debug ? (x: string) => console.log(x) : () => {/* noop */};

      // With user files being arbitrary javascript, and having multiple files
      // in user folders, it's possible for later files to accidentally remove
      // things that previous files have added.  Warn about this, since most
      // users are not programmers.
      const warnOnVariableResetMap: { [overlayName: string]: string[] } = {
        raidboss: [
          'Triggers',
        ],
      };
      warnOnVariableResetMap[overlayName] = warnOnVariableResetMap[overlayName] || [];

      // The values of each `warnOnVariableResetMap` field are initially set
      // after the first file, so that if there is only one file, there are
      // not any warnings.

      // The fields that a user file sets in Options can be anything (pun not intended)
      // and so we use `any` here.  The only operation done on this field is a !==
      // for change detection to see if the the user file has modified it.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const variableTracker: { [fieldName: string]: any } = {};

      if (localFiles) {
        // localFiles may be null if there is no valid user directory.
        const sortedFiles = this.sortUserFiles(Object.keys(localFiles));
        const jsFiles = this.filterUserFiles(sortedFiles, overlayName, '.js');
        const cssFiles = this.filterUserFiles(sortedFiles, overlayName, '.css');

        for (const jsFile of jsFiles) {
          try {
            printUserFile(`local user file: ${basePath}${jsFile}`);
            const Options = options;
            console.assert(Options); // Used by eval.

            // This is the one eval cactbot should ever need, which is for handling user files.
            // Because user files can be located anywhere on disk and there's backwards compat
            // issues, it's unlikely that these will be able to be anything but eval forever.
            //
            /* eslint-disable no-eval */
            eval(localFiles[jsFile] ?? '');
            /* eslint-enable no-eval */

            for (const field of warnOnVariableResetMap[overlayName] ?? []) {
              if (variableTracker[field] && variableTracker[field] !== options[field]) {
                // Ideally users should do something like `Options.Triggers.push([etc]);`
                // instead of `Options.Triggers = [etc];`
                console.log(`*** WARNING: ${basePath}${jsFile} overwrites Options.${field} from previous files.`);
              }
              variableTracker[field] = options[field];
            }

            this.userFileCallbacks[overlayName]?.(jsFile, localFiles, options, basePath);
          } catch (e) {
            // Be very visible for users.
            console.log('*** ERROR IN USER FILE ***');
            console.log(e);
          }
        }

        // This is a bit awkward to handle skin settings here, but
        // doing it after user config files and before user css files
        // allows user css to override skin-specific css as well.
        if (options.Skin)
          this.handleSkin(options.Skin);

        for (const cssFile of cssFiles) {
          printUserFile(`local user file: ${basePath}${cssFile}`);
          const userCssText = document.createElement('style');
          const contents = localFiles[cssFile];
          if (contents)
            userCssText.innerText = contents;
          const head = document.getElementsByTagName('head')[0];
          if (head)
            head.appendChild(userCssText);
        }
      }

      // Post this callback so that the js and css can be executed first.
      if (callback)
        callback();

      void callOverlayHandler({ call: 'cactbotRequestState' });
    };

    void callOverlayHandler({
      call: 'cactbotLoadUser',
      source: location.href,
      overlayName: overlayName,
    }).then((e: { detail: CactbotLoadUserRet }) => {
      // Wait for DOMContentLoaded if needed.
      if (document.readyState !== 'loading') {
        void loadUser(e);
        return;
      }
      document.addEventListener('DOMContentLoaded', () => {
        void loadUser(e);
      });
    });
  }

  handleSkin(skinName: string) {
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
  appendJSLink(src: string) {
    const userJS = document.createElement('script');
    userJS.setAttribute('type', 'text/javascript');
    userJS.setAttribute('src', src);
    userJS.setAttribute('async', 'false');
    const head = document.getElementsByTagName('head')[0];
    if (head)
      head.appendChild(userJS);
  }
  appendCSSLink(href: string) {
    const userCSS = document.createElement('link');
    userCSS.setAttribute('rel', 'stylesheet');
    userCSS.setAttribute('type', 'text/css');
    userCSS.setAttribute('href', href);
    const head = document.getElementsByTagName('head')[0];
    if (head)
      head.appendChild(userCSS);
  }
  processOptions(options: BaseOptions, savedConfig: SavedConfigEntry, template?: OptionsTemplate) {
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
    for (const opt of templateOptions) {
      // Grab the saved value or the default to set in options.

      let value: SavedConfigEntry = opt.default;
      if (typeof savedConfig === 'object' && !Array.isArray(savedConfig)) {
        if (opt.id in savedConfig) {
          const newValue = savedConfig[opt.id];
          if (newValue !== undefined)
            value = newValue;
        }
      }

      // Options can provide custom logic to turn a value into options settings.
      // If this doesn't exist, just set the value directly.
      // Option template ids are identical to field names on Options.
      if (opt.setterFunc) {
        opt.setterFunc(options, value);
      } else if (opt.type === 'integer') {
        if (typeof value === 'number')
          options[opt.id] = Math.floor(value);
        else if (typeof value === 'string')
          options[opt.id] = parseInt(value);
      } else if (opt.type === 'float') {
        if (typeof value === 'number')
          options[opt.id] = value;
        else if (typeof value === 'string')
          options[opt.id] = parseFloat(value);
      } else {
        options[opt.id] = value;
      }
    }

    // For things like raidboss that build extra UI, also give them a chance
    // to handle anything that has been set on that UI.
    if (template.processExtraOptions)
      template.processExtraOptions(options, savedConfig);
  }
  addUnlockText(lang: Lang) {
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
