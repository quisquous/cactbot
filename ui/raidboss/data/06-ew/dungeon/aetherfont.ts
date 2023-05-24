import Conditions from '../../../../../resources/conditions';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: Lyngbakr map effects for safe spots for small/large explosions
// TODO: Octomammoth safe tentacle platform sides?
// TODO: Octomammoth map effects for telekenesis safe spots
// TODO: Octomammoth Breathstroke could say "left/right" specifically instead of get behind

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  id: 'TheAetherfont',
  zoneId: ZoneId.TheAetherfont,
  timelineFile: 'aetherfont.txt',
  triggers: [
    {
      id: 'Aetherfont Lyngbakr Upsweep',
      type: 'StartsUsing',
      netRegex: { id: '823A', source: 'Lyngbakr', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Aetherfont Lyngbakr Bodyslam',
      type: 'StartsUsing',
      netRegex: { id: '8237', source: 'Lyngbakr', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Aetherfont Lyngbakr Tidal Breath',
      type: 'StartsUsing',
      netRegex: { id: '8240', source: 'Lyngbakr', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'Aetherfont Lyngbakr Floodstide',
      type: 'StartsUsing',
      netRegex: { id: '823D', source: 'Lyngbakr', capture: false },
      // 00600 spread headmarkers come out after cast ends
      durationSeconds: 8,
      response: Responses.spread(),
    },
    {
      id: 'Aetherfont Lyngbakr Tidalspout',
      type: 'StartsUsing',
      netRegex: { id: '823F', source: 'Lyngbakr' },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Aetherfont Lyngbakr Sonic Bloop',
      type: 'StartsUsing',
      netRegex: { id: '8241', source: 'Lyngbakr' },
      response: Responses.tankBuster(),
    },
    {
      // Initial battle cry is just aoe, the later ones create a ring.
      id: 'Aetherfont Arkas Battle Cry Initial',
      type: 'StartsUsing',
      netRegex: { id: '872D', source: 'Arkas', capture: false },
      response: Responses.aoe(),
    },
    {
      // aoe + ring
      id: 'Aetherfont Arkas Battle Cry',
      type: 'StartsUsing',
      netRegex: { id: '8254', source: 'Arkas', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'aoe + Get Middle'
        },
      },
    },
    {
      id: 'Aetherfont Arkas Ripper Claw',
      type: 'StartsUsing',
      netRegex: { id: '8258', source: 'Arkas' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Aetherfont Arkas Lightning Claw',
      type: 'StartsUsing',
      netRegex: { id: '8798', source: 'Lyngbakr' },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Aetherfont Arkas Electrify',
      type: 'Ability',
      // 8256 is the damage ability for Lightning Claw, which is followed by a centered aoe.
      netRegex: { id: '8256', source: 'Lyngbakr', capture: false },
      suppressSeconds: 5,
      response: Responses.getOut(),
    },
    {
      id: 'Aetherfont Octomammoth Tidal Roar',
      type: 'StartsUsing',
      netRegex: { id: '824C', source: 'Octomammoth', capture: false },
      response: Responses.aoe(),
    },
    {
      // aoe + ring
      id: 'Aetherfont Octomammoth Saline Spit',
      type: 'StartsUsing',
      netRegex: { id: '8248', source: 'Octomammoth', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Stand Between Platforms'
        },
      },
    },
    {
      id: 'Aetherfont Octomamoth Water Drop',
      type: 'StartsUsing',
      netRegex: { id: '8684', source: 'Octomammoth' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Aetherfont Octomammoth Breathstroke',
      type: 'StartsUsing',
      netRegex: { id: '86F7', source: 'Octomammoth', capture: false },
      response: Responses.getBehind(),
    },
  ],
};

export default triggerSet;
