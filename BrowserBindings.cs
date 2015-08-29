using Advanced_Combat_Tracker;
using FFXIV_ACT_Plugin;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading;
using System.Web.Script.Serialization;

namespace Cactbot
{
    public class BrowserBindings
    {
        // Not thread-safe, as OnLogLineRead may happen at any time.
        List<string> logLines = new List<string>();

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

        public void UpdateCombatants()
        {
            // FIXME: Don't bother doing this on every call to GetCombatant
            // Maybe the presence of additional loglines being read could
            // be the dirty flag here.
            combatants = FFXIVPluginHelper.GetCombatantList();
        }

        public int NumCombatants()
        {
            if (combatants == null)
                return 0;
            return combatants.Count;
        }

        public Combatant GetCombatant(int idx)
        {
            if (combatants == null)
                return null;
            if (idx < 0 || idx >= combatants.Count)
                return null;
            return combatants[idx];
        }

        private static bool CombatantIsMob(Combatant c)
        {
            // Not a pet, not a player.
            return c.OwnerID == 0 && c.Job == 0;
        }

        private static bool CombatantIsPlayer(Combatant c)
        {
            return c.Job != 0;
        }

        public Combatant GetMobByName(string name, int minHP)
        {
            if (combatants == null)
                return null;

            Combatant found = null;
            foreach (Combatant c in combatants) {
                if (!CombatantIsMob(c))
                    continue;
                if (c.Name != name)
                    continue;
                // Most raids have multiple bosses with the same name,
                // i.e. the 20 Bahamut Primes in turn 13.  HP seems like
                // the only way to differentiate.
                if (c.MaxHP < minHP)
                    continue;
                // Multiple mobs with the same name.
                if (found != null)
                    return null;
                found = c;
            }
            return found;
        }

        public Combatant GetPlayerByName(string name)
        {
            // FIXME: maybe should have a hash here to make this not O(n^2).
            if (combatants == null)
                return null;

            Combatant found = null;
            foreach (Combatant c in combatants)
            {
                if (!CombatantIsPlayer(c))
                    continue;
                if (c.Name != name)
                    continue;
                // Multiple players with the same name
                // could happen in a dungeon T_T.
                if (found != null)
                    return null;
                found = c;
            }
            return found;
        }

        public uint[] GetCurrentPartyList()
        {
            List<uint> partyList = FFXIVPluginHelper.GetCurrentPartyList();
            if (partyList == null) {
                return null;
            }
            return partyList.ToArray();
        }

        // FIXME: Add GetMobIdsByName.

        // Provided as a helper function as GetCombatant(0) is a total hack and
        // maybe something more reliable can be found.
        public Combatant GetPlayer()
        {
            return GetCombatant(0);
        }

        public string[] GetLogLines()
        {
            List<string> ret = Interlocked.Exchange(ref logLines, new List<string>());
            return ret.ToArray();
        }

        private void OnLogLineRead(bool isImport, LogLineEventArgs args)
        {
            if (isImport)
                return;
            Debug.Assert(args.logLine != null);
            // FIXME: Remove this check once the source of the null log lines is found.
            if (args.logLine != null)
            {
                logLines.Add(args.logLine);
            }
        }

        // Dictionary, as JSON string.
        public string EncounterDPSInfo()
        {
            if (ActGlobals.oFormActMain.ActiveZone.ActiveEncounter == null)
                return null;

            var dict = new Dictionary<string, string>();

            List<CombatantData> allies = ActGlobals.oFormActMain.ActiveZone.ActiveEncounter.GetAllies();
            foreach (var export in EncounterData.ExportVariables)
            {
                try
                {
                    string value = export.Value.GetExportString(ActGlobals.oFormActMain.ActiveZone.ActiveEncounter, allies, "");
                    dict[export.Key] = value;
                }
                catch (KeyNotFoundException)
                {
                    // This appears to sometimes happen with 10ENCDPS and friends.
                }
                catch (InvalidOperationException)
                {
                    // "Collection was modified; enumeration operation may not execute"
                }
            }

            JavaScriptSerializer serializer = new JavaScriptSerializer();
            return serializer.Serialize(dict);
        }

        // List of dictionaries, as JSON string.
        public string CombatantDPSInfo()
        {
            if (ActGlobals.oFormActMain.ActiveZone.ActiveEncounter == null)
                return null;

            var combatantList = new List<Dictionary<string, string>>();

            List<CombatantData> allies = ActGlobals.oFormActMain.ActiveZone.ActiveEncounter.GetAllies();
            foreach (CombatantData ally in allies)
            {
                var dict = new Dictionary<string, string>();
                foreach (var export in CombatantData.ExportVariables)
                {
                    // This causes a FormatException.
                    if (export.Key == "NAME")
                        continue;

                    try
                    {
                        string value = export.Value.GetExportString(ally, "");
                        dict[export.Key] = value;
                    }
                    catch (KeyNotFoundException)
                    {
                        // This appears to sometimes happen with 10ENCDPS and friends.
                    }
                    catch (InvalidOperationException)
                    {
                        // "Collection was modified; enumeration operation may not execute"
                    }
                }

                if (!dict.ContainsKey("name"))
                    continue;
                combatantList.Add(dict);
            }

            JavaScriptSerializer serializer = new JavaScriptSerializer();
            return serializer.Serialize(combatantList);
        }
    }
}
