import { addOverlayListener } from '../../resources/overlay_plugin_api';

import ContentType from '../../resources/content_type';
import Util from '../../resources/util';
import ZoneInfo from '../../resources/zone_info';

export const defaultOptions = {
  Language: 'en',
  IgnoreContentTypes: [
    ContentType.Pvp,
    ContentType.Eureka,
  ],
};

let gIgnoreCurrentZone = false;
let gIgnoreCurrentJob = false;
let gCurrentJob = null;
let gCurrentZone = null;
let gInCombat = false;

export const InitDpsModule = function(options, updateFunc, hideFunc) {
  addOverlayListener('CombatData', (e) => {
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
    const dps = parseFloat(e.Encounter.encdps);
    if (dps <= 0 || dps === Infinity)
      return;

    updateFunc({ detail: e });
  });

  addOverlayListener('ChangeZone', (e) => {
    const newZone = e.zoneName;
    if (gCurrentZone === newZone)
      return;
    // Always hide on switching zones.
    hideFunc();
    gCurrentZone = newZone;

    const zoneInfo = ZoneInfo[e.zoneID];
    const contentType = zoneInfo ? zoneInfo.contentType : 0;
    gIgnoreCurrentZone = options.IgnoreContentTypes.includes(contentType);
  });

  addOverlayListener('onInCombatChangedEvent', (e) => {
    gInCombat = e.detail.inACTCombat;
  });

  addOverlayListener('onPlayerChangedEvent', (e) => {
    const job = e.detail.job;
    if (job === gCurrentJob)
      return;
    gCurrentJob = job;
    if (Util.isCombatJob(job)) {
      gIgnoreCurrentJob = false;
      return;
    }
    gIgnoreCurrentJob = true;
    hideFunc();
  });
};
