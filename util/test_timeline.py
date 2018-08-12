import argparse
from datetime import datetime
import fflogs
from make_timeline import parse_report
import os
from pathlib import Path
import re

def load_timeline(timeline):
    """Loads a timeline file into a list of entry dicts"""
    timelist = []
    with timeline as file:
        for line in file:
            # Ignore comments, alertall, hideall, etc by
            # only reading lines starting with a number
            if not line[0].isdigit():
                continue

            entry = {}
            # Remove trailing comment, if any
            clean_line = line.split('#')[0]

            # Split the line into sections
            match = re.search(r'^(?P<time>\d+)\s+"(?P<label>[^"]+)"\s+(?P<options>.+)', clean_line)
            if not match:
                continue

            entry['time'] = float(match.group('time'))
            entry['label'] = match.group('label')

            # Get the sync format into the file format
            sync_match = re.search(r'sync /([^/]+)/', match.group('options'))
            if not sync_match:
                continue

            entry['regex'] =  sync_match.group(1).replace(':', '\|')
            entry['branch'] = 0

            # Get the start and end of the sync window
            window_match = re.search(r'window ([\d\.]+),?([\d\.]+)?', match.group('options'))
            
            if window_match:
                pre_window = float(window_match.group(1))
                if window_match.group(2) != None:
                    post_window = float(window_match.group(2))
                else:
                    post_window = pre_window
            else:
                pre_window = 2.5
                post_window = 2.5

            entry['start'] = max(0, entry['time'] - pre_window)
            entry['end'] = entry['time'] + post_window

            # Get the jump time, if any
            jump_match = re.search(r'jump ([\d\.]+)', match.group('options'))

            if jump_match:
                entry['jump'] = float(jump_match.group(1))

            # Add completed entry to the timelist
            timelist.append(entry)

    return timelist

def parse_time(timestamp):
    """Parses a timestamp into a datetime object"""
    return datetime.strptime(timestamp, '%Y-%m-%dT%H:%M:%S')

def parse_event_time(event):
    """Parses the line's timestamp into a datetime object"""
    if isinstance(event, str):
        time = parse_time(event[3:22])
        time = time.replace(microsecond=int(event[23:29]))
        return time
    elif isinstance(event, dict):
        return event['time']

def get_regex(event):
    if isinstance(event, str):
        return event
    elif isinstance(event, dict):
        return event['regex']

def check_event(event, timelist, state):
    # Get amount of time that's passed since last sync point
    if state['timeline_stopped']:
        time_progress_seconds = 0
    else:
        time_progress_delta = parse_event_time(event) - state['last_sync_timestamp']
        time_progress_seconds = time_progress_delta.seconds + time_progress_delta.microseconds / 1000000

    # Get where the timeline would be at this time
    timeline_position = state['last_sync_position'] + time_progress_seconds

    # Search timelist for matches
    for entry in timelist:
        if (
                'regex' in entry and
                re.search(entry['regex'], get_regex(event)) and
                timeline_position >= entry['start'] and
                timeline_position <= entry['end']
        ):
            # Flag with current branch
            if state['last_entry'] == entry:
                continue
            
            entry['branch'] = state['branch']
            state['last_entry'] = entry

            # Check the timeline drift for anomolous timings
            drift = entry['time'] - timeline_position
            print("{:.3f}: Matched entry: {} {} ({:+.3f}s)".format(timeline_position, entry['time'], entry['label'], drift))

            if time_progress_seconds > 30:
                print("    Warning: {:.3f}s since last sync".format(time_progress_seconds))

            # Find any syncs before this one that were passed without syncing
            if not state['timeline_stopped']:
                for other_entry in timelist:
                    if (
                            'regex' in other_entry and
                            other_entry['time'] >state['last_jump'] and
                            other_entry['time'] < entry['time'] and
                            other_entry['branch'] < entry['branch']
                    ):
                        if 'last' in other_entry:
                            print("    Missed sync: {} at {} (last seen at {})".format(other_entry['label'], other_entry['time'], other_entry['last']))
                        else:
                            print("    Missed sync: {} at {}".format(other_entry['label'], other_entry['time']))
                        other_entry['branch'] = state['branch']

            # Carry out the sync to make this the new baseline position
            if state['timeline_stopped']:
                state['last_jump'] = entry['time']
            state['timeline_stopped'] = False
            state['last_sync_timestamp'] = parse_event_time(event)

            # Jump to new time, stopping if necessary
            if 'jump' in entry:
                if entry['jump'] == 0:
                    print("---!Resetting encounter from {}!---".format(state['last_sync_position']))
                    state['timeline_stopped'] = True
                else:
                    print("    Jumping to {:.3f}".format(entry['jump']))
                state['last_jump'] = entry['jump']
                state['last_sync_position'] = entry['jump']
                state['branch'] += 1
            else:
                state['last_sync_position'] = entry['time']

        # Record last seen data if it matches but outside window
        elif (
                'regex' in entry and
                re.search(entry['regex'], get_regex(event))
        ):
            entry['last'] = timeline_position
        else:
            pass

    return state

def run_file(args, timelist):
    """Runs a timeline against a specified file"""
    state = {
        'file': True,
        'last_entry': False,
        'last_sync_position': 0,
        'last_jump': 0,
        'branch': 1,
        'timeline_stopped': True
    }
    file_started = False

    with args.file as file:
        for line in file:
            # Scan the file until the start timestamp
            if not file_started and line[14:26] != args.start:
                continue

            if line[14:26] == args.end:
                break

            # We're at the start of the encounter now.
            if not file_started:
                file_started = True
                state['last_sync_timestamp'] = parse_event_time(line)

            state = check_event(line, timelist, state)

def run_report(args, timelist):
    """Runs a timeline against a specified FFlogs report"""
    # Reuse the parse_report functionality to get the entry list
    events, start_time = parse_report(args)

    # Add in the log string to search for
    for event in events:
        event['regex'] = '|{}|{}|'.format(event['combatant'], event['ability_id'])

    # Set up state. timeline_stopped will never be True with reports
    state = {
        'file': False,
        'last_entry': False,
        'last_sync_position': 0,
        'last_sync_timestamp': start_time,
        'last_jump': 0,
        'branch': 1,
        'timeline_stopped': False
    }

    for event in events:
        state = check_event(event, timelist, state)

def main(args):
    # Parse timeline file
    timelist = load_timeline(args.timeline)

    if args.file:
        run_file(args, timelist)

    elif args.report:
        print("Running analysis based on report. Caveats apply.")
        run_report(args, timelist)

def timeline_file(arg):
    """Defines the timeline file argument type"""
    path = Path(__file__).parent.parent / 'ui' / 'raidboss' / 'data' / 'timelines' / (arg + '.txt')

    if not path.exists():
        raise argparse.ArgumentTypeError("Could not load timeline at " + path)
    else:
        return path.open()

def timestamp_type(arg):
    """Defines the timestamp input format"""
    if re.match(r'\d{2}:\d{2}:\d{2}\.\d{3}', arg) is None:
        raise argparse.ArgumentTypeError("Invalid timestamp format. Use the format 12:34:56.789")
    return arg

if __name__ == "__main__":
    # Set up all of the arguments
    example_usage = """
    example:
        make_timeline.py -f "%APPDATA%\\Advanced Combat Tracker\\FFXIVLogs\\Network_20180206.log" -s 12:30:45.156 -e 12:43:51.395 -t ultima_weapon_ultimate

        Scans Network_20180206.log, starts the encounter at 12:30:45.156, and crawls until
        12:43:51.395, comparing against the ultima_weapon_ultimate timeline"""

    parser = argparse.ArgumentParser(
        description="Creates a timeline from a logged encounter",
        epilog=example_usage,
        formatter_class=argparse.RawDescriptionHelpFormatter)

    # Add main input vector, fflogs report or network log file
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('-r', '--report', help="The ID of an FFLogs report")
    group.add_argument('-f', '--file', type=argparse.FileType('r', encoding="utf8"), help="The path of the log file")

    # Report arguments
    parser.add_argument('-k', '--key', help="The FFLogs API key to use, from https://www.fflogs.com/accounts/changeuser")
    parser.add_argument('-rf', '--fight', type=int, help="Fight ID of the report to use. Defaults to longest in the report")

    # Log file arguments
    parser.add_argument('-s', '--start', type=timestamp_type, help="Timestamp of the start, e.g. '12:34:56.789")
    parser.add_argument('-e', '--end', type=timestamp_type, help="Timestamp of the end, e.g. '12:34:56.789")

    # Filtering arguments
    parser.add_argument('-t', '--timeline', type=timeline_file, help="The filename of the timeline to test against, e.g. ultima_weapon_ultimate")

    args = parser.parse_args()

    # Check dependent args
    if args.file and not (args.start and args.end):
        raise parser.error("Log file input requires start and end timestamps")
    
    if args.report and not args.key:
        raise parser.error("FFlogs parsing requires an API key. Visit https://www.fflogs.com/profile and use the Public key")

    # Actually call the script
    main(args)
