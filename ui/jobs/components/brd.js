import EffectId from '../../../resources/effect_id';
import { computeBackgroundColorFrom } from '../utils';
import { BaseComponent } from './base';

export default class BrdComponent extends BaseComponent {
  constructor(bars) {
    super(bars);

    this.straightShotProc = this.bars.addProcBox({
      id: 'brd-procs-straightshotready',
      fgColor: 'brd-color-straightshotready',
      threshold: 1000,
    });
    this.straightShotProc.bigatzero = false;

    // DoTs
    this.causticBiteBox = this.bars.addProcBox({
      id: 'brd-procs-causticbite',
      fgColor: 'brd-color-causticbite',
      notifyWhenExpired: true,
    });
    this.stormBiteBox = this.bars.addProcBox({
      id: 'brd-procs-stormbite',
      fgColor: 'brd-color-stormbite',
      notifyWhenExpired: true,
    });

    // Songs
    this.songBox = this.bars.addProcBox({
      id: 'brd-procs-song',
      fgColor: 'brd-color-song',
    });
    this.repertoireBox = this.bars.addResourceBox({
      classList: ['brd-color-song'],
    });
    this.repertoireTimer = this.bars.addTimerBar({
      id: 'brd-timers-repertoire',
      fgColor: 'brd-color-song',
    });
    this.repertoireTimer.toward = 'right';
    this.repertoireTimer.stylefill = 'fill';

    // TODO: change to component functions?
    // FIXME: didn't work until `this.trackedDoTs` assgined
    // Only with-DoT-target you last attacked will trigger bars timer.
    // So it work not well in multiple targets fight.
    this.bars.updateDotTimerFuncs.push(() => this.repertoireTimer.duration = 2.91666);
    this.soulVoiceBox = this.bars.addResourceBox({
      classList: ['brd-color-soulvoice'],
    });

    // Bard is complicated
    // Paeon -> Minuet/Ballad -> muse -> muse ends
    // Paeon -> runs out -> ethos -> within 30s -> Minuet/Ballad -> muse -> muse ends
    // Paeon -> runs out -> ethos -> ethos runs out
    // Track Paeon Stacks through to next song GCD buff
    this.ethosStacks = 0;
  }

  onGainEffect(effectId) {
    switch (effectId) {
    case EffectId.StraightShotReady:
      this.straightShotProc.duration = 10;
      break;

    case EffectId.ArmysMuse:
      // We just entered Minuet/Ballad, add muse effect
      // If we let paeon run out, get the temp stacks from ethos
      this.player.speedBuffs.museStacks = this.ethosStacks || this.player.speedBuffs.paeonStacks;
      this.player.speedBuffs.paeonStacks = 0;
      break;
    case EffectId.ArmysEthos:
    // Not under muse or paeon, so store the stacks
      this.ethosStacks = this.player.speedBuffs.paeonStacks;
      this.player.speedBuffs.paeonStacks = 0;
      break;

    default:
      break;
    }
  }

  onLoseEffect(effectId) {
    switch (effectId) {
    case EffectId.StraightShotReady:
      this.straightShotProc.duration = 0;
      break;

    case EffectId.ArmysMuse:
      // Muse effect ends
      this.player.speedBuffs.museStacks = 0;
      this.player.speedBuffs.paeonStacks = 0;
      break;
    case EffectId.ArmysEthos:
      // Didn't use a song and ethos ran out
      this.ethosStacks = 0;
      this.player.speedBuffs.museStacks = 0;
      this.player.speedBuffs.paeonStacks = 0;
      break;

    default:
      break;
    }
  }

  onMobGainsEffectFromYou(effectId) {
    switch (effectId) {
    // Iron jaws just refreshes these effects by gain once more,
    // so it doesn't need to be handled separately.
    // Log line of getting DoT comes a little late after DoT appear on target,
    // so -0.5s
    case EffectId.Stormbite:
    case EffectId.Windbite:
      this.stormBiteBox.duration = 30 - 0.5;
      break;

    case EffectId.CausticBite:
    case EffectId.VenomousBite:
      this.causticBiteBox.duration = 30 - 0.5;
      break;
    default:
      break;
    }
  }

  onJobDetailUpdate(jobDetail) {
    this.songBox.fg = computeBackgroundColorFrom(this.songBox, 'brd-color-song');
    this.repertoireBox.parentNode.classList.remove('minuet', 'ballad', 'paeon', 'full');
    this.repertoireBox.innerText = '';
    if (jobDetail.songName === 'Minuet') {
      this.repertoireBox.innerText = jobDetail.songProcs;
      this.repertoireBox.parentNode.classList.add('minuet');
      this.songBox.fg = computeBackgroundColorFrom(this.songBox, 'brd-color-song.minuet');
      this.songBox.threshold = 5;
      this.repertoireBox.parentNode.classList.remove('full');
      if (jobDetail.songProcs === 3)
        this.repertoireBox.parentNode.classList.add('full');
    } else if (jobDetail.songName === 'Ballad') {
      this.repertoireBox.innerText = '';
      this.repertoireBox.parentNode.classList.add('ballad');
      this.songBox.fg = computeBackgroundColorFrom(this.songBox, 'brd-color-song.ballad');
      this.songBox.threshold = 3;
    } else if (jobDetail.songName === 'Paeon') {
      this.repertoireBox.innerText = jobDetail.songProcs;
      this.repertoireBox.parentNode.classList.add('paeon');
      this.songBox.fg = computeBackgroundColorFrom(this.songBox, 'brd-color-song.paeon');
      this.songBox.threshold = 13;
    }

    const oldSeconds = this.songBox.value;
    const seconds = jobDetail.songMilliseconds / 1000.0;
    if (!this.songBox.duration || seconds > oldSeconds)
      this.songBox.duration = seconds;

    // Soul Voice
    if (jobDetail.soulGauge !== this.soulVoiceBox.innerText) {
      this.soulVoiceBox.innerText = jobDetail.soulGauge;
      this.soulVoiceBox.parentNode.classList.remove('high');
      if (jobDetail.soulGauge >= 95)
        this.soulVoiceBox.parentNode.classList.add('high');
    }

    // GCD calculate
    if (jobDetail.songName === 'Paeon' && this.player.speedBuffs.paeonStacks !== jobDetail.songProcs)
      this.player.speedBuffs.paeonStacks = jobDetail.songProcs;
  }

  onStatChange(stats) {
    this.stormBiteBox.valuescale = stats.gcdSkill;
    this.stormBiteBox.threshold = stats.gcdSkill * 2;
    this.causticBiteBox.valuescale = stats.gcdSkill;
    this.causticBiteBox.threshold = stats.gcdSkill * 2;
    this.songBox.valuescale = stats.gcdSkill;
  }

  reset() {
    this.straightShotProc.duration = 0;
    this.stormBiteBox.duration = 0;
    this.causticBiteBox.duration = 0;
    this.repertoireTimer.duration = 0;
    this.ethosStacks = 0;
    this.songBox.duration = 0;
  }
}
