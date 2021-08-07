# Log Lines and Triggers

This is intended to be a comprehensive guide to log lines
for folks who want to write ACT triggers for ff14.

This guide was last updated for:

* [FF14](https://na.finalfantasyxiv.com/lodestone/special/patchnote_log/) Patch 4.58
* [FFXIV Plugin](https://github.com/ravahn/FFXIV_ACT_Plugin/releases) 1.7.2.13

With updates for:

* [FF14](https://na.finalfantasyxiv.com/lodestone/special/patchnote_log/) Patch 5.08
* [FFXIV Plugin](https://github.com/ravahn/FFXIV_ACT_Plugin/releases) 2.0.4.0

<!-- manually generated via https://imthenachoman.github.io/nGitHubTOC/ -->
## TOC

* [Data Flow](#data-flow)
  * [Viewing logs after a fight](#viewing-logs-after-a-fight)
  * [Importing an old fight](#importing-an-old-fight)
  * [Importing into ffxivmon](#importing-into-ffxivmon)
* [Glossary of Terms](#glossary-of-terms)
  * [Network Data](#network-data)
  * [Network Log Lines](#network-log-lines)
  * [ACT Log Lines](#act-log-lines)
  * [Game Log Lines](#game-log-lines)
  * [Object/Actor/Entity/Mob/Combatant](#objectactorentitymobcombatant)
  * [Object ID](#object-id)
  * [Ability ID](#ability-id)
* [Log Line Overview](#log-line-overview)
  * [00: LogLine](#00-logline)
    * [Don't Write Triggers Against Game Log Lines](#dont-write-triggers-against-game-log-lines)
  * [01: ChangeZone](#01-changezone)
  * [02: ChangePrimaryPlayer](#02-changeprimaryplayer)
  * [03: AddCombatant](#03-addcombatant)
  * [04: RemoveCombatant](#04-removecombatant)
  * [05: AddBuff](#05-addbuff)
  * [06: RemoveBuff](#06-removebuff)
  * [07: FlyingText](#07-flyingtext)
  * [08: OutgoingAbility](#08-outgoingability)
  * [0A: IncomingAbility](#0a-incomingability)
  * [0B: PartyList](#0b-partylist)
  * [0C: PlayerStats](#0c-playerstats)
  * [0D: CombatantHP](#0d-combatanthp)
  * [14: NetworkStartsCasting](#14-networkstartscasting)
  * [15: NetworkAbility](#15-networkability)
    * [Ability Flags](#ability-flags)
    * [Ability Damage](#ability-damage)
    * [Special Case Shifts](#special-case-shifts)
    * [Ability Examples](#ability-examples)
  * [16: NetworkAOEAbility](#16-networkaoeability)
  * [17: NetworkCancelAbility](#17-networkcancelability)
  * [18: NetworkDoT](#18-networkdot)
  * [19: NetworkDeath](#19-networkdeath)
  * [1A: NetworkBuff](#1a-networkbuff)
  * [1B: NetworkTargetIcon (Head Markers)](#1b-networktargeticon-head-markers)
  * [1C: NetworkRaidMarker](#1c-networkraidmarker)
  * [1D: NetworkTargetMarker](#1d-networktargetmarker)
  * [1E: NetworkBuffRemove](#1e-networkbuffremove)
  * [1F: NetworkGauge](#1f-networkgauge)
  * [20: NetworkWorld](#20-networkworld)
  * [21: Network6D (Actor Control Lines)](#21-network6d-actor-control-lines)
  * [22: NetworkNameToggle](#22-networknametoggle)
  * [23: NetworkTether](#23-networktether)
  * [24: LimitBreak](#24-limitbreak)
  * [25: NetworkActionSync](#25-NetworkActionSync)
  * [26: NetworkStatusEffects](#26-networkstatuseffects)
  * [27: NetworkUpdateHP](#27-networkupdatehp)
  * [FB: Debug](#fb-debug)
  * [FC: PacketDump](#fc-packetdump)
  * [FD: Version](#fd-version)
  * [FE: Error](#fe-error)
  * [FF: Timer](#ff-timer)
* [Future Network Data Science](#future-network-data-science)

## Data Flow

![Alt text](https://g.gravizo.com/source/data_flow?https%3A%2F%2Fraw.githubusercontent.com%2Fquisquous%2Fcactbot%2Fmain%2Fdocs%2FLogGuide.md)

<!-- markdownlint-disable MD033 -->
<details>
<summary></summary>
data_flow
  digraph G {
    size ="4,4";
    ff14 [label="ff14 servers"]
    ff14 -> ACT [label="network data"]
    network [label="network log files"]
    ACT [label="ACT + ffxiv plugin",shape=box,penwidth=3]
    ACT -> network [label="write to disk"]
    fflogs
    network -> fflogs [label="upload"]
    network -> ffxivmon [label="import"]
    network -> ACT [label="import"]
    network -> timeline [label="process"]
    timeline [label="cactbot make_timeline.py"]
    plugins [label="triggers, ACT plugins"]
    ACT -> plugins [label="ACT log lines"]
  }
data_flow
</details>
<!-- markdownlint-enable MD033 -->

### Viewing logs after a fight

If you have ACT open during a fight, then it will generate logs.
These logs will be trimmed to the start and end of combat.

To see the logs, click on the **Main** tab,
expand the zone you care about,
right click on the encounter you want,
then select **View Logs**.

![view logs screenshot](images/logguide_viewlogs.png)

The **All** entry includes all the encounters in a zone and cannot be viewed.
You must view individual encounters.

The window that pops up has the text that triggers can be made against.
This is usually the best way to search through and find the text that you want to make a trigger for.

### Importing an old fight

Sometimes you have to close ACT, but you want to look at old fights.
Or, somebody else sends you a log, and you want to make triggers from it.

To do this, click the **Import/Export** tab,
click on **Import a Log File**,
click on **Select File...**
select the **Network_date.log** log file,
and finally click the **YOU** button.

![import screenshot](images/logguide_import.png)

This will create encounters whose [logs you can view](#viewing-logs-after-a-fight).

### Importing into ffxivmon

If you want to dig into the network data itself, ffxivmon is a great tool.

To create a log file suitable for ffxivmon,
first turn on the **(DEBUG) Dump all Network Data to logfile** setting in ACT.

![dump network data screenshot](images/logguide_dumpnetworkdata.png)

Then, run an encounter in game with ACT running.
Once you're done, import that network log file into ffxivmon.

![ffxivmon import screenshot](images/logguide_ffxivmon_import.png)

Now, you can walk through and investigate the network data directly.

![ffxivmon screenshot](images/logguide_ffxivmon.png)

## Glossary of Terms

### Network Data

This is the raw packet dump sent from ff14 servers to your computer.
This data is processed both by the game itself as well as by the ffxiv plugin to
produce network log lines.

![network data screenshot](images/logguide_networkdata.png)

Folks writing triggers generally do not have to worry about raw packet data and
so this document does not focus very much on this type of data.

### Network Log Lines

These represent the lines that the ffxiv plugin writes to disk in
**Network_20191002.log** files in your log directory.
These lines are still processed and filtered by the ffxiv plugin,
and are (mostly) not raw network data.

Here are some example network log lines:

```log
21|2019-05-31T21:14:56.8980000-07:00|10532971|Tini Poutini|DF9|Fire IV|40002F21|Zombie Brobinyak|150003|3B9D4002|1C|DF98000|0|0|0|0|0|0|0|0|0|0|0|0|104815|348652|12000|12000|1000|1000|-767.7882|156.939|-672.0446|26285|28784|13920|15480|1000|1000|-771.8156|157.1111|-671.3281||8eaa0245ad01981b69fc1af04ea8f9a1
30|2019-05-31T20:02:41.4560000-07:00|6b4|Boost|0.00|1069C23F|Potato Chippy|1069C23F|Potato Chippy|00|3394|3394||4f7b1fa11ec7a2746a8c46379481267c
20|2019-05-31T20:02:41.4660000-07:00|105E3321|Tater Tot|2C9D|Peculiar Light|105E3321|Tater Tot||c375d8a2d1cf48efceccb136584ed250
```

Data on network log lines is separated by vertical braces, i.e. `|`.
Network log lines also contain the hash of that line at the end.
The log line type itself is in decimal, e.g. aoe abilities are on lines that begin with `22|`.
The equivalent [ACT log line](#act-log-lines) would be written as the hex type `0x16`, i.e. `NetworkAOEAbility`.

The ffxiv plugin does not write the ACT log lines that plugins interact with
to disk.

The network log lines are used by some tools, such as:

* fflogs uploader
* ffxivmon
* cactbot make_timeline utility

If you [import a network log file into ACT](#importing-an-old-fight),
then it you can view the ACT log lines in the fight.

### ACT Log Lines

These are the log lines that come out of the ffxiv plugin at runtime and are
exposed to plugins for triggers.
These are what the [View Logs](#viewing-logs-after-a-fight) option in ACT shows.

Data in ACT log lines is separated by colons, i.e. `:`.
The log line type is in hex.

Here is an example:

```log
[21:16:44.288] 15:10532971:Potato Chippy:9C:Scathe:40001299:Striking Dummy:750003:90D0000:1C:9C8000:0:0:0:0:0:0:0:0:0:0:0:0:2778:2778:0:0:1000:1000:-653.9767:-807.7275:31.99997:26945:28784:6720:15480:1000:1000:-631.5208:-818.5244:31.95173:
```

### Game Log Lines

A game log line is a specific type of ACT log line with type `00`.
These log lines also appear directly in your chat windows in game,
possibly in the Battle Log tab.
Try to [avoid writing triggers](#dont-write-triggers-against-game-log-lines) using these lines.

See: [00: Log Lines](#00-logline) for examples.

### Object/Actor/Entity/Mob/Combatant

These are all words used synonymously in this document to refer to an object
in the game that can use abilities and has stats.
This could be the player, Bahamut, Eos, a Striking Dummy.

### Object ID

Object ids are 4 byte identifiers used for all types of objects.

Player ids always start with the byte `10`,
e.g. `1069C23F` or `10532971`.

Enemy and pet ids always start with the byte `40`,
e.g. `4000A848` or `4000A962`.

For `NetworkAOEAbility` lines that don't affect anybody, e.g. a Titan landslide that somehow nobody stands in,
this is represented as hitting the id `E0000000` (and a blank name).

One thing to note is that in most raids,
there are many mobs in the scene with the same name.
For example, in t13, there are about twenty Bahamut Prime mobs in the zone,
most of which are invisible.
You can often differentiate these by HP values (see [AddCombatant](#03-addcombatant) log lines).
Often these invisible mobs are used as the damaging actors,
which is why in UWU Titan Phase, both Garuda and Titan use Rock Throw to put people in jails.

### Ability ID

Although ff14 differentiates between abilities and spells,
this document uses these words interchangeably.
All actions taken by a player or an enemy are "abilities" and have a unique 4 byte id.

You can use xivapi.com to look up a particular action, as sometimes these are
listed as "Unknown" from the ffxiv plugin if it hasn't updated yet.
For example, Fire IV has the ability id 0xDF9 = 3577,
so this link will give you more information about it:
<https://xivapi.com/action/3577?columns=ID,Name,Description,ClassJobCategory.Name>

This works for both players and enemies, abilities and spells.

## Log Line Overview

Here's an example of a typical log line:
`[12:01:48.293] 21:80034E29:40000001:E10:00:00:00`.
This log line happens to be the actor control line (type=`0x21`) for commencing Titan Extreme.

Log lines always start with the time in square brackets.
This time is formatted to be in your local time zone.
The time is followed with a hex value (in this case 0x21) that indicates the type of the log line it is.
These types are internal to the ffxiv plugin
and represent its conversion of network data and memory data into discrete events.

The rest of the data in the log line needs to be interpreted based on what type it is.
See the following sections that describe each log line.
The examples in these sections do not include the time prefix for brevity.

### LINE 0x00 (00): GameLog

#### Description

These are what this document calls "game log lines".
There is a two byte log type and then a string.
Because these are not often used for triggers
(other than `0839` messages),
the full set of LogTypes is not well-documented.

(Pull requests welcome!)

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=GameLog&lang=en) -->

<!-- AUTO-GENERATED-CONTENT:END -->

These are what this document calls "game log lines".
There is a two byte log type and then a string.
Because these are not often used for triggers
(other than `0839` messages),
the full set of LogTypes is not well-documented.

(Pull requests welcome!)

#### Don't Write Triggers Against Game Log Lines

There are a number of reasons to avoid basing triggers on game log lines:

* can show up later than ACT log lines (often up to half a second)
* inconsistent text (gains effect vs suffers effect, begins casting vs readies, you vs player name)
* often vague (the attack misses)
* can change spelling at the whim of SquareEnix

Instead, the recommendation is to base your triggers on ACT log lines that are not type `00`.
Prefer using `1A` "gains the effect" message instead of `00` "suffers the effect" messages.  Prefer using the `14` "starts using" instead of `00` "readies" or "begins casting".

At the moment, there are some cases where you must use game log lines,
such as sealing and unsealing of zones, or boss rp text for phase transitions.

Note:
There are examples where `14` "starts using" lines show up
after the corresponding `00` "readies" line,
but it is on the order of tens of milliseconds
and does not consistently show up first.
`15` "ability" lines always seem to show up before the `00` "uses" lines.

## Future Network Data Science

It'd be nice for folks to dig into network data to figure out how some specific mechanics work that are currently not exposed in the log.

* Boss headmarkers for Lamebrix Strikebocks (both A10S and Eureka Pyros)
* Running into insta-kill walls
* Figure out how t13 Dark Aether and Suzaku EX adds tether
* Find network data zone sealing so game log lines don't have to be used
* Network data for Absolute Virtue clone buffs (they're currently just game log lines)
* How to detect a wipe in older content like coil?
* How to differentiate fake mobs from real mobs in the added combatant data so they can be filtered out.

See: [importing into ffxivmon](#importing-into-ffxivmon).
