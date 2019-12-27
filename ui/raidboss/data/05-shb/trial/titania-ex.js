'use strict';

// Titania Extreme
[{
  zoneRegex: /^(The Dancing Plague \(Extreme\)|缇坦妮雅歼殛战|극 티타니아 토벌전)$/,
  timelineFile: 'titania-ex.txt',
  triggers: [
    {
      id: 'TitaniaEx Bright Sabbath',
      regex: / 14:3D4B:Titania starts using Bright Sabbath/,
      regexCn: / 14:3D4B:缇坦妮雅 starts using 欢快的安息日/,
      regexDe: / 14:3D4B:Titania starts using Leuchtender Sabbat/,
      regexFr: / 14:3D4B:Titania starts using Sabbat En Plein Jour/,
      regexJa: / 14:3D4B:ティターニア starts using ブライトサバト/,
      regexKoKo: / 14:3D4B:티타니아 starts using 빛나는 안식/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
        cn: 'AOE',
        ko: '전체 공격',
      },
    },
    {
      id: 'TitaniaEx Phantom Out',
      regex: / 14:3D4C:Titania starts using Phantom Rune/,
      regexCn: / 14:3D4C:缇坦妮雅 starts using 幻之符文/,
      regexDe: / 14:3D4C:Titania starts using Phantomrune/,
      regexFr: / 14:3D4C:Titania starts using Rune D'illusion/,
      regexJa: / 14:3D4C:ティターニア starts using 幻のルーン/,
      regexKo: / 14:3D4C:티타니아 starts using 환상의 룬/,
      alertText: {
        en: 'Out',
        de: 'Raus',
        ja: '外へ',
        fr: 'Dehors',
        cn: '远离',
        ko: '밖',
      },
    },
    {
      id: 'TitaniaEx Phantom In',
      regex: / 14:3D4D:Titania starts using Phantom Rune/,
      regexCn: / 14:3D4D:缇坦妮雅 starts using 幻之符文/,
      regexDe: / 14:3D4D:Titania starts using Phantomrune/,
      regexFr: / 14:3D4D:Titania starts using Rune D'illusion/,
      regexJa: / 14:3D4D:ティターニア starts using 幻のルーン/,
      regexKo: / 14:3D4D:티타니아 starts using 환상의 룬/,
      alertText: {
        en: 'In',
        de: 'Rein',
        ja: '中へ',
        fr: 'Dedans',
        cn: '靠近',
        ko: '안',
      },
    },
    {
      id: 'TitaniaEx Mist Failure',
      regex: / 03:\y{ObjectId}:Added new combatant Spirit Of Dew\./,
      regexCn: / 03:\y{ObjectId}:Added new combatant 水精\./,
      regexDe: / 03:\y{ObjectId}:Added new combatant Wasserfee\./,
      regexFr: / 03:\y{ObjectId}:Added new combatant Esprit Des Rosées\./,
      regexJa: / 03:\y{ObjectId}:Added new combatant 水の精\./,
      regexKo: / 03:\y{ObjectId}:Added new combatant 물의 정령\./,
      infoText: {
        en: 'Kill Extra Add',
        de: 'Add angreifen',
        ja: '水の精倒して',
        fr: 'Tuez l\'add',
        cn: '击杀小怪',
        ko: '쫄 나온거부터 처리',
      },
    },
    {
      id: 'TitaniaEx Mist',
      regex: / 14:3D45:Titania starts using Mist Rune/,
      regexCn: / 14:3D45:缇坦妮雅 starts using 水之符文/,
      regexDe: / 14:3D45:Titania starts using Nebelrune/,
      regexFr: / 14:3D45:Titania starts using Rune D'eau/,
      regexJa: / 14:3D45:ティターニア starts using 水のルーン/,
      regexKo: / 14:3D45:티타니아 starts using 물의 룬/,
      infoText: function(data) {
        if (data.seenMistRune) {
          return {
            en: 'In/Out, then Water Positions',
            de: 'Rein/Raus, danach Wasser Positionen',
            ja: '中/外避けてポジションへ',
            fr: 'Dedans/Dehors puis position pour l\'eau',
            cn: '靠近/远离, 水圈站位',
            ko: '안/밖 -> 물 장판 위치',
          };
        }
        return {
          en: 'Water Positions',
          de: 'Wasser Positionen',
          ja: 'ポジションへ',
          fr: 'Position pour l\'eau',
          cn: '水圈站位',
          ko: '물 장판',
        };
      },
      run: function(data) {
        data.seenMistRune = true;
      },
    },
    {
      id: 'TitaniaEx Flame',
      regex: / 14:3D47:Titania starts using Flame Rune/,
      regexCn: / 14:3D47:缇坦妮雅 starts using 火之符文/,
      regexDe: / 14:3D47:Titania starts using Flammenrune/,
      regexFr: / 14:3D47:Titania starts using Rune De Feu/,
      regexJa: / 14:3D47:ティターニア starts using 火のルーン/,
      regexKo: / 14:3D47:티타니아 starts using 불의 룬/,
      // You have 16.5 seconds until the first stack damage.
      delaySeconds: 8.5,
      alertText: function(data) {
        if (data.seenFlameRune) {
          return {
            en: 'Stack (maybe rotate?)',
            de: 'Sammeln (evtl rotieren?)',
            ja: 'シェア (多分時計回り?)',
            fr: 'Packez-vous (rotation ?)',
            cn: '左右集合 (可能旋转?)',
            ko: '쉐어징 모이기',
          };
        }
        return {
          en: 'Stack Positions',
          de: 'Sammel-Positionen',
          ja: 'シェア',
          fr: 'Packez-vous',
          cn: '左右集合',
          ko: '쉐어징 모이기',
        };
      },
      run: function(data) {
        data.seenFlameRune = true;
      },
    },
    {
      id: 'TitaniaEx Divination',
      regex: / 14:3D4A:Titania starts using Divination Rune on (\y{Name})/,
      regexCn: / 14:3D4A:缇坦妮雅 starts using 魔之符文 on (\y{Name})/,
      regexDe: / 14:3D4A:Titania starts using Prophezeiungsrune on (\y{Name})/,
      regexFr: / 14:3D4A:Titania starts using Rune De Malice on (\y{Name})/,
      regexJa: / 14:3D4A:ティターニア starts using 魔のルーン on (\y{Name})/,
      regexKo: / 14:3D4A:티타니아 starts using 마법의 룬 on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Cleave on YOU',
            de: 'Tank Cleave auf DIR',
            ja: '自分にタンクバスター',
            fr: 'Tank cleave sur vous',
            cn: '坦克顺劈点名',
            ko: '탱버 대상자',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] != data.me) {
          return {
            en: 'Tank Cleave on ' + data.ShortName(matches[1]),
            de: 'Tank Cleave auf ' + data.ShortName(matches[1]),
            ja: data.ShortName(matches[1]) + 'にタンクバスター',
            fr: 'Tank cleave sur ' + data.ShortName(matches[1]),
            cn: '坦克顺劈 -> ' + data.ShortName(matches[1]),
            ko: '"' + data.ShortName(matches[1]) + '" 탱버',
          };
        }
      },
    },
    {
      id: 'TitaniaEx Bramble 1',
      regex: / 14:42D7:Titania starts using Chain Of Brambles/,
      regexCn: / 14:42D7:缇坦妮雅 starts using 荆棘链/,
      regexDe: / 14:42D7:Titania starts using Dornenfessel/,
      regexFr: / 14:42D7:Titania starts using Chaînes De Ronces/,
      regexJa: / 14:42D7:ティターニア starts using ブランブルチェーン/,
      regexKo: / 14:42D7:티타니아 starts using 나무딸기 사슬/,
      infoText: {
        en: 'Wait For Tethers In Center',
        de: 'Auf die Verbindung in der Mitte warten',
        ja: '中央で待機',
        fr: 'Attente des liens au centre',
        cn: '中间集合等待荆棘',
        ko: '가시 연결되기 전에 중앙으로',
      },
    },
    {
      id: 'TitaniaEx Bramble 2',
      regex: / 14:42D7:Titania starts using Chain Of Brambles/,
      regexCn: / 14:42D7:缇坦妮雅 starts using 荆棘链/,
      regexDe: / 14:42D7:Titania starts using Dornenfessel/,
      regexFr: / 14:42D7:Titania starts using Chaînes De Ronces/,
      regexJa: / 14:42D7:ティターニア starts using ブランブルチェーン/,
      regexKo: / 14:42D7:티타니아 starts using 나무딸기 사슬/,
      delaySeconds: 3,
      alertText: {
        en: 'Run!',
        de: 'Lauf!',
        ja: '走れ！',
        fr: 'Courez !',
        cn: '跑！',
        ko: '달려!',
      },
    },
    {
      id: 'TitaniaEx Bramble Knockback',
      regex: / 15:\y{ObjectId}:Puck:3D42:Puck's Rebuke:/,
      regexCn: / 15:\y{ObjectId}:帕克:3D42:帕克的指责:/,
      regexDe: / 15:\y{ObjectId}:Puck:3D42:Pucks Tadel:/,
      regexFr: / 15:\y{ObjectId}:Puck:3D42:Réprimande De Puck:/,
      regexJa: / 15:\y{ObjectId}:パック:3D42:パックレビューク:/,
      regexKo: / 15:\y{ObjectId}:요정의 권속:3D42:요정의 꾸지람:/,
      alertText: {
        en: 'Diagonal Knockback Soon',
        de: 'diagonaler Knockback bald',
        ja: '対角に飛ぶ',
        fr: 'Poussée en diagonale bientôt',
        cn: '对角击退准备',
        ko: '곧 대각선 넉백',
      },
    },
    {
      id: 'TitaniaEx Fae Light',
      regex: / 14:3D2C:Titania starts using Fae Light/,
      regexCn: / 14:3D2C:缇坦妮雅 starts using 妖灵光/,
      regexDe: / 14:3D2C:Titania starts using Feenlicht/,
      regexFr: / 14:3D2C:Titania starts using Lueur Féérique/,
      regexJa: / 14:3D2C:ティターニア starts using 妖精光/,
      regexKo: / 14:3D2C:티타니아 starts using 요정광/,
      alertText: function(data) {
        if (data.role == 'tank' || data.role == 'healer') {
          return {
            en: 'Tank Buster',
            de: 'Tankbuster',
            fr: 'Tankbuster',
            ja: 'タンクバスター',
            cn: '死刑',
            ko: '탱버',
          };
        }
      },
      infoText: function(data) {
        if (data.role != 'tank' && data.role != 'healer') {
          return {
            en: 'Tank Cleave',
            de: 'Tank Cleave',
            ja: 'タンクバスター',
            fr: 'Tank cleave',
            cn: '坦克顺劈',
            ko: '탱버',
          };
        }
      },
    },
    {
      id: 'TitaniaEx Frost Rune 1',
      regex: / 14:3D2A:Titania starts using Frost Rune/,
      regexCn: / 14:3D2A:缇坦妮雅 starts using 冰之符文/,
      regexDe: / 14:3D2A:Titania starts using Frostrune/,
      regexFr: / 14:3D2A:Titania starts using Rune De Gel/,
      regexJa: / 14:3D2A:ティターニア starts using 氷のルーン/,
      regexKo: / 14:3D2A:티타니아 starts using 얼음의 룬/,
      infoText: {
        en: 'Get Middle, Shiva Circles',
        de: 'In die Mitte, Shiva Kreise',
        ja: 'シヴァの輪っか',
        fr: 'Allez au milieu, comme sur Shiva',
        cn: '中间集合, 九连环',
        ko: '시바 얼음 장판',
      },
    },
    {
      id: 'TitaniaEx Frost Rune 2',
      regex: / 14:3D2A:Titania starts using Frost Rune/,
      regexCn: / 14:3D2A:缇坦妮雅 starts using 冰之符文/,
      regexDe: / 14:3D2A:Titania starts using Frostrune/,
      regexFr: / 14:3D2A:Titania starts using Rune De Gel/,
      regexJa: / 14:3D2A:ティターニア starts using 氷のルーン/,
      regexKo: / 14:3D2A:티타니아 starts using 얼음의 룬/,
      delaySeconds: 6.5,
      infoText: {
        en: 'Run Out',
        de: 'Raus gehen',
        ja: '外へ',
        fr: 'Allez à l\'extérieur',
        cn: '远离',
        ko: '장판 피하기',
      },
    },
    {
      id: 'TitaniaEx Frost Rune 3',
      regex: / 1[56]:\y{ObjectId}:Titania:3D2B:Frost Rune:/,
      regexCn: / 1[56]:\y{ObjectId}:缇坦妮雅:3D2B:冰之符文:/,
      regexDe: / 1[56]:\y{ObjectId}:Titania:3D2B:Frostrune:/,
      regexFr: / 1[56]:\y{ObjectId}:Titania:3D2B:Rune De Gel:/,
      regexJa: / 1[56]:\y{ObjectId}:ティターニア:3D2B:氷のルーン:/,
      regexKo: / 1[56]:\y{ObjectId}:티타니아:3D2B:얼음의 룬:/,
      suppressSeconds: 60,
      infoText: {
        en: 'Run In',
        de: 'Rein gehen',
        ja: '中へ',
        fr: 'Allez au centre',
        cn: '靠近',
        ko: '중앙으로',
      },
    },
    {
      id: 'TitaniaEx Growth Rune',
      regex: / 14:3D2E:Titania starts using Growth Rune/,
      regexCn: / 14:3D2E:缇坦妮雅 starts using 根之符文/,
      regexDe: / 14:3D2E:Titania starts using Wachstumsrune/,
      regexFr: / 14:3D2E:Titania starts using Rune De Racine/,
      regexJa: / 14:3D2E:ティターニア starts using 根のルーン/,
      regexKo: / 14:3D2E:티타니아 starts using 뿌리의 룬/,
      infoText: {
        en: 'Roots',
        de: 'Ranken',
        ja: '根のルーン',
        fr: 'Racines',
        cn: '根系生长',
        ko: '뿌리 나옴',
      },
    },
    {
      id: 'TitaniaEx Uplift Markers',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:008B:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Spread',
        de: 'Verteilen',
        ja: '散開',
        fr: 'Dispersez-vous',
        cn: '分散',
        ko: '산개',
      },
    },
    {
      id: 'TitaniaEx Hard Swipe',
      regex: / 14:3D36:Peaseblossom starts using Hard Swipe on (\y{Name})/,
      regexCn: / 14:3D36:豌豆花 starts using 强烈重击 on (\y{Name})/,
      regexDe: / 14:3D36:Bohnenblüte starts using Harter Hieb on (\y{Name})/,
      regexFr: / 14:3D36:Fleur-De-Pois starts using Fauchage Brutal on (\y{Name})/,
      regexJa: / 14:3D36:ピーズブロッサム starts using ハードスワイプ on (\y{Name})/,
      regexKo: / 14:3D36:콩나무 starts using 강력한 후려치기 on (\y{Name})/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Tank Buster',
        de: 'Tankbuster',
        fr: 'Tankbuster',
        ja: 'タンクバスター',
        cn: '死刑',
        ko: '탱버',
      },
    },
    {
      id: 'TitaniaEx Pummel',
      regex: / 14:3D37:Puck starts using Pummel on \y{Name}/,
      regexCn: / 14:3D37:帕克 starts using 殴打 on \y{Name}/,
      regexDe: / 14:3D37:Puck starts using Deftige Dachtel on \y{Name}/,
      regexFr: / 14:3D37:Puck starts using Torgnole on \y{Name}/,
      regexJa: / 14:3D37:パック starts using 殴打 on \y{Name}/,
      regexKo: / 14:3D37:요정의 권속 starts using 구타 on \y{Name}/,
      condition: function(data) {
        return data.role == 'tank';
      },
      preRun: function(data) {
        data.pummelCount = data.pummelCount || 0;
        data.pummelCount++;
      },
      infoText: function(data) {
        return {
          en: 'Pummel ' + data.pummelCount,
          de: 'Deftige Dachtel ' + data.pummelCount,
          ja: '殴打 ' + data.pummelCount,
          fr: 'Torgnole ' + data.pummelCount,
          cn: '殴打 ' + data.pummelCount,
          ko: '구타 ' + data.pummelCount,
        };
      },
    },
    {
      id: 'TitaniaEx Peasebomb',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00BD:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Spread',
        de: 'Verteilen',
        ja: '散開',
        fr: 'Ecartez-vous',
        cn: '分散',
        ko: '산개',
      },
      run: function(data) {
        data.bomb = data.bomb || {};
        data.bomb[data.me] = true;
      },
    },
    {
      id: 'TitaniaEx Peasebomb Use',
      regex: / 1[56]:\y{ObjectId}:Peaseblossom:3D3F:Peasebomb:/,
      regexCn: / 1[56]:\y{ObjectId}:豌豆花:3D3F:豌豆炸弹:/,
      regexDe: / 1[56]:\y{ObjectId}:Bohnenblüte:3D3F:Bohnenbombe:/,
      regexFr: / 1[56]:\y{ObjectId}:Fleur-de-pois:3D3F:Haricot Explosif:/,
      regexJa: / 1[56]:\y{ObjectId}:ピーズブロッサム:3D3F:ビーズボム:/,
      regexKo: / 1[56]:\y{ObjectId}:콩나무:3D3F:콩폭탄:/,
      run: function(data) {
        delete data.bomb;
      },
    },
    {
      id: 'TitaniaEx Adds Stack',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00A1:/,
      delaySeconds: 0.25,
      alertText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Stack on YOU',
            de: 'Auf DIR sammeln',
            ja: '自分にシェア',
            fr: 'Package sur VOUS',
            cn: '集合点名',
            ko: '쉐어징 대상자',
          };
        }

        if (data.bomb && data.bomb[data.me])
          return;

        return {
          en: 'Stack on ' + data.ShortName(matches[1]),
          de: 'Auf ' + data.ShortName(matches[1]) + ' sammeln',
          fr: 'Package sur ' + data.ShortName(matches[1]),
          cn: '靠近 ' + data.ShortName(matches[1]) + '集合',
          ko: '"' + data.ShortName(matches[1]) + '"에게 모이기',
        };
      },
    },
    {
      id: 'TitaniaEx Thunder Tether',
      regex: / 23:\y{ObjectId}:Titania:\y{ObjectId}:\y{Name}:....:....:0054:/,
      regexCn: / 23:\y{ObjectId}:缇坦妮雅:\y{ObjectId}:\y{Name}:....:....:0054:/,
      regexDe: / 23:\y{ObjectId}:Titania:\y{ObjectId}:\y{Name}:....:....:0054:/,
      regexFr: / 23:\y{ObjectId}:Titania:\y{ObjectId}:\y{Name}:....:....:0054:/,
      regexJa: / 23:\y{ObjectId}:ティターニア:\y{ObjectId}:\y{Name}:....:....:0054:/,
      regexKo: / 23:\y{ObjectId}:티타니아:\y{ObjectId}:\y{Name}:....:....:0054:/,
      suppressSeconds: 60,
      alertText: {
        en: 'Initial Thunder Tether',
        de: 'initiale Blitz Verbindung',
        ja: '線一人目',
        fr: 'Lien de foudre initial',
        cn: '初始雷连线',
        ko: '첫 번개 징 대상자',
      },
    },
    {
      id: 'TitaniaEx Thunder Rune',
      regex: / 1[56]:\y{ObjectId}:Titania:3D29:Thunder Rune:/,
      regexCn: / 1[56]:\y{ObjectId}:缇坦妮雅:3D29:雷之符文:/,
      regexDe: / 1[56]:\y{ObjectId}:Titania:3D29:Donnerrune:/,
      regexFr: / 1[56]:\y{ObjectId}:Titania:3D29:Rune De Foudre:/,
      regexJa: / 1[56]:\y{ObjectId}:ティターニア:3D29:雷のルーン:/,
      regexKo: / 1[56]:\y{ObjectId}:티타니아:3D29:번개의 룬:/,
      preRun: function(data) {
        data.thunderCount = data.thunderCount || 1;
      },
      suppressSeconds: 1,
      infoText: function(data) {
        return {
          en: 'Thunder ' + data.thunderCount,
          de: 'Blitz ' + data.thunderCount,
          ja: '線' + data.thunderCount + '人目',
          fr: 'Foudre ' + data.thunderCount,
          cn: '雷连线 #' + data.thunderCount,
          ko: data.thunderCount + '번째 번개',
        };
      },
      run: function(data) {
        data.thunderCount++;
      },
    },
    {
      id: 'TitaniaEx Thunder Cleanup',
      regex: / 14:3D32:Titania starts using Being Mortal/,
      regexCn: / 14:3D32:缇坦妮雅 starts using 终有一死/,
      regexDe: / 14:3D32:Titania starts using Sterblichkeit/,
      regexFr: / 14:3D32:Titania starts using Deuil Des Vivants/,
      regexJa: / 14:3D32:ティターニア starts using 死すべき定め/,
      regexKo: / 14:3D32:티타니아 starts using 죽어야 할 운명/,
      run: function(data) {
        delete data.thunderCount;
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Spirit of Flame': 'Feuerfee',
        'Spirit of Wood': 'Holzfee',
        'Titania': 'Titania',
        'Puck': 'Puck',
        'Peaseblossom': 'Bohnenblüte',
        'Mustardseed': 'Senfsamen',
        'Engage!': 'Start!',
      },
      'replaceText': {
        'attack': 'Attacke',
        'Wood\'s Embrace': 'Umarmung des Waldes',
        'Whispering Wind': 'Flüsternde Winde',
        'War and Pease': 'Bohnenkrieg',
        'Wallop': 'Eindreschen',
        'Uplift': 'Feenring',
        'Unknown Ability': 'Unknown Ability',
        'Thunder Rune': 'Donnerrune',
        'Pummel': 'Deftige Dachtel',
        'Puck\'s Rebuke': 'Pucks Tadel',
        'Puck\'s Caprice': 'Pucks Laune',
        'Puck\'s Breath': 'Pucks Atem',
        'Phantom Rune': 'Phantomrune',
        'Peasebomb': 'Bohnenbombe',
        'Pease': 'Bohne',
        'Mist Rune': 'Nebelrune',
        'Midsummer Night\'s Dream': 'Mittsommernachtstraum',
        'Love-in-Idleness': 'Liebevoller Müßiggang',
        'Leafstorm': 'Blättersturm',
        'Hard Swipe': 'Harter Hieb',
        'Growth Rune': 'Wachstumsrune',
        'Gentle Breeze': 'Sanfte Brise',
        'Frost Rune': 'Frostrune',
        'Flame Rune': 'Flammenrune',
        'Flame Hammer': 'Flammenhammer',
        'Fae Light': 'Feenlicht',
        'Enrage': 'Finalangriff',
        'Divination Rune': 'Prophezeiungsrune',
        'Chain Of Brambles': 'Dornenfessel',
        'Bright Sabbath': 'Leuchtender Sabbat',
        'Being Mortal': 'Sterblichkeit',
        '--untargetable--': '--nich anvisierbar--',
        '--targetable--': '--anvisierbar--',
        '--center--': '--Mitte--',
        'Love-In-Idleness': 'Liebevoller Müßiggang',
      },
      '~effectNames': {
        'Thorny Vine': 'Dornenranken',
        'Summon Order': 'Egi-Attacke I',
        'Lightning Resistance Down II': 'Blitzresistenz - (stark)',
        'Fire Resistance Up': 'Feuerresistenz +',
        'Fire Resistance Down II': 'Feuerresistenz - (stark)',
        'Embolden': 'Ermutigen',
        'Blunt Resistance Down': 'Schlagresistenz -',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'spirit of flame': 'Esprit Des Flammes',
        'Titania': 'Titania',
        'Puck': 'Puck',
        'Peaseblossom': 'Fleur-de-pois',
        'Mustardseed': 'Pousse-de-moutarde',
        'Innocence': 'Innocence',
        'Engage!': 'À l\'attaque',
      },
      'replaceText': {
        'attack': 'Attaque',
        'Wood\'s Embrace': 'Étreinte de la nature',
        'Whispering Wind': 'Vent susurrant',
        'War and Pease': 'La fin des haricots',
        'Wallop': 'Rossée',
        'Uplift': 'Exhaussement',
        'Unknown Ability': 'Unknown Ability',
        'Thunder Rune': 'Rune de foudre',
        'Pummel': 'Torgnole',
        'Puck\'s Rebuke': 'Réprimande de Puck',
        'Puck\'s Caprice': 'Toquade de Puck',
        'Puck\'s Breath': 'Haleine de Puck',
        'Phantom Rune': 'Rune d\'illusion',
        'Peasebomb': 'Haricot explosif',
        'Pease': 'Explosion de haricot',
        'Mist Rune': 'Rune d\'eau',
        'Midsummer Night\'s Dream': 'Songe d\'une nuit d\'été',
        'Love-in-Idleness': 'Pensées sauvages',
        'Leafstorm': 'Tempête de feuilles',
        'Hard Swipe': 'Fauchage brutal',
        'Growth Rune': 'Rune de racine',
        'Gentle Breeze': 'Douce brise',
        'Frost Rune': 'Rune de gel',
        'Flame Rune': 'Rune de feu',
        'Flame Hammer': 'Marteau de feu',
        'Fae Light': 'Lueur féérique',
        'Enrage': 'Enrage',
        'Divination Rune': 'Rune de malice',
        'Chain Of Brambles': 'Chaînes de ronces',
        'Bright Sabbath': 'Sabbat en plein jour',
        'Being Mortal': 'Deuil des vivants',
        '--untargetable--': '--Impossible à cibler--',
        '--targetable--': '--Ciblable--',
        '--sync--': '--Synchronisation--',
        '--Reset--': '--Réinitialisation--',
      },
      '~effectNames': {
        'Thorny Vine': 'Sarment De Ronces',
        'Summon Order': 'Action en attente: 1',
        'Lightning Resistance Down II': 'Résistance à la foudre réduite+',
        'Fire Resistance Up': 'Résistance Au Feu Accrue',
        'Fire Resistance Down II': 'Résistance au feu réduite+',
        'Embolden': 'Enhardissement',
        'Blunt Resistance Down': 'Résistance Au Contondant Réduite',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'spirit of flame': '火の精',
        'Titania': 'ティターニア',
        'Puck': 'パック',
        'Peaseblossom': 'ピーズブロッサム',
        'Mustardseed': 'マスタードシード',
        'Innocence': 'イノセンス',
        'Engage!': '戦闘開始！',
      },
      'replaceText': {
        'attack': '攻撃',
        'Wood\'s Embrace': '絡みつき',
        'Whispering Wind': 'ウィスパリング・ウィンド',
        'War and Pease': '大豆爆発',
        'Wallop': '叩きつけ',
        'Uplift': '隆起',
        'Unknown Ability': 'Unknown Ability',
        'Thunder Rune': '雷のルーン',
        'Pummel': '殴打',
        'Puck\'s Rebuke': 'パックレビューク',
        'Puck\'s Caprice': 'パック・カプリース',
        'Puck\'s Breath': 'パック・ブレス',
        'Phantom Rune': '幻のルーン',
        'Peasebomb': 'ビーズボム',
        'Pease': '豆爆発',
        'Mist Rune': '水のルーン',
        'Midsummer Night\'s Dream': 'ミッドサマー・ナイツドリーム',
        'Love-in-Idleness': 'ラブ・イン・アイドルネス',
        'Leafstorm': 'リーフストーム',
        'Hard Swipe': 'ハードスワイプ',
        'Growth Rune': '根のルーン',
        'Gentle Breeze': '上風',
        'Frost Rune': '氷のルーン',
        'Flame Rune': '火のルーン',
        'Flame Hammer': 'フレイムハンマー',
        'Fae Light': '妖精光',
        'Divination Rune': '魔のルーン',
        'Chain Of Brambles': 'ブランブルチェーン',
        'Bright Sabbath': 'ブライトサバト',
        'Being Mortal': '死すべき定め',
      },
      '~effectNames': {
        'Thorny Vine': '茨の蔓',
        'Summon Order': 'アクション実行待機I',
        'Lightning Resistance Down II': '雷属性耐性低下［強］',
        'Fire Resistance Up': '火属性耐性向上',
        'Fire Resistance Down II': '火属性耐性低下[強]',
        'Embolden': 'エンボルデン',
        'Blunt Resistance Down': '打属性耐性低下',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'spirit of flame': '炎精',
        'Spirit of Flame': '炎精',
        'Spirit of Wood': '木精',
        'Titania': '缇坦妮雅',
        'Puck': '帕克',
        'Peaseblossom': '豌豆花',
        'Mustardseed': '芥子',
        'Innocence': '无瑕灵君',
        'Engage!': '战斗开始！',
      },
      'replaceText': {
        'attack': '攻击',
        'Wood\'s Embrace': '缠绕',
        'Whispering Wind': '细语微风',
        'War And Pease': '豌豆大爆炸',
        'War and Pease': '豌豆大爆炸',
        'Wallop': '敲击',
        'Uplift': '隆起',
        'Thunder Rune': '雷之符文',
        'Pummel': '殴打',
        'Puck\'s Rebuke': '帕克的指责',
        'Puck\'s Caprice': '帕克的随想',
        'Puck\'s Breath': '帕克的吐息',
        'Phantom Rune In': '幻之符文靠近',
        'Phantom Rune Out': '幻之符文远离',
        'Phantom Rune': '幻之符文',
        'Peasebomb': '豌豆炸弹',
        'Pease': '豌豆爆炸',
        'Mist Rune': '水之符文',
        'Midsummer Night\'s Dream': '仲夏夜之梦',
        'Love-in-Idleness': '爱懒花',
        'Love-In-Idleness': '爱懒花',
        'Leafstorm': '绿叶风暴',
        'Hard Swipe': '强烈重击',
        'Growth Rune': '根之符文',
        'Gentle Breeze': '青翠柔风',
        'Frost Rune': '冰之符文',
        'Flame Rune': '火之符文',
        'Flame Hammer': '烈火锤',
        'Fae Light': '妖灵光',
        'Divination Rune': '魔之符文',
        'Chain Of Brambles': '荆棘链',
        'Bright Sabbath Enrage': '欢快的安息日 狂暴',
        'Bright Sabbath': '欢快的安息日',
        'Being Mortal': '终有一死',
        '--center--': '--中场集合--',
        '--untargetable--': '--无法选中--',
        '--targetable--': '--可选中--',
      },
      '~effectNames': {
        'Thorny Vine': '荆棘丛生',
        'Summon Order': '发动技能待命I',
        'Lightning Resistance Down II': '雷属性耐性大幅降低',
        'Fire Resistance Up': '火属性耐性提升',
        'Fire Resistance Down II': '火属性耐性大幅降低',
        'Embolden': '鼓励',
        'Blunt Resistance Down': '打击耐性降低',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Spirit of Flame': '불의 정령',
        'Titania': '티타니아',
        'Puck': '요정의 권속',
        'Peaseblossom': '콩나무',
        'Mustardseed': '겨자씨',
        'Engage!': '전투 시작!',
      },
      'replaceText': {
        'attack': '공격',
        'Wood\'s Embrace': '휘감기',
        'Whispering Wind': '속삭이는 바람',
        'War and Pease': '큰콩 폭발',
        'Wallop': '매질',
        'Uplift': '융기',
        'Thunder Rune': '번개의 룬',
        'Pummel': '구타',
        'Puck\'s Rebuke': '요정의 꾸지람',
        'Puck\'s Caprice': '요정의 변덕',
        'Puck\'s Breath': '요정의 숨결',
        'Phantom Rune': '환상의 룬',
        'Peasebomb': '콩폭탄',
        'Pease': '콩 폭발',
        'Mist Rune': '물의 룬',
        'Midsummer Night\'s Dream': '한여름 밤의 꿈',
        'Love-in-Idleness': '삼색제비꽃',
        'Leafstorm': '잎사귀 폭풍',
        'Hard Swipe': '강력한 후려치기',
        'Growth Rune': '뿌리의 룬',
        'Gentle Breeze': '윗바람',
        'Frost Rune': '얼음의 룬',
        'Flame Rune': '불의 룬',
        'Flame Hammer': '불꽃 망치',
        'Fae Light': '요정광',
        'Enrage': '전멸기',
        'Divination Rune': '마법의 룬',
        'Chain Of Brambles': '나무딸기 사슬',
        'Bright Sabbath': '빛나는 안식',
        'Being Mortal': '죽어야 할 운명',
        '--untargetable--': '--타겟 불가능--',
        '--targetable--': '--타겟 가능--',
        '--center--': '--중앙--',
      },
      '~effectNames': {
        'Thorny Vine': '가시 덩굴',
        // 'Summon Order': '',
        'Lightning Resistance Down II': '번개 저항 감소 [강]',
        'Fire Resistance Up': '불속성 저항 증가',
        'Fire Resistance Down II': '불속성 저항 감소 [강]',
        'Embolden': '격려',
        // 'Blunt Resistance Down': '',
      },
    },
  ],
}];
