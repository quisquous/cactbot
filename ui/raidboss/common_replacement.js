'use strict';

let commonReplacement = {
  ':([0-9]{4}):(.*) will be sealed off': {
    de: ':$1:Noch 15 Sekunden bis sich der Zugang zu $2 schließt',
    fr: ':$1:Fermeture $2 dans',
    ja: '$1:$2の封鎖まであと',
    cn: ':([0-9]{4}):(.*) will be sealed off', // FIXME
    ko: ':$1:15초 후에 $2(이|가) 봉쇄됩니다',
  },
  'is no longer sealed': {
    de: 'öffnet sich erneut',
    fr: 'Ouverture ',
    ja: 'の封鎖が解かれた',
    cn: 'is no longer sealed', // FIXME
    ko: '의 봉쇄가 해제되었습니다',
  },
  'Engage!': {
    de: 'Start!',
    fr: 'À l\'attaque',
    ja: '戦闘開始！',
    cn: '战斗开始！',
    ko: '전투 시작!',
  },
  'attack': {
    de: 'Attacke',
    fr: 'Attaque',
    ja: '攻撃',
    cn: '攻击',
    ko: '공격',
  },
  'Enrage': {
    de: 'Finalangriff',
    fr: 'Enrage',
    ja: 'Enrage', // FIXME
    cn: '狂暴',
    ko: '전멸기',
  },
  '--untargetable--': {
    de: '--nich anvisierbar--',
    fr: '--Impossible à cibler--',
    ja: '--untargetable--', // FIXME
    cn: '--无法选中--',
    ko: '--타겟 불가능--',
  },
  '--targetable--': {
    de: '--anvisierbar--',
    fr: '--Ciblable--',
    ja: '--targetable--', // FIXME
    cn: '--可选中--',
    ko: '--타겟 가능--',
  },
};
