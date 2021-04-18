import { callOverlayHandler, addOverlayListener } from '../../resources/overlay_plugin_api';

import AutoplayHelper from './autoplay_helper';
import BrowserTTSEngine from './browser_tts_engine';
import { addPlayerChangedOverrideListener } from '../../resources/player_override';
import PartyTracker from '../../resources/party';
import Regexes from '../../resources/regexes';
import Util from '../../resources/util';
import ZoneId from '../../resources/zone_id';

// There should be (at most) six lines of instructions.
const raidbossInstructions = {
  en: [
    'Instructions as follows:',
    'This is debug text for resizing.',
    'It goes away when you lock the overlay',
    'along with the blue background.',
    'Timelines and triggers will show up in supported zones.',
    'Test raidboss with a /countdown in Summerford Farms.',
  ],
  de: [
    'Anweisungen wie folgt:',
    'Dies ist ein Debug-Text zur Größenänderung.',
    'Er verschwindet, wenn du das Overlay sperrst,',
    'zusammen mit dem blauen Hintergrund.',
    'Timeline und Trigger werden in den unterstützten Zonen angezeigt.',
    'Testen Sie Raidboss mit einem /countdown in Sommerfurt-Höfe.',
  ],
  ja: [
    '操作手順：',
    'デバッグ用のテキストです。',
    '青色のオーバーレイを',
    'ロックすれば消える。',
    'サポートするゾーンにタイムラインとトリガーテキストが表示できる。',
    'サマーフォード庄に/countdownコマンドを実行し、raidbossをテストできる。',
  ],
  cn: [
    '请按以下步骤操作：',
    '这是供用户调整悬浮窗大小的调试用文本',
    '当你锁定此蓝色背景的悬浮窗',
    '该文本即会消失。',
    '在支持的区域中会自动加载时间轴和触发器。',
    '可在盛夏农庄使用/countdown命令测试该raidboss模块。',
  ],
  ko: [
    '<조작 설명>',
    '크기 조정을 위한 디버그 창입니다',
    '파란 배경과 이 텍스트는',
    '오버레이를 위치잠금하면 사라집니다',
    '지원되는 구역에서 타임라인과 트리거가 표시됩니다',
    '여름여울 농장에서 초읽기를 실행하여 테스트 해볼 수 있습니다',
  ],
};

// Because apparently people don't understand uppercase greek letters,
// add a special case to not uppercase them.
function triggerUpperCase(str) {
  if (!str)
    return str;
  if (typeof str === 'number')
    return str;
  return str.replace(/[^αβγδ]/g, (x) => x.toUpperCase());
}

function onTriggerException(trigger, e) {
  let str = 'Error in trigger: ' + (trigger.id ? trigger.id : '[unknown trigger id]');

  if (trigger.filename)
    str += ' (' + trigger.filename + ')';
  console.error(str);

  const lines = e.stack.split('\n');
  for (let i = 0; i < lines.length; ++i)
    console.error(lines[i]);
}

// Helper for handling trigger overrides.
//
// asList will return a list of triggers in the same order as append was called, except:
// If a later trigger has the same id as a previous trigger, it will replace the previous trigger
// and appear in the same order that the previous trigger appeared.
// e.g. a, b1, c, b2 (where b1 and b2 share the same id) yields [a, b2, c] as the final list.
//
// JavaScript dictionaries are *almost* ordered automatically as we would want,
// but want to handle missing ids and integer ids (you shouldn't, but just in case).
class OrderedTriggerList {
  constructor() {
    this.idToIndex = {};
    this.triggers = [];
  }

  push(trigger) {
    if (trigger.id && trigger.id in this.idToIndex) {
      const idx = this.idToIndex[trigger.id];

      // TODO: be verbose now while this is fresh, but hide this output behind debug flags later.
      const triggerFile = (trigger) => trigger.filename ? `'${trigger.filename}'` : 'user override';
      const oldFile = triggerFile(this.triggers[idx]);
      const newFile = triggerFile(trigger);
      console.log(`Overriding '${trigger.id}' from ${oldFile} with ${newFile}.`);

      this.triggers[idx] = trigger;
      return;
    }

    // Normal case of a new trigger, with no overriding.
    if (trigger.id)
      this.idToIndex[trigger.id] = this.triggers.length;
    this.triggers.push(trigger);
  }

  asList() {
    return this.triggers;
  }
}

class TriggerOutputProxy {
  constructor(trigger, displayLang, perTriggerAutoConfig) {
    this.trigger = trigger;
    this.outputStrings = trigger.outputStrings || {};
    this.responseOutputStrings = {};
    this.displayLang = displayLang;
    this.unknownValue = '???';
    this.overrideStrings = {};

    if (this.trigger.id && perTriggerAutoConfig && perTriggerAutoConfig[trigger.id])
      this.overrideStrings = perTriggerAutoConfig[trigger.id]['OutputStrings'] || {};

    return new Proxy(this, {
      // Response output string subtlety:
      // Take this example response:
      //
      //    response: (data, matches, output) => {
      //      return {
      //        alarmText: output.someAlarm(),
      //        outputStrings: { someAlarm: 'string' }, // <- impossible
      //      };
      //    },
      //
      // Because the object being returned is evaluated all at once, the object
      // cannot simultaneously define outputStrings and use those outputStrings.
      // So, instead, responses need to set `output.responseOutputStrings`.
      // HOWEVER, this also has its own issues!  This value is set for the trigger
      // (which may have multiple active in flight instances).  This *should* be
      // ok because we guarantee that response/alarmText/alertText/infoText/tts
      // are evaluated sequentially for a single trigger before any other trigger
      // instance evaluates that set of triggers.  Finally, for ease of automating
      // the config ui, the response should return the exact same set of
      // outputStrings every time.  Thank you for coming to my TED talk.
      set(target, property, value) {
        if (property === 'responseOutputStrings') {
          target[property] = value;
          return true;
        }

        // Be kind to user triggers that do weird things, and just console error this
        // instead of throwing an exception.
        console.error(`Invalid property '${property}' on output.`);
      },

      get(target, name) {
        // TODO: add a test that verifies nobody does this.
        if (name === 'toJSON')
          return '{}';

        // Because output.func() must exist at the time of trigger eval,
        // always provide a function even before we know which keys are valid.
        return (params) => {
          // Priority: per-trigger config from ui > response > built-in trigger
          // Ideally, response provides everything and trigger provides nothing,
          // or there's no response and trigger provides everything.  Having
          // this well-defined smooths out the collision edge cases.
          let str = target.getReplacement(target.overrideStrings[name], params, name);
          if (str === null)
            str = target.getReplacement(target.responseOutputStrings[name], params, name);
          if (str === null)
            str = target.getReplacement(target.outputStrings[name], params, name);
          if (str === null) {
            console.error(`Trigger ${target.trigger.id} has missing outputString ${name}.`);
            return target.unknownValue;
          }
          return str;
        };
      },
    });
  }

  getReplacement(template, params, name) {
    if (!template)
      return null;
    if (typeof template === 'object') {
      if (this.displayLang in template)
        template = template[this.displayLang];
      else
        template = template['en'];
    }
    if (typeof template !== 'string') {
      console.error(`Trigger ${this.trigger.id} has invalid outputString ${name}.`);
      return null;
    }

    return template.replace(/\${\s*([^}\s]+)\s*}/g, (fullMatch, key) => {
      if (params && key in params) {
        const str = params[key];
        if (typeof str !== 'string' && typeof str !== 'number') {
          console.error(`Trigger ${this.trigger.id} has non-string param value ${key}.`);
          return this.unknownValue;
        }
        return str;
      }
      console.error(`Trigger ${this.trigger.id} can't replace ${key} in ${template}.`);
      return this.unknownValue;
    });
  }
}

export class PopupText {
  constructor(options, timelineLoader, raidbossDataFiles) {
    this.options = options;
    this.timelineLoader = timelineLoader;
    this.ProcessDataFiles(raidbossDataFiles);

    this.triggers = [];
    this.netTriggers = [];
    this.timers = {};
    this.currentTriggerID = 0;
    this.inCombat = false;
    this.resetWhenOutOfCombat = true;
    this.infoText = document.getElementById('popup-text-info');
    this.alertText = document.getElementById('popup-text-alert');
    this.alarmText = document.getElementById('popup-text-alarm');

    this.parserLang = this.options.ParserLanguage || 'en';
    this.displayLang = this.options.AlertsLanguage || this.options.DisplayLanguage || this.options.ParserLanguage || 'en';

    if (this.options.IsRemoteRaidboss || this.options.BrowserTTS) {
      this.ttsEngine = new BrowserTTSEngine(this.displayLang);
      this.ttsSay = function(text) {
        this.ttsEngine.play(text);
      };
    } else {
      this.ttsSay = function(text) {
        const cmd = { 'call': 'cactbotSay', 'text': text };
        callOverlayHandler(cmd);
      };
    }

    // check to see if we need user interaction to play audio
    // only if audio is enabled in options
    if (this.options.AudioAllowed)
      AutoplayHelper.CheckAndPrompt();

    this.partyTracker = new PartyTracker();

    this.kMaxRowsOfText = 2;

    this.Reset();
    this.AddDebugInstructions();
    this.HookOverlays();
  }

  AddDebugInstructions() {
    const lang = this.displayLang in raidbossInstructions ? this.displayLang : 'en';
    const instructions = raidbossInstructions[lang];
    for (let i = 0; i < instructions.length; ++i) {
      const elem = document.getElementById(`instructions-${i}`);
      if (!elem)
        return;
      elem.innerHTML = instructions[i];
    }
  }

  HookOverlays() {
    addOverlayListener('PartyChanged', (e) => {
      this.partyTracker.onPartyChanged(e);
    });
    addPlayerChangedOverrideListener(this.options.PlayerNameOverride, (e) => {
      this.OnPlayerChange(e);
    });
    addOverlayListener('ChangeZone', (e) => {
      this.OnChangeZone(e);
    });
    addOverlayListener('onInCombatChangedEvent', (e) => {
      this.OnInCombatChange(e.detail.inGameCombat);
    });
    addOverlayListener('onLogEvent', (e) => {
      this.OnLog(e);
    });
    addOverlayListener('LogLine', (e) => {
      this.OnNetLog(e);
    });
  }

  OnPlayerChange(e) {
    if (this.job !== e.detail.job || this.me !== e.detail.name)
      this.OnJobChange(e);
    this.data.currentHP = e.detail.currentHP;
  }

  ProcessDataFiles(files) {
    this.triggerSets = [];
    for (const filename in files) {
      if (!filename.endsWith('.js'))
        continue;

      const json = files[filename];
      if (typeof json !== 'object') {
        console.log('Unexpected JSON from ' + filename + ', expected an array');
        continue;
      }
      if (!('triggers' in json)) {
        console.log('Unexpected JSON from ' + filename + ', expected a triggers');
        continue;
      }
      if (typeof json.triggers !== 'object' || !(json.triggers.length >= 0)) {
        console.log('Unexpected JSON from ' + filename + ', expected triggers to be an array');
        continue;
      }
      json.filename = filename;
      this.triggerSets.push(json);
    }

    // User triggers must come last so that they override built-in files.
    Array.prototype.push.apply(this.triggerSets, this.options.Triggers);
  }

  OnChangeZone(e) {
    if (this.zoneName !== e.zoneName) {
      this.zoneName = e.zoneName;
      this.zoneId = e.zoneID;
      this.ReloadTimelines();
    }
  }

  ReloadTimelines() {
    if (!this.triggerSets || !this.me || !this.zoneName || !this.timelineLoader.IsReady())
      return;

    this.Reset();

    // Drop the triggers and timelines from the previous zone, so we can add new ones.
    this.triggers = [];
    this.netTriggers = [];
    let timelineFiles = [];
    let timelines = [];
    const replacements = [];
    const timelineStyles = [];
    this.resetWhenOutOfCombat = true;

    const orderedTriggers = new OrderedTriggerList();

    // Recursively/iteratively process timeline entries for triggers.
    // Functions get called with data, arrays get iterated, strings get appended.
    const addTimeline = (function(obj) {
      if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; ++i)
          addTimeline(obj[i]);
      } else if (typeof obj === 'function') {
        addTimeline(obj(this.data));
      } else if (obj) {
        timelines.push(obj);
      }
    }).bind(this);

    // construct something like regexEn or regexFr.
    const langSuffix = this.parserLang.charAt(0).toUpperCase() + this.parserLang.slice(1);
    const regexParserLang = 'regex' + langSuffix;
    const netRegexParserLang = 'netRegex' + langSuffix;

    for (const set of this.triggerSets) {
      // zoneRegex can be undefined, a regex, or translatable object of regex.
      const haveZoneRegex = 'zoneRegex' in set;
      const haveZoneId = 'zoneId' in set;
      if (!haveZoneRegex && !haveZoneId || haveZoneRegex && haveZoneId) {
        console.error(`Trigger set must include exactly one of zoneRegex or zoneId property`);
        continue;
      }
      if (haveZoneId && set.zoneId === undefined) {
        const filename = set.filename ? `'${set.filename}'` : '(user file)';
        console.error(`Trigger set has zoneId, but with nothing specified in ${filename}.  ` +
                      `Did you misspell the ZoneId.ZoneName?`);
        continue;
      }

      if (set.zoneId) {
        if (set.zoneId !== ZoneId.MatchAll && set.zoneId !== this.zoneId && !(typeof set.zoneId === 'object' && set.zoneId.includes(this.zoneId)))
          continue;
      } else if (set.zoneRegex) {
        let zoneRegex = set.zoneRegex;
        if (typeof zoneRegex !== 'object') {
          console.error('zoneRegex must be translatable object or regexp: ' + JSON.stringify(set.zoneRegex));
          continue;
        } else if (!(zoneRegex instanceof RegExp)) {
          if (this.parserLang in zoneRegex) {
            zoneRegex = zoneRegex[this.parserLang];
          } else if ('en' in zoneRegex) {
            zoneRegex = zoneRegex['en'];
          } else {
            console.error('unknown zoneRegex parser language: ' + JSON.stringify(set.zoneRegex));
            continue;
          }

          if (!(zoneRegex instanceof RegExp)) {
            console.error('zoneRegex must be regexp: ' + JSON.stringify(set.zoneRegex));
            continue;
          }
        }
        if (this.zoneName.search(Regexes.parse(zoneRegex)) < 0)
          continue;
      }

      if (this.options.Debug) {
        if (set.filename)
          console.log('Loading ' + set.filename);
        else
          console.log('Loading user triggers for zone');
      }
      // Adjust triggers for the parser language.
      if (set.triggers && this.options.AlertsEnabled) {
        for (const trigger of set.triggers) {
          // Add an additional resolved regex here to save
          // time later.  This will clobber each time we
          // load this, but that's ok.
          trigger.filename = set.filename;

          if (!trigger.regex && !trigger.netRegex) {
            console.error('Trigger ' + trigger.id + ': has no regex property specified');
            continue;
          }

          this.ProcessTrigger(trigger);

          // parser-language-based regex takes precedence.
          const regex = trigger[regexParserLang] || trigger.regex;
          if (regex) {
            trigger.localRegex = Regexes.parse(regex);
            orderedTriggers.push(trigger);
          }

          const netRegex = trigger[netRegexParserLang] || trigger.netRegex;
          if (netRegex) {
            trigger.localNetRegex = Regexes.parse(netRegex);
            orderedTriggers.push(trigger);
          }

          if (!regex && !netRegex) {
            console.error('Trigger ' + trigger.id + ': missing regex and netRegex');
            continue;
          }
        }
      }

      if (set.overrideTimelineFile) {
        const filename = set.filename ? `'${set.filename}'` : '(user file)';
        console.log(`Overriding timeline from ${filename}.`);

        // If the timeline file override is set, all previously loaded timeline info is dropped.
        // Styles, triggers, and translations are kept, as they may still apply to the new one.
        timelineFiles = [];
        timelines = [];
      }

      // And set the timeline files/timelines from each set that matches.
      if (set.timelineFile) {
        if (set.filename) {
          const dir = set.filename.substring(0, set.filename.lastIndexOf('/'));
          timelineFiles.push(dir + '/' + set.timelineFile);
        } else {
          // Note: For user files, this should get handled by raidboss_config.js,
          // where `timelineFile` should get converted to `timeline`.
          console.error('Can\'t specify timelineFile in non-manifest file:' + set.timelineFile);
        }
      }

      if (set.timeline)
        addTimeline(set.timeline);
      if (set.timelineReplace)
        replacements.push(...set.timelineReplace);
      if (set.timelineTriggers) {
        for (const trigger of set.timelineTriggers) {
          this.ProcessTrigger(trigger);
          trigger.isTimelineTrigger = true;
          orderedTriggers.push(trigger);
        }
      }
      if (set.timelineStyles)
        timelineStyles.push(...set.timelineStyles);
      if (set.resetWhenOutOfCombat !== undefined)
        this.resetWhenOutOfCombat &= set.resetWhenOutOfCombat;
    }

    // Store all the collected triggers in order, and filter out disabled triggers.
    const filterEnabled = (trigger) => !('disabled' in trigger && trigger.disabled);
    const allTriggers = orderedTriggers.asList().filter(filterEnabled);

    this.triggers = allTriggers.filter((trigger) => trigger.localRegex);
    this.netTriggers = allTriggers.filter((trigger) => trigger.localNetRegex);
    const timelineTriggers = allTriggers.filter((trigger) => trigger.isTimelineTrigger);

    this.timelineLoader.SetTimelines(
        timelineFiles,
        timelines,
        replacements,
        timelineTriggers,
        timelineStyles,
    );
  }

  ProcessTrigger(trigger) {
    // These properties are used internally by ReloadTimelines only and should
    // not exist on user triggers.  However, the trigger objects themselves are
    // reused when reloading pages, and so it is impossible to verify that
    // these properties don't exist.  Therefore, just delete them silently.
    delete trigger.localRegex;
    delete trigger.localNetRegex;
    delete trigger.isTimelineTrigger;

    trigger.output = new TriggerOutputProxy(trigger, this.options.DisplayLanguage,
        this.options.PerTriggerAutoConfig);
  }

  OnJobChange(e) {
    this.me = e.detail.name;
    this.job = e.detail.job;
    this.role = Util.jobToRole(this.job);
    this.ReloadTimelines();
  }

  OnInCombatChange(inCombat) {
    if (this.inCombat === inCombat)
      return;

    if (inCombat || this.resetWhenOutOfCombat)
      this.SetInCombat(inCombat);
  }

  SetInCombat(inCombat) {
    if (this.inCombat === inCombat)
      return;

    // Stop timers when stopping combat to stop any active timers that
    // are delayed.  However, also reset when starting combat.
    // This prevents late attacks from affecting |data| which
    // throws off the next run, potentially.
    this.inCombat = inCombat;
    if (!this.inCombat) {
      this.StopTimers();
      this.timelineLoader.StopCombat();
    }
    if (this.inCombat)
      this.Reset();
  }

  ShortNamify(name) {
    // TODO: make this unique among the party in case of first name collisions.
    // TODO: probably this should be a general cactbot utility.
    if (typeof name !== 'string') {
      console.error('called ShortNamify with non-string');
      return '???';
    }

    if (name in this.options.PlayerNicks)
      return this.options.PlayerNicks[name];

    const idx = name.indexOf(' ');
    return idx < 0 ? name : name.substr(0, idx);
  }

  Reset() {
    let preserveHP = 0;
    if (this.data && this.data.currentHP)
      preserveHP = this.data.currentHP;

    // TODO: make a breaking change at some point and
    // make all this style consistent, sorry.
    this.data = {
      me: this.me,
      job: this.job,
      role: this.role,
      party: this.partyTracker,
      lang: this.parserLang,
      parserLang: this.parserLang,
      displayLang: this.displayLang,
      currentHP: preserveHP,
      options: this.options,
      ShortName: this.ShortNamify,
      StopCombat: () => this.SetInCombat(false),
      ParseLocaleFloat: parseFloat,
      CanStun: () => Util.canStun(this.job),
      CanSilence: () => Util.canSilence(this.job),
      CanSleep: () => Util.canSleep(this.job),
      CanCleanse: () => Util.canCleanse(this.job),
      CanFeint: () => Util.canFeint(this.job),
      CanAddle: () => Util.canAddle(this.job),
    };
    this.StopTimers();
    this.triggerSuppress = {};
  }

  StopTimers() {
    this.timers = {};
  }

  OnLog(e) {
    // This could conceivably be determined based on the line's contents as well, but
    // not sure if that's worth the effort
    const currentTime = +new Date();
    for (const log of e.detail.logs) {
      if (log.includes('00:0038:cactbot wipe'))
        this.SetInCombat(false);

      for (const trigger of this.triggers) {
        const r = log.match(trigger.localRegex);
        if (r)
          this.OnTrigger(trigger, r, currentTime);
      }
    }
  }

  OnNetLog(e) {
    const log = e.rawLine;
    // This could conceivably be determined based on `new Date(e.line[1])` as well, but
    // not sure if that's worth the effort
    const currentTime = +new Date();
    for (const trigger of this.netTriggers) {
      const r = log.match(trigger.localNetRegex);
      if (r)
        this.OnTrigger(trigger, r, currentTime);
    }
  }

  OnTrigger(trigger, matches, currentTime) {
    try {
      this.OnTriggerInternal(trigger, matches, currentTime);
    } catch (e) {
      onTriggerException(trigger, e);
    }
  }

  OnTriggerInternal(trigger, matches, currentTime) {
    if (this._onTriggerInternalCheckSuppressed(trigger, currentTime))
      return;

    // If using named groups, treat matches.groups as matches
    // so triggers can do things like matches.target.
    if (matches && matches.groups)
      matches = matches.groups;

    // Set up a helper object so we don't have to throw
    // a ton of info back and forth between subfunctions
    const triggerHelper = this._onTriggerInternalGetHelper(trigger, matches, currentTime);

    if (!this._onTriggerInternalCondition(triggerHelper))
      return;

    this._onTriggerInternalPreRun(triggerHelper);

    // Evaluate for delay here, but run delay later
    const delayPromise = this._onTriggerInternalDelaySeconds(triggerHelper);
    this._onTriggerInternalDurationSeconds(triggerHelper);
    this._onTriggerInternalSuppressSeconds(triggerHelper);

    const triggerPostDelay = () => {
      const promise = this._onTriggerInternalPromise(triggerHelper);
      const triggerPostPromise = () => {
        this._onTriggerInternalSound(triggerHelper);
        this._onTriggerInternalSoundVolume(triggerHelper);
        this._onTriggerInternalResponse(triggerHelper);
        this._onTriggerInternalAlarmText(triggerHelper);
        this._onTriggerInternalAlertText(triggerHelper);
        this._onTriggerInternalInfoText(triggerHelper);

        // Priority audio order:
        // * user disabled (play nothing)
        // * if tts options are enabled globally or for this trigger:
        //   * user TTS triggers tts override
        //   * tts entries in the trigger
        //   * default alarm tts
        //   * default alert tts
        //   * default info tts
        // * if sound options are enabled globally or for this trigger:
        //   * user trigger sound overrides
        //   * sound entries in the trigger
        //   * alarm noise
        //   * alert noise
        //   * info noise
        // * else, nothing
        //
        // In general, tts comes before sounds and user overrides come
        // before defaults.  If a user trigger or tts entry is specified as
        // being valid but empty, this will take priority over the default
        // tts texts from alarm/alert/info and will prevent tts from playing
        // and allowing sounds to be played instead.
        this._onTriggerInternalTTS(triggerHelper);
        this._onTriggerInternalPlayAudio(triggerHelper);
        this._onTriggerInternalRun(triggerHelper);
      };

      // The trigger body must run synchronously when there is no promise.
      if (promise)
        promise.then(triggerPostPromise, (e) => onTriggerException(trigger, e));
      else
        triggerPostPromise();
    };

    // The trigger body must run synchronously when there is no delay.
    if (delayPromise)
      delayPromise.then(triggerPostDelay, (e) => onTriggerException(trigger, e));
    else
      triggerPostDelay();
  }

  // Build a default triggerHelper object for this trigger
  _onTriggerInternalGetHelper(trigger, matches, now) {
    const triggerHelper = {
      trigger: trigger,
      now: now,
      triggerOptions: trigger.id && this.options.PerTriggerOptions[trigger.id] || {},
      triggerAutoConfig: trigger.id && this.options.PerTriggerAutoConfig[trigger.id] || {},
      // This setting only suppresses output, trigger still runs for data/logic purposes
      userSuppressedOutput: trigger.id && this.options.DisabledTriggers[trigger.id],
      matches: matches,
      response: undefined,
      // Default options
      soundUrl: undefined,
      soundVol: undefined,
      triggerSoundVol: undefined,
      defaultTTSText: undefined,
      textAlertsEnabled: this.options.TextAlertsEnabled,
      soundAlertsEnabled: this.options.SoundAlertsEnabled,
      spokenAlertsEnabled: this.options.SpokenAlertsEnabled,
      GroupSpokenAlertsEnabled: this.options.GroupSpokenAlertsEnabled,
      duration: undefined,
      ttsText: undefined,
    };

    // Separate the creation of triggerHelper and creation of valueOrFunction
    // method so ValueOrFunction can execute properly
    triggerHelper.valueOrFunction = (f) => {
      let result = f;
      if (typeof result === 'function')
        result = result(this.data, triggerHelper.matches, trigger.output);
      // All triggers return either a string directly, or an object
      // whose keys are different parser language based names.  For simplicity,
      // this is valid to do for any trigger entry that can handle a function.
      // In case anybody wants to encapsulate any fancy grammar, the values
      // in this object can also be functions.
      if (typeof result !== 'object' || result === null)
        return result;
      return triggerHelper.valueOrFunction(result[this.displayLang] || result['en']);
    },

    this._onTriggerInternalHelperDefaults(triggerHelper);

    return triggerHelper;
  }

  _onTriggerInternalCheckSuppressed(trigger, when) {
    if (trigger.id && trigger.id in this.triggerSuppress) {
      if (this.triggerSuppress[trigger.id] > when)
        return true;

      delete this.triggerSuppress[trigger.id];
    }
    return false;
  }

  _onTriggerInternalCondition(triggerHelper) {
    const condition = triggerHelper.triggerOptions.Condition || triggerHelper.trigger.condition;
    if (condition) {
      if (!condition(this.data, triggerHelper.matches))
        return false;
    }
    return true;
  }

  // Set defaults for triggerHelper object (anything that won't change based on
  // other trigger functions running)
  _onTriggerInternalHelperDefaults(triggerHelper) {
    if (triggerHelper.triggerAutoConfig) {
      if ('TextAlertsEnabled' in triggerHelper.triggerAutoConfig)
        triggerHelper.textAlertsEnabled = triggerHelper.triggerAutoConfig.TextAlertsEnabled;
      if ('SoundAlertsEnabled' in triggerHelper.triggerAutoConfig)
        triggerHelper.soundAlertsEnabled = triggerHelper.triggerAutoConfig.SoundAlertsEnabled;
      if ('SpokenAlertsEnabled' in triggerHelper.triggerAutoConfig)
        triggerHelper.spokenAlertsEnabled = triggerHelper.triggerAutoConfig.SpokenAlertsEnabled;
    }

    if (triggerHelper.triggerOptions) {
      if ('TextAlert' in triggerHelper.triggerOptions)
        triggerHelper.textAlertsEnabled = triggerHelper.triggerOptions.TextAlert;
      if ('SoundAlert' in triggerHelper.triggerOptions)
        triggerHelper.soundAlertsEnabled = triggerHelper.triggerOptions.SoundAlert;
      if ('SpeechAlert' in triggerHelper.triggerOptions)
        triggerHelper.spokenAlertsEnabled = triggerHelper.triggerOptions.SpeechAlert;
      if ('GroupSpeechAlert' in triggerHelper.triggerOptions)
        triggerHelper.groupSpokenAlertsEnabled = triggerHelper.triggerOptions.GroupSpeechAlert;
    }

    if (triggerHelper.userSuppressedOutput) {
      triggerHelper.textAlertsEnabled = false;
      triggerHelper.soundAlertsEnabled = false;
      triggerHelper.spokenAlertsEnabled = false;
      triggerHelper.groupSpokenAlertsEnabled = false;
    }
    if (!this.options.AudioAllowed) {
      triggerHelper.soundAlertsEnabled = false;
      triggerHelper.spokenAlertsEnabled = false;
      triggerHelper.groupSpokenAlertsEnabled = false;
    }
  }

  _onTriggerInternalPreRun(triggerHelper) {
    if ('preRun' in triggerHelper.trigger)
      triggerHelper.trigger.preRun(this.data, triggerHelper.matches, triggerHelper.trigger.output);
  }

  _onTriggerInternalDelaySeconds(triggerHelper) {
    const delay = 'delaySeconds' in triggerHelper.trigger ? triggerHelper.valueOrFunction(triggerHelper.trigger.delaySeconds) : 0;
    if (!delay || delay <= 0)
      return null;

    const triggerID = this.currentTriggerID++;
    this.timers[triggerID] = true;
    return new Promise((res, rej) => {
      window.setTimeout(() => {
        if (this.timers[triggerID])
          res();
        else if (rej)
          rej();
        delete this.timers[triggerID];
      }, delay * 1000);
    });
  }

  _onTriggerInternalDurationSeconds(triggerHelper) {
    triggerHelper.duration = {
      fromConfig: triggerHelper.triggerAutoConfig['Duration'],
      fromTrigger: triggerHelper.valueOrFunction(triggerHelper.trigger.durationSeconds),
      alarmText: this.options.DisplayAlarmTextForSeconds,
      alertText: this.options.DisplayAlertTextForSeconds,
      infoText: this.options.DisplayInfoTextForSeconds,
    };
  }

  _onTriggerInternalSuppressSeconds(triggerHelper) {
    const suppress = 'suppressSeconds' in triggerHelper.trigger ? triggerHelper.valueOrFunction(triggerHelper.trigger.suppressSeconds) : 0;
    if (triggerHelper.trigger.id && suppress > 0)
      this.triggerSuppress[triggerHelper.trigger.id] = triggerHelper.now + (suppress * 1000);
  }

  _onTriggerInternalPromise(triggerHelper) {
    let promise = null;
    if ('promise' in triggerHelper.trigger) {
      if (typeof triggerHelper.trigger.promise === 'function') {
        promise = triggerHelper.trigger.promise(
            this.data,
            triggerHelper.matches,
            triggerHelper.trigger.output);

        // Make sure we actually get a Promise back from the function
        if (Promise.resolve(promise) !== promise) {
          console.error('Trigger ' + triggerHelper.trigger.id + ': promise function did not return a promise');
          promise = null;
        }
      } else {
        console.error('Trigger ' + triggerHelper.trigger.id + ': promise defined but not a function');
      }
    }
    return promise;
  }

  _onTriggerInternalSound(triggerHelper) {
    triggerHelper.soundUrl = triggerHelper.valueOrFunction(triggerHelper.trigger.sound);
  }

  _onTriggerInternalSoundVolume(triggerHelper) {
    triggerHelper.triggerSoundVol =
      triggerHelper.valueOrFunction(triggerHelper.trigger.soundVolume);
  }

  _onTriggerInternalResponse(triggerHelper) {
    let response = {};
    const trigger = triggerHelper.trigger;
    if (trigger.response) {
      // Can't use ValueOrFunction here as r returns a non-localizable object.
      response = trigger.response;
      while (typeof response === 'function')
        response = response(this.data, triggerHelper.matches, trigger.output);

      // Turn falsy values into a default no-op response.
      if (!response)
        response = {};
    }
    triggerHelper.response = response;
  }

  _onTriggerInternalAlarmText(triggerHelper) {
    this._addTextFor('alarm', triggerHelper);
  }

  _onTriggerInternalAlertText(triggerHelper) {
    this._addTextFor('alert', triggerHelper);
  }

  _onTriggerInternalInfoText(triggerHelper) {
    this._addTextFor('info', triggerHelper);
  }

  _onTriggerInternalTTS(triggerHelper) {
    if (!triggerHelper.groupSpokenAlertsEnabled || typeof triggerHelper.ttsText === 'undefined') {
      if ('TTSText' in triggerHelper.triggerOptions)
        triggerHelper.ttsText = triggerHelper.valueOrFunction(triggerHelper.triggerOptions.TTSText);
      else if ('tts' in triggerHelper.trigger)
        triggerHelper.ttsText = triggerHelper.valueOrFunction(triggerHelper.trigger.tts);
      else if ('tts' in triggerHelper.response)
        triggerHelper.ttsText = triggerHelper.valueOrFunction(triggerHelper.response.TTSText);
      else
        triggerHelper.ttsText = triggerHelper.defaultTTSText;
    }
  }

  _onTriggerInternalPlayAudio(triggerHelper) {
    if (triggerHelper.trigger.sound && triggerHelper.soundUrl) {
      const namedSound = triggerHelper.soundUrl + 'Sound';
      const namedSoundVolume = triggerHelper.soundUrl + 'SoundVolume';
      if (namedSound in this.options) {
        triggerHelper.soundUrl = this.options[namedSound];
        if (namedSoundVolume in this.options)
          triggerHelper.soundVol = this.options[namedSoundVolume];
      }
    }

    triggerHelper.soundUrl = triggerHelper.triggerOptions.SoundOverride || triggerHelper.soundUrl;
    triggerHelper.soundVol = triggerHelper.triggerOptions.VolumeOverride ||
      triggerHelper.triggerSoundVol || triggerHelper.soundVol;

    // Text to speech overrides all other sounds.  This is so
    // that a user who prefers tts can still get the benefit
    // of infoText triggers without tts entries by turning
    // on (speech=true, text=true, sound=true) but this will
    // not cause tts to play over top of sounds or noises.
    if (triggerHelper.ttsText && triggerHelper.spokenAlertsEnabled) {
      // Heuristics for auto tts.
      // * In case this is an integer.
      triggerHelper.ttsText = triggerHelper.ttsText.toString();
      // * Remove a bunch of chars.
      triggerHelper.ttsText = triggerHelper.ttsText.replace(/[#!]/g, '');
      // * slashes between mechanics
      triggerHelper.ttsText = triggerHelper.ttsText.replace('/', ' ');
      // * tildes at the end for emphasis
      triggerHelper.ttsText = triggerHelper.ttsText.replace(/~+$/, '');
      // * arrows helping visually simple to understand e.g. ↖ Front left / Back right ↘
      triggerHelper.ttsText = triggerHelper.ttsText.replace(/[↖-↙]/g, '');
      // * Korean TTS reads wrong with '1번째'
      triggerHelper.ttsText = triggerHelper.ttsText.replace('1번째', '첫번째');
      // * arrows at the front or the end are directions, e.g. "east =>"
      triggerHelper.ttsText = triggerHelper.ttsText.replace(/[-=]>\s*$/g, '');
      triggerHelper.ttsText = triggerHelper.ttsText.replace(/^\s*<[-=]/g, '');
      // * arrows in the middle are a sequence, e.g. "in => out => spread"
      const arrowReplacement = {
        en: ' then ',
        de: ' dann ',
        fr: ' puis ',
        ja: 'や',
        cn: '然后',
        ko: ' 그리고 ',
      };
      triggerHelper.ttsText = triggerHelper.ttsText.replace(/\s*(<[-=]|[=-]>)\s*/g,
          arrowReplacement[this.displayLang]);
      this.ttsSay(triggerHelper.ttsText);
    } else if (triggerHelper.soundUrl && triggerHelper.soundAlertsEnabled) {
      this._playAudioFile(triggerHelper.soundUrl, triggerHelper.soundVol);
    }
  }

  _onTriggerInternalRun(triggerHelper) {
    if ('run' in triggerHelper.trigger)
      triggerHelper.trigger.run(this.data, triggerHelper.matches, triggerHelper.trigger.output);
  }

  _createTextFor(text, textType, lowerTextKey, duration) {
    // info-text
    const textElementClass = textType + '-text';
    if (textType !== 'info')
      text = triggerUpperCase(text);
    const holder = this[lowerTextKey].getElementsByClassName('holder')[0];
    const div = this._makeTextElement(text, textElementClass);

    holder.appendChild(div);
    if (holder.children.length > this.kMaxRowsOfText)
      holder.removeChild(holder.children[0]);

    window.setTimeout(() => {
      if (holder.contains(div))
        holder.removeChild(div);
    }, duration * 1000);
  }

  _addTextFor(textType, triggerHelper) {
    // Info
    const textTypeUpper = textType[0].toUpperCase() + textType.slice(1);
    // infoText
    const lowerTextKey = textType + 'Text';
    // InfoText
    const upperTextKey = textTypeUpper + 'Text';
    const textObj = triggerHelper.triggerOptions[upperTextKey] ||
      triggerHelper.trigger[lowerTextKey] || triggerHelper.response[lowerTextKey];
    if (textObj) {
      const text = triggerHelper.valueOrFunction(textObj);
      triggerHelper.defaultTTSText = triggerHelper.defaultTTSText || text;
      if (text && triggerHelper.textAlertsEnabled) {
        // per-trigger option > trigger field > option duration by text type
        const duration = triggerHelper.duration.fromConfig ||
          triggerHelper.duration.fromTrigger || triggerHelper.duration[lowerTextKey];
        this._createTextFor(text, textType, lowerTextKey, duration);
        if (!triggerHelper.soundUrl) {
          triggerHelper.soundUrl = this.options[textTypeUpper + 'Sound'];
          triggerHelper.soundVol = this.options[textTypeUpper + 'SoundVolume'];
        }
      }
    }
  }

  _makeTextElement(text, className) {
    const div = document.createElement('div');
    div.classList.add(className);
    div.classList.add('animate-text');
    div.innerText = text;
    return div;
  }

  _playAudioFile(url, volume) {
    const audio = new Audio(url);
    audio.volume = volume || 1;
    audio.play();
  }

  Test(zone, log) {
    this.OnPlayerChange({ detail: { name: 'ME' } });
    this.OnChangeZone({ zoneName: zone });
    this.OnLog({ detail: { logs: ['abcdefgh', log, 'hgfedcba'] } });
  }
}

export class PopupTextGenerator {
  constructor(popupText) {
    this.popupText = popupText;
  }

  Info(text) {
    this.popupText.OnTrigger({
      infoText: text,
      tts: text,
    });
  }

  Alert(text) {
    this.popupText.OnTrigger({
      alertText: text,
      tts: text,
    });
  }

  Alarm(text) {
    this.popupText.OnTrigger({
      alarmText: text,
      tts: text,
    });
  }

  TTS(text) {
    this.popupText.OnTrigger({
      infoText: text,
      tts: text,
    });
  }

  Trigger(trigger, matches) {
    const currentTime = +new Date();
    this.popupText.OnTrigger(trigger, matches, currentTime);
  }
}
