// If false, no timeline of upcoming events will be displayed during fights.
Options.TimelineEnabled = true
// If false, no text will be shown or spoken, or sounds played, for triggers and timeline events.
Options.PopupTextEnabled = true

// Show timer bars for events that will happen in this many seconds or less.
Options.ShowTimerBarsAtSeconds = 30
// Once a timer bar reaches 0, keep it around this long after.
Options.KeepExpiredTimerBarsForSeconds = 0.7
// Change the bar color to highlight it is coming up when this many seconds
// are left on it.
Options.BarExpiresSoonSeconds = 8
// Number of bars to show in the space given to the UI by css.
Options.MaxNumberOfTimerBars = 6

// Path to sound played for info-priority text popups, or when "Info" is specified as the sound name.
Options.InfoSound = '../../resources/sounds/freesound/percussion_hit.ogg'
// Path to sound played for alert-priority text popups, or when "Alert" is specified as the sound name.
Options.AlertSound = '../../resources/sounds/BigWigs/Alert.ogg'
// Path to sound played for alarm-priority text popups, or when "Alarm" is specified as the sound name.
Options.AlarmSound = '../../resources/sounds/BigWigs/Alarm.ogg'
// Path to sound played when "Long" is specified as the sound name.
Options.LongSound = '../../resources/sounds/BigWigs/Long.ogg'

// Volume between 0 and 1 to play the InfoSound at.
Options.InfoSoundVolume = 1
// Volume between 0 and 1 to play the AlertSound at.
Options.AlertSoundVolume = 1
// Volume between 0 and 1 to play the AlarmSound at.
Options.AlarmSoundVolume = 1
// Volume between 0 and 1 to play the LongSound at.
Options.LongSoundVolume = 1

// A set of triggers to be ignored. The key is the 'id' of the trigger, and the value
// should be true if the trigger is to be ignored, whereas false will have no effect.
// The trigger ids can be found in the trigger files for each fight in data/triggers/.
Options.DisabledTriggers = {
//   'O4S1 Fire III': true,
//   'UCU Nael Dragon Dive Markers': true,
}

// An array of user-defined triggers, in the format defined in data/triggers/README.txt.
Options.Triggers = [
// { zoneRegex: /./,
//   timelines: `
//     10.2 "My special event"
//     hideall "EventName"
//   `
//   triggers: [
//     { regex: /regex to match aginst here/,
//       infoText: 'text to show when it matches',
//       sound: '../../resources/sounds/to/play/when/it/matches.ogg',
//     },
//   ],
// },
]
