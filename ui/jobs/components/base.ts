import PartyTracker from '../../../resources/party';
import { JobDetail } from '../../../types/event';
import { Bars } from '../bars';
import ComboTracker from '../combo_tracker';
import { JobsEventEmitter, PartialFieldMatches } from '../event_emitter';
import { JobsOptions } from '../jobs_options';
import { Player } from '../player';

export type ShouldShow = {
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
  is5x: boolean;
}

export class BaseComponent implements ComponentInterface {
  bars: Bars;
  emitter: JobsEventEmitter;
  options: JobsOptions;
  partyTracker: PartyTracker;
  player: Player;
  is5x: boolean;

  inCombat: boolean;
  comboDuration: number;

  constructor(o: ComponentInterface) {
    this.bars = o.bars;
    this.emitter = o.emitter;
    this.options = o.options;
    this.partyTracker = o.partyTracker;
    this.player = o.player;
    this.is5x = o.is5x;
    this.comboDuration = o.is5x ? 15 : 30;

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

  onCombo(_id: string | undefined, _combo: ComboTracker): void {
    /** noop */
  }

  onYouGainEffect(_id: string, _effect: PartialFieldMatches<'GainsEffect'>): void {
    /** noop */
  }

  onYouLoseEffect(_id: string, _effect: PartialFieldMatches<'LosesEffect'>): void {
    /** noop */
  }

  onMobGainsEffectFromYou(_id: string, _effect: PartialFieldMatches<'GainsEffect'>): void {
    /** noop */
  }

  onMobLosesEffectFromYou(_id: string, _effect: PartialFieldMatches<'LosesEffect'>): void {
    /** noop */
  }

  onUseAbility(_id: string, _ability: PartialFieldMatches<'Ability'>): void {
    /** noop */
  }

  onStatChange(_gcd: { gcdSkill: number; gcdSpell: number }): void {
    /** noop */
  }

  onJobDetailUpdate(_jobDetail: JobDetail[keyof JobDetail]): void {
    /** noop */
  }

  reset(): void {
    /** noop */
  }
}
