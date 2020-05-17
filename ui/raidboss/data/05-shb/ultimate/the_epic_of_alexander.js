'use strict';

// In your cactbot/user/raidboss.js file, add the line:
//   Options.cactbotWormholeStrat = true;
// .. if you want cactbot strat for wormhole.
//
// This is more or less the TPS wormhole strat, with
// some modifications to require less brain.
//
// Original TPS strat: https://www.youtube.com/watch?v=ScBsC5sZRwU
//
// Changes:
// There's no "CC" side or "BJ" side, only left side and right side.
// Start middle, face north, away from alexander.
// Odds go left, evens go right.  1+4 go to robots, 2+3 go back, 5+6+7+8 go side of robot.
// From there, do the same thing you normally would for your number in the TPS strat.
// This means that sometimes 2 is baiting BJ and sometimes 3, so both need to leave room.
// All cleaves go through the middle (easy to know where to face for evens if you don't surecast).
// East/West cardinals always safe after chakrams.
//
// Diagram: https://ff14.toolboxgaming.space/?id=17050133675751&preview=1

// TODO: Future network data mining opportunities.
// These don't show up in the log (yet??):
// * inception orb tethers (likely some "new combatant" flag, like suzex birbs?)
// * escape/contact regulator/prohibition headmarkers


// Due to changes introduced in patch 5.2, overhead markers now have a random offset
// added to their ID. This offset currently appears to be set per instance, so
// we can determine what it is from the first overhead marker we see.
let getHeadmarkerId = (data, matches) => {
  // If we naively just check !data.decOffset and leave it, it breaks if the first marker is 004F.
  // (This makes the offset 0, and !0 is true.)
  if (typeof data.decOffset == 'undefined') {
    // The first 1B marker in the encounter is Limit Cut 1, ID 004F.
    data.decOffset = parseInt(matches.id, 16) - 79;
  }
  // The leading zeroes are stripped when converting back to string, so we re-add them here.
  // Fortunately, we don't have to worry about whether or not this is robust,
  // since we know all the IDs that will be present in the encounter.
  return '00' + (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase();
};

[{
  zoneRegex: {
    en: /^The Epic [Oo]f Alexander \(Ultimate\)$/,
    cn: /^亚历山大绝境战$/,
    ko: /^절 알렉산더 토벌전$/,
  },
  timelineFile: 'the_epic_of_alexander.txt',
  timelineTriggers: [
    {
      id: 'TEA Fluid Swing',
      regex: /Fluid Swing/,
      beforeSeconds: 5,
      // TODO: this is likely calling out twice sometimes because
      // the timeline resyncs and it becomes 5 seconds before again.
      // This is probably a problem for all timeline triggers (whoops)
      // and needs to be fixed more generally rather than adding a
      // suppression.
      preRun: function(data) {
        data.swingCount = (data.swingCount || 0) + 1;
      },
      suppressSeconds: 1,
      alertText: function(data) {
        let multipleSwings = data.swingCount == 2 || data.swingCount == 3;
        if (data.role == 'healer') {
          if (multipleSwings) {
            return {
              en: 'Tank Busters',
              de: 'Tank buster',
              fr: 'Tank busters',
              ja: 'タンクバスター',
              ko: '탱크버스터',
              cn: '死刑',
            };
          }
          if (data.liquidTank) {
            return {
              en: 'Tank Buster on ' + data.ShortName(data.liquidTank),
              de: 'Tank buster',
              fr: 'Tank buster',
              ja: 'タンクバスター',
              ko: '탱크버스터',
              cn: '死刑 -> ' + data.ShortName(data.liquidTank),
            };
          }
          return {
            en: 'Tank Buster',
            de: 'Tank buster',
            fr: 'Tank buster',
            ja: 'タンクバスター',
            ko: '탱크버스터',
            cn: '死刑',
          };
        }

        if (data.role == 'tank') {
          if (data.me == data.handTank && multipleSwings || data.me == data.liquidTank) {
            return {
              en: 'Tank Buster on YOU',
              de: 'Tankbuster auf DIR',
              ja: '自分にタンクバスター',
              fr: 'Tank buster sur VOUS',
              ko: '나에게 탱크버스터',
              cn: '死刑点名',
            };
          }
        }
      },
      infoText: function(data) {
        let multipleSwings = data.swingCount == 2 || data.swingCount == 3;
        if (data.role == 'healer')
          return;
        if (data.me == data.handTank && multipleSwings || data.me == data.liquidTank)
          return;
        return {
          en: 'Tank Cleave',
          de: 'Tank Cleave',
          ja: 'タンククリーブ',
          fr: 'Tank Cleave',
          ko: '탱크 범위 공격',
          cn: '坦克顺劈',
        };
      },
    },
    {
      // Note: there's nothing in the log for when the hand turns into an
      // open palm or a fist, so this just warns when to move and not
      // where to go based on time.
      id: 'TEA Hand of Stuff',
      regex: /Hand of Prayer\/Parting/,
      beforeSeconds: 5,
      condition: function(data) {
        return data.role == 'tank';
      },
      suppressSeconds: 1,
      infoText: {
        en: 'Move Bosses',
        de: 'Bosse bewegen',
        ja: 'ボス動かして',
        ko: '보스 이동 주차',
        cn: '移动Boss',
      },
    },
    {
      id: 'TEA J Kick',
      regex: /J Kick/,
      beforeSeconds: 5,
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank';
      },
      suppressSeconds: 1,
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
        ja: 'AoE',
        cn: 'AOE',
        ko: '전체 공격',
      },
    },
    {
      id: 'TEA Water and Thunder',
      regex: /Water and Thunder/,
      beforeSeconds: 3,
      infoText: {
        en: 'Water/Thunder in 3',
        de: 'Wasser/Blitz in 3',
        ja: '水/雷まで3秒',
        fr: 'Eau/Foudre dans 3',
        ko: '물/번개까지 3초',
        cn: '3秒后水/雷',
      },
    },
    {
      id: 'TEA Flarethrower',
      regex: /Flarethrower/,
      beforeSeconds: 8,
      condition: function(data) {
        return data.me == data.bruteTank && data.phase == 'brute';
      },
      suppressSeconds: 300,
      alertText: {
        en: 'Face Brute Towards Water',
        de: 'Drehe Brute zum Wasser',
        ja: 'ジャスを竜巻に向ける',
        ko: '심판자가 물을 바라보게 유도',
        cn: '残暴正义号拉向水龙卷',
      },
    },
    {
      id: 'TEA Propeller Wind',
      regex: /Propeller Wind/,
      beforeSeconds: 15,
      infoText: {
        en: 'Hide Behind Ice',
        de: 'Hinter dem Eis verstecken',
        ja: '氷の後ろへ',
        fr: 'Derrière la glace',
        ko: '얼음 뒤로 피하기',
        cn: '冰块后躲避',
      },
    },
    {
      id: 'TEA Final Nisi Pass',
      regex: /Propeller Wind/,
      beforeSeconds: 15,
      durationSeconds: 14,
      alertText: function(data) {
        return data.namedNisiPass(data);
      },
    },
    {
      id: 'TEA Wormhole Puddle',
      regex: /Repentance ([1-3])/,
      beforeSeconds: 4,
      alertText: function(data, matches) {
        // data.puddle is set by 'TEA Wormhole TPS Strat' (or by some user trigger).
        // If that's disabled, this will still just call out puddle counts.
        if (matches[1] == data.puddle) {
          return {
            en: 'Soak This Puddle (#' + matches[1] + ')',
            de: 'Fläche nehmen (#' + matches[1] + ')',
            ja: '懺悔踏む (#' + matches[1] + ')',
            fr: 'Absorbe cette flaque (#' + matches[1] + ')',
            ko: '참회 밟기 (#' + matches[1] + ')',
            cn: '踩水圈 (#' + matches[1] + ')',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] == data.puddle)
          return;
        return {
          en: 'Puddle #' + matches[1],
          de: 'Fläche #' + matches[1],
          ja: '懺悔 #' + matches[1],
          fr: 'Flaque #' + matches[1],
          ko: '참회 #' + matches[1],
          cn: '水圈 #' + matches[1],
        };
      },
      tts: function(data, matches) {
        if (matches[1] == data.puddle) {
          return {
            en: 'Soak This Puddle',
            de: 'Fläche nehmen',
            ja: '沼踏んで',
            ko: '웅덩이 밟기',
            cn: '踩水圈',
          };
        }
      },
    },
    {
      // Shared magic tankbuster windup to non-capital Ordained Punishment.
      // Do this from timeline as you can have more than three seconds
      // to move and stack the tanks.
      id: 'TEA Ordained Capital Punishment',
      regex: /^Ordained Capital Punishment$/,
      beforeSeconds: 6,
      alertText: function(data) {
        if (data.role == 'tank' || data.role == 'healer') {
          return {
            en: 'Shared Tankbuster',
            de: 'geteilter Tankbuster',
            ja: 'タンクシェア',
            fr: 'Tankbuster partagé',
            ko: '쉐어 탱크버스터',
            cn: '分摊死刑',
          };
        }
      },
    },
  ],
  triggers: [
    {
      id: 'TEA Brute Phase',
      regex: Regexes.startsUsing({ source: 'Brute Justice', id: '483E', capture: false }),
      regexCn: Regexes.startsUsing({ source: '残暴正义号', id: '483E', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Brutalus', id: '483E', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Justicier', id: '483E', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ブルートジャスティス', id: '483E', capture: false }),
      regexKo: Regexes.startsUsing({ source: '포악한 심판자', id: '483E', capture: false }),
      run: function(data) {
        data.phase = 'brute';
        data.resetState = function() {
          this.enumerations = [];
          this.buffMap = {};
          this.tetherBois = {};
          this.vuln = {};
          delete this.limitCutNumber;
          delete this.limitCutDelay;
        };
        data.resetState();

        data.nisiNames = {
          en: {
            0: 'Blue α',
            1: 'Orange β',
            2: 'Purple γ',
            3: 'Green δ',
          },
          de: {
            0: 'Blau α',
            1: 'Orange β',
            2: 'Lila γ',
            3: 'Grün δ',
          },
          ja: {
            0: '青 α',
            1: 'オレンジ β',
            2: '紫 γ',
            3: '緑 δ',
          },
          fr: {
            0: 'Bleu α',
            1: 'Orange β',
            2: 'Violet γ',
            3: 'Vert δ',
          },
          ko: {
            0: '파랑 α',
            1: '노랑 β',
            2: '보라 γ',
            3: '녹색 δ',
          },
          cn: {
            0: '蓝 α',
            1: '橙 β',
            2: '紫 γ',
            3: '绿 δ',
          },
        }[data.lang];

        // Convenience function called for third and fourth nisi passes.
        data.namedNisiPass = (data) => {
          // error?
          if (!(data.me in data.finalNisiMap)) {
            return {
              en: 'Get Final Nisi (?)',
              de: 'Nehme letzten Nisi (?)',
              ja: '最後のナイサイを取得 (?)',
              fr: 'Récupère Nisi Final (?)',
              ko: '마지막 나이사이 받기 (?)',
              cn: '取得最后审判 (?)',
            };
          }

          if (data.me in data.nisiMap) {
            // If you have nisi, you need to pass it to the person who has that final
            // and who doesn't have nisi.
            let myNisi = data.nisiMap[data.me];
            let names = Object.keys(data.finalNisiMap);
            names = names.filter((x) => data.finalNisiMap[x] == myNisi && x != data.me);

            let namesWithoutNisi = names.filter((x) => !(x in data.nisiMap));

            // If somehow it's the case that you've had SUCH a late pass that there
            // isn't anybody without without nisi, at least use the names of folks who
            // have the final debuff.
            if (namesWithoutNisi.length == 0)
              namesWithoutNisi = names;

            // If somehow still there's nobody, give a message so that it's not silent
            // but you're probably in trouble.
            if (namesWithoutNisi.length == 0) {
              return {
                en: 'Pass ' + data.nisiNames[myNisi] + ' Nisi',
                de: 'Gebe ' + data.nisiNames[myNisi] + ' Nisi',
                ja: data.nisiNames[myNisi] + ' を渡す',
                fr: 'Passe ' + data.nisiNames[myNisi] + ' Nisi',
                ko: '나이사이 건네기: ' + data.nisiNames[myNisi],
                cn: '传递 ' + data.nisiNames[myNisi] + '审判',
              };
            }

            // The common case.  Hopefully there's only one person in the names list,
            // but you never know.
            return {
              en: 'Pass ' + data.nisiNames[myNisi] + ' to ' +
                  namesWithoutNisi.map((x) => data.ShortName(x)).join(', or '),
              de: 'Gebe ' + data.nisiNames[myNisi] + ' zu ' +
                  namesWithoutNisi.map((x) => data.ShortName(x)).join(', oder '),
              ja: data.nisiNames[myNisi] + ' を ' +
                  namesWithoutNisi.map((x) => data.ShortName(x)).join(', か ') + ' に渡す',
              fr: 'Passe ' + data.nisiNames[myNisi] + ' à ' +
                  namesWithoutNisi.map((x) => data.ShortName(x)).join(', ou '),
              ko: '나이사이 건네기: ' + data.nisiNames[myNisi] + ' → ' +
                  namesWithoutNisi.map((x) => data.ShortName(x)).join(', 또는 '),
              cn: '将 ' + data.nisiNames[myNisi] + ' 传给 ' +
                  namesWithoutNisi.map((x) => data.ShortName(x)).join(', 或 '),
            };
          }

          // If you don't have nisi, then you need to go get it from a person who does.
          let myNisi = data.finalNisiMap[data.me];
          let names = Object.keys(data.nisiMap);
          names = names.filter((x) => data.nisiMap[x] == myNisi);
          if (names.length == 0) {
            return {
              en: 'Get ' + data.nisiNames[myNisi],
              de: 'Nimm ' + data.nisiNames[myNisi],
              ja: data.nisiNames[myNisi] + ' を取る',
              fr: 'Récupère ' + data.nisiNames[myNisi],
              ko: '나이사이 가져오기: ' + data.nisiNames[myNisi],
              cn: '获得 ' + data.nisiNames[myNisi],
            };
          }
          return {
            en: 'Get ' + data.nisiNames[myNisi] + ' from ' + data.ShortName(names[0]),
            de: 'Nimm ' + data.nisiNames[myNisi] + ' von ' + data.ShortName(names[0]),
            ja: data.ShortName(names[0]) + ' から ' + data.nisiNames[myNisi] + ' を取る',
            fr: 'Récupère ' + data.nisiNames[myNisi] + ' de ' + data.ShortName(names[0]),
            ko: '나이사이 가져오기: ' + data.nisiNames[myNisi] + ' ← ' + data.ShortName(names[0]),
            cn: '从 ' + data.ShortName(names[0]) + '获得' + data.nisiNames[myNisi],
          };
        };
      },
    },
    {
      id: 'TEA Inception Phase',
      regex: Regexes.startsUsing({ source: 'Alexander Prime', id: '486F', capture: false }),
      regexCn: Regexes.startsUsing({ source: '至尊亚历山大', id: '486F', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Prim-Alexander', id: '486F', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Primo-Alexander', id: '486F', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'アレキサンダー・プライム', id: '486F', capture: false }),
      regexKo: Regexes.startsUsing({ source: '알렉산더 프라임', id: '486F', capture: false }),
      run: function(data) {
        data.phase = 'inception';
        data.resetState();
      },
    },
    {
      id: 'TEA Wormhole Phase',
      regex: Regexes.startsUsing({ source: 'Alexander Prime', id: '486E', capture: false }),
      regexCn: Regexes.startsUsing({ source: '至尊亚历山大', id: '486E', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Prim-Alexander', id: '486E', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Primo-Alexander', id: '486E', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'アレキサンダー・プライム', id: '486E', capture: false }),
      regexKo: Regexes.startsUsing({ source: '알렉산더 프라임', id: '486E', capture: false }),
      run: function(data) {
        data.phase = 'wormhole';
        data.resetState();
      },
    },
    {
      id: 'TEA Fate Alpha Phase',
      regex: Regexes.startsUsing({ source: 'Perfect Alexander', id: '487B', capture: false }),
      regexCn: Regexes.startsUsing({ source: '完美亚历山大', id: '487B', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Perfekter Alexander', id: '487B', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Alexander parfait', id: '487B', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'パーフェクト・アレキサンダー', id: '487B', capture: false }),
      regexKo: Regexes.startsUsing({ source: '완전체 알렉산더', id: '487B', capture: false }),
      run: function(data) {
        data.phase = 'alpha';
        data.resetState();
      },
    },
    {
      id: 'TEA Fate Beta Phase',
      regex: Regexes.startsUsing({ source: 'Perfect Alexander', id: '4B13', capture: false }),
      regexCn: Regexes.startsUsing({ source: '完美亚历山大', id: '4B13', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Perfekter Alexander', id: '4B13', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Alexander parfait', id: '4B13', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'パーフェクト・アレキサンダー', id: '4B13', capture: false }),
      regexKo: Regexes.startsUsing({ source: '완전체 알렉산더', id: '4B13', capture: false }),
      run: function(data) {
        data.phase = 'beta';
        data.resetState();
      },
    },
    {
      id: 'TEA Liquid Tank',
      regex: Regexes.abilityFull({ source: 'Living Liquid', id: '4978' }),
      regexCn: Regexes.abilityFull({ source: '有生命活水', id: '4978' }),
      regexDe: Regexes.abilityFull({ source: 'belebtes Wasser', id: '4978' }),
      regexFr: Regexes.abilityFull({ source: 'liquide vivant', id: '4978' }),
      regexJa: Regexes.abilityFull({ source: 'リビングリキッド', id: '4978' }),
      regexKo: Regexes.abilityFull({ source: '살아있는 액체', id: '4978' }),
      run: function(data, matches) {
        data.liquidTank = matches.target;
      },
    },
    {
      id: 'TEA Hand Tank',
      regex: Regexes.abilityFull({ source: 'Liquid Hand', id: '4979' }),
      regexCn: Regexes.abilityFull({ source: '活水之手', id: '4979' }),
      regexDe: Regexes.abilityFull({ source: 'belebte Hand', id: '4979' }),
      regexFr: Regexes.abilityFull({ source: 'membre liquide', id: '4979' }),
      regexJa: Regexes.abilityFull({ source: 'リキッドハンド', id: '4979' }),
      regexKo: Regexes.abilityFull({ source: '액체 손', id: '4979' }),
      run: function(data, matches) {
        data.handTank = matches.target;
      },
    },
    {
      id: 'TEA Cruise Chaser Tank',
      regex: Regexes.abilityFull({ source: 'Cruise Chaser', id: '497A' }),
      regexCn: Regexes.abilityFull({ source: '巡航驱逐者', id: '497A' }),
      regexDe: Regexes.abilityFull({ source: 'Chaser-Mecha', id: '497A' }),
      regexFr: Regexes.abilityFull({ source: 'Croiseur-chasseur', id: '497A' }),
      regexJa: Regexes.abilityFull({ source: 'クルーズチェイサー', id: '497A' }),
      regexKo: Regexes.abilityFull({ source: '순항추격기', id: '497A' }),
      run: function(data, matches) {
        data.cruiseTank = matches.target;
      },
    },
    {
      id: 'TEA Brute Tank',
      regex: Regexes.abilityFull({ source: 'Brute Justice', id: '497B' }),
      regexCn: Regexes.abilityFull({ source: '残暴正义号', id: '497B' }),
      regexDe: Regexes.abilityFull({ source: 'Brutalus', id: '497B' }),
      regexFr: Regexes.abilityFull({ source: 'Justicier', id: '497B' }),
      regexJa: Regexes.abilityFull({ source: 'ブルートジャスティス', id: '497B' }),
      regexKo: Regexes.abilityFull({ source: '포악한 심판자', id: '497B' }),
      run: function(data, matches) {
        data.bruteTank = matches.target;
      },
    },
    {
      id: 'TEA Cascade',
      regex: Regexes.startsUsing({ source: 'Living Liquid', id: '4826', capture: false }),
      regexCn: Regexes.startsUsing({ source: '有生命活水', id: '4826', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'belebtes Wasser', id: '4826', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'liquide vivant', id: '4826', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'リビングリキッド', id: '4826', capture: false }),
      regexKo: Regexes.startsUsing({ source: '살아있는 액체', id: '4826', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'TEA Protean Wave',
      regex: Regexes.startsUsing({ source: 'Living Liquid', id: '4822', capture: false }),
      regexCn: Regexes.startsUsing({ source: '有生命活水', id: '4822', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'belebtes Wasser', id: '4822', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'liquide vivant', id: '4822', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'リビングリキッド', id: '4822', capture: false }),
      regexKo: Regexes.startsUsing({ source: '살아있는 액체', id: '4822', capture: false }),
      infoText: {
        en: 'Protean Wave',
        de: 'Proteische Welle',
        ja: 'プロティアン',
        ko: '변화의 물결',
        cn: '万变水波',
      },
    },
    {
      id: 'TEA Drainage Tether',
      regex: Regexes.tether({ source: 'Liquid Rage', id: '0003' }),
      regexCn: Regexes.tether({ source: '活水之怒', id: '0003' }),
      regexDe: Regexes.tether({ source: 'levitierte Rage', id: '0003' }),
      regexFr: Regexes.tether({ source: 'furie liquide', id: '0003' }),
      regexJa: Regexes.tether({ source: 'リキッドレイジ', id: '0003' }),
      regexKo: Regexes.tether({ source: '분노한 액체', id: '0003' }),
      condition: Conditions.targetIsYou(),
      // Even if folks have the right tethers, this happens repeatedly.
      suppressSeconds: 5,
      alertText: {
        en: 'Drainage tether on YOU',
        ja: '自分にドレナージ',
        de: 'Entwässerungsverbindung auf DIR',
        ko: '나에게 물줄기',
        cn: '连线点名',
      },
    },
    {
      id: 'TEA Hand of Pain 5',
      regex: Regexes.startsUsing({ source: 'Liquid Hand', id: '482D', capture: false }),
      regexCn: Regexes.startsUsing({ source: '活水之手', id: '482D', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'belebte Hand', id: '482D', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'membre liquide', id: '482D', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'リキッドハンド', id: '482D', capture: false }),
      regexKo: Regexes.startsUsing({ source: '액체 손', id: '482D', capture: false }),
      preRun: function(data) {
        data.handOfPainCount = (data.handOfPainCount || 0) + 1;
      },
      infoText: function(data) {
        if (data.handOfPainCount == 5) {
          return {
            en: 'Focus Living Liquid',
            de: 'belebtes Wasser fokussieren',
            ja: 'リビングリキッドを攻撃',
            ko: '인간형 집중 공격',
            cn: '攻击水基佬',
          };
        }
      },
    },
    {
      id: 'TEA Throttle',
      regex: Regexes.gainsEffect({ effect: 'Throttle', capture: false }),
      regexCn: Regexes.gainsEffect({ effect: '窒息', capture: false }),
      regexDe: Regexes.gainsEffect({ effect: 'Erstickung', capture: false }),
      regexFr: Regexes.gainsEffect({ effect: 'Suffocation', capture: false }),
      regexJa: Regexes.gainsEffect({ effect: '窒息', capture: false }),
      regexKo: Regexes.gainsEffect({ effect: '질식', capture: false }),
      condition: function(data) {
        return data.CanCleanse();
      },
      suppressSeconds: 1,
      infoText: {
        en: 'Cleanse Throttle',
        de: 'Erstickung entfernen',
        ja: '窒息',
        ko: '질식',
        cn: '窒息',
      },
    },
    {
      // Applies to both limit cuts.
      id: 'TEA Limit Cut Numbers',
      regex: Regexes.headMarker({ }),
      condition: function(data, matches) {
        // Here and elsewhere, it's probably best to check for whether the user is the target first,
        // as that should short-circuit more often.
        return data.me == matches.target && (/00(?:4F|5[0-6])/).test(getHeadmarkerId(data, matches));
      },
      preRun: function(data, matches) {
        let correctedMatch = getHeadmarkerId(data, matches);
        data.limitCutNumber = {
          '004F': 1,
          '0050': 2,
          '0051': 3,
          '0052': 4,
          '0053': 5,
          '0054': 6,
          '0055': 7,
          '0056': 8,
        }[correctedMatch];
        if (data.phase == 'wormhole') {
          data.limitCutDelay = {
            '004F': 9.2,
            '0050': 10.7,
            '0051': 13.4,
            '0052': 15.0,
            '0053': 17.7,
            '0054': 19.2,
            '0055': 22.0,
            '0056': 23.4,
          }[correctedMatch];
        } else {
          data.limitCutDelay = {
            '004F': 9.5,
            '0050': 11,
            '0051': 14.1,
            '0052': 15.5,
            '0053': 18.6,
            '0054': 20,
            '0055': 23.2,
            '0056': 24.6,
          }[correctedMatch];
        }
      },
      durationSeconds: function(data) {
        // Because people are very forgetful,
        // show the number until you are done.
        return data.limitCutDelay;
      },
      alertText: function(data) {
        return {
          en: '#' + data.limitCutNumber,
          de: '#' + data.limitCutNumber,
          ja: data.limitCutNumber + '番',
          fr: '#' + data.limitCutNumber,
          ko: data.limitCutNumber + '번째',
          cn: '#' + data.limitCutNumber,
        };
      },
    },
    {
      // Applies to both limit cuts.
      id: 'TEA Limit Cut Knockback',
      regex: Regexes.headMarker({ }),
      condition: function(data, matches) {
        return data.me == matches.target && (/00(?:4F|5[0-6])/).test(getHeadmarkerId(data, matches));
      },
      // This gives a warning within 5 seconds, so you can hit arm's length.
      delaySeconds: function(data) {
        return data.limitCutDelay - 5;
      },
      alertText: function(data, matches) {
        let isOddNumber = parseInt(getHeadmarkerId(data, matches), 16) & 1 == 1;
        if (data.phase == 'wormhole') {
          if (isOddNumber) {
            return {
              en: 'Knockback Cleave; Face Outside',
              de: 'Rückstoß Cleave; nach Außen schauen',
              ja: 'ノックバック ソード; 外向く',
              fr: 'Poussée Cleave; Regarde à l\'extérieur',
              ko: '넉백 소드; 바깥쪽 바라보기',
              cn: '击退顺劈; 面向外侧',
            };
          }
          return {
            en: 'Knockback Charge; Face Middle',
            de: 'Rückstoß Charge; zur Mitte schauen',
            ja: 'ノックバック チャージ; 中央向く',
            fr: 'Poussée Charge; Regarde à l\'intérieur',
            ko: '넉백 차지; 안쪽 바라보기',
            cn: '击退冲锋; 面向中间',
          };
        }
        if (isOddNumber) {
          return {
            en: 'Knockback Cleave on YOU',
            de: 'Rückstoß Cleave auf DIR',
            fr: 'Cleave sur VOUS',
            ja: '自分にクリーブ',
            ko: '나에게 넉백 공격',
            cn: '击退顺劈点名',
          };
        }
        return {
          en: 'Knockback',
          de: 'Rückstoß',
          fr: 'Poussée',
          cn: '击退',
          ja: 'ノックバック',
          ko: '넉백',
        };
      },
    },
    {
      id: 'TEA Chakrams Out',
      // Link Up
      regex: Regexes.ability({ source: 'Brute Justice', id: '483F', capture: false }),
      regexCn: Regexes.ability({ source: '残暴正义号', id: '483F', capture: false }),
      regexDe: Regexes.ability({ source: 'Brutalus', id: '483F', capture: false }),
      regexFr: Regexes.ability({ source: 'Justicier', id: '483F', capture: false }),
      regexJa: Regexes.ability({ source: 'ブルートジャスティス', id: '483F', capture: false }),
      regexKo: Regexes.ability({ source: '포악한 심판자', id: '483F', capture: false }),
      condition: function(data) {
        return data.phase == 'brute';
      },
      alertText: {
        en: 'Out, Dodge Chakrams',
        de: 'Raus, Chakrams ausweichen',
        ja: '外へ',
        fr: 'Dehors, évite les Chakrams',
        ko: '바깥으로 차크람 피하기',
        cn: '远离，躲避轮轮',
      },
    },
    {
      id: 'TEA Chakrams In',
      // Optical Sight
      regex: Regexes.ability({ source: 'Cruise Chaser', id: '482F', capture: false }),
      regexCn: Regexes.ability({ source: '巡航驱逐者', id: '482F', capture: false }),
      regexDe: Regexes.ability({ source: 'Chaser-Mecha', id: '482F', capture: false }),
      regexFr: Regexes.ability({ source: 'Croiseur-chasseur', id: '482F', capture: false }),
      regexJa: Regexes.ability({ source: 'クルーズチェイサー', id: '482F', capture: false }),
      regexKo: Regexes.ability({ source: '순항추격기', id: '482F', capture: false }),
      suppressSeconds: 1,
      alertText: {
        en: 'Run In',
        de: 'Rein',
        ja: '中へ',
        ko: '가운데로',
        cn: '靠近',
      },
    },
    {
      id: 'TEA Whirlwind',
      regex: Regexes.startsUsing({ source: 'Cruise Chaser', id: '49C2', capture: false }),
      regexCn: Regexes.startsUsing({ source: '巡航驱逐者', id: '49C2', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Chaser-Mecha', id: '49C2', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Croiseur-chasseur', id: '49C2', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'クルーズチェイサー', id: '49C2', capture: false }),
      regexKo: Regexes.startsUsing({ source: '순항추격기', id: '49C2', capture: false }),
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      response: Responses.aoe(),
    },
    {
      id: 'TEA Spin Crusher',
      regex: Regexes.startsUsing({ source: 'Cruise Chaser', id: '4A72', capture: false }),
      regexCn: Regexes.startsUsing({ source: '巡航驱逐者', id: '4A72', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Chaser-Mecha', id: '4A72', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Croiseur-chasseur', id: '4A72', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'クルーズチェイサー', id: '4A72', capture: false }),
      regexKo: Regexes.startsUsing({ source: '순항추격기', id: '4A72', capture: false }),
      // Nobody should be in front of cruise chaser but the tank, and this is close to
      // water thunder handling, so only tell the tank.
      condition: function(data) {
        return data.me == data.cruiseTank;
      },
      alertText: {
        en: 'Dodge Spin Crusher',
        de: 'Rotorbrecher ausweichen',
        ja: 'スピンクラッシャー避けて',
        ko: '회전 분쇄 피하기',
        cn: '躲避回旋碎踢',
      },
    },
    {
      id: 'TEA Ice Marker',
      regex: Regexes.headMarker({ }),
      condition: function(data, matches) {
        return data.me == matches.target && getHeadmarkerId(data, matches) == '0043';
      },
      alarmText: {
        en: 'Freeze Tornado',
        de: 'Tornado einfrieren',
        ja: '竜巻凍らせる',
        fr: 'Gèle la tornade',
        ko: '물 회오리 얼리기',
        cn: '冰冻龙卷风',
      },
    },
    {
      id: 'TEA Hidden Minefield',
      regex: Regexes.ability({ source: 'Brute Justice', id: '4851', capture: false }),
      regexCn: Regexes.ability({ source: '残暴正义号', id: '4851', capture: false }),
      regexDe: Regexes.ability({ source: 'Brutalus', id: '4851', capture: false }),
      regexFr: Regexes.ability({ source: 'Justicier', id: '4851', capture: false }),
      regexJa: Regexes.ability({ source: 'ブルートジャスティス', id: '4851', capture: false }),
      regexKo: Regexes.ability({ source: '포악한 심판자', id: '4851', capture: false }),
      condition: function(data) {
        return data.role == 'tank';
      },
      suppressSeconds: 1,
      infoText: {
        en: 'Mines',
        de: 'Minen',
        ja: '地雷',
        fr: 'Mines',
        ko: '지뢰',
        cn: '地雷',
      },
    },
    {
      id: 'TEA Enumeration YOU',
      regex: Regexes.headMarker({ }),
      condition: function(data, matches) {
        return data.me == matches.target && getHeadmarkerId(data, matches) == '0041';
      },
      alertText: {
        en: 'Enumeration on YOU',
        de: 'Enumeration auf DIR',
        ja: '自分にカウント',
        fr: 'Enumeration sur VOUS',
        ko: '나에게 인원수',
        cn: '计数点名',
      },
    },
    {
      id: 'TEA Enumeration Everyone',
      regex: Regexes.headMarker({ }),
      condition: function(data, matches) {
        return getHeadmarkerId(data, matches) == '0041';
      },
      preRun: function(data, matches) {
        data.enumerations = data.enumerations || [];
        data.enumerations.push(matches.target);
      },
      infoText: function(data) {
        if (data.enumerations.length != 2)
          return;
        let names = data.enumerations.sort();
        return {
          en: 'Enumeration: ' + names.map((x) => data.ShortName(x)).join(', '),
          de: 'Enumeration: ' + names.map((x) => data.ShortName(x)).join(', '),
          ja: 'カウント: ' + names.map((x) => data.ShortName(x)).join(', '),
          fr: 'Enumeration: ' + names.map((x) => data.ShortName(x)).join(', '),
          ko: '인원수 대상: ' + names.map((x) => data.ShortName(x)).join(', '),
          cn: '计数' + names.map((x) => data.ShortName(x)).join(', '),
        };
      },
    },
    {
      id: 'TEA Limit Cut Shield',
      regex: Regexes.ability({ source: 'Cruise Chaser', id: '4833', capture: false }),
      regexCn: Regexes.ability({ source: '巡航驱逐者', id: '4833', capture: false }),
      regexDe: Regexes.ability({ source: 'Chaser-Mecha', id: '4833', capture: false }),
      regexFr: Regexes.ability({ source: 'Croiseur-chasseur', id: '4833', capture: false }),
      regexJa: Regexes.ability({ source: 'クルーズチェイサー', id: '4833', capture: false }),
      regexKo: Regexes.ability({ source: '순항추격기', id: '4833', capture: false }),
      delaySeconds: 2,
      infoText: {
        en: 'Break Shield From Front',
        de: 'Schild von Vorne zerstören',
        ja: '正面からシールド壊して',
        fr: 'Détruis le bouclier en face',
        ko: '정면에서 실드를 부수기',
        cn: '从前面击破盾牌',
      },
    },
    {
      id: 'TEA Compressed Water Initial',
      regex: Regexes.gainsEffect({ effect: 'Compressed Water' }),
      regexCn: Regexes.gainsEffect({ effect: '水属性压缩' }),
      regexDe: Regexes.gainsEffect({ effect: 'Wasserkompression' }),
      regexFr: Regexes.gainsEffect({ effect: 'Compression aqueuse' }),
      regexJa: Regexes.gainsEffect({ effect: '水属性圧縮' }),
      regexKo: Regexes.gainsEffect({ effect: '물속성 압축' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Water on YOU',
        de: 'Wasser auf DIR',
        ja: '自分に水',
        fr: 'Eau sur VOUS',
        ko: '나에게 물',
        cn: '水点名',
      },
    },
    {
      id: 'TEA Compressed Water Explode',
      regex: Regexes.gainsEffect({ effect: 'Compressed Water' }),
      regexCn: Regexes.gainsEffect({ effect: '水属性压缩' }),
      regexDe: Regexes.gainsEffect({ effect: 'Wasserkompression' }),
      regexFr: Regexes.gainsEffect({ effect: 'Compression aqueuse' }),
      regexJa: Regexes.gainsEffect({ effect: '水属性圧縮' }),
      regexKo: Regexes.gainsEffect({ effect: '물속성 압축' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      delaySeconds: function(data, matches) {
        // 5 second warning.
        return parseFloat(matches.duration) - 5;
      },
      alertText: function(data) {
        if (data.seenGavel)
          return;
        return {
          en: 'Drop Water Soon',
          de: 'Gleich Wasser ablegen',
          ja: '水来るよ',
          fr: 'Dépose l\'eau bientôt',
          ko: '물이 곧 옵니다',
          cn: '马上放水',
        };
      },
    },
    {
      id: 'TEA Compressed Lightning Initial',
      regex: Regexes.gainsEffect({ effect: 'Compressed Lightning' }),
      regexCn: Regexes.gainsEffect({ effect: '雷属性压缩' }),
      regexDe: Regexes.gainsEffect({ effect: 'Blitzkompression' }),
      regexFr: Regexes.gainsEffect({ effect: 'Compression électrique' }),
      regexJa: Regexes.gainsEffect({ effect: '雷属性圧縮' }),
      regexKo: Regexes.gainsEffect({ effect: '번개속성 압축' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Lightning on YOU',
        de: 'Blitz auf DIR',
        ja: '自分に雷',
        fr: 'Foudre sur VOUS',
        ko: '나에게 번개',
        cn: '雷点名',
      },
    },
    {
      id: 'TEA Compressed Lightning Explode',
      regex: Regexes.gainsEffect({ effect: 'Compressed Lightning' }),
      regexCn: Regexes.gainsEffect({ effect: '雷属性压缩' }),
      regexDe: Regexes.gainsEffect({ effect: 'Blitzkompression' }),
      regexFr: Regexes.gainsEffect({ effect: 'Compression électrique' }),
      regexJa: Regexes.gainsEffect({ effect: '雷属性圧縮' }),
      regexKo: Regexes.gainsEffect({ effect: '번개속성 압축' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      delaySeconds: function(data, matches) {
        // 5 second warning.
        return parseFloat(matches.duration) - 5;
      },
      alertText: function(data) {
        if (data.seenGavel)
          return;
        return {
          en: 'Drop Lightning Soon',
          de: 'Gleich Blitz ablegen',
          ja: '雷来るよ',
          fr: 'Passe la foudre bientôt',
          ko: '번개가 곧 옵니다',
          cn: '马上放雷',
        };
      },
    },
    {
      id: 'TEA Pass Nisi 1',
      // 4 seconds after Photon cast starts.
      regex: Regexes.startsUsing({ source: 'Cruise Chaser', id: '4836', capture: false }),
      regexCn: Regexes.startsUsing({ source: '巡航驱逐者', id: '4836', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Chaser-Mecha', id: '4836', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Croiseur-chasseur', id: '4836', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'クルーズチェイサー', id: '4836', capture: false }),
      regexKo: Regexes.startsUsing({ source: '순항추격기', id: '4836', capture: false }),
      delaySeconds: 4,
      suppressSeconds: 10000,
      alertText: {
        en: 'Pass Nisi',
        de: 'Nisi weitergeben',
        ja: 'ナイサイ渡して',
        fr: 'Passe Nisi',
        ko: '나이사이 건네기',
        cn: '传递审判',
      },
    },
    {
      id: 'TEA Pass Nisi 2',
      // 1 second after enumeration.
      // TODO: find a startsUsing instead of matching an action.
      regex: Regexes.ability({ source: 'Brute Justice', id: '4850', capture: false }),
      regexCn: Regexes.ability({ source: '残暴正义号', id: '4850', capture: false }),
      regexDe: Regexes.ability({ source: 'Brutalus', id: '4850', capture: false }),
      regexFr: Regexes.ability({ source: 'Justicier', id: '4850', capture: false }),
      regexJa: Regexes.ability({ source: 'ブルートジャスティス', id: '4850', capture: false }),
      regexKo: Regexes.ability({ source: '포악한 심판자', id: '4850', capture: false }),
      // Ignore enumerations later in the fight.
      condition: (data) => data.phase == 'brute',
      delaySeconds: 1,
      suppressSeconds: 1,
      alertText: {
        en: 'Pass Nisi',
        de: 'Nisi weitergeben',
        ja: 'ナイサイ渡して',
        fr: 'Passe Nisi',
        ko: '나이사이 건네기',
        cn: '传递审判',
      },
    },
    {
      id: 'TEA Pass Nisi 3',
      // 8 seconds after Flarethrower cast starts.
      regex: Regexes.startsUsing({ source: 'Brute Justice', id: '4845', capture: false }),
      regexCn: Regexes.startsUsing({ source: '残暴正义号', id: '4845', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Brutalus', id: '4845', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Justicier', id: '4845', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ブルートジャスティス', id: '4845', capture: false }),
      regexKo: Regexes.startsUsing({ source: '포악한 심판자', id: '4845', capture: false }),
      delaySeconds: 8,
      durationSeconds: 9,
      alertText: function(data) {
        return data.namedNisiPass(data);
      },
    },
    {
      id: 'TEA Decree Nisi Gain',
      regex: Regexes.gainsEffect({ effect: 'Final Decree Nisi (?<sym>[ΑΒΓΔαβγδ])' }),
      regexCn: Regexes.gainsEffect({ effect: '最终判决(?<sym>[ΑΒΓΔαβγδ])' }),
      regexDe: Regexes.gainsEffect({ effect: 'Letztes Vorläufiges Urteil (?<sym>[ΑΒΓΔαβγδ])' }),
      regexFr: Regexes.gainsEffect({ effect: 'Peine provisoire (?<sym>[ΑΒΓΔαβγδ]) ultime' }),
      regexJa: Regexes.gainsEffect({ effect: '最後の仮判決(?<sym>[ΑΒΓΔαβγδ])' }),
      regexKo: Regexes.gainsEffect({ effect: '최후의 임시 판결 (?<sym>[ΑΒΓΔαβγδ])' }),
      run: function(data, matches) {
        let num = 'ΑΒΓΔαβγδ'.indexOf(matches.sym) % 4;
        data.nisiMap = data.nisiMap || {};
        data.nisiMap[matches.target] = num;
      },
    },
    {
      id: 'TEA Decree Nisi Lose',
      regex: Regexes.losesEffect({ effect: 'Final Decree Nisi (?<sym>[ΑΒΓΔαβγδ])' }),
      regexCn: Regexes.losesEffect({ effect: '最终判决(?<sym>[ΑΒΓΔαβγδ])' }),
      regexDe: Regexes.losesEffect({ effect: 'Letztes Vorläufiges Urteil (?<sym>[ΑΒΓΔαβγδ])' }),
      regexFr: Regexes.losesEffect({ effect: 'Peine provisoire (?<sym>[ΑΒΓΔαβγδ]) ultime' }),
      regexJa: Regexes.losesEffect({ effect: '最後の仮判決(?<sym>[ΑΒΓΔαβγδ])' }),
      regexKo: Regexes.losesEffect({ effect: '최후의 임시 판결 (?<sym>[ΑΒΓΔαβγδ])' }),
      run: function(data, matches) {
        data.nisiMap = data.nisiMap || {};
        delete data.nisiMap[matches.target];
      },
    },
    {
      id: 'TEA Final Judgment Nisi Gain',
      regex: Regexes.gainsEffect({ effect: 'Final Judgment: Decree Nisi (?<sym>[ΑΒΓΔαβγδ])' }),
      regexCn: Regexes.gainsEffect({ effect: '终审：判决(?<sym>[ΑΒΓΔαβγδ])' }),
      regexDe: Regexes.gainsEffect({ effect: 'Prozess über Vorläufiges Urteil (?<sym>[ΑΒΓΔαβγδ])' }),
      regexFr: Regexes.gainsEffect({ effect: 'Injonction : peine provisoire (?<sym>[ΑΒΓΔαβγδ])' }),
      regexJa: Regexes.gainsEffect({ effect: '最後の審判：仮判決(?<sym>[ΑΒΓΔαβγδ])' }),
      regexKo: Regexes.gainsEffect({ effect: '최후의 심판: 임시 판결 (?<sym>[ΑΒΓΔαβγδ])' }),
      run: function(data, matches) {
        let num = 'ΑΒΓΔαβγδ'.indexOf(matches.sym) % 4;
        data.finalNisiMap = data.finalNisiMap || {};
        data.finalNisiMap[matches.target] = num;
      },
    },
    {
      id: 'TEA Final Judgment Nisi Verdict',
      regex: Regexes.gainsEffect({ effect: 'Final Judgment: Decree Nisi (?<sym>[ΑΒΓΔαβγδ])' }),
      regexCn: Regexes.gainsEffect({ effect: '终审：判决(?<sym>[ΑΒΓΔαβγδ])' }),
      regexDe: Regexes.gainsEffect({ effect: 'Prozess über Vorläufiges Urteil (?<sym>[ΑΒΓΔαβγδ])' }),
      regexFr: Regexes.gainsEffect({ effect: 'Injonction : peine provisoire (?<sym>[ΑΒΓΔαβγδ])' }),
      regexJa: Regexes.gainsEffect({ effect: '最後の審判：仮判決(?<sym>[ΑΒΓΔαβγδ])' }),
      regexKo: Regexes.gainsEffect({ effect: '최후의 심판: 임시 판결 (?<sym>[ΑΒΓΔαβγδ])' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      // This keeps refreshing forever, so only alert once.
      suppressSeconds: 10000,
      infoText: function(data, matches) {
        // NOTE: these characters are not 'A' and 'B'.
        let num = 'ΑΒΓΔαβγδ'.indexOf(matches.sym) % 4;
        return {
          en: 'Verdict: ' + data.nisiNames[num] + ' Nisi',
          de: 'Prozesseröffnung: ' + data.nisiNames[num] + ' Nisi',
          ja: '最終: ' + data.nisiNames[num],
          fr: 'Verdict: ' + data.nisiNames[num] + ' Nisi',
          ko: '최종: ' + data.nisiNames[num],
          cn: '最终: ' + data.nisiNames[num],
        };
      },
    },
    {
      id: 'TEA Gavel',
      regex: Regexes.startsUsing({ source: 'Brute Justice', id: '483C', capture: false }),
      regexCn: Regexes.startsUsing({ source: '残暴正义号', id: '483C', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Brutalus', id: '483C', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Justicier', id: '483C', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ブルートジャスティス', id: '483C', capture: false }),
      regexKo: Regexes.startsUsing({ source: '포악한 심판자', id: '483C', capture: false }),
      run: function(data) {
        data.seenGavel = true;
      },
    },
    {
      id: 'TEA Double Rocket Punch',
      regex: Regexes.startsUsing({ source: 'Brute Justice', id: '4847' }),
      regexCn: Regexes.startsUsing({ source: '残暴正义号', id: '4847' }),
      regexDe: Regexes.startsUsing({ source: 'Brutalus', id: '4847' }),
      regexFr: Regexes.startsUsing({ source: 'Justicier', id: '4847' }),
      regexJa: Regexes.startsUsing({ source: 'ブルートジャスティス', id: '4847' }),
      regexKo: Regexes.startsUsing({ source: '포악한 심판자', id: '4847' }),
      alertText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Shared Tankbuster on YOU',
            de: 'geteilter Tankbuster auf DIR',
            ja: '自分にタンクシェア',
            fr: 'Tankbuster partagé sur vous',
            ko: '나에게 쉐어 탱크버스터',
            cn: '分摊死刑点名',
          };
        }
        if (data.role == 'tank' || data.role == 'healer') {
          return {
            en: 'Shared Tankbuster on ' + data.ShortName(matches.target),
            de: 'geteilter Tankbuster on ' + data.ShortName(matches.target),
            ja: data.ShortName(matches.target) + ' にタンクシェア',
            fr: 'Tankbuster partagé sur ' + data.ShortName(matches.target),
            ko: '쉐어 탱크버스터 대상: ' + data.ShortName(matches.target),
            cn: '分摊死刑点 ' + data.ShortName(matches.target),
          };
        }
      },
      infoText: function(data) {
        if (data.role == 'tank' || data.role == 'healer')
          return;
        return {
          en: 'Bait Super Jump?',
          de: 'Supersprung anlocken?',
          ja: 'スパジャン誘導',
          ko: '슈퍼 점프 유도',
          cn: '引导超级跳跃',
        };
      },
    },
    {
      id: 'TEA Brute Ray',
      regex: Regexes.ability({ source: 'Brute Justice', id: '484A', capture: false }),
      regexCn: Regexes.ability({ source: '残暴正义号', id: '484A', capture: false }),
      regexDe: Regexes.ability({ source: 'Brutalus', id: '484A', capture: false }),
      regexFr: Regexes.ability({ source: 'Justicier', id: '484A', capture: false }),
      regexJa: Regexes.ability({ source: 'ブルートジャスティス', id: '484A', capture: false }),
      regexKo: Regexes.ability({ source: '포악한 심판자', id: '484A', capture: false }),
      condition: (data) => data.phase == 'brute',
      infoText: {
        en: 'avoid ray',
        de: 'Strahl ausweichen',
        ja: 'アポカリ避けて',
        fr: 'Evitez le rayon',
        ko: '파멸 계시 피하기',
        cn: '躲避激光',
      },
    },
    {
      id: 'TEA Buff Collection',
      regex: Regexes.gainsEffect({ effect: ['Restraining Order', 'House Arrest', 'Aggravated Assault', 'Shared Sentence'] }),
      regexCn: Regexes.gainsEffect({ effect: ['判决确定：禁止接近命令', '判决确定：强制接近命令', '判决确定：加重罪', '判决确定：集团罪'] }),
      regexDe: Regexes.gainsEffect({ effect: ['Urteil: Näherungsverbot', 'Urteil: Freiheitsstrafe', 'Urteil: Erschwerte Strafe', 'Urteil: Kollektivstrafe'] }),
      regexFr: Regexes.gainsEffect({ effect: ['Jugement : éloignement', 'Jugement : Rapprochement', 'Jugement : Peine Sévère', 'Jugement : Peine Collective'] }),
      regexJa: Regexes.gainsEffect({ effect: ['確定判決：接近禁止命令', '確定判決：接近強制命令', '確定判決：加重罰', '確定判決：集団罰'] }),
      regexKo: Regexes.gainsEffect({ effect: ['확정 판결: 접근금지 명령', '확정 판결: 강제접근 명령', '확정 판결: 가중형', '확정 판결: 단체형'] }),
      run: function(data, matches) {
        data.buffMap = data.buffMap || {};
        data.buffMap[matches.target] = matches.effect;
      },
    },
    {
      id: 'TEA Temporal Stasis No Buff',
      regex: Regexes.gainsEffect({ effect: 'Restraining Order', capture: false }),
      regexCn: Regexes.gainsEffect({ effect: '判决确定：禁止接近命令', capture: false }),
      regexDe: Regexes.gainsEffect({ effect: 'Urteil: Näherungsverbot', capture: false }),
      regexFr: Regexes.gainsEffect({ effect: 'Jugement : éloignement', capture: false }),
      regexJa: Regexes.gainsEffect({ effect: '確定判決：接近禁止命令', capture: false }),
      regexKo: Regexes.gainsEffect({ effect: '확정 판결: 접근금지 명령', capture: false }),
      condition: function(data) {
        // NOTE: due to timings the "temporal" phase does not start until after debuffs are out.
        // So consider the "temporal" no debuff to be "brute" no debuff here.
        return data.phase == 'brute' || data.phase == 'inception';
      },
      delaySeconds: 0.5,
      durationSeconds: 10,
      suppressSeconds: 1,
      infoText: function(data) {
        if (data.me in data.buffMap)
          return;
        return {
          en: 'No Debuff',
          de: 'Kein Debuff',
          ja: 'デバフ無し',
          ko: '디버프 없음',
          cn: '无 Debuff',
        };
      },
    },
    {
      id: 'TEA Restraining Order',
      regex: Regexes.gainsEffect({ effect: 'Restraining Order' }),
      regexCn: Regexes.gainsEffect({ effect: '判决确定：禁止接近命令' }),
      regexDe: Regexes.gainsEffect({ effect: 'Urteil: Näherungsverbot' }),
      regexFr: Regexes.gainsEffect({ effect: 'Jugement : éloignement' }),
      regexJa: Regexes.gainsEffect({ effect: '確定判決：接近禁止命令' }),
      regexKo: Regexes.gainsEffect({ effect: '확정 판결: 접근금지 명령' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      durationSeconds: 10,
      alertText: {
        en: 'Far Tethers',
        de: 'Entfernte Verbindungen',
        fr: 'Liens éloignés',
        ja: 'ファー',
        cn: '远离连线',
        ko: '접근금지: 상대와 떨어지기',
      },
    },
    {
      id: 'TEA House Arrest',
      regex: Regexes.gainsEffect({ effect: 'House Arrest' }),
      regexCn: Regexes.gainsEffect({ effect: '判决确定：强制接近命令' }),
      regexDe: Regexes.gainsEffect({ effect: 'Urteil: Freiheitsstrafe' }),
      regexFr: Regexes.gainsEffect({ effect: 'Jugement : Rapprochement' }),
      regexJa: Regexes.gainsEffect({ effect: '確定判決：接近強制命令' }),
      regexKo: Regexes.gainsEffect({ effect: '확정 판결: 강제접근 명령' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      durationSeconds: 10,
      alertText: {
        en: 'Close Tethers',
        de: 'Nahe Verbindungen',
        fr: 'Liens proches',
        ja: 'ニアー',
        cn: '靠近连线',
        ko: '강제접근: 상대와 가까이 붙기',
      },
    },
    {
      id: 'TEA Shared Sentence',
      regex: Regexes.gainsEffect({ effect: 'Shared Sentence' }),
      regexCn: Regexes.gainsEffect({ effect: '判决确定：集团罪' }),
      regexDe: Regexes.gainsEffect({ effect: 'Urteil: Kollektivstrafe' }),
      regexFr: Regexes.gainsEffect({ effect: 'Jugement : Peine Collective' }),
      regexJa: Regexes.gainsEffect({ effect: '確定判決：集団罰' }),
      regexKo: Regexes.gainsEffect({ effect: '확정 판결: 단체형' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      durationSeconds: 10,
      alertText: {
        en: 'Shared Sentence',
        de: 'Urteil: Kollektivstrafe',
        ja: '集団罰',
        fr: 'Peine collective',
        ko: '단체형: 무직과 함께 맞기',
        cn: '集团罪',
      },
    },
    {
      id: 'TEA Shared Sentence Inception',
      regex: Regexes.gainsEffect({ effect: 'Shared Sentence' }),
      regexCn: Regexes.gainsEffect({ effect: '判决确定：集团罪' }),
      regexDe: Regexes.gainsEffect({ effect: 'Urteil: Kollektivstrafe' }),
      regexFr: Regexes.gainsEffect({ effect: 'Jugement : Peine Collective' }),
      regexJa: Regexes.gainsEffect({ effect: '確定判決：集団罰' }),
      regexKo: Regexes.gainsEffect({ effect: '확정 판결: 단체형' }),
      condition: (data) => data.phase == 'inception',
      delaySeconds: 3,
      infoText: function(data, matches) {
        return {
          en: 'Shared Sentence on ' + data.ShortName(matches.target),
          de: 'Urteil: Kollektivstrafe auf ' + data.ShortName(matches.target),
          ja: data.ShortName(matches.target) + ' に集団罰',
          ko: data.ShortName(matches.target) + ' 에게 단체형',
          cn: '集团罪->' + data.ShortName(matches.target),
        };
      },
    },
    {
      id: 'TEA Aggravated Assault',
      regex: Regexes.gainsEffect({ effect: 'Aggravated Assault' }),
      regexCn: Regexes.gainsEffect({ effect: '判决确定：加重罪' }),
      regexDe: Regexes.gainsEffect({ effect: 'Urteil: Erschwerte Strafe' }),
      regexFr: Regexes.gainsEffect({ effect: 'Jugement : Peine Sévère' }),
      regexJa: Regexes.gainsEffect({ effect: '確定判決：加重罰' }),
      regexKo: Regexes.gainsEffect({ effect: '확정 판결: 가중형' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      durationSeconds: 10,
      alarmText: {
        en: 'Thunder',
        de: 'Blitz',
        ja: '加重罰',
        fr: 'Peine Sévère',
        ko: '가중형: 가중형끼리 모이기',
        cn: '加重罪',
      },
    },
    {
      id: 'TEA Chastening Heat',
      regex: Regexes.startsUsing({ source: 'Alexander Prime', id: '4A80' }),
      regexCn: Regexes.startsUsing({ source: '至尊亚历山大', id: '4A80' }),
      regexDe: Regexes.startsUsing({ source: 'Prim-Alexander', id: '4A80' }),
      regexFr: Regexes.startsUsing({ source: 'Primo-Alexander', id: '4A80' }),
      regexJa: Regexes.startsUsing({ source: 'アレキサンダー・プライム', id: '4A80' }),
      regexKo: Regexes.startsUsing({ source: '알렉산더 프라임', id: '4A80' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
            ja: '自分にタンクバスター',
            ko: '나에게 탱크버스터',
            cn: '死刑点名',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches.target),
            de: 'Tankbuster auf ' + data.ShortName(matches.target),
            fr: 'Tankbuster sur ' + data.ShortName(matches.target),
            ja: data.ShortName(matches.target) + 'にタンクバスター',
            ko: data.ShortName(matches.target) + '에게 탱크버스터',
            cn: '死刑点 ' + data.ShortName(matches.target),
          };
        }
      },
      // As this seems to usually seems to be invulned,
      // don't make a big deal out of it.
      infoText: function(data, matches) {
        if (matches.target == data.me)
          return;
        if (data.role != 'tank')
          return;

        return {
          en: 'Buster on ' + data.ShortName(matches.target),
          de: 'Tankbuster auf ' + data.ShortName(matches.target),
          fr: 'Tankbuster sur ' + data.ShortName(matches.target),
          ja: data.ShortName(matches.target) + 'にタンクバスター',
          ko: data.ShortName(matches.target) + '에게 탱크버스터',
          cn: '死刑点 ' + data.ShortName(matches.target),
        };
      },
    },
    {
      id: 'TEA Judgment Crystal',
      regex: Regexes.headMarker({ }),
      condition: function(data, matches) {
        return data.me == matches.target && getHeadmarkerId(data, matches) == '0060';
      },
      alertText: {
        en: 'Crystal on YOU',
        de: 'Kristall auf DIR',
        ja: '自分に結晶',
        fr: 'Cristal sur VOUS',
        ko: '나에게 결정체',
        cn: '结晶点名',
      },
    },
    {
      id: 'TEA Judgment Crystal Placement',
      regex: Regexes.ability({ source: 'Alexander Prime', id: '485C', capture: false }),
      regexCn: Regexes.ability({ source: '至尊亚历山大', id: '485C', capture: false }),
      regexDe: Regexes.ability({ source: 'Prim-Alexander', id: '485C', capture: false }),
      regexFr: Regexes.ability({ source: 'Primo-Alexander', id: '485C', capture: false }),
      regexJa: Regexes.ability({ source: 'アレキサンダー・プライム', id: '485C', capture: false }),
      regexKo: Regexes.ability({ source: '알렉산더 프라임', id: '485C', capture: false }),
      suppressSeconds: 100,
      infoText: {
        en: 'Get Away From Crystals',
        de: 'Geh weg vom Kristall',
        ja: '結晶から離れ',
        fr: 'Eloignez-vous des Cristaux',
        ko: '결정체로부터 멀어질 것',
        cn: '远离结晶',
      },
    },
    {
      id: 'TEA Terashatter Flarethrower',
      regex: Regexes.ability({ source: 'Judgment Crystal', id: '4A88', capture: false }),
      regexCn: Regexes.ability({ source: '审判结晶', id: '4A88', capture: false }),
      regexDe: Regexes.ability({ source: 'Urteilskristall', id: '4A88', capture: false }),
      regexFr: Regexes.ability({ source: 'Cristal du jugement', id: '4A88', capture: false }),
      regexJa: Regexes.ability({ source: '審判の結晶', id: '4A88', capture: false }),
      regexKo: Regexes.ability({ source: '심판의 결정체', id: '4A88', capture: false }),
      delaySeconds: 1,
      suppressSeconds: 100,
      infoText: {
        en: 'Bait Brute\'s Flarethrower',
        de: 'Locke Brute\'s Großflammenwerfer',
        ja: '火炎放射を誘導',
        ko: '화염 방사 유도',
        cn: '引导火炎放射',
      },
    },
    {
      id: 'TEA Inception Vuln Collection',
      regex: Regexes.gainsEffect({ effect: 'Physical Vulnerability Up' }),
      regexCn: Regexes.gainsEffect({ effect: '物理受伤加重' }),
      regexDe: Regexes.gainsEffect({ effect: 'Erhöhte Physische Verwundbarkeit' }),
      regexFr: Regexes.gainsEffect({ effect: 'Vulnérabilité physique augmentée' }),
      regexJa: Regexes.gainsEffect({ effect: '被物理ダメージ増加' }),
      regexKo: Regexes.gainsEffect({ effect: '받는 물리 피해량 증가' }),
      condition: (data) => data.phase == 'inception',
      run: function(data, matches) {
        data.vuln[matches.target] = true;
      },
    },
    {
      id: 'TEA Inception Alpha Sword',
      // Sacrament cast.
      regex: Regexes.ability({ source: 'Alexander Prime', id: '485F', capture: false }),
      regexCn: Regexes.ability({ source: '至尊亚历山大', id: '485F', capture: false }),
      regexDe: Regexes.ability({ source: 'Prim-Alexander', id: '485F', capture: false }),
      regexFr: Regexes.ability({ source: 'Primo-Alexander', id: '485F', capture: false }),
      regexJa: Regexes.ability({ source: 'アレキサンダー・プライム', id: '485F', capture: false }),
      regexKo: Regexes.ability({ source: '알렉산더 프라임', id: '485F', capture: false }),
      condition: (data) => data.phase == 'inception',
      alarmText: function(data) {
        let numVulns = Object.keys(data.vuln).length;
        if (data.role == 'tank' && data.vuln[data.me] && numVulns >= 5) {
          // If you're stacking three people in the shared sentence,
          // then probably the tank wants to handle jump with cooldowns.
          // TODO: we could probably determine where this is.
          return {
            en: 'Bait Jump With Cooldowns',
            de: 'Köder Sprung mit Cooldowns',
            ja: 'スパジャン誘導',
            ko: '슈퍼 점프 유도',
            cn: '引导冷却跳跃',
          };
        }
      },
      alertText: function(data) {
        if (data.vuln[data.me])
          return;

        let numVulns = Object.keys(data.vuln).length;
        if (numVulns >= 5) {
          // In this case, jump was handled above for tanks.
          return {
            en: 'Bait Sword',
            de: 'Locke Chaser-Mecha Schwert',
            ja: 'ソード誘導',
            ko: '검 유도',
            cn: '引导剑',
          };
        }

        // Otherwise everybody without a vuln can do anything.
        return {
          en: 'Bait Sword or Jump?',
          de: 'Köder Schwert oder Sprung?',
          ja: 'ソードかジャンプ誘導?',
          ko: '검 또는 슈퍼 점프 유도?',
          cn: '引导剑或跳?',
        };
      },
      infoText: function(data) {
        if (data.vuln[data.me]) {
          // Tanks covered in the alarmText case above.
          let numVulns = Object.keys(data.vuln).length;
          if (data.role == 'tank' && numVulns >= 5)
            return;

          return {
            en: 'Vuln: Avoid cleaves and jump',
            de: 'Vuln: Cleaves und Sprung ausweichen',
            ja: '被ダメ増加',
            ko: '받는 데미지 증가: 공격과 점프 피할것',
            cn: '易伤：躲避顺劈和跳',
          };
        }
      },
    },
    {
      id: 'TEA Wormhole',
      regex: Regexes.ability({ source: 'Alexander Prime', id: '486E', capture: false }),
      regexCn: Regexes.ability({ source: '至尊亚历山大', id: '486E', capture: false }),
      regexDe: Regexes.ability({ source: 'Prim-Alexander', id: '486E', capture: false }),
      regexFr: Regexes.ability({ source: 'Primo-Alexander', id: '486E', capture: false }),
      regexJa: Regexes.ability({ source: 'アレキサンダー・プライム', id: '486E', capture: false }),
      regexKo: Regexes.ability({ source: '알렉산더 프라임', id: '486E', capture: false }),
      infoText: function(data) {
        if (data.options.cactbotWormholeStrat) {
          return {
            en: 'Bait Chakrams mid; Look opposite Alex',
            de: 'Locke Chakrams mittig; schau weg von Alex',
            ja: '中央にチャクラム誘導; アレキの反対見て',
            ko: '가운데로 차크람 유도; 알렉 반대쪽이 북쪽',
            cn: '中间引导轮轮，背对亚历山大',
          };
        }
        return {
          en: 'Bait Chakrams',
          de: 'Köder Chakrams',
          ja: 'チャクラム誘導',
          ko: '차크람 유도',
          cn: '引导轮轮',
        };
      },
    },
    {
      id: 'TEA Cactbot Wormhole Strat',
      regex: Regexes.headMarker({ }),
      condition: function(data, matches) {
        if (!data.options.cactbotWormholeStrat)
          return false;
        if (!(/00(?:4F|5[0-6])/).test(getHeadmarkerId(data, matches)))
          return false;
        return data.phase == 'wormhole' && data.me == matches.target;
      },
      preRun: function(data, matches) {
        data.puddle = {
          '004F': 3,
          '0050': 3,
          '0051': 0,
          '0052': 0,
          '0053': 1,
          '0054': 1,
          '0055': 2,
          '0056': 2,
        }[getHeadmarkerId(data, matches)];
      },
      durationSeconds: 10,
      infoText: function(data, matches) {
        // Initial directions.
        // TODO: we could figure out which robot was left and right based
        // on chakrams, and call that out here too instead of just saying "Robot".
        return {
          '004F': {
            en: 'Left To Robot; Look Outside; 3rd Puddle',
            de: 'Links vom Robot; Nach Außen schauen; 3. Fläche',
            ja: '右上 外向き 懺悔3回目',
            ko: '왼쪽 위 / 참회 #3',
            cn: '左-->机器人; 面向外侧; 水圈#3',
          },
          '0050': {
            en: 'Back Right Opposite Robot; Look Middle; 3rd Puddle',
            de: 'Hinten Rechts gegenüber vom Robot; zur Mitte schauen; 3. Fläche',
            ja: '左下 内向き 懺悔3回目',
            ko: '오른쪽 위 / 참회 #3',
            cn: '右后<--机器人; 面向中间; 水圈#3',
          },
          '0051': {
            en: 'Back Left Opposite Robot; No Puddle',
            de: 'Hinten Links gegenüber vom Robot; keine Fläche',
            ja: '左上',
            ko: '왼쪽 아래',
            cn: '左后<--机器人; 无水圈',
          },
          '0052': {
            en: 'Right To Robot; No puddle',
            de: 'Rechts vom Robot; keine Fläche',
            ja: '右下',
            ko: '오른쪽 아래',
            cn: '右-->机器人; 无水圈',
          },
          '0053': {
            en: 'Left Robot Side -> 1st Puddle',
            de: 'Linke Robot Seite -> 1. Fläche',
            ja: '右ちょい上 懺悔1回目',
            ko: '왼쪽 / 참회 #1',
            cn: '机器人左侧 --> 水圈#1',
          },
          '0054': {
            en: 'Right Robot Side -> 1st Puddle',
            de: 'Rechte Robot Seite -> 1. Fläche',
            ja: '左ちょい上 懺悔1回目',
            ko: '오른쪽 / 참회 #1',
            cn: '机器人右侧 --> 水圈#1',
          },
          '0055': {
            en: 'Left Robot Side -> cardinal; 2nd Puddle',
            de: 'Linke Robot Seite -> cardinal; 2. Fläche',
            ja: '右ちょい上 懺悔2回目',
            ko: '왼쪽 / 참회 #2',
            cn: '机器人左侧 --> 边; 水圈#2',
          },
          '0056': {
            en: 'Right Robot Side -> cardinal; 2nd Puddle',
            de: 'Rechte Robot Seite -> cardinal; 2. Fläche',
            ja: '左ちょい上 懺悔2回目',
            ko: '오른쪽 / 참회 #2',
            cn: '机器人右侧 --> 边; 水圈#2',
          },
        }[getHeadmarkerId(data, matches)];
      },
    },
    {
      id: 'TEA Cactbot Wormhole 4 Super Jump',
      regex: Regexes.ability({ source: 'Brute Justice', id: '484A', capture: false }),
      regexCn: Regexes.ability({ source: '残暴正义号', id: '484A', capture: false }),
      regexDe: Regexes.ability({ source: 'Brutalus', id: '484A', capture: false }),
      regexFr: Regexes.ability({ source: 'Justicier', id: '484A', capture: false }),
      regexJa: Regexes.ability({ source: 'ブルートジャスティス', id: '484A', capture: false }),
      regexKo: Regexes.ability({ source: '포악한 심판자', id: '484A', capture: false }),
      condition: function(data) {
        if (!data.options.cactbotWormholeStrat)
          return false;
        if (data.phase != 'wormhole')
          return;
        return data.limitCutNumber == 2 || data.limitCutNumber == 3;
      },
      infoText: {
        en: 'Move Behind Brute Justice?',
        de: 'Geh hinter Brutalus?',
        ja: 'ジャスティスの背面へ',
        ko: '심판자 등 뒤로 이동?',
        cn: '残暴正义号背后躲避?',
      },
    },
    {
      id: 'TEA Incinerating Heat',
      regex: Regexes.headMarker({ }),
      condition: function(data, matches) {
        return getHeadmarkerId(data, matches) == '005D';
      },
      alertText: {
        en: 'Stack Middle',
        de: 'mittig sammeln',
        ja: '中央へ',
        ko: '가운데로 모이기',
        cn: '中间集合',
      },
    },
    {
      id: 'TEA Mega Holy',
      regex: Regexes.startsUsing({ source: 'Alexander Prime', id: '4A83', capture: false }),
      regexCn: Regexes.startsUsing({ source: '至尊亚历山大', id: '4A83', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Prim-Alexander', id: '4A83', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Primo-Alexander', id: '4A83', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'アレキサンダー・プライム', id: '4A83', capture: false }),
      regexKo: Regexes.startsUsing({ source: '알렉산더 프라임', id: '4A83', capture: false }),
      alertText: {
        en: 'big aoe',
        de: 'große AoE',
        fr: 'Grosse AoE',
        ko: '거대 전체 공격',
        cn: '高伤AOE',
      },
    },
    {
      id: 'TEA Summon Alexander',
      regex: Regexes.startsUsing({ source: 'Alexander Prime', id: '4A55', capture: false }),
      regexCn: Regexes.startsUsing({ source: '至尊亚历山大', id: '4A55', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Prim-Alexander', id: '4A55', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Primo-Alexander', id: '4A55', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'アレキサンダー・プライム', id: '4A55', capture: false }),
      regexKo: Regexes.startsUsing({ source: '알렉산더 프라임', id: '4A55', capture: false }),
      delaySeconds: 10.4,
      infoText: {
        en: 'Kill Cruise Chaser First',
        de: 'Chaser-Mecha zuerst besiegen',
        ja: 'チェイサーから倒す',
        fr: 'Tuez Croiseur-chasseur en premier',
        ko: '순항추격기부터 처치하기',
        cn: '先杀巡航驱逐者',
      },
    },
    {
      id: 'TEA Divine Judgment',
      regex: Regexes.ability({ source: 'Alexander Prime', id: '4879', capture: false }),
      regexCn: Regexes.ability({ source: '至尊亚历山大', id: '4879', capture: false }),
      regexDe: Regexes.ability({ source: 'Prim-Alexander', id: '4879', capture: false }),
      regexFr: Regexes.ability({ source: 'Primo-Alexander', id: '4879', capture: false }),
      regexJa: Regexes.ability({ source: 'アレキサンダー・プライム', id: '4879', capture: false }),
      regexKo: Regexes.ability({ source: '알렉산더 프라임', id: '4879', capture: false }),
      condition: function(data) {
        return data.role == 'tank';
      },
      delaySeconds: 6,
      alarmText: {
        en: 'TANK LB!!',
        de: 'TANK LB!!',
        ja: 'タンクLB!!',
        fr: 'TANK LB!!',
        ko: '탱크 LIMITE BREAK!!',
        cn: '坦克LB!!',
      },
    },
    {
      id: 'TEA Perfect Optical Sight Spread',
      regex: Regexes.startsUsing({ source: 'Perfect Alexander', id: '488A', capture: false }),
      regexCn: Regexes.startsUsing({ source: '完美亚历山大', id: '488A', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Perfekter Alexander', id: '488A', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Alexander parfait', id: '488A', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'パーフェクト・アレキサンダー', id: '488A', capture: false }),
      regexKo: Regexes.startsUsing({ source: '완전체 알렉산더', id: '488A', capture: false }),
      infoText: {
        en: 'Spread',
        de: 'Verteilen',
        fr: 'Dispersez-vous',
        ja: '散開',
        cn: '分散',
        ko: '산개',
      },
    },
    {
      id: 'TEA Perfect Optical Sight Stack',
      regex: Regexes.headMarker({ }),
      condition: function(data, matches) {
        return getHeadmarkerId(data, matches) == '003E';
      },
      preRun: function(data, matches) {
        data.opticalStack = data.opticalStack || [];
        data.opticalStack.push(matches.target);
      },
      alertText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Stack on YOU',
            de: 'Sammeln auf DIR',
            ja: '自分にシェア',
            fr: 'Stack sur VOUS',
            ko: '나에게 모이기',
            cn: '集合点名',
          };
        }
      },
      infoText: function(data) {
        if (data.opticalStack.length == 1)
          return;
        let names = data.opticalStack.map((x) => data.ShortName(x)).sort();
        return {
          en: 'Optical Stack (' + names.join(', ') + ')',
          de: 'Optischer Stack (' + names.join(', ') + ')',
          ja: 'シェア (' + names.join(', ') + ')',
          fr: 'Stack Optical (' + names.join(', ') + ')',
          ko: '조준 대상: ' + names.join(', '),
          cn: '照准集合 (' + names.join(', ') + ')',
        };
      },
    },
    {
      id: 'TEA Ordained Motion',
      regex: Regexes.startsUsing({ source: 'Perfect Alexander', id: '487E', capture: false }),
      regexCn: Regexes.startsUsing({ source: '完美亚历山大', id: '487E', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Perfekter Alexander', id: '487E', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Alexander parfait', id: '487E', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'パーフェクト・アレキサンダー', id: '487E', capture: false }),
      regexKo: Regexes.startsUsing({ source: '완전체 알렉산더', id: '487E', capture: false }),
      durationSeconds: 4,
      alertText: {
        en: 'Keep Moving',
        de: 'weiter bewegen',
        ja: '動く',
        fr: 'Bougez',
        ko: '움직여!!!',
        cn: '保持移动',
      },
    },
    {
      id: 'TEA Ordained Stillness',
      regex: Regexes.startsUsing({ source: 'Perfect Alexander', id: '487F', capture: false }),
      regexCn: Regexes.startsUsing({ source: '完美亚历山大', id: '487F', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Perfekter Alexander', id: '487F', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Alexander parfait', id: '487F', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'パーフェクト・アレキサンダー', id: '487F', capture: false }),
      regexKo: Regexes.startsUsing({ source: '완전체 알렉산더', id: '487F', capture: false }),
      alarmText: {
        en: 'STOP LITERALLY EVERYTHING',
        de: 'STOP WIRKLICH ALLES',
        ja: '止まる',
        fr: 'ARRÊTEZ TOUT',
        ko: '멈춰!!!',
        cn: '停止一切动作',
      },
    },
    {
      id: 'TEA Contact Prohibition',
      regex: Regexes.gainsEffect({ effect: 'Final Word: Contact Prohibition' }),
      regexCn: Regexes.gainsEffect({ effect: '判决确定：接触禁止命令' }),
      regexDe: Regexes.gainsEffect({ effect: 'Urteil: Kontaktverbot' }),
      regexFr: Regexes.gainsEffect({ effect: 'Jugement : contact prohibé' }),
      regexJa: Regexes.gainsEffect({ effect: '確定判決：接触禁止命令' }),
      regexKo: Regexes.gainsEffect({ effect: '확정 판결: 접촉금지 명령' }),
      condition: (data, matches) => data.me == matches.target,
      infoText: {
        en: 'Orange (Attract)',
        de: 'Orange (Anziehen)',
        ja: '接触禁止',
        fr: 'Orange (Attraction)',
        ko: '노랑/접촉금지',
        cn: '接触禁止',
      },
      tts: {
        en: 'Orange',
        de: 'Orange',
        ja: '接触禁止',
        fr: 'Orange',
        ko: '접촉금지',
        cn: '接触禁止',
      },
    },
    {
      id: 'TEA Contact Regulation',
      regex: Regexes.gainsEffect({ effect: 'Final Word: Contact Regulation' }),
      regexCn: Regexes.gainsEffect({ effect: '判决确定：接触保护命令' }),
      regexDe: Regexes.gainsEffect({ effect: 'Urteil: Kontakt-Order' }),
      regexFr: Regexes.gainsEffect({ effect: 'Jugement : contact forcé' }),
      regexJa: Regexes.gainsEffect({ effect: '確定判決：接触保護命令' }),
      regexKo: Regexes.gainsEffect({ effect: '확정 판결: 접촉보호 명령' }),
      condition: (data, matches) => data.me == matches.target,
      alarmText: {
        en: 'Orange Bait: Get Away',
        de: 'Orange locken: Geh Weg',
        ja: '接触保護',
        fr: 'Appât Orange: Eloignez-vous',
        ko: '노랑/접촉보호; 유도역할/혼자 멀리 있기',
        cn: '接触保护',
      },
    },
    {
      id: 'TEA Escape Prohibition',
      regex: Regexes.gainsEffect({ effect: 'Final Word: Escape Prohibition' }),
      regexCn: Regexes.gainsEffect({ effect: '判决确定：逃亡禁止命令' }),
      regexDe: Regexes.gainsEffect({ effect: 'Urteil: Fluchtverbot' }),
      regexFr: Regexes.gainsEffect({ effect: 'Jugement : fuite prohibée' }),
      regexJa: Regexes.gainsEffect({ effect: '確定判決：逃亡禁止命令' }),
      regexKo: Regexes.gainsEffect({ effect: '확정 판결: 도망금지 명령' }),
      condition: (data, matches) => data.me == matches.target,
      infoText: {
        en: 'Purple (Repel)',
        de: 'Lila (Abstoßen)',
        ja: '逃亡禁止',
        fr: 'Violet (Répulsion)',
        ko: '보라/도망금지',
        cn: '逃亡禁止',
      },
      tts: {
        en: 'Purple',
        de: 'Lila',
        ja: '逃亡禁止',
        fr: 'Violet',
        ko: '도망금지',
        cn: '逃亡禁止',
      },
    },
    {
      id: 'TEA Escape Detection',
      regex: Regexes.gainsEffect({ effect: 'Final Word: Escape Detection' }),
      regexCn: Regexes.gainsEffect({ effect: '判决确定：逃亡监察命令' }),
      regexDe: Regexes.gainsEffect({ effect: 'Urteil: Fluchtbeobachtung' }),
      regexFr: Regexes.gainsEffect({ effect: 'Jugement : fuite forcée' }),
      regexJa: Regexes.gainsEffect({ effect: '確定判決：逃亡監察命令' }),
      regexKo: Regexes.gainsEffect({ effect: '확정 판결: 도망감찰 명령' }),
      condition: (data, matches) => data.me == matches.target,
      alertText: {
        en: 'Purple Bait: Be In Back Of Group',
        de: 'Lila locken: Hinter der Gruppe sein',
        ja: '逃亡監察',
        fr: 'Appât Violet: Placez-vous derrière le groupe',
        ko: '보라/도망감찰; 유도역할/사람들 뒤에 있기',
        cn: '逃亡监察',
      },
    },
    {
      id: 'TEA Fate Tether Bois',
      regex: Regexes.tether({ id: '0062' }),
      run: function(data, matches) {
        data.tetherBois = data.tetherBois || {};
        data.tetherBois[matches.targetId] = matches.source;
      },
    },
    {
      id: 'TEA Alpha Instructions',
      regex: Regexes.tether({ id: '0062', capture: false }),
      condition: (data) => data.phase == 'alpha',
      delaySeconds: 1,
      suppressSeconds: 10,
      run: function(data) {
        // Let your actor id memes be dreams.
        // If you sort the actor ids of the clones, this will tell you what you have.
        // If anybody is dead, they will fill in from the lowest.
        let sortedIds = Object.keys(data.tetherBois).sort().reverse();
        let sortedNames = sortedIds.map((x) => data.tetherBois[x]);

        data.alphaSolidarity = sortedNames[0];
        data.alphaDefamation = sortedNames[1];
        data.alphaSeverity = [sortedNames[2], sortedNames[3], sortedNames[4]];

        let kNoDebuff = {
          en: 'No debuff: shared stack',
          de: 'Kein debuff: geteilter stack',
          ja: 'デバフ無し',
          fr: 'Aucun debuff: stack partagé',
          ko: '디버프 없음; 오른쪽/함께 맞기',
          cn: '无Debuff：分组分摊',
        };
        let kSeverity = {
          en: 'Severity: avoid shared stack',
          de: 'Erschwertes: geteilter stack ausweichen',
          ja: '加重罰',
          fr: 'Sévérité: éloignez-vous du stack',
          ko: '가중형; 왼쪽/가중형끼리 모이기',
          cn: '加重罪：远离分摊',
        };

        let kUnknown;
        if (sortedNames.length >= 5) {
          kUnknown = {
            en: 'No clone: probably stack?',
            de: 'keine Klone: warscheinlich kein debuff + stack?',
            ja: 'クローン無し: 多分シェア?',
            fr: 'Pas de clone: stack?',
            ko: '클론 없음: 아마도 오른쪽/함께 맞기?',
            cn: '没有分身: 或许要集合?',
          };
        } else {
          kUnknown = {
            en: 'No clone: ???',
            de: 'keine Klone: ???',
            ja: 'クローン無し: ???',
            fr: 'Pas de clone: ???',
            ko: '클론 없음: ???',
            cn: '没有分身: ¿¿¿',
          };
        }

        data.alphaInstructions = {
          '-1': kUnknown,
          '0': {
            en: 'Shared Sentence: stack',
            de: 'Urteil Kollektivstrafe: stack',
            ja: '集団罰: ',
            fr: 'Peine collective: stack',
            ko: '집단형: 오른쪽/함께 맞기',
            cn: '集团罪',
          },
          '1': {
            en: 'Defamation on YOU',
            de: 'Ehrenstrafe aud DIR',
            ja: '名誉罰',
            ko: '명예형: 보스 밑에서 나 홀로!!!',
            cn: '名誉罪',
          },
          '2': kSeverity,
          '3': kSeverity,
          '4': kSeverity,
          '5': kNoDebuff,
          '6': kNoDebuff,
          '7': kNoDebuff,
        }[sortedNames.indexOf(data.me)];
      },
    },
    {
      id: 'TEA Alpha Instructions Callout',
      regex: Regexes.tether({ id: '0062', capture: false }),
      condition: (data) => data.phase == 'alpha',
      delaySeconds: 2,
      durationSeconds: 28,
      suppressSeconds: 10,
      alarmText: function(data) {
        // Defamation will wipe the group, so gets an alarm.
        if (data.me == data.alphaDefamation)
          return data.alphaInstructions;
      },
      alertText: function(data) {
        // Folks who need to not stack, get an alert.
        if (data.me == data.alphaSolidarity)
          return data.alphaInstructions;
        if (data.alphaSeverity.includes(data.me))
          return data.alphaInstructions;
      },
      infoText: function(data) {
        // The other 4 people in the stack group just get info.
        if (data.me == data.alphaDefamation)
          return;
        if (data.me == data.alphaSolidarity)
          return;
        if (data.alphaSeverity.includes(data.me))
          return;
        return data.alphaInstructions;
      },
    },
    {
      id: 'TEA Alpha Ordained Motion 1',
      regex: Regexes.ability({ source: 'Perfect Alexander', id: '4B0D', capture: false }),
      regexCn: Regexes.ability({ source: '完美亚历山大', id: '4B0D', capture: false }),
      regexDe: Regexes.ability({ source: 'Perfekter Alexander', id: '4B0D', capture: false }),
      regexFr: Regexes.ability({ source: 'Alexander parfait', id: '4B0D', capture: false }),
      regexJa: Regexes.ability({ source: 'パーフェクト・アレキサンダー', id: '4B0D', capture: false }),
      regexKo: Regexes.ability({ source: '완전체 알렉산더', id: '4B0D', capture: false }),
      preRun: function(data) {
        data.firstAlphaOrdainedText = {
          en: 'Motion first',
          de: 'Bewegungsbefehl zuerst',
          ja: '最初は動く',
          fr: 'Mouvement en premier',
          ko: '우선 움직이기',
          cn: '首先移动',
        };
      },
      durationSeconds: 8,
      suppressSeconds: 20,
      infoText: (data) => data.firstAlphaOrdainedText,
      run: function(data) {
        data.firstAlphaOrdained = 'motion';
      },
    },
    {
      id: 'TEA Alpha Ordained Stillness 1',
      regex: Regexes.ability({ source: 'Perfect Alexander', id: '4B0E', capture: false }),
      regexCn: Regexes.ability({ source: '完美亚历山大', id: '4B0E', capture: false }),
      regexDe: Regexes.ability({ source: 'Perfekter Alexander', id: '4B0E', capture: false }),
      regexFr: Regexes.ability({ source: 'Alexander parfait', id: '4B0E', capture: false }),
      regexJa: Regexes.ability({ source: 'パーフェクト・アレキサンダー', id: '4B0E', capture: false }),
      regexKo: Regexes.ability({ source: '완전체 알렉산더', id: '4B0E', capture: false }),
      preRun: function(data) {
        data.firstAlphaOrdainedText = {
          en: 'Stillness first',
          de: 'Stillstandsbefehl zuerst',
          ja: '最初は止まる',
          fr: 'Immobilité en premier',
          ko: '우선 멈추기',
          cn: '首先静止',
        };
      },
      durationSeconds: 8,
      suppressSeconds: 20,
      infoText: (data) => data.firstAlphaOrdainedText,
      run: function(data) {
        data.firstAlphaOrdained = 'stillness';
      },
    },
    {
      id: 'TEA Alpha Ordained Motion 2',
      regex: Regexes.abilityFull({ source: 'Perfect Alexander', id: '4899', capture: false }),
      regexCn: Regexes.abilityFull({ source: '完美亚历山大', id: '4899', capture: false }),
      regexDe: Regexes.abilityFull({ source: 'Perfekter Alexander', id: '4899', capture: false }),
      regexFr: Regexes.abilityFull({ source: 'Alexander parfait', id: '4899', capture: false }),
      regexJa: Regexes.abilityFull({ source: 'パーフェクト・アレキサンダー', id: '4899', capture: false }),
      regexKo: Regexes.abilityFull({ source: '완전체 알렉산더', id: '4899', capture: false }),
      preRun: function(data) {
        data.secondAlphaOrdainedText = {
          en: 'Motion second',
          de: 'Bewegungsbefehl als Zweites',
          ja: '最後は動く',
          fr: 'Mouvement en deuxième',
          ko: '마지막엔 움직이기',
          cn: '最后移动',
        };
      },
      durationSeconds: 15,
      suppressSeconds: 20,
      infoText: function(data) {
        let first = data.firstAlphaOrdainedText[data.lang];
        let second = data.secondAlphaOrdainedText[data.lang];
        // For languages that haven't been translated, just return the second text.
        if (!first || !second)
          return data.secondAlphaOrdainedText;

        return first + ', ' + second;
      },
      tts: (data) => data.secondAlphaOrdainedText,
      run: function(data) {
        data.secondAlphaOrdained = 'motion';
      },
    },
    {
      id: 'TEA Alpha Ordained Stillness 2',
      regex: Regexes.abilityFull({ source: 'Perfect Alexander', id: '489A', capture: false }),
      regexCn: Regexes.abilityFull({ source: '完美亚历山大', id: '489A', capture: false }),
      regexDe: Regexes.abilityFull({ source: 'Perfekter Alexander', id: '489A', capture: false }),
      regexFr: Regexes.abilityFull({ source: 'Alexander parfait', id: '489A', capture: false }),
      regexJa: Regexes.abilityFull({ source: 'パーフェクト・アレキサンダー', id: '489A', capture: false }),
      regexKo: Regexes.abilityFull({ source: '완전체 알렉산더', id: '489A', capture: false }),
      preRun: function(data) {
        data.secondAlphaOrdainedText = {
          en: 'Stillness second',
          de: 'Stillstandsbefehl als Zweites',
          ja: '最後は止まる',
          fr: 'Immobilité en deuxième',
          ko: '마지막엔 멈추기',
          cn: '最后静止',
        };
      },
      durationSeconds: 15,
      suppressSeconds: 20,
      infoText: function(data) {
        let first = data.firstAlphaOrdainedText[data.lang];
        let second = data.secondAlphaOrdainedText[data.lang];
        // For languages that haven't been translated, just return the second text.
        if (!first || !second)
          return data.secondAlphaOrdainedText;

        return first + ', ' + second;
      },
      tts: (data) => data.secondAlphaOrdainedText,
      run: function(data) {
        data.secondAlphaOrdained = 'stillness';
      },
    },
    {
      id: 'TEA Alpha Safe Spot',
      // The non-safe alexanders use 489F.
      regex: Regexes.abilityFull({ source: 'Perfect Alexander', id: '49AA' }),
      regexCn: Regexes.abilityFull({ source: '完美亚历山大', id: '49AA' }),
      regexDe: Regexes.abilityFull({ source: 'Perfekter Alexander', id: '49AA' }),
      regexFr: Regexes.abilityFull({ source: 'Alexander parfait', id: '49AA' }),
      regexJa: Regexes.abilityFull({ source: 'パーフェクト・アレキサンダー', id: '49AA' }),
      regexKo: Regexes.abilityFull({ source: '완전체 알렉산더', id: '49AA' }),
      durationSeconds: 10,
      infoText: function(data, matches) {
        // TODO: this is overly complicated.
        // Alexanders always appear in the same spots and it's always
        // the second or third Alexander that is the safe spot.

        // Alexanders from left to right are:
        // 0: 78.28883, 91.00694 (~-67 degrees from north)
        // 1: 91.00694, 78.28883 (~-22 degrees from north)
        // 2: 108.9931, 78.28883 (~+22 degrees from north)
        // 3: 121.7112, 91.00694 (~+67 degrees from north)
        // center: 100, 100 (with +x = east and +y = south)

        // If they are all rotated equally, then:
        // rotation = idx * scale + rot0
        let rot0 = Math.atan2(78.28883 - 100, 100 - 91.00694);
        let rot1 = Math.atan2(91.00694 - 100, 100 - 78.28883);
        let scale = rot1 - rot0; // == Math.PI / 4

        let x = matches.x - 100;
        let y = 100 - matches.y;
        // idx is in [0, 1, 2, 3]
        let idx = parseInt(Math.round((Math.atan2(x, y) - rot0) / scale));

        // Store in case anybody wants to mark this.
        data.safeAlphaIdx = idx;
        data.safeAlphaPos = [matches.x, matches.y];

        // Unknown idx?
        if (idx != 1 && idx != 2)
          return;

        if (data.me == data.alphaDefamation) {
          return [
            {
              en: 'Defamation: front left',
              de: 'Ehrenstrafe: vorne links',
              ja: '名誉: 左前',
              ko: '명예: 왼쪽 앞!!!',
              cn: '名誉罪: 左前',
            },
            {
              en: 'Defamation: front right',
              de: 'Ehrenstrafe: vorne rechts',
              ja: '名誉: 右前',
              ko: '명예: 오른쪽 앞!!!',
              cn: '名誉罪: 右前',
            },
          ][idx - 1];
        }

        return [
          {
            en: 'Party: back right',
            de: 'Gruppe: hinten rechts',
            ja: '右後ろ',
            fr: 'Groupe: arrière droite',
            ko: '오른쪽 뒤!!!',
            cn: '右后',
          },
          {
            en: 'Party: back left',
            de: 'Gruppe: hinten links',
            ja: '左後ろ',
            fr: 'Groupe: arrière gauche',
            ko: '왼쪽 뒤!!!',
            cn: '左后',
          },
        ][idx - 1];
      },
    },
    {
      id: 'TEA Alpha Resolve First Motion',
      regex: Regexes.ability({ source: 'Perfect Alexander', id: '487C', capture: false }),
      regexCn: Regexes.ability({ source: '完美亚历山大', id: '487C', capture: false }),
      regexDe: Regexes.ability({ source: 'Perfekter Alexander', id: '487C', capture: false }),
      regexFr: Regexes.ability({ source: 'Alexander parfait', id: '487C', capture: false }),
      regexJa: Regexes.ability({ source: 'パーフェクト・アレキサンダー', id: '487C', capture: false }),
      regexKo: Regexes.ability({ source: '완전체 알렉산더', id: '487C', capture: false }),
      // 5 seconds until mechanic
      delaySeconds: 2.2,
      alertText: function(data) {
        if (data.firstAlphaOrdained == 'motion') {
          return {
            en: 'Move First',
            de: 'Zuerst bewegen',
            ja: '最初は動く',
            fr: 'Bougez en premier',
            ko: '우선 움직이기',
            cn: '首先移动',
          };
        }
        return {
          en: 'Stillness First',
          de: 'Zuerst Stillstehen',
          ja: '最初は止まる',
          fr: 'Restez immobile en premier',
          ko: '우선 멈추기',
          cn: '首先静止',
        };
      },
    },
    {
      id: 'TEA Alpha Resolve Second Motion',
      regex: Regexes.ability({ source: 'Perfect Alexander', id: '487C', capture: false }),
      regexCn: Regexes.ability({ source: '完美亚历山大', id: '487C', capture: false }),
      regexDe: Regexes.ability({ source: 'Perfekter Alexander', id: '487C', capture: false }),
      regexFr: Regexes.ability({ source: 'Alexander parfait', id: '487C', capture: false }),
      regexJa: Regexes.ability({ source: 'パーフェクト・アレキサンダー', id: '487C', capture: false }),
      regexKo: Regexes.ability({ source: '완전체 알렉산더', id: '487C', capture: false }),
      // ~4 seconds until mechanic (to avoid overlapping with first)
      delaySeconds: 7.2,
      alertText: function(data) {
        if (data.secondAlphaOrdained == 'motion') {
          return {
            en: 'Keep Moving',
            de: 'weiter bewegen',
            ja: '最後は動く',
            fr: 'Continuez à bouger',
            ko: '마지막엔 움직이기',
            cn: '保持移动',
          };
        }
        return {
          en: 'Stop Everything',
          de: 'Alles stoppen',
          ja: '最後は止まる',
          fr: 'Arrêtez tout',
          ko: '마지막엔 멈추기',
          cn: '保持静止',
        };
      },
    },
    {
      id: 'TEA Beta Instructions',
      regex: Regexes.tether({ id: '0062', capture: false }),
      condition: (data) => data.phase == 'beta',
      delaySeconds: 1,
      suppressSeconds: 10,
      run: function(data) {
        // See notes in TEA Alpha Instructions about what's going on here.
        let sortedIds = Object.keys(data.tetherBois).sort().reverse();
        let sortedNames = sortedIds.map((x) => data.tetherBois[x]);

        data.betaBait = [sortedNames[0], sortedNames[1]];
        data.betaJumps = [sortedNames[0], sortedNames[2], sortedNames[6]];

        data.betaInstructions = {
          // If you don't know, it's probably best for you to pretend like
          // you're running E->S so that there's a jump there and you
          // don't kill your friends stacking north.
          '-1': {
            en: 'No Clone: maybe purple E->S ???',
            de: 'Keine Klone: vielleicht Lila O->S ???',
            ja: 'クローン無し: 多分東から南???',
            fr: 'Pas de Clone: peut-être E->S ???',
            ko: '클론 없음: 아마도 동→남 ???',
            cn: '没有分身: 可能紫色 东->南 ???',
          },
          '0': {
            en: 'Purple Bait: bait E',
            de: 'Lila Köder: locke O',
            ja: '逃亡監察: 東へ',
            fr: 'Appât Violet: placez-vous E',
            ko: '보라/도망감찰: 유도역할/동쪽',
            cn: '紫色引导: 东',
          },
          '1': {
            en: 'Orange Bait: bait N',
            de: 'Orange Köder: locke N',
            ja: '接触保護: 北へ',
            fr: 'Appât Orange: placez-vous N',
            ko: '노랑/접촉보호: 유도역할/북쪽',
            cn: '橙色引导: 北',
          },
          '2': {
            en: 'Purple, no tether: E->W',
            de: 'Lila, keine Verbindung: O->W',
            ja: '接触禁止, 線無し: 東から西へ',
            fr: 'Violet, pas de lien: E->O',
            ko: '보라/접촉금지/선없음: 동→서',
            cn: '紫色, 无连线: 东->西',
          },
          // This person also has the shared sentence.
          '3': {
            en: 'Orange, no tether: E->N',
            de: 'Orange, keine Verbindung: O->N',
            ja: '接触禁止, 線無し: 東から北へ',
            fr: 'Orange, pas de lien: E->N',
            ko: '노랑/접촉금지/선없음: 동→북',
            cn: '橙色, 无连线: 东->北',
          },
          '4': {
            en: 'Purple, close tether: E->N',
            de: 'Lila, nahe Verbindungr: O->N',
            ja: '逃亡禁止, 接近強制: 東から北へ',
            fr: 'Violet, lien rapproché: E->N',
            ko: '보라/도망금지/강제접근: 동→북',
            cn: '紫色, 接近连线: 东->北',
          },
          '5': {
            en: 'Orange, close tether: E->N',
            de: 'Orange, nahe Verbindung: O->N',
            ja: '接触禁止, 接近強制: 東から北へ',
            fr: 'Orange, lien rapproché: E->N',
            ko: '노랑/접촉금지/강제접근: 동→북',
            cn: '橙色, 接近连线: 东->北',
          },
          '6': {
            en: 'Purple, far tether: E->S',
            de: 'Lila, entfernte Verbindung: O->S',
            ja: '逃亡禁止, 接近禁止: 東から南へ',
            fr: 'Violet, lien éloigné: E->S',
            ko: '보라/도망금지/접근금지: 동→남',
            cn: '紫色, 远离连线: 东->南',
          },
          '7': {
            en: 'Orange, far tether: E->N',
            de: 'Orange, entfernte Verbindung: O->N',
            ja: '接触禁止, 接近禁止: 東から北へ',
            fr: 'Orange, lien éloigné: E->N',
            ko: '노랑/접촉금지/접근금지: 동→북',
            cn: '橙色, 远离连线: 东->北',
          },
        }[sortedNames.indexOf(data.me)];
      },
    },
    {
      id: 'TEA Beta Instructions Callout',
      regex: Regexes.tether({ id: '0062', capture: false }),
      condition: (data) => data.phase == 'beta',
      delaySeconds: 2,
      durationSeconds: 35,
      suppressSeconds: 10,
      // TODO: this mess would be a nice use for a function that can just return the text type.
      alarmText: function(data) {
        // Baiters get an alarm text.
        if (data.betaBait.includes(data.me))
          return data.betaInstructions;
      },
      alertText: function(data) {
        // The west and south jump get an alert text.
        if (data.betaBait.includes(data.me))
          return;
        if (data.betaJumps.includes(data.me))
          return data.betaInstructions;
      },
      infoText: function(data) {
        // The rest of the group (going north) gets info.
        if (data.betaBait.includes(data.me))
          return;
        if (data.betaJumps.includes(data.me))
          return;
        return data.betaInstructions;
      },
    },
    {
      id: 'TEA Beta Radiant',
      regex: Regexes.abilityFull({ source: 'Perfect Alexander', id: '489E' }),
      regexCn: Regexes.abilityFull({ source: '完美亚历山大', id: '489E' }),
      regexDe: Regexes.abilityFull({ source: 'Perfekter Alexander', id: '489E' }),
      regexFr: Regexes.abilityFull({ source: 'Alexander parfait', id: '489E' }),
      regexJa: Regexes.abilityFull({ source: 'パーフェクト・アレキサンダー', id: '489E' }),
      regexKo: Regexes.abilityFull({ source: '완전체 알렉산더', id: '489E' }),
      preRun: function(data, matches) {
        // Track which perfect alexander clone did this.
        data.radiantSourceId = matches.sourceId;

        // Round location to nearest cardinal.
        let x = matches.x - 100;
        let y = 100 - matches.y;
        // 0 = N, 1 = E, 2 = S, 3 = W
        let idx = Math.round((Math.atan2(x, y) / Math.PI * 2 + 4)) % 4;
        data.radiantText = {
          // North shouldn't be possible.
          // But, leaving this here in case my math is wrong.
          0: {
            en: 'Sacrament North',
            de: 'Sacrement Norden',
            ja: '拝火は北',
            fr: 'Sacrement Nord',
            ko: '성례: 북',
            cn: '拜火 北',
          },
          1: {
            en: 'Sacrament East',
            de: 'Sacrement Osten',
            ja: '拝火は東',
            fr: 'Sacrement Est',
            ko: '성례: 동',
            cn: '拜火 东',
          },
          2: {
            en: 'Sacrament South',
            de: 'Sacrement Süden',
            ja: '拝火は南',
            fr: 'Sacrement Sud',
            ko: '성례: 남',
            cn: '拜火 南',
          },
          3: {
            en: 'Sacrament West',
            de: 'Sacrement Westen',
            ja: '拝火は西',
            fr: 'Sacrement Ouest',
            ko: '성례: 서',
            cn: '拜火 西',
          },
        }[idx];
      },
      infoText: function(data) {
        return data.radiantText;
      },
    },
    {
      // For reference:
      // Spread (on Alexander) is 48A0.
      // Stack (on Alexander) is 48A1.
      // Spread (per person) is 48A2.
      // Stack (two people) is 48A3.
      id: 'TEA Beta Optical Spread',
      regex: Regexes.abilityFull({ source: 'Perfect Alexander', id: '48A0', capture: false }),
      regexCn: Regexes.abilityFull({ source: '完美亚历山大', id: '48A0', capture: false }),
      regexDe: Regexes.abilityFull({ source: 'Perfekter Alexander', id: '48A0', capture: false }),
      regexFr: Regexes.abilityFull({ source: 'Alexander parfait', id: '48A0', capture: false }),
      regexJa: Regexes.abilityFull({ source: 'パーフェクト・アレキサンダー', id: '48A0', capture: false }),
      regexKo: Regexes.abilityFull({ source: '완전체 알렉산더', id: '48A0', capture: false }),
      infoText: {
        en: 'Optical Spread',
        de: 'Visier verteilen',
        ja: '散開',
        ko: '옵티컬: 산개',
        cn: '分散',
      },
      run: function(data) {
        data.betaIsOpticalStack = false;
      },
    },
    {
      id: 'TEA Beta Optical Stack',
      regex: Regexes.abilityFull({ source: 'Perfect Alexander', id: '48A1', capture: false }),
      regexCn: Regexes.abilityFull({ source: '完美亚历山大', id: '48A1', capture: false }),
      regexDe: Regexes.abilityFull({ source: 'Perfekter Alexander', id: '48A1', capture: false }),
      regexFr: Regexes.abilityFull({ source: 'Alexander parfait', id: '48A1', capture: false }),
      regexJa: Regexes.abilityFull({ source: 'パーフェクト・アレキサンダー', id: '48A1', capture: false }),
      regexKo: Regexes.abilityFull({ source: '완전체 알렉산더', id: '48A1', capture: false }),
      infoText: {
        en: 'Optical Stack',
        de: 'Visier sammeln',
        ja: 'シェア',
        ko: '옵티컬: 모이기',
        cn: '分摊',
      },
      run: function(data) {
        data.betaIsOpticalStack = true;
      },
    },
    {
      id: 'TEA Beta Optical Final',
      regex: Regexes.ability({ source: 'Perfect Alexander', id: '4B14', capture: false }),
      regexCn: Regexes.ability({ source: '完美亚历山大', id: '4B14', capture: false }),
      regexDe: Regexes.ability({ source: 'Perfekter Alexander', id: '4B14', capture: false }),
      regexFr: Regexes.ability({ source: 'Alexander parfait', id: '4B14', capture: false }),
      regexJa: Regexes.ability({ source: 'パーフェクト・アレキサンダー', id: '4B14', capture: false }),
      regexKo: Regexes.ability({ source: '완전체 알렉산더', id: '4B14', capture: false }),
      delaySeconds: 12.2,
      alertText: function(data) {
        if (!data.betaIsOpticalStack) {
          return {
            en: 'Optical Spread',
            de: 'Visier verteilen',
            ja: '散開',
            ko: '옵티컬: 산개',
            cn: '分散',
          };
        }
        if (data.betaBait.includes(data.me)) {
          return {
            en: 'Optical Stack on YOU',
            de: 'Visier sammeln auf DIR',
            ja: '自分にシェア',
            ko: '옵티컬: 나에게 모이기',
            cn: '集合点名',
          };
        }
      },
      infoText: function(data) {
        if (!data.betaIsOpticalStack)
          return;

        // Error?
        if (data.betaBait.length == 0) {
          return {
            en: 'Optical Stack',
            de: 'Visier sammeln',
            ko: '옵티컬: 모이기',
            cn: '集合',
          };
        }
        let names = data.betaBait.map((x) => data.ShortName(x)).sort();
        return {
          en: 'Optical Stack (' + names.join(', ') + ')',
          de: 'Visier sammeln (' + names.join(', ') + ')',
          ko: '옵티컬: 모이기 (' + names.join(', ') + ')',
          cn: '集合 (' + names.join(', ') + ')',
        };
      },
    },
    {
      id: 'TEA Beta Radiant Final',
      regex: Regexes.ability({ source: 'Perfect Alexander', id: '4B14', capture: false }),
      regexCn: Regexes.ability({ source: '完美亚历山大', id: '4B14', capture: false }),
      regexDe: Regexes.ability({ source: 'Perfekter Alexander', id: '4B14', capture: false }),
      regexFr: Regexes.ability({ source: 'Alexander parfait', id: '4B14', capture: false }),
      regexJa: Regexes.ability({ source: 'パーフェクト・アレキサンダー', id: '4B14', capture: false }),
      regexKo: Regexes.ability({ source: '완전체 알렉산더', id: '4B14', capture: false }),
      delaySeconds: 16,
      alertText: function(data) {
        return data.radiantText;
      },
    },
    {
      id: 'TEA Ordained Punishment',
      regex: Regexes.startsUsing({ source: 'Perfect Alexander', id: '4891' }),
      regexCn: Regexes.startsUsing({ source: '完美亚历山大', id: '4891' }),
      regexDe: Regexes.startsUsing({ source: 'Perfekter Alexander', id: '4891' }),
      regexFr: Regexes.startsUsing({ source: 'Alexander parfait', id: '4891' }),
      regexJa: Regexes.startsUsing({ source: 'パーフェクト・アレキサンダー', id: '4891' }),
      regexKo: Regexes.startsUsing({ source: '완전체 알렉산더', id: '4891' }),
      alarmText: function(data, matches) {
        if (data.role == 'tank' && data.me != matches.target) {
          return {
            en: 'Tank Swap!',
            de: 'Tank Wechsel!',
            ko: '탱크 교대!!!',
            cn: '换T!',
          };
        }
      },
      // Because this is two in a row, make this second one info.
      infoText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
            ja: '自分にタンクバスター',
            ko: '나에게 탱크버스터',
            cn: '死刑点名',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches.target),
            de: 'Tankbuster auf ' + data.ShortName(matches.target),
            fr: 'Tankbuster sur ' + data.ShortName(matches.target),
            ja: data.ShortName(matches.target) + 'にタンクバスター',
            ko: data.ShortName(matches.target) + '에게 탱크버스터',
            cn: '死刑点 ' + data.ShortName(matches.target),
          };
        }
      },
    },
    {
      id: 'TEA Trine Get Middle',
      regex: Regexes.ability({ source: 'Perfect Alexander', id: '488E', capture: false }),
      regexCn: Regexes.ability({ source: '完美亚历山大', id: '488E', capture: false }),
      regexDe: Regexes.ability({ source: 'Perfekter Alexander', id: '488E', capture: false }),
      regexFr: Regexes.ability({ source: 'Alexander parfait', id: '488E', capture: false }),
      regexJa: Regexes.ability({ source: 'パーフェクト・アレキサンダー', id: '488E', capture: false }),
      regexKo: Regexes.ability({ source: '완전체 알렉산더', id: '488E', capture: false }),
      alertText: {
        en: 'Stack Middle for Trine',
        de: 'Mittig sammeln für Trine',
        ja: '大審判来るよ',
        ko: '대심판이 옵니다, 가운데로',
        cn: '大审判 中间集合',
      },
    },
    {
      id: 'TEA Trine Initial',
      regex: Regexes.abilityFull({ source: 'Perfect Alexander', id: '488F', x: '100', y: '(?:92|100|108)' }),
      regexCn: Regexes.abilityFull({ source: '完美亚历山大', id: '488F', x: '100', y: '(?:92|100|108)' }),
      regexDe: Regexes.abilityFull({ source: 'Perfekter Alexander', id: '488F', x: '100', y: '(?:92|100|108)' }),
      regexFr: Regexes.abilityFull({ source: 'Alexander parfait', id: '488F', x: '100', y: '(?:92|100|108)' }),
      regexJa: Regexes.abilityFull({ source: 'パーフェクト・アレキサンダー', id: '488F', x: '100', y: '(?:92|100|108)' }),
      regexKo: Regexes.abilityFull({ source: '완전체 알렉산더', id: '488F', x: '100', y: '(?:92|100|108)' }),
      preRun: function(data, matches) {
        data.trine = data.trine || [];
        // See: https://imgur.com/a/l1n9MhS
        data.trine.push({
          92: 'r',
          100: 'g',
          108: 'y',
        }[matches.y]);
      },
      alertText: function(data) {
        // Call out after two, because that's when the mechanic is fully known.
        if (data.trine.length != 2)
          return;

        // Find the third one based on the first two.
        let three = ['r', 'g', 'y'].filter((x) => !data.trine.includes(x));

        // Start on the third trine, then move to the first.
        let threeOne = three + data.trine[0];

        // For parks and other forestry solutions.
        let locations = {
          r: [92, 100],
          g: [100, 100],
          y: [108, 100],
        };
        data.trineLocations = [locations[three], locations[data.trine[0]]];

        // Here's the cactbot strategy.  We'll call this the Zed strategy,
        // as all the movement is along these five squares that form a Z.
        // If these are the circles from https://imgur.com/a/l1n9MhS
        // r = red, g = green, y = yellow, capital = part of the Z
        //
        //   g r y r g
        //
        //   y Y-R g r
        //       |
        //   r g G g y
        //       |
        //   y g Y-R r
        //
        //   g y r y g
        //
        // Goals:
        // * Start in an obvious place (i.e. the middle of the room).
        // * Players will only have to move in cardinal directions (no diagonals).
        // * Players will only have to make two moves.
        // * The only motion will be along the 5 capital letters connected with lines.
        //
        // Algorithm.
        // (1) Start mid, look north.
        // (2) Watch the three trines in the Z from the middle column.
        //     This is the centered vertical R-G-Y in the diagram.
        // (3) Observe which one is #3.
        // (3) Choose one of (Wait Mid, Move North, Move South) to move to the #3 trine.
        // (4) From #3, only picking from circles in the Z, there is exactly
        //     one adjacent #1 (and exactly one adjacent #2).
        // (5) Move to the #1 circle once #3 explodes.
        // (6) Good work, team.
        //
        // Example:
        // Trines come down with r=1, g=2, y=3 (or north to south 1 2 3 in the middle box).
        // You'd move south to end up on the #3 trine.  Since you know #2 is in the middle
        // the second motion is to go east on the Z.

        // Each three to one has a different set of movements.
        // Call both out to start, then a separate trigger
        // once the first has happened.
        let responses = {
          'gr': {
            en: {
              first: 'Wait Middle, Dodge North',
              second: 'North',
            },
            de: {
              first: 'Warte in der Mitte, ausweichen nach Norden',
              second: 'Norden',
            },
            ja: {
              first: '中央から北へ',
              second: '北へ',
            },
            ko: {
              first: '가운데서 북쪽으로',
              second: '북쪽으로',
            },
            cn: {
              first: '中间 -> 北',
              second: '北',
            },
          },
          'rg': {
            en: {
              first: 'Go 1 North, Dodge South',
              second: 'South',
            },
            de: {
              first: 'Geh nach Norden, ausweichen nach Süden',
              second: 'Süden',
            },
            ja: {
              first: '北から中央へ',
              second: '中央へ',
            },
            ko: {
              first: '북쪽에서 가운데로',
              second: '가운데로',
            },
            cn: {
              first: '北 -> 中间',
              second: '中间',
            },
          },
          'ry': {
            en: {
              first: 'Go 1 North, Dodge West',
              second: 'West',
            },
            de: {
              first: 'Geh nach Norden, ausweichen nach Westen',
              second: 'Westen',
            },
            ja: {
              first: '北から西へ',
              second: '西へ',
            },
            ko: {
              first: '북쪽에서 서쪽으로',
              second: '서쪽으로',
            },
            cn: {
              first: '北 -> 西',
              second: '西',
            },
          },
          'yr': {
            en: {
              first: 'Go 1 South, Dodge East',
              second: 'East',
            },
            de: {
              first: 'Geh nach Süden, ausweichen nach Osten',
              second: 'Osten',
            },
            ja: {
              first: '南から東へ',
              second: '東へ',
            },
            ko: {
              first: '남쪽에서 동쪽으로',
              second: '동쪽으로',
            },
            cn: {
              first: '南 -> 东',
              second: '东',
            },
          },
          'gy': {
            en: {
              first: 'Wait Middle, Dodge South',
              second: 'South',
            },
            de: {
              first: 'Warte in der Mitte, ausweichen nach Süden',
              second: 'Süden',
            },
            ja: {
              first: '中央から南へ',
              second: '南へ',
            },
            ko: {
              first: '가운데서 남쪽으로',
              second: '남쪽으로',
            },
            cn: {
              first: '中间 -> 南',
              second: '南',
            },
          },
          'yg': {
            en: {
              first: 'Go 1 South, Dodge North',
              second: 'North',
            },
            de: {
              first: 'Geh nach Süden, ausweichen nach Norden',
              second: 'Norden',
            },
            ja: {
              first: '南から北へ',
              second: '北へ',
            },
            ko: {
              first: '남쪽에서 북쪽으로',
              second: '북쪽으로',
            },
            cn: {
              first: '南 -> 北',
              second: '北',
            },
          },
        }[threeOne][data.lang];

        // Save this for later.
        data.secondTrineResponse = responses.second;

        return responses.first;
      },
    },
    {
      id: 'TEA Trine Second',
      regex: Regexes.abilityFull({ source: 'Perfect Alexander', id: '4890', capture: false }),
      regexCn: Regexes.abilityFull({ source: '完美亚历山大', id: '4890', capture: false }),
      regexDe: Regexes.abilityFull({ source: 'Perfekter Alexander', id: '4890', capture: false }),
      regexFr: Regexes.abilityFull({ source: 'Alexander parfait', id: '4890', capture: false }),
      regexJa: Regexes.abilityFull({ source: 'パーフェクト・アレキサンダー', id: '4890', capture: false }),
      regexKo: Regexes.abilityFull({ source: '완전체 알렉산더', id: '4890', capture: false }),
      suppressSeconds: 15,
      alertText: function(data) {
        return data.secondTrineResponse;
      },
    },
    {
      id: 'TEA Irresistible Grace',
      regex: Regexes.startsUsing({ source: 'Perfect Alexander', id: '4894' }),
      regexCn: Regexes.startsUsing({ source: '完美亚历山大', id: '4894' }),
      regexDe: Regexes.startsUsing({ source: 'Perfekter Alexander', id: '4894' }),
      regexFr: Regexes.startsUsing({ source: 'Alexander parfait', id: '4894' }),
      regexJa: Regexes.startsUsing({ source: 'パーフェクト・アレキサンダー', id: '4894' }),
      regexKo: Regexes.startsUsing({ source: '완전체 알렉산더', id: '487B' }),
      // Don't collide with trine.
      delaySeconds: 2,
      infoText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Stack on YOU',
            de: 'Auf DIR sammeln',
            ja: '自分にシェア',
            fr: 'Package sur VOUS',
            cn: '集合点名',
            ko: '나에게 모이기',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches.target),
          de: 'Auf ' + data.ShortName(matches.target) + ' sammeln',
          fr: 'Package sur ' + data.ShortName(matches.target),
          cn: '靠近 ' + data.ShortName(matches.target) + '集合',
          ja: data.ShortName(matches.target) + ' にシェア',
          ko: data.ShortName(matches.target) + '에게 모이기',
        };
      },
      run: function(data) {
        delete data.trine;
        delete data.secondTrineResponse;
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'missingTranslations': true,
      'replaceSync': {
        '(?<! )Alexander(?! )': 'Alexander',
        'Alexander Prime': 'Prim-Alexander',
        'Brute Justice': 'Brutalus',
        'Cruise Chaser': 'Chaser-Mecha',
        'Jagd Doll': 'Jagdpuppe',
        'Judgment Crystal': 'Urteilskristall',
        'Liquid Hand': 'belebte Hand',
        'Liquid Rage': 'levitierte Rage',
        'Living Liquid': 'belebtes Wasser',
        'Perfect Alexander': 'Perfekter Alexander',
        'Plasmasphere': 'Plasmasphäre',
        'Steam Chakram': 'Dampf-Chakram',
      },
      'replaceText': {
        '(?<! )Repentance': 'Reue',
        '--Cruise Chaser Invincible--': '--Chaser-Mecha unverwundbar--',
        '--adds targetable--': '--adds anvisierbar--',
        '--alex untargetable--': '--alex nich anvisierbar--',
        'Aetheroplasm': 'Ätheroplasma',
        'Almighty Judgment': 'Göttliches Letzturteil',
        'Alpha Sword': 'Alpha-Schwert',
        'Apocalyptic Ray': 'Apokalyptischer Strahl ',
        'Cascade': 'Cascade',
        'Chakrams': 'Chakrams',
        'Chastening Heat': 'Brennende Verdammung',
        'Collective Reprobation': 'Kollektivstrafe',
        'Crashing Wave': 'Brechende Welle',
        'Divine Judgment': 'Göttliches Urteil',
        'Divine Spear': 'Heiliger Speer',
        'Double Rocket Punch': 'Doppelraketenschlag',
        'Down for the Count': 'Am Boden',
        'Drainage': 'Entwässerung',
        'Earth Missile': 'Erd-Geschoss',
        'Embolus': 'Pfropfen',
        'Enumeration': 'Enumeration',
        'Eternal Darkness': 'Ewiges Dunkel',
        'Exhaust': 'Exhaustor',
        'Fate Calibration': 'FZukunftswahl',
        'Fate Projection': 'Zukunftsberechnung',
        'Final Sentence': 'Todesstrafe',
        'Flarethrower': 'Flammenwerfer',
        'Fluid Strike': 'Flüssiger Schlag',
        'Fluid Swing': 'Flüssiger Schwung',
        'Gavel': 'Prozessende',
        'Hand of Pain': 'Qualhand',
        'Hand of Prayer': 'Betende Hand',
        'Hawk Blaster': 'Jagdfalke',
        'Hidden Minefield': 'Getarntes Minenfeld',
        'Inception Formation': 'Raumzeit-Eingriffsformation',
        'Inception(?! )': 'Raumzeit-Eingriff',
        'Incinerating Heat': 'Sengende Hitze',
        'Individual Reprobation': 'Einzelstrafe',
        'Irresistible Grace': 'Sammelurteil',
        'J Jump': 'Gewissenssprung',
        'J Kick': 'Gewissenstritt',
        'J Storm': 'Gerechter Sturm',
        'Judgment Crystal': 'Urteilskristall',
        'Judgment Nisi': 'Vorläufige Vollstreckung',
        'Limit Cut': 'Grenzwertüberschreitung',
        'Link-Up': 'Zusammenschluss',
        'Liquid Gaol': 'Wasserkerker',
        'Mega Holy': 'Super-Sanctus',
        'Missile Command': 'Raketenkommando',
        'Optical Sight': 'Visier',
        'Ordained Capital Punishment': 'Gnadenlose Ahndung',
        'Ordained Motion': 'Bewegungsbefehl',
        'Ordained Punishment': 'Ahndung',
        'Ordained Stillness': 'Stillstandsbefehl',
        'Photon': 'Photon',
        'Players Remaining': 'Spieler übrig',
        'Pressurize': 'Kompression',
        'Propeller Wind': 'Luftschraube',
        'Protean Wave': 'Proteische Welle',
        'Punishing Wave': 'Strafende Welle',
        'Sacrament': 'Sakrament',
        'Severity': 'Erschwertes',
        'Sluice': 'Schleusenöffnung',
        'Solidarity': 'Kollektiv',
        'Spin Crusher': 'Rotorbrecher',
        'Splash': 'Schwall',
        'Summon Alexander': 'Alexanders Beschwörung',
        'Super Blassty Charge': 'Super-Blassty-Ladung',
        'Super Jump': 'Supersprung',
        'Surety': 'Ortsbindung',
        'Temporal Interference': 'Raumzeit-Manipulation',
        'Temporal Prison': 'Zeitzelle',
        'Temporal Stasis': 'Zeitstillstand',
        'The Final Word': 'Strafzumessung',
        'Throttles': 'Erstickungen',
        'Void Of Repentance': 'Kammer der Buße',
        'Water and Thunder': 'Wasser und Blitz',
        'Whirlwind': 'Wirbelwind',
        'Wormhole Formation': 'Dimensionsspaltungsformation',
      },
      '~effectNames': {
        'Aggravated Assault': 'Urteil: Erschwerte Strafe',
        'Compressed Lightning': 'Blitzkompression',
        'Compressed Water': 'Wasserkompression',
        'Contact Regulation Ordained': 'Kontakt-Order',
        'Devotion': 'Hingabe',
        'Down for the Count': 'Am Boden',
        'Embolden': 'Ermutigen',
        'Enigma Codex': 'Enigma-Kodex',
        'Escape Detection Ordained': 'Fluchtbeobachtung',
        'Final Decree Nisi': 'Letztes Vorläufiges Urteil',
        'Final Judgment: Decree Nisi': 'Prozess über Vorläufiges Urteil',
        'Final Judgment: Penalty III': 'Prozess über Schwächung 3',
        'Final Word: Contact Prohibition': 'Urteil: Kontaktverbot',
        'Final Word: Contact Regulation': 'Urteil: Kontakt-Order',
        'Final Word: Escape Detection': 'Urteil: Fluchtbeobachtung',
        'Final Word: Escape Prohibition': 'Urteil: Fluchtverbot',
        'Fire Resistance Down II': 'Feuerresistenz - (stark)',
        'Heavy': 'Gewicht',
        'House Arrest': 'Urteil: Freiheitsstrafe',
        'Lightning Resistance Down II': 'Blitzresistenz - (stark)',
        'Luminous Aetheroplasm': 'Luminiszentes Ätheroplasma',
        'Magic Vulnerability Up': 'Erhöhte Magie-Verwundbarkeit',
        'Physical Vulnerability Up': 'Erhöhte Physische Verwundbarkeit',
        'Restraining Order': 'Urteil: Näherungsverbot',
        'Shared Sentence': 'Urteil: Kollektivstrafe',
        'Summon Order': 'Egi-Attacke I',
        'Summon Order III': 'Egi-Attacke III',
        'Temporal Displacement': 'Zeitstillstand',
        'Throttle': 'Erstickung',
        'Water Resistance Down II': 'Wasserresistenz - (stark)',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Alexander Prime': 'Primo-Alexander',
        'Brute Justice': 'Justicier',
        'Cruise Chaser': 'Croiseur-chasseur',
        'Jagd Doll': 'poupée jagd',
        'Liquid Hand': 'membre liquide',
        'Liquid Rage': 'furie liquide',
        'Living Liquid': 'liquide vivant',
        'Perfect Alexander': 'Alexander parfait',
        'Plasmasphere': 'sphère de plasma',
        'Steam Chakram': 'chakram de vapeur',
      },
      'replaceText': {
        '(?<! )Repentance': 'Repentir',
        'Aetheroplasm': 'Éthéroplasma',
        'Almighty Judgment': 'Sentence divine',
        'Alpha Sword': 'Épée alpha',
        'Apocalyptic Ray': 'Rayon apocalyptique',
        'Cascade': 'Cascade',
        'Chastening Heat': 'Chaleur de l\'ordalie',
        'Collective Reprobation': 'Réprobation collective',
        'Crashing Wave': 'Vague percutante',
        'Divine Judgment': 'Jugement divin',
        'Divine Spear': 'Épieu divin',
        'Double Rocket Punch': 'Double coup de roquette',
        'Down for the Count': 'Au tapis',
        'Drainage': 'Drainage',
        'Earth Missile': 'Missile de terre',
        'Embolus': 'caillot',
        'Enumeration': 'Compte',
        'Eternal Darkness': 'Ténèbres éternelles',
        'Exhaust': 'Échappement',
        'Final Sentence': 'Peine capitale',
        'Flarethrower': 'Lance-brasiers',
        'Fluid Strike': 'Frappe fluide',
        'Fluid Swing': 'Coup fluide',
        'Gavel': 'Conclusion de procès',
        'Hand of Pain': 'Main de douleur',
        'Hand of Prayer': 'Main de prière',
        'Hawk Blaster': 'Canon faucon',
        'Hidden Minefield': 'Champ de mines caché',
        'Inception Formation': 'Marche du commencement',
        'Inception(?! )': 'Commencement',
        'Incinerating Heat': 'Chaleur purifiante',
        'Individual Reprobation': 'Réprobation individuelle',
        'Irresistible Grace': 'Peines interdépendantes',
        'J Jump': 'Bond justicier',
        'J Kick': 'Pied justicier',
        'J Storm': 'Tempête justicière',
        'Judgment Crystal': 'Cristal du jugement',
        'Judgment Nisi': 'Jugement conditionnel',
        'Limit Cut': 'Dépassement de limites',
        'Link-Up': 'Effort collectif',
        'Liquid Gaol': 'Geôle liquide',
        'Mega Holy': 'Méga Miracle',
        'Missile Command': 'Commande missile',
        'Optical Sight': 'Visée optique',
        'Ordained Capital Punishment': 'Châtiment exemplaire',
        'Ordained Motion': 'Défense de s\'arrêter',
        'Ordained Punishment': 'Châtiment',
        'Ordained Stillness': 'Défense de bouger',
        'Photon': 'Photon',
        'Pressurize': 'Repressurisation',
        'Propeller Wind': 'Vent turbine',
        'Protean Wave': 'Vague inconstante',
        'Punishing Wave': 'Vague punitive',
        'Sacrament': 'Sacrement',
        'Sluice': 'Éclusage',
        'Spin Crusher': 'Écrasement tournoyant',
        'Splash': 'Éclaboussement',
        'Summon Alexander': 'Invocation d\'Alexander',
        'Super Blassty Charge': 'Super charge Blassty',
        'Super Jump': 'Super saut',
        'Temporal Interference': 'Interférences spatio-temporelles',
        'Temporal Prison': 'Geôle temporelle',
        'Temporal Stasis': 'Stase temporelle',
        'The Final Word': 'Prononcé du jugement',
        'Void Of Repentance': 'Vide du repentir',
        'Whirlwind': 'Tornade',
        'Wormhole Formation': 'Marche de la fracture dimensionnelle',
      },
      '~effectNames': {
        'Aggravated Assault': 'Jugement : peine sévère',
        'Compressed Lightning': 'Compression électrique',
        'Compressed Water': 'Compression aqueuse',
        'Contact Regulation Ordained': 'Contact forcé',
        'Devotion': 'Dévouement',
        'Down for the Count': 'Au tapis',
        'Embolden': 'Enhardissement',
        'Enigma Codex': 'Enigma Codex',
        'Escape Detection Ordained': 'Fuite forcée',
        'Final Decree Nisi α': 'Peine provisoire α ultime',
        'Final Decree Nisi β': 'Peine provisoire β ultime',
        'Final Decree Nisi γ': 'Peine provisoire γ ultime',
        'Final Decree Nisi δ': 'Peine provisoire δ ultime',
        'Final Judgment: Decree Nisi α': 'Injonction : peine provisoire α',
        'Final Judgment: Decree Nisi β': 'Injonction : peine provisoire β',
        'Final Judgment: Decree Nisi γ': 'Injonction : peine provisoire γ',
        'Final Judgment: Decree Nisi δ': 'Injonction : peine provisoire δ',
        'Final Judgment: Penalty III': 'Injonction : 3 altérations',
        'Final Word: Contact Prohibition': 'Jugement : contact prohibé',
        'Final Word: Contact Regulation': 'Jugement : contact forcé',
        'Final Word: Escape Detection': 'Jugement : fuite forcée',
        'Final Word: Escape Prohibition': 'Jugement : fuite prohibée',
        'Fire Resistance Down II': 'Résistance au feu réduite+',
        'Heavy': 'Pesanteur',
        'House Arrest': 'Jugement : rapprochement',
        'Lightning Resistance Down II': 'Résistance à la foudre réduite+',
        'Luminous Aetheroplasm': 'Éthéroplasma lumineux',
        'Magic Vulnerability Up': 'Vulnérabilité magique augmentée',
        'Physical Vulnerability Up': 'Vulnérabilité physique augmentée',
        'Restraining Order': 'Jugement : éloignement',
        'Shared Sentence': 'Jugement : peine collective',
        'Summon Order': 'Action en attente : 1',
        'Summon Order III': 'Actions en attente : 3',
        'Temporal Displacement': 'Stase temporelle',
        'Throttle': 'Cadence améliorée',
        'Water Resistance Down II': 'Résistance à l\'eau réduite+',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Alexander Prime': 'アレキサンダー・プライム',
        'Brute Justice': 'ブルートジャスティス',
        'Cruise Chaser': 'クルーズチェイサー',
        'Jagd Doll': 'ヤークトドール',
        'Liquid Hand': 'リキッドハンド',
        'Liquid Rage': 'リキッドレイジ',
        'Living Liquid': 'リビングリキッド',
        'Perfect Alexander': 'パーフェクト・アレキサンダー',
        'Plasmasphere': 'プラズマスフィア',
        'Steam Chakram': 'スチームチャクラム',
      },
      'replaceText': {
        '(?<! )Repentance': '罪の意識',
        'Aetheroplasm': 'エーテル爆雷',
        'Almighty Judgment': '聖なる大審判',
        'Alpha Sword': 'アルファソード',
        'Apocalyptic Ray': 'アポカリプティクレイ',
        'Cascade': 'カスケード',
        'Chastening Heat': '神罰の熱線',
        'Collective Reprobation': '群の断罪',
        'Crashing Wave': 'クラッシュウェーブ',
        'Divine Judgment': '聖なる審判',
        'Divine Spear': '聖なる炎',
        'Double Rocket Punch': 'ダブルロケットパンチ',
        'Down for the Count': 'ノックダウン',
        'Drainage': 'ドレナージ',
        'Earth Missile': 'アースミサイル',
        'Embolus': 'エンボラス',
        'Enumeration': 'カウント',
        'Eternal Darkness': '暗黒の運命',
        'Exhaust': 'エグゾースト',
        'Final Sentence': '死刑判決',
        'Flarethrower': '大火炎放射',
        'Fluid Strike': 'フルイドストライク',
        'Fluid Swing': 'フルイドスイング',
        'Gavel': '最後の審判：結審',
        'Hand of Pain': 'ハンド・オブ・ペイン',
        'Hand of Prayer': 'ハンド・オブ・プレイヤー',
        'Hawk Blaster': 'ホークブラスター',
        'Hidden Minefield': 'ステルス地雷散布',
        'Inception Formation': '時空潜行のマーチ',
        'Inception(?! )': '時空潜行',
        'Incinerating Heat': '浄化の熱線',
        'Individual Reprobation': '個の断罪',
        'Irresistible Grace': '連帯刑',
        'J Jump': 'ジャスティスジャンプ',
        'J Kick': 'ジャスティスキック',
        'J Storm': 'ジャスティスストーム',
        'Judgment Crystal': '審判の結晶',
        'Judgment Nisi': 'ジャッジメントナイサイ',
        'Limit Cut': 'リミッターカット',
        'Link-Up': 'システムリンク',
        'Liquid Gaol': 'リキッドジェイル',
        'Mega Holy': 'メガホーリー',
        'Missile Command': 'ミサイル全弾発射',
        'Optical Sight': '照準',
        'Ordained Capital Punishment': '加重誅罰',
        'Ordained Motion': '行動命令',
        'Ordained Punishment': '誅罰',
        'Ordained Stillness': '静止命令',
        'Photon': 'フォトン',
        'Pressurize': '水圧充填',
        'Propeller Wind': 'プロペラウィンド',
        'Protean Wave': 'プロティアンウェイブ',
        'Punishing Wave': 'パニッシュウェーブ',
        'Sacrament': '十字の秘蹟',
        'Sluice': 'スルース',
        'Spin Crusher': 'スピンクラッシャー',
        'Splash': 'スプラッシュ',
        'Summon Alexander': 'アレキサンダー召喚',
        'Super Blassty Charge': 'スーパーブラスティ・チャージ',
        'Super Jump': 'スーパージャンプ',
        'Temporal Interference': '時空干渉',
        'Temporal Prison': '時の牢獄',
        'Temporal Stasis': '時間停止',
        'The Final Word': '確定判決',
        'Void Of Repentance': '懺悔の間',
        'Whirlwind': '竜巻',
        'Wormhole Formation': '次元断絶のマーチ',
      },
      '~effectNames': {
        'Aggravated Assault': '確定判決：加重罰',
        'Compressed Lightning': '雷属性圧縮',
        'Compressed Water': '水属性圧縮',
        'Contact Regulation Ordained': '接触保護命令',
        'Devotion': 'エギの加護',
        'Down for the Count': 'ノックダウン',
        'Embolden': 'エンボルデン',
        'Enigma Codex': 'エニグマ・コーデックス',
        'Escape Detection Ordained': '逃亡監察命令',
        'Final Decree Nisi α': '最後の仮判決α',
        'Final Decree Nisi β': '最後の仮判決β',
        'Final Decree Nisi γ': '最後の仮判決γ',
        'Final Decree Nisi δ': '最後の仮判決δ',
        'Final Judgment: Decree Nisi α': '最後の審判：仮判決α',
        'Final Judgment: Decree Nisi β': '最後の審判：仮判決β',
        'Final Judgment: Decree Nisi γ': '最後の審判：仮判決γ',
        'Final Judgment: Decree Nisi δ': '最後の審判：仮判決δ',
        'Final Judgment: Penalty III': '最後の審判：デバフ3',
        'Final Word: Contact Prohibition': '確定判決：接触禁止命令',
        'Final Word: Contact Regulation': '確定判決：接触保護命令',
        'Final Word: Escape Detection': '確定判決：逃亡監察命令',
        'Final Word: Escape Prohibition': '確定判決：逃亡禁止命令',
        'Fire Resistance Down II': '火属性耐性低下[強]',
        'Heavy': 'ヘヴィ',
        'House Arrest': '確定判決：接近強制命令',
        'Lightning Resistance Down II': '雷属性耐性低下［強］',
        'Luminous Aetheroplasm': '光性爆雷',
        'Magic Vulnerability Up': '被魔法ダメージ増加',
        'Physical Vulnerability Up': '被物理ダメージ増加',
        'Restraining Order': '確定判決：接近禁止命令',
        'Shared Sentence': '確定判決：集団罰',
        'Summon Order': 'アクション実行待機I',
        'Summon Order III': 'アクション実行待機III',
        'Temporal Displacement': '時間停止',
        'Throttle': 'スロットル',
        'Water Resistance Down II': '水属性耐性低下［強］',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        '(?<! )Alexander(?! )': '亚历山大',
        'Alexander Prime': '至尊亚历山大',
        'Brute Justice': '残暴正义号',
        'Cruise Chaser': '巡航驱逐者',
        'Jagd Doll': '狩猎人偶',
        'Liquid Hand': '活水之手',
        'Liquid Rage': '活水之怒',
        'Living Liquid': '有生命活水',
        'Perfect Alexander': '完美亚历山大',
        'Plasmasphere': '等离子球',
        'Steam Chakram': '蒸汽战轮',
      },
      'replaceText': {
        ' and': '',
        '(?<! )Repentance': '罪恶感',
        '--Cruise Chaser Invincible--': '--巡航驱逐者无敌--',
        '--adds targetable--': '--小怪可选中--',
        '--alex untargetable--': '--亚历山大无法选中--',
        '/Parting': '/离别之手',
        '/Stillness': '/静止命令',
        'Aetheroplasm': '以太爆雷',
        'Almighty Judgment': '神圣大审判',
        'Alpha Sword': '阿尔法之剑',
        'Apocalyptic Ray': '末世宣言',
        'Cascade': '倾泻',
        'Chakrams': '轮轮',
        'Chastening Heat': '神罚射线',
        'Collective Reprobation': '群体断罪',
        'Crashing Wave': '冲击波',
        'Divine Judgment': '神圣审判',
        'Divine Spear': '圣炎',
        'Double Rocket Punch': '双重火箭飞拳',
        'Down for the Count': '击倒',
        'Drainage': '排水',
        'Earth Missile': '寒冰导弹',
        'Embolus': '栓塞',
        'Enumeration': '计数',
        'Eternal Darkness': '黑暗命运',
        'Exhaust': '污染蒸汽',
        'Fate Calibration': '未来确定',
        'Fate Projection': '未来观测',
        'Fate: ': '未来: ',
        'Final Sentence': '死刑判决',
        'Flarethrower': '大火炎放射',
        'Fluid Strike': '流体强袭',
        'Fluid Swing': '流体摆动',
        'Gavel': '终审闭庭',
        'Hand of Pain': '苦痛之手',
        'Hand of Prayer': '祈祷之手',
        'Hawk Blaster': '鹰式破坏炮',
        'Hidden Minefield': '隐形地雷散布',
        'Inception Formation': '时空潜行阵列',
        'Inception(?! )': '时空潜行',
        'Incinerating Heat': '净化射线',
        'Individual Reprobation': '个体断罪',
        'Individual/': '单体/',
        'Irresistible Grace': '株连',
        'J Jump': '正义之跃',
        'J Kick': '正义飞踢',
        'J Storm': '正义旋风',
        'Judgment Crystal': '审判结晶',
        'Judgment Nisi': '非最终审判',
        'Limit Cut': '限制器减档',
        'Link-Up': '系统连接',
        'Liquid Gaol': '液体监狱',
        'Mega Holy': '百万神圣',
        'Middle Blaster': '中间冲击波',
        'Missile Command': '导弹齐发',
        'Obloquy': '污名神判',
        'Optical Sight': '制导',
        'Ordained Capital Punishment': '加重诛罚',
        'Ordained Motion': '行动命令',
        'Ordained Punishment': '诛罚',
        'Ordained Stillness': '静止命令',
        'Photon': '光子炮',
        'Players Remaining': '剩余玩家',
        'Pressurize': '填充水压',
        'Propeller Wind': '螺旋桨强风',
        'Protean Wave': '万变水波',
        'Punishing Wave': '惩戒波',
        'Radiant ': '拜火',
        'Rage Wave': '活水之怒',
        'Reveal': '生效',
        'Sacrament': '圣礼',
        'Severity': '重罚神判',
        'Sluice': '冲洗',
        'Solidarity': '连带神判',
        'Spin Crusher': '回旋碎踢',
        'Splash': '溅开',
        'Summon Alexander': '召唤亚历山大',
        'Super Blassty Charge': '超级摧毁者冲击',
        'Super Jump': '超级跳跃',
        'Surety': '誓约神判',
        'Temporal Interference': '时空干涉',
        'Temporal Prison': '时间牢狱',
        'Temporal Stasis': '时间停止',
        'The Final Word': '终审判決',
        'Throttles': '窒息',
        'Thunder': '雷',
        'True Heart': '真心',
        'Void Of Repentance': '忏悔区',
        'Water': '水',
        'Waves': '水波',
        'Whirlwind': '旋风',
        'Wormhole Formation': '次元断绝阵列',
      },
      '~effectNames': {
        'Aggravated Assault': '判决确定：加重罪',
        'Compressed Lightning': '雷属性压缩',
        'Compressed Water': '水属性压缩',
        'Contact Regulation Ordained': '接触保护命令',
        'Devotion': '灵护',
        'Down for the Count': '击倒',
        'Embolden': '鼓励',
        'Enigma Codex': '英格玛秘典',
        'Escape Detection Ordained': '逃亡监察命令',
        'Final Decree Nisi α': '最终判决α',
        'Final Decree Nisi β': '最终判决β',
        'Final Decree Nisi γ': '最终判决γ',
        'Final Decree Nisi δ': '最终判决δ',
        'Final Judgment: Decree Nisi α': '终审：判决α',
        'Final Judgment: Decree Nisi β': '终审：判决β',
        'Final Judgment: Decree Nisi γ': '终审：判决γ',
        'Final Judgment: Decree Nisi δ': '终审：判决δ',
        'Final Judgment: Penalty III': '终审：弱化状态3',
        'Final Word: Contact Prohibition': '判决确定：接触禁止命令',
        'Final Word: Contact Regulation': '判决确定：接触保护命令',
        'Final Word: Escape Detection': '判决确定：逃亡监察命令',
        'Final Word: Escape Prohibition': '判决确定：逃亡禁止命令',
        'Fire Resistance Down II': '火属性耐性大幅降低',
        'Heavy': '加重',
        'House Arrest': '判决确定：强制接近命令',
        'Lightning Resistance Down II': '雷属性耐性大幅降低',
        'Luminous Aetheroplasm': '光性爆雷',
        'Magic Vulnerability Up': '魔法受伤加重',
        'Physical Vulnerability Up': '物理受伤加重',
        'Restraining Order': '判决确定：禁止接近命令',
        'Shared Sentence': '判决确定：集团罪',
        'Summon Order': '发动技能待命I',
        'Summon Order III': '发动技能待命III',
        'Temporal Displacement': '时间停止',
        'Throttle': '窒息',
        'Water Resistance Down II': '水属性耐性大幅降低',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {
        '(?<! )Alexander(?! )': '알렉산더',
        'Alexander Prime': '알렉산더 프라임',
        'Brute Justice': '포악한 심판자',
        'Cruise Chaser': '순항추격기',
        'Jagd Doll': '인형 수렵병',
        'Liquid Hand': '액체 손',
        'Liquid Rage': '분노한 액체',
        'Living Liquid': '살아있는 액체',
        'Perfect Alexander': '완전체 알렉산더',
        'Plasmasphere': '플라스마 구체',
        'Steam Chakram': '증기 차크람',
      },
      'replaceText': {
        ' Players Remaining': '명 남음',
        '(?<! )Repentance': '참회의 방',
        '(?<! )Sacrament': '십자 성례',
        '--Cruise Chaser Invincible--': '--순항추격기 무적--',
        '--adds targetable--': '--쫄 타겟 가능--',
        '--alex untargetable--': '--알렉산더 타겟 불가능--',
        '/Stillness': '정지 명령',
        'Aetheroplasm': '에테르 폭뢰',
        'Almighty Judgment': '성스러운 대심판',
        'Alpha Sword': '알파검',
        'Apocalyptic Ray': '파멸 계시',
        'Cascade': '폭포수',
        'Chakrams': '차크람',
        'Chastening Heat': '신벌의 열선',
        'Collective Reprobation': '무리 단죄',
        'Crashing Wave': '충격의 파도',
        'Divine Judgment': '신성한 심판',
        'Divine Spear': '신성한 불꽃',
        'Double Rocket Punch': '양손 로켓 주먹',
        'Down for the Count': '넉다운',
        'Drainage': '하수로',
        'Earth Missile': '대지 미사일',
        'Embolus': '응고체',
        'Enumeration': '계산',
        'Eternal Darkness': '암흑의 운명',
        'Exhaust': '오염 증기',
        'Fate Calibration': '미래 확정',
        'Fate Projection': '미래 관측',
        'Fate: ': '미래: ',
        'Final Sentence': '사형 판결',
        'Flarethrower': '대화염방사',
        'Fluid Strike': '유체 강타',
        'Fluid Swing': '유체 타격',
        'Gavel': '최후의 심판: 폐정',
        'Hand of Pain': '고통의 손길',
        'Hand of Prayer/Parting': '기도/작별의 손길',
        'Hawk Blaster': '호크 블래스터',
        'Hidden Minefield': '은폐 지뢰 살포',
        'Inception Formation': '시공 잠행 대형',
        'Inception(?! )': '시공 잠행',
        'Incinerating Heat': '정화의 열선',
        'Individual Reprobation': '개체 단죄',
        'Individual/': '개체/',
        'Irresistible Grace': '연대 형벌',
        'J Jump': '정의의 점프',
        'J Kick': '정의의 발차기',
        'J Storm': '정의의 폭풍',
        'Judgment Crystal': '심판의 결정체',
        'Judgment Nisi': '임시처분',
        'Limit Cut': '리미터 해제',
        'Link-Up': '시스템 연결',
        'Liquid Gaol': '액체 감옥',
        'Mega Holy': '메가 홀리',
        'Missile Command': '미사일 전탄 발사',
        'Obloquy, Solidarity and 3x Severity': '오명/연대/중벌의 심판',
        'Optical Sight': '조준',
        'Ordained Capital Punishment': '가중 처벌',
        'Ordained Motion': '행동 명령',
        'Ordained Punishment': '처벌',
        'Ordained Stillness': '정지 명령',
        'Photon': '광자',
        'Pressurize': '수압 충전',
        'Propeller Wind': '추진 돌풍',
        'Protean Wave': '변화의 물결',
        'Punishing Wave': '응징의 파도',
        'Radiant Sacrament': '원형 성례',
        'Rage Wave': '물기둥 물결',
        'Reveal': '예고',
        'Sacrament x3': '십자 성례 x3',
        'Sluice': '봇물',
        'Spin Crusher': '회전 분쇄',
        'Splash': '물장구',
        'Summon Alexander': '알렉산더 소환',
        'Super Blassty Charge': '슈퍼 블래스티 돌진',
        'Super Jump': '슈퍼 점프',
        'Surety and Severity': '서약/중벌의 심판',
        'Surety and Solidarity': '서약/연대의 심판',
        'Surety, Solidarity and Severity': '서약/중벌/연대의 심판',
        'Temporal Interference': '시공 간섭',
        'Temporal Prison': '시간의 감옥',
        'Temporal Stasis': '시간 정지',
        'The Final Word': '확정 판결',
        'True Heart': '진심',
        'Void Of Repentance': '참회의 방',
        'Water and Thunder': '물+번개 징',
        'Waves': '충격파',
        'Whirlwind': '회오리바람',
        'Wormhole Formation': '차원 단절 대형',
      },
      '~effectNames': {
        'Aggravated Assault': '확정 판결: 가중형',
        'Compressed Lightning': '번개속성 압축',
        'Compressed Water': '물속성 압축',
        'Contact Regulation Ordained': '접촉보호 명령',
        'Devotion': '에기의 가호',
        'Down for the Count': '넉다운',
        'Embolden': '성원',
        'Enigma Codex': '에니그마 코덱스',
        'Escape Detection Ordained': '도망감찰 명령',
        'Final Decree Nisi α': '최후의 임시 판결 α',
        'Final Decree Nisi β': '최후의 임시 판결 β',
        'Final Decree Nisi γ': '최후의 임시 판결 γ',
        'Final Decree Nisi δ': '최후의 임시 판결 δ',
        'Final Judgment: Decree Nisi α': '최후의 심판: 임시 판결 α',
        'Final Judgment: Decree Nisi β': '최후의 심판: 임시 판결 β',
        'Final Judgment: Decree Nisi γ': '최후의 심판: 임시 판결 γ',
        'Final Judgment: Decree Nisi δ': '최후의 심판: 임시 판결 δ',
        'Final Judgment: Penalty III': '최후의 심판: 약화 3',
        'Final Word: Contact Prohibition': '확정 판결: 접촉금지 명령',
        'Final Word: Contact Regulation': '확정 판결: 접촉보호 명령',
        'Final Word: Escape Detection': '확정 판결: 도망감찰 명령',
        'Final Word: Escape Prohibition': '확정 판결: 도망금지 명령',
        'Fire Resistance Down II': '불속성 저항 감소[강]',
        'Heavy': '과중력',
        'House Arrest': '확정 판결: 강제접근 명령',
        'Lightning Resistance Down II': '번개속성 저항 감소[강]',
        'Luminous Aetheroplasm': '빛의 폭뢰',
        'Magic Vulnerability Up': '받는 마법 피해량 증가',
        'Physical Vulnerability Up': '받는 물리 피해량 증가',
        'Restraining Order': '확정 판결: 접근금지 명령',
        'Shared Sentence': '확정 판결: 단체형',
        'Summon Order': '기술 실행 대기 1',
        'Summon Order III': '기술 실행 대기 3',
        'Temporal Displacement': '시간 정지',
        'Throttle': '질식',
        'Water Resistance Down II': '물속성 저항 감소[강]',
      },
    },
  ],
}];
