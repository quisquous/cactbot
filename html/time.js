// gt.time comes from http://www.garlandtools.org/bell/gt.bell.js
// Author kindly said "use this however you'd like"
gt = window.gt || {};
gt.time = {
	epochTimeFactor: 20.571428571428573, // 60 * 24 Eorzean minutes (one day) per 70 real-world minutes.
	millisecondsPerEorzeaMinute: (2 + 11/12) * 1000,
	millisecondsPerDay: 24 * 60 * 60 * 1000,
	hours: {hour: '2-digit'},
	hoursMinutes: {hour: '2-digit', minute: '2-digit'},
	hoursMinutesUTC: {hour: '2-digit', minute: '2-digit', timeZone: 'UTC'},
	hoursMinutesSeconds: {hour: '2-digit', minute: '2-digit', second: '2-digit'},
	monthDay: {month: 'numeric', day: 'numeric'},

	localToEorzea: function(date) {
		return new Date(date.getTime() * gt.time.epochTimeFactor);
	},

	eorzeaToLocal: function(date) {
		return new Date(date.getTime() / gt.time.epochTimeFactor);
	},

	formatCountdown: function(end) {
		var remainingSeconds = (end.getTime() - (new Date()).getTime()) / 1000;
		if (remainingSeconds <= 0)
			return '0:00';

		return gt.time.formatHoursMinutesSeconds(remainingSeconds);
	},

	formatHoursMinutesSeconds: function(totalSeconds) {
		var hours = Math.floor(totalSeconds / 3600);
		var minutes = Math.floor((totalSeconds % 3600) / 60);
		var seconds = Math.floor((totalSeconds % 3600) % 60);

		if (hours)
			return hours + ':' + gt.util.zeroPad(minutes, 2) + ':' + gt.util.zeroPad(seconds, 2);
		else
			return minutes + ':' + gt.util.zeroPad(seconds, 2);
	}
};
gt.util = {
    zeroPad: function(val) {
        if (val < 10)
            return "0" + val;
        return val;
    }
};

cb.time = gt.time;
cb.time.nextTime = function(eorzeaTime, hoursList, minutesOffset) {
    var twentyFourHours = 1000 * 60 * 60 * 24;
    var least = null;
    for (var i = 0; i < hoursList.length; ++i) {
        var date = new Date(eorzeaTime);
        date.setUTCHours(hoursList[i]);
        if (minutesOffset) {
            date.setUTCMinutes(minutesOffset);
        } else {
            date.setUTCMinutes(0);
        }
        date.setTime(date.getTime() - twentyFourHours);
        while (date.getTime() < eorzeaTime.getTime()) {
            date.setTime(date.getTime() + twentyFourHours);
        }
        console.assert(date.getTime() >= eorzeaTime.getTime());
        if (!least || least.getTime() > date.getTime()) {
            least = date;
        }
    }
    console.assert(least.getTime() >= eorzeaTime.getTime());
    return least;
};