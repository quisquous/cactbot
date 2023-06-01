import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { NetMatches } from '../../../../../types/net_matches';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  decOffset?: number;
  dividingWingsTethers: string[];
  dividingWingsStacks: string[];
  dividingWingsEntangling: string[];
  meltdownSpreads: string[];
  daemonicBondsTime?: number;
  bondsSecondMechanic?: 'stack' | 'partners' | 'spread';
}

const bossNameUnicode = 'Pand\u00e6monium';

const headmarkers = {
  // vfx/lockon/eff/com_share6_5s0c.avfx
  soulGrasp: '01D3',
  // vfx/lockon/eff/m0834trg_b0c.avfx
  webShare: '01AC',
  // vfx/lockon/eff/m0834trg_d0c.avfx
  webEntangling: '01AE',
  // vfx/lockon/eff/m0834trg_a0c.avfx
  webSpread: '01AB',
  // vfx/lockon/eff/lockon5_t0h.avfx
  spread: '0017',
} as const;

const firstHeadmarker = parseInt(headmarkers.soulGrasp, 16);

const getHeadmarkerId = (data: Data, matches: NetMatches['HeadMarker']) => {
  if (data.decOffset === undefined)
    data.decOffset = parseInt(matches.id, 16) - firstHeadmarker;
  return (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase().padStart(4, '0');
};

const triggerSet: TriggerSet<Data> = {
  id: 'AnabaseiosTheTenthCircleSavage',
  zoneId: ZoneId.AnabaseiosTheTenthCircleSavage,
  timelineFile: 'p10s.txt',
  initData: () => {
    return {
      dividingWingsTethers: [],
      dividingWingsStacks: [],
      dividingWingsEntangling: [],
      meltdownSpreads: [],
    };
  },
  triggers: [
    {
      id: 'P10S Headmarker Tracker',
      type: 'HeadMarker',
      netRegex: {},
      condition: (data) => data.decOffset === undefined,
      // Unconditionally set the first headmarker here so that future triggers are conditional.
      run: (data, matches) => getHeadmarkerId(data, matches),
    },
    {
      id: 'P10S Ultima',
      type: 'StartsUsing',
      netRegex: { id: '82A5', source: bossNameUnicode, capture: false },
      response: Responses.bleedAoe(),
    },
    {
      id: 'P10S Soul Grasp',
      type: 'HeadMarker',
      netRegex: {},
      condition: (data, matches) => getHeadmarkerId(data, matches) === headmarkers.soulGrasp,
      response: Responses.sharedTankBuster(),
    },
    {
      id: 'P10S Pandaemon\'s Holy',
      type: 'StartsUsing',
      netRegex: { id: '82A6', source: bossNameUnicode, capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'P10S Circles of Pandaemonium',
      type: 'StartsUsing',
      netRegex: { id: '82A7', source: bossNameUnicode, capture: false },
      response: Responses.getIn(),
    },
    {
      id: 'P10S Wicked Step',
      type: 'StartsUsing',
      netRegex: { id: '8299', source: bossNameUnicode, capture: false },
      alertText: (data, _matches, output) => {
        if (data.party.isTank(data.me))
          return output.soak!();
      },
      infoText: (data, _matches, output) => {
        if (!data.party.isTank(data.me))
          return output.avoid!();
      },
      outputStrings: {
        soak: {
          en: 'Soak tower',
          de: 'Türme nehmen',
          fr: 'Prenez une tour',
        },
        avoid: {
          en: 'Avoid towers',
          de: 'Türme vermeiden',
          fr: 'Évitez les tours',
        },
      },
    },
    {
      id: 'P10S Dividing Wings Cleanup',
      type: 'StartsUsing',
      netRegex: { id: '8297', source: bossNameUnicode, capture: false },
      run: (data) => {
        data.dividingWingsTethers = [];
        data.dividingWingsStacks = [];
        data.dividingWingsEntangling = [];
      },
    },
    {
      id: 'P10S Dividing Wings Tether',
      type: 'Tether',
      netRegex: { id: '00F2', source: bossNameUnicode },
      alarmText: (data, matches, output) => {
        data.dividingWingsTethers.push(matches.target);
        if (data.me === matches.target)
          return output.text!();
      },
      outputStrings: {
        text: {
          en: 'Point Tether Away',
        },
      },
    },
    {
      id: 'P10S Dividing Wings Tether Break',
      type: 'Ability',
      netRegex: { id: '827F', source: bossNameUnicode, capture: false },
      condition: (data) => data.dividingWingsTethers.includes(data.me),
      suppressSeconds: 5,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Break Tethers',
        },
      },
    },
    {
      id: 'P10S Dividing Wings Stack You',
      type: 'HeadMarker',
      netRegex: {},
      condition: (data, matches) => getHeadmarkerId(data, matches) === headmarkers.webShare,
      alertText: (data, matches, output) => {
        data.dividingWingsStacks.push(matches.target);
        if (data.me === matches.target)
          return output.stackOnYou!();
      },
      outputStrings: {
        stackOnYou: Outputs.stackOnYou,
      },
    },
    {
      id: 'P10S Dividing Wings Stacks',
      type: 'HeadMarker',
      netRegex: {},
      condition: (data, matches) => getHeadmarkerId(data, matches) === headmarkers.webShare,
      delaySeconds: 0.5,
      suppressSeconds: 5,
      infoText: (data, _matches, output) => {
        // Need to check these conditions after the delay as they are ordered:
        // tethers, stack(s), (optional) entangling.
        if (data.dividingWingsTethers.includes(data.me))
          return;
        if (data.dividingWingsStacks.includes(data.me))
          return;
        if (data.dividingWingsEntangling.includes(data.me))
          return;
        return output.text!();
      },
      outputStrings: {
        text: {
          en: 'Stack',
        },
      },
    },
    {
      id: 'P10S Entangling Web',
      type: 'HeadMarker',
      netRegex: {},
      condition: (data, matches) => {
        if (data.me !== matches.target)
          return false;
        return getHeadmarkerId(data, matches) === headmarkers.webEntangling;
      },
      alertText: (_data, _matches, output) => output.text!(),
      // This will happen for non-dividing entangling web headmarkers,
      // but will get cleaned up in time for the next dividing wings.
      run: (data, matches) => data.dividingWingsEntangling.push(matches.target),
      outputStrings: {
        text: {
          // TODO: should we say "on posts" or "on back wall" based on count?
          en: 'Overlap Webs',
        },
      },
    },
    {
      id: 'P10S Pandaemoniac Pillars',
      type: 'StartsUsing',
      netRegex: { id: '8280', source: bossNameUnicode, capture: false },
      response: Responses.getTowers('info'),
    },
    {
      id: 'P10S Silkspit',
      type: 'StartsUsing',
      netRegex: { id: '827C', source: bossNameUnicode, capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Spread for Webs',
        },
      },
    },
    {
      id: 'P10S Pandaemoniac Meltdown Spread',
      // These come out before the meltdown cast below.
      type: 'HeadMarker',
      netRegex: {},
      condition: (data, matches) => getHeadmarkerId(data, matches) === headmarkers.spread,
      alertText: (data, matches, output) => {
        data.meltdownSpreads.push(matches.target);
        if (data.me === matches.target)
          return output.spread!();
      },
      outputStrings: {
        spread: Outputs.spread,
      },
    },
    {
      id: 'P10S Pandaemoniac Meltdown Stack',
      type: 'StartsUsing',
      netRegex: { id: '829D', source: bossNameUnicode, capture: false },
      infoText: (data, _matches, output) => {
        if (!data.meltdownSpreads.includes(data.me))
          return output.text!();
      },
      run: (data) => data.meltdownSpreads = [],
      outputStrings: {
        text: {
          en: 'Line stack',
          de: 'Linien-Stack',
          fr: 'Packez-vous en ligne',
          ja: 'スタック',
          cn: '直线分摊',
          ko: '직선 쉐어',
        },
      },
    },
    {
      // Daemonic Bonds starts casting
      // Then all of the Daemonic Bonds DDE (spread) effects go out
      // Then 4x DDF or 2x E70 effects go out.
      id: 'P10S Pandaemoniac Bonds Cleanup',
      type: 'StartsUsing',
      netRegex: { id: '82A1', source: bossNameUnicode, capture: false },
      run: (data) => {
        delete data.daemonicBondsTime;
        delete data.bondsSecondMechanic;
      },
    },
    {
      id: 'P10S Daemonic Bonds Timer',
      type: 'GainsEffect',
      netRegex: { effectId: 'DDE' },
      condition: (data) => data.daemonicBondsTime === undefined,
      run: (data, matches) => data.daemonicBondsTime = parseFloat(matches.duration),
    },
    {
      id: 'P10S Dueodaemoniac Bonds Future',
      type: 'GainsEffect',
      netRegex: { effectId: 'DDF' },
      durationSeconds: 5,
      suppressSeconds: 5,
      infoText: (data, matches, output) => {
        if (data.daemonicBondsTime === undefined) {
          console.error(`Daemonic Bonds: ${matches.effectId} effect before DDE?`);
          return;
        }

        const duration = parseFloat(matches.duration);
        if (duration > data.daemonicBondsTime) {
          data.bondsSecondMechanic = 'partners';
          return output.spreadThenPartners!();
        }

        data.bondsSecondMechanic = 'spread';
        return output.partnersThenSpread!();
      },
      outputStrings: {
        spreadThenPartners: {
          en: '(spread => partners, for later)',
        },
        partnersThenSpread: {
          en: '(partners => spread, for later)',
        },
      },
    },
    {
      id: 'P10S TetraDaemoniac Bonds Future',
      type: 'GainsEffect',
      netRegex: { effectId: 'E70' },
      durationSeconds: 5,
      suppressSeconds: 5,
      infoText: (data, matches, output) => {
        if (data.daemonicBondsTime === undefined) {
          console.error(`Daemonic Bonds: ${matches.effectId} effect before DDE?`);
          return;
        }

        const duration = parseFloat(matches.duration);
        if (duration > data.daemonicBondsTime) {
          data.bondsSecondMechanic = 'stack';
          return output.spreadThenStack!();
        }

        data.bondsSecondMechanic = 'spread';
        return output.stackThenSpread!();
      },
      outputStrings: {
        spreadThenStack: {
          en: '(spread => role stack, for later)',
        },
        stackThenSpread: {
          en: '(role stack => spread, for later)',
        },
      },
    },
    {
      id: 'P10S Daemonic Bonds First',
      type: 'GainsEffect',
      netRegex: { effectId: 'DDE' },
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 5,
      suppressSeconds: 5,
      alertText: (data, _matches, output) => {
        // If this is undefined, then this is the second mechanic and will be called out elsewhere.
        // We can't make this a `condition` as this is not known until after some delay.
        if (data.bondsSecondMechanic === 'stack')
          return output.spreadThenStack!();
        if (data.bondsSecondMechanic === 'partners')
          return output.spreadThenPartners!();
      },
      outputStrings: {
        spreadThenStack: {
          en: 'Spread => Role Stack',
        },
        spreadThenPartners: {
          en: 'Spread => Partners',
        },
      },
    },
    {
      id: 'P10S Dueodaemoniac Bonds First',
      type: 'GainsEffect',
      netRegex: { effectId: 'DDF' },
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 5,
      suppressSeconds: 5,
      alertText: (data, _matches, output) => {
        if (data.bondsSecondMechanic === 'stack')
          return output.partnersThenStack!();
        if (data.bondsSecondMechanic === 'spread')
          return output.partnersThenSpread!();
      },
      outputStrings: {
        partnersThenStack: {
          en: 'Partners => Role Stack',
        },
        partnersThenSpread: {
          en: 'Partners => Spread',
        },
      },
    },
    {
      id: 'P10S TetraDaemoniac Bonds First',
      type: 'GainsEffect',
      netRegex: { effectId: 'E70' },
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 5,
      suppressSeconds: 5,
      alertText: (data, _matches, output) => {
        if (data.bondsSecondMechanic === 'partners')
          return output.stackThenPartners!();
        if (data.bondsSecondMechanic === 'spread')
          return output.stackThenSpread!();
      },
      outputStrings: {
        stackThenPartners: {
          en: 'Role Stack => Partners',
        },
        stackThenSpread: {
          en: 'Role Stack => Spread',
        },
      },
    },
    {
      id: 'P10S Daemonic Bonds Followup',
      type: 'Ability',
      // 82A2 = Daemonic Bonds (spread)
      // 82A3 = Dueodaemoniac Bonds (partners)
      // 87AE = TetraDaemoniac Bonds (4 person stacks)
      netRegex: { id: ['82A2', '82A3', '87AE'], source: bossNameUnicode, capture: false },
      condition: (data) => data.bondsSecondMechanic !== undefined,
      suppressSeconds: 5,
      infoText: (data, _matches, output) => {
        if (data.bondsSecondMechanic === 'spread')
          return output.spread!();
        if (data.bondsSecondMechanic === 'partners')
          return output.partners!();
        if (data.bondsSecondMechanic === 'stack')
          return output.stack!();
      },
      run: (data) => delete data.bondsSecondMechanic,
      outputStrings: {
        spread: Outputs.spread,
        partners: {
          en: 'Partners',
        },
        stack: {
          en: 'Role Stack',
        },
      },
    },
  ],
};

export default triggerSet;
