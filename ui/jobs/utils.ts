import { Lang } from '../../types/global';
import { Job } from '../../types/job';
import Util from '../../resources/util';
import NetRegexes from '../../resources/netregexes';
import { LocaleRegex } from '../../resources/translations';
import TimerIcon from '../../resources/timericon';
import TimerBar from '../../resources/timerbar';
import { Bars } from './jobs';
import { kMeleeWithMpJobs, kLevelMod } from './constants';

const getLocaleRegex = (locale: Lang, regexes: Record<Lang, RegExp>): RegExp => regexes[locale] || regexes['en'];

export class RegexesHolder {
  StatsRegex: RegExp;
  YouGainEffectRegex: RegExp | null;
  YouLoseEffectRegex: RegExp | null;
  YouUseAbilityRegex: RegExp | null;
  AnybodyAbilityRegex: RegExp | null;
  MobGainsEffectRegex: RegExp | null;
  MobLosesEffectRegex: RegExp | null;
  MobGainsEffectFromYouRegex: RegExp | null;
  MobLosesEffectFromYouRegex: RegExp | null;
  countdownStartRegex: RegExp;
  countdownCancelRegex: RegExp;
  craftingStartRegexes: RegExp[];
  craftingFinishRegexes: RegExp[];
  craftingStopRegexes: RegExp[];
  constructor(lang: Lang) {
    this.StatsRegex = NetRegexes.statChange();

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
  setup(playerName: string): void {
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

export const doesJobNeedMPBar = (job: Job): boolean => {
  return Util.isCasterDpsJob(job) || Util.isHealerJob(job) || kMeleeWithMpJobs.includes(job);
};

// Source: http://theoryjerks.akhmorning.com/guide/speed/
export const calcGCDFromStat = (bars: Bars, stat: number, actionDelay?: number): number => {
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
      else type1Buffs += 10;
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

  const levelMod = kLevelMod[bars.level] ?? [0, 0];

  const gcdMs = Math.floor(1000 - Math.floor(130 * (stat - levelMod[0]) /
    levelMod[1])) * actionDelay / 1000;
  const a = (100 - type1Buffs) / 100;
  const b = (100 - type2Buffs) / 100;
  const gcdC = Math.floor(Math.floor((a * b) * gcdMs / 10) * astralUmbralMod / 100);
  return gcdC / 100;
};

export const computeBackgroundColorFrom = (element: HTMLElement, classList: string): string => {
  const div = document.createElement('div');
  const classes = classList.split('.');
  classes.forEach((className) => div.classList.add(className));
  element.appendChild(div);
  const color = window.getComputedStyle(div).backgroundColor;
  element.removeChild(div);
  return color;
};

export const makeAuraTimerIcon = (
    name: string,
    seconds: number,
    opacity: number,
    iconWidth: number,
    iconHeight: number,
    iconText: string,
    barHeight: number,
    textHeight: number,
    textColor: string,
    borderSize: number,
    borderColor: string,
    barColor: string,
    auraIcon: string,
): HTMLDivElement => {
  const div = document.createElement('div');
  div.style.opacity = opacity.toString();

  const icon = document.createElement('timer-icon') as TimerIcon;
  icon.width = iconWidth.toString();
  icon.height = iconHeight.toString();
  icon.bordersize = borderSize.toString();
  icon.textcolor = textColor;
  div.appendChild(icon);

  const barDiv = document.createElement('div');
  barDiv.style.position = 'relative';
  barDiv.style.top = iconHeight.toString();
  div.appendChild(barDiv);

  if (seconds >= 0) {
    const bar = document.createElement('timer-bar') as unknown as TimerBar;
    bar.width = iconWidth.toString();
    bar.height = barHeight.toString();
    bar.fg = barColor;
    bar.duration = seconds.toString();
    barDiv.appendChild(bar);
  }

  if (textHeight > 0) {
    const text = document.createElement('div');
    text.classList.add('text');
    text.style.width = iconWidth.toString();
    text.style.height = textHeight.toString();
    text.style.overflow = 'hidden';
    text.style.fontSize = (textHeight - 1).toString();
    text.style.whiteSpace = 'pre';
    text.style.position = 'relative';
    text.style.top = iconHeight.toString();
    text.style.fontFamily = 'arial';
    text.style.fontWeight = 'bold';
    text.style.color = textColor;
    text.style.textShadow = '-1px 0 3px black, 0 1px 3px black, 1px 0 3px black, 0 -1px 3px black';
    text.style.paddingBottom = (textHeight / 4).toString();

    text.innerText = name;
    div.appendChild(text);
  }

  if (iconText)
    icon.text = iconText;
  icon.bordercolor = borderColor;
  icon.icon = auraIcon;
  icon.duration = seconds.toString();

  return div;
};
