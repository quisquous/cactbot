"use strict";

class TimerBar extends HTMLElement {
  static get observedAttributes() { return [ "duration", "onhide", "lefttext", "centertext", "righttext", "width", "height", "bg", "fg" ]; }

  // All visual dimensions are scaled by this.
  set scale(s) { this.setAttribute("scale", s); }
  get scale() { return this.getAttribute("scale"); }

  // Background color.
  set bg(c) { this.setAttribute("bg", c); }
  get bg() { return this.getAttribute("bg"); }

  // Foreground color.
  set fg(c) { this.setAttribute("fg", c); }
  get fg() { return this.getAttribute("fg"); }

  // The width of the bar, in pixels (before |scale|).
  set width(w) { this.setAttribute("width", w); }
  get width() { return this.getAttribute("width"); }

  // The height of the bar, in pixels (before |scale|).
  set height(w) { this.setAttribute("height", w); }
  get height() { return this.getAttribute("height"); }

  // The length of time to count down.
  set duration(s) { this.setAttribute("duration", s); }
  get duration() { return this.getAttribute("duration"); }
  
  // If "right" then animates left-to-right (the default). If "left"
  // then animates right-to-left.
  set toward(t) { this.setAttribute("toward", t); }
  get toward() { return this.getAttribute("toward"); }

  // If "fill" then the progress goes empty-to-full, if "empty" then the
  // progress bar starts full and goes to empty.
  set style(s) { this.setAttribute("style", s); }
  get style() { return this.getAttribute("style"); }
  
  // When the bar reaches 0, it is hidden after this many seconds. If ""
  // then it is not hidden.
  set hideafter(h) { this.setAttribute("hideafter", h); }
  get hideafter() { return this.getAttribute("hideafter"); }

  // When the bar hides after completing, this string is evaluated.
  set onhide(c) { this.setAttribute("onhide", c); }
  get onhide() { return this.getAttribute("onhide"); }
  
  // Chooses what should be shown in the text field in each area of
  // the bar. Can be one of:
  // empty - nothing is shown.
  // "remain" - shows the remaining time.
  // "duration" - shows the remaining and total duration time
  //              of the bar.
  // "percent" - shows the percentage of remaining time to
  //             the duration.
  // anything else - the given text is shown literally.
  set lefttext(p) { this.setAttribute("lefttext", p); }
  get lefttext() { return this.getAttribute("lefttext"); }
  set righttext(p) { this.setAttribute("righttext", p); }
  get righttext() { return this.getAttribute("righttext"); }
  set centertext(p) { this.setAttribute("centertext", p); }
  get centertext() { return this.getAttribute("centertext"); }
  
  // This would be used with window.customElements.
  constructor() {
    super();
    var root = this.attachShadow({mode: 'open'});
    this.init(root);
  }
  
  // These would be used by document.registerElement, which is deprecated but
  // ACT uses an old CEF which has this instead of the newer APIs.
  createdCallback() {
    var root = this.createShadowRoot();
    this.init(root);
  }
  // Convert from the deprecated API names to the modern API names.
  attachedCallback() { this.connectedCallback(); }
  detachedCallback() { this.disconnectedCallback(); }

  init(root) {
    root.innerHTML = `
      <style>
        #bg {
          opacity: 0.5;
          position: absolute;
        }
        #fg {
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
      <div id="root" style="position: relative">
        <div id="bg"></div>
        <div id="fg"></div>
        <div id="righttext" class="text"></div>
        <div id="centertext" class="text"></div>
        <div id="lefttext" class="text"></div>
      </div>
    `
  }
  
  connectedCallback() {
    this.rootElement = this.shadowRoot.getElementById("root");
    this.foregroundElement = this.shadowRoot.getElementById("fg");
    this.backgroundElement = this.shadowRoot.getElementById("bg");
    this.leftTextElement = this.shadowRoot.getElementById("lefttext");
    this.centerTextElement = this.shadowRoot.getElementById("centertext");
    this.rightTextElement = this.shadowRoot.getElementById("righttext");

    // Constants.
    this.kBackgroundOpacity = 0.8;
    this.kBorderSize = 1;
    this.kTextLeftRightEdgePadding = this.kBorderSize * 3;
    this.kTextTopBottomEdgePadding = this.kBorderSize * 2;
    this.kAnimateMS = 100;
    
    // Default values.
    this._value = 0;
    this._duration = 0;
    this._width = 200;
    this._height = 20;
    this._bg = "black";
    this._fg = "yellow";
    this._scale = 1;
    this._toward_right = false;
    this._style_fill = false;
    this._left_text = "";
    this._center_text = "";
    this._right_text = "";
    this._hideafter = -1;
    this._onhide = "";

    if (this.duration != null) { this._duration = Math.max(parseFloat(this.duration), 0); }
    if (this.width != null) { this._width = Math.max(parseInt(this.width), 1); }
    if (this.height != null) { this._height = Math.max(parseInt(this.height), 1); }
    if (this.bg != null) { this._bg = this.bg; }
    if (this.fg != null) { this._fg = this.fg; }
    if (this.scale != null) { this._scale = Math.max(parseFloat(this.scale), 0.01); }
    if (this.toward != null) { this._toward_right = this.toward == "right"; }
    if (this.style != null) { this._style_fill = this.style == "fill"; }
    if (this.lefttext != null) { this._left_text = this.lefttext; }
    if (this.centertext != null) { this._center_text = this.centertext; }
    if (this.righttext != null) { this._right_text = this.righttext; }
    if (this.hideafter != null && this.hideafter != "") { this._hideafter = Math.max(parseFloat(this.hideafter), 0); }
    if (typeof(this.onhide) != null) { this._onhide = this.onhide; }
    
    this._connected = true;
    this.layout();
    this.updateText();
    this.reset();
  }
  
  disconnectedCallback() {
    this._connected = false;
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    if (name == "duration") {
      this._duration = Math.max(parseFloat(newValue), 0);
      this.reset();
    } else if (name == "width") {
      this._width = Math.max(parseInt(newValue), 1);
      this.layout();
    } else if (name == "height") {
      this._height = Math.max(parseInt(newValue), 1);
      this.layout();
    } else if (name == "bg") {
      this._bg = newValue;
      this.layout();
    } else if (name == "fg") {
      this._fg = newValue;
      this.layout();
    } else if (name == "lefttext") {
      var update = newValue != this._left_text && this._connected;
      this._left_text = newValue;
      if (update)
        this.updateText();
    } else if (name == "centertext") {
      var update = newValue != this._center_text && this._connected;
      this._center_text = newValue;
      if (update)
        this.updateText();
    } else if (name == "righttext") {
      var update = newValue != this._right_text && this._connected;
      this._right_text = newValue;
      if (update)
        this.updateText();
    } else if (name == "onhide") {
      this._onhide = newValue;
    }

    if (this._connected)
      this.draw();
  }
  
  layout() {
    if (!this._connected)
      return;

    // To start full and animate to empty, we animate backwards and flip
    // the direction.
    if (this._style_fill)
      this._toward_right = !this._toward_right;
    
    var backgroundStyle = this.backgroundElement.style;
    var foregroundStyle = this.foregroundElement.style;
    var lTextStyle = this.leftTextElement.style;
    var cTextStyle = this.centerTextElement.style;
    var rTextStyle = this.rightTextElement.style;
    
    backgroundStyle.backgroundColor = this._bg;
    foregroundStyle.backgroundColor = this._fg;

    backgroundStyle.opacity = this.kBackgroundOpacity;
    
    backgroundStyle.width = this._width * this._scale;
    backgroundStyle.height = this._height * this._scale;
    
    foregroundStyle.width = (this._width - this.kBorderSize * 2) * this._scale;
    foregroundStyle.height = (this._height - this.kBorderSize * 2) * this._scale;
    foregroundStyle.left = this.kBorderSize * this._scale;
    foregroundStyle.top = this.kBorderSize * this._scale;

    lTextStyle.width = (this._width - this.kBorderSize * 4 - this.kTextLeftRightEdgePadding * 2) * this._scale;
    lTextStyle.height = (this._height - this.kBorderSize * 4 - this.kTextTopBottomEdgePadding * 2) * this._scale;
    lTextStyle.left = (this.kBorderSize + this.kTextLeftRightEdgePadding) * this._scale;
    lTextStyle.top = (this.kBorderSize + this.kTextTopBottomEdgePadding) * this._scale;
    lTextStyle.fontSize = lTextStyle.height;
    
    cTextStyle.width = rTextStyle.width = lTextStyle.width;
    cTextStyle.height = rTextStyle.height = lTextStyle.height;
    cTextStyle.left = rTextStyle.left = lTextStyle.left;
    cTextStyle.top = rTextStyle.top = lTextStyle.top;
    cTextStyle.fontSize = rTextStyle.fontSize = lTextStyle.fontSize;
    
    if (this._toward_right)
      foregroundStyle.transformOrigin = "100% 0%";
    else
      foregroundStyle.transformOrigin = "0% 0%";
  }

  updateText() {
    // These values are filled in during draw() when the values change.
    if (this._left_text != "value" && this._left_text != "duration" &&
        this._left_text != "percent") {
      // Otherwise the value is fixed so it can be set here.
      this.leftTextElement.innerText = this._left_text;
    }
    if (this._center_text != "value" && this._center_text != "duration" &&
        this._center_text != "percent") {
      this.centerTextElement.innerText = this._center_text;
    }
    if (this._right_text != "value" && this._right_text != "duration" &&
        this._right_text != "percent") {
      this.rightTextElement.innerText = this._right_text;
    }
  }

  draw() {
    var percent = this._duration <= 0 ? 1 : this._value / this._duration;
    // Keep it between 0 and 1.
    percent = Math.min(1, Math.max(0, percent));
    var intvalue = parseInt(this._value + 0.99999999999);
    if (this._style_fill)
      percent = 1.0 - percent;
    this.foregroundElement.style.transform = "scale(" + percent + ",1)";
    if (this._left_text != "") {
      if (this._left_text == "remain")
        this.leftTextElement.innerHTML = intvalue;
      else if (this._left_text == "duration")
        this.leftTextElement.innerHTML = intvalue + " / " + this._duration;
      else if (this._left_text == "percent")
        this.leftTextElement.innerHTML = parseInt(percent * 100) + " %";
    }
    if (this._center_text != "") {
      if (this._center_text == "value")
        this.centerTextElement.innerHTML = intvalue;
      else if (this._center_text == "duration")
        this.centerTextElement.innerHTML = intvalue + " / " + this._duration;
      else if (this._center_text == "percent")
        this.centerTextElement.innerHTML = parseInt(percent * 100) + " %";
    }
    if (this._right_text != "") {
      if (this._right_text == "remain")
        this.rightTextElement.innerHTML = intvalue;
      else if (this._right_text == "duration")
        this.rightTextElement.innerHTML = intvalue + " / " + this._duration;
      else if (this._right_text == "percent")
        this.rightTextElement.innerHTML = parseInt(percent * 100) + " %";
    }
  }

  reset() {
    this.rootElement.style.display = "block";
    clearTimeout(this._hide_timer);
    this._hide_timer = null;
    clearTimeout(this._timer);
    this._timer = null;

    this._value = this._duration;
    this.advance();
  }
  
  advance() {
    if (this._value <= 0) {
      this._value = 0;
      var that = this;
      if (this._hideafter >= 0) {
        this._hide_timer = setTimeout(function() {
          that.rootElement.style.display = "none";
          try {
            eval(that._onhide);
          } catch (e) {
            console.log("error evaluating onhide: " + that._onhide);
          }
        }, this._hideafter);
      }
    } else {
      var that = this;
      this._timer = setTimeout(function() {
        that._value = that._value - (that.kAnimateMS / 1000);
        that.advance();
      }, this.kAnimateMS);
    }
    this.draw();
  }
}

if (window.customElements) {
  // Preferred method but old CEF doesn't have this.
  window.customElements.define('timer-bar', TimerBar);
} else {
  document.registerElement('timer-bar', {
    prototype: Object.create(TimerBar.prototype)
  });
}