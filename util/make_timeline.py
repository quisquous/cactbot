import argparse
from datetime import datetime
import re

import fflogs
import timeline_aggregator


# def timestamp_type(arg):
#     """Defines the timestamp input format"""
#     if re.match(r'\d{2}:\d{2}:\d{2}\.\d{3}', arg) is None:
#         raise argparse.ArgumentTypeError(
#             "Invalid timestamp format. Use the format 12:34:56.789")
#     return arg


def parse_time(timestamp):
    """Parses a timestamp into a datetime object"""
    return datetime.strptime(timestamp, '%Y-%m-%dT%H:%M:%S')


def parse_line_time(line):
    """Parses the line's timestamp into a datetime object"""
    time = parse_time(line[3:22])
    time = time.replace(microsecond=int(line[23:29]))
    return time

def is_line_start(line_fields, started):
    # FIXME: May need localization?
    if (line_fields[4].endswith('sealed off in 15 seconds!')):
        return True
    if line_fields[0] == '36' and line_fields[2] == '0000' and started == False:
        return True
    return False

def is_line_end(line_fields):
    # FIXME: May need localization?
    if line_fields[4].endswith('no longer sealed!') or line_fields[4] == 'The limit gauge resets!' or line_fields[4].endswith('has ended.'):
        return True
    if line_fields[0] == '33'and (line_fields[3] == '40000010' or line_fields[3] == '40000003'):
        return True
    return False

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
    # Environment special case
    enemies[-1] = ''

    # Real enemies
    for enemy in report_data['enemies']:
        enemies[enemy['id']] = enemy['name']

    # Get the actual event list for the single fight
    options = {
        'api_key': args.key,
        'start': start_time,
        'end': end_time,
        'filter': 'source.disposition="enemy" and type="cast"',
        'translate': 'true',
    }
    event_data = fflogs.api('events', args.report, 'www', options)

    entries = []

    # Actually make the entry dicts
    for event in event_data['events']:
        if 'sourceID' not in event:
            event['sourceID'] = event['source']['id']

        entry = {
            'time': datetime.fromtimestamp((report_start_time + event['timestamp']) / 1000),
            'combatant': enemies[event['sourceID']],
            'ability_id': hex(event['ability']['guid'])[2:].upper(),
            'ability_name': event['ability']['name'],
        }

        entries.append(entry)

    return entries, datetime.fromtimestamp((report_start_time + start_time) / 1000)


def parse_file(args):
    """Reads a file specified by arguments, and returns an entry list"""

    entries = []
    started = False
    encounter_sets = []
    with args.file as file:
        # If searching for encounters, divert and find start/end first
        if args.search_fights:
            encounter_sets = find_fights_in_file(file)
            if args.search_fights[0] < 0:
                for j in range(0, len(encounter_sets)):
                    encounter_sets[j] = str(j) + '. ' + (" ").join(encounter_sets[j])
                return encounter_sets
        # Scan the file until the start timestamp
        for line in file:
            start_time = end_time = 0
            if args.search_fights:
                start_time = (encounter_sets[args.search_fights[0]][0])
                end_time = (encounter_sets[args.search_fights[0]][1])
            else:
                start_time = args.start
                end_time = args.end
            if not started and not (line[14:26] == start_time or line[14:29] == start_time):
                continue

            if line[14:26] == end_time or line[14:29] == end_time:
                break

            # We're at the start of the encounter now.
            if not started:
                started = True
                last_ability_time = parse_line_time(line)

            # We're looking for enemy casts
            # These lines will start with 21 or 22, and have an NPC ID (400#####)
            # If this isn't one, skip the line
            if not (line[0:2] == '21' or line[0:2] == '22') or not line[37:40] == '400':
                continue

            # At this point, we have a combat line for the timeline.
            line_fields = line.split('|')
            entry = {
                'time': parse_line_time(line),
                'combatant': line_fields[3],
                'ability_id': line_fields[4],
                'ability_name': line_fields[5],
            }

            entries.append(entry)

    if not started:
        raise Exception('Fight start not found')

    return entries, last_ability_time

def find_fights_in_file(file):
    e_starts = []
    encounter_start_staging = 0 # Staged to avoid spurious starts such as limit break usage
    e_ends = []
    encounter_in_progress = False
    current_instance = "none"
    encounter_sets = []
    for line in file:
        # Ignore log lines that aren't game status info
        if not (line[37:41] == '0839') and not (line[0:2]in ['00','01','33','36']):
            continue
        line_fields = line.split('|')

        # Update current instance for returning alongside timestamps
        # Don't update if we're not entering a combat instance
        if line_fields[0] == '00' and line_fields[4].endswith('has begun.'):
            current_instance = line_fields[4].split(' has begun')[0]
            continue
        if line_fields[0] == '00' and line_fields[4].endswith('has ended.'):
            current_instance = None
            encounter_in_progress = False
            continue
        
        # We don't want to look for encounters outside a combat instance
        if current_instance == None:
            continue

        # Build start/end time groupings
        if is_line_start(line_fields, encounter_in_progress):
            # This nested IF is messy, but it feels like the clearest way to express this
            if line_fields[4].endswith('sealed off in 15 seconds!'):
                encounter_start_staging = [parse_line_time(line), line_fields[4].split(' will be sealed off')[0]]
            else:
                encounter_start_staging = [parse_line_time(line), current_instance]
            encounter_in_progress = True
            continue
        # If this fired regardless of an encounter being found, we would end up with phantom encounters.
        if is_line_end(line_fields) and encounter_in_progress:
            e_starts.append(encounter_start_staging)
            e_ends.append(parse_line_time(line))
            encounter_in_progress = False
            continue
        continue

    # Build a list of fight start/end pairs
    for i in range(0, len(e_ends)):
        # Ignore fights under 1 minute
        if (e_ends[i] - e_starts[i][0]).total_seconds() < 60:
            continue
        encounter_info = [str((e_starts[i][0]).time()), str(e_ends[i].time()), str(e_starts[i][1])]
        encounter_sets.append(encounter_info)
    file.seek(0)
    return encounter_sets

def main(args):
    timeline_position = 0
    last_ability_time = 0

    # ACT log doesn't include friendly/enemy information per-line, so this is a set of default friendly npcs to filter
    # https://xivapi.com/Pet?pretty=true
    npc_combatants = [
        'Eos',
        'Selene',
        'Garuda-Egi',
        'Titan-Egi',
        'Ifrit-Egi',
        'Emerald Carbuncle',
        'Topaz Carbuncle',
        'Ruby Carbuncle',
        'Moonstone Carbuncle',
        'Rook Autoturret',
        'Bishop Autoturret',
        'Demi-Bahamut',
        'Demi-Phoenix',
        'Earthly Star',
        'Seraph',
        'Automaton Queen',
        'Bunshin',
        'Esteem',
        'Alphinaud',
        'Alisaie',
        'Y\'shtola',
        'Ryne',
        'Minfilia',
        'Thancred',
        'Urianger',
        ''
    ]

    # Format the phase timings
    phases = {}
    for phase in args.phase:
        ability, time = phase.split(':')
        phases[ability] = float(time)

    # Get the entry list or return fight list
    if args.search_fights and args.search_fights[0] == -1:
        return parse_file(args)
    elif args.report:
        entries, start_time = parse_report(args)
    elif args.file:
        entries, start_time = parse_file(args)

    last_ability_time = start_time
    last_entry = {'time': 0, 'ability_id': ''}

    output = []
    output.append('0 "Start"')

    for entry in entries:
        # First up, check if it's an ignored entry
        # Ignore autos, probably need a better rule than this
        if entry['ability_name'] == 'Attack':
            continue

        # Ignore abilities by NPC allies
        if entry['combatant'] in npc_combatants:
            continue

        # Ignore lines by arguments
        if (entry['ability_name'] in args.ignore_ability or
                entry['ability_id'] in args.ignore_id or
                entry['combatant'] in args.ignore_combatant):
            continue

        # Ignore aoe spam
        if entry['time'] == last_entry['time'] and entry['ability_id'] == last_entry['ability_id']:
            continue

        # Find out how long it's been since our last ability
        line_time = entry['time']
        last_time_diff = line_time - last_ability_time
        last_time_diff_sec = last_time_diff.seconds
        last_time_diff_us = last_time_diff.microseconds
        drift = False

        # Find the difference to the 0.1 second
        last_time_diff_tenthsec = int(last_time_diff_us / 100000) / 10

        # Adjust other diffs
        last_time_diff_sec += last_time_diff_tenthsec
        last_time_diff_us %= 100000

        # Round up to the tenth of second
        if last_time_diff_us > 60000:
            last_time_diff_sec += .1

        # Round up with a note about exceptional drift
        elif last_time_diff_us > 50000:
            last_time_diff_sec += .1
            drift = -100000 + last_time_diff_us

        # Round down with a note about exceptional drift
        elif last_time_diff_us > 40000:
            drift = last_time_diff_us

        # If <20ms then there's no need to adjust sec or drift
        else:
            pass

        # Set the time, possibly adjusting to specified phase
        if entry['ability_id'] not in phases:
            timeline_position += last_time_diff_sec
        else:
            timeline_position = phases[entry['ability_id']]
            del phases[entry['ability_id']]

        # Update the last ability time
        last_ability_time = line_time
        entry['position'] = timeline_position

        # Write the line
        output_entry = '{position:.1f} "{ability_name}" sync /:{combatant}:{ability_id}:/'.format(**entry)

        output.append(output_entry.encode('ascii', 'ignore').decode('utf8', 'ignore'))

        # Save the entry til the next line for filtering
        last_entry = entry
    return output




if __name__ == "__main__":
    # Set up all of the arguments
    example_usage = """
    example:
        make_timeline.py -f "%APPDATA%\\Advanced Combat Tracker\\FFXIVLogs\\Network_20180206.log" -s 12:30:45.156 -e 12:43:51.395 -ia Attack Explosion "Vacuum Claw" -ic "Aratama Soul"

        Scans Network_20180206.log, starts the encounter at 12:30:45.156, and crawls until
        12:43:51.395, collecting enemy ability usages along and printing them in a timeline format"""

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
    parser.add_argument('-s', '--start', help="Timestamp of the start, e.g. '12:34:56.789")
    parser.add_argument('-e', '--end', help="Timestamp of the end, e.g. '12:34:56.789")
    parser.add_argument('-lf', '--search_fights', nargs=1, type=int, help="Encounter whose start/stop times should be used, e.g. '1'. -1 to list all.")

    # Filtering arguments
    parser.add_argument('-ii', '--ignore-id', nargs='*', default=[], help="Ability IDs to ignore, e.g. 27EF")
    parser.add_argument('-ia', '--ignore-ability', nargs='*', default=[], help="Ability names to ignore, e.g. Attack")
    parser.add_argument('-ic', '--ignore-combatant', nargs='*', default=[], help="Combatant names to ignore, e.g. Aratama Soul")
    parser.add_argument('-p', '--phase', nargs='*', default=[], help="Abilities that indicate a new phase, and the time to jump to, e.g. 28EC:1000")

    # Aggregate arguments
    parser.add_argument('-at', '--aggregate-threshold', type=float, default=2.0, help="Threshold to average events from multiple reports by")

    args = parser.parse_args()

    # Check dependent args
    if args.search_fights and not args.file:
        raise parser.error("Automatic encounter listing requires an input file")
    if args.file and not ((args.start and args.end) or args.search_fights):
        raise parser.error("Log file input requires start and end timestamps")
    if args.report and not args.key:
        raise parser.error("FFlogs parsing requires an API key. Visit https://www.fflogs.com/accounts/changeuser and use the Public key")

    # Actually call the script
    if not args.report or len(args.report.split(',')) == 1:
        print('\n'.join(main(args)))
    else:
        timelines = []
        tmp_args = args
        for report in args.report.split(','):
            tmp_args.report = report
            timelines.append(main(tmp_args))
        timeline_aggregator = timeline_aggregator.TimelineAggregator(timelines)
        print('\n'.join(timeline_aggregator.aggregate(args.aggregate_threshold)))
