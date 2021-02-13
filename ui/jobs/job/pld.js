import EffectId from '../../../resources/effect_id.js';
import { kAbility } from '../constants.js';

const setAtonement = (atonementBox, stacks) => {
  atonementBox.innerText = stacks;
  const p = atonementBox.parentNode;
  if (stacks === 0)
    p.classList.remove('any');
  else
    p.classList.add('any');
};

export function setupPld(bars) {
  const oathBox = bars.addResourceBox({
    classList: ['pld-color-oath'],
  });
  const atonementBox = bars.addResourceBox({
    classList: ['pld-color-atonement'],
  });

  bars.jobFuncs.push((jobDetail) => {
    const oath = jobDetail.oath;
    if (oathBox.innerText === oath)
      return;
    oathBox.innerText = oath;
    const p = oathBox.parentNode;
    if (oath < 50) {
      p.classList.add('low');
      p.classList.remove('mid');
    } else if (oath < 100) {
      p.classList.remove('low');
      p.classList.add('mid');
    } else {
      p.classList.remove('low');
      p.classList.remove('mid');
    }
  });

  const goreBox = bars.addProcBox({
    fgColor: 'pld-color-gore',
  });

  bars.comboFuncs.push((skill) => {
    if (skill === kAbility.GoringBlade) {
      goreBox.duration = 0;
      // Technically, goring blade is 21, but 2.43 * 9 = 21.87, so if you
      // have the box show 21, it looks like you're awfully late with
      // your goring blade and just feels really bad.  So, lie to the
      // poor paladins who don't have enough skill speed so that the UI
      // is easier to read for repeating goring, royal, royal, goring
      // and not having the box run out early.
      goreBox.duration = 22;
    }
  });

  setAtonement(atonementBox, 0);

  // As atonement counts down, the player gets successive "gains effects"
  // for the same effect, but with different counts.  When the last stack
  // falls off, then there's a "lose effect" line.
  bars.gainEffectFuncMap[EffectId.SwordOath] = (name, matches) => {
    setAtonement(atonementBox, parseInt(matches.count));
  };
  bars.loseEffectFuncMap[EffectId.SwordOath] = () => setAtonement(0);

  bars.statChangeFuncMap['PLD'] = () => {
    goreBox.valuescale = bars.gcdSkill();
    goreBox.threshold = bars.gcdSkill() * 3 + 0.3;
  };
}
