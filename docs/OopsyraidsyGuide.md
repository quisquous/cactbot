# Oopsy Raidsy Trigger Format

## File Structure

Each file is a module that exports a single trigger set, and should be listed in **oopsy_manifest.txt**.

```javascript
import ZoneId from '../path/to/resources/zone_id';
// Other imports here.

export default {
  zoneId: ZoneId.TheUnendingCoilOfBahamutUltimate,
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

**zoneRegex**:
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
triggered when multiple players share damage which should only be on one player.

**soloWarn** and **soloFail**:
The opposite of **shareWarn** and **shareFail**
in that they are trigger when something should be taken alone but hits multiple people.

**triggers**:
An array of triggers in the trigger set.
See below for the format of each of individual triggers.

## Trigger Structure

Each trigger is an object with the following fields.  All fields are optional.

* `id`: a string representing this trigger, for use in disabling triggers.  See [oopsyraidsy-example.js](../users/oopsyraidsy-example.js).
* `condition`: function returning bool for whether or not to run this trigger.
* `netRegex`: a regex matching a network line (such as from the `NetRegexes` helper)
* `delaySeconds`: float (or function returning float) for how long to wait before executing this trigger.
* `suppressSeconds`: float (or function returning float) for how long to ignore future matches to this trigger (including additional collection).
* `deathReason`: overrides the reason that a player died if the player dies without taking any more damage.  This is for things that kill you without an obvious log line, e.g. forgetting to clear Beyond Death.
* `mistake`: returns a single mistake or an array of mistakes to add to the live list.  See below for the `mistake` format.
* `run`: function that just runs, but does not return anything

### `mistake` format

* `type` is the icon: pull, warn, fail, potion, death, wipe (:arrow_forward::warning::no_entry_sign::cocktail::skull::toilet:).
* `name` is an optional full player name to list as this mistake happening to.  This will prepend their name in the live list.
* `blame` is an optional full player name (or array of full player names) to blame for this mistake.  If `name` is not specified, then the `name` will be the `blame` player.
* `text` is an optional reason for the mistake.  It will be prepended by the blamed player's short name (if it exists).
This will print ":no_entry_sign: Latke: Dynamo" in the live log.

```javascript
mistake: (data, matches) => {
  return {
    type: 'fail',
    blame: matches.target,
    text: 'Dynamo'
  };
},
```

### `deathReason` format

* `name` is the full player name to override the next death reason for.
* `reason` is the string to use.

If this following trigger is used, then if a player dies without taking any other damage, the log would show ":skull: Chippy: Doom Debuff" instead of assigning it to the last damage the player took before this trigger, which might incorrectly look more like ":skull: Chippy: Auto (3034/38471)".

```javascript
deathReason: (data, matches) => {
  return {
    name: event.targetName,
    text: 'Doom Debuff',
  },
},
```

## Oopsy Trigger Function Parameters

Every function in an oopsy trigger gets two parameters: `data` and `matches` in that order.

Current hp/mp/tp values are not 100% precise.  ACT polls these values periodically and so it may be out of date by one HoT/DoT tick.  The most important consideration is that damage that does more than current hp may not actually be fatal, and vice versa that damage that does less than current hp may turn out to be fatal.  There's no way to know until the 'was defeated' message shows up two seconds later.

```javascript
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

* `data.me`: string, the player's character name.
* `data.job`: string, the player's job, e.g. WAR.
* `data.role`: string, the role of the player's job: tank, healer, dps-melee, dps-ranged, dps-caster, crafting, gathering.
* `data.inCombat`: bool, whether or not the game thinks the player is in combat.  This is different than whether ACT thinks the player is in combat.
* `data.ShortName`: helper function to turn full player names into shorter names or nicknames.
* `data.IsPlayerId`: helper function to check if a target or attacker id represents a player (vs a pet or a mob).

`data` is something that triggers can and should store state on, if state is needed to be tracked across multiple triggers.

For example, if you want to store a map of which players have doom or not, that could be stored in `data.hasDoom`.  This could then be used across multiple triggers.

```javascript
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
