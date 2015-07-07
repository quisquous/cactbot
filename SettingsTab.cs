using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Data;
using System.Text;
using System.Windows.Forms;
using Advanced_Combat_Tracker;
using System.IO;
using System.Reflection;
using System.Xml;

[assembly: AssemblyTitle("Cactbot")]
[assembly: AssemblyDescription("Chromium ACT Bindings Overlay")]
[assembly: AssemblyVersion("0.0.0.1")]

namespace Cactbot
{
    public class SettingsTab : UserControl
    {
        #region Designer Created Code (Avoid editing)
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Component Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.label1 = new System.Windows.Forms.Label();
            this.htmlFile = new System.Windows.Forms.TextBox();
            this.showDevToolsButton = new System.Windows.Forms.Button();
            this.layoutCheckbox = new System.Windows.Forms.CheckBox();
            this.reloadButton = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(3, 0);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(127, 13);
            this.label1.TabIndex = 0;
            this.label1.Text = "Add filename to load here";
            // 
            // htmlFile
            // 
            this.htmlFile.Location = new System.Drawing.Point(6, 16);
            this.htmlFile.Name = "htmlFile";
            this.htmlFile.Size = new System.Drawing.Size(431, 20);
            this.htmlFile.TabIndex = 1;
            // 
            // showDevToolsButton
            // 
            this.showDevToolsButton.Location = new System.Drawing.Point(563, 13);
            this.showDevToolsButton.Name = "showDevToolsButton";
            this.showDevToolsButton.Size = new System.Drawing.Size(111, 23);
            this.showDevToolsButton.TabIndex = 4;
            this.showDevToolsButton.Text = "Show Dev Tools";
            this.showDevToolsButton.UseVisualStyleBackColor = true;
            this.showDevToolsButton.Click += new System.EventHandler(this.showDevToolsButton_Click);
            // 
            // layoutCheckbox
            // 
            this.layoutCheckbox.AutoSize = true;
            this.layoutCheckbox.Location = new System.Drawing.Point(563, 71);
            this.layoutCheckbox.Name = "layoutCheckbox";
            this.layoutCheckbox.Size = new System.Drawing.Size(97, 17);
            this.layoutCheckbox.TabIndex = 6;
            this.layoutCheckbox.Text = "UI layout mode";
            this.layoutCheckbox.UseVisualStyleBackColor = true;
            this.layoutCheckbox.CheckedChanged += new System.EventHandler(this.layoutCheckbox_CheckedChanged);
            // 
            // reloadButton
            // 
            this.reloadButton.Location = new System.Drawing.Point(563, 42);
            this.reloadButton.Name = "reloadButton";
            this.reloadButton.Size = new System.Drawing.Size(111, 23);
            this.reloadButton.TabIndex = 7;
            this.reloadButton.Text = "Reload Page";
            this.reloadButton.UseVisualStyleBackColor = true;
            this.reloadButton.Click += new System.EventHandler(this.reloadButton_Click);
            // 
            // SettingsTab
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.Controls.Add(this.reloadButton);
            this.Controls.Add(this.layoutCheckbox);
            this.Controls.Add(this.showDevToolsButton);
            this.Controls.Add(this.htmlFile);
            this.Controls.Add(this.label1);
            this.Name = "SettingsTab";
            this.Size = new System.Drawing.Size(686, 384);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private TextBox htmlFile;
        private Button showDevToolsButton;
        private CheckBox layoutCheckbox;
        private Button reloadButton;


        private System.Windows.Forms.Label label1;

        #endregion
        public SettingsTab()
        {
            InitializeComponent();
        }

        Label lblStatus;    // The status label that appears in ACT's Plugin tab
        string settingsFile = Path.Combine(ActGlobals.oFormActMain.AppDataFolder.FullName, "Config\\PluginSample.config.xml");
        SettingsSerializer xmlSettings;

        public string HTMLFile() {
            return htmlFile.Text;
        }

        public void Initialize(Label pluginStatusText)
        {
            lblStatus = pluginStatusText;    // Hand the status label's reference to our local var
            this.Dock = DockStyle.Fill;    // Expand the UserControl to fill the tab's client space
            xmlSettings = new SettingsSerializer(this);    // Create a new settings serializer and pass it this instance
            LoadSettings();

            lblStatus.Text = "Plugin Started";
        }
        public void Shutdown()
        {
            SaveSettings();
            lblStatus.Text = "Plugin Exited";
        }

        void LoadSettings()
        {
            xmlSettings.AddControlSetting(htmlFile.Name, htmlFile);

            if (File.Exists(settingsFile))
            {
                FileStream fs = new FileStream(settingsFile, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
                XmlTextReader xReader = new XmlTextReader(fs);

                try
                {
                    while (xReader.Read())
                    {
                        if (xReader.NodeType == XmlNodeType.Element)
                        {
                            if (xReader.LocalName == "SettingsSerializer")
                            {
                                xmlSettings.ImportFromXml(xReader);
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    lblStatus.Text = "Error loading settings: " + ex.Message;
                }
                xReader.Close();
            }
        }
        void SaveSettings()
        {
            FileStream fs = new FileStream(settingsFile, FileMode.Create, FileAccess.Write, FileShare.ReadWrite);
            XmlTextWriter xWriter = new XmlTextWriter(fs, Encoding.UTF8);
            xWriter.Formatting = Formatting.Indented;
            xWriter.Indentation = 1;
            xWriter.IndentChar = '\t';
            xWriter.WriteStartDocument(true);
            xWriter.WriteStartElement("Config");    // <Config>
            xWriter.WriteStartElement("SettingsSerializer");    // <Config><SettingsSerializer>
            xmlSettings.ExportToXml(xWriter);    // Fill the SettingsSerializer XML
            xWriter.WriteEndElement();    // </SettingsSerializer>
            xWriter.WriteEndElement();    // </Config>
            xWriter.WriteEndDocument();    // Tie up loose ends (shouldn't be any)
            xWriter.Flush();    // Flush the file buffer to disk
            xWriter.Close();
        }

        public event EventHandler OnButtonShowDevTools;
        private void showDevToolsButton_Click(object sender, EventArgs e)
        {
            if (this.OnButtonShowDevTools != null)
                this.OnButtonShowDevTools(sender, e);
        }

        public event EventHandler OnCheckboxIgnoresMouseChanged;
        private void clickableCheckBox_CheckedChanged(object sender, EventArgs e)
        {
            if (this.OnCheckboxIgnoresMouseChanged != null)
                this.OnCheckboxIgnoresMouseChanged(sender, e);
        }

        public event EventHandler OnCheckboxLayoutModeChanged;
        private void layoutCheckbox_CheckedChanged(object sender, EventArgs e)
        {
            if (this.OnCheckboxLayoutModeChanged != null)
                this.OnCheckboxLayoutModeChanged(sender, e);
        }

        public event EventHandler OnButtonReload;
        private void reloadButton_Click(object sender, EventArgs e)
        {
            if (this.OnButtonReload != null)
                this.OnButtonReload(sender, e);
        }
    }
}
