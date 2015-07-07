using Advanced_Combat_Tracker;
using CefSharp;
using CefSharp.Wpf;
using System;
using System.IO;
using System.Windows.Forms;

namespace Cactbot
{
    public class ACTPlugin : IActPluginV1
    {
        SettingsTab settingsTab = new SettingsTab();
        BrowserWindow browserWindow;

        #region IActPluginV1 Members
        public void InitPlugin(TabPage pluginScreenSpace, Label pluginStatusText)
        {
            // This needs to happen first.
            settingsTab.Initialize(pluginStatusText);

            settingsTab.OnButtonShowDevTools += (o, e) =>
            {
                browserWindow.BrowserControl.Browser.ShowDevTools();
            };
            settingsTab.OnCheckboxIgnoresMouseChanged += (o, e) =>
            {
                browserWindow.Clickable = !((CheckBox)o).Checked;
            };
            settingsTab.OnCheckboxLayoutModeChanged += (o, e) =>
            {
                const string enableLayoutModeStr =
                    @"
                        if (window.enableLayoutMode)
                            window.enableLayoutMode();
                    ";
                const string disableLayoutModeStr =
                    @"
                        if (window.disableLayoutMode)
                            window.disableLayoutMode();
                    ";

                bool layoutModeEnabled = ((CheckBox)o).Checked;
                browserWindow.BrowserControl.Browser.ExecuteScriptAsync(
                    layoutModeEnabled ? enableLayoutModeStr : disableLayoutModeStr);
                browserWindow.Clickable = layoutModeEnabled;
            };
            settingsTab.OnButtonReload += (o, e) =>
            {
                bool ignoreCache = true;
                browserWindow.BrowserControl.Browser.Reload(ignoreCache);
            };
            settingsTab.OnToggleWindowVisibility += (o, e) =>
            {
                if (browserWindow.IsVisible)
                    browserWindow.Hide();
                else
                    browserWindow.Show();
            };

            CefSettings cefSettings = new CefSettings();
            cefSettings.CachePath = BrowserCacheDir();
            Cef.Initialize(cefSettings);

            browserWindow = new BrowserWindow();
            browserWindow.ShowInTaskbar = false;
            browserWindow.BrowserControl.CreationHandlers += OnBrowserCreated;
            browserWindow.Clickable = false;
            browserWindow.Show();

            pluginScreenSpace.Text = "Cactbot";
            pluginScreenSpace.Controls.Add(settingsTab);

            Application.ApplicationExit += OnACTShutdown;
        }

        public void DeInitPlugin()
        {
            browserWindow.Hide();
            settingsTab.Shutdown();
        }
        #endregion

        private string BrowserCacheDir()
        {
            string actDir = Advanced_Combat_Tracker.ActGlobals.oFormActMain.AppDataFolder.FullName;
            return Path.Combine(actDir, "cactbot_profile");
        }

        private void OnBrowserCreated(object sender, IWpfWebBrowser browser)
        {
            browser.RegisterJsObject("act", new BrowserBindings());
            // FIXME: Make it possible to create more than one window.
            // Tie loading html to the browser window creation and bindings to the
            // browser creation.
            browser.Load(settingsTab.HTMLFile());
        }

        private void OnACTShutdown(object sender, EventArgs args)
        {
            // Cef has to be manually shutdown on this thread, but can only be
            // shutdown once.
            Cef.Shutdown();
        }
    }
}
