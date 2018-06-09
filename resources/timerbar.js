'use strict';

class TimerBar extends HTMLElement {
  static get observedAttributes() {
    return ['duration', 'value', 'elapsed', 'hideafter', 'lefttext', 'centertext', 'righttext', 'width', 'height', 'bg', 'fg', 'style', 'toward'];
  }

  // Background color.
  set bg(c) {
    this.setAttribute('bg', c);
  }
  get bg() {
    return this.getAttribute('bg');
  }

  // Foreground color.
  set fg(c) {
    this.setAttribute('fg', c);
  }
  get fg() {
    return this.getAttribute('fg');
  }

  // The width of the bar.
  set width(w) {
    this.setAttribute('width', w);
  }
  get width() {
    return this.getAttribute('width');
  }

  // The height of the bar.
  set height(w) {
    this.setAttribute('height', w);
  }
  get height() {
    return this.getAttribute('height');
  }

  // The total length of time to count down.
  set duration(s) {
    this.attributeChangedCallback('duration', this.duration, s);
  }
  get duration() {
    return this._duration.toString();
  }

  // The length remaining in the count down.
  set value(s) {
    this.attributeChangedCallback('value', this.value, s);
  }
  get value() {
    if (!this._start) return this._duration.toString();
    let elapsedMs = new Date() - this._start;
    return Math.max(0, this._duration - (elapsedMs / 1000)).toString();
  }

  // The elapsed time.
  set elapsed(s) {
    this.attributeChangedCallback('elapsed', this.elapsed, s);
  }
  get elapsed() {
    if (!this._start) return '0';
    return ((new Date() - this._start) / 1000).toString();
  }

  // If "right" then animates left-to-right (the default). If "left"
  // then animates right-to-left.
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

  // When the bar reaches 0, it is hidden after this many seconds. If ""
  // then it is not hidden.
  set hideafter(h) {
    this.setAttribute('hideafter', h);
  }
  get hideafter() {
    return this.getAttribute('hideafter');
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
    // Default values.
    this._duration = 0;
    this._width = '100%';
    this._height = '100%';
    this._bg = 'black';
    this._fg = 'yellow';
    this._toward_right = false;
    this._style_fill = false;
    this._left_text = '';
    this._center_text = '';
    this._right_text = '';
    this._hideafter = -1;

    root.innerHTML = `
      <style>
        .timerbar-root {
          position: relative;
        }
        .timerbar-bg {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0.8;
        }
        .timerbar-fg {
          position: absolute;
          left: 1px;
          top: 1px;
          width: calc(100% - 2px);
          height: calc(100% - 2px);
          opacity: 1.0;
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
        .text-container {
          position: absolute;
          left: 0px;
          top: calc(50% - 1.2ex);
          width: calc(100% - 0px);
          height: calc(100% - 2px);
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
      </style>
      <div id="root" class="timerbar-root">
        <div id="bg" class="timerbar-bg"></div>
        <div id="fg" class="timerbar-fg"></div>
        <div class="text-container"><div id="righttext" class="text timerbar-righttext"></div></div>
        <div class="text-container"><div id="centertext" class="text timerbar-centertext"></div></div>
        <div class="text-container"><div id="lefttext" class="text timerbar-lefttext"></div></div>
      </div>
    `;
  }

  connectedCallback() {
    this.rootElement = this.shadowRoot.getElementById('root');
    this.foregroundElement = this.shadowRoot.getElementById('fg');
    this.backgroundElement = this.shadowRoot.getElementById('bg');
    this.leftTextElement = this.shadowRoot.getElementById('lefttext');
    this.centerTextElement = this.shadowRoot.getElementById('centertext');
    this.rightTextElement = this.shadowRoot.getElementById('righttext');

    this._connected = true;
    this.layout();
    this.updateText();
    if (this._start == null)
      this.setvalue(this._duration);
    else
      this.advance();
  }

  disconnectedCallback() {
    this._connected = false;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == 'duration') {
      this._duration = Math.max(parseFloat(newValue), 0);
      this.setvalue(this._duration);
    } else if (name == 'value') {
      this.setvalue(Math.max(parseFloat(newValue), 0));
    } else if (name == 'elapsed') {
      this.setvalue(this._duration - Math.max(parseFloat(newValue), 0));
    } else if (name == 'width') {
      this._width = newValue;
      this.layout();
    } else if (name == 'height') {
      this._height = newValue;
      this.layout();
    } else if (name == 'bg') {
      this._bg = newValue;
      this.layout();
    } else if (name == 'fg') {
      this._fg = newValue;
      this.layout();
    } else if (name == 'style') {
      this._style_fill = newValue == 'fill';
      this.layout();
    } else if (name == 'toward') {
      this._toward_right = newValue == 'right';
      this.layout();
    } else if (name == 'lefttext') {
      let update = newValue != this._left_text && this._connected;
      this._left_text = newValue;
      if (update)
        this.updateText();
    } else if (name == 'centertext') {
      let update = newValue != this._center_text && this._connected;
      this._center_text = newValue;
      if (update)
        this.updateText();
    } else if (name == 'righttext') {
      let update = newValue != this._right_text && this._connected;
      this._right_text = newValue;
      if (update)
        this.updateText();
    } else if (name == 'hideafter') {
      this._hideafter = Math.max(parseFloat(this.hideafter), 0);
      if (this.value == '0') {
        if (this._hideafter >= 0)
          this.hide();
        else
          this.show();
      }
    }

    if (this._connected)
      this.draw();
  }

  layout() {
    if (!this._connected)
      return;

    this.backgroundElement.style.backgroundColor = this._bg;
    this.foregroundElement.style.backgroundColor = this._fg;
    this.rootElement.style.width = this._width;
    this.rootElement.style.height = this._height;

    // To start full and animate to empty, we animate backwards and flip
    // the direction.
    if (this._toward_right ^ this._style_fill)
      this.foregroundElement.style.transformOrigin = '100% 0%';
    else
      this.foregroundElement.style.transformOrigin = '0% 0%';
  }

  updateText() {
    let varying_texts = ['elapsed', 'duration', 'percent', 'remain'];
    // These values are filled in during draw() when the values change.
    if (varying_texts.indexOf(this._left_text) == -1) {
      // Otherwise the value is fixed so it can be set here.
      this.leftTextElement.innerHTML = this._left_text;
    }
    if (varying_texts.indexOf(this._center_text) == -1)
      this.centerTextElement.innerHTML = this._center_text;

    if (varying_texts.indexOf(this._right_text) == -1)
      this.rightTextElement.innerHTML = this._right_text;
  }

  draw() {
    let elapsedSec = (new Date() - this._start) / 1000;
    let remainSec = Math.max(0, this._duration - elapsedSec);
    let percent = this._duration <= 0 ? 0 : remainSec / this._duration;
    // Keep it between 0 and 1.
    percent = Math.min(1, Math.max(0, percent));
    let display_remain = remainSec ? remainSec.toFixed(1) : ''; // parseInt(this._value + 0.99999999999);
    let display_elapsed = elapsedSec.toFixed(1);
    if (this._style_fill)
      percent = 1.0 - percent;
    this.foregroundElement.style.width = 'calc(' + percent * 100 + '% - 2px)';
    if (this._left_text != '') {
      if (this._left_text == 'remain')
        this.leftTextElement.innerHTML = display_remain;
      else if (this._left_text == 'duration')
        this.leftTextElement.innerHTML = display_remain + ' / ' + this._duration;
      else if (this._left_text == 'percent')
        this.leftTextElement.innerHTML = (percent * 100).toFixed(1) + ' %';
      else if (this._left_text == 'elapsed')
        this.leftTextElement.innerHTML = display_elapsed;
    }
    if (this._center_text != '') {
      if (this._center_text == 'remain')
        this.centerTextElement.innerHTML = display_remain;
      else if (this._center_text == 'duration')
        this.centerTextElement.innerHTML = display_remain + ' / ' + this._duration;
      else if (this._center_text == 'percent')
        this.centerTextElement.innerHTML = (percent * 100).toFixed(1) + ' %';
      else if (this._center_text == 'elapsed')
        this.centerTextElement.innerHTML = display_elapsed;
    }
    if (this._right_text != '') {
      if (this._right_text == 'remain')
        this.rightTextElement.innerHTML = display_remain;
      else if (this._right_text == 'duration')
        this.rightTextElement.innerHTML = display_remain + ' / ' + this._duration;
      else if (this._right_text == 'percent')
        this.rightTextElement.innerHTML = (percent * 100).toFixed(1) + ' %';
      else if (this._right_text == 'elapsed')
        this.rightTextElement.innerHTML = display_elapsed;
    }
  }

  setvalue(remainSec) {
    let elapsedSec = Math.max(0, this._duration - remainSec);
    this._start = new Date() - (elapsedSec * 1000);

    if (!this._connected) return;

    this.show();
    clearTimeout(this._hide_timer);
    this._hide_timer = null;

    this.advance();
  }

  advance() {
    let elapsedSec = (new Date() - this._start) / 1000;
    if (elapsedSec >= this._duration) {
      // Sets the attribute to 0 so users can see the counter is done, and
      // if they set the same duration again it will count.
      this._duration = 0;
      if (this._hideafter > 0)
        this._hide_timer = setTimeout(this.hide.bind(this), this._hideafter * 1000);
      else if (this._hideafter == 0)
        this.hide();

      window.cancelAnimationFrame(this._animationFrame);
      this._animationFrame = null;
    } else {
      this._animationFrame = window.requestAnimationFrame(this.advance.bind(this));
    }

    this.draw();
  }

  show() {
    if (this._connected)
      this.rootElement.style.display = 'block';
  }

  hide() {
    if (this._connected)
      this.rootElement.style.display = 'none';
  }
}

if (window.customElements) {
  // Preferred method but old CEF doesn't have this.
  window.customElements.define('timer-bar', TimerBar);
} else {
  document.registerElement('timer-bar', {
    prototype: Object.create(TimerBar.prototype),
  });
}
