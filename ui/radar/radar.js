import { callOverlayHandler, addOverlayListener } from '../../resources/overlay_plugin_api';

import gMonster from '../../resources/hunt';
import NetRegexes from '../../resources/netregexes';
import UserConfig from '../../resources/user_config';

import './radar_config';

const Options = {
  PopSound: '../../resources/sounds/freesound/sonar.ogg',
  RankOptions: {
    'S': {
      Type: 'mob',
      Enabled: true,
    },
    'SS+': {
      Type: 'mob',
      Enabled: true,
    },
    'SS-': {
      Type: 'mob',
      Enabled: true,
    },
    'A': {
      Type: 'mob',
      Enabled: true,
    },
    'B': {
      Type: 'mob',
      Enabled: true,
      PopSoundAlert: false,
    },
  },
  CustomMonsters: {},
};

// Minimum distance a mob with the same name needs to be away from the old
// location before a sound is played and it is treated as a new mob.
// TODO: probably all mobs should be tracked with ids to avoid this.
// TODO: this would also let us handle mobs with the same name better.
const kMinDistanceBeforeSound = 100;

let gRadar;

const instanceChangedRegexes = {
  en: NetRegexes.gameLog({ code: '0039', line: 'You are now in the instanced area.*?' }),
  de: NetRegexes.gameLog({ code: '0039', line: 'Du bist nun in dem instanziierten Areal.*?' }),
  fr: NetRegexes.gameLog({ code: '0039', line: 'Vous êtes maintenant dans la zone instanciée.*?' }),
  ja: NetRegexes.gameLog({ code: '0039', line: 'インスタンスエリア.*?' }),
  cn: NetRegexes.gameLog({ code: '0039', line: '当前所在副本区为.*?' }),
  ko: NetRegexes.gameLog({ code: '0039', line: '인스턴스 지역.*?' }),
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
  const offset = 21.5;
  const pitch = 0.02;
  return h * pitch + offset;
}


function PlaySound(monster, options) {
  if (options.TTS) {
    callOverlayHandler({
      call: 'cactbotSay',
      text: monster.rank + ' ' + monster.name,
    });
  } else if (options.PopSoundAlert && options.PopSound && options.PopVolume) {
    const audio = new Audio(options.PopSound);
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
    this.instanceChangedRegex =
      instanceChangedRegexes[this.options.ParserLanguage] ||
      instanceChangedRegexes['en'];

    for (const i in this.monsters) {
      const monster = this.monsters[i];
      monster.name = monster.name[this.lang] || monster.name['en'];

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
    if (monster.id && matches.npcNameId !== monster.id)
      return;
    if (monster.regex && !monster.regex.test(log))
      return;
    if (monster.hp && parseFloat(matches.hp) < monster.hp)
      return;
    if (matches.currentHp === '0') // hunt is already dead
      return;

    let options = this.options;
    // option overwrite
    if (monster.rank in options.RankOptions)
      options = Object.assign({}, this.options, options.RankOptions[monster.rank]);
    // Check if monster rank enabled or not in config
    if (monster.rank === 'B' && !options.BRankEnabled)
      return;
    if (options.Enabled === false)
      return;
    if (options.Type === 'mob') {
      if (!matches.id.startsWith('4'))
        return;
      if (!matches.npcNameId || matches.npcNameId === '0')
        return;
    }

    const mobKey = matches.name.toLowerCase();
    if (mobKey in this.targetMonsters) {
      // Get positions
      const playerPos = new Point2D(this.playerPos.x, this.playerPos.y);
      const oldPos = this.targetMonsters[mobKey].pos;
      const newPos =
        new Point2D(parseFloat(matches.x), parseFloat(matches.y));

      // Calculate distances
      const oldDistance = playerPos.distance(oldPos);
      const newDistance = playerPos.distance(newPos);

      // Update position only if its closer than the current one
      if (newDistance < oldDistance) {
        this.targetMonsters[mobKey].pos = newPos;
        this.targetMonsters[mobKey].posZ = matches.z;

        // Update DOM
        this.UpdateMonsterDom(this.targetMonsters[mobKey]);

        // Play sound only if its far enough
        if (oldPos.distance(newPos) >= kMinDistanceBeforeSound)
          PlaySound(this.targetMonsters[mobKey], options);
      }
    } else {
      // Add DOM
      const arrowId = 'arrow-' + matches.id;
      const tr = document.createElement('tr');
      let th = document.createElement('th');
      const img = document.createElement('img');
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

      const m = {
        'id': matches.id,
        'name': matches.name,
        'rank': monster.rank || '',
        'hp': parseFloat(matches.hp),
        'currentHp': parseFloat(matches.hp),
        'battleTime': 0,
        'pos': new Point2D(parseFloat(matches.x), parseFloat(matches.y)),
        'posZ': matches.z,
        'addTime': Date.now(),
        'dom': tr,
        'puller': null,
        'skipPuller': matches.hp !== matches.currentHp, // already pulled before being detected
      };
      this.targetMonsters[mobKey] = m;
      this.UpdateMonsterDom(m);

      const mapX = posToMap(m.pos.x).toFixed(1);
      const mapY = posToMap(m.pos.y).toFixed(1);
      console.log(`Found: ${monster.name} (${mapX}, ${mapY})`);

      PlaySound(this.targetMonsters[mobKey], options);
    }
  }

  UpdateMonsterPuller(monster, puller) {
    if (!this.options.Puller)
      return;
    if (monster.puller !== null || monster.skipPuller)
      return;
    monster.puller = puller;
    this.UpdateMonsterDom(monster);
    console.log(`Pulled: ${puller} => ${monster.name}`);
  }

  UpdateMonsterDom(monster) {
    let options = this.options;
    if (monster.rank in options.RankOptions)
      options = Object.assign({}, this.options, options.RankOptions[monster.rank]);
    const tr = monster.dom;
    // calculate rotation based on facing
    const playerVector = new Point2D(this.playerPos.x, this.playerPos.y);
    const targetVector = monster.pos;
    const deltaVector = new Point2D(
        targetVector.x - playerVector.x,
        targetVector.y - playerVector.y,
    );
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
    const angle = deltaTheta * 180 / Math.PI;
    const arrowId = 'arrow-' + monster.id;
    const arrow = document.getElementById(arrowId);
    arrow.style.transform = 'rotate(' + angle + 'deg)';
  }

  RemoveMonster(mobKey) {
    if (mobKey in this.targetMonsters) {
      console.log(`Killed: ${this.targetMonsters[mobKey].name}`);
      this.targetMonsters[mobKey].dom.remove();
      delete this.targetMonsters[mobKey];
    }
  }

  OnNetLog(e) {
    const type = e.line[0];
    const log = e.rawLine;

    // added new combatant
    if (type === '03') {
      const matches = log.match(NetRegexes.addedCombatantFull());
      if (matches) {
        const monster = this.nameToMonster[matches.groups.name.toLowerCase()];
        if (monster)
          this.AddMonster(log, monster, matches.groups);
      }
      return;
    }

    // network ability
    if (type === '21' || type === '22') {
      const matches = log.match(NetRegexes.abilityFull());
      if (matches) {
        const monster = this.targetMonsters[matches.groups.target.toLowerCase()];
        if (monster) {
          // provoke doesn't work on hunt mobs
          const isProvoke = matches.groups.id === '1D6D';
          if (!isProvoke)
            this.UpdateMonsterPuller(monster, matches.groups.source);
        }
      }
      return;
    }

    // change instance
    if (type === '00') {
      if (this.instanceChangedRegex.test(log)) {
        // don't remove mobs lasting less than 10 seconds
        this.ClearTargetMonsters(10);
      }
      return;
    }

    // removing combatant
    if (type === '25') {
      const matches = log.match(NetRegexes.wasDefeated());
      if (matches)
        this.RemoveMonster(matches.groups.target.toLowerCase());
      return;
    }
  }

  OnPlayerChange(e) {
    this.playerPos.x = e.detail.pos.x;
    this.playerPos.y = e.detail.pos.y;
    this.playerPos.z = e.detail.pos.z;
    this.playerRotation = e.detail.rotation;
    for (const i in this.targetMonsters)
      this.UpdateMonsterDom(this.targetMonsters[i]);
  }

  OnChangeZone(e) {
    this.ClearTargetMonsters();
  }

  ClearTargetMonsters(deltaTime) {
    const deltaTimeThreshold = deltaTime || 0;
    for (const i in this.targetMonsters) {
      if ((Date.now() - this.targetMonsters[i].addTime) / 1000 > deltaTimeThreshold) {
        this.targetMonsters[i].dom.remove();
        delete this.targetMonsters[i];
      }
    }
  }
}

UserConfig.getUserConfigLocation('radar', Options, () => {
  addOverlayListener('LogLine', (e) => {
    gRadar.OnNetLog(e);
  });

  addOverlayListener('onPlayerChangedEvent', (e) => {
    gRadar.OnPlayerChange(e);
  });

  addOverlayListener('ChangeZone', (e) => {
    gRadar.OnChangeZone(e);
  });

  gRadar = new Radar(document.getElementById('radar-table'));
});
