import { Lang } from '../../resources/languages';
import { buildNetRegexForTrigger, commonNetRegex } from '../../resources/netregexes';
import { UnreachableCode } from '../../resources/not_reached';
import { addOverlayListener, callOverlayHandler } from '../../resources/overlay_plugin_api';
import PartyTracker from '../../resources/party';
import {
  addPlayerChangedOverrideListener,
  PlayerChangedDetail,
} from '../../resources/player_override';
import Regexes from '../../resources/regexes';
import { translateRegex, translateRegexBuildParam } from '../../resources/translations';
import Util from '../../resources/util';
import ZoneId from '../../resources/zone_id';
import { RaidbossData } from '../../types/data';
import { EventResponses, LogEvent } from '../../types/event';
import { Job, Role } from '../../types/job';
import { Matches } from '../../types/net_matches';
import {
  DataInitializeFunc,
  GeneralNetRegexTrigger,
  LooseTimelineTrigger,
  LooseTrigger,
  LooseTriggerSet,
  Output,
  OutputStrings,
  PartialTriggerOutput,
  RaidbossFileData,
  RegexTrigger,
  ResponseField,
  ResponseOutput,
  TimelineField,
  TimelineFunc,
  TriggerAutoConfig,
  TriggerField,
  TriggerOutput,
} from '../../types/trigger';

import AutoplayHelper from './autoplay_helper';
import BrowserTTSEngine from './browser_tts_engine';
import { PerTriggerAutoConfig, PerTriggerOption, RaidbossOptions } from './raidboss_options';
import { TimelineLoader } from './timeline';
import { TimelineReplacement } from './timeline_parser';

export const isNetRegexTrigger = (
  trigger?: LooseTrigger,
): trigger is Partial<GeneralNetRegexTrigger<RaidbossData, 'None'>> => {
  if (trigger)
    return 'netRegex' in trigger;
  return false;
};

export const isRegexTrigger = (
  trigger?: LooseTrigger,
): trigger is Partial<RegexTrigger<RaidbossData>> => {
  if (trigger)
    return 'regex' in trigger;
  return false;
};

export type ProcessedTrigger = LooseTrigger & {
  filename?: string;
  localRegex?: RegExp;
  localNetRegex?: RegExp;
  output?: Output;
};

// a loaded and localized trigger
export type LocalizedTrigger =
  & LooseTrigger
  & { id: string; filename: string; output?: Output }
  & ({ localRegex: RegExp } | { localNetRegex: RegExp });

export type LoadedTriggerSet = LooseTriggerSet & {
  filename: string;
  timelineTriggers?: Omit<LooseTrigger, 'netRegex'>[];
  triggers?: LooseTrigger[];
};

// There should be (at most) six lines of instructions.
const raidbossInstructions: { [lang in Lang]: string[] } = {
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
  fr: [
    'Instructions :',
    'Ceci est un texte de test pour redimensionner.',
    'Il disparaitra \(ainsi que le fond bleu\) quand',
    'l\'overlay sera bloqué.',
    'Les timelines et triggers seront affichés dans les zones supportées.',
    'Testez raidboss avec un /countdown aux Vergers d\'Estival',
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
const triggerUpperCase = (str: string): string => {
  return str.replace(/[^αβγδ]/g, (x) => x.toUpperCase());
};

const onTriggerException = (trigger: ProcessedTrigger, e: unknown) => {
  // When a fight ends and there are open promises, from delaySeconds or promise itself,
  // all promises will be rejected.  In this case there is no error; simply return without logging.
  if (e === null || typeof e !== 'object')
    return;

  let str = 'Error in trigger: ' + (trigger.id ? trigger.id : '[unknown trigger id]');

  if (trigger.filename)
    str += ' (' + trigger.filename + ')';
  console.error(str);

  if (e instanceof Error) {
    const lines = e.stack?.split('\n') ?? [];
    for (let i = 0; i < lines.length; ++i)
      console.error(lines[i]);
  }
};

const sounds = ['Alarm', 'Alert', 'Info', 'Long', 'Pull'] as const;
const soundStrs: readonly string[] = sounds;

type Sound = typeof sounds[number];
type SoundType = `${Sound}Sound`;
type SoundTypeVolume = `${SoundType}Volume`;

const texts = ['info', 'alert', 'alarm'] as const;

export type Text = typeof texts[number];
type TextUpper = `${Capitalize<Text>}`;
export type TextText = `${Text}Text`;
type TextUpperText = `${TextUpper}Text`;

type TextMap = {
  [text in Text]: {
    text: TextText;
    upperText: TextUpperText;
    upperSound: SoundType;
    upperSoundVolume: SoundTypeVolume;
    rumbleDuration: `${TextUpper}RumbleDuration`;
    rumbleWeak: `${TextUpper}RumbleWeak`;
    rumbleStrong: `${TextUpper}RumbleStrong`;
  };
};

const textMap: TextMap = {
  info: {
    text: 'infoText',
    upperText: 'InfoText',
    upperSound: 'InfoSound',
    upperSoundVolume: 'InfoSoundVolume',
    rumbleDuration: 'InfoRumbleDuration',
    rumbleWeak: 'InfoRumbleWeak',
    rumbleStrong: 'InfoRumbleStrong',
  },
  alert: {
    text: 'alertText',
    upperText: 'AlertText',
    upperSound: 'AlertSound',
    upperSoundVolume: 'AlertSoundVolume',
    rumbleDuration: 'AlertRumbleDuration',
    rumbleWeak: 'AlertRumbleWeak',
    rumbleStrong: 'AlertRumbleStrong',
  },
  alarm: {
    text: 'alarmText',
    upperText: 'AlarmText',
    upperSound: 'AlarmSound',
    upperSoundVolume: 'AlarmSoundVolume',
    rumbleDuration: 'AlarmRumbleDuration',
    rumbleWeak: 'AlarmRumbleWeak',
    rumbleStrong: 'AlarmRumbleStrong',
  },
};

const handleTriggerOverride = <T extends { id?: string }>(triggers: Array<T>): Array<T> => {
  console.log('handleTriggerOverride');
  const keep: Array<T> = [];

  // keep the triggers with id
  const container = new Map<string, T & { id: string }>();

  // loop from new trigger to old trigger.
  // so if trigger with same id exists, just log Overriding and skip
  for (const oldTrigger of triggers.slice().reverse()) {
    if (oldTrigger.id === undefined) {
      keep.push(oldTrigger);
      continue;
    }

    // below, newTrigger and oldTrigger both have `id`

    const newTrigger = container.get(oldTrigger.id);
    if (newTrigger === undefined) {
      keep.push(oldTrigger);
      container.set(oldTrigger.id, oldTrigger as T & { id: string });
      continue;
    }

    const triggerFile = (trigger: ProcessedTrigger) =>
      trigger.filename ? `'${trigger.filename}'` : 'user override';
    const oldFile = triggerFile(newTrigger);
    const newFile = triggerFile(oldTrigger);

    console.log(`Overriding '${oldTrigger.id}' from ${oldFile} with ${newFile}.`);
  }

  return keep.reverse();
};

//   const idx = trigger.id !== undefined ? this.idToIndex[trigger.id] : undefined;
//   if (idx !== undefined && trigger.id !== undefined) {
//     const oldTrigger = this.triggers[idx];
//
//     if (oldTrigger === undefined)
//       throw new UnreachableCode();
//
//     // TODO: be verbose now while this is fresh, but hide this output behind debug flags later.
//     const triggerFile = (trigger: ProcessedTrigger) =>
//       trigger.filename ? `'${trigger.filename}'` : 'user override';
//     const oldFile = triggerFile(oldTrigger);
//     const newFile = triggerFile(trigger);
//     console.log(`Overriding '${trigger.id}' from ${oldFile} with ${newFile}.`);
//
//     this.triggers[idx] = trigger;
//     return;
//   }
//
//   // Normal case of a new trigger, with no overriding.
//   if (trigger.id !== undefined)
//     this.idToIndex[trigger.id] = this.triggers.length;
//   this.triggers.push(trigger);
// };

const isObject = (x: unknown): x is { [key: string]: unknown } => x instanceof Object;

// User trigger may pass anything as parameters
type TriggerParams = { [key: string]: unknown };

class TriggerOutputProxy {
  public outputStrings: OutputStrings;
  public overrideStrings: OutputStrings = {};
  public responseOutputStrings: { [outputName: string]: unknown } = {};
  public unknownValue = '???';

  private constructor(
    public trigger: LooseTrigger,
    public displayLang: Lang,
    public perTriggerAutoConfig?: PerTriggerAutoConfig,
  ) {
    this.outputStrings = trigger.outputStrings ?? {};

    if (trigger.id && perTriggerAutoConfig) {
      const config = perTriggerAutoConfig[trigger.id];
      if (config && config.OutputStrings)
        this.overrideStrings = config.OutputStrings;
    }

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
      set(target, property, value): boolean {
        if (property === 'responseOutputStrings') {
          if (isObject(value)) {
            target[property] = value;
            return true;
          }
          console.error(
            `Invalid responseOutputStrings on trigger ${target.trigger.id ?? 'Unknown'}`,
          );
          return false;
        }

        // Be kind to user triggers that do weird things, and just console error this
        // instead of throwing an exception.
        console.error(`Invalid property '${String(property)}' on output.`);
        return false;
      },

      get(target, name) {
        // TODO: add a test that verifies nobody does this.
        if (name === 'toJSON' || typeof name !== 'string')
          return '{}';

        // Because output.func() must exist at the time of trigger eval,
        // always provide a function even before we know which keys are valid.
        return (params?: TriggerParams) => {
          const id = target.trigger.id ?? 'Unknown Trigger';

          // Priority: per-trigger config from ui > response > built-in trigger
          // Ideally, response provides everything and trigger provides nothing,
          // or there's no response and trigger provides everything.  Having
          // this well-defined smooths out the collision edge cases.
          let str = target.getReplacement(target.overrideStrings[name], params, name, id);
          if (str === undefined) {
            const responseString = target.responseOutputStrings[name];
            if (isObject(responseString))
              str = target.getReplacement(responseString, params, name, id);
          }
          if (str === undefined)
            str = target.getReplacement(target.outputStrings[name], params, name, id);
          if (str === undefined) {
            console.error(`Trigger ${target.trigger.id ?? ''} has missing outputString ${name}.`);
            return target.unknownValue;
          }
          return str;
        };
      },
    });
  }

  getReplacement(
    // Can't use optional modifier for this arg since the others aren't optional
    template: { [lang: string]: unknown } | string | undefined,
    params: TriggerParams | undefined,
    name: string,
    id: string,
  ): string | undefined {
    // If an output strings entry is edited in the config UI and then blanked,
    // the entry will still exist in the config file as an empty string.
    // These should be ignored as not being an override.
    // TODO: maybe blanked/default entries should be deleted from the config?
    if (template === undefined || template === '')
      return;

    let value: unknown;
    if (typeof template === 'string')
      // user config
      value = template;
    else
      value = template[this.displayLang] ?? template['en'];

    if (typeof value !== 'string') {
      console.error(`Trigger ${id} has invalid outputString ${name}.`, JSON.stringify(template));
      return;
    }

    return value.replace(/\${\s*([^}\s]+)\s*}/g, (_fullMatch: string, key: string) => {
      if (params !== undefined && key in params) {
        const str = params[key];
        switch (typeof str) {
          case 'string':
            return str;
          case 'number':
            return str.toString();
        }
        console.error(`Trigger ${id} has non-string param value ${key}.`);
        return this.unknownValue;
      }
      console.error(`Trigger ${id} can't replace ${key} in ${JSON.stringify(template)}.`);
      return this.unknownValue;
    });
  }

  static makeOutput(
    trigger: LooseTrigger,
    displayLang: Lang,
    perTriggerAutoConfig?: PerTriggerAutoConfig,
  ): Output {
    // `Output` is the common type used for the trigger data interface to support arbitrary
    // string keys and always returns a string. However, TypeScript doesn't have good support
    // for the Proxy representing this structure so we need to cast Proxy => unknown => Output
    return new TriggerOutputProxy(trigger, displayLang, perTriggerAutoConfig) as unknown as Output;
  }
}

export type RaidbossTriggerField =
  | TriggerField<RaidbossData, Matches, TriggerOutput<RaidbossData, Matches>>
  | TriggerField<RaidbossData, Matches, PartialTriggerOutput<RaidbossData, Matches>>;
export type RaidbossTriggerOutput =
  | TriggerOutput<RaidbossData, Matches>
  | PartialTriggerOutput<RaidbossData, Matches>;

const defaultOutput = TriggerOutputProxy.makeOutput({}, 'en');

export interface TriggerHelper {
  valueOrFunction: (f: RaidbossTriggerField) => RaidbossTriggerOutput;
  trigger: ProcessedTrigger;
  now: number;
  triggerOptions: PerTriggerOption;
  triggerAutoConfig: TriggerAutoConfig;
  // This setting only suppresses output, trigger still runs for data/logic purposes
  userSuppressedOutput: boolean;
  matches: Matches;
  response?: ResponseOutput<RaidbossData, Matches>;
  // Default options
  soundUrl?: string;
  soundVol?: number;
  triggerSoundVol?: number;
  defaultTTSText?: string;
  textAlertsEnabled: boolean;
  soundAlertsEnabled: boolean;
  spokenAlertsEnabled: boolean;
  groupSpokenAlertsEnabled: boolean;
  duration?: {
    fromConfig?: number;
    fromTrigger?: number;
    alarmText: number;
    alertText: number;
    infoText: number;
  };
  ttsText?: string;
  rumbleDurationMs?: number;
  rumbleWeak?: number;
  rumbleStrong?: number;
  output: Output;
}

const wipeCactbotEcho = commonNetRegex.cactbotWipeEcho;
const wipeEndEcho = commonNetRegex.userWipeEcho;
const wipeFadeIn = commonNetRegex.wipe;

const isWipe = (line: string): boolean => {
  return wipeCactbotEcho.test(line) ||
    wipeEndEcho.test(line) ||
    wipeFadeIn.test(line);
};

export class PopupText {
  protected triggers: ProcessedTrigger[] = [];
  protected netTriggers: ProcessedTrigger[] = [];
  protected timers: { [triggerId: number]: boolean } = {};
  protected triggerSuppress: { [triggerId: string]: number } = {};
  protected currentTriggerID = 0;
  protected inCombat = false;
  protected resetWhenOutOfCombat = true;
  // These are deliberately `| null` for raidemulator extendability reasons
  protected infoText: HTMLElement | null;
  protected alertText: HTMLElement | null;
  protected alarmText: HTMLElement | null;
  protected parserLang: Lang;
  protected displayLang: Lang;
  protected ttsEngine?: BrowserTTSEngine;
  protected ttsSay: (text: string) => void;
  protected partyTracker = new PartyTracker();
  protected readonly kMaxRowsOfText = 2;
  protected data: RaidbossData;
  protected me = '';
  protected job: Job = 'NONE';
  protected role: Role = 'none';

  protected collectedTriggerSets: LoadedTriggerSet[] = [];
  // protected processedTriggerSets: ProcessedTriggerSet[] = [];

  protected zoneName = '';
  protected zoneId = -1;
  protected dataInitializers: {
    file: string;
    func: DataInitializeFunc<RaidbossData>;
  }[] = [];

  constructor(
    protected options: RaidbossOptions,
    protected timelineLoader: TimelineLoader,
    protected raidbossDataFiles: RaidbossFileData,
  ) {
    this.options = options;
    this.timelineLoader = timelineLoader;

    this.collectedTriggerSets = this.ProcessDataFiles(raidbossDataFiles);

    this.infoText = document.getElementById('popup-text-info');
    this.alertText = document.getElementById('popup-text-alert');
    this.alarmText = document.getElementById('popup-text-alarm');

    this.parserLang = this.options.ParserLanguage ?? 'en';
    this.displayLang = this.options.AlertsLanguage ?? this.options.DisplayLanguage ??
      this.options.ParserLanguage ?? 'en';

    if (this.options.IsRemoteRaidboss) {
      this.ttsEngine = new BrowserTTSEngine(this.displayLang);
      this.ttsSay = (text) => {
        this.ttsEngine?.play(this.options.TransformTts(text));
      };
    } else {
      this.ttsSay = (text) => {
        void callOverlayHandler({
          call: 'cactbotSay',
          text: this.options.TransformTts(text),
        });
      };
    }

    this.data = this.getDataObject();

    // check to see if we need user interaction to play audio
    // only if audio is enabled in options
    if (this.options.AudioAllowed)
      AutoplayHelper.CheckAndPrompt();

    this.Reset();
    this.AddDebugInstructions();
    this.HookOverlays();
  }

  AddDebugInstructions(): void {
    raidbossInstructions[this.displayLang].forEach((line, i) => {
      const elem = document.getElementById(`instructions-${i}`);
      if (!elem)
        return;
      elem.innerHTML = line;
    });
  }

  HookOverlays(): void {
    addOverlayListener('PartyChanged', (e) => {
      this.partyTracker.onPartyChanged(e);
    });
    addPlayerChangedOverrideListener((e: PlayerChangedDetail) => {
      this.OnPlayerChange(e);
    }, this.options.PlayerNameOverride);
    addOverlayListener('ChangeZone', (e) => {
      this.OnChangeZone(e);
    });
    addOverlayListener('onInCombatChangedEvent', (e) => {
      this.SetInCombat(e.detail.inGameCombat);
    });
    addOverlayListener('onLogEvent', (e) => {
      this.OnLog(e);
    });
    addOverlayListener('LogLine', (e) => {
      this.OnNetLog(e);
    });
  }

  OnPlayerChange(e: PlayerChangedDetail): void {
    if (this.job !== e.detail.job || this.me !== e.detail.name)
      this.OnJobChange(e);
    this.data.currentHP = e.detail.currentHP;
  }

  ProcessDataFiles(files: RaidbossFileData): LoadedTriggerSet[] {
    const triggerSets: LoadedTriggerSet[] = [];

    for (const [filename, set] of Object.entries(files)) {
      if (!filename.endsWith('.js') && !filename.endsWith('.ts'))
        continue;

      if (typeof set !== 'object') {
        console.log('Unexpected TriggerSet from ' + filename + ', expected an array');
        continue;
      }
      if (!set.triggers) {
        console.log('Unexpected TriggerSet from ' + filename + ', expected a triggers');
        continue;
      }
      if (typeof set.triggers !== 'object' || !(set.triggers.length >= 0)) {
        console.log(
          'Unexpected TriggerSet from ' + filename + ', expected triggers to be an array',
        );
        continue;
      }

      triggerSets.push({
        filename,
        ...set,
      });
    }

    // User triggers must come last so that they override built-in files.
    triggerSets.push(...this.options.LoadedTriggers);

    return triggerSets;
  }

  OnChangeZone(e: EventResponses['ChangeZone']): void {
    if (this.zoneName !== e.zoneName) {
      this.zoneName = e.zoneName;
      this.zoneId = e.zoneID;
      this.ReloadTimelines();
    }
  }

  // this is expected to be called at job change or zone change.
  ReloadTimelines(): void {
    if (!this.me || !this.zoneName || !this.timelineLoader.IsReady())
      return;

    // Drop the triggers and timelines from the previous zone, so we can add new ones.
    this.triggers = [];
    this.netTriggers = [];
    this.dataInitializers = [];
    let timelineFiles = [];
    let timelines: string[] = [];
    const replacements: TimelineReplacement[] = [];
    const timelineStyles = [];
    this.resetWhenOutOfCombat = true;

    // Some user timelines may rely on having valid init data
    // Don't use `this.Reset()` since that clears other things as well
    this.data = this.getDataObject();

    // Recursively/iteratively process timeline entries for triggers.
    // Functions get called with data, arrays get iterated, strings get appended.
    const addTimeline = function(this: PopupText, obj: TimelineField | TimelineFunc | undefined) {
      if (Array.isArray(obj)) {
        for (const objVal of obj)
          addTimeline(objVal);
      } else if (typeof obj === 'function') {
        addTimeline(obj(this.data));
      } else if (obj) {
        timelines.push(obj);
      }
    }.bind(this);

    const timelineTriggers: ProcessedTrigger[] = [];
    const triggers: LocalizedTrigger[] = [];

    for (const set of this.collectedTriggerSets) {
      if (!this.TriggerSetEnabled(set)) {
        continue;
      }

      const processed = this.LocalizeTriggerSet(set);
      if (processed) {
        processed.forEach((x) => triggers.push(x));
      }

      if (set.timelineTriggers) {
        for (const trigger of set.timelineTriggers) {
          // Timeline triggers are never translated.
          timelineTriggers.push(this.ProcessTimelineTrigger(trigger));
        }
      }

      if (set.overrideTimelineFile) {
        // TODO: set.filename won't be undefined
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
          const dir = set.filename.slice(0, Math.max(0, set.filename.lastIndexOf('/')));
          timelineFiles.push(dir + '/' + set.timelineFile);
        } else {
          // Note: For user files, this should get handled by raidboss_config.js,
          // where `timelineFile` should get converted to `timeline`.
          console.error('Can\'t specify timelineFile in non-manifest file:' + set.timelineFile);
        }
      }

      if (set.timeline !== undefined)
        addTimeline(set.timeline);

      if (set.timelineReplace)
        replacements.push(...set.timelineReplace);

      if (set.timelineStyles)
        timelineStyles.push(...set.timelineStyles);
      if (set.resetWhenOutOfCombat !== undefined)
        this.resetWhenOutOfCombat &&= set.resetWhenOutOfCombat;
    }

    // Store all the collected triggers in order, and filter out disabled triggers.
    const filterEnabled = (trigger: { disabled?: boolean }) =>
      !('disabled' in trigger && trigger.disabled);

    const allTriggers = handleTriggerOverride(triggers).filter(filterEnabled);

    this.triggers = allTriggers.filter(isRegexTrigger);
    this.netTriggers = allTriggers.filter(isNetRegexTrigger);

    const finalTimelineTriggers = handleTriggerOverride(timelineTriggers).filter(filterEnabled);

    this.Reset();

    this.timelineLoader.SetTimelines(
      timelineFiles,
      timelines,
      replacements,
      finalTimelineTriggers,
      timelineStyles,
      this.zoneId,
    );
  }

  TriggerSetEnabled(set: LoadedTriggerSet): boolean {
    // zoneRegex can be undefined, a regex, or translatable object of regex.
    const haveZoneRegex = 'zoneRegex' in set;
    const haveZoneId = 'zoneId' in set;
    if (!haveZoneRegex && !haveZoneId || haveZoneRegex && haveZoneId) {
      console.error(`Trigger set must include exactly one of zoneRegex or zoneId property`);
      return false;
    }

    if (haveZoneId && set.zoneId === undefined) {
      // TODO: set.filename will never be undefined or null
      const filename = set.filename ? `'${set.filename}'` : '(user file)';
      console.error(
        `Trigger set has zoneId, but with nothing specified in ${filename}.  Did you misspell the ZoneId.ZoneName?`,
      );
      return false;
    }

    if (set.zoneId !== undefined) {
      if (
        set.zoneId !== ZoneId.MatchAll && set.zoneId !== this.zoneId &&
        !(Array.isArray(set.zoneId) && set.zoneId.includes(this.zoneId))
      )
        return false;
    } else if (set.zoneRegex) {
      let zoneRegex = set.zoneRegex;
      if (typeof zoneRegex !== 'object') {
        console.error(
          'zoneRegex must be translatable object or regexp: ' + JSON.stringify(set.zoneRegex),
        );
        return false;
      }

      if (!(zoneRegex instanceof RegExp)) {
        const parserLangRegex = zoneRegex[this.parserLang];

        if (parserLangRegex) {
          zoneRegex = parserLangRegex;
        } else if (zoneRegex['en']) {
          zoneRegex = zoneRegex['en'];
        } else {
          console.error('unknown zoneRegex parser language: ' + JSON.stringify(set.zoneRegex));
          return false;
        }

        if (!(zoneRegex instanceof RegExp)) {
          console.error('zoneRegex must be regexp: ' + JSON.stringify(set.zoneRegex));
          return false;
        }
      }

      if (this.zoneName.search(Regexes.parse(zoneRegex)) < 0)
        return false;
    }

    return true;
  }

  // process a zone-enabled trigger set
  // return undefined for bad trigger Set
  // process trigger based on current job, options and zone.
  LocalizeTriggerSet(set: LoadedTriggerSet): undefined | LocalizedTrigger[] {
    // construct something like regexDe or regexFr.
    const langSuffix = this.parserLang.charAt(0).toUpperCase() + this.parserLang.slice(1);

    const processedTriggers = [];

    if (this.options.Debug) {
      if (set.filename)
        console.log('Loading ' + set.filename);
      else
        console.log('Loading user triggers for zone');
    }

    const setFilename = set.filename ?? 'Unknown';

    if (set.initData) {
      this.dataInitializers.push({
        file: setFilename,
        func: set.initData,
      });
    }

    // Adjust triggers for the parser language.
    if (set.triggers && this.options.AlertsEnabled) {
      for (const [index, trigger] of set.triggers.entries()) {
        const localized = this.LocalizeTrigger(trigger, set, index, langSuffix);
        if (localized) {
          processedTriggers.push(localized);
        }
      }
    }

    return processedTriggers;
  }

  LocalizeTrigger(
    trigger: LooseTrigger,
    set: LoadedTriggerSet,
    triggerIndex: number,
    langSuffix: string,
  ): LocalizedTrigger | undefined {
    const id: string = trigger.id ?? `${set.filename}.triggers[${triggerIndex}]`;

    const processedTrigger = {
      id: id,
      filename: set.filename,
      output: TriggerOutputProxy.makeOutput(
        trigger,
        this.options.DisplayLanguage,
        this.options.PerTriggerAutoConfig,
      ),
    };

    const triggerObject: { [key: string]: unknown } = trigger;

    // `regex` and `regexDe` (etc) are deprecated, however they may still be used
    // by user triggers, and so are still checked here.  `regexDe` and friends
    // will never be auto-translated and are assumed to be correct.
    // TODO: maybe we could consider removing these once timelines don't need parsed lines?
    if (isRegexTrigger(trigger)) {
      const defaultRegex = trigger.regex;
      const localeRegex = triggerObject['regex' + langSuffix];
      if (localeRegex instanceof RegExp) {
        return {
          ...processedTrigger,
          localRegex: Regexes.parse(localeRegex),
        };
      } else if (defaultRegex) {
        const trans = translateRegex(defaultRegex, this.parserLang, set.timelineReplace);

        return {
          ...processedTrigger,
          localRegex: Regexes.parse(trans),
        };
      }
    }

    // `netRegexDe` (etc) is also deprecated, but they also may still be used by
    // user triggers.  If they exist, they will take precedence over `netRegex`.
    // `netRegex` will be auto-translated into the parser language.  `netRegexDe`
    // and friends will never be auto-translated and are assumed to be correct.
    if (isNetRegexTrigger(trigger)) {
      const defaultNetRegex = trigger.netRegex;
      const localeNetRegex = triggerObject['netRegex' + langSuffix];
      if (localeNetRegex instanceof RegExp) {
        // localized regex don't need to handle net-regex auto build
        return {
          ...processedTrigger,
          localNetRegex: Regexes.parse(localeNetRegex),
        };
      }

      // user write a trigger { netRegex: undefined }
      if (defaultNetRegex === undefined) {
        console.error(`Trigger ${id}: netRegex can't be undefined`);
        return;
      }

      // simple netRegex trigger, need to build netRegex and translate
      if (defaultNetRegex instanceof RegExp) {
        const trans = translateRegex(defaultNetRegex, this.parserLang, set.timelineReplace);

        return {
          ...processedTrigger,
          localNetRegex: Regexes.parse(trans),
        };
      }

      if (trigger.type === undefined) {
        console.error(`Trigger ${id}: without type property need RegExp as netRegex`);
        return;
      }

      const re = buildNetRegexForTrigger(
        trigger.type,
        translateRegexBuildParam(defaultNetRegex, this.parserLang, set.timelineReplace),
      );

      return {
        ...processedTrigger,
        localNetRegex: Regexes.parse(re),
      };
    }

    console.error(`Trigger ${id}: missing regex and netRegex`);
  }

  private ProcessTimelineTrigger(trigger: LooseTimelineTrigger): ProcessedTrigger {
    return {
      ...trigger,
      output: TriggerOutputProxy.makeOutput(
        trigger,
        this.options.DisplayLanguage,
        this.options.PerTriggerAutoConfig,
      ),
    };
  }

  OnJobChange(e: PlayerChangedDetail): void {
    this.me = e.detail.name;
    this.job = e.detail.job;
    this.role = Util.jobToRole(this.job);
    this.ReloadTimelines();
  }

  SetInCombat(inCombat: boolean): void {
    if (this.inCombat === inCombat)
      return;

    this.inCombat = inCombat;
    this.data.inCombat = inCombat;

    if (!this.resetWhenOutOfCombat)
      return;

    // Stop timers when stopping combat to stop any active timers that
    // are delayed.  However, also reset when starting combat.
    // This prevents late attacks from affecting |data| which
    // throws off the next run, potentially.
    if (!this.inCombat) {
      this.StopTimers();
      this.timelineLoader.StopCombat();
    }
    if (this.inCombat)
      this.Reset();
  }

  ShortNamify(name?: string): string {
    // TODO: make this unique among the party in case of first name collisions.
    // TODO: probably this should be a general cactbot utility.
    if (typeof name !== 'string') {
      if (typeof name !== 'undefined')
        console.error('called ShortNamify with non-string');
      return '???';
    }

    const nick = this.options.PlayerNicks[name];

    if (nick)
      return nick;

    const idx = name.indexOf(' ');
    return idx < 0 ? name : name.slice(0, idx);
  }

  Reset(): void {
    Util.clearWatchCombatants();
    this.data = this.getDataObject();
    this.StopTimers();
    this.triggerSuppress = {};
  }

  StopTimers(): void {
    this.timers = {};
  }

  OnLog(e: LogEvent): void {
    // This could conceivably be determined based on the line's contents as well, but
    // not sure if that's worth the effort
    const currentTime = +new Date();
    for (const log of e.detail.logs) {
      for (const trigger of this.triggers) {
        const r = trigger.localRegex?.exec(log);
        if (r)
          this.OnTrigger(trigger, r, currentTime);
      }
    }
  }

  OnNetLog(e: EventResponses['LogLine']): void {
    const log = e.rawLine;
    // This could conceivably be determined based on `new Date(e.line[1])` as well, but
    // not sure if that's worth the effort
    const currentTime = +new Date();

    if (isWipe(log)) {
      // isWipe can be called with `/e end` to stop the timeline due to e.g. countdown but no pull
      // However, `this.inCombat` will already be `false` in that case preventing the timeline from
      // getting stopped. If we're not inCombat and we've hit the wipe conditions defined by
      // `isWipe`, just set it to true first and then to false
      if (!this.inCombat)
        this.SetInCombat(true);
      this.SetInCombat(false);
    }

    for (const trigger of this.netTriggers) {
      const r = trigger.localNetRegex?.exec(log);
      if (r)
        this.OnTrigger(trigger, r, currentTime);
    }
  }

  OnTrigger(
    trigger: ProcessedTrigger,
    matches: RegExpExecArray | null,
    currentTime: number,
  ): void {
    try {
      this.OnTriggerInternal(trigger, matches, currentTime);
    } catch (e) {
      onTriggerException(trigger, e);
    }
  }

  OnTriggerInternal(
    trigger: ProcessedTrigger,
    matches: RegExpExecArray | null,
    currentTime: number,
  ): void {
    if (this._onTriggerInternalCheckSuppressed(trigger, currentTime))
      return;

    let groups: Matches = {};
    // If using named groups, treat matches.groups as matches
    // so triggers can do things like matches.target.
    if (matches && matches.groups) {
      groups = matches.groups;
    } else if (matches) {
      // If there are no matching groups, reproduce the old js logic where
      // groups ended up as the original RegExpExecArray object
      matches.forEach((value, idx) => {
        groups[idx] = value;
      });
    }

    // Set up a helper object so we don't have to throw
    // a ton of info back and forth between subfunctions
    const triggerHelper = this._onTriggerInternalGetHelper(trigger, groups, currentTime);

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

        // Rumble isn't a trigger function, so only needs to be ordered
        // after alarm/alert/info.
        this._onTriggerInternalRumble(triggerHelper);

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
  _onTriggerInternalGetHelper(
    trigger: ProcessedTrigger,
    matches: Matches,
    now: number,
  ): TriggerHelper {
    const id = trigger.id;
    let options: PerTriggerOption = {};
    let config: TriggerAutoConfig = {};
    let suppressed = false;
    if (id) {
      options = this.options.PerTriggerOptions[id] ?? options;
      config = this.options.PerTriggerAutoConfig[id] ?? config;
      suppressed = this.options.DisabledTriggers[id] ?? suppressed;
    }

    const triggerHelper: TriggerHelper = {
      trigger: trigger,
      now: now,
      triggerOptions: options,
      triggerAutoConfig: config,
      // This setting only suppresses output, trigger still runs for data/logic purposes
      userSuppressedOutput: suppressed,
      matches: matches,
      // Default options
      textAlertsEnabled: this.options.TextAlertsEnabled,
      soundAlertsEnabled: this.options.SoundAlertsEnabled,
      spokenAlertsEnabled: this.options.SpokenAlertsEnabled,
      groupSpokenAlertsEnabled: this.options.GroupSpokenAlertsEnabled,
      valueOrFunction: (f: RaidbossTriggerField): RaidbossTriggerOutput => {
        let result = f;
        if (typeof result === 'function')
          result = result(this.data, triggerHelper.matches, triggerHelper.output);
        // All triggers return either a string directly, or an object
        // whose keys are different parser language based names.  For simplicity,
        // this is valid to do for any trigger entry that can handle a function.
        // In case anybody wants to encapsulate any fancy grammar, the values
        // in this object can also be functions.
        if (typeof result !== 'object' || result === null)
          return result;
        return triggerHelper.valueOrFunction(result[this.displayLang] ?? result['en']);
      },
      get output(): Output {
        if (this.trigger.output)
          return this.trigger.output;

        console.log(`Missing trigger.output for trigger ${trigger.id ?? 'Unknown'}`);
        return defaultOutput;
      },
    };

    this._onTriggerInternalHelperDefaults(triggerHelper);

    return triggerHelper;
  }

  _onTriggerInternalCheckSuppressed(trigger: ProcessedTrigger, when: number): boolean {
    const id = trigger.id;
    if (id !== undefined) {
      const suppress = this.triggerSuppress[id];
      if (suppress !== undefined) {
        if (suppress > when)
          return true;

        delete this.triggerSuppress[id];
      }
    }
    return false;
  }

  _onTriggerInternalCondition(triggerHelper: TriggerHelper): boolean {
    const condition = triggerHelper.triggerOptions.Condition ?? triggerHelper.trigger.condition;
    // If the condition is missing or hardcoded as `true`
    if (condition === undefined || condition === true)
      return true;
    // If the condition is hardcoded as `false`
    else if (condition === false)
      return false;

    const conditionFuncReturn = condition(this.data, triggerHelper.matches, triggerHelper.output);
    if (conditionFuncReturn === true)
      return true;
    // Treat all other return values as false (undefined | false)
    return false;
  }

  // Set defaults for triggerHelper object (anything that won't change based on
  // other trigger functions running)
  _onTriggerInternalHelperDefaults(triggerHelper: TriggerHelper): void {
    // Load settings from triggerAutoConfig if they're set
    triggerHelper.textAlertsEnabled = triggerHelper.triggerAutoConfig.TextAlertsEnabled ??
      triggerHelper.textAlertsEnabled;
    triggerHelper.soundAlertsEnabled = triggerHelper.triggerAutoConfig.SoundAlertsEnabled ??
      triggerHelper.soundAlertsEnabled;
    triggerHelper.spokenAlertsEnabled = triggerHelper.triggerAutoConfig.SpokenAlertsEnabled ??
      triggerHelper.spokenAlertsEnabled;

    // Load settings from triggerOptions if they're set
    triggerHelper.textAlertsEnabled = triggerHelper.triggerOptions.TextAlert ??
      triggerHelper.textAlertsEnabled;
    triggerHelper.soundAlertsEnabled = triggerHelper.triggerOptions.SoundAlert ??
      triggerHelper.soundAlertsEnabled;
    triggerHelper.spokenAlertsEnabled = triggerHelper.triggerOptions.SpeechAlert ??
      triggerHelper.spokenAlertsEnabled;
    triggerHelper.groupSpokenAlertsEnabled = triggerHelper.triggerOptions.GroupSpeechAlert ??
      triggerHelper.groupSpokenAlertsEnabled;

    // If the user has suppressed all output for the trigger, reflect that here
    if (triggerHelper.userSuppressedOutput) {
      triggerHelper.textAlertsEnabled = false;
      triggerHelper.soundAlertsEnabled = false;
      triggerHelper.spokenAlertsEnabled = false;
      triggerHelper.groupSpokenAlertsEnabled = false;
    }

    // If the user has disabled audio output, reflect that here
    if (!this.options.AudioAllowed) {
      triggerHelper.soundAlertsEnabled = false;
      triggerHelper.spokenAlertsEnabled = false;
      triggerHelper.groupSpokenAlertsEnabled = false;
    }
  }

  _onTriggerInternalPreRun(triggerHelper: TriggerHelper): void {
    triggerHelper.trigger?.preRun?.(
      this.data,
      triggerHelper.matches,
      triggerHelper.output,
    );
  }

  _onTriggerInternalDelaySeconds(triggerHelper: TriggerHelper): Promise<void> | undefined {
    const delay = 'delaySeconds' in triggerHelper.trigger
      ? triggerHelper.valueOrFunction(triggerHelper.trigger.delaySeconds)
      : 0;
    if (delay === undefined || delay === null || delay <= 0 || typeof delay !== 'number')
      return;

    const triggerID = this.currentTriggerID++;
    this.timers[triggerID] = true;
    return new Promise((res, rej) => {
      window.setTimeout(() => {
        if (this.timers[triggerID])
          res();
        else
          rej(new Error('stopped'));
        delete this.timers[triggerID];
      }, delay * 1000);
    });
  }

  _onTriggerInternalDurationSeconds(triggerHelper: TriggerHelper): void {
    let valueDuration = triggerHelper.valueOrFunction(triggerHelper.trigger.durationSeconds);
    if (typeof valueDuration !== 'number')
      valueDuration = undefined;
    triggerHelper.duration = {
      fromConfig: triggerHelper.triggerAutoConfig.Duration,
      fromTrigger: valueDuration,
      alarmText: this.options.DisplayAlarmTextForSeconds,
      alertText: this.options.DisplayAlertTextForSeconds,
      infoText: this.options.DisplayInfoTextForSeconds,
    };
  }

  _onTriggerInternalSuppressSeconds(triggerHelper: TriggerHelper): void {
    const suppress = 'suppressSeconds' in triggerHelper.trigger
      ? triggerHelper.valueOrFunction(triggerHelper.trigger.suppressSeconds)
      : 0;
    if (typeof suppress !== 'number')
      return;
    if (triggerHelper.trigger.id && suppress > 0)
      this.triggerSuppress[triggerHelper.trigger.id] = triggerHelper.now + suppress * 1000;
  }

  _onTriggerInternalPromise(triggerHelper: TriggerHelper): Promise<void> | undefined {
    let promise: Promise<void> | undefined;
    if ('promise' in triggerHelper.trigger) {
      const id = triggerHelper.trigger.id ?? 'Unknown';
      if (typeof triggerHelper.trigger.promise === 'function') {
        promise = triggerHelper.trigger.promise(
          this.data,
          triggerHelper.matches,
          triggerHelper.output,
        );

        // Make sure we actually get a Promise back from the function
        if (Promise.resolve(promise) !== promise) {
          console.error(`Trigger ${id}: promise function did not return a promise`);
          promise = undefined;
        }
      } else {
        console.error(`Trigger ${id}: promise defined but not a function`);
      }
    }
    return promise;
  }

  _onTriggerInternalSound(triggerHelper: TriggerHelper): void {
    const result = triggerHelper.valueOrFunction(triggerHelper.trigger.sound);
    if (typeof result === 'string')
      triggerHelper.soundUrl = result;
  }

  _onTriggerInternalSoundVolume(triggerHelper: TriggerHelper): void {
    const result = triggerHelper.valueOrFunction(triggerHelper.trigger.soundVolume);
    if (typeof result === 'number')
      triggerHelper.triggerSoundVol = result;
  }

  _onTriggerInternalResponse(triggerHelper: TriggerHelper): void {
    let response: ResponseField<RaidbossData, Matches> = {};
    const trigger = triggerHelper.trigger;
    if (trigger.response) {
      // Can't use ValueOrFunction here as r returns a non-localizable object.
      response = trigger.response;
      while (typeof response === 'function')
        response = response(this.data, triggerHelper.matches, triggerHelper.output);

      // Turn falsy values into a default no-op response.
      if (!response)
        response = {};
    }
    triggerHelper.response = response;
  }

  _onTriggerInternalAlarmText(triggerHelper: TriggerHelper): void {
    this._addTextFor('alarm', triggerHelper);
  }

  _onTriggerInternalAlertText(triggerHelper: TriggerHelper): void {
    this._addTextFor('alert', triggerHelper);
  }

  _onTriggerInternalInfoText(triggerHelper: TriggerHelper): void {
    this._addTextFor('info', triggerHelper);
  }

  _onTriggerInternalRumble(triggerHelper: TriggerHelper): void {
    if (!this.options.RumbleEnabled)
      return;

    // getGamepads returns a "GamePadList" which isn't iterable.
    [...navigator.getGamepads()].forEach((gp) => {
      // This list also contains nulls so that the gamepad index is preserved.
      if (!gp)
        return;

      // `vibrationActuator` is supported in CEF but is not in the spec yet.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const gamepad: any = gp;

      // Future calls to `playEffect` will cut off the previous effect.
      // eslint-disable-next-line max-len
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
      void gamepad?.vibrationActuator?.playEffect(gamepad.vibrationActuator.type, {
        startDelay: 0,
        duration: triggerHelper.rumbleDurationMs,
        weakMagnitude: triggerHelper.rumbleWeak,
        strongMagnitude: triggerHelper.rumbleStrong,
      });
    });
  }

  _onTriggerInternalTTS(triggerHelper: TriggerHelper): void {
    if (!triggerHelper.groupSpokenAlertsEnabled || typeof triggerHelper.ttsText === 'undefined') {
      let result = undefined;
      if (triggerHelper.triggerOptions.TTSText !== undefined) {
        result = triggerHelper.valueOrFunction(triggerHelper.triggerOptions.TTSText);
      } else if (triggerHelper.trigger.tts !== undefined) {
        // Allow null/false/NaN/0/'' in this branch.
        result = triggerHelper.valueOrFunction(triggerHelper.trigger.tts);
      } else if (triggerHelper.response) {
        const resp: ResponseField<RaidbossData, Matches> = triggerHelper.response;
        if (resp.tts !== undefined)
          result = triggerHelper.valueOrFunction(resp.tts);
      }

      // Allow falsey values to disable tts entirely
      // Undefined will fall back to defaultTTSText
      if (result !== undefined) {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (result)
          triggerHelper.ttsText = result?.toString();
      } else {
        triggerHelper.ttsText = triggerHelper.defaultTTSText;
      }
    }
  }

  _onTriggerInternalPlayAudio(triggerHelper: TriggerHelper): void {
    if (
      triggerHelper.trigger.sound !== undefined &&
      triggerHelper.soundUrl &&
      soundStrs.includes(triggerHelper.soundUrl)
    ) {
      const namedSound = triggerHelper.soundUrl + 'Sound';
      const namedSoundVolume = triggerHelper.soundUrl + 'SoundVolume';
      const sound = this.options[namedSound];
      if (typeof sound === 'string') {
        triggerHelper.soundUrl = sound;
        const soundVol = this.options[namedSoundVolume];
        if (typeof soundVol === 'number')
          triggerHelper.soundVol = soundVol;
      }
    }

    triggerHelper.soundUrl = triggerHelper.triggerOptions.SoundOverride ?? triggerHelper.soundUrl;
    triggerHelper.soundVol = triggerHelper.triggerOptions.VolumeOverride ??
      triggerHelper.triggerSoundVol ?? triggerHelper.soundVol;

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
      triggerHelper.ttsText = triggerHelper.ttsText.replace(
        /\s*(<[-=]|[=-]>)\s*/g,
        arrowReplacement[this.displayLang],
      );
      this.ttsSay(triggerHelper.ttsText);
    } else if (triggerHelper.soundUrl && triggerHelper.soundAlertsEnabled) {
      this._playAudioFile(triggerHelper, triggerHelper.soundUrl, triggerHelper.soundVol);
    }
  }

  _onTriggerInternalRun(triggerHelper: TriggerHelper): void {
    triggerHelper.trigger?.run?.(
      this.data,
      triggerHelper.matches,
      triggerHelper.output,
    );
  }

  _createTextFor(
    triggerHelper: TriggerHelper,
    text: string,
    textType: Text,
    lowerTextKey: TextText,
    duration: number,
  ): void {
    // info-text
    const textElementClass = textType + '-text';
    if (textType !== 'info')
      text = triggerUpperCase(text);

    const holder = this[lowerTextKey]?.getElementsByClassName('holder')[0];
    const div = this._makeTextElement(triggerHelper, text, textElementClass);

    if (!holder)
      throw new UnreachableCode();

    holder.appendChild(div);
    if (holder.children.length > this.kMaxRowsOfText)
      holder.firstChild?.remove();

    window.setTimeout(() => {
      if (holder.contains(div))
        holder.removeChild(div);
    }, duration * 1000);
  }

  _addTextFor(textType: Text, triggerHelper: TriggerHelper): void {
    // infoText
    const lowerTextKey = textMap[textType].text;
    // InfoText
    const upperTextKey = textMap[textType].upperText;
    // InfoSound
    const upperSound = textMap[textType].upperSound;
    // InfoSoundVolume
    const upperSoundVolume = textMap[textType].upperSoundVolume;

    let textObj: RaidbossTriggerOutput = triggerHelper.triggerOptions[upperTextKey];
    if (textObj === undefined && triggerHelper.trigger[lowerTextKey] !== undefined)
      textObj = triggerHelper.trigger[lowerTextKey];
    if (textObj === undefined && triggerHelper.response !== undefined)
      textObj = triggerHelper.response[lowerTextKey];
    if (textObj === undefined || textObj === null)
      return;
    let text = triggerHelper.valueOrFunction(textObj);
    if (text === undefined || text === null)
      return;
    if (typeof text === 'number')
      text = text.toString();
    if (typeof text !== 'string')
      text = String(text);
    // Ignore empty strings so that config ui "blank spaces" are ignored.
    text = text.trim();
    if (text === '')
      return;

    triggerHelper.defaultTTSText = triggerHelper.defaultTTSText ?? text;
    if (text && typeof text === 'string' && triggerHelper.textAlertsEnabled) {
      // per-trigger option > trigger field > option duration by text type
      let duration = triggerHelper.duration?.fromConfig ?? triggerHelper.duration?.fromTrigger;
      if (duration === undefined && triggerHelper.duration)
        duration = triggerHelper.duration[lowerTextKey];
      if (duration === undefined)
        duration = 0;

      this._createTextFor(triggerHelper, text, textType, lowerTextKey, duration);
      if (triggerHelper.soundUrl === undefined) {
        triggerHelper.soundUrl = this.options[upperSound];
        triggerHelper.soundVol = this.options[upperSoundVolume];
      }
      if (triggerHelper.rumbleDurationMs === undefined) {
        triggerHelper.rumbleDurationMs = this.options[textMap[textType].rumbleDuration];
        triggerHelper.rumbleWeak = this.options[textMap[textType].rumbleWeak];
        triggerHelper.rumbleStrong = this.options[textMap[textType].rumbleStrong];
      }
    }
  }

  _makeTextElement(_triggerHelper: TriggerHelper, text: string, className: string): HTMLElement {
    const div = document.createElement('div');
    div.classList.add(className);
    div.classList.add('animate-text');
    div.innerText = text;
    return div;
  }

  _playAudioFile(_triggerHelper: TriggerHelper, url: string, volume?: number): void {
    const audio = new Audio(url);
    audio.volume = volume ?? 1;
    void audio.play();
  }

  getDataObject(): RaidbossData {
    let preserveHP = 0;
    // Note that this function gets called in the constructor, before `this.data` has been set.
    if (this.data?.currentHP)
      preserveHP = this.data.currentHP;

    // TODO: make a breaking change at some point and
    // make all this style consistent, sorry.
    const data: RaidbossData = {
      me: this.me,
      job: this.job,
      role: this.role,
      party: this.partyTracker,
      lang: this.parserLang,
      parserLang: this.parserLang,
      displayLang: this.displayLang,
      currentHP: preserveHP,
      options: this.options,
      inCombat: this.inCombat,
      ShortName: this.ShortNamify.bind(this),
      StopCombat: () => this.SetInCombat(false),
      ParseLocaleFloat: parseFloat,
      CanStun: () => Util.canStun(this.job),
      CanSilence: () => Util.canSilence(this.job),
      CanSleep: () => Util.canSleep(this.job),
      CanCleanse: () => Util.canCleanse(this.job),
      CanFeint: () => Util.canFeint(this.job),
      CanAddle: () => Util.canAddle(this.job),
    };

    let triggerData = {};

    for (const initObj of this.dataInitializers) {
      const init = initObj.func;
      const initData = init();
      if (typeof initData === 'object') {
        triggerData = {
          ...triggerData,
          ...initData,
        };
      } else {
        console.log(`Error in file: ${initObj.file}: these triggers may not work;
        initData function returned invalid object: ${init.toString()}`);
      }
    }

    return { ...triggerData, ...data };
  }
}

export class PopupTextGenerator {
  constructor(private popupText: PopupText) {
  }

  Info(text: string, currentTime: number): void {
    this.popupText.OnTrigger(
      {
        infoText: text,
        tts: text,
      },
      null,
      currentTime,
    );
  }

  Alert(text: string, currentTime: number): void {
    this.popupText.OnTrigger(
      {
        alertText: text,
        tts: text,
      },
      null,
      currentTime,
    );
  }

  Alarm(text: string, currentTime: number): void {
    this.popupText.OnTrigger(
      {
        alarmText: text,
        tts: text,
      },
      null,
      currentTime,
    );
  }

  TTS(text: string, currentTime: number): void {
    this.popupText.OnTrigger(
      {
        infoText: text,
        tts: text,
      },
      null,
      currentTime,
    );
  }

  Trigger(trigger: ProcessedTrigger, matches: RegExpExecArray | null, currentTime: number): void {
    this.popupText.OnTrigger(trigger, matches, currentTime);
  }
}
