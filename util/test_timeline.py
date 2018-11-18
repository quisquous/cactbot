import argparse
from datetime import datetime
from pathlib import Path
import re

import fflogs


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
            match = re.search(r'^(?P<time>[\d\.]+)\s+"(?P<label>[^"]+)"\s+(?P<options>.+)', clean_line)
            if not match:
                continue

            entry['time'] = float(match.group('time'))
            entry['label'] = match.group('label')

            # Get the sync format into the file format
            sync_match = re.search(r'sync /([^/]+)/', match.group('options'))
            if not sync_match:
                continue

            entry['regex'] = sync_match.group(1).replace(':', '\|')
            entry['branch'] = 0

            # Special casing on syncs
            entry['special_type'] = False

            begincast_match = re.search(r'^:([0-9A-F\(\)\|]+):([^:]+)', sync_match.group(1))
            if begincast_match:
                entry['special_type'] = 'begincast'
                entry['special_line'] = '20'
                entry['cast_id'] = begincast_match.group(1)
                entry['caster_name'] = begincast_match.group(2)

            buff_match = re.search(r'1A:(.+) gains the effect of (.+)( from)?', sync_match.group(1))
            if buff_match:
                entry['special_type'] = 'applydebuff'
                entry['special_line'] = '26'
                entry['buff_target'] = buff_match.group(1)
                entry['buff_name'] = buff_match.group(2)

            # Get the start and end of the sync window
            window_match = re.search(r'window ([\d\.]+),?([\d\.]+)?', match.group('options'))

            if window_match:
                pre_window = float(window_match.group(1))
                if window_match.group(2) is not None:
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


def parse_report(args):
    """Reads an fflogs report and return a list of entries"""

    # Default values
    report_start_time = 0
    start_time = 0
    end_time = 0
    enemies = {}

    # Get report information
    report_data = fflogs.api('fights', args.report, 'www', {'api_key': args.key})

    report_start_time = report_data['start']

    # Get the start and end timestamps for the specific fight
    fight_id_found = False
    for fight in report_data['fights']:
        if args.fight and fight['id'] == args.fight:
            start_time = fight['start_time']
            end_time = fight['end_time']
            fight_id_found = True
            break
        elif fight['end_time'] - fight['start_time'] > end_time - start_time:
            start_time = fight['start_time']
            end_time = fight['end_time']

    if args.fight and not fight_id_found:
        raise Exception('Fight ID not found in report')

    # Build an enemy name list, since these aren't in the events
    for enemy in report_data['enemies']:
        enemies[enemy['id']] = enemy['name']

    # Get the actual event list for the single fight
    options = {
        'api_key': args.key,
        'start': start_time,
        'end': end_time,
        'filter': '(source.disposition="enemy" and (type="cast" or type="begincast")) or (target.disposition="enemy" and source.disposition!="friendly" and type="applydebuff")',
        'translate': 'true',
    }
    event_data = fflogs.api('events', args.report, 'www', options)

    entries = []

    # Actually make the entry dicts
    for event in event_data['events']:
        entry = {
            'time': datetime.fromtimestamp((report_start_time + event['timestamp']) / 1000),
            'ability_id': hex(event['ability']['guid'])[2:].upper(),
            'ability_name': event['ability']['name'],
            'type': event['type']
        }

        # In the applydebuff case, the source is -1 (environment) and we want the target instead
        if event['type'] == 'applydebuff':
            entry['combatant'] = enemies[event['targetID']]
        elif 'sourceID' in event:
            entry['combatant'] = enemies[event['sourceID']]
        else:
            entry['combatant'] = ''

        entries.append(entry)

    return entries, datetime.fromtimestamp((report_start_time + start_time) / 1000)


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
    """Gets the regex for the event for both file and report types"""
    if isinstance(event, str):
        return event
    elif isinstance(event, dict):
        return event['regex']


def get_type(event):
    """Gets the line type for both file and report types"""
    if isinstance(event, str):
        if event.startswith('20'):
            return 'begincast'
        elif event.startswith('26'):
            return 'applydebuff'
        elif event.startswith('21') or event.startswith('22'):
            return 'cast'
        else:
            return 'none'

    elif isinstance(event, dict):
        return event['type']

    # In case event is a different type
    return 'none'


def test_match(event, entry):
    # Normal case. Exclude begincast to avoid false positive match with cast events
    if 'regex' in entry and re.search(entry['regex'], get_regex(event)) and not entry['special_type'] and get_type(event) != 'begincast':
        return True

    # File parsing cases
    if isinstance(event, str) and entry['special_type']:
        # Begincast case
        if entry['special_type'] == 'begincast' and event.startswith(entry['special_line']):
            begincast_match = re.search('\|{}\|{}\|'.format(entry['caster_name'], entry['cast_id']), event)
            if begincast_match:
                return True
            else:
                return False

        # Buff case
        elif entry['special_type'] == 'applydebuff' and event.startswith(entry['special_line']):
            # Matching this format generically:
            # |Dadaluma Simulation|0.00|E0000000||4000AE96|Guardian
            buff_match = re.search('\|{}\|([^\|]*\|){{4}}{}'.format(entry['buff_name'], entry['buff_target']), event)
            if buff_match:
                return True
            else:
                return False

    # Report parsing cases
    elif isinstance(event, dict) and entry['special_type'] == event['type']:
        # Begincast case
        if event['type'] == 'begincast':
            if re.search(entry['cast_id'], event['ability_id']) and re.search(entry['caster_name'], event['combatant']):
                return True
            else:
                return False

        # Buff case
        elif event['type'] == 'applydebuff':
            if re.search(entry['buff_target'], event['combatant']) and re.search(entry['buff_name'], event['ability_name']):
                return True
            else:
                return False

    # If none of the above have matched, there's no match
    return False


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
        match = test_match(event, entry)
        if (
                match and
                timeline_position >= entry['start'] and
                timeline_position <= entry['end']
        ):
            # Flag with current branch
            if state['last_entry'] == entry and time_progress_seconds < 2.5:
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
                            other_entry['time'] > state['last_jump'] and
                            other_entry['time'] < entry['time'] and
                            other_entry['branch'] < entry['branch']
                    ):
                        if 'last' in other_entry and drift < 999:
                            print("    Missed sync: {} at {} (last seen at {})".format(other_entry['label'], other_entry['time'], other_entry['last']))
                        elif drift < 999:
                            print("    Missed sync: {} at {}".format(other_entry['label'], other_entry['time']))
                        # If this is a sync from a large window, ignore missed syncs
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
        elif match:
            entry['last'] = timeline_position

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
    path = Path(__file__).resolve().parent.parent / 'ui' / 'raidboss' / 'data' / 'timelines' / (arg + '.txt')

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
