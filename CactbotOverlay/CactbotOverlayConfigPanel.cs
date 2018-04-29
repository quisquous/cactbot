using RainbowMage.OverlayPlugin;
using System;
using System.Globalization;
using System.Windows.Forms;

namespace Cactbot {
  public partial class CactbotOverlayConfigPanel : UserControl {
    private CactbotOverlayConfig config;
    private CactbotOverlay overlay;

    public CactbotOverlayConfigPanel(CactbotOverlay overlay) {
      InitializeComponent();

      this.overlay = overlay;
      this.config = overlay.Config;

      SetupControlProperties();
      SetupConfigEventHandlers();
    }

    private void SetupControlProperties() {
      this.checkMiniParseVisible.Checked = config.IsVisible;
      this.checkMiniParseClickthru.Checked = config.IsClickThru;
      this.checkLock.Checked = config.IsLocked;
      this.textUrl.Text = config.Url;
      this.checkEnableGlobalHotkey.Checked = config.GlobalHotkeyEnabled;
      this.textGlobalHotkey.Enabled = this.checkEnableGlobalHotkey.Checked;
      this.textGlobalHotkey.Text = Util.GetHotkeyString(config.GlobalHotkeyModifiers, config.GlobalHotkey);
      this.dpsUpdateRate.Text = Convert.ToString(config.DpsUpdatesPerSecond, CultureInfo.InvariantCulture);
      this.logUpdateCheckBox.Checked = config.LogUpdatesEnabled;
      this.textUserConfigFile.Text = config.UserConfigFile;
    }

    private void SetupConfigEventHandlers() {
      this.config.VisibleChanged += (o, e) => {
        this.InvokeIfRequired(() => {
          this.checkMiniParseVisible.Checked = e.IsVisible;
        });
      };
      this.config.ClickThruChanged += (o, e) => {
        this.InvokeIfRequired(() => {
          this.checkMiniParseClickthru.Checked = e.IsClickThru;
        });
      };
      this.config.GlobalHotkeyEnabledChanged += (o, e) => {
        this.InvokeIfRequired(() => {
          this.checkEnableGlobalHotkey.Checked = e.NewGlobalHotkeyEnabled;
          this.textGlobalHotkey.Enabled = this.checkEnableGlobalHotkey.Checked;
        });
      };
      this.config.GlobalHotkeyChanged += (o, e) => {
        this.InvokeIfRequired(() => {
          this.textGlobalHotkey.Text = Util.GetHotkeyString(this.config.GlobalHotkeyModifiers, e.NewHotkey);
        });
      };
      this.config.GlobalHotkeyModifiersChanged += (o, e) => {
        this.InvokeIfRequired(() => {
          this.textGlobalHotkey.Text = Util.GetHotkeyString(e.NewHotkey, this.config.GlobalHotkey);
        });
      };
      this.config.LockChanged += (o, e) => {
        this.InvokeIfRequired(() => {
          this.checkLock.Checked = e.IsLocked;
        });
      };
    }

    private void InvokeIfRequired(Action action) {
      if (this.InvokeRequired) {
        this.Invoke(action);
      } else {
        action();
      }
    }

    private void checkWindowVisible_CheckedChanged(object sender, EventArgs e) {
      this.config.IsVisible = checkMiniParseVisible.Checked;
    }

    private void checkMouseClickthru_CheckedChanged(object sender, EventArgs e) {
      this.config.IsClickThru = checkMiniParseClickthru.Checked;
    }

    private void textUrl_TextChanged(object sender, EventArgs e) {
      //this.config.Url = textMiniParseUrl.Text;
    }

    private void buttonReloadBrowser_Click(object sender, EventArgs e) {
      this.overlay.Navigate(this.config.Url);
    }

    private void checkBoxEnableGlobalHotkey_CheckedChanged(object sender, EventArgs e) {
      this.config.GlobalHotkeyEnabled = this.checkEnableGlobalHotkey.Checked;
      this.textGlobalHotkey.Enabled = this.config.GlobalHotkeyEnabled;
    }

    private void textBoxGlobalHotkey_KeyDown(object sender, KeyEventArgs e) {
      e.SuppressKeyPress = true;
      var key = Util.RemoveModifiers(e.KeyCode, e.Modifiers);
      this.config.GlobalHotkey = key;
      this.config.GlobalHotkeyModifiers = e.Modifiers;
    }

    private void checkLock_CheckedChanged(object sender, EventArgs e) {
      this.config.IsLocked = this.checkLock.Checked;
    }

    private void buttonSelectFile_Click(object sender, EventArgs e) {
      var ofd = new OpenFileDialog();
      try {
        ofd.InitialDirectory = System.IO.Path.GetDirectoryName(config.Url);
      } catch (Exception) { }

      if (ofd.ShowDialog() == DialogResult.OK) {
        this.config.Url = new Uri(ofd.FileName).ToString();
        this.textUrl.Text = this.config.Url;
      }
    }

    private void textUrl_Leave(object sender, EventArgs e) {
      this.config.Url = textUrl.Text;
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

    private void tableLayoutPanel1_Paint(object sender, PaintEventArgs e) {

    }

    private void buttonShowDevtools_Click(object sender, EventArgs e) {
      this.overlay.Overlay.Renderer.showDevTools();
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
        this.overlay.LogError("User Config Directory Uri must be a valid directory.");
        this.overlay.LogError(ex.Message);
      }
    }
  }
}
