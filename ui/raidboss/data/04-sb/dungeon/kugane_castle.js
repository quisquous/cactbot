import Conditions from '../../../../../resources/conditions.js';
import NetRegexes from '../../../../../resources/netregexes.js';
import { Responses } from '../../../../../resources/responses.js';
import ZoneId from '../../../../../resources/zone_id.js';

export default {
  zoneId: ZoneId.KuganeCastle,
  timelineFile: 'kugane_castle.txt',
  timelineTriggers: [
    {
      id: 'Kugane Castle Issen',
      regex: /Issen/,
      beforeSeconds: 4,
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankCleave(),
    },
    {
      id: 'Kugane Castle Wakizashi',
      regex: /Wakizashi/,
      beforeSeconds: 4,
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
  ],
  triggers: [
    {
      id: 'Kugane Castle Kenki Release',
      netRegex: NetRegexes.startsUsing({ id: '1E93', source: 'Zuiko-Maru', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Kugane Castle Helm Crack',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      response: Responses.stackMarkerOn(),
    },
    {
      // The tether has no actual skill name,
      // but the Harakiri Koshu uses Cordage on the tether target after about 4 seconds.
      id: 'Kugane Castle Cordage',
      netRegex: NetRegexes.tether({ id: '0011' }),
      condition: Conditions.targetIsYou(),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Harakiri tether on YOU',
        },
      },
    },
    {
      id: 'Kugane Castle Clockwork Raiton',
      netRegex: NetRegexes.headMarker({ id: '005F' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Kugane Castle Gratuity',
      netRegex: NetRegexes.ability({ id: '1EAE', source: 'Kageyama', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Grab gold piles',
        },
      },
    },
    {
      // The NPC here is Dragon's Head x4
      id: 'Kugane Castle Dragons Lair',
      netRegex: NetRegexes.addedCombatantFull({ npcNameId: '3305', capture: false }),
      suppressSeconds: 5,
      response: Responses.killAdds(),
    },
  ],
};
