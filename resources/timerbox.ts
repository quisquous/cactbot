export default class TimerBox extends HTMLElement {
  private _start: number;
  private _duration: number;
  rootElement: HTMLDivElement;
  largeBoxElement: HTMLDivElement;
  largeBoxBackgroundElement: HTMLDivElement;
  largeBoxForegroundElement: HTMLDivElement;
  smallBoxElement: HTMLDivElement;
  smallBoxBackgroundElement: HTMLDivElement;
  smallBoxForegroundElement: HTMLDivElement;
  timerElement: HTMLDivElement;
  readonly kLargeSize: number;
  readonly kSmallSize: number;
  readonly kBorderSize: number;
  readonly kFontSize: number;
  readonly kAnimateMS: number;
  private _threshold: number;
  private _bg: string;
  private _fg: string;
  private _scale: number;
  private _valueScale: number;
  private _towardTop: boolean;
  private _fill: boolean;
  private _hideAfter: number;
  private _bigAtZero: boolean;
  private _roundUpThreshold: boolean;
  private _connected: boolean;
  private _hideTimer: number | null;
  private _timer: number | null;
  private _animationFrame: number | null;
  private _notifyThresholdCallbacks: boolean;
  private _onThresholdCallbacks: Array<() => void> = [];
  private _onExpiredCallbacks: Array<() => void> = [];
  private _onResetCallbacks: Array<() => void> = [];

  static get observedAttributes(): string[] {
    return ['duration', 'threshold', 'bg', 'fg', 'toward', 'stylefill', 'hideafter', 'bigatzero', 'roundupthreshold'];
  }

  // The full duration of the current countdown. When this is changed,
  // the countdown restarts at the new value. If set to 0 then countdowns
  // are stopped.
  set duration(d: string | null) {
    if (d === null)
      this.removeAttribute('duration');
    else
      this.setAttribute('duration', d);
  }
  get duration(): string | null {
    return this.getAttribute('duration');
  }

  // Below this a large box is shown, above it a small box is shown.
  set threshold(t: string | null) {
    if (t === null)
      this.removeAttribute('threshold');
    else
      this.setAttribute('threshold', t);
  }
  get threshold(): string | null {
    return this.getAttribute('threshold');
  }

  // All visual dimensions are scaled by this.
  set scale(s: string | null) {
    if (s === null)
      this.removeAttribute('scale');
    else
      this.setAttribute('scale', s);
  }
  get scale(): string | null {
    return this.getAttribute('scale');
  }

  // The displayed value is scaled by this.
  set valuescale(s: string | null) {
    if (s === null)
      this.removeAttribute('valuescale');
    else
      this.setAttribute('valuescale', s);
  }
  get valuescale(): string | null {
    return this.getAttribute('valuescale');
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

  // If "top" then animates bottom-to-top. If "bottom" then animates
  // top-to-bottom.
  set toward(t: 'top' | 'bottom') {
    this.setAttribute('toward', t);
  }
  get toward(): 'top' | 'bottom' {
    return this.getAttribute('toward') as 'top' | 'bottom';
  }

  // If "fill" then the animation goes empty-to-full, if "empty" then the
  // animation starts full and goes to empty.
  set stylefill(s: 'fill' | 'empty' | null) {
    if (s === null)
      this.removeAttribute('stylefill');
    else
      this.setAttribute('stylefill', s);
  }
  get stylefill(): 'fill' | 'empty' | null {
    return this.getAttribute('stylefill') as 'fill' | 'empty';
  }

  // When the timer reaches 0, it is hidden after this many seconds. If ""
  // then it is not hidden.
  set hideafter(h: string | null) {
    if (h === null)
      this.removeAttribute('hideafter');
    else
      this.setAttribute('hideafter', h);
  }
  get hideafter(): string | null {
    return this.getAttribute('hideafter');
  }

  // When the timer reaches 0, it is big if this is true.
  set bigatzero(big: boolean) {
    this.setAttribute('bigatzero', String(big));
  }
  get bigatzero(): boolean {
    return this.getAttribute('bigatzero') === 'true';
  }

  // The length remaining in the count down.
  get value(): string {
    if (!this._start)
      return this._duration.toString();
    const elapsedMs = new Date().getTime() - this._start;
    return Math.max(0, this._duration - (elapsedMs / 1000)).toString();
  }

  // The elapsed time.
  get elapsed(): string {
    if (!this._start)
      return '0';
    return ((new Date().getTime() - this._start) / 1000).toString();
  }

  // Whether to round up the value to the nearest integer before thresholding.
  set roundupthreshold(r: boolean) {
    if (r)
      this.setAttribute('roundupthreshold', '');
    else
      this.removeAttribute('roundupthreshold');
  }
  get roundupthreshold(): boolean {
    return this.hasAttribute('roundupthreshold');
  }

  // This would be used with window.customElements.
  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    this.init(root);

    this._connected = false;

    this.rootElement = this.shadowRoot?.getElementById('root') as HTMLDivElement;
    this.largeBoxElement = this.shadowRoot?.getElementById('large') as HTMLDivElement;
    this.largeBoxBackgroundElement = this.largeBoxElement.getElementsByClassName('bg')[0] as HTMLDivElement;
    this.largeBoxForegroundElement = this.largeBoxElement.getElementsByClassName('fg')[0] as HTMLDivElement;
    this.smallBoxElement = this.shadowRoot?.getElementById('small') as HTMLDivElement;
    this.smallBoxBackgroundElement = this.smallBoxElement.getElementsByClassName('bg')[0] as HTMLDivElement;
    this.smallBoxForegroundElement = this.smallBoxElement.getElementsByClassName('fg')[0] as HTMLDivElement;
    this.timerElement = this.shadowRoot?.getElementById('timer') as HTMLDivElement;

    // Constants.
    this.kLargeSize = 50;
    this.kSmallSize = 30;
    this.kBorderSize = 2;
    this.kFontSize = 16;
    this.kAnimateMS = 100;

    // Default values.
    this._start = 0;
    this._duration = 0;
    this._threshold = 7;
    this._bg = 'rgba(0, 0, 0, 0.8)';
    this._fg = 'red';
    this._scale = 1;
    this._valueScale = 1;
    this._towardTop = true;
    this._fill = true;
    this._hideAfter = -1;
    this._bigAtZero = true;
    this._roundUpThreshold = true;
    this._hideTimer = 0;
    this._timer = 0;
    this._animationFrame = 0;
    this._notifyThresholdCallbacks = true;

    if (this.duration !== null)
      this._duration = Math.max(parseFloat(this.duration), 0);
    if (this.threshold !== null)
      this._threshold = parseFloat(this.threshold);
    if (this.bg !== null)
      this._bg = this.bg;
    if (this.fg !== null)
      this._fg = this.fg;
    if (this.scale !== null)
      this._scale = Math.max(parseFloat(this.scale), 0.01);
    if (this.toward !== null)
      this._towardTop = this.toward !== 'bottom';
    if (this.stylefill !== null)
      this._fill = this.stylefill !== 'empty';
    if (this.hideafter !== null && this.hideafter !== '')
      this._hideAfter = Math.max(parseFloat(this.hideafter), 0);
  }

  init(root: ShadowRoot): void {
    root.innerHTML = `
      <style>
        .bg {
          position: absolute;
        }
        .fg {
          position: absolute;
        }
        #timer {
          position: absolute;
          text-align: center;
          font-family: arial;
          font-weight: bold;
          color: white;
          text-shadow: -1px 0 3px black, 0 1px 3px black, 1px 0 3px black, 0 -1px 3px black;
        }
        #large, #small, #timer {
          display: none;
        }
        #large .fg {
          will-change: transform;
        }
        #timer {
          will-change: content;
        }
      </style>
      <div id="root" style="position: relative">
        <div id="large"><div class="bg"></div><div class="fg"></div></div>
        <div id="small"><div class="bg"></div><div class="fg"></div></div>
        <div id="timer"></div>
      </div>
    `;
  }

  connectedCallback(): void {
    this._connected = true;
    this.layout();
    this.draw();
  }

  disconnectedCallback(): void {
    this._duration = 0;
    this._connected = false;
  }

  attributeChangedCallback(name: string, oldValue: string | number, newValue: string): void {
    if (name === 'duration') {
      this._duration = Math.max(parseFloat(newValue), 0);
      this.reset();
      return;
    }

    if (name === 'threshold') {
      this._threshold = Math.max(parseFloat(newValue), 0);
    } else if (name === 'toward') {
      this._towardTop = newValue !== 'bottom';
      this.layout();
    } else if (name === 'stylefill') {
      this._fill = newValue !== 'empty';
      this.layout();
    } else if (name === 'bg') {
      this._bg = newValue;
      this.layout();
    } else if (name === 'fg') {
      this._fg = newValue;
      this.layout();
    } else if (name === 'hideafter') {
      this._hideAfter = Math.max(parseFloat(this.hideafter ?? '0'), 0);
      if (this._duration === 0 && this._hideAfter >= 0)
        this.hide();
      else if (this._hideAfter < 0)
        this.show();
    } else if (name === 'roundupthreshold') {
      this._roundUpThreshold = newValue === 'true';
    } else if (name === 'valuescale') {
      this._valueScale = parseFloat(newValue);
    } else if (name === 'bigatzero') {
      this._bigAtZero = newValue === 'true';
    }

    this.draw();
  }

  onThresholdReached(f: () => void): void {
    this._onThresholdCallbacks.push(f);
  }
  onExpired(f: () => void): void {
    this._onExpiredCallbacks.push(f);
  }
  onReset(f: () => void): void {
    this._onResetCallbacks.push(f);
  }

  layout(): void {
    // To start full and animate to empty, we animate backwards and flip
    // the direction.
    let towardTop = this._towardTop;
    if (this._fill)
      towardTop = !towardTop;

    const largeBackgroundStyle = this.largeBoxBackgroundElement.style;
    const smallBackgroundStyle = this.smallBoxBackgroundElement.style;
    const largeForegroundStyle = this.largeBoxForegroundElement.style;
    const smallForegroundStyle = this.smallBoxForegroundElement.style;

    smallBackgroundStyle.backgroundColor = this._bg;
    largeBackgroundStyle.backgroundColor = this._bg;
    smallForegroundStyle.backgroundColor = this._fg;
    largeForegroundStyle.backgroundColor = this._fg;

    largeBackgroundStyle.width =
      largeBackgroundStyle.height = (this.kLargeSize * this._scale).toString();
    smallBackgroundStyle.width =
      smallBackgroundStyle.height = (this.kSmallSize * this._scale).toString();
    largeForegroundStyle.width =
      largeForegroundStyle.height =
        ((this.kLargeSize - this.kBorderSize * 2) * this._scale).toString();
    smallForegroundStyle.width =
      smallForegroundStyle.height =
        ((this.kSmallSize - this.kBorderSize * 2) * this._scale).toString();

    const sizeDiff = this.kLargeSize - this.kSmallSize;
    smallBackgroundStyle.left = smallBackgroundStyle.top =
        (sizeDiff * this._scale / 2).toString();
    smallForegroundStyle.left = smallForegroundStyle.top =
      (sizeDiff * this._scale / 2 + this.kBorderSize * this._scale).toString();
    largeForegroundStyle.left = largeForegroundStyle.top =
      (this.kBorderSize * this._scale).toString();

    this.timerElement.style.width = (this.kLargeSize * this._scale).toString();
    this.timerElement.style.fontSize = `${this.kFontSize * this._scale}px`;
    this.timerElement.style.top = ((this.kLargeSize - this.kFontSize) * this._scale / 2).toString();

    if (towardTop)
      largeForegroundStyle.transformOrigin = '0% 0%';
    else
      largeForegroundStyle.transformOrigin = '0% 100%';
  }

  draw(): void {
    if (!this._connected)
      return;

    const elapsedSec = (new Date().getTime() - this._start) / 1000;
    const remainingSec = Math.max(0, this._duration - elapsedSec);
    let rounded;
    if (this._roundUpThreshold)
      rounded = Math.ceil(remainingSec);
    else
      rounded = remainingSec;


    if (rounded <= 0.000000001 || this._duration === 0) {
      if (this._bigAtZero) {
        this.largeBoxElement.style.display = 'block';
        this.smallBoxElement.style.display = 'none';
      } else {
        this.largeBoxElement.style.display = 'none';
        this.smallBoxElement.style.display = 'block';
      }
      this.timerElement.style.display = 'none';
      this.largeBoxForegroundElement.style.transform = '';
    } else if (rounded > this._threshold) {
      this.largeBoxElement.style.display = 'none';
      this.smallBoxElement.style.display = 'block';
      this.timerElement.style.display = 'block';
    } else {
      this.largeBoxElement.style.display = 'block';
      this.smallBoxElement.style.display = 'none';
      this.timerElement.style.display = 'block';
      const animStartValue = this._duration > this._threshold ? this._threshold : this._duration;
      let animPercent = (animStartValue - remainingSec) / animStartValue;
      if (!this._fill)
        animPercent = 1.0 - animPercent;
      this.largeBoxForegroundElement.style.transform = `scale(1, ${animPercent})`;
    }

    this.timerElement.innerHTML = Math.ceil(remainingSec / this._valueScale).toString();
  }

  reset(): void {
    if (!this._connected)
      return;

    this.show();
    clearTimeout(this._hideTimer ?? 0);
    this._hideTimer = null;
    clearTimeout(this._timer ?? 0);
    this._timer = null;
    this.classList.remove('expired');
    this._notifyThresholdCallbacks = true;

    this._start = new Date().getTime();

    for (const f of this._onResetCallbacks)
      setTimeout(f, 0);

    this.advance();
  }

  advance(): void {
    const elapsedSec = (new Date().getTime() - this._start) / 1000;
    if (elapsedSec >= this._duration) {
      // We need to check for this._duration > 0 here, as for undocumented reason the
      // duration of a timerbox is always set to zero before it is set to the
      // actual duration. As a result this would otherwise trigger a sound each time
      // the ability is activated.
      if (this._duration > 0) {
        for (const f of this._onExpiredCallbacks)
          setTimeout(f, 0);
      }
      // Sets the attribute to 0 so users can see the counter is done, and
      // if they set the same duration again it will count.
      this._duration = 0;
      this.classList.add('expired');
      if (this._hideAfter > 0)
        this._hideTimer = window.setTimeout(this.hide.bind(this), this._hideAfter);
      else if (this._hideAfter === 0)
        this.hide();

      window.cancelAnimationFrame(this._animationFrame ?? 0);
      this._animationFrame = null;
    } else {
      this._animationFrame = window.requestAnimationFrame(this.advance.bind(this));
    }

    const remainingTime = Math.max(0, this._duration - elapsedSec);
    if (remainingTime <= this._threshold && this._notifyThresholdCallbacks && this._duration > 0) {
      for (const f of this._onThresholdCallbacks)
        setTimeout(f, 0);
      this._notifyThresholdCallbacks = false;
    }

    this.draw();
  }

  show(): void {
    this.rootElement.style.display = 'block';
  }

  hide(): void {
    this.rootElement.style.display = 'none';
  }
}

window.customElements.define('timer-box', TimerBox);
