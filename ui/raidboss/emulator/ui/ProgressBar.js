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
    this.emulator = emulator;
    this.$progress.on('mousemove', function (e) {
      if (me.emulator.currentEncounter) {
        let percent = e.offsetX / this.offsetWidth;
        let time = Math.floor(me.emulator.currentEncounter.encounter.duration * percent);
        me.$progressBarTooltip.data('bs.tooltip').config.offset = e.offsetX - (this.offsetWidth / 2);
        me.$progressBarTooltip.data('bs.tooltip').config.title = timeToString(time);
        me.$progressBarTooltip.tooltip('show');
      }
    }).on('click', function (e) {
      let percent = e.offsetX / this.offsetWidth;
      let time = Math.floor(me.emulator.currentEncounter.encounter.duration * percent);
      me.emulator.Seek(time);
    });
    emulator.on('CurrentEncounterChanged', function (encounter) {
      me.$progressBarCurrent.text(timeToString(0, false));
      me.$progressBarDuration.text(timeToString(encounter.encounter.duration, false));
      me.$progressBar.attr('aria-valuemax', encounter.encounter.duration);
    });
    emulator.on('Tick', function (timestampOffset) {
      let progPercent = (timestampOffset / emulator.currentEncounter.encounter.duration) * 100;
      me.$progressBarCurrent.text(timeToString(timestampOffset, false));
      me.$progressBar.attr('aria-valuenow', timestampOffset);
      me.$progressBar.css('width', progPercent + '%');
    });
    let $play = $('.progressBarRow button.play');
    let $pause = $('.progressBarRow button.pause');
    $play.on('click', (e) => {
      if (me.emulator.Play()) {
        $play.addClass('d-none');
        $pause.removeClass('d-none');
      }
    });
    $('.progressBarRow button.pause').on('click', (e) => {
      if (me.emulator.Pause()) {
        $pause.addClass('d-none');
        $play.removeClass('d-none');
      }
    });
  }
}
