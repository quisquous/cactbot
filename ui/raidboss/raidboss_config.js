'use strict';

let kPrefixToCategory = {
  '00-misc': {
    en: 'General Triggers',
  },
  '02-arr': {
    en: 'A Realm Reborn (ARR 2.x)',
  },
  '03-hw': {
    en: 'Heavensward (HW 3.x)',
  },
  '04-sb': {
    en: 'Stormblood (SB 4.x)',
  },
  '05-shb': {
    en: 'Shadowbringers (ShB 5.x)',
  },
};

let kDirectoryToCategory = {
  alliance: {
    en: 'Alliance Raid',
  },
  dungeon: {
    en: 'Dungeon',
  },
  eureka: {
    en: 'Eureka',
  },
  raid: {
    en: 'Raid',
  },
  pvp: {
    en: 'PVP',
  },
  trial: {
    en: 'Trial',
  },
  ultimate: {
    en: 'Ultimate',
  },
};

// No sound only option, because that's silly.
let kTriggerOptions = {
  default: {
    label: {
      en: '✔ Defaults',
    },
  },
  textAndSound: {
    label: {
      en: '🆙🔊 Text and Sound',
    },
  },
  ttsAndText: {
    label: {
      en: '🆙💬 Text and TTS',
    },
  },
  ttsOnly: {
    label: {
      en: '💬 TTS Only',
    },
  },
  textOnly: {
    label: {
      en: '🆙 Text Only',
    },
  },
  disabled: {
    label: {
      en: '❌ Disabled',
    },
  },
};

let kDetailKeys = {
  'triggerRegex': {
    label: {
      en: 'regex',
    },
    cls: 'regex-text',
    debugOnly: true,
  },
  'timelineRegex': {
    label: {
      en: 'timeline',
    },
    cls: 'regex-text',
    debugOnly: true,
  },
  'condition': {
    label: {
      en: 'condition',
    },
    cls: 'condition-text',
    debugOnly: true,
  },
  'preRun': {
    label: {
      en: 'preRun',
    },
    cls: 'prerun-text',
    debugOnly: true,
  },
  'alarmText': {
    label: {
      en: 'alarm',
    },
    cls: 'alarm-text',
  },
  'alertText': {
    label: {
      en: 'alert',
    },
    cls: 'alert-text',
  },
  'infoText': {
    label: {
      en: 'info',
    },
    cls: 'info-text',
  },
  'tts': {
    label: {
      en: 'tts',
    },
    cls: 'tts-text',
  },
  'sound': {
    label: {
      en: 'sound',
    },
    cls: 'sound-text',
  },
  'run': {
    label: {
      en: 'run',
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
      },
      type: 'checkbox',
      debugOnly: true,
    },
    {
      id: 'DefaultAlertOutput',
      name: {
        en: 'Default alert output',
      },
      type: 'select',
      options: {
        en: {
          '🆙🔊 Text and Sound': 'textAndSound',
          '🆙💬 Text and TTS': 'ttsAndText',
          '💬 TTS Only': 'ttsOnly',
          '🆙 Text Only': 'textOnly',
        },
      },
      default: 'textAndSound',
      setterFunc: setOptionsFromOutputValue,
    },
    {
      id: 'AlertsLanguage',
      name: {
        en: 'Alerts language',
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
      },
      default: 'Use FFXIV Plugin Language',
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
      },
      type: 'select',
      options: {
        en: {
          'Default': 'default',
          'lippe': 'lippe',
        },
      },
      default: 'default',
    },
    {
      id: 'TimelineEnabled',
      name: {
        en: 'Timeline enabled',
      },
      type: 'checkbox',
      default: true,
    },
    {
      id: 'AlertsEnabled',
      name: {
        en: 'Alerts enabled',
      },
      type: 'checkbox',
      default: true,
    },
    {
      id: 'ShowTimerBarsAtSeconds',
      name: {
        en: 'Timer bar show window (seconds)',
      },
      type: 'float',
      default: 30,
    },
    {
      id: 'KeepExpiredTimerBarsForSeconds',
      name: {
        en: 'Keep expired timer bar (seconds)',
      },
      type: 'float',
      default: 0.7,
    },
    {
      id: 'BarExpiresSoonSeconds',
      name: {
        en: 'Time to recolor timer as expiring soon (seconds)',
      },
      type: 'integer',
      default: 6,
    },
    {
      id: 'MaxNumberOfTimerBars',
      name: {
        en: 'Max number of timer bars',
      },
      type: 'integer',
      default: 6,
    },
    {
      id: 'DisplayAlarmTextForSeconds',
      name: {
        en: 'Alarm text display duration (seconds)',
      },
      type: 'float',
      default: 3,
    },
    {
      id: 'DisplayAlertTextForSeconds',
      name: {
        en: 'Alert text display duration (seconds)',
      },
      type: 'float',
      default: 3,
    },
    {
      id: 'DisplayInfoTextForSeconds',
      name: {
        en: 'Info text display duration (seconds)',
      },
      type: 'float',
      default: 3,
    },
    {
      id: 'AlarmSoundVolume',
      name: {
        en: 'Alarm sound volume (0-1)',
      },
      type: 'float',
      default: 1,
    },
    {
      id: 'AlertSoundVolume',
      name: {
        en: 'Alert sound volume (0-1)',
      },
      type: 'float',
      default: 1,
    },
    {
      id: 'InfoSoundVolume',
      name: {
        en: 'Info sound volume (0-1)',
      },
      type: 'float',
      default: 1,
    },
    {
      id: 'LongSoundVolume',
      name: {
        en: 'Long sound volume (0-1)',
      },
      type: 'float',
      default: 1,
    },
    {
      id: 'PullSoundVolume',
      name: {
        en: 'Pull sound volume (0-1)',
      },
      type: 'float',
      default: 1,
    },
  ],
});
