# Contributing to cactbot

## Table of Contents

* [Code of Conduct](#code-of-conduct)
* [Issues and Bug Reports](#issues-and-bug-reports)
* [Pull Requests](#pull-requests)
* [Coding Style](#coding-style)
* [Desired Features](#desired-features)
* [Trigger Guidelines](#trigger-guidelines)
  * [Trigger Severity](#trigger-severity)
  * [Trigger Text](#trigger-text)
* [Timeline Guidelines](#timeline-guidelines)
* [Roadmap](#roadmap)

## Code of Conduct

The code of conduct for cactbot can be found here:
[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Issues and Bug Reports

Please file all issues with cactbot on github,
via this url:
[https://github.com/quisquous/cactbot/issues/new](https://github.com/quisquous/cactbot/issues/new)

## Pull Requests

It's vastly preferable to make a lot of small pull requests (that are easy to review)
than very large pull requests (that may conflict or take a while to land).
Each pull request should be small and be self-contained in terms of what it is changing.

If your change is small, just send a pull request and we can have a conversation there.
If your change is big, consider having a conversation before you embark on a lot of work.

If you want to make large mechanical changes to parts of the code, 
for example you're irritated at some style usage and want to make everything consistent,
it's especially best to put that in a separate pull request.

Any contributor to cactbot should feel welcome to chime in on any pull request,
if you have ideas about how to make the code better
(even if it's not part of the code you feel like you are an expert in).
Pull requests are a collaborative effort!

The Chromium project has excellent resources on good pull requests and code reviews.
Some of it doesn't apply, but much of the philosophy does.
See these links:
* [Respectful Changes](https://chromium.googlesource.com/chromium/src/+/master/docs/cl_respect.md)
* [Respectful Code Reviews](https://chromium.googlesource.com/chromium/src/+/master/docs/cr_respect.md)

## Coding Style

The ideal end state is that all C#, Python, and Javascript code is linted and autoformatted.
The current state is that Javascript and Python are fairly well linted
(although variable naming conventions are all over the place)
and C# is not very consistent.
Over time, it would be nice to move towards that ideal state.

The primary rule for pull request style is to be consistent with the surrounding code,
*especially* when making unrelated changes.

If you have strong feelings about style and want to add more linting or more rules,
this is highly encouraged but you should likely have a conversation about these rules first.

Lots of people get hassled by the continuous integration bot,
so you may want to run `npm run test` and `npm run lint` or `npm run lintfix` locally
before a pull request.

## Desired Features

If you are wondering how to contribute to cactbot,
here's a set of features that will almost always be needed:
* fixing bugs
* [issues marked "help wanted"](https://github.com/quisquous/cactbot/issues?utf8=%E2%9C%93&q=label%3A%22help+wanted%22)
* [adding missing timelines](https://github.com/quisquous/cactbot/issues/414)
* missing translations
* job ui for missing jobs (that you play and have opinions on)

## Trigger Guidelines

As a rule, cactbot defaults to text alarms over sounds and tts,
as separating visual text for triggers from audio voice comms.
is easier to process than mixing voice comms and tts in audio.
This isn't for everybody and tts is an option,
but text triggers will always be the default.
Give it a try.

### Trigger Severity

Here's the general guidelines for how cactbot has triggers.
You can use these when adding new triggers for raids.
As always, try to be consistent with the surrounding code.

* alarm (red text)
  * you will wipe the raid if you mess this up
  * ideally used on random mechanics (one person gets X)
  * ideally used only once or twice in a raid
 
* alert (yellow text)
  * you will get killed if you mess this up (or kill others)
  * used for important mechanics
  * should be about ~1/3 of the triggers

* info (green text)
  * you should probably do something about this, but it might not kill you
  * also used for information like nael dragon dives or grand octet markers
  * should be about ~2/3 of the triggers

Another consideration for trigger severity is to make them contextually useful.
For example, if you may get selected for one of two mechanics,
it's preferable to have one mechanic be info and the other alert 
(or one alert and the other alarm)
so that it is obvious from the noise which mechanic you have.

A final consideration is to not overload the player
with too many of the same types of message.
If every trigger is an alert,
it's probably better to change some of them to be info.
Having different sounds helps create a "rhythm" for the fight.
This is especially true for simultaneous alerts.

### Trigger Text

Here's some general guidelines for the text in triggers.
The goal for trigger text is to mimic what a human raidcaller would say.
It should minimize the amount of that the player has to think to do a mechanic.

* Be concise.  Text should be as short as possible, like lalafells.
* Tell the player what to do rather than the mechanic name, i.e. prefer `Get Out` vs `Iron Chariot`
* Have the text be positive, i.e. prefer `Left` vs `Don't Go Right`
* Don't prescribe a particular strategy, if multiple strategies exist, i.e. Titania Ex tethers or Hello World
* If multiple strategies exist, tell the player the mechanic (`Jail on YOU`) instead of dictating a strategy.
* As always, be consistent with other triggers.

## Timeline Guidelines

* Use the existing scripts in the `util/` directory to make timelines.
* Prefer using `sync` with the default time for all abilities.
* Prefer to use actual ability names for the timeline text.
* If ability names are confusing or long, consider abbreviating.
* When using `jump`, prefer to jump to a time that has a timeline entry on it.
* When adding a loop, add at least 30 seconds of fake abilities, and make sure these abilities line up with where the loop jumps to.
* As always, be consistent with other timelines.

## Roadmap

If you're curious what is coming in the future,
here is a [rough roadmap](https://gist.github.com/quisquous/85b85338b7a87ca6bad98e793d159fdf).