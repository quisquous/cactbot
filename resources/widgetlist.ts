// NOTE
// This class should be considered deprecated, and any users of this class should
// just switch over to using CSS grid.
type Sorter = () => number;

class WidgetList extends HTMLElement {
  private _nextId = 1;
  private _nameToId: { [key: string]: number } = {};
  private _elements: { [key: number]: Sorter } = {};
  private _sorted: number[] = [];
  private _elementwidth = 100;
  private _elementheight = 100;
  private _xinc1 = 1;
  private _xinc2 = 0;
  private _yinc1 = 0;
  private _yinc2 = 1;
  private _rowcolsize = 5;
  private _maxnumber = 1000;
  private _connected = false;
  private rootElement: HTMLElement;

  static get observedAttributes() {
    return ['toward', 'elementwidth', 'elementheight', 'rowcolsize', 'maxnumber'];
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

  // The direction that the list should grow. It can specify two
  // directions in "left", "right", "up", and "down", with the
  // first being the direction it grows until it runs out of space
  // and the second being the direction is wraps for the next
  // row/column. eg. "left down" will grow a list toward the left,
  // and subsequent rows will be below the first.
  set toward(s: string | null) {
    if (s === null)
      this.removeAttribute('toward');
    else
      this.setAttribute('toward', s);
  }
  get toward(): string | null {
    return this.getAttribute('toward');
  }

  // The elementwidth of each element in the list.
  set elementwidth(w: string | null) {
    if (w === null)
      this.removeAttribute('elementwidth');
    else
      this.setAttribute('elementwidth', w);
  }
  get elementwidth() {
    return this.getAttribute('elementwidth');
  }

  // The height of each element in the list.
  set elementheight(w: string | null) {
    if (w === null)
      this.removeAttribute('elementheight');
    else
      this.setAttribute('elementheight', w);
  }
  get elementheight() {
    return this.getAttribute('elementheight');
  }

  // The number of elements to show before wrapping to a new
  // row/column.
  set rowcolsize(w: string | null) {
    if (w === null)
      this.removeAttribute('rowcolsize');
    else
      this.setAttribute('rowcolsize', w);
  }
  get rowcolsize() {
    return this.getAttribute('rowcolsize');
  }

  // The maximum number of widgets to show at a time.
  set maxnumber(w: string | null) {
    if (w === null)
      this.removeAttribute('maxnumber');
    else
      this.setAttribute('maxnumber', w);
  }
  get maxnumber() {
    return this.getAttribute('maxnumber');
  }

  // This would be used with window.customElements.
  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <div id="root" style="position: relative"></div>
    `;

    if (this.shadowRoot === null)
      throw new Error('shadowRoot of widget-list is null');

    this.rootElement = this.shadowRoot.getElementById('root') as HTMLElement;
  }

  attachedCallback() {
    // Default values.
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

    if (this.elementwidth !== null) this._elementwidth = Math.max(parseInt(this.elementwidth), 1);
    if (this.elementheight !== null)
      this._elementheight = Math.max(parseInt(this.elementheight), 1);
    if (this.rowcolsize !== null) this._rowcolsize = Math.max(parseInt(this.rowcolsize), 1);
    if (this.toward !== null) this.parseToward(this.toward);
    if (this.maxnumber !== null) this._maxnumber = Math.max(parseInt(this.maxnumber), 1);

    this._connected = true;
    this.layout();
  }

  detachedCallback() {
    this._connected = false;
  }

  parseToward(toward: string) {
    const t = toward.split(' ');
    if (t.length !== 2) {
      console.log('widget-list: Invalid toward format');
      return;
    }

    let x1inc;
    let x2inc;
    let y1inc;
    let y2inc;
    if (t[0] === 'left') {
      x1inc = -1;
      y1inc = 0;
      x2inc = 0;
      if (t[1] === 'up') {
        y2inc = -1;
      } else if (t[1] === 'down') {
        y2inc = 1;
      } else {
        console.log('widget-list: Invalid toward format');
        return;
      }
    } else if (t[0] === 'right') {
      x1inc = 1;
      y1inc = 0;
      x2inc = 0;
      if (t[1] === 'up') {
        y2inc = -1;
      } else if (t[1] === 'down') {
        y2inc = 1;
      } else {
        console.log('widget-list: Invalid toward format');
        return;
      }
    } else if (t[0] === 'up') {
      x1inc = 0;
      y1inc = -1;
      y2inc = 0;
      if (t[1] === 'left') {
        x2inc = -1;
      } else if (t[1] === 'right') {
        x2inc = 1;
      } else {
        console.log('widget-list: Invalid toward format');
        return;
      }
    } else if (t[0] === 'down') {
      x1inc = 0;
      y1inc = 1;
      y2inc = 0;
      if (t[1] === 'left') {
        x2inc = -1;
      } else if (t[1] === 'right') {
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

  attributeChangedCallback(name: string, _: string, newValue: string) {
    if (name === 'toward') {
      this.parseToward(newValue);
      this.layout();
    } else if (name === 'elementwidth') {
      this._elementwidth = Math.max(parseInt(newValue), 1);
      this.layout();
    } else if (name === 'elementheight') {
      this._elementheight = Math.max(parseInt(newValue), 1);
      this.layout();
    } else if (name === 'rowcolsize') {
      this._rowcolsize = Math.max(parseInt(newValue), 1);
      this.layout();
    } else if (name === 'maxnumber') {
      this._maxnumber = Math.max(parseInt(newValue), 1);
      this.layout();
    }
  }

  addElement(name: string, element: HTMLElement, sortKey: number | Sorter) {
    const id = this._nextId;
    this._nextId = this._nextId + 1;

    const old = this._nameToId[name];
    if (old)
      this.removeElement(name);

    let sortKeyFn;
    if (typeof sortKey === 'number') {
      sortKeyFn = function() {
        return sortKey;
      };
    } else {
      sortKeyFn = sortKey;
    }

    this._nameToId[name] = id;
    this._elements[id] = sortKeyFn;
    this._sorted.push(id);
    this._sorted.sort((a, b) => {
      return (this._elements[a]?.() ?? 0) - (this._elements[b]?.() ?? 0);
    });

    element.style.position = 'relative';
    element.style.left = element.style.top = '0';

    const container = document.createElement('div');
    container.appendChild(element);
    container.id = `child${id}`;

    this.rootElement.appendChild(container);

    this.layout();
  }

  removeElement(name: string) {
    const id = this._nameToId[name];
    if (!id)
      return;
    const container = this.shadowRoot?.getElementById(`child${id}`);
    if (container !== null && container !== undefined) {
      const element = container.childNodes[0];
      this.rootElement.removeChild(container);
      return element;
    }
    return undefined;
  }

  clear() {
    for (const name in this._nameToId)
      this.removeElement(name);
  }

  layout() {
    if (!this._connected)
      return;

    this.rootElement.style.width = String(this._rowcolsize * this._elementwidth);
    this.rootElement.style.height = String(this._rowcolsize * this._elementheight);

    let x = this._xinc1 < 0 ? -this._elementwidth : 0;
    let y = this._yinc1 < 0 ? -this._elementheight : 0;
    let rowcolindex = 0;
    let count = 0;

    this._sorted.forEach((id: number) => {
      if (id === 0)
        throw new Error('An id in _sorted isn\'t in _elements?');
      const container = this.shadowRoot?.getElementById(`child${id}`);
      if (container === null || container === undefined)
        throw new Error(`Element with id child${id} is missing?`);

      if (count >= this._maxnumber) {
        container.style.display = 'none';
        return;
      }
      container.style.display = 'block';


      count++;

      container.style.position = 'absolute';
      container.style.left = String(x);
      container.style.top = String(y);

      x = x + (this._xinc1 * this._elementwidth);
      y = y + (this._yinc1 * this._elementheight);
      rowcolindex = rowcolindex + 1;
      if (rowcolindex === this._rowcolsize) {
        x = x - (this._xinc1 * this._elementwidth) * rowcolindex;
        y = y - (this._yinc1 * this._elementheight) * rowcolindex;
        x = x + (this._xinc2 * this._elementwidth);
        y = y + (this._yinc2 * this._elementheight);
        rowcolindex = 0;
      }
    });
  }

  test() {
    for (let i = 0; i < 8; ++i) {
      const div = document.createElement('div');
      div.style.width = String(this._elementwidth * 3 / 4);
      div.style.height = String(this._elementheight * 3 / 4);
      div.style.overflow = 'hidden';
      div.style.backgroundColor = `#${Math.random() * 10}${Math.random() * 10}${Math.random() * 10}`;
      div.style.textAlign = 'center';
      div.style.fontFamily = 'arial';
      div.style.fontSize = String(this._elementheight / 6);
      div.style.fontWeight = 'bold';
      div.style.color = 'white';
      div.style.textShadow = '-1px 0 3px black, 0 1px 3px black, 1px 0 3px black, 0 -1px 3px black';
      div.innerHTML = `<br/>${i + 1}`;
      this.addElement(`test${i}`, div, () => 0);
    }
  }
}

window.customElements.define('widget-list', WidgetList);
