import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

// TODO:
// Ancient Flare is probably 6FB6?, Pyretic debuff effect is ?
// Whispered Incantation + Whispers Manifest
// Handle Mirrored Incantation + Interments

const triggerSet: TriggerSet<Data> = {
  zoneId: [
    ZoneId.Labyrinthos,
    ZoneId.Thavnair,
    ZoneId.Garlemald,
    ZoneId.MareLamentorum,
    ZoneId.Elpis,
    ZoneId.UltimaThule,
  ],
  zoneLabel: {
    en: 'SS Rank Hunts',
    de: 'SS Jagdziele',
    ja: 'SSモブ',
    cn: 'SS 级狩猎怪',
    ko: 'SS급 마물',
  },
  triggers: [
    {
      id: 'Hunt Ker Heliovoid',
      type: 'StartsUsing',
      netRegex: { id: '6BF4', source: 'Ker', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.outOfMelee(),
    },
    {
      id: 'Hunt Ker Ancient Blizzard III',
      type: 'StartsUsing',
      netRegex: { id: '6BF5', source: 'Ker', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getUnder(),
    },
    {
      id: 'Hunt Ker Eternal Damnation',
      type: 'StartsUsing',
      netRegex: { id: '6BFF', source: 'Ker', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.lookAway(),
    },
    {
      id: 'Hunt Ker Ancient Holy',
      type: 'StartsUsing',
      netRegex: { id: '6BFE', source: 'Ker', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getOut(),
    },
    {
      id: 'Hunt Ker Fore Interment',
      type: 'StartsUsing',
      netRegex: { id: '6BF9', source: 'Ker', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getBehind(),
    },
    {
      id: 'Hunt Ker Rear Interment',
      type: 'StartsUsing',
      netRegex: { id: '6BFA', source: 'Ker', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.goFront(),
    },
    {
      id: 'Hunt Ker Right Interment',
      type: 'StartsUsing',
      netRegex: { id: '6BFB', source: 'Ker', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.goLeft(),
    },
    {
      id: 'Hunt Ker Left Interment',
      type: 'StartsUsing',
      netRegex: { id: '6BFC', source: 'Ker', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.goRight(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Ker': 'Ker',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Ker': 'Kèr',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Ker': 'ケール',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Ker': '克尔',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Ker': '케르',
      },
    },
  ],
};

export default triggerSet;
