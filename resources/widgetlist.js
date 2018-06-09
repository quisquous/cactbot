
'use strict';

class WidgetList extends HTMLElement {
  static get observedAttributes() {
    return ['toward', 'elementwidth', 'elementheight', 'rowcolsize', 'maxnumber'];
  }

  // All visual dimensions are scaled by this.
  set scale(s) {
    this.setAttribute('scale', s);
  }
  get scale() {
    return this.getAttribute('scale');
  }

  // The direction that the list should grow. It can specify two
  // directions in "left", "right", "up", and "down", with the
  // first being the direction it grows until it runs out of space
  // and the second being the direction is wraps for the next
  // row/column. eg. "left down" will grow a list toward the left,
  // and subsequent rows will be below the first.
  set toward(s) {
    this.setAttribute('toward', s);
  }
  get toward() {
    return this.getAttribute('toward');
  }

  // The elementwidth of each element in the list.
  set elementwidth(w) {
    this.setAttribute('elementwidth', w);
  }
  get elementwidth() {
    return this.getAttribute('elementwidth');
  }

  // The height of each element in the list.
  set elementheight(w) {
    this.setAttribute('elementheight', w);
  }
  get elementheight() {
    return this.getAttribute('elementheight');
  }

  // The number of elements to show before wrapping to a new
  // row/column.
  set rowcolsize(w) {
    this.setAttribute('rowcolsize', w);
  }
  get rowcolsize() {
    return this.getAttribute('rowcolsize');
  }

  // The maximum number of widgets to show at a time.
  set maxnumber(w) {
    this.setAttribute('maxnumber', w);
  }
  get maxnumber() {
    return this.getAttribute('maxnumber');
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
      <div id="root" style="position: relative"></div>
    `;

    this._next_id = 1;
    this._name_to_id = {};
    this._elements = {};
    this._sorted = [];

    this.rootElement = this.shadowRoot.getElementById('root');
  }

  connectedCallback() {
    // Default values.
    this._scale = 1;
    this._elementwidth = 100;
    this._elementheight = 100;
    this._rowcolsize = 5;
    this._maxnumber = 1000;
    // Multiplier how far to move X for each item.
    this._xinc1 = 1;
    // Multiplier how far to move Y for each item.
    this._yinc1 = 0;
    // When reaching rowcolsize, multiplier to move X to
    // reach the next row/column.
    this._xinc2 = 0;
    // When reaching rowcolsize, multiplier to move Y to
    // reach the next row/column.
    this._yinc2 = 1;

    if (this.scale != null) this._scale = Math.max(parseFloat(this.scale), 0.01);
    if (this.elementwidth != null) this._elementwidth = Math.max(parseInt(this.elementwidth), 1);
    if (this.elementheight != null) this._elementheight = Math.max(parseInt(this.elementheight), 1);
    if (this.rowcolsize != null) this._rowcolsize = Math.max(parseInt(this.rowcolsize), 1);
    if (this.toward != null) this.parseToward(this.toward);
    if (this.maxnumber != null) this._maxnumber = Math.max(parseInt(this.maxnumber), 1);

    this._connected = true;
    this.layout();
  }

  disconnectedCallback() {
    this._connected = false;
  }

  parseToward(toward) {
    let t = toward.split(' ');
    if (t.length != 2) {
      console.log('widget-list: Invalid toward format');
      return;
    }

    let x1inc;
    let x2inc;
    let y1inc;
    let y2inc;
    if (t[0] == 'left') {
      x1inc = -1;
      y1inc = 0;
      x2inc = 0;
      if (t[1] == 'up') {
        y2inc = -1;
      } else if (t[1] == 'down') {
        y2inc = 1;
      } else {
        console.log('widget-list: Invalid toward format');
        return;
      }
    } else if (t[0] == 'right') {
      x1inc = 1;
      y1inc = 0;
      x2inc = 0;
      if (t[1] == 'up') {
        y2inc = -1;
      } else if (t[1] == 'down') {
        y2inc = 1;
      } else {
        console.log('widget-list: Invalid toward format');
        return;
      }
    } else if (t[0] == 'up') {
      x1inc = 0;
      y1inc = -1;
      y2inc = 0;
      if (t[1] == 'left') {
        x2inc = -1;
      } else if (t[1] == 'right') {
        x2inc = 1;
      } else {
        console.log('widget-list: Invalid toward format');
        return;
      }
    } else if (t[0] == 'down') {
      x1inc = 0;
      y1inc = 1;
      y2inc = 0;
      if (t[1] == 'left') {
        x2inc = -1;
      } else if (t[1] == 'right') {
        x2inc = 1;
      } else {
        console.log('widget-list: Invalid toward format');
        return;
      }
    } else {
      console.log('widget-list: Invalid toward format');
      return;
    }

    this._xinc1 = x1inc;
    this._xinc2 = x2inc;
    this._yinc1 = y1inc;
    this._yinc2 = y2inc;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == 'toward') {
      this.parseToward(newValue);
      this.layout();
    } else if (name == 'elementwidth') {
      this._elementwidth = Math.max(parseInt(newValue), 1);
      this.layout();
    } else if (name == 'elementheight') {
      this._elementheight = Math.max(parseInt(newValue), 1);
      this.layout();
    } else if (name == 'rowcolsize') {
      this._rowcolsize = Math.max(parseInt(newValue), 1);
      this.layout();
    } else if (name == 'maxnumber') {
      this._maxnumber = Math.max(parseInt(newValue), 1);
      this.layout();
    }
  }

  addElement(name, element, sortKey) {
    let id = this._next_id;
    this._next_id = this._next_id + 1;

    let old = this._name_to_id[name];
    if (old != null)
      this.removeElement(name);

    let sortKeyFn;
    if (typeof(sortKey) == 'number') {
      sortKeyFn = function() {
        return sortKey;
      };
    } else {
      sortKeyFn = sortKey;
    }

    this._name_to_id[name] = id;
    this._elements[id] = sortKeyFn;
    this._sorted.push(id);
    let that = this;
    this._sorted.sort(function(a, b) {
      return that._elements[a]() - that._elements[b]();
    });

    element.style.position = 'relative';
    element.style.left = element.style.top = 0;

    let container = document.createElement('div');
    container.appendChild(element);
    container.id = 'child' + id;

    this.rootElement.appendChild(container);

    this.layout();
  }

  removeElement(name) {
    let id = this._name_to_id[name];
    if (id == null)
      return;
    let container = this.shadowRoot.getElementById('child' + id);
    let element = container.childNodes[0];
    this.rootElement.removeChild(container);

    delete this._name_to_id[name];
    delete this._elements[id];
    for (let i in this._sorted) {
      if (this._sorted[i] == id) {
        this._sorted.splice(i, 1);
        break;
      }
    }

    this.layout();
    return element;
  }

  clear() {
    for (let name in this._name_to_id)
      this.removeElement(name);
  }

  layout() {
    if (!this._connected)
      return;

    this.rootElement.style.width = this._rowcolsize * this._elementwidth;
    this.rootElement.style.height = this._rowcolsize * this._elementheight;

    let x = this._xinc1 < 0 ? -this._elementwidth : 0;
    let y = this._yinc1 < 0 ? -this._elementheight : 0;
    let rowcolindex = 0;
    let count = 0;

    for (let i in this._sorted) {
      let id = this._sorted[i];
      console.assert(id != 0, 'An id in _sorted isn\'t in _elements?');
      let container = this.shadowRoot.getElementById('child' + id);
      console.assert(container != null, 'Element with id child' + id + ' is missing?');

      if (count >= this._maxnumber) {
        container.style.display = 'none';
        continue;
      } else {
        container.style.display = 'block';
      }

      count++;

      container.style.position = 'absolute';
      container.style.left = x;
      container.style.top = y;

      x = x + (this._xinc1 * this._elementwidth);
      y = y + (this._yinc1 * this._elementheight);
      rowcolindex = rowcolindex + 1;
      if (rowcolindex == this._rowcolsize) {
        x = x - (this._xinc1 * this._elementwidth) * rowcolindex;
        y = y - (this._yinc1 * this._elementheight)* rowcolindex;
        x = x + (this._xinc2 * this._elementwidth);
        y = y + (this._yinc2 * this._elementheight);
        rowcolindex = 0;
      }
    }
  }

  test() {
    for (let i = 0; i < 8; ++i) {
      let div = document.createElement('div');
      div.style.width = this._elementwidth * 3 / 4;
      div.style.height = this._elementheight * 3 / 4;
      div.style.overflow = 'hidden';
      div.style.backgroundColor = '#' + parseInt(Math.random()*10) + '' + parseInt(Math.random()*10) + '' + parseInt(Math.random()*10);
      div.style.textAlign = 'center';
      div.style.fontFamily = 'arial';
      div.style.fontSize = this._elementheight / 6;
      div.style.fontWeight = 'bold';
      div.style.color = 'white';
      div.style.textShadow = '-1px 0 3px black, 0 1px 3px black, 1px 0 3px black, 0 -1px 3px black';
      div.innerHTML = '<br/>' + (i + 1);
      this.addElement('test' + i, div, function() {
        0;
      });
    }
  }
}

if (window.customElements) {
  // Preferred method but old CEF doesn't have this.
  window.customElements.define('widget-list', WidgetList);
} else {
  document.registerElement('widget-list', {
    prototype: Object.create(WidgetList.prototype),
  });
}
