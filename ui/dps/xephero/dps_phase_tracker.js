import { LocaleRegex } from '../../../resources/translations';

const kTestPhaseStart = 'cactbot phase start';
const kTestPhaseEnd = 'cactbot phase end';

export default class DpsPhaseTracker {
  constructor(options) {
    // Ordered list of phases.  Each phase is:
    // {
    //   name: display name string
    //   start: {
    //     Encounter: {...}, // initial encounter info
    //     Combatant: {...}, // initial combatant info
    //   },
    //   diff : {
    //     Encounter: {...}, // diff with latest encounter info
    //     Combatant: {...}, // diff with latest combatant info
    //   },
    //   complete: bool
    //   element: optional externally set html element associated with this phase
    // }
    //
    this.phases = [];
    this.title = null;
    this.lastData = null;
    this.zone = null;
    this.inCombat = false;

    this.defaultPhase = null;
    this.defaultPhaseIdx = 0;

    this.lang = options.ParserLanguage;

    this.areaSealRegex = LocaleRegex.areaSeal[this.lang] || LocaleRegex.areaSeal['en'];
    this.areaUnsealRegex = LocaleRegex.areaUnseal[this.lang] || LocaleRegex.areaUnseal['en'];
    this.countdownStartRegex = LocaleRegex.countdownStart[this.lang] ||
      LocaleRegex.countdownStart['en'];
  }

  onLogEvent(logs) {
    if (!this.defaultPhase) {
      for (const log of logs) {
        if (this.areaSealRegex.test(log) || log.includes(kTestPhaseStart)) {
          this.defaultPhaseIdx++;
          this.defaultPhase = 'B' + this.defaultPhaseIdx;
          this.onFightPhaseStart(this.defaultPhase, this.lastData);
          return;
        }
      }
    } else {
      for (const log of logs) {
        if (this.areaUnsealRegex.test(log) || log.includes(kTestPhaseEnd)) {
          this.onFightPhaseEnd(this.defaultPhase, this.lastData);
          this.defaultPhase = 0;
          return;
        }
      }
    }
  }

  onChangeZone(zone) {
    this.clearPhases();
    this.zone = zone;
    this.title = null;
  }

  onOverlayDataUpdate(dps) {
    this.lastData = dps;

    // Update each open phase with new diffs.
    for (let i = 0; i < this.phases.length; ++i) {
      const phase = this.phases[i];
      if (phase.complete)
        continue;

      const diff = this.diffUpdateInfo(phase.start, dps);
      if (!diff)
        continue;

      phase.diff = diff;
    }
  }

  onFightStart(boss) {
    this.clearPhases();
    this.title = boss.id;
  }

  onFightEnd() {
  }

  inCombatChanged(inCombat) {
    if (this.inCombat === inCombat)
      return;
    this.inCombat = inCombat;
    if (inCombat)
      this.clearPhases();
    else if (!inCombat)
      this.onFightEnd();
  }

  onFightPhaseStart(name, dps) {
    this.onOverlayDataUpdate(dps);

    // Make sure there's no phase name collision.
    for (let i = 0; i < this.phases.length; ++i) {
      if (this.phases[i].name === name && !this.phases[i].complete) {
        console.error('Duplicate phase: ' + name);
        return;
      }
    }

    this.phases.push({
      'name': name,
      'start': dps,
      'diff': null,
      'element': null,
      'complete': false,
    });
  }

  onFightPhaseEnd(name, dps) {
    this.onOverlayDataUpdate(dps);
    for (let i = 0; i < this.phases.length; ++i) {
      if (this.phases[i].name === name && !this.phases[i].complete) {
        this.phases[i].complete = true;
        return;
      }
    }
    console.error('Can\'t find phase: ' + name);
  }

  clearPhases() {
    this.defaultPhase = null;
    this.defaultPhaseIdx = 0;
    for (let i = 0; i < this.phases.length; ++i) {
      const element = this.phases[i].element;
      if (element)
        element.remove();
    }
    this.phases = [];
  }

  // Takes two {Encounter: {}, Combatant: {}} objects and returns the
  // difference between the two as an {Encounter: {}, Combatant: {}} object.
  // It drops some of the fields to make the diff.
  //
  // phaseStart is optional, if it doesn't exist, it assumes default values
  // from the start of the fight.
  //
  // This may return null (used as a hint not to bother displaying the diff).
  diffUpdateInfo(phaseStart, phaseEnd) {
    if (!phaseEnd) {
      console.error(['diffError: no phase end', phase]);
      return;
    }

    // Sometimes a phase will get entered during a slow wipe when nobody
    // attacks, causing a total duration of zero.  Just ignore these.
    // This happens where ACT stops providing new updates but log entries
    // or other triggers indicate that phases have started.
    if (phaseStart) {
      if (phaseStart.Encounter.DURATION === phaseEnd.Encounter.DURATION)
        return;
    }

    const diffProps = function(start, end, props, out) {
      for (let i = 0; i < props.length; ++i) {
        const prop = props[i];
        out[prop] = end[prop] - start[prop];
      }
    };
    const copyProps = function(start, props, out) {
      for (let i = 0; i < props.length; ++i)
        out[props[i]] = start[props[i]];
    };
    const setDPS = function(duration, encDuration, out) {
      out.dps = (out.damage / duration).toFixed(2);
      out.encdps = (out.damage / encDuration).toFixed(2);

      out.DPS = Math.floor(out.dps);
      out.ENCDPS = Math.floor(out.encdps);
    };

    const encounterDiffProps = [
      'DURATION',
      'damage',
      'hits',
      'misses',
      'crithits',
      'swings',
      'healed',
      'critheals',
      'cures',
      'damagetaken',
      'healstaken',
      'deaths',
    ];
    const combatantCopyProps = [
      'name',
      'Job',
    ];
    const combatantDiffProps = [
      'DURATION',
      'damage',
      'hits',
      'crithits',
      'misses',
      'swings',
      'healed',
      'critheals',
      'heals',
      'cures',
      'damagetaken',
      'healstaken',
      'kills',
      'deaths',
    ];

    const encounter = {};
    if (phaseStart) {
      diffProps(phaseStart.Encounter, phaseEnd.Encounter, encounterDiffProps, encounter);
      setDPS(encounter.DURATION, encounter.DURATION, encounter);
    } else {
      copyProps(phaseEnd.Encounter, encounterDiffProps, encounter);
      setDPS(encounter.DURATION, encounter.DURATION, encounter);
    }

    // Deliberately use end, as combatants aren't initially listed before
    // they've done any damage right when the fight starts.
    const combatant = {};
    for (const name in phaseEnd.Combatant) {
      const start = phaseStart ? phaseStart.Combatant[name] : null;
      const end = phaseEnd.Combatant[name];
      if (!end)
        continue;

      const c = {};
      copyProps(end, combatantCopyProps, c);
      if (start) {
        diffProps(start, end, combatantDiffProps, c);
      } else {
        // If combatant doesn't exist, assume they start at zero.
        copyProps(end, combatantDiffProps, c);
      }
      setDPS(c.DURATION, encounter.DURATION, c);
      combatant[name] = c;
    }

    return {
      Encounter: encounter,
      Combatant: combatant,
    };
  }
}
