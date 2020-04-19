class ProgressBar {
  constructor(emulator) {
    let me = this;
    this.$progressBarTooltip = $('.encounterProgressBar').tooltip({
      animation: false,
      placement: 'bottom',
    });
    this.$progressBarCurrent = $('.current-timestamp');
    this.$progressBarDuration = $('.duration-timestamp');
    this.emulator = emulator;
    $('.encounterProgressBar').on('mousemove', function (e) {
      if (me.emulator.currentEncounter) {
        let percent = e.offsetX / this.offsetWidth;
        let time = Math.floor(me.emulator.currentEncounter.encounter.duration * percent);
        me.$progressBarTooltip.data('bs.tooltip').config.offset = e.offsetX - (this.offsetWidth / 2);
        me.$progressBarTooltip.data('bs.tooltip').config.title = timeToString(time);
        me.$progressBarTooltip.tooltip('show');
      }
    });
    emulator.on('CurrentEncounterChanged', function (encounter) {
      me.$progressBarCurrent.text(timeToString(0, false));
      me.$progressBarDuration.text(timeToString(encounter.encounter.duration, false));
    });
  }
};
