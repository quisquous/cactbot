import { OopsyMistake } from '../../types/oopsy';

import { DeathReport } from './death_report';
import { MistakeObserver, ViewEvent } from './mistake_observer';
import { GetFormattedTime, ShortNamify, Translate } from './oopsy_common';
import { OopsyOptions } from './oopsy_options';

type TableEntry = {
  count: number;
  elem: HTMLElement;
};

type TableRow = {
  nameElem: HTMLElement;
  entries: {
    [type: string]: TableEntry;
  };
};

export class OopsySummaryTable implements MistakeObserver {
  private mistakes?: {
    [name: string]: TableRow;
  };
  // TODO: should this come from options?
  private types: readonly string[] = ['death', 'fail', 'warn', 'pull'];
  private sortCol = 'death';
  private sortAsc = false;

  constructor(private options: OopsyOptions, private table: HTMLElement) {
    // this.table has one column for name, and then one for each of the types.
    document.documentElement.style.setProperty('--table-cols', (this.types.length + 1).toString());
  }

  Reset(): void {
    this.mistakes = undefined;
    while (this.table?.lastChild)
      this.table.removeChild(this.table.lastChild);
  }

  BuildHeaderRow(parent: HTMLElement): void {
    const dummyFirstDiv = document.createElement('div');
    dummyFirstDiv.classList.add('header', 'name');
    parent.appendChild(dummyFirstDiv);
    for (const type of this.types) {
      const typeElem = document.createElement('div');
      typeElem.classList.add('header', 'mistake-icon', type);
      parent.appendChild(typeElem);

      typeElem.addEventListener('click', () => {
        if (this.sortCol === type) {
          this.sortAsc = !this.sortAsc;
          this.SortTable();
          return;
        }
        this.sortAsc = false;
        this.sortCol = type;
        this.SortTable();
      });
    }
  }

  BuildPlayerRow(parent: HTMLElement, name: string): TableRow {
    const nameElem = document.createElement('div');
    nameElem.classList.add('name');
    nameElem.innerText = name;
    parent.appendChild(nameElem);

    const row: TableRow = { nameElem: nameElem, entries: {} };

    for (const type of this.types) {
      const elem = document.createElement('div');
      elem.classList.add('number');
      parent.appendChild(elem);
      row.entries[type] = {
        count: 0,
        elem: elem,
      };
    }

    return row;
  }

  OnMistakeObj(m: OopsyMistake): void {
    const longName = m.name ?? m.blame;
    if (!longName)
      return;
    const name = ShortNamify(longName, this.options.PlayerNicks);

    // Don't create a player row if the summary doesn't care about this type of mistake.
    if (!this.types.includes(m.type))
      return;

    if (!this.mistakes) {
      // Wait until we've seen any mistakes to start the table.
      this.BuildHeaderRow(this.table);
      this.mistakes = {};
    }

    const row = this.mistakes[name] ??= this.BuildPlayerRow(this.table, name);

    const entry = row.entries[m.type];
    if (!entry)
      return;
    entry.count++;
    entry.elem.innerText = entry.count.toString();

    if (m.type === this.sortCol)
      this.SortTable();
  }

  SortTable(): void {
    if (!this.mistakes)
      return;

    // Generate counts.
    const counts: { [name: string]: number } = {};
    for (const [name, row] of Object.entries(this.mistakes)) {
      const entry = row.entries[this.sortCol];
      counts[name] = entry?.count ?? 0;
    }

    // Sort names by counts.
    const names = Object.keys(counts);
    if (this.sortAsc)
      names.sort((a, b) => (counts[a] ?? -1) - (counts[b] ?? -1));
    else
      names.sort((a, b) => (counts[b] ?? -1) - (counts[a] ?? -1));

    // Apply style to sort by ordering.
    for (const [name, row] of Object.entries(this.mistakes)) {
      const idx = names.indexOf(name).toString();
      row.nameElem.style.setProperty('order', idx);
      for (const entry of Object.values(row.entries))
        entry.elem.style.setProperty('order', idx);
    }
  }

  OnEvent(event: ViewEvent): void {
    if (event.type === 'Mistake')
      this.OnMistakeObj(event.mistake);
  }

  OnSyncEvents(events: ViewEvent[]): void {
    this.Reset();
    for (const event of events)
      this.OnEvent(event);
  }
}

export class OopsySummaryList implements MistakeObserver {
  private pullIdx = 0;
  private zoneName?: string;
  private currentDiv: HTMLElement | null = null;
  private baseTime?: number;

  constructor(private options: OopsyOptions, private container: HTMLElement) {
    this.container.classList.remove('hide');
  }

  Reset(): void {
    this.pullIdx = 0;
    this.baseTime = undefined;
    this.currentDiv = null;
    while (this.container?.lastChild)
      this.container.removeChild(this.container.lastChild);
  }

  private GetTimeStr(d: Date): string {
    // ISO-8601 or death.
    const month = `0${d.getMonth() + 1}`.slice(-2);
    const day = `0${d.getDate()}`.slice(-2);
    const hours = `00${d.getHours()}`.slice(-2);
    const minutes = `00${d.getMinutes()}`.slice(-2);
    return `${d.getFullYear()}-${month}-${day} ${hours}:${minutes}`;
  }

  private StartNewSectionIfNeeded(timestamp: number): HTMLElement {
    if (this.currentDiv)
      return this.currentDiv;

    const section = document.createElement('div');
    section.classList.add('section');
    this.container.appendChild(section);

    const headerDiv = document.createElement('div');
    headerDiv.classList.add('section-header');
    section.appendChild(headerDiv);

    // TODO: It would kind of be nice to sync this with pullcounter,
    // but it's not clear how to connect these two.
    this.pullIdx++;

    const pullDiv = document.createElement('div');
    pullDiv.innerText = `Pull ${this.pullIdx}`;
    headerDiv.appendChild(pullDiv);
    const zoneDiv = document.createElement('div');
    if (this.zoneName)
      zoneDiv.innerText = `(${this.zoneName})`;
    headerDiv.appendChild(zoneDiv);
    const timeDiv = document.createElement('div');
    timeDiv.innerText = this.GetTimeStr(new Date(timestamp));
    headerDiv.appendChild(timeDiv);

    const rowContainer = document.createElement('div');
    rowContainer.classList.add('section-rows');
    section.appendChild(rowContainer);

    this.currentDiv = rowContainer;
    return this.currentDiv;
  }

  private EndSection(): void {
    this.currentDiv = null;
  }

  OnMistakeObj(timestamp: number, m: OopsyMistake): void {
    const iconClass = m.type;
    const blame = m.name ?? m.blame;
    const blameText = blame ? `${ShortNamify(blame, this.options.PlayerNicks)}: ` : '';
    const text = Translate(this.options.DisplayLanguage, m.text);
    if (!text)
      return;
    this.AddLine(m, iconClass, `${blameText} ${text}`, GetFormattedTime(this.baseTime, timestamp));
  }

  AddLine(m: OopsyMistake, iconClass: string, text: string, time: string): void {
    const currentSection = this.StartNewSectionIfNeeded(this.baseTime ?? Date.now());

    const rowDiv = document.createElement('div');
    rowDiv.classList.add('mistake-row');
    currentSection.appendChild(rowDiv);

    // TODO: maybe combine this with OopsyLiveList.
    const iconDiv = document.createElement('div');
    iconDiv.classList.add('mistake-icon');
    iconDiv.classList.add(iconClass);
    rowDiv.appendChild(iconDiv);
    const textDiv = document.createElement('div');
    textDiv.classList.add('mistake-text');
    textDiv.innerHTML = text;
    rowDiv.appendChild(textDiv);
    const timeDiv = document.createElement('div');
    timeDiv.classList.add('mistake-time');
    timeDiv.innerHTML = time;
    rowDiv.appendChild(timeDiv);

    if (!m.report)
      return;

    const collapserDiv = document.createElement('div');
    collapserDiv.classList.add('mistake-collapser');
    rowDiv.appendChild(collapserDiv);

    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('death-details');
    currentSection.appendChild(detailsDiv);

    let expanded = false;
    rowDiv.addEventListener('click', () => {
      expanded = !expanded;
      if (expanded) {
        collapserDiv.classList.add('expanded');
        detailsDiv.classList.add('expanded');
      } else {
        collapserDiv.classList.remove('expanded');
        detailsDiv.classList.remove('expanded');
      }
    });

    const report = new DeathReport(m.report);
    for (const event of report.parseReportLines()) {
      const hpElem = document.createElement('div');
      hpElem.classList.add('death-row-hp');
      if (event.currentHp !== undefined)
        hpElem.innerText = event.currentHp.toString();
      detailsDiv.appendChild(hpElem);

      const damageElem = document.createElement('div');
      damageElem.classList.add('death-row-amount');
      if (event.amountClass)
        damageElem.classList.add(event.amountClass);
      if (event.amountStr !== undefined)
        damageElem.innerText = event.amountStr;
      detailsDiv.appendChild(damageElem);

      const iconElem = document.createElement('div');
      iconElem.classList.add('death-row-icon');
      if (event.icon !== undefined)
        iconElem.classList.add('mistake-icon', event.icon);
      detailsDiv.appendChild(iconElem);

      const textElem = document.createElement('div');
      textElem.classList.add('death-row-text');
      if (event.text !== undefined)
        textElem.innerHTML = event.text;
      detailsDiv.appendChild(textElem);

      const timeElem = document.createElement('div');
      timeElem.classList.add('death-row-time');
      timeElem.innerText = event.timestampStr;
      detailsDiv.appendChild(timeElem);
    }
  }

  OnEvent(event: ViewEvent): void {
    if (event.type === 'Mistake')
      this.OnMistakeObj(event.timestamp, event.mistake);
    else if (event.type === 'StartEncounter')
      this.StartEncounter(event.timestamp);
    else if (event.type === 'ChangeZone')
      this.OnChangeZone(event.zoneName);
  }

  OnSyncEvents(events: ViewEvent[]): void {
    this.Reset();
    for (const event of events)
      this.OnEvent(event);
  }

  StartEncounter(timestamp: number): void {
    // TODO: If you reload the summary while in combat, then the OnInCombatChangedEvent
    // for the current combat will send a new StartEncounter (creating a new section)
    // even though the current combat is still ongoing.  We could try to handle this
    // by explicitly having StartEncounter/StopEncounter however this requires a bit
    // of wrangling to get right.  For now, don't reload the summary while in combat.  ;)
    this.EndSection();
    this.baseTime = timestamp;
    this.StartNewSectionIfNeeded(timestamp);
  }

  OnChangeZone(zoneName: string): void {
    this.zoneName = zoneName;
  }
}
