'use strict';

// TODO: maybe this should be structured identically to a timelineReplace section.
let commonReplacement = {
  '(?<=00:0839:)(.*) will be sealed off': {
    de: 'Noch 15 Sekunden bis sich (?:das|die|der Zugang zu[rm]?) $1 schließt',
    cn: '距$1被封锁还有',
    fr: 'Fermeture d(?:e|u|es) $1 dans',
    ja: '$1の封鎖まであと',
    ko: '15초 후에 $1(이|가) 봉쇄됩니다',
  },
  'is no longer sealed': {
    de: 'öffnet sich erneut',
    fr: 'Ouverture ',
    ja: 'の封鎖が解かれた',
    ko: '의 봉쇄가 해제되었습니다',
  },
  'Engage!': {
    de: 'Start!',
    fr: 'À l\'attaque',
    ja: '戦闘開始！',
    cn: '战斗开始！',
    ko: '전투 시작!',
  },
  'Enrage': {
    de: 'Finalangriff',
    fr: 'Enrage',
    cn: '狂暴',
    ko: '전멸기',
  },
  '--untargetable--': {
    de: '--nich anvisierbar--',
    fr: '--Impossible à cibler--',
    cn: '--无法选中--',
    ko: '--타겟 불가능--',
  },
  '--targetable--': {
    de: '--anvisierbar--',
    fr: '--Ciblable--',
    cn: '--可选中--',
    ko: '--타겟 가능--',
  },
};

// Keys into commonReplacement objects that represent "partial" translations,
// in the sense that even if it applies, there still needs to be another
// translation for it to be complete.
let partialCommonReplacementKeys = [
  // Because the zone name needs to be translated here, this is partial.
  ':([0-9]{4}):(.*) will be sealed off',
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    commonReplacement: commonReplacement,
    partialCommonReplacementKeys: partialCommonReplacementKeys,
  };
}
