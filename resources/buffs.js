'use strict';

// Requires includes:
// <script src="timerbar.js"></script>
// <script src="timericon.js"></script>
// <script src="unicode.js"></script>
// <script src="widgetlist.js"></script>

class BuffsUI extends HTMLElement {
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
        #root {
          font-family: arial;
          font-weight: bold;
          color: white;
          text-shadow: -1px 0 3px black, 0 1px 3px black, 1px 0 3px black, 0 -1px 3px black;
        }
      </style>
      <div id="root" style="position: relative">
        <div id="container">
          <widget-list id="list"></widget-list>
        </div>
      </div>
    `;

    // Defaults.
    this._settings = {
      'resources folder': '',
      'icon width': 32,
      'icon height': 32,
      'bar height': 4,
      'text height': 0,
      'padding': 2,
      'debuffs': true, // Track debuffs if true, else we track buffs.
      'growth first': 'left',
      'growth second': 'down',
      'columns': 20,
      'rows': 2,
    };
    this._setup = false;
  }

  setup(settings) {
    if (settings['resources folder'] != null)
      this._settings['resources folder'] = settings['resources folder'];
    if (settings['icon width'] != null)
      this._settings['icon width'] = settings['icon width'];
    if (settings['icon height'] != null)
      this._settings['icon height'] = settings['icon height'];
    if (settings['text height'] != null)
      this._settings['text height'] = settings['text height'];
    if (settings['bar height'] != null)
      this._settings['bar height'] = settings['bar height'];
    if (settings['padding'] != null)
      this._settings['padding'] = settings['padding'];
    if (settings['debuffs'] != null)
      this._settings['debuffs'] = settings['debuffs'];
    if (settings['growth first'] != null)
      this._settings['growth first'] = settings['growth first'];
    if (settings['growth second'] != null)
      this._settings['growth second'] = settings['growth second'];
    if (settings['columns'] != null)
      this._settings['columns'] = settings['columns'];
    if (settings['rows'] != null)
      this._settings['rows'] = settings['rows'];

    this.rootElement = this.shadowRoot.getElementById('root');
    this.containerElement = this.shadowRoot.getElementById('container');
    this.listElement = this.shadowRoot.getElementById('list');

    document.addEventListener('onGameActiveChangedEvent', function(e) {
      if (e.detail.active)
        document.getElementById('root').classList.remove('hide');
      else
        document.getElementById('root').classList.add('hide');
    });

    this._me = null;
    document.addEventListener('onPlayerChangedEvent', this.onPlayerChanged);

    this._buffs = {};

    let icon_width = this._settings['icon width'];
    let icon_height = this._settings['icon width'];
    let bar_height = this._settings['bar height'];
    let text_height = this._settings['text height'];
    let padding = this._settings['padding'];
    let growth1 = this._settings['growth first'];
    let growth2 = this._settings['growth second'];
    let rows = this._settings['rows'];
    let columns = this._settings['columns'];

    let everything_height = icon_height + bar_height + text_height;

    let width = (columns - 1) * (icon_width + padding) + icon_width;
    let height = (rows - 1) * (everything_height + padding) + everything_height;
    let x = 0;
    let y = 0;
    if (growth1 == 'up' || growth2 == 'up')
      y = height - everything_height;
    if (growth1 == 'left' || growth2 == 'left')
      x = width - icon_width;

    this.rootElement.style.width = width;
    this.rootElement.style.height = height;
    this.containerElement.style.position = 'relative';
    this.containerElement.style.left = x;
    this.containerElement.style.top = y;

    this.listElement.toward = growth1 + ' ' + growth2;
    if (growth1 == 'left' || growth1 == 'right')
      this.listElement.rowcolsize = columns;
    else
      this.listElement.rowcolsize = rows;
    this.listElement.elementwidth = icon_width + padding;
    this.listElement.elementheight = everything_height + padding;

    this._setup = true;
  }

  connectedCallback() {
    if (!this._setup)
      this.setup(this._settings);
  }

  disconnectedCallback() {
  }

  onPlayerChanged(e) {
    this._me = e.detail.name;
    this._buff_regex = new RegExp(':' + this.me + ' gains the effect of (.+) from (.*) for ([0-9.]+) Seconds\.$');
    document.removeEventListener('onPlayerChangedEvent', this.onPlayerChanged);
    document.addEventListener('onLogEvent', this.onLogEvent);
  }

  onLogEvent(e) {
    let logs = e.detail.logs;
    for (let i = 0; i < logs.length; ++i) {
      let line = logs[i];

      let res = line.match(this._buff_regex);
      if (res) {
        let name = res[1];
        let seconds = parseFloat(res[3]);
        let now = Date.now(); // This is in ms.
        this.setBuffExpiry(name, now + seconds * 1000);
        continue;
      }

      if (this._settings['debuffs'])
        res = line.match(Regexes.Parse('You suffer the effect of (....)?(\y{Name})\.$'));
      else
        res = line.match(Regexes.Parse('You gain the effect of (....)?(\y{Name})\.$/'));
      if (res) {
        this.addBuff(res[2]);
        continue;
      }

      if (this._settings['debuffs'])
        res = line.match(Regexes.Parse('You recover from the effect of (....)?(\y{Name})\.$'));
      else
        res = line.match(Regexes.Parse('You lose the effect of (....)?(\y{Name})\.$'));
      if (res) {
        this.removeBuff(res[2]);
        continue;
      }
    }
  }

  addBuff(name) {
    this.initBuffIfNeeded(name);
    this._buffs[name].active = true;
    if (this._buffs[name].expiry >= 0)
      showBuff(name);
  }

  removeBuff(name) {
    delete this._buffs[name];
    hideBuff(name);
  }

  setBuffExpiry(name, exp_ms) {
    this.initBuffIfNeeded(name);
    this._buffs[name] = exp_ms;
    if (this._buffs[name].active)
      showBuff(name);
  }

  initBuffIfNeeded(name) {
    if (name in this._buffs)
      return;
    this._buffs[name] = { expiry: -1, active: false };
  }

  showBuff(name) {
    let icon_width = this._settings['icon width'];
    let icon_height = this._settings['icon width'];
    let bar_height = this._settings['bar height'];
    let text_height = this._settings['text height'];

    let div = document.createElement('div');

    let icon = document.createElement('timer-icon');
    icon.width = icon_width;
    icon.height = icon_height;
    div.appendChild(icon);

    let bar_div = document.createElement('div');
    bar_div.style.position = 'relative';
    bar_div.style.top = icon_height;
    div.appendChild(bar_div);

    let bar = document.createElement('timer-bar');
    bar.width = icon_width;
    bar.height = bar_height;
    bar_div.appendChild(bar);

    if (text_height > 0) {
      let text = document.createElement('div');
      text.style.width = icon_width;
      text.style.height = text_height;
      text.style.overflow = 'hidden';
      text.style.fontSize = text_height - 1;
      text.style.whiteSpace = 'pre';
      text.style.position = 'relative';
      text.style.top = icon_height + bar_height;
      text.innerText = name;
      div.appendChild(text);
    }

    // TODO: Get color from json.
    icon.bordercolor = '#900';
    bar.fg = '#a00';

    // TODO: Get duration from json.
    icon.duration = bar.duration = 0;

    // TODO: Get icon name from json.
    icon.icon = this._settings['resources folder'] + 'icon/action/white_mage/58/aero_iii.png';

    this.listElement.addElement(name, div, function() {
      return icon.duration;
    });
    console.log('gain ' + name);
  }

  hideBuff(name) {
    this.listElement.removeElement(name);
    console.log('lose ' + name);
  }

  test() {
    this.rootElement.style.backgroundColor = '#333';
    this.addDebuff('Impactful');
    this.addDebuff('Lucid Dreaming');
    this.addDebuff('debuff3');
    this.addDebuff('debuff4');
    this.addDebuff('debuff5');
    this.addDebuff('debuff6');
  }
}

if (window.customElements) {
  // Preferred method but old CEF doesn't have this.
  window.customElements.define('buffs-ui', BuffsUI);
} else {
  document.registerElement('buffs-ui', {
    prototype: Object.create(BuffsUI.prototype),
  });
}
