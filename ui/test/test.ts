import { callOverlayHandler, addOverlayListener } from '../../resources/overlay_plugin_api';

import '../../resources/defaults.css';

addOverlayListener('ChangeZone', (e) => {
  const currentZone = document.getElementById('currentZone');
  if (currentZone)
    currentZone.innerText = `currentZone: ${e.zoneName} (${e.zoneID})`;
});

addOverlayListener('onInCombatChangedEvent', (e) => {
  const inCombat = document.getElementById('inCombat');
  if (inCombat)
    inCombat.innerText = `inCombat: act: ${e.detail.inACTCombat ? 'yes' : 'no'} game: ${(e.detail.inGameCombat ? 'yes' : 'no')}`;
});

addOverlayListener('onPlayerChangedEvent', (e) => {
  const hp = document.getElementById('hp');
  if (hp)
    hp.innerText = `${e.detail.currentHP}/${e.detail.maxHP} (${e.detail.currentShield})`;
  const mp = document.getElementById('mp');
  if (mp)
    mp.innerText = `${e.detail.currentMP}/${e.detail.maxMP}`;
  const cp = document.getElementById('cp');
  if (cp)
    cp.innerText = `${e.detail.currentCP}/${e.detail.maxCP}`;
  const gp = document.getElementById('gp');
  if (gp)
    gp.innerText = `${e.detail.currentGP}/${e.detail.maxGP}`;
  const job = document.getElementById('job');
  if (job)
    job.innerText = `${e.detail.level} ${e.detail.job}`;
  const debug = document.getElementById('debug');
  if (debug)
    debug.innerText = e.detail.debugJob;

  const jobInfo = document.getElementById('jobinfo');
  if (jobInfo) {
    const detail = e.detail;
    if (detail.job === 'RDM' && detail.jobDetail)
      jobInfo.innerText = `${detail.jobDetail.whiteMana} | ${detail.jobDetail.blackMana}`;
    else if (detail.job === 'WAR' && detail.jobDetail)
      jobInfo.innerText = detail.jobDetail.beast.toString();
    else if (detail.job === 'DRK' && detail.jobDetail)
      jobInfo.innerText = `${detail.jobDetail.blood} | ${detail.jobDetail.darksideMilliseconds} | ${detail.jobDetail.darkArts.toString()} | ${detail.jobDetail.livingShadowMilliseconds}`;
    else if (detail.job === 'GNB' && detail.jobDetail)
      jobInfo.innerText = `${detail.jobDetail.cartridges}${detail.jobDetail.continuationState}`;
    else if (detail.job === 'PLD' && detail.jobDetail)
      jobInfo.innerText = detail.jobDetail.oath.toString();
    else if (detail.job === 'BRD' && detail.jobDetail)
      jobInfo.innerText = `${detail.jobDetail.songName} | ${detail.jobDetail.songProcs} | ${detail.jobDetail.soulGauge} | ${detail.jobDetail.songMilliseconds}`;
    else if (detail.job === 'DNC' && detail.jobDetail)
      jobInfo.innerText = `${detail.jobDetail.feathers} | ${detail.jobDetail.esprit} | [${detail.jobDetail.steps.join(', ')}] | ${detail.jobDetail.currentStep}`;
    else if (detail.job === 'NIN' && detail.jobDetail)
      jobInfo.innerText = `${detail.jobDetail.hutonMilliseconds} | ${detail.jobDetail.ninkiAmount}`;
    else if (detail.job === 'DRG' && detail.jobDetail)
      jobInfo.innerText = `${detail.jobDetail.bloodMilliseconds} | ${detail.jobDetail.lifeMilliseconds} | ${detail.jobDetail.eyesAmount}`;
    else if (detail.job === 'BLM' && detail.jobDetail)
      jobInfo.innerText = `${detail.jobDetail.umbralStacks} (${detail.jobDetail.umbralMilliseconds}) | ${detail.jobDetail.umbralHearts} | ${detail.jobDetail.foulCount} ${detail.jobDetail.enochian.toString()} (${detail.jobDetail.nextPolyglotMilliseconds})`;
    else if (detail.job === 'THM' && detail.jobDetail)
      jobInfo.innerText = `${detail.jobDetail.umbralStacks} (${detail.jobDetail.umbralMilliseconds})`;
    else if (detail.job === 'WHM' && detail.jobDetail)
      jobInfo.innerText = `${detail.jobDetail.lilyStacks} (${detail.jobDetail.lilyMilliseconds}) | ${detail.jobDetail.bloodlilyStacks}`;
    else if (detail.job === 'SMN' && detail.jobDetail)
      jobInfo.innerText = `${detail.jobDetail.aetherflowStacks} | ${detail.jobDetail.dreadwyrmStacks} | ${detail.jobDetail.bahamutStance} | ${detail.jobDetail.bahamutSummoned} (${detail.jobDetail.stanceMilliseconds}) | ${detail.jobDetail.phoenixReady}`;
    else if (detail.job === 'SCH' && detail.jobDetail)
      jobInfo.innerText = `${detail.jobDetail.aetherflowStacks} | ${detail.jobDetail.fairyGauge} | ${detail.jobDetail.fairyStatus} (${detail.jobDetail.fairyMilliseconds})`;
    else if (detail.job === 'ACN' && detail.jobDetail)
      jobInfo.innerText = detail.jobDetail.aetherflowStacks.toString();
    else if (detail.job === 'AST' && detail.jobDetail)
      jobInfo.innerText = `${detail.jobDetail.heldCard} [${detail.jobDetail.arcanums.join(', ')}]`;
    else if (detail.job === 'MNK' && detail.jobDetail)
      jobInfo.innerText = `${detail.jobDetail.lightningStacks} (${detail.jobDetail.lightningMilliseconds}) | ${detail.jobDetail.chakraStacks} | ${detail.jobDetail.lightningTimerFrozen.toString()}`;
    else if (detail.job === 'PGL' && detail.jobDetail)
      jobInfo.innerText = `${detail.jobDetail.lightningStacks} (${detail.jobDetail.lightningMilliseconds})`;
    else if (detail.job === 'MCH' && detail.jobDetail)
      jobInfo.innerText = `${detail.jobDetail.heat} (${detail.jobDetail.overheatMilliseconds}) | ${detail.jobDetail.battery} (${detail.jobDetail.batteryMilliseconds}) | last: ${detail.jobDetail.lastBatteryAmount} | ${detail.jobDetail.overheatActive.toString()} | ${detail.jobDetail.robotActive.toString()}`;
    else if (detail.job === 'SAM' && detail.jobDetail)
      jobInfo.innerText = `${detail.jobDetail.kenki} | ${detail.jobDetail.meditationStacks}(${detail.jobDetail.setsu.toString()},${detail.jobDetail.getsu.toString()},${detail.jobDetail.ka.toString()})`;
    else
      jobInfo.innerText = '';
  }

  const pos = document.getElementById('pos');
  if (pos)
    pos.innerText = `${e.detail.pos.x.toFixed(2)},${e.detail.pos.y.toFixed(2)},${e.detail.pos.z.toFixed(2)}`;
  const rotation = document.getElementById('rotation');
  if (rotation)
    rotation.innerText = e.detail.rotation.toString();
  const bait = document.getElementById('bait');
  if (bait)
    bait.innerText = e.detail.bait.toString();
});

addOverlayListener('EnmityTargetData', (e) => {
  const target = document.getElementById('target');
  if (target)
    target.innerText = e.Target ? e.Target.Name : '--';
  const tid = document.getElementById('tid');
  if (tid)
    tid.innerText = e.Target ? e.Target.ID.toString(16) : '';
  const tdistance = document.getElementById('tdistance');
  if (tdistance)
    tdistance.innerText = e.Target ? e.Target.Distance.toString() : '';
});

addOverlayListener('onGameExistsEvent', (_e) => {
  // console.log("Game exists: " + e.detail.exists);
});

addOverlayListener('onGameActiveChangedEvent', (_e) => {
  // console.log("Game active: " + e.detail.active);
});

addOverlayListener('onLogEvent', (e) => {
  e.detail.logs.forEach((log) => {
    // Match "/echo tts:<stuff>"
    const r = /00:0038:tts:(.*)/.exec(log);
    if (r && r[1]) {
      void callOverlayHandler({
        call: 'cactbotSay',
        text: r[1],
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

void callOverlayHandler({ call: 'cactbotRequestState' });
