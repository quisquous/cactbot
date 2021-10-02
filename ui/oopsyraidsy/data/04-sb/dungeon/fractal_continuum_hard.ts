import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// TODO: Dischordant Cleansing (279C) first, then 297A?

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheFractalContinuumHard,
  damageWarn: {
    'FractalHard Prototype Claw Shred': '1257', // line aoe
    'FractalHard Prototype Claw The Hand': '1258', // conal
    'FractalHard Servomechanical Minotaur 16-Tonze Swipe': '2AE5', // untelegraphed conal
    'FractalHard Servomechanical Minotaur 128-Tonze Swing': '2AE4', // telegraphed large circle
    // These apply to both Servomechanical Chimera and Proto-Chimera.
    'FractalHard Chimera The Ram\s Breath': '122A', // conal
    'FractalHard Chimera The Dragon\s Breath': '122B', // conal
    'FractalHard Chimera The Dragon\s Voice': '861', // untelegraphed donut
    'FractalHard Chimera The Ram\'s Voice': '860', // untelegraphed centered circle
    'FractalHard Chimera The Lion\'s Breath': '85F', // conal
    'FractalHard Motherbit Prototype Bit Diffractive Laser': '27A8', // line aoe
    'FractalHard Motherbit Prototype Bit Hypercurrent': '27AC', // hitting the bit line laser during Citadel Buster
    'FractalHard Motherbit Allagan Gravity': '27A6', // spread marker
    'FractalHard Motherbit Citadel Buster': '27A5', // front 180 laser
    'FractalHard Prototype Mirrorknight Gust': '865', // targeted circle
    'FractalHard Rinkhals Regorge': '25B8', // targeted circle
    'FractalHard Ultima Warrior Citadel Buster': '2792', // untelegraphed front line laser
    'FractalHard Ultima Warrior Ein Sof': '2798', // Sephirot phase being in the green growing bubble
    'FractalHard Biomanufactured Minotaur 11-Tonze Swipe': '29A2', // untelegraphed conal
    'FractalHard Biomanufactured Minotaur 111-Tonze Swing': '29A1', // telegraphed large circle
    'Fractalhard Ultima Beast Death Spin': '27AD', // melee range untelegraphed circle
    'Fractalhard Ultima Beast Aether Bend': '27AF', // get under donut
    'Fractalhard Ultima Beast Light Pillar 1': '227BA', // initial point of light pillar circles
    'Fractalhard Ultima Beast Light Pillar 2': '27BB', // follow up light pillar hits
  },
  damageFail: {
    'FractalHard Motherbit False Gravity': '27A7', // standing in Allagan Gravity puddle, gives Heavy
  },
  gainsEffectWarn: {
    'FractalHard Ultima Warrior Infinite Anguish': '487', // Personally failing Zurvan towers
    'FractalHard Ultima Warrior Reduced Immunity': '143', // Failing Sophia Dischordant Cleansing
    'Fractalhard Ultima Beast Burns': '11C', // standing in fire from Flare Star
  },
  shareWarn: {
    'FractalHard Ultima Warrior Aetheroplasm': '2793', // tankbuster cleave
    'FractalHard Ultima Warrior Ratzon': '2797', // Sephirot phase bubble drop
    'Fractalhard Ultima Beast Allagan Gravity': '27B9', // spread
  },
  soloWarn: {
    'FractalHard Ultima Warrior Mass Aetheroplasm': '2795', // tankbuster cleave
  },
};

export default triggerSet;
