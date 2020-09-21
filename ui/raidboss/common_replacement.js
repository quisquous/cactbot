'use strict';

// TODO: maybe this should be structured identically to a timelineReplace section.

// It's awkward to refer to these string keys, so name them as replaceSync[keys.sealKey].
const syncKeys = {
  seal: '(?<=00:0839:)(.*) will be sealed off(?: in (?:[0-9]+ seconds)?)?',
  unseal: 'is no longer sealed',
  engage: 'Engage!',
};

const commonReplacement = {
  replaceSync: {
    [syncKeys.seal]: {
      en: '$1 will be sealed off',
      de: 'Noch 15 Sekunden, bis sich (?:(?:der|die|das) )?(?:Zugang zu(?:[rm]| den)? )?$1 schließt',
      fr: 'Fermeture d(?:e|u|es) $1 dans',
      ja: '$1の封鎖まであと',
      cn: '距$1被封锁还有',
      ko: '15초 후에 $1(?:이|가) 봉쇄됩니다',
    },
    [syncKeys.unseal]: {
      en: 'is no longer sealed',
      de: 'öffnet sich (?:wieder|erneut)',
      fr: 'Ouverture ',
      ja: 'の封鎖が解かれた',
      cn: '的封锁解除了',
      ko: '의 봉쇄가 해제되었습니다',
    },
    [syncKeys.engage]: {
      en: 'Engage!',
      de: 'Start!',
      fr: 'À l\'attaque',
      ja: '戦闘開始！',
      cn: '战斗开始！',
      ko: '전투 시작!',
    },
  },
  replaceText: {
    '--adds spawn--': {
      de: '--adds spawn--',
      fr: '--apparition d\'adds--',
      ja: '--雑魚出現--',
      cn: '--小怪出现--',
      ko: '--쫄 소환--',
    },
    '--adds targetable--': {
      de: '--adds anvisierbar--',
      fr: '--adds ciblables--',
      ja: '--雑魚ターゲット可能--',
      cn: '--小怪可选中--',
      ko: '--쫄 타겟 가능--',
    },
    '--center--': {
      de: '--mitte--',
      fr: '--centre--',
      ja: '--センター--',
      cn: '--中央--',
      ko: '--중앙--',
    },
    '--clones appear--': {
      de: '--klone erscheinen--',
      fr: '--apparition des clones--',
      ja: '--幻影出現--',
      cn: '--克隆 体 出现--',
      ko: '--분신 소환--',
    },
    '--corner--': {
      de: '--ecke--',
      fr: '--coin--',
      ja: '--コーナー--',
      cn: '--角落--',
      ko: '--구석--',
    },
    '--dps burn--': {
      de: '--dps burn--',
      fr: '--burn dps--',
      ja: '--dps burn--',
      cn: '--dps burn--',
      ko: '--dps burn--',
    },
    '--east--': {
      de: '--osten--',
      fr: '--est--',
      ja: '--東--',
      cn: '--东--',
      ko: '--동쪽--',
    },
    'Enrage': {
      de: 'Finalangriff',
      fr: 'Enrage',
      ja: '時間切れ',
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
    '--knockback--': {
      fr: '--poussée--',
      ja: '--ノックバック--',
      cn: '--击退--',
      ko: '--넉백--',
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
      ja: '--北--',
      cn: '--北--',
      ko: '--북쪽--',
    },
    '--northeast--': {
      de: '--nordosten--',
      fr: '--nord-est--',
      ja: '--北東--',
      cn: '--东北--',
      ko: '--북동--',
    },
    '--northwest--': {
      de: '--nordwesten--',
      fr: '--nord-ouest--',
      ja: '--北西--',
      cn: '--西北--',
      ko: '--북서--',
    },
    '--rotate--': {
      de: '--rotieren--',
      fr: '--rotation--',
      ja: '--回転--',
      cn: '--龙回转--',
      ko: '--회전--',
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
    '--split--': {
      de: '--teilen--',
      fr: '--division--',
      ja: '--分裂--',
      cn: '--分裂--',
      ko: '--분열--',
    },
    '--stun--': {
      de: '--Betäubung--',
      fr: '--étourdissement--',
      ja: '--スタン--',
      cn: '--击晕--',
      ko: '--기절--',
    },
    '--sync--': {
      de: '--synchronisation--',
      fr: '--synchronisation--',
      ja: '--シンク--',
      cn: '--同步化--',
      ko: '--동기화--',
    },
    '--([0-9]+x )?targetable--': {
      de: '--$1anvisierbar--',
      fr: '--$1ciblable--',
      ja: '--$1ターゲット可能--',
      cn: '--$1可选中--',
      ko: '--$1타겟 가능--',
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
      ja: '--ターゲット不可--',
      cn: '--无法选中--',
      ko: '--타겟 불가능--',
    },
  },
};

// Keys into commonReplacement objects that represent "partial" translations,
// in the sense that even if it applies, there still needs to be another
// translation for it to be complete.  These keys should be exactly the same
// as the keys from the commonReplacement block above.
const partialCommonReplacementKeys = [
  // Because the zone name needs to be translated here, this is partial.
  syncKeys.seal,
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    commonReplacement: commonReplacement,
    partialCommonReplacementKeys: partialCommonReplacementKeys,
    syncKeys: syncKeys,
  };
}
