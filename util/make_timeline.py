import argparse
from datetime import datetime
import re

def timestamp_type(arg):
    """Defines the timestamp input format"""
    if re.match('\d{2}:\d{2}:\d{2}\.\d{3}', arg) is None:
        raise argparse.ArgumentTypeError
    return arg

def parse_time(timestamp):
    """Parses a timestamp into a datetime object"""
    return datetime.strptime(timestamp, '%Y-%m-%dT%H:%M:%S')

def parse_line_time(line):
    """Parses the line's timestamp into a datetime object"""
    time = parse_time(line[3:22])
    time = time.replace(microsecond=int(line[23:29]))
    return time

parser = argparse.ArgumentParser(description = "Creates a timeline from a logged encounter")
parser.add_argument('-f', '--file', required=True, help="The path of the log file")
parser.add_argument('-s', '--start', required=True, type=timestamp_type, help="Timestamp of the start, e.g. '12:34:56.789")
parser.add_argument('-e', '--end', required=True, type=timestamp_type, help="Timestamp of the end, e.g. '12:34:56.789")

args = parser.parse_args()

timeline_position = 0
last_ability_time = 0
last_entry = {'time': 0, 'ability_id': ''}
started = False
ignore_combatant = ['Eos', 'Selene', 'Garuda-Egi', 'Titan-Egi', 'Ifrit-Egi', 'Emerald Carbuncle', 'Ruby Carbuncle', 'Rook Autoturret', 'Bishop Autoturret', 'Demi-Bahamut', 'Earthly Star', '']

with open(args.file, encoding="utf8") as file:
    for line in file:
        # Scan the file until the start timestamp
        if not started and line[14:26] != args.start:
            continue

        if line[14:26] == args.end:
            break

        # We're at the start of the encounter now.
        if not started:
            started = True
            last_ability_time = parse_line_time(line)
            print('0 "Start"')

        # We're looking for enemy casts
        # These lines will start with 21 or 22, and have an NPC ID (400#####)
        # If this isn't one, skip the line
        if not (line[0:2] == '21' or line[0:2] == '22') or not line[37:40] == '400':
            continue

        # At this point, we have a combat line for the timeline. Set up the fields we'll use
        line_fields = line.split('|')
        entry = {
            'time': parse_line_time(line),
            'combatant': line_fields[3],
            'ability_id': line_fields[4],
            'ability_name': line_fields[5],
        }

        # Ignore autos, probably need a better rule than this
        if entry['ability_name'] == 'Attack':
            continue

        # Ignore abilities by NPC allies
        if entry['combatant'] in ignore_combatant:
            continue

        # Find out how long it's been since our last ability
        line_time = entry['time']
        last_time_diff = line_time - last_ability_time
        last_time_diff_sec = last_time_diff.seconds
        last_time_diff_us = last_time_diff.microseconds
        drift = False

        # Ignore aoe spam
        if entry['time'] == last_entry['time'] and entry['ability_id'] == last_entry['ability_id']:
            continue

        # Round up to the second
        if last_time_diff_us > 800000:
            last_time_diff_sec += 1

        # Round up with a note about exceptional drift
        elif last_time_diff_us > 500000:
            last_time_diff_sec += 1
            drift = -1000000 + last_time_diff_us

        # Round down with a note about exceptional drift
        elif last_time_diff_us > 200000:
            drift = last_time_diff_us
        
        # If <300ms then there's no need to adjust sec or drift
        else:
            pass

        # Update the last ability time
        last_ability_time = line_time
        timeline_position += last_time_diff_sec
        entry['position'] = timeline_position

        # Write the line
        output_entry = '{position} "{ability_name}" sync /:{combatant}:{ability_id}:/'.format(**entry)
        if drift:
            output_entry += ' # drift {}'.format(drift/1000000)

        print(output_entry)

        # Save the entry til the next line for filtering
        last_entry = entry
