import Tooltip from './Tooltip';
import EmulatorCommon from '../EmulatorCommon';

export default class ProgressBar {
  constructor(emulator) {
    this.$progressBarTooltip = new Tooltip('.encounterProgressBar', 'bottom', '', false);
    this.$progressBarCurrent = document.querySelector('.current-timestamp');
    this.$progressBarDuration = document.querySelector('.duration-timestamp');
    this.$progress = document.querySelector('.encounterProgressBar');
    this.$progressBar = document.querySelector('.encounterProgressBar .progress-bar');
    this.$engageIndicator = document.querySelector('.progressBarRow .engageIndicator');
    new Tooltip(this.$engageIndicator, 'bottom', 'Fight Begins');
    this.emulator = emulator;
    this.$progress.addEventListener('mousemove', (e) => {
      if (this.emulator.currentEncounter) {
        const percent = e.offsetX / e.currentTarget.offsetWidth;
        const time = Math.floor(this.emulator.currentEncounter.encounter.duration * percent) -
          this.emulator.currentEncounter.encounter.initialOffset;
        this.$progressBarTooltip.offset.x = e.offsetX - (e.currentTarget.offsetWidth / 2);
        this.$progressBarTooltip.setText(EmulatorCommon.timeToString(time));
        this.$progressBarTooltip.show();
      }
    });
    this.$progress.addEventListener('click', (e) => {
      if (this.emulator.currentEncounter) {
        const percent = e.offsetX / e.currentTarget.offsetWidth;
        const time = Math.floor(this.emulator.currentEncounter.encounter.duration * percent);
        this.emulator.seek(time);
      }
    });
    emulator.on('currentEncounterChanged', (encounter) => {
      this.$progressBarCurrent.textContent = EmulatorCommon.timeToString(0, false);
      this.$progressBarDuration.textContent = EmulatorCommon.timeToString(
          encounter.encounter.duration - encounter.encounter.initialOffset,
          false);
      this.$progressBar.style.width = '0%';
      this.$progressBar.setAttribute('ariaValueMax', encounter.encounter.duration);
      if (isNaN(encounter.encounter.initialOffset)) {
        this.$engageIndicator.classList.add('d-none');
      } else {
        const initialPercent =
          (encounter.encounter.initialOffset / emulator.currentEncounter.encounter.duration) * 100;
        this.$engageIndicator.classList.remove('d-none');
        this.$engageIndicator.style.left = initialPercent + '%';
      }
    });
    emulator.on('tick', (currentLogTime) => {
      const currentOffset = currentLogTime - emulator.currentEncounter.encounter.startTimestamp;
      const progPercent = (currentOffset / emulator.currentEncounter.encounter.duration) * 100;
      const progValue = currentLogTime - emulator.currentEncounter.encounter.engageAt;
      this.$progressBarCurrent.textContent = EmulatorCommon.timeToString(progValue, false);
      this.$progressBar.setAttribute('ariaValueNow', progValue);
      this.$progressBar.style.width = progPercent + '%';
    });
    const $play = document.querySelector('.progressBarRow button.play');
    const $pause = document.querySelector('.progressBarRow button.pause');
    $play.addEventListener('click', () => {
      if (this.emulator.play()) {
        $play.classList.add('d-none');
        $pause.classList.remove('d-none');
      }
    });
    $pause.addEventListener('click', () => {
      if (this.emulator.pause()) {
        $pause.classList.add('d-none');
        $play.classList.remove('d-none');
      }
    });
  }
}
