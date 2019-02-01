'use strict';

// Rename this file to `jobs.js` and edit it to change the jobs ui.

// The language that you play FFXIV in.
Options.Language = 'en';

// If true, the bars are all made translucent when out of combat.
Options.LowerOpacityOutOfCombat = true;

// The opacity (in the range 0 to 1) of the UI when out of combat.
// Lower is more translucent.  0 is invisible.  1 is fully opaque.
Options.OpacityOutOfCombat = 0.5;

// The number of seconds before food expires to start showing the food
// buff warning.
Options.HideWellFedAboveSeconds = 15 * 60;
// Zones to show food buff warning, when at max level.
Options.WellFedZoneRegex = /^(Unknown Zone \([0-9A-Fa-f]+\)|Deltascape.*(Ultimate|Savage).*|.* Coil Of Bahamut.*(Ultimate|Savage).*)|Alexander.*(Ultimate|Savage).*$/;
// The food buff warning is shown when you're below this level.
// Update this when new expansion happens.
Options.MaxLevel = 70;

// Option to show the stone/fire/impact procs.
Options.ShowRdmProcs = true;

// List of jobs to show an hp value for (defaults to tanks).
Options.ShowHPNumber = ['PLD', 'WAR', 'DRK'];

// List of jobs to show an mp value for.
Options.ShowMPNumber = ['BLM', 'DRK'];

// Show procs ending this amount early so as to not waste GCDs on
// no-longer-useful procs.
// Jolt cast time + 0.5 for my reaction time.
Options.RdmCastTime = 1.94 + 0.5;
// GCD on warrior.
Options.WarGcd = 2.38;
// GCD on paladin.
Options.PldGcd = 2.43;
// The recast time for Aetherflow.
Options.SmnAetherflowRecast = 60;

// Size of big buff icons.
Options.BigBuffIconWidth = 44;
Options.BigBuffIconHeight = 32;
// Height of the timer bar for big buff icons.
Options.BigBuffBarHeight = 5;
// If non-zero, the size of the text showing the big buff icon's name.
Options.BigBuffTextHeight = 0;
// Size of the big buff icon's colour border.
Options.BigBuffBorderSize = 1;

// The distance that offensive spells such as Verareo, Bio, etc are castable.
Options.FarThresholdOffence = 24;
// When MP falls below this, the MP bar is highlighted with the .low CSS class
// on dark knight.
Options.DrkLowMPThreshold = 4800;
// When MP falls below this, the MP bar is highlighted with the .low CSS class
// on paladin.
Options.PldLowMPThreshold = 2880;

// When TP falls below this, the TP bar is highlighted with the .low CSS class.
Options.TPInvigorateThreshold = 600;
// When health falls below this, the health bar is highlighted with the
// .low CSS class.
Options.LowHealthThresholdPercent = 0.2;
// When health falls below this, the health bar is highlighted with the
// .mid CSS class.
Options.MidHealthThresholdPercent = 0.8;


// This option, if set to true, makes the jobs module only show buffs, and
// hides bars and procs.  This is for folks who prefer to use the in game
// hp/mp/tp bars and jobs gauges.  Using this option also removes the left
// side of the buff bar (see PerBuffOptions for details), and any buff that
// would have been on the left is now sorted as if it were on the right.
Options.JustBuffTracker = false;

// Overrides for all of the "big buffs" that appear to the left or right
// of the hp/mp bars.  This is stuff like trick/embolden/devotion/etc.
Options.PerBuffOptions = {
  // The name of the buff to override.  These available buffs are:
  // trick, litany, embolden, balance, chain, hyper, sight, brotherhood,
  // devotion, requiem
  trick: {
    // By default everything is on the right.  This puts the icon on the
    // left for better visibility.
    side: 'left',

    // The border color.  See: https://www.google.com/search?q=color+picker
    // This example sets trick to use a white border.
    borderColor: '#FFFFFF',

    // The icon to use.  This is a url or a data url like this.  This
    // example sets trick to use a bright red icon instead.
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAySURBVEhL7c0xEQAgDAAxhHSsf2d4QMJPbLnLnnNnvxIkQRIkQRIkQRIkQRIkQfoczD4cGLQ9QOmZGwAAAABJRU5ErkJggg==',

    // If true (instead of false here), this will hide the buff and
    // prevent it from being shown.
    hide: false,

    // sortKey controls the order of the buffs when multiple buffs are shown.
    // Smaller numbers are higher priority and will be shown closer to
    // the middle.  The existing buffs are ordered 0-10, but you can use any
    // numerical value you want here, including negatives.
    // This example sets trick to be a very high priority.
    sortKey: 1000,
  },
};
