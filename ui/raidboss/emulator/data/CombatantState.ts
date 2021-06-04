export interface ICombatantState {
  posX?: number;
  posY?: number;
  posZ?: number;
  heading?: number;
  targetable?: boolean;
  HP?: number;
  maxHP?: number;
  MP?: number;
  maxMP?: number;
}

// Member names taken from OverlayPlugin's MiniParse.cs
// Types taken from FFXIV parser plugin
export interface IPluginState {
  CurrentWorldID?: number;
  WorldID?: number;
  WorldName?: string;
  BNpcID?: number;
  BNpcNameID?: number;
  PartyType?: number;
  ID?: number;
  OwnerID?: number;
  type?: number;
  Job?: number;
  Level?: number;
  Name?: string;
  CurrentHP: number;
  MaxHP: number;
  CurrentMP: number;
  MaxMP: number;
  PosX: number;
  PosY: number;
  PosZ: number;
  Heading: number;
}

export default class CombatantState implements ICombatantState {
  posX: number;
  posY: number;
  posZ: number;
  heading: number;
  targetable: boolean;
  HP: number;
  maxHP: number;
  MP: number;
  maxMP: number;

  constructor(posX: number, posY: number, posZ: number, heading: number,
      targetable: boolean,
      HP: number, maxHP: number, MP: number, maxMP: number) {
    this.posX = posX;
    this.posY = posY;
    this.posZ = posZ;
    this.heading = heading;
    this.targetable = targetable;
    this.HP = HP;
    this.maxHP = maxHP;
    this.MP = MP;
    this.maxMP = maxMP;
  }

  partialClone(props: ICombatantState): CombatantState {
    return new CombatantState(
        props.posX ?? this.posX,
        props.posY ?? this.posY,
        props.posZ ?? this.posZ,
        props.heading ?? this.heading,
        props.targetable ?? this.targetable,
        props.HP ?? this.HP,
        props.maxHP ?? this.maxHP,
        props.MP ?? this.MP,
        props.maxMP ?? this.maxMP);
  }

  toPluginState(): IPluginState {
    return {
      PosX: this.posX,
      PosY: this.posY,
      PosZ: this.posZ,
      Heading: this.heading,
      CurrentHP: this.HP,
      MaxHP: this.maxHP,
      CurrentMP: this.MP,
      MaxMP: this.maxMP,
    };
  }
}
