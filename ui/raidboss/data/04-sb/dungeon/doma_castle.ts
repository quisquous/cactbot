import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  seenTowers?: boolean;
}

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.DomaCastle,
  timelineFile: 'doma_castle.txt',
  triggers: [
    {
      id: 'Doma Castle Magitek Hexadrone 2-Tonze Magitek Missile',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Doma Castle Magitek Hexadrone Magitek Missiles',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Magitek Hexadrone', id: '20A4', capture: false }),
      infoText: (data, _matches, output) => {
        return data.seenTowers ? output.getTowers!() : output.getTower!();
      },
      run: (data) => data.seenTowers = true,
      outputStrings: {
        getTower: {
          en: 'Get Tower',
          de: 'Türme nehmen', // FIXME
          fr: 'Prenez les tours', // FIXME
          ja: '塔を踏む', // FIXME
          cn: '踩塔', // FIXME
          ko: '장판 하나씩 들어가기', // FIXME
        },
        getTowers: {
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
      id: 'Doma Castle Hypertuned Grynewaht Delay-Action Charge',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0063' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Doma Castle Hypertuned Grynewaht Thermobaric Charge',
      type: 'GainsEffect',
      // There's no 0x1B line or 0x14/0x15 target for this prox marker, only the Prey debuff.
      netRegex: NetRegexes.gainsEffect({ effectId: '4E5' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Drop Charge Away',
        },
      },
    },
  ],
};

export default triggerSet;
