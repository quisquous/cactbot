import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// TODO: people not in 8AF2 Sable Thread line stack
// TODO: people not in 8B13 Flare tower
// TODO: people not taking 8B0D and failing meteors(???)

// Note: 8BB5 Scald is not mentioned as it's light damage and many hit by the first

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheAbyssalFracture,
  damageWarn: {
    'Zeromus Abyssal Echoes': '8AFA', // big lit up glowing circles from lines on floor
    'Zeromus Nox 1': '8D29', // initial orb circle damage
    'Zeromus Nox 2': '8D23', // chasing orb damage
    'Zeromus Flare': '8B15', // standing in post-tower meteor circle
    'Zeromus Prominence Spine': '8B16', // line aoes from post-tower meteor circle
    'Zeromus Visceral Whirl 1': '8AFC', // claw swipe damage from NE/SW safe
    'Zeromus Visceral Whirl 2': '8AFD', // claw swipe damage from NE/SW safe
    'Zeromus Visceral Whirl 3': '8AFE', // claw swipe damage from NW/SE safe
    'Zeromus Visceral Whirl 4': '8AFF', // claw swipe damage from NW/SE safe
    'Zeromus Toxic Bubble Burst': '8B18', // hitting a Void Bio bubble
    'Zeromus Big Bang': '8B05', // ground circles during Big Bang cast
    'Zeromus Fractured Eventide 1': '8AF5', // initial damage from Eventide line (NE safe)
    'Zeromus Fractured Eventide 2': '8C46', // initial damage from Eventide line (NW safe)
    'Zeromus Fractured Eventide 3': '8AF6', // ongoing damage from Eventide line
    'Zeromus Big Crunch': '8D30', // ground circles during Big Crunch cast
    'Zeromus Dimension Surge 1': '8B31', // ground circle damage after Rend the Rift
    'Zeromus Dimension Surge 2': '8B32', // small ground circle damage attached to 8B33 lines after Rend the Rift
    'Zeromus Dimension Surge 3': '8B33', // ground line damage attached to 8B32 circles
    'Zeromus Dimension Surge Line': '8B35', // large white line cleave from wall
    'Zeromus Akh Rhai': '8B24', // ongoing Akh Rhai damage
    'Zeromus Chasmic Nails 1': '82BC', // first damage
    'Zeromus Chasmic Nails 2': '82BD', // second damage
    'Zeromus Chasmic Nails 3': '82BE', // third damage
    'Zeromus Chasmic Nails 4': '82BF', // fourth damage
    'Zeromus Chasmic Nails 5': '8230', // fifth damage
  },
  shareWarn: {
    'Zeromus The Dark Divides': '8B09', // Big Bang spread
  },
  shareFail: {
    'Zeromus Dark Matter': '8B37', // tankbuster
  },
  soloWarn: {
    'Zeromus The Dark Beckons': '8B0A', // Big Bang stack
  },
};

export default triggerSet;
