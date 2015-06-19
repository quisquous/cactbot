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
            this.label2 = new System.Windows.Forms.Label();
            this.storageDirectory = new System.Windows.Forms.TextBox();
            this.showDevToolsButton = new System.Windows.Forms.Button();
            this.ignoreMouseEventsCheckBox = new System.Windows.Forms.CheckBox();
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
            // label2
            //
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(3, 39);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(259, 13);
            this.label2.TabIndex = 2;
            this.label2.Text = "Browser storage directory (restart ACT after changing)";
            //
            // storageDirectory
            //
            this.storageDirectory.Location = new System.Drawing.Point(6, 55);
            this.storageDirectory.Name = "storageDirectory";
            this.storageDirectory.Size = new System.Drawing.Size(431, 20);
            this.storageDirectory.TabIndex = 3;
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
            // ignoreMouseEventsCheckBox
            //
            this.ignoreMouseEventsCheckBox.AutoSize = true;
            this.ignoreMouseEventsCheckBox.Checked = true;
            this.ignoreMouseEventsCheckBox.CheckState = System.Windows.Forms.CheckState.Checked;
            this.ignoreMouseEventsCheckBox.Location = new System.Drawing.Point(549, 55);
            this.ignoreMouseEventsCheckBox.Name = "ignoreMouseEventsCheckBox";
            this.ignoreMouseEventsCheckBox.Size = new System.Drawing.Size(125, 17);
            this.ignoreMouseEventsCheckBox.TabIndex = 5;
            this.ignoreMouseEventsCheckBox.Text = "Ignore mouse events";
            this.ignoreMouseEventsCheckBox.UseVisualStyleBackColor = true;
            this.ignoreMouseEventsCheckBox.CheckedChanged += new System.EventHandler(this.clickableCheckBox_CheckedChanged);
            //
            // SettingsTab
            //
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.Controls.Add(this.ignoreMouseEventsCheckBox);
            this.Controls.Add(this.showDevToolsButton);
            this.Controls.Add(this.storageDirectory);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.htmlFile);
            this.Controls.Add(this.label1);
            this.Name = "SettingsTab";
            this.Size = new System.Drawing.Size(686, 384);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private TextBox htmlFile;
        private Label label2;
        private TextBox storageDirectory;
        private Button showDevToolsButton;
        private CheckBox ignoreMouseEventsCheckBox;


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

        public string BrowserCacheDir()
        {
            return storageDirectory.Text;
        }

        public bool WindowIgnoresMouseEvents()
        {
            return ignoreMouseEventsCheckBox.Checked;
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
            xmlSettings.AddControlSetting(storageDirectory.Name, storageDirectory);
            xmlSettings.AddControlSetting(ignoreMouseEventsCheckBox.Name, ignoreMouseEventsCheckBox);

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
    }
}
