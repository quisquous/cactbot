using RainbowMage.OverlayPlugin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cactbot
{
    public class CactbotOverlay : OverlayBase<CactbotOverlayConfig>
    {
        public CactbotOverlay(CactbotOverlayConfig config)
            : base(config, config.Name)
        {
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

            string data = "{}";
            string javascript = "document.dispatchEvent(new CustomEvent('cactbot.tick', {detail: " + data + "}));";
            this.Overlay.Renderer.Browser.GetMainFrame().ExecuteJavaScript(javascript, null, 0);
        }
    }
}
