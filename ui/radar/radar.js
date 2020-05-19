'use strict';

let Options = {
  PopSound: '../../resources/sounds/PowerAuras/sonar.ogg',
  RankOptions: {
    'S': {
      Type: 'mob',
    },
    'SS+': {
      Type: 'mob',
    },
    'SS-': {
      Type: 'mob',
    },
    'A': {
      Type: 'mob',
    },
    'B': {
      Type: 'mob',
      PopSoundAlert: false,
    },
  },
  CustomMonsters: {},
};

// Minimum distance a mob with the same name needs to be away from the old
// location before a sound is played and it is treated as a new mob.
// TODO: probably all mobs should be tracked with ids to avoid this.
// TODO: this would also let us handle mobs with the same name better.
let kMinDistanceBeforeSound = 100;

let gRadar;

let instanceChangedRegex = {
  'en': / 00:0039:You are now in the instanced area/,
  'de': / 00:0039:Du bist nun in dem instanziierten Areal/,
  'fr': / 00:0039:Vous êtes maintenant dans la zone instanciée/,
  'ja': / 00:0039:インスタンスエリア/,
  'cn': / 00:0039:当前所在副本区为/,
  'ko': / 00:0039:인스턴스 지역/,
};

class Point2D {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  // Calculates vector length (magnitude)
  length() {
    return Math.sqrt((this.x) * (this.x) + (this.y) * (this.y));
  }

  // Calculate delta vector
  delta(target) {
    return new Point2D(target.x - this.x, target.y - this.y);
  }

  // Calculate distance between 2 points
  distance(target) {
    return this.delta(target).length();
  }
}

function posToMap(h) {
  let offset = 21.5;
  let pitch = 0.02;
  return h * pitch + offset;
}


function PlaySound(monster, options) {
  if (options.TTS) {
    callOverlayHandler({
      call: 'cactbotSay',
      text: monster.rank + ' ' + monster.name,
    });
  } else if (options.PopSoundAlert && options.PopSound && options.PopVolume) {
    let audio = new Audio(options.PopSound);
    audio.volume = options.PopVolume;
    audio.play();
  }
}

class Radar {
  constructor(element) {
    this.targetMonsters = {};
    this.playerPos = {};
    this.playerRotation = 0;
    this.table = element;
    this.options = Options;
    this.monsters = Object.assign({}, gMonster, Options.CustomMonsters);
    this.lang = this.options.ParserLanguage || 'en';
    this.nameToMonster = {};
    for (let i in this.monsters) {
      let monster = this.monsters[i];
      let lang = this.lang || 'en';
      monster.name = monster.name[lang] || monster.name['en'];

      // Names are either strings or arrays of strings.
      if (typeof monster.name === 'string') {
        this.nameToMonster[monster.name.toLowerCase()] = monster;
      } else {
        for (let i = 0; i < monster.name.length; ++i)
          this.nameToMonster[monster.name[i].toLowerCase()] = monster;
      }
    }
  }

  AddMonster(log, monster, matches) {
    if (monster.regex && !log.match(monster.regex))
      return;
    if (monster.hp && parseFloat(matches.groups.hp) < monster.hp)
      return;

    let options = this.options;
    // option overwrite
    if (monster.rank in options.RankOptions)
      options = Object.assign({}, this.options, options.RankOptions[monster.rank]);
    if (options.Type === 'mob') {
      if (!matches.groups.id.startsWith('4'))
        return;
      if (typeof matches.groups.npcId === 'undefined')
        return;
    }

    let mobKey = matches.groups.name.toLowerCase();
    if (mobKey in this.targetMonsters) {
      // Get positions
      let playerPos = new Point2D(this.playerPos.x, this.playerPos.y);
      let oldPos = this.targetMonsters[mobKey].pos;
      let newPos =
        new Point2D(parseFloat(matches.groups.x), parseFloat(matches.groups.y));

      // Calculate distances
      let oldDistance = playerPos.distance(oldPos);
      let newDistance = playerPos.distance(newPos);

      // Update position only if its closer than the current one
      if (newDistance < oldDistance) {
        this.targetMonsters[mobKey].pos = newPos;
        this.targetMonsters[mobKey].posZ = matches.groups.z;

        // Update DOM
        this.UpdateMonsterDom(this.targetMonsters[mobKey]);

        // Play sound only if its far enough
        if (oldPos.distance(newPos) >= kMinDistanceBeforeSound)
          PlaySound(this.targetMonsters[mobKey], options);
      }
    } else {
      // Add DOM
      let arrowId = 'arrow-' + matches.groups.id;
      let tr = document.createElement('tr');
      let th = document.createElement('th');
      let img = document.createElement('img');
      img.setAttribute('id', arrowId);
      img.setAttribute('src', 'arrow.png');
      img.setAttribute('class', 'radar-image-40');
      th.appendChild(img);
      th.setAttribute('style', 'max-width: 100px');
      tr.appendChild(th);
      th = document.createElement('th');
      th.setAttribute('align', 'left');
      th.appendChild(document.createElement('div'));
      tr.appendChild(th);
      this.table.insertBefore(tr, this.table.childNodes[0]);

      let m = {
        'id': matches.groups.id,
        'name': matches.groups.name,
        'rank': monster.rank || '',
        'hp': parseFloat(matches.groups.hp),
        'currentHp': parseFloat(matches.groups.hp),
        'battleTime': 0,
        'pos': new Point2D(parseFloat(matches.groups.x), parseFloat(matches.groups.y)),
        'posZ': matches.groups.z,
        'addTime': Date.now(),
        'dom': tr,
        'puller': null,
      };
      this.targetMonsters[mobKey] = m;
      this.UpdateMonsterDom(m);

      PlaySound(this.targetMonsters[mobKey], options);
    }
  }

  UpdateMonsterPuller(monster, puller) {
    if (!this.options.Puller)
      return;
    if (monster.puller !== null)
      return;
    monster.puller = puller;
    this.UpdateMonsterDom(monster);
    console.log('Pull: ' + puller + ' => ' + monster.name);
  }

  UpdateMonsterDom(monster) {
    let options = this.options;
    if (monster.rank in options.RankOptions)
      options = Object.assign({}, this.options, options.RankOptions[monster.rank]);
    let tr = monster.dom;
    // calculate rotation based on facing
    let playerVector = new Point2D(this.playerPos.x, this.playerPos.y);
    let targetVector = monster.pos;
    let deltaVector = new Point2D(targetVector.x - playerVector.x, targetVector.y - playerVector.y);
    if (tr) {
      tr.childNodes[1].innerHTML = monster.rank + '&nbsp;&nbsp;&nbsp;&nbsp;' + monster.name;
      if (Math.abs(this.playerPos.z - monster.posZ) > 5)
        tr.childNodes[1].innerHTML += '&nbsp;&nbsp;' + (this.playerPos.z < monster.posZ ? '↑' : '↓');
      tr.childNodes[1].innerHTML += '<br>' + deltaVector.length().toFixed(2) + 'm';
      if (Date.now() / 1000 <= monster.battleTime + 60) {
        tr.childNodes[1].innerHTML += ' ' + (monster.currentHp * 100 /
          monster.hp).toFixed(2) + '%';
      }
      if (monster.puller)
        tr.childNodes[1].innerHTML += '&nbsp;&nbsp;' + monster.puller;
      // Z position is relative to the map so it's omitted.
      if (options.Position) {
        tr.childNodes[1].innerHTML += '<br>X: ' +
          posToMap(monster.pos.x).toFixed(1) + '&nbsp;&nbsp;Y:' +
          posToMap(monster.pos.y).toFixed(1);
      }
    }
    if (options.DetectionRange > 0 && deltaVector.length() > options.DetectionRange)
      monster.dom.classList.add('hide');
    else
      monster.dom.classList.remove('hide');

    let deltaTheta = Math.atan2(deltaVector.y, deltaVector.x);
    deltaTheta -= Math.PI - this.playerRotation;
    let angle = deltaTheta * 180 / Math.PI;
    let arrowId = 'arrow-' + monster.id;
    let arrow = document.getElementById(arrowId);
    arrow.style.transform = 'rotate(' + angle + 'deg)';
  }

  RemoveMonster(mobKey) {
    if (mobKey in this.targetMonsters) {
      this.targetMonsters[mobKey].dom.remove();
      delete this.targetMonsters[mobKey];
    }
  }

  OnLogEvent(e) {
    let lang = this.options.ParserLanguage;
    for (let i = 0; i < e.detail.logs.length; i++) {
      // added new combatant
      let matches = e.detail.logs[i].match(Regexes.addedCombatantFull());
      if (matches) {
        let monster = this.nameToMonster[matches.groups.name.toLowerCase()];
        if (monster)
          this.AddMonster(e.detail.logs[i], monster, matches);
      }
      // network ability
      matches = e.detail.logs[i].match(Regexes.abilityFull());
      if (matches) {
        let monster = this.targetMonsters[matches.groups.target.toLowerCase()];
        if (monster) {
          // provoke doesn't work on hunt mobs
          let isProvoke = e.detail.logs[i].match(Regexes.ability({ id: '1D6D' }));
          if (!isProvoke)
            this.UpdateMonsterPuller(monster, matches.groups.source);
        }
      }
      // change instance
      let r = e.detail.logs[i].match(instanceChangedRegex[lang] || instanceChangedRegex['en']);
      if (r)
        this.ClearTargetMonsters(10); // don't remove mobs lasting less than 10 seconds
      // removing combatant
      matches = e.detail.logs[i].match(Regexes.wasDefeated());
      if (matches)
        this.RemoveMonster(matches.groups.target.toLowerCase());
    }
  }

  OnPlayerChange(e) {
    this.playerPos.x = e.detail.pos.x;
    this.playerPos.y = e.detail.pos.y;
    this.playerPos.z = e.detail.pos.z;
    this.playerRotation = e.detail.rotation;
    for (let i in this.targetMonsters)
      this.UpdateMonsterDom(this.targetMonsters[i]);
  }

  OnZoneChange(e) {
    this.ClearTargetMonsters();
  }

  ClearTargetMonsters(deltaTime) {
    let deltaTimeThreshold = deltaTime || 0;
    for (let i in this.targetMonsters) {
      if ((Date.now() - this.targetMonsters[i].addTime) / 1000 > deltaTimeThreshold) {
        this.targetMonsters[i].dom.remove();
        delete this.targetMonsters[i];
      }
    }
  }
}

UserConfig.getUserConfigLocation('radar', function() {
  addOverlayListener('onLogEvent', function(e) {
    gRadar.OnLogEvent(e);
  });

  addOverlayListener('onPlayerChangedEvent', function(e) {
    gRadar.OnPlayerChange(e);
  });

  addOverlayListener('onZoneChangedEvent', function(e) {
    gRadar.OnZoneChange(e);
  });

  gRadar = new Radar(document.getElementById('radar-table'));
});
