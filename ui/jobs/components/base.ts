import ResourceBar from '../../../resources/resourcebar';
import TimerBar from '../../../resources/timerbar';
import TimerBox from '../../../resources/timerbox';
import { JobDetail } from '../../../types/event';
import { NetMatches } from '../../../types/net_matches';
import { Bars } from '../jobs';
import Player from '../player';

export type Stats = NetMatches['PlayerStats'] & {
  gcdSkill: number;
  gcdSpell: number;
};

interface Component {
  bars: Bars;
  /** The player data for the current job. */
  player: Player;
  /**
   * (override) called on combo state changed
   */
  onCombo?: (skill: string) => void;

  /**
    * (override) called on player gains any effect
    */
  onGainEffect?: (effectId: string, matches: NetMatches['GainsEffect']) => void;

  /**
    * (override) called on player loses any effect
    */
  onLoseEffect?: (effectId: string, matches: NetMatches['LosesEffect']) => void;

  /**
    * (override) called on mob gains any effect from player
    */
  onMobGainEffectFromYou?: (effectId: string, matches: NetMatches['GainsEffect']) => void;

  /**
       * (override) called on mob loses any effect from player
       */
  onMobLoseEffectFromYou?: (effectId: string, matches: NetMatches['LosesEffect']) => void;

  /**
    * (override) called on JobDetails data changed
    */
  onJobDetailUpdate?: (jobDetail: JobDetail[keyof JobDetail]) => void;

  /**
    * (override) called on Stat data changed
    */
  onStatChange?: (stat: Stats) => void;

  /**
    * (override) called on player used any actions
    */
  onUseAbility?: (action: string, matches: NetMatches['Ability']) => void;

  /**
   * (override) called on zone changing
   */
  onZoneChange?: (zoneId: number, zoneName: string) => void;

  /**
    * (override) called on job changed,
    * to clear variables that the previous job component used.
    */
  reset?: () => void;
}

export class BaseComponent implements Component {
  bars: Bars;
  player: Player;

  constructor(bars: Bars) {
    this.bars = bars;
    this.player = bars.player;
  }

  addCustomBar(element: HTMLElement): HTMLElement {
    const container = this.bars.addJobBarContainer();
    container.appendChild(element);
    return container;
  }

  addProcBox(options: {
    id: string;
    fgColor?: string;
    threshold?: number;
    scale?: number;
    notifyWhenExpired?: boolean;
  }): TimerBox {
    return this.bars.addProcBox(options) as TimerBox;
  }

  addResourceBar(options: {
    id: string;
    fgColor?: string;
    maxvalue?: string;
  }): ResourceBar {
    return this.bars.addResourceBar(options) as ResourceBar;
  }

  addResourceBox(options: {
    classList?: string[];
  }): HTMLDivElement {
    return this.bars.addResourceBox(options);
  }

  addTimerBar(options: {
    id: string;
    fgColor?: string;
  }): TimerBar {
    return this.bars.addTimerBar(options);
  }
}
