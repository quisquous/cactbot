import { JobDetail } from '../../../types/event';
import { Bars } from '../bars';
import { kAbility } from '../constants';
import { Player } from '../player';

let resetFunc: (bars: Bars) => void;
const cardsMap = {
  'Balance': { 'bonus': 'melee', 'seal': 'Solar' },
  'Bole': { 'bonus': 'range', 'seal': 'Solar' },
  'Arrow': { 'bonus': 'melee', 'seal': 'Lunar' },
  'Ewer': { 'bonus': 'range', 'seal': 'Lunar' },
  'Spear': { 'bonus': 'melee', 'seal': 'Celestial' },
  'Spire': { 'bonus': 'range', 'seal': 'Celestial' },
} as const;

export const setup = (bars: Bars, player: Player): void => {
  const combustBox = bars.addProcBox({
    id: 'ast-procs-combust',
    fgColor: 'ast-color-combust',
    notifyWhenExpired: true,
  });

  const drawBox = bars.addProcBox({
    id: 'ast-procs-draw',
    fgColor: 'ast-color-draw',
  });

  const lucidBox = bars.addProcBox({
    id: 'ast-procs-luciddreaming',
    fgColor: 'ast-color-lucid',
  });

  const cardBox = bars.addResourceBox({
    classList: ['ast-color-card'],
  });

  const sealBox = bars.addResourceBox({
    classList: ['ast-color-seal'],
  });

  player.onJobDetailUpdate('AST', (jobDetail: JobDetail['AST']) => {
    const card = jobDetail.heldCard;
    const seals = jobDetail.arcanums;

    // Show on which kind of jobs your card plays better by color
    // Blue on melee, purple on ranged, and grey when no card
    const cardParent = cardBox.parentNode;
    cardParent.classList.remove('melee', 'range');
    if (card in cardsMap)
      cardParent.classList.add(cardsMap[card].bonus);

    // Show whether you already have bars seal
    // O means it's OK to play bars card
    // X means don't play bars card directly if time permits
    if (!cardsMap[card])
      cardBox.innerText = '';
    else if (seals.includes(cardsMap[card].seal))
      cardBox.innerText = 'X';
    else
      cardBox.innerText = 'O';

    // Show how many kind of seals you already have
    // Turn green when you have all 3 kinds of seal
    const sealCount = new Set(seals).size;
    sealBox.innerText = sealCount.toString();
    if (sealCount === 3)
      sealBox.parentNode.classList.add('ready');
    else
      sealBox.parentNode.classList.remove('ready');
  });

  bars.onUseAbility((id) => {
    switch (id) {
      case kAbility.Combust2:
      case kAbility.Combust3:
        combustBox.duration = 30;
        break;
      case kAbility.Combust:
        combustBox.duration = 18;
        break;
      case kAbility.Draw:
        drawBox.duration = 30;
        break;
      case kAbility.LucidDreaming:
        lucidBox.duration = 60;
        break;
    }
  });

  bars.onStatChange('AST', ({ gcdSpell }) => {
    combustBox.valuescale = gcdSpell;
    combustBox.threshold = gcdSpell + 1;
    drawBox.valuescale = gcdSpell;
    drawBox.threshold = gcdSpell + 1;
    lucidBox.valuescale = gcdSpell;
    lucidBox.threshold = gcdSpell + 1;
  });

  resetFunc = (_bars: Bars): void => {
    combustBox.duration = 0;
    drawBox.duration = 0;
    lucidBox.duration = 0;
  };
};

export const reset = (bars: Bars): void => {
  if (resetFunc)
    resetFunc(bars);
};
