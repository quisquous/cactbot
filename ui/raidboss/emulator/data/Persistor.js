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
          EncountersStorage = ev.target.result.createObjectStore("Encounters", { keyPath: "ID", autoIncrement: true });
          EncounterSummariesStorage = ev.target.result.createObjectStore("EncounterSummaries", { keyPath: "ID", autoIncrement: true });
          EncounterSummariesStorage.createIndex("zone", "Zone");
          EncounterSummariesStorage.createIndex("start", "Start");
          EncounterSummariesStorage.createIndex("zone_start", ["Zone", "Start"]);
        case 2:
          EncounterSummariesStorage = EncounterSummariesStorage ||
            ev.target.transaction.objectStore("EncounterSummaries");
          EncountersStorage = EncountersStorage ||
            ev.target.transaction.objectStore("Encounters");
          // Added duration to encounter summary in v3, handle upgrade
          // This is really ugly code, yay async stuff.
          Promises.push(new Promise((res) => {
            let req = EncounterSummariesStorage.getAll();
            req.onsuccess = (ev) => {
              for (let i in req.result) {
                Promises.push(new Promise((res) => {
                  let req2 = EncountersStorage.get(req.result[i].ID);
                  Promises.push(new Promise((res) => {
                    req2.onsuccess = (ev) => {
                      req.result[i].Duration = req2.result.endTimestamp - req2.result.startTimestamp;
                      let req3 = EncounterSummariesStorage.put(req.result[i]);
                      Promises.push(new Promise((res) => {
                        req3.onsuccess = (ev) => {
                          res();
                        };
                      }));
                      res();
                    };
                  }));
                  res();
                }));
              }
              res();
            };
          }));
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

  PersistEncounter(encounter) {
    if (this.DB !== null) {
      let EncountersStorage = this.DB.transaction("Encounters", "readwrite").objectStore("Encounters");
      let req;
      if (encounter.ID === null) {
        delete encounter.ID;
        req = EncountersStorage.add(encounter);
      } else {
        req = EncountersStorage.put(encounter);
      }
      req.onsuccess = (ev) => {
        encounter.ID = ev.target.result;
        let EncounterSummariesStorage = this.DB.transaction("EncounterSummaries", "readwrite").objectStore("EncounterSummaries");
        let Summary = new PersistorEncounter();
        Summary.ID = encounter.ID;
        Summary.Name = encounter.combatantTracker.combatants[encounter.combatantTracker.mainCombatantID].Name;
        Summary.Start = encounter.startTimestamp;
        Summary.Zone = encounter.encounterZone;
        Summary.Duration = encounter.endTimestamp - encounter.startTimestamp;
        EncounterSummariesStorage.put(Summary);
      };
    }
  }

  LoadEncounter(ID) {
    return new Promise((res) => {
      if (this.DB !== null) {
        let EncountersStorage = this.DB.transaction("Encounters", "readonly").objectStore("Encounters");
        let req = EncountersStorage.get(ID);
        req.onsuccess = (ev) => {
          res(req.result);
        };
      } else {
        res(null);
      }
    });
  }

  DeleteEncounter(ID) {
    return new Promise((res) => {
      if (this.DB !== null) {
        let EncountersStorage = this.DB.transaction("Encounters", "readwrite").objectStore("Encounters");
        let req = EncountersStorage.delete(ID);
        req.onsuccess = (ev) => {
          let EncounterSummariesStorage = this.DB.transaction("EncounterSummaries", "readwrite").objectStore("EncounterSummaries");
          let req = EncounterSummariesStorage.delete(ID);
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

  ListEncounters(Zone = null, StartTimestamp = null, EndTimestamp = null) {
    return new Promise((res) => {
      if (this.DB !== null) {
        let EncountersStorage = this.DB.transaction("EncounterSummaries", "readonly").objectStore("EncounterSummaries");
        let KeyRange = null;
        let Index = null;
        if (Zone !== null) {
          if (StartTimestamp !== null) {
            Index = EncountersStorage.index("zone_start");
            if (EndTimestamp !== null) {
              KeyRange = IDBKeyRange.bound([Zone, StartTimestamp], [Zone, EndTimestamp], [true, true], [true, true]);
            } else {
              KeyRange = IDBKeyRange.lowerBound([Zone, StartTimestamp], [true, true]);
            }
          } else {
            Index = EncountersStorage.index("zone");
            KeyRange = IDBKeyRange.only(Zone);
          }
        } else if (StartTimestamp !== null) {
          Index = EncountersStorage.index("start");
          if (EndTimestamp !== null) {
            KeyRange = IDBKeyRange.bound(StartTimestamp, EndTimestamp, true, true);
          } else {
            KeyRange = IDBKeyRange.lowerBound(StartTimestamp, true);
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

}