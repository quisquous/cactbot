namespace Cactbot
{
    partial class CactbotEventSourceConfigPanel
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(CactbotEventSourceConfigPanel));
            this.tableLayoutPanel1 = new System.Windows.Forms.TableLayoutPanel();
            this.tableLayoutPanel3 = new System.Windows.Forms.TableLayoutPanel();
            this.dpsUpdateRateLabel = new System.Windows.Forms.Label();
            this.dpsUpdateRate = new System.Windows.Forms.TextBox();
            this.logUpdateLabel = new System.Windows.Forms.Label();
            this.logUpdateCheckBox = new System.Windows.Forms.CheckBox();
            this.restartMessageLabel = new System.Windows.Forms.Label();
            this.label1 = new System.Windows.Forms.Label();
            this.tableLayoutPanel4 = new System.Windows.Forms.TableLayoutPanel();
            this.buttonSelectUserConfigFile = new System.Windows.Forms.Button();
            this.textUserConfigFile = new System.Windows.Forms.TextBox();
            this.labelDevReloader = new System.Windows.Forms.Label();
            this.checkWatchFileChanges = new System.Windows.Forms.CheckBox();
            this.tableLayoutPanel1.SuspendLayout();
            this.tableLayoutPanel4.SuspendLayout();
            this.SuspendLayout();
            // 
            // tableLayoutPanel1
            // 
            resources.ApplyResources(this.tableLayoutPanel1, "tableLayoutPanel1");
            this.tableLayoutPanel1.Controls.Add(this.tableLayoutPanel3, 1, 14);
            this.tableLayoutPanel1.Controls.Add(this.dpsUpdateRateLabel, 0, 8);
            this.tableLayoutPanel1.Controls.Add(this.dpsUpdateRate, 1, 8);
            this.tableLayoutPanel1.Controls.Add(this.logUpdateLabel, 0, 9);
            this.tableLayoutPanel1.Controls.Add(this.logUpdateCheckBox, 1, 9);
            this.tableLayoutPanel1.Controls.Add(this.restartMessageLabel, 1, 10);
            this.tableLayoutPanel1.Controls.Add(this.label1, 0, 12);
            this.tableLayoutPanel1.Controls.Add(this.tableLayoutPanel4, 1, 12);
            this.tableLayoutPanel1.Controls.Add(this.labelDevReloader, 0, 13);
            this.tableLayoutPanel1.Controls.Add(this.checkWatchFileChanges, 1, 13);
            this.tableLayoutPanel1.Name = "tableLayoutPanel1";
            // 
            // tableLayoutPanel3
            // 
            resources.ApplyResources(this.tableLayoutPanel3, "tableLayoutPanel3");
            this.tableLayoutPanel3.Name = "tableLayoutPanel3";
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
            // labelDevReloader
            // 
            resources.ApplyResources(this.labelDevReloader, "labelDevReloader");
            this.labelDevReloader.Name = "labelDevReloader";
            // 
            // checkWatchFileChanges
            // 
            resources.ApplyResources(this.checkWatchFileChanges, "checkWatchFileChanges");
            this.checkWatchFileChanges.Name = "checkWatchFileChanges";
            this.checkWatchFileChanges.UseVisualStyleBackColor = true;
            this.checkWatchFileChanges.CheckedChanged += new System.EventHandler(this.checkWatchFileChanges_CheckedChanged);
            // 
            // CactbotEventSourceConfigPanel
            // 
            resources.ApplyResources(this, "$this");
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.Controls.Add(this.tableLayoutPanel1);
            this.Name = "CactbotEventSourceConfigPanel";
            this.tableLayoutPanel1.ResumeLayout(false);
            this.tableLayoutPanel1.PerformLayout();
            this.tableLayoutPanel4.ResumeLayout(false);
            this.tableLayoutPanel4.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.TableLayoutPanel tableLayoutPanel1;
        private System.Windows.Forms.TableLayoutPanel tableLayoutPanel3;
        private System.Windows.Forms.Label dpsUpdateRateLabel;
        private System.Windows.Forms.TextBox dpsUpdateRate;
        private System.Windows.Forms.Label logUpdateLabel;
        private System.Windows.Forms.CheckBox logUpdateCheckBox;
        private System.Windows.Forms.Label restartMessageLabel;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.TableLayoutPanel tableLayoutPanel4;
        private System.Windows.Forms.Button buttonSelectUserConfigFile;
        private System.Windows.Forms.TextBox textUserConfigFile;
        private System.Windows.Forms.Label labelDevReloader;
        private System.Windows.Forms.CheckBox checkWatchFileChanges;
    }
}
