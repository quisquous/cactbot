Options.Triggers.push({
  id: 'HeavenOnHighGeneral',
  zoneId: [
    ZoneId.HeavenOnHighFloors1_10,
    ZoneId.HeavenOnHighFloors11_20,
    ZoneId.HeavenOnHighFloors21_30,
    ZoneId.HeavenOnHighFloors31_40,
    ZoneId.HeavenOnHighFloors41_50,
    ZoneId.HeavenOnHighFloors51_60,
    ZoneId.HeavenOnHighFloors61_70,
    ZoneId.HeavenOnHighFloors71_80,
    ZoneId.HeavenOnHighFloors81_90,
    ZoneId.HeavenOnHighFloors91_100,
  ],
  zoneLabel: {
    en: 'Heaven-on-High (All Floors)',
    de: 'Himmelssäule (Alle Ebenen)',
    cn: '天之御柱 (全楼层)',
    ko: '천궁탑 (전체 층)',
  },
  triggers: [
    // ---------------- Quivering Coffers ----------------
    {
      id: 'HoH General Quivering Coffer Spawn',
      // 7392 = Quivering Coffer (floor 1-30 bronze chests, can stun or interrupt)
      // 7393 = Quivering Coffer (floor 31-60 silver chests, can stun or interrupt)
      // 7394 = Quivering Coffer (floor 61+ gold chests, can interrupt, immune to stun)
      // TODO: some Quivering Coffers may spawn after transference between floors and get called early before being found
      type: 'AddedCombatant',
      netRegex: { npcNameId: '739[2-4]', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Quivering Coffer spawned!',
          de: 'zuckende Schnapptruhe ist erschienen',
          cn: '已生成 抖动的宝箱!',
          ko: '꿈틀거리는 보물상자 등장!',
        },
      },
    },
    {
      id: 'HoH General Quivering Coffer Malice',
      // same id regardless of which "type" of Quivering Coffer
      // inflicts Accursed Pox (43F) if not interrupted
      type: 'StartsUsing',
      netRegex: { id: '3019', source: 'Quivering Coffer' },
      response: Responses.interruptIfPossible(),
    },
    // ---------------- Pomanders and Magicite ----------------
    {
      id: 'HoH General Pomander Duplicate',
      // duplicate item message: https://xivapi.com/LogMessage/7222?pretty=true
      // en: You return the pomander of ${pomander} to the coffer. You cannot carry any more of that item.
      type: 'SystemLogMessage',
      netRegex: { id: '1C36' },
      infoText: (_data, matches, output) => {
        switch (parseInt(matches.param1, 16)) {
          case 1:
            return output.duplicate({ pomander: output.safety() });
          case 2:
            return output.duplicate({ pomander: output.sight() });
          case 3:
            return output.duplicate({ pomander: output.strength() });
          case 4:
            return output.duplicate({ pomander: output.steel() });
          case 5:
            return output.duplicate({ pomander: output.affluence() });
          case 6:
            return output.duplicate({ pomander: output.flight() });
          case 7:
            return output.duplicate({ pomander: output.alteration() });
          case 8:
            return output.duplicate({ pomander: output.purity() });
          case 9:
            return output.duplicate({ pomander: output.fortune() });
          case 10:
            return output.duplicate({ pomander: output.witching() });
          case 11:
            return output.duplicate({ pomander: output.serenity() });
          case 12:
            return output.duplicate({ pomander: output.rage() });
          case 13:
            return output.duplicate({ pomander: output.lust() });
          case 14:
            return output.duplicate({ pomander: output.intuition() });
          case 15:
            return output.duplicate({ pomander: output.raising() });
          case 16:
            return output.duplicate({ pomander: output.resolution() });
          case 17:
            return output.duplicate({ pomander: output.frailty() });
          case 18:
            return output.duplicate({ pomander: output.concealment() });
          case 19:
            return output.duplicate({ pomander: output.petrification() });
        }
      },
      outputStrings: {
        duplicate: {
          en: '${pomander} duplicate',
          de: 'Doppelter ${pomander}',
          cn: '${pomander} 重复',
          ko: '${pomander} 중복',
        },
        // pomanders: https://xivapi.com/deepdungeonItem?pretty=true
        safety: {
          en: 'Safety',
          de: 'Siegelbruchs',
          fr: 'désamorçage',
          ja: '呪印解除',
          cn: '咒印解除',
          ko: '함정 해제',
        },
        sight: {
          en: 'Sight',
          de: 'Sicht',
          fr: 'localisation',
          ja: 'サイトロ',
          cn: '全景',
          ko: '사이트로',
        },
        strength: {
          en: 'Strength',
          de: 'Stärkung',
          fr: 'puissance',
          ja: '自己強化',
          cn: '强化自身',
          ko: '자기 강화',
        },
        steel: {
          en: 'Steel',
          de: 'Abwehr',
          fr: 'protection',
          ja: '防御強化',
          cn: '强化防御',
          ko: '방어 강화',
        },
        affluence: {
          en: 'Affluence',
          de: 'Schätze',
          fr: 'décèlement',
          ja: '宝箱増加',
          cn: '宝箱增加',
          ko: '보물상자 증가',
        },
        flight: {
          en: 'Flight',
          de: 'Feindtods',
          fr: 'sécurisation',
          ja: '敵排除',
          cn: '减少敌人',
          ko: '적 감소',
        },
        alteration: {
          en: 'Alteration',
          de: 'Feindwandlung',
          fr: 'affaiblissement',
          ja: '敵変化',
          cn: '改变敌人',
          ko: '적 대체',
        },
        purity: {
          en: 'Purity',
          de: 'Entzauberung',
          fr: 'anti-maléfice',
          ja: '解呪',
          cn: '解咒',
          ko: '저주 해제',
        },
        fortune: {
          en: 'Fortune',
          de: 'Glücks',
          fr: 'chance',
          ja: '運気上昇',
          cn: '运气上升',
          ko: '운 상승',
        },
        witching: {
          en: 'Witching',
          de: 'Wandlung',
          fr: 'mutation',
          ja: '形態変化',
          cn: '形态变化',
          ko: '적 변형',
        },
        serenity: {
          en: 'Serenity',
          de: 'Enthexung',
          fr: 'dissipation',
          ja: '魔法効果解除',
          cn: '魔法效果解除',
          ko: '마법 효과 해제',
        },
        rage: {
          en: 'Rage',
          de: 'Manticoren',
          fr: 'manticore',
          ja: 'マンティコア化',
          cn: '曼提克化',
          ko: '만티코어 변신',
        },
        lust: {
          en: 'Lust',
          de: 'Sukkuben',
          fr: 'succube',
          ja: 'サキュバス化',
          cn: '梦魔化',
          ko: '서큐버스 변신',
        },
        intuition: {
          en: 'Intuition',
          de: 'Finders',
          fr: 'intuition',
          ja: '財宝感知',
          cn: '感知宝藏',
          ko: '보물 탐지',
        },
        raising: {
          en: 'Raising',
          de: 'Lebens',
          fr: 'résurrection',
          ja: 'リレイズ',
          cn: '重生',
          ko: '리레이즈',
        },
        resolution: {
          en: 'Resolution',
          de: 'Kuribu',
          fr: 'Kuribu',
          ja: 'クリブ化',
          cn: '基路伯化',
          ko: '쿠리부 변신',
        },
        frailty: {
          en: 'Frailty',
          de: 'Feindschwächung',
          fr: 'incapacité',
          ja: '敵弱体',
          cn: '弱化敌人',
          ko: '적 약화',
        },
        concealment: {
          en: 'Concealment',
          de: 'Verschwindens',
          fr: 'invisibilité',
          ja: 'バニシュ',
          cn: '隐形',
          ko: '배니시',
        },
        petrification: {
          en: 'Petrification',
          de: 'Feindversteinerung',
          fr: 'pétrification',
          ja: '敵石化',
          cn: '石化敌人',
          ko: '적 석화',
        },
      },
    },
    {
      id: 'HoH General Magicite Duplicate',
      // duplicate item message: https://xivapi.com/LogMessage/9208?pretty=true
      // en: You return the splinter of ${magicite} magicite to the coffer. You cannot carry any more of that item.
      type: 'SystemLogMessage',
      netRegex: { id: '23F8' },
      infoText: (_data, matches, output) => {
        switch (parseInt(matches.param1, 16)) {
          case 1:
            return output.duplicate({ magicite: output.inferno() });
          case 2:
            return output.duplicate({ magicite: output.crag() });
          case 3:
            return output.duplicate({ magicite: output.vortex() });
          case 4:
            return output.duplicate({ magicite: output.elder() });
        }
      },
      outputStrings: {
        duplicate: {
          en: '${magicite} duplicate',
          de: 'Doppelter ${magicite} Stein',
          cn: '${magicite} 重复',
          ko: '${magicite} 중복',
        },
        // magicite: https://xivapi.com/DeepDungeonMagicStone?pretty=true
        inferno: {
          en: 'Inferno',
          de: 'Ifrit',
          fr: 'Ifrit',
          ja: 'イフリート',
          cn: '伊弗利特',
          ko: '이프리트',
        },
        crag: {
          en: 'Crag',
          de: 'Titan',
          fr: 'Titan',
          ja: 'タイタン',
          cn: '泰坦',
          ko: '타이탄',
        },
        vortex: {
          en: 'Vortex',
          de: 'Garuda',
          fr: 'Garuda',
          ja: 'ガルーダ',
          cn: '迦楼罗',
          ko: '가루다',
        },
        elder: {
          en: 'Elder',
          de: 'Odin',
          fr: 'Odin',
          ja: 'オーディン',
          cn: '奥丁',
          ko: '오딘',
        },
      },
    },
    // ---------------- Floor Notifications ----------------
    {
      id: 'HoH General Beacon of Passage',
      // portal to transfer between floors
      // Beacon of Passage activation message: https://xivapi.com/LogMessage/7245?pretty=true
      // en: The Beacon of Passage is activated!
      type: 'SystemLogMessage',
      netRegex: { id: '1C4D', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Beacon of Passage activated',
          de: 'Weglaterne aktiviert',
          cn: '转移灯笼已启动',
          ko: '전송 등불 활성화',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Quivering Coffer': 'zuckend(?:e|er|es|en) Schnapptruhe',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Quivering Coffer': 'coffre gigotant',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Quivering Coffer': 'うごめく宝箱',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Quivering Coffer': '抖动的宝箱',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Quivering Coffer': '꿈틀거리는 보물상자',
      },
    },
  ],
});
