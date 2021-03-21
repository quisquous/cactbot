import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';

// TODO: warnings for mines after bosses?

// TODO: headmarkers of course have a random offset here eyeroll
const headmarker = {
  mercifulArc: '00F3',
  burningChains: '00EE',
  earthshaker: '00ED',
  spitFlame1: '004F',
  spitFlame2: '0050',
  spitFlame3: '0051',
  spitFlame4: '0052',
  flare: '0057',
  reversal: '00FF', // also tether 0087
  spiteSmite: '0017',
  wrath: '0100',
  foeSplitter: '00C6',
  thunder: '00A0',
  edictSuccess: '0088',
  edictFailure: '0089',
};

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

const numberOutputStrings = [0, 1, 2, 3, 4].map((n) => {
  const str = n.toString();
  return {
    en: str,
    de: str,
    fr: str,
    ja: str,
    cn: str,
    ko: str,
  };
});

// Due to changes introduced in patch 5.2, overhead markers now have a random offset
// added to their ID. This offset currently appears to be set per instance, so
// we can determine what it is from the first overhead marker we see.
const getHeadmarkerId = (data, matches) => {
  if (data.decOffset === undefined) {
    // If we don't know, return garbage to avoid accidentally running other triggers.
    if (!data.firstUnknownHeadmarker)
      return '0000';

    data.decOffset = parseInt(matches.id, 16) - parseInt(data.firstUnknownHeadmarker, 16);
  }
  // The leading zeroes are stripped when converting back to string, so we re-add them here.
  const hexId = (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase();
  return `000${hexId}`.slice(-4);
};

export default {
  zoneId: ZoneId.DelubrumReginaeSavage,
  timelineFile: 'delubrum_reginae_savage.txt',
  timelineTriggers: [
    {
      id: 'DelubrumSav Seeker Baleful Comet',
      regex: /Baleful Comet 1/,
      beforeSeconds: 8,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          // Comets have impact damage when dropping, so warn to avoid this.
          en: 'Get in for comets',
          de: 'Geh rein für Kometen',
        },
      },
    },
    {
      id: 'DelubrumSav Avowed Glory Of Bozja',
      regex: /Glory Of Bozja(?! Enrage)/,
      // Cast itself is 5.5 seconds, add more warning
      beforeSeconds: 7,
      condition: Conditions.caresAboutAOE(),
      // Count the number of Glory of Bozja so that people alternating mitigation
      // can more easily assign themselves to even or odd glories.
      preRun: (data) => data.gloryOfBozjaCount = (data.gloryOfBozjaCount || 0) + 1,
      suppressSeconds: 1,
      alertText: (data, _, output) => output.aoeNum({ num: data.gloryOfBozjaCount }),
      outputStrings: {
        aoeNum: {
          en: 'Big AOE + Bleed (#${num})',
          de: 'Große AoE + Blutung (#${num})',
        },
      },
    },
    {
      id: 'DelubrumSav Lord Vicious Swipe',
      regex: /Vicious Swipe/,
      // There are different timings in the first and second phase.
      // Consistently use 5 seconds beforehand for both.
      beforeSeconds: 5,
      suppressSeconds: 1,
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
      suppressSeconds: 1,
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
      suppressSeconds: 1,
      response: Responses.aoe(),
    },
    {
      id: 'DelubrumSav Queen Empyrean Iniquity',
      regex: /Empyrean Iniquity/,
      // Cast itself is 5 seconds, add more warning
      beforeSeconds: 7,
      condition: Conditions.caresAboutAOE(),
      suppressSeconds: 1,
      response: Responses.bigAoe(),
    },
    {
      id: 'DelubrumSav Queen Gods Save The Queen',
      regex: /Gods Save The Queen$/,
      // Cast in the timeline is 5 seconds, but there is an additional 1 second cast before damage
      beforeSeconds: 7,
      condition: Conditions.caresAboutAOE(),
      suppressSeconds: 1,
      response: Responses.aoe(),
    },
  ],
  triggers: [
    {
      id: 'DelubrumSav Seeker Phase',
      // Sets the phase when seeing the Verdant Tempest cast.
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Seeker', id: '5AD3', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Trinität Der Sucher', id: '5AD3', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Trinité Soudée', id: '5AD3', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'トリニティ・シーカー', id: '5AD3', capture: false }),
      // Note: this headmarker *could* be skipped, so we will change this later.
      run: (data) => data.firstUnknownHeadmarker = headmarker.mercifulArc,
    },
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
      // Merciful arc can be skipped, so if we get here, the next headmarker is burning chains.
      // If we have seen merciful arc, this is a noop.
      run: (data) => data.firstUnknownHeadmarker = headmarker.burningChains,
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
      id: 'DelubrumSav Seeker Baleful Comet Direction',
      netRegex: NetRegexes.abilityFull({ source: 'Seeker Avatar', id: '5AD7' }),
      condition: (data, matches) => {
        data.seekerCometIds = data.seekerCometIds || [];
        data.seekerCometIds.push(parseInt(matches.sourceId, 16));
        return data.seekerCometIds.length === 2;
      },
      delaySeconds: 0.5,
      // In case this hits multiple people.
      // (Note: Suppressed status is checked before condition, but the field evaluated after.)
      suppressSeconds: 0.5,
      promise: async (data, matches) => {
        // The avatars get moved right before the comets, and the position data
        // is stale in the combat log.  :C
        const cometData = await window.callOverlayHandler({
          call: 'getCombatants',
          ids: data.seekerCometIds.slice(0, 2),
        });

        if (cometData === null) {
          console.error('Baleful Comet: null cometData');
          return;
        }
        if (!cometData.combatants) {
          cometData.error('Baleful Comet: null combatants');
          return;
        }
        if (!cometData.combatants.length) {
          console.error('Baleful Comet: empty combatants');
          return;
        }
        if (cometData.combatants.length !== 2) {
          console.error(`Baleful Comet: weird length: ${cometData.combatants.length}`);
          return;
        }

        data.seekerCometData = cometData.combatants;
      },
      infoText: (data, matches, output) => {
        // The returned data does not come back in the same order.
        // Sort by the original order.
        data.seekerCometData.sort((a, b) => {
          return data.seekerCometIds.indexOf(a.ID) - data.seekerCometIds.indexOf(b.ID);
        });

        const [firstDir, secondDir] = data.seekerCometData.map((comet) => {
          const x = comet.PosX - seekerCenterX;
          const y = comet.PosY - seekerCenterY;
          const dir = Math.round(4 - 4 * Math.atan2(x, y) / Math.PI) % 8;
          return dir;
        });

        let rotateStr = output.unknown();
        let safeDir;
        if (Math.abs(secondDir - firstDir) === 1) {
          rotateStr = secondDir > firstDir ? output.clockwise() : output.counterclockwise();
          safeDir = (secondDir > firstDir ? firstDir - 1 + 8 : firstDir + 1) % 8;
        } else {
          // edge case where one dir is 0 and the other is 7.
          rotateStr = firstDir === 7 ? output.clockwise() : output.counterclockwise();
          safeDir = firstDir === 7 ? safeDir = 6 : safeDir = 1;
        }

        const initialDir = [
          'north',
          'northeast',
          'east',
          'southeast',
          'south',
          'southwest',
          'west',
          'northwest',
        ][safeDir];

        return output.text({ dir: output[initialDir](), rotate: rotateStr });
      },
      outputStrings: {
        unknown: Outputs.unknownTarget,
        north: Outputs.north,
        northeast: Outputs.northeast,
        east: Outputs.east,
        southeast: Outputs.southeast,
        south: Outputs.south,
        southwest: Outputs.southwest,
        west: Outputs.west,
        northwest: Outputs.northwest,
        clockwise: {
          en: 'Clockwise',
        },
        counterclockwise: {
          en: 'Counter-clock',
        },
        text: {
          en: 'Go ${dir}, then ${rotate}',
        },
      },
    },
    {
      id: 'DelubrumSav Seeker Baleful Comet Cleanup',
      netRegex: NetRegexes.ability({ source: 'Seeker Avatar', id: '5AD7', capture: false }),
      delaySeconds: 10,
      suppressSeconds: 10,
      run: (data) => delete data.seekerCometIds,
    },
    {
      id: 'DelubrumSav Seeker Burning Chains',
      netRegex: NetRegexes.headMarker(),
      condition: (data, matches) => {
        if (data.me !== matches.target)
          return false;
        return getHeadmarkerId(data, matches) === headmarker.burningChains;
      },
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Chain on YOU',
          de: 'Kette auf DIR',
          fr: 'Chaîne sur VOUS',
          ja: '自分に鎖',
          cn: '锁链点名',
          ko: '사슬 대상자',
        },
      },
    },
    {
      id: 'DelubrumSav Seeker Burning Chains Move',
      netRegex: NetRegexes.gainsEffect({ effectId: '301' }),
      condition: Conditions.targetIsYou(),
      response: Responses.breakChains(),
    },
    {
      id: 'DelubrumSav Seeker Merciful Arc',
      netRegex: NetRegexes.headMarker(),
      condition: (data, matches) => getHeadmarkerId(data, matches) === headmarker.mercifulArc,
      response: Responses.tankCleave(),
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
      id: 'DelubrumSav Dahu Hot Charge',
      netRegex: NetRegexes.startsUsing({ source: 'Dahu', id: '5773', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Dahu', id: '5773', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Dahu', id: '5773', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダウー', id: '5773', capture: false }),
      suppressSeconds: 10,
      alertText: (data, _, output) => {
        if (data.seenHotCharge)
          return output.oneOrTwoCharges();
        return output.followSecondCharge();
      },
      run: (data) => {
        data.seenHotCharge = true;
        data.firstUnknownHeadmarker = headmarker.spitFlame1;
      },
      outputStrings: {
        oneOrTwoCharges: {
          en: 'Follow One or Two Charges',
          de: 'Folge dem 1. oder 2. Ansturm',
        },
        followSecondCharge: {
          en: 'Follow Second Charge',
          de: 'Folge dem 2. Ansturm',
          fr: 'Suivez la deuxième charge',
          ja: '2回目の突進に追う',
          cn: '紧跟第二次冲锋',
          ko: '두번째 돌진 따라가기',
        },
      },
    },
    {
      id: 'DelubrumSav Dahu Spit Flame',
      netRegex: NetRegexes.headMarker(),
      condition: (data, matches) => {
        if (data.me !== matches.target)
          return false;
        const id = getHeadmarkerId(data, matches);
        return id >= headmarker.spitFlame1 && id <= headmarker.spitFlame4;
      },
      durationSeconds: 7,
      alarmText: (data, matches, output) => {
        const id = getHeadmarkerId(data, matches);
        const num = headmarker.spitFlame4 - id + 1;
        return {
          1: output.one(),
          2: output.two(),
          3: output.three(),
          4: output.four(),
        }[num];
      },
      outputStrings: {
        one: numberOutputStrings[1],
        two: numberOutputStrings[2],
        three: numberOutputStrings[3],
        four: numberOutputStrings[4],
      },
    },
    {
      id: 'DelubrumSav Dahu Feral Howl',
      netRegex: NetRegexes.startsUsing({ source: 'Dahu', id: '5767', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Dahu', id: '5767', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Dahu', id: '5767', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダウー', id: '5767', capture: false }),
      alertText: (data, _, output) => output.knockback(),
      outputStrings: {
        knockback: {
          en: 'Knockback to safe spot',
          de: 'Rückstoß in den sicheren Bereich',
        },
      },
    },
    {
      id: 'DelubrumSav Dahu Flare',
      netRegex: NetRegexes.headMarker(),
      condition: (data, matches) => {
        if (data.me !== matches.target)
          return false;
        const id = getHeadmarkerId(data, matches);
        return id === headmarker.flare;
      },
      run: (data) => data.hystericFlare = true,
    },
    {
      id: 'DelubrumSav Dahu Hysteric Assault',
      netRegex: NetRegexes.startsUsing({ source: 'Dahu', id: '5778', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Dahu', id: '5778', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Dahu', id: '5778', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダウー', id: '5778', capture: false }),
      response: (data, _, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          knockbackNoFlare: {
            en: 'Knockback (no flare)',
          },
          knockbackWithFlare: {
            en: 'Flare + Knockback (get away)',
          },
        };

        if (data.hystericFlare)
          return { alarmText: output.knockbackWithFlare() };
        return { alertText: output.knockbackNoFlare() };
      },
      run: (data) => delete data.hystericFlare,
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
          en: 'Remove yellow; apply purple',
          de: 'Entferne Gelb; nimm Lila',
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
          en: 'Remove purple; apply yellow',
          de: 'Entferne Lila; nimm Gelb',
        },
      },
    },
    {
      id: 'DelubrumSav Guard Boost',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Warrior', id: '582D', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Kriegerin Der Königin', id: '582D', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrière De La Reine', id: '582D', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'クイーンズ・ウォリアー', id: '582D', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Dispel Warrior Boost',
          de: 'Reinige Kriegerin Buff',
        },
      },
    },
    {
      id: 'DelubrumSav Guard Higher Power',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Gunner', id: '5853', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schütze Der Königin', id: '5853', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Fusilier De La Reine', id: '5853', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'クイーンズ・ガンナー', id: '5853', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Dispel Gun Turrets',
          de: 'Reinige Schützetürme',
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
      id: 'DelubrumSav Phantom Weave Miasma',
      netRegex: NetRegexes.startsUsing({ source: 'Bozjan Phantom', id: '57B2', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Bozja-Phantom', id: '57B2', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Fantôme Bozjien', id: '57B2', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ボズヤ・ファントム', id: '57B2', capture: false }),
      infoText: (data, _, output) => {
        data.weaveCount = (data.weaveCount || 0) + 1;
        if (data.weaveCount === 1)
          return output.firstWeave();
        else if (data.weaveCount === 2)
          return output.secondWeave();
      },
      outputStrings: {
        firstWeave: {
          en: 'Go North (donut bottom/circle top)',
          de: 'Geh nach Norden (Donut unten/Kreise oben)',
        },
        secondWeave: {
          en: 'Stay South (square bottom/circle top)',
          de: 'Geh nach Süden (Viereck unten/Kreise oben)',
        },
      },
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
            en: 'Go South; Knockback to Glowing Donut',
            de: 'Geh nach Süden; Rückstoß zum leuchtenden Donut',
          },
          goNorth: {
            en: 'Go North; Knockback from Glowing Circle',
            de: 'Geh nach Norden; Rückstoß zum leuchtenden Kreis',
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
      id: 'DelubrumSav Lord Foe Splitter',
      netRegex: NetRegexes.startsUsing({ source: 'Stygimoloch Lord', id: '57D7' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Anführer-Stygimoloch', id: '57D7' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Seigneur Stygimoloch', id: '57D7' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'スティギモロク・ロード', id: '57D7' }),
      // THANKFULLY this starts using comes out immediately before the headmarker line.
      preRun: (data) => data.firstUnknownHeadmarker = headmarker.foeSplitter,
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
      id: 'DelubrumSav Lord Rapid Bolts',
      netRegex: NetRegexes.headMarker(),
      condition: (data, matches) => {
        if (data.me !== matches.target)
          return false;
        return getHeadmarkerId(data, matches) === headmarker.thunder;
      },
      alarmText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Drop thunder outside',
        },
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
        '(?<!Crowned )Marchosias': 'Marchosias',
        'Aetherial Bolt': 'Magiegeschoss',
        'Aetherial Burst': 'Magiebombe',
        'Aetherial Orb': 'Magiekugel',
        'Aetherial Sphere': 'Ätherwind',
        'Aetherial Ward': 'Magiewall',
        'Automatic Turret': 'Selbstschuss-Gyrocopter',
        'Avowed Avatar': 'Spaltteil der Eingeschworenen',
        'Ball Lightning': 'Elektrosphäre',
        'Ball Of Fire': 'Feuerball',
        'Bicolor Golem': 'zweifarbig(?:e|er|es|en) Golem',
        'Bozjan Phantom': 'Bozja-Phantom',
        'Bozjan Soldier': 'Bozja-Soldat',
        'Crowned Marchosias': 'Marchosias-Leittier',
        'Dahu': 'Dahu',
        'Dahu was defeated by': 'hat Dahu besiegt',
        'Grim Reaper': 'Grausamer Schlitzer',
        'Gun Turret': 'Geschützturm',
        'Immolating Flame': 'Flammensturm',
        'Pride of the Lion(?!ess)': 'Saal des Löwen',
        'Pride of the Lioness': 'Segen der Löwin',
        'Queen\'s Gunner': 'Schütze der Königin',
        'Queen\'s Knight': 'Ritter der Königin',
        'Queen\'s Soldier': 'Soldat der Königin',
        'Queen\'s Warrior': 'Kriegerin der Königin',
        'Queensheart': 'Saal der Dienerinnen',
        'Ruins Golem': 'Ruinengolem',
        'Sanguine Clot': 'schauerlich(?:e|er|es|en) Blutgerinsel',
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
        'Viscous Clot': 'zäh(?:e|er|es|en) Blutgerinsel',
        'Why\\.\\.\\.won\'t\\.\\.\\.you\\.\\.\\.': 'Neiiin! Wie ist das möglich',
      },
      'replaceText': {
        '(?<!C)Rush': 'Stürmen',
        '(?<!Inescapable )Entrapment': 'Fallenlegen',
        '--Spite Check--': '--Meditation Check--',
        '--adds--': '--Adds--',
        '--bleed--': '--Blutung--',
        '--chains--': '--Ketten--',
        '--tethers--': '--Verbindungen--',
        '1111-Tonze Swing': '1111-Tonzen-Schwung',
        'Above Board': 'Über dem Feld',
        'Act Of Mercy': 'Schneller Stich des Dolches',
        'Allegiant Arsenal': 'Waffenwechsel',
        'Aura Sphere': 'Kampfwind',
        'Automatic Turret': 'Selbstschuss-Gyrocopter',
        'Baleful Blade': 'Stoß der Edelklinge',
        'Baleful Comet': 'Flammenstapel der Edelklinge',
        'Baleful Firestorm': 'Ätherflamme der Edelklinge',
        'Baleful Onslaught': 'Wilder Schlitzer der Edelklinge',
        'Baleful Swathe': 'Schwarzer Wirbel der Edelklinge',
        'Beck And Call To Arms': 'Feuerbefehl',
        'Blade Of Entropy': 'Eisflammenklinge',
        'Blood And Bone': 'Wellenschlag',
        'Bloody Wraith': 'blutrünstig(?:e|er|es|en) Schrecken',
        'Bombslinger': 'Bombenabwurf',
        'Boost': 'Kräfte sammeln',
        'Bozjan Soldier': 'Bozja-Soldat',
        'Burn': 'Verbrennung',
        'Cleansing Slash': 'Säubernder Schnitt',
        'Coat Of Arms': 'Trotz',
        'Coerce': 'Zwang',
        'Core Combustion': 'Brennender Kern',
        'Crazed Rampage': 'Gereizter Wutlauf',
        'Creeping Miasma': 'Miasmahauch',
        'Crushing Hoof': 'Tödlicher Druck',
        'Dead Iron': 'Woge der Feuerfaust',
        'Death Scythe': 'Todessichel',
        'Devastating Bolt': 'Heftiger Donner',
        'Devour': 'Verschlingen',
        'Double Gambit': 'Illusionsmagie',
        'Elemental Arrow': 'Element-Pfeil',
        'Elemental Blast': 'Element-Explosion',
        'Elemental Brand': 'Eisflammenfluch',
        'Elemental Impact': 'Einschlag',
        'Empyrean Iniquity': 'Empyreische Interdiktion',
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
        'Metamorphose': 'Materiewandel',
        'Misty Wraith': 'flüchtig(?:e|er|es|en) Schrecken',
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
        'Ruins Golem': 'Ruinengolem',
        'Sanguine Clot': 'schauerlich(?:e|er|es|en) Blutgerinsel',
        'Seasons Of Mercy': 'Setsugekka des Dolches',
        'Second Mercy': '2. Streich: Viererdolch-Haltung',
        'Secrets Revealed': 'Enthüllte Geheimnisse',
        'Shield Omen': 'Schildhaltung',
        'Shimmering Shot': 'Glitzerpfeil',
        'Shot In The Dark': 'Einhändiger Schuss',
        'Sniper Shot': 'Fangschuss',
        'Spiritual Sphere': 'Seelenwind',
        'Spit Flame': 'Flammenspucke',
        'Spiteful Spirit': 'Meditation',
        'Strongpoint Defense': 'Absolutschild',
        'Summon Adds': 'Add-Beschwörung',
        'Summon(?! Adds)': 'Beschwörung',
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
        'Viscous Clot': 'zäh(?:e|er|es|en) Blutgerinsel',
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
        '(?<!Crowned )Marchosias': 'marchosias',
        'Aetherial Bolt': 'petite bombe',
        'Aetherial Burst': 'énorme bombe',
        'Aetherial Orb': 'amas d\'éther élémentaire',
        'Aetherial Sphere': 'sphère d\'éther',
        'Aetherial Ward': 'Barrière magique',
        'Automatic Turret': 'Auto-tourelle',
        'Avowed Avatar': 'clone de la trinité féale',
        'Ball Lightning': 'Orbe de Foudre',
        'Ball Of Fire': 'Boule de flammes',
        'Bicolor Golem': 'golem bicolore',
        'Bozjan Phantom': 'fantôme bozjien',
        'Bozjan Soldier': 'soldat bozjien',
        'Crowned Marchosias': 'marchosias alpha',
        'Dahu': 'dahu',
        'Grim Reaper': 'Couperet funeste',
        'Gun Turret': 'Tourelle dirigée',
        'Immolating Flame': 'grande boule de feu tourbillonnante',
        'Pride of the Lion(?!ess)': 'Hall du Lion',
        'Pride of the Lioness': 'Bénédiction de la Lionne',
        'Queen\'s Gunner': 'fusilier de la reine',
        'Queen\'s Knight': 'chevalier de la reine',
        'Queen\'s Soldier': 'soldat de la reine',
        'Queen\'s Warrior': 'guerrière de la reine',
        'Queensheart': 'Chambre des prêtresses',
        'Ruins Golem': 'golem des ruines',
        'Sanguine Clot': 'caillot terrifiant',
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
        'Viscous Clot': 'caillot visqueux',
        'Why\\.\\.\\.won\'t\\.\\.\\.you\\.\\.\\.': 'Grrroooargh.... Cette humaine... est forte...',
      },
      'replaceText': {
        '(?<!C)Rush': 'Ruée',
        '(?<!Inescapable )Entrapment': 'Pose de pièges',
        '1111-Tonze Swing': 'Swing de 1111 tonz',
        'Above Board': 'Aire de flottement',
        'Act Of Mercy': 'Fendreciel rédempteur',
        'Allegiant Arsenal': 'Changement d\'arme',
        'Aura Sphere': 'sphère de brutalité',
        'Automatic Turret': 'Auto-tourelle',
        'Baleful Blade': 'Assaut singulier',
        'Baleful Comet': 'Choc des flammes singulier',
        'Baleful Firestorm': 'Ruée de flammes singulière',
        'Baleful Onslaught': 'Fendoir singulier',
        'Baleful Swathe': 'Flux de noirceur singulier',
        'Beck And Call To Arms': 'Ordre d\'attaquer',
        'Blade Of Entropy': 'Sabre du feu et de la glace',
        'Blood And Bone': 'Onde tranchante',
        'Bloody Wraith': 'spectre sanglant',
        'Bombslinger': 'Jet de bombe',
        'Boost': 'Renforcement',
        'Bozjan Soldier': 'soldat bozjien',
        'Burn': 'Combustion',
        'Cleansing Slash': 'Taillade purifiante',
        'Coat Of Arms': 'Bouclier directionnel',
        'Coerce': 'Ordre irrefusable',
        'Core Combustion': 'Noyau brûlant',
        'Crazed Rampage': 'Tranchage final',
        'Creeping Miasma': 'Coulée miasmatique',
        'Crushing Hoof': 'Saut pesant',
        'Dead Iron': 'Vague des poings de feu',
        'Death Scythe': 'Faux de la mort',
        'Devastating Bolt': 'Cercle de foudre',
        'Devour': 'Dévoration',
        'Double Gambit': 'Manipulation des ombres',
        'Elemental Brand': 'Malédiction du feu et de la glace',
        'Elemental Impact': 'Impact',
        'Empyrean Iniquity': 'Injustice empyréenne',
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
        'Metamorphose': 'Nature changeante',
        'Misty Wraith': 'spectre vaporeux',
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
        'Ruins Golem': 'golem des ruines',
        'Sanguine Clot': 'caillot terrifiant',
        'Seasons Of Mercy': 'Setsugekka rédempteur',
        'Second Mercy': 'Deuxième lame rédemptrice',
        'Secrets Revealed': 'Corporification',
        'Shield Omen': 'Posture du bouclier',
        'Shimmering Shot': 'Flèches scintillantes',
        'Shot In The Dark': 'Tir à une main',
        'Sniper Shot': 'Entre les yeux',
        'Spiritual Sphere': 'sphère immatérielle',
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
        'Viscous Clot': 'caillot visqueux',
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
        '(?<!Crowned )Marchosias': 'マルコシアス',
        'Aetherial Bolt': '魔弾',
        'Aetherial Burst': '大魔弾',
        'Aetherial Orb': '魔力塊',
        'Aetherial Sphere': '魔気',
        'Aetherial Ward': '魔法障壁',
        'Automatic Turret': 'オートタレット',
        'Avowed Avatar': 'アヴァウドの分体',
        'Ball Lightning': '雷球',
        'Ball Of Fire': '火炎球',
        'Bicolor Golem': 'バイカラー・ゴーレム',
        'Bozjan Phantom': 'ボズヤ・ファントム',
        'Bozjan Soldier': 'ボズヤ・ソルジャー',
        'Crowned Marchosias': 'アルファ・マルコシアス',
        'Dahu': 'ダウー',
        'Grim Reaper': 'グリムクリーバー',
        'Gun Turret': 'ガンタレット',
        'Immolating Flame': '大火焔',
        'Pride of the Lion(?!ess)': '雄獅子の広間',
        'Pride of the Lioness': '雌獅子の加護',
        'Queen\'s Gunner': 'クイーンズ・ガンナー',
        'Queen\'s Knight': 'クイーンズ・ナイト',
        'Queen\'s Soldier': 'クイーンズ・ソルジャー',
        'Queen\'s Warrior': 'クイーンズ・ウォリアー',
        'Queensheart': '巫女たちの広間',
        'Ruins Golem': 'ルーイン・ゴーレム',
        'Sanguine Clot': 'オウガリッシュ・クロット',
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
        'Viscous Clot': 'ヴィスカス・クロット',
        'Why\\.\\.\\.won\'t\\.\\.\\.you\\.\\.\\.': 'グオオオォォ…… 敗レル……ナンテ……',
      },
      'replaceText': {
        '(?<!C)Rush': '突進',
        '(?<!Inescapable )Entrapment': '掛罠',
        '--adds--': '--雑魚--',
        '--chains--': '--鎖--',
        '1111-Tonze Swing': '1111トンズ・スイング',
        'Above Board': '浮遊波',
        'Act Of Mercy': '破天鋭刃風',
        'Allegiant Arsenal': 'ウェポンチェンジ',
        'Aura Sphere': '闘気',
        'Automatic Turret': 'オートタレット',
        'Baleful Blade': '豪剣強襲撃',
        'Baleful Comet': '豪剣焔襲撃',
        'Baleful Firestorm': '豪剣魔炎旋',
        'Baleful Onslaught': '豪剣激烈斬',
        'Baleful Swathe': '豪剣黒流破',
        'Beck And Call To Arms': '攻撃命令',
        'Blade Of Entropy': '氷炎刃',
        'Blood And Bone': '波動斬',
        'Bloody Wraith': 'ブラッディ・レイス',
        'Bombslinger': '爆弾投擲',
        'Boost': 'ためる',
        'Bozjan Soldier': 'ボズヤ・ソルジャー',
        'Burn': '燃焼',
        'Cleansing Slash': '乱命割殺斬',
        'Coat Of Arms': '偏向防御',
        'Coerce': '強要',
        'Core Combustion': '心核熱',
        'Crazed Rampage': 'キリキリ舞い',
        'Creeping Miasma': '瘴気流',
        'Crushing Hoof': '重圧殺',
        'Dead Iron': '熱拳振動波',
        'Death Scythe': 'デスサイズ',
        'Devastating Bolt': '激雷',
        'Devour': '捕食',
        'Double Gambit': '幻影術',
        'Elemental Brand': '氷炎の呪印',
        'Elemental Impact': '着弾',
        'Empyrean Iniquity': '天魔鬼神爆',
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
        'Metamorphose': '性質変化',
        'Misty Wraith': 'ミスティ・レイス',
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
        'Ruins Golem': 'ルーイン・ゴーレム',
        'Sanguine Clot': 'オウガリッシュ・クロット',
        'Seasons Of Mercy': '鋭刃雪月花',
        'Second Mercy': '二手：鋭刃四刀の構え',
        'Secrets Revealed': '実体結像',
        'Shield Omen': '盾の型',
        'Shimmering Shot': 'トゥインクルアロー',
        'Shot In The Dark': '片手撃ち',
        'Sniper Shot': '狙撃',
        'Spiritual Sphere': '霊気',
        'Spit Flame': 'フレイムスピット',
        'Spiteful Spirit': '闘気',
        'Strongpoint Defense': '絶対防御',
        'Summon Adds': '雑魚召喚',
        'Summon(?! Adds)': '召喚',
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
        'Viscous Clot': 'ヴィスカス・クロット',
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
