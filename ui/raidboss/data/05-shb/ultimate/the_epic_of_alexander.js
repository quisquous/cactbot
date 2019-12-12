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

[{
  zoneRegex: /^The Epic [Oo]f Alexander \(Ultimate\)$/,
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
      suppressSeconds: 1,
      preRun: function(data) {
        data.swingCount = (data.swingCount || 0) + 1;
      },
      alertText: function(data) {
        let multipleSwings = data.swingCount == 2 || data.swingCount == 3;
        if (data.role == 'healer') {
          if (multipleSwings) {
            return {
              en: 'Tank Busters',
              de: 'Tank buster',
              fr: 'Tank busters',
              ja: 'タンクバスター',
            };
          }
          if (data.liquidTank) {
            return {
              en: 'Tank Buster on ' + data.ShortName(data.liquidTank),
              de: 'Tank buster',
              fr: 'Tank buster',
              ja: 'タンクバスター',
            };
          }
          return {
            en: 'Tank Buster',
            de: 'Tank buster',
            fr: 'Tank buster',
            ja: 'タンクバスター',
          };
        }

        if (data.role == 'tank') {
          if (data.me == data.handTank && multipleSwings || data.me == data.liquidTank) {
            return {
              en: 'Tank Buster on YOU',
              de: 'Tankbuster auf DIR',
              ja: '自分にタンクバスター',
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
      suppressSeconds: 1,
      condition: function(data) {
        return data.role == 'tank';
      },
      infoText: {
        en: 'Move Bosses',
        de: 'Bosse bewegen',
      },
    },
    {
      id: 'TEA J Kick',
      regex: /J Kick/,
      beforeSeconds: 5,
      suppressSeconds: 1,
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
        ja: 'AoE',
        cn: 'AOE',
      },
    },
    {
      id: 'TEA Water and Thunder',
      regex: /Water and Thunder/,
      beforeSeconds: 3,
      infoText: {
        en: 'Water/Thunder in 3',
        de: 'Wasser/Blitz in 3',
      },
    },
    {
      id: 'TEA Flarethrower',
      regex: /Flarethrower/,
      beforeSeconds: 8,
      condition: function(data) {
        return data.me == data.bruteTank && data.phase == 'brute';
      },
      alertText: {
        en: 'Face Brute Towards Water',
        de: 'Drehe Brute zum Wasser',
      },
    },
    {
      id: 'TEA Propeller Wind',
      regex: /Propeller Wind/,
      beforeSeconds: 15,
      infoText: {
        en: 'Hide Behind Ice',
        de: 'Hinter dem Eis verstecken',
      },
    },
    {
      id: 'TEA Final Nisi Pass',
      regex: /Propeller Wind/,
      durationSeconds: 14,
      beforeSeconds: 15,
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
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] == data.puddle)
          return;
        return {
          en: 'Puddle #' + matches[1],
          de: 'Fläche #' + matches[1],
        };
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
          };
        }
      },
    },
  ],
  triggers: [
    {
      id: 'TEA Brute Phase',
      regex: Regexes.startsUsing({ source: 'Brute Justice', id: '483E', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Brutalus', id: '483E', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Justicier', id: '483E', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ブルートジャスティス', id: '483E', capture: false }),
      run: function(data) {
        data.phase = 'brute';
        data.resetState = function() {
          this.enumerations = [];
          this.buffMap = {};
          this.tetherBois = {};
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
        }[data.lang];

        // Convenience function called for third and fourth nisi passes.
        data.namedNisiPass = (data) => {
          // error?
          if (!(data.me in data.finalNisiMap)) {
            return {
              en: 'Get Final Nisi (?)',
              de: 'Nehme letzten Nisi (?)',
            };
          }

          if (data.me in data.nisiMap) {
            // If you have nisi, you need to pass it to the person who has that final
            // and who doesn't have nisi.
            let myNisi = data.nisiMap[data.me];
            let names = Object.keys(data.finalNisiMap);
            names = names.filter((x) => data.finalNisiMap[x] == myNisi && x != data.me);

            let namesWithoutNisi = names.filter((x) => !(x in data.nisiMap));
            if (namesWithoutNisi.length == 0) {
              // Still give something useful here.
              return {
                en: 'Pass ' + myNisi + ' Nisi',
                de: 'Gebe ' + myNisi + ' Nisi',
              };
            }
            // Hopefully there's only one here, but you never know.
            return {
              en: 'Pass ' + data.nisiNames[myNisi] + ' to ' +
                  namesWithoutNisi.map((x) => data.ShortName(x)).join(', or '),
              de: 'Gebe ' + data.nisiNames[myNisi] + ' zu ' +
                  namesWithoutNisi.map((x) => data.ShortName(x)).join(', oder '),
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
            };
          }
          return {
            en: 'Get ' + data.nisiNames[myNisi] + ' from ' + data.ShortName(names[0]),
            de: 'Nimm ' + data.nisiNames[myNisi] + ' von ' + data.ShortName(names[0]),
          };
        };
      },
    },
    {
      id: 'TEA Temporal Phase',
      regex: Regexes.startsUsing({ source: 'Alexander Prime', id: '485A', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Prim-Alexander', id: '485A', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Primo-Alexander', id: '485A', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'アレキサンダー・プライム', id: '485A', capture: false }),
      run: function(data) {
        data.phase = 'temporal';
        data.resetState();
      },
    },
    {
      id: 'TEA Inception Phase',
      regex: Regexes.startsUsing({ source: 'Alexander Prime', id: '486F', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Prim-Alexander', id: '486F', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Primo-Alexander', id: '486F', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'アレキサンダー・プライム', id: '486F', capture: false }),
      run: function(data) {
        data.phase = 'inception';
        data.resetState();
      },
    },
    {
      id: 'TEA Wormhole Phase',
      regex: Regexes.startsUsing({ source: 'Alexander Prime', id: '486E', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Prim-Alexander', id: '486E', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Primo-Alexander', id: '486E', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'アレキサンダー・プライム', id: '486E', capture: false }),
      run: function(data) {
        data.phase = 'wormhole';
        data.resetState();
      },
    },
    {
      id: 'TEA Fate Alpha Phase',
      regex: Regexes.startsUsing({ source: 'Perfect Alexander', id: '487B', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Perfekter Alexander', id: '487B', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Alexander parfait', id: '487B', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'パーフェクト・アレキサンダー', id: '487B', capture: false }),
      run: function(data) {
        data.phase = 'alpha';
        data.resetState();
      },
    },
    {
      id: 'TEA Fate Beta Phase',
      regex: Regexes.startsUsing({ source: 'Perfect Alexander', id: '4B13', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Perfekter Alexander', id: '4B13', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Alexander parfait', id: '4B13', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'パーフェクト・アレキサンダー', id: '4B13', capture: false }),
      run: function(data) {
        data.phase = 'beta';
        data.resetState();
      },
    },
    {
      id: 'TEA Liquid Tank',
      regex: Regexes.abilityFull({ source: 'Living Liquid', id: '4978' }),
      regexDe: Regexes.abilityFull({ source: 'belebtes Wasser', id: '4978' }),
      regexFr: Regexes.abilityFull({ source: 'liquide vivant', id: '4978' }),
      regexJa: Regexes.abilityFull({ source: 'リビングリキッド', id: '4978' }),
      run: function(data, matches) {
        data.liquidTank = matches.target;
      },
    },
    {
      id: 'TEA Hand Tank',
      regex: Regexes.abilityFull({ source: 'Liquid Hand', id: '4979' }),
      regexDe: Regexes.abilityFull({ source: 'belebte Hand', id: '4979' }),
      regexFr: Regexes.abilityFull({ source: 'membre liquide', id: '4979' }),
      regexJa: Regexes.abilityFull({ source: 'リキッドハンド', id: '4979' }),
      run: function(data, matches) {
        data.handTank = matches.target;
      },
    },
    {
      id: 'TEA Cruise Chaser Tank',
      regex: Regexes.abilityFull({ source: 'Cruise Chaser', id: '497A' }),
      regexDe: Regexes.abilityFull({ source: 'Chaser-Mecha', id: '497A' }),
      regexFr: Regexes.abilityFull({ source: 'Croiseur-chasseur', id: '497A' }),
      regexJa: Regexes.abilityFull({ source: 'クルーズチェイサー', id: '497A' }),
      run: function(data, matches) {
        data.cruiseTank = matches.target;
      },
    },
    {
      id: 'TEA Brute Tank',
      regex: Regexes.abilityFull({ source: 'Brute Justice', id: '497B' }),
      regexDe: Regexes.abilityFull({ source: 'Brutalus', id: '497B' }),
      regexFr: Regexes.abilityFull({ source: 'Justicier', id: '497B' }),
      regexJa: Regexes.abilityFull({ source: 'ブルートジャスティス', id: '497B' }),
      run: function(data, matches) {
        data.bruteTank = matches.target;
      },
    },
    {
      id: 'TEA Cascade',
      regex: Regexes.startsUsing({ source: 'Living Liquid', id: '4826', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'belebtes Wasser', id: '4826', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'liquide vivant', id: '4826', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'リビングリキッド', id: '4826', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'TEA Protean Wave',
      regex: Regexes.startsUsing({ source: 'Living Liquid', id: '4822', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'belebtes Wasser', id: '4822', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'liquide vivant', id: '4822', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'リビングリキッド', id: '4822', capture: false }),
      infoText: {
        en: 'Protean Wave',
        de: 'Proteische Welle',
        ja: 'プロティアン',
      },
    },
    {
      id: 'TEA Drainage Tether',
      regex: Regexes.tether({ source: 'Liquid Rage', id: '0003' }),
      regexDe: Regexes.tether({ source: 'levitierte Rage', id: '0003' }),
      regexFr: Regexes.tether({ source: 'furie liquide', id: '0003' }),
      regexJa: Regexes.tether({ source: 'リキッドレイジ', id: '0003' }),
      condition: Conditions.targetIsYou(),
      // Even if folks have the right tethers, this happens repeatedly.
      suppressSeconds: 5,
      alertText: {
        en: 'Drainage tether on YOU',
        ja: '自分にドレナージ',
        de: 'Entwässerungsverbindung auf DIR',
      },
    },
    {
      id: 'TEA Hand of Pain 5',
      regex: Regexes.startsUsing({ source: 'Liquid Hand', id: '482D', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'belebte Hand', id: '482D', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'membre liquide', id: '482D', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'リキッドハンド', id: '482D', capture: false }),
      preRun: function(data) {
        data.handOfPainCount = (data.handOfPainCount || 0) + 1;
      },
      infoText: function(data) {
        if (data.handOfPainCount == 5) {
          return {
            en: 'Focus Living Liquid',
            de: 'belebtes Wasser fokussieren',
            ja: 'リビングリキッドを攻撃',
          };
        }
      },
    },
    {
      id: 'TEA Throttle',
      regex: Regexes.gainsEffect({ effect: 'Throttle', capture: false }),
      regexDe: Regexes.gainsEffect({ effect: 'Erstickung', capture: false }),
      regexFr: Regexes.gainsEffect({ effect: 'Suffocation', capture: false }),
      regexJa: Regexes.gainsEffect({ effect: '窒息', capture: false }),
      condition: function(data) {
        return data.CanCleanse();
      },
      suppressSeconds: 1,
      infoText: {
        en: 'Cleanse Throttle',
        de: 'Erstickung entfernen',
        ja: '窒息',
      },
    },
    {
      // Applies to both limit cuts.
      id: 'TEA Limit Cut Numbers',
      regex: Regexes.headMarker({ id: '00(?:4F|5[0-6])' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      preRun: function(data, matches) {
        data.limitCutNumber = {
          '004F': 1,
          '0050': 2,
          '0051': 3,
          '0052': 4,
          '0053': 5,
          '0054': 6,
          '0055': 7,
          '0056': 8,
        }[matches.id];
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
          }[matches.id];
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
          }[matches.id];
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
        };
      },
    },
    {
      // Applies to both limit cuts.
      id: 'TEA Limit Cut Knockback',
      regex: Regexes.headMarker({ id: '00(?:4F|5[0-6])' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      // This gives a warning within 5 seconds, so you can hit arm's length.
      delaySeconds: function(data) {
        return data.limitCutDelay - 5;
      },
      alertText: function(data, matches) {
        let isOddNumber = parseInt(matches.id, 16) & 1 == 1;
        if (data.phase == 'wormhole') {
          if (isOddNumber) {
            return {
              en: 'Knockback Cleave; Face Outside',
              de: 'Rückstoß Cleave; nach Außen schauen',
            };
          }
          return {
            en: 'Knockback Charge; Face Middle',
            de: 'Rückstoß Charge; zur Mitte schauen',
          };
        }
        if (isOddNumber) {
          return {
            en: 'Knockback Cleave on YOU',
            de: 'Rückstoß Cleave auf DIR',
            fr: 'Cleave sur vous',
            ja: '自分にクリーブ',
          };
        }
        return {
          en: 'Knockback',
          de: 'Rückstoß',
          fr: 'Poussée',
          cn: '击退',
          ja: 'ノックバック',
        };
      },
    },
    {
      id: 'TEA Chakrams Out',
      // Link Up
      regex: Regexes.ability({ source: 'Brute Justice', id: '483F', capture: false }),
      regexDe: Regexes.ability({ source: 'Brutalus', id: '483F', capture: false }),
      regexFr: Regexes.ability({ source: 'Justicier', id: '483F', capture: false }),
      regexJa: Regexes.ability({ source: 'ブルートジャスティス', id: '483F', capture: false }),
      condition: function(data) {
        return data.phase == 'brute';
      },
      alertText: {
        en: 'Out, Dodge Chakrams',
        de: 'Raus, Chakrams ausweichen',
        ja: '外へ',
      },
    },
    {
      id: 'TEA Chakrams In',
      // Optical Sight
      regex: Regexes.ability({ source: 'Cruise Chaser', id: '482F', capture: false }),
      regexDe: Regexes.ability({ source: 'Chaser-Mecha', id: '482F', capture: false }),
      regexFr: Regexes.ability({ source: 'Croiseur-chasseur', id: '482F', capture: false }),
      regexJa: Regexes.ability({ source: 'クルーズチェイサー', id: '482F', capture: false }),
      suppressSeconds: 1,
      alertText: {
        en: 'Run In',
        de: 'Rein',
        ja: '中へ',
      },
    },
    {
      id: 'TEA Whirlwind',
      regex: Regexes.startsUsing({ source: 'Cruise Chaser', id: '49C2', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Chaser-Mecha', id: '49C2', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Croiseur-chasseur', id: '49C2', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'クルーズチェイサー', id: '49C2', capture: false }),
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      response: Responses.aoe(),
    },
    {
      id: 'TEA Spin Crusher',
      regex: Regexes.startsUsing({ source: 'Cruise Chaser', id: '4A72', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Chaser-Mecha', id: '4A72', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Croiseur-chasseur', id: '4A72', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'クルーズチェイサー', id: '4A72', capture: false }),
      // Nobody should be in front of cruise chaser but the tank, and this is close to
      // water thunder handling, so only tell the tank.
      condition: function(data) {
        return data.me == data.cruiseTank;
      },
      alertText: {
        en: 'Dodge Spin Crusher',
        de: 'Rotorbrecher ausweichen',
      },
    },
    {
      id: 'TEA Ice Marker',
      regex: Regexes.headMarker({ id: '0043' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alarmText: {
        en: 'Freeze Tornado',
        de: 'Tornado einfrieren',
      },
    },
    {
      id: 'TEA Hidden Minefield',
      regex: Regexes.ability({ source: 'Brute Justice', id: '4851', capture: false }),
      regexDe: Regexes.ability({ source: 'Brutalus', id: '4851', capture: false }),
      regexFr: Regexes.ability({ source: 'Justicier', id: '4851', capture: false }),
      regexJa: Regexes.ability({ source: 'ブルートジャスティス', id: '4851', capture: false }),
      condition: function(data) {
        return data.role == 'tank';
      },
      suppressSeconds: 1,
      infoText: {
        en: 'Mines',
        de: 'Minen',
      },
    },
    {
      id: 'TEA Enumeration YOU',
      regex: Regexes.headMarker({ id: '0041' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Enumeration on YOU',
        de: 'Enumeration auf DIR',
      },
    },
    {
      id: 'TEA Enumeration Everyone',
      regex: Regexes.headMarker({ id: '0041' }),
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
        };
      },
    },
    {
      id: 'TEA Limit Cut Shield',
      regex: Regexes.ability({ source: 'Cruise Chaser', id: '4833', capture: false }),
      regexDe: Regexes.ability({ source: 'Chaser-Mecha', id: '4833', capture: false }),
      regexFr: Regexes.ability({ source: 'Croiseur-chasseur', id: '4833', capture: false }),
      regexJa: Regexes.ability({ source: 'クルーズチェイサー', id: '4833', capture: false }),
      delaySeconds: 2,
      infoText: {
        en: 'Break Shield From Front',
        de: 'Schild von Vorne zerstören',
      },
    },
    {
      id: 'TEA Compressed Water Initial',
      regex: Regexes.gainsEffect({ effect: 'Compressed Water' }),
      regexDe: Regexes.gainsEffect({ effect: 'Wasserkompression' }),
      regexFr: Regexes.gainsEffect({ effect: 'Compression aqueuse' }),
      regexJa: Regexes.gainsEffect({ effect: '水属性圧縮' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Water on YOU',
        de: 'Wasser auf DIR',
        ja: '自分に水',
      },
    },
    {
      id: 'TEA Compressed Water Explode',
      regex: Regexes.gainsEffect({ effect: 'Compressed Water' }),
      regexDe: Regexes.gainsEffect({ effect: 'Wasserkompression' }),
      regexFr: Regexes.gainsEffect({ effect: 'Compression aqueuse' }),
      regexJa: Regexes.gainsEffect({ effect: '水属性圧縮' }),
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
        };
      },
    },
    {
      id: 'TEA Compressed Lightning Initial',
      regex: Regexes.gainsEffect({ effect: 'Compressed Lightning' }),
      regexDe: Regexes.gainsEffect({ effect: 'Blitzkompression' }),
      regexFr: Regexes.gainsEffect({ effect: 'Compression électrique' }),
      regexJa: Regexes.gainsEffect({ effect: '雷属性圧縮' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Lightning on YOU',
        de: 'Blitz auf DIR',
        ja: '自分に雷',
      },
    },
    {
      id: 'TEA Compressed Lightning Explode',
      regex: Regexes.gainsEffect({ effect: 'Compressed Lightning' }),
      regexDe: Regexes.gainsEffect({ effect: 'Blitzkompression' }),
      regexFr: Regexes.gainsEffect({ effect: 'Compression électrique' }),
      regexJa: Regexes.gainsEffect({ effect: '雷属性圧縮' }),
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
        };
      },
    },
    {
      id: 'TEA Pass Nisi 1',
      // 4 seconds after Photon cast starts.
      regex: Regexes.startsUsing({ source: 'Cruise Chaser', id: '4836', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Chaser-Mecha', id: '4836', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Croiseur-chasseur', id: '4836', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'クルーズチェイサー', id: '4836', capture: false }),
      delaySeconds: 4,
      suppressSeconds: 10000,
      alertText: {
        en: 'Pass Nisi',
        de: 'Nisi weitergeben',
        ja: 'ナイサイ渡して',
      },
    },
    {
      id: 'TEA Pass Nisi 2',
      // 1 second after enumeration.
      // TODO: find a startsUsing instead of matching an action.
      regex: Regexes.ability({ source: 'Brute Justice', id: '4850', capture: false }),
      regexDe: Regexes.ability({ source: 'Brutalus', id: '4850', capture: false }),
      regexFr: Regexes.ability({ source: 'Justicier', id: '4850', capture: false }),
      regexJa: Regexes.ability({ source: 'ブルートジャスティス', id: '4850', capture: false }),
      // Ignore enumerations later in the fight.
      condition: (data) => data.phase == 'brute',
      delaySeconds: 1,
      suppressSeconds: 1,
      alertText: {
        en: 'Pass Nisi',
        de: 'Nisi weitergeben',
        ja: 'ナイサイ渡して',
      },
    },
    {
      id: 'TEA Pass Nisi 3',
      // 9 seconds after Flarethrower cast starts.
      regex: Regexes.startsUsing({ source: 'Brute Justice', id: '4845', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Brutalus', id: '4845', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Justicier', id: '4845', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ブルートジャスティス', id: '4845', capture: false }),
      delaySeconds: 9,
      alertText: function(data) {
        return data.namedNisiPass(data);
      },
    },
    {
      id: 'TEA Decree Nisi Gain',
      regex: Regexes.gainsEffect({ effect: 'Final Decree Nisi (?<sym>[ΑΒΓΔαβγδ])' }),
      regexDe: Regexes.gainsEffect({ effect: 'Letztes Vorläufiges Urteil (?<sym>[ΑΒΓΔαβγδ])' }),
      regexFr: Regexes.gainsEffect({ effect: 'Peine provisoire (?<sym>[ΑΒΓΔαβγδ]) ultime' }),
      regexJa: Regexes.gainsEffect({ effect: '最後の仮判決(?<sym>[ΑΒΓΔαβγδ])' }),
      run: function(data, matches) {
        let num = 'ΑΒΓΔαβγδ'.indexOf(matches.sym) % 4;
        data.nisiMap = data.nisiMap || {};
        data.nisiMap[matches.target] = num;
      },
    },
    {
      id: 'TEA Decree Nisi Lose',
      regex: Regexes.losesEffect({ effect: 'Final Decree Nisi (?<sym>[ΑΒΓΔαβγδ])' }),
      regexDe: Regexes.losesEffect({ effect: 'Letztes Vorläufiges Urteil (?<sym>[ΑΒΓΔαβγδ])' }),
      regexFr: Regexes.losesEffect({ effect: 'Peine provisoire (?<sym>[ΑΒΓΔαβγδ]) ultime' }),
      regexJa: Regexes.losesEffect({ effect: '最後の仮判決(?<sym>[ΑΒΓΔαβγδ])' }),
      run: function(data, matches) {
        data.nisiMap = data.nisiMap || {};
        delete data.nisiMap[matches.target];
      },
    },
    {
      id: 'TEA Final Judgment Nisi Gain',
      regex: Regexes.gainsEffect({
        effect: 'Final Judgment: Decree Nisi (?<sym>[ΑΒΓΔαβγδ])',
      }),
      regexDe: Regexes.gainsEffect({
        effect: 'Prozess über Vorläufiges Urteil (?<sym>[ΑΒΓΔαβγδ])',
      }),
      regexFr: Regexes.gainsEffect({
        effect: 'Injonction: peine provisoire (?<sym>[ΑΒΓΔαβγδ])',
      }),
      regexJa: Regexes.gainsEffect({
        effect: '最後の審判：仮判決(?<sym>[ΑΒΓΔαβγδ])',
      }),
      run: function(data, matches) {
        let num = 'ΑΒΓΔαβγδ'.indexOf(matches.sym) % 4;
        data.finalNisiMap = data.finalNisiMap || {};
        data.finalNisiMap[matches.target] = num;
      },
    },
    {
      id: 'TEA Final Judgment Nisi Verdict',
      regex: Regexes.gainsEffect({
        effect: 'Final Judgment: Decree Nisi (?<sym>[ΑΒΓΔαβγδ])',
      }),
      regexDe: Regexes.gainsEffect({
        effect: 'Prozess über Vorläufiges Urteil (?<sym>[ΑΒΓΔαβγδ])',
      }),
      regexFr: Regexes.gainsEffect({
        effect: 'Injonction: peine provisoire (?<sym>[ΑΒΓΔαβγδ])',
      }),
      regexJa: Regexes.gainsEffect({
        effect: '最後の審判：仮判決(?<sym>[ΑΒΓΔαβγδ])',
      }),
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
        };
      },
    },
    {
      id: 'TEA Gavel',
      regex: Regexes.startsUsing({ source: 'Brute Justice', id: '483C', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Brutalus', id: '483C', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Justicier', id: '483C', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ブルートジャスティス', id: '483C', capture: false }),
      run: function(data) {
        data.seenGavel = true;
      },
    },
    {
      id: 'TEA Double Rocket Punch',
      regex: Regexes.startsUsing({ source: 'Brute Justice', id: '4847' }),
      regexDe: Regexes.startsUsing({ source: 'Brutalus', id: '4847' }),
      regexFr: Regexes.startsUsing({ source: 'Justicier', id: '4847' }),
      regexJa: Regexes.startsUsing({ source: 'ブルートジャスティス', id: '4847' }),
      alertText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Shared Tankbuster on YOU',
            de: 'geteilter Tankbuster auf DIR',
          };
        }
        if (data.role == 'tank' || data.role == 'healer') {
          return {
            en: 'Shared Tankbuster on ' + data.ShortName(matches.target),
            de: 'geteilter Tankbuster on ' + data.ShortName(matches.target),
          };
        }
      },
      infoText: function(data) {
        if (data.role == 'tank' || data.role == 'healer')
          return;
        return {
          en: 'Bait Super Jump?',
          de: 'Supersprung anlocken?',
        };
      },
    },
    {
      id: 'TEA Brute Ray',
      regex: Regexes.ability({ source: 'Brute Justice', id: '484A', capture: false }),
      regexDe: Regexes.ability({ source: 'Brutalus', id: '484A', capture: false }),
      regexFr: Regexes.ability({ source: 'Justicier', id: '484A', capture: false }),
      regexJa: Regexes.ability({ source: 'ブルートジャスティス', id: '484A', capture: false }),
      condition: (data) => data.phase == 'brute',
      infoText: {
        en: 'avoid ray',
        de: 'Strahl ausweichen',
      },
    },
    {
      id: 'TEA Buff Collection',
      regex: Regexes.gainsEffect({
        effect: [
          'Restraining Order',
          'House Arrest',
          'Aggravated Assault',
          'Shared Sentence',
        ],
      }),
      regexDe: Regexes.gainsEffect({
        effect: [
          'Urteil: Näherungsverbot',
          'Urteil: Freiheitsstrafe',
          'Urteil: Erschwerte Strafe',
          'Urteil: Kollektivstrafe',
        ],
      }),
      regexFr: Regexes.gainsEffect({
        effect: [
          'Jugement: éloignement',
          'Jugement: Rapprochement',
          'Jugement: Peine Sévère',
          'Jugement: Peine Collective',
        ],
      }),
      regexJa: Regexes.gainsEffect({
        effect: [
          '確定判決：接近禁止命令',
          '確定判決：接近強制命令',
          '確定判決：加重罰',
          '確定判決：集団罰',
        ],
      }),
      run: function(data, matches) {
        data.buffMap = data.buffMap || {};
        data.buffMap[matches.target] = matches.effect;
      },
    },
    {
      id: 'TEA Temporal Stasis No Buff',
      regex: Regexes.gainsEffect({ effect: 'Restraining Order', capture: false }),
      regexDe: Regexes.gainsEffect({ effect: 'Urteil: Näherungsverbot', capture: false }),
      regexFr: Regexes.gainsEffect({ effect: 'Jugement: éloignement', capture: false }),
      regexJa: Regexes.gainsEffect({ effect: '確定判決：接近禁止命令', capture: false }),
      delaySeconds: 0.5,
      suppressSeconds: 1,
      condition: function(data) {
        return data.phase == 'temporal' || data.phase == 'inception';
      },
      infoText: function(data) {
        if (data.me in data.buffMap)
          return;
        return {
          en: 'No Debuff',
          de: 'Kein Debuff',
        };
      },
    },
    {
      id: 'TEA Restraining Order',
      regex: Regexes.gainsEffect({ effect: 'Restraining Order' }),
      regexDe: Regexes.gainsEffect({ effect: 'Urteil: Näherungsverbot' }),
      regexFr: Regexes.gainsEffect({ effect: 'Jugement: éloignement' }),
      regexJa: Regexes.gainsEffect({ effect: '確定判決：接近禁止命令' }),
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
      },
    },
    {
      id: 'TEA House Arrest',
      regex: Regexes.gainsEffect({ effect: 'House Arrest' }),
      regexDe: Regexes.gainsEffect({ effect: 'Urteil: Freiheitsstrafe' }),
      regexFr: Regexes.gainsEffect({ effect: 'Jugement: Rapprochement' }),
      regexJa: Regexes.gainsEffect({ effect: '確定判決：接近強制命令' }),
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
      },
    },
    {
      id: 'TEA Shared Sentence',
      regex: Regexes.gainsEffect({ effect: 'Shared Sentence' }),
      regexDe: Regexes.gainsEffect({ effect: 'Urteil: Kollektivstrafe' }),
      regexFr: Regexes.gainsEffect({ effect: 'Jugement: Peine Collective' }),
      regexJa: Regexes.gainsEffect({ effect: '確定判決：集団罰' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Shared Sentence',
        de: 'Urteil: Kollektivstrafe',
      },
    },
    {
      id: 'TEA Aggravated Assault',
      regex: Regexes.gainsEffect({ effect: 'Aggravated Assault' }),
      regexDe: Regexes.gainsEffect({ effect: 'Urteil: Erschwerte Strafe' }),
      regexFr: Regexes.gainsEffect({ effect: 'Jugement: Peine Sévère' }),
      regexJa: Regexes.gainsEffect({ effect: '確定判決：加重罰' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alarmText: {
        en: 'Thunder',
        de: 'Blitz',
      },
    },
    {
      id: 'TEA Chastening Heat',
      regex: Regexes.startsUsing({ source: 'Alexander Prime', id: '4A80' }),
      regexDe: Regexes.startsUsing({ source: 'Prim-Alexander', id: '4A80' }),
      regexFr: Regexes.startsUsing({ source: 'Primo-Alexander', id: '4A80' }),
      regexJa: Regexes.startsUsing({ source: 'アレキサンダー・プライム', id: '4A80' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
            ja: '自分にタンクバスター',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches.target),
            de: 'Tankbuster auf ' + data.ShortName(matches.target),
            fr: 'Tankbuster sur ' + data.ShortName(matches.target),
            ja: data.ShortName(matches.target) + 'にタンクバスター',
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
        };
      },
    },
    {
      id: 'TEA Judgment Crystal',
      regex: Regexes.headMarker({ id: '0060' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Crystal on YOU',
        de: 'Kristall auf DIR',
      },
    },
    {
      id: 'TEA Judgment Crystal Placement',
      regex: Regexes.ability({ source: 'Alexander Prime', id: '485C', capture: false }),
      regexDe: Regexes.ability({ source: 'Prim-Alexander', id: '485C', capture: false }),
      regexFr: Regexes.ability({ source: 'Primo-Alexander', id: '485C', capture: false }),
      regexJa: Regexes.ability({ source: 'アレキサンダー・プライム', id: '485C', capture: false }),
      suppressSeconds: 100,
      infoText: {
        en: 'Get Away From Crystals',
        de: 'Geh weg vom Kristall',
      },
    },
    {
      id: 'TEA Terashatter Flarethrower',
      regex: Regexes.ability({ source: 'Judgment Crystal', id: '4A88', capture: false }),
      regexDe: Regexes.ability({ source: 'Urteilskristall', id: '4A88', capture: false }),
      regexFr: Regexes.ability({ source: 'Cristal du jugement', id: '4A88', capture: false }),
      regexJa: Regexes.ability({ source: '審判の結晶', id: '4A88', capture: false }),
      suppressSeconds: 100,
      delaySeconds: 1,
      infoText: {
        en: 'Bait Brute\'s Flarethrower',
        de: 'Locke Brute\'s Großflammenwerfer',
      },
    },
    {
      id: 'TEA Enigma Codex',
      regex: Regexes.gainsEffect({ effect: 'Enigma Codex' }),
      regexDe: Regexes.gainsEffect({ effect: 'Enigma-Kodex' }),
      regexFr: Regexes.gainsEffect({ effect: 'Enigma Codex' }),
      regexJa: Regexes.gainsEffect({ effect: 'エニグマ・コーデックス' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      sound: 'Long',
    },
    {
      id: 'TEA Inception Alpha Sword',
      // Sacrament cast.
      regex: Regexes.ability({ source: 'Alexander Prime', id: '485F', capture: false }),
      regexDe: Regexes.ability({ source: 'Prim-Alexander', id: '485F', capture: false }),
      regexFr: Regexes.ability({ source: 'Primo-Alexander', id: '485F', capture: false }),
      regexJa: Regexes.ability({ source: 'アレキサンダー・プライム', id: '485F', capture: false }),
      alertText: function(data) {
        // TODO: we could probably determine where this is.
        if (data.role == 'tank') {
          return {
            en: 'Bait Jump Opposite Brute?',
            de: 'Locke Sprung gegenüber von Brute?',
          };
        }
      },
      infoText: function(data) {
        if (data.role != 'tank') {
          return {
            en: 'Bait Cruise Chaser Sword?',
            de: 'Locke Chaser-Mecha Schwert?',
          };
        }
      },
    },
    {
      id: 'TEA Wormhole',
      regex: Regexes.ability({ source: 'Alexander Prime', id: '486E', capture: false }),
      regexDe: Regexes.ability({ source: 'Prim-Alexander', id: '486E', capture: false }),
      regexFr: Regexes.ability({ source: 'Primo-Alexander', id: '486E', capture: false }),
      regexJa: Regexes.ability({ source: 'アレキサンダー・プライム', id: '486E', capture: false }),
      infoText: function(data) {
        if (data.options.cactbotWormholeStrat) {
          return {
            en: 'Bait Chakrams mid; Look opposite Alex',
            de: 'Locke Chakrams mittig; schau weg von Alex',
          };
        }
        return {
          en: 'Bait Chakrams',
        };
      },
    },
    {
      id: 'TEA Wormhole Link Up',
      regex: Regexes.ability({ source: 'Brute Justice', id: '483F', capture: false }),
      regexDe: Regexes.ability({ source: 'Brutalus', id: '483F', capture: false }),
      regexFr: Regexes.ability({ source: 'Justicier', id: '483F', capture: false }),
      regexJa: Regexes.ability({ source: 'ブルートジャスティス', id: '483F', capture: false }),
      condition: (data) => data.phase == 'wormhole',
      alertText: {
        en: 'Dodge Chakrams',
        de: 'Chakrams ausweichen',
      },
    },
    {
      id: 'TEA Cactbot Wormhole Strat',
      regex: Regexes.headMarker({ id: '00(?:4F|5[0-6])' }),
      condition: function(data, matches) {
        if (!data.options.cactbotWormholeStrat)
          return false;
        return data.phase == 'wormhole' && data.me == matches.target;
      },
      durationSeconds: 10,
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
        }[matches.id];
      },
      infoText: function(data, matches) {
        // Initial directions.
        // TODO: we could figure out which robot was left and right based
        // on chakrams, and call that out here too instead of just saying "Robot".
        return {
          '004F': {
            en: 'Left To Robot; Look Outside; 3rd Puddle',
            de: 'Links vom Robot; Nach Außen schauen; 3. Fläche',
          },
          '0050': {
            en: 'Back Right Opposite Robot; Look Middle; 3rd Puddle',
            de: 'Hinten Rechts gegenüber vom Robot; zur Mitte schauen; 3. Fläche',
          },
          '0051': {
            en: 'Back Left Opposite Robot; No Puddle',
            de: 'Hinten Links gegenüber vom Robot; keine Fläche',
          },
          '0052': {
            en: 'Right To Robot; No puddle',
            de: 'Rechts vom Robot; keine Fläche',
          },
          '0053': {
            en: 'Left Robot Side -> 1st Puddle',
            de: 'Linke Robot Seite -> 1. Fläche',
          },
          '0054': {
            en: 'Right Robot Side -> 1st Puddle',
            de: 'Rechte Robot Seite -> 1. Fläche',
          },
          '0055': {
            en: 'Left Robot Side -> cardinal; 2nd Puddle',
            de: 'Linke Robot Seite -> cardinal; 2. Fläche',
          },
          '0056': {
            en: 'Right Robot Side -> cardinal; 2nd Puddle',
            de: 'Rechte Robot Seite -> cardinal; 2. Fläche',
          },
        }[matches.id];
      },
    },
    {
      id: 'TEA Cactbot Wormhole 4 Super Jump',
      regex: Regexes.ability({ source: 'Brute Justice', id: '484A', capture: false }),
      regexDe: Regexes.ability({ source: 'Brutalus', id: '484A', capture: false }),
      regexFr: Regexes.ability({ source: 'Justicier', id: '484A', capture: false }),
      regexJa: Regexes.ability({ source: 'ブルートジャスティス', id: '484A', capture: false }),
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
      },
    },
    {
      id: 'TEA Incinerating Heat',
      regex: Regexes.headMarker({ id: '005D', capture: false }),
      alertText: {
        en: 'Stack Middle',
        de: 'mittig sammeln',
      },
    },
    {
      id: 'TEA Mega Holy',
      regex: Regexes.startsUsing({ source: 'Alexander Prime', id: '4A83', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Prim-Alexander', id: '4A83', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Primo-Alexander', id: '4A83', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'アレキサンダー・プライム', id: '4A83', capture: false }),
      alertText: {
        en: 'big aoe',
        de: 'große AoE',
      },
    },
    {
      id: 'TEA Summon Alexander',
      regex: Regexes.startsUsing({ source: 'Alexander Prime', id: '4A55', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Prim-Alexander', id: '4A55', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Primo-Alexander', id: '4A55', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'アレキサンダー・プライム', id: '4A55', capture: false }),
      delaySeconds: 10.4,
      infoText: {
        en: 'Kill Cruise Chaser First',
        de: 'Chaser-Mecha zuerst besiegen',
      },
    },
    {
      id: 'TEA Divine Judgment',
      regex: Regexes.ability({ source: 'Alexander Prime', id: '4879', capture: false }),
      regexDe: Regexes.ability({ source: 'Prim-Alexander', id: '4879', capture: false }),
      regexFr: Regexes.ability({ source: 'Primo-Alexander', id: '4879', capture: false }),
      regexJa: Regexes.ability({ source: 'アレキサンダー・プライム', id: '4879', capture: false }),
      condition: function(data) {
        return data.role == 'tank';
      },
      delaySeconds: 6,
      alarmText: {
        en: 'TANK LB!!',
        de: 'TANK LB!!',
      },
    },
    {
      id: 'TEA Perfect Optical Sight Spread',
      regex: Regexes.startsUsing({ source: 'Perfect Alexander', id: '488A', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Perfekter Alexander', id: '488A', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Alexander parfait', id: '488A', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'パーフェクト・アレキサンダー', id: '488A', capture: false }),
      infoText: {
        en: 'Spread',
        de: 'Verteilen',
        fr: 'Dispersez-vous',
        ja: '散開',
        cn: '分散',
      },
    },
    {
      id: 'TEA Perfect Optical Sight Stack',
      regex: Regexes.headMarker({ id: '003E' }),
      preRun: function(data, matches) {
        data.opticalStack = data.opticalStack || [];
        data.opticalStack.push(matches.target);
      },
      alertText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Stack on YOU',
            de: 'Sammeln auf DIR',
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
        };
      },
    },
    {
      id: 'TEA Ordained Motion',
      regex: Regexes.startsUsing({ source: 'Perfect Alexander', id: '487E', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Perfekter Alexander', id: '487E', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Alexander parfait', id: '487E', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'パーフェクト・アレキサンダー', id: '487E', capture: false }),
      durationSeconds: 4,
      alertText: {
        en: 'Keep Moving',
        de: 'weiter bewegen',
      },
    },
    {
      id: 'TEA Ordained Stillness',
      regex: Regexes.startsUsing({ source: 'Perfect Alexander', id: '487F', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Perfekter Alexander', id: '487F', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Alexander parfait', id: '487F', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'パーフェクト・アレキサンダー', id: '487F', capture: false }),
      alarmText: {
        en: 'STOP LITERALLY EVERYTHING',
        de: 'STOP WIRKLICH ALLES',
      },
    },
    {
      id: 'TEA Contact Prohibition',
      regex: Regexes.gainsEffect({ effect: 'Final Word: Contact Prohibition' }),
      regexDe: Regexes.gainsEffect({ effect: 'Urteil: Kontaktverbot' }),
      regexFr: Regexes.gainsEffect({ effect: 'Jugement: contact prohibé' }),
      regexJa: Regexes.gainsEffect({ effect: '確定判決：接触禁止命令' }),
      condition: (data, matches) => data.me == matches.target,
      infoText: {
        en: 'Orange (Attract)',
        de: 'Orange (Anziehen)',
      },
    },
    {
      id: 'TEA Contact Regulation',
      regex: Regexes.gainsEffect({ effect: 'Final Word: Contact Regulation' }),
      regexDe: Regexes.gainsEffect({ effect: 'Urteil: Kontakt-Order' }),
      regexFr: Regexes.gainsEffect({ effect: 'Jugement: contact forcé' }),
      regexJa: Regexes.gainsEffect({ effect: '確定判決：接触保護命令' }),
      condition: (data, matches) => data.me == matches.target,
      alarmText: {
        en: 'Get Away',
        de: 'Geh Weg',
      },
      infoText: {
        en: 'Orange Bait',
        de: 'Orange locken',
      },
    },
    {
      id: 'TEA Escape Prohibition',
      regex: Regexes.gainsEffect({ effect: 'Final Word: Contact Regulation' }),
      regexDe: Regexes.gainsEffect({ effect: 'Urteil: Kontakt-Order' }),
      regexFr: Regexes.gainsEffect({ effect: 'Jugement: contact forcé' }),
      regexJa: Regexes.gainsEffect({ effect: '確定判決：接触保護命令' }),
      condition: (data, matches) => data.me == matches.target,
      infoText: {
        en: 'Purple (Repel)',
        de: 'Lila (Abstoßen)',
      },
    },
    {
      id: 'TEA Escape Regulation',
      regex: Regexes.gainsEffect({ effect: 'Final Word: Escape Regulation' }),
      condition: (data, matches) => data.me == matches.target,
      alertText: {
        en: 'Be In Back Of Group',
        de: 'Hinter der Gruppe sein',
      },
      infoText: {
        en: 'Purple Bait',
        de: 'Lila locken',
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
        };
        let kSeverity = {
          en: 'Severity: avoid shared stack',
          de: 'Erschwertes: geteilter stack ausweichen',
        };

        let kUnknown;
        if (sortedNames.length >= 5) {
          kUnknown = {
            en: 'No clone: probably no debuff + stack?',
            de: 'keine Klone: warscheinlich kein debuff + stack?',
          };
        } else {
          kUnknown = {
            en: 'No clone: ???',
            de: 'keine Klone: ???',
          };
        }

        data.alphaInstructions = {
          '-1': kUnknown,
          '0': {
            en: 'Shared Sentence: stack',
            de: 'Urteil Kollektivstrafe: stack',
          },
          '1': {
            en: 'Defamation on YOU',
            de: 'Ehrenstrafe aud DIR',
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
      suppressSeconds: 10,
      delaySeconds: 2,
      durationSeconds: 28,
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
      regexDe: Regexes.ability({ source: 'Perfekter Alexander', id: '4B0D', capture: false }),
      regexFr: Regexes.ability({ source: 'Alexander parfait', id: '4B0D', capture: false }),
      regexJa: Regexes.ability({ source: 'パーフェクト・アレキサンダー', id: '4B0D', capture: false }),
      suppressSeconds: 20,
      infoText: {
        en: 'Motion first',
        de: 'Bewegungsbefehl zuerst',
      },
      run: function(data) {
        data.firstAlphaOrdained = 'motion';
      },
    },
    {
      id: 'TEA Alpha Ordained Stillness 1',
      regex: Regexes.ability({ source: 'Perfect Alexander', id: '4B0E', capture: false }),
      regexDe: Regexes.ability({ source: 'Perfekter Alexander', id: '4B0E', capture: false }),
      regexFr: Regexes.ability({ source: 'Alexander parfait', id: '4B0E', capture: false }),
      regexJa: Regexes.ability({ source: 'パーフェクト・アレキサンダー', id: '4B0E', capture: false }),
      suppressSeconds: 20,
      infoText: {
        en: 'Stillness first',
        de: 'Stillstandsbefehl zuerst',
      },
      run: function(data) {
        data.firstAlphaOrdained = 'stillness';
      },
    },
    {
      id: 'TEA Alpha Ordained Motion 2',
      regex: Regexes.abilityFull({ source: 'Perfect Alexander', id: '4899', capture: false }),
      regexDe: Regexes.abilityFull({ source: 'Perfekter Alexander', id: '4899', capture: false }),
      regexFr: Regexes.abilityFull({ source: 'Alexander parfait', id: '4899', capture: false }),
      regexJa: Regexes.abilityFull({ source: 'パーフェクト・アレキサンダー', id: '4899', capture: false }),
      suppressSeconds: 20,
      infoText: {
        en: 'Motion second',
        de: 'Bewegungsbefehl als Zweites',
      },
      run: function(data) {
        data.secondAlphaOrdained = 'motion';
      },
    },
    {
      id: 'TEA Alpha Ordained Stillness 2',
      regex: Regexes.abilityFull({ source: 'Perfect Alexander', id: '489A', capture: false }),
      regexDe: Regexes.abilityFull({ source: 'Perfekter Alexander', id: '489A', capture: false }),
      regexFr: Regexes.abilityFull({ source: 'Alexander parfait', id: '489A', capture: false }),
      regexJa: Regexes.abilityFull({ source: 'パーフェクト・アレキサンダー', id: '489A', capture: false }),
      suppressSeconds: 20,
      infoText: {
        en: 'Stillness second',
        de: 'Stillstandsbefehl als Zweites',
      },
      run: function(data) {
        data.secondAlphaOrdained = 'stillness';
      },
    },
    {
      id: 'TEA Alpha Safe Spot',
      // The non-safe alexanders use 489F.
      regex: Regexes.abilityFull({ source: 'Perfect Alexander', id: '49AA' }),
      regexDe: Regexes.abilityFull({ source: 'Perfekter Alexander', id: '49AA' }),
      regexFr: Regexes.abilityFull({ source: 'Alexander parfait', id: '49AA' }),
      regexJa: Regexes.abilityFull({ source: 'パーフェクト・アレキサンダー', id: '49AA' }),
      durationSeconds: 10,
      infoText: function(data, matches) {
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

        return [
          {
            en: '#1 Safe (NW / SE)',
            de: '#1 Sicher (NW / SO)',
          },
          {
            en: '#2 Safe (NNW / SSE)',
            de: '#2 Sicher (NNW / SSO)',
          },
          {
            en: '#3 Safe (NNE / SSW)',
            de: '#3 Sicher (NNO / SSW)',
          },
          {
            en: '#4 Safe (NE / SW)',
            de: '#4 Sicher (NO / SW)',
          },
        ][idx];
      },
    },
    {
      id: 'TEA Alpha Resolve First Motion',
      regex: Regexes.ability({ source: 'Perfect Alexander', id: '487C', capture: false }),
      regexDe: Regexes.ability({ source: 'Perfekter Alexander', id: '487C', capture: false }),
      regexFr: Regexes.ability({ source: 'Alexander parfait', id: '487C', capture: false }),
      regexJa: Regexes.ability({ source: 'パーフェクト・アレキサンダー', id: '487C', capture: false }),
      // 5 seconds until mechanic
      delaySeconds: 2.2,
      alertText: function(data) {
        if (data.firstAlphaOrdained == 'motion') {
          return {
            en: 'Move First',
            de: 'Zuerst bewegen',
          };
        }
        return {
          en: 'Stillness First',
          de: 'Zuerst Stillstehen',
        };
      },
    },
    {
      id: 'TEA Alpha Resolve Second Motion',
      regex: Regexes.ability({ source: 'Perfect Alexander', id: '487C', capture: false }),
      regexDe: Regexes.ability({ source: 'Perfekter Alexander', id: '487C', capture: false }),
      regexFr: Regexes.ability({ source: 'Alexander parfait', id: '487C', capture: false }),
      regexJa: Regexes.ability({ source: 'パーフェクト・アレキサンダー', id: '487C', capture: false }),
      // ~4 seconds until mechanic (to avoid overlapping with first)
      delaySeconds: 7.2,
      alertText: function(data) {
        if (data.secondAlphaOrdained == 'motion') {
          return {
            en: 'Keep Moving',
            de: 'weiter bewegen',
          };
        }
        return {
          en: 'Stop Everything',
          de: 'Alles stoppen',
        };
      },
    },
    {
      id: 'TEA Beta Instructions',
      regex: Regexes.tether({ id: '0062', capture: false }),
      condition: (data) => data.phase == 'beta',
      suppressSeconds: 10,
      delaySeconds: 1,
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
          },
          '0': {
            en: 'Purple Bait: bait E',
            de: 'Lila Köder: locke O',
          },
          '1': {
            en: 'Orange Bait: bait N',
            de: 'Orange Köder: locke N',
          },
          '2': {
            en: 'Purple, no tether: E->W',
            de: 'Lila, keine Verbindung: O->W',
          },
          // This person also has the shared sentence.
          '3': {
            en: 'Orange, no tether: E->N',
            de: 'Orange, keine Verbindung: O->N',
          },
          '4': {
            en: 'Purple, close tether: E->N',
            de: 'Lila, nahe Verbindungr: O->N',
          },
          '5': {
            en: 'Orange, close tether: E->N',
            de: 'Orange, nahe Verbindung: O->N',
          },
          '6': {
            en: 'Purple, far tether: E->S',
            de: 'Lila, entfernte Verbindung: O->S',
          },
          '7': {
            en: 'Orange, far tether: E->N',
            de: 'Orange, entfernte Verbindung: O->N',
          },
        }[sortedNames.indexOf(data.me)];
      },
    },
    {
      id: 'TEA Beta Instructions Callout',
      regex: Regexes.tether({ id: '0062', capture: false }),
      condition: (data) => data.phase == 'beta',
      suppressSeconds: 10,
      delaySeconds: 2,
      durationSeconds: 35,
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
      regexDe: Regexes.abilityFull({ source: 'Perfekter Alexander', id: '489E' }),
      regexFr: Regexes.abilityFull({ source: 'Alexander parfait', id: '489E' }),
      regexJa: Regexes.abilityFull({ source: 'パーフェクト・アレキサンダー', id: '489E' }),
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
          'N': {
            en: 'Sacrament North',
            de: 'Sacrement Norden',
          },
          'E': {
            en: 'Sacrament East',
            de: 'Sacrement Osten',
          },
          'S': {
            en: 'Sacrament South',
            de: 'Sacrement Süden',
          },
          'W': {
            en: 'Sacrament West',
            de: 'Sacrement Westen',
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
      regexDe: Regexes.abilityFull({ source: 'Perfekter Alexander', id: '48A0', capture: false }),
      regexFr: Regexes.abilityFull({ source: 'Alexander parfait', id: '48A0', capture: false }),
      regexJa: Regexes.abilityFull({ source: 'パーフェクト・アレキサンダー', id: '48A0', capture: false }),
      infoText: {
        en: 'Optical Spread',
        de: 'Visier verteilen',
      },
      run: function(data) {
        data.betaIsOpticalStack = false;
      },
    },
    {
      id: 'TEA Beta Optical Stack',
      regex: Regexes.abilityFull({ source: 'Perfect Alexander', id: '48A1', capture: false }),
      regexDe: Regexes.abilityFull({ source: 'Perfekter Alexander', id: '48A1', capture: false }),
      regexFr: Regexes.abilityFull({ source: 'Alexander parfait', id: '48A1', capture: false }),
      regexJa: Regexes.abilityFull({ source: 'パーフェクト・アレキサンダー', id: '48A1', capture: false }),
      infoText: {
        en: 'Optical Stack',
        de: 'Visier sammeln',
      },
      run: function(data) {
        data.betaIsOpticalStack = true;
      },
    },
    {
      id: 'TEA Beta Optical Final',
      regex: Regexes.ability({ source: 'Perfect Alexander', id: '4B14', capture: false }),
      regexDe: Regexes.ability({ source: 'Perfekter Alexander', id: '4B14', capture: false }),
      regexFr: Regexes.ability({ source: 'Alexander parfait', id: '4B14', capture: false }),
      regexJa: Regexes.ability({ source: 'パーフェクト・アレキサンダー', id: '4B14', capture: false }),
      delaySeconds: 12.2,
      alertText: function(data) {
        if (!data.betaIsOpticalStack) {
          return {
            en: 'Optical Spread',
            de: 'Visier verteilen',
          };
        }
        if (data.betaBait.includes(data.me)) {
          return {
            en: 'Optical Stack on YOU',
            de: 'Visier sammeln auf DIR',
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
          };
        }
        let names = data.betaBait.map((x) => data.ShortName(x)).sort();
        return {
          en: 'Optical Stack (' + names.join(', ') + ')',
          de: 'Visier sammeln (' + names.join(', ') + ')',
        };
      },
    },
    {
      id: 'TEA Beta Radiant Final',
      regex: Regexes.ability({ source: 'Perfect Alexander', id: '4B14', capture: false }),
      regexDe: Regexes.ability({ source: 'Perfekter Alexander', id: '4B14', capture: false }),
      regexFr: Regexes.ability({ source: 'Alexander parfait', id: '4B14', capture: false }),
      regexJa: Regexes.ability({ source: 'パーフェクト・アレキサンダー', id: '4B14', capture: false }),
      delaySeconds: 16,
      alertText: function(data) {
        return data.radiantText;
      },
    },
    {
      id: 'TEA Ordained Punishment',
      regex: Regexes.startsUsing({ source: 'Perfect Alexander', id: '4891' }),
      regexDe: Regexes.startsUsing({ source: 'Perfekter Alexander', id: '4891' }),
      regexFr: Regexes.startsUsing({ source: 'Alexander parfait', id: '4891' }),
      regexJa: Regexes.startsUsing({ source: 'パーフェクト・アレキサンダー', id: '4891' }),
      alarmText: function(data, matches) {
        if (data.role == 'tank' && data.me != matches.target) {
          return {
            en: 'Tank Swap!',
            de: 'Tank Wechsel!',
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
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches.target),
            de: 'Tankbuster auf ' + data.ShortName(matches.target),
            fr: 'Tankbuster sur ' + data.ShortName(matches.target),
            ja: data.ShortName(matches.target) + 'にタンクバスター',
          };
        }
      },
    },
    {
      id: 'TEA Trine Get Middle',
      regex: Regexes.ability({ source: 'Perfect Alexander', id: '488E', capture: false }),
      regexDe: Regexes.ability({ source: 'Perfekter Alexander', id: '488E', capture: false }),
      regexFr: Regexes.ability({ source: 'Alexander parfait', id: '488E', capture: false }),
      regexJa: Regexes.ability({ source: 'パーフェクト・アレキサンダー', id: '488E', capture: false }),
      alertText: {
        en: 'Stack Middle for Trine',
        de: 'Mittig sammeln für Trine',
      },
    },
    {
      id: 'TEA Trine Initial',
      regex: Regexes.abilityFull({ source: 'Perfect Alexander', id: '488F', x: '100', y: '(?:92|100|108)' }),
      regexDe: Regexes.abilityFull({ source: 'Perfekter Alexander', id: '488F', x: '100', y: '(?:92|100|108)' }),
      regexFr: Regexes.abilityFull({ source: 'Alexander parfait', id: '488F', x: '100', y: '(?:92|100|108)' }),
      regexJa: Regexes.abilityFull({ source: 'パーフェクト・アレキサンダー', id: '488F', x: '100', y: '(?:92|100|108)' }),
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
      regexDe: Regexes.abilityFull({ source: 'Perfekter Alexander', id: '4890', capture: false }),
      regexFr: Regexes.abilityFull({ source: 'Alexander parfait', id: '4890', capture: false }),
      regexJa: Regexes.abilityFull({ source: 'パーフェクト・アレキサンダー', id: '4890', capture: false }),
      suppressSeconds: 15,
      alertText: function(data) {
        return data.secondTrineResponse;
      },
    },
    {
      id: 'TEA Irresistible Grace',
      regex: Regexes.startsUsing({ source: 'Perfect Alexander', id: '4894' }),
      regexDe: Regexes.startsUsing({ source: 'Perfekter Alexander', id: '4894' }),
      regexFr: Regexes.startsUsing({ source: 'Alexander parfait', id: '4894' }),
      regexJa: Regexes.startsUsing({ source: 'パーフェクト・アレキサンダー', id: '4894' }),
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
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches.target),
          de: 'Auf ' + data.ShortName(matches.target) + ' sammeln',
          fr: 'Package sur ' + data.ShortName(matches.target),
          cn: '靠近 ' + data.ShortName(matches.target) + '集合',
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
      'replaceSync': {
        '(?<! )Alexander(?! )': 'Alexander',
        'Alexander Prime': 'Prim-Alexander',
        'Brute Justice': 'Brutalus',
        'Cruise Chaser': 'Chaser-Mecha',
        'Engage!': 'Start!',
        'Jagd Doll': 'Jagdpuppe',
        'Liquid Hand': 'belebte Hand',
        'Living Liquid': 'belebtes Wasser',
        'Liquid Rage': 'levitierte Rage',
        'Perfect Alexander': 'Perfekter Alexander',
        'Plasmasphere': 'Plasmasphäre',
        'Steam Chakram': 'Dampf-Chakram',
      },
      'replaceText': {
        '--Cruise Chaser Invincible--': '--Chaser-Mecha unverwundbar--',
        '--adds targetable--': '--adds anvisierbar--',
        '--alex untargetable--': '--alex nich anvisierbar--',
        '--targetable--': '--anvisierbar--',
        '--untargetable--': '--nich anvisierbar--',
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
        'Inception': 'Raumzeit-Eingriff',
        'Inception Formation': 'Raumzeit-Eingriffsformation',
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
        'Middle Blaster': 'Middle Blaster', // FIXME
        'Missile Command': 'Raketenkommando',
        'Obloquy': 'Obloquy', // FIXME
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
        'Rage Wave': 'Rage Wave', // FIXME
        'Repentance': 'Reue',
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
        'Water Resistance Down II': 'Wasserresistenz - (stark)',
        'Throttle': 'Erstickung',
        'Temporal Displacement': 'Zeitstillstand',
        'Summon Order III': 'Egi-Attacke III',
        'Summon Order': 'Egi-Attacke I',
        'Shared Sentence': 'Urteil: Kollektivstrafe',
        'Restraining Order': 'Urteil: Näherungsverbot',
        'Physical Vulnerability Up': 'Erhöhte Physische Verwundbarkeit',
        'Magic Vulnerability Up': 'Erhöhte Magie-Verwundbarkeit',
        'Luminous Aetheroplasm': 'Luminiszentes Ätheroplasma',
        'Lightning Resistance Down II': 'Blitzresistenz - (stark)',
        'House Arrest': 'Urteil: Freiheitsstrafe',
        'Heavy': 'Gewicht',
        'Fire Resistance Down II': 'Feuerresistenz - (stark)',
        'Final Word: Escape Prohibition': 'Urteil: Fluchtverbot',
        'Final Word: Escape Detection': 'Urteil: Fluchtbeobachtung',
        'Final Word: Contact Regulation': 'Urteil: Kontakt-Order',
        'Final Word: Contact Prohibition': 'Urteil: Kontaktverbot',
        'Final Judgment: Penalty III': 'Prozess über Schwächung 3',
        'Final Judgment: Decree Nisi δ': 'Prozess über Vorläufiges Urteil δ',
        'Final Judgment: Decree Nisi γ': 'Prozess über Vorläufiges Urteil γ',
        'Final Judgment: Decree Nisi β': 'Prozess über Vorläufiges Urteil β',
        'Final Judgment: Decree Nisi α': 'Prozess über Vorläufiges Urteil α',
        'Final Decree Nisi δ': 'Letztes Vorläufiges Urteil δ',
        'Final Decree Nisi γ': 'Letztes Vorläufiges Urteil γ',
        'Final Decree Nisi β': 'Letztes Vorläufiges Urteil β',
        'Final Decree Nisi α': 'Letztes Vorläufiges Urteil α',
        'Escape Detection Ordained': 'Fluchtbeobachtung',
        'Enigma Codex': 'Enigma-Kodex',
        'Embolden': 'Ermutigen',
        'Down for the Count': 'Am Boden',
        'Devotion': 'Hingabe',
        'Contact Regulation Ordained': 'Kontakt-Order',
        'Compressed Water': 'Wasserkompression',
        'Compressed Lightning': 'Blitzkompression',
        'Aggravated Assault': 'Urteil: Erschwerte Strafe',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        '(?<! )Alexander(?! )': 'Alexander', // FIXME
        'Alexander Prime': 'Primo-Alexander',
        'Brute Justice': 'Justicier',
        'Cruise Chaser': 'Croiseur-chasseur',
        'Engage!': 'À l\'attaque!',
        'Jagd Doll': 'poupée jagd',
        'Liquid Hand': 'membre liquide',
        'Liquid Rage': 'furie liquide',
        'Living Liquid': 'liquide vivant',
        'Perfect Alexander': 'Alexander parfait',
        'Plasmasphere': 'sphère de plasma',
        'Steam Chakram': 'chakram de vapeur',
      },
      'replaceText': {
        '--Cruise Chaser Invincible--': '--Cruise Chaser Invincible--', // FIXME
        '--adds targetable--': '--adds targetable--', // FIXME
        '--alex untargetable--': '--alex untargetable--', // FIXME
        '--targetable--': '--Ciblable--',
        '--untargetable--': '--Impossible à cibler--',
        'Aetheroplasm': 'Éthéroplasma',
        'Almighty Judgment': 'Sentence divine',
        'Alpha Sword': 'Épée alpha',
        'Apocalyptic Ray': 'Rayon apocalyptique',
        'Cascade': 'Cascade',
        'Chakrams': 'Chakrams', // FIXME
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
        'Fate Calibration': 'Fate Calibration', // FIXME
        'Fate Projection': 'Fate Projection', // FIXME
        'Final Sentence': 'Peine capitale',
        'Flarethrower': 'Lance-brasiers',
        'Fluid Strike': 'Frappe fluide',
        'Fluid Swing': 'Coup fluide',
        'Gavel': 'Conclusion de procès',
        'Hand of Pain': 'Main de douleur',
        'Hand of Prayer': 'Main de prière',
        'Hawk Blaster': 'Canon faucon',
        'Hidden Minefield': 'Champ de mines caché',
        'Inception': 'Commencement',
        'Inception Formation': 'Marche du commencement',
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
        'Middle Blaster': 'Middle Blaster', // FIXME
        'Missile Command': 'Commande missile',
        'Obloquy': 'Obloquy', // FIXME
        'Optical Sight': 'Visée optique',
        'Ordained Capital Punishment': 'Châtiment exemplaire',
        'Ordained Motion': 'Défense de s\'arrêter',
        'Ordained Punishment': 'Châtiment',
        'Ordained Stillness': 'Défense de bouger',
        'Photon': 'Photon',
        'Players Remaining': 'Players Remaining', // FIXME
        'Pressurize': 'Repressurisation',
        'Propeller Wind': 'Vent turbine',
        'Protean Wave': 'Vague inconstante',
        'Punishing Wave': 'Vague punitive',
        'Rage Wave': 'Rage Wave', // FIXME
        'Repentance': 'Repentir',
        'Sacrament': 'Sacrement',
        'Severity': 'Severity', // FIXME
        'Sluice': 'Éclusage',
        'Solidarity': 'Solidarity', // FIXME
        'Spin Crusher': 'Écrasement tournoyant',
        'Splash': 'Éclaboussement',
        'Summon Alexander': 'Invocation d\'Alexander',
        'Super Blassty Charge': 'Super charge Blassty',
        'Super Jump': 'Super saut',
        'Surety': 'Surety', // FIXME
        'Temporal Interference': 'Interférences spatio-temporelles',
        'Temporal Prison': 'Geôle temporelle',
        'Temporal Stasis': 'Stase temporelle',
        'The Final Word': 'Prononcé du jugement',
        'Throttles': 'Throttles', // FIXME
        'Void Of Repentance': 'Vide du repentir',
        'Water and Thunder': 'Water and Thunder', // FIXME
        'Whirlwind': 'Tornade',
        'Wormhole Formation': 'Marche de la fracture dimensionnelle',
      },
      '~effectNames': {
        'Aggravated Assault': 'Jugement: peine sévère',
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
        'Final Judgment: Decree Nisi α': 'Injonction: peine provisoire α',
        'Final Judgment: Decree Nisi β': 'Injonction: peine provisoire β',
        'Final Judgment: Decree Nisi γ': 'Injonction: peine provisoire γ',
        'Final Judgment: Decree Nisi δ': 'Injonction: peine provisoire δ',
        'Final Judgment: Penalty III': 'Injonction: 3 altérations',
        'Final Word: Contact Prohibition': 'Jugement: contact prohibé',
        'Final Word: Contact Regulation': 'Jugement: contact forcé',
        'Final Word: Escape Detection': 'Jugement: fuite forcée',
        'Final Word: Escape Prohibition': 'Jugement: fuite prohibée',
        'Fire Resistance Down II': 'Résistance au feu réduite+',
        'Heavy': 'Pesanteur',
        'House Arrest': 'Jugement: rapprochement',
        'Lightning Resistance Down II': 'Résistance à la foudre réduite+',
        'Luminous Aetheroplasm': 'Éthéroplasma lumineux',
        'Magic Vulnerability Up': 'Vulnérabilité magique augmentée',
        'Physical Vulnerability Up': 'Vulnérabilité physique augmentée',
        'Restraining Order': 'Jugement: éloignement',
        'Shared Sentence': 'Jugement: peine collective',
        'Summon Order': 'Action en attente: 1',
        'Summon Order III': 'Actions en attente: 3',
        'Temporal Displacement': 'Stase temporelle',
        'Throttle': 'Cadence améliorée',
        'Water Resistance Down II': 'Résistance à l\'eau réduite+',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        '(?<! )Alexander(?! )': 'Alexander', // FIXME
        'Alexander Prime': 'アレキサンダー・プライム',
        'Brute Justice': 'ブルートジャスティス',
        'Cruise Chaser': 'クルーズチェイサー',
        'Engage!': '戦闘開始！',
        'Jagd Doll': 'ヤークトドール',
        'Liquid Hand': 'リキッドハンド',
        'Liquid Rage': 'リキッドレイジ',
        'Living Liquid': 'リビングリキッド',
        'Perfect Alexander': 'パーフェクト・アレキサンダー',
        'Plasmasphere': 'プラズマスフィア',
        'Steam Chakram': 'スチームチャクラム',
      },
      'replaceText': {
        '--Cruise Chaser Invincible--': '--Cruise Chaser Invincible--', // FIXME
        '--adds targetable--': '--adds targetable--', // FIXME
        '--alex untargetable--': '--alex untargetable--', // FIXME
        '--targetable--': '--targetable--',
        '--untargetable--': '--untargetable--',
        'Aetheroplasm': 'エーテル爆雷',
        'Almighty Judgment': '聖なる大審判',
        'Alpha Sword': 'アルファソード',
        'Apocalyptic Ray': 'アポカリプティクレイ',
        'Cascade': 'カスケード',
        'Chakrams': 'Chakrams', // FIXME
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
        'Fate Calibration': 'Fate Calibration', // FIXME
        'Fate Projection': 'Fate Projection', // FIXME
        'Final Sentence': '死刑判決',
        'Flarethrower': '大火炎放射',
        'Fluid Strike': 'フルイドストライク',
        'Fluid Swing': 'フルイドスイング',
        'Gavel': '最後の審判：結審',
        'Hand of Pain': 'ハンド・オブ・ペイン',
        'Hand of Prayer': 'ハンド・オブ・プレイヤー',
        'Hawk Blaster': 'ホークブラスター',
        'Hidden Minefield': 'ステルス地雷散布',
        'Inception': '時空潜行',
        'Inception Formation': '時空潜行のマーチ',
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
        'Middle Blaster': 'Middle Blaster', // FIXME
        'Missile Command': 'ミサイル全弾発射',
        'Obloquy': 'Obloquy', // FIXME
        'Optical Sight': '照準',
        'Ordained Capital Punishment': '加重誅罰',
        'Ordained Motion': '行動命令',
        'Ordained Punishment': '誅罰',
        'Ordained Stillness': '静止命令',
        'Photon': 'フォトン',
        'Players Remaining': 'Players Remaining', // FIXME
        'Pressurize': '水圧充填',
        'Propeller Wind': 'プロペラウィンド',
        'Protean Wave': 'プロティアンウェイブ',
        'Punishing Wave': 'パニッシュウェーブ',
        'Rage Wave': 'Rage Wave', // FIXME
        'Repentance': '罪の意識',
        'Sacrament': '十字の秘蹟',
        'Severity': 'Severity', // FIXME
        'Sluice': 'スルース',
        'Solidarity': 'Solidarity', // FIXME
        'Spin Crusher': 'スピンクラッシャー',
        'Splash': 'スプラッシュ',
        'Summon Alexander': 'アレキサンダー召喚',
        'Super Blassty Charge': 'スーパーブラスティ・チャージ',
        'Super Jump': 'スーパージャンプ',
        'Surety': 'Surety', // FIXME
        'Temporal Interference': '時空干渉',
        'Temporal Prison': '時の牢獄',
        'Temporal Stasis': '時間停止',
        'The Final Word': '確定判決',
        'Throttles': 'Throttles', // FIXME
        'Void Of Repentance': '懺悔の間',
        'Water and Thunder': 'Water and Thunder', // FIXME
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
  ],
}];
