import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';

// TODO: wolf or grave has a east/west cleave???
// TODO: grave has spread markers
// TODO: blood: Flight of the Malefic cleaves
// TODO: blood: gaze vs line attack from adds
// TODO: calvary: knockbacks from directions

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
  feeling: '???',
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
  time: '???',
  // Lean, Mean, Magitek Machines
  machines: '???',
  // Worn to a Shadow
  shadow: '222',
  // A Familiar Face
  face: '212',
  // Looks to Die For
  looks: '???',
  // Taking the Lyon's Share
  lyon: '???',
  // The Dalriada
  dalriada: '???',
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
const tankBusterOnParty = (ceId) => (data) => {
  if (ceId && data.ce !== ceId)
    return false;
  if (data.target === data.me)
    return true;
  if (data.role !== 'healer')
    return false;
  return data.party.inParty(data.target);
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
              console.log(`Start CE: ${ceId} (${key})`);
            data.ce = ceId;
            return;
          }
        }

        if (data.options.Debug)
          console.log(`Unknown CE: ${ceId}`);
      },
    },
    // ***** On Serpents' Wings *****
    {
      id: 'Zadnor Serpents Turbine',
      netRegex: NetRegexes.startsUsing({ source: 'Stormborne Zirnitra', id: '5E54' }),
      condition: (data) => data.ce === 'serpents',
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 5,
      response: Responses.knockback(),
    },
    {
      id: 'Zadnor Serpents 74 Degrees You',
      netRegex: NetRegexes.startsUsing({ source: 'Waveborne Zirnitra', id: '5E56' }),
      condition: (data) => data.ce === 'serpents',
      preRun: (data, matches) => {
        data.serpentsDonut = data.serpentsDonut || [];
        data.serpentsDonut.push(matches.target);
      },
      alarmText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.text();
      },
      outputStrings: {
        text: {
          en: 'Stack Your Donut',
        },
      },
    },
    {
      id: 'Zadnor Serpents 74 Degrees Not You',
      netRegex: NetRegexes.startsUsing({ source: 'Waveborne Zirnitra', id: '5E56', capture: false }),
      condition: (data) => data.ce === 'serpents',
      delaySeconds: 0.5,
      suppressSeconds: 1,
      infoText: (data, _matches, output) => {
        if (!data.serpentsDonut.includes(data.me))
          return output.getTogether();
      },
      outputStrings: {
        getTogether: Outputs.getTogether,
      },
    },
    {
      id: 'Zadnor Serpents Flaming Cyclone',
      netRegex: NetRegexes.startsUsing({ source: 'Flamreborne Zirnitra', id: '5E57', capture: false }),
      condition: (data) => data.ce === 'serpents',
      suppressSeconds: 10,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get knocked into first circles',
        },
      },
    },
    // ***** Feeling the Burn *****
    // ***** The Broken Blade *****
    // ***** From Beyond the Grave *****
    {
      id: 'Zadnor Grave Soul Purge Out First',
      netRegex: NetRegexes.startsUsing({ source: '4th-Make Shemhazai', id: '5E23', capture: false }),
      condition: (data) => data.ce === 'grave',
      durationSeconds: 7,
      suppressSeconds: 10,
      response: Responses.getOutThenIn(),
    },
    {
      id: 'Zadnor Grave Soul Purge In First',
      netRegex: NetRegexes.startsUsing({ source: '4th-Make Shemhazai', id: '5E25', capture: false }),
      condition: (data) => data.ce === 'grave',
      durationSeconds: 7,
      suppressSeconds: 10,
      response: Responses.getOutThenIn(),
    },
    {
      id: 'Zadnor Grave Devour Soul',
      netRegex: NetRegexes.startsUsing({ source: '4th-Make Shemhazai', id: '5E20' }),
      condition: tankBusterOnParty(ceIds.grave),
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
      suppressSeconds: 10,
      response: Responses.killAdds(),
    },
    {
      id: 'Zadnor Grave Forced March',
      // 871 = Forward March
      // 872 = About Face
      // 873 = Left Face
      // 874 = Right Face
      netRegex: NetRegexes.gainsEffect({ source: '4th-Make Shemhazai', effectId: ['871', '872', '873', '874'] }),
      condition: (data) => data.ce === 'grave',
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
      condition: tankBusterOnParty(ceIds.diremite),
      response: Responses.tankBuster(),
    },
    {
      id: 'Zadnor Diremite Shardstrike',
      netRegex: NetRegexes.startsUsing({ source: 'Hedetet', id: '5E17' }),
      condition: (data, matches) => data.ce === 'diremite' && data.me === matches.target,
      response: Responses.spread(),
    },
    {
      id: 'Zadnor Diremite Hailfire',
      netRegex: NetRegexes.headMarker({ id: limitCutHeadmarkers }),
      condition: (data, matches) => data.ce === 'diremite' && data.me === matches.target,
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
      id: 'Zadnor Cavalry Raw Steel',
      netRegex: NetRegexes.startsUsing({ source: 'Clibanarius', id: '5D87' }),
      condition: (data) => data.ce === 'cavalry',
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          avoidCharge: {
            en: 'Avoid Charge',
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
          en: 'Out of Front',
        },
      },
    },
    {
      id: 'Zadnor Blood Camisado',
      netRegex: NetRegexes.startsUsing({ source: 'Hanbi', id: '5BAE' }),
      condition: tankBusterOnParty(ceIds.blood),
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
      response: Responses.knockback(),
    },
    {
      id: 'Zadnor Wolf Lunar Cry',
      netRegex: NetRegexes.startsUsing({ source: 'Hrodvitnir', id: '5C24', capture: false }),
      condition: (data) => data.ce === 'wolf',
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Hide Behind Pillar',
        },
      },
    },
    // ***** Time To Burn *****
    // fire4: aoe
    // fire: tankbuster
    // time eruption: stand on slow clock (with pause time /s tart time)
    // time bomb: if 2, if bombs are e/w go n/s, and vice versa
    //            if 3, uhh
    // reproduce: avoid clone dashes
    // ***** Lean, Mean, Magitek Machines *****
    // ***** Worn to a Shadow *****
    {
      id: 'Zadnor Shadow Bladed Beak',
      // Not a cleave.
      netRegex: NetRegexes.startsUsing({ source: 'Alkonost', id: '5E3B' }),
      condition: tankBusterOnParty(ceIds.shadow),
      response: Responses.tankBuster(),
    },
    {
      id: 'Zadnor Shadow Nihility\'s Song',
      netRegex: NetRegexes.startsUsing({ source: 'Alkonost', id: '5E3C', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Zadnor Shadow Stormcall',
      netRegex: NetRegexes.startsUsing({ source: 'Alkonost', id: '5E39', capture: false }),
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
      delaySeconds: 15,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Away From Orb',
        },
      },
    },
    // ***** A Familiar Face *****
    // ***** Looks to Die For *****
    // ***** Taking the Lyon's Share *****
    // ***** The Dalriada *****
    // sartavoir
    //   time erupt
    //   reverse time erupt
    //   towers?
    //   burn aoes
    //   stack for X
    //   left right brand
    //   tank buster
    //   phoenix
    // blackburn
    //   magitek rays = aoe
    //   point opening at undodgeable line / dodge other line
    // augur
    //   stack for water donuts
    //   pyroplexy towers
    // alkonost/carrion crow
    //   knockback + shadow ce stormcall
    // cuchulain
    //   purified soul aoe
    //   might of malice tankbuster
    //   forced march avoid puddles
    //   fleshy necromance, jump in puddle
    //   ambient pulsation, titan line bombs
    //   fell slow earthshakers
    // hallway
    //   right/left lasers
    // saunion
    //   high-powered magitek ray tankbuster
    //   magitek halo get under
    //   crossray intercards
    //   stack marker
    //   all the dawon junk remixed
    // diablo armament
    //   advanced deathray tankbuster
    //   aetherochemical laser middle -> sides OR sides -> middle
    //   bouncing symbol lasers @_@
    //   psuedoterror get under
    //   aetherochemical boom pop balloons
    //   double aetherochemical lasers
    //   acceleration bombs
  ],
};
