import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.KtisisHyperboreia,
  damageWarn: {
    'Ktisis Ktiseos Leon Cry': '6857', // centered ricle
    'KtisisKtiseos Panther Charged Whisker': '6855', // centered circle
    'KtisisKtiseos Panther Megablaster': '6856', // conal
    'Ktisis Ktiseos Chione Snowcap': '6707', // circle when appearing
    'Ktisis Ktiseos Chione White Death': '685B', // targeted conal
    'Ktisis Lyssa Punishing Slice': '6259', // 180 cleave after Frostbite and Seek
    'Ktisis Lyssa Ice Pillar': '625B', // lines from ice pillar adds
    'Ktisis Ktiseos Daidalion Transonic Blast': '685D', // conal
    'Ktisis Ktiseos Hippogryph Shriek': '6862', // targeted circle
    'Ktisis Ktiseos Lailaps Fire II': '6867', // targeted circle
    'Ktisis Ktiseos Gryps Freefall': '685F', // targeted jump
    'Ktisis Ktiseos Gryps Alpine Draft': '685F', // line
    'Ktisis Ktiseos Ophiotauros Butcher': '6863', // conal
    'Ktisis Ktiseos Ophiotauros Scythe Tail': '6865', // centered circle
    'Ktisis Ladon Lord Pyric Breath 1': '6486', // 1/3 wide conal breath
    'Ktisis Ladon Lord Pyric Breath 2': '6487', // 1/3 wide conal breath
    'Ktisis Ladon Lord Pyric Breath 3': '6488', // 1/3 wide conal breath
    'Ktisis Ladon Lord Pyric Breath 4': '6489', // 1/3 wide conal breath
    'Ktisis Ladon Lord Pyric Breath 5': '648A', // 1/3 wide conal breath
    'Ktisis Ladon Lord Pyric Breath 6': '648B', // 1/3 wide conal breath
    'Ktisis Ladon Lord Pyric Sphere': '6491', // sphere bomberman lines
    'Ktisis Ktiseos Stymphalid Tickle': '686B', // wide line
    'Ktisis Ktiseos Stymphalid Gust': '686D', // targeted circle
    'Ktisis Ktiseos Alkyone Flamespitter': '696A', // targeted conal
    'Ktisis Ktiseos Aello Sideslip': '686E', // centered circle
    'Ktisis Ktiseos Aello Feathercut': '686F', // line
    'Ktisis Ktiseos Aello Wingbeat': '6870', // narrow conal
    'Ktisis Hermes True Aero IV 1': '6521', // mirrors
    'Ktisis Hermes True Aero IV 2': '6CBC', // mirrors
    'Ktisis Hermes True Aero Double': '652D', // Doubled line from True Aero lines
    'Ktisis Hermes True Aero II Double': '652A', // Doubled circle from True Aero II spread
    'Ktisis Hermes True Tornado Double': '6532', // Doubled circle after tankbuster
  },
  gainsEffectWarn: {
    'Ktisis Hermes Windburn': '824', // outside Hermes ring
  },
  shareWarn: {
    'Ktisis Hermes True Aero II': '6528', // spread
  },
  shareFail: {
    'Ktisis Hermes True Tornado': '6531', // tankbuster cleave
  },
};

export default triggerSet;
