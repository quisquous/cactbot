import { kAbility, kComboBreakers } from './constants';

type StartMap = {
  [s: string]: {
    id: string;
    next: StartMap;
  };
};

type ComboCallback = (id?: string) => void;

export default class ComboTracker {
  comboTimer?: number;
  comboBreakers: readonly string[];
  startMap: StartMap;
  callback: ComboCallback;
  considerNext: StartMap;
  isFinalSkill: boolean;

  constructor(comboBreakers: readonly string[], callback: ComboCallback) {
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

  AddCombo(skillList: string[]): void {
    let nextMap: StartMap = this.startMap;

    skillList.forEach((id) => {
      const node = {
        id: id,
        next: {},
      };

      let nextEntry = nextMap[id];
      if (!nextEntry)
        nextEntry = nextMap[id] = node;
      nextMap = nextEntry.next;
    });
  }

  HandleAbility(id: string): void {
    if (id in this.considerNext) {
      this.StateTransition(id, this.considerNext[id]);
      return;
    }

    if (this.comboBreakers.includes(id))
      this.AbortCombo(id);
  }

  StateTransition(id?: string, nextState?: StartMap[string]): void {
    window.clearTimeout(this.comboTimer);
    this.comboTimer = undefined;

    this.isFinalSkill = (nextState && Object.keys(nextState.next).length === 0) ?? false;
    if (!nextState || this.isFinalSkill) {
      this.considerNext = this.startMap;
    } else {
      this.considerNext = Object.assign({}, this.startMap, nextState?.next);
      const kComboDelayMs = 15000;
      this.comboTimer = window.setTimeout(() => {
        this.AbortCombo();
      }, kComboDelayMs);
    }

    // If not aborting, then this is a valid combo skill.
    if (nextState)
      this.callback(id);
    else
      this.callback();
  }

  AbortCombo(id?: string): void {
    this.StateTransition(id);
  }

  static setup(callback: ComboCallback): ComboTracker {
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
