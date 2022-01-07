import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// Note: Ignoring Toxicosis (BB8) standing in oil puddles in section 1 as it is just flavor.
// Note: Ignoring Necrosis (B95) as it's covered by Wave of Nausea and Necrotic Fluid.

export interface Data extends OopsyData {
  hasDoom?: { [name: string]: boolean };
}

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheDeadEnds,
  damageWarn: {
    'DeadEnds Warped Flesh Amorphic Flail': '6E91', // centered circle (pudding)
    'DeadEnds Warped Flesh Terminal Bloom': '6FFF', // targeted circle (pudding)
    'DeadEnds Warped Flesh Plague Fang': '6E92', // targeted circle (tall
    'DeadEnds Grebuloff Cough Up': '653E', // 3x targeted circles
    'DeadEnds Ambient No Future': '6CC9', // ambient red reticule (before)
    'DeadEnds Airborne Freedom Fighter Air Blast': '6E72', // line aoe
    'DeadEnds Landed Freedom Fighter Photon Burst': '6E71', // targeted circle
    'DeadEnds Peacekeeper Electromagnetic Repellant': '6EC8', // red circle under boss prior to electric circle
    'DeadEnds Peacekeeper Perpetual War Machine Small-Bore Laser': '6EC0', // lasers from triangles, short telegraph
    'DeadEnds Peacekeeper Peacefire': '654E', // rotating large circles
    'DeadEnds Peacekeeper No Future': '6547', // red reticule (during boss)
    'DeadEnds Xenofauna Relevation': '6C47', // targeted black/yellow circle
    'DeadEnds Xenoflora Creeping Hush': '6C45', // frontal blue cleave
    'DeadEnds Ra-la Lamellar Light': '6553', // expanding circles from Prance
    'DeadEnds Ra-la Lifesbreath': '6554', // line aoe
    'DeadEnds Ra-la Loving Embrace 1': '6557', // left/right cleave
    'DeadEnds Ra-la Loving Embrace 2': '6558', // left/right cleave
  },
  damageFail: {
    // All give debuffs that require healer attention, so is a worse mistake.
    'DeadEnds Grebuloff Necrotic Fluid': '653F', // exaflare orbs
    'DeadEnds Grebuloff Wave of Nausea': '6EBB', // donut
    'DeadEnds Ra-la Golden Wings Lamellar Light 1': '6556', // Doom-giving Lifesbreath butterfly lines
    'DeadEnds Ra-la Golden Wings Lamellar Light 2': '655F', // Doom-giving Lifesbreath butterfly lines
  },
  gainsEffectWarn: {
    'DeadEnds Grebuloff Hysteria': '128', // failing dorito stack
    'DeadEnds Peacekeeper Burns': '892', // standing or getting knocked into outside edge
    'DeadEnds Peacekeeper Electrocution': '76B', // standing under Peacekeeper after Electromagnetic Repellant
  },
  shareWarn: {
    'DeadEnds Grebuloff Befoulment': '6544', // spread
    'DeadEnds Peacekeeper Infantry Deterrent': '6EC7', // spread
    'DeadEnds Peacekeeper No Future Spread': '6548', // spread at the end of No Future
    'DeadEnds Ra-la Still Embrace': '655C', // spread
  },
  shareFail: {
    'DeadEnds Peacekeeper Elimination': '654F', // tankbuster laser cleave
  },
  triggers: [
    {
      id: 'DeadEnds Ra-la Doom Gain',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '6E9' }),
      run: (data, matches) => {
        data.hasDoom ??= {};
        data.hasDoom[matches.target] = true;
      },
    },
    {
      id: 'DeadEnds Ra-la Doom Lose',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: '6E9' }),
      run: (data, matches) => {
        data.hasDoom ??= {};
        data.hasDoom[matches.target] = false;
      },
    },
    {
      id: 'DeadEnds Ra-la Doom',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '6E9' }),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 0.5,
      deathReason: (data, matches) => {
        if (!data.hasDoom)
          return;
        if (!data.hasDoom[matches.target])
          return;
        return {
          id: matches.targetId,
          name: matches.target,
          text: matches.effect,
        };
      },
    },
  ],
};

export default triggerSet;
