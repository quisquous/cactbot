# Oopsy Raidsy Trigger Format

## Oopsy File Format

Each file in this directory should be valid JavaScript and should be listed in **manifest.txt**.

Each file should look something like this:

```
[{
  zoneRegex: /match for the zone/,
  triggers: [
    { /* ..trigger 1.. */ },
    { /* ..trigger 2.. */ },
    { /* ..trigger 3.. */ },
  ]
},
{
  zoneRegex: /match for another zone/,
  triggers: [
    { /* ..trigger 1.. */ },
    { /* ..trigger 2.. */ },
    { /* ..trigger 3.. */ },
  ]
}]
```
Each file should evaluate to an array of trigger sets.  A trigger set has a `zoneRegex` that matches against the current zone for whether all of its triggers should be applied.  If the zone matches, then the triggers will be valid in that zone, otherwise ignored.  `triggers` holds an array of triggers in the trigger set.  See below for the
format of each of individual triggers.

## Oopsy Trigger format

Each trigger is an object with the following fields.  All fields are optional.

* `id`: a string representing this trigger, for use in disabling triggers.  See **user/oopsyraidsy-example.js**.
* `condition`: function returning bool for whether or not to run this trigger.
* `regex`: regex matching the whole line.
* `damageRegex`: regex that will only match the ids of abilities that do damage.
* `healRegex`: regex that only matches the ids of healing abilities.
* `gainsEffectRegex`: regex that matches gaining effects by name.
* `losesEffectRegex`: regex that matches loses any effects by name.
* `abilityRegex`: regex that matches the ids of any type of ability.
* `collectSeconds`: float (or function returning float) 
* `delaySeconds`: float (or function returning float) for how long to wait before executing this trigger.  Ignored if `collectSeconds > 0`.
* `deathReason`: overrides the reason that a player died if the player dies without taking any more damage.  This is for things that kill you without an obvious log line, e.g. forgetting to clear Beyond Death.
* `mistake`: returns a single mistake or an array of mistakes to add to the live list.  See below for the `mistake` format.
* `run`: function that just runs, but does not return anything

### `mistake` format

* `type` is the icon: pull, warn, fail, potion, death, wipe (:arrow_forward::warning::no_entry_sign::cocktail::skull::toilet:).
* `name` is an optional full player name to list as this mistake happening to.  This will prepend their name in the live list.
* `blame` is an optional full player name (or array of full player names) to blame for this mistake.  If `name` is not specified, then the `name` will be the `blame` player.
* `text` is an optional reason for the mistake.  It will be prepended by the blamed player's short name (if it exists).
* `fullText` if it exists will be the entire text of the line, regardless of who is blamed.

This will print ":no_entry_sign: Latke: Dynamo" in the live log.
```
mistake: function(event, data, matches) {
  return {
    type: 'fail',
    blame: e.targetName,
    text: 'Dynamo'
  };
},
```

This will print ":warning: WHOOPS" in the live log, even though a player was blamed.
```
mistake: function(event, data, matches) {
  return {
    type: 'warn',
    blame: e.targetName,
    fullText: 'WHOOPS',
  };
},
```

### `deathReason` format
* `name` is the full player name to override the next death reason for.
* `reason` is the string to use.

If this following trigger is used, then if a player dies without taking any other damage, the log would show ":skull: Chippy: Doom Debuff" instead of assigning it to the last damage the player took before this trigger, which might incorrectly look more like ":skull: Chippy: Auto (3034/38471)".
```
deathReason: function(event, data, matches) {
  return {
    name: event.targetName,
    reason: 'Doom Debuff',
  },
},
```

## Oopsy Trigger Function Parameters

Every function in an oopsy trigger gets three parameters: `event`, `data`, `matches` in that order.

### Event Fields
Every function specified in a trigger gets an event (or events) object.  This object has different fields depending on which type of regex was used to match the trigger.

#### All Events
* `event.line`: string, representing the entire log line.

#### Effect Events (gainsEffectRegex, losesEffectRegex)
* `event.targetName`: string, the target's full name.
* `event.effectName`: string, the buff name gained, e.g. 'Beyond Death'.
* `event.gains`: bool, true if the buff was gained, false if the buff was lost.
* `event.attackerName`: string, the full name of the attacker that gave the target this buff.
* `event.durationSeconds`: float, the duration this buff was gained for.  undefined if the buff was lost.

#### Ability Events (healRegex, damageRegex, abilityRegex)
* `event.type`: hex string of the log line type (e.g. '1B' for head markers).
* `event.attackerId`: hex string of the attacker's id
* `event.attackerName`: string, full name of the target.
* `event.targetId`: hex string of the target's id.
* `event.targetName`: string, full name of the target.
* `event.flags`: hex string of flags for this damage value (see comments in **oopsyraidsy.js** for more information).
* `event.damage`: float, damage or heal value
* `event.damageStr`: string, nicer looking version of `event.damage` with ! and !! for crits.
* `event.targetCurrentHp`: int string, target's hp at the time of this ability.
* `event.targetMaxHp`: int string, target's max hp at the time of this ability.
* `event.targetCurrentMp`: int string, target's mp at the time of this ability.
* `event.targetMaxMp`: int string, target's max mp at the time of this ability.
* `event.targetCurrentTp`: int string, target's tp at the time of this ability.
* `event.targetMaxTp`: int string, target's max tp at the time of this ability.
* `event.targetX`: x position of the target when this ability was used.
* `event.targetY`: y position of the target when this ability was used.
* `event.targetZ`: z position of the target when this ability was used.
* `event.attackerX`: x position of the attacker when this ability was used.
* `event.attackerY`: y position of the attacker when this ability was used.
* `event.attackerZ`: z position of the attacker when this ability was used.

`data.IsPlayerId(id)` can be used against the `attackerId` or the `targetId` to determine if that id represents a player.

Current hp/mp/tp values are not 100% precise.  ACT polls these values periodically and so it may be out of date by one HoT/DoT tick.  The most important consideration is that damage that does more than current hp may not actually be fatal, and vice versa that damage that does less than current hp may turn out to be fatal.  There's no way to know until the 'was defeated' message shows up two seconds later.


### Single Event Example

In most cases, a single event will be passed to every function.
```
{
  // 26BB is the ability id for Nael's Iron Chariot.
  damageRegex: '26BB',
  mistake: function(event, data, matches) {
    // event here is a single event object
    console.log(event.targetName);
  },
},
```

### Multiple Event Example (Collection)

If `collectSeconds` is used, then as soon as the trigger matches any line, it will wait `collectSeconds` and then pass that first trigger and any additional trigger that matches during that time period as an array.

`condition` always takes a single event and acts as a filter prior to collecting events.  If `condition` is not true, then it as if the log line didn't exist and the event is skipped, both for the initial match and for the collection.

`delaySeconds` is not called when collecting.

```
{
  // Succor
  healRegex: 'BA',
  collectSeconds: 0.2,
  mistake: function(events, data, matches) {
    // events here is an array of event objects
    for (var i = 0; i < events.length; ++i)
      console.log(events[i].targetName);
  },
},
```

### Data Fields

`data` is an object that persists for an entire fight and is reset on wipe.  It is passed to every function.

`data` comes preopulated with the following fields:

* `data.me`: string, the player's character name.
* `data.job`: string, the player's job, e.g. WAR.
* `data.role`: string, the role of the player's job: tank, healer, dps-melee, dps-ranged, dps-caster, crafting, gathering.
* `data.inCombat`: bool, whether or not the game thinks the player is in combat.  This is different than whether ACT thinks the player is in combat.
* `data.ShortName`: helper function to turn full player names into shorter names or nicknames.
* `data.IsPlayerId`: helper function to check if a target or attacker id represents a player (vs a pet or a mob).

`data` is something that triggers can and should store state on, if state is needed to be tracked across multiple triggers.

For example, if you want to store a map of which players have doom or not, that could be stored in `data.hasDoom`.  This could then be used across multiple triggers.

```
{
  // Match both gains and loses in the same trigger.
  gainsEffectRegex: 'Doom',
  losesEffectRegex: 'Doom',
  run: function(e, data) {
    data.hasDoom[e.targetName] = e.gains;
  },
},
```

### Match Fields

`matches` is literally the regex match object returned from whatever regex this trigger matched.  `matches[0]` is always the full match, with other array entries being any other groups from the regex (if any).  In the case of the single event above, `matches[0] === 'Iron Chariot'`.


## Trigger Field Evaluation Order

The full order of evaluation of functions in a trigger is:

1. match against regex
1. check if `id` is disabled
1. `condition`
1. `collectSeconds`
1. `delaySeconds` (only if not collecting)
1. (delay and waiting for collecting happens here)
1. `mistake`
1. `deathReason`
1. `run`
