// Member names taken from OverlayPlugin's MiniParse.cs
// Types taken from FFXIV parser plugin
export interface PluginState {
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

export default class CombatantState {
  posX: number;
  posY: number;
  posZ: number;
  heading: number;
  targetable: boolean;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;

  constructor(posX: number, posY: number, posZ: number, heading: number,
      targetable: boolean,
      hp: number, maxHp: number, mp: number, maxMp: number) {
    this.posX = posX;
    this.posY = posY;
    this.posZ = posZ;
    this.heading = heading;
    this.targetable = targetable;
    this.hp = hp;
    this.maxHp = maxHp;
    this.mp = mp;
    this.maxMp = maxMp;
  }

  partialClone(props: Partial<CombatantState>): CombatantState {
    return new CombatantState(
        props.posX ?? this.posX,
        props.posY ?? this.posY,
        props.posZ ?? this.posZ,
        props.heading ?? this.heading,
        props.targetable ?? this.targetable,
        props.hp ?? this.hp,
        props.maxHp ?? this.maxHp,
        props.mp ?? this.mp,
        props.maxMp ?? this.maxMp);
  }

  toPluginState(): PluginState {
    return {
      PosX: this.posX,
      PosY: this.posY,
      PosZ: this.posZ,
      Heading: this.heading,
      CurrentHP: this.hp,
      MaxHP: this.maxHp,
      CurrentMP: this.mp,
      MaxMP: this.maxMp,
    };
  }
}
