import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

// TODO: taking wrong ancient libra with debuff
// TODO: does scratch cleave?

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheLostCityOfAmdaporHard,
  damageWarn: {
    'LostCityHard Magicked Crawler Sticky Thread': '1164', // frontal conal
    'LostCityHard Magicked Crawler Poison Breath': '1165', // frontal conal
    'LostCityHard Ranting Ranks Gremlin Fire II': '16C0', // targeted circle

    'LostCityHard Achamoth Psycho Squama': '15C6', // large frontal conal
    'LostCityHard Achamoth Dissipate': '15C8', // being hit by the chasing Toxic Squama orb
    'LostCityHard Achamoth Enthrallment': '15C3', // conal from Neuro Squama clones

    'LostCityHard Rift Dragon Miasma Breath': '1249', // frontal conal
    'LostCityHard Amdapori Corpse Holy': '1706', // targeted circle
    'LostCityHard Void Monk Water III': '16C7', // interruptible targeted circle
    'LostCityHard Void Monk Flood': '16C6', // untelegraphed circle? after Sucker draw-in

    'LostCityHard Winged Lion Ancient Aero': '15CF', // large targeted circle
    'LostCityHard Winged Lion Ancient Stone': '15D3', // targeted circle
    'LostCityHard Winged Lion Ancient Aero Grown': '1760', // raidwide if aero not popped
    'LostCityHard Winged Lion Ancient Stone Grown': '167B', // untelegraphed circle? if stone not popped
    'LostCityHard Winged Lion Ancient Holy Grown': '15CD', // raidwide if holy not popped
    'LostCityHard Winged Lion Gargoyle Holy': '1706', // letting adds live too long

    'LostCityHard Clay Effigy Wild Horn': '1507', // frontal conal
    'LostCityHard Mana Idol Neck Splinter': '1169', // centered circle

    'LostCityHard Kuribu Glory': '15E4', // frontal conal
  },
  gainsEffectWarn: {
    'LostCityHard Achamoth Pollen': '13', // standing in the Toxic Squama puddle
    'LostCityHard Rift Dragon Terror': '42', // Evil Eye conal
    'LostCityHard Winged Lion Magic Defense Down': '26', // not finishing the holy orb in time
    'LostCityHard Mana Pot Mysterious Light Blind': '0F', // not looking away
  },
  shareWarn: {
    'LostCityHard Kuribu Reverse Cure III': '15DB', // spread
  },
};

export default triggerSet;
