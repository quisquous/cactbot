using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using RainbowMage.OverlayPlugin;
using Advanced_Combat_Tracker;

namespace Cactbot
{
    public class PluginLoader : IActPluginV1, IOverlayAddonV2
    {
        public void DeInitPlugin()
        {
            
        }

        public void InitPlugin(TabPage pluginScreenSpace, Label pluginStatusText)
        {
            pluginStatusText.Text = "Ready.";

            // We don't need a tab here.
            ((TabControl)pluginScreenSpace.Parent).TabPages.Remove(pluginScreenSpace);
        }

        public void Init()
        {
            Registry.RegisterEventSource<CactbotEventSource>();
        }
    }
}
