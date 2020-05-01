'use strict';

class ResourceBar extends HTMLElement {
  static get observedAttributes() {
    return ['value', 'maxvalue', 'lefttext', 'centertext', 'righttext', 'width', 'height', 'bg', 'fg', 'toward', 'extravalue', 'extracolor'];
  }

  // All visual dimensions are scaled by this.
  set scale(s) {
    this.setAttribute('scale', s);
  }
  get scale() {
    return this.getAttribute('scale');
  }

  // Background color.
  set bg(c) {
    this.setAttribute('bg', c);
  }
  get bg() {
    return this.getAttribute('bg');
  }

  set extraColor(c) {
    this.setAttribute('extraColor', c);
  }
  get extraColor() {
    return this.getAttribute('extraColor');
  }

  // Foreground color.
  set fg(c) {
    this.setAttribute('fg', c);
  }
  get fg() {
    return this.getAttribute('fg');
  }

  // The width of the bar, in pixels (before |scale|).
  set width(w) {
    this.setAttribute('width', w);
  }
  get width() {
    return this.getAttribute('width');
  }

  // The height of the bar, in pixels (before |scale|).
  set height(w) {
    this.setAttribute('height', w);
  }
  get height() {
    return this.getAttribute('height');
  }

  // A value between 0 and |maxvalue|, indicating the amount of progress.
  set value(s) {
    this.setAttribute('value', s);
  }
  get value() {
    return this.getAttribute('value');
  }

  // A value between 0 and |maxvalue|, indicating the amount of "extra"
  // resource that exists.  Usually used for shields on a health bar.
  set extraValue(s) {
    this.setAttribute('extravalue', s);
  }
  get extraValue() {
    return this.getAttribute('extravalue');
  }

  // The maximum value where when reached the progress bar will show 100%.
  set maxvalue(s) {
    this.setAttribute('maxvalue', s);
  }
  get maxvalue() {
    return this.getAttribute('maxvalue');
  }

  // If "right" then fills left-to-right (the default). If "left" then
  // fills right-to-left.
  set toward(t) {
    this.setAttribute('toward', t);
  }
  get toward() {
    return this.getAttribute('toward');
  }

  // If "fill" then the progress goes empty-to-full, if "empty" then the
  // progress bar starts full and goes to empty.
  set style(s) {
    this.setAttribute('style', s);
  }
  get style() {
    return this.getAttribute('style');
  }

  // Chooses what should be shown in the text field in each area of
  // the bar. Can be one of:
  // empty - nothing is shown.
  // "value" - shows the current raw value.
  // "maxvalue" - shows the current and maximum raw values.
  // "percent" - shows the percentage.
  // anything else - the given text is shown literally.
  set lefttext(p) {
    this.setAttribute('lefttext', p);
  }
  get lefttext() {
    return this.getAttribute('lefttext');
  }
  set righttext(p) {
    this.setAttribute('righttext', p);
  }
  get righttext() {
    return this.getAttribute('righttext');
  }
  set centertext(p) {
    this.setAttribute('centertext', p);
  }
  get centertext() {
    return this.getAttribute('centertext');
  }

  // This would be used with window.customElements.
  constructor() {
    super();
    let root = this.attachShadow({ mode: 'open' });
    this.init(root);
  }

  // These would be used by document.registerElement, which is deprecated but
  // ACT uses an old CEF which has this instead of the newer APIs.
  createdCallback() {
    let root = this.createShadowRoot();
    this.init(root);
  }
  // Convert from the deprecated API names to the modern API names.
  attachedCallback() {
    this.connectedCallback();
  }
  detachedCallback() {
    this.disconnectedCallback();
  }

  init(root) {
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

  connectedCallback() {
    this.foregroundElement = this.shadowRoot.getElementById('fg');
    this.backgroundElement = this.shadowRoot.getElementById('bg');
    this.extraUnderElement = this.shadowRoot.getElementById('extra-under');
    this.extraOverElement = this.shadowRoot.getElementById('extra-over');
    this.backgroundElement = this.shadowRoot.getElementById('bg');
    this.leftTextElement = this.shadowRoot.getElementById('lefttext');
    this.centerTextElement = this.shadowRoot.getElementById('centertext');
    this.rightTextElement = this.shadowRoot.getElementById('righttext');

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
    this._styleFill = true;
    this._leftText = '';
    this._centerText = '';
    this._rightText = '';

    if (this.value != null) this._value = Math.max(parseFloat(this.value), 0);
    if (this.maxvalue != null) this._maxValue = Math.max(parseFloat(this.maxvalue), 0);
    if (this.extraValue != null) this._extraValue = Math.max(0, this.extraValue);
    if (this.extraColor != null) this._extraColor = this.extraColor;
    if (this.width != null) this._width = Math.max(parseInt(this.width), 1);
    if (this.height != null) this._height = Math.max(parseInt(this.height), 1);
    if (this.bg != null) this._bg = this.bg;
    if (this.fg != null) this._fg = this.fg;
    if (this.scale != null) this._scale = Math.max(parseFloat(this.scale), 0.01);
    if (this.toward != null) this._towardRight = this.toward != 'left';
    if (this.style != null) this._styleFill = this.style != 'empty';
    if (this.lefttext != null) this._leftText = this.lefttext;
    if (this.centertext != null) this._centerText = this.centertext;
    if (this.righttext != null) this._rightText = this.righttext;

    this._connected = true;
    this.layout();
    this.updateText();
    this.draw();
  }

  disconnectedCallback() {
    this._connected = false;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == 'value') {
      this._value = Math.max(parseFloat(newValue), 0);
    } else if (name == 'maxvalue') {
      this._maxValue = Math.max(parseFloat(newValue), 0);
    } else if (name == 'width') {
      this._width = Math.max(parseInt(newValue), 1);
      this.layout();
    } else if (name == 'height') {
      this._height = Math.max(parseInt(newValue), 1);
      this.layout();
    } else if (name == 'bg') {
      this._bg = newValue;
      this.layout();
    } else if (name == 'fg') {
      this._fg = newValue;
      this.layout();
    } else if (name == 'toward') {
      this._towardRight = newValue != 'left';
      this.layout();
    } else if (name == 'lefttext') {
      let update = newValue != this._leftText && this._connected;
      this._leftText = newValue;
      if (update)
        this.updateText();
    } else if (name == 'centertext') {
      let update = newValue != this._centerText && this._connected;
      this._centerText = newValue;
      if (update)
        this.updateText();
    } else if (name == 'righttext') {
      let update = newValue != this._rightText && this._connected;
      this._rightText = newValue;
      if (update)
        this.updateText();
    } else if (name == 'extravalue') {
      this._extraValue = Math.max(parseInt(newValue), 0);
    } else if (name == 'extracolor') {
      this._extraColor = newValue;
      this.layout();
    }

    if (this._connected)
      this.draw();
  }

  layout() {
    if (!this._connected)
      return;

    // To start full and animate to empty, we animate backwards and flip
    // the direction.
    if (!this._styleFill)
      this._towardRight = !this._towardRight;

    let backgroundStyle = this.backgroundElement.style;
    let foregroundStyle = this.foregroundElement.style;
    let extraUnderStyle = this.extraUnderElement.style;
    let extraOverStyle = this.extraOverElement.style;
    let lTextStyle = this.leftTextElement.style;
    let cTextStyle = this.centerTextElement.style;
    let rTextStyle = this.rightTextElement.style;

    backgroundStyle.backgroundColor = this._bg;
    foregroundStyle.backgroundColor = this._fg;
    extraUnderStyle.backgroundColor = this._extraColor;
    extraOverStyle.backgroundColor = this._extraColor;

    backgroundStyle.opacity = this.kBackgroundOpacity;

    backgroundStyle.width = this._width * this._scale;
    backgroundStyle.height = this._height * this._scale;

    let updateBar = (style) => {
      style.width = (this._width - this.kBorderSize * 2) * this._scale;
      style.height = (this._height - this.kBorderSize * 2) * this._scale;
      style.left = this.kBorderSize * this._scale;
      style.top = this.kBorderSize * this._scale;
      if (this._towardRight)
        style.transformOrigin = '0% 0%';
      else
        style.transformOrigin = '100% 0%';
    };
    updateBar(foregroundStyle);
    updateBar(extraUnderStyle);
    updateBar(extraOverStyle);

    let halfHeight = (this._height - this.kBorderSize * 2) * this._scale * 0.5;
    extraOverStyle.height = halfHeight;
    extraOverStyle.top = halfHeight + (this.kBorderSize * this._scale);

    let widthPadding = this.kBorderSize * 4 + this.kTextLeftRightEdgePadding * 2;
    lTextStyle.width = (this._width - widthPadding) * this._scale;
    let heightPadding = this.kBorderSize * 4 + this.kTextTopBottomEdgePadding * 2;
    lTextStyle.height = (this._height - heightPadding) * this._scale;
    lTextStyle.left = (this.kBorderSize + this.kTextLeftRightEdgePadding) * this._scale;
    lTextStyle.top = (this.kBorderSize + this.kTextTopBottomEdgePadding) * this._scale;
    lTextStyle.fontSize = lTextStyle.height;

    cTextStyle.width = rTextStyle.width = lTextStyle.width;
    cTextStyle.height = rTextStyle.height = lTextStyle.height;
    cTextStyle.left = rTextStyle.left = lTextStyle.left;
    cTextStyle.top = rTextStyle.top = lTextStyle.top;
    cTextStyle.fontSize = rTextStyle.fontSize = lTextStyle.fontSize;
  }

  updateText() {
    // These values are filled in during draw() when the values change.
    if (this._leftText != 'value' && this._leftText != 'maxvalue' &&
        this._leftText != 'percent') {
      // Otherwise the value is fixed so it can be set here.
      this.leftTextElement.innerHTML = this._leftText;
    }
    if (this._centerText != 'value' && this._centerText != 'maxvalue' &&
        this._centerText != 'percent')
      this.centerTextElement.innerHTML = this._centerText;

    if (this._rightText != 'value' && this._rightText != 'maxvalue' &&
        this._rightText != 'percent')
      this.rightTextElement.innerHTML = this._rightText;
  }

  draw() {
    let percent = this._maxValue <= 0 ? 1 : this._value / this._maxValue;
    // Keep it between 0 and 1.
    percent = Math.min(1, Math.max(0, percent));
    if (!this._styleFill)
      percent = 1.0 - percent;
    this.foregroundElement.style.transform = 'scale(' + percent + ',1)';

    // Calculate extra bars.
    let extraUnderPercent =
      Math.min(this._maxValue - this._value, this._extraValue) / this._maxValue;
    let valueWidth = percent * this.foregroundElement.clientWidth * (this._towardRight ? 1 : -1);
    this.extraUnderElement.style.transform = 'translate(' + valueWidth + 'px,0px)' +
      ' scale(' + extraUnderPercent + ',1)';

    let extraOverPercent =
      Math.max(this._extraValue + this._value - this._maxValue, 0) / this._maxValue;
    if (!this._maxValue)
      extraOverPercent = 0;
    this.extraOverElement.style.transform = 'scale(' + extraOverPercent + ',1)';

    // Text.
    let totalValue = this._value + this._extraValue;
    let totalPercent = totalValue / this._maxValue;
    if (this._leftText != '') {
      if (this._leftText == 'value')
        this.leftTextElement.innerHTML = totalValue;
      else if (this._leftText == 'maxvalue')
        this.leftTextElement.innerHTML = totalValue + ' / ' + this._maxValue;
      else if (this._leftText == 'percent')
        this.leftTextElement.innerHTML = parseInt(totalPercent * 100) + ' %';
    }
    if (this._centerText != '') {
      if (this._centerText == 'value')
        this.centerTextElement.innerHTML = totalValue;
      else if (this._centerText == 'maxvalue')
        this.centerTextElement.innerHTML = totalValue + ' / ' + this._maxValue;
      else if (this._centerText == 'percent')
        this.centerTextElement.innerHTML = parseInt(totalPercent * 100) + ' %';
    }
    if (this._rightText != '') {
      if (this._rightText == 'value')
        this.rightTextElement.innerHTML = totalValue;
      else if (this._rightText == 'maxvalue')
        this.rightTextElement.innerHTML = totalValue + ' / ' + this._maxValue;
      else if (this._rightText == 'percent')
        this.rightTextElement.innerHTML = parseInt(totalPercent * 100) + ' %';
    }
  }
}

if (window.customElements) {
  // Preferred method but old CEF doesn't have this.
  window.customElements.define('resource-bar', ResourceBar);
} else {
  document.registerElement('resource-bar', {
    prototype: Object.create(ResourceBar.prototype),
  });
}
