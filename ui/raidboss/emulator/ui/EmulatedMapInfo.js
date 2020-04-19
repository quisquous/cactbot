class EmulatedMapInfo {
  CombatantOffsetX;
  CombatantOffsetY;
  $MapElement;
}

class EmulatedMapInfoImage extends EmulatedMapInfo {
  constructor(ImagePath) {

  }
}

class EmulatedMapInfoShape extends EmulatedMapInfo {
  constructor(ShapeType, ShapeX, ShapeY) {

  }
}