import ZoneId from '../../../../../resources/zone_id';
import { SimpleOopsyTriggerSet } from '../../../../../types/oopsy';

export { OopsyData as Data } from '../../../../../types/data';

// TODO: What to do about Kahn Rai 5B50?
// It seems impossible for the marked person to avoid entirely.

const triggerSet: SimpleOopsyTriggerSet = {
  zoneId: ZoneId.Paglthan,
  damageWarn: {
    'Paglthan Telovouivre Plague Swipe': '60FC', // frontal conal cleave
    'Paglthan Lesser Telodragon Engulfing Flames': '60F5', // frontal conal cleave
    'Paglthan Amhuluk Lightning Bolt': '5C4C', // circular lightning aoe (on self or post)
    'Paglthan Amhuluk Ball Of Levin Shock': '5C52', // pulsing small circular aoes
    'Paglthan Amhuluk Supercharged Ball Of Levin Shock': '5C53', // pulsing large circular aoe
    'Paglthan Amhuluk Wide Blaster': '60C5', // rear conal cleave
    'Paglthan Telobrobinyak Fall Of Man': '6148', // circular aoe
    'Paglthan Telotek Reaper Magitek Cannon': '6121', // circular aoe
    'Paglthan Telodragon Sheet of Ice': '60F8', // circular aoe
    'Paglthan Telodragon Frost Breath': '60F7', // very large conal cleave
    'Paglthan Magitek Core Stable Cannon': '5C94', // large line aoes
    'Paglthan Magitek Core 2-Tonze Magitek Missile': '5C95', // large circular aoe
    'Paglthan Telotek Sky Armor Aethershot': '5C9C', // circular aoe
    'Paglthan Mark II Telotek Colossus Exhaust': '5C99', // large line aoe
    'Paglthan Magitek Missile Explosive Force': '5C98', // slow moving horizontal missiles
    'Paglthan Tiamat Flamisphere': '610F', // very long line aoe
    'Paglthan Armored Telodragon Tortoise Stomp': '614B', // large circular aoe from turtle
    'Paglthan Telodragon Thunderous Breath': '6149', // large conal cleave
    'Paglthan Lunar Bahamut Lunar Nail Upburst': '605B', // small aoes before Big Burst
    'Paglthan Lunar Bahamut Lunar Nail Big Burst': '5B48', // large circular aoes from nails
    'Paglthan Lunar Bahamut Perigean Breath': '5B59', // large conal cleave
    'Paglthan Lunar Bahamut Megaflare': '5B4E', // megaflare pepperoni
    'Paglthan Lunar Bahamut Megaflare Dive': '5B52', // megaflare line aoe across the arena
    'Paglthan Lunar Bahamut Lunar Flare': '5B4A', // large purple shrinking circles
  },
  shareWarn: {
    'Paglthan Lunar Bahamut Megaflare': '5B4D', // megaflare spread markers
  },
};

export default triggerSet;
