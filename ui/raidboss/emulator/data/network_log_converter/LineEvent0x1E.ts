import { LineEvent0x1A, LineEvent0x1AParts } from './LineEvent0x1A';
import EmulatorCommon from '../../EmulatorCommon';
import { LogRepository } from './LogRepository';

export type LineEvent0x1EParts = LineEvent0x1AParts;

// Lose status effect event
// Extend the gain status event to reduce duplicate code since they're
// the same from a data perspective
export class LineEvent0x1E extends LineEvent0x1A {
  constructor(repo: LogRepository, line: string, public parts: LineEvent0x1EParts) {
    super(repo, line, parts);
  }
  convert(): void {
    let stackCountText = '';
    if (this.stacks > 0 && this.stacks < 20 &&
      LineEvent0x1A.showStackCountFor.includes(this.abilityId))
      stackCountText = ` (${this.stacks})`;

    this.convertedLine = `\
${this.prefix()}${this.targetId}:${this.targetName} \
loses the effect of ${this.abilityName} \
from ${this.fallbackResolvedTargetName} \
for ${this.parts[4]} Seconds.${stackCountText}`;

    this.properCaseConvertedLine = `\
${this.prefix()}${this.targetId}:${EmulatorCommon.properCase(this.targetName) as string} \
loses the effect of ${this.abilityName} \
from ${EmulatorCommon.properCase(this.fallbackResolvedTargetName) as string} \
for ${this.parts[4]} Seconds.${stackCountText}`;
  }
}

export class LineEvent30 extends LineEvent0x1E {}
