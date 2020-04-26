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

    emulatedPartyInfo.on('SelectPerspective', (ID) => {
      emulator.SelectPerspective(ID);
    });

    logEventHandler.on('fight', (day, zone, lines) => {
      let enc = new Encounter(day, zone, lines);
      if (!(enc.firstPlayerAbility > 0 && enc.firstEnemyAbility > 0)) {
        return;
      }
      emulator.AddEncounter(enc);
      persistor.PersistEncounter(enc);
      encounterTab.Refresh();
    });

    encounterTab.on('load', (ID) => {
      if (!emulator.SetCurrentByID(ID)) {
        persistor.LoadEncounter(ID).then((enc) => {
          emulator.AddEncounter(enc);
          emulator.SetCurrentByID(ID);
          if(!isNaN(emulator.currentEncounter.encounter.initialOffset))
            emulator.Seek(emulator.currentEncounter.encounter.initialOffset);
        });
      }
    });

    encounterTab.on('parse', (ID) => {
      persistor.LoadEncounter(ID).then(async (enc) => {
        enc.Initialize();
        await persistor.PersistEncounter(enc);
        encounterTab.Refresh();
      });
    });

    encounterTab.on('prune', (ID) => {
      persistor.LoadEncounter(ID).then(async (enc) => {
        let firstLine = 1;
        for (let i = 0; i < enc.logLines.length; ++i) {
          let l = enc.logLines[i];
          let res = EmulatorCommon.LogLineRegex.exec(l);
          let timestamp = +new Date(enc.encounterDay + ' ' + res[1]);
          if(timestamp >= enc.startTimestamp + enc.initialOffset) {
            firstLine = i;
            break;
          }
        }

        firstLine = firstLine > 1 ? firstLine - 1 : 1;

        enc.logLines = enc.logLines.slice(firstLine-1);

        enc.Initialize();
        await persistor.PersistEncounter(enc);
        encounterTab.Refresh();
      });
    });

    encounterTab.on('delete', (ID) => {
      persistor.DeleteEncounter(ID).then(() => {
        encounterTab.Refresh();
      });
    });

    emulator.on('EmitLogs', (logs) => {
      emulatedWebSocket.Dispatch({
        type: 'onLogEvent',
        detail: logs,
      });
    });

    $('.showEncountersButton').on('click', () => {
      $('.encountersTabColumn').toggleClass('col-auto').toggleClass('col-3');
    });

    persistor.on('ready', () => {
      UserConfig.getUserConfigLocation('raidboss', function (e) {
        addOverlayListener('onLogEvent', function (e) {
          gTimelineController.OnLogEvent(e);
        });

        callOverlayHandler({
          call: 'cactbotReadDataFiles',
          source: location.href,
        }).then((e) => {
          gTimelineController.SetDataFiles(e.detail.files);
          gPopupText.OnDataFilesRead(e);
          gPopupText.ReloadTimelines();
        });
        let gTimelineUI = new RaidEmulatorTimelineUI(Options);
        gTimelineUI.BindTo(emulator);
        gTimelineController = new RaidEmulatorTimelineController(Options, gTimelineUI);
        gTimelineController.BindTo(emulator);
        gPopupText = new RaidEmulatorPopupText(Options);
        gPopupText.BindTo(emulator);

        gTimelineController.SetPopupTextInterface(new RaidEmulatorPopupTextGenerator(gPopupText));
        gPopupText.SetTimelineLoader(new RaidEmulatorTimelineLoader(gTimelineController));

        emulator.setPopupText(gPopupText);

        encounterTab.Refresh();

        let importFile = (txt) => {
          logConverter.ConvertFile(txt).then((lines) => {
            let LocalLogHandler = new LogEventHandler();
            LocalLogHandler.currentDate = timeToDateString(lines[0].Timestamp);
            lines = lines.map((l) => l.Line);

            LocalLogHandler.on('fight', async (day, zone, lines) => {
              let enc = new Encounter(day, zone, lines);
              if (enc.firstPlayerAbility === null && enc.firstEnemyAbility === null) {
                return;
              }
              emulator.AddEncounter(enc);
              await persistor.PersistEncounter(enc);
            });

            LocalLogHandler.ParseLogs(lines);
            LocalLogHandler.EndFight();
            // Have to wait for a DOM update or something for the encouter tab refresh to work.
            // No clue why.
            window.setTimeout(() => {
              encounterTab.Refresh();
            }, 100);
          });
        };

        let importDB = (txt) => {
          let DB = JSON.parse(txt);
          persistor.ImportDB(DB).then(() => {
            encounterTab.Refresh();
          });
        };

        let checkFile = async (file) => {
          if (file.type === "application/json") {
            // Import DB?
            file.text().then((txt) => {
              importDB(txt);
              encounterTab.Refresh();
            });
          } else {
            // Assume it's a log file?
            file.text().then((txt) => {
              importFile(txt);
            });
          }
        };

        $('body').on('dragenter dragover', (e) => { e.preventDefault(); e.stopPropagation(); });
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
          persistor.ExportDB().then((obj) => {
            // encounters can have unicode, can't use btoa for base64 encode
            let blob = new Blob([JSON.stringify(obj)], { type: 'application/json' });
            obj = null;
            var a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.setAttribute("download", 'RaidEmulator_DBExport_' + (+new Date()) + '.json');
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
          persistor.ClearDB().then(() => {
            encounterTab.Refresh();
            $('.deleteDBModal').modal('hide');
          });
        });

        // Debug code
        if (true) {
          window.raidEmulatorDebug = {
            emulator: emulator,
            progressBar: progressBar,
            timelineController: gTimelineController,
            popupText: gPopupText,
            persistor: persistor,
          };
        }
      });
    });
  });
})(jQuery);
