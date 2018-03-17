// O5N - Sigmascape 1.0 Normal
// localized - done: en, de | todo: ko, fr, ...
[{
  zoneRegex: /^(Sigmascape \(V1\.0\)|Sigmascape V1\.0)$/,
  timelineFile: 'o5n.txt',
  resetWhenOutOfCombat: false,
    timelineReplace: [
    	{
      locale: 'de',
      replaceText: {
        'Encumber': 'Wegsperre',
        'Saintly Beam': 'Heiligenstrahl',
        'Adds spawn': 'Adds erscheinen',
        'Diabolic Chimney': 'Diabolischer Schornstein',
        'Doom Strike': 'Vernichtungsschlag',
        'Head On': 'Frontalangriff',
		    'Diabolic Wind': 'Diabolischer Wind',
		    'Acid Rain': 'Säureregen',
	    	'Crossing Whistle': 'Kreuzend Pfeife',
	    	'Diabolic Headlamp': 'Diabolische Leuchte',
    		'Tether Whistle': 'Verfolger Pfeife',
    		'Diabolic Light': 'Diabolisches Licht',
    		'Ghosts active': 'Geister',
    		'Ghosts spawn': 'Geister erscheinen',
      },
      replaceSync: {
        'Engage!': 'Start!',
	    	'Wroth Ghost': 'Erzürnter Geist',
	    	'Phantom Train': 'Phantomzug',
      },
    },
	/*
	{
		locale: 'fr',
		replaceText: {
		},
		replaceSync: {
		},
	},
	*/
  ],
  triggers: [
    {
      regex: /04:Removing combatant Phantom Train/,
	    regexDe: /04:Removing combatant Phantomzug/,
      run: function(data) {
        data.StopCombat();
      },
    },

    {
      id: 'O5N Doom Strike',
      regex: /14:28A3:Phantom Train starts using Doom Strike on (\y{Name})/,
	    regexDe: /14:28A3:Phantomzug starts using Vernichtungsschlag on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me)
          return {
			  en: 'Tank Buster on YOU', 
			  de: 'Tank Buster auf DIR',
			  fr: 'Tank Buster on YOU',
			  ko: 'Tank Buster on YOU',
			  };
        if (data.role == 'healer')
          return {
			  en: 'Buster on ' + data.ShortName(matches[1]),
			  de: 'Buster auf ' +data.ShortName(matches[1]),
			  fr: 'Buster on ' + data.ShortName(matches[1]),
			  ko: 'Buster on ' + data.ShortName(matches[1]),
			  };
      },
      tts: function(data, matches) {
        if (matches[1] == data.me)
          return {
			  en: 'buster',
			  de: 'Buster',
			  fr: 'buster',
			  ko: 'buster',
			  };
      },
    },
    {
      id: 'O5N Head On',
      regex: /14:28A4:Phantom Train starts using Head On/,
	    regexDe: /14:28A4:Phantomzug starts using Frontalangriff/,
      alertText: function (data) {
		  return {
			  en: 'Go To Back',
			  de: 'Nach HINTEN!',
			  fr: 'Go To Back',
			  ko: 'Go To Back',
			  };
	  },
      tts: function(data) {
		  return {
			  en: 'run away',
			  de: 'renn weg',
			  fr: 'run away',
			  ko: 'run away',
		  };
	  },
    },
    {
      id: 'O5N Diabolic Headlamp',
      regex: /14:28A6:Phantom Train starts using Diabolic Headlamp/,
	    regexDe: /14:28A6:Phantomzug starts using Diabolische Leuchte/,
      alertText: function (data) {
		  return {
			  en: 'Stack Middle',
			  de: 'Versammeln Mitte',
			  fr: 'Stack Middle',
			  ko: 'Stack Middle',
			  };
	  },
      tts: function(data) {
		    return {
			    en: 'stack middle',
			    de: 'versammeln mitte',
			    fr: 'stack middle',
			    ko: 'stack middle',
		      };
	    },
    },
    {
      id: 'O5N Diabolic Light',
      regex: /1B:........:(\y{Name}):....:....:0001:0000:0000:0000:/,
      regexDe: /1B:........:(\y{Name}):....:....:0001:0000:0000:0000:/,
	    regexFr: /1B:........:(\y{Name}):....:....:0001:0000:0000:0000:/,
	    regexKo: /1B:........:(\y{Name}):....:....:0001:0000:0000:0000:/,
	  
      condition: function(data, matches) { return matches[1] == data.me; },
      infoText: function (data) {
		  return {
			  en: 'Light',
			  de: 'Licht',
			  fr: 'Light',
			  ko: 'Light',
		  };
	  },
      tts: function (data) {
		  return {
			  en: 'Light',
			  de: 'Licht',
			  fr: 'Light',
			  ko: 'Light',
		  };
	  },
    },
    {
      id: 'O5N Diabolic Wind',
      regex: /1B:........:(\y{Name}):....:....:0046:0000:0000:0000:/,
	  regexDe: /1B:........:(\y{Name}):....:....:0046:0000:0000:0000:/,
	  regexFr: /1B:........:(\y{Name}):....:....:0046:0000:0000:0000:/,
	  regexKo: /1B:........:(\y{Name}):....:....:0046:0000:0000:0000:/,
	  
      condition: function(data, matches) { return matches[1] == data.me; },
      infoText: function (data) {
		  return {
			  en: 'Wind',
			  de: 'Wind',
			  fr: 'Wind',
			  ko: 'Wind',
		  };
	  },
      tts: function (data) {
		  return {
			  en: 'Wind',
			  de: 'Wind',
			  fr: 'Wind',
			  ko: 'Wind',
		  };
	  },
    },
  ]
}]
