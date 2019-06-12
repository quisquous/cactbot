'use strict';

let Options = {
  Language: 'en',
  IgnoreZones: [
    'PvpSeize',
    'PvpSecure',
    'PvpShatter',
    'EurekaAnemos',
    'EurekaPagos',
    'EurekaPyros',
    'EurekaHydatos',
  ],
};

let gIgnoreCurrentZone = false;
let gIgnoreCurrentJob = false;
let gCurrentJob = null;
let gCurrentZone = null;
let gIgnoreZones = [];

function InitDpsModule(config, updateFunc, hideFunc) {
  document.addEventListener('onOverlayDataUpdate', function(e) {
    // DPS numbers in large pvp is not useful and hella noisy.
    if (gIgnoreCurrentZone || gIgnoreCurrentJob)
      return;
    updateFunc(e);
  });

  document.addEventListener('onZoneChangedEvent', function(e) {
    let newZone = e.detail.zoneName;
    if (gCurrentZone == newZone)
      return;
    // Always hide on switching zones.
    hideFunc();
    gCurrentZone = newZone;
    gIgnoreCurrentZone = false;
    for (let i = 0; i < gIgnoreZones.length; ++i) {
      if (gCurrentZone.match(gIgnoreZones[i])) {
        gIgnoreCurrentZone = true;
        return;
      }
    }
  });

  document.addEventListener('onPlayerChangedEvent', function(e) {
    let job = e.detail.job;
    if (job == gCurrentJob)
      return;
    gCurrentJob = job;
    if (kCraftingJobs.indexOf(job) < 0 && kGatheringJobs.indexOf(job) < 0) {
      gIgnoreCurrentJob = false;
      return;
    }
    gIgnoreCurrentJob = true;
    hideFunc();
  });

  UserConfig.getUserConfigLocation(config, function(e) {
    gIgnoreZones = Options.IgnoreZones.map(function(z) {
      return gLang.kZone[z];
    });
  });
}
