import { UnreachableCode } from './not_reached';

export default class TimerBar extends HTMLElement {
  rootElement: HTMLElement;
  foregroundElement: HTMLElement;
  backgroundElement: HTMLElement;
  leftTextElement: HTMLElement;
  centerTextElement: HTMLElement;
  rightTextElement: HTMLElement;
  private _duration: number;
  private _start: number;
  private _width: string;
  private _height: string;
  private _bg: string;
  private _fg: string;
  private _towardRight: boolean;
  private _fill: boolean;
  private _leftText: string;
  private _centerText: string;
  private _rightText: string;
  private _hideAfter: number;
  private _loop: boolean;
  private _connected: boolean;
  private _hideTimer: number | null;

  static get observedAttributes(): string[] {
    return [
      'duration',
      'value',
      'elapsed',
      'hideafter',
      'lefttext',
      'centertext',
      'righttext',
      'width',
      'height',
      'bg',
      'fg',
      'stylefill',
      'toward',
      'loop',
    ];
  }

  /** create an instance of TimerBar with attributes */
  static create(o?: {
    duration?: number;
    value?: number;
    elapsed?: number;
    hideafter?: number;
    lefttext?: string;
    centertext?: string;
    righttext?: string;
    width?: string;
    height?: string;
    bg?: string;
    fg?: string;
    stylefill?: 'empty' | 'fill';
    toward?: 'left' | 'right';
    loop?: boolean;
  }): TimerBar {
    if (!window.customElements.get('timer-bar'))
      window.customElements.define('timer-bar', TimerBar);

    const element = document.createElement('timer-bar');
    if (!o)
      return element;

    if (typeof o.duration === 'number')
      element.duration = o.duration;
    if (typeof o.value === 'number')
      element.value = o.value;
    if (typeof o.elapsed === 'number')
      element.elapsed = o.elapsed;
    if (typeof o.hideafter === 'number')
      element.hideafter = o.hideafter;
    if (typeof o.lefttext === 'string')
      element.lefttext = o.lefttext;
    if (typeof o.centertext === 'string')
      element.centertext = o.centertext;
    if (typeof o.righttext === 'string')
      element.righttext = o.righttext;
    if (typeof o.width === 'string')
      element.width = o.width;
    if (typeof o.height === 'string')
      element.height = o.height;
    if (typeof o.bg === 'string')
      element.bg = o.bg;
    if (typeof o.fg === 'string')
      element.fg = o.fg;
    if (typeof o.stylefill === 'string')
      element.stylefill = o.stylefill;
    if (typeof o.toward === 'string')
      element.toward = o.toward;
    if (typeof o.loop === 'boolean')
      element.loop = o.loop;
    return element;
  }

  // Background color.
  set bg(c: string | null) {
    if (c === null)
      this.removeAttribute('bg');
    else
      this.setAttribute('bg', c);
  }
  get bg(): string | null {
    return this.getAttribute('bg');
  }

  // Foreground color.
  set fg(c: string | null) {
    if (c === null)
      this.removeAttribute('fg');
    else
      this.setAttribute('fg', c);
  }
  get fg(): string | null {
    return this.getAttribute('fg');
  }

  // The width of the bar.
  set width(w: string | null) {
    if (w === null)
      this.removeAttribute('width');
    else
      this.setAttribute('width', w);
  }
  get width(): string | null {
    return this.getAttribute('width');
  }

  // The height of the bar.
  set height(w: string | null) {
    if (w === null)
      this.removeAttribute('height');
    else
      this.setAttribute('height', w);
  }
  get height(): string | null {
    return this.getAttribute('height');
  }

  // The total length of time to count down.
  set duration(s: number | null) {
    if (s === null)
      this.removeAttribute('duration');
    else
      this.setAttribute('duration', s.toString());
  }
  get duration(): number | null {
    const s = this.getAttribute('duration');
    if (s === null)
      return null;
    return parseFloat(s);
  }

  // The length remaining in the count down.
  set value(s: number) {
    this.setAttribute('value', s.toString());
  }

  get value(): number {
    if (!this._start)
      return this._duration;
    const elapsedMs = Date.now() - this._start;
    return Math.max(0, this._duration - (elapsedMs / 1000));
  }

  // The elapsed time.
  set elapsed(s: number) {
    this.setAttribute('elapsed', s.toString());
  }
  get elapsed(): number {
    if (!this._start)
      return 0;
    return (Date.now() - this._start) / 1000;
  }

  // If "right" then animates left-to-right (the default). If "left"
  // then animates right-to-left.
  set toward(t: 'left' | 'right' | null) {
    if (t === null)
      this.removeAttribute('toward');
    else
      this.setAttribute('toward', t);
  }
  get toward(): 'left' | 'right' | null {
    return this.getAttribute('toward') as 'left' | 'right';
  }

  // If "fill" then the progress goes empty-to-full, if "empty" then the
  // progress bar starts full and goes to empty.
  set stylefill(s: 'empty' | 'fill' | null) {
    if (s === null)
      this.removeAttribute('stylefill');
    else
      this.setAttribute('stylefill', s);
  }
  get stylefill(): 'empty' | 'fill' | null {
    return this.getAttribute('stylefill') as 'empty' | 'fill';
  }

  // When the bar reaches 0, it is hidden after this many seconds. If null
  // then it is not hidden.
  set hideafter(h: number | null) {
    if (h === null)
      this.removeAttribute('hideafter');
    else
      this.setAttribute('hideafter', h.toString());
  }
  get hideafter(): number | null {
    const h = this.getAttribute('hideafter');
    if (h === null)
      return null;
    return parseInt(h);
  }

  // Chooses what should be shown in the text field in each area of
  // the bar. Can be one of:
  // empty - nothing is shown.
  // "remain" - shows the remaining time.
  // "duration" - shows the remaining and total duration time
  //              of the bar.
  // "percent" - shows the percentage of remaining time to
  //             the duration.
  // "elapsed"   - shows the elapsed time
  // anything else - the given text is shown literally.
  set lefttext(p: string | null) {
    if (p === null)
      this.removeAttribute('lefttext');
    else
      this.setAttribute('lefttext', p);
  }
  get lefttext(): string | null {
    return this.getAttribute('lefttext');
  }
  set righttext(p: string | null) {
    if (p === null)
      this.removeAttribute('righttext');
    else
      this.setAttribute('righttext', p);
  }
  get righttext(): string | null {
    return this.getAttribute('righttext');
  }
  set centertext(p: string | null) {
    if (p === null)
      this.removeAttribute('centertext');
    else
      this.setAttribute('centertext', p);
  }
  get centertext(): string | null {
    return this.getAttribute('centertext');
  }

  // If this attribute is present, the timer will loop forever.
  set loop(l: boolean) {
    if (l)
      this.setAttribute('loop', '');
    else
      this.removeAttribute('loop');
  }
  get loop(): boolean {
    return this.hasAttribute('loop');
  }

  // This would be used with window.customElements.
  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    this.init(root);

    this._connected = false;

    // Default values.
    this._start = 0;
    this._duration = 0;
    this._width = '100%';
    this._height = '100%';
    this._bg = 'black';
    this._fg = 'yellow';
    this._towardRight = false;
    this._fill = false;
    this._leftText = '';
    this._centerText = '';
    this._rightText = '';
    this._hideAfter = -1;
    this._loop = false;
    this._hideTimer = 0;

    this.rootElement = this.shadowRoot?.getElementById('root') as HTMLDivElement;
    this.foregroundElement = this.shadowRoot?.getElementById('fg') as HTMLDivElement;
    this.backgroundElement = this.shadowRoot?.getElementById('bg') as HTMLDivElement;
    this.leftTextElement = this.shadowRoot?.getElementById('lefttext') as HTMLDivElement;
    this.centerTextElement = this.shadowRoot?.getElementById('centertext') as HTMLDivElement;
    this.rightTextElement = this.shadowRoot?.getElementById('righttext') as HTMLDivElement;
  }

  init(root: ShadowRoot): void {
    root.innerHTML = `
      <style>
        .timerbar-root {
          position: relative;
          border: 1px solid black;
          box-sizing: border-box;
        }
        .timerbar-bg {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0.8;
        }
        .timerbar-fg {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 1.0;
        }
        .text {
          position: absolute;
          font-family: arial;
          font-weight: bold;
          color: white;
          text-shadow: -1px 0 3px black, 0 1px 3px black, 1px 0 3px black, 0 -1px 3px black;
          will-change: content;
        }
        .text-container {
          position: absolute;
          left: 0px;
          top: calc(50% - 1.2ex);
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .timerbar-lefttext {
          position: relative;
          text-align: left;
          padding: 0px 0.4em 0px 0.4em;
        }
        .timerbar-centertext {
          position: relative;
          text-align: center;
          padding: 0px 0.4em 0px 0.4em;
        }
        .timerbar-righttext {
          position: relative;
          text-align: right;
          padding: 0px 0.4em 0px 0.4em;
        }
        :host-context(.just-a-number) .timerbar-root {
          border: none;
        }
        :host-context(.just-a-number) .timerbar-bg {
          display: none;
        }
        :host-context(.just-a-number) .timerbar-fg {
          display: none;
        }
        /* Korean better visibility CSS */
        :lang(ko) .text-container {
          top: calc(50% - 1.5ex);
          height: calc(100% + 0.3ex);
        }
        :lang(ko) .timerbar-righttext {
          top: 0.3ex;
        }
      </style>
      <div id="root" class="timerbar-root" part="timerbar-root">
        <div id="bg" class="timerbar-bg" part="timerbar-bg"></div>
        <div id="fg" class="timerbar-fg" part="timerbar-fg"></div>
        <div class="text-container" part="text-container">
          <div id="lefttext" class="text timerbar-lefttext" part="text timerbar-lefttext"></div>
        </div>
        <div class="text-container" part="text-container">
          <div id="centertext" class="text timerbar-centertext" part="text timerbar-centertext"></div>
        </div>
        <div class="text-container" part="text-container">
          <div id="righttext" class="text timerbar-righttext" part="text timerbar-righttext"></div>
        </div>
      </div>
    `;
  }

  connectedCallback(): void {
    this._connected = true;
    this.layout();
    this.updateText();
    if (!this._start)
      this.setvalue(this._duration);
    else
      this.advance();
  }

  disconnectedCallback(): void {
    this._connected = false;
  }

  attributeChangedCallback(name: string, _oldValue: string | number, newValue: string): void {
    if (name === 'duration') {
      this._duration = Math.max(parseFloat(newValue), 0);
      this.setvalue(this._duration);
    } else if (name === 'value') {
      this.setvalue(Math.max(parseFloat(newValue), 0));
    } else if (name === 'elapsed') {
      this.setvalue(this._duration - Math.max(parseFloat(newValue), 0));
    } else if (name === 'width') {
      this._width = newValue;
      this.layout();
    } else if (name === 'height') {
      this._height = newValue;
      this.layout();
    } else if (name === 'bg') {
      this._bg = newValue;
      this.layout();
    } else if (name === 'fg') {
      this._fg = newValue;
      this.layout();
    } else if (name === 'stylefill') {
      this._fill = newValue === 'fill';
      this.layout();
    } else if (name === 'toward') {
      this._towardRight = newValue === 'right';
      this.layout();
    } else if (name === 'lefttext') {
      const update = newValue !== this._leftText && this._connected;
      this._leftText = newValue;
      if (update)
        this.updateText();
    } else if (name === 'centertext') {
      const update = newValue !== this._centerText && this._connected;
      this._centerText = newValue;
      if (update)
        this.updateText();
    } else if (name === 'righttext') {
      const update = newValue !== this._rightText && this._connected;
      this._rightText = newValue;
      if (update)
        this.updateText();
    } else if (name === 'hideafter') {
      this._hideAfter = Math.max(this.hideafter ?? 0, 0);
      if (this.value === 0) {
        if (this._hideAfter >= 0)
          this.hide();
        else
          this.show();
      }
    } else if (name === 'loop') {
      this._loop = newValue !== null;
    }

    if (this._connected)
      this.draw();
  }

  layout(): void {
    if (!this._connected)
      return;

    this.backgroundElement.style.backgroundColor = this._bg;
    this.foregroundElement.style.backgroundColor = this._fg;
    this.rootElement.style.width = this._width;
    this.rootElement.style.height = this._height;

    // To start full and animate to empty, we animate backwards and flip
    // the direction.
    if (this._towardRight !== this._fill) {
      this.foregroundElement.style.left = '';
      this.foregroundElement.style.right = '0px';
      this.foregroundElement.style.transformOrigin = 'right center';
    } else {
      this.foregroundElement.style.left = '0px';
      this.foregroundElement.style.right = '';
      this.foregroundElement.style.transformOrigin = 'left center';
    }
  }

  updateText(): void {
    const varyingTexts = ['elapsed', 'duration', 'percent', 'remain'];
    // These values are filled in during draw() when the values change.
    if (!varyingTexts.includes(this._leftText)) {
      // Otherwise the value is fixed so it can be set here.
      this.leftTextElement.innerHTML = this._leftText;
    }
    if (!varyingTexts.includes(this._centerText))
      this.centerTextElement.innerHTML = this._centerText;

    if (!varyingTexts.includes(this._rightText))
      this.rightTextElement.innerHTML = this._rightText;
  }

  draw(): void {
    const elapsedSec = (Date.now() - this._start) / 1000;
    const remainSec = Math.max(0, this._duration - elapsedSec);
    let percent = this._duration <= 0 ? 0 : remainSec / this._duration;
    // Keep it between 0 and 1.
    percent = Math.min(1, Math.max(0, percent));
    const displayRemain = remainSec ? remainSec.toFixed(1) : '';
    const displayElapsed = elapsedSec.toFixed(1);
    if (this._fill)
      percent = 1.0 - percent;
    this.foregroundElement.style.transform = `scaleX(${percent.toFixed(3)})`;
    if (this._leftText !== '') {
      if (this._leftText === 'remain')
        this.leftTextElement.innerText = displayRemain;
      else if (this._leftText === 'duration')
        this.leftTextElement.innerText = `${displayRemain} / ${this._duration}`;
      else if (this._leftText === 'percent')
        this.leftTextElement.innerText = `${(percent * 100).toFixed(1)} %`;
      else if (this._leftText === 'elapsed')
        this.leftTextElement.innerText = displayElapsed;
    }
    if (this._centerText !== '') {
      if (this._centerText === 'remain')
        this.centerTextElement.innerText = displayRemain;
      else if (this._centerText === 'duration')
        this.centerTextElement.innerText = `${displayRemain} / ${this._duration}`;
      else if (this._centerText === 'percent')
        this.centerTextElement.innerText = `${(percent * 100).toFixed(1)} %`;
      else if (this._centerText === 'elapsed')
        this.centerTextElement.innerText = displayElapsed;
    }
    if (this._rightText !== '') {
      if (this._rightText === 'remain')
        this.rightTextElement.innerText = displayRemain;
      else if (this._rightText === 'duration')
        this.rightTextElement.innerText = `${displayRemain} / ${this._duration}`;
      else if (this._rightText === 'percent')
        this.rightTextElement.innerText = `${(percent * 100).toFixed(1)} %`;
      else if (this._rightText === 'elapsed')
        this.rightTextElement.innerText = displayElapsed;
    }
  }

  // Apply all styles from an object where keys are CSS properties
  applyStyles(styles: { [s: string]: string }): void {
    const s = Object.keys(styles).map((k) => {
      return `${k}:${styles?.[k] ?? ''};`;
    }).join('');

    const left = this.shadowRoot?.getElementById('lefttext');
    const center = this.shadowRoot?.getElementById('centertext');
    const right = this.shadowRoot?.getElementById('righttext');
    if (!left || !center || !right)
      throw new UnreachableCode();
    left.style.cssText += s;
    center.style.cssText += s;
    right.style.cssText += s;
  }

  setvalue(remainSec: number): void {
    const elapsedSec = Math.max(0, this._duration - remainSec);
    this._start = Date.now() - (elapsedSec * 1000);

    if (!this._connected)
      return;

    this.show();
    clearTimeout(this._hideTimer ?? 0);
    this._hideTimer = null;

    this.advance();
  }

  advance(): void {
    // If the element has been disconnected from the DOM, stop requesting animation frames
    if (!this._connected)
      return;

    const elapsedSec = (Date.now() - this._start) / 1000;
    if (elapsedSec >= this._duration) {
      // Timer completed
      if (this._loop && this._duration > 0) {
        // Sets the remaining time to include any extra elapsed seconds past the duration
        this.setvalue(this._duration + (this._duration - elapsedSec) % this._duration);
        return;
      }

      // Sets the attribute to 0 so users can see the counter is done, and
      // if they set the same duration again it will count.
      this._duration = 0;
      if (this._hideAfter > 0)
        this._hideTimer = window.setTimeout(this.hide.bind(this), this._hideAfter * 1000);
      else if (this._hideAfter === 0)
        this.hide();
    } else {
      // Timer not completed, request another animation frame
      window.requestAnimationFrame(this.advance.bind(this));
    }

    this.draw();
  }

  show(): void {
    if (this._connected)
      this.rootElement.style.display = 'block';
  }

  hide(): void {
    if (this._connected)
      this.rootElement.style.display = 'none';
  }
}

window.customElements.define('timer-bar', TimerBar);

declare global {
  interface HTMLElementTagNameMap {
    'timer-bar': TimerBar;
  }
}
