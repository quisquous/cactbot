import { UnreachableCode } from '../../../../resources/not_reached';
import Util from '../../../../resources/util';
import AnalyzedEncounter from '../data/AnalyzedEncounter';
import Combatant from '../data/Combatant';
import LineEvent from '../data/network_log_converter/LineEvent';
import { LineEvent0x01 } from '../data/network_log_converter/LineEvent0x01';
import { LineEvent0x1C } from '../data/network_log_converter/LineEvent0x1C';
import RaidEmulator from '../data/RaidEmulator';
import { cloneSafe, getTemplateChild, querySelectorSafe } from '../EmulatorCommon';

import Tooltip from './Tooltip';

// This is a partial definition, only pulling in what we need
type TerritoryType = {
  Map?: {
    MapFilename?: string;
    SizeFactor?: string;
    OffsetX?: string;
    OffsetY?: string;
  };
};

type Map = {
  element: HTMLElement;
  territoryType: TerritoryType;
  waymarkers: { [id: number]: HTMLElement };
};

type MapCombatant = {
  combatant: Combatant;
  element: HTMLElement;
  firstSignificantState: number;
  lastSignificantState: number;
  tooltip?: Tooltip;
};

const xivapiBaseUrl = 'https://xivapi.com/';

const scaleMap = (map: Map): void => {
  const mapSubContainer = querySelectorSafe(map.element, '.subContainer');
  const offsetX = parseInt(map.territoryType?.Map?.OffsetX ?? '0');
  const mapContainerWidth = window.innerWidth * 0.166666667;
  const mapWidth = Math.abs((offsetX) * 2);
  const mapScale = mapContainerWidth / mapWidth;
  mapSubContainer.style.transform = `scale(${mapScale})`;
};

const coordToOffset = (map: Map, coord: number): number => {
  const offsetX = parseInt(map.territoryType?.Map?.OffsetX ?? '0');
  const mapScale = parseInt(map.territoryType.Map?.SizeFactor ?? '100') / 100.0;
  const coordOffset = offsetX + coord;
  return 1024.0 + (coordOffset * mapScale);
};

const waymarkIdMap = [
  3, // 1
  4, // 2
  5, // 3
  7, // 4
  0, // A
  1, // B
  2, // C
  6, // D
];

const waymarkerUrl = (id: number) => {
  id = waymarkIdMap[id] ?? id;
  return `https://xivapi.com/i/061000/06124${id + 1}_hr1.png`;
};

export class EmulatorMap {
  private loadedMaps: { [id: number]: Map } = {};
  private loadingMaps: { [id: number]: true } = {};

  private currentMap?: Map;

  private combatantMap: MapCombatant[] = [];

  private mapContainer: HTMLElement;
  private mapEntryTemplate: HTMLElement;

  private mapEnemyTemplate: HTMLElement;
  private mapPlayerTemplate: HTMLElement;
  private mapWaymarkerTemplate: HTMLElement;

  private seeking = false;

  constructor(private emulator: RaidEmulator) {
    this.mapContainer = querySelectorSafe(document, '.map');
    this.mapEntryTemplate = getTemplateChild(document, 'template.mapEntry');
    this.mapEnemyTemplate = getTemplateChild(document, 'template.mapEnemy');
    this.mapPlayerTemplate = getTemplateChild(document, 'template.mapPlayer');
    this.mapWaymarkerTemplate = getTemplateChild(document, 'template.mapWaymarker');

    this.emulator.on('currentEncounterChanged', async (enc: AnalyzedEncounter) => {
      this.clearCombatants();

      const encZoneId = parseInt(enc.encounter.encounterZoneId, 16);

      await this.loadMap(encZoneId).then(() => {
        this.setMap(encZoneId, 1);
      });

      for (const line of enc.encounter.logLines.filter((l) => l.decEvent === 1)) {
        const lineCast = line as LineEvent0x01;
        const zoneId = parseInt(lineCast.zoneId, 16);
        void this.loadMap(zoneId);
      }
    });

    emulator.on('emitLogs', (event: { logs: LineEvent[] }) => {
      for (const line of event.logs) {
        if (line.decEvent === 1) {
          const lineCast = line as LineEvent0x01;
          this.setMap(parseInt(lineCast.zoneId, 16), line.timestamp);
        } else {
          // If we're seeking, don't update combatants
          if (this.seeking)
            return;
          // Put this in `else` to avoid doubling up on combatant updates since setMap updates them
          this.updateCombatants(line.timestamp);
          if (line.decEvent === 28) {
            const lineCast = line as LineEvent0x1C;
            const waymarkId = parseInt(lineCast.waymark);
            if (waymarkId >= 0 && waymarkId <= 7) {
              const map = this.currentMap;
              const waymark = this.currentMap?.waymarkers[waymarkId];
              if (map && waymark) {
                if (lineCast.operation === 'Add')
                  waymark.classList.remove('d-none');
                else
                  waymark.classList.add('d-none');
                waymark.style.left = coordToOffset(map, parseFloat(lineCast.x)).toString() + 'px';
                waymark.style.top = coordToOffset(map, parseFloat(lineCast.y)).toString() + 'px';
              }
            }
          }
        }
      }
    });

    emulator.on('preSeek', () => {
      this.seeking = true;
    });
    emulator.on('postSeek', (timestamp: number) => {
      this.seeking = false;
      // After seek we need to update to most recent significant state to timestamp
      if (this.currentMap) {
        for (const combatant of this.combatantMap) {
          const sigTimestamp = combatant.combatant.significantStates
            .reverse().filter((ts) => ts <= timestamp)[0];
          if (sigTimestamp)
            this.updateCombatant(combatant, sigTimestamp);
        }
      }
    });
    // @TODO: Maybe there's a better way to auto-scale this so we don't have to listen to resize?
    window.addEventListener('resize', () => {
      for (const map of Object.values(this.loadedMaps))
        scaleMap(map);
    });
  }
  private clearCombatants() {
    const map = this.currentMap;
    if (!map)
      return;
    const mapSubContainer = querySelectorSafe(map.element, '.subContainer');
    for (const combatant of this.combatantMap) {
      mapSubContainer.removeChild(combatant.element);
      combatant.tooltip?.delete();
    }
    this.combatantMap = [];
  }

  public initCombatants(map: Map): void {
    const combatantTracker = this.emulator.currentEncounter?.encounter.combatantTracker;

    if (!combatantTracker || !map)
      throw new UnreachableCode();

    const mapSubContainer = querySelectorSafe(map.element, '.subContainer');

    for (const [id, entry] of Object.entries(combatantTracker.combatants)) {
      // If the combatant doesn't have a name, don't display
      if (entry.name === '')
        continue;

      let combatant: MapCombatant;
      const firstSigState = entry.significantStates.slice(0)[0] ?? 0;
      const lastSigState = entry.significantStates.slice(-1)[0] ?? 0;
      if (combatantTracker.enemies.includes(id)) {
        combatant = {
          combatant: entry,
          element: cloneSafe(this.mapEnemyTemplate),
          firstSignificantState: firstSigState,
          lastSignificantState: lastSigState,
        };
      } else {
        combatant = {
          combatant: entry,
          element: cloneSafe(this.mapPlayerTemplate),
          firstSignificantState: firstSigState,
          lastSignificantState: lastSigState,
        };
        combatant.element.classList.add(Util.jobToRole(entry.job ?? 'NONE'));
      }
      combatant.tooltip = new Tooltip(querySelectorSafe(combatant.element, '.inner'), 'left', combatant.combatant.name);

      // @TODO: Also mark current perspective as primary
      if (combatantTracker.mainCombatantID === id)
        combatant.element.classList.add('primary');

      mapSubContainer.appendChild(combatant.element);
      this.combatantMap.push(combatant);

      this.updateCombatant(combatant, 0);
    }
  }

  private updateCombatants(timestamp: number) {
    if (this.currentMap) {
      for (const combatant of this.combatantMap)
        this.updateCombatant(combatant, timestamp);
    }
  }
  private updateCombatant(combatant: MapCombatant, timestamp: number): void {
    if (this.currentMap) {
      const state = combatant.combatant.getState(timestamp);

      if (combatant.combatant.significantStates.includes(timestamp)) {
        combatant.element.style.left = coordToOffset(this.currentMap, state.posX).toString() + 'px';
        combatant.element.style.top = coordToOffset(this.currentMap, state.posY).toString() + 'px';
        combatant.element.style.transform = `rotate(${state.heading * -1}rad)`;
      }

      // @TODO: state.targetable is unreliable?
      if (timestamp < combatant.firstSignificantState ||
        combatant.lastSignificantState < timestamp)
        combatant.element.classList.add('d-none');
      else
        combatant.element.classList.remove('d-none');
    }
  }

  public setMap(zone: number, timestamp: number): void {
    const map = this.loadedMaps[zone];
    if (!map || !map.element) {
      console.error(`Attempted to set map that is not loaded: ${zone}`);
      return;
    }

    this.currentMap = map;

    for (const otherMap of Object.values(this.loadedMaps)) {
      if (otherMap.element)
        otherMap.element.classList.add('d-none');
    }

    map.element.classList.remove('d-none');

    if (timestamp)
      this.updateCombatants(timestamp);
  }

  private async loadMap(zone: number): Promise<void> {
    if (this.loadedMaps[zone] || this.loadingMaps[zone])
      return;

    this.loadingMaps[zone] = true;

    return await this.cacheMap(zone).then((content) => {
      const map: Map = {
        territoryType: content,
        element: cloneSafe(this.mapEntryTemplate),
        waymarkers: {
          0: this.cloneWaymarker(0),
          1: this.cloneWaymarker(1),
          2: this.cloneWaymarker(2),
          3: this.cloneWaymarker(3),
          4: this.cloneWaymarker(4),
          5: this.cloneWaymarker(5),
          6: this.cloneWaymarker(6),
          7: this.cloneWaymarker(7),
        },
      };
      this.initMap(map);
      this.loadedMaps[zone] = map;
      delete this.loadingMaps[zone];
    });
  }

  private initMap(map: Map): void {
    const mapObj = map.element;
    const img = querySelectorSafe(mapObj, 'img') as HTMLImageElement;
    const mapUrl = map.territoryType?.Map?.MapFilename;
    if (!mapUrl)
      throw new UnreachableCode(); // This might not be the best choice?
    img.src = xivapiBaseUrl + mapUrl;
    map.element = mapObj;
    scaleMap(map);

    const mapSubContainer = querySelectorSafe(map.element, '.subContainer');

    Object.values(map.waymarkers).forEach((wm) => {
      mapSubContainer.appendChild(wm);
    });

    this.mapContainer.appendChild(mapObj);
    this.initCombatants(map);
  }

  private async cacheMap(zone: number): Promise<TerritoryType> {
    return new Promise<TerritoryType>((res) => {
      void fetch(`${xivapiBaseUrl}TerritoryType/${zone.toString()}`, {
        'credentials': 'omit',
        'method': 'GET',
        'mode': 'cors',
      }).then(async (resp) => {
        const json = await resp.text();
        const instanceContent = JSON.parse(json) as TerritoryType;
        res(instanceContent);
      });
    });
  }

  private cloneWaymarker(id: number): HTMLElement {
    const elem = cloneSafe(this.mapWaymarkerTemplate);
    const img = querySelectorSafe(elem, 'img');
    if (!(img instanceof HTMLImageElement))
      throw new UnreachableCode();

    img.src = waymarkerUrl(id);

    return elem;
  }
}
