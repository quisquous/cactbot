import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// TODO: technically Shockwave (82CF) the dash before Palladion cleaves, but this seems tough to avoid

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AnabaseiosTheTwelfthCircle,
  damageWarn: {
    'P12N Trinity of Souls 1': '82C1', // top right wing cleave
    'P12N Trinity of Souls 2': '82C2', // top left wing cleave
    'P12N Trinity of Souls 3': '82C3', // middle right wing cleave
    'P12N Trinity of Souls 4': '82C4', // middle left wing cleave
    'P12N Trinity of Souls 5': '82C5', // bottom right wing cleave
    'P12N Trinity of Souls 6': '82C6', // bottom left wing cleave
    'P12N Ray of Light Paradeigma': '82C8', // line cleave from Paradeigma adds
    'P12N Superchain Burst': '82BD', // sphere explosion during Superchain Theory
    'P12N Superchain Coil': '82BE', // donut explosion during Superchain Theory
    'P12N Parthenos': '82D8', // late telegraph wide line knockback cleave
    'P12N Anthropos Ray of Light': '82D4', // line cleave from Anthropos adds during add phase
    'P12N Anthropos Clear Cut': '82D3', // 270 degree small "conal" cleave from Anthropos adds
    'P12N Palladion Ultima': '82D1', // large line taking out half the floor before Ultima
  },
  damageFail: {
    'P12N Sample': '82C0', // platform falling from Unnatural Enchainment
  },
  gainsEffectWarn: {
    // C05 is the infinite effect, C06 is the 15s effect
    'P12N Bleeding': 'C05', // standing in the bad hexagon during add phase
  },
  shareWarn: {
    'P12N Anthropos White Flame': '82CA', // tethered line cleave from Paradeigma adds
    'P12N Palladion Spread': '82CE', // spread markers during add phase
    'P12N Dialogos Spread': '82D7', // spread markers after Dialogos (stack)
  },
  shareFail: {
    'P12N Glaukopis': '82D5', // tank laser cleave
  },
  soloFail: {
    'P12N Dialogos Stack': '82D6', // stack marker from Dialogos cast bar
  },
};

export default triggerSet;
