using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Advanced_Combat_Tracker;
using OverlayPlugin = RainbowMage.OverlayPlugin.PluginLoader;

namespace Cactbot
{
    public class PluginLoader : IActPluginV1
    {
        public void DeInitPlugin()
        {
            
        }

        public void InitPlugin(TabPage pluginScreenSpace, Label pluginStatusText)
        {
            pluginStatusText.Text = "Looking for OverlayPlugin...";

            // We don't need a tab here.
            ((TabControl)pluginScreenSpace.Parent).TabPages.Remove(pluginScreenSpace);

            var result = ActGlobals.oFormActMain.ActPlugins.FirstOrDefault(x => {
                return (x.pluginObj != null) && x.pluginObj.GetType().IsEquivalentTo(typeof(OverlayPlugin));
            });

            if (result != null)
            {
                pluginStatusText.Text = "Registering...";

                var op = (OverlayPlugin) result.pluginObj;
                op.RegisterAddon(new OverlayAddonMain());

                pluginStatusText.Text = "Initialized.";
            } else
            {
                pluginStatusText.Text = "Couldn't find OverlayPlugin.";
            }
        }
    }
}
