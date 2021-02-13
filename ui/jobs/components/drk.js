export function setupDrk(bars) {
  const bloodBox = bars.addResourceBox({
    classList: ['drk-color-blood'],
  });

  const darksideBox = bars.addProcBox({
    fgColor: 'drk-color-darkside',
    threshold: 10,
  });

  bars.onJobDetailUpdate((jobDetail) => {
    const blood = jobDetail.blood;
    if (bloodBox.innerText === blood)
      return;
    bloodBox.innerText = blood;
    const p = bloodBox.parentNode;
    if (blood < 50) {
      p.classList.add('low');
      p.classList.remove('mid');
    } else if (blood < 90) {
      p.classList.remove('low');
      p.classList.add('mid');
    } else {
      p.classList.remove('low');
      p.classList.remove('mid');
    }

    const oldSeconds = parseFloat(darksideBox.duration) - parseFloat(darksideBox.elapsed);
    const seconds = jobDetail.darksideMilliseconds / 1000.0;
    if (!darksideBox.duration || seconds > oldSeconds) {
      darksideBox.duration = 0;
      darksideBox.duration = seconds;
    }
  });

  const comboTimer = bars.addTimerBar({
    id: 'drk-timers-combo',
    fgColor: 'combo-color',
  });

  bars.comboFuncs.push((skill) => {
    comboTimer.duration = 0;
    if (bars.combo.isFinalSkill)
      return;
    if (skill)
      comboTimer.duration = 15;
  });
}
