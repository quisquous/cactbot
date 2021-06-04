export default class TimerIcon extends HTMLElement {
  rootElement: HTMLDivElement;
  borderBackgroundElement: HTMLDivElement;
  borderForegroundElement: HTMLDivElement;
  iconElement: HTMLDivElement;
  textElement: HTMLDivElement;
  readonly kBackgroundOpacity: number;
  readonly kOuterBorderSize: number;
  readonly kAnimateMs: number;
  private _value: number;
  private _duration: number;
  private _width: number;
  private _height: number;
  private _borderBg: string;
  private _borderFg: string;
  private _scale: number;
  private _hideAfter: number;
  private _icon: string;
  private _zoom: number;
  private _text: string;
  private _textColor: string;
  private _colorBorderSize: number;
  private _connected: boolean;
  private _timer: number | null;
  private _hideTimer: number | null;
  startTimeMs: number;
  static get observedAttributes(): string[] {
    return ['icon', 'name', 'zoom', 'duration', 'width', 'height', 'bordercolor', 'bordersize', 'text', 'textcolor'];
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

  // Border color.
  set bordercolor(c: string | null) {
    if (c === null)
      this.removeAttribute('bordercolor');
    else
      this.setAttribute('bordercolor', c);
  }
  get bordercolor(): string | null {
    return this.getAttribute('bordercolor');
  }

  // Border size for the inner colored border.
  set bordersize(c: string | null) {
    if (c === null)
      this.removeAttribute('bordersize');
    else
      this.setAttribute('bordersize', c);
  }
  get bordersize(): string | null {
    return this.getAttribute('bordersize');
  }

  // The width of the icon, in pixels (before |scale|).
  set width(w: string | null) {
    if (w === null)
      this.removeAttribute('width');
    else
      this.setAttribute('width', w);
  }
  get width(): string | null {
    return this.getAttribute('width');
  }

  // The height of the icon, in pixels (before |scale|).
  set height(h: string | null) {
    if (h === null)
      this.removeAttribute('height');
    else
      this.setAttribute('height', h);
  }
  get height(): string | null {
    return this.getAttribute('height');
  }

  // The length of time to count down.
  set duration(s: string | null) {
    if (s === null)
      this.removeAttribute('duration');
    else
      this.setAttribute('duration', s);
  }
  get duration(): string | null {
    return this.getAttribute('duration');
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

  // Sets the path to the image to show in the icon.
  set icon(p: string | null) {
    if (p === null)
      this.removeAttribute('icon');
    else
      this.setAttribute('icon', p);
  }
  get icon(): string | null {
    return this.getAttribute('icon');
  }

  // Sets the number of pixels to zoom the icon. The image will be
  // grown by this amount and cropped to the widget.
  set zoom(p: string | null) {
    if (p === null)
      this.removeAttribute('zoom');
    else
      this.setAttribute('zoom', p);
  }
  get zoom(): string | null {
    return this.getAttribute('zoom');
  }

  // Sets what text should be shown in the icon. If empty, no text.
  // If 'remain', the number of seconds left, if 'elapsed', the number
  // of seconds active. If 'percent', the percentage of time remaining.
  // Otherwise, the literal text is shown.
  set text(p: string | null) {
    if (p === null)
      this.removeAttribute('text');
    else
      this.setAttribute('text', p);
  }
  get text(): string | null {
    return this.getAttribute('text');
  }

  set textcolor(p: string | null) {
    if (p === null)
      this.removeAttribute('textcolor');
    else
      this.setAttribute('textcolor', p);
  }
  get textcolor(): string | null {
    return this.getAttribute('textcolor');
  }

  // This would be used with window.customElements.
  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    this.init(root);

    this._connected = false;

    this.rootElement = this.shadowRoot?.getElementById('root') as HTMLDivElement;
    this.borderBackgroundElement = this.shadowRoot?.getElementById('border-bg') as HTMLDivElement;
    this.borderForegroundElement = this.shadowRoot?.getElementById('border-fg') as HTMLDivElement;
    this.iconElement = this.shadowRoot?.getElementById('icon') as HTMLDivElement;
    this.textElement = this.shadowRoot?.getElementById('text') as HTMLDivElement;

    // Constants.
    this.kBackgroundOpacity = 0.8;
    this.kOuterBorderSize = 1;
    this.kAnimateMs = 100;

    // Default values.
    this._value = 0;
    this._duration = 0;
    this._width = 64;
    this._height = 64;
    this._borderBg = 'black';
    this._borderFg = 'grey';
    this._scale = 1;
    this._hideAfter = -1;
    this._icon = '';
    this._zoom = 20;
    this._text = 'remain';
    this._textColor = 'white';
    this._colorBorderSize = 2;
    this.startTimeMs = 0;
    this._timer = 0;
    this._hideTimer = 0;

    if (this.duration !== null)
      this._duration = Math.max(parseFloat(this.duration), 0);
    if (this.width !== null)
      this._width = Math.max(parseInt(this.width), 1);
    if (this.height !== null)
      this._height = Math.max(parseInt(this.height), 1);
    if (this.bordercolor !== null)
      this._borderFg = this.bordercolor;
    if (this.bordersize !== null)
      this._colorBorderSize = Math.max(parseInt(this.bordersize), 0);
    if (this.scale !== null)
      this._scale = Math.max(parseFloat(this.scale), 0.01);
    if (this.hideafter !== null && this.hideafter !== '')
      this._hideAfter = Math.max(parseFloat(this.hideafter), 0);
    if (this.icon !== null)
      this._icon = this.icon;
    if (this.zoom !== null)
      this._zoom = Math.max(parseInt(this.zoom), 0);
    if (this.text !== null)
      this._text = this.text;
    if (this.textcolor !== null)
      this._textColor = this.textcolor;
  }

  init(root: ShadowRoot): void {
    root.innerHTML = `
      <style>
        .text {
          position: absolute;
          font-family: arial;
          text-shadow: -1px 0 3px black, 0 1px 3px black, 1px 0 3px black, 0 -1px 3px black;
          will-change: content;
        }
        #border-bg {
          position: absolute;
        }
        #border-fg {
          position: absolute;
        }
        #icon {
          position: absolute;
          will-change: content;
        }
        #text {
          position: absolute;
          overflow: hidden;
          word-break: break-all;
        }
      </style>
      <div id="root" style="position: relative">
        <div id="border-bg"></div>
        <div id="border-fg"></div>
        <div id="icon"></div>
        <div id="text" class="text"></div>
      </div>
    `;
  }

  connectedCallback(): void {
    this._connected = true;
    this.layout();
    this.reset();
  }

  disconnectedCallback(): void {
    this._connected = false;
  }

  attributeChangedCallback(name: string, oldValue: string | number, newValue: string): void {
    if (name === 'duration') {
      this._duration = Math.max(parseFloat(newValue), 0);
      this.reset();
    } else if (name === 'width') {
      this._width = Math.max(parseInt(newValue), 1);
      this.layout();
    } else if (name === 'height') {
      this._height = Math.max(parseInt(newValue), 1);
      this.layout();
    } else if (name === 'bordercolor') {
      this._borderFg = newValue;
      this.layout();
    } else if (name === 'bordersize') {
      this._colorBorderSize = Math.max(parseInt(newValue), 0);
      this.layout();
    } else if (name === 'icon') {
      this._icon = newValue;
      this.layout();
    } else if (name === 'zoom') {
      this._zoom = Math.max(parseInt(newValue), 0);
      this.layout();
    } else if (name === 'text') {
      this._text = newValue;
    } else if (name === 'textcolor') {
      this._textColor = newValue;
    }


    if (this._connected)
      this.draw();
  }

  layout(): void {
    if (!this._connected)
      return;

    const borderBackgroundStyle = this.borderBackgroundElement.style;
    const borderForegroundStyle = this.borderForegroundElement.style;
    const iconStyle = this.iconElement.style;
    const textStyle = this.textElement.style;

    borderBackgroundStyle.backgroundColor = this._borderBg;
    borderBackgroundStyle.opacity = this.kBackgroundOpacity.toString();

    borderBackgroundStyle.width = (this._width * this._scale).toString();
    borderBackgroundStyle.height = (this._height * this._scale).toString();

    const borderPadding = this.kOuterBorderSize * 2 + this._colorBorderSize * 2;
    borderForegroundStyle.width = ((this._width - borderPadding) * this._scale).toString();
    borderForegroundStyle.height = ((this._height - borderPadding) * this._scale).toString();
    borderForegroundStyle.borderWidth = (this._colorBorderSize * this._scale).toString();
    borderForegroundStyle.borderColor = this._borderFg;
    borderForegroundStyle.borderStyle = 'solid';
    borderForegroundStyle.left = (this.kOuterBorderSize * this._scale).toString();
    borderForegroundStyle.top = (this.kOuterBorderSize * this._scale).toString();

    const iconLeft = (this.kOuterBorderSize * 2 + this._colorBorderSize) * this._scale;
    const iconTop = (this.kOuterBorderSize * 2 + this._colorBorderSize) * this._scale;
    const iconPadding = this.kOuterBorderSize * 4 + this._colorBorderSize * 2;
    const iconWidth = (this._width - iconPadding) * this._scale;
    const iconHeight = (this._height - iconPadding) * this._scale;
    const textHeight = Math.ceil(Math.min(iconWidth, iconHeight) / 1.8);
    iconStyle.width = iconWidth.toString();
    iconStyle.height = iconHeight.toString();
    iconStyle.left = iconLeft.toString();
    iconStyle.top = iconTop.toString();
    iconStyle.backgroundImage = `url('${this._icon}')`;
    iconStyle.backgroundSize = `${Math.min(iconWidth, iconHeight) + this._zoom * this._scale}px`;
    iconStyle.backgroundPosition = 'center center';

    textStyle.top = (iconTop + (iconHeight - textHeight) / 2).toString();
    textStyle.left = iconLeft.toString();
    textStyle.width = iconWidth.toString();
    // Other languages' character can be higher, +5 to make them display completely.
    textStyle.height = (textHeight + 5).toString();
    textStyle.fontSize = textHeight.toString();
    textStyle.textAlign = 'center';
    textStyle.fontWeight = 'bold';
    textStyle.color = this._textColor;
  }

  draw(): void {
    if (this._text === 'remain') {
      const intRemain = Math.ceil(this._value);
      if (intRemain > 0)
        this.textElement.innerText = intRemain.toString();
      else
        this.textElement.innerText = '';
    } else if (this._text === 'percent') {
      let percent = this._duration <= 0 ? 1 : this._value / this._duration;
      // Keep it between 0 and 1.
      percent = Math.min(1, Math.max(0, percent));
      this.textElement.innerText = (percent * 100).toFixed(0);
    } else if (this._text === 'elapsed') {
      const intelapsed = (this._duration - this._value).toFixed(0);
      this.textElement.innerText = intelapsed;
    } else {
      this.textElement.innerHTML = this._text;
    }
  }

  reset(): void {
    if (!this._connected)
      return;

    this.startTimeMs = +new Date();

    this.rootElement.style.display = 'block';
    clearTimeout(this._hideTimer ?? 0);
    this._hideTimer = null;
    clearTimeout(this._timer ?? 0);
    this._timer = null;

    this._value = this._duration;
    this.advance();
  }

  advance(): void {
    this._value = this._duration + (this.startTimeMs - new Date().getTime()) / 1000;
    if (this._value <= 0) {
      this._value = 0;
      if (this._hideAfter >= 0) {
        this._hideTimer = window.setTimeout(() => {
          this.rootElement.style.display = 'none';
        }, this._hideAfter);
      }
    } else {
      this._timer = window.setTimeout(() => {
        this.advance();
      }, this.kAnimateMs);
    }
    this.draw();
  }
}

window.customElements.define('timer-icon', TimerIcon);

declare global {
  interface HTMLElementTagNameMap {
    'timer-icon': TimerIcon;
  }
}
