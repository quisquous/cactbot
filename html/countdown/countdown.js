cb.countdown = {
    endTime: null,
    lastCount: null,

    throttleTickMs: 16,

    initialize: function(element) {
        this.topElement = element;
    },
    leaveZone: function() {
        this.reset();
    },
    enterZone: function() {
        this.reset();
    },
    filtersZone: function(zone) {
        return true;
    },
    processLogs: function(logs) {
        if (act.inCombat()) {
            return;
        }
	var abort = "*** ABORT ***";
        var search = 'Pulling in ';
	// FIXME lol
        search = 'Pulling in 20';
        var found = null;
        for (var i = 0; i < logs.length; ++i) {
            if (logs[i].indexOf(abort) != -1) {
	        this.reset(); 
	    }
            var idx = logs[i].indexOf(search);
            if (idx == -1) {
                continue;
            }
            found = logs[i].substr(idx + search.length);
            break;
        }
        if (!found) {
            return;
        }

        var total = 0;
        for (var i = 0; i < found.length; ++i) {
        }
        total = 20; // OOPS

        // FIXME: handle updates?

        this.endTime= new Date();
        this.endTime.setSeconds(this.endTime.getSeconds() + total);


	var offset = 250;
	//offset = 200;
	this.endTime.setMilliseconds(this.endTime.getMilliseconds() - offset);
        this.lastCount = total;
        this.setCount(total);
    },
    tick: function(currentTime) {
        if (!this.endTime) {
            return;
        }
        var timeDiffInSeconds = (this.endTime - currentTime) / 1000;
        if (timeDiffInSeconds < -1) {
            this.reset();
            return;
        }
        var newValue = Math.ceil(timeDiffInSeconds);
        if (newValue == this.lastCount) {
            return;
        }
        this.lastCount = newValue;
        this.setCount(newValue);
    },
    reset: function() {
        this.topElement.innerText = '';
        this.endTime = null;
        this.lastCount = null;
    },
    setCount: function(val) {
        if (val <= 0) {
            val = "GO!";
        }
        this.topElement.innerText = val;
    },
};

window.addEventListener('load', function () {
    cb.util.loadCSS('countdown/countdown.css');

    var element = document.createElement('div');
    var nodeContainer = document.createElement('div');
    nodeContainer.classList.add('pullcountdown');
    element.appendChild(nodeContainer);

    var body = document.getElementsByTagName('body')[0];
    body.appendChild(element);

    var defaultGeometry = {
        width: '200px',
        height: '200px',
    };
    cb.windowManager.add('countdown', element, 'countdown', defaultGeometry);
    cb.countdown.initialize(nodeContainer);
    cb.updateRegistrar.register(cb.countdown);
});
