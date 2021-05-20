export default class ResourceBar extends HTMLElement {
  foregroundElement: HTMLDivElement;
  backgroundElement: HTMLDivElement;
  extraUnderElement: HTMLDivElement;
  extraOverElement: HTMLDivElement;
  leftTextElement: HTMLDivElement;
  centerTextElement: HTMLDivElement;
  rightTextElement: HTMLDivElement;
  private kBackgroundOpacity: number;
  private kBorderSize: number;
  private kTextLeftRightEdgePadding: number;
  private kTextTopBottomEdgePadding: number;
  private _value: number;
  private _maxValue: number;
  private _width: number;
  private _height: number;
  private _bg: string;
  private _fg: string;
  private _extraColor: string;
  private _extraValue: number;
  private _scale: number;
  private _towardRight: boolean;
  private _fill: boolean;
  private _leftText: string;
  private _centerText: string;
  private _rightText: string;
  private _connected: boolean;

  static get observedAttributes(): string[] {
    return ['value', 'maxvalue', 'lefttext', 'centertext', 'righttext', 'width', 'height', 'bg', 'fg', 'toward', 'stylefill', 'extravalue', 'extracolor'];
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

  set extracolor(c: string | null) {
    if (c === null)
      this.removeAttribute('extracolor');
    else
      this.setAttribute('extracolor', c);
  }
  get extracolor(): string | null {
    return this.getAttribute('extraColor');
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

  // The width of the bar, in pixels (before |scale|).
  set width(w: string | null) {
    if (w === null)
      this.removeAttribute('width');
    else
      this.setAttribute('width', w);
  }
  get width(): string | null {
    return this.getAttribute('width');
  }

  // The height of the bar, in pixels (before |scale|).
  set height(w: string | null) {
    if (w === null)
      this.removeAttribute('height');
    else
      this.setAttribute('height', w);
  }
  get height(): string | null {
    return this.getAttribute('height');
  }

  // A value between 0 and |maxvalue|, indicating the amount of progress.
  set value(s: string | null) {
    if (s === null)
      this.removeAttribute('value');
    else
      this.setAttribute('value', s);
  }
  get value(): string | null {
    return this.getAttribute('value');
  }

  // A value between 0 and |maxvalue|, indicating the amount of "extra"
  // resource that exists.  Usually used for shields on a health bar.
  set extravalue(s: string | null) {
    if (s === null)
      this.removeAttribute('extravalue');
    else
      this.setAttribute('extravalue', s);
  }
  get extravalue(): string | null {
    return this.getAttribute('extravalue');
  }

  // The maximum value where when reached the progress bar will show 100%.
  set maxvalue(s: string | null) {
    if (s === null)
      this.removeAttribute('maxvalue');
    else
      this.setAttribute('maxvalue', s);
  }
  get maxvalue(): string | null {
    return this.getAttribute('maxvalue');
  }

  // If "right" then fills left-to-right (the default). If "left" then
  // fills right-to-left.
  set toward(t: string | null) {
    if (t === null)
      this.removeAttribute('toward');
    else
      this.setAttribute('toward', t);
  }
  get toward(): string | null {
    return this.getAttribute('toward');
  }

  // If "fill" then the progress goes empty-to-full, if "empty" then the
  // progress bar starts full and goes to empty.
  set stylefill(s: 'empty' | 'full' | null) {
    if (s === null)
      this.removeAttribute('stylefill');
    else
      this.setAttribute('stylefill', s);
  }
  get stylefill(): 'empty' | 'full' | null {
    return this.getAttribute('stylefill') as 'empty' | 'full' | null;
  }

  // Chooses what should be shown in the text field in each area of
  // the bar. Can be one of:
  // empty - nothing is shown.
  // "value" - shows the current raw value.
  // "maxvalue" - shows the current and maximum raw values.
  // "percent" - shows the percentage.
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

  // This would be used with window.customElements.
  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    this.init(root);

    this._connected = false;

    this.foregroundElement = this.shadowRoot?.getElementById('fg') as HTMLDivElement;
    this.backgroundElement = this.shadowRoot?.getElementById('bg') as HTMLDivElement;
    this.extraUnderElement = this.shadowRoot?.getElementById('extra-under') as HTMLDivElement;
    this.extraOverElement = this.shadowRoot?.getElementById('extra-over') as HTMLDivElement;
    this.leftTextElement = this.shadowRoot?.getElementById('lefttext') as HTMLDivElement;
    this.centerTextElement = this.shadowRoot?.getElementById('centertext') as HTMLDivElement;
    this.rightTextElement = this.shadowRoot?.getElementById('righttext') as HTMLDivElement;
    // Constants.
    this.kBackgroundOpacity = 0.8;
    this.kBorderSize = 1;
    this.kTextLeftRightEdgePadding = this.kBorderSize * 3;
    this.kTextTopBottomEdgePadding = this.kBorderSize * 2;

    // Default values.
    this._value = 0;
    this._maxValue = 1;
    this._width = 200;
    this._height = 20;
    this._bg = 'rgba(0, 0, 0, 0.7)';
    this._fg = 'green';
    this._extraColor = 'yellow';
    this._extraValue = 0;
    this._scale = 1;
    this._towardRight = true;
    this._fill = true;
    this._leftText = '';
    this._centerText = '';
    this._rightText = '';

    if (this.value !== null)
      this._value = Math.max(parseFloat(this.value), 0);
    if (this.maxvalue !== null)
      this._maxValue = Math.max(parseFloat(this.maxvalue), 0);
    if (this.extravalue !== null)
      this._extraValue = Math.max(0, parseInt(this.extravalue));
    if (this.extracolor !== null)
      this._extraColor = this.extracolor;
    if (this.width !== null)
      this._width = Math.max(parseInt(this.width), 1);
    if (this.height !== null)
      this._height = Math.max(parseInt(this.height), 1);
    if (this.bg !== null)
      this._bg = this.bg;
    if (this.fg !== null)
      this._fg = this.fg;
    if (this.scale !== null)
      this._scale = Math.max(parseFloat(this.scale), 0.01);
    if (this.toward !== null)
      this._towardRight = this.toward !== 'left';
    if (this.stylefill !== null)
      this._fill = this.stylefill !== 'empty';
    if (this.lefttext !== null)
      this._leftText = this.lefttext;
    if (this.centertext !== null)
      this._centerText = this.centertext;
    if (this.righttext !== null)
      this._rightText = this.righttext;
  }

  // // These would be used by document.registerElement, which is deprecated but
  // // ACT uses an old CEF which has this instead of the newer APIs.
  // createdCallback(): void {
  //   const root = this.createShadowRoot();
  //   this.init(root);
  // }
  // createShadowRoot(): void {
  //   throw new Error("Method not implemented.");
  // }
  // // Convert from the deprecated API names to the modern API names.
  // attachedCallback(): void {
  //   this.connectedCallback();
  // }
  // detachedCallback(): void {
  //   this.disconnectedCallback();
  // }

  init(root: ShadowRoot): void {
    root.innerHTML = `
      <style>
        #bg {
          position: absolute;
        }
        #fg, #extra-under, #extra-over {
          opacity: 1.0;
          position: absolute;
          will-change: transform;
        }
        .text {
          position: absolute;
          font-family: arial;
          font-weight: bold;
          color: white;
          text-shadow: -1px 0 3px black, 0 1px 3px black, 1px 0 3px black, 0 -1px 3px black;
          will-change: content;
        }
        #lefttext {
          text-align: left;
        }
        #centertext {
          text-align: center;
        }
        #righttext {
          text-align: right;
        }
      </style>
      <div style="position: relative">
        <div id="bg"></div>
        <div id="extra-under"></div>
        <div id="fg"></div>
        <div id="extra-over"></div>
        <div id="righttext" class="text"></div>
        <div id="centertext" class="text"></div>
        <div id="lefttext" class="text"></div>
      </div>
    `;
  }

  connectedCallback(): void {
    this._connected = true;
    this.layout();
    this.updateText();
    this.draw();
  }

  disconnectedCallback(): void {
    this._connected = false;
  }

  attributeChangedCallback(name: string, oldValue: string | number, newValue: string): void {
    if (name === 'value') {
      this._value = Math.max(parseFloat(newValue), 0);
    } else if (name === 'maxvalue') {
      this._maxValue = Math.max(parseFloat(newValue), 0);
    } else if (name === 'width') {
      this._width = Math.max(parseInt(newValue), 1);
      this.layout();
    } else if (name === 'height') {
      this._height = Math.max(parseInt(newValue), 1);
      this.layout();
    } else if (name === 'bg') {
      this._bg = newValue;
      this.layout();
    } else if (name === 'fg') {
      this._fg = newValue;
      this.layout();
    } else if (name === 'toward') {
      this._towardRight = newValue !== 'left';
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
    } else if (name === 'extravalue') {
      this._extraValue = Math.max(parseInt(newValue), 0);
    } else if (name === 'extracolor') {
      this._extraColor = newValue;
      this.layout();
    }

    if (this._connected)
      this.draw();
  }

  layout(): void {
    if (!this._connected)
      return;

    // To start full and animate to empty, we animate backwards and flip
    // the direction.
    if (!this._fill)
      this._towardRight = !this._towardRight;

    const backgroundStyle = this.backgroundElement.style;
    const foregroundStyle = this.foregroundElement.style;
    const extraUnderStyle = this.extraUnderElement.style;
    const extraOverStyle = this.extraOverElement.style;
    const lTextStyle = this.leftTextElement.style;
    const cTextStyle = this.centerTextElement.style;
    const rTextStyle = this.rightTextElement.style;

    backgroundStyle.backgroundColor = this._bg;
    foregroundStyle.backgroundColor = this._fg;
    extraUnderStyle.backgroundColor = this._extraColor;
    extraOverStyle.backgroundColor = this._extraColor;

    backgroundStyle.opacity = this.kBackgroundOpacity.toString();

    backgroundStyle.width = (this._width * this._scale).toString();
    backgroundStyle.height = (this._height * this._scale).toString();

    const updateBar = (style: CSSStyleDeclaration) => {
      style.width = ((this._width - this.kBorderSize * 2) * this._scale).toString();
      style.height = ((this._height - this.kBorderSize * 2) * this._scale).toString();
      style.left = (this.kBorderSize * this._scale).toString();
      style.top = (this.kBorderSize * this._scale).toString();
      if (this._towardRight)
        style.transformOrigin = '0% 0%';
      else
        style.transformOrigin = '100% 0%';
    };
    updateBar(foregroundStyle);
    updateBar(extraUnderStyle);
    updateBar(extraOverStyle);

    const halfHeight = (this._height - this.kBorderSize * 2) * this._scale * 0.5;
    extraOverStyle.height = (halfHeight).toString();
    extraOverStyle.top = (halfHeight + (this.kBorderSize * this._scale)).toString();

    const widthPadding = this.kBorderSize * 4 + this.kTextLeftRightEdgePadding * 2;
    lTextStyle.width = ((this._width - widthPadding) * this._scale).toString();
    const heightPadding = this.kBorderSize * 4 + this.kTextTopBottomEdgePadding * 2;
    lTextStyle.height = ((this._height - heightPadding) * this._scale).toString();
    lTextStyle.left =
      ((this.kBorderSize + this.kTextLeftRightEdgePadding) * this._scale).toString();
    lTextStyle.top = ((this.kBorderSize + this.kTextTopBottomEdgePadding) * this._scale).toString();
    lTextStyle.fontSize = lTextStyle.height;

    cTextStyle.width = rTextStyle.width = lTextStyle.width;
    cTextStyle.height = rTextStyle.height = lTextStyle.height;
    cTextStyle.left = rTextStyle.left = lTextStyle.left;
    cTextStyle.top = rTextStyle.top = lTextStyle.top;
    cTextStyle.fontSize = rTextStyle.fontSize = lTextStyle.fontSize;
  }

  updateText(): void {
    // These values are filled in during draw() when the values change.
    if (this._leftText !== 'value' && this._leftText !== 'maxvalue' &&
        this._leftText !== 'percent') {
      // Otherwise the value is fixed so it can be set here.
      this.leftTextElement.innerHTML = this._leftText;
    }
    if (this._centerText !== 'value' && this._centerText !== 'maxvalue' &&
        this._centerText !== 'percent')
      this.centerTextElement.innerHTML = this._centerText;

    if (this._rightText !== 'value' && this._rightText !== 'maxvalue' &&
        this._rightText !== 'percent')
      this.rightTextElement.innerHTML = this._rightText;
  }

  draw(): void {
    let percent = this._maxValue <= 0 ? 1 : this._value / this._maxValue;
    // Keep it between 0 and 1.
    percent = Math.min(1, Math.max(0, percent));
    if (!this._fill)
      percent = 1.0 - percent;
    this.foregroundElement.style.transform = `scale(${percent},1)`;

    // Calculate extra bars.
    const extraUnderPercent =
      Math.min(this._maxValue - this._value, this._extraValue) / this._maxValue;
    const valueWidth = percent * this.foregroundElement.clientWidth * (this._towardRight ? 1 : -1);
    this.extraUnderElement.style.transform = `translate(${valueWidth}px,0px) scale(${extraUnderPercent},1)`;

    let extraOverPercent =
      Math.max(this._extraValue + this._value - this._maxValue, 0) / this._maxValue;
    if (!this._maxValue)
      extraOverPercent = 0;
    this.extraOverElement.style.transform = `scale(${extraOverPercent},1)`;

    // Text.
    const totalValue = this._value + this._extraValue;
    const totalPercent = totalValue / this._maxValue;
    if (this._leftText !== '') {
      if (this._leftText === 'value')
        this.leftTextElement.innerHTML = totalValue.toString();
      else if (this._leftText === 'maxvalue')
        this.leftTextElement.innerHTML = `${totalValue} / ${this._maxValue}`;
      else if (this._leftText === 'percent')
        this.leftTextElement.innerHTML = `${(totalPercent * 100).toFixed()} %`;
    }
    if (this._centerText !== '') {
      if (this._centerText === 'value')
        this.centerTextElement.innerHTML = totalValue.toString();
      else if (this._centerText === 'maxvalue')
        this.centerTextElement.innerHTML = `${totalValue} / ${this._maxValue}`;
      else if (this._centerText === 'percent')
        this.centerTextElement.innerHTML = `${(totalPercent * 100).toFixed()} %`;
    }
    if (this._rightText !== '') {
      if (this._rightText === 'value')
        this.rightTextElement.innerHTML = totalValue.toString();
      else if (this._rightText === 'maxvalue')
        this.rightTextElement.innerHTML = `${totalValue} / ${this._maxValue}`;
      else if (this._rightText === 'percent')
        this.rightTextElement.innerHTML = `${(totalPercent * 100).toFixed()} %`;
    }
  }
}

window.customElements.define('resource-bar', ResourceBar);
