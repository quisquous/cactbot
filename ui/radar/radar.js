'use strict';

let Options = {
  Language: 'cn',
};

let target = [];
let targetMonsters = [];
let playerPos = {};

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

document.addEventListener('onLogEvent', function(e) {
  let lang = Options.Language;
  for (let i = 0; i < e.detail.logs.length; i++) {
    // add new combatant
    let r = e.detail.logs[i].match(/03:........:Added new combatant (.*)\. (?:.*) Max HP: (\d+) (?:.*) Pos: \((-?\d+.\d+),(-?\d+.\d+),(-?\d+.\d+)\)/);
    if (r) {
      for (let name in Monsters) {
        let monster = Monsters[name];
        let matchOrNot = (r[1].match(monster['name'][lang] || monster['name']['en']) != null);
        matchOrNot &= (r[0].match(monster['regex'] || '') != null);
        matchOrNot &= (r[2] >= (monster['hp'] || 0));
        if (matchOrNot) {
          // console.log(r);
          let mob_name = r[1];
          let r2 = r[1].match(/(.*?)\((.*?)\)/);
          if (r2)
            mob_name = r2[1];
          let m = {
            'id': name+'-'+mob_name,
            'name': r[1],
            'hp': r[2],
            'cur_hp': 100,
            'pos_x': r[3],
            'pos_y': r[4],
            'pos': new Point2D(r[3], -r[4]),
            'pos_z': r[5],
          };
          if (targetMonsters.map((x)=>x['name']).indexOf(r[1]) == -1) {
            targetMonsters.push(m);
          } else {
            // TODO: update monster position // ?
          }
        }
      }
    }
    // update current hp of mob
    r = e.detail.logs[i].match(/0D:(.*) HP at (\d+)%/);
    if (r) {
      for (let i = 0; i < targetMonsters.length; i++) {
        let monster = targetMonsters[i];
        if (r[1].match(monster['name']))
          monster['cur_hp'] = Number(r[2]);
      }
    }
    // removing new combatant
    r = e.detail.logs[i].match(/04:........:Removing combatant (.*)\. (?:.*) Max HP: (\d+)\./);
    if (r) {
      for (let i = 0; i < targetMonsters.length; i++) {
        let monster = targetMonsters[i];
        let arrow_id = 'arrow-' + monster['id'];
        if (monster['dom'] && r[1].match(monster['name'])) {
          if (monster['cur_hp'] > 50)
            continue;
          monster['dom'].remove();
          targetMonsters.splice(i, 1);
          break;
        }
      }
    }
    // debug:
    r = e.detail.logs[i].match(/:record pos/);
    if (r) {
      let Vt = new Point2D(playerPos['x'], playerPos['y']);
      target.push(Vt);
      console.log(playerPos);
      console.log(target);
    }
    r = e.detail.logs[i].match(/:reset pos/);
    if (r) {
      target = [];
      console.log(playerPos);
      console.log(target);
    }
  }
});

document.addEventListener('onPlayerChangedEvent', function(e) {
  playerPos['x'] = e.detail.pos.x;
  playerPos['y'] = -e.detail.pos.y;
  let tr;
  for (let i = 0; i < targetMonsters.length; i++) {
    let monster = targetMonsters[i];
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
      let text = document.createElement('div');
      text.innerHTML = monster['name'];
      th.appendChild(text);
      tr.appendChild(th);
      let table = document.getElementById('radar-table');
      table.insertBefore(tr, table.childNodes[0]);
      monster['dom'] = tr;
    } else {
      tr = monster['dom'];
    }
    // caculate rotate
    let Vp = new Point2D(e.detail.pos.x, -e.detail.pos.y); // player vector
    let Vt = monster['pos'];
    let Vdelta = new Point2D(Vt.x - Vp.x, Vt.y - Vp.y);
    if (tr)
      tr.childNodes[1].innerHTML = monster['name'] + ' ' + length(Vdelta).toFixed(2) + 'm';
    let Tdelta = Math.acos(theta(Vdelta, new Point2D(1, 0)));
    if (Vdelta.y < 0)
      Tdelta = -Tdelta;
    Tdelta += Math.PI - e.detail.rotation;
    let t = -Tdelta*180/Math.PI;
    let arrow = document.getElementById(arrow_id);
    arrow.style.transform='rotate('+t+'deg)';
  }
  // debug:
  // let Vp = new Point2D(e.detail.pos.x, -e.detail.pos.y);
  // let Vt = target[0];
  // if(Vt != null){
  //   let Vdelta = new Point2D(Vt.x - Vp.x, Vt.y - Vp.y);
  //   let Tdelta = Math.acos(theta(Vdelta, new Point2D(1, 0)));
  //   if(Vdelta.y < 0)
  //     Tdelta = -arrow
  //   Tdelta += Math.PI - e.detail.rotation;
  //   let t = -Tdelta*180/Math.PI;
  //   $('#test-demo').rotate(t);
  // }
});

document.addEventListener('onZoneChangedEvent', function(e) {
  for (let i = 0; i < targetMonsters.length; i++) {
    let monster = targetMonsters[i];
    monster['dom'].remove();
  }
  targetMonsters = [];
});

UserConfig.getUserConfigLocation('radar', function() {
  // Options = Options; // ?
});
