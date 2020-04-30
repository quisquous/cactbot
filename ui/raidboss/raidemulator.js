'use strict';

// @TODO: Some way to not have this be a global?

// See user/raidboss-example.js for documentation.
let Options = {
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

(($) => {
  let emulator;
  let progressBar;
  let gTimelineController;
  let gPopupText;
  let persistor;
  let logEventHandler;
  let encounterTab;
  let emulatedPartyInfo;
  let emulatedMap;
  let emulatedWebSocket;
  let logConverter;

  $(() => {
    emulator = new RaidEmulator();
    progressBar = new ProgressBar(emulator);
    persistor = new Persistor();
    logEventHandler = new LogEventHandler();
    encounterTab = new EncounterTab(persistor);
    emulatedPartyInfo = new EmulatedPartyInfo(emulator);
    emulatedMap = new EmulatedMap(emulator);
    emulatedWebSocket = new RaidEmulatorWebSocket(emulator);
    logConverter = new NetworkLogConverter();

    emulatedPartyInfo.on('SelectPerspective', (id) => {
      emulator.selectPerspective(id);
    });

    logEventHandler.on('fight', (day, zone, lines) => {
      let enc = new Encounter(day, zone, lines);
      if (!(enc.firstPlayerAbility > 0 && enc.firstEnemyAbility > 0))
        return;

      emulator.addEncounter(enc);
      persistor.persistEncounter(enc);
      encounterTab.refresh();
    });

    encounterTab.on('load', (id) => {
      if (!emulator.setCurrentByID(id)) {
        persistor.loadEncounter(id).then((enc) => {
          emulator.addEncounter(enc);
          emulator.setCurrentByID(id);
          if (!isNaN(emulator.currentEncounter.encounter.initialOffset))
            emulator.seek(emulator.currentEncounter.encounter.initialOffset);
        });
      }
    });

    encounterTab.on('parse', (id) => {
      persistor.loadEncounter(id).then(async (enc) => {
        enc.initialize();
        await persistor.persistEncounter(enc);
        encounterTab.refresh();
      });
    });

    encounterTab.on('prune', (id) => {
      persistor.loadEncounter(id).then(async (enc) => {
        let firstLine = 1;
        for (let i = 0; i < enc.logLines.length; ++i) {
          let l = enc.logLines[i];
          if (l.timestamp >= enc.startTimestamp + enc.initialOffset) {
            firstLine = i;
            break;
          }
        }

        firstLine = firstLine > 1 ? firstLine - 1 : 1;

        enc.logLines = enc.logLines.slice(firstLine - 1);

        enc.initialize();
        await persistor.persistEncounter(enc);
        encounterTab.refresh();
      });
    });

    encounterTab.on('delete', (id) => {
      persistor.deleteEncounter(id).then(() => {
        encounterTab.refresh();
      });
    });

    emulator.on('EmitLogs', (logs) => {
      emulatedWebSocket.dispatch({
        type: 'onLogEvent',
        detail: logs,
      });
    });

    $('.showEncountersButton').on('click', () => {
      $('.encountersTabColumn').toggleClass('col-auto').toggleClass('col-3');
    });

    persistor.on('ready', () => {
      UserConfig.getUserConfigLocation('raidboss', function(e) {
        addOverlayListener('onLogEvent', function(e) {
          // eslint-disable-next-line new-cap
          gTimelineController.OnLogEvent(e);
        });

        callOverlayHandler({
          call: 'cactbotReadDataFiles',
          source: location.href,
        }).then((e) => {
          // eslint-disable-next-line new-cap
          gTimelineController.SetDataFiles(e.detail.files);
          // eslint-disable-next-line new-cap
          gPopupText.OnDataFilesRead(e);
          // eslint-disable-next-line new-cap
          gPopupText.ReloadTimelines();
        });
        let gTimelineUI = new RaidEmulatorTimelineUI(Options);
        gTimelineUI.bindTo(emulator);
        gTimelineController = new RaidEmulatorTimelineController(Options, gTimelineUI);
        gTimelineController.bindTo(emulator);
        gPopupText = new RaidEmulatorPopupText(Options);
        gPopupText.bindTo(emulator);

        // eslint-disable-next-line new-cap
        gTimelineController.SetPopupTextInterface(new RaidEmulatorPopupTextGenerator(gPopupText));
        // eslint-disable-next-line new-cap
        gPopupText.SetTimelineLoader(new RaidEmulatorTimelineLoader(gTimelineController));

        emulator.setPopupText(gPopupText);

        encounterTab.refresh();

        let importFile = (txt) => {
          logConverter.convertFile(txt).then((lines) => {
            let localLogHandler = new LogEventHandler();
            localLogHandler.currentDate = timeToDateString(lines[0].timestamp);

            localLogHandler.on('fight', async (day, zone, lines) => {
              let enc = new Encounter(day, zone, lines);
              if (enc.firstPlayerAbility === null && enc.firstEnemyAbility === null)
                return;
              emulator.addEncounter(enc);
              await persistor.persistEncounter(enc);
            });

            localLogHandler.parseLogs(lines);
            localLogHandler.endFight();
            // Have to wait for a DOM update or something for the encouter tab refresh to work.
            // No clue why.
            window.setTimeout(() => {
              encounterTab.refresh();
            }, 100);
          });
        };

        let importDB = (txt) => {
          let DB = JSON.parse(txt);
          persistor.importDB(DB).then(() => {
            encounterTab.refresh();
          });
        };

        let checkFile = async (file) => {
          if (file.type === 'application/json') {
            // Import DB?
            file.text().then((txt) => {
              importDB(txt);
              encounterTab.refresh();
            });
          } else {
            // Assume it's a log file?
            file.text().then((txt) => {
              importFile(txt);
            });
          }
        };

        $('body').on('dragenter dragover', (e) => {
          e.preventDefault();
          e.stopPropagation();
        });
        $('body').on('drop', async (e) => {
          e.preventDefault();
          e.stopPropagation();
          let dt = e.originalEvent.dataTransfer;
          let files = dt.files;
          for (let i = 0; i < files.length; ++i) {
            let file = files[i];
            await checkFile(file);
          }
        });

        let $exportButton = $('.exportDBButton');

        $exportButton.tooltip({
          title: 'Export DB is very slow and shows a 0 byte download, but it does work eventually.',
          placement: 'bottom',
        });
        $exportButton.on('click', (e) => {
          persistor.exportDB().then((obj) => {
            // encounters can have unicode, can't use btoa for base64 encode
            let blob = new Blob([JSON.stringify(obj)], { type: 'application/json' });
            obj = null;
            let a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.setAttribute('download', 'RaidEmulator_DBExport_' + (+new Date()) + '.json');
            a.click();
            window.setTimeout(() => {
              URL.revokeObjectURL(a.href);
            }, 1000);
          });
        });

        let $fileInput = $('.loadFileInput');

        $fileInput.on('change', async (e) => {
          for (let i = 0; i < e.originalEvent.target.files.length; ++i) {
            let file = e.originalEvent.target.files[i];
            checkFile(file);
          }
        });

        $('.importDBButton, .loadNetworkLogButton').on('click', (e) => {
          $fileInput.trigger('click');
        });

        $('.deleteDBModal .btn-primary').on('click', (e) => {
          persistor.clearDB().then(() => {
            encounterTab.refresh();
            $('.deleteDBModal').modal('hide');
          });
        });

        // Debug code
        window.raidEmulatorDebug = {
          emulator: emulator,
          progressBar: progressBar,
          timelineController: gTimelineController,
          popupText: gPopupText,
          persistor: persistor,
        };
      });
    });
  });
})(jQuery);
