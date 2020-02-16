'use strict';

// TODO: maybe this should be structured identically to a timelineReplace section.
let commonReplacement = {
  ':([0-9]{4}):(.*) will be sealed off': {
    de: ':$1:Noch 15 Sekunden bis sich (?:das|die|der Zugang zu[rm]?) $2 schließt',
    cn: ':$1:距$2被封锁还有',
    fr: ':$1:Fermeture d(?:e|u|es) $2 dans',
    ja: '$1:$2の封鎖まであと',
    ko: ':$1:15초 후에 $2(이|가) 봉쇄됩니다',
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

if (typeof module !== 'undefined' && module.exports)
  module.exports = commonReplacement;
