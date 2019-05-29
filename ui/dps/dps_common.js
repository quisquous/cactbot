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

let gCurrentZone = null;
let gIgnoreDps = false;
let gIgnoreZones = [];

function InitDpsModule(config, updateFunc, hideFunc) {
  document.addEventListener('onOverlayDataUpdate', function(e) {
    // DPS numbers in large pvp is not useful and hella noisy.
    if (gIgnoreDps)
      return;
    updateFunc(e);
  });

  document.addEventListener('onZoneChangedEvent', function(e) {
    gCurrentZone = e.originalEvent.detail.zoneName;
    gIgnoreDps = false;
    for (let i = 0; i < gIgnoreZones.length; ++i) {
      if (gCurrentZone.match(gIgnoreZones[i]))
        gIgnoreDps = true;
    }
    hideFunc();
  });

  UserConfig.getUserConfigLocation(config, function(e) {
    gIgnoreZones = Options.IgnoreZones.map(function(z) {
      return gLang.kZone[z];
    });
  });
}
