import { worldNameToWorld } from '../../../../resources/world_id';
import { PluginCombatantState } from '../../../../types/event';

export default class CombatantState implements PluginCombatantState {
  CurrentWorldID?: number | undefined;
  WorldID?: number | undefined;
  WorldName?: string | undefined;
  BNpcID?: number | undefined;
  BNpcNameID?: number | undefined;
  PartyType?: number | undefined;
  ID?: number | undefined;
  OwnerID?: number | undefined;
  WeaponId?: number | undefined;
  type?: number | undefined;
  Job?: number | undefined;
  Level?: number | undefined;
  Name?: string | undefined;
  CurrentHP: number;
  MaxHP: number;
  CurrentMP: number;
  MaxMP: number;
  PosX: number;
  PosY: number;
  PosZ: number;
  Heading: number;

  targetable: boolean;

  constructor(props: Partial<PluginCombatantState>, targetable: boolean) {
    Object.assign(this, props);

    // Force these values to something sane in case they're not in `props`
    this.CurrentHP ??= 0;
    this.MaxHP ??= 0;
    this.CurrentMP ??= 0;
    this.MaxMP ??= 0;
    this.PosX ??= 0;
    this.PosY ??= 0;
    this.PosZ ??= 0;
    this.Heading ??= 0;

    this.targetable = targetable;
  }

  partialClone(props: Partial<CombatantState>): CombatantState {
    return new CombatantState({ ...this, ...props }, this.targetable);
  }

  fullClone(): CombatantState {
    return new CombatantState({ ...this }, this.targetable);
  }

  setName(name: string): void {
    // Sometimes network lines arrive after the combatant has been cleared
    // from memory in the client, so the network line will have a valid ID
    // but the name will be blank. Since we're tracking the name for the
    // entire fight and not on a state-by-state basis, we don't want to
    // blank out a name in this case.
    // If a combatant actually has a blank name, that's still allowed by
    // the constructor.
    if (name === '')
      return;

    const parts = name.split('(');
    this.Name = parts[0] ?? '';
    if (parts.length > 1) {
      const worldName = parts[1]?.replace(/\)$/, '');
      if (worldName !== undefined) {
        const world = worldNameToWorld(worldName);
        if (world !== undefined)
          this.WorldID = world.id;
      }
    }
  }
}
