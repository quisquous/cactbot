import TimerBox from '../../../resources/timerbox';
import { JobDetail } from '../../../types/event';
import { ResourceBox } from '../bars';
import { kAbility } from '../constants';

import { BaseComponent, ComponentInterface } from './base';

const cardsMap = {
  'Balance': { 'bonus': 'melee', 'seal': 'Solar' },
  'Bole': { 'bonus': 'range', 'seal': 'Solar' },
  'Arrow': { 'bonus': 'melee', 'seal': 'Lunar' },
  'Ewer': { 'bonus': 'range', 'seal': 'Lunar' },
  'Spear': { 'bonus': 'melee', 'seal': 'Celestial' },
  'Spire': { 'bonus': 'range', 'seal': 'Celestial' },
} as const;

export class AST5xComponent extends BaseComponent {
  combustBox: TimerBox;
  drawBox: TimerBox;
  lucidBox: TimerBox;
  cardBox: ResourceBox;
  sealBox: ResourceBox;

  constructor(o: ComponentInterface) {
    super(o);

    this.combustBox = this.bars.addProcBox({
      id: 'ast-procs-combust',
      fgColor: 'ast-color-combust',
      notifyWhenExpired: true,
    });

    this.drawBox = this.bars.addProcBox({
      id: 'ast-procs-draw',
      fgColor: 'ast-color-draw',
    });

    this.lucidBox = this.bars.addProcBox({
      id: 'ast-procs-luciddreaming',
      fgColor: 'ast-color-lucid',
    });

    this.cardBox = this.bars.addResourceBox({
      classList: ['ast-color-card'],
    });

    this.sealBox = this.bars.addResourceBox({
      classList: ['ast-color-seal'],
    });

    this.reset();
  }

  override onJobDetailUpdate(jobDetail: JobDetail['AST']): void {
    const card = jobDetail.heldCard;
    const seals = jobDetail.arcanums;

    // Show on which kind of jobs your card plays better by color
    // Blue on melee, purple on ranged, and grey when no card
    const cardParent = this.cardBox.parentNode;
    cardParent.classList.remove('melee', 'range');
    if (card in cardsMap)
      cardParent.classList.add(cardsMap[card].bonus);

    // Show whether you already have this seal
    // O means it's OK to play this card
    // X means don't play this card directly if time permits
    if (!cardsMap[card])
      this.cardBox.innerText = '';
    else if (seals.includes(cardsMap[card].seal))
      this.cardBox.innerText = 'X';
    else
      this.cardBox.innerText = 'O';

    // Show how many kind of seals you already have
    // Turn green when you have all 3 kinds of seal
    const sealCount = new Set(seals).size;
    this.sealBox.innerText = sealCount.toString();
    if (sealCount === 3)
      this.sealBox.parentNode.classList.add('ready');
    else
      this.sealBox.parentNode.classList.remove('ready');
  }

  override onUseAbility(id: string): void {
    switch (id) {
      case kAbility.Combust2:
      case kAbility.Combust3:
        this.combustBox.duration = 30;
        break;
      case kAbility.Combust:
        this.combustBox.duration = 18;
        break;
      case kAbility.Draw:
        this.drawBox.duration = 30;
        break;
      case kAbility.LucidDreaming:
        this.lucidBox.duration = 60;
        break;
    }
  }
  override onStatChange({ gcdSpell }: { gcdSpell: number }): void {
    this.combustBox.valuescale = gcdSpell;
    this.combustBox.threshold = gcdSpell + 1;
    this.drawBox.valuescale = gcdSpell;
    this.drawBox.threshold = gcdSpell + 1;
    this.lucidBox.valuescale = gcdSpell;
    this.lucidBox.threshold = gcdSpell + 1;
  }

  override reset(): void {
    this.combustBox.duration = 0;
    this.drawBox.duration = 0;
    this.lucidBox.duration = 0;
  }
}

export class ASTComponent extends BaseComponent {
  combustBox: TimerBox;
  drawBox: TimerBox;
  lucidBox: TimerBox;
  cardBox: ResourceBox;
  minorBox: ResourceBox;
  signs: HTMLElement[] = [];

  constructor(o: ComponentInterface) {
    super(o);

    this.combustBox = this.bars.addProcBox({
      id: 'ast-procs-combust',
      fgColor: 'ast-color-combust',
      notifyWhenExpired: true,
    });

    this.drawBox = this.bars.addProcBox({
      id: 'ast-procs-draw',
      fgColor: 'ast-color-draw',
    });

    this.lucidBox = this.bars.addProcBox({
      id: 'ast-procs-luciddreaming',
      fgColor: 'ast-color-lucid',
    });

    this.cardBox = this.bars.addResourceBox({
      classList: ['ast-color-card'],
    });

    this.minorBox = this.bars.addResourceBox({
      classList: ['ast-color-card'],
    });

    // Sign
    const stacksContainer = document.createElement('div');
    stacksContainer.id = 'ast-stacks';
    stacksContainer.classList.add('stacks');
    this.bars.addJobBarContainer().appendChild(stacksContainer);
    const signContainer = document.createElement('div');
    signContainer.id = 'ast-stacks-sign';
    stacksContainer.appendChild(signContainer);

    for (let i = 0; i < 3; ++i) {
      const d = document.createElement('div');
      signContainer.appendChild(d);
      this.signs.push(d);
    }
    this.signs.reverse();

    this.reset();
  }

  override onJobDetailUpdate(jobDetail: JobDetail['AST']): void {
    // Minor Arcana, ↑ = lord, + = lady
    const minor = jobDetail.crownCard;
    this.minorBox.parentNode.classList.toggle('lord', minor === 'Lord');
    this.minorBox.parentNode.classList.toggle('lady', minor === 'Lady');
    if (minor === 'Lord')
      this.minorBox.innerText = '↑';
    else if (minor === 'Lady')
      this.minorBox.innerText = '＋';
    else
      this.minorBox.innerText = '';

    const card = jobDetail.heldCard;
    const sign = jobDetail.arcanums;
    // Show on which kind of jobs your card plays better by color
    // Blue on melee, purple on ranged, and grey when no card
    const cardParent = this.cardBox.parentNode;
    cardParent.classList.remove('melee', 'range');
    if (card in cardsMap)
      cardParent.classList.add(cardsMap[card].bonus);

    // Show whether you already have this seal
    // ○ means it's OK to play this card
    // × means you'd better redraw if possible
    if (!cardsMap[card])
      this.cardBox.innerText = '';
    else if (sign.includes(cardsMap[card].seal))
      this.cardBox.innerText = '×';
    else
      this.cardBox.innerText = '○';

    const signlist = sign.toString().split(',').reverse();
    for (let i = 0; i < 3; ++i) {
      this.signs[i]?.classList.remove('Solar', 'Lunar', 'Celestial');
      if (signlist.length > i && signlist[0] !== '')
        this.signs[i]?.classList.add(signlist[i] ?? '');
    }
  }

  override onUseAbility(id: string): void {
    switch (id) {
      case kAbility.Combust2:
      case kAbility.Combust3:
        this.combustBox.duration = 30;
        break;
      case kAbility.Combust:
        this.combustBox.duration = 18;
        break;
      case kAbility.Draw:
          this.drawBox.duration = 30 + this.drawBox.value;
        break;
      case kAbility.LucidDreaming:
        this.lucidBox.duration = 60;
        break;
    }
  }
  override onStatChange({ gcdSpell }: { gcdSpell: number }): void {
    this.combustBox.valuescale = gcdSpell;
    this.combustBox.threshold = gcdSpell + 1;
    this.drawBox.valuescale = gcdSpell;
    this.drawBox.threshold = gcdSpell + 1;
    this.lucidBox.valuescale = gcdSpell;
    this.lucidBox.threshold = gcdSpell + 1;
  }

  override reset(): void {
    this.combustBox.duration = 0;
    this.drawBox.duration = 0;
    this.lucidBox.duration = 0;
  }
}
