import Conditions from '../../../../../resources/conditions.ts';
import NetRegexes from '../../../../../resources/netregexes.ts';
import Outputs from '../../../../../resources/outputs.ts';
import { Responses } from '../../../../../resources/responses.js';
import ZoneId from '../../../../../resources/zone_id.js';

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
const getHeadmarkerId = (data, matches) => {
  // If we naively just check !data.decOffset and leave it, it breaks if the first marker is 004F.
  // (This makes the offset 0, and !0 is true.)
  if (typeof data.decOffset === 'undefined') {
    // The first 1B marker in the encounter is Limit Cut 1, ID 004F.
    data.decOffset = parseInt(matches.id, 16) - 79;
  }
  // The leading zeroes are stripped when converting back to string, so we re-add them here.
  // Fortunately, we don't have to worry about whether or not this is robust,
  // since we know all the IDs that will be present in the encounter.
  return '00' + (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase();
};

const kDecreeNisi = ['8AE', '8AF', '859', '85A'];
const kFinalJudgementNisi = ['8B0', '8B1', '85B', '85C'];

const nisiToString = (nisiNum, output) => {
  // nisiNum is 0-3
  // assume output is using nisiTypes.
  switch (nisiNum) {
  case 0:
    return output.blueAlpha();
  case 1:
    return output.orangeBeta();
  case 2:
    return output.purpleGamma();
  case 3:
    return output.greenDelta();
  }
};

const ordainedOutputStrings = {
  combined: {
    en: '${action1}, ${action2}',
    de: '${action1}, ${action2}',
    fr: '${action1}, ${action2}',
    ja: '${action1}, ${action2}',
    cn: '${action1}, ${action2}',
    ko: '${action1}, ${action2}',
  },
  motionFirst: {
    en: 'Motion first',
    de: 'Bewegungsbefehl zuerst',
    fr: 'Mouvement en premier',
    ja: '最初は動く',
    cn: '首先移动',
    ko: '우선 움직이기',
  },
  stillnessFirst: {
    en: 'Stillness first',
    de: 'Stillstandsbefehl zuerst',
    fr: 'Immobilité en premier',
    ja: '最初は止まる',
    cn: '首先静止',
    ko: '우선 멈추기',
  },
  motionSecond: {
    en: 'Motion second',
    de: 'Bewegungsbefehl als Zweites',
    fr: 'Mouvement en deuxième',
    ja: '最後は動く',
    cn: '最后移动',
    ko: '마지막엔 움직이기',
  },
  stillnessSecond: {
    en: 'Stillness second',
    de: 'Stillstandsbefehl als Zweites',
    fr: 'Immobilité en deuxième',
    ja: '最後は止まる',
    cn: '最后静止',
    ko: '마지막엔 멈추기',
  },
};

const radiantOutputStrings = {
  north: {
    en: 'Sacrament North',
    de: 'Sacrement Norden',
    fr: 'Sacrement Nord',
    ja: '拝火は北',
    cn: '拜火 北',
    ko: '성례: 북',
  },
  east: {
    en: 'Sacrament East',
    de: 'Sacrement Osten',
    fr: 'Sacrement Est',
    ja: '拝火は東',
    cn: '拜火 东',
    ko: '성례: 동',
  },
  south: {
    en: 'Sacrament South',
    de: 'Sacrement Süden',
    fr: 'Sacrement Sud',
    ja: '拝火は南',
    cn: '拜火 南',
    ko: '성례: 남',
  },
  west: {
    en: 'Sacrament West',
    de: 'Sacrement Westen',
    fr: 'Sacrement Ouest',
    ja: '拝火は西',
    cn: '拜火 西',
    ko: '성례: 서',
  },
};

const nisiTypes = {
  blueAlpha: {
    en: 'Blue α',
    de: 'Blau α',
    fr: 'Bleu α',
    ja: '青 α',
    cn: '蓝 α',
    ko: '파랑 α',
  },
  orangeBeta: {
    en: 'Orange β',
    de: 'Orange β',
    fr: 'Orange β',
    ja: 'オレンジ β',
    cn: '橙 β',
    ko: '노랑 β',
  },
  purpleGamma: {
    en: 'Purple γ',
    de: 'Lila γ',
    fr: 'Violet γ',
    ja: '紫 γ',
    cn: '紫 γ',
    ko: '보라 γ',
  },
  greenDelta: {
    en: 'Green δ',
    de: 'Grün δ',
    fr: 'Vert δ',
    ja: '緑 δ',
    cn: '绿 δ',
    ko: '녹색 δ',
  },
};

const nisiPassOutputStrings = {
  ...nisiTypes,
  unknown: {
    en: 'Get Final Nisi (?)',
    de: 'Nehme letzten Nisi (?)',
    fr: 'Prenez Peine finale (?)',
    ja: '最後のナイサイを取得 (?)',
    cn: '取得最后审判 (?)',
    ko: '마지막 나이사이 받기 (?)',
  },
  passNisi: {
    en: 'Pass ${type} Nisi',
    de: 'Gebe ${type} Nisi',
    fr: 'Passez ${type} Peine',
    ja: '${type} を渡す',
    cn: '传递 ${type}审判',
    ko: '나이사이 건네기: ${type}',
  },
  passNisiTo: {
    en: 'Pass ${type} to ${players}',
    de: 'Gebe ${type} zu ${players}',
    fr: 'Passez ${type} à ${players}',
    ja: '${type} を ${players} に渡す',
    cn: '将 ${type} 传给 ${players}',
    ko: '나이사이 건네기: ${type} → ${players}',
  },
  getNisi: {
    en: 'Get ${type}',
    de: 'Nimm ${type}',
    fr: 'Prenez ${type}',
    ja: '${type} を取る',
    cn: '获得 ${type}',
    ko: '나이사이 가져오기: ${type}',
  },
  getNisiFrom: {
    en: 'Get ${type} from ${player}',
    de: 'Nimm ${type} von ${player}',
    fr: 'Prenez ${type} de ${player}',
    ja: '${player} から ${type} を取る',
    cn: '从 ${player}获得${type}',
    ko: '나이사이 가져오기: ${type} ← ${player}',
  },
};

// Convenience function called for third and fourth nisi passes.
const namedNisiPass = (data, output) => {
  // error?
  if (!(data.me in data.finalNisiMap))
    return output.unknown();

  if (data.me in data.nisiMap) {
    // If you have nisi, you need to pass it to the person who has that final
    // and who doesn't have nisi.
    const myNisi = data.nisiMap[data.me];
    let names = Object.keys(data.finalNisiMap);
    names = names.filter((x) => data.finalNisiMap[x] === myNisi && x !== data.me);

    let namesWithoutNisi = names.filter((x) => !(x in data.nisiMap));

    // If somehow it's the case that you've had SUCH a late pass that there
    // isn't anybody without without nisi, at least use the names of folks who
    // have the final debuff.
    if (namesWithoutNisi.length === 0)
      namesWithoutNisi = names;

    // If somehow still there's nobody, give a message so that it's not silent
    // but you're probably in trouble.
    if (namesWithoutNisi.length === 0)
      return output.passNisi({ type: nisiToString(myNisi, output) });

    // The common case.  Hopefully there's only one person in the names list,
    // but you never know.
    const players = namesWithoutNisi.map((x) => data.ShortName(x)).join(', ');
    return output.passNisiTo({ type: nisiToString(myNisi, output), players: players });
  }

  // If you don't have nisi, then you need to go get it from a person who does.
  const myNisi = data.finalNisiMap[data.me];
  let names = Object.keys(data.nisiMap);
  names = names.filter((x) => data.nisiMap[x] === myNisi);
  if (names.length === 0)
    return output.getNisi({ type: nisiToString(myNisi, output) });

  return output.getNisiFrom({
    type: nisiToString(myNisi, output),
    player: data.ShortName(names[0]),
  });
};

export default {
  zoneId: ZoneId.TheEpicOfAlexanderUltimate,
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
      alertText: function(data, _, output) {
        const multipleSwings = data.swingCount === 2 || data.swingCount === 3;
        if (data.role === 'healer') {
          if (multipleSwings)
            return output.tankBusters();

          if (data.liquidTank)
            return output.tankBusterOn({ player: data.ShortName(data.liquidTank) });

          return output.tankBuster();
        }

        if (data.role === 'tank') {
          if (data.me === data.handTank && multipleSwings || data.me === data.liquidTank)
            return output.tankBusterOnYou();
        }
      },
      infoText: function(data, _, output) {
        const multipleSwings = data.swingCount === 2 || data.swingCount === 3;
        if (data.role === 'healer')
          return;
        if (data.me === data.handTank && multipleSwings || data.me === data.liquidTank)
          return;
        return output.tankCleave();
      },
      outputStrings: {
        tankCleave: {
          en: 'Tank Cleave',
          de: 'Tank Cleave',
          fr: 'Tank Cleave',
          ja: 'タンククリーブ',
          cn: '坦克顺劈',
          ko: '광역 탱버',
        },
        tankBusters: {
          en: 'Tank Busters',
          de: 'Tank buster',
          fr: 'Tank busters',
          ja: 'タンクバスター',
          cn: '死刑',
          ko: '탱크버스터',
        },
        tankBusterOn: {
          en: 'Tank Buster on ${player}',
          de: 'Tank buster auf ${player}',
          fr: 'Tank buster sur ${player}',
          ja: '${player}にタンクバスター',
          cn: '死刑 点 ${player}',
          ko: '"${player}" 탱버',
        },
        tankBuster: {
          en: 'Tank Buster',
          de: 'Tank buster',
          fr: 'Tank buster',
          ja: 'タンクバスター',
          cn: '死刑',
          ko: '탱크버스터',
        },
        tankBusterOnYou: {
          en: 'Tank Buster on YOU',
          de: 'Tankbuster auf DIR',
          fr: 'Tank buster sur VOUS',
          ja: '自分にタンクバスター',
          cn: '死刑点名',
          ko: '나에게 탱크버스터',
        },
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
        return data.role === 'tank';
      },
      suppressSeconds: 1,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Move Bosses',
          de: 'Bosse bewegen',
          fr: 'Déplacez les Boss',
          ja: 'ボス動かして',
          cn: '移动Boss',
          ko: '보스 이동 주차',
        },
      },
    },
    {
      id: 'TEA J Kick',
      regex: /J Kick/,
      beforeSeconds: 5,
      condition: function(data) {
        return data.role === 'healer' || data.role === 'tank';
      },
      suppressSeconds: 1,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'aoe',
          de: 'AoE',
          fr: 'AoE',
          ja: 'AoE',
          cn: 'AOE',
          ko: '전체 공격',
        },
      },
    },
    {
      id: 'TEA Water and Thunder',
      regex: /Water and Thunder/,
      beforeSeconds: 3,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Water/Thunder in 3',
          de: 'Wasser/Blitz in 3',
          fr: 'Eau/Foudre dans 3s',
          ja: '水/雷まで3秒',
          cn: '3秒后水/雷',
          ko: '물/번개까지 3초',
        },
      },
    },
    {
      id: 'TEA Flarethrower',
      regex: /Flarethrower/,
      beforeSeconds: 8,
      condition: function(data) {
        return data.me === data.bruteTank && data.phase === 'brute';
      },
      suppressSeconds: 300,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Face Brute Towards Water',
          de: 'Drehe Brute zum Wasser',
          fr: 'Tournez Justicier vers l\'eau',
          ja: 'ジャスを竜巻に向ける',
          cn: '残暴正义号拉向水龙卷',
          ko: '심판자가 물을 바라보게 유도',
        },
      },
    },
    {
      id: 'TEA Propeller Wind',
      regex: /Propeller Wind/,
      beforeSeconds: 15,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Hide Behind Ice',
          de: 'Hinter dem Eis verstecken',
          fr: 'Cachez-vous derrière la glace',
          ja: '氷の後ろへ',
          cn: '冰块后躲避',
          ko: '얼음 뒤로 피하기',
        },
      },
    },
    {
      id: 'TEA Final Nisi Pass',
      regex: /Propeller Wind/,
      beforeSeconds: 15,
      durationSeconds: 14,
      alertText: function(data, _, output) {
        return namedNisiPass(data, output);
      },
      outputStrings: nisiPassOutputStrings,
    },
    {
      id: 'TEA Wormhole Puddle',
      regex: /Repentance ([1-3])/,
      beforeSeconds: 4,
      alertText: function(data, matches, output) {
        // data.puddle is set by 'TEA Wormhole TPS Strat' (or by some user trigger).
        // If that's disabled, this will still just call out puddle counts.
        if (matches[1] === data.puddle)
          return output.soakThisPuddle({ num: matches[1] });
      },
      infoText: function(data, matches, output) {
        if (matches[1] === data.puddle)
          return;
        return output.puddle({ num: matches[1] });
      },
      tts: function(data, matches, output) {
        if (matches[1] === data.puddle)
          return output.soakThisPuddleTTS();
      },
      outputStrings: {
        puddle: {
          en: 'Puddle #${num}',
          de: 'Fläche #${num}',
          fr: 'Zone au sol #${num}',
          ja: '懺悔 #${num}',
          cn: '水圈 #${num}',
          ko: '참회 #${num}',
        },
        soakThisPuddle: {
          en: 'Soak This Puddle (#${num})',
          de: 'Fläche nehmen (#${num})',
          fr: 'Absorbez cette zone au sol (#${num})',
          ja: '懺悔踏む (#${num})',
          cn: '踩水圈 (#${num})',
          ko: '참회 밟기 (#${num})',
        },
        soakThisPuddleTTS: {
          en: 'Soak This Puddle',
          de: 'Fläche nehmen',
          fr: 'Absorbez cette zone au sol',
          ja: '沼踏んで',
          cn: '踩水圈',
          ko: '웅덩이 밟기',
        },
      },
    },
    {
      // Shared magic tankbuster windup to non-capital Ordained Punishment.
      // Do this from timeline as you can have more than three seconds
      // to move and stack the tanks.
      id: 'TEA Ordained Capital Punishment',
      regex: /^Ordained Capital Punishment$/,
      beforeSeconds: 6,
      condition: (data) => data.role === 'tank' || data.role === 'healer',
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Shared Tankbuster',
          de: 'geteilter Tankbuster',
          fr: 'Partagez le Tank buster',
          ja: 'タンクシェア',
          cn: '分摊死刑',
          ko: '쉐어 탱크버스터',
        },
      },
    },
  ],
  triggers: [
    {
      id: 'TEA Brute Phase',
      netRegex: NetRegexes.startsUsing({ source: 'Brute Justice', id: '483E', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '残暴正义号', id: '483E', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Brutalus', id: '483E', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Justicier', id: '483E', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ブルートジャスティス', id: '483E', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '포악한 심판자', id: '483E', capture: false }),
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
      },
    },
    {
      id: 'TEA Inception Phase',
      netRegex: NetRegexes.startsUsing({ source: 'Alexander Prime', id: '486F', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '至尊亚历山大', id: '486F', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Prim-Alexander', id: '486F', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Primo-Alexander', id: '486F', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'アレキサンダー・プライム', id: '486F', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '알렉산더 프라임', id: '486F', capture: false }),
      run: function(data) {
        data.phase = 'inception';
        data.resetState();
      },
    },
    {
      id: 'TEA Wormhole Phase',
      netRegex: NetRegexes.startsUsing({ source: 'Alexander Prime', id: '486E', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '至尊亚历山大', id: '486E', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Prim-Alexander', id: '486E', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Primo-Alexander', id: '486E', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'アレキサンダー・プライム', id: '486E', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '알렉산더 프라임', id: '486E', capture: false }),
      run: function(data) {
        data.phase = 'wormhole';
        data.resetState();
      },
    },
    {
      id: 'TEA Fate Alpha Phase',
      netRegex: NetRegexes.startsUsing({ source: 'Perfect Alexander', id: '487B', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '完美亚历山大', id: '487B', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Perfekter Alexander', id: '487B', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Alexander parfait', id: '487B', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'パーフェクト・アレキサンダー', id: '487B', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '완전체 알렉산더', id: '487B', capture: false }),
      run: function(data) {
        data.phase = 'alpha';
        data.resetState();
      },
    },
    {
      id: 'TEA Fate Beta Phase',
      netRegex: NetRegexes.startsUsing({ source: 'Perfect Alexander', id: '4B13', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '完美亚历山大', id: '4B13', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Perfekter Alexander', id: '4B13', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Alexander parfait', id: '4B13', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'パーフェクト・アレキサンダー', id: '4B13', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '완전체 알렉산더', id: '4B13', capture: false }),
      run: function(data) {
        data.phase = 'beta';
        data.resetState();
      },
    },
    {
      id: 'TEA Liquid Tank',
      netRegex: NetRegexes.abilityFull({ source: 'Living Liquid', id: '4978' }),
      netRegexCn: NetRegexes.abilityFull({ source: '有生命活水', id: '4978' }),
      netRegexDe: NetRegexes.abilityFull({ source: 'belebtes Wasser', id: '4978' }),
      netRegexFr: NetRegexes.abilityFull({ source: 'liquide vivant', id: '4978' }),
      netRegexJa: NetRegexes.abilityFull({ source: 'リビングリキッド', id: '4978' }),
      netRegexKo: NetRegexes.abilityFull({ source: '살아있는 액체', id: '4978' }),
      run: function(data, matches) {
        data.liquidTank = matches.target;
      },
    },
    {
      id: 'TEA Hand Tank',
      netRegex: NetRegexes.abilityFull({ source: 'Liquid Hand', id: '4979' }),
      netRegexCn: NetRegexes.abilityFull({ source: '活水之手', id: '4979' }),
      netRegexDe: NetRegexes.abilityFull({ source: 'belebte Hand', id: '4979' }),
      netRegexFr: NetRegexes.abilityFull({ source: 'membre liquide', id: '4979' }),
      netRegexJa: NetRegexes.abilityFull({ source: 'リキッドハンド', id: '4979' }),
      netRegexKo: NetRegexes.abilityFull({ source: '액체 손', id: '4979' }),
      run: function(data, matches) {
        data.handTank = matches.target;
      },
    },
    {
      id: 'TEA Cruise Chaser Tank',
      netRegex: NetRegexes.abilityFull({ source: 'Cruise Chaser', id: '497A' }),
      netRegexCn: NetRegexes.abilityFull({ source: '巡航驱逐者', id: '497A' }),
      netRegexDe: NetRegexes.abilityFull({ source: 'Chaser-Mecha', id: '497A' }),
      netRegexFr: NetRegexes.abilityFull({ source: 'Croiseur-chasseur', id: '497A' }),
      netRegexJa: NetRegexes.abilityFull({ source: 'クルーズチェイサー', id: '497A' }),
      netRegexKo: NetRegexes.abilityFull({ source: '순항추격기', id: '497A' }),
      run: function(data, matches) {
        data.cruiseTank = matches.target;
      },
    },
    {
      id: 'TEA Brute Tank',
      netRegex: NetRegexes.abilityFull({ source: 'Brute Justice', id: '497B' }),
      netRegexCn: NetRegexes.abilityFull({ source: '残暴正义号', id: '497B' }),
      netRegexDe: NetRegexes.abilityFull({ source: 'Brutalus', id: '497B' }),
      netRegexFr: NetRegexes.abilityFull({ source: 'Justicier', id: '497B' }),
      netRegexJa: NetRegexes.abilityFull({ source: 'ブルートジャスティス', id: '497B' }),
      netRegexKo: NetRegexes.abilityFull({ source: '포악한 심판자', id: '497B' }),
      run: function(data, matches) {
        data.bruteTank = matches.target;
      },
    },
    {
      id: 'TEA Cascade',
      netRegex: NetRegexes.startsUsing({ source: 'Living Liquid', id: '4826', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '有生命活水', id: '4826', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'belebtes Wasser', id: '4826', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'liquide vivant', id: '4826', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'リビングリキッド', id: '4826', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '살아있는 액체', id: '4826', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'TEA Protean Wave',
      netRegex: NetRegexes.startsUsing({ source: 'Living Liquid', id: '4822', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '有生命活水', id: '4822', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'belebtes Wasser', id: '4822', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'liquide vivant', id: '4822', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'リビングリキッド', id: '4822', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '살아있는 액체', id: '4822', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Protean Wave',
          de: 'Proteische Welle',
          fr: 'Vague inconstante',
          ja: 'プロティアン',
          cn: '万变水波',
          ko: '변화의 물결',
        },
      },
    },
    {
      id: 'TEA Drainage Tether',
      netRegex: NetRegexes.tether({ source: 'Liquid Rage', id: '0003' }),
      netRegexCn: NetRegexes.tether({ source: '活水之怒', id: '0003' }),
      netRegexDe: NetRegexes.tether({ source: 'levitierte Rage', id: '0003' }),
      netRegexFr: NetRegexes.tether({ source: 'furie liquide', id: '0003' }),
      netRegexJa: NetRegexes.tether({ source: 'リキッドレイジ', id: '0003' }),
      netRegexKo: NetRegexes.tether({ source: '분노한 액체', id: '0003' }),
      condition: Conditions.targetIsYou(),
      // Even if folks have the right tethers, this happens repeatedly.
      suppressSeconds: 5,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Drainage tether on YOU',
          de: 'Entwässerungsverbindung auf DIR',
          fr: 'Lien Drainage sur VOUS',
          ja: '自分にドレナージ',
          cn: '连线点名',
          ko: '나에게 물줄기',
        },
      },
    },
    {
      id: 'TEA Hand of Pain 5',
      netRegex: NetRegexes.startsUsing({ source: 'Liquid Hand', id: '482D', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '活水之手', id: '482D', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'belebte Hand', id: '482D', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'membre liquide', id: '482D', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'リキッドハンド', id: '482D', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '액체 손', id: '482D', capture: false }),
      preRun: function(data) {
        data.handOfPainCount = (data.handOfPainCount || 0) + 1;
      },
      infoText: function(data, _, output) {
        if (data.handOfPainCount === 5)
          return output.text();
      },
      outputStrings: {
        text: {
          en: 'Focus Living Liquid',
          de: 'belebtes Wasser fokussieren',
          fr: 'Focus sur Membre liquide',
          ja: 'リビングリキッドを攻撃',
          cn: '攻击水基佬',
          ko: '인간형 집중 공격',
        },
      },
    },
    {
      id: 'TEA Throttle',
      netRegex: NetRegexes.gainsEffect({ effectId: '2BC', capture: false }),
      condition: function(data) {
        return data.CanCleanse();
      },
      suppressSeconds: 1,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Cleanse Throttle',
          de: 'Erstickung entfernen',
          fr: 'Purifiez Suffocation',
          ja: '窒息',
          cn: '窒息',
          ko: '질식',
        },
      },
    },
    {
      // Applies to both limit cuts.
      id: 'TEA Limit Cut Numbers',
      netRegex: NetRegexes.headMarker({ }),
      condition: function(data, matches) {
        // Here and elsewhere, it's probably best to check for whether the user is the target first,
        // as that should short-circuit more often.
        return data.me === matches.target && (/00(?:4F|5[0-6])/).test(getHeadmarkerId(data, matches));
      },
      preRun: function(data, matches) {
        const correctedMatch = getHeadmarkerId(data, matches);
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
        if (data.phase === 'wormhole') {
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
      alertText: function(data, _, output) {
        return output.text({ num: data.limitCutNumber });
      },
      outputStrings: {
        text: {
          en: '#${num}',
          de: '#${num}',
          fr: '#${num}',
          ja: '${num}番',
          cn: '#${num}',
          ko: '${num}번째',
        },
      },
    },
    {
      // Applies to both limit cuts.
      id: 'TEA Limit Cut Knockback',
      netRegex: NetRegexes.headMarker({ }),
      condition: function(data, matches) {
        return data.me === matches.target && (/00(?:4F|5[0-6])/).test(getHeadmarkerId(data, matches));
      },
      // This gives a warning within 5 seconds, so you can hit arm's length.
      delaySeconds: function(data) {
        return data.limitCutDelay - 5;
      },
      alertText: function(data, matches, output) {
        const isOddNumber = parseInt(getHeadmarkerId(data, matches), 16) & 1 === 1;
        if (data.phase === 'wormhole') {
          if (isOddNumber)
            return output.knockbackCleaveFaceOutside();

          return output.knockbackChargeFaceMiddle();
        }
        if (isOddNumber)
          return output.knockbackCleaveOnYou();

        return output.knockback();
      },
      outputStrings: {
        knockbackCleaveFaceOutside: {
          en: 'Knockback Cleave; Face Outside',
          de: 'Rückstoß Cleave; nach Außen schauen',
          fr: 'Poussée Cleave; Regardez à l\'extérieur',
          ja: 'ノックバック ソード; 外向く',
          cn: '击退顺劈; 面向外侧',
          ko: '넉백 소드; 바깥쪽 바라보기',
        },
        knockbackChargeFaceMiddle: {
          en: 'Knockback Charge; Face Middle',
          de: 'Rückstoß Charge; zur Mitte schauen',
          fr: 'Poussée Charge; Regardez à l\'intérieur',
          ja: 'ノックバック チャージ; 中央向く',
          cn: '击退冲锋; 面向中间',
          ko: '넉백 차지; 안쪽 바라보기',
        },
        knockbackCleaveOnYou: {
          en: 'Knockback Cleave on YOU',
          de: 'Rückstoß Cleave auf DIR',
          fr: 'Poussée Cleave sur VOUS',
          ja: '自分にクリーブ',
          cn: '击退顺劈点名',
          ko: '나에게 넉백 공격',
        },
        knockback: {
          en: 'Knockback',
          de: 'Rückstoß',
          fr: 'Poussée',
          ja: 'ノックバック',
          cn: '击退',
          ko: '넉백',
        },
      },
    },
    {
      id: 'TEA Chakrams Out',
      // Link Up
      netRegex: NetRegexes.ability({ source: 'Brute Justice', id: '483F', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '残暴正义号', id: '483F', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Brutalus', id: '483F', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Justicier', id: '483F', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'ブルートジャスティス', id: '483F', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '포악한 심판자', id: '483F', capture: false }),
      condition: function(data) {
        return data.phase === 'brute';
      },
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Out, Dodge Chakrams',
          de: 'Raus, Chakrams ausweichen',
          fr: 'À l\'extérieur, évitez les Chakrams',
          ja: '外へ',
          cn: '远离，躲避轮轮',
          ko: '바깥으로 차크람 피하기',
        },
      },
    },
    {
      id: 'TEA Chakrams In',
      // Optical Sight
      netRegex: NetRegexes.ability({ source: 'Cruise Chaser', id: '482F', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '巡航驱逐者', id: '482F', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Chaser-Mecha', id: '482F', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Croiseur-chasseur', id: '482F', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'クルーズチェイサー', id: '482F', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '순항추격기', id: '482F', capture: false }),
      suppressSeconds: 1,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Run In',
          de: 'Rein',
          fr: 'Courez à l\'intérieur',
          ja: '中へ',
          cn: '靠近',
          ko: '가운데로',
        },
      },
    },
    {
      id: 'TEA Whirlwind',
      netRegex: NetRegexes.startsUsing({ source: 'Cruise Chaser', id: '49C2', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '巡航驱逐者', id: '49C2', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Chaser-Mecha', id: '49C2', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Croiseur-chasseur', id: '49C2', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'クルーズチェイサー', id: '49C2', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '순항추격기', id: '49C2', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'TEA Spin Crusher',
      netRegex: NetRegexes.startsUsing({ source: 'Cruise Chaser', id: '4A72', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '巡航驱逐者', id: '4A72', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Chaser-Mecha', id: '4A72', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Croiseur-chasseur', id: '4A72', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'クルーズチェイサー', id: '4A72', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '순항추격기', id: '4A72', capture: false }),
      // Nobody should be in front of cruise chaser but the tank, and this is close to
      // water thunder handling, so only tell the tank.
      condition: function(data) {
        return data.me === data.cruiseTank;
      },
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Dodge Spin Crusher',
          de: 'Rotorbrecher ausweichen',
          fr: 'Esquivez Écrasement tournoyant',
          ja: 'スピンクラッシャー避けて',
          cn: '躲避回旋碎踢',
          ko: '회전 분쇄 피하기',
        },
      },
    },
    {
      id: 'TEA Ice Marker',
      netRegex: NetRegexes.headMarker({ }),
      condition: function(data, matches) {
        return data.me === matches.target && getHeadmarkerId(data, matches) === '0043';
      },
      alarmText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Freeze Tornado',
          de: 'Tornado einfrieren',
          fr: 'Gèlez la tornade',
          ja: '竜巻凍らせる',
          cn: '冰冻龙卷风',
          ko: '물 회오리 얼리기',
        },
      },
    },
    {
      id: 'TEA Hidden Minefield',
      netRegex: NetRegexes.ability({ source: 'Brute Justice', id: '4851', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '残暴正义号', id: '4851', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Brutalus', id: '4851', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Justicier', id: '4851', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'ブルートジャスティス', id: '4851', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '포악한 심판자', id: '4851', capture: false }),
      condition: function(data) {
        return data.role === 'tank';
      },
      suppressSeconds: 1,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Mines',
          de: 'Minen',
          fr: 'Mines',
          ja: '地雷',
          cn: '地雷',
          ko: '지뢰',
        },
      },
    },
    {
      id: 'TEA Enumeration YOU',
      netRegex: NetRegexes.headMarker({ }),
      condition: function(data, matches) {
        return data.me === matches.target && getHeadmarkerId(data, matches) === '0041';
      },
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Enumeration on YOU',
          de: 'Enumeration auf DIR',
          fr: 'Énumeration sur VOUS',
          ja: '自分にカウント',
          cn: '计数点名',
          ko: '나에게 인원수',
        },
      },
    },
    {
      id: 'TEA Enumeration Everyone',
      netRegex: NetRegexes.headMarker({ }),
      condition: function(data, matches) {
        return getHeadmarkerId(data, matches) === '0041';
      },
      preRun: function(data, matches) {
        data.enumerations = data.enumerations || [];
        data.enumerations.push(matches.target);
      },
      infoText: function(data, _, output) {
        if (data.enumerations.length !== 2)
          return;
        const names = data.enumerations.sort();
        return output.text({ players: names.map((x) => data.ShortName(x)).join(', ') });
      },
      outputStrings: {
        text: {
          en: 'Enumeration: ${players}',
          de: 'Enumeration: ${players}',
          fr: 'Énumeration: ${players}',
          ja: 'カウント: ${players}',
          cn: '计数${players}',
          ko: '인원수 대상: ${players}',
        },
      },
    },
    {
      id: 'TEA Limit Cut Shield',
      netRegex: NetRegexes.ability({ source: 'Cruise Chaser', id: '4833', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '巡航驱逐者', id: '4833', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Chaser-Mecha', id: '4833', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Croiseur-chasseur', id: '4833', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'クルーズチェイサー', id: '4833', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '순항추격기', id: '4833', capture: false }),
      delaySeconds: 2,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Break Shield From Front',
          de: 'Schild von Vorne zerstören',
          fr: 'Brisez le bouclier par devant',
          ja: '正面からシールド壊して',
          cn: '从前面击破盾牌',
          ko: '정면에서 실드를 부수기',
        },
      },
    },
    {
      id: 'TEA Compressed Water Initial',
      netRegex: NetRegexes.gainsEffect({ effectId: '85E' }),
      condition: Conditions.targetIsYou(),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Water on YOU',
          de: 'Wasser auf DIR',
          fr: 'Eau sur VOUS',
          ja: '自分に水',
          cn: '水点名',
          ko: '나에게 물',
        },
      },
    },
    {
      id: 'TEA Compressed Water Explode',
      netRegex: NetRegexes.gainsEffect({ effectId: '85E' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: function(data, matches) {
        // 5 second warning.
        return parseFloat(matches.duration) - 5;
      },
      alertText: function(data, _, output) {
        if (data.seenGavel)
          return;
        return output.text();
      },
      outputStrings: {
        text: {
          en: 'Drop Water Soon',
          de: 'Gleich Wasser ablegen',
          fr: 'Déposez l\'eau bientôt',
          ja: '水来るよ',
          cn: '马上放水',
          ko: '물이 곧 옵니다',
        },
      },
    },
    {
      id: 'TEA Compressed Lightning Initial',
      netRegex: NetRegexes.gainsEffect({ effectId: '85F' }),
      condition: Conditions.targetIsYou(),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Lightning on YOU',
          de: 'Blitz auf DIR',
          fr: 'Foudre sur VOUS',
          ja: '自分に雷',
          cn: '雷点名',
          ko: '나에게 번개',
        },
      },
    },
    {
      id: 'TEA Compressed Lightning Explode',
      netRegex: NetRegexes.gainsEffect({ effectId: '85F' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: function(data, matches) {
        // 5 second warning.
        return parseFloat(matches.duration) - 5;
      },
      alertText: function(data, _, output) {
        if (data.seenGavel)
          return;
        return output.text();
      },
      outputStrings: {
        text: {
          en: 'Drop Lightning Soon',
          de: 'Gleich Blitz ablegen',
          fr: 'Déposez la foudre bientôt',
          ja: '雷来るよ',
          cn: '马上放雷',
          ko: '번개가 곧 옵니다',
        },
      },
    },
    {
      id: 'TEA Pass Nisi 1',
      // 4 seconds after Photon cast starts.
      netRegex: NetRegexes.startsUsing({ source: 'Cruise Chaser', id: '4836', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '巡航驱逐者', id: '4836', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Chaser-Mecha', id: '4836', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Croiseur-chasseur', id: '4836', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'クルーズチェイサー', id: '4836', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '순항추격기', id: '4836', capture: false }),
      delaySeconds: 4,
      suppressSeconds: 10000,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Pass Nisi',
          de: 'Nisi weitergeben',
          fr: 'Passez la Peine',
          ja: 'ナイサイ渡して',
          cn: '传递审判',
          ko: '나이사이 건네기',
        },
      },
    },
    {
      id: 'TEA Pass Nisi 2',
      // 1 second after enumeration.
      // TODO: find a startsUsing instead of matching an action.
      netRegex: NetRegexes.ability({ source: 'Brute Justice', id: '4850', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '残暴正义号', id: '4850', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Brutalus', id: '4850', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Justicier', id: '4850', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'ブルートジャスティス', id: '4850', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '포악한 심판자', id: '4850', capture: false }),
      // Ignore enumerations later in the fight.
      condition: (data) => data.phase === 'brute',
      delaySeconds: 1,
      suppressSeconds: 1,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Pass Nisi',
          de: 'Nisi weitergeben',
          fr: 'Passez la Peine',
          ja: 'ナイサイ渡して',
          cn: '传递审判',
          ko: '나이사이 건네기',
        },
      },
    },
    {
      id: 'TEA Pass Nisi 3',
      // 8 seconds after Flarethrower cast starts.
      netRegex: NetRegexes.startsUsing({ source: 'Brute Justice', id: '4845', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '残暴正义号', id: '4845', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Brutalus', id: '4845', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Justicier', id: '4845', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ブルートジャスティス', id: '4845', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '포악한 심판자', id: '4845', capture: false }),
      delaySeconds: 8,
      durationSeconds: 9,
      alertText: function(data, _, output) {
        return namedNisiPass(data, output);
      },
      outputStrings: nisiPassOutputStrings,
    },
    {
      id: 'TEA Decree Nisi Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: kDecreeNisi }),
      run: function(data, matches) {
        const num = kDecreeNisi.indexOf(matches.effectId.toUpperCase());
        data.nisiMap = data.nisiMap || {};
        data.nisiMap[matches.target] = num;
      },
    },
    {
      id: 'TEA Decree Nisi Lose',
      netRegex: NetRegexes.losesEffect({ effectId: kDecreeNisi }),
      run: function(data, matches) {
        data.nisiMap = data.nisiMap || {};
        delete data.nisiMap[matches.target];
      },
    },
    {
      id: 'TEA Final Judgment Nisi Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: kFinalJudgementNisi }),
      run: function(data, matches) {
        const num = kFinalJudgementNisi.indexOf(matches.effectId.toUpperCase());
        data.finalNisiMap = data.finalNisiMap || {};
        data.finalNisiMap[matches.target] = num;
      },
    },
    {
      id: 'TEA Final Judgment Nisi Verdict',
      netRegex: NetRegexes.gainsEffect({ effectId: ['8B0', '8B1', '85B', '85C'] }),
      condition: Conditions.targetIsYou(),
      // This keeps refreshing forever, so only alert once.
      suppressSeconds: 10000,
      infoText: function(data, matches, output) {
        const num = kFinalJudgementNisi.indexOf(matches.effectId.toUpperCase());
        return output.verdict({ type: nisiToString(num, output) });
      },
      outputStrings: {
        ...nisiTypes,
        verdict: {
          en: 'Verdict: ${type} Nisi',
          de: 'Prozesseröffnung: ${type} Nisi',
          fr: 'Ouverture de procès: ${type} Nisi',
          ja: '最終: ${type}',
          cn: '最终: ${type}',
          ko: '최종: ${type}',
        },
      },
    },
    {
      id: 'TEA Gavel',
      netRegex: NetRegexes.startsUsing({ source: 'Brute Justice', id: '483C', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '残暴正义号', id: '483C', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Brutalus', id: '483C', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Justicier', id: '483C', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ブルートジャスティス', id: '483C', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '포악한 심판자', id: '483C', capture: false }),
      run: function(data) {
        data.seenGavel = true;
      },
    },
    {
      id: 'TEA Double Rocket Punch',
      netRegex: NetRegexes.startsUsing({ source: 'Brute Justice', id: '4847' }),
      netRegexCn: NetRegexes.startsUsing({ source: '残暴正义号', id: '4847' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Brutalus', id: '4847' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Justicier', id: '4847' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ブルートジャスティス', id: '4847' }),
      netRegexKo: NetRegexes.startsUsing({ source: '포악한 심판자', id: '4847' }),
      alertText: function(data, matches, output) {
        if (data.me === matches.target)
          return output.sharedTankbusterOnYou();

        if (data.role === 'tank' || data.role === 'healer')
          return output.sharedTankbusterOn({ player: data.ShortName(matches.target) });
      },
      infoText: function(data, _, output) {
        if (data.role === 'tank' || data.role === 'healer')
          return;
        return output.baitSuperJump();
      },
      outputStrings: {
        baitSuperJump: {
          en: 'Bait Super Jump?',
          de: 'Supersprung anlocken?',
          fr: 'Attirez le Super saut ?',
          ja: 'スパジャン誘導',
          cn: '引导超级跳跃',
          ko: '슈퍼 점프 유도',
        },
        sharedTankbusterOnYou: {
          en: 'Shared Tankbuster on YOU',
          de: 'geteilter Tankbuster auf DIR',
          fr: 'Tank buster à partager sur VOUS',
          ja: '自分にタンクシェア',
          cn: '分摊死刑点名',
          ko: '나에게 쉐어 탱크버스터',
        },
        sharedTankbusterOn: {
          en: 'Shared Tankbuster on ${player}',
          de: 'geteilter Tankbuster on ${player}',
          fr: 'Tank buster à partager sur ${player}',
          ja: '${player} にタンクシェア',
          cn: '分摊死刑点 ${player}',
          ko: '쉐어 탱크버스터 대상: ${player}',
        },
      },
    },
    {
      id: 'TEA Brute Ray',
      netRegex: NetRegexes.ability({ source: 'Brute Justice', id: '484A', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '残暴正义号', id: '484A', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Brutalus', id: '484A', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Justicier', id: '484A', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'ブルートジャスティス', id: '484A', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '포악한 심판자', id: '484A', capture: false }),
      condition: (data) => data.phase === 'brute',
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'avoid ray',
          de: 'Strahl ausweichen',
          fr: 'Évitez le rayon',
          ja: 'アポカリ避けて',
          cn: '躲避激光',
          ko: '파멸 계시 피하기',
        },
      },
    },
    {
      id: 'TEA Buff Collection',
      // Aggravated Assault, Shared Sentence, House Arrest, Restraining Order.
      netRegex: NetRegexes.gainsEffect({ effectId: '46[1234]' }),
      run: function(data, matches) {
        data.buffMap = data.buffMap || {};
        // The values are for debugging; the logic is just about presence in the map.
        data.buffMap[matches.target] = matches.effect;
      },
    },
    {
      id: 'TEA Temporal Stasis No Buff',
      // This id is "restraining order".
      netRegex: NetRegexes.gainsEffect({ effectId: '464', capture: false }),
      condition: function(data) {
        // NOTE: due to timings the "temporal" phase does not start until after debuffs are out.
        // So consider the "temporal" no debuff to be "brute" no debuff here.
        return data.phase === 'brute' || data.phase === 'inception';
      },
      delaySeconds: 0.5,
      durationSeconds: 10,
      suppressSeconds: 1,
      infoText: function(data, _, output) {
        if (data.me in data.buffMap)
          return;
        return output.text();
      },
      outputStrings: {
        text: {
          en: 'No Debuff',
          de: 'Kein Debuff',
          fr: 'Pas de Debuff',
          ja: 'デバフ無し',
          cn: '无 Debuff',
          ko: '디버프 없음',
        },
      },
    },
    {
      id: 'TEA Restraining Order',
      netRegex: NetRegexes.gainsEffect({ effectId: '464' }),
      condition: Conditions.targetIsYou(),
      durationSeconds: 10,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Far Tethers',
          de: 'Entfernte Verbindungen',
          fr: 'Liens éloignés',
          ja: 'ファー',
          cn: '远离连线',
          ko: '접근금지: 상대와 떨어지기',
        },
      },
    },
    {
      id: 'TEA House Arrest',
      netRegex: NetRegexes.gainsEffect({ effectId: '463' }),
      condition: Conditions.targetIsYou(),
      durationSeconds: 10,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Close Tethers',
          de: 'Nahe Verbindungen',
          fr: 'Liens proches',
          ja: 'ニアー',
          cn: '靠近连线',
          ko: '강제접근: 상대와 가까이 붙기',
        },
      },
    },
    {
      id: 'TEA Shared Sentence',
      netRegex: NetRegexes.gainsEffect({ effectId: '462' }),
      condition: Conditions.targetIsYou(),
      durationSeconds: 10,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Shared Sentence',
          de: 'Urteil: Kollektivstrafe',
          fr: 'Peine collective',
          ja: '集団罰',
          cn: '集团罪',
          ko: '단체형: 무징과 함께 맞기',
        },
      },
    },
    {
      id: 'TEA Shared Sentence Inception',
      netRegex: NetRegexes.gainsEffect({ effectId: '462' }),
      condition: (data) => data.phase === 'inception',
      delaySeconds: 3,
      infoText: function(data, matches, output) {
        return output.text({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        text: {
          en: 'Shared Sentence on ${player}',
          de: 'Urteil: Kollektivstrafe auf ${player}',
          fr: 'Peine collective sur ${player}',
          ja: '${player} に集団罰',
          cn: '集团罪 点${player}',
          ko: '${player} 에게 단체형',
        },
      },
    },
    {
      id: 'TEA Aggravated Assault',
      netRegex: NetRegexes.gainsEffect({ effectId: '461' }),
      condition: Conditions.targetIsYou(),
      durationSeconds: 10,
      alarmText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Thunder',
          de: 'Blitz',
          fr: 'Peine Sévère',
          ja: '加重罰',
          cn: '加重罪',
          ko: '가중형: 가중형끼리 모이기',
        },
      },
    },
    {
      id: 'TEA Chastening Heat',
      netRegex: NetRegexes.startsUsing({ source: 'Alexander Prime', id: '4A80' }),
      netRegexCn: NetRegexes.startsUsing({ source: '至尊亚历山大', id: '4A80' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Prim-Alexander', id: '4A80' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Primo-Alexander', id: '4A80' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'アレキサンダー・プライム', id: '4A80' }),
      netRegexKo: NetRegexes.startsUsing({ source: '알렉산더 프라임', id: '4A80' }),
      alertText: function(data, matches, output) {
        if (matches.target === data.me)
          return output.tankBusterOnYou();

        if (data.role === 'healer')
          return output.busterOn({ player: data.ShortName(matches.target) });
      },
      // As this seems to usually seems to be invulned,
      // don't make a big deal out of it.
      infoText: function(data, matches, output) {
        if (matches.target === data.me)
          return;
        if (data.role !== 'tank')
          return;

        return output.busterOn({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        busterOn: {
          en: 'Buster on ${player}',
          de: 'Tankbuster auf ${player}',
          fr: 'Tank buster sur ${player}',
          ja: '${player}にタンクバスター',
          cn: '死刑点 ${player}',
          ko: '${player}에게 탱크버스터',
        },
        tankBusterOnYou: {
          en: 'Tank Buster on YOU',
          de: 'Tankbuster auf DIR',
          fr: 'Tank buster sur VOUS',
          ja: '自分にタンクバスター',
          cn: '死刑点名',
          ko: '나에게 탱크버스터',
        },
      },
    },
    {
      id: 'TEA Judgment Crystal',
      netRegex: NetRegexes.headMarker({ }),
      condition: function(data, matches) {
        return data.me === matches.target && getHeadmarkerId(data, matches) === '0060';
      },
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Crystal on YOU',
          de: 'Kristall auf DIR',
          fr: 'Cristal sur VOUS',
          ja: '自分に結晶',
          cn: '结晶点名',
          ko: '나에게 결정체',
        },
      },
    },
    {
      id: 'TEA Judgment Crystal Placement',
      netRegex: NetRegexes.ability({ source: 'Alexander Prime', id: '485C', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '至尊亚历山大', id: '485C', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Prim-Alexander', id: '485C', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Primo-Alexander', id: '485C', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'アレキサンダー・プライム', id: '485C', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '알렉산더 프라임', id: '485C', capture: false }),
      suppressSeconds: 100,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get Away From Crystals',
          de: 'Geh weg vom Kristall',
          fr: 'Éloignez-vous des Cristaux',
          ja: '結晶から離れ',
          cn: '远离结晶',
          ko: '결정체로부터 멀어질 것',
        },
      },
    },
    {
      id: 'TEA Terashatter Flarethrower',
      netRegex: NetRegexes.ability({ source: 'Judgment Crystal', id: '4A88', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '审判结晶', id: '4A88', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Urteilskristall', id: '4A88', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Cristal du jugement', id: '4A88', capture: false }),
      netRegexJa: NetRegexes.ability({ source: '審判の結晶', id: '4A88', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '심판의 결정체', id: '4A88', capture: false }),
      delaySeconds: 1,
      suppressSeconds: 100,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Bait Brute\'s Flarethrower',
          de: 'Locke Brute\'s Großflammenwerfer',
          fr: 'Attirez le Lance-brasiers de Justicier',
          ja: '火炎放射を誘導',
          cn: '引导火炎放射',
          ko: '화염 방사 유도',
        },
      },
    },
    {
      id: 'TEA Inception Vuln Collection',
      netRegex: NetRegexes.gainsEffect({ effectId: '2B7' }),
      condition: (data) => data.phase === 'inception',
      run: function(data, matches) {
        data.vuln[matches.target] = true;
      },
    },
    {
      id: 'TEA Inception Alpha Sword',
      // Sacrament cast.
      netRegex: NetRegexes.ability({ source: 'Alexander Prime', id: '485F', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '至尊亚历山大', id: '485F', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Prim-Alexander', id: '485F', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Primo-Alexander', id: '485F', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'アレキサンダー・プライム', id: '485F', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '알렉산더 프라임', id: '485F', capture: false }),
      condition: (data) => data.phase === 'inception',
      alarmText: function(data, _, output) {
        const numVulns = Object.keys(data.vuln).length;
        if (data.role === 'tank' && data.vuln[data.me] && numVulns >= 5) {
          // If you're stacking three people in the shared sentence,
          // then probably the tank wants to handle jump with cooldowns.
          // TODO: we could probably determine where this is.
          return output.baitJumpWithCooldowns();
        }
      },
      alertText: function(data, _, output) {
        if (data.vuln[data.me])
          return;

        const numVulns = Object.keys(data.vuln).length;
        if (numVulns >= 5) {
          // In this case, jump was handled above for tanks.
          return output.baitSword();
        }

        // Otherwise everybody without a vuln can do anything.
        return output.baitSwordOrJump();
      },
      infoText: function(data, _, output) {
        if (data.vuln[data.me]) {
          // Tanks covered in the alarmText case above.
          const numVulns = Object.keys(data.vuln).length;
          if (data.role === 'tank' && numVulns >= 5)
            return;

          return output.vulnAvoidCleavesAndJump();
        }
      },
      outputStrings: {
        vulnAvoidCleavesAndJump: {
          en: 'Vuln: Avoid cleaves and jump',
          de: 'Vuln: Cleaves und Sprung ausweichen',
          fr: 'Vuln: évitez les cleaves et saut',
          ja: '被ダメ増加',
          cn: '易伤：躲避顺劈和跳',
          ko: '받는 데미지 증가: 공격과 점프 피할것',
        },
        baitSword: {
          en: 'Bait Sword',
          de: 'Locke Chaser-Mecha Schwert',
          fr: 'Attirez l\'Épée',
          ja: 'ソード誘導',
          cn: '引导剑',
          ko: '검 유도',
        },
        baitSwordOrJump: {
          en: 'Bait Sword or Jump?',
          de: 'Köder Schwert oder Sprung?',
          fr: 'Attirez l\'Épée ou le Saut ?',
          ja: 'ソードかジャンプ誘導?',
          cn: '引导剑或跳?',
          ko: '검 또는 슈퍼 점프 유도?',
        },
        baitJumpWithCooldowns: {
          en: 'Bait Jump With Cooldowns',
          de: 'Köder Sprung mit Cooldowns',
          fr: 'Attirez le Saut avec des Cooldowns',
          ja: 'スパジャン誘導',
          cn: '减伤引导跳跃',
          ko: '슈퍼 점프 유도',
        },
      },
    },
    {
      id: 'TEA Wormhole',
      netRegex: NetRegexes.ability({ source: 'Alexander Prime', id: '486E', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '至尊亚历山大', id: '486E', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Prim-Alexander', id: '486E', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Primo-Alexander', id: '486E', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'アレキサンダー・プライム', id: '486E', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '알렉산더 프라임', id: '486E', capture: false }),
      infoText: function(data, _, output) {
        if (data.options.cactbotWormholeStrat)
          return output.baitChakramsWormholeStrat();

        return output.baitChakrams();
      },
      outputStrings: {
        baitChakramsWormholeStrat: {
          en: 'Bait Chakrams mid; Look opposite Alex',
          de: 'Locke Chakrams mittig; schau weg von Alex',
          fr: 'Attirez les Chakrams au milieu; Regardez à l\'opposé d\'Alex',
          ja: '中央にチャクラム誘導; アレキの反対見て',
          cn: '中间引导轮轮，背对亚历山大',
          ko: '가운데로 차크람 유도; 알렉 반대쪽이 북쪽',
        },
        baitChakrams: {
          en: 'Bait Chakrams',
          de: 'Köder Chakrams',
          fr: 'Attirez les Chakrams',
          ja: 'チャクラム誘導',
          cn: '引导轮轮',
          ko: '차크람 유도',
        },
      },
    },
    {
      id: 'TEA Cactbot Wormhole Strat',
      netRegex: NetRegexes.headMarker({ }),
      condition: function(data, matches) {
        if (!data.options.cactbotWormholeStrat)
          return false;
        if (!(/00(?:4F|5[0-6])/).test(getHeadmarkerId(data, matches)))
          return false;
        return data.phase === 'wormhole' && data.me === matches.target;
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
      infoText: function(data, matches, output) {
        // Initial directions.
        // TODO: we could figure out which robot was left and right based
        // on chakrams, and call that out here too instead of just saying "Robot".
        return {
          '004F': output.marker1(),
          '0050': output.marker2(),
          '0051': output.marker3(),
          '0052': output.marker4(),
          '0053': output.marker5(),
          '0054': output.marker6(),
          '0055': output.marker7(),
          '0056': output.marker8(),
        }[getHeadmarkerId(data, matches)];
      },
      outputStrings: {
        marker1: {
          en: 'Left To Robot; Look Outside; 3rd Puddle',
          de: 'Links vom Robot; Nach Außen schauen; 3. Fläche',
          fr: 'À gauche du Robot; Regardez à l\'extérieur; 3rd zone au sol',
          ja: '右上 外向き 懺悔3回目',
          cn: '左-->机器人; 面向外侧; 水圈#3',
          ko: '왼쪽 위 / 참회 #3',
        },
        marker2: {
          en: 'Back Right Opposite Robot; Look Middle; 3rd Puddle',
          de: 'Hinten Rechts gegenüber vom Robot; zur Mitte schauen; 3. Fläche',
          fr: 'Revenez à l\'opposé droite du Robot; Regardez au milieu; 3rd zone au sol',
          ja: '左下 内向き 懺悔3回目',
          cn: '右后<--机器人; 面向中间; 水圈#3',
          ko: '오른쪽 위 / 참회 #3',
        },
        marker3: {
          en: 'Back Left Opposite Robot; No Puddle',
          de: 'Hinten Links gegenüber vom Robot; keine Fläche',
          fr: 'Revenez à l\'opposé gauche du Robot; Pas de zone au sol',
          ja: '左上',
          cn: '左后<--机器人; 无水圈',
          ko: '왼쪽 아래',
        },
        marker4: {
          en: 'Right To Robot; No puddle',
          de: 'Rechts vom Robot; keine Fläche',
          fr: 'À droite du Robot; Pas de zone au sol',
          ja: '右下',
          cn: '右-->机器人; 无水圈',
          ko: '오른쪽 아래',
        },
        marker5: {
          en: 'Left Robot Side -> 1st Puddle',
          de: 'Linke Robot Seite -> 1. Fläche',
          fr: 'Côté gauche du Robot-> 1st zone au sol',
          ja: '右ちょい上 懺悔1回目',
          cn: '机器人左侧 --> 水圈#1',
          ko: '왼쪽 / 참회 #1',
        },
        marker6: {
          en: 'Right Robot Side -> 1st Puddle',
          de: 'Rechte Robot Seite -> 1. Fläche',
          fr: 'Côté droit du Robot-> 1st zone au sol',
          ja: '左ちょい上 懺悔1回目',
          cn: '机器人右侧 --> 水圈#1',
          ko: '오른쪽 / 참회 #1',
        },
        marker7: {
          en: 'Left Robot Side -> cardinal; 2nd Puddle',
          de: 'Linke Robot Seite -> cardinal; 2. Fläche',
          fr: 'Côté gauche du Robot -> cardinal; 2nd zone au sol',
          ja: '右ちょい上 懺悔2回目',
          cn: '机器人左侧 --> 边; 水圈#2',
          ko: '왼쪽 / 참회 #2',
        },
        marker8: {
          en: 'Right Robot Side -> cardinal; 2nd Puddle',
          de: 'Rechte Robot Seite -> cardinal; 2. Fläche',
          fr: 'Côté droit du Robot -> cardinal; 2nd zone au sol',
          ja: '左ちょい上 懺悔2回目',
          cn: '机器人右侧 --> 边; 水圈#2',
          ko: '오른쪽 / 참회 #2',
        },
      },
    },
    {
      id: 'TEA Cactbot Wormhole 4 Super Jump',
      netRegex: NetRegexes.ability({ source: 'Brute Justice', id: '484A', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '残暴正义号', id: '484A', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Brutalus', id: '484A', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Justicier', id: '484A', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'ブルートジャスティス', id: '484A', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '포악한 심판자', id: '484A', capture: false }),
      condition: function(data) {
        if (!data.options.cactbotWormholeStrat)
          return false;
        if (data.phase !== 'wormhole')
          return;
        return data.limitCutNumber === 2 || data.limitCutNumber === 3;
      },
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Move Behind Brute Justice?',
          de: 'Geh hinter Brutalus?',
          fr: 'Déplacez-vous derière Justicier ?',
          ja: 'ジャスティスの背面へ',
          cn: '残暴正义号背后躲避?',
          ko: '심판자 등 뒤로 이동?',
        },
      },
    },
    {
      id: 'TEA Incinerating Heat',
      netRegex: NetRegexes.headMarker({ }),
      condition: function(data, matches) {
        return getHeadmarkerId(data, matches) === '005D';
      },
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Stack Middle',
          de: 'mittig sammeln',
          fr: 'Packez-vous au milieu',
          ja: '中央へ',
          cn: '中间集合',
          ko: '가운데로 모이기',
        },
      },
    },
    {
      id: 'TEA Mega Holy',
      netRegex: NetRegexes.startsUsing({ source: 'Alexander Prime', id: '4A83', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '至尊亚历山大', id: '4A83', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Prim-Alexander', id: '4A83', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Primo-Alexander', id: '4A83', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'アレキサンダー・プライム', id: '4A83', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '알렉산더 프라임', id: '4A83', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'big aoe',
          de: 'große AoE',
          fr: 'Grosse AoE',
          ja: '大ダメージAoE',
          cn: '高伤AOE',
          ko: '거대 전체 공격',
        },
      },
    },
    {
      id: 'TEA Summon Alexander',
      netRegex: NetRegexes.startsUsing({ source: 'Alexander Prime', id: '4A55', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '至尊亚历山大', id: '4A55', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Prim-Alexander', id: '4A55', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Primo-Alexander', id: '4A55', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'アレキサンダー・プライム', id: '4A55', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '알렉산더 프라임', id: '4A55', capture: false }),
      delaySeconds: 10.4,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Kill Cruise Chaser First',
          de: 'Chaser-Mecha zuerst besiegen',
          fr: 'Tuez Croiseur-chasseur en premier',
          ja: 'チェイサーから倒す',
          cn: '先杀巡航驱逐者',
          ko: '순항추격기부터 처치하기',
        },
      },
    },
    {
      id: 'TEA Divine Judgment',
      netRegex: NetRegexes.ability({ source: 'Alexander Prime', id: '4879', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '至尊亚历山大', id: '4879', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Prim-Alexander', id: '4879', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Primo-Alexander', id: '4879', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'アレキサンダー・プライム', id: '4879', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '알렉산더 프라임', id: '4879', capture: false }),
      condition: function(data) {
        return data.role === 'tank';
      },
      delaySeconds: 6,
      alarmText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'TANK LB!!',
          de: 'TANK LB!!',
          fr: 'LB TANK !!',
          ja: 'タンクLB!!',
          cn: '坦克LB!!',
          ko: '탱커 LIMIT BREAK!!',
        },
      },
    },
    {
      id: 'TEA Perfect Optical Sight Spread',
      netRegex: NetRegexes.startsUsing({ source: 'Perfect Alexander', id: '488A', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '完美亚历山大', id: '488A', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Perfekter Alexander', id: '488A', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Alexander parfait', id: '488A', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'パーフェクト・アレキサンダー', id: '488A', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '완전체 알렉산더', id: '488A', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Spread',
          de: 'Verteilen',
          fr: 'Dispersez-vous',
          ja: '散開',
          cn: '分散',
          ko: '산개',
        },
      },
    },
    {
      id: 'TEA Perfect Optical Sight Stack',
      netRegex: NetRegexes.headMarker({ }),
      condition: function(data, matches) {
        return getHeadmarkerId(data, matches) === '003E';
      },
      preRun: function(data, matches) {
        data.opticalStack = data.opticalStack || [];
        data.opticalStack.push(matches.target);
      },
      alertText: function(data, matches, output) {
        if (data.me === matches.target)
          return output.stackOnYou();
      },
      infoText: function(data, _, output) {
        if (data.opticalStack.length === 1)
          return;
        const names = data.opticalStack.map((x) => data.ShortName(x)).sort();
        return output.opticalStackPlayers({ players: names.join(', ') });
      },
      outputStrings: {
        opticalStackPlayers: {
          en: 'Optical Stack (${players})',
          de: 'Optischer Stack (${players})',
          fr: 'Package optique (${players})',
          ja: 'シェア (${players})',
          cn: '照准集合 (${players})',
          ko: '조준 대상: ${players}',
        },
        stackOnYou: {
          en: 'Stack on YOU',
          de: 'Sammeln auf DIR',
          fr: 'Package sur VOUS',
          ja: '自分にシェア',
          cn: '集合点名',
          ko: '나에게 모이기',
        },
      },
    },
    {
      id: 'TEA Ordained Motion',
      netRegex: NetRegexes.startsUsing({ source: 'Perfect Alexander', id: '487E', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '完美亚历山大', id: '487E', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Perfekter Alexander', id: '487E', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Alexander parfait', id: '487E', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'パーフェクト・アレキサンダー', id: '487E', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '완전체 알렉산더', id: '487E', capture: false }),
      durationSeconds: 4,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Keep Moving',
          de: 'weiter bewegen',
          fr: 'Continuez à bouger',
          ja: '動く',
          cn: '保持移动',
          ko: '움직여!!!',
        },
      },
    },
    {
      id: 'TEA Ordained Stillness',
      netRegex: NetRegexes.startsUsing({ source: 'Perfect Alexander', id: '487F', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '完美亚历山大', id: '487F', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Perfekter Alexander', id: '487F', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Alexander parfait', id: '487F', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'パーフェクト・アレキサンダー', id: '487F', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '완전체 알렉산더', id: '487F', capture: false }),
      alarmText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'STOP LITERALLY EVERYTHING',
          de: 'STOP WIRKLICH ALLES',
          fr: 'ARRÊTEZ TOUT',
          ja: '止まる',
          cn: '停止一切动作',
          ko: '멈춰!!!',
        },
      },
    },
    {
      id: 'TEA Contact Prohibition',
      netRegex: NetRegexes.gainsEffect({ effectId: '868' }),
      condition: (data, matches) => data.me === matches.target,
      infoText: (data, _, output) => output.text(),
      tts: {
        en: 'Orange',
        de: 'Orange',
        fr: 'Orange',
        ja: '接触禁止',
        cn: '小光',
        ko: '접촉금지',
      },
      outputStrings: {
        text: {
          en: 'Orange (Attract)',
          de: 'Orange (Anziehen)',
          fr: 'Orange (Attraction)',
          ja: '接触禁止',
          cn: '小光',
          ko: '노랑/접촉금지',
        },
      },
    },
    {
      id: 'TEA Contact Regulation',
      netRegex: NetRegexes.gainsEffect({ effectId: '869' }),
      condition: (data, matches) => data.me === matches.target,
      alarmText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Orange Bait: Get Away',
          de: 'Orange locken: Geh Weg',
          fr: 'Attirez l\'orange : Éloignez-vous',
          ja: '接触保護',
          cn: '大光: 远离人群',
          ko: '노랑/접촉보호; 유도역할/혼자 멀리 있기',
        },
      },
    },
    {
      id: 'TEA Escape Prohibition',
      netRegex: NetRegexes.gainsEffect({ effectId: '86A' }),
      condition: (data, matches) => data.me === matches.target,
      infoText: (data, _, output) => output.text(),
      tts: {
        en: 'Purple',
        de: 'Lila',
        fr: 'Violet',
        ja: '逃亡禁止',
        cn: '小暗',
        ko: '도망금지',
      },
      outputStrings: {
        text: {
          en: 'Purple (Repel)',
          de: 'Lila (Abstoßen)',
          fr: 'Violet (Répulsion)',
          ja: '逃亡禁止',
          cn: '小暗',
          ko: '보라/도망금지',
        },
      },
    },
    {
      id: 'TEA Escape Detection',
      netRegex: NetRegexes.gainsEffect({ effectId: '86B' }),
      condition: (data, matches) => data.me === matches.target,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Purple Bait: Be In Back Of Group',
          de: 'Lila locken: Hinter der Gruppe sein',
          fr: 'Attirez le violet : Soyez derrière le groupe',
          ja: '逃亡監察',
          cn: '大暗: 去人群后面',
          ko: '보라/도망감찰; 유도역할/사람들 뒤에 있기',
        },
      },
    },
    {
      id: 'TEA Fate Tether Bois',
      netRegex: NetRegexes.tether({ id: '0062' }),
      run: function(data, matches) {
        data.tetherBois = data.tetherBois || {};
        data.tetherBois[matches.targetId] = matches.source;
      },
    },
    {
      id: 'TEA Alpha Instructions',
      netRegex: NetRegexes.tether({ id: '0062', capture: false }),
      condition: (data) => data.phase === 'alpha',
      delaySeconds: 1,
      suppressSeconds: 10,
      run: function(data) {
        // Let your actor id memes be dreams.
        // If you sort the actor ids of the clones, this will tell you what you have.
        // If anybody is dead, they will fill in from the lowest.
        const sortedIds = Object.keys(data.tetherBois).sort().reverse();
        const sortedNames = sortedIds.map((x) => data.tetherBois[x]);

        data.alphaSolidarity = sortedNames[0];
        data.alphaDefamation = sortedNames[1];
        data.alphaSeverity = [sortedNames[2], sortedNames[3], sortedNames[4]];
        data.alphaNoDebuff = [sortedNames[5], sortedNames[6], sortedNames[7]];
      },
    },
    {
      id: 'TEA Alpha Instructions Callout',
      netRegex: NetRegexes.tether({ id: '0062', capture: false }),
      condition: (data) => data.phase === 'alpha',
      delaySeconds: 2,
      durationSeconds: 28,
      suppressSeconds: 10,
      // TODO: this would probably be cleaner as a single response,
      // rather than a giant pile of conditionals in each function.
      alarmText: function(data, _, output) {
        // Defamation will wipe the group, so gets an alarm.
        if (data.me === data.alphaDefamation)
          return output.defamation();
      },
      alertText: function(data, _, output) {
        // Folks who need to not stack, get an alert.
        if (data.me === data.alphaSolidarity)
          return output.solidarity();
        if (data.alphaSeverity.includes(data.me))
          return output.severity();
      },
      infoText: function(data, _, output) {
        // The other 4 people in the stack group just get info.
        if (data.me === data.alphaDefamation)
          return;
        if (data.me === data.alphaSolidarity)
          return;
        if (data.alphaSeverity.includes(data.me))
          return;
        if (data.alphaNoDebuff.includes(data.me))
          return output.noDebuff();

        // If enough people are alive, unknowns are probably no debuff stack.
        if (Object.keys(data.tetherBois).length >= 5)
          return output.unknownMaybeStack();
        // Otherwise, gg.
        return output.unknown();
      },
      outputStrings: {
        unknownMaybeStack: {
          en: 'No clone: probably stack?',
          de: 'keine Klone: warscheinlich kein debuff + stack?',
          fr: 'Pas de clone : package ?',
          ja: 'クローン無し: 多分シェア?',
          cn: '没有分身: 或许要集合?',
          ko: '클론 없음: 아마도 오른쪽/함께 맞기?',
        },
        unknown: {
          en: 'No clone: ???',
          de: 'keine Klone: ???',
          fr: 'Pas de clone : ???',
          ja: 'クローン無し: ???',
          cn: '没有分身: ¿¿¿',
          ko: '클론 없음: ???',
        },
        defamation: {
          en: 'Defamation on YOU',
          de: 'Ehrenstrafe aud DIR',
          fr: 'Diffamation sur VOUS',
          ja: '名誉罰',
          cn: '名誉罪',
          ko: '명예형: 보스 밑에서 나 홀로!!!',
        },
        solidarity: {
          en: 'Shared Sentence: stack',
          de: 'Urteil Kollektivstrafe: stack',
          fr: 'Peine collective : packez-vous',
          ja: '集団罰: ',
          cn: '集团罪',
          ko: '집단형: 오른쪽/함께 맞기',
        },
        severity: {
          en: 'Severity: avoid shared stack',
          de: 'Erschwertes: geteilter stack ausweichen',
          fr: 'Sévérité : éloignez-vous du package',
          ja: '加重罰',
          cn: '加重罪：远离分摊',
          ko: '가중형; 왼쪽/가중형끼리 모이기',
        },
        noDebuff: {
          en: 'No debuff: shared stack',
          de: 'Kein debuff: geteilter stack',
          fr: 'Pas de debuff : package partagé',
          ja: 'デバフ無し',
          cn: '无Debuff：分组分摊',
          ko: '디버프 없음; 오른쪽/함께 맞기',
        },
      },
    },
    {
      id: 'TEA Alpha Ordained Motion 1',
      netRegex: NetRegexes.ability({ source: 'Perfect Alexander', id: '4B0D', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '完美亚历山大', id: '4B0D', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Perfekter Alexander', id: '4B0D', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Alexander parfait', id: '4B0D', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'パーフェクト・アレキサンダー', id: '4B0D', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '완전체 알렉산더', id: '4B0D', capture: false }),
      durationSeconds: 8,
      suppressSeconds: 20,
      infoText: (data, _, output) => output.motionFirst(),
      run: function(data) {
        data.firstAlphaOrdainedText = 'motionFirst';
      },
      outputStrings: {
        motionFirst: ordainedOutputStrings.motionFirst,
      },
    },
    {
      id: 'TEA Alpha Ordained Stillness 1',
      netRegex: NetRegexes.ability({ source: 'Perfect Alexander', id: '4B0E', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '完美亚历山大', id: '4B0E', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Perfekter Alexander', id: '4B0E', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Alexander parfait', id: '4B0E', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'パーフェクト・アレキサンダー', id: '4B0E', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '완전체 알렉산더', id: '4B0E', capture: false }),
      durationSeconds: 8,
      suppressSeconds: 20,
      infoText: (data, _, output) => output.stillnessFirst(),
      run: function(data) {
        data.firstAlphaOrdainedText = 'stillnessFirst';
      },
      outputStrings: {
        stillnessFirst: ordainedOutputStrings.stillnessFirst,
      },
    },
    {
      id: 'TEA Alpha Ordained Motion 2',
      netRegex: NetRegexes.abilityFull({ source: 'Perfect Alexander', id: '4899', capture: false }),
      netRegexCn: NetRegexes.abilityFull({ source: '完美亚历山大', id: '4899', capture: false }),
      netRegexDe: NetRegexes.abilityFull({ source: 'Perfekter Alexander', id: '4899', capture: false }),
      netRegexFr: NetRegexes.abilityFull({ source: 'Alexander parfait', id: '4899', capture: false }),
      netRegexJa: NetRegexes.abilityFull({ source: 'パーフェクト・アレキサンダー', id: '4899', capture: false }),
      netRegexKo: NetRegexes.abilityFull({ source: '완전체 알렉산더', id: '4899', capture: false }),
      durationSeconds: 15,
      suppressSeconds: 20,
      infoText: function(data, _, output) {
        data.secondAlphaOrdainedText = 'motionSecond';
        return output.combined({
          action1: output[data.firstAlphaOrdainedText](),
          action2: output[data.secondAlphaOrdainedText](),
        });
      },
      tts: (data, _, output) => output[data.secondAlphaOrdainedText](),
      outputStrings: ordainedOutputStrings,
    },
    {
      id: 'TEA Alpha Ordained Stillness 2',
      netRegex: NetRegexes.abilityFull({ source: 'Perfect Alexander', id: '489A', capture: false }),
      netRegexCn: NetRegexes.abilityFull({ source: '完美亚历山大', id: '489A', capture: false }),
      netRegexDe: NetRegexes.abilityFull({ source: 'Perfekter Alexander', id: '489A', capture: false }),
      netRegexFr: NetRegexes.abilityFull({ source: 'Alexander parfait', id: '489A', capture: false }),
      netRegexJa: NetRegexes.abilityFull({ source: 'パーフェクト・アレキサンダー', id: '489A', capture: false }),
      netRegexKo: NetRegexes.abilityFull({ source: '완전체 알렉산더', id: '489A', capture: false }),
      durationSeconds: 15,
      suppressSeconds: 20,
      infoText: function(data, _, output) {
        data.secondAlphaOrdainedText = 'stillnessSecond';
        return output.combined({
          action1: output[data.firstAlphaOrdainedText](),
          action2: output[data.secondAlphaOrdainedText](),
        });
      },
      tts: (data, _, output) => output[data.secondAlphaOrdainedText](),
      outputStrings: ordainedOutputStrings,
    },
    {
      id: 'TEA Alpha Safe Spot',
      // The non-safe alexanders use 489F.
      netRegex: NetRegexes.abilityFull({ source: 'Perfect Alexander', id: '49AA' }),
      netRegexCn: NetRegexes.abilityFull({ source: '完美亚历山大', id: '49AA' }),
      netRegexDe: NetRegexes.abilityFull({ source: 'Perfekter Alexander', id: '49AA' }),
      netRegexFr: NetRegexes.abilityFull({ source: 'Alexander parfait', id: '49AA' }),
      netRegexJa: NetRegexes.abilityFull({ source: 'パーフェクト・アレキサンダー', id: '49AA' }),
      netRegexKo: NetRegexes.abilityFull({ source: '완전체 알렉산더', id: '49AA' }),
      durationSeconds: 10,
      infoText: function(data, matches, output) {
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
        const rot0 = Math.atan2(78.28883 - 100, 100 - 91.00694);
        const rot1 = Math.atan2(91.00694 - 100, 100 - 78.28883);
        const scale = rot1 - rot0; // == Math.PI / 4

        const x = matches.x - 100;
        const y = 100 - matches.y;
        // idx is in [0, 1, 2, 3]
        const idx = parseInt(Math.round((Math.atan2(x, y) - rot0) / scale));

        // Store in case anybody wants to mark this.
        data.safeAlphaIdx = idx;
        data.safeAlphaPos = [matches.x, matches.y];

        // Unknown idx?
        if (idx !== 1 && idx !== 2)
          return;

        if (data.me === data.alphaDefamation) {
          if (idx === 1)
            return output.defamationFrontLeft();
          return output.defamationFrontRight();
        }

        if (idx === 1)
          return output.partyBackRight();
        return output.partyBackLeft();
      },
      outputStrings: {
        defamationFrontLeft: {
          en: 'Defamation: front left',
          de: 'Ehrenstrafe: vorne links',
          fr: 'Diffamation : devant à gauche',
          ja: '名誉: 左前',
          cn: '名誉罪: 左前',
          ko: '명예: 왼쪽 앞!!!',
        },
        defamationFrontRight: {
          en: 'Defamation: front right',
          de: 'Ehrenstrafe: vorne rechts',
          fr: 'Diffamation : devant à droite',
          ja: '名誉: 右前',
          cn: '名誉罪: 右前',
          ko: '명예: 오른쪽 앞!!!',
        },
        partyBackRight: {
          en: 'Party: back right',
          de: 'Gruppe: hinten rechts',
          fr: 'Groupe : arrière droite',
          ja: '右後ろ',
          cn: '右后',
          ko: '오른쪽 뒤!!!',
        },
        partyBackLeft: {
          en: 'Party: back left',
          de: 'Gruppe: hinten links',
          fr: 'Groupe : arrière gauche',
          ja: '左後ろ',
          cn: '左后',
          ko: '왼쪽 뒤!!!',
        },
      },
    },
    {
      id: 'TEA Alpha Resolve First Motion',
      netRegex: NetRegexes.ability({ source: 'Perfect Alexander', id: '487C', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '完美亚历山大', id: '487C', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Perfekter Alexander', id: '487C', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Alexander parfait', id: '487C', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'パーフェクト・アレキサンダー', id: '487C', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '완전체 알렉산더', id: '487C', capture: false }),
      // 5 seconds until mechanic
      delaySeconds: 2.2,
      alertText: function(data, _, output) {
        if (data.firstAlphaOrdainedText === 'motionFirst')
          return output.moveFirst();

        return output.stillnessFirst();
      },
      outputStrings: {
        moveFirst: {
          en: 'Move First',
          de: 'Zuerst bewegen',
          fr: 'Bougez en premier',
          ja: '最初は動く',
          cn: '首先移动',
          ko: '우선 움직이기',
        },
        stillnessFirst: {
          en: 'Stillness First',
          de: 'Zuerst Stillstehen',
          fr: 'Restez immobile en premier',
          ja: '最初は止まる',
          cn: '首先静止',
          ko: '우선 멈추기',
        },
      },
    },
    {
      id: 'TEA Alpha Resolve Second Motion',
      netRegex: NetRegexes.ability({ source: 'Perfect Alexander', id: '487C', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '完美亚历山大', id: '487C', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Perfekter Alexander', id: '487C', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Alexander parfait', id: '487C', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'パーフェクト・アレキサンダー', id: '487C', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '완전체 알렉산더', id: '487C', capture: false }),
      // ~4 seconds until mechanic (to avoid overlapping with first)
      delaySeconds: 7.2,
      alertText: function(data, _, output) {
        if (data.secondAlphaOrdainedText === 'motionSecond')
          return output.keepMoving();

        return output.stopEverything();
      },
      outputStrings: {
        keepMoving: {
          en: 'Keep Moving',
          de: 'weiter bewegen',
          fr: 'Continuez à bouger',
          ja: '最後は動く',
          cn: '保持移动',
          ko: '마지막엔 움직이기',
        },
        stopEverything: {
          en: 'Stop Everything',
          de: 'Alles stoppen',
          fr: 'Arrêtez tout',
          ja: '最後は止まる',
          cn: '保持静止',
          ko: '마지막엔 멈추기',
        },
      },
    },
    {
      id: 'TEA Beta Instructions',
      netRegex: NetRegexes.tether({ id: '0062', capture: false }),
      condition: (data) => data.phase === 'beta',
      delaySeconds: 1,
      suppressSeconds: 10,
      run: function(data) {
        // See notes in TEA Alpha Instructions about what's going on here.
        const sortedIds = Object.keys(data.tetherBois).sort().reverse();
        const sortedNames = sortedIds.map((x) => data.tetherBois[x]);

        data.betaBait = [sortedNames[0], sortedNames[1]];
        data.betaJumps = [sortedNames[0], sortedNames[2], sortedNames[6]];

        data.betaIndex = sortedNames.indexOf(data.me);
      },
    },
    {
      id: 'TEA Beta Instructions Callout',
      netRegex: NetRegexes.tether({ id: '0062', capture: false }),
      condition: (data) => data.phase === 'beta',
      preRun: (data, _, output) => {
        // data.betaIndex won't be resolved until 1s delay and 'TEA Beta Instructions' runs.
        // So make this a function, and defer the lookup of data.betaIndex.
        data.betaInstructions = (idx) => {
          if (typeof idx !== 'number') {
            console.error(`TEA Beta Instructions Callout: non-number idx: ${idx}`);
            return output.unknown();
          }
          const strings = {
            '-1': output.unknown(),
            '0': output.purpleBait(),
            '1': output.orangeBait(),
            '2': output.purpleNoTether(),
            '3': output.orangeNoTether(),
            '4': output.purpleCloseTether(),
            '5': output.orangeCloseTether(),
            '6': output.purpleFarTether(),
            '7': output.orangeFarTether(),
          };

          if (idx in strings)
            return strings[idx];

          console.error(`TEA Beta Instructions Callout: missing idx: ${idx}`);
          return output.unknown();
        };
      },
      delaySeconds: 2,
      durationSeconds: 35,
      suppressSeconds: 10,
      // TODO: switch this all to a response.
      alarmText: function(data) {
        // Baiters get an alarm text.
        if (data.betaBait.includes(data.me))
          return data.betaInstructions(data.betaIndex);
      },
      alertText: function(data) {
        // The west and south jump get an alert text.
        if (data.betaBait.includes(data.me))
          return;
        if (data.betaJumps.includes(data.me))
          return data.betaInstructions(data.betaIndex);
      },
      infoText: function(data) {
        // The rest of the group (going north) gets info.
        if (data.betaBait.includes(data.me))
          return;
        if (data.betaJumps.includes(data.me))
          return;
        return data.betaInstructions(data.betaIndex);
      },
      outputStrings: {
        unknown: {
          // If you don't know, it's probably best for you to pretend like
          // you're running E->S so that there's a jump there and you
          // don't kill your friends stacking north.
          en: 'No Clone: maybe purple E->S ???',
          de: 'Keine Klone: vielleicht Lila O->S ???',
          fr: 'Pas de Clone : peut-être E->S ???',
          ja: 'クローン無し: 多分東から南???',
          cn: '没有分身: 可能紫色 东->南 ???',
          ko: '클론 없음: 아마도 동→남 ???',
        },
        purpleBait: {
          en: 'Purple Bait: bait E',
          de: 'Lila Köder: locke O',
          fr: 'Attirez le Violet : attirez à l\'E',
          ja: '逃亡監察: 東へ',
          cn: '紫色引导: 东',
          ko: '보라/도망감찰: 유도역할/동쪽',
        },
        orangeBait: {
          en: 'Orange Bait: bait N',
          de: 'Orange Köder: locke N',
          fr: 'Attirez l\'Orange : attirez au N',
          ja: '接触保護: 北へ',
          cn: '橙色引导: 北',
          ko: '노랑/접촉보호: 유도역할/북쪽',
        },
        purpleNoTether: {
          en: 'Purple, no tether: E->W',
          de: 'Lila, keine Verbindung: O->W',
          fr: 'Violet, pas de lien : E->O',
          ja: '逃亡禁止, 線無し: 東から西へ',
          cn: '紫色, 无连线: 东->西',
          ko: '보라/접촉금지/선없음: 동→서',
        },
        orangeNoTether: {
          // This person also has the shared sentence.
          en: 'Orange, no tether: E->N',
          de: 'Orange, keine Verbindung: O->N',
          fr: 'Orange, pas de lien : E->N',
          ja: '接触禁止, 線無し: 東から北へ',
          cn: '橙色, 无连线: 东->北',
          ko: '노랑/접촉금지/선없음: 동→북',
        },
        purpleCloseTether: {
          en: 'Purple, close tether: E->N',
          de: 'Lila, nahe Verbindungr: O->N',
          fr: 'Violet, lien rapproché : E->N',
          ja: '逃亡禁止, 接近強制: 東から北へ',
          cn: '紫色, 接近连线: 东->北',
          ko: '보라/도망금지/강제접근: 동→북',
        },
        orangeCloseTether: {
          en: 'Orange, close tether: E->N',
          de: 'Orange, nahe Verbindung: O->N',
          fr: 'Orange, lien rapproché : E->N',
          ja: '接触禁止, 接近強制: 東から北へ',
          cn: '橙色, 接近连线: 东->北',
          ko: '노랑/접촉금지/강제접근: 동→북',
        },
        purpleFarTether: {
          en: 'Purple, far tether: E->S',
          de: 'Lila, entfernte Verbindung: O->S',
          fr: 'Violet, lien éloigné : E->S',
          ja: '逃亡禁止, 接近禁止: 東から南へ',
          cn: '紫色, 远离连线: 东->南',
          ko: '보라/도망금지/접근금지: 동→남',
        },
        orangeFarTether: {
          en: 'Orange, far tether: E->N',
          de: 'Orange, entfernte Verbindung: O->N',
          fr: 'Orange, lien éloigné : E->N',
          ja: '接触禁止, 接近禁止: 東から北へ',
          cn: '橙色, 远离连线: 东->北',
          ko: '노랑/접촉금지/접근금지: 동→북',
        },
      },
    },
    {
      id: 'TEA Beta Radiant',
      netRegex: NetRegexes.abilityFull({ source: 'Perfect Alexander', id: '489E' }),
      netRegexCn: NetRegexes.abilityFull({ source: '完美亚历山大', id: '489E' }),
      netRegexDe: NetRegexes.abilityFull({ source: 'Perfekter Alexander', id: '489E' }),
      netRegexFr: NetRegexes.abilityFull({ source: 'Alexander parfait', id: '489E' }),
      netRegexJa: NetRegexes.abilityFull({ source: 'パーフェクト・アレキサンダー', id: '489E' }),
      netRegexKo: NetRegexes.abilityFull({ source: '완전체 알렉산더', id: '489E' }),
      infoText: function(data, matches, output) {
        // Track which perfect alexander clone did this.
        data.radiantSourceId = matches.sourceId;

        // Round location to nearest cardinal.
        const x = matches.x - 100;
        const y = 100 - matches.y;
        // 0 = N, 1 = E, 2 = S, 3 = W
        const idx = Math.round((Math.atan2(x, y) / Math.PI * 2 + 4)) % 4;
        data.radiantOutputStringKey = {
          // North shouldn't be possible.
          // But, leaving this here in case my math is wrong.
          0: 'north',
          1: 'east',
          2: 'south',
          3: 'west',
        }[idx];
        if (data.radiantOutputStringKey)
          return output[data.radiantOutputStringKey]();
      },
      outputStrings: radiantOutputStrings,
    },
    {
      // For reference:
      // Spread (on Alexander) is 48A0.
      // Stack (on Alexander) is 48A1.
      // Spread (per person) is 48A2.
      // Stack (two people) is 48A3.
      id: 'TEA Beta Optical Spread',
      netRegex: NetRegexes.abilityFull({ source: 'Perfect Alexander', id: '48A0', capture: false }),
      netRegexCn: NetRegexes.abilityFull({ source: '完美亚历山大', id: '48A0', capture: false }),
      netRegexDe: NetRegexes.abilityFull({ source: 'Perfekter Alexander', id: '48A0', capture: false }),
      netRegexFr: NetRegexes.abilityFull({ source: 'Alexander parfait', id: '48A0', capture: false }),
      netRegexJa: NetRegexes.abilityFull({ source: 'パーフェクト・アレキサンダー', id: '48A0', capture: false }),
      netRegexKo: NetRegexes.abilityFull({ source: '완전체 알렉산더', id: '48A0', capture: false }),
      infoText: (data, _, output) => output.text(),
      run: function(data) {
        data.betaIsOpticalStack = false;
      },
      outputStrings: {
        text: {
          en: 'Optical Spread',
          de: 'Visier verteilen',
          fr: 'Dispersion optique',
          ja: '散開',
          cn: '分散',
          ko: '옵티컬: 산개',
        },
      },
    },
    {
      id: 'TEA Beta Optical Stack',
      netRegex: NetRegexes.abilityFull({ source: 'Perfect Alexander', id: '48A1', capture: false }),
      netRegexCn: NetRegexes.abilityFull({ source: '完美亚历山大', id: '48A1', capture: false }),
      netRegexDe: NetRegexes.abilityFull({ source: 'Perfekter Alexander', id: '48A1', capture: false }),
      netRegexFr: NetRegexes.abilityFull({ source: 'Alexander parfait', id: '48A1', capture: false }),
      netRegexJa: NetRegexes.abilityFull({ source: 'パーフェクト・アレキサンダー', id: '48A1', capture: false }),
      netRegexKo: NetRegexes.abilityFull({ source: '완전체 알렉산더', id: '48A1', capture: false }),
      infoText: (data, _, output) => output.text(),
      run: function(data) {
        data.betaIsOpticalStack = true;
      },
      outputStrings: {
        text: {
          en: 'Optical Stack',
          de: 'Visier sammeln',
          fr: 'Package optique',
          ja: 'シェア',
          cn: '分摊',
          ko: '옵티컬: 모이기',
        },
      },
    },
    {
      id: 'TEA Beta Optical Final',
      netRegex: NetRegexes.ability({ source: 'Perfect Alexander', id: '4B14', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '完美亚历山大', id: '4B14', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Perfekter Alexander', id: '4B14', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Alexander parfait', id: '4B14', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'パーフェクト・アレキサンダー', id: '4B14', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '완전체 알렉산더', id: '4B14', capture: false }),
      delaySeconds: 12.2,
      alertText: function(data, _, output) {
        if (!data.betaIsOpticalStack)
          return output.opticalSpread();

        if (data.betaBait.includes(data.me))
          return output.opticalStackOnYou();
      },
      infoText: function(data, _, output) {
        if (!data.betaIsOpticalStack)
          return;

        // Error?
        if (data.betaBait.length === 0)
          return output.opticalStack();

        const names = data.betaBait.map((x) => x ? data.ShortName(x) : output.unknown()).sort();
        return output.opticalStackPlayers({ players: names.join(', ') });
      },
      outputStrings: {
        unknown: {
          en: '???',
          de: '???',
          fr: '???',
          ja: '???',
          cn: '???',
          ko: '???',
        },
        opticalStack: {
          en: 'Optical Stack',
          de: 'Visier sammeln',
          fr: 'Package optique',
          ja: 'オプチカル 集合',
          cn: '集合',
          ko: '옵티컬: 모이기',
        },
        opticalStackPlayers: {
          en: 'Optical Stack (${players})',
          de: 'Visier sammeln (${players})',
          fr: 'Package optique (${players})',
          ja: 'オプチカル 集合 (${players})',
          cn: '集合 (${players})',
          ko: '옵티컬: 모이기 (${players})',
        },
        opticalSpread: {
          en: 'Optical Spread',
          de: 'Visier verteilen',
          fr: 'Dispersion optique',
          ja: '散開',
          cn: '分散',
          ko: '옵티컬: 산개',
        },
        opticalStackOnYou: {
          en: 'Optical Stack on YOU',
          de: 'Visier sammeln auf DIR',
          fr: 'Package optique sur VOUS',
          ja: '自分にシェア',
          cn: '集合点名',
          ko: '옵티컬: 나에게 모이기',
        },
      },
    },
    {
      id: 'TEA Beta Radiant Final',
      netRegex: NetRegexes.ability({ source: 'Perfect Alexander', id: '4B14', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '完美亚历山大', id: '4B14', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Perfekter Alexander', id: '4B14', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Alexander parfait', id: '4B14', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'パーフェクト・アレキサンダー', id: '4B14', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '완전체 알렉산더', id: '4B14', capture: false }),
      delaySeconds: 16,
      alertText: function(data, _, output) {
        if (data.radiantOutputStringKey)
          return output[data.radiantOutputStringKey]();
      },
      outputStrings: radiantOutputStrings,
    },
    {
      id: 'TEA Ordained Punishment',
      netRegex: NetRegexes.startsUsing({ source: 'Perfect Alexander', id: '4891' }),
      netRegexCn: NetRegexes.startsUsing({ source: '完美亚历山大', id: '4891' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Perfekter Alexander', id: '4891' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Alexander parfait', id: '4891' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'パーフェクト・アレキサンダー', id: '4891' }),
      netRegexKo: NetRegexes.startsUsing({ source: '완전체 알렉산더', id: '4891' }),
      // Because this is two in a row, make this second one info.
      response: Responses.tankBusterSwap('info', 'alarm'),
    },
    {
      id: 'TEA Trine Get Middle',
      netRegex: NetRegexes.ability({ source: 'Perfect Alexander', id: '488E', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '完美亚历山大', id: '488E', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Perfekter Alexander', id: '488E', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Alexander parfait', id: '488E', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'パーフェクト・アレキサンダー', id: '488E', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '완전체 알렉산더', id: '488E', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Stack Middle for Trine',
          de: 'Mittig sammeln für Trine',
          fr: 'Packez-vous au milieu pour Trine',
          ja: '大審判来るよ',
          cn: '大审判 中间集合',
          ko: '대심판이 옵니다, 가운데로',
        },
      },
    },
    {
      id: 'TEA Trine Initial',
      netRegex: NetRegexes.abilityFull({ source: 'Perfect Alexander', id: '488F', x: '100', y: '(?:92|100|108)' }),
      netRegexCn: NetRegexes.abilityFull({ source: '完美亚历山大', id: '488F', x: '100', y: '(?:92|100|108)' }),
      netRegexDe: NetRegexes.abilityFull({ source: 'Perfekter Alexander', id: '488F', x: '100', y: '(?:92|100|108)' }),
      netRegexFr: NetRegexes.abilityFull({ source: 'Alexander parfait', id: '488F', x: '100', y: '(?:92|100|108)' }),
      netRegexJa: NetRegexes.abilityFull({ source: 'パーフェクト・アレキサンダー', id: '488F', x: '100', y: '(?:92|100|108)' }),
      netRegexKo: NetRegexes.abilityFull({ source: '완전체 알렉산더', id: '488F', x: '100', y: '(?:92|100|108)' }),
      preRun: function(data, matches) {
        data.trine = data.trine || [];
        // See: https://imgur.com/a/l1n9MhS
        data.trine.push({
          92: 'r',
          100: 'g',
          108: 'y',
        }[matches.y]);
      },
      alertText: function(data, _, output) {
        // Call out after two, because that's when the mechanic is fully known.
        if (data.trine.length !== 2)
          return;

        // Find the third one based on the first two.
        const three = ['r', 'g', 'y'].filter((x) => !data.trine.includes(x));

        // Start on the third trine, then move to the first.
        const threeOne = three + data.trine[0];

        // For parks and other forestry solutions.
        const locations = {
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

        switch (threeOne) {
        case 'gr':
          data.secondTrineResponse = 'north';
          return output.waitMiddleDodgeNorth();
        case 'rg':
          data.secondTrineResponse = 'south';
          return output.goNorthDodgeSouth();
        case 'ry':
          data.secondTrineResponse = 'west';
          return output.goNorthDodgeWest();
        case 'yr':
          data.secondTrineResponse = 'east';
          return output.goSouthDodgeEast();
        case 'gy':
          data.secondTrineResponse = 'south';
          return output.waitMiddleDodgeSouth();
        case 'yg':
          data.secondTrineResponse = 'north';
          return output.goSouthDodgeNorth();
        }
      },
      outputStrings: {
        waitMiddleDodgeNorth: {
          en: 'Wait Middle, Dodge North',
          de: 'Warte in der Mitte, ausweichen nach Norden',
          fr: 'Attendez au milieu, esquivez au Nord',
          ja: '中央から北へ',
          cn: '中间 -> 北',
          ko: '가운데서 북쪽으로',
        },
        goNorthDodgeSouth: {
          en: 'Go 1 North, Dodge South',
          de: 'Geh nach Norden, ausweichen nach Süden',
          fr: 'Allez 1 au Nord, esquivez au Sud',
          ja: '北から中央へ',
          cn: '北 -> 中间',
          ko: '북쪽에서 가운데로',
        },
        goNorthDodgeWest: {
          en: 'Go 1 North, Dodge West',
          de: 'Geh nach Norden, ausweichen nach Westen',
          fr: 'Allez 1 au Nord, esquivez à l\'Ouest',
          ja: '北から西へ',
          cn: '北 -> 西',
          ko: '북쪽에서 서쪽으로',
        },
        goSouthDodgeEast: {
          en: 'Go 1 South, Dodge East',
          de: 'Geh nach Süden, ausweichen nach Osten',
          fr: 'Allez 1 au Sud, esquivez à l\'Est',
          ja: '南から東へ',
          cn: '南 -> 东',
          ko: '남쪽에서 동쪽으로',
        },
        waitMiddleDodgeSouth: {
          en: 'Wait Middle, Dodge South',
          de: 'Warte in der Mitte, ausweichen nach Süden',
          fr: 'Attendez au milieu, esquivez au Sud',
          ja: '中央から南へ',
          cn: '中间 -> 南',
          ko: '가운데서 남쪽으로',
        },
        goSouthDodgeNorth: {
          en: 'Go 1 South, Dodge North',
          de: 'Geh nach Süden, ausweichen nach Norden',
          fr: 'Allez 1 au Sud, esquivez au Nord',
          ja: '南から北へ',
          cn: '南 -> 北',
          ko: '남쪽에서 북쪽으로',
        },
      },
    },
    {
      id: 'TEA Trine Second',
      netRegex: NetRegexes.abilityFull({ source: 'Perfect Alexander', id: '4890', capture: false }),
      netRegexCn: NetRegexes.abilityFull({ source: '完美亚历山大', id: '4890', capture: false }),
      netRegexDe: NetRegexes.abilityFull({ source: 'Perfekter Alexander', id: '4890', capture: false }),
      netRegexFr: NetRegexes.abilityFull({ source: 'Alexander parfait', id: '4890', capture: false }),
      netRegexJa: NetRegexes.abilityFull({ source: 'パーフェクト・アレキサンダー', id: '4890', capture: false }),
      netRegexKo: NetRegexes.abilityFull({ source: '완전체 알렉산더', id: '4890', capture: false }),
      suppressSeconds: 15,
      alertText: function(data, _, output) {
        return output[data.secondTrineResponse]();
      },
      outputStrings: {
        north: Outputs.north,
        east: Outputs.east,
        south: {
          // It is a bit different in JA/CN that players should go middle instead of south,
          // so leave it alone.
          en: 'South',
          de: 'Süden',
          fr: 'Sud',
          ja: '中央へ',
          cn: '中间',
          ko: '가운데로',
        },
        west: Outputs.west,
      },
    },
    {
      id: 'TEA Irresistible Grace',
      netRegex: NetRegexes.startsUsing({ source: 'Perfect Alexander', id: '4894' }),
      netRegexCn: NetRegexes.startsUsing({ source: '完美亚历山大', id: '4894' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Perfekter Alexander', id: '4894' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Alexander parfait', id: '4894' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'パーフェクト・アレキサンダー', id: '4894' }),
      netRegexKo: NetRegexes.startsUsing({ source: '완전체 알렉산더', id: '4894' }),
      // Don't collide with trine.
      delaySeconds: 2,
      response: Responses.stackMarkerOn('info'),
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
        'Jagd Doll': 'Jagdpuppe',
        'Judgment Crystal': 'Urteilskristall',
        'Liquid Hand': 'belebte Hand',
        'Living Liquid': 'belebtes Wasser',
        'Liquid Rage': 'levitierte Rage',
        'Perfect Alexander': 'Perfekter Alexander',
        'Steam Chakram': 'Dampf-Chakram',
      },
      'replaceText': {
        '--Cruise Chaser Invincible--': '--Chaser-Mecha unverwundbar--',
        '--alex untargetable--': '--alex nich anvisierbar--',
        'Almighty Judgment': 'Göttliches Letzturteil',
        'Alpha Sword': 'Alpha-Schwert',
        'Apocalyptic Ray': 'Apokalyptischer Strahl ',
        'Cascade': 'Kaskade',
        'Chakrams': 'Chakrams',
        'Chastening Heat': 'Brennende Verdammung',
        'Collective Reprobation': 'Kollektivstrafe',
        'Divine Judgment': 'Göttliches Urteil',
        'Divine Spear': 'Heiliger Speer',
        'Double Rocket Punch': 'Doppelraketenschlag',
        'Down for the Count': 'Am Boden',
        'Drainage': 'Entwässerung',
        'Earth Missile': 'Erd-Geschoss',
        'Embolus': 'Pfropfen',
        'Enumeration': 'Enumeration',
        'Eternal Darkness': 'Ewiges Dunkel',
        'Exhaust': 'Abgase',
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
        'Inception(?! )': 'Raumzeit-Eingriff',
        'Inception Formation': 'Raumzeit-Eingriffsformation',
        'Incinerating Heat': 'Sengende Hitze',
        'Irresistible Grace': 'Sammelurteil',
        'J Jump': 'Gewissenssprung',
        'J Kick': 'Gewissenstritt',
        'J Storm': 'Gerechter Sturm',
        'Judgment Crystal': 'Urteilskristall',
        'Judgment Nisi': 'Vorläufige Vollstreckung',
        'Limit Cut': 'Grenzwertüberschreitung',
        'Link-Up': 'Zusammenschluss',
        'Mega Holy': 'Super-Sanctus',
        'Middle Blaster': 'Mitte - Blaster',
        'Missile Command': 'Raketenkommando',
        'Optical Sight': 'Visier',
        'Ordained Capital Punishment': 'Gnadenlose Ahndung',
        'Ordained Motion': 'Bewegungsbefehl',
        'Ordained Punishment': 'Ahndung',
        'Photon': 'Photon',
        'Players Remaining': 'Spieler übrig',
        'Propeller Wind': 'Luftschraube',
        'Protean Wave': 'Proteische Welle',
        '(?<! )Repentance': 'Reue',
        'Rage Wave': 'Rage - Welle',
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
    },
    {
      'locale': 'fr',
      'replaceSync': {
        '(?<! )Alexander(?! )': 'Alexander',
        'Alexander Prime': 'Primo-Alexander',
        'Brute Justice': 'Justicier',
        'Cruise Chaser': 'Croiseur-chasseur',
        'Jagd Doll': 'poupée jagd',
        'Judgment Crystal': 'Cristal du jugement',
        'Liquid Hand': 'membre liquide',
        'Liquid Rage': 'furie liquide',
        'Living Liquid': 'liquide vivant',
        'Perfect Alexander': 'Alexander parfait',
        'Steam Chakram': 'chakram de vapeur',
      },
      'replaceText': {
        '--alex untargetable--': '--alex non ciblable--',
        '--Cruise Chaser Invincible--': '--Croiseur-chasseur Invincible--',
        'Almighty Judgment': 'Sentence divine',
        'Alpha Sword': 'Épée alpha',
        'Apocalyptic Ray': 'Rayon apocalyptique',
        'Cascade': 'Cascade',
        'Chakrams': 'Chakrams',
        'Chastening Heat': 'Chaleur de l\'ordalie',
        'Divine Judgment': 'Jugement divin',
        'Divine Spear': 'Épieu divin',
        'Double Rocket Punch': 'Double coup de roquette',
        'Down for the Count': 'Au tapis',
        'Drainage': 'Drainage',
        'Earth Missile': 'Missile de terre',
        'Embolus': 'Caillot',
        'Enumeration': 'Compte',
        'Eternal Darkness': 'Ténèbres éternelles',
        'Exhaust': 'Échappement',
        'Fate:': 'Sorts :',
        'Fate Calibration': 'Bilan futurologique',
        'Fate Projection': 'Étude futurologique',
        'Final Sentence': 'Peine capitale',
        'Flarethrower': 'Lance-brasiers',
        'Fluid Strike': 'Frappe fluide',
        'Fluid Swing': 'Coup fluide',
        'Gavel': 'Conclusion de procès',
        'Hand of Pain': 'Main de douleur',
        'Hand of Prayer/Parting': 'Main de prière/séparation',
        'Hawk Blaster': 'Canon faucon',
        'Hidden Minefield': 'Champ de mines caché',
        'Inception(?! )': 'Commencement',
        'Inception Formation': 'Marche du commencement',
        'Incinerating Heat': 'Chaleur purifiante',
        'Individual/Collective Reprobation': 'Réprobation individuelle/collective',
        'Irresistible Grace': 'Peines interdépendantes',
        'J Jump': 'Bond justicier',
        'J Kick': 'Pied justicier',
        'J Storm \\+ Waves': 'Tempête justicière + Vagues',
        'Judgment Crystal': 'Cristal du jugement',
        'Judgment Nisi': 'Jugement conditionnel',
        'Limit Cut': 'Dépassement de limites',
        'Link-Up': 'Effort collectif',
        'Mega Holy': 'Méga Miracle',
        'Middle Blaster': 'Canon au milieu',
        'Missile Command': 'Commande missile',
        'Obloquy, Solidarity and 3x Severity': 'Infamie, Solidarité et 3x Sévérité',
        'Optical Sight': 'Visée optique',
        'Ordained Capital Punishment': 'Châtiment exemplaire',
        'Ordained Motion/Stillness': 'Défense de s\'arrêter/de bouger',
        'Ordained Punishment': 'Châtiment',
        'Photon': 'Photon',
        'Players Remaining': 'Joueurs restants',
        'Propeller Wind': 'Vent turbine',
        'Protean Wave': 'Vague inconstante',
        'Rage Wave': 'Vague inconstante',
        '(?<! )Repentance': 'Repentir',
        'Sacrament': 'Sacrement',
        'Surety and Severity': 'Serment et Sévérité',
        'Surety and Solidarity': 'Serment et Solidarité',
        'Surety, Solidarity and Severity': 'Serment, Solidarité et Sévérité',
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
        'Throttle': 'Cadence Améliorée',
        'True Heart': 'Affection féline',
        'Void Of Repentance': 'Vide du repentir',
        'Water and Thunder': 'Eau et Foudre',
        'Whirlwind': 'Tornade',
        'Wormhole Formation': 'Marche de la fracture dimensionnelle',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        '(?<! )Alexander(?! )': 'アレキサンダー',
        'Alexander Prime': 'アレキサンダー・プライム',
        'Brute Justice': 'ブルートジャスティス',
        'Cruise Chaser': 'クルーズチェイサー',
        'Jagd Doll': 'ヤークトドール',
        'Liquid Hand': 'リキッドハンド',
        'Liquid Rage': 'リキッドレイジ',
        'Living Liquid': 'リビングリキッド',
        'Perfect Alexander': 'パーフェクト・アレキサンダー',
        'Steam Chakram': 'スチームチャクラム',
      },
      'replaceText': {
        '--alex untargetable--': '--アレキサンダー タゲ不可--',
        '--Cruise Chaser Invincible--': '--クルーズチェイサー インビン--',
        'Almighty Judgment(?! Reveal)': '聖なる大審判',
        'Almighty Judgment Reveal': '聖なる大審判 出現',
        'Alpha Sword': 'アルファソード',
        'Apocalyptic Ray': 'アポカリプティクレイ',
        'Cascade': 'カスケード',
        'Chakrams': 'ビームチャクラム',
        'Chastening Heat': '神罰の熱線',
        'Divine Judgment': '聖なる審判',
        'Divine Spear': '聖なる炎',
        'Double Rocket Punch': 'ダブルロケットパンチ',
        'Down for the Count': 'ノックダウン',
        'Drainage': 'ドレナージ',
        'Earth Missile': 'アースミサイル',
        'Embolus': 'エンボラス',
        'Enumeration': 'カウント',
        'Eternal Darkness': '暗黒の運命',
        'Exhaust': '汚染蒸気',
        'Fate:': '未来観測:',
        'Fate Calibration': '未来確定',
        'Fate Projection': '未来観測',
        'Final Sentence': '死刑判決',
        'Flarethrower': '大火炎放射',
        'Fluid Strike': 'フルイドストライク',
        'Fluid Swing': 'フルイドスイング',
        'Gavel': '最後の審判：結審',
        'Hand of Pain': 'ハンド・オブ・ペイン',
        'Hand of Prayer': 'ハンド・オブ・プレイヤー',
        'Hawk Blaster': 'ホークブラスター',
        'Hidden Minefield': 'ステルス地雷散布',
        'Inception(?! )': '時空潜行',
        'Inception Formation': '時空潜行のマーチ',
        'Incinerating Heat': '浄化の熱線',
        'Individual/Collective Reprobation': '個の断罪/群の断罪',
        'Irresistible Grace': '連帯刑',
        'J Jump': 'ジャスティスジャンプ',
        'J Kick': 'ジャスティスキック',
        'J Storm': 'ジャスティスストーム',
        'Judgment Crystal': '審判の結晶',
        'Judgment Nisi': 'ジャッジメントナイサイ',
        'Limit Cut': 'リミッターカット',
        'Link-Up': 'システムリンク',
        'Mega Holy': 'メガホーリー',
        'Middle Blaster': '中央のブラスター',
        'Missile Command': 'ミサイル全弾発射',
        'Obloquy, Solidarity and 3x Severity': '汚名 + 連帯 + 3x 重罰の神判',
        'Optical Sight': '照準',
        'Ordained Capital Punishment': '加重誅罰',
        'Ordained Motion/Stillness': '行動命令/静止命令',
        'Ordained Punishment': '誅罰',
        'Photon': 'フォトン',
        'Players Remaining': 'プレーヤー残り',
        'Propeller Wind': 'プロペラウィンド',
        'Protean Wave': 'プロティアンウェイブ',
        'Radiant Sacrament': '拝火の秘蹟',
        'Rage Wave': 'リキッドレイジ ウェイブ',
        '(?<! )Repentance': '罪の意識',
        '(?<!Radiant )Sacrament': '十字の秘蹟',
        'Surety and Severity': '誓約 + 重罰の神判',
        'Surety and Solidarity': '誓約 + 連帯の神判',
        'Surety, Solidarity and Severity': '誓約 + 連帯 + 重罰の神判',
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
        'Throttles': '窒息',
        'Void Of Repentance': '懺悔の間',
        'Water and Thunder': 'クラッシュサンダー',
        'Whirlwind': '竜巻',
        'Wormhole Formation': '次元断絶のマーチ',
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
        'Steam Chakram': '蒸汽战轮',
      },
      'replaceText': {
        '--Cruise Chaser Invincible--': '--巡航驱逐者无敌--',
        '--alex untargetable--': '--亚历山大无法选中--',
        'True Heart': '真心',
        'Waves': '水波',
        '/Parting': '/离别之手',
        '/Stillness': '/静止命令',
        'Individual/': '单体/',
        'Reveal': '生效',
        ' and': '',
        'Fate: ': '未来: ',
        'Almighty Judgment': '神圣大审判',
        'Alpha Sword': '阿尔法之剑',
        'Apocalyptic Ray': '末世宣言',
        'Cascade': '倾泻',
        'Chakrams': '轮轮',
        'Chastening Heat': '神罚射线',
        'Collective Reprobation': '群体断罪',
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
        'Final Sentence': '死刑判决',
        'Flarethrower': '大火炎放射',
        'Fluid Strike': '流体强袭',
        'Fluid Swing': '流体摆动',
        'Gavel': '终审闭庭',
        'Hand of Pain': '苦痛之手',
        'Hand of Prayer': '祈祷之手',
        'Hawk Blaster': '鹰式破坏炮',
        'Hidden Minefield': '隐形地雷散布',
        'Inception(?! )': '时空潜行',
        'Inception Formation': '时空潜行阵列',
        'Incinerating Heat': '净化射线',
        'Irresistible Grace': '株连',
        'J Jump': '正义之跃',
        'J Kick': '正义飞踢',
        'J Storm': '正义旋风',
        'Judgment Crystal': '审判结晶',
        'Judgment Nisi': '非最终审判',
        'Limit Cut': '限制器减档',
        'Link-Up': '系统连接',
        'Mega Holy': '百万神圣',
        'Middle Blaster': '中间冲击波',
        'Missile Command': '导弹齐发',
        'Obloquy': '污名神判',
        'Optical Sight': '制导',
        'Ordained Capital Punishment': '加重诛罚',
        'Ordained Motion': '行动命令',
        'Ordained Punishment': '诛罚',
        'Photon': '光子炮',
        'Players Remaining': '剩余玩家',
        'Propeller Wind': '螺旋桨强风',
        'Protean Wave': '万变水波',
        'Rage Wave': '活水之怒',
        '(?<! )Repentance': '罪恶感',
        'Radiant ': '拜火',
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
        'Void Of Repentance': '忏悔区',
        'Water': '水',
        'Thunder': '雷',
        'Whirlwind': '龙卷风',
        'Wormhole Formation': '次元断绝阵列',
      },
    },
    {
      'locale': 'ko',
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
        'Steam Chakram': '증기 차크람',
      },
      'replaceText': {
        '--Cruise Chaser Invincible--': '--순항추격기 무적--',
        '--alex untargetable--': '--알렉산더 타겟 불가능--',
        'True Heart': '진심',
        'Reveal': '예고',
        'Almighty Judgment': '성스러운 대심판',
        'Alpha Sword': '알파검',
        'Apocalyptic Ray': '파멸 계시',
        'Cascade': '폭포수',
        'Chakrams': '차크람',
        'Chastening Heat': '신벌의 열선',
        'Collective Reprobation': '무리 단죄',
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
        '/Stillness': '정지 명령',
        'Fate: ': '미래: ',
        'Fate Calibration': '미래 확정',
        'Fate Projection': '미래 관측',
        'Final Sentence': '사형 판결',
        'Flarethrower': '대화염방사',
        'Fluid Strike': '유체 강타',
        'Fluid Swing': '유체 타격',
        'Gavel': '최후의 심판: 폐정',
        'Hand of Pain': '고통의 손길',
        'Hand of Prayer/Parting': '기도/작별의 손길',
        'Hawk Blaster': '호크 블래스터',
        'Hidden Minefield': '은폐 지뢰 살포',
        'Inception(?! )': '시공 잠행',
        'Inception Formation': '시공 잠행 대형',
        'Incinerating Heat': '정화의 열선',
        'Individual/': '개체/',
        'Irresistible Grace': '연대 형벌',
        'J Jump': '정의의 점프',
        'J Kick': '정의의 발차기',
        'J Storm': '정의의 폭풍',
        'Waves': '충격파',
        'Judgment Crystal': '심판의 결정체',
        'Judgment Nisi': '임시처분',
        'Limit Cut': '리미터 해제',
        'Link-Up': '시스템 연결',
        'Mega Holy': '메가 홀리',
        'Middle Blaster': '중앙 블래스터', // CHECKME
        'Missile Command': '미사일 전탄 발사',
        'Optical Sight': '조준',
        'Ordained Capital Punishment': '가중 처벌',
        'Ordained Motion': '행동 명령',
        'Ordained Punishment': '처벌',
        'Photon': '광자',
        ' Players Remaining': '명 남음',
        'Propeller Wind': '추진 돌풍',
        'Protean Wave': '변화의 물결',
        'Radiant Sacrament': '원형 성례',
        'Rage Wave': '물기둥 물결',
        '(?<! )Repentance': '참회의 방',
        '(?<! )Sacrament': '십자 성례',
        'Sacrament x3': '십자 성례 x3',
        'Surety and Severity': '서약/중벌의 심판',
        'Surety, Solidarity and Severity': '서약/중벌/연대의 심판',
        'Obloquy, Solidarity and 3x Severity': '오명/연대/중벌의 심판',
        'Surety and Solidarity': '서약/연대의 심판',
        'Sluice': '봇물',
        'Spin Crusher': '회전 분쇄',
        'Splash': '물장구',
        'Summon Alexander': '알렉산더 소환',
        'Super Blassty Charge': '슈퍼 블래스티 돌진',
        'Super Jump': '슈퍼 점프',
        'Temporal Interference': '시공 간섭',
        'Temporal Prison': '시간의 감옥',
        'Temporal Stasis': '시간 정지',
        'The Final Word': '확정 판결',
        'Throttles': '질식', // CHECKME
        'Void Of Repentance': '참회의 방',
        'Water and Thunder': '물+번개 징',
        'Whirlwind': '회오리바람',
        'Wormhole Formation': '차원 단절 대형',
      },
    },
  ],
};
