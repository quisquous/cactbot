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
        public static string pluginPath = "";

        public void DeInitPlugin()
        {
            
        }

        public void InitPlugin(TabPage pluginScreenSpace, Label pluginStatusText)
        {
            pluginStatusText.Text = "Ready.";

            // We don't need a tab here.
            ((TabControl)pluginScreenSpace.Parent).TabPages.Remove(pluginScreenSpace);

            foreach (var plugin in ActGlobals.oFormActMain.ActPlugins)
            {
                if (plugin.pluginObj == this)
                {
                    pluginPath = plugin.pluginFile.FullName;
                    break;
                }
            }
        }

        public void Init()
        {
            Registry.RegisterEventSource<CactbotEventSource>();
        }
    }
}
