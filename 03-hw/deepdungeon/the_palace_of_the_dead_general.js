Options.Triggers.push({
  id: 'ThePalaceOfTheDeadGeneral',
  zoneId: [
    ZoneId.ThePalaceOfTheDeadFloors1_10,
    ZoneId.ThePalaceOfTheDeadFloors11_20,
    ZoneId.ThePalaceOfTheDeadFloors21_30,
    ZoneId.ThePalaceOfTheDeadFloors31_40,
    ZoneId.ThePalaceOfTheDeadFloors41_50,
    ZoneId.ThePalaceOfTheDeadFloors51_60,
    ZoneId.ThePalaceOfTheDeadFloors61_70,
    ZoneId.ThePalaceOfTheDeadFloors71_80,
    ZoneId.ThePalaceOfTheDeadFloors81_90,
    ZoneId.ThePalaceOfTheDeadFloors91_100,
    ZoneId.ThePalaceOfTheDeadFloors101_110,
    ZoneId.ThePalaceOfTheDeadFloors111_120,
    ZoneId.ThePalaceOfTheDeadFloors121_130,
    ZoneId.ThePalaceOfTheDeadFloors131_140,
    ZoneId.ThePalaceOfTheDeadFloors141_150,
    ZoneId.ThePalaceOfTheDeadFloors151_160,
    ZoneId.ThePalaceOfTheDeadFloors161_170,
    ZoneId.ThePalaceOfTheDeadFloors171_180,
    ZoneId.ThePalaceOfTheDeadFloors181_190,
    ZoneId.ThePalaceOfTheDeadFloors191_200,
  ],
  zoneLabel: {
    en: 'The Palace of the Dead (All Floors)',
    de: 'Palast der Toten (Alle Ebenen)',
    fr: 'Le palais des morts (Tous les étages)',
    cn: '死者宫殿 (全楼层)',
    ko: '망자의 궁전 (전체 층)',
  },
  triggers: [
    // ---------------- Mimics ----------------
    {
      id: 'PotD General Mimic Spawn',
      // 2566 = Mimic (appears to be same npcNameId all floors)
      // floor 1-30 bronze chests, can stun or interrupt
      // floor 31-40 silver chests, can stun or interrupt
      // floor 41+ gold chests, can interrupt, immune to stun
      // TODO: some Mimics may spawn after transference between floors and get called early before being found
      type: 'AddedCombatant',
      netRegex: { npcNameId: '2566', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Mimic spawned!',
          de: 'Mimik ist erschienen!',
          fr: 'Un mime est apparu !',
          cn: '已生成 拟态怪!',
          ko: '미믹 등장!',
        },
      },
    },
    {
      id: 'PotD General Mimic Infatuation',
      // inflicts Accursed Pox (43F) if not interrupted
      type: 'StartsUsing',
      netRegex: { id: '18FD', source: 'Mimic' },
      response: Responses.interruptIfPossible(),
    },
    // ---------------- Pomanders ----------------
    {
      id: 'PotD General Pomander Duplicate',
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
          fr: '${pomander} dupliqué',
          cn: '${pomander} 重复',
          ko: '${pomander} 중복',
        },
        // pomanders: https://xivapi.com/deepdungeonItem?pretty=true
        safety: {
          en: 'Safety',
          de: 'Siegelbruchs',
          fr: 'Désamorçage',
          ja: '呪印解除',
          cn: '咒印解除',
          ko: '함정 해제',
        },
        sight: {
          en: 'Sight',
          de: 'Sicht',
          fr: 'Localisation',
          ja: 'サイトロ',
          cn: '全景',
          ko: '사이트로',
        },
        strength: {
          en: 'Strength',
          de: 'Stärkung',
          fr: 'Puissance',
          ja: '自己強化',
          cn: '强化自身',
          ko: '자기 강화',
        },
        steel: {
          en: 'Steel',
          de: 'Abwehr',
          fr: 'Protection',
          ja: '防御強化',
          cn: '强化防御',
          ko: '방어 강화',
        },
        affluence: {
          en: 'Affluence',
          de: 'Schätze',
          fr: 'Décèlement',
          ja: '宝箱増加',
          cn: '宝箱增加',
          ko: '보물상자 증가',
        },
        flight: {
          en: 'Flight',
          de: 'Feindtods',
          fr: 'Sécurisation',
          ja: '敵排除',
          cn: '减少敌人',
          ko: '적 감소',
        },
        alteration: {
          en: 'Alteration',
          de: 'Feindwandlung',
          fr: 'Affaiblissement',
          ja: '敵変化',
          cn: '改变敌人',
          ko: '적 대체',
        },
        purity: {
          en: 'Purity',
          de: 'Entzauberung',
          fr: 'Anti-maléfice',
          ja: '解呪',
          cn: '解咒',
          ko: '저주 해제',
        },
        fortune: {
          en: 'Fortune',
          de: 'Glücks',
          fr: 'Chance',
          ja: '運気上昇',
          cn: '运气上升',
          ko: '운 상승',
        },
        witching: {
          en: 'Witching',
          de: 'Wandlung',
          fr: 'Mutation',
          ja: '形態変化',
          cn: '形态变化',
          ko: '적 변형',
        },
        serenity: {
          en: 'Serenity',
          de: 'Enthexung',
          fr: 'Dissipation',
          ja: '魔法効果解除',
          cn: '魔法效果解除',
          ko: '마법 효과 해제',
        },
        rage: {
          en: 'Rage',
          de: 'Manticoren',
          fr: 'Manticore',
          ja: 'マンティコア化',
          cn: '曼提克化',
          ko: '만티코어 변신',
        },
        lust: {
          en: 'Lust',
          de: 'Sukkuben',
          fr: 'Succube',
          ja: 'サキュバス化',
          cn: '梦魔化',
          ko: '서큐버스 변신',
        },
        intuition: {
          en: 'Intuition',
          de: 'Finders',
          fr: 'Intuition',
          ja: '財宝感知',
          cn: '感知宝藏',
          ko: '보물 탐지',
        },
        raising: {
          en: 'Raising',
          de: 'Lebens',
          fr: 'Résurrection',
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
          fr: 'Incapacité',
          ja: '敵弱体',
          cn: '弱化敌人',
          ko: '적 약화',
        },
        concealment: {
          en: 'Concealment',
          de: 'Verschwindens',
          fr: 'Invisibilité',
          ja: 'バニシュ',
          cn: '隐形',
          ko: '배니시',
        },
        petrification: {
          en: 'Petrification',
          de: 'Feindversteinerung',
          fr: 'Pétrification',
          ja: '敵石化',
          cn: '石化敌人',
          ko: '적 석화',
        },
      },
    },
    // ---------------- Floor Notifications ----------------
    {
      id: 'PotD General Cairn of Passage',
      // portal to transfer between floors
      // Cairn of Passage activation message: https://xivapi.com/LogMessage/7245?pretty=true
      // en: The Cairn of Passage is activated!
      type: 'SystemLogMessage',
      netRegex: { id: '1C4D', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Cairn of Passage activated',
          de: 'Wegleuchte aktiviert',
          fr: 'La pierre de téléportation s\'est activée',
          cn: '转移石冢已启动',
          ko: '전송 석탑 활성화',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Mimic': 'Nachahmung',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Mimic': 'Mime',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Mimic': 'ものまね',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Mimic': '模仿',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Mimic': '흉내',
      },
    },
  ],
});
