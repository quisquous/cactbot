var FakeACT = function() {
  this.fakeMobs = {
    132132123123: {
      name: "Angry Bees",
      hp: 5000,
      hpmax: 1000,
    },
    587573: {
      name: "Anonymous Add",
      hp: 8000,
      hpmax: 8000,
    },
    587574: {
      name: "Anonymous Add",
      hp: 7000,
      hpmax: 7000,
    },
  };
}

FakeACT.prototype.currentZone = function() {
  return "Xanadu";
}

FakeACT.prototype.mobs = function() {
  return [132132123123, 587573]
}

FakeACT.prototype.mobById = function(id) {
}

var fakeBossPercent = 100.0;
FakeACT.prototype.hpPercentByName = function(mobName) {
  return fakeBossPercent;
}

window.act = new FakeACT();
