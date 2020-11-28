import '../../resources/common.js';
import './raidboss_config.js';

import EmulatedMap from './emulator/ui/EmulatedMap.js';
import EmulatedPartyInfo from './emulator/ui/EmulatedPartyInfo.js';
import EmulatorCommon from './emulator/EmulatorCommon.js';
import Encounter from './emulator/data/Encounter.js';
import EncounterTab from './emulator/ui/EncounterTab.js';
import LogEventHandler from './emulator/data/LogEventHandler.js';
import NetworkLogConverter from './emulator/data/NetworkLogConverter.js';
import Persistor from './emulator/data/Persistor.js';
import { PopupTextGenerator } from './popup-text.js';
import ProgressBar from './emulator/ui/ProgressBar.js';
import RaidEmulator from './emulator/data/RaidEmulator.js';
import RaidEmulatorOverlayApiHook from './emulator/overrides/RaidEmulatorOverlayApiHook.js';
import RaidEmulatorPopupText from './emulator/overrides/RaidEmulatorPopupText.js';
import RaidEmulatorTimelineController from './emulator/overrides/RaidEmulatorTimelineController.js';
import RaidEmulatorTimelineUI from './emulator/overrides/RaidEmulatorTimelineUI.js';
import { TimelineLoader } from './timeline.js';
import Tooltip from './emulator/ui/Tooltip.js';
import UserConfig from '../../resources/user_config.js';
import raidbossFileData from './data/manifest.txt';

// @TODO: Some way to not have this be a global?

// See user/raidboss-example.js for documentation.
const Options = {
  // These options are ones that are not auto-defined by raidboss_config.js.
  PlayerNicks: {},

  InfoSound: '../../resources/sounds/freesound/percussion_hit.ogg',
  AlertSound: '../../resources/sounds/BigWigs/Alert.ogg',
  AlarmSound: '../../resources/sounds/BigWigs/Alarm.ogg',
  LongSound: '../../resources/sounds/BigWigs/Long.ogg',
  PullSound: '../../resources/sounds/PowerAuras/sonar.ogg',

  audioAllowed: true,

  DisabledTriggers: {},

  PerTriggerOptions: {},

  Triggers: [],

  PlayerNameOverride: null,
  PlayerJobOverride: null,
};

(() => {
  let emulator;
  let progressBar;
  let timelineController;
  let popupText;
  let persistor;
  let logEventHandler;
  let encounterTab;
  let emulatedPartyInfo;
  let emulatedMap;
  let emulatedWebSocket;
  let logConverter;
  let timelineUI;

  document.addEventListener('DOMContentLoaded', () => {
    emulator = new RaidEmulator(Options);
    progressBar = new ProgressBar(emulator);
    persistor = new Persistor();
    logEventHandler = new LogEventHandler();
    encounterTab = new EncounterTab(persistor);
    emulatedPartyInfo = new EmulatedPartyInfo(emulator);
    emulatedMap = new EmulatedMap(emulator);
    emulatedWebSocket = new RaidEmulatorOverlayApiHook(emulator);
    logConverter = new NetworkLogConverter();

    // Listen for the user to click a player in the party list on the right
    // and persist that over to the emulator
    emulatedPartyInfo.on('selectPerspective', (id) => {
      emulator.selectPerspective(id);
    });

    // Listen for the log parser to dispatch a fight
    logEventHandler.on('fight', (day, zoneId, zoneName, lines) => {
      const enc = new Encounter(day, zoneId, zoneName, lines);
      // If there's not both a player and an enemy ability, don't persist the encounter
      if (!(enc.firstPlayerAbility > 0 && enc.firstEnemyAbility > 0))
        return;

      emulator.addEncounter(enc);
      persistor.persistEncounter(enc).then(() => {
        encounterTab.refresh();
      });
    });

    // Listen for the user to attempt to load an encounter from the encounters pane
    encounterTab.on('load', (id) => {
      let p;
      // Attempt to set the current emulated encounter
      if (!emulator.setCurrentByID(id)) {
        let resolver;
        p = new Promise((res) => {
          resolver = res;
        });
        // If that encounter isn't loaded, load it
        persistor.loadEncounter(id).then((enc) => {
          emulator.addEncounter(enc);
          emulator.setCurrentByID(id);
          resolver();
        });
      } else {
        p = new Promise((res) => {
          res();
        });
      }
      // Once we've loaded the encounter, seek to the start of the encounter
      p.then(() => {
        // Store our current loaded encounter to auto-load next time
        window.localStorage.setItem('currentEncounter', id);
        if (!isNaN(emulator.currentEncounter.encounter.initialOffset))
          emulator.seek(emulator.currentEncounter.encounter.initialOffset);
      });
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
    emulator.on('emitLogs', (logs) => {
      timelineController.OnLogEvent({
        type: 'onLogEvent',
        detail: logs,
      });
    });

    // Wait for the DB to be ready before doing anything that might invoke the DB
    persistor.on('ready', () => {
      UserConfig.getUserConfigLocation('raidboss', Options, (e) => {
        document.querySelector('.websocketConnected').classList.remove('d-none');
        document.querySelector('.websocketDisconnected').classList.add('d-none');

        // Initialize the Raidboss components, bind them to the emulator for event listeners
        timelineUI = new RaidEmulatorTimelineUI(Options);
        timelineUI.bindTo(emulator);
        timelineController =
            new RaidEmulatorTimelineController(Options, timelineUI, raidbossFileData);
        timelineController.bindTo(emulator);
        popupText = new RaidEmulatorPopupText(
            Options, new TimelineLoader(timelineController), raidbossFileData);
        popupText.bindTo(emulator);

        timelineController.SetPopupTextInterface(new PopupTextGenerator(popupText));

        emulator.setPopupText(popupText);

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
            file.text().then((txt) => {
              // Import a network file by passing it to LogEventHandler to convert it
              logConverter.convertFile(txt).then((lines) => {
                const localLogHandler = new LogEventHandler();
                localLogHandler.currentDate = EmulatorCommon.timeToDateString(lines[0].timestamp);

                const promises = [];

                // Listen for LogEventHandler to dispatch fights and persist them
                localLogHandler.on('fight', async (day, zoneId, zoneName, lines) => {
                  const enc = new Encounter(day, zoneId, zoneName, lines);
                  if (!(enc.firstPlayerAbility > 0 && enc.firstEnemyAbility > 0))
                    return;
                  emulator.addEncounter(enc);
                  promises.push(persistor.persistEncounter(enc));
                });

                localLogHandler.parseLogs(lines);
                localLogHandler.endFight();

                Promise.all(promises).then(() => {
                  encounterTab.refresh();
                });
              });
            });
          }
        };

        const ignoreEvent = (e) => {
          e.preventDefault();
          e.stopPropagation();
        };

        // Handle drag+drop of files. Have to ignore dragenter/dragover for compatability reasons.
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
          logEventHandler: logEventHandler,
          encounterTab: encounterTab,
          emulatedPartyInfo: emulatedPartyInfo,
          emulatedMap: emulatedMap,
          emulatedWebSocket: emulatedWebSocket,
          logConverter: logConverter,
          timelineUI: timelineUI,
        };
      });
    });
  });
})();

function showModal(selector) {
  const modal = document.querySelector(selector);
  const body = document.body;
  const backdrop = document.querySelector('.modal-backdrop');
  body.classList.add('modal-open');
  backdrop.classList.add('show');
  backdrop.classList.remove('hide');
  modal.classList.add('show');
  modal.style.display = 'block';
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
}
