using System;
using System.Runtime.CompilerServices;
using System.Reflection;
using System.Windows.Forms;
using RainbowMage.OverlayPlugin;
using Advanced_Combat_Tracker;

namespace Cactbot
{
    public class PluginLoader : IActPluginV1
    {
        public static string pluginPath = "";

        public void DeInitPlugin()
        {
            // There's no way to un-register an event source in OverlayPlugin, yet.
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

            Assembly asm = null;
            try
            {
                asm = Assembly.Load("OverlayPlugin.Common");
            } catch (Exception ex)
            {
                MessageBox.Show(
                    $"OverlayPlugin isn't loaded. Please enable OverlayPlugin and then re-enable CactbotOverlay.dll.\n\n{ex}",
                    "Cactbot",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Error
                );
                return;
            }

            var asmVersion = asm.GetName().Version;
            if (asmVersion < Version.Parse("0.9.0"))
            {
                var additional = "Please update your OverlayPlugin";
                if (asmVersion <= Version.Parse("0.3.4.0"))
                {
                    additional = "Please switch to ngld's OverlayPlugin.";
                }

                MessageBox.Show(
                    $"The currently loaded OverlayPlugin version ({asmVersion}) is outdated. {additional}",
                    "Cactbot",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Error
                );
                return;
            }

            RegisterEventSource();
        }

        /*
         * Prevent inlining since entering this method automatically triggers an access on OverlayPlugin.
         * If it's missing, that'd throw an exception *before* the method where this code is inlined
         * actually executes.
         */
        [MethodImpl(MethodImplOptions.NoInlining)]
        private static void RegisterEventSource()
        {
            Registry.RegisterEventSource<CactbotEventSource>();
        }
    }
}
