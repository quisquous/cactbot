import Outputs from '../../../../../resources/outputs';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// Palace of the Dead Floors 181-190

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.ThePalaceOfTheDeadFloors181_190,

  triggers: [
    // ---------------- Floor 181-189 Mobs ----------------
    {
      id: 'PotD 181-190 Deep Palace Garm Ram\'s Voice',
      // untelegraphed PBAoE
      type: 'StartsUsing',
      netRegex: { id: '1BA6', source: 'Deep Palace Garm' },
      alertText: (data, matches, output) => {
        if (data.CanSilence())
          return output.interruptOrOut!({ name: matches.source });
        return output.out!();
      },
      outputStrings: {
        out: Outputs.out,
        interruptOrOut: {
          en: 'interrupt ${name} or Out',
          de: 'Unterbreche ${name} oder Raus',
          cn: '打断 ${name} 或远离',
          ko: '${name} 시전 끊거나 밖으로',
        },
      },
    },
    {
      id: 'PotD 181-190 Deep Palace Garm Dragon\'s Voice',
      // untelegraphed donut AoE
      type: 'StartsUsing',
      netRegex: { id: '1BA7', source: 'Deep Palace Garm' },
      alertText: (data, matches, output) => {
        if (data.CanSilence())
          return output.interruptOrUnder!({ name: matches.source });
        return output.getUnder!();
      },
      outputStrings: {
        getUnder: Outputs.getUnder,
        interruptOrUnder: {
          en: 'interrupt ${name} or Get Under',
          de: 'Unterbreche ${name} oder geh Unter ihn',
          cn: '打断 ${name} 或去脚下',
          ko: '${name} 시전 끊거나 아래로',
        },
      },
    },
    // ---------------- Floor 190 Boss: The Godfather ----------------
    {
      id: 'PotD 181-190 Remedy Bomb Spawn',
      // 4579 = Remedy Bomb
      // kill before Hypothermal Combustion (1C03) finishes casting
      type: 'AddedCombatant',
      netRegex: { npcNameId: '4579' },
      alertText: (_data, matches, output) => output.kill!({ name: matches.name }),
      outputStrings: {
        kill: {
          en: 'Kill ${name}',
          de: 'Besiege ${name}',
          fr: 'Tuez ${name}',
          ja: '${name}を倒す',
          cn: '击杀 ${name}',
          ko: '${name} 처치',
        },
      },
    },
    {
      id: 'PotD 181-190 Lava Bomb Spawn',
      // 4580 = Lava Bomb
      // The Godfather casts Massive Burst (1BBF), a non-interruptable, 99% HP roomwide attack
      // Lava Bomb casts Flashthoom (1C02), a small PBAoE which will interrupt Massive Burst
      // attack Lava Bomb to push it into The Godfather
      type: 'AddedCombatant',
      netRegex: { npcNameId: '4580' },
      alertText: (_data, matches, output) => output.pushToBoss!({ name: matches.name }),
      outputStrings: {
        pushToBoss: {
          en: 'Push ${name} into boss',
          de: 'Stoß ${name} in den Boss',
          cn: '将 ${name} 推至BOSS',
          ko: '보스쪽으로 ${name} 밀기',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Deep Palace Garm': 'Katakomben-Garm',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Deep Palace Garm': 'garm des profondeurs',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Deep Palace Garm': 'ディープパレス・ガルム',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Deep Palace Garm': '深宫加姆',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Deep Palace Garm': '깊은 궁전 가름',
      },
    },
  ],
};

export default triggerSet;
