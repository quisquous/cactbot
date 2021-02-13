import { Util } from '../../resources/common.js';
import NetRegexes from '../../resources/netregexes.js';
import Regexes from '../../resources/regexes.js';
import { LocaleRegex } from '../../resources/translations.js';
import ComboTracker from './ComboTracker.js';
import { kAbility, kComboBreakers, kMeleeWithMpJobs } from './constants.js';

const getLocaleRegex = (locale, regexes) => regexes[locale] || regexes['en'];

export class RegexesHolder {
  constructor(lang) {
    this.StatsRegex = Regexes.statChange();

    // Regexes to be filled out once we know the player's name.
    this.YouGainEffectRegex = null;
    this.YouLoseEffectRegex = null;
    this.YouUseAbilityRegex = null;
    this.AnybodyAbilityRegex = null;
    this.MobGainsEffectRegex = null;
    this.MobLosesEffectRegex = null;
    this.MobGainsEffectFromYouRegex = null;
    this.MobLosesEffectFromYouRegex = null;

    const getCurrentRegex = getLocaleRegex.bind(this, lang);
    this.countdownStartRegex = getCurrentRegex(LocaleRegex.countdownStart);
    this.countdownCancelRegex = getCurrentRegex(LocaleRegex.countdownCancel);
    this.craftingStartRegexes = [
      getCurrentRegex(LocaleRegex.craftingStart),
      getCurrentRegex(LocaleRegex.trialCraftingStart),
    ];
    this.craftingFinishRegexes = [
      getCurrentRegex(LocaleRegex.craftingFinish),
      getCurrentRegex(LocaleRegex.trialCraftingFinish),
    ];
    this.craftingStopRegexes = [
      getCurrentRegex(LocaleRegex.craftingFail),
      getCurrentRegex(LocaleRegex.craftingCancel),
      getCurrentRegex(LocaleRegex.trialCraftingFail),
      getCurrentRegex(LocaleRegex.trialCraftingCancel),
    ];
  }
  setup(playerName) {
    this.YouGainEffectRegex = NetRegexes.gainsEffect({ target: playerName });
    this.YouLoseEffectRegex = NetRegexes.losesEffect({ target: playerName });
    this.YouUseAbilityRegex = NetRegexes.ability({ source: playerName });
    this.AnybodyAbilityRegex = NetRegexes.ability();
    this.MobGainsEffectRegex = NetRegexes.gainsEffect({ targetId: '4.{7}' });
    this.MobLosesEffectRegex = NetRegexes.losesEffect({ targetId: '4.{7}' });
    this.MobGainsEffectFromYouRegex = NetRegexes.gainsEffect({ targetId: '4.{7}', source: playerName });
    this.MobLosesEffectFromYouRegex = NetRegexes.losesEffect({ targetId: '4.{7}', source: playerName });
  }
}

export function setupComboTracker(callback) {
  const comboTracker = new ComboTracker(kComboBreakers, callback);
  // PLD
  comboTracker.AddCombo([
    kAbility.FastBlade,
    kAbility.RiotBlade,
    kAbility.GoringBlade,
  ]);
  // WAR
  comboTracker.AddCombo([
    kAbility.HeavySwing,
    kAbility.Maim,
    kAbility.StormsEye,
  ]);
  comboTracker.AddCombo([
    kAbility.HeavySwing,
    kAbility.Maim,
    kAbility.StormsPath,
  ]);
  comboTracker.AddCombo([
    kAbility.Overpower,
    kAbility.MythrilTempest,
  ]);
  // DRK
  comboTracker.AddCombo([
    kAbility.HardSlash,
    kAbility.SyphonStrike,
    kAbility.Souleater,
  ]);
  comboTracker.AddCombo([
    kAbility.Unleash,
    kAbility.StalwartSoul,
  ]);
  // GNB
  comboTracker.AddCombo([
    kAbility.KeenEdge,
    kAbility.BrutalShell,
    kAbility.SolidBarrel,
  ]);
  comboTracker.AddCombo([
    kAbility.DemonSlice,
    kAbility.DemonSlaughter,
  ]);
  // DRG
  comboTracker.AddCombo([
    kAbility.TrueThrust,
    kAbility.Disembowel,
    kAbility.ChaosThrust,
  ]);
  comboTracker.AddCombo([
    kAbility.RaidenThrust,
    kAbility.Disembowel,
    kAbility.ChaosThrust,
  ]);
  // NIN
  comboTracker.AddCombo([
    kAbility.SpinningEdge,
    kAbility.GustSlash,
    kAbility.AeolianEdge,
  ]);
  comboTracker.AddCombo([
    kAbility.SpinningEdge,
    kAbility.GustSlash,
    kAbility.ArmorCrush,
  ]);
  comboTracker.AddCombo([
    kAbility.DeathBlossom,
    kAbility.HakkeMujinsatsu,
  ]);
  // MCH
  comboTracker.AddCombo([
    kAbility.SplitShot,
    kAbility.SlugShot,
    kAbility.CleanShot,
  ]);
  comboTracker.AddCombo([
    kAbility.HeatedSplitShot,
    kAbility.SlugShot,
    kAbility.CleanShot,
  ]);
  comboTracker.AddCombo([
    kAbility.HeatedSplitShot,
    kAbility.HeatedSlugShot,
    kAbility.CleanShot,
  ]);
  comboTracker.AddCombo([
    kAbility.HeatedSplitShot,
    kAbility.HeatedSlugShot,
    kAbility.HeatedCleanShot,
  ]);
  // DNC
  comboTracker.AddCombo([
    kAbility.Cascade,
    kAbility.Fountain,
  ]);
  comboTracker.AddCombo([
    kAbility.Windmill,
    kAbility.Bladeshower,
  ]);
  return comboTracker;
}

export function doesJobNeedMPBar(job) {
  return Util.isCasterDpsJob(job) || Util.isHealerJob(job) || kMeleeWithMpJobs.includes(job);
}

export function computeBackgroundColorFrom(element, classList) {
  const div = document.createElement('div');
  const classes = classList.split('.');
  for (let i = 0; i < classes.length; ++i)
    div.classList.add(classes[i]);
  element.appendChild(div);
  const color = window.getComputedStyle(div).backgroundColor;
  element.removeChild(div);
  return color;
}
