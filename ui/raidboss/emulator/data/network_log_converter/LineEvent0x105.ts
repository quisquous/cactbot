import logDefinitions from '../../../../../resources/netlog_defs';
import { PluginCombatantState } from '../../../../../types/event';

import LineEvent from './LineEvent';
import LogRepository from './LogRepository';

const definition = logDefinitions.CombatantMemory;
const fields = definition.fields;

const isValidChange = (change: string | undefined): change is 'Add' | 'Change' | 'Remove' => {
  return change !== undefined && ['Add', 'Change', 'Remove'].includes(change);
};

const isPluginStateKey = (key: string): key is keyof PluginCombatantState => {
  return definition.repeatingFields.possibleKeys.includes(key as keyof PluginCombatantState);
};

// Combatant memory event
export class LineEvent0x105 extends LineEvent {
  public readonly change?: 'Add' | 'Change' | 'Remove';
  public readonly id: number;
  public readonly idHex: string;
  public readonly state: Partial<PluginCombatantState>;

  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);

    const change = parts[fields.change];
    if (isValidChange(change))
      this.change = change;

    this.idHex = parts[fields.id] ?? '';
    this.id = parseInt(this.idHex, 16);

    const stateSets = parts.slice(definition.repeatingFields.startingIndex, -1);

    const stringStateMap: { [field in keyof PluginCombatantState]?: string } = {};

    for (let i = 0; i < stateSets.length; i += 2) {
      const key = stateSets[i];
      const value = stateSets[i + 1];
      if (key === undefined || value === undefined)
        continue;

      if (!isPluginStateKey(key))
        continue;

      stringStateMap[key] = value;
    }

    this.state = {};

    // Strings
    if (stringStateMap.Distance !== undefined)
      this.state.Distance = stringStateMap.Distance;
    if (stringStateMap.EffectiveDistance !== undefined)
      this.state.EffectiveDistance = stringStateMap.EffectiveDistance;
    if (stringStateMap.Name !== undefined)
      this.state.Name = stringStateMap.Name;
    if (stringStateMap.WorldName !== undefined)
      this.state.WorldName = stringStateMap.WorldName;

    // Booleans
    if (stringStateMap.IsTargetable !== undefined)
      this.state.IsTargetable = Boolean(parseInt(stringStateMap.IsTargetable));

    // Base-16 numbers (IDs)
    if (stringStateMap.BNpcID !== undefined)
      this.state.BNpcID = parseInt(stringStateMap.BNpcID, 16);
    if (stringStateMap.BNpcNameID !== undefined)
      this.state.BNpcNameID = parseInt(stringStateMap.BNpcNameID, 16);
    if (stringStateMap.NPCTargetID !== undefined)
      this.state.NPCTargetID = parseInt(stringStateMap.NPCTargetID, 16);
    if (stringStateMap.PCTargetID !== undefined)
      this.state.PCTargetID = parseInt(stringStateMap.PCTargetID, 16);
    if (stringStateMap.OwnerID !== undefined)
      this.state.OwnerID = parseInt(stringStateMap.OwnerID, 16);
    if (stringStateMap.TargetID !== undefined)
      this.state.TargetID = parseInt(stringStateMap.TargetID, 16);
    if (stringStateMap.CastTargetID !== undefined)
      this.state.CastTargetID = parseInt(stringStateMap.CastTargetID, 16);

    // Numbers
    if (stringStateMap.CurrentWorldID !== undefined)
      this.state.CurrentWorldID = parseFloat(stringStateMap.CurrentWorldID);
    if (stringStateMap.WorldID !== undefined)
      this.state.WorldID = parseFloat(stringStateMap.WorldID);
    if (stringStateMap.PartyType !== undefined)
      this.state.PartyType = parseFloat(stringStateMap.PartyType);
    if (stringStateMap.ID !== undefined)
      this.state.ID = parseFloat(stringStateMap.ID);
    if (stringStateMap.WeaponId !== undefined)
      this.state.WeaponId = parseFloat(stringStateMap.WeaponId);
    if (stringStateMap.Type !== undefined)
      this.state.Type = parseFloat(stringStateMap.Type);
    if (stringStateMap.Job !== undefined)
      this.state.Job = parseFloat(stringStateMap.Job);
    if (stringStateMap.Level !== undefined)
      this.state.Level = parseFloat(stringStateMap.Level);
    if (stringStateMap.CurrentHP !== undefined)
      this.state.CurrentHP = parseFloat(stringStateMap.CurrentHP);
    if (stringStateMap.MaxHP !== undefined)
      this.state.MaxHP = parseFloat(stringStateMap.MaxHP);
    if (stringStateMap.CurrentMP !== undefined)
      this.state.CurrentMP = parseFloat(stringStateMap.CurrentMP);
    if (stringStateMap.MaxMP !== undefined)
      this.state.MaxMP = parseFloat(stringStateMap.MaxMP);
    if (stringStateMap.PosX !== undefined)
      this.state.PosX = parseFloat(stringStateMap.PosX);
    if (stringStateMap.PosY !== undefined)
      this.state.PosY = parseFloat(stringStateMap.PosY);
    if (stringStateMap.PosZ !== undefined)
      this.state.PosZ = parseFloat(stringStateMap.PosZ);
    if (stringStateMap.Heading !== undefined)
      this.state.Heading = parseFloat(stringStateMap.Heading);
    if (stringStateMap.MonsterType !== undefined)
      this.state.MonsterType = parseFloat(stringStateMap.MonsterType);
    if (stringStateMap.Status !== undefined)
      this.state.Status = parseFloat(stringStateMap.Status);
    if (stringStateMap.ModelStatus !== undefined)
      this.state.ModelStatus = parseFloat(stringStateMap.ModelStatus);
    if (stringStateMap.AggressionStatus !== undefined)
      this.state.AggressionStatus = parseFloat(stringStateMap.AggressionStatus);
    if (stringStateMap.Radius !== undefined)
      this.state.Radius = parseFloat(stringStateMap.Radius);
    if (stringStateMap.CurrentGP !== undefined)
      this.state.CurrentGP = parseFloat(stringStateMap.CurrentGP);
    if (stringStateMap.MaxGP !== undefined)
      this.state.MaxGP = parseFloat(stringStateMap.MaxGP);
    if (stringStateMap.CurrentCP !== undefined)
      this.state.CurrentCP = parseFloat(stringStateMap.CurrentCP);
    if (stringStateMap.MaxCP !== undefined)
      this.state.MaxCP = parseFloat(stringStateMap.MaxCP);
    if (stringStateMap.IsCasting1 !== undefined)
      this.state.IsCasting1 = parseFloat(stringStateMap.IsCasting1);
    if (stringStateMap.IsCasting2 !== undefined)
      this.state.IsCasting2 = parseFloat(stringStateMap.IsCasting2);
    if (stringStateMap.CastBuffID !== undefined)
      this.state.CastBuffID = parseFloat(stringStateMap.CastBuffID);
    if (stringStateMap.CastDurationCurrent !== undefined)
      this.state.CastDurationCurrent = parseFloat(stringStateMap.CastDurationCurrent);
    if (stringStateMap.CastDurationMax !== undefined)
      this.state.CastDurationMax = parseFloat(stringStateMap.CastDurationMax);
    if (stringStateMap.TransformationId !== undefined)
      this.state.TransformationId = parseFloat(stringStateMap.TransformationId);
  }
}

export class LineEvent261 extends LineEvent0x105 {}
