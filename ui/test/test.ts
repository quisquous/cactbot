import '../../resources/overlay_plugin_api';
import { PlayerChangedEvent } from '../../types/shadow-dom';

const elementMustNonNull = function <T>(el: T | null): T {
  // I'm not sure if this is a good idea.
  if (el === null)
    throw new Error('please Reload this Overlay');
  return el;
};

addOverlayListener('ChangeZone', (e) => {
  document.getElementById('currentZone').innerText = `currentZone: ${e.zoneName} (${e.zoneID})`;
});

addOverlayListener('onInCombatChangedEvent', (e) => {
  document.getElementById('inCombat').innerText = 'inCombat: act: ' + (e.detail.inACTCombat ? 'yes' : 'no') + ' game: ' + (e.detail.inGameCombat ? 'yes' : 'no');
});

addOverlayListener('onPlayerChangedEvent', (e: PlayerChangedEvent) => {
  elementMustNonNull(document.getElementById('hp')).innerText = e.detail.currentHP + '/' + e.detail.maxHP + ' (' + e.detail.currentShield + ')';
  document.getElementById('mp').innerText = e.detail.currentMP + '/' + e.detail.maxMP;
  document.getElementById('cp').innerText = e.detail.currentCP + '/' + e.detail.maxCP;
  document.getElementById('gp').innerText = e.detail.currentGP + '/' + e.detail.maxGP;
  document.getElementById('job').innerText = e.detail.level + ' ' + e.detail.job;
  document.getElementById('debug').innerText = e.detail.debugJob;

  const jobInfoEl = elementMustNonNull(document.getElementById('jobinfo'));
  if (e.detail.job === 'RDM')
    jobInfoEl.innerText = `${e.detail.jobDetail.whiteMana} | ${e.detail.jobDetail.blackMana}`;
  else if (e.detail.job === 'WAR')
    jobInfoEl.innerText = e.detail.jobDetail.beast.toString();
  else if (e.detail.job === 'DRK')
    jobInfoEl.innerText = `${e.detail.jobDetail.blood} | ${e.detail.jobDetail.darksideMilliseconds} | ${e.detail.jobDetail.darkArts} | ${e.detail.jobDetail.livingShadowMilliseconds}`;
  else if (e.detail.job === 'GNB')
    jobInfoEl.innerText = `${e.detail.jobDetail.cartridges} ${e.detail.jobDetail.continuationState}`;
  else if (e.detail.job === 'PLD')
    jobInfoEl.innerText = e.detail.jobDetail.oath.toString();
  else if (e.detail.job === 'BRD')
    jobInfoEl.innerText = `${e.detail.jobDetail.songName} | ${e.detail.jobDetail.songProcs} | ${e.detail.jobDetail.soulGauge} | ${e.detail.jobDetail.songMilliseconds}`;
  // todo: done above
  else if (e.detail.job === 'DNC')
    jobInfoEl.innerText = e.detail.jobDetail.feathers + ' | ' + e.detail.jobDetail.esprit + ' | (' + e.detail.jobDetail.steps + ') | ' + e.detail.jobDetail.currentStep;
  else if (e.detail.job === 'NIN')
    jobInfoEl.innerText = e.detail.jobDetail.hutonMilliseconds + ' | ' + e.detail.jobDetail.ninkiAmount;
  else if (e.detail.job === 'DRG')
    jobInfoEl.innerText = e.detail.jobDetail.bloodMilliseconds + ' | ' + e.detail.jobDetail.lifeMilliseconds + ' | ' + e.detail.jobDetail.eyesAmount;
  else if (e.detail.job === 'BLM')
    jobInfoEl.innerText = e.detail.jobDetail.umbralStacks + ' (' + e.detail.jobDetail.umbralMilliseconds + ') | ' + e.detail.jobDetail.umbralHearts + ' | ' + e.detail.jobDetail.foulCount + ' ' + e.detail.jobDetail.enochian + ' (' + e.detail.jobDetail.nextPolyglotMilliseconds + ')';
  else if (e.detail.job === 'THM')
    jobInfoEl.innerText = e.detail.jobDetail.umbralStacks + ' (' + e.detail.jobDetail.umbralMilliseconds + ')';
  else if (e.detail.job === 'WHM')
    jobInfoEl.innerText = e.detail.jobDetail.lilyStacks + ' (' + e.detail.jobDetail.lilyMilliseconds + ') | ' + e.detail.jobDetail.bloodlilyStacks;
  else if (e.detail.job === 'SMN')
    jobInfoEl.innerText = e.detail.jobDetail.aetherflowStacks + ' | ' + e.detail.jobDetail.dreadwyrmStacks + ' | ' + e.detail.jobDetail.bahamutStance + ' | ' + e.detail.jobDetail.bahamutSummoned + ' ( ' + e.detail.jobDetail.stanceMilliseconds + ') | ' + e.detail.jobDetail.phoenixReady;
  else if (e.detail.job === 'SCH')
    jobInfoEl.innerText = e.detail.jobDetail.aetherflowStacks + ' | ' + e.detail.jobDetail.fairyGauge + ' | ' + e.detail.jobDetail.fairyStatus + ' (' + e.detail.jobDetail.fairyMilliseconds + ')';
  else if (e.detail.job === 'ACN')
    jobInfoEl.innerText = e.detail.jobDetail.aetherflowStacks;
  else if (e.detail.job === 'AST')
    jobInfoEl.innerText = e.detail.jobDetail.heldCard + ' (' + e.detail.jobDetail.arcanums + ')';
  else if (e.detail.job === 'MNK')
    jobInfoEl.innerText = e.detail.jobDetail.lightningStacks + ' (' + e.detail.jobDetail.lightningMilliseconds + ') | ' + e.detail.jobDetail.chakraStacks + ' | ' + e.detail.jobDetail.lightningTimerFrozen;
  else if (e.detail.job === 'PGL')
    jobInfoEl.innerText = e.detail.jobDetail.lightningStacks + ' (' + e.detail.jobDetail.lightningMilliseconds + ')';
  else if (e.detail.job === 'MCH')
    jobInfoEl.innerText = e.detail.jobDetail.heat + ' (' + e.detail.jobDetail.overheatMilliseconds + ') | ' + e.detail.jobDetail.battery + ' (' + e.detail.jobDetail.batteryMilliseconds + ') | last: ' + e.detail.jobDetail.lastBatteryAmount + ' | ' + e.detail.jobDetail.overheatActive + ' | ' + e.detail.jobDetail.robotActive;
  else if (e.detail.job === 'SAM')
    jobInfoEl.innerText = e.detail.jobDetail.kenki + ' | ' + e.detail.jobDetail.meditationStacks + '(' + e.detail.jobDetail.setsu + ',' + e.detail.jobDetail.getsu + ',' + e.detail.jobDetail.ka + ')';
  else
    jobInfoEl.innerText = '';

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

addOverlayListener('onGameExistsEvent', () => {
  // console.log("Game exists: " + e.detail.exists);
});

addOverlayListener('onGameActiveChangedEvent', () => {
  // console.log("Game active: " + e.detail.active);
});

addOverlayListener('onLogEvent', (e) => {
  e.detail.logs.forEach((item) => {
    // Match "/echo tts:<stuff>"
    const r = /00:0038:tts:(.*)/.exec(item);
    if (r) {
      callOverlayHandler({
        call: 'cactbotSay',
        text: r[1] as string,
      });
    }
  });
});

addOverlayListener('onUserFileChanged', (e) => {
  console.log(`User file ${e.file} changed!`);
});

addOverlayListener('FileChanged', (e) => {
  console.log(`File ${e.file} changed!`);
});

callOverlayHandler({ call: 'cactbotRequestState' });
