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

  $(() => {
    emulator = new RaidEmulator();
    progressBar = new ProgressBar(emulator);
    persistor = new Persistor();
    logEventHandler = new LogEventHandler();
    encounterTab = new EncounterTab(persistor);
    emulatedPartyInfo = new EmulatedPartyInfo(emulator);
    emulatedMap = new EmulatedMap(emulator);
    emulatedWebSocket = new RaidEmulatorWebSocket(emulator);

    logEventHandler.on('fight', (day, zone, lines) => {
      let enc = new Encounter(day, zone, lines);
      emulator.AddEncounter(enc);
      persistor.PersistEncounter(enc);
      encounterTab.Refresh();
    });

    encounterTab.on('load', (ID) => {
      if (!emulator.SetCurrentByID(ID)) {
        persistor.LoadEncounter(ID).then((enc) => {
          emulator.AddEncounter(enc);
          emulator.SetCurrentByID(ID);
        });
      }
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

        gTimelineController.SetPopupTextInterface(new RaidEmulatorPopupTextGenerator(gPopupText));
        gPopupText.SetTimelineLoader(new RaidEmulatorTimelineLoader(gTimelineController));

        emulator.setPopupText(gPopupText);

        encounterTab.Refresh();

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
