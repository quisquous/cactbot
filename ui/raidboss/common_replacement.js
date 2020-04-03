'use strict';

// TODO: maybe this should be structured identically to a timelineReplace section.
let commonReplacement = {
  '(?<=00:0839:)(.*) will be sealed off(?: in (?:[0-9]+ seconds)?)?': {
    de: 'Noch 15 Sekunden, bis sich (?:(?:der|die|das) )?(?:Zugang zu(?:[rm]| den)? )?$1 schließt',
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
  '--center--': {
    de: '--mitte--',
    fr: '--centre--',
    ja: '--センター--',
    cn: '--中央--',
    ko: '--중앙--',
  },
  '--corner--': {
    de: '--ecke--',
    fr: '--coin--',
    ja: '--コーナー--',
    cn: '--角落--',
    ko: '--구석--',
  },
  '--east--': {
    de: '--osten--',
    fr: '--est--',
    ja: '--東--',
    cn: '--东--',
    ko: '--동쪽--',
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
  '--jump--': {
    de: '--sprung--',
    fr: '--saut--',
    ja: '--ジャンプ--',
    cn: '--跳--',
    ko: '--점프--',
  },
  '--middle--': {
    de: '--mitte--',
    fr: '--milieu--',
    ja: '--中央--',
    cn: '--中间--',
    ko: '--중앙--',
  },
  '--north--': {
    de: '--norden--',
    fr: '--nord--',
    ja: '-ノース--',
    cn: '--北--',
    ko: '--북쪽--',
  },
  '--northeast--': {
    de: '--nordosten--',
    fr: '--nord-est--',
    ja: '北東',
    cn: '东北',
    ko: '북동',
  },
  '--northwest--': {
    de: '--nordwesten--',
    fr: '--nord-ouest--',
    ja: '--北西--',
    cn: '--西北--',
    ko: '--북서--',
  },
  '--south--': {
    de: '--süden--',
    fr: '--sud--',
    ja: '--南--',
    cn: '--南面--',
    ko: '--남쪽--',
  },
  '--southeast--': {
    de: '--südosten--',
    fr: '--sud-est--',
    ja: '--南東--',
    cn: '--东南--',
    ko: '--남동--',
  },
  '--southwest--': {
    de: '--südwesten--',
    fr: '--sud-ouest--',
    ja: '--南西--',
    cn: '--西南--',
    ko: '--남서--',
  },
  '--sync--': {
    de: '--synchronisation--',
    fr: '--synchronisation--',
    ja: '--sync--',
    cn: '--同步化--',
    ko: '--동기화--',
  },
  '--targetable--': {
    de: '--anvisierbar--',
    fr: '--ciblable--',
    cn: '--可选中--',
    ko: '--타겟 가능--',
  },
  '--teleport--': {
    de: '--teleportation--',
    fr: '--téléportation--',
    ja: '--テレポート--',
    cn: '--傳送--',
    ko: '--순간 이동--',
  },
  '--untargetable--': {
    de: '--nich anvisierbar--',
    fr: '--non ciblable--',
    cn: '--无法选中--',
    ko: '--타겟 불가능--',
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
