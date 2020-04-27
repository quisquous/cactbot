'use strict';

[{
  zoneRegex: {
    en: /^The Royal City Of Rabanastre$/,
    cn: /^失落之都拉巴纳斯塔$/,
    ko: /^왕도 라바나스터$/,
  },
  timelineFile: 'royal_city_of_rabanastre.txt',
  triggers: [
    {
      id: 'Rab Mateus Aqua Sphere',
      regex: Regexes.startsUsing({ id: '2633', source: 'Mateus, The Corrupt', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2633', source: 'Mateus (?:der|die|das) Peiniger', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2633', source: 'Mateus Le Corrompu', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2633', source: '背徳の皇帝マティウス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2633', source: '背德皇帝马提乌斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2633', source: '배덕의 황제 마티우스', capture: false }),
      delaySeconds: 11,
      infoText: {
        en: 'Kill Aqua Spheres',
        de: 'Wasserkugeln zerstören',
        fr: 'Détruire les bulles d\'eau',
        cn: '击杀水球',
        ko: '물 구체 죽이기',
      },
      tts: {
        en: 'adds',
        de: 'etz',
        fr: 'adds',
        cn: '击杀水球',
        ko: '쫄 추가',
      },
    },
    {
      id: 'Rab Mateus Breathless Gain',
      regex: Regexes.gainsEffect({ effect: 'Breathless' }),
      regexDe: Regexes.gainsEffect({ effect: 'Atemnot' }),
      regexFr: Regexes.gainsEffect({ effect: 'Suffocation' }),
      regexJa: Regexes.gainsEffect({ effect: '呼吸困難' }),
      regexCn: Regexes.gainsEffect({ effect: '呼吸困难' }),
      regexKo: Regexes.gainsEffect({ effect: '호흡곤란' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alarmText: function(data) {
        if (data.breathless == 6) {
          return {
            en: 'Get In Bubble',
            de: 'Geh in die Blase',
            fr: 'Allez dans une bulle',
            cn: '进气泡',
            ko: '물방울 안으로',
          };
        }
      },
      infoText: function(data) {
        if (data.breathless >= 7) {
          return {
            en: 'Breathless: ' + (data.breathless + 1),
            de: 'Atemnot: ' + (data.breathless + 1),
            fr: 'Suffocation :' + (data.breathless + 1),
            cn: '窒息层数:' + (data.breathless + 1),
            ko: '호흡곤란: ' + (data.breathless + 1),
          };
        }
      },
      tts: function(data) {
        if (data.breathless == 6) {
          return {
            en: 'bubble',
            de: 'blase',
            fr: 'bulle',
            cn: '进气泡',
            ko: '숨쉬어!',
          };
        }
      },
      run: function(data) {
        data.breathless = data.breathless | 0;
        data.breathless++;
      },
    },
    {
      id: 'Rab Mateus Breathless Lose',
      regex: Regexes.losesEffect({ effect: 'Breathless' }),
      regexDe: Regexes.losesEffect({ effect: 'Atemnot' }),
      regexFr: Regexes.losesEffect({ effect: 'Suffocation' }),
      regexJa: Regexes.losesEffect({ effect: '呼吸困難' }),
      regexCn: Regexes.losesEffect({ effect: '呼吸困难' }),
      regexKo: Regexes.losesEffect({ effect: '호흡곤란' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      run: function(data) {
        data.breathless = 0;
      },
    },
    {
      id: 'Rab Mateus Blizzard IV',
      regex: Regexes.startsUsing({ id: '263D', source: 'Mateus, The Corrupt', capture: false }),
      regexDe: Regexes.startsUsing({ id: '263D', source: 'Mateus (?:der|die|das) Peiniger', capture: false }),
      regexFr: Regexes.startsUsing({ id: '263D', source: 'Mateus Le Corrompu', capture: false }),
      regexJa: Regexes.startsUsing({ id: '263D', source: '背徳の皇帝マティウス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '263D', source: '背德皇帝马提乌斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '263D', source: '배덕의 황제 마티우스', capture: false }),
      alertText: {
        en: 'Move To Safe Spot',
        de: 'Zur sicheren Zone',
        fr: 'Allez en zone sûre',
        cn: '去安全点',
        ko: '안전 지대로 이동',
      },
      tts: {
        en: 'move away',
        de: 'weck da',
        fr: 'Zone sure',
        cn: '去安全点',
        ko: '안전 지대로',
      },
    },
    {
      id: 'Rab Hashmal Rock Cutter',
      regex: Regexes.startsUsing({ id: '25D7', source: 'Hashmal, Bringer Of Order' }),
      regexDe: Regexes.startsUsing({ id: '25D7', source: 'Hashmallim der Einiger' }),
      regexFr: Regexes.startsUsing({ id: '25D7', source: 'Hashmal Le Grand Ordonnateur' }),
      regexJa: Regexes.startsUsing({ id: '25D7', source: '統制者ハシュマリム' }),
      regexCn: Regexes.startsUsing({ id: '25D7', source: '统治者哈修马利姆' }),
      regexKo: Regexes.startsUsing({ id: '25D7', source: '통제자 하쉬말림' }),
      response: Responses.tankCleave(),

    },
    {
      id: 'Rab Hashmal Earth Hammer',
      regex: Regexes.startsUsing({ id: '25CB', source: 'Hashmal, Bringer Of Order', capture: false }),
      regexDe: Regexes.startsUsing({ id: '25CB', source: 'Hashmallim der Einiger', capture: false }),
      regexFr: Regexes.startsUsing({ id: '25CB', source: 'Hashmal Le Grand Ordonnateur', capture: false }),
      regexJa: Regexes.startsUsing({ id: '25CB', source: '統制者ハシュマリム', capture: false }),
      regexCn: Regexes.startsUsing({ id: '25CB', source: '统治者哈修马利姆', capture: false }),
      regexKo: Regexes.startsUsing({ id: '25CB', source: '통제자 하쉬말림', capture: false }),
      alertText: {
        en: 'Move Away',
        de: 'Weg da',
        fr: 'Eloignez-vous',
        cn: '远离大锤落点',
        ko: '피하기',
      },
      tts: {
        en: 'move away',
        de: 'weck da',
        fr: 'Eloignez vous',
        cn: '远离大锤落点',
      },
    },
    {
      id: 'Rab Hashmal Golems',
      regex: Regexes.startsUsing({ id: '25D4', source: 'Hashmal, Bringer Of Order', capture: false }),
      regexDe: Regexes.startsUsing({ id: '25D4', source: 'Hashmallim der Einiger', capture: false }),
      regexFr: Regexes.startsUsing({ id: '25D4', source: 'Hashmal Le Grand Ordonnateur', capture: false }),
      regexJa: Regexes.startsUsing({ id: '25D4', source: '統制者ハシュマリム', capture: false }),
      regexCn: Regexes.startsUsing({ id: '25D4', source: '统治者哈修马利姆', capture: false }),
      regexKo: Regexes.startsUsing({ id: '25D4', source: '통제자 하쉬말림', capture: false }),
      delaySeconds: 5,
      infoText: {
        en: 'Kill Golems',
        de: 'Golems töten',
        fr: 'Détruisez les golems',
        cn: '击杀小怪',
        ko: '골렘 죽이기',
      },
      tts: {
        en: 'adds',
        de: 'etz',
        fr: 'adds',
        cn: '击杀小怪',
        ko: '쫄 추가',
      },
    },
    {
      id: 'Rab Trash Dragon Voice',
      regex: Regexes.startsUsing({ id: 'D10', source: 'Archaeolion', capture: false }),
      regexDe: Regexes.startsUsing({ id: 'D10', source: 'Archaeolöwe', capture: false }),
      regexFr: Regexes.startsUsing({ id: 'D10', source: 'Archéochimère', capture: false }),
      regexJa: Regexes.startsUsing({ id: 'D10', source: 'アルケオキマイラ', capture: false }),
      regexCn: Regexes.startsUsing({ id: 'D10', source: '古奇美拉', capture: false }),
      regexKo: Regexes.startsUsing({ id: 'D10', source: '원시 키마이라', capture: false }),
      alertText: {
        en: 'Dragon Voice: Move In',
        de: 'Stimme Des Drachen: Rein',
        fr: 'Voix Du Dragon : Packez-vous',
        cn: '雷电咆哮: 靠近',
        ko: '뇌전 포효: 안으로',
      },
      tts: {
        en: 'dragon voice',
        de: 'Stimme des Drachen',
        fr: 'Voix Du Dragon',
        cn: '靠近',
        ko: '번개 안으로',
      },
    },
    {
      id: 'Rab Trash Ram Voice',
      regex: Regexes.startsUsing({ id: ['D0F', '273B'], source: 'Archaeolion', capture: false }),
      regexDe: Regexes.startsUsing({ id: ['D0F', '273B'], source: 'Archaeolöwe', capture: false }),
      regexFr: Regexes.startsUsing({ id: ['D0F', '273B'], source: 'Archéochimère', capture: false }),
      regexJa: Regexes.startsUsing({ id: ['D0F', '273B'], source: 'アルケオキマイラ', capture: false }),
      regexCn: Regexes.startsUsing({ id: ['D0F', '273B'], source: '古奇美拉', capture: false }),
      regexKo: Regexes.startsUsing({ id: ['D0F', '273B'], source: '원시 키마이라', capture: false }),
      alertText: {
        en: 'Ram Voice: Move Out',
        de: 'Stimme Des Widders: Raus',
        fr: 'Voix Du Bélier : Eloignez-vous',
        cn: '寒冰咆哮: 远离',
        ko: '빙결 포효: 바깥으로',
      },
      tts: {
        en: 'rams voice',
        de: 'Stimme des Widders',
        fr: 'Voix Du Bélier',
        cn: '远离',
        ko: '빙결 바깥으로',
      },
    },
    {
      id: 'Rab Rofocale Chariot',
      regex: Regexes.headMarker({ id: '0017' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      response: Responses.getIn(),
    },
    {
      id: 'Rab Rofocale Trample',
      regex: Regexes.startsUsing({ id: '2676', source: 'Rofocale', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2676', source: 'Rofocale', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2676', source: 'Rofocale Le Roi Centaure', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2676', source: '人馬王ロフォカレ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2676', source: '人马王洛弗卡勒', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2676', source: '인마왕 로포칼레', capture: false }),
      alertText: {
        en: 'Trample',
        de: 'Zertrampeln',
        fr: 'Fauchage',
        cn: '蹂躏',
        ko: '유린',
      },
    },
    {
      id: 'Rab Argath Mask of Truth',
      regex: Regexes.ability({ source: 'Argath Thadalfus', id: '261A', capture: false }),
      regexDe: Regexes.ability({ source: 'Argath Thadalfus', id: '261A', capture: false }),
      regexFr: Regexes.ability({ source: 'Argath Thadalfus', id: '261A', capture: false }),
      regexJa: Regexes.ability({ source: '冷血剣アルガス', id: '261A', capture: false }),
      regexCn: Regexes.ability({ source: '冷血剑阿加斯', id: '261A', capture: false }),
      regexKo: Regexes.ability({ source: '냉혈검 아르가스', id: '261A', capture: false }),
      run: function(data) {
        data.maskValue = true;
      },
    },
    {
      id: 'Rab Argath Mask of Lies',
      regex: Regexes.ability({ source: 'Argath Thadalfus', id: '2619', capture: false }),
      regexDe: Regexes.ability({ source: 'Argath Thadalfus', id: '2619', capture: false }),
      regexFr: Regexes.ability({ source: 'Argath Thadalfus', id: '2619', capture: false }),
      regexJa: Regexes.ability({ source: '冷血剣アルガス', id: '2619', capture: false }),
      regexCn: Regexes.ability({ source: '冷血剑阿加斯', id: '2619', capture: false }),
      regexKo: Regexes.ability({ source: '냉혈검 아르가스', id: '2619', capture: false }),
      run: function(data) {
        data.maskValue = false;
      },
    },
    {
      id: 'Rab Argath Command Scatter',
      regex: Regexes.headMarker({ id: '007B' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: function(data) {
        if (data.maskValue) {
          return {
            en: 'Move',
            de: 'Bewegen',
            fr: 'Bougez',
            cn: '动起来',
            ko: '움직이기',
          };
        }
        return {
          en: 'Stop',
          de: 'Stopp',
          fr: 'Stop',
          cn: '不要动',
          ko: '멈추기',
        };
      },
    },
    {
      id: 'Rab Argath Command Turn',
      regex: Regexes.headMarker({ id: '007C' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: function(data) {
        if (data.maskValue) {
          return {
            en: 'Look Away',
            de: 'Wegschauen',
            fr: 'Regardez ailleurs',
            cn: '背对BOSS',
            ko: '바라보기',
          };
        }
        return {
          en: 'Look Towards',
          de: 'Anschauen',
          fr: 'Regardez le boss',
          cn: '面对BOSS',
          ko: '바라보지 말기',
        };
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'missingTranslations': true,
      'replaceSync': {
        'Archaeodemon': 'Archaeodämon',
        'command tower': 'Kommandoturm',
        'Frostwave': 'Polarlanze',
        'I am Revelation': 'Seht die Offenbarung',
        'I am the truth from which you run': 'Die Maske zeigt euch die Macht des wahren Gottes! Fügt euch der Offenbarung!',
        'I am the lies upon which you sup': 'Die Maske zeigt euch die Macht des falschen Gottes! Fügt euch der Offenbarung!',
        'Mateus, The Corrupt': 'Mateus (?:der|die|das) Peiniger',
        'Argath Thadalfus': 'Argath Thadalfus',
        'Hashmal, Bringer Of Order': 'Hashmallim der Einiger',
        'Rofocale': 'Rofocale',
        'The heavens tremble in my wake': 'Mein Streitwagen donnert empor in luftige Höhen',
      },
      'replaceText': {
        '--face--': '--face--', // FIXME
        '--ice disappears--': '--ice disappears--', // FIXME
        '--invulnerable--': '--invulnerable--', // FIXME
        '--knockback--': '--knockback--', // FIXME
        '--lock out--': '--lock out--', // FIXME
        '--meteors--': '--meteors--', // FIXME
        'Aqua Sphere Adds': 'Aqua Sphere Adds', // FIXME
        'Archaeodemon Adds': 'Archaeodemon Adds', // FIXME
        'Azure Guard Adds': 'Azure Guard Adds', // FIXME
        'Blade, or putt putt': 'Blade, or putt putt', // FIXME
        'Blizzard IV': 'Eiska',
        'Chariot': 'Streitwagen',
        'Coldblood': 'Kaltblut',
        'Command Tower': 'Turmkommando',
        'Control Tower': 'Turmkontrolle',
        'Crippling Blow': 'Verkrüppelnder Schlag',
        'Crush Helm': 'Himmelsbombardement',
        'Crush Weapon': 'Jenseitsschrei',
        'Cry of Victory': 'Kampfruf',
        'Dark Geas': 'Dunkles Gelöbnis',
        'Earth Hammer': 'Erdhammer',
        'Embrace': 'Attacke',
        'Extreme Edge': 'Extremkante',
        'Fire IV': 'Feuka',
        'Frog Phase': 'Frog Phase', // FIXME
        'Frostwave': 'Polarlanze',
        'Gnawing Dread': 'Nagende Angst',
        'Golem Adds': 'Golem Adds', // FIXME
        'Heavenly Subjugation': 'Himmelsgewalt',
        'Hole In One': 'Hole In One', // FIXME
        'Ice Cone Phase': 'Ice Cone Phase', // FIXME
        'Judgment': 'Aburteilung',
        'Landwaster': 'Landverwüster',
        'Line AOEs': 'Line AOEs', // FIXME
        'Maverick': 'Einzelgänger',
        'Pomp and Circumstance': 'Pauken und Trompeten',
        'Putt putt, or Blade': 'Putt putt, or Blade', // FIXME
        'Quake IV': 'Seiska',
        'Rock Cutter': 'Steinfräse',
        'Royal Blood': 'Blaues Blut',
        'Sand Sphere Adds': 'Sand Sphere Adds', // FIXME
        'Shades Appear': 'Shades Appear', // FIXME
        'Shard Adds': 'Shard Adds', // FIXME
        'Soulfix': 'Seelenspießer',
        'Stack Damage': 'Stack Damage', // FIXME
        'Submission Tower': 'Turmdivision',
        'Trample': 'Mariden-Stampfer',
        'Trepidation': 'Beklemmung',
        'Unbind': 'Loseisen',
        'Unrelenting': 'Unerbittliche Klinge',
      },
      '~effectNames': {
        'Breathless': 'Atemnot',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Archaeodemon': 'archéodémon',
        'command tower': 'tour de commandement',
        'Frostwave': 'Vague réfrigérante',
        'I am Revelation': 'I am Revelation', // FIXME
        'I am the truth from which you run': 'I am the truth from which you run', // FIXME
        'I am the lies upon which you sup': 'I am the lies upon which you sup', // FIXME
        'Mateus, The Corrupt': 'Mateus le Corrompu',
        'Argath Thadalfus': 'Argath Thadalfus',
        'Hashmal, Bringer Of Order': 'Hashmal le Grand Ordonnateur',
        'Rofocale': 'Rofocale le Roi centaure',
      },
      'replaceText': {
        '--face--': '--face--', // FIXME
        '--ice disappears--': '--ice disappears--', // FIXME
        '--invulnerable--': '--invulnerable--', // FIXME
        '--knockback--': '--knockback--', // FIXME
        '--lock out--': '--lock out--', // FIXME
        '--meteors--': '--meteors--', // FIXME
        'Aqua Sphere Adds': 'Aqua Sphere Adds', // FIXME
        'Archaeodemon Adds': 'Archaeodemon Adds', // FIXME
        'Azure Guard Adds': 'Azure Guard Adds', // FIXME
        'Blade, or putt putt': 'Blade, or putt putt', // FIXME
        'Blizzard IV': 'Giga Glace',
        'Chariot': 'Charge centaure',
        'Coldblood': 'Sang-froid',
        'Command Tower': 'Tour de commandement',
        'Control Tower': 'Tour de contrôle',
        'Crippling Blow': 'Coup handicapant',
        'Crush Helm': 'Bombardement céleste',
        'Crush Weapon': 'Cri de l\'au-delà',
        'Cry of Victory': 'Cri de triomphe',
        'Dark Geas': 'Invocation ténébreuse',
        'Earth Hammer': 'Marteau tellurique',
        'Embrace': 'Attaque',
        'Extreme Edge': 'Taille suprême',
        'Fire IV': 'Giga Feu',
        'Frog Phase': 'Frog Phase', // FIXME
        'Frostwave': 'Vague réfrigérante',
        'Gnawing Dread': 'Peur calamiteuse',
        'Golem Adds': 'Golem Adds', // FIXME
        'Heavenly Subjugation': 'Marche triomphale',
        'Hole In One': 'Hole In One', // FIXME
        'Ice Cone Phase': 'Ice Cone Phase', // FIXME
        'Judgment': 'Jugement',
        'Landwaster': 'Dislocation terrestre',
        'Line AOEs': 'Line AOEs', // FIXME
        'Maverick': 'Franc-tireur',
        'Pomp and Circumstance': 'La pompe et l’attirail',
        'Putt putt, or Blade': 'Putt putt, or Blade', // FIXME
        'Quake IV': 'Giga Séisme',
        'Rock Cutter': 'Trancheur rocheux',
        'Royal Blood': 'Sang royal',
        'Sand Sphere Adds': 'Sand Sphere Adds', // FIXME
        'Shades Appear': 'Shades Appear', // FIXME
        'Shard Adds': 'Shard Adds', // FIXME
        'Soulfix': 'Fixage d\'âme',
        'Stack Damage': 'Stack Damage', // FIXME
        'Submission Tower': 'Tour de soumission',
        'Trample': 'Martèlement pachydermique',
        'Trepidation': 'Trépidation',
        'Unbind': 'Délivrance',
        'Unrelenting': 'Déferlement',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Archaeodemon': 'アルケオデーモン',
        'command tower': '支配の塔',
        'Frostwave': '凍てつく波動',
        'I am Revelation': 'I am Revelation', // FIXME
        'I am the truth from which you run': 'I am the truth from which you run', // FIXME
        'I am the lies upon which you sup': 'I am the lies upon which you sup', // FIXME
        'Mateus, The Corrupt': '背徳の皇帝マティウス',
        'Argath Thadalfus': '冷血剣アルガス',
        'Hashmal, Bringer Of Order': '統制者ハシュマリム ',
        'Rofocale': '人馬王ロフォカレ',
        'The heavens tremble in my wake!': '“我が戦車の車輪は、天をも駆ける！ ゆくぞ……！”',
      },
      'replaceText': {
        '--face--': '--face--', // FIXME
        '--ice disappears--': '--ice disappears--', // FIXME
        '--invulnerable--': '--invulnerable--', // FIXME
        '--knockback--': '--knockback--', // FIXME
        '--lock out--': '--lock out--', // FIXME
        '--meteors--': '--meteors--', // FIXME
        'Aqua Sphere Adds': 'Aqua Sphere Adds', // FIXME
        'Archaeodemon Adds': 'Archaeodemon Adds', // FIXME
        'Azure Guard Adds': 'Azure Guard Adds', // FIXME
        'Blade, or putt putt': 'Blade, or putt putt', // FIXME
        'Blizzard IV': 'ブリザジャ',
        'Chariot': '人馬戦車',
        'Coldblood': '冷血乱舞',
        'Command Tower': '支配の塔',
        'Control Tower': '統制の塔',
        'Crippling Blow': '痛打',
        'Crush Helm': '星天爆撃打',
        'Crush Weapon': '冥界恐叫打',
        'Cry of Victory': '鬨の声',
        'Dark Geas': '暗黒魔法陣',
        'Earth Hammer': '大地のハンマー',
        'Embrace': '攻撃',
        'Extreme Edge': 'ブーストエッジ',
        'Fire IV': 'ファイジャ',
        'Frog Phase': 'Frog Phase', // FIXME
        'Frostwave': '凍てつく波動',
        'Gnawing Dread': '喪失の恐怖',
        'Golem Adds': 'Golem Adds', // FIXME
        'Heavenly Subjugation': '天将覇道撃',
        'Hole In One': 'Hole In One', // FIXME
        'Ice Cone Phase': 'Ice Cone Phase', // FIXME
        'Judgment': 'ジャッジメント',
        'Landwaster': 'ランドワスター',
        'Line AOEs': 'Line AOEs', // FIXME
        'Maverick': '独立独行',
        'Pomp and Circumstance': '威風堂々',
        'Putt putt, or Blade': 'Putt putt, or Blade', // FIXME
        'Quake IV': 'クエイジャ',
        'Rock Cutter': 'ロックカッター',
        'Royal Blood': '高貴なる血脈',
        'Sand Sphere Adds': 'Sand Sphere Adds', // FIXME
        'Shades Appear': 'Shades Appear', // FIXME
        'Shard Adds': 'Shard Adds', // FIXME
        'Soulfix': '呪槍串刺',
        'Stack Damage': 'Stack Damage', // FIXME
        'Submission Tower': '服従の塔',
        'Trample': '踏みつけ',
        'Trepidation': '狐鶏鼠',
        'Unbind': '拘束解放',
        'Unrelenting': '千手無双剣',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Archaeodemon': '古恶魔',
        'command tower': '支配之塔',
        'Frostwave': '寒冰波动',
        'I am Revelation': '遵从朕的神谕',
        'I am the truth from which you run': '此乃真神之力！',
        'I am the lies upon which you sup': '此乃伪神之力！',
        'Mateus, The Corrupt': '背德皇帝马提乌斯',
        'Argath Thadalfus': '冷血剑阿加斯',
        'Hashmal, Bringer Of Order': '统治者哈修马利姆',
        'Rofocale': '人马王洛弗卡勒',
        'The heavens tremble in my wake': '我的战车驰骋天际！',
      },
      'replaceText': {
        '--face--': '--面对--',
        '--ice disappears--': '--冰消失--',
        '--invulnerable--': '--无敌--',
        '--knockback--': '--击退--',
        '--lock out--': '--封锁--',
        '--meteors--': '--陨石--',
        'Aqua Sphere Adds': '水球出现',
        'Archaeodemon Adds': '古恶魔出现',
        'Azure Guard Adds': '蔚蓝护卫出现',
        'Blade, or putt putt': '去刀AOE缝隙处/去BOSS脚下',
        'Blizzard IV': '冰澈',
        'Chariot': '人马战车',
        'Coldblood': '冷血乱舞',
        'Command Tower': '支配之塔',
        'Control Tower': '统治之塔',
        'Crippling Blow': '痛击',
        'Crush Helm': '星天爆击打',
        'Crush Weapon': '冥界恐叫打',
        'Cry of Victory': '战吼',
        'Dark Geas': '暗黑魔法阵',
        'Earth Hammer': '大地之锤',
        'Embrace': '攻击',
        'Extreme Edge': '加速刃',
        'Fire IV': '炽炎',
        'Frog Phase': '窒息阶段',
        'Frostwave': '寒冰波动',
        'Gnawing Dread': '丧失之痛',
        'Golem Adds': '巨像兵出现',
        'Heavenly Subjugation': '天将霸道击',
        'Hole In One': '去BOSS脚下',
        'Ice Cone Phase': '引导冰块阶段',
        'Judgment': '制裁',
        'Landwaster': '地动',
        'Line AOEs': '直线AOE',
        'Maverick': '特立独行',
        'Pomp and Circumstance': '威风凛凛',
        'Putt putt, or Blade': '去BOSS脚下/去刀AOE缝隙处',
        'Quake IV': '激震',
        'Rock Cutter': '石刃',
        'Royal Blood': '高贵血脉',
        'Sand Sphere Adds': '沙球出现',
        'Shades Appear': '阿加斯之影出现',
        'Shard Adds': '虚无结晶出现',
        'Soulfix': '咒枪穿刺',
        'Stack Damage': '分摊伤害',
        'Submission Tower': '服从之塔',
        'Trample': '踩踏',
        'Trepidation': '狐鸡鼠',
        'Unbind': '拘束解放',
        'Unrelenting': '千手无双剑',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {
        'Archaeodemon': '원시 악마',
        'command tower': '지배의 탑',
        'Frostwave': '얼어붙은 파동',
        'I am Revelation': '신벌을 받아라',
        'I am the truth from which you run': '가면의 계시에 따라라',
        'I am the lies upon which you sup': '계시를 내리겠다',
        'Mateus, The Corrupt': '배덕의 황제 마티우스',
        'Argath Thadalfus': '냉혈검 아르가스',
        'Hashmal, Bringer Of Order': '통제자 하쉬말림',
        'Rofocale': '인마왕 로포칼레',
        'The Crumbling Bridge': '무너진 다리',
        'The Lesalia Garden Ruins': '르잘리아 정원 옛터',
        'The Lesalia Temple Ruins': '르잘리아 신전 옛터',
        'The Palace Square': '왕궁 광장',
        'The heavens tremble in my wake': '이것이 바로 빛나는 \'성석\'의 힘이다!',
      },
      'replaceText': {
        '--face--': '--얼굴--',
        '--ice disappears--': '--얼음 사라짐--',
        '--invulnerable--': '--무적--',
        '--knockback--': '--넉백--',
        '--lock out--': '--지역 분리--',
        '--meteors--': '--메테오--',
        'Aqua Sphere Adds': '물 구체 생성',
        'Archaeodemon Adds': '원시 악마 생성',
        'Azure Guard Adds': '푸른 파수꾼 생성',
        'Blade, or putt putt': 'Blade, or putt putt', // FIXME
        'Blizzard IV': '블리자쟈',
        'Chariot': '인마전차',
        'Coldblood': '냉혈난무',
        'Command Tower': '지배의 탑',
        'Control Tower': '통제의 탑',
        'Crippling Blow': '통타',
        'Crush Helm': '성천폭격타',
        'Crush Weapon': '명계공규타',
        'Cry of Victory': '승리의 함성',
        'Dark Geas': '암흑 마법진',
        'Earth Hammer': '대지의 망치',
        'Embrace': '공격',
        'Extreme Edge': '돌격하는 칼날',
        'Fire IV': '파이쟈',
        'Frog Phase': '개구리 페이즈',
        'Frostwave': '얼어붙은 파동',
        'Gnawing Dread': '상실의 공포',
        'Golem Adds': '골렘 생성',
        'Heavenly Subjugation': '천장패도격',
        'Hole In One': 'Hole In One', // FIXME
        'Ice Cone Phase': 'Ice Cone 페이즈', // FIXME
        'Judgment': '심판의 날',
        'Landwaster': '대지 황폐화',
        'Line AOEs': '직선 장판',
        'Maverick': '독립독행',
        'Pomp and Circumstance': '위풍당당',
        'Putt putt, or Blade': 'Putt putt, or Blade', // FIXME
        'Quake IV': '퀘이쟈',
        'Rock Cutter': '바위 가르기',
        'Royal Blood': '고귀한 혈통',
        'Sand Sphere Adds': '모래공 생성',
        'Shades Appear': '분신 생성',
        'Shard Adds': '허무의 결정 생성',
        'Soulfix': '저주창 내리꽂기',
        'Stack Damage': '쉐어뎀',
        'Submission Tower': '복종의 탑',
        'Trample': '짓밟기',
        'Trepidation': '여우 닭 쥐',
        'Unbind': '구속 해방',
        'Unrelenting': '천수무쌍검',
      },
    },
  ],
}];
