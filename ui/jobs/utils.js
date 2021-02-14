import { Util } from '../../resources/common.js';
import NetRegexes from '../../resources/netregexes.js';
import Regexes from '../../resources/regexes.js';
import { LocaleRegex } from '../../resources/translations.js';
import { kMeleeWithMpJobs } from './constants.js';

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

export function makeAuraTimerIcon(name, seconds, opacity, iconWidth, iconHeight, iconText,
    barHeight, textHeight, textColor, borderSize, borderColor, barColor, auraIcon) {
  const div = document.createElement('div');
  div.style.opacity = opacity;

  const icon = document.createElement('timer-icon');
  icon.width = iconWidth;
  icon.height = iconHeight;
  icon.bordersize = borderSize;
  icon.textcolor = textColor;
  div.appendChild(icon);

  const barDiv = document.createElement('div');
  barDiv.style.position = 'relative';
  barDiv.style.top = iconHeight;
  div.appendChild(barDiv);

  if (seconds >= 0) {
    const bar = document.createElement('timer-bar');
    bar.width = iconWidth;
    bar.height = barHeight;
    bar.fg = barColor;
    bar.duration = seconds;
    barDiv.appendChild(bar);
  }

  if (textHeight > 0) {
    const text = document.createElement('div');
    text.classList.add('text');
    text.style.width = iconWidth;
    text.style.height = textHeight;
    text.style.overflow = 'hidden';
    text.style.fontSize = textHeight - 1;
    text.style.whiteSpace = 'pre';
    text.style.position = 'relative';
    text.style.top = iconHeight;
    text.style.fontFamily = 'arial';
    text.style.fontWeight = 'bold';
    text.style.color = textColor;
    text.style.textShadow = '-1px 0 3px black, 0 1px 3px black, 1px 0 3px black, 0 -1px 3px black';
    text.style.paddingBottom = textHeight / 4;

    text.innerText = name;
    div.appendChild(text);
  }

  if (iconText)
    icon.text = iconText;
  icon.bordercolor = borderColor;
  icon.icon = auraIcon;
  icon.duration = seconds;

  return div;
}
