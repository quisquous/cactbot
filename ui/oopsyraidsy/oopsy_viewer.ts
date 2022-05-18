import { UnreachableCode } from '../../resources/not_reached';
import { callOverlayHandler } from '../../resources/overlay_plugin_api';
import UserConfig from '../../resources/user_config';
import { LocaleText } from '../../types/trigger';

import { DamageTracker, earlyPullTriggerId } from './damage_tracker';
import oopsyFileData from './data/oopsy_manifest.txt';
import { MistakeCollector } from './mistake_collector';
import defaultOptions, { OopsyOptions } from './oopsy_options';
import { OopsySummaryList, OopsySummaryTable } from './oopsy_summary_list';

import './oopsyraidsy_config';

import '../../resources/defaults.css';
import './oopsy_common.css';
import './oopsy_summary.css';
import './oopsy_viewer.css';

const fileDropText: LocaleText = {
  en: 'Drop Network log file here',
};

// TODO: fake the partyTracker somehow (or get it from log lines) for missed buffs
// TODO: better mouseover text for dropping
// TODO: support dropping a file anywhere on the page
// TODO: use browser language if not connected or do what emulator does
// TODO: load files asynchronously so it doesn't hitch the browser
// TODO: show some UI for when this is/isn't connected, like emulator
// TODO: add some display when this is loaded as an overlay as it should only be in a browser
// TODO: add visible? console output for processed files / errors
// TODO: add errors for loading wrong kind of log file

const dropHandler = async (e: DragEvent, damageTracker: DamageTracker): Promise<void> => {
  e.preventDefault();
  e.stopPropagation();

  for (const file of e.dataTransfer?.files ?? []) {
    console.log(`Processing ${file.name}`);
    const text = await file.text();

    for (const line of text.split('\n')) {
      damageTracker.OnNetLog({
        type: 'LogLine',
        line: line.split('|'),
        rawLine: line,
      });
    }
  }
};

const initViewer = (options: OopsyOptions, _isConnected: boolean) => {
  // TODO: fix early pulls from logs (and also make them more accurate <_<)
  (options.DisabledTriggers ??= {})[earlyPullTriggerId] = true;

  const mistakeCollector = new MistakeCollector(options, false);
  const summaryElement = document.getElementById('summary');

  if (!summaryElement)
    throw new UnreachableCode();

  const listView = new OopsySummaryList(options, summaryElement);
  mistakeCollector.AddObserver(listView);

  const tableElement = document.getElementById('mistake-table');
  if (!tableElement)
    throw new UnreachableCode();
  const table = new OopsySummaryTable(options, tableElement);
  mistakeCollector.AddObserver(table);

  const damageTracker = new DamageTracker(options, mistakeCollector, oopsyFileData);

  const fileDrop = document.getElementById('filedrop');
  if (!fileDrop)
    throw new UnreachableCode();
  fileDrop.innerText = fileDropText[options.DisplayLanguage] ?? fileDropText['en'];
  fileDrop.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
  fileDrop.addEventListener('drop', (e) => void dropHandler(e, damageTracker));
};

const onLoaded = async () => {
  if (window.location.href.indexOf('OVERLAY_WS') > 0) {
    // Give the websocket 500ms to connect, then abort.
    const websocketConnected = await Promise.race<Promise<boolean>>([
      new Promise<boolean>((res) => {
        void callOverlayHandler({ call: 'cactbotRequestState' }).then(() => {
          res(true);
        });
      }),
      new Promise<boolean>((res) => {
        window.setTimeout(() => {
          res(false);
        }, 500);
      }),
    ]);
    if (websocketConnected) {
      await new Promise<void>((res) => {
        UserConfig.getUserConfigLocation('oopsyraidsy', defaultOptions, () => {
          initViewer({ ...defaultOptions }, true);
          res();
        });
      });
      return;
    }
  }
  initViewer({ ...defaultOptions }, false);
};

// Wait for DOMContentLoaded if needed.
if (document.readyState !== 'loading')
  void onLoaded();
else
  document.addEventListener('DOMContentLoaded', () => void onLoaded());
