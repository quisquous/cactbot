import Util from '../../resources/util';
import NetRegexes from '../../resources/netregexes';
import Regexes from '../../resources/regexes';
import { LocaleRegex } from '../../resources/translations';
import { kMeleeWithMpJobs, kLevelMod } from './constants';

const getLocaleRegex = (locale, regexes) => regexes[locale] || regexes['en'];

export class RegexesHolder {
  constructor(lang, playerName) {
    this.StatsRegex = Regexes.statChange();

    this.YouGainEffectRegex = NetRegexes.gainsEffect({ target: playerName });
    this.YouLoseEffectRegex = NetRegexes.losesEffect({ target: playerName });
    this.YouUseAbilityRegex = NetRegexes.ability({ source: playerName });
    this.AnybodyAbilityRegex = NetRegexes.ability();
    this.MobGainsEffectRegex = NetRegexes.gainsEffect({ targetId: '4.{7}' });
    this.MobLosesEffectRegex = NetRegexes.losesEffect({ targetId: '4.{7}' });
    this.MobGainsEffectFromYouRegex = NetRegexes.gainsEffect({ targetId: '4.{7}', source: playerName });
    this.MobLosesEffectFromYouRegex = NetRegexes.losesEffect({ targetId: '4.{7}', source: playerName });
    // use of GP Potion
    this.cordialRegex = Regexes.ability({ source: playerName, id: '20(017FD|F5A3D|F844F|0420F|0317D)' });

    const getCurrentRegex = getLocaleRegex.bind(this, lang);
    this.countdownStartRegex = getCurrentRegex(LocaleRegex.countdownStart);
    this.countdownCancelRegex = getCurrentRegex(LocaleRegex.countdownCancel);
    this.craftingStartRegexes = [
      LocaleRegex.craftingStart,
      LocaleRegex.trialCraftingStart,
    ].map(getCurrentRegex);
    this.craftingFinishRegexes = [
      LocaleRegex.craftingFinish,
      LocaleRegex.trialCraftingFinish,
    ].map(getCurrentRegex);
    this.craftingStopRegexes = [
      LocaleRegex.craftingFail,
      LocaleRegex.craftingCancel,
      LocaleRegex.trialCraftingFail,
      LocaleRegex.trialCraftingCancel,
    ].map(getCurrentRegex);
  }
}

export function doesJobNeedMPBar(job) {
  return Util.isCasterDpsJob(job) || Util.isHealerJob(job) || kMeleeWithMpJobs.includes(job);
}

// Source: http://theoryjerks.akhmorning.com/guide/speed/
export function calcGCDFromStat(bars, stat, actionDelay) {
  // default calculates for a 2.50s recast
  actionDelay = actionDelay || 2500;

  // If stats haven't been updated, use a reasonable default value.
  if (stat === 0)
    return actionDelay / 1000;


  let type1Buffs = 0;
  let type2Buffs = 0;
  if (bars.job === 'BLM') {
    type1Buffs += bars.speedBuffs.circleOfPower ? 15 : 0;
  } else if (bars.job === 'WHM') {
    type1Buffs += bars.speedBuffs.presenceOfMind ? 20 : 0;
  } else if (bars.job === 'SAM') {
    if (bars.speedBuffs.shifu) {
      if (bars.level > 77)
        type1Buffs += 13;
      else
        type1Buffs += 10;
    }
  }

  if (bars.job === 'NIN') {
    type2Buffs += bars.speedBuffs.huton ? 15 : 0;
  } else if (bars.job === 'MNK') {
    type2Buffs += 5 * bars.speedBuffs.lightningStacks;
  } else if (bars.job === 'BRD') {
    type2Buffs += 4 * bars.speedBuffs.paeonStacks;
    switch (bars.speedBuffs.museStacks) {
    case 1:
      type2Buffs += 1;
      break;
    case 2:
      type2Buffs += 2;
      break;
    case 3:
      type2Buffs += 4;
      break;
    case 4:
      type2Buffs += 12;
      break;
    }
  }
  // TODO: this probably isn't useful to track
  const astralUmbralMod = 100;

  const gcdMs = Math.floor(1000 - Math.floor(130 * (stat - kLevelMod[bars.level][0]) /
    kLevelMod[bars.level][1])) * actionDelay / 1000;
  const a = (100 - type1Buffs) / 100;
  const b = (100 - type2Buffs) / 100;
  const gcdC = Math.floor(Math.floor((a * b) * gcdMs / 10) * astralUmbralMod / 100);
  return gcdC / 100;
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
