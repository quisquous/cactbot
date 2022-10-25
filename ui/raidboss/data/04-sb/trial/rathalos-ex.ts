import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

// Note: no warning for Roar (2CC3, 285D).

// Rathalos Extreme
const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheGreatHuntExtreme,
  // Mechanics are random, no timeline is possible.
  hasNoTimeline: true,
  triggers: [
    {
      // Frontal conal + tail swipe on left side.
      // The front conal is 90 degrees, facing front.  The tail swipe starts from direct left
      // and goes counter-clockwise to (?) back right.  This means that the right flank is
      // entirely safe, but the left flank has only a 1/8 pie slice of safety.  For consistency,
      // call this out as "right flank" as "right or front left" is hard to parse.
      id: 'RathEx Mangle Phase 1',
      type: 'StartsUsing',
      netRegex: { id: '2853', source: 'Rathalos', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Right Flank (or out)',
          de: 'Rechte Flanke (oder raus gehen)',
          fr: 'Flanc droit (ou extérieur)',
          cn: '右侧 (或远离)',
          ko: '오른쪽 (혹은 멀리 가기)',
        },
      },
    },
    {
      id: 'RathEx Mangle Phase 2',
      type: 'StartsUsing',
      netRegex: { id: '2863', source: 'Rathalos', capture: false },
      response: Responses.awayFromFront('info'),
    },
    {
      // Tail swipe on the right side (and then 180 flip, repeat).
      id: 'RathEx Tail Swing',
      type: 'Ability',
      // No starts using for this.
      netRegex: { id: '2855', source: 'Rathalos', capture: false },
      // This hits multiple people.
      suppressSeconds: 1,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          // TODO: we could be fancier and say "Run through" or something for #2.
          en: 'Left Flank (or out)',
          de: 'Linke Flanke (oder raus gehen)',
          fr: 'Suivez le flanc gauche (ou extérieur)',
          cn: '左侧 (或远离)',
          ko: '왼쪽 (혹은 멀리가기)',
        },
      },
    },
    {
      id: 'RathEx Flaming Recoil',
      type: 'StartsUsing',
      netRegex: { id: ['2859', '285B'], source: 'Rathalos', capture: false },
      // This can one-shot, so alarm.
      // It seems to be 180 degrees in front, so "Get Behind" rather than "Away From Front".
      response: Responses.getBehind('alarm'),
    },
    {
      id: 'RathEx Rush',
      type: 'StartsUsing',
      netRegex: { id: ['2856', '2861'], source: 'Rathalos', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          // For ranged players, Rush is different than Flaming Recoil because they may have to move.
          en: 'Avoid Charge',
          de: 'Weiche dem Ansturm aus',
          fr: 'Évitez la charge',
          cn: '避开冲锋',
          ko: '돌진 피하기',
        },
      },
    },
    {
      id: 'RathEx Adds',
      type: 'AddedCombatant',
      netRegex: NetRegexes.addedCombatant({ name: 'Steppe Sheep', capture: false }),
      suppressSeconds: 5,
      response: Responses.killAdds(),
    },
    {
      id: 'RathEx Garula Add',
      type: 'AddedCombatant',
      netRegex: NetRegexes.addedCombatantFull({ npcNameId: '6173', capture: false }),
      // Garula stuns and then puts down the telegraph from the east.
      // We could be like "go somewhere other than east", but "go west" is clearer.
      response: Responses.goWest(),
    },
    {
      id: 'RathEx Garula Targetable',
      type: 'AddedCombatant',
      netRegex: NetRegexes.addedCombatantFull({ npcNameId: '6173', capture: false }),
      delaySeconds: 15,
      // This is obnoxious to have as an alarm, but it will cause a wipe if nobody does this.
      alarmText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Use Foothold for QTE',
          de: 'Benutze Standbein für QTE',
          fr: 'Utilisez le point d\'appui',
          cn: '上龙背QTE',
          ko: '등에 올라타기',
        },
      },
    },
    {
      id: 'RathEx Fire Breath',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0081' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      // First fireball.
      id: 'RathEx Fireball Initial',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '005D' }),
      response: Responses.stackMarkerOn(),
    },
    {
      // Second and third fireball.
      id: 'RathEx Fireball',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: ['0084'] }),
      response: Responses.stackMarkerOn('info'),
    },
    {
      id: 'RathEx Sweeping Flames',
      type: 'Ability',
      // No starts using for this.
      netRegex: { id: '2862', source: 'Rathalos', capture: false },
      // This hits multiple people.
      suppressSeconds: 1,
      response: Responses.awayFromFront('info'),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Rathalos': 'Rathalos',
        'Steppe Sheep': 'Steppenschaf',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Rathalos': 'Rathalos',
        'Steppe Sheep': 'mouton de la steppe',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Rathalos': 'リオレウス',
        'Steppe Sheep': 'ステップ・シープ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Rathalos': '火龙',
        'Steppe Sheep': '草原绵羊',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Rathalos': '리오레우스',
        'Steppe Sheep': '초원 양',
      },
    },
  ],
};

export default triggerSet;
