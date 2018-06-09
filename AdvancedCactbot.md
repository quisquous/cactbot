# Advanced Cactbot Usage

1. [Configuring UI Modules](#configuring-ui-modules)
  1. [Customizing Appearance](#customizing-appearance)
  1. [Customizing Behavior](#customizing-behavior)
  1. [Text To Speech](#text-to-speech)
  1. [Adding Custom Triggers](#adding-custom-triggers)
  1. [Regular Expression Extensions](#regular-expression-extensions)
1. [Writing a cactbot UI Module](#writing-a-cactbot-ui-module)

## Configuring UI modules

The general philosophy of cactbot is that future updates of cactbot will update files inside
the ui directory, and any user configuration should go in files in the user directory.  This
will prevent your changes from being clobbered during future cactbot updates.

All cactbot UI modules can load user settings from the [user/](user/) directory. The user/
directory already includes some example configuration files, which you can rename and use.
For example the **user/raidboss-example.js** can be renamed to **user/raidboss.js**
and edited to change the behaviour of the **raidboss** module.

If you want to do it yourself, then create a **user/\<name\>.css** or a **user/\<name\>.js**
file, where **\<name\>** is the name of the UI module, such as [raidboss](ui/raidboss) or
[jobs](ui/jobs).

After making any changes to these files, pressing the "Reload overlay" button for the
appropriate cactbot in ACT's OverlayPlugin settings will apply the changes.

### User Directory

The OverlayPlugin config panel has a text field for "Custom User Config Directory", which
lets you specify where your **cactbot/user** directory.  If you don't specify one, then
it will first try to use **../../user** relative to the overlay URL.  If that doesn't
exist, it will then look for **../cactbot/user/** relative to the **CactbotOverlay.dll**.

### Customizing Appearance

The **user/\<name\>.css** file can change positions, sizes, colors, etc. for components of
the UI module. See the **ui/\<name\>/\<name\>.css** to find the names of things you can modify.
For example in [ui/raidboss/raidboss.css](ui/raidboss/raidboss.css), you see the
`#popup-text-container` and `#timeline-container` which can be changed via **user/raidboss.css**
to different positions as desired. The size and color of info text alerts can also be changed by
making a CSS rule for the `.info-text` class such as below:

```
.info-text {
  font-size: 200%;
  color: rgb(50, 100, 50);
}
```

### Customizing Behavior

The **user/\<name\>.js** file can set options to customize how the UI module works. The
options that can be changed are documented in the `Options` section at the top of the
**ui/\<name\>/\<name\>.js** file. For example in [ui/raidboss/raidboss.js](ui/raidboss/raidboss.js),
you see the `BarExpiresSoonSeconds` option which controls when timeline bars should be
highlighted. You can change that option from the default value to 5 seconds by editing
**user/raidboss.js** to say:

```
Options.BarExpiresSoonSeconds = 5
```

To disable a text/sound alert that comes built-in for a fight, find the trigger's `id` in the files in
[ui/raidboss/data/triggers](ui/raidboss/data/triggers). Then add the `id` to the `Options.DisabledTriggers`
in the **user/raidboss.js** file, such as:

```
Options.DisabledTriggers = {
  'O4S1 Fire III': true,
}
```

### Text To Speech

If you dislike the built-in sound info, alert, and alarm noises that cactbot uses by default and would
prefer to use text to speech (tts), you can set a global option by including this line
in your **user/raidboss.js** file:

```
// Including this line will make any trigger with text to speech use that instead of other
// noises.
Options.SpokenAlertsEnabled = true;

// If you don't like the on screen text, you can turn that off with this line too:
Options.TextAlertsEnabled = false;
```

See [this options documentation](user/raidboss-example.js) for a full list of options and
how to configure text, sound, and tts options on a per trigger basis.

### Adding Custom Triggers

To add a sound alert that can be activated in any zone, for example, add the following to **user/raidboss.js**:

```
Options.Triggers = [
  { zoneRegex: /./,
    triggers: [
      // Trick Attack used.
      { regex: /:\y{Name}:\y{AbilityCode}:Trick Attack:/,
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

```
Options.Triggers = [
  // .. other zones here ..

  { zoneRegex: /./,
    triggers: [
      // .. other triggers here ..

      { regex: /:(\y{Name}) gains the effect of Forked Lightning from/,
        delaySeconds: 1,
        alertText: 'Forked Lightning: Get out',
        condition: function(data, matches) { return matches[1] == data.me; },
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
- `\y{Float}`: Matches a floating-point number, accounting for locale-specific encodings.
- `\y{Name}`: Matches any character or ability name (including empty strings which the FFXIV ACT plugin can generate when unknown).
- `\y{ObjectId}`: Matches the 8 hex character object id in network log lines.
- `\y{AbilityCode}`: Matches the FFXIV ACT plugin's format for the number code of a spell or ability.
- `\y{TimeStamp}`: Matches the time stamp at the front of each log event such as `[10:23:34.123]`.
- `\y{LogType}`: Matches the FFXIV ACT plugin's format for the number code describing the type of log event, found near the front of each log event.

See this [cactbot-user git repo](https://github.com/quisquous/cactbot-user) for more examples.



## Writing a cactbot UI module

To build a cactbot ui, you need to make a **.html** file and point cactbot at it. There are a
number of helpful things in the [resources/](resources/) directory.

Include the [resources/defaults.css](resources/defaults.css) file to get some of the default
look and feel of other cactbot uis, then use the `.text` class on any HTML elements which contain
text. You may add the `.hide` class to elements you do not want shown, and remove it when they
should be visible.

Include the [resources/resize_handle.css](resources/resize_handle.js) and
[resources/resize_handle.js](resources/resize_handle.js) files to give visual feedback to the
user when the module is unlocked for moving and resizing.

Include the [resources/unicode.js](resources/unicode.js) file to use unicode categories in
regular expressions in order to support non-english characters.

There are a number of web components that provide widgets for building your ui, including the
[timerbar](resources/timerbar.js), [timerbox](resources/timerbox.js) or
[resourcebar](resources/resourcebar.js). Include the file and then instatiate it by making an
element of that type, such as `<timer-bar></timer-bar>` or `<resource-bar></resource-bar>`.

The set of Javascript events that can be listened for via `document.addEventListener` is found
in [CactbotOverlay/JSEvents.cs](CactbotOverlay/JSEvents.cs). The public fields of each event
type will be members of the event's `detail`. See the
[ui/test/test.html](ui/test/test.html) ui module for a simple example of
listening to and using the Javascript events.
