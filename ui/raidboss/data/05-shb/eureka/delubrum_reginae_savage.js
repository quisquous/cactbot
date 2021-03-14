import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';

// TODO: warnings for mines after bosses?

// TODO: headmarkers of course have a random offset here eyeroll

const seekerCenterX = -0.01531982;
const seekerCenterY = 277.9735;

// TODO: promote something like this to Conditions?
const tankBusterOnParty = (data, matches) => {
  if (data.target === data.me)
    return true;
  if (data.role !== 'healer')
    return false;
  return data.party.inParty(data.target);
};

const getFacing = (combatant) => {
  // Snap heading to closest card.
  // N = 0, E = 1, S = 2, W = 3
  return (2 - Math.round(combatant.Heading * 4 / Math.PI) / 2) % 4;
};

const getUnwaveringPosition = (combatant) => {
  // Positions are moved downward 87 and left 277
  const y = combatant.PosY + 87;
  const x = combatant.PosX + 277;
  // N = 0, E = 1, S = 2, W = 3
  return Math.round(2 - 2 * Math.atan2(x, y) / Math.PI) % 4;
};

export default {
  zoneId: ZoneId.DelubrumReginaeSavage,
  timelineFile: 'delubrum_reginae_savage.txt',
  timelineTriggers: [
    {
      id: 'DelubrumSav Avowed Glory Of Bozja',
      regex: /Glory Of Bozja/,
      // Cast itself is 5.5 seconds, add more warning
      beforeSeconds: 7,
      condition: Conditions.caresAboutAOE(),
      response: Responses.bigAoe(),
    },
    {
      id: 'DelubrumSav Lord Vicious Swipe',
      regex: /Vicious Swipe/,
      // There are different timings in the first and second phase.
      // Consistently use 5 seconds beforehand for both.
      beforeSeconds: 5,
      response: Responses.knockback(),
    },
    {
      id: 'DelubrumSav Lord Fateful Words',
      regex: /Fateful Words/,
      // Paired with trigger id 'DelubrumSav Lord Labyrinthine Fate Collect'
      // 97E: Wanderer's Fate, Pushes outward on Fateful Word cast
      // 97F: Sacrifice's Fate, Pulls to middle on Fateful Word cast
      // Labyrinthine Fate is cast and 1 second later debuffs are applied
      // First set of debuffs go out 7.7 seconds before Fateful Word is cast
      // Remaining set of debuffs go out 24.3 seconds before Fateful Word is cast
      beforeSeconds: 3.5,
      alertText: (data, _, output) => {
        if (data.labyrinthineFate === '97F')
          return output.getOut();
        else if (data.labyrinthineFate === '97E')
          return output.getIn();
      },
      outputStrings: {
        getOut: Outputs.out,
        getIn: Outputs.in,
      },
    },
    {
      id: 'DelubrumSav Lord Thunderous Discharge',
      regex: /Thunderous Discharge/,
      // Cast in the timeline is 5 seconds, but there is an additional .5 second cast before damage
      beforeSeconds: 7,
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'DelubrumSav Queen Empyrean Iniquity',
      regex: /Empyrean Iniquity/,
      // Cast itself is 5 seconds, add more warning
      beforeSeconds: 7,
      condition: Conditions.caresAboutAOE(),
      response: Responses.bigAoe(),
    },
    {
      id: 'DelubrumSav Queen Gods Save The Queen',
      regex: /Gods Save The Queen$/,
      // Cast in the timeline is 5 seconds, but there is an additional 1 second cast before damage
      beforeSeconds: 7,
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
  ],
  triggers: [
    {
      id: 'DelubrumSav Seeker Verdant Tempest',
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Seeker', id: '5AD3', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Trinität Der Sucher', id: '5AD3', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Trinité Soudée', id: '5AD3', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'トリニティ・シーカー', id: '5AD3', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'DelubrumSav Seeker Baleful Swath',
      // This is an early warning on the Verdant Path cast.
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Seeker', id: '5A98', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Trinität Der Sucher', id: '5A98', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Trinité Soudée', id: '5A98', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'トリニティ・シーカー', id: '5A98', capture: false }),
      response: Responses.goFrontBack('info'),
    },
    {
      id: 'DelubrumSav Seeker Act Of Mercy',
      // This is an early warning on the Verdant Path cast.
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Seeker', id: '5A97', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Trinität Der Sucher', id: '5A97', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Trinité Soudée', id: '5A97', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'トリニティ・シーカー', id: '5A97', capture: false }),
      alertText: (data, _, outputs) => outputs.text(),
      outputStrings: {
        text: {
          // "Intercardinals" may confuse people between absolute and relative,
          // so add in the "of boss" just to be extra clear.
          en: 'Go Intercardinal of Boss',
          de: 'Geh in eine Intercardinale Himmelsrichtung vom Boss',
          ja: 'ボスの斜めへ',
        },
      },
    },
    {
      id: 'DelubrumSav Seeker Iron Impact',
      // This is an early warning on the Verdant Path cast.
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Seeker', id: '5A99', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Trinität Der Sucher', id: '5A99', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Trinité Soudée', id: '5A99', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'トリニティ・シーカー', id: '5A99', capture: false }),
      alertText: (data, _, outputs) => outputs.text(),
      outputStrings: {
        text: {
          en: 'Get Behind For Line Stack',
          de: 'Geh hinter den Boss für Linien-Stack',
        },
      },
    },
    {
      id: 'DelubrumSav Seeker Baleful Onslaught Buster',
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Seeker', id: '5AD5', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Trinität Der Sucher', id: '5AD5', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Trinité Soudée', id: '5AD5', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'トリニティ・シーカー', id: '5AD5', capture: false }),
      response: (data, _, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          avoidTankCleave: Outputs.avoidTankCleave,
          sharedTankBuster: {
            en: 'Shared Tank Buster',
            de: 'Geteilter Tank Buster',
            ja: '頭割りタンクバスター',
          },
        };

        if (data.role === 'tank' || data.role === 'healer')
          return { alertText: output.sharedTankBuster() };
        return { infoText: output.avoidTankCleave() };
      },
    },
    {
      id: 'DelubrumSav Seeker Baleful Onslaught Solo',
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Seeker', id: '5AD6', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Trinität Der Sucher', id: '5AD6', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Trinité Soudée', id: '5AD6', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'トリニティ・シーカー', id: '5AD6', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Solo Tank Cleave',
          de: 'Solo Tank Cleave',
          ja: 'ソロタンクバスター',
        },
      },
    },
    {
      id: 'DelubrumSav Seeker Baleful Blade Out',
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Seeker', id: '5ABE', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Trinität Der Sucher', id: '5ABE', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Trinité Soudée', id: '5ABE', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'トリニティ・シーカー', id: '5ABE', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Hide Behind Barricade',
          de: 'Hinter den Barrikaden verstecken',
          ja: '柵の後ろに',
        },
      },
    },
    {
      id: 'DelubrumSav Seeker Baleful Blade Knockback',
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Seeker', id: '5ABF', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Trinität Der Sucher', id: '5ABF', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Trinité Soudée', id: '5ABF', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'トリニティ・シーカー', id: '5ABF', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Knockback Into Barricade',
          de: 'Rückstoß in die Barrikaden',
          ja: '柵に吹き飛ばされる',
        },
      },
    },
    {
      id: 'DelubrumSav Seeker Dead Iron',
      // Headmarkers are randomized, so use the tether instead.
      netRegex: NetRegexes.tether({ target: 'Trinity Seeker', id: '01DB' }),
      netRegexDe: NetRegexes.tether({ target: 'Trinität Der Sucher', id: '01DB' }),
      netRegexFr: NetRegexes.tether({ target: 'Trinité Soudée', id: '01DB' }),
      netRegexJa: NetRegexes.tether({ target: 'トリニティ・シーカー', id: '01DB' }),
      condition: (data, matches) => matches.source === data.me,
      alarmText: (data, _, output) => output.earthshaker(),
      outputStrings: {
        earthshaker: {
          en: 'Earthshaker, away from boss',
          de: 'Erdstoß, weg vom Boss',
        },
      },
    },
    {
      id: 'DelubrumSav Seeker Iron Splitter',
      netRegex: NetRegexes.startsUsing({ source: ['Trinity Seeker', 'Seeker Avatar'], id: '5AC0' }),
      netRegexDe: NetRegexes.startsUsing({ source: ['Trinität Der Sucher', 'Spaltteil Der Sucher'], id: '5AC0' }),
      netRegexFr: NetRegexes.startsUsing({ source: ['Trinité Soudée', 'Clone De La Trinité Soudée'], id: '5AC0' }),
      netRegexJa: NetRegexes.startsUsing({ source: ['トリニティ・シーカー', 'シーカーの分体'], id: '5AC0' }),
      preRun: (data) => delete data.ironSplitter,
      promise: async (data, matches) => {
        const seekerData = await window.callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.sourceId, 16)],
        });

        if (seekerData === null) {
          console.error(`Iron Splitter: null data`);
          return;
        }
        if (!seekerData.combatants) {
          console.error(`Iron Splitter: null combatants`);
          return;
        }
        if (seekerData.combatants.length !== 1) {
          console.error(`Iron Splitter: expected 1, got ${seekerData.combatants.length}`);
          return;
        }

        const seeker = seekerData.combatants[0];
        const x = seeker.PosX - seekerCenterX;
        const y = seeker.PosY - seekerCenterY;
        data.splitterDist = Math.hypot(x, y);
      },
      alertText: (data, _, output) => {
        if (data.splitterDist === undefined)
          return;

        // All 100 examples I've looked at only hit distance=10, or distance=~14
        // Guessing at the other distances, if they exist.
        //
        // blue inner = 0?
        // white inner = 6?
        // blue middle = 10
        // white middle = 14
        // blue outer = 18?
        // white outer = 22?

        const isWhite = Math.floor(data.splitterDist / 4) % 2;
        return isWhite ? output.goBlue() : output.goWhite();
      },
      outputStrings: {
        goBlue: {
          en: 'Blue Stone',
          de: 'Blauer Stein',
        },
        goWhite: {
          en: 'White Sand',
          de: 'Weißer Sand',
        },
      },
    },
    {
      id: 'DelubrumSav Dahu Shockwave',
      netRegex: NetRegexes.startsUsing({ source: 'Dahu', id: ['5770', '576F'] }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Dahu', id: ['5770', '576F'] }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Dahu', id: ['5770', '576F'] }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダウー', id: ['5770', '576F'] }),
      // There's a 3s slow windup on the first, then a 1s opposite cast.
      suppressSeconds: 10,
      alertText: (data, matches, output) => {
        if (matches.id === '5770')
          return output.leftThenRight();
        return output.rightThenLeft();
      },
      outputStrings: {
        leftThenRight: {
          en: 'Left, Then Right',
          de: 'Links, dann Rechts',
          fr: 'Gauche, puis droite',
          ja: '左 => 右',
          cn: '左 => 右',
          ko: '왼쪽 => 오른쪽',
        },
        rightThenLeft: {
          en: 'Right, Then Left',
          de: 'Rechts, dann Links',
          fr: 'Droite, puis gauche',
          ja: '右 => 左',
          cn: '右 => 左',
          ko: '오른쪽 => 왼쪽',
        },
      },
    },
    {
      id: 'DelubrumSav Guard Blood And Bone Warrior and Knight',
      // 5831 from Queen's Warrior
      // 5821 from Queen's Knight
      netRegex: NetRegexes.startsUsing({ source: ['Queen\'s Warrior', 'Queen\'s Knight'], id: ['5831', '5821'], capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: ['Kriegerin Der Königin', 'Ritter Der Königin'], id: ['5831', '5821'], capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: ['Guerrière De La Reine', 'Chevalier De La Reine'], id: ['5831', '5821'], capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: ['クイーンズ・ウォリアー', 'クイーンズ・ナイト'], id: ['5831', '5821'], capture: false }),
      condition: Conditions.caresAboutAOE(),
      suppressSeconds: 1,
      response: Responses.aoe(),
    },
    {
      id: 'DelubrumSav Guard Queen\'s Shot and Blood And Bone Soldier',
      // 5854 from Queen's Gunner
      // 5841 from Queen's Soldier
      netRegex: NetRegexes.startsUsing({ source: ['Queen\'s Gunner', 'Queen\'s Soldier'], id: ['5854', '5841'], capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: ['Schütze Der Königin', 'Soldat Der Königin'], id: ['5854', '5841'], capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: ['Fusilier De La Reine', 'Soldat De La Reine'], id: ['5854', '5841'], capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: ['クイーンズ・ガンナー', 'クイーンズ・ソルジャー'], id: ['5854', '5841'], capture: false }),
      condition: Conditions.caresAboutAOE(),
      suppressSeconds: 1,
      response: Responses.aoe(),
    },
    {
      id: 'DelubrumSav Guard Optimal Offensive Sword',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Knight', id: '5819', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Ritter Der Königin', id: '5819', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Chevalier De La Reine', id: '5819', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'クイーンズ・ナイト', id: '5819', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Take Outside Bombs',
          de: 'Nimm die äußeren Bomben',
          ja: '外の爆弾を取る',
        },
      },
    },
    {
      id: 'DelubrumSav Guard Optimal Offensive Shield',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Knight', id: '581A', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Ritter Der Königin', id: '581A', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Chevalier De La Reine', id: '581A', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'クイーンズ・ナイト', id: '581A', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Knockback Away From Sphere',
          de: 'Rückstoß weg von der Sphere',
          ja: 'ノックバック、玉から離れる',
        },
      },
    },
    {
      id: 'DelubrumSav Guard Optimal Play Sword',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Knight', id: '5816', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Ritter Der Königin', id: '5816', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Chevalier De La Reine', id: '5816', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'クイーンズ・ナイト', id: '5816', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Out, Avoid Cleaves',
          de: 'Raus, weiche den Cleaves aus',
          ja: '外へ、範囲攻撃注意',
        },
      },
    },
    {
      id: 'DelubrumSav Guard Optimal Play Shield',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Knight', id: '5817', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Ritter Der Königin', id: '5817', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Chevalier De La Reine', id: '5817', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'クイーンズ・ナイト', id: '5817', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'In, Avoid Cleaves',
          de: 'Rein, weiche den Cleaves aus',
          ja: '中へ、範囲攻撃注意',
        },
      },
    },
    {
      id: 'DelubrumSav Guard Yellow Tether',
      netRegex: NetRegexes.tether({ source: 'Queen\'s Warrior', target: 'Queen\'s Knight', id: '0088', capture: false }),
      netRegexDe: NetRegexes.tether({ source: 'Kriegerin Der Königin', target: 'Ritter Der Königin', id: '0088', capture: false }),
      netRegexFr: NetRegexes.tether({ source: 'Guerrière De La Reine', target: 'Chevalier De La Reine', id: '0088', capture: false }),
      netRegexJa: NetRegexes.tether({ source: 'クイーンズ・ウォリアー', target: 'クイーンズ・ナイト', id: '0088', capture: false }),
      // Yellow tether between Knight and Warrior gives them a Physical Vulnerability Down debuff.
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Spellforge on physical dps',
          de: 'Zauberschmied auf physische DDs',
          ja: '物理DPSはスペルフォージ',
        },
      },
    },
    {
      id: 'DelubrumSav Guard Purple Tether',
      netRegex: NetRegexes.tether({ source: 'Queen\'s Warrior', target: 'Queen\'s Knight', id: '0089', capture: false }),
      netRegexDe: NetRegexes.tether({ source: 'Kriegerin Der Königin', target: 'Ritter Der Königin', id: '0089', capture: false }),
      netRegexFr: NetRegexes.tether({ source: 'Guerrière De La Reine', target: 'Chevalier De La Reine', id: '0089', capture: false }),
      netRegexJa: NetRegexes.tether({ source: 'クイーンズ・ウォリアー', target: 'クイーンズ・ナイト', id: '0089', capture: false }),
      // Yellow tether between Knight and Warrior gives them a Physical Vulnerability Down debuff.
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Steelsting on magical dps',
          de: 'Stahlstachels auf magische DDs',
          ja: '魔法DPSはスチールスティング',
        },
      },
    },
    {
      id: 'DelubrumSav Guard Fiery Portent',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Soldier', id: '583F' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Soldat Der Königin', id: '583F' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Soldat De La Reine', id: '583F' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'クイーンズ・ソルジャー', id: '583F' }),
      delaySeconds: (data, matches) => parseFloat(matches.castTime) - 2.5,
      durationSeconds: 5.5,
      response: Responses.stopEverything('alarm'),
    },
    {
      id: 'DelubrumSav Guard Icy Portent',
      // Assuming you need to move for 3 seconds (duration of Pyretic from Fiery Portent)
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Soldier', id: '5840' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Soldat Der Königin', id: '5840' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Soldat De La Reine', id: '5840' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'クイーンズ・ソルジャー', id: '5840' }),
      delaySeconds: (data, matches) => parseFloat(matches.castTime) - 2.5,
      durationSeconds: 5.5,
      response: Responses.moveAround('alert'),
    },
    {
      id: 'DelubrumSav Guard Coat of Arms',
      netRegex: NetRegexes.startsUsing({ source: 'Aetherial Ward', id: '5820' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Magisch(?:e|er|es|en) Barriere', id: '5820' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Barrière Magique', id: '5820' }),
      netRegexJa: NetRegexes.startsUsing({ source: '魔法障壁', id: '5820' }),
      netRegexCn: NetRegexes.startsUsing({ source: '魔法障壁', id: '5820' }),
      netRegexKo: NetRegexes.startsUsing({ source: '마법 장벽', id: '5820' }),
      delaySeconds: (data, matches) => parseFloat(matches.castTime) - 2.5,
      suppressSeconds: 1,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Stop attacking',
          de: 'Angriffe stoppen',
          fr: 'Arrêtez d\'attaquer',
          ja: 'ブロックしない側に攻撃',
          cn: '攻击未格挡的方向',
          ko: '공격 중지',
        },
      },
    },
    {
      id: 'DelubrumSav Phantom Malediction Of Agony',
      netRegex: NetRegexes.startsUsing({ source: 'Bozjan Phantom', id: '57BD', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Bozja-Phantom', id: '57BD', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Fantôme Bozjien', id: '57BD', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ボズヤ・ファントム', id: '57BD', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'DelubrumSav Phantom Stuffy Wrath',
      // Spawns after 57BA Summon, either North (-403.5) or South (-344.5)
      // Casts 57C2 Undying Hatred
      netRegex: NetRegexes.addedCombatantFull({ npcNameId: '9756' }),
      durationSeconds: 5,
      suppressSeconds: 1,
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          goSouth: {
            en: 'Go South, Unavoidable Knocbkack',
            de: 'Geh nach Süden, unvermeidbarer Rückstoß',
          },
          goNorth: {
            en: 'Go North, Unavoidable Knocbkack',
            de: 'Geh nach Norden, unvermeidbarer Rückstoß',
          },
        };

        // The sum of the two possible spawn locations divided by two.
        if (parseFloat(matches.y) < -374)
          return { alertText: output.goNorth() };
        return { alertText: output.goSouth() };
      },
    },
    {
      id: 'DelubrumSav Phantom Vile Wave',
      netRegex: NetRegexes.startsUsing({ source: 'Bozjan Phantom', id: '57BF', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Bozja-Phantom', id: '57BF', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Fantôme Bozjien', id: '57BF', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ボズヤ・ファントム', id: '57BF', capture: false }),
      response: Responses.getBehind('alert'),
    },
    {
      id: 'DelubrumSav Phantom Ice Spikes',
      // Ice Spikes (effectId: '9E0') reflects damage, wait for Dispel
      // Buff expires about 16 seconds on first cast, ~8 seconds later casts)
      netRegex: NetRegexes.startsUsing({ source: 'Bozjan Phantom', id: '57BC', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Bozja-Phantom', id: '57BC', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Fantôme Bozjien', id: '57BC', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ボズヤ・ファントム', id: '57BC', capture: false }),
      delaySeconds: 3,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Stop Attacking, Dispel Ice Spikes',
          de: 'Angriffe stoppen, entferne Eisstachel',
        },
      },
    },
    {
      id: 'DelubrumSav Phantom Excruciation',
      netRegex: NetRegexes.startsUsing({ source: 'Bozjan Phantom', id: '57BE' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Bozja-Phantom', id: '57BE' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Fantôme Bozjien', id: '57BE' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ボズヤ・ファントム', id: '57BE' }),
      condition: tankBusterOnParty,
      response: Responses.tankBuster(),
    },
    {
      id: 'DelubrumSav Avowed Wrath Of Bozja',
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Avowed', id: '594E', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Trinität Der Eingeschworenen', id: '594E', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Trinité Féale', id: '594E', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'トリニティ・アヴァウド', id: '594E', capture: false }),
      response: (data, _, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          avoidTankCleave: Outputs.avoidTankCleave,
          sharedTankBuster: {
            en: 'Shared Tank Buster',
            de: 'Geteilter Tank Buster',
          },
        };

        if (data.role === 'tank' || data.role === 'healer')
          return { alertText: output.sharedTankBuster() };
        return { infoText: output.avoidTankCleave() };
      },
    },
    {
      id: 'DelubrumSav Avowed Fury Of Bozja',
      // Allegiant Arsenal 5987 = staff (out), followed up with Fury of Bozja 594C
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Avowed', id: '5987', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Trinität Der Eingeschworenen', id: '5987', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Trinité Féale', id: '5987', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'トリニティ・アヴァウド', id: '5987', capture: false }),
      response: Responses.getOut('alert'),
    },
    {
      id: 'DelubrumSav Avowed Flashvane',
      // Allegiant Arsenal 5986 = bow (get behind), followed up by Flashvane 594B
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Avowed', id: '5986', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Trinität Der Eingeschworenen', id: '5986', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Trinité Féale', id: '5986', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'トリニティ・アヴァウド', id: '5986', capture: false }),
      response: Responses.getBehind('alert'),
    },
    {
      id: 'DelubrumSav Avowed Infernal Slash',
      // Allegiant Arsenal 5985 = sword (get front), followed up by Infernal Slash 594A
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Avowed', id: '5985', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Trinität Der Eingeschworenen', id: '5985', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Trinité Féale', id: '5985', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'トリニティ・アヴァウド', id: '5985', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get In Front',
          de: 'Geh vor den Boss',
          ja: 'ボスの正面へ',
          ko: '정면에 서기',
        },
      },
    },
    {
      id: 'DelubrumSav Avowed Temperature Collect',
      // These come from Environment, Trinity Avowed, Avowed Avatar, Swirling Orb
      // 89C Normal
      // 89D Running Hot: +1
      // 8DC Running Cold: -1
      // 8E2 Running Cold: -2
      // 8A4 Running Hot: +2
      netRegex: NetRegexes.gainsEffect({ effectId: ['89C', '89D', '8DC', '8E2', '8A4'] }),
      condition: Conditions.targetIsYou(),
      run: (data, matches) => {
        const temperature = {
          '89C': 0,
          '89D': 1,
          '8DC': -1,
          '8E2': -2,
          '8A4': 2,
        };
        data.currentTemperature = temperature[matches.effectId.toUpperCase()];
      },
    },
    {
      id: 'DelubrumSav Avowed Brand Collect',
      // These come from Environment, E0000000
      // 8E5 Hot Brand: +1
      // 8F3 Hot Brand: +2
      // 8F4 Cold Brand: +1
      // 8F8 Cold Brand: +2
      netRegex: NetRegexes.gainsEffect({ effectId: ['8E5', '8F3', '8F4', '8F8'] }),
      condition: Conditions.targetIsYou(),
      run: (data, matches) => {
        const brand = {
          '8E5': 1,
          '8F3': 2,
          '8F4': -1,
          '8F8': -2,
        };
        data.currentBrand = brand[matches.effectId.toUpperCase()];
      },
    },
    {
      id: 'DelubrumSav Avowed Hot And Cold Unwavering Apparations',
      // The buffs come out before the spell cast
      // Trinity Avowed and/or Avowed Avatar receive one of these buffs:
      // 8F9: Hot Blade: +1
      // 8FA: Hot Blade: +2
      // 8FB: Cold Blade: -1
      // 8FC: Cold Blade: -2
      // Positional data in statusEffectsParams is often not up to date, use promise
      //
      // Trigger delayed until after Blade Of Entropy happens about ~100ms after
      // to get left/right cleave info
      netRegex: NetRegexes.gainsEffect({ effectId: ['8F9', '8FA', '8FB', '8FC'] }),
      delaySeconds: 0.3,
      suppressSeconds: 1,
      promise: async (data, matches, output) => {
        const trinityLocaleNames = {
          en: 'Trinity Avowed',
          de: 'Trinität Der Eingeschworenen',
          fr: 'Trinité Féale',
          ja: 'トリニティ・アヴァウ',
        };

        const avatarLocaleNames = {
          en: 'Avowed Avatar',
          de: 'Spaltteil der Eingeschworenen',
          fr: 'Clone De La Trinité Féale',
          ja: 'アヴァウドの分体',
        };

        // select the Trinity and Avatars
        let combatantNameBoss = null;
        let combatantNameAvatar = null;
        combatantNameBoss = trinityLocaleNames[data.parserLang];
        combatantNameAvatar = avatarLocaleNames[data.parserLang];

        let combatantDataBoss = null;
        let combatantDataAvatars = null;
        if (combatantNameBoss) {
          combatantDataBoss = await window.callOverlayHandler({
            call: 'getCombatants',
            names: [combatantNameBoss],
          });
        }
        if (combatantNameAvatar) {
          combatantDataAvatars = await window.callOverlayHandler({
            call: 'getCombatants',
            names: [combatantNameAvatar],
          });
        }

        // if we could not retrieve combatant data, the
        // trigger will not work, so just resume promise here
        if (combatantDataBoss === null) {
          console.error(`Trinity Avowed: null data`);
          data.safeZone = null;
          return;
        }
        if (!combatantDataBoss.combatants) {
          console.error(`Trinity Avowed: null combatants`);
          data.safeZone = null;
          return;
        }
        if (combatantDataAvatars === null) {
          console.error(`Avowed Avatar: null data`);
          data.safeZone = null;
          return;
        }
        if (!combatantDataAvatars.combatants) {
          console.error(`Avowed Avatar: null combatants`);
          data.safeZone = null;
          return;
        }
        if (combatantDataAvatars.combatants.legnth < 3) {
          console.error(`Avowed Avatar: expected at least 3 combatants got ${combatantDataAvatars.combatants.length}`);
          data.safeZone = null;
          return;
        }

        // we need to filter for the Trinity Avowed with the lowest ID
        // that one is always cleaving on one of the cardinals
        // Trinity Avowed is always East (-267, -87)
        const eastCombatant =
          combatantDataBoss.combatants.sort((a, b) => a.ID - b.ID).pop();

        // we need to filter for the three Avowed Avatars with the lowest IDs
        // as they cast cleave at the different cardinals
        const avatarOne = combatantDataAvatars.combatants.sort((a, b) => a.ID - b.ID).pop();
        const avatarTwo = combatantDataAvatars.combatants.pop();
        const avatarThree = combatantDataAvatars.combatants.pop();

        const combatantPositions = {};
        combatantPositions[getUnwaveringPosition(avatarOne)] = avatarOne;
        combatantPositions[getUnwaveringPosition(avatarTwo)] = avatarTwo;
        combatantPositions[getUnwaveringPosition(avatarThree)] = avatarTwo;

        // Avowed Avatars can spawn in the other positions
        // Determine the location of Avowed Avatars
        // North Avowed Avatar (-277, -97)
        const northCombatant = combatantPositions[0];

        // West Avowed Avatar (-277, -87)
        const westCombatant = combatantPositions[3];

        // South Avowed Avatar (-277, -77)
        const southCombatant = combatantPositions[2];

        // Get facings
        const eastCombatantFacing = getFacing(eastCombatant);
        const northCombatantFacing = getFacing(northCombatant);
        const westCombatantFacing = getFacing(westCombatant);
        const southCombatantFacing = getFacing(southCombatant);

        // Get Blade of Entropy data
        const eastCombatantBlade = data.blades[eastCombatant.ID];
        const northCombatantBlade = data.blades[northCombatant.ID];
        const westCombatantBlade = data.blades[westCombatant.ID];
        const southCombatantBlade = data.blades[southCombatant.ID];

        const bladeValues = {
          '5942': 1,
          '5943': -1,
          '5946': 1,
          '5947': -1,
          '5956': 2,
          '5957': -2,
          '595A': 2,
          '595B': -2,
        };

        // 1 = Right
        // 0 = Left
        const bladeSides = {
          '5942': 1,
          '5943': 1,
          '5946': 0,
          '5947': 0,
          '5956': 1,
          '5957': 1,
          '595A': 0,
          '595B': 0,
        };

        // Calculate Zone Values
        //     0   1
        // 2   3   4   5
        // 6   7   8   9
        //    10   11
        const hotZones = {
          0: 0,
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
          6: 0,
          7: 0,
          8: 0,
          9: 0,
          10: 0,
          11: 0,
        };
        const coldZones = {
          0: 0,
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
          6: 0,
          7: 0,
          8: 0,
          9: 0,
          10: 0,
          11: 0,
        };

        // Helper function for changing zone temperature
        const addZoneTemperature = (zoneIndex, bladeValue) => {
          bladeValue < 0 ? coldZones[zoneIndex] += bladeValue : hotZones[zoneIndex] += bladeValue;
        };

        // East combatant zone contribution
        if (eastCombatantFacing === 0 || eastCombatantFacing === 2) {
          // East facing North/South must cleave these zones
          addZoneTemperature(5, bladeValues[eastCombatantBlade]);
          addZoneTemperature(9, bladeValues[eastCombatantBlade]);
        } else if ((bladeSides[eastCombatantBlade] && eastCombatantFacing === 1) ||
          (!bladeSides[eastCombatantBlade] && eastCombatantFacing === 3)) {
          // East facing East cleaving right or facing West cleaving left
          addZoneTemperature(6, bladeValues[eastCombatantBlade]);
          addZoneTemperature(7, bladeValues[eastCombatantBlade]);
          addZoneTemperature(8, bladeValues[eastCombatantBlade]);
          addZoneTemperature(9, bladeValues[eastCombatantBlade]);
          addZoneTemperature(10, bladeValues[eastCombatantBlade]);
          addZoneTemperature(11, bladeValues[eastCombatantBlade]);
        } else if ((!bladeSides[eastCombatantBlade] && eastCombatantFacing === 1) ||
          (bladeSides[eastCombatantBlade] && eastCombatantFacing === 3)) {
          // East facing East cleaving left or facing West cleaving right
          addZoneTemperature(0, bladeValues[eastCombatantBlade]);
          addZoneTemperature(1, bladeValues[eastCombatantBlade]);
          addZoneTemperature(2, bladeValues[eastCombatantBlade]);
          addZoneTemperature(3, bladeValues[eastCombatantBlade]);
          addZoneTemperature(4, bladeValues[eastCombatantBlade]);
          addZoneTemperature(5, bladeValues[eastCombatantBlade]);
        }

        // North combatant zone contribution
        if (northCombatantFacing === 1 || northCombatantFacing === 3) {
          // North facing East/West must cleave these zones
          addZoneTemperature(0, bladeValues[northCombatantBlade]);
          addZoneTemperature(1, bladeValues[northCombatantBlade]);
        } else if ((bladeSides[northCombatantBlade] && northCombatantFacing === 0) ||
          (!bladeSides[northCombatantBlade] && northCombatantFacing === 2)) {
          // North facing North cleaving right or South cleaving left
          addZoneTemperature(1, bladeValues[northCombatantBlade]);
          addZoneTemperature(4, bladeValues[northCombatantBlade]);
          addZoneTemperature(5, bladeValues[northCombatantBlade]);
          addZoneTemperature(8, bladeValues[northCombatantBlade]);
          addZoneTemperature(9, bladeValues[northCombatantBlade]);
          addZoneTemperature(11, bladeValues[northCombatantBlade]);
        } else if ((!bladeSides[northCombatantBlade] && northCombatantFacing === 0) ||
          (bladeSides[northCombatantBlade] && northCombatantFacing === 2)) {
          // North facing North cleaving left or South cleaving right
          addZoneTemperature(0, bladeValues[northCombatantBlade]);
          addZoneTemperature(2, bladeValues[northCombatantBlade]);
          addZoneTemperature(3, bladeValues[northCombatantBlade]);
          addZoneTemperature(6, bladeValues[northCombatantBlade]);
          addZoneTemperature(7, bladeValues[northCombatantBlade]);
          addZoneTemperature(10, bladeValues[northCombatantBlade]);
        }

        // West combatant zone contribution
        if (westCombatantFacing === 0 || westCombatantFacing === 2) {
          // West facing North/South must cleave these zones
          addZoneTemperature(2, bladeValues[westCombatantBlade]);
          addZoneTemperature(6, bladeValues[westCombatantBlade]);
        } else if ((bladeSides[westCombatantBlade] && westCombatantFacing === 1) ||
          (!bladeSides[westCombatantBlade] && westCombatantFacing === 3)) {
          // West facing East cleaving right or West cleaving left
          addZoneTemperature(6, bladeValues[westCombatantBlade]);
          addZoneTemperature(7, bladeValues[westCombatantBlade]);
          addZoneTemperature(8, bladeValues[westCombatantBlade]);
          addZoneTemperature(9, bladeValues[westCombatantBlade]);
          addZoneTemperature(10, bladeValues[westCombatantBlade]);
          addZoneTemperature(11, bladeValues[westCombatantBlade]);
        } else if ((!bladeSides[westCombatantBlade] && westCombatantFacing === 1) ||
          (bladeSides[westCombatantBlade] && westCombatantFacing === 3)) {
          // West facing East cleaving left or West cleaving right
          addZoneTemperature(0, bladeValues[westCombatantBlade]);
          addZoneTemperature(1, bladeValues[westCombatantBlade]);
          addZoneTemperature(2, bladeValues[westCombatantBlade]);
          addZoneTemperature(3, bladeValues[westCombatantBlade]);
          addZoneTemperature(4, bladeValues[westCombatantBlade]);
          addZoneTemperature(5, bladeValues[westCombatantBlade]);
        }

        // South combatant zone contribution
        if (southCombatantFacing === 1 || southCombatantFacing === 3) {
          // South facing East/West must cleave these zones
          addZoneTemperature(10, bladeValues[southCombatantBlade]);
          addZoneTemperature(11, bladeValues[southCombatantBlade]);
        } else if ((bladeSides[southCombatantBlade] && southCombatantFacing === 0) ||
          (!bladeSides[southCombatantBlade] && southCombatantFacing === 2)) {
          // South facing North cleaving right or South cleaving left
          addZoneTemperature(1, bladeValues[southCombatantBlade]);
          addZoneTemperature(4, bladeValues[southCombatantBlade]);
          addZoneTemperature(5, bladeValues[southCombatantBlade]);
          addZoneTemperature(8, bladeValues[southCombatantBlade]);
          addZoneTemperature(9, bladeValues[southCombatantBlade]);
          addZoneTemperature(11, bladeValues[southCombatantBlade]);
        } else if ((!bladeSides[southCombatantBlade] && southCombatantFacing === 0) ||
          (bladeSides[southCombatantBlade] && southCombatantFacing === 2)) {
          // South facing North cleaving left or South cleaving right
          addZoneTemperature(0, bladeValues[southCombatantBlade]);
          addZoneTemperature(2, bladeValues[southCombatantBlade]);
          addZoneTemperature(3, bladeValues[southCombatantBlade]);
          addZoneTemperature(6, bladeValues[southCombatantBlade]);
          addZoneTemperature(7, bladeValues[southCombatantBlade]);
          addZoneTemperature(10, bladeValues[southCombatantBlade]);
        }

        // Calculate location needed for current temperature and brand
        let currentBrand = 0;
        let currentTemperature = 0;

        if (data.currentBrand)
          currentBrand = data.currentBrand;
        if (data.currentTemperature)
          currentTemperature = data.currentTemperature;

        const resultantTemperature = currentTemperature + currentBrand;

        // Check for Safe Zone and find necessary adjacentZone
        // adjacentZones only have one add cleaving them, so we can add the two map keys
        let safeZone = null;
        let adjacentZones = null;
        if (hotZones[3] === 0 && coldZones[3] === 0) {
          adjacentZones = {
            0: hotZones[0] + coldZones[0],
            1: hotZones[4] + coldZones[4],
            2: hotZones[7] + coldZones[7],
            3: hotZones[2] + coldZones[2],
          };
          safeZone = output.northwest();
        } else if (hotZones[4] === 0 && coldZones[4] === 0) {
          adjacentZones = {
            0: hotZones[1] + coldZones[1],
            1: hotZones[5] + coldZones[5],
            2: hotZones[8] + coldZones[8],
            3: hotZones[3] + coldZones[3],
          };
          safeZone = output.northeast();
        } else if (hotZones[7] === 0 && coldZones[7] === 0) {
          adjacentZones = {
            0: hotZones[3] + coldZones[3],
            1: hotZones[8] + coldZones[8],
            2: hotZones[10] + coldZones[10],
            3: hotZones[6] + coldZones[6],
          };
          safeZone = output.southwest();
        } else if (hotZones[8] === 0 && coldZones[8] === 0) {
          adjacentZones = {
            0: hotZones[4] + coldZones[4],
            1: hotZones[9] + coldZones[9],
            2: hotZones[11] + coldZones[11],
            3: hotZones[7] + coldZones[7],
          };
          safeZone = output.southeast();
        } else {
          safeZone = null;
          adjacentZones = null;
        }

        // Find which adjacent zone to go to
        // There should only be one add cleaving in these adjacent zones
        let adjacentZone = null;
        if (resultantTemperature) {
          if (abs(resultantTemperature) < 3) {
            // Aim for 0, if possible, else aim for 1. if possible...
            if (resultantTemperature + adjacentZones[0] === 0)
              adjacentZone = output.north();
            else if (resultantTemperature + adjacentZones[1] === 0)
              adjacentZone = output.east();
            else if (resultantTemperature + adjacentZones[2] === 0)
              adjacentZone = output.south();
            else if (resultantTemperature + adjacentZones[3] === 0)
              adjacentZone = output.west();
            else if (abs(resultantTemperature + adjacentZones[0]) === 1)
              adjacentZone = output.north();
            else if (abs(resultantTemperature + adjacentZones[1]) === 1)
              adjacentZone = output.east();
            else if (abs(resultantTemperature + adjacentZones[2]) === 1)
              adjacentZone = output.south();
            else if (abs(resultantTemperature + adjacentZones[3]) === 1)
              adjacentZone = output.west();
            else
              adjacentZone = null;
          } else {
            // Aim for 1, if possible, else aim for 2, if possible...
            if (abs(resultantTemperature + adjacentZones[0]) === 1)
              adjacentZone = output.north();
            else if (abs(resultantTemperature + adjacentZones[1]) === 1)
              adjacentZone = output.east();
            else if (abs(resultantTemperature + adjacentZones[2]) === 1)
              adjacentZone = output.west();
            else if (abs(resultantTemperature + adjacentZones[3]) === 1)
              adjacentZone = output.south();
            if (abs(resultantTemperature + adjacentZones[0]) === 2)
              adjacentZone = output.north();
            else if (abs(resultantTemperature + adjacentZones[1]) === 2)
              adjacentZone = output.east();
            else if (abs(resultantTemperature + adjacentZones[2]) === 2)
              adjacentZone = output.west();
            else if (abs(resultantTemperature + adjacentZones[3]) === 2)
              adjacentZone = output.south();
            else
              adjacentZone = null;
          }
        } else {
          adjacentZone = null;
        }

        if (safeZone && adjacentZone)
          data.safeZone = output.getCleaved({ dir1: adjacentZone, dir2: safeZone });
        else if (safeZone)
          data.safeZone = output.safeSpot({ dir: safeZone });
        else
          data.safeZone = null;
      },
      infoText: function(data, _, output) {
        return !data.safeZone ? output.unknown() : data.safeZone;
      },
      outputStrings: {
        getCleaved: {
          en: 'Get cleaved ${dir1} of ${dir2} Safe Spot',
        },
        safeSpot: {
          en: 'Safe Spot: ${dir}',
        },
        unknown: {
          en: '???',
          de: '???',
          fr: '???',
          ja: '???',
          cn: '???',
          ko: '???',
        },
        north: Outputs.north,
        northeast: Outputs.northeast,
        east: Outputs.east,
        southeast: Outputs.southeast,
        south: Outputs.south,
        southwest: Outputs.southwest,
        west: Outputs.west,
        northwest: Outputs.northwest,
      },
    },
    {
      id: 'DelubrumSav Avowed Blade of Entropy Collect',
      // Used to get whether left or right cleave is happening and temperature value
      // Trinity Avowed or Avowed Avatar cast these pairs
      // +1 Cleaves
      // 5942 = right cleave, heat (1) paired with 5944
      // 5943 = right cleave, cold (1) paired with 5945
      // 5944 = right cleave, heat (1) paired with 5942
      // 5945 = right cleave, cold (1) paired with 5943
      //
      // 5946 = left cleave, cold (1) paired with 5948
      // 5947 = left cleave, heat (1) paired with 5949
      // 5948 = left cleave, cold (1) paired with 5946
      // 5949 = left cleave, heat (1) paired with 5947
      //
      // +2 Cleaves
      // 5956 = right cleave, heat (2) paired with 5958
      // 5957 = right cleave, cold (2) paired with 5959
      // 5958 = right cleave, heat (2) paired with 5956
      // 5959 = right cleave, cold (2) paired with 5957
      //
      // 595A = left cleave heat (2) paired with 595C
      // 595B = left cleave cold (2) paired with 595D
      // 595C = left cleave heat (2) paired with 595A
      // 595D = left cleave cold (2) paired with 595B
      netRegex: NetRegexes.startsUsing({ source: ['Trinity Avowed', 'Avowed Avatar'], id: ['5942', '5943', '5946', '5947', '5956', '5957', '595A', '595B'] }),
      netRegexDe: NetRegexes.startsUsing({ source: ['Trinität Der Eingeschworenen', 'Spaltteil der Eingeschworenen'], id: ['5942', '5943', '5946', '5947', '5956', '5957', '595A', '595B'] }),
      netRegexFr: NetRegexes.startsUsing({ source: ['Trinité Féale', 'Clone De La Trinité Féale'], id: ['5942', '5943', '5946', '5947', '5956', '5957', '595A', '595B'] }),
      netRegexJa: NetRegexes.startsUsing({ source: ['トリニティ・アヴァウド', 'アヴァウドの分体'], id: ['5942', '5943', '5946', '5947', '5956', '5957', '595A', '595B'] }),
      run: (data, matches) => {
        data.blades = data.blades || {};
        data.blades[matches.sourceId.toUpperCase()] = matches.id.toUpperCase();
      },
    },
    {
      id: 'DelubrumSav Lord Foe Splitter',
      netRegex: NetRegexes.startsUsing({ source: 'Stygimoloch Lord', id: '57D7' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Anführer-Stygimoloch', id: '57D7' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Seigneur Stygimoloch', id: '57D7' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'スティギモロク・ロード', id: '57D7' }),
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          cleaveOnYou: Outputs.tankCleaveOnYou,
          cleaveNoTarget: Outputs.tankCleave,
          avoidCleave: Outputs.avoidTankCleave,
          cleaveOn: {
            en: 'Tank Cleave on ${player}',
            de: 'Tank Cleave auf ${player}',
            ja: '${player}に範囲攻撃',
          },
        };
        if (matches.target === data.me)
          return { alarmText: output.cleaveOnYou() };
        if (tankBusterOnParty(data, matches))
          return { alertText: output.cleaveOn({ player: data.ShortName(matches.target) }) };
        return { infoText: output.avoidCleave() };
      },
    },
    {
      id: 'DelubrumSav Lord Labyrinthine Fate Collect',
      // Result used by timelineTrigger id 'DelubrumSav Lord Fateful Words'
      netRegex: NetRegexes.gainsEffect({ effectId: '97[EF]' }),
      condition: Conditions.targetIsYou(),
      run: (data, matches) => {
        data.labyrinthineFate = matches.effectId.toUpperCase();
      },
    },
    {
      id: 'DelubrumSav Lord Devastating Bolt',
      netRegex: NetRegexes.startsUsing({ source: 'Stygimoloch Lord', id: '57C5', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Anführer-Stygimoloch', id: '57C5', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Seigneur Stygimoloch', id: '57C5', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'スティギモロク・ロード', id: '57C5', capture: false }),
      durationSeconds: 4,
      suppressSeconds: 1,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get In Nook',
          de: 'Geh in die Ecke',
        },
      },
    },
    {
      id: 'DelubrumSav Lord 1111-Tonze Swing',
      netRegex: NetRegexes.startsUsing({ source: 'Stygimoloch Lord', id: '57D8', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Anführer-Stygimoloch', id: '57D8', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Seigneur Stygimoloch', id: '57D8', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'スティギモロク・ロード', id: '57D8', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'DelubrumSav Queen Cleansing Slash',
      // PLD and GNB tank invulnerabilities do not get Physical Vulnerability Up
      // Tank swap will be required between the two hits if not using a tank invulnerability
      // Tank swap required after second hit if not using PLD or GNB tank invulnerabilities
      // To avoid bad swaps between 11 other tanks, only mention swap to targetted tank
      netRegex: NetRegexes.startsUsing({ source: 'The Queen', id: '59F5' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Kriegsgöttin', id: '59F5' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Garde-La-Reine', id: '59F5' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'セイブ・ザ・クイーン', id: '59F5' }),
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          tankBusterAndSwap: {
            en: 'Tank Buster + Swap',
            de: 'Tankbuster + Wechsel',
            fr: 'Tank buster + Swap',
            ja: 'タンクバスター + スイッチ',
            cn: '死刑 + 换T',
            ko: '탱버 + 교대',
          },
          tankBusterOnYou: Outputs.tankBusterOnYou,
          tankBusterOnPlayer: Outputs.tankBusterOnPlayer,
          tankInvuln: {
            en: 'Invuln Tank Buster',
            de: 'Unverwundbarkeit für Tank Buster benutzen',
          },
        };

        if (data.me === matches.target) {
          if (data.role === 'tank') {
            if (data.job === 'PLD' || data.job === 'GNB')
              return { alertText: output.tankInvuln() };
            return { alertText: output.tankBusterAndSwap() };
          }
          return { alarmText: output.tankBusterOnYou() };
        }
        if (data.role === 'healer' || data.role === 'tank')
          return { alertText: output.tankBusterOnPlayer({ player: matches.target }) };
      },
    },
    {
      id: 'DelubrumSav Queen Cleansing Slash Doom',
      // Each Cleansing Slash applies a cleansable Doom (38E), if damage is taken
      netRegex: NetRegexes.gainsEffect({ source: 'The Queen', effectId: '38E' }),
      netRegexDe: NetRegexes.gainsEffect({ source: 'Kriegsgöttin', effectId: '38E' }),
      netRegexFr: NetRegexes.gainsEffect({ source: 'Garde-La-Reine', effectId: '38E' }),
      netRegexJa: NetRegexes.gainsEffect({ source: 'セイブ・ザ・クイーン', effectId: '38E' }),
      condition: (data) => data.CanCleanse(),
      infoText: (data, matches, output) => output.text({ player: data.ShortName(matches.target) }),
      outputStrings: {
        text: {
          en: 'Esuna ${player}',
          de: 'Medica ${player}',
          fr: 'Guérison sur ${player}',
          ko: '"${player}" 에스나',
        },
      },
    },
    {
      id: 'DelubrumSav Queen Ball Lightning',
      // Players with Reflect should destroy one for party to stand in the shield left behind
      netRegex: NetRegexes.addedCombatantFull({ npcNameId: '7974', capture: false }),
      suppressSeconds: 1,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Reflect Orbs',
          de: 'Reflektiere Orbs',
        },
      },
    },
    {
      id: 'DelubrumSav Queen Fiery Portent',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Soldier', id: '5A21' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Soldat Der Königin', id: '5A21' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Soldat De La Reine', id: '5A21' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'クイーンズ・ソルジャー', id: '5A21' }),
      delaySeconds: (data, matches) => parseFloat(matches.castTime) - 2.5,
      durationSeconds: 5.5,
      response: Responses.stopEverything('alarm'),
    },
    {
      id: 'DelubrumSav Queen Icy Portent',
      // Assuming you need to move for 3 seconds (duration of Pyretic from Fiery Portent)
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Soldier', id: '5A22' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Soldat Der Königin', id: '5A22' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Soldat De La Reine', id: '5A22' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'クイーンズ・ソルジャー', id: '5A22' }),
      delaySeconds: (data, matches) => parseFloat(matches.castTime) - 2.5,
      durationSeconds: 5.5,
      response: Responses.moveAround('alert'),
    },
    {
      id: 'DelubrumSav Queen Guard AoEs',
      // 5A16 from Queen's Warrior
      // 5A08 from Queen's Knight
      // 5A35 from Queen's Gunner
      // 5A23 from Queen's Soldier
      // These happen in sets:
      // Set 1 Double AoE, 3 seconds later Double AoE
      // Set 2 5 seconds later, Double AoE, 3 seconds later Double AoE, 3 seconds later AoE + Bleed
      // Set 3 1.3 seconds later, Single AoEs every 3 seconds all while bleed from set 2 persists
      netRegex: NetRegexes.startsUsing({ source: ['Queen\'s Warrior', 'Queen\'s Knight', 'Queen\'s Gunner', 'Queen\'s Soldier'], id: ['5A16', '5A08', '5A35', '5A23'], capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: ['Kriegerin Der Königin', 'Ritter Der Königin', 'Schütze Der Königin', 'Soldat Der Königin'], id: ['5A16', '5A08', '5A35', '5A23'], capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: ['Guerrière De La Reine', 'Chevalier De La Reine', 'Fusilier De La Reine', 'Soldat De La Reine'], id: ['5A16', '5A08', '5A35', '5A23'], capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: ['クイーンズ・ウォリアー', 'クイーンズ・ナイト', 'クイーンズ・ガンナー', 'クイーンズ・ソルジャー'], id: ['5A16', '5A08', '5A35', '5A23'], capture: false }),
      condition: Conditions.caresAboutAOE(),
      // Only call out the beginning of a set of two casts
      suppressSeconds: 5,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Multiple AOEs',
          de: 'Mehrere AoEs',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Right-Sided Shockwave/Left-Sided Shockwave': 'Right/Left Shockwave',
        'Left-Sided Shockwave/Right-Sided Shockwave': 'Left/Right Shockwave',
        'Sword Omen/Shield Omen': 'Sword/Shield Omen',
        'Shield Omen/Sword Omen': 'Shield/Sword Omen',
        'Flashvane/Fury Of Bozja/Infernal Slash': 'Random Arsenal',
        'Icy Portent/Fiery Portent': 'Icy/Fiery Portent',
        'Fiery Portent/Icy Portent': 'Fiery/Icy Portent',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'Aetherial Bolt': 'Magiegeschoss',
        'Aetherial Burst': 'Magiebombe',
        'Aetherial Orb': 'Magiekugel',
        'Aetherial Sphere': 'Ätherwind',
        'Aetherial Ward': 'Magiewall',
        'Automatic Turret': 'Selbstschuss-Gyrocopter',
        'Avowed Avatar': 'Spaltteil der Eingeschworenen',
        'Ball Of Fire': 'Feuerball',
        'Ball Lightning': 'Elektrosphäre',
        'Bozjan Phantom': 'Bozja-Phantom',
        'Crowned Marchosias': 'Marchosias-Leittier',
        'Dahu': 'Dahu',
        'Dahu was defeated by': 'hat Dahu besiegt',
        'Gun Turret': 'Geschützturm',
        'Immolating Flame': 'Flammensturm',
        '(?<!Crowned )Marchosias': 'Marchosias',
        'Pride of the Lion(?!ess)': 'Saal des Löwen',
        'Pride of the Lioness': 'Segen der Löwin',
        'Queen\'s Gunner': 'Schütze der Königin',
        'Queen\'s Knight': 'Ritter der Königin',
        'Queen\'s Soldier': 'Soldat der Königin',
        'Queen\'s Warrior': 'Kriegerin der Königin',
        'Queensheart': 'Saal der Dienerinnen',
        'Seeker Avatar': 'Spaltteil der Sucher',
        'Soldier Avatar': 'Spaltteil des Soldaten',
        'Spark Arrow': 'Feuerpfeil',
        'Spiritual Sphere': 'Seelenwind',
        'Stuffy Wraith': 'muffig(?:e|er|es|en) Schrecken',
        'Stygimoloch Lord': 'Anführer-Stygimoloch',
        'Stygimoloch Monk': 'Stygimoloch',
        'Stygimoloch Warrior': 'Krieger-Stygimoloch',
        'Tempestuous Orb': 'groß(?:e|er|es|en) Eisball',
        'The Hall of Hieromancy': 'Halle des Orakels',
        'The Hall of Supplication': 'Große Gebetshalle',
        'The Path of Divine Clarity': 'Sanktuarium des Lebens',
        'The Queen': 'Kriegsgöttin',
        'The Theater of One': 'Einsame Arena',
        'The Vault of Singing Crystal': 'Ort des Klingenden Kristalls',
        'Trinity Avowed': 'Trinität der Eingeschworenen',
        'Trinity Seeker': 'Trinität der Sucher',
        'Why\\.\\.\\.won\'t\\.\\.\\.you\\.\\.\\.': 'Neiiin! Wie ist das möglich',
      },
      'replaceText': {
        '--adds--': '--Adds--',
        '--chains--': '--Ketten--',
        '--knockback--': '--Rückstoß--',
        '1111-Tonze Swing': '1111-Tonzen-Schwung',
        'Above Board': 'Über dem Feld',
        'Act Of Mercy': 'Schneller Stich des Dolches',
        'Allegiant Arsenal': 'Waffenwechsel',
        'Automatic Turret': 'Selbstschuss-Gyrocopter',
        'Baleful Blade': 'Stoß der Edelklinge',
        'Baleful Comet': 'Flammenstapel der Edelklinge',
        'Baleful Firestorm': 'Ätherflamme der Edelklinge',
        'Baleful Onslaught': 'Wilder Schlitzer der Edelklinge',
        'Baleful Swathe': 'Schwarzer Wirbel der Edelklinge',
        'Beck And Call To Arms': 'Feuerbefehl',
        'Blade Of Entropy': 'Eisflammenklinge',
        'Blood And Bone': 'Wellenschlag',
        'Bombslinger': 'Bombenabwurf',
        'Boost': 'Kräfte sammeln',
        'Burn': 'Verbrennung',
        'Cleansing Slash': 'Säubernder Schnitt',
        'Coat Of Arms': 'Trotz',
        'Coerce': 'Zwang',
        'Crazed Rampage': 'Gereizter Wutlauf',
        'Creeping Miasma': 'Miasmahauch',
        'Crushing Hoof': 'Tödlicher Druck',
        'Dead Iron': 'Woge der Feuerfaust',
        'Devastating Bolt': 'Heftiger Donner',
        'Devour': 'Verschlingen',
        'Double Gambit': 'Illusionsmagie',
        'Elemental Arrow': 'Element-Pfeil',
        'Elemental Blast': 'Element-Explosion',
        'Elemental Brand': 'Eisflammenfluch',
        'Elemental Impact': 'Einschlag',
        'Empyrean Iniquity': 'Empyreische Interdiktion',
        '(?<!Inescapable )Entrapment': 'Fallenlegen',
        'Excruciation': 'Fürchterlicher Schmerz',
        'Falling Rock': 'Steinschlag',
        'Fateful Words': 'Worte des Verderbens',
        'Feral Howl': 'Wildes Heulen',
        'Fiery Portent': 'Fieberhitze',
        'Firebreathe': 'Lava-Atem',
        'First Mercy': '1. Streich: Viererdolch-Haltung',
        'Flailing Strike': 'Wirbelnder Schlag',
        'Flames Of Bozja': 'Bozianische Flamme',
        'Flashvane': 'Schockpfeile',
        'Focused Tremor': 'Kontrolliertes Beben',
        'Foe Splitter': 'Tobender Teiler',
        'Fool\'s Gambit': 'Bezauberungsmagie',
        'Forceful Strike': 'Kraftvoller Schlag',
        'Fourth Mercy': '4. Streich: Viererdolch-Haltung',
        'Fracture': 'Sprengung',
        'Freedom Of Bozja': 'Bozianische Freiheit',
        'Fury Of Bozja': 'Bozianische Wut',
        'Gleaming Arrow': 'Funkelnder Pfeil',
        'Glory Of Bozja': 'Stolz von Bozja',
        'Gods Save The Queen': 'Wächtergott der Königin',
        'Great Ball Of Fire': 'Feuerball',
        'Gun Turret': 'Geschützturm',
        'Gunnhildr\'s Blades': 'Gunnhildrs Schwert',
        'Head Down': 'Scharrende Hufe',
        'Heaven\'s Wrath': 'Heilige Perforation',
        'Higher Power': 'Elektrische Ladung',
        'Hot And Cold': 'Heiß und kalt',
        'Hot Charge': 'Heiße Rage',
        'Hunter\'s Claw': 'Jägerklaue',
        'Hysteric Assault': 'Hysterischer Ansturm',
        'Ice Spikes': 'Eisstachel',
        'Icy Portent': 'Frostwinde',
        'Inescapable Entrapment': 'Extrem-Fallenlegen',
        'Infernal Slash': 'Yama-Schnitt',
        'Invert Miasma': 'Umgekehrte Miasmakontrolle',
        'Iron Impact': 'Kanon der Feuerfaust',
        'Iron Rose': 'Rose des Hasses der Feuerfaust',
        'Iron Splitter': 'Furor der Feuerfaust',
        'Judgment Blade': 'Klinge des Urteils',
        'Labyrinthine Fate': 'Fluch des Herren des Labyrinths',
        'Leaping Spark': 'Endloser Donner',
        'Left-Sided Shockwave': 'Linke Schockwelle',
        'Lethal Blow': 'Verheerender Schlag',
        'Lingering Miasma': 'Miasmawolke',
        'Lots Cast': 'Magieexplosion',
        'Maelstrom\'s Bolt': 'Heiligenlichter',
        'Malediction of Agony': 'Pochender Fluch',
        'Malediction of Ruin': 'Fluch des Verfalls',
        'Mana Flame': 'Manaflamme',
        'Manifest Avatar': 'Teilung des Selbsts',
        'Manipulate Miasma': 'Miasmakontrolle',
        'Memory of the Labyrinth': 'Edikt des Herren des Labyrinths',
        'Merciful Arc': 'Fächertanz des Dolches',
        'Merciful Blooms': 'Kasha des Dolches',
        'Merciful Breeze': 'Yukikaze des Dolches',
        'Merciful Moon': 'Gekko des Dolches',
        'Mercy Fourfold': 'Viererdolch',
        'Northswain\'s Glow': 'Stella Polaris',
        'Optimal Offensive': 'Beste Attacke',
        'Optimal Play': 'Bestes Manöver',
        'Pawn Off': 'Kranzklinge',
        'Phantom Edge': 'Phantomklingen',
        'Queen\'s Edict': 'Hohes Edikt der Königin',
        'Queen\'s Justice': 'Hoheitliche Strafe',
        'Queen\'s Shot': 'Omnidirektionalschuss',
        'Queen\'s Will': 'Edikt der Königin',
        'Quick March': 'Marschbefehl',
        'Rapid Bolts': 'Kettenblitz',
        'Rapid Sever': 'Radikale Abtrennung',
        'Reading': 'Demontage',
        'Relentless Battery': 'Koordiniertes Manöver',
        'Relentless Play': 'Koordinierter Angriff',
        'Rending Bolt': 'Fallender Donner',
        'Reverberating Roar': 'Einsturzgefahr',
        'Reversal Of Forces': 'Materieinversion',
        'Right-Sided Shockwave': 'Rechte Schockwelle',
        '(?<!C)Rush': 'Stürmen',
        'Seasons Of Mercy': 'Setsugekka des Dolches',
        'Second Mercy': '2. Streich: Viererdolch-Haltung',
        'Secrets Revealed': 'Enthüllte Geheimnisse',
        'Shield Omen': 'Schildhaltung',
        'Shimmering Shot': 'Glitzerpfeil',
        'Shot In The Dark': 'Einhändiger Schuss',
        'Sniper Shot': 'Fangschuss',
        'Spit Flame': 'Flammenspucke',
        'Spiteful Spirit': 'Meditation',
        'Strongpoint Defense': 'Absolutschild',
        'Summon(?! Adds)': 'Beschwörung',
        'Summon Adds': 'Add-Beschwörung',
        'Sun\'s Ire': 'Flammenschlag',
        'Surge of Vigor': 'Eifer',
        'Surging Flames': 'Feuerangriff',
        'Surging Flood': 'Wasserangriff',
        'Swirling Miasma': 'Miasmawirbel',
        'Sword Omen': 'Schwerthaltung',
        'The Ends': 'Kreuzschnitt',
        'The Means': 'Kreuzschlag',
        'Third Mercy': '3. Streich: Viererdolch-Haltung',
        'Thunderous Discharge': 'Blitznetz',
        'Turret\'s Tour': 'Querschlägerhagel',
        'Undying Hatred': 'Über-Psychokinese',
        'Unlucky Lot': 'Magiebombe',
        'Unrelenting Charge': 'Ungestümer Ansturm',
        'Unseen Eye': 'Geist des Blütensturms',
        'Unwavering Apparition': 'Geist des Schlächters',
        'Verdant Path': 'Lehren des Grünen Pfades',
        'Verdant Tempest': 'Zauberwind des Grünen Pfades',
        'Vicious Swipe': 'Frenetischer Feger',
        'Vile Wave': 'Welle der Boshaftigkeit',
        'Weave Miasma': 'Miasmathese',
        'Weight Of Fortune': 'Erdrückende Kraft',
        'Whack': 'Wildes Schlagen',
        'Winds Of Fate': 'Sturm der Gewalt',
        'Winds Of Weight': 'Erdrückender Sturm',
        'Withering Curse': 'Wichtelfluch',
        'Wrath Of Bozja': 'Bozianischer Zorn',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Aetherial Bolt': 'petite bombe',
        'Aetherial Burst': 'énorme bombe',
        'Aetherial Orb': 'amas d\'éther élémentaire',
        'Aetherial Sphere': 'sphère d\'éther',
        'Aetherial Ward': 'Barrière magique',
        'Automatic Turret': 'Auto-tourelle',
        'Avowed Avatar': 'clone de la trinité féale',
        'Ball Of Fire': 'Boule de flammes',
        'Ball Lightning': 'Orbe de Foudre',
        'Bozjan Phantom': 'fantôme bozjien',
        'Crowned Marchosias': 'marchosias alpha',
        'Dahu': 'dahu',
        'Gun Turret': 'Tourelle dirigée',
        'Immolating Flame': 'grande boule de feu tourbillonnante',
        '(?<!Crowned )Marchosias': 'marchosias',
        'Pride of the Lion(?!ess)': 'Hall du Lion',
        'Pride of the Lioness': 'Bénédiction de la Lionne',
        'Queen\'s Gunner': 'fusilier de la reine',
        'Queen\'s Knight': 'chevalier de la reine',
        'Queen\'s Soldier': 'soldat de la reine',
        'Queen\'s Warrior': 'guerrière de la reine',
        'Queensheart': 'Chambre des prêtresses',
        'Seeker Avatar': 'clone de la trinité soudée',
        'Soldier Avatar': 'double de soldat',
        'Spark Arrow': 'volée de flèches de feu',
        'Spiritual Sphere': 'sphère immatérielle',
        'Stuffy Wraith': 'spectre boursouflé',
        'Stygimoloch Lord': 'seigneur stygimoloch',
        'Stygimoloch Monk': 'stygimoloch',
        'Stygimoloch Warrior': 'guerrier stygimoloch',
        'Tempestuous Orb': 'grande boule de glace',
        'The Hall of Hieromancy': 'Salle des oracles',
        'The Hall of Supplication': 'Grande salle des prières',
        'The Path of Divine Clarity': 'Salle des sages',
        'The Queen': 'Garde-la-Reine',
        'The Theater of One': 'Amphithéâtre en ruines',
        'The Vault of Singing Crystal': 'Chambre des cristaux chantants',
        'Trinity Avowed': 'trinité féale',
        'Trinity Seeker': 'trinité soudée',
        'Why\\.\\.\\.won\'t\\.\\.\\.you\\.\\.\\.': 'Grrroooargh.... Cette humaine... est forte...',
      },
      'replaceText': {
        '1111-Tonze Swing': 'Swing de 1111 tonz',
        'Above Board': 'Aire de flottement',
        'Act Of Mercy': 'Fendreciel rédempteur',
        'Allegiant Arsenal': 'Changement d\'arme',
        'Automatic Turret': 'Auto-tourelle',
        'Baleful Blade': 'Assaut singulier',
        'Baleful Comet': 'Choc des flammes singulier',
        'Baleful Firestorm': 'Ruée de flammes singulière',
        'Baleful Onslaught': 'Fendoir singulier',
        'Baleful Swathe': 'Flux de noirceur singulier',
        'Beck And Call To Arms': 'Ordre d\'attaquer',
        'Blade Of Entropy': 'Sabre du feu et de la glace',
        'Blood And Bone': 'Onde tranchante',
        'Bombslinger': 'Jet de bombe',
        'Boost': 'Renforcement',
        'Burn': 'Combustion',
        'Cleansing Slash': 'Taillade purifiante',
        'Coat Of Arms': 'Bouclier directionnel',
        'Coerce': 'Ordre irrefusable',
        'Crazed Rampage': 'Tranchage final',
        'Creeping Miasma': 'Coulée miasmatique',
        'Crushing Hoof': 'Saut pesant',
        'Dead Iron': 'Vague des poings de feu',
        'Devastating Bolt': 'Cercle de foudre',
        'Devour': 'Dévoration',
        'Double Gambit': 'Manipulation des ombres',
        'Elemental Brand': 'Malédiction du feu et de la glace',
        'Elemental Impact': 'Impact',
        'Empyrean Iniquity': 'Injustice empyréenne',
        '(?<!Inescapable )Entrapment': 'Pose de pièges',
        'Excruciation': 'Atroce douleur',
        'Falling Rock': 'Chute de pierre',
        'Fateful Words': 'Mots de calamité',
        'Feral Howl': 'Rugissement sauvage',
        'Fiery Portent': 'Rideau de flammes',
        'Firebreathe': 'Souffle de lave',
        'First Mercy': 'Première lame rédemptrice',
        'Flailing Strike': 'Hachage rotatif',
        'Flames Of Bozja': 'Flammes de Bozja',
        'Flashvane': 'Flèches fulgurantes',
        'Focused Tremor': 'Séisme localisé',
        'Foe Splitter': 'Fendoir horizontal',
        'Fool\'s Gambit': 'Manipulation des sens',
        'Forceful Strike': 'Hachage surpuissant',
        'Fourth Mercy': 'Quatrième lame rédemptrice',
        'Fracture': 'Fracture',
        'Freedom Of Bozja': 'Liberté de Bozja',
        'Fury Of Bozja': 'Furie de Bozja',
        'Gleaming Arrow': 'Flèche miroitante',
        'Glory Of Bozja': 'Gloire de Bozja',
        'Gods Save The Queen': 'Que les Dieux gardent la Reine',
        'Great Ball Of Fire': 'Boule de feu tourbillonante',
        'Gun Turret': 'Tourelle dirigée',
        'Gunnhildr\'s Blades': 'Lame de Gunnhildr',
        'Head Down': 'Charge bestiale',
        'Heaven\'s Wrath': 'Ire céleste',
        'Higher Power': 'Charge électrique',
        'Hot And Cold': 'Chaud et froid',
        'Hot Charge': 'Charge brûlante',
        'Hunter\'s Claw': 'Griffes prédatrices',
        'Hysteric Assault': 'Assaut forcené',
        'Ice Spikes': 'Pointes de glace',
        'Icy Portent': 'Rideau de givre',
        'Inescapable Entrapment': 'Parterre de pièges',
        'Infernal Slash': 'Taillade de Yama',
        'Invert Miasma': 'Contrôle des miasmes inversé',
        'Iron Impact': 'Canon d\'ardeur des poings de feu',
        'Iron Rose': 'Canon de pugnacité des poings de feu',
        'Iron Splitter': 'Fracas des poings de feu',
        'Judgment Blade': 'Lame du jugement',
        'Labyrinthine Fate': 'Malédiction du seigneur du dédale',
        'Leaping Spark': 'Éclairs en série',
        'Left-Sided Shockwave': 'Onde de choc gauche',
        'Lethal Blow': 'Charge ultime',
        'Lingering Miasma': 'Nuage miasmatique',
        'Lots Cast': 'Bombe ensorcelée',
        'Maelstrom\'s Bolt': 'Fulmination',
        'Malediction of Agony': 'Malédiction lancinante',
        'Malediction of Ruin': 'Malédiction dévastatrice',
        'Mana Flame': 'Flammes de mana',
        'Manifest Avatar': 'Clonage',
        'Manipulate Miasma': 'Contrôle des miasmes',
        'Memory of the Labyrinth': 'Appel du seigneur du dédale',
        'Merciful Arc': 'Éventail rédempteur',
        'Merciful Blooms': 'Kasha rédempteur',
        'Merciful Breeze': 'Yukikaze rédempteur',
        'Merciful Moon': 'Gekkô rédempteur',
        'Mercy Fourfold': 'Quatuor de lames rédemptrices',
        'Northswain\'s Glow': 'Étoile du Nord',
        'Optimal Offensive': 'Charge de maître d\'armes',
        'Optimal Play': 'Technique de maître d\'armes',
        'Pawn Off': 'Sabre tournoyant',
        'Phantom Edge': 'Épées spectrales',
        'Queen\'s Edict': 'Injonction de Gunnhildr',
        'Queen\'s Justice': 'Châtiment royal',
        'Queen\'s Shot': 'Tir tous azimuts',
        'Queen\'s Will': 'Édit de Gunnhildr',
        'Quick March': 'Ordre de marche',
        'Rapid Bolts': 'Torrent d\'éclairs',
        'Rapid Sever': 'Tranchage rapide',
        'Reading': 'Analyse des faiblesses',
        'Relentless Battery': 'Attaque coordonnée',
        'Relentless Play': 'Ordre d\'attaque coordonnée',
        'Rending Bolt': 'Pluie de foudre',
        'Reverberating Roar': 'Cri disloquant',
        'Reversal Of Forces': 'Inversion des masses',
        'Right-Sided Shockwave': 'Onde de choc droite',
        '(?<!C)Rush': 'Ruée',
        'Seasons Of Mercy': 'Setsugekka rédempteur',
        'Second Mercy': 'Deuxième lame rédemptrice',
        'Secrets Revealed': 'Corporification',
        'Shield Omen': 'Posture du bouclier',
        'Shimmering Shot': 'Flèches scintillantes',
        'Shot In The Dark': 'Tir à une main',
        'Sniper Shot': 'Entre les yeux',
        'Spit Flame': 'Crachat enflammé',
        'Spiteful Spirit': 'Sphère de brutalité',
        'Strongpoint Defense': 'Défense absolue',
        'Summon(?! Adds)': 'Invocation',
        'Sun\'s Ire': 'Ire ardente',
        'Surge of Vigor': 'Zèle',
        'Surging Flames': 'Déferlante de feu',
        'Surging Flood': 'Déferlante d\'eau',
        'Swirling Miasma': 'Anneau miasmatique',
        'Sword Omen': 'Posture de l\'épée',
        'The Ends': 'Croix lacérante',
        'The Means': 'Croix perforante',
        'Third Mercy': 'Troisième lame rédemptrice',
        'Thunderous Discharge': 'Déflagration de foudre',
        'Turret\'s Tour': 'Ricochets frénétiques',
        'Undying Hatred': 'Psychokinèse',
        'Unlucky Lot': 'Déflagration éthérée',
        'Unrelenting Charge': 'Charge frénétique',
        'Unseen Eye': 'Spectres de l\'ouragan de fleurs',
        'Unwavering Apparition': 'Spectres du chevalier implacable',
        'Verdant Path': 'École de la Voie verdoyante',
        'Verdant Tempest': 'Tempête de la Voie verdoyante',
        'Vicious Swipe': 'Vrille tranchante',
        'Vile Wave': 'Vague de malveillance',
        'Weave Miasma': 'Miasmologie',
        'Weight Of Fortune': 'Pesanteur excessive',
        'Whack': 'Tannée',
        'Winds Of Fate': 'Tornade puissante',
        'Winds Of Weight': 'Pesanteur et légèreté',
        'Withering Curse': 'Malédiction de nanisme',
        'Wrath Of Bozja': 'Courroux de Bozja',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Aetherial Bolt': '魔弾',
        'Aetherial Burst': '大魔弾',
        'Aetherial Orb': '魔力塊',
        'Aetherial Sphere': '魔気',
        'Aetherial Ward': '魔法障壁',
        'Automatic Turret': 'オートタレット',
        'Avowed Avatar': 'アヴァウドの分体',
        'Ball Of Fire': '火炎球',
        'Ball Lightning': '雷球',
        'Bozjan Phantom': 'ボズヤ・ファントム',
        'Crowned Marchosias': 'アルファ・マルコシアス',
        'Dahu': 'ダウー',
        'Gun Turret': 'ガンタレット',
        'Immolating Flame': '大火焔',
        '(?<!Crowned )Marchosias': 'マルコシアス',
        'Pride of the Lion(?!ess)': '雄獅子の広間',
        'Pride of the Lioness': '雌獅子の加護',
        'Queen\'s Gunner': 'クイーンズ・ガンナー',
        'Queen\'s Knight': 'クイーンズ・ナイト',
        'Queen\'s Soldier': 'クイーンズ・ソルジャー',
        'Queen\'s Warrior': 'クイーンズ・ウォリアー',
        'Queensheart': '巫女たちの広間',
        'Seeker Avatar': 'シーカーの分体',
        'Soldier Avatar': 'ソルジャーの分体',
        'Spark Arrow': 'ファイアアロー',
        'Spiritual Sphere': '霊気',
        'Stuffy Wraith': 'スタフィー・レイス',
        'Stygimoloch Lord': 'スティギモロク・ロード',
        'Stygimoloch Monk': 'スティギモロク',
        'Stygimoloch Warrior': 'スティギモロク・ウォリアー',
        'Tempestuous Orb': '大氷球',
        'The Hall of Hieromancy': '託宣所',
        'The Hall of Supplication': '大祈祷所',
        'The Path of Divine Clarity': '命の至聖所',
        'The Queen': 'セイブ・ザ・クイーン',
        'The Theater of One': '円形劇場跡',
        'The Vault of Singing Crystal': '響き合う水晶の間',
        'Trinity Avowed': 'トリニティ・アヴァウド',
        'Trinity Seeker': 'トリニティ・シーカー',
        'Why\\.\\.\\.won\'t\\.\\.\\.you\\.\\.\\.': 'グオオオォォ…… 敗レル……ナンテ……',
      },
      'replaceText': {
        '--adds--': '--雑魚--',
        '--chains--': '--鎖--',
        '1111-Tonze Swing': '1111トンズ・スイング',
        'Above Board': '浮遊波',
        'Act Of Mercy': '破天鋭刃風',
        'Allegiant Arsenal': 'ウェポンチェンジ',
        'Automatic Turret': 'オートタレット',
        'Baleful Blade': '豪剣強襲撃',
        'Baleful Comet': '豪剣焔襲撃',
        'Baleful Firestorm': '豪剣魔炎旋',
        'Baleful Onslaught': '豪剣激烈斬',
        'Baleful Swathe': '豪剣黒流破',
        'Beck And Call To Arms': '攻撃命令',
        'Blade Of Entropy': '氷炎刃',
        'Blood And Bone': '波動斬',
        'Bombslinger': '爆弾投擲',
        'Boost': 'ためる',
        'Burn': '燃焼',
        'Cleansing Slash': '乱命割殺斬',
        'Coat Of Arms': '偏向防御',
        'Coerce': '強要',
        'Crazed Rampage': 'キリキリ舞い',
        'Creeping Miasma': '瘴気流',
        'Crushing Hoof': '重圧殺',
        'Dead Iron': '熱拳振動波',
        'Devastating Bolt': '激雷',
        'Devour': '捕食',
        'Double Gambit': '幻影術',
        'Elemental Brand': '氷炎の呪印',
        'Elemental Impact': '着弾',
        'Empyrean Iniquity': '天魔鬼神爆',
        '(?<!Inescapable )Entrapment': '掛罠',
        'Excruciation': '激痛',
        'Falling Rock': '落石',
        'Fateful Words': '呪いの言葉',
        'Feral Howl': 'フェラルハウル',
        'Fiery Portent': '熱気術',
        'Firebreathe': 'ラーヴァブレス',
        'First Mercy': '初手：鋭刃四刀の構え',
        'Flailing Strike': '回転乱打',
        'Flames Of Bozja': 'フレイム・オブ・ボズヤ',
        'Flashvane': 'フラッシュアロー',
        'Focused Tremor': '局所地震',
        'Foe Splitter': 'マキ割り',
        'Fool\'s Gambit': '幻惑術',
        'Forceful Strike': '剛力の一撃',
        'Fourth Mercy': '四手：鋭刃四刀の構え',
        'Fracture': '炸裂',
        'Freedom Of Bozja': 'リバティ・オブ・ボズヤ',
        'Fury Of Bozja': 'フューリー・オブ・ボズヤ',
        'Gleaming Arrow': 'グリッターアロー',
        'Glory Of Bozja': 'グローリー・オブ・ボズヤ',
        'Gods Save The Queen': 'ゴッド・セイブ・ザ・クイーン',
        'Great Ball Of Fire': '火球',
        'Gun Turret': 'ガンタレット',
        'Gunnhildr\'s Blades': 'グンヒルドの剣',
        'Head Down': 'ビーストチャージ',
        'Heaven\'s Wrath': '聖光爆裂斬',
        'Higher Power': '雷気充填',
        'Hot And Cold': '氷炎乱流',
        'Hot Charge': 'ホットチャージ',
        'Hunter\'s Claw': 'ハンタークロウ',
        'Hysteric Assault': 'ヒステリックアサルト',
        'Ice Spikes': 'アイススパイク',
        'Icy Portent': '冷気術',
        'Inescapable Entrapment': '掛罠祭り',
        'Infernal Slash': 'ヤーマスラッシュ',
        'Invert Miasma': '反転瘴気操作',
        'Iron Impact': '熱拳烈気砲',
        'Iron Rose': '熱拳闘気砲',
        'Iron Splitter': '熱拳地脈爆',
        'Judgment Blade': '不動無明剣',
        'Labyrinthine Fate': '迷宮王の呪い',
        'Leaping Spark': '連雷',
        'Left-Sided Shockwave': 'レフトサイド・ショックウェーブ',
        'Lethal Blow': '必殺の一撃',
        'Lingering Miasma': '瘴気雲',
        'Lots Cast': '魔爆発',
        'Maelstrom\'s Bolt': '天鼓雷音稲妻斬',
        'Malediction of Agony': '苦悶の呪詛',
        'Malediction of Ruin': '破滅の呪詛',
        'Mana Flame': 'マナフレイム',
        'Manifest Avatar': '分体生成',
        'Manipulate Miasma': '瘴気操作',
        'Memory of the Labyrinth': '迷宮王の大号令',
        'Merciful Arc': '鋭刃舞踏扇',
        'Merciful Blooms': '鋭刃花車',
        'Merciful Breeze': '鋭刃雪風',
        'Merciful Moon': '鋭刃月光',
        'Mercy Fourfold': '鋭刃四刀流',
        'Northswain\'s Glow': '北斗骨砕斬',
        'Optimal Offensive': '武装突撃',
        'Optimal Play': '武装戦技',
        'Pawn Off': '旋回刃',
        'Phantom Edge': '霊幻剣',
        'Queen\'s Edict': '女王の大勅令',
        'Queen\'s Justice': '処罰令',
        'Queen\'s Shot': '全方位射撃',
        'Queen\'s Will': '女王の勅令',
        'Quick March': '行軍命令',
        'Rapid Bolts': '多重雷',
        'Rapid Sever': '滅多斬り',
        'Reading': '解析',
        'Relentless Battery': '連携戦技',
        'Relentless Play': '連携命令',
        'Rending Bolt': '雷鳴落',
        'Reverberating Roar': '崩落誘発',
        'Reversal Of Forces': '質量転換',
        'Right-Sided Shockwave': 'ライトサイド・ショックウェーブ',
        '(?<!C)Rush': '突進',
        'Seasons Of Mercy': '鋭刃雪月花',
        'Second Mercy': '二手：鋭刃四刀の構え',
        'Secrets Revealed': '実体結像',
        'Shield Omen': '盾の型',
        'Shimmering Shot': 'トゥインクルアロー',
        'Shot In The Dark': '片手撃ち',
        'Sniper Shot': '狙撃',
        'Spit Flame': 'フレイムスピット',
        'Spiteful Spirit': '闘気',
        'Strongpoint Defense': '絶対防御',
        'Summon(?! Adds)': '召喚',
        'Summon Adds': '雑魚召喚',
        'Sun\'s Ire': '焼討ち',
        'Surge of Vigor': '奮発',
        'Surging Flames': '火攻め',
        'Surging Flood': '水攻め',
        'Swirling Miasma': '瘴気輪',
        'Sword Omen': '剣の型',
        'The Ends': '十字斬',
        'The Means': '十字撃',
        'Third Mercy': '三手：鋭刃四刀の構え',
        'Thunderous Discharge': '雷気発散',
        'Turret\'s Tour': '跳弾乱舞',
        'Undying Hatred': '超ねんりき',
        'Unlucky Lot': '魔爆',
        'Unrelenting Charge': '爆進',
        'Unseen Eye': '花嵐の幻影',
        'Unwavering Apparition': '羅刹の幻影',
        'Verdant Path': '翠流派',
        'Verdant Tempest': '翠流魔風塵',
        'Vicious Swipe': 'キリ揉み',
        'Vile Wave': '悪意の波動',
        'Weave Miasma': '瘴気術',
        'Weight Of Fortune': '過重力',
        'Whack': '乱打',
        'Winds Of Fate': '大烈風',
        'Winds Of Weight': '過重烈風',
        'Withering Curse': 'こびとの呪い',
        'Wrath Of Bozja': 'ラース・オブ・ボズヤ',
      },
    },
  ],
};
