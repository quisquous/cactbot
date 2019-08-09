(function () {
    let wsUrl = /[\?&]OVERLAY_WS=([^&]+)/.exec(location.href);
    let ws = null;
    let queue = [];
    let rseqCounter = 0;
    let responsePromises = {};
    let subscribers = {};

    if (wsUrl) {
        function connectWs() {
            ws = new WebSocket(wsUrl[1]);
            ws.addEventListener('error', (e) => {
                console.error(e);
            });

            ws.addEventListener('open', () => {
                console.log('Connected!');

                ws.send(JSON.stringify({
                    call: 'subscribe',
                    events: Object.keys(subscribers),
                }));

                for (let msg of queue) {
                    ws.send(JSON.stringify(msg));
                }

                queue = null;
            });

            ws.addEventListener('message', (msg) => {
                try {
                    msg = JSON.parse(msg.data);
                } catch(e) {
                    console.error('Invalid message received: ', msg);
                    return;
                }

                if (msg.rseq && responsePromises[msg.rseq]) {
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
        }

        connectWs();
    } else {
        document.addEventListener('OverlayEvent', (e) => {
            processEvent(e.detail);
        });

        function waitForApi() {
            if (!window.OverlayPluginApi) {
                setTimeout(waitForApi, 300);
                return;
            }

            let q = queue;
            queue = null;

            for (let [msg, resolve] of q) {
                resolve(OverlayPluginApi.callHandler(msg));
            }
        }

        waitForApi();
    }

    function processEvent(msg) {
        if (subscribers[msg.type]) {
            for (let sub of subscribers[msg.type]) {
                sub(msg);
            }
        } else {
            console.warn(`Received event ${msg.type} even though we're not subscribed!`);
        }
    }

    function sendMessage(msg) {
        if (ws) {
            if (queue) {
                queue.push(msg);
            } else {
                ws.send(JSON.stringify(msg));
            }
        } else {
            if (queue) {
                let myResolve;
                let p = new Promise((resolve) => myResolve = resolve);
                queue.push([msg, myResolve]);
                return p;
            } else {
                return OverlayPluginApi.callHandler(JSON.stringify(msg));
            }
        }
    }

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

    window.callOverlayHandler = (data) => {
        if (ws) {
            msg.rseq = rseqCounter++;
            let p = new Promise((resolve, reject) => {
                responsePromises[msg.rseq] = resolve;
            });

            sendMessage(msg);
            return p;
        } else {
            return sendMessage(msg);
        }
    };

    let realAddListener = document.addEventListener;
    document.addEventListener = (name, cb) => {
        if (name.substring(0, 2) !== 'on') {
            return realAddListener(name, cb);
        } else {
            return addOverlayListener(name, cb);
        }
    };
})();
