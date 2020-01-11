'use strict';

[{
  zoneRegex: /^The Second Coil Of Bahamut - Turn \(4\)$/,
  timelineFile: 't9.txt',
  timelineTriggers: [
    {
      id: 'T9 Claw',
      regex: /Bahamut's Claw x5/,
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer' || data.job == 'BLU';
      },
      beforeSeconds: 5,
      infoText: {
        en: 'Tankbuster',
      },
    },
    {
      id: 'T9 Dalamud Dive',
      regex: /Dalamud Dive/,
      beforeSeconds: 5,
      infoText: {
        en: 'Dive on Main Tank',
      },
    },
    {
      id: 'T9 Super Nova',
      regex: /Super Nova x3/,
      beforeSeconds: 4,
      infoText: {
        en: 'Bait Super Novas Outside',
      },
    },
  ],
  triggers: [
    {
      id: 'T9 Raven Blight You',
      regex: Regexes.gainsEffect({ effect: 'Raven Blight' }),
      regexDe: Regexes.gainsEffect({ effect: 'Pestschwinge' }),
      regexFr: Regexes.gainsEffect({ effect: 'Bile De Rapace' }),
      regexJa: Regexes.gainsEffect({ effect: '凶鳥毒気' }),
      regexCn: Regexes.gainsEffect({ effect: '凶鸟毒气' }),
      regexKo: Regexes.gainsEffect({ effect: '흉조의 독' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      delaySeconds: function(data, matches) {
        return matches.duration - 5;
      },
      durationSeconds: 5,
      alarmText: {
        en: 'Blight on YOU',
      },
    },
    {
      id: 'T9 Raven Blight You',
      regex: Regexes.gainsEffect({ effect: 'Raven Blight' }),
      regexDe: Regexes.gainsEffect({ effect: 'Pestschwinge' }),
      regexFr: Regexes.gainsEffect({ effect: 'Bile De Rapace' }),
      regexJa: Regexes.gainsEffect({ effect: '凶鳥毒気' }),
      regexCn: Regexes.gainsEffect({ effect: '凶鸟毒气' }),
      regexKo: Regexes.gainsEffect({ effect: '흉조의 독' }),
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
        };
      },
    },
    {
      id: 'T9 Meteor Stream',
      regex: Regexes.headMarker({ id: '000[7A9]' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Meteor on YOU',
      },
    },
    {
      id: 'T9 Meteor Stream',
      regex: Regexes.headMarker({ id: '0008' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Spread (Meteor Stream)',
      },
    },
    {
      id: 'T9 Stack',
      regex: Regexes.headMarker({ id: '000F' }),
      alertText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Thermo on YOU',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches.target),
        };
      },
    },
    {
      id: 'T9 Phase 2',
      regex: /:Nael deus Darnus HP at 64%/,
      sound: 'Long',
    },
    {
      id: 'T9 Earthshock',
      regex: Regexes.startsUsing({ id: '7F5', source: 'Dalamud Spawn', capture: false }),
      regexDe: Regexes.startsUsing({ id: '7F5', source: 'Dalamud-Golem', capture: false }),
      regexFr: Regexes.startsUsing({ id: '7F5', source: 'Golem De Dalamud', capture: false }),
      regexJa: Regexes.startsUsing({ id: '7F5', source: 'ダラガブゴーレム', capture: false }),
      regexCn: Regexes.startsUsing({ id: '7F5', source: '卫月巨像', capture: false }),
      regexKo: Regexes.startsUsing({ id: '7F5', source: '달라가브 골렘', capture: false }),
      condition: function(data) {
        return data.CanSilence();
      },
      alertText: {
        en: 'Silence Blue Golem',
      },
    },
    {
      id: 'T9 Heavensfall',
      regex: Regexes.startsUsing({ id: '83B', source: 'Nael Deus Darnus', capture: false }),
      regexDe: Regexes.startsUsing({ id: '83B', source: 'Nael Deus Darnus', capture: false }),
      regexFr: Regexes.startsUsing({ id: '83B', source: 'Nael Deus Darnus', capture: false }),
      regexJa: Regexes.startsUsing({ id: '83B', source: 'ネール・デウス・ダーナス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '83B', source: '奈尔·神·达纳斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '83B', source: '넬 데우스 다르누스', capture: false }),
      alertText: {
        en: 'Heavensfall',
      },
    },
    {
      id: 'T9 Garotte Twist Gain',
      regex: Regexes.gainsEffect({ effect: 'Garrote Twist' }),
      regexDe: Regexes.gainsEffect({ effect: 'Leicht Fixierbar' }),
      regexFr: Regexes.gainsEffect({ effect: 'Sangle Accélérée' }),
      regexJa: Regexes.gainsEffect({ effect: '拘束加速' }),
      regexCn: Regexes.gainsEffect({ effect: '拘束加速' }),
      regexKo: Regexes.gainsEffect({ effect: '구속 가속' }),
      condition: function(data, matches) {
        return data.me == matches.target && !data.garotte;
      },
      infoText: {
        en: 'Garotte on YOU',
      },
      run: function(data) {
        data.garotte = true;
      },
    },
    {
      id: 'T9 Ghost Death',
      regex: Regexes.ability({ id: '7FA', source: 'The Ghost Of Meracydia', capture: false }),
      regexDe: Regexes.ability({ id: '7FA', source: 'Geist Von Meracydia', capture: false }),
      regexFr: Regexes.ability({ id: '7FA', source: 'Fantôme Méracydien', capture: false }),
      regexJa: Regexes.ability({ id: '7FA', source: 'メラシディアン・ゴースト', capture: false }),
      regexCn: Regexes.ability({ id: '7FA', source: '美拉西迪亚幽龙', capture: false }),
      regexKo: Regexes.ability({ id: '7FA', source: '메라시디아의 유령', capture: false }),
      condition: function(data) {
        return data.garotte;
      },
      alarmText: {
        en: 'Cleanse Garotte',
      },
    },
    {
      id: 'T9 Garotte Twist Lose',
      regex: Regexes.losesEffect({ effect: 'Garrote Twist' }),
      regexDe: Regexes.losesEffect({ effect: 'Leicht Fixierbar' }),
      regexFr: Regexes.losesEffect({ effect: 'Sangle Accélérée' }),
      regexJa: Regexes.losesEffect({ effect: '拘束加速' }),
      regexCn: Regexes.losesEffect({ effect: '拘束加速' }),
      regexKo: Regexes.losesEffect({ effect: '구속 가속' }),
      condition: function(data, matches) {
        return data.me == matches.target && data.garotte;
      },
      run: function(data) {
        delete data.garotte;
      },
    },
    {
      id: 'T9 Final Phase',
      regex: Regexes.startsUsing({ id: '7E6', source: 'Nael Deus Darnus', capture: false }),
      regexDe: Regexes.startsUsing({ id: '7E6', source: 'Nael Deus Darnus', capture: false }),
      regexFr: Regexes.startsUsing({ id: '7E6', source: 'Nael Deus Darnus', capture: false }),
      regexJa: Regexes.startsUsing({ id: '7E6', source: 'ネール・デウス・ダーナス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '7E6', source: '奈尔·神·达纳斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '7E6', source: '넬 데우스 다르누스', capture: false }),
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
      regex: Regexes.addedCombatantFull({ name: ['Firehorn', 'Iceclaw', 'Thunderwing'] }),
      regexDe: Regexes.addedCombatantFull({ name: ['Feuerhorn', 'Eisklaue', 'Donnerschwinge'] }),
      regexFr: Regexes.addedCombatantFull({ name: ['corne-de-feu', 'griffe-de-glace ', 'aile-de-foudre'] }),
      regexJa: Regexes.addedCombatantFull({ name: ['ファイアホーン', 'アイスクロウ', 'サンダーウィング'] }),
      regexCn: Regexes.addedCombatantFull({ name: ['火角', '冰爪', '雷翼'] }),
      regexKo: Regexes.addedCombatantFull({ name: ['화염뿔', '얼음발톱', '번개날개'] }),
      run: function(data, matches) {
        let names = ['Firehorn', 'Iceclaw', 'Thunderwing'];
        let idx = names.indexOf(matches.name);
        if (idx == -1)
          return;

        let x = parseFloat(matches.x);
        let y = parseFloat(matches.y);

        // Most dragons are out on a circle of radius=~28.
        // Ignore spurious dragons like "Pos: (0.000919255,0.006120025,2.384186E-07)"
        if (x*x + y*y < 20*20)
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
      regex: Regexes.startsUsing({ id: '7E6', source: 'Nael Deus Darnus', capture: false }),
      regexDe: Regexes.startsUsing({ id: '7E6', source: 'Nael Deus Darnus', capture: false }),
      regexFr: Regexes.startsUsing({ id: '7E6', source: 'Nael Deus Darnus', capture: false }),
      regexJa: Regexes.startsUsing({ id: '7E6', source: 'ネール・デウス・ダーナス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '7E6', source: '奈尔·神·达纳斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '7E6', source: '넬 데우스 다르누스', capture: false }),
      run: function(data) {
        data.tetherCount = 0;
        data.naelDiveMarkerCount = 0;

        // T9 normal dragons are easy.
        // The first two are always split, so A is the first dragon + 1.
        // The last one is single, so B is the last dragon + 1.
        let dragons = data.dragons.sort();
        let dir_names = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        data.naelMarks = [dragons[0], dragons[2]].map(function(i) {
          return dir_names[(i + 1) % 8];
        });

        // Safe zone is one to the left of the first dragon, unless
        // the last dragon is diving there.  If that's true, use
        // one to the right of the second dragon.
        let possibleSafe = (dragons[0] - 1 + 8) % 8;
        if ((dragons[2] + 2) % 8 == possibleSafe)
          possibleSafe = (dragons[1] + 1) % 8;
        data.safeZone = dir_names[possibleSafe];
      },
    },
    {
      id: 'T9 Dragon Marks',
      regex: Regexes.startsUsing({ id: '7E6', source: 'Nael Deus Darnus', capture: false }),
      regexDe: Regexes.startsUsing({ id: '7E6', source: 'Nael Deus Darnus', capture: false }),
      regexFr: Regexes.startsUsing({ id: '7E6', source: 'Nael Deus Darnus', capture: false }),
      regexJa: Regexes.startsUsing({ id: '7E6', source: 'ネール・デウス・ダーナス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '7E6', source: '奈尔·神·达纳斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '7E6', source: '넬 데우스 다르누스', capture: false }),
      durationSeconds: 12,
      infoText: function(data) {
        return {
          en: 'Marks: ' + data.naelMarks.join(', '),
          fr: 'Marque : ' + data.naelMarks.join(', '),
          de: 'Markierungen : ' + data.naelMarks.join(', '),
          ja: 'マーカー: ' + data.naelMarks.join(', '),
        };
      },
    },
    {
      id: 'T9 Tether',
      regex: Regexes.tether({ id: '0005', source: 'Firehorn' }),
      regexDe: Regexes.tether({ id: '0005', source: 'Feuerhorn' }),
      regexFr: Regexes.tether({ id: '0005', source: 'Corne-De-Feu' }),
      regexJa: Regexes.tether({ id: '0005', source: 'ファイアホーン' }),
      regexCn: Regexes.tether({ id: '0005', source: '火角' }),
      regexKo: Regexes.tether({ id: '0005', source: '화염뿔' }),
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
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches.target) {
          return {
            en: data.tetherDir + ' (on ' + data.ShortName(matches.target) + ')',
          };
        }
      },
    },
    {
      id: 'T9 Thunder',
      // Note: The 0A event happens before 'gains the effect' and 'starts
      // casting on' only includes one person.
      regex: /:Thunderwing:7FD:.*?:\y{ObjectId}:(\y{Name}):/,
      regexDe: /:Donnerschwinge:7FD:.*?:\y{ObjectId}:(\y{Name}):/,
      regexFr: /:Aile-de-foudre:7FD:.*?:\y{ObjectId}:(\y{Name}):/,
      regexJa: /:サンダーウィング:7FD:.*?:\y{ObjectId}:(\y{Name}):/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alarmText: {
        en: 'Thunder on YOU',
        fr: 'Foudre sur VOUS',
        de: 'Blitz auf DIR',
        ja: '自分にサンダー',
      },
      tts: {
        en: 'thunder',
        fr: 'Foudre',
        de: 'blitz',
        ja: 'サンダー',
      },
    },
    {
      id: 'T9 Dragon Safe Zone',
      regex: Regexes.headMarker({ id: '0014', capture: false }),
      delaySeconds: 3,
      durationSeconds: 6,
      suppressSeconds: 20,
      infoText: function(data) {
        return 'Safe zone: ' + data.safeZone;
      },
    },
    {
      id: 'T9 Dragon Marker',
      regex: Regexes.headMarker({ id: '0014' }),
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
          fr: 'Aller en ' + marker + ' (au ' + dir + ')',
          de: 'Gehe zu ' + marker + ' (im ' + dir + ')',
          ja: marker + 'に行く' + ' (あと ' + dir + '秒)',
        };
      },
      tts: function(data, matches) {
        data.naelDiveMarkerCount = data.naelDiveMarkerCount || 0;
        if (matches.target != data.me)
          return;
        return {
          en: 'Go To ' + ['A', 'B', 'C'][data.naelDiveMarkerCount],
          fr: 'Aller en ' + ['A', 'B', 'C'][data.naelDiveMarkerCount],
          de: 'Gehe zu ' + ['A', 'B', 'C'][data.naelDiveMarkerCount],
          ja: ['A', 'B', 'C'][data.naelDiveMarkerCount] + '行くよ',
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
        'Engage!': 'Start!',
        'Firehorn': 'Feuerhorn',
        'Iceclaw': 'Eisklaue',
        'Nael Geminus': 'Nael Geminus',
        'Nael deus Darnus': 'Nael deus Darnus',
        'Ragnarok': 'Ragnarök',
        'Thunderwing': 'Donnerschwinge',
        'Umbral Debris': 'Schattengestein',
      },
      'replaceText': {
        '(In)': '(Rein)',
        '(Out)': '(Raus)',
        '--targetable--': '--anvisierbar--',
        '--untargetable--': '--nich anvisierbar--',
        'Bahamut\'s Claw': 'Klauen Bahamuts',
        'Bahamut\'s Favor': 'Bahamuts Segen',
        'Binding Coil': 'Verschlungene Schatten',
        'Cauterize': 'Kauterisieren',
        'Chain Lightning': 'Kettenblitz',
        'Dalamud Dive': 'Dalamud-Sturzflug',
        'Divebomb': 'Sturzbombe',
        'Enrage': 'Finalangriff',
        'Fireball': 'Feuerball',
        'Ghost': 'Geist',
        'Golem Meteors': 'Golem Meteore',
        'Heavensfall': 'Himmelsfall',
        'Iron Chariot': 'Eiserner Streitwagen',
        'Lunar Dynamo': 'Lunarer Dynamo',
        'Megaflare': 'Megaflare',
        'Meteor': 'Meteor',
        'Meteor Stream': 'Meteorflug',
        'Raven Dive': 'Bahamuts Schwinge',
        'Ravensbeak': 'Bradamante',
        'Ravensclaw': 'Silberklauen',
        'Stardust': 'Sternenstaub',
        'Super Nova': 'Supernova',
        'Thermionic Beam': 'Thermionischer Strahl',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Astral Debris': 'Débris astral',
        'Dalamud Fragment': 'Débris de Dalamud',
        'Engage!': 'À l\'attaque !',
        'Firehorn': 'Corne-de-feu',
        'Iceclaw': 'Griffe-de-glace',
        'Nael Geminus': 'Nael Geminus',
        'Nael deus Darnus': 'Nael deus Darnus',
        'Ragnarok': 'Ragnarok',
        'Thunderwing': 'Aile-de-foudre',
        'Umbral Debris': 'Débris ombral',
      },
      'replaceText': {
        '(In)': '(Dedans)',
        '(Out)': '(Dehors)',
        '--targetable--': '--Ciblable--',
        '--untargetable--': '--Impossible à cibler--',
        'Bahamut\'s Claw': 'Griffe de Bahamut',
        'Bahamut\'s Favor': 'Auspice du dragon',
        'Binding Coil': 'Écheveau entravant',
        'Cauterize': 'Cautérisation',
        'Chain Lightning': 'Chaîne d\'éclairs',
        'Dalamud Dive': 'Chute de Dalamud',
        'Divebomb': 'Bombe plongeante',
        'Enrage': 'Enrage',
        'Fireball': 'Boule de feu',
        'Ghost': 'fantôme',
        'Golem Meteors': 'Golem de Dalamud',
        'Heavensfall': 'Chute céleste',
        'Iron Chariot': 'Char de fer',
        'Lunar Dynamo': 'Dynamo lunaire',
        'Megaflare': 'MégaBrasier',
        'Meteor': 'Météore',
        'Meteor Stream': 'Rayon météore',
        'Raven Dive': 'Fonte du rapace',
        'Ravensbeak': 'Bec du rapace',
        'Ravensclaw': 'Serre du rapace',
        'Stardust': 'Poussière d\'étoile',
        'Super Nova': 'Supernova',
        'Thermionic Beam': 'Rayon thermoïonique',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Astral Debris': 'アストラルデブリ',
        'Dalamud Fragment': 'ダラガブデブリ',
        'Engage!': '戦闘開始！',
        'Firehorn': 'ファイアホーン',
        'Iceclaw': 'アイスクロウ',
        'Nael Geminus': 'ネール・ジェミナス',
        'Nael deus Darnus': 'ネール・デウス・ダーナス',
        'Ragnarok': 'ラグナロク',
        'Thunderwing': 'サンダーウィング',
        'Umbral Debris': 'アンブラルデブリ',
      },
      'replaceText': {
        '(In)': '(In)',
        '(Out)': '(Out)',
        '--targetable--': '--targetable--',
        '--untargetable--': '--untargetable--',
        'Bahamut\'s Claw': 'バハムートクロウ',
        'Bahamut\'s Favor': '龍神の加護',
        'Binding Coil': 'バインディングコイル',
        'Cauterize': 'カータライズ',
        'Chain Lightning': 'チェインライトニング',
        'Dalamud Dive': 'ダラガブダイブ',
        'Divebomb': 'ダイブボム',
        'Enrage': 'Enrage',
        'Fireball': 'ファイアボール',
        'Ghost': 'ゴースト',
        'Golem Meteors': 'Golem Meteors', // FIXME
        'Heavensfall': 'ヘヴンスフォール',
        'Iron Chariot': 'アイアンチャリオット',
        'Lunar Dynamo': 'ルナダイナモ',
        'Megaflare': 'メガフレア',
        'Meteor': 'メテオ',
        'Meteor Stream': 'メテオストリーム',
        'Raven Dive': 'レイヴンダイブ',
        'Ravensbeak': 'レイヴェンズビーク',
        'Ravensclaw': 'レイヴェンズクロウ',
        'Stardust': 'スターダスト',
        'Super Nova': 'スーパーノヴァ',
        'Thermionic Beam': 'サーミオニックビーム',
      },
    },
  ],
}];
