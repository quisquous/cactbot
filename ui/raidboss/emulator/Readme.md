# Raid Emulator

The raid emulator consists of five core components:

* `NetworkLogConverter` - `emulator/data/NetworkLogConverter.js`
  * Parses and converts `Network_<version>_<date>.log` files
* `Encounter` - `emulator/data/Encounter.js`
  * Accepts an array of lines and info, pulls some basic information about an encounter
* `Persistor` - `emulator/data/Persistor.js`
  * Persists encounters in `IndexedDB` across sessions
* `AnalyzedEncounter` - `emulator/data/AnalyzedEncounter.js`
  * Analyzes an encounter
  * Tracks combatant stats over the duration of the encounter
  * Provides perspectives of each player in the encounter, including what triggers were fired
* `RaidEmulator` - `emulator/data/RaidEmulator.js`
  * Handles playback of an encounter
  * Dispatches events to UI elements

There are two general data flows:

* Drop network file on window or otherwise upload it
  * File is read into a string buffer in `raidemulator.js`
  * File contents are passed to `NetworkLogConverter`
    * `NetworkLogConverter` splits the string into lines
    * Those lines are then parsed out for information via `emulator/data/network_log_converter/ParseLine.js`
    * Lines are sorted based on timestamp and then index, to account for chat lines (`00`) being out of order from network lines
  * Converted log lines are passed into `emulator/data/LogEventHandler.js`
    * `LogEventHandler` splits the log lines into individual encounters, pulling zone info along the way
    * Encounters are passed to `Persistor`
* Encounter is loaded from IndexedDB
  * `Encounter` ID is passed to `RaidEmulator` to be loaded
    * `AnalyzedEncounter` is built from encounter if this is the first time the encounter has been loaded since refresh
      * For each player in the encounter
        * `AnalyzedEncounter` bootstraps `PopupText`, `TimelineController`, and `Timeline` classes
        * Encounter lines are passed to bootstrapped classes to build list of triggers for each player's perspective
    * `AnalyzedEncounter` is loaded and UI elements are updated
    * First player in party object is set as current perspective
    * `RaidEmulator` seeks to start of combat in encounter

## Other Information

* `raidemulator.js` acts as glue to hold the various pieces together and coordinate them
* `emulator/EventBus.js` is an event bus implementation that objects can extend to inherit `on` and `dispatch` event handlers, so that other objects can listen for events
* `emulator/EmulatorCommon.js` is a static object that has helper methods and global regexes
* `emulator/ui` contains UI elements created specifically for the emulator
* `emulator/overrides` contains overriding classes from the base raidboss implementation
* `emulator/data/network_log_converter` contains the parsers for each individual line event
