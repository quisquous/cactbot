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
      en: 'Battle commencing in (?<time>\\y{Float}) seconds! \\((?<player>.*?)\\)',
      de: 'Noch (?<time>\\y{Float}) Sekunden bis Kampfbeginn! \\((?<player>.*?)\\)',
      fr: 'Début du combat dans (?<time>\\y{Float}) secondes[ ]?! \\((?<player>.*?)\\)',
      ja: '戦闘開始まで(?<time>\\y{Float})秒！ \\((?<player>.*?)\\)',
      cn: '距离战斗开始还有(?<time>\\y{Float})秒！ （(?<player>.*?)）',
      ko: '전투 시작 (?<time>\\y{Float})초 전! \\((?<player>.*?)\\)',
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
    // TODO: CN and KO have not launched patch 5.3 yet, so they do not have trial synthesis.
    // Translation will be added once launch.
    craftingStart: {
      en: 'You begin (synthesizing|trial synthesis of) (?<recipe>.*)\\.',
      de: 'Du hast (begonnen, durch Synthese|mit der Testsynthese von) (?<recipe>.*) (herzustellen|begonnen)\\.',
      fr: 'Vous commencez (à fabriquer|une synthèse d\'essai pour) (?<recipe>.*)\\.',
      ja: '(?<player>\\y{Name})は(?<recipe>.*)の製作(練習)?を開始した。',
      cn: '(?<player>\\y{Name})开始制作(?<recipe>.*)。',
      ko: '(?<recipe>.*)(개)? 제작을 시작합니다\\.',
    },
    craftingFinish: {
      en: '(You synthesize|Your trial synthesis of) (?<recipe>.*)( proved a success!)?',
      de: '(Die Testsynthese von )?(?<recipe>.*) (hergestellt\\.|war erfolgreich!)',
      fr: '(Vous fabriquez|Votre synthèse d\'essai pour fabriquer) (?<recipe>.*)( a été couronnée de succès!)?',
      ja: '(?<player>\\y{Name})は(?<recipe>.*)(を完成させた|の製作練習に成功した)！',
      cn: '(?<player>\\y{Name})制作(?<recipe>.*)成功！',
      ko: '(?<player>\\y{Name}) 님이 (?<recipe>.*)(을|를) 완성했습니다!',
    },
    craftingFail: {
      en: 'Your (synthesis fails!|trial synthesis of failed\\.{3})',
      de: '(Deine Synthese ist fehlgeschlagen!)|(Die Testsynthese von (?<recipe>.*) ist fehlgeschlagen\\.{3})',
      fr: '(La synthèse échoue\\.{3})|(Votre synthèse d\'essai pour fabriquer (?<recipe>.*) s\'est soldée par un échec\\.{3})',
      ja: '(?<player>\\y{Name})は(製作|(?<recipe>.*)の製作練習)に失敗した……',
      cn: '(?<player>\\y{Name})制作失败了……',
      ko: '제작에 실패했습니다……\\.',
    },
    craftingCancel: {
      en: 'You (cancel the synthesis|abandoned trial synthesis)\\.',
      de: '(Du hast die Synthese|Testsynthese) abgebrochen\\.',
      fr: '(La synthèse est annulée)|(Vous avez interrompu la synthèse d\'essai)\\.',
      ja: '(?<player>\\y{Name})は製作(練習)?を中止した。',
      cn: '(?<player>\\y{Name})中止了制作作业。',
      ko: '제작을 중지했습니다\\.',
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
