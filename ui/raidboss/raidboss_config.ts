import { isLang, Lang } from '../../resources/languages';
import { UnreachableCode } from '../../resources/not_reached';
import PartyTracker from '../../resources/party';
import Regexes from '../../resources/regexes';
import { triggerOutputFunctions } from '../../resources/responses';
import UserConfig, {
  ConfigValue,
  OptionsTemplate,
  UserFileCallback,
} from '../../resources/user_config';
import { BaseOptions, RaidbossData } from '../../types/data';
import { SavedConfigEntry } from '../../types/event';
import { Job, Role } from '../../types/job';
import { Matches } from '../../types/net_matches';
import {
  LocaleText,
  LooseTrigger,
  Output,
  OutputStrings,
  RaidbossFileData,
  TimelineField,
  TriggerAutoConfig,
} from '../../types/trigger';
import {
  CactbotConfigurator,
  ConfigLooseTrigger,
  ConfigLooseTriggerSet,
  ConfigProcessedFileMap,
} from '../config/config';

import raidbossFileData from './data/raidboss_manifest.txt';
import { RaidbossTriggerField, RaidbossTriggerOutput } from './popup-text';
import raidbossOptions, { RaidbossOptions } from './raidboss_options';
import { TimelineParser } from './timeline_parser';

const kOptionKeys = {
  output: 'Output',
  duration: 'Duration',
  beforeSeconds: 'BeforeSeconds',
  outputStrings: 'OutputStrings',
} as const;

type TriggerSoundOption = {
  label: LocaleText;
  debugOnly?: boolean;
};

// No sound only option, because that's silly.
const kTriggerOptions = {
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
} as const;

const triggerSoundOptions: { [key: string]: TriggerSoundOption } = kTriggerOptions;

type DetailKey = {
  label: LocaleText;
  cls: string;
  debugOnly?: boolean;
  generatedManually?: boolean;
};

const kDetailKeys = {
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
      ko: '정규표현식',
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
  'beforeSeconds': {
    label: {
      en: 'before (sec)',
      de: 'Vorher (Sekunden)',
      fr: 'avant (seconde)',
      ja: 'その前に (秒)',
      cn: '提前 (秒)',
      ko: '앞당김 (초)',
    },
    cls: 'before-seconds-text',
    generatedManually: true,
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
  'duration': {
    label: {
      en: 'duration (sec)',
      de: 'Dauer (Sekunden)',
      fr: 'Durée (secondes)',
      ja: '存続時間 (秒)',
      cn: '持续时间 (秒)',
      ko: '지속 시간 (초)',
    },
    cls: 'duration-text',
    generatedManually: true,
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
      ko: 'TTS',
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
} as const;

// Ordered set of headers in the timeline edit table.
const kTimelineTableHeaders = {
  shouldDisplayText: {
    en: 'Show',
  },
  text: {
    en: 'Timeline Text',
  },
  overrideText: {
    en: 'Rename',
  },
} as const;

const detailKeys: { [key in keyof LooseTrigger]: DetailKey } = kDetailKeys;

const kMiscTranslations = {
  // Shows up for un-set values.
  valueDefault: {
    en: '(default)',
    de: '(Standard)',
    fr: '(Défaut)',
    ja: '(初期値)',
    cn: '(默认值)',
    ko: '(기본값)',
  },
  // Shown when the UI can't decipher the output of a function.
  valueIsFunction: {
    en: '(function)',
    de: '(Funktion)',
    fr: '(Fonction)',
    ja: '(関数)',
    cn: '(函数)',
    ko: '(함수)',
  },
  // Warning label for triggers without ids or overridden triggers.
  warning: {
    en: '⚠️ warning',
    de: '⚠️ Warnung',
    fr: '⚠️ Attention',
    ja: '⚠️ 警告',
    cn: '⚠️ 警告',
    ko: '⚠️ 주의',
  },
  // Shows up for triggers without ids.
  missingId: {
    en: 'missing id field',
    de: 'Fehlendes ID Feld',
    fr: 'Champ ID manquant',
    ja: 'idがありません',
    cn: '缺少id属性',
    ko: 'ID 필드값 없음',
  },
  // Shows up for triggers that are overridden by other triggers.
  overriddenByFile: {
    en: 'overridden by "${file}"',
    de: 'Überschrieben durch "${file}"',
    fr: 'Écrasé(e) par "${file}"',
    ja: '"${file}"に上書きました',
    cn: '被"${file}"文件覆盖',
    ko: '"${file}" 파일에서 덮어씌움',
  },
  // Opens trigger file on Github.
  viewTriggerSource: {
    en: 'View Trigger Source',
    de: 'Zeige Trigger Quelle',
    fr: 'Afficher la source du Trigger',
    ja: 'トリガーのコードを表示',
    cn: '显示触发器源码',
    ko: '트리거 출처 열기',
  },
  // The header for the editing timeline section inside a trigger file.
  editTimeline: {
    en: 'Edit Timeline',
  },
};

const validDurationOrUndefined = (valEntry?: SavedConfigEntry) => {
  if (typeof valEntry !== 'string' && typeof valEntry !== 'number')
    return undefined;
  const val = parseFloat(valEntry.toString());
  if (!isNaN(val) && val >= 0)
    return val;
  return undefined;
};

const canBeConfigured = (trig: ConfigLooseTrigger) => !trig.isMissingId && !trig.overriddenByFile;

const addTriggerDetail = (
  container: HTMLElement,
  labelText: string,
  detailText: string,
  detailCls?: string[],
): void => {
  const label = document.createElement('div');
  label.innerText = labelText;
  label.classList.add('trigger-label');
  container.appendChild(label);

  const detail = document.createElement('div');
  detail.classList.add('trigger-detail');
  detail.innerText = detailText;
  container.appendChild(detail);

  if (detailCls)
    detail.classList.add(...detailCls);
};

// This is used both for top level Options and for PerTriggerAutoConfig settings.
// Unfortunately due to poor decisions in the past, PerTriggerOptions has different
// fields here.  This should be fixed.
const setOptionsFromOutputValue = (
  options: BaseOptions | TriggerAutoConfig,
  value: SavedConfigEntry,
) => {
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
    console.error(`unknown output type: ${value.toString()}`);
  }
};

// Helper for doing nothing during trigger eval, but still recording any
// calls to `output.responseOutputStrings = x;` via callback.
class DoNothingFuncProxy {
  constructor(outputStringsCallback: (outputStrings: OutputStrings) => void) {
    return new Proxy(this, {
      set(target, property, value): boolean {
        if (property === 'responseOutputStrings') {
          // TODO: need some way of verifying that a value is an OutputStrings.
          outputStringsCallback(value as OutputStrings);
          return true;
        }

        // Ignore other property setting here.
        return false;
      },

      get(_target, _name) {
        return () => {/* noop */};
      },
    });
  }
}

const makeLink = (href: string) => {
  return `<a href="${href}" target="_blank">${href}</a>`;
};

const langOrEn = (lang: ConfigValue): Lang => {
  return typeof lang === 'string' && isLang(lang) ? lang : 'en';
};

class RaidbossConfigurator {
  private base: CactbotConfigurator;
  private alertsLang: Lang;
  private timelineLang: Lang;

  constructor(cactbotConfigurator: CactbotConfigurator) {
    this.base = cactbotConfigurator;

    // TODO: is it worth adding the complexity to reflect this change in triggers that use it?
    // This is probably where using something like vue or react would be easier.
    // For the moment, folks can just reload, for real.
    this.alertsLang = langOrEn(this.base.getOption('raidboss', 'AlertsLanguage', this.base.lang));
    this.timelineLang = langOrEn(
      this.base.getOption('raidboss', 'TimelineLanguage', this.base.lang),
    );
  }

  buildUI(container: HTMLElement, raidbossFiles: RaidbossFileData, userOptions: RaidbossOptions) {
    const fileMap = this.processRaidbossFiles(raidbossFiles, userOptions);

    const expansionDivs: { [expansion: string]: HTMLElement } = {};

    for (const [key, info] of Object.entries(fileMap)) {
      // "expansion" here is technically section, which includes "general triggers"
      // and one section per user file.
      const expansion = info.section;

      if (!info.triggers || Object.keys(info.triggers).length === 0)
        continue;

      let expansionDiv = expansionDivs[expansion];
      if (!expansionDiv) {
        const expansionContainer = document.createElement('div');
        expansionContainer.classList.add('trigger-expansion-container', 'collapsed');
        container.appendChild(expansionContainer);

        const expansionHeader = document.createElement('div');
        expansionHeader.classList.add('trigger-expansion-header');
        expansionHeader.onclick = () => {
          expansionContainer.classList.toggle('collapsed');
        };
        expansionHeader.innerText = expansion;
        expansionContainer.appendChild(expansionHeader);

        expansionDiv = expansionDivs[expansion] = expansionContainer;
      }

      const triggerContainer = document.createElement('div');
      triggerContainer.classList.add('trigger-file-container', 'collapsed');
      expansionDiv.appendChild(triggerContainer);

      const headerDiv = document.createElement('div');
      headerDiv.classList.add('trigger-file-header');
      headerDiv.onclick = () => {
        triggerContainer.classList.toggle('collapsed');
      };

      const parts = [info.title, info.type, info.prefix];
      for (const part of parts) {
        if (!part)
          continue;
        const partDiv = document.createElement('div');
        partDiv.classList.add('trigger-file-header-part');
        // Use innerHTML here because of <Emphasis>Whorleater</Emphasis>.
        partDiv.innerHTML = part;
        headerDiv.appendChild(partDiv);
      }

      triggerContainer.appendChild(headerDiv);

      // Timeline editing is tied to a single, specific zoneId per file for now.
      // We could add more indirection (via fileKey?) and look up zoneId -> fileKey[]
      // and fileKey -> timeline edits if needed.
      if (info.triggerSet.timeline && typeof info.zoneId === 'number')
        this.buildTimelineUIContainer(info.zoneId, info.triggerSet, triggerContainer, userOptions);

      const triggerOptions = document.createElement('div');
      triggerOptions.classList.add('trigger-file-options');
      triggerContainer.appendChild(triggerOptions);

      for (const [trigId, trig] of Object.entries(info.triggers ?? {})) {
        // Don't construct triggers that won't show anything.
        let hasOutputFunc = false;
        for (const func of triggerOutputFunctions) {
          if (func in trig) {
            hasOutputFunc = true;
            break;
          }
        }
        if (!hasOutputFunc && !this.base.developerOptions)
          continue;

        // Build the trigger label.
        const triggerDiv = document.createElement('div');
        triggerDiv.innerHTML = trig.isMissingId ? '(???)' : trigId;

        triggerDiv.classList.add('trigger');
        triggerOptions.appendChild(triggerDiv);

        // Container for the right side ui (select boxes, all of the info).
        const triggerDetails = document.createElement('div');
        triggerDetails.classList.add('trigger-details');
        triggerOptions.appendChild(triggerDetails);

        if (canBeConfigured(trig))
          triggerDetails.appendChild(this.buildTriggerOptions(trig, triggerDiv));

        if (trig.isMissingId) {
          addTriggerDetail(
            triggerDetails,
            this.base.translate(kMiscTranslations.warning),
            this.base.translate(kMiscTranslations.missingId),
          );
        }
        if (trig.overriddenByFile) {
          const baseText = this.base.translate(kMiscTranslations.overriddenByFile);
          const detailText = baseText.replace('${file}', trig.overriddenByFile);
          addTriggerDetail(
            triggerDetails,
            this.base.translate(kMiscTranslations.warning),
            detailText,
          );
        }

        // Append some details about the trigger so it's more obvious what it is.
        for (const [detailStringKey, opt] of Object.entries(detailKeys)) {
          // Object.entries coerces to a string, but the detailKeys definition makes this true.
          const detailKey = detailStringKey as keyof LooseTrigger;

          if (opt.generatedManually)
            continue;
          if (!this.base.developerOptions && opt.debugOnly)
            continue;
          const trigOutput = trig.configOutput?.[detailKey];
          const trigFunc = trig[detailKey];
          if (!trigFunc)
            continue;

          const detailCls = [opt.cls];
          let detailText: string | undefined;
          if (trigOutput) {
            detailText = trigOutput;
          } else if (typeof trigFunc === 'function') {
            detailText = this.base.translate(kMiscTranslations.valueIsFunction);
            detailCls.push('function-text');
          } else {
            detailText = trigFunc.toString();
          }

          addTriggerDetail(
            triggerDetails,
            this.base.translate(opt.label),
            detailText,
            detailCls,
          );
        }

        if (!canBeConfigured(trig))
          continue;

        // Add beforeSeconds manually for timeline triggers.
        if (trig.isTimelineTrigger) {
          const detailKey = 'beforeSeconds';
          const optionKey = kOptionKeys.beforeSeconds;

          const label = document.createElement('div');
          label.innerText = this.base.translate(kDetailKeys[detailKey].label);
          label.classList.add('trigger-label');
          triggerDetails.appendChild(label);

          const div = document.createElement('div');
          div.classList.add('option-input-container', 'trigger-before-seconds');

          const input = document.createElement('input');
          div.appendChild(input);
          input.type = 'text';
          input.step = 'any';

          // Say "(default)" for more complicated things like functions.
          let defaultValue = this.base.translate(kMiscTranslations.valueDefault);
          if (trig.beforeSeconds === undefined)
            defaultValue = '0';
          else if (typeof trig.beforeSeconds === 'number')
            defaultValue = trig.beforeSeconds.toString();

          input.placeholder = defaultValue;
          input.value = this.base.getStringOption('raidboss', ['triggers', trigId, optionKey], '');
          const setFunc = () => {
            const val = validDurationOrUndefined(input.value) || '';
            this.base.setOption('raidboss', ['triggers', trigId, optionKey], val);
          };
          input.onchange = setFunc;
          input.oninput = setFunc;

          triggerDetails.appendChild(div);
        }

        // Add duration manually with an input to override.
        if (hasOutputFunc) {
          const detailKey = 'duration';
          const optionKey = kOptionKeys.duration;

          const label = document.createElement('div');
          label.innerText = this.base.translate(kDetailKeys[detailKey].label);
          label.classList.add('trigger-label');
          triggerDetails.appendChild(label);

          const div = document.createElement('div');
          div.classList.add('option-input-container', 'trigger-duration');

          const input = document.createElement('input');
          div.appendChild(input);
          input.type = 'text';
          input.step = 'any';
          if (typeof trig.durationSeconds === 'number')
            input.placeholder = `${trig.durationSeconds}`;
          else
            input.placeholder = this.base.translate(kMiscTranslations.valueDefault);
          input.value = this.base.getStringOption('raidboss', ['triggers', trigId, optionKey], '');
          const setFunc = () => {
            const val = validDurationOrUndefined(input.value) || '';
            this.base.setOption('raidboss', ['triggers', trigId, optionKey], val);
          };
          input.onchange = setFunc;
          input.oninput = setFunc;

          triggerDetails.appendChild(div);
        }

        // Add output strings manually
        const outputStrings = trig.outputStrings || {};

        for (const [key, outputString] of Object.entries(outputStrings)) {
          const optionKey = kOptionKeys.outputStrings;
          const template = typeof outputString === 'string'
            ? outputString
            : this.base.translate(outputString);

          const label = document.createElement('div');
          label.innerText = key;
          label.classList.add('trigger-outputstring-label');
          triggerDetails.appendChild(label);

          const div = document.createElement('div');
          div.classList.add('option-input-container', 'trigger-outputstring');

          const input = document.createElement('input');
          div.appendChild(input);
          input.type = 'text';
          input.placeholder = template;
          input.value = this.base.getStringOption(
            'raidboss',
            ['triggers', trigId, optionKey, key],
            '',
          );
          const setFunc = () =>
            this.base.setOption('raidboss', ['triggers', trigId, optionKey, key], input.value);
          input.onchange = setFunc;
          input.oninput = setFunc;

          triggerDetails.appendChild(div);
        }

        const label = document.createElement('div');
        triggerDetails.appendChild(label);

        const path = key.split('-');
        const [p0, p1, p2] = path;
        if (p0 !== undefined && p1 !== undefined && p2 !== undefined) {
          const div = document.createElement('div');
          div.classList.add('option-input-container', 'trigger-source');
          const baseUrl = 'https://github.com/quisquous/cactbot/blob/triggers';
          let urlFilepath;
          if (path.length === 3) {
            // 00-misc/general.js
            urlFilepath = `${p0}-${p1}/${[...path].slice(2).join('-')}`;
          } else {
            // 02-arr/raids/t1.js
            urlFilepath = `${p0}-${p1}/${p2}/${[...path].slice(3).join('-')}`;
          }
          const escapedTriggerId = trigId.replace(/'/g, '\\\'');
          const uriComponent = encodeURIComponent(`id: '${escapedTriggerId}'`).replace(/'/g, '%27');
          const urlString = `${baseUrl}/${urlFilepath}.js#:~:text=${uriComponent}`;
          div.innerHTML = `<a href="${urlString}" target="_blank">(${
            this.base.translate(kMiscTranslations.viewTriggerSource)
          })</a>`;

          triggerDetails.appendChild(div);
        }
      }
    }
  }

  // Build the top level timeline editing expandable container.
  buildTimelineUIContainer(
    zoneId: number,
    set: ConfigLooseTriggerSet,
    parent: HTMLElement,
    options: RaidbossOptions,
  ): void {
    const container = document.createElement('div');
    container.classList.add('timeline-edit-container', 'collapsed');
    parent.appendChild(container);

    let hasEverBeenExpanded = false;

    const headerDiv = document.createElement('div');
    headerDiv.classList.add('timeline-edit-header');
    headerDiv.onclick = () => {
      container.classList.toggle('collapsed');
      // Build the rest of this UI on demand lazily.
      if (!hasEverBeenExpanded) {
        const timeline = this.timelineFromSet(set, options);
        this.buildTimelineUI(zoneId, timeline, container);
      }
      hasEverBeenExpanded = true;
    };
    headerDiv.innerText = this.base.translate(kMiscTranslations.editTimeline);
    container.appendChild(headerDiv);
  }

  // Returns a parsed timeline from a given trigger set.
  timelineFromSet(set: ConfigLooseTriggerSet, options: RaidbossOptions): TimelineParser {
    let text = '';

    // Recursively turn the timeline array into a string.
    const addTimeline = (obj?: TimelineField) => {
      if (obj === undefined)
        return;
      if (Array.isArray(obj)) {
        for (const objVal of obj)
          addTimeline(objVal);
      } else if (typeof obj === 'function') {
        // Hack, pass blank data in, as we don't have a real data here.
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        const blankData: RaidbossData = {} as RaidbossData;
        try {
          addTimeline(obj(blankData));
        } catch (e) {
          // Do nothing if this fails.
          // Functions are pretty uncommon in built-in timelines.
          // If user functions do funky things, those extra lines will be skipped.
        }
      } else if (obj) {
        text = `${text}\n${obj}`;
      }
    };
    addTimeline(set.timeline);
    // Using the timelineReplace and the current set of options lets the timeline
    // entries look like they would in game.
    return new TimelineParser(text, set.timelineReplace ?? [], [], [], options);
  }

  // The internal part of timeline editing ui.
  buildTimelineUI(zoneId: number, timeline: TimelineParser, parent: HTMLElement): void {
    const uniqEvents: { [key: string]: string } = {};

    for (const event of timeline.events) {
      if (event.name in uniqEvents)
        continue;
      if (event.name in timeline.ignores)
        continue;
      uniqEvents[event.name] = event.text;
    }

    const container = document.createElement('div');
    container.classList.add('timeline-text-container');
    parent.appendChild(container);

    for (const header of Object.values(kTimelineTableHeaders)) {
      const div = document.createElement('div');
      div.innerText = this.base.translate(header);
      container.appendChild(div);
    }

    const keys = Object.keys(uniqEvents).sort();
    for (const key of keys) {
      const event = uniqEvents[key];
      if (!event)
        continue;

      const checkInput = document.createElement('input');
      checkInput.classList.add('timeline-text-enable');
      checkInput.type = 'checkbox';
      container.appendChild(checkInput);

      const enableId = ['timeline', zoneId.toString(), 'enable', key];
      const defaultValue = true;
      checkInput.checked = this.base.getBooleanOption('raidboss', enableId, defaultValue);
      checkInput.onchange = () => this.base.setOption('raidboss', enableId, checkInput.checked);

      const timelineText = document.createElement('div');
      timelineText.classList.add('timeline-text-text');
      timelineText.innerHTML = event;
      container.appendChild(timelineText);

      const textInput = document.createElement('input');
      textInput.classList.add('timeline-text-edit');
      textInput.placeholder = event;

      const textId = ['timeline', zoneId.toString(), 'globalReplace', key];
      textInput.value = this.base.getStringOption('raidboss', textId, '');
      const setFunc = () => this.base.setOption('raidboss', textId, textInput.value);
      textInput.onchange = setFunc;
      textInput.oninput = setFunc;

      container.appendChild(textInput);
    }
  }

  // This duplicates the raidboss function of the same name.
  valueOrFunction(
    f: RaidbossTriggerField,
    data: RaidbossData,
    matches: Matches,
    output: Output,
  ): RaidbossTriggerOutput {
    const result = (typeof f === 'function') ? f(data, matches, output) : f;
    if (result !== Object(result))
      return result;
    if (typeof result !== 'object' || result === null)
      return result;
    if (result[this.alertsLang])
      return this.valueOrFunction(result[this.alertsLang], data, matches, output);
    if (result[this.timelineLang])
      return this.valueOrFunction(result[this.timelineLang], data, matches, output);
    // For partially localized results where this localization doesn't
    // exist, prefer English over nothing.
    return this.valueOrFunction(result['en'], data, matches, output);
  }

  processTrigger(trig: ConfigLooseTrigger): ConfigLooseTrigger {
    // TODO: with some hackiness (e.g. regexes?) we could figure out which
    // output string came from which alert type (alarm, alert, info, tts).
    // See `makeOutput` comments for why this needs a type assertion to be an Output.
    const fakeOutputProxy = new DoNothingFuncProxy((outputStrings: OutputStrings) => {
      trig.outputStrings = trig.outputStrings || {};
      Object.assign(trig.outputStrings, outputStrings);
    }) as Output;

    const baseFakeData: RaidbossData = {
      me: '',
      job: 'NONE',
      role: 'none',
      party: new PartyTracker(),
      lang: this.base.lang,
      currentHP: 1000,
      options: this.base.configOptions,
      ShortName: (x?: string) => x ?? '???',
      StopCombat: () => {/* noop */},
      ParseLocaleFloat: parseFloat,
      CanStun: () => false,
      CanSilence: () => false,
      CanSleep: () => false,
      CanCleanse: () => false,
      CanFeint: () => false,
      CanAddle: () => false,
      parserLang: this.base.lang,
      displayLang: this.base.lang,
    };

    type PartialFakeDataEntry = { me: string; job: Job; role: Role };
    const partialFakeDataEntries: PartialFakeDataEntry[] = [
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
    const fakeDataEntries: RaidbossData[] = partialFakeDataEntries.map((x) => {
      return Object.assign({}, x, baseFakeData);
    });
    const firstData = fakeDataEntries[0];
    if (!firstData)
      throw new UnreachableCode();

    const kFakeMatches = {
      // TODO: really should convert all triggers to use regexes.js.
      // Mooooost triggers use matches[1] to be a name.
      1: firstData.me,

      sourceId: '41234567',
      source: 'Enemy',
      id: '1234',
      ability: 'Ability',
      targetId: '1234567',
      target: firstData.me,
      flags: '',
      x: '100',
      y: '100',
      z: '0',
      heading: '0',
      npcId: '',
      effect: 'Effect',
      duration: '30',
      code: '00',
      line: '',
      name: 'Name',
    };

    const output: { [key in keyof LooseTrigger]: string } = {};

    const outputKeys = ['alarmText', 'alertText', 'infoText', 'tts', 'sound'] as const;
    type OutputKey = typeof outputKeys[number];

    // Try to determine some sample output?
    // This could get much more complicated if we wanted it to.
    const evalTrigger = (trig: LooseTrigger, key: OutputKey, data: RaidbossData) => {
      try {
        const result = this.valueOrFunction(trig[key], data, kFakeMatches, fakeOutputProxy);
        if (!result)
          return false;

        // Super hack:
        const resultStr = result.toString();
        if (resultStr.includes('undefined') || resultStr.includes('NaN'))
          return false;

        output[key] = resultStr;
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
      const r = trig.response;
      for (const data of fakeDataEntries) {
        try {
          // Can't use ValueOrFunction here as r returns a non-localizable object.
          // FIXME: this hackily replicates some raidboss logic too.
          let response: typeof trig.response | undefined = r;
          while (typeof response === 'function') {
            // TODO: check if this has builtInResponseStr first.
            response = response(data, kFakeMatches, fakeOutputProxy);
          }
          if (!response)
            continue;

          if (!trig.outputStrings) {
            for (const key of outputKeys)
              evalTrigger(response, key, data);
          }
          break;
        } catch (e) {
          continue;
        }
      }
    }

    // Only evaluate fields if there are not outputStrings.
    // outputStrings will indicate more clearly what the trigger says.
    if (!trig.outputStrings) {
      for (const key of outputKeys) {
        if (!(key in trig))
          continue;
        for (const data of fakeDataEntries) {
          if (evalTrigger(trig, key, data))
            break;
        }
      }
    }

    trig.configOutput = output;

    const lang = this.base.lang;

    const langSpecificRegexes = [
      'netRegexDe',
      'netRegexFr',
      'netRegexJa',
      'netRegexCn',
      'netRegexKo',
      'regexDe',
      'regexFr',
      'regexJa',
      'regexCn',
      'regexKo',
    ] as const;
    const getRegex = (baseField: 'regex' | 'netRegex') => {
      const shortLanguage = lang.charAt(0).toUpperCase() + lang.slice(1);
      const concatStr = langSpecificRegexes.find((x) => x === `${baseField}${shortLanguage}`);
      if (!concatStr)
        return;
      const langSpecificRegex = trig[concatStr] ?? trig[baseField];
      if (!langSpecificRegex)
        return;
      const baseRegex = Regexes.parse(langSpecificRegex);
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

  processRaidbossFiles(
    files: RaidbossFileData,
    userOptions: RaidbossOptions,
  ): ConfigProcessedFileMap<ConfigLooseTriggerSet> {
    // `files` is map of filename => triggerSet (for trigger files)
    // `map` is a sorted map of shortened zone key => { various fields, triggerSet }
    const triggerFiles: { [filename: string]: ConfigLooseTriggerSet } = {};
    const timelineFiles: { [filename: string]: string } = {};
    for (const [filename, triggerSetOrString] of Object.entries(files)) {
      if (typeof triggerSetOrString === 'string')
        timelineFiles[filename] = triggerSetOrString;
      else
        triggerFiles[filename] = triggerSetOrString;
    }

    const map = this.base.processFiles<ConfigLooseTriggerSet>(triggerFiles, userOptions.Triggers);
    let triggerIdx = 0;

    // While walking through triggers, record any previous triggers with the same
    // id so that the ui can disable overriding information.
    const previousTriggerWithId: { [id: string]: ConfigLooseTrigger } = {};

    for (const item of Object.values(map)) {
      // TODO: maybe each trigger set needs a zone name, and we should
      // use that instead of the filename???
      const rawTriggers: { trigger: LooseTrigger[]; timeline: LooseTrigger[] } = {
        trigger: [],
        timeline: [],
      };
      const triggerSet = item.triggerSet;
      if (triggerSet.triggers)
        rawTriggers.trigger.push(...triggerSet.triggers);
      if (triggerSet.timelineTriggers)
        rawTriggers.timeline.push(...triggerSet.timelineTriggers);

      if (!triggerSet.isUserTriggerSet && triggerSet.filename)
        flattenTimeline(triggerSet, triggerSet.filename, timelineFiles);

      item.triggers = {};
      for (const [key, triggerArr] of Object.entries(rawTriggers)) {
        for (const baseTrig of triggerArr) {
          const trig: ConfigLooseTrigger = baseTrig;
          triggerIdx++;
          if (!trig.id) {
            // Give triggers with no id some "unique" string so that they can
            // still be added to the set and show up in the ui.
            trig.id = `!!NoIdTrigger${triggerIdx}`;
            trig.isMissingId = true;
          }

          // Track if this trigger overrides any previous trigger.
          const previous = previousTriggerWithId[trig.id];
          if (previous)
            previous.overriddenByFile = triggerSet.filename;
          previousTriggerWithId[trig.id] = trig;

          trig.isTimelineTrigger = key === 'timeline';
          // Also, if a user has two of the same id in the same triggerSet (?!)
          // then only the second trigger will show up.
          item.triggers[trig.id] = this.processTrigger(trig);
        }
      }
    }
    return map;
  }

  buildTriggerOptions(trig: LooseTrigger, labelDiv: HTMLElement) {
    // This shouldn't happen, as all triggers should be processed with a unique id.
    const trigId = trig.id;
    if (!trigId)
      throw new UnreachableCode();

    const optionKey = kOptionKeys.output;
    const div = document.createElement('div');
    div.classList.add('trigger-options');

    const updateLabel = (input: HTMLOptionElement | HTMLSelectElement) => {
      if (input.value === 'hidden' || input.value === 'disabled')
        labelDiv.classList.add('disabled');
      else
        labelDiv.classList.remove('disabled');
    };

    const input = document.createElement('select');
    div.appendChild(input);

    const selectValue = this.base.getOption(
      'raidboss',
      ['triggers', trigId, optionKey],
      'default',
    );

    for (const [key, opt] of Object.entries(triggerSoundOptions)) {
      // Hide debug only options unless they are selected.
      // Otherwise, it will look weird to pick something like 'Disabled',
      // but then not show it when developer options are turned off.
      if (!this.base.developerOptions && opt.debugOnly && key !== selectValue)
        continue;
      const elem = document.createElement('option');
      elem.innerHTML = this.base.translate(opt.label);
      elem.value = key;
      elem.selected = key === selectValue;
      input.appendChild(elem);

      updateLabel(input);

      input.onchange = () => {
        updateLabel(input);
        let value = input.value;
        if (value.includes('default'))
          value = 'default';
        this.base.setOption('raidboss', ['triggers', trigId, optionKey], input.value);
      };
    }

    return div;
  }
}

const flattenTimeline = (
  set: ConfigLooseTriggerSet,
  filename: string,
  files: { [filename: string]: string },
) => {
  // Convert set.timelineFile to set.timeline.
  if (!set.timelineFile)
    return;
  const lastIndex = Math.max(filename.lastIndexOf('/'), filename.lastIndexOf('\\'));
  // If lastIndex === -1, truncate name to the empty string.
  // if lastIndex > -1, truncate name after the final slash.
  const dir = filename.substring(0, lastIndex + 1);

  const timelineFile = `${dir}${set.timelineFile}`;
  delete set.timelineFile;

  if (!(timelineFile in files)) {
    console.log(`ERROR: '${filename}' specifies non-existent timeline file '${timelineFile}'.`);
    return;
  }

  // set.timeline is processed recursively.
  set.timeline = [set.timeline, files[timelineFile]];
};

// Raidboss needs to do some extra processing of user files.
const userFileHandler: UserFileCallback = (
  name: string,
  files: { [filename: string]: string },
  baseOptions: BaseOptions,
  basePath: string,
) => {
  // TODO: Rewrite user_config to be templated on option type so that this function knows
  // what type of options it is using.
  const options = baseOptions as RaidbossOptions;

  if (!options.Triggers)
    return;

  for (const baseTriggerSet of options.Triggers) {
    const set: ConfigLooseTriggerSet = baseTriggerSet;

    // Annotate triggers with where they came from.  Note, options is passed in repeatedly
    // as multiple sets of user files add triggers, so only process each file once.
    if (set.isUserTriggerSet)
      continue;

    // `filename` here is just cosmetic for better debug printing to make it more clear
    // where a trigger or an override is coming from.
    set.filename = `${basePath}${name}`;
    set.isUserTriggerSet = true;

    flattenTimeline(set, name, files);
  }
};

const processPerTriggerAutoConfig = (options: RaidbossOptions, savedConfig: SavedConfigEntry) => {
  // raidboss will look up this.options.PerTriggerAutoConfig to find these values.
  const optionName = 'PerTriggerAutoConfig';

  const perTriggerAutoConfig = options[optionName] ??= {};
  if (typeof savedConfig !== 'object' || Array.isArray(savedConfig))
    return;
  const triggers = savedConfig['triggers'];
  if (!triggers || typeof triggers !== 'object' || Array.isArray(triggers))
    return;

  const outputObjs: { [key: string]: TriggerAutoConfig } = {};
  const keys = Object.keys(kTriggerOptions);
  for (const key of keys) {
    const obj = outputObjs[key] = {};
    setOptionsFromOutputValue(obj, key);
  }

  for (const [id, entry] of Object.entries(triggers)) {
    if (typeof entry !== 'object' || Array.isArray(entry))
      return;

    const autoConfig: TriggerAutoConfig = {};

    const output = entry[kOptionKeys.output]?.toString();
    if (output)
      Object.assign(autoConfig, outputObjs[output]);

    const duration = validDurationOrUndefined(entry[kOptionKeys.duration]);
    if (duration)
      autoConfig[kOptionKeys.duration] = duration;

    const beforeSeconds = validDurationOrUndefined(entry[kOptionKeys.beforeSeconds]);
    if (beforeSeconds)
      autoConfig[kOptionKeys.beforeSeconds] = beforeSeconds;

    const outputStrings = entry[kOptionKeys.outputStrings];
    // Validate that the SavedConfigEntry is an an object with string values,
    // which is a subset of the OutputStrings type.
    if (
      ((entry?: SavedConfigEntry): entry is { [key: string]: string } => {
        if (typeof entry !== 'object' || Array.isArray(entry))
          return false;
        for (const value of Object.values(entry)) {
          if (typeof value !== 'string')
            return false;
        }
        return true;
      })(outputStrings)
    )
      autoConfig[kOptionKeys.outputStrings] = outputStrings;

    if (output || duration || outputStrings)
      perTriggerAutoConfig[id] = autoConfig;
  }
};

const processPerZoneTimelineConfig = (options: RaidbossOptions, savedConfig: SavedConfigEntry) => {
  const optionName = 'PerZoneTimelineConfig';
  // SavedConfig uses this key structure:
  // * 'timeline', zoneId (as string), 'enable', text, boolean
  // * 'timeline', zoneId (as string), 'globalReplace', text, string
  // ...and this function transforms it into a `PerZoneTimelineConfig`.

  const perZoneTimelineConfig = options[optionName] ??= {};
  if (typeof savedConfig !== 'object' || Array.isArray(savedConfig))
    return;
  const timeline = savedConfig['timeline'];
  if (!timeline || typeof timeline !== 'object' || Array.isArray(timeline))
    return;

  for (const [zoneKey, zoneEntry] of Object.entries(timeline)) {
    const zoneId = parseInt(zoneKey);
    if (!zoneId)
      continue;
    const timelineConfig = perZoneTimelineConfig[zoneId] ??= {};

    if (!zoneEntry || typeof zoneEntry !== 'object' || Array.isArray(zoneEntry))
      continue;

    const enableEntry = zoneEntry['enable'];
    const replaceEntry = zoneEntry['globalReplace'];

    if (enableEntry && typeof enableEntry === 'object' && !Array.isArray(enableEntry)) {
      for (const [key, value] of Object.entries(enableEntry)) {
        if (typeof value === 'boolean' && !value)
          (timelineConfig.Ignore ??= []).push(key);
      }
    }

    if (replaceEntry && typeof replaceEntry === 'object' && !Array.isArray(replaceEntry)) {
      for (const [key, value] of Object.entries(replaceEntry)) {
        if (typeof value === 'string')
          (timelineConfig.Rename ??= {})[key] = value;
      }
    }
  }
};

const templateOptions: OptionsTemplate = {
  buildExtraUI: (base, container) => {
    const builder = new RaidbossConfigurator(base);
    const userOptions = { ...raidbossOptions };
    UserConfig.loadUserFiles('raidboss', userOptions, () => {
      builder.buildUI(container, raidbossFileData, userOptions);
    });
  },
  processExtraOptions: (baseOptions, savedConfig) => {
    // TODO: Rewrite user_config to be templated on option type so that this function knows
    // what type of options it is using.  Without this, perTriggerAutoConfig is unknown.
    const options = baseOptions as RaidbossOptions;

    processPerTriggerAutoConfig(options, savedConfig);
    processPerZoneTimelineConfig(options, savedConfig);
  },
  options: [
    {
      id: 'Coverage',
      name: {
        en: 'Supported content (latest version)',
        de: 'Unterstützte Inhalte (aktuellste Version)',
        fr: 'Contenu supporté (dernière version)',
        ja: '対応コンテンツ一覧 (最新バージョン)',
        cn: '支持副本一览 (含未发布更新)',
        ko: '지원하는 컨텐츠 (릴리즈버전보다 최신)',
      },
      type: 'html',
      html: {
        // TODO: it'd be nice if OverlayPlugin could open links on the system outside of ACT.
        en: makeLink('https://quisquous.github.io/cactbot/util/coverage/coverage.html?lang=en'),
        de: makeLink('https://quisquous.github.io/cactbot/util/coverage/coverage.html?lang=de'),
        fr: makeLink('https://quisquous.github.io/cactbot/util/coverage/coverage.html?lang=fr'),
        ja: makeLink('https://quisquous.github.io/cactbot/util/coverage/coverage.html?lang=ja'),
        cn: makeLink('https://quisquous.github.io/cactbot/util/coverage/coverage.html?lang=cn'),
        ko: makeLink('https://quisquous.github.io/cactbot/util/coverage/coverage.html?lang=ko'),
      },
      default: makeLink('https://quisquous.github.io/cactbot/util/coverage/coverage.html?lang=en'),
    },
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
      default: false,
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
          '韩语 (ko)': 'ko',
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
          '韩语 (ko)': 'ko',
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
      id: 'cactbotWormholeStrat',
      // TODO: maybe need some way to group these kinds of
      // options if we end up having a lot?
      name: {
        en: 'Alex Ultimate: enable cactbot Wormhole strat',
        de: 'Alex Ultimate: aktiviere cactbot Wormhole Strategie',
        fr: 'Alex fatal : activer cactbot pour la strat Wormhole',
        ja: '絶アレキサンダー討滅戦：cactbot「次元断絶のマーチ」ギミック',
        cn: '亚历山大绝境战：cactbot灵泉辅助功能',
        ko: '절 알렉: cactbot 웜홀 공략방식 활성화',
      },
      type: 'checkbox',
      default: false,
    },
    {
      id: 'cactbote8sUptimeKnockbackStrat',
      name: {
        en: 'e8s: enable cactbot Uptime Knockback strat',
        de: 'e8s: aktiviere cactbot Uptime Knockback Strategie',
        fr: 'e8s : activer cactbot pour la strat Uptime Knockback',
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
