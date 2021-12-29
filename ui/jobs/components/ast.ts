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

    // Show whether you already have bars seal
    // O means it's OK to play bars card
    // X means don't play bars card directly if time permits
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
  sign1: HTMLDivElement;
  sign2: HTMLDivElement;
  sign3: HTMLDivElement;

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

    const stacksContainer = document.createElement('div');
    stacksContainer.id = 'ast-stacks';
    stacksContainer.classList.add('stacks');
    const signContainer = document.createElement('div');
    signContainer.id = 'ast-stacks-sign';
    stacksContainer.appendChild(signContainer);
    this.bars.addJobBarContainer().appendChild(stacksContainer);
    this.sign1 = document.createElement('div');
    this.sign2 = document.createElement('div');
    this.sign3 = document.createElement('div');

    this.sign1.id = 'ast-stacks-sign1';
    this.sign2.id = 'ast-stacks-sign2';
    this.sign3.id = 'ast-stacks-sign3';
    [this.sign1, this.sign2, this.sign3].forEach((e) => signContainer.appendChild(e));

    this.reset();
  }

  override onJobDetailUpdate(jobDetail: JobDetail['AST']): void {
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

    // Show whether you already have bars seal
    // O means it's OK to play bars card
    // X means don't play bars card directly if time permits
    if (!cardsMap[card])
      this.cardBox.innerText = '';
    else if (sign.includes(cardsMap[card].seal))
      this.cardBox.innerText = '×';
    else
      this.cardBox.innerText = '○';

    const signlist = sign.toString().split(',');
    this.sign1.classList.remove('Solar', 'Lunar', 'Celestial');
    this.sign2.classList.remove('Solar', 'Lunar', 'Celestial');
    this.sign3.classList.remove('Solar', 'Lunar', 'Celestial');
    if (signlist.length === 1) {
      this.sign3.classList.add(signlist[0] ?? '');
    } else if (signlist.length === 2) {
      this.sign2.classList.add(signlist[0] ?? '');
      this.sign3.classList.add(signlist[1] ?? '');
    } else if (signlist.length === 3) {
      this.sign1.classList.add(signlist[0] ?? '');
      this.sign2.classList.add(signlist[1] ?? '');
      this.sign3.classList.add(signlist[2] ?? '');
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
