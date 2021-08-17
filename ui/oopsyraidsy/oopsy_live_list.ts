import { UnreachableCode } from '../../resources/not_reached';
import { EventResponses } from '../../types/event';
import { OopsyMistake } from '../../types/oopsy';

import { MistakeObserver } from './mistake_observer';
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

export class OopsyLiveList implements MistakeObserver {
  private container: Element;
  private inCombat = false;
  private numItems = 0;
  private items: HTMLElement[] = [];
  private baseTime?: number;

  constructor(private options: OopsyOptions, private scroller: HTMLElement) {
    const container = this.scroller.children[0];
    if (!container)
      throw new UnreachableCode();
    this.container = container;

    this.Reset();
    this.SetInCombat(false);
  }

  SetInCombat(inCombat: boolean): void {
    if (this.inCombat === inCombat)
      return;
    this.inCombat = inCombat;
    if (inCombat) {
      this.container.classList.remove('out-of-combat');
      this.HideOldItems();
    } else {
      // TODO: Add an X button to hide/clear the list.
      this.container.classList.add('out-of-combat');
      this.ShowAllItems();
    }
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
    const maxItems = this.options.NumLiveListItemsInCombat;

    let rowDiv;
    if (this.numItems < this.items.length)
      rowDiv = this.items[this.numItems];
    if (!rowDiv)
      rowDiv = this.MakeRow();

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
      document.body.appendChild(msg);
      window.setTimeout(() => {
        document.body.removeChild(msg);
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
    this.items = [];
    this.numItems = 0;
    this.container.innerHTML = '';
  }

  StartNewACTCombat(): void {
    this.Reset();
    this.baseTime = Date.now();
  }

  OnChangeZone(_e: EventResponses['ChangeZone']): void {
    this.Reset();
  }
}
