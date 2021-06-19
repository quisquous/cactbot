import EffectId from '../../../resources/effect_id';
import { computeBackgroundColorFrom } from '../utils';

let resetFunc = null;

export function setup(bars) {
  const straightShotProc = bars.addProcBox({
    id: 'brd-procs-straightshotready',
    fgColor: 'brd-color-straightshotready',
    threshold: 1000,
  });
  straightShotProc.bigatzero = false;
  bars.onYouGainEffect(EffectId.StraightShotReady, () => {
    straightShotProc.duration = 10;
  });
  bars.onYouLoseEffect(EffectId.StraightShotReady, () => straightShotProc.duration = 0);
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
  bars.onMobGainsEffectFromYou([
    EffectId.Stormbite,
    EffectId.Windbite,
  ], () => {
    stormBiteBox.duration = 30 - 0.5;
  });
  bars.onMobGainsEffectFromYou([
    EffectId.CausticBite,
    EffectId.VenomousBite,
  ], () => {
    causticBiteBox.duration = 30 - 0.5;
  });
  bars.onStatChange('BRD', () => {
    stormBiteBox.valuescale = bars.gcdSkill;
    stormBiteBox.threshold = bars.gcdSkill * 2;
    causticBiteBox.valuescale = bars.gcdSkill;
    causticBiteBox.threshold = bars.gcdSkill * 2;
    songBox.valuescale = bars.gcdSkill;
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

  bars.onJobDetailUpdate((jobDetail) => {
    songBox.fg = computeBackgroundColorFrom(songBox, 'brd-color-song');
    repertoireBox.parentNode.classList.remove('minuet', 'ballad', 'paeon', 'full');
    repertoireBox.innerText = '';
    if (jobDetail.songName === 'Minuet') {
      repertoireBox.innerText = jobDetail.songProcs;
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
      repertoireBox.innerText = jobDetail.songProcs;
      repertoireBox.parentNode.classList.add('paeon');
      songBox.fg = computeBackgroundColorFrom(songBox, 'brd-color-song.paeon');
      songBox.threshold = 13;
    }

    const oldSeconds = parseFloat(songBox.duration) - parseFloat(songBox.elapsed);
    const seconds = jobDetail.songMilliseconds / 1000.0;
    if (!songBox.duration || seconds > oldSeconds)
      songBox.duration = seconds;

    // Soul Voice
    if (jobDetail.soulGauge !== soulVoiceBox.innerText) {
      soulVoiceBox.innerText = jobDetail.soulGauge;
      soulVoiceBox.parentNode.classList.remove('high');
      if (jobDetail.soulGauge >= 95)
        soulVoiceBox.parentNode.classList.add('high');
    }

    // GCD calculate
    if (jobDetail.songName === 'Paeon' && bars.speedBuffs.paeonStacks !== jobDetail.songProcs)
      bars.speedBuffs.paeonStacks = jobDetail.songProcs;
  });
  let ethosStacks = 0;

  // Bard is complicated
  // Paeon -> Minuet/Ballad -> muse -> muse ends
  // Paeon -> runs out -> ethos -> within 30s -> Minuet/Ballad -> muse -> muse ends
  // Paeon -> runs out -> ethos -> ethos runs out
  // Track Paeon Stacks through to next song GCD buff
  bars.onYouGainEffect(EffectId.ArmysMuse, () => {
    // We just entered Minuet/Ballad, add muse effect
    // If we let paeon run out, get the temp stacks from ethos
    bars.speedBuffs.museStacks = ethosStacks ? ethosStacks : bars.speedBuffs.paeonStacks;
    bars.speedBuffs.paeonStacks = 0;
  });
  bars.onYouLoseEffect(EffectId.ArmysMuse, () => {
    // Muse effect ends
    bars.speedBuffs.museStacks = 0;
    bars.speedBuffs.paeonStacks = 0;
  });
  bars.onYouGainEffect(EffectId.ArmysEthos, () => {
    // Not under muse or paeon, so store the stacks
    ethosStacks = bars.speedBuffs.paeonStacks;
    bars.speedBuffs.paeonStacks = 0;
  });
  bars.onYouLoseEffect(EffectId.ArmysEthos, () => {
    // Didn't use a song and ethos ran out
    ethosStacks = 0;
    bars.speedBuffs.museStacks = 0;
    bars.speedBuffs.paeonStacks = 0;
  });

  resetFunc = (bars) => {
    straightShotProc.duration = 0;
    stormBiteBox.duration = 0;
    causticBiteBox.duration = 0;
    repertoireTimer.duration = 0;
    ethosStacks = 0;
    songBox.duration = 0;
  };
}

export function reset(bars) {
  if (resetFunc)
    resetFunc(bars);
}
