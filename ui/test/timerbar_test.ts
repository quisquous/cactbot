import TimerBar from '../../resources/timerbar';

const only = 0;

let bar;

if (!only || only === 1) {
  bar = document.createElement('timer-bar') as TimerBar;
  bar.lefttext = 'remain';
  bar.stylefill = 'fill';
  bar.duration = '2';
  document.getElementById('d1')?.appendChild(bar);
  const div = document.createElement('p');
  div.innerHTML = 'test';
  document.getElementById('d1')?.appendChild(div);
}

if (!only || only === 2) {
  bar = document.createElement('timer-bar') as TimerBar;
  bar.lefttext = 'remain';
  bar.stylefill = 'fill';
  bar.duration = '2';
  bar.hideafter = '0.5';
  document.getElementById('d2')?.appendChild(bar);
}

if (!only || only === 13) {
  bar = document.createElement('timer-bar') as TimerBar;
  bar.lefttext = 'remain';
  bar.stylefill = 'fill';
  bar.duration = '2';
  document.getElementById('d13')?.appendChild(bar);
  (function() {
    const hideBar = bar;
    window.setTimeout(() => {
      hideBar.hideafter = '0';
    }, 2500);
  })();
}

if (!only || only === 3) {
  bar = document.createElement('timer-bar') as TimerBar;
  bar.lefttext = 'remain';
  bar.stylefill = 'fill';
  bar.duration = '2';
  bar.hideafter = '0';
  document.getElementById('d3')?.appendChild(bar);
  (function() {
    const repeatingBar = bar;
    const repeat = function() {
      // Setting value after duration ends does nothing.
      repeatingBar.value = '2';
      window.setTimeout(repeat, 3000);
    };
    repeat();
  })();
}

if (!only || only === 4) {
  bar = document.createElement('timer-bar') as TimerBar;
  bar.lefttext = 'remain';
  bar.stylefill = 'fill';
  document.getElementById('d4')?.appendChild(bar);
  (function() {
    const repeatingBar = bar;
    const repeat = function() {
      repeatingBar.duration = '2';
      window.setTimeout(repeat, 3000);
    };
    repeat();
  })();
}

if (!only || only === 5) {
  bar = document.createElement('timer-bar') as TimerBar;
  bar.lefttext = 'remain';
  bar.stylefill = 'fill';
  bar.hideafter = '0';
  bar.value = '0';
  bar.duration = '2';
  document.getElementById('d5')?.appendChild(bar);
}

if (!only || only === 6) {
  bar = document.createElement('timer-bar') as TimerBar;
  bar.lefttext = 'remain';
  bar.stylefill = 'fill';
  bar.hideafter = '0';
  document.getElementById('d6')?.appendChild(bar);
  bar.value = '0';
  bar.duration = '2';
}

if (!only || only === 7) {
  bar = document.createElement('timer-bar') as TimerBar;
  bar.lefttext = 'remain';
  bar.stylefill = 'fill';
  bar.hideafter = '0';
  bar.duration = '6';
  bar.value = '2';
  document.getElementById('d7')?.appendChild(bar);
}

if (!only || only === 8) {
  bar = document.createElement('timer-bar') as TimerBar;
  bar.lefttext = 'remain';
  bar.stylefill = 'fill';
  bar.hideafter = '0';
  bar.duration = '6';
  document.getElementById('d8')?.appendChild(bar);
  bar.value = '2';
}

if (!only || only === 9) {
  bar = document.createElement('timer-bar') as TimerBar;
  bar.lefttext = 'remain';
  bar.stylefill = 'empty';
  bar.duration = '0';
  document.getElementById('d9')?.appendChild(bar);
}

if (!only || only === 10) {
  bar = document.createElement('timer-bar') as TimerBar;
  bar.lefttext = 'remain';
  bar.stylefill = 'empty';
  bar.hideafter = '0';
  bar.duration = '1';
  bar.value = '0';
  document.getElementById('d10')?.appendChild(bar);
}

if (!only || only === 11) {
  bar = document.createElement('timer-bar') as TimerBar;
  bar.lefttext = 'remain';
  bar.stylefill = 'fill';
  bar.hideafter = '0';
  document.getElementById('d11')?.appendChild(bar);
  bar.duration = '2';
  (function() {
    const repeatingBar = bar;
    window.setTimeout(() => {
      repeatingBar.duration = '2';
    }, 1000);
  })();
}

if (!only || only === 12) {
  bar = document.createElement('timer-bar') as TimerBar;
  bar.lefttext = 'remain';
  bar.stylefill = 'fill';
  bar.hideafter = '0';
  document.getElementById('d12')?.appendChild(bar);
  bar.duration = '2';
  (function() {
    const repeatingBar = bar;
    window.setTimeout(() => {
      repeatingBar.value = '2';
    }, 1000);
  })();
}

if (!only || only === 'b1') {
  bar = document.createElement('timer-bar') as TimerBar;
  bar.lefttext = 'remain';
  bar.stylefill = 'fill';
  bar.duration = '2';
  document.getElementById('b1')?.appendChild(bar);
}

if (!only || only === 'b2') {
  bar = document.createElement('timer-bar') as TimerBar;
  bar.lefttext = 'remain';
  bar.stylefill = 'fill';
  bar.duration = '2';
  bar.hideafter = '0.5';
  document.getElementById('b2')?.appendChild(bar);
}

if (!only || only === 'b13') {
  bar = document.createElement('timer-bar') as TimerBar;
  bar.lefttext = 'remain';
  bar.stylefill = 'fill';
  bar.duration = '2';
  document.getElementById('b13')?.appendChild(bar);
  (function() {
    const hideBar = bar;
    window.setTimeout(() => {
      hideBar.hideafter = '0';
    }, 2500);
  })();
}

if (!only || only === 'b3') {
  bar = document.createElement('timer-bar') as TimerBar;
  bar.lefttext = 'remain';
  bar.stylefill = 'fill';
  bar.duration = '2';
  bar.hideafter = '0';
  document.getElementById('b3')?.appendChild(bar);
  (function() {
    const repeatingBar = bar;
    const repeat = function() {
      // Setting elapsed after duration ends does nothing.
      repeatingBar.elapsed = '0';
      window.setTimeout(repeat, 3000);
    };
    repeat();
  })();
}

if (!only || only === 'b4') {
  bar = document.createElement('timer-bar') as TimerBar;
  bar.lefttext = 'remain';
  bar.stylefill = 'fill';
  document.getElementById('b4')?.appendChild(bar);
  (function() {
    const repeatingBar = bar;
    const repeat = function() {
      repeatingBar.duration = '2';
      window.setTimeout(repeat, 3000);
    };
    repeat();
  })();
}

if (!only || only === 'b5') {
  bar = document.createElement('timer-bar') as TimerBar;
  bar.lefttext = 'remain';
  bar.stylefill = 'fill';
  bar.hideafter = '0';
  bar.elapsed = '2';
  bar.duration = '2';
  document.getElementById('b5')?.appendChild(bar);
}

if (!only || only === 'b6') {
  bar = document.createElement('timer-bar') as TimerBar;
  bar.lefttext = 'remain';
  bar.stylefill = 'fill';
  bar.hideafter = '0';
  document.getElementById('b6')?.appendChild(bar);
  bar.elapsed = '2';
  bar.duration = '2';
}

if (!only || only === 'b7') {
  bar = document.createElement('timer-bar') as TimerBar;
  bar.lefttext = 'remain';
  bar.stylefill = 'fill';
  bar.hideafter = '0';
  bar.duration = '6';
  bar.elapsed = '4';
  document.getElementById('b7')?.appendChild(bar);
}

if (!only || only === 'b8') {
  bar = document.createElement('timer-bar') as TimerBar;
  bar.lefttext = 'remain';
  bar.stylefill = 'fill';
  bar.hideafter = '0';
  bar.duration = '6';
  document.getElementById('b8')?.appendChild(bar);
  bar.elapsed = '4';
}

if (!only || only === 'b9') {
  bar = document.createElement('timer-bar') as TimerBar;
  bar.lefttext = 'remain';
  bar.stylefill = 'empty';
  bar.duration = '0';
  document.getElementById('b9')?.appendChild(bar);
}

if (!only || only === 'b10') {
  bar = document.createElement('timer-bar') as TimerBar;
  bar.lefttext = 'remain';
  bar.stylefill = 'empty';
  bar.hideafter = '0';
  bar.duration = '1';
  bar.elapsed = '1';
  document.getElementById('b10')?.appendChild(bar);
}

if (!only || only === 'b11') {
  bar = document.createElement('timer-bar') as TimerBar;
  bar.lefttext = 'remain';
  bar.stylefill = 'fill';
  bar.hideafter = '0';
  document.getElementById('b11')?.appendChild(bar);
  bar.duration = '2';
  (function() {
    const repeatingBar = bar;
    window.setTimeout(() => {
      repeatingBar.duration = '2';
    }, 1000);
  })();
}

if (!only || only === 'b12') {
  bar = document.createElement('timer-bar') as TimerBar;
  bar.lefttext = 'remain';
  bar.stylefill = 'fill';
  bar.hideafter = '0';
  document.getElementById('b12')?.appendChild(bar);
  bar.duration = '2';
  (function() {
    const repeatingBar = bar;
    window.setTimeout(() => {
      repeatingBar.elapsed = '0';
    }, 1000);
  })();
}

if (!only || only === 'c1') {
  bar = document.createElement('timer-bar') as TimerBar;
  bar.duration = '10000';
  bar.value = '9000';
  document.getElementById('c1')?.appendChild(bar);
  bar.fg = 'green';
}

if (!only || only === 'c2') {
  bar = document.createElement('timer-bar') as TimerBar;
  bar.duration = '10000';
  bar.value = '9000';
  document.getElementById('c2')?.appendChild(bar);
  bar.bg = 'green';
  bar.fg = 'grey';
}

if (!only || only === 'c3') {
  bar = document.createElement('timer-bar') as TimerBar;
  bar.duration = '10000';
  bar.value = '9000';
  document.getElementById('c3')?.appendChild(bar);
  bar.lefttext = 'remain';
  bar.centertext = 'elapsed';
  bar.righttext = 'percent';
}

if (!only || only === 'c4') {
  bar = document.createElement('timer-bar') as TimerBar;
  bar.duration = '10000';
  bar.value = '9000';
  document.getElementById('c4')?.appendChild(bar);
  bar.lefttext = 'elapsed';
  bar.centertext = 'percent';
  bar.righttext = 'duration';
}

if (!only || only === 'c5') {
  bar = document.createElement('timer-bar') as TimerBar;
  bar.duration = '10000';
  bar.value = '9000';
  document.getElementById('c5')?.appendChild(bar);
  bar.lefttext = 'percent';
  bar.centertext = 'duration';
  bar.righttext = 'fixed';
}

if (!only || only === 'c6') {
  bar = document.createElement('timer-bar') as TimerBar;
  bar.duration = '10000';
  bar.value = '9000';
  document.getElementById('c6')?.appendChild(bar);
  bar.lefttext = 'duration';
  bar.centertext = 'fixed';
  bar.righttext = 'remain';
}

if (!only || only === 'c7') {
  bar = document.createElement('timer-bar') as TimerBar;
  bar.duration = '10000';
  bar.value = '9000';
  document.getElementById('c7')?.appendChild(bar);
  bar.lefttext = 'fixed';
  bar.centertext = 'remain';
  bar.righttext = 'elapsed';
}

if (!only || only === 'c8') {
  bar = document.createElement('timer-bar') as TimerBar;
  bar.duration = '10000';
  bar.value = '9000';
  document.getElementById('c8')?.appendChild(bar);
  bar.width = '50px';
  bar.height = '10px';
}

if (!only || only === 'c9') {
  bar = document.createElement('timer-bar') as TimerBar;
  bar.duration = '10000';
  bar.value = '9000';
  document.getElementById('c9')?.appendChild(bar);
  bar.width = '50%';
  bar.height = '50%';
}

if (!only || only === 'c10') {
  bar = document.createElement('timer-bar') as TimerBar;
  bar.duration = '100';
  bar.value = '90';
  document.getElementById('c10')?.appendChild(bar);
  bar.stylefill = 'empty';
  bar.toward = 'left';
}

if (!only || only === 'c11') {
  bar = document.createElement('timer-bar') as TimerBar;
  bar.duration = '100';
  bar.value = '90';
  document.getElementById('c11')?.appendChild(bar);
  bar.stylefill = 'fill';
  bar.toward = 'left';
}

if (!only || only === 'c12') {
  bar = document.createElement('timer-bar') as TimerBar;
  bar.duration = '100';
  bar.value = '90';
  document.getElementById('c12')?.appendChild(bar);
  bar.stylefill = 'empty';
  bar.toward = 'right';
}

if (!only || only === 'c13') {
  bar = document.createElement('timer-bar') as TimerBar;
  bar.duration = '100';
  bar.value = '90';
  document.getElementById('c13')?.appendChild(bar);
  bar.stylefill = 'fill';
  bar.toward = 'right';
}

customElements.define('timer-bar', TimerBar);
