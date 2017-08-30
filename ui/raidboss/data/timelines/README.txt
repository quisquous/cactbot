This directory holds timeline files in the format defined by ACT Timeline plugin,
which described in here:
http://dtguilds.enjin.com/forum/m/37032836/viewthread/26353492-act-timeline-plugin

There are a some extensions to the original format:

# Allows you to specify a regular expression, which when matched the timeline file
# will be used.  If more than one file has a matching regex for the current zone, an
# arbitrary one will be used (don't do that). This is useful when the FFXIV plugin
# does not know the name of the zone yet, but you want to specify the name for once
# it becomes known. If this isn't specified, the name of the file (excluding the
# extention) will be used as a string match instead, and must exactly match the zone
# name.
zone "zone-regex"

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
