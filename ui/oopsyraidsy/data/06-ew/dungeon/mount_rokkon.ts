import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// TODO: Moko outside ring wall
// TODO: path05 standing in baboon wall (also check if murdering baboon affects timeline)
// TODO: path09 six fulms under

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
    'Rokkon Shishu Mifune Burnished Joust': '8359', // line charge
    'Rokkon Shishu Yoko Spinning Slash': '835D', // donut
    'Rokkon Shishu Yoko Rotary Slash': '835E', // circle
    'Rokkon Shishu Chochin Illume': '8352', // front conal
    'Rokkon Shishu Hoko Tornado': '84CF', // targeted circle
    'Rokkon Shishu Wanyudo Midnight Mandate': '835F', // targeted circle
    'Rokkon Shishu Tenaga Ovation': '8360', // line aoe
    'Rokkon Shishu Jumokko Acorn Bomb': '8362', // targeted circle
    'Rokkon Shishu Jumokko Backhgand Blow': '8361', // back conal
    'Rokkon Shishu Kuzuri Savage Swipe': '8363', // front conal
    'Rokkon Shishu Sai Taisui Sweeping Invocation': '8364', // cross
    'Rokkon Shishu Raiko Master of Levin': '8365', // donut
    'Rokkon Shishu Raiko Disciples of Levin': '8366', // centered circle
    'Rokkon Shishu Daitengu Yama-Kagura': '8367', // line aoe

    // Yozakura the Fleeting (all paths)
    'Rokkon Yozakura Art of the Fireblossom': '8368', // circle
    'Rokkon Yozakura Art of the Windblossom': '8369', // donut
    'Rokkon Yozakura Seal of the Fireblossom': '8375', // circle during Oka Ranman
    'Rokkon Yozakura Seal of the Windblossom': '8376', // donut during Oka Ranman
    'Rokkon Yozakura Seal of the Rainblossom': '8377', // intercards during Oka Ranman
    'Rokkon Yozakura Seal of the Levinblossom': '8378', // cards during Oka Ranman

    // Yozakura the Fleeting (left and right paths)
    'Rokkon Yozakura Shadowflight': '8380', // backstab line from clone

    // Yozakura the Fleeting (left path)
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

    // Yozakura the Fleeting (middle path)
    'Rokkon Yozakura Tatami-gaeshi': '8396', // tatami mat flip
    'Rokkon Yozakura Levinblossom Lance': '839A', // rotating line aoes
    'Rokkon Yozakura Fireblossom Flare': '83A0', // ground circles during Art of the Fluff

    // Yozakura the Fleeting (right path)
    'Rokkon Yozakura Behind Barbs': '83A2', // standing in the Accursed Seedling root
    'Rokkon Yozakura Explosion': '83A3', // not killing the Living Gaol in time
    'Rokkon Yozakura Root Arrangement 1': '83A5', // 4x chasing aoe initial hit
    'Rokkon Yozakura Root Arrangement 2': '83A6', // 4x chasing aoe ongoing hits
    'Rokkon Yozakura Cutting Leaves': '83A8', // hitting tornados during Witherwind

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

    // Gorai the Uncaged
    'Rokkon Gorai Fire Spread Purple': '84DA', // line damage after Plectrum of Power 84D8
    'Rokkon Gorai Fire Spread Blue': '84DB', // line damage after Morphic Melody 84D9
    'Rokkon Gorai Falling Rock Purple': '84DD', // expanded rock damage after Plectrum of Power 84D8
    'Rokkon Gorai Falling Rock Blue': '84DE', // donutified rock damage after Morphic Melody 84D9
    'Rokkon Gorai Dramatic Burst': '84E3', // missed tower damage
    'Rokkon Gorai Spike of Flame': '84E5', // targeted circle on player
    'Rokkon Gorai Impure Purgation 1': '84E7', // pinwheel 1
    'Rokkon Gorai Impure Purgation 2': '84E8', // pinwheel 2
    'Rokkon Gorai String Snap 1': '84EA', // expanding earth ring 1
    'Rokkon Gorai String Snap 2': '84EB', // expanding earth ring 2
    'Rokkon Gorai String Snap 3': '84EC', // expanding earth ring 3
    'Rokkon Gorai Shishu White Baboon Self-Destruct': '84F1', // failing to kill White Baboon in time
    'Rokkon Gorai Ball of Levin Shock Small': '84F4', // small circle from Ball of Levin hit by Humble Hammer
    'Rokkon Gorai Ball of Levin Shock Big': '84F5', // large circle from Ball of Levin
    'Rokkon Gorai Worldly Pursuit 1': '84FB', // initial rotating cross damage
    'Rokkon Gorai Worldly Pursuit 2': '84FC', // ongoing rotating cross damage

    // Shishio
    'Rokkon Shishio Once on Rokujo': '83DD', // 1x Smokeater line
    'Rokkon Shishio Twice on Rokujo': '87A5', // 2x Smokeater line
    'Rokkon Shishio Thrice on Rokujo': '87AC', // 3x Smokeater line
    'Rokkon Shishio Rain Leaping Levin 1': '83DE', // 1x Smokeater small cloud circles
    'Rokkon Shishio Rain Leaping Levin 2': '83DF', // 2x Smokeater medium cloud circles
    'Rokkon Shishio Rain Leaping Levin 3': '83E0', // 3x Smokeater large cloud circles
    'Rokkon Shishio Thunder Onefold': '83E2', // 1x Smokeater initial cloud circles
    'Rokkon Shishio Thunder Twofold': '87F9', // 2x Smokeater initial cloud circles
    'Rokkon Shishio Thunder Threefold': '87FB', // 3x Smokeater initial cloud circles
    'Rokkon Shishio Cloud to Cloud 1': '83E3', // 1x Smokeater small lines
    'Rokkon Shishio Cloud to Cloud 2': '83E4', // 2x Smokeater medium lines
    'Rokkon Shishio Cloud to Cloud 3': '83E5', // 3x Smokeater large lines
    'Rokkon Shishio Noble Pursuit': '83E6', // line aoe
    'Rokkon Shishio Levinburst': '83E7', // line damage for going through rings during Noble Pursuit
    'Rokkon Shishio Thunder Vortex': '83F4', // donut
    'Rokkon Shishio Yoki': '83EB', // ground circles
    'Rokkon Shishio Yoki-uzu': '83EC', // large circle forcing you into the quicksand
    'Rokkon Shishio Devilish Thrall Right Swipe': '83F0', // right 180 cleave
    'Rokkon Shishio Devilish Thrall Left Swipe': '83F1', // left 180 cleave
    'Rokkon Shishio Haunting Thrlall Reisho 1': '872B', // ghost centered circle
    'Rokkon Shishio Haunting Thrlall Reisho 2': '872C', // ghost centered circle
    'Rokkon Shishio Haunting Thrlall Reisho 3': '83F2', // ghost centered circle
    'Rokkon Shishio Clever Thrall Unsagely Spin': '83ED', // centered circle
    'Rokkon Shishio Feral Thrall Rush': '83EE', // line
    'Rokkon Shishio Venomous Thrall Vasoconstrictor': '83EF', // targeted circle

    // Enenra
    'Rokkon Enenra Kiseru Clamor 1': '8048', // initial jump that creates Bedrock Uplift earth rings
    'Rokkon Enenra Bedrock Uplift 2': '8049', // earth ring 2
    'Rokkon Enenra Bedrock Uplift 3': '804A', // earth ring 3
    'Rokkon Enenra Bedrock Uplift 4': '804B', // earth ring 4
    'Rokkon Enenra Into the Fire': '8058', // 180 cleave after Out of the Smoke
    'Rokkon Enenra Smoldering': '8050', // growing ground circle
    'Rokkon Enenra Smoke Rings': '8053', // "get out" circle collision
    'Rokkon Enenra Uplift': '8057', // followup ground circle to Snuff
  },
  gainsEffectWarn: {
    // BFF = 9999 duration, C00 = 15s duration
    'Rokkon Yozakura Sludge': 'BFF', // standing in Mudrain circles
    // C05 = 9999 duration, C06 = 15s duration
    'Rokkon Bleed': 'C05', // standing outside Yozakura, Enenra
    // BF9 = 9999 duration, BFA = 15s duration
    'Rokkon Burns': 'BF9', // standing outside Gorai
    // C01 = 9999 duration, C02 = 15s duration
    'Rokkon Electrocution': 'C01', // standing outside Shishio during lightning
    'Rokkon Yozakura Art of the Fluff Seduced': 'E28', // looking at the doggos
    'Rokkon Gorai Transfiguration': '648', // not standing in a tower
  },
  shareWarn: {
    'Rokkon Enenra Pipe Cleaner': '8055', // earth shaker line cleave
  },
  shareFail: {
    'Rokkon Enenra Snuff': '8056', // tank buster
  },
};

export default triggerSet;
