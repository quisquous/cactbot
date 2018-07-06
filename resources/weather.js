'use strict';

function getWeather(timeMs, zone) {
  let chance = getWeatherChanceValue(timeMs);

  // See weather_rate.js and territory_type.js for details.
  let rateIdx = gTerritoryWeather[zone];
  let entry = gWeatherRates[rateIdx];
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
  let unix = Math.floor(timeMs / 1000);
  // Get Eorzea hour for weather start
  let bell = unix / 175;
  // Do the magic 'cause for calculations 16:00 is 0, 00:00 is 8 and 08:00 is 16
  let increment = (bell + 8 - (bell % 8)) % 24;

  // Take Eorzea days since unix epoch
  let totalDays = Math.floor(unix / 4200);

  let calcBase = (totalDays * 0x64) + increment;

  let step1 = (calcBase << 0xB) ^ calcBase;
  let step2 = (step1 >> 8) ^ step1;

  return step2 % 0x64;
}

function floorTimeToStartOfWeather(timeMs) {
  let eightHours = 1000 * 8 * 175;
  return Math.floor(timeMs / eightHours) * eightHours;
}

function findNextWeather(timeMs, zone, searchWeather, maxTimeMs) {
  maxTimeMs = (maxTimeMs || 1000 * 60 * 1000) + timeMs;

  for (; timeMs < maxTimeMs; timeMs += 8 * 175 * 1000) {
    let weather = getWeather(timeMs, zone);
    if (weather == searchWeather)
      return floorTimeToStartOfWeather(timeMs);
  }
  return undefined;
}

function findNextWeatherNot(timeMs, zone, searchWeather, maxTimeMs) {
  maxTimeMs = (maxTimeMs || 1000 * 60 * 1000) + timeMs;

  for (; timeMs < maxTimeMs; timeMs += 8 * 175 * 1000) {
    let weather = getWeather(timeMs, zone);
    if (weather != searchWeather)
      return floorTimeToStartOfWeather(timeMs);
  }
  return undefined;
}

function findNextHour(timeMs, searchHour) {
  let oneHour = 1000 * 175;
  let fullDay = 24 * oneHour;
  let startOfDay = Math.floor(timeMs / fullDay) * fullDay;
  let time = startOfDay + searchHour * oneHour;
  if (time < timeMs)
    time += fullDay;
  return time;
}

function findNextNight(timeMs) {
  return findNextHour(timeMs, 19);
}

function findNextDay(timeMs) {
  return findNextHour(timeMs, 6);
}

function isNightTime(timeMs) {
  let hour = (timeMs / 1000 / 175) % 24;
  return hour < 6 || hour > 19;
}

function isDayTime(timeMs) {
  return !isNightTime(timeMs);
}
