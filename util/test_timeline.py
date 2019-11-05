import argparse
from datetime import datetime
from pathlib import Path
import os
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

            buff_match = re.search(r'1A:.......:(.+) gains the effect of (.+)( from)?', sync_match.group(1))
            if buff_match:
                entry['special_type'] = 'applydebuff'
                entry['special_line'] = '26'
                entry['buff_target'] = buff_match.group(1)
                entry['buff_name'] = buff_match.group(2)

            log_match = re.search(r'^\s*00:([0-9]*):(.*$)', sync_match.group(1))
            if log_match:
                entry['special_type'] = 'battlelog'
                entry['special_line'] = '00'
                entry['logid'] = log_match.group(1)
                entry['line'] = log_match.group(2)

            add_match = re.search(r'Added new combatant (.*$)', sync_match.group(1))
            if add_match:
                entry['special_type'] = 'addlog'
                entry['special_line'] = '03'
                entry['name'] = add_match.group(1)

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
        # TCPDecoder errors have a 251 at the start instead of a single hex byte
	# But most just have two digits.
        if event[3] == '|':
            time = parse_time(event[4:23])
            time = time.replace(microsecond=int(event[24:30]))
        else:
            time = parse_time(event[3:22])
            time = time.replace(microsecond=int(event[23:29]))
        return time
    elif isinstance(event, dict):
        return event['time']

def stringify_time(timestamp):
    """
    Parses a datetime object into a string for log comparisons.
    Trims microseconds to milliseconds."""
    return timestamp.strftime('%H:%M:%S.%f')[:-3]

def is_line_start(line_fields, started):
    # Zone seal messages are guaranteed to be an encounter start
    if is_zone_seal(line_fields):
        return True
    return is_line_attack(line_fields) and not started

def is_line_end(line_fields):
    if is_zone_unseal(line_fields) or is_limit_reset(line_fields):
        return True
    return is_encounter_end_code(line_fields)

def is_zone_seal(line_fields):
    return line_fields[4].endswith('sealed off in 15 seconds!')

def is_zone_unseal(line_fields):
    return line_fields[4].endswith('no longer sealed!')

def is_line_attack(line_fields):
    # We want only situations where a friendly attacks an enemy
    return line_fields[0] in ('21', '22') and line_fields[6].startswith('4')

def is_limit_reset(line_fields):
    return line_fields[4] == 'The limit gauge resets!'

def is_instance_begun(line_fields):
    return line_fields[4].endswith('has begun.')

def is_instance_ended(line_fields):
    return line_fields[4].endswith('has ended.')

def is_encounter_end_code(line_fields):
    if not line_fields[0] == '33':
        return False
    return line_fields[3] in ('40000010', '40000003')

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
        elif event.startswith('00'):
            return 'battlelog'
        elif event.startswith('03'):
            return 'addlog'
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

        # Battlelog case
        elif entry['special_type'] == 'battlelog' and event.startswith(entry['special_line']):
            # Matching this format generically:
            # 00|2019-01-12T18:08:14.0000000-05:00|0839||The Realm of the Machinists will be sealed off in 15 seconds!|
            log_match = re.search('^00\|[^\|]*\|{}\|[^\|]*\|{}'.format(entry['logid'], entry['line']), event)
            if log_match:
                return True
            else:
                return False

        # Added combatant case
        elif entry['special_type'] == 'addlog' and event.startswith(entry['special_line']):
            # Matching this format generically:
            # 03|2019-01-12T18:07:46.6390000-05:00|40002269|Mustadio|0|46|dfa2|2ee0|0|0||dc029b852788abdd6056147620d2193c
            add_match = re.search('^03\|[^\|]*\|[^\|]*\|{}\|'.format(entry['name']), event)
            if add_match:
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
        event_time = parse_event_time(event)
        if event_time > state['last_sync_timestamp']:
             time_progress_delta = parse_event_time(event) - state['last_sync_timestamp']
             time_progress_seconds = time_progress_delta.seconds + time_progress_delta.microseconds / 1000000
        else:
             # battle logs have out of order parsed times because their
             # microseconds are zero.  Just pretend this is 0.
             time_progress_seconds = 0

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

def find_fights_in_file(file):
    e_starts = []
    encounter_start_staging = 0 # Staged to avoid spurious starts such as limit break usage
    e_ends = []
    encounter_in_progress = False
    current_instance = None
    encounter_sets = []
    for line in file:
        # Ignore log lines that aren't game status info
        if line[37:41] != '0839' and line[0:2] not in ['00', '01', '21', '22', '33']:
            continue
        line_fields = line.split('|')

        # Update current instance for returning alongside timestamps
        # Don't update if we're not entering a combat instance
        if is_instance_begun(line_fields):
            current_instance = line_fields[4].split(' has begun')[0]
            continue
        if is_instance_ended(line_fields):
            current_instance = None
            encounter_in_progress = False
            continue

        # We don't want to look for encounters outside a combat instance
        if current_instance is None:
            continue

        # Build start/end time groupings
        if is_zone_seal(line_fields):
            encounter_start_staging = [parse_event_time(line), line_fields[4].split(' will be sealed off')[0]]
            encounter_in_progress = True
            continue
        elif not encounter_in_progress and is_line_attack(line_fields):
            encounter_start_staging = [parse_event_time(line), current_instance]
            encounter_in_progress = True
            continue
        # If this fired regardless of an encounter being found, we would end up with phantom encounters.
        if is_line_end(line_fields) and encounter_in_progress:
            e_starts.append(encounter_start_staging)
            e_ends.append(parse_event_time(line))
            encounter_in_progress = False
            continue
        continue

    # Build a list of fight start/end pairs
    for i in range(0, len(e_ends)):
        # Ignore fights under 1 minute
        if (e_ends[i] - e_starts[i][0]).total_seconds() < 60:
            continue
        encounter_info = [stringify_time((e_starts[i][0])), stringify_time(e_ends[i]), str(e_starts[i][1])]
        encounter_sets.append(encounter_info)
    file.seek(0)
    return encounter_sets

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
        # If searching for encounters, divert and find start/end first3
        if args.search_fights:
            encounter_sets = find_fights_in_file(file)
            # If all we want to do is list encounters, stop here and give to the user.
            if args.search_fights < 0:
                return [f'{i + 1}. {" ".join(e_info)}' for i, e_info in enumerate(encounter_sets)]
            elif args.search_fights > len(encounter_sets):
                raise Exception('Selected fight index not in selected ACT log.')
        # Scan the file until the start timestamp

        for line in file:
            start_time = end_time = 0
            if args.search_fights:
                # Indexing is offset here to allow for 1-based indexing for the user.
                start_time = (encounter_sets[args.search_fights - 1][0])
                end_time = (encounter_sets[args.search_fights - 1][1])
            else:
                start_time = args.start
                end_time = args.end
            # Scan the file until the start timestamp
            if not file_started and line[14:26] != start_time:
                continue

            if line[14:26] == end_time:
                break

            # We're at the start of the encounter now.
            if not file_started:
                file_started = True
                state['last_sync_timestamp'] = parse_event_time(line)

            state = check_event(line, timelist, state)
    if not file_started:
        raise Exception('Fight start not found')


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
    if args.search_fights and args.search_fights == -1:
        return run_file(args, None)
    # Parse timeline file
    timelist = load_timeline(args.timeline)

    if args.file:
        run_file(args, timelist)

    elif args.report:
        print("Running analysis based on report. Caveats apply.")
        run_report(args, timelist)


def timeline_file(filename):
    """Defines the timeline file argument type"""

    data_path = Path(__file__).resolve().parent.parent / 'ui' / 'raidboss' / 'data'
    # Allow for just specifying the base filename, e.g. "o12s.txt" or "o12s"
    if not os.path.exists(filename):
        for root, dirs, files in os.walk(data_path):
          if filename in files:
            filename = os.path.join(root, filename)
            break
          if '%s.txt' % filename in files:
            filename = os.path.join(root, '%s.txt' % filename)
            break

    path = Path(filename)
    if not path.exists():
        raise argparse.ArgumentTypeError("Could not load timeline: %s" % filename)
    else:
        return path.open()


def timestamp_type(arg):
    """Defines the timestamp input format"""
    if arg and re.match(r'\d{2}:\d{2}:\d{2}\.\d{3}', arg) is None:
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
    parser.add_argument('-lf', '--search_fights', nargs='?', const=-1, type=int, help="Encounter in log to use, e.g. '1'. If no number is specified, returns a list of encounters.")

    # Filtering arguments
    parser.add_argument('-t', '--timeline', type=timeline_file, help="The filename of the timeline to test against, e.g. ultima_weapon_ultimate")

    args = parser.parse_args()

    # Check dependent args
    if args.search_fights and not args.file:
        raise parser.error("Automatic encounter listing requires an input file")

    if args.file and not ((args.start and args.end) or args.search_fights):
        raise parser.error("Log file input requires start and end timestamps")

    if args.report and not args.key:
        raise parser.error("FFlogs parsing requires an API key. Visit https://www.fflogs.com/profile and use the Public key")

    # Actually call the script
    if args.search_fights and args.search_fights == -1:
        print('\n'.join(main(args)))
    else:
        main(args)
