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
      },
    },
    {
      id: 'SeiryuEx Stack',
      regex: /Forbidden Arts$/,
      beforeSeconds: 1,
      suppressSeconds: 10,
      infoText: {
        en: 'line stack',
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
      },
    },
  ],
  triggers: [
    {
      id: 'SeiryuEx Aramitama Tracking',
      regex: / 14:37E4:Seiryu starts using Blazing Aramitama/,
      regexDe: / 14:37E4:Seiryu starts using Flammende Aramitama/,
      regexFr: / 14:37E4:Seiryû starts using Aramitama incandescent/,
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
          };
        }
        if (data.role == 'tank') {
          return {
            en: 'Swap, then Buster',
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
      },
    },
    {
      id: 'SeiryuEx Ascending Tracking',
      regex: / 14:3C25:Seiryu starts using Serpent Ascending/,
      regexDe: / 14:3C25:Seiryu starts using Aufstieg der Schlange/,
      regexFr: / 14:3C25:Seiryû starts using Dragon levant/,
      regexJa: / 14:3C25:青龍 starts using 登り龍/,
      run: function(data) {
        data.markers = [];
      },
    },
    {
      id: 'SeiryuEx Ascending Stack',
      regex: / 14:3C25:Seiryu starts using Serpent Ascending/,
      regexDe: / 14:3C25:Seiryu starts using Aufstieg der Schlange/,
      regexFr: / 14:3C25:Seiryû starts using Dragon levant/,
      regexJa: / 14:3C25:青龍 starts using 登り龍/,
      delaySeconds: 1,
      infoText: {
        en: 'Stack for Puddle AOEs',
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
      infoText: {
        en: 'Spread (no tower)',
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
      alarmText: {
        en: 'Get Tower',
      },
    },
    {
        // Ability IDs:
        // Left Handprint 37E6
        // Right Handprint 37E5
        // Middle Force of Nature 37E9
        id: 'SeiryuEx Handprint East',
        regex: / 15:\y{ObjectId}:Yama-no-shiki:37E5:Handprint:/,
        regexDe: / 15:\y{ObjectId}:Yama no Shiki:37E5:Handabdruck:/,
        condition: function(data) {
            return data.firstHandprint === undefined;
        },
        infoText: {
            en: 'East =>',
        },
        run: function(data) {
            data.firstHandprint = true;
        },
    },
    {
      id: 'SeiryuEx Handprint West',
      regex: / 15:\y{ObjectId}:Yama-no-shiki:37E6:Handprint:/,
      regexDe: / 15:\y{ObjectId}:Yama no Shiki:37E6:Handabdruck:/,
      condition: function(data) {
        return data.firstHandprint === undefined;
      },
      infoText: {
        en: '<= West',
      },
      run: function(data) {
        data.firstHandprint = true;
      },
    },
    {
      id: 'SeiryuEx Handprint East 2',
      regex: / 15:\y{ObjectId}:Yama-no-shiki:37E5:Handprint:/,
      regexDe: / 15:\y{ObjectId}:Yama no Shiki:37E5:Handabdruck:/,
      condition: function(data) {
        return data.firstHandprint !== undefined;
      },
      infoText: {
        en: 'East =>',
      },
      tts: {
        en: 'Move (East)',
      },
    },
    {
      id: 'SeiryuEx Handprint West 2',
      regex: / 15:\y{ObjectId}:Yama-no-shiki:37E6:Handprint:/,
      regexDe: / 15:\y{ObjectId}:Yama no Shiki:37E6:Handabdruck:/,
      condition: function(data) {
        return data.firstHandprint !== undefined;
      },
      infoText: {
        en: '<= West',
      },
      tts: {
        en: 'Move (West)',
      },
    },
    {
        id: 'SeiryuEx Force of Nature',
        regex: /Yama-no-shiki:37E9:/,
        alertText: {
            en: 'Avoid Middle',
        },
        run: function(data) {
            delete data.firstHandprint;
        },
    },
    {
      id: 'SeiryuEx Find Sneks',
      regex: / 14:37F7:Seiryu starts using Coursing River/,
      regexDe: / 14:37F7:Seiryu starts using Woge der Schlange/,
      regexFr: / 14:37F7:Seiryû starts using Vague de serpents/,
      regexJa: / 14:37F7:青龍 starts using 蛇崩/,
      alarmText: {
        en: 'Go To Snakes',
      },
    },
    {
      id: 'SeiryuEx Silence',
      regex: / 14:37F4:Numa-No-Shiki starts using Stoneskin/,
      regexDe: / 14:37F4:Numa no Shiki starts using Steinhaut/,
      regexFr: / 14:37F4:shiki uligineux starts using Cuirasse/,
      regexJa: / 14:37F4:沼の式鬼 starts using ストンスキン/,
      condition: function(data) {
        return data.role == 'tank' || data.role == 'dps-ranged';
      },
      alertText: {
        en: 'Silence',
      },
    },
    {
      id: 'SeiryuEx Stack',
      regex: / 03:Added new combatant Ao-No-Shiki./,
      regexDe: / 03:Added new combatant Ao no Shiki./,
      regexFr: / 03:Added new combatant shiki céruléen./,
      regexJa: / 03:Added new combatant 蒼の式鬼./,
      infoText: function(data) {
        if (data.role == 'tank' || data.role == 'healer') {
          return {
            en: 'Stack South',
          };
        }
        return {
          en: 'Stack if no tether',
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
      },
    },
    {
      id: 'SeiryuEx Sigil In Out 1',
      regex: / 14:3A05:Seiryu starts using Serpent-Eye Sigil/,
      regexDe: / 14:3A05:Seiryu starts using Serpent-Eye Sigil/,
      regexFr: / 14:3A05:Seiryû starts using Serpent-Eye Sigil/,
      regexJa: / 14:3A05:青龍 starts using Serpent-Eye Sigil/,
      infoText: {
        en: 'In, then out',
      },
    },
    {
      id: 'SeiryuEx Sigil In Out 2',
      regex: / 14:3A05:Seiryu starts using Serpent-Eye Sigil/,
      regexDe: / 14:3A05:Seiryu starts using Serpent-Eye Sigil/,
      regexFr: / 14:3A05:Seiryû starts using Serpent-Eye Sigil/,
      regexJa: / 14:3A05:青龍 starts using Serpent-Eye Sigil/,
      delaySeconds: 2.7,
      infoText: {
        en: 'Out',
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
      },
    },
    {
      id: 'SeiryuEx Swim Lessons',
      regex: / 14:37CB:Seiryu starts using Dragon's Wake/,
      regexDe: / 14:37CB:Seiryu starts using Erwachen des Drachen/,
      regexFr: / 14:37CB:Seiryû starts using Ascension draconique/,
      regexJa: / 14:37CB:青龍 starts using 雲蒸龍変/,
      delaySeconds: 28,
      alertText: {
        en: 'Pop Sprint',
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
        'Aka-no-shiki': 'shiki écarlate',
        'Aka-No-Shiki': 'shiki écarlate',
        'Ao-no-shiki': 'shiki céruléen',
        'Ao-No-Shiki': 'shiki céruléen',
        'Blue orochi': 'orochi azur',
        'Doro-no-shiki': 'shiki fangeux',
        'Iwa-no-shiki': 'shiki rocailleux',
        'Numa-no-shiki': 'shiki uligineux',
        'Numa-No-Shiki': 'shiki uligineux',

        // FIXME:
        'Yama-no-shiki': 'Yama-no-shiki',
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

        // FIXME:
        '--rotate--': '--rotate--',
        '--jump--': '--jump--',
        'In/Out': 'In/Out',
        'Out/In': 'Out/In',
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
