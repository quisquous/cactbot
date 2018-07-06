'use strict';

let Options = {
  Language: 'en',
  RefreshRateMs: 1000,
  PopSound: '../../resources/sounds/PowerAuras/sonar.ogg',
  PopVolume: 1.0,
  SuppressPopMs: 1700 * 1000,
  FlagTimeoutMs: 60000,
  ZoneInfo: {
    'Eureka Anemos': {
      mapImage: 'anemos.png',
      mapWidth: 1300,
      mapHeight: 950,
      // TODO: these could be a little better tuned :C
      mapToPixelXScalar: 41.12,
      mapToPixelXConstant: -224.7,
      mapToPixelYScalar: 41.09,
      mapToPixelYConstant: -457.67,
      entityToMapXScalar: .02002870754,
      entityToMapXConstant: 21.45210725,
      entityToMapYScalar: .02000892816,
      entityToMapYConstant: 21.4665545,
      nms: {
        sabo: {
          label: {
            en: 'Sabo',
            de: 'Sabo',
            fr: 'Pampa',
            ja: 'サボ',
          },
          mobName: {
            en: 'Sabotender Corrido',
            de: 'Sabotender Corrido',
            fr: 'Pampa Corrido',
            ja: 'サボテンダー・コリード',
          },
          trackerName: {
            en: 'Sabo',
            de: 'Sabo',
            fr: 'Pampa',
            ja: 'サボテンダー',
          },
          x: 13.9,
          y: 21.9,
        },
        lord: {
          label: {
            en: 'Lord',
            de: 'Prinz',
            fr: 'Seigneur',
            ja: 'ロード',
          },
          mobName: {
            en: 'The Lord Of Anemos',
            de: 'Prinz Von Anemos',
            fr: 'Seigneur D\'anemos',
            ja: 'ロード・オブ・アネモス',
          },
          trackerName: {
            en: 'Lord',
            de: 'Prinz[p]',
            fr: 'Seigneur',
            ja: 'ロード',
          },
          x: 29.7,
          y: 27.1,
        },
        teles: {
          label: {
            en: 'Teles',
            de: 'Teles',
            fr: 'Teles',
            ja: 'テレス',
          },
          mobName: {
            en: 'Teles',
            de: 'Teles',
            fr: 'Teles',
            ja: 'テレス',
          },
          trackerName: {
            en: 'Teles',
            de: 'Teles',
            fr: 'Teles',
            ja: 'テレス',
          },
          x: 25.6,
          y: 27.4,
        },
        emperor: {
          label: {
            en: 'Emp',
            de: 'Kaiser',
            fr: 'Emp',
            ja: 'アネモス',
          },
          mobName: {
            en: 'The Emperor Of Anemos',
            de: 'Anemos-Kaiser',
            fr: 'Empereur D\'anemos',
            ja: 'アネモス・エンペラー',
          },
          trackerName: {
            en: 'Emperor',
            de: 'Kaiser',
            fr: 'Empereur',
            ja: 'アネモス',
          },
          x: 17.2,
          y: 22.2,
        },
        callisto: {
          label: {
            en: 'Calli',
            de: 'Callisto',
            fr: 'Callisto',
            ja: 'カリスト',
          },
          mobName: {
            en: 'Callisto',
            de: 'Callisto',
            fr: 'Callisto',
            ja: 'カリスト',
          },
          trackerName: {
            en: 'Callisto',
            de: 'Callisto',
            fr: 'Callisto',
            ja: 'カリスト',
          },
          // 25.5, 22.3 from the tracker, but collides with number
          x: 26.2,
          y: 22.0,
        },
        number: {
          label: {
            en: 'Number',
            de: 'Zahl',
            fr: 'Number',
            ja: 'ナンバーズ',
          },
          mobName: {
            en: 'Number',
            de: 'Zahl',
            fr: 'Number',
            ja: 'ナンバーズ',
          },
          trackerName: {
            en: 'Number',
            de: 'Zahl',
            fr: 'Number',
            ja: 'ナンバーズ',
          },
          // 23.5, 22.7 from the tracker, but collides with callisto
          x: 23.5,
          y: 23.4,
        },
        jaha: {
          label: {
            en: 'Jaha',
            de: 'Jaha',
            fr: 'Jaha',
            ja: 'ジャハ',
          },
          mobName: {
            en: 'Jahannam',
            de: 'Jahannam',
            fr: 'Jahannam',
            ja: 'ジャハンナム',
          },
          trackerName: {
            en: 'Jaha',
            de: 'Jaha',
            fr: 'Jaha',
            ja: 'ジャハンナム',
          },
          x: 17.7,
          y: 18.6,
          weather: 'Gales',
        },
        amemet: {
          label: {
            en: 'Amemet',
            de: 'Amemet',
            fr: 'Amemet',
            ja: 'アミメット',
          },
          mobName: {
            en: 'Amemet',
            de: 'Amemet',
            fr: 'Amemet',
            ja: 'アミメット',
          },
          trackerName: {
            en: 'Amemet',
            de: 'Amemet',
            fr: 'Amemet',
            ja: 'アミメット',
          },
          x: 15.0,
          y: 15.6,
        },
        caym: {
          label: {
            en: 'Caym',
            de: 'Caym',
            fr: 'Caym',
            ja: 'カイム',
          },
          mobName: {
            en: 'Caym',
            de: 'Caym',
            fr: 'Caym',
            ja: 'カイム',
          },
          trackerName: {
            en: 'Caym',
            de: 'Caym',
            fr: 'Caym',
            ja: 'カイム',
          },
          x: 13.8,
          y: 12.5,
        },
        bomb: {
          label: {
            en: 'Bomb',
            de: 'Bomba',
            fr: 'Bomba',
            ja: 'ボンバ',
          },
          mobName: {
            en: 'Bombadeel',
            de: 'Bombadeel',
            fr: 'Bombadeel',
            ja: 'ボンバディール',
          },
          trackerName: {
            en: 'Bomba',
            de: 'Bomba',
            fr: 'Bomba',
            ja: 'ボンバディール',
          },
          x: 28.3,
          y: 20.4,
          time: 'Night',
        },
        serket: {
          label: {
            en: 'Serket',
            de: 'Serket',
            fr: 'Serket',
            ja: 'セルケト',
          },
          mobName: {
            en: 'Serket',
            de: 'Serket',
            fr: 'Serket',
            ja: 'セルケト',
          },
          trackerName: {
            en: 'Serket',
            de: 'Serket',
            fr: 'Serket',
            ja: 'セルケト',
          },
          x: 24.8,
          y: 17.9,
        },
        juli: {
          label: {
            en: 'Juli',
            de: 'Julika',
            fr: 'Julika',
            ja: 'ジュリカ',
          },
          mobName: {
            en: 'Judgmental Julika',
            de: 'Verurteilende Julika',
            fr: 'Julika',
            ja: 'ジャッジメンタル・ジュリカ',
          },
          trackerName: {
            en: 'Julika',
            de: 'Julika',
            fr: 'Julika',
            ja: 'ジュリカ',
          },
          x: 21.9,
          y: 15.6,
        },
        rider: {
          label: {
            en: 'Rider',
            de: 'Reiter',
            fr: 'Cavalier',
            ja: 'ライダー',
          },
          mobName: {
            en: 'The White Rider',
            de: 'Weißer Reiter',
            fr: 'Cavalier Blanc',
            ja: 'ホワイトライダー',
          },
          trackerName: {
            en: 'Rider',
            de: 'Reiter',
            fr: 'Cavalier',
            ja: 'ホワイトライダー',
          },
          x: 20.3,
          y: 13.0,
          time: 'Night',
        },
        poly: {
          label: {
            en: 'Poly',
            de: 'Poly',
            fr: 'Poly',
            ja: 'ポリ',
          },
          mobName: {
            en: 'Polyphemus',
            de: 'Polyphemus',
            fr: 'Polyphemus',
            ja: 'ポリュペモス',
          },
          trackerName: {
            en: 'Poly',
            de: 'Poly',
            fr: 'Poly',
            ja: 'ポリュペモス',
          },
          x: 26.4,
          y: 14.3,
        },
        strider: {
          label: {
            en: 'Strider',
            de: 'Simurghs',
            fr: 'Simurgh',
            ja: 'シームルグ',
          },
          mobName: {
            en: 'Simurgh\'s Strider',
            de: 'Simurghs Läufer',
            fr: 'Trotteur De Simurgh',
            ja: 'シームルグ・ストライダー',
          },
          trackerName: {
            en: 'Strider',
            de: 'Simurghs',
            fr: 'Simurgh',
            ja: 'シームルグ',
          },
          x: 28.6,
          y: 13.0,
        },
        hazmat: {
          label: {
            en: 'Hazmat',
            de: 'Hazmat',
            fr: 'Hazmat',
            ja: 'ハズマット',
          },
          mobName: {
            en: 'King Hazmat',
            de: 'Hazmat-König',
            fr: 'Hazmat Roi',
            ja: 'キング・ハズマット',
          },
          trackerName: {
            en: 'Hazmat',
            de: 'Hazmat',
            fr: 'Hazmat',
            ja: 'ハズマット',
          },
          x: 35.3,
          y: 18.3,
        },
        fafnir: {
          label: {
            en: 'Fafnir',
            de: 'Fafnir',
            fr: 'Fafnir',
            ja: 'ファヴニル',
          },
          mobName: {
            en: 'Fafnir',
            de: 'Fafnir',
            fr: 'Fafnir',
            ja: 'ファヴニル',
          },
          trackerName: {
            en: 'Fafnir',
            de: 'Fafnir',
            fr: 'Fafnir',
            ja: 'ファヴニル',
          },
          x: 35.5,
          y: 21.5,
          time: 'Night',
        },
        amarok: {
          label: {
            en: 'Amarok',
            de: 'Amarok',
            fr: 'Amarok',
            ja: 'アマロック',
          },
          mobName: {
            en: 'Amarok',
            de: 'Amarok',
            fr: 'Amarok',
            ja: 'アマロック',
          },
          trackerName: {
            en: 'Amarok',
            de: 'Amarok',
            fr: 'Amarok',
            ja: 'アマロック',
          },
          x: 7.6,
          y: 18.2,
        },
        lama: {
          label: {
            en: 'Lama',
            de: 'Lama',
            fr: 'Lama',
            ja: 'ラマ',
          },
          mobName: {
            en: 'Lamashtu',
            de: 'Lamashtu',
            fr: 'Lamashtu',
            ja: 'ラマシュトゥ',
          },
          trackerName: {
            en: 'Lamashtu',
            de: 'Lamashtu',
            fr: 'Lamashtu',
            ja: 'ラマシュトゥ',
          },
          // 7.7, 23.3 from the tracker but mobs are farther south.
          x: 7.7,
          y: 25.3,
          time: 'Night',
        },
        pazu: {
          label: {
            en: 'Pazu',
            de: 'Pazuzu',
            fr: 'Pazuzu',
            ja: 'パズズ',
          },
          mobName: {
            en: 'Pazuzu',
            de: 'Pazuzu',
            fr: 'Pazuzu',
            ja: 'パズズ',
          },
          trackerName: {
            en: 'Pazuzu',
            de: 'Pazuzu',
            fr: 'Pazuzu',
            ja: 'パズズ',
          },
          x: 7.4,
          y: 21.7,
          weather: 'Gales',
        },
      },
    },
  },
};

let gFlagRegex = Regexes.Parse(/00:00..:(.*)Eureka (?:Anemos|Pagos) \( (\y{Float})\s*, (\y{Float}) \)(.*$)/);
let gTrackerRegex = Regexes.Parse(/(?:https:\/\/)?ffxiv-eureka\.com\/(\S*)\/?/);
let gImportRegex = Regexes.Parse(/00:00..:(.*)★ NMs on cooldown: (\S.*\))/);
let gGalesIcon = '&#x1F300;';
let gWeatherIcons = {
  Gales: gGalesIcon,
};
let gNightIcon = '&#x1F319;';
let gDayIcon = '&#x2600;';

let gTracker;
class EurekaTracker {
  constructor(options) {
    this.options = options;
    this.zoneInfo = null;
    this.ResetZone();
    this.updateTimesHandle = null;
  }

  SetStyleFromMap(style, mx, my) {
    let zi = this.zoneInfo;
    let px = zi.mapToPixelXScalar * mx + zi.mapToPixelXConstant;
    let py = zi.mapToPixelYScalar * my + zi.mapToPixelYConstant;

    style.left = (px / zi.mapWidth * 100) + '%';
    style.top = (py / zi.mapHeight * 100) + '%';
  }

  SetStyleFromEntity(style, ex, ey) {
    let zi = this.zoneInfo;
    let mx = zi.entityToMapXScalar * ex + zi.entityToMapXConstant;
    let my = zi.entityToMapYScalar * ey + zi.entityToMapYConstant;
    this.SetStyleFromMap(style, mx, my);
  }

  InitNMs() {
    this.nms = this.options.ZoneInfo[this.zoneName].nms;
    this.nmKeys = Object.keys(this.nms);

    let container = document.getElementById('nm-labels');

    for (let i = 0; i < this.nmKeys.length; ++i) {
      let nm = this.nms[this.nmKeys[i]];

      let label = document.createElement('div');
      label.classList.add('nm');
      label.id = this.nmKeys[i];

      this.SetStyleFromMap(label.style, nm.x, nm.y);

      let icon = document.createElement('span');
      icon.classList.add('nm-icon');
      let name = document.createElement('span');
      name.classList.add('nm-name');
      name.classList.add('text');
      name.innerText = nm.label[this.options.Language];
      let time = document.createElement('span');
      time.classList.add('nm-time');
      time.classList.add('text');
      label.appendChild(icon);
      label.appendChild(name);
      label.appendChild(time);
      container.appendChild(label);

      nm.element = label;
      nm.timeElement = time;
      let mobName = nm.mobName[this.options.Language];
      nm.addRegex = Regexes.Parse('03:Added new combatant ' + mobName + '\\.');
      nm.removeRegex = Regexes.Parse('04:Removing combatant ' + mobName + '\\.');
      nm.respawnTimeMsLocal = undefined;
      nm.respawnTimeMsTracker = undefined;
    }

    this.playerElement = document.createElement('div');
    this.playerElement.classList.add('player');
    container.appendChild(this.playerElement);
  }

  ResetZone() {
    let container = document.getElementById('nm-labels');
    container.innerHTML = '';
    this.currentTracker = null;
  }

  OnPlayerChange(e) {
    if (!this.zoneInfo)
      return;
    this.SetStyleFromEntity(this.playerElement.style, e.detail.pos.x, e.detail.pos.y);
  }

  OnZoneChange(e) {
    this.zoneName = e.detail.zoneName;
    this.zoneInfo = this.options.ZoneInfo[this.zoneName];
    let container = document.getElementById('container');
    if (this.zoneInfo) {
      this.ResetZone();
      document.getElementById('map-image').src = this.zoneInfo.mapImage;
      this.InitNMs();
      this.UpdateTimes();
      container.classList.remove('hide');
      this.updateTimesHandle = window.setInterval((function() {
        this.UpdateTimes();
      }).bind(this), this.options.RefreshRateMs);
    } else {
      if (this.updateTimesHandle)
        window.clearInterval(this.updateTimesHandle);
      container.classList.add('hide');
    }

    let flags = document.getElementById('flag-labels');

    for (let i = 0; i < flags.children.length; ++i)
      flags.removeChild(flags.children[i]);
  }

  RespawnTime(nm) {
    let respawnTimeMs = 120 * 60 * 1000;
    return respawnTimeMs + (+new Date());
  }

  OnPopNM(nm) {
    let now = +new Date();
    if (nm.lastPopTimeMsLocal && now - nm.lastPopTimeMsLocal <= this.options.SuppressPopMs)
      return;


    nm.element.classList.add('nm-pop');
    nm.element.classList.remove('nm-down');
    let respawnTimeMs = 120 * 60 * 1000;
    nm.lastPopTimeMsLocal = +new Date();
    nm.respawnTimeMsLocal = this.RespawnTime(nm);

    if (this.options.PopSound && this.options.PopVolume) {
      let audio = new Audio(this.options.PopSound);
      audio.volume = this.options.PopVolume;
      audio.play();
    }
  }

  OnKillNM(nm) {
    nm.element.classList.remove('nm-pop');
    this.UpdateTimes();
  }

  UpdateTimes() {
    let nowMs = +new Date();

    let galesStr = gGalesIcon;
    let weather = getWeather(nowMs, this.zoneName);
    if (weather == 'Gales') {
      let galesStopTime = findNextWeatherNot(nowMs, this.zoneName, 'Gales');
      if (galesStopTime) {
        let galesMin = (galesStopTime - nowMs) / 1000 / 60;
        galesStr += ' for ' + Math.ceil(galesMin) + 'm';
      } else {
        galesStr += ' for ???';
      }
    } else {
      let galesStartTime = findNextWeather(nowMs, this.zoneName, 'Gales');
      if (galesStartTime) {
        let galesMin = (galesStartTime - nowMs) / 1000 / 60;
        galesStr += ' in ' + Math.ceil(galesMin) + 'm';
      } else {
        galesStr += ' in ???';
      }
    }
    document.getElementById('label-gales').innerHTML = galesStr;

    let nextDay = findNextNight(nowMs);
    let nextNight = findNextDay(nowMs);
    let timeStr = '';
    let timeVal;
    if (nextDay > nextNight)
      timeStr = gNightIcon + ' for ';
    else
      timeStr = gDayIcon + ' for ';

    let dayNightMin = (Math.min(nextDay, nextNight) - nowMs) / 1000 / 60;
    timeStr += Math.ceil(dayNightMin) + 'm';
    document.getElementById('label-time').innerHTML = timeStr;

    document.getElementById('label-tracker').innerHTML = this.currentTracker;

    for (let i = 0; i < this.nmKeys.length; ++i) {
      let nm = this.nms[this.nmKeys[i]];

      let respawnMs = null;
      if (nm.respawnTimeMsLocal)
        respawnMs = nm.respawnTimeMsLocal;
      else if (nm.respawnTimeMsTracker)
        respawnMs = nm.respawnTimeMsTracker;


      let popRespawnMs = respawnMs;

      // Ignore respawns in the past.
      respawnMs = Math.max(respawnMs, nowMs);
      let respawnIcon = '';

      if (nm.weather) {
        let respawnWeather = getWeather(respawnMs, this.zoneName);
        if (respawnWeather != nm.weather) {
          let weatherStartTime =
            findNextWeather(respawnMs, this.zoneName, nm.weather);
          if (weatherStartTime > respawnMs) {
            respawnIcon = gWeatherIcons[nm.weather];
            respawnMs = weatherStartTime;
          }
        }
      }

      if (nm.time == 'Night') {
        let isNight = isNightTime(respawnMs);
        if (!isNight) {
          let nextNight = findNextNight(respawnMs);
          if (nextNight > respawnMs) {
            respawnIcon = gNightIcon;
            respawnMs = nextNight;
          }
        }
      }

      let remainingMs = respawnMs - nowMs;
      if (remainingMs <= 0) {
        let openUntil = null;
        if (nm.weather) {
          let weatherStartTime = findNextWeatherNot(nowMs, this.zoneName, nm.weather);
          respawnIcon = gWeatherIcons[nm.weather]; ;
          openUntil = weatherStartTime;
        }
        if (nm.time == 'Night') {
          respawnIcon = gNightIcon;
          openUntil = findNextDay(nowMs);
        }

        if (openUntil) {
          let openMin = (openUntil - nowMs) / 1000 / 60;
          nm.timeElement.innerHTML = respawnIcon + Math.ceil(openMin) + 'm';
        } else {
          nm.timeElement.innerText = '';
        }
        nm.element.classList.remove('nm-down');
      } else {
        // If still waiting on pop, don't show an icon.
        if (popRespawnMs > nowMs)
          respawnIcon = '';

        let remainingMinutes = Math.ceil(remainingMs / 1000 / 60);
        nm.timeElement.innerHTML = respawnIcon + remainingMinutes + 'm';
        nm.element.classList.add('nm-down');
      }
    }
  }

  ImportFromTracker(importText) {
    let trackerToNM = {};
    for (let i = 0; i < this.nmKeys.length; ++i) {
      let nm = this.nms[this.nmKeys[i]];
      trackerToNM[nm.trackerName[this.options.Language].toLowerCase()] = nm;
    }

    let importList = importText.split(' > ');
    for (let i = 0; i < importList.length; i++) {
      let nmInfo = importList[i].split(' ');
      let name = nmInfo[0];
      let time = nmInfo[1].match(/\d+/)[0];
      let nm = trackerToNM[name.toLowerCase()];
      if (nm)
        nm.respawnTimeMsTracker = (time * 60 * 1000) + (+new Date());
      else
        console.error('Invalid NM Import: ' + name);
    }

    this.UpdateTimes();
  }

  OnLog(e) {
    if (!this.zoneInfo)
      return;
    for (let idx = 0; idx < e.detail.logs.length; idx++) {
      let log = e.detail.logs[idx];
      let match = log.match(gFlagRegex);
      if (match)
        this.AddFlag(match[2], match[3], match[1], match[4]);

      match = log.match(gTrackerRegex);
      if (match)
        this.currentTracker = match[1];

      match = log.match(gImportRegex);
      if (match) {
        this.ImportFromTracker(match[2]);
        continue;
      }
      if (log.indexOf('03:Added new combatant ') >= 0) {
        for (let i = 0; i < this.nmKeys.length; ++i) {
          let nm = this.nms[this.nmKeys[i]];
          if (log.match(nm.addRegex)) {
            this.OnPopNM(nm);
            continue;
          }
        }
      }
      if (log.indexOf('04:Removing combatant ') >= 0) {
        for (let i = 0; i < this.nmKeys.length; ++i) {
          let nm = this.nms[this.nmKeys[i]];
          if (log.match(nm.removeRegex)) {
            this.OnKillNM(nm);
            continue;
          }
        }
      }
    }
  }

  SimplifyText(beforeText, afterText) {
    let str = (beforeText + ' ' + afterText).toLowerCase();

    let dict = {
      train: [
        'train',
        'tren',
        'trian',
        'tran',
        'choo choo',
        'train location',
      ],
      fairy: [
        'fairy',
        'elemental',
        'faerie',
        'fary',
      ],
      raise: [
        'raise',
        'rez',
        'res ',
        ' res',
        'raise plz',
      ],
    };
    let keys = Object.keys(dict);
    for (let i = 0; i < keys.length; ++i) {
      let key = keys[i];
      for (let j = 0; j < dict[key].length; ++j) {
        let m = dict[key][j];
        if (str.indexOf(m) >= 0)
          return key;
      }
    }
  }

  AddFlag(x, y, beforeText, afterText) {
    // https://github.com/ravahn/FFXIV_ACT_Plugin/issues/160
    beforeText = beforeText.replace(/[^\x00-\x7F]/g, '').trim();
    afterText = afterText.replace(/[^\x00-\x7F]/g, '').trim();

    beforeText = beforeText.replace(/(?: at|@)$/, '');

    let simplify = this.SimplifyText(beforeText, afterText);
    if (simplify) {
      beforeText = simplify;
      afterText = '';
    }

    let container = document.getElementById('flag-labels');
    let label = document.createElement('div');
    label.classList.add('flag');
    this.SetStyleFromMap(label.style, x, y);

    let icon = document.createElement('span');
    icon.classList.add('flag-icon');
    let name = document.createElement('span');
    name.classList.add('flag-name');
    name.classList.add('text');
    name.innerText = beforeText;
    if (beforeText != '' && afterText != '')
      name.innerText += ' ';
    name.innerText += afterText;
    label.appendChild(icon);
    label.appendChild(name);
    container.appendChild(label);

    window.setTimeout(function() {
      // Changing zones can also orphan all the labels.
      if (label.parentElement == container)
        container.removeChild(label);
    }, this.options.FlagTimeoutMs);
  }
}

document.addEventListener('onPlayerChangedEvent', function(e) {
  gTracker.OnPlayerChange(e);
});
document.addEventListener('onZoneChangedEvent', function(e) {
  gTracker.OnZoneChange(e);
});
document.addEventListener('onLogEvent', function(e) {
  gTracker.OnLog(e);
});

UserConfig.getUserConfigLocation('eureka', function(e) {
  gTracker = new EurekaTracker(Options);
});
