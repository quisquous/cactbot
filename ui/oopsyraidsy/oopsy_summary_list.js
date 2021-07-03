export class OopsySummaryList {
  constructor(options, container) {
    this.options = options;
    this.container = container;
    this.container.classList.remove('hide');

    this.pullIdx = 0;
    this.zoneName = null;
    this.currentDiv = null;
  }

  GetTimeStr(d) {
    // ISO-8601 or death.
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    const hours = ('00' + d.getHours()).slice(-2);
    const minutes = ('00' + d.getMinutes()).slice(-2);
    return `${d.getFullYear()}-${month}-${day} ${hours}:${minutes}`;
  }

  StartNewSectionIfNeeded() {
    if (this.currentDiv)
      return;

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
  }

  EndSection() {
    this.currentDiv = null;
  }

  AddLine(iconClass, text, time) {
    this.StartNewSectionIfNeeded();

    const rowDiv = document.createElement('div');
    rowDiv.classList.add('mistake-row');
    this.currentDiv.appendChild(rowDiv);

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

  SetInCombat(inCombat) {
    // noop
  }

  StartNewACTCombat() {
    this.EndSection();
    this.StartNewSectionIfNeeded();
  }

  OnChangeZone(e) {
    this.zoneName = e.zoneName;
  }
}
