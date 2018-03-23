// O6N - Sigmascape 2.0 Normal
[{
  zoneRegex: /^(Sigmascape \(V2\.0\)|Sigmascape 2\.0)$/,
  timelineFile: 'o6n.txt',
  timelineReplace: [
  {
    locale: 'de',
    replaceText: {
      'Demonic Howl': 'Dämonisches Heulen',
      'Demonic Shear': 'Dämonische Schere',
      'Possession': 'Besessenheit',
      'Flash Fire': 'Blitzfeuer',
      'Flash Gale': 'Blitzwind',
      'Poltergeist': 'Poltergeist',
      'Divine Lure': 'Göttliche Verlockung',
      'Demonic Pain': 'Dämonischer Schmerz',
      'Release': 'Befreiung',
      'Easterlies': 'Ostwinde',
      'Rock Hard': 'Felsspalter',
      'Featherlance': 'Federlanze',
      'Last Kiss': 'Letzter Kuss',
      'The Price': 'Tödliche Versuchung',
      'Demonic Storm': 'Dämonischer Sturm',
      'Earthquake': 'Erdbeben',
      'Flash Torrent': 'Blitzregen',
      'Materialize': 'Materialisierung',
      'Lullaby': 'Wiegenlied',
      'Demonic Wave': 'Dämonische Welle',
      'Demonic Spout': 'Dämonischer Überschwang',
      'Flash Flood': 'Wasserschwall',
      'Enrage': 'Finalangriff',
    },
    replaceSync: {
      "I have claimed the girl in the picture! She's mine! You can't have her!": 'Das Mädchen in diesem Bildnis gehört mir! Nie wieder geb ich sie her!',
		  'Demon Chadarnook': 'Gefallener Chadarnook',
		  'Goddess Chadarnook': 'Heilige Chadarnook',
		  'Portrayal of Fire': 'Feuergemälde',
		  'Portrayal of Wind': 'Windgemälde',
		  'Portrayal of Earth': 'Erdgemälde',
		  'Portrayal of Water': 'Wassergemälde',
		  'Easterly': 'Ostwind',
		  'Haunt': 'Böser Schatten',
    },
  },
	{
    locale: 'fr',
    replaceText: {
      'Demonic Howl': 'Hurlement Démoniaque',
      'Demonic Shear': 'Cisailles Démoniaques',
      'Possession': 'Possession',
      'Flash Fire': 'Flammes Subites',
      'Flash Gale': 'Vent Subit',
      'Poltergeist': 'Esprit Frappeur',
      'Divine Lure': 'Séduction Divine',
      'Demonic Pain': 'Douleur Démoniaque',
      'Release': 'Libération',
      'Easterlies': 'Rafale Ultime',
      'Rock Hard': 'Brise-roc',
      'Featherlance': 'Lance De Plume',
      'Last Kiss': 'Baiser Fatal',
      'The Price': 'Tentation Mortelle',
      'Demonic Storm': 'Tempête Démoniaque',
      'Earthquake': 'Tremblement De Terre',
      'Flash Torrent': 'Pluie Subite',
      'Materialize': 'Matérialisation',
      'Lullaby': 'Berceuse',
      'Demonic Wave': 'Vague Démoniaque',
      'Demonic Spout': 'Jaillissement Démoniaque',
      'Flash Flood': 'Pluie Subite',
      'Enrage': 'Enrage',
    },
    replaceSync: {
      "I have claimed the girl in the picture! She's mine! You can't have her!": "Héhéhé... La fille du tableau m'appartient. Je ne vous laisserai pas l'avoir !", 
		  'Demon Chadarnook': 'Démon Chadarnouk',
	  	'Goddess Chadarnook': 'Déesse Chadarnouk',
      'Portrayal of Fire': 'Peinture Du Feu',
      'Portrayal of Wind': 'Peinture Du Vent',
      'Portrayal of Earth': 'Peinture De La Terre',
      'Portrayal of Water': "Peinture De L'eau",
      'Easterly': 'Rafale Ultime',
      'Haunt': 'Ombre Maléfique',
    },
  },
	{
    locale: 'jp',
    replaceText: {
      'Demonic Howl': 'デモニックハウル',
      'Demonic Shear': 'デモニックシアー',
      'Possession': '絵画憑依',
      'Flash Fire': 'フラッシュファイア',
      'Flash Gale': 'フラッシュウィンド',
      'Poltergeist': 'ポルターガイスト',
      'Divine Lure': '女神の誘惑',
      'Demonic Pain': 'デモニックペイン',
      'Release': '憑依解除',
      'Easterlies': '極風',
      'Rock Hard': 'ロッククラッシャー',
      'Featherlance': 'フェザーランス',
      'Last Kiss': '死の口づけ',
      'The Price': '死の誘い',
      'Demonic Storm': 'デモニックストーム',
      'Earthquake': '地震',
      'Flash Torrent': 'フラッシュレイン',
      'Materialize': '実体化',
      'Lullaby': '子守歌',
      'Demonic Wave': 'デモニックウェーブ',
      'Demonic Spout': 'デモニックスパウト',
      'Flash Flood': 'フラッシュレイン',
      'Enrage': '怒り',
    },
    replaceSync: {
      "I have claimed the girl in the picture! She's mine! You can't have her!": 'グフフフ……この絵の女は、わしがいただいた……。そう簡単には、返さないぜ……。',
		  'Demon Chadarnook': 'チャダルヌーク・デーモン',
		  'Goddess Chadarnook': 'チャダルヌーク・ゴッデス',
		  'Portrayal of Fire': '火の絵画',
		  'Portrayal of Wind': '風の絵画',
		  'Portrayal of Earth': '土の絵画',
		  'Portrayal of Water': '水の絵画',
		  'Easterly': '極風',
		  'Haunt': '悪霊の影',
    },
  },
  ],
  triggers: [
    {
      id: 'O6N Demonic Shear',
      regex: / 14:282A:(?:チャダルヌーク・デーモン|Demon Chadarnook|Gefallener Chadarnook|Démon Chadarnouk) starts using (?:デモニックシアー|Demonic Shear|Dämonische Schere|Cisailles Démoniaques) on (\y{Name})/,

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
      id: 'O6N Meteors',
      regex: /1B:........:(\y{Name}):....:....:0001:0000:0000:0000:/,
      alarmText: function(data,matches) {
        if (data.me == matches[1]) 
          return {
		    	  en: 'Demonic Stone on YOU',
            de: 'Dämonischer Stein auf dir',
          };
      },
    },
  ]
}]
