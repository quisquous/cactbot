import ContentType from '../../resources/content_type';
import { Lang } from '../../resources/languages';
import NetRegexes from '../../resources/netregexes';
import { UnreachableCode } from '../../resources/not_reached';
import TimerBar from '../../resources/timerbar';
import TimerIcon from '../../resources/timericon';
import { LocaleNetRegex } from '../../resources/translations';
import Util from '../../resources/util';
import ZoneId from '../../resources/zone_id';
import ZoneInfo from '../../resources/zone_info';
import { Job } from '../../types/job';
import { NetAnyFields } from '../../types/net_fields';
import { ToMatches } from '../../types/net_matches';
import { CactbotBaseRegExp } from '../../types/net_trigger';

import { kLevelMod, kMeleeWithMpJobs } from './constants';
import { SpeedBuffs } from './player';

const getLocaleRegex = (locale: string, regexes: {
  'en': RegExp;
  [x: string]: RegExp;
}): RegExp => regexes[locale] ?? regexes['en'];

export class RegexesHolder {
  StatsRegex: CactbotBaseRegExp<'PlayerStats'>;
  YouGainEffectRegex: CactbotBaseRegExp<'GainsEffect'>;
  YouLoseEffectRegex: CactbotBaseRegExp<'LosesEffect'>;
  YouUseAbilityRegex: CactbotBaseRegExp<'Ability'>;
  AnybodyAbilityRegex: CactbotBaseRegExp<'Ability'>;
  MobGainsEffectRegex: CactbotBaseRegExp<'GainsEffect'>;
  MobLosesEffectRegex: CactbotBaseRegExp<'LosesEffect'>;
  MobGainsEffectFromYouRegex: CactbotBaseRegExp<'GainsEffect'>;
  MobLosesEffectFromYouRegex: CactbotBaseRegExp<'LosesEffect'>;
  cordialRegex: RegExp;
  countdownStartRegex: RegExp;
  countdownCancelRegex: RegExp;
  craftingStartRegexes: RegExp[];
  craftingFinishRegexes: RegExp[];
  craftingStopRegexes: RegExp[];

  constructor(lang: Lang, playerName: string) {
    this.StatsRegex = NetRegexes.statChange();

    this.YouGainEffectRegex = NetRegexes.gainsEffect({ target: playerName });
    this.YouLoseEffectRegex = NetRegexes.losesEffect({ target: playerName });
    this.YouUseAbilityRegex = NetRegexes.ability({ source: playerName });
    this.AnybodyAbilityRegex = NetRegexes.ability();
    this.MobGainsEffectRegex = NetRegexes.gainsEffect({ targetId: '4.{7}' });
    this.MobLosesEffectRegex = NetRegexes.losesEffect({ targetId: '4.{7}' });
    this.MobGainsEffectFromYouRegex = NetRegexes.gainsEffect({
      targetId: '4.{7}',
      source: playerName,
    });
    this.MobLosesEffectFromYouRegex = NetRegexes.losesEffect({
      targetId: '4.{7}',
      source: playerName,
    });
    // use of GP Potion
    this.cordialRegex = /20(017FD|F5A3D|F844F|0420F|0317D)/;

    const getCurrentRegex = getLocaleRegex.bind(this, lang);
    this.countdownStartRegex = getCurrentRegex(LocaleNetRegex.countdownStart);
    this.countdownCancelRegex = getCurrentRegex(LocaleNetRegex.countdownCancel);
    this.craftingStartRegexes = [
      LocaleNetRegex.craftingStart,
      LocaleNetRegex.trialCraftingStart,
    ].map(getCurrentRegex);
    this.craftingFinishRegexes = [
      LocaleNetRegex.craftingFinish,
      LocaleNetRegex.trialCraftingFinish,
    ].map(getCurrentRegex);
    this.craftingStopRegexes = [
      LocaleNetRegex.craftingFail,
      LocaleNetRegex.craftingCancel,
      LocaleNetRegex.trialCraftingFail,
      LocaleNetRegex.trialCraftingCancel,
    ].map(getCurrentRegex);
  }
}

export const doesJobNeedMPBar = (job: Job): boolean =>
  Util.isCasterDpsJob(job) || Util.isHealerJob(job) || kMeleeWithMpJobs.includes(job);

/** compute greased lightning stacks by player's level */
const getLightningStacksByLevel = (level: number): number =>
  level < 20 ? 1 : level < 40 ? 2 : level < 76 ? 3 : 4;

type PlayerLike = {
  job: Job;
  level: number;
  speedBuffs: SpeedBuffs;
};

// Source: http://theoryjerks.akhmorning.com/guide/speed/
export const calcGCDFromStat = (player: PlayerLike, stat: number, actionDelay = 2500): number => {
  // If stats haven't been updated, use a reasonable default value.
  if (stat === 0)
    return actionDelay / 1000;

  let type1Buffs = 0;
  let type2Buffs = 0;
  if (player.job === 'BLM') {
    type1Buffs += player.speedBuffs.circleOfPower ? 15 : 0;
  } else if (player.job === 'WHM') {
    type1Buffs += player.speedBuffs.presenceOfMind ? 20 : 0;
  } else if (player.job === 'SAM') {
    if (player.speedBuffs.fuka) {
      if (player.level > 77)
        type1Buffs += 13;
      else
        type1Buffs += 10;
    }
  }

  if (player.job === 'NIN') {
    type2Buffs += player.speedBuffs.huton ? 15 : 0;
  } else if (player.job === 'MNK') {
    type2Buffs += 5 * getLightningStacksByLevel(player.level);
  } else if (player.job === 'BRD') {
    type2Buffs += 4 * player.speedBuffs.paeonStacks;
    switch (player.speedBuffs.museStacks) {
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

  const mod = kLevelMod[player.level];
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

  const icon = TimerIcon.create({
    width: iconWidth.toString(),
    height: iconHeight.toString(),
    bordersize: borderSize.toString(),
    textcolor: textColor,
  });
  div.appendChild(icon);

  const barDiv = document.createElement('div');
  barDiv.style.position = 'relative';
  barDiv.style.top = iconHeight.toString();
  div.appendChild(barDiv);

  if (seconds >= 0) {
    const bar = TimerBar.create();
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
): Partial<ToMatches<Fields>> => {
  return new Proxy({}, {
    get(_target, property) {
      if (typeof property === 'string' && property in fields) {
        const looseFields: { [prop: string]: number } = fields;
        const fieldKey: number | undefined = looseFields[property];
        if (fieldKey)
          return line[fieldKey];
      }
    },
  });
};

export const isPvPZone = (zoneId: number): boolean => {
  const zoneInfo = ZoneInfo[zoneId];
  if (!zoneInfo)
    return false;
  if (zoneInfo.contentType === ContentType.Pvp || zoneId === ZoneId.WolvesDenPier)
    return true;
  return false;
};
