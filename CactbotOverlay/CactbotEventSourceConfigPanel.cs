using System;
using System.Globalization;
using System.Windows.Forms;

namespace Cactbot {
  public partial class CactbotEventSourceConfigPanel : UserControl {
    private CactbotEventSourceConfig config;
    private CactbotEventSource source;

    public CactbotEventSourceConfigPanel(CactbotEventSource source) {
      InitializeComponent();

      this.source = source;
      this.config = source.Config;

      SetupControlProperties();
      SetupConfigEventHandlers();
    }

    private void SetupControlProperties() {
      this.dpsUpdateRate.Text = Convert.ToString(config.DpsUpdatesPerSecond, CultureInfo.InvariantCulture);
      this.logUpdateCheckBox.Checked = config.LogUpdatesEnabled;
      this.textUserConfigFile.Text = config.UserConfigFile;
      this.checkWatchFileChanges.Checked = config.WatchFileChanges;
    }

    private void SetupConfigEventHandlers() {
      
    }

    private void InvokeIfRequired(Action action) {
      if (this.InvokeRequired) {
        this.Invoke(action);
      } else {
        action();
      }
    }

    private void dpsUpdateRate_Validating(object sender, System.ComponentModel.CancelEventArgs e) {
      try {
        Convert.ToDouble(dpsUpdateRate.Text, CultureInfo.InvariantCulture);
      } catch {
        e.Cancel = true;
        dpsUpdateRate.Select(0, dpsUpdateRate.Text.Length);
      }
    }

    private void dpsUpdateRate_Validated(object sender, EventArgs e) {
      this.config.DpsUpdatesPerSecond = Convert.ToDouble(dpsUpdateRate.Text, CultureInfo.InvariantCulture);
    }

    private void logUpdateCheckBox_CheckedChanged(object sender, EventArgs e) {
      this.config.LogUpdatesEnabled = logUpdateCheckBox.Checked;
    }

    private void buttonSelectUserConfigFile_Click(object sender, EventArgs e) {
      var ofd = new FolderBrowserDialog();
      try {
        ofd.SelectedPath = System.IO.Path.GetDirectoryName(new Uri(config.UserConfigFile).AbsolutePath);
      } catch (Exception) { }

      if (ofd.ShowDialog() == DialogResult.OK) {
        this.config.UserConfigFile = new Uri(ofd.SelectedPath).AbsoluteUri;
        this.textUserConfigFile.Text = this.config.UserConfigFile;
      }
    }

    private void textUserConfigFile_Leave(object sender, EventArgs e) {
      try {
        if (!String.IsNullOrWhiteSpace(textUserConfigFile.Text)) {
          var path = new Uri(textUserConfigFile.Text);
          if (!System.IO.Directory.Exists(path.AbsolutePath))
            path = new Uri(path, ".");
          this.config.UserConfigFile = path.AbsoluteUri;
        } else {
          this.config.UserConfigFile = "";
        }
        this.textUserConfigFile.Text = this.config.UserConfigFile;
      } catch (Exception ex) {
        this.source.LogError("User Config Directory Uri must be a valid directory.");
        this.source.LogError(ex.Message);
      }
    }

    private void checkWatchFileChanges_CheckedChanged(object sender, EventArgs e)
    {
      this.config.WatchFileChanges = this.checkWatchFileChanges.Checked;
    }
  }
}
