import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.HellsLid,
  damageWarn: {
    'HellsLid Nurikabe Fire II': '299F', // targeted circle'
    'HellsLid Magma': '2882', // line attacks from wall
    'HellsLid Hellish Lion Howling Wail': '299D', // large centered circle
    'HellsLid Hellfire Shikigami Fluid Swing': '299E', // conal
    'HellsLid Otake-maru 100-tonze Swing': '27BE', // untelegraphed centered circle
    'HellsLid Otake-maru Volcanic Debris': '27C5', // ambient circles on floor
    'HellsLid Otake-maru 10-tonze Slash': '27BF', // telegraphed conal
    'HellsLid Otake-maru Disrobe': '27C2', // small circles appearing after prey marker
    'HellsLid Otake-maru Stone Cudgel': '27C3', // spin attack when touching sword/shield
    'HellsLid Otake-maru Liquid Carapace': '27C0', // being too close to boss during prey Disrobe phase
    'HellsLid Hellish Yumemi Blanket Thunder': '21B3', // centered circle
    'HellsLid Kaja Electrogenesis': '11C2', // targeted large circle, by both Kaja and Kaja of the Seven Flames
    'HellsLid Kamaitachi Circling Winds': '27C8', // wind donut
    'HellsLid Kamaitachi Rolling Winds': '27C9', // large back/front line
    'HellsLid Kamaitachi The Patient Blade': '27C7', // front 180 cleave
    'HellsLid Kamaitachi Northerly': '27CD', // untargetable triggered wind sprite knockback explosion
    'HellsLid Kamaitachi Tsumuji-Kaze Tornado': '247E', // large targeted circle
    'HellsLid Kamaitachi Late Harvest': '27CC', // dashes
    'HellsLid Kamaitachi Gale The Storm\'s Grip': '27CE', // standing in the tornado
    'HellsLid Shikigami of the Spring Brine Bomb': '29A0', // targeted circle
    'HellsLid Stillwind Nue Twister': '2965', // targeted circle
    'HellsLid Boltstorm Nue Scythe Tail': '2A08', // centered circle
    'HellsLid Boltstorm Nue Butcher': '2964', // large wide conal
    'HellsLid Boltstorm Nue Spark': '2964', // donut with a very large hole
    'HellsLid Genbu Sinister Tide': '27D5', // light up arrow hexes
    'HellsLid Genbu Hell of Water': '27D0', // cross aoe
    'HellsLid Genbu Shell Shower': '2850', // light up hex squares during Chelonian Gate midphase
  },
  shareWarn: {
    'HellsLid Genbu Hell of Waste': '27D2', // very large spread marker
    'HellsLid Reisen Tatsunoko Hydrate': '2134', // untelegraphed cleave from snake mob
  },
};

export default triggerSet;
