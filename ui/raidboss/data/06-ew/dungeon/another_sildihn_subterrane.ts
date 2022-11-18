import Conditions from '../../../../../resources/conditions';
import { UnreachableCode } from '../../../../../resources/not_reached';
import Outputs from '../../../../../resources/outputs';
import { callOverlayHandler } from '../../../../../resources/overlay_plugin_api';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { PluginCombatantState } from '../../../../../types/event';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: Gladiator triggers for gold/silver location using OverlayPlugin?
// TODO: Gladiator adjustments to timeline
// TODO: Shadowcaster Infern Brand 1 and 4 safe location triggers if possible
// TODO: Shadowcaster adjustments to timeline

export interface Data extends RaidbossData {
  suds?: string;
  puffCounter: number;
  silkenPuffs: { [id: string]: { effect: string; location: string } };
  freshPuff2SafeAlert?: string;
  soapCounter: number;
  beaterCounter: number;
  spreeCounter: number;
  mightCasts: PluginCombatantState[];
  mightDir?: string;
  hasLingering?: boolean;
  thunderousEchoPlayer?: string;
  gildedCounter: number;
  silveredCounter: number;
  arcaneFontCounter: number;
  myFlame?: number;
  brandEffects: { [effectId: number]: string };
  brandCounter: number;
  myLastCut?: number;
  firstColorCut?: 'orange' | 'blue';
  flamesCutCounter: number;
  waveCounter: number;
}

const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
const silkieCenterX = -335;
const silkieCenterY = -155;

const positionTo8Dir = (posX: number, posY: number, centerX: number, centerY: number) => {
  const relX = posX - centerX;
  const relY = posY - centerY;

  // Dirs: N = 0, NE = 1, ..., NW = 7
  return Math.round(4 - 4 * Math.atan2(relX, relY) / Math.PI) % 8;
};

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.AnotherSildihnSubterrane,
  timelineFile: 'another_sildihn_subterrane.txt',
  initData: () => {
    return {
      puffCounter: 0,
      silkenPuffs: {},
      soapCounter: 0,
      beaterCounter: 0,
      spreeCounter: 0,
      mightCasts: [],
      gildedCounter: 0,
      silveredCounter: 0,
      arcaneFontCounter: 0,
      brandEffects: {},
      brandCounter: 0,
      flamesCutCounter: 0,
      waveCounter: 0,
    };
  },
  triggers: [
    // ---------------- first trash ----------------
    {
      id: 'ASS Atropine Spore',
      type: 'StartsUsing',
      netRegex: { id: '7960', source: 'Aqueduct Belladonna', capture: false },
      response: Responses.getIn(),
    },
    {
      id: 'ASS Frond Affront',
      type: 'StartsUsing',
      netRegex: { id: '7961', source: 'Aqueduct Belladonna', capture: false },
      response: Responses.lookAway(),
    },
    {
      id: 'ASS Deracinator',
      type: 'StartsUsing',
      netRegex: { id: '7962', source: 'Aqueduct Belladonna' },
      response: Responses.tankBuster(),
    },
    {
      id: 'ASS Left Sweep',
      type: 'StartsUsing',
      netRegex: { id: '7964', source: 'Aqueduct Kaluk', capture: false },
      response: Responses.goRight(),
    },
    {
      id: 'ASS Right Sweep',
      type: 'StartsUsing',
      netRegex: { id: '7963', source: 'Aqueduct Kaluk', capture: false },
      response: Responses.goLeft(),
    },
    {
      id: 'ASS Creeping Ivy',
      type: 'StartsUsing',
      netRegex: { id: '7965', source: 'Aqueduct Kaluk', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'ASS Honeyed Left',
      type: 'StartsUsing',
      netRegex: { id: '795B', source: 'Aqueduct Udumbara', capture: false },
      response: Responses.goRight(),
    },
    {
      id: 'ASS Honeyed Right',
      type: 'StartsUsing',
      netRegex: { id: '795C', source: 'Aqueduct Udumbara', capture: false },
      response: Responses.goLeft(),
    },
    {
      id: 'ASS Honeyed Front',
      type: 'StartsUsing',
      netRegex: { id: '795D', source: 'Aqueduct Udumbara', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'ASS Arboreal Storm',
      type: 'StartsUsing',
      netRegex: { id: '7957', source: 'Aqueduct Dryad', capture: false },
      response: Responses.getOut(),
    },
    // ---------------- Silkie ----------------
    {
      id: 'ASS Soap\'s Up',
      type: 'StartsUsing',
      netRegex: { id: '775A', source: 'Silkie', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Cardinals',
          de: 'Kardinal',
          fr: 'Cardinaux',
          ja: '十字回避',
          ko: '십자방향으로',
        },
      },
    },
    {
      id: 'ASS Dust Bluster',
      type: 'StartsUsing',
      netRegex: { id: '776C', source: 'Silkie', capture: false },
      response: Responses.knockback(),
    },
    {
      id: 'ASS Fresh Puff Tracker',
      // Use this separate trigger to increment data.puffCounter,
      // since we have multiple triggers to handle different Fresh Puffs
      type: 'StartsUsing',
      netRegex: { id: '7766', source: 'Silkie', capture: false },
      run: (data) => {
        ++data.puffCounter;
        data.silkenPuffs = {};
      },
    },
    {
      id: 'ASS Silken Puff Suds Gain',
      type: 'GainsEffect',
      // Silken Puffs:
      // CE9 Bracing Suds (Wind / Donut)
      // CEA Chilling Suds (Ice / Cardinal)
      // CEB Fizzling Suds (Lightning / Intercardinal)
      netRegex: { target: 'Silken Puff', effectId: 'CE[9AB]' },
      condition: (data) => data.puffCounter < 4, // don't track for Fresh Puff 4
      delaySeconds: 0.2, // sometimes a small delay between effects and updated pos data
      promise: async (data, matches) => {
        let puffCombatantData = null;
        puffCombatantData = await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.targetId, 16)],
        });
        if (puffCombatantData === null)
          return;
        if (puffCombatantData.combatants.length !== 1)
          return;
        const puff = puffCombatantData.combatants[0];
        if (!puff)
          return;
        const puffX = Math.floor(puff.PosX);
        const puffY = Math.floor(puff.PosY);
        const puffLoc = dirs[positionTo8Dir(puffX, puffY, silkieCenterX, silkieCenterY)];
        if (puffLoc !== undefined)
          data.silkenPuffs[matches.targetId] = { effect: matches.effectId, location: puffLoc };
      },
    },
    {
      id: 'ASS Silken Puff Suds Lose',
      type: 'LosesEffect',
      // Silken Puffs:
      // CE9 Bracing Suds (Wind / Donut)
      // CEA Chilling Suds (Ice / Cardinal)
      // CEB Fizzling Suds (Lightning / Intercardinal)
      netRegex: { target: 'Silken Puff', effectId: 'CE[9AB]' },
      condition: (data) => data.puffCounter < 4, // don't track for Fresh Puff 4
      run: (data, matches) => delete data.silkenPuffs[matches.targetId],
    },
    {
      id: 'ASS Squeaky Clean Right',
      type: 'StartsUsing',
      netRegex: { id: '7751', source: 'Silkie', capture: false },
      response: Responses.goLeft(),
    },
    {
      id: 'ASS Squeaky Clean Left',
      type: 'StartsUsing',
      netRegex: { id: '7752', source: 'Silkie', capture: false },
      response: Responses.goRight(),
    },
    {
      id: 'ASS Silkie Suds Gain',
      // Silkie:
      // CE1 Bracing Suds (Wind / Donut)
      // CE2 Chilling Suds (Ice / Cardinal)
      // CE3 Fizzling Suds (Lightning / Intercardinal)
      type: 'GainsEffect',
      netRegex: { effectId: 'CE[1-3]', target: 'Silkie' },
      run: (data, matches) => data.suds = matches.effectId,
    },
    {
      id: 'ASS Silkie Suds Lose',
      // Silkie:
      // CE1 Bracing Suds (Wind / Donut)
      // CE2 Chilling Suds (Ice / Cardinal)
      // CE3 Fizzling Suds (Lightning / Intercardinal)
      type: 'LosesEffect',
      netRegex: { effectId: 'CE[1-3]', target: 'Silkie', capture: false },
      run: (data) => delete data.suds,
    },
    {
      id: 'ASS Fresh Puff 1', // 3 puffs in triangle formation
      type: 'StartsUsing',
      // use 7751/7752 (Squeaky Clean Left/Right), rather than 7766 (Fresh Puff)
      // Squeaky Clean will change the effects of two puffs after the Fresh Puff cast
      // so it is the easiest method to determine mechanic resolution
      netRegex: { id: '775[12]', source: 'Silkie' },
      condition: (data) => data.puffCounter === 1,
      delaySeconds: 9, // delay alert until after Squeaky Clean Left/Right completes to collect Silken Puff effects
      durationSeconds: 8, // keep alert up until just before Slippery Soap trigger fires
      alertText: (data, matches, output) => {
        if (Object.keys(data.silkenPuffs).length !== 3)
          return output.default!();

        const puffsByLoc: { [location: string]: string } = {};
        for (const puff of Object.values(data.silkenPuffs)) {
          if (puff.location !== undefined)
            puffsByLoc[puff.location] = puff.effect;
        }

        // See Silken Puff Suds Gain trigger for list of Silken Puff effectIds
        // By this point, Squeaky Clean Left/Right has changed the N puff and either the SW/SE puff to CE9 (Bracing Suds)
        // We only care about the unaffected puff's status effect (CEA/CEB) for resolving the mechanic.
        let stackDir;
        let safeDir;
        if (matches.id === '7751') { // Squeaky Clean Right - resolve based on SW puff's effect
          if (puffsByLoc.SW === undefined)
            return output.default!();
          stackDir = puffsByLoc.SW === 'CEA' ? 'SE' : 'N'; // if SW is ice, SE stack (unsafe later); if SW is lightning, N stack (unsafe later)
          safeDir = stackDir === 'SE' ? 'N' : 'SE'; // safeDir is the one we are not stacking at
        } else if (matches.id === '7752') { // Squeaky Clean Left - resolve based on SE puff's effect
          if (puffsByLoc.SE === undefined)
            return output.default!();
          stackDir = puffsByLoc.SE === 'CEA' ? 'SW' : 'N'; // if SE is ice, SW stack (unsafe later); if SE is lightning, N stack (unsafe later)
          safeDir = stackDir === 'SW' ? 'N' : 'SW';
        } else {
          return output.default!();
        }
        return output.stacksafe!({ dir1: output[stackDir]!(), dir2: output[safeDir]!() });
      },
      outputStrings: {
        N: Outputs.dirN,
        SE: Outputs.dirSE,
        SW: Outputs.dirSW,
        stacksafe: {
          en: 'Stack ${dir1} (${dir2} safe after)',
          de: 'Sammeln ${dir1} (${dir2} danach sicher)',
          fr: 'Package ${dir1} (${dir2} sûr après)',
          ja: '${dir1}で頭割り (あとは${dir2}が安置)',
          ko: '${dir1}쪽에서 쉐어 (이후 ${dir2}쪽이 안전)',
        },
        default: {
          en: 'Stack near unsafe green puff',
          de: 'Neben unsicherem grünen Puschel sammeln',
          fr: 'Pack vers le pompon vert non safe',
          ja: '緑の下で頭割り',
          ko: '초록색 구슬에서 쉐어',
        },
      },
    },
    {
      id: 'ASS Slippery Soap',
      // Happens 5 times in the encounter
      type: 'Ability',
      // Silkie begins casting Slippery Soap (775E), and at the same time, either Silkie or an invisible actor will use 79FB on a player
      // the 79FB ability appears to correspond to the stack marker on that player, so use that ability id instead
      netRegex: { id: '79FB' },
      preRun: (data) => data.soapCounter++,
      alertText: (data, matches, output) => {
        if (data.suds === 'CE1') {
          // Does not happen on first or third Slippery Soap
          if (matches.target === data.me)
            return output.getBehindPartyKnockback!();
          return output.getInFrontOfPlayerKnockback!({ player: data.ShortName(matches.target) });
        }
        if (matches.target === data.me) {
          if (data.soapCounter === 1)
            return output.getBehindPuff!();
          if (data.soapCounter === 3)
            return output.getBehindPuffs!();
          return output.getBehindParty!();
        }
        return output.getInFrontOfPlayer!({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        getBehindPuff: {
          en: 'Behind puff and party',
          de: 'Hinter Puschel und Gruppe',
          fr: 'Derrière le pompon et le groupe',
          ja: 'たまの一番後ろへ',
          ko: '구슬 맨 뒤로',
        },
        getBehindPuffs: {
          en: 'Behind puffs and party (East/West)',
          de: 'Hinter Puschel und Gruppe (Osten/Westen)',
          fr: 'Derrière les pompons et le groupe (Est/Ouest)',
          ja: 'たまの一番後ろへ (東西)',
          ko: '구슬 맨 뒤로 (동/서)',
        },
        getBehindParty: {
          en: 'Behind party',
          de: 'Hinter Gruppe',
          fr: 'Derrière le groupe',
          ja: '一番後ろへ',
          ko: '맨 뒤로',
        },
        getBehindPartyKnockback: {
          en: 'Behind party (Knockback)',
          de: 'Hinter Gruppe (Rückstoß)',
          fr: 'Derrière le groupe (Poussée)',
          ja: 'ノックバック！ 一番後ろへ',
          ko: '맨 뒤로 (넉백)',
        },
        getInFrontOfPlayer: {
          en: 'In front of ${player}',
          de: 'Sei vor ${player}',
          fr: 'Devant ${player}',
          ja: '${player}の前へ',
          ko: '${player} 앞으로',
        },
        getInFrontOfPlayerKnockback: {
          en: 'In front of ${player} (Knockback)',
          de: 'Sei vor ${player} (Rückstoß)',
          fr: 'Devant ${player} (Poussée)',
          ja: 'ノックバック! ${player}の前へ',
          ko: '${player} 앞으로 (넉백)',
        },
      },
    },
    {
      id: 'ASS Slippery Soap with Chilling Suds',
      type: 'StartsUsing',
      netRegex: { id: '775E', source: 'Silkie' },
      condition: (data) => data.suds === 'CE2',
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 1,
      response: Responses.moveAround(),
    },
    {
      id: 'ASS Slippery Soap After',
      type: 'Ability',
      netRegex: { id: '775E', source: 'Silkie', capture: false },
      infoText: (data, _matches, output) => {
        switch (data.suds) {
          case 'CE1':
            return output.getUnder!();
          case 'CE2':
            return output.intercards!();
          case 'CE3':
            return output.spreadCardinals!();
        }
      },
      outputStrings: {
        getUnder: Outputs.getUnder,
        spreadCardinals: {
          en: 'Spread Cardinals',
          de: 'Kardinal verteilen',
          fr: 'Écartez-vous en cardinal',
          ja: '十字回避 => 散会',
          ko: '십자방향으로 산개',
        },
        intercards: {
          en: 'Intercards',
          de: 'Interkardinal',
          fr: 'Intercardinal',
          ja: '斜め',
          cn: '四角',
          ko: '대각선 쪽으로',
        },
      },
    },
    {
      id: 'ASS Carpet Beater',
      type: 'StartsUsing',
      netRegex: { id: '774F', source: 'Silkie' },
      preRun: (data) => data.beaterCounter++,
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          busterOnYou: Outputs.tankBusterOnYou,
          busterOnTarget: Outputs.tankBusterOnPlayer,
          busterOnYouPuffs: {
            en: 'Tank Buster on YOU, East/West Between Puffs',
            de: 'Tank Buster auf DIR, Osten/Westen zwischen Puschel',
            fr: 'Tankbuster sur VOUS, entre les pompons Est/Ouest',
            ja: '自分に強攻撃、東西で誘導',
            ko: '나에게 탱버, 동/서쪽 구슬 사이로',
          },
        };

        if (matches.target === data.me) {
          if (data.beaterCounter === 2)
            return { alertText: output.busterOnYouPuffs!() };
          return { infoText: output.busterOnYou!() };
        }

        if (data.role !== 'tank' && data.role !== 'healer')
          return;

        return { infoText: output.busterOnTarget!({ player: data.ShortName(matches.target) }) };
      },
    },
    {
      id: 'ASS Soaping Spree',
      // Boss does not cast Fizzling Duster with Soaping Spree
      type: 'StartsUsing',
      netRegex: { id: '7767', source: 'Silkie', capture: false },
      condition: (data) => {
        ++data.spreeCounter; // increment regardless if condition ultimately returns true or false
        // skip trigger on 2nd & 3rd Fresh Puff  - those are handled by separate Fresh Puff triggers because safe area can be more nuanced
        return data.puffCounter !== 2 && data.puffCounter !== 3;
      },
      infoText: (data, _matches, output) => {
        switch (data.suds) {
          case 'CE1':
            return output.getUnder!();
          case 'CE2':
            return output.intercards!();
          default:
            if (data.spreeCounter === 1)
              return output.underPuff!();
            return output.avoidPuffs!();
        }
      },
      outputStrings: {
        getUnder: Outputs.getUnder,
        intercards: {
          en: 'Intercards',
          de: 'Interkardinal',
          fr: 'Intercardinal',
          ja: '斜めへ',
          cn: '四角',
          ko: '대각선 쪽으로',
        },
        underPuff: {
          en: 'Under green puff',
          de: 'Unter grünem Puschel',
          fr: 'Sous le pompon vert',
          ja: '緑に貼り付く',
          ko: '초록색 구슬 밑으로',
        },
        avoidPuffs: {
          en: 'Avoid puff aoes',
          de: 'Weiche den Puschel AoEs aus',
          fr: 'Évitez les AoE des pompons',
          ja: 'たまからのゆか避けて',
          ko: '구슬 장판 피하기',
        },
      },
    },
    {
      id: 'ASS Total Wash',
      type: 'StartsUsing',
      netRegex: { id: '7750', source: 'Silkie', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'aoe + bleed',
          de: 'AoE + Blutung',
          fr: 'AoE + Saignement',
          ja: '全体攻撃 + 出血',
          ko: '전체 공격 + 도트',
        },
      },
    },
    {
      id: 'ASS Fresh Puff 2 Bait', // 4 puffs on cardinals or intercardinals with tethers
      type: 'Tether',
      netRegex: { source: 'Silken Puff' },
      condition: (data, matches) => matches.target === data.me && data.puffCounter === 2,
      durationSeconds: 6,
      alertText: (data, matches, output) => {
        const dirCards = ['N', 'E', 'S', 'W'];
        let silkieStatus = '';
        switch (data.suds) {
          case 'CE1': // Middle Safe
            silkieStatus = 'bossWind';
            break;
          case 'CE2': // Intercards Safe
            silkieStatus = 'bossIce';
            // never CE3 (lightning) for this mechanic
        }
        if (silkieStatus === '')
          return output.default!();

        const tetheredPuff = data.silkenPuffs[matches.sourceId];
        if (tetheredPuff === undefined)
          return;

        // See Silken Puff Suds Gain trigger for list of Silken Puff effectIds
        // Puff must be either CEA (Ice / blue) or CEB (Lightning / yellow) in this mechanic
        const puffEffect = tetheredPuff.effect === 'CEA' ? 'Blue' : 'Yellow';
        const puffDir = tetheredPuff.location;
        if (puffDir === undefined)
          return output.default!();

        const puffLocs = dirCards.includes(puffDir) ? 'Cardinal' : 'Intercard';
        const baitOutput: string = silkieStatus + puffEffect + puffLocs + 'Puff';
        const safeOutput: string = silkieStatus + 'Puffs' + puffLocs + 'SafeLater';

        // set the output for the subsequent safe call here and pass the output to the followup trigger
        // this keeps all of the interrelated output strings in this trigger for ease of customization
        data.freshPuff2SafeAlert = output[safeOutput]!();
        return output.bait!({
          boss: output[silkieStatus]!(),
          dir: output[puffDir]!(),
          puff: output[baitOutput]!(),
        });
      },
      outputStrings: {
        N: Outputs.dirN,
        E: Outputs.dirE,
        S: Outputs.dirS,
        W: Outputs.dirW,
        NW: Outputs.dirNW,
        NE: Outputs.dirNE,
        SE: Outputs.dirSE,
        SW: Outputs.dirSW,
        bait: {
          en: '${boss} - ${dir} ${puff}',
          de: '${boss} - ${dir} ${puff}',
          fr: '${boss} - ${dir} ${puff}',
          ja: '${boss} - ${dir} ${puff}',
          ko: '${boss} - ${dir} ${puff}',
        },
        bossIce: {
          en: 'Blue Tail',
          de: 'Blauer Schweif',
          fr: 'Queue bleue',
          ja: '青しっぽ',
          ko: '파란색 꼬리',
        },
        bossIcePuffsCardinalSafeLater: {
          en: 'Intercard Safe',
          de: 'Interkardinal sicher',
          fr: 'Intercardinal sûr',
          ja: '斜め',
          ko: '대각선이 안전',
        },
        bossIcePuffsIntercardSafeLater: {
          en: 'Intercard Safe',
          de: 'Interkardinal sicher',
          fr: 'Intercardinal sûr',
          ja: '斜め',
          ko: '대각선이 안전',
        },
        bossWind: {
          en: 'Green Tail',
          de: 'Grüner Schweif',
          fr: 'Queue verte',
          ja: '緑しっぽ',
          ko: '초록색 꼬리',
        },
        bossWindPuffsCardinalSafeLater: {
          en: 'Middle Safe',
          de: 'Mitte sicher',
          fr: 'Milieu sûr',
          ja: '真ん中',
          ko: '가운데가 안전',
        },
        bossWindPuffsIntercardSafeLater: {
          en: 'Middle Safe',
          de: 'Mitte sicher',
          fr: 'Milieu sûr',
          ja: '真ん中',
          ko: '가운데가 안전',
        },
        // keep tethered puff info as separate outputStrings
        // so users can customize for their particular strat
        bossIceBlueCardinalPuff: {
          en: 'Blue Puff',
          de: 'Blauer Puschel',
          fr: 'Pompon bleu',
          ja: '青たま',
          ko: '파란색 구슬',
        },
        bossIceBlueIntercardPuff: {
          en: 'Blue Puff',
          de: 'Blauer Puschel',
          fr: 'Pompon bleu',
          ja: '青たま',
          ko: '파란색 구슬',
        },
        bossIceYellowCardinalPuff: {
          en: 'Yellow Puff',
          de: 'Gelber Puschel',
          fr: 'Pompon jaune',
          ja: '黄色たま',
          ko: '노란색 구슬',
        },
        bossIceYellowIntercardPuff: {
          en: 'Yellow Puff',
          de: 'Gelber Puschel',
          fr: 'Pompon jaune',
          ja: '黄色たま',
          ko: '노란색 구슬',
        },
        bossWindBlueCardinalPuff: {
          en: 'Blue Puff',
          de: 'Blauer Puschel',
          fr: 'Pompon bleu',
          ja: '青たま',
          ko: '파란색 구슬',
        },
        bossWindBlueIntercardPuff: {
          en: 'Blue Puff',
          de: 'Blauer Puschel',
          fr: 'Pompon bleu',
          ja: '青たま',
          ko: '파란색 구슬',
        },
        bossWindYellowCardinalPuff: {
          en: 'Yellow Puff',
          de: 'Gelber Puschel',
          fr: 'Pompon jaune',
          ja: '黄色たま',
          ko: '노란색 구슬',
        },
        bossWindYellowIntercardPuff: {
          en: 'Yellow Puff',
          de: 'Gelber Puschel',
          fr: 'Pompon jaune',
          ja: '黄色たま',
          ko: '노란색 구슬',
        },
        default: {
          en: 'Bait puff',
          de: 'Puschel ködern',
          fr: 'Attirez le pompon',
          ja: 'たま誘導',
          ko: '구슬 유도',
        },
      },
    },
    {
      id: 'ASS Fresh Puff 2 Safe',
      type: 'Tether',
      netRegex: { source: 'Silken Puff' },
      condition: (data, matches) => matches.target === data.me && data.puffCounter === 2,
      delaySeconds: 6.5, // wait for bait alert to no longer display
      alertText: (data, _matches, output) => {
        if (data.freshPuff2SafeAlert !== undefined)
          return output.safe!({ safe: data.freshPuff2SafeAlert });
        return;
      },
      outputStrings: {
        safe: {
          en: '${safe}',
          de: '${safe}',
          fr: '${safe}',
          ja: '${safe}',
          ko: '${safe}',
        },
      },
    },
    {
      id: 'ASS Brim Over',
      type: 'Ability',
      netRegex: { id: '776E', source: 'Eastern Ewer', capture: false },
      suppressSeconds: 1,
      alertText: (_data, _matches, output) => output.avoidEwers!(),
      outputStrings: {
        avoidEwers: {
          en: 'Avoid Ewers',
          de: 'Krug ausweichen',
          fr: 'Évitez les aiguières',
          ja: '壺確認',
          ko: '항아리 피하기',
        },
      },
    },
    {
      // For Fresh Puff 3, there are eight Silken Puffs in two rows.  Six are then "rinsed" by Eastern Ewers.
      // After suds effects are applied to all eight Silken Puffs, Silkie uses 'Eastern Ewers' (776D),
      // followed by three (existing) Eastern Ewer combatants using 'Brim Over' (776E).
      // ~1.6 seconds later, 3 new 'Eastern Ewer' combatants are added, who begin using 'Rinse' (776F).
      // They repeat using the Rinse ability about ~0.85 seconds as they move N->S through the arena.
      // On three of those recasts, they target the ability on Silken Puffs in their column (same ability ID, 776F):
      // 1st targets the N-most Puff; 2nd targets both Puffs in the column (separate 21 lines for each Puff); and 3rd targets just the S Puff.
      // As each Puff is targeted by a Rinse ability, it loses its Suds effect.
      // This trigger fires off of the first targeted use of 'Rinse'.
      id: 'ASS Fresh Puff 3',
      type: 'Ability',
      netRegex: { id: '776F', source: 'Eastern Ewer', target: 'Silken Puff', capture: false },
      delaySeconds: 1.1, // wait for the Ewers to 'rinse' the six puffs, leaving 2 with status effects
      durationSeconds: 6, // leave alert up while Ewers finish rinsing until Puffs detonate
      suppressSeconds: 2,
      alertText: (data, _matches, output) => {
        if (Object.keys(data.silkenPuffs).length !== 2)
          return output.default!();

        const puffEffects: string[] = [];
        for (const puff of Object.values(data.silkenPuffs)) {
          if (puff.effect !== undefined)
            puffEffects.push(puff.effect);
        }

        const [puff0, puff1] = puffEffects.sort(); // sort to simplify switch statement later
        if (puff0 === undefined || puff1 === undefined)
          return output.default!();

        // See Silken Puff Suds Gain trigger for list of Silken Puff effectIds
        switch (puff0) {
          case 'CE9':
            if (puff1 === 'CEB')
              return output.windAndLightning!();
            return output.default!(); // should not ever have double-donut, or donut-ice combo
          case 'CEA':
            if (puff1 === 'CEA') {
              return output.doubleIce!();
            } else if (puff1 === 'CEB') {
              return output.iceAndLightning!();
            }
            return output.default!();
          case 'CEB':
            if (puff1 === 'CEB')
              return output.doubleLightning!();
            return output.default!();
          default:
            return output.default!();
        }
      },
      outputStrings: {
        windAndLightning: {
          en: 'Under green puff',
          de: 'Unter grünem Puschel',
          fr: 'Sous le pompon vert',
          ja: '緑の下へ',
          ko: '초록 구슬 밑으로',
        },
        doubleIce: {
          en: 'Intercards, away from puffs',
          de: 'Interkardinal, weg von den Puscheln',
          fr: 'Intercadinal, loin des pompons',
          ja: '斜め、たまから離れる',
          ko: '대각선으로, 구슬에서 떨어지기',
        },
        iceAndLightning: {
          en: 'Sides of yellow puff',
          de: 'Seitlich der gelben Puscheln',
          fr: 'Sur le côté des pompons verts',
          ja: '黄色の横へ',
          ko: '노란 구슬 옆으로',
        },
        doubleLightning: {
          en: 'Between puffs',
          de: 'Zwischen Puscheln',
          fr: 'Entre les pompons',
          ja: 'たまとたまの間',
          ko: '구슬 사이로',
        },
        default: {
          en: 'Avoid puff AOEs',
          de: 'Puschel AoEs vermeiden',
          fr: 'Évitez les AoE des pompons',
          ja: 'たまのゆか回避',
          ko: '구슬 장판 피하기',
        },
      },
    },
    // ---------------- second trash ----------------
    {
      id: 'ASS Infernal Pain',
      type: 'StartsUsing',
      netRegex: { id: '7969', source: 'Sil\'dihn Dullahan', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'aoe + bleed',
          de: 'AoE + Blutung',
          fr: 'AoE + Saignement',
          ja: '全体攻撃 + 出血',
          ko: '전체 공격 + 도트',
        },
      },
    },
    {
      id: 'ASS Blighted Gloom',
      type: 'StartsUsing',
      netRegex: { id: '7966', source: 'Sil\'dihn Dullahan', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'ASS King\'s Will',
      type: 'StartsUsing',
      netRegex: { id: '7968', source: 'Sil\'dihn Dullahan', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'big autos',
          de: 'große Auto-Hits',
          fr: 'Grosses attaques auto',
          ja: '自己強化',
          ko: '평타 강화',
        },
      },
    },
    {
      id: 'ASS Hells\' Nebula',
      type: 'StartsUsing',
      netRegex: { id: '796C', source: 'Sil\'dihn Armor', capture: false },
      condition: (data) => data.role === 'healer',
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'HP to 1',
          de: 'HP auf 1',
          fr: 'HP à 1',
          ja: '体力１!',
          ko: 'HP 1',
        },
      },
    },
    {
      id: 'ASS Infernal Weight',
      type: 'StartsUsing',
      netRegex: { id: '796B', source: 'Sil\'dihn Armor', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'aoe + In',
          de: 'AoE + Rein',
          fr: 'AoE + Intérieur',
          ja: 'ヘビィ, 足元へ',
          ko: '전체공격 + 안으로',
        },
      },
    },
    {
      id: 'ASS Dominion Slash',
      type: 'StartsUsing',
      netRegex: { id: '796A', source: 'Sil\'dihn Armor', capture: false },
      response: Responses.getBehind(),
    },
    // ---------------- Gladiator of Sil'dih ----------------
    {
      id: 'ASS Flash of Steel',
      type: 'StartsUsing',
      netRegex: { id: '7671', source: 'Gladiator of Sil\'dih', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'ASS Rush of Might 1',
      // Boss casts 765C (12.2s) and 765B (10.2s), twice
      // Gladiator of Mirage casts 7659, 7658, 765A, these target the environment
      // North
      //                East               West
      //   Line 1: (-34.14, -270.14) (-35.86, -270.14)
      //   Line 2: (-39.45, -275.45) (-30.55, -275.45)
      //   Line 3: (-44.75, -280.75) (-25.25, -280.75)
      // South
      //                East               West
      //   Line 1: (-34.14, -271.86) (-35.86, -271.86)
      //   Line 2: (-39.45, -266.55) (-30.55, -266.55)
      //   Line 3: (-44.75, -261.25) (-25.25, -261.25)
      // Center is at (-35, -271)
      type: 'StartsUsing',
      netRegex: { id: '765C', source: 'Gladiator of Sil\'dih' },
      delaySeconds: 0.4,
      promise: async (data, matches) => {
        if (data.mightCasts.length === 2)
          data.mightCasts = [];

        // select the Gladiator with same source id
        let gladiatorData = null;
        gladiatorData = await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.sourceId, 16)],
        });

        // if we could not retrieve combatant data, the
        // trigger will not work, so just resume promise here
        if (gladiatorData === null) {
          console.error(`Gladiator of Sil'dih: null data`);
          return;
        }
        if (gladiatorData.combatants.length !== 1) {
          console.error(`Gladiator of Sil'dih: expected 1, got ${gladiatorData.combatants.length}`);
          return;
        }

        const gladiator = gladiatorData.combatants[0];
        if (!gladiator)
          return;
        data.mightCasts.push(gladiator);
      },
      infoText: (data, _matches, output) => {
        if (data.mightCasts.length !== 2)
          return;
        const mirage1 = data.mightCasts[0];
        const mirage2 = data.mightCasts[1];

        if (mirage1 === undefined || mirage2 === undefined)
          throw new UnreachableCode();

        const x1 = mirage1.PosX;
        const y1 = mirage1.PosY;
        const x2 = mirage2.PosX;
        const y2 = mirage2.PosY;

        const getLine = (x: number) => {
          // Round values to be easier to read:
          //   1    2    3
          // [-35, -40, -45]
          // [-35, -30, -25]
          const roundX = Math.round(x / 5) * 5;
          if (roundX === -45 || roundX === -25)
            return 3;
          else if (roundX === -40 || roundX === -30)
            return 2;
          else if (roundX === -35)
            return 1;
          return undefined;
        };
        const line1 = getLine(x1);
        const line2 = getLine(x2);
        if (line1 === undefined || line2 === undefined) {
          console.error(`Rush of Might 1: Failed to determine line from ${x1} or ${x2}`);
          return;
        }

        const line = line1 > line2 ? line1 : line2;

        // Get card and greatest relative x value
        let card;
        const roundY = Math.round(y1 / 3) * 3;
        // Round values to be easier to read:
        //          1     2     3
        // North [-270, -276, -282]
        // South [-273, -267, -261]
        if (roundY === -270 || roundY === -276 || roundY === -282) {
          // Get the x value of farthest north mirage
          const x = y1 < y2 ? x1 : x2;
          card = x < -35 ? 'west' : 'east';
          data.mightDir = 'north';
        } else if (roundY === -273 || roundY === -267 || roundY === -261) {
          // Get the x value of farthest south mirage
          const x = y1 > y2 ? x1 : x2;
          card = x < -35 ? 'west' : 'east';
          data.mightDir = 'south';
        } else {
          console.error(`Rush of Might 1: Failed to determine card from ${y1}`);
          return;
        }

        // When one is 2 and one is 3 we need to be inside (towards middle)
        if (line1 === 2 && line2 === 3 || line1 === 3 && line2 === 2)
          return output.insideLine!({ card: output[card]!() });
        return output.outsideLine!({ card: output[card]!(), line: line });
      },
      outputStrings: {
        outsideLine: {
          en: 'Outside ${card}, above line ${line}',
          de: 'Außerhalb vom ${card}, über der Linie im ${line}',
          fr: '${card} extérieure, au-dessus de la ligne ${line}',
          ja: '${card}の外、 ${line}ラインの上',
          ko: '${card} 바깥, ${line}번 줄 위로',
        },
        insideLine: {
          en: 'Inside ${card}, above line 3',
          de: 'Innerhalb vom ${card}, über der 3. Linie',
          fr: '${card} intérieure, au-dessus de la ligne 3',
          ja: '${card}の中, 3ラインの上',
          ko: '${card} 안, 3번 줄 위로',
        },
        east: Outputs.east,
        west: Outputs.west,
      },
    },
    {
      id: 'ASS Rush of Might 2',
      type: 'Ability',
      netRegex: { id: '765B', source: 'Gladiator of Sil\'dih', capture: false },
      suppressSeconds: 1,
      infoText: (data, _matches, output) => {
        if (data.mightDir === undefined)
          return output.move!();
        return output.text!({ dir: output[data.mightDir]!() });
      },
      outputStrings: {
        text: {
          en: 'Move ${dir}',
          de: 'Geh nach ${dir}',
          fr: 'Allez ${dir}',
          ja: '${dir}へ',
          ko: '${dir}으로',
        },
        north: Outputs.north,
        south: Outputs.south,
        move: Outputs.moveAway,
      },
    },
    {
      id: 'ASS Sculptor\'s Passion',
      // This is a wild charge, player in front takes most damage
      type: 'Ability',
      netRegex: { id: '6854', source: 'Gladiator of Sil\'dih' },
      alertText: (data, matches, output) => {
        if (matches.target === data.me)
          return output.chargeOnYou!();
        return output.chargeOn!({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        chargeOn: {
          en: 'Charge on ${player}',
          de: 'Ansturm auf ${player}',
          fr: 'Charge sur ${player}',
          ja: '${player}に突進',
          cn: '蓝球点${player}',
          ko: '"${player}" 돌진 대상',
        },
        chargeOnYou: {
          en: 'Charge on YOU',
          de: 'Ansturm auf DIR',
          fr: 'Charge sur VOUS',
          ja: '自分に突進',
          cn: '蓝球点名',
          ko: '돌진 대상자',
        },
      },
    },
    {
      id: 'ASS Mighty Smite',
      type: 'StartsUsing',
      netRegex: { id: '7672', source: 'Gladiator of Sil\'dih' },
      response: Responses.tankBuster(),
    },
    {
      id: 'ASS Lingering Echoes',
      // CDC Lingering Echoes (Spread + Move)
      type: 'GainsEffect',
      netRegex: { effectId: 'CDC' },
      condition: Conditions.targetIsYou(),
      preRun: (data) => data.hasLingering = true,
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 2,
      response: Responses.moveAway(),
    },
    {
      id: 'ASS Thunderous Echo Collect',
      // CDD Thunderous Echo (Stack)
      type: 'GainsEffect',
      netRegex: { effectId: 'CDD' },
      preRun: (data, matches) => data.thunderousEchoPlayer = matches.target,
    },
    {
      id: 'ASS Curse of the Fallen',
      // CDA Echoes of the Fallen (Spread)
      // Two players will not have a second debuff, so check CDA
      // 14s = first
      // 17s = second
      type: 'GainsEffect',
      netRegex: { effectId: 'CDA' },
      condition: Conditions.targetIsYou(),
      delaySeconds: 0.1,
      durationSeconds: 10,
      infoText: (data, matches, output) => {
        if (data.hasLingering)
          return output.spreadThenSpread!();

        const duration = parseFloat(matches.duration);

        // Check if spread first
        if (duration < 16) {
          if (data.me === data.thunderousEchoPlayer)
            return output.spreadThenStackOnYou!();
          if (data.thunderousEchoPlayer === undefined)
            return output.spreadThenStack!();
          return output.spreadThenStackOn!({ player: data.ShortName(data.thunderousEchoPlayer) });
        }

        if (data.me === data.thunderousEchoPlayer)
          return output.stackOnYouThenSpread!();
        if (data.thunderousEchoPlayer === undefined)
          return output.stackThenSpread!();
        return output.stackOnThenSpread!({ player: data.ShortName(data.thunderousEchoPlayer) });
      },
      outputStrings: {
        stackThenSpread: Outputs.stackThenSpread,
        stackOnThenSpread: {
          en: 'Stack on ${player} => Spread',
          de: 'Auf ${player} sammeln => Verteilen',
          fr: 'Package sur ${player} -> Dispersion',
          ja: '${player}に頭割り => 散会',
          ko: '${player} 쉐어 => 산개',
        },
        stackOnYouThenSpread: {
          en: 'Stack on YOU => Spread',
          de: 'Auf DIR sammeln => Verteilen',
          fr: 'Package sur VOUS -> Dispersion',
          ja: '自分に頭割り => 散会',
          ko: '나에게 쉐어 => 산개',
        },
        spreadThenStack: Outputs.spreadThenStack,
        spreadThenStackOn: {
          en: 'Spread => Stack on ${player}',
          de: 'Verteilen => Auf ${player} sammeln',
          fr: 'Dispersion -> Package sur ${player}',
          ja: '散会 => ${player}に頭割り',
          ko: '산개 => ${player} 쉐어',
        },
        spreadThenStackOnYou: {
          en: 'Spread => Stack on YOU',
          de: 'Verteilen => Auf DIR sammeln',
          fr: 'Dispersion -> package sur VOUS',
          ja: '散会 => 自分に頭割り',
          ko: '산개 => 나에게 쉐어',
        },
        spreadThenSpread: {
          en: 'Spread => Spread',
          de: 'Verteilen => Sammeln',
          ja: '自分に連呪、ひとりぼっちでずっと',
          ko: '산개 => 산개',
        },
      },
    },
    {
      id: 'ASS Ring of Might',
      // There are 6 spells:
      //   Ring 1: 765D (9.7s) / 7660 (11.7s)
      //   Ring 2: 765E (9.7s) / 7661 (11.7s)
      //   Ring 3: 765F (9.7s) / 7662 (11.7s)
      // Only tracking the 11.7s spell
      type: 'StartsUsing',
      netRegex: { id: ['7660', '7661', '7662'], source: 'Gladiator of Sil\'dih' },
      infoText: (_data, matches, output) => {
        if (matches.id === '7660')
          return output.outsideInner!();
        if (matches.id === '7661')
          return output.outsideMiddle!();
        return output.outsideOuter!();
      },
      outputStrings: {
        outsideInner: {
          en: 'Outside Inner Ring',
          de: 'Außerhalb des inneren Ringes',
          fr: 'À l\'extérieur de l\'anneau intérieur',
          ja: 'リングチャージ１',
          ko: '안쪽 고리 바깥',
        },
        outsideMiddle: {
          en: 'Outside Middle Ring',
          de: 'Außerhalb des mittleren Ringes',
          fr: 'À l\'extérieur de l\'anneau central',
          ja: 'リングチャージ２',
          ko: '중간 고리 바깥',
        },
        outsideOuter: {
          en: 'Outside Outer Ring',
          de: 'Außerhalb des äußeren Ringes',
          fr: 'À l\'extérieur de l\'anneau extérieur',
          ja: 'リングチャージ３',
          ko: '바깥쪽 고리 바깥',
        },
      },
    },
    {
      id: 'ASS Echoes of the Fallen Reminder',
      // CDA Echoes of the Fallen (Spread)
      type: 'GainsEffect',
      netRegex: { effectId: 'CDA' },
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 4,
      response: Responses.spread(),
    },
    {
      id: 'ASS Thunderous Echo Reminder',
      // CDD Thunderous Echo (Stack)
      type: 'GainsEffect',
      netRegex: { effectId: 'CDD' },
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 4,
      infoText: (data, matches, output) => {
        if (data.hasLingering)
          return output.spread!();
        if (matches.target === data.me)
          return output.stackOnYou!();
        return output.stackOn!({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        spread: Outputs.spread,
        stackOnYou: Outputs.stackOnYou,
        stackOn: Outputs.stackOnPlayer,
      },
    },
    {
      id: 'ASS Nothing beside Remains',
      type: 'StartsUsing',
      netRegex: { id: '768C', source: 'Gladiator of Sil\'dih', capture: false },
      suppressSeconds: 1,
      response: Responses.spread(),
    },
    {
      id: 'ASS Accursed Visage Collect',
      // CDF = Gilded Fate
      // CE0 = Silvered Fate
      type: 'GainsEffect',
      netRegex: { effectId: ['CDF', 'CE0'] },
      condition: Conditions.targetIsYou(),
      run: (data, matches) => {
        const id = matches.effectId;
        if (id === 'CDF')
          ++data.gildedCounter;
        else if (id === 'CE0')
          ++data.silveredCounter;
      },
    },
    {
      id: 'ASS Golden/Silver Flame',
      // 766F = Golden Flame
      // 7670 = Silver Flame
      type: 'StartsUsing',
      netRegex: { id: ['766F', '7670'], source: 'Hateful Visage', capture: false },
      suppressSeconds: 1,
      infoText: (data, _matches, output) => {
        if (data.gildedCounter > 0) {
          if (data.silveredCounter > 0)
            return output.bothFates!();
          return output.gildedFate!();
        }
        if (data.silveredCounter > 0)
          return output.silveredFate!();
        return output.neitherFate!();
      },
      outputStrings: {
        bothFates: {
          en: 'Get hit by silver and gold',
          de: 'Von Silber und Gold treffen lassen',
          fr: 'Faites-vous toucher par l\'argent et l\'or',
          ja: '金銀 一個ずつ',
          ko: '은색 + 금색 맞기',
        },
        gildedFate: {
          en: 'Get hit by two silver',
          de: 'Von 2 Silber treffen lassen',
          fr: 'Faites-vous toucher par les deux argent',
          ja: '銀 二つ',
          ko: '은색 2개 맞기',
        },
        silveredFate: {
          en: 'Get hit by two gold',
          de: 'Von 2 Gold treffen lassen',
          fr: 'Faites-vous toucher par les deux or',
          ja: '金 二つ',
          ko: '금색 2개 맞기',
        },
        neitherFate: {
          en: 'Avoid silver and gold',
          de: 'Vermeide Silber und Gold',
          fr: 'Évitez l\'argent et l\'or',
          ja: '顔からのビーム全部回避',
          ko: '은색 금색 피하기',
        },
      },
    },
    {
      id: 'ASS Sundered Remains',
      // Using 7666 Curse of the Monument
      type: 'StartsUsing',
      netRegex: { id: '7666', source: 'Gladiator of Sil\'dih', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get Middle, Shiva Circles',
          de: 'In die Mitte, Shiva Kreise',
          fr: 'Allez au milieu, cercles de Shiva',
          ja: '真ん中でAOE輪っか確認',
          cn: '中间集合, 九连环',
          ko: '중앙으로, 시바 얼음 장판',
        },
      },
    },
    {
      id: 'ASS Curse of the Monument',
      type: 'Ability',
      netRegex: { id: '7666', source: 'Gladiator of Sil\'dih', capture: false },
      response: Responses.breakChains(),
    },
    {
      id: 'ASS Scream of the Fallen',
      // CDB = Scream of the Fallen (defamation)
      // BBC = First in Line
      // BBD = Second in Line
      // First/Second in Line are only used once all dungeon so we can just trigger off of them
      type: 'GainsEffect',
      netRegex: { effectId: 'BB[CD]' },
      condition: Conditions.targetIsYou(),
      infoText: (_data, matches, output) => {
        const id = matches.effectId;
        if (id === 'BBD')
          return output.soakThenSpread!();
        return output.spreadThenSoak!();
      },
      outputStrings: {
        soakThenSpread: {
          en: 'Soak first towers => Spread',
          de: 'Türme zuerst nehmen => verteilen',
          fr: 'Prenez les tours -> Dispersion',
          ja: '塔から踏み => 外側',
          ko: '첫번째 기둥 밟기 => 산개',
        },
        spreadThenSoak: {
          en: 'Spread => Soak second towers',
          de: 'Verteilen => zweite Türme nehmen',
          fr: 'Dispersion -> Prenez les tours',
          ja: '外側 => 塔踏み',
          ko: '산개 => 두번째 기둥 밟기',
        },
      },
    },
    // ---------------- Shadowcaster Zeless Gah ----------------
    {
      id: 'ASS Show of Strength',
      type: 'StartsUsing',
      netRegex: { id: '74AF', source: 'Shadowcaster Zeless Gah', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'ASS Firesteel Fracture',
      type: 'StartsUsing',
      netRegex: { id: '74AD', source: 'Shadowcaster Zeless Gah' },
      response: Responses.tankCleave(),
    },
    {
      id: 'ASS Infern Brand Counter',
      type: 'StartsUsing',
      netRegex: { id: '7491', source: 'Shadowcaster Zeless Gah', capture: false },
      run: (data) => {
        data.brandCounter++;
        data.arcaneFontCounter = 0;
      },
    },
    {
      id: 'ASS Arcane Font Tracker',
      type: 'AddedCombatant',
      netRegex: { name: 'Arcane Font', capture: false },
      // Only run this trigger for second Infern Band, first set of portals
      condition: (data) => data.myFlame === undefined,
      run: (data) => data.arcaneFontCounter++,
    },
    {
      id: 'ASS Infern Brand Collect',
      // Count field on 95D on Infern Brand indicates Brand's number:
      //   1C2 - 1C5, Orange 1 - 4
      //   1C6 - 1C9, Blue 1 - 4
      type: 'GainsEffect',
      netRegex: { effectId: '95D', target: 'Infern Brand' },
      run: (data, matches) => data.brandEffects[parseInt(matches.targetId, 16)] = matches.count,
    },
    {
      id: 'ASS Infern Brand 2 Starting Corner',
      // CC4 First Brand
      // CC5 Second Brand
      // CC6 Third Brand
      // CC7 Fourth Brand
      type: 'GainsEffect',
      netRegex: { effectId: ['CC4', 'CC5', 'CC6', 'CC7'] },
      condition: (data, matches) => data.me === matches.target && data.brandCounter === 2,
      delaySeconds: 0.2, // Delay to collect all Infern Brand Effects
      durationSeconds: (_data, matches) => parseFloat(matches.duration) - 0.1,
      infoText: (data, matches, output) => {
        const brandMap: { [effectId: string]: number } = {
          'CC4': 1,
          'CC5': 2,
          'CC6': 3,
          'CC7': 4,
        };
        const myNum = brandMap[matches.effectId];
        if (myNum === undefined)
          throw new UnreachableCode();

        // Store for later trigger
        data.myFlame = myNum;

        if (Object.keys(data.brandEffects).length !== 8) {
          // Missing Infern Brands, output number
          if (data.arcaneFontCounter === 3)
            return output.blueBrandNum!({ num: myNum });
          if (data.arcaneFontCounter === 2)
            return output.orangeBrandNum!({ num: myNum });
          return output.brandNum!({ num: myNum });
        }

        // Brands are located along East and South wall and in order by id
        // Blue N/S:
        //   304.00, -108.00, Used for NW/NE, 0 north
        //   304.00, -106.00, Used for NW/NE, 1 north
        //   304.00, -104.00, Used for SW/SE, 2 south
        //   304.00, -102.00, Used for SW/SE, 3 south
        // Orange E/W:
        //   286.00, -85.00, Used for SW/NW, 4 west
        //   288.00, -85.00, Used for SW/NW, 5 west
        //   290.00, -85.00, Used for SE/NE, 6 east
        //   292.00, -85.00, Used for SE/NE, 7 east
        // Set brandEffects to descending order to match
        const brandEffects = Object.entries(data.brandEffects).sort((a, b) => a[0] > b[0] ? -1 : 1);

        // Get just the effectIds
        const effectIds = brandEffects.map((value) => {
          return value.slice(1, 2)[0];
        });

        // Split the results
        const blueBrands = effectIds.slice(0, 4);
        const orangeBrands = effectIds.slice(4, 8);

        const myNumToBlue: { [num: number]: string } = {
          4: '1C9',
          3: '1C8',
          2: '1C7',
          1: '1C6',
        };
        const myNumToOrange: { [num: number]: string } = {
          4: '1C5',
          3: '1C4',
          2: '1C3',
          1: '1C2',
        };

        // Find where our numbers are in each set of brands
        const x = orangeBrands.indexOf(myNumToOrange[myNum]);
        const y = blueBrands.indexOf(myNumToBlue[myNum]) + 4;
        const indexToCardinal: { [num: number]: string } = {
          0: 'south',
          1: 'south',
          2: 'north',
          3: 'north',
          4: 'east',
          5: 'east',
          6: 'west',
          7: 'west',
        };

        const cardX = indexToCardinal[x];
        const cardY = indexToCardinal[y];

        // Not able to be undefined as values determined from array that only has 8 indices
        if (cardX === undefined || cardY === undefined)
          throw new UnreachableCode();

        // Check color of brand that will be cut
        if (data.arcaneFontCounter === 3)
          return output.blueBrandNumCorner!({ num: myNum, corner: output[cardX + cardY]!() });
        if (data.arcaneFontCounter === 2)
          return output.orangeBrandNumCorner!({ num: myNum, corner: output[cardX + cardY]!() });
        return output.brandNumCorner!({ num: myNum, corner: output[cardX + cardY]!() });
      },
      run: (data) => data.brandEffects = {},
      outputStrings: {
        blueBrandNumCorner: {
          en: 'Blue Brand ${num}: ${corner} corner',
          de: 'Blaues Kryptogramm ${num}: ${corner} Ecke',
          fr: 'Étendard bleu ${num}: coin ${corner}',
          ja: '青線${num}: ${corner}の隅',
          ko: '파란색 선 ${num}: ${corner} 구석',
        },
        orangeBrandNumCorner: {
          en: 'Orange Brand ${num}: ${corner} corner',
          de: 'Oranges Kryptogramm ${num}: ${corner} Ecke',
          fr: 'Étendard orange ${num}: coin ${corner}',
          ja: '赤線${num}: ${corner}の隅',
          ko: '주황색 선 ${num}: ${corner} 구석',
        },
        brandNumCorner: {
          en: 'Brand ${num}: ${corner} corner',
          de: 'Kryptogramm ${num}: ${corner} Ecke',
          fr: 'Étendard ${num}: coin ${corner}',
          ja: '線${num}: ${corner}の隅',
          ko: '선 ${num}: ${corner} 구석',
        },
        blueBrandNum: {
          en: 'Blue Brand ${num}',
          de: 'Blaues Kryptogramm ${num}',
          fr: 'Étendard bleu ${num}',
          ja: '青線${num}',
          ko: '파란색 선 ${num}',
        },
        orangeBrandNum: {
          en: 'Orange Brand ${num}',
          de: 'Oranges Kryptogramm ${num}',
          fr: 'Étendard orange ${num}',
          ja: '赤線${num}',
          ko: '주황색 선 ${num}',
        },
        brandNum: {
          en: 'Brand ${num}',
          de: 'Kryptogramm ${num}',
          fr: 'Étendard ${num}',
          ja: '線${num}',
          ko: '선 ${num}',
        },
        northwest: Outputs.northwest,
        northeast: Outputs.northeast,
        southeast: Outputs.southeast,
        southwest: Outputs.southwest,
      },
    },
    {
      id: 'ASS Infern Brand 2 First Flame',
      // CC8 First Flame
      // CC9 Second Flame
      // CCA Third Flame
      // CCB Fourth Flame
      type: 'GainsEffect',
      netRegex: { effectId: 'CC8' },
      condition: (data, matches) => data.me === matches.target && data.brandCounter === 2,
      alertText: (data, _matches, output) => {
        // Blue lines cut when three (West)
        if (data.arcaneFontCounter === 3) {
          // Set to two for 5th cut's color
          data.arcaneFontCounter = 2;
          return output.cutBlueOne!();
        }

        // Orange lines cut when two (North)
        if (data.arcaneFontCounter === 2) {
          // Set to three for 5th cut's color
          data.arcaneFontCounter = 3;
          return output.cutOrangeOne!();
        }
        return output.firstCut!();
      },
      outputStrings: {
        cutBlueOne: {
          en: 'Cut Blue 1',
          de: 'Blau 1 durchtrennen',
          fr: 'Coupez Bleu 1',
          ja: '青線1 切る',
          ko: '파란색 1 끊기',
        },
        cutOrangeOne: {
          en: 'Cut Orange 1',
          de: 'Orange 1 durchtrennen',
          fr: 'Coupez Orange 1',
          ja: '赤線1 切る',
          ko: '주황색 1 끊기',
        },
        firstCut: {
          en: 'First Cut',
          de: 'Als Erster durchtrennen',
          fr: 'Coupe en 1er',
          ja: '線1 切る',
          ko: '첫번째 선 끊기',
        },
      },
    },
    {
      id: 'ASS Infern Brand 2 Remaining Flames',
      // Player receives Magic Vulnerability Up from Cryptic Flame for 7.96s after cutting
      // Trigger will delay for this Magic Vulnerability Up for safety
      // No exception for time remaining on debuff to sacrafice to cut the line
      type: 'LosesEffect',
      netRegex: { effectId: '95D', target: 'Infern Brand', count: '1C[2-9]' },
      condition: (data, matches) => {
        if (data.myFlame !== undefined && data.brandCounter === 2) {
          const countToNum: { [count: string]: number } = {
            '1C9': 4,
            '1C8': 3,
            '1C7': 2,
            '1C6': 1,
            '1C5': 4,
            '1C4': 3,
            '1C3': 2,
            '1C2': 1,
          };

          // Check which flame order this is
          const flameCut = countToNum[matches.count];
          if (flameCut === undefined)
            return false;

          // Wraparound and add 1 as we need next flame to cut
          // Check if not our turn to cut
          if (flameCut % 4 + 1 !== data.myFlame)
            return false;

          return true;
        }
        return false;
      },
      delaySeconds: (data, matches) => {
        if (data.myLastCut === undefined)
          return 0;

        // Check if we still need to delay for Magic Vulnerability Up to expire
        // Magic Vulnerability Up lasts 7.96 from last cut
        const delay = 7.96 - (Date.parse(matches.timestamp) - data.myLastCut) / 1000;
        if (delay > 0)
          return delay;
        return 0;
      },
      alertText: (data, matches, output) => {
        if (data.arcaneFontCounter === 3 && matches.count.match(/1C[6-8]/)) {
          // Expected Blue and count is Blue
          data.arcaneFontCounter = 2;
          return output.cutBlueNum!({ num: data.myFlame });
        }
        if (data.arcaneFontCounter === 2 && matches.count.match(/1C[2-4]/)) {
          // Expected Orange and count is Orange
          data.arcaneFontCounter = 3;
          return output.cutOrangeNum!({ num: data.myFlame });
        }

        // Exception for First Flame on second set
        if (data.myFlame === 1) {
          if (data.arcaneFontCounter === 3 && matches.count === '1C5')
            return output.cutBlueNum!({ num: data.myFlame });
          if (data.arcaneFontCounter === 2 && matches.count === '1C9')
            return output.cutOrangeNum!({ num: data.myFlame });
        }
        // Unexpected result, mechanic is likely failed at this point
      },
      run: (data) => data.brandEffects = {},
      outputStrings: {
        cutOrangeNum: {
          en: 'Cut Orange ${num}',
          de: 'Orange ${num} durchtrennen',
          fr: 'Coupez Orange ${num}',
          ja: '赤線${num} 切る',
          ko: '주황색 ${num} 끊기',
        },
        cutBlueNum: {
          en: 'Cut Blue ${num}',
          de: 'Blau ${num} durchtrennen',
          fr: 'Coupez Bleu ${num}',
          ja: '青線${num} 切る',
          ko: '파란색 ${num} 끊기',
        },
      },
    },
    {
      id: 'ASS Infern Brand Cryptic Flame Collect',
      // Collect timestamp for when last cut flame
      type: 'Ability',
      netRegex: { id: '74B7', source: 'Infern Brand' },
      condition: Conditions.targetIsYou(),
      run: (data, matches) => data.myLastCut = Date.parse(matches.timestamp),
    },
    {
      id: 'ASS Banishment',
      // Players receive invisible effect that indicates rotation and direction
      // of their teleport attached teleport pad
      //
      // At the same time, two teleports on North and South are also marked:
      // one rotates outside the arena, the other rotates towards the inner rows
      // Players have 12s to teleport using the safe teleports prior to Call of
      // the Portal (CCC) expiration
      //
      // The first teleports occur at ~11.4s after these debuff go out
      // After first teleport, lasers block rows but can be teleported over
      // Hitting a laser results in stun and likely death
      //
      // Seconds after first teleport, two wards will go off that target the
      // two nearest players. Players need to have teleported close enough
      // to the ward to bait the ward away from other players
      //
      // Following the first set of baits, the player's teleport will go off
      // which should have been positioned to teleport across the laser to bait
      // the final ward away from other players
      //
      // 1CD Blue (Counterclockwise) Teleporting East
      // 1CE Orange (Clockwise) Teleporting West
      // 1D2 Orange (Clockwise) Teleporting East
      // 1D3 Blue (Counterclockwise) Teleporting West
      //
      // There are multiple strategies, so this only describes what you have,
      // from there you can create a personal call of where to go
      type: 'GainsEffect',
      netRegex: { effectId: 'B9A' },
      condition: Conditions.targetIsYou(),
      infoText: (_data, matches, output) => {
        switch (matches.count) {
          case '1CD':
            return output.blueEast!();
          case '1CE':
            return output.orangeWest!();
          case '1D2':
            return output.orangeEast!();
          case '1D3':
            return output.blueWest!();
        }
      },
      outputStrings: {
        blueEast: {
          en: 'Blue Teleporting East',
          de: 'Blau Teleport nach Osten',
          fr: 'Téléportation du bleu à l\'Est',
          ja: '3列',
          ko: '파란색 동쪽 텔레포트',
        },
        blueWest: {
          en: 'Blue Teleporting West',
          de: 'Blau Teleport nach Westen',
          fr: 'Téléportation du bleu à l\'Ouest',
          ja: '4列',
          ko: '파란색 서쪽 텔레포트',
        },
        orangeEast: {
          en: 'Orange Teleporting East',
          de: 'Orange Teleport nach Osten',
          fr: 'Téléportation de l\'orange à l\'Est',
          ja: '2列',
          ko: '주황색 동쪽 텔레포트',
        },
        orangeWest: {
          en: 'Orange Teleporting West',
          de: 'Orange Teleport nach Westen',
          fr: 'Téléportation de l\'orange à l\'Ouest',
          ja: '1列',
          ko: '주황색 서쪽 텔레포트',
        },
      },
    },
    {
      id: 'ASS Banishment First Ward',
      // This debuff expires 4.7s before the first bait, but there is a slight
      // animation lock from the teleport that occurs
      // Repositioning may be required to bait the active ward's Infern Wave
      // Using Call of the Portal (CCC) expiration for trigger
      type: 'LosesEffect',
      netRegex: { effectId: 'CCC' },
      condition: Conditions.targetIsYou(),
      delaySeconds: 0.75, // Delay for animation lock from teleport to complete
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Bait First Ward',
          de: 'Köder erste Wehr',
          fr: 'Attirez la 1ère barrière',
          ja: '1番目の扇誘導',
          ko: '첫번째 지팡이 유도하기',
        },
      },
    },
    {
      id: 'ASS Banishment Bait Second Ward',
      // After the second teleport and stun expiring, there is 2s before the
      // the last ward casts Infern Wave that must be baited
      // Rite of Passage (CCD) debuff is tied to the player's teleport going
      // off
      type: 'LosesEffect',
      netRegex: { effectId: 'CCD' },
      condition: Conditions.targetIsYou(),
      delaySeconds: 2, // Delay for stun to complete
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Bait Second Ward',
          de: 'Köder zweite Wehr',
          fr: 'Attirez la 2ème barrière',
          ja: '2番目の扇誘導',
          ko: '두번째 지팡이 유도하기',
        },
      },
    },
    {
      id: 'ASS Infern Brand 5 Starting Position',
      // CC4 First Brand
      // CC5 Second Brand
      // CC6 Third Brand
      // CC7 Fourth Brand
      // Although we can see where the 4 wards spawn, Does not seem to be a way
      // to determine which one is animated which is required to tell which color
      // to cut
      type: 'GainsEffect',
      netRegex: { effectId: ['CC4', 'CC5', 'CC6', 'CC7'] },
      condition: (data, matches) => data.me === matches.target && data.brandCounter === 5,
      delaySeconds: 0.1,
      infoText: (data, matches, output) => {
        const brandMap: { [effectId: string]: number } = {
          'CC4': 1,
          'CC5': 2,
          'CC6': 3,
          'CC7': 4,
        };
        const myNum = brandMap[matches.effectId];
        if (myNum === undefined)
          throw new UnreachableCode();

        // Store for later trigger
        data.myFlame = myNum;

        // In Infern Brand 5, there are 4 wards in a + and blocked by 2 lines each
        // This creates an opening in middle where First Brand + Second Brand
        // while Third Brand and Fourth Brand need to bait the first ward
        // Blue N/S:
        //   (304.00, -110.00)
        //   (304.00, -108.00)
        //
        //   (304.00, -102.00)
        //   (304.00, -100.00)
        // Orange E/W:
        //   (284.00, -85.00)
        //   (286.00, -85.00)
        //
        //   (292.00, -85.00)
        //   (294.00, -85.00)

        // Generic output unless we find a method to determine which way to cut
        if (myNum === 1 || myNum === 2)
          return output.middle!({ num: myNum });
        return output.outThenBait!({ num: myNum });
      },
      run: (data) => data.brandEffects = {},
      outputStrings: {
        middle: {
          en: 'Brand ${num}: Get Middle',
          de: 'Kryptogramm ${num}: Geh in die Mitte',
          fr: 'Étendard ${num} : Au centre',
          ja: '線${num}: 真ん中へ',
          ko: '선 ${num}: 중앙으로',
        },
        outThenBait: {
          en: 'Brand ${num}: Out, Bait Ward',
          de: 'Kryptogramm ${num}: Wehr ködern',
          fr: 'Étendard ${num} : Extérieur, Attirez la barrière',
          ja: '線${num}: 外側へ/扇誘導',
          ko: '선 ${num}: 밖으로, 지팡이 유도',
        },
      },
    },
    {
      id: 'ASS Infern Brand 5 First Flame',
      // CC8 First Flame
      // CC9 Second Flame
      // CCA Third Flame
      // CCB Fourth Flame
      // Until we find a way to determine color, call cut order only
      type: 'GainsEffect',
      netRegex: { effectId: 'CC8' },
      condition: (data, matches) => data.me === matches.target && data.brandCounter === 5,
      alertText: (_data, _matches, output) => output.firstCut!(),
      outputStrings: {
        firstCut: {
          en: 'First Cut',
          de: 'Als Erster durchtrennen',
          fr: '1ère coupe',
          ja: '1番目の線切る',
          ko: '첫번째 선 끊기',
        },
      },
    },
    {
      id: 'ASS Infern Brand 5 Infern Wave Counter',
      type: 'Ability',
      netRegex: { id: '74BB', source: 'Infern Brand', capture: false },
      condition: (data) => data.brandCounter === 5,
      preRun: (data) => data.waveCounter++,
      suppressSeconds: 1,
    },
    {
      id: 'ASS Infern Brand 5 Cuts after Baits',
      // Utilizing 1.96s Magic Vulnerability Up (B7D) from Infern Wave to tell
      // when to start cutting after baiting the Infern Ward
      // Vulnerability expires after Pure Fire (749F) puddles, so no need to
      // add additional delay for the puddle
      type: 'GainsEffect',
      netRegex: { effectId: 'B7D' },
      condition: (data, matches) => {
        const duration = parseFloat(matches.duration);
        return data.me === matches.target && data.brandCounter === 5 && duration <= 2;
      },
      delaySeconds: (_data, matches) => parseFloat(matches.duration),
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          cutOrangeNum: {
            en: 'Cut Orange ${num}',
            de: 'Orange ${num} durchtrennen',
            fr: 'Coupez Orange ${num}',
            ja: '赤線${num} 切る',
            ko: '주황색 ${num} 끊기',
          },
          cutBlueNum: {
            en: 'Cut Blue ${num}',
            de: 'Blau ${num} durchtrennen',
            fr: 'Coupez Bleu ${num}',
            ja: '青線${num} 切る',
            ko: '파란색 ${num} 끊기',
          },
          moveOrange: {
            en: 'Move for Orange ${num}',
            de: 'Bewegen für Orange ${num}',
            fr: 'Bougez pour l\'orange ${num}',
            ja: 'まもなく赤線${num}',
            ko: '주황색 ${num} 끊을 준비',
          },
          moveBlue: {
            en: 'Move for Blue ${num}',
            de: 'Bewegen für Blau ${num}',
            fr: 'Bougez pour le bleu ${num}',
            ja: 'まもなく青線${num}',
            ko: '파란색 ${num} 끊을 준비',
          },
        };

        // Check for race condition with Second Flame after first bait
        // or that it is the third bait that has no race
        if (data.waveCounter === 1 && data.flamesCutCounter === 1 || data.waveCounter === 3) {
          // Third and Fourth Flames need to move to cut across immediately after baiting
          // Three can cut their flame if they have baited and 2 has cut
          if (data.myFlame === 3) {
            if (data.firstColorCut === 'blue')
              return { alertText: output.cutBlueNum!({ num: data.myFlame }) };
            return { alertText: output.cutOrangeNum!({ num: data.myFlame }) };
          }
          if (data.myFlame === 4) {
            if (data.firstColorCut === 'blue')
              return { infoText: output.moveBlue!({ num: data.myFlame }) };
            return { infoText: output.moveOrange!({ num: data.myFlame }) };
          }
        }

        // First Flame needs to cut after the second bait
        if (data.waveCounter === 2 && data.myFlame === 1) {
          if (data.firstColorCut === 'orange')
            return { alertText: output.cutOrangeNum!({ num: data.myFlame }) };
          return { alertText: output.cutBlueNum!({ num: data.myFlame }) };
        }
      },
    },
    {
      id: 'ASS Infern Brand 5 Remaining Flames',
      type: 'LosesEffect',
      netRegex: { effectId: '95D', target: 'Infern Brand', count: '1C[2-9]' },
      condition: (data) => data.brandCounter === 5,
      preRun: (data, matches) => {
        data.flamesCutCounter++;
        // First and last of a set let us know what's being cut next
        if (data.flamesCutCounter === 1) {
          if (matches.count === '1C2')
            data.firstColorCut = 'orange';
          else if (matches.count === '1C5')
            data.firstColorCut = 'blue';
        } else if (data.flamesCutCounter === 4) {
          data.firstColorCut = data.firstColorCut === 'orange' ? 'blue' : 'orange';
        }
      },
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          baitWardTwo: {
            en: 'Bait Ward 2 => Bait Puddles',
            de: 'Köder Wehr 2 => Köder Flächen',
            fr: 'Attirez barrière 2 -> Attirez les puddles',
            ja: '扇２ => AOE誘導',
            ko: '지팡이 2 유도 => 장판 유도',
          },
          baitWardThree: {
            en: 'Bait Ward 3',
            de: 'Köder Wehr 3',
            fr: 'Attirez barrière 3',
            ja: '扇３',
            ko: '지팡이 3 유도',
          },
          baitPuddles: {
            en: 'Bait Puddles',
            de: 'Köder Flächen',
            fr: 'Attirez les puddles',
            ja: 'AOE誘導',
            ko: '장판 유도',
          },
          cutOrangeNum: {
            en: 'Cut Orange ${num}',
            de: 'Orange ${num} durchtrennen',
            fr: 'Coupez Orange ${num}',
            ja: '赤線${num} 切る',
            ko: '주황색 ${num} 끊기',
          },
          cutBlueNum: {
            en: 'Cut Blue ${num}',
            de: 'Blau ${num} durchtrennen',
            fr: 'Coupez Bleu ${num}',
            ja: '青線${num} 切る',
            ko: '파란색 ${num} 끊기',
          },
          moveOrangeNum: {
            en: 'Move for Orange ${num}',
            de: 'Bewegen für Orange ${num}',
            fr: 'Bougez pour l\'orange ${num}',
            ja: 'まもなく赤線${num}',
            ko: '주황색 ${num} 끊을 준비',
          },
          moveBlueNum: {
            en: 'Move for Blue ${num}',
            de: 'Bewegen für Blau ${num}',
            fr: 'Bougez pour le bleu ${num}',
            ja: 'まもなく青線${num}',
            ko: '파란색 ${num} 끊을 준비',
          },
        };

        // Two can cut immediately after one
        if (data.myFlame === 2 && (data.flamesCutCounter === 1 || data.flamesCutCounter === 6)) {
          if (data.firstColorCut === 'blue')
            return { alertText: output.cutBlueNum!({ num: data.myFlame }) };
          return { alertText: output.cutOrangeNum!({ num: data.myFlame }) };
        }

        // Three can cut if they have baited their wave and two has cut
        if (data.myFlame === 3 && data.flamesCutCounter === 2 && data.waveCounter === 1) {
          if (data.firstColorCut === 'blue')
            return { alertText: output.cutBlueNum!({ num: data.myFlame }) };
          return { alertText: output.cutOrangeNum!({ num: data.myFlame }) };
        }
        // Four can follow three after they have baited and two has cut
        if (data.myFlame === 4 && data.flamesCutCounter === 2 && data.waveCounter === 1) {
          if (data.firstColorCut === 'blue')
            return { infoText: output.moveBlueNum!({ num: data.myFlame }) };
          return { infoText: output.moveOrangeNum!({ num: data.myFlame }) };
        }

        // Four can cut immediately after three
        if (data.myFlame === 4 && (data.flamesCutCounter === 3 || data.flamesCutCounter === 7)) {
          if (data.firstColorCut === 'blue')
            return { alertText: output.cutBlueNum!({ num: data.myFlame }) };
          return { alertText: output.cutOrangeNum!({ num: data.myFlame }) };
        }

        // Fourth Flame should open path for One and Two to bait second ward
        if (data.flamesCutCounter === 4) {
          if (data.myFlame === 1 || data.myFlame === 2)
            return { alertText: output.baitWardTwo!() };
          return { infoText: output.baitPuddles!() };
        }

        // Sixth Flame should open path for Three and Four to bait third ward
        if (data.flamesCutCounter === 6 && (data.myFlame === 3 || data.myFlame === 4))
          return { alertText: output.baitWardThree!() };
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        '(?<!/ )Chilling Duster / Fizzling Duster': 'Chilling/Fizzling Duster',
        'Bracing Duster / Chilling Duster / Fizzling Duster': 'Duster',
        'Bracing Duster / Chilling Duster(?! )': 'Bracing/Chilling Duster',
        'Bracing Duster / Fizzling Duster': 'Bracing/Fizzling Duster',
        'Bracing Suds / Chilling Suds / Fizzling Suds': 'Suds',
        'Bracing Suds / Chilling Suds(?! )': 'Bracing/Chilling Suds',
        'Bracing Suds / Fizzling Suds': 'Bracing/Fizzling Suds',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'Aqueduct Belladonna': 'Aquädukt-Belladonna',
        'Aqueduct Dryad': 'Aquädukt-Dryade',
        'Aqueduct Kaluk': 'Aquädukt-Kaluk',
        'Aqueduct Udumbara': 'Aquädukt-Udumbara',
        'Arcane Font': 'arkan(?:e|er|es|en) Tafel',
        'Ball of Fire': 'Feuerball',
        'Eastern Ewer': 'Waschkrug',
        'Gladiator of Sil\'dih': 'Gladiator von Sil\'dih',
        'Hateful Visage': 'Hassendes Haupt',
        'Infern Brand': 'Infernales Mal',
        'Shadowcaster Zeless Gah': 'Schattenwirker Zeless Gah',
        'Sil\'dihn Armor': 'Sil\'dih-Kampfmaschine',
        'Sil\'dihn Dullahan': 'Sil\'dih-Dullahan',
        'Silken Puff': 'weich(?:e|er|es|en) Puschel',
        'Silkie': 'Silkie',
        'The Trial of Balance': 'Prüfung der Gerechtigkeit',
        'The Trial of Knowledge': 'Prüfung der Weisheit',
        'The Trial of Might': 'Prüfung der Macht',
      },
      'replaceText': {
        'Accursed Visage': 'Verdammtes Haupt',
        'Banishment': 'Verbannung',
        'Blazing Benifice': 'Heiliger Feuereifer',
        'Blessed Beacon': 'Himmelsfeuer',
        'Bracing Duster': 'Spritziger Wedel',
        'Bracing Suds': 'Spritziger Schaum',
        'Burn': 'Verbrennung',
        'Carpet Beater': 'Teppichklopfer',
        'Cast Shadow': 'Schattenfall',
        'Chilling Duster': 'Kalter Wedel',
        'Chilling Suds': 'Kalter Schaum',
        'Colossal Wreck': 'Riesig Trümmerbild',
        'Cryptic Flames': 'Kryptische Flammen',
        'Cryptic Portal': 'Kryptisches Portal',
        'Curse of the Fallen': 'Fluch des Zerfallenen',
        'Curse of the Monument': 'Fluch des Denkmals',
        'Dust Bluster': 'Staubbläser',
        'Eastern Ewers': 'Waschkrug',
        'Echo of the Fallen': 'Fluch des Äons',
        'Explosion': 'Explosion',
        'Firesteel Fracture': 'Feuerstahl-Brecher',
        'Firesteel Strike': 'Feuerstahl-Schlag',
        'Fizzling Duster': 'Prickelnder Wedel',
        'Fizzling Suds': 'Prickelnder Schaum',
        'Flash of Steel': 'Blitzender Stahl',
        'Fresh Puff': 'Frischer Puschel',
        'Gold Flame': 'Goldene Flamme',
        'Hateful Visage': 'Hassendes Haupt',
        'Infern Brand': 'Infernales Mal',
        'Infern Ward': 'Infernale Wehr',
        'Infern Wave': 'Infernale Welle',
        'Mighty Smite': 'Mächtiger Streich',
        'Nothing beside Remains': 'Nichts weiter blieb',
        'Puff and Tumble': 'Puschelputz',
        'Pure Fire': 'Reines Feuer',
        'Rinse': 'Spülung',
        'Rush of Might': 'Rausch der Macht',
        'Scream of the Fallen': 'Fluch der Ewigkeit',
        'Sculptor\'s Passion': 'Bildners Hohn',
        'Show of Strength': 'Kraftakt',
        'Silver Flame': 'Silberne Flamme',
        'Slippery Soap': 'Schmierige Seife',
        'Soap\'s Up': 'Einseifen',
        'Soaping Spree': 'Seifentaumel',
        'Specter of Might': 'Schemen der Macht',
        'Squeaky Clean': 'Blitzeblank',
        'Sundered Remains': 'Tote Trümmer',
        'Total Wash': 'Vollwäsche',
        'Wrath of Ruin': 'Düster Zorn',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Aqueduct Belladonna': 'belladone des aqueducs',
        'Aqueduct Dryad': 'dryade des aqueducs',
        'Aqueduct Kaluk': 'kaluk des aqueducs',
        'Aqueduct Udumbara': 'udumbara des aqueducs',
        'Arcane Font': 'sphère arcanique',
        'Ball of Fire': 'Boule de flammes',
        'Eastern Ewer': 'cruche orientale',
        'Gladiator of Sil\'dih': 'gladiateur sildien',
        'Hateful Visage': 'Visage de haine',
        'Infern Brand': 'Étendard sacré',
        'Shadowcaster Zeless Gah': 'Zeless Gah la Flamme ombrée',
        'Sil\'dihn Armor': 'armure maléfique sildien',
        'Sil\'dihn Dullahan': 'dullahan sildien',
        'Silken Puff': 'pompon de Silkie',
        'Silkie': 'Silkie',
        'The Trial of Balance': 'Épreuve de la Justice',
        'The Trial of Knowledge': 'Épreuve de la Sagesse',
        'The Trial of Might': 'Épreuve de la Puissance',
      },
      'replaceText': {
        'Accursed Visage': 'Visage d\'exécration',
        'Banishment': 'Bannissement',
        'Blazing Benifice': 'Canon des flammes sacrées',
        'Blessed Beacon': 'Flamme sacrée céleste',
        'Bracing Duster': 'Plumeau tonifiant',
        'Bracing Suds': 'Mousse tonifiante',
        'Burn': 'Combustion',
        'Carpet Beater': 'Tapette à tapis',
        'Cast Shadow': 'Ombre crépitante',
        'Chilling Duster': 'Plumeau givré',
        'Chilling Suds': 'Mousse givrée',
        'Colossal Wreck': 'Ruine colossale',
        'Cryptic Flames': 'Flammes cryptiques',
        'Cryptic Portal': 'Portail cryptique',
        'Curse of the Fallen': 'Malédiction hurlante',
        'Curse of the Monument': 'Malédiction monumentale',
        'Dust Bluster': 'Dépoussiérage',
        'Eastern Ewers': 'Aiguière aqueuse',
        'Echo of the Fallen': 'Écho déchu',
        'Explosion': 'Explosion',
        'Firesteel Fracture': 'Choc brasero',
        'Firesteel Strike': 'Frappe brasero',
        'Fizzling Duster': 'Plumeau pétillant',
        'Fizzling Suds': 'Mousse pétillante',
        'Flash of Steel': 'Éclair d\'acier',
        'Fresh Puff': 'Pompon lustré',
        'Gold Flame': 'Flamme dorée',
        'Hateful Visage': 'Visage de haine',
        'Infern Brand': 'Étendard sacré',
        'Infern Ward': 'Barrière infernale',
        'Infern Wave': 'Vague infernale',
        'Mighty Smite': 'Taillade belliqueuse',
        'Nothing beside Remains': 'Soulèvement général',
        'Puff and Tumble': 'Pompon culbuteur',
        'Pure Fire': 'Feu immaculé',
        'Rinse': 'Rinçage',
        'Rush of Might': 'Déferlement de puissance',
        'Scream of the Fallen': 'Grand écho déchu',
        'Sculptor\'s Passion': 'Canon belliqueux',
        'Show of Strength': 'Cri du guerrier',
        'Silver Flame': 'Flamme argentée',
        'Slippery Soap': 'Bain moussant glissant',
        'Soap\'s Up': 'Bain moussant explosif',
        'Soaping Spree': 'Bain moussant public',
        'Specter of Might': 'Spectre immémorial',
        'Squeaky Clean': 'Frottage',
        'Sundered Remains': 'Soulèvement belliqueux',
        'Total Wash': 'Lavage intégral',
        'Wrath of Ruin': 'Colère immémoriale',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Aqueduct Belladonna': 'アクアダクト・ベラドンナ',
        'Aqueduct Dryad': 'アクアダクト・ドライアド',
        'Aqueduct Kaluk': 'アクアダクト・カルク',
        'Aqueduct Udumbara': 'アクアダクト・ウドンゲ',
        'Arcane Font': '立体魔法陣',
        'Ball of Fire': '火炎球',
        'Eastern Ewer': '洗い壺',
        'Gladiator of Sil\'dih': 'シラディハ・グラディアトル',
        'Hateful Visage': '呪像起動',
        'Infern Brand': '呪具設置',
        'Shadowcaster Zeless Gah': '影火のゼレズ・ガー',
        'Sil\'dihn Armor': 'シラディハ・イビルアーマー',
        'Sil\'dihn Dullahan': 'シラディハ・デュラハン',
        'Silken Puff': 'シルキーズ・ポンポン',
        'Silkie': 'シルキー',
        'The Trial of Balance': '参の試練',
        'The Trial of Knowledge': '壱の試練',
        'The Trial of Might': '弐の試練',
      },
      'replaceText': {
        'Accursed Visage': '呪怨呪像',
        'Banishment': '強制転移の呪',
        'Blazing Benifice': '聖火砲',
        'Blessed Beacon': '天の聖火',
        'Bracing Duster': 'そよそよダスター',
        'Bracing Suds': 'そよそよシャンプー',
        'Burn': '燃焼',
        'Carpet Beater': 'カーペットビーター',
        'Cast Shadow': '影火呪式',
        'Chilling Duster': 'ひえひえダスター',
        'Chilling Suds': 'ひえひえシャンプー',
        'Colossal Wreck': '亡国の霊塔',
        'Cryptic Flames': '火焔の呪印',
        'Cryptic Portal': '転移の呪印',
        'Curse of the Fallen': '呪怨の咆哮',
        'Curse of the Monument': '呪怨の連撃',
        'Dust Bluster': 'ダストブロワー',
        'Eastern Ewers': '洗い壺',
        'Echo of the Fallen': '呪怨の残響',
        'Explosion': '爆発',
        'Firesteel Fracture': '石火豪打',
        'Firesteel Strike': '石火豪衝',
        'Fizzling Duster': 'ぱちぱちダスター',
        'Fizzling Suds': 'ぱちぱちシャンプー',
        'Flash of Steel': '闘人の波動',
        'Fresh Puff': 'ポンポン創出',
        'Gold Flame': '黄金の閃火',
        'Hateful Visage': '呪像起動',
        'Infern Brand': '呪具設置',
        'Infern Ward': '呪具警陣',
        'Infern Wave': '呪具流火',
        'Mighty Smite': '闘人の斬撃',
        'Nothing beside Remains': '座下隆起',
        'Puff and Tumble': 'ポンポンはたきがけ',
        'Pure Fire': '劫火',
        'Rinse': 'すすぎ洗い',
        'Rush of Might': '大剛の突撃',
        'Scream of the Fallen': '呪怨の大残響',
        'Sculptor\'s Passion': '闘人砲',
        'Show of Strength': '勇士の咆哮',
        'Silver Flame': '白銀の閃火',
        'Slippery Soap': 'すべってシャンプーボム',
        'Soap\'s Up': 'シャンプーボム',
        'Soaping Spree': 'みんなでシャンプーボム',
        'Specter of Might': '亡念幻身',
        'Squeaky Clean': '水拭き',
        'Sundered Remains': '闘場隆起',
        'Total Wash': '水洗い',
        'Wrath of Ruin': '亡念励起',
      },
    },
  ],
};

export default triggerSet;
