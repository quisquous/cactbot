import { EventResponses } from '../../types/event';
import { OopsyMistake } from '../../types/oopsy';

import { MistakeObserver } from './mistake_observer';
import { GetFormattedTime, ShortNamify, Translate } from './oopsy_common';
import { OopsyOptions } from './oopsy_options';

export class OopsySummaryList implements MistakeObserver {
  private pullIdx = 0;
  private zoneName?: string;
  private currentDiv: HTMLElement | null = null;
  private baseTime?: number;

  constructor(private options: OopsyOptions, private container: HTMLElement) {
    this.container.classList.remove('hide');
  }

  private GetTimeStr(d: Date): string {
    // ISO-8601 or death.
    const month = `0${d.getMonth() + 1}`.slice(-2);
    const day = `0${d.getDate()}`.slice(-2);
    const hours = `00${d.getHours()}`.slice(-2);
    const minutes = `00${d.getMinutes()}`.slice(-2);
    return `${d.getFullYear()}-${month}-${day} ${hours}:${minutes}`;
  }

  private StartNewSectionIfNeeded(): HTMLElement {
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
    timeDiv.innerText = this.GetTimeStr(new Date());
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

  OnMistakeObj(m: OopsyMistake): void {
    const iconClass = m.type;
    const blame = m.name ?? m.blame;
    const blameText = blame ? ShortNamify(blame, this.options.PlayerNicks) + ': ' : '';
    const text = Translate(this.options.DisplayLanguage, m.text);
    if (!text)
      return;
    this.AddLine(iconClass, `${blameText} ${text}`, GetFormattedTime(this.baseTime, Date.now()));
  }

  AddLine(iconClass: string, text: string, time: string): void {
    const currentSection = this.StartNewSectionIfNeeded();

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
  }

  SetInCombat(_inCombat: boolean): void {
    // noop
  }

  StartNewACTCombat(): void {
    this.EndSection();
    this.StartNewSectionIfNeeded();
    this.baseTime = Date.now();
  }

  OnChangeZone(e: EventResponses['ChangeZone']): void {
    this.zoneName = e.zoneName;
  }
}
