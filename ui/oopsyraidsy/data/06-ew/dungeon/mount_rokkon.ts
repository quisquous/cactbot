import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.MountRokkon,
  damageWarn: {
    // Trash
    'Rokkon Shishu Yamawaro Dark': '84CE', // targeted circle
    'Rokkon Shishu Sharin Crimson Mandate': '835B', // cross
    'Rokkon Shishu Dorotabo Water III': '8355', // large targeted circle
    'Rokkon Shishu Fuko Scythe Tail': '8353', // centered circle
    'Rokkon Shishu Kioyfusa Clearout': '8356', // front conal
    'Rokkon Shishu Kotengu Isso': '835C', // wide front conal
    'Rokkon Shishu Onmitsu Juji Shuriken': '8358', // long line
    'Rokkon Shishu Izumo': '8357', // large centered circle

    // Yozakura the Fleeting
    'Rokkon Yozakura Art of the Fireblossom': '8368', // circle
    'Rokkon Yozakura Art of the Windblossom': '8369', // donut
    'Rokkon Yozakura Seal of the Fireblossom': '8375', // circle during Oka Ranman
    'Rokkon Yozakura Seal of the Windblossom': '8376', // donut during Oka Ranman
    'Rokkon Yozakura Seal of the Rainblossom': '8377', // intercards during Oka Ranman
    'Rokkon Yozakura Seal of the Levinblossom': '8378', // cards during Oka Ranman
    'Rokkon Yozakura Shadowflight': '8380', // backstab line from clone
    'Rokkon Yozakura Mudrain': '838A', // initial circles on water path
    'Rokkon Yozakura Mud Pie': '838E', // line aoes from mud circles
    'Rokkon Yozakura Icebloom': '838C', // chasing circles in route 1 during Mud Rain
    'Rokkon Yozakura Windblossom Whirl 1': '8390', // initial donut on wind path
    'Rokkon Yozakura Windblossom Whirl 2': '86F0', // ongoing donuts on wind path
    'Rokkon Yozakura Levinblossom Strike': '8392', // small circles in Windblossom Whirl donut
    'Rokkon Yozakura Season of Fire': '8385', // 4x lines (back safe)
    'Rokkon Yozakura Season of Water': '8386', // 4x lines (front safe)
    'Rokkon Yozakura Season of Earth': '8388', // 4x pinwheel on cardinals
    'Rokkon Yozakura Season of Lightning': '8387', // 4x pinwheel on intercards

    // Moko the Restless
    'Rokkon Moko Iai-kasumi-giri Back': '8587', // back-safe 270 cleave
    'Rokkon Moko Iai-kasumi-giri Front': '8588', // front-safe 270 cleave
    'Rokkon Moko Iai-kasumi-giri Left': '8589', // left-safe 270 cleave
    'Rokkon Moko Iai-kasumi-giri Right': '858A', // right-safe 270 cleave
    'Rokkon Moko Double Kasumi-giri Back 1': '858B', // back-safe 270 cleave first
    'Rokkon Moko Double Kasumi-giri Left 1': '858C', // left-safe 270 cleave first
    'Rokkon Moko Double Kasumi-giri Front 1': '858D', // front-safe 270 cleave first
    'Rokkon Moko Double Kasumi-giri Right 1': '858E', // right-safe 270 cleave first
    'Rokkon Moko Double Kasumi-giri Back 2': '858F', // back-safe 270 cleave second
    'Rokkon Moko Double Kasumi-giri Left 2': '8590', // left-safe 270 cleave second
    'Rokkon Moko Double Kasumi-giri Front 2': '8591', // front-safe 270 cleave second
    'Rokkon Moko Double Kasumi-giri Right 2': '8592', // right-safe 270 cleave second
    'Rokkon Moko Iron Rain': '8594', // bombardment after Soldiers of Death
    'Rokkon Moko Spearpoint Push 1': '8597', // initial damage during Spearman's Orders
    'Rokkon Moko Spearpoint Push 2': '86D2', // ongoing damage during Spearman's Orders
    'Rokkon Moko Scarlet Auspice': '8598', // centered circle
    'Rokkon Moko Boundless Scarlet': '859A', // Z lines from Scarlet Auspice
    'Rokkon Moko Explosion': '859B', // expanding lines from Boundless Scarlet
    'Rokkon Moko Clearout': '85AC', // large circles from Oni's Claw during Moonless Night
    'Rokkon Moko Azure Auspice': '859C', // donut
    'Rokkon Moko Boundless Azure': '859E', // Z lines from Azure Auspice
    'Rokkon Moko Upwell 1': '859F', // initial expanding water lines
    'Rokkon Moko Upwell 2': '85A0', // ongoing expanding water lines
    'Rokkon Moko Spiritflame': '85A6', // ground circles during Spiritspark,
    'Rokkon Moko Arm of Purgatory': '85A7', // running into heads during Spiritspark
    'Rokkon Moko Unsheathing': '85A9', // sword appearing circles during Untempered Sword
    'Rokkon Moko Veil Sever': '85AA', // sword lines during Untempered Sword
  },
  gainsEffectWarn: {
    // BFF = 9999 duration, C00 = 15s duration
    'Rokkon Yozakura Sludge': 'BFF', // standing in Mudrain circles
    // C05 = 9999 duration, C06 = 15s duration
    'Rokkon Bleed': 'C05', // standing in outside square (any boss)
  },
};

export default triggerSet;
