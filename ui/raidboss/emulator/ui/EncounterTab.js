class EncounterTab extends EventBus {
  /** 
   * @type Persistor
   */
  persistor = null;

  /**
   * @type jQuery
   */
  $zoneColumn;

  /**
   * @type jQuery
   */
  $dateColumn;

  /**
   * @type jQuery
   */
  $encounterColumn;

  /**
   * @type jQuery
   */
  $infoColumn;

  /**
   * @type string
   */
  CurrentZone;

  /**
   * @type string
   */
  CurrentDate;

  /**
   * @type int
   */
  CurrentEncounter;

  constructor(persistor) {
    super();
    this.persistor = persistor;
    // @TODO: This is really lazy, might want to *not* refresh the entire tab when changing
    this.$zoneColumn = $('#encountersTab .zoneList').on('click', '.selectorRow', (ev) => {
      let t = $(ev.currentTarget);
      t.parent().children('.selectorRow.selected').removeClass('selected');
      t.addClass('selected');
      this.CurrentZone = t.text();
      me.RefreshUI();
    });
    this.$dateColumn = $('#encountersTab .dateList').on('click', '.selectorRow', (ev) => {
      let t = $(ev.currentTarget);
      t.parent().children('.selectorRow.selected').removeClass('selected');
      t.addClass('selected');
      this.CurrentDate = t.text();
      me.RefreshUI();
    });
    this.$encounterColumn = $('#encountersTab .encounterList').on('click', '.selectorRow', (ev) => {
      let t = $(ev.currentTarget);
      t.parent().children('.selectorRow.selected').removeClass('selected');
      t.addClass('selected');
      this.CurrentEncounter = t.data('index');
      me.RefreshUI();
    });

    // @TODO: Probably a better way to do this...
    this.$infoColumn = $('#encountersTab .encounterInfo').on('click', '.encounterLoad', (ev) => {
      me.dispatch('load', this.Encounters[this.CurrentZone][this.CurrentDate][this.CurrentEncounter].Encounter.ID);
    }).on('click', '.encounterParse', (ev) => {
      me.dispatch('parse', this.Encounters[this.CurrentZone][this.CurrentDate][this.CurrentEncounter].Encounter.ID);
    }).on('click', '.encounterPrune', (ev) => {
      me.dispatch('prune', this.Encounters[this.CurrentZone][this.CurrentDate][this.CurrentEncounter].Encounter.ID);
    }).on('click', '.encounterDelete', (ev) => {
      me.dispatch('delete', this.Encounters[this.CurrentZone][this.CurrentDate][this.CurrentEncounter].Encounter.ID);
    });

    let me = this;
  }

  refresh() {
    this.Encounters = {};
    this.persistor.ListEncounters().then((encounters) => {
      for (let i in encounters) {
        let enc = encounters[i];
        let zone = encounters[i].Zone;
        let encDate = timeToDateString(enc.Start);
        let encTime = timeToTimeString(enc.Start);
        let encDuration = msToDuration(enc.Duration);
        this.Encounters[zone] = this.Encounters[zone] || {};
        this.Encounters[zone][encDate] = this.Encounters[zone][encDate] || [];
        this.Encounters[zone][encDate].push({
          Start: encTime,
          Name: enc.Name,
          Duration: encDuration,
          Encounter: enc,
        });
      }

      this.RefreshUI();
    });
  }

  RefreshUI() {
    this.RefreshZones();
    this.RefreshDates();
    this.RefreshEncounters();
    this.RefreshInfo();
  }

  RefreshZones() {
    this.$zoneColumn.empty();

    let clear = true;

    for (let i in this.Encounters) {
      let $row = $('<div class="selectorRow border-bottom border-dark">' + i + '</div>');
      if (i === this.CurrentZone) {
        clear = false;
        $row.addClass('selected');
      }
      this.$zoneColumn.append($row);
    }

    if (clear)
      this.CurrentZone = undefined;
  }

  RefreshDates() {
    this.$dateColumn.empty();

    let clear = true;

    if (this.CurrentZone !== undefined) {
      for (let i in this.Encounters[this.CurrentZone]) {
        let $row = $('<div class="selectorRow border-bottom border-dark">' + i + '</div>');
        if (i === this.CurrentDate) {
          clear = false;
          $row.addClass('selected');
        }
        this.$dateColumn.append($row);
      }
    }

    if (clear)
      this.CurrentDate = undefined;
  }

  RefreshEncounters() {
    this.$encounterColumn.empty();

    let clear = true;

    if (this.CurrentZone !== undefined && this.CurrentDate !== undefined) {
      for (let i in this.Encounters[this.CurrentZone][this.CurrentDate]) {
        let enc = this.Encounters[this.CurrentZone][this.CurrentDate][i];
        let $enc = $('<div class="selectorRow border-bottom border-dark"></div>');
        $enc.data('index', i);
        $enc.append($('<div class="encounterStart d-inline">[' + enc.Start + ']</div>'));
        $enc.append($('<div class="encounterStart d-inline mx-2">' + enc.Name + '</div>'));
        $enc.append($('<div class="encounterStart d-inline">(' + enc.Duration + ')</div>'));
        if (i === this.CurrentEncounter) {
          clear = false;
          $enc.addClass('selected');
        }
        this.$encounterColumn.append($enc);
      }
    }

    if (clear)
      this.CurrentEncounter = undefined;
  }

  RefreshInfo() {
    this.$infoColumn.empty();

    if (this.CurrentZone !== undefined && this.CurrentDate !== undefined && this.CurrentEncounter !== undefined) {
      /**
       * @type PersistorEncounter
       */
      let enc = this.Encounters[this.CurrentZone][this.CurrentDate][this.CurrentEncounter].Encounter;

      let pullAt = 'N/A';
      if(!isNaN(enc.Offset)) {
        pullAt = timeToString(enc.Offset, false);
      }

      let $info = $('<div class="encounterInfo"></div>');
      $info.append($('<div class="encounterLoad btn btn-primary pull-right mb-1">Load Encounter</div>'));
      $info.append($('<div class="encounterParse btn btn-primary pull-right mb-1">Reparse Encounter</div>'));
      $info.append($('<div class="encounterPrune btn btn-primary pull-right mb-1">Prune Encounter</div>'));
      $info.append($('<div class="encounterDelete btn btn-primary pull-right mb-1">Delete Encounter</div>'));
      $info.append($('<div class="encounterZone">Zone: ' + enc.Zone + '</div>'));
      $info.append($('<div class="encounterStart">Start: ' + dateTimeToString(enc.Start) + '</div>'));
      $info.append($('<div class="encounterDuration">Duration: ' + timeToString(enc.Duration, false) + '</div>'));
      $info.append($('<div class="encounterOffset">Pull At: ' + pullAt + '</div>'));
      $info.append($('<div class="encounterName">Name: ' + enc.Name + '</div>'));
      $info.append($('<div class="encounterStartStatus">Start Status: ' + enc.StartStatus + '</div>'));
      $info.append($('<div class="encounterEndStatus">End Status: ' + enc.EndStatus + '</div>'));

      this.$infoColumn.append($info);
    }
  }
}