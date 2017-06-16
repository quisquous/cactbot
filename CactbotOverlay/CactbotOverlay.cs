using Advanced_Combat_Tracker;
using FFXIV_ACT_Plugin;
using RainbowMage.OverlayPlugin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Script.Serialization;

namespace Cactbot
{
    public class CactbotOverlay : OverlayBase<CactbotOverlayConfig>
    {
        // Not thread-safe, as OnLogLineRead may happen at any time.
        List<string> logLines = new List<string>();

        public CactbotOverlay(CactbotOverlayConfig config)
            : base(config, config.Name)
        {
            Advanced_Combat_Tracker.ActGlobals.oFormActMain.OnLogLineRead += OnLogLineRead;
        }

        public override void Dispose()
        {
            Advanced_Combat_Tracker.ActGlobals.oFormActMain.OnLogLineRead -= OnLogLineRead;
            base.Dispose();
        }

        private void OnLogLineRead(bool isImport, LogLineEventArgs args)
        {
            // isImport happens when somebody is importing old encounters and all the log lines are processed.
            // Don't need to send all of these to the overlay.
            if (isImport)
                return;
            logLines.Add(args.logLine);
        }

        private class JsonData
        {
            public List<string> logs { get; set; }
            public bool inCombat;
            public string currentZone;
        };

        public string CreateJson()
        {
            JsonData data = new JsonData()
            {
                logs = Interlocked.Exchange(ref logLines, new List<string>()),
                inCombat = FFXIV_ACT_Plugin.ACTWrapper.InCombat,
                currentZone = FFXIV_ACT_Plugin.ACTWrapper.CurrentZone,
            };

            JavaScriptSerializer serializer = new JavaScriptSerializer();
            return serializer.Serialize(data);
        }

        private string CreateEventDispatcherScript()
        {
            return "var ActXiv = " + CreateJson() + ";\n" +
               "document.dispatchEvent(new CustomEvent('onOverlayDataUpdate', { detail: ActXiv }));";
        }

        protected override void Update()
        {
            // MESSAGES
            // browser -> overlay
            // cactbot.enterZone(str)
            // cactbot.leaveZone(str)
            // cactbot.wipe
            // cactbot.tick(dataJsonMess)

            // overlay -> broadcast (uhh could just do this in c#, but loading json?)
            // cactbot.rotation.startfight
            // cactbot.rotation.endfight
            // cactbot.rotation.startphase
            // cactbot.rotation.endPhase

            // DATA JSON MESS
            // getPlayer -> combatant (posX, posY, posZ, currentHP)
            // getMobByName -> combatant
            // inCombat (is this necessary??)
            // getLogLines
            // getCurrentPartyList
            // encounterDPSInfo
            // combatantDPSInfo

            if (this.Overlay == null)
                return;
            if (this.Overlay.Renderer == null)
                return;
            if (this.Overlay.Renderer.Browser == null)
                return;

            this.Overlay.Renderer.Browser.GetMainFrame().ExecuteJavaScript(CreateEventDispatcherScript(), null, 0);
        }
    }
}
