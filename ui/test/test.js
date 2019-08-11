'use strict';

addOverlayListener('onZoneChangedEvent', function(e) {
  document.getElementById('currentZone').innerText = 'currentZone: ' + e.detail.zoneName;
});

addOverlayListener('onInCombatChangedEvent', function(e) {
  document.getElementById('inCombat').innerText = 'inCombat: act: ' + (e.detail.inACTCombat ? 'yes' : 'no') + ' game: ' + (e.detail.inGameCombat ? 'yes' : 'no');
});

addOverlayListener('onPlayerChangedEvent', function(e) {
  document.getElementById('id').innerText = e.detail.id.toString(16);
  document.getElementById('hp').innerText = e.detail.currentHP + '/' + e.detail.maxHP + ' (' + e.detail.currentShield + ')';
  document.getElementById('mp').innerText = e.detail.currentMP + '/' + e.detail.maxMP;
  document.getElementById('cp').innerText = e.detail.currentCP + '/' + e.detail.maxCP;
  document.getElementById('gp').innerText = e.detail.currentGP + '/' + e.detail.maxGP;
  document.getElementById('job').innerText = e.detail.level + ' ' + e.detail.job;
  document.getElementById('debug').innerText = e.detail.debugJob;
  let jobDetail = e.detail.jobDetail;
  if (e.detail.job == 'RDM')
    document.getElementById('jobinfo').innerText = jobDetail.whiteMana + ' | ' + jobDetail.blackMana;
  else if (e.detail.job == 'WAR')
    document.getElementById('jobinfo').innerText = jobDetail.beast;
  else if (e.detail.job == 'DRK')
    document.getElementById('jobinfo').innerText = jobDetail.blood + ' | ' + jobDetail.darksideMilliseconds;
  else if (e.detail.job == 'PLD')
    document.getElementById('jobinfo').innerText = jobDetail.oath;
  else if (e.detail.job == 'BRD')
    document.getElementById('jobinfo').innerText = jobDetail.songName + ' | ' + jobDetail.songProcs + ' | ' + jobDetail.songMilliseconds;
  else if (e.detail.job == 'NIN')
    document.getElementById('jobinfo').innerText = jobDetail.hutonMilliseconds + ' | ' + jobDetail.ninkiAmount;
  else if (e.detail.job == 'DRG')
    document.getElementById('jobinfo').innerText = jobDetail.bloodMilliseconds + ' | ' + jobDetail.lifeMilliseconds + ' | ' + jobDetail.eyesAmount;
  else if (e.detail.job == 'BLM')
    document.getElementById('jobinfo').innerText = jobDetail.umbralStacks + ' (' + jobDetail.umbralMilliseconds + ') | ' + jobDetail.umbralHearts + ' | ' + jobDetail.foulCount + ' ' + jobDetail.enochian + ' (' + jobDetail.nextPolygotMilliseconds + ')';
  else if (e.detail.job == 'THM')
    document.getElementById('jobinfo').innerText = jobDetail.umbralStacks + ' (' + jobDetail.umbralMilliseconds + ')';
  else if (e.detail.job == 'WHM')
    document.getElementById('jobinfo').innerText = jobDetail.lilies;
  else if (e.detail.job == 'SMN')
    document.getElementById('jobinfo').innerText = jobDetail.aetherflowStacks + ' | ' + jobDetail.dreadwyrmStacks + ' | ' + jobDetail.bahamutStacks + ' ( ' + jobDetail.dreadwyrmMilliseconds + ' | ' + jobDetail.bahamutMilliseconds + ' )';
  else if (e.detail.job == 'SCH')
    document.getElementById('jobinfo').innerText = jobDetail.aetherflowStacks + ' | ' + jobDetail.fairyGauge;
  else if (e.detail.job == 'ACN')
    document.getElementById('jobinfo').innerText = jobDetail.aetherflowStacks;
  else if (e.detail.job == 'MNK')
    document.getElementById('jobinfo').innerText = jobDetail.lightningStacks + ' | ' + jobDetail.chakraStacks + ' (' + jobDetail.lightningMilliseconds + ')';
  else if (e.detail.job == 'PGL')
    document.getElementById('jobinfo').innerText = jobDetail.lightningStacks + ' (' + jobDetail.lightningMilliseconds + ')';
  else if (e.detail.job == 'MCH')
    document.getElementById('jobinfo').innerText = jobDetail.heat + ' (' + jobDetail.overheatMilliseconds + ') | ' + jobDetail.battery + ' (' + jobDetail.batteryMilliseconds + ')';
  else
    document.getElementById('jobinfo').innerText = '';

  document.getElementById('pos').innerText = e.detail.pos.x + ',' + e.detail.pos.y + ',' + e.detail.pos.z;
});

addOverlayListener('onTargetChangedEvent', function(e) {
  if (!e.detail) {
    document.getElementById('target').innerText = '--';
    document.getElementById('tid').innerText = '';
    document.getElementById('tdistance').innerText = '';
  } else {
    document.getElementById('target').innerText = e.detail.name;
    document.getElementById('tid').innerText = e.detail.id.toString(16);
    document.getElementById('tdistance').innerText = e.detail.distance;
  }
});

addOverlayListener('onGameExistsEvent', function(e) {
  // console.log("Game exists: " + e.detail.exists);
});

addOverlayListener('onGameActiveChangedEvent', function(e) {
  // console.log("Game active: " + e.detail.active);
});

addOverlayListener('onLogEvent', function(e) {
  for (let i = 0; i < e.detail.logs.length; i++) {
    // Match "/echo tts:<stuff>"
    let r = e.detail.logs[i].match('00:0038:tts:(.*)');
    if (r) {
      // OverlayPluginApi.overlayMessage(OverlayPluginApi.overlayName, JSON.stringify({ 'say': r[1] }));
      callOverlayHandler({
        call: 'cactbotSay',
        text: r[1],
      });
    }
  }
});
