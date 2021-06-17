import EmulatorCommon from '../EmulatorCommon';
import EventBus from '../EventBus';
import PersistorEncounter from './PersistorEncounter';
import Encounter from './Encounter';

export default class Persistor extends EventBus {
  constructor() {
    super();
    this.DB = null;
  }

  initializeDB() {
    return new Promise((resolver) => {
      const request = window.indexedDB.open('RaidEmulatorEncounters', Persistor.dbVersion);
      request.addEventListener('success', (ev) => {
        this.DB = ev.target.result;
        resolver();
      });
      request.addEventListener('upgradeneeded', (ev) => {
        const promises = [];
        let encountersStorage;
        let encounterSummariesStorage;
        // We deliberately avoid using breaks for this switch/case to allow
        // incremental upgrades to apply in sequence
        switch (ev.oldVersion) {
        case 0:
          encountersStorage = ev.target.result.createObjectStore('Encounters', {
            keyPath: 'id',
            autoIncrement: true,
          });
          encounterSummariesStorage = ev.target.result.createObjectStore('EncounterSummaries', {
            keyPath: 'id',
            autoIncrement: true,
          });
          encounterSummariesStorage.createIndex('zoneName', 'zoneName');
          encounterSummariesStorage.createIndex('start', 'start');
          encounterSummariesStorage.createIndex('zoneName_start', ['zoneName', 'start']);
        }
        promises.push(new Promise((res) => {
          encountersStorage.transaction.addEventListener('complete', (tev) => {
            res();
          });
        }));
        promises.push(new Promise((res) => {
          encounterSummariesStorage.transaction.addEventListener('complete', (tev) => {
            res();
          });
        }));

        for (const i in promises) {
          Promise.all(promises).then(() => {
            this.DB = ev.target.result;
            resolver();
          });
        }
      });
    });
  }

  persistEncounter(baseEncounter) {
    let ret;
    if (this.DB !== null) {
      let resolver;
      ret = new Promise((res) => {
        resolver = res;
      });
      const encounter = EmulatorCommon.cloneData(baseEncounter, []);
      delete encounter.combatantTracker;
      const encountersStorage = this.encountersStorage;
      let req;
      if (encounter.id === null) {
        delete encounter.id;
        req = encountersStorage.add(encounter);
      } else {
        req = encountersStorage.put(encounter);
      }
      req.addEventListener('success', (ev) => {
        baseEncounter.id = encounter.id = ev.target.result;
        const encounterSummariesStorage = this.encounterSummariesStorage;
        const summary = new PersistorEncounter(baseEncounter);
        const req2 = encounterSummariesStorage.put(summary);
        req2.addEventListener('success', (ev) => {
          resolver();
        });
      });
    } else {
      ret = new Promise((r) => r());
    }
    return ret;
  }

  loadEncounter(id) {
    return new Promise((res) => {
      if (this.DB !== null) {
        const encountersStorage = this.encountersStorage;
        const req = encountersStorage.get(id);
        req.addEventListener('success', (ev) => {
          const enc = req.result;
          const ret = new Encounter(enc.encounterDay,
              enc.encounterZoneId,
              enc.encounterZoneName,
              enc.logLines);
          ret.id = enc.id;
          // Check for encounter upgrade, re-save encounter if it's upgraded.
          if (ret.upgrade(enc.version)) {
            this.persistEncounter(ret).then(() => {
              res(ret);
            });
          } else {
            ret.initialize();
            res(ret);
          }
        });
      } else {
        res(null);
      }
    });
  }

  deleteEncounter(id) {
    return new Promise((res) => {
      if (this.DB !== null) {
        const encountersStorage = this.encountersStorage;
        const req = encountersStorage.delete(id);
        req.addEventListener('success', (ev) => {
          const encounterSummariesStorage = this.encounterSummariesStorage;
          const req = encounterSummariesStorage.delete(id);
          req.addEventListener('success', (ev) => {
            res(true);
          });
          req.addEventListener('error', (ev) => {
            res(false);
          });
        });
        req.addEventListener('error', (ev) => {
          res(false);
        });
      } else {
        res(null);
      }
    });
  }

  listEncounters(zoneName = null, startTimestamp = null, endTimestamp = null) {
    return new Promise((res) => {
      if (this.DB !== null) {
        const encounterSummariesStorage = this.encounterSummariesStorage;
        let keyRange = null;
        let index = null;
        if (zoneName !== null) {
          if (startTimestamp !== null) {
            index = encounterSummariesStorage.index('zoneName_start');
            if (endTimestamp !== null) {
              keyRange = IDBKeyRange.bound([zoneName, startTimestamp], [zoneName, endTimestamp],
                  [true, true], [true, true]);
            } else {
              keyRange = IDBKeyRange.lowerBound([zoneName, startTimestamp], [true, true]);
            }
          } else {
            index = encounterSummariesStorage.index('zoneName');
            keyRange = IDBKeyRange.only(zoneName);
          }
        } else if (startTimestamp !== null) {
          index = encounterSummariesStorage.index('start');
          if (endTimestamp !== null)
            keyRange = IDBKeyRange.bound(startTimestamp, endTimestamp, true, true);
          else
            keyRange = IDBKeyRange.lowerBound(startTimestamp, true);
        }
        let req;
        if (keyRange !== null)
          req = index.getAll(keyRange);
        else
          req = encounterSummariesStorage.getAll();

        req.addEventListener('success', (ev) => {
          res(req.result);
        });
      } else {
        res([]);
      }
    });
  }

  async clearDB() {
    let p1Res;
    const p1 = new Promise((res) => {
      p1Res = res;
    });
    let p2Res;
    const p2 = new Promise((res) => {
      p2Res = res;
    });
    this.encountersStorage.clear().addEventListener('success', () => {
      p1Res();
    });
    this.encounterSummariesStorage.clear().addEventListener('success', () => {
      p2Res();
    });
    await p1;
    await p2;
  }

  async exportDB() {
    const ret = {
      encounters: [],
    };
    const summaries = await this.listEncounters();
    for (const summary of summaries) {
      const enc = await this.loadEncounter(summary.id);
      ret.encounters.push({
        encounterDay: EmulatorCommon.timeToDateString(summary.Start),
        encounterZoneName: summary.ZoneName,
        encounterZoneId: summary.ZoneId,
        encounterLines: enc.logLines,
      });
    }
    return ret;
  }

  async importDB(DB) {
    DB.encounters.forEach((enc) => {
      this.persistEncounter(new Encounter(enc.encounterDay,
          enc.encounterZoneId,
          enc.encounterZoneName,
          enc.encounterLines));
    });
  }

  get encountersStorage() {
    return this.DB.transaction('Encounters', 'readwrite')
      .objectStore('Encounters');
  }
  get encounterSummariesStorage() {
    return this.DB.transaction('EncounterSummaries', 'readwrite')
      .objectStore('EncounterSummaries');
  }
}

Persistor.dbVersion = 3;
