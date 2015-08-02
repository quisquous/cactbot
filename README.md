# cactbot (Chromium ACT Bindings Overlay for Timers)

## About

This project is an [Advanced Combat Tracker](http://advancedcombattracker.com/)
plugin for [Final Fantasy XIV](http://www.finalfantasyxiv.com/).
It depends on [ravahn's FFXIV ACT plugin](http://www.eq2flames.com/plugin-discussion/98088-ffxiv-arr-plugin.html).

To make it easier to develop arbitrary overlays for FFXIV,
this project provides Javascript bindings to ACT values as well as a transparent Chromium window overlay for displaying output.

![Rotation Window](https://raw.githubusercontent.com/quisquous/cactbot/master/screenshots/rotation.png)

![Hunt Window](https://raw.githubusercontent.com/quisquous/cactbot/master/screenshots/hunt.png)

## Installing

### Install dependencies

After building the plugin using Visual Studio, copy the files listed in the
[CefSharp guide](https://github.com/cefsharp/CefSharp/wiki/Getting-Started#copying-dependencies)
into the Advanced Combat Tracker directory.

If this step is not done properly, cactbot will crash on loading.

### Add cactbot dll to ACT

Load the plugin normally.
This plugin needs to be loaded first (lower in the list) than any other plugins that use Chromium Embedded Framework,
such as the [RainbowMage overlay plugin](https://github.com/RainbowMage/OverlayPlugin/).

If this is not the case, then cactbot will fall back to fake bindings and will not operate correctly.

## Configuration

### Set the HTML file

From the cactbot settings page inside of ACT, point at the cactbot.html file.

### Layout windows

Layout mode can be enabled via the cactbot settings page in ACT as well.
When layout mode is enabled, cactbot windows are highlighted.
The left mouse button can be used to move and resize windows.
Right-clicking a window will toggle visibility for that window after layout mode is disabled.

### TP viewer

To use the TP viewer, you need to manually position the TP window over your
party window in layout mode.

Whenever the party changes, you need to run this macro in game:

    /echo cactbot:tp:1<1>
    /echo cactbot:tp:2<2>
    /echo cactbot:tp:3<3>
    /echo cactbot:tp:4<4>
    /echo cactbot:tp:5<5>
    /echo cactbot:tp:6<6>
    /echo cactbot:tp:7<7>
    /echo cactbot:tp:8<8>

This is because there's currently no way to understand the ordering of
the party list without manually telling cactbot about it.

## Future Goals

* compatibility with custom RainbowMage html
* enmity viewer
* gathering nodes
