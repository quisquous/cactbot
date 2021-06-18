import { JobsOptions } from './types';

import WidgetList from '../../resources/widget_list';
import EffectId from '../../resources/effect_id';
import { MatchesAbility, MatchesGainsEffect, MatchesLosesEffect } from '../../resources/matches';
import PartyTracker from '../../resources/party';

import potionImage from '../../resources/ffxiv/status/potion.png';
import astralImage from '../../resources/ffxiv/status/astral.png';
import umbralImage from '../../resources/ffxiv/status/umbral.png';
import physicalImage from '../../resources/ffxiv/status/physical.png';
import offguardImage from '../../resources/ffxiv/status/offguard.png';
import peculiarLightImage from '../../resources/ffxiv/status/peculiar-light.png';
import trickAttackImage from '../../resources/ffxiv/status/trick-attack.png';
import battleLitanyImage from '../../resources/ffxiv/status/battle-litany.png';
import emboldenImage from '../../resources/ffxiv/status/embolden.png';
import arrowImage from '../../resources/ffxiv/status/arrow.png';
import balanceImage from '../../resources/ffxiv/status/balance.png';
import boleImage from '../../resources/ffxiv/status/bole.png';
import ewerImage from '../../resources/ffxiv/status/ewer.png';
import spearImage from '../../resources/ffxiv/status/spear.png';
import spireImage from '../../resources/ffxiv/status/spire.png';
import ladyOfCrownsImage from '../../resources/ffxiv/status/lady-of-crowns.png';
import lordOfCrownsImage from '../../resources/ffxiv/status/lord-of-crowns.png';
import devilmentImage from '../../resources/ffxiv/status/devilment.png';
import standardFinishImage from '../../resources/ffxiv/status/standard-finish.png';
import technicalFinishImage from '../../resources/ffxiv/status/technical-finish.png';
import battleVoiceImage from '../../resources/ffxiv/status/battlevoice.png';
import chainStratagemImage from '../../resources/ffxiv/status/chain-stratagem.png';
import dragonSightImage from '../../resources/ffxiv/status/dragon-sight.png';
import brotherhoodImage from '../../resources/ffxiv/status/brotherhood.png';
import devotionImage from '../../resources/ffxiv/status/devotion.png';
import divinationImage from '../../resources/ffxiv/status/divination.png';

import { kAbility } from './constants';
import { makeAuraTimerIcon } from './utils';

export interface BuffInfo {
  name: string;
  cooldownAbility?: string[];
  gainEffect?: string[];
  loseEffect?: string[];
  mobGainsEffect?: string;
  mobLosesEffect?: string;
  durationSeconds?: number;
  useEffectDuration?: boolean;
  icon: string;
  side?: 'left' | 'right';
  borderColor: string;
  sortKey: number;
  cooldown?: number;
  sharesCooldownWith?: string[];
  hide?: boolean;
  stack?: number;
  partyOnly?: boolean;
}

export interface Aura {
  addCallback: () => void;
  removeCallback: () => void;
  addTimeout: number | null;
  /** id in `window.clearTimeout(id)` */
  removeTimeout: number | null;
}

// TODO: consider using real times and not setTimeout times as these can drift.
export class Buff {
  name: string;
  info: BuffInfo;
  options: JobsOptions;
  activeList: WidgetList;
  cooldownList: WidgetList;
  readyList: WidgetList;
  active: Aura | null;
  cooldown: { [s: string]: Aura };
  ready: { [s: string]: Aura };
  readySortKeyBase: number;
  cooldownSortKeyBase: number;

  constructor(name: string, info: BuffInfo, list: WidgetList, options: JobsOptions) {
    this.name = name;
    this.info = info;
    this.options = options;

    // TODO: these should be different ui elements.
    // TODO: or maybe add some buffer between sections?
    this.activeList = list;
    this.cooldownList = list;
    this.readyList = list;

    // tracked auras
    this.active = null;
    this.cooldown = {};
    this.ready = {};

    // Hacky numbers to sort active > ready > cooldowns by adjusting sort keys.
    this.readySortKeyBase = 1000;
    this.cooldownSortKeyBase = 2000;
  }

  addCooldown(source: string, effectSeconds: number): void {
    if (!this.info.cooldown)
      return;
    // Remove any preexisting cooldowns with the same name in case they unexpectedly exist.
    this.cooldown[source]?.removeCallback();

    const cooldownKey = 'c:' + this.name + ':' + source;

    let secondsUntilShow = this.info.cooldown - this.options.BigBuffShowCooldownSeconds;
    secondsUntilShow = Math.min(Math.max(effectSeconds, secondsUntilShow, 1), this.info.cooldown);
    const showSeconds = this.info.cooldown - secondsUntilShow;
    const addReadyCallback = () => {
      this.addReady(source);
    };

    this.cooldown[source] = this.makeAura(cooldownKey, this.cooldownList, showSeconds,
        secondsUntilShow, this.cooldownSortKeyBase, 'grey', '', 0.5, addReadyCallback);
  }

  addReady(source: string): void {
    // Remove any preexisting cooldowns with the same name in case they unexpectedly exist.
    this.ready[source]?.removeCallback();

    // TODO: could consider looking at the party list to make initials unique?
    const initials = source.split(' ');
    let txt = '';
    if (initials.length === 2)
      txt = initials.map((str) => str.charAt(0)).join('');
    else
      txt = initials[0] ?? '';

    const color = this.info.borderColor;

    const readyKey = 'r:' + this.name + ':' + source;
    this.ready[source] = this.makeAura(readyKey, this.readyList, -1, 0,
        this.readySortKeyBase, color, txt, 0.6);

    // if a readied raidbuff not be used in 3min, we can assume that
    // this player has left the battlefield, or at least his raidbuff is unexpectable.
    setTimeout(() => {
      this.ready[source]?.removeCallback();
    }, 3 * 60 * 1000);
  }

  makeAura(
      key: string,
      list: WidgetList,
      seconds: number,
      secondsUntilShow: number,
      adjustSort: number,
      textColor: string,
      txt: string,
      opacity: number,
      expireCallback?: () => void,
  ): Aura {
    const aura: Aura = {
      removeCallback: () => {
        list.removeElement(key);
        if (aura.addTimeout) {
          window.clearTimeout(aura.addTimeout);
          aura.addTimeout = null;
        }
        if (aura.removeTimeout) {
          window.clearTimeout(aura.removeTimeout);
          aura.removeTimeout = null;
        }
      },

      addCallback: () => {
        const elem = makeAuraTimerIcon(
            key, seconds, opacity,
            this.options.BigBuffIconWidth, this.options.BigBuffIconHeight,
            txt,
            this.options.BigBuffBarHeight, this.options.BigBuffTextHeight,
            textColor,
            this.options.BigBuffBorderSize,
            this.info.borderColor, this.info.borderColor,
            this.info.icon);
        list.addElement(key, elem, this.info.sortKey + adjustSort);
        aura.addTimeout = null;

        if (seconds > 0) {
          aura.removeTimeout = window.setTimeout(() => {
            aura.removeCallback();
            expireCallback?.();
          }, seconds * 1000);
        }
      },

      removeTimeout: null,

      addTimeout: null,
    };

    if (secondsUntilShow > 0)
      aura.addTimeout = window.setTimeout(aura.addCallback, secondsUntilShow * 1000);
    else
      aura.addCallback();


    return aura;
  }

  clear(): void {
    this.onLose();

    Object.values(this.cooldown).forEach((aura) => {
      aura.removeCallback();
    });

    Object.values(this.ready).forEach((aura) => {
      aura.removeCallback();
    });
  }

  clearCooldown(source: string): void {
    const ready = this.ready[source];
    if (ready)
      ready.removeCallback();
    const cooldown = this.cooldown[source];
    if (cooldown)
      cooldown.removeCallback();
  }

  onGain(seconds: number): void {
    this.onLose();
    this.active = this.makeAura(this.name, this.activeList, seconds, 0, 0, 'white', '', 1);
  }

  onLose(): void {
    if (!this.active)
      return;
    this.active.removeCallback();
    this.active = null;
  }

  onCooldown(seconds: number, source: string): void {
    this.clearCooldown(source);
    this.addCooldown(source, seconds);
  }
}

export class BuffTracker {
  buffInfo: { [s: string]: Omit<BuffInfo, 'name'> };
  options: JobsOptions;
  partyTracker: PartyTracker;
  playerName: string;
  leftBuffDiv: WidgetList;
  rightBuffDiv: WidgetList;
  buffs: { [s: string]: Buff };
  gainEffectMap: { [s: string]: BuffInfo[] };
  loseEffectMap: { [s: string]: BuffInfo[] };
  cooldownAbilityMap: { [s: string]: BuffInfo[] };
  mobGainsEffectMap: { [s: string]: BuffInfo[] };
  mobLosesEffectMap: { [s: string]: BuffInfo[] };

  constructor(
      options: JobsOptions,
      playerName: string,
      leftBuffDiv: WidgetList,
      rightBuffDiv: WidgetList,
      partyTracker: PartyTracker,
  ) {
    this.options = options;
    this.playerName = playerName;
    this.leftBuffDiv = leftBuffDiv;
    this.rightBuffDiv = rightBuffDiv;
    this.buffs = {};

    this.partyTracker = partyTracker;

    this.buffInfo = {
      potion: {
        gainEffect: [EffectId.Medicated],
        loseEffect: [EffectId.Medicated],
        useEffectDuration: true,
        icon: potionImage,
        borderColor: '#AA41B2',
        sortKey: 0,
        cooldown: 270,
      },
      astralAttenuation: {
        mobGainsEffect: EffectId.AstralAttenuation,
        mobLosesEffect: EffectId.AstralAttenuation,
        useEffectDuration: true,
        icon: astralImage,
        borderColor: '#9bdec0',
        sortKey: 0,
      },
      umbralAttenuation: {
        mobGainsEffect: EffectId.UmbralAttenuation,
        mobLosesEffect: EffectId.UmbralAttenuation,
        useEffectDuration: true,
        icon: umbralImage,
        borderColor: '#4d8bc9',
        sortKey: 0,
      },
      physicalAttenuation: {
        mobGainsEffect: EffectId.PhysicalAttenuation,
        mobLosesEffect: EffectId.PhysicalAttenuation,
        useEffectDuration: true,
        icon: physicalImage,
        borderColor: '#fff712',
        sortKey: 0,
      },
      offguard: {
        cooldownAbility: [kAbility.OffGuard],
        mobGainsEffect: EffectId.OffGuard,
        mobLosesEffect: EffectId.OffGuard,
        useEffectDuration: true,
        durationSeconds: 15,
        icon: offguardImage,
        borderColor: '#47bf41',
        sortKey: 1,
        cooldown: 60,
        sharesCooldownWith: ['peculiar'],
      },
      peculiar: {
        cooldownAbility: [kAbility.PeculiarLight],
        mobGainsEffect: EffectId.PeculiarLight,
        mobLosesEffect: EffectId.PeculiarLight,
        useEffectDuration: true,
        durationSeconds: 15,
        icon: peculiarLightImage,
        borderColor: '#F28F7B',
        sortKey: 1,
        cooldown: 60,
        sharesCooldownWith: ['offguard'],
      },
      trick: {
        cooldownAbility: [kAbility.TrickAttack],
        mobGainsEffect: EffectId.VulnerabilityUp,
        mobLosesEffect: EffectId.VulnerabilityUp,
        useEffectDuration: true,
        durationSeconds: 15,
        icon: trickAttackImage,
        // Magenta.
        borderColor: '#FC4AE6',
        sortKey: 1,
        cooldown: 60,
      },
      litany: {
        cooldownAbility: [kAbility.BattleLitany],
        gainEffect: [EffectId.BattleLitany],
        loseEffect: [EffectId.BattleLitany],
        useEffectDuration: true,
        durationSeconds: 20,
        partyOnly: true,
        icon: battleLitanyImage,
        // Cyan.
        borderColor: '#099',
        sortKey: 2,
        cooldown: 180,
      },
      embolden: {
        // On each embolden stack changes,
        // there will be a gain effect log with a wrong duration (always 20).
        // So using stack to identify the first log.
        cooldownAbility: [kAbility.Embolden],
        gainEffect: [EffectId.Embolden, EffectId.EmboldenSelf],
        loseEffect: [EffectId.Embolden, EffectId.EmboldenSelf],
        useEffectDuration: true,
        durationSeconds: 20,
        partyOnly: true,
        stack: 5,
        icon: emboldenImage,
        // Lime.
        borderColor: '#57FC4A',
        sortKey: 3,
        cooldown: 120,
      },
      arrow: {
        gainEffect: [EffectId.TheArrow],
        loseEffect: [EffectId.TheArrow],
        useEffectDuration: true,
        icon: arrowImage,
        // Light Blue.
        borderColor: '#37ccee',
        sortKey: 4,
      },
      balance: {
        gainEffect: [EffectId.TheBalance],
        loseEffect: [EffectId.TheBalance],
        useEffectDuration: true,
        icon: balanceImage,
        // Orange.
        borderColor: '#ff9900',
        sortKey: 4,
      },
      bole: {
        gainEffect: [EffectId.TheBole],
        loseEffect: [EffectId.TheBole],
        useEffectDuration: true,
        icon: boleImage,
        // Green.
        borderColor: '#22dd77',
        sortKey: 4,
      },
      ewer: {
        gainEffect: [EffectId.TheEwer],
        loseEffect: [EffectId.TheEwer],
        useEffectDuration: true,
        icon: ewerImage,
        // Light Blue.
        borderColor: '#66ccdd',
        sortKey: 4,
      },
      spear: {
        gainEffect: [EffectId.TheSpear],
        loseEffect: [EffectId.TheSpear],
        useEffectDuration: true,
        icon: spearImage,
        // Dark Blue.
        borderColor: '#4477dd',
        sortKey: 4,
      },
      spire: {
        gainEffect: [EffectId.TheSpire],
        loseEffect: [EffectId.TheSpire],
        useEffectDuration: true,
        icon: spireImage,
        // Yellow.
        borderColor: '#ddd044',
        sortKey: 4,
      },
      ladyOfCrowns: {
        gainEffect: [EffectId.LadyOfCrowns],
        loseEffect: [EffectId.LadyOfCrowns],
        useEffectDuration: true,
        icon: ladyOfCrownsImage,
        // Purple.
        borderColor: '#9e5599',
        sortKey: 4,
      },
      lordOfCrowns: {
        gainEffect: [EffectId.LordOfCrowns],
        loseEffect: [EffectId.LordOfCrowns],
        useEffectDuration: true,
        icon: lordOfCrownsImage,
        // Dark Red.
        borderColor: '#9a2222',
        sortKey: 4,
      },
      devilment: {
        gainEffect: [EffectId.Devilment],
        loseEffect: [EffectId.Devilment],
        useEffectDuration: true,
        icon: devilmentImage,
        // Dark Green.
        borderColor: '#006400',
        sortKey: 5,
        cooldown: 120,
      },
      standardFinish: {
        gainEffect: [EffectId.StandardFinish],
        loseEffect: [EffectId.StandardFinish],
        useEffectDuration: true,
        icon: standardFinishImage,
        // Green.
        borderColor: '#32CD32',
        sortKey: 6,
      },
      technicalFinish: {
        // This tracker may not be accurate.
        // Technical Step cooldown when start dancing,
        // but raidbuff take effects on finish.
        cooldownAbility: [
          kAbility.QuadrupleTechnicalFinish,
          kAbility.TripleTechnicalFinish,
          kAbility.DoubleTechnicalFinish,
          kAbility.SingleTechnicalFinish,
          kAbility.TechnicalFinish,
        ],
        gainEffect: [EffectId.TechnicalFinish],
        loseEffect: [EffectId.TechnicalFinish],
        useEffectDuration: true,
        durationSeconds: 20,
        partyOnly: true,
        icon: technicalFinishImage,
        // Dark Peach.
        borderColor: '#E0757C',
        sortKey: 6,
        cooldown: 120,
      },
      battlevoice: {
        cooldownAbility: [kAbility.BattleVoice],
        gainEffect: [EffectId.BattleVoice],
        loseEffect: [EffectId.BattleVoice],
        useEffectDuration: true,
        durationSeconds: 20,
        partyOnly: true,
        icon: battleVoiceImage,
        // Red.
        borderColor: '#D6371E',
        sortKey: 7,
        cooldown: 180,
      },
      chain: {
        cooldownAbility: [kAbility.ChainStratagem],
        mobGainsEffect: EffectId.ChainStratagem,
        mobLosesEffect: EffectId.ChainStratagem,
        useEffectDuration: true,
        durationSeconds: 15,
        icon: chainStratagemImage,
        // Blue.
        borderColor: '#4674E5',
        sortKey: 8,
        cooldown: 120,
      },
      lefteye: {
        gainEffect: [EffectId.LeftEye],
        loseEffect: [EffectId.LeftEye],
        useEffectDuration: true,
        icon: dragonSightImage,
        // Orange.
        borderColor: '#FA8737',
        sortKey: 9,
        cooldown: 120,
      },
      righteye: {
        gainEffect: [EffectId.RightEye],
        loseEffect: [EffectId.RightEye],
        useEffectDuration: true,
        icon: dragonSightImage,
        // Orange.
        borderColor: '#FA8737',
        sortKey: 10,
        cooldown: 120,
      },
      brotherhood: {
        cooldownAbility: [kAbility.Brotherhood],
        gainEffect: [EffectId.Brotherhood],
        loseEffect: [EffectId.Brotherhood],
        useEffectDuration: true,
        durationSeconds: 15,
        partyOnly: true,
        icon: brotherhoodImage,
        // Dark Orange.
        borderColor: '#994200',
        sortKey: 11,
        cooldown: 90,
      },
      devotion: {
        // FIXME: pet is not considered inParty, so this cannot track it if it misses you.
        // By the way, pet can delay using devotion after been ordered
        // and if you order it to continue moving, it can greatly delay up to 30s,
        // so it may not be accurate.
        cooldownAbility: [kAbility.Devotion],
        gainEffect: [EffectId.Devotion],
        loseEffect: [EffectId.Devotion],
        useEffectDuration: true,
        durationSeconds: 15,
        partyOnly: true,
        icon: devotionImage,
        // Yellow.
        borderColor: '#ffbf00',
        sortKey: 12,
        cooldown: 180,
      },
      divination: {
        cooldownAbility: [kAbility.Divination],
        gainEffect: [EffectId.Divination],
        loseEffect: [EffectId.Divination],
        useEffectDuration: true,
        durationSeconds: 15,
        partyOnly: true,
        icon: divinationImage,
        // Dark purple.
        borderColor: '#5C1F58',
        sortKey: 13,
        cooldown: 120,
      },
    };

    this.gainEffectMap = {};
    this.loseEffectMap = {};
    this.cooldownAbilityMap = {};
    this.mobGainsEffectMap = {};
    this.mobLosesEffectMap = {};

    const propToMapMap = {
      gainEffect: this.gainEffectMap,
      loseEffect: this.loseEffectMap,
      cooldownAbility: this.cooldownAbilityMap,
      mobGainsEffect: this.mobGainsEffectMap,
      mobLosesEffect: this.mobLosesEffectMap,
    } as const;

    for (const [key, buffOmitName] of Object.entries(this.buffInfo)) {
      const buff = {
        ...buffOmitName,
        name: key,
      };

      const overrides = this.options.PerBuffOptions[buff.name] ?? null;
      buff.borderColor = overrides?.borderColor ?? buff.borderColor;
      buff.icon = overrides?.icon ?? buff.icon;
      buff.side = overrides?.side ?? buff.side ?? 'right';
      buff.sortKey = overrides?.sortKey || buff.sortKey;
      buff.hide = overrides?.hide ?? buff.hide ?? false;

      for (const propStr in propToMapMap) {
        const prop = propStr as keyof typeof propToMapMap;

        if (!(prop in buff))
          continue;
        const key = buff[prop];
        if (typeof key === 'undefined') {
          console.error('undefined value for key ' + prop + ' for buff ' + buff.name);
          continue;
        }

        const map = propToMapMap[prop];
        if (Array.isArray(key)) {
          key.forEach((k) => map[k] = [buff, ...map[k] ?? []]);
        } else {
          map[key] ??= [];
          map[key]?.push(buff);
        }
      }
    }

    // const v520 = {
    //   // identical with latest patch
    //   /* example
    //   trick: {
    //     durationSeconds: 10,
    //   },
    //   */
    // };

    // const buffOverrides = {
    //   cn: v520,
    //   ko: v520,
    // };

    // for (const key in buffOverrides[this.options.ParserLanguage]) {
    //   for (const key2 in buffOverrides[this.options.ParserLanguage][key])
    //     this.buffInfo[key][key2] = buffOverrides[this.options.ParserLanguage][key][key2];
    // }
  }

  onUseAbility(id: string, matches: MatchesAbility): void {
    const buffs = this.cooldownAbilityMap[id];
    if (!buffs)
      return;

    for (const b of buffs) {
      if (b.partyOnly && !this.partyTracker.inParty(matches?.source ?? '')) {
        // when solo, you are not inParty.
        if (matches?.source !== this.playerName)
          return;
      }

      // This durationSeconds is not used for countdown active time,
      // but for preventing cooldown icon appear when effect is still active and duplicated.
      // +1 for delay between ability and effect.
      // FIXME: if you miss the buff, cooldown will appear at least after normal duration end.
      let seconds = 0;
      if (b.durationSeconds)
        seconds = b.durationSeconds + 1;

      this.onBigBuff(b.name, seconds, b, matches?.source, 'cooldown');
    }
  }

  onGainEffect(
      buffs: BuffInfo[] | undefined,
      matches: MatchesGainsEffect,
  ): void {
    if (!buffs)
      return;
    for (const b of buffs) {
      let seconds = -1;
      if (b.useEffectDuration)
        seconds = parseFloat(matches?.duration ?? '0');
      else if ('durationSeconds' in b)
        seconds = b.durationSeconds ?? seconds;
      if ('stack' in b && b.stack !== parseInt(matches?.count ?? '0'))
        return;

      this.onBigBuff(b.name, seconds, b, matches?.source, 'active');
      // Some cooldowns (like potions) have no cooldownAbility, so also track them here.
      if (!b.cooldownAbility)
        this.onBigBuff(b.name, seconds, b, matches?.source, 'cooldown');
    }
  }

  onLoseEffect(
      buffs: BuffInfo[] | undefined,
      _matches: MatchesLosesEffect,
  ): void {
    if (!buffs)
      return;
    for (const b of buffs)
      this.onLoseBigBuff(b.name);
  }

  onYouGainEffect(name: string, matches: MatchesGainsEffect): void {
    this.onGainEffect(this.gainEffectMap[name], matches);
  }

  onYouLoseEffect(name: string, matches: MatchesLosesEffect): void {
    this.onLoseEffect(this.loseEffectMap[name], matches);
  }

  onMobGainsEffect(name: string, matches: MatchesGainsEffect): void {
    this.onGainEffect(this.mobGainsEffectMap[name], matches);
  }

  onMobLosesEffect(name: string, matches: MatchesLosesEffect): void {
    this.onLoseEffect(this.mobLosesEffectMap[name], matches);
  }

  onBigBuff(name: string, seconds = 0, info: BuffInfo, source = '', option: 'active' | 'cooldown'): void {
    let list = this.rightBuffDiv;
    if (info.side === 'left' && this.leftBuffDiv)
      list = this.leftBuffDiv;

    let buff = this.buffs[name];
    if (!buff)
      buff = this.buffs[name] = new Buff(name, info, list, this.options);

    const shareList = info.sharesCooldownWith || [];
    for (const share of shareList) {
      const existingBuff = this.buffs[share];
      if (existingBuff)
        existingBuff.clearCooldown(source);
    }

    if (option === 'active' && seconds > 0)
      buff.onGain(seconds);
    else if (option === 'cooldown')
      buff.onCooldown(seconds, source);
  }

  onLoseBigBuff(name: string): void {
    this.buffs[name]?.onLose();
  }

  clear(): void {
    Object.values(this.buffs).forEach((buff) => buff.clear());
  }
}
