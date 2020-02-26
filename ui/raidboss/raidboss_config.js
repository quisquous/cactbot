'use strict';

let kPrefixToCategory = {
  '00-misc': {
    en: 'General Triggers',
    de: 'General Trigger',
    fr: 'Général',
    cn: '通用',
    ko: '공용 트리거',
  },
  '02-arr': {
    en: 'A Realm Reborn (ARR 2.x)',
    de: 'A Realm Reborn (ARR 2.x)',
    fr: 'A Realm Reborn (ARR 2.x)',
    cn: '重生之境（2.X）',
    ko: '신생 에오르제아 (2.x)',
  },
  '03-hw': {
    en: 'Heavensward (HW 3.x)',
    de: 'Heavensward (HW 3.x)',
    fr: 'Heavensward (HW 3.x)',
    cn: '苍穹之禁城（3.X）',
    ko: '창천의 이슈가르드 (3.x)',
  },
  '04-sb': {
    en: 'Stormblood (SB 4.x)',
    de: 'Stormblood (SB 4.x)',
    fr: 'Stormblood (SB 4.x)',
    cn: '红莲之狂潮（4.X）',
    ko: '홍련의 해방자 (4.x)',
  },
  '05-shb': {
    en: 'Shadowbringers (ShB 5.x)',
    de: 'Shadowbringers (ShB 5.x)',
    fr: 'Shadowbringers (ShB 5.x)',
    cn: '暗影之逆焰（5.X）',
    ko: '칠흑의 반역자 (5.x)',
  },
};

let kDirectoryToCategory = {
  alliance: {
    en: 'Alliance Raid',
    de: 'Allianz-Raid',
    fr: 'Raid en Alliance',
    cn: '团队任务',
    ko: '연합 레이드',
  },
  dungeon: {
    en: 'Dungeon',
    de: 'Dungeon',
    fr: 'Donjon',
    cn: '迷宫挑战',
    ko: '던전',
  },
  eureka: {
    en: 'Eureka',
    de: 'Eureka',
    fr: 'Eureka',
    cn: '禁地优雷卡',
    ko: '에우레카',
  },
  raid: {
    en: 'Raid',
    de: 'Raid',
    fr: 'Raid',
    cn: '大型任务',
    ko: '레이드',
  },
  pvp: {
    en: 'PVP',
    de: 'PvP',
    fr: 'PvP',
    cn: 'PVP',
    ko: 'PvP',
  },
  trial: {
    en: 'Trial',
    de: 'Prüfung',
    fr: 'Défi',
    cn: '讨伐歼灭战',
    ko: '토벌전',
  },
  ultimate: {
    en: 'Ultimate',
    de: 'Fatale Raids',
    fr: 'Ultimate',
    cn: '绝境战',
    ko: '절 난이도',
  },
};

// No sound only option, because that's silly.
let kTriggerOptions = {
  default: {
    label: {
      en: '✔ Defaults',
      de: '✔ Standards',
      fr: '✔ Défaut',
      cn: '✔ 默认',
      ko: '✔ 기본',
    },
  },
  textAndSound: {
    label: {
      en: '🆙🔊 Text and Sound',
      de: '🆙🔊 Text und Ton',
      fr: '🆙🔊 Textes et sons',
      cn: '🆙🔊 文字和语音',
      ko: '🆙🔊 텍스트와 소리',
    },
  },
  ttsAndText: {
    label: {
      en: '🆙💬 Text and TTS',
      de: '🆙💬 Text und TTS',
      fr: '🆙💬 Textes et TTS',
      cn: '🆙💬 文字和TTS',
      ko: '🆙💬 텍스트와 TTS',
    },
  },
  ttsOnly: {
    label: {
      en: '💬 TTS Only',
      de: '💬 Nur TTS',
      fr: '💬 TTS Seulement',
      cn: '💬 只使用TTS',
      ko: '💬 TTS만',
    },
  },
  textOnly: {
    label: {
      en: '🆙 Text Only',
      de: '🆙 Nur Text',
      fr: '🆙 Texte seulement',
      cn: '🆙 只使用文字',
      ko: '🆙 텍스트만',
    },
  },
  disabled: {
    label: {
      en: '❌ Disabled',
      de: '❌ Deaktiviert',
      fr: '❌ Désactivé',
      cn: '❌ 禁用',
      ko: '❌ 비활성화',
    },
  },
};

let kDetailKeys = {
  'triggerRegex': {
    label: {
      en: 'regex',
      de: 'regex',
      fr: 'regex',
      cn: '正则表达式',
      ko: '정규식',
    },
    cls: 'regex-text',
    debugOnly: true,
  },
  'timelineRegex': {
    label: {
      en: 'timeline',
      de: 'timeline',
      fr: 'timeline',
      cn: '时间轴',
      ko: '타임라인',
    },
    cls: 'regex-text',
    debugOnly: true,
  },
  'condition': {
    label: {
      en: 'condition',
      de: 'condition',
      fr: 'condition',
      cn: '条件',
      ko: '조건',
    },
    cls: 'condition-text',
    debugOnly: true,
  },
  'preRun': {
    label: {
      en: 'preRun',
      de: 'preRun',
      fr: 'preRun',
      cn: '预运行',
      ko: '사전 실행',
    },
    cls: 'prerun-text',
    debugOnly: true,
  },
  'alarmText': {
    label: {
      en: 'alarm',
      de: 'alarm',
      fr: 'alarme',
      cn: '警报',
      ko: '경고',
    },
    cls: 'alarm-text',
  },
  'alertText': {
    label: {
      en: 'alert',
      de: 'alert',
      fr: 'alerte',
      cn: '警告',
      ko: '주의',
    },
    cls: 'alert-text',
  },
  'infoText': {
    label: {
      en: 'info',
      de: 'info',
      fr: 'info',
      cn: '信息',
      ko: '안내',
    },
    cls: 'info-text',
  },
  'tts': {
    label: {
      en: 'tts',
      de: 'tts',
      fr: 'tts',
      cn: 'tts',
      ko: 'tts',
    },
    cls: 'tts-text',
  },
  'sound': {
    label: {
      en: 'sound',
      de: 'sound',
      fr: 'son',
      cn: '声音',
      ko: '소리',
    },
    cls: 'sound-text',
  },
  'run': {
    label: {
      en: 'run',
      de: 'run',
      fr: 'run',
      cn: '运行',
      ko: '실행',
    },
    cls: 'run-text',
    debugOnly: true,
  },
};


// This is used both for top level Options and for PerTriggerAutoConfig settings.
// Unfortunately due to poor decisions in the past, PerTriggerOptions has different
// fields here.  This should be fixed.
function setOptionsFromOutputValue(options, value) {
  if (value === 'default') {
    // Nothing.
  } else if (value === 'textAndSound') {
    options.TextAlertsEnabled = true;
    options.SoundAlertsEnabled = true;
    options.SpokenAlertsEnabled = false;
  } else if (value === 'ttsAndText') {
    options.TextAlertsEnabled = true;
    options.SoundAlertsEnabled = true;
    options.SpokenAlertsEnabled = true;
  } else if (value === 'ttsOnly') {
    options.TextAlertsEnabled = false;
    options.SoundAlertsEnabled = true;
    options.SpokenAlertsEnabled = true;
  } else if (value === 'textOnly') {
    options.TextAlertsEnabled = true;
    options.SoundAlertsEnabled = false;
    options.SpokenAlertsEnabled = false;
  } else if (value === 'disabled') {
    options.TextAlertsEnabled = false;
    options.SoundAlertsEnabled = false;
    options.SpokenAlertsEnabled = false;
  } else {
    console.error('unknown output type: ' + value);
  }
}

// TODO: maybe we should also sort all the filenames properly too?
// TODO: maybe each set of triggers should have a translated zone name
// instead of this extremely hacky filename to english function?
function fileNameToTitle(filename) {
  // Strip directory and extension.
  let file = filename.replace(/^.*\//, '').replace('.js', '');
  // Remove non-name characters (probably).
  let name = file.replace(/[_-]/g, ' ');
  // Capitalize the first letter of every word.
  let capitalized = name.replace(/(?:^| )\w/g, (c) => c.toUpperCase());

  // Fully capitalize acronyms like e4n.
  if (capitalized.match(/^\w[0-9]+\w$/))
    capitalized = capitalized.toUpperCase();

  return capitalized;
}

class RaidbossConfigurator {
  constructor(cactbotConfigurator) {
    this.base = cactbotConfigurator;

    // TODO: is it worth adding the complexity to reflect this change in triggers that use it?
    // This is probably where using something like vue or react would be easier.
    // For the moment, folks can just reload, for real.
    this.alertsLang = this.base.getOption('raidboss', 'AlertsLanguage', this.base.lang);
  }

  buildUI(container, raidbossFiles) {
    let group = 'raidboss';
    let files = this.processRaidbossFiles(raidbossFiles);

    let expansionDivs = {};

    for (let k in files) {
      let info = files[k];
      let expansion = this.base.translate(kPrefixToCategory[info.prefix]);
      let type = this.base.translate(kDirectoryToCategory[info.type]);

      if (Object.keys(info.triggers).length == 0)
        continue;

      if (!expansionDivs[expansion]) {
        let expansionContainer = document.createElement('div');
        expansionContainer.classList.add('trigger-expansion-container', 'collapsed');
        container.appendChild(expansionContainer);

        let expansionHeader = document.createElement('div');
        expansionHeader.classList.add('trigger-expansion-header');
        expansionHeader.onclick = () => {
          expansionContainer.classList.toggle('collapsed');
        };
        expansionHeader.innerText = expansion;
        expansionContainer.appendChild(expansionHeader);

        expansionDivs[expansion] = expansionContainer;
      }

      let triggerContainer = document.createElement('div');
      triggerContainer.classList.add('trigger-file-container', 'collapsed');
      expansionDivs[expansion].appendChild(triggerContainer);

      let headerDiv = document.createElement('div');
      headerDiv.classList.add('trigger-file-header');
      headerDiv.onclick = () => {
        triggerContainer.classList.toggle('collapsed');
      };

      let parts = [fileNameToTitle(info.filename), type, expansion];
      for (let i = 0; i < parts.length; ++i) {
        if (!parts[i])
          continue;
        let partDiv = document.createElement('div');
        partDiv.classList.add('trigger-file-header-part');
        partDiv.innerText = parts[i];
        headerDiv.appendChild(partDiv);
      }

      triggerContainer.appendChild(headerDiv);

      let triggerOptions = document.createElement('div');
      triggerOptions.classList.add('trigger-file-options');
      triggerContainer.appendChild(triggerOptions);

      for (let id in info.triggers) {
        let trig = info.triggers[id];

        // Don't construct triggers that won't show anything.
        let detailCount = 0;
        for (let detailKey in kDetailKeys) {
          if (!this.base.developerOptions && kDetailKeys[detailKey].debugOnly)
            continue;
          if (!trig[detailKey] && !trig.output[detailKey])
            continue;
          detailCount++;
        }
        if (detailCount === 0)
          continue;

        // Build the trigger label.
        let triggerDiv = document.createElement('div');
        triggerDiv.innerHTML = trig.id;
        triggerDiv.classList.add('trigger');
        triggerOptions.appendChild(triggerDiv);

        // Container for the right side ui (select boxes, all of the info).
        let triggerDetails = document.createElement('div');
        triggerDetails.classList.add('trigger-details');
        triggerOptions.appendChild(triggerDetails);

        triggerDetails.appendChild(this.buildTriggerOptions(trig, triggerDiv));

        // Append some details about the trigger so it's more obvious what it is.
        for (let detailKey in kDetailKeys) {
          if (!this.base.developerOptions && kDetailKeys[detailKey].debugOnly)
            continue;
          if (!trig[detailKey] && !trig.output[detailKey])
            continue;
          let label = document.createElement('div');
          label.innerText = this.base.translate(kDetailKeys[detailKey].label);
          label.classList.add('trigger-label');
          triggerDetails.appendChild(label);

          let detail = document.createElement('div');
          detail.classList.add('trigger-detail');

          let output = trig.output[detailKey];
          detail.classList.add(kDetailKeys[detailKey].cls);
          if (trig.output[detailKey]) {
            detail.innerText = trig.output[detailKey];
          } else if (typeof trig[detailKey] === 'function') {
            detail.innerText = '(function)';
            detail.classList.add('function-text');
          } else {
            detail.innerText = trig[detailKey];
          }

          triggerDetails.appendChild(detail);
        }
      }
    }
  }

  // This duplicates the raidboss function of the same name.
  valueOrFunction(f, data, matches) {
    let result = (typeof(f) == 'function') ? f(data, matches) : f;
    if (result !== Object(result))
      return result;
    // TODO: somehow use the option for alert language here??
    if (result[this.alertsLang])
      return this.valueOrFunction(result[this.alertsLang]);
    // For partially localized results where this localization doesn't
    // exist, prefer English over nothing.
    return this.valueOrFunction(result['en']);
  }

  processTrigger(trig) {
    let kBaseFakeData = {
      party: new PartyTracker(),
      lang: this.base.lang,
      currentHP: 1000,
      options: this.base.configOptions,
      ShortName: (x) => x,
      StopCombat: () => {},
      ParseLocaleFloat: parseFloat,
      CanStun: () => Util.canStun(this.job),
      CanSilence: () => Util.canSilence(this.job),
      CanSleep: () => Util.canSleep(this.job),
      CanCleanse: () => Util.canCleanse(this.job),
      CanFeint: () => Util.canFeint(this.job),
      CanAddle: () => Util.canAddle(this.job),
    };

    let kFakeData = [
      {
        me: 'Tini Poutini',
        job: 'GNB',
        role: 'tank',
      },
      {
        me: 'Potato Chippy',
        job: 'WHM',
        role: 'healer',
      },
      {
        me: 'Tater Tot',
        job: 'BLM',
        role: 'dps',
      },
      {
        me: 'Hash Brown',
        job: 'DRG',
        role: 'dps',
      },
      {
        me: 'Aloo Gobi',
        job: 'BLU',
        role: 'dps',
      },
    ];

    for (let i = 0; i < kFakeData.length; ++i)
      kFakeData[i] = Object.assign({}, kFakeData[i], kBaseFakeData);


    let kFakeMatches = {
      // TODO: really should convert all triggers to use regexes.js.
      // Mooooost triggers use matches[1] to be a name.
      1: kFakeData[0].me,

      sourceId: '41234567',
      source: 'Enemy',
      id: '1234',
      ability: 'Ability',
      targetId: '1234567',
      target: kFakeData[0].me,
      flags: '',
      x: 100,
      y: 100,
      z: 0,
      heading: 0,
      npcId: undefined,
      effect: 'Effect',
      duration: 30,
      code: '00',
      line: '',
      name: 'Name',
      capture: true,
    };


    let output = {};
    let keys = ['alarmText', 'alertText', 'infoText', 'tts', 'sound'];

    // Try to determine some sample output?
    // This could get much more complicated if we wanted it to.
    let evalTrigger = (trig, key, idx) => {
      try {
        let result = this.valueOrFunction(trig[key], kFakeData[idx], kFakeMatches);
        if (!result)
          return false;

        // Super hack:
        if (result.indexOf('undefined') >= 0 || result.indexOf('NaN') >= 0)
          return false;

        output[key] = result;
        return true;
      } catch (e) {
        // This is all totally bogus.  Many triggers assume fields on data
        // are properly defined when these calls happen, so will throw errors.
        // So just silently ignore.
        return false;
      }
    };

    // Handle 'response' first.
    if (trig.response) {
      let r = trig.response;
      for (let d = 0; d < kFakeData.length; ++d) {
        try {
          // Can't use ValueOrFunction here as r returns a non-localizable object.
          // FIXME: this hackily replicates some raidboss logic too.
          let response = (typeof(r) == 'function') ? r(kFakeData[d], kFakeMatches) : r;
          if (!response)
            continue;
          for (let i = 0; i < keys.length; ++i)
            evalTrigger(response, keys[i], d);
        } catch (e) {
          continue;
        }
      }
    }

    for (let i = 0; i < keys.length; ++i) {
      let key = keys[i];
      if (!trig[key])
        continue;
      for (let d = 0; d < kFakeData.length; ++d) {
        if (evalTrigger(trig, key, d))
          break;
      }
    }

    trig.output = output;

    let lang = this.base.lang;
    let regexLocale = 'regex' + lang.charAt(0).toUpperCase() + lang.slice(1);
    let baseRegex = trig[regexLocale] || trig.regex;
    // FIXME: the current \y{Name} is extremely verbose due to some unicode characters.
    // It would be nice to replace it with something much simpler like `.*?`, as Regexes does.
    // However, this doesn't work for all regexes yet until they are converted over.
    // Once everything using \y{Name} is using Regexes, then get rid of this hack by making
    // \y{Name} be `.*?` itself (or something much simpler along those lines).
    baseRegex = baseRegex.source.replace(/\\y\{Name}/g, '.*?');
    let parsedRegex = Regexes.parse(baseRegex);

    if (trig.isTimelineTrigger)
      trig.timelineRegex = parsedRegex;
    else
      trig.triggerRegex = parsedRegex;

    return trig;
  }

  processRaidbossFiles(raidbossFiles) {
    let map = {};
    for (let filename in raidbossFiles) {
      if (!filename.endsWith('.js'))
        continue;

      let prefix = '00-misc';
      for (let str in kPrefixToCategory) {
        if (!filename.startsWith(str))
          continue;
        prefix = str;
        break;
      }

      let type = 'general';
      for (let str in kDirectoryToCategory) {
        if (filename.indexOf('/' + str + '/') == -1)
          continue;
        type = str;
        break;
      }

      // TODO: maybe raidboss should expose a bunch of its
      let json;
      try {
        json = eval(raidbossFiles[filename]);
      } catch (exception) {
        console.log('Error parsing JSON from ' + filename + ': ' + exception);
        continue;
      }

      // TODO: maybe each trigger set needs a zone name, and we should
      // use that instead of the filename???
      let rawTriggers = {
        trigger: [],
        timeline: [],
      };
      for (let i = 0; i < json.length; ++i) {
        let triggerSet = json[i];
        if (triggerSet.triggers)
          rawTriggers.trigger.push(...triggerSet.triggers);
        if (triggerSet.timelineTriggers)
          rawTriggers.timeline.push(...triggerSet.timelineTriggers);
      }

      let triggers = {};
      for (let key in rawTriggers) {
        let triggerList = rawTriggers[key];
        for (let i = 0; i < triggerList.length; ++i) {
          let trig = triggerList[i];
          if (!trig.id) {
            // TODO: add testing that all triggers have a globally unique id.
            // console.error('missing trigger id in ' + filename + ': ' + JSON.stringify(trig));
            continue;
          }

          trig.isTimelineTrigger = key === 'timeline';
          triggers[trig.id] = this.processTrigger(trig);
        }
      }

      let fileKey = filename.replace(/\//g, '-').replace(/.js$/, '');
      map[fileKey] = {
        filename: filename,
        fileKey: fileKey,
        prefix: prefix,
        type: type,
        json: json,
        triggers: triggers,
      };
    }
    return map;
  }

  buildTriggerOptions(trig, labelDiv) {
    let kField = 'Output';
    let div = document.createElement('div');
    div.classList.add('trigger-options');

    let updateLabel = (input) => {
      if (input.value === 'hidden' || input.value === 'disabled')
        labelDiv.classList.add('disabled');
      else
        labelDiv.classList.remove('disabled');
    };

    let input = document.createElement('select');
    div.appendChild(input);

    let selectValue = this.base.getOption('raidboss', 'triggers', trig.id, kField, 'default');

    for (let key in kTriggerOptions) {
      // Hide debug only options unless they are selected.
      // Otherwise, it will look weird to pick something like 'Disabled',
      // but then not show it when developer options are turned off.
      if (!this.base.developerOptions && kTriggerOptions[key].debugOnly && key !== selectValue)
        continue;
      let elem = document.createElement('option');
      elem.innerHTML = this.base.translate(kTriggerOptions[key].label);
      elem.value = key;
      elem.selected = key === selectValue;
      input.appendChild(elem);

      updateLabel(input);

      input.onchange = () => {
        updateLabel(input);
        let value = input.value;
        if (value.indexOf('default') >= 0)
          value = 'default';
        this.base.setOption('raidboss', 'triggers', trig.id, kField, input.value);
      };
    }

    return div;
  }
}

UserConfig.registerOptions('raidboss', {
  buildExtraUI: (base, container) => {
    let raidbossUrl = new URL('../raidboss/raidboss.html', location.href);
    callOverlayHandler({
      call: 'cactbotReadDataFiles',
      source: raidbossUrl,
    }).then((e) => {
      let files = e.detail.files;

      let builder = new RaidbossConfigurator(base);
      builder.buildUI(container, files);
    });
  },
  processExtraOptions: (options, savedConfig) => {
    options['PerTriggerAutoConfig'] = options['PerTriggerAutoConfig'] || {};
    let triggers = savedConfig.triggers;
    if (!triggers)
      return;

    let perTrigger = options['PerTriggerAutoConfig'];

    let outputObjs = {};
    let keys = Object.keys(kTriggerOptions);
    for (let i = 0; i < keys.length; ++i) {
      outputObjs[keys[i]] = {};
      setOptionsFromOutputValue(outputObjs[keys[i]], keys[i]);
    }

    for (let id in triggers) {
      let output = triggers[id]['Output'];
      if (!output)
        continue;
      perTrigger[id] = outputObjs[output];
    }
  },
  options: [
    {
      id: 'Debug',
      name: {
        en: 'Enable debug mode',
        de: 'Aktiviere Debugmodus',
        fr: 'Activer le mode debug',
        cn: '启用调试模式',
        ko: '디버그 모드 활성화',
      },
      type: 'checkbox',
      debugOnly: true,
    },
    {
      id: 'DefaultAlertOutput',
      name: {
        en: 'Default alert output',
        de: 'Standard Alert Ausgabe',
        fr: 'Alertes par défaut',
        cn: '默认警报输出方式',
        ko: '기본 알람 출력 방식',
      },
      type: 'select',
      options: {
        en: {
          '🆙🔊 Text and Sound': 'textAndSound',
          '🆙💬 Text and TTS': 'ttsAndText',
          '💬 TTS Only': 'ttsOnly',
          '🆙 Text Only': 'textOnly',
        },
        de: {
          '🆙🔊 Text und Ton': 'textAndSound',
          '🆙💬 Text und TTS': 'ttsAndText',
          '💬 Nur TTS': 'ttsOnly',
          '🆙 Nur Text': 'textOnly',
        },
        fr: {
          '🆙🔊 Texte et son': 'textAndSound',
          '🆙💬 Texte et TTS': 'ttsAndText',
          '💬 TTS seulement': 'ttsOnly',
          '🆙 Text seulement': 'textOnly',
        },
        cn: {
          '🆙🔊 文字和声音': 'textAndSound',
          '🆙💬 文字和TTS': 'ttsAndText',
          '💬 只使用TTS': 'ttsOnly',
          '🆙 只使用文字': 'textOnly',
        },
        ko: {
          '🆙🔊 텍스트와 소리': 'textAndSound',
          '🆙💬 텍스트와 TTS': 'ttsAndText',
          '💬 TTS만': 'ttsOnly',
          '🆙 텍스트만': 'textOnly',
        },
      },
      default: 'textAndSound',
      setterFunc: setOptionsFromOutputValue,
    },
    {
      id: 'AlertsLanguage',
      name: {
        en: 'Alerts language',
        de: 'Alert Sprache',
        fr: 'Langue des alertes',
        cn: '警报语言',
        ko: '알람 언어',
      },
      type: 'select',
      options: {
        en: {
          'Use FFXIV Plugin Language': 'default',
          'English (en)': 'en',
          'Chinese (cn)': 'cn',
          'German (de)': 'de',
          'French (fr)': 'fr',
          'Japanese (ja)': 'ja',
          'Korean (ko)': 'ko',
        },
        de: {
          'Benutze FFXIV Plugin Sprache': 'default',
          'Englisch (en)': 'en',
          'Chinesisch (cn)': 'cn',
          'Deutsch (de)': 'de',
          'Französisch (fr)': 'fr',
          'Japanisch (ja)': 'ja',
          'Koreanisch (ko)': 'ko',
        },
        fr: {
          'Utiliser la langue du Plugin FFXIV': 'default',
          'Anglais (en)': 'en',
          'Chinois (cn)': 'cn',
          'Allemand (de)': 'de',
          'Français (fr)': 'fr',
          'Japonais (ja)': 'ja',
          'Coréen (ko)': 'ko',
        },
        cn: {
          '使用最终幻想XIV解析插件设置的语言': 'default',
          '英语 (en)': 'en',
          '汉语 (cn)': 'cn',
          '德语 (de)': 'de',
          '法语 (fr)': 'fr',
          '日语 (ja)': 'ja',
          '朝鲜语 (ko)': 'ko',
        },
        ko: {
          'FFXIV Plugin 언어 사용': 'default',
          '영어 (en)': 'en',
          '중국어 (cn)': 'cn',
          '독일어 (de)': 'de',
          '프랑스어 (fr)': 'fr',
          '일본어 (ja)': 'ja',
          '한국어 (ko)': 'ko',
        },
      },
      default: 'default',
      debug: true,
      setterFunc: (options, value) => {
        if (value === 'default')
          return;
        options['AlertsLanguage'] = value;
      },
    },
    {
      id: 'Skin',
      name: {
        en: 'Raidboss Skin',
        de: 'Raidboss Skin',
        fr: 'Raidboss Skin',
        cn: 'Raidboss皮肤',
        ko: 'Raidboss 스킨',
      },
      type: 'select',
      options: {
        en: {
          'Default': 'default',
          'lippe': 'lippe',
        },
        de: {
          'Default': 'default',
          'lippe': 'lippe',
        },
        fr: {
          'Défaut': 'default',
          'lippe': 'lippe',
        },
        cn: {
          '默认': 'default',
          'lippe': 'lippe',
        },
        ko: {
          '기본': 'default',
          'lippe': 'lippe',
        },
      },
      default: 'default',
    },
    {
      id: 'TimelineEnabled',
      name: {
        en: 'Timeline enabled',
        de: 'Timeline aktiviert',
        fr: 'Timeline activée',
        cn: '启用时间轴',
        ko: '타임라인 활성화',
      },
      type: 'checkbox',
      default: true,
    },
    {
      id: 'AlertsEnabled',
      name: {
        en: 'Alerts enabled',
        de: 'Alerts aktiviert',
        fr: 'Alertes activées',
        cn: '启用警报',
        ko: '알람 활성화',
      },
      type: 'checkbox',
      default: true,
    },
    {
      id: 'ShowTimerBarsAtSeconds',
      name: {
        en: 'Timer bar show window (seconds)',
        de: 'Timer-Bar Anzeigedauer (in Sekunden)',
        fr: 'Affichage fenêtre ligne de temps (secondes)',
        cn: '计时条显示时间（秒）',
        ko: '타임라인을 표시할 기준 시간 (초 이하)',
      },
      type: 'float',
      default: 30,
    },
    {
      id: 'KeepExpiredTimerBarsForSeconds',
      name: {
        en: 'Keep expired timer bar (seconds)',
        de: 'Behalte abgelaufene Timer-Bar (in Sekunden)',
        fr: 'Garder les lignes de temps expirées (secondes)',
        cn: '保留失效计时条时间（秒）',
        ko: '만료된 타임라인이 사라지기까지의 시간 (초)',
      },
      type: 'float',
      default: 0.7,
    },
    {
      id: 'BarExpiresSoonSeconds',
      name: {
        en: 'Time to recolor timer as expiring soon (seconds)',
        de: 'Zeit bis ein bald auslaufender Timer umgefärbt wird (in Sekunden)',
        fr: 'Durée de recolorisation du timer avant expiration (secondes)',
        cn: '计时条即将失效重新着色时间（秒）',
        ko: '타임라인의 색상을 바꿀 기준 시간 (초 이하)',
      },
      type: 'integer',
      default: 6,
    },
    {
      id: 'MaxNumberOfTimerBars',
      name: {
        en: 'Max number of timer bars',
        de: 'Max Anzahl an Timer-Bars',
        fr: 'Nombre max de lignes de temps',
        cn: '计时条最大数量',
        ko: '표시할 타임라인의 최대 개수',
      },
      type: 'integer',
      default: 6,
    },
    {
      id: 'DisplayAlarmTextForSeconds',
      name: {
        en: 'Alarm text display duration (seconds)',
        de: 'Alarm-Text Anzeigedauer (in Sekunden)',
        fr: 'Durée d\'affichage du texte d\'alarme (secondes)',
        cn: '警报文字显示持续时间（秒）',
        ko: '경고 텍스트를 표시할 시간 (초)',
      },
      type: 'float',
      default: 3,
    },
    {
      id: 'DisplayAlertTextForSeconds',
      name: {
        en: 'Alert text display duration (seconds)',
        de: 'Alert-Text Anzeigedauer (in Sekunden)',
        fr: 'Durée d\'affichage du texte d\'alerte (secondes)',
        cn: '警告文字显示持续时间（秒）',
        ko: '주의 텍스트를 표시할 시간 (초)',
      },
      type: 'float',
      default: 3,
    },
    {
      id: 'DisplayInfoTextForSeconds',
      name: {
        en: 'Info text display duration (seconds)',
        de: 'Info-Text Anzeigedauer (in Sekunden)',
        fr: 'Durée d\'affichage du texte d\'information (secondes)',
        cn: '信息文字显示持续时间（秒）',
        ko: '안내 텍스트를 표시할 시간 (초)',
      },
      type: 'float',
      default: 3,
    },
    {
      id: 'AlarmSoundVolume',
      name: {
        en: 'Alarm sound volume (0-1)',
        de: 'Alarm Lautstärke (0-1)',
        fr: 'Volume des alarmes (0-1)',
        cn: '警报声音音量（0-1）',
        ko: '경고 소리 크기 (0-1)',
      },
      type: 'float',
      default: 1,
    },
    {
      id: 'AlertSoundVolume',
      name: {
        en: 'Alert sound volume (0-1)',
        de: 'Alert Lautstärke (0-1)',
        fr: 'Volume des alertes (0-1)',
        cn: '警告声音音量（0-1）',
        ko: '주의 소리 크기 (0-1)',
      },
      type: 'float',
      default: 1,
    },
    {
      id: 'InfoSoundVolume',
      name: {
        en: 'Info sound volume (0-1)',
        de: 'Info Lautstärke (0-1)',
        fr: 'Volume des infos (0-1)',
        cn: '信息声音音量（0-1）',
        ko: '안내 소리 크기 (0-1)',
      },
      type: 'float',
      default: 1,
    },
    {
      id: 'LongSoundVolume',
      name: {
        en: 'Long sound volume (0-1)',
        de: 'Langer Ton Lautstärke (0-1)',
        fr: 'Volume des sons longs (0-1)',
        cn: '长声音音量（0-1）',
        ko: '긴 소리 크기 (0-1)',
      },
      type: 'float',
      default: 1,
    },
    {
      id: 'PullSoundVolume',
      name: {
        en: 'Pull sound volume (0-1)',
        de: 'Pull Lautstärke (0-1)',
        fr: 'Volume du son de pull (0-1)',
        cn: '开怪声音音量（0-1）',
        ko: '풀링 소리 크기 (0-1)',
      },
      type: 'float',
      default: 1,
    },
    {
      id: 'cactbotWormholeStrat',
      // TODO: maybe need some way to group these kinds of
      // options if we end up having a lot?
      name: {
        en: 'Alex Ultimate: enable cactbot Wormhole strat',
        ko: '절 알렉: cactbot 웜홀 공략방식 활성화',
        cn: '亚历山大绝境战：cactbot虫洞辅助功能',
      },
      type: 'checkbox',
      default: false,
    },
  ],
});
