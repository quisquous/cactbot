import EmulatorCommon from '../EmulatorCommon';
import EventBus from '../EventBus';
import { PopupTextGenerator } from '../../popup-text';
import RaidEmulatorTimelineController from '../overrides/RaidEmulatorTimelineController';
import PopupTextAnalysis from '../data/PopupTextAnalysis';
import { TimelineLoader } from '../../timeline';
import Util from '../../../../resources/util';
import raidbossFileData from '../../data/raidboss_manifest.txt';
import RaidEmulatorAnalysisTimelineUI from '../overrides/RaidEmulatorAnalysisTimelineUI';

export default class AnalyzedEncounter extends EventBus {
  constructor(options, encounter, emulator) {
    super();
    this.options = options;
    this.popupText = null;
    this.perspectives = {};
    this.encounter = encounter;
    this.emulator = emulator;
  }

  selectPerspective(ID) {
    const partyMember = this.encounter.combatantTracker.combatants[ID];
    this.popupText.partyTracker.onPartyChanged({
      party: this.encounter.combatantTracker.partyMembers.map((ID) => {
        return {
          name: this.encounter.combatantTracker.combatants[ID].name,
          job: Util.jobToJobEnum(this.encounter.combatantTracker.combatants[ID].job),
          inParty: true,
        };
      }),
    });
    this.popupText.OnPlayerChange({
      detail: {
        name: partyMember.name,
        job: partyMember.job,
        currentHP: partyMember.getState(this.encounter.logLines[0].timestamp).HP,
      },
    });
    this.popupText.OnChangeZone({
      zoneName: this.encounter.encounterZoneName,
      zoneID: parseInt(this.encounter.encounterZoneId, 16),
    });
  }

  async analyze(popupText) {
    this.popupText = popupText;
    // @TODO: Make this run in parallel sometime in the future, since it could be really slow?
    for (const index in this.encounter.combatantTracker.partyMembers)
      await this.analyzeFor(this.encounter.combatantTracker.partyMembers[index]);

    this.dispatch('analyzed');
  }

  async analyzeFor(ID) {
    let currentLogIndex = 0;
    const partyMember = this.encounter.combatantTracker.combatants[ID];

    if (!partyMember.job) {
      this.perspectives[ID] = {
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
        this.popupText.options, new TimelineLoader(timelineController), raidbossFileData);
    timelineUI.popupText = popupText;

    timelineController.SetPopupTextInterface(new PopupTextGenerator(popupText));

    popupText.partyTracker.onPartyChanged({
      party: this.encounter.combatantTracker.partyMembers.map((ID) => {
        return {
          name: this.encounter.combatantTracker.combatants[ID].name,
          job: Util.jobToJobEnum(this.encounter.combatantTracker.combatants[ID].job),
          inParty: true,
        };
      }),
    });
    popupText.OnPlayerChange({
      detail: {
        name: partyMember.name,
        job: partyMember.job,
        currentHP: partyMember.getState(this.encounter.logLines[0].timestamp).HP,
      },
    });
    popupText.OnChangeZone({
      zoneName: this.encounter.encounterZoneName,
      zoneID: parseInt(this.encounter.encounterZoneId, 16),
    });

    if (timelineController.activeTimeline) {
      timelineController.activeTimeline.SetTrigger(async (trigger, matches) => {
        // Some async magic here, force waiting for the entirety of
        // the trigger execution before continuing
        const delayPromise = new Promise((res) => {
          popupText.delayResolver = res;
        });
        const promisePromise = new Promise((res) => {
          popupText.promiseResolver = res;
        });
        const runPromise = new Promise((res) => {
          popupText.runResolver = res;
        });

        const currentLine = this.encounter.logLines[currentLogIndex];

        popupText.OnTrigger(trigger, matches, currentLine.timestamp);

        await delayPromise;
        await promisePromise;
        const triggerHelper = await runPromise;

        triggerHelper.resolver.status.finalData = EmulatorCommon.cloneData(popupText.data);

        popupText.callback(
            currentLine,
            triggerHelper, triggerHelper.resolver.status);
      });
    }

    popupText.callback = (log, triggerHelper, currentTriggerStatus, finalData) => {
      this.perspectives[ID].triggers.push({
        triggerHelper: triggerHelper,
        status: currentTriggerStatus,
        logLine: log,
        resolvedOffset: (log.timestamp - this.encounter.startTimestamp) +
          (currentTriggerStatus.delay * 1000),
      });
    };
    popupText.triggerResolvers = [];

    this.perspectives[ID] = {
      initialData: EmulatorCommon.cloneData(popupText.data, []),
      triggers: [],
      finalData: popupText.data,
    };

    for (; currentLogIndex < this.encounter.logLines.length; ++currentLogIndex) {
      const log = this.encounter.logLines[currentLogIndex];
      await this.dispatch('analyzeLine', log);

      if (this.encounter.combatantTracker.combatants[ID].hasState(log.timestamp)) {
        popupText.OnPlayerChange({
          detail: {
            name: this.encounter.combatantTracker.combatants[ID].name,
            job: this.encounter.combatantTracker.combatants[ID].job,
            currentHP: this.encounter.combatantTracker.combatants[ID].getState(log.timestamp).HP,
          },
        });
      }

      const event = {
        detail: {
          logs: [log],
        },
      };

      await popupText.OnLog(event);
      await popupText.OnNetLog(event);
      timelineController.OnLogEvent(event);
    }
    timelineUI.stop();
  }
}
