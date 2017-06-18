using System;
using System.Collections.Generic;
using System.Text;

namespace Cactbot {
  // This class defines all the event |details| structures that go to each event type.
  class JSEvents {

    // onOverlayDataUpdate event.
    public class EventDetails {
      public bool inCombat;
      public string currentZone;
    }

    // onLogEvent
    public class LogEvent {
      public LogEvent(List<String> logs) { this.logs = logs; }

      public List<string> logs;
    }
  }
}
