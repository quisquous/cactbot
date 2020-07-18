'use strict';

[{
  zoneRegex: {
    en: /^The Second Coil Of Bahamut - Turn \(4\)$/,
    cn: /^巴哈姆特大迷宫 \(入侵之章4\)$/,
  },
  zoneId: ZoneId.TheSecondCoilOfBahamutTurn4,
  timelineFile: 't9.txt',
  timelineTriggers: [
    {
      id: 'T9 Claw',
      regex: /Bahamut's Claw x5/,
      beforeSeconds: 5,
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer' || data.job == 'BLU';
      },
      response: Responses.tankBuster(),
    },
    {
      id: 'T9 Dalamud Dive',
      regex: /Dalamud Dive/,
      beforeSeconds: 5,
      infoText: {
        en: 'Dive on Main Tank',
        de: 'Sturz auf den Main Tank',
        fr: 'Plongeon sur le Main Tank',
        cn: '凶鸟跳点MT',
      },
    },
    {
      id: 'T9 Super Nova',
      regex: /Super Nova x3/,
      beforeSeconds: 4,
      infoText: {
        en: 'Bait Super Novas Outside',
        de: 'Köder Supernova draußen',
        fr: 'Attirez les Supernovas à l\'extérieur',
        cn: '人群外放黑洞',
      },
    },
  ],
  triggers: [
    {
      id: 'T9 Raven Blight You',
      netRegex: NetRegexes.gainsEffect({ effectId: '1CA' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      delaySeconds: function(data, matches) {
        return matches.duration - 5;
      },
      durationSeconds: 5,
      alarmText: {
        en: 'Blight on YOU',
        de: 'Pestschwinge auf DIR',
        fr: 'Bile de rapace sur VOUS',
        cn: '毒气点名',
      },
    },
    {
      id: 'T9 Raven Blight Not You',
      netRegex: NetRegexes.gainsEffect({ effectId: '1CA' }),
      condition: function(data, matches) {
        return data.me != matches.target;
      },
      delaySeconds: function(data, matches) {
        return matches.duration - 5;
      },
      durationSeconds: 5,
      infoText: function(data, matches) {
        return {
          en: 'Blight on ' + data.ShortName(matches.target),
          de: 'Pestschwinge auf ' + data.ShortName(matches.target),
          fr: 'Bile de rapace sur ' + data.ShortName(matches.target),
          cn: '毒气点' + data.ShortName(matches.target),
        };
      },
    },
    {
      id: 'T9 Meteor',
      netRegex: NetRegexes.headMarker({ id: '000[7A9]' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      response: Responses.meteorOnYou(),
    },
    {
      id: 'T9 Meteor Stream',
      netRegex: NetRegexes.headMarker({ id: '0008' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      response: Responses.spread(),
    },
    {
      id: 'T9 Stack',
      netRegex: NetRegexes.headMarker({ id: '000F' }),
      alertText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Thermo on YOU',
            de: 'Thermo auf DIR',
            fr: 'Thermo sur VOUS',
            cn: '分摊点名',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches.target),
          de: 'Sammeln auf ' + data.ShortName(matches.target),
          fr: 'Packez-vous sur ' + data.ShortName(matches.target),
          cn: '靠近' + data.ShortName(matches.target) + '分摊',
        };
      },
    },
    {
      id: 'T9 Phase 2',
      regex: Regexes.hasHP({ name: 'Nael Deus Darnus', hp: '64', capture: false }),
      regexDe: Regexes.hasHP({ name: 'Nael Deus Darnus', hp: '64', capture: false }),
      regexFr: Regexes.hasHP({ name: 'Nael Deus Darnus', hp: '64', capture: false }),
      regexJa: Regexes.hasHP({ name: 'ネール・デウス・ダーナス', hp: '64', capture: false }),
      regexCn: Regexes.hasHP({ name: '奈尔·神·达纳斯', hp: '64', capture: false }),
      regexKo: Regexes.hasHP({ name: '넬 데우스 다르누스', hp: '64', capture: false }),
      sound: 'Long',
    },
    {
      id: 'T9 Earthshock',
      netRegex: NetRegexes.startsUsing({ id: '7F5', source: 'Dalamud Spawn', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '7F5', source: 'Dalamud-Golem', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '7F5', source: 'Golem De Dalamud', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '7F5', source: 'ダラガブゴーレム', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '7F5', source: '卫月巨像', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '7F5', source: '달라가브 골렘', capture: false }),
      condition: function(data) {
        return data.CanSilence();
      },
      alertText: {
        en: 'Silence Blue Golem',
        de: 'Blauen Golem verstummen',
        fr: 'Interrompez le Golem bleu',
        cn: '沉默蓝色小怪',
      },
    },
    {
      id: 'T9 Heavensfall',
      netRegex: NetRegexes.startsUsing({ id: '83B', source: 'Nael Deus Darnus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '83B', source: 'Nael Deus Darnus', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '83B', source: 'Nael Deus Darnus', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '83B', source: 'ネール・デウス・ダーナス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '83B', source: '奈尔·神·达纳斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '83B', source: '넬 데우스 다르누스', capture: false }),
      alertText: {
        en: 'Heavensfall',
        de: 'Himmelssturz',
        fr: 'Destruction universelle',
        cn: '击退AOE',
      },
    },
    {
      id: 'T9 Garotte Twist Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: '1CE' }),
      condition: function(data, matches) {
        return data.me == matches.target && !data.garotte;
      },
      infoText: {
        en: 'Garotte on YOU',
        de: 'Leicht fixierbar auf DIR',
        fr: 'Sangle accélérée sur VOUS',
        cn: '连坐点名',
      },
      run: function(data) {
        data.garotte = true;
      },
    },
    {
      id: 'T9 Ghost Death',
      netRegex: NetRegexes.ability({ id: '7FA', source: 'The Ghost Of Meracydia', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '7FA', source: 'Geist Von Meracydia', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '7FA', source: 'Fantôme Méracydien', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '7FA', source: 'メラシディアン・ゴースト', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '7FA', source: '美拉西迪亚幽龙', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '7FA', source: '메라시디아의 유령', capture: false }),
      condition: function(data) {
        return data.garotte;
      },
      alarmText: {
        en: 'Cleanse Garotte',
        de: 'reinige Leicht fixierbar',
        fr: 'Dissipez Sangle accélérée',
        cn: '踩白圈',
      },
    },
    {
      id: 'T9 Garotte Twist Lose',
      netRegex: NetRegexes.losesEffect({ effectId: '1CE' }),
      condition: function(data, matches) {
        return data.me == matches.target && data.garotte;
      },
      run: function(data) {
        delete data.garotte;
      },
    },
    {
      id: 'T9 Final Phase',
      netRegex: NetRegexes.startsUsing({ id: '7E6', source: 'Nael Deus Darnus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '7E6', source: 'Nael Deus Darnus', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '7E6', source: 'Nael Deus Darnus', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '7E6', source: 'ネール・デウス・ダーナス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '7E6', source: '奈尔·神·达纳斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '7E6', source: '넬 데우스 다르누스', capture: false }),
      condition: function(data) {
        return !data.seenFinalPhase;
      },
      sound: 'Long',
      run: function(data) {
        data.seenFinalPhase = true;
      },
    },
    {
      id: 'T9 Dragon Locations',
      netRegex: NetRegexes.addedCombatantFull({ name: ['Firehorn', 'Iceclaw', 'Thunderwing'] }),
      netRegexDe: NetRegexes.addedCombatantFull({ name: ['Feuerhorn', 'Eisklaue', 'Donnerschwinge'] }),
      netRegexFr: NetRegexes.addedCombatantFull({ name: ['Corne-De-Feu', 'Griffe-De-Glace', 'Aile-De-Foudre'] }),
      netRegexJa: NetRegexes.addedCombatantFull({ name: ['ファイアホーン', 'アイスクロウ', 'サンダーウィング'] }),
      netRegexCn: NetRegexes.addedCombatantFull({ name: ['火角', '冰爪', '雷翼'] }),
      netRegexKo: NetRegexes.addedCombatantFull({ name: ['화염뿔', '얼음발톱', '번개날개'] }),
      run: function(data, matches) {
        // Lowercase all of the names here for case insensitive matching.
        let allNames = {
          en: ['firehorn', 'iceclaw', 'thunderwing'],
          de: ['feuerhorn', 'eisklaue', 'donnerschwinge'],
          fr: ['corne-de-feu', 'griffe-de-glace ', 'aile-de-foudre'],
          ja: ['ファイアホーン', 'アイスクロウ', 'サンダーウィング'],
          cn: ['火角', '冰爪', '雷翼'],
          ko: ['화염뿔', '얼음발톱', '번개날개'],
        };
        let names = allNames[data.parserLang];
        let idx = names.indexOf(matches.name.toLowerCase());
        if (idx == -1)
          return;

        let x = parseFloat(matches.x);
        let y = parseFloat(matches.y);

        // Most dragons are out on a circle of radius=~28.
        // Ignore spurious dragons like "Pos: (0.000919255,0.006120025,2.384186E-07)"
        if (x * x + y * y < 20 * 20)
          return;

        // Positions are the 8 cardinals + numerical slop on a radius=28 circle.
        // N = (0, -28), E = (28, 0), S = (0, 28), W = (-28, 0)
        // Map N = 0, NE = 1, ..., NW = 7
        let dir = Math.round(4 - 4 * Math.atan2(x, y) / Math.PI) % 8;

        data.dragons = data.dragons || [0, 0, 0];
        data.dragons[idx] = dir;
      },
    },
    {
      id: 'T9 Final Phase Reset',
      netRegex: NetRegexes.startsUsing({ id: '7E6', source: 'Nael Deus Darnus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '7E6', source: 'Nael Deus Darnus', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '7E6', source: 'Nael Deus Darnus', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '7E6', source: 'ネール・デウス・ダーナス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '7E6', source: '奈尔·神·达纳斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '7E6', source: '넬 데우스 다르누스', capture: false }),
      run: function(data) {
        data.tetherCount = 0;
        data.naelDiveMarkerCount = 0;

        // Missing dragons??
        if (!data.dragons || data.dragons.length != 3) {
          data.naelMarks = ['?', '?'];
          data.safeZone = '?';
          return;
        }

        // T9 normal dragons are easy.
        // The first two are always split, so A is the first dragon + 1.
        // The last one is single, so B is the last dragon + 1.

        let dragons = data.dragons.sort();
        let dirNames = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        data.naelMarks = [dragons[0], dragons[2]].map(function(i) {
          return dirNames[(i + 1) % 8];
        });

        // Safe zone is one to the left of the first dragon, unless
        // the last dragon is diving there.  If that's true, use
        // one to the right of the second dragon.
        let possibleSafe = (dragons[0] - 1 + 8) % 8;
        if ((dragons[2] + 2) % 8 == possibleSafe)
          possibleSafe = (dragons[1] + 1) % 8;
        data.safeZone = dirNames[possibleSafe];
      },
    },
    {
      id: 'T9 Dragon Marks',
      netRegex: NetRegexes.startsUsing({ id: '7E6', source: 'Nael Deus Darnus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '7E6', source: 'Nael Deus Darnus', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '7E6', source: 'Nael Deus Darnus', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '7E6', source: 'ネール・デウス・ダーナス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '7E6', source: '奈尔·神·达纳斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '7E6', source: '넬 데우스 다르누스', capture: false }),
      durationSeconds: 12,
      infoText: function(data) {
        return {
          en: 'Marks: ' + data.naelMarks.join(', '),
          de: 'Markierungen : ' + data.naelMarks.join(', '),
          fr: 'Marque : ' + data.naelMarks.join(', '),
          ja: 'マーカー: ' + data.naelMarks.join(', '),
          cn: '标记： ' + data.naelMarks.join(', '),
        };
      },
    },
    {
      id: 'T9 Tether',
      netRegex: NetRegexes.tether({ id: '0005', source: 'Firehorn' }),
      netRegexDe: NetRegexes.tether({ id: '0005', source: 'Feuerhorn' }),
      netRegexFr: NetRegexes.tether({ id: '0005', source: 'Corne-De-Feu' }),
      netRegexJa: NetRegexes.tether({ id: '0005', source: 'ファイアホーン' }),
      netRegexCn: NetRegexes.tether({ id: '0005', source: '火角' }),
      netRegexKo: NetRegexes.tether({ id: '0005', source: '화염뿔' }),
      preRun: function(data) {
        data.tetherCount = data.tetherCount || 0;
        data.tetherCount++;
        // Out, In, Out, In
        data.tetherDir = data.tetherCount % 2 ? 'Fire Out' : 'Fire In';
      },
      alertText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: data.tetherDir + ' (on YOU)',
            de: data.tetherDir + ' (auf DIR)',
            fr: data.tetherDir + ' (sur VOUS)',
            cn: data.tetherDir + ' (点名)',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches.target) {
          return {
            en: data.tetherDir + ' (on ' + data.ShortName(matches.target) + ')',
            de: data.tetherDir + ' (auf ' + data.ShortName(matches.target) + ')',
            fr: data.tetherDir + ' (sur ' + data.ShortName(matches.target) + ')',
            cn: data.tetherDir + ' (点 ' + data.ShortName(matches.target) + ')',
          };
        }
      },
    },
    {
      id: 'T9 Thunder',
      netRegex: NetRegexes.ability({ source: 'Thunderwing', id: '7FD' }),
      netRegexDe: NetRegexes.ability({ source: 'Donnerschwinge', id: '7FD' }),
      netRegexFr: NetRegexes.ability({ source: 'Aile-De-Foudre', id: '7FD' }),
      netRegexJa: NetRegexes.ability({ source: 'サンダーウィング', id: '7FD' }),
      netRegexCn: NetRegexes.ability({ source: '雷翼', id: '7FD' }),
      netRegexKo: NetRegexes.ability({ source: '번개날개', id: '7FD' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alarmText: {
        en: 'Thunder on YOU',
        de: 'Blitz auf DIR',
        fr: 'Foudre sur VOUS',
        ja: '自分にサンダー',
        cn: '雷点名',
      },
    },
    {
      id: 'T9 Dragon Safe Zone',
      netRegex: NetRegexes.headMarker({ id: '0014', capture: false }),
      delaySeconds: 3,
      durationSeconds: 6,
      suppressSeconds: 20,
      infoText: function(data) {
        return 'Safe zone: ' + data.safeZone;
      },
    },
    {
      id: 'T9 Dragon Marker',
      netRegex: NetRegexes.headMarker({ id: '0014' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alarmText: function(data, matches) {
        data.naelDiveMarkerCount = data.naelDiveMarkerCount || 0;
        if (matches.target != data.me)
          return;
        let marker = ['A', 'B', 'C'][data.naelDiveMarkerCount];
        let dir = data.naelMarks[data.naelDiveMarkerCount];
        return {
          en: 'Go To ' + marker + ' (in ' + dir + ')',
          de: 'Gehe zu ' + marker + ' (im ' + dir + ')',
          fr: 'Allez en ' + marker + ' (au ' + dir + ')',
          ja: marker + 'に行く' + ' (あと ' + dir + '秒)',
          cn: '去' + marker + ' (在 ' + dir + '秒)',
        };
      },
      tts: function(data, matches) {
        data.naelDiveMarkerCount = data.naelDiveMarkerCount || 0;
        if (matches.target != data.me)
          return;
        return {
          en: 'Go To ' + ['A', 'B', 'C'][data.naelDiveMarkerCount],
          de: 'Gehe zu ' + ['A', 'B', 'C'][data.naelDiveMarkerCount],
          fr: 'Allez en ' + ['A', 'B', 'C'][data.naelDiveMarkerCount],
          ja: ['A', 'B', 'C'][data.naelDiveMarkerCount] + '行くよ',
          cn: '去' + ['A', 'B', 'C'][data.naelDiveMarkerCount],
        };
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Astral Debris': 'Lichtgestein',
        'Dalamud Fragment': 'Dalamud-Bruchstück',
        'Dalamud Spawn': 'Dalamud-Golem',
        'Firehorn': 'Feuerhorn',
        'Iceclaw': 'Eisklaue',
        'Nael Geminus': 'Nael Geminus',
        'Nael deus Darnus': 'Nael deus Darnus',
        'Ragnarok': 'Ragnarök',
        'The Ghost Of Meracydia': 'Geist von Meracydia',
        'Thunderwing': 'Donnerschwinge',
        'Umbral Debris': 'Schattengestein',
      },
      'replaceText': {
        '(?<! )Meteor(?! Stream)': 'Meteor',
        'Bahamut\'s Claw': 'Klauen Bahamuts',
        'Bahamut\'s Favor': 'Bahamuts Segen',
        'Binding Coil': 'Verschlungene Schatten',
        'Cauterize': 'Kauterisieren',
        'Chain Lightning': 'Kettenblitz',
        'Dalamud Dive': 'Dalamud-Sturzflug',
        'Divebomb': 'Sturzbombe',
        'Fireball': 'Feuerball',
        'Ghost': 'Geist',
        'Golem Meteors': 'Golem Meteore',
        'Heavensfall': 'Himmelsfall',
        'Iron Chariot': 'Eiserner Streitwagen',
        'Lunar Dynamo': 'Lunarer Dynamo',
        'Megaflare': 'Megaflare',
        'Meteor Stream': 'Meteorflug',
        'Raven Dive': 'Bahamuts Schwinge',
        'Ravensbeak': 'Bradamante',
        'Ravensclaw': 'Silberklauen',
        'Stardust': 'Sternenstaub',
        'Super Nova': 'Supernova',
        'Thermionic Beam': 'Thermionischer Strahl',
        '\\(East\\)': '(Osten)',
        '\\(In\\)': '(Rein)',
        '\\(North\\)': '(Norden)',
        '\\(Out\\)': '(Raus)',
        '\\(South\\)': '(Süden)',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Astral Debris': 'Débris Astral',
        'Dalamud Fragment': 'Débris De Dalamud',
        'Dalamud Spawn': 'Golem De Dalamud',
        'Firehorn': 'Corne-De-Feu',
        'Iceclaw': 'Griffe-De-Glace',
        'Nael Geminus': 'Nael Geminus',
        'Nael deus Darnus': 'Nael Deus Darnus',
        'Ragnarok': 'Ragnarok',
        'The Ghost Of Meracydia': 'Fantôme Méracydien',
        'Thunderwing': 'Aile-De-Foudre',
        'Umbral Debris': 'Débris Ombral',
      },
      'replaceText': {
        '(?<! )Meteor(?! Stream)': 'Météore',
        'Bahamut\'s Claw': 'Griffe de Bahamut',
        'Bahamut\'s Favor': 'Auspice du dragon',
        'Binding Coil': 'Écheveau entravant',
        'Cauterize': 'Cautérisation',
        'Chain Lightning': 'Chaîne d\'éclairs',
        'Dalamud Dive': 'Chute de Dalamud',
        'Divebomb Mark': 'Bombe plongeante, marque',
        'Fireball': 'Boule de feu',
        'Ghost Add': 'Add Fantôme',
        'Golem Meteors': 'Golem de Dalamud',
        'Heavensfall': 'Destruction universelle',
        'Iron Chariot': 'Char de fer',
        'Lunar Dynamo': 'Dynamo lunaire',
        'Megaflare': 'MégaBrasier',
        'Meteor Stream': 'Rayon météore',
        'Raven Dive': 'Fonte du rapace',
        'Ravensbeak': 'Bec du rapace',
        'Ravensclaw': 'Serre du rapace',
        'Stardust': 'Poussière d\'étoile',
        'Super Nova': 'Supernova',
        'Thermionic Beam': 'Rayon thermoïonique',
        '\\(East\\)': '(Est)',
        '\\(In\\)': '(Intérieur)',
        '\\(North\\)': '(Nord)',
        '\\(Out\\)': '(Extérieur)',
        '\\(South\\)': '(Sud)',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Astral Debris': 'アストラルデブリ',
        'Dalamud Fragment': 'ダラガブデブリ',
        'Dalamud Spawn': 'ダラガブゴーレム',
        'Firehorn': 'ファイアホーン',
        'Iceclaw': 'アイスクロウ',
        'Nael Geminus': 'ネール・ジェミナス',
        'Nael deus Darnus': 'ネール・デウス・ダーナス',
        'Ragnarok': 'ラグナロク',
        'The Ghost Of Meracydia': 'メラシディアン・ゴースト',
        'Thunderwing': 'サンダーウィング',
        'Umbral Debris': 'アンブラルデブリ',
      },
      'replaceText': {
        '(?<! )Meteor(?! Stream)': 'メテオ',
        'Bahamut\'s Claw': 'バハムートクロウ',
        'Bahamut\'s Favor': '龍神の加護',
        'Binding Coil': 'バインディングコイル',
        'Cauterize': 'カータライズ',
        'Chain Lightning': 'チェインライトニング',
        'Dalamud Dive': 'ダラガブダイブ',
        'Divebomb': 'ダイブボム',
        'Fireball': 'ファイアボール',
        'Ghost': 'ゴースト',
        'Heavensfall': 'ヘヴンスフォール',
        'Iron Chariot': 'アイアンチャリオット',
        'Lunar Dynamo': 'ルナダイナモ',
        'Megaflare': 'メガフレア',
        'Meteor Stream': 'メテオストリーム',
        'Raven Dive': 'レイヴンダイブ',
        'Ravensbeak': 'レイヴェンズビーク',
        'Ravensclaw': 'レイヴェンズクロウ',
        'Stardust': 'スターダスト',
        'Super Nova': 'スーパーノヴァ',
        'Thermionic Beam': 'サーミオニックビーム',
      },
    },
    {
      'locale': 'cn',
      'missingTranslations': true,
      'replaceSync': {
        'Astral Debris': '星极岩屑',
        'Dalamud Fragment': '卫月岩屑',
        'Dalamud Spawn': '卫月巨像',
        'Firehorn': '火角',
        'Iceclaw': '冰爪',
        'Nael Geminus': '奈尔双生子',
        'Nael deus Darnus': '奈尔·神·达纳斯',
        'Ragnarok': '诸神黄昏',
        'The Ghost Of Meracydia': '美拉西迪亚幽龙',
        'Thunderwing': '雷翼',
        'Umbral Debris': '灵极岩屑',
      },
      'replaceText': {
        '(?<! )Meteor(?! Stream)': '陨石',
        'Bahamut\'s Claw': '巴哈姆特之爪',
        'Bahamut\'s Favor': '龙神的加护',
        'Binding Coil': '拘束圈',
        'Cauterize': '低温俯冲',
        'Chain Lightning': '雷光链',
        'Dalamud Dive': '月华冲',
        'Divebomb': '爆破俯冲',
        'Fireball': '火球',
        'Ghost': '幽灵',
        'Heavensfall': '惊天动地',
        'Iron Chariot': '钢铁战车',
        'Lunar Dynamo': '月流电圈',
        'Megaflare': '百万核爆',
        'Meteor Stream': '陨石流',
        'Raven Dive': '凶鸟冲',
        'Ravensbeak': '凶鸟尖喙',
        'Ravensclaw': '凶鸟利爪',
        'Stardust': '星尘',
        'Super Nova': '超新星',
        'Thermionic Beam': '热离子光束',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {
        'Astral Debris': '천상의 잔해',
        'Dalamud Fragment': '달라가브의 잔해',
        'Dalamud Spawn': '달라가브 골렘',
        'Firehorn': '화염뿔',
        'Iceclaw': '얼음발톱',
        'Nael Geminus': '넬 게미누스',
        'Nael deus Darnus': '넬 데우스 다르누스',
        'Ragnarok': '라그나로크',
        'The Ghost Of Meracydia': '메라시디아의 유령',
        'Thunderwing': '번개날개',
        'Umbral Debris': '저승의 잔해',
      },
      'replaceText': {
        '(?<! )Meteor(?! Stream)': '메테오',
        'Bahamut\'s Claw': '바하무트의 발톱',
        'Bahamut\'s Favor': '용신의 가호',
        'Binding Coil': '구속의 고리',
        'Cauterize': '인두질',
        'Chain Lightning': '번개 사슬',
        'Dalamud Dive': '달라가브 강하',
        'Divebomb': '급강하 폭격',
        'Fireball': '화염구',
        'Ghost': '유령',
        'Heavensfall': '천지 붕괴',
        'Iron Chariot': '강철 전차',
        'Lunar Dynamo': '달의 원동력',
        'Megaflare': '메가플레어',
        'Meteor Stream': '유성 폭풍',
        'Raven Dive': '흉조의 강하',
        'Ravensbeak': '흉조의 부리',
        'Ravensclaw': '흉조의 발톱',
        'Stardust': '별조각',
        'Super Nova': '초신성',
        'Thermionic Beam': '열전자 광선',
      },
    },
  ],
}];
