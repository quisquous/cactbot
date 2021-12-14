import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: Does Mustard Bomb cleave? Should it be tankCleave() instead?

export interface Data extends RaidbossData {
  lastBoss: boolean;
}

const limitCutNumberMap: { [id: string]: number } = {
  '004F': 1,
  '0050': 2,
  '0051': 3,
  '0052': 4,
};

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheStigmaDreamscape,
  timelineFile: 'stigma_dreamscape.txt',
  initData: () => {
    return {
      lastBoss: false,
    };
  },
  triggers: [
    {
      id: 'Dreamscape Side Cannons Left',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6320', source: 'Proto-Omega', capture: false }),
      response: Responses.goLeft(),
    },
    {
      id: 'Dreamscape Side Cannons Right',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6321', source: 'Proto-Omega', capture: false }),
      response: Responses.goRight(),
    },
    {
      id: 'Dreamscape Forward Interceptors',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6322', source: 'Proto-Omega', capture: false }),
      response: Responses.getBehind(),
    },
    {
      id: 'Dreamscape Rear Interceptors',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6324', source: 'Proto-Omega', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Go front of boss',
        },
      },
    },
    {
      id: 'Dreamscape Chemical Missile',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '008B' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Dreamscape Electric Slide',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0121' }),
      infoText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.target!();
        return output.allies!({ target: matches.target });
      },
      outputStrings: {
        target: {
          en: 'Stack + Knockback on YOU!',
        },
        allies: {
          en: 'Stack + knockback on ${target}',
        },
      },
    },
    {
      id: 'Dreamscape Guided Missile',
      type: 'Tether',
      netRegex: NetRegexes.tether({ id: '0011' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Guided Missile on YOU',
        },
      },
    },
    {
      id: 'Dreamscape Mustard Bomb',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '632B', source: 'Proto-Omega' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'Dreamscape Assault Cannon',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63AB', source: 'Arch-Lambda', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get to wall at last dash',
        },
      },
    },
    {
      id: 'Dreamscape Sniper Cannon',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: ['004F', '0050', '0051', '0052'] }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, matches, output) => {
        const limitCutNumber = limitCutNumberMap[matches.id];
        return output.text!({ num: limitCutNumber });
      },
      outputStrings: {
        text: {
          en: '#${num} laser on YOU!',
        },
      },
    },
    {
      id: 'Dreamscape Wheel',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6B9D', source: 'Arch-Lambda' }),
      response: Responses.tankBuster(),
    },
    {
      // Dragons spawn outside the last boss, but those ones don't matter.
      // Ensure that we don't say anything until the player has engaged the last boss.
      // 6435 is Plasmafodder, Stigma-4's auto-attack.
      id: 'Dreamscape Last Boss',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6435', source: 'Stigma-4', capture: false }),
      run: (data) => data.lastBoss = true,
    },
    {
      id: 'Dreamscape Atomic Flame',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63B4', source: 'Arch-Lambda', capture: false }),
      response: Responses.aoe(),
    },
    {
      // The Hybrid Dragon add uses Touchdown after spawning,
      // then immediately begins casting Fire Breath in a cone across the arena.
      // If the player is not already in motion by the time Fire Breath begins,
      // they are likely to be hit.
      id: 'Dreamscape Touchdown',
      type: 'AddedCombatant',
      netRegex: NetRegexes.addedCombatant({ name: 'Hybrid Dragon' }),
      condition: (data) => data.lastBoss,
      infoText: (_data, matches, output) => {
        // The arena is a 50x50 square, with (0,0) in the exact center.
        const isEast = parseFloat(matches.x) > 0;
        if (isEast)
          return output.east!();
        return output.west!();
      },
      outputStrings: {
        east: outputs.east,
        west: outputs.west,
      },
    },
    {
      id: 'Dreamscape Rush',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '642D', source: 'Proto-rocket Punch', capture: false }),
      suppressSeconds: 5, // All five Punches use it at the same time
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Avoid side dashes',
        },
      },
    },
    {
      id: 'Dreamscape Electromagnetic Release Circle',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6434', source: 'Stigma-4' }),
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 4, // Full cast is 9.7s.
      response: Responses.getOut(),
    },
    {
      id: 'Dreamscape Electromagnetic Release Donut',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6432', source: 'Stigma-4' }),
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 4, // Full cast is 9.7s.
      response: Responses.getIn(),
    },
    {
      id: 'Dreamscape Proto-wave Cannons Left',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '642A', source: 'Omega Frame', capture: false }),
      response: Responses.goLeft(),
    },
    {
      id: 'Dreamscape Proto-wave Cannons Right',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '642B', source: 'Omega Frame', capture: false }),
      response: Responses.goRight(),
    },
    {
      id: 'Dreamscape Forward March',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '7A6' }),
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Mindjack: Forward',
        },
      },
    },
    {
      id: 'Dreamscape About Face',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '7A7' }),
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Mindjack: Back',
        },
      },
    },
    {
      id: 'Dreamscape Left Face',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '7A8' }),
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Mindjack: Left',
        },
      },
    },
    {
      id: 'Dreamscape Right Face',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '7A9' }),
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Mindjack: Right',
        },
      },
    },
  ],
};

export default triggerSet;
