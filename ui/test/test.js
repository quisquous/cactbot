import '../../resources/common.js';

addOverlayListener('ChangeZone', (e) => {
  document.getElementById('currentZone').innerText = `currentZone: ${e.zoneName} (${e.zoneID})`;
});

addOverlayListener('onInCombatChangedEvent', (e) => {
  document.getElementById('inCombat').innerText = 'inCombat: act: ' + (e.detail.inACTCombat ? 'yes' : 'no') + ' game: ' + (e.detail.inGameCombat ? 'yes' : 'no');
});

addOverlayListener('onPlayerChangedEvent', (e) => {
  document.getElementById('hp').innerText = e.detail.currentHP + '/' + e.detail.maxHP + ' (' + e.detail.currentShield + ')';
  document.getElementById('mp').innerText = e.detail.currentMP + '/' + e.detail.maxMP;
  document.getElementById('cp').innerText = e.detail.currentCP + '/' + e.detail.maxCP;
  document.getElementById('gp').innerText = e.detail.currentGP + '/' + e.detail.maxGP;
  document.getElementById('job').innerText = e.detail.level + ' ' + e.detail.job;
  document.getElementById('debug').innerText = e.detail.debugJob;
  const jobDetail = e.detail.jobDetail;
  if (e.detail.job === 'RDM')
    document.getElementById('jobinfo').innerText = jobDetail.whiteMana + ' | ' + jobDetail.blackMana;
  else if (e.detail.job === 'WAR')
    document.getElementById('jobinfo').innerText = jobDetail.beast;
  else if (e.detail.job === 'DRK')
    document.getElementById('jobinfo').innerText = jobDetail.blood + ' | ' + jobDetail.darksideMilliseconds + ' | ' + jobDetail.darkArts + ' | ' + jobDetail.livingShadowMilliseconds;
  else if (e.detail.job === 'GNB')
    document.getElementById('jobinfo').innerText = jobDetail.cartridges + jobDetail.continuationState;
  else if (e.detail.job === 'PLD')
    document.getElementById('jobinfo').innerText = jobDetail.oath;
  else if (e.detail.job === 'BRD')
    document.getElementById('jobinfo').innerText = jobDetail.songName + ' | ' + jobDetail.songProcs + ' | ' + jobDetail.soulGauge + ' | ' + jobDetail.songMilliseconds;
  else if (e.detail.job === 'DNC')
    document.getElementById('jobinfo').innerText = jobDetail.feathers + ' | ' + jobDetail.esprit + ' | (' + jobDetail.steps + ') | ' + jobDetail.currentStep;
  else if (e.detail.job === 'NIN')
    document.getElementById('jobinfo').innerText = jobDetail.hutonMilliseconds + ' | ' + jobDetail.ninkiAmount;
  else if (e.detail.job === 'DRG')
    document.getElementById('jobinfo').innerText = jobDetail.bloodMilliseconds + ' | ' + jobDetail.lifeMilliseconds + ' | ' + jobDetail.eyesAmount;
  else if (e.detail.job === 'BLM')
    document.getElementById('jobinfo').innerText = jobDetail.umbralStacks + ' (' + jobDetail.umbralMilliseconds + ') | ' + jobDetail.umbralHearts + ' | ' + jobDetail.foulCount + ' ' + jobDetail.enochian + ' (' + jobDetail.nextPolyglotMilliseconds + ')';
  else if (e.detail.job === 'THM')
    document.getElementById('jobinfo').innerText = jobDetail.umbralStacks + ' (' + jobDetail.umbralMilliseconds + ')';
  else if (e.detail.job === 'WHM')
    document.getElementById('jobinfo').innerText = jobDetail.lilyStacks + ' (' + jobDetail.lilyMilliseconds + ') | ' + jobDetail.bloodlilyStacks;
  else if (e.detail.job === 'SMN')
    document.getElementById('jobinfo').innerText = jobDetail.aetherflowStacks + ' | ' + jobDetail.dreadwyrmStacks + ' | ' + jobDetail.bahamutStance + ' | ' + jobDetail.bahamutSummoned + ' ( ' + jobDetail.stanceMilliseconds + ') | ' + jobDetail.phoenixReady;
  else if (e.detail.job === 'SCH')
    document.getElementById('jobinfo').innerText = jobDetail.aetherflowStacks + ' | ' + jobDetail.fairyGauge + ' | ' + jobDetail.fairyStatus + ' (' + jobDetail.fairyMilliseconds + ')';
  else if (e.detail.job === 'ACN')
    document.getElementById('jobinfo').innerText = jobDetail.aetherflowStacks;
  else if (e.detail.job === 'AST')
    document.getElementById('jobinfo').innerText = jobDetail.heldCard + ' (' + jobDetail.arcanums + ')';
  else if (e.detail.job === 'MNK')
    document.getElementById('jobinfo').innerText = jobDetail.lightningStacks + ' (' + jobDetail.lightningMilliseconds + ') | ' + jobDetail.chakraStacks + ' | ' + jobDetail.lightningTimerFrozen;
  else if (e.detail.job === 'PGL')
    document.getElementById('jobinfo').innerText = jobDetail.lightningStacks + ' (' + jobDetail.lightningMilliseconds + ')';
  else if (e.detail.job === 'MCH')
    document.getElementById('jobinfo').innerText = jobDetail.heat + ' (' + jobDetail.overheatMilliseconds + ') | ' + jobDetail.battery + ' (' + jobDetail.batteryMilliseconds + ') | last: ' + jobDetail.lastBatteryAmount + ' | ' + jobDetail.overheatActive + ' | ' + jobDetail.robotActive;
  else if (e.detail.job === 'SAM')
    document.getElementById('jobinfo').innerText = jobDetail.kenki + ' | ' + jobDetail.meditationStacks + '(' + jobDetail.setsu + ',' + jobDetail.getsu + ',' + jobDetail.ka + ')';
  else
    document.getElementById('jobinfo').innerText = '';

  document.getElementById('pos').innerText = e.detail.pos.x.toFixed(2) + ',' + e.detail.pos.y.toFixed(2) + ',' + e.detail.pos.z.toFixed(2);
  document.getElementById('rotation').innerText = e.detail.rotation;
  document.getElementById('bait').innerText = e.detail.bait;
});

addOverlayListener('EnmityTargetData', (e) => {
  const target = e.Target;
  if (!target) {
    document.getElementById('target').innerText = '--';
    document.getElementById('tid').innerText = '';
    document.getElementById('tdistance').innerText = '';
  } else {
    document.getElementById('target').innerText = target.Name;
    document.getElementById('tid').innerText = target.ID.toString(16);
    document.getElementById('tdistance').innerText = target.Distance;
  }
});

addOverlayListener('onGameExistsEvent', (e) => {
  // console.log("Game exists: " + e.detail.exists);
});

addOverlayListener('onGameActiveChangedEvent', (e) => {
  // console.log("Game active: " + e.detail.active);
});

addOverlayListener('onLogEvent', (e) => {
  for (let i = 0; i < e.detail.logs.length; i++) {
    // Match "/echo tts:<stuff>"
    const r = e.detail.logs[i].match('00:0038:tts:(.*)');
    if (r) {
      callOverlayHandler({
        call: 'cactbotSay',
        text: r[1],
      });
    }
  }
});

addOverlayListener('onUserFileChanged', (e) => {
  console.log(`User file ${e.file} changed!`);
});

addOverlayListener('FileChanged', (e) => {
  console.log(`File ${e.file} changed!`);
});

callOverlayHandler({ call: 'cactbotRequestState' });
