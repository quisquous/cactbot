import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: Byregot Levinforge
// TODO: Byregot Spire
// TODO: Emissary Destructive Charge quadrants
// TODO: figure out Rhalgr portal sides so we can call left/right/NW/NE
// TODO: are there missing rhalgr portal ability ids?
// TODO: Lions 180 cleaves (is there a call there?)
// TODO: Azeyma Solar Wings, does it need a watch rotation warning?
// TODO: Azeyma Solar Flare warning
// TODO: Azeyma count Radiant Rhythms and call safe direction (or is it fixed?)
// TODO: Azeyma haute air safe quadrant(s)
// TODO: Azeyma Wildfire Ward triangle triggers
// TODO: Nald'Thal Fired Up I/II/III

// RHALGR NOTES:
// 70B0 punching in blue on right (paired with 70A9)
// 70AF punching in red on left (paired with 70A8)
// 70B1 single red with broken world
// 71DC punching in red on right (broken world right)
// 70B0 punching in blue on left (broken world right)
// 71DC punching in red on right (broken world right)
// 70B0 punching in blue on right (broken world left)

// LIONS NOTES:
// 71D0/6.7 Lion dot1 out (71D4 self)
// 71D6/9.9 Lioness dot2 in (71D3 self)
// 71D2/6.7 Lioness dot1 in (71D1 self)
// 71D5/9.9 Lion dot2 out (71D4 self)
// 71CE/6.7 Lionness dot1 blaze (facing north)
// 71CF/8.7 Lion dot2 blaze (facing south)
// 71CE/6.7 Lion dot1 blaze (facing east)
// 71CF/8.7 Lionness dot2 blaze (facing west)

// NALD'THAL NOTES
// 73A5 Heat Above, blue background, get in (on red)
//  73A8 Living Heat
//  73A7 Flames of the Dead
// 73A4 Heat Above, blue background late yellow switch, get out (on blue)
//  73A9 Living Heat
//  73A6 Flames of the Dead
// 73AA Far Above, Deep Below (blue background)
//  Deepest Pit blue markers real, stack marker fake
// 73AB Far Above, Deep Below (yellow background)
//  Deepest Pit fake, stack marker real
// 741D Once Above, Ever Below, yellow background, go to blue corner
//  73C4 Everfire
//  73C5 Once Burned
//  73C6 Once Burned
// 73BF Once Above, Ever Below, late yellow switch, go to blue corner
//  73C4 Everfire
//  73C5 Once Burned
//  73C6 Once Burned
// 73C0 Once Above, Ever Below blue background, go to yellow corner
//  73C2 Everfire 1
//  73C3 Everfire 2
//  73C1 Once Burned
// 73CA Hearth Above, Flight Below blue background
//  73A8 Living Heat
//  73A7 Flames of the Dead
//  followed by real 73C7/73C8 Deepest Pit
// 73CB Hearth Above, Flight Below yellow but unknown if swap
//  73A6 Flames of the Dead
//  73A9 Living Heat
//  followed by real 73AD Far-Flung Fire
// 74FB Hearth Above, Flight Below yellow but unknown if swap
//  73A6 Flames of the Dead
//  73A9 Living Heat
//  followed by real 73AD Far-Flung Fire
// 72B7 Hell of Fire (frontal 180)
//  72B8 damage
// 72B9 Hell of Fire (reverse 180, but late switch)
//  72BA damage
// 7111 Fired Up 1 (knockback)
//  73AF knockback (7117 self-targeted preceding?)
// 738A Fired Up 2 (out)
//  7118 damage
// 7112 Fired Up 1 (out)
//  7119 damage
// 7389 Fired Up 2 (knockback)
//  73AF knockback (7117 self-targeted preceding)
// 7419 Fired Up 3 (knockback)
//  73AF knockback (7116 self-targeted preceding)
// 741A Fired Up 3 (out)
//  7118 damage

export interface Data extends RaidbossData {
  rhalgrSeenBeacon?: boolean;
  rhalgrBrokenWorldActive?: boolean;
  tankbusters: string[];
  naldSmeltingSpread: string[];
  naldArrowMarker: string[];
}

const triggerSet: TriggerSet<Data> = {
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
      response: Responses.knockback(),
    },
    {
      id: 'Aglaia Byregot Byregot\'s Strike Lightning',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7167', source: 'Byregot', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Knockback (to intercards)',
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
      infoText: (_data, _matches, output) => output.text!(),
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
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          tankCleaveOnYou: Outputs.tankCleaveOnYou,
          tankCleaves: {
            en: 'Avoid Tank Cleaves',
          },
        };

        if (data.tankbusters.includes(data.me))
          return { alertText: output.tankCleaveOnYou!() };
        return { infoText: output.tankCleaves!() };
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
        return data.rhalgrSeenBeacon ? output.knockbackOrbs!() : output.knockback!();
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
      id: 'Aglaia Rhalgr Hand of the Destroyer Blue',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '70B0', source: 'Rhalgr', capture: false }),
      alertText: (data, _matches, output) => {
        if (data.rhalgrBrokenWorldActive)
          return output.redSideAway!();
        return output.redSide!();
      },
      run: (data) => delete data.rhalgrBrokenWorldActive,
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
      netRegex: NetRegexes.startsUsing({ id: '70AF', source: 'Rhalgr', capture: false }),
      alertText: (_data, _matches, output) => output.blueSide!(),
      run: (data) => delete data.rhalgrBrokenWorldActive,
      outputStrings: {
        blueSide: {
          en: 'Be on blue half',
        },
      },
    },
    {
      id: 'Aglaia Rhalgr Hand of the Destroyer Red',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['70B1', '71DC'], source: 'Rhalgr', capture: false }),
      alertText: (_data, _matches, output) => output.nearRed!(),
      run: (data) => delete data.rhalgrBrokenWorldActive,
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
      alertText: (_data, _matches, output) => output.text!(),
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
      alertText: (_data, _matches, output) => output.text!(),
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
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          tankCleaveOnYou: Outputs.tankCleaveOnYou,
          tankCleaves: {
            en: 'Avoid Tank Cleaves',
          },
        };

        if (data.tankbusters.includes(data.me))
          return { alertText: output.tankCleaveOnYou!() };
        return { infoText: output.tankCleaves!() };
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
      alertText: (_data, _matches, output) => output.text!(),
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
      response: Responses.getOut(),
    },
    {
      id: 'Aglaia Nald\'thal Heat Above, Flames Below Blue',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '73A5', source: 'Nald\'thal', capture: false }),
      response: Responses.getUnder(),
    },
    {
      id: 'Aglaia Nald\'thal Smelting',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '00ED' }),
      alertText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.text!();
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
        return output.stackOnPlayer!({ player: data.ShortName(matches.target) });
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
      // Deepest Pit headmarker (always) -> Far Above cast -> 73AC cast (only if stack is real)
      id: 'Aglaia Nald\'thal Deepest Pit Collect',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '00154' }),
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
          return { alertText: output.dropMarkerOutside!() };

        return { infoText: output.ignoreLineStack!() };
      },
      run: (data) => data.naldArrowMarker = [],
    },
    {
      id: 'Aglaia Nald\'thal Far Above, Deep Below Orange',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '73AB', source: 'Nald\'thal', capture: false }),
      infoText: (data, _matches, output) => {
        if (data.naldArrowMarker.includes(data.me))
          return output.ignoreArrow!();
      },
      outputStrings: {
        ignoreArrow: {
          en: 'Ignore fake arrow',
        },
      },
    },
    {
      id: 'Aglaia Nald\'thal Far-flung Fire',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '73AC', source: 'Nald\'thal' }),
      alertText: (data, matches, output) => {
        // If this starts casting, it is real.
        return output.lineStackOn!({ player: data.ShortName(matches.target) });
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
      id: 'Aglaia Nald\'thal Once Above Ever Below Orange',
      type: 'StartsUsing',
      // 73BF = starts blue, swaps orange
      // 741D = starts orange, stays orange
      netRegex: NetRegexes.startsUsing({ id: ['73BF', '741D'], source: 'Nald\'thal', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Go to Blue Quadrant',
        },
      },
    },
    {
      id: 'Aglaia Nald\'thal Once Above Ever Below Blue',
      type: 'StartsUsing',
      // 73C0 = starts blue, stays blue
      // ??? = is there a swap?
      netRegex: NetRegexes.startsUsing({ id: '73C0', source: 'Nald\'thal', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
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
      response: Responses.getBehind(),
    },
    {
      id: 'Aglaia Nald\'thal Soul Vessel Magmatic Spell',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '712D', source: 'Soul Vessel', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
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
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          tankCleaveOnYou: Outputs.tankCleaveOnYou,
          tankCleaves: {
            en: 'Avoid Tank Cleaves',
          },
        };

        if (data.tankbusters.includes(data.me))
          return { alertText: output.tankCleaveOnYou!() };
        return { infoText: output.tankCleaves!() };
      },
      run: (data) => data.tankbusters = [],
    },
    {
      id: 'Aglaia Nald\'thal Hearth Above, Flight Below Blue',
      type: 'StartsUsing',
      // 73CA = start blue, stay blue
      // ??? = swap?
      netRegex: NetRegexes.startsUsing({ id: '73CA', source: 'Nald\'thal', capture: false }),
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
          return { alertText: output.dropMarkerOutside!() };

        return { infoText: output.ignoreLineStack!() };
      },
      run: (data) => data.naldArrowMarker = [],
    },
    {
      id: 'Aglaia Nald\'thal Hearth Above, Flight Below Orange',
      type: 'StartsUsing',
      // 73CB = orange, unknown if swap
      // 74FB = orange, unknown if swap
      netRegex: NetRegexes.startsUsing({ id: ['73CB', '74FB'], source: 'Nald\'thal', capture: false }),
      // Use info here to not conflict with the 73AC line stack trigger.
      infoText: (data, _matches, output) => {
        if (data.naldArrowMarker.includes(data.me))
          return output.ignoreArrow!();
        return output.out!();
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
};

export default triggerSet;
