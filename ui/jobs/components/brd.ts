import EffectId from '../../../resources/effect_id';
import TimerBar from '../../../resources/timerbar';
import TimerBox from '../../../resources/timerbox';
import { JobDetail } from '../../../types/event';
import { ResourceBox } from '../bars';
import { kAbility, kDoTTickInterval } from '../constants';
import { DotTracker } from '../event_emitter';
import { computeBackgroundColorFrom } from '../utils';

import { BaseComponent, ComponentInterface } from './base';

export class BRD5xComponent extends BaseComponent {
  straightShotProc: TimerBox;
  causticBiteBox: TimerBox;
  stormBiteBox: TimerBox;
  songBox: TimerBox;
  repertoireBox: ResourceBox;
  repertoireTimer: TimerBar;
  repertoireTracker5x: DotTracker;
  soulVoiceBox: ResourceBox;

  ethosStacks = 0;

  constructor(o: ComponentInterface) {
    super(o);

    // DoT
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

    // Song
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

    this.repertoireTracker5x = new DotTracker({ emitter: this.emitter, player: this.player });

    // Only with-DoT-target you last attacked will trigger bars timer.
    // So it work not well in multiple targets fight.
    this.repertoireTracker5x.onTick([
      EffectId.Stormbite,
      EffectId.Windbite,
      EffectId.CausticBite,
      EffectId.VenomousBite,
    ], () => {
      this.repertoireTimer.duration = kDoTTickInterval;
    });

    this.soulVoiceBox = this.bars.addResourceBox({
      classList: ['brd-color-soulvoice'],
    });

    this.straightShotProc = this.bars.addProcBox({
      id: 'brd-procs-straightshotready',
      fgColor: 'brd-color-straightshotready',
      threshold: 1000,
    });
    this.straightShotProc.bigatzero = false;

    this.reset();
  }

  override onMobGainsEffectFromYou(id: string): void {
    // Iron jaws just refreshes these effects by gain once more,
    // so it doesn't need to be handled separately.
    // Log line of getting DoT comes a little late after DoT appear on target,
    // so -0.5s
    switch (id) {
      case EffectId.Stormbite:
      case EffectId.Windbite:
        this.stormBiteBox.duration = 30 - 0.5;
        break;

      case EffectId.CausticBite:
      case EffectId.VenomousBite:
        this.causticBiteBox.duration = 30 - 0.5;
        break;
    }
  }

  override onJobDetailUpdate(jobDetail: JobDetail['BRD']): void {
    this.songBox.fg = computeBackgroundColorFrom(this.songBox, 'brd-color-song');
    this.repertoireBox.parentNode.classList.remove('minuet', 'ballad', 'paeon', 'full');
    this.repertoireBox.innerText = '';
    if (jobDetail.songName === 'Minuet') {
      this.repertoireBox.innerText = jobDetail.songProcs.toString();
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
      this.repertoireBox.innerText = jobDetail.songProcs.toString();
      this.repertoireBox.parentNode.classList.add('paeon');
      this.songBox.fg = computeBackgroundColorFrom(this.songBox, 'brd-color-song.paeon');
      this.songBox.threshold = 13;
    }

    if (this.songBox.duration === null)
      this.songBox.duration = 0;
    const oldSeconds = this.songBox.duration - this.songBox.elapsed;
    const seconds = jobDetail.songMilliseconds / 1000.0;
    if (!this.songBox.duration || seconds > oldSeconds)
      this.songBox.duration = seconds;

    // Soul Voice
    const soulGauge = jobDetail.soulGauge.toString();
    if (soulGauge !== this.soulVoiceBox.innerText) {
      this.soulVoiceBox.innerText = soulGauge;
      this.soulVoiceBox.parentNode.classList.remove('high');
      if (jobDetail.soulGauge >= 95)
        this.soulVoiceBox.parentNode.classList.add('high');
    }

    // GCD calculate
    if (jobDetail.songName === 'Paeon' && this.player.speedBuffs.paeonStacks !== jobDetail.songProcs)
      this.player.speedBuffs.paeonStacks = jobDetail.songProcs;
  }

  override onStatChange({ gcdSkill }: { gcdSkill: number }): void {
    this.stormBiteBox.valuescale = gcdSkill;
    this.stormBiteBox.threshold = gcdSkill * 2;
    this.causticBiteBox.valuescale = gcdSkill;
    this.causticBiteBox.threshold = gcdSkill * 2;
    this.songBox.valuescale = gcdSkill;
  }

  override onYouGainEffect(id: string): void {
    switch (id) {
      case EffectId.StraightShotReady:
        this.straightShotProc.duration = 10;
        break;
      // Bard is complicated
      // Paeon -> Minuet/Ballad -> muse -> muse ends
      // Paeon -> runs out -> ethos -> within 30s -> Minuet/Ballad -> muse -> muse ends
      // Paeon -> runs out -> ethos -> ethos runs out
      // Track Paeon Stacks through to next song GCD buff
      case EffectId.ArmysMuse:
        // We just entered Minuet/Ballad, add muse effect
        // If we let paeon run out, get the temp stacks from ethos
        this.player.speedBuffs.museStacks = this.ethosStacks ?? this.player.speedBuffs.paeonStacks;
        this.player.speedBuffs.paeonStacks = 0;
        break;
      case EffectId.ArmysEthos:
        // Not under muse or paeon, so store the stacks
        this.ethosStacks = this.player.speedBuffs.paeonStacks;
        this.player.speedBuffs.paeonStacks = 0;
        break;
    }
  }
  override onYouLoseEffect(id: string): void {
    switch (id) {
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
    }
  }

  override reset(): void {
    this.straightShotProc.duration = 0;
    this.stormBiteBox.duration = 0;
    this.causticBiteBox.duration = 0;
    this.repertoireTimer.duration = 0;
    this.ethosStacks = 0;
    this.songBox.duration = 0;
  }
}

export class BRDComponent extends BaseComponent {
  straightShotProc: TimerBox;
  biteBox: TimerBox;
  empyrealBox: TimerBox;
  songBox: TimerBox;
  repertoireBox: ResourceBox;
  repertoireTimer: TimerBar;
  soulVoiceBox: ResourceBox;
  wanderersCoda: HTMLDivElement;
  magesCoda: HTMLDivElement;
  armysCoda: HTMLDivElement;

  ethosStacks = 0;

  constructor(o: ComponentInterface) {
    super(o);

    // DoT
    this.biteBox = this.bars.addProcBox({
      id: 'brd-procs-bite',
      fgColor: 'brd-color-bite',
      notifyWhenExpired: true,
    });

    // Song
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
    this.repertoireTimer.loop = true;

    // Coda
    const stacksContainer = document.createElement('div');
    stacksContainer.id = 'brd-stacks';
    stacksContainer.classList.add('stacks');
    const codaContainer = document.createElement('div');
    codaContainer.id = 'brd-stacks-coda';
    stacksContainer.appendChild(codaContainer);
    this.bars.addJobBarContainer().appendChild(stacksContainer);

    this.magesCoda = document.createElement('div');
    this.armysCoda = document.createElement('div');
    this.wanderersCoda = document.createElement('div');

    this.magesCoda.id = 'brd-stacks-magescoda';
    this.armysCoda.id = 'brd-stacks-armyscoda';
    this.wanderersCoda.id = 'brd-stacks-wandererscoda';
    [
      this.magesCoda,
      this.armysCoda,
      this.wanderersCoda
    ].forEach((e) => codaContainer.appendChild(e));

    this.soulVoiceBox = this.bars.addResourceBox({
      classList: ['brd-color-soulvoice'],
    });

    this.empyrealBox = this.bars.addProcBox({
      id: 'brd-procs-empyreal',
      fgColor: 'brd-color-empyreal',
    });

    this.straightShotProc = this.bars.addProcBox({
      id: 'brd-procs-straightshotready',
      fgColor: 'brd-color-straightshotready',
      threshold: 1000,
    });
    this.straightShotProc.bigatzero = false;

    this.reset();
  }

  override onUseAbility(id: string): void {
    switch (id) {
      case kAbility.MagesBallad:
      case kAbility.ArmysPaeon:
      case kAbility.theWanderersMinuet:
        // Repertoire always tick every 3s after song start
        // 45s and 0s not included
        this.repertoireTimer.duration = 3;
        break;
      case kAbility.EmpyrealArrow:
        this.empyrealBox.duration = 15;
        break;
    }
  }

  override onMobGainsEffectFromYou(id: string): void {
    // Log line of getting DoT comes a little late after DoT appear on target,
    // so -0.5s
    switch (id) {
      case EffectId.Stormbite:
      case EffectId.Windbite:
      case EffectId.CausticBite:
      case EffectId.VenomousBite:
        this.biteBox.duration = 45 - 0.5;
        break;
    }
  }

  override onJobDetailUpdate(jobDetail: JobDetail['BRD']): void {
    // song
    this.songBox.fg = computeBackgroundColorFrom(this.songBox, 'brd-color-song');
    this.repertoireBox.parentNode.classList.remove('minuet', 'ballad', 'paeon', 'full');
    this.repertoireBox.innerText = '';
    if (jobDetail.songName === 'Minuet') {
      this.repertoireBox.innerText = jobDetail.songProcs.toString();
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
      this.songBox.threshold = 14;
    } else if (jobDetail.songName === 'Paeon') {
      this.repertoireBox.innerText = jobDetail.songProcs.toString();
      this.repertoireBox.parentNode.classList.add('paeon');
      this.songBox.fg = computeBackgroundColorFrom(this.songBox, 'brd-color-song.paeon');
      this.songBox.threshold = 3;
    }

    if (this.songBox.duration === null)
      this.songBox.duration = 0;
    const oldSeconds = this.songBox.duration - this.songBox.elapsed;
    const seconds = jobDetail.songMilliseconds / 1000.0;
    if (!this.songBox.duration || seconds > oldSeconds)
      this.songBox.duration = seconds;
    if (seconds < 3 && this.repertoireTimer.value !== 0)
      this.repertoireTimer.duration = 0;

    // coda
    this.magesCoda.classList.toggle('active', jobDetail.coda.includes('Ballad'));
    this.armysCoda.classList.toggle('active', jobDetail.coda.includes('Paeon'));
    this.wanderersCoda.classList.toggle('active', jobDetail.coda.includes('Minuet'));

    // Soul Voice
    const soulGauge = jobDetail.soulGauge.toString();
    if (soulGauge !== this.soulVoiceBox.innerText) {
      this.soulVoiceBox.innerText = soulGauge;
      this.soulVoiceBox.parentNode.classList.remove('high');
      if (jobDetail.soulGauge >= 80)
        this.soulVoiceBox.parentNode.classList.add('high');
    }

    // GCD calculate
    if (jobDetail.songName === 'Paeon' && this.player.speedBuffs.paeonStacks !== jobDetail.songProcs)
      this.player.speedBuffs.paeonStacks = jobDetail.songProcs;
  }

  override onStatChange({ gcdSkill }: { gcdSkill: number }): void {
    this.biteBox.valuescale = gcdSkill;
    this.biteBox.threshold = gcdSkill * 2;
    this.songBox.valuescale = gcdSkill;
    this.empyrealBox.valuescale = gcdSkill;
    this.empyrealBox.threshold = gcdSkill;
  }

  override onYouGainEffect(id: string): void {
    switch (id) {
      case EffectId.StraightShotReady:
        this.straightShotProc.duration = 30;
        break;
      // Bard is complicated
      // Paeon -> Minuet/Ballad -> muse -> muse ends
      // Paeon -> runs out -> ethos -> within 30s -> Minuet/Ballad -> muse -> muse ends
      // Paeon -> runs out -> ethos -> ethos runs out
      // Track Paeon Stacks through to next song GCD buff
      case EffectId.ArmysMuse:
        // We just entered Minuet/Ballad, add muse effect
        // If we let paeon run out, get the temp stacks from ethos
        this.player.speedBuffs.museStacks = this.ethosStacks ?? this.player.speedBuffs.paeonStacks;
        this.player.speedBuffs.paeonStacks = 0;
        break;
      case EffectId.ArmysEthos:
        // Not under muse or paeon, so store the stacks
        this.ethosStacks = this.player.speedBuffs.paeonStacks;
        this.player.speedBuffs.paeonStacks = 0;
        break;
    }
  }
  override onYouLoseEffect(id: string): void {
    switch (id) {
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
    }
  }

  override reset(): void {
    this.straightShotProc.duration = 0;
    this.biteBox.duration = 0;
    this.repertoireTimer.duration = 0;
    this.ethosStacks = 0;
    this.songBox.duration = 0;
  }
}
