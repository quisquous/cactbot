import { defineTriggerSet } from '../../../../../resources/api_define_trigger_set';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';

// TODO:
// Ancient Flare is probably 6FB6?, Pyretic debuff effect is ?
// Whispered Incantation + Whispers Manifest
// Handle Mirrored Incantation + Interments

export default defineTriggerSet({
  zoneId: [
    ZoneId.Labyrinthos,
    ZoneId.Thavnair,
    ZoneId.Garlemald,
    ZoneId.MareLamentorum,
    ZoneId.Elpis,
    ZoneId.UltimaThule,
  ],
  triggers: [
    {
      id: 'Hunt Ker Heliovoid',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6BF4', source: 'Ker', capture: false }),
      condition: (data) => data.inCombat,
      response: Responses.outOfMelee(),
    },
    {
      id: 'Hunt Ker Ancient Blizzard III',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6BF5', source: 'Ker', capture: false }),
      condition: (data) => data.inCombat,
      response: Responses.getUnder(),
    },
    {
      id: 'Hunt Ker Eternal Damnation',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6BFF', source: 'Ker', capture: false }),
      condition: (data) => data.inCombat,
      response: Responses.lookAway(),
    },
    {
      id: 'Hunt Ker Ancient Holy',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6BFE', source: 'Ker', capture: false }),
      condition: (data) => data.inCombat,
      response: Responses.getOut(),
    },
    {
      id: 'Hunt Ker Fore Interment',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6BF9', source: 'Ker', capture: false }),
      condition: (data) => data.inCombat,
      response: Responses.getBehind(),
    },
    {
      id: 'Hunt Ker Rear Interment',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6BFA', source: 'Ker', capture: false }),
      condition: (data) => data.inCombat,
      response: Responses.goFront(),
    },
    {
      id: 'Hunt Ker Right Interment',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6BFB', source: 'Ker', capture: false }),
      condition: (data) => data.inCombat,
      response: Responses.goRight(),
    },
    {
      id: 'Hunt Ker Left Interment',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6BFC', source: 'Ker', capture: false }),
      condition: (data) => data.inCombat,
      response: Responses.goRight(),
    },
  ],
});
