import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// Note: To avoid too many alert-level triggers here, all of the "out of front"
// ones are info, under the assumption that you should never be in front.

export type Data = RaidbossData;

// Rathalos Extreme
const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheGreatHunt,
  triggers: [
    {
      // Frontal conal + tail swipe on left side.
      // The front conal is 90 degrees, facing front.  The tail swipe starts from direct left
      // and goes counter-clockwise to (?) back right.  This means that the right flank is
      // entirely safe, but the left flank has only a 1/8 pie slice of safety.  For consistency,
      // call this out as "right flank" as "right or front left" is hard to parse.
      id: 'Rathalos Mangle Phase 1',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Rathalos', id: '286A', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Right Flank (or out)',
        },
      },
    },
    {
      id: 'Rathalos Mangle Phase 2',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Rathalos', id: '287A', capture: false }),
      response: Responses.awayFromFront('info'),
    },
    {
      // Tail swipe on the right side (and then 180 flip, repeat).
      id: 'Rathalos Tail Swing',
      type: 'Ability',
      // No starts using for this, but this ability is 1.5s warning.
      netRegex: NetRegexes.ability({ source: 'Rathalos', id: '286C', capture: false }),
      // This hits multiple people.
      suppressSeconds: 1,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          // TODO: we could be fancier and say "Run through" or something for #2.
          en: 'Left Flank (or out)',
        },
      },
    },
    {
      id: 'Rathalos Flaming Recoil',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Rathalos', id: '2870', capture: false }),
      response: Responses.awayFromFront('info'),
    },
    {
      id: 'Rathalos Rush',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Rathalos', id: ['286D', '2878'], capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          // For ranged players, Rush is different than Flaming Recoil because they may have to move.
          en: 'Avoid Charge',
        },
      },
    },
    {
      id: 'Rathalos Garula Add',
      type: 'AddedCombatant',
      netRegex: NetRegexes.addedCombatantFull({ npcNameId: '6173', capture: false }),
      // Garula stuns and then puts down the telegraph from the east.
      // We could be like "go somewhere other than east", but "go west" is clearer.
      response: Responses.goWest(),
    },
    {
      id: 'Rathalos Garula Targetable',
      type: 'AddedCombatant',
      netRegex: NetRegexes.addedCombatantFull({ npcNameId: '6173', capture: false }),
      delaySeconds: 15,
      // This is obnoxious to have as an alarm, but it will cause a wipe if nobody does this.
      alarmText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Use Foothold for QTE',
        },
      },
    },
    {
      id: 'Rathalos Fire Breath',
      type: 'HeadMarker',
      // Corresponds with 28CE/2CBD ability.
      netRegex: NetRegexes.headMarker({ id: '0081' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Rathalos Fireball',
      type: 'HeadMarker',
      // Corresponds with 2876/2CBA ability.
      netRegex: NetRegexes.headMarker({ id: '005D' }),
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Rathalos Sweeping Flames',
      type: 'Ability',
      // No starts using for this, but this ability is 1.5s warning.
      netRegex: NetRegexes.ability({ source: 'Rathalos', id: '2879', capture: false }),
      // This hits multiple people.
      suppressSeconds: 1,
      response: Responses.awayFromFront('info'),
    },
  ],
};

export default triggerSet;
