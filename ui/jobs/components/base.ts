import PartyTracker from '../../../resources/party';
import { JobDetail } from '../../../types/event';
import { Bars } from '../bars';
import ComboTracker from '../combo_tracker';
import { JobsEventEmitter, PartialFieldMatches } from '../event_emitter';
import { JobsOptions } from '../jobs_options';
import { Player } from '../player';

export type ShouldShows = {
  buffList?: boolean;
  pullBar?: boolean;
  hpBar?: boolean;
  mpBar?: boolean;
  cpBar?: boolean;
  gpBar?: boolean;
  mpTicker?: boolean;
};

export interface ComponentInterface {
  bars: Bars;
  emitter: JobsEventEmitter;
  options: JobsOptions;
  partyTracker: PartyTracker;
  player: Player;
}

export class BaseComponent implements ComponentInterface {
  bars: Bars;
  emitter: JobsEventEmitter;
  options: JobsOptions;
  partyTracker: PartyTracker;
  player: Player;

  inCombat: boolean;

  constructor(o: ComponentInterface) {
    this.bars = o.bars;
    this.emitter = o.emitter;
    this.options = o.options;
    this.partyTracker = o.partyTracker;
    this.player = o.player;

    this.inCombat = false;

    this._bindListeners();
  }

  private _bindListeners(): void {
    this.emitter.on('battle/in-combat', ({ game }) => {
      this.inCombat = game;
    });
    this.player.onYouGainEffect(this.onYouGainEffect.bind(this));
    this.player.onYouLoseEffect(this.onYouLoseEffect.bind(this));
    this.player.onMobGainsEffectFromYou(this.onMobGainsEffectFromYou.bind(this));
    this.player.onMobLosesEffectFromYou(this.onMobLosesEffectFromYou.bind(this));
    this.player.onUseAbility(this.onUseAbility.bind(this));
    this.player.onStatChange(this.player.job, this.onStatChange.bind(this));
    if (this.player.job !== 'NONE') {
      const job = this.player.job as keyof JobDetail;
      this.player.onJobDetailUpdate(job, this.onJobDetailUpdate.bind(this));
    }
    this.player.onCombo(this.onCombo.bind(this));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onCombo(id: string | undefined, combo: ComboTracker): void {
    /** noop */
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onYouGainEffect(id: string, effect: PartialFieldMatches<'GainsEffect'>): void {
    /** noop */
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onYouLoseEffect(id: string, effect: PartialFieldMatches<'LosesEffect'>): void {
    /** noop */
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onMobGainsEffectFromYou(id: string, effect: PartialFieldMatches<'GainsEffect'>): void {
    /** noop */
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onMobLosesEffectFromYou(id: string, effect: PartialFieldMatches<'LosesEffect'>): void {
    /** noop */
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onUseAbility(id: string, ability: PartialFieldMatches<'Ability'>): void {
    /** noop */
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onStatChange(gcd: { gcdSkill: number; gcdSpell: number }): void {
    /** noop */
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onJobDetailUpdate(jobDetail: JobDetail[keyof JobDetail]): void {
    /** noop */
  }

  reset(): void {
    /** noop */
  }
}
