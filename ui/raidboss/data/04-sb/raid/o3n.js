import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';

// O3 - Deltascape 3.0 Normal
export default {
  zoneId: ZoneId.DeltascapeV30,
  timelineFile: 'o3n.txt',
  timelineTriggers: [
    {
      id: 'O3N Frost Breath',
      regex: /Frost Breath/,
      beforeSeconds: 4,
      response: Responses.tankCleave('alert'),
    },
  ],
  triggers: [
    {
      id: 'O3N Phase Initialization',
      netRegex: NetRegexes.ability({ id: '367', source: 'Halicarnassus', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '367', source: 'Halikarnassos', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '367', source: 'Halicarnasse', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '367', source: 'ハリカルナッソス', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '367', source: '哈利卡纳苏斯', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '367', source: '할리카르나소스', capture: false }),
      condition: function(data) {
        return !data.phaseNumber;
      },
      run: function(data) {
        // Indexing phases at 1 so as to make phases match what humans expect.
        // 1: We start here.
        // 2: Cave phase with Uplifts.
        // 3: Post-intermission, with good and bad frogs.
        data.phaseNumber = 1;
      },
    },
    {
      id: 'O3N Phase Tracker',
      netRegex: NetRegexes.startsUsing({ id: '2304', source: 'Halicarnassus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2304', source: 'Halikarnassos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2304', source: 'Halicarnasse', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2304', source: 'ハリカルナッソス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2304', source: '哈利卡纳苏斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2304', source: '할리카르나소스', capture: false }),
      run: function(data) {
        data.phaseNumber += 1;
      },
    },
    {
      // Normal spellblade holy with one stack point.
      // "64" is a stack marker.  "65" is the prey marker.
      // The debuff order in the logs is:
      //   (1) stack marker
      //   (2) prey marker
      //   (3) prey marker
      id: 'O3N Spellblade Holy Standard',
      netRegex: NetRegexes.headMarker({ id: ['0064', '0065'] }),
      condition: function(data, matches) {
        // Cave phase has no stack markers.
        if (data.phaseNumber === 2)
          return false;

        data.holyTargets = data.holyTargets || [];
        data.holyTargets.push(matches.target);
        return data.holyTargets.length === 3;
      },
      alertText: function(data, _, output) {
        if (data.holyTargets[0] === data.me)
          return output.stackOnYou();

        for (let i = 1; i < 3; i++) {
          if (data.holyTargets[i] === data.me)
            return output.out();
        }
        return output.stackOnHolytargets({ holyTargets: data.holyTargets[0] });
      },
      run: function(data) {
        delete data.holyTargets;
      },
      outputStrings: {
        stackOnYou: {
          en: 'Stack on YOU',
          de: 'Auf DIR sammeln',
          fr: 'Package sur VOUS',
          ja: '自分にスタック',
          cn: '集合点名',
          ko: '쉐어징 대상자',
        },
        out: {
          en: 'Out',
          de: 'Raus',
          fr: 'Extérieur',
          ja: '外へ',
          cn: '远离',
          ko: '밖으로',
        },
        stackOnHolytargets: {
          en: 'Stack on ${holyTargets}',
          de: 'Stack auf ${holyTargets}',
          fr: 'Packez-vous sur ${holyTargets}',
          ja: '${holyTargets}にスタック',
          cn: '靠近 ${holyTargets}集合',
          ko: '"${holyTargets}" 쉐어징',
        },
      },
    },
    {
      id: 'O3N Spellblade Holy Cave',
      netRegex: NetRegexes.headMarker({ id: '0065' }),
      condition: function(data, matches) {
        return data.phaseNumber === 2 && data.me === matches.target;
      },
      response: Responses.spread(),
    },
    {
      id: 'O3N Spellblade Holy Mindjack',
      netRegex: NetRegexes.headMarker({ id: '0064' }),
      condition: function(data) {
        if (data.phaseNumber < 3)
          return false;
        data.holyCounter = data.holyCounter || 0;
        return (data.holyCounter % 2 === 0);
      },
      response: Responses.stackMarkerOn(),
      run: function(data) {
        data.holyCounter += 1;
        delete data.holyTargets;
      },
    },
    {
      id: 'O3N The Queen\'s Waltz: Crystal Square',
      netRegex: NetRegexes.startsUsing({ id: '2471', source: 'Halicarnassus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2471', source: 'Halikarnassos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2471', source: 'Halicarnasse', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2471', source: 'ハリカルナッソス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2471', source: '哈利卡纳苏斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2471', source: '할리카르나소스', capture: false }),
      infoText: (data, _, output) => output.getOnCrystalSquare(),
      tts: (data, _, output) => output.blueSquare(),
      outputStrings: {
        getOnCrystalSquare: {
          en: 'Get on crystal square',
          de: 'Kristallfeld',
          fr: 'Allez sur un carré de cristal',
          ja: '青い床に',
          cn: '站在蓝地板',
          ko: '파란 장판으로',
        },
        blueSquare: {
          en: 'blue square',
          de: 'blaues feld',
          fr: 'Carré bleu',
          ja: '青い床',
          cn: '蓝地板',
          ko: '파란 장판',
        },
      },
    },
    {
      id: 'O3N Great Dragon',
      netRegex: NetRegexes.addedCombatant({ name: 'Great Dragon', capture: false }),
      netRegexDe: NetRegexes.addedCombatant({ name: 'Riesendrache', capture: false }),
      netRegexFr: NetRegexes.addedCombatant({ name: 'dragon suprême', capture: false }),
      netRegexJa: NetRegexes.addedCombatant({ name: 'ドラゴングレイト', capture: false }),
      netRegexCn: NetRegexes.addedCombatant({ name: '巨龙', capture: false }),
      netRegexKo: NetRegexes.addedCombatant({ name: '거대 드래곤', capture: false }),
      condition: function(data) {
        return data.role === 'tank';
      },
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Grab dragon',
          de: 'Drachen nehmen',
          fr: 'Attrapez le dragon',
          ja: 'ドラゴンを取って',
          cn: '拉住巨龙',
          ko: '용 잡기',
        },
      },
    },
    {
      id: 'O3N Game Counter Initialize',
      netRegex: NetRegexes.startsUsing({ id: '2304', source: 'Halicarnassus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2304', source: 'Halikarnassos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2304', source: 'Halicarnasse', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2304', source: 'ハリカルナッソス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2304', source: '哈利卡纳苏斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2304', source: '할리카르나소스', capture: false }),
      run: function(data) {
        data.gameCount = data.gameCount || 1;
      },
    },
    {
      id: 'O3N Good Ribbit',
      netRegex: NetRegexes.startsUsing({ id: '2466', source: 'Halicarnassus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2466', source: 'Halikarnassos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2466', source: 'Halicarnasse', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2466', source: 'ハリカルナッソス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2466', source: '哈利卡纳苏斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2466', source: '할리카르나소스', capture: false }),
      condition: function(data) {
        return data.phaseNumber === 3 && data.gameCount % 2 === 0;
      },
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get hit by Ribbit',
          de: 'Lass dich von Quaaak treffen',
          fr: 'Soyez frappé par Coâââ',
          ja: 'クルルルルを受ける',
          cn: 'BOSS正面吃呱呱',
          ko: '개굴장판 맞기',
        },
      },
    },
    {
      id: 'O3N Bad Ribbit',
      netRegex: NetRegexes.startsUsing({ id: '2466', source: 'Halicarnassus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2466', source: 'Halikarnassos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2466', source: 'Halicarnasse', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2466', source: 'ハリカルナッソス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2466', source: '哈利卡纳苏斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2466', source: '할리카르나소스', capture: false }),
      condition: function(data) {
        return !(data.phaseNumber === 3 && data.gameCount % 2 === 0);
      },
      response: Responses.awayFromFront(),
    },
    {
      id: 'O3N The Game',
      netRegex: NetRegexes.startsUsing({ id: '246D', source: 'Halicarnassus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '246D', source: 'Halikarnassos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '246D', source: 'Halicarnasse', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '246D', source: 'ハリカルナッソス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '246D', source: '哈利卡纳苏斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '246D', source: '할리카르나소스', capture: false }),
      // No point in checking whether the user has the frog debuff,
      // if they didn't get it, or got it when they shouldn't have, there's no fixing things.
      infoText: function(data, _, output) {
        if (data.phaseNumber === 3 && data.gameCount % 2 === 0)
          return output.standOnFrogTile();

        // Maybe there's a cleaner way to do this than just enumerating roles?
        if (data.role === 'tank')
          return output.standOnShield();

        if (data.role === 'healer')
          return output.standOnCross();

        if (data.role === 'dps')
          return output.standOnSword();
      },
      run: function(data) {
        data.gameCount += 1;
      },
      outputStrings: {
        standOnFrogTile: {
          en: 'Stand on frog tile',
          de: 'Auf Frosch-Fläche stehen',
          fr: 'Placez-vous sur la grenouille',
          ja: 'カエルパネルを踏む',
          cn: '站在呱呱方块',
          ko: '개구리 장판으로',
        },
        standOnShield: {
          en: 'Stand on shield',
          de: 'Auf Schild-Fläche stehen',
          fr: 'Placez-vous sur le bouclier',
          ja: 'タンクパネルを踏む',
          cn: '站在坦克方块',
          ko: '방패 장판으로',
        },
        standOnCross: {
          en: 'Stand on cross',
          de: 'Auf Kreuz-Fläche stehen',
          fr: 'Placez-vous sur la croix',
          ja: 'ヒーラーパネルを踏む',
          cn: '站在治疗方块',
          ko: '십자가 장판으로',
        },
        standOnSword: {
          en: 'Stand on sword',
          de: 'Auf Schwert-Fläche stehen',
          fr: 'Placez-vous sur l\'épée',
          ja: 'DPSパネルを踏む',
          cn: '站在DPS方块',
          ko: '검 장판으로',
        },
      },
    },
    {
      id: 'O3N Mindjack Forward',
      netRegex: NetRegexes.startsUsing({ id: '2467', source: 'Halicarnassus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2467', source: 'Halikarnassos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2467', source: 'Halicarnasse', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2467', source: 'ハリカルナッソス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2467', source: '哈利卡纳苏斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2467', source: '할리카르나소스', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Mindjack: Forward',
          de: 'Geistlenkung: Vorwärts',
          fr: 'Contrainte mentale : vers l\'avant',
          ja: 'マインドジャック: 前進',
          cn: '精神控制：向前',
          ko: '정신 장악: 앞쪽',
        },
      },
    },
    {
      id: 'O3N Mindjack Backward',
      netRegex: NetRegexes.startsUsing({ id: '2468', source: 'Halicarnassus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2468', source: 'Halikarnassos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2468', source: 'Halicarnasse', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2468', source: 'ハリカルナッソス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2468', source: '哈利卡纳苏斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2468', source: '할리카르나소스', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Mindjack: Back',
          de: 'Geistlenkung: Zurück',
          fr: 'Contrainte mentale : vers l\'arrière',
          ja: 'マインドジャック: 後退',
          cn: '精神控制：向后',
          ko: '정신 장악: 뒤쪽',
        },
      },
    },
    {
      id: 'O3N Mindjack Left',
      netRegex: NetRegexes.startsUsing({ id: '2469', source: 'Halicarnassus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2469', source: 'Halikarnassos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2469', source: 'Halicarnasse', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2469', source: 'ハリカルナッソス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2469', source: '哈利卡纳苏斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2469', source: '할리카르나소스', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Mindjack: Left',
          de: 'Geistlenkung: Links',
          fr: 'Contrainte mentale : vers la gauche',
          ja: 'マインドジャック: 左折',
          cn: '精神控制：向左',
          ko: '정신 장악: 왼쪽',
        },
      },
    },
    {
      id: 'O3N Mindjack Right',
      netRegex: NetRegexes.startsUsing({ id: '246A', source: 'Halicarnassus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '246A', source: 'Halikarnassos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '246A', source: 'Halicarnasse', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '246A', source: 'ハリカルナッソス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '246A', source: '哈利卡纳苏斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '246A', source: '할리카르나소스', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Mindjack: Right',
          de: 'Geistlenkung: Rechts',
          fr: 'Contrainte mentale : vers la droite',
          ja: 'マインドジャック: 右折',
          cn: '精神控制：向右',
          ko: '정신 장악: 오른쪽',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Aetherial Tear': 'Ätherspalt',
        'Great Dragon': 'Riesendrache',
        'Halicarnassus': 'Halikarnassos',
        'Soul Reaper': 'Seelenschnitter',
      },
      'replaceText': {
        'Aetherial Pull': 'Einsaugen',
        'Aetherial Tear': 'Ätherspalt',
        'Cross Reaper': 'Sensenschwung',
        'Dimensional Wave': 'Dimensionswelle',
        'Frost Breath': 'Frostiger Atem',
        'Gusting Gouge': 'Meißelstoß',
        'Holy Blur': 'Heiliger Nebel',
        'Holy Edge': 'Heiliger Grat',
        'Mindjack': 'Geistlenkung',
        'Panel Swap': 'Neuaufstellung',
        'Place Dark Token': 'Todesspielstein',
        'Place Token': 'Spielstein',
        'Ribbit': 'Quaaak',
        'Spellblade Blizzard III': 'Magieklinge Eisga',
        'Spellblade Fire III': 'Magieklinge Feuga',
        'Spellblade Holy': 'Magieklinge Sanctus',
        'Spellblade Thunder III': 'Magieklinge Blitzga',
        'Sword Dance': 'Schwerttanz',
        'The Game': 'Spielbeginn',
        'The Playing Field': 'Spielfeld',
        'The Queen\'s Waltz': 'Tanz der Königin',
        'Ultimum': 'Ende der Dimension',
        'Uplift': 'Erhöhung',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Aetherial Tear': 'Déchirure dimensionnelle',
        'Great Dragon': 'dragon suprême',
        'Halicarnassus': 'Halicarnasse',
        'Soul Reaper': 'faucheur d\'âmes',
      },
      'replaceText': {
        '\\(avoid\\)': '(éviter)',
        '\\(Starry End\\)': '(Fin étoilée)',
        '\\(Sword Dance\\)': '(Danse du sabre)',
        '\\(symbols\\)': '(symboles)',
        '\\(take\\)': '(prendre)',
        '\\(toad\\)': '(crapaud)',
        '\\(Uplift\\)': '(Exhaussement)',
        'Aetherial Pull': 'Aspiration',
        'Aetherial Tear': 'Déchirure dimensionnelle',
        'Cross Reaper': 'Fauchaison',
        'Dimensional Wave': 'Onde dimensionnelle',
        'Frost Breath\\?': 'Souffle glacé ?',
        'Gusting Gouge': 'Gouge cisaillante',
        'Holy Blur': 'Brume sacrée',
        'Holy Edge': 'Taille sacrée',
        'Mindjack': 'Contrainte mentale',
        'Panel Swap': 'Remplacement des cases',
        'Place Dark Token': 'Pions obscurs en jeu',
        'Place Token': 'Pion en jeu',
        'Ribbit': 'Coâââ',
        'Spellblade Blizzard III': 'Magilame Méga Glace',
        'Spellblade Fire III': 'Magilame Méga Feu',
        'Spellblade Holy': 'Magilame Miracle',
        'Spellblade Thunder III': 'Magilame Méga Foudre',
        'Sword Dance': 'Danse du sabre',
        'The Game': 'Début de partie',
        'The Playing Field': 'Plateau de jeu',
        'The Queen\'s Waltz': 'Danse de la reine',
        'Ultimum': 'Déclin dimensionnel',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Aetherial Tear': '次元の裂け目',
        'Great Dragon': 'ドラゴングレイト',
        'Halicarnassus': 'ハリカルナッソス',
        'Soul Reaper': 'ソウルリーパー',
      },
      'replaceText': {
        'Aetherial Pull': '吸引',
        'Aetherial Tear': '次元の裂け目',
        'Cross Reaper': 'クロスリーパー',
        'Dimensional Wave': '次元波動',
        'Frost Breath': 'フロストブレス',
        'Gusting Gouge': 'ガスティンググージ',
        'Holy Blur': 'ホーリーミスト',
        'Holy Edge': 'ホーリーエッジ',
        'Mindjack': 'マインドジャック',
        'Panel Swap': 'パネルシャッフル',
        'Place Dark Token': 'サモンデストークン',
        'Place Token': 'サモントークン',
        'Ribbit': 'クルルルル！',
        'Spellblade Blizzard III': '魔法剣ブリザガ',
        'Spellblade Fire III': '魔法剣ファイガ',
        'Spellblade Holy': '魔法剣ホーリー',
        'Spellblade Thunder III': '魔法剣サンダガ',
        'Sword Dance': '剣の舞い',
        'The Game': 'ゲームスタート',
        'The Playing Field': 'ゲームボード',
        'The Queen\'s Waltz': '女王の舞い',
        'Ultimum': '次元の終焉',
        'Uplift': '隆起',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Aetherial Tear': '次元裂缝',
        'Great Dragon': '巨龙',
        'Halicarnassus': '哈利卡纳苏斯',
        'Soul Reaper': '灵魂收割者',
      },
      'replaceText': {
        'Aetherial Pull': '吸引',
        'Aetherial Tear': '次元裂缝',
        'Cross Reaper': '交叉斩击',
        'Dimensional Wave': '次元波动',
        'Frost Breath': '寒霜吐息',
        'Gusting Gouge': '削风',
        'Holy Blur': '神圣雾',
        'Holy Edge': '神圣刃',
        'Mindjack': '精神控制',
        'Panel Swap': '刷新盘面',
        'Place Dark Token': '召唤死形',
        'Place Token': '召唤魔形',
        'Ribbit': '呱呱呱呱呱！',
        'Spellblade Blizzard III': '魔法剑·冰封',
        'Spellblade Fire III': '魔法剑·爆炎',
        'Spellblade Holy': '魔法剑·神圣',
        'Spellblade Thunder III': '魔法剑·暴雷',
        'Sword Dance': '剑舞',
        'The Game': '游戏开始',
        'The Playing Field': '游戏盘面',
        'The Queen\'s Waltz': '女王之舞',
        'Ultimum': '次元终结',
        'Uplift': '隆起',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Aetherial Tear': '차원의 틈새',
        'Great Dragon': '거대 드래곤',
        'Halicarnassus': '할리카르나소스',
        'Soul Reaper': '영혼 수확자',
      },
      'replaceText': {
        'Aetherial Pull': '흡인',
        'Aetherial Tear': '차원의 틈새',
        'Cross Reaper': '사신의 낫',
        'Dimensional Wave': '차원 파동',
        'Frost Breath': '서리 숨결',
        'Gusting Gouge': '칼날 돌풍',
        'Holy Blur': '성스러운 안개',
        'Holy Edge': '성스러운 칼날',
        'Mindjack': '정신 장악',
        'Panel Swap': '판 바꾸기',
        'Place Dark Token': '죽음의 토큰 소환',
        'Place Token': '토큰 소환',
        'Ribbit': '개굴개굴!',
        'Spellblade Blizzard III': '마법검 블리자가',
        'Spellblade Fire III': '마법검 파이가',
        'Spellblade Holy': '마법검 홀리',
        'Spellblade Thunder III': '마법검 선더가',
        'Sword Dance': '칼춤',
        'The Game': '게임 시작',
        'The Playing Field': '게임판',
        'The Queen\'s Waltz': '여왕의 춤',
        'Ultimum': '차원의 종언',
        'Uplift': '융기',
      },
    },
  ],
};
