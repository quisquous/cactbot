import { UnreachableCode } from '../../../../resources/not_reached';

const hideEvents = [
  'mouseleave',
  'blur',
] as const;

const validDirections = [
  'top',
  'right',
  'bottom',
  'left',
] as const;
type ValidDirection = typeof validDirections[number];

const showEvents = [
  'mouseenter',
  'focus',
] as const;

type TemplatesType = {[Property in ValidDirection]: HTMLTemplateElement};

const toPx = (px: number): string => `${px}px`;

export default class Tooltip {
  private offset = {
    x: 0,
    y: 0,
  };
  private target: HTMLElement;
  private direction: ValidDirection;
  private tooltip: HTMLElement;
  private inner: HTMLElement;
  private arrow: HTMLElement;

  private static templates: TemplatesType;

  constructor(
      // @TODO: Refactor this to only accept HTMLElement after upstream classes are converted
      targetRef: string | HTMLElement,
      direction: ValidDirection,
      text: string,
      autoShow = true,
      autoHide = true) {
    Tooltip.initializeTemplates();

    let target: HTMLElement | null;

    if (typeof targetRef === 'string')
      target = document.querySelector(targetRef);
    else
      target = targetRef;

    if (!(target instanceof HTMLElement)) {
      const msg = 'Invalid selector or element passed to Tooltip';
      console.error(msg);
      throw new Error(msg);
    }

    this.target = target;
    this.direction = direction;
    this.tooltip = Tooltip.cloneTemplate(direction);
    const innerElem = this.tooltip.querySelector('.tooltip-inner');
    if (!(innerElem instanceof HTMLElement))
      throw new UnreachableCode();

    this.inner = innerElem;
    const arrowElem = this.tooltip.querySelector('.arrow');
    if (!(arrowElem instanceof HTMLElement))
      throw new UnreachableCode();

    this.arrow = arrowElem;
    this.setText(text);
    document.body.append(this.tooltip);
    if (autoShow) {
      showEvents.forEach((e) => {
        this.target.addEventListener(e, () => {
          this.show();
        });
      });
    }
    if (autoHide) {
      hideEvents.forEach((e) => {
        this.target.addEventListener(e, () => {
          this.hide();
        });
      });
    }
  }

  setText(text: string): void {
    this.inner.textContent = text;
  }

  show(): void {
    const targetRect = this.target.getBoundingClientRect();
    const targetMiddle = {
      x: targetRect.x + (targetRect.width / 2),
      y: targetRect.y + (targetRect.height / 2),
    };
    const tooltipRect = this.tooltip.getBoundingClientRect();
    // Middle of tooltip - half of arrow height
    const lrArrowHeight = (tooltipRect.height / 2) -
      (this.arrow.getBoundingClientRect().height / 2);
    switch (this.direction) {
    case 'top':
      this.tooltip.style.left = toPx((targetMiddle.x - (tooltipRect.width / 2)) + this.offset.x);
      this.tooltip.style.bottom = toPx((targetRect.y - tooltipRect.height) + this.offset.y);
      break;
    case 'right':
      this.tooltip.style.left = toPx(targetRect.right + this.offset.x);
      this.tooltip.style.top = toPx((targetMiddle.y - (tooltipRect.height / 2)) + this.offset.y);
      this.arrow.style.top = toPx(lrArrowHeight);
      break;
    case 'bottom':
      this.tooltip.style.left = toPx((targetMiddle.x - (tooltipRect.width / 2)) + this.offset.x);
      this.tooltip.style.top = toPx(targetRect.bottom + this.offset.y);
      break;
    case 'left':
      this.tooltip.style.left = toPx((targetRect.left - tooltipRect.width) + this.offset.x);
      this.tooltip.style.top = toPx((targetMiddle.y - (tooltipRect.height / 2)) + this.offset.y);
      this.arrow.style.top = toPx(lrArrowHeight);
      break;
    }
    this.tooltip.classList.add('show');
    this.tooltip.setAttribute('data-show', '');
  }

  hide(): void {
    this.tooltip.classList.remove('show');
    this.tooltip.removeAttribute('data-show');
  }

  static initializeTemplates(): void {
    if (Tooltip.templates)
      return;

    Tooltip.templates = {
      top: Tooltip.getTemplate('top'),
      right: Tooltip.getTemplate('right'),
      bottom: Tooltip.getTemplate('bottom'),
      left: Tooltip.getTemplate('left'),
    };
  }

  static getTemplate(dir: string): HTMLTemplateElement {
    const elemName = `${dir}TooltipTemplate`;
    const ret = document.getElementById(elemName);
    if (ret instanceof HTMLElement)
      return ret as HTMLTemplateElement;
    throw new UnreachableCode();
  }

  static cloneTemplate(direction: ValidDirection): HTMLElement {
    const template = Tooltip.templates[direction];
    const node = template.content.querySelector('.tooltip')?.cloneNode(true);
    if (node instanceof HTMLElement)
      return node;
    throw new UnreachableCode();
  }
}
