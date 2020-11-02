'use strict';

class Persistor extends EventBus {
  constructor() {
    super();
    this.DB = null;
    this.initializeDB();
  }

  initializeDB() {
    let request = window.indexedDB.open('RaidEmulatorEncounters', Persistor.dbVersion);
    request.addEventListener('success', (ev) => {
      this.DB = ev.target.result;
      this.dispatch('ready');
    });
    request.addEventListener('upgradeneeded', (ev) => {
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
    });
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
      req.addEventListener('success', (ev) => {
        baseEncounter.id = encounter.id = ev.target.result;
        let encounterSummariesStorage = this.encounterSummariesStorage;
        let summary = new PersistorEncounter(baseEncounter);
        let req2 = encounterSummariesStorage.put(summary);
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
        let encountersStorage = this.encountersStorage;
        let req = encountersStorage.get(id);
        req.addEventListener('success', (ev) => {
          let enc = req.result;
          let ret = new Encounter(enc.encounterDay,
              enc.encounterZoneId,
              enc.encounterZoneName,
              enc.logLines);
          ret.id = enc.id;
          res(ret);
        });
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
        req.addEventListener('success', (ev) => {
          let encounterSummariesStorage = this.encounterSummariesStorage;
          let req = encounterSummariesStorage.delete(id);
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
        let encounterSummariesStorage = this.encounterSummariesStorage;
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
    let p1 = new Promise((res) => {
      p1Res = res;
    });
    let p2Res;
    let p2 = new Promise((res) => {
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
    let ret = {
      encounters: [],
    };
    let summaries = await this.listEncounters();
    for (let summary of summaries) {
      let enc = await this.loadEncounter(summary.id);
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

if (typeof module !== 'undefined' && module.exports)
  module.exports = Persistor;
