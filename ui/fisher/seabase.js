'use strict';

class SeaBase {
  constructor() {
    this._dbName = 'seabase';
    this._dbVersion = 1;
    this._storeName = 'catches';
    this.db = null;
    this.parserLang = Options.ParserLanguage;
  }

  findKey(obj, val) {
    return Object.keys(obj).find((x) =>
      obj[x] == val ||
      Array.isArray(obj[x]) && obj[x].indexOf(val) >= 0);
  }

  firstIfArray(obj) {
    if (Array.isArray(obj))
      return obj[0];
    return obj;
  }

  getConnection() {
    let _this = this;

    return new Promise(function(resolve, reject) {
      let req = window.indexedDB.open(_this._dbName, _this._dbVersion);

      req.onsuccess = function(event) {
        resolve(this.result);
      };

      req.onerror = function(event) {
        reject(this.error);
      };

      req.onupgradeneeded = function(event) {
        let db = event.target.result;
        let tx = event.target.transaction;
        let objectStore;

        if (!db.objectStoreNames.contains(_this._storeName))
          objectStore = db.createObjectStore(_this._storeName, { autoIncrement: true });
        else
          objectStore = tx.objectStore(_this._storeName);


        if (!objectStore.indexNames.contains('fish'))
          objectStore.createIndex('fish', 'fish', { unique: false });


        if (!objectStore.indexNames.contains('fishbaitchum'))
          objectStore.createIndex('fishbaitchum', ['fish', 'bait', 'chum'], { unique: false });


        tx.oncomplete = function(event) {
          resolve(db);
        };
      };
    });
  }

  getTransaction(db, mode) {
    return db.transaction(this._storeName, mode);
  }

  getIQRThresholds(times) {
    // first, calculate IQR to get a threshold for outliers
    let q1;
    let q3;

    times.sort(function(a, b) {
      return a - b;
    });

    // if there's less than 5 items, just assume it's legit
    if (times.length < 5) {
      return {
        low: times[0],
        high: times[times.length - 1],
      };
    }

    // find q2 (median)
    // we only need the index for the median
    let q2Index = Math.floor(times.length / 2);

    // find q1 (median of first half)
    let q1Index = Math.floor(q2Index / 2);

    if (q2Index % 2 || q2Index == 0)
      q1 = times[q1Index];
    else
      q1 = (times[q1Index] + times[q1Index - 1]) / 2;


    // find q2 (median of second half)
    let q3Index = q1Index + q2Index;

    if (q3Index % 2 || q2Index == 0)
      q3 = times[q3Index];
    else
      q3 = (times[q3Index] + times[q3Index - 1]) / 2;


    let iqr = q3 - q1;

    // use these to calculate thresholds for outliers
    return {
      low: q1 - iqr * 1.5,
      high: q3 + iqr * 1.5,
    };
  }

  normalizeHooks(times) {
    let thresholds = this.getIQRThresholds(times);

    let min;
    let max;
    let i;

    // Iterate forward until a suitable minimum
    for (i = 0; i < times.length; i++) {
      if (times[i] >= thresholds.low) {
        min = times[i];
        break;
      }
    }

    // Iterate backward until a suitable maximum
    for (i = times.length - 1; i >= 0; i--) {
      if (times[i] <= thresholds.high) {
        max = times[i];
        break;
      }
    }

    return {
      min: min,
      max: max,
    };
  }

  addCatch(data) {
    // Add a catch to the database
    let commit = true;
    let _this = this;

    // Make sure we have complete data before recording
    let keys = ['fish', 'bait', 'place', 'castTimestamp', 'hookTime', 'reelTime', 'chum', 'snagging'];

    for (let index in keys) {
      if (!Object.prototype.hasOwnProperty.call(data, keys[index]) ||
          data[keys[index]] === null) {
        commit = false;
        console.log(keys[index] + 'missing in catch');
      }
    }

    if (!commit)
      return false;

    this.getConnection().then(function(db) {
      let tx = db.transaction(_this._storeName, 'readwrite');
      let store = tx.objectStore(_this._storeName);

      store.add(data);
    });
  }

  getInfo(lookup, value) {
    // Note: the name entry may be a single string, or it may
    // be an array with multiple values in it.  The first name
    // in the array is the canonical value and should always be
    // returned, even if looking up by another name in its list.
    // This lets getPlace("german grammar used only when casting")
    // return the correct place name to display in the ui.
    let info;
    // Value can be one of three things
    if (typeof value === 'object' && value !== null) {
      // 1. Object with id and/or name
      // If we have one and not the other, fill in the other
      if (value.id && !value.name) {
        info = {
          id: value.id,
          name: this.firstIfArray(gFisherData[lookup][this.parserLang][value.id]),
        };
      } else if (!value.id && value.name) {
        // Return the first / primary name regardless of what is passed in
        // when doing a reverse lookup by name.
        let key = this.findKey(gFisherData[lookup][this.parserLang], value.name);
        info = {
          id: key,
          name: this.firstIfArray(gFisherData[lookup][this.parserLang][key]),
        };
      } else {
        info = value;
      }
    } else if (isNaN(value)) {
      // 2. String with the name
      // See note above about reverse lookups.
      let key = this.findKey(gFisherData[lookup][this.parserLang], value);
      info = {
        id: key,
        name: this.firstIfArray(gFisherData[lookup][this.parserLang][key]),
      };
    } else {
      // 3. Number with the ID
      info = {
        id: value,
        name: this.firstIfArray(gFisherData[lookup][this.parserLang][value]),
      };
    }

    return info;
  }

  getFish(fish) {
    let result = this.getInfo('fish', fish);
    if (!result.id || !result.name)
      console.log('failed to look up fish: ' + fish);
    return result;
  }

  getBait(bait) {
    let result = this.getInfo('tackle', bait);
    if (!result.id || !result.name)
      console.log('failed to look up bait: ' + bait);
    return result;
  }

  getPlace(place) {
    let result = this.getInfo('places', place);

    // English assumes that there could be a 'the' which fails
    // for fishing locations that include the 'The'.
    // This should probably be a noop for other languages.
    if (!result.id || !result.name)
      result = this.getInfo('places', 'The ' + place);

    if (!result.id || !result.name)
      console.log('failed to look up place: ' + place);
    return result;
  }

  getFishForPlace(place) {
    // Get place object
    let placeObject = this.getPlace(place);

    // Get fish IDs for place ID
    let fishList = gFisherData['placefish'][placeObject.id];

    // Get fish names for IDs
    let placeFish = [];
    for (let fishID in fishList)
      placeFish.push(this.getFish(fishList[fishID]));


    return placeFish;
  }

  queryHookTimes(index, fish, bait, chum) {
    let times = [];

    return new Promise(function(resolve, reject) {
      index.openCursor(IDBKeyRange.only([fish.id.toString(), bait.id, chum ? 1 : 0]))
        .onsuccess = function(event) {
          let cursor = event.target.result;

          if (cursor) {
            times.push(cursor.value.hookTime);
            if (times.length < Options.IQRHookQuantity)
              cursor.continue();
            else
              resolve(times);
          } else {
            resolve(times);
          }
        };
    });
  }

  getHookTimes(fish, bait, chum) {
    let _this = this;

    if (!fish || !bait) {
      return new Promise(function(resolve, reject) {
        resolve();
      });
    }

    return new Promise(function(resolve, reject) {
      _this.getConnection().then(function(db) {
        let tx = db.transaction(_this._storeName, 'readwrite');
        let store = tx.objectStore(_this._storeName);
        let index = store.index('fishbaitchum');

        _this.queryHookTimes(index, fish, bait, chum).then(function(times) {
          if (!times.length)
            resolve({ min: undefined, max: undefined });
          resolve(_this.normalizeHooks(times));
        });
      });
    });
  }

  queryTug(index, fish) {
    let reelTimes = [];

    return new Promise(function(resolve, reject) {
      index.openCursor(IDBKeyRange.only(fish.id.toString())).onsuccess = function(event) {
        let cursor = event.target.result;

        if (cursor) {
          reelTimes.push(cursor.value.reelTime);
          if (reelTimes.length < Options.IQRTugQuantity)
            cursor.continue();
          else
            resolve(reelTimes);
        } else {
          resolve(reelTimes);
        }
      };
    });
  }

  getTug(fish) {
    let _this = this;

    return new Promise(function(resolve, reject) {
      _this.getConnection().then(function(db) {
        let tx = db.transaction(_this._storeName, 'readwrite');
        let store = tx.objectStore(_this._storeName);
        let index = store.index('fish');

        let tug = gFisherData['tugs'][fish.id];
        if (tug) {
          resolve(tug);
        } else {
          _this.queryTug(index, fish).then(function(reelTimes) {
            if (!reelTimes.length)
              resolve(0);

            let thresholds = _this.getIQRThresholds(reelTimes);

            let sum = 0;
            let validValues = 0;

            reelTimes.forEach(function(time) {
              if (time >= thresholds.low && time <= thresholds.high) {
                sum += time;
                validValues++;
              }
            });

            let average = sum / validValues;
            let tug;

            // Small: <8000
            // Medium: >8000, <10700
            // Large: >10700
            // 1 small, 2 medium, 3 large
            if (average < 8000)
              tug = 1;
            else if (average > 10700)
              tug = 3;
            else
              tug = 2;


            resolve(tug);
          });
        }
      });
    });
  }
}
