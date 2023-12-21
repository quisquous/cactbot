# Oopsyraidsy Guide

## Overview

The goal of oopsy is to reduce time in understanding why a wipe or a death happened.
Most of the time, a death happens because somebody takes damage that they shouldn't have,
and so most of the oopsy file is about making these mistakes visible quickly.

A basic oopsy file should cover:

- abilities nobody should be hit by (e.g. a puddle on the ground)
- effects people only get when they make a mistake (e.g. bleed when walking into the edge of the arena)
- damage that should not be shared (e.g. a spread)
- damage that should not be taken alone (e.g. a stack)

Any triggers past that are usually a bonus.

See [e12s](https://github.com/OverlayPlugin/cactbot/blob/main/ui/oopsyraidsy/data/05-shb/raid/e12s.ts)
or [TOP](https://github.com/OverlayPlugin/cactbot/blob/main/ui/oopsyraidsy/data/06-ew/ultimate/the_omega_protocol.ts)
for examples of more complicated triggers.

These complicated triggers are things like:

- whose e12s icicle killed who
- whose e12s statue laser killed who
- which e12s lion cleave killed who
- TOP Looper tower mistakes
- TOP Hello World rot mistakes (extra or missing)

## Oopsy Mistake Severity

The TypeScript type `OopsyMistakeType` has all the different types of mistakes that can be made.
See: [oopsy.d.ts](https://github.com/OverlayPlugin/cactbot/blob/main/types/oopsy.d.ts#L9).
These each correspond with their own icon.
It is very subjective what you assign to each, so don't worry about it too much.

- pull: early pull mistakes
- warn: most mistakes, "you took damage you shouldn't have"
- fail: bad mistakes (subjective), "you took obviously avoidable damage like a tank cleave that probably will kill you" or "you died from something that nobody should like UCOB twisters" or "you took damage that will probably wipe the raid"
- potion: unused, intended for "you used the wrong grade potion"
- death: somebody died
- wipe: the entire party wiped
- damage: a dps mistake, e.g. somebody got a damage down or missed somebody with a raid buff
- heal: a healing mistake, e.g. somebody missed a heal or overwrote a rez
- good: unused, intended for "somebody went out of their way to do something that saved the raid"

Needless to say `warn` and `fail` are largely subjective. Don't worry about it.

## Making an Oopsy File

Oopsy files are often very quick to make, but often people just don't bother to do them.

The `util/logtools/make_timeline.ts` script has a `-la` parameter
that lists all the abilities for an encounter.
If this is filled out, then it becomes very easy to look through all the ability ids
and move the relevant ones into the oopsy file.

As an example, here is the Zeromus Extreme timeline
[ability table](https://github.com/OverlayPlugin/cactbot/blob/f15fab608d1700c7a5db6dca243dcc5b97107fab/ui/raidboss/data/06-ew/trial/zeromus-ex.txt#L142-L227)
and here is the
[oopsy file](https://github.com/OverlayPlugin/cactbot/blob/f15fab608d1700c7a5db6dca243dcc5b97107fab/ui/oopsyraidsy/data/06-ew/trial/zeromus-ex.ts)
made from that table.

## File Structure

Each file is a module that exports a single oopsy trigger set.

Most entries in the trigger set are simple maps of string ids to ability ids.
Each entry in a file must start with the same prefix (e.g. `UCU` in the file)
and must be globally unique across all oopsy trigger sets.

There's nothing magical about any of the `damageWarn` or `shareFail` categories.
They are only helpers to make it easier to make a trigger from an id,
but ultimately are just triggers themselves.
Please promote any commonly used triggers to be helpers as needed.

```typescript
import ZoneId from '../path/to/resources/zone_id';
// Other imports here.

export default {
  zoneId: ZoneId.TheUnendingCoilOfBahamutUltimate,
  zoneLabel: {
    en: 'The Unending Coil of Bahamut (Ultimate)',
  },
  damageWarn: {
    'UCU Lunar Dynamo': '26BC',
    // ...
  },
  damageFail: {
    'UCU Twister': '26AB',
    // ...
  },
  gainsEffectWarn: {
    'UCU Doom': 'D2',
    // ...
  },
  gainsEffectFail: {
    'UCU Doom': 'D2',
    // ...
  },
  shareWarn: {
    'UCU Megaflare': '26DB',
    // ...
  },
  shareFail: {
    'UCU Megaflare': '26DB',
    // ...
  },
  soloWarn: {
    'UCU Thermionic Beam': '26BD',
    // ...
  },
  soloFail: {
    'UCU Thermionic Beam': '26BD',
    // ...
  },
  triggers: [
    { /* ..trigger 1.. */ },
    { /* ..trigger 2.. */ },
    { /* ..trigger 3.. */ },
  ],
};
```

### Trigger Set Properties

**zoneId**:
A shortened name for the zone to use these triggers in.
The set of id names can be found in [zone_id.ts](../resources/zone_id.ts).
Prefer using this over zoneRegex.
A trigger set must have one of zoneId or zoneRegex to specify the zone
(but not both).

**zoneLabel**
An optional name to use for this trigger set in the configuration interface.
Overrides the zone name from [zone_info.ts](../resources/zone_info.ts).

**zoneRegex** (deprecated):
A regular expression that matches against the zone name (coming from ACT).
If the regular expression matches, then the triggers will apply to that zone.

**damageWarn** and **damageFail**:
An object contains properties like `'trigger id': 'damage action id'`,
which provides an easy way to apply triggers via damage action id (in hex).
When a player was hit by these action,
a message (default to action name) would be shown.

**damageWarn** shows the message as `warn`,
and **damageFail** shows it as `fail`.

**gainsEffectWarn** and **gainsEffectFail**:
Just like **damageWarn** and **damageFail**, but triggered when hit by an effect (id in hex).

**shareWarn** and **shareFail**:
Just like **damageWarn** and **damageFail**,
triggered when multiple players share damage which should only be on one player (e.g. spread AoE).

**soloWarn** and **soloFail**:
The opposite of **shareWarn** and **shareFail**
in that they are triggered when something that should be shared hits only one person (e.g. stack markers).

**triggers**:
An array of triggers in the trigger set.
See below for the format of each of individual triggers.

## Trigger Structure

Each trigger is an object with the following fields.  All fields are optional.
This parallels the raidboss trigger structure.

- `id`: a string representing this trigger, for use in disabling triggers.  See [oopsyraidsy-example.js](../users/oopsyraidsy-example.js).
- `condition`: function returning bool for whether or not to run this trigger.
- `netRegex`: a regex matching a network line (such as from the `NetRegexes` helper)
- `delaySeconds`: float (or function returning float) for how long to wait before executing this trigger.
- `suppressSeconds`: float (or function returning float) for how long to ignore future matches to this trigger (including additional collection).
- `deathReason`: overrides the reason that a player died if the player dies without taking any more damage.  This is for things that kill you without an obvious log line, e.g. forgetting to clear Beyond Death.
- `mistake`: returns a single mistake or an array of mistakes to add to the live list.  See below for the `mistake` format.
- `run`: function that just runs, but does not return anything

### `mistake` format

- `type` is the icon: pull, warn, fail, potion, death, wipe (:arrow_forward::warning::no_entry_sign::cocktail::skull::toilet:).
- `name` is an optional full player name to list as this mistake happening to.  This will prepend their name in the live list.
- `blame` is an optional full player name to blame for this mistake.  If `name` is not specified, then the `name` will be the `blame` player.
- `reportId` is an optional player id.  If set, it will include this mistake in that player's death report.
- `text` is an optional reason for the mistake.  It will be prepended by the blamed player's short name (if it exists).
This will print ":no_entry_sign: Latke: Dynamo" in the live log.

```typescript
mistake: (data, matches) => {
  return {
    type: 'fail',
    blame: matches.target,
    reportId: matches.targetId,
    text: 'Dynamo'
  };
},
```

### `deathReason` format

- `id` is the player id to override the death reason for.
- `name` is the full player name to override the next death reason for.
- `reason` is the string to use.

If this following trigger is used, then if a player dies without taking any other damage, the log would show ":skull: Chippy: Doom Debuff" instead of assigning it to the last damage the player took before this trigger, which might incorrectly look more like ":skull: Chippy: Auto (3034/38471)".

```typescript
deathReason: (data, matches) => {
  return {
    id: matches.targetId,
    name: matches.targetName,
    text: 'Doom Debuff',
  },
},
```

## Oopsy Trigger Function Parameters

Every function in an oopsy trigger gets two parameters: `data` and `matches` in that order.

Current hp/mp/tp values are not 100% precise.  ACT polls these values periodically and so it may be out of date by one HoT/DoT tick.  The most important consideration is that damage that does more than current hp may not actually be fatal, and vice versa that damage that does less than current hp may turn out to be fatal.  There's no way to know until the 'was defeated' message shows up two seconds later.

```typescript
{
  // 26BB is the ability id for Nael's Iron Chariot.
  netRegex: NetRegexes.ability({ id: '26BB' }),
  mistake: (_data, matches) => {
    // matches here is a single matches object
    console.log(matches.target);
  },
},
```

### Data Fields

`data` is an object that persists for an entire fight and is reset on wipe.  It is passed to every function.

`data` comes prepopulated with the following fields:

- `data.me`: string, the player's character name.
- `data.job`: string, the player's job, e.g. WAR.
- `data.role`: string, the role of the player's job: tank, healer, dps-melee, dps-ranged, dps-caster, crafting, gathering.
- `data.inCombat`: bool, whether or not the game thinks the player is in combat.  This is different than whether ACT thinks the player is in combat.
- `data.IsPlayerId`: helper function to check if a target or attacker id represents a player (vs a pet or a mob).
- `data.party`: the PartyTracker object, you can use this to check names and roles of players in the party, or to call `data.party.member(name).toString()` to get a shorter nickname or job name.

`data` is something that triggers can and should store state on, if state is needed to be tracked across multiple triggers.

For example, if you want to store a map of which players have doom or not, that could be stored in `data.hasDoom`.  This could then be used across multiple triggers.

```typescript
{
  netRegex: NetRegexes.gainsEffect({ effect: 'Doom' }),
  run: (data, matches) => {
    data.hasDoom[matches.target] = true;
  },
},
```

### Match Fields

`matches` is literally the regex match object returned from whatever regex this trigger matched.  `matches[0]` is always the full match, with other array entries being any other groups from the regex (if any).  In the case of the single event above, `matches[0] === 'Iron Chariot'`.

However, if `matches` has any groups
(which all the `Regexes` helper functions do),
then matches will be the groups field directly,
so that you can do things like `matches.target`.

## Trigger Field Evaluation Order

The full order of evaluation of functions in a trigger is:

1. `regex`
1. `disabled`
1. `condition`
1. `delaySeconds`
1. (delay happens here)
1. `suppressSeconds`
1. `mistake`
1. `deathReason`
1. `run`

## Testing Oopsy

Oopsy has a playback viewer if you want to test it without running content.

It is hosted at <https://overlayplugin.github.io/cactbot/ui/oopsyraidsy/oopsy_viewer.html>.
If you are [running locally with the webpack dev server](../CONTRIBUTING.md#validating-changes-via-webpack),
you can also use it via <https://localhost:8080/ui/oopsyraidsy/oopsy_viewer.html>.

You can drag a network log file to the the viewer and it will process and show all the mistakes.
The [troubleshooting guide](FAQ-Troubleshooting.md#how-to-find-a-network-log) has information on where to find a network log.

NOTE: any trigger with `delaySeconds` will not work, sorry. PRs welcome!

## Future Oopsy Work

Unfortunately, Oopsy is always a little bit less loved than Raidboss and so has fallen behind on features.
There's plenty of work that could be done to make it better if you want to contribute.

Easier tasks:

- Make the [Oopsy Viewer](#testing-oopsy) support `delaySeconds` properly
- create an oopsy `Util` library to collect helper functions like [these](https://github.com/OverlayPlugin/cactbot/blob/main/ui/oopsyraidsy/data/06-ew/dungeon/aloalo_island.ts) or [these](https://github.com/OverlayPlugin/cactbot/blob/main/ui/oopsyraidsy/data/06-ew/raid/p8s.ts) so that it isn't repeated
  - bonus: add support for a helper for "you took two of these", for cases where somebody is hit by two stacks
  - bonus: add support for "this person missed the stack"
- make it possible to do `netRegex: { id: '1234', source: 'Mob' }` instead of `netRegex: NetRegexes.ability({ etc })`
- make it more clear in the log when somebody has died from multiple of the same damage, e.g. `Burst x2` instead of just `Burst`

Harder tasks:

- make early pulls more exact (they are very wrong, now)
- look into network data and try to figure out what happens when there is an instant death from a death wall so that an OverlayPlugin line can be added for it
- more exact hp tracking by using [0x37](LogGuide.md#line-37-0x25-networkactionsync) lines (currently it is often very wrong)
- show which buffs are active and total mitigation for damage (this is a lot of work)
