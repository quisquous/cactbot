'use strict';

[{
  zoneRegex: {
    en: /^Amaurot$/,
    ko: /^아모로트$/,
  },
  timelineFile: 'amaurot.txt',
  triggers: [
    {
      id: 'Amaurot Meteor',
      regex: Regexes.headMarker({ id: '0039' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      preRun: function(data) {
        data.meteor = (data.meteor || 0) + 1;
      },
      infoText: function(data) {
        if (data.meteor == 1) {
          return {
            en: 'Drop Meteor West',
            de: 'Meteor im Westen ablegen',
            fr: 'Poser le météore à l\'ouest',
            ko: '메테오 서쪽으로 빼기',
          };
        } else if (data.meteor == 2) {
          return {
            en: 'Drop Meteor East',
            de: 'Meteor im Osten ablegen',
            fr: 'Poser le météore à l\'est',
            ko: '메테오 동쪽으로 빼기',
          };
        }
        return {
          en: 'Meteor',
          de: 'Meteor',
          fr: 'Météore',
          ko: '메테오',
        };
      },
    },
    {
      id: 'Amaurot Spread',
      regex: Regexes.headMarker({ id: '008B' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Spread',
        de: 'Verteilen',
        fr: 'Dispersez-vous',
        ko: '산개',
      },
    },
    {
      id: 'Amaurot Final Sky',
      regex: Regexes.startsUsing({ id: '3CCB', source: 'The First Beast', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3CCB', source: '(?:der|die|das) Erst(?:e|er|es|en) Unheil', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3CCB', source: 'Annélide De L\'Apocalypse', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3CCB', source: 'ファースト・ビースト', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3CCB', source: '第一之兽', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3CCB', source: '최초의 야수', capture: false }),
      alertText: {
        en: 'Hide Behind Boulder',
        de: 'Hinter einem Felsen verstecken',
        ko: '바위 뒤에 숨기',
      },
    },
    {
      id: 'Amaurot Shadow Wreck',
      regex: Regexes.startsUsing({ id: '3CE3', source: 'Therion', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3CE3', source: 'Therion', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3CE3', source: 'Mégatherion', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3CE3', source: 'メガセリオン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3CE3', source: '至大灾兽', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3CE3', source: '메가테리온', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
        ko: '전체 공격',
      },
    },
    {
      id: 'Amaurot Apokalypsis',
      regex: Regexes.startsUsing({ id: '3CD7', source: 'Therion', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3CD7', source: 'Therion', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3CD7', source: 'Mégatherion', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3CD7', source: 'メガセリオン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3CD7', source: '至大灾兽', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3CD7', source: '메가테리온', capture: false }),
      alertText: {
        en: 'Get Off',
        de: 'Runter gehen',
        fr: 'Sur les plateformes extérieures',
        ko: '바깥으로 피하기',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'The First Beast': 'das erste Unheil',
        'The Face of the Beast': 'Antlitz des Boten',
        'Fallen Star': 'Komet',
        'Therion': 'Therion',
        'Terminus Twitcher': 'Terminus-Zerrer',
        'Terminus Stalker': 'Terminus-Schleicher',
        'Terminus Sprinter': 'Terminus-Sprinter',
        'Terminus Slitherer': 'Terminus-Schlitterer',
        'Terminus Shriver': 'Terminus-Schänder',
        'Terminus Shadower': 'Terminus-Schattenschleicher',
        'Terminus Roiler': 'Terminus-Trüber',
        'Terminus Reaper': 'Terminus-Schnitter',
        'Terminus Pursuer': 'Terminus-Verfolger',
        'Terminus Lacerator': 'Terminus-Schlitzer',
        'Terminus Idolizer': 'Terminus-Anbeter',
        'Terminus Howler': 'Terminus-Heuler',
        'Terminus Flesher': 'Terminus-Zerfleischer',
        'Terminus Drainer': 'Terminus-Schlürfer',
        'Terminus Detonator': 'Terminus-Detonator',
        'Terminus Crier': 'Terminus-Schreier',
        'Terminus Bellwether': 'Läuter der Totenglocke',
        'Terminus Beholder': 'Terminus-Betrachter',
        'Mithridates': 'Mithridates',
        'Engage!': 'Start!',
        'The First Doom': 'Erstes Unheil',
        'The Second Doom': 'Zweites Unheil',
        'The Third Doom': 'Drittes Unheil',
        ':(.*) will be sealed off': ':Noch 15 Sekunden, bis sich (der|die|das)( Zugang zu[rm])? $1 schließt',
        'is no longer sealed': ' öffnet sich erneut',
      },
      'replaceText': {
        'Adds': 'Adds',
        'The Final Sky': 'Letzter Himmel',
        'The Falling Sky': 'Unheilvoller Himmel',
        'The Burning Sky': 'Brennender Himmel',
        'The Black Death': 'Schwarzer Tod',
        'attack': 'Attacke',
        'Whack': 'Wildes Schlagen',
        'Venomous Breath': 'Giftatem',
        'Turnabout': 'Umdrehung',
        'Towerfall': 'Turmsturz',
        'Therion Charge': 'Therions Rage',
        'Sickly Inferno': 'Verdorbenes Flammenmeer',
        'Sickly Flame': 'Flamme der Verderbnis',
        'Shrill Shriek': 'Schriller Schrei',
        'Shadow Wreck': 'Schatten des Unheils',
        'Self-destruct': 'Selbstzerstörung',
        'Misfortune': 'Unglück',
        'Meteor Rain': 'Meteorschauer',
        'Malevolence': 'Missgunst',
        'Ill Will': 'Böswilligkeit',
        'Force of Loathing': 'Welle der Abscheu',
        'Enrage': 'Finalangriff',
        'Earthquake': 'Erdbeben',
        'Disquieting Gleam': 'Bedrohlicher Schimmer',
        'Deathly Ray': 'Tödlicher Strahl',
        'Deadly Tentacles': 'Tödliche Tentakel',
        'Damning Ray': 'Verdammnisstrahl',
        'Cosmic Shrapnel': 'Kosmos-Splitter',
        'Cosmic Kiss': 'Einschlag',
        'Comet': 'Komet',
        'Burst': 'Explosion',
        'Apokalypsis': 'Apokalypse',
        'Aetherspike': 'Ätherstachel',
        '--untargetable--': '--nich anvisierbar--',
        '--targetable--': '--anvisierbar--',
      },
      '~effectNames': {
        'Healing Magic Down': 'Heilmagie -',
        'Fire Resistance Down': 'Feuerresistenz -',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'The First Beast': 'Annélide de l\'apocalypse',
        'The Face of the Beast': 'Visages de la Bête',
        'Fallen Star': 'Étoile',
        'Therion': 'Mégatherion',
        'Terminus Twitcher': 'Picoreur de l\'apocalypse',
        'Terminus Stalker': 'Traqueur de l\'apocalypse',
        'Terminus Sprinter': 'Sprinteur de l\'apocalypse',
        'Terminus Slitherer': 'Rampeur de l\'apocalypse',
        'Terminus Shriver': 'Flétrisseur de l\'apocalypse',
        'Terminus Shadower': 'Ombrageur de l\'apocalypse',
        'Terminus Roiler': 'Nébulosité de l\'apocalypse',
        'Terminus Reaper': 'Faucheuse de l\'apocalypse',
        'Terminus Pursuer': 'Poursuivant de l\'apocalypse',
        'Terminus Lacerator': 'Lacérateur de l\'apocalypse',
        'Terminus Idolizer': 'Adorateur de l\'apocalypse',
        'Terminus Howler': 'Hurleur de l\'apocalypse',
        'Terminus Flesher': 'Boucher de l\'apocalypse',
        'Terminus Drainer': 'Draineur de l\'apocalypse',
        'Terminus Detonator': 'Détonateur de l\'apocalypse',
        'Terminus Crier': 'Crieur de l\'apocalypse',
        'Terminus Bellwether': 'Sonneur de glas de l\'apocalypse',
        'Terminus Beholder': 'Tyrannœil de l\'apocalypse',
        'Mithridates': 'Mithridate',
        'Engage!': 'À l\'attaque',
        'The First Doom': 'La première Calamité',
        'The Second Doom': 'La deuxième Calamité',
        'The Third Doom': 'La troisième Calamité',
        ':(.*) will be sealed off': ':Fermeture $1 dans ',
        'is no longer sealed': 'Ouverture ',
      },
      'replaceText': {
        'The Final Sky': 'Étoile de la ruine',
        'The Falling Sky': 'Étoile de la calamité',
        'The Burning Sky': 'Étoile du désastre',
        'The Black Death': 'Souffle de mort noire',
        'attack': 'Attaque',
        'Whack': 'Tannée',
        'Venomous Breath': 'Souffle venimeux',
        'Turnabout': 'Rotation',
        'Towerfall': 'Écroulement',
        'Therion Charge': 'Charge de therion',
        'Sickly Inferno': 'Conflagration trouble',
        'Sickly Flame': 'Flamme trouble',
        'Shrill Shriek': 'Cri perçant',
        'Shadow Wreck': 'Calamité sombre',
        'Self-destruct': 'Auto-destruction',
        'Misfortune': 'Infortune',
        'Meteor Rain': 'Pluie d\'étoiles',
        'Malevolence': 'Attaque fielleuse',
        'Ill Will': 'Rancœur',
        'Force of Loathing': 'Onde d\'aversion',
        'Enrage': 'Enrage',
        'Earthquake': 'Tremblement de terre',
        'Disquieting Gleam': 'Lueur angoissante',
        'Deathly Ray': 'Rayon létal',
        'Deadly Tentacles': 'Tentacules mortels',
        'Damning Ray': 'Rayon accablant',
        'Cosmic Shrapnel': 'Éclatement',
        'Cosmic Kiss': 'Impact',
        'Comet': 'Comète',
        'Burst': 'Explosion',
        'Apokalypsis': 'Apokalypsis',
        'Aetherspike': 'Pic d\'éther',
        '--untargetable--': '--Impossible à cibler--',
        '--targetable--': '--Ciblable--',
        '--sync--': '--Synchronisation--',
        '--Reset--': '--Réinitialisation--',
      },
      '~effectNames': {
        'Healing Magic Down': 'Malus De Soin',
        'Fire Resistance Down': 'Résistance Au Feu Réduite',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'The First Beast': 'ファースト・ビースト',
        'The Face of the Beast': 'フェイス・オブ・ビースト',
        'Fallen Star': '流星',
        'Therion': 'メガセリオン',
        'Terminus Twitcher': 'ターミナス・ツイッチャー',
        'Terminus Stalker': 'ターミナス・ストーカー',
        'Terminus Sprinter': 'ターミナス・スプリンター',
        'Terminus Slitherer': 'ターミナス・スリザーラー',
        'Terminus Shriver': 'ターミナス・シュライヴァー',
        'Terminus Shadower': 'ターミナス・シャドワー',
        'Terminus Roiler': 'ターミナス・ロイラー',
        'Terminus Reaper': 'ターミナス・リーパー',
        'Terminus Pursuer': 'ターミナス・パースアー',
        'Terminus Lacerator': 'ターミナス・ラサレーター',
        'Terminus Idolizer': 'ターミナス・アイドライザー',
        'Terminus Howler': 'ターミナス・ハウラー',
        'Terminus Flesher': 'ターミナス・フレッシャー',
        'Terminus Drainer': 'ターミナス・ドレイナー',
        'Terminus Detonator': 'ターミナス・デトネーター',
        'Terminus Crier': 'ターミナス・クライヤー',
        'Terminus Bellwether': 'ターミナス・ベルウェザー',
        'Terminus Beholder': 'ターミナス・ビホルダー',
        'Mithridates': 'ミトリダテス',
        'Engage!': '戦闘開始！',
        'The First Doom': '第一の災い',
        'The Second Doom': '第二の災い',
        'The Third Doom': '第三の災い',
        ':(.*) will be sealed off': ':$1の封鎖まであと',
        'is no longer sealed': 'の封鎖が解かれた',
      },
      'replaceText': {
        'The Final Sky': '終末の流星',
        'The Falling Sky': '厄災の流星',
        'The Burning Sky': '変災の流星',
        'The Black Death': '黒死の吐息',
        'attack': '攻撃',
        'Whack': '乱打',
        'Venomous Breath': 'ベノムブレス',
        'Turnabout': '旋回',
        'Towerfall': '倒壊',
        'Therion Charge': 'セリオンチャージ',
        'Sickly Inferno': '汚濁の豪炎',
        'Sickly Flame': '汚濁の火焔',
        'Shrill Shriek': '絶叫',
        'Shadow Wreck': 'シャドウレック',
        'Self-destruct': '自爆',
        'Misfortune': 'ミスフォーチュン',
        'Meteor Rain': '流星群',
        'Malevolence': '邪悪撃',
        'Ill Will': '悪意',
        'Force of Loathing': '憎悪の波動',
        'Earthquake': '地震',
        'Disquieting Gleam': '不穏なる輝き',
        'Deathly Ray': 'デスリ―レイ',
        'Deadly Tentacles': 'デッドリー・テンタクル',
        'Damning Ray': 'ダミングレイ',
        'Cosmic Shrapnel': '飛散',
        'Cosmic Kiss': '着弾',
        'Comet': 'コメット',
        'Burst': '爆発',
        'Apokalypsis': 'アポカリュプシス',
        'Aetherspike': 'エーテルスパイク',
      },
      '~effectNames': {
        'Healing Magic Down': '回復魔法効果低下',
        'Fire Resistance Down': '火属性耐性低下',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'ヴォイドウォーカー': 'ヴォイドウォーカー',
        'Engage!': '战斗开始！',
      },
      'replaceText': {
        'attack': '攻击',
      },
      '~effectNames': {
        'Healing Magic Down': '治疗魔法效果降低',
        'Fire Resistance Down': '火属性耐性降低',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'The First Beast': '최초의 야수',
        'The Face of the Beast': '야수의 얼굴',
        'Fallen Star': '별똥별',
        'Therion': '메가테리온',
        'Terminus Twitcher': '종말의 경련자',
        'Terminus Stalker': '종말의 추적자',
        'Terminus Sprinter': '종말의 질주자',
        'Terminus Slitherer': '종말의 활주자',
        'Terminus Shriver': '종말의 고해자',
        'Terminus Shadower': '종말의 미행자',
        'Terminus Roiler': '종말의 교란자',
        'Terminus Reaper': '종말의 수확자',
        'Terminus Pursuer': '종말의 추격자',
        'Terminus Lacerator': '종말의 난도자',
        'Terminus Idolizer': '종말의 숭배자',
        'Terminus Howler': '종말의 절규자',
        'Terminus Flesher': '종말의 도살자',
        'Terminus Drainer': '종말의 소모자',
        'Terminus Detonator': '종말의 기폭자',
        'Terminus Crier': '종말의 포고자',
        'Terminus Bellwether': '종말의 선도자',
        'Terminus Beholder': '종말의 주시자',
        'Mithridates': '미트리다테스',
        'Engage!': '전투 시작!',
        'The First Doom': '첫 번째 재앙',
        'The Second Doom': '두 번째 재앙',
        'The Third Doom': '세 번째 재앙',
        ':([0-9]{1,4}):(.*) will be sealed off': ':$1:15초 후에 $2(이|가) 봉쇄됩니다\.',
        'is no longer sealed': '의 봉쇄가 해제되었습니다',
      },
      'replaceText': {
        'attack': '공격',
        'Adds': '쫄들',
        'The Final Sky': '종말의 유성',
        'The Falling Sky': '재앙의 유성',
        'The Burning Sky': '변재의 유성',
        'The Black Death': '검은 죽음의 숨결',
        'Whack': '마구 치기',
        'Venomous Breath': '독 숨결',
        'Turnabout': '선회',
        'Towerfall': '무너지는 탑',
        'Therion Charge': '테리온 돌격',
        'Sickly Inferno': '혼탁한 대화염',
        'Sickly Flame': '혼탁한 화염',
        'Shrill Shriek': '절규',
        'Shadow Wreck': '그림자 파멸',
        'Self-destruct': '자폭',
        'Misfortune': '불운',
        'Meteor Rain': '유성군',
        'Malevolence': '사악한 공격',
        'Ill Will': '악의',
        'Force of Loathing': '증오의 파동',
        'Enrage': '전멸기',
        'Earthquake': '지진',
        'Disquieting Gleam': '불온한 빛',
        'Deathly Ray': '죽음 광선',
        'Deadly Tentacles': '치명적인 촉수',
        'Damning Ray': '파멸의 광선',
        'Cosmic Shrapnel': '산산조각',
        'Cosmic Kiss': '착탄',
        'Comet': '혜성',
        'Burst': '대폭발',
        'Apokalypsis': '묵시록',
        'Aetherspike': '에테르 강타',
        '--untargetable--': '--타겟 불가능--',
        '--targetable--': '--타겟 가능--',
      },
      '~effectNames': {
        'Healing Magic Down': '회복마법 효과 감소',
        'Fire Resistance Down': '불속성 저항 감소',
      },
    },
  ],
}];
