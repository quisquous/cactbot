(function() {
  // Exit early if running within Node
  if (typeof location === 'undefined')
    return;

  const wsUrl = /[\?&]OVERLAY_WS=([^&]+)/.exec(location.href);
  let ws = null;
  let queue = [];
  let rseqCounter = 0;
  const responsePromises = {};
  const subscribers = {};
  let sendMessage = null;

  if (wsUrl) {
    sendMessage = (msg) => {
      if (queue)
        queue.push(msg);
      else
        ws.send(JSON.stringify(msg));
    };

    const connectWs = function() {
      ws = new WebSocket(wsUrl[1]);

      ws.addEventListener('error', (e) => {
        console.error(e);
      });

      ws.addEventListener('open', () => {
        console.log('Connected!');

        const q = queue;
        queue = null;

        sendMessage({
          call: 'subscribe',
          events: Object.keys(subscribers),
        });

        for (const msg of q)
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

    const waitForApi = function() {
      if (!window.OverlayPluginApi || !window.OverlayPluginApi.ready) {
        setTimeout(waitForApi, 300);
        return;
      }

      const q = queue;
      queue = null;

      window.__OverlayCallback = processEvent;

      sendMessage({
        call: 'subscribe',
        events: Object.keys(subscribers),
      }, null);

      for (const [msg, resolve] of q)
        sendMessage(msg, resolve);
    };

    waitForApi();
  }

  function processEvent(msg) {
    if (subscribers[msg.type]) {
      for (const sub of subscribers[msg.type])
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
      const list = subscribers[event];
      const pos = list.indexOf(cb);

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
          resolve(data === null ? null : JSON.parse(data));
        });
      });
    }

    return p;
  };
})();
