import Conditions from '../../../../../resources/conditions.js';
import NetRegexes from '../../../../../resources/netregexes.js';
import { Responses } from '../../../../../resources/responses.js';
import ZoneId from '../../../../../resources/zone_id.js';

export default {
  zoneId: ZoneId.TheSwallowsCompass,
  timelineFile: 'swallows_compass.txt',
  triggers: [
    {
      id: 'Swallows Compass Tengu Clout',
      netRegex: NetRegexes.startsUsing({ id: '2B95', source: 'Otengu', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Swallows Compass Tengu Might',
      netRegex: NetRegexes.startsUsing({ id: '2B94', source: 'Otengu' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'Swallows Compass Tengu Wile',
      netRegex: NetRegexes.startsUsing({ id: '2B97', source: 'Otengu', capture: false }),
      response: Responses.lookAway(),
    },
    {
      // 7201 is Tengu Ember.
      id: 'Swallows Compass Ember Spawn',
      netRegex: NetRegexes.addedCombatantFull({ npcNameId: '7201', capture: false }),
      suppressSeconds: 5,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Avoid Fire Orbs',
        },
      },
    },
    {
      id: 'Swallows Compass Flames Of Hate',
      netRegex: NetRegexes.startsUsing({ id: '2898', source: 'Tengu Ember', capture: false }),
      suppressSeconds: 5,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Away From Fireballs',
        },
      },
    },
    {
      id: 'Swallows Compass Right Palm',
      netRegex: NetRegexes.startsUsing({ id: '2B9D', source: 'Daidarabotchi', capture: false }),
      response: Responses.goLeft(),
    },
    {
      id: 'Swallows Compass Left Palm',
      netRegex: NetRegexes.startsUsing({ id: '2B9E', source: 'Daidarabotchi', capture: false }),
      response: Responses.goRight(),
    },
    {
      id: 'Swallows Compass Mountain Falls',
      netRegex: NetRegexes.headMarker({ id: '0087' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Swallows Compass Mirage',
      netRegex: NetRegexes.headMarker({ id: '0001' }),
      condition: Conditions.targetIsYou(),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: '5x Puddles on YOU',
        },
      },
    },
    {
      id: 'Swallows Compass Mythmaker',
      netRegex: NetRegexes.ability({ id: '2BA3', source: 'Daidarabotchi', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Swallows Compass Six Fulms Under',
      netRegex: NetRegexes.gainsEffect({ effectId: '237' }),
      condition: Conditions.targetIsYou(),
      suppressSeconds: 2, // If the user stays in, they will get more reminders.
      alarmText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'OUT OF THE LAKE',
        },
      },
    },
    {
      id: 'Swallows Compass Short End',
      netRegex: NetRegexes.startsUsing({ id: ['2BA6', '2D07'], source: ['Qitian Dasheng', 'Shadow Of The Sage'] }),
      condition: Conditions.caresAboutPhysical(),
      suppressSeconds: 5,
      response: Responses.tankBuster(),
    },
    {
      id: 'Swallows Compass Mount Huaguo',
      netRegex: NetRegexes.startsUsing({ id: ['2BAA', '2D08'], source: ['Qitian Dasheng', 'Shadow Of The Sage'], capture: false }),
      condition: Conditions.caresAboutAOE(),
      suppressSeconds: 5,
      response: Responses.aoe(),
    },
    {
      // Both Ends has a number of different possibilities for how it's used.
      // It can be alone, or it can be accompanied by the other form,
      // or it can be alongside Five-Fingered Punishment.
      // If there's a blue one on the field, we want to be in, no matter what.
      // If there's no blue, we want to be away from red.
      // In order to avoid collisions and confusion, we collect first.
      id: 'Swallows Compass Both Ends Collect',
      netRegex: NetRegexes.startsUsing({ id: ['2BA9', '2BAF'], source: ['Qitian Dasheng', 'Shadow Of The Sage'], capture: false }),
      run: (data) => data.dynamo = true,
    },
    {
      // 2BA8,2BAE is red, chariot, 2BA9,2BAF is blue, dynamo.
      id: 'Swallows Compass Both Ends Call',
      netRegex: NetRegexes.startsUsing({ id: ['2BA8', '2BA9', '2BAE', '2BAF'], source: ['Qitian Dasheng', 'Shadow Of The Sage'], capture: false }),
      delaySeconds: 0.5,
      suppressSeconds: 5,
      alertText: (data, _, output) => {
        if (data.dynamo)
          return output.dynamo();
        return output.chariot();
      },
      outputStrings: {
        dynamo: {
          en: 'Close to blue staff',
        },
        chariot: {
          en: 'Away from red staff',
        },
      },
      run: (data) => delete data.dynamo,
    },
    {
      id: 'Swallows Compass Five Fingered Punishment',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      response: Responses.stackMarkerOn('info'), // Info rather than alert to avoid collision with Both Ends.
    },
    {
      // The Long end is a knockback in phase 1, but not in phase 2.
      // Using the source name for tethers runs into localizing issues,
      // so we just track the phase instead.
      // The ability use here is unnamed, the teleport to the center to begin the intermission.
      id: 'Swallows Compass Intermission Tracking',
      netRegex: NetRegexes.ability({ id: '2CC7', source: 'Qitian Dasheng', capture: false }),
      run: (data) => data.seenIntermission = true,
    },
    {
      // Either one or two tethers can be present for Long End.
      // We have to handle both possibilities, so we collect targets first for later analysis.
      id: 'Swallows Compass Long End Collect',
      netRegex: NetRegexes.tether({ id: '0029' }),
      run: (data, matches) => {
        data.tethers = data.tethers || [];
        data.tethers.push(matches.target);
      },
    },
    {
      id: 'Swallows Compass Long End Call',
      netRegex: NetRegexes.tether({ id: '0029', capture: false }),
      delaySeconds: 0.5,
      alertText: (data, _, output) => {
        if (data.tethers.includes(data.me)) {
          if (data.seenIntermission)
            return output.target();
          return output.knockback();
        }
        return output.avoid();
      },
      outputStrings: {
        target: {
          en: 'Laser on YOU',
        },
        knockback: {
          en: 'Knockback laser on YOU',
        },
        avoid: {
          en: 'Avoid tethers',
        },
      },
      run: (data) => delete data.tethers,
    },
  ],
};
