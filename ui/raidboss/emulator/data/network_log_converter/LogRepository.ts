export type Combatant = {
  name?: string;
  job?: string;
  spawn: number;
  despawn: number;
}

export default class LogRepository {
  Combatants: { [id: string]: Combatant } = {};
  firstTimestamp = Number.MAX_SAFE_INTEGER;

  updateTimestamp(timestamp: number): void {
    this.firstTimestamp = Math.min(this.firstTimestamp, timestamp);
  }

  updateCombatant(id: string, c: Combatant): void {
    id = id.toUpperCase();
    if (id && id.length) {
      let combatant = this.Combatants[id];
      if (combatant === undefined) {
        combatant = {
          name: c.name,
          job: c.job,
          spawn: c.spawn,
          despawn: c.despawn,
        };
        this.Combatants[id] = combatant;
      } else {
        combatant.name = c.name || combatant.name;
        combatant.job = c.job || combatant.job;
        combatant.spawn = Math.min(combatant.spawn, c.spawn);
        combatant.despawn = Math.max(combatant.despawn, c.despawn);
      }
    }
  }

  resolveName(
      id: string,
      name: string,
      fallbackId: string | null = null,
      fallbackName: string | null = null): string {
    let ret = name;

    if (fallbackId !== null) {
      if (id === 'E0000000' && ret === '') {
        if (fallbackId.startsWith('4'))
          ret = fallbackName ?? '';
        else
          ret = 'Unknown';
      }
    }

    if (ret === '')
      ret = this.Combatants[id]?.name ?? '';

    return ret;
  }
}
