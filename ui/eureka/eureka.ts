import logDefinitions from '../../resources/netlog_defs';
import NetRegexes from '../../resources/netregexes';
import { UnreachableCode } from '../../resources/not_reached';
import { addOverlayListener } from '../../resources/overlay_plugin_api';
import Regexes from '../../resources/regexes';
import UserConfig from '../../resources/user_config';
import {
  findNextDay,
  findNextNight,
  findNextWeather,
  findNextWeatherNot,
  getWeather,
  isNightTime,
} from '../../resources/weather';
import ZoneId from '../../resources/zone_id';
import ZoneInfo from '../../resources/zone_info';
import { BaseOptions } from '../../types/data';
import { EventResponses } from '../../types/event';
import { NetMatches } from '../../types/net_matches';
import { CactbotBaseRegExp } from '../../types/net_trigger';
import { LocaleObject, LocaleText, ZoneIdType } from '../../types/trigger';

import { timeStrings } from './eureka_translations';
import { zoneInfoAnemos } from './zone_anemos';
import { zoneInfoBozjaSouthern } from './zone_bozja_southern';
import { zoneInfoHydatos } from './zone_hydatos';
import { zoneInfoPagos } from './zone_pagos';
import { zoneInfoPyros } from './zone_pyros';
import { zoneInfoZadnor } from './zone_zadnor';

import './eureka_config';
import '../../resources/defaults.css';
import './eureka.css';

// TODO: get all of the elements required up front in the constructor
// TODO: split NMInfo from some new InitializedNMInfo, which includes required element/timeElement

const numWeatherElem = 5;

type WeatherForFunc = (nowMs: number, stopTime?: number) => string;
type WeatherInFunc = (nowMs: number, startTime: number) => string;
type WeatherTimeForFunc = (dayNightMin: number) => string;

type FieldNote = {
  id: number;
  name: LocaleText;
  shortName: LocaleText;
  rarity: number;
};

type NMInfo = {
  label: LocaleText;
  x: number;
  y: number;
  respawnMinutes?: number;

  // Modified
  element?: HTMLElement;
  progressElement?: HTMLElement;
  timeElement?: HTMLElement;
  respawnTimeMsLocal?: number;
  respawnTimeMsTracker?: number;

  // Eureka
  fateID?: number;
  trackerName?: LocaleText;
  weather?: string;
  time?: string;
  bunny?: boolean;

  // Bozja
  ceKey?: number;
  shortLabel?: LocaleText;
  fieldNotes?: number;
  isCritical?: boolean;
  isCEPrecursor?: boolean;
  isDuel?: boolean;
  isDuelPrecursor?: boolean;
};

export type EurekaZoneInfo = {
  mapImage: string;
  mapWidth: number;
  mapHeight: number;
  shortName: string;
  mapToPixelXScalar: number;
  mapToPixelXConstant: number;
  mapToPixelYScalar: number;
  mapToPixelYConstant: number;
  nms: { [nmId: string]: NMInfo };

  // Eureka
  hasTracker?: boolean;
  primaryWeather?: string[];
  fairy?: LocaleText;

  // Bozja
  onlyShowInactiveWithExplicitRespawns?: boolean;
  treatNMsAsSkirmishes?: boolean;
  fieldNotes?: FieldNote[];
};

const defaultEurekaConfigOptions = {
  FlagTimeoutMs: 90,
  CompleteNamesSTQ: false,
  EnrichedSTQ: false,
  PopNoiseForNM: true,
  PopNoiseForBunny: true,
  PopNoiseForSkirmish: false,
  PopNoiseForCriticalEngagement: true,
  PopNoiseForDuel: false,
  PopVolume: 1,
  BunnyPopVolume: 0.3,
  CriticalPopVolume: 0.3,
  RefreshRateMs: 1000,
};
type EurekaConfigOptions = typeof defaultEurekaConfigOptions;

export type EurekaTimeStrings = {
  weatherFor: LocaleObject<WeatherForFunc>;
  weatherIn: LocaleObject<WeatherInFunc>;
  timeFor: LocaleObject<WeatherTimeForFunc>;
  minute: LocaleText;
};

export interface EurekaOptions extends BaseOptions, EurekaConfigOptions {
  PopSound: string;
  BunnyPopSound: string;
  CriticalPopSound: string;
  timeStrings: EurekaTimeStrings;
  Regex: LocaleObject<{
    flagRegex: CactbotBaseRegExp<'GameLog'>;
    trackerRegex: CactbotBaseRegExp<'GameLog'>;
    importRegex: CactbotBaseRegExp<'GameLog'>;
    timeRegex: RegExp;
  }>;
  ZoneInfo: { [zoneId: number]: EurekaZoneInfo };
}

const defaultOptions: EurekaOptions = {
  ...UserConfig.getDefaultBaseOptions(),
  ...defaultEurekaConfigOptions,
  PopSound: '../../resources/sounds/freesound/sonar.webm',
  BunnyPopSound: '../../resources/sounds/freesound/water_drop.webm',
  CriticalPopSound: '../../resources/sounds/freesound/sonar.webm',
  timeStrings: timeStrings,
  Regex: {
    // de, fr, ja languages all share the English regexes here.
    // If you ever need to add another language, include all of the regexes for it.
    en: {
      flagRegex: NetRegexes.gameLog({
        code: '00..',
        line:
          '(?<before>.*)\ue0bb(?:Eureka (?:Anemos|Pagos|Pyros|Hydatos)|Bozjan Southern Front|Zadnor) \\( (?<x>\\y{Float})\\s*, (?<y>\\y{Float}) \\)(?<after>.*?)',
      }),
      trackerRegex: NetRegexes.gameLog(
        { line: '.*?(?:https://)?ffxiv-eureka\\.com/(?<id>[_\\w-]{6}).*?' },
      ),
      importRegex: NetRegexes.gameLog(
        { code: '00..', line: '.*?NMs on cooldown: (?<nms>\\S.*\\))*?' },
      ),
      timeRegex: Regexes.parse(/(.*) \((\d*)m\)/),
    },
    cn: {
      flagRegex: NetRegexes.gameLog({
        code: '00..',
        line:
          '(?<before>.*)\ue0bb(?:常风之地|恒冰之地|涌火之地|丰水之地) \\( (?<x>\\y{Float})\\s*, (?<y>\\y{Float}) \\)(?<after>.*?)',
      }),
      trackerRegex: NetRegexes.gameLog(
        { line: '.*?(?:https://)?ffxiv-eureka\\.com/(?<id>[_\\w-]{6}).*?' },
      ),
      importRegex: NetRegexes.gameLog({ code: '00..', line: '.*?冷却中的NM: (?<nms>\\S.*\\))*?' }),
      timeRegex: Regexes.parse(/(.*) \((\d*)分(钟*)\)/),
    },
    ko: {
      flagRegex: NetRegexes.gameLog({
        code: '00..',
        line:
          '(?<before>.*)\ue0bb(?:에우레카: (?:아네모스|파고스|피로스|히다토스) 지대|남부 보즈야 전선|자트노르 고원) \\( (?<x>\\y{Float})\\s*, (?<y>\\y{Float}) \\)(?<after>.*?)',
      }),
      trackerRegex: NetRegexes.gameLog(
        { line: '.*?(?:https://)?ffxiv-eureka\.com\/(?<id>[_\\w-]{6}).*?' },
      ),
      importRegex: NetRegexes.gameLog({ code: '00..', line: '.*?토벌한 마물: (?<nms>\\S.*\\))*?' }),
      timeRegex: Regexes.parse(/(.*) \((\d*)분\)/),
    },
  },
  ZoneInfo: {
    [ZoneId.TheForbiddenLandEurekaAnemos]: zoneInfoAnemos,
    [ZoneId.TheForbiddenLandEurekaPagos]: zoneInfoPagos,
    [ZoneId.TheForbiddenLandEurekaPyros]: zoneInfoPyros,
    [ZoneId.TheForbiddenLandEurekaHydatos]: zoneInfoHydatos,
    [ZoneId.TheBozjanSouthernFront]: zoneInfoBozjaSouthern,
    [ZoneId.Zadnor]: zoneInfoZadnor,
  },
};

const gWeatherIcons: { [weather: string]: string } = {
  'Gales': '&#x1F300;',
  'Fog': '&#x2601;',
  'Blizzards': '&#x2744;',
  'Thunder': '&#x26A1;',
  'Heat Waves': '&#x2600;',
  'Umbral Wind': '&#x1F300;',
  'Fair Skies': '&#x26C5;',
  'Snow': '&#x26C4;',
  'Thunderstorms': '&#x26A1;',
  'Showers': '&#x2614;',
  'Gloom': '&#x2639;',
  'Rain': '&#x1F4A6;',
  'Wind': '&#x1F32A;',
  'Dust Storms': '&#x1F4A8;',
} as const;
const gNightIcon = '&#x1F319;';
const gDayIcon = '&#x263C;';
// ✭ for rarity for field notes listing
const gRarityIcon = '&#x272D;';

class EurekaTracker {
  private zoneId?: ZoneIdType;
  private zoneInfo?: EurekaZoneInfo;
  private updateTimesHandle?: number;
  private fateQueue: EventResponses['onFateEvent'][] = [];
  private CEQueue: EventResponses['onCEEvent'][] = [];

  private playerElement?: HTMLElement;
  private fairyRegex?: CactbotBaseRegExp<'AddedCombatant'>;
  private currentTracker = '';

  // Convenience members from current this.zoneInfo.
  private nms: EurekaZoneInfo['nms'] = {};

  constructor(private options: EurekaOptions) {
    this.ResetZone();
  }

  TransByParserLang<T>(obj: LocaleObject<T>): T {
    return obj[this.options.ParserLanguage] ?? obj['en'];
  }

  TransByDispLang<T>(obj: LocaleObject<T>): T {
    return obj[this.options.DisplayLanguage] ?? obj['en'];
  }

  SetStyleFromMap(style: CSSStyleDeclaration, mx: number, my: number) {
    if (mx === undefined) {
      style.display = 'none';
      return;
    }

    const zoneInfo = this.zoneInfo;
    if (!zoneInfo)
      throw new UnreachableCode();
    const px = zoneInfo.mapToPixelXScalar * mx + zoneInfo.mapToPixelXConstant;
    const py = zoneInfo.mapToPixelYScalar * my + zoneInfo.mapToPixelYConstant;

    style.left = `${px / zoneInfo.mapWidth * 100}%`;
    style.top = `${py / zoneInfo.mapHeight * 100}%`;
  }

  // TODO: maybe this should be in a more shared location.
  EntityToMap(coord: number, sizeFactor: number, offset: number) {
    // Relicensed from MIT License, by viion / Vekien
    // https://github.com/xivapi/xivapi-mappy/blob/3ea58cc5431db6808053bd3164a1b7859e3bcee1/Mappy/Helpers/MapHelper.cs#L10-L15

    const scale = sizeFactor / 100;
    const val = (coord + offset) * scale;
    return ((41 / scale) * ((val + 1024) / 2048)) + 1;
  }

  EntityToMapX(x: number) {
    if (!this.zoneId)
      throw new UnreachableCode();
    // TODO: it's kind of awkard to have this.zoneInfo and ZoneInfo simultaneously.
    const zoneInfo = ZoneInfo[this.zoneId];
    if (!zoneInfo)
      throw new UnreachableCode();
    return this.EntityToMap(x, zoneInfo.sizeFactor, zoneInfo.offsetX);
  }

  EntityToMapY(y: number) {
    if (!this.zoneId)
      throw new UnreachableCode();
    // TODO: it's kind of awkard to have this.zoneInfo and ZoneInfo simultaneously.
    const zoneInfo = ZoneInfo[this.zoneId];
    if (!zoneInfo)
      throw new UnreachableCode();
    return this.EntityToMap(y, zoneInfo.sizeFactor, zoneInfo.offsetY);
  }

  SetStyleFromEntity(style: CSSStyleDeclaration, ex: number, ey: number) {
    const mx = this.EntityToMapX(ex);
    const my = this.EntityToMapY(ey);
    this.SetStyleFromMap(style, mx, my);
  }

  AddElement(container: HTMLElement, nmKey: string) {
    if (!this.zoneInfo)
      throw new UnreachableCode();

    const nm = this.nms[nmKey];
    if (!nm)
      throw new UnreachableCode();
    const label = document.createElement('div');
    const fieldNotesList = this.zoneInfo.fieldNotes;
    label.classList.add('nm');

    if (nm.isCritical)
      label.classList.add('critical');
    if (nm.isDuel)
      label.classList.add('duel');
    // Start these off hidden.
    if (this.zoneInfo.onlyShowInactiveWithExplicitRespawns)
      label.classList.add('nm-hidden');

    label.id = nmKey;

    this.SetStyleFromMap(label.style, nm.x, nm.y);

    const icon = document.createElement('span');
    icon.classList.add('nm-icon');
    const name = document.createElement('span');
    name.classList.add('nm-name');
    name.classList.add('text');

    // Short labels only exist for Save-The-Queen content
    // Changes names' length depending on users options
    // If no strings are available, the english short ones will be the default ones
    if (this.zoneInfo.treatNMsAsSkirmishes) {
      if (this.options.CompleteNamesSTQ) {
        name.innerText = this.TransByDispLang(nm.label);
      } else {
        const shortLabel = nm.shortLabel?.[this.options.DisplayLanguage];
        if (shortLabel !== undefined)
          name.innerText = shortLabel;
        // If the short label is not set, fall back to the full label.
        else
          name.innerText = this.TransByDispLang(nm.label);
      }
    } else {
      name.innerText = this.TransByDispLang(nm.label);
    }

    const progress = document.createElement('span');
    progress.innerText = '';
    progress.classList.add('nm-progress');
    progress.classList.add('text');
    const time = document.createElement('span');
    time.classList.add('nm-time');
    time.classList.add('text');
    const enriched = document.createElement('span');
    enriched.classList.add('nm-enriched');
    enriched.classList.add('text');

    if (nm.bunny)
      label.classList.add('bunny');

    // Enriched options for Save-The-Queen content
    // Adds field note drops, name, id & rarity of those
    if (this.zoneInfo.treatNMsAsSkirmishes && this.options.EnrichedSTQ && nm.fieldNotes) {
      for (const note of fieldNotesList ?? []) {
        if (note.id === nm.fieldNotes) {
          enriched.innerHTML = `#${note.id}: ${this.TransByDispLang(note.shortName)} ${
            gRarityIcon.repeat(note.rarity)
          }`;
        }
      }
    }

    label.appendChild(icon);
    label.appendChild(name);
    label.appendChild(enriched);
    label.appendChild(progress);
    label.appendChild(time);
    container.appendChild(label);

    nm.element = label;
    nm.progressElement = progress;
    nm.timeElement = time;
    nm.respawnTimeMsLocal = undefined;
    nm.respawnTimeMsTracker = undefined;
  }

  InitNMs() {
    if (!this.zoneInfo)
      throw new UnreachableCode();
    this.nms = this.zoneInfo.nms;

    const container = document.getElementById('nm-labels');
    if (!container)
      throw new UnreachableCode();
    container.classList.add(this.zoneInfo.shortName);

    for (const key in this.nms)
      this.AddElement(container, key);

    if (this.zoneInfo.fairy) {
      const fairyName = this.TransByParserLang(this.zoneInfo.fairy);
      this.fairyRegex = NetRegexes.addedCombatantFull({ name: fairyName });
    }
    this.playerElement = document.createElement('div');
    this.playerElement.classList.add('player');
    container.appendChild(this.playerElement);
  }

  ResetZone() {
    const container = document.getElementById('nm-labels');
    if (!container)
      throw new UnreachableCode();
    container.innerHTML = '';
    this.currentTracker = '';
    container.className = '';
  }

  OnPlayerChange(e: EventResponses['onPlayerChangedEvent']) {
    if (!this.zoneInfo || !this.playerElement)
      return;
    this.SetStyleFromEntity(this.playerElement.style, e.detail.pos.x, e.detail.pos.y);
  }

  OnChangeZone(e: EventResponses['ChangeZone']) {
    this.zoneId = e.zoneID;

    this.zoneInfo = this.options.ZoneInfo[this.zoneId];
    const container = document.getElementById('container');
    if (!container)
      throw new UnreachableCode();
    if (this.zoneInfo) {
      this.ResetZone();

      const aspect = document.getElementById('aspect-ratio');
      if (!aspect)
        throw new UnreachableCode();
      aspect.classList.remove(...aspect.classList);
      aspect.classList.add('aspect-ratio-' + this.zoneInfo.shortName);

      if (this.zoneInfo.mapImage) {
        const mapImageElement = document.getElementById('map-image');
        if (!mapImageElement || !(mapImageElement instanceof HTMLImageElement))
          throw new UnreachableCode();
        mapImageElement.src = this.zoneInfo.mapImage;
        window.clearInterval(this.updateTimesHandle);
        this.updateTimesHandle = window.setInterval(
          () => this.UpdateTimes(),
          this.options.RefreshRateMs,
        );
        container.classList.remove('hide');
      }
      this.InitNMs();
      this.ProcessFateQueue();
      this.ProcessCEQueue();
      this.UpdateTimes();
    } else {
      if (this.updateTimesHandle)
        window.clearInterval(this.updateTimesHandle);
      container.classList.add('hide');
    }

    const flags = document.getElementById('flag-labels');
    while (flags?.lastChild)
      flags.removeChild(flags.lastChild);
  }

  RespawnTime(nm: NMInfo) {
    let respawnTimeMs = 120 * 60 * 1000;
    if (nm.respawnMinutes)
      respawnTimeMs = nm.respawnMinutes * 60 * 1000;
    return respawnTimeMs + (+new Date());
  }

  DebugPrint(str: string) {
    if (this.options.Debug === true)
      console.log(str);
  }

  OnFatePop(fate: NMInfo) {
    this.DebugPrint(`OnFatePop: ${this.TransByDispLang(fate.label)}`);
    if (!fate.element)
      throw new UnreachableCode();
    const classList = fate.element.classList;
    if (fate.isCritical)
      classList.add('critical-pop');
    else
      classList.add('nm-pop');

    classList.remove('nm-hidden');
    classList.remove('nm-down');
    classList.remove('critical-down');
    fate.respawnTimeMsLocal = this.RespawnTime(fate);

    if (fate.bunny) {
      const shouldPlay = this.options.PopNoiseForBunny;
      if (shouldPlay && this.options.BunnyPopSound && this.options.BunnyPopVolume)
        this.PlaySound(this.options.BunnyPopSound, this.options.BunnyPopVolume);
    } else if (fate.isCritical) {
      const shouldPlay = fate.isDuelPrecursor && this.options.PopNoiseForDuel ||
        this.options.PopNoiseForCriticalEngagement;
      if (shouldPlay && this.options.CriticalPopSound && this.options.CriticalPopVolume)
        this.PlaySound(this.options.CriticalPopSound, this.options.CriticalPopVolume);
    } else {
      const shouldPlay = this.zoneInfo?.treatNMsAsSkirmishes && this.options.PopNoiseForSkirmish ||
        !this.zoneInfo?.treatNMsAsSkirmishes && this.options.PopNoiseForNM;
      if (shouldPlay && this.options.PopSound && this.options.PopVolume)
        this.PlaySound(this.options.PopSound, this.options.PopVolume);
    }
  }

  PlaySound(sound: string, volume: number) {
    const audio = new Audio(sound);
    audio.volume = volume;
    void audio.play();
  }

  OnFateUpdate(fate: NMInfo, percent: number) {
    this.DebugPrint(`OnFateUpdate: ${this.TransByDispLang(fate.label)}: ${percent}%`);
    if (
      fate.element?.classList.contains('nm-pop') || fate.element?.classList.contains('critical-pop')
    ) {
      if (fate.progressElement)
        fate.progressElement.innerText = `${percent}%`;
    }
  }

  OnFateKill(fate: NMInfo) {
    this.DebugPrint(`OnFateKill: ${this.TransByDispLang(fate.label)}`);
    this.UpdateTimes();
    if (fate.element?.classList.contains('nm-pop')) {
      if (this.zoneInfo?.onlyShowInactiveWithExplicitRespawns && !fate.respawnMinutes)
        fate.element.classList.add('nm-hidden');
      fate.element.classList.add('nm-down');
      fate.element.classList.remove('nm-pop');
      if (fate.progressElement)
        fate.progressElement.innerText = '';
      return;
    } else if (fate.element?.classList.contains('critical-pop')) {
      if (this.zoneInfo?.onlyShowInactiveWithExplicitRespawns && !fate.respawnMinutes)
        fate.element.classList.add('nm-hidden');
      fate.element.classList.add('critical-down');
      fate.element.classList.remove('critical-pop');
      if (fate.progressElement)
        fate.progressElement.innerText = '';
      return;
    }
  }

  ProcessFateQueue() {
    for (const fate of this.fateQueue)
      this.OnFate(fate);
    this.fateQueue = [];
  }

  ProcessCEQueue() {
    for (const ce of this.CEQueue)
      this.OnCE(ce);
    this.CEQueue = [];
  }

  UpdateTimes() {
    const zoneId = this.zoneId;
    if (!zoneId)
      return;
    const nowMs = +new Date();

    const primaryWeatherList = this.zoneInfo?.primaryWeather;
    const currentWeather = getWeather(nowMs, zoneId);
    if (primaryWeatherList) {
      for (let i = 0; i < numWeatherElem; ++i) {
        const iconElem = document.getElementById(`label-weather-icon${i}`);
        const textElem = document.getElementById(`label-weather-text${i}`);
        if (!iconElem || !textElem)
          throw new UnreachableCode();
        iconElem.innerHTML = '';
        textElem.innerHTML = '';
      }

      primaryWeatherList.forEach((primaryWeather, i) => {
        const weatherIcon = gWeatherIcons[primaryWeather];
        let weatherStr = '';
        if (currentWeather === primaryWeather) {
          const stopTime = findNextWeatherNot(nowMs, zoneId, primaryWeather);
          weatherStr = this.TransByDispLang(this.options.timeStrings.weatherFor)(nowMs, stopTime);
        } else {
          const startTime = findNextWeather(nowMs, zoneId, primaryWeather);
          if (startTime !== undefined)
            weatherStr = this.TransByDispLang(this.options.timeStrings.weatherIn)(nowMs, startTime);
        }
        const iconElem = document.getElementById(`label-weather-icon${i}`);
        const textElem = document.getElementById(`label-weather-text${i}`);
        if (!iconElem || !textElem)
          throw new UnreachableCode();

        iconElem.innerHTML = weatherIcon ?? '';
        textElem.innerHTML = weatherStr;
      });
    } else if (currentWeather) {
      const stopTime = findNextWeatherNot(nowMs, zoneId, currentWeather);
      const weatherIcon = gWeatherIcons[currentWeather];
      let weatherStr = this.TransByDispLang(this.options.timeStrings.weatherFor)(nowMs, stopTime);

      const iconElem = document.getElementById(`label-weather-icon0`);
      const textElem = document.getElementById(`label-weather-text0`);
      if (!iconElem || !textElem)
        throw new UnreachableCode();
      iconElem.innerHTML = weatherIcon ?? '';
      textElem.innerHTML = weatherStr;

      // round up current time
      let lastTime = nowMs;
      let lastWeather = currentWeather;
      for (let i = 1; i < 5; ++i) {
        const startTime = findNextWeatherNot(lastTime, zoneId, lastWeather);
        if (startTime === undefined)
          continue;
        const weather = getWeather(startTime + 1, zoneId);
        if (weather === undefined)
          continue;
        const weatherIcon = gWeatherIcons[weather];
        weatherStr = this.TransByDispLang(this.options.timeStrings.weatherIn)(nowMs, startTime);

        const iconElem = document.getElementById(`label-weather-icon${i}`);
        const textElem = document.getElementById(`label-weather-text${i}`);
        if (!iconElem || !textElem)
          throw new UnreachableCode();

        iconElem.innerHTML = weatherIcon ?? '';
        textElem.innerHTML = weatherStr;
        lastTime = startTime;
        lastWeather = weather;
      }
    }

    const nextDay = findNextNight(nowMs);
    const nextNight = findNextDay(nowMs);
    let timeIcon;
    if (nextDay > nextNight)
      timeIcon = gNightIcon;
    else
      timeIcon = gDayIcon;

    const dayNightMin = Math.ceil((Math.min(nextDay, nextNight) - nowMs) / 1000 / 60);
    const timeStr = this.TransByDispLang(this.options.timeStrings.timeFor)(dayNightMin);

    const timeIconElem = document.getElementById('label-time-icon');
    const timeTextElem = document.getElementById('label-time-text');
    const labelTrackerElem = document.getElementById('label-tracker');
    if (!timeIconElem || !timeTextElem || !labelTrackerElem)
      throw new UnreachableCode();

    timeIconElem.innerHTML = timeIcon;
    timeTextElem.innerHTML = timeStr;
    labelTrackerElem.innerHTML = this.currentTracker;

    for (const nm of Object.values(this.nms)) {
      let respawnMs = 0;
      if (nm.respawnTimeMsLocal)
        respawnMs = nm.respawnTimeMsLocal;
      else if (nm.respawnTimeMsTracker)
        respawnMs = nm.respawnTimeMsTracker;

      const popRespawnMs = respawnMs;

      // Ignore respawns in the past.
      respawnMs = Math.max(respawnMs, nowMs);
      let respawnIcon = '';

      if (nm.weather) {
        const respawnWeather = getWeather(respawnMs, zoneId);
        if (respawnWeather !== nm.weather) {
          const weatherStartTime = findNextWeather(respawnMs, zoneId, nm.weather);
          if (weatherStartTime && weatherStartTime > respawnMs) {
            respawnIcon = gWeatherIcons[nm.weather] ?? '';
            respawnMs = weatherStartTime;
          }
        }
      }

      if (nm.time === 'Night') {
        const isNight = isNightTime(respawnMs);
        if (!isNight) {
          const nextNight = findNextNight(respawnMs);
          if (nextNight > respawnMs) {
            respawnIcon = gNightIcon;
            respawnMs = nextNight;
          }
        }
      }

      const remainingMs = respawnMs - nowMs;

      // TODO: figure out some better way to initialize nm to ensure these exist.
      const timeElement = nm.timeElement;
      const element = nm.element;
      if (!timeElement || !element)
        throw new UnreachableCode();

      if (remainingMs <= 0) {
        let openUntil = null;
        if (nm.weather) {
          const weatherStartTime = findNextWeatherNot(nowMs, zoneId, nm.weather);
          respawnIcon = gWeatherIcons[nm.weather] ?? '';
          openUntil = weatherStartTime;
        }
        if (nm.time === 'Night') {
          respawnIcon = gNightIcon;
          openUntil = findNextDay(nowMs);
        }

        if (openUntil) {
          const openMin = (openUntil - nowMs) / 1000 / 60;
          const nmString = `${respawnIcon}${Math.ceil(openMin)}` +
            this.TransByDispLang(this.options.timeStrings.minute);
          timeElement.innerHTML = nmString;
        } else {
          timeElement.innerText = '';
        }
        element.classList.remove('nm-down');
      } else {
        // If still waiting on pop, don't show an icon.
        if (popRespawnMs > nowMs)
          respawnIcon = '';

        const remainingMinutes = Math.ceil(remainingMs / 1000 / 60);
        const nmString = `${respawnIcon}${remainingMinutes}` +
          this.TransByDispLang(this.options.timeStrings.minute);
        if (timeElement.innerHTML !== nmString)
          timeElement.innerHTML = nmString;

        if (!this.zoneInfo?.treatNMsAsSkirmishes)
          element.classList.add('nm-down');
      }
    }
  }

  ImportFromTracker(importText: string) {
    const trackerToNM: { [trackerName: string]: NMInfo } = {};
    for (const nm of Object.values(this.nms)) {
      if (!nm.trackerName)
        continue;
      trackerToNM[this.TransByParserLang(nm.trackerName).toLowerCase()] = nm;
    }

    const regex = this.TransByParserLang(this.options.Regex).timeRegex;
    const importList = importText.split(' → ');
    for (const entry of importList) {
      const m = regex.exec(entry);
      if (!m) {
        console.error(`Unknown tracker entry: ${entry}`);
        continue;
      }
      const name = m[1];
      const time = m[2];
      if (name === undefined || time === undefined)
        throw new UnreachableCode();
      const nm = trackerToNM[name.toLowerCase()];
      if (nm)
        nm.respawnTimeMsTracker = (parseFloat(time) * 60 * 1000) + (+new Date());
      else
        console.error(`Invalid NM Import: ${name}`);
    }

    this.UpdateTimes();
  }

  OnNetLog(e: EventResponses['LogLine']): void {
    if (!this.zoneInfo)
      return;

    const log = e.rawLine;
    const type = e.line[0];

    if (type === logDefinitions.GameLog.type) {
      const flagRegex = this.TransByParserLang(this.options.Regex).flagRegex;
      const flag = flagRegex.exec(log)?.groups;
      if (flag && flag.x && flag.y) {
        this.AddFlag(
          parseFloat(flag.x),
          parseFloat(flag.y),
          flag.before ?? '',
          flag.after ?? '',
        );
      }

      if (!this.zoneInfo.hasTracker)
        return;

      const trackerRegex = this.TransByParserLang(this.options.Regex).trackerRegex;
      const tracker = trackerRegex.exec(log)?.groups;
      if (tracker && tracker.id)
        this.currentTracker = tracker.id;

      const importRegex = this.TransByParserLang(this.options.Regex).importRegex;
      const imp = importRegex.exec(log)?.groups;
      if (imp && imp.nms)
        this.ImportFromTracker(imp.nms);
    } else if (type === logDefinitions.AddedCombatant.type && this.fairyRegex) {
      const fairy = this.fairyRegex.exec(log)?.groups;
      if (fairy)
        this.AddFairy(fairy);
    }
  }

  OnFate(e: EventResponses['onFateEvent']) {
    // Upon entering Eureka we usually receive the fate info before
    // this.zoneInfo is loaded, so lets store the events until we're
    // able to process them.
    if (!this.zoneInfo) {
      this.fateQueue.push(e);
      return;
    }

    switch (e.detail.eventType) {
      case 'add':
        for (const nm of Object.values(this.nms)) {
          if (e.detail.fateID === nm.fateID) {
            this.OnFatePop(nm);
            return;
          }
        }
        break;
      case 'remove':
        for (const nm of Object.values(this.nms)) {
          if (e.detail.fateID === nm.fateID) {
            this.OnFateKill(nm);
            return;
          }
        }
        break;
      case 'update':
        for (const nm of Object.values(this.nms)) {
          if (e.detail.fateID === nm.fateID) {
            this.OnFateUpdate(nm, e.detail.progress);
            return;
          }
        }
        break;
    }
  }

  OnCE(e: EventResponses['onCEEvent']) {
    // Upon entering Eureka we usually receive the CE info before
    // this.zoneInfo is loaded, so lets store the events until we're
    // able to process them.
    // TODO: don't make pop noises for CEs that have already started.

    if (!this.zoneInfo) {
      this.CEQueue.push(e);
      return;
    }

    const nm = Object.values(this.nms).find((nm) => e.detail.data.ceKey === nm.ceKey);
    if (!nm)
      return;

    switch (e.detail.eventType) {
      case 'add':
        this.OnFatePop(nm);
        break;
      case 'remove':
        this.OnFateKill(nm);
        break;
      case 'update':
        if (e.detail.data.status === 3)
          this.OnFateUpdate(nm, e.detail.data.progress);
        break;
    }
  }

  SimplifyText(beforeText: string, afterText: string) {
    const str = `${beforeText} ${afterText}`.toLowerCase();

    const dict = {
      'train': [
        'train',
        'tren',
        'trian',
        'tran',
        'choo choo',
        'train location',
      ],
      'fairy': [
        'fairy',
        'elemental',
        'faerie',
        'fary',
        '元灵',
        '凉粉',
        '辣条',
        '冰粉',
        '酸辣粉',
      ],
      'raise': [
        'raise',
        'rez',
        'res ',
        ' res',
        'raise plz',
      ],
      '999': [
        '999',
        '救命',
        '救救',
        '狗狗',
      ],
    };
    for (const [key, entry] of Object.entries(dict)) {
      for (const value of entry) {
        if (str.includes(value))
          return key;
      }
    }
  }

  AddFlag(x: number, y: number, beforeText: string, afterText: string) {
    const simplify = this.SimplifyText(beforeText, afterText);
    if (simplify) {
      beforeText = simplify;
      afterText = '';
    }
    beforeText = beforeText.replace(/(?: at|@)$/, '');

    const container = document.getElementById('flag-labels');
    if (!container)
      throw new UnreachableCode();
    const label = document.createElement('div');
    label.classList.add('flag');
    this.SetStyleFromMap(label.style, x, y);

    const icon = document.createElement('span');
    icon.classList.add('flag-icon');
    const name = document.createElement('span');
    name.classList.add('flag-name');
    name.classList.add('text');
    name.innerText = beforeText;
    if (beforeText !== '' && afterText !== '')
      name.innerText += ' ';
    name.innerText += afterText;
    label.appendChild(icon);
    label.appendChild(name);
    container.appendChild(label);

    window.setTimeout(() => {
      // Changing zones can also orphan all the labels.
      if (label.parentElement === container)
        container.removeChild(label);
    }, this.options.FlagTimeoutMs);
  }

  AddFairy(matches: NetMatches['AddedCombatant']) {
    if (!this.zoneInfo?.fairy)
      return;

    const mx = this.EntityToMapX(parseFloat(matches.x));
    const my = this.EntityToMapY(parseFloat(matches.y));
    this.AddFlag(mx, my, this.TransByParserLang(this.zoneInfo.fairy), '');
  }
}

UserConfig.getUserConfigLocation('eureka', defaultOptions, () => {
  const options = { ...defaultOptions };
  const tracker = new EurekaTracker(options);
  addOverlayListener('onPlayerChangedEvent', (e) => {
    tracker.OnPlayerChange(e);
  });
  addOverlayListener('ChangeZone', (e) => {
    tracker.OnChangeZone(e);
  });
  addOverlayListener('LogLine', (e) => {
    tracker.OnNetLog(e);
  });
  addOverlayListener('onFateEvent', (e) => {
    tracker.OnFate(e);
  });
  addOverlayListener('onCEEvent', (e) => {
    tracker.OnCE(e);
  });
});
