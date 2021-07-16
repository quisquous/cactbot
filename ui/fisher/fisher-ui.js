import TimerBar from '../../resources/timerbar';

class FisherBar extends TimerBar {
  stop() {
    cancelAnimationFrame(this._animationFrame);
    this._animationFrame = null;
  }
}

if (window.customElements) {
  // Preferred method but old CEF doesn't have this.
  window.customElements.define('fisher-bar', FisherBar);
} else {
  document.registerElement('fisher-bar', {
    prototype: Object.create(FisherBar.prototype),
  });
}

export default class FisherUI {
  constructor(options, element) {
    this.element = element;
    this.options = options;
    this.baitEl = element.querySelector('#bait-name');
    this.placeEl = element.querySelector('#place-name');
    this.timeEl = element.querySelector('#cast-duration');
    this.arrowEl = element.querySelector('#fisher-arrow');

    this.tugNames = ['unknown', 'light', 'medium', 'heavy'];

    this.castStart = null;
    this.fishing = false;
    this.animationFrame = false;
    this.bars = [];
  }

  draw() {
    const timeMs = (new Date() - this.castStart);
    const time = (timeMs / 1000).toFixed(1);

    this.timeEl.innerHTML = time;
    this.arrowEl.style.top = (timeMs / 600) + '%';

    this.animationFrame = requestAnimationFrame(this.draw.bind(this));
  }

  setBait(baitName) {
    this.baitEl.innerHTML = baitName;
  }

  setPlace(place) {
    const oldPlace = this.placeEl.innerHTML;

    if (!place) {
      if (oldPlace && oldPlace[0] !== '(')
        this.placeEl.innerHTML = '(' + oldPlace + ')';
      else
        this.placeEl.innerHTML = '------------';
    } else {
      this.placeEl.innerHTML = place;
    }
  }

  startTimers() {
    const barData = {};

    const rows = this.element.querySelectorAll('.table-row');

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const min = row.getAttribute('data-min');
      const max = row.getAttribute('data-max');
      const bar = document.createElement('fisher-bar');
      let timeouts = [];

      bar.centertext = row.getAttribute('data-fish');

      // Step one: fill until the minimum time
      if ((min && min !== 'undefined') && (max && max !== 'undefined')) {
        row.opacity = 0.8;
        bar.duration = min / 1000;
        bar.stylefill = 'fill';
        // Step two: empty until the maximum time
        timeouts.push(window.setTimeout(() => {
          row.style.opacity = 1;
          bar.stylefill = 'empty';
          bar.value = 0;
          bar.duration = (max - min) / 1000;
          timeouts.push(window.setTimeout(() => {
            row.style.opacity = 0.5;
          }, (max - min)));
        }, min));
      } else {
        bar.duration = 0;
        timeouts = [];
      }

      if (row.getAttribute('data-tug'))
        bar.fg = this.options.Colors[this.tugNames[row.getAttribute('data-tug')]];


      while (row.lastChild)
        row.removeChild(row.lastChild);


      row.appendChild(bar);

      this.bars.push({
        'row': row,
        'bar': bar,
        'timeouts': timeouts,
      });
    }

    this.draw();
  }

  stopTimers() {
    // Stops cast time timer and arrow
    cancelAnimationFrame(this.animationFrame);
    this.animationFrame = null;

    this.bars.forEach((bar) => {
      // Stops the timed events
      bar.timeouts.forEach((timeout) => {
        clearTimeout(timeout);
      });

      // Stops the bar
      bar.bar.stop();
    });
  }

  redrawFish(hookTimes, tugTypes) {
    // Sort hook times by minimum time, with undefineds being at the end
    const sortedKeys = Object.keys(hookTimes).sort((a, b) => {
      const t = hookTimes;

      if ((!t[a] || !t[a].min) && (!t[b] || !t[b].min))
        return 0;
      else if (!t[a] || !t[a].min)
        return 1;
      else if (!t[b] || !t[b].min)
        return -1;

      return t[a].min - t[b].min;
    });

    // Remove current values from all wells
    Array.prototype.forEach.call(this.element.querySelectorAll('.well-entry, .table-row'), (node) => {
      node.parentNode.removeChild(node);
    });

    for (let i = 0; i < sortedKeys.length; i++) {
      // First, draw on the well
      const fish = sortedKeys[i];

      if (tugTypes[fish] && hookTimes[fish].min && hookTimes[fish].max) {
        const tug = tugTypes[fish];
        // Create the element with fish-specific styles
        const el = document.createElement('div');
        el.classList.add('well-entry');
        el.setAttribute('data-fish', fish);
        el.style.top = (hookTimes[fish].min / 600).toString() + '%';
        el.style.height = ((hookTimes[fish].max - hookTimes[fish].min) / 600).toString() + '%';
        el.style.backgroundColor = this.options.Colors[this.tugNames[tug]];

        // Put the element in the well
        const well = this.element.querySelector('#fisher-well-' + this.tugNames[tug]);
        well.appendChild(el);
      }

      // Next, make the row for the table
      const row = document.createElement('div');
      row.classList.add('table-row');
      row.setAttribute('data-fish', fish);
      row.setAttribute('data-tug', tugTypes[fish]);
      row.setAttribute('data-min', hookTimes[fish].min);
      row.setAttribute('data-max', hookTimes[fish].max);

      // Add the row to the table
      const table = this.element.querySelector('#fisher-table');
      table.appendChild(row);
    }
  }

  startFishing() {
    this.fishing = true;
    this.castStart = new Date();
    this.startTimers();
  }

  stopFishing() {
    this.stopTimers();
    this.fishing = false;

    this.animationFrame = null;
  }
}
