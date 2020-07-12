'use strict';

// TODO: do the gobcut and gobstraight really alternate?
// if so, then maybe we could call out which was coming.
// I thought some of them were fixed and don't have enough data.

// TODO: is it worth calling out where to hide for Bomb's Away?
// There's a callout for where to hit the bombs to that everybody
// will see, and it's natural to go away from that.  An extra
// callout seems noisy.

// TODO: is it worth calling out a safe spot for the second boost?
// There's some notes below, but good words for directions are hard.

let bombLocation = (matches) => {
  // x = -15, -5, +5, +15 (east to west)
  // y = -205, -195, -185, -175 (north to south)
  return {
    x: Math.round((parseFloat(matches.x) + 15) / 10),
    y: Math.round((parseFloat(matches.y) + 205) / 10),
  };
};

[{
  zoneRegex: {
    en: /^Alexander - The Fist Of The Son \(Savage\)$/,
    cn: /^亚历山大零式机神城 \(律动之章1\)$/,
  },
  zoneId: ZoneId.AlexanderTheFistOfTheSonSavage,
  timelineFile: 'a5s.txt',
  timelineTriggers: [
    {
      id: 'A5S Kaltstrahl',
      regex: /Kaltstrahl/,
      // Hopefully you'll figure it out the first time.
      suppressSeconds: 9999,
      response: Responses.tankCleave('info'),
    },
    {
      id: 'A5S Panzerschreck',
      regex: /Panzerschreck/,
      beforeSeconds: 10,
      suppressSeconds: 10,
      response: Responses.aoe(),
    },
    {
      id: 'A5S Gobhook',
      regex: /Gobhook/,
      // Needs more warning than the cast.
      beforeSeconds: 7,
      suppressSeconds: 1,
      response: Responses.getBehind('alert'),
    },
    {
      id: 'A5S Boost',
      regex: /Boost/,
      beforeSeconds: 10,
      suppressSeconds: 1,
      alertText: {
        en: 'Bird Soon (Purple)',
        de: 'Vogel bald (Lila)',
      },
    },
    {
      id: 'A5S Bomb\'s Away Soon',
      regex: /Bomb's Away/,
      beforeSeconds: 10,
      suppressSeconds: 1,
      alertText: {
        en: 'Gorilla Soon (Red)',
        de: 'Gorilla bald (Rot)',
      },
    },
    {
      id: 'A5S Debuff Refresh',
      regex: /Disorienting Groan/,
      beforeSeconds: 1,
      suppressSeconds: 1,
      infoText: {
        en: 'refresh debuff in puddle soon',
        de: 'Debuff in der Fläsche bald erneuern',
      },
    },
  ],
  triggers: [
    {
      id: 'A5S Gobcut Stack',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      response: Responses.stackOn('alert'),
    },
    {
      id: 'A5S Concussion',
      netRegex: NetRegexes.gainsEffect({ effectId: '3E4' }),
      response: function(data, matches) {
        if (matches.target === data.me)
          return;
        if (data.role === 'tank')
          return Responses.tankSwap('alarm');
        if (data.job === 'blu')
          return Responses.tankSwap('info');
      },
    },
    {
      id: 'A5S Bomb Direction',
      netRegex: NetRegexes.ability({ source: 'Ratfinx Twinkledinks', id: '1590', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Ratfix Blinkdings', id: '1590', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Ratfinx Le Génie', id: '1590', capture: false }),
      netRegexJa: NetRegexes.ability({ source: '奇才のラットフィンクス', id: '1590', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '재주꾼 랫핑크스', id: '1590', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '奇才 拉特芬克斯', id: '1590', capture: false }),
      preRun: function(data) {
        data.bombCount = data.bombCount || 0;
        data.bombCount++;
      },
      // We could give directions here, but "into / opposite spikey" is pretty succinct.
      infoText: function(data) {
        if (data.bombCount == 1) {
          return {
            en: 'Knock Bombs Into Spikey',
            de: 'Bombe in die Spike-Bombe stoßen',
          };
        }
        return {
          en: 'Knock Bombs Opposite Spikey',
          de: 'Bombe gegnüber der Spike-Bombe stoßen',
        };
      },
    },
    {
      id: 'A5S Boost Count',
      netRegex: NetRegexes.ability({ source: 'Ratfinx Twinkledinks', id: '16A6', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Ratfix Blinkdings', id: '16A6', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Ratfinx Le Génie', id: '16A6', capture: false }),
      netRegexJa: NetRegexes.ability({ source: '奇才のラットフィンクス', id: '16A6', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '재주꾼 랫핑크스', id: '16A6', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '奇才 拉特芬克斯', id: '16A6', capture: false }),
      run: function(data) {
        data.boostCount = data.boostCount || 0;
        data.boostCount++;
        data.boostBombs = [];
      },
    },
    {
      id: 'A5S Bomb',
      netRegex: NetRegexes.addedCombatantFull({ name: 'Bomb' }),
      netRegexDe: NetRegexes.addedCombatantFull({ name: 'Bombe' }),
      netRegexFr: NetRegexes.addedCombatantFull({ name: 'Bombe' }),
      netRegexJa: NetRegexes.addedCombatantFull({ name: '爆弾' }),
      netRegexKo: NetRegexes.addedCombatantFull({ name: '폭탄' }),
      netRegexCn: NetRegexes.addedCombatantFull({ name: '炸弹' }),
      preRun: function(data, matches) {
        data.boostBombs = data.boostBombs || [];
        data.boostBombs.push(bombLocation(matches));
      },
      alertText: function(data) {
        if (data.boostCount == 1) {
          if (data.boostBombs.length != 1)
            return;
          // index 0 = NW, 3 = NE, 12 = SW, 15 = SE
          let index = data.boostBombs[0].x + data.boostBombs[0].y * 4;
          return {
            0: {
              en: 'NW first',
              de: 'NW zuerst',
            },
            3: {
              en: 'NE first',
              de: 'NO zuerst',
            },
            12: {
              en: 'SW first',
              de: 'SW zuerst',
            },
            15: {
              en: 'SE first',
              de: 'SO zuerst',
            },
          }[index];
        }

        // Otherwise, we're on the second and final set of boost bombs.
        // TODO: This would be trivial to find the safe spot,
        // buuuuut this is hard to find good words for 16 spots.
        // Do you call it "NNW" or "East of NW But Also Outside" @_@
      },
    },
    {
      id: 'A5S Prey',
      netRegex: NetRegexes.headMarker({ id: '001E' }),
      condition: Conditions.targetIsYou(),
      alertText: {
        en: 'Get Away',
        de: 'Weg gehen',
      },
    },
    {
      id: 'A5S Prey Healer',
      netRegex: NetRegexes.headMarker({ id: '001E' }),
      condition: function(data) {
        return data.role === 'healer';
      },
      infoText: function(data, matches) {
        return {
          en: 'Shield ' + data.ShortName(matches.target),
          de: 'Schild ' + data.ShortName(matches.target),
        };
      },
    },
    {
      id: 'A5S Glupgloop',
      netRegex: NetRegexes.headMarker({ id: '0017' }),
      condition: Conditions.targetIsYou(),
      alarmText: {
        en: 'GLOOPYGLOOP~',
        de: 'GLOOPYGLOOP~',
      },
    },
    {
      id: 'A5S Snake Adds',
      netRegex: NetRegexes.addedCombatant({ name: 'Glassy-Eyed Cobra', capture: false }),
      netRegexDe: NetRegexes.addedCombatant({ name: 'Aufgerüstet(?:e|er|es|en) Kobra', capture: false }),
      netRegexFr: NetRegexes.addedCombatant({ name: 'Cobra Au Regard Vide', capture: false }),
      netRegexJa: NetRegexes.addedCombatant({ name: 'ドーピング・コブラ', capture: false }),
      netRegexKo: NetRegexes.addedCombatant({ name: '약에 찌든 코브라', capture: false }),
      netRegexCn: NetRegexes.addedCombatant({ name: '兴奋眼镜蛇', capture: false }),
      suppressSeconds: 5,
      response: Responses.killAdds(),
    },
    {
      id: 'A5S Steel Scales',
      netRegex: NetRegexes.startsUsing({ source: 'Glassy-Eyed Cobra', id: '16A2' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Aufgerüstet(?:e|er|es|en) Kobra', id: '16A2' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Cobra Au Regard Vide', id: '16A2' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ドーピング・コブラ', id: '16A2' }),
      netRegexKo: NetRegexes.startsUsing({ source: '약에 찌든 코브라', id: '16A2' }),
      netRegexCn: NetRegexes.startsUsing({ source: '兴奋眼镜蛇', id: '16A2' }),
      condition: function(data) {
        return data.CanStun();
      },
      suppressSeconds: 60,
      response: Responses.stun(),
    },
    {
      id: 'A5S Anti-Coagulant Cleanse',
      netRegex: NetRegexes.gainsEffect({ effectId: '3EC' }),
      condition: Conditions.targetIsYou(),
      durationSeconds: 8,
      suppressSeconds: 30,
      alertText: {
        en: 'Cleanse (Green)',
        de: 'Reinigen (Grün)',
      },
    },
    {
      id: 'A5S Gobbledygroper',
      // FIXME: this is a case where the tether is part of the added combatant network data,
      // but isn't exposed as a separate tether line.  Instead, just assume the first auto
      // is going to hit the tethered person, and suppress everything else.
      netRegex: NetRegexes.ability({ source: 'Gobbledygroper', id: '366' }),
      netRegexDe: NetRegexes.ability({ source: 'Gobgreifer', id: '366' }),
      netRegexFr: NetRegexes.ability({ source: 'Gobchimère', id: '366' }),
      netRegexJa: NetRegexes.ability({ source: 'ゴブリキマイラ', id: '366' }),
      netRegexKo: NetRegexes.ability({ source: '고블키마이라', id: '366' }),
      netRegexCn: NetRegexes.ability({ source: '哥布林奇美拉', id: '366' }),
      condition: Conditions.targetIsYou(),
      suppressSeconds: 100,
      alertText: {
        en: 'Break Tether (Blue)',
        de: 'Verbindungen brechen (Blau)',
      },
    },
    {
      id: 'A5S Oogle',
      netRegex: NetRegexes.startsUsing({ source: 'Gobbledygawker', id: '169C', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Gobglotzer', id: '169C', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Gobœil', id: '169C', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ゴブリアイ', id: '169C', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '고블주시자', id: '169C', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '哥布之眼', id: '169C', capture: false }),
      // These seem to come within ~2s of each other, so just have one trigger.
      suppressSeconds: 5,
      response: Responses.lookAway('alert'),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        '(?<!Hummel)Faust': 'Faust',
        '(?<!Smart)Bomb': 'Bombe',
        'Hummelfaust': 'Hummelfaust',
        'Gobbledygroper': 'Gobgreifer',
        'Ratfinx Twinkledinks': 'Ratfix Blinkdings',
        'Smartbomb': 'Best(?:e|er|es|en) Sprengenkörper',
      },
      'replaceText': {
        '--big--': '--Groß--',
        '--small--': '--Klein--',
        '10-Tonze Slash': '11-Tonzen-Schlag',
        'Big Burst': 'Detonation',
        'Bomb\'s Away': 'Plumpsbombe',
        'Boost': 'Starksammeln',
        'Cobra': 'Kobra',
        'Disorienting Groan': 'Kampfgebrüll',
        'Feast': 'Festmahl',
        'Glupgloop': 'Sauresaft',
        'Gobbledygawker': 'Gobglotzer',
        'Gobbledygroper Add': 'Gobgreifer  Add',
        'Gobcut/Straight': 'Gobhaken/gerade',
        'Gobdash': 'Große Karacho',
        'Gobhook': 'Bogene Haken',
        'Gobjab': 'Hüpfzzu mal',
        'Gobstraight/Cut': 'Gobgerade/haken',
        'Gobswing': 'Schwirrenschwung',
        'Guzzle': 'Gluckgluck',
        'Kaltstrahl': 'Kaltstrahl',
        'Minotaur': 'Minotaurus',
        'Oogle': 'Steinstarren',
        'Panzer Vor': 'Panzer vor',
        'Panzerschreck': 'Panzerschreck',
        'Regorge': 'Auswürgen',
        'Relaxant': 'Ausnüchterung',
        'Shabti': 'Shabti',
        'Shock Therapy': 'Kleine Knisterklaps',
        'Steel Scales': 'Stahlschuppen',
        'Tetra Burst': 'Tetra-Detonation',
        'The Lion\'s Breath': 'Atem des Löwen',
        'Yorn Pig': 'Mankei',
        '\\(NE\\)': '(NO)',
        '\\(SE\\)': '(SO)',
        '\\(NE/SE\\)': '(NO/SO)',
        '\\(SE/SW\\)': '(SO/SW)',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Hummelfaust': 'hummelfaust',
        'Ratfinx Twinkledinks': 'Ratfinx le Génie',
        'Smartbomb': 'mégagobbombe',
      },
      'replaceText': {
        '10-Tonze Slash': 'Taillade de 10 tonz',
        'Big Burst': 'Grosse explosion',
        'Bomb\'s Away': 'Lâcher de bombe',
        'Boost': 'Contraction musculaire',
        'Disorienting Groan': 'Cri désorientant',
        'Feast': 'Festin',
        'Glupgloop': 'Gobacide gluant',
        'Gobdash': 'Gobcharge',
        'Gobhook': 'Gobcrochet',
        'Gobjab': 'Gobcoup du gauche',
        'Gobswing': 'Gobcrochet plongeant',
        'Guzzle': 'Glouglou',
        'Kaltstrahl': 'Kaltstrahl',
        'Oogle': 'Vue pétrifiante',
        'Panzer Vor': 'Panzer Vor',
        'Panzerschreck': 'Panzerschreck',
        'Regorge': 'Vomissure',
        'Relaxant': 'Décontracturant',
        'Shock Therapy': 'Thérapie de choc',
        'Steel Scales': 'Écailles d\'acier',
        'Tetra Burst': 'Explosion en croix',
        'The Lion\'s Breath': 'Souffle du lion',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Hummelfaust': 'ネオ・ファウスト',
        'Ratfinx Twinkledinks': '奇才のラットフィンクス',
        'Smartbomb': '超高性能爆弾',
      },
      'replaceText': {
        '10-Tonze Slash': '10トンズ・スラッシュ',
        'Big Burst': '大爆発',
        'Bomb\'s Away': '爆弾投下',
        'Boost': '力溜め',
        'Disorienting Groan': '雄叫び',
        'Feast': 'フィースト',
        'Glupgloop': '強酸性劇物薬',
        'Gobdash': '怒濤のダッシュブロー',
        'Gobhook': '剛力のフック',
        'Gobjab': '牽制のジャブ',
        'Gobswing': '激震のオーバーハンド',
        'Guzzle': 'ガブ飲み',
        'Kaltstrahl': 'カルトシュトラール',
        'Oogle': '石化の視線',
        'Panzer Vor': 'パンツァーフォー',
        'Panzerschreck': 'パンツァーシュレッケ',
        'Regorge': 'リゴージ',
        'Relaxant': '薬効切れ',
        'Shock Therapy': '雷気ショック',
        'Steel Scales': 'スチールスケール',
        'Tetra Burst': '四方爆発',
        'The Lion\'s Breath': 'フレイムブレス',
      },
    },
    {
      'locale': 'cn',
      'missingTranslations': true,
      'replaceSync': {
        'Hummelfaust': '新型浮士德',
        'Ratfinx Twinkledinks': '奇才 拉特芬克斯',
        'Smartbomb': '超高性能炸弹',
      },
      'replaceText': {
        '10-Tonze Slash': '十吨挥打',
        'Big Burst': '大爆炸',
        'Bomb\'s Away': '投放炸弹',
        'Boost': '蓄力',
        'Disorienting Groan': '吼叫',
        'Feast': '飨宴',
        'Glupgloop': '强酸剧毒药',
        'Gobdash': '怒涛冲拳',
        'Gobhook': '刚猛勾拳',
        'Gobjab': '牵制刺拳',
        'Gobswing': '激震抛拳',
        'Guzzle': '一饮而尽',
        'Kaltstrahl': '寒光',
        'Oogle': '石化视线',
        'Panzer Vor': '战车前进',
        'Panzerschreck': '反坦克火箭筒',
        'Regorge': '喷毒',
        'Relaxant': '药物失效',
        'Shock Therapy': '电气冲击',
        'Steel Scales': '钢鳞',
        'Tetra Burst': '四方爆炸',
        'The Lion\'s Breath': '火焰吐息',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {
        'Hummelfaust': '네오 파우스트',
        'Ratfinx Twinkledinks': '재주꾼 랫핑크스',
        'Smartbomb': '초고성능 폭탄',
      },
      'replaceText': {
        '10-Tonze Slash': '10톤즈 베기',
        'Big Burst': '대폭발',
        'Bomb\'s Away': '폭탄 투하',
        'Boost': '힘 모으기',
        'Disorienting Groan': '우렁찬 외침',
        'Feast': '사육제',
        'Glupgloop': '강산성 극약',
        'Gobdash': '노도의 접근 강타',
        'Gobhook': '저력의 옆치기',
        'Gobjab': '견제타',
        'Gobswing': '격진의 주먹 휘두르기',
        'Guzzle': '들이켜기',
        'Kaltstrahl': '냉병기 공격',
        'Oogle': '석화 시선',
        'Panzer Vor': '기갑 전진',
        'Panzerschreck': '대전차포',
        'Regorge': '게워내기',
        'Relaxant': '약효 소진',
        'Shock Therapy': '감전 충격',
        'Steel Scales': '강철 비늘',
        'Tetra Burst': '사방 폭발',
        'The Lion\'s Breath': '화염 숨결',
      },
    },
  ],
}];
