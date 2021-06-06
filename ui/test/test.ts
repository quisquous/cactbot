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
    const jobDetail = e.detail.jobDetail;
    if (e.detail.job === 'RDM')
      jobInfo.innerText = `${jobDetail.whiteMana} | ${jobDetail.blackMana}`;
    else if (e.detail.job === 'WAR')
      jobInfo.innerText = jobDetail.beast.toString();
    else if (e.detail.job === 'DRK')
      jobInfo.innerText = `${jobDetail.blood} | ${jobDetail.darksideMilliseconds} | ${jobDetail.darkArts.toString()} | ${jobDetail.livingShadowMilliseconds}`;
    else if (e.detail.job === 'GNB')
      jobInfo.innerText = `${jobDetail.cartridges}${jobDetail.continuationState}`;
    else if (e.detail.job === 'PLD')
      jobInfo.innerText = jobDetail.oath.toString();
    else if (e.detail.job === 'BRD')
      jobInfo.innerText = `${jobDetail.songName} | ${jobDetail.songProcs} | ${jobDetail.soulGauge} | ${jobDetail.songMilliseconds}`;
    else if (e.detail.job === 'DNC')
      jobInfo.innerText = `${jobDetail.feathers} | ${jobDetail.esprit} | (${jobDetail.steps}) | ${jobDetail.currentStep}`;
    else if (e.detail.job === 'NIN')
      jobInfo.innerText = `${jobDetail.hutonMilliseconds} | ${jobDetail.ninkiAmount}`;
    else if (e.detail.job === 'DRG')
      jobInfo.innerText = `${jobDetail.bloodMilliseconds} | ${jobDetail.lifeMilliseconds} | ${jobDetail.eyesAmount}`;
    else if (e.detail.job === 'BLM')
      jobInfo.innerText = `${jobDetail.umbralStacks} (${jobDetail.umbralMilliseconds}) | ${jobDetail.umbralHearts} | ${jobDetail.foulCount} ${jobDetail.enochian.toString()} (${jobDetail.nextPolyglotMilliseconds})`;
    else if (e.detail.job === 'THM')
      jobInfo.innerText = `${jobDetail.umbralStacks} (${jobDetail.umbralMilliseconds})`;
    else if (e.detail.job === 'WHM')
      jobInfo.innerText = `${jobDetail.lilyStacks} (${jobDetail.lilyMilliseconds}) | ${jobDetail.bloodlilyStacks}`;
    else if (e.detail.job === 'SMN')
      jobInfo.innerText = `${jobDetail.aetherflowStacks} | ${jobDetail.dreadwyrmStacks} | ${jobDetail.bahamutStance} | ${jobDetail.bahamutSummoned} (${jobDetail.stanceMilliseconds}) | ${jobDetail.phoenixReady}`;
    else if (e.detail.job === 'SCH')
      jobInfo.innerText = `${jobDetail.aetherflowStacks} | ${jobDetail.fairyGauge} | ${jobDetail.fairyStatus} (${jobDetail.fairyMilliseconds})`;
    else if (e.detail.job === 'ACN')
      jobInfo.innerText = jobDetail.aetherflowStacks.toString();
    else if (e.detail.job === 'AST')
      jobInfo.innerText = `${jobDetail.heldCard} (${jobDetail.arcanums})`;
    else if (e.detail.job === 'MNK')
      jobInfo.innerText = `${jobDetail.lightningStacks} (${jobDetail.lightningMilliseconds}) | ${jobDetail.chakraStacks} | ${jobDetail.lightningTimerFrozen.toString()}`;
    else if (e.detail.job === 'PGL')
      jobInfo.innerText = `${jobDetail.lightningStacks} (${jobDetail.lightningMilliseconds})`;
    else if (e.detail.job === 'MCH')
      jobInfo.innerText = `${jobDetail.heat} (${jobDetail.overheatMilliseconds}) | ${jobDetail.battery} (${jobDetail.batteryMilliseconds}) | last: ${jobDetail.lastBatteryAmount} | ${jobDetail.overheatActive.toString()} | ${jobDetail.robotActive.toString()}`;
    else if (e.detail.job === 'SAM')
      jobInfo.innerText = `${jobDetail.kenki} | ${jobDetail.meditationStacks}(${jobDetail.setsu.toString()},${jobDetail.getsu.toString()},${jobDetail.ka.toString()})`;
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
