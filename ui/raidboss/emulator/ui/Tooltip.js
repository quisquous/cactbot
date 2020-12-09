export default class Tooltip {
  constructor(target, direction, text, autoShow = true, autoHide = true) {
    if (!Tooltip.validDirections.includes(direction))
      throw new Error('Invalid direction for tooltip: ' + direction);

    if (typeof target === 'string')
      target = document.querySelector(target);

    this.offset = {
      x: 0,
      y: 0,
    };
    this.target = target;
    this.direction = direction;
    // Technically, templates should use querySelector, but this gets called so often
    // on trigger-heavy encounters that we should hack its performance a bit
    this.tooltip = document.getElementById(`${direction}TooltipTemplate`)
      .content.firstElementChild.cloneNode(true);
    this.setText(text);
    document.body.append(this.tooltip);
    if (autoShow) {
      Tooltip.showEvents.forEach((e) => {
        target.addEventListener(e, () => {
          this.show();
        });
      });
    }
    if (autoHide) {
      Tooltip.hideEvents.forEach((e) => {
        target.addEventListener(e, () => {
          this.hide();
        });
      });
    }
  }

  setText(text) {
    this.tooltip.querySelector('.tooltip-inner').textContent = text;
  }

  show() {
    const targetRect = this.target.getBoundingClientRect();
    const targetMiddle = {
      x: targetRect.x + (targetRect.width / 2),
      y: targetRect.y + (targetRect.height / 2),
    };
    const tooltipRect = this.tooltip.getBoundingClientRect();
    // Middle of tooltip - half of arrow height
    const lrArrowHeight = (tooltipRect.height / 2) -
      (this.tooltip.querySelector('.arrow').getBoundingClientRect().height / 2);
    switch (this.direction) {
    case 'top':
      this.tooltip.style.left = (targetMiddle.x - (tooltipRect.width / 2)) + this.offset.x;
      this.tooltip.style.bottom = (targetRect.y - tooltipRect.height) + this.offset.y;
      break;
    case 'right':
      this.tooltip.style.left = targetRect.right + this.offset.x;
      this.tooltip.style.top = (targetMiddle.y - (tooltipRect.height / 2)) + this.offset.y;
      this.tooltip.querySelector('.arrow').style.top = lrArrowHeight;
      break;
    case 'bottom':
      this.tooltip.style.left = (targetMiddle.x - (tooltipRect.width / 2)) + this.offset.x;
      this.tooltip.style.top = targetRect.bottom + this.offset.y;
      break;
    case 'left':
      this.tooltip.style.left = (targetRect.left - tooltipRect.width) + this.offset.x;
      this.tooltip.style.top = (targetMiddle.y - (tooltipRect.height / 2)) + this.offset.y;
      this.tooltip.querySelector('.arrow').style.top = lrArrowHeight;
      break;
    }
    this.tooltip.classList.add('show');
    this.tooltip.setAttribute('data-show', '');
  }

  hide() {
    this.tooltip.classList.remove('show');
    this.tooltip.removeAttribute('data-show');
  }
}

Tooltip.validDirections = [
  'top',
  'right',
  'bottom',
  'left',
];
Tooltip.showEvents = [
  'mouseenter',
  'focus',
];
Tooltip.hideEvents = [
  'mouseleave',
  'blur',
];
