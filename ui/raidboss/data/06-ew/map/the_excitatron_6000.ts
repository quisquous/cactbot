import Conditions from '../../../../../resources/conditions';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: id for Lucky Face Temper's Flare
// TODO: all Lucky Sphinx abilities

const excitatronOutputStrings = {
  spawn: {
    en: '正在生成 ${name}!',
  },
} as const;

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheExcitatron6000,

  triggers: [
    // ---------------- random treasure mobs ----------------
    {
      id: 'Excitatron Rainbow Golem Spawn',
      // 10834 = Rainbow Golem
      type: 'AddedCombatant',
      netRegex: { npcNameId: '10834' },
      suppressSeconds: 1,
      infoText: (_data, matches, output) => output.spawn!({ name: matches.name }),
      outputStrings: {
        spawn: excitatronOutputStrings.spawn,
      },
    },
    {
      id: 'Excitatron Golden Supporter Spawn',
      // 10833 = Golden Supporter
      type: 'AddedCombatant',
      netRegex: { npcNameId: '10833' },
      suppressSeconds: 1,
      infoText: (_data, matches, output) => output.spawn!({ name: matches.name }),
      outputStrings: {
        spawn: excitatronOutputStrings.spawn,
      },
    },
    {
      id: 'Excitatron Exciting Mandragoras Spawn',
      // 10835 = Exciting Onion
      // 10836 = Exciting Egg
      // 10837 = Exciting Garlic
      // 10838 = Exciting Tomato
      // 10839 = Exciting Queen
      type: 'AddedCombatant',
      netRegex: { npcNameId: '1083[5-9]', capture: false },
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: '已生成 惊奇蔓德拉战队, 依次击杀!',
        },
      },
    },
    // ---------------- final chamber boss: Lucky Face ----------------
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
      // when Lucky Face casts Merry Go-round (6D4F, 6D51) and gains the Revolutionary (B59) buff, certain attacks are reversed
      // reversed attacks have different ids so we don't need to check for the buff
      type: 'StartsUsing',
      netRegex: { id: '6D5B', source: 'Lucky Face', capture: false },
      response: Responses.goRight(),
    },
    {
      id: 'Excitatron Left in the Dark Reversed',
      // when Lucky Face casts Merry Go-round (6D4F, 6D51) and gains the Revolutionary (B59) buff, certain attacks are reversed
      // reversed attacks have different ids so we don't need to check for the buff
      type: 'StartsUsing',
      netRegex: { id: '6D59', source: 'Lucky Face', capture: false },
      response: Responses.goLeft(),
    },
    {
      id: 'Excitatron Quake Me Away Reversed',
      // when Lucky Face casts Merry Go-round (6D4F, 6D51) and gains the Revolutionary (B59) buff, certain attacks are reversed
      // reversed attacks have different ids so we don't need to check for the buff
      type: 'StartsUsing',
      netRegex: { id: '6DBB', source: 'Lucky Face', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'Excitatron Quake in Your Boots Reversed',
      // when Lucky Face casts Merry Go-round (6D4F, 6D51) and gains the Revolutionary (B59) buff, certain attacks are reversed
      // reversed attacks have different ids so we don't need to check for the buff
      type: 'StartsUsing',
      netRegex: { id: '6DBA', source: 'Lucky Face', capture: false },
      response: Responses.getIn(),
    },
    {
      id: 'Excitatron Heart on Fire III',
      // baited aoe on 2 players
      type: 'StartsUsing',
      netRegex: { id: '6D62', source: 'Lucky Face' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    // Heart on Fire II (6D54) - aoes under random players
    // Temper's Flare (6D4E?, 6743?) - roomwide aoe
    // ---------------- alternate final chamber boss: Lucky Sphinx ----------------
    // Icewind Twister - donut aoe
    // Lightning Bolt - aoes under 4? players
    // Riddle of Flame - Pyretic on every player
    // Riddle of Frost - Deep Freeze if not moving, Freezing Up if moving
    // Icebomb Burst - point-blank aoe on boss + baited aoes on 4? players
    // Gold Thunder - stack donut on 1 player, deals high damge outside center safe-spot
    // Firedrop Blast - aoes under 4? players + aoe marker on 1 player, leaves burns on marked player if other players hit?
    // Superheat - tankbuster
    // Crackling Current - roomwide aoe
  ],
};

export default triggerSet;
