cb.dpsRecorder = {
    initialize: function(iframe) {
        document.addEventListener('cactbot.dps', (function (e) {
            cb.dpsRecorder.onUpdate(e);
        }));
    },

    toCSV: function(fights) {
        // Sort fights by start time ascending.
        fights.sort(function(a, b) {
            return a.fight.startTime.getTime() - b.fight.startTime.getTime();
        });

        var combatantObj = {};
        for (var f = 0; f < fights.length; ++f) {
            for (var c in fights[f].dps.Combatant) {
                combatantObj[c] = true;
            }
        }
        var combatants = Object.keys(combatantObj).sort();

        var header = [
            'Fight',
            'ID',
            'StartTime',
            'Duration',
            'TotalDPS',
        ];
        for (var i = 0; i < combatants.length; ++i) {
            header.push(combatants[i]);
        }

        var rows = [header];
        for (var f = 0; f < fights.length; ++f) {
            var info = fights[f];
            var name = info.fight.fightId;
            if (info.phase) {
                name += "." + info.phase;
            }
            var row = [
                name,
                info.fight.attempt,
                info.fight.startTime,
                info.dps.Encounter.DURATION,
                info.dps.Encounter.encdps,
            ];
            for (var i = 0; i < combatants.length; ++i) {
                var name = combatants[i];
                if (info.dps.Combatant[name]) {
                    row.push(info.dps.Combatant[name].encdps);
                } else {
                    row.push('');
                }
            }
            rows.push(row);
        }

        var csv = rows.map(function(x) { return x.join(','); }).join('\n');
        console.log(csv);
    },

    seenFights: [],

    onUpdate: function(e) {
        console.log(e.detail);
        this.seenFights.push(e.detail);
        this.toCSV(this.seenFights);
    },
};

window.addEventListener('load', function () {
    cb.dpsRecorder.initialize();
});
