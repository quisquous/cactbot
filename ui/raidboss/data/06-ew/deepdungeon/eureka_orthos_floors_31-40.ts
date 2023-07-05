import Conditions from '../../../../../resources/conditions';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// Eureka Orthos Floors 31-40

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  id: 'EurekaOrthosFloors31_40',
  zoneId: ZoneId.EurekaOrthosFloors31_40,

  triggers: [
    // ---------------- Floor 31-39 Mobs ----------------
    {
      id: 'EO 31-40 Orthos Mirrorknight Double Hex Eye',
      type: 'StartsUsing',
      netRegex: { id: '7EB5', source: 'Orthos Mirrorknight', capture: false },
      response: Responses.lookAway('alert'),
    },
    {
      id: 'EO 31-40 Orthospider Particle Collision',
      type: 'StartsUsing',
      netRegex: { id: '7F25', source: 'Orthospider', capture: false },
      response: Responses.outOfMelee('alert'),
    },
    {
      id: 'EO 31-40 Orthonaga Cursed Gaze',
      type: 'StartsUsing',
      netRegex: { id: '7EC0', source: 'Orthonaga', capture: false },
      response: Responses.awayFromFront(),
    },
    {
      id: 'EO 31-40 Orthotaur 111-tonze Swing',
      type: 'StartsUsing',
      netRegex: { id: '7EB8', source: 'Orthotaur', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'EO 31-40 Orthotaur 11-tonze Swipe',
      type: 'StartsUsing',
      netRegex: { id: '7EB7', source: 'Orthotaur', capture: false },
      response: Responses.awayFromFront(),
    },
    {
      id: 'EO 31-40 Phantom Orthoray Forearming',
      type: 'StartsUsing',
      netRegex: { id: '8193', source: 'Phantom Orthoray', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'EO 31-40 Phantom Orthoray Atmospheric Displacement',
      type: 'StartsUsing',
      netRegex: { id: '7EB4', source: 'Phantom Orthoray', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'EO 31-40 Orthochimera the Ram\'s Voice',
      type: 'StartsUsing',
      netRegex: { id: '7EBB', source: 'Orthochimera', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'EO 31-40 Orthochimera the Dragon\'s Voice',
      type: 'StartsUsing',
      netRegex: { id: '7EBC', source: 'Orthochimera', capture: false },
      response: Responses.getUnder('alert'),
    },
    {
      id: 'EO 31-40 Orthoempuse Kneeling Snath',
      type: 'StartsUsing',
      netRegex: { id: '7EC1', source: 'Orthoempuse' },
      condition: Conditions.targetIsYou(),
      response: Responses.knockback(),
    },
    // ---------------- Floor 40 Boss: Twintania Clone ----------------
    {
      id: 'EO 31-40 Twintania Clone Twister',
      type: 'StartsUsing',
      netRegex: { id: '7AEC', source: 'Twintania\'s Clone' },
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 1,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Twisters',
          de: 'Wirbelstürme',
          fr: 'Tornades',
          ja: '大竜巻',
          cn: '旋风',
          ko: '회오리',
        },
      },
    },
    {
      id: 'EO 31-40 Twintania Clone Twisting Dive Divebomb',
      type: 'StartsUsing',
      netRegex: { id: '7AEF', source: 'Twintania\'s Clone', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'DIVEBOMB',
          de: 'STURZBOMBE',
          fr: 'BOMBE PLONGEANTE',
          ja: 'ダイブボム',
          cn: '俯冲',
          ko: '급강하',
        },
      },
    },
    {
      id: 'EO 31-40 Twintania Clone Twisting Dive Twisters',
      type: 'Ability',
      netRegex: { id: '7AEF', source: 'Twintania\'s Clone', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Twisters',
          de: 'Wirbelstürme',
          fr: 'Tornades',
          ja: 'ツイスター',
          cn: '旋风',
          ko: '회오리',
        },
      },
    },
    {
      id: 'EO 31-40 Twintania Clone Turbine',
      type: 'StartsUsing',
      netRegex: { id: '7AEB', source: 'Twintania\'s Clone', capture: false },
      response: Responses.knockback(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Orthochimera': 'Orthochimära',
        'Orthoempuse': 'Orthos-Empusa',
        'Orthonaga': 'Orthos-Naga',
        'Orthos Mirrorknight': 'Orthos-Speglidae',
        'Orthospider': 'Orthos-Spinne',
        'Orthotaur': 'Orthotaurus',
        'Phantom Orthoray': 'Orthos-Phantomschimmer',
        'Twintania\'s Clone': 'Twintania-Klon',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Orthochimera': 'chimère Orthos',
        'Orthoempuse': 'empousa Orthos',
        'Orthonaga': 'naga Orthos',
        'Orthos Mirrorknight': 'chevalier miroir Orthos',
        'Orthospider': 'araignée Orthos',
        'Orthotaur': 'minotaure Orthos',
        'Phantom Orthoray': 'rayon fantomatique Orthos',
        'Twintania\'s Clone': 'clone de Gémellia',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Orthochimera': 'オルト・キマイラ',
        'Orthoempuse': 'オルト・エンプーサ',
        'Orthonaga': 'オルト・ナーガ',
        'Orthos Mirrorknight': 'オルト・ミラーナイト',
        'Orthospider': 'オルト・スパイダー',
        'Orthotaur': 'オルト・ミノタウロス',
        'Phantom Orthoray': 'オルト・ファントムレイ',
        'Twintania\'s Clone': 'ツインタニア・クローン',
      },
    },
  ],
};

export default triggerSet;
