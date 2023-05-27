import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  silkspitOnYou: boolean;
}

const bossNameUnicode = 'Pand\u00e6monium';

const triggerSet: TriggerSet<Data> = {
  id: 'AnabaseiosTheTenthCircle',
  zoneId: ZoneId.AnabaseiosTheTenthCircle,
  timelineFile: 'p10n.txt',
  initData: () => {
    return {
      silkspitOnYou: false,
    };
  },
  triggers: [
    {
      id: 'P10N Silkspit You',
      type: 'HeadMarker',
      netRegex: { id: '01CE' },
      condition: (data, matches) => data.me === matches.target,
      alertText: (data, _matches, output) => {
        data.silkspitOnYou = true;
        return output.text!();
      },
      outputStrings: {
        text: {
          en: 'Away from party and posts',
        },
      },
    },
    {
      id: 'P10N Silkspit Others',
      type: 'HeadMarker',
      netRegex: { id: '01CE' },
      delaySeconds: 0.2,
      suppressSeconds: 1,
      infoText: (data, _matches, output) => {
        if (data.silkspitOnYou === false)
          return output.text!();
      },
      outputStrings: {
        text: {
          en: 'Away from marked players',
        },
      },
    },
    {
      id: 'P10N Pandaemonic Pillars',
      type: 'StartsUsing',
      netRegex: { id: '825D', source: bossNameUnicode, capture: false },
      durationSeconds: 5,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Soak towers',
        },
      },
    },
    {
      id: 'P10N Imprisonment',
      type: 'StartsUsing',
      netRegex: { id: '8262', source: bossNameUnicode, capture: false },
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Avoid jails',
        },
      },
    },
    {
      id: 'P10N Cannonspawn',
      type: 'StartsUsing',
      netRegex: { id: '8264', source: bossNameUnicode, capture: false },
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Under jails',
        },
      },
    },
    {
      id: 'P10N Ultima',
      type: 'StartsUsing',
      netRegex: { id: '827B', source: bossNameUnicode, capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'P10N Pandaemoniac Meltdown',
      type: 'StartsUsing',
      netRegex: { id: '8276', source: bossNameUnicode, capture: false },
      response: Responses.stackMarker(),
    },
    {
      id: 'P10N Soul Grasp',
      type: 'StartsUsing',
      netRegex: { id: '8278', source: bossNameUnicode, capture: false },
      response: Responses.sharedTankBuster(),
    },
    {
      id: 'P10N Pandaemoniac Ray',
      type: 'StartsUsing',
      netRegex: { id: '826[57]', source: bossNameUnicode },
      infoText: (_data, matches, output) => {
        // Half-room cleave west (8265) or east (8267)
        const safeOutput = matches.id === '8265' ? 'east' : 'west';
        return output[safeOutput]!();
      },
      outputStrings: {
        east: Outputs.getRightAndEast,
        west: Outputs.getLeftAndWest,
      },
    },
    {
      id: 'P10N Touchdown',
      type: 'StartsUsing',
      netRegex: { id: '8268', source: bossNameUnicode, capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Cross bridge / off center platform',
        },
      },
    },
    {
      id: 'P10N Harrowing Hell x8',
      type: 'StartsUsing',
      netRegex: { id: '826A', source: bossNameUnicode, capture: false },
      response: Responses.bigAoe(),
    },
    {
      id: 'P10N Harrowing Hell Knockback',
      type: 'StartsUsing',
      netRegex: { id: '826F', source: bossNameUnicode, capture: false },
      response: Responses.knockback(),
    },
    {
      id: 'P10N Wicked Step',
      type: 'StartsUsing',
      netRegex: { id: '8272', source: bossNameUnicode, capture: false },
      alertText: (data, _matches, output) => {
        if (data.party.isTank(data.me))
          return output.soak!();
      },
      infoText: (data, _matches, output) => {
        if (!data.party.isTank(data.me))
          return output.avoid!();
      },
      outputStrings: {
        soak: {
          en: 'Soak tower',
        },
        avoid: {
          en: 'Avoid towers',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'missingTranslations': true,
      'replaceSync': {},
      'replaceText': {},
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {},
      'replaceText': {},
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {},
      'replaceText': {},
    },
    {
      'locale': 'cn',
      'missingTranslations': true,
      'replaceSync': {},
      'replaceText': {},
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {},
      'replaceText': {},
    },
  ],
};

export default triggerSet;
