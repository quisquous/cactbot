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
      en: '(?<area>.*?) will be sealed off in (?<time>\\y{Float}) seconds!',
      de: 'Noch (?<time>\\y{Float}) Sekunden, bis sich (?<area>.*?) schließt',
      fr: 'Fermeture (?<area>.*?) dans (?<time>\\y{Float}) secondes[ ]?\\.',
      ja: '(?<area>.*?)の封鎖まであと(?<time>\\y{Float})秒',
      cn: '距(?<area>.*?)被封锁还有(?<time>\\y{Float})秒',
      ko: '(?<time>\\y{Float})초 후에 (?<area>.*?)(이|가) 봉쇄됩니다\\.',
    },
    areaUnseal: {
      en: '(?<area>.*?) is no longer sealed.',
      de: '(?<area>.*?) öffnet sich erneut.',
      fr: 'Ouverture (?<area>.*?)[ ]?!',
      ja: '(?<area>.*?)の封鎖が解かれた……',
      cn: '(?<area>.*?)的封锁解除了',
      ko: '(?<area>.*?)의 봉쇄가 해제되었습니다\\.',
    },
    // Recipe name always start with \ue0bb
    // HQ icon is \ue03c
    // TODO: CN and KO have not launched patch 5.3 yet, so they do not have trial synthesis.
    // Translation will be added once launch.
    craftingStart: {
      en: 'You begin synthesizing (?<count>(an?|\\d+) )?\ue0bb(?<recipe>.*)\\.',
      de: 'Du hast begonnen, durch Synthese (?<count>(ein(e|es|em|er)?|\\d+) )?\ue0bb(?<recipe>.*) herzustellen\\.',
      fr: 'Vous commencez à fabriquer (?<count>(une?|\\d+) )?\ue0bb(?<recipe>.*)\\.',
      ja: '(?<player>\\y{Name})は\ue0bb(?<recipe>.*)(×(?<count>\\d+))?の製作を開始した。',
      cn: '(?<player>\\y{Name})开始制作“\ue0bb(?<recipe>.*)”(×(?<count>\\d+))?。',
      ko: '\ue0bb(?<recipe>.*)(×(?<count>\\d+)개)? 제작을 시작합니다\\.',
    },
    trialCraftingStart: {
      en: 'You begin trial synthesis of \ue0bb(?<recipe>.*)\\.',
      de: 'Du hast mit der Testsynthese von \ue0bb(?<recipe>.*) begonnen\\.',
      fr: 'Vous commencez une synthèse d\'essai pour une? \ue0bb(?<recipe>.*)\\.',
      ja: '(?<player>\\y{Name})は\ue0bb(?<recipe>.*)の製作練習を開始した。',
    },
    craftingFinish: {
      en: 'You synthesize (?<count>(an?|\\d+) )?\ue0bb(?<recipe>.*)(\ue03c)?\\.',
      de: 'Du hast erfolgreich (?<count>(ein(e|es|em|er)?|\\d+) )?(?<recipe>.*)(\ue03c)? hergestellt\\.',
      fr: 'Vous fabriquez (?<count>(une?|\\d+) )?\ue0bb(?<recipe>.*)(\ue03c)?\\.',
      ja: '(?<player>\\y{Name})は\ue0bb(?<recipe>.*)(\ue03c)?(×(?<count>\\d+))?を完成させた！',
      cn: '(?<player>\\y{Name})制作“\ue0bb(?<recipe>.*)(\ue03c)?”(×(?<count>\\d+))?成功！',
      ko: '(?<player>\\y{Name}) 님이 \ue0bb(?<recipe>.*)(\ue03c)?(×(?<count>\\d+)개)?(을|를) 완성했습니다!',
    },
    trialCraftingFinish: {
      en: 'Your trial synthesis of \ue0bb(?<recipe>.*) proved a success!',
      de: 'Die Testsynthese von \ue0bb(?<recipe>.*) war erfolgreich!',
      fr: 'Votre synthèse d\'essai pour fabriquer \ue0bb(?<recipe>.*) a été couronnée de succès!',
      ja: '(?<player>\\y{Name})は\ue0bb(?<recipe>.*)の製作練習に成功した！',
    },
    craftingFail: {
      en: 'Your synthesis fails!',
      de: 'Deine Synthese ist fehlgeschlagen!',
      fr: 'La synthèse échoue\\.{3}',
      ja: '(?<player>\\y{Name})は製作に失敗した……',
      cn: '(?<player>\\y{Name})制作失败了……',
      ko: '제작에 실패했습니다……\\.',
    },
    trialCraftingFail: {
      en: 'Your trial synthesis of \ue0bb(?<recipe>.*) failed\\.{3}',
      de: 'Die Testsynthese von \ue0bb(?<recipe>.*) ist fehlgeschlagen\\.{3}',
      fr: 'Votre synthèse d\'essai pour fabriquer \ue0bb(?<recipe>.*) s\'est soldée par un échec\\.{3}',
      ja: '(?<player>\\y{Name})は\ue0bb(?<recipe>.*)の製作練習に失敗した……',
    },
    craftingCancel: {
      en: 'You cancel the synthesis\\.',
      de: 'Du hast die Synthese abgebrochen\\.',
      fr: 'La synthèse est annulée\\.',
      ja: '(?<player>\\y{Name})は製作を中止した。',
      cn: '(?<player>\\y{Name})中止了制作作业。',
      ko: '제작을 중지했습니다\\.',
    },
    trialCraftingCancel: {
      en: 'You abandoned trial synthesis\\.',
      de: 'Testsynthese abgebrochen\\.',
      fr: 'Vous avez interrompu la synthèse d\'essai\\.',
      ja: '(?<player>\\y{Name})は製作練習を中止した。',
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
