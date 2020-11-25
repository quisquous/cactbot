import gWeatherRates from './weather_rate.js';
import ZoneInfo from './zone_info.js';

export function getWeather(timeMs, zoneId) {
  const chance = getWeatherChanceValue(timeMs);

  // See weather_rate.js and territory_type.js for details.
  const rateIdx = ZoneInfo[zoneId].weatherRate;
  const entry = gWeatherRates[rateIdx];
  if (!entry)
    return;

  for (let i = 0; i < entry.rates.length; ++i) {
    if (chance < entry.rates[i])
      return entry.weathers[i];
  }
}

// From https://github.com/ufx/SaintCoinach/blob/4bf6d951957502a7faa056ffc1cc7026a18fb253/SaintCoinach/Xiv/WeatherRate.cs
// Relicensed from the "Do What the F*ck You Want To Public License".
function getWeatherChanceValue(timeMs) {
  const unix = Math.floor(timeMs / 1000);
  // Get Eorzea hour for weather start
  const bell = unix / 175;
  // Do the magic 'cause for calculations 16:00 is 0, 00:00 is 8 and 08:00 is 16
  const increment = (bell + 8 - (bell % 8)) % 24;

  // Take Eorzea days since unix epoch
  const totalDays = (unix / 4200) >>> 0;

  // The following math all needs to be done as unsigned integers.
  const calcBase = ((totalDays * 0x64) + increment) >>> 0;

  const step1 = ((calcBase << 0xB) ^ calcBase) >>> 0;
  const step2 = ((step1 >>> 8) ^ step1) >>> 0;

  return step2 % 0x64;
}

function floorTimeToStartOfWeather(timeMs) {
  const eightHours = 1000 * 8 * 175;
  return Math.floor(timeMs / eightHours) * eightHours;
}

export function findNextWeather(timeMs, zoneId, searchWeather, maxTimeMs) {
  maxTimeMs = (maxTimeMs || 1000 * 60 * 1000) + timeMs;

  for (; timeMs < maxTimeMs; timeMs += 8 * 175 * 1000) {
    const weather = getWeather(timeMs, zoneId);
    if (weather === searchWeather)
      return floorTimeToStartOfWeather(timeMs);
  }
  return undefined;
}

export function findNextWeatherNot(timeMs, zoneId, searchWeather, maxTimeMs) {
  maxTimeMs = (maxTimeMs || 1000 * 60 * 1000) + timeMs;

  for (; timeMs < maxTimeMs; timeMs += 8 * 175 * 1000) {
    const weather = getWeather(timeMs, zoneId);
    if (weather !== searchWeather)
      return floorTimeToStartOfWeather(timeMs);
  }
  return undefined;
}

function findNextHour(timeMs, searchHour) {
  const oneHour = 1000 * 175;
  const fullDay = 24 * oneHour;
  const startOfDay = Math.floor(timeMs / fullDay) * fullDay;
  let time = startOfDay + searchHour * oneHour;
  if (time < timeMs)
    time += fullDay;
  return time;
}

export function findNextNight(timeMs) {
  return findNextHour(timeMs, 19);
}

export function findNextDay(timeMs) {
  return findNextHour(timeMs, 6);
}

export function isNightTime(timeMs) {
  const hour = (timeMs / 1000 / 175) % 24;
  return hour < 6 || hour > 19;
}

function isDayTime(timeMs) {
  return !isNightTime(timeMs);
}
