using System;
using System.Text.RegularExpressions;

namespace Cactbot {
  class WipeDetector {
    Regex wipe_regex_;

    public WipeDetector(CactbotEventSource client) {
      this.client_ = client;
      client_.OnLogsChanged += OnLogsChanged;
      // See: https://gist.github.com/quisquous/250001cbce232a48e6a9ce772a56675a
      var pattern = @" 21:........:40000010:";
      wipe_regex_ = new Regex(pattern);
    }

    private CactbotEventSource client_;

    private void WipeIt() {
      client_.Wipe();
    }

    public void OnLogsChanged(JSEvents.LogEvent e) {
      foreach (var log in e.logs) {
        if (log.IndexOf(" 00:0038:cactbot wipe", StringComparison.Ordinal) != -1) {
          WipeIt();
        }
        if (wipe_regex_.IsMatch(log)) {
          WipeIt();
        }
      }
    }
  }
}