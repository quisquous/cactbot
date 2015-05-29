using Advanced_Combat_Tracker;
using FFXIV_ACT_Plugin;
using System.Collections.Generic;

namespace ACTBossTime
{
    public class BrowserBindings
    {
        const int MaxLogLinesRetained = 2000;
        Queue<string> logLines = new Queue<string>();

        public BrowserBindings()
        {
            Advanced_Combat_Tracker.ActGlobals.oFormActMain.OnLogLineRead += OnLogLineRead;
        }

        ~BrowserBindings()
        {
            Advanced_Combat_Tracker.ActGlobals.oFormActMain.OnLogLineRead -= OnLogLineRead;
        }

        public string CurrentZone()
        {
            return FFXIV_ACT_Plugin.ACTWrapper.CurrentZone;
        }

        public bool InCombat()
        {
            return FFXIV_ACT_Plugin.ACTWrapper.InCombat;
        }

        public void TextToSpeech(string speechText)
        {
            // FIXME: This appears to be synchronous.  Maybe kick the task to a thread?
            Advanced_Combat_Tracker.ActGlobals.oFormActMain.TTS(speechText);
        }

        public bool HasLogLines()
        {
            return logLines.Count > 0;
        }

        public string NextLogLine()
        {
            return logLines.Dequeue();
        }

        private void OnLogLineRead(bool isImport, LogLineEventArgs args)
        {
            if (isImport)
                return;
            logLines.Enqueue(args.logLine);

            // FIXME: expose this error to the browser.
            if (logLines.Count > MaxLogLinesRetained)
                logLines.Dequeue();
        }
    }
}
