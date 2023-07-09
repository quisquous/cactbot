# Triggers File Format

[**English**] [[简体中文](./zh-CN/RaidbossGuide.md)]

## File Structure

Each trigger file is a module that exports a single trigger set.

```javascript
import ZoneId from '../path/to/resources/zone_id';
// Other imports here.

export default {
  id: 'TheWeaponsRefrainUltimate',
  zoneId: ZoneId.TheWeaponsRefrainUltimate,
  zoneLabel: {
    en: 'The Weapon\'s Refrain (Ultimate)',
  },
  overrideTimelineFile: false,
  timelineFile: 'filename.txt',
  timeline: `hideall`,
  timelineReplace: [
  {
     locale: 'en',
     replaceText: {
      'regexSearch': 'strReplace',
     },
     replaceSync: {
      'regexSearch': 'strReplace',
     },
   },
  ],
  resetWhenOutOfCombat: true,
  triggers: [
    { /* ..trigger 1.. */ },
    { /* ..trigger 2.. */ },
    { /* ..trigger 3.. */ },
  ]
};
```

### Trigger Set Properties

**id**
A unique string to identify this trigger set.
This value should be unique among all trigger sets.
For cactbot triggers, this should generally match the `ZoneId` itself for consistency.
If there are multiple zones, then pick a reasonable string,
e.g. `'EurekaOrthosGeneral'` for the set that applies to all Eureka Orthos floors.

**zoneId**
A shortened name for the zone to use these triggers in.
The set of id names can be found in [zone_id.ts](../resources/zone_id.ts).
Prefer using this over zoneRegex.
A trigger set must have one of zoneId or zoneRegex to specify the zone
(but not both).

**zoneLabel**
An optional name to use for this trigger set in the configuration interface.
Overrides the zone name from [zone_info.ts](../resources/zone_info.ts).

**initData**
A function that can be used to initialize the data this trigger set uses.
It should return an object that sets values for any fields in `data` that need to be initialized.
This function is called any time the fight is reset, mainly on zone change or wipe.
See [t1.ts](../ui/raidboss/data/02-arr/raid/t1.ts) for an example implementation.

**zoneRegex**
A regular expression that matches against the zone name (coming from ACT).
If the regular expression matches, then the triggers will apply to that zone.

For players in CN/KR, zone names can be Chinese/Korean, though other players always see English. Your Regex should cover them. The current zone name can be found on title or main UI of ACT.

**overrideTimelineFile**
An optional boolean value that specifies that the `timelineFile` and `timeline`
specified in this trigger set override all timelines previously found.
This is a way to replace timelines in user files and is not used inside cactbot itself.

**timelineFile**
An optional timeline file to load for this zone.
Timeline files in cactbot should be named the same as the `.js` file they come from,
but with a `.txt` extension instead.
These files live alongside their parent trigger file in the appropriate folder. (As for example `raidboss/data/04-sb/raid/`).

**timeline**
Optional extra lines to include as part of the timeline.
The value may be a string or an array of strings,
or a `function(data)` that returns string or an array of strings,
or an array contains different kinds of items above.

There is a complete example that uses the **timeline** property in [test.ts](../ui/raidboss/data/00-misc/test.ts).

**locale**
Optional locale to restrict the trigger file to, e.g. 'en', 'ko', 'fr'. If not present, applies to all locales.

**replaceText**
Key:value pairs to search and replace in timeline ability names. The display name for that ability is changed, but all `hideall`, `infotext`, `alerttext`, `alarmtext`, etc all refer to the original name. This enables translation/localization of the timeline files without having to edit those files directly.

**replaceSync**
Key:value pairs to search and replace in timeline file sync expressions. Necessary if localized names differ in the sync regexes.

**resetWhenOutOfCombat**
Boolean, defaults to true. If true, timelines and triggers will reset automatically when the game is out of combat. Otherwise it's necessary to manually call `data.StopCombat()`.

## Trigger Structure

```javascript
{
  id: 'id string',
  type: 'StartsUsing',
  disabled: false,
  // Note: see `NetFields` from [net_fields.d.ts](https://github.com/quisquous/cactbot/blob/main/types/net_fields.d.ts)
  // Note: `netRegex: NetRegexes({ id: 'some-id', source: 'some-name' })` is still supported for backwards compatibility.
  netRegex: { id: 'some-id', source: 'some-name' },
  // Note: prefer to use the regex helpers from [regexes.ts](https://github.com/quisquous/cactbot/blob/main/resources/regexes.ts)
  regex: Regexes.ability({ id: 'some-id', source: 'some-name' }),
  condition: function(data, matches, output) { return true if it should run },
  preRun: function(data, matches, output) { do stuff.. },
  delaySeconds: 0,
  durationSeconds: 3,
  suppressSeconds: 0,
  promise: function(data, matches, output) { return promise to wait for resolution of },
  sound: '',
  soundVolume: 1,
  response: Responses.doSomething(severity),
  alarmText: {en: 'Alarm Popup'},
  alertText: {en: 'Alert Popup'},
  infoText: {en: 'Info Popup'},
  tts: {en: 'TTS text'},
  run: function(data, matches, output) { do stuff.. },
  outputStrings: {
    key1: { en: 'output1 ${value}'},
    key2: { en: 'output2 ${value}'},
  },
},
```

### data, matches, output

Almost all trigger fields can either return a value or a `function(data, matches, output)`.
For such functions:

- `data` is a consistent object that is passed to all triggers.
  Values can be set on it,
  and they will be there for any following functions to use.
- `matches` is the matches from the trigger,
  specifically the `matches.groups` field.
- `output` is a special object for turning fields in `outputStrings` into strings to return.
  See the `outputStrings` section below for more info.
  For triggers that return numbers, e.g. `delaySeconds` or `durationSeconds` and
  for triggers that don't output anything, e.g. `preRun` or `run`,
  the output field is largely meaningless.

### Trigger Properties

**id string**
 An id string for the trigger.
 Every built-in trigger in cactbot has a unique id,
 and it is recommended but not required that user triggers also have them.

Trigger ids must be unique.
If a trigger is found with the same id as a previous trigger,
then the first trigger will be skipped entirely
and the second trigger will override it and take its place.
This allows easier for copying and pasting of triggers into user overrides for edits.
Triggers without ids cannot be overridden.

The current structure for `Regexes/NetRegexes` does not require that the ability/effect/whatever name be present as part of the expression.
Because of this, it is extremely important that that information is somewhere close by.
Recommended practice is either to have the effect/ability/NPC name in the trigger ID itself,
or in an explanatory comment alongside. Context solely from the trigger body is not necessarily sufficient!
(As with the id, only triggers intended for the cactbot repository must have this information.)

**disabled: false**
If this is true, the trigger is completely disabled and ignored.
Defaults to false.

**netRegex / regex**
The regular expression cactbot will run against each log line
to determine whether the trigger will activate.
The `netRegex` version matches against network log lines,
while the `regex` version matches against parsed ACT log lines.

More commonly, however, a regex replacement is used instead of a bare regex.
Helper functions defined in [regexes.ts](https://github.com/quisquous/cactbot/blob/main/resources/regexes.ts)
and in [netregexes.ts](https://github.com/quisquous/cactbot/blob/main/resources/netregexes.ts)
take the parameters that would otherwise be extracted via match groups.
From here, the functions automatically construct the regex that should
be matched against.
Unsurprisingly, for `netRegex` use the `NetRegexes` helper
and for `regex` use the `Regexes` helper.

`regex` and `netRegex` lines are auto-translated using the `timelineReplace` section.

**condition: function(data, matches, output)**
Activates the trigger if the function returns `true`.
If it does not return `true`, nothing is shown/sounded/run.
If multiple functions are present on the trigger, this has first priority to run.
(Pre-made "canned" conditions are available within [conditions.ts](https://github.com/quisquous/cactbot/blob/main/resources/conditions.ts).
Generally speaking it's best to use one of these if it fits the situation.)

**preRun: function(data, matches, output)**
If the trigger activates, the function will run as the first action after the activation condition is met.

**delaySeconds**
An amount of time, in seconds, to wait from the time the regex match is detected until the trigger activates.
May be a number or a `function(data, matches, output)` that returns a number.
This runs after `preRun` and before the `promise`.

**promise: function(data, matches, output)**
If present and a function which returns a promise,
will wait for promise to resolve before continuing with trigger.
This runs after the delay from `delaySeconds`.

**durationSeconds**
Time, in seconds, to display the trigger text.
May be a number or a `function(data, matches, output)` that returns a number. If not specified, defaults to 3.

**suppressSeconds**
Time to wait, in seconds, before showing this trigger again.
May be a number or a `function(data, matches, output)`.
The time to wait begins at the time of the initial regex match
and is unaffected by presence or absence of a delaySeconds value.
Once a trigger with this element activates,
it will not activate again until after its timeout period is over.

**sound**
Sound file to play, or one of 'Info', 'Alert', 'Alarm', or 'Long'.
Paths to sound files are relative to the ui/raidboss/ directory.

**soundVolume**
Volume between 0 and 1 to play the sound associated with the trigger.

**response**
A way to return infoText/alertText/alarmText/tts all from a single entrypoint.
Also used by `resources/responses.ts`.
Response has less priority than an explicitly specified text or tts,
and so can be overridden.
(As with `regex` and `condition`, "canned" responses are available within [responses.ts](https://github.com/quisquous/cactbot/blob/main/resources/responses.ts).)

**alarmText**
Displays a text popup with Alarm importance when the trigger activates.
This is for high-priority events where failure is guaranteed to kill you,
is likely to wipe the encounter,
or will otherwise make successful completion much more difficult.
(Examples include Allagan Rot in T2, Cursed Shriek in T7, or Ultros' Stoneskin cast in O7s.)
May be a string or a `function(data, matches, output)` that returns a string.

**alertText**
Displays a text popup with Alert importance when the trigger activates.
This is for medium-priority events that might kill you,
or inflict party-wide damage/debuffs.
(For example, warning the main tank that a buster is incoming, or warning the entire party of an upcoming knockback.)
May be a string or a `function(data, matches, output)` that returns a string.

**infoText**
Displays a text popup with Info importance when the trigger activates.
This is for low-priority events that will be merely annoying if not attended to immediately.
(For example, warning of an add spawn, or informing healers of incoming raid damage.)
May be a string or a `function(data, matches, output)` that returns a string.

**tts**
An alternative text string for the chosen TTS option to use for callouts.
This can be a localized object just like the text popups.
If this is set, but there is no key matching your current language,
Raidboss will default to the text from the text popups.

For example, consider this configuration:

```typescript
{
  ...
  infoText: {
    en: 'Tank Buster',
    de: 'AoE',
    fr: 'Cleave',
  },
  tts: {
    de: 'Spread',
  },
}
```

If your language is `en`, you will receive the `Tank Buster` message.
If your language is `de`, you will receive the `Spread` message.

**run: function(data, matches, output)**
If the trigger activates, the function will run as the last action before the trigger ends.

**outputStrings**
`outputStrings` is an optional indirection
so that cactbot can provide customizable UI for overriding trigger strings.
If you are writing your own triggers, you don't need to use this,
and you can just return strings directly from output functions
like `alarmText`, `alertText`, `infoText`, etc.

The `outputStrings` field is an object mapping `outputStrings` keys to translatable objects.
These translatable objects should have a string entry per language.
In the string, you can use `${param}` constructions to allow for functions to pass variables in.

Here are two example `outputStrings` entries for a tank buster:

```javascript
outputStrings: {
  noTarget: {
    en: 'Tank Buster',
    de: 'Tank buster',
    fr: 'Tank buster',
    ja: 'タンクバスター',
    cn: '坦克死刑',
    ko: '탱버',
  },
  onTarget: {
    en: 'Tank Buster on ${name}',
    de: 'Tank buster auf ${name}',
    fr: 'Tank buster sur ${name}',
    ja: '${name}にタンクバスター',
    cn: '死刑 点 ${name}',
    ko: '"${name}" 탱버',
  },
},
```

`noTarget` and `onTarget` are the two keys for the `outputStrings`.

Here's an example using these `outputStrings`, passing parameters to the `onTarget` version:

```javascript
alarmText: (data, matches, output) => {
  return output.onTarget({ name: matches.target });
},
```

Calling `output.onTarget()` finds the string in `outputStrings.onTarget` for the current language.
For each `param` passed in, it replaces `${param}` in the string with the value.
Then it returns the replaced string for `alarmText` to use.

Similarly, this is another trigger example, without any parameters.

```javascript
infoText: (data, matches, output) => {
  return output.noTarget();
},
```

Triggers that use `response` with `outputStrings` are slightly different.
`outputStrings` should not be set on the trigger itself,
and instead `response` should return a function that calls
`output.responseOutputStrings = {};`
where `{}` is the outputStrings object you would have returned from the trigger `outputStrings` field.
This is a bit awkward, but allows response to both return and use `outputStrings`,
and keeps [resources/responses.ts](../resources/responses.ts) more encapsulated.

For example:

```javascript
response: (data, matches, output) => {
  output.responseOutputStrings = { text: { en: 'Some Text: ${words}' } };
  return {
    alarmText: output.text({ words: 'words word words' }),
  };
},
```

## Miscellaneous Trigger Info

Any field that can return a function (e.g. `infoText`, `alertText`, `alarmText`, `tts`)
can also return a localized object,
e.g. instead of returning 'Get Out',
they can return {en: 'Get Out', fr: 'something french'} instead.
Fields can also return a function that return a localized object as well.
If the current locale does not exist in the object, the 'en' result will be returned.

If multiple triggers match the same log line,
they will be executed sequentially based on their order in the relevant zone file.

Trigger elements are evaluated in this order, and must be listed in this order:

- id
- disabled
- netRegex
- regex
- beforeSeconds (for timelineTriggers)
- (suppressed triggers early out here)
- condition
- preRun
- delaySeconds
- durationSeconds
- suppressSeconds
- (the delaySeconds occurs here)
- promise
- (awaiting the promise occurs here)
- sound
- soundVolume
- response
- alarmText
- alertText
- infoText
- tts
- run
- outputStrings

## Regular Expression Extensions

If you're familiar with regular expressions,
you'll note the the `\y{Name}` and `\y{AbilityCode}` are unfamiliar.
These are extensions provided by cactbot for convenience
to avoid having to match against all possible unicode characters
or to know the details of how the FFXIV ACT plugin writes things.

The set of extensions are:

- `\y{Float}`: Matches a floating-point number, accounting for locale-specific encodings.
- `\y{Name}`: Matches any character name (including empty strings which the FFXIV ACT plugin can generate when unknown).
- `\y{ObjectId}`: Matches the 8 hex character object id in network log lines.
- `\y{AbilityCode}`: Matches the FFXIV ACT plugin's format for the number code of a spell or ability.
- `\y{Timestamp}`: Matches the time stamp at the front of each log event such as `[10:23:34.123]`.
- `\y{LogType}`: Matches the FFXIV ACT plugin's format for the number code describing the type of log event, found near the front of each log event.

## Canned Helper Functions

In order to unify trigger construction and reduce the manual burden of translation,
cactbot makes widespread use of "canned" trigger elements.
Use of these helpers makes automated testing significantly easier,
and allows humans to catch errors and inconsistencies more easily when reviewing pull requests.

Currently, three separate elements have pre-made structures defined:
[Condition](https://github.com/quisquous/cactbot/blob/main/resources/conditions.ts), [Regex](https://github.com/quisquous/cactbot/blob/main/resources/regexes.ts), [NetRegex](https://github.com/quisquous/cactbot/blob/main/resources/netregexes.ts), and [Response](https://github.com/quisquous/cactbot/blob/main/resources/responses.ts).
`Condition` functions take no arguments. Almost all `Response` functions take one optional argument, `severity`,
used to determine what level of popup text to display to the user when the trigger activates.
`Regex`(`NetRegex`) functions can take several arguments [(`gainsEffect()` is a good example)](https://github.com/quisquous/cactbot/blob/0bd9095682ec15b35f880d2241be365f4bdf6a87/resources/regexes.ts#L348) depending on which log line is being matched against,
but generally a contributor would include the `source`, (name of the caster/user of the ability to match,)
the `id`, (the hex ability ID, such as `2478`,) and whether or not the regex should capture the matches (`capture: false`.)
`Regex`(`NetRegex`) functions capture by default, but standard practice is to specify non-capturing unless a trigger element requires captures.

A sample trigger that makes use of all these elements:

```javascript
{
  id: 'TEA Mega Holy Modified',
  netRegex: NetRegexes.startsUsing({ source: 'Alexander Prime', id: '4A83', capture: false }),
  condition: Conditions.caresAboutMagical(),
  response: Responses.bigAoe('alert'),
},
```

This is far less verbose than:

```javascript
{
  id: 'TEA Mega Holy Modified',
  netRegex: /^(?:20)\|(?:[^|]*)\|(?:[^|]*)\|(?:Alexander Prime)\|(?:4A83)\|/i,
  condition: function(data) {
    return data.role == 'tank' || data.role == 'healer' || data.CanAddle();
  },
  alertText: {
    en: 'big aoe!',
    de: 'Große AoE!',
    fr: 'Grosse AoE !',
    ja: '大ダメージAoE',
    cn: '大AoE伤害！',
    ko: '강한 전체 공격!',
  },
},
```

Use of bare regexes is deprecated. *Always* use the appropriate canned function unless there is a very specific
reason not to. Attempting to use a bare regex will cause a build failure when the pull request is submitted.
If a bare regex must be used for whatever reason (if, say, a new log line is added to ACT,)
pull requests to update `regexes.ts` are strongly encouraged.

(Note that if you are writing triggers for just your personal use, you are free to do what you want.
This deprecation applies only to work intended for the cactbot repository.)

Use of canned conditions and responses is recommended where possible, although
given Square's extremely talented fight design team, it's not always going to *be* possible.

## Outputs

In order to reduce duplications across trigger sets,
cactbot has a set of locale strings that includes text repeatedly used by triggers.
When writing triggers, prefer using `Outputs` if possible to avoid duplication.

A simple example using `outputStrings` and `Outputs` as below:

```javascript
{
  id: 'E9S Zero-Form Devouring Dark',
  netRegex: NetRegexes.startsUsing({ id: '5623', source: 'Cloud Of Darkness' }),
  durationSeconds: 4,
  alertText: function(data, matches, output) {
    if (data.me === matches.target)
      return output.tankBusterOnYou();

    if (data.role === 'tank')
      return output.tankSwap();

    if (data.role === 'healer')
      return output.tankBusters({ player: data.ShortName(matches.target) });
  },
  infoText: function(data, _matches, output) {
    if (data.role !== 'tank' && data.role !== 'healer')
      return output.avoidLaser();
  },
  outputStrings: {
    tankBusterOnYou: Outputs.tankBusterOnYou,
    tankBusters: Outputs.tankBusters,
    tankSwap: Outputs.tankSwap,
    avoidLaser: {
      en: 'Avoid Laser',
      de: 'Laser ausweichen',
      fr: 'Évitez le laser',
      ja: 'レーザー注意',
      cn: '躲避击退激光',
      ko: '레이저 피하기',
    },
  },
},
```

## Timeline Info

The trigger subfolders may contain timeline text files in the format defined by ACT Timeline plugin, which described in here:
<http://dtguilds.enjin.com/forum/m/37032836/viewthread/26353492-act-timeline-plugin>

Each timeline file Cactbot uses has to be loaded by a relative directory reference from the given [TRIGGER-FILE].js. Typically the filename for the timeline file will match the name of the trigger file, and for specific encounters the filenames should at least loosely match the zone name.

Cactbot implements some extensions to the original format. These extensions can appear in the file
itself or in the `timeline` field in the triggers:

**infotext "event name" before 1**
Show a info-priority text popup on screen before an event will occur. The `event name` matches a timed event in the file and will be shown before each occurrence of events with that name. By default the name of the event will be shown, but you may specify the text to be shown at the end of the line if it should be different. The `before` parameter must be present, but can be 0 if the text should be shown at the same time the event happens. Negative values can be used to show the text after the event.

**Example infotext which shows the event name 1s before the event happens**
`infotext "event name" before 1`

**Example infotext which specifies different text to be shown earlier**
`infotext "event name" before 2.3 "alternate text"`

**Example alert-priority popups using the same parameters**
`alerttext "event name" before 1`
`alerttext "event name" before 2.3 "alternate text"`

**Example alarm-priority popups using the same parameters**
`alarmtext "event name" before 1`
`alarmtext "event name" before 2.3 "alternate text"`

## Translation Overview

This section mostly applies to raidboss (and so is in this document),
but the parts about code translation apply to all parts of cactbot.

Most cactbot developers play FFXIV in English,
and so any PRs to translate anything missing is much appreciated.
If you need help using github or git, please ask.

Running `npm run coverage-report` will generate the cactbot coverage report,
which can be found online [here](https://quisquous.github.io/cactbot/util/coverage/coverage.html).

This report includes links to all of the missing translations:

- [missing_translations_de.html](https://quisquous.github.io/cactbot/util/coverage/missing_translations_de.html)
- [missing_translations_fr.html](https://quisquous.github.io/cactbot/util/coverage/missing_translations_fr.html)
- [missing_translations_ja.html](https://quisquous.github.io/cactbot/util/coverage/missing_translations_ja.html)
- [missing_translations_cn.html](https://quisquous.github.io/cactbot/util/coverage/missing_translations_cn.html)
- [missing_translations_ko.html](https://quisquous.github.io/cactbot/util/coverage/missing_translations_ko.html)

TODO: it'd be nice if we could mark cn/ko fights that haven't been released yet as not needing text/sync translations.

You can run `npm run util` and select find translations using the ui.
You can also run `npm run util -- findTranslations -f . -l fr`
(or `-l de` or `-l cn` etc)
if you don't want to select options manually.
This script generates the same information that the online version has.

These reports have several different categories of errors:

- other: general miscellaneous errors, usually not related to any line
- code: a block of TypeScript code is missing a translation
- sync: a trigger or a timeline `sync /something/` line is missing a translation
- text: timeline text (e.g. `2.0 "text"`) is missing a translation

### Code Translations

Most bits of code in cactbot use `LocaleText` for any piece of text
that needs to be translated.

This ends up looking like an object with keys for each language,
in the order `en`, `de`, `fr`, `ja`, `cn`, `ko`.
Tests will complain if you put them in a different order.
This order is "English first", then "alphabetical for the international version",
and finally "alphabetical for the other regional versions".
English is always required.

Here's an example,
where the missing translation report for Japanese says this: `ui/oopsyraidsy/data/06-ew/raid/p4n.ts:78 [code] text: {`.
The `text: {` part of the line is the beginning of the code that is missing the translation.
The html report links above have links to the code directly.

This example corresponds to [code](https://github.com/quisquous/cactbot/blob/e47d34b/ui/oopsyraidsy/data/06-ew/raid/p4n.ts#L78-L84) like this:

```typescript
          text: {
            en: 'DPS Tower',
            de: 'DD-Turm',
            fr: 'Tour DPS',
            cn: 'DPS塔',
            ko: '딜러 장판',
          },
```

As you can see, this object is missing the `ja` key and needs somebody to add it in.

### Raidboss Translations

For `sync` and `text` errors,
these must be fixed using the (now poorly named) `timelineReplace` section.
(Once upon a time, this was only for timeline translations.
Now it also handles trigger `netRegex` and `regex` translations as well.
However, for backwards compatibility it's still called `timelineReplace`.)

It looks something like this:

```typescript
    {
      'locale': 'fr',
      'replaceSync': {
        'Kokytos\'s Echo': 'spectre de Cocyte',
        'Kokytos(?!\')': 'Cocyte',
        // etc
      },
      'replaceText': {
        'Aero IV': 'Giga Vent',
        'Archaic Demolish': 'Démolition archaïque',
        // etc
      },
    },
```

The `replaceSync` section applies to `sync /etc/` parts of lines in the timeline file,
as well as any fields in `netRegex` lines in the trigger file.
The `replaceText` section only applies to the `"Text"` part of lines in the timeline file.
All matches are case insensitive.

Internally, cactbot takes the `timelineReplace` section and applies it (logically) like this,
so that timelines and triggers will work in French:

```diff
# p9s.txt timeline file
-168.7 "Archaic Demolish" sync / 1[56]:[^:]*:Kokytos:816D:/
+168.7 "Démolition archaïque" sync / 1[56]:[^:]*:Cocyte:816D:/
```

```diff
     // p9s.ts trigger file
     {
       id: 'P9S Archaic Demolish',
       type: 'StartsUsing',
-      netRegex: { id: '816D', source: 'Kokytos', capture: false },
+      netRegex: { id: '816D', source: 'Cocyte', capture: false },
       alertText: (_data, _matches, output) => output.healerGroups!(),
       outputStrings: {
         healerGroups: Outputs.healerGroups,
       },
     },
```

#### Common Replacements

To avoid having to repeat common translations,
the [common_replacement.ts](https://github.com/quisquous/cactbot/blob/main/ui/raidboss/common_replacement.ts)
file has a `export const commonReplacement` variable with common `replaceSync` and `replaceText` entries
that are implicitly added to all raidboss trigger sets.

There is no need to repeat these entries (and `npm run test` will give you an error if you try to.)

#### Collisions

One important part of translations is that there is NO guaranteed ordering
of how entries in the `replaceSync` and `replaceText` sections are applied.
The reason for this is that it makes it conceptually easier to review a
translation section as for any given substring of text,
at most one entry will apply to it.

To make this possible,
there's a bunch of "collision" tests in cactbot to make sure that translation entries
don't collide and try to translate the same piece of text differently.
These tests are probably a great source of frustration to people writing translations,
but it prevents a lot of bugs.

If you have translations but get stuck on errors,
please upload your translation PR with errors and ask for help.

#### Pre-translation Collision

One error that `npm run test` might give you is a "pre-translation collision".
This means that two entries in the `replaceSync` or `replaceText` section
both apply to the same text AND cannot be applied in either order.

Here's a p9s example again, slightly modified.

```typescript
    {
      'locale': 'fr',
      'replaceSync': {
        'Kokytos\'s Echo': 'spectre de Cocyte',
        'Kokytos': 'Cocyte',
        // etc
      },
    },
```

Let's say we're trying to translate `Kokyto's Echo`.
Both of these entries match,
so there's two orders that these two translations could apply.
We can replace `Koktytos` and then `Kokyto's Echo` or vice versa.

If we apply `Kokyto's Echo` first, then `Kokyto's Echo` becomes `spectre de Cocyte`,
and then the `Kokytos` translation no longer applies. This is a correct translation.
However, if we apply `Kokytos` first, then `Kokyto's Echo` becomes `Cocyte's Echo`,
and then the `Kokyto's Echo` translation no longer applies, but this is wrong!

You can see here that applying these translations in different orders produces different results,
which is why there's a pre-collision test error.

The way to fix this is to use regular expression
"negative lookahead" `(?!text)` or "negative lookbehind" `(?<text)`
to say that it only matches things that are not preceeded or following
a particular piece of text.
See [this link](https://www.regular-expressions.info/lookaround.html) for more details.

In this case, you can change `'Kokytos'` to `'Kokytos(?!\')'`.
This regex says "match Kokytos, but not if there is a hyphen afterwards".
By doing this, there is no longer an ordering dependency.

One side note, is that it is possible to have multiple translations apply to the same text without collision.
For example, if you have `Front / Back` and a separate translation for `Front` and one for `Back`,
then it does not matter which order you apply those translations in,
because you will end up with the same result.
In this case, there is no pre-translation collision.

#### Post-translation Collision

A post-translation collision is one where after one translation entry has been applied,
then another (possibly the same) translation entry can suddenly apply to the new translated text that will translate it differently.
This is another ordering dependency that we want to avoid.
This is generally more rare,
because it often means that a non-English translation matches an English word
or the same translation applies multiple times.

Here's a partially made-up example of a post-translation collision.

```typescript
    {
      'locale': 'de',
      'replaceText': {
        'Time Explosion': 'Zeiteruption',
        'Eruption': 'Ausbruch',
      },
    },
```

Once `Time Explosion` is translated `Zeiteruption`,
then the `Eruption` translation can now apply to it,
turning it into the incorrect `ZeitAusbruch`.
(Remember that all matches are case insensitive.)
This collision could be fixed by making it `'(?<!t)Eruption': 'Ausbruch'`,
in other words `Eruption` that is not preceded by the letter t.

Here's one example of a potential post-translation collision of a trigger with itself: `'Bomb': 'Bombe'`.
`Bomb` re-matches the translated version `Bombe`, and so needs to be `'Bomb(?!e)': 'Bombe'` instead.
It is true that translations are only applied once, but this is still considered a post-translation error.

One side note here is that `'Ultima': 'Ultima'` looks like a post-translation collision,
however there's a special case for a "translation" that doesn't do anything.
The reason these kinds of "do nothing" translations exist are to mark these texts as "having been translated"
and so they are not collected by the find missing translation script.

#### missingTranslations field

The `timelineReplace` section also has a `missingTranslations` field, which defaults to false.
If a particular section exists and it does not have all translations,
this field needs to be set to `true` (and `npm run test` will complain if not).
This often happens when somebody adds additional lines to the timeline
or additional triggers with new combatants that are not translated.
This is an indicator to translators that work needs to be done here.

The other reason for this is once a fight has reached a point of being completedly translated for a language,
and somebody adds a typo in a text or a sync,
the tests will catch that error because it expects that there are no missing translations for that language.

It is not an `npm run test` error to have `missingTranslations: true` when it is not needed,
but this error will show up in the find missing translations script and should be cleaned up if possible.
