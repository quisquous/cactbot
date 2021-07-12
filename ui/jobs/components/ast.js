import { kAbility } from '../constants';
import { Component } from './base';

const cardsMap = {
  'Balance': { 'bonus': 'melee', 'seal': 'Solar' },
  'Bole': { 'bonus': 'range', 'seal': 'Solar' },
  'Arrow': { 'bonus': 'melee', 'seal': 'Lunar' },
  'Ewer': { 'bonus': 'range', 'seal': 'Lunar' },
  'Spear': { 'bonus': 'melee', 'seal': 'Celestial' },
  'Spire': { 'bonus': 'range', 'seal': 'Celestial' },
};

export default class AstComponent extends Component {
  setup() {
    this.combustBox = this.addProcBox({
      id: 'ast-procs-combust',
      fgColor: 'ast-color-combust',
      notifyWhenExpired: true,
    });

    this.drawBox = this.addProcBox({
      id: 'ast-procs-draw',
      fgColor: 'ast-color-draw',
    });

    this.lucidBox = this.addProcBox({
      id: 'ast-procs-luciddreaming',
      fgColor: 'ast-color-lucid',
    });

    this.cardBox = this.addResourceBox({
      classList: ['ast-color-card'],
    });

    this.sealBox = this.addResourceBox({
      classList: ['ast-color-seal'],
    });
  }

  onJobDetailUpdate(jobDetail) {
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
    this.sealBox.innerText = sealCount;
    if (sealCount === 3)
      this.sealBox.parentNode.classList.add('ready');
    else
      this.sealBox.parentNode.classList.remove('ready');
  }

  onUseAbility(action) {
    switch (action) {
    case kAbility.Combust:
      this.combustBox.duration = 18;
      break;

    case kAbility.Combust2:
    case kAbility.Combust3:
      this.combustBox.duration = 30;
      break;

    case kAbility.Draw:
      this.drawBox.duration = 30;
      break;

    case kAbility.LucidDreaming:
      this.lucidBox.duration = 60;
      break;

    default:
      break;
    }
  }

  onStatChange(stat) {
    this.combustBox.valuescale = stat.gcdSpell;
    this.combustBox.threshold = stat.gcdSpell + 1;
    this.drawBox.valuescale = stat.gcdSpell;
    this.drawBox.threshold = stat.gcdSpell + 1;
    this.lucidBox.valuescale = stat.gcdSpell;
    this.lucidBox.threshold = stat.gcdSpell + 1;
  }

  reset() {
    this.combustBox.duration = 0;
    this.drawBox.duration = 0;
    this.lucidBox.duration = 0;
  }
}
