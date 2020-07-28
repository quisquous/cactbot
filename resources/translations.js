'use strict';

// TODO: remove this in favor of using resources/content_type.js
const IntlZoneNames = {
  O1S: /Deltascape V1\.0 \(Savage\)/,
  O2S: /Deltascape V2\.0 \(Savage\)/,
  O3S: /Deltascape V3\.0 \(Savage\)/,
  O4S: /Deltascape V4\.0 \(Savage\)/,
  UCU: /The Unending Coil Of Bahamut \(Ultimate\)/,
  O5S: /Sigmascape V1\.0 \(Savage\)/,
  O6S: /Sigmascape V2\.0 \(Savage\)/,
  O7S: /Sigmascape V3\.0 \(Savage\)/,
  O8S: /Sigmascape V4\.0 \(Savage\)/,
  UWU: /The Weapon's Refrain \(Ultimate\)/,
  O9S: /Alphascape V1\.0 \(Savage\)/,
  O10S: /Alphascape V2\.0 \(Savage\)/,
  O11S: /Alphascape V3\.0 \(Savage\)/,
  O12S: /Alphascape V4\.0 \(Savage\)/,
  E1S: /Eden's Gate: Resurrection \(Savage\)/,
  E2S: /Eden's Gate: Descent \(Savage\)/,
  E3S: /Eden's Gate: Inundation \(Savage\)/,
  E4S: /Eden's Gate: Sepulture \(Savage\)/,
  E5S: /Eden's Verse: Fulmination \(Savage\)/,
  E6S: /Eden's Verse: Furor \(Savage\)/,
  E7S: /Eden's Verse: Iconoclasm \(Savage\)/,
  E8S: /Eden's Verse: Refulgence \(Savage\)/,
  PvpSeize: /Seal Rock \(Seize\)/,
  PvpSecure: /The Borderland Ruins \(Secure\)/,
  PvpShatter: /The Fields Of Glory \(Shatter\)/,
  EurekaAnemos: /Eureka Anemos/,
  EurekaPagos: /(Eureka Pagos|Unknown Zone \(2Fb\))/,
  EurekaPyros: /(Eureka Pyros|Unknown Zone \(31B\))/,
  EurekaHydatos: /(Eureka Hydatos|Unknown Zone \(33B\))/,
};

let LocaleRegex = {};
let LocaleNetRegex = {};

// TODO: figure out some non-var way to require files for node, but not break html includes.
/* eslint-disable no-var */
var Regexes;
var NetRegexes;
/* eslint-enable */

if (typeof module !== 'undefined') {
  if (module.exports) {
    module.exports = {
      LocaleRegex: LocaleRegex,
      LocaleNetRegex: LocaleNetRegex,
    };
  }
  Regexes = require('./regexes.js');
  NetRegexes = require('./netregexes.js');
}

// Fill in LocaleRegex so that things like LocaleRegex.countdownStart.de is a valid regex.
(() => {
  const localeLines = {
    countdownStart: {
      en: 'Battle commencing in (?<time>\\y{Float}) seconds!',
      de: 'Noch (?<time>\\y{Float}) Sekunden bis Kampfbeginn!',
      fr: 'Début du combat dans (?<time>\\y{Float}) secondes[ ]?!',
      ja: '戦闘開始まで(?<time>\\y{Float})秒！',
      cn: '距离战斗开始还有(?<time>\\y{Float})秒！',
      ko: '전투 시작 (?<time>\\y{Float})초 전!',
    },
    countdownEngage: {
      en: 'Engage!',
      de: 'Start!',
      fr: 'À l\'attaque[ ]?!',
      ja: '戦闘開始！',
      cn: '战斗开始！',
      ko: '전투 시작!',
    },
    countdownCancel: {
      en: 'Countdown canceled by (?<player>\\y{Name})',
      de: '(?<player>\\y{Name}) hat den Countdown abgebrochen',
      fr: 'Le compte à rebours a été interrompu par (?<player>\\y{Name})[ ]?\\.',
      ja: '(?<player>\\y{Name})により、戦闘開始カウントがキャンセルされました。',
      cn: '(?<player>\\y{Name})取消了战斗开始倒计时。',
      ko: '(?<player>\\y{Name}) 님이 초읽기를 취소했습니다\\.',
    },
    areaSeal: {
      en: '(?<area>\\y{Name}) will be sealed off in (?<time>\\y{Float}) seconds!',
      de: 'Noch (?<time>\\y{Float}) Sekunden, bis sich (?<area>\\y{Name}) schließt',
      fr: 'Fermeture (?<area>\\y{Name}) dans (?<time>\\y{Float}) secondes[ ]?\\.',
      ja: '(?<area>\\y{Name})の封鎖まであと(?<time>\\y{Float})秒',
      cn: '距(?<area>\\y{Name})被封锁还有(?<time>\\y{Float})秒',
      ko: '(?<time>\\y{Float})초 후에 (?<area>\\y{Name})(이|가) 봉쇄됩니다\\.',
    },
    areaUnseal: {
      en: '(?<area>\\y{Name}) is no longer sealed.',
      de: '(?<area>\\y{Name}) öffnet sich erneut.',
      fr: 'Ouverture (?<area>\\y{Name})[ ]?!',
      ja: '(?<area>\\y{Name})の封鎖が解かれた……',
      cn: '(?<area>\\y{Name})的封锁解除了',
      ko: '(?<area>\\y{Name})의 봉쇄가 해제되었습니다\\.',
    },
  };

  for (const [key, trans] of Object.entries(localeLines)) {
    LocaleRegex[key] = {};
    LocaleNetRegex[key] = {};
    for (const [lang, line] of Object.entries(trans)) {
      LocaleRegex[key][lang] = Regexes.gameLog({ line: line + '.*?' });
      LocaleNetRegex[key][lang] = NetRegexes.gameLog({ line: line + '[^|]*?' });
    }
  }
})();
