using System.Windows.Forms;
using RainbowMage.OverlayPlugin;
using Advanced_Combat_Tracker;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System;

namespace Cactbot
{
    public class PluginLoader : IActPluginV1, IOverlayAddonV2
    {
        static AssemblyResolver asmResolver;

        public void DeInitPlugin()
        {
            
        }

        public void InitPlugin(TabPage pluginScreenSpace, Label pluginStatusText)
        {
            if (asmResolver == null) {
                asmResolver = new AssemblyResolver(new List<string>{GetPluginDirectory()});
            }

            pluginStatusText.Text = "Ready.";

            // We don't need a tab here.
            ((TabControl)pluginScreenSpace.Parent).TabPages.Remove(pluginScreenSpace);
        }

        public void Init()
        {
            Registry.RegisterEventSource<CactbotEventSource>();
        }

        private string GetPluginDirectory()
        {
            var plugin = ActGlobals.oFormActMain.ActPlugins.Where(x => x.pluginObj == this).FirstOrDefault();
            if (plugin != null)
            {
                return Path.GetDirectoryName(plugin.pluginFile.FullName);
            }
            else
            {
                throw new Exception("Could not find ourselves in the plugin list!");
            }
        }
    }
}
