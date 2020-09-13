'use strict';

const kTankJobs = ['GLA', 'PLD', 'MRD', 'WAR', 'DRK', 'GNB'];
const kHealerJobs = ['CNJ', 'WHM', 'SCH', 'AST'];
const kMeleeDpsJobs = ['PGL', 'MNK', 'LNC', 'DRG', 'ROG', 'NIN', 'SAM'];
const kRangedDpsJobs = ['ARC', 'BRD', 'DNC', 'MCH'];
const kCasterDpsJobs = ['BLU', 'RDM', 'BLM', 'SMN', 'ACN', 'THM'];
const kDpsJobs = [...kMeleeDpsJobs, ...kRangedDpsJobs, ...kCasterDpsJobs];
const kCraftingJobs = ['CRP', 'BSM', 'ARM', 'GSM', 'LTW', 'WVR', 'ALC', 'CUL'];
const kGatheringJobs = ['MIN', 'BTN', 'FSH'];

const kStunJobs = ['BLU', ...kTankJobs, ...kMeleeDpsJobs];
const kSilenceJobs = ['BLU', ...kTankJobs, ...kRangedDpsJobs];
const kSleepJobs = ['BLM', 'BLU', ...kHealerJobs];
const kFeintJobs = [...kMeleeDpsJobs];
const kAddleJobs = [...kCasterDpsJobs];
const kCleanseJobs = ['BLU', 'BRD', ...kHealerJobs];
const kAllRoles = ['tank', 'healer', 'dps', 'crafter', 'gatherer', 'none'];

const kJobEnumToName = {
  0: 'NONE',
  1: 'GLA',
  2: 'PGL',
  3: 'MRD',
  4: 'LNC',
  5: 'ARC',
  6: 'CNJ',
  7: 'THM',
  8: 'CRP',
  9: 'BSM',
  10: 'ARM',
  11: 'GSM',
  12: 'LTW',
  13: 'WVR',
  14: 'ALC',
  15: 'CUL',
  16: 'MIN',
  17: 'BTN',
  18: 'FSH',
  19: 'PLD',
  20: 'MNK',
  21: 'WAR',
  22: 'DRG',
  23: 'BRD',
  24: 'WHM',
  25: 'BLM',
  26: 'ACN',
  27: 'SMN',
  28: 'SCH',
  29: 'ROG',
  30: 'NIN',
  31: 'MCH',
  32: 'DRK',
  33: 'AST',
  34: 'SAM',
  35: 'RDM',
  36: 'BLU',
  37: 'GNB',
  38: 'DNC',
};

const jobToRoleMap = (() => {
  const addToMap = (map, keys, value) => keys.forEach((key) => map.set(key, value));

  const map = new Map([['NONE', 'none']]);
  addToMap(map, kTankJobs, 'tank');
  addToMap(map, kHealerJobs, 'healer');
  addToMap(map, kDpsJobs, 'dps');
  addToMap(map, kCraftingJobs, 'crafter');
  addToMap(map, kGatheringJobs, 'gatherer');

  return new Proxy(map, {
    get: function(target, element) {
      if (target.has(element))
        return target.get(element);
      console.log(`Unknown job role ${element}`);
      return '';
    },
  });
})();

const Util = {
  jobEnumToJob: (id) => kJobEnumToName[id],
  jobToJobEnum: (job) => Object.keys(kJobEnumToName).find((k) => kJobEnumToName[k] === job),
  jobToRole: (job) => jobToRoleMap[job],
  isTankJob: (job) => kTankJobs.includes(job),
  isHealerJob: (job) => kHealerJobs.includes(job),
  isMeleeDpsJob: (job) => kMeleeDpsJobs.includes(job),
  isRangedDpsJob: (job) => kRangedDpsJobs.includes(job),
  isCasterDpsJob: (job) => kCasterDpsJobs.includes(job),
  isDpsJob: (job) => kDpsJobs.includes(job),
  isCraftingJob: (job) => kCraftingJobs.includes(job),
  isGatheringJob: (job) => kGatheringJobs.includes(job),
  canStun: (job) => kStunJobs.includes(job),
  canSilence: (job) => kSilenceJobs.includes(job),
  canSleep: (job) => kSleepJobs.includes(job),
  canCleanse: (job) => kCleanseJobs.includes(job),
  canFeint: (job) => kFeintJobs.includes(job),
  canAddle: (job) => kAddleJobs.includes(job),
};

(function() {
  // Exit early if running within Node
  if (typeof location === 'undefined')
    return;

  let wsUrl = /[\?&]OVERLAY_WS=([^&]+)/.exec(location.href);
  let ws = null;
  let queue = [];
  let rseqCounter = 0;
  let responsePromises = {};
  let subscribers = {};
  let sendMessage = null;

  if (wsUrl) {
    sendMessage = (msg) => {
      if (queue)
        queue.push(msg);
      else
        ws.send(JSON.stringify(msg));
    };

    let connectWs = function() {
      ws = new WebSocket(wsUrl[1]);

      ws.addEventListener('error', (e) => {
        console.error(e);
      });

      ws.addEventListener('open', () => {
        console.log('Connected!');

        let q = queue;
        queue = null;

        sendMessage({
          call: 'subscribe',
          events: Object.keys(subscribers),
        });

        for (let msg of q)
          sendMessage(msg);
      });

      ws.addEventListener('message', (msg) => {
        try {
          msg = JSON.parse(msg.data);
        } catch (e) {
          console.error('Invalid message received: ', msg);
          return;
        }

        if (msg.rseq !== undefined && responsePromises[msg.rseq]) {
          responsePromises[msg.rseq](msg);
          delete responsePromises[msg.rseq];
        } else {
          processEvent(msg);
        }
      });

      ws.addEventListener('close', () => {
        queue = [];

        console.log('Trying to reconnect...');
        // Don't spam the server with retries.
        setTimeout(() => {
          connectWs();
        }, 300);
      });
    };

    connectWs();
  } else {
    sendMessage = (obj, cb) => {
      if (queue)
        queue.push([obj, cb]);
      else
        OverlayPluginApi.callHandler(JSON.stringify(obj), cb);
    };

    let waitForApi = function() {
      if (!window.OverlayPluginApi || !window.OverlayPluginApi.ready) {
        setTimeout(waitForApi, 300);
        return;
      }

      let q = queue;
      queue = null;

      window.__OverlayCallback = processEvent;

      sendMessage({
        call: 'subscribe',
        events: Object.keys(subscribers),
      }, null);

      for (let [msg, resolve] of q)
        sendMessage(msg, resolve);
    };

    waitForApi();
  }

  function processEvent(msg) {
    if (subscribers[msg.type]) {
      for (let sub of subscribers[msg.type])
        sub(msg);
    }
  }

  window.dispatchOverlayEvent = processEvent;

  window.addOverlayListener = (event, cb) => {
    if (!subscribers[event]) {
      subscribers[event] = [];

      if (!queue) {
        sendMessage({
          call: 'subscribe',
          events: [event],
        });
      }
    }

    subscribers[event].push(cb);
  };

  window.removeOverlayListener = (event, cb) => {
    if (subscribers[event]) {
      let list = subscribers[event];
      let pos = list.indexOf(cb);

      if (pos > -1) list.splice(pos, 1);
    }
  };

  window.callOverlayHandler = (msg) => {
    let p;

    if (ws) {
      msg.rseq = rseqCounter++;
      p = new Promise((resolve, reject) => {
        responsePromises[msg.rseq] = resolve;
      });

      sendMessage(msg);
    } else {
      p = new Promise((resolve) => {
        sendMessage(msg, (data) => {
          resolve(data == null ? null : JSON.parse(data));
        });
      });
    }

    return p;
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    util: Util,
  };
}
