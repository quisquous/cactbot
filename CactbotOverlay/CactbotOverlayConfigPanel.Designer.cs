namespace Cactbot
{
    partial class CactbotOverlayConfigPanel
    {
        private System.ComponentModel.IContainer components = null;

        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region

        private void InitializeComponent()
        {
      System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(CactbotOverlayConfigPanel));
      this.tableLayoutPanel1 = new System.Windows.Forms.TableLayoutPanel();
      this.label2 = new System.Windows.Forms.Label();
      this.label3 = new System.Windows.Forms.Label();
      this.checkMiniParseVisible = new System.Windows.Forms.CheckBox();
      this.checkMiniParseClickthru = new System.Windows.Forms.CheckBox();
      this.label7 = new System.Windows.Forms.Label();
      this.checkEnableGlobalHotkey = new System.Windows.Forms.CheckBox();
      this.textGlobalHotkey = new System.Windows.Forms.TextBox();
      this.label9 = new System.Windows.Forms.Label();
      this.checkLock = new System.Windows.Forms.CheckBox();
      this.tableLayoutPanel3 = new System.Windows.Forms.TableLayoutPanel();
      this.buttonShowDevtools = new System.Windows.Forms.Button();
      this.buttonReloadBrowser = new System.Windows.Forms.Button();
      this.label4 = new System.Windows.Forms.Label();
      this.tableLayoutPanel2 = new System.Windows.Forms.TableLayoutPanel();
      this.textUrl = new System.Windows.Forms.TextBox();
      this.buttonSelectFile = new System.Windows.Forms.Button();
      this.label8 = new System.Windows.Forms.Label();
      this.dpsUpdateRateLabel = new System.Windows.Forms.Label();
      this.dpsUpdateRate = new System.Windows.Forms.TextBox();
      this.logUpdateLabel = new System.Windows.Forms.Label();
      this.logUpdateCheckBox = new System.Windows.Forms.CheckBox();
      this.restartMessageLabel = new System.Windows.Forms.Label();
      this.label1 = new System.Windows.Forms.Label();
      this.tableLayoutPanel4 = new System.Windows.Forms.TableLayoutPanel();
      this.buttonSelectUserConfigFile = new System.Windows.Forms.Button();
      this.textUserConfigFile = new System.Windows.Forms.TextBox();
      this.tableLayoutPanel1.SuspendLayout();
      this.tableLayoutPanel3.SuspendLayout();
      this.tableLayoutPanel2.SuspendLayout();
      this.tableLayoutPanel4.SuspendLayout();
      this.SuspendLayout();
      // 
      // tableLayoutPanel1
      // 
      resources.ApplyResources(this.tableLayoutPanel1, "tableLayoutPanel1");
      this.tableLayoutPanel1.Controls.Add(this.label2, 0, 1);
      this.tableLayoutPanel1.Controls.Add(this.label3, 0, 0);
      this.tableLayoutPanel1.Controls.Add(this.checkMiniParseVisible, 1, 0);
      this.tableLayoutPanel1.Controls.Add(this.checkMiniParseClickthru, 1, 1);
      this.tableLayoutPanel1.Controls.Add(this.label7, 0, 6);
      this.tableLayoutPanel1.Controls.Add(this.checkEnableGlobalHotkey, 1, 6);
      this.tableLayoutPanel1.Controls.Add(this.textGlobalHotkey, 1, 7);
      this.tableLayoutPanel1.Controls.Add(this.label9, 0, 2);
      this.tableLayoutPanel1.Controls.Add(this.checkLock, 1, 2);
      this.tableLayoutPanel1.Controls.Add(this.tableLayoutPanel3, 1, 13);
      this.tableLayoutPanel1.Controls.Add(this.label4, 0, 3);
      this.tableLayoutPanel1.Controls.Add(this.tableLayoutPanel2, 1, 3);
      this.tableLayoutPanel1.Controls.Add(this.label8, 0, 7);
      this.tableLayoutPanel1.Controls.Add(this.dpsUpdateRateLabel, 0, 8);
      this.tableLayoutPanel1.Controls.Add(this.dpsUpdateRate, 1, 8);
      this.tableLayoutPanel1.Controls.Add(this.logUpdateLabel, 0, 9);
      this.tableLayoutPanel1.Controls.Add(this.logUpdateCheckBox, 1, 9);
      this.tableLayoutPanel1.Controls.Add(this.restartMessageLabel, 1, 10);
      this.tableLayoutPanel1.Controls.Add(this.label1, 0, 12);
      this.tableLayoutPanel1.Controls.Add(this.tableLayoutPanel4, 1, 12);
      this.tableLayoutPanel1.Name = "tableLayoutPanel1";
      this.tableLayoutPanel1.Paint += new System.Windows.Forms.PaintEventHandler(this.tableLayoutPanel1_Paint);
      // 
      // label2
      // 
      resources.ApplyResources(this.label2, "label2");
      this.label2.Name = "label2";
      // 
      // label3
      // 
      resources.ApplyResources(this.label3, "label3");
      this.label3.Name = "label3";
      // 
      // checkMiniParseVisible
      // 
      resources.ApplyResources(this.checkMiniParseVisible, "checkMiniParseVisible");
      this.checkMiniParseVisible.Name = "checkMiniParseVisible";
      this.checkMiniParseVisible.UseVisualStyleBackColor = true;
      this.checkMiniParseVisible.CheckedChanged += new System.EventHandler(this.checkWindowVisible_CheckedChanged);
      // 
      // checkMiniParseClickthru
      // 
      resources.ApplyResources(this.checkMiniParseClickthru, "checkMiniParseClickthru");
      this.checkMiniParseClickthru.Name = "checkMiniParseClickthru";
      this.checkMiniParseClickthru.UseVisualStyleBackColor = true;
      this.checkMiniParseClickthru.CheckedChanged += new System.EventHandler(this.checkMouseClickthru_CheckedChanged);
      // 
      // label7
      // 
      resources.ApplyResources(this.label7, "label7");
      this.label7.Name = "label7";
      // 
      // checkEnableGlobalHotkey
      // 
      resources.ApplyResources(this.checkEnableGlobalHotkey, "checkEnableGlobalHotkey");
      this.checkEnableGlobalHotkey.Name = "checkEnableGlobalHotkey";
      this.checkEnableGlobalHotkey.UseVisualStyleBackColor = true;
      this.checkEnableGlobalHotkey.CheckedChanged += new System.EventHandler(this.checkBoxEnableGlobalHotkey_CheckedChanged);
      // 
      // textGlobalHotkey
      // 
      resources.ApplyResources(this.textGlobalHotkey, "textGlobalHotkey");
      this.textGlobalHotkey.Name = "textGlobalHotkey";
      this.textGlobalHotkey.KeyDown += new System.Windows.Forms.KeyEventHandler(this.textBoxGlobalHotkey_KeyDown);
      // 
      // label9
      // 
      resources.ApplyResources(this.label9, "label9");
      this.label9.Name = "label9";
      // 
      // checkLock
      // 
      resources.ApplyResources(this.checkLock, "checkLock");
      this.checkLock.Name = "checkLock";
      this.checkLock.UseVisualStyleBackColor = true;
      this.checkLock.CheckedChanged += new System.EventHandler(this.checkLock_CheckedChanged);
      // 
      // tableLayoutPanel3
      // 
      resources.ApplyResources(this.tableLayoutPanel3, "tableLayoutPanel3");
      this.tableLayoutPanel3.Controls.Add(this.buttonShowDevtools, 0, 0);
      this.tableLayoutPanel3.Controls.Add(this.buttonReloadBrowser, 1, 0);
      this.tableLayoutPanel3.Name = "tableLayoutPanel3";
      // 
      // buttonShowDevtools
      // 
      resources.ApplyResources(this.buttonShowDevtools, "buttonShowDevtools");
      this.buttonShowDevtools.Name = "buttonShowDevtools";
      this.buttonShowDevtools.UseVisualStyleBackColor = true;
      this.buttonShowDevtools.Click += new System.EventHandler(this.buttonShowDevtools_Click);
      // 
      // buttonReloadBrowser
      // 
      resources.ApplyResources(this.buttonReloadBrowser, "buttonReloadBrowser");
      this.buttonReloadBrowser.Name = "buttonReloadBrowser";
      this.buttonReloadBrowser.UseVisualStyleBackColor = true;
      this.buttonReloadBrowser.Click += new System.EventHandler(this.buttonReloadBrowser_Click);
      // 
      // label4
      // 
      resources.ApplyResources(this.label4, "label4");
      this.label4.Name = "label4";
      // 
      // tableLayoutPanel2
      // 
      resources.ApplyResources(this.tableLayoutPanel2, "tableLayoutPanel2");
      this.tableLayoutPanel2.Controls.Add(this.textUrl, 0, 0);
      this.tableLayoutPanel2.Controls.Add(this.buttonSelectFile, 1, 0);
      this.tableLayoutPanel2.Name = "tableLayoutPanel2";
      // 
      // textUrl
      // 
      resources.ApplyResources(this.textUrl, "textUrl");
      this.textUrl.Name = "textUrl";
      this.textUrl.Leave += new System.EventHandler(this.textUrl_Leave);
      // 
      // buttonSelectFile
      // 
      resources.ApplyResources(this.buttonSelectFile, "buttonSelectFile");
      this.buttonSelectFile.Name = "buttonSelectFile";
      this.buttonSelectFile.UseVisualStyleBackColor = true;
      this.buttonSelectFile.Click += new System.EventHandler(this.buttonSelectFile_Click);
      // 
      // label8
      // 
      resources.ApplyResources(this.label8, "label8");
      this.label8.Name = "label8";
      // 
      // dpsUpdateRateLabel
      // 
      resources.ApplyResources(this.dpsUpdateRateLabel, "dpsUpdateRateLabel");
      this.dpsUpdateRateLabel.Name = "dpsUpdateRateLabel";
      // 
      // dpsUpdateRate
      // 
      resources.ApplyResources(this.dpsUpdateRate, "dpsUpdateRate");
      this.dpsUpdateRate.Name = "dpsUpdateRate";
      this.dpsUpdateRate.Validating += new System.ComponentModel.CancelEventHandler(this.dpsUpdateRate_Validating);
      this.dpsUpdateRate.Validated += new System.EventHandler(this.dpsUpdateRate_Validated);
      // 
      // logUpdateLabel
      // 
      resources.ApplyResources(this.logUpdateLabel, "logUpdateLabel");
      this.logUpdateLabel.Name = "logUpdateLabel";
      // 
      // logUpdateCheckBox
      // 
      resources.ApplyResources(this.logUpdateCheckBox, "logUpdateCheckBox");
      this.logUpdateCheckBox.Name = "logUpdateCheckBox";
      this.logUpdateCheckBox.UseVisualStyleBackColor = true;
      this.logUpdateCheckBox.CheckedChanged += new System.EventHandler(this.logUpdateCheckBox_CheckedChanged);
      // 
      // restartMessageLabel
      // 
      resources.ApplyResources(this.restartMessageLabel, "restartMessageLabel");
      this.restartMessageLabel.Name = "restartMessageLabel";
      // 
      // label1
      // 
      resources.ApplyResources(this.label1, "label1");
      this.label1.Name = "label1";
      // 
      // tableLayoutPanel4
      // 
      resources.ApplyResources(this.tableLayoutPanel4, "tableLayoutPanel4");
      this.tableLayoutPanel4.Controls.Add(this.buttonSelectUserConfigFile, 0, 0);
      this.tableLayoutPanel4.Controls.Add(this.textUserConfigFile, 0, 0);
      this.tableLayoutPanel4.Name = "tableLayoutPanel4";
      // 
      // buttonSelectUserConfigFile
      // 
      resources.ApplyResources(this.buttonSelectUserConfigFile, "buttonSelectUserConfigFile");
      this.buttonSelectUserConfigFile.Name = "buttonSelectUserConfigFile";
      this.buttonSelectUserConfigFile.UseVisualStyleBackColor = true;
      this.buttonSelectUserConfigFile.Click += new System.EventHandler(this.buttonSelectUserConfigFile_Click);
      // 
      // textUserConfigFile
      // 
      resources.ApplyResources(this.textUserConfigFile, "textUserConfigFile");
      this.textUserConfigFile.Name = "textUserConfigFile";
      this.textUserConfigFile.Leave += new System.EventHandler(this.textUserConfigFile_Leave);
      // 
      // CactbotOverlayConfigPanel
      // 
      resources.ApplyResources(this, "$this");
      this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
      this.Controls.Add(this.tableLayoutPanel1);
      this.Name = "CactbotOverlayConfigPanel";
      this.tableLayoutPanel1.ResumeLayout(false);
      this.tableLayoutPanel1.PerformLayout();
      this.tableLayoutPanel3.ResumeLayout(false);
      this.tableLayoutPanel2.ResumeLayout(false);
      this.tableLayoutPanel2.PerformLayout();
      this.tableLayoutPanel4.ResumeLayout(false);
      this.tableLayoutPanel4.PerformLayout();
      this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.TableLayoutPanel tableLayoutPanel1;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.CheckBox checkMiniParseVisible;
        private System.Windows.Forms.CheckBox checkMiniParseClickthru;
        private System.Windows.Forms.Label label7;
        private System.Windows.Forms.Label label8;
        private System.Windows.Forms.CheckBox checkEnableGlobalHotkey;
        private System.Windows.Forms.TextBox textGlobalHotkey;
        private System.Windows.Forms.Label label9;
        private System.Windows.Forms.CheckBox checkLock;
        private System.Windows.Forms.TableLayoutPanel tableLayoutPanel3;
        private System.Windows.Forms.Button buttonReloadBrowser;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.TableLayoutPanel tableLayoutPanel2;
        private System.Windows.Forms.TextBox textUrl;
        private System.Windows.Forms.Button buttonSelectFile;
        private System.Windows.Forms.Label dpsUpdateRateLabel;
        private System.Windows.Forms.TextBox dpsUpdateRate;
        private System.Windows.Forms.Label logUpdateLabel;
        private System.Windows.Forms.CheckBox logUpdateCheckBox;
        private System.Windows.Forms.Label restartMessageLabel;
        private System.Windows.Forms.Button buttonShowDevtools;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.TableLayoutPanel tableLayoutPanel4;
        private System.Windows.Forms.Button buttonSelectUserConfigFile;
        private System.Windows.Forms.TextBox textUserConfigFile;
    }
}
