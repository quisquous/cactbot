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
let gInCombat = false;

function InitDpsModule(config, updateFunc, hideFunc) {
  UserConfig.getUserConfigLocation(config, function(e) {
    addOverlayListener('CombatData', function(e) {
      // DPS numbers in large pvp is not useful and hella noisy.
      if (gIgnoreCurrentZone || gIgnoreCurrentJob)
        return;

      // When ACT stops, stop updating.  This is mostly to avoid
      // a spurious update when changing zones which will unhide
      // the dps overlay.
      if (!gInCombat)
        return;

      // Don't bother showing the first "Infinity" dps right as
      // combat starts.
      let dps = parseFloat(e.Encounter.encdps);
      if (dps <= 0 || dps === Infinity)
        return;

      updateFunc({ detail: e });
    });

    addOverlayListener('onZoneChangedEvent', function(e) {
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

    addOverlayListener('onInCombatChangedEvent', function(e) {
      gInCombat = e.detail.inACTCombat;
    });

    addOverlayListener('onPlayerChangedEvent', function(e) {
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

    gIgnoreZones = Options.IgnoreZones.map(function(z) {
      return gLang.kZone[z];
    });
  });
}
