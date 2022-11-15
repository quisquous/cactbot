import Conditions from '../../../../resources/conditions';
import Outputs from '../../../../resources/outputs';
import { Responses } from '../../../../resources/responses';
import ZoneId from '../../../../resources/zone_id';
import { RaidbossData } from '../../../../types/data';
import { TriggerSet } from '../../../../types/trigger';

// all Masked Carnivale Stages/Acts take place in the same zone
// there are unique Instance Content IDs for each Masked Carnivale Stage
// TODO: improve S11 A1-2 Fulmination trigger
// TODO: verify if S29 A1 Pillar of Flame 1 is always out-then-in, or can it be in-then-out
// TODO: verify if S30 A1 Rubber Bullet safe-spot is always the same

export interface Data extends RaidbossData {
  blind?: boolean;
  act2?: boolean;
}

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheMaskedCarnivale,
  triggers: [
    // ================ Stage 01 Act 1 ================
    // intentionally blank
    // ================ Stage 02 Act 1 ================
    // intentionally blank
    // ---------------- Stage 02 Act 2 ----------------
    // intentionally blank
    // ================ Stage 03 Act 1 ================
    {
      id: 'Carnivale S03 A1 Zipacna Obliterate',
      type: 'StartsUsing',
      netRegex: { id: '381D', source: 'Zipacna' },
      response: Responses.interrupt(),
    },
    // ================ Stage 04 Act 1 ================
    // intentionally blank
    // ---------------- Stage 04 Act 2 ----------------
    {
      id: 'Carnivale S04 A2 Kreios Magitek Field',
      type: 'StartsUsing',
      netRegex: { id: '3821', source: 'Kreios' },
      response: Responses.interrupt(),
    },
    // ================ Stage 05 Act 1 ================
    // intentionally blank
    // ================ Stage 06 Act 1 ================
    {
      id: 'Carnivale S06 A1-2 Blind Gain',
      // 23B = Blind (can't be hit by gaze attacks)
      type: 'GainsEffect',
      netRegex: { effectId: '23B' },
      condition: Conditions.targetIsYou(),
      preRun: (data) => data.blind = true,
    },
    {
      id: 'Carnivale S06 A1-2 Blind Lose',
      // 23B = Blind (can't be hit by gaze attacks)
      type: 'LosesEffect',
      netRegex: { effectId: '23B' },
      condition: Conditions.targetIsYou(),
      run: (data) => delete data.blind,
    },
    {
      id: 'Carnivale S06 A1-2 Arena Catoblepas Demon Eye',
      // if Blind then can't be hit by gaze attacks
      type: 'StartsUsing',
      netRegex: { id: '3963', source: 'Arena Catoblepas', capture: false },
      suppressSeconds: 1,
      infoText: (data, _matches, output) => {
        if (!data.blind)
          return output.lookAway!();
      },
      outputStrings: {
        lookAway: Outputs.lookAway,
      },
    },
    // ---------------- Stage 06 Act 2 ----------------
    {
      id: 'Carnivale S06 A2 Arena Eye Dread Gaze',
      // if Blind then can't be hit by gaze attacks
      type: 'StartsUsing',
      netRegex: { id: '3966', source: 'Arena Eye', capture: false },
      suppressSeconds: 1,
      infoText: (data, _matches, output) => {
        if (!data.blind)
          return output.lookAway!();
      },
      outputStrings: {
        lookAway: Outputs.lookAway,
      },
    },
    // ================ Stage 07 Act 1 ================
    // intentionally blank
    // ---------------- Stage 07 Act 2 ----------------
    // intentionally blank
    // ---------------- Stage 07 Act 3 ----------------
    {
      id: 'Carnivale S07 A3 Gladiatorial Node Low Voltage',
      type: 'StartsUsing',
      netRegex: { id: '3976', source: 'Gladiatorial Node' },
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 3,
      suppressSeconds: 1,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Hide Behind Barricade',
          de: 'Hinter den Barrikaden verstecken',
          fr: 'Cachez-vous derrière la barricade',
          ja: '柵の後ろに',
          cn: '躲在栅栏后',
          ko: '울타리 뒤에 숨기',
        },
      },
    },
    // ================ Stage 08 Act 1 ================
    // intentionally blank
    // ---------------- Stage 08 Act 2 ----------------
    {
      id: 'Carnivale S08 A2 Arena Progenitrix Burst',
      type: 'StartsUsing',
      netRegex: { id: '3958', source: 'Arena Progenitrix' },
      response: Responses.interrupt(),
    },
    // ================ Stage 09 Act 1 ================
    {
      id: 'Carnivale S09 A1 Guimauve Golden Tongue',
      type: 'StartsUsing',
      netRegex: { id: '37B9', source: 'Guimauve' },
      response: Responses.interrupt(),
    },
    // ================ Stage 10 Act 1 ================
    {
      id: 'Carnivale S10 A1 Crom Dubh King\'s Will',
      // if attempting The Harder They Fall achievement, do not interrupt this cast
      type: 'StartsUsing',
      netRegex: { id: '397F', source: 'Crom Dubh' },
      response: Responses.interrupt(),
    },
    {
      id: 'Carnivale S10 A1 Crom Dubh Black Nebula',
      type: 'StartsUsing',
      netRegex: { id: '3984', source: 'Crom Dubh' },
      response: Responses.interrupt(),
    },
    // ================ Stage 11 Act 1 ================
    {
      id: 'Carnivale S11 A1-2 Arena Gas Bomb Fulmination',
      // Arena Gas Bombs (x2 Act 1, x4 Act 2) channel a long cast (22.7s) which is lethal if completed
      // this cast can be interrupted (immediate re-cast) by doing any damage to them; warn when this cast is about to finish
      // TODO: this trigger is janky; trigger can overlap from multiple targets in unintended ways,
      //   and trigger still fires if target dies
      type: 'StartsUsing',
      netRegex: { id: '38F7', source: 'Arena Gas Bomb' },
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 5,
      suppressSeconds: 5,
      response: Responses.stunOrInterruptIfPossible(),
    },
    // ---------------- Stage 11 Act 2 ----------------
    // intentionally blank
    // ================ Stage 12 Act 1 ================
    // intentionally blank
    // ---------------- Stage 12 Act 2 ----------------
    {
      id: 'Carnivale S12 A2 Hydnora Inflammable Fumes',
      type: 'StartsUsing',
      netRegex: { id: '39A1', source: 'Hydnora' },
      response: Responses.stun(),
    },
    {
      id: 'Carnivale S12 A2 Hydnora Spore Sac',
      // spawns several Arena Roselets which can be killed individually
      // or can use Ice Spikes to reflect their attacks and kill them all at once
      type: 'StartsUsing',
      netRegex: { id: '39A0', source: 'Hydnora', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Arena Roselets spawning!',
          ko: '넝쿨장미 소환됨!',
        },
      },
    },
    // ================ Stage 13 Act 1 ================
    // intentionally blank
    // ---------------- Stage 13 Act 2 ----------------
    {
      id: 'Carnivale S13 A2 Carmilla Dark Sabbath',
      type: 'StartsUsing',
      netRegex: { id: '3A67', source: 'Carmilla', capture: false },
      response: Responses.lookAway(),
    },
    {
      id: 'Carnivale S13 A2 Carmilla Summon Darkness',
      // add needs to be killed before Carmilla consumes it
      // if not killed in time, Carmilla gains a Damage Up buff and kills the player
      type: 'AddedCombatant',
      netRegex: { name: 'Arena Succubus' },
      infoText: (_data, matches, output) => output.kill!({ name: matches.name }),
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
      id: 'Carnivale S13 A2 Arena Succubus Beguiling Mist',
      type: 'StartsUsing',
      netRegex: { id: '3AC5', source: 'Arena Succubus' },
      response: Responses.interrupt(),
    },
    // ================ Stage 14 Act 1 ================
    {
      id: 'Carnivale S14 A1-2 Arena Jam The Last Song',
      type: 'StartsUsing',
      netRegex: { id: '39A4', source: 'Arena Jam' },
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 3,
      suppressSeconds: 1,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Hide Behind Barricade',
          de: 'Hinter den Barrikaden verstecken',
          fr: 'Cachez-vous derrière la barricade',
          ja: '柵の後ろに',
          cn: '躲在栅栏后',
          ko: '울타리 뒤에 숨기',
        },
      },
    },
    // ---------------- Stage 14 Act 2 ----------------
    // intentionally blank
    // ================ Stage 15 Act 1 ================
    {
      id: 'Carnivale S15 A1 Bestial Node High Voltage',
      type: 'StartsUsing',
      netRegex: { id: '3A2A', source: 'Bestial Node' },
      response: Responses.interrupt(),
    },
    {
      id: 'Carnivale S15 A1 Arena Shabti Spawn',
      // Arena Shabti spawns with a Damage Up buff that makes its attacks very dangerous
      // can Sleep the Arena Shabti until the buff expires
      type: 'AddedCombatant',
      netRegex: { name: 'Arena Shabti' },
      alertText: (_data, matches, output) => output.sleep!({ name: matches.name }),
      outputStrings: {
        sleep: Outputs.sleepTarget,
      },
    },
    {
      id: 'Carnivale S15 A1 Bestial Node Superstorm',
      type: 'StartsUsing',
      netRegex: { id: '3A7B', source: 'Bestial Node', capture: false },
      response: Responses.getIn(),
    },
    {
      id: 'Carnivale S15 A1 Bestial Node Repelling Cannons',
      type: 'StartsUsing',
      netRegex: { id: '3A2C', source: 'Bestial Node', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'Carnivale S15 A1 Bestial Node Ballast',
      type: 'StartsUsing',
      netRegex: { id: '3A2D', source: 'Bestial Node', capture: false },
      response: Responses.getBehind(),
    },
    // ================ Stage 16 Act 1 ================
    // intentionally blank
    // ---------------- Stage 16 Act 2 ----------------
    {
      id: 'Carnivale S16 A2 Tikbalang 10-tonze Slash',
      type: 'StartsUsing',
      netRegex: { id: '3A17', source: 'Tikbalang', capture: false },
      response: Responses.awayFromFront(),
    },
    {
      id: 'Carnivale S16 A2 Tikbalang 111-tonze Swing',
      type: 'StartsUsing',
      netRegex: { id: '3A18', source: 'Tikbalang', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'Carnivale S16 A2 Tikbalang Cry of Rage',
      type: 'StartsUsing',
      netRegex: { id: '3A1B', source: 'Tikbalang', capture: false },
      response: Responses.lookAway(),
    },
    {
      id: 'Carnivale S16 A2 Tikbalang 1111-tonze Swing',
      // Tikbalang casts The Bull's Voice (39BB) to give himself a Damage Up (122) buff,
      // then uses Predatorial Instinct (395D) to give the player an uncleansable Heavy (F0) and draw them in,
      // then begins casting 1111-tonze Swing (395E) which is lethal if not mitigated
      type: 'StartsUsing',
      netRegex: { id: '395E', source: 'Tikbalang', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Diamondback',
          ko: '초경화',
        },
      },
    },
    {
      id: 'Carnivale S16 A2 Tikbalang Zoom In',
      type: 'StartsUsing',
      netRegex: { id: '3A19', source: 'Tikbalang', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Charge + knockback',
          ko: '돌진 + 넉백',
        },
      },
    },
    {
      id: 'Carnivale S16 A2 Tikbalang 10-tonze Wave',
      // front cleave with donut aoe
      type: 'StartsUsing',
      netRegex: { id: '3A1C', source: 'Tikbalang', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Away from front + in',
          ko: '보스 전방 피하기 + 안으로',
        },
      },
    },
    // ================ Stage 17 Act 1 ================
    // intentionally blank
    // ---------------- Stage 17 Act 2 ----------------
    {
      id: 'Carnivale S17 A2 Kreios Magitek Field',
      // same name, different id from S04 A2
      type: 'StartsUsing',
      netRegex: { id: '3AC9', source: 'Kreios' },
      response: Responses.interrupt(),
    },
    // ================ Stage 18 Act 1 ================
    {
      id: 'Carnivale S18 A1-2 Arena Manticore Wild Charge',
      // non-telegraphed charge + knockback
      type: 'StartsUsing',
      netRegex: { id: '3ACF', source: 'Arena Manticore', capture: false },
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Charge + knockback',
          ko: '돌진 + 넉백',
        },
      },
    },
    {
      id: 'Carnivale S18 A1-2 Arena Manticore Ripper Claw',
      // non-telegraphed front cleave
      type: 'StartsUsing',
      netRegex: { id: '3ACA', source: 'Arena Manticore', capture: false },
      suppressSeconds: 1,
      response: Responses.awayFromFront(),
    },
    {
      id: 'Carnivale S18 A1-2 Arena Manticore Fireball',
      // non-telegraphed ranged aoe
      type: 'StartsUsing',
      netRegex: { id: '3ACB', source: 'Arena Manticore', capture: false },
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Fireball',
          ko: '화염구',
        },
      },
    },
    // ---------------- Stage 18 Act 2 ----------------
    // intentionally blank
    // ================ Stage 19 Act 1 ================
    {
      id: 'Carnivale S19 A1-2 Reflective Rebekkah Reflect',
      // reflects all magic attacks
      type: 'StartsUsing',
      netRegex: { id: '3AE1', source: 'Reflective Rebekkah', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Magic reflect',
          ko: '마법공격 반사됨',
        },
      },
    },
    {
      id: 'Carnivale S19 A1-2 Reflective Rebekkah Offal Breath',
      type: 'StartsUsing',
      netRegex: { id: '3AE4', source: 'Reflective Rebekkah' },
      response: Responses.interrupt(),
    },
    // ---------------- Stage 19 Act 2 ----------------
    {
      id: 'Carnivale S19 A2 Reflective Rebekkah Schizocarps',
      // spawns 8x Hot Hips around the arena that do a simultaneous gaze attack
      // can either look away from all Hot Hips or Blind yourself to dodge the gazes
      type: 'StartsUsing',
      netRegex: { id: '3AE5', source: 'Reflective Rebekkah', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Blind yourself or Look Away',
          ko: '나한테 실명걸기 또는 뒤돌기',
        },
      },
    },
    // ================ Stage 20 Act 1 ================
    {
      id: 'Carnivale S20 A1,3 Typhon Snort',
      // Typhon casts Snort to knock the player back,
      // then uses 3x un-telegraphed Fireballs that do very high damage if not mitigated
      type: 'StartsUsing',
      netRegex: { id: '3970', source: 'Typhon', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Diamondback',
          ko: '초경화',
        },
      },
    },
    // ---------------- Stage 20 Act 2 ----------------
    {
      id: 'Carnivale S20 A2 Ultros Imp Song',
      type: 'StartsUsing',
      netRegex: { id: '3978', source: 'Ultros' },
      response: Responses.interrupt(),
    },
    // ---------------- Stage 20 Act 3 ----------------
    {
      id: 'Carnivale S20 A3 Ultros Imp Song',
      // same name, different id from S20 A2
      type: 'StartsUsing',
      netRegex: { id: '3998', source: 'Ultros' },
      response: Responses.interrupt(),
    },
    {
      id: 'Carnivale S20 A3 Stylish Tentacle Clearout',
      type: 'Ability',
      netRegex: { id: '399D', source: 'Stylish Tentacle', capture: false },
      response: Responses.knockback(),
    },
    // ================ Stage 21 Act 1 ================
    {
      id: 'Carnivale S21 A1-2 Arena Imp Void Blizzard',
      type: 'StartsUsing',
      netRegex: { id: '3AD7', source: 'Arena Imp' },
      response: Responses.interrupt(),
    },
    // ---------------- Stage 21 Act 2 ----------------
    {
      id: 'Carnivale S21 A2 Act Start',
      // triggers off of the first autoattack in S21 A2
      type: 'Ability',
      netRegex: { id: '1961', source: 'Apademak', capture: false },
      preRun: (data) => data.act2 = true,
      suppressSeconds: 999999,
    },
    {
      id: 'Carnivale S21 A2 Apademak The Ram\'s Voice',
      type: 'StartsUsing',
      netRegex: { id: '3AE7', source: 'Apademak', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'Carnivale S21 A2 Apademak The Dragon\'s Voice',
      type: 'StartsUsing',
      netRegex: { id: '3AE8', source: 'Apademak', capture: false },
      response: Responses.getIn(),
    },
    {
      id: 'Carnivale S21 A2 Apademak The Ram\'s Keeper',
      type: 'StartsUsing',
      netRegex: { id: '3AE9', source: 'Apademak' },
      response: Responses.interrupt(),
    },
    {
      id: 'Carnivale S21 A2 Arena Imp Spawn',
      type: 'AddedCombatant',
      netRegex: { name: 'Arena Imp', capture: false },
      infoText: (data, _matches, output) => {
        if (data.act2)
          return output.killAdds!();
      },
      outputStrings: {
        killAdds: Outputs.killAdds,
      },
    },
    // ================ Stage 22 Act 1 ================
    // intentionally blank
    // ---------------- Stage 22 Act 2 ----------------
    {
      id: 'Carnivale S22 A2 Act Start',
      // triggers off of the first autoattack in S22 A2
      type: 'Ability',
      netRegex: { id: '1963', source: 'The Forefather', capture: false },
      preRun: (data) => data.act2 = true,
      suppressSeconds: 999999,
    },
    {
      id: 'Carnivale S22 A2 The Forefather Sap',
      // aoe under the player, followed by several aoes around the room with one safe spot
      type: 'Ability',
      netRegex: { id: '3A3A', source: 'The Forefather', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get to Safe Spot',
          ko: '안전지대 찾기',
        },
      },
    },
    {
      id: 'Carnivale S22 A2 Arena Grenade Spawn',
      // Arena Grenades spawn with Sleep; if they wake up they will do lethal damage
      // Arena Grenades can be killed with a single standard (220p) attack spell
      // Arena Grenades need to be killed before the boss casts Ignition (3AC0, light roomwide attack, wakes Grenades)
      type: 'AddedCombatant',
      netRegex: { name: 'Arena Grenade' },
      alertText: (data, matches, output) => {
        if (data.act2)
          return output.kill!({ name: matches.name });
      },
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
      id: 'Carnivale S22 A2 Arena Gas Bomb Spawn',
      // The Forefather will cast Burst (3A38), a non-interruptable, lethal roomwide attack
      // Arena Gas Bombs cast Flashthoom (3A36), a small aoe which will interrupt Burst
      // Arena Gas Bombs spawn on the edge of the arena and need to be pulled in range of the boss
      type: 'AddedCombatant',
      netRegex: { name: 'Arena Gas Bomb' },
      alertText: (data, matches, output) => {
        if (data.act2)
          return output.pullToBoss!({ name: matches.name });
      },
      outputStrings: {
        pullToBoss: {
          en: 'Pull ${name} to boss',
          ko: '보스쪽으로 ${name} 끌고오기',
        },
      },
    },
    // ================ Stage 23 Act 1 ================
    {
      id: 'Carnivale S23 A1 Kronprinz Behemoth Ecliptic Meteor',
      // Ecliptic Meteor (9.7s cast) is lethal if not mitigated
      // delay slightly so Diamondback doesn't run out too fast
      type: 'StartsUsing',
      netRegex: { id: '3B99', source: 'Kronprinz Behemoth', capture: false },
      delaySeconds: 1,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Diamondback',
          ko: '초경화',
        },
      },
    },
    // ================ Stage 24 Act 1 ================
    // intentionally blank
    // ---------------- Stage 24 Act 2 ----------------
    {
      id: 'Carnivale S24 A2 Arena Scribe Silence',
      type: 'StartsUsing',
      netRegex: { id: '3BD9', source: 'Arena Scribe' },
      response: Responses.interrupt(),
    },
    {
      id: 'Carnivale S24 A2 Arena Scribe Condensed Libra',
      // 38 = Physical Vulnerability Up
      // will make next attack (Triple Hit, 3BD8) lethal
      // can cleanse the debuff or mitigate the attack
      type: 'GainsEffect',
      netRegex: { effectId: '38', source: 'Arena Scribe' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Cleanse debuff or mitigate',
          ko: '디버프 해제 또는 생존기',
        },
      },
    },
    // ---------------- Stage 24 Act 3 ----------------
    {
      id: 'Carnivale S24 A3 Epilogi Page Tear',
      type: 'StartsUsing',
      netRegex: { id: '3BDC', source: 'Epilogi', capture: false },
      response: Responses.awayFromFront(),
    },
    {
      id: 'Carnivale S24 A3 Epilogi Head Down',
      type: 'StartsUsing',
      netRegex: { id: '3BDD', source: 'Epilogi', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Knockback into Safe Spot',
          ko: '안전지대로 넉백되기',
        },
      },
    },
    {
      id: 'Carnivale S24 A3 Epilogi Bone Shaker',
      // aoe + spawns adds
      type: 'Ability',
      netRegex: { id: '3BDE', source: 'Epilogi', capture: false },
      response: Responses.killAdds(),
    },
    // ================ Stage 25 Act 1 ================
    {
      id: 'Carnivale S25 A1,3 Azulmagia Ice Spikes',
      // reflects physical damage
      type: 'StartsUsing',
      netRegex: { id: '39AA', source: 'Azulmagia', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Physical reflect',
          ko: '물리공격 반사됨',
        },
      },
    },
    {
      id: 'Carnivale S25 A1-3 Azulmagia The Ram\'s Voice',
      type: 'StartsUsing',
      netRegex: { id: '39AB', source: 'Azulmagia', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'Carnivale S25 A1-3 Azulmagia The Dragon\'s Voice',
      type: 'StartsUsing',
      netRegex: { id: '39AC', source: 'Azulmagia', capture: false },
      response: Responses.getIn(),
    },
    // ---------------- Stage 25 Act 2 ----------------
    {
      id: 'Carnivale S25 A2-3 Azulmagia Repelling Spray',
      // reflects magic damage
      type: 'StartsUsing',
      netRegex: { id: '39B0', source: 'Azulmagia', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Magic reflect',
          ko: '마법공격 반사됨',
        },
      },
    },
    {
      id: 'Carnivale S25 A2 Azulmagia Blazing Angon',
      type: 'AddedCombatant',
      netRegex: { name: 'Blazing Angon', capture: false },
      response: Responses.killAdds(),
    },
    // ---------------- Stage 25 Act 3 ----------------
    // intentionally blank
    // ================ Stage 26 Act 1 ================
    {
      id: 'Carnivale S26 A1 Arena Mirrorknight Alternate Plumage',
      // 3F = Vulnerability Down, can be dispelled
      type: 'GainsEffect',
      netRegex: { effectId: '3F', target: 'Arena Mirrorknight' },
      infoText: (_data, matches, output) => output.dispel!({ name: matches.target }),
      outputStrings: {
        dispel: {
          en: 'Dispel ${name}',
          ko: '${name} 버프 해제',
        },
      },
    },
    {
      id: 'Carnivale S26 A1 Arena Mirrorknight Caber Toss',
      type: 'StartsUsing',
      netRegex: { id: '4900', source: 'Arena Mirrorknight' },
      response: Responses.interrupt(),
    },
    // ---------------- Stage 26 Act 2 ----------------
    {
      id: 'Carnivale S26 A2 Papa Humbaba Raw Instinct',
      // 705 = Critical Strikes, can be dispelled
      type: 'GainsEffect',
      netRegex: { effectId: '705', target: 'Papa Humbaba' },
      infoText: (_data, matches, output) => output.dispel!({ name: matches.target }),
      outputStrings: {
        dispel: {
          en: 'Dispel ${name}',
          ko: '${name} 버프 해제',
        },
      },
    },
    {
      id: 'Carnivale S26 A2 Papa Humbaba Dad Joke',
      // attack has a headmarker warning but no castbar
      type: 'HeadMarker',
      netRegex: { id: '0017' },
      condition: Conditions.targetIsYou(),
      response: Responses.knockback(),
    },
    {
      id: 'Carnivale S26 A2 Papa Humbaba Void Thunder III',
      // 10F = Electrocution, can be cleansed
      type: 'GainsEffect',
      netRegex: { effectId: '10F', source: 'Papa Humbaba' },
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Cleanse debuff',
          ko: '디버프 해제',
        },
      },
    },
    // ================ Stage 27 Act 1 ================
    // intentionally blank
    // ================ Stage 28 Act 1 ================
    {
      id: 'Carnivale S28 A1 Durinn Doom Impending',
      // gives Doom (6E9) and Incurable (5D0)
      // if not healed to full before debuffs applied, player will die
      type: 'StartsUsing',
      netRegex: { id: '4A6B', source: 'Durinn', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Heal To Full',
          de: 'Vollheilen',
          fr: 'Soignez complètement',
          ja: '全員のHPを全回復',
          cn: '奶满全队',
          ko: '체력 풀피로',
        },
      },
    },
    {
      id: 'Carnivale S28 A1 Durinn March of the Draugar',
      // summons different adds each wave
      type: 'Ability',
      netRegex: { id: '4A71', source: 'Durinn', capture: false },
      response: Responses.killAdds(),
    },
    {
      id: 'Carnivale S28 A1 Durinn Cackle',
      type: 'StartsUsing',
      netRegex: { id: '4A6D', source: 'Durinn' },
      response: Responses.interrupt(),
    },
    {
      id: 'Carnivale S28 A1 Durinn Mega Death',
      // if player does not have the Death Becomes You (895) debuff when cast finishes, they will die
      type: 'StartsUsing',
      netRegex: { id: '4A6F', source: 'Durinn', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Stand in one puddle',
          de: 'In einer Fläche stehen',
          fr: 'Placez-vous dans une zone au sol',
          ja: '範囲に入る',
          cn: '站在圈里',
          ko: '장판 하나만 밟기',
        },
      },
    },
    {
      id: 'Carnivale S28 A1 Durinn Funeral Pyre',
      // all undead in this stage take increased damage from fire attacks
      // player counts as undead if they have the Death Becomes You (895) debuff
      type: 'StartsUsing',
      netRegex: { id: '4A70', source: 'Durinn', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Avoid puddles',
          ko: '장판 피하기',
        },
      },
    },
    {
      id: 'Carnivale S28 A1 Durinn Brainstorm',
      // Mindhack with ground aoes, single safe spot
      type: 'GainsEffect',
      // 7A6 = Forward March
      // 7A7 = About Face
      // 7A8 = Left Face
      // 7A9 = Right Face
      netRegex: { effectId: '7A[6-9]', source: 'Durinn' },
      condition: Conditions.targetIsYou(),
      infoText: (_data, matches, output) => {
        const effectId = matches.effectId.toUpperCase();
        if (effectId === '7A6')
          return output.forward!();
        if (effectId === '7A7')
          return output.backward!();
        if (effectId === '7A8')
          return output.left!();
        if (effectId === '7A9')
          return output.right!();
      },
      outputStrings: {
        forward: {
          en: 'March Forward into Safe Spot',
          ko: '강제 이동 앞',
        },
        backward: {
          en: 'March Backward into Safe Spot',
          ko: '강제 이동 뒤',
        },
        left: {
          en: 'March Left into Safe Spot',
          ko: '강제 이동 왼쪽',
        },
        right: {
          en: 'March Right into Safe Spot',
          ko: '강제 이동 오른쪽',
        },
      },
    },
    // ================ Stage 29 Act 1 ================
    {
      id: 'Carnivale S29 A1 Shikigami of the Pyre Fluid Swing',
      // cleave + knockback if not interrupted
      type: 'StartsUsing',
      netRegex: { id: '4901', source: 'Shikigami of the Pyre' },
      response: Responses.interrupt(),
    },
    {
      id: 'Carnivale S29 A1 Shikigami of the Pyre Sea of Flames',
      type: 'StartsUsing',
      netRegex: { id: '4905', source: 'Shikigami of the Pyre', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Bait two Eruptions',
          ko: '장판 2개 유도',
        },
      },
    },
    {
      id: 'Carnivale S29 A1 Shikigami of the Pyre Pyretic',
      // the Pyretic cast (4903) gives the Pyretic debuff (3C0)
      type: 'StartsUsing',
      netRegex: { id: '4903', source: 'Shikigami of the Pyre', capture: false },
      response: Responses.stopEverything(),
    },
    {
      id: 'Carnivale S29 A1 Pyretic Lose',
      // 3C0 = Pyretic
      // Shikigami of the Pyre casts Fire II (4904) to bait the player into moving early
      type: 'LosesEffect',
      netRegex: { effectId: '3C0', source: 'Shikigami of the Pyre' },
      condition: Conditions.targetIsYou(),
      response: Responses.moveAway(),
    },
    {
      id: 'Carnivale S29 A1 Shikigami of the Pyre Pillar of Flame 1',
      // out-then-in pattern
      // TODO: is this always out-then-in, can it ever be in-then-out?
      type: 'StartsUsing',
      netRegex: { id: '4907', source: 'Shikigami of the Pyre', capture: false },
      response: Responses.getOutThenIn(),
    },
    {
      id: 'Carnivale S29 A1 Shikigami of the Pyre Pillar of Flame 2',
      // single safe spot pattern
      type: 'StartsUsing',
      netRegex: { id: '49CE', source: 'Shikigami of the Pyre', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get to Safe Spot',
          ko: '안전지대 찾기',
        },
      },
    },
    {
      id: 'Carnivale S29 A1 Shikigami of the Pyre Flare Star',
      // proximity damage from center of the arena
      type: 'StartsUsing',
      netRegex: { id: '4909', source: 'Shikigami of the Pyre', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get to edge',
          ko: '외곽으로',
        },
      },
    },
    {
      id: 'Carnivale S29 A1 Shikigami of the Pyre Rush',
      // charge from boss that deals proximity-based damage
      type: 'StartsUsing',
      netRegex: { id: '4902', source: 'Shikigami of the Pyre', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Run Away From Boss',
          de: 'Renn weg vom Boss',
          fr: 'Courez loin du boss',
          ja: 'ボスから離れる',
          cn: '远离Boss',
          ko: '보스와 거리 벌리기',
        },
      },
    },
    // ---------------- Stage 29 Act 2 ----------------
    {
      id: 'Carnivale S29 A2 Shikigami of the Undertow Fluid Swing',
      // cleave + knockback if not interrupted
      type: 'StartsUsing',
      netRegex: { id: '4A11', source: 'Shikigami of the Undertow' },
      response: Responses.interrupt(),
    },
    {
      id: 'Carnivale S29 A2 Shikigami of the Undertow Protean Wave',
      // cone from front of boss then cone baited on player
      type: 'StartsUsing',
      netRegex: { id: '4A1B', source: 'Shikigami of the Undertow', capture: false },
      response: Responses.awayFromFront(),
    },
    {
      id: 'Carnivale S29 A2 Shikigami of the Undertow Throttle',
      // 2BC = Throttle, lethal if not cleansed
      type: 'GainsEffect',
      netRegex: { effectId: '2BC', source: 'Shikigami of the Undertow' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Cleanse debuff',
          ko: '디버프 해제',
        },
      },
    },
    {
      id: 'Carnivale S29 A2 Shikigami of the Undertow Ferrofluid',
      // 4A12 magnets with different polarity (will get pulled into boss + point-blank aoe under boss)
      // 4A13 magnets with same polarity (will get pushed away from boss + donut aoe around boss)
      type: 'StartsUsing',
      netRegex: { id: '4A1[23]', source: 'Shikigami of the Undertow' },
      infoText: (_data, matches, output) => {
        if (matches.id === '4A12')
          return output.far!();
        return output.close!();
      },
      outputStrings: {
        close: {
          en: 'Close to boss',
          de: 'Nahe am Boss',
          fr: 'Allez près du boss',
          ja: 'ボスに近づく',
          cn: '靠近boss',
          ko: '보스 가까이 붙기',
        },
        far: {
          en: 'Away from boss',
          de: 'Weg am Boss',
          fr: 'Éloignez-vous du boss',
          ja: 'ボスから離れる',
          cn: '远离boss',
          ko: '보스에게서 멀어지기',
        },
      },
    },
    {
      id: 'Carnivale S29 A2 Shikigami of the Undertow Fluid Ball',
      type: 'StartsUsing',
      netRegex: { id: '4A18', source: 'Shikigami of the Undertow', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Bait two aoes',
          ko: '장판 2개 유도',
        },
      },
    },
    {
      id: 'Carnivale S29 A2 Shikigami of the Undertow Watery Grasp Warning',
      type: 'StartsUsing',
      netRegex: { id: '4A54', source: 'Shikigami of the Undertow', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Adds soon',
          ko: '곧 쫄 나옴',
        },
      },
    },
    {
      id: 'Carnivale S29 A2 Shikigami of the Undertow Watery Grasp Adds',
      type: 'Ability',
      netRegex: { id: '4A54', source: 'Shikigami of the Undertow', capture: false },
      response: Responses.killAdds(),
    },
    {
      id: 'Carnivale S29 A2 Shikigami of the Undertow Big Splash',
      // Big Splash (7.7s cast) is lethal if not mitigated
      type: 'StartsUsing',
      netRegex: { id: '4A15', source: 'Shikigami of the Undertow', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Diamondback',
          ko: '초경화',
        },
      },
    },
    {
      id: 'Carnivale S29 A2 Shikigami of the Undertow Unwind',
      // proximity damage from 3x water tornadoes
      type: 'StartsUsing',
      netRegex: { id: '4A29', source: 'Shikigami of the Undertow', capture: false },
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Away from water tornadoes',
          ko: '물기둥에서 멀리 떨어지기',
        },
      },
    },
    // ================ Stage 30 Act 1 ================
    {
      id: 'Carnivale S30 A1,3 Siegfried Magic Drain',
      // reflects all magic attacks
      type: 'StartsUsing',
      netRegex: { id: '49CA', source: 'Siegfried', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Magic reflect',
          ko: '마법공격 반사됨',
        },
      },
    },
    {
      id: 'Carnivale S30 A1,3 Siegfried Ankle Graze',
      // 234 = Bind
      type: 'GainsEffect',
      netRegex: { effectId: '234', source: 'Siegfried' },
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Cleanse debuff',
          ko: '디버프 해제',
        },
      },
    },
    {
      id: 'Carnivale S30 A1,3 Siegfried Hyperdrive',
      type: 'Ability',
      netRegex: { id: '4994', source: 'Siegfried', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Bait three aoes',
          ko: '장판 3개 유도',
        },
      },
    },
    {
      id: 'Carnivale S30 A1 Siegfried Rubber Bullet',
      // TODO: is back-right from boss always safe?
      type: 'StartsUsing',
      netRegex: { id: '499F', source: 'Siegfried', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Knockback into Safe Spot',
          ko: '안전지대로 넉백되기',
        },
      },
    },
    // ---------------- Stage 30 Act 2 ----------------
    {
      id: 'Carnivale S30 A2-3 Siegfried Swiftsteel',
      // donut aoe with knockback
      type: 'StartsUsing',
      netRegex: { id: '499A', source: 'Siegfried', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get in + Knockback',
          ko: '안으로 + 넉백',
        },
      },
    },
    {
      id: 'Carnivale S30 A2-3 Siegfried Shattersteel',
      // single safe spot in gap between two ice blocks
      type: 'StartsUsing',
      netRegex: { id: '4A53', source: 'Siegfried', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get to Safe Spot (between two ice)',
          ko: '안전지대 찾기 (얼음 없는쪽)',
        },
      },
    },
    // ---------------- Stage 30 Act 3 ----------------
    // intentionally blank
    // ================ Stage 31 Act 1 ================
    {
      id: 'Carnivale S31 A1 Gogo, Master of Mimicry Mimic',
      // Gogo counterattacks all attacks while Mimicry (992) is active
      type: 'StartsUsing',
      netRegex: { id: '5A39', source: 'Gogo, Master of Mimicry' },
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 1,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Stop attacking',
          de: 'Angriffe stoppen',
          fr: 'Arrêtez d\'attaquer',
          ja: '攻撃禁止',
          cn: '停止攻击',
          ko: '공격 중지',
        },
      },
    },
    {
      id: 'Carnivale S31 A1 Gogo, Master of Mimicry Mimicked Sap',
      // casts 3x, second and third casts are faster
      // 5A40 = 3.2s, 5A41 = 1.2s
      type: 'Ability',
      netRegex: { id: '5A40', source: 'Gogo, Master of Mimicry', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Bait two aoes',
          ko: '장판 2개 유도',
        },
      },
    },
    {
      id: 'Carnivale S31 A1 Gogo, Master of Mimicry Mimicked Imp Song',
      type: 'StartsUsing',
      netRegex: { id: '5A4A', source: 'Gogo, Master of Mimicry' },
      response: Responses.interrupt(),
    },
    {
      id: 'Carnivale S31 A1 Gogo, Master of Mimicry Mimicked Doom Impending',
      // gives Doom (6E9) and Incurable (5D0)
      // if not healed to full before debuffs applied, player will die
      type: 'StartsUsing',
      netRegex: { id: '5A49', source: 'Gogo, Master of Mimicry', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Heal To Full',
          de: 'Vollheilen',
          fr: 'Soignez complètement',
          ja: '全員のHPを全回復',
          cn: '奶满全队',
          ko: '체력 풀피로',
        },
      },
    },
    {
      id: 'Carnivale S31 A1 Gogo, Master of Mimicry Mimicked Bunshin',
      // spawns a clone that does a double cone while Gogo does a line aoe
      type: 'StartsUsing',
      netRegex: { id: '5A43', source: 'Gogo, Master of Mimicry', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Add soon',
          ko: '분신 등장',
        },
      },
    },
    {
      id: 'Carnivale S31 A1 Gogo, Master of Mimicry Mimicked Raw Instinct',
      // 705 = Critical Strikes, can be dispelled
      type: 'GainsEffect',
      netRegex: { effectId: '705', target: 'Gogo, Master of Mimicry' },
      infoText: (_data, matches, output) => output.dispel!({ name: matches.target }),
      outputStrings: {
        dispel: {
          en: 'Dispel ${name}',
          ko: '${name} 버프 해제',
        },
      },
    },
    // ---------------- Stage 31 Act 2 ----------------
    {
      id: 'Carnivale S31 A2 Gogo, Master of Mimicry Gogo Fire III',
      // gives the Pyretic debuff (3C0)
      // followed by Gogo Blizzard III (5A4E), a point-blank aoe around the boss
      type: 'StartsUsing',
      netRegex: { id: '5A4D', source: 'Gogo, Master of Mimicry', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Away from boss => Stop Everything',
          ko: '보스와 멀리 떨어지기 => 행동 멈추기',
        },
      },
    },
    {
      id: 'Carnivale S31 A2 Gogo, Master of Mimicry Gogo Meteor',
      // Gogo Meteor is a clusterfuck of random, baited, and proximity-damage aoes
      // followed by one giant, roomwide meteor that is lethal if not mitigated
      // multiple ids: 5A50, 5A51, 5A52, 5A53, 5A54, 5A59, 5A5B
      // 5A54 is the giant, roomwide, lethal meteor at the end
      type: 'StartsUsing',
      netRegex: { id: '5A54', source: 'Gogo, Master of Mimicry' },
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) / 2,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Diamondback',
          ko: '초경화',
        },
      },
    },
    {
      id: 'Carnivale S31 A2 Gogo, Master of Mimicry Icestorm',
      // Icestorm gives two debuffs: Frostbite (10C) and Heavy (453)
      // both need to be cleansed so the following mechanics can be dodged
      type: 'GainsEffect',
      netRegex: { effectId: ['10C', '453'], source: 'Gogo, Master of Mimicry' },
      condition: Conditions.targetIsYou(),
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Cleanse both debuffs',
          ko: '디버프 둘다 해제',
        },
      },
    },
  ],
};

export default triggerSet;
