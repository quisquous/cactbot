import TimerBox from '../../../resources/timerbox';
import { JobDetail } from '../../../types/event';
import { NetMatches } from '../../../types/net_matches';
import { kAbility } from '../constants';
import { Bars } from '../jobs';

import { Component } from './base';

const cardsMap = {
  'Balance': { 'bonus': 'melee', 'seal': 'Solar' },
  'Bole': { 'bonus': 'range', 'seal': 'Solar' },
  'Arrow': { 'bonus': 'melee', 'seal': 'Lunar' },
  'Ewer': { 'bonus': 'range', 'seal': 'Lunar' },
  'Spear': { 'bonus': 'melee', 'seal': 'Celestial' },
  'Spire': { 'bonus': 'range', 'seal': 'Celestial' },
} as const;

export default class AstComponent extends Component {
  combustBox: TimerBox;
  drawBox: TimerBox;
  lucidBox: TimerBox;
  cardBox: HTMLDivElement;
  sealBox: HTMLDivElement;
  constructor(bars: Bars) {
    super(bars);

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

  onJobDetailUpdate(jobDetail: JobDetail['AST']): void {
    const card = jobDetail.heldCard;
    const seals = jobDetail.arcanums;

    // Show on which kind of jobs your card plays better by color
    // Blue on melee, purple on ranged, and grey when no card
    const cardParent = this.cardBox.parentNode as HTMLElement;
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
    const sealParent = this.sealBox.parentNode as HTMLElement;
    if (sealCount === 3)
      sealParent.classList.add('ready');
    else
      sealParent.classList.remove('ready');
  }

  onUseAbility(action: string): void {
    switch (action) {
    case kAbility.Combust:
      this.combustBox.duration = '18';
      break;

    case kAbility.Combust2:
    case kAbility.Combust3:
      this.combustBox.duration = '30';
      break;

    case kAbility.Draw:
      this.drawBox.duration = '30';
      break;

    case kAbility.LucidDreaming:
      this.lucidBox.duration = '60';
      break;

    default:
      break;
    }
  }

  onStatChange(stat: NetMatches['PlayerStats'] & { gcdSkill: number; gcdSpell: number }): void {
    this.combustBox.valuescale = stat.gcdSpell.toString();
    this.combustBox.threshold = (stat.gcdSpell + 1).toString();
    this.drawBox.valuescale = stat.gcdSpell.toString();
    this.drawBox.threshold = (stat.gcdSpell + 1).toString();
    this.lucidBox.valuescale = stat.gcdSpell.toString();
    this.lucidBox.threshold = (stat.gcdSpell + 1).toString();
  }

  reset(): void {
    this.combustBox.duration = '0';
    this.drawBox.duration = '0';
    this.lucidBox.duration = '0';
  }
}
