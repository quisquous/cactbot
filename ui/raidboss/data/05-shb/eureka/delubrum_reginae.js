import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { callOverlayHandler } from '../../../../../resources/overlay_plugin_api';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';

// TODO: warnings for mines after bosses?

const seekerCenterX = -0.01531982;
const seekerCenterY = 277.9735;

const avowedCenterX = -272;
const avowedCenterY = -82;

// TODO: promote something like this to Conditions?
const tankBusterOnParty = (data) => {
  if (data.target === data.me)
    return true;
  if (data.role !== 'healer')
    return false;
  return data.party.inParty(data.target);
};

export default {
  zoneId: ZoneId.DelubrumReginae,
  timelineFile: 'delubrum_reginae.txt',
  triggers: [
    // *** Trinity Seeker ***
    {
      id: 'Delubrum Seeker Verdant Tempest',
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Seeker', id: '5AB6', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Trinität Der Sucher', id: '5AB6', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Trinité Soudée', id: '5AB6', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'トリニティ・シーカー', id: '5AB6', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Delubrum Seeker Sword Cleanup',
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Seeker', id: '5B5D', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Trinität Der Sucher', id: '5B5D', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Trinité Soudée', id: '5B5D', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'トリニティ・シーカー', id: '5B5D', capture: false }),
      run: (data) => {
        delete data.calledSeekerSwords;
        delete data.seekerSwords;
      },
    },
    {
      id: 'Delubrum Seeker Mercy Swords',
      netRegex: NetRegexes.gainsEffect({ target: ['Trinity Seeker', 'Seeker Avatar'], effectId: '808' }),
      netRegexDe: NetRegexes.gainsEffect({ target: ['Trinität Der Sucher', 'Spaltteil Der Sucher'], effectId: '808' }),
      netRegexFr: NetRegexes.gainsEffect({ target: ['Trinité Soudée', 'Clone De La Trinité Soudée'], effectId: '808' }),
      netRegexJa: NetRegexes.gainsEffect({ target: ['トリニティ・シーカー', 'シーカーの分体'], effectId: '808' }),
      durationSeconds: 10,
      alertText: (data, matches, output) => {
        if (data.calledSeekerSwords)
          return;

        data.seekerSwords = data.seekerSwords || [];
        data.seekerSwords.push(matches.count.toUpperCase());

        if (data.seekerSwords.length <= 1)
          return;

        const cleaves = data.seekerSwords;

        // Seen two cleaves, is this enough information to call??
        // If no, we will wait until we have seen the third.
        if (data.seekerSwords.length === 2) {
          // Named constants for readability.
          const dir = { north: 0, east: 1, south: 2, west: 3 };

          // Find boss-relative safe zones.
          const cleavetoSafeZones = {
            // Front right cleave.
            F7: [dir.south, dir.west],
            // Back right cleave.
            F8: [dir.west, dir.north],
            // Front left cleave.
            F9: [dir.east, dir.south],
            // Back left cleave.
            FA: [dir.north, dir.east],
          };

          const first = cleavetoSafeZones[cleaves[0]];
          const second = cleavetoSafeZones[cleaves[1]];

          const intersect = first.filter((safe) => second.includes(safe));
          if (intersect.length === 2) {
            console.error(`Sword: weird intersect: ${JSON.stringify(data.seekerSwords)}`);
            return;
          }
          // This is a bad pattern.  Need to wait for three swords.
          if (intersect.length === 0)
            return;

          data.calledSeekerSwords = true;
          const cardinal = intersect[0];
          if (cardinal === dir.north)
            return output.double({ dir1: output.north(), dir2: output.south() });
          if (cardinal === dir.east)
            return output.double({ dir1: output.east(), dir2: output.west() });
          if (cardinal === dir.south)
            return output.double({ dir1: output.south(), dir2: output.north() });
          if (cardinal === dir.west)
            return output.double({ dir1: output.west(), dir2: output.east() });
          // Or not?
          data.calledSeekerSwords = false;
          return;
        }

        const cleaveToDirection = {
          // Front right cleave.
          F7: output.west(),
          // Back right cleave.
          F8: output.west(),
          // Front left cleave.
          F9: output.east(),
          // Back left cleave.
          FA: output.east(),
        };

        // Seen three clones, which means we weren't able to call with two.
        // Try to call out something the best we can.
        // Find the cleave we're missing and add it to the list.
        const allCleaveKeys = Object.keys(cleaveToDirection);
        const finalCleaveList = allCleaveKeys.filter((id) => !cleaves.includes(id));
        if (finalCleaveList.length !== 1) {
          console.error(`Swords: bad intersection ${JSON.stringify(data.seekerSwords)}`);
          return;
        }
        cleaves.push(finalCleaveList[0]);

        data.calledSeekerSwords = true;
        const dirs = cleaves.map((id) => cleaveToDirection[id]);
        return output.quadruple({ dir1: dirs[0], dir2: dirs[1], dir3: dirs[2], dir4: dirs[3] });
      },
      // Unlike savage mode, Trinity Seeker can be pretty much anywhere.
      // So, turn "absolute cardinal directions" into boss-relative strings.
      // The above function uses cardinal directions to be closer to the DRS code.
      outputStrings: {
        north: {
          en: 'Front',
          de: 'Vorne',
          fr: 'Devant',
          ja: '前',
          cn: '上',
          ko: '앞',
        },
        east: {
          en: 'Right',
          de: 'Rechts',
          fr: 'À droite',
          ja: '右',
          cn: '右',
          ko: '오른쪽',
        },
        south: {
          en: 'Back',
          de: 'Hinten',
          fr: 'Derrière',
          ja: '後ろ',
          cn: '下',
          ko: '뒤',
        },
        west: {
          en: 'Left',
          de: 'Links',
          fr: 'À gauche',
          ja: '左',
          cn: '左',
          ko: '왼쪽',
        },
        double: {
          en: '${dir1} > ${dir2}',
          de: '${dir1} > ${dir2}',
          fr: '${dir1} > ${dir2}',
          ja: '${dir1} > ${dir2}',
          cn: '${dir1} > ${dir2}',
          ko: '${dir1} > ${dir2}',
        },
        quadruple: {
          en: '${dir1} > ${dir2} > ${dir3} > ${dir4}',
          de: '${dir1} > ${dir2} > ${dir3} > ${dir4}',
          fr: '${dir1} > ${dir2} > ${dir3} > ${dir4}',
          ja: '${dir1} > ${dir2} > ${dir3} > ${dir4}',
          cn: '${dir1} > ${dir2} > ${dir3} > ${dir4}',
          ko: '${dir1} > ${dir2} > ${dir3} > ${dir4}',
        },
      },
    },
    {
      id: 'Delubrum Seeker Baleful Swath',
      // This is an early warning for casters for Baleful Swath on the Verdant Path cast.
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Seeker', id: '5A98', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Trinität Der Sucher', id: '5A98', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Trinité Soudée', id: '5A98', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'トリニティ・シーカー', id: '5A98', capture: false }),
      response: Responses.goFrontBack('info'),
    },
    {
      id: 'Delubrum Seeker Baleful Blade Out',
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Seeker', id: '5AA1', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Trinität Der Sucher', id: '5AA1', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Trinité Soudée', id: '5AA1', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'トリニティ・シーカー', id: '5AA1', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get Out Behind Barricade',
          de: 'Geh raus, hinter die Barrikaden',
          fr: 'À l\'extérieur, derrière la barricade',
          ja: '柵の後ろに',
          cn: '栅栏后躲避',
          ko: '밖으로, 바리케이트 뒤로',
        },
      },
    },
    {
      id: 'Delubrum Seeker Baleful Blade Knockback',
      // We could call this on Phantom Edge 5AA0, but maybe that's too early?
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Seeker', id: '5AA2', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Trinität Der Sucher', id: '5AA2', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Trinité Soudée', id: '5AA2', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'トリニティ・シーカー', id: '5AA2', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get Knocked Into Barricade',
          de: 'Rückstoß in die Barrikaden',
          fr: 'Faites-vous pousser contre la barricade',
          ja: '柵に吹き飛ばされる',
          cn: '击退到栅栏上',
          ko: '바리케이트로 넉백당하기',
        },
      },
    },
    {
      // There is no castbar for 5AB7, only this headmarker.
      id: 'Delubrum Seeker Merciful Arc',
      netRegex: NetRegexes.headMarker({ id: '00F3' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'Delubrum Seeker Iron Impact',
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Seeker', id: '5ADB', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Trinität Der Sucher', id: '5ADB', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Trinité Soudée', id: '5ADB', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'トリニティ・シーカー', id: '5ADB', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Line Stack',
          de: 'In einer Linie sammeln',
          fr: 'Package en ligne',
          ja: '直線頭割り',
          cn: '直线分摊',
          ko: '직선 쉐어',
        },
      },
    },
    {
      id: 'Delubrum Seeker Iron Splitter',
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Seeker', id: '5AA3' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Trinität Der Sucher', id: '5AA3' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Trinité Soudée', id: '5AA3' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'トリニティ・シーカー', id: '5AA3' }),
      preRun: (data) => delete data.ironSplitter,
      promise: async (data, matches) => {
        const seekerData = await callOverlayHandler({
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
      alertText: (data, _matches, output) => {
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
          fr: 'Pierre bleue',
          ja: '青い床へ',
          cn: '去蓝色',
          ko: '파랑 장판으로',
        },
        goWhite: {
          en: 'White Sand',
          de: 'Weißer Sand',
          fr: 'Sable blanc',
          ja: '白い床へ',
          cn: '去白色',
          ko: '모래 장판으로',
        },
      },
    },
    {
      id: 'Delubrum Seeker Burning Chains',
      netRegex: NetRegexes.headMarker({ id: '00EE' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text(),
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
      // TODO: the FFXIV parser plugin does not include this as a "gains effect" line.
      id: 'Delubrum Seeker Burning Chains Move',
      netRegex: NetRegexes.headMarker({ id: '00EE' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: 4,
      response: Responses.breakChains(),
    },
    {
      id: 'Delubrum Seeker Dead Iron',
      netRegex: NetRegexes.headMarker({ id: '00ED' }),
      condition: Conditions.targetIsYou(),
      response: Responses.earthshaker(),
    },
    {
      id: 'Delubrum Seeker Merciful Moon',
      // 3 second warning to match savage timings.
      netRegex: NetRegexes.startsUsing({ source: 'Aetherial Orb', id: '5AAC', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Magiekugel', id: '5AAC', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Amas D\'Éther Élémentaire', id: '5AAC', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '魔力塊', id: '5AAC', capture: false }),
      delaySeconds: 1,
      alertText: (_data, _matches, output) => output.lookAway(),
      outputStrings: {
        lookAway: {
          en: 'Look Away From Orb',
          de: 'Schau weg vom Orb',
          fr: 'Ne regardez pas l\'orbe',
          ja: '玉に背を向ける',
          cn: '背对白球',
          ko: '구슬 에게서 뒤돌기',
        },
      },
    },
    {
      id: 'Delubrum Seeker Merciful Blooms',
      // Call this on the ability of Merciful Moon, it starts casting much earlier.
      netRegex: NetRegexes.ability({ source: 'Aetherial Orb', id: '5AAC', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Magiekugel', id: '5AAC', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Amas D\'Éther Élémentaire', id: '5AAC', capture: false }),
      netRegexJa: NetRegexes.ability({ source: '魔力塊', id: '5AAC', capture: false }),
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.awayFromPurple(),
      outputStrings: {
        awayFromPurple: {
          en: 'Away From Purple',
          de: 'Schau weg von Lila',
          fr: 'Éloignez-vous du violet',
          ja: '花に避ける',
          cn: '远离紫花',
          ko: '보라 장판에게서 떨어지기',
        },
      },
    },
    // *** Dahu ***
    {
      id: 'Delubrum Dahu Shockwave',
      netRegex: NetRegexes.startsUsing({ source: 'Dahu', id: ['5761', '5762'] }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Dahu', id: ['5761', '5762'] }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Dahu', id: ['5761', '5762'] }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダウー', id: ['5761', '5762'] }),
      // There's a 3s slow windup on the first, then a 1s opposite cast.
      suppressSeconds: 10,
      alertText: (_data, matches, output) => {
        if (matches.id === '5761')
          return output.leftThenRight();
        return output.rightThenLeft();
      },
      outputStrings: {
        leftThenRight: {
          en: 'Left, Then Right',
          de: 'Links, dann Rechts',
          fr: 'À gauche, puis à droite',
          ja: '左 => 右',
          cn: '左 => 右',
          ko: '왼쪽 => 오른쪽',
        },
        rightThenLeft: {
          en: 'Right, Then Left',
          de: 'Rechts, dann Links',
          fr: 'À droite, puis à gauche',
          ja: '右 => 左',
          cn: '右 => 左',
          ko: '오른쪽 => 왼쪽',
        },
      },
    },
    {
      // TODO: is this true if you see a Feral Howl #4 and onward?
      id: 'Delubrum Dahu Feral Howl',
      netRegex: NetRegexes.startsUsing({ source: 'Dahu', id: '5755', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Dahu', id: '5755', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Dahu', id: '5755', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダウー', id: '5755', capture: false }),
      alertText: (data, _matches, output) => {
        if (data.seenFeralHowl)
          return output.knockbackAvoid();
        return output.knockback();
      },
      run: (data) => data.seenFeralHowl = true,
      outputStrings: {
        knockback: {
          en: 'Unavoidable Knockback',
          de: 'Unvermeidbarer Rückstoß',
          fr: 'Poussée inévitable',
          ja: '避けないノックバック',
          cn: '击退 (防击退无效)',
          ko: '넉백 방지 불가',
        },
        knockbackAvoid: {
          // This is also unavoidable, but that's really wordy and hopefully
          // you figured that out the first time.
          en: 'Knockback (Avoid Adds)',
          de: 'Rückstoß (vermeide die Adds)',
          fr: 'Poussée (Évitez les adds)',
          ja: 'ノックバック (雑魚に触らない)',
          cn: '击退 (避开小怪)',
          ko: '넉백 (쫄 피하기)',
        },
      },
    },
    {
      id: 'Delubrum Dahu Hot Charge',
      netRegex: NetRegexes.startsUsing({ source: 'Dahu', id: '5764', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Dahu', id: '5764', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Dahu', id: '5764', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダウー', id: '5764', capture: false }),
      // This happens twice in a row
      suppressSeconds: 10,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
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
      id: 'Delubrum Dahu Heat Breath',
      netRegex: NetRegexes.startsUsing({ source: 'Dahu', id: '5766' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Dahu', id: '5766' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Dahu', id: '5766' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダウー', id: '5766' }),
      response: Responses.tankCleave(),
    },
    {
      id: 'Delubrum Dahu Ripper Claw',
      netRegex: NetRegexes.startsUsing({ source: 'Dahu', id: '575D', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Dahu', id: '575D', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Dahu', id: '575D', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダウー', id: '575D', capture: false }),
      response: Responses.awayFromFront(),
    },
    // *** Queen's Guard ***
    {
      id: 'Delubrum Guard Secrets Revealed',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Soldier', id: '5B6E', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Soldat Der Königin', id: '5B6E', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Soldat De La Reine', id: '5B6E', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'クイーンズ・ソルジャー', id: '5B6E', capture: false }),
      infoText: (data, _matches, output) => {
        if (data.seenSecretsRevealed)
          return output.followUntethered();
        return output.awayFromTethered();
      },
      run: (data) => data.seenSecretsRevealed = true,
      outputStrings: {
        awayFromTethered: {
          en: 'Away from tethered adds',
          de: 'Weg von den verbundenen Adds',
          fr: 'Éloignez-vous des adds liés',
          ja: '線に繋がる雑魚から離れる',
          cn: '远离连线小怪',
          ko: '선 연결된 쫄에서 떨어지기',
        },
        followUntethered: {
          en: 'Follow untethered adds',
          de: 'Folge den nicht verbundenen Adds',
          fr: 'Suivez les adds non liés',
          ja: '線に繋がらない雑魚から離れる',
          cn: '靠近无连线小怪',
          ko: '선 연결되지 않은 쫄 따라가기',
        },
      },
    },
    {
      id: 'Delubrum Guard Rapid Sever Soldier',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Soldier', id: '5809' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Soldat Der Königin', id: '5809' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Soldat De La Reine', id: '5809' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'クイーンズ・ソルジャー', id: '5809' }),
      condition: tankBusterOnParty,
      response: Responses.tankBuster(),
    },
    {
      id: 'Delubrum Guard Blood And Bone Soldier',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Soldier', id: '5808', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Soldat Der Königin', id: '5808', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Soldat De La Reine', id: '5808', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'クイーンズ・ソルジャー', id: '5808', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Delubrum Guard Shot In The Dark',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Gunner', id: '5811' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schütze Der Königin', id: '5811' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Fusilier De La Reine', id: '5811' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'クイーンズ・ガンナー', id: '5811' }),
      condition: tankBusterOnParty,
      response: Responses.tankBuster(),
    },
    {
      id: 'Delubrum Guard Automatic Turret',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Gunner', id: '580B', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schütze Der Königin', id: '580B', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Fusilier De La Reine', id: '580B', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'クイーンズ・ガンナー', id: '580B', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Avoid Laser Bounces',
          de: 'Weiche den abgelenken Lasern aus',
          fr: 'Évitez les rebonds de laser',
          ja: 'レーザーを避ける',
          cn: '躲避激光',
          ko: '레이저 피하기',
        },
      },
    },
    {
      id: 'Delubrum Guard Queen\'s Shot',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Gunner', id: '5810', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schütze Der Königin', id: '5810', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Fusilier De La Reine', id: '5810', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'クイーンズ・ガンナー', id: '5810', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Delubrum Guard Reversal Of Forces',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Warrior', id: '57FF', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Kriegerin Der Königin', id: '57FF', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrière De La Reine', id: '57FF', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'クイーンズ・ウォリアー', id: '57FF', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      run: (data) => data.reversalOfForces = true,
      outputStrings: {
        text: {
          en: 'Stand On Small Bomb',
          de: 'Auf kleinen Bomben stehen',
          fr: 'Placez-vous sur une petite bombe',
          ja: '小さい爆弾を踏む',
          cn: '站在小炸弹上',
          ko: '작은 폭탄 위에 서기',
        },
      },
    },
    {
      id: 'Delubrum Guard Above Board',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Warrior', id: '57FC', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Kriegerin Der Königin', id: '57FC', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrière De La Reine', id: '57FC', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'クイーンズ・ウォリアー', id: '57FC', capture: false }),
      alertText: (data, _matches, output) => {
        if (data.reversalOfForces)
          return;
        return output.text();
      },
      run: (data) => delete data.reversalOfForces,
      outputStrings: {
        text: {
          en: 'Stand On Large Bomb',
          de: 'Auf großen Bomben stehen',
          fr: 'Placez-vous sur une grosse bombe',
          ja: '大きい爆弾を踏む',
          cn: '站在大炸弹上',
          ko: '큰 폭탄 위에 서기',
        },
      },
    },
    {
      id: 'Delubrum Guard Blood And Bone Warrior',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Warrior', id: '5800', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Kriegerin Der Königin', id: '5800', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrière De La Reine', id: '5800', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'クイーンズ・ウォリアー', id: '5800', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Delubrum Guard Shield Omen',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Knight', id: '57F1', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Ritter Der Königin', id: '57F1', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Chevalier De La Reine', id: '57F1', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'クイーンズ・ナイト', id: '57F1', capture: false }),
      response: Responses.getUnder(),
    },
    {
      id: 'Delubrum Guard Sword Omen',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Knight', id: '57F0', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Ritter Der Königin', id: '57F0', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Chevalier De La Reine', id: '57F0', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'クイーンズ・ナイト', id: '57F0', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'Delubrum Guard Rapid Sever Knight',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Knight', id: '57FB' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Ritter Der Königin', id: '57FB' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Chevalier De La Reine', id: '57FB' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'クイーンズ・ナイト', id: '57FB' }),
      condition: tankBusterOnParty,
      response: Responses.tankBuster(),
    },
    {
      id: 'Delubrum Guard Blood And Bone Knight',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Knight', id: '57FA', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Ritter Der Königin', id: '57FA', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Chevalier De La Reine', id: '57FA', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'クイーンズ・ナイト', id: '57FA', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    // *** Bozjan Phantom
    {
      id: 'Delubrum Phantom Weave Miasma',
      netRegex: NetRegexes.startsUsing({ source: 'Bozjan Phantom', id: '57A3', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Bozja-Phantom', id: '57A3', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Fantôme Bozjien', id: '57A3', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ボズヤ・ファントム', id: '57A3', capture: false }),
      preRun: (data) => data.weaveMiasmaCount = (data.weaveMiasmaCount || 0) + 1,
      delaySeconds: 3,
      infoText: (data, _matches, output) => {
        if (data.weaveMiasmaCount && data.weaveMiasmaCount >= 3)
          return output.weaveWithKnockback();
        return output.weaveNoKnockback();
      },
      outputStrings: {
        weaveNoKnockback: {
          en: 'Go To North Circle',
          de: 'Geh zum Kreis im Norden',
          fr: 'Allez au cercle Nord',
          ja: '北のドーナツ範囲に入る',
          cn: '去上面(北面)月环',
          ko: '북쪽 원으로 이동',
        },
        weaveWithKnockback: {
          en: 'Get Knocked Back To Circle',
          de: 'Lass dich zum Kreis im Norden zurückstoßen',
          fr: 'Faites-vous pousser dans le cercle',
          ja: '北のドーナツ範囲へ吹き飛ばされる',
          cn: '击退到上面(北面)月环中',
          ko: '원으로 넉백 당하기',
        },
      },
    },
    {
      id: 'Delubrum Phantom Malediction Of Agony',
      netRegex: NetRegexes.startsUsing({ source: 'Bozjan Phantom', id: '57AF', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Bozja-Phantom', id: '57AF', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Fantôme Bozjien', id: '57AF', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ボズヤ・ファントム', id: '57AF', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Delubrum Phantom Undying Hatred',
      // "57AB Summon" is used here to avoid an additional name to translate.
      // "57AC Undying Hatred" is from Stuffy Wraith.
      netRegex: NetRegexes.startsUsing({ source: 'Bozjan Phantom', id: '57AB', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Bozja-Phantom', id: '57AB', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Fantôme Bozjien', id: '57AB', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ボズヤ・ファントム', id: '57AB', capture: false }),
      delaySeconds: 5,
      // This is covered by Weave Miasma after the first "learn how this works" action.
      suppressSeconds: 9999,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Unavoidable Knockback',
          de: 'Unvermeidbarer Rückstoß',
          fr: 'Poussée inévitable',
          ja: '避けないノックバック',
          cn: '击退 (防击退无效)',
          ko: '넉백 방지 불가',
        },
      },
    },
    {
      id: 'Delubrum Phantom Excruciation',
      netRegex: NetRegexes.startsUsing({ source: 'Bozjan Phantom', id: '5809' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Bozja-Phantom', id: '5809' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Fantôme Bozjien', id: '5809' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ボズヤ・ファントム', id: '5809' }),
      condition: tankBusterOnParty,
      response: Responses.tankBuster(),
    },
    // *** Trinity Avowed
    {
      id: 'Delubrum Avowed Wrath Of Bozja',
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Avowed', id: '5975' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Trinität Der Eingeschworenen', id: '5975' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Trinité Féale', id: '5975' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'トリニティ・アヴァウド', id: '5975' }),
      response: Responses.tankCleave('alert'),
    },
    {
      id: 'Delubrum Avowed Glory Of Bozja',
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Avowed', id: '5976', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Trinität Der Eingeschworenen', id: '5976', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Trinité Féale', id: '5976', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'トリニティ・アヴァウド', id: '5976', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Delubrum Avowed Hot And Cold',
      // 89D: Running Hot: +1
      // 8A4: Running Hot: +2
      // 8DC: Running Cold: -1
      // 8E2: Running Cold: -2
      netRegex: NetRegexes.gainsEffect({ effectId: ['89D', '8A4', '8DC', '8E2'] }),
      condition: Conditions.targetIsYou(),
      run: (data, matches) => {
        data.avowedTemperature = {
          '89D': 1,
          '8A4': 2,
          '8DC': -1,
          '8E2': -2,
        }[matches.effectId.toUpperCase()];
      },
    },
    {
      id: 'Delubrum Avowed Freedom Of Bozja',
      // Arguably, the Elemental Impact (meteor falling) has different ids depending on orb type,
      // e.g. 5960, 5962, 4F55, 4556, 4F99, 4F9A.
      // So we could give directions here, but probably that's just more confusing.
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Avowed', id: '597C', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Trinität Der Eingeschworenen', id: '597C', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Trinité Féale', id: '597C', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'トリニティ・アヴァウド', id: '597C', capture: false }),
      delaySeconds: 10,
      alertText: (data, _matches, output) => {
        switch (data.avowedTemperature) {
        case 2:
          return output.minusTwo();
        case 1:
          return output.minusOne();
        case -1:
          return output.plusOne();
        case -2:
          return output.plusTwo();
        default:
          return output.unknownTemperature();
        }
      },
      outputStrings: {
        plusTwo: {
          en: 'Go to +2 Heat Meteor',
          de: 'Geh zum +2 Heiß Meteor',
          fr: 'Allez au météore de chaleur +2',
          ja: '炎属性+2を踏む',
          cn: '踩火+2',
          ko: '+2 불 메테오쪽으로',
        },
        plusOne: {
          en: 'Go to +1 Heat Meteor',
          de: 'Geh zum +1 Heiß Meteor',
          fr: 'Allez au météore de chaleur +1',
          ja: '炎属性+1を踏む',
          cn: '踩火+1',
          ko: '+1 불 메테오쪽으로',
        },
        minusOne: {
          en: 'Go to -1 Cold Meteor',
          de: 'Geh zum -1 Kalt Meteor',
          fr: 'Allez au météore de froid -1',
          ja: '氷属性-1を踏む',
          cn: '踩冰-1',
          ko: '-1 얼음 메테오쪽으로',
        },
        minusTwo: {
          en: 'Go to -2 Cold Meteor',
          de: 'Geh zum -2 Kalt Meteor',
          fr: 'Allez au météore de froid -2',
          ja: '氷属性-2を踏む',
          cn: '踩冰-2',
          ko: '-2 얼음 메테오쪽으로',
        },
        unknownTemperature: {
          en: 'Stand In Opposite Meteor',
          de: 'Steh im entgegengesetztem Meteor',
          fr: 'Placez-vous au météore de l\'élément opposé',
          ja: '体温と逆のメテオを受ける',
          cn: '接相反温度的陨石',
          ko: '반대쪽 메테오에 서기',
        },
      },
    },
    {
      id: 'Delubrum Avowed Shimmering Shot',
      // See comments on Freedom Of Bozja above.
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Avowed', id: '597F', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Trinität Der Eingeschworenen', id: '597F', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Trinité Féale', id: '597F', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'トリニティ・アヴァウド', id: '597F', capture: false }),
      delaySeconds: 3,
      alertText: (data, _matches, output) => {
        switch (data.avowedTemperature) {
        case 2:
          return output.minusTwo();
        case 1:
          return output.minusOne();
        case -1:
          return output.plusOne();
        case -2:
          return output.plusTwo();
        default:
          return output.unknownTemperature();
        }
      },
      outputStrings: {
        plusTwo: {
          en: 'Follow +2 Heat Arrow',
          de: 'Folge dem +2 Heiß Pfeilen',
          fr: 'Suivez la flèche de chaleur +2',
          ja: '炎属性+2に従う',
          cn: '接火+2',
          ko: '+2 불 화살쪽으로',
        },
        plusOne: {
          en: 'Follow +1 Heat Arrow',
          de: 'Folge dem +1 Heiß Pfeilen',
          fr: 'Suivez la flèche de chaleur +1',
          ja: '炎属性+1に従う',
          cn: '接火+1',
          ko: '+1 불 화살쪽으로',
        },
        minusOne: {
          en: 'Follow -1 Cold Arrow',
          de: 'Folge dem -1 Kalt Pfeilen',
          fr: 'Suivez la flèche de froid -1',
          ja: '氷属性-1に従う',
          cn: '接冰-1',
          ko: '-1 얼음 화살쪽으로',
        },
        minusTwo: {
          en: 'Follow -2 Cold Arrow',
          de: 'Folge dem -2 Kalt Pfeilen',
          fr: 'Suivez la flèche de froid -2',
          ja: '氷属性-2に従う',
          cn: '接冰-2',
          ko: '-2 얼음 화살쪽으로',
        },
        unknownTemperature: {
          en: 'Follow Opposite Arrow',
          de: 'Gehe in die entgegengesetzten Pfeile',
          fr: 'Suivez la flèche de l\'élément opposé',
          ja: '体温と逆のあみだに従う',
          cn: '接相反温度的线',
          ko: '반대쪽 화살 맞기',
        },
      },
    },
    {
      // 5B65 = right cleave, heat+2
      // 5B66 = right cleave, cold+2
      // 5B67 = left cleave, heat+2
      // 5B68 = left cleave, cold+2
      // 596D = right cleave, heat+1
      // 596E = right cleave, cold+1
      // 596F = left cleave, heat+1
      // 5970 = left cleave, cold+1
      id: 'Delubrum Avowed Hot And Cold Cleaves',
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Avowed', id: ['5B6[5-8]', '596[DEF]', '5970'] }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Trinität Der Eingeschworenen', id: ['5B6[5-8]', '596[DEF]', '5970'] }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Trinité Féale', id: ['5B6[5-8]', '596[DEF]', '5970'] }),
      netRegexJa: NetRegexes.startsUsing({ source: 'トリニティ・アヴァウド', id: ['5B6[5-8]', '596[DEF]', '5970'] }),
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          left: {
            en: 'Left',
            de: 'Links',
            fr: 'À gauche',
            ja: '左',
            cn: '左',
            ko: '왼쪽',
          },
          right: {
            en: 'Right',
            de: 'Rechts',
            fr: 'À droite',
            ja: '右',
            cn: '右',
            ko: '오른쪽',
          },
          plusTwo: {
            en: 'Be in ${side} Cleave (+2 Hot)',
            de: 'Sei im ${side} Cleave (+2 Heiß)',
            fr: 'Soyez du ${side} Cleave (+2 chaud)',
            ja: '${side}側へ (炎属性+2)',
            cn: '去${side}侧 (火+2)',
            ko: '${side} 광역기 맞기 (+2 불속성)',
          },
          plusOne: {
            en: 'Be in ${side} Cleave (+1 Hot)',
            de: 'Sei im ${side} Cleave (+1 Heiß)',
            fr: 'Soyez du ${side} Cleave (+1 chaud)',
            ja: '${side}側へ (炎属性+1)',
            cn: '去${side}侧 (火+1)',
            ko: '${side} 광역기 맞기 (+1 불속성)',
          },
          minusOne: {
            en: 'Be in ${side} Cleave (-1 Cold)',
            de: 'Sei im ${side} Cleave (-1 Kalt)',
            fr: 'Soyez du ${side} Cleave (-1 froid)',
            ja: '${side}側へ (氷属性-1)',
            cn: '去${side}侧 (冰-1)',
            ko: '${side} 광역기 맞기 (-1 얼음속성)',
          },
          minusTwo: {
            en: 'Be in ${side} Cleave (-2 Cold)',
            de: 'Sei im ${side} Cleave (-2 Kalt)',
            fr: 'Soyez du ${side} Cleave (-2 froid)',
            ja: '${side}側へ (氷属性-2)',
            cn: '去${side}侧 (冰-2)',
            ko: '${side} 광역기 맞기 (-2 얼음속성)',
          },
          avoid: {
            en: 'Go ${side} (avoid!)',
            de: 'Gehe nach ${side} (ausweichen!)',
            fr: 'Allez à ${side} (évitez !)',
            ja: '${side}側へ (避ける！)',
            cn: '去${side}侧 (别吃顺劈！)',
            ko: '${side}으로 피하기!',
          },
        };

        const isLeft = ['5B67', '5B68', '596F', '5970'].includes(matches.id);
        const side = isLeft ? output.left() : output.right();
        const safeSide = isLeft ? output.right() : output.left();
        const avoidInfoText = { infoText: output.avoid({ side: safeSide }) };

        switch (matches.id) {
        case '5B66':
        case '5B68':
          if (data.avowedTemperature === 2)
            return { alertText: output.minusTwo({ side: side }) };
          return avoidInfoText;
        case '596E':
        case '5970':
          if (data.avowedTemperature === 1)
            return { alertText: output.minusOne({ side: side }) };
          return avoidInfoText;
        case '596D':
        case '596F':
          if (data.avowedTemperature === -1)
            return { alertText: output.plusOne({ side: side }) };
          return avoidInfoText;
        case '5B65':
        case '5B67':
          if (data.avowedTemperature === -2)
            return { alertText: output.plusTwo({ side: side }) };
          return avoidInfoText;
        }
      },
    },
    {
      id: 'Delubrum Avowed Gleaming Arrow Collect',
      netRegex: NetRegexes.startsUsing({ source: 'Avowed Avatar', id: '5974' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Spaltteil Der Eingeschworenen', id: '5974' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Clone De La Trinité Féale', id: '5974' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'アヴァウドの分体', id: '5974' }),
      run: (data, matches) => {
        data.unseenIds = data.unseenIds || [];
        data.unseenIds.push(parseInt(matches.sourceId, 16));
      },
    },
    {
      id: 'Delubrum Avowed Gleaming Arrow',
      netRegex: NetRegexes.startsUsing({ source: 'Avowed Avatar', id: '5974', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Spaltteil Der Eingeschworenen', id: '5974', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Clone De La Trinité Féale', id: '5974', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'アヴァウドの分体', id: '5974', capture: false }),
      delaySeconds: 0.5,
      suppressSeconds: 10,
      promise: async (data) => {
        const unseenIds = data.unseenIds;
        const unseenData = await callOverlayHandler({
          call: 'getCombatants',
          ids: unseenIds,
        });

        if (unseenData === null) {
          console.error(`Gleaming Arrow: null data`);
          return;
        }
        if (!unseenData.combatants) {
          console.error(`Gleaming Arrow: null combatants`);
          return;
        }
        if (unseenData.combatants.length !== unseenIds.length) {
          console.error(`Gleaming Arrow: expected ${unseenIds.length}, got ${unseenData.combatants.length}`);
          return;
        }

        data.unseenBadRows = [];
        data.unseenBadCols = [];

        for (const avatar of unseenData.combatants) {
          const x = avatar.PosX - avowedCenterX;
          const y = avatar.PosY - avowedCenterY;

          // y=-107 = north side, x = -252, -262, -272, -282, -292
          // x=-247 = left side, y = -62, -72, -82, -92, -102
          // Thus, the possible deltas are -20, -10, 0, +10, +20.
          // The other coordinate is +/-25 from center.
          const maxDist = 22;

          if (Math.abs(x) < maxDist) {
            const col = parseInt(Math.round((x + 20) / 10));
            data.unseenBadCols.push(col);
          }
          if (Math.abs(y) < maxDist) {
            const row = parseInt(Math.round((y + 20) / 10));
            data.unseenBadRows.push(row);
          }
        }

        data.unseenBadRows.sort();
        data.unseenBadCols.sort();
      },
      alertText: (data, _matches, output) => {
        delete data.unseenIds;

        // consider asserting that badCols are 0, 2, 4 here.
        if (data.unseenBadRows.includes(2))
          return output.bowLight();
        return output.bowDark();
      },
      outputStrings: {
        bowDark: {
          en: 'On Dark (E/W of center)',
          de: 'Auf Dunkel (O/W von der Mitte)',
          fr: 'Sur une foncée (E/O du centre)',
          ja: '闇へ (東西)',
          cn: '去黑色 (东西/左右)',
          ko: '어두운 타일 (가운데 타일의 왼/오른쪽)',
        },
        bowLight: {
          en: 'On Light (diagonal from center)',
          de: 'Auf Licht (Diagonal von der Mitte)',
          fr: 'Sur une claire (diagonale du centre)',
          ja: '光へ (斜め)',
          cn: '去白色 (对角)',
          ko: '밝은 타일 (가운데 타일의 대각선)',
        },
      },
    },
    {
      id: 'Delubrum Avowed Fury Of Bozja',
      // Allegiant Arsenal 5987 = staff (out), followed up with Fury of Bozja 5973
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Avowed', id: '5987', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Trinität Der Eingeschworenen', id: '5987', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Trinité Féale', id: '5987', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'トリニティ・アヴァウド', id: '5987', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'Delubrum Avowed Flashvane',
      // Allegiant Arsenal 5986 = bow (get behind), followed up by Flashvane 5972
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Avowed', id: '5986', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Trinität Der Eingeschworenen', id: '5986', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Trinité Féale', id: '5986', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'トリニティ・アヴァウド', id: '5986', capture: false }),
      response: Responses.getBehind(),
    },
    {
      id: 'Delubrum Avowed Infernal Slash',
      // Allegiant Arsenal 5985 = sword (get front), followed up by Infernal Slash 5971
      netRegex: NetRegexes.startsUsing({ source: 'Trinity Avowed', id: '5985', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Trinität Der Eingeschworenen', id: '5985', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Trinité Féale', id: '5985', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'トリニティ・アヴァウド', id: '5985', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get In Front',
          de: 'Geh vor den Boss',
          fr: 'Soyez devant',
          ja: 'ボスの正面へ',
          cn: '去正面',
          ko: '정면에 서기',
        },
      },
    },
    // *** The Queen
    {
      id: 'Delubrum Queen Empyrean Iniquity',
      netRegex: NetRegexes.startsUsing({ source: 'The Queen', id: '59C8', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Kriegsgöttin', id: '59C8', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Garde-La-Reine', id: '59C8', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'セイブ・ザ・クイーン', id: '59C8', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Delubrum Queen Cleansing Slash',
      netRegex: NetRegexes.startsUsing({ source: 'The Queen', id: '59C5' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Kriegsgöttin', id: '59C5' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Garde-La-Reine', id: '59C5' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'セイブ・ザ・クイーン', id: '59C5' }),
      condition: tankBusterOnParty,
      // Probably this is where you swap, but maybe that's not something you can
      // count on in an alliance raid, where there might not even be another tank.
      response: Responses.tankBuster(),
    },
    {
      id: 'Delubrum Queen Cleansing Slash Bleed',
      netRegex: NetRegexes.startsUsing({ source: 'The Queen', id: '59C5' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Kriegsgöttin', id: '59C5' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Garde-La-Reine', id: '59C5' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'セイブ・ザ・クイーン', id: '59C5' }),
      condition: (data) => data.CanCleanse(),
      delaySeconds: 5,
      infoText: (data, matches, output) => output.text({ player: data.ShortName(matches.target) }),
      outputStrings: {
        text: {
          en: 'Esuna ${player}',
          de: 'Medica ${player}',
          fr: 'Guérison sur ${player}',
          ja: 'エスナ: ${player}',
          cn: '解除死亡宣告: ${player}',
          ko: '"${player}" 에스나',
        },
      },
    },
    {
      id: 'Delubrum Queen Northswain\'s Glow',
      netRegex: NetRegexes.startsUsing({ source: 'The Queen', id: '59C3', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Kriegsgöttin', id: '59C3', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Garde-La-Reine', id: '59C3', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'セイブ・ザ・クイーン', id: '59C3', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      // Technically, this is "away from where the moving lines intersect each other"
      // but "away from orbs" also will do the trick here.
      outputStrings: {
        text: {
          en: 'Away from Line Intersections',
          de: 'Geh weg von den Linienkreuzungen',
          fr: 'Éloignez-vous des intersections de ligne',
          ja: '十字から離れる',
          cn: '远离线的交点',
          ko: '선이 만나는 지점에서 떨어지기',
        },
      },
    },
    {
      id: 'Delubrum Queen Automatic Turret',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Gunner', id: '59DE', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Schütze Der Königin', id: '59DE', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Fusilier De La Reine', id: '59DE', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'クイーンズ・ガンナー', id: '59DE', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Avoid Laser Bounces',
          de: 'Weiche den abgelenken Lasern aus',
          fr: 'Évitez les rebonds de laser',
          ja: 'レーザーを避ける',
          cn: '躲避激光',
          ko: '레이저 피하기',
        },
      },
    },
    {
      id: 'Delubrum Queen Reversal Of Forces',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Warrior', id: '59D4', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Kriegerin Der Königin', id: '59D4', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Guerrière De La Reine', id: '59D4', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'クイーンズ・ウォリアー', id: '59D4', capture: false }),
      run: (data) => data.reversalOfForces = true,
    },
    {
      // Called during the knockback cast itself, not during the 59C6 Heaven's Wrath
      // where the knockback line appears.  This is mostly because we don't know about
      // reversal at that point.
      id: 'Delubrum Queen Heaven\'s Wrath',
      // This is used sometimes by The Queen and sometimes by The Queen's Gunner (?!).
      // This could just be stale parser data though, as the name changes for the actual usage.
      netRegex: NetRegexes.startsUsing({ id: '59C7', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '59C7', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '59C7', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '59C7', capture: false }),
      alertText: (data, _matches, output) => {
        if (!data.seenHeavensWrath)
          return output.getKnockedTowardsMiddle();
        if (data.reversalOfForces)
          return output.getKnockedToSmallBomb();
        return output.getKnockedToLargeBomb();
      },
      run: (data) => {
        data.seenHeavensWrath = true;
        delete data.reversalOfForces;
      },
      outputStrings: {
        getKnockedTowardsMiddle: {
          en: 'Get Knocked Towards Middle',
          de: 'Zur Mitte zurückstoßen lassen',
          fr: 'Faites-vous pousser vers le milieu',
          ja: '中へ吹き飛ばされる',
          cn: '击退到中间',
          ko: '중앙에서 넉백 당하기',
        },
        getKnockedToSmallBomb: {
          en: 'Get Knocked To Small Bomb',
          de: 'Zu kleinen Bomben zurückstoßen lassen',
          fr: 'Faites-vous pousser sur une petite bombe',
          ja: '小さい爆弾へ吹き飛ばされる',
          cn: '击退到小炸弹',
          ko: '작은 폭탄으로 넉백당하기',
        },
        getKnockedToLargeBomb: {
          en: 'Get Knocked To Large Bomb',
          de: 'Zu großen Bomben zurückstoßen lassen',
          fr: 'Faites-vous pousser sur une grosse bombe',
          ja: '大きい爆弾へ吹き飛ばされる',
          cn: '击退到大炸弹',
          ko: '큰 폭탄으로 넉백당하기',
        },
      },
    },
    {
      id: 'Delubrum Queen Judgment Blade Right',
      netRegex: NetRegexes.startsUsing({ source: 'The Queen', id: '59C2', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Kriegsgöttin', id: '59C2', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Garde-La-Reine', id: '59C2', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'セイブ・ザ・クイーン', id: '59C2', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Find Charge, Dodge Right',
          de: 'Halte nach dem Ansturm ausschau, weiche nach rechts aus',
          fr: 'Repérez la charge, esquivez à droite',
          ja: '右へ、突進を避ける',
          cn: '去右侧躲避冲锋',
          ko: '돌진 찾고, 오른쪽 피하기',
        },
      },
    },
    {
      id: 'Delubrum Queen Judgment Blade Left',
      netRegex: NetRegexes.startsUsing({ source: 'The Queen', id: '59C1', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Kriegsgöttin', id: '59C1', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Garde-La-Reine', id: '59C1', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'セイブ・ザ・クイーン', id: '59C1', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Find Charge, Dodge Left',
          de: 'Halte nach dem Ansturm ausschau, weiche nach links aus',
          fr: 'Repérez la charge, esquivez à gauche',
          ja: '左へ、突進を避ける',
          cn: '去左侧躲避冲锋',
          ko: '돌진 찾고, 왼쪽 피하기',
        },
      },
    },
    {
      id: 'Delubrum Queen Gods Save The Queen',
      netRegex: NetRegexes.startsUsing({ source: 'The Queen', id: '59C9', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Kriegsgöttin', id: '59C9', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Garde-La-Reine', id: '59C9', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'セイブ・ザ・クイーン', id: '59C9', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Delubrum Queen Secrets Revealed',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Soldier', id: '5B8A', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Soldat Der Königin', id: '5B8A', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Soldat De La Reine', id: '5B8A', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'クイーンズ・ソルジャー', id: '5B8A', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Away from tethered adds',
          de: 'Weg von verbundenen Adds',
          fr: 'Éloignez-vous des adds liés',
          ja: '線に繋がる雑魚から離れる',
          cn: '远离连线小怪',
          ko: '선 연결된 쫄 피하기',
        },
      },
    },
    {
      id: 'Delubrum Queen Shield Omen',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Knight', id: '59CB', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Ritter Der Königin', id: '59CB', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Chevalier De La Reine', id: '59CB', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'クイーンズ・ナイト', id: '59CB', capture: false }),
      delaySeconds: 2.5,
      response: Responses.getUnder('alarm'),
    },
    {
      id: 'Delubrum Queen Sword Omen',
      netRegex: NetRegexes.startsUsing({ source: 'Queen\'s Knight', id: '59CA', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Ritter Der Königin', id: '59CA', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Chevalier De La Reine', id: '59CA', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'クイーンズ・ナイト', id: '59CA', capture: false }),
      delaySeconds: 2.5,
      response: Responses.getOut(),
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
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'Seeker Avatar': 'Spaltteil Der Sucher',
        'Aetherial Bolt': 'Magiegeschoss',
        'Aetherial Burst': 'Magiebombe',
        'Aetherial Orb': 'Magiekugel',
        'Aetherial Ward': 'Magiewall',
        'Automatic Turret': 'Selbstschuss-Gyrocopter',
        'Avowed Avatar': 'Spaltteil der Eingeschworenen',
        'Blazing Orb': 'Feuerball',
        'Bozjan Phantom': 'Bozja-Phantom',
        'Dahu': 'Dahu',
        'Frost Arrow': 'Frostpfeil',
        'Marchosias': 'Marchosias',
        'Pride of the Lion': 'Saal des Löwen',
        'Queen\'s Gunner': 'Schütze der Königin',
        'Queen\'s Knight': 'Ritter der Königin',
        'Queen\'s Soldier': 'Soldat der Königin',
        'Queen\'s Warrior': 'Kriegerin der Königin',
        'Queensheart': 'Saal der Dienerinnen',
        'Soldier Avatar': 'Spaltteil des Soldaten',
        'Stuffy Wraith': 'muffig(?:e|er|es|en) Schrecken',
        'Swirling Orb': 'Eisball',
        'Tempestuous Orb': 'groß(?:e|er|es|en) Eisball',
        'The Hall of Hieromancy': 'Halle des Orakels',
        'The Hall of Supplication': 'Große Gebetshalle',
        'The Queen': 'Kriegsgöttin',
        'The Theater of One': 'Einsame Arena',
        'The Vault of Singing Crystal': 'Ort des Klingenden Kristalls',
        'Trinity Avowed': 'Trinität der Eingeschworenen',
        'Trinity Seeker': 'Trinität der Sucher',
      },
      'replaceText': {
        '--explosion--': '--Explosion--',
        '--stunned--': '--betäubt--',
        '--unstunned--': '--nicht länger betäubt--',
        'Above Board': 'Über dem Feld',
        'Act Of Mercy': 'Schneller Stich des Dolches',
        'Allegiant Arsenal': 'Waffenwechsel',
        'Automatic Turret': 'Selbstschuss-Gyrocopter',
        'Baleful Blade': 'Stoß der Edelklinge',
        'Baleful Swathe': 'Schwarzer Wirbel der Edelklinge',
        'Beck And Call To Arms': 'Feuerbefehl',
        'Blade Of Entropy': 'Eisflammenklinge',
        'Blood And Bone': 'Wellenschlag',
        'Bombslinger': 'Bombenabwurf',
        'Cleansing Slash': 'Säubernder Schnitt',
        'Coat Of Arms': 'Trotz',
        'Creeping Miasma': 'Miasmahauch',
        'Dead Iron': 'Woge der Feuerfaust',
        'Double Gambit': 'Illusionsmagie',
        'Elemental Arrow': 'Element-Pfeil',
        'Elemental Blast': 'Element-Explosion',
        'Elemental Impact': 'Einschlag',
        'Empyrean Iniquity': 'Empyreische Interdiktion',
        'Excruciation': 'Fürchterlicher Schmerz',
        'Feral Howl': 'Wildes Heulen',
        'Firebreathe': 'Lava-Atem',
        'First Mercy': '1. Streich: Viererdolch-Haltung',
        'Flames Of Bozja': 'Bozianische Flamme',
        'Flashvane': 'Schockpfeile',
        'Fourth Mercy': '4. Streich: Viererdolch-Haltung',
        'Freedom Of Bozja': 'Bozianische Freiheit',
        'Fury Of Bozja': 'Bozianische Wut',
        'Gleaming Arrow': 'Funkelnder Pfeil',
        'Glory Of Bozja': 'Stolz von Bozja',
        'Gods Save The Queen': 'Wächtergott der Königin',
        'Head Down': 'Scharrende Hufe',
        'Heat Breath': 'Hitzeatem',
        'Heated Blast': 'Hitzekugel',
        'Heaven\'s Wrath': 'Heilige Perforation',
        'Hot And Cold': 'Heiß und kalt',
        'Hot Charge': 'Heiße Rage',
        'Hunter\'s Claw': 'Jägerklaue',
        'Infernal Slash': 'Yama-Schnitt',
        'Iron Impact': 'Kanon der Feuerfaust',
        'Iron Splitter': 'Furor der Feuerfaust',
        'Judgment Blade': 'Klinge des Urteils',
        'Left-Sided Shockwave': 'Linke Schockwelle',
        'Lots Cast': 'Magieexplosion',
        'Malediction Of Agony': 'Pochender Fluch',
        'Manipulate Miasma': 'Miasmakontrolle',
        'Merciful Arc': 'Fächertanz des Dolches',
        'Merciful Blooms': 'Kasha des Dolches',
        'Merciful Breeze': 'Yukikaze des Dolches',
        'Merciful Moon': 'Gekko des Dolches',
        'Mercy Fourfold': 'Viererdolch',
        'Northswain\'s Glow': 'Stella Polaris',
        'Optimal Play': 'Bestes Manöver',
        'Pawn Off': 'Kranzklinge',
        'Phantom Edge': 'Phantomklingen',
        'Queen\'s Edict': 'Hohes Edikt der Königin',
        'Queen\'s Justice': 'Hoheitliche Strafe',
        'Queen\'s Shot': 'Omnidirektionalschuss',
        'Queen\'s Will': 'Edikt der Königin',
        'Rapid Sever': 'Radikale Abtrennung',
        'Relentless Play': 'Koordinierter Angriff',
        'Reverberating Roar': 'Sturzimpuls',
        'Reversal Of Forces': 'Materieinversion',
        'Right-Sided Shockwave': 'Rechte Schockwelle',
        'Seasons Of Mercy': 'Setsugekka des Dolches',
        'Second Mercy': '2. Streich: Viererdolch-Haltung',
        'Secrets Revealed': 'Enthüllte Geheimnisse',
        'Shield Omen': 'Schildhaltung',
        'Shimmering Shot': 'Glitzerpfeil',
        'Shot In The Dark': 'Einhändiger Schuss',
        'Strongpoint Defense': 'Widerstand',
        'Summon': 'Beschwörung',
        'Swirling Miasma': 'Miasmawirbel',
        'Sword Omen': 'Schwerthaltung',
        'Tail Swing': 'Schwanzfeger',
        'The Ends': 'Kreuzschnitt',
        'The Means': 'Kreuzschlag',
        'Third Mercy': '3. Streich: Viererdolch-Haltung',
        'Transference': 'Transfer',
        'Turret\'s Tour': 'Querschlägerhagel',
        'Undying Hatred': 'Über-Psychokinese',
        'Unseen Eye': 'Geist des Blütensturms',
        'Verdant Path': 'Lehren des Grünen Pfades',
        'Verdant Tempest': 'Zauberwind des Grünen Pfades',
        'Vile Wave': 'Welle der Boshaftigkeit',
        'Weave Miasma': 'Miasmathese',
        'Wrath Of Bozja': 'Bozianischer Zorn',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Seeker Avatar': 'Clone De La Trinité Soudée',
        'Aetherial Bolt': 'petite bombe',
        'Aetherial Burst': 'énorme bombe',
        'Aetherial Orb': 'amas d\'éther élémentaire',
        'Aetherial Ward': 'Barrière magique',
        'Automatic Turret': 'Auto-tourelle',
        'Avowed Avatar': 'clone de la trinité féale',
        'Blazing Orb': 'boule de feu',
        'Bozjan Phantom': 'fantôme bozjien',
        'Dahu': 'dahu',
        'Frost Arrow': 'volée de flèches de glace',
        'Marchosias': 'marchosias',
        'Pride of the Lion': 'Hall du Lion',
        'Queen\'s Gunner': 'fusilier de la reine',
        'Queen\'s Knight': 'chevalier de la reine',
        'Queen\'s Soldier': 'soldat de la reine',
        'Queen\'s Warrior': 'guerrière de la reine',
        'Queensheart': 'Chambre des prêtresses',
        'Soldier Avatar': 'double de soldat',
        'Stuffy Wraith': 'spectre boursouflé',
        'Swirling Orb': 'boule de glace',
        'Tempestuous Orb': 'grande boule de glace',
        'The Hall of Hieromancy': 'Salle des oracles',
        'The Hall of Supplication': 'Grande salle des prières',
        'The Queen': 'Garde-la-Reine',
        'The Theater of One': 'Amphithéâtre en ruines',
        'The Vault of Singing Crystal': 'Chambre des cristaux chantants',
        'Trinity Avowed': 'trinité féale',
        'Trinity Seeker': 'trinité soudée',
      },
      'replaceText': {
        '\\?': ' ?',
        '--explosion--': '--explosion--',
        '--stunned--': '--étourdi(e)--',
        '--unstunned--': '--non étourdi(e)--',
        'Above Board': 'Aire de flottement',
        'Act Of Mercy': 'Fendreciel rédempteur',
        'Allegiant Arsenal': 'Changement d\'arme',
        'Automatic Turret': 'Auto-tourelle',
        'Baleful Blade': 'Assaut singulier',
        'Baleful Swathe': 'Flux de noirceur singulier',
        'Beck And Call To Arms': 'Ordre d\'attaquer',
        'Blade Of Entropy': 'Sabre du feu et de la glace',
        'Blood And Bone': 'Onde tranchante',
        'Bombslinger': 'Jet de bombe',
        'Cleansing Slash': 'Taillade purifiante',
        'Coat Of Arms': 'Bouclier directionnel',
        'Creeping Miasma': 'Coulée miasmatique',
        'Dead Iron': 'Vague des poings de feu',
        'Double Gambit': 'Manipulation des ombres',
        'Elemental Arrow': 'Flèche élémentaire',
        'Elemental Blast': 'Explosion élémentaire',
        'Elemental Impact': 'Impact',
        'Empyrean Iniquity': 'Injustice empyréenne',
        'Excruciation': 'Atroce douleur',
        'Feral Howl': 'Rugissement sauvage',
        'Firebreathe': 'Souffle de lave',
        'First Mercy': 'Première lame rédemptrice',
        'Flames Of Bozja': 'Flammes de Bozja',
        'Flashvane': 'Flèches fulgurantes',
        'Fourth Mercy': 'Quatrième lame rédemptrice',
        'Freedom Of Bozja': 'Liberté de Bozja',
        'Fury Of Bozja': 'Furie de Bozja',
        'Gleaming Arrow': 'Flèche miroitante',
        'Glory Of Bozja': 'Gloire de Bozja',
        'Gods Save The Queen': 'Que les Dieux gardent la Reine',
        'Head Down': 'Charge bestiale',
        'Heat Breath': 'Souffle brûlant',
        'Heated Blast': 'Déflagration de feu',
        'Heaven\'s Wrath': 'Ire céleste',
        'Hot And Cold': 'Chaud et froid',
        'Hot Charge': 'Charge brûlante',
        'Hunter\'s Claw': 'Griffes prédatrices',
        'Infernal Slash': 'Taillade de Yama',
        'Iron Impact': 'Canon d\'ardeur des poings de feu',
        'Iron Splitter': 'Fracas des poings de feu',
        'Judgment Blade': 'Lame du jugement',
        'Left-Sided Shockwave/Right-Sided Shockwave': 'Onde de choc gauche/droite',
        'Lots Cast': 'Bombe ensorcelée',
        'Malediction Of Agony': 'Malédiction lancinante',
        'Manipulate Miasma': 'Contrôle des miasmes',
        'Merciful Arc': 'Éventail rédempteur',
        'Merciful Blooms': 'Kasha rédempteur',
        'Merciful Breeze': 'Yukikaze rédempteur',
        'Merciful Moon': 'Gekkô rédempteur',
        'Mercy Fourfold': 'Quatuor de lames rédemptrices',
        'Northswain\'s Glow': 'Étoile du Nord',
        'Optimal Play': 'Technique de maître d\'armes',
        'Pawn Off': 'Sabre tournoyant',
        'Phantom Edge': 'Épées spectrales',
        'Queen\'s Edict': 'Injonction de Gunnhildr',
        'Queen\'s Justice': 'Châtiment royal',
        'Queen\'s Shot': 'Tir tous azimuts',
        'Queen\'s Will': 'Édit de Gunnhildr',
        'Rapid Sever': 'Tranchage rapide',
        'Relentless Play': 'Ordre d\'attaque coordonnée',
        'Reverberating Roar': 'Cri disloquant',
        'Reversal Of Forces': 'Inversion des masses',
        'Right-Sided Shockwave/Left-Sided Shockwave': 'Onde de choc droite/gauche',
        'Seasons Of Mercy': 'Setsugekka rédempteur',
        'Second Mercy': 'Deuxième lame rédemptrice',
        'Secrets Revealed': 'Corporification',
        'Shield Omen/Sword Omen': 'Posture du bouclier/épée',
        'Shimmering Shot': 'Flèches scintillantes',
        'Shot In The Dark': 'Tir à une main',
        'Strongpoint Defense': 'Défense absolue',
        'Summon': 'Invocation',
        'Swirling Miasma': 'Anneau miasmatique',
        'Sword Omen/Shield Omen': 'Posture de l\'épée/bouclier',
        'Tail Swing': 'Queue balayante',
        'The Ends': 'Croix lacérante',
        'The Means': 'Croix perforante',
        'Third Mercy': 'Troisième lame rédemptrice',
        'Transference': 'Transfert',
        'Turret\'s Tour': 'Ricochets frénétiques',
        'Undying Hatred': 'Psychokinèse',
        'Unseen Eye': 'Spectres de l\'ouragan de fleurs',
        'Verdant Path': 'École de la Voie verdoyante',
        'Verdant Tempest': 'Tempête de la Voie verdoyante',
        'Vile Wave': 'Vague de malveillance',
        'Weave Miasma': 'Miasmologie',
        'Wrath Of Bozja': 'Courroux de Bozja',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Seeker Avatar': 'シーカーの分体',
        'Aetherial Bolt': '魔弾',
        'Aetherial Burst': '大魔弾',
        'Aetherial Orb': '魔力塊',
        'Aetherial Ward': '魔法障壁',
        'Automatic Turret': 'オートタレット',
        'Avowed Avatar': 'アヴァウドの分体',
        'Blazing Orb': '炎球',
        'Bozjan Phantom': 'ボズヤ・ファントム',
        'Dahu': 'ダウー',
        'Frost Arrow': 'フロストアロー',
        'Marchosias': 'マルコシアス',
        'Pride of the Lion': '雄獅子の広間',
        'Queen\'s Gunner': 'クイーンズ・ガンナー',
        'Queen\'s Knight': 'クイーンズ・ナイト',
        'Queen\'s Soldier': 'クイーンズ・ソルジャー',
        'Queen\'s Warrior': 'クイーンズ・ウォリアー',
        'Queensheart': '巫女たちの広間',
        'Soldier Avatar': 'ソルジャーの分体',
        'Stuffy Wraith': 'スタフィー・レイス',
        'Swirling Orb': '氷球',
        'Tempestuous Orb': '大氷球',
        'The Hall of Hieromancy': '託宣所',
        'The Hall of Supplication': '大祈祷所',
        'The Queen': 'セイブ・ザ・クイーン',
        'The Theater of One': '円形劇場跡',
        'The Vault of Singing Crystal': '響き合う水晶の間',
        'Trinity Avowed': 'トリニティ・アヴァウド',
        'Trinity Seeker': 'トリニティ・シーカー',
      },
      'replaceText': {
        '--explosion--': '--爆発--',
        '--stunned--': '--スタンされる--',
        '--unstunned--': '--スタンされない--',
        'Above Board': '浮遊波',
        'Act Of Mercy': '破天鋭刃風',
        'Allegiant Arsenal': 'ウェポンチェンジ',
        'Automatic Turret': 'オートタレット',
        'Baleful Blade': '豪剣強襲撃',
        'Baleful Swathe': '豪剣黒流破',
        'Beck And Call To Arms': '攻撃命令',
        'Blade Of Entropy': '氷炎刃',
        'Blood And Bone': '波動斬',
        'Bombslinger': '爆弾投擲',
        'Cleansing Slash': '乱命割殺斬',
        'Coat Of Arms': '偏向防御',
        'Creeping Miasma': '瘴気流',
        'Dead Iron': '熱拳振動波',
        'Double Gambit': '幻影術',
        'Elemental Arrow': '熱/凍気矢',
        'Elemental Blast': '熱/凍気弾',
        'Elemental Impact': '着弾',
        'Empyrean Iniquity': '天魔鬼神爆',
        'Excruciation': '激痛',
        'Feral Howl': 'フェラルハウル',
        'Firebreathe': 'ラーヴァブレス',
        'First Mercy': '初手：鋭刃四刀の構え',
        'Flames Of Bozja': 'フレイム・オブ・ボズヤ',
        'Flashvane': 'フラッシュアロー',
        'Fourth Mercy': '四手：鋭刃四刀の構え',
        'Freedom Of Bozja': 'リバティ・オブ・ボズヤ',
        'Fury Of Bozja': 'フューリー・オブ・ボズヤ',
        'Gleaming Arrow': 'グリッターアロー',
        'Glory Of Bozja': 'グローリー・オブ・ボズヤ',
        'Gods Save The Queen': 'ゴッド・セイブ・ザ・クイーン',
        'Head Down': 'ビーストチャージ',
        'Heat Breath': '火炎の息',
        'Heated Blast': '熱気弾',
        'Heaven\'s Wrath': '聖光爆裂斬',
        'Hot And Cold': '氷炎乱流',
        'Hot Charge': 'ホットチャージ',
        'Hunter\'s Claw': 'ハンタークロウ',
        'Infernal Slash': 'ヤーマスラッシュ',
        'Iron Impact': '熱拳烈気砲',
        'Iron Splitter': '熱拳地脈爆',
        'Judgment Blade': '不動無明剣',
        'Left-Sided Shockwave': 'レフトサイド・ショックウェーブ',
        'Lots Cast': '魔爆発',
        'Malediction Of Agony': '苦悶の呪詛',
        'Manipulate Miasma': '瘴気操作',
        'Merciful Arc': '鋭刃舞踏扇',
        'Merciful Blooms': '鋭刃花車',
        'Merciful Breeze': '鋭刃雪風',
        'Merciful Moon': '鋭刃月光',
        'Mercy Fourfold': '鋭刃四刀流',
        'Northswain\'s Glow': '北斗骨砕斬',
        'Optimal Play': '武装戦技',
        'Pawn Off': '旋回刃',
        'Phantom Edge': '霊幻剣',
        'Queen\'s Edict': '女王の大勅令',
        'Queen\'s Justice': '処罰令',
        'Queen\'s Shot': '全方位射撃',
        'Queen\'s Will': '女王の勅令',
        'Rapid Sever': '滅多斬り',
        'Relentless Play': '連携命令',
        'Reverberating Roar': '崩落誘発',
        'Reversal Of Forces': '質量転換',
        'Right-Sided Shockwave': 'ライトサイド・ショックウェーブ',
        'Seasons Of Mercy': '鋭刃雪月花',
        'Second Mercy': '二手：鋭刃四刀の構え',
        'Secrets Revealed': '実体結像',
        'Shield Omen': '盾の型',
        'Shimmering Shot': 'トゥインクルアロー',
        'Shot In The Dark': '片手撃ち',
        'Strongpoint Defense': '絶対防御',
        'Summon': '召喚',
        'Swirling Miasma': '瘴気輪',
        'Sword Omen': '剣の型',
        'Tail Swing': 'テールスイング',
        'The Ends': '十字斬',
        'The Means': '十字撃',
        'Third Mercy': '三手：鋭刃四刀の構え',
        'Transference': '転移',
        'Turret\'s Tour': '跳弾乱舞',
        'Undying Hatred': '超ねんりき',
        'Unseen Eye': '花嵐の幻影',
        'Verdant Path': '翠流派',
        'Verdant Tempest': '翠流魔風塵',
        'Vile Wave': '悪意の波動',
        'Weave Miasma': '瘴気術',
        'Wrath Of Bozja': 'ラース・オブ・ボズヤ',
      },
    },
  ],
};
