# Cactbot Customization

🌎 [**English**] [[简体中文](./zh-CN/CactbotCustomization.md)] [[繁體中文](./zh-TW/CactbotCustomization.md)] [[한국어](./ko-KR/CactbotCustomization.md)]

- [Using the cactbot UI](#using-the-cactbot-ui)
- [Changing Trigger Text with the cactbot UI](#changing-trigger-text-with-the-cactbot-ui)
- [User Directory Overview](#user-directory-overview)
- [Setting Your User Directory](#setting-your-user-directory)
- [Customizing Appearance](#customizing-appearance)
- [Overriding Raidboss Triggers](#overriding-raidboss-triggers)
  - [Example 1: changing the output text](#example-1-changing-the-output-text)
  - [Example 2: making provoke work for all jobs](#example-2-making-provoke-work-for-all-jobs)
  - [Example 3: adding custom triggers](#example-3-adding-custom-triggers)
- [Overriding Raidboss Timelines](#overriding-raidboss-timelines)
- [Customizing Behavior](#customizing-behavior)
- [Debugging User Files](#debugging-user-files)
  - [Check the OverlayPlugin log for errors](#check-the-overlayplugin-log-for-errors)
  - [Check if your file is loaded](#check-if-your-file-is-loaded)
  - [Check if your user file has errors](#check-if-your-user-file-has-errors)

## Using the cactbot UI

The best way to customize cactbot is to use the cactbot configuration UI.
This is under
ACT -> Plugins -> OverlayPlugin.dll -> Cactbot.

This has options for things like:

- setting triggers to tts
- disabling triggers
- changing the output text of triggers
- changing triggers to say a player's job instead of name
- changing your cactbot language
- volume settings
- getting rid of that cheese icon

It is not possible to configure everything you might want
through the cactbot configuration UI.
However, it is the easiest place to start with.
Over time, more options will be added there.

These options are stored in your
`%APPDATA%\Advanced Combat Tracker\Config\RainbowMage.OverlayPlugin.config.json`
file.
You should not need to edit that file directly.

## Changing Trigger Text with the cactbot UI

In the cactbot configuration UI, under
ACT -> Plugins -> OverlayPlugin.dll -> Cactbot -> Raidboss,
there are individual trigger listings.
You can use these listings to change various exposed configuration settings per trigger.

Settings with a bell (🔔) next to their name are trigger outputs that you can override.
For example, maybe there's an 🔔onTarget field whose text is `Tank Buster on ${player}`.
This is the string that will get played on screen (or via tts) when there is a tank buster on some person.
`${player}` here is a parameter that will be set dynamically by the trigger.
Anything that looks like `${param}` is such a dynamic parameter.

You could change this to say `${player} is going to die!` instead.
Or, maybe you don't care who it's on, and you can edit the text to `Buster` to be brief.
If you want to undo your overriding, just clear the text.

There are some limitations to this overriding.
You cannot change the logic.
You cannot make `tts` to say something different than the `alarmText` in most cases.
You cannot add additional parameters.
If you want to do any of these more complicated overrides,
then you will want to look at the [Overriding Raidboss Triggers](#overriding-raidboss-triggers) section.

Any parameter that refers to a player (usually called `${player}` but not always)
can also be further modified in each individual output string:

- `${player.job}`: job abbreviation, e.g. WHM
- `${player.jobFull}`: job full name, e.g. White Mage
- `${player.role}`: role, e.g. support
- `${player.name}`: player's full name, e.g. Tini Poutini
- `${player.nick}`: player's nickname / first name, e.g. Tini
- `${player.id}`: a player's id (for testing purposes), e.g. 1000485F

If there are bugs or a player is not in your party or you use an invalid suffix,
it may fall back to a default nickname just so something can be printed.

By default, `${player}` implies `${player.nick}`,
however you can set this default with the "Default Player Label" option
in the cactbot config UI under the raidboss section.

## User Directory Overview

If the cactbot UI doesn't have the option you are looking for,
then you may need to consider user file overrides.
At this point, you are writing JavaScript and CSS,
and so you might need a little bit of programming savvy.

The general philosophy of cactbot is that
any user configuration should only go in files in the user directory.
This will prevent your changes from being overwritten during future cactbot updates.
Additionally, modifying cactbot files directly from a cactbot release
will not work properly without running extra build steps.

All cactbot UI modules can load user settings from the [user/](../user/) directory.
The `raidboss` module loads `user/raidboss.js` and `user/raidboss.css`,
as well as any `.js` and `.css` files inside the `user/raidboss/` directory
with any filenames in any number of subfolders.
(Timeline `.txt` files must be directly in the same folder as the `.js` that refers to them.)
These user-defined files are included after cactbot's files and can override its settings.

Similarly, the `oopsyraidsy` module loads `user/oopsyraidsy.js` and `user/oopsyraidsy.css`,
as well as all `.js` and `.css` files inside the `user/oopsyraidsy/` directory.
And so on, for each module by name.

cactbot loads files in subdirectories (alphabetically) before loading files in outer directories.
This is so that `user/raidboss.js` will always be loaded last
and can override anything that is set inside a file inside of `user/raidboss/`.
For example, `user/alphascape/some_file.js` will load before `user/mystatic/some_file.js`,
which will both load before `user/raidboss.js`.
The same ordering applies to `.css` files.

In this documentation, any reference to "user-defined js file" applies to both of these.
There is no difference between `user/raidboss.js` and `user/raidboss/some_file.js`,
other than the order in which they load.
Similarly, "user-defined css file" means both `user/radar.css` and `user/radar/some_file.css`.
Subdirectories in the user folder are intended to
make it easier to share triggers and customizations with others.

You can get more information about the loading order
by looking at the [debug messages](#check-if-your-file-is-loaded)
when developer mode is turned on.

The `user/` directory already includes some example configuration files,
which you can rename and use.
For example the [user/raidboss-example.js](../user/raidboss-example.js) file
can be renamed to `user/raidboss.js`
and edited to change the behavior of the `raidboss` module.

After making any changes to these files,
pressing the "Reload overlay" button
for the appropriate overlay in ACT's OverlayPlugin settings will apply the changes.

## Setting Your User Directory

The cactbot user directory can be set via the cactbot configuration UI:
ACT -> Plugins -> OverlayPlugin.dll -> Cactbot -> Cactbot user directory.
Click the `Choose Directory` button and select a folder on disk.

If you haven't selected one,
it will try to select one based on where you have installed cactbot on disk.

Ideally, you should select the `cactbot/user` folder from your cactbot installation.
This is often in `%APPDATA%\Advanced Combat Tracker\Plugins\cactbot-version\cactbot\user`.
[This folder](../user) has example customization files.

## Customizing Appearance

A user-defined css file can change positions, sizes, colors, etc. for components of
the UI module. See the `ui/<name>/<name>.css` to find the selectors you can modify.

For example in [ui/raidboss/raidboss.css](../ui/raidboss/raidboss.css),
you see the `#popup-text-container` and `#timeline-container`
which can be changed via `user/raidboss.css` to different positions as desired.
You can use `user/raidboss.css` or a `.css` file in `user/raidboss/` to add additional styling.

The size and color of info text alerts can also be changed
by making a CSS rule for the `.info-text` class such as below:

```css
.info-text {
  font-size: 200%;
  color: rgb(50, 100, 50);
}
```

You can think about the CSS in the user file as being appended to the end
of any built-in cactbot CSS file.
Therefore, you need to keep in mind [CSS specificity rules](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity),
possibly adding `!important` to force your rule to override.
Additionally, you may need to unset properties by setting them to `auto`.

The best way to debug CSS issues is to use [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools).
You can open DevTools for an overlay by going to
ACT -> Plugins -> OverlayPlugin.dll -> your overlay -> Open DevTools.

**Note**: some things are hard or impossible to customize, such as the timeline bars.
This is because they use custom elements,
and they don't expose a lot of knobs to tune.
If you have particular things you want to change about the timeline bars that you can't,
please feel free to submit a [github issue](https://github.com/OverlayPlugin/cactbot/issues/new/choose).

**Warning**: cactbot makes no guarantees about preserving CSS backwards compatability.
Future changes to cactbot may rearrange elements,
change element names and classes,
or change styling entirely.
In general, you are on your own if you want to style cactbot with CSS.

## Overriding Raidboss Triggers

You can use a user-defined js file
(e.g. `user/raidboss.js` or any `.js` file under `user/raidboss/`)
to override how triggers behave.
You can change the text that they output,
what jobs they run for,
and how long they stay on screen,
and anything else.

You can see readable JavaScript versions of all of the cactbot triggers
in this branch: <https://github.com/OverlayPlugin/cactbot/tree/triggers>
This is the preferred reference to use for viewing, copying, and pasting.
Triggers in the main branch
or shipped in a cactbot release are often in unreadable bundles
or are TypeScript which is not supported in user folders.

In your user-defined js file for raidboss,
there is an `Options.Triggers` list that contains a list of trigger sets.
You can use this to append new triggers and
modify existing triggers.
If a user file contains a trigger with the same id as any previous trigger
(including triggers in cactbot), then that trigger will override it.

If you are going to modify triggers,
it is worth reading the [trigger guide](RaidbossGuide.md)
to understand what the various fields of each trigger means.

In general, the pattern to follow is to add a block of code
to your user-defined js file (e.g. `user/raidboss.js`) that looks like this:

```javascript
Options.Triggers.push({
  // Find the ZoneId from the top of the file,
  // e.g. ZoneId.MatchAll (for all zones) or ZoneId.TheBozjanSouthernFront.
  zoneId: ZoneId.PutTheZoneFromTheTopOfTheFileHere,
  triggers: [
    {
      // This is where you put the trigger object.
      // e.g. id or netRegex or infoText
    },
  ],
});
```

The easiest approach to modify triggers is to copy and paste the block of code
above for each trigger.
Modify the `zoneId` line to have the zone id for the zone you care about,
usually from the top of the cactbot trigger file.
[This file](../resources/zone_id.ts) has a list of all the zone ids.
If you specify one incorrectly, you will get a warning in the OverlayPlugin log window.
Then, [copy the trigger text](https://github.com/OverlayPlugin/cactbot/tree/triggers) into this block.
Edit as needed.
Repeat for all the triggers you want to modify.
Reload your raidboss overlay to apply your changes.

**Note**: This method completely removes the original trigger,
and so do not delete any logic when making edits.
Also, this is JavaScript, and so it still needs to be valid JavaScript.
If you are not a programmer, be extra careful with what and how you edit.

### Example 1: changing the output text

Let's say hypothetically that you are doing UCOB
and your group decides that they are going to do "fire out" first
instead of "fire in" first like cactbot calls it by default.
Additionally, you *also* want to have the tts say something different for this trigger.
You keep forgetting to get out, so you want it to repeat a few times.

If you only wanted to change the `infoText`,
you could do this via [Changing Trigger Text with the cactbot UI](#changing-trigger-text-with-the-cactbot-ui).

One way to adjust this is to edit the trigger output for this trigger.
You can find the original fireball #1 trigger in
[ui/raidboss/data/04-sb/ultimate/unending_coil_ultimate.js](https://github.com/OverlayPlugin/cactbot/blob/triggers/04-sb/ultimate/unending_coil_ultimate.js#:~:text=UCU%20Nael%20Fireball%201).

This chunk of code is what you would paste into the bottom of your user-defined js file.

```javascript
Options.Triggers.push({
  zoneId: ZoneId.TheUnendingCoilOfBahamutUltimate,
  triggers: [
    {
      id: 'UCU Nael Fireball 1',
      netRegex: NetRegexes.ability({ source: 'Ragnarok', id: '26B8', capture: false }),
      delaySeconds: 35,
      suppressSeconds: 99999,
      // The infoText is what appears on screen in green.
      infoText: {
        en: 'Fire OUT',
      },
      tts: {
        en: 'out out out out out',
      },
      run: function(data) {
        data.naelFireballCount = 1;
      },
    },
  ],
});
```

This edit also removed languages other than English.

### Example 2: making provoke work for all jobs

Currently, provoke only works for players in your alliance and not for all jobs.
This example shows how to make it work for all players.
The provoke trigger can be found in
[ui/raidboss/data/00-misc/general.js](https://github.com/OverlayPlugin/cactbot/blob/triggers/00-misc/general.js#:~:text=General%20Provoke).

Here is a modified version with a different `condition` function.
Because this shares the same `General Provoke` id with the built-in cactbot trigger,
it will override the built-in version.

This chunk of code is what you would paste into the bottom of your user-defined js file.

```javascript
Options.Triggers.push({
  zoneId: ZoneId.MatchAll,
  triggers: [
    {
      id: 'General Provoke',
      netRegex: NetRegexes.ability({ id: '1D6D' }),
      condition: function(data, matches) {
        // I want to see all provokes, even they are not in the party,
        // or I am not a tank.
        return true;
      },
      infoText: (data, matches, output) => {
        return output.text!({ player: data.party.member(matches.source) });
      },
      outputStrings: {
        text: {
          en: 'Provoke: ${player}',
          de: 'Herausforderung: ${player}',
          fr: 'Provocation: ${player}',
          ja: '挑発: ${player}',
          cn: '挑衅: ${player}',
          ko: '도발: ${player}',
        },
      },
    },
  ],
});
```

You could also just delete the `condition` function entirely here,
as triggers without conditions will always run when their regex matches.

### Example 3: adding custom triggers

You can also use this same pattern to add your own custom triggers.

Here's an example of a custom trigger that prints "Get out!!!",
one second after you receive an effect called "Forked Lightning".

```javascript
Options.Triggers.push({
  zoneId: ZoneId.MatchAll,
  triggers: [
    {
      // This id is made up, and is not overriding a cactbot trigger.
      id: 'Personal Forked Lightning',
      regex: Regexes.gainsEffect({ effect: 'Forked Lightning' }),
      condition: (data, matches) => { return matches.target === data.me; },
      delaySeconds: 1,
      alertText: 'Get out!!!',
    },

    // ... other triggers here, if you want
  ],
});
```

Your best resources for learning how to write cactbot triggers
is the [trigger guide](RaidbossGuide.md)
and also reading through existing triggers in [ui/raidboss/data](../ui/raidboss/data).

## Overriding Raidboss Timelines

Some customization of timelines can be done via the [cactbot config UI](#using-the-cactbot-ui).
This UI allows you to hide/rename existing timeline entries
or add custom entries at particular times.

This section is for when you need to do more than that, and want to replace a timeline entirely.
Completely overriding a raidboss timeline is similar to [overriding a trigger](#overriding-raidboss-triggers).

The steps to override a timeline are:

1) Copy the timeline text file out of cactbot and into your user folder

    For example, you could copy
    [ui/raidboss/data/05-shb/ultimate/the_epic_of_alexander.txt](../ui/raidboss/data/05-shb/ultimate/the_epic_of_alexander.txt)
    to `user/the_epic_of_alexander.txt`.

1) Add a section to your user/raidboss.js file to override this.

    Like adding a trigger, you add a section with the `zoneId`,
    along with `overrideTimelineFile: true`,
    and a `timelineFile` with the name of the text file.

    ```javascript
    Options.Triggers.push({
      zoneId: ZoneId.TheEpicOfAlexanderUltimate,
      overrideTimelineFile: true,
      timelineFile: 'the_epic_of_alexander.txt',
    });
    ```

    In this case, this assumes that you have followed step 1
    and there is a `user/the_epic_of_alexander.txt` file.

    By setting `overrideTimelineFile: true`,
    it tells cactbot to replace the built-in timeline entirely
    with any new timeline that you add.

1) Edit your new timeline file in your user folder as needed

    Refer to the [timeline guide](TimelineGuide.md) for more documentation on the timeline format.

**Note**: Editing timelines is a bit risky,
as there may be timeline triggers that refer to specific timeline text.
For instance, in TEA, there are timeline triggers for `Fluid Swing` and `Propeller Wind`, etc.
If these names are changed or removed, then the timeline triggers will also be broken.

## Customizing Behavior

This section discusses other kinds of customizations you can make to cactbot modules.
There are some variables that are not in the config UI and are also not triggers.

Each cactbot module has an `Options` variable that controls various options.
The options that can be changed are documented in the `Options` section
at the top of each `ui/<name>/<name>.js` file.

For example in [ui/raidboss/raidboss.js](../ui/raidboss/raidboss.js),
you see the `PlayerNicks` option which allows you to give people nicknames
when their names are called out

```javascript
Options.PlayerNicks = {
  // 'Firstname Lastname': 'Nickname',
  'Banana Nana': 'Nana',
  'The Great\'one': 'Joe', // The Great'one => Joe, needs a backslash for the apostrophe
  'Viewing Cutscene': 'Cut',
  // etc, with more nicknames
};
```

You can override text-to-speech callouts globally via

```javascript
Options.TransformTts = (text) => {
  return text.replace('a', 'b');
};
```

**Warning**: files inside of your user directory will silently overwrite settings
that were set from the cactbot configuration UI.
This can be confusing,
so it's generally preferable to let the config tool set everything you can,
and only use user files in order to set things that the config tool does not
provide access to.

## Global Trigger File Imports

User files are `eval`'d in JavaScript,
and thus cannot `import` in the same way that built-in trigger files do.
User javascript files have access to the following globals:

- [Conditions](../resources/conditions.ts)
- [ContentType](../resources/content_type.ts)
- [NetRegexes](../resources/netregexes.ts)
- [Regexes](../resources/regexes.ts)
- [Responses](../resources/responses.ts)
- [Outputs](../resources/outputs.ts)
- [Util](../resources/util.ts)
- [ZoneId](../resources/zone_id.ts)
- [ZoneInfo](../resources/zone_info.ts)

## Debugging User Files

### Check the OverlayPlugin log for errors

The OverlayPlugin log is scrolling window of text that can be found by going to
ACT -> Plugins -> OverlayPlugin.dll,
and looking at the bottom of the window.

If there are errors, they will appear here.

### Check if your file is loaded

First, turn on debug mode for raidboss.
Go to the cactbot configuration UI,
enable `Show developer options` and reload the page.
Then, enable `Enable debug mode` under Raidboss, and reload again.

When raidboss debug mode is on,
it will print more information to the OverlayPlugin log.
It will list lines for each local user file it loads:
`[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: local user file: C:\Users\tinipoutini\cactbot\user\raidboss.js`

Verify that your user file is loaded at all.

The order that the filenames are printed is the order in which they are loaded.

### Check if your user file has errors

User files are JavaScript, and so if you write incorrect JavaScript, there will be errors
and your user file will be skipped and it will not load.
Check the OverlayPlugin log for errors when loading.

Here's an example:

```log
[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: local user file: C:\Users\tinipoutini\cactbot\user\raidboss.js (Source: file:///C:/Users/tinipoutini/cactbot/resources/user_config.ts, Line: 83)
[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: *** ERROR IN USER FILE *** (Source: file:///C:/Users/tinipoutini/cactbot/resources/user_config.ts, Line: 95)
[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: SyntaxError: Unexpected token :
    at loadUser (file:///C:/Users/tinipoutini/cactbot/resources/user_config.ts:92:28) (Source: file:///C:/Users/tinipoutini/cactbot/resources/user_config.ts, Line: 96)
```
