Options.Triggers.push({
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
          cn: '出去或打断 ${name}',
          ko: '밖으로 또는 ${name} 시전 끊기',
        },
      },
    },
    // {
    //   id: 'EO 91-100 Orthosystem γ Repelling Cannons',
    //   type: 'StartsUsing',
    //   netRegex: { id: '', source: 'Orthosystem γ', capture: false },
    //   response: Responses.getOut(),
    // },
    // {
    //   id: 'EO 91-100 Orthosystem γ Ring Cannon',
    //   type: 'StartsUsing',
    //   netRegex: { id: '', source: 'Orthosystem γ', capture: false },
    //   response: Responses.getIn(),
    // },
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
    // {
    //   id: 'EO 91-100 Servomechanical Orthochimera Dragon\'s Breath',
    //   // AoE cleave to front and left
    //   type: 'StartsUsing',
    //   netRegex: { id: '', source: 'Servomechanical Orthochimera', capture: false },
    //   response: Responses.getBehind(),
    // },
    // {
    //   id: 'EO 91-100 Servomechanical Orthochimera Engulfing Ice',
    //   // AoE cleave to front and right
    //   type: 'StartsUsing',
    //   netRegex: { id: '', source: 'Servomechanical Orthochimera', capture: false },
    //   response: Responses.getBehind(),
    // },
    // {
    //   id: 'EO 91-100 Servomechanical Orthochimera Scorpion Sting',
    //   // AoE cleave behind
    //   type: 'StartsUsing',
    //   netRegex: { id: '', source: 'Servomechanical Orthochimera', capture: false },
    //   response: Responses.goFront(),
    // },
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
    // {
    //   id: 'EO 91-100 Orthonaught Rotoswipe',
    //   type: 'StartsUsing',
    //   netRegex: { id: '', source: 'Orthonaught', capture: false },
    //   response: Responses.awayFromFront(),
    // },
    {
      id: 'EO 91-100 Orthos Zaghnal Beastly Roar',
      // lethal roomwide AoE, used out-of-combat
      // TODO: can detect mobs in other rooms, this might be too spammy
      type: 'StartsUsing',
      netRegex: { id: '80A9', source: 'Orthos Zaghnal', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'EO 91-100 Orthos Zaghnal Pounce Errant',
      // leap on target player, knocks back other players if hit
      type: 'StartsUsing',
      netRegex: { id: '8078', source: 'Orthos Zaghnal' },
      response: Responses.awayFrom(),
    },
    {
      id: 'EO 91-100 Orthos Fitter Unholy',
      // lethal roomwide AoE, used out-of-combat
      // TODO: can detect mobs in other rooms, this might be too spammy
      type: 'StartsUsing',
      netRegex: { id: '80A3', source: 'Orthos Fitter', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'EO 91-100 Orthos Fitter Allagan Fear',
      type: 'StartsUsing',
      netRegex: { id: '8080', source: 'Orthos Fitter', capture: false },
      response: Responses.lookAway('alert'),
    },
    // ---------------- Floor 99 Boss: Excalibur ----------------
    // {
    //   id: 'EO 91-100 Excalibur Empty Souls\' Caliber',
    //   type: 'StartsUsing',
    //   netRegex: { id: '', source: 'Excalibur', capture: false },
    //   response: Responses.getUnder(),
    // },
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
      response: Responses.aoe(),
      run: (data) => {
        delete data.temperature;
      },
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
      type: 'StartsUsing',
      netRegex: { id: '7A75', source: 'Excalibur', capture: false },
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
          en: 'Get hit by ice',
          de: 'Lass dich von Eis treffen',
        },
        fire: {
          en: 'Get hit by fire',
          de: 'Lass dich von Feuer treffen',
        },
      },
    },
  ],
});
