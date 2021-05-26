import { JobsOptions } from './types';

import WidgetList from '../../resources/widget_list';
import EffectId from '../../resources/effect_id';
import { MatchesAbility, MatchesGainsEffect, MatchesLosesEffect } from '../../resources/matches';

import { kAbility } from './constants';
import { makeAuraTimerIcon } from './utils';

export interface BuffInfo {
  name: string;
  gainAbility?: string;
  gainEffect?: string;
  loseEffect?: string;
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
    secondsUntilShow = Math.min(Math.max(effectSeconds, secondsUntilShow), this.info.cooldown);
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

  onGain(seconds: number, source: string): void {
    this.onLose();
    this.clearCooldown(source);
    this.active = this.makeAura(this.name, this.activeList, seconds, 0, 0, 'white', '', 1);
    this.addCooldown(source, seconds);
  }

  onLose(): void {
    if (!this.active)
      return;
    this.active.removeCallback();
    this.active = null;
  }
}

export class BuffTracker {
  buffInfo: { [s: string]: Omit<BuffInfo, 'name'> };
  options: JobsOptions;
  playerName: string;
  leftBuffDiv: WidgetList;
  rightBuffDiv: WidgetList;
  buffs: { [s: string]: Buff };
  gainEffectMap: { [s: string]: BuffInfo[] };
  loseEffectMap: { [s: string]: BuffInfo[] };
  gainAbilityMap: { [s: string]: BuffInfo[] };
  mobGainsEffectMap: { [s: string]: BuffInfo[] };
  mobLosesEffectMap: { [s: string]: BuffInfo[] };

  constructor(
      options: JobsOptions,
      playerName: string,
      leftBuffDiv: WidgetList,
      rightBuffDiv: WidgetList,
  ) {
    this.options = options;
    this.playerName = playerName;
    this.leftBuffDiv = leftBuffDiv;
    this.rightBuffDiv = rightBuffDiv;
    this.buffs = {};

    this.buffInfo = {
      potion: {
        gainEffect: EffectId.Medicated,
        loseEffect: EffectId.Medicated,
        useEffectDuration: true,
        icon: '../../resources/ffxiv/status/potion.png',
        borderColor: '#AA41B2',
        sortKey: 0,
        cooldown: 270,
      },
      astralAttenuationWind: {
        mobGainsEffect: EffectId.AstralAttenuation,
        mobLosesEffect: EffectId.AstralAttenuation,
        useEffectDuration: true,
        icon: '../../resources/ffxiv/status/wind.png',
        borderColor: '#9bdec0',
        sortKey: 0,
      },
      astralAttenuationLightning: {
        mobGainsEffect: EffectId.AstralAttenuation,
        mobLosesEffect: EffectId.AstralAttenuation,
        useEffectDuration: true,
        icon: '../../resources/ffxiv/status/lightning.png',
        borderColor: '#e0cb5c',
        sortKey: 0,
      },
      umbralAttenuationEarth: {
        mobGainsEffect: EffectId.UmbralAttenuation,
        mobLosesEffect: EffectId.UmbralAttenuation,
        useEffectDuration: true,
        icon: '../../resources/ffxiv/status/earth.png',
        borderColor: '#96855a',
        sortKey: 0,
      },
      umbralAttenuationWater: {
        mobGainsEffect: EffectId.UmbralAttenuation,
        mobLosesEffect: EffectId.UmbralAttenuation,
        useEffectDuration: true,
        icon: '../../resources/ffxiv/status/water.png',
        borderColor: '#4d8bc9',
        sortKey: 0,
      },
      physicalAttenuation: {
        mobGainsEffect: EffectId.PhysicalAttenuation,
        mobLosesEffect: EffectId.PhysicalAttenuation,
        useEffectDuration: true,
        icon: '../../resources/ffxiv/status/physical.png',
        borderColor: '#fff712',
        sortKey: 0,
      },
      offguard: {
        gainAbility: kAbility.OffGuard,
        durationSeconds: 15,
        icon: '../../resources/ffxiv/status/offguard.png',
        borderColor: '#47bf41',
        sortKey: 1,
        cooldown: 60,
        sharesCooldownWith: ['peculiar'],
      },
      peculiar: {
        gainAbility: kAbility.PeculiarLight,
        durationSeconds: 15,
        icon: '../../resources/ffxiv/status/peculiar-light.png',
        borderColor: '#F28F7B',
        sortKey: 1,
        cooldown: 60,
        sharesCooldownWith: ['offguard'],
      },
      trick: {
        gainAbility: kAbility.TrickAttack,
        durationSeconds: 15,
        icon: '../../resources/ffxiv/status/trick-attack.png',
        // Magenta.
        borderColor: '#FC4AE6',
        sortKey: 1,
        cooldown: 60,
      },
      litany: {
        gainEffect: EffectId.BattleLitany,
        loseEffect: EffectId.BattleLitany,
        useEffectDuration: true,
        icon: '../../resources/ffxiv/status/battle-litany.png',
        // Cyan.
        borderColor: '#099',
        sortKey: 2,
        cooldown: 180,
      },
      embolden: {
        // Embolden is special and has some extra text at the end, depending on embolden stage:
        // Potato Chippy gains the effect of Embolden from Tater Tot for 20.00 Seconds. (5)
        // Instead, use somebody using the effect on you:
        //   16:106C22EF:Tater Tot:1D60:Embolden:106C22EF:Potato Chippy:500020F:4D7: etc etc
        gainAbility: kAbility.Embolden,
        loseEffect: EffectId.Embolden,
        durationSeconds: 20,
        icon: '../../resources/ffxiv/status/embolden.png',
        // Lime.
        borderColor: '#57FC4A',
        sortKey: 3,
        cooldown: 120,
      },
      arrow: {
        gainEffect: EffectId.TheArrow,
        loseEffect: EffectId.TheArrow,
        useEffectDuration: true,
        icon: '../../resources/ffxiv/status/arrow.png',
        // Light Blue.
        borderColor: '#37ccee',
        sortKey: 4,
      },
      balance: {
        gainEffect: EffectId.TheBalance,
        loseEffect: EffectId.TheBalance,
        useEffectDuration: true,
        icon: '../../resources/ffxiv/status/balance.png',
        // Orange.
        borderColor: '#ff9900',
        sortKey: 4,
      },
      bole: {
        gainEffect: EffectId.TheBole,
        loseEffect: EffectId.TheBole,
        useEffectDuration: true,
        icon: '../../resources/ffxiv/status/bole.png',
        // Green.
        borderColor: '#22dd77',
        sortKey: 4,
      },
      ewer: {
        gainEffect: EffectId.TheEwer,
        loseEffect: EffectId.TheEwer,
        useEffectDuration: true,
        icon: '../../resources/ffxiv/status/ewer.png',
        // Light Blue.
        borderColor: '#66ccdd',
        sortKey: 4,
      },
      spear: {
        gainEffect: EffectId.TheSpear,
        loseEffect: EffectId.TheSpear,
        useEffectDuration: true,
        icon: '../../resources/ffxiv/status/spear.png',
        // Dark Blue.
        borderColor: '#4477dd',
        sortKey: 4,
      },
      spire: {
        gainEffect: EffectId.TheSpire,
        loseEffect: EffectId.TheSpire,
        useEffectDuration: true,
        icon: '../../resources/ffxiv/status/spire.png',
        // Yellow.
        borderColor: '#ddd044',
        sortKey: 4,
      },
      ladyOfCrowns: {
        gainEffect: EffectId.LadyOfCrowns,
        loseEffect: EffectId.LadyOfCrowns,
        useEffectDuration: true,
        icon: '../../resources/ffxiv/status/lady-of-crowns.png',
        // Purple.
        borderColor: '#9e5599',
        sortKey: 4,
      },
      lordOfCrowns: {
        gainEffect: EffectId.LordOfCrowns,
        loseEffect: EffectId.LordOfCrowns,
        useEffectDuration: true,
        icon: '../../resources/ffxiv/status/lord-of-crowns.png',
        // Dark Red.
        borderColor: '#9a2222',
        sortKey: 4,
      },
      devilment: {
        gainEffect: EffectId.Devilment,
        loseEffect: EffectId.Devilment,
        durationSeconds: 20,
        icon: '../../resources/ffxiv/status/devilment.png',
        // Dark Green.
        borderColor: '#006400',
        sortKey: 5,
        cooldown: 120,
      },
      standardFinish: {
        gainEffect: EffectId.StandardFinish,
        loseEffect: EffectId.StandardFinish,
        durationSeconds: 60,
        icon: '../../resources/ffxiv/status/standard-finish.png',
        // Green.
        borderColor: '#32CD32',
        sortKey: 6,
      },
      technicalFinish: {
        gainEffect: EffectId.TechnicalFinish,
        loseEffect: EffectId.TechnicalFinish,
        durationSeconds: 20,
        icon: '../../resources/ffxiv/status/technical-finish.png',
        // Dark Peach.
        borderColor: '#E0757C',
        sortKey: 6,
        cooldown: 120,
      },
      battlevoice: {
        gainEffect: EffectId.BattleVoice,
        loseEffect: EffectId.BattleVoice,
        useEffectDuration: true,
        icon: '../../resources/ffxiv/status/battlevoice.png',
        // Red.
        borderColor: '#D6371E',
        sortKey: 7,
        cooldown: 180,
      },
      chain: {
        gainAbility: kAbility.ChainStratagem,
        durationSeconds: 15,
        icon: '../../resources/ffxiv/status/chain-stratagem.png',
        // Blue.
        borderColor: '#4674E5',
        sortKey: 8,
        cooldown: 120,
      },
      lefteye: {
        gainEffect: EffectId.LeftEye,
        loseEffect: EffectId.LeftEye,
        useEffectDuration: true,
        icon: '../../resources/ffxiv/status/dragon-sight.png',
        // Orange.
        borderColor: '#FA8737',
        sortKey: 9,
        cooldown: 120,
      },
      righteye: {
        gainEffect: EffectId.RightEye,
        loseEffect: EffectId.RightEye,
        useEffectDuration: true,
        icon: '../../resources/ffxiv/status/dragon-sight.png',
        // Orange.
        borderColor: '#FA8737',
        sortKey: 10,
        cooldown: 120,
      },
      brotherhood: {
        gainEffect: EffectId.Brotherhood,
        loseEffect: EffectId.Brotherhood,
        useEffectDuration: true,
        icon: '../../resources/ffxiv/status/brotherhood.png',
        // Dark Orange.
        borderColor: '#994200',
        sortKey: 11,
        cooldown: 90,
      },
      devotion: {
        gainEffect: EffectId.Devotion,
        loseEffect: EffectId.Devotion,
        useEffectDuration: true,
        icon: '../../resources/ffxiv/status/devotion.png',
        // Yellow.
        borderColor: '#ffbf00',
        sortKey: 12,
        cooldown: 180,
      },
      divination: {
        gainEffect: EffectId.Divination,
        loseEffect: EffectId.Divination,
        useEffectDuration: true,
        icon: '../../resources/ffxiv/status/divination.png',
        // Dark purple.
        borderColor: '#5C1F58',
        sortKey: 13,
        cooldown: 120,
      },
    };

    this.gainEffectMap = {};
    this.loseEffectMap = {};
    this.gainAbilityMap = {};
    this.mobGainsEffectMap = {};
    this.mobLosesEffectMap = {};

    const propToMapMap = {
      gainEffect: this.gainEffectMap,
      loseEffect: this.loseEffectMap,
      gainAbility: this.gainAbilityMap,
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
        map[key] = map[key] || [];
        map[key]?.push(buff);
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
    const buffs = this.gainAbilityMap[id];
    if (!buffs)
      return;

    for (const b of buffs)
      this.onBigBuff(b.name, b.durationSeconds, b, matches?.source);
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

      this.onBigBuff(b.name, seconds, b, matches?.source);
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

  onBigBuff(name: string, seconds = 0, info: BuffInfo, source = ''): void {
    if (seconds <= 0)
      return;

    let list = this.rightBuffDiv;
    if (info.side === 'left' && this.leftBuffDiv)
      list = this.leftBuffDiv;

    let buff = this.buffs[name];
    if (!buff) {
      this.buffs[name] = new Buff(name, info, list, this.options);
      buff = this.buffs[name];
    }

    const shareList = info.sharesCooldownWith || [];
    for (const share of shareList) {
      const existingBuff = this.buffs[share];
      if (existingBuff)
        existingBuff.clearCooldown(source);
    }

    buff?.onGain(seconds, source);
  }

  onLoseBigBuff(name: string): void {
    this.buffs[name]?.onLose();
  }

  clear(): void {
    Object.values(this.buffs).forEach((buff) => buff.clear());
  }
}
