import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.Labyrinthos,
  triggers: [
    {
      id: 'Hunt Hulder Lay of Mislaid Memory',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '69C1', source: 'Hulder', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '69C1', source: 'Hulder', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '69C1', source: 'Huldre', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '69C1', source: 'フルドラ', capture: false }),
      response: Responses.awayFromFront('info'),
    },
    {
      id: 'Hunt Hulder Tempestuous Wrath',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '69C3', source: 'Hulder', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '69C3', source: 'Hulder', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '69C3', source: 'Huldre', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '69C3', source: 'フルドラ', capture: false }),
      infoText: (_data, _matches, output) => output.followCharge!(),
      outputStrings: {
        followCharge: {
          en: 'Follow charge',
          de: 'Folge dem Ansturm',
          fr: 'Suivez la charge',
        },
      },
    },
    {
      id: 'Hunt Hulder Rotting Elegy',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '69C4', source: 'Hulder', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '69C4', source: 'Hulder', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '69C4', source: 'Huldre', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '69C4', source: 'フルドラ', capture: false }),
      response: Responses.getUnder('alert'),
    },
    {
      id: 'Hunt Hulder Storm of Color',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '69C6', source: 'Hulder' }),
      netRegexDe: NetRegexes.startsUsing({ id: '69C6', source: 'Hulder' }),
      netRegexFr: NetRegexes.startsUsing({ id: '69C6', source: 'Huldre' }),
      netRegexJa: NetRegexes.startsUsing({ id: '69C6', source: 'フルドラ' }),
      // Maybe just buster??
      response: Responses.tankCleave('alert'),
    },
    {
      id: 'Hunt Hulder Ode to Lost Love',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '69C5', source: 'Hulder', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '69C5', source: 'Hulder', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '69C5', source: 'Huldre', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '69C5', source: 'フルドラ', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Hunt Storsie Fang\'s End',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6AE1', source: 'Storsie' }),
      netRegexDe: NetRegexes.startsUsing({ id: '6AE1', source: 'Storsie' }),
      netRegexFr: NetRegexes.startsUsing({ id: '6AE1', source: 'Storsie' }),
      netRegexJa: NetRegexes.startsUsing({ id: '6AE1', source: 'ストーシー' }),
      // Not a cleave.
      response: Responses.tankBuster('info'),
    },
    {
      id: 'Hunt Storsie Earth Aspect',
      type: 'Ability',
      // Before Earth Auger (6AE0).
      netRegex: NetRegexes.ability({ id: '6ADA', source: 'Storsie', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '6ADA', source: 'Storsie', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '6ADA', source: 'Storsie', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '6ADA', source: 'ストーシー', capture: false }),
      response: Responses.getBehind(),
    },
    {
      id: 'Hunt Storsie Wind Aspect',
      type: 'Ability',
      // Before Whorlstorm (6ADE).
      netRegex: NetRegexes.ability({ id: '6ADB', source: 'Storsie', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '6ADB', source: 'Storsie', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '6ADB', source: 'Storsie', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '6ADB', source: 'ストーシー', capture: false }),
      response: Responses.getIn(),
    },
    {
      id: 'Hunt Storsie Lightning Aspect',
      type: 'Ability',
      // Before Defibrillate (6ADF).
      netRegex: NetRegexes.ability({ id: '6ADC', source: 'Storsie', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '6ADC', source: 'Storsie', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '6ADC', source: 'Storsie', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '6ADC', source: 'ストーシー', capture: false }),
      alarmText: (_data, _matches, output) => output.getWayOut!(),
      outputStrings: {
        getWayOut: {
          en: 'GTFO',
          de: 'Geh raus',
          fr: 'Partez',
        },
      },
    },
  ],
};

export default triggerSet;
