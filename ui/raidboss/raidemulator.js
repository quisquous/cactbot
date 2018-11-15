'use strict';
var global = {};
var input = document.getElementById('zoneName');
function LogEvent(logs) {
  let evt = new CustomEvent('onLogEvent', {detail: {logs: logs}});
  document.dispatchEvent(evt);
}
function ZoneEvent() {
  let zone = input.value.replace(/\n/, '');
  let evt = new CustomEvent('onZoneChangedEvent', {detail: {zoneName: zone}});
  document.dispatchEvent(evt);
}
document.addEventListener('onZoneChangedEvent', function(e) {
  document.getElementById('currentZone').innerHTML = e.detail.zoneName;
})
document.getElementById('inputLogFile').addEventListener('change', function(e) {
  let myFile = this.files[0];
  let reader = new FileReader();
  global.storage = [];
  if (global.logTimers) {
    stopLogFile();
    console.log('stop');
  }

  reader.onprogress = function(e) {
    global.storage = e.target.result.split('\n');
  };
  reader.onloadend = function(e) {
    input.value = global.storage[0];
    global.storage.shift();
    global.storage = editLog(global.storage);
    global.storage.sort();
    delayLog();
    ZoneEvent();
  };
  reader.readAsText(myFile);
});

function editLog(log) {
  let result = [];
  for(let i = 0; i < log.length; i++) {
    let regex = [/ 14:/, / 15:/ , / 1B:/, / gains the effect of /, / starts using /, /:Engage!/, /:Start!/, /:À l\'attaque/, /removing combatant /, /adding combatant/];
    for (let r = 0; r < regex.length; r++) {
      if (regex[r].test(log[i]) == true) {
        result.push(log[i]);
        break;
      }
    }
  }
  return result;
}

function playLogFile() {
  global.logTimers = [];
  for(let i = 0; i < global.storage.length; i++) {
    global.logTimers.push(setTimeout(function() {
      let myArray = [];
      myArray.push(global.storage[i]);
      document.getElementById('emulatorLogLine').innerText = myArray;
      LogEvent(myArray);
    }, global.logDelay[i]));
  }
  emulatorTimerbar();
  document.getElementById('emulatorLogTimer').style.width = 100 +'%';
}

function stopLogFile() {
  for(let i = 0; i < global.logTimers.length; i++) {
    clearTimeout(global.logTimers[i]);
  }
  global.logTimers = [];
  let myArray = [];
  myArray.push('00:0038:cactbot wipe');
  LogEvent(myArray);
  document.getElementById('emulatorLogTimer').style.transition = '0s';
  document.getElementById('emulatorLogTimer').style.width = 0 +'%';
}

function delayLog() {
  global.logDelay = [];
  delete global.logOldTime;
  for(let i = 0; i < global.storage.length; i++) {
    let logLine = global.storage[i];
    let time = logLine.match(/\[(\d\d):(\d\d):(\d\d).(\d\d\d)\]/);
    let d = new Date();
        d.setHours(time[1]);
        d.setMinutes(time[2]);
        d.setSeconds(time[3]);
        d.setMilliseconds(time[4]);
    let newTime = d.getTime();
    let oldTime = global.logOldTime || d.getTime();

    let delay = newTime - oldTime;
    global.logDelay.push(delay);
    global.logOldTime = oldTime;
  }
}

// Emulator Show/Hide handle
let emuHandle = document.getElementById('emulatorShowHandle');
let showHandleText = document.getElementById('showHandleText');
let showHandleIcon = document.getElementById('showHandleIcon');
showHandleIcon.addEventListener('mouseover', function(){
  emuHandle.style.color = 'rgba(255,255,255, 0.8)';
  // showHandleText.style.visibility = 'visible';
});
showHandleIcon.addEventListener('mouseout', function() {
  emuHandle.style.color = 'rgba(255,255,255, 0.1)';
  // showHandleText.style.visibility = 'hidden';
});
showHandleIcon.addEventListener('click', function(){
  if(showHandleIcon.getAttribute('class') == 'glyphicon glyphicon-eye-closed') {
    showHandleIcon.setAttribute('class', 'glyphicon glyphicon-eye-open');
    emuHandle.style.color = 'rgba(255,255,255, 0.1)'
    // showHandleText.innerHTML = 'Hide Emulator';
    emulatorState('show');
  }
  else {
    showHandleIcon.setAttribute('class', 'glyphicon glyphicon-eye-closed');
    // showHandleText.innerHTML = 'Show Emulator';
    emulatorState('hide');
  }
});
function emulatorState(arg) {
  if (arg == 'show') {
    document.getElementById('emulatorFooter').removeAttribute('class');
  }
  if (arg == 'hide') {
    document.getElementById('emulatorFooter').setAttribute('class', 'hide');
    if(global.logTimers)
      stopLogFile();
  }
}

// Emulator Timer Bar

function emulatorTimerbar() {
  let maxTime = global.logDelay[global.logDelay.length - 1];
  let minTime = 0;

  let runtime = Math.floor((maxTime - minTime) / 1000);
  let timer = document.getElementById('emulatorLogTimer');
  timer.style.transition = '0s';
  timer.style.width = 0 + '%';
  timer.style.transition = runtime + 's linear';
} 