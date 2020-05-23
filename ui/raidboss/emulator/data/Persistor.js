'use strict';

class Persistor extends EventBus {
  constructor() {
    super();
    this.DB = null;
    this.initializeDB();
  }

  initializeDB() {
    let request = window.indexedDB.open('RaidEmulatorEncounters', Persistor.DB_VERSION);
    request.onsuccess = (ev) => {
      this.DB = ev.target.result;
      this.dispatch('ready');
    };
    request.onupgradeneeded = (ev) => {
      let promises = [];
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
        encounterSummariesStorage.createIndex('zone', 'zone');
        encounterSummariesStorage.createIndex('start', 'start');
        encounterSummariesStorage.createIndex('zone_start', ['zone', 'start']);
      }
      promises.push(new Promise((res) => {
        encountersStorage.transaction.oncomplete = (tev) => {
          res();
        };
      }));
      promises.push(new Promise((res) => {
        encounterSummariesStorage.transaction.oncomplete = (tev) => {
          res();
        };
      }));

      let completed = 0;
      for (let i in promises) {
        promises[i].then(() => {
          ++completed;
          if (completed === promises.length) {
            this.DB = ev.target.result;
            this.dispatch('ready');
          }
        });
      }
    };
  }

  persistEncounter(baseEncounter) {
    let ret;
    if (this.DB !== null) {
      let resolver;
      ret = new Promise((res) => {
        resolver = res;
      });
      let encounter = EmulatorCommon.cloneData(baseEncounter, []);
      delete encounter.combatantTracker;
      let encountersStorage = this.encountersStorage;
      let req;
      if (encounter.id === null) {
        delete encounter.id;
        req = encountersStorage.add(encounter);
      } else {
        req = encountersStorage.put(encounter);
      }
      req.onsuccess = (ev) => {
        baseEncounter.id = encounter.id = ev.target.result;
        let encounterSummariesStorage = this.encounterSummariesStorage;
        let summary = new PersistorEncounter(baseEncounter);
        let req2 = encounterSummariesStorage.put(summary);
        req2.onsuccess = (ev) => {
          resolver();
        };
      };
    } else {
      ret = new Promise((r) => r());
    }
    return ret;
  }

  loadEncounter(id) {
    return new Promise((res) => {
      if (this.DB !== null) {
        let encountersStorage = this.encountersStorage;
        let req = encountersStorage.get(id);
        req.onsuccess = (ev) => {
          let enc = req.result;
          let ret = new Encounter(enc.encounterDay, enc.encounterZone, enc.logLines);
          ret.id = enc.id;
          res(ret);
        };
      } else {
        res(null);
      }
    });
  }

  deleteEncounter(id) {
    return new Promise((res) => {
      if (this.DB !== null) {
        let encountersStorage = this.encountersStorage;
        let req = encountersStorage.delete(id);
        req.onsuccess = (ev) => {
          let encounterSummariesStorage = this.encounterSummariesStorage;
          let req = encounterSummariesStorage.delete(id);
          req.onsuccess = (ev) => {
            res(true);
          };
          req.onerror = (ev) => {
            res(false);
          };
        };
        req.onerror = (ev) => {
          res(false);
        };
      } else {
        res(null);
      }
    });
  }

  listEncounters(zone = null, startTimestamp = null, endTimestamp = null) {
    return new Promise((res) => {
      if (this.DB !== null) {
        let encounterSummariesStorage = this.encounterSummariesStorage;
        let keyRange = null;
        let index = null;
        if (zone !== null) {
          if (startTimestamp !== null) {
            index = encounterSummariesStorage.index('zone_start');
            if (endTimestamp !== null) {
              keyRange = IDBKeyRange.bound([zone, startTimestamp], [zone, endTimestamp],
                  [true, true], [true, true]);
            } else {
              keyRange = IDBKeyRange.lowerBound([zone, startTimestamp], [true, true]);
            }
          } else {
            index = encounterSummariesStorage.index('zone');
            keyRange = IDBKeyRange.only(zone);
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
          req = index.openKeyCursor(keyRange);
        else
          req = encounterSummariesStorage.getAll();

        req.onsuccess = (ev) => {
          res(req.result);
        };
      } else {
        res([]);
      }
    });
  }

  async clearDB() {
    await this.listEncounters().then(async (encounters) => {
      for (let encounter of encounters)
        await this.deleteEncounter(encounter.id);
    });
  }

  async exportDB() {
    let ret = {
      encounters: [],
    };
    let summaries = await this.listEncounters();
    for (let summary of summaries) {
      let enc = await this.loadEncounter(summary.id);
      ret.encounters.push({
        encounterDay: timeToDateString(summary.Start),
        encounterZone: summary.Zone,
        encounterLines: enc.logLines,
      });
    }
    return ret;
  }

  async importDB(DB) {
    DB.encounters.forEach((enc) => {
      this.persistEncounter(new Encounter(enc.encounterDay, enc.encounterZone, enc.encounterLines));
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

Persistor.DB_VERSION = 3;
