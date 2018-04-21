"use strict";

var Options = {
  Language: 'en',
  RefreshRateMs: 1000,
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
          name: 'Sabo',
          mobName: 'Sabotender Corrido',
          trackerName: 'sabo',
          x: 13.9,
          y: 21.9,
        },
        lord: {
          name: 'Lord',
          mobName: 'The Lord Of Anemos',
          trackerName: 'lord',
          x: 29.7,
          y: 27.1,
        },
        teles: {
          name: 'Teles',
          mobName: 'Teles',
          trackerName: 'teles',
          x: 25.6,
          y: 27.4,
        },
        emperor: {
          name: 'Emp',
          mobName: 'The Emperor Of Anemos',
          trackerName: 'emperor',
          x: 17.2,
          y: 22.2,
        },
        callisto: {
          name: 'Calli',
          mobName: 'Callisto',
          trackerName: 'callisto',
          // 25.5, 22.3 from the tracker, but collides with number
          x: 26.2,
          y: 22.0,
        },
        number: {
          name: 'Number',
          mobName: 'Number',
          trackerName: 'number',
          // 23.5, 22.7 from the tracker, but collides with callisto
          x: 23.5,
          y: 23.4,
        },
        jaha: {
          name: 'Jaha',
          mobName: 'Jahannam',
          trackerName: 'jaha',
          x: 17.7,
          y: 18.6,
          weather: 'Gales',
        },
        amemet: {
          name: 'Amemet',
          mobName: 'Amemet',
          trackerName: 'amemet',
          x: 15.0,
          y: 15.6,
        },
        caym: {
          name: 'Caym',
          mobName: 'Caym',
          trackerName: 'caym',
          x: 13.8,
          y: 12.5,
        },
        bomb: {
          name: 'Bomb',
          mobName: 'Bombadeel',
          trackerName: 'bomba',
          x: 28.3,
          y: 20.4,
          time: 'Night',
        },
        serket: {
          name: 'Serket',
          mobName: 'Serket',
          trackerName: 'serket',
          x: 24.8,
          y: 17.9,
        },
        juli: {
          name: 'Juli',
          mobName: 'Judgmental Julika',
          trackerName: 'julika',
          x: 21.9,
          y: 15.6,
        },
        rider: {
          name: 'Rider',
          mobName: 'The White Rider',
          trackerName: 'rider',
          x: 20.3,
          y: 13.0,
          time: 'Night',
        },
        poly: {
          name: 'Poly',
          mobName: 'Polyphemus',
          trackerName: 'poly',
          x: 26.4,
          y: 14.3,
        },
        strider: {
          name: 'Strider',
          mobName: "Simurgh's Strider",
          trackerName: 'strider',
          x: 28.6,
          y: 13.0,
        },
        hazmat: {
          name: 'Hazmat',
          mobName: 'King Hazmat',
          trackerName: 'hazmat',
          x: 35.3,
          y: 18.3,
        },
        fafnir: {
          name: 'Fafnir',
          mobName: 'Fafnir',
          trackerName: 'fafnir',
          x: 35.5,
          y: 21.5,
          time: 'Night',
        },
        amarok: {
          name: 'Amarok',
          mobName: 'Amarok',
          trackerName: 'amarok',
          x: 7.6,
          y: 18.2,
        },
        lama: {
          name: 'Lama',
          mobName: 'Lamashtu',
          trackerName: 'lamashtu',
          // 7.7, 23.3 from the tracker but mobs are farther south.
          x: 7.7,
          y: 25.3,
          time: 'Night',
        },
        pazu: {
          name: 'Pazu',
          mobName: 'Pazuzu',
          trackerName: 'pazuzu',
          x: 7.4,
          y: 21.7,
          weather: 'Gales',
        },
      },
    },
  },
  FlagTimeoutMs: 60000,
}

var gFlagRegex = Regexes.Parse(/00:00..:(.*)Eureka (?:Anemos|Pagos) \( (\y{Float})  , (\y{Float}) \)(.*$)/);
var gTrackerRegex = Regexes.Parse(/(?:https:\/\/)?ffxiv-eureka\.com\/(\S*)\/?/);
var gImportRegex = Regexes.Parse(/00:00..:(.*)★ NMs on cooldown: (\S.*\))/);
var gGalesIcon = "&#x1F300;"
var gWeatherIcons = {
  Gales: gGalesIcon,
};
var gNightIcon = "&#x1F319;";
var gDayIcon = "&#x2600;";

var gTracker;
class EurekaTracker {
  constructor(options) {
    this.options = options;
    this.zoneInfo = null;
    this.ResetZone();
    this.updateTimesHandle = null;
  }

  SetStyleFromMap(style, mx, my) {
    var zi = this.zoneInfo;
    var px = zi.mapToPixelXScalar * mx + zi.mapToPixelXConstant;
    var py = zi.mapToPixelYScalar * my + zi.mapToPixelYConstant;

    style.left = (px / zi.mapWidth * 100) + '%';
    style.top = (py / zi.mapHeight * 100) + '%';
  }

  SetStyleFromEntity(style, ex, ey) {
    var zi = this.zoneInfo;
    var mx = zi.entityToMapXScalar * ex + zi.entityToMapXConstant;
    var my = zi.entityToMapYScalar * ey + zi.entityToMapYConstant;
    this.SetStyleFromMap(style, mx, my);
  }

  InitNMs() {
    this.nms = this.options.ZoneInfo[this.zoneName].nms;
    this.nmKeys = Object.keys(this.nms);

    var container = document.getElementById('nm-labels');

    for (var i = 0; i < this.nmKeys.length; ++i) {
      var nm = this.nms[this.nmKeys[i]];

      var label = document.createElement('div');
      label.classList.add('nm');
      label.id = this.nmKeys[i];

      this.SetStyleFromMap(label.style, nm.x, nm.y);

      var icon = document.createElement('span');
      icon.classList.add('nm-icon');
      var name = document.createElement('span');
      name.classList.add('nm-name');
      name.classList.add('text');
      name.innerText = nm.name;
      var time = document.createElement('span');
      time.classList.add('nm-time');
      time.classList.add('text');
      label.appendChild(icon);
      label.appendChild(name);
      label.appendChild(time);
      container.appendChild(label);

      nm.element = label;
      nm.timeElement = time;
      nm.addRegex = Regexes.Parse('03:Added new combatant ' + nm.mobName + '\\.');
      nm.removeRegex = Regexes.Parse('04:Removing combatant ' + nm.mobName + '\\.');
      nm.respawnTimeMsLocal = undefined;
      nm.respawnTimeMsTracker = undefined;
    }

    this.playerElement = document.createElement('div');
    this.playerElement.classList.add('player');
    container.appendChild(this.playerElement);
  }

  ResetZone() {
    var container = document.getElementById('nm-labels');
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
    var container = document.getElementById('container');
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

    var flags = document.getElementById('flag-labels');

    for (var i = 0; i < flags.children.length; ++i) {
      flags.removeChild(flags.children[i]);
    }
  }

  RespawnTime(nm) {
    var respawnTimeMs = 120 * 60 * 1000;
    return respawnTimeMs + (+new Date());
  }

  OnPopNM(nm) {
    nm.element.classList.add('nm-pop');
    nm.element.classList.remove('nm-down');
    var respawnTimeMs = 120 * 60 * 1000;
    nm.respawnTimeMsLocal = this.RespawnTime(nm);
  }

  OnKillNM(nm) {
    nm.element.classList.remove('nm-pop');
    this.UpdateTimes();
  }

  UpdateTimes() {
    var nowMs = +new Date();

    var galesStr = gGalesIcon;
    var weather = WeatherFinder.getWeather(nowMs, this.zoneName);
    if (weather == 'Gales') {
      var galesStopTime = WeatherFinder.findNextWeatherNot(nowMs, this.zoneName, 'Gales');
      if (galesStopTime) {
        var galesMin = (galesStopTime - nowMs) / 1000 / 60;
        galesStr += ' for ' + Math.ceil(galesMin) + 'm';
      } else {
        galesStr += ' for ???';
      }
    } else {
      var galesStartTime = WeatherFinder.findNextWeather(nowMs, this.zoneName, 'Gales');
      if (galesStartTime) {
        var galesMin = (galesStartTime - nowMs) / 1000 / 60;
        galesStr += ' in ' + Math.ceil(galesMin) + 'm';
      } else {
        galesStr += ' in ???';
      }
    }
    document.getElementById('label-gales').innerHTML = galesStr;

    var nextDay = WeatherFinder.findNextNight(nowMs);
    var nextNight = WeatherFinder.findNextDay(nowMs);
    var timeStr = "";
    var timeVal;
    if (nextDay > nextNight) {
      timeStr = gNightIcon + " for ";
    } else {
      timeStr = gDayIcon + " for ";
    }
    var dayNightMin = (Math.min(nextDay, nextNight) - nowMs) / 1000 / 60;
    timeStr += Math.ceil(dayNightMin) + 'm';
    document.getElementById('label-time').innerHTML = timeStr;

    document.getElementById('label-tracker').innerHTML = this.currentTracker;

    for (var i = 0; i < this.nmKeys.length; ++i) {
      var nm = this.nms[this.nmKeys[i]];

      var respawnMs = null;
      if (nm.respawnTimeMsLocal) {
        respawnMs = nm.respawnTimeMsLocal;
      } else if (nm.respawnTimeMsTracker) {
        respawnMs = nm.respawnTimeMsTracker;
      }

      var popRespawnMs = respawnMs;

      // Ignore respawns in the past.
      respawnMs = Math.max(respawnMs, nowMs);
      var respawnIcon = "";

      if (nm.weather) {
        var respawnWeather = WeatherFinder.getWeather(respawnMs, this.zoneName);
        if (respawnWeather != nm.weather) {
          var weatherStartTime = WeatherFinder.findNextWeather(respawnMs, this.zoneName, nm.weather);
          if (weatherStartTime > respawnMs) {
            respawnIcon = gWeatherIcons[nm.weather];
            respawnMs = weatherStartTime;
          }
        }
      }

      if (nm.time == 'Night') {
        var isNight = WeatherFinder.isNightTime(respawnMs);
        if (!isNight) {
          var nextNight = WeatherFinder.findNextNight(respawnMs);
          if (nextNight > respawnMs) {
            respawnIcon = gNightIcon;
            respawnMs = nextNight;
          }
        }
      }

      var remainingMs = respawnMs - nowMs;
      var remainingMinutes = Math.ceil(remainingMs / 1000 / 60);
      if (remainingMs <= 0) {
        var openUntil = null;
        if (nm.weather) {
          var weatherStartTime = WeatherFinder.findNextWeatherNot(nowMs, this.zoneName, nm.weather);
          respawnIcon = gWeatherIcons[nm.weather];;
          openUntil = weatherStartTime;
        }
        if (nm.time == 'Night') {
          respawnIcon = gNightIcon;
          openUntil = WeatherFinder.findNextDay(nowMs);
        }

        if (openUntil) {
          var openMin = (openUntil - nowMs) / 1000 / 60;
          nm.timeElement.innerHTML = respawnIcon + Math.ceil(openMin) + 'm';
        } else {
          nm.timeElement.innerText = '';
        }
        nm.element.classList.remove('nm-down');
      } else {
        // If still waiting on pop, don't show an icon.
        if (popRespawnMs > nowMs)
          respawnIcon = "";

        var remainingMinutes = Math.ceil(remainingMs / 1000 / 60);
        nm.timeElement.innerHTML = respawnIcon + remainingMinutes + 'm';
        nm.element.classList.add('nm-down');
      }
    }
  }

  ImportFromTracker(importText) {
    var trackerToNM = {};
    for (var i = 0; i < this.nmKeys.length; ++i) {
      var nm = this.nms[this.nmKeys[i]];
      trackerToNM[nm.trackerName.toLowerCase()] = nm;
    }

    var importList = importText.split(' > ');
    for(var i = 0; i < importList.length; i++) {
      var nmInfo = importList[i].split(' ');
      var name = nmInfo[0];
      var time = nmInfo[1].match(/\d+/)[0];
      var nm = trackerToNM[name.toLowerCase()];
      if (nm) {
        nm.respawnTimeMsTracker = (time * 60 * 1000) + (+new Date());
      } else {
        console.error('Invalid NM Import: ' + name);
      }
    }

    this.UpdateTimes();
  }

  OnLog(e) {
    if (!this.zoneInfo)
      return;
    for (var idx = 0; idx < e.detail.logs.length; idx++) {
      var log = e.detail.logs[idx];
      var match = log.match(gFlagRegex);
      if (match) {
        this.AddFlag(match[2], match[3], match[1], match[4]);
      }
      match = log.match(gTrackerRegex);
      if (match) {
        this.currentTracker = match[1];
      }
      match = log.match(gImportRegex);
      if (match) {
        this.ImportFromTracker(match[2]);
        continue;
      }
      if (log.indexOf('03:Added new combatant ') >= 0) {
        for (var i = 0; i < this.nmKeys.length; ++i) {
          var nm = this.nms[this.nmKeys[i]];
          if (log.match(nm.addRegex)) {
            this.OnPopNM(nm);
            continue;
          }
        }
      }
      if (log.indexOf('04:Removing combatant ') >= 0) {
        for (var i = 0; i < this.nmKeys.length; ++i) {
          var nm = this.nms[this.nmKeys[i]];
          if (log.match(nm.removeRegex)) {
            this.OnKillNM(nm);
            continue;
          }
        }
      }
    }
  }

  SimplifyText(beforeText, afterText) {
    var str = (beforeText + ' ' + afterText).toLowerCase();

    var dict = {
      train: [
        'train',
        'tren',
        'trian',
        'tran',
        'choo choo',
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
      ],
    };
    var keys = Object.keys(dict);
    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i];
      for (var j = 0; j < dict[key].length; ++j) {
        var m = dict[key][j];
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

    var simplify = this.SimplifyText(beforeText, afterText);
    if (simplify) {
      beforeText = simplify;
      afterText = '';
    }

    var container = document.getElementById('flag-labels');
    var label = document.createElement('div');
    label.classList.add('flag');
    this.SetStyleFromMap(label.style, x, y);

    var icon = document.createElement('span');
    icon.classList.add('flag-icon');
    var name = document.createElement('span');
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
      if (label.parentElement == container) {
        container.removeChild(label);
      }
    }, this.options.FlagTimeoutMs);
  }
}

document.addEventListener("onPlayerChangedEvent", function(e) {
  gTracker.OnPlayerChange(e);
});
document.addEventListener("onZoneChangedEvent", function(e) {
  gTracker.OnZoneChange(e);
});
document.addEventListener("onLogEvent", function(e) {
  gTracker.OnLog(e);
});

UserConfig.getUserConfigLocation('eureka', function(e) {
  gTracker = new EurekaTracker(Options);
});