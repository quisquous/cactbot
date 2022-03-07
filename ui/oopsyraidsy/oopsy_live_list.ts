import { UnreachableCode } from '../../resources/not_reached';
import { callOverlayHandler } from '../../resources/overlay_plugin_api';
import { OopsyMistake } from '../../types/oopsy';

import { DeathReport } from './death_report';
import { MistakeObserver, ViewEvent } from './mistake_observer';
import { GetFormattedTime, ShortNamify, Translate } from './oopsy_common';
import { OopsyOptions } from './oopsy_options';

const kCopiedMessage = {
  en: 'Copied!',
  de: 'Kopiert!',
  fr: 'Copié !',
  ja: 'コピーした！',
  cn: '已复制！',
  ko: '복사 완료!',
};

const errorMessageEnableACTWS = {
  en: 'Plugins -> OverlayPlugin WSServer -> Stream/Local Overlay -> Start',
  de: 'Plugins -> OverlayPlugin WSServer -> Stream/Local Overlay -> Start',
  fr: 'Plugins -> OverlayPlugin WSServer -> Stream/Local Overlay -> Start',
  cn: 'Plugins -> OverlayPlugin WSServer -> 直播/本地悬浮窗 -> 启用',
  ko: 'Plugins -> OverlayPlugin WSServer -> Stream/Local 오버레이 -> 시작',
};

export class DeathReportLive {
  private reportQueue: DeathReport[] = [];
  private queueTimeoutHandle = 0;

  constructor(private options: OopsyOptions, private reportElem: HTMLElement) {}

  // Briefly shows a death report on screen for a few seconds while in combat.
  // If one is already showing, queues it up to display after.
  // TODO: add some CSS animation here to fade it in/out?
  // TODO: should we show the player's death report with no timer while they are dead?
  public queue(report: DeathReport): void {
    const timeoutMs = this.options.TimeToShowDeathReportMs;
    if (timeoutMs <= 0)
      return;

    const isFirstReport = this.reportQueue.length === 0;
    this.reportQueue.push(report);

    if (isFirstReport) {
      this.setDeathReport(report);
      this.queueTimeoutHandle = window.setTimeout(() => this.handleQueue(), timeoutMs);
    }
  }

  private handleQueue(): void {
    const r = this.reportQueue.shift();
    if (!r) {
      this.cancelQueue();
      this.hide();
      return;
    }

    this.setDeathReport(r);
    this.queueTimeoutHandle = window.setTimeout(
      () => this.handleQueue(),
      this.options.TimeToShowDeathReportMs,
    );
  }

  // Cancels the queue of death reports and shows this one immediately.
  public show(report: DeathReport): void {
    this.cancelQueue();
    this.setDeathReport(report);
  }

  public mouseOver(report: DeathReport, inCombat: boolean): void {
    // While in combat, mouseovers interrupt the queue and temporarily show
    // TODO: should there be no timer and we just show while mouseovering?
    if (inCombat) {
      this.cancelQueue();
      this.hide();
      this.queue(report);
    } else {
      this.show(report);
    }
  }

  public hide(): void {
    while (this.reportElem.lastChild)
      this.reportElem.removeChild(this.reportElem.lastChild);
    this.cancelQueue();
  }

  private cancelQueue(): void {
    this.reportQueue = [];
    window.clearTimeout(this.queueTimeoutHandle);
    this.queueTimeoutHandle = 0;
  }

  private setDeathReport(report: DeathReport) {
    this.hide();

    const container = document.createElement('div');
    container.classList.add('livelist-shadow');
    this.reportElem.appendChild(container);

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('death-title');
    container.appendChild(titleDiv);

    const titleIcon = document.createElement('div');
    titleIcon.classList.add('death-title-icon', 'mistake-icon', 'death');
    titleDiv.appendChild(titleIcon);

    const titleText = document.createElement('div');
    titleText.classList.add('death-title-text');
    titleText.innerHTML = report.targetName;
    titleDiv.appendChild(titleText);

    const closeButton = document.createElement('div');
    closeButton.classList.add('death-title-close', 'mistake-icon', 'icon-entry', 'icon-close');
    closeButton.addEventListener('click', () => {
      // Clicking the close button also cancels the queue.  Otherwise, you
      // close one and then another appears seconds later, which seems incorrect.
      this.cancelQueue();
      this.hide();
    });
    titleDiv.appendChild(closeButton);

    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('death-details');
    container.appendChild(detailsDiv);

    for (const event of report.parseReportLines()) {
      this.AppendDetails(
        detailsDiv,
        event.timestampStr,
        event.currentHp?.toString(),
        event.amountStr,
        event.amountClass,
        event.icon,
        event.text,
      );
    }
  }

  private AppendDetails(
    detailsDiv: HTMLElement,
    timestampStr: string,
    currentHp?: string,
    amount?: string,
    amountClass?: string,
    icon?: string,
    text?: string,
  ): void {
    const hpElem = document.createElement('div');
    hpElem.classList.add('death-row-hp');
    if (currentHp !== undefined)
      hpElem.innerText = currentHp;
    detailsDiv.appendChild(hpElem);

    const damageElem = document.createElement('div');
    damageElem.classList.add('death-row-amount');
    if (amountClass)
      damageElem.classList.add(amountClass);
    if (amount !== undefined)
      damageElem.innerText = amount;
    detailsDiv.appendChild(damageElem);

    const iconElem = document.createElement('div');
    iconElem.classList.add('death-row-icon');
    if (icon !== undefined)
      iconElem.classList.add('mistake-icon', icon);
    detailsDiv.appendChild(iconElem);

    const textElem = document.createElement('div');
    textElem.classList.add('death-row-text');
    if (text !== undefined)
      textElem.innerHTML = text;
    detailsDiv.appendChild(textElem);

    const timeElem = document.createElement('div');
    timeElem.classList.add('death-row-time');
    timeElem.innerText = timestampStr;
    detailsDiv.appendChild(timeElem);
  }
}

export class OopsyLiveList implements MistakeObserver {
  private container: Element;
  private iconContainer: HTMLElement;
  private inCombat = false;
  private numItems = 0;
  private items: HTMLElement[] = [];
  private baseTime?: number;
  private deathReport?: DeathReportLive;
  private itemIdxToListener: { [itemIdx: number]: () => void } = {};

  constructor(private options: OopsyOptions, private scroller: HTMLElement) {
    const container = this.scroller.children[0];
    if (!container)
      throw new UnreachableCode();
    this.container = container;

    const reportDiv = document.getElementById('death-report');
    if (!reportDiv)
      throw new UnreachableCode();

    if (this.options.DeathReportSide !== 'disabled')
      this.deathReport = new DeathReportLive(options, reportDiv);

    document.body.classList.add(`report-side-${this.options.DeathReportSide}`);

    const iconContainer = document.getElementById('icon-container');
    if (!iconContainer)
      throw new UnreachableCode();
    this.iconContainer = iconContainer;

    const closeDiv = document.getElementById('icon-close');
    if (!closeDiv)
      throw new UnreachableCode();
    closeDiv.addEventListener('click', () => {
      this.Reset();
    });

    const summaryDiv = document.getElementById('icon-summary');
    if (!summaryDiv)
      throw new UnreachableCode();
    summaryDiv.addEventListener('click', () => {
      const regex = /\w*.html$/;
      if (!regex.exec(window.location.href)) {
        console.error(`Unable to parse location for summary: ${window.location.href}`);
        return;
      }
      const url = window.location.href.replace(regex, 'oopsy_summary.html');
      callOverlayHandler({ call: 'openWebsiteWithWS', url: url }).catch(() => {
        console.error(`Failed to open summary`);
        this.OnMistakeObj(Date.now(), {
          type: 'fail',
          text: errorMessageEnableACTWS,
        });
      });
    });

    this.Reset();
    this.SetInCombat(false);
  }

  SetInCombat(inCombat: boolean): void {
    // For usability sake:
    //   - to avoid dungeon trash starting stopping combat and resetting the
    //     list repeatedly, only reset when ACT starts a new encounter.
    //   - for consistency with DPS meters, fflogs, etc, use ACT's encounter
    //     time as the start time, not when game combat becomes true.
    //   - to make it more readable, show/hide old mistakes out of game
    //     combat, and consider early pulls starting game combat early.  This
    //     allows for one long dungeon ACT encounter to have multiple early
    //     or late pulls.
    if (this.inCombat === inCombat)
      return;
    this.inCombat = inCombat;
    if (inCombat) {
      document.body.classList.remove('out-of-combat');
      this.HideOldItems();
    } else {
      // TODO: Add an X button to hide/clear the list.
      document.body.classList.add('out-of-combat');
      this.ShowAllItems();
    }
  }

  OnMistakeObj(timestamp: number, m: OopsyMistake): void {
    const report = m.report ? new DeathReport(m.report) : undefined;
    if (report)
      this.deathReport?.queue(report);

    const iconClass = m.type;
    const blame = m.name ?? m.blame;
    const blameText = blame ? ShortNamify(blame, this.options.PlayerNicks) + ': ' : '';
    const translatedText = Translate(this.options.DisplayLanguage, m.text);
    if (!translatedText)
      return;

    const time = GetFormattedTime(this.baseTime, timestamp);
    const text = `${blameText}${translatedText}`;
    const maxItems = this.options.NumLiveListItemsInCombat;

    // Get an existing row or create a new one.
    let rowDiv;
    const itemIdx = this.numItems;
    if (itemIdx < this.items.length)
      rowDiv = this.items[itemIdx];
    if (!rowDiv)
      rowDiv = this.MakeRow();

    // Clean up / add any event listeners.
    const listener = this.itemIdxToListener[itemIdx];
    if (listener) {
      rowDiv.removeEventListener('mousemove', listener);
      delete this.itemIdxToListener[itemIdx];
    }
    if (report) {
      const func = () => this.deathReport?.mouseOver(report, this.inCombat);
      rowDiv.addEventListener('mousemove', func);
      this.itemIdxToListener[itemIdx] = func;
    }

    this.numItems++;

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

    // Hide anything over the limit from the past.
    if (this.inCombat) {
      if (this.numItems > maxItems)
        this.items[this.numItems - maxItems - 1]?.classList.add('hide');
    }

    // Show and scroll to bottom.
    this.container.classList.remove('hide');
    this.iconContainer.classList.remove('hide');
    this.scroller.scrollTop = this.scroller.scrollHeight;
  }

  private MakeRow(): HTMLElement {
    const div = document.createElement('div');
    div.classList.add('mistake-row');

    // click-to-copy function
    div.addEventListener('click', () => {
      const mistakeText = div.childNodes[1]?.textContent ?? '';
      const mistakeTime = div.childNodes[2]?.textContent;
      const str = mistakeTime ? `[${mistakeTime}] ${mistakeText}` : mistakeText;
      const el = document.createElement('textarea');
      el.value = str;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);

      // copied message
      const msg = document.createElement('div');
      msg.classList.add('copied-msg');
      msg.innerText = kCopiedMessage[this.options.DisplayLanguage] || kCopiedMessage['en'];
      msg.style.width = `${div.clientWidth}px`;
      msg.style.height = `${div.clientHeight}px`;

      div.appendChild(msg);
      window.setTimeout(() => {
        // oopsy live list may have been hidden/destroyed before the timeout happens.
        if (msg.parentNode)
          div.removeChild(msg);
      }, 1000);
    });
    this.items.push(div);
    this.container.appendChild(div);
    return div;
  }

  private ShowAllItems(): void {
    for (const item of this.items)
      item.classList.remove('hide');

    this.scroller.scrollTop = this.scroller.scrollHeight;
  }

  private HideOldItems(): void {
    const maxItems = this.options.NumLiveListItemsInCombat;
    for (let i = 0; i < this.items.length - maxItems; ++i)
      this.items[i]?.classList.add('hide');
  }

  Reset(): void {
    this.container.classList.add('hide');
    this.iconContainer.classList.add('hide');
    this.items = [];
    this.numItems = 0;
    this.container.innerHTML = '';
    this.itemIdxToListener = {};
    this.deathReport?.hide();
  }

  OnEvent(event: ViewEvent): void {
    if (event.type === 'Mistake')
      this.OnMistakeObj(event.timestamp, event.mistake);
    else if (event.type === 'StartEncounter')
      this.StartEncounter(event.timestamp);
    else if (event.type === 'ChangeZone')
      this.OnChangeZone();
  }

  OnSyncEvents(_events: ViewEvent[]): void {
    // don't bother syncing for the live list
  }

  StartEncounter(timestamp: number): void {
    this.Reset();
    this.baseTime = timestamp;
  }

  OnChangeZone(): void {
    this.Reset();
  }
}
