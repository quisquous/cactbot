This directory holds timeline files in the format defined by ACT Timeline plugin,
which described in here:
http://dtguilds.enjin.com/forum/m/37032836/viewthread/26353492-act-timeline-plugin

The files are loaded from the triggers in ui/raidboss/data/triggers. There the file
name for a file here can be specified to be loaded for any zone.

There are a some extensions to the original format, that can appear in the file
itself, or in the |timeline| field in the triggers:

# Show a info-priority text popup on screen before an event will occur. The
# |event name| matches a timed event in the file and will be shown before each
# occurance of events with that name. By default the name of the event will be shown,
# but you may specify the text to be shown at the end of the line if it should be
# different. The |before| parameter must be present, but can be 0 if the text should
# be shown at the same time the event happens. Negative values can be used to show
# the text after the event.
#
# Example which shows the event name 1s before the event happens.
infotext "event name" before 1
# Example which specifies different text to be shown earlier.
infotext "event name" before 2.3 "alternate text"

# Similar to infotext but uses alert priority.
alerttext "event name" before 1
alerttext "event name" before 2.3 "alternate text"

# Similar to infotext but uses alarm priority.
alarmtext "event name" before 1
alarmtext "event name" before 2.3 "alternate text"
