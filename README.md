# cactbot (Chromium ACT Bindings Overlay for Things)

## About

This project is an overlay plugin for
[hibiyasleep's OverlayPlugin](https://github.com/hibiyasleep/OverlayPlugin)
which itself is a plugin for
[Advanced Combat Tracker](http://advancedcombattracker.com/)

It depends on [ravahn's FFXIV ACT plugin](http://www.eq2flames.com/plugin-discussion/98088-ffxiv-arr-plugin.html).

Its goal is to provide log lines, combatant info, dps info, etc.  Everything
that anybody would need to write a good Javascript UI for
[Final Fantasy XIV](http://www.finalfantasyxiv.com/).

Cactbot is backwards compatible with OverlayPlugin's miniparse addon. This lets you use
dps meters built for OverlayPlugin in Cactbot, with the option to build out more features
through Cactbot's additional Javascript APIs.

## UI modules

The [`ui/`](ui/) directory has some prebuilt UI modules, and [`resources/`](resources/) has
building blocks for building your own modules.

![ui screenshot](Screenshot-Dana.png)

In this screenshot, there are 3 cactbots:
- [`ui/jobs/jobs.html`](ui/jobs/jobs.html) is circled in red, showing RDM resources and raid buffs.
- [`ui/raidboss/raidboss.html`](ui/raidboss/raidboss.html) is circled in teal, showing alerts for combat triggers. It can also show timelines of upcoming fight events, similar to the ACT Timeline addon. This module is built to be similar to the [BigWigs Bossmods](https://mods.curse.com/addons/wow/big-wigs) addon for World of Warcraft. Triggers are found in [`ui/raidboss/data/triggers`](ui/raidboss/data/triggers). Timelines are found in [`ui/raidboss/data/timelines`](ui/raidboss/data/timelines).
- [`ui/dps/rdmty/dps.html`](ui/dps/rdmty/dps.html) is circled in purple, which is a dps meter built for OverlayPlugin's miniparse, with some minor modifications including 4.0 jobs and colors.

Here is a video of these UI components in action on [Exdeath and Neo Exdeath](https://www.youtube.com/watch?v=Ot_GMEcwv94), before the timelines were added to raidboss.

## Building

You should already have [OverlayPlugin](https://github.com/hibiyasleep/OverlayPlugin/releases) installed and working in [Advanced Combat Tracker](http://advancedcombattracker.com/).

1. Follow the instructions in the `dummy.txt` file in [`CactbotOverlay/ThirdParty/OverlayPlugin`](CactbotOverlay/ThirdParty/OverlayPlugin).
2. Follow the instructions in the `dummy.txt` file in [`CactbotOverlay/ThirdParty/ACT`](CactbotOverlay/ThirdParty/ACT).
3. Open the solution in Visual Studio (tested with Visual Studio 2017).
4. Build for "Release" and "x64".
5. The plugin will be built as `bin/x64/Release/CactbotOverlay.dll`.

## Installing

You should already have [OverlayPlugin](https://github.com/hibiyasleep/OverlayPlugin/releases) installed and working in [Advanced Combat Tracker](http://advancedcombattracker.com/).

1. Find the OverlayPlugin installation, make an `addons` sub-directory inside it (looks like `...\OverlayPlugin\addons`).
2. Copy the `CactbotOverlay.dll` file to the `addons` directory.
3. Make sure to unblock the `CactbotOverlay.dll` (right click -> properties -> unblock) if you downloaded it, instead of building it.
4. If you get an error that it can't find `FFXIV_ACT_Plugin.dll`, make sure it is in the same directory as `Advanced Combat Tracker.exe`.

   The directory structure should look something like this:
   - C:\\...\\Advanced Combat Tracker
     - Advanced Combat Tracker.exe
     - FFXIV_ACT_Plugin.dll
   - C:\\...\\Advanced Combat Tracker\\OverlayPlugin
     - OverlayPlugin.dll etc
   - C:\\...\\Advanced Combat Tracker\\OverlayPlugin\\addons
     - CactbotOverlay.dll

5. Now add a new overlay in the OverlayPlugin tab in ACT, and choose `Cactbot` as the type.
6. In the URL field, browse to an html file to load as a UI element. For example to `/path/to/cactbot/ui/raidboss/raidboss.html`.

## Configuring UI modules.

Cactbot UI modules can load user settings from the [`user/`](user/) directory. Simply add
a **user/\<name\>.css** or a **user/\<name\>.js** file, where **\<name\>** is the name of
the UI module, such as [jobs](ui/jobs) or [raidboss](ui/raidboss). These 2 UI modules both
support user settings.

The **user/\<name\>.css** file can override positions, sizes, colors, etc. for the visual
appearance. See the **ui/\<name\>/\<name\>.css** to find the names of things you can modify.
For example in [`ui/raidboss/raidboss.css`](ui/raidboss/raidboss.css), you see the
`#popup-text-container` which can be moved in **user/raidboss.css** to a different position
as desired. Or the size and color of info text alerts can be changed via the `.info-text`
class.

The **user/\<name\>.js** file can set options to change the behaviour of the UI module. The
options that can be changed are documented as the `Options` structure at the top of the
**ui/\<name\>/\<name\>.js** file. For example in [`ui/raidboss/raidboss.js`](ui/raidboss/raidboss.js),
you see the `BarExpiresSoonSeconds` option which can change when timeline bars should be
highlighted. You would change that option to 5 seconds by editing **user/raidboss.js** to say:

> ```Options.BarExpiresSoonSeconds = 5```

To add a global trigger alert, for example, add to **user/raidboss.js**:

> ```Options.Triggers = [
  { zoneRegex: /./,
    triggers: [
      // Trick Attack used.
      { regex: /:.*?:[0-9A-Fa-f]+:Trick Attack:/,
        sound: '../../resources/sounds/WeakAuras/RoaringLion.ogg',
      },
    ],
  },
]```
