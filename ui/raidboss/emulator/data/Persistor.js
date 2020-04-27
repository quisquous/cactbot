class Persistor extends EventBus {
  static DB_VERSION = 3;

  /**
   * @type IDBDatabase
   */
  DB = null;

  /**
   * @type IDBObjectStore
   */
  EncountersStorage = null;

  constructor() {
    super();
    this.DB = null;
    this.EncountersStorage = null;
    this.InitializeDB();
  }

  InitializeDB() {
    let request = window.indexedDB.open("RaidEmulatorEncounters", Persistor.DB_VERSION);
    request.onsuccess = (ev) => {
      this.DB = ev.target.result;
      this.dispatch('ready');
    };
    request.onupgradeneeded = (ev) => {
      let Promises = [];
      let EncountersStorage;
      let EncounterSummariesStorage;
      // We deliberately avoid using breaks for this switch/case to allow incremental upgrades to apply in sequence
      switch (ev.oldVersion) {
        case 0:
          EncountersStorage = ev.target.result.createObjectStore("Encounters", { keyPath: "id", autoIncrement: true });
          EncounterSummariesStorage = ev.target.result.createObjectStore("EncounterSummaries", { keyPath: "id", autoIncrement: true });
          EncounterSummariesStorage.createIndex("zone", "zone");
          EncounterSummariesStorage.createIndex("start", "start");
          EncounterSummariesStorage.createIndex("zone_start", ["zone", "start"]);
      }
      Promises.push(new Promise((res) => {
        EncountersStorage.transaction.oncomplete = (tev) => {
          res();
        };
      }));
      Promises.push(new Promise((res) => {
        EncounterSummariesStorage.transaction.oncomplete = (tev) => {
          res();
        };
      }));

      let Completed = 0;
      for (let i in Promises) {
        Promises[i].then(() => {
          ++Completed;
          if (Completed === Promises.length) {
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
      let encounter = $.extend(true, {}, baseEncounter);
      delete encounter.combatantTracker;
      let EncountersStorage = this.DB.transaction("Encounters", "readwrite").objectStore("Encounters");
      let req;
      if (encounter.id === null) {
        delete encounter.id;
        req = EncountersStorage.add(encounter);
      } else {
        req = EncountersStorage.put(encounter);
      }
      req.onsuccess = (ev) => {
        baseEncounter.id = encounter.id = ev.target.result;
        let EncounterSummariesStorage = this.DB.transaction("EncounterSummaries", "readwrite").objectStore("EncounterSummaries");
        let Summary = new PersistorEncounter(baseEncounter);
        EncounterSummariesStorage.put(Summary);
        resolver();
      };
    } else {
      ret = new Promise((r) => r());
    }
    return ret;
  }

  loadEncounter(id) {
    return new Promise((res) => {
      if (this.DB !== null) {
        let EncountersStorage = this.DB.transaction("Encounters", "readonly").objectStore("Encounters");
        let req = EncountersStorage.get(id);
        req.onsuccess = (ev) => {
          let enc = new Encounter(req.result.encounterDay, req.result.encounterZone, req.result.logLines);
          enc.id = req.result.id;
          res(enc);
        };
      } else {
        res(null);
      }
    });
  }

  deleteEncounter(id) {
    return new Promise((res) => {
      if (this.DB !== null) {
        let EncountersStorage = this.DB.transaction("Encounters", "readwrite").objectStore("Encounters");
        let req = EncountersStorage.delete(id);
        req.onsuccess = (ev) => {
          let EncounterSummariesStorage = this.DB.transaction("EncounterSummaries", "readwrite").objectStore("EncounterSummaries");
          let req = EncounterSummariesStorage.delete(id);
          req.onsuccess = (ev) => {
            res(true);
          };
          req.onerror = (ev) => {
            res(false);
          }
        };
        req.onerror = (ev) => {
          res(false);
        }
      } else {
        res(null);
      }
    });
  }

  ListEncounters(zone = null, startTimestamp = null, endTimestamp = null) {
    return new Promise((res) => {
      if (this.DB !== null) {
        let EncountersStorage = this.DB.transaction("EncounterSummaries", "readonly").objectStore("EncounterSummaries");
        let KeyRange = null;
        let Index = null;
        if (zone !== null) {
          if (startTimestamp !== null) {
            Index = EncountersStorage.index("zone_start");
            if (endTimestamp !== null) {
              KeyRange = IDBKeyRange.bound([zone, startTimestamp], [zone, endTimestamp], [true, true], [true, true]);
            } else {
              KeyRange = IDBKeyRange.lowerBound([zone, startTimestamp], [true, true]);
            }
          } else {
            Index = EncountersStorage.index("zone");
            KeyRange = IDBKeyRange.only(zone);
          }
        } else if (startTimestamp !== null) {
          Index = EncountersStorage.index("start");
          if (endTimestamp !== null) {
            KeyRange = IDBKeyRange.bound(startTimestamp, endTimestamp, true, true);
          } else {
            KeyRange = IDBKeyRange.lowerBound(startTimestamp, true);
          }
        }
        let req;
        if (KeyRange !== null) {
          req = Index.openKeyCursor(KeyRange);
        } else {
          req = EncountersStorage.getAll();
        }
        req.onsuccess = (ev) => {
          res(req.result);
        };
      } else {
        res([]);
      }
    });
  }

  async clearDB() {
    await this.ListEncounters().then(async (encounters) => {
      for (let i in encounters) {
        await this.deleteEncounter(encounters[i].id);
      }
    });
  }

  async exportDB() {
    let ret = {
      Encounters: [],
    };
    let Summaries = await this.ListEncounters();
    for (let i in Summaries) {
      let enc = await this.loadEncounter(Summaries[i].id);
      ret.Encounters.push({
        encounterDay: timeToDateString(Summaries[i].Start),
        encounterZone: Summaries[i].Zone,
        encounterLines: enc.logLines,
      });
    }
    return ret;
  }

  async importDB(DB) {
    DB.Encounters.forEach(enc => {
      this.persistEncounter(new Encounter(enc.encounterDay, enc.encounterZone, enc.encounterLines));
    });
  }

}