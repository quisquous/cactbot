import DTFuncs from '../../../../resources/datetime';
import { UnreachableCode } from '../../../../resources/not_reached';
import AnalyzedEncounter from '../data/AnalyzedEncounter';
import RaidEmulator from '../data/RaidEmulator';
import { querySelectorSafe } from '../EmulatorCommon';

import Tooltip from './Tooltip';

export default class ProgressBar {
  $progressBarTooltip: Tooltip;
  $progressBarCurrent: HTMLElement;
  $progressBarDuration: HTMLElement;
  $progress: HTMLElement;
  $progressBar: HTMLElement;

  constructor(emulator: RaidEmulator) {
    const progBarContainer = querySelectorSafe(document, '.encounterProgressBar');
    this.$progressBarTooltip = new Tooltip(progBarContainer, 'bottom', '', false);

    this.$progressBarCurrent = querySelectorSafe(document, '.current-timestamp');
    this.$progressBarDuration = querySelectorSafe(document, '.duration-timestamp');
    this.$progress = querySelectorSafe(document, '.encounterProgressBar');
    this.$progressBar = querySelectorSafe(document, '.encounterProgressBar .progress-bar');
    this.$progress.addEventListener('mousemove', (e) => {
      if (emulator.currentEncounter) {
        const target = e.currentTarget;
        if (!(target instanceof HTMLElement))
          throw new UnreachableCode();
        const percent = e.offsetX / target.offsetWidth;
        const trimmedDuration = emulator.currentEncounter.encounter.duration -
          emulator.currentEncounter.encounter.initialOffset;
        const time = Math.floor(trimmedDuration * percent);
        this.$progressBarTooltip.offset.x = e.offsetX - (target.offsetWidth / 2);
        this.$progressBarTooltip.setText(DTFuncs.timeToString(time));
        this.$progressBarTooltip.show();
      }
    });
    this.$progress.addEventListener('click', (e) => {
      if (emulator.currentEncounter) {
        const target = e.currentTarget;
        if (!(target instanceof HTMLElement))
          throw new UnreachableCode();
        const percent = e.offsetX / target.offsetWidth;
        const trimmedDuration = emulator.currentEncounter.encounter.duration -
          emulator.currentEncounter.encounter.initialOffset;
        const time = Math.floor(trimmedDuration * percent);
        void emulator.seek(emulator.currentEncounter.encounter.initialOffset + time);
      }
    });
    emulator.on('currentEncounterChanged', (encounter: AnalyzedEncounter) => {
      const trimmedDuration = encounter.encounter.duration - encounter.encounter.initialOffset;
      this.$progressBarCurrent.textContent = DTFuncs.timeToString(0, false);
      this.$progressBarDuration.textContent = DTFuncs.timeToString(trimmedDuration, false);
      this.$progressBar.style.width = '0%';
      this.$progressBar.setAttribute('ariaValueMax', trimmedDuration.toString());
    });
    emulator.on('tick', (currentLogTime) => {
      const curEnc = emulator.currentEncounter;
      if (!curEnc)
        throw new UnreachableCode();
      const currentOffset = currentLogTime - curEnc.encounter.initialTimestamp;
      const trimmedDuration = curEnc.encounter.duration - curEnc.encounter.initialOffset;
      const progPercent = (currentOffset / trimmedDuration) * 100;
      const progValue = currentLogTime - curEnc.encounter.initialTimestamp;
      this.$progressBarCurrent.textContent = DTFuncs.timeToString(progValue, false);
      this.$progressBar.style.width = `${progPercent}%`;
    });
    const $play = querySelectorSafe(document, '.progress-bar-row button.play');
    const $pause = querySelectorSafe(document, '.progress-bar-row button.pause');
    $play.addEventListener('click', () => {
      if (emulator.play()) {
        $play.classList.add('d-none');
        $pause.classList.remove('d-none');
      }
    });
    $pause.addEventListener('click', () => {
      if (emulator.pause()) {
        $pause.classList.add('d-none');
        $play.classList.remove('d-none');
      }
    });
  }
}
