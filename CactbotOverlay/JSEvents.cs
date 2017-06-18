using System;
using System.Collections.Generic;
using System.Text;

namespace Cactbot {

  // This class defines all the event |details| structures that go to each event type.
  class JSEvents {

    // onLogEvent
    public class LogEvent {
      public LogEvent(List<String> logs) { this.logs = logs; }

      public List<string> logs;
    }

    // onCombatStartedEvent
    public class CombatStartedEvent {
      // TODO: Any interesting info to pass here? Can we tell the encounter already?
      // TODO: Maybe that should be a separate EncounterStarted event as this will fire in open world too?
    }

    // onCombatEndedEvent
    public class CombatEndedEvent {
      public CombatEndedEvent(bool wipe) { this.wipe = wipe; }

      public bool wipe;
    }

    public class ZoneChangedEvent {
      public ZoneChangedEvent(string name) { this.zoneName = name; }

      public string zoneName;
    }
  }
}
