/**
 *  Creates a module and necessary tools for averaging and aggregating timeline reports.
 */
import _ from 'lodash';

export function parseTimelineEvents(timeline: string[]) {
  /*
   """Update the timeline event map from the timeline output.

   Non-commented timeline entries are parsed and the event timestamp is appended
   to the list of times an event label occurs.

   For example:
   3.5 "Phantom Flurry" sync /:Suzaku:32DD:/
   7.0 "Screams Of The Damned" sync /:Suzaku:32D2:/
   10.5 "Phantom Flurry" sync /:Suzaku:32DD:/

   Will create the following mapping:
   {
            '"Phantom Flurry" sync /:Suzaku:32DD:/': [3.5, 10.5],
            '"Screams Of The Damned" sync /:Suzaku:32D2:/': [7.0]
        }
   """
   */

  const timelineEventMap: Record<string, number[]> = {};
  timeline.forEach((line: string) => {
    if (!Number.isInteger(line[0]))
      return;

    const cleanLine = line.split('#')[0];
    const match: [string, string, string, string] | undefined = /^(?<time>[\d\.]+)\s+"(?<label>.+)"\s+(?<options>.+)/.exec(cleanLine);
    if (!match)
      return;

    const eventTime = parseFloat(match[1]);
    const label = `"${match[2]}" ${match[3]}`;
    const old: number[] = timelineEventMap[label] ?? [];
    old.push(eventTime);
    timelineEventMap[label] = old;
  });
  return timelineEventMap;
}


function output_to_timeline(timeline_event_map) {
  /*Returns a timeline-friendly list from an event mapping.

  Creates a list of events sorted in ascending numerical order as Advanced
  Combat Tracker would expect. Returns the list as a Python list, to be altered
  or printed into the expected parsable format.
  */
  timeline_events = new Set();
  for (const [key, values] in Object.entries(timeline_event_map){

    for (const value of values) {
      timeline_events.add(`${value} ${key}`);
    }
  }
  return sorted(list(timeline_events), key = lambda
  s: float(s.split()[0]);
}
