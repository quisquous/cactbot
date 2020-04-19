class CombatantState {
  constructor(PosX, PosY, PosZ, Heading, Visible, HP, MaxHP, MP, MaxMP) {
    this.PosX = PosX;
    this.PosY = PosY;
    this.PosZ = PosZ;
    this.Heading = Heading;
    this.Visible = Visible;
    this.HP = HP;
    this.MaxHP = MaxHP;
    this.MP = MP;
    this.MaxMP = MaxMP;
  }

  PartialClone(props) {
    return new CombatantState(
      props.PosX || this.PosX,
      props.PosY || this.PosY,
      props.PosZ || this.PosZ,
      props.Heading || this.Heading,
      props.Visible || this.Visible,
      props.HP || this.HP,
      props.MaxHP || this.MaxHP,
      props.MP || this.MP,
      props.MaxMP || this.MaxMP);
  }
}