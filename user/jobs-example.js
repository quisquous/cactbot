// Rename this file to `jobs.js` and edit it to change the jobs ui.

// Zones to show food buff warning, when at max level.
Options.WellFedZoneRegex = /^(Unknown Zone \([0-9A-Fa-f]+\)|Deltascape.*(Ultimate|Savage).*|.* Coil Of Bahamut.*(Ultimate|Savage).*)|Alexander.*(Ultimate|Savage).*$/;

// The food buff warning is shown when you're below this level.
// Update this when new expansion happens.
Options.MaxLevel = 80;

// List of jobs to show an hp value for (defaults to tanks).
Options.ShowHPNumber = ['PLD', 'WAR', 'DRK', 'GNB'];

// List of jobs to show an mp value for.
Options.ShowMPNumber = ['BLM', 'DRK'];

// The recast time for Aetherflow.
Options.SmnAetherflowRecast = 60;

// The distance that offensive spells such as Verareo, Bio, etc are castable.
Options.FarThresholdOffence = 24;
// When MP falls below this, the MP bar is highlighted with the .low CSS class
// on dark knight.
Options.DrkLowMPThreshold = 4800;
// When MP falls below this, the MP bar is highlighted with the .low CSS class
// on paladin.
Options.PldLowMPThreshold = 2880;
// When MP falls below this, the MP bar is highlighted with the .low CSS class
// on black mage.
Options.BlmLowMPThreshold = 2400;

const kRed = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAySURBVEhL7c0xEQAgDAAxhHSsf2d4QMJPbLnLnnNnvxIkQRIkQRIkQRIkQRIkQfoczD4cGLQ9QOmZGwAAAABJRU5ErkJggg==';

// Remove these /* and */ comment lines to enable the example code below.
/*

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
    icon: kRed,

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

*/
