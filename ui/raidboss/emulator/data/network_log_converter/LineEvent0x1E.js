'use strict';

// Lose status effect event
// Extend the gain status event to reduce duplicate code since they're
// the same from a data perspective
class LineEvent0x1E extends LineEvent0x1A {
  constructor(repo, line, parts) {
    super(repo, line, parts);
  }
  convert() {
    let stackCountText = '';
    if (this.stacks > 0 && this.stacks < 20 &&
      LineEvent0x1A.showStackCountFor.includes(this.abilityId))
      stackCountText = ' (' + this.stacks + ')';

    this.convertedLine = this.prefix() +
      this.targetId + ':' + this.targetName +
      ' loses the effect of ' + this.abilityName +
      ' from ' + this.fallbackResolvedTargetName +
      '.' + stackCountText;

    this.properCaseConvertedLine = this.prefix() +
      this.targetId + ':' + EmulatorCommon.properCase(this.targetName) +
      ' loses the effect of ' + this.abilityName +
      ' from ' + EmulatorCommon.properCase(this.fallbackResolvedTargetName) +
      '.' + stackCountText;
  }
}

class LineEvent30 extends LineEvent0x1E {}
