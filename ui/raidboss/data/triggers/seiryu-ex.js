'use strict';

// Seiryu Extreme
[{
  zoneRegex: /^The Wreath Of Snakes \(Extreme\)$/,
  timelineFile: 'seiryu-ex.txt',
  timelineTriggers: [
    {
      id: 'SeiryuEx Split Group',
      regex: /Forbidden Arts 1/,
      beforeSeconds: 4,
      infoText: {
        en: 'stack with your group',
        de: 'mit der Gruppe stacken',
        fr: 'Packé avec votre groupe',
      },
    },
    {
      id: 'SeiryuEx Stack',
      regex: /Forbidden Arts$/,
      beforeSeconds: 1,
      suppressSeconds: 10,
      infoText: {
        en: 'line stack',
        de: 'Linien-Stack',
        fr: 'Packé en ligne',
      },
    },
    {
      id: 'SeiryuEx Tether',
      regex: /Kanabo/,
      beforeSeconds: 7,
      condition: function(data) {
        return data.role == 'tank';
      },
      alertText: {
        en: 'Grab Tether, Point Away',
        de: 'Verbindung nehmen und wegdrehen',
        fr: 'Prenez le lien, pointez vers l\'extérieur',
      },
    },
  ],
  triggers: [
    {
      id: 'SeiryuEx Aramitama Tracking',
      regex: / 14:37E4:Seiryu starts using Blazing Aramitama/,
      regexDe: / 14:37E4:Seiryu starts using Flammende Aramitama/,
      regexFr: / 14:37E4:Seiryû starts using Aramitama Incandescent/,
      regexJa: / 14:37E4:青龍 starts using 荒魂燃焼/,
      run: function(data) {
        data.blazing = true;
      },
    },
    {
      id: 'SeiryuEx Cursekeeper',
      regex: / 14:37D2:Seiryu starts using Cursekeeper on (\y{Name})/,
      regexDe: / 14:37D2:Seiryu starts using Wächter des Fluchs on (\y{Name})/,
      regexFr: / 14:37D2:Seiryû starts using Katashiro on (\y{Name})/,
      regexJa: / 14:37D2:青龍 starts using 呪怨の形代 on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Swap',
            de: 'Tankwechsel',
            fr: 'Tank Swap',
          };
        }
        if (data.role == 'tank') {
          return {
            en: 'Swap, then Buster',
            de: 'Tankwechsel, danach Tankbuster',
            fr: 'Swap puis tankbuster',
          };
        }
      },
    },
    {
      id: 'SeiryuEx Infirm Soul',
      regex: / 14:37D2:Seiryu starts using Cursekeeper on (\y{Name})/,
      regexDe: / 14:37D2:Seiryu starts using Wächter des Fluchs on (\y{Name})/,
      regexFr: / 14:37D2:Seiryû starts using Katashiro on (\y{Name})/,
      regexJa: / 14:37D2:青龍 starts using 呪怨の形代 on (\y{Name})/,
      condition: function(data) {
        // TODO: it'd be nice to figure out who the tanks are so this
        // could also apply to the person Cursekeeper was on.
        return data.role != 'tank';
      },
      delaySeconds: 3,
      alertText: {
        en: 'Away From Tanks',
        de: 'Weg von den Tanks',
        fr: 'Ecartez-vous des tanks',
      },
    },
    {
      id: 'SeiryuEx Ascending Tracking',
      regex: / 14:3C25:Seiryu starts using Serpent Ascending/,
      regexDe: / 14:3C25:Seiryu starts using Aufstieg der Schlange/,
      regexFr: / 14:3C25:Seiryû starts using Dragon Levant/,
      regexJa: / 14:3C25:青龍 starts using 登り龍/,
      run: function(data) {
        data.markers = [];
      },
    },
    {
      id: 'SeiryuEx Ascending Stack',
      regex: / 14:3C25:Seiryu starts using Serpent Ascending/,
      regexDe: / 14:3C25:Seiryu starts using Aufstieg der Schlange/,
      regexFr: / 14:3C25:Seiryû starts using Dragon Levant/,
      regexJa: / 14:3C25:青龍 starts using 登り龍/,
      delaySeconds: 1,
      infoText: {
        en: 'Stack for Puddle AOEs',
        de: 'Stacken (Pfützen)',
        fr: 'Packez-vous pour l\'aoe',
      },
    },
    {
      id: 'SeiryuEx Ascending Marker Tracking',
      regex: / 1B:........:(\y{Name}):....:....:00A9:0000:0000:0000:/,
      condition: function(data) {
        return data.blazing;
      },
      run: function(data, matches) {
        data.markers.push(matches[1]);
      },
    },
    {
      id: 'SeiryuEx Ascending Marker You',
      regex: / 1B:........:(\y{Name}):....:....:00A9:0000:0000:0000:/,
      condition: function(data, matches) {
        return data.blazing && matches[1] == data.me;
      },
      infoText: function(data) {
        if (data.role == 'tank' || data.role == 'healer') {
          return {
            en: 'Spread (dps get towers)',
            de: 'Verteilen (nicht in den Turm)',
            fr: 'Ecartez-vous (pas sur la tour)',
          };
        }
        return {
          en: 'Spread (tanks/healers get towers)',
          de: 'Verteilen (nicht in den Turm)',
          fr: 'Ecartez-vous (pas sur la tour)',
        };
      },
    },
    {
      id: 'SeiryuEx Ascending Tower You',
      regex: / 1B:........:(\y{Name}):....:....:00A9:0000:0000:0000:/,
      condition: function(data, matches) {
        if (!data.blazing || data.markers.length != 4)
          return false;
        return data.markers.indexOf(data.me) == -1;
      },
      alarmText: function(data) {
        if (data.role == 'tank' || data.role == 'healer') {
          return {
            en: 'Get Tower (tank/healer towers)',
            de: 'In den Turm',
            fr: 'Sur votre tour',
          };
        }
        return {
          en: 'Get Tower (dps towers)',
          de: 'In den Turm',
          fr: 'Sur votre tour',
        };
      },
    },
    {
      id: 'SeiryuEx Handprint East',
      regex: / 15:\y{ObjectId}:Yama-no-shiki:37E5:Handprint:/,
      regexFr: / 15:\y{ObjectId}:Shiki montagneux:37E5:Main Lourde:/,
      regexDe: / 15:\y{ObjectId}:Yama no Shiki:37E5:Handabdruck:/,
      infoText: {
        en: 'East =>',
        de: 'Osten =>',
        fr: 'Est =>',
      },
      tts: {
        en: 'East',
        de: 'Osten',
        fr: 'Est',
      },
    },
    {
      id: 'SeiryuEx Handprint West',
      regex: / 15:\y{ObjectId}:Yama-no-shiki:37E6:Handprint:/,
      regexFr: / 15:\y{ObjectId}:Shiki montagneux:37E6:Main Lourde:/,
      regexDe: / 15:\y{ObjectId}:Yama no Shiki:37E6:Handabdruck:/,
      infoText: {
        en: '<= West',
        de: '<= Westen',
        fr: '<= Ouest',
      },
      tts: {
        en: 'West',
        de: 'Westen',
        fr: 'Ouest',
      },
    },
    {
      id: 'SeiryuEx Find Sneks',
      regex: / 14:37F7:Seiryu starts using Coursing River/,
      regexDe: / 14:37F7:Seiryu starts using Woge der Schlange/,
      regexFr: / 14:37F7:Seiryû starts using Vague De Serpents/,
      regexJa: / 14:37F7:青龍 starts using 蛇崩/,
      alarmText: function(data) {
        if (data.withForce === undefined) {
          return {
            en: 'Go To Snakes',
            de: 'Zu den Schlangen',
            fr: 'Allez vers les serpents',
          };
        }
        return {
          en: 'Out of Middle, Toward Snakes',
          de: 'Raus aus der Mitte, Zu den Schlangen',
          fr: 'Pas au centre, du côté des serpents',
        };
      },
      run: function(data) {
        data.withForce = true;
      },
    },
    {
      id: 'SeiryuEx Silence',
      regex: / 14:37F4:Numa-No-Shiki starts using Stoneskin/,
      regexDe: / 14:37F4:Numa no Shiki starts using Steinhaut/,
      regexFr: / 14:37F4:Shiki uligineux starts using Cuirasse/,
      regexJa: / 14:37F4:沼の式鬼 starts using ストンスキン/,
      condition: function(data) {
        return data.role == 'tank' || data.role == 'dps-ranged';
      },
      alertText: {
        en: 'Silence',
        de: 'Verstummen',
        fr: 'Silence',
      },
    },
    {
      id: 'SeiryuEx Stack',
      regex: / 03:Added new combatant Ao-No-Shiki./,
      regexDe: / 03:Added new combatant Ao no Shiki./,
      regexFr: / 03:Added new combatant Shiki céruléen./,
      regexJa: / 03:Added new combatant 蒼の式鬼./,
      infoText: function(data) {
        if (data.role == 'tank' || data.role == 'healer') {
          return {
            en: 'Stack South',
            de: 'Im Süden stacken',
            fr: 'Packez-vous au sud',
          };
        }
        return {
          en: 'Stack if no tether',
          de: 'Stacken, wenn keine Verbindung',
          fr: 'Packez-vous si pas de lien',
        };
      },
    },
    {
      // This comes a good bit after the symbol on screen,
      // but it's still 2.5s of warning if you've fallen asleep.
      id: 'SeiryuEx Sigil Single Out',
      regex: / 14:3A01:Seiryu starts using Onmyo Sigil/,
      regexDe: / 14:3A01:Seiryu starts using Onmyo-Siegel/,
      regexFr: / 14:3A01:Seiryû starts using Onmyo/,
      regexJa: / 14:3A01:青龍 starts using 陰陽の印/,
      infoText: {
        en: 'Out',
        de: 'Raus',
        fr: 'Dehors',
      },
    },
    {
      id: 'SeiryuEx Sigil In Out 1',
      regex: / 14:3A05:Seiryu starts using Serpent-Eye Sigil/,
      regexDe: / 14:3A05:Seiryu starts using Siegel des Schlangenauges/,
      regexFr: / 14:3A05:Seiryû starts using Œil De Serpent/,
      regexJa: / 14:3A05:青龍 starts using Serpent-Eye Sigil/,
      infoText: {
        en: 'In, then out',
        de: 'Rein, dann raus',
        fr: 'Dedans, puis dehors',
      },
    },
    {
      id: 'SeiryuEx Sigil In Out 2',
      regex: / 14:3A05:Seiryu starts using Serpent-Eye Sigil/,
      regexDe: / 14:3A05:Seiryu starts using Siegel des Schlangenauges/,
      regexFr: / 14:3A05:Seiryû starts using Œil De Serpent/,
      regexJa: / 14:3A05:青龍 starts using Serpent-Eye Sigil/,
      delaySeconds: 2.7,
      infoText: {
        en: 'Out',
        de: 'Raus',
        fr: 'Dehors',
      },
    },
    {
      id: 'SeiryuEx Sigil Out In 1',
      regex: / 14:3A03:Seiryu starts using Onmyo Sigil/,
      regexDe: / 14:3A03:Seiryu starts using Onmyo-Siegel/,
      regexFr: / 14:3A03:Seiryû starts using Onmyo/,
      regexJa: / 14:3A03:青龍 starts using 陰陽の印/,
      infoText: {
        en: 'Out, then in',
        de: 'Raus, dann rein',
        fr: 'Dehors, puis dedans',
      },
    },
    {
      id: 'SeiryuEx Sigil Out In 2',
      regex: / 14:3A03:Seiryu starts using Onmyo Sigil/,
      regexDe: / 14:3A03:Seiryu starts using Onmyo-Siegel/,
      regexFr: / 14:3A03:Seiryû starts using Onmyo/,
      regexJa: / 14:3A03:青龍 starts using 陰陽の印/,
      delaySeconds: 2.7,
      infoText: {
        en: 'In',
        de: 'Rein',
        fr: 'Dedans',
      },
    },
    {
      id: 'SeiryuEx Swim Lessons',
      regex: / 14:37CB:Seiryu starts using Dragon's Wake/,
      regexDe: / 14:37CB:Seiryu starts using Erwachen des Drachen/,
      regexFr: / 14:37CB:Seiryû starts using Ascension Draconique/,
      regexJa: / 14:37CB:青龍 starts using 雲蒸龍変/,
      delaySeconds: 28,
      alertText: {
        en: 'Pop Sprint',
        de: 'Sprinten',
        fr: 'Sprintez',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Engage!': 'Start!',
        'Seiryu': 'Seiryu',
        'Aka-no-shiki': 'Aka no Shiki',
        'Aka-No-Shiki': 'Aka no Shiki',
        'Ao-no-shiki': 'Ao no Shiki',
        'Ao-No-Shiki': 'Ao no Shiki',
        'Blue Orochi': 'blau[a] Orochi',
        'Doro-no-shiki': 'Doro no Shiki',
        'Iwa-no-shiki': 'Iwa no Shiki',
        'Numa-no-shiki': 'Numa no Shiki',
        'Numa-No-Shiki': 'Numa no Shiki',

        // FIXME:
        'Yama-no-shiki': 'Yama no Shiki',
      },
      'replaceText': {
        '--targetable--': '--anvisierbar--',
        '--untargetable--': '--nich anvisierbar--',
        '100-tonze Swing': '100-Tonzen-Schwung',
        'Blazing Aramitama': 'Flammende Aramitama',
        'Blue Bolt': 'Blauer Blitz',
        'Calamity-blade Sigil': 'Katastrophenklingen-Siegel',
        'Coursing River': 'Woge der Schlange',
        'Cursekeeper': 'Wächter des Fluchs',
        'Dragon\'s Wake': 'Erwachen des Drachen',
        'Enrage': 'Finalangriff',
        'Explosion': 'Explosion',
        'Fifth Element': 'Fünftes Element',
        'Forbidden Arts': 'Verbotene Künste',
        'Force of Nature': 'Naturgewalt',
        'Fortune-blade Sigil': 'Glücksklingen-Siegel',
        'Great Typhoon': 'Große Welle',
        'Handprint': 'Handabdruck',
        'Infirm Soul': 'Kraftlose Seele',
        'Kanabo': 'Kanabo',
        'Karmic Curse': 'Karmafluch',
        'Kuji-kiri': 'Kuji-kiri',
        'Onmyo Sigil': 'Onmyo-Siegel',
        'Red Rush': 'Roter Ansturm',
        'Serpent Ascending': 'Aufstieg der Schlange',
        'Serpent Descending': 'Niedergang der Schlange',
        'Serpent\'s Fang': 'Schlangengiftzahn',
        'Serpent-eye Sigil': 'Siegel des Schlangenauges',
        'Stoneskin': 'Steinhaut',
        'Strength of Spirit': 'Stärke des Geistes',
        'Summon Shiki': 'Shiki-Beschwörung ',
        'Yama-kagura': 'Yamakagura',

        // FIXME:
        '--rotate--': '--rotate--',
        '--jump--': '--jump--',
        'In/Out': 'In/Out',
        'Out/In': 'Out/In',
      },
      '~effectNames': {
        'Being dragged under by the current. Unable to move or execute actions.': 'Wie von den Fluten verschluckt. Bewegungsunfähig, Kommandos können nicht ausgeführt werden.',
        'Blunt Resistance Down': 'Schlagresistenz -',
        'Cursekeeper': 'Fluchträger',
        'Fetters': 'Seelenfessel',
        'Magic Vulnerability Up': 'Erhöhte Magie-Verwundbarkeit',
        'Water Resistance Down II': 'Wasserresistenz - (stark)',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Engage!': 'À l\'attaque',
        'Seiryu': 'Seiryû',
        'Aka-no-shiki': 'Shiki écarlate',
        'Aka-No-Shiki': 'Shiki écarlate',
        'Ao-no-shiki': 'Shiki céruléen',
        'Ao-No-Shiki': 'Shiki céruléen',
        'Blue orochi': 'Orochi azur',
        'Doro-no-shiki': 'Shiki fangeux',
        'Iwa-no-shiki': 'Shiki rocailleux',
        'Numa-no-shiki': 'Shiki uligineux',
        'Numa-No-Shiki': 'Shiki uligineux',
        'Yama-no-shiki': 'Shiki montagneux',
      },
      'replaceText': {
        '--Reset--': '--Réinitialisation--',
        '--sync--': '--Synchronisation--',
        '--targetable--': '--Ciblable--',
        '--untargetable--': '--Impossible à cibler--',
        '100-tonze Swing': 'Swing de 100 tonz',
        'Blazing Aramitama': 'Aramitama incandescent',
        'Blue Bolt': 'Percée bleue',
        'Calamity-blade Sigil': 'Lame lunaire',
        'Coursing River': 'Vague de serpents',
        'Cursekeeper': 'Katashiro',
        'Dragon\'s Wake': 'Ascension draconique',
        'Enrage': 'Enrage',
        'Explosion': 'Explosion',
        'Fifth Element': 'Cinq éléments',
        'Forbidden Arts': 'Lame interdite',
        'Force of Nature': 'Main écrasante',
        'Fortune-blade Sigil': 'Lame solaire',
        'Great Typhoon': 'Flots tumultueux',
        'Handprint': 'Main lourde',
        'Infirm Soul': 'Onde d\'amertume',
        'Kanabo': 'Massue démoniaque',
        'Karmic Curse': 'Noroi-gaeshi',
        'Kuji-kiri': 'Kuji-kiri',
        'Onmyo Sigil': 'Onmyo',
        'Red Rush': 'Percée rouge',
        'Serpent Ascending': 'Dragon levant',
        'Serpent Descending': 'Serpent couchant',
        'Serpent\'s Fang': 'Dent de serpent',
        'Serpent-eye Sigil': 'Œil de serpent',
        'Stoneskin': 'Cuirasse',
        'Strength of Spirit': 'Chakra',
        'Summon Shiki': 'Invocation de shiki',
        'Yama-kagura': 'Yama-kagura',
        '--rotate--': '--Tourne--',
        '--jump--': '--Saut--',
        'In/Out': 'Dedans/Dehors',
        'Out/In': 'Dehors/Dedans',
      },
      '~effectNames': {
        'Being dragged under by the current. Unable to move or execute actions.': 'Impossible d\'utiliser des actions ou de se déplacer.',
        'Blunt Resistance Down': 'Résistance au contondant réduite',
        'Cursekeeper': 'Katashiro',
        'Fetters': 'Attache',
        'Magic Vulnerability Up': 'Vulnérabilité Magique Augmentée',
        'Water Resistance Down II': 'Résistance à L\'eau Réduite+',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Engage!': '戦闘開始！',
        'Seiryu': '青龍',
        'Aka-no-shiki': '紅の式鬼',
        'Aka-No-Shiki': '紅の式鬼',
        'Ao-no-shiki': '蒼の式鬼',
        'Ao-No-Shiki': '蒼の式鬼',
        'Blue orochi': '青のオロチ',
        'Doro-no-shiki': '泥の式鬼',
        'Iwa-no-shiki': '岩の式鬼',
        'Numa-no-shiki': '沼の式鬼',
        'Numa-No-Shiki': '沼の式鬼',

        // FIXME:
        'Yama-no-shiki': 'Yama-no-shiki',
      },
      'replaceText': {
        '100-tonze Swing': '100トンズ・スイング',
        'Blazing Aramitama': '荒魂燃焼',
        'Blue Bolt': '青の突進',
        'Calamity-blade Sigil': '陰の刀印',
        'Coursing River': '蛇崩',
        'Cursekeeper': '呪怨の形代',
        'Dragon\'s Wake': '雲蒸龍変',
        'Explosion': '爆散',
        'Fifth Element': '陰陽五行',
        'Forbidden Arts': '刀禁呪',
        'Force of Nature': '大圧殺',
        'Fortune-blade Sigil': '陽の刀印',
        'Great Typhoon': '荒波',
        'Handprint': '圧殺掌',
        'Infirm Soul': '虚証弾',
        'Kanabo': '鬼に金棒',
        'Karmic Curse': '呪い返し',
        'Kuji-kiri': '九字切り',
        'Onmyo Sigil': '陰陽の印',
        'Red Rush': '赤の突進',
        'Serpent Ascending': '登り龍',
        'Serpent Descending': '降り蛇',
        'Serpent\'s Fang': '蛇牙',
        'Serpent-eye Sigil': '蛇眼の印',
        'Stoneskin': 'ストンスキン',
        'Strength of Spirit': '霊気',
        'Summon Shiki': '式鬼召喚',
        'Yama-kagura': '山神楽',

        // FIXME:
        '--rotate--': '--rotate--',
        '--jump--': '--jump--',
        'In/Out': 'In/Out',
        'Out/In': 'Out/In',
      },
      '~effectNames': {
        'Being dragged under by the current. Unable to move or execute actions.': '溺れている状態。移動およびアクション実行不可。',
        'Blunt Resistance Down': '打属性耐性低下',
        'Cursekeeper': '呪怨の形代',
        'Fetters': '拘束',
        'Magic Vulnerability Up': '被魔法ダメージ増加',
        'Water Resistance Down II': '水属性耐性低下［強］',
      },
    },
  ],
}];
