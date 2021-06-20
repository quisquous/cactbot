import './raidboss_config';

import EmulatedMap from './emulator/ui/EmulatedMap';
import EmulatedPartyInfo from './emulator/ui/EmulatedPartyInfo';
import EmulatorCommon from './emulator/EmulatorCommon';
import Encounter from './emulator/data/Encounter';
import EncounterTab from './emulator/ui/EncounterTab';
import LogEventHandler from './emulator/data/LogEventHandler';
import Persistor from './emulator/data/Persistor';
import { PopupTextGenerator } from './popup-text';
import ProgressBar from './emulator/ui/ProgressBar';
import RaidEmulator from './emulator/data/RaidEmulator';
import RaidEmulatorOverlayApiHook from './emulator/overrides/RaidEmulatorOverlayApiHook';
import RaidEmulatorPopupText from './emulator/overrides/RaidEmulatorPopupText';
import RaidEmulatorTimelineController from './emulator/overrides/RaidEmulatorTimelineController';
import RaidEmulatorTimelineUI from './emulator/overrides/RaidEmulatorTimelineUI';
import { TimelineLoader } from './timeline';
import Tooltip from './emulator/ui/Tooltip';
import UserConfig from '../../resources/user_config';
import { isLang, Lang, langMap } from '../../resources/languages';
import raidbossFileData from './data/raidboss_manifest.txt';
// eslint can't detect the custom loader for the worker
// eslint-disable-next-line import/default
import NetworkLogConverterWorker from './emulator/data/NetworkLogConverterWorker';
import { callOverlayHandler } from '../../resources/overlay_plugin_api';

import defaultOptions from './raidboss_options';

import '../../resources/defaults.css';
import './raidemulator.css';


function showModal(selector) {
  const modal = document.querySelector(selector);
  const body = document.body;
  const backdrop = document.querySelector('.modal-backdrop');
  body.classList.add('modal-open');
  backdrop.classList.add('show');
  backdrop.classList.remove('hide');
  modal.classList.add('show');
  modal.style.display = 'block';
  return modal;
}

function hideModal(selector = '.modal.show') {
  const modal = document.querySelector(selector);
  const body = document.body;
  const backdrop = document.querySelector('.modal-backdrop');
  body.classList.remove('modal-open');
  backdrop.classList.remove('show');
  backdrop.classList.add('hide');
  modal.classList.remove('show');
  modal.style.display = '';
  return modal;
}

document.addEventListener('DOMContentLoaded', async () => {
  const persistor = new Persistor();
  let websocketConnected = undefined;
  let options = { ...defaultOptions };

  // Wait for the DB to be ready before doing anything that might invoke the DB
  await persistor.initializeDB();

  if (window.location.href.indexOf('OVERLAY_WS') > 0) {
    // Give the websocket 500ms to connect, then abort.
    websocketConnected = await Promise.race([
      new Promise((res) => {
        callOverlayHandler({ call: 'cactbotRequestState' }).then(() => {
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
      await new Promise((res) => {
        UserConfig.getUserConfigLocation('raidboss', defaultOptions, (e) => {
          // Update options from anything changed via getUserConfigLocation.
          options = { ...defaultOptions };
          document.querySelector('.websocketConnected').classList.remove('d-none');
          document.querySelector('.websocketDisconnected').classList.add('d-none');
          res();
        });
      });
    }
  }

  if (!websocketConnected) {
    // Find the most appropriate lang code to use based on browser language priority
    const browserLang = [...navigator.languages, 'en']
      .map((l) => l.split('-')[0].toLowerCase())
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
  const emulatedMap = new EmulatedMap(emulator);
  const emulatedWebSocket = new RaidEmulatorOverlayApiHook(emulator);
  emulatedWebSocket.connected = websocketConnected;
  const logConverterWorker = new NetworkLogConverterWorker();

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
  emulatedPartyInfo.on('selectPerspective', (id) => {
    emulator.selectPerspective(id);
  });

  emulator.on('currentEncounterChanged', (enc) => {
    // Store our current loaded encounter to auto-load next time
    window.localStorage.setItem('currentEncounter', enc.encounter.id);
    // Once we've loaded the encounter, seek to the start of the encounter
    if (!isNaN(enc.encounter.initialOffset))
      emulator.seek(enc.encounter.initialOffset);
  });

  // Listen for the user to attempt to load an encounter from the encounters pane
  encounterTab.on('load', (id) => {
    // Attempt to set the current emulated encounter
    if (!emulator.setCurrentByID(id)) {
      // If that encounter isn't loaded, load it
      persistor.loadEncounter(id).then((enc) => {
        emulator.addEncounter(enc);
        emulator.setCurrentByID(id);
      });
    }
  });

  // Listen for the user to select re-parse on the encounters tab, then refresh it in the DB
  encounterTab.on('parse', (id) => {
    persistor.loadEncounter(id).then(async (enc) => {
      enc.initialize();
      await persistor.persistEncounter(enc);
      encounterTab.refresh();
    });
  });

  // Listen for the user to select prune on the encounters tab
  encounterTab.on('prune', (id) => {
    persistor.loadEncounter(id).then(async (enc) => {
      // Trim log lines
      enc.logLines = enc.logLines.slice(enc.firstLineIndex - 1);

      // Update precalculated offsets
      const firstTimestamp = enc.logLines[0].timestamp;
      for (let i = 0; i < enc.logLines.length; ++i)
        enc.logLines[i].offset = enc.logLines[i].timestamp - firstTimestamp;


      enc.firstLineIndex = 0;

      enc.initialize();
      await persistor.persistEncounter(enc);
      encounterTab.refresh();
    });
  });

  // Listen for the user to select delete on the encounters tab, then do it.
  encounterTab.on('delete', (id) => {
    persistor.deleteEncounter(id).then(() => {
      encounterTab.refresh();
    });
  });

  // Listen for the emulator to event log lines, then dispatch them to the timeline controller
  // @TODO: Probably a better place to listen for this?
  emulator.on('emitLogs', (e) => {
    timelineController.onEmulatorLogEvent(e.logs);
  });

  // Load the encounter metadata from the DB
  encounterTab.refresh();

  // If we don't have any encounters stored, show the intro modal
  persistor.listEncounters().then((encounters) => {
    if (encounters.length === 0) {
      showModal('.introModal');
    } else {
      let lastEncounter = window.localStorage.getItem('currentEncounter');
      if (lastEncounter !== undefined) {
        lastEncounter = parseInt(lastEncounter);
        const matchedEncounters = encounters.filter((e) => e.id === lastEncounter);
        if (matchedEncounters.length)
          encounterTab.dispatch('load', lastEncounter);
      }
      if (!websocketConnected) {
        const dispLang = langMap[options.ParserLanguage][options.ParserLanguage];
        const discModal = showModal('.disconnectedModal');
        const indicator = document.querySelector('.connectionIndicator');
        indicator.querySelector('.connectedIndicator').classList.add('d-none');
        indicator.querySelector('.disconnectedIndicator').classList.remove('d-none');
        discModal.querySelector('.discLangDisplay').innerText = dispLang;
        discModal.querySelector('.discLangAlerts').innerText = dispLang;
        discModal.querySelector('.discLangTimeline').innerText = dispLang;
      }
    }
  });

  const checkFile = async (file) => {
    if (file.type === 'application/json') {
      // Import a DB file by passing it to Persistor
      // DB files are just json representations of the DB
      file.text().then((txt) => {
        const DB = JSON.parse(txt);
        persistor.importDB(DB).then(() => {
          encounterTab.refresh();
        });
      });
    } else {
      // Assume it's a log file?
      const importModal = showModal('.importProgressModal');
      const bar = importModal.querySelector('.progress-bar');
      bar.style.width = '0px';
      const label = importModal.querySelector('.label');
      label.innerText = '';
      const encLabel = importModal.querySelector('.encounterLabel');
      encLabel.innerText = 'N/A';

      const doneButton = importModal.querySelector('.btn');
      doneButton.disabled = true;

      const doneButtonTimeout = doneButton.querySelector('.doneBtnTimeout');

      const promises = [];

      logConverterWorker.onmessage = (msg) => {
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
            Start: ${new Date(enc.startTimestamp)}
            End: ${new Date(enc.endTimestamp)}
            Duration: ${EmulatorCommon.msToDuration(enc.endTimestamp - enc.startTimestamp)}
            Pull Duration: ${EmulatorCommon.msToDuration(enc.endTimestamp - enc.initialTimestamp)}
            Started By: ${enc.startStatus}
            End Status: ${enc.endStatus}
            Line Count: ${enc.logLines.length}
            `;
            // Objects sent via message are raw objects, not typed.
            // Need to get the name another way and override for Persistor.
            enc.combatantTracker.getMainCombatantName = () => msg.data.name;
            promises.push(persistor.persistEncounter(enc));
          }
          break;
        case 'done':
          Promise.all(promises).then(() => {
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
      file.arrayBuffer().then((b) => {
        logConverterWorker.postMessage(b, [b]);
      });
    }
  };

  const ignoreEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle drag+drop of files. Have to ignore dragenter/dragover for compatibility reasons.
  document.body.addEventListener('dragenter', ignoreEvent);
  document.body.addEventListener('dragover', ignoreEvent);

  document.body.addEventListener('drop', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const dt = e.dataTransfer;
    const files = dt.files;
    for (let i = 0; i < files.length; ++i) {
      const file = files[i];
      await checkFile(file);
    }
  });

  const $exportButton = document.querySelector('.exportDBButton');

  new Tooltip($exportButton, 'bottom',
      'Export DB is very slow and shows a 0 byte download, but it does work eventually.');

  // Auto initialize all collapse elements on the page
  document.querySelectorAll('[data-toggle="collapse"]').forEach((n) => {
    const target = document.querySelector(n.getAttribute('data-target'));
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
  $exportButton.addEventListener('click', (e) => {
    persistor.exportDB().then((obj) => {
      // Convert encounter DB to json, then base64 encode it
      // Encounters can have unicode, can't use btoa for base64 encode
      const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' });
      obj = null;
      // Offer download to user
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.setAttribute('download', 'RaidEmulator_DBExport_' + (+new Date()) + '.json');
      a.click();
      // After a second (so after user accepts/declines)
      // remove the object URL to avoid memory issues
      window.setTimeout(() => {
        URL.revokeObjectURL(a.href);
      }, 1000);
    });
  });

  const $fileInput = document.querySelector('.loadFileInput');

  // Handle the `Load Network Log` button when user selects files
  $fileInput.addEventListener('change', async (e) => {
    for (let i = 0; i < e.target.files.length; ++i) {
      const file = e.target.files[i];
      checkFile(file);
    }
  });

  // Prompt user to select files if they click the `Load Network Log` or `Import DB` buttons.
  // These buttons really do the same thing.
  document.querySelectorAll('.importDBButton, .loadNetworkLogButton').forEach((n) => {
    n.addEventListener('click', (e) => {
      $fileInput.click();
    });
  });

  // Handle all modal close buttons
  document.querySelectorAll('.modal button.close, [data-dismiss="modal"]').forEach((n) => {
    n.addEventListener('click', (e) => {
      // Find the parent modal from the close button and close it
      let target = e.currentTarget;
      while (!target.classList.contains('modal') && target !== document.body)
        target = target.parentElement;

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
  document.querySelector('.clearDBButton').addEventListener('click', (e) => {
    showModal('.deleteDBModal');
  });

  // Handle user saying they're really sure they want to clear the DB by wiping it then
  // refreshing the encounter tab
  document.querySelector('.deleteDBModal .btn-primary').addEventListener('click', (e) => {
    persistor.clearDB().then(() => {
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
    emulatedMap: emulatedMap,
    emulatedWebSocket: emulatedWebSocket,
    timelineUI: timelineUI,
  };
});
