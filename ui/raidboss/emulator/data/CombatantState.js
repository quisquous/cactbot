class CombatantState {
  posX;
  posY;
  posZ;
  heading;
  visible;
  HP;
  maxHP;
  MP;
  maxMP;

  constructor(posX, posY, posZ, heading, visible, HP, maxHP, MP, maxMP) {
    this.posX = posX;
    this.posY = posY;
    this.posZ = posZ;
    this.heading = heading;
    this.visible = visible;
    this.HP = HP;
    this.maxHP = maxHP;
    this.MP = MP;
    this.maxMP = maxMP;
  }

  PartialClone(props) {
    return new CombatantState(
      props.posX || this.posX,
      props.posY || this.posY,
      props.posZ || this.posZ,
      props.heading || this.heading,
      props.visible || this.visible,
      props.HP || this.HP,
      props.maxHP || this.maxHP,
      props.MP || this.MP,
      props.maxMP || this.maxMP);
  }
}