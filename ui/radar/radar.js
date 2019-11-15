'use strict';

let Options = {
  Language: 'en',
  SplitSameMonster: false,
  UpdateMonsterPos: false,
  DetectionRange: 0,
  OnlyMobs: true,
  TTS: false,
  PopSoundAlert: true,
  PopSound: '../../resources/sounds/PowerAuras/sonar.ogg',
  PopVolume: 0.5,
};

let gRadar;

let instanceChangedRegex = {
  'en': /00:0039:You are now in the instanced area/,
  'cn': /00:0039:当前所在副本区为/,
  'ja': /00:0039:インスタンスエリア/,
  'de': /00:0039:Du bist nun in dem instanziierten Areal/,
  'fr': /00:0039:Vous avez été transporté/,
};

class Point2D {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

function length(a) {
  return Math.sqrt((a.x) * (a.x) + (a.y) * (a.y));
}

function dot(a, b) {
  return a.x * b.x + a.y * b.y;
}

function theta(a, b) {
  return dot(a, b)/(length(a) * length(b));
}

function calc_damage(x) {
  if (x.length < 8)
    x = new Array(9 - x.length).join('0') + x;
  x = '0x' + x;
  let y = Number(x);
  if (y & 0x00004000) {
    // lot of damage
  } else {
    y = y & 0x77770000;
    y >>= 16;
  }
  return y;
}

class Radar {
  constructor(element) {
    this.targetMonsters = [];
    this.playerPos = {};
    this.table = element;
    this.options = Options;
    this.monsters = Object.assign({}, Monsters, Options.CustomMonsters);
  }

  OnLogEvent(e) {
    let lang = this.options.Language;
    for (let i = 0; i < e.detail.logs.length; i++) {
      // add new combatant
      let r = e.detail.logs[i].match(/03:(........):Added new combatant (.*)\. (?:.*) Max HP: (\d+) (?:.*) Pos: \((-?\d+.\d+),(-?\d+.\d+),(-?\d+.\d+)\)/);
      if (r) {
        for (let name in this.monsters) {
          let r_id = r[1];
          let r_name = r[2];
          let r_hp = r[3];
          let r_pos_x = r[4];
          let r_pos_y = r[5];
          let r_pos_z = r[6];
          let monster = this.monsters[name];
          let matchOrNot = (r_name.match(monster['name'][lang] || monster['name']['en']) != null);
          matchOrNot &= (r[0].match(monster['regex'] || '') != null);
          matchOrNot &= (Number(r_hp) >= (monster['hp'] || 0));
          let options = this.options;
          if (monster['rank'] in options.RankOptions)
            options = Object.assign({}, this.options, options.RankOptions[monster['rank']]);
          if (options.OnlyMobs)
            matchOrNot &= r_id.startsWith('4');
          if (matchOrNot) {
            let mob_name = r_name;
            let r2 = r_name.match(/(.*?)\((.*?)\)/); // character_name(world)
            if (r2)
              mob_name = r2[1];
            let m = {
              'id': r_id,
              'name': mob_name,
              'rank': monster['rank'] || '',
              'hp': Number(r_hp),
              'current_hp': Number(r_hp),
              'battle_time': 0,
              'pos_x': Number(r_pos_x),
              'pos_y': Number(r_pos_y),
              'pos': new Point2D(Number(r_pos_x), -Number(r_pos_y)),
              'pos_z': Number(r_pos_z),
            };
            let targetNotInArray = (this.targetMonsters.map((x)=>x['name']).indexOf(r_name) == -1);
            if (options.SplitSameMonster)
              targetNotInArray = (this.targetMonsters.map((x)=>x['id']).indexOf(r_id) == -1);
            if (targetNotInArray) {
              this.targetMonsters.push(m);
              if (options.TTS) {
                OverlayPluginApi.overlayMessage(OverlayPluginApi.overlayName, JSON.stringify({ 'say': m['rank'] + ' ' + m['name'] }));
              } else if (options.PopSoundAlert && options.PopSound && options.PopVolume) {
                let audio = new Audio(options.PopSound);
                audio.volume = options.PopVolume;
                audio.play();
              }
            } else {
              if (options.UpdateMonsterPos) {
                for (let i = 0; i < this.targetMonsters.length; i++) {
                  let monster = this.targetMonsters[i];
                  let matchTarget = r_name.match(monster['name']);
                  if (options.SplitSameMonster)
                    matchTarget = r_id.match(monster['id']);
                  if (matchTarget) {
                    monster['pos_x'] = Number(r_pos_x);
                    monster['pos_y'] = Number(r_pos_y);
                    monster['pos'] = new Point2D(Number(r_pos_x), -Number(r_pos_y));
                    monster['pos_z'] = Number(r_pos_z);
                  }
                }
              }
            }
          }
        }
      }
      // update mob info from action log
      r = e.detail.logs[i].match(/15:(.{8}):(.*?):(.*?):(.*?):(.{8}):(.*?):(.*?):(.*?):(.*?):(.*?):(.*?):(.*?):(.*?):(.*?):(.*?):(.*?):(.*?):(.*?):(.*?):(.*?):(.*?):(.*?):(.*?):(.*?):/);
      if (r) {
        let r_caster_id = r[1];
        let r_caster_name = r[2];
        let r_ability_id = r[3];
        let r_ability_name = r[4];
        let r_target_id = r[5];
        let r_target_name = r[6];
        let r_damage = r[8];
        let damage = calc_damage(r_damage);
        let r_target_hp = r[23];
        for (let i = 0; i < this.targetMonsters.length; i++) {
          let monster = this.targetMonsters[i];
          if (monster['id'] == r_target_id) {
            monster['battle_time'] = Date.now() / 1000;
            monster['current_hp'] = Math.max(Number(r_target_hp) - damage, 0);
            if (Number(r_target_hp) - 1.1 * damage <= 0 ||
              (Number(r_target_hp) - damage) / monster['hp'] < 0.01) {
              monster['dom'].remove();
              this.targetMonsters.splice(i, 1);
            }
            break;
          }
        }
      }
      // change instances
      r = e.detail.logs[i].match(instanceChangedRegex[lang] || instanceChangedRegex['en']);
      if (r)
        this.ClearTargetMonsters();
      // removing new combatant
      r = e.detail.logs[i].match(/04:(.{8}):Removing combatant (.*)\. (?:.*) Max HP: (\d+)\./);
      if (r) {
        for (let i = 0; i < this.targetMonsters.length; i++) {
          let monster = this.targetMonsters[i];
          if (monster['dom'] && r[1].match(monster['id']) &&
                Date.now() / 1000 <= monster['battle_time'] + 60) {
            monster['dom'].remove();
            this.targetMonsters.splice(i, 1);
            break;
          }
        }
      }
    }
  }

  OnPlayerChange(e) {
    this.playerPos['x'] = e.detail.pos.x;
    this.playerPos['y'] = -e.detail.pos.y;
    let tr;
    for (let i = 0; i < this.targetMonsters.length; i++) {
      let monster = this.targetMonsters[i];
      let arrow_id = 'arrow-' + monster['id'];
      if (monster['dom'] == null) {
        // add dom
        let tr = document.createElement('tr');
        let th = document.createElement('th');
        let img = document.createElement('img');
        img.setAttribute('id', arrow_id);
        img.setAttribute('src', 'arrow.png');
        img.setAttribute('class', 'radar-image-40');
        th.appendChild(img);
        th.setAttribute('style', 'max-width: 100px');
        tr.appendChild(th);
        th = document.createElement('th');
        th.setAttribute('align', 'left');
        let text = document.createElement('div');
        text.innerHTML = monster['name'];
        th.appendChild(text);
        tr.appendChild(th);
        this.table.insertBefore(tr, this.table.childNodes[0]);
        monster['dom'] = tr;
      } else {
        tr = monster['dom'];
      }
      // caculate rotate
      let Vp = new Point2D(e.detail.pos.x, -e.detail.pos.y); // player vector
      let Vt = monster['pos'];
      let Vdelta = new Point2D(Vt.x - Vp.x, Vt.y - Vp.y);
      if (tr) {
        tr.childNodes[1].innerHTML = monster['rank'] + '&nbsp;&nbsp;&nbsp;&nbsp;' + monster['name'] + '<br>' +
                                    length(Vdelta).toFixed(2) + 'm';
        if (Date.now() / 1000 <= monster['battle_time'] + 60) {
          tr.childNodes[1].innerHTML += ' '+ (monster['current_hp'] * 100 /
            monster['hp']).toFixed(2) + '%';
        }
      }
      let options = this.options;
      if (monster['rank'] in options.RankOptions)
        options = Object.assign({}, this.options, options.RankOptions[monster['rank']]);
      if (options.DetectionRange > 0 && length(Vdelta) > options.DetectionRange)
        monster['dom'].setAttribute('class', 'hide');
      else
        monster['dom'].setAttribute('class', '');
      let Tdelta = Math.acos(theta(Vdelta, new Point2D(1, 0)));
      if (Vdelta.y < 0)
        Tdelta = -Tdelta;
      Tdelta += Math.PI - e.detail.rotation;
      let t = -Tdelta*180/Math.PI;
      let arrow = document.getElementById(arrow_id);
      arrow.style.transform='rotate('+t+'deg)';
    }
  }

  OnZoneChange(e) {
    this.ClearTargetMonsters();
  }

  OnInCombatChange(e) {
    if (!e.detail.inGameCombat)
      this.ClearTargetMonsters(10);
  }

  ClearTargetMonsters(hp_percentage) {
    let min_hp = hp_percentage || 100;
    for (let i = 0; i < this.targetMonsters.length; i++) {
      let monster = this.targetMonsters[i];
      if (monster['dom'] && monster['current_hp'] / monster['hp'] * 100 < min_hp) {
        monster['dom'].remove();
        this.targetMonsters.splice(i, 1);
      }
    }
  }
}

document.addEventListener('onLogEvent', function(e) {
  gRadar.OnLogEvent(e);
});

document.addEventListener('onPlayerChangedEvent', function(e) {
  gRadar.OnPlayerChange(e);
});

document.addEventListener('onZoneChangedEvent', function(e) {
  gRadar.OnZoneChange(e);
});

UserConfig.getUserConfigLocation('radar', function() {
  gRadar = new Radar(document.getElementById('radar-table'));
});
