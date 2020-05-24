'use strict';

class ProgressBar {
  constructor(emulator) {
    let me = this;
    this.$progressBarTooltip = jQuery('.encounterProgressBar').tooltip({
      animation: false,
      placement: 'bottom',
    });
    this.$progressBarCurrent = document.querySelector('.current-timestamp');
    this.$progressBarDuration = document.querySelector('.duration-timestamp');
    this.$progress = document.querySelector('.encounterProgressBar');
    this.$progressBar = document.querySelector('.encounterProgressBar .progress-bar');
    this.$engageIndicator = document.querySelector('.progressBarRow .engageIndicator');
    jQuery(this.$engageIndicator).tooltip({
      animation: false,
      placement: 'bottom',
      title: 'Fight Begins',
    });
    this.emulator = emulator;
    this.$progress.onmousemove = (e) => {
      if (me.emulator.currentEncounter) {
        let percent = e.offsetX / e.currentTarget.offsetWidth;
        let time = Math.floor(me.emulator.currentEncounter.encounter.duration * percent);
        me.$progressBarTooltip.data('bs.tooltip').config.offset = e.offsetX - (e.currentTarget.offsetWidth / 2);
        me.$progressBarTooltip.data('bs.tooltip').config.title = timeToString(time);
        me.$progressBarTooltip.tooltip('show');
      }
    };
    this.$progress.onclick = (e) => {
      if (me.emulator.currentEncounter) {
        let percent = e.offsetX / e.currentTarget.offsetWidth;
        let time = Math.floor(me.emulator.currentEncounter.encounter.duration * percent);
        me.emulator.seek(time);
      }
    };
    emulator.on('currentEncounterChanged', (encounter) => {
      me.$progressBarCurrent.textContent = timeToString(0, false);
      me.$progressBarDuration.textContent = timeToString(encounter.encounter.duration, false);
      me.$progressBar.style.width = '0%';
      me.$progressBar.setAttribute('ariaValueMax', encounter.encounter.duration);
      if (isNaN(encounter.encounter.initialOffset)) {
        me.$engageIndicator.classList.add('d-none');
      } else {
        let initialPercent =
          (encounter.encounter.initialOffset / emulator.currentEncounter.encounter.duration) * 100;
        me.$engageIndicator.classList.remove('d-none');
        me.$engageIndicator.style.left = initialPercent + '%';
      }
    });
    emulator.on('tick', (timestampOffset) => {
      let progPercent = (timestampOffset / emulator.currentEncounter.encounter.duration) * 100;
      me.$progressBarCurrent.textContent = timeToString(timestampOffset, false);
      me.$progressBar.setAttribute('ariaValueNow', timestampOffset);
      me.$progressBar.style.width = progPercent + '%';
    });
    let $play = document.querySelector('.progressBarRow button.play');
    let $pause = document.querySelector('.progressBarRow button.pause');
    $play.onclick = () => {
      if (me.emulator.play()) {
        $play.classList.add('d-none');
        $pause.classList.remove('d-none');
      }
    };
    $pause.onclick = () => {
      if (me.emulator.pause()) {
        $pause.classList.add('d-none');
        $play.classList.remove('d-none');
      }
    };
  }
}
