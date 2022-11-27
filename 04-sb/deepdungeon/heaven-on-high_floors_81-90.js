Options.Triggers.push({
  zoneId: ZoneId.HeavenOnHighFloors81_90,
  triggers: [
    // ---------------- Floor 81-89 Mobs ----------------
    {
      id: 'HoH 81-90 Heavenly Mukai-inu Ram\'s Voice',
      // untelegraphed PBAoE
      type: 'StartsUsing',
      netRegex: { id: '308F', source: 'Heavenly Mukai-inu' },
      alertText: (data, matches, output) => {
        if (data.CanSilence())
          return output.interruptOrOut({ name: matches.source });
        return output.out();
      },
      outputStrings: {
        out: Outputs.out,
        interruptOrOut: {
          en: 'interrupt ${name} or Out',
        },
      },
    },
    {
      id: 'HoH 81-90 Heavenly Mukai-inu Dragon\'s Voice',
      // untelegraphed donut AoE
      type: 'StartsUsing',
      netRegex: { id: '3090', source: 'Heavenly Mukai-inu' },
      alertText: (data, matches, output) => {
        if (data.CanSilence())
          return output.interruptOrUnder({ name: matches.source });
        return output.getUnder();
      },
      outputStrings: {
        getUnder: Outputs.getUnder,
        interruptOrUnder: {
          en: 'interrupt ${name} or Get Under',
        },
      },
    },
    {
      id: 'HoH 81-90 Heavenly Gozu 11-tonze Swipe',
      // untelegraphed front cone AoE
      type: 'StartsUsing',
      netRegex: { id: '309C', source: 'Heavenly Gozu', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'HoH 81-90 Heavenly Gozu Hex',
      // gaze, inflicts Pig, will Devour (instant kill) pigs after
      type: 'StartsUsing',
      netRegex: { id: '309A', source: 'Heavenly Gozu', capture: false },
      response: Responses.lookAway('alert'),
    },
    {
      id: 'HoH 81-90 Heavenly Shinzei Thunder II',
      // AoE on marked target, can interrupt
      type: 'StartsUsing',
      netRegex: { id: '30C9', source: 'Heavenly Shinzei' },
      response: Responses.interruptIfPossible(),
    },
    {
      id: 'HoH 81-90 Heavenly Ryujin Elbow Drop',
      // untelegraphed back cone AoE, fast cast, used immediately after Firewater if there is someone behind
      type: 'StartsUsing',
      netRegex: { id: '30A2', source: 'Heavenly Ryujin', capture: false },
      response: Responses.goFront(),
    },
    {
      id: 'HoH 81-90 Heavenly Hitotsume Glower',
      // untelegraphed front line AoE
      type: 'StartsUsing',
      netRegex: { id: '30A3', source: 'Heavenly Hitotsume', capture: false },
      response: Responses.awayFromFront(),
    },
    {
      id: 'HoH 81-90 Heavenly Hitotsume 100-tonze Swing',
      // untelegraphed PBAoE
      type: 'StartsUsing',
      netRegex: { id: '30A4', source: 'Heavenly Hitotsume', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'HoH 81-90 Heavenly Araragi Moldy Sneeze',
      // 30A7 = Inhale, draw-in
      // 30A8 = Moldy Sneeze, front cone AoE, used immediately after Inhale
      type: 'StartsUsing',
      netRegex: { id: '30A7', source: 'Heavenly Araragi', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'HoH 81-90 Heavenly Koki Spiral Spin',
      // donut AoE
      type: 'StartsUsing',
      netRegex: { id: '30AE', source: 'Heavenly Koki', capture: false },
      response: Responses.getIn(),
    },
    {
      id: 'HoH 81-90 Heavenly Rakshasa Ripper Claw',
      // untelegraphed front cone AoE
      type: 'StartsUsing',
      netRegex: { id: '30DC', source: 'Heavenly Rakshasa', capture: false },
      response: Responses.getBehind(),
    },
    // ---------------- Floor 90 Boss: Onra ----------------
    {
      id: 'HoH 81-90 Onra Ancient Quaga',
      // 50% max HP damage
      type: 'StartsUsing',
      netRegex: { id: '2FB6', source: 'Onra', capture: false },
      response: Responses.bigAoe('alert'),
    },
    {
      id: 'HoH 81-90 Onra Meteor Impact',
      // large proximity AoE
      // 2FB3 = Meteor Impact (2.7s), marks location of proximity AoE
      // 2FB4 = Meteor Impact (5.7s), actual damage cast
      type: 'StartsUsing',
      netRegex: { id: '2FB4', source: 'Onra' },
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 3,
      response: Responses.aoe(),
    },
  ],
});
