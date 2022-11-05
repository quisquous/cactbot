import Conditions from '../../../../../resources/conditions';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheExcitatron6000,

  triggers: [
    // ---------------- random treasure mobs ----------------
    {
      id: 'Excitatron Rainbow Golem Spawn',
      type: 'AddedCombatant',
      netRegex: { name: 'Rainbow Golem', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Rainbow Golem spawned!',
        },
      },
    },
    {
      id: 'Excitatron Golden Supporter Spawn',
      type: 'AddedCombatant',
      netRegex: { name: 'Golden Supporter', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Golden Supporter spawned!',
        },
      },
    },
    {
      id: 'Excitatron Exciting Mandragoras Spawn',
      type: 'AddedCombatant',
      netRegex: { name: ['Exciting Tomato', 'Exciting Garlic', 'Exciting Queen', 'Exciting Onion', 'Exciting Egg'], capture: false },
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Exciting Mandragoras spawned, kill in order!',
        },
      },
    },
    // ---------------- final chamber boss: Lucky Face ----------------
    // Heart on Fire II (6D54)- aoes under 4? players
    {
      id: 'Excitatron Right in the Dark',
      type: 'StartsUsing',
      netRegex: { id: '6D57', source: 'Lucky Face', capture: false },
      response: Responses.goLeft(),
    },
    {
      id: 'Excitatron Left in the Dark',
      type: 'StartsUsing',
      netRegex: { id: '6D55', source: 'Lucky Face', capture: false },
      response: Responses.goRight(),
    },
    {
      id: 'Excitatron Heart on Fire IV',
      type: 'StartsUsing',
      netRegex: { id: '6D4D', source: 'Lucky Face' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Excitatron Quake Me Away',
      type: 'StartsUsing',
      netRegex: { id: '6D5F', source: 'Lucky Face', capture: false },
      response: Responses.getIn(),
    },
    {
      id: 'Excitatron Quake in Your Boots',
      type: 'StartsUsing',
      netRegex: { id: '6D5D', source: 'Lucky Face', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'Excitatron Right in the Dark Reversed',
      // when Lucky Face casts Merry Go-round (6D4F, 6D51) and gains the Revolutionary (B59) buff, all attacks are reversed
      // reversed attacks have different ids so we don't need to check for the buff
      type: 'StartsUsing',
      netRegex: { id: '6D5B', source: 'Lucky Face', capture: false },
      response: Responses.goRight(),
    },
    {
      id: 'Excitatron Left in the Dark Reversed',
      // when Lucky Face casts Merry Go-round (6D4F, 6D51) and gains the Revolutionary (B59) buff, all attacks are reversed
      // reversed attacks have different ids so we don't need to check for the buff
      type: 'StartsUsing',
      netRegex: { id: '6D59', source: 'Lucky Face', capture: false },
      response: Responses.goLeft(),
    },
    {
      id: 'Excitatron Quake Me Away Reversed',
      // when Lucky Face casts Merry Go-round (6D4F, 6D51) and gains the Revolutionary (B59) buff, all attacks are reversed
      // reversed attacks have different ids so we don't need to check for the buff
      type: 'StartsUsing',
      netRegex: { id: '', source: 'Lucky Face', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'Excitatron Quake in Your Boots Reversed',
      // when Lucky Face casts Merry Go-round (6D4F, 6D51) and gains the Revolutionary (B59) buff, all attacks are reversed
      // reversed attacks have different ids so we don't need to check for the buff
      type: 'StartsUsing',
      netRegex: { id: '', source: 'Lucky Face', capture: false },
      response: Responses.getIn(),
    },
    {
      id: 'Excitatron Heart on Fire III',
      // baited aoe on 2? players
      type: 'StartsUsing',
      netRegex: { id: '6D62', source: 'Lucky Face', capture: false },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    // Temper's Flare (6D4E?, 6743?) - roomwide aoe?
    // ---------------- alternate final chamber boss: Lucky Sphinx ----------------
    // Icewind Twister - donut aoe?
    // Lightning Bolt - aoes under 4? players?
    // Riddle of Flame - Pyretic on every player?
    // Riddle of Frost - Deep Freeze if not moving, Freezing Up if moving?
    // Icebomb Burst - point-blank aoe on boss + baited aoes on 4? players?
    // Gold Thunder - stack donut? on 1 player, deals high damge outside donut aoe?
    // Firedrop Blast - aoes under 4? players + aoe marker on 1 player, leaves burns on marked player if other players hit?
    // Superheat - tankbuster?
    // Crackling Current - roomwide aoe?
  ],
};

export default triggerSet;
