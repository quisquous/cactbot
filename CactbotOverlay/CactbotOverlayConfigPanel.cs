using RainbowMage.OverlayPlugin;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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
      this.config.UrlChanged += (o, e) => {
        this.InvokeIfRequired(() => {
          this.textUrl.Text = e.NewUrl;
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

      if (ofd.ShowDialog() == DialogResult.OK) {
        this.config.Url = new Uri(ofd.FileName).ToString();
      }
    }

    private void textUrl_Leave(object sender, EventArgs e) {
      this.config.Url = textUrl.Text;
    }
  }
}
