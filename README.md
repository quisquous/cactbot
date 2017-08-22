# cactbot (Chromium ACT Bindings Overlay for Things)

## About

This project is an overlay plugin for
[hibiyasleep's OverlayPlugin](https://github.com/hibiyasleep/OverlayPlugin)
which itself is a plugin for
[Advanced Combat Tracker](http://advancedcombattracker.com/)

It depends on [ravahn's FFXIV ACT plugin](http://www.eq2flames.com/plugin-discussion/98088-ffxiv-arr-plugin.html) and
on [xtuaok's ACT_EnmityPlugin](https://github.com/xtuaok/ACT_EnmityPlugin).

Its goal is to provide log lines, combatant info, dps info, etc.  Everything
that anybody would need to write a good Javascript UI for
[Final Fantasy XIV](http://www.finalfantasyxiv.com/).

Cactbot is backwards compatible with OverlayPlugin's miniparse addon. This lets you use
dps meters built for OverlayPlugin in Cactbot, with the option to build out more features
through Cactbot's additional Javascript APIs.

## Example - dana UI

The `CactbotOverlay/resources/dana/` directory has UI building blocks as well as full UI components.

![dana ui screenshot](Screenshot-Dana.png)

In this screenshot, there are 3 cactbots:
- [`CactbotOverlay/resources/dana/bars/bars.html`](CactbotOverlay/resources/dana/bars/bars.html) is circled in red, showing RDM resources and raid buffs.
- [`CactbotOverlay/resources/dana/dps/dps.html`](CactbotOverlay/resources/dana/dps/dps.html) is circled in purple, which is a dps meter built for OverlayPlugin's miniparse, with some minor modifications including 4.0 jobs and colors.
- [`CactbotOverlay/resources/dana/raid/raid1.html`](CactbotOverlay/resources/dana/raid/raid.html) is circled in teal, showing alerts for combat triggers. This module is built to be similar to the [BigWigs addon for World of Warcraft](https://mods.curse.com/addons/wow/big-wigs). Triggers are found in [`CactbotOverlay/resources/dana/raid/auras-triggers.js`](CactbotOverlay/resources/dana/raid/auras-triggers.js)

Here is a video of the dana UI in action on [Exdeath and Neo Exdeath](https://www.youtube.com/watch?v=Ot_GMEcwv94).

## Install

1. Find the OverlayPlugin installation with Advanced Combat Tracker.
2. Make an OverlayPlugin/addons sub-directory.
3. Build, then copy the CactbotOverlay.dll file to the addons directory.
4. If you haven't installed it separately, also copy the EnmityOverlay.dll file to the addons directory.

The directory structure should look like this:
- C:\\...\\Advanced Combat Tracker
  - Advanced Combat Tracker.exe
- C:\\...\\Advanced Combat Tracker\\OverlayPlugin
  - OverlayPlugin.dll etc
- C:\\...\\Advanced Combat Tracker\\OverlayPlugin\\addons
  - CactbotOverlay.dll
  - EnmityOverlay.dll
