var i = 0;

var fakeRotation = {
    bossName: "Angry Bees",
    zone: "Xanadu",
    enrageSeconds: 720,
    triggerPhrase: "The hive will be closed off",
    phases: [
        {
            title: "Phase 1 (stinging)",
            loop: false,
            endSeconds: 15,
            rotation: [
                { name: "Poke", time: 3},
                { name: "Prod", time: 5},
                { name: "Slam", time: 8},
                { name: "Poke", time: 10},
                { name: "Prod", time: 12},
            ],
        },
        {
            title: "Phase 2 (angry buzzing)",
            loop: true,
            loopSeconds: 10,
            endHp: { "Angry Bees": "61%" },
            rotation: [
                { name: "Buzz", time: 0.5},
                { name: "Fizz", time: 4},
                { name: "Buzzzzzzzz", time: 5},
                { name: "Blink About", time: 8},
            ],
        },
        {
            title: "Phase 3 (enrage)",
            loop: true,
            loopSeconds: 5,
            // TODO: for hp-based transitions, probably need a calibrating log
            rotation: [
                { name: "BEES", time: 0 },
                { name: "BEES!!!", time: 4 }
            ],
        },
    ],
};

var RotationManager = function(phaseCallback) {
    this.rotations = [];
    this.phaseCallback = phaseCallback;

    this.currentRotation = null;
    this.currentPhase = null;
    this.currentPhaseStartTime = null;
};

RotationManager.prototype.register = function(rotation) {
    this.rotations.push(rotation);
};

RotationManager.prototype.startRotation = function(rotation) {
    this.currentRotation = rotation;
    this.startPhase(0, new Date());
}

RotationManager.prototype.startPhase = function(phaseNumber, currentTime) {
    if (this.currentPhase === phaseNumber)
        return;
    this.currentPhase = phaseNumber;
    this.currentPhaseStartTime = currentTime;
}

RotationManager.prototype.tick = function(currentTime) {
    function addTime(date, seconds) {
        return new Date(date.getTime() + seconds * 1000);
    }

    // Is rotation still valid
    // Is current phase still happening
    // tick current phase

    var rotation = [];
    var phase = this.currentRotation.phases[this.currentPhase];
    var seconds = (currentTime.getTime() - this.currentPhaseStartTime.getTime()) / 1000;
    if (phase.loop) {
        seconds = seconds % phase.loopSeconds;
    }
    for (var startIdx = 0; startIdx < phase.rotation.length; ++startIdx) {
        var item = phase.rotation[startIdx];
        // Start back 1, so it hangs around on screen for a second.
        if (item.time > seconds - 1)
            break;
    }
    // assert startIdx is valid here
    var adjustedItem;
    for (var i = startIdx; i < phase.rotation.length; ++i) {
        adjustedItem = {
            name: phase.rotation[i].name,
            time: addTime(this.currentPhaseStartTime, phase.rotation[i].time),
        };
        rotation.push(adjustedItem);
    }

    if (phase.loop) {
        var nextLoop = addTime(this.currentPhaseStartTime, phase.loopSeconds);
        for (var i = 0; i < startIdx; ++i) {
            adjustedItem = {
                name: phase.rotation[i].name,
                time: addTime(nextLoop, phase.rotation[i].time),
            };
            rotation.push(adjustedItem);
        }
    }

    this.phaseCallback(rotation);
}

RotationManager.prototype.processLogLine = function(logLine) {
}

function updatePhase(phase) {
    var currentTime = new Date();

    var rotationDiv = document.getElementById("rotation");
    rotationDiv.innerHTML = "";

    // Limit by height? Or by count?
    for (var i = 0; i < phase.length; ++i) {
        var rotItem = document.createElement("div");
        rotItem.className = "rotitem";

        var moveItem = document.createElement("div");
        moveItem.className = "move";
        moveItem.innerText = phase[i].name;
        rotItem.appendChild(moveItem);

        var countdownItem = document.createElement("div");
        countdownItem.className = "countdown";
        var total = (phase[i].time.getTime() - currentTime.getTime()) / 1000;
        total = Math.max(0, total);
        var minutes = Math.floor(total / 60 + 0.5);
        var seconds = Math.floor(total % 60);
        var tenthseconds = Math.floor((10 * (total % 60)) % 10);
        countdownItem.innerText = "";
        if (minutes > 0)
            countdownItem.innerText += minutes + "m";
        countdownItem.innerText += seconds + "." + tenthseconds + "s";

        rotItem.appendChild(countdownItem);

        rotationDiv.appendChild(rotItem);
    }
}

var rotationManager = new RotationManager(updatePhase);
function testingInit() {
    rotationManager.register(fakeRotation);
    rotationManager.startRotation(fakeRotation);
}
testingInit();

function rafLoop() {
    if (!window.act) {
        window.requestAnimationFrame(rafLoop);
        return;
    }

    var temp = document.getElementById("nextphasecond");
    temp.innerText = window.act.currentZone() + i++;

    var currentTime = new Date();

    rotationManager.tick(currentTime);

    if (i < 800)
    window.requestAnimationFrame(rafLoop);

}

window.requestAnimationFrame(rafLoop);
