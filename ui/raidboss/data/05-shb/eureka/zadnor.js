import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';

// CE explainer: https://www.youtube.com/watch?v=L4lXAV_OD-0

// TODO: snake: everything
// TODO: blade: everything
// TODO: lyon: everything
// TODO: blood: Flight of the Malefic cleaves
// TODO: blood: gaze vs line attack from adds
// TODO: wolf: 6x Imaginifers cast thermal gust hitting east/west (only seen east at -828...-808)
// TODO: cavalry: early call for knockback direction?
// TODO: calalry: is Ride Down explainable??
// TODO: time: is it possible to find where slow clocks are?
// TODO: machines: can describe initial safe quadrant from first charges?
// TODO: machines: can describe "diagonal line bomb" safe spot
// TODO: machines: can determine rotating corner to go to
// TODO: alkonost: foreshadowing (both in CE and Dalraida)
// TODO: sartavoir: everything
// TODO: hallway: left/right lasers (check getCombatants???)
// TODO: saunion: are the mobile halo / crossray abilities corresponding to directions?
// TODO: diablo: diabolic gate directional callouts???
// TODO: diablo: improve timing on acceleration bomb

// List of events:
// https://github.com/xivapi/ffxiv-datamining/blob/master/csv/DynamicEvent.csv
//
// These ids are (unfortunately) gathered by hand and don't seem to correlate
// to any particular bits of data.  However, there's a game log message when you
// register for a CE and an 0x21 message with this id when you accept and
// teleport in.  This avoids having to translate all of these names and also
// guarantees that the player is actually in the CE for the purpose of
// filtering triggers.
const ceIds = {
  // On Serpents' Wings
  serpents: '211',
  // Feeling the Burn
  feeling: '20E',
  // The Broken Blade
  blade: '???',
  // From Beyond the Grave
  grave: '21B',
  // With Diremite and Main
  diremite: '221',
  // Here Comes the Cavalry
  cavalry: '21C',
  // Head of the Snake
  snake: '???',
  // There Would Be Blood
  blood: '210',
  // Never Cry Wolf
  wolf: '20F',
  // Time To Burn
  time: '21D',
  // Lean, Mean, Magitek Machines
  machines: '218',
  // Worn to a Shadow
  shadow: '222',
  // A Familiar Face
  face: '212',
  // Looks to Die For
  looks: '207',
  // Taking the Lyon's Share
  lyon: '???',
  // The Dalriada
  dalriada: '213',
  dalriadaCuchulainn: '214',
  dalriadaHallway: '215',
  dalriadaSaunion: '216',
  dalriadaDiablo: '217',
};

const limitCutHeadmarkers = ['004F', '0050', '0051', '0052'];

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

// TODO: promote something like this to Conditions?
const tankBusterOnParty = (ceName) => (data, matches) => {
  if (ceName && data.ce !== ceName)
    return false;
  if (matches.target === data.me)
    return true;
  if (data.role !== 'healer')
    return false;
  return data.party.inParty(matches.target);
};

export default {
  zoneId: ZoneId.Zadnor,
  resetWhenOutOfCombat: false,
  timelineFile: 'zadnor.txt',
  triggers: [
    {
      id: 'Zadnor Falling Asleep',
      netRegex: NetRegexes.gameLog({ line: '7 minutes have elapsed since your last activity..*?', capture: false }),
      netRegexDe: NetRegexes.gameLog({ line: 'Seit deiner letzten Aktivität sind 7 Minuten vergangen..*?', capture: false }),
      netRegexFr: NetRegexes.gameLog({ line: 'Votre personnage est inactif depuis 7 minutes.*?', capture: false }),
      netRegexJa: NetRegexes.gameLog({ line: '操作がない状態になってから7分が経過しました。.*?', capture: false }),
      netRegexCn: NetRegexes.gameLog({ line: '已经7分钟没有进行任何操作.*?', capture: false }),
      netRegexKo: NetRegexes.gameLog({ line: '7분 동안 아무 조작을 하지 않았습니다..*?', capture: false }),
      response: Responses.wakeUp(),
    },
    {
      id: 'Zadnor Critical Engagement',
      netRegex: NetRegexes.network6d({ command: '80000014' }),
      run: (data, matches) => {
        // This fires when you win, lose, or teleport out.
        if (matches.data0 === '00') {
          if (data.ce && data.options.Debug)
            console.log(`Stop CE: ${data.ce}`);
          // Stop any active timelines.
          data.StopCombat();
          // Prevent further triggers for any active CEs from firing.
          data.ce = null;
          return;
        }

        data.ce = null;
        const ceId = matches.data0.toUpperCase();
        for (const key in ceIds) {
          if (ceIds[key] === ceId) {
            if (data.options.Debug)
              console.log(`Start CE: ${key} (${ceId})`);
            data.ce = key;
            return;
          }
        }

        if (data.options.Debug)
          console.log(`Start CE: ??? (${ceId})`);
      },
    },
    // ***** On Serpents' Wings *****
    {
      id: 'Zadnor Serpents Turbine',
      netRegex: NetRegexes.startsUsing({ source: 'Stormborne Zirnitra', id: '5E54' }),
      condition: (data) => data.ce === 'serpents',
      preRun: (data) => data.serpentsTurbineCount = (data.serpentsTurbineCount || 0) + 1,
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 5,
      alertText: (data, _matches, output) => {
        // TODO: how does this loop?
        if (data.serpentsTurbineCount === 1)
          return output.knockbackDonut();
        else if (data.serpentsTurbineCount === 2)
          return output.knockbackIntoCircle();
        else if (data.serpentsTurbineCount === 3)
          return output.knockbackExplosion();
        else if (data.serpentsTurbineCount === 4)
          return output.knockbackDonut();
        else if (data.serpentsTurbineCount === 5)
          return output.knockbackIntoSafe();
      },
      outputStrings: {
        knockbackDonut: {
          en: 'Knockback + Stack Donuts Middle',
        },
        knockbackIntoCircle: {
          en: 'Knockback (towards first circles)',
        },
        knockbackIntoSafe: {
          en: 'Knockback (towards open spots)',
        },
        knockbackExplosion: {
          // Can't trust people to make a safe spot,
          // so using knockback prevention is probably the best advice.
          en: 'Knockback (prevent)',
        },
      },
    },
    // ***** Feeling the Burn *****
    {
      id: 'Zadnor Feeling Suppressive Magitek Rays',
      netRegex: NetRegexes.startsUsing({ source: 'Blackburn', id: '5C40', capture: false }),
      condition: (data) => data.ce === 'feeling',
      response: Responses.aoe(),
    },
    {
      id: 'Zadnor Feeling Chain Cannon You',
      netRegex: NetRegexes.headMarker({ id: '00A4' }),
      condition: (data, matches) => data.ce === 'feeling' && data.me === matches.target,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Chain Cannon on YOU',
        },
      },
    },
    {
      id: 'Zadnor Feeling Chain Cannon Not You',
      netRegex: NetRegexes.headMarker({ id: '00A4', capture: false }),
      condition: (data) => data.ce === 'feeling',
      delaySeconds: 3,
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Stay Out of Lasers',
        },
      },
    },
    {
      id: 'Zadnor Feeling Analysis',
      netRegex: NetRegexes.startsUsing({ source: 'Blackburn', id: '5C37', capture: false }),
      condition: (data) => data.ce === 'feeling',
      run: (data) => data.feelingAnalysis = true,
    },
    {
      id: 'Zadnor Feeling Read Orders Coordinated Assault',
      netRegex: NetRegexes.startsUsing({ source: 'Blackburn', id: '5C34', capture: false }),
      condition: (data) => data.ce === 'feeling',
      alertText: (data, _matches, output) => {
        return data.feelingAnalysis ? output.point() : output.dodge();
      },
      run: (data) => delete data.feelingAnalysis,
      outputStrings: {
        dodge: {
          en: 'Dodge 4 Charges',
        },
        point: {
          en: 'Point at 4 Charges',
        },
      },
    },
    // ***** The Broken Blade *****
    // ***** From Beyond the Grave *****
    {
      id: 'Zadnor Grave Soul Purge',
      // 5E23 = get out first
      // 5E25 = get in first
      netRegex: NetRegexes.startsUsing({ source: '4th-Make Shemhazai', id: ['5E23', '5E25'] }),
      condition: (data) => data.ce === 'grave',
      suppressSeconds: 10,
      alertText: (_data, matches, output) => {
        return matches.id === '5E23' ? output.outThenIn() : output.inThenOut();
      },
      outputStrings: {
        outThenIn: Outputs.outThenIn,
        inThenOut: Outputs.inThenOut,
      },
    },
    {
      id: 'Zadnor Grave Soul Purge Second',
      // 5E23 = get out first (so get in second)
      // 5E25 = get in first (so get out second)
      netRegex: NetRegexes.startsUsing({ source: '4th-Make Shemhazai', id: ['5E23', '5E25'] }),
      condition: (data) => data.ce === 'grave',
      delaySeconds: 5,
      suppressSeconds: 10,
      alertText: (_data, matches, output) => {
        return matches.id === '5E23' ? output.in() : output.out();
      },
      outputStrings: {
        out: Outputs.out,
        in: Outputs.in,
      },
    },
    {
      id: 'Zadnor Grave Devour Soul',
      netRegex: NetRegexes.startsUsing({ source: '4th-Make Shemhazai', id: '5E20' }),
      condition: tankBusterOnParty('grave'),
      response: Responses.tankBuster(),
    },
    {
      id: 'Zadnor Grave Blight',
      netRegex: NetRegexes.startsUsing({ source: '4th-Make Shemhazai', id: '5E1E', capture: false }),
      condition: (data) => data.ce === 'grave',
      response: Responses.aoe(),
    },
    {
      id: 'Zadnor Grave Crimson Blade',
      netRegex: NetRegexes.addedCombatantFull({ npcNameId: '9934', capture: false }),
      condition: (data) => data.ce === 'grave',
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get Behind Hernais',
        },
      },
    },
    {
      id: 'Zadnor Grave War Wraith',
      netRegex: NetRegexes.addedCombatantFull({ npcNameId: '9933', capture: false }),
      condition: (data) => data.ce === 'grave',
      // They hang out on the outside for a bit and then become targetable.
      delaySeconds: 11.5,
      suppressSeconds: 10,
      response: Responses.killAdds(),
    },
    {
      id: 'Zadnor Grave Aethertide',
      netRegex: NetRegexes.startsUsing({ source: 'Dyunbu The Accursed', id: '5E2A' }),
      condition: (data, matches) => data.ce === 'grave' && data.me === matches.target,
      response: Responses.spread(),
    },
    {
      id: 'Zadnor Grave Forced March',
      // 871 = Forward March
      // 872 = About Face
      // 873 = Left Face
      // 874 = Right Face
      netRegex: NetRegexes.gainsEffect({ source: '4th-Make Shemhazai', effectId: ['871', '872', '873', '874'] }),
      condition: (data, matches) => data.ce === 'grave' && data.me === matches.target,
      alertText: (_data, matches, output) => {
        const effectId = matches.effectId.toUpperCase();
        if (effectId === '871')
          return output.forward();
        if (effectId === '872')
          return output.backward();
        if (effectId === '873')
          return output.left();
        if (effectId === '874')
          return output.right();
      },
      outputStrings: {
        forward: {
          en: 'March Forward Into Middle',
        },
        backward: {
          en: 'March Backward Into Middle',
        },
        left: {
          en: 'March Left Into Middle',
        },
        right: {
          en: 'March Right Into Middle',
        },
      },
    },
    // ***** With Diremite and Main *****
    {
      id: 'Zadnor Diremite Crystal Needle',
      netRegex: NetRegexes.startsUsing({ source: 'Hedetet', id: '5E15' }),
      condition: tankBusterOnParty('diremite'),
      response: Responses.tankBuster(),
    },
    {
      id: 'Zadnor Diremite Shardstrike',
      netRegex: NetRegexes.startsUsing({ source: 'Hedetet', id: '5E17' }),
      condition: (data, matches) => data.ce === 'diremite' && data.me === matches.target,
      response: Responses.spread(),
    },
    {
      id: 'Zadnor Diremite Hailfire You',
      netRegex: NetRegexes.headMarker({ id: limitCutHeadmarkers }),
      condition: (data, matches) => data.ce === 'diremite' && data.me === matches.target,
      preRun: (data, matches) => {
        data.diremiteHailfire = data.diremiteHailfire || [];
        data.diremiteHailfire.push(matches.target);
      },
      alertText: (_data, matches, output) => {
        const id = matches.id;
        const num = limitCutHeadmarkers.indexOf(id) + 1;
        if (num < 1)
          return;
        const numStr = output[`num${num}`]();
        return output.text({ num: numStr });
      },
      outputStrings: {
        num1: numberOutputStrings[1],
        num2: numberOutputStrings[2],
        num3: numberOutputStrings[3],
        num4: numberOutputStrings[4],
        text: {
          en: '${num} (spread for laser)',
        },
      },
    },
    {
      id: 'Zadnor Diremite Hailfire Not You',
      netRegex: NetRegexes.headMarker({ id: limitCutHeadmarkers, capture: false }),
      condition: (data) => data.ce === 'diremite',
      delaySeconds: 0.5,
      suppressSeconds: 1,
      infoText: (data, _matches, output) => {
        if (data.diremiteHailfire && !data.diremiteHailfire.includes(data.me))
          return output.text();
      },
      run: (data) => delete data.diremiteHailfire,
      outputStrings: {
        text: {
          en: 'Avoid Lasers',
          de: 'Laser ausweichen',
          fr: 'Évitez les lasers',
          ja: 'レーザーを避ける',
          cn: '躲避激光',
          ko: '레이저 피하기',
        },
      },
    },
    {
      id: 'Zadnor Diremite Crystaline Stingers',
      netRegex: NetRegexes.startsUsing({ source: 'Hedetet', id: '5E0D', capture: false }),
      condition: (data) => data.ce === 'diremite',
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Hide Behind Silver Shard',
        },
      },
    },
    {
      id: 'Zadnor Diremite Aetherial Stingers',
      netRegex: NetRegexes.startsUsing({ source: 'Hedetet', id: '5E0E', capture: false }),
      condition: (data) => data.ce === 'diremite',
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Hide Behind Gold Shard',
        },
      },
    },
    {
      id: 'Zadnor Diremite Sand Sphere',
      netRegex: NetRegexes.startsUsing({ source: 'Hedetet', id: '5E0F', capture: false }),
      condition: (data) => data.ce === 'diremite',
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Away From Orbs',
        },
      },
    },
    // ***** Here Comes the Cavalry *****
    {
      id: 'Zadnor Cavalry Gust Slash',
      netRegex: NetRegexes.startsUsing({ source: 'Clibanarius', id: '5D7D' }),
      condition: (data) => data.ce === 'cavalry',
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 5,
      response: Responses.knockback(),
    },
    {
      id: 'Zadnor Cavalry Raw Steel',
      netRegex: NetRegexes.startsUsing({ source: 'Clibanarius', id: '5D87' }),
      condition: (data) => data.ce === 'cavalry',
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          avoidCharge: {
            en: 'Avoid Charge',
            de: 'ausweichen',
            fr: 'Évitez les charges',
            ja: '突進避けて',
            cn: '躲避冲锋',
            ko: '돌진 피하기',
          },
          runAway: {
            en: 'Run Away From Boss',
            de: 'Renn weg vom Boss',
            fr: 'Courez loin du boss',
            ja: 'ボスから離れる',
            cn: '远离Boss',
            ko: '보스와 거리 벌리기',
          },
        };

        if (matches.target === data.me)
          return { alertText: output.runAway() };
        return { infoText: output.avoidCharge() };
      },
    },
    {
      id: 'Zadnor Cavalry Call Raze',
      netRegex: NetRegexes.startsUsing({ source: 'Clibanarius', id: '5D8C', capture: false }),
      condition: (data) => data.ce === 'cavalry',
      response: Responses.aoe(),
    },
    {
      id: 'Zadnor Cavalry Magitek Blaster',
      netRegex: NetRegexes.startsUsing({ source: 'Clibanarius', id: '5D90' }),
      condition: (data) => data.ce === 'cavalry',
      response: Responses.stackMarkerOn(),
    },
    // ***** Head of the Snake *****
    // ***** There Would Be Blood *****
    {
      id: 'Zadnor Blood Cloud Of Locusts',
      netRegex: NetRegexes.startsUsing({ source: 'Hanbi', id: '5C10', capture: false }),
      condition: (data) => data.ce === 'blood',
      response: Responses.getOut(),
    },
    {
      id: 'Zadnor Blood Plague Of Locusts',
      netRegex: NetRegexes.startsUsing({ source: 'Hanbi', id: '5C11', capture: false }),
      condition: (data) => data.ce === 'blood',
      response: Responses.getIn(),
    },
    {
      id: 'Zadnor Blood Dread Wind',
      netRegex: NetRegexes.startsUsing({ source: 'Hanbi', id: '5BAE', capture: false }),
      condition: (data) => data.ce === 'blood',
      response: Responses.aoe(),
    },
    {
      id: 'Zadnor Blood Gale Cannon',
      netRegex: NetRegexes.startsUsing({ source: 'Hanbi', id: '53E3', capture: false }),
      condition: (data) => data.ce === 'blood',
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          // TODO: should this be a response/output?
          en: 'Out of Front',
        },
      },
    },
    {
      id: 'Zadnor Blood Camisado',
      netRegex: NetRegexes.startsUsing({ source: 'Hanbi', id: '5BAE' }),
      condition: tankBusterOnParty('blood'),
      response: Responses.tankBuster(),
    },
    // ***** Never Cry Wolf *****
    {
      id: 'Zadnor Wolf Glaciation',
      netRegex: NetRegexes.startsUsing({ source: 'Hrodvitnir', id: '5C32', capture: false }),
      condition: (data) => data.ce === 'wolf',
      response: Responses.aoe(),
    },
    {
      id: 'Zadnor Wolf Storm Without',
      netRegex: NetRegexes.startsUsing({ source: 'Hrodvitnir', id: '5C2A', capture: false }),
      condition: (data) => data.ce === 'wolf',
      response: Responses.getUnder(),
    },
    {
      id: 'Zadnor Wolf Storm Within',
      netRegex: NetRegexes.startsUsing({ source: 'Hrodvitnir', id: '5C2C', capture: false }),
      condition: (data) => data.ce === 'wolf',
      response: Responses.getOut(),
    },
    {
      id: 'Zadnor Wolf Bracing Wind',
      netRegex: NetRegexes.startsUsing({ source: 'Ice Sprite', id: '5C22' }),
      condition: (data) => data.ce === 'wolf',
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 5,
      suppressSeconds: 5,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Knockback (behind pillar)',
        },
      },
    },
    {
      id: 'Zadnor Wolf Lunar Cry',
      netRegex: NetRegexes.startsUsing({ source: 'Hrodvitnir', id: '5C24', capture: false }),
      condition: (data) => data.ce === 'wolf',
      // Call this out after Bracing Wind.
      delaySeconds: 9,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Hide Behind Pillar',
        },
      },
    },
    // ***** Time To Burn *****
    {
      id: 'Zadnor Time Fire IV',
      netRegex: NetRegexes.startsUsing({ source: '4th-Make Belias', id: '5D9A' }),
      condition: (data) => data.ce === 'time',
      response: Responses.tankBuster(),
    },
    {
      id: 'Zadnor Time Fire',
      netRegex: NetRegexes.startsUsing({ source: '4th-Make Belias', id: '5D99' }),
      condition: tankBusterOnParty('time'),
      response: Responses.tankBuster(),
    },
    {
      id: 'Zadnor Time Reproduce',
      netRegex: NetRegexes.startsUsing({ source: '4th-Make Belias', id: '60E9', capture: false }),
      condition: (data) => data.ce === 'time',
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Avoid Dashes',
          de: 'Sprint ausweichen',
          fr: 'Évitez les charges',
          ja: 'ブレードを避ける',
          cn: '躲开冲锋',
          ko: '돌진 피하기',
        },
      },
    },
    {
      id: 'Zadnor Time Time Bomb',
      netRegex: NetRegexes.startsUsing({ source: '4th-Make Belias', id: '5D95', capture: false }),
      condition: (data) => data.ce === 'time',
      preRun: (data) => data.timeBombCount = (data.timeBombCount || 0) + 1,
      infoText: (data, _matches, output) => {
        // Belias alternates 2 and 3 Time Bombs, starting with 2.
        return data.timeBombCount % 2 ? output.twoClocks() : output.threeClocks();
      },
      outputStrings: {
        twoClocks: {
          en: 'Go Perpendicular To Clock Hands',
        },
        threeClocks: {
          // This is...not the best instruction.
          en: 'Go Opposite All Clock Hands',
        },
      },
    },
    // ***** Lean, Mean, Magitek Machines *****
    {
      id: 'Zadnor Machines Magnetic Field',
      netRegex: NetRegexes.startsUsing({ source: 'Kampe', id: '5CFE', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Zadnor Machines Fore-Hind Cannons',
      netRegex: NetRegexes.startsUsing({ source: 'Kampe', id: '5CFF', capture: false }),
      response: Responses.goSides(),
    },
    // ***** Worn to a Shadow *****
    {
      id: 'Zadnor Shadow Bladed Beak',
      // Not a cleave.
      netRegex: NetRegexes.startsUsing({ source: 'Alkonost', id: '5E3B' }),
      condition: tankBusterOnParty('shadow'),
      response: Responses.tankBuster(),
    },
    {
      id: 'Zadnor Shadow Nihility\'s Song',
      netRegex: NetRegexes.startsUsing({ source: 'Alkonost', id: '5E3C', capture: false }),
      condition: (data) => data.ce === 'shadow',
      response: Responses.aoe(),
    },
    {
      id: 'Zadnor Shadow Stormcall',
      netRegex: NetRegexes.startsUsing({ source: 'Alkonost', id: '5E39', capture: false }),
      condition: (data) => data.ce === 'shadow',
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Follow Slow Orb',
        },
      },
    },
    {
      id: 'Zadnor Shadow Stormcall Away',
      netRegex: NetRegexes.startsUsing({ source: 'Alkonost', id: '5E39', capture: false }),
      condition: (data) => data.ce === 'shadow',
      delaySeconds: 15,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Away From Orb',
        },
      },
    },
    // ***** A Familiar Face *****
    {
      id: 'Zadnor Face Ancient Quake IV',
      netRegex: NetRegexes.startsUsing({ source: '4th-Make Hashmal', id: '5D14', capture: false }),
      condition: (data) => data.ce === 'face',
      response: Responses.aoe(),
    },
    {
      id: 'Zadnor Face Rock Cutter',
      netRegex: NetRegexes.startsUsing({ source: '4th-Make Hashmal', id: '5D13' }),
      condition: tankBusterOnParty('face'),
      response: Responses.tankBuster(),
    },
    {
      id: 'Zadnor Face Extreme Edge Left',
      netRegex: NetRegexes.startsUsing({ source: 'Phantom Hashmal', id: '5D0E', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Find Phantom; Dodge Left',
        },
      },
    },
    {
      id: 'Zadnor Face Extreme Edge Right',
      netRegex: NetRegexes.startsUsing({ source: 'Phantom Hashmal', id: '5D0D', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Find Phantom; Dodge Right',
        },
      },
    },
    {
      id: 'Zadnor Face Hammer Round',
      netRegex: NetRegexes.ability({ source: '4th-Make Hashmal', id: '5D10', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Away From Hammer; Rotate Outside',
        },
      },
    },
    // ***** Looks to Die For *****
    {
      id: 'Zadnor Looks Forelash',
      netRegex: NetRegexes.startsUsing({ source: 'Ayida', id: '5DA9', capture: false }),
      condition: (data) => data.ce === 'looks',
      response: Responses.getBehind(),
    },
    {
      id: 'Zadnor Looks Backlash',
      netRegex: NetRegexes.startsUsing({ source: 'Ayida', id: '5DAA', capture: false }),
      condition: (data) => data.ce === 'looks',
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          // TODO: should this be a response/output?
          en: 'Get In Front',
          de: 'Geh vor den Boss',
          fr: 'Soyez devant',
          ja: 'ボスの正面へ',
          cn: '去Boss正面',
          ko: '정면에 서기',
        },
      },
    },
    {
      id: 'Zadnor Looks Twisting Winds',
      netRegex: NetRegexes.startsUsing({ source: 'Ayida', id: '5DA2', capture: false }),
      condition: (data) => data.ce === 'looks',
      response: Responses.goSides(),
    },
    {
      id: 'Zadnor Looks Roar',
      netRegex: NetRegexes.startsUsing({ source: 'Ayida', id: '5DAD', capture: false }),
      condition: (data) => data.ce === 'looks',
      response: Responses.aoe(),
    },
    {
      id: 'Zadnor Looks Serpent\'s Edge',
      netRegex: NetRegexes.startsUsing({ source: 'Ayida', id: '5DB1' }),
      condition: tankBusterOnParty('looks'),
      response: Responses.tankBuster(),
    },
    {
      id: 'Zadnor Looks Levinbolt',
      netRegex: NetRegexes.startsUsing({ source: 'Ayida', id: '5DB0' }),
      condition: (data, matches) => data.ce === 'looks' && data.me === matches.target,
      response: Responses.spread(),
    },
    {
      id: 'Zadnor Looks Thundercall',
      netRegex: NetRegexes.startsUsing({ source: 'Ayida', id: '5D9C', capture: false }),
      condition: (data) => data.ce === 'looks',
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Avoid Orbs -> Under Orbs',
        },
      },
    },
    {
      id: 'Zadnor Looks Flame',
      netRegex: NetRegexes.startsUsing({ source: 'Ayida', id: '5DA6', capture: false }),
      condition: (data) => data.ce === 'looks',
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          // TODO: this is also an aoe, and this is a pretty poor description.
          en: 'Go to small orb',
        },
      },
    },
    // ***** Taking the Lyon's Share *****
    // ***** The Dalriada *****
    {
      id: 'Zadnor Sartauvoir Pyrokinesis',
      netRegex: NetRegexes.startsUsing({ source: 'Sartauvoir The Inferno', id: '5E7D', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Zadnor Sartauvoir Time Eruption',
      netRegex: NetRegexes.startsUsing({ source: 'Sartauvoir The Inferno', id: '5E6C', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Go to Slow Clocks',
        },
      },
    },
    {
      id: 'Zadnor Sartauvoir Reverse Time Eruption',
      netRegex: NetRegexes.startsUsing({ source: 'Sartauvoir The Inferno', id: '5E6D', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Go to Fast Clocks',
        },
      },
    },
    {
      id: 'Zadnor Sartauvoir Phenex',
      netRegex: NetRegexes.startsUsing({ source: 'Sartauvoir The Inferno', id: '5E72', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Bird Dashes',
        },
      },
    },
    {
      id: 'Zadnor Sartauvoir Hyperpyroplexy',
      netRegex: NetRegexes.ability({ source: 'Sartauvoir The Inferno', id: '5E76', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get Towers',
          de: 'Türme nehmen',
          fr: 'Prenez les tours',
          ja: '塔を踏む',
          cn: '踩塔',
          ko: '장판 하나씩 들어가기',
        },
      },
    },
    {
      id: 'Zadnor Sartauvoir Burning Blade',
      netRegex: NetRegexes.startsUsing({ source: 'Sartauvoir The Inferno', id: '5E90' }),
      condition: tankBusterOnParty(),
      response: Responses.tankBuster(),
    },
    {
      id: 'Zadnor Sartauvoir Mannatheihwon Flame Warning',
      // Triggered after Burning Blade.
      // TODO: does this ever happen again??
      netRegex: NetRegexes.ability({ source: 'Sartauvoir The Inferno', id: '5E90', capture: false }),
      suppressSeconds: 999999,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Stack together to bait Ignis Est',
        },
      },
    },
    {
      id: 'Zadnor Sartauvoir Mannatheihwon Flame',
      netRegex: NetRegexes.startsUsing({ source: 'Sartauvoir The Inferno', id: '5E87', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Zadnor Sartauvoir Mannatheihwon Flame Away',
      netRegex: NetRegexes.ability({ source: 'Sartauvoir The Inferno', id: '5E87', capture: false }),
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get far away from X charges',
        },
      },
    },
    {
      id: 'Zadnor Sartauvoir Pyrocrysis',
      netRegex: NetRegexes.startsUsing({ source: 'Sartauvoir The Inferno', id: '5E8F' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Zadnor Sartauvoir Left Brand',
      netRegex: NetRegexes.startsUsing({ source: 'Sartauvoir The Inferno', id: '5E8C', capture: false }),
      response: Responses.goRight(),
    },
    {
      id: 'Zadnor Sartauvoir Right Brand',
      netRegex: NetRegexes.startsUsing({ source: 'Sartauvoir The Inferno', id: '5E8B', capture: false }),
      response: Responses.goLeft(),
    },
    {
      id: 'Zadnor Blackburn Magitek Rays',
      netRegex: NetRegexes.startsUsing({ source: '4th Legion Blackburn', id: '5F12', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Zadnor Blackburn Analysis',
      netRegex: NetRegexes.startsUsing({ source: '4th Legion Blackburn', id: '5F0F', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Opening Toward Undodgeable Line',
        },
      },
    },
    {
      id: 'Zadnor Blackburn Augur Sanctified Quake III',
      netRegex: NetRegexes.startsUsing({ id: '5F20', capture: false }),
      suppressSeconds: 1,
      response: Responses.aoe(),
    },
    {
      id: 'Zadnor Augur Pyroplexy',
      netRegex: NetRegexes.ability({ source: '4th Legion Augur', id: '5F1B', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get Towers',
          de: 'Türme nehmen',
          fr: 'Prenez les tours',
          ja: '塔を踏む',
          cn: '踩塔',
          ko: '장판 하나씩 들어가기',
        },
      },
    },
    {
      id: 'Zadnor Augur Turbine',
      netRegex: NetRegexes.startsUsing({ source: 'Flameborne Zirnitra', id: '5F14' }),
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 5,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Stack + Knockback to Safe Spot',
        },
      },
    },
    {
      id: 'Zadnor Alkonost Stormcall',
      netRegex: NetRegexes.startsUsing({ source: 'Tamed Alkonost', id: '5F26', capture: false }),
      delaySeconds: 2,
      durationSeconds: 5,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          // TODO: we could figure out where this orb is and say go north/south.
          en: 'Go Opposite Fast Orb',
        },
      },
    },
    {
      id: 'Zadnor Alkonost Wind',
      // 5F21 = North Wind
      // 5F22 = South Wind
      netRegex: NetRegexes.startsUsing({ source: 'Tamed Carrion Crow', id: ['5F21', '5F22'] }),
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 5,
      response: Responses.knockback(),
    },
    {
      id: 'Zadnor Alkonost Stormcall Away',
      netRegex: NetRegexes.startsUsing({ source: 'Tamed Alkonost', id: '5F26', capture: false }),
      delaySeconds: 18,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Away From Orb',
        },
      },
    },
    {
      id: 'Zadnor Alkonost Nihility\'s Song',
      netRegex: NetRegexes.startsUsing({ source: 'Alkonost', id: '5F28', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Zadnor Cuchulainn March',
      // 871 = Forward March
      // 872 = About Face
      // 873 = Left Face
      // 874 = Right Face
      netRegex: NetRegexes.gainsEffect({ source: '4th-Make Cuchulainn', effectId: ['871', '872', '873', '874'] }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, matches, output) => {
        const effectId = matches.effectId.toUpperCase();
        if (effectId === '871')
          return output.forward();
        if (effectId === '872')
          return output.backward();
        if (effectId === '873')
          return output.left();
        if (effectId === '874')
          return output.right();
      },
      outputStrings: {
        forward: {
          en: 'March Forward (avoid puddles)',
        },
        backward: {
          en: 'March Backward (avoid puddles)',
        },
        left: {
          en: 'March Left (avoid puddles)',
        },
        right: {
          en: 'March Right (avoid puddles)',
        },
      },
    },
    {
      id: 'Zadnor Cuchulainn Might Of Malice',
      netRegex: NetRegexes.startsUsing({ source: '4th-Make Cuchulainn', id: '5C92' }),
      condition: tankBusterOnParty(),
      response: Responses.tankBuster(),
    },
    {
      id: 'Zadnor Cuchulainn Putrified Soul',
      netRegex: NetRegexes.startsUsing({ source: '4th-Make Cuchulainn', id: '5C8F', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Zadnor Cuchulainn Fleshy Necromass',
      netRegex: NetRegexes.startsUsing({ source: '4th-Make Cuchulainn', id: '5C82', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get In Puddle',
        },
      },
    },
    {
      id: 'Zadnor Cuchulainn Necrotic Billow',
      netRegex: NetRegexes.startsUsing({ source: '4th-Make Cuchulainn', id: '5C86', capture: false }),
      // Normally wouldn't call out ground markers, but this can look a lot like Ambient Pulsation.
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Avoid Chasing AOEs',
        },
      },
    },
    {
      id: 'Zadnor Cuchulainn Ambient Pulsation',
      netRegex: NetRegexes.startsUsing({ source: '4th-Make Cuchulainn', id: '5C8E', capture: false }),
      suppressSeconds: 10,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          // TODO: this is "titan line bombs".  Is there a better wording here?
          en: 'Go to third line',
        },
      },
    },
    {
      id: 'Zadnor Cuchulainn Fell Flow',
      netRegex: NetRegexes.headMarker({ id: '0028' }),
      condition: (data, matches) => data.ce === 'dalriadaCuchulainn' && data.me === matches.target,
      response: Responses.earthshaker(),
    },
    {
      id: 'Zadnor Saunion High-Powered Magitek Ray',
      netRegex: NetRegexes.startsUsing({ source: 'Saunion', id: '5DC5' }),
      response: Responses.tankCleave(),
    },
    {
      id: 'Zadnor Saunion Magitek Halo',
      netRegex: NetRegexes.startsUsing({ source: 'Saunion', id: '5DB5', capture: false }),
      response: Responses.getUnder(),
    },
    {
      id: 'Zadnor Saunion Magitek Crossray',
      netRegex: NetRegexes.startsUsing({ source: 'Saunion', id: '5DB7', capture: false }),
      alertText: (_data, _matches, outputs) => outputs.text(),
      outputStrings: {
        text: {
          en: 'Go Intercardinals',
        },
      },
    },
    {
      id: 'Zadnor Saunion Mobile Halo',
      netRegex: NetRegexes.startsUsing({ source: 'Saunion', id: ['5DB9', '5DBA', '5DBB', '5DBC'], capture: false }),
      alertText: (_data, _matches, outputs) => outputs.text(),
      outputStrings: {
        text: {
          en: 'Get Under (towards charge)',
        },
      },
    },
    {
      id: 'Zadnor Saunion Mobile Crossray',
      netRegex: NetRegexes.startsUsing({ source: 'Saunion', id: ['5DBD', '5DBE', '5DBF', '5DC0'], capture: false }),
      suppressSeconds: 5,
      alertText: (_data, _matches, outputs) => outputs.text(),
      outputStrings: {
        text: {
          en: 'Go Intercards (away from charge)',
        },
      },
    },
    {
      id: 'Zadnor Saunion Anti-Personnel Missile',
      netRegex: NetRegexes.startsUsing({ source: 'Saunion', id: '5DC2' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Zadnor Saunion Missile Salvo',
      netRegex: NetRegexes.startsUsing({ source: 'Saunion', id: '5DC3' }),
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Zadnor Saunion Wildfire Winds',
      netRegex: NetRegexes.startsUsing({ source: 'Dawon The Younger', id: '5DCD', capture: false }),
      delaySeconds: 10,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          // TODO: during spiral scourge could be "get under middle/outer light orb"?
          en: 'Get Under Light Orb',
          de: 'Unter einem Lichtorb stellen',
          fr: 'Allez sous un Orbe lumineux',
          ja: '白玉へ',
          cn: '靠近白球',
          ko: '하얀 구슬 안으로',
        },
      },
    },
    {
      id: 'Zadnor Saunion Tooth and Talon',
      netRegex: NetRegexes.startsUsing({ source: 'Dawon The Younger', id: '5DD4' }),
      condition: tankBusterOnParty(),
      response: Responses.tankBuster(),
    },
    {
      id: 'Zadnor Saunion Swooping Frenzy',
      netRegex: NetRegexes.startsUsing({ source: 'Dawon The Younger', id: '5DD0', capture: false }),
      infoText: (data, _matches, output) => {
        // Every other Swooping Frenzy is followed by a Frigid Pulse, starting with the first.
        data.saunionSwoopingCount = (data.saunionSwoopingCount || 0) + 1;
        if (data.saunionSwoopingCount % 2)
          return output.text();
      },
      outputStrings: {
        text: {
          en: 'Follow Dawon',
        },
      },
    },
    {
      id: 'Zadnor Diablo Advanced Death Ray',
      netRegex: NetRegexes.headMarker({ id: '00E6' }),
      condition: (data) => data.ce === 'dalriadaDiablo',
      // TODO: this is maybe worth promoting to responses?
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          tankLaserOnYou: {
            en: 'Tank Laser on YOU',
            de: 'Tank Laser auf DIR',
            fr: 'Tank laser sur VOUS',
            ja: '自分にタンクレーザー',
            cn: '坦克射线点名',
            ko: '탱 레이저 대상자',
          },
          avoidTankLaser: {
            en: 'Avoid Tank Laser',
          },
        };

        if (data.me === matches.target)
          return { alarmText: output.tankLaserOnYou() };
        return { infoText: output.avoidTankLaser() };
      },
    },
    {
      id: 'Zadnor Diablo Aetheric Explosion',
      netRegex: NetRegexes.startsUsing({ source: 'The Diablo Armament', id: '5CC6', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Zadnor Diablo Ultimate Psuedoterror',
      // This is triggered on Diabolic Gate with a delay, so it gives an extra +4 seconds.
      netRegex: NetRegexes.startsUsing({ source: 'The Diablo Armament', id: '5C9F', capture: false }),
      delaySeconds: 35,
      response: Responses.getUnder(),
    },
    {
      id: 'Zadnor Diablo Advanced Death IV',
      netRegex: NetRegexes.startsUsing({ source: 'The Diablo Armament', id: '5CAF', capture: false }),
      // Circles appear at the end of the cast.
      delaySeconds: 4,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Avoid Growing Circles',
        },
      },
    },
    {
      id: 'Zadnor Diablo Advanced Death IV Followup',
      netRegex: NetRegexes.startsUsing({ source: 'The Diablo Armament', id: '5CAF', capture: false }),
      delaySeconds: 12,
      // TODO: or "Avoid Growing Circles (again lol)"?
      response: Responses.moveAway(),
    },
    {
      id: 'Zadnor Diablo Aetheric Boom Raidwide',
      netRegex: NetRegexes.startsUsing({ source: 'The Diablo Armament', id: '5CB3', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Zadnor Diablo Aetheric Boom Balloons',
      netRegex: NetRegexes.startsUsing({ source: 'The Diablo Armament', id: '5CB3', capture: false }),
      // Don't warn people to preposition here, because they probably need
      // heals after the initial hit before popping these.
      delaySeconds: 5.5,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Pop Balloons',
        },
      },
    },
    {
      id: 'Zadnor Diablo Deadly Dealing',
      netRegex: NetRegexes.startsUsing({ source: 'The Diablo Armament', id: '5CC2' }),
      // TODO: these feel really late with 5 seconds, should they call instantly at 7?
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 5,
      alertText: (data, _matches, output) => {
        // TODO: how does this loop?
        return data.diabloSeenDealing ? output.knockbackNox() : output.knockbackBits();
      },
      run: (data) => data.diabloSeenDealing = true,
      outputStrings: {
        knockbackBits: {
          en: 'Knockback (away from bits)',
        },
        knockbackNox: {
          en: 'Knockback (into empty corner)',
        },
      },
    },
    {
      id: 'Zadnor Diablo Void Systems Overload',
      netRegex: NetRegexes.startsUsing({ source: 'The Diablo Armament', id: '5CB7', capture: false }),
      response: Responses.bigAoe(),
    },
    {
      id: 'Zadnor Diablo Pillar Of Shamash Spread',
      // 5CBC damage
      netRegex: NetRegexes.headMarker({ id: '0017' }),
      condition: (data) => data.ce === 'dalriadaDiablo',
      preRun: (data, matches) => {
        data.diabloPillar = data.diabloPillar || [];
        data.diabloPillar.push(matches.target);
      },
      alertText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.text();
      },
      outputStrings: {
        text: {
          en: 'Laser Spread on YOU',
        },
      },
    },
    {
      id: 'Zadnor Diablo Pillar Of Shamash Stack',
      // 5CBE damage (no headmarker???)
      netRegex: NetRegexes.headMarker({ id: '0017', capture: false }),
      condition: (data) => data.ce === 'dalriadaDiablo',
      delaySeconds: 1.5,
      suppressSeconds: 5,
      infoText: (data, _matches, output) => {
        if (!data.diabloPillar || !data.diabloPillar.includes(data.me))
          return output.text();
      },
      run: (data) => delete data.diabloPillar,
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
      id: 'Zadnor Diablo Acceleration Bomb Dodge',
      netRegex: NetRegexes.gainsEffect({ effectId: 'A61' }),
      condition: Conditions.targetIsYou(),
      durationSeconds: (_data, matches) => parseFloat(matches.duration) - 4,
      infoText: (_data, matches, output) => {
        // Durations are 7 and 12.
        const duration = parseFloat(matches.duration);
        return duration > 10 ? output.dodgeFirst() : output.dodgeSecond();
      },
      outputStrings: {
        dodgeFirst: {
          en: '(Dodge -> Stop)',
        },
        dodgeSecond: {
          en: '(Stop -> Dodge)',
        },
      },
    },
    {
      id: 'Zadnor Diablo Acceleration Bomb Stop',
      netRegex: NetRegexes.gainsEffect({ effectId: 'A61' }),
      condition: Conditions.targetIsYou(),
      // TODO: this could be better timed to be later for the dodge -> stop version and earlier
      // for the stop -> dodge.
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 3.5,
      response: Responses.stopEverything(),
    },
  ],
};
