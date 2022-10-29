import WeatherRate from './weather_rate';
import ZoneInfo from './zone_info';

export const getWeather = (timeMs: number, zoneId: number): string | undefined => {
  const chance = getWeatherChanceValue(timeMs);

  // See weather_rate.ts and territory_type.ts for details.
  const rateIdx = ZoneInfo[zoneId]?.weatherRate;
  if (!rateIdx)
    return;
  const entry = WeatherRate[rateIdx];
  if (!entry)
    return;

  let idx = 0;
  for (const rate of entry.rates) {
    if (chance < rate)
      return entry.weathers[idx];
    idx++;
  }
};

// From https://github.com/ufx/SaintCoinach/blob/4bf6d951957502a7faa056ffc1cc7026a18fb253/SaintCoinach/Xiv/WeatherRate.cs
// Relicensed from the "Do What the F*ck You Want To Public License".
const getWeatherChanceValue = (timeMs: number) => {
  const unix = Math.floor(timeMs / 1000);
  // Get Eorzea hour for weather start
  const bell = unix / 175;
  // Do the magic 'cause for calculations 16:00 is 0, 00:00 is 8 and 08:00 is 16
  const increment = (bell + 8 - bell % 8) % 24;

  // Take Eorzea days since unix epoch
  const totalDays = unix / 4200 >>> 0;

  // The following math all needs to be done as unsigned integers.
  const calcBase = totalDays * 0x64 + increment >>> 0;

  const step1 = (calcBase << 0xB ^ calcBase) >>> 0;
  const step2 = (step1 >>> 8 ^ step1) >>> 0;

  return step2 % 0x64;
};

const floorTimeToStartOfWeather = (timeMs: number) => {
  const eightHours = 1000 * 8 * 175;
  return Math.floor(timeMs / eightHours) * eightHours;
};

export const findNextWeather = (
  timeMs: number,
  zoneId: number,
  searchWeather: string,
  maxTimeMs?: number,
): number | undefined => {
  maxTimeMs = (maxTimeMs || 1000 * 60 * 1000) + timeMs;

  for (; timeMs < maxTimeMs; timeMs += 8 * 175 * 1000) {
    const weather = getWeather(timeMs, zoneId);
    if (weather === searchWeather)
      return floorTimeToStartOfWeather(timeMs);
  }
  return undefined;
};

export const findNextWeatherNot = (
  timeMs: number,
  zoneId: number,
  searchWeather: string,
  maxTimeMs?: number,
): number | undefined => {
  maxTimeMs = (maxTimeMs || 1000 * 60 * 1000) + timeMs;

  for (; timeMs < maxTimeMs; timeMs += 8 * 175 * 1000) {
    const weather = getWeather(timeMs, zoneId);
    if (weather !== searchWeather)
      return floorTimeToStartOfWeather(timeMs);
  }
  return undefined;
};

const findNextHour = (timeMs: number, searchHour: number) => {
  const oneHour = 1000 * 175;
  const fullDay = 24 * oneHour;
  const startOfDay = Math.floor(timeMs / fullDay) * fullDay;
  let time = startOfDay + searchHour * oneHour;
  if (time < timeMs)
    time += fullDay;
  return time;
};

export const findNextNight = (timeMs: number): number => {
  return findNextHour(timeMs, 19);
};

export const findNextDay = (timeMs: number): number => {
  return findNextHour(timeMs, 6);
};

export const isNightTime = (timeMs: number): boolean => {
  const hour = timeMs / 1000 / 175 % 24;
  return hour < 6 || hour > 19;
};

export const isDayTime = (timeMs: number): boolean => {
  return !isNightTime(timeMs);
};
