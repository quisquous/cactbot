'use strict';

class AnalyzedEncounter extends EventBus {
  constructor(encounter, emulator) {
    super();
    this.popupText = null;
    this.perspectives = {};
    this.encounter = encounter;
    this.emulator = emulator;
  }

  selectPerspective(ID) {
    let partyMember = this.encounter.combatantTracker.combatants[ID];
    this.popupText.OnPlayerChange({
      detail: {
        name: partyMember.name,
        job: partyMember.job,
        currentHP: partyMember.getState(this.encounter.logLines[0].timestamp).HP,
      },
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
    const partyMember = this.encounter.combatantTracker.combatants[ID];

    if (!partyMember.job) {
      this.perspectives[ID] = {
        initialData: {},
        triggers: [],
      };
      return;
    }

    const popupText = new PopupTextAnalysis(this.popupText.options);
    const gTimelineUI = new RaidEmulatorTimelineUI(Options);
    const gTimelineController = new RaidEmulatorTimelineController(Options, gTimelineUI);

    gTimelineController.SetPopupTextInterface(new PopupTextGenerator(gPopupText));
    gTimelineController.SetDataFiles(this.emulator.dataFilesEvent.detail.files);
    popupText.SetTimelineLoader(new TimelineLoader(gTimelineController));
    popupText.OnDataFilesRead(this.emulator.dataFilesEvent);
    popupText.ReloadTimelines();
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

    popupText.callback = (log, triggerHelper, currentTriggerStatus, finalData) => {
      this.perspectives[ID].triggers.push({
        triggerHelper: triggerHelper,
        status: currentTriggerStatus,
        logLine: log,
        resolvedOffset: (log.timestamp - this.encounter.startTimestamp) +
          (currentTriggerStatus.delay * 1000),
      });
    };

    this.perspectives[ID] = {
      initialData: EmulatorCommon.cloneData(popupText.data, []),
      triggers: [],
      finalData: popupText.data,
    };

    for (const log of this.encounter.logLines) {
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
    }
  }
}
