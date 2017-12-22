// Rename this file to `jobs.js` and edit it to change the jobs ui.

// The language that you play FFXIV in.
Options.Language = 'en';

// If true, the bars are all made translucent when out of combat.
Options.LowerOpacityOutOfCombat = true

// The number of seconds before food expires to start showing the food buff warning.
Options.HideWellFedAboveSeconds = 15 * 60
// Zones to show food buff warning, when at max level.
Options.WellFedZoneRegex = /^(Unknown Zone \([0-9A-Fa-f]+\)|Deltascape.*(Ultimate|Savage).*|.* Coil Of Bahamut.*(Ultimate|Savage).*)|Alexander.*(Ultimate|Savage).*$/
// The food buff warning is shown when you're below this level. Update this when new expansion happens.
Options.MaxLevel = 70

// Option to show the stone/fire/impact procs.
Options.ShowRdmProcs = true

// Show procs ending this amount early so as to not waste GCDs on no-longer-useful procs.
// Jolt cast time + 0.5 for my reaction time.
Options.RdmCastTime = 1.94 + 0.5
// GCD on warrior.
Options.WarGcd = 2.38
// The recast time for Aetherflow.
Options.SmnAetherflowRecast = 60

// Size of big buff icons.
Options.BigBuffIconWidth = 44
Options.BigBuffIconHeight = 32
// Height of the timer bar for big buff icons.
Options.BigBuffBarHeight = 5
// If non-zero, the size of the text showing the big buff icon's name.
Options.BigBuffTextHeight = 0
// Size of the big buff icon's colour border.
Options.BigBuffBorderSize = 1

// The distance that offensive spells such as Verareo, Bio, etc are castable.
Options.FarThresholdOffence = 24

// When TP falls below this, the TP bar is highlighted with the .low CSS class.
Options.TPInvigorateThreshold = 600
// When health falls below this, the health bar is highlighted with the .low CSS class.
Options.LowHealthThresholdPercent = 0.2
// When health falls below this, the health bar is highlighted with the .mid CSS class.
Options.MidHealthThresholdPercent = 0.8
