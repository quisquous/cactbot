import EffectId from '../../../resources/effect_id';
import { JobDetail } from '../../../types/event';
import { Bars } from '../bars';
import { computeBackgroundColorFrom } from '../utils';

let resetFunc: (bars: Bars) => void;

export const setup = (bars: Bars): void => {
  const straightShotProc = bars.addProcBox({
    id: 'brd-procs-straightshotready',
    fgColor: 'brd-color-straightshotready',
    threshold: 1000,
  });
  straightShotProc.bigatzero = false;

  // DoT
  const causticBiteBox = bars.addProcBox({
    id: 'brd-procs-causticbite',
    fgColor: 'brd-color-causticbite',
    notifyWhenExpired: true,
  });
  const stormBiteBox = bars.addProcBox({
    id: 'brd-procs-stormbite',
    fgColor: 'brd-color-stormbite',
    notifyWhenExpired: true,
  });
  // Iron jaws just refreshes these effects by gain once more,
  // so it doesn't need to be handled separately.
  // Log line of getting DoT comes a little late after DoT appear on target,
  // so -0.5s
  bars.onMobGainsEffectFromYou((id) => {
    switch (id) {
      case EffectId.Stormbite:
      case EffectId.Windbite:
        stormBiteBox.duration = 30 - 0.5;
        break;

      case EffectId.CausticBite:
      case EffectId.VenomousBite:
        causticBiteBox.duration = 30 - 0.5;
        break;
    }
  });
  bars.onStatChange('BRD', ({ gcdSkill }) => {
    stormBiteBox.valuescale = gcdSkill;
    stormBiteBox.threshold = gcdSkill * 2;
    causticBiteBox.valuescale = gcdSkill;
    causticBiteBox.threshold = gcdSkill * 2;
    songBox.valuescale = gcdSkill;
  });

  // Song
  const songBox = bars.addProcBox({
    id: 'brd-procs-song',
    fgColor: 'brd-color-song',
  });
  const repertoireBox = bars.addResourceBox({
    classList: ['brd-color-song'],
  });
  const repertoireTimer = bars.addTimerBar({
    id: 'brd-timers-repertoire',
    fgColor: 'brd-color-song',
  });
  repertoireTimer.toward = 'right';
  repertoireTimer.stylefill = 'fill';
  // Only with-DoT-target you last attacked will trigger bars timer.
  // So it work not well in multiple targets fight.
  bars.updateDotTimerFuncs.push(() => repertoireTimer.duration = 2.91666);
  const soulVoiceBox = bars.addResourceBox({
    classList: ['brd-color-soulvoice'],
  });

  bars.onJobDetailUpdate('BRD', (jobDetail: JobDetail['BRD']) => {
    songBox.fg = computeBackgroundColorFrom(songBox, 'brd-color-song');
    repertoireBox.parentNode.classList.remove('minuet', 'ballad', 'paeon', 'full');
    repertoireBox.innerText = '';
    if (jobDetail.songName === 'Minuet') {
      repertoireBox.innerText = jobDetail.songProcs.toString();
      repertoireBox.parentNode.classList.add('minuet');
      songBox.fg = computeBackgroundColorFrom(songBox, 'brd-color-song.minuet');
      songBox.threshold = 5;
      repertoireBox.parentNode.classList.remove('full');
      if (jobDetail.songProcs === 3)
        repertoireBox.parentNode.classList.add('full');
    } else if (jobDetail.songName === 'Ballad') {
      repertoireBox.innerText = '';
      repertoireBox.parentNode.classList.add('ballad');
      songBox.fg = computeBackgroundColorFrom(songBox, 'brd-color-song.ballad');
      songBox.threshold = 3;
    } else if (jobDetail.songName === 'Paeon') {
      repertoireBox.innerText = jobDetail.songProcs.toString();
      repertoireBox.parentNode.classList.add('paeon');
      songBox.fg = computeBackgroundColorFrom(songBox, 'brd-color-song.paeon');
      songBox.threshold = 13;
    }

    if (typeof songBox.duration === 'number') {
      const oldSeconds = songBox.duration - songBox.elapsed;
      const seconds = jobDetail.songMilliseconds / 1000.0;
      if (!songBox.duration || seconds > oldSeconds)
        songBox.duration = seconds;
    }

    // Soul Voice
    const soulGauge = jobDetail.soulGauge.toString();
    if (soulGauge !== soulVoiceBox.innerText) {
      soulVoiceBox.innerText = soulGauge;
      soulVoiceBox.parentNode.classList.remove('high');
      if (jobDetail.soulGauge >= 95)
        soulVoiceBox.parentNode.classList.add('high');
    }

    // GCD calculate
    if (jobDetail.songName === 'Paeon' && bars.speedBuffs.paeonStacks !== jobDetail.songProcs)
      bars.speedBuffs.paeonStacks = jobDetail.songProcs;
  });
  let ethosStacks = 0;

  bars.onYouGainEffect((id) => {
    switch (id) {
      case EffectId.StraightShotReady:
        straightShotProc.duration = 10;
        break;
      // Bard is complicated
      // Paeon -> Minuet/Ballad -> muse -> muse ends
      // Paeon -> runs out -> ethos -> within 30s -> Minuet/Ballad -> muse -> muse ends
      // Paeon -> runs out -> ethos -> ethos runs out
      // Track Paeon Stacks through to next song GCD buff
      case EffectId.ArmysMuse:
        // We just entered Minuet/Ballad, add muse effect
        // If we let paeon run out, get the temp stacks from ethos
        bars.speedBuffs.museStacks = ethosStacks ? ethosStacks : bars.speedBuffs.paeonStacks;
        bars.speedBuffs.paeonStacks = 0;
        break;
      case EffectId.ArmysEthos:
        // Not under muse or paeon, so store the stacks
        ethosStacks = bars.speedBuffs.paeonStacks;
        bars.speedBuffs.paeonStacks = 0;
        break;
    }
  });
  bars.onYouLoseEffect((id) => {
    switch (id) {
      case EffectId.StraightShotReady:
        straightShotProc.duration = 0;
        break;
      case EffectId.ArmysMuse:
        // Muse effect ends
        bars.speedBuffs.museStacks = 0;
        bars.speedBuffs.paeonStacks = 0;
        break;
      case EffectId.ArmysEthos:
        // Didn't use a song and ethos ran out
        ethosStacks = 0;
        bars.speedBuffs.museStacks = 0;
        bars.speedBuffs.paeonStacks = 0;
        break;
    }
  });

  resetFunc = (_bars: Bars): void => {
    straightShotProc.duration = 0;
    stormBiteBox.duration = 0;
    causticBiteBox.duration = 0;
    repertoireTimer.duration = 0;
    ethosStacks = 0;
    songBox.duration = 0;
  };
};

export const reset = (bars: Bars): void => {
  if (resetFunc)
    resetFunc(bars);
};
