// Byakko Extreme
// localized - done: en, de | todo: ko, fr, ...
[{
  zoneRegex: /^The Jade Stoa \(Extreme\)$/,
  timelineFile: 'byakko-ex.txt',
  timelineReplace: [
    	{
      locale: 'de',
      replaceText: {
        'Storm Pulse': 'Gewitterwelle',
        'Heavenly Strike': 'Himmlischer Schlag',
        'State of Shock': 'Bannblitze',
        'Highest Stakes': 'Höchstes Risiko',
        'Unrelenting Anguish': 'Pandämonium',
        'Ominous Wind': 'Ominöser Wind',
        'Fire and Lightning': 'Feuer und Blitz',
        '--leap north--': '--Springt Nord--',
        'Puddle Markers': 'Pfützen Marker',
        'Hakutei Add': 'Hakutei Add',
        'Tiger Cleave': 'Tiger Cleave',
        '--tiger untargetable--': '--Tiger nicht anvisierbar--',
        '--tiger lands--': '--Tiger landet--',
        'Distant Clap': 'Donnergrollen',
        'TP Orbs': 'Heilorbs -> Tiger',
        'Roar of Thunder': 'Brüllen des Donners',
        'Donut AOE': 'Donut AoE',
        'Line AOE': 'Linien AoE',
        'Hundredfold Havoc': 'Hundertfache Verwüstung',
        'Sweep the Leg': 'Vertikalität',
        'Orb Marker': 'ABC AoE',
        '--leap middle--': '--Springt Mitte--',
        'Enrage': 'Finalangriff',
      },
      replaceSync: {
        'Engage!': 'Start!',
		'Byakko': 'Byakko',
        'There is no turning back!': 'Mein Jagdtrieb ist erwacht',
        'Unrelenting Anguish': 'Pandämonium',
        'Distant Clap': 'Donnergrollen',
        'All creation trembles before my might!': 'Himmel und Erde',
        'Fell Swoop': 'Auf einen Schlag',
        'Fire And Lightning': 'Feuer Und Blitz',
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
      id: 'ByaEx Heavenly Strike',
      regex: / 14:27DA:Byakko starts using Heavenly Strike on (\y{Name})/,
	  regexDe: / 14:27DA:Byakko starts using Himmlischer Schlag on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me)
          return {
			  en: 'Tank Buster on YOU',
			  de: 'Tank Buster auf DIR',
		  };
        if (data.role == 'healer')
          return {
			  en: 'Buster on ' + data.ShortName(matches[1]),
			  de: 'Buster auf ' + data.ShortName(matches[1]),
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
      id: 'ByaEx Flying Donut',
      regex: / 14:27F4:Byakko starts using Sweep The Leg/,
	  regexDe: / 14:27F4:Byakko starts using Vertikalität/,
      alertText: function(data, matches) {
        return  {
			  en: 'Get Inside',
			  de: 'In die Mitte',
		};
      },
      tts: function(data) {
		  return {
			  en: 'inside',
			  de: 'mitte',
		  };
	  },
    },
    {
      id: 'ByaEx Sweep The Leg',
      regex: / 14:27DB:Byakko starts using Sweep The Leg/,
	  regexDe: / 14:27DB:Byakko starts using Vertikalität/,
      alertText: function(data, matches) {
        return {
			en: 'Get Behind',
			de: 'Hinter ihn',
		};
      },
      tts: function(data) {
		  return {
			  en: 'behind',
			  de: 'hinter ihn',
		  };
	  },
    },
    {
      id: 'ByaEx Storm Pulse',
      regex: / 14:27DC:Byakko starts using Storm Pulse/,
	  regexDe: / 14:27DC:Byakko starts using Gewitterwelle/,
      infoText: function(data, matches) {
        if (data.role == 'healer')
          return {
			  en:'AOE',
			  de:'AoE',
		  };
      },
      tts: function(data) {
		  return {
			  en: 'aoe',
			  de: 'aoe',
		  };
	  },
    },
    {
      id: 'ByaEx Distant Clap',
      regex: / 14:27DD:Byakko starts using Distant Clap on Byakko/,
	  regexDe: / 14:27DD:Byakko starts using Donnergrollen on Byakko/,
      alertText: function(data, matches) {
        return {
			en: 'Distant Clap',
			de: 'Donnergrollen',
		};
      },
      tts: function(data) {
		  return {
			  en: 'clap',
			  de: 'donut',
		  };
	  },
    },
    {
      id: 'ByaEx State Of Shock Tank 1',
      regex: / 14:27E0:Byakko starts using State Of Shock on (\y{Name})/,
	  regexDe: / 14:27E0:Byakko starts using Bannblitze on (\y{Name})/,
      condition: function(data, matches) { return data.role == 'tank' && matches[1] != data.me; },
      alertText: function(data) {
		  return {
			  en: 'Provoke Boss',
			  de: 'Boss Herausfordern',
		  };
	  },
      tts: function(data) {
		  return {
			  en: 'Provoke',
			  de: 'Herausfordern',
		  };
	  },
    },
    {
      id: 'ByaEx State Of Shock Tank 2',
      regex: / 14:27E0:Byakko starts using State Of Shock on (\y{Name})/,
	  regexDe: / 14:27E0:Byakko starts using Bannblitze on (\y{Name})/,
      delaySeconds: 12,
      condition: function(data, matches) { return data.role == 'tank' && matches[1] == data.me; },
      alertText: function(data) {
		  return {
			  en: 'Provoke Boss',
			  de: 'Boss Herausfordern',
		  };
	  },
      tts: function(data) {
		  return {
			  en: 'Provoke',
			  de: 'Herausfordern',
		  };
	  },
    },
    {
      regex: / 14:27F9:Hakutei starts using The Roar Of Thunder/,
	  regexDe: / 14:27F9:Hakutei starts using Brüllen Des Donners/,
      run: function(data) {
        data.roarCount = data.roarCount || 0;
        data.roarCount += 1;
      },
    },
    {
      id: 'ByaEx Roar of Thunder',
      regex: / 14:27F9:Hakutei starts using The Roar Of Thunder/,
	  regexDe: / 14:27F9:Hakutei starts using Brüllen Des Donners/,
      delaySeconds: 14,
      alarmText: function(data) {
        if (data.roarCount != 2)
          return;
        if (data.role == 'tank')
          return {
			  en: 'Tank LB Now',
			  de: 'Tank LB Jetzt',
		  };
      },
      tts: function(data) {
        if (data.roarCount != 2)
          return;
        if (data.role == 'tank')
          return {
			  en: 'tank LB now',
			  de: 'Limitrausch',
		  };
      },
    },
    {
      id: 'ByaEx Bubble',
      regex: /1B:........:(\y{Name}):....:....:0065:0000:0000:0000:/,
      regexDe: /1B:........:(\y{Name}):....:....:0065:0000:0000:0000:/,
      condition: function(data, matches) { return matches[1] == data.me; },
      infoText: function(data) {
        return {
			en: 'Drop Bubble Outside',
			de: 'Am Rand ablegen',
		};
      },
      tts: function(data) {
        return {
			en: 'drop outside',
			de: 'am rand ablegen',
		};
      },
    },
    {
      id: 'ByaEx Ominous Wind',
      regex: /1A:(\y{Name}) gains the effect of Ominous Wind/,
      regexDe: /1A:(\y{Name}) gains the effect of Ominöser Wind/,
      condition: function(data, matches) { return matches[1] == data.me; },
      infoText: function(data) {
        return {
			en: 'Pink Bubble',
			de: 'Rote Blase',
		};
      },
      tts: function(data) {
        return {
			en: 'bubble',
			de: 'blase',
		};
      },
    },
    {
      id: 'ByaEx Puddle Marker',
      regex: /1B:........:(\y{Name}):....:....:0004:0000:0000:0000:/,
      regexDe: /1B:........:(\y{Name}):....:....:0004:0000:0000:0000:/,
      condition: function(data, matches) { return matches[1] == data.me; },
      alarmText: function(data) {
        return {
			en: 'Puddles on YOU',
			de: 'Pfützen auf DIR',
		};
      },
      tts: function(data) {
        return {
			en: 'puddles',
			de: 'pfützen',
		};
      },
    },
    {
      id: 'ByaEx G100',
      regex: /1B:........:(\y{Name}):....:....:0057:0000:0000:0000:/,
      regexDe: /1B:........:(\y{Name}):....:....:0057:0000:0000:0000:/,
      condition: function(data, matches) { return matches[1] == data.me; },
      infoText: function(data) {
        return {
			en: 'Get Away',
			de: 'Lauf Weg',
		};
      },
      tts: function(data) {
        return {
			en: 'get away',
			de: 'lauf weg',
		};
      },
    },
    {
      id: 'ByaEx Tiger Add',
      regex: / 00:0044:Twofold is my wrath, twice-cursed my foes!/,
      regexDe: / 00:0044:Stürmt los, meine zwei Gesichter!/,
      infoText: function(data) {
        if (data.role == 'tank')
          return {
			  en: 'Tiger Add',
			  de: 'Tiger Add',
		  };
      },
      tts: function(data) {
        return {
			en: 'tiger add',
			de: 'tiger add',
		};
      },
    },
    {
      regex: / 14:27E2:Byakko starts using Highest Stakes/,
      regexDe: / 14:27E2:Byakko starts using Höchstes Risiko/,
      run: function(data) {
        data.stakeCount = data.stakeCount || 0;
        data.stakeCount += 1;
      },
    },
    {
      regex: / 14:27E2:Byakko starts using Highest Stakes/,
      regexDe: / 14:27E2:Byakko starts using Höchstes Risiko/,
      delaySeconds: 20,
      run: function(data) {
        delete data.stakeCount;
      },
    },
    {
      id: 'ByaEx Highest Stakes',
      regex: / 14:27E2:Byakko starts using Highest Stakes/,
      regexDe: / 14:27E2:Byakko starts using Höchstes Risiko/,
      infoText: function(data) {
        return {
			en: 'Stack #' + data.stakeCount,
			de: 'Stack Nr. ' + data.stakeCount,
		};
      },
      tts: function(data) {
        return {
			en: 'stack ' + data.stakeCount,
			de: 'stack ' + data.stakeCount,
		};
      },
    },
  ]
}]
