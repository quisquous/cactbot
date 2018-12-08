'use strict';
let skin = document.createElement('style');
skin.innerHTML = `
widget-list /deep/ .timerbar-bg {
  position: absolute;
  width: 100% !important;
  height: 5px !important;
  border-radius: 1px;
  background-color: #312008 !important;
  border: 1px solid #AA6E03 !important;
  box-shadow: 0 0 8px 0 #AA6E03;
  opacity: 1.0;
  z-index: 0;
}
widget-list /deep/ .timerbar-fg {
  position: absolute;
  width: 100%;
  height: 5px !important;
  top: 0px; left: 0px;
  background-color: rgba(255, 255, 255, 1) !important;
  box-shadow: 0 0 2px 0 rgba(255, 255, 255, 1) !important;
  text-align: center;
  position: absolute;
  margin: 1px;
  z-index: 1;
  opacity: 1.0;
  will-change: transform;
}
widget-list /deep/ .text {
  text-shadow: 
    0 0 3px #AA6E03,
    0 1px 3px #AA6E03,
    0 -1px 3px #AA6E03;
}
widget-list /deep/ .text-container {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  z-index: 2;
}
.info-text {
  color: rgba(255, 255, 255, 1);
  text-shadow: 
    -1px 0 rgb(117, 153, 87), 0 -1px rgb(117, 153, 87), 
    1px 0 rgb(117, 153, 87), 0 1px rgb(117, 153, 87),
    0 0 10px rgb(117, 153, 87);
  font-size: 140%;
  will-change: transform;
}
.alert-text {
  color: rgba(255, 255, 255, 1);
  text-shadow: 
    -1px 0 rgb(170, 110, 3), 0 -1px rgb(170, 110, 3), 
    1px 0 rgb(170, 110, 3), 0 1px rgb(170, 110, 3),
    0 0 10px rgb(170, 110, 3);
  font-size: 170%;
  will-change: transform;
  text-transform: uppercase;
}
.alarm-text {
  color: rgba(255, 255, 255, 1);
  text-shadow: 
    -1px 0 rgb(247, 120, 120), 0 -1px rgb(247, 120, 120), 
    1px 0 rgb(247, 120, 120), 0 1px rgb(247, 120, 120),
    0 0 10px rgb(247, 120, 120);
  font-size: 230%;
  will-change: transform;
  text-transform: uppercase;
}
`;
document.head.appendChild(skin);

TimerBar.prototype.draw = function() {
  let elapsedSec = (new Date() - this._start) / 1000;
  let remainSec = Math.max(0, this._duration - elapsedSec);
  let percent = this._duration <= 0 ? 0 : remainSec / this._duration;
  // Keep it between 0 and 1.
  percent = Math.min(1, Math.max(0, percent));
  let display_remain = remainSec ? remainSec.toFixed(1) : '';
  let display_elapsed = elapsedSec.toFixed(1);
  if (this._style_fill)
    percent = 1.0 - percent;
  this.foregroundElement.style.transform = 'scale(' + percent + ',1)';
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
};
