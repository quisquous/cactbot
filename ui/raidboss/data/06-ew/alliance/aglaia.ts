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
      netRegexDe: NetRegexes.startsUsing({ id: '7176', source: 'Byregot', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '7176', source: 'Byregot', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '7176', source: 'ビエルゴ', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Aglaia Byregot Byregot\'s Strike',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '725A', source: 'Byregot', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '725A', source: 'Byregot', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '725A', source: 'Byregot', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '725A', source: 'ビエルゴ', capture: false }),
      response: Responses.knockback('info'),
    },
    {
      id: 'Aglaia Byregot Byregot\'s Strike Lightning',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7167', source: 'Byregot', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '7167', source: 'Byregot', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '7167', source: 'Byregot', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '7167', source: 'ビエルゴ', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Knockback (with lightning)',
          de: 'Rückstoß (mit Blitzen)',
        },
      },
    },
    {
      id: 'Aglaia Byregot Byregot\'s Ward',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7175', source: 'Byregot' }),
      netRegexDe: NetRegexes.startsUsing({ id: '7175', source: 'Byregot' }),
      netRegexFr: NetRegexes.startsUsing({ id: '7175', source: 'Byregot' }),
      netRegexJa: NetRegexes.startsUsing({ id: '7175', source: 'ビエルゴ' }),
      response: Responses.tankCleave(),
    },
    {
      id: 'Aglaia Byregot Reproduce',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '716B', source: 'Byregot', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '716B', source: 'Byregot', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '716B', source: 'Byregot', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '716B', source: 'ビエルゴ', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Dodge normal -> glowing row',
          de: 'Normal ausweichen -> leuchtende Reihe',
        },
      },
    },
    {
      id: 'Aglaia Rhalgr\'s Emissary Destructive Static',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '70E0', source: 'Rhalgr\'s Emissary', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '70E0', source: 'Rhalgrs Abgesandt(?:e|er|es|en)', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '70E0', source: 'Émissaire De Rhalgr', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '70E0', source: 'ラールガーズ・エミッサリー', capture: false }),
      response: Responses.getBehind(),
    },
    {
      id: 'Aglaia Rhalgr\'s Emissary Bolts from the Blue',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '70E3', source: 'Rhalgr\'s Emissary', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '70E3', source: 'Rhalgrs Abgesandt(?:e|er|es|en)', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '70E3', source: 'Émissaire De Rhalgr', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '70E3', source: 'ラールガーズ・エミッサリー', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Aglaia Rhalgr\'s Emissary Destructive Strike',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '70D9', source: 'Rhalgr\'s Emissary' }),
      netRegexDe: NetRegexes.startsUsing({ id: '70D9', source: 'Rhalgrs Abgesandt(?:e|er|es|en)' }),
      netRegexFr: NetRegexes.startsUsing({ id: '70D9', source: 'Émissaire De Rhalgr' }),
      netRegexJa: NetRegexes.startsUsing({ id: '70D9', source: 'ラールガーズ・エミッサリー' }),
      response: Responses.tankCleave(),
    },
    {
      id: 'Aglaia Rhalgr Lightning Reign',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '70A5', source: 'Rhalgr', capture: false }),
       netRegexDe: NetRegexes.startsUsing({ id: '70A5', source: 'Rhalgr', capture: false }),
       netRegexFr: NetRegexes.startsUsing({ id: '70A5', source: 'Rhalgr', capture: false }),
       netRegexJa: NetRegexes.startsUsing({ id: '70A5', source: 'ラールガー', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Aglaia Rhalgr Destructive Bolt Collect',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '70B4', source: 'Rhalgr' }),
      netRegexDe: NetRegexes.startsUsing({ id: '70B4', source: 'Rhalgr' }),
      netRegexFr: NetRegexes.startsUsing({ id: '70B4', source: 'Rhalgr' }),
      netRegexJa: NetRegexes.startsUsing({ id: '70B4', source: 'ラールガー' }),
      run: (data, matches) => data.tankbusters.push(matches.target),
    },
    {
      id: 'Aglaia Rhalgr Destructive Bolt',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '70B4', source: 'Rhalgr', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '70B4', source: 'Rhalgr', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '70B4', source: 'Rhalgr', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '70B4', source: 'ラールガー', capture: false }),
      delaySeconds: 0.3,
      suppressSeconds: 1,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          tankCleaveOnYou: Outputs.tankCleaveOnYou,
          tankCleaves: {
            en: 'Avoid Tank Cleaves',
            de: 'Weiche Tank-Cleaves aus',
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
      netRegexDe: NetRegexes.startsUsing({ id: '70B8', source: 'Rhalgr', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '70B8', source: 'Rhalgr', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '70B8', source: 'ラールガー', capture: false }),
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
          de: 'Rückstoßs (weiche den Orbs aus)',
        },
      },
    },
    {
      id: 'Aglaia Rhalgr Lightning Storm',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '70BA', source: 'Rhalgr' }),
      netRegexDe: NetRegexes.startsUsing({ id: '70B8', source: 'Rhalgr' }),
      netRegexFr: NetRegexes.startsUsing({ id: '70B8', source: 'Rhalgr' }),
      netRegexJa: NetRegexes.startsUsing({ id: '70B8', source: 'ラールガー' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Aglaia Rhalgr Broken World',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '70A6', source: 'Rhalgr', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '70A6', source: 'Rhalgr', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '70A6', source: 'Rhalgr', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '70A6', source: 'ラールガー', capture: false }),
      run: (data) => data.rhalgrBrokenWorldActive = true,
    },
    {
      id: 'Aglaia Rhalgr Broken World Cleanup',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '70A6', source: 'Rhalgr', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '70A6', source: 'Rhalgr', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '70A6', source: 'Rhalgr', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '70A6', source: 'ラールガー', capture: false }),
      delaySeconds: 20,
      run: (data) => data.rhalgrBrokenWorldActive = false,
    },
    {
      id: 'Aglaia Rhalgr Hand of the Destroyer Blue',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '70A9', source: 'Rhalgr', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '70A9', source: 'Rhalgr', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '70A9', source: 'Rhalgr', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '70A9', source: 'ラールガー', capture: false }),
      alertText: (data, _matches, output) => {
        if (data.rhalgrBrokenWorldActive)
          return output.redSideAway!();
        return output.redSide!();
      },
      outputStrings: {
        redSide: {
          en: 'Be on red half',
          de: 'Geh zur roten Seite',
        },
        redSideAway: {
          en: 'Be on red half (away from portal)',
          de: 'Geh zur roten Seite (weg vom Portal)',
        },
      },
    },
    {
      id: 'Aglaia Rhalgr Hand of the Destroyer Red Initial',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '70A8', source: 'Rhalgr', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '70A8', source: 'Rhalgr', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '70A8', source: 'Rhalgr', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '70A8', source: 'ラールガー', capture: false }),
      alertText: (_data, _matches, output) => output.blueSide!(),
      outputStrings: {
        blueSide: {
          en: 'Be on blue half',
          de: 'Geh zur blauen Seite',
        },
      },
    },
    {
      id: 'Aglaia Rhalgr Hand of the Destroyer Red',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '70AC', source: 'Rhalgr', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '70AC', source: 'Rhalgr', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '70AC', source: 'Rhalgr', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '70AC', source: 'ラールガー', capture: false }),
      alertText: (_data, _matches, output) => output.nearRed!(),
      outputStrings: {
        nearRed: {
          en: 'Go near red portal',
          de: 'Geh zum roten Portal',
        },
      },
    },
    {
      id: 'Aglaia Lions Double Immolation',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7177', source: ['Lion of Aglaia', 'Lioness of Aglaia'], capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '7177', source: ['Aglaia-Löwe', 'Aglaia-Löwin'], capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '7177', source: ['Lion D\'Aglaé', 'Lionne D\'Aglaé'], capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '7177', source: ['アグライア・ライオン', 'アグライア・ライオネス'], capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Aglaia Lions Slash and Burn Lioness First',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '71D2', source: 'Lioness of Aglaia', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '71D2', source: 'Aglaia-Löwin', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '71D2', source: 'Lionne D\'Aglaé', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '71D2', source: 'アグライア・ライオネス', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Under Lioness => Out',
          de: 'Unter Löwin => Raus',
        },
      },
    },
    {
      id: 'Aglaia Lions Slash and Burn Lion First',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '71D0', source: 'Lion of Aglaia', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '71D0', source: 'Aglaia-Löwe', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '71D0', source: 'Lion D\'Aglaé', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '71D0', source: 'アグライア・ライオン', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Out => Under Lioness',
          de: 'Raus => Unter Löwin',
        },
      },
    },
    {
      id: 'Aglaia Azeyma Warden\'s Prominence',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '70A0', source: 'Azeyma', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '70A0', source: 'Azeyma', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '70A0', source: 'Azeyma', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '70A0', source: 'アーゼマ', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Aglaia Azeyma Solar Wings',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7081', source: 'Azeyma', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '7081', source: 'Azeyma', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '7081', source: 'Azeyma', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '7081', source: 'アーゼマ', capture: false }),
      response: Responses.goFrontBack(),
    },
    {
      id: 'Aglaia Azeyma Warden\'s Warmth Collect',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '709F', source: 'Azeyma' }),
      netRegexDe: NetRegexes.startsUsing({ id: '709F', source: 'Azeyma' }),
      netRegexFr: NetRegexes.startsUsing({ id: '709F', source: 'Azeyma' }),
      netRegexJa: NetRegexes.startsUsing({ id: '709F', source: 'アーゼマ' }),
      run: (data, matches) => data.tankbusters.push(matches.target),
    },
    {
      id: 'Aglaia Azeyma Warden\'s Warmth',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '709F', source: 'Azeyma', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '709F', source: 'Azeyma', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '709F', source: 'Azeyma', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '709F', source: 'アーゼマ', capture: false }),
      delaySeconds: 0.3,
      suppressSeconds: 1,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          tankCleaveOnYou: Outputs.tankCleaveOnYou,
          tankCleaves: {
            en: 'Avoid Tank Cleaves',
            de: 'Weiche Tank-Cleaves aus',
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
      netRegexDe: NetRegexes.startsUsing({ id: '709C', source: 'Azeyma', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '709C', source: 'Azeyma', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '709C', source: 'アーゼマ', capture: false }),
      response: Responses.getBehind(),
    },
    {
      id: 'Aglaia Azeyma Sublime Sunset',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7098', source: 'Azeyma', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '7098', source: 'Azeyma', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '7098', source: 'Azeyma', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '7098', source: 'アーゼマ', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Away from Orb',
          de: 'Weg vom Orb',
        },
      },
    },
    {
      id: 'Aglaia Nald\'thal As Above, So Below',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['70E8', '70E9'], source: 'Nald\'thal', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['70E8', '70E9'], source: 'Nald\'Thal', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['70E8', '70E9'], source: 'Nald\'Thal', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['70E8', '70E9'], source: 'ナルザル', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Aglaia Nald\'thal Heat Above, Flames Below Orange Swap',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '73A4', source: 'Nald\'thal', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '73A4', source: 'Nald\'Thal', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '73A4', source: 'Nald\'Thal', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '73A4', source: 'ナルザル', capture: false }),
      durationSeconds: 6,
      response: Responses.getOut(),
    },
    {
      id: 'Aglaia Nald\'thal Heat Above, Flames Below Blue',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '73A5', source: 'Nald\'thal', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '73A5', source: 'Nald\'Thal', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '73A5', source: 'Nald\'Thal', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '73A5', source: 'ナルザル', capture: false }),
      durationSeconds: 6,
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
          de: 'Protean verteilen auf DIR',
        },
      },
    },
    {
      id: 'Aglaia Nald\'thal Heaven\'s Trial',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '711F', source: 'Nald\'thal' }),
      netRegexDe: NetRegexes.startsUsing({ id: '711F', source: 'Nald\'Thal' }),
      netRegexFr: NetRegexes.startsUsing({ id: '711F', source: 'Nald\'Thal' }),
      netRegexJa: NetRegexes.startsUsing({ id: '711F', source: 'ナルザル' }),
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
      netRegexDe: NetRegexes.startsUsing({ id: '711B', source: 'Nald\'Thal' }),
      netRegexFr: NetRegexes.startsUsing({ id: '711B', source: 'Nald\'Thal' }),
      netRegexJa: NetRegexes.startsUsing({ id: '711B', source: 'ナルザル' }),
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
      netRegexDe: NetRegexes.startsUsing({ id: '73AA', source: 'Nald\'Thal', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '73AA', source: 'Nald\'Thal', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '73AA', source: 'ナルザル', capture: false }),
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          dropMarkerOutside: {
            en: 'Drop marker outside',
            de: 'Marker draußen ablegen',
          },
          ignoreLineStack: {
            en: 'Ignore fake stack',
            de: 'Falsches Sammeln ignorieren',
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
      netRegexDe: NetRegexes.startsUsing({ id: '73AB', source: 'Nald\'Thal', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '73AB', source: 'Nald\'Thal', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '73AB', source: 'ナルザル', capture: false }),
      infoText: (data, _matches, output) => {
        if (data.naldArrowMarker.includes(data.me))
          return output.ignoreArrow!();
      },
      outputStrings: {
        ignoreArrow: {
          en: 'Ignore fake arrow',
          de: 'Falschen Pfeil ignorieren',
        },
      },
    },
    {
      id: 'Aglaia Nald\'thal Far-flung Fire',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '73AC', source: 'Nald' }),
      netRegexDe: NetRegexes.ability({ id: '73AC', source: 'Nald' }),
      netRegexFr: NetRegexes.ability({ id: '73AC', source: 'Nald' }),
      netRegexJa: NetRegexes.ability({ id: '73AC', source: 'ナル神' }),
      alertText: (data, matches, output) => {
        // If this ability happens, the stack is real.
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
      id: 'Aglaia Nald\'thal Once Above, Ever Below Orange',
      type: 'StartsUsing',
      // 73BF = starts blue, swaps orange
      // 741D = starts orange, stays orange
      netRegex: NetRegexes.startsUsing({ id: ['73BF', '741D'], source: 'Nald\'thal', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['73BF', '741D'], source: 'Nald\'Thal', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['73BF', '741D'], source: 'Nald\'Thal', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['73BF', '741D'], source: 'ナルザル', capture: false }),
      durationSeconds: 6,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Go to Blue Quadrant',
          de: 'Geh zum blauen Quadrant',
        },
      },
    },
    {
      id: 'Aglaia Nald\'thal Once Above, Ever Below Blue',
      type: 'StartsUsing',
      // 73C0 = starts blue, stays blue
      // 741C = starts orange, swaps blue
      netRegex: NetRegexes.startsUsing({ id: ['73C0', '741C'], source: 'Nald\'thal', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['73C0', '741C'], source: 'Nald\'Thal', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['73C0', '741C'], source: 'Nald\'Thal', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['73C0', '741C'], source: 'ナルザル', capture: false }),
      durationSeconds: 6,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Go to Orange Quadrant',
          de: 'Geh zum orangenen Quadrant',
        },
      },
    },
    {
      id: 'Aglaia Nald\'thal Hell of Fire Front',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '72B7', source: 'Nald\'thal', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '72B7', source: 'Nald\'Thal', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '72B7', source: 'Nald\'Thal', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '72B7', source: 'ナルザル', capture: false }),
      response: Responses.getBehind(),
    },
    {
      id: 'Aglaia Nald\'thal Hell of Fire Back',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '72B9', source: 'Nald\'thal', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '72B9', source: 'Nald\'Thal', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '72B9', source: 'Nald\'Thal', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '72B9', source: 'ナルザル', capture: false }),
      alertText: (_data, _matches, output) => output.goFront!(),
      outputStrings: {
        goFront: Outputs.goFront,
      },
    },
    {
      id: 'Aglaia Nald\'thal Soul Vessel Magmatic Spell',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '712D', source: 'Soul Vessel', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '712D', source: 'Seelengefäß', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '712D', source: 'réceptacle d\'âme', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '712D', source: '魂の器', capture: false }),
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Stack groups',
          de: 'Sammel Gruppen',
        },
      },
    },
    {
      id: 'Aglaia Nald\'thal Stygian Tenet Collect',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '711D', source: 'Nald\'thal' }),
      netRegexDe: NetRegexes.startsUsing({ id: '711D', source: 'Nald\'Thal' }),
      netRegexFr: NetRegexes.startsUsing({ id: '711D', source: 'Nald\'Thal' }),
      netRegexJa: NetRegexes.startsUsing({ id: '711D', source: 'ナルザル' }),
      run: (data, matches) => data.tankbusters.push(matches.target),
    },
    {
      id: 'Aglaia Nald\'thal Stygian Tenet',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '711D', source: 'Nald\'thal', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '711D', source: 'Nald\'Thal', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '711D', source: 'Nald\'Thal', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '711D', source: 'ナルザル', capture: false }),
      delaySeconds: 0.3,
      suppressSeconds: 1,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          tankCleaveOnYou: Outputs.tankCleaveOnYou,
          tankCleaves: {
            en: 'Avoid Tank Cleaves',
            de: 'Weiche den Tank-Cleaves aus',
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
      // 73CC = start orange, swap blue
      netRegex: NetRegexes.startsUsing({ id: ['73CA', '73CC'], source: 'Nald\'thal', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['73CA', '73CC'], source: 'Nald\'Thal', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['73CA', '73CC'], source: 'Nald\'Thal', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['73CA', '73CC'], source: 'ナルザル', capture: false }),
      durationSeconds: 6,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          dropMarkerOutside: {
            en: 'Under => Drop marker outside',
            de: 'Unter ihn => Marker drausen ablegen',
          },
          ignoreLineStack: {
            en: 'Under (ignore fake stack)',
            de: 'Unter ihn (falsches Sammeln ignorieren)',
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
      netRegexDe: NetRegexes.startsUsing({ id: ['73CB', '74FB'], source: 'Nald\'Thal', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['73CB', '74FB'], source: 'Nald\'Thal', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['73CB', '74FB'], source: 'ナルザル', capture: false }),
      durationSeconds: 6,
      // Use info here to not conflict with the 73AC line stack trigger.
      infoText: (data, _matches, output) => {
        if (data.naldArrowMarker.includes(data.me))
          return output.ignoreArrow!();
        return output.out!();
      },
      outputStrings: {
        ignoreArrow: {
          en: 'Out (ignore fake arrow)',
          de: 'Raus (falschen Pfeil ignorieren)',
        },
        out: Outputs.out,
      },
    },
    {
      id: 'Aglaia Nald\'thal Hells\' Trial',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7121', source: 'Nald\'thal', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '7121', source: 'Nald\'Thal', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '7121', source: 'Nald\'Thal', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '7121', source: 'ナルザル', capture: false }),
      response: Responses.aoe(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'missingTranslations': true,
      'replaceSync': {
        'Azeyma': 'Azeyma',
        'Azeyma\'s Heat': 'Azeymas Spiegelung',
        'Byregot': 'Byregot',
        'Byregot\'s Avatar': 'Byregots Abbild',
        'Ingenuity\'s Foothold': 'Schrein des Handwerks',
        'Lightning Orb': 'Blitzkugel',
        'Lion of Aglaia': 'Aglaia-Löwe',
        'Lioness of Aglaia': 'Aglaia-Löwin',
        'Nald': 'Nald',
        'Nald\'thal': 'Nald\'Thal',
        'Prodigal Sun': 'Schemensonne',
        'Rhalgr': 'Rhalgr',
        'Rhalgr\'s Emissary': 'Rhalgrs Abgesandt(?:e|er|es|en)',
        'Soul Vessel': 'Seelengefäß',
        'Sunstorm': 'Azeymas Aura',
        'Thal': 'Thal',
        'The Circle Of Inquiry': 'Schrein des Urteils',
        'The Endless City': 'Stadt der Herrlichkeit',
        'The Monument To Destruction': 'Schrein des Kometen',
        'The Path': 'Pfad der Führung',
        'The Twin Halls': 'Schrein der Zwei',
      },
      'replaceText': {
        'Advent of the Eighth': 'Lehre des Kometen',
        'As Above, So Below': 'Flamme von Leben und Tod',
        'Balance': 'Seelenabrechnung',
        'Bolts from the Blue': 'Himmlischer Blitz',
        'Bronze Work': 'Donnerstab',
        'Builder\'s Build': 'Byregots Erbauung',
        'Byregot\'s Spire': 'Byregots Turm',
        'Byregot\'s Strike': 'Byregots Schlag',
        'Byregot\'s Ward': 'Byregots Schutz',
        'Cloud to Ground': 'Sturmkonzentration',
        'Dancing Flame': 'Tanzende Flamme',
        'Deepest Pit': 'Feierlicher Todeshauch',
        'Destructive Bolt': 'Zerstörerischer Blitzschlag',
        'Destructive Charge': 'Zerstörerschock',
        'Destructive Static': 'Zerstörerhieb',
        'Destructive Strike': 'Zerstörerhieb',
        'Double Immolation': 'Lehre der Zwillingsflamme',
        'Equal Weight': 'Seelenplus',
        'Fan Flames': 'Fächerflammen',
        'Far Above, Deep Below': 'Leben und Tod: Entfesselung',
        'Far-flung Fire': 'Befreite Lebensflamme',
        'Fired Up I(?!I)': '1. Substanz des Feuers',
        'Fired Up II(?!I)': '2. Substanz des Feuers',
        'Fired Up III': '3. Substanz des Feuers',
        'Fleeting Spark': 'Feurige Falle',
        'Fortune\'s Flux': 'Quelle des Feuers',
        'Golden Tenet': 'Nald-Feuer',
        'Hand of the Destroyer': 'Vernichtungsschlag des Zerstörers',
        'Haute Air': 'Heiße Luft',
        'Hearth Above, Flight Below': 'Leben und Tod: Lohenbogen',
        'Heat Above, Flames Below': 'Leben und Tod: Ringfeuer',
        'Heavens\' Trial': 'Würde des Flammenhimmels',
        'Hell of Fire': 'Infernowelle',
        'Hell of Lightning': 'Donnerkugel',
        'Hells\' Trial': 'Würde der Flammenhölle',
        'Levinforge': 'Gewitterschein',
        'Lightning Reign': 'Göttliches Donnertosen',
        'Lightning Storm': 'Blitzsturm',
        'Magmatic Spell': 'Erschaffener Fels',
        'Noble Dawn': 'Urteil der Sonne',
        'Once Above, Ever Below': 'Leben und Tod: Raubfeuer',
        'Ordeal of Thunder': 'Prüfender Donner',
        'Peal of the Hammer': 'Byregots Hammer',
        'Radiant Finish': 'Letzter Fächertanz',
        'Radiant Rhythm': 'Fächertanz',
        'Rejuvenating Spark': 'Feuer des Lebens',
        'Reproduce': 'Teilung des Selbsts',
        'Rhalgr\'s Beacon': 'Fallender Stern',
        'Roaring Blaze': 'Lehre der Tosenden Flamme',
        'Seventh Passage': 'Kreis des Flammenhimmels',
        'Shock': 'Entladung',
        'Slash and Burn': 'Feuerkralle',
        'Smelting': 'Erschütterungswelle',
        'Solar Fans': 'Fächerschneide',
        'Solar Flair': 'Sonnenstaub',
        'Solar Fold': 'Sonnenschlag',
        'Solar Wings': 'Sonnenflügel',
        'Soul\'s Measure': 'Urteil der Waage',
        'Spinning Slash': 'Wirbeltatze',
        'Stygian Tenet': 'Thal-Feuer',
        'Sublime Sunset': 'Göttliches Abendrot',
        'Sun\'s Shine': 'Trugbild der Hitze',
        '(?<! )Sunset': 'Abendrot',
        'The Builder\'s Forge': 'Byregots Schöpfung',
        'Tipped Scales': 'Göttliche Rechenschaft',
        'Trial by Fire': 'Lehre des Brausenden Feuers',
        'Twingaze': 'Hitzewallung',
        'Warden\'s Prominence': 'Wunder der Aufseherin',
        'Warden\'s Warmth': 'Götterfeuer',
        'Wayward Soul': 'Leid der Toten',
        'Wildfire Ward': 'Lauffeuer',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Azeyma': 'Azeyma',
        'Azeyma\'s Heat': 'mirage d\'Azeyma',
        'Byregot': 'Byregot',
        'Byregot\'s Avatar': 'double de Byregot',
        'Ingenuity\'s Foothold': 'Gloire de l\'ingéniosité',
        'Lightning Orb': 'orbe de foudre',
        'Lion of Aglaia': 'lion d\'Aglaé',
        'Lioness of Aglaia': 'lionne d\'Aglaé',
        'Nald': 'Nald',
        'Nald\'thal': 'Nald\'Thal',
        'Prodigal Sun': 'soleil illusoire',
        'Rhalgr': 'Rhalgr',
        'Rhalgr\'s Emissary': 'émissaire de Rhalgr',
        'Soul Vessel': 'réceptacle d\'âme',
        'Sunstorm': 'aura solaire',
        'Thal': 'Thal',
        'The Circle Of Inquiry': 'Cercle de la justice',
        'The Endless City': 'Cité des splendeurs',
        'The Monument To Destruction': 'Monument à la destruction',
        'The Path': 'Corridor céleste',
        'The Twin Halls': 'Palais jumeau',
      },
      'replaceText': {
        'Advent of the Eighth': 'Anneaux astraux',
        'As Above, So Below': 'Flamme de vie, flamme de mort',
        '(?<! )Balance': 'Jugement pananimique',
        'Bolts from the Blue': 'Éclairs célestes',
        'Bronze Work': 'Bâton grondant',
        'Builder\'s Build': 'Besogne de Byregot',
        'Byregot\'s Spire': 'Tour de Byregot',
        'Byregot\'s Strike': 'Foreuse de Byregot',
        'Byregot\'s Ward': 'Aire de l\'Artisan',
        'Cloud to Ground': 'Attaque fulminante',
        'Dancing Flame': 'Flamme dansante',
        'Deepest Pit': 'Explosion étendue de mort',
        'Destructive Bolt': 'Foudre destructrice',
        'Destructive Charge': 'Charges destructrices',
        'Destructive Static': 'Taillade destructrice',
        'Destructive Strike': 'Taillade destructrice',
        'Double Immolation': 'Immolation double',
        'Equal Weight': 'Supplément d\'âme',
        'Fan Flames': 'Flammes d\'éventail',
        'Far Above, Deep Below': 'Vie ou mort : déchaînement',
        'Far-flung Fire': 'Déflagration distante de vie',
        'Fired Up I(?!I)': 'Accumulation d\'avoirs I',
        'Fired Up II(?!I)': 'Accumulation d\'avoirs II',
        'Fired Up III': 'Accumulation d\'avoirs III',
        'Fleeting Spark': 'Retourné rayonnant',
        'Fortune\'s Flux': 'Flux de la fortune',
        'Golden Tenet': 'Dogme doré',
        'Hand of the Destroyer': 'Main du Destructeur',
        'Haute Air': 'Éventement éminent',
        'Hearth Above, Flight Below': 'Vie ou mort : arc ardent',
        'Heat Above, Flames Below': 'Vie ou mort : cercle de feu',
        'Heavens\' Trial': 'Jugement céleste',
        'Hell of Fire': 'Enfer de feu',
        'Hell of Lightning': 'Enfer électrique',
        'Hells\' Trial': 'Jugement infernal',
        'Levinforge': 'Fulguration funeste',
        'Lightning Reign': 'Règne foudroyant',
        'Lightning Storm': 'Pluie d\'éclairs',
        'Magmatic Spell': 'Fracas magmatique',
        'Noble Dawn': 'Aurore altière',
        'Once Above, Ever Below': 'Vie ou mort : calcination',
        'Ordeal of Thunder': 'Épreuve électrique',
        'Peal of the Hammer': 'Marteau divin',
        'Radiant Finish': 'Final enflammé',
        'Radiant Rhythm': 'Rythme enflammé',
        'Rejuvenating Spark': 'Étincelle de vie',
        'Reproduce': 'Reproduction',
        'Rhalgr\'s Beacon': 'Comète d\'annihilation',
        'Roaring Blaze': 'Brasier rugissant',
        'Seventh Passage': 'Ciel de feu',
        'Shock': 'Décharge électrostatique',
        'Slash and Burn': 'Griffes torrides',
        'Smelting': 'Secousse déferlante',
        'Solar Fans': 'Éventails solaires',
        'Solar Flair': 'Poussière solaire',
        'Solar Fold': 'Repli solaire',
        'Solar Wings': 'Ailes solaires',
        'Soul\'s Measure': 'Épreuve de la balance',
        'Spinning Slash': 'Griffes tourbillonnantes',
        'Stygian Tenet': 'Dogme destructif',
        'Sublime Sunset': 'Crépuscule cérémoniel',
        'Sun\'s Shine': 'Mirages de chaleur',
        '(?<! )Sunset': 'Crépuscule',
        'The Builder\'s Forge': 'Grand œuvre de l\'Artisan',
        'Tipped Scales': 'Verdict suprême',
        'Trial by Fire': 'Épreuve du feu écarlate',
        'Twingaze': 'Œillade odieuse',
        'Warden\'s Prominence': 'Grandeur de la Gardienne',
        'Warden\'s Warmth': 'Étreinte effervescente',
        'Wayward Soul': 'Anéantissement animique',
        'Wildfire Ward': 'Enclave embrasée',
      },
    },
  ],
};

export default triggerSet;
