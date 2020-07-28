'use strict';

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
