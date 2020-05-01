'use strict';

class EncounterTab extends EventBus {
  constructor(persistor) {
    super();
    this.persistor = persistor;
    let me = this;
    // @TODO: This is really lazy, might want to *not* refresh the entire tab when changing
    this.$zoneColumn = $('#encountersTab .zoneList').on('click', '.selectorRow', (ev) => {
      let t = $(ev.currentTarget);
      t.parent().children('.selectorRow.selected').removeClass('selected');
      t.addClass('selected');
      this.currentZone = t.text();
      me.RefreshUI();
    });
    this.$dateColumn = $('#encountersTab .dateList').on('click', '.selectorRow', (ev) => {
      let t = $(ev.currentTarget);
      t.parent().children('.selectorRow.selected').removeClass('selected');
      t.addClass('selected');
      this.currentDate = t.text();
      me.RefreshUI();
    });
    this.$encounterColumn = $('#encountersTab .encounterList').on('click', '.selectorRow', (ev) => {
      let t = $(ev.currentTarget);
      t.parent().children('.selectorRow.selected').removeClass('selected');
      t.addClass('selected');
      this.currentEncounter = t.data('index');
      me.RefreshUI();
    });

    // @TODO: Probably a better way to do this...
    this.$infoColumn = $('#encountersTab .encounterInfo').on('click', '.encounterLoad', (ev) => {
      me.dispatch('load', this.encounters[this.currentZone][this.currentDate][this.currentEncounter].encounter.id);
    }).on('click', '.encounterParse', (ev) => {
      me.dispatch('parse', this.encounters[this.currentZone][this.currentDate][this.currentEncounter].encounter.id);
    }).on('click', '.encounterPrune', (ev) => {
      me.dispatch('prune', this.encounters[this.currentZone][this.currentDate][this.currentEncounter].encounter.id);
    }).on('click', '.encounterDelete', (ev) => {
      me.dispatch('delete', this.encounters[this.currentZone][this.currentDate][this.currentEncounter].encounter.id);
    });
  }

  refresh() {
    this.encounters = {};
    this.persistor.listEncounters().then((encounters) => {
      for (let i in encounters) {
        let enc = encounters[i];
        let zone = enc.zone;
        let encDate = timeToDateString(enc.start);
        let encTime = timeToTimeString(enc.start);
        let encDuration = msToDuration(enc.duration);
        this.encounters[zone] = this.encounters[zone] || {};
        this.encounters[zone][encDate] = this.encounters[zone][encDate] || [];
        this.encounters[zone][encDate].push({
          start: encTime,
          name: enc.name,
          duration: encDuration,
          encounter: enc,
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

    let zones = new Set(Object.keys(this.encounters));

    for (let zone of [...zones].sort()) {
      let $row = $('<div class="selectorRow border-bottom border-dark">' + zone + '</div>');
      if (zone === this.currentZone) {
        clear = false;
        $row.addClass('selected');
      }
      this.$zoneColumn.append($row);
    }

    if (clear)
      this.currentZone = undefined;
  }

  RefreshDates() {
    this.$dateColumn.empty();

    let clear = true;

    if (this.currentZone !== undefined) {
      let dates = new Set(Object.keys(this.encounters[this.currentZone]));
      for (let date of [...dates].sort()) {
        let $row = $('<div class="selectorRow border-bottom border-dark">' + date + '</div>');
        if (date === this.currentDate) {
          clear = false;
          $row.addClass('selected');
        }
        this.$dateColumn.append($row);
      }
    }

    if (clear)
      this.currentDate = undefined;
  }

  RefreshEncounters() {
    this.$encounterColumn.empty();

    let clear = true;

    if (this.currentZone !== undefined && this.currentDate !== undefined) {
      let sortedEncounters = this.encounters[this.currentZone][this.currentDate].sort((l, r) => {
        return l.start.localeCompare(r.start);
      });
      for (let i in sortedEncounters) {
        let enc = this.encounters[this.currentZone][this.currentDate][i];
        let $enc = $('<div class="selectorRow border-bottom border-dark"></div>');
        $enc.data('index', i);
        $enc.append($('<div class="encounterStart d-inline">[' + enc.start + ']</div>'));
        $enc.append($('<div class="encounterStart d-inline mx-2">' + enc.name + '</div>'));
        $enc.append($('<div class="encounterStart d-inline">(' + enc.duration + ')</div>'));
        if (i === this.currentEncounter) {
          clear = false;
          $enc.addClass('selected');
        }
        this.$encounterColumn.append($enc);
      }
    }

    if (clear)
      this.currentEncounter = undefined;
  }

  RefreshInfo() {
    this.$infoColumn.empty();

    if (this.currentZone !== undefined && this.currentDate !== undefined &&
      this.currentEncounter !== undefined) {
      /**
       * @type PersistorEncounter
       */
      let enc =
        this.encounters[this.currentZone][this.currentDate][this.currentEncounter].encounter;

      let pullAt = 'N/A';
      if (!isNaN(enc.offset))
        pullAt = timeToString(enc.offset, false);

      let $info = $('<div class="encounterInfo"></div>');
      $info.append($('<div class="encounterLoad btn btn-primary pull-right mb-1">Load Encounter</div>'));
      $info.append($('<div class="encounterParse btn btn-primary pull-right mb-1">Reparse Encounter</div>'));
      $info.append($('<div class="encounterPrune btn btn-primary pull-right mb-1">Prune Encounter</div>'));
      $info.append($('<div class="encounterDelete btn btn-primary pull-right mb-1">Delete Encounter</div>'));
      $info.append($('<div class="encounterZone">Zone: ' + enc.zone + '</div>'));
      $info.append($('<div class="encounterStart">Start: ' + dateTimeToString(enc.start) + '</div>'));
      $info.append($('<div class="encounterDuration">Duration: ' + timeToString(enc.duration, false) + '</div>'));
      $info.append($('<div class="encounterOffset">Pull At: ' + pullAt + '</div>'));
      $info.append($('<div class="encounterName">Name: ' + enc.name + '</div>'));
      $info.append($('<div class="encounterStartStatus">Start Status: ' + enc.startStatus + '</div>'));
      $info.append($('<div class="encounterEndStatus">End Status: ' + enc.endStatus + '</div>'));

      this.$infoColumn.append($info);
    }
  }
}
