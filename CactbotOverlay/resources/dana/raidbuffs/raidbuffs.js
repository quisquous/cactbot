"use strict";

var kHideWellFedAboveSeconds = 15 * 60;  // N mins warning.
var kWellFedZoneRegex = /^(Unknown Zone|Deltascape.*Savage.*)$/;

var g_me = null;
var g_in_combat = false;
var g_zone = '';

var g_fed_expires_time_ms = null;
var g_fed_timer = null;

document.addEventListener("onPlayerChangedEvent", function (e) {
  if (g_me == null)
    g_me = e.detail.name;
});

document.addEventListener("onLogEvent", function(e) {
  if (g_me == null)
    return;

  var logs = e.detail.logs;
  for (var i = 0; i < logs.length; i++) {
    var line = logs[i];
    
    var r = line.match(':' + g_me + ' gains the effect of Well Fed from ' + g_me + ' for ([0-9.]+) Seconds\.');
    if (r != null) {
      var seconds = parseFloat(r[1]);
      var now = Date.now();  // This is in ms.
      g_fed_expires_time_ms = now + (seconds * 1000);
      Draw();
    }
  }
});

document.addEventListener("onInCombatChangedEvent", function (e) {
  g_in_combat = e.detail.inCombat;
  Draw();
});

document.addEventListener("onZoneChangedEvent", function (e) {
  g_zone = e.detail.zoneName;
  Draw();
});

// Returns the number of ms until it should be shown. If <= 0, show it.
function CanShowWellFedWarning() {
  if (g_in_combat)
    return false;
  if (g_zone.search(kWellFedZoneRegex) < 0)
    return false;
  return true;
}

// Returns the number of ms until it should be shown. If <= 0, show it.
function TimeToShowWellFedWarning() {
  var now_ms = Date.now();
  var show_at_ms = g_fed_expires_time_ms - (kHideWellFedAboveSeconds * 1000);
  return show_at_ms - now_ms;
}

function Draw() {
  window.clearTimeout(g_fed_timer);
  g_fed_timer = null;

  var can_show_fed = CanShowWellFedWarning();
  var show_fed_ms = TimeToShowWellFedWarning();
  
  if (!can_show_fed || show_fed_ms > 0) {
    document.getElementById('well-fed-container').classList.add("hide");
    if (can_show_fed)
      g_fed_timer = window.setTimeout(Draw, show_fed_ms);
  } else {
    document.getElementById('well-fed-container').classList.remove("hide");
  }
}

window.onload = Draw;