import { kAbility } from '../constants.js';

const cardsMap = {
  'Balance': { 'bonus': 'melee', 'seal': 'Solar' },
  'Bole': { 'bonus': 'range', 'seal': 'Solar' },
  'Arrow': { 'bonus': 'melee', 'seal': 'Lunar' },
  'Ewer': { 'bonus': 'range', 'seal': 'Lunar' },
  'Spear': { 'bonus': 'melee', 'seal': 'Celestial' },
  'Spire': { 'bonus': 'range', 'seal': 'Celestial' },
};

export function setupAst(bars) {
  const combustBox = bars.addProcBox({
    id: 'ast-procs-combust',
    fgColor: 'ast-color-combust',
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

  bars.jobFuncs.push((jobDetail) => {
    const card = jobDetail.heldCard;
    const seals = jobDetail.arcanums.split(', ').filter((seal) => seal !== 'None');

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

  bars.abilityFuncMap[kAbility.Combust3] = () => {
    combustBox.duration = 0;
    combustBox.duration = 30;
  };
  bars.abilityFuncMap[kAbility.Combust2] = () => {
    combustBox.duration = 0;
    combustBox.duration = 30;
  };
  bars.abilityFuncMap[kAbility.Combust] = () => {
    combustBox.duration = 0;
    combustBox.duration = 18;
  };

  bars.abilityFuncMap[kAbility.Draw] = () => {
    drawBox.duration = 0;
    drawBox.duration = 30;
  };
  bars.abilityFuncMap[kAbility.LucidDreaming] = () => {
    lucidBox.duration = 0;
    lucidBox.duration = 60;
  };

  bars.statChangeFuncMap['AST'] = () => {
    combustBox.valuescale = bars.gcdSpell();
    combustBox.threshold = bars.gcdSpell() + 1;
    drawBox.valuescale = bars.gcdSpell();
    drawBox.threshold = bars.gcdSpell() + 1;
    lucidBox.valuescale = bars.gcdSpell();
    lucidBox.threshold = bars.gcdSpell() + 1;
  };
}
