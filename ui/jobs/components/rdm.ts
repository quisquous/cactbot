import EffectId from '../../../resources/effect_id';
import { JobDetail } from '../../../types/event';
import { Bars } from '../bars';
import { kAbility } from '../constants';
import { Player } from '../player';

let resetFunc: (bars: Bars) => void;

export const setup = (bars: Bars, player: Player): void => {
  const container = bars.addJobBarContainer();

  const incs = 20;
  for (let i = 0; i < 100; i += incs) {
    const marker = document.createElement('div');
    marker.classList.add('marker');
    marker.classList.add((i % 40 === 0) ? 'odd' : 'even');
    container.appendChild(marker);
    marker.style.left = `${i}%`;
    marker.style.width = `${incs}%`;
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
  bars.onUseAbility((id) => {
    if (id === kAbility.LucidDreaming)
      lucidBox.duration = 60;
  });
  bars.onStatChange('RDM', ({ gcdSpell }) => {
    lucidBox.valuescale = gcdSpell;
    lucidBox.threshold = gcdSpell + 1;
  });

  player.onJobDetailUpdate('RDM', (jobDetail: JobDetail['RDM']) => {
    const white = jobDetail.whiteMana.toString();
    const black = jobDetail.blackMana.toString();

    whiteManaBar.value = white;
    blackManaBar.value = black;

    if (whiteManaBox.innerText !== white) {
      whiteManaBox.innerText = white;
      const p = whiteManaBox.parentNode;
      if (jobDetail.whiteMana < 80)
        p.classList.add('dim');
      else
        p.classList.remove('dim');
    }
    if (blackManaBox.innerText !== black) {
      blackManaBox.innerText = black;
      const p = blackManaBox.parentNode;
      if (jobDetail.blackMana < 80)
        p.classList.add('dim');
      else
        p.classList.remove('dim');
    }
  });

  bars.onYouGainEffect((id, matches) => {
    if (id === EffectId.VerstoneReady)
      whiteProc.duration = parseFloat(matches.duration ?? '0') - bars.gcdSpell;
    if (id === EffectId.VerfireReady) {
      blackProc.duration = 0;
      blackProc.duration = parseFloat(matches.duration ?? '0') - bars.gcdSpell;
    }
  });
  bars.onYouLoseEffect((id) => {
    if (id === EffectId.VerstoneReady)
      whiteProc.duration = 0;
    if (id === EffectId.VerfireReady)
      blackProc.duration = 0;
  });

  resetFunc = (_bars: Bars): void => {
    lucidBox.duration = 0;
    whiteProc.duration = 0;
    blackProc.duration = 0;
  };
};

export const reset = (bars: Bars): void => {
  if (resetFunc)
    resetFunc(bars);
};
