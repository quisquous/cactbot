import { Lang } from '../../../resources/languages';
import { LocaleObject, LocaleText } from '../../../types/trigger';

export const defaultLocale = <T>(lang: Lang, obj: LocaleObject<T>): T => {
  return obj[lang] ?? obj['en'];
};

export const emulatorButtons = {
  yes: {
    en: 'Yes',
  },
  no: {
    en: 'No',
  },
  close: {
    en: 'Close',
  },
  done: {
    en: 'Done<span class="doneBtnTimeout"></span>',
  },
  loadNetworkLog: {
    en: 'Load Network Log',
  },
  exportDatabase: {
    en: 'Export DB',
  },
  importDatabase: {
    en: 'Import DB',
  },
  clearDatabase: {
    en: 'Clear DB',
  },
};

export const emulatorTitle: LocaleText = {
  en: 'Cactbot Raid Emulator',
};

export const emulatorImportModal = {
  title: {
    en: 'Log File Import Progress',
  },
  body: {
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
  },
};

export const emulatorDeleteModal = {
  title: {
    en: 'Delete Encounter Database',
  },
  body: {
    en: '<p>You are about to delete the encounter database. Are you sure?</p>',
  },
};

export const emulatorIntroModal = {
  title: {
    en: 'Introduction',
  },
  body: {
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
};

export const emulatorDisconnectedModal = {
  title: {
    en: 'Currently Disconnected',
  },
  body: {
    en: `<p>Raid Emulator is currently disconnected from ACT.</p>
    <p>Raid Emulator will use the default settings for raidboss. These are:</p>
    <ul>
      <li>Display language: <span class="discLangDisplay"></span></li>
      <li>Default alert output: Text and Sound</li>
      <li>Alerts language: <span class="discLangAlerts"></span></li>
      <li>Timeline language: <span class="discLangTimeline"></span></li>
    </ul>`,
  },
};

export const emulatorTooltips = {
  hideSkipped: {
    en: 'Hide Skipped',
  },
  hideSkippedTooltip: {
    en: 'Hide triggers that were not executed',
  },
  hideCollectors: {
    en: 'Hide Collectors',
  },
  hideCollectorsTooltip: {
    en: 'Hide triggers that had no output',
  },
  connectedIndicator: {
    en: 'Connected to websocket',
  },
  disconnectedIndicator: {
    en: 'Disconnected from websocket',
  },
};

export const emulatorEncounterInfo = {
  loadEncounter: {
    en: 'Load Encounter',
  },
  reparseEncounter: {
    en: 'Reparse Encounter',
  },
  pruneEncounter: {
    en: 'Prune Encounter',
  },
  deleteEncounter: {
    en: 'Delete Encounter',
  },
  zone: {
    en: 'Zone: <span class="label"></span>',
  },
  start: {
    en: 'Start: <span class="label"></span>',
  },
  duration: {
    en: 'Duration: <span class="label"></span>',
  },
  pullAt: {
    en: 'Pull At: <span class="label"></span>',
  },
  name: {
    en: 'Name: <span class="label"></span>',
  },
  startStatus: {
    en: 'Start Status: <span class="label"></span>',
  },
  endStatus: {
    en: 'End Status: <span class="label"></span>',
  },
};

export const emulatorStartStatuses = {
  unknown: {
    en: 'Unknown',
  },
  countdown: {
    en: 'Countdown',
  },
  seal: {
    en: 'Seal',
  },
  engage: {
    en: 'Engage',
  },
};

export const emulatorEndStatuses = {
  unknown: {
    en: 'Unknown',
  },
  win: {
    en: 'Win',
  },
  wipe: {
    en: 'Wipe',
  },
  cactbotWipe: {
    en: 'Cactbot Wipe',
  },
  unseal: {
    en: 'Unseal',
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
        transStatuses.push(defaultLocale(lang, map));
        break;
      }
    }
  }
  return transStatuses.join(', ');
};

export const lookupEndStatus = (lang: Lang, status: string): string => {
  for (const map of Object.values(emulatorEndStatuses)) {
    if (map.en === status)
      return defaultLocale(lang, map);
  }
  return status;
};
