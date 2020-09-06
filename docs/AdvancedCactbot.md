# Advanced Cactbot Usage

1. [User Folder Config Overrides](#user-folder-config-overrides)
    1. [User Directory](#user-directory)
    1. [Customizing Appearance](#customizing-appearance)
    1. [Customizing Behavior](#customizing-behavior)
    1. [Per Trigger Options](#per-trigger-options)
    1. [Adding Custom Triggers](#adding-custom-triggers)
    1. [Regular Expression Extensions](#regular-expression-extensions)
1. [Writing a cactbot UI Module](#writing-a-cactbot-ui-module)

## User Folder Config Overrides

Many settings of cactbot can be changed from inside of ACT,
using the config tool.
This can be found by going to
Plugins -> OverlayPlugin.dll -> Cactbot Event Source,
and then clicking on options there.

These options are stored in your
`%APPDATA%\Advanced Combat Tracker\Config\RainbowMage.OverlayPlugin.config.json`
file.

WARNING: files inside of your user directory will silently overwrite settings
that were set from the config tool inside of ACT.
This can be confusing,
so it's generally preferable to let the config tool set everything you can,
and only use user files in order to set things that the config tool does not
provide access to.

The general philosophy of cactbot is that
future updates of cactbot will update files inside the ui directory,
and any user configuration should go in files in the user directory.
This will prevent your changes from being clobbered during future cactbot updates.

All cactbot UI modules can load user settings from the [user/](../user/) directory.
The user/ directory already includes some example configuration files,
which you can rename and use.
For example the **user/raidboss-example.js** can be renamed to **user/raidboss.js**
and edited to change the behavior of the **raidboss** module.

If you want to do it yourself,
then create a **user/\<name\>.css** or a **user/\<name\>.js** file,
where **\<name\>** is the name of the UI module,
such as [raidboss](../ui/raidboss) or [jobs](../ui/jobs).

After making any changes to these files,
pressing the "Reload overlay" button
for the appropriate cactbot in ACT's OverlayPlugin settings will apply the changes.

### User Directory

The OverlayPlugin config panel has a text field for "Custom User Config Directory", which
lets you specify where your **cactbot/user** directory.  If you don't specify one, then
it will first try to use **../../user** relative to the overlay URL.  If that doesn't
exist, it will then look for **../cactbot/user/** relative to the **CactbotOverlay.dll**.

### Customizing Appearance

The **user/\<name\>.css** file can change positions, sizes, colors, etc. for components of
the UI module. See the **ui/\<name\>/\<name\>.css** to find the names of things you can modify.
For example in [ui/raidboss/raidboss.css](../ui/raidboss/raidboss.css), you see the
`#popup-text-container` and `#timeline-container` which can be changed via **user/raidboss.css**
to different positions as desired. The size and color of info text alerts can also be changed by
making a CSS rule for the `.info-text` class such as below:

```css
.info-text {
  font-size: 200%;
  color: rgb(50, 100, 50);
}
```

### Customizing Behavior

The **user/\<name\>.js** file can set options to customize how the UI module works. The
options that can be changed are documented in the `Options` section at the top of the
**ui/\<name\>/\<name\>.js** file. For example in [ui/raidboss/raidboss.js](../ui/raidboss/raidboss.js),
you see the `BarExpiresSoonSeconds` option which controls when timeline bars should be
highlighted. You can change that option from the default value to 5 seconds by editing
**user/raidboss.js** to say:

```javascript
Options.BarExpiresSoonSeconds = 5
```

To disable a text/sound alert that comes built-in for a fight, find the trigger's `id` in the files in
[ui/raidboss/data/triggers](../ui/raidboss/data/triggers). Then add the `id` to the `Options.DisabledTriggers`
in the **user/raidboss.js** file, such as:

```javascript
Options.DisabledTriggers = {
  'O4S1 Fire III': true,
}
```

### Per Trigger Options

If you want to customize when and what triggers say, there are a few options.
For example, you want to change how the twisters callout works in ucob.
To start, look up the id for the trigger in the [triggers file](../ui/raidboss/data/04-sb/ultimate/unending_coil_ultimate.js#L139).
This is `UCU Twisters`.
The `zoneId` for this zone is at the top of this file, and is `zoneId: ZoneId.TheUnendingCoilOfBahamutUltimate,`.

#### Option 1: disable the original, write your own

Add the following code to your **user/raidboss.js** file.  If you have other existing disabled triggers or triggers, you will need to splice these additions in.

This option disables the original twisters trigger and adds a second trigger that just says `Panic!` instead.  The gives you maximum flexibility, but the downside of this approach is that if the trigger regex ever changes, then when cactbot updates, you will need to update your custom trigger as well.  Note that this is fairly unlikely.

```javascript
Options.DisabledTriggers = {
  'UCU Twisters': true,
};
Options.Triggers = [
  {
    zoneId: ZoneId.TheUnendingCoilOfBahamutUltimate,
    triggers: [
      {
        regex: Regexes.ability({ source: 'Twintania', id: '26AA' }),
        alarmText: 'Panic!',
      },
    ],
  },
];
```

#### Option 2: per trigger options to modify/override behavior

The other option is to use per trigger options.  These override the existing trigger behaviors, without needing to disable the original trigger.

The [user/raidboss-example.js](../user/raidboss-example.js#L198) file has some examples of how to do this.

If you wanted to change the twister cast to say `Panic!` as above, you would do the following:

```javascript
Options.PerTriggerOptions = {
  'UCU Twisters': {
    'AlertText': '',
    'AlarmText': 'Panic!',
  },
};
```

The fields that are valid on PerTriggerOptions are the following:

* `GroupSpeechAlert`: boolean, turn on or off group tts texts
* `SpeechAlert`: boolean, turn on or off tts texts
* `SoundAlert`: boolean, turn on or off sounds
* `TextAlert`: boolean, turn on or off on screen text

* `AlarmText`: function, the string to show as alarm text
* `AlertText`: function, the string to show as alert text
* `InfoText`: function, the string to show as info text
* `TTSText`: function, the string to play as tts text
* `GroupTTSText`: function, the string to play for group tts text
* `SoundOverride`: function, the path to the sound to play for this trigger
* `VolumeOverride`: function, 0-1 value for how loud to play the sound at

All of the functions in the above list override the previous values if they exist.  So, if the trigger has an `alertText` entry and the option specifies an `AlertText` (even if empty), then it will not play.  This is what the example does for twisters above.

### Adding Custom Triggers

To add a sound alert that can be activated in any zone, for example, add the following to **user/raidboss.js**:

```javascript
Options.Triggers = [
  {
    zoneId: ZoneId.MatchAll,
    triggers: [
      // Trick Attack used.
      {
        regex: Regexes.ability({ ability: 'Trick Attack' }),
        sound: '../../resources/sounds/WeakAuras/RoaringLion.ogg',
      },

      .. other triggers here ..
    ],
  },

  // .. other zones here ..
]
```

A more sophisticated example that shows an alert message after a 1 second delay, but
only when the player's character name appears in the FFXIV log message:

```javascript
Options.Triggers = [
  // .. other zones here ..

  {
    zoneId: ZoneId.MatchAll,
    triggers: [
      // .. other triggers here ..

      {
        regex: Regexes.gainsEffect({ effect: 'Forked Lightning' }),
        delaySeconds: 1,
        alertText: 'Forked Lightning: Get out',
        condition: function(data, matches) { return matches.target == data.me; },
      },

      // .. other triggers here ..
    ],
  },

  // .. other zones here ..
]
```

### Regular Expression Extensions

If you're familiar with regular expressions you'll note the the `\y{Name}` and
`\y{AbilityCode}` are unfamiliar. These are extensions provided by cactbot for
convenience to avoid having to match against all possible unicode characters
or to know the details of how the FFXIV ACT plugin writes things.

The set of extensions are:

* `\y{Float}`: Matches a floating-point number, accounting for locale-specific encodings.
* `\y{Name}`: Matches any character or ability name (including empty strings which the FFXIV ACT plugin can generate when unknown).
* `\y{ObjectId}`: Matches the 8 hex character object id in network log lines.
* `\y{AbilityCode}`: Matches the FFXIV ACT plugin's format for the number code of a spell or ability.
* `\y{Timestamp}`: Matches the time stamp at the front of each log event such as `[10:23:34.123]`.
* `\y{LogType}`: Matches the FFXIV ACT plugin's format for the number code describing the type of log event, found near the front of each log event.

See this [cactbot-user git repo](https://github.com/quisquous/cactbot-user) for more examples.

## Writing a cactbot UI module

To build a cactbot ui, you need to make a **.html** file and point cactbot at it. There are a
number of helpful things in the [resources/](../resources/) directory.

Include the [resources/defaults.css](../resources/defaults.css) file
to get some of the default look and feel of other cactbot uis.
You can use the `.text` class on any HTML elements which contain text.
You may add the `.hide` class to elements you do not want shown,
and remove it when they should be visible.
This will also include borders, background colors, and text when unlocked.

Include the [resources/unicode.js](../resources/unicode.js) file to use unicode categories in
regular expressions in order to support non-english characters.

There are a number of web components that provide widgets for building your ui, including the
[timerbar](../resources/timerbar.js), [timerbox](../resources/timerbox.js) or
[resourcebar](../resources/resourcebar.js). Include the file and then instantiate it by making an
element of that type, such as `<timer-bar></timer-bar>` or `<resource-bar></resource-bar>`.

The set of Javascript events that can be listened for via `document.addEventListener` is found
in [plugin/CactbotEventSource/JSEvents.cs](../plugin/CactbotEventSource/JSEvents.cs). The public fields of each event
type will be members of the event's `detail`. See the
[ui/test/test.html](../ui/test/test.html) ui module for a simple example of
listening to and using the Javascript events.
