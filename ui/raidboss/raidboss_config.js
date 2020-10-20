'use strict';

// No sound only option, because that's silly.
let kTriggerOptions = {
  default: {
    label: {
      en: '✔ Defaults',
      de: '✔ Standards',
      fr: '✔ Défauts',
      ja: '✔ 初期設定',
      cn: '✔ 默认设置',
      ko: '✔ 기본',
    },
  },
  textAndSound: {
    label: {
      en: '🆙🔊 Text and Sound',
      de: '🆙🔊 Text und Ton',
      fr: '🆙🔊 Texte et son',
      ja: '🆙🔊 テキストと音声',
      cn: '🆙🔊 文字显示与提示音',
      ko: '🆙🔊 텍스트와 소리',
    },
  },
  ttsAndText: {
    label: {
      en: '🆙💬 Text and TTS',
      de: '🆙💬 Text und TTS',
      fr: '🆙💬 Texte et TTS',
      ja: '🆙💬 テキストとTTS',
      cn: '🆙💬 文字显示与TTS',
      ko: '🆙💬 텍스트와 TTS',
    },
  },
  ttsOnly: {
    label: {
      en: '💬 TTS Only',
      de: '💬 Nur TTS',
      fr: '💬 TTS Seulement',
      ja: '💬 TTSのみ',
      cn: '💬 只使用TTS',
      ko: '💬 TTS만',
    },
  },
  textOnly: {
    label: {
      en: '🆙 Text Only',
      de: '🆙 Nur Text',
      fr: '🆙 Texte seulement',
      ja: '🆙 テキストのみ',
      cn: '🆙 只使用文字显示',
      ko: '🆙 텍스트만',
    },
  },
  disabled: {
    label: {
      en: '❌ Disabled',
      de: '❌ Deaktiviert',
      fr: '❌ Désactivé',
      ja: '❌ 無効',
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
      ja: '正規表現',
      cn: '正则表达式',
      ko: '정규식',
    },
    cls: 'regex-text',
    debugOnly: true,
  },
  'triggerNetRegex': {
    label: {
      en: 'netregex',
      de: 'netregex',
      fr: 'netregex',
      ja: 'ネット正規表現',
      cn: '网络日志正则表达式',
    },
    cls: 'regex-text',
    debugOnly: true,
  },
  'timelineRegex': {
    label: {
      en: 'timeline',
      de: 'timeline',
      fr: 'timeline',
      ja: 'タイムライン',
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
      ja: '条件',
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
      ja: 'プレ実行',
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
      ja: '警報',
      cn: '警报文本',
      ko: '경고',
    },
    cls: 'alarm-text',
  },
  'alertText': {
    label: {
      en: 'alert',
      de: 'alert',
      fr: 'alerte',
      ja: '警告',
      cn: '警告文本',
      ko: '주의',
    },
    cls: 'alert-text',
  },
  'infoText': {
    label: {
      en: 'info',
      de: 'info',
      fr: 'info',
      ja: '情報',
      cn: '信息文本',
      ko: '안내',
    },
    cls: 'info-text',
  },
  'tts': {
    label: {
      en: 'tts',
      de: 'tts',
      fr: 'tts',
      ja: 'TTS',
      cn: 'TTS',
      ko: 'tts',
    },
    cls: 'tts-text',
  },
  'sound': {
    label: {
      en: 'sound',
      de: 'sound',
      fr: 'son',
      ja: '音声',
      cn: '提示音',
      ko: '소리',
    },
    cls: 'sound-text',
  },
  'run': {
    label: {
      en: 'run',
      de: 'run',
      fr: 'run',
      ja: '実行',
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

class RaidbossConfigurator {
  constructor(cactbotConfigurator) {
    this.base = cactbotConfigurator;

    // TODO: is it worth adding the complexity to reflect this change in triggers that use it?
    // This is probably where using something like vue or react would be easier.
    // For the moment, folks can just reload, for real.
    this.alertsLang = this.base.getOption('raidboss', 'AlertsLanguage', this.base.lang);
    this.timelineLang = this.base.getOption('raidboss', 'TimelineLanguage', this.base.lang);
  }

  buildUI(container, raidbossFiles) {
    const fileMap = this.processRaidbossFiles(raidbossFiles);

    let expansionDivs = {};

    for (const [key, info] of Object.entries(fileMap)) {
      const expansion = info.prefix;

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

      let parts = [info.title, info.type, expansion];
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
    let result = (typeof f == 'function') ? f(data, matches) : f;
    if (result !== Object(result))
      return result;
    // TODO: somehow use the option for alert language here??
    if (result[this.alertsLang])
      return this.valueOrFunction(result[this.alertsLang]);
    if (result[this.timelineLang])
      return this.valueOrFunction(result[this.timelineLang]);
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
        if (result.includes('undefined') || result.includes('NaN'))
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
          let response = (typeof r == 'function') ? r(kFakeData[d], kFakeMatches) : r;
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

    let getRegex = (baseField) => {
      let shortLanguage = lang.charAt(0).toUpperCase() + lang.slice(1);
      let langSpecificRegex = trig[baseField + shortLanguage] || trig[baseField];
      if (!langSpecificRegex)
        return;
      let baseRegex = Regexes.parse(langSpecificRegex);
      if (!baseRegex)
        return;
      return Regexes.parse(baseRegex);
    };

    if (trig.isTimelineTrigger) {
      trig.timelineRegex = getRegex('regex');
    } else {
      trig.triggerRegex = getRegex('regex');
      trig.triggerNetRegex = getRegex('netRegex');
    }

    return trig;
  }

  processRaidbossFiles(files) {
    let map = this.base.processFiles(files);
    for (let [key, item] of Object.entries(map)) {
      // TODO: maybe each trigger set needs a zone name, and we should
      // use that instead of the filename???
      let rawTriggers = {
        trigger: [],
        timeline: [],
      };
      for (const triggerSet of item.json) {
        if (triggerSet.triggers)
          rawTriggers.trigger.push(...triggerSet.triggers);
        if (triggerSet.timelineTriggers)
          rawTriggers.timeline.push(...triggerSet.timelineTriggers);
      }

      item.triggers = {};
      for (const key in rawTriggers) {
        for (const trig of rawTriggers[key]) {
          if (!trig.id) {
            // TODO: add testing that all triggers have a globally unique id.
            // console.error('missing trigger id in ' + filename + ': ' + JSON.stringify(trig));
            continue;
          }

          trig.isTimelineTrigger = key === 'timeline';
          item.triggers[trig.id] = this.processTrigger(trig);
        }
      }
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
        if (value.includes('default'))
          value = 'default';
        this.base.setOption('raidboss', 'triggers', trig.id, kField, input.value);
      };
    }

    return div;
  }
}

// Raidboss needs to do some extra processing of user files.
const userFileHandler = (name, files, options) => {
  eval(files[name]);

  if (!options.Triggers)
    return;

  for (const set of options.Triggers) {
    // Annotate triggers with where they came from.
    set.filename = `user/${name}`;

    // Convert set.timelineFile to set.timeline.
    if (set.timelineFile) {
      let dir = name.substring(0, name.lastIndexOf('/'));
      dir = dir ? `$(dir)/` : '';

      const timelineFile = `${dir}${set.timelineFile}`;
      delete set.timelineFile;

      if (!(timelineFile in files)) {
        console.log(`ERROR: '${name}' specifies non-existent timeline file '${timelineFile}'.`);
        continue;
      }

      // set.timeline is processed recursively.
      set.timeline = [set.timeline, files[timelineFile]];
    }
  }
};

const templateOptions = {
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
        ja: 'デバッグモードを有効にする',
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
        fr: 'Alerte par défaut',
        ja: '警告情報出力既定値',
        cn: '默认警报提示信息输出方式',
        ko: '기본 알람 출력 방식',
      },
      type: 'select',
      options: {
        en: {
          '🆙🔊 Text and Sound': 'textAndSound',
          '🆙💬 Text and TTS': 'ttsAndText',
          '💬 TTS Only': 'ttsOnly',
          '🆙 Text Only': 'textOnly',
          '❌ Disabled': 'disabled',
        },
        de: {
          '🆙🔊 Text und Ton': 'textAndSound',
          '🆙💬 Text und TTS': 'ttsAndText',
          '💬 Nur TTS': 'ttsOnly',
          '🆙 Nur Text': 'textOnly',
          '❌ Deaktiviert': 'disabled',
        },
        fr: {
          '🆙🔊 Texte et son': 'textAndSound',
          '🆙💬 Texte et TTS': 'ttsAndText',
          '💬 TTS seulement': 'ttsOnly',
          '🆙 Texte seulement': 'textOnly',
          '❌ Désactivé': 'disabled',
        },
        ja: {
          '🆙🔊 テキストと音声': 'textAndSound',
          '🆙💬 テキストとTTS': 'ttsAndText',
          '💬 TTSのみ': 'ttsOnly',
          '🆙 テキストのみ': 'textOnly',
          '❌ 無効': 'disabled',
        },
        cn: {
          '🆙🔊 文字显示与提示音': 'textAndSound',
          '🆙💬 文字显示与TTS': 'ttsAndText',
          '💬 只使用TTS': 'ttsOnly',
          '🆙 只使用文字显示': 'textOnly',
          '❌ 禁用': 'disabled',
        },
        ko: {
          '🆙🔊 텍스트와 소리': 'textAndSound',
          '🆙💬 텍스트와 TTS': 'ttsAndText',
          '💬 TTS만': 'ttsOnly',
          '🆙 텍스트만': 'textOnly',
          '❌ 비활성화': 'disabled',
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
        ja: '警告情報の言語',
        cn: '警报提示文字的语言',
        ko: '알람 언어',
      },
      type: 'select',
      options: {
        en: {
          'Use Display Language': 'default',
          'English (en)': 'en',
          'Chinese (cn)': 'cn',
          'German (de)': 'de',
          'French (fr)': 'fr',
          'Japanese (ja)': 'ja',
          'Korean (ko)': 'ko',
        },
        fr: {
          'Utiliser la langue d\'affichage': 'default',
          'Anglais (en)': 'en',
          'Chinois (cn)': 'cn',
          'Allemand (de)': 'de',
          'Français (fr)': 'fr',
          'Japonais (ja)': 'ja',
          'Coréen (ko)': 'ko',
        },
        ja: {
          '表示言語既定値': 'default',
          '英語 (en)': 'en',
          '中国語 (cn)': 'cn',
          'ドイツ語 (de)': 'de',
          'フランス語 (fr)': 'fr',
          '日本語 (ja)': 'ja',
          '韓国語 (ko)': 'ko',
        },
        cn: {
          '使用显示语言': 'default',
          '英语 (en)': 'en',
          '汉语 (cn)': 'cn',
          '德语 (de)': 'de',
          '法语 (fr)': 'fr',
          '日语 (ja)': 'ja',
          '朝鲜语 (ko)': 'ko',
        },
        ko: {
          '주 사용 언어 사용': 'default',
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
      id: 'TimelineLanguage',
      name: {
        en: 'Timeline language',
        de: 'Timeline Sprache',
        fr: 'Langue de la timeline',
        ja: 'タイムラインの言語',
        cn: '时间轴文本的语言',
        ko: '타임라인 언어',
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
        ja: {
          'FFXIV Pluginの言語設定': 'default',
          '英語 (en)': 'en',
          '中国語 (cn)': 'cn',
          'ドイツ語 (de)': 'de',
          'フランス語 (fr)': 'fr',
          '日本語 (ja)': 'ja',
          '韓国語 (ko)': 'ko',
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
        options['TimelineLanguage'] = value;
      },
    },
    {
      id: 'Skin',
      name: {
        en: 'Raidboss Skin',
        de: 'Raidboss Skin',
        fr: 'Raidboss Skin',
        ja: 'Raidbossのスキン',
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
        ja: {
          '初期設定': 'default',
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
        ja: 'タイムラインを有効にする',
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
        ja: '警告情報を有効にする',
        cn: '启用提示文本显示',
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
        fr: 'Fenêtre d\'affichage de la barre de temps (secondes)',
        ja: 'タイムバーに時間表示 (秒)',
        cn: '计时条显示时长 (秒)',
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
        fr: 'Garder la barre de temps expirée (secondes)',
        ja: '終了したタイムバーが消えるまでの待ち時間 (秒)',
        cn: '已失效的计时条的淡出时间 (秒)',
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
        fr: 'Recolorisation de la barre de temps avant expiration (secondes)',
        ja: 'タイムバーが終了前に再度色付けの残り時間 (秒)',
        cn: '倒计时小于该值时当前计时条变色 (秒)',
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
        fr: 'Nombre max de barres de temps',
        ja: 'タイムバーの最大数',
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
        ja: '警報テキスト表示時間の長さ (秒)',
        cn: '警报文字显示持续时间 (秒)',
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
        ja: '警告テキスト表示時間の長さ (秒)',
        cn: '警告文字显示持续时间 (秒)',
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
        ja: '情報テキスト表示時間の長さ (秒)',
        cn: '信息文字显示持续时间 (秒)',
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
        fr: 'Volume de l\'alarme (0-1)',
        ja: '警報音声の音量 (0-1)',
        cn: '警报提示音的音量 (0-1)',
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
        fr: 'Volume de l\'alerte (0-1)',
        ja: '警告音声の音量 (0-1)',
        cn: '警告提示音的音量 (0-1)',
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
        fr: 'Volume de l\'info (0-1)',
        ja: '情報音声の音量 (0-1)',
        cn: '信息提示音的音量 (0-1)',
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
        fr: 'Volume du son long (0-1)',
        ja: '長い音声の音量 (0-1)',
        cn: '长提示音的音量 (0-1)',
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
        ja: 'タゲ取る効果音の音量 (0-1)',
        cn: '开怪提示音的音量 (0-1)',
        ko: '풀링 소리 크기 (0-1)',
      },
      type: 'float',
      default: 1,
    },
    {
      id: 'BrowserTTS',
      name: {
        en: 'Use Browser for Text to Speech',
        de: 'Verwenden Sie den Browser für Text zu Sprache', // Machine translation
        fr: 'Utiliser le navigateur pour la synthèse vocale', // Machine Translation
        ko: '웹브라우저를 이용해서 TTS 작동시키기',
        ja: 'ブラウザでTTS',
        cn: '忽略ACT的设置，使用Cactbot自带的Google TTS功能（需联网）',
      },
      type: 'checkbox',
      default: false,
    },
    {
      id: 'cactbotWormholeStrat',
      // TODO: maybe need some way to group these kinds of
      // options if we end up having a lot?
      name: {
        en: 'Alex Ultimate: enable cactbot Wormhole strat',
        de: 'Alex Ultimate: aktiviere cactbot Wormhole Strategie',
        fr: 'Alex fatal : activer cactbot pour Wormhole strat',
        ko: '절 알렉: cactbot 웜홀 공략방식 활성화',
        ja: '絶アレキサンダー討滅戦：cactbot「次元断絶のマーチ」ギミック',
        cn: '亚历山大绝境战：cactbot灵泉辅助功能',
      },
      type: 'checkbox',
      default: false,
    },
    {
      id: 'cactbote8sUptimeKnockbackStrat',
      name: {
        en: 'e8s: enable cactbot Uptime Knockback strat',
        de: 'e8s: aktiviere cactbot Uptime Knockback Strategie',
        fr: 'e8s : activer cactbot pour Uptime Knockback strat',
        ja: 'エデン零式共鳴編４層：cactbot「ヘヴンリーストライク (ノックバック)」ギミック',
        cn: 'E8S: 启用cactbot的击退提示功能',
        ko: '공명 영웅 4층: cactbot 정확한 타이밍 넉백방지 공략 활성화',
      },
      type: 'checkbox',
      default: false,
    },
  ],
};

UserConfig.registerOptions('raidboss', templateOptions, userFileHandler);
