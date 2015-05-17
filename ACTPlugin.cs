using Advanced_Combat_Tracker;
using System;
using System.Windows.Forms;

namespace ACTBossTime
{
    public class ACTPlugin : IActPluginV1
    {
        SettingsTab settingsTab = new SettingsTab();
        RotationViewer rotationViewer = new RotationViewer();

        #region IActPluginV1 Members
        public void InitPlugin(TabPage pluginScreenSpace, Label pluginStatusText)
        {
            rotationViewer.SetContent("Stuff");
            rotationViewer.Show();
            settingsTab.Initialize(pluginStatusText);
            pluginScreenSpace.Controls.Add(settingsTab);

            ActGlobals.oFormActMain.OnLogLineRead += this.OnLogLineRead;
        }

        public void DeInitPlugin()
        {
            rotationViewer.Hide();
            settingsTab.Shutdown();

            ActGlobals.oFormActMain.OnLogLineRead -= this.OnLogLineRead;
        }
        #endregion

        private void OnLogLineRead(bool isImport, LogLineEventArgs logInfo)
        {
            rotationViewer.SetContent(logInfo.logLine);
        }
    }
}
