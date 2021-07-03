import './raidboss_config';

import { isLang, langMap } from '../../resources/languages';
import { UnreachableCode } from '../../resources/not_reached';
import { callOverlayHandler } from '../../resources/overlay_plugin_api';
import UserConfig from '../../resources/user_config';
import { ConverterWorkerMessage } from '../../types/worker';

import raidbossFileData from './data/raidboss_manifest.txt';
import AnalyzedEncounter from './emulator/data/AnalyzedEncounter';
import CombatantTracker from './emulator/data/CombatantTracker';
import Encounter from './emulator/data/Encounter';
import LineEvent from './emulator/data/network_log_converter/LineEvent';
import Persistor from './emulator/data/Persistor';
import RaidEmulator from './emulator/data/RaidEmulator';
import EmulatorCommon, { querySelectorSafe } from './emulator/EmulatorCommon';
import RaidEmulatorOverlayApiHook from './emulator/overrides/RaidEmulatorOverlayApiHook';
import RaidEmulatorPopupText from './emulator/overrides/RaidEmulatorPopupText';
import RaidEmulatorTimelineController from './emulator/overrides/RaidEmulatorTimelineController';
import RaidEmulatorTimelineUI from './emulator/overrides/RaidEmulatorTimelineUI';
import EmulatedPartyInfo from './emulator/ui/EmulatedPartyInfo';
import EncounterTab from './emulator/ui/EncounterTab';
import ProgressBar from './emulator/ui/ProgressBar';
import Tooltip from './emulator/ui/Tooltip';
import { PopupTextGenerator } from './popup-text';
import defaultOptions from './raidboss_options';
import { TimelineLoader } from './timeline';
import '../../resources/defaults.css';
import './raidemulator.css';

declare global {
  interface Window {
    raidEmulator: {
      emulator: RaidEmulator;
      progressBar: ProgressBar;
      timelineController: RaidEmulatorTimelineController;
      popupText: RaidEmulatorPopupText;
      persistor: Persistor;
      encounterTab: EncounterTab;
      emulatedPartyInfo: EmulatedPartyInfo;
      emulatedWebSocket: RaidEmulatorOverlayApiHook;
      timelineUI: RaidEmulatorTimelineUI;
    };
  }
}
const showModal = (selector: string): HTMLElement => {
  const modal = querySelectorSafe(document, selector);
  const body = document.body;
  const backdrop = querySelectorSafe(document, '.modal-backdrop');
  body.classList.add('modal-open');
  backdrop.classList.add('show');
  backdrop.classList.remove('hide');
  modal.classList.add('show');
  modal.style.display = 'block';
  return modal;
};

const hideModal = (selector = '.modal.show'): HTMLElement => {
  const modal = querySelectorSafe(document, selector);
  const body = document.body;
  const backdrop = querySelectorSafe(document, '.modal-backdrop');
  body.classList.remove('modal-open');
  backdrop.classList.remove('show');
  backdrop.classList.add('hide');
  modal.classList.remove('show');
  modal.style.display = '';
  return modal;
};

const raidEmulatorOnLoad = async () => {
  const persistor = new Persistor();
  let websocketConnected = false;
  let options = { ...defaultOptions };

  // Wait for the DB to be ready before doing anything that might invoke the DB
  await persistor.open();

  if (window.location.href.indexOf('OVERLAY_WS') > 0) {
    // Give the websocket 500ms to connect, then abort.
    websocketConnected = await Promise.race<Promise<boolean>>([
      new Promise((res) => {
        void callOverlayHandler({ call: 'cactbotRequestState' }).then(() => {
          res(true);
        });
      }),
      new Promise((res) => {
        window.setTimeout(() => {
          res(false);
        }, 500);
      }),
    ]);
    if (websocketConnected) {
      await new Promise<void>((res) => {
        UserConfig.getUserConfigLocation('raidboss', defaultOptions, () => {
          // Update options from anything changed via getUserConfigLocation.
          options = { ...defaultOptions };
          querySelectorSafe(document, '.websocketConnected').classList.remove('d-none');
          querySelectorSafe(document, '.websocketDisconnected').classList.add('d-none');
          res();
        });
      });
    }
  }

  if (!websocketConnected) {
    // Find the most appropriate lang code to use based on browser language priority
    const browserLang = [...navigator.languages, 'en']
      .map((l) => l.substr(0, 2))
      // Remap `zh` to `cn` to match cactbot languages
      .map((l) => l === 'zh' ? 'cn' : l)
      .filter((l) => ['en', 'de', 'fr', 'ja', 'cn', 'ko'].includes(l))[0];
    options.ParserLanguage = isLang(browserLang) ? browserLang : 'en';
    options.DisplayLanguage = isLang(browserLang) ? browserLang : 'en';
    // Default options
    options.IsRemoteRaidboss = true;
    options.TextAlertsEnabled = true;
    options.SoundAlertsEnabled = true;
    options.SpokenAlertsEnabled = false;
    options.GroupSpokenAlertsEnabled = false;
  }

  const emulator = new RaidEmulator(options);
  const progressBar = new ProgressBar(emulator);
  const encounterTab = new EncounterTab(persistor);
  const emulatedPartyInfo = new EmulatedPartyInfo(emulator);
  const emulatedWebSocket = new RaidEmulatorOverlayApiHook(emulator);
  emulatedWebSocket.connected = websocketConnected;
  const logConverterWorker = new Worker(new URL('./emulator/data/NetworkLogConverter.worker.ts', import.meta.url));

  // Initialize the Raidboss components, bind them to the emulator for event listeners
  const timelineUI = new RaidEmulatorTimelineUI(options);
  timelineUI.bindTo(emulator);
  const timelineController =
      new RaidEmulatorTimelineController(options, timelineUI, raidbossFileData);
  timelineController.bindTo(emulator);
  const popupText = new RaidEmulatorPopupText(
      options, new TimelineLoader(timelineController), raidbossFileData);
  popupText.bindTo(emulator);

  timelineController.SetPopupTextInterface(new PopupTextGenerator(popupText));

  emulator.setPopupText(popupText);

  // Listen for the user to click a player in the party list on the right
  // and persist that over to the emulator
  emulatedPartyInfo.on('selectPerspective', (id: string) => {
    emulator.selectPerspective(id);
  });

  emulator.on('currentEncounterChanged', (enc: AnalyzedEncounter) => {
    // Store our current loaded encounter to auto-load next time
    if (enc.encounter.id)
      window.localStorage.setItem('currentEncounter', enc.encounter.id.toString());
    // Once we've loaded the encounter, seek to the start of the encounter
    if (!isNaN(enc.encounter.initialOffset))
      void emulator.seek(enc.encounter.initialOffset);
  });

  // Listen for the user to attempt to load an encounter from the encounters pane
  encounterTab.on('load', (id: number) => {
    // Attempt to set the current emulated encounter
    if (!emulator.setCurrentByID(id)) {
      // If that encounter isn't loaded, load it
      void persistor.encounters.get(id).then((enc?: Encounter) => {
        if (enc) {
          emulator.addEncounter(enc);
          emulator.setCurrentByID(id);
        }
      });
    }
  });

  // Listen for the user to select re-parse on the encounters tab, then refresh it in the DB
  encounterTab.on('parse', (id: number) => {
    void persistor.encounters.get(id).then(async (enc?: Encounter) => {
      if (enc) {
        enc.initialize();
        await persistor.encounters.put(enc, enc.id);
        encounterTab.refresh();
      }
    });
  });

  // Listen for the user to select prune on the encounters tab
  encounterTab.on('prune', (id: number) => {
    void persistor.encounters.get(id).then(async (enc?: Encounter) => {
      if (enc) {
        // Trim log lines
        enc.logLines = enc.logLines.slice(enc.firstLineIndex - 1);

        // Update precalculated offsets
        const firstTimestamp = enc.logLines[0]?.timestamp ?? 0;
        for (const line of enc.logLines)
          line.offset = line.timestamp - firstTimestamp;

        enc.firstLineIndex = 0;

        enc.initialize();
        await persistor.encounters.put(enc, enc.id);
        encounterTab.refresh();
      }
    });
  });

  // Listen for the user to select delete on the encounters tab, then do it.
  encounterTab.on('delete', (id: number) => {
    void persistor.encounters.delete(id).then(() => {
      encounterTab.refresh();
    });
  });

  // Listen for the emulator to event log lines, then dispatch them to the timeline controller
  // @TODO: Probably a better place to listen for this?
  emulator.on('emitLogs', (e: { logs: LineEvent[] }) => {
    timelineController.onEmulatorLogEvent(e.logs);
  });

  // Load the encounter metadata from the DB
  encounterTab.refresh();

  // If we don't have any encounters stored, show the intro modal
  void persistor.encounterSummaries.toArray().then((encounters) => {
    if (encounters.length === 0) {
      showModal('.introModal');
    } else {
      let lastEncounter: string | number | null = window.localStorage.getItem('currentEncounter');
      if (lastEncounter) {
        lastEncounter = parseInt(lastEncounter);
        const matchedEncounters = encounters.filter((e) => e.id === lastEncounter);
        if (matchedEncounters.length)
          void encounterTab.dispatch('load', lastEncounter);
      }
      if (!websocketConnected) {
        const dispLang = langMap[options.ParserLanguage][options.ParserLanguage];
        const discModal = showModal('.disconnectedModal');
        const indicator = querySelectorSafe(document, '.connectionIndicator');
        querySelectorSafe(indicator, '.connectedIndicator').classList.add('d-none');
        querySelectorSafe(indicator, '.disconnectedIndicator').classList.remove('d-none');
        querySelectorSafe(discModal, '.discLangDisplay').innerText = dispLang;
        querySelectorSafe(discModal, '.discLangAlerts').innerText = dispLang;
        querySelectorSafe(discModal, '.discLangTimeline').innerText = dispLang;
      }
    }
  });

  const checkFile = (file: File) => {
    if (file.type === 'application/json') {
      // Import a DB file by passing it to Persistor
      void persistor.importDB(file).then(() => {
        encounterTab.refresh();
      });
    } else {
      // Assume it's a log file
      const importModal = showModal('.importProgressModal');
      const bar = querySelectorSafe(importModal, '.progress-bar');
      bar.style.width = '0px';
      const label = querySelectorSafe(importModal, '.label');
      label.innerText = '';
      const encLabel = querySelectorSafe(importModal, '.encounterLabel');
      encLabel.innerText = 'N/A';

      const doneButton = querySelectorSafe(importModal, '.btn');
      if (!(doneButton instanceof HTMLButtonElement))
        throw new UnreachableCode();
      doneButton.disabled = true;

      const doneButtonTimeout = querySelectorSafe(doneButton, '.doneBtnTimeout');

      let promise: Promise<unknown> | undefined;

      logConverterWorker.onmessage = (msg: MessageEvent<ConverterWorkerMessage>) => {
        switch (msg.data.type) {
        case 'progress':
          {
            const percent = ((msg.data.bytes / msg.data.totalBytes) * 100).toFixed(2);
            bar.style.width = percent + '%';
            label.innerText = `${msg.data.bytes}/${msg.data.totalBytes} bytes, ${msg.data.lines} lines (${percent}%)`;
          }
          break;
        case 'encounter':
          {
            const enc = msg.data.encounter;

            encLabel.innerText = `
            Zone: ${enc.encounterZoneName}
            Encounter: ${msg.data.name}
            Start: ${new Date(enc.startTimestamp).toString()}
            End: ${new Date(enc.endTimestamp).toString()}
            Duration: ${EmulatorCommon.msToDuration(enc.endTimestamp - enc.startTimestamp)}
            Pull Duration: ${EmulatorCommon.msToDuration(enc.endTimestamp - enc.initialTimestamp)}
            Started By: ${enc.startStatus}
            End Status: ${enc.endStatus}
            Line Count: ${enc.logLines.length}
            `;
            // Objects sent via message are raw objects, not typed. Apply prototype chain
            Object.setPrototypeOf(enc.combatantTracker, CombatantTracker.prototype);
            if (promise) {
              void promise.then(() => {
                promise = persistor.persistEncounter(enc);
              });
            } else {
              promise = persistor.persistEncounter(enc);
            }
          }
          break;
        case 'done':
          void Promise.all([promise]).then(() => {
            encounterTab.refresh();
            doneButton.disabled = false;
            let seconds = 5;
            doneButtonTimeout.innerText = ` (${seconds})`;
            const interval = window.setInterval(() => {
              --seconds;
              doneButtonTimeout.innerText = ` (${seconds})`;
              if (seconds === 0) {
                window.clearInterval(interval);
                hideModal('.importProgressModal');
              }
            }, 1000);
          });
          break;
        }
      };
      void file.arrayBuffer().then((b) => {
        logConverterWorker.postMessage(b, [b]);
      });
    }
  };

  const ignoreEvent = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle drag+drop of files. Have to ignore dragenter/dragover for compatibility reasons.
  document.body.addEventListener('dragenter', ignoreEvent);
  document.body.addEventListener('dragover', ignoreEvent);

  const dropHandler = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const dt = e.dataTransfer;
    if (dt) {
      const files = dt.files;
      for (const file of files)
        checkFile(file);
    }
  };

  document.body.addEventListener('drop', dropHandler);

  const $exportButton = querySelectorSafe(document, '.exportDBButton');

  new Tooltip($exportButton, 'bottom', 'Export the DB (slow).');

  // Auto initialize all collapse elements on the page
  document.querySelectorAll('[data-toggle="collapse"]').forEach((n) => {
    const targetSel = n.getAttribute('data-target');
    if (!targetSel)
      throw new UnreachableCode();
    const target = querySelectorSafe(document, targetSel);
    n.addEventListener('click', () => {
      if (n.getAttribute('aria-expanded') === 'false') {
        n.setAttribute('aria-expanded', 'true');
        target.classList.add('show');
      } else {
        n.setAttribute('aria-expanded', 'false');
        target.classList.remove('show');
      }
    });
  });

  // Handle DB export
  $exportButton.addEventListener('click', () => {
    void persistor.exportDB().then((blob) => {
      // Offer download to user
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.setAttribute('download', `RaidEmulator_DBExport_${Date.now()}.json`);
      a.click();
      URL.revokeObjectURL(a.href);
    });
  });

  const $fileInput = querySelectorSafe(document, '.loadFileInput');

  // Handle the `Load Network Log` button when user selects files
  $fileInput.addEventListener('change', (e: Event) => {
    if (e.target) {
      const target = e.target;
      if (target instanceof HTMLInputElement && target.files) {
        for (const file of target.files)
          checkFile(file);
      }
    }
  });

  // Prompt user to select files if they click the `Load Network Log` button.
  document.querySelectorAll('.loadNetworkLogButton').forEach((n) => {
    n.addEventListener('click', () => {
      $fileInput.click();
    });
  });

  // Handle all modal close buttons
  document.querySelectorAll('.modal button.close, [data-dismiss="modal"]').forEach((n) => {
    n.addEventListener('click', (e) => {
      if (!(e instanceof MouseEvent))
        return;
      if (!(e.currentTarget instanceof HTMLElement))
        return;
      // Find the parent modal from the close button and close it
      let target = e.currentTarget;
      while (!target.classList.contains('modal') && target !== document.body)
        target = target.parentElement ?? target;

      if (target !== document.body)
        hideModal('.' + [...target.classList].join('.'));
    });
  });

  // Handle closing all modals if the user clicks outside the modal
  document.querySelectorAll('.modal').forEach((n) => {
    n.addEventListener('click', (e) => {
      // Only close the modal if the user actually clicked outside it, not child clicks
      if (e.target === n)
        hideModal();
    });
  });

  // Ask the user if they're really sure they want to clear the DB
  querySelectorSafe(document, '.clearDBButton').addEventListener('click', () => {
    showModal('.deleteDBModal');
  });

  // Handle user saying they're really sure they want to clear the DB by wiping it then
  // refreshing the encounter tab
  querySelectorSafe(document, '.deleteDBModal .btn-primary').addEventListener('click', () => {
    void persistor.clearDB().then(() => {
      encounterTab.refresh();
      hideModal('.deleteDBModal');
    });
  });

  // Make the emulator state available for debugging
  window.raidEmulator = {
    emulator: emulator,
    progressBar: progressBar,
    timelineController: timelineController,
    popupText: popupText,
    persistor: persistor,
    encounterTab: encounterTab,
    emulatedPartyInfo: emulatedPartyInfo,
    emulatedWebSocket: emulatedWebSocket,
    timelineUI: timelineUI,
  };
};

document.addEventListener('DOMContentLoaded', () => {
  void raidEmulatorOnLoad();
});
