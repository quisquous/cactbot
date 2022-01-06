import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const flailDirections = {
  l: Outputs.left,
  r: Outputs.right,
  combo: {
    en: '${first} => ${second}',
    de: '${first} => ${second}',
    fr: '${first} => ${second}',
    ja: '${first} => ${second}',
    cn: '${first} => ${second}',
    ko: '${first} => ${second}',
  },
};

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.AsphodelosTheFirstCircleSavage,
  timelineFile: 'p1s.txt',
  timelineTriggers: [
    {
      id: 'P1S Tile Positions',
      regex: /(?:First|Second|Third) Element/,
      beforeSeconds: 3,
      infoText: (_data, _matches, output) => output.positions!(),
      outputStrings: {
        positions: {
          en: 'Tile Positions',
          fr: 'Position tuiles',
        },
      },
    },
  ],
  triggers: [
    {
      id: 'P1S Warder\'s Wrath',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '662A', source: 'Erichthonios', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '662A', source: 'Erichthonios', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '662A', source: 'Érichthonios', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '662A', source: 'エリクトニオス', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'P1S Shining Cells',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6616', source: 'Erichthonios', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6616', source: 'Erichthonios', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6616', source: 'Érichthonios', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6616', source: 'エリクトニオス', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'P1S Slam Shut',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6617', source: 'Erichthonios', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6617', source: 'Erichthonios', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6617', source: 'Érichthonios', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6617', source: 'エリクトニオス', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'P1S Gaoler\'s Flail Left => Right',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '65F6', source: 'Erichthonios', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '65F6', source: 'Erichthonios', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '65F6', source: 'Érichthonios', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '65F6', source: 'エリクトニオス', capture: false }),
      alertText: (_data, _matches, output) => output.combo!({ first: output.l!(), second: output.r!() }),
      outputStrings: flailDirections,
    },
    {
      id: 'P1S Gaoler\'s Flail Right => Left',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '65F7', source: 'Erichthonios', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '65F7', source: 'Erichthonios', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '65F7', source: 'Érichthonios', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '65F7', source: 'エリクトニオス', capture: false }),
      alertText: (_data, _matches, output) => output.combo!({ first: output.r!(), second: output.l!() }),
      outputStrings: flailDirections,
    },
    {
      id: 'P1S Gaoler\'s Flail Out => In',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['65F8', '65F9'], source: 'Erichthonios', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['65F8', '65F9'], source: 'Erichthonios', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['65F8', '65F9'], source: 'Érichthonios', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['65F8', '65F9'], source: 'エリクトニオス', capture: false }),
      alertText: (_data, _matches, output) => output.outThenIn!(),
      outputStrings: {
        outThenIn: Outputs.outThenIn,
      },
    },
    {
      id: 'P1S Gaoler\'s Flail In => Out',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['65FA', '65FB'], source: 'Erichthonios', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['65FA', '65FB'], source: 'Erichthonios', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['65FA', '65FB'], source: 'Érichthonios', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['65FA', '65FB'], source: 'エリクトニオス', capture: false }),
      alertText: (_data, _matches, output) => output.inThenOut!(),
      outputStrings: {
        inThenOut: Outputs.inThenOut,
      },
    },
    {
      id: 'P1S Heavy Hand',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6629', source: 'Erichthonios' }),
      netRegexDe: NetRegexes.startsUsing({ id: '6629', source: 'Erichthonios' }),
      netRegexFr: NetRegexes.startsUsing({ id: '6629', source: 'Érichthonios' }),
      netRegexJa: NetRegexes.startsUsing({ id: '6629', source: 'エリクトニオス' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'P1S Pitiless Flail of Grace',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '660E', source: 'Erichthonios', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '660E', source: 'Erichthonios', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '660E', source: 'Érichthonios', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '660E', source: 'エリクトニオス', capture: false }),
      alertText: (_data, _matches, output) => output.directions!(),
      outputStrings: {
        directions: {
          en: 'Tankbuster+Knockback => Stack',
          fr: 'Tank buster+Poussée => Packez-vous',
        },
      },
    },
    {
      id: 'P1S Pitiless Flail of Purgation',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '660F', source: 'Erichthonios', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '660F', source: 'Erichthonios', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '660F', source: 'Érichthonios', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '660F', source: 'エリクトニオス', capture: false }),
      alertText: (_data, _matches, output) => output.directions!(),
      outputStrings: {
        directions: {
          en: 'Tankbuster+Knockback => Flare',
          fr: 'Tank buster+Poussée => Brasier',
        },
      },
    },
    // Copy/paste from normal, seems to be the same
    {
      id: 'P1S Hot/Cold Spell',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['AB3', 'AB4'], capture: true }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, _output) => {
        return _matches.effectId === 'AB3' ? _output.red!() : _output.blue!();
      },
      outputStrings: {
        red: {
          en: 'Get hit by red',
          de: 'Von Rot treffen lassen',
          fr: 'Faites-vous toucher par le rouge',
          cn: '去吃火',
          ko: '빨간색 맞기',
        },
        blue: {
          en: 'Get hit by blue',
          de: 'Von Blau treffen lassen',
          fr: 'Faites-vous toucher par le bleu',
          cn: '去吃冰',
          ko: '파란색 맞기',
        },
      },
    },
    // Copy/paste from normal, seems to be the same
    {
      id: 'P1S Powerful Light/Fire',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '893', capture: true }),
      alertText: (_data, matches, _output) => {
        if (matches.count === '14C')
          return _output.light!();
        return _output.fire!();
      },
      outputStrings: {
        fire: {
          en: 'Stand on fire',
          de: 'Auf der Feuerfläche stehen',
          fr: 'Placez-vous sur le feu',
          cn: '站在火',
          ko: '빨간색 바닥 위에 서기',
        },
        light: {
          en: 'Stand on light',
          de: 'Auf der Lichtfläche stehen',
          fr: 'Placez-vous sur la lumière',
          cn: '站在光',
          ko: '흰색 바닥 위에 서기',
        },
      },
    },
  ],
};

export default triggerSet;
