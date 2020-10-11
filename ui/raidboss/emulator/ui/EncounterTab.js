'use strict';

class EncounterTab extends EventBus {
  constructor(persistor) {
    super();
    this.persistor = persistor;

    this.$zoneColumn = document.querySelector('#encountersTab .zoneList');
    this.$dateColumn = document.querySelector('#encountersTab .dateList');
    this.$encounterColumn = document.querySelector('#encountersTab .encounterList');
    this.$infoColumn = document.querySelector('#encountersTab .encounterInfo');

    this.$encounterTabRowTemplate = document.querySelector('template.encounterTabRow').content.firstElementChild;
    this.$encounterTabEncounterRowTemplate = document.querySelector('template.encounterTabEncounterRow').content.firstElementChild;
    this.$encounterInfoTemplate = document.querySelector('template.encounterInfo').content.firstElementChild;
  }

  refresh() {
    this.encounters = {};
    this.persistor.listEncounters().then((encounters) => {
      for (let i in encounters) {
        let enc = encounters[i];
        let zone = enc.zoneName;
        let encDate = EmulatorCommon.timeToDateString(enc.start);
        let encTime = EmulatorCommon.timeToTimeString(enc.start);
        let encDuration = EmulatorCommon.msToDuration(enc.duration);
        this.encounters[zone] = this.encounters[zone] || {};
        this.encounters[zone][encDate] = this.encounters[zone][encDate] || [];
        this.encounters[zone][encDate].push({
          start: encTime,
          name: enc.name,
          duration: encDuration,
          encounter: enc,
        });
      }

      this.refreshUI();
    });
  }

  refreshUI() {
    this.refreshZones();
    this.refreshDates();
    this.refreshEncounters();
    this.refreshInfo();
  }

  refreshZones() {
    this.$zoneColumn.innerHTML = '';

    let clear = true;

    let zones = new Set(Object.keys(this.encounters));

    for (let zone of [...zones].sort()) {
      let $row = this.$encounterTabRowTemplate.cloneNode(true);
      $row.innerText = zone;
      if (zone === this.currentZone) {
        clear = false;
        $row.classList.add('selected');
      }
      $row.addEventListener('click', (ev) => {
        let t = ev.currentTarget;
        t.parentElement.querySelectorAll('.selectorRow.selected').forEach((n) => {
          n.classList.remove('selected');
        });
        t.classList.add('selected');
        this.currentZone = t.textContent;
        this.refreshUI();
      });
      this.$zoneColumn.append($row);
    }

    if (clear)
      this.currentZone = undefined;
  }

  refreshDates() {
    this.$dateColumn.innerHTML = '';

    let clear = true;

    if (this.currentZone !== undefined) {
      let dates = new Set(Object.keys(this.encounters[this.currentZone]));
      for (let date of [...dates].sort()) {
        let $row = this.$encounterTabRowTemplate.cloneNode(true);
        $row.innerText = date;
        if (date === this.currentDate) {
          clear = false;
          $row.classList.add('selected');
        }
        $row.addEventListener('click', (ev) => {
          let t = ev.currentTarget;
          t.parentElement.querySelectorAll('.selectorRow.selected').forEach((n) => {
            n.classList.remove('selected');
          });
          t.classList.add('selected');
          this.currentDate = t.textContent;
          this.refreshUI();
        });
        this.$dateColumn.append($row);
      }
    }

    if (clear)
      this.currentDate = undefined;
  }

  refreshEncounters() {
    this.$encounterColumn.innerHTML = '';

    let clear = true;

    if (this.currentZone !== undefined && this.currentDate !== undefined) {
      let sortedEncounters = this.encounters[this.currentZone][this.currentDate].sort((l, r) => {
        return l.start.localeCompare(r.start);
      });
      for (let i in sortedEncounters) {
        let enc = this.encounters[this.currentZone][this.currentDate][i];
        let $row = this.$encounterTabEncounterRowTemplate.cloneNode(true);
        $row.setAttribute('data-index', i);
        if (i === this.currentEncounter) {
          clear = false;
          $row.classList.add('selected');
        }
        $row.querySelector('.encounterStart').innerText = '[' + enc.start + ']';
        $row.querySelector('.encounterName').innerText = enc.name;
        $row.querySelector('.encounterDuration').innerText = '(' + enc.duration + ')';
        $row.addEventListener('click', (ev) => {
          let t = ev.currentTarget;
          t.parentElement.querySelectorAll('.selectorRow.selected').forEach((n) => {
            n.classList.remove('selected');
          });
          t.classList.add('selected');
          this.currentEncounter = t.getAttribute('data-index');
          this.refreshUI();
        });
        this.$encounterColumn.append($row);
      }
    }

    if (clear)
      this.currentEncounter = undefined;
  }

  refreshInfo() {
    this.$infoColumn.innerHTML = '';

    if (this.currentZone !== undefined && this.currentDate !== undefined &&
      this.currentEncounter !== undefined) {
      /**
       * @type PersistorEncounter
       */
      let enc =
        this.encounters[this.currentZone][this.currentDate][this.currentEncounter].encounter;

      let pullAt = 'N/A';
      if (!isNaN(enc.offset))
        pullAt = EmulatorCommon.timeToString(enc.offset, false);

      let $info = this.$encounterInfoTemplate.cloneNode(true);
      $info.querySelector('.encounterLoad').addEventListener('click', () => {
        this.dispatch('load', this.encounters[this.currentZone][this.currentDate][this.currentEncounter].encounter.id);
      });
      $info.querySelector('.encounterParse').addEventListener('click', () => {
        this.dispatch('parse', this.encounters[this.currentZone][this.currentDate][this.currentEncounter].encounter.id);
      });
      $info.querySelector('.encounterPrune').addEventListener('click', () => {
        this.dispatch('prune', this.encounters[this.currentZone][this.currentDate][this.currentEncounter].encounter.id);
      });
      $info.querySelector('.encounterDelete').addEventListener('click', () => {
        this.dispatch('delete', this.encounters[this.currentZone][this.currentDate][this.currentEncounter].encounter.id);
      });
      $info.querySelector('.encounterZone .label').textContent = enc.zoneName;
      $info.querySelector('.encounterStart .label').textContent = EmulatorCommon.dateTimeToString(enc.start);
      $info.querySelector('.encounterDuration .label').textContent = EmulatorCommon.timeToString(enc.duration, false);
      $info.querySelector('.encounterOffset .label').textContent = pullAt;
      $info.querySelector('.encounterName .label').textContent = enc.name;
      $info.querySelector('.encounterStartStatus .label').textContent = enc.startStatus;
      $info.querySelector('.encounterEndStatus .label').textContent = enc.endStatus;

      this.$infoColumn.append($info);
    }
  }
}

if (typeof module !== 'undefined' && module.exports)
  module.exports = EncounterTab;
