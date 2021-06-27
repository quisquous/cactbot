import Dexie from 'dexie';
import 'dexie-export-import';

import Encounter from './Encounter';
import LineEvent from './network_log_converter/LineEvent';
import PersistorEncounter from './PersistorEncounter';

export default class Persistor extends Dexie {
  encounters: Dexie.Table<Encounter, number>;
  encounterSummaries: Dexie.Table<PersistorEncounter, number>;

  constructor() {
    super('RaidEmulatorEncounters');

    this.version(1).stores({
      EncounterSummaries: '++id,start,zoneName,[zoneName+start]',
      Encounters: '++id',
    });

    this.encounters = this.table('Encounters');
    this.encounterSummaries = this.table('EncounterSummaries');

    this.encounterSummaries.mapToClass(PersistorEncounter);

    this.use({
      stack: 'dbcore',
      create: (down) => {
        return {
          ...down,
          table: (name) => {
            const table = down.table(name);
            if (name === 'Encounters') {
              return {
                ...table,
                get: async (req) => {
                  const obj: Encounter = await table.get(req) as Encounter;

                  Object.setPrototypeOf(obj, Encounter.prototype);

                  obj.logLines.forEach((l) => {
                    Object.setPrototypeOf(l, LineEvent.prototype);
                  });

                  // Check for encounter upgrade, re-save encounter if it's upgraded.
                  if (obj.upgrade(obj.version))
                    await this.encounters.put(obj, obj.id);
                  obj.initialize();

                  return obj;
                },
              };
            }
            return table;
          },
        };
      },
    });
  }

  persistEncounter(baseEncounter: Encounter): Promise<[number, number]> {
    const summary = new PersistorEncounter(baseEncounter);
    if (baseEncounter.id !== undefined) {
      return Promise.all([
        this.encounterSummaries.put(summary, baseEncounter.id),
        this.encounters.put(baseEncounter, baseEncounter.id),
      ]);
    }
    return Promise.all([
      this.encounterSummaries.add(summary, baseEncounter.id),
      this.encounters.add(baseEncounter, baseEncounter.id),
    ]);
  }

  async clearDB(): Promise<void> {
    await this.encounters.clear();
    await this.encounterSummaries.clear();
  }

  async exportDB(): Promise<Blob> {
    return this.export();
  }

  async importDB(file: File): Promise<void> {
    return this.import(file);
  }
}
