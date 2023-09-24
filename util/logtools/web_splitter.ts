import DTFuncs from '../../resources/datetime';
import { browserLanguagesToLang, Lang } from '../../resources/languages';
import { UnreachableCode } from '../../resources/not_reached';
import { LocaleText } from '../../types/trigger';

import Anonymizer from './anonymizer';
import { EncounterCollector, FightEncInfo, TLFuncs } from './encounter_tools';
import { Notifier } from './notifier';
import Splitter from './splitter';

import './splitter.css';

const pageText = {
  titleText: {
    en: 'Log Splitter and Anonymizer',
    de: 'Log Aufteiler und Anonymisierer',
    cn: '日志分割与匿名器',
  },
  fileDropText: {
    en: 'Drop Network log file here',
    de: 'Network log Datei hier ablegen',
    cn: '将网络日志文件拖放到此处',
  },
  anonInput: {
    en: 'Anonymize Log',
    de: 'Log Anonymisieren',
    cn: '对日志进行匿名化处理',
  },
  exportInput: {
    en: 'Export',
    de: 'Export',
    cn: '导出',
  },
} as const;

const getElement = (id: string): HTMLElement => {
  const element = document.getElementById(id);
  if (!element)
    throw new UnreachableCode();
  return element;
};

const setLabelText = (id: string, key: keyof typeof pageText, lang: Lang): void => {
  const label = getElement(id);
  const labelText: LocaleText = pageText[key];
  label.innerText = labelText[lang] ?? labelText['en'];
};

const dropHandler = async (e: DragEvent, state: PageState): Promise<void> => {
  e.preventDefault();
  e.stopPropagation();

  for (const file of e.dataTransfer?.files ?? []) {
    console.log(`Processing ${file.name}`);
    const text = await file.text();

    for (const line of text.split('\n')) {
      state.lines.push(line);
      state.collector.process(line, false);
    }
  }

  buildTable(state);
};

const buildTable = (state: PageState): void => {
  const headers = {
    include: {
      en: 'Include',
      de: 'Einschließen',
      cn: '包括',
    },
    startDate: {
      en: 'Date',
      de: 'Datum',
      cn: '日期',
    },
    startTime: {
      en: 'Time',
      de: 'Zeit',
      cn: '时间',
    },
    duration: {
      en: 'Duration',
      de: 'Dauer',
      cn: '持续时间',
    },
    zone: {
      en: 'Zone',
      de: 'Zone',
      cn: '区域',
    },
    encounter: {
      en: 'Encounter',
      de: 'Begegnung',
      cn: '战斗',
    },
    end: {
      en: 'End',
      de: 'Ende',
      cn: '结束方式',
    },
  } as const;

  state.table.innerHTML = '';

  for (const item of Object.values(headers)) {
    const localeItem: LocaleText = item;
    const div = document.createElement('div');
    div.innerText = localeItem[state.lang] ?? localeItem['en'];
    div.classList.add('header');
    state.table.appendChild(div);
  }

  let seenSeal = false;

  // TODO: should this be combined with encounter_printer.ts somehow??
  state.collector.fights.forEach((fight, idx) => {
    let tzOffset = 0;
    if (fight.startLine !== undefined)
      tzOffset = TLFuncs.getTZOffsetFromLogLine(fight.startLine);

    let startDate = '';
    let startTime = '';
    if (fight.startTime !== undefined) {
      startDate = DTFuncs.dateObjectToDateString(fight.startTime, tzOffset);
      startTime = DTFuncs.dateObjectToTimeString(fight.startTime, tzOffset);
    }
    const fightDuration = TLFuncs.durationFromDates(fight.startTime, fight.endTime) ??
      '???';
    let fightName = '???';
    if (fight.sealName !== undefined)
      fightName = fight.sealName;
    else if (fight.fightName !== undefined)
      fightName = fight.fightName;

    if (!seenSeal && fight.sealName !== undefined)
      seenSeal = true;
    else if (seenSeal && fight.sealName === undefined)
      seenSeal = false;

    const row: Record<keyof Omit<typeof headers, 'include'>, string> = {
      startDate: startDate,
      startTime: startTime,
      duration: fightDuration,
      zone: fight.zoneName ?? '',
      encounter: fightName,
      end: fight.endType ?? '',
    };

    for (const header in headers) {
      if (header === 'include') {
        const includeCheck = document.createElement('input');
        includeCheck.type = 'checkbox';
        if (state.selectedFights[idx])
          includeCheck.checked = true;
        includeCheck.addEventListener('click', () => {
          state.selectedFights[idx] = includeCheck.checked;
          const anyClicked = Object.values(state.selectedFights).reduce((prev, cur) => prev || cur);
          state.exportButton.disabled = !anyClicked;
        });
        state.table.appendChild(includeCheck);
        continue;
      }

      const div = document.createElement('div');
      const rowAnon: { [key: string]: string } = row;
      div.innerText = rowAnon[header] ?? '';
      state.table.appendChild(div);
    }
  });
};

class PageState {
  public selectedFights: { [idx: number]: boolean } = {};
  public collector: EncounterCollector = new EncounterCollector();
  public lines: string[] = [];

  constructor(
    public lang: Lang,
    public table: HTMLElement,
    public exportButton: HTMLButtonElement,
    public anonInput: HTMLInputElement,
    public errorDiv: HTMLElement,
  ) {}
}

class WebNotifier implements Notifier {
  constructor(private errorDiv: HTMLElement) {}

  private errorFunc(severity: 'warn' | 'error', reason: string, splitLine?: string[]) {
    const splitStr = splitLine === undefined ? '' : `:${splitLine.join('|')}`;
    const outputStr = `${severity}: ${reason}${splitStr}`;

    const div = document.createElement('div');
    div.innerHTML = outputStr;
    div.classList.add(severity);
    this.errorDiv.appendChild(div);
  }

  public warn(reason: string, splitLine?: string[]): void {
    this.errorFunc('warn', reason, splitLine);
  }

  public error(reason: string, splitLine?: string[]): void {
    this.errorFunc('error', reason, splitLine);
  }
}

const doExport = (state: PageState): void => {
  const selected: number[] = [];
  for (const keyStr in state.selectedFights) {
    const key = parseInt(keyStr);
    if (state.selectedFights[key])
      selected.push(key);
  }
  selected.sort();

  const idxToFight: { [key: number]: FightEncInfo } = {};
  state.collector.fights.forEach((fight, idx) => idxToFight[idx] = fight);

  let firstTime = true;
  const output: string[] = [];
  const notifier = new WebNotifier(state.errorDiv);
  const anonymizer = new Anonymizer();

  const anonymizeLogs = state.anonInput.checked;

  for (const idx of selected) {
    const fight = idxToFight[idx];
    if (fight === undefined || fight.startLine === undefined || fight.endLine === undefined)
      continue;

    const splitter = new Splitter(fight.startLine, fight.endLine, notifier, firstTime);
    firstTime = false;

    // TODO: we could be smarter here and not loop every time through all lines
    for (const line of state.lines) {
      splitter.processWithCallback(line, (line) => {
        if (anonymizeLogs) {
          const anonLine = anonymizer.process(line, notifier);
          if (anonLine === undefined)
            return;
          output.push(anonLine);
        } else {
          output.push(line);
        }
      });
      if (splitter.isDone())
        break;
    }
  }

  if (anonymizeLogs) {
    anonymizer.validateIds(notifier);
    for (const line of output)
      anonymizer.validateLine(line, notifier);
  }

  // TODO: could be smarter here if they all had the same zone or something.
  let filename = 'split.log';
  if (selected.length === 1) {
    const idx = selected[0];
    if (idx) {
      const fight = idxToFight[idx];
      if (fight)
        filename = TLFuncs.generateFileName(fight);
    }
  }

  const blob = new Blob([output.join('\n')], { type: 'text/plain' });
  const a = document.createElement('a');
  a.setAttribute('download', filename);
  a.href = window.URL.createObjectURL(blob);
  a.click();
  window.URL.revokeObjectURL(a.href);
};

const onLoaded = () => {
  const lang = browserLanguagesToLang(navigator.languages);

  const table = getElement('fight-table');
  const fileDrop = getElement('filedrop');
  const exportOptions = getElement('export-options');
  const exportButton = getElement('export') as HTMLButtonElement;
  const anonCheckbox = getElement('anon') as HTMLInputElement;
  const errorDiv = getElement('errors');

  const fileDropText: LocaleText = pageText.fileDropText;
  fileDrop.innerText = fileDropText[lang] ?? fileDropText['en'];
  fileDrop.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
  });

  const pageState = new PageState(
    lang,
    table,
    exportButton,
    anonCheckbox,
    errorDiv,
  );
  fileDrop.addEventListener('drop', (e) => {
    exportOptions.classList.remove('hide');
    void dropHandler(e, pageState);
  });

  setLabelText('anon-label', 'anonInput', lang);
  setLabelText('export', 'exportInput', lang);

  exportButton.addEventListener('click', () => {
    doExport(pageState);
  });
};

// Wait for DOMContentLoaded if needed.
if (document.readyState !== 'loading')
  void onLoaded();
else
  document.addEventListener('DOMContentLoaded', () => void onLoaded());
