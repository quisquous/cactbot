import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';

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
    // ***** Feeling the Burn *****
    // ***** The Broken Blade *****
    // ***** From Beyond the Grave *****
    // ***** With Diremite and Main *****
    // ***** Here Comes the Cavalry *****
    // ***** Head of the Snake *****
    // ***** There Would Be Blood *****
    // ***** Time To Burn *****
    // ***** Lean, Mean, Magitek Machines *****
    // ***** Worn to a Shadow *****
    // ***** A Familiar Face *****
    // ***** Looks to Die For *****
    // ***** Taking the Lyon's Share *****
    // ***** The Dalriada *****
  ],
};
