import EffectId from '../../../resources/effect_id';
import { kAbility } from '../constants';

let resetFunc = null;

export function setup(bars) {
  const container = bars.addJobBarContainer();

  const incs = 20;
  for (let i = 0; i < 100; i += incs) {
    const marker = document.createElement('div');
    marker.classList.add('marker');
    marker.classList.add((i % 40 === 0) ? 'odd' : 'even');
    container.appendChild(marker);
    marker.style.left = i + '%';
    marker.style.width = incs + '%';
  }

  const whiteManaBar = bars.addResourceBar({
    id: 'rdm-white-bar',
    fgColor: 'rdm-color-white-mana',
    maxvalue: 100,
  });

  const blackManaBar = bars.addResourceBar({
    id: 'rdm-black-bar',
    fgColor: 'rdm-color-black-mana',
    maxvalue: 100,
  });

  const whiteManaBox = bars.addResourceBox({
    classList: ['rdm-color-white-mana'],
  });

  const blackManaBox = bars.addResourceBox({
    classList: ['rdm-color-black-mana'],
  });

  const whiteProc = bars.addProcBox({
    id: 'rdm-procs-white',
    fgColor: 'rdm-color-white-mana',
    threshold: 1000,
  });
  whiteProc.bigatzero = false;
  const blackProc = bars.addProcBox({
    id: 'rdm-procs-black',
    fgColor: 'rdm-color-black-mana',
    threshold: 1000,
  });
  blackProc.bigatzero = false;

  const lucidBox = bars.addProcBox({
    id: 'rdm-procs-lucid',
    fgColor: 'rdm-color-lucid',
  });
  bars.onUseAbility(kAbility.LucidDreaming, () => {
    lucidBox.duration = 0;
    lucidBox.duration = 60;
  });
  bars.onStatChange('RDM', () => {
    lucidBox.valuescale = bars.gcdSpell;
    lucidBox.threshold = bars.gcdSpell + 1;
  });

  bars.onJobDetailUpdate((jobDetail) => {
    const white = jobDetail.whiteMana;
    const black = jobDetail.blackMana;

    whiteManaBar.value = white;
    blackManaBar.value = black;

    if (whiteManaBox.innerText !== white) {
      whiteManaBox.innerText = white;
      const p = whiteManaBox.parentNode;
      if (white < 80)
        p.classList.add('dim');
      else
        p.classList.remove('dim');
    }
    if (blackManaBox.innerText !== black) {
      blackManaBox.innerText = black;
      const p = blackManaBox.parentNode;
      if (black < 80)
        p.classList.add('dim');
      else
        p.classList.remove('dim');
    }
  });

  bars.onYouGainEffect(EffectId.VerstoneReady, (name, matches) => {
    whiteProc.duration = 0;
    whiteProc.duration = parseFloat(matches.duration) - bars.gcdSpell;
  });
  bars.onYouLoseEffect(EffectId.VerstoneReady, () => whiteProc.duration = 0);
  bars.onYouGainEffect(EffectId.VerfireReady, (name, matches) => {
    blackProc.duration = 0;
    blackProc.duration = parseFloat(matches.duration) - bars.gcdSpell;
  });
  bars.onYouLoseEffect(EffectId.VerfireReady, () => blackProc.duration = 0);

  resetFunc = (bars) => {
    lucidBox.duration = 0;
    whiteProc.duration = 0;
    blackProc.duration = 0;
  };
}

export function reset(bars) {
  if (resetFunc)
    resetFunc(bars);
}
