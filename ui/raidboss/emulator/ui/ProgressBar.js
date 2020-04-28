'use strict';

class ProgressBar {
  constructor(emulator) {
    let me = this;
    this.$progressBarTooltip = $('.encounterProgressBar').tooltip({
      animation: false,
      placement: 'bottom',
    });
    this.$progressBarCurrent = $('.current-timestamp');
    this.$progressBarDuration = $('.duration-timestamp');
    this.$progress = $('.encounterProgressBar');
    this.$progressBar = $('.encounterProgressBar .progress-bar');
    this.$engageIndicator = $('.progressBarRow .engageIndicator');
    this.$engageIndicator.tooltip({
      animation: false,
      placement: 'bottom',
      title: 'Fight Begins',
    });
    this.emulator = emulator;
    this.$progress.on('mousemove', function(e) {
      if (me.emulator.currentEncounter) {
        let percent = e.offsetX / e.currentTarget.offsetWidth;
        let time = Math.floor(me.emulator.currentEncounter.encounter.duration * percent);
        me.$progressBarTooltip.data('bs.tooltip').config.offset = e.offsetX - (e.currentTarget.offsetWidth / 2);
        me.$progressBarTooltip.data('bs.tooltip').config.title = timeToString(time);
        me.$progressBarTooltip.tooltip('show');
      }
    }).on('click', function(e) {
      if (me.emulator.currentEncounter) {
        let percent = e.offsetX / e.currentTarget.offsetWidth;
        let time = Math.floor(me.emulator.currentEncounter.encounter.duration * percent);
        me.emulator.seek(time);
      }
    });
    emulator.on('currentEncounterChanged', function(encounter) {
      me.$progressBarCurrent.text(timeToString(0, false));
      me.$progressBarDuration.text(timeToString(encounter.encounter.duration, false));
      me.$progressBar.css('width', '0%');
      me.$progressBar.attr('aria-valuemax', encounter.encounter.duration);
      if (isNaN(encounter.encounter.initialOffset)) {
        me.$engageIndicator.addClass('d-none');
      } else {
        let initialPercent =
          (encounter.encounter.initialOffset / emulator.currentEncounter.encounter.duration) * 100;
        me.$engageIndicator.removeClass('d-none').css('left', initialPercent + '%');
      }
    });
    emulator.on('tick', function(timestampOffset) {
      let progPercent = (timestampOffset / emulator.currentEncounter.encounter.duration) * 100;
      me.$progressBarCurrent.text(timeToString(timestampOffset, false));
      me.$progressBar.attr('aria-valuenow', timestampOffset);
      me.$progressBar.css('width', progPercent + '%');
    });
    let $play = $('.progressBarRow button.play');
    let $pause = $('.progressBarRow button.pause');
    $play.on('click', (e) => {
      if (me.emulator.play()) {
        $play.addClass('d-none');
        $pause.removeClass('d-none');
      }
    });
    $('.progressBarRow button.pause').on('click', (e) => {
      if (me.emulator.pause()) {
        $pause.addClass('d-none');
        $play.removeClass('d-none');
      }
    });
  }
}
