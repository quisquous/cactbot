import ZoneId from '../../../../../resources/zone_id';
import NetRegexes from '../../../../../resources/netregexes';
import Conditions from '../../../../../resources/conditions';
import { Responses } from '../../../../../resources/responses';

const sharedOutputStrings = {
  teleportEast: {
    en: 'Teleport to east platform',
  },
  teleportWest: {
    en: 'Teleport to west platform',
  },
};

export default {
  zoneId: ZoneId.TheCloudDeck,
  timelineFile: 'diamond_weapon.txt',
  triggers: [
    {
      id: 'Diamond Diamond Rain',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5FA7', capture: false }),
      condition: Conditions.caresAboutAOE(),
      durationSeconds: 4,
      response: Responses.aoe(),
    },
    {
      id: 'Diamond Claw Swipe East',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5F9A', capture: false }),
      delaySeconds: 2,
      durationSeconds: 8,
      outputStrings: sharedOutputStrings,
      alertText: (data, _, output) => output.teleportWest(),
    },
    {
      id: 'Diamond Claw Swipe West',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5F9B', capture: false }),
      delaySeconds: 2,
      durationSeconds: 8,
      outputStrings: sharedOutputStrings,
      alertText: (data, _, output) => output.teleportEast(),
    },
    {
      id: 'Diamond Photon Burst',
      netRegex: NetRegexes.headMarker({ id: '0057' }),
      condition: Conditions.targetIsYou(),
      durationSeconds: 4,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Flare on YOU',
          de: 'Flare auf DIR',
          fr: 'Brasier sur VOUS',
          ja: '自分にフレア',
          cn: '核爆点名',
          ko: '플레어 대상자',
        },
      },
    },
    {
      id: 'Diamond Diamond Flash',
      netRegex: NetRegexes.ability({ source: 'The Diamond Weapon', id: '5779' }),
      durationSeconds: 5,
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Diamond Auri Cyclone',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5FE6', capture: false }),
      delaySeconds: 0.5,
      durationSeconds: 6,
      response: Responses.knockback(),
    },
    {
      id: 'Diamond Airship\'s Bane',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5FE8', capture: false }),
      durationSeconds: 5,
      outputStrings: sharedOutputStrings,
      alertText: (data, _, output) => output.teleportEast(),
    },
    {
      id: 'Diamond Outrage',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5FD7', capture: false }),
      condition: Conditions.caresAboutAOE(),
      durationSeconds: 4,
      response: Responses.aoe(),
    },
    {
      id: 'Diamond Auri Doomstead',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5FD8' }),
      durationSeconds: 4,
      response: Responses.tankBuster(),
    },
    {
      id: 'Diamond Vertical Cleave',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5FE5', capture: false }),
      durationSeconds: 5,
      response: Responses.knockback(),
    },
    {
      id: 'Diamond Diamond Shrapnel',
      netRegex: NetRegexes.headMarker({ id: '00C5' }),
      condition: Conditions.targetIsYou(),
      durationSeconds: 7,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Diamond Shrapnel on YOU',
        },
      },
    },
    {
      id: 'Diamond Articulated Bits',
      netRegex: NetRegexes.ability({ source: 'The Diamond Weapon', id: '5FA9', capture: false }),
      durationSeconds: 4,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Avoid Bits',
        },
      },
    },
    {
      id: 'Diamond Adamant Sphere',
      netRegex: NetRegexes.ability({ source: 'The Diamond Weapon', id: '6144', capture: false }),
      durationSeconds: 8,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
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
      // Diamond Weapon starts using this Adamant Purge ~10 seconds before the head markers
      id: 'Diamond Homing Laser',
      netRegex: NetRegexes.ability({ source: 'The Diamond Weapon', id: '5F9C', capture: false }),
      delaySeconds: 3,
      durationSeconds: 7,
      response: Responses.spread(),
    },
  ],
  timelineReplace: [],
};
