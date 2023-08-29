Options.Triggers.push({
  id: 'EurekaOrthosFloors91_100',
  zoneId: ZoneId.EurekaOrthosFloors91_100,
  triggers: [
    // ---------------- Floor 91-98 Mobs ----------------
    {
      id: 'EO 91-100 Orthos Mining Drone Aetherochemical Cannon',
      type: 'StartsUsing',
      netRegex: { id: '81B0', source: 'Orthos Mining Drone', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'EO 91-100 Orthosystem γ High Voltage',
      type: 'StartsUsing',
      netRegex: { id: '806E', source: 'Orthosystem γ' },
      alertText: (data, matches, output) => {
        if (data.CanSilence())
          return output.interruptOrOut({ name: matches.source });
        return output.out();
      },
      outputStrings: {
        out: Outputs.out,
        interruptOrOut: {
          en: 'Out or interrupt ${name}',
          de: 'Raus oder unterbreche ${name}',
          ja: '沈黙: ${name}',
          cn: '出去或打断 ${name}',
          ko: '밖으로 또는 ${name} 시전 끊기',
        },
      },
    },
    {
      id: 'EO 91-100 Orthosystem γ Repelling Cannons',
      type: 'StartsUsing',
      netRegex: { id: '806D', source: 'Orthosystem γ', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'EO 91-100 Orthosystem γ Ring Cannon',
      type: 'StartsUsing',
      netRegex: { id: '806C', source: 'Orthosystem γ', capture: false },
      response: Responses.getIn(),
    },
    {
      id: 'EO 91-100 Orthosystem α Aetherochemical Laser α',
      type: 'StartsUsing',
      netRegex: { id: '8074', source: 'Orthosystem α', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'EO 91-100 Orthodrone Self-detonate',
      // explodes in lethal PBAoE after death
      type: 'StartsUsing',
      netRegex: { id: '806A', source: 'Orthodrone', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'EO 91-100 Orthos Motherbit Citadel Buster',
      type: 'StartsUsing',
      netRegex: { id: '8084', source: 'Orthos Motherbit', capture: false },
      response: Responses.awayFromFront(),
    },
    {
      id: 'EO 91-100 Servomechanical Orthotaur 32-tonze Swipe',
      type: 'StartsUsing',
      netRegex: { id: '8099', source: 'Servomechanical Orthotaur', capture: false },
      response: Responses.awayFromFront(),
    },
    {
      id: 'EO 91-100 Servomechanical Orthotaur 128-tonze Swing',
      type: 'StartsUsing',
      netRegex: { id: '809A', source: 'Servomechanical Orthotaur', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'EO 91-100 Servomechanical Orthochimera Engulfing Ice',
      // AoE cleave to front and right
      type: 'StartsUsing',
      netRegex: { id: '808A', source: 'Servomechanical Orthochimera', capture: false },
      response: Responses.goLeft(),
    },
    {
      id: 'EO 91-100 Servomechanical Orthochimera The Dragon\'s Breath',
      // AoE cleave to front and left
      type: 'StartsUsing',
      netRegex: { id: '808B', source: 'Servomechanical Orthochimera', capture: false },
      response: Responses.goRight(),
    },
    {
      id: 'EO 91-100 Servomechanical Orthochimera the Scorpion\'s Sting',
      // AoE cleave behind
      type: 'StartsUsing',
      netRegex: { id: '808C', source: 'Servomechanical Orthochimera', capture: false },
      response: Responses.goFront(),
    },
    {
      id: 'EO 91-100 Servomechanical Orthochimera the Ram\'s Voice',
      type: 'StartsUsing',
      netRegex: { id: '808D', source: 'Servomechanical Orthochimera', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'EO 91-100 Servomechanical Orthochimera the Dragon\'s Voice',
      type: 'StartsUsing',
      netRegex: { id: '808E', source: 'Servomechanical Orthochimera', capture: false },
      response: Responses.getUnder('alert'),
    },
    {
      id: 'EO 91-100 Orthos Mithridates Laserblade',
      // 270° front cleave
      type: 'StartsUsing',
      netRegex: { id: '8070', source: 'Orthos Mithridates', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'EO 91-100 Orthos Sphinx Naked Soul',
      type: 'StartsUsing',
      netRegex: { id: '8093', source: 'Orthos Sphinx', capture: false },
      response: Responses.lookAway('alert'),
    },
    {
      id: 'EO 91-100 Orthos Sphinx Swinge',
      type: 'StartsUsing',
      netRegex: { id: '8091', source: 'Orthos Sphinx', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'EO 91-100 Orthonaught Rotoswipe',
      type: 'StartsUsing',
      netRegex: { id: '807D', source: 'Orthonaught', capture: false },
      response: Responses.awayFromFront(),
    },
    {
      id: 'EO 91-100 Orthos Zaghnal Pounce Errant',
      // leap on target player, knocks back other players if hit
      type: 'StartsUsing',
      netRegex: { id: '8078', source: 'Orthos Zaghnal' },
      response: Responses.awayFrom(),
    },
    {
      id: 'EO 91-100 Orthos Fitter Allagan Fear',
      type: 'StartsUsing',
      netRegex: { id: '8080', source: 'Orthos Fitter', capture: false },
      response: Responses.lookAway('alert'),
    },
    // ---------------- Floor 99 Boss: Excalibur ----------------
    {
      id: 'EO 91-100 Excalibur Empty Souls\' Caliber',
      type: 'StartsUsing',
      netRegex: { id: '7A60', source: 'Excalibur', capture: false },
      response: Responses.getUnder('alert'),
    },
    {
      id: 'EO 91-100 Excalibur Solid Souls\' Caliber',
      type: 'StartsUsing',
      netRegex: { id: '7A5F', source: 'Excalibur', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'EO 91-100 Excalibur Caliburni',
      type: 'StartsUsing',
      netRegex: { id: '7A65', source: 'Excalibur', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'EO 91-100 Excalibur Paradoxum',
      type: 'StartsUsing',
      netRegex: { id: '7A79', source: 'Excalibur', capture: false },
      preRun: (data) => {
        delete data.temperature;
      },
      response: Responses.aoe(),
    },
    {
      id: 'EO 91-100 Excalibur Paradoxum Collect',
      // D52 = Soul of Fire
      // D53 - Soul of Ice
      type: 'GainsEffect',
      netRegex: { effectId: 'D5[23]' },
      condition: Conditions.targetIsYou(),
      run: (data, matches) => {
        data.temperature = matches.effectId.toUpperCase();
      },
    },
    {
      id: 'EO 91-100 Excalibur Thermal Divide',
      // TODO: different ids are probably indicating which side is ice/fire
      type: 'StartsUsing',
      netRegex: { id: '7A7[56]', source: 'Excalibur', capture: false },
      alertText: (data, _matches, output) => {
        if (data.temperature === undefined) {
          console.error(`Excalibur Thermal Divide: missing temperature`);
          return;
        }
        if (data.temperature === 'D52')
          return output.ice();
        return output.fire();
      },
      outputStrings: {
        ice: {
          en: 'Get hit by Ice',
          de: 'Lass dich von Eis treffen',
          ja: '氷へ',
          cn: '被冰打',
          ko: '얼음 맞기',
        },
        fire: {
          en: 'Get hit by Fire',
          de: 'Lass dich von Feuer treffen',
          ja: '炎へ',
          cn: '被火打',
          ko: '불 맞기',
        },
      },
    },
    {
      id: 'EO 91-100 Excalibur Flameforge',
      type: 'StartsUsing',
      netRegex: { id: '7A61', source: 'Excalibur', capture: false },
      alertText: (data, _matches, output) => {
        if (data.temperature === undefined) {
          console.error(`Excalibur Flameforge: missing temperature`);
        }
        if (data.temperature === 'D52')
          return output.ice();
        return output.avoid();
      },
      outputStrings: {
        ice: {
          en: 'Get hit by Ice',
          de: 'Lass dich von Eis treffen',
          ja: '氷へ',
          cn: '被冰打',
          ko: '얼음 맞기',
        },
        avoid: {
          en: 'Avoid line AoEs',
          de: 'Vermeide Linien-AoEs',
          ja: '剣AOE回避',
          cn: '躲避直线AOE',
          ko: '칼 피하기',
        },
      },
    },
    {
      id: 'EO 91-100 Excalibur Frostforge',
      type: 'StartsUsing',
      netRegex: { id: '7A62', source: 'Excalibur', capture: false },
      alertText: (data, _matches, output) => {
        if (data.temperature === undefined) {
          console.error(`Excalibur Frostforge: missing temperature`);
        }
        if (data.temperature === 'D53')
          return output.fire();
        return output.avoid();
      },
      outputStrings: {
        fire: {
          en: 'Get hit by Fire',
          de: 'Lass dich von Feuer treffen',
          ja: '炎へ',
          cn: '被火打',
          ko: '불 맞기',
        },
        avoid: {
          en: 'Avoid line AoEs',
          de: 'Vermeide Linien-AoEs',
          ja: '剣AOE回避',
          cn: '躲避直线AOE',
          ko: '칼 피하기',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Excalibur': 'Excalibur',
        'Orthodrone': 'Orthodrohne',
        'Orthonaught': 'Orthonaut',
        'Orthos Fitter': 'Orthos-Schlosser',
        'Orthos Mining Drone': 'Orthos-Minendrohne',
        'Orthos Mithridates': 'Orthos-Mithridates',
        'Orthos Motherbit': 'Orthos-Mutterdrohne',
        'Orthos Sphinx': 'Orthosphinx',
        'Orthos Zaghnal': 'Orthos-Zaghnal',
        'Orthosystem α': 'Orthosystem α',
        'Orthosystem γ': 'Orthosystem γ',
        'Servomechanical Orthochimera': 'servomechanisch(?:e|er|es|en) Orthochimära',
        'Servomechanical Orthotaur': 'servomechanisch(?:e|er|es|en) Orthotaurus',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Excalibur': 'Excalibur',
        'Orthodrone': 'drone Orthos',
        'Orthonaught': 'cuirassé Dreadnaught Orthos',
        'Orthos Fitter': 'installateur Orthos',
        'Orthos Mining Drone': 'drone des mines Orthos',
        'Orthos Mithridates': 'mithridate Orthos',
        'Orthos Motherbit': 'drone mère Orthos',
        'Orthos Sphinx': 'sphinx Orthos',
        'Orthos Zaghnal': 'zaghnal Orthos',
        'Orthosystem α': 'système α Orthos',
        'Orthosystem γ': 'système γ Orthos',
        'Servomechanical Orthochimera': 'chimère servomécanique Orthos',
        'Servomechanical Orthotaur': 'minotaure servomécanique Orthos',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Excalibur': '闘神エクスカリバー',
        'Orthodrone': 'オルト・ドローン',
        'Orthonaught': 'オルト・ドレッドノート',
        'Orthos Fitter': 'オルト・フィッター',
        'Orthos Mining Drone': 'オルト・マイニングドローン',
        'Orthos Mithridates': 'オルト・ミトリダテス',
        'Orthos Motherbit': 'オルト・マザービット',
        'Orthos Sphinx': 'オルト・スフィンクス',
        'Orthos Zaghnal': 'オルト・ザグナル',
        'Orthosystem α': 'オルト・システムα',
        'Orthosystem γ': 'オルト・システムγ',
        'Servomechanical Orthochimera': 'オルト・サーヴォキマイラ',
        'Servomechanical Orthotaur': 'オルト・サーヴォミノタウロス',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Excalibur': '斗神 王者之剑',
        'Orthodrone': '正统无人机',
        'Orthonaught': '正统恐慌装甲',
        'Orthos Fitter': '正统整备工',
        'Orthos Mining Drone': '正统采掘无人机',
        'Orthos Mithridates': '正统米特里达梯',
        'Orthos Motherbit': '正统浮游炮主板',
        'Orthos Sphinx': '正统斯芬克斯',
        'Orthos Zaghnal': '正统扎戈斧龙',
        'Orthosystem α': '正统系统α',
        'Orthosystem γ': '正统系统γ',
        'Servomechanical Orthochimera': '正统自控化奇美拉',
        'Servomechanical Orthotaur': '正统自控化弥诺陶洛斯',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Excalibur': '투신 엑스칼리버',
        'Orthodrone': '오르토스 무인기',
        'Orthonaught': '오르토스 드레드노트',
        'Orthos Fitter': '오르토스 정비공',
        'Orthos Mining Drone': '오르토스 무인 채굴기',
        'Orthos Mithridates': '오르토스 미트리다테스',
        'Orthos Motherbit': '오르토스 마더 비트',
        'Orthos Sphinx': '오르토스 스핑크스',
        'Orthos Zaghnal': '오르토스 자그날',
        'Orthosystem α': '오르토스 시스템 α',
        'Orthosystem γ': '오르토스 시스템 γ',
        'Servomechanical Orthochimera': '오르토스 자동제어 키마이라',
        'Servomechanical Orthotaur': '오르토스 자동제어 미노타우로스',
      },
    },
  ],
});
