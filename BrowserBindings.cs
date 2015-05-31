using Advanced_Combat_Tracker;
using FFXIV_ACT_Plugin;
using System.Collections.Generic;

namespace Cactbot
{
    public class BrowserBindings
    {
        const int MaxLogLinesRetained = 2000;
        Queue<string> logLines = new Queue<string>();
        List<Combatant> combatants = new List<Combatant>();

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

        private void UpdateCombatants()
        {
            // FIXME: Don't bother doing this on every call to GetCombatant
            // Maybe the presence of additional loglines being read could
            // be the dirty flag here.
            combatants = FFXIVPluginHelper.GetCombatantList();
        }

        public int NumCombatants()
        {
            UpdateCombatants();
            return combatants.Count;
        }

        public Combatant GetCombatant(int idx)
        {
            UpdateCombatants();
            if (idx < 0 || idx > combatants.Count)
                return null;
            return combatants[idx];
        }


        // FIXME: javascript should probably register for loglines it cares about?
        // This is a hella awkward interface.
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
