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
        // @TODO: Move this split to combatant name assignment, with server stored
        name: partyMember.name,
        job: partyMember.job,
        currentHP: partyMember.getState(this.encounter.logLines[0].timestamp).HP,
      },
    });
  }

  async Analyze(popupText) {
    this.popupText = popupText;
    // @TODO: Make this run in parallel sometime in the future, since it could be really slow?
    for (let index in this.encounter.combatantTracker.partyMembers) {
      let ID = this.encounter.combatantTracker.partyMembers[index];
      await this.AnalyzeFor(ID);
    }
    this.dispatch('analyzed');
  }

  async AnalyzeFor(ID) {
    let partyMember = this.encounter.combatantTracker.combatants[ID];

    if (!partyMember.job) {
      this.perspectives[ID] = {
        initialData: {},
        triggers: [],
      };
      return;
    }

    let popupText = new PopupTextAnalysis(this.popupText.options);
    let gTimelineUI = new RaidEmulatorTimelineUI(Options);
    let gTimelineController = new RaidEmulatorTimelineController(Options, gTimelineUI);

    // eslint-disable-next-line new-cap
    gTimelineController.SetPopupTextInterface(new RaidEmulatorPopupTextGenerator(gPopupText));
    // eslint-disable-next-line new-cap
    gTimelineController.SetDataFiles(this.emulator.dataFilesEvent);
    popupText.SetTimelineLoader(new RaidEmulatorTimelineLoader(gTimelineController));
    popupText.OnDataFilesRead(this.emulator.dataFilesEvent);
    let PartyEvent = {
      party: this.encounter.combatantTracker.partyMembers.map((ID) => {
        if (this.encounter.combatantTracker.combatants[ID].job) {
          return {
            name: this.encounter.combatantTracker.combatants[ID].name,
            job: Util.jobToJobEnum(this.encounter.combatantTracker.combatants[ID].job),
            inParty: true,
          };
        }

        return null;
      }).filter((c) => c),
    };
    popupText.partyTracker.onPartyChanged(PartyEvent);
    popupText.OnPlayerChange({
      detail: {
        name: partyMember.name,
        job: partyMember.job,
        currentHP: partyMember.getState(this.encounter.logLines[0].timestamp).HP,
      },
    });
    popupText.OnZoneChange({
      detail: {
        zoneName: this.encounter.encounterZone,
      },
    });

    popupText.callback = (log, triggerHelper, currentTriggerStatus, finalData) => {
      this.perspectives[ID].triggers.push({
        triggerHelper: triggerHelper,
        status: currentTriggerStatus,
        logLine: log,
        finalData: EmulatorCommon.cloneData(finalData),
        resolvedOffset: (log.timestamp - this.encounter.startTimestamp) +
          (currentTriggerStatus.delay * 1000),
      });
    };

    this.perspectives[ID] = {
      initialData: EmulatorCommon.cloneData(popupText.data, []),
      triggers: [],
    };

    for (let i = 0; i < this.encounter.logLines.length; i++) {
      let log = this.encounter.logLines[i];
      if (this.encounter.combatantTracker.combatants[ID].hasState(log.timestamp)) {
        popupText.OnPlayerChange({
          detail: {
            name: this.encounter.combatantTracker.combatants[ID].name,
            job: this.encounter.combatantTracker.combatants[ID].job,
            currentHP: this.encounter.combatantTracker.combatants[ID].getState(log.timestamp).HP,
          },
        });
      }

      await popupText.OnLog({
        detail: {
          logs: [log],
        },
      });
    }
  }
}

AnalyzedEncounter.lineTimestampRegex = /^\[(\d\d:\d\d:\d\d.\d\d\d)\]/i;
