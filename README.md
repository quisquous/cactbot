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
