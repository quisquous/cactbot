"""Creates a module and necessary tools for averaging and aggregating timeline reports."""

from collections import defaultdict
import itertools
import re
from statistics import mean


def parse_timeline_events(timeline):
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
    timeline_event_map = defaultdict(list)
    for line in timeline:
        # Ignore comments, alertall, hideall, etc by
        # only reading lines starting with a number
        if not line[0].isdigit():
            continue

        # Remove trailing comment, if any
        clean_line = line.split("#")[0]

        # Split the line into sections
        match = re.search(r'^(?P<time>[\d\.]+)\s+"(?P<label>.+)"\s+(?P<options>.+)', clean_line)
        if not match:
            continue

        event_time = float(match[1])
        label = '"{match[2]}" {match[3]}'.format(match=match)

        # Add the timestamp to the event's list of occurrences
        timeline_event_map[label].append(event_time)
    return timeline_event_map


def output_to_timeline(timeline_event_map):
    """Returns a timeline-friendly list from an event mapping.

    Creates a list of events sorted in ascending numerical order as Advanced
    Combat Tracker would expect. Returns the list as a Python list, to be altered
    or printed into the expected parsable format.
    """
    timeline_events = set()
    for key, values in timeline_event_map.items():
        for value in values:
            timeline_events.add("{time} {event}".format(time=value, event=key))
    return sorted(list(timeline_events), key=lambda s: float(s.split()[0]))


def create_averaging_function(threshold):
    """Creates and returns a function to group by.

    Creates the averaging function to be used with the itertools.groupby()
    function. Takes a threshold value in seconds as input to average groups
    of similar event times.
    """
    key = None

    def averaging_function(event_time):
        """Averages event time values based on a threshold.

        For any event where the event time is less than the key value, keep
        returning key. If the event time exceeds the key, update the key value.
        """
        nonlocal key
        if key is None:
            key = event_time + threshold
        elif event_time >= key:
            key = event_time + threshold
        return key

    return averaging_function


def average_similar_events(values, threshold):
    """Return a list where similar numbers have been averaged.

    Items are grouped using the supplied width and criteria and the
    result is rounded to precision if it is supplied.  Otherwise
    averages are not rounded.

    """
    grouped_values = itertools.groupby(values, create_averaging_function(threshold))
    return list(round(mean(group), 1) for _, group in grouped_values)


class TimelineAggregator:
    """Aggregates timelines and averages their event times.

    Takes an input of N timelines and attempts to smooth their event times to
    find the line of best fit when determining when events occur.
    """

    def __init__(self, timelines):
        self.timelines = timelines

    def aggregate(self, averaging_threshold=2.0):
        """Aggregates timelines and returns a list of their events.

        Aggregates timelines with an averaging threshold defined in seconds. Any
        duplicate events found with the same memory signature within those events
        will be averaged by taking the mean of each near-duplicate event grouping.
        """
        aggregate_event_map = defaultdict(list)

        # Parse all events within the timelines passed to the aggregator
        for timeline in self.timelines:
            for key, values in parse_timeline_events(timeline).items():
                aggregate_event_map[key] += values

        # Average similar values for duplicate events to get a better approximate timeline
        for key, values in aggregate_event_map.items():
            aggregate_event_map[key] = average_similar_events(sorted(values), averaging_threshold)

        # Return the aggregated event mapping as a timeline output
        return output_to_timeline(aggregate_event_map)
