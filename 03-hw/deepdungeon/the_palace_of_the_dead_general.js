Options.Triggers.push({
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
  },
  triggers: [
    // ---------------- Mimics ----------------
    {
      id: 'PotD General Mimic Spawn',
      // 2566 = Mimic
      // TODO: some Mimics may spawn after transference between floors and get called early before being found
      type: 'AddedCombatant',
      netRegex: { npcNameId: '2566', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Mimic spawned!',
        },
      },
    },
    {
      id: 'PotD General Mimic Infatuation',
      // gives Accursed Pox (43F) if not interrupted
      type: 'StartsUsing',
      netRegex: { id: '18FD', source: 'Mimic' },
      response: Responses.interrupt(),
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
        },
        // pomanders: https://xivapi.com/deepdungeonItem?pretty=true
        safety: {
          en: 'Safety',
        },
        sight: {
          en: 'Sight',
        },
        strength: {
          en: 'Strength',
        },
        steel: {
          en: 'Steel',
        },
        affluence: {
          en: 'Affluence',
        },
        flight: {
          en: 'Flight',
        },
        alteration: {
          en: 'Alteration',
        },
        purity: {
          en: 'Purity',
        },
        fortune: {
          en: 'Fortune',
        },
        witching: {
          en: 'Witching',
        },
        serenity: {
          en: 'Serenity',
        },
        rage: {
          en: 'Rage',
        },
        lust: {
          en: 'Lust',
        },
        intuition: {
          en: 'Intuition',
        },
        raising: {
          en: 'Raising',
        },
        resolution: {
          en: 'Resolution',
        },
        frailty: {
          en: 'Frailty',
        },
        concealment: {
          en: 'Concealment',
        },
        petrification: {
          en: 'Petrification',
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
        },
      },
    },
  ],
});
