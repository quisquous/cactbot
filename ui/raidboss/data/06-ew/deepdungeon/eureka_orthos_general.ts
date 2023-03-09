import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// Triggers applicable to all Eureka Orthos floors.
// TODO: Dread Beasts triggers

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: [
    ZoneId.EurekaOrthosFloors1_10,
    ZoneId.EurekaOrthosFloors11_20,
    ZoneId.EurekaOrthosFloors21_30,
    ZoneId.EurekaOrthosFloors31_40,
    ZoneId.EurekaOrthosFloors41_50,
    ZoneId.EurekaOrthosFloors51_60,
    ZoneId.EurekaOrthosFloors61_70,
    ZoneId.EurekaOrthosFloors71_80,
    ZoneId.EurekaOrthosFloors81_90,
    ZoneId.EurekaOrthosFloors91_100,
  ],
  zoneLabel: {
    en: 'Eureka Orthos (All Floors)',
  },

  triggers: [
    // ---------------- Mimics ----------------
    {
      id: 'EO General Mimic Spawn',
      // 2566 = Mimic (appears to be same npcNameId all floors)
      // floor 1-30 bronze chests, can stun or interrupt
      // floor 31-60 silver chests, can stun or interrupt
      // floor 61+ gold chests, can interrupt, immune to stun
      // TODO: some Mimics may spawn after transference between floors and get called early before being found
      type: 'AddedCombatant',
      netRegex: { npcNameId: '2566', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Mimic spawned!',
          de: 'Mimik ist erschienen!',
          cn: '已生成 拟态怪!',
          ko: '미믹 등장!',
        },
      },
    },
    {
      id: 'EO General Mimic Infatuation',
      // inflicts Accursed Pox (43F) if not interrupted
      type: 'StartsUsing',
      netRegex: { id: '801E', source: 'Mimic' },
      response: Responses.interruptIfPossible(),
    },
    // ---------------- Protomanders and Demiclones ----------------
    {
      id: 'EO General Protomander Duplicate',
      // duplicate item message: https://xivapi.com/LogMessage/7222?pretty=true
      // en: You return the protomander of ${protomander} to the coffer. You cannot carry any more of that item.
      type: 'SystemLogMessage',
      netRegex: { id: '1C36' },
      infoText: (_data, matches, output) => {
        switch (parseInt(matches.param1, 16)) {
          case 20:
            return output.duplicate!({ protomander: output.lethargy!() });
          case 21:
            return output.duplicate!({ protomander: output.storms!() });
          case 22:
            return output.duplicate!({ protomander: output.dread!() });
          case 23:
            return output.duplicate!({ protomander: output.safety!() });
          case 24:
            return output.duplicate!({ protomander: output.sight!() });
          case 25:
            return output.duplicate!({ protomander: output.strength!() });
          case 26:
            return output.duplicate!({ protomander: output.steel!() });
          case 27:
            return output.duplicate!({ protomander: output.affluence!() });
          case 28:
            return output.duplicate!({ protomander: output.flight!() });
          case 29:
            return output.duplicate!({ protomander: output.alteration!() });
          case 30:
            return output.duplicate!({ protomander: output.purity!() });
          case 31:
            return output.duplicate!({ protomander: output.fortune!() });
          case 32:
            return output.duplicate!({ protomander: output.witching!() });
          case 33:
            return output.duplicate!({ protomander: output.serenity!() });
          case 34:
            return output.duplicate!({ protomander: output.intuition!() });
          case 35:
            return output.duplicate!({ protomander: output.raising!() });
        }
      },
      outputStrings: {
        duplicate: {
          en: '${protomander} duplicate',
          de: 'Doppelter ${protomander}',
          cn: '${protomander} 重复',
          ko: '${protomander} 중복',
        },
        // protomanders: https://xivapi.com/deepdungeonItem?pretty=true
        lethargy: {
          en: 'Lethargy',
        },
        storms: {
          en: 'Storms',
        },
        dread: {
          en: 'Dread',
        },
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
      },
    },
    {
      id: 'EO General Demiclone Duplicate',
      // duplicate item message: https://xivapi.com/LogMessage/10287?pretty=true
      // en: You return the ${demiclone} demiclone to the coffer. You cannot carry any more of that item.
      type: 'SystemLogMessage',
      netRegex: { id: '282F' },
      infoText: (_data, matches, output) => {
        switch (parseInt(matches.param1, 16)) {
          case 1:
            return output.duplicate!({ demiclone: output.unei!() });
          case 2:
            return output.duplicate!({ demiclone: output.doga!() });
          case 3:
            return output.duplicate!({ demiclone: output.onion!() });
        }
      },
      outputStrings: {
        duplicate: {
          en: '${demiclone} duplicate',
          de: 'Doppelter ${demiclone} Stein',
          cn: '${demiclone} 重复',
          ko: '${demiclone} 중복',
        },
        // demiclones: https://xivapi.com/DeepDungeonDemiclone?pretty=true
        unei: {
          en: 'Unei',
        },
        doga: {
          en: 'Doga',
        },
        onion: {
          en: 'Onion Knight',
        },
      },
    },
    // ---------------- Floor Notifications ----------------
    {
      id: 'EO General Pylon of Passage',
      // portal to transfer between floors
      // Pylon of Passage activation message: https://xivapi.com/LogMessage/7245?pretty=true
      // en: The Pylon of Passage is activated!
      type: 'SystemLogMessage',
      netRegex: { id: '1C4D', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Pylon of Passage activated',
        },
      },
    },
    // ---------------- Dread Beasts ----------------
    {
      id: 'EO General Dread Beast Spawn',
      // 12322 Lamia Queen
      // 12323 Meracydian Clone
      // 12324 Demi-Cochma
      type: 'AddedCombatant',
      netRegex: { npcNameId: '1232[234]', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Dread Beast spawned!',
        },
      },
    },
    {
      id: 'EO General Lamia Queen Petrifaction',
      // gaze, inflicts Stone Curse (1B5)
      type: 'StartsUsing',
      netRegex: { id: '7FD1', source: 'Lamia Queen', capture: false },
      response: Responses.lookAway('alert'),
    },
  ],
};

export default triggerSet;
