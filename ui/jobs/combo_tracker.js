import { kAbility, kComboBreakers } from './constants';

export default class ComboTracker {
  constructor(comboBreakers, callback) {
    this.comboTimer = undefined;
    this.comboBreakers = comboBreakers;
    // A tree of nodes.
    this.startMap = {}; // {} key => { id: str, next: { key => node } }
    // Called for each combo/comboBreakers skill
    // when cast in combo, skill => its HexID
    // when cast out of combo/cast comboBreakers, skill => null
    this.callback = callback;
    this.considerNext = this.startMap;
    this.isFinalSkill = false;
  }

  AddCombo(skillList) {
    let nextMap = this.startMap;

    for (let i = 0; i < skillList.length; ++i) {
      const id = skillList[i];
      const node = {
        id: id,
        next: {},
      };

      if (!nextMap[id])
        nextMap[id] = node;

      nextMap = nextMap[id].next;
    }
  }

  HandleAbility(id) {
    if (id in this.considerNext) {
      this.StateTransition(id, this.considerNext[id]);
      return;
    }

    if (this.comboBreakers.includes(id))
      this.AbortCombo(id);
  }

  StateTransition(id, nextState) {
    window.clearTimeout(this.comboTimer);
    this.comboTimer = undefined;

    this.isFinalSkill = nextState && Object.keys(nextState.next).length === 0;
    if (nextState === null || this.isFinalSkill) {
      this.considerNext = this.startMap;
    } else {
      this.considerNext = Object.assign({}, this.startMap, nextState.next);
      const kComboDelayMs = 15000;
      this.comboTimer = window.setTimeout(() => {
        this.AbortCombo(null);
      }, kComboDelayMs);
    }

    // If not aborting, then this is a valid combo skill.
    if (nextState !== null)
      this.callback(id);
    else
      this.callback(null);
  }

  AbortCombo(id) {
    this.StateTransition(id, null);
  }

  static setup(callback) {
    const comboTracker = new ComboTracker(kComboBreakers, callback);
    // PLD
    comboTracker.AddCombo([
      kAbility.FastBlade,
      kAbility.RiotBlade,
      kAbility.GoringBlade,
    ]);
    // WAR
    comboTracker.AddCombo([
      kAbility.HeavySwing,
      kAbility.Maim,
      kAbility.StormsEye,
    ]);
    comboTracker.AddCombo([
      kAbility.HeavySwing,
      kAbility.Maim,
      kAbility.StormsPath,
    ]);
    comboTracker.AddCombo([
      kAbility.Overpower,
      kAbility.MythrilTempest,
    ]);
    // DRK
    comboTracker.AddCombo([
      kAbility.HardSlash,
      kAbility.SyphonStrike,
      kAbility.Souleater,
    ]);
    comboTracker.AddCombo([
      kAbility.Unleash,
      kAbility.StalwartSoul,
    ]);
    // GNB
    comboTracker.AddCombo([
      kAbility.KeenEdge,
      kAbility.BrutalShell,
      kAbility.SolidBarrel,
    ]);
    comboTracker.AddCombo([
      kAbility.DemonSlice,
      kAbility.DemonSlaughter,
    ]);
    // DRG
    comboTracker.AddCombo([
      kAbility.TrueThrust,
      kAbility.Disembowel,
      kAbility.ChaosThrust,
    ]);
    comboTracker.AddCombo([
      kAbility.RaidenThrust,
      kAbility.Disembowel,
      kAbility.ChaosThrust,
    ]);
    // NIN
    comboTracker.AddCombo([
      kAbility.SpinningEdge,
      kAbility.GustSlash,
      kAbility.AeolianEdge,
    ]);
    comboTracker.AddCombo([
      kAbility.SpinningEdge,
      kAbility.GustSlash,
      kAbility.ArmorCrush,
    ]);
    comboTracker.AddCombo([
      kAbility.DeathBlossom,
      kAbility.HakkeMujinsatsu,
    ]);
    // SAM
    comboTracker.AddCombo([
      kAbility.Hakaze,
      kAbility.Jinpu,
      kAbility.Gekko,
    ]);
    comboTracker.AddCombo([
      kAbility.Hakaze,
      kAbility.Shifu,
      kAbility.Kasha,
    ]);
    comboTracker.AddCombo([
      kAbility.Hakaze,
      kAbility.Yukikaze,
    ]);
    comboTracker.AddCombo([
      kAbility.Fuga,
      kAbility.Mangetsu,
    ]);
    comboTracker.AddCombo([
      kAbility.Fuga,
      kAbility.Oka,
    ]);
    // MCH
    comboTracker.AddCombo([
      kAbility.SplitShot,
      kAbility.SlugShot,
      kAbility.CleanShot,
    ]);
    comboTracker.AddCombo([
      kAbility.HeatedSplitShot,
      kAbility.SlugShot,
      kAbility.CleanShot,
    ]);
    comboTracker.AddCombo([
      kAbility.HeatedSplitShot,
      kAbility.HeatedSlugShot,
      kAbility.CleanShot,
    ]);
    comboTracker.AddCombo([
      kAbility.HeatedSplitShot,
      kAbility.HeatedSlugShot,
      kAbility.HeatedCleanShot,
    ]);
    // DNC
    comboTracker.AddCombo([
      kAbility.Cascade,
      kAbility.Fountain,
    ]);
    comboTracker.AddCombo([
      kAbility.Windmill,
      kAbility.Bladeshower,
    ]);
    return comboTracker;
  }
}
