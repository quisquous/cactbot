import Dexie from 'dexie';

import { UnreachableCode } from '../../../../resources/not_reached';

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

  async exportDB(): Promise<string> {
    let ret = '';
    await this.encounters.each((enc, _cursor) => {
      const firstLine = enc.logLines[0]?.networkLine;
      if (!firstLine)
        throw new UnreachableCode();
      const parts = firstLine.split('|');
      // Build a zone change line if the first line isn't a zone change line
      if (parts[0] !== '01') {
        const ts = parts[1] ?? '';
        ret += `01|${ts}|${enc.encounterZoneId}|${enc.encounterZoneName}|0123456789abcdef0123456789abcdef\r\n`;
      }
      ret += enc.logLines.map((l) => l.networkLine).join('\r\n') + '\r\n';
    }).catch((err) => console.log(err));
    return ret;
  }
}
