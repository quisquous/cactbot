import { Lang } from '../../resources/languages';
import { UnreachableCode } from '../../resources/not_reached';
import { getLocaleRegexes } from '../../resources/translations';
import Util from '../../resources/util';
import { Job } from '../../types/job';
import { NetAnyFields } from '../../types/net_fields';

import { Bars } from './bar';
import { kLevelMod, kMeleeWithMpJobs } from './constants';

export class RegexesHolder {
  cordialRegex: RegExp;
  countdownStartRegex: RegExp;
  countdownCancelRegex: RegExp;
  craftingStartRegexes: RegExp[];
  craftingFinishRegexes: RegExp[];
  craftingStopRegexes: RegExp[];

  constructor(lang: Lang, _playerName: string) {
    const localeRegexes = getLocaleRegexes(lang);

    // use of GP Potion
    this.cordialRegex = /20(017FD|F5A3D|F844F|0420F|0317D)/;

    this.countdownStartRegex = localeRegexes.countdownStart;
    this.countdownCancelRegex = localeRegexes.countdownCancel;
    this.craftingStartRegexes = [
      localeRegexes.craftingStart,
      localeRegexes.trialCraftingStart,
    ];
    this.craftingFinishRegexes = [
      localeRegexes.craftingFinish,
      localeRegexes.trialCraftingFinish,
    ];
    this.craftingStopRegexes = [
      localeRegexes.craftingFail,
      localeRegexes.craftingCancel,
      localeRegexes.trialCraftingFail,
      localeRegexes.trialCraftingCancel,
    ];
  }
}

export const doesJobNeedMPBar = (job: Job): boolean =>
  Util.isCasterDpsJob(job) || Util.isHealerJob(job) || kMeleeWithMpJobs.includes(job);

/** compute greased lightning stacks by player's level */
const getLightningStacksByLevel = (level: number): number =>
  level < 20 ? 1 : level < 40 ? 2 : level < 76 ? 3 : 4;

// Source: http://theoryjerks.akhmorning.com/guide/speed/
export const calcGCDFromStat = (bars: Bars, stat: number, actionDelay = 2500): number => {
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
    type2Buffs += 5 * getLightningStacksByLevel(bars.level);
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

  const mod = kLevelMod[bars.level];
  if (!mod)
    throw new UnreachableCode();
  const gcdMs = Math.floor(1000 - Math.floor(130 * (stat - mod[0]) / mod[1])) * actionDelay / 1000;
  const a = (100 - type1Buffs) / 100;
  const b = (100 - type2Buffs) / 100;
  const gcdC = Math.floor(Math.floor((a * b) * gcdMs / 10) * astralUmbralMod / 100);
  return gcdC / 100;
};

export const computeBackgroundColorFrom = (element: HTMLElement, classList: string): string => {
  const div = document.createElement('div');
  classList.split('.').forEach((item) => {
    div.classList.add(item);
  });
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

  const icon = document.createElement('timer-icon');
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
    const bar = document.createElement('timer-bar');
    bar.width = iconWidth.toString();
    bar.height = barHeight.toString();
    bar.fg = barColor;
    bar.duration = seconds;
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
  icon.duration = seconds;

  return div;
};

export const normalizeLogLine = <Fields extends NetAnyFields>(
  line: string[],
  fields: Fields,
): Record<keyof Fields, string> => {
  return new Proxy({}, {
    get(_target, property) {
      if (typeof property === 'string' && property in fields) {
        const fieldKey = fields[property as keyof Fields];
        return line[fieldKey as unknown as number];
      }
    },
  });
};
