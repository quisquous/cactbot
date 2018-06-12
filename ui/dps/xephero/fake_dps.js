'use strict';

let fakeEncounter;

function addCombatant() {
  if (!fakeEncounter)
    return;
  fakeEncounter.combatants.push(new FakeCombatant('Extra Combatant ' + fakeEncounter.combatants.length, ''));
}

function generateDpsEvent() {
  if (!fakeEncounter) {
    fakeEncounter = new FakeEncounter();
    fakeEncounter.addCombatants();
  }

  fakeEncounter.update(1);

  return {
    detail: fakeEncounter.getDpsUpdate(),
    type: 'onOverlayDataUpdate',
  };
}

function generateStartPhaseEvent(name) {
  let dps = generateDpsEvent().detail;
  let e = {
    'type': 'onFightPhaseStart',
    'detail': {
      'name': name,
      'dps': {
        'Encounter': dps.Encounter,
        'Combatant': dps.Combatant,
      },
    },
  };
  return e;
}

function generateEndPhaseEvent(name) {
  let e = generateStartPhaseEvent(name);
  e.type = 'onFightPhaseEnd';
  return e;
}

function resetDps() {
  currentDps = null;
}

function updateDerivedDpsValues(data, encounter) {
  // "duration" is a formatted string, e.g. "04:24"
  let duration = data.DURATION;
  let minutes = Math.floor(duration / 60);
  if (minutes < 10)
    minutes = '0' + minutes;

  let seconds = duration % 60;
  if (seconds < 10)
    seconds = '0' + seconds;

  data.duration = minutes + ':' + seconds;

  let damage = data.damage;
  data['damage-m'] = Math.floor(100 * damage / 1000000) / 100;
  data['damage-k'] = Math.floor(100 * damage / 1000) / 100;
  data['DAMAGE-m'] = Math.floor(data['damage-m']);
  data['DAMAGE-k'] = Math.floor(data['damage-k']);

  data['dps'] = (damage / data.DURATION).toFixed(2);
  data['dps-k'] = (damage / data.DURATION / 1000).toFixed(2);
  data['DPS'] = Math.floor(data['dps']);
  data['DPS-k'] = Math.floor(data['dps-k']);


  data['encdps'] = (damage / encounter.DURATION).toFixed(2);
  data['encdps-k'] = (damage / encounter.DURATION / 1000).toFixed(2);
  data['ENCDPS'] = Math.floor(data['encdps']);
  data['ENCDPS-k'] = Math.floor(data['encdps-k']);

  data['damage%'] = Math.floor(damage / encounter.damage);
  data['crithit%'] = Math.floor(100 * data.crithits / data.swings) + '%';
}

let FakeEncounter = function() {
  this.combatants = [];
  this.floatDuration = 0;

  this.totalledFromCombatants = [
    'damage',
    'critheals',
    'crithits',
    'misses',
    'hitfailed',
    'swings',
    'heals',
    'cures',
    'damagetaken',
    'healstaken',
    'powerdrain',
    'powerheal',
    'kills',
    'deaths',
    'hits',
    'healed',
  ];

  this.data = {
    'n': '\n',
    't': '\t',
    'title': 'Encounter',

    'DURATION': 0,

    'maxhit': '',
    'MAXHIT': '',

    'maxheal': '',
    'MAXHEAL': '',
    'maxhealward': '',
    'MAXHEALWARD': '',

    'critheal%': '0%',
    'crithit%': '0%',
    'Last10DPS': '',
    'Last30DPS': '',
    'Last60DPS': '',
    'tohit': '---',
    'TOHIT': '---',
    'ENCHPS': 0,
    'ENCHPS-k': 0,
    'enchps': 0,
  };

  for (let i = 0; i < this.totalledFromCombatants.length; ++i)
    this.data[this.totalledFromCombatants[i]] = 0;


  updateDerivedDpsValues(this.data, this.data);
};

FakeEncounter.prototype.addCombatants = function() {
  this.combatants.push(new FakeCombatant('Person1', 'Mnk'));
  this.combatants.push(new FakeCombatant('Person2', 'Rdm'));
  this.combatants.push(new FakeCombatant('Person3', 'Sam'));
  this.combatants.push(new FakeCombatant('Person4', 'Whm'));
  this.combatants.push(new FakeCombatant('YOU', 'War'));
  this.combatants.push(new FakeCombatant('Generic NPC', ''));
  this.combatants.push(new FakeCombatant('Chocobo (Person1)', ''));

  for (let i = 0; i < this.combatants.length; ++i)
    updateDerivedDpsValues(this.combatants[i].data, this.data);
};

FakeEncounter.prototype.update = function(elapsedSeconds) {
  this.floatDuration += elapsedSeconds;
  this.data.DURATION = Math.floor(this.floatDuration);

  for (let i = 0; i < this.combatants.length; ++i)
    this.combatants[i].update(elapsedSeconds);


  // Sum up values from combatants.
  for (let i = 0; i < this.totalledFromCombatants.length; ++i) {
    let total = 0;
    let strKey = this.totalledFromCombatants[i];
    for (let j = 0; j < this.combatants.length; ++j) {
      // TODO: probably should make sure this is a number <_<
      total += this.combatants[j].data[strKey];
    }
    this.data[strKey] = total;
  }

  // Recalculate all the derived values.
  updateDerivedDpsValues(this.data, this.data);
  for (let i = 0; i < this.combatants.length; ++i)
    updateDerivedDpsValues(this.combatants[i].data, this.data);
};

FakeEncounter.prototype.getDpsUpdate = function() {
  let combatantDetail = {};

  this.combatants.sort(function(a, b) {
    return b.data.damage - a.data.damage;
  });

  for (let i = 0; i < this.combatants.length; ++i)
    combatantDetail[this.combatants[i].data.name] = this.combatants[i].data;


  return {
    Encounter: this.data,
    Combatant: combatantDetail,
  };
};

let FakeCombatant = function(name, job) {
  // Generate all the fields that anything might ask for from ACT.
  this.data = {
    'n': '\n',
    't': '\t',
    // TODO: Could generate healing numbers too.
    'healed': '0',
    'healed%': '0%',
    'enchps': '0.00',
    'ENCHPS': '0',
    'ENCHPS-k': '0',
    'critheals': '0',
    'critheal%': '0%',
    'heals': '0',
    'cures': '0',
    // TODO: Many dps-o-meters care about max hit (?!), could fake it.
    'maxhit': '',
    'MAXHIT': '',
    'maxheal': '',
    'MAXHEAL': '',
    'maxhealward': '',
    'MAXHEALWARD': '',
    'damagetaken': '0',
    'healstaken': '0',
    'powerdrain': '0',
    'powerheal': '0',
    'kills': '0',
    'threatstr': '+(0)0/-(0)0',
    'threatdelta': '0',
    'ParryPct': '0%',
    'BlockPct': '0%',
    'IncToHit': '100.00',
    'OverHealPct': '0%',
    // TODO: These are last N seconds of DPS.  Could calculate that here.
    'Last10DPS': '',
    'Last30DPS': '',
    'Last60DPS': '',
    'tohit': '100.00',
    'TOHIT': '100',
    'hitfailed': '0',
  };

  this.setName(name);
  this.setJob(job);

  // Floating point version of DURATION
  this.floatDuration = 0;

  this.missPercentagePerHit = Math.max(0, Math.random() * 0.2 - 0.15);
  this.deathPercentagePerSecond = Math.random() * 0.02;
  this.averageDpsPerHit = 800 + Math.random() * 2000;
  this.fakeCritChance = Math.random();
  this.gcd = 1 + Math.random() * 4;
  this.remainingDeadSeconds = null;
  this.gcdRemainder = 0;

  // Fields this class updates.
  this.data.DURATION = 0;
  this.data.damage = 0;
  this.data.hits = 0;
  this.data.crithits = 0;
  this.data.misses = 0;
  this.data.swings = 0;
  this.data.deaths = 0;
};

FakeCombatant.prototype.setName = function(name) {
  this.data.name = name;
  for (let i = 3; i <= 15; ++i) {
    let str = 'NAME' + i;

    // ACT provides a whole bunch of shorter names.
    this.data['NAME' + i] = name.substr(0, i);
  }
};

FakeCombatant.prototype.setJob = function(job) {
  this.data.Job = job;
};

FakeCombatant.prototype.update = function(elapsedSeconds) {
  this.floatDuration += elapsedSeconds;
  this.data.DURATION = Math.floor(this.floatDuration);

  if (this.remainingDeadSeconds != null) {
    this.remainingDeadSeconds -= elapsedSeconds;
    if (this.remainingDeadSeconds > 0)
      return;

    this.remainingDeadSeconds = null;
    this.gcdRemainder = 0;
    console.log(this.data.name + ' revived');
  }

  if (Math.random() * elapsedSeconds < this.deathPercentagePerSecond) {
    console.log(this.data.name + ' died');
    this.data.deaths++;
    this.remainingDeadSeconds = 10 + Math.random() * 10;
    return;
  }

  let gcds = Math.floor((this.gcdRemainder + elapsedSeconds) / this.gcd);
  if (gcds == 0) {
    this.gcdRemainder += elapsedSeconds;
    return;
  }

  // Keep fractional gcd time.
  this.gcdRemainder += elapsedSeconds - gcds * this.gcd;

  for (let i = 0; i < gcds; ++i) {
    this.data.swings++;
    if (Math.random() < this.missPercentagePerHit) {
      this.data.misses++;
    } else {
      this.data.hits++;
      let damage = (0.9 + Math.random() * 0.2) * this.averageDpsPerHit;
      if (Math.random() < this.fakeCritChance) {
        this.data.crithits++;
        damage *= 1.5;
      }
      this.data.damage += Math.floor(damage);
    }
  }
};
