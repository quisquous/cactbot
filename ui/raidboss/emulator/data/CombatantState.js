'use strict';

class CombatantState {
  constructor(posX, posY, posZ, heading, targetable, HP, maxHP, MP, maxMP) {
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

  partialClone(props) {
    return new CombatantState(
        Number(props.posX) || this.posX,
        Number(props.posY) || this.posY,
        Number(props.posZ) || this.posZ,
        Number(props.heading) || this.heading,
        props.targetable || this.targetable,
        Number(props.HP) || this.HP,
        Number(props.maxHP) || this.maxHP,
        Number(props.MP) || this.MP,
        Number(props.maxMP) || this.maxMP);
  }
}
