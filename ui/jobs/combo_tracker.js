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
}
