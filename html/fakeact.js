FakeACT = function () {
};

FakeACT.prototype.currentZone = function () {
    return window.fakeact["zone"];
};

FakeACT.prototype.inCombat = function () {
    return window.fakeact["incombat"];
};

FakeACT.prototype.textToSpeech = function () {};

FakeACT.prototype.numCombatants = function () {
    return window.fakeact["combatants"].length;
};

FakeACT.prototype.getCombatant = function (idx) {
    return window.fakeact["combatants"][idx];
};

FakeACT.prototype.updateCombatants = function () { }

FakeACT.prototype.getPlayer = function () {
    if (window.fakeact.combatants.length === 0) {
        return makeCombatant("The Player");
    } else {
        return window.fakeact.combatants[0];
    }
}

FakeACT.prototype.getMobByName = function (name) {
    var found = null;
    for (var i = 0; i < window.fakeact["combatants"].length; ++i) {
        if (window.fakeact["combatants"][i].name !== name) {
            continue;
        }
        if (found != null) {
            return null;
        }
        found = window.fakeact["combatants"][i];
    }
    return found;
}

FakeACT.prototype.hasLogLines = function () {
    return window.fakeact["logs"].length;
}

FakeACT.prototype.nextLogLine = function () {
    return window.fakeact["logs"].shift();
}

// FIXME: move each fake testing function into the rotation that provides it
FakeACT.prototype.testEinhander = function () {
    window.fakeact = {
        zone: "The Keeper Of The Lake",
        incombat: true,
        combatants: [makeCombatant("Einhander")],
        logs: ["The agrius will be sealed off in"]
    };
};

FakeACT.prototype.testTurn10 = function () {
    window.fakeact = {
        zone: "The Final Coil Of Bahamut - Turn (1)",
        incombat: true,
        combatants: [makeCombatant("Imdugud")],
        logs: ["The Alpha Concourse will be sealed off in"]
    };
};

FakeACT.prototype.testTurn13 = function () {
    window.fakeact = {
        zone: "The Final Coil Of Bahamut - Turn (4)",
        incombat: true,
        combatants: [makeCombatant("Bahamut Prime")],
        logs: ["Bahamut Prime uses Flare Breath"]
    };
};

FakeACT.prototype.testRavana = function () {
    window.fakeact = {
        zone: "Thok Ast Thok (extreme)",
        incombat: true,
        combatants: [makeCombatant("Ravana")],
        logs: ["Dance to the song of ringing steel"]
    };
};

FakeACT.prototype.testBees = function () {
    window.fakeact = {
        zone: "Xanadu",
        incombat: true,
        combatants: [makeCombatant("Angry Bees")],
        logs: ["The hive will be sealed off in"]
    };
};

FakeACT.prototype.testA1Savage = function () {
    window.fakeact = {
        zone: "Alexander - The Fist of the Father (Savage)",
        incombat: true,
        combatants: [makeCombatant("The Player"), makeCombatant("Oppressor")],
        logs: ["Hangar 8 will be sealed off in"]
    };
};

FakeACT.prototype.testHunt = function () {
    var the_player = makeCombatant("The Player");
    the_player.posX = 50;
    the_player.posY = -20;
    var alteci = makeCombatant("Alteci");
    alteci.posZ = 50;
    var kaiser = makeCombatant("Kaiser Behemoth");
    kaiser.posY = 30;
    var mirka = makeCombatant("Mirka");
    mirka.posX = 40;
    mirka.posY = -10;
    window.fakeact = {
        zone: "Coerthas Western Highlands",
        incombat: true,
        combatants: [the_player, alteci, kaiser, mirka],
        logs: [],
    };
};

if (!window.act) {
    var combatantId = 0;
    function makeCombatant(name) {
        return {
            iD: combatantId++,
            ownerId: 0,
            type: 0,
            job: 0,
            level: 0,
            name: name,
            currentHP: 100,
            maxHP: 100,
            currentMP: 0,
            maxMP: 0,
            currentTP: 0,
            maxTP: 0,
            posX: 0,
            posY: 0,
            posZ: 0,
        };
    }

    window.fakeact = {};
    window.fakeact["zone"] = "Xanadu";
    window.fakeact["incombat"] = false;
    window.fakeact["combatants"] = [makeCombatant("Angry Bees")];
    window.fakeact["logs"] = [];

    window.act = new FakeACT();

    // FIXME: fake act should come first so that no code anywhere attempts to
    // read from the plugin when it's not there, but that also means that
    // debugging logic isn't there yet.
    window.addEventListener("load", function () {
        cactbot.debug('Using fake act');
    });
}
