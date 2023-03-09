import Conditions from '../../../../../resources/conditions';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// Eureka Orthos Floors 41-50

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.EurekaOrthosFloors41_50,

  triggers: [
    // ---------------- Floor 41-49 Mobs ----------------
    {
      id: 'EO 41-50 Orthos Bergthurs Elbow Drop',
      type: 'StartsUsing',
      netRegex: { id: '8198', source: 'Orthos Bergthurs', capture: false },
      response: Responses.goFront(),
    },
    {
      id: 'EO 41-50 Orthos Acheron Quake',
      type: 'StartsUsing',
      netRegex: { id: '7ED6', source: 'Orthos Acheron' },
      response: Responses.interruptIfPossible(),
    },
    {
      id: 'EO 41-50 Orthos Kelpie Bloody Puddle',
      type: 'StartsUsing',
      netRegex: { id: '7ECC', source: 'Orthos Kelpie', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'EO 41-50 Orthos Goobbue Sickly Sneeze',
      // Inhale (819A) draws in, Sickly Sneeze (7ED9) is quick front cone after
      type: 'StartsUsing',
      netRegex: { id: '819A', source: 'Orthos Goobbue', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'EO 41-50 Orthos Gelato Explosion',
      type: 'StartsUsing',
      netRegex: { id: '7EC4', source: 'Orthos Gelato', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'EO 41-50 Orthos Hoarhound Abyssal Cry',
      // roomwide stun, follow-up one-shot attack on stunned players; can break line-of-sight to avoid
      type: 'StartsUsing',
      netRegex: { id: '7ED3', source: 'Orthos Hoarhound', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Break Line-of-Sight',
        },
      },
    },
    // ---------------- Floor 50 Boss: Servomechanical Chimera 14X ----------------
    {
      id: 'EO 41-50 Servomechanical Chimera 14X Leftbreathed Thunder',
      type: 'StartsUsing',
      netRegex: { id: '7C75', source: 'Servomechanical Chimera 14X', capture: false },
      response: Responses.goRight(),
    },
    {
      id: 'EO 41-50 Servomechanical Chimera 14X Rightbreathed Cold',
      type: 'StartsUsing',
      netRegex: { id: '7C77', source: 'Servomechanical Chimera 14X', capture: false },
      response: Responses.goLeft(),
    },
    {
      id: 'EO 41-50 Servomechanical Chimera 14X Songs of Ice and Thunder',
      type: 'StartsUsing',
      netRegex: { id: '7C6B', source: 'Servomechanical Chimera 14X', capture: false },
      response: Responses.getOutThenIn(),
    },
    {
      id: 'EO 41-50 Servomechanical Chimera 14X Songs of Thunder and Ice',
      type: 'StartsUsing',
      netRegex: { id: '7C6C', source: 'Servomechanical Chimera 14X', capture: false },
      response: Responses.getInThenOut(),
    },
    {
      id: 'EO 41-50 Servomechanical Chimera 14X Tether',
      type: 'Tether',
      netRegex: { id: '0039', source: 'Servomechanical Chimera 14X' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Run Away From Boss',
          de: 'Renn weg vom Boss',
          fr: 'Courez loin du boss',
          ja: 'ボスから離れる',
          cn: '远离Boss',
          ko: '보스와 거리 벌리기',
        },
      },
    },
    {
      id: 'EO 41-50 Servomechanical Chimera 14X Cold Thunder',
      type: 'StartsUsing',
      netRegex: { id: '7C6F', source: 'Servomechanical Chimera 14X', capture: false },
      delaySeconds: 2,
      response: Responses.getOutThenIn(),
    },
    {
      id: 'EO 41-50 Servomechanical Chimera 14X Thunderous Cold',
      type: 'StartsUsing',
      netRegex: { id: '7C70', source: 'Servomechanical Chimera 14X', capture: false },
      delaySeconds: 2,
      response: Responses.getInThenOut(),
    },
    {
      id: 'EO 41-50 Servomechanical Chimera 14X Cacophony',
      type: 'Tether',
      netRegex: { source: 'Cacophony', id: '0011' },
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Orb on YOU',
          de: 'Orb auf DIR',
          fr: 'Orbe sur VOUS',
          ja: '自分に玉',
          cn: '球点名',
          ko: '구슬 대상자',
        },
      },
    },
  ],
};

export default triggerSet;
