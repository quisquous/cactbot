import { UnreachableCode } from '../../../../resources/not_reached';
import AnalyzedEncounter from '../data/AnalyzedEncounter';
import RaidEmulator from '../data/RaidEmulator';
import EmulatorCommon, { querySelectorSafe } from '../EmulatorCommon';

import Tooltip from './Tooltip';

export default class ProgressBar {
  $progressBarTooltip: Tooltip;
  $progressBarCurrent: HTMLElement;
  $progressBarDuration: HTMLElement;
  $progress: HTMLElement;
  $progressBar: HTMLElement;
  $engageIndicator: HTMLElement;

  constructor(emulator: RaidEmulator) {
    const progBarContainer = querySelectorSafe(document, '.encounterProgressBar');
    this.$progressBarTooltip = new Tooltip(progBarContainer, 'bottom', '', false);

    this.$progressBarCurrent = querySelectorSafe(document, '.current-timestamp');
    this.$progressBarDuration = querySelectorSafe(document, '.duration-timestamp');
    this.$progress = querySelectorSafe(document, '.encounterProgressBar');
    this.$progressBar = querySelectorSafe(document, '.encounterProgressBar .progress-bar');
    this.$engageIndicator = querySelectorSafe(document, '.progressBarRow .engageIndicator');
    new Tooltip(this.$engageIndicator, 'bottom', 'Fight Begins');
    this.$progress.addEventListener('mousemove', (e) => {
      if (emulator.currentEncounter) {
        const target = e.currentTarget;
        if (!(target instanceof HTMLElement))
          throw new UnreachableCode();
        const percent = e.offsetX / target.offsetWidth;
        const time = Math.floor(emulator.currentEncounter.encounter.duration * percent) -
          emulator.currentEncounter.encounter.initialOffset;
        this.$progressBarTooltip.offset.x = e.offsetX - (target.offsetWidth / 2);
        this.$progressBarTooltip.setText(EmulatorCommon.timeToString(time));
        this.$progressBarTooltip.show();
      }
    });
    this.$progress.addEventListener('click', (e) => {
      if (emulator.currentEncounter) {
        const target = e.currentTarget;
        if (!(target instanceof HTMLElement))
          throw new UnreachableCode();
        const percent = e.offsetX / target.offsetWidth;
        const time = Math.floor(emulator.currentEncounter.encounter.duration * percent);
        void emulator.seek(time);
      }
    });
    emulator.on('currentEncounterChanged', (encounter: AnalyzedEncounter) => {
      this.$progressBarCurrent.textContent = EmulatorCommon.timeToString(0, false);
      this.$progressBarDuration.textContent = EmulatorCommon.timeToString(
          encounter.encounter.duration - encounter.encounter.initialOffset,
          false);
      this.$progressBar.style.width = '0%';
      this.$progressBar.setAttribute('ariaValueMax', encounter.encounter.duration.toString());
      if (isNaN(encounter.encounter.initialOffset)) {
        this.$engageIndicator.classList.add('d-none');
      } else {
        const initialPercent =
          (encounter.encounter.initialOffset / encounter.encounter.duration) * 100;
        this.$engageIndicator.classList.remove('d-none');
        this.$engageIndicator.style.left = `${initialPercent}%`;
      }
    });
    emulator.on('tick', (currentLogTime) => {
      const curEnc = emulator.currentEncounter;
      if (!curEnc)
        throw new UnreachableCode();
      const currentOffset = currentLogTime - curEnc.encounter.startTimestamp;
      const progPercent = (currentOffset / curEnc.encounter.duration) * 100;
      const progValue = currentLogTime - curEnc.encounter.initialTimestamp;
      this.$progressBarCurrent.textContent = EmulatorCommon.timeToString(progValue, false);
      this.$progressBar.style.width = `${progPercent}%`;
    });
    const $play = querySelectorSafe(document, '.progressBarRow button.play');
    const $pause = querySelectorSafe(document, '.progressBarRow button.pause');
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
