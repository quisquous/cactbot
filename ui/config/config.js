import UserConfig from '../../resources/user_config.js';
import ZoneInfo from '../../resources/zone_info.js';
import contentList from '../../resources/content_list.js';

// Load other config files
import './general_config.js';
import '../eureka/eureka_config.js';
import '../jobs/jobs_config.js';
import '../oopsyraidsy/oopsyraidsy_config.js';
import '../radar/radar_config.js';
import '../raidboss/raidboss_config.js';
import '../../resources/common.js';

const Options = {};
let gConfig = null;

// Text in the butter bar, to prompt the user to reload after a config change.
const kReloadText = {
  en: 'To apply configuration changes, reload cactbot overlays.',
  de: 'Um die Änderungen zu aktivieren, aktualisiere bitte die Cactbot Overlays.',
  fr: 'Afin d\'appliquer les modifications, il faut recharger l\'overlay Cactbot.',
  ja: '設定を有効にする為、Cactbotオーバーレイを再読み込みしてください',
  cn: '要应用配置更改，请重新加载cactbot悬浮窗。',
  ko: '변경사항을 적용하려면, 오버레이를 새로고침 하십시오.',
};

// Text in the butter bar reload button.
const kReloadButtonText = {
  en: 'Reload',
  de: 'Aktualisieren',
  fr: 'Recharger',
  ja: '再読み込み',
  cn: '重新加载',
  ko: '새로고침',
};

// Text on the directory choosing button.
const kDirectoryChooseButtonText = {
  en: 'Choose Directory',
  de: 'Wähle ein Verzeichnis',
  fr: 'Choix du répertoire',
  ja: 'ディレクトリを選択',
  cn: '选择目录',
  ko: '디렉토리 선택',
};

// What to show when a directory hasn't been chosen.
const kDirectoryDefaultText = {
  en: '(Default)',
  de: '(Standard)',
  fr: '(Défaut)',
  ja: '(初期設定)',
  cn: '(默认)',
  ko: '(기본)',
};

// Translating data folders to a category name.
const kPrefixToCategory = {
  '00-misc': {
    en: 'General Triggers',
    de: 'General Trigger',
    fr: 'Général Triggers',
    ja: '汎用',
    cn: '通用触发器',
    ko: '공용 트리거',
  },
  '02-arr': {
    en: 'A Realm Reborn (ARR 2.x)',
    de: 'A Realm Reborn (ARR 2.x)',
    fr: 'A Realm Reborn (ARR 2.x)',
    ja: '新生エオルゼア (2.x)',
    cn: '重生之境 (2.x)',
    ko: '신생 에오르제아 (2.x)',
  },
  '03-hw': {
    en: 'Heavensward (HW 3.x)',
    de: 'Heavensward (HW 3.x)',
    fr: 'Heavensward (HW 3.x)',
    ja: '蒼天のイシュガルド (3.x)',
    cn: '苍穹之禁城 (3.x)',
    ko: '창천의 이슈가르드 (3.x)',
  },
  '04-sb': {
    en: 'Stormblood (SB 4.x)',
    de: 'Stormblood (SB 4.x)',
    fr: 'Stormblood (SB 4.x)',
    ja: '紅蓮のリベレーター (4.x)',
    cn: '红莲之狂潮 (4.x)',
    ko: '홍련의 해방자 (4.x)',
  },
  '05-shb': {
    en: 'Shadowbringers (ShB 5.x)',
    de: 'Shadowbringers (ShB 5.x)',
    fr: 'Shadowbringers (ShB 5.x)',
    ja: '漆黒のヴィランズ (5.x)',
    cn: '暗影之逆焰 (5.x)',
    ko: '칠흑의 반역자 (5.x)',
  },
};

// Translating data subfolders to encounter type.
const kDirectoryToCategory = {
  alliance: {
    en: 'Alliance Raid',
    de: 'Allianz-Raid',
    fr: 'Raid en Alliance',
    ja: 'アライアンスレイド',
    cn: '团队任务',
    ko: '연합 레이드',
  },
  dungeon: {
    en: 'Dungeon',
    de: 'Dungeon',
    fr: 'Donjon',
    ja: 'ダンジョン',
    cn: '迷宫挑战',
    ko: '던전',
  },
  eureka: {
    en: 'Eureka',
    de: 'Eureka',
    fr: 'Eurêka',
    ja: '禁断の地エウレカ',
    cn: '禁地优雷卡',
    ko: '에우레카',
  },
  raid: {
    en: 'Raid',
    de: 'Raid',
    fr: 'Raid',
    ja: 'レイド',
    cn: '大型任务',
    ko: '레이드',
  },
  pvp: {
    en: 'PVP',
    de: 'PvP',
    fr: 'JcJ',
    ja: 'PvP',
    cn: 'PvP',
    ko: 'PvP',
  },
  trial: {
    en: 'Trial',
    de: 'Prüfung',
    fr: 'Défi',
    ja: '討伐・討滅戦',
    cn: '讨伐歼灭战',
    ko: '토벌전',
  },
  ultimate: {
    en: 'Ultimate',
    de: 'Fatale Raids',
    fr: 'Raid fatal',
    ja: '絶シリーズ',
    cn: '绝境战',
    ko: '절 난이도',
  },
};

// TODO: maybe we should also sort all the filenames properly too?
// TODO: use ZoneId to get this
const fileNameToTitle = (filename) => {
  // Strip directory and extension.
  const file = filename.replace(/^.*\//, '').replace('.js', '');
  // Remove non-name characters (probably).
  const name = file.replace(/[_-]/g, ' ');
  // Capitalize the first letter of every word.
  let capitalized = name.replace(/(?:^| )\w/g, (c) => c.toUpperCase());

  // Fully capitalize acronyms like e4n.
  if (/^\w[0-9]+\w$/.test(capitalized))
    capitalized = capitalized.toUpperCase();

  return capitalized;
};

export default class CactbotConfigurator {
  constructor(configOptions, savedConfig) {
    // Predefined, only for ordering purposes.
    this.contents = {
      // top level
      'general': [],

      // things most people care about
      'raidboss': [],
      'jobs': [],
    };
    this.configOptions = configOptions;
    // If the user has set a display language, use that.
    // Otherwise, use the operating system language as a default for the config tool.
    this.lang = configOptions.DisplayLanguage || configOptions.ShortLocale;
    this.savedConfig = savedConfig || {};
    this.developerOptions = this.getOption('general', 'ShowDeveloperOptions', false);

    const templates = UserConfig.optionTemplates;
    for (const group in templates) {
      this.contents[group] = this.contents[group] || [];
      this.contents[group].push(templates[group]);
    }

    this.buildButterBar();

    const container = document.getElementById('container');
    this.buildUI(container, this.contents);
  }

  async saveConfigData() {
    // TODO: rate limit this?
    await callOverlayHandler({
      call: 'cactbotSaveData',
      overlay: 'options',
      data: this.savedConfig,
    });

    document.getElementById('butter-margin').classList.remove('hidden');
  }

  // Helper translate function.  Takes in an object with language keys
  // and returns a single entry based on available translations.
  translate(textObj) {
    if (textObj === null || typeof textObj !== 'object' || !textObj['en'])
      return textObj;
    const t = textObj[this.lang];
    if (t)
      return t;
    return textObj['en'];
  }

  // takes variable args, with the last value being the default value if
  // any key is missing.
  // e.g. (foo, bar, baz, 5) with {foo: { bar: { baz: 3 } } } will return
  // the value 3.  Requires at least two args.
  getOption() {
    const num = arguments.length;
    if (num < 2) {
      console.error('getOption requires at least two args');
      return;
    }

    const defaultValue = arguments[num - 1];
    let objOrValue = this.savedConfig;
    for (let i = 0; i < num - 1; ++i) {
      objOrValue = objOrValue[arguments[i]];
      if (typeof objOrValue === 'undefined')
        return defaultValue;
    }

    return objOrValue;
  }

  // takes variable args, with the last value being the 'value' to set it to
  // e.g. (foo, bar, baz, 3) will set {foo: { bar: { baz: 3 } } }.
  // requires at least two args.
  setOption() {
    const num = arguments.length;
    if (num < 2) {
      console.error('setOption requires at least two args');
      return;
    }

    // Set keys and create default {} if it doesn't exist.
    let obj = this.savedConfig;
    for (let i = 0; i < num - 2; ++i) {
      const arg = arguments[i];
      obj[arg] = obj[arg] || {};
      obj = obj[arg];
    }
    // Set the last key to have the final argument's value.
    obj[arguments[num - 2]] = arguments[num - 1];
    this.saveConfigData();
  }

  buildButterBar() {
    const container = document.getElementById('butter-bar');

    const textDiv = document.createElement('div');
    textDiv.classList.add('reload-text');
    textDiv.innerText = this.translate(kReloadText);
    container.appendChild(textDiv);

    const buttonInput = document.createElement('input');
    buttonInput.classList.add('reload-button');
    buttonInput.type = 'button';
    buttonInput.onclick = () => {
      callOverlayHandler({ call: 'cactbotReloadOverlays' });
    };
    buttonInput.value = this.translate(kReloadButtonText);
    container.appendChild(buttonInput);
  }

  // Top level UI builder, builds everything.
  buildUI(container, contents) {
    for (const group in contents) {
      const content = contents[group];
      if (content.length === 0)
        continue;

      // For each overlay options template, build a section for it.
      // Then iterate through all of its options and build ui for those options.
      // Give each options template a chance to build special ui.
      const groupDiv = this.buildOverlayGroup(container, group);
      for (let i = 0; i < content.length; ++i) {
        const options = content[i].options || [];
        for (let j = 0; j < options.length; ++j) {
          const opt = options[j];
          if (!this.developerOptions && opt.debugOnly)
            continue;
          const buildFunc = {
            checkbox: this.buildCheckbox,
            select: this.buildSelect,
            float: this.buildFloat,
            integer: this.buildInteger,
            directory: this.buildDirectory,
          }[opt.type];
          if (!buildFunc) {
            console.error('unknown type: ' + JSON.stringify(opt));
            continue;
          }

          buildFunc.bind(this)(groupDiv, opt, group);
        }

        const builder = content[i].buildExtraUI;
        if (builder)
          builder(this, groupDiv);
      }
    }
  }

  // Overlay builder for each overlay type (e.g. raidboss, jobs).
  buildOverlayGroup(container, group) {
    const collapser = document.createElement('div');
    collapser.classList.add('overlay-container');
    container.appendChild(collapser);

    const a = document.createElement('a');
    a.name = group;
    collapser.appendChild(a);

    const header = document.createElement('div');
    header.classList.add('overlay-header');
    header.innerText = group;
    a.appendChild(header);

    const groupDiv = document.createElement('div');
    groupDiv.classList.add('overlay-options');
    collapser.appendChild(groupDiv);

    a.onclick = (e) => {
      a.parentNode.classList.toggle('collapsed');
    };

    return groupDiv;
  }

  buildNameDiv(opt) {
    const div = document.createElement('div');
    div.innerHTML = this.translate(opt.name);
    div.classList.add('option-name');
    return div;
  }

  buildCheckbox(parent, opt, group) {
    const div = document.createElement('div');
    div.classList.add('option-input-container');

    const input = document.createElement('input');
    div.appendChild(input);
    input.type = 'checkbox';
    input.checked = this.getOption(group, opt.id, opt.default);
    input.onchange = () => this.setOption(group, opt.id, input.checked);

    parent.appendChild(this.buildNameDiv(opt));
    parent.appendChild(div);
  }

  buildDirectory(parent, opt, group) {
    const div = document.createElement('div');
    div.classList.add('option-input-container');
    div.classList.add('input-dir-container');

    const input = document.createElement('input');
    input.type = 'submit';
    input.value = this.translate(kDirectoryChooseButtonText);
    input.classList.add('input-dir-submit');
    div.appendChild(input);

    const label = document.createElement('div');
    label.classList.add('input-dir-label');
    div.appendChild(label);

    const setLabel = (str) => {
      if (str)
        label.innerText = str;
      else
        label.innerText = this.translate(kDirectoryDefaultText);
    };
    setLabel(this.getOption(group, opt.id, opt.default));

    parent.appendChild(this.buildNameDiv(opt));
    parent.appendChild(div);

    input.onclick = async () => {
      // Prevent repeated clicks on the folder chooser.
      // callOverlayHandler is not synchronous.
      // FIXME: do we need some clearer UI here (like pretending to be modal?)
      input.disabled = true;

      const prevValue = label.innerText;
      label.innerText = '';

      const result = await callOverlayHandler({
        call: 'cactbotChooseDirectory',
      });

      input.disabled = false;
      const dir = result.data ? result.data : '';
      if (dir !== prevValue)
        this.setOption(group, opt.id, dir);
      setLabel(dir);
    };
  }

  buildSelect(parent, opt, group) {
    const div = document.createElement('div');
    div.classList.add('option-input-container');

    const input = document.createElement('select');
    div.appendChild(input);

    const defaultValue = this.getOption(group, opt.id, opt.default);
    input.onchange = () => this.setOption(group, opt.id, input.value);

    const innerOptions = this.translate(opt.options);
    for (const key in innerOptions) {
      const elem = document.createElement('option');
      elem.value = innerOptions[key];
      elem.innerHTML = key;
      if (innerOptions[key] === defaultValue)
        elem.selected = true;
      input.appendChild(elem);
    }

    parent.appendChild(this.buildNameDiv(opt));
    parent.appendChild(div);
  }

  // FIXME: this could use some data validation if a user inputs non-floats.
  buildFloat(parent, opt, group) {
    const div = document.createElement('div');
    div.classList.add('option-input-container');

    const input = document.createElement('input');
    div.appendChild(input);
    input.type = 'text';
    input.step = 'any';
    input.value = this.getOption(group, opt.id, parseFloat(opt.default));
    const setFunc = () => this.setOption(group, opt.id, input.value);
    input.onchange = setFunc;
    input.oninput = setFunc;

    parent.appendChild(this.buildNameDiv(opt));
    parent.appendChild(div);
  }

  // FIXME: this could use some data validation if a user inputs non-integers.
  buildInteger(parent, opt, group) {
    const div = document.createElement('div');
    div.classList.add('option-input-container');

    const input = document.createElement('input');
    div.appendChild(input);
    input.type = 'text';
    input.step = 1;
    input.value = this.getOption(group, opt.id, parseInt(opt.default));
    const setFunc = () => this.setOption(group, opt.id, input.value);
    input.onchange = setFunc;
    input.oninput = setFunc;

    parent.appendChild(this.buildNameDiv(opt));
    parent.appendChild(div);
  }

  processFiles(files) {
    const map = {};
    for (const filename in files) {
      if (!filename.endsWith('.js'))
        continue;

      let prefixKey = '00-misc';
      for (const str in kPrefixToCategory) {
        if (!filename.startsWith(str))
          continue;
        prefixKey = str;
        break;
      }

      let typeKey = 'general';
      for (const str in kDirectoryToCategory) {
        if (!filename.includes('/' + str + '/'))
          continue;
        typeKey = str;
        break;
      }

      const triggerSet = files[filename];
      let title = fileNameToTitle(filename);
      let zoneId = undefined;

      // Make assumptions about trigger structure here to try to get the zoneId out.
      if (triggerSet && 'zoneId' in triggerSet) {
        zoneId = triggerSet.zoneId;
        // Use the translatable zone info name, if possible.
        const zoneInfo = ZoneInfo[zoneId];
        if (zoneInfo)
          title = this.translate(zoneInfo.name);
      }

      const fileKey = filename.replace(/\//g, '-').replace(/.js$/, '');
      map[fileKey] = {
        filename: filename,
        fileKey: fileKey,
        prefixKey: prefixKey,
        typeKey: typeKey,
        prefix: this.translate(kPrefixToCategory[prefixKey]),
        type: this.translate(kDirectoryToCategory[typeKey]),
        title: title,
        triggerSet: triggerSet,
        zoneId: zoneId,
      };
    }

    const sortedEntries = Object.keys(map).sort((keyA, keyB) => {
      // Sort first by expansion.
      const entryA = map[keyA];
      const entryB = map[keyB];
      const prefixCompare = entryA.prefixKey.localeCompare(entryB.prefixKey);
      if (prefixCompare !== 0)
        return prefixCompare;

      // Then sort by contentList.
      const indexA = contentList.indexOf(entryA.zoneId);
      const indexB = contentList.indexOf(entryB.zoneId);

      if (indexA === -1 && indexB === -1) {
        // If we don't know, sort by strings.
        return keyA.localeCompare(keyB);
      } else if (indexA === -1) {
        // Sort B first.
        return 1;
      } else if (indexB === -1) {
        // Sort A first.
        return -1;
      }
      // Default: sort by index in contentList.
      return indexA - indexB;
    });

    // Rebuild map with keys in the right order.
    const sortedMap = {};
    for (const key of sortedEntries)
      sortedMap[key] = map[key];

    return sortedMap;
  }
}

UserConfig.getUserConfigLocation('config', Options, async (e) => {
  gConfig = new CactbotConfigurator(
      Options,
      UserConfig.savedConfig);
});
