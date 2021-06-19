import EmulatorCommon, { DataType } from '../EmulatorCommon';
import EventBus from '../EventBus';
import { PopupTextGenerator, TriggerHelper } from '../../popup-text';
import RaidEmulatorTimelineController from '../overrides/RaidEmulatorTimelineController';
import PopupTextAnalysis, { ResolverStatus, Resolver } from './PopupTextAnalysis';
import Util from '../../../../resources/util';
import raidbossFileData from '../../data/raidboss_manifest.txt';
import RaidEmulatorAnalysisTimelineUI from '../overrides/RaidEmulatorAnalysisTimelineUI';
import { RaidbossOptions } from '../../raidboss_options';
import Encounter from './Encounter';
import RaidEmulator from './RaidEmulator';
import LineEvent from './network_log_converter/LineEvent';
import { UnreachableCode } from '../../../../resources/not_reached';
import { LooseTrigger } from '../../../../types/trigger';
import Combatant from './Combatant';
import { TimelineLoader } from '../../timeline';

type PerspectiveTrigger = {
  triggerHelper: TriggerHelper;
  status: ResolverStatus;
  logLine: LineEvent;
  resolvedOffset: number;
};
type Perspective = {
  initialData: DataType;
  triggers: PerspectiveTrigger[];
  finalData?: DataType;
};
type Perspectives = { [id: string]: Perspective };

export default class AnalyzedEncounter extends EventBus {
  perspectives: Perspectives = {};
  constructor(
    public options: RaidbossOptions,
    public encounter: Encounter,
    public emulator: RaidEmulator) {
    super();
  }

  selectPerspective(id: string, popupText: PopupTextAnalysis): void {
    if (this.encounter && this.encounter.combatantTracker) {
      const selectedPartyMember = this.encounter.combatantTracker.combatants[id];
      if (!selectedPartyMember)
        return;

      popupText?.getPartyTracker().onPartyChanged({
        party: this.encounter.combatantTracker.partyMembers.map((id) => {
          const partyMember = this.encounter?.combatantTracker?.combatants[id];
          if (!partyMember)
            throw new UnreachableCode();
          return {
            id: id,
            worldId: 0,
            name: partyMember.name,
            job: Util.jobToJobEnum(partyMember.job ?? 'NONE'),
            inParty: true,
          };
        }),
      });
      this.updateState(selectedPartyMember, this.encounter.startTimestamp, popupText);
      popupText?.OnChangeZone({
        type: 'ChangeZone',
        zoneName: this.encounter.encounterZoneName,
        zoneID: parseInt(this.encounter.encounterZoneId, 16),
      });
    }
  }

  updateState(combatant: Combatant, timestamp: number, popupText: PopupTextAnalysis): void {
    const job = combatant.job;
    if (!job)
      throw new UnreachableCode();
    const state = combatant.getState(timestamp);
    popupText?.OnPlayerChange({
      detail: {
        name: combatant.name,
        job: job,
        level: combatant.level ?? 0,
        currentHP: state.hp,
        maxHP: state.maxHp,
        currentMP: state.mp,
        maxMP: state.maxMp,
        currentCP: 0,
        maxCP: 0,
        currentGP: 0,
        maxGP: 0,
        currentShield: 0,
        jobDetail: null,
        pos: {
          x: state.posX,
          y: state.posY,
          z: state.posZ,
        },
        rotation: state.heading,
        bait: 0,
        debugJob: '',
      },
    });
  }

  async analyze(): Promise<void> {
    // @TODO: Make this run in parallel sometime in the future, since it could be really slow?
    if (this.encounter.combatantTracker) {
      for (const id of this.encounter.combatantTracker.partyMembers)
        await this.analyzeFor(id);
    }

    return this.dispatch('analyzed');
  }

  async analyzeFor(id: string): Promise<void> {
    if (!this.encounter.combatantTracker)
      return;
    let currentLogIndex = 0;
    const partyMember = this.encounter.combatantTracker.combatants[id];

    if (!partyMember)
      return;

    if (!partyMember.job) {
      this.perspectives[id] = {
        initialData: {},
        triggers: [],
      };
      return;
    }

    const timelineUI = new RaidEmulatorAnalysisTimelineUI(this.options);
    const timelineController =
        new RaidEmulatorTimelineController(this.options, timelineUI, raidbossFileData);
    timelineController.bindTo(this.emulator);

    const popupText = new PopupTextAnalysis(
        this.options, new TimelineLoader(timelineController), raidbossFileData);

    const generator = new PopupTextGenerator(popupText);
    timelineUI.SetPopupTextInterface(generator);

    timelineController.SetPopupTextInterface(generator);

    this.selectPerspective(id, popupText);

    if (timelineController.activeTimeline) {
      timelineController.activeTimeline.SetTrigger((trigger: LooseTrigger, matches) => {
        const currentLine = this.encounter.logLines[currentLogIndex];
        const resolver = popupText.currentResolver = new Resolver({
          initialData: EmulatorCommon.cloneData(popupText.getData()),
          suppressed: false,
          executed: false,
        });
        popupText.triggerResolvers.push(resolver);

        if (!currentLine)
          throw new UnreachableCode();

        popupText.OnTrigger(trigger, matches, currentLine.timestamp);

        resolver.setFinal(() => {
          resolver.status.finalData = EmulatorCommon.cloneData(popupText.getData());
          delete resolver.triggerHelper?.resolver;
          if (popupText.callback) {
            popupText.callback(currentLine, resolver.triggerHelper,
                resolver.status, popupText.getData());
          }
        });
      });
    }

    popupText.callback = (log, triggerHelper, currentTriggerStatus) => {
      const perspective = this.perspectives[id];
      if (!perspective || !triggerHelper)
        throw new UnreachableCode();

      const delay = currentTriggerStatus.delay ?? 0;

      perspective.triggers.push({
        triggerHelper: triggerHelper,
        status: currentTriggerStatus,
        logLine: log,
        resolvedOffset: (log.timestamp - this.encounter.startTimestamp) +
          (delay * 1000),
      });
    };
    popupText.triggerResolvers = [];

    this.perspectives[id] = {
      initialData: EmulatorCommon.cloneData(popupText.getData(), []),
      triggers: [],
      finalData: popupText.getData(),
    };

    for (; currentLogIndex < this.encounter.logLines.length; ++currentLogIndex) {
      const log = this.encounter.logLines[currentLogIndex];
      if (!log)
        throw new UnreachableCode();
      await this.dispatch('analyzeLine', log);

      const combatant = this.encounter?.combatantTracker?.combatants[id];

      if (combatant && combatant.hasState(log.timestamp))
        this.updateState(combatant, log.timestamp, popupText);

      await popupText.onEmulatorLog([log]);
      timelineController.onEmulatorLogEvent([log]);
    }
    timelineUI.stop();
  }
}
