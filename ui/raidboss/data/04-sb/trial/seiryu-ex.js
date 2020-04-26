'use strict';

// Seiryu Extreme
[{
  zoneRegex: {
    en: /^The Wreath Of Snakes \(Extreme\)$/,
    cn: /^青龙诗魂战$/,
  },
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
        ja: 'グループ別にスタック',
        cn: '双组分摊',
      },
    },
    {
      id: 'SeiryuEx Line Stack',
      regex: /Forbidden Arts$/,
      beforeSeconds: 1,
      suppressSeconds: 10,
      infoText: {
        en: 'line stack',
        de: 'Linien-Stack',
        fr: 'Packé en ligne',
        ja: 'スタック',
        cn: '直线分摊',
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
        ja: '線取って外向ける',
        cn: '接线引导',
      },
    },
  ],
  triggers: [
    {
      id: 'SeiryuEx Aramitama Tracking',
      regex: Regexes.startsUsing({ id: '37E4', source: 'Seiryu', capture: false }),
      regexDe: Regexes.startsUsing({ id: '37E4', source: 'Seiryu', capture: false }),
      regexFr: Regexes.startsUsing({ id: '37E4', source: 'Seiryû', capture: false }),
      regexJa: Regexes.startsUsing({ id: '37E4', source: '青龍', capture: false }),
      regexCn: Regexes.startsUsing({ id: '37E4', source: '青龙', capture: false }),
      regexKo: Regexes.startsUsing({ id: '37E4', source: '청룡', capture: false }),
      run: function(data) {
        data.blazing = true;
      },
    },
    {
      id: 'SeiryuEx Cursekeeper',
      regex: Regexes.startsUsing({ id: '37D2', source: 'Seiryu' }),
      regexDe: Regexes.startsUsing({ id: '37D2', source: 'Seiryu' }),
      regexFr: Regexes.startsUsing({ id: '37D2', source: 'Seiryû' }),
      regexJa: Regexes.startsUsing({ id: '37D2', source: '青龍' }),
      regexCn: Regexes.startsUsing({ id: '37D2', source: '青龙' }),
      regexKo: Regexes.startsUsing({ id: '37D2', source: '청룡' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Tank Swap',
            de: 'Tankwechsel',
            fr: 'Tank Swap',
            ja: 'スイッチ',
            cn: '换T',
          };
        }
        if (data.role == 'tank') {
          return {
            en: 'Swap, then Buster',
            de: 'Tankwechsel, danach Tankbuster',
            fr: 'Swap puis tankbuster',
            ja: 'スイッチ後強攻撃',
            cn: '换T+死刑',
          };
        }
      },
    },
    {
      id: 'SeiryuEx Infirm Soul',
      regex: Regexes.startsUsing({ id: '37D2', source: 'Seiryu', capture: false }),
      regexDe: Regexes.startsUsing({ id: '37D2', source: 'Seiryu', capture: false }),
      regexFr: Regexes.startsUsing({ id: '37D2', source: 'Seiryû', capture: false }),
      regexJa: Regexes.startsUsing({ id: '37D2', source: '青龍', capture: false }),
      regexCn: Regexes.startsUsing({ id: '37D2', source: '青龙', capture: false }),
      regexKo: Regexes.startsUsing({ id: '37D2', source: '청룡', capture: false }),
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
        ja: 'タンクから離れ',
        cn: '远离坦克',
      },
    },
    {
      id: 'SeiryuEx Ascending Tracking',
      regex: Regexes.startsUsing({ id: '3C25', source: 'Seiryu', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3C25', source: 'Seiryu', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3C25', source: 'Seiryû', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3C25', source: '青龍', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3C25', source: '青龙', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3C25', source: '청룡', capture: false }),
      run: function(data) {
        data.markers = [];
      },
    },
    {
      id: 'SeiryuEx Ascending Stack',
      regex: Regexes.startsUsing({ id: '3C25', source: 'Seiryu', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3C25', source: 'Seiryu', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3C25', source: 'Seiryû', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3C25', source: '青龍', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3C25', source: '青龙', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3C25', source: '청룡', capture: false }),
      delaySeconds: 1,
      infoText: {
        en: 'Stack for Puddle AOEs',
        de: 'Stacken (Pfützen)',
        fr: 'Packez-vous pour l\'aoe',
        ja: 'スタック',
        cn: '集合放置AOE',
      },
    },
    {
      id: 'SeiryuEx Ascending Marker Tracking',
      regex: Regexes.headMarker({ id: '00A9' }),
      condition: function(data) {
        return data.blazing;
      },
      run: function(data, matches) {
        data.markers.push(matches.target);
      },
    },
    {
      id: 'SeiryuEx Ascending Marker You',
      regex: Regexes.headMarker({ id: '00A9' }),
      condition: function(data, matches) {
        return data.blazing && matches.target == data.me;
      },
      infoText: function(data) {
        if (data.role == 'tank' || data.role == 'healer') {
          return {
            en: 'Spread (dps get towers)',
            de: 'Verteilen (nicht in den Turm)',
            fr: 'Ecartez-vous (pas sur la tour)',
            ja: '散開 (DPSが塔)',
            cn: '分散（DPS踩塔）',
          };
        }
        return {
          en: 'Spread (tanks/healers get towers)',
          de: 'Verteilen (nicht in den Turm)',
          fr: 'Ecartez-vous (pas sur la tour)',
          ja: '散開 (タンクヒラが塔)',
          cn: '分散（坦克/治疗踩塔）',
        };
      },
    },
    {
      id: 'SeiryuEx Ascending Tower You',
      regex: Regexes.headMarker({ id: '00A9', capture: false }),
      condition: function(data) {
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
            ja: '塔 (タンクヒラが塔)',
            cn: '踩塔（坦克/治疗踩塔）',
          };
        }
        return {
          en: 'Get Tower (dps towers)',
          de: 'In den Turm',
          fr: 'Sur votre tour',
          ja: '塔 (DPSが塔)',
          cn: '踩塔（DPS踩塔）',
        };
      },
    },
    {
      id: 'SeiryuEx Handprint East',
      regex: Regexes.ability({ id: '37E5', source: 'Yama-No-Shiki', capture: false }),
      regexDe: Regexes.ability({ id: '37E5', source: 'Yama No Shiki', capture: false }),
      regexFr: Regexes.ability({ id: '37E5', source: 'Shiki Montagneux', capture: false }),
      regexJa: Regexes.ability({ id: '37E5', source: '山の式鬼', capture: false }),
      regexCn: Regexes.ability({ id: '37E5', source: '山之式鬼', capture: false }),
      regexKo: Regexes.ability({ id: '37E5', source: '산 사역귀', capture: false }),
      response: Responses.goEast(),
    },
    {
      id: 'SeiryuEx Handprint West',
      regex: Regexes.ability({ id: '37E6', source: 'Yama-No-Shiki', capture: false }),
      regexDe: Regexes.ability({ id: '37E6', source: 'Yama No Shiki', capture: false }),
      regexFr: Regexes.ability({ id: '37E6', source: 'Shiki Montagneux', capture: false }),
      regexJa: Regexes.ability({ id: '37E6', source: '山の式鬼', capture: false }),
      regexCn: Regexes.ability({ id: '37E6', source: '山之式鬼', capture: false }),
      regexKo: Regexes.ability({ id: '37E6', source: '산 사역귀', capture: false }),
      response: Responses.goWest(),
    },
    {
      id: 'SeiryuEx Find Sneks',
      regex: Regexes.startsUsing({ id: '37F7', source: 'Seiryu', capture: false }),
      regexDe: Regexes.startsUsing({ id: '37F7', source: 'Seiryu', capture: false }),
      regexFr: Regexes.startsUsing({ id: '37F7', source: 'Seiryû', capture: false }),
      regexJa: Regexes.startsUsing({ id: '37F7', source: '青龍', capture: false }),
      regexCn: Regexes.startsUsing({ id: '37F7', source: '青龙', capture: false }),
      regexKo: Regexes.startsUsing({ id: '37F7', source: '청룡', capture: false }),
      alarmText: function(data) {
        if (data.withForce === undefined) {
          return {
            en: 'Go To Snakes',
            de: 'Zu den Schlangen',
            fr: 'Allez vers les serpents',
            ja: '蛇側へ',
            cn: '靠近蛇蛇',
          };
        }
        return {
          en: 'Out of Middle, Toward Snakes',
          de: 'Raus aus der Mitte, Zu den Schlangen',
          fr: 'Pas au centre, du côté des serpents',
          ja: '真ん中からずれて蛇向いて',
          cn: '靠近中心，面向蛇蛇',
        };
      },
      run: function(data) {
        data.withForce = true;
      },
    },
    {
      id: 'SeiryuEx Silence',
      regex: Regexes.startsUsing({ id: '37F4', source: 'Numa-No-Shiki' }),
      regexDe: Regexes.startsUsing({ id: '37F4', source: 'Numa No Shiki' }),
      regexFr: Regexes.startsUsing({ id: '37F4', source: 'Shiki Uligineux' }),
      regexJa: Regexes.startsUsing({ id: '37F4', source: '沼の式鬼' }),
      regexCn: Regexes.startsUsing({ id: '37F4', source: '沼之式鬼' }),
      regexKo: Regexes.startsUsing({ id: '37F4', source: '늪 사역귀' }),
      condition: function(data) {
        return data.CanSilence();
      },
      response: Responses.interrupt(),
    },
    {
      id: 'SeiryuEx Stack',
      regex: Regexes.addedCombatant({ name: 'Ao-No-Shiki', capture: false }),
      regexDe: Regexes.addedCombatant({ name: 'Ao No Shiki', capture: false }),
      regexFr: Regexes.addedCombatant({ name: 'Shiki Céruléen', capture: false }),
      regexJa: Regexes.addedCombatant({ name: '蒼の式鬼', capture: false }),
      regexCn: Regexes.addedCombatant({ name: '苍之式鬼', capture: false }),
      regexKo: Regexes.addedCombatant({ name: '푸른 사역귀', capture: false }),
      infoText: function(data) {
        if (data.role == 'tank' || data.role == 'healer') {
          return {
            en: 'Stack South',
            de: 'Im Süden stacken',
            fr: 'Packez-vous au sud',
            ja: '南でスタック',
            cn: '南侧集合',
          };
        }
        return {
          en: 'Stack if no tether',
          de: 'Stacken, wenn keine Verbindung',
          fr: 'Packez-vous si pas de lien',
          ja: '線無しはスタック',
          cn: '未连线则集合',
        };
      },
    },
    {
      // This comes a good bit after the symbol on screen,
      // but it's still 2.5s of warning if you've fallen asleep.
      id: 'SeiryuEx Sigil Single Out',
      regex: Regexes.startsUsing({ id: '3A01', source: 'Seiryu', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3A01', source: 'Seiryu', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3A01', source: 'Seiryû', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3A01', source: '青龍', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3A01', source: '青龙', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3A01', source: '청룡', capture: false }),
      response: Responses.getOut('info'),
    },
    {
      id: 'SeiryuEx Sigil In Out 1',
      regex: Regexes.startsUsing({ id: '3A05', source: 'Seiryu', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3A05', source: 'Seiryu', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3A05', source: 'Seiryû', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3A05', source: '青龍', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3A05', source: '青龙', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3A05', source: '청룡', capture: false }),
      response: Responses.getInThenOut('info'),
    },
    {
      id: 'SeiryuEx Sigil In Out 2',
      regex: Regexes.startsUsing({ id: '3A05', source: 'Seiryu', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3A05', source: 'Seiryu', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3A05', source: 'Seiryû', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3A05', source: '青龍', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3A05', source: '青龙', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3A05', source: '청룡', capture: false }),
      delaySeconds: 2.7,
      response: Responses.getOut('info'),
    },
    {
      id: 'SeiryuEx Sigil Out In 1',
      regex: Regexes.startsUsing({ id: '3A03', source: 'Seiryu', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3A03', source: 'Seiryu', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3A03', source: 'Seiryû', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3A03', source: '青龍', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3A03', source: '青龙', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3A03', source: '청룡', capture: false }),
      response: Responses.getOutThenIn('info'),
    },
    {
      id: 'SeiryuEx Sigil Out In 2',
      regex: Regexes.startsUsing({ id: '3A03', source: 'Seiryu', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3A03', source: 'Seiryu', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3A03', source: 'Seiryû', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3A03', source: '青龍', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3A03', source: '青龙', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3A03', source: '청룡', capture: false }),
      delaySeconds: 2.7,
      response: Responses.getIn('info'),
    },
    {
      id: 'SeiryuEx Swim Lessons',
      regex: Regexes.startsUsing({ id: '37CB', source: 'Seiryu', capture: false }),
      regexDe: Regexes.startsUsing({ id: '37CB', source: 'Seiryu', capture: false }),
      regexFr: Regexes.startsUsing({ id: '37CB', source: 'Seiryû', capture: false }),
      regexJa: Regexes.startsUsing({ id: '37CB', source: '青龍', capture: false }),
      regexCn: Regexes.startsUsing({ id: '37CB', source: '青龙', capture: false }),
      regexKo: Regexes.startsUsing({ id: '37CB', source: '청룡', capture: false }),
      delaySeconds: 28,
      alertText: {
        en: 'Pop Sprint',
        de: 'Sprinten',
        fr: 'Sprintez',
        ja: 'スプリント',
        cn: '冲冲冲',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Aka-no-shiki': 'Aka no Shiki',
        'Ao-no-shiki': 'Ao no Shiki',
        'Blue Orochi': 'blau(?:e|er|es|en) Orochi',
        'Doro-no-shiki': 'Doro no Shiki',
        'Iwa-no-shiki': 'Iwa no Shiki',
        'Numa-no-shiki': 'Numa no Shiki',
        'Seiryu': 'Seiryu',
        'Yama-no-shiki': 'Yama no Shiki',
      },
      'replaceText': {
        '--rotate--': '--rotate--', // FIXME
        '100-tonze Swing': '100-Tonzen-Schwung',
        'Blazing Aramitama': 'Flammende Aramitama',
        'Blue Bolt': 'Blauer Blitz',
        'Calamity-blade Sigil': 'Katastrophenklingen-Siegel',
        'Coursing River': 'Woge der Schlange',
        'Cursekeeper': 'Wächter des Fluchs',
        'Dragon\'s Wake': 'Erwachen des Drachen',
        'Explosion': 'Explosion',
        'Fifth Element': 'Fünftes Element',
        'Forbidden Arts': 'Verbotene Künste',
        'Force of Nature': 'Naturgewalt',
        'Fortune-blade Sigil': 'Glücksklingen-Siegel',
        'Great Typhoon': 'Große Welle',
        'Handprint': 'Handabdruck',
        'In/Out': 'Rein/Raus',
        'Infirm Soul': 'Kraftlose Seele',
        'Kanabo': 'Kanabo',
        'Karmic Curse': 'Karmafluch',
        'Kuji-kiri': 'Kuji-kiri',
        'Onmyo Sigil': 'Onmyo-Siegel',
        'Out/In': 'Raus/Rein',
        'Red Rush': 'Roter Ansturm',
        'Serpent Ascending': 'Aufstieg der Schlange',
        'Serpent Descending': 'Niedergang der Schlange',
        'Serpent\'s Fang': 'Schlangengiftzahn',
        'Serpent-eye Sigil': 'Siegel des Schlangenauges',
        'Stoneskin': 'Steinhaut',
        'Strength of Spirit': 'Stärke des Geistes',
        'Summon Shiki': 'Shiki-Beschwörung ',
        'Yama-kagura': 'Yamakagura',
      },
      '~effectNames': {
        'Being dragged under by the current. Unable to move or execute actions.': 'Wie von den Fluten verschluckt. Bewegungsunfähig, Kommandos können nicht ausgeführt werden.',
        'Blunt Resistance Down': 'Schlagresistenz -',
        'Cursekeeper': 'Wächter des Fluchs',
        'Fetters': 'Fesselung',
        'Magic Vulnerability Up': 'Erhöhte Magie-Verwundbarkeit',
        'Water Resistance Down II': 'Wasserresistenz - (stark)',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Aka-no-shiki': 'shiki écarlate',
        'Ao-no-shiki': 'shiki céruléen',
        'Blue Orochi': 'orochi azur',
        'Doro-no-shiki': 'shiki fangeux',
        'Iwa-no-shiki': 'shiki rocailleux',
        'Numa-no-shiki': 'shiki uligineux',
        'Seiryu': 'Seiryû',
        'Yama-no-shiki': 'shiki montagneux',
      },
      'replaceText': {
        '--rotate--': '--rotate--', // FIXME
        '100-tonze Swing': 'Swing de 100 tonz',
        'Blazing Aramitama': 'Aramitama incandescent',
        'Blue Bolt': 'Percée bleue',
        'Calamity-blade Sigil': 'Lame lunaire',
        'Coursing River': 'Vague de serpents',
        'Cursekeeper': 'Katashiro',
        'Dragon\'s Wake': 'Ascension draconique',
        'Explosion': 'Explosion',
        'Fifth Element': 'Cinq éléments',
        'Forbidden Arts': 'Lame interdite',
        'Force of Nature': 'Main écrasante',
        'Fortune-blade Sigil': 'Lame solaire',
        'Great Typhoon': 'Flots tumultueux',
        'Handprint': 'Main lourde',
        'In/Out': 'Dedans/Dehors',
        'Infirm Soul': 'Onde d\'amertume',
        'Kanabo': 'Massue démoniaque',
        'Karmic Curse': 'Noroi-gaeshi',
        'Kuji-kiri': 'Kuji-kiri',
        'Onmyo Sigil': 'Onmyo',
        'Out/In': 'Dehors/Dedans',
        'Red Rush': 'Percée rouge',
        'Serpent Ascending': 'Serpent levant',
        'Serpent Descending': 'Serpent couchant',
        'Serpent\'s Fang': 'Dent de serpent',
        'Serpent-eye Sigil': 'Œil de serpent',
        'Stoneskin': 'Cuirasse',
        'Strength of Spirit': 'Chakra',
        'Summon Shiki': 'Invocation de shiki',
        'Yama-kagura': 'Yama-kagura',
      },
      '~effectNames': {
        'Being dragged under by the current. Unable to move or execute actions.': 'Impossible d\'utiliser des actions ou de se déplacer.',
        'Blunt Resistance Down': 'Résistance au contondant réduite',
        'Cursekeeper': 'Katashiro',
        'Fetters': 'Attache',
        'Magic Vulnerability Up': 'Vulnérabilité magique augmentée',
        'Water Resistance Down II': 'Résistance à l\'eau réduite+',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Aka-no-shiki': '紅の式鬼',
        'Ao-no-shiki': '蒼の式鬼',
        'Blue Orochi': '青のオロチ',
        'Doro-no-shiki': '泥の式鬼',
        'Iwa-no-shiki': '岩の式鬼',
        'Numa-no-shiki': '沼の式鬼',
        'Seiryu': '青龍',
        'Yama-no-shiki': '山の式鬼',
      },
      'replaceText': {
        '--rotate--': '--rotate--', // FIXME
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
        'In/Out': 'In/Out', // FIXME
        'Infirm Soul': '虚証弾',
        'Kanabo': '鬼に金棒',
        'Karmic Curse': '呪い返し',
        'Kuji-kiri': '九字切り',
        'Onmyo Sigil': '陰陽の印',
        'Out/In': 'Out/In', // FIXME
        'Red Rush': '赤の突進',
        'Serpent Ascending': '登り龍',
        'Serpent Descending': '降り蛇',
        'Serpent\'s Fang': '蛇牙',
        'Serpent-eye Sigil': '蛇眼の印',
        'Stoneskin': 'ストンスキン',
        'Strength of Spirit': '霊気',
        'Summon Shiki': '式鬼召喚',
        'Yama-kagura': '山神楽',
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
    {
      'locale': 'cn',
      'replaceSync': {
        'Aka-no-shiki': '红之式鬼',
        'Ao-no-shiki': '苍之式鬼',
        'Blue Orochi': '青之大蛇',
        'Doro-no-shiki': '泥之式鬼',
        'Iwa-no-shiki': '岩之式鬼',
        'Numa-no-shiki': '沼之式鬼',
        'Seiryu': '青龙',
        'Yama-no-shiki': '山之式鬼',
      },
      'replaceText': {
        '--rotate--': '--龙回转--',
        '100-tonze Swing': '百吨回转',
        'Blazing Aramitama': '荒魂燃烧',
        'Blue Bolt': '青突进',
        'Calamity-blade Sigil': '阴之刀印',
        'Coursing River': '蛇崩',
        'Cursekeeper': '咒怨的替身',
        'Dragon\'s Wake': '云蒸龙变',
        'Explosion': '爆散',
        'Fifth Element': '阴阳五行',
        'Forbidden Arts': '刀禁咒',
        'Force of Nature': '大压杀',
        'Fortune-blade Sigil': '阳之刀印',
        'Great Typhoon': '荒波',
        'Handprint': '压杀掌',
        'In/Out': '靠近/远离',
        'Infirm Soul': '虚证弹',
        'Kanabo': '如虎添翼',
        'Karmic Curse': '诅咒返还',
        'Kuji-kiri': '九字切',
        'Onmyo Sigil': '阴阳之印',
        'Out/In': '远离/靠近',
        'Red Rush': '赤突进',
        'Serpent Ascending': '升龙',
        'Serpent Descending': '降蛇',
        'Serpent\'s Fang': '蛇牙',
        'Serpent-eye Sigil': '蛇眼之印',
        'Stoneskin': '石肤',
        'Strength of Spirit': '灵气',
        'Summon Shiki': '式鬼召唤',
        'Yama-kagura': '山神乐',
      },
      '~effectNames': {
        'Being dragged under by the current. Unable to move or execute actions.': '被淹没，无法移动，无法使用技能',
        'Blunt Resistance Down': '打击耐性降低',
        'Cursekeeper': '咒怨的替身',
        'Fetters': '拘束',
        'Magic Vulnerability Up': '魔法受伤加重',
        'Water Resistance Down II': '水属性耐性大幅降低',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Aka-no-shiki': '붉은 사역귀',
        'Ao-no-shiki': '푸른 사역귀',
        'Blue Orochi': '푸른 이무기',
        'Doro-no-shiki': '진흙 사역귀',
        'Iwa-no-shiki': '바위 사역귀',
        'Numa-no-shiki': '늪 사역귀',
        'Seiryu': '청룡',
        'Yama-no-shiki': '산 사역귀',
      },
      'replaceText': {
        '--rotate--': '--rotate--', // FIXME
        '100-tonze Swing': '100톤즈 휘두르기',
        'Blazing Aramitama': '아라미타마 연소',
        'Blue Bolt': '푸른 돌진',
        'Calamity-blade Sigil': '음의 칼',
        'Coursing River': '뱀의 행진',
        'Cursekeeper': '저주 인형',
        'Dragon\'s Wake': '운증용변',
        'Explosion': '폭발',
        'Fifth Element': '음양오행',
        'Forbidden Arts': '금단의 주술검',
        'Force of Nature': '대압살',
        'Fortune-blade Sigil': '양의 칼',
        'Great Typhoon': '성난 파도',
        'Handprint': '압살장',
        'In/Out': 'In/Out', // FIXME
        'Infirm Soul': '허증탄',
        'Kanabo': '도깨비 방망이',
        'Karmic Curse': '저주 되돌리기',
        'Kuji-kiri': '구자호신법',
        'Onmyo Sigil': '음양의 인',
        'Out/In': 'Out/In', // FIXME
        'Red Rush': '붉은 돌진',
        'Serpent Ascending': '승천하는 뱀',
        'Serpent Descending': '강림하는 뱀',
        'Serpent\'s Fang': '뱀송곳니',
        'Serpent-eye Sigil': '뱀눈의 인',
        'Stoneskin': '스톤스킨',
        'Strength of Spirit': '영기',
        'Summon Shiki': '사역귀 소환',
        'Yama-kagura': '산타령',
      },
      '~effectNames': {
        'Being dragged under by the current. Unable to move or execute actions.': 'Being dragged under by the current. Unable to move or execute actions.', // FIXME
        'Blunt Resistance Down': '타격 저항 감소',
        'Cursekeeper': '저주 인형',
        'Fetters': '구속',
        'Magic Vulnerability Up': '받는 마법 피해량 증가',
        'Water Resistance Down II': '물속성 저항 감소[강]',
      },
    },
  ],
}];
