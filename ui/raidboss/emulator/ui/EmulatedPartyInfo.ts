import { UnreachableCode } from '../../../../resources/not_reached';
import Util from '../../../../resources/util';
import AnalyzedEncounter, { PerspectiveTrigger } from '../data/AnalyzedEncounter';
import RaidEmulator from '../data/RaidEmulator';
import EmulatorCommon, { cloneSafe, getTemplateChild, querySelectorSafe } from '../EmulatorCommon';
import EventBus from '../EventBus';

import Tooltip from './Tooltip';

const jobOrder = [
  'PLD', 'WAR', 'DRK', 'GNB',
  'WHM', 'SCH', 'AST',
  'MNK', 'DRG', 'NIN', 'SAM',
  'BRD', 'MCH', 'DNC',
  'BLM', 'SMN', 'RDM',
  'BLU'] as const;

type JobOrderType = typeof jobOrder[number];

const isJobOrder = (job?: string): job is JobOrderType => {
  return jobOrder.includes(job as JobOrderType);
};

type PartyInfo = {
  $rootElem: HTMLElement;
  $iconElem: HTMLElement;
  $hpElem: HTMLElement;
  $hpLabelElem: HTMLElement;
  $hpProgElem: HTMLElement;
  $mpElem: HTMLElement;
  $mpLabelElem: HTMLElement;
  $mpProgElem: HTMLElement;
  $nameElem: HTMLElement;
  id: string;
  $triggerElem: HTMLElement;
};

type PartyInfoMap = {
  [id: string]: PartyInfo;
};

type CollapseParams = {
  time: string;
  name?: string;
  classes: string[];
  $obj: HTMLElement;
  icon?: string;
  text?: string;
  onclick?: CallableFunction;
};

export default class EmulatedPartyInfo extends EventBus {
  private $partyInfo: HTMLElement;
  private $triggerInfo: HTMLElement;
  private $triggerHideSkippedCheckbox: HTMLInputElement;
  private $triggerHideCollectCheckbox: HTMLInputElement;
  private $triggerBar: HTMLElement;
  private latestDisplayedState: number;
  private currentPerspective?: string;
  private updateTriggerState: () => void;
  private $triggerItemTemplate: HTMLElement;
  private $playerInfoRowTemplate: HTMLElement;
  private $playerTriggerInfoTemplate: HTMLElement;
  private $jsonViewerTemplate: HTMLElement;
  private $wrapCollapseTemplate: HTMLElement;
  private tooltips: Tooltip[] = [];
  private triggerBars: HTMLElement[] = [];
  private displayedParty: PartyInfoMap = {};

  constructor(private emulator: RaidEmulator) {
    super();
    this.$partyInfo = querySelectorSafe(document, '.partyInfoColumn .party');
    this.$triggerInfo = querySelectorSafe(document, '.triggerInfoColumn');
    const skipped = querySelectorSafe(document, '.triggerHideSkipped');
    if (!(skipped instanceof HTMLInputElement))
      throw new UnreachableCode();
    this.$triggerHideSkippedCheckbox = skipped;
    const collector = querySelectorSafe(document, '.triggerHideCollector');
    if (!(collector instanceof HTMLInputElement))
      throw new UnreachableCode();
    this.$triggerHideCollectCheckbox = collector;
    this.$triggerBar = querySelectorSafe(document, '.playerTriggers');
    this.latestDisplayedState = 0;
    for (let i = 0; i < 8; ++i)
      this.triggerBars[i] = querySelectorSafe(this.$triggerBar, '.player' + i.toString());

    emulator.on('tick', (_currentLogTime, lastLogLineTime: number) => {
      if (lastLogLineTime) {
        this.updatePartyInfo(emulator, lastLogLineTime);
        this.latestDisplayedState = Math.max(this.latestDisplayedState, lastLogLineTime);
      }
    });
    emulator.on('currentEncounterChanged', (encounter: AnalyzedEncounter) => {
      this.resetPartyInfo(encounter);
    });

    emulator.on('preSeek', () => {
      this.latestDisplayedState = 0;
    });
    emulator.on('postSeek', (time: number) => {
      this.updatePartyInfo(emulator, time);
      this.latestDisplayedState = Math.max(this.latestDisplayedState, time);
    });
    this.updateTriggerState = () => {
      if (this.$triggerHideSkippedCheckbox.checked)
        this.hideNonExecutedTriggers();
      else
        this.showNonExecutedTriggers();
      if (this.$triggerHideCollectCheckbox.checked)
        this.hideCollectorTriggers();
      else
        this.showCollectorTriggers();
    };
    this.$triggerHideSkippedCheckbox.addEventListener('change', this.updateTriggerState);
    this.$triggerHideCollectCheckbox.addEventListener('change', this.updateTriggerState);

    this.$triggerItemTemplate = getTemplateChild(document, 'template.triggerItem');
    this.$playerInfoRowTemplate = getTemplateChild(document, 'template.playerInfoRow');
    this.$playerTriggerInfoTemplate = getTemplateChild(document, 'template.playerTriggerInfo');
    this.$jsonViewerTemplate = getTemplateChild(document, 'template.jsonViewer');
    this.$wrapCollapseTemplate = getTemplateChild(document, 'template.wrapCollapse');
  }

  hideNonExecutedTriggers(): void {
    this.$triggerInfo.querySelectorAll('.trigger-not-executed').forEach((n) => {
      n.classList.add('d-none');
    });
  }

  showNonExecutedTriggers(): void {
    this.$triggerInfo.querySelectorAll('.trigger-not-executed').forEach((n) => {
      n.classList.remove('d-none');
    });
  }

  hideCollectorTriggers(): void {
    this.$triggerInfo.querySelectorAll('.trigger-no-output').forEach((n) => {
      n.classList.add('d-none');
    });
  }

  showCollectorTriggers(): void {
    this.$triggerInfo.querySelectorAll('.trigger-no-output').forEach((n) => {
      n.classList.remove('d-none');
    });
  }


  updatePartyInfo(emulator: RaidEmulator, timestamp: number): void {
    const enc = emulator.currentEncounter;
    if (!enc)
      throw new UnreachableCode();
    for (const id in this.displayedParty)
      this.updateCombatantInfo(enc, id, timestamp);
  }

  resetPartyInfo(encounter: AnalyzedEncounter): void {
    const enc = encounter.encounter;
    const tracker = enc.combatantTracker;
    if (!enc || !tracker)
      throw new UnreachableCode();
    this.tooltips.map((tt: Tooltip) => {
      tt.delete();
      return null;
    });
    this.tooltips = [];
    this.currentPerspective = undefined;
    this.displayedParty = {};
    this.latestDisplayedState = 0;
    this.$partyInfo.innerHTML = '';
    this.$triggerBar.querySelectorAll('.triggerItem').forEach((n) => {
      n.remove();
    });
    const membersToDisplay = tracker.partyMembers.sort((l, r) => {
      const a = enc.combatantTracker?.combatants[l];
      const b = enc.combatantTracker?.combatants[r];
      if (!a || !b)
        return 0;

      if (!isJobOrder(a.job) || !isJobOrder(b.job))
        return 0;
      return EmulatedPartyInfo.jobOrder.indexOf(a.job) - EmulatedPartyInfo.jobOrder.indexOf(b.job);
    }).slice(0, 8);
    document.querySelectorAll('.playerTriggerInfo').forEach((n) => {
      n.remove();
    });

    for (const [i, id] of membersToDisplay.entries()) {
      const obj = this.getPartyInfoObjectFor(encounter, id);
      const bar = this.triggerBars[i];
      const combatant = tracker.combatants[id];
      const perspective = encounter.perspectives[id];
      if (!bar || !combatant || !perspective)
        throw new UnreachableCode();
      this.displayedParty[id] = obj;
      this.$partyInfo.append(obj.$rootElem);
      this.$triggerInfo.append(obj.$triggerElem);
      bar.classList.remove('tank');
      bar.classList.remove('healer');
      bar.classList.remove('dps');
      if (combatant.job) {
        bar.classList.add(
            Util.jobToRole(combatant.job),
        );
      }

      for (const trigger of perspective.triggers) {
        if (!trigger.status.executed || trigger.resolvedOffset > encounter.encounter.duration)
          continue;

        const $e = cloneSafe(this.$triggerItemTemplate);
        $e.style.left = ((trigger.resolvedOffset / encounter.encounter.duration) * 100).toString() + '%';
        const triggerId = trigger.triggerHelper.trigger.id ?? 'Unknown Trigger';
        this.tooltips.push(new Tooltip($e, 'bottom', triggerId));
        bar.append($e);
      }
    }

    this.updateTriggerState();

    const toDisplay = membersToDisplay[0];
    if (!toDisplay)
      throw new UnreachableCode();

    this.selectPerspective(toDisplay);
  }

  selectPerspective(id: string): void {
    if (id === this.currentPerspective)
      return;

    if (!this.emulator.currentEncounter?.encounter.combatantTracker?.combatants[id]?.job)
      return;

    const display = this.displayedParty[id];

    if (!display)
      throw new UnreachableCode();

    this.currentPerspective = id;
    this.$triggerInfo.querySelectorAll('.playerTriggerInfo').forEach((r) => r.classList.add('d-none'));
    display.$triggerElem.classList.remove('d-none');
    this.$partyInfo.querySelectorAll('.playerInfoRow').forEach((r) => {
      r.classList.remove('border');
      r.classList.remove('border-success');
    });
    display.$rootElem.classList.add('border');
    display.$rootElem.classList.add('border-success');
    void this.dispatch('selectPerspective', id);
  }

  updateCombatantInfo(encounter: AnalyzedEncounter, id: string, stateID: number): void {
    if (!stateID || stateID <= this.latestDisplayedState)
      return;

    const combatant = encounter.encounter.combatantTracker?.combatants[id];
    if (!combatant)
      throw new UnreachableCode();

    const State = combatant.getState(stateID);
    if (State === undefined)
      throw new UnreachableCode();

    const display = this.displayedParty[id];

    if (!display)
      throw new UnreachableCode();

    const hpProg = (State.hp / State.maxHp) * 100;
    let hpLabel = `${State.hp}/${State.maxHp}`;
    hpLabel = EmulatorCommon.spacePadLeft(hpLabel, (State.maxHp.toString().length * 2) + 1);
    display.$hpProgElem.style.width = `${hpProg}%`;
    display.$hpLabelElem.textContent = hpLabel;

    const mpProg = (State.mp / State.maxMp) * 100;
    let mpLabel = `${State.mp}/${State.maxMp}`;
    mpLabel = EmulatorCommon.spacePadLeft(mpLabel, (State.maxMp.toString().length * 2) + 1);
    display.$mpProgElem.style.width = `${mpProg}%`;
    display.$mpLabelElem.textContent = mpLabel;
  }

  getPartyInfoObjectFor(encounter: AnalyzedEncounter, id: string): PartyInfo {
    const $e = cloneSafe(this.$playerInfoRowTemplate);
    const $hp = querySelectorSafe($e, '.hp');
    const $mp = querySelectorSafe($e, '.mp');
    const $name = querySelectorSafe($e, '.playerName');
    const ret = {
      $rootElem: $e,
      $iconElem: querySelectorSafe($e, '.jobicon'),
      $hpElem: $hp,
      $hpLabelElem: querySelectorSafe($hp, '.label'),
      $hpProgElem: querySelectorSafe($hp, '.progress-bar'),
      $mpElem: $mp,
      $mpLabelElem: querySelectorSafe($mp, '.label'),
      $mpProgElem: querySelectorSafe($mp, '.progress-bar'),
      $nameElem: $name,
      id: id,
      $triggerElem: this.getTriggerInfoObjectFor(encounter, id),
    };

    const combatant = encounter.encounter.combatantTracker?.combatants[id];
    if (!combatant)
      throw new UnreachableCode();
    ret.$rootElem.classList.add((combatant.job || '').toUpperCase());
    this.tooltips.push(new Tooltip(ret.$rootElem, 'left', combatant.name));
    $name.innerHTML = combatant.name;
    ret.$rootElem.addEventListener('click', () => {
      this.selectPerspective(id);
    });
    ret.$triggerElem.setAttribute('data-id', id);
    return ret;
  }

  getTriggerInfoObjectFor(encounter: AnalyzedEncounter, id: string): HTMLElement {
    const $ret = cloneSafe(this.$playerTriggerInfoTemplate);
    const $container = querySelectorSafe($ret, '.d-flex.flex-column');

    const per = encounter.perspectives[id];

    if (!per)
      throw new UnreachableCode();

    const $initDataViewer = cloneSafe(this.$jsonViewerTemplate);
    $initDataViewer.textContent = JSON.stringify(per.initialData, null, 2);

    $container.append(this._wrapCollapse({
      time: '00:00',
      name: 'Initial Data',
      classes: ['data'],
      $obj: $initDataViewer,
    }));

    const $triggerContainer = querySelectorSafe($container, '.d-flex.flex-column');

    for (const trigger of per.triggers.sort((l, r) => l.resolvedOffset - r.resolvedOffset)) {
      const $triggerDataViewer = cloneSafe(this.$jsonViewerTemplate);
      $triggerDataViewer.textContent = JSON.stringify(trigger, null, 2);
      const triggerText = trigger.status.responseLabel;
      const type = trigger.status.responseType;
      const $trigger = this._wrapCollapse({
        time: this.getTriggerResolvedLabelTime(trigger),
        name: trigger.triggerHelper.trigger.id,
        icon: this.getTriggerLabelIcon(trigger),
        text: triggerText,
        classes: type ? [type] : [],
        $obj: $triggerDataViewer,
      });
      if (trigger.status.executed)
        $trigger.classList.add('trigger-executed');
      else
        $trigger.classList.add('trigger-not-executed');

      if (triggerText === undefined)
        $trigger.classList.add('trigger-no-output');
      else
        $trigger.classList.add('trigger-output');

      $triggerContainer.append($trigger);
    }

    $container.append($triggerContainer);

    const $finalDataViewer = cloneSafe(this.$jsonViewerTemplate);

    $finalDataViewer.textContent = JSON.stringify(per.finalData, null, 2);

    $container.append(this._wrapCollapse({
      time: EmulatorCommon.timeToString(
          encounter.encounter.duration - encounter.encounter.initialOffset,
          false),
      name: 'Final Data',
      classes: ['data'],
      $obj: $finalDataViewer,
    }));

    return $ret;
  }

  getTriggerLabelIcon(trigger: PerspectiveTrigger): string | undefined {
    const type = trigger.status.responseType;

    switch (type) {
    case 'info':
      return 'info';
    case 'alert':
      return 'bell';
    case 'alarm':
      return 'exclamation';
    case 'tts':
      return 'bullhorn';
    case 'audiofile':
      return 'volume-up';
    }

    return undefined;
  }

  getTriggerFiredLabelTime(trigger: PerspectiveTrigger): string {
    return EmulatorCommon.timeToString(
        trigger.logLine.offset - (this.emulator.currentEncounter?.encounter.initialOffset ?? 0),
        false);
  }

  getTriggerResolvedLabelTime(trigger: PerspectiveTrigger): string {
    return EmulatorCommon.timeToString(
        trigger.resolvedOffset - (this.emulator.currentEncounter?.encounter.initialOffset ?? 0),
        false);
  }

  _wrapCollapse(params: CollapseParams): HTMLElement {
    const $ret = cloneSafe(this.$wrapCollapseTemplate);
    const $button = querySelectorSafe($ret, '.btn');
    const $time = querySelectorSafe($ret, '.trigger-label-time');
    const $name = querySelectorSafe($ret, '.trigger-label-name');
    const $icon = querySelectorSafe($ret, '.trigger-label-icon');
    const $text = querySelectorSafe($ret, '.trigger-label-text');

    if (params.name === undefined)
      $name.parentNode?.removeChild($name);
    else
      $name.textContent = params.name;

    if (params.time === undefined)
      $time.parentNode?.removeChild($time);
    else
      $time.textContent = params.time;

    if (params.text === undefined)
      $text.parentNode?.removeChild($text);
    else
      $text.textContent = params.text;

    if (params.icon === undefined)
      $icon.parentNode?.removeChild($icon);
    else
      $icon.innerHTML = `<i class="fa fa-${params.icon}" aria-hidden="true"></i>`;

    if (Array.isArray(params.classes))
      params.classes.forEach((c) => $button.classList.add('triggertype-' + c));

    const $wrapper = querySelectorSafe($ret, '.wrap-collapse-wrapper');
    $button.addEventListener('click', () => {
      if ($wrapper.classList.contains('d-none'))
        $wrapper.classList.remove('d-none');
      else
        $wrapper.classList.add('d-none');
      typeof (params.onclick) === 'function' && params.onclick();
    });
    $wrapper.append(params.$obj);
    return $ret;
  }

  static jobOrder = jobOrder;
}

