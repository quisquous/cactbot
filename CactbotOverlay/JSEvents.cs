using System;
using System.Collections.Generic;
using System.Text;
using Tamagawa.EnmityPlugin;

namespace Cactbot {

  // This class defines all the event |details| structures that go to each event type.
  class JSEvents {

    public class LogEvent {
      public LogEvent(List<String> logs) { this.logs = logs; }

      public List<string> logs;
    }

    public class InCombatChangedEvent {
      public InCombatChangedEvent(bool inCombat) { this.inCombat = inCombat; }

      public bool inCombat;
    }

    public class ZoneChangedEvent {
      public ZoneChangedEvent(string name) { this.zoneName = name; }

      public string zoneName;
    }

    public class SelfChangedEvent {
      public SelfChangedEvent(Combatant self) { this.self = self; }

      public Combatant self;
    }
  }
}
