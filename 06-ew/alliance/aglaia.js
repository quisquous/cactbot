Options.Triggers.push({
  zoneId: ZoneId.Aglaia,
  timelineFile: 'aglaia.txt',
  initData: () => {
    return {
      tankbusters: [],
      naldSmeltingSpread: [],
      naldArrowMarker: [],
    };
  },
  triggers: [
    {
      id: 'Aglaia Byregot Ordeal of Thunder',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7176', source: 'Byregot', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Aglaia Byregot Byregot\'s Strike',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '725A', source: 'Byregot', capture: false }),
      response: Responses.knockback('info'),
    },
    {
      id: 'Aglaia Byregot Byregot\'s Strike Lightning',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7167', source: 'Byregot', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Knockback (with lightning)',
        },
      },
    },
    {
      id: 'Aglaia Byregot Byregot\'s Ward',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7175', source: 'Byregot' }),
      response: Responses.tankCleave(),
    },
    {
      id: 'Aglaia Byregot Reproduce',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '716B', source: 'Byregot', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Dodge normal -> glowing row',
        },
      },
    },
    {
      id: 'Aglaia Rhalgr\'s Emissary Destructive Static',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '70E0', source: 'Rhalgr\'s Emissary', capture: false }),
      response: Responses.getBehind(),
    },
    {
      id: 'Aglaia Rhalgr\'s Emissary Bolts from the Blue',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '70E3', source: 'Rhalgr\'s Emissary', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Aglaia Rhalgr\'s Emissary Destructive Strike',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '70D9', source: 'Rhalgr\'s Emissary' }),
      response: Responses.tankCleave(),
    },
    {
      id: 'Aglaia Rhalgr Lightning Reign',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '70A5', source: 'Rhalgr', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Aglaia Rhalgr Destructive Bolt Collect',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '70B4', source: 'Rhalgr' }),
      run: (data, matches) => data.tankbusters.push(matches.target),
    },
    {
      id: 'Aglaia Rhalgr Destructive Bolt',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '70B4', source: 'Rhalgr', capture: false }),
      delaySeconds: 0.3,
      suppressSeconds: 1,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          tankCleaveOnYou: Outputs.tankCleaveOnYou,
          tankCleaves: {
            en: 'Avoid Tank Cleaves',
          },
        };
        if (data.tankbusters.includes(data.me))
          return { alertText: output.tankCleaveOnYou() };
        return { infoText: output.tankCleaves() };
      },
      run: (data) => data.tankbusters = [],
    },
    {
      id: 'Aglaia Rhalgr Rhalgr\'s Beacon',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '70B8', source: 'Rhalgr', capture: false }),
      // 10 second cast.
      delaySeconds: 5,
      alertText: (data, _matches, output) => {
        return data.rhalgrSeenBeacon ? output.knockbackOrbs() : output.knockback();
      },
      run: (data) => data.rhalgrSeenBeacon = true,
      outputStrings: {
        knockback: Outputs.knockback,
        knockbackOrbs: {
          en: 'Knockback (avoid orbs)',
        },
      },
    },
    {
      id: 'Aglaia Rhalgr Lightning Storm',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '70BA', source: 'Rhalgr' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Aglaia Rhalgr Broken World',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '70A6', source: 'Rhalgr', capture: false }),
      run: (data) => data.rhalgrBrokenWorldActive = true,
    },
    {
      id: 'Aglaia Rhalgr Broken World Cleanup',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '70A6', source: 'Rhalgr', capture: false }),
      delaySeconds: 20,
      run: (data) => data.rhalgrBrokenWorldActive = false,
    },
    {
      id: 'Aglaia Rhalgr Hand of the Destroyer Blue',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '70A9', source: 'Rhalgr', capture: false }),
      alertText: (data, _matches, output) => {
        if (data.rhalgrBrokenWorldActive)
          return output.redSideAway();
        return output.redSide();
      },
      outputStrings: {
        redSide: {
          en: 'Be on red half',
        },
        redSideAway: {
          en: 'Be on red half (away from portal)',
        },
      },
    },
    {
      id: 'Aglaia Rhalgr Hand of the Destroyer Red Initial',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '70A8', source: 'Rhalgr', capture: false }),
      alertText: (_data, _matches, output) => output.blueSide(),
      outputStrings: {
        blueSide: {
          en: 'Be on blue half',
        },
      },
    },
    {
      id: 'Aglaia Rhalgr Hand of the Destroyer Red',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '70AC', source: 'Rhalgr', capture: false }),
      alertText: (_data, _matches, output) => output.nearRed(),
      outputStrings: {
        nearRed: {
          en: 'Go near red portal',
        },
      },
    },
    {
      id: 'Aglaia Lions Double Immolation',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7177', source: ['Lion of Aglaia', 'Lioness of Aglaia'], capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Aglaia Lions Slash and Burn Lioness First',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '71D2', source: 'Lioness of Aglaia', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Under Lioness => Out',
        },
      },
    },
    {
      id: 'Aglaia Lions Slash and Burn Lion First',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '71D0', source: 'Lion of Aglaia', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Out => Under Lioness',
        },
      },
    },
    {
      id: 'Aglaia Azeyma Warden\'s Prominence',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '70A0', source: 'Azeyma', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Aglaia Azeyma Solar Wings',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7081', source: 'Azeyma', capture: false }),
      response: Responses.goFrontBack(),
    },
    {
      id: 'Aglaia Azeyma Warden\'s Warmth Collect',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '709F', source: 'Azeyma' }),
      run: (data, matches) => data.tankbusters.push(matches.target),
    },
    {
      id: 'Aglaia Azeyma Warden\'s Warmth',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '709F', source: 'Azeyma', capture: false }),
      delaySeconds: 0.3,
      suppressSeconds: 1,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          tankCleaveOnYou: Outputs.tankCleaveOnYou,
          tankCleaves: {
            en: 'Avoid Tank Cleaves',
          },
        };
        if (data.tankbusters.includes(data.me))
          return { alertText: output.tankCleaveOnYou() };
        return { infoText: output.tankCleaves() };
      },
      run: (data) => data.tankbusters = [],
    },
    {
      id: 'Aglaia Azeyma Fleeting Spark',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '709C', source: 'Azeyma', capture: false }),
      response: Responses.getBehind(),
    },
    {
      id: 'Aglaia Azeyma Sublime Sunset',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7098', source: 'Azeyma', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Away from Orb',
        },
      },
    },
    {
      id: 'Aglaia Nald\'thal As Above, So Below',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['70E8', '70E9'], source: 'Nald\'thal', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Aglaia Nald\'thal Heat Above, Flames Below Orange Swap',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '73A4', source: 'Nald\'thal', capture: false }),
      durationSeconds: 6,
      response: Responses.getOut(),
    },
    {
      id: 'Aglaia Nald\'thal Heat Above, Flames Below Blue',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '73A5', source: 'Nald\'thal', capture: false }),
      durationSeconds: 6,
      response: Responses.getUnder(),
    },
    {
      id: 'Aglaia Nald\'thal Smelting',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '00ED' }),
      alertText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.text();
      },
      run: (data, matches) => data.naldSmeltingSpread.push(matches.target),
      outputStrings: {
        text: {
          en: 'Protean Spread on YOU',
        },
      },
    },
    {
      id: 'Aglaia Nald\'thal Heaven\'s Trial',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '711F', source: 'Nald\'thal' }),
      alertText: (data, matches, output) => {
        if (data.naldSmeltingSpread.includes(data.me))
          return;
        return output.stackOnPlayer({ player: data.ShortName(matches.target) });
      },
      run: (data) => data.naldSmeltingSpread = [],
      outputStrings: {
        stackOnPlayer: Outputs.stackOnPlayer,
      },
    },
    {
      id: 'Aglaia Nald\'thal Golden Tenet',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '711B', source: 'Nald\'thal' }),
      response: Responses.sharedTankBuster(),
    },
    {
      // The order of events is:
      // Deepest Pit headmarker (always) -> Far Above cast -> 73AC ability (only if stack is real)
      id: 'Aglaia Nald\'thal Deepest Pit Collect',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0154' }),
      run: (data, matches) => data.naldArrowMarker.push(matches.target),
    },
    {
      id: 'Aglaia Nald\'thal Far Above, Deep Below Blue',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '73AA', source: 'Nald\'thal', capture: false }),
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          dropMarkerOutside: {
            en: 'Drop marker outside',
          },
          ignoreLineStack: {
            en: 'Ignore fake stack',
          },
        };
        // People with arrow markers should not get a stack callout.
        if (data.naldArrowMarker.includes(data.me))
          return { alertText: output.dropMarkerOutside() };
        return { infoText: output.ignoreLineStack() };
      },
      run: (data) => data.naldArrowMarker = [],
    },
    {
      id: 'Aglaia Nald\'thal Far Above, Deep Below Orange',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '73AB', source: 'Nald\'thal', capture: false }),
      infoText: (data, _matches, output) => {
        if (data.naldArrowMarker.includes(data.me))
          return output.ignoreArrow();
      },
      outputStrings: {
        ignoreArrow: {
          en: 'Ignore fake arrow',
        },
      },
    },
    {
      id: 'Aglaia Nald\'thal Far-flung Fire',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '73AC', source: 'Nald' }),
      alertText: (data, matches, output) => {
        // If this ability happens, the stack is real.
        return output.lineStackOn({ player: data.ShortName(matches.target) });
      },
      run: (data) => data.naldArrowMarker = [],
      outputStrings: {
        lineStackOn: {
          en: 'Line stack on ${player}',
          de: 'In einer Linie auf ${player} sammeln',
          fr: 'Packez-vous en ligne sur ${player}',
          ja: '${player}に直線頭割り',
          cn: '${player} 直线分摊',
          ko: '${player} 직선 쉐어',
        },
      },
    },
    {
      id: 'Aglaia Nald\'thal Once Above, Ever Below Orange',
      type: 'StartsUsing',
      // 73BF = starts blue, swaps orange
      // 741D = starts orange, stays orange
      netRegex: NetRegexes.startsUsing({ id: ['73BF', '741D'], source: 'Nald\'thal', capture: false }),
      durationSeconds: 6,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Go to Blue Quadrant',
        },
      },
    },
    {
      id: 'Aglaia Nald\'thal Once Above, Ever Below Blue',
      type: 'StartsUsing',
      // 73C0 = starts blue, stays blue
      // 741C = starts orange, swaps blue
      netRegex: NetRegexes.startsUsing({ id: ['73C0', '741C'], source: 'Nald\'thal', capture: false }),
      durationSeconds: 6,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Go to Orange Quadrant',
        },
      },
    },
    {
      id: 'Aglaia Nald\'thal Hell of Fire Front',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '72B7', source: 'Nald\'thal', capture: false }),
      response: Responses.getBehind(),
    },
    {
      id: 'Aglaia Nald\'thal Hell of Fire Back',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '72B9', source: 'Nald\'thal', capture: false }),
      alertText: (_data, _matches, output) => output.goFront(),
      outputStrings: {
        goFront: Outputs.goFront,
      },
    },
    {
      id: 'Aglaia Nald\'thal Soul Vessel Magmatic Spell',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '712D', source: 'Soul Vessel', capture: false }),
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Stack groups',
        },
      },
    },
    {
      id: 'Aglaia Nald\'thal Stygian Tenet Collect',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '711D', source: 'Nald\'thal' }),
      run: (data, matches) => data.tankbusters.push(matches.target),
    },
    {
      id: 'Aglaia Nald\'thal Stygian Tenet',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '711D', source: 'Nald\'thal', capture: false }),
      delaySeconds: 0.3,
      suppressSeconds: 1,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          tankCleaveOnYou: Outputs.tankCleaveOnYou,
          tankCleaves: {
            en: 'Avoid Tank Cleaves',
          },
        };
        if (data.tankbusters.includes(data.me))
          return { alertText: output.tankCleaveOnYou() };
        return { infoText: output.tankCleaves() };
      },
      run: (data) => data.tankbusters = [],
    },
    {
      id: 'Aglaia Nald\'thal Hearth Above, Flight Below Blue',
      type: 'StartsUsing',
      // 73CA = start blue, stay blue
      // 73CC = start orange, swap blue
      netRegex: NetRegexes.startsUsing({ id: ['73CA', '73CC'], source: 'Nald\'thal', capture: false }),
      durationSeconds: 6,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          dropMarkerOutside: {
            en: 'Under => Drop marker outside',
          },
          ignoreLineStack: {
            en: 'Under (ignore fake stack)',
          },
        };
        // People with arrow markers should not get a stack callout.
        if (data.naldArrowMarker.includes(data.me))
          return { alertText: output.dropMarkerOutside() };
        return { infoText: output.ignoreLineStack() };
      },
      run: (data) => data.naldArrowMarker = [],
    },
    {
      id: 'Aglaia Nald\'thal Hearth Above, Flight Below Orange',
      type: 'StartsUsing',
      // 73CB = orange, unknown if swap
      // 74FB = orange, unknown if swap
      netRegex: NetRegexes.startsUsing({ id: ['73CB', '74FB'], source: 'Nald\'thal', capture: false }),
      durationSeconds: 6,
      // Use info here to not conflict with the 73AC line stack trigger.
      infoText: (data, _matches, output) => {
        if (data.naldArrowMarker.includes(data.me))
          return output.ignoreArrow();
        return output.out();
      },
      outputStrings: {
        ignoreArrow: {
          en: 'Out (ignore fake arrow)',
        },
        out: Outputs.out,
      },
    },
    {
      id: 'Aglaia Nald\'thal Hells\' Trial',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7121', source: 'Nald\'thal', capture: false }),
      response: Responses.aoe(),
    },
  ],
});
