Options.Triggers.push({
  id: 'EurekaOrthosFloors71_80',
  zoneId: ZoneId.EurekaOrthosFloors71_80,
  triggers: [
    // ---------------- Floor 71-79 Mobs ----------------
    {
      id: 'EO 71-80 Orthos Toco Toco Slowcall',
      type: 'StartsUsing',
      netRegex: { id: '7F7B', source: 'Orthos Toco Toco', capture: false },
      response: Responses.awayFromFront(),
    },
    {
      id: 'EO 71-80 Orthos Primelephas Rear',
      type: 'StartsUsing',
      netRegex: { id: '81A8', source: 'Orthos Primelephas', capture: false },
      response: Responses.outOfMelee('alert'),
    },
    {
      id: 'EO 71-80 Orthos Coeurl Wide Blaster',
      type: 'StartsUsing',
      netRegex: { id: '81A6', source: 'Orthos Coeurl', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'EO 71-80 Orthos Coeurl Tail Swing',
      type: 'StartsUsing',
      netRegex: { id: '7F87', source: 'Orthos Coeurl', capture: false },
      response: Responses.goFrontOrSides(),
    },
    {
      id: 'EO 71-80 Orthos Thunderbeast Scythe Tail',
      type: 'StartsUsing',
      netRegex: { id: '7F90', source: 'Orthos Thunderbeast', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'EO 71-80 Orthos Thunderbeast Spark',
      type: 'StartsUsing',
      netRegex: { id: '7F94', source: 'Orthos Thunderbeast', capture: false },
      response: Responses.getIn(),
    },
    {
      id: 'EO 71-80 Orthos Gulo Gulo the Killing Paw',
      type: 'StartsUsing',
      netRegex: { id: '81A9', source: 'Orthos Gulo Gulo', capture: false },
      durationSeconds: 5,
      alertText: (_data, _matches, output) => output.getBehind(),
      outputStrings: {
        getBehind: {
          // Telegraphed Killing Paw swipe (81A9) followed by untelegraphed Savage Swipe (7F8E).
          en: 'Get Behind (Stay Behind)',
          de: 'Geh nach hinten (und bleib hinten)',
          cn: '去背后 (待在背后)',
          ko: '뒤로 이동 (뒤에 머물기)',
        },
      },
    },
    {
      id: 'EO 71-80 Orthos Skatene Chirp',
      // untelegraphed PBAoE sleep; follow-up lethal PBAoE
      type: 'StartsUsing',
      netRegex: { id: '7F7D', source: 'Orthos Skatene', capture: false },
      response: Responses.outOfMelee('alert'),
    },
    {
      id: 'EO 71-80 Orthos Flamebeast Blistering Roar',
      // lethal, large, wide line AoE that goes through walls
      type: 'StartsUsing',
      netRegex: { id: '81AF', source: 'Orthos Flamebeast', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'EO 71-80 Bird of Orthos Eye of the Fierce',
      // gaze, inflicts Confused (0B) if hit; follows up with lethal AoE on Confused target
      type: 'StartsUsing',
      netRegex: { id: '7F9B', source: 'Bird of Orthos', capture: false },
      response: Responses.lookAway('alert'),
    },
    {
      id: 'EO 71-80 Bird of Orthos Revelation',
      // lethal AoE, cast on any targets Confused by Eye of the Fierce
      type: 'StartsUsing',
      netRegex: { id: '7F9A', source: 'Bird of Orthos' },
      response: Responses.awayFrom(),
    },
    {
      id: 'EO 71-80 Orthos Kargas Winds of Winter',
      // lethal large AoE; can stun or break line-of-sight to avoid
      type: 'StartsUsing',
      netRegex: { id: '81AA', source: 'Orthos Kargas' },
      alertText: (data, matches, output) => {
        if (data.CanStun())
          return output.stunOrBreakLOS({ name: matches.source });
        return output.breakLOS({ name: matches.source });
      },
      outputStrings: {
        stunOrBreakLOS: {
          en: 'Stun or Break line-of-sight to ${name}',
          de: 'Unterbrechen oder unterbreche die Sichtlinie zu ${name}',
          ja: 'スタンまたは視線から隠れる: ${name}',
          cn: '眩晕或利用掩体卡 ${name} 的视线',
          ko: '기절 또는 ${name}의 시야 밖으로 숨기',
        },
        breakLOS: {
          en: 'Break line-of-sight to ${name}',
          de: 'Unterbreche Sichtlinie zu ${name}',
          ja: '${name}の視線から隠れる',
          cn: '利用掩体卡 ${name} 的视线',
          ko: '${name}의 시야 밖으로 숨기',
        },
      },
    },
    {
      id: 'EO 71-80 Orthos Sasquatch Ripe Banana',
      type: 'StartsUsing',
      // Sasquatch casts Ripe Banana (81AB) for 2s, then ~3s later casts Chest Thump (7FA8) for 0.1s.
      // These can be hard to spot, so this gives a ~5s warning to hide even if you can't see it.
      netRegex: { id: '81AB', source: 'Orthos Sasquatch' },
      alertText: (_data, matches, output) => output.breakLOS({ name: matches.source }),
      outputStrings: {
        breakLOS: {
          en: 'Break line-of-sight to ${name}',
          de: 'Unterbreche Sichtlinie zu ${name}',
          ja: '${name}の視線から隠れる',
          cn: '利用掩体卡 ${name} 的视线',
          ko: '${name}의 시야 밖으로 숨기',
        },
      },
    },
    // ---------------- Floor 80 Boss: Proto-Kaliya ----------------
    {
      id: 'EO 71-80 Proto-Kaliya Resonance',
      type: 'StartsUsing',
      netRegex: { id: '7ABE', source: 'Proto-Kaliya' },
      response: Responses.tankCleave(),
    },
    {
      id: 'EO 71-80 Proto-Kaliya Centralized Nerve Gas',
      type: 'StartsUsing',
      netRegex: { id: '7ABF', source: 'Proto-Kaliya', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'EO 71-80 Proto-Kaliya Leftward Nerve Gas',
      // 180° cleave from front-left to back-right
      type: 'StartsUsing',
      netRegex: { id: '7AC0', source: 'Proto-Kaliya', capture: false },
      response: Responses.goRight(),
    },
    {
      id: 'EO 71-80 Proto-Kaliya Rightward Nerve Gas',
      // 180° cleave from front-right to back-left
      type: 'StartsUsing',
      netRegex: { id: '7AC1', source: 'Proto-Kaliya', capture: false },
      response: Responses.goLeft(),
    },
    {
      id: 'EO 71-80 Proto-Kaliya Nerve Gas Ring Cleanup',
      type: 'StartsUsing',
      netRegex: { id: '7AC5', source: 'Proto-Kaliya', capture: false },
      run: (data) => {
        delete data.charge;
        delete data.droneCharges;
        delete data.pushPull;
      },
    },
    {
      id: 'EO 71-80 Proto-Kaliya Nanospore Jet Player Charge Collect',
      // D5A = Positive Charge
      // D5B = Negative Charge
      type: 'GainsEffect',
      netRegex: { effectId: 'D5[AB]' },
      condition: Conditions.targetIsYou(),
      run: (data, matches) => {
        data.charge = matches.effectId.toUpperCase() === 'D5A';
      },
    },
    {
      id: 'EO 71-80 Proto-Kaliya Nanospore Jet Drone Charge Collect',
      // D58 = Positive Charge
      // D59 = Negative Charge
      type: 'GainsEffect',
      netRegex: { effectId: 'D5[89]', target: 'Weapons Drone' },
      run: (data, matches) => {
        data.droneCharges ??= {};
        data.droneCharges[parseInt(matches.targetId, 16)] =
          matches.effectId.toUpperCase() === 'D58';
      },
    },
    {
      id: 'EO 71-80 Proto-Kaliya Nanospore Jet Tether Collect',
      type: 'Tether',
      netRegex: { id: '0026', source: 'Weapons Drone' },
      condition: Conditions.targetIsYou(),
      run: (data, matches) => {
        if (data.charge === undefined) {
          console.error(`Proto-Kaliya Nanospore Jet: missing player charge`);
          return;
        }
        if (!data.droneCharges) {
          console.error(`Proto-Kaliya Nanospore Jet: missing drone charges`);
          return;
        }
        data.pushPull = data.charge === data.droneCharges[parseInt(matches.sourceId, 16)];
      },
    },
    {
      id: 'EO 71-80 Proto-Kaliya Nerve Gas Ring',
      type: 'StartsUsing',
      netRegex: { id: '7AC2', source: 'Proto-Kaliya', capture: false },
      alertText: (data, _matches, output) => {
        if (data.pushPull === undefined) {
          console.error(`Proto-Kaliya Nerve Gas Ring: missing pushPull`);
          return;
        }
        if (data.pushPull)
          return output.push();
        return output.pull();
      },
      outputStrings: {
        push: {
          en: 'Get pushed into safe spot',
          de: 'Rückstoß in den sicheren Bereich',
          ja: '安置へノックバック',
          cn: '被击退到安全区',
          ko: '안전지대로 밀려나기',
        },
        pull: {
          en: 'Get pulled into safe spot',
          de: 'Werde in den sicheren Bereich gezogen',
          ja: '安置へ引っ張られる',
          cn: '被吸引到安全区',
          ko: '안전지대로 당겨지기',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Bird of Orthos': 'Orthos-Vogel',
        'Orthos Coeurl': 'Orthos-Coeurl',
        'Orthos Flamebeast': 'Orthos-Flammenbestie',
        'Orthos Gulo Gulo': 'Orthos-Gulo Gulo',
        'Orthos Kargas': 'Orthos-Kargas',
        'Orthos Primelephas': 'Orthos-Primelephas',
        'Orthos Sasquatch': 'Orthos-Sasquatch',
        'Orthos Skatene': 'Orthos-Skatene',
        'Orthos Thunderbeast': 'Orthos-Donnerbestie',
        'Orthos Toco Toco': 'Orthos-Tokotoko',
        'Proto-Kaliya': 'Proto-Kaliya',
        'Weapons Drone': 'Artilleriedrohne',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Bird of Orthos': 'oiseau d\'Eurêka Orthos',
        'Orthos Coeurl': 'coeurl Orthos',
        'Orthos Flamebeast': 'bête de feu Orthos',
        'Orthos Gulo Gulo': 'gulo gulo Orthos',
        'Orthos Kargas': 'kargas Orthos',
        'Orthos Primelephas': 'primelephas Orthos',
        'Orthos Sasquatch': 'sasquatch Orthos',
        'Orthos Skatene': 'skate\'ne Orthos',
        'Orthos Thunderbeast': 'bête de foudre Orthos',
        'Orthos Toco Toco': 'toco toco Orthos',
        'Proto-Kaliya': 'proto-Kaliya',
        'Weapons Drone': 'drone armé',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Bird of Orthos': 'バード・オブ・オルト',
        'Orthos Coeurl': 'オルト・クァール',
        'Orthos Flamebeast': 'オルト・フレイムビースト',
        'Orthos Gulo Gulo': 'オルト・グログロ',
        'Orthos Kargas': 'オルト・カルガス',
        'Orthos Primelephas': 'オルト・プリメレファス',
        'Orthos Sasquatch': 'オルト・サスカッチ',
        'Orthos Skatene': 'オルト・スカネテ',
        'Orthos Thunderbeast': 'オルト・サンダービースト',
        'Orthos Toco Toco': 'オルト・トコトコ',
        'Proto-Kaliya': 'プロトカーリア',
        'Weapons Drone': '砲撃ドローン',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Bird of Orthos': '正统妖鸟',
        'Orthos Coeurl': '正统长须豹',
        'Orthos Flamebeast': '正统焰兽',
        'Orthos Gulo Gulo': '正统狼獾',
        'Orthos Kargas': '正统卡尔加斯',
        'Orthos Primelephas': '正统曙象',
        'Orthos Sasquatch': '正统大脚巨猿',
        'Orthos Skatene': '正统斯卡尼特',
        'Orthos Thunderbeast': '正统雷兽',
        'Orthos Toco Toco': '正统巨嘴鸟',
        'Proto-Kaliya': '原型卡利亚',
        'Weapons Drone': '炮击无人机',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Bird of Orthos': '오르토스 새',
        'Orthos Coeurl': '오르토스 커얼',
        'Orthos Flamebeast': '오르토스 불꽃 야수',
        'Orthos Gulo Gulo': '오르토스 굴로굴로',
        'Orthos Kargas': '오르토스 카르가스',
        'Orthos Primelephas': '오르토스 프리멜레파스',
        'Orthos Sasquatch': '오르토스 사스콰치',
        'Orthos Skatene': '오르토스 스카네테',
        'Orthos Thunderbeast': '오르토스 번개 야수',
        'Orthos Toco Toco': '오르토스 총총새',
        'Proto-Kaliya': '프로토 칼리야',
        'Weapons Drone': '무인 포격기',
      },
    },
  ],
});
