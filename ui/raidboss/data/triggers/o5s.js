// O5S - Sigmascape 1.0 Savage
// localized sync and triggers should work for Ja, En, De, Fr now
[{
  zoneRegex: /Sigmascape V1\.0 \(Savage\)/,
  timelineFile: 'o5s.txt',
  resetWhenOutOfCombat: false,
  timelineReplace: [
    {
      locale: 'de',
      replaceText: {
        'Encumber': 'Wegsperrung',
        'Saintly Beam': 'Heiligenstrahl',
        'Knockback Whistle': 'Rückstoß Pfeife',
        'All in the Mind': 'Psychokinese',
        'Doom Strike': 'Vernichtungsschlag',
        'Head On': 'Frontalangriff',
		'Diabolic Wind': 'Diabolischer Wind',
		'Acid Rain': 'Säureregen',
		'Crossing Whistle': 'Kreuzend Pfeife',
		'Diabolic Headlamp': 'Diabolische Leuchte',
		'Tether Whistle': 'Verfolger Pfeife',
		'Diabolic Light': 'Diabolisches Licht',
		') Ghosts': ') Geister',
		'Ghosts spawn': 'Geister erscheinen',
      },
      replaceSync: {
        'Engage!': 'Start!',
		'Wroth Ghost': 'Erzürnter Geist',
		'Phantom Train': 'Phantomzug',
		'Remorse': 'Melancholischer Geist',
		'Agony': 'Reuiger Geist',
		'Malice': 'Bösartiger Geist',
      },
    },
	{
      locale: 'fr',
      replaceSync: {
        'Engage!': "À l'attaque !",
		'Wroth Ghost': 'Fantôme Furieux',
		'Phantom Train': 'Train Fantôme',
		'Remorse': 'Fantôme Mélancolique',
		'Agony': 'Fantôme Souffrant',
		'Malice': 'Fantôme Rancunier',
      },
	},
	{
      locale: 'jp',
      replaceSync: {
        'Engage!': '戦闘開始！',
		'Wroth Ghost': 'ロスゴースト',
		'Phantom Train': '魔列車',
		'Remorse': '未練のゴースト',
		'Agony': '苦悶のゴースト',
		'Malice': '怨念のゴースト',
      },
	},
  ],
  triggers: [
    {
      regex: /04:Removing combatant (魔列車|Phantom Train|Phantomzug|Train Fantôme)/,
      run: function(data) {
        data.StopCombat();
      },
    },
    {
      id: 'O5S Doom Strike',
      regex: /14:28B1:(魔列車|Phantom Train|Phantomzug|Train Fantôme) starts using (魔霊撃|Doom Strike|Vernichtungsschlag|Frappe Létale) on (\y{Name})/,
	  alertText: function(data, matches) {
        if (matches[1] == data.me)
          return {
			  en: 'Tank Buster on YOU', 
			  de: 'Tank Buster auf DIR',
			  };
        if (data.role == 'healer')
          return {
			  en: 'Buster on ' + data.ShortName(matches[1]),
			  de: 'Buster auf ' +data.ShortName(matches[1]),
			  };
      },
      tts: function(data, matches) {
        if (matches[1] == data.me)
          return {
			  en: 'buster',
			  de: 'buster',
			  };
      },
    },
    {
      id: 'O5S Head On',
      regex: /14:28A4:(魔列車|Phantom Train|Phantomzug|Train Fantôme) starts using (追突|Head On|Frontalangriff|Plein Fouet)/,
      alertText: function (data) {
		  return {
			  en: 'Go To Back',
			  de: 'Nach HINTEN!',
			  };
	  },
      tts: function(data) {
		  return {
			  en: 'run away',
			  de: 'renn weg',
		  };
	  },
    },
    {
      id: 'O5S Diabolic Headlamp',
      regex: /14:28B2:(魔列車|Phantom Train|Phantomzug|Train Fantôme) starts using (魔界の前照灯|Diabolic Headlamp|Diabolische Leuchte|Phare Diabolique)/,
	  alertText: function (data) {
		  return {
			  en: 'Stack Middle',
			  de: 'Versammeln Mitte',
			  };
	  },
      tts: function(data) {
		  return {
			  en: 'stack middle',
			  de: 'versammeln mitte',
		  };
	  },

    },
    {
      id: 'O5S Diabolic Light',
      regex: /1B:........:(\y{Name}):....:....:0001:0000:0000:0000:/,
	  condition: function(data, matches) { return matches[1] == data.me; },
      infoText: function (data) {
		  return {
			  en: 'Light',
			  de: 'Licht',
		  };
	  },
      tts: function (data) {
		  return {
			  en: 'Light',
			  de: 'Licht',
		  };
	  },
    },
    {
      id: 'O5S Diabolic Wind',
      regex: /1B:........:(\y{Name}):....:....:0046:0000:0000:0000:/,
	  condition: function(data, matches) { return matches[1] == data.me; },
      infoText: function (data) {
		  return {
			  en: 'Wind',
			  de: 'Wind',
		  };
	  },
      tts: function (data) {
		  return {
			  en: 'Wind',
			  de: 'Wind',
		  };
	  },
    },
    {
      id: 'O5S Remorse',
      regex: /Added new combatant (未練のゴースト|Remorse|Melancholischer Geist|Fantôme Mélancolique)/,
	  infoText: function (data) {
		  return {
			  en: 'Knockback Ghost',
			  de: 'Rückstoß Geist',
		  };
	  },
      tts: function (data) {
		  return {
			  en: 'Knockback Ghost',
			  de: 'Rückstoß Geist',
		  };
	  },
    },
  ]
}]
