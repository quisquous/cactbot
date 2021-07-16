import Dexie from 'dexie';
import 'dexie-export-import';

import Encounter from './Encounter';
import LineEvent from './network_log_converter/LineEvent';
import PersistorEncounter from './PersistorEncounter';

export default class Persistor extends Dexie {
  private encounters: Dexie.Table<Encounter, number>;
  public encounterSummaries: Dexie.Table<PersistorEncounter, number>;

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
                  if (obj.upgrade(obj.version)) {
                    await this.persistEncounter(obj);
                    return obj;
                  }
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

  public async loadEncounter(id: number): Promise<Encounter | undefined> {
    return new Promise<Encounter | undefined>((res) => {
      void this.transaction('readwrite', [this.encounters, this.encounterSummaries], async () => {
        res(await this.encounters.get(id));
      });
    });
  }

  public async persistEncounter(baseEncounter: Encounter): Promise<unknown> {
    const summary = new PersistorEncounter(baseEncounter);
    if (baseEncounter.id !== undefined) {
      await this.encounterSummaries.put(summary, baseEncounter.id);
      return this.encounters.put(baseEncounter, baseEncounter.id);
    }
    const id = await this.encounters.add(baseEncounter);
    baseEncounter.id = id;
    summary.id = id;
    return this.encounterSummaries.add(summary, id);
  }

  public async deleteEncounter(id: number): Promise<unknown> {
    await this.encounterSummaries.delete(id);
    return this.encounters.delete(id);
  }

  public async clearDB(): Promise<void> {
    await this.encounters.clear();
    await this.encounterSummaries.clear();
  }

  public async exportDB(): Promise<Blob> {
    return this.export();
  }

  public async importDB(file: File): Promise<void> {
    return this.import(file);
  }
}
