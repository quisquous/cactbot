import { kAbility } from '../constants';

let resetFunc = null;
const cardsMap = {
  'Balance': { 'bonus': 'melee', 'seal': 'Solar' },
  'Bole': { 'bonus': 'range', 'seal': 'Solar' },
  'Arrow': { 'bonus': 'melee', 'seal': 'Lunar' },
  'Ewer': { 'bonus': 'range', 'seal': 'Lunar' },
  'Spear': { 'bonus': 'melee', 'seal': 'Celestial' },
  'Spire': { 'bonus': 'range', 'seal': 'Celestial' },
};

export function setup(bars) {
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

  bars.onJobDetailUpdate((jobDetail) => {
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
    sealBox.innerText = sealCount;
    if (sealCount === 3)
      sealBox.parentNode.classList.add('ready');
    else
      sealBox.parentNode.classList.remove('ready');
  });

  bars.onUseAbility([kAbility.Combust2, kAbility.Combust3], () => {
    combustBox.duration = 30;
  });
  bars.onUseAbility(kAbility.Combust, () => {
    combustBox.duration = 18;
  });

  bars.onUseAbility(kAbility.Draw, () => {
    drawBox.duration = 30;
  });
  bars.onUseAbility(kAbility.LucidDreaming, () => {
    lucidBox.duration = 60;
  });

  bars.onStatChange('AST', () => {
    combustBox.valuescale = bars.gcdSpell;
    combustBox.threshold = bars.gcdSpell + 1;
    drawBox.valuescale = bars.gcdSpell;
    drawBox.threshold = bars.gcdSpell + 1;
    lucidBox.valuescale = bars.gcdSpell;
    lucidBox.threshold = bars.gcdSpell + 1;
  });

  resetFunc = (bars) => {
    combustBox.duration = 0;
    drawBox.duration = 0;
    lucidBox.duration = 0;
  };
}

export function reset(bars) {
  if (resetFunc)
    resetFunc(bars);
}
