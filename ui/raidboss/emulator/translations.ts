import { Lang } from '../../../resources/languages';
import { LocaleObject, LocaleText } from '../../../types/trigger';

export const translate = <T>(lang: Lang, obj: LocaleObject<T>): T => {
  return obj[lang] ?? obj['en'];
};

type Translation = { [selector: string]: LocaleText };

const emulatorButtons: Translation = {
  '.yesButton': {
    en: 'Yes',
    de: 'Ja',
  },
  '.noButton': {
    en: 'No',
    de: 'Nein',
  },
  '.closeButton': {
    en: 'Close',
    de: 'Schließen',
  },
  '.doneButton': {
    en: 'Done<span class="doneBtnTimeout"></span>',
    de: 'Fertig<span class="doneBtnTimeout"></span>',
  },
  '.loadNetworkLogButton': {
    en: 'Load Network Log',
    de: 'Lade Network Log',
  },
  '.exportDBButton': {
    en: 'Export DB',
    de: 'DB exportieren',
  },
  '.importDBButton': {
    en: 'Import DB',
    de: 'DB importieren',
  },
  '.clearDBButton': {
    en: 'Clear DB',
    de: 'DB leeren',
  },
} as const;

const emulatorTitle: Translation = {
  '.title': {
    en: 'Cactbot Raid Emulator',
    de: 'Cactbot Raid Emulator',
  },
} as const;

const emulatorImportModal: Translation = {
  '.importProgressModal .modal-title': {
    en: 'Log File Import Progress',
    de: 'Fortschritt des Logdatei Imports',
  },
  '.importProgressModal .modal-body-contents': {
    en: `<h3>Latest encounter:</h3>
    Zone: <span class="zone"></span><br />
    Encounter: <span class="encounter"></span><br />
    Start: <span class="start"></span><br />
    End: <span class="end"></span><br />
    Duration: <span class="durMins"></span>m<span class="durSecs"></span>s<br />
    Pull Duration: <span class="pullMins"></span>m<span class="pullSecs"></span>s<br />
    Started By: <span class="startedBy"></span><br />
    End Status: <span class="endStatus"></span><br />
    Line Count: <span class="lineCount"></span><br />`,
    de: `<h3>Letzter Kampf:</h3>
    Zone: <span class="zone"></span><br />
    Kampf: <span class="encounter"></span><br />
    Start: <span class="start"></span><br />
    Ende: <span class="end"></span><br />
    Dauer: <span class="durMins"></span>m<span class="durSecs"></span>s<br />
    Dauer des Versuchs: <span class="pullMins"></span>m<span class="pullSecs"></span>s<br />
    Gestartet von: <span class="startedBy"></span><br />
    Endstatus: <span class="endStatus"></span><br />
    Zeilenanzahl: <span class="lineCount"></span><br />`,
  },
} as const;

const emulatorDeleteModal: Translation = {
  '.deleteDBModal .modal-title': {
    en: 'Delete Encounter Database',
    de: 'Lösche Kampfdatenbank',
  },
  '.deleteDBModal .modal-body': {
    en: '<p>You are about to delete the encounter database. Are you sure?</p>',
    de: '<p>YDu bist kurz davor die Kampfdatenbank zu löschen. Bist du sicher?</p>',
  },
} as const;

const emulatorIntroModal: Translation = {
  '.introModal .modal-title': {
    en: 'Introduction',
    de: 'Einführung',
  },
  '.introModal .modal-body': {
    en: `<p>Welcome to the Raid Emulator.</p>
    <p>This tool replays encounters and shows what triggers were fired when, and allows you to view the encounter from any player's perspective.</p>
    <p>This tool optionally accepts an <strong>OVERLAY_WS</strong> parameter to connect to an ACT web socket with both ngld's OverlayPlugin and the Cactbot plugin loaded.</p>
    <p>If connected to a web socket, this tool will load and respect user configuration files for cactbot/raidboss.</p>
    <p>No overlays need to be created.</p>
    <p>Current WebSocket status: <span class="d-none websocketConnected text-success">Connected</span><span class="websocketDisconnected text-warning">Disconnected</span>.</p>
    <p>To get started, you need to import an encounter via one of the following options:</p>
    <p>
      <ul>
        <li>Drag and drop a network log file from <code>%APPDATA%/Advanced Combat Tracker/FFXIVLogs/</code> on to the page</li>
        <li>Click the <code>Load Network Log</code> button in the bottom drawer and select a network log file from <code>%APPDATA%/Advanced Combat Tracker/FFXIVLogs/</code></li>
      </ul>
    </p>
    <p>Then, select an encounter via the bottom drawer.</p>
    <p>Once you have loaded an encounter, you can:</p>
    <p>
      <ul>
        <li>Change the current perspective by selecting a party member on the right</li>
        <li>Seek to any point in the encounter by clicking the bar at the top</li>
        <li>Hover over trigger indicators in the top bar to see their names</li>
        <li>See detailed information about triggers fired by clicking their button</li>
      </ul>
    </p>`,
  },
} as const;

const emulatorDisconnectedModal: Translation = {
  '.disconnectedModal .modal-title': {
    en: 'Currently Disconnected',
    de: 'Momentan nicht vebunden',
  },
  '.disconnectedModal .modal-body': {
    en: `<p>Raid Emulator is currently disconnected from ACT.</p>
    <p>Raid Emulator will use the default settings for raidboss. These are:</p>
    <ul>
      <li>Display language: <span class="discLangDisplay"></span></li>
      <li>Default alert output: Text and Sound</li>
      <li>Alerts language: <span class="discLangAlerts"></span></li>
      <li>Timeline language: <span class="discLangTimeline"></span></li>
    </ul>`,
    de: `<p>Raid Emulator ist momentan nicht mit ACT verbunden.</p>
    <p>Raid Emulator wird die Standardeinstellungen für Raidboss benutzen. Diese snd:</p>
    <ul>
      <li>Anzeigesprache: <span class="discLangDisplay"></span></li>
      <li>Standard Alarm Ausgabe: Text und Ton</li>
      <li>Alarmsprache: <span class="discLangAlerts"></span></li>
      <li>Timeline Sprache: <span class="discLangTimeline"></span></li>
    </ul>`,
  },
} as const;

const emulatorLabels: Translation = {
  ' label[for=hideSkipped]': {
    en: 'Hide Skipped',
  },
  ' label[for=hideCollector]': {
    en: 'Hide Collectors',
  },
} as const;

const emulatorTooltips: Translation = {
  '.triggerHideSkipped': {
    en: 'Hide triggers that were not executed',
  },
  '.triggerHideCollector': {
    en: 'Hide triggers that had no output',
  },
  '.connectedIndicator': {
    en: 'Connected to websocket',
  },
  '.disconnectedIndicator': {
    en: 'Disconnected from websocket',
  },
} as const;

const emulatorEncounterInfo: Translation = {
  '.encounterLoad': {
    en: 'Load Encounter',
    de: 'Lade Kampf',
  },
  '.encounterParse': {
    en: 'Reparse Encounter',
    de: 'Kampf erneut analysieren',
  },
  '.encounterPrune': {
    en: 'Prune Encounter',
    de: 'Kampf leeren',
  },
  '.encounterDelete': {
    en: 'Delete Encounter',
    de: 'Kampf löschen',
  },
  '.encounterZone': {
    en: 'Zone: <span class="label"></span>',
    de: 'Zone: <span class="label"></span>',
  },
  '.encounterStart': {
    en: 'Start: <span class="label"></span>',
    de: 'Start: <span class="label"></span>',
  },
  '.encounterDuration': {
    en: 'Duration: <span class="label"></span>',
    de: 'Dauer: <span class="label"></span>',
  },
  '.encounterOffset': {
    en: 'Pull At: <span class="label"></span>',
    de: 'Start um: <span class="label"></span>',
  },
  '.encounterName': {
    en: 'Name: <span class="label"></span>',
    de: 'Name: <span class="label"></span>',
  },
  '.encounterStartStatus': {
    en: 'Start Status: <span class="label"></span>',
    de: 'Start Status: <span class="label"></span>',
  },
  '.encounterEndStatus': {
    en: 'End Status: <span class="label"></span>',
    de: 'Endstatus: <span class="label"></span>',
  },
} as const;

// These elements get their innerHTML set to the translated value
export const emulatorTranslations: Translation = {
  ...emulatorButtons,
  ...emulatorTitle,
  ...emulatorImportModal,
  ...emulatorDeleteModal,
  ...emulatorIntroModal,
  ...emulatorDisconnectedModal,
  ...emulatorLabels,
} as const;

// These elements get their title set to the translated value
export const emulatorTooltipTranslations: Translation = {
  ...emulatorTooltips,
} as const;

// Template elements need special handling, any templates that have translatable elements
// should be listed here
export const emulatorTemplateTranslations: { [selector: string]: Translation } = {
  'template.encounterInfo': emulatorEncounterInfo,
};

export const emulatorStartStatuses = {
  unknown: {
    en: 'Unknown',
    de: 'Unbekannt',
  },
  countdown: {
    en: 'Countdown',
    de: 'Countdown',
  },
  seal: {
    en: 'Seal',
    de: 'Versiegeln',
  },
  engage: {
    en: 'Engage',
    de: 'Start',
  },
};

export const emulatorEndStatuses = {
  unknown: {
    en: 'Unknown',
    de: 'Unbekannt',
  },
  win: {
    en: 'Win',
    de: 'Gewonnen',
  },
  wipe: {
    en: 'Wipe',
    de: 'Wipe',
  },
  cactbotWipe: {
    en: 'Cactbot Wipe',
    de: 'Cactbot Wipe',
  },
  unseal: {
    en: 'Unseal',
    de: 'Entsiegeln',
  },
};

// @TODO: Change encounter to store keys for statuses instead of english values as a
// comma-separated string.
export const lookupStartStatuses = (lang: Lang, statusesStr: string): string => {
  const engStatuses = statusesStr.split(', ');
  const transStatuses: string[] = [];
  for (const status of engStatuses) {
    for (const map of Object.values(emulatorStartStatuses)) {
      if (map.en === status) {
        transStatuses.push(translate(lang, map));
        break;
      }
    }
  }
  return transStatuses.join(', ');
};

export const lookupEndStatus = (lang: Lang, status: string): string => {
  for (const map of Object.values(emulatorEndStatuses)) {
    if (map.en === status)
      return translate(lang, map);
  }
  return status;
};
