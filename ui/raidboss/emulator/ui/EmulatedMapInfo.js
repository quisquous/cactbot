class EmulatedMapInfo {
  constructor() {
    this.combatantOffsetX;
    this.combatantOffsetY;
    this.$MapElement;
  }
}

class EmulatedMapInfoImage extends EmulatedMapInfo {
  constructor(imagePath) {
    super();
  }
}

class EmulatedMapInfoShape extends EmulatedMapInfo {
  constructor(shapeType, shapeX, shapeY) {
    super();
  }
}
