import Conditions from '../../../../../resources/conditions.js';
import NetRegexes from '../../../../../resources/netregexes.js';
import { Responses } from '../../../../../resources/responses.js';
import ZoneId from '../../../../../resources/zone_id.js';

export default {
  zoneId: ZoneId.EdensPromiseLitanySavage,
  timelineFile: 'e10s.txt',
  triggers: [
    {
      id: 'E10S Deepshadow Nova',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '573E', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    // TODO: back front implosion??
    // 56F0 is be on shadow, 56F3 is be away from shadow
    {
      id: 'E10S Throne Of Shadow',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5717', capture: false }),
      response: Responses.getOut('alert'),
    },
    // TODO: giga slash from shadow
    {
      id: 'E10S Umbra Smash',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5BAA' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBusterSwap(),
      run: (data, matches) => {
        data.umbraTarget = matches.target;
      },
    },
    {
      id: 'E10S Darkness Unleashed',
      // Cast on self, with no player target.
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5B0E', capture: false }),
      alertText: (data, _, output) => {
        if (data.me === data.umbraTarget)
          return output.avoidStack();
        return output.stack();
      },
      outputStrings: {
        avoidStack: {
          en: 'Avoid Stack!',
        },
        stack: {
          en: 'Stack',
          de: 'Sammeln',
          fr: 'Packez-vous',
          ja: '頭割り',
          cn: '分摊',
          ko: '쉐어뎀',
        },
      },
    },
    {
      id: 'E10S Shadow\'s Edge',
      // Cast on self, with no player target.
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5B0C' }),
      response: Responses.tankCleave(),
    },
    {
      id: 'E10S Shadow Cleave',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5718', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Drop Shadow Out',
        },
      },
    },
    {
      // TODO: use headmarkers for this
      id: 'E10S Dualspell 1',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '573A', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: '1 out, 2+3 in',
        },
      },
    },
    {
      // TODO: use headmarkers for this
      id: 'E10S Dualspell 2',
      netRegex: NetRegexes.ability({ source: 'Shadowkeeper', id: '573A', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: '2 out, 1+3 in',
        },
      },
    },
    {
      // TODO: use headmarkers for this
      id: 'E10S Dualspell 3',
      netRegex: NetRegexes.ability({ source: 'Shadowkeeper', id: '573A', capture: false }),
      delaySeconds: 3,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: '3 out, 1+2 in',
        },
      },
    },
    {
      id: 'E10S Shadowkeeper 1',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5720', capture: false }),
      alertText: (data, _, output) => output.text(),
      suppressSeconds: 99999,
      outputStrings: {
        text: {
          en: 'Drop Shadow Max Melee',
        },
      },
    },
    {
      id: 'E10S Swath of Silence',
      netRegex: NetRegexes.startsUsing({ source: 'Shadow Of A Hero', id: '5BBF', capture: false }),
      suppressSeconds: 3,
      response: Responses.getUnder(),
    },
    // TODO: giga slash headmarkers? tethers?
    {
      id: 'E10S Distant Scream',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5716', capture: false }),
      response: Responses.knockback('alert'),
    },
    {
      id: 'E10S Umbral Orbs',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5731', capture: false }),
      // TODO: maybe 4?
      delaySeconds: 3.5,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Orbs',
        },
      },
    },
    {
      id: 'E10S Shadow Warrior',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5739', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Watch Tethered Dog',
        },
      },
    },
    {
      id: 'E10S Fade To Shadow',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '572B', capture: false }),
      delaySeconds: 4,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          // TODO: this could be better if we knew where the shadow was
          // TODO: this also happens twice, with tethers
          en: 'Be On Squiggles',
        },
      },
    },
    {
      id: 'E10S Cloak of Shadows 1',
      netRegex: NetRegexes.ability({ source: 'Shadowkeeper', id: '5B13', capture: false }),
      delaySeconds: 4,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          // TODO: this could be better if we knew where the shadow was
          en: 'Away From Squiggles',
        },
      },
    },
    // TODO: could use giga slash "get in" here for four slashes
    {
      id: 'E10S Voidgate',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5734', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Cleaves with towers',
        },
      },
    },
    {
      id: 'E10S Voidgate Second Tower',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5734', capture: false }),
      delaySeconds: 23.3,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Towers first, then cleaves',
        },
      },
    },
    {
      // TODO: use a headmarker here
      id: 'E10S Pitch Bog',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5721', capture: false }),
      infoText: (data, _, output) => {
        if (data.seenPitchBog)
          return data.secondPitchBog();
        return data.firstPitchBog();
      },
      run: (data) => data.seenPitchBog = true,
      outputStrings: {
        firstPitchBog: {
          en: 'Puddles outside',
        },
        secondPitchBog: {
          en: 'Puddles on intercardinals',
        },
      },
    },
    {
      // TODO: use a tether line for this, and use a12s output strings
      id: 'E10S Shackled Apart',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5BAC', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Far Tethers',
        },
      },
    },
    {
      // TODO: use a tether line for this, and use a12s output strings
      // TODO: this doesn't hit everybody
      id: 'E10S Shackled Together',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '572E', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Close Tethers',
        },
      },
    },
    {
      // TODO: this mechanic needs a lot more love
      id: 'E10S Voidgate Amplifier',
      netRegex: NetRegexes.startsUsing({ source: 'Shadowkeeper', id: '5BCF', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Pick up Puddles',
        },
      },
    },
  ],
};
