import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// TODO: Six Fulms Under (237) 10 second debuff death

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheLunarSubterrane,
  damageWarn: {
    // Trash 1
    'Lunar Subterrane Voidmoon Plague Stare': '8C0F', // line aoe
    'Lunar Subterrane Voidmoon Dahak The Look': '8C73', // front conal
    'Lunar Subterrane Voidmoon Archaeodemon Unholy Darkness': '8C74', // targeted circle
    'Lunar Subterrane Voidmoon Humbaba Anoxic Breath': '8C75', // front knockback conal

    // Boss 1
    'Lunar Subterrane Dark Elf Explosion': '87E3', // sigil squares
    'Lunar Subterrane Dark Elf Ruinous Hex 1': '89B6', // first set of staves bomberman lines
    'Lunar Subterrane Dark Elf Ruinous Hex 2': '87E5', // hidden staves bomberman lines

    // Trash 2
    'Lunar Subterrane Frenzied Morbol Bad Breath': '8C11', // front conal
    'Lunar Subterrane Frenzied Behemoth Death Spin': '8C7C', // ?
    'Lunar Subterrane Frenzied Behemoth Charybdis': '8C77', // targeted circle

    // Boss 2
    'Lunar Subterrane Antlion Antlion March': '8801', // charges
    'Lunar Subterrane Antlion Towerfall': '8804', // falling towers during Landslip / Antlion March

    // Trash 3
    'Lunar Subterrane Baron Jester Black Wind': '8C7A', // targeted circle
    'Lunar Subterrane Original Progenitrix Scalding Scolding': '8C7B', // front conal
    'Lunar Subterrane Original Gargoyle Grim Halo': '7410', // large centered circle
    'Lunar Subterrane Original Gargoyle Grim Fate': '7411', // front conal
    'Lunar Subterrane Vampiress Void Fire IV': '8C14', // large targeted circle

    // Boss 3
    'Lunar Subterrane Durante Duplicitous Battery': '88B2', // spiral of circles
    'Lunar Subterrane Durante Exposion 1': '88BE', // unsplit Aetheric Orb circle
    'Lunar Subterrane Durante Exposion 2': '88BD', // split Aetheric Orb circle
    'Lunar Subterrane Durante Hard Slash': '88C1', // wide cleave from wall after Antipodal Assault
    'Lunar Subterrane Durante Twilight Phase': '8CD8', // big purple ribs
    'Lunar Subterrane Durante Dark Impact': '88BA', // large tether orb circle
    'Lunar Subterrane Durante Death\'s Journey 1': '88B3', // center circle during purple pinwheel
    'Lunar Subterrane Durante Death\'s Journey 2': '88B4', // lines during purple pinwheel
  },
  gainsEffectWarn: {
    'Lunar Subterrane Antlion Sludge': 'BFF', // landslip into the wall
  },
  shareWarn: {
    'Lunar Subterrane Dark Elf Void Dark II': '87E4', // spread circles
    'Lunar Subterrane Durante Fallen Grace': '8C2A', // spread circles
  },
};

export default triggerSet;
