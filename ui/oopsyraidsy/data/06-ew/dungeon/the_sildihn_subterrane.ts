import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheSildihnSubterrane,
  damageWarn: {
    // Trash
    'Sildihn Aqueduct Wamoura Poison Dust': '77CC', // frontal conal
    'Silidhn Aqueduct Gigantoad Labored Leap': '77CE', // centered circle after Sticky Tongue
    'Sildihn Aqueduct Ameretat Bad Breath': '77CF', // frontal conal
    'Sildihn Forgotten Head Butt': '77D0', // Forgotten Sabotender/Forgotten Cliffmole
    'Sildihn Forgotten Campeador Several Thousand Needles': '77D1',
    'Sildihn Forgotten Phoebad Boulder Toss': '77D4', // targeted circle
    'Sildihn Forgotten Phoebad Landslip': '77D3', // frontal 135 degree conal
    'Sildihn Aqueduct Uragnite Palsynyxis': '77C2', // frontal conal
    'Sildihn Aqueduct Eft Bog Bomb': '77C3', // targeted small circle
    'Sildihn Aqueduct Goobbue Heavy Toss': '77C6', // frontal 90 degree conal after Inhale
    'Sildihn Aqueduct Adamantoise Tortoise Stomp': '77C7', // large centered circle
    'Sildihn Aqueduct Golem Acclaim': '7A34', // frontal 90 degree conal
    'Sildihn Aqueduct Leshy Creeping Ivy': '77C8', // frontal 90 degree conal
    'Sildihn Aqueduct Odqan Gelid Gale': '77C9', // targeted circle
    'Sildihn Forgotten Drake Burning Cyclone': '77D6', // various Drakes frontal 90 degree conal
    'Sildihn Forgotten Wraith Dark': '77D7', //  targeted circle
    'Sildihn Forgotten Revenant Unending Woe': '77D8', // centered circle
    'Sildihn Water Sprite Aqua Globe': '77DA', // very large centered circle
    'Sildihn Aqueduct Sarcosuchus Critical Bite': '77DB', // frontal 135 degree conal
    'Sildihn Aqueduct Elbst Aqua Roar': '77DC', // large targeted circle
    'Sildihn Dhruva Water II': '77DE', // centered circle
    'Sildihn Dullahan Blighted Gloom': '77E0', // large centered circle
    'Sildihn Dullahan Cloudcover': '77DF', // targeted circle
    'Sildihn Hollow Dominion Slash': '77E2', // frontal conal
    'Sildihn Visage Dark Fire III': '77E3', // targeted circle
    'Sildihn Python Regorge': '77EF', // targeted circle
    'Sildihn Python Whip Back': '77E4', // backwards 90 degree conal

    // Various Geryon the Steer
    'Sildihn Geryon Powder Keg Explosion 1': '74D4', // blue/red barrel explosion
    'Sildihn Geryon Powder Keg Explosion 2': '74D5', // blue/red barrel explosion
    'Sildihn Geryon Colossal Slam': '74D0', // targeted conal
    'Sildihn Geryon Colossal Swing': '74D1', // 180 cleave
    'Sildihn Geryon Gigatomill': '74CB', // rotating cross attack
    'Sildihn Geryon Runaway Sludge': '74D6', // initial sludge circles (left)
    'Sildihn Geryon Rolling Boulder': '74DA', // boulders rolling (middle)
    'Sildihn Geryon Suddenly Sewage': '74D8', // water quadrant explosion (right)

    // Silkie
    'Sildihn Silkie Squeaky Right 1': '772F', // long 135 right cleave
    'Sildihn Silkie Squeaky Right 2': '7730', // long 135 right cleave
    'Sildihn Silkie Squeaky Right 3': '7731', // long 135 right cleave
    'Sildihn Silkie Squeaky Left 1': '7732', // long 135 left cleave
    'Sildihn Silkie Squeaky Left 2': '7733', // long 135 left cleave
    'Sildihn Silkie Squeaky Left 3': '7734', // long 135 left cleave
    'Sildihn Silkie Chilling Duster 1': '7738', // cross
    'Sildihn Silkie Chilling Duster 2': '773B', // cross after Slippery Soap
    'Sildihn Silkie Chilling Duster 3': '773F', // cross from Puff
    'Sildihn Silkie Bracing Duster 1': '7739', // donut
    'Sildihn Silkie Bracing Duster 2': '773C', // donut after Slippery Soap
    'Sildihn Silkie Slippery Soap': '773A', // charge
    'Sildihn Silkie Spot Remover': '7743', // puddles appearing
    'Sildihn Silkie Eastern Ewer Rinse': '7749', // ewers from 01 branch
    'Sildihn Silkie Puff and Tumble 1': '774A', // brooms from 04 branch
    'Sildihn Silkie Puff and Tumble 2': '774B', // brooms from 04 branch
    'Sildihn Silkie Puff and Tumble 3': '774C', // brooms from 04 branch
    'Sildihn Silkie Puff and Tumble 4': '77C0', // brooms from 04 branch

    // Gladiator of Sil'dih
    'Sildihn Gladiator Ring of Might Out 1': '763F', // ring 1 out
    'Sildihn Gladiator Ring of Might Out 2': '7640', // ring 2 out
    'Sildihn Gladiator Ring of Might Out 3': '7641', // ring 2 out
    'Sildihn Gladiator Ring of Might In 1': '7642', // ring 2 in
    'Sildihn Gladiator Ring of Might In 2': '7643', // ring 2 in
    'Sildihn Gladiator Ring of Might In 3': '7644', // ring 2 in
    'Sildihn Gladiator Rush of Might Front': '763D', // initial 180 cleave in front
    'Sildihn Gladiator Rush of Might Back': '763E', // followup 180 cleave behind
    'Sildihn Gladiator Sculptor\'s Passion': '764A', // front line
    'Sildihn Gladiator Regret Rack and Ruin': '7646', // checkerboard line aoes

    'Sildihn Gladiator Biting Wind Small Initial': '79F6', // initial wind circles
    'Sildihn Gladiator Biting Wind Small': '79F7', // small wind circles (that should be avoided)
    'Sildihn Gladiator Biting Wind Big Initial': '79FD', // initial wind circle with big updraft
    'Sildihn Gladiator Shattering Steel': '764B', // dodgeable roomwide aoe via wind/boulders
    'Sildihn Gladiator Hateful Visage Golden Flame': '7652', // statue line aoes
    'Sildihn Gladiator Hateful Visgae Silver Flame 1': '7653', // statue rotating line aoe
    'Sildihn Gladiator Hateful Visgae Silver Flame 2': '7654', // statue rotating line aoe
    'Sildihn Gladiator Hateful Visgae Silver Flame 3': '7655', // statue rotating line aoe

    // Shadowcaster Zeless Gah
    'Sildihn Shadowcaster Ball of Fire Burn': '748F', // circular explosion from fireballs
    'Sildihn Shadowcaster Arcane Font Blazing Benifice': '74A5', // line aoe from portal
    'Sildihn Shadowcaster Pure Fire': '74A0', // targeted ground circles
    'Sildihn Shadowcaster Cast Shadow 1': '749B', // first hit of Cast Shadow
    'Sildihn Shadowcaster Cast Shadow 2': '749D', // second hit of Cast Shadow
    'Sildihn Shadowcaster Tresspasser\'s Pyre': '7498', // hitting Infirm Ward lasers

    // Thorne Knight
    'Sildihn Thorne Magicked Puppet Magic Cannon': '70F7', // blue line aoe
    'Sildihn Thorne Amalj\'aa Artillery Carriage Amalj\'aa Artillery': '70F8', // orange line aoe
    'Sildihn Thorne Fore Honor': '70EC', // forward 180 cleave
    'Sildihn Thorne Blazing Beacon 1': '70F9', // orange Slashburn cleave
    'Sildihn Thorne Blazing Beacon 2': '7100', // reversed orange Slashburn cleave
    'Sildihn Thorne Sacred Flay 1': '70FA', // split blue Slashburn cleaves
    'Sildihn Thorne Sacred Flay 2': '7101', // reversed split blue Slashburn cleaves
    'Sildihn Thorne Ball of Fire Explosion': '70FD', // Blaze of Glory orbs
  },
  gainsEffectWarn: {
    'Sildihn Sludge': 'B84', // puddles from not turning on the water pump
    'Sildihn Dropsy': '827', // puddles during Silkie Dust Bluster knockback
    'Sildihn Toxicosis': 'C0A', // standing outside arena 1 (C09 is the infinite duration effect)
    'Sildihn Bleeding': 'C06', // standing outside arena 2 (C05 is the infinite duration effect)
  },
  shareFail: {
    'Sildihn Geryon Colossal Strike': '74CF', // tankbuster (probably cleaves?)
  },
};

export default triggerSet;
